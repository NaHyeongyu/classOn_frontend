import styled from "styled-components";
import { isSameDate } from "../../features/calendar/dateUtils";
import type { CalendarEvent } from "../../types/calendar";
import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  viewDate: Date;
  dates: Date[]; // 42 items
  onSelectDate: (d: Date) => void;
  getEvents: (d: Date) => CalendarEvent[];
};

export default function CalendarGrid({ viewDate, dates, onSelectDate, getEvents }: Props) {
  const cellRefs = useRef<(HTMLDivElement | null)[]>([]);
  const initialIndex = useMemo(() => {
    const todayIdx = dates.findIndex((d) => isSameDate(d, new Date()));
    return todayIdx >= 0 ? todayIdx : 0;
  }, [dates]);
  const [focusIdx, setFocusIdx] = useState<number>(initialIndex);

  useEffect(() => { setFocusIdx(initialIndex); }, [initialIndex]);

  function moveFocus(next: number) {
    const idx = Math.max(0, Math.min(dates.length - 1, next));
    setFocusIdx(idx);
    const el = cellRefs.current[idx];
    if (el) el.focus();
  }

  return (
    <Grid role="grid" aria-label="월간 달력">
      {dates.map((d, i) => {
        const isCurrent = d.getMonth() === viewDate.getMonth();
        const isToday = isSameDate(d, new Date());
        const weekday = d.getDay();
        const events = isCurrent ? getEvents(d) : [];
        const idx = i;
        return (
          <Cell
            key={`${d.toISOString()}-${i}`}
            ref={(el) => (cellRefs.current[i] = el)}
            tabIndex={idx === focusIdx ? 0 : -1}
            $dim={!isCurrent}
            $today={isToday}
            onClick={() => onSelectDate(d)}
            onKeyDown={(e) => {
              switch (e.key) {
                case 'ArrowRight': e.preventDefault(); moveFocus(idx + 1); break;
                case 'ArrowLeft': e.preventDefault(); moveFocus(idx - 1); break;
                case 'ArrowDown': e.preventDefault(); moveFocus(idx + 7); break;
                case 'ArrowUp': e.preventDefault(); moveFocus(idx - 7); break;
                case 'Home': e.preventDefault(); moveFocus(0); break;
                case 'End': e.preventDefault(); moveFocus(dates.length - 1); break;
                case 'Enter':
                case ' ': e.preventDefault(); onSelectDate(d); break;
              }
            }}
            role="gridcell"
            aria-selected={idx === focusIdx}
          >
            <DateNum $red={weekday === 0 || weekday === 6} $today={isToday}>
              {d.getDate()}
            </DateNum>
            <Events>
              {events.map((ev, idx2) => (
                <Pill
                  key={idx2}
                  $type={ev.type}
                  title={`[${ev.type}] ${ev.label}\nEnter로 날짜 이동 후 상세 보기`}
                  aria-label={`${ev.type} 이벤트: ${ev.label}`}
                >
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
