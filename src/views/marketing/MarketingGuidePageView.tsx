import styled, { keyframes } from "styled-components";
import {
  Page,
  SectionCard,
  GhostButtonSmall,
  PrimaryButton,
  PrimaryButtonSm,
} from "@/components/common/UI";
import type {
  MarketingPlatform,
  MarketingSpeechStyle,
  MarketingTone,
} from "@/features/marketing/types";

const PLATFORM_OPTIONS: Array<{
  value: MarketingPlatform;
  name: string;
  icon: string;
  description: string;
}> = [
  {
    value: "INSTAGRAM",
    name: "인스타그램",
    icon: "📸",
    description: "사진·짧은 영상과 함께 올리는 게시물에 적합해요.",
  },
  {
    value: "NAVER_BLOG",
    name: "네이버 블로그",
    icon: "📝",
    description: "스토리텔링 중심의 긴 글에 잘 어울립니다.",
  },
  {
    value: "KAKAO_CHANNEL",
    name: "카카오 채널",
    icon: "💬",
    description: "학부모에게 전달하는 공지/요약 메시지에 좋아요.",
  },
];

const TONE_OPTIONS: Array<{
  value: MarketingTone;
  label: string;
  icon: string;
}> = [
  { value: "WARM_VIVID", label: "따뜻·생동", icon: "🌟" },
  { value: "CONCISE_NEUTRAL", label: "담백·간결", icon: "📝" },
  { value: "TRUST_CALM", label: "차분·신뢰", icon: "🤝" },
  { value: "UPBEAT_POSITIVE", label: "밝음·긍정", icon: "🎉" },
];

type MarketingGuidePageViewProps = {
  itemsCount: number;
  tone: MarketingTone;
  toneLabel: string;
  onToneChange: (value: MarketingTone) => void;
  speechStyle: MarketingSpeechStyle;
  onSpeechStyleChange: (value: MarketingSpeechStyle) => void;
  platformChoice: MarketingPlatform;
  onPlatformChange: (value: MarketingPlatform) => void;
  direction: string;
  onDirectionChange: (value: string) => void;
  bullets: string[];
  onAddBullet: () => void;
  onChangeBullet: (index: number, value: string) => void;
  onRemoveBullet: (index: number) => void;
  canProceed: boolean;
  onGoNext: () => void;
  onGoBack: () => void;
  fxActive: boolean;
  fxVariant: number;
  confirmDialog: React.ReactNode;
};

export function MarketingGuidePageView({
  itemsCount,
  tone,
  toneLabel,
  onToneChange,
  speechStyle,
  onSpeechStyleChange,
  platformChoice,
  onPlatformChange,
  direction,
  onDirectionChange,
  bullets,
  onAddBullet,
  onChangeBullet,
  onRemoveBullet,
  canProceed,
  onGoNext,
  onGoBack,
  fxActive,
  fxVariant,
  confirmDialog,
}: MarketingGuidePageViewProps) {
  return (
    <Page>
      {confirmDialog}
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
            <MetaPill>선택된 수업 {itemsCount}건</MetaPill>
            <MetaPill>현재 톤 {toneLabel}</MetaPill>
          </HeroMeta>
        </Hero>
      </Header>

      <Layout>
        <MainColumn>
          <GuideCard>
            <h2>작성 가이드 (선택)</h2>
            <p className="hint">
              콘텐츠 방향이나 강조할 메시지를 간단히 적어두면 다음 단계에서 참고해 드려요.
            </p>
            <StyledTextarea
              placeholder="예) 다음 주에는 실습 비중을 늘리고, 아이들 참여 사진을 강조"
              value={direction}
              onChange={(event) => onDirectionChange(event.target.value)}
              rows={5}
            />
          </GuideCard>

          <GuideCard>
            <h2>핵심 문장</h2>
            <p className="hint">2~3개가 적당해요. 학부모에게 전하고 싶은 문장을 적어주세요.</p>
            <BulletList>
              {bullets.map((bullet, index) => (
                <BulletItem key={index}>
                  <span className="index">#{index + 1}</span>
                  <input
                    value={bullet}
                    onChange={(event) => onChangeBullet(index, event.target.value)}
                    placeholder="핵심 문장을 입력하세요"
                  />
                  <GhostButtonSmall
                    as="button"
                    data-variant="danger"
                    onClick={() => void onRemoveBullet(index)}
                  >
                    삭제
                  </GhostButtonSmall>
                </BulletItem>
              ))}
              <PrimaryButtonSm type="button" onClick={onAddBullet}>
                + 항목 추가
              </PrimaryButtonSm>
            </BulletList>
          </GuideCard>
        </MainColumn>

        <Aside>
          <GuideCard>
            <h2>플랫폼 선택</h2>
            <p className="hint">콘텐츠를 게시할 채널을 먼저 선택해주세요.</p>
            <ChoiceGrid>
              {PLATFORM_OPTIONS.map((option) => (
                <ChoiceCard
                  key={option.value}
                  data-active={platformChoice === option.value}
                  onClick={() => onPlatformChange(option.value)}
                >
                  <span className="icon" role="img" aria-label={option.name}>
                    {option.icon}
                  </span>
                  <strong>{option.name}</strong>
                  <small>{option.description}</small>
                </ChoiceCard>
              ))}
            </ChoiceGrid>
          </GuideCard>

          <GuideCard>
            <h2>톤 & 문장 어미</h2>
            <p className="hint">말투와 어조를 설정하면 결과물에 그대로 반영돼요.</p>
            <SmallLabel>톤</SmallLabel>
            <ToneGrid>
              {TONE_OPTIONS.map((option) => (
                <ToneOption
                  key={option.value}
                  data-active={tone === option.value}
                  onClick={() => onToneChange(option.value)}
                >
                  <span>{option.icon}</span>
                  <span>{option.label}</span>
                </ToneOption>
              ))}
            </ToneGrid>
            <SmallLabel>문장 어미</SmallLabel>
            <ToneGrid>
              <ToneOption
                data-active={speechStyle === "SEUMNIDA"}
                onClick={() => onSpeechStyleChange("SEUMNIDA")}
              >
                <span>🧑‍🏫</span>
                <span>~습니다</span>
              </ToneOption>
              <ToneOption
                data-active={speechStyle === "YO"}
                onClick={() => onSpeechStyleChange("YO")}
              >
                <span>😊</span>
                <span>~요</span>
              </ToneOption>
            </ToneGrid>
          </GuideCard>
        </Aside>
      </Layout>

      <Footer>
        <GhostButtonSmall as="button" onClick={onGoBack}>
          ← 이전
        </GhostButtonSmall>
        <PrimaryButton as="button" onClick={onGoNext} disabled={!canProceed}>
          다음 단계
        </PrimaryButton>
      </Footer>

      {fxActive ? (
        <FXOverlay aria-live="polite">
          <FXCard>
            <FXTitle>두근두근! 다음 단계로 이동 중…</FXTitle>
            <FXEmojis data-variant={fxVariant} aria-hidden>
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
      ) : null}
    </Page>
  );
}

const Header = styled.header`
  display: grid;
  gap: 16px;
`;

const Stepper = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
`;

const Step = styled.span`
  color: inherit;
  &[data-active="true"] {
    color: #4f46e5;
  }
`;

const StepSep = styled.span`
  width: 20px;
  height: 1px;
  background: rgba(107, 114, 128, 0.35);
  display: inline-block;
`;

const Hero = styled.div`
  display: grid;
  gap: 12px;
  border-radius: 18px;
  background: linear-gradient(120deg, rgba(99, 102, 241, 0.08), rgba(59, 130, 246, 0.12));
  border: 1px solid rgba(99, 102, 241, 0.18);
  padding: 20px 24px;
`;

const HeroText = styled.div`
  h1 {
    margin: 0;
    font-size: 22px;
    color: #111827;
  }
  p {
    margin: 6px 0 0;
    color: #4b5563;
    font-size: 15px;
  }
`;

const HeroMeta = styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const MetaPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  background: rgba(59, 130, 246, 0.12);
  color: #1d4ed8;
`;

const Layout = styled.div`
  margin-top: 20px;
  display: grid;
  gap: 24px;
  grid-template-columns: 2fr 1fr;
  align-items: start;
  @media (max-width: 1080px) {
    grid-template-columns: 1fr;
  }
`;

const MainColumn = styled.div`
  display: grid;
  gap: 20px;
`;

const Aside = styled.div`
  display: grid;
  gap: 20px;
`;

const GuideCard = styled(SectionCard)`
  display: grid;
  gap: 12px;
  h2 {
    margin: 0;
    font-size: 18px;
    color: #0f172a;
  }
  .hint {
    margin: 0;
    font-size: 14px;
    color: #64748b;
  }
`;

const StyledTextarea = styled.textarea`
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 14px;
  font-size: 14px;
  resize: vertical;
  min-height: 120px;
  line-height: 1.6;
  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.18);
  }
`;

const BulletList = styled.div`
  display: grid;
  gap: 12px;
`;

const BulletItem = styled.div`
  display: grid;
  grid-template-columns: 56px 1fr auto;
  gap: 10px;
  align-items: center;
  .index {
    font-weight: 700;
    color: #4f46e5;
  }
  input {
    height: 44px;
    border-radius: 10px;
    border: 1px solid #e5e7eb;
    padding: 0 12px;
    font-size: 14px;
    &:focus {
      outline: none;
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.18);
    }
  }
  @media (max-width: 680px) {
    grid-template-columns: 1fr;
    .index {
      justify-self: flex-start;
    }
  }
`;

const ChoiceGrid = styled.div`
  display: grid;
  gap: 12px;
`;

const ChoiceCard = styled.button<{ "data-active"?: boolean }>`
  border: 1px solid rgba(148, 163, 184, 0.35);
  border-radius: 12px;
  padding: 14px;
  display: grid;
  gap: 6px;
  text-align: left;
  background: #ffffff;
  cursor: pointer;
  .icon {
    font-size: 20px;
  }
  strong {
    font-size: 15px;
    color: #111827;
  }
  small {
    font-size: 13px;
    color: #6b7280;
  }
  &[data-active="true"] {
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
  }
`;

const SmallLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #475569;
`;

const ToneGrid = styled.div`
  margin-top: 8px;
  display: grid;
  gap: 8px;
`;

const ToneOption = styled.button<{ "data-active"?: boolean }>`
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.35);
  background: #ffffff;
  font-size: 14px;
  cursor: pointer;
  span:first-child {
    font-size: 18px;
  }
  &[data-active="true"] {
    border-color: #4f46e5;
    background: rgba(79, 70, 229, 0.08);
  }
`;

const Footer = styled.footer`
  margin-top: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const FXOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.52);
  display: grid;
  place-items: center;
  z-index: 80;
  backdrop-filter: blur(2px);
`;

const FXCard = styled.div`
  width: min(420px, 92vw);
  padding: 32px;
  border-radius: 18px;
  background: #ffffff;
  display: grid;
  gap: 16px;
  text-align: center;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.2);
`;

const FXTitle = styled.h3`
  margin: 0;
  font-size: 20px;
  color: #1f2937;
`;

const floatKeys = keyframes`
  0% { transform: translateY(0); opacity: 0.2; }
  30% { opacity: 1; }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(-20px); opacity: 0; }
`;

const FXEmojis = styled.div<{ "data-variant"?: number }>`
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  span {
    font-size: 28px;
    animation: ${floatKeys} 2.2s ease-in-out infinite;
  }
  span:nth-child(odd) {
    animation-delay: 0.3s;
  }
  &[data-variant="2"] span:nth-child(3n) {
    animation-delay: 0.6s;
  }
  &[data-variant="3"] span:nth-child(4n) {
    animation-delay: 0.9s;
  }
`;

const FXBar = styled.div`
  width: 100%;
  height: 6px;
  background: rgba(229, 231, 235, 0.8);
  border-radius: 999px;
  overflow: hidden;
`;

const FXFill = styled.div`
  width: 100%;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #4f46e5, #22d3ee);
  animation: progressFill 0.75s ease forwards;

  @keyframes progressFill {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(0);
    }
  }
`;
