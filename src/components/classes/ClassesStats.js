import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styled from "styled-components";
import { useEffect, useMemo, useState } from "react";
import { listCourses } from "../../api/courses";
import { formatYMD } from "../../features/calendar/dateUtils";
export default function ClassesStats() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [total, setTotal] = useState(0);
    const [inProgress, setInProgress] = useState(0);
    const [todayCount, setTodayCount] = useState(0);
    const today = useMemo(() => formatYMD(new Date()), []);
    useEffect(() => {
        let cancelled = false;
        async function load() {
            setLoading(true);
            setError(null);
            try {
                const [t, p, d] = await Promise.all([
                    listCourses({ size: 1 }),
                    listCourses({ status: "IN_PROGRESS", size: 1 }),
                    listCourses({ onYmd: today, size: 1 }),
                ]);
                if (!cancelled) {
                    setTotal(t.totalElements);
                    setInProgress(p.totalElements);
                    setTodayCount(d.totalElements);
                }
            }
            catch (e) {
                if (!cancelled)
                    setError(e?.message || "수업 요약 정보를 불러오지 못했습니다.");
            }
            finally {
                if (!cancelled)
                    setLoading(false);
            }
        }
        void load();
        return () => { cancelled = true; };
    }, [today]);
    return (_jsxs(Row, { children: [_jsxs(StatCard, { children: [_jsxs(Head, { children: [_jsx(Title, { children: "\uCD1D \uC218\uC5C5 \uC218" }), _jsx(IconBox, { "aria-hidden": true, children: booksIcon })] }), _jsx(Value, { children: loading ? "…" : `${total}개` }), error && _jsx(Err, { children: error })] }), _jsxs(StatCard, { children: [_jsxs(Head, { children: [_jsx(Title, { children: "\uC9C4\uD589\uC911 \uC218\uC5C5" }), _jsx(IconBox, { "aria-hidden": true, children: playIcon })] }), _jsx(Value, { children: loading ? "…" : `${inProgress}개` })] }), _jsxs(StatCard, { children: [_jsxs(Head, { children: [_jsx(Title, { children: "\uC624\uB298 \uC218\uC5C5" }), _jsx(IconBox, { "aria-hidden": true, children: calendarIcon })] }), _jsx(Value, { children: loading ? "…" : `${todayCount}개` })] })] }));
}
const Row = styled.div `
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;
`;
const StatCard = styled.article `
  background: #fff; border: 1px solid #e5e7eb; border-radius: 14px; padding: 14px; display: flex; flex-direction: column; gap: 8px;
`;
const Head = styled.div ` display: flex; align-items: center; justify-content: space-between; `;
const Title = styled.h4 ` margin: 0; font-size: 14px; color: #6b7280; font-weight: 600; `;
const IconBox = styled.span ` width: 34px; height: 34px; border-radius: 10px; display: grid; place-items: center; background: #eef2ff; color: #4f46e5; `;
const Value = styled.div ` font-size: 28px; font-weight: 800; color: #111827; letter-spacing: -0.02em; `;
const Err = styled.div ` color: #b91c1c; font-size: 12px; `;
const booksIcon = (_jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("path", { d: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20" }), _jsx("path", { d: "M4 4v15.5A2.5 2.5 0 0 0 6.5 22H20" }), _jsx("path", { d: "M20 22V6a2 2 0 0 0-2-2H6" })] }));
const playIcon = (_jsx("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: _jsx("polygon", { points: "5 3 19 12 5 21 5 3" }) }));
const calendarIcon = (_jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("rect", { x: "3", y: "4", width: "18", height: "18", rx: "2" }), _jsx("line", { x1: "16", y1: "2", x2: "16", y2: "6" }), _jsx("line", { x1: "8", y1: "2", x2: "8", y2: "6" }), _jsx("line", { x1: "3", y1: "10", x2: "21", y2: "10" })] }));
