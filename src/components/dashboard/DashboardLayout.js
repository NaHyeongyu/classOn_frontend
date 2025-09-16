import { jsx as _jsx } from "react/jsx-runtime";
import styled from "styled-components";
export function DashboardGrid({ children }) {
    return _jsx(Wrapper, { children: children });
}
export function DashboardPanel({ span = 6, bg = "#ffffff", children }) {
    return (_jsx(Panel, { style: { gridColumn: `span ${span}`, background: bg }, children: children }));
}
const Wrapper = styled.section `
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  grid-template-rows: auto 1fr 1fr; /* KPI row + two content rows fill viewport */
  gap: 16px;
  height: calc(100vh - 48px); /* account for content padding (24px top/bottom) */
  overflow: hidden; /* page-level no scroll */
`;
const Panel = styled.div `
  min-height: 0; /* allow to shrink inside the row */
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 16px;
  color: #111827;
  display: flex;
  flex-direction: column;
  overflow: auto; /* internal scroll only, page stays fixed */
  font-weight: 600;
`;
