import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { Page, SectionCard, GhostButtonSmall, TitleH3, PageHeader } from "@/components/common/UI";
import {
  getSavedMarketingPosts,
  removeSavedMarketingPost,
  type SavedMarketing,
  SAVED_MARKETING_KEY,
} from "@/lib/savedMarketing";
import { getSaved } from "@/api/marketingSaved";
import { formatKoreanDateTime } from "@/lib/format";
import { useToast } from "@/components/common/Toast";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";

export default function MarketingSavedDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error: showError } = useToast();
  const { confirm: confirmRemove, dialog: confirmRemoveDialog } = useConfirmDialog({
    confirmLabel: "삭제",
    cancelLabel: "취소",
    tone: "danger",
  });

  const localRecord = useMemo(() => {
    const list = getSavedMarketingPosts();
    return list.find((item) => item.id === id) ?? null;
  }, [id]);

  const [record, setRecord] = useState<SavedMarketing | null>(localRecord);

  async function handleDelete() {
    if (!record) return;
    const confirmed = await confirmRemove({
      title: "이 항목을 삭제할까요?",
      message: "저장된 캡션이 삭제되며 되돌릴 수 없습니다.",
    });
    if (!confirmed) return;
    removeSavedMarketingPost(record.id);
    success("삭제했습니다.");
    navigate("/marketing/saved");
  }

  useEffect(() => {
    if (record || !id || !/^\d+$/.test(id)) return;
    let cancelled = false;
    (async () => {
      try {
        const remote = await getSaved(Number(id));
        if (cancelled) return;
        const mapped: SavedMarketing = {
          id: String(remote.id),
          createdAt: remote.createdAt ? new Date(remote.createdAt).getTime() : Date.now(),
          platform: remote.platform,
          speechStyle: remote.speechStyle,
          tone: remote.tone ?? undefined,
          title: remote.title ?? undefined,
          body: remote.body,
          tags: Array.isArray(remote.tags) ? remote.tags : [],
        };
        cacheSavedMarketing(mapped);
        setRecord(mapped);
      } catch {
        // ignore network errors; user will see fallback state
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, record]);

  if (!record) {
    return (
      <Page>
        <PageHeader>
          <div>
            <h2>저장 내역 상세</h2>
            <p>항목을 찾을 수 없습니다.</p>
          </div>
          <GhostButtonSmall as="button" onClick={() => navigate("/marketing/saved")}>
            목록으로
          </GhostButtonSmall>
        </PageHeader>
      </Page>
    );
  }

  const tags = record.tags.join(" ");
  const createdAtRaw = formatKoreanDateTime(record.createdAt, { includeWeekday: true });
  const createdAtLabel = createdAtRaw === "—"
    ? new Date(record.createdAt).toLocaleString("ko-KR", { hour12: false })
    : createdAtRaw;

  return (
    <Page>
      {confirmRemoveDialog}
      <PageHeader>
        <div>
          <h2>저장 내역 상세</h2>
          <p>
            {platformLabel(record.platform)} · {createdAtLabel}
          </p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <GhostButtonSmall as="button" onClick={() => navigate("/marketing/saved")}>목록</GhostButtonSmall>
          <GhostButtonSmall
            as="button"
            onClick={() => {
              const text = [record.body, tags].filter(Boolean).join("\n\n");
              navigator.clipboard
                ?.writeText(text)
                .then(() => success("복사되었습니다."))
                .catch(() => showError("복사에 실패했습니다."));
            }}
          >
            복사
          </GhostButtonSmall>
          <GhostButtonSmall
            as="button"
            data-variant="danger"
            onClick={() => void handleDelete()}
          >
            삭제
          </GhostButtonSmall>
        </div>
      </PageHeader>

      <SplitGrid>
        <SectionCard>
          <TitleH3>저장한 캡션</TitleH3>
          <MetaRow>
            <Chip>{platformLabel(record.platform)}</Chip>
            <Chip>{createdAtLabel}</Chip>
          </MetaRow>
          <Label>본문</Label>
          <Pre aria-label="body">{record.body}</Pre>
          {tags ? (
            <>
              <Label>태그</Label>
              <Block aria-label="tags">{tags}</Block>
            </>
          ) : null}
        </SectionCard>

        <SectionCard>
          <TitleH3>모바일 예시</TitleH3>
          <IGPreviewWrap>
            <IGPhone>
              <IGTopBar>
                <IGAvatar />
                <IGUser>our_academy</IGUser>
              </IGTopBar>
              <IGImage role="img" aria-label="이미지 예시">
                <span>미리보기</span>
              </IGImage>
              <IGText>
                <strong>our_academy</strong> {record.body}
                {tags ? (
                  <>
                    <br />
                    <span className="tags">{tags}</span>
                  </>
                ) : null}
              </IGText>
            </IGPhone>
          </IGPreviewWrap>
        </SectionCard>
      </SplitGrid>
    </Page>
  );
}

function platformLabel(platform: SavedMarketing["platform"]): string {
  switch (platform) {
    case "INSTAGRAM":
      return "인스타그램";
    case "NAVER_BLOG":
      return "블로그";
    default:
      return "카카오 채널";
  }
}

function cacheSavedMarketing(post: SavedMarketing) {
  try {
    const list = getSavedMarketingPosts();
    if (list.find((item) => item.id === post.id)) return;
    const next = [post, ...list].slice(0, 50);
    localStorage.setItem(SAVED_MARKETING_KEY, JSON.stringify(next));
  } catch {
    // ignore storage errors
  }
}

const SplitGrid = styled.div`
  display: grid;
  gap: 12px;
  grid-template-columns: 1fr;
  @media (min-width: 960px) {
    grid-template-columns: 2fr 1fr;
  }
`;

const MetaRow = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin: 6px 0 10px;
`;

const Chip = styled.span`
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.colors.border };
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text };
`;

const Label = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textMuted };
  margin: 6px 0 4px;
`;

const Block = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border };
  border-radius: 10px;
  padding: 10px;
  background: #fff;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text };
`;

const Pre = styled.pre`
  white-space: pre-wrap;
  word-break: break-word;
  border: 1px solid ${({ theme }) => theme.colors.border };
  border-radius: 10px;
  padding: 10px;
  background: #fff;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text };
  margin: 0;
`;

const IGPreviewWrap = styled.div`
  display: grid;
  place-items: center;
  padding: 8px;
`;

const IGPhone = styled.div`
  width: 360px;
  max-width: 100%;
  background: #fff;
  border: 1px solid ${({ theme }) => theme.colors.border };
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
`;

const IGTopBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
`;

const IGAvatar = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.surfaceMuted };
  border: 1px solid ${({ theme }) => theme.colors.border };
`;

const IGUser = styled.div`
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text };
  font-size: 13px;
`;

const IGImage = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 5;
  background: #e5e7eb;
  display: grid;
  place-items: center;
  color: #6b7280;
  span {
    font-size: 12px;
    padding: 4px 8px;
    background: rgba(255, 255, 255, 0.7);
    border-radius: 8px;
  }
`;

const IGText = styled.div`
  padding: 10px;
  font-size: 13px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.text };
  white-space: pre-wrap;
  word-break: break-word;
  strong {
    margin-right: 6px;
  }
  .tags {
    display: block;
    margin-top: 6px;
    color: ${({ theme }) => theme.colors.textMuted };
  }
`;
