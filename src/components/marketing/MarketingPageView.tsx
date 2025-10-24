import styled from "styled-components";
import { GhostBtnSmall as UIGhostBtnSmall, PageHeader } from "@/components/common/UI";
import { MarketingFilterPanel } from "@/components/marketing/MarketingFilterPanel";
import { MarketingResultsPanel } from "@/components/marketing/MarketingResultsPanel";

type MarketingFilterPanelProps = React.ComponentProps<typeof MarketingFilterPanel>;
type MarketingResultsPanelProps = React.ComponentProps<typeof MarketingResultsPanel>;

type MarketingPageViewProps = {
  filterProps: MarketingFilterPanelProps;
  resultsProps: MarketingResultsPanelProps;
};

export function MarketingPageView({ filterProps, resultsProps }: MarketingPageViewProps) {
  return (
    <Viewport>
      <HeaderWrap>
        <PageHeader>
          <div>
            <h2>마케팅</h2>
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
        <FilterColumn>
          <MarketingFilterPanel {...filterProps} />
        </FilterColumn>
        <ResultColumn>
          <MarketingResultsPanel {...resultsProps} />
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
`;

const HeaderWrap = styled.div`
  padding: 0 ${(p) => p.theme.spacing.xs};
  display: grid;
  gap: ${(p) => p.theme.spacing.sm};
`;

const BetaNotice = styled.div`
  padding: 10px ${(p) => p.theme.spacing.sm};
  border-radius: ${(p) => p.theme.radii.md};
  background: #eef2ff;
  border: 1px solid #c7d2fe;
  color: #312e81;
  font-size: ${(p) => p.theme.font.size.sm};
  line-height: 1.5;
  display: grid;
  gap: 4px;
  strong {
    font-weight: 700;
  }
  p {
    margin: 0;
  }
`;

const HeaderActions = styled.div`
  display: inline-flex;
  gap: ${(p) => p.theme.spacing.sm};
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
  @media (min-width: 1120px) {
    grid-template-columns: 360px 1fr;
  }
`;

const FilterColumn = styled.div`
  display: flex;
  min-height: 0;
  overflow: hidden;
`;

const ResultColumn = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.xl};
  min-height: 0;
`;
