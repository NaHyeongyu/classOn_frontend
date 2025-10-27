import { useCallback, useEffect, useMemo, useState } from "react";
import {
  listFeedbacksPaged,
  updateFeedbackStatus,
  type AdminFeedbackRow,
} from "@/api/adminFeedback";
import { formatKoreanDateTime } from "@/lib/format";

export type TypeFilter = "" | "BUG" | "FEATURE";
export type StatusFilter = "" | "NEW" | "ACK" | "CLOSED";

type UseAdminFeedbacksPageOptions = {
  toastSuccess?: (message: string) => void;
  toastError?: (message: string) => void;
};

type AppliedFilters = {
  type: TypeFilter;
  status: StatusFilter;
  q: string;
  from: string;
  to: string;
};

const DEFAULT_ERROR_MESSAGE = "피드백을 불러오지 못했습니다.";

export function useAdminFeedbacksPage(
  options?: UseAdminFeedbacksPageOptions,
) {
  const { toastSuccess, toastError } = options ?? {};

  const [rows, setRows] = useState<AdminFeedbackRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [typeInput, setTypeInput] = useState<TypeFilter>("");
  const [statusInput, setStatusInput] = useState<StatusFilter>("");
  const [qInput, setQInput] = useState("");

  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>({
    type: "",
    status: "",
    q: "",
    from: "",
    to: "",
  });

  const loadFeedbacks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await listFeedbacksPaged({
        page,
        size,
        type: appliedFilters.type || undefined,
        status: appliedFilters.status || undefined,
        q: appliedFilters.q || undefined,
        from: appliedFilters.from || undefined,
        to: appliedFilters.to || undefined,
      });

      setRows(response.content ?? []);
      setTotalPages(response.totalPages ?? 0);
      setTotalElements(
        response.totalElements ??
          response.content?.length ??
          0,
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : DEFAULT_ERROR_MESSAGE;
      setError(message);
      toastError?.(message);
    } finally {
      setLoading(false);
    }
  }, [appliedFilters, page, size, toastError]);

  useEffect(() => {
    void loadFeedbacks();
  }, [loadFeedbacks]);

  const handleApplyFilters = useCallback(() => {
    setAppliedFilters({
      type: typeInput,
      status: statusInput,
      q: qInput.trim(),
      from,
      to,
    });
    setPage(0);
  }, [from, qInput, statusInput, to, typeInput]);

  const handleChangeSize = useCallback((nextSize: number) => {
    setSize(nextSize);
    setPage(0);
  }, []);

  const handleChangePage = useCallback((nextPage: number) => {
    setPage(Math.max(0, nextPage));
  }, []);

  const handleUpdateStatus = useCallback(
    async (id: number, nextStatus: "NEW" | "ACK" | "CLOSED") => {
      let prevStatus: "NEW" | "ACK" | "CLOSED" | null = null;
      let hasTarget = false;
      setRows((current) =>
        current.map((row) => {
          if (row.id !== id) return row;
          hasTarget = true;
          prevStatus = row.status;
          if (row.status === nextStatus) {
            return row;
          }
          return { ...row, status: nextStatus };
        }),
      );

      if (!hasTarget || prevStatus === nextStatus) return;

      try {
        await updateFeedbackStatus(id, nextStatus);
        toastSuccess?.("상태를 업데이트했습니다.");
      } catch (err) {
        const statusToRestore = prevStatus;
        setRows((current) =>
          current.map((row) =>
            row.id === id && statusToRestore
              ? { ...row, status: statusToRestore }
              : row,
          ),
        );
        const message =
          err instanceof Error
            ? err.message
            : "상태 업데이트에 실패했습니다.";
        toastError?.(message);
      }
    },
    [toastError, toastSuccess],
  );

  const headerSubtitle = useMemo(() => {
    if (rows.length === 0) return "표시할 데이터가 없습니다.";
    const first = rows[0]?.createdAt;
    const last = rows[rows.length - 1]?.createdAt;
    if (!first || !last)
      return `${rows.length.toLocaleString("ko-KR")}건 표시 중`;
    return `${formatKoreanDateTime(first)} ~ ${formatKoreanDateTime(last)}`;
  }, [rows]);

  const pageInfo = useMemo(() => {
    const currentPage = totalPages === 0 ? 0 : page + 1;
    return `페이지 ${currentPage} / ${Math.max(
      1,
      totalPages,
    )} • 총 ${totalElements.toLocaleString("ko-KR")}건`;
  }, [page, totalElements, totalPages]);

  return {
    rows,
    loading,
    error,
    page,
    size,
    totalPages,
    totalElements,
    from,
    to,
    typeInput,
    statusInput,
    qInput,
    setFrom,
    setTo,
    setTypeInput,
    setStatusInput,
    setQInput,
    headerSubtitle,
    pageInfo,
    handleApplyFilters,
    handleChangeSize,
    handleChangePage,
    handleUpdateStatus,
  };
}
