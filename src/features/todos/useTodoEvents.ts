import { useCallback, useEffect, useMemo, useState } from "react";
import { listTodosByDate } from "../../api/todos";
import type { CalendarEvent } from "../../types/calendar";
import { formatYMD } from "../calendar/dateUtils";
import { peekCache } from "../../lib/fetcher";

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
    const controller = new AbortController();
    async function load() {
      if (!ymds || ymds.length === 0) return;
      setLoading(true); setError(null);
      try {
        // Seed counts from cache for instant feedback
        try {
          const seed: Record<string, number> = {};
          for (const y of ymds) {
            const sp = new URLSearchParams({ dueYmd: y, status: "PENDING" });
            const key = `/api/todos?${sp.toString()}`;
            const cached = peekCache<any[]>(key);
            if (cached.data) seed[y] = (cached.data || []).length;
          }
          if (Object.keys(seed).length && !cancelled)
            setCounts((prev) => ({ ...prev, ...seed }));
        } catch { /* ignore cache seed errors */ }

        // Concurrency-limited fetching to avoid flooding network
        const limit = 6;
        const results: Array<readonly [string, number]> = [];
        let i = 0;
        async function worker() {
          while (i < ymds.length && !cancelled) {
            const idx = i++;
            const y = ymds[idx];
            try {
              const list = await listTodosByDate(y, "PENDING", { signal: controller.signal });
              results.push([y, list.length] as const);
            } catch {
              results.push([y, 0] as const);
            }
          }
        }
        const pool = Array.from({ length: Math.min(limit, ymds.length) }, () => worker());
        await Promise.all(pool);
        const entries = results;
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
    return () => { cancelled = true; controller.abort(); };
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
