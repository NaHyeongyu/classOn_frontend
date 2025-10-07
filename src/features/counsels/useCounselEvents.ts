import { useCallback, useEffect, useMemo, useState } from "react";
import { listCounsels, type Counsel, type PageResult } from "../../api/counsels";
import type { CalendarEvent } from "../../types/calendar";
import { formatYMD } from "../calendar/dateUtils";
import { readableError } from "@/lib/errors";

// Prefetch counsel counts for the currently visible dates.
export function useCounselEvents(visibleDates?: Date[]) {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ymds = useMemo(() => {
    if (!visibleDates || visibleDates.length === 0) return [] as string[];
    return visibleDates.map((d) => formatYMD(d));
  }, [visibleDates]);

  const range = useMemo(() => {
    if (!ymds.length) return null as null | { from: string; to: string };
    const sorted = [...ymds].sort();
    return { from: sorted[0], to: sorted[sorted.length - 1] };
  }, [ymds]);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    async function load() {
      if (!range) return;
      setLoading(true); setError(null);
      try {
        const size = 200;
        let page = 0;
        let all: Counsel[] = [];
        while (true) {
          const res: PageResult<Counsel> = await listCounsels({ from: range.from, to: range.to, page, size }, { signal: controller.signal });
          all = all.concat(res.content || []);
          if (res.last || (res.content || []).length === 0 || page > 200) break;
          page += 1;
        }
        if (cancelled) return;
        const map: Record<string, number> = {};
        for (const c of all) {
          const day = (c.counselTime || "").slice(0, 10);
          if (!day) continue;
          map[day] = (map[day] || 0) + 1;
        }
        setCounts(map);
      } catch (e) {
        if (!cancelled) setError(readableError(e, "상담 정보를 불러오지 못했습니다."));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => { cancelled = true; controller.abort(); };
  }, [range]);

  const eventsForDate = useCallback(
    (d: Date): CalendarEvent[] => {
      const ymd = formatYMD(d);
      const n = counts[ymd] || 0;
      return n > 0 ? [{ type: "counsel", label: `상담 ${n}건`, count: n }] : [];
    },
    [counts]
  );

  return { eventsForDate, loading, error };
}
