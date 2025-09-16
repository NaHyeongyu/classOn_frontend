import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styled from "styled-components";
export default function CalendarHeader({ title = "월별 캘린더", label, onPrev, onNext, }) {
    return (_jsxs(Header, { children: [_jsxs(HeaderLeft, { children: [_jsx(HeaderIcon, { "aria-hidden": true, children: _jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("rect", { x: "3", y: "4", width: "18", height: "18", rx: "2" }), _jsx("line", { x1: "16", y1: "2", x2: "16", y2: "6" }), _jsx("line", { x1: "8", y1: "2", x2: "8", y2: "6" }), _jsx("line", { x1: "3", y1: "10", x2: "21", y2: "10" })] }) }), _jsx("h3", { children: title })] }), _jsxs(HeaderRight, { children: [_jsx(NavBtn, { onClick: onPrev, "aria-label": "\uC774\uC804 \uB2EC", children: "\u2039" }), _jsx(MonthLabel, { children: label }), _jsx(NavBtn, { onClick: onNext, "aria-label": "\uB2E4\uC74C \uB2EC", children: "\u203A" })] })] }));
}
const Header = styled.div `
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 8px 12px;
`;
const HeaderLeft = styled.div `
  display: flex;
  align-items: center;
  gap: 8px;
  h3 {
    margin: 0;
    font-size: 16px;
    color: #111827;
  }
`;
const HeaderIcon = styled.span `
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  color: #4f46e5;
  background: #eef2ff;
`;
const HeaderRight = styled.div `
  display: flex;
  align-items: center;
  gap: 8px;
`;
const MonthLabel = styled.div `
  font-weight: 700;
  color: #111827;
  min-width: 140px;
  text-align: center;
`;
const NavBtn = styled.button `
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: #fff;
  color: #374151;
  cursor: pointer;
  &:hover {
    background: #f9fafb;
  }
`;
