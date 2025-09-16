import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styled from "styled-components";
export default function CalendarDetailHeader({ label, onBack, onPrev, onNext, onToday }) {
    return (_jsxs(TopBar, { children: [_jsx(BackBtn, { type: "button", onClick: onBack, children: "\u2190 \uB3CC\uC544\uAC00\uAE30" }), _jsxs(TopCenter, { children: [_jsx(NavBtn, { onClick: onPrev, "aria-label": "\uC774\uC804 \uB0A0\uC9DC", children: "\u2039" }), _jsx(DateLabel, { children: label }), _jsx(NavBtn, { onClick: onNext, "aria-label": "\uB2E4\uC74C \uB0A0\uC9DC", children: "\u203A" })] }), _jsx(TodayBtn, { type: "button", onClick: onToday, children: "\uC624\uB298" })] }));
}
const TopBar = styled.div `
  display: flex; align-items: center; justify-content: space-between; gap: 10px;
`;
const TopCenter = styled.div `
  display: flex; align-items: center; gap: 8px;
`;
const DateLabel = styled.div `
  font-weight: 800; color: #111827;
`;
const BackBtn = styled.button `
  height: 36px; padding: 0 12px; border-radius: 10px; border: 1px solid #e5e7eb; background: #fff; color: #374151; cursor: pointer;
  &:hover { background: #f9fafb; }
`;
const NavBtn = styled.button `
  width: 32px; height: 32px; border-radius: 8px; border: 1px solid #e5e7eb; background: #fff; color: #374151; cursor: pointer;
  &:hover { background: #f3f4f6; }
`;
const TodayBtn = styled.button `
  height: 36px; padding: 0 12px; border-radius: 10px; border: none; background: #4f46e5; color: #fff; font-weight: 700; cursor: pointer;
`;
