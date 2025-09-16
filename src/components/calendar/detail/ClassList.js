import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
export default function ClassList({ items, onAdd, actionLabel = '+ 수업 추가', titleMode = 'subject', showNotes = false }) {
    const navigate = useNavigate();
    return (_jsxs(Section, { children: [_jsxs(SectionHeader, { children: [_jsxs(HeaderLeft, { children: [_jsx(SectionIcon, { "aria-hidden": true, children: bookIcon }), _jsx("h4", { children: "\uC218\uC5C5 \uB0B4\uC5ED" })] }), _jsx(Actions, { children: _jsx(ActionBtn, { type: "button", onClick: onAdd, children: actionLabel }) })] }), _jsx(Grid, { children: items.map((c, i) => (_jsxs(RecordCard, { children: [_jsxs(RecordHead, { children: [_jsxs("div", { children: [_jsx("strong", { children: titleMode === 'date' ? formatDateLabel(c.date) : (c.subject || '수업') }), c.time && _jsx(SmallMuted, { style: { marginLeft: 8 }, children: c.time }), _jsx(SmallMuted, { style: { marginLeft: 8 }, children: typeLabel(c.date, c.time) })] }), _jsx("div", { children: c.courseId && (c.recordId || c.date) && (_jsx(SmallBtn, { type: "button", onClick: () => {
                                            if (c.recordId)
                                                navigate(`/classes/${c.courseId}/history/${c.recordId}`);
                                            else
                                                navigate(`/classes/${c.courseId}/history/date/${c.date}`);
                                        }, children: "\uC0C1\uC138" })) })] }), _jsx(BlockTitle, { children: "\uCD9C\uC11D" }), _jsxs("div", { style: { display: 'flex', gap: 12, alignItems: 'center' }, children: [_jsxs(CountPill, { "data-variant": 'present', children: ["\uCD9C\uC11D ", c.attPresent ?? 0, "\uBA85"] }), _jsxs(CountPill, { "data-variant": 'absent', children: ["\uACB0\uC11D ", c.attAbsent ?? 0, "\uBA85"] })] }), showNotes && (_jsxs(_Fragment, { children: [_jsx(BlockTitle, { children: "\uC218\uC5C5 \uB0B4\uC6A9" }), _jsx(ReadOnlyBox, { children: (c.notes && c.notes.trim()) ? c.notes : '—' })] }))] }, `cls-${i}`))) })] }));
}
// Status chip removed by request
function formatDateLabel(ymd) {
    if (!ymd)
        return '-';
    try {
        const d = new Date(ymd);
        if (Number.isNaN(d.getTime()))
            return ymd;
        const day = '일월화수목금토'[d.getDay()];
        return `${ymd} (${day})`;
    }
    catch {
        return ymd;
    }
}
function typeLabel(ymd, timeRange) {
    if (!ymd)
        return '';
    try {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const d = new Date(ymd);
        d.setHours(0, 0, 0, 0);
        if (d < todayStart)
            return '지난 수업';
        if (d > todayStart)
            return '예정';
        // Same day: try to parse end time from "HH:mm ~ HH:mm"
        const end = (timeRange || '').split('~')[1]?.trim();
        if (end && /^\d{2}:\d{2}$/.test(end)) {
            const [hh, mm] = end.split(':').map(Number);
            const now = new Date();
            const endDate = new Date();
            endDate.setHours(hh, mm, 0, 0);
            if (now > endDate)
                return '지난 수업';
        }
        return '예정';
    }
    catch {
        return '';
    }
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
  align-content: start; /* prevent single card from stretching to fill */
  align-items: start;   /* keep item height to content */
  grid-auto-rows: max-content; /* row height equals content height */
`;
// Unified "수업 내역" look
const RecordCard = styled.div ` border:1px solid #e5e7eb; border-radius:12px; padding:12px; display:grid; gap:10px; `;
const RecordHead = styled.div ` display:flex; align-items:center; justify-content:space-between; `;
const SmallMuted = styled.span ` color:#9ca3af; font-size:12px; `;
const BlockTitle = styled.div ` font-size:12px; font-weight:800; color:#6b7280; margin-top:4px; `;
const ReadOnlyBox = styled.div ` white-space:pre-wrap; border:1px solid #f1f5f9; border-radius:10px; padding:10px; background:#f9fafb; color:#111827; font-size:14px; `;
const CountPill = styled.span `
  display:inline-flex; align-items:center; gap:4px; padding:2px 8px; border-radius:999px; border:1px solid #e5e7eb; font-size:12px; font-weight:800; color:#374151; background:#fff;
  &[data-variant='present']{ background:#ecfdf5; color:#065f46; border-color:#a7f3d0; }
  &[data-variant='absent']{ background:#fee2e2; color:#7f1d1d; border-color:#fecaca; }
`;
// removed unused styled components
/* Status chip styles removed */
const SmallBtn = styled.button `
  height: 28px; padding: 0 10px; border-radius: 8px; border: 1px solid #e5e7eb; background: #fff; color: #111827; font-size: 12px;
`;
/* legacy meta row removed */
const bookIcon = (_jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("path", { d: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20" }), _jsx("path", { d: "M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" })] }));
