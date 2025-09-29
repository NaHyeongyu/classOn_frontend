import styled from "styled-components";
import { isSameDate } from "../../features/calendar/dateUtils";
import type { CalendarEvent } from "../../types/calendar";
import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  viewDate: Date;
  dates: Date[]; // 35 items (5 weeks)
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
            ref={(el) => { cellRefs.current[i] = el; }}
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
              {(() => {
                const MAX = 3;
                const visible = events.slice(0, MAX);
                const more = events.length - visible.length;
                return (
                  <>
                    {visible.map((ev, idx2) => (
                      <Pill
                        key={idx2}
                        $type={ev.type}
                        title={`[${ev.type}] ${ev.label}\nEnter로 날짜 이동 후 상세 보기`}
                        aria-label={`${ev.type} 이벤트: ${ev.label}`}
                      >
                        {ev.label}
                      </Pill>
                    ))}
                    {more > 0 ? <MorePill>+{more}</MorePill> : null}
                  </>
                );
              })()}
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
  /* Exactly 5 rows, each sharing height evenly regardless of content */
  grid-template-rows: repeat(5, minmax(0, 1fr));
  gap: 10px;
  padding: 0 4px;
  height: 100%;
  min-height: 0;
`;
const Cell = styled.div<{ $dim?: boolean; $today?: boolean }>`
  background: ${(p) => (p.$dim ? "#f8fafc" : "#ffffff")};
  border: 1px solid ${(p) => (p.$today ? "#c7d2fe" : "#e2e8f0")};
  border-radius: 14px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow: hidden;
  min-height: 0;
  height: 100%;
  opacity: ${(p) => (p.$dim ? 0.4 : 1)};
  cursor: pointer;
  transition: border-color 0.18s ease, box-shadow 0.18s ease, transform 0.12s ease;
  box-shadow: ${(p) => (p.$today ? "0 0 0 2px rgba(99, 102, 241, 0.18)" : "0 2px 6px rgba(15, 23, 42, 0.04)")};
  &:hover { border-color: #cbd5f5; box-shadow: 0 12px 26px rgba(15, 23, 42, 0.08); transform: translateY(-2px); }
  &:focus-visible { outline: 0; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.28); border-color: #93c5fd; }
`;
const DateNum = styled.div<{ $red?: boolean; $today?: boolean }>`
  font-size: 13px;
  font-weight: 800;
  color: ${(p) => (p.$today ? "#4338ca" : p.$red ? "#ef4444" : "#475569")};
  width: fit-content;
  padding: 2px 6px;
  border-radius: 8px;
  background: ${(p) => (p.$today ? "#eef2ff" : "transparent")};
`;
const Events = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 2px;
  scrollbar-width: thin;
  scrollbar-color: rgba(148, 163, 184, 0.6) transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(148, 163, 184, 0.6);
    border-radius: 999px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;
const Pill = styled.div<{ $type: "class" | "counsel" | "todo" }>`
  font-size: 12px;
  font-weight: 600;
  padding: 6px 8px;
  border-radius: 8px;
  width: fit-content;
  color: #5b21b6;
  background: #f5f3ff;
  border: 1px solid #ede9fe;
  ${(p) =>
    p.$type === "counsel"
      ? "color:#1d4ed8; background:#eff6ff; border-color:#dbeafe;"
      : p.$type === "todo"
      ? "color:#047857; background:#ecfdf5; border-color:#bbf7d0;"
      : ""}
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const MorePill = styled.span`
  font-size: 11px;
  font-weight: 600;
  padding: 4px 6px;
  border-radius: 8px;
  background: #e2e8f0;
  color: #475569;
  width: fit-content;
`;
