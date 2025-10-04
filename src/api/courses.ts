import { fetchJSON, invalidateCacheByPrefix } from "../lib/fetcher";
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
  courseType?: 'INDIVIDUAL' | 'GROUP';
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
  downloadUrl?: string;
};

// Re-export for existing imports from this module
export type { PageResult } from "../types/paging";

export async function listCourses(params?: { status?: Course["status"] | ""; q?: string; page?: number; size?: number; onYmd?: string; s?: 'title'|'status'|'capacity'|'fee'|'startTime'|'endTime'|'createdAt'; dir?: 'ASC'|'DESC' }): Promise<PageResult<Course>> {
  const sp = new URLSearchParams();
  if (params?.status) sp.set("status", params.status);
  if (params?.q && params.q.trim()) sp.set("q", params.q.trim());
  if (params?.s) sp.set('s', params.s);
  if (params?.dir) sp.set('dir', params.dir);
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
    courseType: payload.courseType ?? 'GROUP',
    courseTime: payload.courseTime,
    recurrenceDays: payload.recurrenceDays,
    startTime: payload.startTime,
    endTime: payload.endTime,
    recurring: payload.recurring ?? true,
  });
  const res = await fetchJSON<Course>(`/api/courses`, { method: "POST", body });
  // Invalidate related caches so auto-generated records/summary reflect immediately
  try {
    invalidateCacheByPrefix([
      '/api/courses',
      res?.id ? `/api/courses/${res.id}` : '/api/courses/',
      res?.id ? `/api/courses/${res.id}/records` : '/api/courses/',
      '/api/calendar/classes',
      '/api/calendar/classes-range',
    ]);
  } catch {}
  return res;
}

export async function updateCourse(id: number, payload: Partial<Course>): Promise<Course> {
  const body = JSON.stringify({
    title: payload.title,
    description: payload.description,
    status: payload.status,
    capacity: payload.capacity,
    fee: payload.fee,
    courseType: payload.courseType ?? 'GROUP',
    courseTime: payload.courseTime,
    recurrenceDays: payload.recurrenceDays,
    startTime: payload.startTime,
    endTime: payload.endTime,
    recurring: payload.recurring ?? true,
  });
  const res = await fetchJSON<Course>(`/api/courses/${id}`, { method: "PUT", body });
  try {
    invalidateCacheByPrefix([
      '/api/courses',
      `/api/courses/${id}`,
      `/api/courses/${id}/records`,
      '/api/calendar/classes',
      '/api/calendar/classes-range',
    ]);
  } catch {}
  return res;
}

export async function listCourseStudents(id: number): Promise<Student[]> {
  return await fetchJSON<Student[]>(`/api/courses/${id}/students`);
}

export async function listCourseRecords(id: number, params?: { from?: string; to?: string; page?: number; size?: number; }): Promise<CourseRecord[]> {
  const sp = new URLSearchParams();
  if (params?.from) sp.set("from", params.from);
  if (params?.to) sp.set("to", params.to);
  if (typeof params?.page === 'number') sp.set('page', String(params.page));
  if (typeof params?.size === 'number') sp.set('size', String(params.size));
  const q = Array.from(sp.keys()).length ? `?${sp}` : "";
  return await fetchJSON<CourseRecord[]>(`/api/courses/${id}/records${q}`);
}

export async function updateCourseRecord(courseId: number, recordId: number, payload: Partial<Pick<CourseRecord, 'recordDate'|'startTime'|'endTime'|'topic'|'notes'|'content'>>): Promise<CourseRecord> {
  const body = JSON.stringify(payload);
  return await fetchJSON<CourseRecord>(`/api/courses/${courseId}/records/${recordId}`, { method: 'PUT', body });
}

export async function deleteCourseRecord(courseId: number, recordId: number): Promise<void> {
  await fetchJSON<void>(`/api/courses/${courseId}/records/${recordId}`, { method: 'DELETE' });
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

export async function deleteCourseRecordsRange(courseId: number, params: { from: string; to: string; }): Promise<void> {
  const sp = new URLSearchParams({ from: params.from, to: params.to });
  await fetchJSON<void>(`/api/courses/${courseId}/records?${sp}`, { method: 'DELETE' });
}

export async function listRecordAttendance(courseId: number, recordId: number): Promise<Attendance[]> {
  return await fetchJSON<Attendance[]>(`/api/courses/${courseId}/records/${recordId}/attendance`);
}

export async function upsertAttendance(courseId: number, recordId: number, studentId: number, payload: { present: boolean; reason?: string; source?: 'MOBILE' | 'MANUAL' }): Promise<Attendance> {
  const body = JSON.stringify(payload);
  return await fetchJSON<Attendance>(`/api/courses/${courseId}/records/${recordId}/attendance/${studentId}`, { method: 'PUT', body });
}

export async function listRecordAttachments(courseId: number, recordId: number, opts?: { presign?: boolean }): Promise<Attachment[]> {
  const sp = new URLSearchParams();
  if (opts?.presign) sp.set('presign', 'true');
  const q = Array.from(sp.keys()).length ? `?${sp.toString()}` : '';
  return await fetchJSON<Attachment[]>(`/api/courses/${courseId}/records/${recordId}/attachments${q}`);
}

export async function uploadRecordAttachments(courseId: number, recordId: number, files: File[]): Promise<Attachment[]> {
  const form = new FormData();
  files.forEach(f => form.append('files', f));
  return await fetchJSON<Attachment[]>(`/api/courses/${courseId}/records/${recordId}/attachments`, { method: 'POST', body: form });
}

// Presign flow: request PUT URL then confirm metadata
export async function presignRecordAttachment(courseId: number, recordId: number, filename: string, contentType: string, expireSec?: number): Promise<{ url: string; key: string; headers: Record<string,string>; expiresAt: number; method: 'PUT' }>{
  const body = JSON.stringify({ filename, contentType, expireSec });
  return await fetchJSON(`/api/courses/${courseId}/records/${recordId}/attachments/presign`, { method: 'POST', body });
}

export async function confirmRecordAttachment(courseId: number, recordId: number, payload: { key: string; filename: string; contentType: string; size: number; etag?: string; originalName?: string }): Promise<Attachment> {
  const body = JSON.stringify({
    ...payload,
    // Send both for compatibility; server may accept either
    originalName: payload.originalName ?? payload.filename,
  });
  return await fetchJSON<Attachment>(`/api/courses/${courseId}/records/${recordId}/attachments/confirm`, { method: 'POST', body });
}

export async function getRecordAttachmentDownloadUrl(courseId: number, recordId: number, fileId: number, expireSec?: number): Promise<{ url: string; expiresAt: number; method: 'GET' }>{
  const sp = new URLSearchParams();
  if (expireSec) sp.set('expireSec', String(expireSec));
  const q = Array.from(sp.keys()).length ? `?${sp}` : '';
  return await fetchJSON(`/api/courses/${courseId}/records/${recordId}/attachments/${fileId}/download-url${q}`);
}

export async function deleteRecordAttachment(courseId: number, recordId: number, fileId: number): Promise<void> {
  await fetchJSON<void>(`/api/courses/${courseId}/records/${recordId}/attachments/${fileId}`, { method: 'DELETE' });
}

export async function downloadRecordAttachmentBlob(courseId: number, recordId: number, fileId: number): Promise<Blob> {
  // Reuse blob fetch helper used by Excel utilities to include Authorization header
  const API_BASE = ((import.meta as any).env?.VITE_API_BASE ?? (import.meta as any).env?.VITE_API_BASE_URL) ?? ((import.meta as any).env?.DEV ? "" : "https://api.myclasson.com/api");
  const url = API_BASE ? new URL(`/api/courses/${courseId}/records/${recordId}/attachments/${fileId}`, API_BASE).toString() : `/api/courses/${courseId}/records/${recordId}/attachments/${fileId}`;
  const token = (await import("../lib/auth")).getToken();
  const res = await fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : undefined, credentials: 'omit' });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  return await res.blob();
}

export async function deleteCourse(id: number): Promise<void> {
  await fetchJSON<void>(`/api/courses/${id}`, { method: 'DELETE' });
}

// Excel helpers (download/upload)
const API_BASE_COURSE = ((import.meta as any).env?.VITE_API_BASE ?? (import.meta as any).env?.VITE_API_BASE_URL) ?? ((import.meta as any).env?.DEV ? "" : "https://api.myclasson.com/api");
function resolveURL(path: string) { return API_BASE_COURSE ? new URL(path, API_BASE_COURSE).toString() : path; }
async function fetchBlob(path: string): Promise<Blob> {
  const url = resolveURL(path);
  const token = (await import("../lib/auth")).getToken();
  const res = await fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : undefined, credentials: 'omit' });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  return await res.blob();
}

export async function downloadCoursesExcel(params?: { status?: Course["status"] | ""; q?: string; }): Promise<Blob> {
  const sp = new URLSearchParams();
  if (params?.status) sp.set('status', params.status);
  if (params?.q && params.q.trim()) sp.set('q', params.q.trim());
  const q = Array.from(sp.keys()).length ? `?${sp}` : '';
  return await fetchBlob(`/api/courses/export${q}`);
}

export async function downloadCourseRecordsExcel(courseId: number, params?: { from?: string; to?: string; }): Promise<Blob> {
  const sp = new URLSearchParams();
  if (params?.from) sp.set('from', params.from);
  if (params?.to) sp.set('to', params.to);
  const q = Array.from(sp.keys()).length ? `?${sp}` : '';
  return await fetchBlob(`/api/courses/${courseId}/records/export${q}`);
}

export async function downloadCoursesTemplate(): Promise<Blob> {
  return await fetchBlob(`/api/courses/template`);
}

export async function importCoursesExcel(file: File): Promise<{ created: number; updated: number; skipped: number; errors: string[] }>{
  const url = resolveURL(`/api/courses/import`);
  const token = (await import("../lib/auth")).getToken();
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(url, { method: 'POST', body: form, headers: token ? { Authorization: `Bearer ${token}` } : undefined });
  const text = await res.text().catch(() => '');
  if (!res.ok) throw new Error(text || `HTTP ${res.status} ${res.statusText}`);
  return text ? JSON.parse(text) : { created:0, updated:0, skipped:0, errors:[] };
}
