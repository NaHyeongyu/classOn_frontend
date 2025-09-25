import { useEffect, useState } from "react";
import styled from "styled-components";
import { getClassesOn, type TodayClass } from "../../api/calendar";
import { formatYMD } from "../../features/calendar/dateUtils";
import ClassList from "../calendar/detail/ClassList";
import type { ClassItem } from "../../types/calendarDetail";
import { useNavigate } from "react-router-dom";

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
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "오늘 수업을 불러오지 못했습니다.");
      } finally { /* no-op */ }
    }
    void load();
    const t = setInterval(load, 15_000);
    const onVis = () => { if (document.visibilityState === 'visible') void load(); };
    document.addEventListener('visibilitychange', onVis);
    return () => { cancelled = true; clearInterval(t); document.removeEventListener('visibilitychange', onVis); };
  }, []);

  function numOr(...vals: any[]): number { for (const v of vals) { if (typeof v === 'number' && Number.isFinite(v)) return v; } return 0; }
  const items: ClassItem[] = rows.map((r: any) => {
    const s = r.startTime ?? r.start_at ?? r.startAt ?? r.start ?? null;
    const e = r.endTime ?? r.end_at ?? r.endAt ?? r.end ?? null;
    const present = numOr(r.attPresent, r.presentCount, r.attendancePresent, r?.attendance?.present);
    const absent = numOr(r.attAbsent, r.absentCount, r.attendanceAbsent, r?.attendance?.absent);
    const unprocessed = numOr(r.attUnprocessed);
    return {
      subject: r.courseTitle || '수업',
      time: formatTimeRange(s, e),
      room: '-',
      teacher: '-',
      student: '-',
      done: false,
      courseId: r.courseId || undefined,
      date: r.recordDate || r.date,
      recordId: r.recordId || r.id,
      notes: r.topic || r.notes || r.content || null,
      attPresent: present,
      attAbsent: absent,
      attUnprocessed: unprocessed,
    } as ClassItem;
  });

  return (
    <div style={{ gridColumn: 'span 6', minHeight: 0, display: 'flex' }}>
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
        <ClassList
          items={items}
          actionLabel="더보기"
          onAdd={() => navigate(`/calendar/${formatYMD(new Date())}`)}
          titleMode="subject"
          showNotes={false}
        />
        {error && <Err>{error}</Err>}
      </div>
    </div>
  );
}

function toHHMM(x?: string | null) {
  if (!x) return "--:--";
  try { const m = String(x).match(/(\d{2}):(\d{2})/); return m ? `${m[1]}:${m[2]}` : "--:--"; } catch { return "--:--"; }
}
function formatTimeRange(start?: string | null, end?: string | null) {
  return `${toHHMM(start)} ~ ${toHHMM(end)}`;
}

const Err = styled.div` color:#b91c1c; font-size:12px; `;
