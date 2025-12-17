import styled from "styled-components";
import BackButton from "@/components/common/BackButton";
import {
  Page,
  SectionCard,
  TitleH3,
  PrimaryButton,
  GhostButtonSmall,
} from "@/components/common/UI";
import type { PlatformChoice } from "@/features/marketing/summary/types";
import { platformLabel } from "@/features/marketing/summary/utils";

type MarketingSummaryPageViewProps = {
  itemsCount: number;
  toneLabel: string;
  speechLabel: string;
  platformChoice: PlatformChoice;
  body: string;
  onBodyChange: (value: string) => void;
  tagInput: string;
  onTagInputChange: (value: string) => void;
  tagsList: string[];
  tagCount: number;
  blogTitle?: string | null;
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
  body,
  onBodyChange,
  tagInput,
  onTagInputChange,
  tagsList,
  tagCount,
  blogTitle,
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
        <BackButton backSteps={1} label="뒤로" />
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
        <Chip>핵심 내용: {tagCount}개</Chip>
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
          <ResultLabel>본문 (수정 가능)</ResultLabel>
          <ResultHint>✨ AI 문구를 참고해서 수정해보세요!</ResultHint>
          <BodyTextarea
            aria-label="summary-body"
            value={body}
            onChange={(event) => onBodyChange(event.currentTarget.value)}
            placeholder="본문을 입력하세요."
          />
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

const ResultHint = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin: 0 0 ${(p) => p.theme.spacing.sm};
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid ${(p) => p.theme.colors.primary};
  background: ${(p) => p.theme.colors.primarySurface};
  color: ${(p) => p.theme.colors.primary};
  font-weight: 700;
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

const BodyTextarea = styled.textarea`
  width: 100%;
  min-height: 200px;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.md};
  padding: ${(p) => p.theme.spacing.md};
  font-size: ${(p) => p.theme.font.size.md};
  line-height: 1.6;
  background: ${(p) => p.theme.colors.surface};
  color: ${(p) => p.theme.colors.text};
  resize: vertical;
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
  background: linear-gradient(135deg, #e0e7ff, #eef2ff);
  min-height: 240px;
  display: grid;
  place-items: center;
  padding: ${(p) => p.theme.spacing.lg};
  text-align: center;
  color: ${(p) => p.theme.colors.text};
  overflow: hidden;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4);

  span {
    display: block;
    padding: 0 ${(p) => p.theme.spacing.sm};
    font-weight: 600;
    line-height: 1.5;
    color: ${(p) => p.theme.colors.text};
  }

  button.nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.3);
    background: rgba(15, 23, 42, 0.72);
    color: #fff;
    font-size: 16px;
    cursor: pointer;
    box-shadow: 0 6px 16px rgba(15, 23, 42, 0.25);
    transition: transform 0.14s ease, opacity 0.14s ease;
    opacity: 0.88;
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
  button.nav:not(:disabled):hover {
    transform: translateY(-50%) scale(1.02);
    opacity: 1;
  }
`;

const IGDots = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: ${(p) => p.theme.spacing.xs};
`;

const IGDot = styled.button<{ "data-active"?: boolean }>`
  height: 8px;
  min-width: 8px;
  padding: 0;
  border-radius: 999px;
  border: none;
  background: ${({ "data-active": active }) => (active ? "#312e81" : "rgba(49, 46, 129, 0.26)")};
  cursor: pointer;
  transition: all 0.16s ease;
  &[data-active="true"] {
    min-width: 18px;
  }
`;

const IGText = styled.div`
  font-size: 14px;
  color: ${(p) => p.theme.colors.text};
  line-height: 1.7;
  white-space: pre-wrap;
  word-break: break-word;
  display: grid;
  gap: ${(p) => p.theme.spacing.xs};
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.md};
  padding: ${(p) => p.theme.spacing.md};
  .tags {
    color: ${(p) => p.theme.colors.primary};
    display: block;
    white-space: normal;
  }
`;
