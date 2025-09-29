import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Page, SectionCard, GhostButtonSmall, PrimaryButton } from '../components/common/UI';
import type { SummarizeItem } from '../api/summarize';

const TONE_LABEL: Record<string, string> = {
  WARM_VIVID: '따뜻·생동',
  CONCISE_NEUTRAL: '담백·간결',
  TRUST_CALM: '차분·신뢰',
  UPBEAT_POSITIVE: '밝음·긍정',
};

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
  const [fxIdx] = useState(() => Math.floor(Math.random() * 1000));

  const canProceed = items.length > 0 && edBullets.every((b) => b.trim().length > 0) && edBullets.length >= 2;

  function goNext() {
    setFx(true);
    setTimeout(() => {
      navigate('/marketing/preview', {
        state: { items, direction, bullets: edBullets, tone, speechStyle, platformChoice },
      });
    }, 750);
  }

  return (
    <Page>
      <Header>
        <Stepper>
          <Step data-active>1. 작성 가이드</Step>
          <StepSep />
          <Step>2. 전송 미리보기</Step>
          <StepSep />
          <Step>3. 생성/편집</Step>
        </Stepper>
        <Hero>
          <HeroText>
            <h1>콘텐츠 방향을 정리해 볼까요?</h1>
            <p>수업 기록을 바탕으로 마케팅에 활용할 핵심 포인트를 미리 준비해요.</p>
          </HeroText>
          <HeroMeta>
            <MetaPill>선택된 수업 {items.length}건</MetaPill>
            <MetaPill>현재 톤 {TONE_LABEL[tone]}</MetaPill>
          </HeroMeta>
        </Hero>
      </Header>

      <Layout>
        <MainColumn>
          <GuideCard>
            <h2>작성 가이드 (선택)</h2>
            <p className="hint">콘텐츠 방향이나 강조할 메시지를 간단히 적어두면 다음 단계에서 참고해 드려요.</p>
            <StyledTextarea
              placeholder="예) 다음 주에는 실습 비중을 늘리고, 아이들 참여 사진을 강조"
              value={direction}
              onChange={(e) => setDirection(e.target.value)}
              rows={5}
            />
          </GuideCard>

          <GuideCard>
            <h2>핵심 문장</h2>
            <p className="hint">2~3개가 적당해요. 학부모에게 전하고 싶은 문장을 적어주세요.</p>
            <BulletList>
              {edBullets.map((b, idx) => (
                <BulletItem key={idx}>
                  <span className="index">#{idx + 1}</span>
                  <input
                    value={b}
                    onChange={(e) => {
                      const copy = [...edBullets];
                      copy[idx] = e.target.value;
                      setEdBullets(copy);
                    }}
                    placeholder="핵심 문장을 입력하세요"
                  />
                  <GhostButtonSmall as="button" onClick={() => setEdBullets(edBullets.filter((_, i) => i !== idx))}>
                    삭제
                  </GhostButtonSmall>
                </BulletItem>
              ))}
              <GhostButtonSmall as="button" onClick={() => setEdBullets([...edBullets, ''])}>
                + 항목 추가
              </GhostButtonSmall>
            </BulletList>
          </GuideCard>
        </MainColumn>

        <Aside>
          <GuideCard>
            <h2>플랫폼 선택</h2>
            <p className="hint">콘텐츠를 게시할 채널을 먼저 선택해주세요.</p>
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
            <p className="hint">말투와 어조를 설정하면 결과물에 그대로 반영돼요.</p>
            <SmallLabel>톤</SmallLabel>
            <ToneGrid>
              {TONE_OPTIONS.map((opt) => (
                <ToneOption
                  key={opt.value}
                  data-active={tone === opt.value}
                  onClick={() => setTone(opt.value)}
                >
                  <span>{opt.icon}</span>
                  <span>{opt.label}</span>
                </ToneOption>
              ))}
            </ToneGrid>
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
          </GuideCard>
        </Aside>
      </Layout>

      <Footer>
        <GhostButtonSmall as="button" onClick={() => navigate('/marketing')}>
          ← 이전
        </GhostButtonSmall>
        <PrimaryButton as="button" onClick={goNext} disabled={!canProceed}>
          다음 단계
        </PrimaryButton>
      </Footer>

      {fx && (
        <FXOverlay aria-live="polite">
          <FXCard>
            <FXTitle>두근두근! 다음 단계로 이동 중…</FXTitle>
            <FXEmojis data-variant={(fxIdx % 3) + 1} aria-hidden>
              <span>✨</span>
              <span>📸</span>
              <span>📝</span>
              <span>🎉</span>
              <span>🚀</span>
              <span>💡</span>
            </FXEmojis>
            <FXBar>
              <FXFill />
            </FXBar>
          </FXCard>
        </FXOverlay>
      )}
    </Page>
  );
}

const Header = styled.header`
  display: grid;
  gap: 16px;
`;

const Hero = styled.section`
  display: grid;
  gap: 12px;
  padding: 18px;
  border-radius: 18px;
  background: linear-gradient(135deg, rgba(248, 250, 252, 0.94), rgba(224, 231, 255, 0.8));
  border: 1px solid rgba(203, 213, 225, 0.4);
`;

const HeroText = styled.div`
  display: grid;
  gap: 4px;
  h1 { margin: 0; font-size: 24px; font-weight: 800; color: #111827; }
  p { margin: 0; font-size: 14px; color: #475569; }
`;

const HeroMeta = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const MetaPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  font-size: 12px;
  border-radius: 999px;
  background: rgba(99, 102, 241, 0.08);
  color: #4338ca;
  font-weight: 600;
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  gap: 16px;
  align-items: start;
  @media (max-width: 1080px) {
    grid-template-columns: 1fr;
  }
`;

const MainColumn = styled.div`
  display: grid;
  gap: 16px;
`;

const Aside = styled.div`
  display: grid;
  gap: 16px;
`;

const GuideCard = styled(SectionCard)`
  display: grid;
  gap: 12px;
  padding: 18px;
  border-radius: 18px;
  border: none;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.05);
  h2 { margin: 0; font-size: 18px; color: #111827; }
  .hint { margin: 0; font-size: 13px; color: #64748b; }
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  border: 1px solid rgba(203, 213, 225, 0.8);
  border-radius: 14px;
  padding: 12px 14px;
  font-size: 13px;
  line-height: 1.7;
  resize: vertical;
  min-height: 120px;
`;

const BulletList = styled.div`
  display: grid;
  gap: 8px;
`;

const BulletItem = styled.div`
  display: grid;
  grid-template-columns: 42px 1fr auto;
  gap: 10px;
  align-items: center;
  input {
    height: 42px;
    padding: 0 12px;
    border-radius: 12px;
    border: 1px solid rgba(203, 213, 225, 0.8);
    font-size: 13px;
  }
  .index {
    font-size: 12px;
    font-weight: 700;
    color: #6366f1;
    text-align: center;
  }
`;

const ChoiceGrid = styled.div`
  display: grid;
  gap: 10px;
`;

const ChoiceCard = styled.button`
  display: grid;
  gap: 6px;
  padding: 14px;
  text-align: left;
  border-radius: 16px;
  border: 1px solid rgba(203, 213, 225, 0.7);
  background: #ffffff;
  cursor: pointer;
  transition: border-color 0.18s ease, box-shadow 0.18s ease, transform 0.1s ease;
  .icon { font-size: 20px; }
  strong { font-size: 14px; color: #111827; }
  small { font-size: 12px; color: #64748b; }
  &[data-active='true'] {
    border-color: #4f46e5;
    box-shadow: 0 12px 24px rgba(79, 70, 229, 0.18);
    transform: translateY(-2px);
  }
`;

const SmallLabel = styled.div`
  margin-top: 6px;
  font-size: 12px;
  font-weight: 700;
  color: #475569;
`;

const ToneGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const ToneOption = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid rgba(203, 213, 225, 0.8);
  background: #ffffff;
  cursor: pointer;
  font-size: 13px;
  transition: border-color 0.18s ease, background 0.18s ease, transform 0.12s ease;
  span:first-child { font-size: 16px; }
  &[data-active='true'] {
    border-color: #6366f1;
    background: rgba(99, 102, 241, 0.12);
    transform: translateY(-1px);
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 18px;
`;

const Stepper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const Step = styled.div`
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid rgba(203, 213, 225, 0.8);
  font-size: 12px;
  color: #64748b;
  &[data-active='true'], &[data-active] {
    background: rgba(99, 102, 241, 0.16);
    color: #4338ca;
    font-weight: 700;
    border-color: rgba(99, 102, 241, 0.4);
  }
`;

const StepSep = styled.span`
  width: 12px;
  height: 1px;
  background: rgba(203, 213, 225, 0.8);
  display: inline-block;
`;

const FXOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 60;
  background: rgba(249, 250, 251, 0.85);
  backdrop-filter: blur(3px);
  display: grid;
  place-items: center;
  pointer-events: none;
`;

const FXCard = styled.div`
  width: min(420px, 92vw);
  border: 1px solid rgba(203, 213, 225, 0.6);
  border-radius: 18px;
  background: #ffffff;
  padding: 18px;
  display: grid;
  gap: 12px;
  justify-items: center;
  text-align: center;
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.16);
  animation: pop .22s ease-out;
  @keyframes pop {
    0% { transform: scale(.96); opacity: .3; }
    100% { transform: scale(1); opacity: 1; }
  }
`;

const FXTitle = styled.div`
  font-weight: 900;
  letter-spacing: -0.01em;
  color: #1f2937;
`;

const FXEmojis = styled.div`
  position: relative;
  height: 52px;
  overflow: visible;
  span {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    font-size: 18px;
    opacity: 0;
    animation: float 900ms ease-in forwards;
  }
  span:nth-child(1) { transform: translateX(-140%); animation-delay: 0ms; }
  span:nth-child(2) { transform: translateX(-70%); animation-delay: 60ms; }
  span:nth-child(3) { transform: translateX(0%); animation-delay: 120ms; }
  span:nth-child(4) { transform: translateX(70%); animation-delay: 180ms; }
  span:nth-child(5) { transform: translateX(140%); animation-delay: 240ms; }
  span:nth-child(6) { transform: translateX(0%); animation-delay: 300ms; }
  @keyframes float {
    0% { transform: translateY(10px) translateX(var(--x, 0)); opacity: 0; }
    60% { opacity: 1; }
    100% { transform: translateY(-18px) translateX(var(--x, 0)); opacity: 0; }
  }
`;

const FXBar = styled.div`
  width: 100%;
  height: 10px;
  border-radius: 999px;
  overflow: hidden;
  background: rgba(226, 232, 240, 0.7);
`;

const FXFill = styled.div`
  height: 100%;
  width: 100%;
  background: linear-gradient(90deg, #6366f1, #22d3ee);
  animation: fill 900ms ease forwards;
  @keyframes fill {
    0% { transform: scaleX(0); transform-origin: left; }
    100% { transform: scaleX(1); transform-origin: left; }
  }
`;

const PLATFORMS = [
  { value: 'INSTAGRAM', name: '인스타그램', icon: '📸', desc: '짧고 임팩트 있는 메시지' },
  { value: 'NAVER_BLOG', name: '네이버 블로그', icon: '📝', desc: '길고 친절한 설명에 적합' },
  { value: 'KAKAO_CHANNEL', name: '카카오 채널', icon: '💬', desc: '알림톡 · 채널 소식 전용' },
] as const;

const TONE_OPTIONS = [
  { value: 'WARM_VIVID', label: '따뜻·생동', icon: '☀️' },
  { value: 'CONCISE_NEUTRAL', label: '담백·간결', icon: '📘' },
  { value: 'TRUST_CALM', label: '차분·신뢰', icon: '🛡' },
  { value: 'UPBEAT_POSITIVE', label: '밝음·긍정', icon: '🎈' },
];
