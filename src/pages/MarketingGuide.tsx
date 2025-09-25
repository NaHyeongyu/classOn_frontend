import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Page, SectionCard, TitleH3, GhostButtonSmall, PrimaryButton } from '../components/common/UI';
import type { SummarizeItem } from '../api/summarize';

export default function MarketingGuide() {
  const { state } = useLocation() as { state?: { items?: SummarizeItem[] } };
  const items = state?.items ?? [];
  const navigate = useNavigate();

  const [direction, setDirection] = useState('');
  const [edBullets, setEdBullets] = useState<string[]>([]);
  const [tone, setTone] = useState<string>('WARM_VIVID');
  const [speechStyle, setSpeechStyle] = useState<'SEUMNIDA'|'YO'>('SEUMNIDA');
  const [platformChoice, setPlatformChoice] = useState<'INSTAGRAM'|'NAVER_BLOG'|'KAKAO_CHANNEL'>('INSTAGRAM');
  const [fx, setFx] = useState(false);
  const [fxIdx] = useState(()=>Math.floor(Math.random()*1000));

  function goNext() {
    // Play fun transition FX then navigate
    setFx(true);
    setTimeout(() => {
      navigate('/marketing/preview', {
        state: { items, direction, bullets: edBullets, tone, speechStyle, platformChoice }
      });
    }, 900);
  }

  return (
    <Page>
      <Stepper>
        <Step data-active={true}>1. 작성 가이드</Step>
        <StepSep />
        <Step data-active={false}>2. 전송 미리보기</Step>
        <StepSep />
        <Step data-active={false}>3. 생성/편집</Step>
      </Stepper>
      <TitleRow>
        <h2>1. 작성 가이드</h2>
        <div style={{ display:'flex', gap: 6 }}>
          <GhostButtonSmall as="button" onClick={()=>navigate('/marketing')}>기록 다시 보기</GhostButtonSmall>
        </div>
      </TitleRow>

      <SectionCard>
        <TitleH3>작성 가이드(선택)</TitleH3>
        <EditHelp>콘텐츠 방향이나 키 메시지를 간단히 적어두면 다음 단계에 전달돼요.</EditHelp>
        <Textarea placeholder="예) 다음 주에는 실습 비중을 늘리고, 아이들 참여 사진을 강조" value={direction} onChange={(e)=>setDirection(e.target.value)} rows={4} />
      </SectionCard>

      <SectionCard>
        <TitleH3>어디에 올릴까요?</TitleH3>
        <EditHelp>플랫폼을 먼저 선택해주세요. (나중에 다시 바꿀 수 있어요)</EditHelp>
        <ToneGrid>
          <ToneOpt data-active={platformChoice==='INSTAGRAM'} onClick={()=>setPlatformChoice('INSTAGRAM')}>📸 인스타그램</ToneOpt>
          <ToneOpt data-active={platformChoice==='NAVER_BLOG'} onClick={()=>setPlatformChoice('NAVER_BLOG')}>📝 블로그</ToneOpt>
          <ToneOpt data-active={platformChoice==='KAKAO_CHANNEL'} onClick={()=>setPlatformChoice('KAKAO_CHANNEL')}>💬 카카오 채널</ToneOpt>
        </ToneGrid>
      </SectionCard>

      <SectionCard>
        <TitleH3>핵심 문장</TitleH3>
        <EditHelp>2~3개가 적당해요. 바로 수정·추가할 수 있어요.</EditHelp>
        <EditList>
          {edBullets.map((b, idx) => (
            <EditRow key={idx}>
              <Mark />
              <input value={b} onChange={(e)=>{
                const copy = [...edBullets];
                copy[idx] = e.target.value; setEdBullets(copy);
              }} placeholder={`메시지 ${idx+1}`} />
              <GhostButtonSmall as="button" onClick={()=>setEdBullets(edBullets.filter((_,i)=>i!==idx))}>삭제</GhostButtonSmall>
            </EditRow>
          ))}
          <GhostButtonSmall as="button" onClick={()=>setEdBullets([...edBullets, ''])}>항목 추가</GhostButtonSmall>
        </EditList>
      </SectionCard>

      <SectionCard>
        <TitleH3>말투(톤)</TitleH3>
        <EditHelp>플랫폼 선택 전에 말투를 정해두면 결과에 반영돼요.</EditHelp>
        <ToneGrid>
          <ToneOpt data-active={tone==='WARM_VIVID'} onClick={()=>setTone('WARM_VIVID')}>따뜻·생동</ToneOpt>
          <ToneOpt data-active={tone==='CONCISE_NEUTRAL'} onClick={()=>setTone('CONCISE_NEUTRAL')}>담백·간결</ToneOpt>
          <ToneOpt data-active={tone==='TRUST_CALM'} onClick={()=>setTone('TRUST_CALM')}>차분·신뢰</ToneOpt>
          <ToneOpt data-active={tone==='UPBEAT_POSITIVE'} onClick={()=>setTone('UPBEAT_POSITIVE')}>밝음·긍정</ToneOpt>
        </ToneGrid>
        <div style={{ height: 8 }} />
        <TitleH3>문장 어미(~체)</TitleH3>
        <EditHelp>‘~습니다’/‘~요’ 중 하나를 고르면 글 전반에 일관되게 반영돼요.</EditHelp>
        <ToneGrid>
          <ToneOpt data-active={speechStyle==='SEUMNIDA'} onClick={()=>setSpeechStyle('SEUMNIDA')}>~습니다</ToneOpt>
          <ToneOpt data-active={speechStyle==='YO'} onClick={()=>setSpeechStyle('YO')}>~요</ToneOpt>
        </ToneGrid>
      </SectionCard>

      <NavRow>
        <GhostButtonSmall as="button" onClick={()=>navigate('/marketing')}>← 이전</GhostButtonSmall>
        <PrimaryButton as="button" onClick={goNext} disabled={!items.length}>다음 단계</PrimaryButton>
      </NavRow>

      {fx && (
        <FXOverlay aria-live="polite">
          <FXCard>
            <FXTitle>두근두근! 다음 단계로 이동 중…</FXTitle>
            <FXEmojis data-variant={(fxIdx%3)+1} aria-hidden>
              <span>✨</span><span>📸</span><span>📝</span><span>🎉</span><span>🚀</span><span>💡</span>
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
const ReadBox = styled.div`
  white-space: pre-wrap; border: 1px solid ${({theme}) => theme.colors.border}; border-radius: 12px; padding: 12px; font-size: 14px; background: #fff;
`;
const EditHelp = styled.div`
  font-size: 12px; color: ${({theme}) => theme.colors.textMuted}; margin-bottom: 6px;
`;
const EditList = styled.div`
  display: grid; gap: 8px;
`;
const EditRow = styled.div`
  display: grid; grid-template-columns: 18px 1fr auto; gap: 8px; align-items: center;
  input { height: 38px; padding: 0 10px; border: 1px solid ${({theme}) => theme.colors.border}; border-radius: 10px; }
`;
const Textarea = styled.textarea`
  width: 100%; border: 1px solid ${({theme}) => theme.colors.border}; border-radius: 10px; padding: 10px; background: #fff; font-size: 13px; line-height: 1.6;
`;
const Mark = styled.span`
  width: 10px; height: 10px; border-radius: 50%; background: ${({theme}) => theme.colors.primary}; display: inline-block;
`;
const ToneGrid = styled.div`
  display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px;
`;
const ToneOpt = styled.button`
  border: 1px solid ${({theme}) => theme.colors.border}; background: #fff; border-radius: 10px; padding: 8px 10px; font-size: 13px; cursor: pointer;
  &[data-active='true']{ border-color: ${({theme}) => theme.colors.text}; background: ${({theme}) => theme.colors.text}; color: #fff; }
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
  span{ position: absolute; left: 50%; transform: translateX(-50%); font-size: 18px; opacity: 0; animation: float 900ms ease-in forwards; }
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
  height: 100%; width: 0%; background: ${({theme}) => theme.colors.primary}; animation: fill 900ms ease forwards;
  @keyframes fill { to { width: 100% } }
`;
