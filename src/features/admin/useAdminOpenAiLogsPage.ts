import { useCallback, useEffect, useMemo, useState } from "react";
import { getOpenAiLogsPaged } from "@/api/admin";
import { formatKoreanDateTime } from "@/lib/format";

export type SuccessFilter = "all" | "success" | "fail";

export type AdminOpenAiLogRow = {
  id?: number;
  createdAt: string;
  model?: string | null;
  tokens?: number | null;
  success: boolean;
  latencyMs?: number | null;
};

type UseAdminOpenAiLogsPageOptions = {
  toastError?: (message: string) => void;
};

type AppliedFilters = {
  model: string;
  success: SuccessFilter;
  from: string;
  to: string;
};

const DEFAULT_ERROR_MESSAGE = "OpenAI 로그를 불러오지 못했습니다.";

function defaultFromDate() {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  return date.toISOString().slice(0, 10);
}

function defaultToDate() {
  return new Date().toISOString().slice(0, 10);
}

export function useAdminOpenAiLogsPage(
  options?: UseAdminOpenAiLogsPageOptions,
) {
  const { toastError } = options ?? {};

  const initialRange = useMemo(
    () => ({
      from: defaultFromDate(),
      to: defaultToDate(),
    }),
    [],
  );

  const [rows, setRows] = useState<AdminOpenAiLogRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [from, setFrom] = useState(initialRange.from);
  const [to, setTo] = useState(initialRange.to);

  const [modelInput, setModelInput] = useState("");
  const [successFilterInput, setSuccessFilterInput] =
    useState<SuccessFilter>("all");

  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>({
    model: "",
    success: "all",
    from: initialRange.from,
    to: initialRange.to,
  });

  const loadOpenAiLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const successParam =
        appliedFilters.success === "all"
          ? undefined
          : appliedFilters.success === "success";
      const response = await getOpenAiLogsPaged({
        page,
        size,
        model: appliedFilters.model || undefined,
        success: successParam,
        from: appliedFilters.from,
        to: appliedFilters.to,
      });
      const data = response as unknown as {
        content?: AdminOpenAiLogRow[];
        page?: number;
        size?: number;
        totalPages?: number;
        totalElements?: number;
      };
      setRows(data.content ?? []);
      setTotalPages(data.totalPages ?? 0);
      setTotalElements(
        data.totalElements ?? data.content?.length ?? 0,
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
    void loadOpenAiLogs();
  }, [loadOpenAiLogs]);

  const handleApplyFilters = useCallback(() => {
    setAppliedFilters({
      model: modelInput.trim(),
      success: successFilterInput,
      from,
      to,
    });
    setPage(0);
  }, [from, modelInput, successFilterInput, to]);

  const handleChangeSize = useCallback((nextSize: number) => {
    setSize(nextSize);
    setPage(0);
  }, []);

  const handleChangePage = useCallback((nextPage: number) => {
    setPage(Math.max(0, nextPage));
  }, []);

  const rangeLabel = useMemo(() => `${from} ~ ${to}`, [from, to]);

  const displayedRange = useMemo(() => {
    if (rows.length === 0) return "표시할 데이터가 없습니다.";
    const first = rows[0]?.createdAt;
    const last = rows[rows.length - 1]?.createdAt;
    if (!first || !last)
      return `${rows.length.toLocaleString("ko-KR")}건 표시 중`;
    return `${formatDateTime(first)} ~ ${formatDateTime(last)}`;
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
    modelInput,
    successFilterInput,
    modelQuery: appliedFilters.model,
    successFilter: appliedFilters.success,
    rangeLabel,
    displayedRange,
    pageInfo,
    setFrom,
    setTo,
    setModelInput,
    setSuccessFilterInput,
    handleApplyFilters,
    handleChangeSize,
    handleChangePage,
  };
}

function formatDateTime(value: string) {
  const formatted = formatKoreanDateTime(value, { includeWeekday: true });
  return formatted === "—" ? value : formatted;
}
