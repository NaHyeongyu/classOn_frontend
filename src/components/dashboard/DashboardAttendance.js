import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { DashboardPanel } from "./DashboardLayout";
import { getAttendanceToday } from "../../api/dashboard";
export default function DashboardAttendance() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        let cancelled = false;
        async function load() {
            setLoading(true);
            setError(null);
            try {
                const res = await getAttendanceToday();
                if (!cancelled)
                    setRows(res.filter(r => r.present));
            }
            catch (e) {
                if (!cancelled)
                    setError(e?.message || "출석 정보를 불러오지 못했습니다.");
            }
            finally {
                if (!cancelled)
                    setLoading(false);
            }
        }
        void load();
        const t = setInterval(load, 60000); // refresh every minute
        return () => { cancelled = true; clearInterval(t); };
    }, []);
    return (_jsxs(DashboardPanel, { span: 6, children: [_jsx(Head, { children: _jsxs("div", { children: [_jsx("strong", { children: "\uCD9C\uC11D \uD559\uC0DD" }), _jsx(Muted, { children: loading ? "불러오는 중..." : `${rows.length}건` }), error && _jsx(Err, { children: error })] }) }), _jsxs(List, { children: [rows.length === 0 && !loading && (_jsx(Empty, { children: "\uC624\uB298 \uCD9C\uC11D \uCC98\uB9AC\uB41C \uD559\uC0DD\uC774 \uC5C6\uC2B5\uB2C8\uB2E4." })), rows.map(r => (_jsxs(Item, { children: [_jsxs("div", { className: "main", children: [_jsx("strong", { children: r.studentName }), _jsx("span", { className: "course", children: r.courseTitle || '-' })] }), _jsxs("div", { className: "meta", children: [_jsx(Time, { children: formatTime(r.createdAt) }), _jsx(Source, { "data-type": r.source, children: r.source === 'MOBILE' ? '모바일' : '수동' })] })] }, r.id)))] })] }));
}
function formatTime(iso) {
    try {
        const d = new Date(iso);
        const hh = String(d.getHours()).padStart(2, '0');
        const mm = String(d.getMinutes()).padStart(2, '0');
        return `${hh}:${mm}`;
    }
    catch {
        return iso;
    }
}
const Head = styled.div ` display:flex; align-items:center; justify-content:space-between; `;
const Muted = styled.div ` color:#6b7280; font-size:12px; margin-top:4px; `;
const Err = styled.div ` color:#b91c1c; font-size:12px; `;
const List = styled.div ` display:grid; gap:8px; margin-top:8px; `;
const Item = styled.div `
  background:#fff; border:1px solid #e5e7eb; border-radius:10px; padding:10px 12px; display:flex; align-items:center; justify-content:space-between; gap:8px;
  .main { display:flex; flex-direction:column; gap:2px; }
  .course { color:#6b7280; font-size:12px; }
  .meta { display:inline-flex; align-items:center; gap:8px; }
`;
const Source = styled.span `
  padding: 2px 8px; border-radius: 9999px; font-size: 12px; font-weight: 800; border:1px solid #e5e7eb; color:#374151; background:#f9fafb;
  &[data-type='MOBILE'] { background:#dcfce7; color:#16a34a; border-color:#bbf7d0; }
  &[data-type='MANUAL'] { background:#f3f4f6; color:#374151; border-color:#e5e7eb; }
`;
const Time = styled.span ` color:#6b7280; font-size:12px; `;
const Empty = styled.div ` color:#6b7280; font-size:13px; text-align:center; border:1px dashed #e5e7eb; border-radius:10px; padding:12px; background:#fafafa; `;
