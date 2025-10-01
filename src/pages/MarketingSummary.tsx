import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Page, SectionCard, TitleH3, PrimaryButton, GhostButtonSmall } from '@/components/common/UI';
import BackButton from '@/components/common/BackButton';
import { useToast } from '@/components/common/Toast';
import { createSaved, type SavedPost } from '@/api/marketingSaved';
import { saveMarketingPost } from '@/lib/savedMarketing';
import type { SummarizeItem, SummarizeOptions } from '@/api/summarize';

type PlatformChoice = SavedPost['platform'];
type SpeechStyle = NonNullable<SavedPost['speechStyle']>;

type RenderedDraft = {
  title?: string | null;
  body?: string | null;
  tags?: string[] | null;
  images?: Array<{ idea: string }> | null;
  platform?: PlatformChoice | string | null;
};

type SummaryState = {
  items?: SummarizeItem[];
  options?: SummarizeOptions;
  direction?: string;
  bullets?: string[];
  tone?: string;
  speechStyle?: SpeechStyle;
  platformChoice?: PlatformChoice;
  formatStyle?: 'STORY' | 'LIST' | 'PERFORMANCE';
  from?: string;
  rendered?: RenderedDraft;
};

type Draft = {
  title?: string;
  body: string;
  tags: string[];
  images: Array<{ idea: string }>;
};

export default function MarketingSummary() {
  const { state } = useLocation() as { state?: SummaryState };
  const navigate = useNavigate();
  const { success, error: showError } = useToast();

  const platformChoice: PlatformChoice = state?.platformChoice ?? 'INSTAGRAM';
  const tone = state?.tone ?? 'WARM_VIVID';
  const speechStyle: SpeechStyle = state?.speechStyle ?? 'SEUMNIDA';

  const draft = useMemo(
    () => composeDraft(state, platformChoice, speechStyle),
    [state, platformChoice, speechStyle]
  );

  const draftTagString = useMemo(() => draft.tags.join(' '), [draft.tags]);
  const [tagInput, setTagInput] = useState(draftTagString);
  useEffect(() => {
    setTagInput(draftTagString);
  }, [draftTagString]);

  const [igImgIdx, setIgImgIdx] = useState(0);
  useEffect(() => {
    if (igImgIdx >= draft.images.length) setIgImgIdx(0);
  }, [draft.images.length, igImgIdx]);

  const tagsList = useMemo(() => tagInput.split(/\s+/).filter(Boolean), [tagInput]);
  const body = draft.body;
  const blogTitle = platformChoice === 'NAVER_BLOG' ? (draft.title ?? '') : '';

  const handleCopy = (text: string, message: string) => {
    if (!text.trim()) {
      showError('복사할 내용이 없습니다.');
      return;
    }
    navigator.clipboard
      ?.writeText(text)
      .then(() => success(message))
      .catch(() => showError('복사에 실패했습니다.'));
  };

  const handleSave = async () => {
    if (!body.trim() && tagsList.length === 0) {
      showError('저장할 내용이 없습니다.');
      return;
    }
    try {
      const saved = await createSaved({
        platform: platformChoice,
        speechStyle,
        tone,
        title: blogTitle || undefined,
        body,
        tags: tagsList,
      });
      success('저장되었습니다.');
      navigate(`/marketing/saved/${saved.id ?? ''}`);
    } catch {
      try {
        saveMarketingPost({
          platform: platformChoice,
          speechStyle,
          tone,
          title: blogTitle || undefined,
          body,
          tags: tagsList,
        });
        success('오프라인으로 저장되었습니다.');
        navigate('/marketing/saved');
      } catch {
        showError('저장에 실패했습니다.');
      }
    }
  };

  return (
    <Page>
      <ResultTopBar>
        <BackButton backSteps={1} label="뒤로가기" />
        <ButtonRow>
          <GhostButtonSmall
            as="button"
            onClick={() => handleCopy(body, '본문을 복사했습니다.')}
          >
            본문 복사
          </GhostButtonSmall>
          <GhostButtonSmall
            as="button"
            onClick={() => handleCopy([body, tagsList.join(' ')].filter(Boolean).join('\n\n'), '본문과 태그를 복사했습니다.')}
          >
            본문+태그 복사
          </GhostButtonSmall>
          <GhostButtonSmall
            as="button"
            onClick={() => handleCopy(tagsList.join(' '), '태그를 복사했습니다.')}
          >
            태그 복사
          </GhostButtonSmall>
          <PrimaryButton as="button" onClick={handleSave}>
            저장
          </PrimaryButton>
        </ButtonRow>
      </ResultTopBar>

      <MetaRow aria-hidden>
        <Chip>플랫폼: {platformLabel(platformChoice)}</Chip>
        <Chip>톤: {tone}</Chip>
        <Chip>말투: {speechStyle === 'SEUMNIDA' ? '~습니다' : '~요'}</Chip>
        <Chip>핵심 문장: {(state?.bullets ?? []).length || draft.tags.length}개</Chip>
        <Chip>데이터: {(state?.items ?? []).length}건</Chip>
      </MetaRow>

      <SplitGrid>
        <SectionCard>
          {platformChoice === 'NAVER_BLOG' && (
            <BlogTitleInput
              value={blogTitle}
              readOnly
              aria-label="blog-title"
              placeholder="제목 없음"
            />
          )}
          <ResultLabel>본문</ResultLabel>
          <ResultPre aria-label="summary-body">{body || '요약이 비어 있습니다.'}</ResultPre>
          <ResultLabel>태그 (수정 가능)</ResultLabel>
          <TagInput
            value={tagInput}
            onChange={(event) => setTagInput(event.currentTarget.value)}
            placeholder="#키워드를 공백으로 구분하여 입력"
            aria-label="summary-tags"
          />
        </SectionCard>

        <SectionCard>
          <TitleH3>미리 보기</TitleH3>
          {platformChoice === 'INSTAGRAM' ? (
            <IGPreviewWrap>
              <IGPhone>
                <IGTopBar>
                  <IGAvatar />
                  <IGUser>our_academy</IGUser>
                </IGTopBar>
                <IGImage role="img" aria-label="이미지 예시">
                  {draft.images.length > 1 && (
                    <>
                      <button
                        className="nav prev"
                        onClick={() => setIgImgIdx((idx) => Math.max(0, idx - 1))}
                        aria-label="이전"
                        disabled={igImgIdx <= 0}
                      >
                        ‹
                      </button>
                      <button
                        className="nav next"
                        onClick={() => setIgImgIdx((idx) => Math.min(draft.images.length - 1, idx + 1))}
                        aria-label="다음"
                        disabled={igImgIdx >= draft.images.length - 1}
                      >
                        ›
                      </button>
                    </>
                  )}
                  <span>{draft.images[igImgIdx]?.idea ?? '이미지 아이디어가 없습니다.'}</span>
                </IGImage>
                {draft.images.length > 1 && (
                  <IGDots>
                    {draft.images.map((_, index) => (
                      <IGDot
                        key={index}
                        data-active={index === igImgIdx}
                        onClick={() => setIgImgIdx(index)}
                      />
                    ))}
                  </IGDots>
                )}
                <IGText>
                  <strong>our_academy</strong> {body}
                  {tagsList.length > 0 && (
                    <>
                      <br />
                      <span className="tags">{tagsList.join(' ')}</span>
                    </>
                  )}
                </IGText>
              </IGPhone>
            </IGPreviewWrap>
          ) : (
            <ResultPre aria-label="preview">
              {platformChoice === 'NAVER_BLOG' && blogTitle ? `${blogTitle}\n\n` : ''}
              {body}
            </ResultPre>
          )}
        </SectionCard>
      </SplitGrid>
    </Page>
  );
}

function composeDraft(
  state: SummaryState | undefined,
  platformChoice: PlatformChoice,
  speechStyle: SpeechStyle
): Draft {
  const bullets = (state?.bullets ?? []).map((b) => b.trim()).filter(Boolean);
  const direction = state?.direction?.trim() ?? '';
  const items = state?.items ?? [];
  const rendered = state?.rendered;

  const fallback = buildFallbackDraft({
    platform: platformChoice,
    bullets,
    direction,
    items,
    speechStyle,
  });

  if (!rendered) {
    return fallback;
  }

  const body = (rendered.body ?? '').trim() || fallback.body;
  const tags = Array.isArray(rendered.tags) && rendered.tags.length
    ? rendered.tags.filter(Boolean)
    : fallback.tags;
  const images = rendered.images?.length ? rendered.images : fallback.images;
  const title = rendered.title ?? fallback.title;

  return { title, body, tags, images };
}

function buildFallbackDraft(params: {
  platform: PlatformChoice;
  bullets: string[];
  direction: string;
  items: SummarizeItem[];
  speechStyle: SpeechStyle;
}): Draft {
  const { platform, bullets, direction, items } = params;

  const bulletLines = bullets.length
    ? bullets
    : items.slice(0, 5).map((item) => summarizeItemLine(item));

  const sections = [direction.trim(), bulletLines.map((b) => `• ${b}`).join('\n').trim()]
    .filter(Boolean);
  const body = sections.join('\n\n') || '요약을 생성할 수 없습니다.';

  const tags = bullets.slice(0, 6).map((b) => `#${b.replace(/\s+/g, '')}`).filter((tag) => tag.length > 1);
  const images = buildImageIdeas(items);
  const title = platform === 'NAVER_BLOG'
    ? buildBlogTitle(direction, items)
    : undefined;

  return { title, body, tags, images };
}

function summarizeItemLine(item: SummarizeItem): string {
  const date = item.date ? `${item.date}` : '';
  const course = item.courseTitle ? `[${item.courseTitle}]` : '';
  const content = item.content ?? '';
  return [date, course, content].filter(Boolean).join(' ').trim();
}

function buildImageIdeas(items: SummarizeItem[]): Array<{ idea: string }> {
  if (!items.length) {
    return [{ idea: '수업 현장 스냅' }];
  }
  return items.slice(0, 5).map((item) => ({
    idea: `${item.courseTitle ?? '수업'} 활동 모습`,
  }));
}

function buildBlogTitle(direction: string, items: SummarizeItem[]): string {
  if (direction.trim()) return direction.trim().slice(0, 60);
  if (items.length) {
    const first = items[0];
    const course = first.courseTitle ?? '수업';
    return `${course} 하이라이트`;
  }
  return '이번 수업 이야기';
}

function platformLabel(platform: PlatformChoice): string {
  switch (platform) {
    case 'INSTAGRAM':
      return '인스타그램';
    case 'NAVER_BLOG':
      return '네이버 블로그';
    case 'KAKAO_CHANNEL':
      return '카카오 채널';
    default:
      return platform;
  }
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
  font-weight: 700;
  font-size: ${(p) => p.theme.font.size.md};
`;

const IGImage = styled.div`
  position: relative;
  border-radius: ${(p) => p.theme.radii.md};
  background: #e2e8f0;
  padding: ${(p) => p.theme.spacing.lg};
  min-height: 260px;
  display: grid;
  place-items: center;
  text-align: center;
  font-size: clamp(13px, 1.6vw, 16px);
  font-weight: 600;
  color: ${(p) => p.theme.colors.text};
  line-height: 1.68;
  letter-spacing: -0.01em;
  box-shadow: inset 0 0 0 1px rgba(148, 163, 184, 0.28);
  span {
    display: block;
    padding: 0 ${(p) => p.theme.spacing.lg};
    max-width: 80%;
    margin: 0 auto;
    white-space: pre-line;
  }
  button.nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    border: none;
    background: rgba(15, 23, 42, 0.6);
    color: #fff;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    cursor: pointer;
    display: grid;
    place-items: center;
    font-size: 16px;
    border: 1px solid rgba(255, 255, 255, 0.55);
    box-shadow: 0 6px 14px rgba(15, 23, 42, 0.18);
    transition: transform 0.18s ease, background 0.18s ease, box-shadow 0.18s ease;
    backdrop-filter: blur(2px);
  }
  button.nav:hover {
    background: rgba(79, 70, 229, 0.75);
    transform: translateY(-50%) scale(1.05);
    box-shadow: 0 8px 16px rgba(79, 70, 229, 0.25);
  }
  button.nav:active {
    transform: translateY(-50%) scale(0.97);
  }
  button.nav.prev { left: -24px; }
  button.nav.next { right: -24px; }
`;

const IGDots = styled.div`
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: ${(p) => p.theme.spacing.sm};
`;

const IGDot = styled.button<{ 'data-active': boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  padding: 0;
  background: ${({ 'data-active': active }) => (active ? '#1f2937' : 'rgba(148, 163, 184, 0.55)')};
  opacity: ${({ 'data-active': active }) => (active ? 1 : 0.65)};
  transform: ${({ 'data-active': active }) => (active ? 'scale(1.15)' : 'scale(1)')};
  transition: transform 0.18s ease, background 0.18s ease, opacity 0.18s ease;
  cursor: pointer;
  &:focus-visible {
    outline: 2px solid rgba(79, 70, 229, 0.45);
    outline-offset: 2px;
  }
`;

const IGText = styled.p`
  margin: 0;
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${(p) => p.theme.colors.text};
  line-height: 1.68;
  white-space: pre-wrap;
  word-break: keep-all;
  overflow-wrap: anywhere;
  strong {
    margin-right: 6px;
  }
  .tags {
    display: block;
    margin-top: ${(p) => p.theme.spacing.xs};
    color: ${(p) => p.theme.colors.textMuted};
  }
`;
