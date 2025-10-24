import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { listLoginLogsPaged } from "@/api/admin";

type ToastErrorFn = (message: string) => void;

export type AdminLoginRow = Awaited<
  ReturnType<typeof listLoginLogsPaged>
> extends { content: infer C }
  ? C extends Array<infer R>
    ? R
    : never
  : never;

type UseAdminLoginsPageOptions = {
  toastError: ToastErrorFn;
};

export function useAdminLoginsPage({ toastError }: UseAdminLoginsPageOptions) {
  const [rows, setRows] = useState<AdminLoginRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const sizeRef = useRef(size);
  const queryRef = useRef(searchQuery);

  useEffect(() => {
    sizeRef.current = size;
  }, [size]);

  useEffect(() => {
    queryRef.current = searchQuery;
  }, [searchQuery]);

  const loadLogins = useCallback(
    async (pageToLoad: number, sizeToLoad: number, keyword: string) => {
      setLoading(true);
      setError(null);
      try {
        const res = await listLoginLogsPaged({
          page: pageToLoad,
          size: sizeToLoad,
          q: keyword ? keyword : undefined,
        });
        const data = res as {
          content: AdminLoginRow[];
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
            : "로그인 기록을 불러오지 못했습니다.";
        setError(message);
        toastError(message);
      } finally {
        setLoading(false);
      }
    },
    [toastError],
  );

  useEffect(() => {
    void loadLogins(0, sizeRef.current, queryRef.current);
  }, [loadLogins]);

  const handleSearch = useCallback(() => {
    const keyword = searchInput.trim();
    setSearchQuery(keyword);
    queryRef.current = keyword;
    void loadLogins(0, sizeRef.current, keyword);
  }, [loadLogins, searchInput]);

  const handleChangeSize = useCallback(
    (nextSize: number) => {
      setSize(nextSize);
      sizeRef.current = nextSize;
      void loadLogins(0, nextSize, queryRef.current);
    },
    [loadLogins],
  );

  const handleChangePage = useCallback(
    (nextPage: number) => {
      if (nextPage < 0 || nextPage >= totalPages) return;
      void loadLogins(nextPage, sizeRef.current, queryRef.current);
    },
    [loadLogins, totalPages],
  );

  const rangeLabel = useMemo(() => {
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
    searchInput,
    setSearchInput,
    searchQuery,
    handleSearch,
    handleChangeSize,
    handleChangePage,
    rangeLabel,
    pageInfo,
  };
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
