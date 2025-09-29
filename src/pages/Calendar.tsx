import styled from "styled-components";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Weekdays from "@/components/calendar/Weekdays";
import CalendarGrid from "@/components/calendar/CalendarGrid";
import { useMonthCalendar } from "@/hooks/useMonthCalendar";
import { buildMonthMatrix, formatYMD } from "@/features/calendar/dateUtils";
import { useCoursesCalendar } from "@/features/calendar/useCoursesCalendar";
import { useTodoEvents } from "@/features/todos/useTodoEvents";
import { useCounselEvents } from "@/features/counsels/useCounselEvents";
import { getClassesRange } from "@/api/calendar";
import {
  PageHeader,
  SmallBtn as UISmallBtn,
  SectionCard,
} from "@/components/common/UI";

export default function Calendar() {
  const navigate = useNavigate();
  const { viewDate, matrix, prevMonth, nextMonth, setViewDate } =
    useMonthCalendar();
  const label = `${viewDate.getFullYear()}년 ${viewDate.getMonth() + 1}월`;
  const { eventsForDate } = useCoursesCalendar({ dates: matrix });
  const { eventsForDate: todoEventsForDate } = useTodoEvents(matrix);
  const { eventsForDate: counselEventsForDate } = useCounselEvents(matrix);

  // Prefetch prev/next month ranges to warm cache for smooth navigation
  // This uses fetcher's TTL/ETag caching; results are not stored in component state
  useEffect(() => {
    function rangeForMonth(d: Date) {
      const mat = buildMonthMatrix(d);
      const first = mat[0];
      const last = mat[mat.length - 1];
      return { from: formatYMD(first), to: formatYMD(last) };
    }
    const prev = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
    const next = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
    const rp = rangeForMonth(prev);
    const rn = rangeForMonth(next);
    // Fire and forget; fetcher caches responses
    void getClassesRange(rp.from, rp.to);
    void getClassesRange(rn.from, rn.to);
  }, [viewDate]);

  // Keyboard shortcuts: ←/→ navigate month, T to today
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement | null)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || (e as any).isComposing) return;
      if (e.key === 'ArrowLeft') { e.preventDefault(); prevMonth(); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); nextMonth(); }
      else if (e.key.toLowerCase() === 't') { e.preventDefault(); setViewDate(new Date()); }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prevMonth, nextMonth, setViewDate]);

  return (
    <Viewport>
      <Card>
        <Centered>
          <HeaderWrap>
            <PageHeader>
              <div>
                <h2>캘린더</h2>
                <p>일정을 한눈에 확인해보세요</p>
              </div>
              <MonthNav>
                <NavBtn type="button" onClick={prevMonth} aria-label="이전 달">
                  ‹
                </NavBtn>
                <MonthLabel>{label}</MonthLabel>
                <NavBtn type="button" onClick={nextMonth} aria-label="다음 달">
                  ›
                </NavBtn>
                <TodayBtn type="button" onClick={() => setViewDate(new Date())}>
                  오늘
                </TodayBtn>
              </MonthNav>
            </PageHeader>
          </HeaderWrap>

          <CalendarSurface>
            <Weekdays />
            <CalendarGrid
              viewDate={viewDate}
              dates={matrix}
              onSelectDate={(d) => navigate(`/calendar/${formatYMD(d)}`)}
              getEvents={(d) => {
                if (d.getMonth() !== viewDate.getMonth()) return [];
                return [
                  ...eventsForDate(d),
                  ...counselEventsForDate(d),
                  ...todoEventsForDate(d),
                ];
              }}
            />
          </CalendarSurface>

          <Legend>
            <LegendPill $variant="class">수업</LegendPill>
            <LegendPill $variant="counsel">상담</LegendPill>
            <LegendPill $variant="todo">할 일</LegendPill>
          </Legend>
        </Centered>
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
  gap: ${(p) => p.theme.spacing.lg};
  background: transparent;
  border-radius: ${(p) => p.theme.radii.xl};
  padding: ${(p) => p.theme.spacing.sm} ${(p) => p.theme.spacing.xs}
    ${(p) => p.theme.spacing.lg};
  min-height: 0; /* allow children to shrink within viewport */
`;

const Centered = styled.div`
  /* Center the calendar content and cap overly wide screens */
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
`;

const HeaderWrap = styled.div`
  padding: 0 ${(p) => p.theme.spacing.xs};
  display: grid;
  gap: ${(p) => p.theme.spacing.sm};
`;

const CalendarSurface = styled(SectionCard)`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: ${(p) => p.theme.spacing.xl};
  border-radius: ${(p) => p.theme.radii.xl};
  gap: ${(p) => p.theme.spacing.md};
  min-height: 0; /* ensure grid can size within */
`;

const Legend = styled.div`
  padding: 0 ${(p) => p.theme.spacing.xs};
  display: flex;
  gap: ${(p) => p.theme.spacing.sm};
  flex-wrap: wrap;
`;

const LegendPill = styled.span<{ $variant: "class" | "counsel" | "todo" }>`
  display: inline-flex;
  align-items: center;
  font-size: ${(p) => p.theme.font.size.sm};
  font-weight: 600;
  padding: ${(p) => p.theme.spacing.xs} ${(p) => p.theme.spacing.md};
  border-radius: 999px;
  background: ${({ $variant }) =>
    $variant === "class"
      ? "#ede9fe"
      : $variant === "counsel"
      ? "#dbeafe"
      : "#d1fae5"};
  color: ${({ $variant }) =>
    $variant === "class"
      ? "#6d28d9"
      : $variant === "counsel"
      ? "#1d4ed8"
      : "#047857"};
`;

const MonthNav = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${(p) => p.theme.spacing.sm};
  flex-wrap: wrap;
`;

const MonthLabel = styled.span`
  min-width: 120px;
  text-align: center;
  font-weight: 700;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
`;

const NavBtn = styled(UISmallBtn)`
  width: 34px;
  height: 34px;
  padding: 0;
  font-size: 18px;
  font-weight: 700;
`;

const TodayBtn = styled(UISmallBtn)`
  height: 34px;
  padding: 0 ${(p) => p.theme.spacing.md};
  font-size: ${(p) => p.theme.font.size.md};
  font-weight: 700;
`;
