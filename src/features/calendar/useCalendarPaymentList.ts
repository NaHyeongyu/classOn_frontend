import { useMemo } from "react";
import { useCalendarPaymentInvoices } from "@/features/calendar/useCalendarPaymentInvoices";
import { formatKoreanDate } from "@/lib/format";
import type { PaymentHistoryRow } from "@classon/shared-types";

export type CalendarPaymentRow = {
  id: number;
  studentName: string;
  courseTitle?: string | null;
  amountLabel: string;
  statusLabel: string;
  dueDateLabel: string;
};

export type CalendarPaymentSection = {
  date: string;
  label: string;
  rows: CalendarPaymentRow[];
};

export function useCalendarPaymentList(range?: { from: string; to: string }) {
  const query = useCalendarPaymentInvoices(Boolean(range));

  const sections = useMemo<CalendarPaymentSection[]>(() => {
    if (!range?.from || !range?.to) return [];
    const content: PaymentHistoryRow[] = query.data?.content ?? [];
    const filtered = content
      .filter((row) => row.dueDate && row.dueDate >= range.from && row.dueDate <= range.to)
      .sort((a, b) => (a.dueDate ?? "").localeCompare(b.dueDate ?? ""));
    const grouped = new Map<string, CalendarPaymentRow[]>();
    for (const row of filtered) {
      if (!row.dueDate) continue;
      const entry = grouped.get(row.dueDate) ?? [];
      entry.push(toCalendarRow(row));
      grouped.set(row.dueDate, entry);
    }
    return Array.from(grouped.entries()).map(([date, rows]) => ({
      date,
      label: formatKoreanDate(date, { includeWeekday: true }),
      rows,
    }));
  }, [query.data?.content, range?.from, range?.to]);

  return {
    sections,
    isLoading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
  };
}

function toCalendarRow(row: PaymentHistoryRow): CalendarPaymentRow {
  return {
    id: row.id,
    studentName: row.student?.name ?? "-",
    courseTitle: row.course?.title ?? null,
    amountLabel: formatCurrency(row.finalAmount ?? row.originalAmount ?? 0),
    statusLabel: statusLabel(row.status),
    dueDateLabel: row.dueDate
      ? formatKoreanDate(row.dueDate, { includeWeekday: true })
      : "-",
  };
}

function formatCurrency(value: number): string {
  return `${new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 }).format(value)}원`;
}

function statusLabel(status?: string | null): string {
  switch (status) {
    case "UNPAID":
      return "미납";
    case "PENDING":
      return "대기";
    case "COMPLETED":
      return "완료";
    default:
      return status ?? "-";
  }
}
