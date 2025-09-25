 
import styled from "styled-components";
import { useDashboardSummary } from "../hooks/useDashboardSummary";
import { DashboardGrid } from "../components/dashboard/DashboardLayout";
import { GhostBtn as LinkBtn, PrimaryBtn as LinkPrimary } from "../components/common/UI";
import { useNavigate } from "react-router-dom";
import KpiTotalStudents from "../components/dashboard/KpiTotalStudents";
import KpiRevenue from "../components/dashboard/KpiRevenue";
import KpiAttendance from "../components/dashboard/KpiAttendance";
import KpiClasses from "../components/dashboard/KpiClasses";
 
// EN: Dashboard-level widgets rendered below the KPI row.
// KO: KPI 아래에 배치되는 대시보드 위젯들.
import DashboardAttendance from "../components/dashboard/DashboardAttendance";
import DashboardClasses from "../components/dashboard/DashboardClasses";
// 결제 위젯은 MVP에서 제외

export default function Dashboard() {
  const navigate = useNavigate();
  const { status, data, error, refresh } = useDashboardSummary();
  // Demo data seeding controls removed for production use

  return (
    <DashboardGrid>
      <QuickBar>
        <LinkPrimary to="/students/new">원생 추가</LinkPrimary>
        <LinkPrimary to="/classes/new">수업 추가</LinkPrimary>
        <LinkBtn to={`/calendar/${new Date().toISOString().slice(0,10)}`}>오늘 수업 보기</LinkBtn>
      </QuickBar>
      {/* 1행: KPI 4개 */}

      <KpiTotalStudents
        data={data}
        loading={status === "loading"}
        error={!!error}
        onRetry={refresh}
      />
      <KpiRevenue
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

// Demo seeding components removed
const QuickBar = styled.div`
  grid-column: 1 / -1;
  display: inline-flex; gap: 8px; align-items: center; margin-bottom: 4px;
`;
