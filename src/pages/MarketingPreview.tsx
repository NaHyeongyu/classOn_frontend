import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Page, SectionCard, PrimaryButton, GhostButtonSmall } from '../components/common/UI';
import BackButton from '@/components/common/BackButton';
import type { SummarizeItem } from '../api/summarize';

export default function MarketingPreview() {
  const { state } = useLocation() as { state?: { items?: SummarizeItem[]; summary?: { from:string; to:string; summary:string; bullets:string[]; tokensUsed?:number; rawJson?:string }; direction?: string; bullets?: string[]; tone?: string; speechStyle?: 'SEUMNIDA'|'YO'; platformChoice?: 'INSTAGRAM'|'NAVER_BLOG'|'KAKAO_CHANNEL'; formatStyle?: 'STORY'|'LIST'|'PERFORMANCE'; from?: string } };
  const items = state?.items ?? [];
  const direction = state?.direction ?? '';
  const initialBullets = (state?.summary?.bullets ?? state?.bullets) ?? [];
  const [edBullets, setEdBullets] = useState<string[]>(initialBullets);
  // Sync when arriving with fresh summary
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  
  const tone = state?.tone ?? 'WARM_VIVID';
  const toneLabel = (t: string) => {
    const map: Record<string, string> = {
      WARM_VIVID: '따뜻·생동',
      CONCISE_NEUTRAL: '담백·간결',
      TRUST_CALM: '차분·신뢰',
      UPBEAT_POSITIVE: '밝음·긍정',
    };
    return map[t] ?? t;
  };
  // Local selections (editable on this page)
  const [speechStyle, setSpeechStyle] = useState<'SEUMNIDA'|'YO'>(state?.speechStyle ?? 'SEUMNIDA');
  const navigate = useNavigate();
  const [platformChoice, setPlatformChoice] = useState<'INSTAGRAM'|'NAVER_BLOG'|'KAKAO_CHANNEL'>(state?.platformChoice ?? 'INSTAGRAM');
  const [formatStyle, setFormatStyle] = useState<'STORY'|'LIST'|'PERFORMANCE'>(state?.formatStyle ?? 'STORY');
  const [fx, setFx] = useState(false);
  const [showIgPrompt, setShowIgPrompt] = useState(false);

  function goNext() {
    navigate('/marketing/rendering', { state: { items, direction, bullets: edBullets, tone, speechStyle, platformChoice, formatStyle, summary: (state as any)?.summary } });
  }

  function renderSummary(items: SummarizeItem[], direction: string) {
    const max = 6;
    const lines = items.slice(0, max).map(i => `• ${i.date}${i.courseTitle?` [${i.courseTitle}]`:''}: ${i.content || ''}`);
    const more = items.length > max ? `\n... (외 ${items.length - max}행)` : '';
    const text = (direction && direction.trim()) ? direction.trim() : (lines.join('\n') + more);
    return (
      <SummaryBody>
        <p style={{ whiteSpace:'pre-wrap' }}>{text}</p>
      </SummaryBody>
    );
  }

  // ---------- Instagram 전송 프롬프트 (변수 반영) ----------
  function sanitizeLine(s: string): string {
    if (!s) return '';
    let t = s.replace(/[\r\n]+/g, ' ').trim();
    t = t.replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, '[REDACTED]');
    t = t.replace(/(\+?\d{1,3}[- ]?)?(\d{2,4}[- ]?\d{3,4}[- ]?\d{4})/g, '[REDACTED]');
    return t;
  }
  function minMaxDate(): { from: string; to: string } {
    const ds = (items || []).map(i => i.date).filter(Boolean).sort();
    if (!ds.length) { const today = new Date().toISOString().slice(0,10); return { from: today, to: today }; }
    return { from: ds[0], to: ds[ds.length-1] };
  }
  function buildInstagramPrompt(): string {
    const { from, to } = minMaxDate();
    const toneOfVoice = speechStyle === 'YO' ? '요체' : '입니다체';
    const styleKo = formatStyle === 'STORY' ? '스토리텔링' : formatStyle === 'LIST' ? '정보 나열' : '성과 중심';
    const system = [
      '[시스템]',
      '당신은 학원·교육 기관·체험 수업을 홍보하는 인스타그램 전문 마케터입니다.',
      '목표는 학부모와 학생이 공감하고, 학원의 커리큘럼/활동을 자연스럽게 알리는 매력적인 인스타그램 캡션을 작성하는 것입니다.',
      '출력은 반드시 한국어로 하세요.',
    ].join('\n');
    const guide = [
      '[지시사항]',
      '1) 원본 데이터를 기반으로, 이번 기간의 수업을 날짜 나열이 아닌 **하나의 흐름**으로 정리하세요.',
      '2) 글 구조:',
      '   - 도입: 이번 달/기간 활동의 큰 주제',
      '   - 본문: 핵심 활동 + 아이들의 반응/느낀 점',
      '   - 마무리: 교육적 효과 + 학원/기관 소개 + 부드러운 안내 문장',
      '3) 이모지는 적절하게 사용하세요 (SNS 친화적으로)',
      '4) 해시태그는 8개.',
      '5) 글 길이: 450~900자.',
      '6) 아래 변수를 반영해 작성하세요.',
      `   - 말투 (tone_of_voice): \`${toneOfVoice}\``,
      '   - 톤 (content_style):',
      '     • `스토리텔링`: 서사 중심, 에피소드처럼 전개',
      '     • `정보 나열`: 활동을 간결하게 나열하며 정리',
      '     • `성과 중심`: 아이들의 성취, 결과, 성장 포인트 강조',
      `     → 선택: \`${styleKo}\``,
      '7) 사진 추천(5~10개): 각 항목에 “아이디어/주제”를 제안하세요. 과도한 연출보다 수업 현장감이 느껴지는 자연스러운 컷을 권장합니다. 아동 개인 식별 가능 요소(얼굴·명찰 등)는 노출하지 않도록 유의합니다.',
      '8) 금지:',
      '   - 날짜/시간표 나열',
      '   - 가격/할인/과장된 광고 문구',
      '',
      '[출력 형식]',
      '<캡션 시작>',
      '(최종 인스타그램 캡션)',
      '빈 줄 1개',
      '#해시태그',
      '빈 줄 1개',
      '[사진 추천(5~10개)]',
      '- 아이디어 1',
      '- 아이디어 2',
      '- 아이디어 3',
      '- 아이디어 4',
      '- 아이디어 5',
      '<캡션 끝>',
    ].join('\n');
    const lines = (items || []).map(i => `- ${i.date}${i.courseTitle?` [${sanitizeLine(i.courseTitle)}]`:''}: ${sanitizeLine(i.content || '')}`);
    const dataBlock = [
      '[원본 데이터]',
      `기간: ${from} ~ ${to}`,
      lines.join('\n')
    ].join('\n');
    return [system, '', guide, '', dataBlock].join('\n');
  }
  return (
    <Page>
      <Stepper>
        <Step data-active={false} data-done={true}>1. 작성 가이드</Step>
        <StepSep />
        <Step data-active={true}>2. 전송 미리보기</Step>
        <StepSep />
        <Step data-active={false}>3. 생성/편집</Step>
      </Stepper>
      <Header>
        <Hero>
          <HeroText>
            <h1>전송 전 내용을 한번 더 점검해요</h1>
            <p>요약과 핵심 문장을 확인하고 설정을 마친 뒤 다음 단계로 넘어가세요.</p>
          </HeroText>
          <HeroMeta>
            <MetaPill>선택 항목 {items.length}건</MetaPill>
          </HeroMeta>
        </Hero>
      </Header>

      <Layout>
        <MainColumn>
          <GuideCard>
            <h2>AI 요약 내용</h2>
            <p className="hint">최근 수업 활동을 분석한 결과를 확인하세요.</p>
            <SummaryBox>
              {state?.summary?.summary ? (
                <SummaryBody>
                  <p style={{ whiteSpace:'pre-wrap' }}>{state.summary.summary}</p>
                </SummaryBody>
              ) : (
                renderSummary(items, direction)
              )}
            </SummaryBox>
          </GuideCard>

          <GuideCard>
            <h2>핵심 문장</h2>
            <p className="hint">핵심 문장을 검토하고 바로 수정할 수 있어요.</p>
            <BulletList role="list">
              {edBullets.length === 0 ? (
                <EmptyHint>핵심 문장이 아직 없습니다. 아래 버튼으로 추가해 보세요.</EmptyHint>
              ) : edBullets.map((b, i) => (
                <BulletItem key={i}>
                  <span className="index">#{i+1}</span>
                  <AddInput value={b} onChange={(e)=>{
                    const copy = edBullets.slice(); copy[i] = e.target.value; setEdBullets(copy);
                  }} placeholder={`핵심 내용 ${i+1}`} />
                  <GhostButtonSmall as="button" onClick={()=> setEdBullets(edBullets.filter((_,idx)=>idx!==i))}>삭제</GhostButtonSmall>
                </BulletItem>
              ))}
            </BulletList>
            <div>
              <GhostButtonSmall as="button" onClick={()=> setEdBullets([...edBullets, ''])}>+ 항목 추가</GhostButtonSmall>
            </div>
          </GuideCard>

          {false && platformChoice==='INSTAGRAM' && (
            <GuideCard>
              <h2>전송 프롬프트 (Instagram)</h2>
              <p className="hint">현재 설정이 반영된 프롬프트를 확인하고 복사할 수 있어요.</p>
              <div style={{ display:'flex', gap: 12, justifyContent:'flex-end' }}>
                <GhostButtonSmall as="button" onClick={()=> setShowIgPrompt(v=>!v)}>{showIgPrompt ? '접기' : '펼쳐보기'}</GhostButtonSmall>
                <GhostButtonSmall as="button" onClick={()=> { const t = buildInstagramPrompt(); navigator.clipboard?.writeText(t).catch(()=>{}); }}>전체 복사</GhostButtonSmall>
              </div>
              {showIgPrompt && (
                <Pre style={{ maxHeight: 480, overflow: 'auto' }}>{buildInstagramPrompt()}</Pre>
              )}
            </GuideCard>
          )}
        </MainColumn>

        <Aside>
          <GuideCard>
            <h2>플랫폼 선택</h2>
            <p className="hint">콘텐츠를 게시할 채널을 선택하세요.</p>
            <ChoiceGrid>
              {PLATFORMS.map((pf) => (
                <ChoiceCard
                  key={pf.value}
                  data-active={platformChoice === pf.value}
                  onClick={() => setPlatformChoice(pf.value)}
                >
                  <span className="icon" role="img" aria-label={pf.name}>{pf.icon}</span>
                  <strong>{pf.name}</strong>
                  <small>{pf.desc}</small>
                </ChoiceCard>
              ))}
            </ChoiceGrid>
          </GuideCard>

          <GuideCard>
            <h2>톤 & 문장 어미</h2>
            <p className="hint">말투와 어조를 설정하면 결과물에 반영돼요.</p>
            <SmallLabel>문장 어미</SmallLabel>
            <ToneGrid>
              <ToneOption data-active={speechStyle === 'SEUMNIDA'} onClick={() => setSpeechStyle('SEUMNIDA')}>
                <span>🧑‍🏫</span>
                <span>~습니다</span>
              </ToneOption>
              <ToneOption data-active={speechStyle === 'YO'} onClick={() => setSpeechStyle('YO')}>
                <span>😊</span>
                <span>~요</span>
              </ToneOption>
            </ToneGrid>
            <SmallLabel>양식</SmallLabel>
            <ToneGrid>
              <ToneOption data-active={formatStyle==='STORY'} onClick={()=>setFormatStyle('STORY')}><span>🧵</span><span>스토리텔링</span></ToneOption>
              <ToneOption data-active={formatStyle==='LIST'} onClick={()=>setFormatStyle('LIST')}><span>📋</span><span>정보 나열</span></ToneOption>
              <ToneOption data-active={formatStyle==='PERFORMANCE'} onClick={()=>setFormatStyle('PERFORMANCE')}><span>🏆</span><span>성과 중심</span></ToneOption>
            </ToneGrid>
          </GuideCard>
        </Aside>
      </Layout>

      <Footer>
        <GhostButtonSmall as="button" onClick={() => navigate('/marketing')}>← 이전</GhostButtonSmall>
        <PrimaryButton as="button" onClick={goNext}>다음 단계</PrimaryButton>
      </Footer>

    </Page>
  );
}

const HeaderWrap = styled.header`
  display: grid;
  gap: 6px;
  margin-bottom: 18px;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

// Back button unified via shared component

const HeaderTitle = styled.h2`
  margin: 0;
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: ${({theme}) => theme.colors.text};
`;

const HeaderSubtitle = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${({theme}) => theme.colors.textMuted};
`;

const ContentGrid = styled.div`
  display: grid;
  gap: 16px;
  align-items: stretch;
  grid-template-columns: 1fr;
  @media (min-width: 1080px) {
    grid-template-columns: 1.4fr 1fr;
  }
`;

const SummaryCard = styled(SectionCard)`
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 16px;
  padding: 0;
  background: transparent;
  border: none;
  box-shadow: none;
  min-height: 0;
`;

const BulletsCard = styled(SectionCard)`
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  gap: 16px;
  align-self: stretch;
  min-height: 0;
  overflow: hidden;
  max-height: 420px;
  @media (max-width: 1079px) {
    max-height: none;
  }
`;

const CardHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  color: #0f172a;
  font-weight: 800;
`;

const CardSubtitle = styled.p`
  margin: 4px 0 0;
  font-size: 13px;
  color: #475569;
`;

const MetaWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const Chip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid ${({theme}) => theme.colors.border};
  background: ${({theme}) => theme.colors.surfaceMuted};
  color: ${({theme}) => theme.colors.text};
  font-size: 12px;
  font-weight: 600;
`;

const SummaryBox = styled.div`
  border-radius: 18px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  padding: 20px;
  min-height: 220px;
  display: grid;
  gap: 10px;
  box-shadow: 0 18px 42px rgba(15, 23, 42, 0.08);
  border: 1px solid rgba(226, 232, 240, 0.7);
  max-height: 380px;
  overflow-y: auto;
`;

const SummaryBody = styled.div`
  display: grid;
  gap: 14px;
  font-size: 14px;
  line-height: 1.8;
  color: #1f2937;
  p { margin: 0; }
`;

const BulletList = styled.div`
  display: grid;
  gap: 8px;
  overflow-y: auto;
  padding-right: 4px;
  min-height: 0;
  scrollbar-width: thin;
  scrollbar-color: rgba(148, 163, 184, 0.55) transparent;
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(148, 163, 184, 0.55);
    border-radius: 999px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;

const BulletItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid ${({theme}) => theme.colors.border};
  background: ${({theme}) => theme.colors.surfaceMuted};
`;

const BulletText = styled.span`
  flex: 1;
  font-size: 13px;
  color: ${({theme}) => theme.colors.text};
`;

const IconButton = styled.button`
  border: none;
  background: transparent;
  font-size: 16px;
  color: ${({theme}) => theme.colors.textMuted};
  cursor: pointer;
  padding: 0 4px;
`;

const AddRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const AddInput = styled.input`
  flex: 1;
  height: 40px;
  border-radius: 12px;
  border: 1px solid ${({theme}) => theme.colors.border};
  padding: 0 12px;
  background: #fff;
  font-size: 13px;
  color: ${({theme}) => theme.colors.text};
`;

const AddButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 1px solid ${({theme}) => theme.colors.border};
  background: ${({theme}) => theme.colors.primarySurface};
  color: ${({theme}) => theme.colors.primary};
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
`;

const EmptyHint = styled.div`
  display: grid;
  place-items: center;
  padding: 14px;
  border-radius: 12px;
  border: 1px dashed ${({theme}) => theme.colors.border};
  font-size: 13px;
  color: ${({theme}) => theme.colors.textMuted};
`;

const BulletActions = styled.div`
  display: flex;
  justify-content: flex-end;
`;

// ---- Common small UI pieces ----
const Label = styled.div`
  margin: 2px 0 6px;
  font-size: 12px;
  font-weight: 700;
  color: ${({theme}) => theme.colors.text};
`;

const Pre = styled.pre`
  margin: 0;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid ${({theme}) => theme.colors.border};
  background: #fff;
  color: ${({theme}) => theme.colors.text};
  font-size: 12px;
  line-height: 1.65;
  white-space: pre-wrap;
`;

const OptionBlock = styled.div`
  display: grid;
  gap: 6px;
  &:not(:last-child){ margin-bottom: 10px; }
`;

const OptionRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const OptionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  border-radius: 999px;
  border: 1px solid ${({theme}) => theme.colors.border};
  background: #fff;
  color: ${({theme}) => theme.colors.text};
  font-size: 12px;
  cursor: pointer;
  &[data-active='true']{
    background: ${({theme}) => theme.colors.primarySurface};
    color: ${({theme}) => theme.colors.primary};
    border-color: ${({theme}) => theme.colors.border};
    font-weight: 800;
  }
`;

const FooterBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
`;

const Stepper = styled.div`
  display: flex; align-items: center; gap: 8px; margin-bottom: 8px; flex-wrap: wrap;
`;
const Step = styled.div`
  padding: 4px 10px; border-radius: 999px; border: 1px solid ${({theme}) => theme.colors.border}; font-size: 12px; color: ${({theme}) => theme.colors.textMuted};
  &[data-active='true']{ background: ${({theme}) => theme.colors.primarySurface}; color: ${({theme}) => theme.colors.primary}; border-color: ${({theme}) => theme.colors.border}; font-weight: 800; }
  &[data-done='true']{ background: ${({theme}) => theme.colors.surfaceMuted}; color: ${({theme}) => theme.colors.text}; }
`;
const StepSep = styled.span`
  width: 10px; height: 1px; background: ${({theme}) => theme.colors.border}; display: inline-block;
`;

// -------- Step transition FX --------
// Guide-style header and layout (reused design)
const Header = styled.header`
  display: grid; gap: 16px; margin-bottom: 12px;
`;
const Hero = styled.section`
  display: grid; gap: 12px; padding: 18px; border-radius: 18px;
  background: linear-gradient(135deg, rgba(248, 250, 252, 0.94), rgba(224, 231, 255, 0.8));
  border: 1px solid rgba(203, 213, 225, 0.4);
`;
const HeroText = styled.div`
  display: grid; gap: 4px;
  h1 { margin: 0; font-size: 24px; font-weight: 800; color: #111827; }
  p { margin: 0; font-size: 14px; color: #475569; }
`;
const HeroMeta = styled.div`
  display: flex; gap: 8px; flex-wrap: wrap;
`;
const MetaPill = styled.span`
  display: inline-flex; align-items: center; gap: 6px; padding: 6px 10px; font-size: 12px;
  border-radius: 999px; background: rgba(99, 102, 241, 0.08); color: #4338ca; font-weight: 600;
`;
const Layout = styled.div`
  display: grid; grid-template-columns: minmax(0, 2fr) minmax(0, 1fr); gap: 16px; align-items: start;
  @media (max-width: 1080px){ grid-template-columns: 1fr; }
`;
const MainColumn = styled.div` display: grid; gap: 16px; `;
const Aside = styled.div` display: grid; gap: 16px; `;
const GuideCard = styled(SectionCard)`
  display: grid; gap: 12px; padding: 18px; border-radius: 18px; border: none;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.05);
  h2 { margin: 0; font-size: 18px; color: #111827; }
  .hint { margin: 0; font-size: 13px; color: #64748b; }
`;
const SmallLabel = styled.div`
  margin-top: 6px; font-size: 12px; font-weight: 700; color: #475569;
`;
const ChoiceGrid = styled.div` display: grid; gap: 10px; `;
const ChoiceCard = styled.button`
  display: grid; gap: 6px; padding: 14px; text-align: left; border-radius: 16px;
  border: 1px solid rgba(203, 213, 225, 0.7); background: #ffffff; cursor: pointer;
  transition: border-color .18s ease, box-shadow .18s ease, transform .1s ease;
  .icon { font-size: 20px; }
  strong { font-size: 14px; color: #111827; }
  small { font-size: 12px; color: #64748b; }
  &[data-active='true']{ border-color: #4f46e5; box-shadow: 0 12px 24px rgba(79, 70, 229, 0.18); transform: translateY(-2px); }
`;
const ToneGrid = styled.div` display: flex; flex-wrap: wrap; gap: 8px; `;
const ToneOption = styled.button`
  display: inline-flex; align-items: center; gap: 6px; padding: 8px 10px; border-radius: 999px;
  border: 1px solid rgba(203, 213, 225, 0.8); background: #fff; cursor: pointer;
  span { font-size: 13px; }
  &[data-active='true']{ background: rgba(99,102,241,.16); color: #4338ca; border-color: rgba(99,102,241,.4); font-weight: 700; }
`;
const Footer = styled.div` display:flex; justify-content: space-between; align-items:center; margin-top: 18px; `;

// Data for choice cards (mirrors guide page)
const PLATFORMS = [
  { value: 'INSTAGRAM', name: '인스타그램', icon: '📸', desc: '짧고 임팩트 있는 메시지' },
  { value: 'NAVER_BLOG', name: '네이버 블로그', icon: '📝', desc: '길고 친절한 설명에 적합' },
] as const;
