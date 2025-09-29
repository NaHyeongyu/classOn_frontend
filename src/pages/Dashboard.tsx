import styled from "styled-components";
import { useDashboardSummary } from "@/hooks/useDashboardSummary";
import { DashboardGrid } from "@/components/dashboard/DashboardLayout";
import { PageHeader, PrimaryBtn as LinkPrimary } from "@/components/common/UI";
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

  return (
    <DashboardGrid>
      <PageHead>
        <div>
          <h2>대시보드</h2>
          <p>학원 현황을  한눈에 확인해보세요!</p>
        </div>
        <Actions>
          <LinkPrimary to="/students/new">원생 추가</LinkPrimary>
          <LinkPrimary to="/classes/new">수업 추가</LinkPrimary>
        </Actions>
      </PageHead>
      {/* 1행: KPI 4개 */}

      <KpiTotalStudents
        data={data}
        loading={status === "loading"}
        error={!!error}
        onRetry={refresh}
      />
      <KpiAttendance
        data={data}
        loading={status === "loading"}
        error={!!error}
        onRetry={refresh}
      />
      <KpiClasses
        data={data}
        loading={status === "loading"}
        error={!!error}
        onRetry={refresh}
      />

      {/* 2행: 좌측 출석, 우측 수업 (우측은 2행 차지) */}
      <DashboardAttendance />
      <DashboardClasses />

      {/* 3행 결제 패널 제외 (MVP) */}
    </DashboardGrid>
  );
}

// Header actions container
const Actions = styled.div`
  display: inline-flex;
  gap: 8px;
  align-items: center;
`;

// Ensure header spans full grid width at top row
const PageHead = styled(PageHeader)`
  grid-column: 1 / -1;
`;
