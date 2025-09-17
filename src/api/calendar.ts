import { fetchJSON } from "../lib/fetcher";

export type TodayClass = {
  id: number | null;
  courseId: number | null;
  courseTitle: string | null;
  recordDate: string; // YYYY-MM-DD
  startTime?: string | null; // HH:mm:ss
  endTime?: string | null;   // HH:mm:ss
  topic?: string | null;
  attPresent?: number; // aggregated present count
  attAbsent?: number;  // aggregated absent count
  attUnprocessed?: number; // aggregated unprocessed count
};

export async function getClassesOn(ymd: string): Promise<TodayClass[]> {
  const q = new URLSearchParams({ on: ymd });
  return await fetchJSON<TodayClass[]>(`/api/calendar/classes?${q}`);
}

export async function getClassesRange(fromYmd: string, toYmd: string): Promise<TodayClass[]> {
  const q = new URLSearchParams({ from: fromYmd, to: toYmd });
  return await fetchJSON<TodayClass[]>(`/api/calendar/classes-range?${q}`);
}
