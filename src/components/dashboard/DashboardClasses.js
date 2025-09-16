import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { getClassesOn } from "../../api/calendar";
import { formatYMD } from "../../features/calendar/dateUtils";
import ClassList from "../calendar/detail/ClassList";
import { useNavigate } from "react-router-dom";
export default function DashboardClasses() {
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);
    // simplified: no loading state needed; list renders as it arrives
    const [error, setError] = useState(null);
    useEffect(() => {
        let cancelled = false;
        async function load() {
            setError(null);
            try {
                const res = await getClassesOn(formatYMD(new Date()));
                if (!cancelled)
                    setRows(res);
            }
            catch (e) {
                if (!cancelled)
                    setError(e?.message || "오늘 수업을 불러오지 못했습니다.");
            }
            finally { /* no-op */ }
        }
        void load();
        const t = setInterval(load, 15000);
        const onVis = () => { if (document.visibilityState === 'visible')
            void load(); };
        document.addEventListener('visibilitychange', onVis);
        return () => { cancelled = true; clearInterval(t); document.removeEventListener('visibilitychange', onVis); };
    }, []);
    function numOr(...vals) { for (const v of vals) {
        if (typeof v === 'number' && Number.isFinite(v))
            return v;
    } return 0; }
    const items = rows.map((r) => {
        const s = r.startTime ?? r.start_at ?? r.startAt ?? r.start ?? null;
        const e = r.endTime ?? r.end_at ?? r.endAt ?? r.end ?? null;
        const present = numOr(r.attPresent, r.presentCount, r.attendancePresent, r?.attendance?.present);
        const absent = numOr(r.attAbsent, r.absentCount, r.attendanceAbsent, r?.attendance?.absent);
        return {
            subject: r.courseTitle || '수업',
            time: formatTimeRange(s, e),
            room: '-',
            teacher: '-',
            student: '-',
            done: false,
            courseId: r.courseId || undefined,
            date: r.recordDate || r.date,
            recordId: r.recordId || r.id,
            notes: r.topic || r.notes || r.content || null,
            attPresent: present,
            attAbsent: absent,
        };
    });
    return (_jsx("div", { style: { gridColumn: 'span 6', minHeight: 0 }, children: _jsxs("div", { style: { height: '100%', overflow: 'auto' }, children: [_jsx(ClassList, { items: items, actionLabel: "\uB354\uBCF4\uAE30", onAdd: () => navigate(`/calendar/${formatYMD(new Date())}`), titleMode: "subject", showNotes: false }), error && _jsx(Err, { children: error })] }) }));
}
function toHHMM(x) {
    if (!x)
        return "--:--";
    try {
        const m = String(x).match(/(\d{2}):(\d{2})/);
        return m ? `${m[1]}:${m[2]}` : "--:--";
    }
    catch {
        return "--:--";
    }
}
function formatTimeRange(start, end) {
    return `${toHHMM(start)} ~ ${toHHMM(end)}`;
}
const Err = styled.div ` color:#b91c1c; font-size:12px; `;
