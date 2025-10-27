import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getApiLogsPaged } from "@/api/admin";

export type ErrorFilter = "all" | "errors";

export type AdminApiLogRow = {
  id?: number | string | null;
  createdAt: string;
  method?: string | null;
  path?: string | null;
  status?: number | null;
  ip?: string | null;
  userId?: string | number | null;
  [key: string]: unknown;
};

type ToastErrorFn = (message: string) => void;

type UseAdminApiLogsPageOptions = {
  toastError: ToastErrorFn;
};

export function useAdminApiLogsPage({ toastError }: UseAdminApiLogsPageOptions) {
  const [rows, setRows] = useState<AdminApiLogRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [from, setFrom] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().slice(0, 10);
  });
  const [to, setTo] = useState(() => new Date().toISOString().slice(0, 10));
  const [pathInput, setPathInput] = useState("");
  const [pathQuery, setPathQuery] = useState("");
  const [errorsFilterInput, setErrorsFilterInput] =
    useState<ErrorFilter>("all");
  const [errorsFilter, setErrorsFilter] = useState<ErrorFilter>("all");

  const sizeRef = useRef(size);
  const pathQueryRef = useRef(pathQuery);
  const errorsFilterRef = useRef(errorsFilter);

  useEffect(() => {
    sizeRef.current = size;
  }, [size]);

  useEffect(() => {
    pathQueryRef.current = pathQuery;
  }, [pathQuery]);

  useEffect(() => {
    errorsFilterRef.current = errorsFilter;
  }, [errorsFilter]);

  const loadApiLogs = useCallback(
    async (
      pageToLoad: number,
      sizeToLoad: number,
      query: string,
      filter: ErrorFilter,
      range: { from: string; to: string },
    ) => {
      setLoading(true);
      setError(null);
      try {
        const res = await getApiLogsPaged({
          page: pageToLoad,
          size: sizeToLoad,
          q: query ? query : undefined,
          errorsOnly: filter === "errors",
          from: range.from,
          to: range.to,
        });
        const data = res as {
          content: AdminApiLogRow[];
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
            : "API 로그를 불러오지 못했습니다.";
        setError(message);
        toastError(message);
      } finally {
        setLoading(false);
      }
    },
    [toastError],
  );

  useEffect(() => {
    void loadApiLogs(
      0,
      sizeRef.current,
      pathQueryRef.current,
      errorsFilterRef.current,
      { from, to },
    );
  }, [from, to, loadApiLogs]);

  const handleApplyFilters = useCallback(() => {
    const nextQuery = pathInput.trim();
    setPathQuery(nextQuery);
    setErrorsFilter(errorsFilterInput);
    pathQueryRef.current = nextQuery;
    errorsFilterRef.current = errorsFilterInput;
    void loadApiLogs(0, sizeRef.current, nextQuery, errorsFilterInput, {
      from,
      to,
    });
  }, [errorsFilterInput, from, to, loadApiLogs, pathInput]);

  const handleChangePage = useCallback(
    (nextPage: number) => {
      if (nextPage < 0 || nextPage >= totalPages) return;
      void loadApiLogs(
        nextPage,
        sizeRef.current,
        pathQueryRef.current,
        errorsFilterRef.current,
        { from, to },
      );
    },
    [from, to, loadApiLogs, totalPages],
  );

  const handleChangeSize = useCallback(
    (nextSize: number) => {
      setSize(nextSize);
      sizeRef.current = nextSize;
      void loadApiLogs(
        0,
        nextSize,
        pathQueryRef.current,
        errorsFilterRef.current,
        { from, to },
      );
    },
    [from, to, loadApiLogs],
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
    pathInput,
    setPathInput,
    pathQuery,
    errorsFilterInput,
    setErrorsFilterInput,
    errorsFilter,
    rangeLabel,
    displayedRange,
    pageInfo,
    handleApplyFilters,
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
