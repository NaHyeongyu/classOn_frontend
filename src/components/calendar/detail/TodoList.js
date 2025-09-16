import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styled from "styled-components";
import { useEffect, useState } from "react";
/**
 * EN: Todo list for a selected calendar day (drag-sortable, small actions).
 * KO: 선택된 날짜의 할일 목록(드래그 정렬 및 간단 액션 제공).
 */
export default function TodoList({ inProgress, done, onAdd, onToggle, onDelete, onEdit }) {
    // Local order state (syncs from props)
    const [pList, setPList] = useState(inProgress);
    useEffect(() => { setPList(inProgress); }, [inProgress]);
    // Touch 'done' so TS doesn't warn about unused parameter while keeping API compatible
    useEffect(() => { }, [done]);
    // Touch optional callbacks to satisfy noUnusedParameters
    void onToggle;
    void onDelete;
    void onEdit;
    return (_jsxs(Section, { children: [_jsxs(SectionHeader, { children: [_jsxs(HeaderLeft, { children: [_jsx(SectionIcon, { "aria-hidden": true, children: checkIcon }), _jsx("h4", { children: "\uD560 \uC77C" }), _jsx(Count, { children: inProgress.length })] }), _jsx(Actions, { children: _jsx(ActionBtn, { type: "button", onClick: onAdd, children: "+ \uD560\uC77C \uCD94\uAC00" }) })] }), _jsx(List, { children: pList.map((t, i) => (_jsxs(TaskCard, { children: [_jsxs(Left, { children: [_jsx(Dot, { "aria-hidden": true }), _jsxs(TextArea, { children: [_jsx(TaskTitle, { title: t.title, children: t.title }), t.content && _jsx(TaskContent, { title: t.content, children: t.content })] })] }), _jsxs(BtnRow, { children: [typeof t.id === "number" && (_jsx(GhostBtn, { type: "button", onClick: () => onEdit?.(t.id), children: "\uC218\uC815" })), typeof t.id === "number" && (_jsx(DangerBtn, { type: "button", onClick: () => onDelete?.(t.id), children: "\uC0AD\uC81C" }))] })] }, `p-${t.id ?? i}`))) }), pList.length === 0 && (_jsx("div", { style: { color: '#6b7280', fontSize: 12, textAlign: 'center', marginTop: 6 }, children: "\uC624\uB298 \uB4F1\uB85D\uB41C \uD560 \uC77C\uC774 \uC5C6\uC2B5\uB2C8\uB2E4." }))] }));
}
const Section = styled.section `
  border: 1px solid #e5e7eb; border-radius: 16px; padding: 12px; background: #fff; display: flex; flex-direction: column;
`;
const SectionHeader = styled.div `
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;
  h4 { margin: 0; font-size: 15px; color: #111827; }
`;
const HeaderLeft = styled.div `
  display: flex; align-items: center; gap: 8px;
`;
const SectionIcon = styled.span `
  width: 28px; height: 28px; border-radius: 8px; display: grid; place-items: center; background: #eef2ff; color: #4f46e5;
`;
const Actions = styled.div ``;
const ActionBtn = styled.button `
  height: 32px; padding: 0 10px; border-radius: 8px; border: 1px solid #e5e7eb; background: #fff; color: #111827; font-weight: 700; font-size: 12px; cursor: pointer;
  &:hover { background: #f9fafb; }
`;
// SubHeader removed
const Count = styled.span `
  background: #e5e7eb; color: #374151; height: 20px; min-width: 22px; padding: 0 6px; border-radius: 9999px; display: inline-flex; align-items: center; justify-content: center; font-weight: 700; font-size: 12px;
`;
const List = styled.div `
  display: grid;
  gap: 8px;
  padding: 4px 2px;
  /* 상세 페이지는 내부 스크롤 없이 전체 표시 */
`;
const TaskCard = styled.div `
  display: grid; grid-template-columns: 1fr auto; align-items: flex-start; gap: 10px;
  border: 1px solid #e5e7eb; border-radius: 10px; padding: 10px 12px; background: #fff;
  transition: background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
  &:hover { background: #fafafa; border-color: #e2e8f0; box-shadow: 0 1px 2px rgba(0,0,0,0.04); }
`;
const Left = styled.div `
  display: grid; grid-template-columns: 10px 1fr; gap: 10px; align-items: flex-start; min-width: 0;
`;
const TaskTitle = styled.div `
  font-weight: 800; margin-bottom: 2px; font-size: 14px; letter-spacing: -0.01em; color: #0f172a;
  display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;
`;
const TaskContent = styled.div `
  color: #64748b;
  font-size: 12.5px;
  line-height: 1.5;
  white-space: pre-line;
  display: -webkit-box;
  -webkit-line-clamp: 5; /* 상세 페이지는 5줄 표시 */
  -webkit-box-orient: vertical;
  overflow: hidden;
`;
/* removed category/owner metadata display for cleaner look */
const GhostBtn = styled.button `
  height: 28px; padding: 0 10px; border-radius: 8px; border: 1px solid #e5e7eb; background: #fff; color: #0f172a; font-weight: 700; font-size: 12px;
  transition: background 0.15s ease, border-color 0.15s ease;
  &:hover { background: #f3f4f6; border-color: #e2e8f0; }
`;
const DangerBtn = styled.button `
  height: 28px; padding: 0 10px; border-radius: 8px; border: 1px solid #ef4444; background: #fff; color: #ef4444; font-weight: 700; font-size: 12px;
  transition: background 0.15s ease;
  &:hover { background: #fee2e2; }
`;
const BtnRow = styled.div `
  display: flex; gap: 6px; align-items: center;
`;
const Dot = styled.span `
  width: 10px; height: 10px; border-radius: 9999px; background: #4f46e5; margin-top: 5px;
`;
const TextArea = styled.div `
  display: flex; flex-direction: column; gap: 2px; min-width: 0;
`;
// Drag handle removed
/* meta row removed */
/* Divider & CountPill removed to match dashboard style */
const checkIcon = (_jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: _jsx("path", { d: "M20 6L9 17l-5-5" }) }));
