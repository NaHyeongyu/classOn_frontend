import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styled from "styled-components";
import { SectionCard as Card, Scroller, TableBase as Table, GhostBtn as UIGhostBtn, PrimaryBtn as UIPrimaryBtn } from "../common/UI";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listCourses } from "../../api/courses";
import { visiblePages } from "../../lib/pagination";
export default function ClassesTable({ filters, refreshKey }) {
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(false);
    useEffect(() => { setPage(0); }, [filters.status, filters.q]);
    useEffect(() => {
        let cancelled = false;
        async function load() {
            setError(null);
            setLoading(true);
            try {
                const res = await listCourses({
                    page, size,
                    status: filters.status || undefined,
                    q: filters.q || undefined,
                });
                if (!cancelled) {
                    setRows(res.content);
                    setTotalPages(res.totalPages);
                    setTotalElements(res.totalElements);
                }
            }
            catch (e) {
                if (!cancelled)
                    setError(e?.message || "수업 불러오기에 실패했습니다.");
            }
            finally {
                if (!cancelled)
                    setLoading(false);
            }
        }
        void load();
        return () => { cancelled = true; };
    }, [page, size, filters.status, filters.q, refreshKey]);
    function hhmm(t) {
        if (!t)
            return "";
        const [h, m] = t.split(":");
        return `${h}:${m}`;
    }
    function dayLabel(code) {
        const map = { MON: "월", TUE: "화", WED: "수", THU: "목", FRI: "금", SAT: "토", SUN: "일" };
        return map[code.toUpperCase()] || code;
    }
    function buildDays(r) {
        if (r.recurrenceDays) {
            return r.recurrenceDays
                .split(',')
                .map((s) => dayLabel(s.trim()))
                .filter(Boolean)
                .join('/');
        }
        return '-';
    }
    function buildTimeRange(r) {
        if (r.startTime && r.endTime) {
            return `${hhmm(r.startTime)} ~ ${hhmm(r.endTime)}`;
        }
        // fallback for legacy free-text courseTime
        return r.courseTime || '-';
    }
    function statusLabel(s) {
        switch (s) {
            case "IN_PROGRESS": return "진행중";
            case "PENDING": return "대기";
            case "STOPPED": return "중단";
            default: return s;
        }
    }
    const view = useMemo(() => rows.map(r => ({
        id: r.id,
        title: r.title,
        code: r.code,
        rawStatus: r.status,
        statusText: statusLabel(r.status),
        days: buildDays(r),
        time: buildTimeRange(r),
        enrolled: r.enrolledCount ?? '-',
        next: r.nextClassDate || '-',
    })), [rows]);
    function changePage(p) { if (p >= 0 && p < totalPages)
        setPage(p); }
    return (_jsxs(Card, { children: [_jsxs(Head, { children: [_jsxs("div", { children: [_jsx("strong", { children: "\uC218\uC5C5 \uBAA9\uB85D" }), _jsx(Muted, { children: loading ? "불러오는 중..." : `총 ${totalElements}개의 수업이 조회되었습니다.` }), error && _jsx(Err, { children: error })] }), _jsxs(HeadActions, { children: [_jsx(UIGhostBtn, { as: "button", children: "\uC5D1\uC140\uB85C \uB2E4\uC6B4\uBC1B\uAE30" }), _jsx(UIPrimaryBtn, { as: "button", onClick: () => navigate('/classes/new'), children: "\uC218\uC5C5 \uCD94\uAC00\uD558\uAE30" })] })] }), _jsx(Scroller, { children: _jsxs(Table, { style: { minWidth: 820 }, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "\uCF54\uB4DC" }), _jsx("th", { children: "\uC218\uC5C5\uBA85" }), _jsx("th", { children: "\uC694\uC77C" }), _jsx("th", { children: "\uC2DC\uAC04" }), _jsx("th", { children: "\uC218\uAC15\uC778\uC6D0" }), _jsx("th", { children: "\uB2E4\uC74C \uC218\uC5C5" }), _jsx("th", { children: "\uC0C1\uD0DC" })] }) }), _jsx("tbody", { children: view.map(r => (_jsxs("tr", { children: [_jsx("td", { children: _jsx("code", { children: r.code }) }), _jsx("td", { children: _jsx(NameBtn, { type: "button", onClick: () => navigate(`/classes/${r.id}`), children: r.title }) }), _jsx("td", { children: r.days }), _jsx("td", { children: r.time }), _jsx("td", { children: r.enrolled }), _jsx("td", { children: r.next }), _jsx("td", { children: _jsx(StatusChip, { "data-type": r.rawStatus, children: r.statusText }) })] }, r.id))) })] }) }), _jsxs(Pager, { children: [_jsx(Btn, { onClick: () => changePage(page - 1), disabled: page === 0, children: "\uC774\uC804" }), visiblePages(page, totalPages, 7).map(p => (_jsx(Btn, { "data-active": p === page, onClick: () => changePage(p), children: p + 1 }, p))), _jsx(Btn, { onClick: () => changePage(page + 1), disabled: page >= totalPages - 1, children: "\uB2E4\uC74C" }), _jsxs(PageSize, { children: [_jsx("span", { children: "\uD398\uC774\uC9C0\uB2F9" }), _jsxs("select", { value: size, onChange: (e) => { setPage(0); setSize(Number(e.target.value)); }, children: [_jsx("option", { value: 10, children: "10" }), _jsx("option", { value: 20, children: "20" }), _jsx("option", { value: 50, children: "50" })] })] })] })] }));
}
// Card provided by common UI
const Head = styled.div ` display:flex; align-items:center; justify-content:space-between; `;
const HeadActions = styled.div ` display:inline-flex; gap:8px; `;
const Muted = styled.div ` color:#6b7280; font-size:12px; margin-top:4px; `;
const Err = styled.div ` color:#b91c1c; font-size:12px; `;
// Table provided by common UI
const NameBtn = styled.button ` all:unset; cursor:pointer; color:#1f2937; font-weight:800; &:hover{text-decoration:underline;} `;
const StatusChip = styled.span `
  padding: 2px 8px; border-radius: 9999px; font-size: 12px; font-weight: 800;
  &[data-type='IN_PROGRESS'] { background:#dcfce7; color:#16a34a; }
  &[data-type='PENDING'] { background:#f3e8ff; color:#7c3aed; }
  &[data-type='STOPPED'] { background:#e5e7eb; color:#374151; }
`;
const Pager = styled.div ` display:flex; gap:6px; justify-content:center; padding-top:4px; `;
const Btn = styled.button `
  min-width:28px; height:28px; padding:0 8px; border-radius:8px; border:1px solid #e5e7eb; background:#fff; font-size:12px; color:#111827;
  &[data-active='true'] { background:#111827; color:#fff; border-color:#111827; }
  &:disabled { opacity:.5; cursor:not-allowed; }
`;
const PageSize = styled.div ` display:inline-flex; align-items:center; gap:6px; margin-left:12px; color:#6b7280; font-size:12px; select{ height:28px; border:1px solid #e5e7eb; border-radius:8px; background:#fff; padding:0 8px; }`;
