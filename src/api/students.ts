// EN: Students API client
// KO: 원생 API 클라이언트

import { fetchJSON, invalidateCacheByPrefix } from "../lib/fetcher";
import type { PageResult } from "../types/paging";

export type Student = {
  id: number;
  code: string;
  name: string;
  age?: number;
  phoneNumber?: string;
  guardianPhone?: string;
  status: "ENROLLED" | "ON_LEAVE" | "PENDING";
  joinedDate?: string; // YYYY-MM-DD
  birthDate?: string; // YYYY-MM-DD
  address?: string;
  parentName?: string;
  createdAt: string;
  courses: { id: number; code: string; title: string; status: string; fee?: number | null }[];
};

export type StudentAttendance = {
  date: string; // YYYY-MM-DD
  courseId: number;
  courseTitle: string;
  present: boolean;
  reason?: string;
  recordId: number;
  startTime?: string | null; // HH:mm:ss
  endTime?: string | null;   // HH:mm:ss
};

export type StudentPayload = {
  name: string;
  age?: number;
  phoneNumber?: string;
  guardianPhone?: string;
  status?: "ENROLLED" | "ON_LEAVE" | "PENDING";
  joinedDate?: string; // YYYY-MM-DD
  birthDate?: string; // YYYY-MM-DD
  address?: string;
  parentName?: string;
  courseIds?: number[];
};

// Re-export for existing imports from this module
export type { PageResult } from "../types/paging";

export async function listStudents(params?: {
  status?: "ENROLLED" | "ON_LEAVE" | "PENDING";
  page?: number;
  size?: number;
  q?: string;
  from?: string; // YYYY-MM-DD
  to?: string;   // YYYY-MM-DD
  ageMin?: number;
  ageMax?: number;
  s?: 'name' | 'status' | 'joinedDate' | 'birthDate' | 'code' | 'createdAt';
  dir?: 'ASC' | 'DESC';
}): Promise<PageResult<Student>> {
  const sp = new URLSearchParams();
  if (params?.status) sp.set("status", params.status);
  if (params?.q) {
    const qv = params.q.trim();
    if (qv) sp.set("q", qv);
  }
  if (params?.from) sp.set("from", params.from);
  if (params?.to) sp.set("to", params.to);
  if (typeof params?.ageMin === "number") sp.set("ageMin", String(params.ageMin));
  if (typeof params?.ageMax === "number") sp.set("ageMax", String(params.ageMax));
  if (params?.s) sp.set('s', params.s);
  if (params?.dir) sp.set('dir', params.dir);
  if (typeof params?.page === "number") sp.set("page", String(params.page));
  if (typeof params?.size === "number") sp.set("size", String(params.size));
  const q = Array.from(sp.keys()).length ? `?${sp}` : "";
  return await fetchJSON<PageResult<Student>>(`/api/students${q}`);
}

export async function getStudent(id: number): Promise<Student> {
  return await fetchJSON<Student>(`/api/students/${id}`);
}

export async function getStudentAttendance(id: number, params?: { from?: string; to?: string; page?: number; size?: number; }): Promise<PageResult<StudentAttendance>> {
  const sp = new URLSearchParams();
  if (params?.from) sp.set('from', params.from);
  if (params?.to) sp.set('to', params.to);
  if (typeof params?.page === 'number') sp.set('page', String(params.page));
  if (typeof params?.size === 'number') sp.set('size', String(params.size));
  const q = Array.from(sp.keys()).length ? `?${sp}` : '';
  return await fetchJSON<PageResult<StudentAttendance>>(`/api/students/${id}/attendance${q}`);
}

export async function createStudent(payload: StudentPayload): Promise<Student> {
  const res = await fetchJSON<Student>(`/api/students`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  // Bust caches so lists/KPIs reflect immediately
  invalidateCacheByPrefix([
    '/api/students',
    '/api/calendar/classes',
    '/api/calendar/classes-range',
    '/api/dashboard/summary',
  ]);
  try { window.dispatchEvent(new CustomEvent('calendar:classes-refresh', { detail: {} })); } catch {}
  return res;
}

export async function updateStudent(id: number, payload: Partial<StudentPayload>): Promise<Student> {
  const res = await fetchJSON<Student>(`/api/students/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  // Invalidate student lists + calendar and dashboard summaries
  invalidateCacheByPrefix([
    '/api/students',
    '/api/calendar/classes',
    '/api/calendar/classes-range',
    '/api/dashboard/summary',
  ]);
  try { window.dispatchEvent(new CustomEvent('calendar:classes-refresh', { detail: {} })); } catch {}
  return res;
}

export async function deleteStudent(id: number): Promise<void> {
  await fetchJSON<void>(`/api/students/${id}`, { method: 'DELETE' });
  // When a student is deleted, attendance rows and enrollments change.
  // Invalidate caches for students, calendar class lists/ranges and dashboard summary.
  invalidateCacheByPrefix([
    '/api/students',
    '/api/calendar/classes',
    '/api/calendar/classes-range',
    '/api/dashboard/summary',
  ]);
  try { window.dispatchEvent(new CustomEvent('calendar:classes-refresh', { detail: {} })); } catch {}
}

// Excel helpers (download/upload)
const API_BASE_STU = ((import.meta as any).env?.VITE_API_BASE ?? (import.meta as any).env?.VITE_API_BASE_URL) ?? ((import.meta as any).env?.DEV ? "" : "https://api.myclasson.com/api");
function resolveURL(path: string) { return API_BASE_STU ? new URL(path, API_BASE_STU).toString() : path; }
async function fetchBlob(path: string): Promise<Blob> {
  const url = resolveURL(path);
  const token = (await import("../lib/auth")).getToken();
  const res = await fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : undefined, credentials: 'omit' });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  return await res.blob();
}

export async function downloadStudentsExcel(params?: {
  ids?: number[];
  status?: "ENROLLED" | "ON_LEAVE" | "PENDING";
  q?: string; from?: string; to?: string; ageMin?: number; ageMax?: number;
}): Promise<Blob> {
  const sp = new URLSearchParams();
  if (params?.ids && params.ids.length) sp.set('ids', params.ids.join(','));
  if (params?.status) sp.set('status', params.status);
  if (params?.q && params.q.trim()) sp.set('q', params.q.trim());
  if (params?.from) sp.set('from', params.from);
  if (params?.to)   sp.set('to', params.to);
  if (typeof params?.ageMin === 'number') sp.set('ageMin', String(params.ageMin));
  if (typeof params?.ageMax === 'number') sp.set('ageMax', String(params.ageMax));
  const q = Array.from(sp.keys()).length ? `?${sp}` : '';
  return await fetchBlob(`/api/students/export${q}`);
}

export async function downloadStudentsTemplate(): Promise<Blob> {
  return await fetchBlob(`/api/students/template`);
}

export async function importStudentsExcel(file: File): Promise<{ created: number; updated: number; skipped: number; errors: string[] }>{
  const url = resolveURL(`/api/students/import`);
  const token = (await import("../lib/auth")).getToken();
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(url, { method: 'POST', body: form, headers: token ? { Authorization: `Bearer ${token}` } : undefined });
  const text = await res.text().catch(() => '');
  if (!res.ok) throw new Error(text || `HTTP ${res.status} ${res.statusText}`);
  return text ? JSON.parse(text) : { created:0, updated:0, skipped:0, errors:[] };
}

export async function bulkUpdateStudentCourses(args: {
  studentIds?: number[];
  selectAll?: boolean;
  filters?: { status?: 'ENROLLED'|'ON_LEAVE'|'PENDING'; q?: string; from?: string; to?: string; ageMin?: number; ageMax?: number };
  courseIds: number[];
  mode?: 'append'|'replace'|'remove';
}): Promise<{ updated: number; errors: string[] }> {
  const body: any = {
    studentIds: args.studentIds ?? [],
    selectAll: !!args.selectAll,
    courseIds: args.courseIds,
    mode: args.mode || 'append',
  };
  if (args.selectAll && args.filters) {
    if (args.filters.status) body.status = args.filters.status;
    if (args.filters.q && args.filters.q.trim()) body.q = args.filters.q.trim();
    if (args.filters.from) body.from = args.filters.from;
    if (args.filters.to) body.to = args.filters.to;
    if (typeof args.filters.ageMin === 'number') body.ageMin = args.filters.ageMin;
    if (typeof args.filters.ageMax === 'number') body.ageMax = args.filters.ageMax;
  }
  return await fetchJSON<{ updated: number; errors: string[] }>(`/api/students/bulk/courses`, {
    method: 'POST',
    body: JSON.stringify(body)
  });
}
