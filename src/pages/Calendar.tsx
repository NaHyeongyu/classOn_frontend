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
import { SectionCard } from "@/components/common/UI";

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
      if (tag === 'input' || tag === 'textarea' || e.isComposing) return;
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
          <HeaderArea>
            <HeaderGrid>
              <TitleGroup>
                <h2>캘린더</h2>
                <p>일정을 한눈에 확인해보세요</p>
              </TitleGroup>
              <MonthToolbar>
                <NavBtn type="button" onClick={prevMonth} aria-label="이전 달">
                  {'<'}
                </NavBtn>
                <MonthBadge>{label}</MonthBadge>
                <NavBtn type="button" onClick={nextMonth} aria-label="다음 달">
                  {'>'}
                </NavBtn>
              </MonthToolbar>
              <RightActions>
                <TodayBtn type="button" onClick={() => setViewDate(new Date())}>
                  오늘
                </TodayBtn>
              </RightActions>
            </HeaderGrid>
          </HeaderArea>

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
  gap: 0;
  background: transparent;
  border-radius: ${(p) => p.theme.radii.xl};
  padding: 0;
  min-height: 0; /* allow children to shrink within viewport */
`;

const Centered = styled.div`
  width: 100%;
  max-width: 1480px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  padding: 0;
  @media (min-width: 1440px) {
    max-width: 1600px;
  }
`;

const HeaderArea = styled.div`
  padding: 0;
`;

const RightActions = styled.div`
  justify-self: end;
  display: flex;
  gap: ${(p) => p.theme.spacing.sm};
  @media (max-width: 768px) {
    justify-self: center;
  }
`;

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  h2 {
    margin: 0;
    font-size: 26px;
    font-weight: 700;
    color: #111827;
  }
  p {
    margin: 0;
    color: #6b7280;
    font-size: 14px;
  }
`;

const HeaderGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: ${(p) => p.theme.spacing.md};
  align-items: center;
  padding-bottom: ${(p) => p.theme.spacing.sm};
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    justify-items: center;
    text-align: center;
    ${TitleGroup} {
      align-items: center;
    }
  }
`;

const CalendarSurface = styled(SectionCard)`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: ${(p) => p.theme.spacing.lg};
  border-radius: ${(p) => p.theme.radii.xl};
  gap: ${(p) => p.theme.spacing.md};
  min-height: 0; /* ensure grid can size within */
  min-height: 500px;
  @media (min-width: 1280px) {
    padding: ${(p) => p.theme.spacing.xl};
    min-height: 560px;
  }
`;

const MonthToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${(p) => p.theme.spacing.sm};
  flex-wrap: wrap;
`;

const MonthBadge = styled.span`
  min-width: 140px;
  text-align: center;
  font-weight: 600;
  font-size: 25px;
  letter-spacing: -0.01em;
  color: #111827;
  padding: 6px 12px;
`;

const NavBtn = styled.button`
  appearance: none;
  width: 30px;
  height: 30px;
  border: none;
  background: transparent;
  color: #111827;
  font-size: 18px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover { color: #1f2937; }
  &:active { transform: translateY(1px); }
  &:focus-visible { outline: 2px solid #111827; border-radius: 12px; outline-offset: 2px; }
`;

const TodayBtn = styled.button`
  appearance: none;
  height: 36px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid #4f46e5;
  background: transparent;
  color: #4f46e5;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
  &:hover { background: rgba(79, 70, 229, 0.08); }
  &:active { background: rgba(79, 70, 229, 0.16); transform: translateY(1px); }
  &:focus-visible { outline: 2px solid #4f46e5; border-radius: 12px; outline-offset: 2px; }
`;
