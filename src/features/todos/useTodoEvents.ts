import { useCallback, useEffect, useMemo, useState } from "react";
import { listTodosByDate } from "../../api/todos";
import type { CalendarEvent } from "../../types/calendar";
import { formatYMD } from "../calendar/dateUtils";

// Prefetch todo counts for the currently visible dates.
export function useTodoEvents(visibleDates?: Date[]) {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ymds = useMemo(() => {
    if (!visibleDates || visibleDates.length === 0) return [] as string[];
    return visibleDates.map((d) => formatYMD(d));
  }, [visibleDates]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!ymds || ymds.length === 0) return;
      setLoading(true); setError(null);
      try {
        const entries = await Promise.all(
          ymds.map(async (ymd) => {
            try {
              const list = await listTodosByDate(ymd, "PENDING");
              return [ymd, list.length] as const;
            } catch {
              return [ymd, 0] as const;
            }
          })
        );
        if (cancelled) return;
        setCounts((prev) => {
          const next: Record<string, number> = { ...prev };
          for (const [k, v] of entries) next[k] = v;
          return next;
        });
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "할 일 정보를 불러오지 못했습니다.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => { cancelled = true; };
  }, [ymds]);

  const eventsForDate = useCallback(
    (d: Date): CalendarEvent[] => {
      const ymd = formatYMD(d);
      const n = counts[ymd] || 0;
      return n > 0 ? [{ type: "todo", label: `할 일 ${n}개` }] : [];
    },
    [counts]
  );

  return { eventsForDate, loading, error };
}
