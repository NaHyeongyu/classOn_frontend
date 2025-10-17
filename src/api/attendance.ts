import { fetchJSON } from "../lib/fetcher";

export type AttendanceDailySummary = {
  date: string;
  classCount: number;
  presentCount: number;
  absentCount: number;
  unprocessedCount: number;
  classes: AttendanceClassSummary[];
  attendances: AttendanceDailyStudent[];
};

export type AttendanceClassSummary = {
  recordId: number | null;
  courseId: number | null;
  courseTitle: string | null;
  courseCode: string | null;
  topic: string | null;
  startTime: string | null;
  endTime: string | null;
  presentCount: number;
  absentCount: number;
  unprocessedCount: number;
  unprocessedStudents: AttendanceUnprocessedStudent[];
};

export type AttendanceDailyStudent = {
  recordId: number | null;
  courseId: number | null;
  courseTitle: string | null;
  studentId: number | null;
  studentName: string | null;
  present: boolean;
  reason: string | null;
  source: "MOBILE" | "MANUAL" | null;
  createdAt: string | null;
  startTime?: string | null;
  endTime?: string | null;
};

export type AttendanceUnprocessedStudent = {
  id: number | null;
  name: string | null;
};

export async function getDailyAttendance(params?: { from?: string; to?: string }): Promise<AttendanceDailySummary[]> {
  const sp = new URLSearchParams();
  if (params?.from) sp.set("from", params.from);
  if (params?.to) sp.set("to", params.to);
  const query = sp.size ? `?${sp.toString()}` : "";
  return await fetchJSON<AttendanceDailySummary[]>(`/api/attendance/daily${query}`);
}
