import { jsx as _jsx } from "react/jsx-runtime";
import styled from "styled-components";
import { WEEK_LABELS } from "../../features/calendar/dateUtils";
export default function Weekdays() {
    return (_jsx(Row, { children: WEEK_LABELS.map((w, i) => (_jsx(Cell, { "$red": i === 0 || i === 6, children: w }, w))) }));
}
const Row = styled.div `
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  padding: 0 8px 8px;
  color: #94a3b8;
`;
const Cell = styled.div `
  text-align: center; font-weight: 600; color: ${(p) => (p.$red ? "#ef4444" : "#6b7280")};
`;
