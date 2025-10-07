import styled from "styled-components";
import { WEEK_LABELS } from "../../features/calendar/dateUtils";

export default function Weekdays() {
  return (
    <Row>
      {WEEK_LABELS.map((w) => (
        <Cell key={w}>{w}</Cell>
      ))}
    </Row>
  );
}

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  padding: 0 2px;
  color: #111827;
  font-size: 12px;
  font-weight: 600;
  @media (min-width: 1024px) {
    padding: 0 4px;
  }
`;
const Cell = styled.div<{ $red?: boolean }>`
  text-align: center;
  letter-spacing: 0.04em;
  color: #111827;
`;
