import type { PaymentDetail, PaymentMethod, PaymentType } from "@classon/shared-types";
import { formatKoreanDate } from "@/lib/format";

export type CourseRow = {
    id?: number | null;
    title?: string | null;
    code?: string | null;
    fee?: number | null;
};

const methodLabel: Record<string, string> = {
    CARD: "카드",
    BANK_TRANSFER: "계좌이체",
    CASH: "현금",
};

const paymentTypeLabel: Record<string, string> = {
    ONLINE: "온라인",
    OFFLINE: "오프라인",
};

export function resolveCourseRows(detail: PaymentDetail): CourseRow[] {
    if (detail.courses && detail.courses.length) {
        return detail.courses;
    }
    const fallback = [detail.course, detail.info.course].filter(
        (course): course is NonNullable<typeof course> => Boolean(course),
    );
    if (fallback.length) return fallback;
    return [
        {
            id: 0,
            title: "수강 과목 정보가 없습니다.",
            code: "",
            fee: detail.info.originalAmount ?? 0,
        },
    ];
}

export function computeNextDueDateLabel(detail: PaymentDetail): string {
    const dueDate = detail.info.dueDate;
    const cycleValue = detail.schedule?.cycleValue;
    const unit = detail.schedule?.cycleUnit ?? "MONTHS";
    if (!dueDate || !cycleValue) return "-";
    const base = new Date(dueDate);
    if (Number.isNaN(base.getTime())) return "-";
    const next = new Date(base);
    if (unit === "MONTHS") {
        next.setMonth(next.getMonth() + cycleValue);
    } else if (unit === "WEEKS") {
        next.setDate(next.getDate() + cycleValue * 7);
    } else if (unit === "DAYS") {
        next.setDate(next.getDate() + cycleValue);
    } else {
        return "-";
    }
    return formatKoreanDate(next, { includeWeekday: false });
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

export function formatCycleLabelFromSchedule(detail: PaymentDetail): string {
    const value = detail.schedule?.cycleValue;
    const unit = detail.schedule?.cycleUnit ?? "MONTHS";
    if (!value) return "-";
    const unitLabel = unit === "MONTHS" ? "개월" : unit === "WEEKS" ? "주" : unit === "DAYS" ? "일" : "";
    return `${value}${unitLabel}`;
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

export function getPaymentMethodDisplay(method?: PaymentMethod | null, type?: PaymentType | null): string {
    const methodText = method ? methodLabel[method] ?? method : null;
    const typeText = type ? paymentTypeLabel[type] ?? type : null;
    return [typeText, methodText].filter(Boolean).join(" / ") || "-";
}
