import { formatKoreanDate } from "@/lib/format";

export function hhmm(time?: string): string {
  if (!time) return "";
  const [h, m] = time.split(":");
  return `${h}:${m}`;
}

export function formatRange(start?: string, end?: string): string {
  return start && end ? `${hhmm(start)} ~ ${hhmm(end)}` : "";
}

export function formatDateBadge(ymd?: string): string {
  if (!ymd) return "일자 미지정";
  const formatted = formatKoreanDate(ymd, {
    includeYear: true,
    includeWeekday: true,
  });
  return formatted === "—" ? ymd : formatted;
}

export function getDurationMinutes(start?: string, end?: string): number | null {
  if (!start || !end) return null;
  const [sh, sm] = start.split(":");
  const [eh, em] = end.split(":");
  const startMinutes = Number(sh) * 60 + Number(sm);
  const endMinutes = Number(eh) * 60 + Number(em);
  const diff = endMinutes - startMinutes;
  return diff >= 0 ? diff : diff + 24 * 60;
}

export function formatDuration(minutes: number | null): string {
  if (minutes == null || !Number.isFinite(minutes) || minutes <= 0) {
    return "미지정";
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours && mins) return `${hours}시간 ${mins}분`;
  if (hours) return `${hours}시간`;
  return `${mins}분`;
}

export function toHHMM(time?: string): string {
  if (!time) return "";
  const [h, m] = time.split(":");
  return `${h}:${m}`;
}

export function toHHMMSS(time?: string): string | undefined {
  if (!time) return undefined;
  const parts = time.split(":").map((part) => part.padStart(2, "0"));
  if (parts.length >= 3) {
    return `${parts[0]}:${parts[1]}:${parts[2]}`;
  }
  if (parts.length === 2) {
    return `${parts[0]}:${parts[1]}:00`;
  }
  return undefined;
}

export function letterFromNumeric(value?: number | null): string | null {
  if (value == null || !Number.isFinite(value)) return null;
  const rounded = Math.round(Number(value));
  if (rounded >= 90) return "A";
  if (rounded >= 80) return "B";
  if (rounded >= 70) return "C";
  if (rounded >= 60) return "D";
  if (rounded >= 50) return "E";
  return "F";
}

export function numericFromLetter(level?: string): number | null {
  if (!level) return null;
  const letter = level.trim()[0]?.toUpperCase();
  if (letter === "A") return 100;
  if (letter === "B") return 90;
  if (letter === "C") return 80;
  if (letter === "D") return 70;
  if (letter === "E") return 60;
  if (letter === "F") return 50;
  return null;
}
