import styled from "styled-components";
import BackButton from "@/components/common/BackButton";
import {
  Page,
  SectionCard,
  TitleH3,
  PrimaryButton,
  GhostButtonSmall,
} from "@/components/common/UI";
import type { MarketingDirection } from "@/features/marketing/types";
import { platformLabel } from "@/features/marketing/summary/utils";
import {
  marketingDirectionAssetLabel,
  marketingDirectionPlatformLabel,
} from "@/features/marketing/utils";

type MarketingSummaryPageViewProps = {
  itemsCount: number;
  toneLabel: string;
  speechLabel: string;
  platformChoice: string;
  directionText: string | null;
  body: string;
  tagInput: string;
  onTagInputChange: (value: string) => void;
  tagsList: string[];
  tagCount: number;
  blogTitle?: string | null;
  summaryDirections: MarketingDirection[];
  selectedDirectionIndex: number | null;
  images: Array<{ idea?: string | null }>;
  currentImageIndex: number;
  onPrevImage: () => void;
  onNextImage: () => void;
  onSelectImage: (index: number) => void;
  canPrevImage: boolean;
  canNextImage: boolean;
  onCopyBody: () => void;
  onCopyBodyAndTags: () => void;
  onCopyTags: () => void;
  onSaveDraft: () => void;
};

export function MarketingSummaryPageView({
  itemsCount,
  toneLabel,
  speechLabel,
  platformChoice,
  directionText,
  body,
  tagInput,
  onTagInputChange,
  tagsList,
  tagCount,
  blogTitle,
  summaryDirections,
  selectedDirectionIndex,
  images,
  currentImageIndex,
  onPrevImage,
  onNextImage,
  onSelectImage,
  canPrevImage,
  canNextImage,
  onCopyBody,
  onCopyBodyAndTags,
  onCopyTags,
  onSaveDraft,
}: MarketingSummaryPageViewProps) {
  const hasImages = images.length > 0;
  const currentImageIdea = hasImages ? images[currentImageIndex]?.idea ?? "" : "";

  return (
    <Page>
      <ResultTopBar>
        <BackButton backSteps={1} label="뒤로가기" />
        <ButtonRow>
          <GhostButtonSmall as="button" onClick={onCopyBody}>
            본문 복사
          </GhostButtonSmall>
          <GhostButtonSmall as="button" onClick={onCopyBodyAndTags}>
            본문+태그 복사
          </GhostButtonSmall>
          <GhostButtonSmall as="button" onClick={onCopyTags}>
            태그 복사
          </GhostButtonSmall>
          <PrimaryButton as="button" onClick={onSaveDraft}>
            저장
          </PrimaryButton>
        </ButtonRow>
      </ResultTopBar>

      <MetaRow aria-hidden>
        <Chip>플랫폼: {platformLabel(platformChoice)}</Chip>
        <Chip>톤: {toneLabel}</Chip>
        <Chip>말투: {speechLabel}</Chip>
        <Chip>핵심 문장: {tagCount}개</Chip>
        <Chip>데이터: {itemsCount}건</Chip>
      </MetaRow>

      <SplitGrid>
        <SectionCard>
          {platformChoice === "NAVER_BLOG" ? (
            <BlogTitleInput
              value={blogTitle ?? ""}
              readOnly
              aria-label="blog-title"
              placeholder="제목 없음"
            />
          ) : null}
          {directionText ? (
            <>
              <ResultLabel>선택한 콘텐츠 방향</ResultLabel>
              <ResultPre aria-label="summary-direction">
                {directionText}
              </ResultPre>
            </>
          ) : null}
          <ResultLabel>본문</ResultLabel>
          <ResultPre aria-label="summary-body">
            {body || "요약이 비어 있습니다."}
          </ResultPre>
          <ResultLabel>태그 (수정 가능)</ResultLabel>
          <TagInput
            value={tagInput}
            onChange={(event) => onTagInputChange(event.currentTarget.value)}
            placeholder="#키워드를 공백으로 구분하여 입력"
            aria-label="summary-tags"
          />
        </SectionCard>

        <PreviewColumn>
          <SectionCard>
            <TitleH3>미리 보기</TitleH3>
            {platformChoice === "INSTAGRAM" ? (
              <IGPreviewWrap>
                <IGPhone>
                  <IGTopBar>
                    <IGAvatar />
                    <IGUser>our_academy</IGUser>
                  </IGTopBar>
                  <IGImage role="img" aria-label="이미지 예시">
                    {hasImages && images.length > 1 ? (
                      <>
                        <button
                          className="nav prev"
                          onClick={onPrevImage}
                          aria-label="이전"
                          disabled={!canPrevImage}
                        >
                          ‹
                        </button>
                        <button
                          className="nav next"
                          onClick={onNextImage}
                          aria-label="다음"
                          disabled={!canNextImage}
                        >
                          ›
                        </button>
                      </>
                    ) : null}
                    <span>
                      {currentImageIdea || "이미지 아이디어가 없습니다."}
                    </span>
                  </IGImage>
                  {hasImages && images.length > 1 ? (
                    <IGDots>
                      {images.map((_, index) => (
                        <IGDot
                          key={index}
                          data-active={index === currentImageIndex}
                          onClick={() => onSelectImage(index)}
                        />
                      ))}
                    </IGDots>
                  ) : null}
                  <IGText>
                    <strong>our_academy</strong> {body}
                    {tagsList.length > 0 ? (
                      <>
                        <br />
                        <span className="tags">{tagsList.join(" ")}</span>
                      </>
                    ) : null}
                  </IGText>
                </IGPhone>
              </IGPreviewWrap>
            ) : (
              <ResultPre aria-label="preview">
                {platformChoice === "NAVER_BLOG" && blogTitle
                  ? `${blogTitle}\n\n${body}`
                  : body}
              </ResultPre>
            )}
          </SectionCard>

          {summaryDirections.length ? (
            <SectionCard aria-labelledby="direction-suggestions-heading">
              <TitleH3 id="direction-suggestions-heading">
                AI 방향 제안
              </TitleH3>
              <DirectionSuggestionList>
                {summaryDirections.map((dir, index) => {
                  const isSelected = selectedDirectionIndex === index;
                  return (
                    <DirectionSuggestionItem
                      key={index}
                      data-selected={isSelected || undefined}
                    >
                      <DirectionSuggestionHeader>
                        <DirectionSuggestionBadge data-selected={isSelected || undefined}>
                          {isSelected ? "선택됨" : `추천 #${index + 1}`}
                        </DirectionSuggestionBadge>
                        {dir.platform ? (
                          <DirectionSuggestionPlatform>
                            {marketingDirectionPlatformLabel(dir.platform)}
                          </DirectionSuggestionPlatform>
                        ) : null}
                      </DirectionSuggestionHeader>
                      <DirectionSuggestionTitle>
                        {dir.title || `콘텐츠 방향 ${index + 1}`}
                      </DirectionSuggestionTitle>
                      {dir.because ? (
                        <DirectionSuggestionText>
                          {dir.because}
                        </DirectionSuggestionText>
                      ) : null}
                      {dir.hook ? (
                        <DirectionSuggestionHook>
                          “{dir.hook}”
                        </DirectionSuggestionHook>
                      ) : null}
                      <DirectionSuggestionTags>
                        {dir.asset ? (
                          <DirectionSuggestionTag>
                            {marketingDirectionAssetLabel(dir.asset)}
                          </DirectionSuggestionTag>
                        ) : null}
                        {dir.platform ? (
                          <DirectionSuggestionTag tone="neutral">
                            {marketingDirectionPlatformLabel(dir.platform)}
                          </DirectionSuggestionTag>
                        ) : null}
                      </DirectionSuggestionTags>
                    </DirectionSuggestionItem>
                  );
                })}
              </DirectionSuggestionList>
            </SectionCard>
          ) : null}
        </PreviewColumn>
      </SplitGrid>
    </Page>
  );
}

const ResultTopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${(p) => p.theme.spacing.sm};
  flex-wrap: wrap;
`;

const ButtonRow = styled.div`
  display: inline-flex;
  gap: ${(p) => p.theme.spacing.sm};
  flex-wrap: wrap;
  justify-content: flex-end;
`;

const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${(p) => p.theme.spacing.xs};
  margin: ${(p) => p.theme.spacing.md} 0;
  display: none;
`;

const Chip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing.xs};
  border-radius: 999px;
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.surfaceMuted};
  color: ${(p) => p.theme.colors.text};
  font-size: ${(p) => p.theme.font.size.sm};
  padding: ${(p) => p.theme.spacing.xs} ${(p) => p.theme.spacing.sm};
`;

const SplitGrid = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.lg};
  grid-template-columns: 1fr;
  @media (min-width: 960px) {
    grid-template-columns: 2fr 1fr;
  }
`;

const PreviewColumn = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.lg};
`;

const ResultLabel = styled.div`
  margin: ${(p) => p.theme.spacing.sm} 0 ${(p) => p.theme.spacing.xs};
  color: ${(p) => p.theme.colors.textMuted};
  font-size: ${(p) => p.theme.font.size.sm};
`;

const ResultPre = styled.pre`
  background: ${(p) => p.theme.colors.surfaceMuted};
  border-radius: ${(p) => p.theme.radii.md};
  padding: ${(p) => p.theme.spacing.md};
  min-height: 160px;
  white-space: pre-wrap;
  word-break: break-word;
  font-size: ${(p) => p.theme.font.size.md};
  color: ${(p) => p.theme.colors.text};
`;

const TagInput = styled.textarea`
  width: 100%;
  min-height: 80px;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.md};
  padding: ${(p) => p.theme.spacing.md};
  font-size: ${(p) => p.theme.font.size.md};
  resize: vertical;
`;

const BlogTitleInput = styled.input`
  width: 100%;
  margin-bottom: ${(p) => p.theme.spacing.sm};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.md};
  padding: ${(p) => p.theme.spacing.sm} ${(p) => p.theme.spacing.md};
  font-size: ${(p) => p.theme.font.size.lg};
  font-weight: 700;
  background: ${(p) => p.theme.colors.surfaceMuted};
`;

const DirectionSuggestionList = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.sm};
`;

const DirectionSuggestionItem = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${(p) => p.theme.spacing.md};
  background: ${({ theme }) => theme.colors.surface};
  display: grid;
  gap: ${(p) => p.theme.spacing.xs};
  &[data-selected="true"] {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primarySurface};
  }
`;

const DirectionSuggestionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${(p) => p.theme.spacing.xs};
`;

const DirectionSuggestionBadge = styled.span<{ "data-selected"?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  background: ${({ theme, "data-selected": selected }) =>
    selected ? theme.colors.primary : "rgba(79, 70, 229, 0.12)"};
  color: ${({ "data-selected": selected }) => (selected ? "#fff" : "#4338ca")};
`;

const DirectionSuggestionPlatform = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const DirectionSuggestionTitle = styled.h4`
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const DirectionSuggestionText = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const DirectionSuggestionHook = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
`;

const DirectionSuggestionTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const DirectionSuggestionTag = styled.span<{ tone?: "neutral" }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  background: ${({ tone }) =>
    tone === "neutral" ? "rgba(148, 163, 184, 0.16)" : "rgba(79, 70, 229, 0.12)"};
  color: ${({ tone }) => (tone === "neutral" ? "#475569" : "#3730a3")};
`;

const IGPreviewWrap = styled.div`
  display: flex;
  justify-content: center;
  padding: ${(p) => p.theme.spacing.sm};
`;

const IGPhone = styled.div`
  width: min(320px, 100%);
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 28px;
  padding: ${(p) => p.theme.spacing.lg};
  background: ${(p) => p.theme.colors.surface};
  display: grid;
  gap: ${(p) => p.theme.spacing.md};
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.08);
`;

const IGTopBar = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing.sm};
`;

const IGAvatar = styled.span`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${(p) => p.theme.colors.primarySurface};
`;

const IGUser = styled.span`
  font-weight: 600;
  color: ${(p) => p.theme.colors.text};
`;

const IGImage = styled.div`
  position: relative;
  border-radius: ${(p) => p.theme.radii.lg};
  background: ${(p) => p.theme.colors.surfaceMuted};
  min-height: 220px;
  display: grid;
  place-items: center;
  padding: ${(p) => p.theme.spacing.md};
  text-align: center;
  color: ${(p) => p.theme.colors.text};

  button.nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: none;
    background: rgba(15, 23, 42, 0.6);
    color: #fff;
    font-size: 18px;
    cursor: pointer;
  }
  button.nav.prev {
    left: 12px;
  }
  button.nav.next {
    right: 12px;
  }
  button.nav:disabled {
    opacity: 0.4;
    cursor: default;
  }
`;

const IGDots = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
`;

const IGDot = styled.button<{ "data-active"?: boolean }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  border: none;
  background: ${({ "data-active": active }) => (active ? "#312e81" : "rgba(49, 46, 129, 0.26)")};
  cursor: pointer;
`;

const IGText = styled.div`
  font-size: 14px;
  color: ${(p) => p.theme.colors.text};
  line-height: 1.6;
  .tags {
    color: ${(p) => p.theme.colors.primary};
  }
`;
