import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import CalendarHeader from "../components/calendar/CalendarHeader";
import Weekdays from "../components/calendar/Weekdays";
import CalendarGrid from "../components/calendar/CalendarGrid";
import { useMonthCalendar } from "../hooks/useMonthCalendar";
import { formatYMD } from "../features/calendar/dateUtils";
import { useCoursesCalendar } from "../features/calendar/useCoursesCalendar";
import { useTodoEvents } from "../features/todos/useTodoEvents";
import { useCounselEvents } from "../features/counsels/useCounselEvents";
import { useEffect, useMemo, useState } from "react";
import { getClassesRange } from "../api/calendar";
import { listCounsels } from "../api/counsels";
import { listTodosByDate } from "../api/todos";

// Reusable legend dot
const Dot = styled.span<{ $type: "class" | "counsel" | "todo" }>`
  width: 10px; height: 10px; border-radius: 9999px; background: #a78bfa;
  ${(p) =>
    p.$type === "counsel"
      ? "background:#60a5fa;"
      : p.$type === "todo"
      ? "background:#34d399;"
      : ""}
`;

export default function Calendar() {
  const navigate = useNavigate();
  const { viewDate, matrix, prevMonth, nextMonth } = useMonthCalendar();
  const label = `${viewDate.getFullYear()}년 ${viewDate.getMonth() + 1}월`;
  const { eventsForDate } = useCoursesCalendar({ dates: matrix });
  const { eventsForDate: todoEventsForDate } = useTodoEvents(matrix);
  const { eventsForDate: counselEventsForDate } = useCounselEvents(matrix);

  // Today stats: classes / todos / counsels
  const today = useMemo(() => formatYMD(new Date()), []);
  const [clsCount, setClsCount] = useState<number>(0);
  const [todoCount, setTodoCount] = useState<number>(0);
  const [counselCount, setCounselCount] = useState<number>(0);
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [classes, todos, counsels] = await Promise.all([
          getClassesRange(today, today),
          listTodosByDate(today),
          listCounsels({ onYmd: today, size: 1 }),
        ]);
        if (cancelled) return;
        setClsCount((classes as any)?.length || 0);
        setTodoCount((todos as any)?.length || 0);
        setCounselCount((counsels as any)?.totalElements || 0);
      } catch {
        if (!cancelled) {
          setClsCount(0); setTodoCount(0); setCounselCount(0);
        }
      }
    }
    void load();
    return () => { cancelled = true; };
  }, [today]);

  return (
    <Viewport>
      <Card>
        <CalendarHeader label={label} onPrev={prevMonth} onNext={nextMonth} />
        <TodayStats>
          <Stat>오늘 수업 <strong>{clsCount}</strong></Stat>
          <Dot $type="todo" />
          <Stat>할 일 <strong>{todoCount}</strong></Stat>
          <Dot $type="counsel" />
          <Stat>상담 <strong>{counselCount}</strong></Stat>
        </TodayStats>
        <Weekdays />
        <CalendarGrid
          viewDate={viewDate}
          dates={matrix}
          onSelectDate={(d) => navigate(`/calendar/${formatYMD(d)}`)}
          getEvents={(d) => {
            if (d.getMonth() !== viewDate.getMonth()) return [];
            // Merge class, counsel, and todo events (full range)
            return [
              ...eventsForDate(d),
              ...counselEventsForDate(d),
              ...todoEventsForDate(d),
            ];
          }}
        />

      <Legend>
        <LegendItem>
          <Dot $type="class" /> 수업
        </LegendItem>
        <LegendItem>
          <Dot $type="counsel" /> 상담
        </LegendItem>
        <LegendItem>
          <Dot $type="todo" /> 할 일
        </LegendItem>
      </Legend>
      </Card>
    </Viewport>
  );
}

// styles
const Viewport = styled.div`
  height: calc(100vh - 48px);
  overflow: hidden; /* 페이지 스크롤 방지 */
`;

const Card = styled.section`
  height: 100%;
  display: flex;
  flex-direction: column;
  background: transparent; /* 경계 제거 */
  border-radius: 16px;
  padding: 8px 6px 10px;
`;

/* Presentational components (header, grid, weekdays) moved to /components/calendar */

const Legend = styled.div`
  padding: 8px 6px 2px; display: flex; gap: 16px; align-items: center; color: #6b7280; font-size: 13px;
`;
const TodayStats = styled.div`
  display:flex; align-items:center; gap:10px; padding: 8px 6px 0; color:#6b7280; font-size:13px;
  strong { color:#111827; }
`;
const Stat = styled.span`
  display:inline-flex; align-items:center; gap:6px;
`;
const LegendItem = styled.span`
  display: inline-flex; gap: 6px; align-items: center;
`;
