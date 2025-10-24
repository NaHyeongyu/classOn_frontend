
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/components/common/Toast";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import { getSaved } from "@/api/marketingSaved";
import {
  getSavedMarketingPosts,
  removeSavedMarketingPost,
  type SavedMarketing,
  SAVED_MARKETING_KEY,
} from "@/lib/savedMarketing";
import { formatKoreanDateTime } from "@/lib/format";

function cacheSavedMarketing(post: SavedMarketing) {
  try {
    const list = getSavedMarketingPosts();
    if (list.find((item) => item.id === post.id)) return;
    const next = [post, ...list].slice(0, 50);
    localStorage.setItem(SAVED_MARKETING_KEY, JSON.stringify(next));
  } catch {
    /* ignore storage errors */
  }
}

function mapRemoteSaved(remote: Awaited<ReturnType<typeof getSaved>>): SavedMarketing {
  return {
    id: String(remote.id),
    createdAt: remote.createdAt ? new Date(remote.createdAt).getTime() : Date.now(),
    platform: remote.platform,
    speechStyle: remote.speechStyle,
    tone: remote.tone ?? undefined,
    title: remote.title ?? undefined,
    body: remote.body,
    tags: Array.isArray(remote.tags) ? remote.tags : [],
  };
}

export function useMarketingSavedDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error: showError } = useToast();
  const { confirm: confirmRemove, dialog: confirmRemoveDialog } = useConfirmDialog({
    confirmLabel: "삭제",
    cancelLabel: "취소",
    tone: "danger",
  });

  const localRecord = useMemo(() => {
    if (!id) return null;
    return getSavedMarketingPosts().find((item) => item.id === id) ?? null;
  }, [id]);

  const [record, setRecord] = useState<SavedMarketing | null>(localRecord);

  useEffect(() => {
    if (record || !id || !/^\d+$/.test(id)) return;
    let cancelled = false;
    (async () => {
      try {
        const remote = await getSaved(Number(id));
        if (cancelled) return;
        const mapped = mapRemoteSaved(remote);
        cacheSavedMarketing(mapped);
        setRecord(mapped);
      } catch {
        /* ignore fetch errors */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, record]);

  const createdAtLabel = useMemo(() => {
    if (!record) return null;
    const formatted = formatKoreanDateTime(record.createdAt, { includeWeekday: true });
    if (formatted === "—") {
      try {
        return new Date(record.createdAt).toLocaleString("ko-KR", { hour12: false });
      } catch {
        return null;
      }
    }
    return formatted;
  }, [record]);

  const tags = record?.tags.join(" ") ?? "";

  const handleCopy = () => {
    if (!record) return;
    const text = [record.body, tags].filter(Boolean).join("\n\n");
    navigator.clipboard
      ?.writeText(text)
      .then(() => success("복사되었습니다."))
      .catch(() => showError("복사에 실패했습니다."));
  };

  const handleDelete = async () => {
    if (!record) return;
    const confirmed = await confirmRemove({
      title: "이 항목을 삭제할까요?",
      message: "저장된 캡션이 삭제되며 되돌릴 수 없습니다.",
    });
    if (!confirmed) return;
    removeSavedMarketingPost(record.id);
    success("삭제했습니다.");
    navigate("/marketing/saved");
  };

  const handleBack = () => navigate("/marketing/saved");

  return {
    state: {
      record,
      createdAtLabel,
      tags,
      confirmDialog: confirmRemoveDialog,
    },
    handlers: {
      handleCopy,
      handleDelete,
      handleBack,
    },
  };
}
