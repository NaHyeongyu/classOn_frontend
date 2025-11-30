import { useMemo } from "react";
import { useCalendarPaymentInvoices } from "@/features/calendar/useCalendarPaymentInvoices";
import { formatKoreanDate } from "@/lib/format";
import type { PaymentHistoryRow } from "@classon/shared-types";

export type CalendarPaymentRow = {
  id: number;
  studentName: string;
  studentCode?: string | null;
  courseTitle?: string | null;
  amountLabel: string;
  status?: string | null;
  statusLabel: string;
  dueDateLabel: string;
  dueDateRaw?: string | null;
};

export function useCalendarPaymentList(range?: { from: string; to: string }) {
  const query = useCalendarPaymentInvoices(true);

  const rows = useMemo<CalendarPaymentRow[]>(() => {
    const content: PaymentHistoryRow[] = query.data?.content ?? [];
    return content
      .filter((row) => {
        if (!row.dueDate) return false;
        if (!range?.from || !range?.to) return true;
        return row.dueDate >= range.from && row.dueDate <= range.to;
      })
      .sort((a, b) => (a.dueDate ?? "").localeCompare(b.dueDate ?? ""))
      .map((row) => toCalendarRow(row));
  }, [query.data?.content, range?.from, range?.to]);

  return {
    rows,
    isLoading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
  };
}

function toCalendarRow(row: PaymentHistoryRow): CalendarPaymentRow {
  return {
    id: row.id,
    studentName: row.student?.name ?? "-",
    studentCode: row.student?.code ?? null,
    courseTitle: row.course?.title ?? null,
    amountLabel: formatCurrency(row.finalAmount ?? row.originalAmount ?? 0),
    status: row.status,
    statusLabel: statusLabel(row.status),
    dueDateLabel: row.dueDate
      ? formatKoreanDate(row.dueDate, { includeWeekday: true })
      : "-",
    dueDateRaw: row.dueDate,
  };
}

function formatCurrency(value: number): string {
  return `${new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 }).format(value)}원`;
}

function statusLabel(status?: string | null): string {
  switch (status) {
    case "UNPAID":
      return "대기";
    case "PENDING":
      return "미납";
    case "COMPLETED":
      return "완료";
    case "CANCELED":
      return "취소";
    default:
      return status ?? "-";
  }
}
