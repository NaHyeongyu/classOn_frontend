import type { AttendanceDailySummary } from "@/api/attendance";

export type ViewMode = "daily" | "class";
export type StatusFilter = "ALL" | "PRESENT" | "ABSENT" | "UNPROCESSED";

export type FlatRow = {
  key: string;
  studentName: string;
  courseTitle: string | null;
  courseId: number | null;
  recordId: number | null;
  status: "PRESENT" | "ABSENT" | "UNPROCESSED";
  createdAt: string | null;
  reason: string | null;
  source: "MOBILE" | "MANUAL" | null;
  count?: number;
  students?: string[];
};

export type DailyWithRows = {
  day: AttendanceDailySummary;
  rows: FlatRow[];
};
