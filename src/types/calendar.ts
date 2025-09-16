export type CalendarEventType = "class" | "counsel" | "todo";

export interface CalendarEvent {
  type: CalendarEventType;
  label: string;
}

