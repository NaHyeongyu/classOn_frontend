import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styled from "styled-components";
export default function CounselList({ items, onAdd, onDetail }) {
    return (_jsxs(Section, { children: [_jsxs(SectionHeader, { children: [_jsxs(HeaderLeft, { children: [_jsx(SectionIcon, { "aria-hidden": true, children: chatIcon }), _jsx("h4", { children: "\uC0C1\uB2F4 \uC77C\uC815" })] }), _jsx(Actions, { children: onAdd ? (_jsx(ActionBtn, { type: "button", onClick: onAdd, children: "+ \uC0C1\uB2F4 \uCD94\uAC00" })) : null })] }), _jsx(Grid, { children: items.map((c, i) => (_jsxs(ItemCard, { children: [_jsxs(ItemHeader, { children: [_jsx("div", { className: "left", children: _jsx("strong", { children: c.with || '학생' }) }), _jsxs("div", { className: "right", children: [_jsx(Time, { children: c.time }), onDetail && c.studentId ? (_jsx(ActionBtn, { type: "button", onClick: () => onDetail(c.studentId, c.id), children: "\uC0C1\uC138" })) : null] })] }), _jsx(ContentSmall, { children: (c.title || '').trim() || '내용 없음' })] }, `cs-${i}`))) })] }));
}
const Section = styled.section `
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 12px;
  background: #fff;
  display: flex;
  flex-direction: column;
  height: 100%; /* fill half container */
  min-height: 0; /* allow Grid to scroll */
`;
const SectionHeader = styled.div `
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;
  h4 { margin: 0; font-size: 15px; color: #111827; }
`;
const HeaderLeft = styled.div `
  display: flex; align-items: center; gap: 8px;
`;
const SectionIcon = styled.span `
  width: 28px; height: 28px; border-radius: 8px; display: grid; place-items: center; background: #f3f4f6; color: #4f46e5;
`;
const Actions = styled.div ``;
const ActionBtn = styled.button `
  height: 32px; padding: 0 10px; border-radius: 8px; border: 1px solid #e5e7eb; background: #fff; color: #111827; font-weight: 700; font-size: 12px; cursor: pointer;
  &:hover { background: #f9fafb; }
`;
const Grid = styled.div `
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  padding: 4px 2px;
  overflow: auto; /* scroll within fixed half */
  flex: 1 1 auto;
  min-height: 0;
  align-content: start; /* avoid vertical stretching when few items */
  align-items: start;
  grid-auto-rows: max-content;
`;
const ItemCard = styled.div `
  border: 1px solid #e5e7eb; border-radius: 12px; padding: 12px; background: #fff;
`;
const ItemHeader = styled.div `
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;
  .right { display:inline-flex; align-items:center; gap:8px; }
`;
const ContentSmall = styled.div ` color:#374151; font-size:13px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; `;
// meta rows removed per updated UI
const Time = styled.span `
  color: #6b7280; font-size: 12px; font-weight: 700;
`;
const chatIcon = (_jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: _jsx("path", { d: "M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" }) }));
