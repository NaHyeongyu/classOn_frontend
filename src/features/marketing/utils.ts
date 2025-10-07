import type { Course, CourseRecord } from "@/api/courses";
import type { RangeSummary } from "./types";

export function toErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string" && error.trim()) return error;
  return fallback;
}

export function normalizeYMDInput(input: string): string {
  const value = (input || "").trim();
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

  const compactYmd = value.match(/^(\d{4})[./-]?(\d{2})[./-]?(\d{2})$/);
  if (compactYmd) {
    const [, y, m, d] = compactYmd;
    return `${y}-${m}-${d}`;
  }

  const mdy = value.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/);
  if (mdy) {
    const [, mm, dd, yyyy] = mdy;
    return `${yyyy}-${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}`;
  }

  const digits = value.replace(/\D/g, "");
  if (digits.length === 8) {
    if (/^\d{4}/.test(digits)) {
      return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
    }
    return `${digits.slice(4, 8)}-${digits.slice(0, 2)}-${digits.slice(2, 4)}`;
  }

  return value;
}

export function ymd(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function formatKoreanDate(ymdValue?: string): string {
  if (!ymdValue) return "-";
  const [year, month, day] = ymdValue.split("-");
  if (!year || !month || !day) return ymdValue;
  return `${Number(year)}년 ${Number(month)}월 ${Number(day)}일`;
}

export function countDaysInclusive(start?: string, end?: string): number | null {
  if (!start || !end) return null;
  try {
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      return null;
    }
    const diff = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
  } catch {
    return null;
  }
}

export function formatRangeSummary(from?: string, to?: string): RangeSummary {
  if (!from || !to) {
    return { label: "기간을 선택하면 조회 안내가 표시돼요.", days: null };
  }
  const days = countDaysInclusive(from, to);
  const label = `${formatKoreanDate(from)} ~ ${formatKoreanDate(to)}`;
  return { label, days };
}

export function buildTimeRange(start?: string | null, end?: string | null): string {
  if (!start && !end) return "";
  const s = start ? start.slice(0, 5) : "?";
  const e = end ? end.slice(0, 5) : "?";
  return `${s} ~ ${e}`;
}

export function formatCourseMeta(course: Course): string {
  const time = course.courseTime || buildTimeRange(course.startTime, course.endTime);
  const nextDate = course.nextClassDate ? `다음 수업 ${formatKoreanDate(course.nextClassDate)}` : "";
  return [time, nextDate].filter(Boolean).join(" · ") || "일정 정보 없음";
}

export function recordPreview(record: CourseRecord): string {
  return (
    record.content?.trim() ||
    record.notes?.trim() ||
    record.topic?.trim() ||
    "(기록된 내용이 없습니다)"
  );
}
