import { fetchJSON } from "../lib/fetcher";
import type { Student } from "./students";
import type { PageResult } from "../types/paging";

export type Course = {
  id: number;
  code: string;
  title: string;
  description?: string;
  status: "IN_PROGRESS" | "STOPPED" | "PENDING";
  capacity?: number;
  fee?: number;
  createdAt: string;
  courseTime?: string;
  enrolledCount?: number;
  nextClassDate?: string;
  recurrenceDays?: string; // e.g., MON,WED
  startTime?: string; // HH:mm:ss
  endTime?: string;   // HH:mm:ss
  recurring?: boolean;
};

export type CourseRecord = {
  id: number;
  courseId: number;
  recordDate: string; // YYYY-MM-DD
  startTime?: string; // HH:mm:ss
  endTime?: string;   // HH:mm:ss
  topic?: string;
  notes?: string;
  content?: string;
  createdAt: string;
};

export type Attendance = {
  id: number;
  studentId: number;
  studentName: string;
  present: boolean;
  reason?: string;
};

export type Attachment = {
  id: number;
  filename: string;
  contentType?: string;
  size: number;
  createdAt: string;
};

// Re-export for existing imports from this module
export type { PageResult } from "../types/paging";

export async function listCourses(params?: { status?: Course["status"] | ""; q?: string; page?: number; size?: number; onYmd?: string; }): Promise<PageResult<Course>> {
  const sp = new URLSearchParams();
  if (params?.status) sp.set("status", params.status);
  if (params?.q && params.q.trim()) sp.set("q", params.q.trim());
  if (typeof params?.page === "number") sp.set("page", String(params.page));
  if (typeof params?.size === "number") sp.set("size", String(params.size));
  if (params?.onYmd) sp.set("onYmd", params.onYmd);
  const q = Array.from(sp.keys()).length ? `?${sp}` : "";
  return await fetchJSON<PageResult<Course>>(`/api/courses${q}`);
}

export async function getCourse(id: number): Promise<Course> {
  return await fetchJSON<Course>(`/api/courses/${id}`);
}

export async function createCourse(payload: Partial<Course>): Promise<Course> {
  const body = JSON.stringify({
    title: payload.title,
    description: payload.description,
    status: payload.status,
    capacity: payload.capacity,
    fee: payload.fee,
    courseTime: payload.courseTime,
    recurrenceDays: payload.recurrenceDays,
    startTime: payload.startTime,
    endTime: payload.endTime,
    recurring: payload.recurring ?? true,
  });
  return await fetchJSON<Course>(`/api/courses`, { method: "POST", body });
}

export async function updateCourse(id: number, payload: Partial<Course>): Promise<Course> {
  const body = JSON.stringify({
    title: payload.title,
    description: payload.description,
    status: payload.status,
    capacity: payload.capacity,
    fee: payload.fee,
    courseTime: payload.courseTime,
    recurrenceDays: payload.recurrenceDays,
    startTime: payload.startTime,
    endTime: payload.endTime,
    recurring: payload.recurring ?? true,
  });
  return await fetchJSON<Course>(`/api/courses/${id}`, { method: "PUT", body });
}

export async function listCourseStudents(id: number): Promise<Student[]> {
  return await fetchJSON<Student[]>(`/api/courses/${id}/students`);
}

export async function listCourseRecords(id: number, params?: { from?: string; to?: string; }): Promise<CourseRecord[]> {
  const sp = new URLSearchParams();
  if (params?.from) sp.set("from", params.from);
  if (params?.to) sp.set("to", params.to);
  const q = Array.from(sp.keys()).length ? `?${sp}` : "";
  return await fetchJSON<CourseRecord[]>(`/api/courses/${id}/records${q}`);
}

export async function updateCourseRecord(courseId: number, recordId: number, payload: Partial<Pick<CourseRecord, 'recordDate'|'startTime'|'endTime'|'topic'|'notes'|'content'>>): Promise<CourseRecord> {
  const body = JSON.stringify(payload);
  return await fetchJSON<CourseRecord>(`/api/courses/${courseId}/records/${recordId}`, { method: 'PUT', body });
}

export async function deleteCourseRecord(courseId: number, recordId: number): Promise<{ deleted: number }> {
  return await fetchJSON<{ deleted: number }>(`/api/courses/${courseId}/records/${recordId}`, { method: 'DELETE' });
}

export async function createCourseRecord(courseId: number, payload: { recordDate: string; startTime?: string; endTime?: string; topic?: string; notes?: string; content?: string; }): Promise<CourseRecord> {
  const body = JSON.stringify(payload);
  return await fetchJSON<CourseRecord>(`/api/courses/${courseId}/records`, { method: 'POST', body });
}

export async function generateCourseRecords(courseId: number, params?: { from?: string; to?: string; }): Promise<{ created: number }> {
  const sp = new URLSearchParams();
  if (params?.from) sp.set('from', params.from);
  if (params?.to) sp.set('to', params.to);
  const q = Array.from(sp.keys()).length ? `?${sp}` : '';
  return await fetchJSON<{ created: number }>(`/api/courses/${courseId}/records/generate${q}`, { method: 'POST' });
}

export async function deleteCourseRecordsRange(courseId: number, params: { from: string; to: string; }): Promise<{ deleted: number }> {
  const sp = new URLSearchParams({ from: params.from, to: params.to });
  return await fetchJSON<{ deleted: number }>(`/api/courses/${courseId}/records?${sp}`, { method: 'DELETE' });
}

export async function listRecordAttendance(courseId: number, recordId: number): Promise<Attendance[]> {
  return await fetchJSON<Attendance[]>(`/api/courses/${courseId}/records/${recordId}/attendance`);
}

export async function upsertAttendance(courseId: number, recordId: number, studentId: number, payload: { present: boolean; reason?: string; source?: 'MOBILE' | 'MANUAL' }): Promise<Attendance> {
  const body = JSON.stringify(payload);
  return await fetchJSON<Attendance>(`/api/courses/${courseId}/records/${recordId}/attendance/${studentId}`, { method: 'PUT', body });
}

export async function listRecordAttachments(courseId: number, recordId: number): Promise<Attachment[]> {
  return await fetchJSON<Attachment[]>(`/api/courses/${courseId}/records/${recordId}/attachments`);
}

export async function uploadRecordAttachments(courseId: number, recordId: number, files: File[]): Promise<Attachment[]> {
  const form = new FormData();
  files.forEach(f => form.append('files', f));
  return await fetchJSON<Attachment[]>(`/api/courses/${courseId}/records/${recordId}/attachments`, { method: 'POST', body: form });
}

export async function deleteRecordAttachment(courseId: number, recordId: number, fileId: number): Promise<void> {
  await fetchJSON<void>(`/api/courses/${courseId}/records/${recordId}/attachments/${fileId}`, { method: 'DELETE' });
}

export async function deleteCourse(id: number): Promise<void> {
  await fetchJSON<void>(`/api/courses/${id}`, { method: 'DELETE' });
}
