import type { AttendanceDailySummary } from "@/api/attendance";
import type { FlatRow, StatusFilter } from "./types";

const weekdayFormat = new Intl.DateTimeFormat("ko-KR", {
  month: "numeric",
  day: "numeric",
  weekday: "short",
});

function hm(time: string | null): string {
  if (!time) return "";
  const [hh, mm] = time.split(":");
  return `${hh}:${mm}`;
}

export function labelDate(ymd: string): string {
  try {
    const date = new Date(`${ymd}T00:00:00`);
    return weekdayFormat.format(date);
  } catch {
    return ymd;
  }
}

export function timeRange(start: string | null, end: string | null): string {
  const s = hm(start);
  const e = hm(end);
  if (s && e) return `${s} ~ ${e}`;
  if (s) return `${s} ~`;
  if (e) return `~ ${e}`;
  return "-";
}

export function formatClock(iso: string | null): string {
  if (!iso) return "-";
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "-";
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  } catch {
    return "-";
  }
}

export function statusLabel(status: FlatRow["status"]): string {
  switch (status) {
    case "PRESENT":
      return "출석";
    case "ABSENT":
      return "결석";
    case "UNPROCESSED":
    default:
      return "미처리";
  }
}

export function sourceLabel(source: "MOBILE" | "MANUAL" | null): string {
  if (source === "MOBILE") return "모바일";
  if (source === "MANUAL") return "수동";
  return "-";
}

export function buildFlatRows(day: AttendanceDailySummary): FlatRow[] {
  const list: FlatRow[] = [];
  const attendanceRows: FlatRow[] = (day.attendances ?? [])
    .slice()
    .sort((a, b) => {
      if (!a.createdAt && !b.createdAt) return 0;
      if (!a.createdAt) return 1;
      if (!b.createdAt) return -1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })
    .map((entry, idx): FlatRow => ({
      key: `att-${day.date}-${entry.recordId ?? "record"}-${entry.studentId ?? "student"}-${idx}`,
      studentName: entry.studentName || "이름 없음",
      courseTitle: entry.courseTitle,
      courseId: entry.courseId ?? null,
      recordId: entry.recordId ?? null,
      status: entry.present ? "PRESENT" : "ABSENT",
      createdAt: entry.createdAt ?? null,
      reason: entry.reason ?? null,
      source: entry.source ?? null,
    }));
  list.push(...attendanceRows);

  const unprocessedRows: FlatRow[] = day.classes
    .filter((cls) => cls.unprocessedCount > 0)
    .map((cls, idx): FlatRow => ({
      key: `unprocessed-${day.date}-${cls.recordId ?? "record"}-${idx}`,
      studentName: `미처리 ${cls.unprocessedCount}명`,
      courseTitle: cls.courseTitle,
      courseId: cls.courseId ?? null,
      recordId: cls.recordId ?? null,
      status: "UNPROCESSED",
      createdAt: null,
      reason: null,
      source: null,
      count: cls.unprocessedCount,
      students: (cls.unprocessedStudents ?? [])
        .map((u) => u?.name || null)
        .filter((name): name is string => !!name)
        .sort((a, b) => a.localeCompare(b, "ko-KR")),
    }));
  list.push(...unprocessedRows);
  return list;
}

export function filterByStatus(rows: FlatRow[], filter: StatusFilter): FlatRow[] {
  switch (filter) {
    case "PRESENT":
      return rows.filter((row) => row.status === "PRESENT");
    case "ABSENT":
      return rows.filter((row) => row.status === "ABSENT");
    case "UNPROCESSED":
      return rows.filter((row) => row.status === "UNPROCESSED");
    case "ALL":
    default:
      return rows;
  }
}
