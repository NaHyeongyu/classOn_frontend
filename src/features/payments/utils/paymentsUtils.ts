import type {
  PaymentDetail,
  PaymentHistoryRow,
  PaymentMethod,
  PaymentType,
} from "@classon/shared-types";
import { formatKoreanDate, formatMoney } from "@/lib/format";
import { PAYMENT_METHOD_LABEL, PAYMENT_TYPE_LABEL } from "@/lib/paymentUiLabels";

export function parseNumericInput(raw: string): number | undefined {
  const digits = raw.replace(/[^0-9]/g, "");
  if (!digits) return undefined;
  const parsed = Number(digits);
  return Number.isNaN(parsed) ? undefined : parsed;
}

export function formatCurrencyInput(value?: number | null): string {
  if (value == null || Number.isNaN(value)) return "";
  return formatMoney(value);
}

export function combineMemoValues(memo?: string | null, managerMemo?: string | null): string {
  const parts = [memo, managerMemo]
    .map((value) => (typeof value === "string" ? value.trim() : ""))
    .filter((value) => value.length);
  return parts.join("\n");
}

export function resolveMemoValue(memo?: string | null, managerMemo?: string | null): string {
  const combined = combineMemoValues(memo, managerMemo);
  return combined || "";
}

export function getCycleLabel(detail: PaymentDetail, variant: "invoice" | "history"): string {
  if (variant === "history") {
    return (
      formatCycleLabelFromPeriod(detail.info.periodStart, detail.info.periodEnd) ??
      formatCycleLabelFromSchedule(detail)
    );
  }
  return formatCycleLabelFromSchedule(detail);
}

function formatCycleLabelFromSchedule(detail: PaymentDetail): string {
  const value = detail.schedule?.cycleValue;
  const unit = detail.schedule?.cycleUnit ?? "MONTHS";
  if (!value) return "—";
  const unitLabel = unit === "MONTHS" ? "개월" : unit === "WEEKS" ? "주" : unit === "DAYS" ? "일" : "";
  return `${value}${unitLabel || ""}`;
}

function formatCycleLabelFromPeriod(periodStart?: string | null, periodEnd?: string | null): string | null {
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

export function buildCourseDisplay(row: PaymentHistoryRow): { title: string | null; code: string | null } {
  const typed = row as PaymentHistoryRow & {
    courseTitle?: string | null;
    courseCode?: string | null;
  };
  const fromList = Array.isArray(row.courses) ? row.courses.filter(Boolean) : [];
  const courseList = fromList.length > 0 ? fromList : row.course ? [row.course] : [];
  const titles = courseList
    .map((course) => course?.title?.trim())
    .filter((value): value is string => Boolean(value));
  const codes = courseList
    .map((course) => course?.code?.trim())
    .filter((value): value is string => Boolean(value));
  const title = titles.length ? titles.join(", ") : typed.courseTitle?.trim() || null;
  const code = codes.length ? codes.join(", ") : typed.courseCode?.trim() || null;
  return { title, code };
}

export function toLocalDateInputValue(date: Date = new Date()): string {
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60000);
  return local.toISOString().slice(0, 10);
}

export function getPaymentMethodDisplay(method?: PaymentMethod | null, type?: PaymentType | null): string {
  const methodText = method ? PAYMENT_METHOD_LABEL[method] ?? method : null;
  const typeText = type ? PAYMENT_TYPE_LABEL[type] ?? type : null;
  return [typeText, methodText].filter(Boolean).join(" / ") || "-";
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

