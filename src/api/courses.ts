import { fetchJSON, getCanaryHeaders, invalidateCacheByPrefix, resolveApiUrl } from "../lib/fetcher";
import { dispatchTeacherRefresh } from "./teachers";
import type { Student } from "./students";
import type { PageResult } from "../types/paging";
import type { Attendance, Course, CourseRecord } from "@classon/shared-types";
export type { Course, CourseRecord, Attendance } from "@classon/shared-types";

type CoursePayload = Partial<Course> & { instructorIds?: number[] | null };

const normalizeInstructorIds = (value?: number[] | null): number[] | undefined => {
  if (!Array.isArray(value)) return undefined;
  return value.filter((id): id is number => typeof id === "number");
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

export async function createCourse(payload: CoursePayload): Promise<Course> {
  const instructorIds = normalizeInstructorIds(payload.instructorIds);
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
    instructorId: payload.instructorId,
    instructorIds,
    primaryStudentId: payload.primaryStudentId,
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
      '/api/dashboard/summary',
    ]);
  } catch {
    /* ignore cache invalidation failures */
  }
  if (typeof payload.instructorId === "number") {
    dispatchTeacherRefresh({ reason: "course-create", teacherId: payload.instructorId, courseId: res?.id });
  }
  try {
    window.dispatchEvent(new CustomEvent('courses:refresh', { detail: { reason: 'create', id: res.id } }));
  } catch {
    /* ignore cross-context dispatch errors */
  }
  return res;
}

export async function updateCourse(id: number, payload: CoursePayload): Promise<Course> {
  const instructorIds = normalizeInstructorIds(payload.instructorIds);
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
    instructorId: payload.instructorId,
    instructorIds,
    primaryStudentId: payload.primaryStudentId,
  });
  const res = await fetchJSON<Course>(`/api/courses/${id}`, { method: "PUT", body });
  try {
    invalidateCacheByPrefix([
      '/api/courses',
      `/api/courses/${id}`,
      `/api/courses/${id}/records`,
      '/api/students',
      '/api/payments/templates',
      '/api/calendar/classes',
      '/api/calendar/classes-range',
      '/api/dashboard/summary',
    ]);
  } catch {
    /* ignore cache invalidation failures */
  }
  if (typeof payload.instructorId === "number") {
    dispatchTeacherRefresh({ reason: "course-update", teacherId: payload.instructorId, courseId: id });
  }
  try {
    window.dispatchEvent(new CustomEvent('courses:refresh', { detail: { reason: 'update', id } }));
  } catch {
    /* ignore cross-context dispatch errors */
  }
  return res;
}

export async function updateCourseInstructor(id: number, instructorId: number | null): Promise<Course> {
  const body = JSON.stringify({ instructorId });
  const res = await fetchJSON<Course>(`/api/courses/${id}/instructor`, { method: "PUT", body });
  try {
    invalidateCacheByPrefix([
      '/api/courses',
      `/api/courses/${id}`,
      `/api/courses/${id}/records`,
      '/api/students',
      '/api/payments/templates',
      '/api/calendar/classes',
      '/api/calendar/classes-range',
      '/api/dashboard/summary',
    ]);
  } catch {
    /* ignore cache invalidation failures */
  }
  dispatchTeacherRefresh({ reason: "course-instructor-update", teacherId: instructorId, courseId: id });
  try {
    window.dispatchEvent(new CustomEvent('courses:refresh', { detail: { reason: 'update-instructor', id } }));
  } catch {
    /* ignore cross-context dispatch errors */
  }
  return res;
}

export async function listCourseStudents(id: number): Promise<Student[]> {
  return await fetchJSON<Student[]>(`/api/courses/${id}/students`);
}

export async function listCourseRecords(
  id: number,
  params?: { ym?: string; from?: string; to?: string; page?: number; size?: number },
): Promise<CourseRecord[]> {
  const sp = new URLSearchParams();
  if (params?.ym) sp.set("ym", params.ym);
  if (params?.from) sp.set("from", params.from);
  if (params?.to) sp.set("to", params.to);
  if (typeof params?.page === 'number') sp.set('page', String(params.page));
  if (typeof params?.size === 'number') sp.set('size', String(params.size));
  const q = Array.from(sp.keys()).length ? `?${sp}` : "";
  return await fetchJSON<CourseRecord[]>(`/api/courses/${id}/records${q}`);
}

export async function updateCourseRecord(
  courseId: number,
  recordId: number,
  payload: Partial<Pick<CourseRecord, 'recordDate'|'startTime'|'endTime'|'topic'|'notes'|'content'|'performanceScore'|'performanceNote'>>
): Promise<CourseRecord> {
  const body = JSON.stringify(payload);
  const res = await fetchJSON<CourseRecord>(`/api/courses/${courseId}/records/${recordId}`, { method: 'PUT', body });
  try {
    invalidateCacheByPrefix([
      `/api/courses/${courseId}/records`,
      `/api/courses/${courseId}`,
      '/api/calendar/classes',
      '/api/calendar/classes-range',
    ]);
  } catch {
    /* ignore cache invalidation failures */
  }
  try {
    window.dispatchEvent(new CustomEvent('course-record:updated', { detail: { courseId, record: res } }));
  } catch {
    /* ignore cross-context dispatch errors */
  }
  return res;
}

export async function deleteCourseRecord(courseId: number, recordId: number): Promise<void> {
  await fetchJSON<void>(`/api/courses/${courseId}/records/${recordId}`, { method: 'DELETE' });
  try {
    invalidateCacheByPrefix([
      `/api/courses/${courseId}/records`,
      `/api/courses/${courseId}`,
      '/api/calendar/classes',
      '/api/calendar/classes-range',
    ]);
  } catch {
    /* ignore cache invalidation failures */
  }
  try {
    window.dispatchEvent(new CustomEvent('course-record:deleted', { detail: { courseId, recordId } }));
  } catch {
    /* ignore cross-context dispatch errors */
  }
}

export async function createCourseRecord(
  courseId: number,
  payload: { recordDate: string; startTime?: string; endTime?: string; topic?: string; notes?: string; content?: string; performanceScore?: number | null; performanceNote?: string | null; }
): Promise<CourseRecord> {
  const body = JSON.stringify(payload);
  const res = await fetchJSON<CourseRecord>(`/api/courses/${courseId}/records`, { method: 'POST', body });
  try {
    invalidateCacheByPrefix([
      `/api/courses/${courseId}/records`,
      `/api/courses/${courseId}`,
      '/api/calendar/classes',
      '/api/calendar/classes-range',
    ]);
  } catch {
    /* ignore cache invalidation failures */
  }
  try {
    window.dispatchEvent(new CustomEvent('course-record:created', { detail: { courseId, record: res } }));
  } catch {
    /* ignore cross-context dispatch errors */
  }
  return res;
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
  const url = resolveApiUrl(`/api/courses/${courseId}/records/${recordId}/attachments/${fileId}`);
  const token = (await import("../lib/auth")).getToken();
  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...getCanaryHeaders(),
  };
  const res = await fetch(url, {
    headers: Object.keys(headers).length ? headers : undefined,
    credentials: 'omit',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  return await res.blob();
}

export async function deleteCourse(id: number): Promise<void> {
  await fetchJSON<void>(`/api/courses/${id}`, { method: 'DELETE' });
  try {
    invalidateCacheByPrefix([
      '/api/courses',
      `/api/courses/${id}`,
      `/api/courses/${id}/records`,
      '/api/calendar/classes',
      '/api/calendar/classes-range',
      '/api/dashboard/summary',
    ]);
  } catch {
    /* ignore cache invalidation failures */
  }
  dispatchTeacherRefresh({ reason: "course-delete", courseId: id });
  try {
    window.dispatchEvent(new CustomEvent('courses:refresh', { detail: { reason: 'delete', id } }));
  } catch {
    /* ignore cross-context dispatch errors */
  }
}

// Excel helpers (download/upload)
async function fetchBlob(path: string): Promise<Blob> {
  const url = resolveApiUrl(path);
  const token = (await import("../lib/auth")).getToken();
  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...getCanaryHeaders(),
  };
  const res = await fetch(url, {
    headers: Object.keys(headers).length ? headers : undefined,
    credentials: 'omit',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  return await res.blob();
}

export async function downloadCourseRecordsExcel(courseId: number, params?: { from?: string; to?: string; }): Promise<Blob> {
  const sp = new URLSearchParams();
  if (params?.from) sp.set('from', params.from);
  if (params?.to) sp.set('to', params.to);
  const q = Array.from(sp.keys()).length ? `?${sp}` : '';
  return await fetchBlob(`/api/courses/${courseId}/records/export${q}`);
}
