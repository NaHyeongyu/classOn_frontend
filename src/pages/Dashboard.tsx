import styled from "styled-components";
import { useDashboardSummary } from "@/hooks/useDashboardSummary";
import { DashboardGrid } from "@/components/dashboard/DashboardLayout";
import { Page as PageWrap, PageHeader, PrimaryBtn as LinkPrimary } from "@/components/common/UI";
import KpiTotalStudents from "@/components/dashboard/KpiTotalStudents";
import KpiAttendance from "@/components/dashboard/KpiAttendance";
import KpiClasses from "@/components/dashboard/KpiClasses";
 
// EN: Dashboard-level widgets rendered below the KPI row.
// KO: KPI 아래에 배치되는 대시보드 위젯들.
import DashboardAttendance from "@/components/dashboard/DashboardAttendance";
import DashboardClasses from "@/components/dashboard/DashboardClasses";
// 결제 위젯은 MVP에서 제외

export default function Dashboard() {
  const { status, data, error, refresh } = useDashboardSummary();
  // Demo data seeding controls removed for production use
  const sharedKpiProps = {
    data,
    loading: status === "loading",
    error: Boolean(error),
    onRetry: refresh,
  };

  return (
    <PageWrap>
      <DashboardGrid>
        <PageHead>
          <div>
            <h2>대시보드</h2>
          </div>
          <Actions>
            <LinkPrimary to="/students/new">원생 추가</LinkPrimary>
            <LinkPrimary to="/classes/new">수업 추가</LinkPrimary>
          </Actions>
        </PageHead>
        {/* 1행: KPI 4개 */}

        <KpiTotalStudents {...sharedKpiProps} />
        <KpiAttendance {...sharedKpiProps} />
        <KpiClasses {...sharedKpiProps} />

        {/* 2행: 좌측 출석, 우측 수업(2행 차지). 보조 패널(미처리/이탈) 제거 */}
        <DashboardAttendance />
        <DashboardClasses />
        {/* Removed: <DashboardRiskAndUnprocessed /> */}

        {/* 3행 결제 패널 제외 (MVP) */}
      </DashboardGrid>
    </PageWrap>
  );
}

// Header actions container
const Actions = styled.div`
  display: inline-flex;
  gap: ${(p) => p.theme.spacing.sm};
  align-items: center;
  flex-wrap: wrap;
`;

// Ensure header spans full grid width at top row
const PageHead = styled(PageHeader)`
  grid-column: 1 / -1;
`;
