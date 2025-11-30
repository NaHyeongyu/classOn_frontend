import { useCallback, useMemo } from "react";
import type { CalendarEvent } from "@/types/calendar";
import { formatYMD } from "@/features/calendar/dateUtils";
import { useCalendarPaymentInvoices } from "@/features/calendar/useCalendarPaymentInvoices";

type Options = {
  enabled?: boolean;
};

export function usePaymentEvents(options?: Options) {
  const paymentQuery = useCalendarPaymentInvoices(options?.enabled ?? true);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    const rows = paymentQuery.data?.content ?? [];
    for (const row of rows) {
      if (!row.dueDate) continue;
      const due = new Date(row.dueDate);
      if (Number.isNaN(due.getTime())) continue;
      const ymd = formatYMD(due);
      map[ymd] = (map[ymd] ?? 0) + 1;
    }
    return map;
  }, [paymentQuery.data?.content]);

  const eventsForDate = useCallback(
    (date: Date): CalendarEvent[] => {
      const ymd = formatYMD(date);
      const count = counts[ymd] ?? 0;
      return count > 0 ? [{ type: "payment", label: `결제 ${count}건`, count }] : [];
    },
    [counts],
  );

  return { eventsForDate, query: paymentQuery };
}
