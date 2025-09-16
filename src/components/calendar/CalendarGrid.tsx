import styled from "styled-components";
import { isSameDate } from "../../features/calendar/dateUtils";
import type { CalendarEvent } from "../../types/calendar";

type Props = {
  viewDate: Date;
  dates: Date[]; // 42 items
  onSelectDate: (d: Date) => void;
  getEvents: (d: Date) => CalendarEvent[];
};

export default function CalendarGrid({ viewDate, dates, onSelectDate, getEvents }: Props) {
  return (
    <Grid>
      {dates.map((d, i) => {
        const isCurrent = d.getMonth() === viewDate.getMonth();
        const isToday = isSameDate(d, new Date());
        const weekday = d.getDay();
        const events = isCurrent ? getEvents(d) : [];
        return (
          <Cell key={`${d.toISOString()}-${i}`} $dim={!isCurrent} $today={isToday} onClick={() => onSelectDate(d)}>
            <DateNum $red={weekday === 0 || weekday === 6} $today={isToday}>
              {d.getDate()}
            </DateNum>
            <Events>
              {events.map((ev, idx) => (
                <Pill key={idx} $type={ev.type}>
                  {ev.label}
                </Pill>
              ))}
            </Events>
          </Cell>
        );
      })}
    </Grid>
  );
}

const Grid = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: 1fr;
  gap: 10px;
  padding: 0 8px;
`;
const Cell = styled.div<{ $dim?: boolean; $today?: boolean }>`
  background: #ffffff;
  border: 1px solid ${(p) => (p.$today ? "#dbeafe" : "#edf2f7")};
  box-shadow: ${(p) => (p.$today ? "inset 0 0 0 2px #e0e7ff" : "none")};
  border-radius: 12px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  opacity: ${(p) => (p.$dim ? 0.55 : 1)};
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;
  &:hover { background: #f8fafc; border-color: #e2e8f0; }
`;
const DateNum = styled.div<{ $red?: boolean; $today?: boolean }>`
  font-size: 13px;
  font-weight: 700;
  color: ${(p) => (p.$today ? "#1f2937" : p.$red ? "#ef4444" : "#64748b")};
`;
const Events = styled.div`
  margin-top: 6px; display: flex; flex-direction: column; gap: 6px;
`;
const Pill = styled.div<{ $type: "class" | "counsel" | "todo" }>`
  font-size: 12px; font-weight: 700; padding: 6px 8px; border-radius: 8px; width: fit-content;
  color: #6d28d9; background: #f5f3ff; border: 1px solid #ede9fe;
  ${(p) =>
    p.$type === "counsel"
      ? "color:#1d4ed8; background:#eff6ff; border-color:#dbeafe;"
      : p.$type === "todo"
      ? "color:#15803d; background:#ecfdf5; border-color:#d1fae5;"
      : ""}
`;

