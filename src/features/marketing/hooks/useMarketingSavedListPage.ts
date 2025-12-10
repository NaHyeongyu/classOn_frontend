
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listSaved, type SavedPost } from "@/api/marketingSaved";
import { useToast } from "@/components/common/Toast";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import {
  getSavedMarketingPosts,
  clearSavedMarketingPosts,
  type SavedMarketing,
} from "@/lib/savedMarketing";
import { toErrorMessage, normalizeYMDInput } from "@/features/marketing/utils";

export type MarketingSavedListState = {
  rows: SavedMarketing[];
  page: number;
  totalPages: number;
  platform: SavedPost["platform"] | "";
  from: string;
  to: string;
  query: string;
  error: string | null;
  confirmDialog: React.ReactNode;
};

export type MarketingSavedListHandlers = {
  updatePlatform: (value: SavedPost["platform"] | "") => void;
  updateFrom: (value: string) => void;
  updateTo: (value: string) => void;
  updateQuery: (value: string) => void;
  resetFilters: () => void;
  goToPage: (page: number) => void;
  goPrevPage: () => void;
  goNextPage: () => void;
  openDetail: (id: string) => void;
  clearAll: () => Promise<void>;
};

export type UseMarketingSavedListPageReturn = {
  state: MarketingSavedListState;
  handlers: MarketingSavedListHandlers;
};

function toLocalSaved(post: SavedPost): SavedMarketing {
  return {
    id: String(post.id),
    createdAt: post.createdAt ? new Date(post.createdAt).getTime() : Date.now(),
    platform: post.platform,
    speechStyle: post.speechStyle,
    tone: post.tone ?? undefined,
    title: post.title ?? undefined,
    body: post.body,
    tags: Array.isArray(post.tags) ? post.tags : [],
  };
}

export function useMarketingSavedListPage(): UseMarketingSavedListPageReturn {
  const [rows, setRows] = useState<SavedMarketing[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [platform, setPlatform] = useState<SavedPost["platform"] | "">("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { warning } = useToast();
  const { confirm: confirmClear, dialog: confirmDialog } = useConfirmDialog({
    confirmLabel: "삭제",
    cancelLabel: "취소",
    tone: "danger",
  });

  const localFallback = useMemo(() => getSavedMarketingPosts(), []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setError(null);
        const res = await listSaved({
          page,
          size: 20,
          platform: platform || undefined,
          from: from || undefined,
          to: to || undefined,
          q: query || undefined,
        });
        if (cancelled) return;
        const remoteRows = (res.content ?? []).map(toLocalSaved);
        // 로컬 저장분을 합쳐 서버 오류가 없어도 오프라인 저장이 보이도록 한다.
        const merged = [
          ...remoteRows,
          ...localFallback.filter((item) => !remoteRows.some((r) => r.id === item.id)),
        ];
        setRows(merged);
        setTotalPages(res.totalPages ?? 1);
      } catch (err) {
        if (cancelled) return;
        setRows(localFallback);
        setTotalPages(1);
        setError(toErrorMessage(err, "서버에서 저장 내역을 불러오지 못했습니다. 로컬 데이터를 표시합니다."));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [page, platform, from, to, query, localFallback]);

  const updatePlatform = (value: SavedPost["platform"] | "") => {
    setPage(0);
    setPlatform(value);
  };

  const updateFrom = (value: string) => {
    const normalized = normalizeYMDInput(value);
    setPage(0);
    setFrom(normalized);
  };

  const updateTo = (value: string) => {
    const normalized = normalizeYMDInput(value);
    setPage(0);
    setTo(normalized);
  };

  const updateQuery = (value: string) => {
    setQuery(value);
  };

  const resetFilters = () => {
    setPlatform("");
    setFrom("");
    setTo("");
    setQuery("");
    setPage(0);
  };

  const goToPage = (next: number) => {
    setPage((prev) => {
      const target = Math.max(0, Math.min(next, Math.max(0, totalPages - 1)));
      return target === prev ? prev : target;
    });
  };

  const goPrevPage = () => setPage((prev) => Math.max(0, prev - 1));
  const goNextPage = () => setPage((prev) => Math.min(totalPages - 1, prev + 1));

  const openDetail = (id: string) => {
    navigate(`/marketing/saved/${id}`);
  };

  const clearAll = async () => {
    const confirmed = await confirmClear({
      title: "저장 내역을 모두 삭제할까요?",
      message: "로컬에 저장된 마케팅 캡션이 모두 삭제됩니다. 되돌릴 수 없습니다.",
    });
    if (!confirmed) return;
    clearSavedMarketingPosts();
    setRows([]);
    warning("저장 내역을 모두 삭제했습니다.");
  };

  return {
    state: {
      rows,
      page,
      totalPages,
      platform,
      from,
      to,
      query,
      error,
      confirmDialog,
    },
    handlers: {
      updatePlatform,
      updateFrom,
      updateTo,
      updateQuery,
      resetFilters,
      goToPage,
      goPrevPage,
      goNextPage,
      openDetail,
      clearAll,
    },
  };
}
