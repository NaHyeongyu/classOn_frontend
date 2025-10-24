import ConfirmDialog from "@/components/common/ConfirmDialog";
import { Page, GhostButtonSmall, PrimaryButtonSm } from "@/components/common/UI";
import {
  MARKETING_FORMAT_STYLE_OPTIONS,
  MARKETING_PLATFORM_OPTIONS,
  MARKETING_SPEECH_STYLE_OPTIONS,
} from "@/features/marketing/constants";
import {
  marketingDirectionAssetLabel,
  marketingDirectionPlatformLabel,
} from "@/features/marketing/utils";
import type { MarketingDirection } from "@/features/marketing/types";
import type { UseMarketingPreviewReturn } from "@/features/marketing/preview/types";
import {
  Stepper,
  Step,
  StepSep,
  Header,
  Hero,
  HeroText,
  HeroMeta,
  MetaPill,
  Layout,
  MainColumn,
  Aside,
  GuideCard,
  SummaryBox,
  SummaryBody,
  DirectionList,
  DirectionCard,
  DirectionCardHeader,
  DirectionBadge,
  DirectionPlatform,
  DirectionTitle,
  DirectionBecause,
  DirectionHook,
  DirectionTags,
  DirectionTag,
  DirectionSelectLabel,
  DirectionEditor,
  DirectionEditorLabel,
  DirectionTextarea,
  DirectionHint,
  BulletList,
  BulletItem,
  AddInput,
  ChoiceGrid,
  ChoiceCard,
  SmallLabel,
  ToneGrid,
  ToneOption,
  Footer,
  ActionButton,
  EmptyHint,
} from "@/components/marketing/MarketingPreview.styles";

type MarketingPreviewPageViewProps = UseMarketingPreviewReturn;

export function MarketingPreviewPageView({
  state,
  computed,
  dialog,
  handlers,
}: MarketingPreviewPageViewProps) {
  const { directionText, selectedDirectionIndex, bullets, speechStyle, platformChoice, formatStyle } = state;
  const { items, toneLabel, speechLabel, directions, summary } = computed;
  const { pendingDeleteIndex, setPendingDeleteIndex } = dialog;
  const {
    handleSelectDirection,
    handleDirectionChange,
    handleAddBullet,
    handleUpdateBullet,
    handleDeleteBullet,
    handleSpeechChange,
    handlePlatformChange,
    handleFormatChange,
    handleNext,
  } = handlers;

  const pendingBulletLabel = pendingDeleteIndex !== null ? `#${pendingDeleteIndex + 1}` : "";

  const renderFallbackSummary = (rows: typeof items, fallbackDirection: string) => {
    const max = 6;
    const lines = rows
      .slice(0, max)
      .map((row) => `• ${row.date}${row.courseTitle ? ` [${row.courseTitle}]` : ""}: ${row.content || ""}`);
    const more = rows.length > max ? `\n... (외 ${rows.length - max}행)` : "";
    const text = fallbackDirection.trim() ? fallbackDirection.trim() : `${lines.join("\n")}${more}`;
    return (
      <SummaryBody>
        <p>{text}</p>
      </SummaryBody>
    );
  };

  return (
    <Page>
      <Stepper>
        <Step data-active={false} data-done aria-current={false}>
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
                  <p>{summary.summary}</p>
                </SummaryBody>
              ) : (
                renderFallbackSummary(items, directionText)
              )}
            </SummaryBox>
          </GuideCard>

          <GuideCard>
            <h2>콘텐츠 방향 제안</h2>
            <p className="hint">AI가 추천한 방향을 선택하고 필요하면 내용을 다듬어 주세요.</p>
            {directions.length ? (
              <DirectionList role="list">
                {directions.map((dir, index) => (
                  <DirectionCard
                    key={index}
                    type="button"
                    role="listitem"
                    data-active={selectedDirectionIndex === index || undefined}
                    aria-pressed={selectedDirectionIndex === index}
                    onClick={() => handleSelectDirection(index)}
                  >
                    <DirectionCardHeader>
                      <DirectionBadge>추천 #{index + 1}</DirectionBadge>
                      {dir.platform ? (
                        <DirectionPlatform>{marketingDirectionPlatformLabel(dir.platform)}</DirectionPlatform>
                      ) : null}
                    </DirectionCardHeader>
                    <DirectionTitle>{dir.title || `콘텐츠 방향 ${index + 1}`}</DirectionTitle>
                    {dir.because ? <DirectionBecause>{dir.because}</DirectionBecause> : null}
                    {dir.hook ? <DirectionHook aria-label="hook">“{dir.hook}”</DirectionHook> : null}
                    <DirectionTags>
                      <DirectionBadgeGroup direction={dir} />
                    </DirectionTags>
                    <DirectionSelectLabel aria-hidden>
                      {selectedDirectionIndex === index ? "선택됨" : "이 방향 사용"}
                    </DirectionSelectLabel>
                  </DirectionCard>
                ))}
              </DirectionList>
            ) : (
              <EmptyHint>추천 방향이 없어요. 아래 입력 칸에 직접 작성해 주세요.</EmptyHint>
            )}
            <DirectionEditor>
              <DirectionEditorLabel>선택한 방향 (수정 가능)</DirectionEditorLabel>
              <DirectionTextarea
                value={directionText}
                onChange={(event) => handleDirectionChange(event.currentTarget.value)}
                placeholder="예) 실습 과정을 사진으로 보여 주고, 오답 교정을 강조해 주세요."
                rows={4}
              />
              <DirectionHint>이 내용은 다음 단계에서 플랫폼별 문장을 생성할 때 참고합니다.</DirectionHint>
            </DirectionEditor>
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
                      onChange={(event) => handleUpdateBullet(index, event.target.value)}
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
              <PrimaryButtonSm type="button" onClick={handleAddBullet}>
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
                  onClick={() => handlePlatformChange(option.value)}
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
                  onClick={() => handleSpeechChange(option.value)}
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
                  onClick={() => handleFormatChange(option.value)}
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
        <GhostButtonSmall as="button" onClick={() => window.history.back()}>
          ← 이전
        </GhostButtonSmall>
        <ActionButton type="button" onClick={handleNext} disabled={!items.length}>
          다음 단계
        </ActionButton>
      </Footer>
      <ConfirmDialog
        open={pendingDeleteIndex !== null}
        title="항목을 삭제할까요?"
        message={
          pendingBulletLabel ? `${pendingBulletLabel} 핵심 문장을 삭제합니다.` : "선택한 항목을 삭제합니다."
        }
        confirmLabel="삭제"
        cancelLabel="취소"
        tone="danger"
        onConfirm={handleDeleteBullet}
        onCancel={() => setPendingDeleteIndex(null)}
      />
    </Page>
  );
}

function DirectionBadgeGroup({ direction }: { direction: MarketingDirection }) {
  return (
    <>
      {direction.asset ? (
        <DirectionTag>{marketingDirectionAssetLabel(direction.asset)}</DirectionTag>
      ) : null}
      {direction.platform ? (
        <DirectionTag tone="neutral">{marketingDirectionPlatformLabel(direction.platform)}</DirectionTag>
      ) : null}
    </>
  );
}
