import type { Student } from "@/api/students";
import type { BillingCycleUnit, StudentStatus } from "@classon/shared-types";

export const studentStatusLabels: Record<StudentStatus | "UNKNOWN" | undefined, string> = {
  ENROLLED: "수강중",
  ON_LEAVE: "휴학",
  PENDING: "대기중",
  STOPPED: "퇴원",
  UNKNOWN: "미지정",
  undefined: "미지정",
};

export const studentStatusColor: Record<string, string> = {
  ENROLLED: "#059669",
  ON_LEAVE: "#8b5cf6",
  PENDING: "#f97316",
  STOPPED: "#dc2626",
};

export function resolveStudentStatus(status?: StudentStatus | "UNKNOWN"): string {
  return studentStatusLabels[status ?? "UNKNOWN"] ?? studentStatusLabels.UNKNOWN;
}

export function defaultAmountForStudent(student: Student | undefined): number {
  if (!student || !Array.isArray(student.courses) || student.courses.length === 0) {
    return 0;
  }
  return student.courses.reduce((total: number, course: NonNullable<Student["courses"]>[number]) => {
    const fee = typeof course.fee === "number" ? course.fee : Number(course.fee);
    if (!Number.isFinite(fee)) return total;
    return total + Number(fee);
  }, 0);
}

export function formatPhoneKR(raw?: string | null): string {
  if (!raw) return "";
  const digits = raw.replace(/[^0-9]/g, "");
  if (!digits) return "";
  if (digits.length === 11 && digits.startsWith("010")) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10 && digits.startsWith("010")) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return digits;
}

export const toLocalISODate = (date: Date) => {
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60000);
  return local.toISOString().slice(0, 10);
};

export const dateISO = (date: Date) => toLocalISODate(date);

export function normalizeCycle(value: string | number | undefined): number {
  const num = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(num) || (num ?? 0) <= 0) return 1;
  return Math.max(1, Math.round(Number(num)));
}

export function computePeriodEnd(start: string, cycleValue: number, unit: BillingCycleUnit = "MONTHS"): string {
  if (!start) return "";
  const base = new Date(`${start}T00:00:00`);
  if (Number.isNaN(base.getTime())) return start;
  const normalized = Number.isFinite(cycleValue) && cycleValue > 0 ? Math.round(cycleValue) : 1;
  if (unit === "DAYS") {
    const end = new Date(base);
    end.setDate(end.getDate() + normalized - 1);
    return dateISO(end);
  }
  if (unit === "WEEKS") {
    const end = new Date(base);
    end.setDate(end.getDate() + normalized * 7 - 1);
    return dateISO(end);
  }
  const nextCycleStart = addMonthsClamped(base, normalized);
  nextCycleStart.setDate(nextCycleStart.getDate() - 1);
  return dateISO(nextCycleStart);
}

function addMonthsClamped(base: Date, monthsDelta: number): Date {
  const working = new Date(base.getTime());
  const day = working.getDate();
  working.setDate(1);
  working.setMonth(working.getMonth() + monthsDelta);
  const lastDay = new Date(working.getFullYear(), working.getMonth() + 1, 0).getDate();
  working.setDate(Math.min(day, lastDay));
  return working;
}
