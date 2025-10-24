import { formatKoreanDateTime } from "@/lib/format";
import { saveBlobAsFile, sanitizeFilename } from "@/features/courseDetail/utils";

export function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

export function formatStudentMemoDate(iso: string): string {
  return formatKoreanDateTime(iso, { includeWeekday: true });
}

export function defaultCounselDate(): string {
  const now = new Date();
  return `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(
    now.getDate()
  )}`;
}

export function makeCounselTimestamp(
  date: string,
  hour: string,
  minute: string
): string {
  return `${date}T${hour}:${minute}:00`;
}

export function makeCounselFilename(
  studentName: string | undefined,
  studentId: number
): string {
  const base = studentName?.trim() || `student_${studentId}`;
  return sanitizeFilename(`${base}_counsels`);
}

export function courseStatusLabel(status: string): string {
  switch (status) {
    case "IN_PROGRESS":
      return "진행중";
    case "PENDING":
      return "대기";
    case "STOPPED":
      return "중단";
    default:
      return status;
  }
}

export { saveBlobAsFile, sanitizeFilename };
