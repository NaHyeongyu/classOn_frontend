import styled from "styled-components";
import Weekdays from "@/components/calendar/Weekdays";
import CalendarGrid from "@/components/calendar/CalendarGrid";
import { SectionCard } from "@/components/common/UI";
import type { CalendarEvent } from "@/types/calendar";

type CalendarPageViewProps = {
  label: string;
  viewDate: Date;
  dates: Date[];
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onSelectDate: (date: Date) => void;
  getEvents: (date: Date) => CalendarEvent[];
};

export function CalendarPageView({
  label,
  viewDate,
  dates,
  onPrevMonth,
  onNextMonth,
  onToday,
  onSelectDate,
  getEvents,
}: CalendarPageViewProps) {
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
                <NavBtn type="button" onClick={onPrevMonth} aria-label="이전 달">
                  {"<"}
                </NavBtn>
                <MonthBadge>{label}</MonthBadge>
                <NavBtn type="button" onClick={onNextMonth} aria-label="다음 달">
                  {">"}
                </NavBtn>
              </MonthToolbar>
              <RightActions>
                <TodayBtn type="button" onClick={onToday}>
                  오늘
                </TodayBtn>
              </RightActions>
            </HeaderGrid>
          </HeaderArea>

          <CalendarSurface>
            <Weekdays />
            <CalendarGrid
              viewDate={viewDate}
              dates={dates}
              onSelectDate={onSelectDate}
              getEvents={getEvents}
            />
          </CalendarSurface>
        </Centered>
      </Card>
    </Viewport>
  );
}

const Viewport = styled.div`
  height: calc(100vh - 48px);
  overflow: hidden;
`;

const Card = styled.section`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0;
  background: transparent;
  border-radius: ${(p) => p.theme.radii.xl};
  padding: 0;
  min-height: 0;
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
  min-height: 0;
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
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${(p) => p.theme.radii.lg};
  padding: 0 16px;
  height: 36px;
  background: ${(p) => p.theme.colors.primarySurface};
  color: ${(p) => p.theme.colors.primary};
  font-weight: 700;
`;

const NavBtn = styled.button`
  border: none;
  width: 34px;
  height: 34px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  font-weight: 700;
  cursor: pointer;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  transition:
    background 0.18s ease,
    color 0.18s ease,
    transform 0.18s ease;
  &:hover {
    background: ${(p) => p.theme.colors.primarySurface};
    color: ${(p) => p.theme.colors.primary};
  }
`;

const TodayBtn = styled.button`
  padding: 0 16px;
  height: 34px;
  border-radius: 12px;
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.surface};
  color: ${(p) => p.theme.colors.text};
  cursor: pointer;
  font-weight: 700;
  transition:
    background 0.18s ease,
    color 0.18s ease,
    transform 0.18s ease;
  &:hover {
    background: ${(p) => p.theme.colors.primarySurface};
    color: ${(p) => p.theme.colors.primary};
  }
`;
