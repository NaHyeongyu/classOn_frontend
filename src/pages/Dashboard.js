import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    return (_jsxs(DashboardGrid, { children: [_jsx(KpiTotalStudents, { data: data, loading: status === "loading", error: !!error, onRetry: refresh }), _jsx(KpiRevenue, { data: data, loading: status === "loading", error: !!error, onRetry: refresh }), _jsx(KpiAttendance, { data: data, loading: status === "loading", error: !!error, onRetry: refresh }), _jsx(KpiClasses, { data: data, loading: status === "loading", error: !!error, onRetry: refresh }), _jsx(DashboardAttendance, {}), _jsx(DashboardPanel, { span: 6, bg: "#ffffff", children: _jsx(DashboardTodos, {}) }), _jsx(DashboardClasses, {}), _jsx(DashboardPanel, { span: 6, bg: "#fae8ff", children: "\uBBF8\uB0A9 \uB0B4\uC5ED" })] }));
}
