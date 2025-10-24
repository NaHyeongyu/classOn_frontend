
import styled from "styled-components";
import { Page, SectionCard, GhostButtonSmall, TitleH3, PageHeader } from "@/components/common/UI";
import type { SavedMarketing } from "@/lib/savedMarketing";

export type MarketingSavedDetailViewProps = {
  record: SavedMarketing | null;
  createdAtLabel: string | null;
  tags: string;
  confirmDialog: React.ReactNode;
  onBack: () => void;
  onCopy: () => void;
  onDelete: () => void;
};

export function MarketingSavedDetailPageView({
  record,
  createdAtLabel,
  tags,
  confirmDialog,
  onBack,
  onCopy,
  onDelete,
}: MarketingSavedDetailViewProps) {
  if (!record) {
    return (
      <Page>
        <PageHeader>
          <div>
            <h2>저장 내역 상세</h2>
            <p>항목을 찾을 수 없습니다.</p>
          </div>
          <GhostButtonSmall as="button" onClick={onBack}>
            목록으로
          </GhostButtonSmall>
        </PageHeader>
      </Page>
    );
  }

  return (
    <Page>
      {confirmDialog}
      <PageHeader>
        <div>
          <h2>저장 내역 상세</h2>
          <p>
            {platformLabel(record.platform)} · {createdAtLabel ?? "-"}
          </p>
        </div>
        <ButtonRow>
          <GhostButtonSmall as="button" onClick={onBack}>
            목록
          </GhostButtonSmall>
          <GhostButtonSmall as="button" onClick={onCopy}>
            복사
          </GhostButtonSmall>
          <GhostButtonSmall as="button" data-variant="danger" onClick={onDelete}>
            삭제
          </GhostButtonSmall>
        </ButtonRow>
      </PageHeader>

      <SplitGrid>
        <SectionCard>
          <TitleH3>저장한 캡션</TitleH3>
          <MetaRow>
            <Chip>{platformLabel(record.platform)}</Chip>
            <Chip>{createdAtLabel ?? "-"}</Chip>
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

const SplitGrid = styled.div`
  display: grid;
  gap: 12px;
  grid-template-columns: 1fr;
  @media (min-width: 960px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const ButtonRow = styled.div`
  display: inline-flex;
  gap: 12px;
`;

const MetaRow = styled.div`
  display: inline-flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const Chip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  background: rgba(148, 163, 184, 0.18);
  color: #475569;
`;

const Label = styled.h4`
  margin: 16px 0 6px;
  font-size: 14px;
  color: #475569;
`;

const Pre = styled.pre`
  background: ${({ theme }) => theme.colors.surfaceMuted};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: 16px;
  min-height: 160px;
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
`;

const Block = styled.div`
  background: ${({ theme }) => theme.colors.surfaceMuted};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: 12px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text};
`;

const IGPreviewWrap = styled.div`
  display: flex;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.sm};
`;

const IGPhone = styled.div`
  width: min(320px, 100%);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 28px;
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.surface};
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.08);
`;

const IGTopBar = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const IGAvatar = styled.span`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primarySurface};
`;

const IGUser = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const IGImage = styled.div`
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surfaceMuted};
  min-height: 220px;
  display: grid;
  place-items: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
`;

const IGText = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.6;
  .tags {
    display: block;
    margin-top: ${({ theme }) => theme.spacing.xs};
    color: ${({ theme }) => theme.colors.primary};
  }
`;
