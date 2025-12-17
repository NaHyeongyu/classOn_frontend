import type { PaymentCourseBrief, PaymentDetail } from "@classon/shared-types";
import { formatKoreanDate } from "@/lib/format";

export function resolveCourseRows(detail: PaymentDetail): PaymentCourseBrief[] {
  const list = Array.isArray(detail.courses) ? detail.courses.filter(Boolean) : [];
  if (list.length) return list;
  return detail.course ? [detail.course] : [];
}

export function formatCycleLabelFromSchedule(detail: PaymentDetail): string {
  const value = detail.schedule?.cycleValue;
  const unit = detail.schedule?.cycleUnit ?? "MONTHS";
  if (!value) return "—";
  const unitLabel = unit === "MONTHS" ? "개월" : unit === "WEEKS" ? "주" : unit === "DAYS" ? "일" : "";
  return `${value}${unitLabel || ""}`;
}

export function formatCycleLabelFromPeriod(
  periodStart?: string | null,
  periodEnd?: string | null,
): string | null {
  if (!periodStart || !periodEnd) return null;
  const start = new Date(`${periodStart}T00:00:00`);
  const end = new Date(`${periodEnd}T00:00:00`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
    return null;
  }

  const totalMonths =
    (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  const anchor = new Date(start);
  anchor.setMonth(anchor.getMonth() + totalMonths);
  let months = totalMonths;
  if (anchor > end) {
    months = Math.max(0, months - 1);
  }
  if (months >= 1) {
    return `${months}개월`;
  }

  const dayMs = 1000 * 60 * 60 * 24;
  const days = Math.max(1, Math.round((end.getTime() - start.getTime()) / dayMs));
  if (days % 7 === 0) {
    const weeks = days / 7;
    return `${weeks}주`;
  }
  return `${days}일`;
}

export function computeNextDueDateLabel(detail: PaymentDetail): string {
  const dueDate = detail.info.dueDate;
  const cycleValue = detail.schedule?.cycleValue;
  const cycleUnit = detail.schedule?.cycleUnit ?? "MONTHS";
  if (!dueDate || !cycleValue) return "-";
  const base = new Date(dueDate);
  if (Number.isNaN(base.getTime())) return "-";
  const next = new Date(base);
  if (cycleUnit === "MONTHS") {
    next.setMonth(next.getMonth() + cycleValue);
  } else if (cycleUnit === "WEEKS") {
    next.setDate(next.getDate() + cycleValue * 7);
  } else if (cycleUnit === "DAYS") {
    next.setDate(next.getDate() + cycleValue);
  } else {
    return "-";
  }
  return formatKoreanDate(next, { includeWeekday: false });
}

