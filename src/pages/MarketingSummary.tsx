import { useLocation, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { type SummarizeItem, type SummarizeOptions } from '../api/summarize';
import { Page, SectionCard, TitleH3, PrimaryButton, GhostButtonSmall } from '../components/common/UI';
import { useEffect, useMemo, useRef, useState } from 'react';

export default function MarketingSummary() {
  const { state } = useLocation() as { state?: { items?: SummarizeItem[], options?: SummarizeOptions, direction?: string, bullets?: string[], tone?: string, speechStyle?: 'SEUMNIDA'|'YO', platformChoice?: 'INSTAGRAM'|'NAVER_BLOG'|'KAKAO_CHANNEL', from?: string } };
  const navigate = useNavigate();
  const draftsRef = useRef<HTMLDivElement | null>(null);
  const toneLabel = (t: string) => {
    const map: Record<string, string> = {
      WARM_VIVID: '따뜻·생동',
      CONCISE_NEUTRAL: '담백·간결',
      TRUST_CALM: '차분·신뢰',
      UPBEAT_POSITIVE: '밝음·긍정',
    };
    return map[t] ?? t;
  };

  useEffect(() => {
    // Prefill from previous step if available
    if ((state?.direction && state?.bullets) || state?.from === 'preview') {
      setDirection(state?.direction || '');
      setEdBullets((state?.bullets || []).slice());
      if (state?.tone) setTone(state.tone);
      if (state?.speechStyle) setSpeechStyle(state.speechStyle);
    }
  }, []);

  const [edBullets, setEdBullets] = useState<string[]>(state?.bullets || []);
  const [igDraft, setIgDraft] = useState<Draft | null>(null);
  const [blogDraft, setBlogDraft] = useState<Draft | null>(null);
  const [kakaoDraft, setKakaoDraft] = useState<Draft | null>(null);
  const [direction, setDirection] = useState('');
  const platformChoice = state?.platformChoice ?? 'INSTAGRAM';
  const [tone, setTone] = useState<string>('WARM_VIVID');
  const [speechStyle, setSpeechStyle] = useState<'SEUMNIDA'|'YO'>('SEUMNIDA');
  const [igImgIdx, setIgImgIdx] = useState<number>(0);

  // Keep IG preview index within range when images change
  useEffect(() => {
    const n = igDraft?.images?.length || 0;
    if (igImgIdx >= n && n > 0) setIgImgIdx(0);
  }, [igDraft?.images?.length]);

  // (removed server draft auto-generation)

  function handleCopy() {
    const text = formatExportText((direction || ''), edBullets);
    navigator.clipboard?.writeText(text).catch(() => {});
  }

  function handleDownload() {
    const text = formatExportText((direction || ''), edBullets);
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'marketing-idea.md';
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  }

  // (removed server generation handler)

  // (removed AI preview text builder)

  // (removed UTM/calendar helpers)

  // Always render page; skeleton only (no AI prompt generation)

  return (
    <Page>
      <Stepper>
        <Step data-active={false} data-done={true}>1. 작성 가이드</Step>
        <StepSep />
        <Step data-active={false} data-done={true}>2. 전송 미리보기</Step>
        <StepSep />
        <Step data-active={true}>3. 생성/편집</Step>
      </Stepper>
      {/* Loading overlay removed in skeleton mode */}
      <HeaderRow>
        <div>
          <h2 style={{ margin: 0, fontSize: 18 }}>생성/편집</h2>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <GhostButtonSmall as={Link} to="/marketing">기록 다시 보기</GhostButtonSmall>
          <GhostButtonSmall as="button" onClick={handleCopy}>복사</GhostButtonSmall>
          <GhostButtonSmall as="button" onClick={handleDownload}>다운로드 .md</GhostButtonSmall>
        </div>
      </HeaderRow>

      {/* AI 분석 섹션 제거 (스켈레톤) */}

        { !((state?.direction && state?.bullets) || state?.from==='preview') && (
        <SectionCard>
          <TitleH3>핵심 문장</TitleH3>
          <EditHelp>2~3개가 적당해요. 바로 수정·추가할 수 있어요.</EditHelp>
        <EditList>
          {edBullets.map((b, idx) => (
            <EditRow key={idx}>
              <Mark />
              <input
                value={b}
                onChange={(e) => {
                  const copy = [...edBullets];
                  copy[idx] = e.target.value;
                  setEdBullets(copy);
                }}
                placeholder={`메시지 ${idx + 1}`}
              />
              <GhostButtonSmall as="button" onClick={() => setEdBullets(edBullets.filter((_, i) => i !== idx))}>삭제</GhostButtonSmall>
            </EditRow>
          ))}
          <GhostButtonSmall as="button" onClick={() => setEdBullets([...edBullets, ""])}>항목 추가</GhostButtonSmall>
        </EditList>
      </SectionCard>
        )}

      { !((state?.direction && state?.bullets) || state?.from==='preview') && (
      <SectionCard>
        <TitleH3>말투(톤)</TitleH3>
        <EditHelp>플랫폼 선택 전에 말투를 정해두면 결과에 반영돼요.</EditHelp>
        <ToneGrid>
          {[
            '따뜻하고 생동감 있게',
            '담백하고 간결하게',
            '차분하고 신뢰감 있게',
            '명료하고 직관적으로',
            '밝고 긍정적으로',
            '진솔하고 담담하게',
          ].map((t) => (
            <ToneOpt key={t} data-active={tone===t} onClick={()=>setTone(t)}>{t}</ToneOpt>
          ))}
        </ToneGrid>
        <div style={{ height: 8 }} />
        <TitleH3>문장 어미(~체)</TitleH3>
        <EditHelp>‘~습니다’/‘~요’ 중 하나를 골라 일관되게 쓰도록 할게요.</EditHelp>
        <ToneGrid>
          <ToneOpt data-active={speechStyle==='SEUMNIDA'} onClick={()=>setSpeechStyle('SEUMNIDA')}>~습니다</ToneOpt>
          <ToneOpt data-active={speechStyle==='YO'} onClick={()=>setSpeechStyle('YO')}>~요</ToneOpt>
        </ToneGrid>
      </SectionCard>
      )}

      { !((state?.direction && state?.bullets) || state?.from==='preview') && (
      <SectionCard>
        <TitleH3>작성 가이드(선택)</TitleH3>
        <EditHelp>간단한 방향이나 주제 메모를 남겨두세요.</EditHelp>
        <Textarea value={direction} onChange={(e)=>setDirection(e.target.value)} rows={4} />
      </SectionCard>
      )}

      <SectionCard>
          <TitleH3>선택한 플랫폼</TitleH3>
          <MetaRow>
            <Chip title="선택된 톤">톤: {toneLabel(tone)}</Chip>
            <Chip title="문장 어미">말투: {speechStyle==='SEUMNIDA'?'~습니다':'~요'}</Chip>
            <Chip title="핵심 문장 개수">핵심 {edBullets.length}개</Chip>
            <Chip title="전송 데이터 행">데이터 {state?.items?.length || 0}행</Chip>
            <Chip title="플랫폼">{platformChoice==='INSTAGRAM'?'인스타그램':platformChoice==='NAVER_BLOG'?'블로그':platformChoice==='KAKAO_CHANNEL'?'카카오 채널':'둘 다'}</Chip>
          </MetaRow>
          <Help>선택한 플랫폼 기준으로 아래 초안이 자동 생성됩니다.</Help>
        </SectionCard>

      <DraftGrid ref={draftsRef}>
        {platformChoice==='INSTAGRAM' && (
        <SectionCard>
          <TitleH3>인스타그램 글</TitleH3>
          <DraftActions>
            <GhostButtonSmall as="button" onClick={()=>{
              const baseSummary = (direction||'').trim();
              setIgDraft(buildInstagramDraft(baseSummary, edBullets));
            }}>다시 생성</GhostButtonSmall>
            <GhostButtonSmall as="button" onClick={() => copyText(igDraft?.body || '')}>본문 복사</GhostButtonSmall>
            <GhostButtonSmall as="button" onClick={() => copyText(formatTags(igDraft?.tags || []))}>태그 복사</GhostButtonSmall>
          </DraftActions>
          {!igDraft && (
            <>
              <Help>아직 생성된 초안이 없어요. 아래 버튼을 눌러 생성해 보세요.</Help>
              <div style={{ display:'flex', justifyContent:'flex-end' }}>
                <PrimaryButton as="button" onClick={()=>{ const baseSummary=(direction||'').trim(); setIgDraft(buildInstagramDraft(baseSummary, edBullets)); }}>생성하기</PrimaryButton>
              </div>
            </>
          )}
          <Label>본문</Label>
          <Textarea value={igDraft?.body || ''} onChange={(e) => setIgDraft(prev => ({ ...(prev || emptyDraft()), body: e.target.value }))} rows={8} />
          <Label>태그</Label>
          <TagEditor tags={igDraft?.tags || []} onChange={(tags) => setIgDraft(prev => ({ ...(prev || emptyDraft()), tags }))} />
          <Label>이미지 아이디어</Label>
          <Ideas>
            {(igDraft?.images || []).map((it, idx) => (
              <IdeaRow key={idx}>
                <input value={it.idea} onChange={(e) => updateIdea(setIgDraft, idx, e.target.value, 'INSTAGRAM')} placeholder={`아이디어 ${idx+1}`} />
                <GhostButtonSmall as="button" onClick={() => removeIdea(setIgDraft, idx)}>삭제</GhostButtonSmall>
              </IdeaRow>
            ))}
            <GhostButtonSmall as="button" onClick={() => addIdea(setIgDraft, 'INSTAGRAM')}>아이디어 추가</GhostButtonSmall>
          </Ideas>
        </SectionCard>
        )}

        {platformChoice==='INSTAGRAM' && (
        <SectionCard>
          <TitleH3>모바일 미리보기 (Instagram)</TitleH3>
          <IGPreviewWrap>
            <IGPhone>
              <IGTopBar>
                <IGAvatar />
                <IGUser>our_academy</IGUser>
              </IGTopBar>
              <IGImage role="img" aria-label="이미지 예시">
                {(igDraft?.images && igDraft.images.length > 1) && (
                  <>
                    <button className="nav prev" onClick={() => setIgImgIdx(i => Math.max(0, i - 1))} aria-label="이전" disabled={igImgIdx<=0}>‹</button>
                    <button className="nav next" onClick={() => setIgImgIdx(i => Math.min((igDraft.images.length - 1), i + 1))} aria-label="다음" disabled={igImgIdx>=(igDraft.images.length - 1)}>›</button>
                  </>
                )}
                <span>{(igDraft?.images?.[igImgIdx]?.idea || '이미지 예시').slice(0, 24)}</span>
              </IGImage>
              {(igDraft?.images && igDraft.images.length > 1) && (
                <IGDots>
                  {igDraft.images.map((_, i) => (
                    <IGDot key={i} data-active={i===igImgIdx} onClick={() => setIgImgIdx(i)} />
                  ))}
                </IGDots>
              )}
              <IGText>
                <strong>our_academy</strong> {igDraft?.body || ''}
                {igDraft?.tags?.length ? (<><br/><span className="tags">{igDraft.tags.join(' ')}</span></>) : null}
              </IGText>
            </IGPhone>
          </IGPreviewWrap>
        </SectionCard>
        )}

        {platformChoice==='KAKAO_CHANNEL' && (
        <SectionCard>
          <TitleH3>카카오 채널 글</TitleH3>
          <DraftActions>
            <GhostButtonSmall as="button" onClick={() => {
              const summaryText = (direction || '').trim();
              setKakaoDraft(buildKakaoDraft(summaryText, edBullets));
            }}>다시 생성</GhostButtonSmall>
            <GhostButtonSmall as="button" onClick={() => copyText(formatKakaoAll(kakaoDraft))}>전체 복사</GhostButtonSmall>
          </DraftActions>
          {!kakaoDraft && (
            <>
              <Help>아직 생성된 초안이 없어요. 아래 버튼을 눌러 생성해 보세요.</Help>
              <div style={{ display:'flex', justifyContent:'flex-end' }}>
                <PrimaryButton as="button" onClick={()=>{ const baseSummary=(direction||'').trim(); setKakaoDraft(buildKakaoDraft(baseSummary, edBullets)); }}>생성하기</PrimaryButton>
              </div>
            </>
          )}
          <Label>본문</Label>
          <Textarea value={kakaoDraft?.body || ''} onChange={(e) => setKakaoDraft(prev => ({ ...(prev || emptyDraft()), body: e.target.value }))} rows={6} />
          <Help>{inRange(lineCount(kakaoDraft?.body||''), 2, 6) ? '적정 길이' : '2~6줄 권장'}</Help>
          <Label>태그</Label>
          <TagEditor tags={kakaoDraft?.tags || []} onChange={(tags) => setKakaoDraft(prev => ({ ...(prev || emptyDraft()), tags }))} />
        </SectionCard>
        )}

        {platformChoice==='NAVER_BLOG' && (
        <SectionCard>
          <TitleH3>블로그 글</TitleH3>
          <DraftActions>
            <GhostButtonSmall as="button" onClick={()=>{
              const baseSummary = (direction||'').trim();
              setBlogDraft(buildBlogDraft(baseSummary, edBullets));
            }}>다시 생성</GhostButtonSmall>
            <GhostButtonSmall as="button" onClick={() => copyText(blogDraft?.title || '')}>제목 복사</GhostButtonSmall>
            <GhostButtonSmall as="button" onClick={() => copyText(blogDraft?.body || '')}>본문 복사</GhostButtonSmall>
          </DraftActions>
          {!blogDraft && (
            <>
              <Help>아직 생성된 초안이 없어요. 아래 버튼을 눌러 생성해 보세요.</Help>
              <div style={{ display:'flex', justifyContent:'flex-end' }}>
                <PrimaryButton as="button" onClick={()=>{ const baseSummary=(direction||'').trim(); setBlogDraft(buildBlogDraft(baseSummary, edBullets)); }}>생성하기</PrimaryButton>
              </div>
            </>
          )}
          <Label>제목</Label>
          <Input value={blogDraft?.title || ''} onChange={(e) => setBlogDraft(prev => ({ ...(prev || emptyDraft()), title: e.target.value }))} placeholder="40~60자 제목이 좋아요" />
          <Help>{(blogDraft?.title?.length||0)}자 · 40~60자 권장</Help>
          <Label>본문</Label>
          <Textarea value={blogDraft?.body || ''} onChange={(e) => setBlogDraft(prev => ({ ...(prev || emptyDraft()), body: e.target.value }))} rows={10} />
          <Label>태그</Label>
          <TagEditor tags={blogDraft?.tags || []} onChange={(tags) => setBlogDraft(prev => ({ ...(prev || emptyDraft()), tags }))} />
          <Label>이미지 아이디어</Label>
          <Ideas>
            {(blogDraft?.images || []).map((it, idx) => (
              <IdeaRow key={idx}>
                <input value={it.idea} onChange={(e) => updateIdea(setBlogDraft, idx, e.target.value, 'BLOG')} placeholder={`아이디어 ${idx+1}`} />
                <GhostButtonSmall as="button" onClick={() => removeIdea(setBlogDraft, idx)}>삭제</GhostButtonSmall>
              </IdeaRow>
            ))}
            <GhostButtonSmall as="button" onClick={() => addIdea(setBlogDraft, 'BLOG')}>아이디어 추가</GhostButtonSmall>
          </Ideas>
        </SectionCard>
        )}
      </DraftGrid>

      {/* UTM 링크/캘린더 섹션은 스켈레톤 단계에서는 제외 */}
    </Page>
  );

  function formatExportText(summaryText: string, bulletsList: string[]) {
    const hdr = '📌 마케팅 콘텐츠 아이디어 제안';
    const bullets = bulletsList?.length ? bulletsList.map((b) => `- ${b}`).join('\n') : '';
    return `${hdr}\n\n1. 핵심 메시지\n${bullets}\n\n2. 제안 내용\n${summaryText}\n`;
  }
}

const HeaderRow = styled.div`
  display: flex; align-items: center; justify-content: space-between; gap: 8px; width: 100%;
`;
const Sub = styled.div`
  color: #6b7280; font-size: 12px; margin-top: 4px;
`;
const MetaRow = styled.div`
  display: flex; gap: 6px; margin-top: 8px; flex-wrap: wrap;
`;
const Chip = styled.span`
  display: inline-flex; align-items: center; gap: 6px;
  height: 26px; padding: 0 10px; border-radius: 999px;
  background: ${({theme}) => theme.colors.primarySurface};
  color: ${({theme}) => theme.colors.primary};
  border: 1px solid ${({theme}) => theme.colors.border};
  font-size: 12px; font-weight: 700;
`;
const Empty = styled.div`
  color: #6b7280; font-size: 13px; margin-bottom: 8px;
`;
const Pre = styled.pre`
  white-space: pre-wrap; word-break: break-word; background: #f9fafb; border-radius: 10px; padding: 10px; font-size: 13px; color: #111827; margin: 0;
`;
const Help = styled.div`
  color: ${({theme}) => theme.colors.textMuted}; font-size: 12px; margin-top: 4px;
`;

const SplitGrid = styled.div`
  display: grid; gap: 12px;
  grid-template-columns: 1fr;
  @media (min-width: 960px) {
    grid-template-columns: 2fr 1fr;
  }
`;

const SummaryBox = styled.div`
  position: relative; border: 1px solid ${({theme}) => theme.colors.border}; border-radius: 12px; background: ${({theme}) => theme.colors.surfaceMuted};
  padding: 12px; max-height: 420px; overflow: hidden;
  &[data-expanded='true']{ max-height: none; }
`;
const SummaryBody = styled.div`
  white-space: pre-wrap; word-break: break-word; line-height: 1.7; color: ${({theme}) => theme.colors.text};
`;
const FadeOverlay = styled.div`
  position: absolute; left: 0; right: 0; bottom: 0; height: 80px;
  background: linear-gradient(to bottom, rgba(255,255,255,0), ${({theme}) => theme.colors.surfaceMuted});
`;

const BulletsList = styled.ul`
  list-style: none; margin: 0; padding: 0; display: grid; gap: 8px;
`;
const BulletItem = styled.li`
  display: flex; align-items: flex-start; gap: 8px; color: ${({theme}) => theme.colors.text};
`;
const EditHelp = styled.div`
  font-size: 12px; color: ${({theme}) => theme.colors.textMuted}; margin-bottom: 8px;
`;
const EditList = styled.div`
  display: grid; gap: 8px;
  input {
    flex: 1; height: 38px; padding: 0 10px; border: 1px solid ${({theme}) => theme.colors.border};
    border-radius: 10px; background: #fff; font-size: 13px;
  }
`;
const EditRow = styled.div`
  display: flex; align-items: center; gap: 8px;
`;
const Mark = styled.span`
  flex: 0 0 auto; width: 10px; height: 10px; margin-top: 6px;
  border-radius: 2px; background: ${({theme}) => theme.colors.primary};
`;

const DraftGrid = styled.div`
  display: grid; gap: 12px; grid-template-columns: 1fr; @media (min-width: 960px){ grid-template-columns: 1fr 1fr; }
`;
const DraftActions = styled.div`
  display: flex; gap: 6px; justify-content: flex-end; margin-bottom: 8px;
`;
const QuickBar = styled.div`
  display: flex; gap: 8px; justify-content: flex-end; margin-top: 10px;
`;
const Label = styled.label`
  display: block; font-size: 12px; color: ${({theme}) => theme.colors.textMuted}; margin: 8px 0 6px;
`;
const Input = styled.input`
  height: 40px; padding: 0 10px; border: 1px solid ${({theme}) => theme.colors.border}; border-radius: 10px; background: #fff; width: 100%;
`;
const Textarea = styled.textarea`
  width: 100%; border: 1px solid ${({theme}) => theme.colors.border}; border-radius: 10px; padding: 10px; background: #fff; font-size: 13px; line-height: 1.6;
`;
const ReadBox = styled.div`
  white-space: pre-wrap; word-break: break-word; background: ${({theme}) => theme.colors.surfaceMuted};
  border: 1px solid ${({theme}) => theme.colors.border}; border-radius: 10px; padding: 10px; font-size: 13px; color: ${({theme}) => theme.colors.text};
`;
const Ideas = styled.div`
  display: grid; gap: 8px;
`;
const IdeaRow = styled.div`
  display: flex; gap: 8px; align-items: center;
  input { flex: 1; height: 38px; padding: 0 10px; border: 1px solid ${({theme}) => theme.colors.border}; border-radius: 10px; }
`;
const Tag = styled.span`
  display: inline-flex; align-items: center; gap: 6px; padding: 4px 8px; border-radius: 999px; background: ${({theme}) => theme.colors.surfaceMuted}; color: ${({theme}) => theme.colors.text}; border: 1px solid ${({theme}) => theme.colors.border};
  button { border: 0; background: transparent; cursor: pointer; color: ${({theme}) => theme.colors.textMuted}; }
`;

const Stepper = styled.div`
  display: flex; align-items: center; gap: 8px; margin-bottom: 8px; flex-wrap: wrap;
`;
const Step = styled.div`
  padding: 4px 10px; border-radius: 999px; border: 1px solid ${({theme}) => theme.colors.border}; font-size: 12px; color: ${({theme}) => theme.colors.textMuted};
  &[data-active='true']{ background: ${({theme}) => theme.colors.primarySurface}; color: ${({theme}) => theme.colors.primary}; border-color: ${({theme}) => theme.colors.border}; font-weight: 800; }
`;
const StepSep = styled.span`
  width: 10px; height: 1px; background: ${({theme}) => theme.colors.border}; display: inline-block;
`;

const PlatformGrid = styled.div`
  display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px;
`;
const PlatformCard = styled.button`
  display: grid; justify-items: center; gap: 6px; border: 1px solid ${({theme}) => theme.colors.border}; border-radius: 12px; padding: 12px; background: #fff; cursor: pointer;
  .icon{ font-size: 22px; }
  .name{ font-weight: 800; color: ${({theme}) => theme.colors.text}; }
  .mini{ font-size: 12px; color: ${({theme}) => theme.colors.textMuted}; }
  &[data-disabled='true']{ opacity: .6; cursor: not-allowed; }
`;

const BodyHelp = styled.div<{ $ok?: boolean }>`
  font-size: 12px; margin: 6px 0 0; color: ${({theme, $ok}) => $ok ? theme.colors.textMuted : '#b91c1c'};
`;

// Instagram mobile-like preview styles
const IGPreviewWrap = styled.div`
  display: grid; place-items: center; padding: 8px;
`;
const IGPhone = styled.div`
  width: 360px; max-width: 100%; background: #fff; border: 1px solid ${({theme}) => theme.colors.border};
  border-radius: 18px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.08);
`;
const IGTopBar = styled.div`
  display: flex; align-items: center; gap: 8px; padding: 10px;
`;
const IGAvatar = styled.div`
  width: 28px; height: 28px; border-radius: 50%; background: ${({theme}) => theme.colors.surfaceMuted}; border: 1px solid ${({theme}) => theme.colors.border};
`;
const IGUser = styled.div`
  font-weight: 800; color: ${({theme}) => theme.colors.text}; font-size: 13px;
`;
const IGImage = styled.div`
  position: relative; width: 100%; aspect-ratio: 4/5; background: #e5e7eb; display: grid; place-items: center; color: #6b7280;
  span{ font-size: 12px; padding: 4px 8px; background: rgba(255,255,255,0.7); border-radius: 8px; }
  button.nav{ position: absolute; top: 50%; transform: translateY(-50%); width: 28px; height: 28px; border-radius: 50%; border: 0; background: rgba(0,0,0,0.4); color: #fff; display: grid; place-items: center; cursor: pointer; }
  button.nav.prev{ left: 6px; }
  button.nav.next{ right: 6px; }
  button.nav[disabled]{ opacity: .3; cursor: default; }
`;
const IGDots = styled.div`
  display: flex; gap: 6px; justify-content: center; padding: 6px 0;
`;
const IGDot = styled.button`
  width: 6px; height: 6px; border-radius: 50%; border: 0; background: #d1d5db; cursor: pointer;
  &[data-active='true']{ background: #111827; }
`;
const IGText = styled.div`
  padding: 10px; font-size: 13px; line-height: 1.5; color: ${({theme}) => theme.colors.text}; white-space: pre-wrap; word-break: break-word;
  strong{ margin-right: 6px; }
  .tags{ display: block; margin-top: 6px; color: ${({theme}) => theme.colors.textMuted}; }
`;

// Loading visuals removed in skeleton mode

// ---------- Draft helpers ----------
type Draft = { title: string; body: string; tags: string[]; images: { idea: string }[] };
const emptyDraft = (): Draft => ({ title: '', body: '', tags: [], images: [] });

const ToneGrid = styled.div`
  display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px;
`;
const ToneOpt = styled.button`
  border: 1px solid ${({theme}) => theme.colors.border}; background: #fff; border-radius: 10px; padding: 8px 10px; font-size: 13px; cursor: pointer;
  &[data-active='true']{ border-color: ${({theme}) => theme.colors.text}; background: ${({theme}) => theme.colors.text}; color: #fff; }
`;

function copyText(text: string) {
  if (!text) return;
  navigator.clipboard?.writeText(text).catch(() => {});
}

function lineCount(text: string): number {
  if (!text) return 0; return text.split(/\n/).filter(()=>true).length;
}
function inRange(n: number, a: number, b: number) { return n>=a && n<=b; }

function formatIgAll(d?: Draft | null): string {
  if (!d) return '';
  const parts = [] as string[];
  if (d.title && d.title.trim()) parts.push(d.title.trim());
  if (d.body && d.body.trim()) parts.push(d.body.trim());
  if (d.tags?.length) parts.push(d.tags.join(' '));
  return parts.join('\n\n');
}
function formatBlogAll(d?: Draft | null): string {
  if (!d) return '';
  const title = d.title?.trim() ? `# ${d.title.trim()}\n\n` : '';
  const tags = d.tags?.length ? `\n\n${d.tags.join(' ')}` : '';
  return `${title}${(d.body||'').trim()}${tags}`;
}

function formatKakaoAll(d?: Draft | null): string {
  if (!d) return '';
  const parts = [] as string[];
  if (d.body && d.body.trim()) parts.push(d.body.trim());
  if (d.tags?.length) parts.push(d.tags.join(' '));
  return parts.join('\n\n');
}

function formatTags(tags: string[]): string {
  if (!tags || !tags.length) return '';
  return tags.join(' ');
}

// ---------- AI Input Preview helpers ----------

function toTags(bullets: string[], max = 8): string[] {
  const raw = bullets.flatMap(b => b.split(/[\s,]+/)).map(w => w.replace(/[\p{P}\p{S}]/gu, '')).filter(Boolean);
  const uniq: string[] = [];
  for (const w of raw) {
    const t = (w.length <= 2 ? w : w.toLowerCase());
    if (!uniq.includes(t)) uniq.push(t);
    if (uniq.length >= max) break;
  }
  return uniq.map(t => (t.startsWith('#') ? t : `#${t}`));
}

function buildInstagramDraft(summary: string, bullets: string[]): Draft {
  const lines = bullets.slice(0, 3).map(b => `• ${b}`);
  const body = [lines.join('\n'), '', summary].filter(Boolean).join('\n');
  const tags = toTags(bullets, 8);
  const images = bullets.slice(0, 3).map(b => ({ idea: `${b} 순간을 담은 현장 컷` }));
  return { title: '', body, tags, images };
}

function buildBlogDraft(summary: string, bullets: string[]): Draft {
  const title = bullets[0] ? `${bullets[0]} | 이번 기간 수업 하이라이트` : '이번 기간 수업 하이라이트';
  const paras = summary.split(/\n{2,}/).filter(Boolean);
  const body = [`## 핵심 요약`, '', bullets.map(b => `- ${b}`).join('\n'), '', `## 상세`, '', paras.join('\n\n')].join('\n');
  const tags = toTags(bullets, 6);
  const images = bullets.slice(0, 4).map(b => ({ idea: `${b} 관련 활동 사진` }));
  return { title, body, tags, images };
}

function buildKakaoDraft(summary: string, bullets: string[]): Draft {
  const lead = bullets[0] ? bullets[0] : '이번 주 소식';
  const lines: string[] = [];
  lines.push(`【${lead}】`);
  if (bullets[1]) lines.push(`- ${bullets[1]}`);
  if (bullets[2]) lines.push(`- ${bullets[2]}`);
  lines.push('👉 자세히 보기: <링크>');
  const body = lines.join('\n');
  const tags = toTags(bullets, 4);
  const images = bullets.slice(0, 2).map(b => ({ idea: `${b} 관련 세로 이미지(1:1 또는 4:5)` }));
  return { title: '', body, tags, images };
}

function updateIdea(setter: React.Dispatch<React.SetStateAction<Draft | null>>, idx: number, value: string, _: 'INSTAGRAM'|'BLOG') {
  setter(prev => {
    const cur = prev || emptyDraft();
    const list = [...cur.images];
    list[idx] = { idea: value };
    return { ...cur, images: list };
  });
}
function removeIdea(setter: React.Dispatch<React.SetStateAction<Draft | null>>, idx: number) {
  setter(prev => {
    const cur = prev || emptyDraft();
    const list = cur.images.filter((_, i) => i !== idx);
    return { ...cur, images: list };
  });
}
function addIdea(setter: React.Dispatch<React.SetStateAction<Draft | null>>, kind: 'INSTAGRAM'|'BLOG') {
  setter(prev => {
    const cur = prev || emptyDraft();
    const list = [...cur.images, { idea: kind === 'INSTAGRAM' ? '수업 현장 모습(세로 4:5)' : '수업 요약 썸네일(가로 16:9)' }];
    return { ...cur, images: list };
  });
}

// helper to convert server render into local draft
function renderToDraft(r: { title: string|null; body: string; tags: string[]; images?: { idea: string }[] }): Draft {
  return { title: r.title || '', body: r.body || '', tags: r.tags || [], images: (r.images || []).map(i => ({ idea: i.idea || '' })) };
}

// ---------- Draft UI small parts ----------
function TagEditor({ tags, onChange }: { tags: string[]; onChange: (t: string[]) => void }) {
  const [input, setInput] = useState('');
  function add() {
    const t = input.trim(); if (!t) return; setInput('');
    const norm = t.startsWith('#') ? t : `#${t}`;
    if (!tags.includes(norm)) onChange([...tags, norm]);
  }
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {tags.map((t, i) => (
        <Tag key={i}>
          <span>{t}</span>
          <button onClick={() => onChange(tags.filter((_, idx) => idx !== i))} aria-label="remove">×</button>
        </Tag>
      ))}
      <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') add(); }} placeholder="#태그 추가" style={{ height: 36, padding: '0 10px', border: '1px solid #e5e7eb', borderRadius: 10 }} />
      <GhostButtonSmall as="button" onClick={add}>추가</GhostButtonSmall>
    </div>
  );
}
