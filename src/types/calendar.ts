export type CalendarEventType = "class" | "counsel" | "todo";

export interface CalendarEvent {
  type: CalendarEventType;
  label: string;
  // Optional aggregated count for this event type on the date
  count?: number;
}
