import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getPaymentsPaged } from "@/api/admin";

type ToastErrorFn = (message: string) => void;

export type AdminPaymentRow = Awaited<
  ReturnType<typeof getPaymentsPaged>
> extends { content: infer C }
  ? C extends Array<infer R>
    ? R
    : never
  : never;

type UseAdminPaymentsPageOptions = {
  toastError: ToastErrorFn;
};

export function useAdminPaymentsPage({
  toastError,
}: UseAdminPaymentsPageOptions) {
  const [rows, setRows] = useState<AdminPaymentRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [from, setFrom] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().slice(0, 10);
  });
  const [to, setTo] = useState(() => new Date().toISOString().slice(0, 10));

  const sizeRef = useRef(size);

  useEffect(() => {
    sizeRef.current = size;
  }, [size]);

  const loadPayments = useCallback(
    async (
      pageToLoad: number,
      sizeToLoad: number,
      range: { from: string; to: string },
    ) => {
      setLoading(true);
      setError(null);
      try {
        const res = await getPaymentsPaged({
          page: pageToLoad,
          size: sizeToLoad,
          from: range.from,
          to: range.to,
        });
        const data = res as {
          content: AdminPaymentRow[];
          page: number;
          size: number;
          totalPages: number;
          totalElements: number;
        };
        setRows(data.content || []);
        setPage(data.page);
        setSize(data.size);
        setTotalPages(data.totalPages);
        setTotalElements(
          data.totalElements ?? data.content?.length ?? 0,
        );
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "결제 기록을 불러오지 못했습니다.";
        setError(message);
        toastError(message);
      } finally {
        setLoading(false);
      }
    },
    [toastError],
  );

  useEffect(() => {
    void loadPayments(0, sizeRef.current, { from, to });
  }, [from, to, loadPayments]);

  const handleApplyRange = useCallback(() => {
    void loadPayments(0, sizeRef.current, { from, to });
  }, [from, to, loadPayments]);

  const handleChangePage = useCallback(
    (nextPage: number) => {
      if (nextPage < 0 || nextPage >= totalPages) return;
      void loadPayments(nextPage, sizeRef.current, { from, to });
    },
    [from, to, loadPayments, totalPages],
  );

  const handleChangeSize = useCallback(
    (nextSize: number) => {
      setSize(nextSize);
      sizeRef.current = nextSize;
      void loadPayments(0, nextSize, { from, to });
    },
    [from, to, loadPayments],
  );

  const rangeLabel = useMemo(() => `${from} ~ ${to}`, [from, to]);

  const displayedRange = useMemo(() => {
    if (rows.length === 0) return "표시할 데이터가 없습니다.";
    const first = rows[0]?.createdAt;
    const last = rows[rows.length - 1]?.createdAt;
    if (!first || !last) {
      return `${rows.length.toLocaleString("ko-KR")}건 표시 중`;
    }
    return `${formatDateTime(first)} ~ ${formatDateTime(last)}`;
  }, [rows]);

  const pageInfo = useMemo(() => {
    const totalPageSafe = Math.max(1, totalPages);
    return `페이지 ${totalPages === 0 ? 0 : page + 1} / ${totalPageSafe} • 총 ${totalElements.toLocaleString(
      "ko-KR",
    )}건`;
  }, [page, totalElements, totalPages]);

  const rangeSummary = useMemo(() => {
    if (rows.length === 0) return null;
    const first = rows[0];
    const last = rows[rows.length - 1];
    if (!first?.createdAt || !last?.createdAt) return null;
    return `${formatDateTime(first.createdAt)} ~ ${formatDateTime(last.createdAt)}`;
  }, [rows]);

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
    setFrom,
    setTo,
    rangeLabel,
    displayedRange,
    rangeSummary,
    pageInfo,
    handleApplyRange,
    handleChangeSize,
    handleChangePage,
  };
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
