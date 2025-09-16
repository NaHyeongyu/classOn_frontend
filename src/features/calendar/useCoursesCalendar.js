import { useCallback, useEffect, useState } from "react";
import { listCourses } from "../../api/courses";
import { formatYMD } from "./dateUtils";
const DOW_MAP = {
    SUN: 0,
    MON: 1,
    TUE: 2,
    WED: 3,
    THU: 4,
    FRI: 5,
    SAT: 6,
};
function hhmm(t) {
    if (!t)
        return "";
    const [h, m] = t.split(":");
    return `${h}:${m}`;
}
function matchesDate(c, d) {
    if (!c || c.status === "STOPPED")
        return false;
    const dow = d.getDay();
    const days = (c.recurrenceDays || "")
        .split(",")
        .map((s) => s.trim().toUpperCase())
        .filter(Boolean)
        .map((s) => DOW_MAP[s])
        .filter((n) => typeof n === "number");
    if (days.length === 0)
        return false;
    return days.includes(dow);
}
function toClassItem(c) {
    const time = c.startTime && c.endTime ? `${hhmm(c.startTime)} ~ ${hhmm(c.endTime)}` : c.courseTime || "-";
    return {
        subject: c.title,
        time,
        room: "-",
        teacher: "-",
        student: "-",
        done: false,
    };
}
export function useCoursesCalendar() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        let cancelled = false;
        async function loadAll() {
            setLoading(true);
            setError(null);
            try {
                const size = 100;
                let page = 0;
                let acc = [];
                while (true) {
                    const res = await listCourses({ page, size, status: "IN_PROGRESS" });
                    acc = acc.concat(res.content || []);
                    if (res.last || (res.content || []).length === 0 || page > 200)
                        break;
                    page += 1;
                }
                if (!cancelled)
                    setCourses(acc);
            }
            catch (e) {
                if (!cancelled)
                    setError(e?.message || "수업 목록을 불러오지 못했습니다.");
            }
            finally {
                if (!cancelled)
                    setLoading(false);
            }
        }
        void loadAll();
        return () => { cancelled = true; };
    }, []);
    const classesForDate = useCallback((d) => {
        const list = courses.filter((c) => matchesDate(c, d))
            .sort((a, b) => (a.startTime || "").localeCompare(b.startTime || ""))
            .map((c) => {
            const base = toClassItem(c);
            return { ...base, courseId: c.id, date: formatYMD(d) };
        });
        return list;
    }, [courses]);
    const eventsForDate = useCallback((d) => {
        const n = classesForDate(d).length;
        const events = [];
        if (n > 0)
            events.push({ type: "class", label: `수업 ${n}개` });
        return events;
    }, [classesForDate]);
    return { courses, loading, error, classesForDate, eventsForDate };
}
