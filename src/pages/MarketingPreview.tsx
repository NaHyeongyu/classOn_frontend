import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Page, SectionCard, GhostButtonSmall, PrimaryButtonSm, buttonVariants } from "@/components/common/UI";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import type { SummarizeItem } from "@/api/summarize";
import {
  MARKETING_FORMAT_STYLE_LABELS,
  MARKETING_FORMAT_STYLE_OPTIONS,
  MARKETING_PLATFORM_OPTIONS,
  MARKETING_SPEECH_STYLE_OPTIONS,
  MARKETING_SPEECH_STYLE_LABELS,
  MARKETING_TONE_LABELS,
} from "@/features/marketing/constants";
import type {
  MarketingFormatStyle,
  MarketingSessionPayload,
  MarketingSpeechStyle,
  MarketingPlatform,
} from "@/features/marketing/types";

export default function MarketingPreview() {
  const { state } = useLocation() as { state?: MarketingSessionPayload };
  const items: SummarizeItem[] = state?.items ?? [];
  const direction = state?.direction ?? "";
  const summary = state?.summary;
  const tone = state?.tone ?? "WARM_VIVID";
  const navigate = useNavigate();

  const initialBullets = summary?.bullets ?? state?.bullets ?? [];
  const [bullets, setBullets] = useState<string[]>(initialBullets);
  const [speechStyle, setSpeechStyle] = useState<MarketingSpeechStyle>(state?.speechStyle ?? "SEUMNIDA");
  const [platformChoice, setPlatformChoice] = useState<MarketingPlatform>(state?.platformChoice ?? "INSTAGRAM");
  const [formatStyle, setFormatStyle] = useState<MarketingFormatStyle>(state?.formatStyle ?? "STORY");
  const [pendingDeleteIndex, setPendingDeleteIndex] = useState<number | null>(null);

  const toneLabel = MARKETING_TONE_LABELS[tone] ?? tone;
  const speechLabel = MARKETING_SPEECH_STYLE_LABELS[speechStyle];
  const pendingBulletLabel = pendingDeleteIndex !== null ? `#${pendingDeleteIndex + 1}` : "";

  const handleNext = () => {
    navigate("/marketing/rendering", {
      state: {
        ...state,
        items,
        direction,
        bullets,
        tone,
        speechStyle,
        platformChoice,
        formatStyle,
        summary,
      },
    });
  };

  const renderFallbackSummary = (rows: SummarizeItem[], fallbackDirection: string) => {
    const max = 6;
    const lines = rows.slice(0, max).map((row) => `• ${row.date}${row.courseTitle ? ` [${row.courseTitle}]` : ""}: ${row.content || ""}`);
    const more = rows.length > max ? `\n... (외 ${rows.length - max}행)` : "";
    const text = fallbackDirection.trim() ? fallbackDirection.trim() : `${lines.join("\n")}${more}`;
    return (
      <SummaryBody>
        <p style={{ whiteSpace: "pre-wrap" }}>{text}</p>
      </SummaryBody>
    );
  };

  return (
    <Page>
      <Stepper>
        <Step data-active={false} data-done={true} aria-current={false}>
          1. 작성 가이드
        </Step>
        <StepSep />
        <Step data-active aria-current="step">
          2. 전송 미리보기
        </Step>
        <StepSep />
        <Step data-active={false} aria-current={false}>
          3. 생성/편집
        </Step>
      </Stepper>

      <Header>
        <Hero>
          <HeroText>
            <h1>전송 전 내용을 한번 더 점검해요</h1>
            <p>요약과 핵심 문장을 확인하고 설정을 마친 뒤 다음 단계로 넘어가세요.</p>
          </HeroText>
          <HeroMeta>
            <MetaPill>선택 항목 {items.length}건</MetaPill>
            <MetaPill>톤 {toneLabel}</MetaPill>
            <MetaPill>말투 {speechLabel}</MetaPill>
          </HeroMeta>
        </Hero>
      </Header>

      <Layout>
        <MainColumn>
          <GuideCard>
            <h2>AI 요약 내용</h2>
            <p className="hint">최근 수업 활동을 분석한 결과를 확인하세요.</p>
            <SummaryBox>
              {summary?.summary ? (
                <SummaryBody>
                  <p style={{ whiteSpace: "pre-wrap" }}>{summary.summary}</p>
                </SummaryBody>
              ) : (
                renderFallbackSummary(items, direction)
              )}
            </SummaryBox>
          </GuideCard>

          <GuideCard>
            <h2>핵심 문장</h2>
            <p className="hint">핵심 문장을 검토하고 바로 수정할 수 있어요.</p>
            <BulletList role="list">
              {bullets.length === 0 ? (
                <EmptyHint>핵심 문장이 아직 없습니다. 아래 버튼으로 추가해 보세요.</EmptyHint>
              ) : (
                bullets.map((value, index) => (
                  <BulletItem key={index}>
                    <span className="index">#{index + 1}</span>
                    <AddInput
                      value={value}
                      onChange={(event) => {
                        const copy = bullets.slice();
                        copy[index] = event.target.value;
                        setBullets(copy);
                      }}
                      placeholder={`핵심 내용 ${index + 1}`}
                    />
                    <GhostButtonSmall
                      as="button"
                      data-variant="danger"
                      onClick={() => setPendingDeleteIndex(index)}
                    >
                      삭제
                    </GhostButtonSmall>
                  </BulletItem>
                ))
              )}
            </BulletList>
            <div>
              <PrimaryButtonSm type="button" onClick={() => setBullets([...bullets, ""]) }>
                + 항목 추가
              </PrimaryButtonSm>
            </div>
          </GuideCard>
        </MainColumn>

        <Aside>
          <GuideCard>
            <h2>플랫폼 선택</h2>
            <p className="hint">콘텐츠를 게시할 채널을 선택하세요.</p>
            <ChoiceGrid>
              {MARKETING_PLATFORM_OPTIONS.map((option) => (
                <ChoiceCard
                  key={option.value}
                  data-active={platformChoice === option.value}
                  onClick={() => setPlatformChoice(option.value)}
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
            <p className="hint">말투와 양식을 설정하면 결과물에 반영돼요.</p>
            <SmallLabel>문장 어미</SmallLabel>
            <ToneGrid>
              {MARKETING_SPEECH_STYLE_OPTIONS.map((option) => (
                <ToneOption
                  key={option.value}
                  data-active={speechStyle === option.value}
                  onClick={() => setSpeechStyle(option.value)}
                >
                  <span>{option.emoji}</span>
                  <span>{option.label}</span>
                </ToneOption>
              ))}
            </ToneGrid>
            <SmallLabel>양식</SmallLabel>
            <ToneGrid>
              {MARKETING_FORMAT_STYLE_OPTIONS.map((option) => (
                <ToneOption
                  key={option.value}
                  data-active={formatStyle === option.value}
                  onClick={() => setFormatStyle(option.value)}
                >
                  <span>{option.emoji}</span>
                  <span>{option.label}</span>
                </ToneOption>
              ))}
            </ToneGrid>
          </GuideCard>
        </Aside>
      </Layout>

      <Footer>
        <GhostButtonSmall as="button" onClick={() => navigate("/marketing")}>← 이전</GhostButtonSmall>
        <ActionButton type="button" onClick={handleNext} disabled={!items.length}>
          다음 단계
        </ActionButton>
      </Footer>
      <ConfirmDialog
        open={pendingDeleteIndex !== null}
        title="항목을 삭제할까요?"
        message={pendingBulletLabel ? `${pendingBulletLabel} 핵심 문장을 삭제합니다.` : "선택한 항목을 삭제합니다."}
        confirmLabel="삭제"
        cancelLabel="취소"
        tone="danger"
        onConfirm={() => {
          if (pendingDeleteIndex === null) return;
          setBullets((prev) => prev.filter((_, idx) => idx !== pendingDeleteIndex));
          setPendingDeleteIndex(null);
        }}
        onCancel={() => setPendingDeleteIndex(null)}
      />
    </Page>
  );
}

const Stepper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
`;

const Step = styled.div`
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.colors.border };
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted };
  &[data-active='true'] {
    background: ${({ theme }) => theme.colors.primarySurface };
    color: ${({ theme }) => theme.colors.primary };
    border-color: ${({ theme }) => theme.colors.border };
    font-weight: 800;
  }
  &[data-done='true'] {
    background: ${({ theme }) => theme.colors.surfaceMuted };
    color: ${({ theme }) => theme.colors.text };
  }
`;

const StepSep = styled.span`
  width: 10px;
  height: 1px;
  background: ${({ theme }) => theme.colors.border };
  display: inline-block;
`;

const Header = styled.header`
  display: grid;
  gap: 16px;
  margin-bottom: 12px;
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
  h1 {
    margin: 0;
    font-size: 24px;
    font-weight: 800;
    color: #111827;
  }
  p {
    margin: 0;
    font-size: 14px;
    color: #475569;
  }
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
  h2 {
    margin: 0;
    font-size: 18px;
    color: #111827;
  }
  .hint {
    margin: 0;
    font-size: 13px;
    color: #64748b;
  }
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
  p {
    margin: 0;
  }
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
  gap: 12px;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border };
  background: ${({ theme }) => theme.colors.surfaceMuted };
  .index {
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text };
  }
`;

const AddInput = styled.input`
  flex: 1;
  min-width: 0;
  height: 40px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border };
  padding: 0 12px;
  background: #fff;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text };
`;

const EmptyHint = styled.div`
  display: grid;
  place-items: center;
  padding: 14px;
  border-radius: 12px;
  border: 1px dashed ${({ theme }) => theme.colors.border };
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted };
`;

const ChoiceGrid = styled.div`
  display: grid;
  gap: 10px;
`;

const ChoiceCard = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  text-align: left;
  border-radius: 16px;
  border: 1px solid rgba(203, 213, 225, 0.7);
  background: #ffffff;
  cursor: pointer;
  transition: border-color 0.18s ease, box-shadow 0.18s ease, transform 0.1s ease;
  .icon {
    font-size: 20px;
  }
  .text {
    display: grid;
    gap: 4px;
  }
  strong {
    font-size: 14px;
    color: #111827;
  }
  small {
    font-size: 12px;
    color: #64748b;
  }
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
  padding: 9px 12px;
  border-radius: 999px;
  border: 1px solid rgba(203, 213, 225, 0.8);
  background: #fff;
  cursor: pointer;
  font-size: 13px;
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
  &[data-active='true'] {
    background: rgba(99, 102, 241, 0.16);
    color: #4338ca;
    border-color: rgba(99, 102, 241, 0.4);
    font-weight: 700;
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 18px;
`;

const ActionButton = styled.button`
  ${buttonVariants.primary};
  min-width: 148px;
  height: 44px;
  font-size: 15px;
  font-weight: 700;
  border-radius: ${({ theme }) => theme.radii.md};
  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;
