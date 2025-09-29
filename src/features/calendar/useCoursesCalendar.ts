import { useCallback, useEffect, useMemo, useState } from "react";
import type { CalendarEvent } from "../../types/calendar";
import type { ClassItem } from "../../types/calendarDetail";
import { formatYMD } from "./dateUtils";
import { getClassesRange } from "../../api/calendar";
import { peekCache } from "../../lib/fetcher";

function hhmm(t?: string) {
  if (!t) return "";
  const [h, m] = t.split(":");
  return `${h}:${m}`;
}

type RangeRow = {
  courseTitle: string;
  startTime?: string;
  endTime?: string;
  courseId?: number;
  id?: number;
  recordDate: string;
};

function toClassItemFromDto(r: RangeRow): ClassItem {
  const time = r.startTime && r.endTime ? `${hhmm(r.startTime)} ~ ${hhmm(r.endTime)}` : "-";
  return {
    subject: r.courseTitle,
    time,
    room: "-",
    teacher: "-",
    student: "-",
    done: false,
    courseId: r.courseId,
    recordId: r.id,
    date: r.recordDate,
  };
}

function minmaxFromMatrix(matrix?: Date[][] | null) {
  const flat = (matrix || []).flat();
  if (!flat.length) return null as null | { from: Date; to: Date };
  const ys = flat.map((d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()));
  ys.sort((a, b) => a.getTime() - b.getTime());
  return { from: ys[0], to: ys[ys.length - 1] };
}

export function useCoursesCalendar(opts?: { dates?: Date[] | Date[][] }) {
  const datesMatrix = opts?.dates;
  const [byYmd, setByYmd] = useState<Record<string, ClassItem[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const range = useMemo(() => {
    if (Array.isArray(datesMatrix)) {
      let mm: { from: Date; to: Date } | null = null;
      const first = (datesMatrix as unknown[])[0];
      if (Array.isArray(first)) {
        mm = minmaxFromMatrix(datesMatrix as Date[][]);
      } else {
        const arr = (datesMatrix as Date[]).slice().sort((a,b)=>a.getTime()-b.getTime());
        if (arr.length) mm = { from: arr[0], to: arr[arr.length-1] };
      }
      if (mm) return { from: formatYMD(mm.from), to: formatYMD(mm.to) };
    }
    const y = formatYMD(new Date());
    return { from: y, to: y };
  }, [datesMatrix]);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    async function loadRange() {
      setError(null);
      // Seed from cache for instant UI, then revalidate in background
      try {
        const sp = new URLSearchParams({ from: range.from, to: range.to });
        const key = `/api/calendar/classes-range?${sp.toString()}`;
        const cached = peekCache<RangeRow[]>(key);
        if (cached.data && !cancelled) {
          const grouped: Record<string, ClassItem[]> = {};
          for (const r of cached.data) {
            const ymd = r.recordDate;
            if (!grouped[ymd]) grouped[ymd] = [];
            grouped[ymd].push(toClassItemFromDto(r));
          }
          setByYmd(grouped);
          setLoading(false);
        } else {
          setLoading(true);
        }
      } catch {
        setLoading(true);
      }
      try {
        const rows = await getClassesRange(range.from, range.to, { signal: controller.signal }) as RangeRow[];
        if (cancelled) return;
        const grouped: Record<string, ClassItem[]> = {};
        for (const r of (rows || [])) {
          const ymd = r.recordDate;
          if (!grouped[ymd]) grouped[ymd] = [];
          grouped[ymd].push(toClassItemFromDto(r));
        }
        setByYmd(grouped);
      } catch (e) {
        if (!cancelled) setError(readableError(e, "수업 데이터를 불러오지 못했습니다."));
      } finally { if (!cancelled) setLoading(false); }
    }
    void loadRange();
    return () => { cancelled = true; controller.abort(); };
  }, [range.from, range.to]);

  const classesForDate = useCallback((d: Date): ClassItem[] => {
    const ymd = formatYMD(d);
    const list = (byYmd[ymd] || []).slice().sort((a, b) => (a.time || "").localeCompare(b.time || ""));
    return list;
  }, [byYmd]);

  const eventsForDate = useCallback((d: Date): CalendarEvent[] => {
    const n = (byYmd[formatYMD(d)] || []).length;
    const events: CalendarEvent[] = [];
    if (n > 0) events.push({ type: "class", label: `수업 ${n}개` });
    return events;
  }, [byYmd]);

  return { loading, error, classesForDate, eventsForDate };
}

function readableError(e: unknown, fallback: string) {
  if (typeof e === 'string') return e;
  if (e && typeof e === 'object' && 'message' in e && typeof (e as { message?: unknown }).message === 'string') {
    return (e as { message?: string }).message || fallback;
  }
  return fallback;
}
