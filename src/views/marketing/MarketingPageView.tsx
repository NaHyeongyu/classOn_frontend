import styled from "styled-components";
import { 
  GhostBtnSmall as UIGhostBtnSmall, 
  PageHeader,
  PrimaryButton,
  GhostButtonSmall,
} from "@/components/common/UI";
import { MarketingClassSelector } from "@/components/marketing/MarketingClassSelector";
import { MarketingPeriodSelector } from "@/components/marketing/MarketingPeriodSelector";
import { MarketingResultsPanel } from "@/components/marketing/MarketingResultsPanel";
import { useDashboardSummary } from "@/hooks/useDashboardSummary";

type MarketingClassSelectorProps = React.ComponentProps<typeof MarketingClassSelector>;
type MarketingPeriodSelectorProps = React.ComponentProps<typeof MarketingPeriodSelector>;
type MarketingResultsPanelProps = React.ComponentProps<typeof MarketingResultsPanel>;

type MarketingPageViewProps = {
  classSelectorProps: MarketingClassSelectorProps;
  periodSelectorProps: MarketingPeriodSelectorProps;
  resultsProps: MarketingResultsPanelProps;
};

export function MarketingPageView({
  classSelectorProps,
  periodSelectorProps,
  resultsProps,
}: MarketingPageViewProps) {
  const summary = useDashboardSummary();
  const limit = summary.data?.marketingLimit ?? null;
  const used = summary.data?.marketingUsed ?? null;
  const remaining =
    summary.data?.marketingRemaining ??
    (limit != null && used != null ? Math.max(0, limit - used) : null);
  const quotaRemaining =
    remaining ?? (limit != null && used != null ? Math.max(0, limit - used) : null);
  const quotaExhausted = limit != null && quotaRemaining != null ? quotaRemaining <= 0 : false;
  const loading = summary.status === "loading" && !summary.data;
  const quotaError = summary.status === "error";
  const quotaText = loading
    ? "불러오는 중…"
    : quotaError
      ? "불러오기 실패"
      : limit != null
        ? `${Math.max(0, remaining ?? (used != null ? limit - used : limit))} / ${limit}회 남음`
        : "무제한";

  return (
    <Viewport>
      <HeaderWrap>
        <PageHeader>
          <div>
            <TitleRow>
              <h2>마케팅</h2>
              <TitleBadge>
                {quotaText}
              </TitleBadge>
            </TitleRow>
            <p>수업 기록을 모아 AI 요약과 콘텐츠로 이어가세요.</p>
          </div>
          <HeaderActions>
            <UIGhostBtnSmall to="/marketing/saved">저장 내역</UIGhostBtnSmall>
            <UIGhostBtnSmall to="/classes">수업 관리</UIGhostBtnSmall>
          </HeaderActions>
        </PageHeader>
        <BetaNotice role="status">
          <strong>안내</strong>
          <p>마케팅 기능 출력 결과가 아직 원활하지 않을 수 있습니다.</p>
          <p>빠른시일 내 데이터를 확인 &amp; 분석해서 개선하겠습니다.</p>
        </BetaNotice>
      </HeaderWrap>

      <ContentGrid>
        <Column>
          <MarketingClassSelector {...classSelectorProps} />
        </Column>
        <PeriodColumn>
          <MarketingPeriodSelector {...periodSelectorProps} />
          <PeriodActions>
            <PrimaryButton 
              type="button" 
              onClick={periodSelectorProps.onSubmit} 
              disabled={periodSelectorProps.loading || quotaExhausted}
            >
              {periodSelectorProps.loading ? "조회 중..." : quotaExhausted ? "한도 초과" : "조회하기"}
            </PrimaryButton>
            <GhostButtonSmall 
              as="button" 
              type="button" 
              onClick={periodSelectorProps.onReset}
            >
              초기화
            </GhostButtonSmall>
          </PeriodActions>
        </PeriodColumn>
        <ResultColumn>
          <MarketingResultsPanel quotaText={quotaText} {...resultsProps} />
        </ResultColumn>
      </ContentGrid>
    </Viewport>
  );
}

const Viewport = styled.div`
  height: calc(100vh - 48px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  gap: ${(p) => p.theme.spacing.xl};
`;

const HeaderWrap = styled.div`
  padding: 0 ${(p) => p.theme.spacing.xs};
  display: grid;
  gap: ${(p) => p.theme.spacing.lg};
`;

const TitleRow = styled.div`
  display: inline-flex;
  gap: ${(p) => p.theme.spacing.xs};
  align-items: center;
  flex-wrap: wrap;
`;

const TitleBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing.xs};
  padding: 6px 10px;
  border-radius: 999px;
  background: #ecfdf3;
  border: 1px solid #bbf7d0;
  color: #166534;
  font-size: ${(p) => p.theme.font.size.xs};
  font-weight: 700;
`;

const BetaNotice = styled.div`
  padding: ${(p) => p.theme.spacing.sm};
  border-radius: ${(p) => p.theme.radii.md};
  background: #eef2ff;
  border: 1px solid #c7d2fe;
  color: #312e81;
  font-size: ${(p) => p.theme.font.size.sm};
  line-height: 1.5;
  display: grid;
  gap: ${(p) => p.theme.spacing.xs};
  width: 100%;
  strong {
    font-weight: 700;
  }
  p {
    margin: 0;
  }
`;

const HeaderActions = styled.div`
  display: inline-flex;
  gap: ${(p) => p.theme.spacing.md};
  flex-wrap: wrap;
  justify-content: flex-end;
`;

const ContentGrid = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.xl};
  grid-template-columns: 1fr;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  
  /* 3-column layout for larger screens */
  @media (min-width: 1280px) {
    grid-template-columns: 320px 320px 1fr;
  }
  /* Stacked layout for smaller screens */
  @media (max-width: 1279px) {
    overflow-y: auto;
    grid-template-columns: 1fr;
    padding-bottom: 24px;
  }
`;

const Column = styled.div`
  display: flex;
  min-height: 0;
  overflow: hidden;
  /* Allow height to grow in stacked mode */
  @media (max-width: 1279px) {
    min-height: auto;
    overflow: visible;
  }
`;

const ResultColumn = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.xl};
  min-height: 0;
  /* Allow height to grow in stacked mode */
  @media (max-width: 1279px) {
    min-height: auto;
  }
`;

const PeriodColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing.lg};
  min-height: 0;
  /* Allow height to grow in stacked mode */
  @media (max-width: 1279px) {
    min-height: auto;
    overflow: visible;
  }
`;

const PeriodActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${(p) => p.theme.spacing.md};
`;
