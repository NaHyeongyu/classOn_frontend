import { useMemo, useState, useCallback } from "react";
import { buildMonthMatrix, stripTime } from "../features/calendar/dateUtils";
export function useMonthCalendar(initial) {
    const [viewDate, setViewDate] = useState(() => stripTime(initial ?? new Date()));
    const matrix = useMemo(() => buildMonthMatrix(viewDate), [viewDate]);
    const prevMonth = useCallback(() => {
        setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
    }, []);
    const nextMonth = useCallback(() => {
        setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
    }, []);
    return { viewDate, setViewDate, matrix, prevMonth, nextMonth };
}
