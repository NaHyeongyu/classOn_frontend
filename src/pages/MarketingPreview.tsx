import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Page, SectionCard, TitleH3, GhostButtonSmall, PrimaryButton } from '../components/common/UI';
import type { SummarizeItem } from '../api/summarize';

export default function MarketingPreview() {
  const { state } = useLocation() as { state?: { items?: SummarizeItem[]; direction?: string; bullets?: string[]; tone?: string; speechStyle?: 'SEUMNIDA'|'YO'; platformChoice?: 'INSTAGRAM'|'NAVER_BLOG'|'KAKAO_CHANNEL'; from?: string } };
  const items = state?.items ?? [];
  const direction = state?.direction ?? '';
  const bullets = state?.bullets ?? [];
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
  const speechStyle = state?.speechStyle ?? 'SEUMNIDA';
  const navigate = useNavigate();
  const platformChoice = state?.platformChoice ?? 'INSTAGRAM';
  const [fx, setFx] = useState(false);
  const [fxIdx] = useState(()=>Math.floor(Math.random()*1000));

  // (프롬프트 제거) AI 전송 미리보기 구성 로직은 제거되었습니다.

  function goNext() {
    setFx(true);
    setTimeout(() => {
      navigate('/marketing/summary', { state: { items, direction, bullets, tone, speechStyle, platformChoice, from: 'preview' } });
    }, 950);
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
      <header>
        <BackButton type="button" onClick={() => navigate(-1)}>←</BackButton>
        <HeaderText>
          <h2>AI 요약 결과</h2>
          <p>AI가 분석한 수업 내용을 바탕으로 마케팅 콘텐츠를 생성하세요.</p>
        </HeaderText>
      </header>

      <ContentGrid>
        <SummaryCard>
          <CardHeader>
            <div>
              <CardTitle>AI 요약 내용</CardTitle>
              <CardSubtitle>최근 수업 활동을 분석한 결과, 학생들의 학습 참여도와 이해도가 눈에 띄게 향상되고 있습니다.</CardSubtitle>
            </div>
            <MetaWrap>
              <Chip>톤: {toneLabel(tone)}</Chip>
              <Chip>말투: {speechStyle==='SEUMNIDA'?'~습니다':'~요'}</Chip>
              <Chip>핵심 {bullets.length}개</Chip>
              <Chip>데이터 {items.length}행</Chip>
              <Chip>플랫폼: {platformChoice==='INSTAGRAM'?'인스타그램':platformChoice==='NAVER_BLOG'?'블로그':'카카오 채널'}</Chip>
            </MetaWrap>
          </CardHeader>
          <SummaryBox>
            {renderSummary(items, direction)}
          </SummaryBox>
        </SummaryCard>

        <BulletsCard>
          <CardHeader>
            <div>
              <CardTitle>핵심 내용</CardTitle>
              <CardSubtitle>핵심 문장을 확인하고 필요하면 바로 수정하세요.</CardSubtitle>
            </div>
          </CardHeader>
          <BulletList role="list">
            {bullets.length === 0 ? (
              <EmptyHint>핵심 문장이 아직 없습니다.</EmptyHint>
            ) : bullets.map((b, i) => (
              <BulletItem key={i}>
                <span>{b}</span>
              </BulletItem>
            ))}
          </BulletList>
        </BulletsCard>
      </ContentGrid>

      <FooterBar>
        <GhostButtonSmall as="button" onClick={() => navigate(-1)}>이전 단계</GhostButtonSmall>
        <PrimaryButton as="button" onClick={goNext}>다음 단계</PrimaryButton>
      </FooterBar>

      {fx && (
        <FXOverlay aria-live="polite">
          <FXCard>
            <FXTitle>콘텐츠 마법을 준비 중… ✨</FXTitle>
            <FXEmojis data-variant={(fxIdx%3)+1} aria-hidden>
              <span>🪄</span><span>📚</span><span>🧠</span><span>🎈</span><span>🌟</span><span>🚀</span>
            </FXEmojis>
            <FXBar><FXFill /></FXBar>
          </FXCard>
        </FXOverlay>
      )}
    </Page>
  );
}

const TitleRow = styled.div`
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;
`;
const Label = styled.label`
  display:block; margin: 10px 0 6px; font-weight: 700; font-size: 13px;
`;
const Pre = styled.pre`
  white-space: pre-wrap; background: ${({theme}) => theme.colors.surfaceMuted}; border: 1px solid ${({theme}) => theme.colors.border}; border-radius: 10px; padding: 10px; font-size: 13px;
`;
const MetaRow = styled.div`
  display:flex; gap: 6px; flex-wrap: wrap; margin: 6px 0 8px;
`;
const Chip = styled.span`
  display:inline-flex; align-items:center; gap: 6px; padding: 4px 8px; border-radius: 999px; background: ${({theme}) => theme.colors.surfaceMuted}; color: ${({theme}) => theme.colors.text}; border: 1px solid ${({theme}) => theme.colors.border}; font-size: 12px;
`;
const NavRow = styled.div`
  display:flex; justify-content: space-between; margin-top: 12px;
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
const FXOverlay = styled.div`
  position: fixed; inset: 0; z-index: 60;
  background: rgba(255,255,255,0.88);
  backdrop-filter: blur(2px);
  display: grid; place-items: center; pointer-events: none;
`;
const FXCard = styled.div`
  width: min(480px, 92vw);
  border: 1px solid ${({theme}) => theme.colors.border};
  border-radius: 16px; background: #fff; padding: 16px;
  display: grid; gap: 10px; justify-items: center; text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  animation: pop .22s ease-out;
  @keyframes pop { 0%{ transform: scale(.98); opacity:.2 } 100%{ transform: scale(1); opacity:1 } }
`;
const FXTitle = styled.div`
  font-weight: 900; letter-spacing: -0.01em; color: ${({theme}) => theme.colors.text};
`;
const FXEmojis = styled.div`
  position: relative; height: 52px; overflow: visible;
  span{ position: absolute; left: 50%; transform: translateX(-50%); font-size: 18px; opacity: 0; animation: float 950ms ease-in forwards; }
  span:nth-child(1){ transform: translateX(-140%); animation-delay: 0ms; }
  span:nth-child(2){ transform: translateX(-70%); animation-delay: 60ms; }
  span:nth-child(3){ transform: translateX(-0%); animation-delay: 120ms; }
  span:nth-child(4){ transform: translateX(70%); animation-delay: 180ms; }
  span:nth-child(5){ transform: translateX(140%); animation-delay: 240ms; }
  span:nth-child(6){ transform: translateX(0%); animation-delay: 300ms; }
  @keyframes float { 0%{ transform: translateY(10px) translateX(var(--x,0)); opacity:0 } 60%{ opacity:1 } 100%{ transform: translateY(-18px) translateX(var(--x,0)); opacity:0 } }
`;
const FXBar = styled.div`
  width: 100%; height: 10px; border-radius: 999px; overflow: hidden;
  background: ${({theme}) => theme.colors.surfaceMuted}; border: 1px solid ${({theme}) => theme.colors.border};
`;
const FXFill = styled.div`
  height: 100%; width: 0%; background: ${({theme}) => theme.colors.primary}; animation: fill 950ms ease forwards;
  @keyframes fill { to { width: 100% } }
`;
