import { CalendarPageView } from "@/views/calendar/CalendarPageView";
import { useCalendarPage } from "@/features/calendar/useCalendarPage";

export default function Calendar() {
  const {
    label,
    viewDate,
    matrix,
    prevMonth,
    nextMonth,
    setViewDate,
    openDate,
    getEventsForDate,
  } = useCalendarPage();

  return (
    <CalendarPageView
      label={label}
      viewDate={viewDate}
      dates={matrix}
      onPrevMonth={prevMonth}
      onNextMonth={nextMonth}
      onToday={() => setViewDate(new Date())}
      onSelectDate={openDate}
      getEvents={getEventsForDate}
    />
  );
}
