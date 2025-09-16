import { fetchJSON } from "../lib/fetcher";
import type { DashboardSummary } from "../types/dashboard";

export type RecentAttendance = {
  id: number;
  studentId: number;
  studentName: string;
  courseId: number | null;
  courseTitle: string | null;
  present: boolean;
  source: "MOBILE" | "MANUAL";
  createdAt: string; // ISO
};

export async function getAttendanceToday(): Promise<RecentAttendance[]> {
  return await fetchJSON<RecentAttendance[]>(`/api/dashboard/attendance-today`);
}

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  return await fetchJSON<DashboardSummary>(`/api/dashboard/summary`);
}

// Removed unused getClassesToday API (use /api/calendar.getClassesOn instead)
