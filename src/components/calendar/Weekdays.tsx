import styled from "styled-components";
import { WEEK_LABELS } from "../../features/calendar/dateUtils";

export default function Weekdays() {
  return (
    <Row>
      {WEEK_LABELS.map((w, i) => (
        <Cell key={w} $red={i === 0 || i === 6}>{w}</Cell>
      ))}
    </Row>
  );
}

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  padding: 0 4px 10px;
  color: #94a3b8;
  font-size: 12px;
  font-weight: 600;
`;
const Cell = styled.div<{ $red?: boolean }>`
  text-align: center;
  letter-spacing: 0.04em;
  color: ${(p) => (p.$red ? "#ef4444" : "#64748b")};
`;
