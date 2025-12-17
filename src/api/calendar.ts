import { fetchJSON } from "../lib/fetcher";

export type TodayClass = {
  id: number | null;
  courseId: number | null;
  courseTitle: string | null;
  recordDate: string; // YYYY-MM-DD
  startTime?: string | null; // HH:mm:ss
  endTime?: string | null;   // HH:mm:ss
  topic?: string | null;
  notes?: string | null;
  content?: string | null;
  attPresent?: number; // aggregated present count
  attAbsent?: number;  // aggregated absent count
  attUnprocessed?: number; // aggregated unprocessed count
};

export async function getClassesOn(ymd: string, init?: RequestInit): Promise<TodayClass[]> {
  const q = new URLSearchParams({ on: ymd });
  return await fetchJSON<TodayClass[]>(`/api/calendar/classes?${q}`, init);
}

export async function getClassesMonth(ym: string, init?: RequestInit): Promise<TodayClass[]> {
  const q = new URLSearchParams({ ym });
  return await fetchJSON<TodayClass[]>(`/api/calendar/classes-range?${q}`, init);
}

export async function getClassesRange(fromYmd: string, toYmd: string, init?: RequestInit): Promise<TodayClass[]> {
  // Backward compatible signature: server can resolve by ym; we pick the month of the range pivot.
  const safeParse = (ymd: string) => {
    const d = new Date(`${ymd}T00:00:00`);
    return Number.isFinite(d.getTime()) ? d : null;
  };
  const a = safeParse(fromYmd);
  const b = safeParse(toYmd);
  const pivot = a && b ? new Date((a.getTime() + b.getTime()) / 2) : a ?? b;
  const ym =
    pivot ? `${pivot.getFullYear()}-${String(pivot.getMonth() + 1).padStart(2, "0")}` : fromYmd.slice(0, 7);
  return await getClassesMonth(ym, init);
}
