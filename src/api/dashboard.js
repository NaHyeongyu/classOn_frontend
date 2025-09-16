import { fetchJSON } from "../lib/fetcher";
export async function getAttendanceToday() {
    return await fetchJSON(`/api/dashboard/attendance-today`);
}
export async function fetchDashboardSummary() {
    return await fetchJSON(`/api/dashboard/summary`);
}
// Removed unused getClassesToday API (use /api/calendar.getClassesOn instead)
