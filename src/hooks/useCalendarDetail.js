import { useEffect, useMemo, useState } from "react";
import { formatYMD, parseYMD, stripTime, WEEK_LABELS } from "../features/calendar/dateUtils";
import { useCoursesCalendar } from "../features/calendar/useCoursesCalendar";
import { listCounsels } from "../api/counsels";
export function useCalendarDetail(ymd) {
    const date = useMemo(() => (ymd ? parseYMD(ymd) : stripTime(new Date())), [ymd]);
    const label = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 (${WEEK_LABELS[date.getDay()]})`;
    const { classesForDate } = useCoursesCalendar();
    const classes = useMemo(() => classesForDate(date), [classesForDate, date]);
    // Load counsels for this date from backend
    const [counsels, setCounsels] = useState([]);
    useEffect(() => {
        let cancelled = false;
        async function load() {
            try {
                const ymd = formatYMD(date);
                const res = await listCounsels({ onYmd: ymd, size: 50 });
                if (cancelled)
                    return;
                const items = (res.content || []).map(c => ({
                    id: c.id,
                    studentId: c.studentId,
                    time: toHM(c.counselTime),
                    title: (c.content || '').split(/\r?\n/)[0] || '상담',
                    with: c.studentName,
                    owner: '-',
                    done: c.status === 'CONVERTED',
                }));
                setCounsels(items);
            }
            catch {
                if (!cancelled)
                    setCounsels([]);
            }
        }
        void load();
        return () => { cancelled = true; };
    }, [date]);
    const inProgress = useMemo(() => [], []);
    const done = useMemo(() => [], []);
    function prevYMD() {
        const d = new Date(date);
        d.setDate(d.getDate() - 1);
        return formatYMD(d);
    }
    function nextYMD() {
        const d = new Date(date);
        d.setDate(d.getDate() + 1);
        return formatYMD(d);
    }
    function todayYMD() {
        return formatYMD(new Date());
    }
    return { date, label, classes, counsels, inProgress, done, prevYMD, nextYMD, todayYMD };
}
// ---- no mock generators ----
function toHM(iso) {
    if (!iso)
        return '--:--';
    try {
        return iso.replace('T', ' ').slice(11, 16);
    }
    catch {
        return '--:--';
    }
}
