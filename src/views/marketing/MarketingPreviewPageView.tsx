import ConfirmDialog from "@/components/common/ConfirmDialog";
import BackButton from "@/components/common/BackButton";
import { Page, GhostButtonSmall, PrimaryButtonSm } from "@/components/common/UI";
import type { UseMarketingPreviewReturn } from "@/features/marketing/preview/types";
import {
  Stepper,
  Step,
  StepSep,
  Header,
  Hero,
  HeroText,
  Layout,
  MainColumn,
  Aside,
  GuideCard,
  SummaryBox,
  SummaryBody,
  DirectionBadge,
  BulletList,
  BulletItem,
  AddInput,
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
  const { bullets } = state;
  const { items, summary } = computed;
  const { pendingDeleteIndex, setPendingDeleteIndex } = dialog;
  const {
    handleAddBullet,
    handleUpdateBullet,
    handleDeleteBullet,
    handleNext,
  } = handlers;

  const pendingBulletLabel = pendingDeleteIndex !== null ? `#${pendingDeleteIndex + 1}` : "";

  const renderFallbackSummary = (rows: typeof items) => {
    const max = 6;
    const lines = rows
      .slice(0, max)
      .map((row) => `• ${row.date}${row.courseTitle ? ` [${row.courseTitle}]` : ""}: ${row.content || ""}`);
    const more = rows.length > max ? `\n... (외 ${rows.length - max}행)` : "";
    const text = `${lines.join("\n")}${more}`;
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
            <p>AI 요약과 핵심 내용을 확인하고 설정을 마친 뒤 다음 단계로 넘어가세요.</p>
          </HeroText>
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
                renderFallbackSummary(items)
              )}
            </SummaryBox>
          </GuideCard>

          <GuideCard>
            <h2>핵심 내용</h2>
            <p className="hint">핵심 내용을 검토하고 바로 수정할 수 있어요.</p>
            <BulletList role="list">
              {bullets.length === 0 ? (
                <EmptyHint>핵심 내용이 아직 없습니다. 아래 버튼으로 추가해 보세요.</EmptyHint>
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
            <h2>발행 채널</h2>
            <p className="hint">현재 인스타그램만 지원합니다.</p>
            <DirectionBadge>인스타그램</DirectionBadge>
          </GuideCard>
        </Aside>
      </Layout>

      <Footer>
        <BackButton size="md" label="뒤로" />
        <ActionButton type="button" onClick={handleNext} disabled={!items.length}>
          다음 단계
        </ActionButton>
      </Footer>
      <ConfirmDialog
        open={pendingDeleteIndex !== null}
        title="항목을 삭제할까요?"
        message={
          pendingBulletLabel ? `${pendingBulletLabel} 핵심 내용을 삭제합니다.` : "선택한 항목을 삭제합니다."
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
