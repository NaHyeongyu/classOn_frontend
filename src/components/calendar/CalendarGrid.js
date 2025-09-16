import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styled from "styled-components";
import { isSameDate } from "../../features/calendar/dateUtils";
export default function CalendarGrid({ viewDate, dates, onSelectDate, getEvents }) {
    return (_jsx(Grid, { children: dates.map((d, i) => {
            const isCurrent = d.getMonth() === viewDate.getMonth();
            const isToday = isSameDate(d, new Date());
            const weekday = d.getDay();
            const events = isCurrent ? getEvents(d) : [];
            return (_jsxs(Cell, { "$dim": !isCurrent, "$today": isToday, onClick: () => onSelectDate(d), children: [_jsx(DateNum, { "$red": weekday === 0 || weekday === 6, "$today": isToday, children: d.getDate() }), _jsx(Events, { children: events.map((ev, idx) => (_jsx(Pill, { "$type": ev.type, children: ev.label }, idx))) })] }, `${d.toISOString()}-${i}`));
        }) }));
}
const Grid = styled.div `
  flex: 1;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: 1fr;
  gap: 10px;
  padding: 0 8px;
`;
const Cell = styled.div `
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
const DateNum = styled.div `
  font-size: 13px;
  font-weight: 700;
  color: ${(p) => (p.$today ? "#1f2937" : p.$red ? "#ef4444" : "#64748b")};
`;
const Events = styled.div `
  margin-top: 6px; display: flex; flex-direction: column; gap: 6px;
`;
const Pill = styled.div `
  font-size: 12px; font-weight: 700; padding: 6px 8px; border-radius: 8px; width: fit-content;
  color: #6d28d9; background: #f5f3ff; border: 1px solid #ede9fe;
  ${(p) => p.$type === "counsel"
    ? "color:#1d4ed8; background:#eff6ff; border-color:#dbeafe;"
    : p.$type === "todo"
        ? "color:#15803d; background:#ecfdf5; border-color:#d1fae5;"
        : ""}
`;
