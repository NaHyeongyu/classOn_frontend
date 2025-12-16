import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMonthCalendar } from "@/hooks/useMonthCalendar";
import { useCoursesCalendar } from "@/features/calendar/useCoursesCalendar";
import { useTodoEvents } from "@/features/todos/useTodoEvents";
import { useCounselEvents } from "@/features/counsels/useCounselEvents";
import { usePaymentEvents } from "@/features/calendar/usePaymentEvents";
import {
  formatYMD,
} from "@/features/calendar/dateUtils";
import { getClassesMonth } from "@/api/calendar";

export function useCalendarPage() {
  const navigate = useNavigate();
  const { viewDate, matrix, prevMonth, nextMonth, setViewDate } =
    useMonthCalendar();
  const label = `${viewDate.getFullYear()}년 ${viewDate.getMonth() + 1}월`;
  const { eventsForDate: classEventsForDate } = useCoursesCalendar({
    dates: matrix,
  });
  const { eventsForDate: todoEventsForDate } = useTodoEvents(matrix);
  const { eventsForDate: counselEventsForDate } = useCounselEvents(matrix);
  const paymentEvents = usePaymentEvents();

  useEffect(() => {
    const prev = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
    const next = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
    const ymOf = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    void getClassesMonth(ymOf(prev));
    void getClassesMonth(ymOf(next));
  }, [viewDate]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement | null)?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || e.isComposing) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevMonth();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        nextMonth();
      } else if (e.key.toLowerCase() === "t") {
        e.preventDefault();
        setViewDate(new Date());
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prevMonth, nextMonth, setViewDate]);

  const openDate = (date: Date) => {
    navigate(`/calendar/${formatYMD(date)}`);
  };

  const getEventsForDate = (date: Date) => {
    if (date.getMonth() !== viewDate.getMonth()) return [];
    return [
      ...classEventsForDate(date),
      ...counselEventsForDate(date),
      ...todoEventsForDate(date),
      ...paymentEvents.eventsForDate(date),
    ];
  };

  return {
    viewDate,
    matrix,
    label,
    prevMonth,
    nextMonth,
    setViewDate,
    openDate,
    getEventsForDate,
  };
}
