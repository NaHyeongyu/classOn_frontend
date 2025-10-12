import { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { DashboardPanel } from "./DashboardLayout";
import { getClassesOn, type TodayClass } from "../../api/calendar";
import { formatYMD } from "../../features/calendar/dateUtils";
import { formatTimeRangeLabel } from "../../lib/format";
import ClassList from "../calendar/detail/ClassList";
import type { ClassItem } from "../../types/calendarDetail";

export default function DashboardClasses() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<TodayClass[]>([]);
  // simplified: no loading state needed; list renders as it arrives
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setError(null);
      try {
        const res = await getClassesOn(formatYMD(new Date()));
        if (!cancelled) setRows(res);
      } catch (err) {
        if (!cancelled) setError(resolveErrorMessage(err, "오늘 수업을 불러오지 못했습니다."));
      } finally { /* no-op */ }
    }
    void load();
    const t = setInterval(load, 15_000);
    const onVis = () => { if (document.visibilityState === 'visible') void load(); };
    document.addEventListener('visibilitychange', onVis);
    return () => { cancelled = true; clearInterval(t); document.removeEventListener('visibilitychange', onVis); };
  }, []);

  const items: ClassItem[] = rows.map((row) => {
    const record = row as TodayClassRow;
    const start = pickFirstString(record, ["startTime", "start_at", "startAt", "start"]);
    const end = pickFirstString(record, ["endTime", "end_at", "endAt", "end"]);
    const attendance = typeof record.attendance === "object" && record.attendance !== null
      ? (record.attendance as Record<string, unknown>)
      : null;
    const present = pickFirstNumber(record, ["attPresent", "presentCount", "attendancePresent"])
      ?? pickFirstNumberFromAttendance(attendance, ["present"])
      ?? 0;
    const absent = pickFirstNumber(record, ["attAbsent", "absentCount", "attendanceAbsent"])
      ?? pickFirstNumberFromAttendance(attendance, ["absent"])
      ?? 0;
    const unprocessed = pickFirstNumber(record, ["attUnprocessed", "unprocessedCount"]) ?? 0;
    const recId = pickFirstNumber(record, ["recordId", "id"]);
    const notes = cleanNotes(
      pickFirstString(record, ["notes", "content", "topic"])
    );
    return {
      subject: row.courseTitle || "수업",
      time: formatTimeRangeLabel(start, end),
      room: '-',
      teacher: '-',
      student: '-',
      done: false,
      courseId: row.courseId || undefined,
      date: row.recordDate || pickFirstString(record, ["date"]),
      recordId: typeof recId === "number" ? recId : undefined,
      notes,
      attPresent: present,
      attAbsent: absent,
      attUnprocessed: unprocessed,
    } as ClassItem;
  });

  return (
    <DashboardPanel span={6} rowSpan={2}>
      <Scrollable>
        <ClassList
          items={items}
          actionLabel="더보기"
          onAdd={() => navigate(`/calendar/${formatYMD(new Date())}`)}
          titleMode="subject"
          showNotes={true}
          embedded
        />
        {error && <Err>{error}</Err>}
      </Scrollable>
    </DashboardPanel>
  );
}

const Err = styled.div`
  color: ${(p) => p.theme.colors.danger};
  font-size: ${(p) => p.theme.font.size.sm};
  font-weight: ${(p) => p.theme.font.weight.semiBold};
`;
const Scrollable = styled.div`
  flex: 1;
  min-height: 0;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing.sm};
`;

type TodayClassRow = TodayClass & Record<string, unknown>;

function pickFirstString(obj: Record<string, unknown>, keys: string[]): string | null {
  for (const key of keys) {
    const value = obj[key];
    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }
  return null;
}

function pickFirstNumber(obj: Record<string, unknown>, keys: string[]): number | null {
  for (const key of keys) {
    const value = obj[key];
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
  }
  return null;
}

function pickFirstNumberFromAttendance(
  attendance: Record<string, unknown> | null,
  keys: string[]
): number | null {
  if (!attendance) return null;
  return pickFirstNumber(attendance, keys);
}

function cleanNotes(value: string | null): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (trimmed === "정기 수업" || trimmed === "정기수업") return null;
  return trimmed || null;
}

function resolveErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string" && error.trim()) return error;
  return fallback;
}
