import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { listStudents } from "../../api/students";
export default function StudentsStats() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [total, setTotal] = useState(0);
    const [enrolled, setEnrolled] = useState(0);
    const [onLeave, setOnLeave] = useState(0);
    const [pending, setPending] = useState(0);
    useEffect(() => {
        let cancelled = false;
        async function load() {
            setLoading(true);
            setError(null);
            try {
                const [t, e, l, p] = await Promise.all([
                    listStudents({ size: 1 }),
                    listStudents({ status: "ENROLLED", size: 1 }),
                    listStudents({ status: "ON_LEAVE", size: 1 }),
                    listStudents({ status: "PENDING", size: 1 }),
                ]);
                if (!cancelled) {
                    setTotal(t.totalElements);
                    setEnrolled(e.totalElements);
                    setOnLeave(l.totalElements);
                    setPending(p.totalElements);
                }
            }
            catch (e) {
                if (!cancelled)
                    setError(e?.message || "요약 정보를 불러오지 못했습니다.");
            }
            finally {
                if (!cancelled)
                    setLoading(false);
            }
        }
        void load();
        return () => { cancelled = true; };
    }, []);
    return (_jsxs(Row, { children: [_jsxs(StatCard, { children: [_jsxs(Head, { children: [_jsx(Title, { children: "\uCD1D \uC6D0\uC0DD \uC218" }), _jsx(IconBox, { "aria-hidden": true, children: usersIcon })] }), _jsx(Value, { children: loading ? "…" : `${total}명` }), error && _jsx(Err, { children: error })] }), _jsxs(StatCard, { children: [_jsxs(Head, { children: [_jsx(Title, { children: "\uC218\uAC15\uC911" }), _jsx(IconBox, { "aria-hidden": true, children: classIcon })] }), _jsx(Value, { children: loading ? "…" : `${enrolled}명` })] }), _jsxs(StatCard, { children: [_jsxs(Head, { children: [_jsx(Title, { children: "\uD734\uD559" }), _jsx(IconBox, { "aria-hidden": true, children: pauseIcon })] }), _jsx(Value, { children: loading ? "…" : `${onLeave}명` })] }), _jsxs(StatCard, { children: [_jsxs(Head, { children: [_jsx(Title, { children: "\uB300\uAE30\uC911" }), _jsx(IconBox, { "aria-hidden": true, children: waitIcon })] }), _jsx(Value, { children: loading ? "…" : `${pending}명` })] })] }));
}
const Row = styled.div `
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
`;
const StatCard = styled.article `
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const Head = styled.div `
  display: flex; align-items: center; justify-content: space-between;
`;
const Title = styled.h4 `
  margin: 0; font-size: 14px; color: #6b7280; font-weight: 600;
`;
const IconBox = styled.span `
  width: 34px; height: 34px; border-radius: 10px; display: grid; place-items: center; background: #eef2ff; color: #4f46e5;
`;
const Value = styled.div `
  font-size: 28px; font-weight: 800; color: #111827; letter-spacing: -0.02em;
`;
const Err = styled.div `
  color: #b91c1c; font-size: 12px;
`;
const usersIcon = (_jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("path", { d: "M20 21v-2a4 4 0 0 0-3-3.87" }), _jsx("path", { d: "M4 21v-2a4 4 0 0 1 3-3.87" }), _jsx("circle", { cx: "7", cy: "7", r: "4" }), _jsx("circle", { cx: "17", cy: "7", r: "4" })] }));
const classIcon = (_jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("path", { d: "M22 10L12 4 2 10l10 6 10-6z" }), _jsx("path", { d: "M6 12v5l6 3 6-3v-5" })] }));
const pauseIcon = (_jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("rect", { x: "6", y: "4", width: "4", height: "16" }), _jsx("rect", { x: "14", y: "4", width: "4", height: "16" })] }));
const waitIcon = (_jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("circle", { cx: "12", cy: "12", r: "10" }), _jsx("path", { d: "M12 6v6l3 3" })] }));
