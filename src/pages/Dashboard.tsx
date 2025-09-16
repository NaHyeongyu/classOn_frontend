 
import { useDashboardSummary } from "../hooks/useDashboardSummary";
import { DashboardGrid, DashboardPanel } from "../components/dashboard/DashboardLayout";
import KpiTotalStudents from "../components/dashboard/KpiTotalStudents";
import KpiRevenue from "../components/dashboard/KpiRevenue";
import KpiAttendance from "../components/dashboard/KpiAttendance";
import KpiClasses from "../components/dashboard/KpiClasses";
 
// EN: Dashboard-level widgets (e.g., "Today's Todos").
// KO: 대시보드 위젯 (예: 오늘 할 일).
import DashboardTodos from "../components/dashboard/DashboardTodos";
import DashboardAttendance from "../components/dashboard/DashboardAttendance";
import DashboardClasses from "../components/dashboard/DashboardClasses";

export default function Dashboard() {
  const { status, data, error, refresh } = useDashboardSummary();
  // Demo data seeding controls removed for production use

  return (
    <DashboardGrid>
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

      {/* 2행: 좌우 1:1 */}
      <DashboardAttendance />
      <DashboardPanel span={6} bg="#ffffff">
        <DashboardTodos />
      </DashboardPanel>

      {/* 3행: 좌우 1:1 */}
      <DashboardClasses />
      <DashboardPanel span={6} bg="#fae8ff">미납 내역</DashboardPanel>
    </DashboardGrid>
  );
}

// Demo seeding components removed
