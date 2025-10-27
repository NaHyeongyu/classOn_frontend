import type { Course } from "@/api/courses";

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

function endOfMonthDay(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export function buildFilterRange(
  year: number | null,
  month: number
): { from?: string; to?: string } {
  if (year == null) return {};
  let from = `${year}-01-01`;
  let to = `${year}-12-31`;
  if (month >= 1) {
    const end = endOfMonthDay(year, month);
    from = `${year}-${pad2(month)}-01`;
    to = `${year}-${pad2(month)}-${pad2(end)}`;
  }
  return { from, to };
}

export function buildCourseInfo(course: Course) {
  const order: Record<
    "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN",
    number
  > = { MON: 0, TUE: 1, WED: 2, THU: 3, FRI: 4, SAT: 5, SUN: 6 };
  const daysSrc = Array.isArray(course.recurrenceDays)
    ? course.recurrenceDays
    : String(course.recurrenceDays || "").split(",");
  const days = daysSrc
    .map((raw: string) => String(raw).trim().toUpperCase())
    .filter(Boolean)
    .sort(
      (a: string, b: string) =>
        order[a as keyof typeof order] - order[b as keyof typeof order]
    )
    .map(dayLabel)
    .join("/");
  const time =
    course.startTime && course.endTime
      ? `${hhmm(course.startTime)} ~ ${hhmm(course.endTime)}`
      : course.courseTime || "-";
  return { days, time };
}

export function dayLabel(code: string): string {
  const map: Record<string, string> = {
    MON: "월",
    TUE: "화",
    WED: "수",
    THU: "목",
    FRI: "금",
    SAT: "토",
    SUN: "일",
  };
  const upper = code.toUpperCase();
  return map[upper] || code;
}

export function hhmm(time?: string): string {
  if (!time) return "";
  const [h, m] = time.split(":");
  return `${h}:${m}`;
}

export function statusLabel(status?: Course["status"]): string {
  switch (status) {
    case "IN_PROGRESS":
      return "진행중";
    case "PENDING":
      return "대기";
    case "STOPPED":
      return "중단";
    default:
      return status || "-";
  }
}

export function courseTypeLabel(type?: Course["courseType"]): string {
  switch (type) {
    case "INDIVIDUAL":
      return "개인 수업";
    case "GROUP":
      return "단체 수업";
    default:
      return "단체 수업";
  }
}

export function saveBlobAsFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function sanitizeFilename(raw: string): string {
  const base = raw ? raw.trim() : "export";
  const cleaned = base.replace(/[\\/:*?"<>|]+/g, "_");
  return cleaned.length ? cleaned : "export";
}

export function formatCourseTime(course: Course): string {
  return course.startTime && course.endTime
    ? `${hhmm(course.startTime)} ~ ${hhmm(course.endTime)}`
    : course.courseTime || "-";
}

export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = pad2(date.getMonth() + 1);
  const day = pad2(date.getDate());
  return `${year}-${month}-${day}`;
}
