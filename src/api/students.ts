// EN: Students API client
// KO: 원생 API 클라이언트

import { fetchJSON, getCanaryHeaders, invalidateCacheByPrefix, resolveApiUrl } from "../lib/fetcher";
import type { PageResult } from "../types/paging";
import type {
  Student,
  StudentAttendance,
  StudentStatus,
  PaymentDetail,
  PaymentHistoryRow,
} from "@classon/shared-types";

export type { Student, StudentAttendance } from "@classon/shared-types";

export type StudentPayload = {
  name: string;
  age?: number;
  phoneNumber?: string;
  guardianPhone?: string;
  status?: StudentStatus;
  joinedDate?: string; // YYYY-MM-DD
  birthDate?: string; // YYYY-MM-DD
  address?: string;
  guardianName?: string;
  courseIds?: number[];
};

// Re-export for existing imports from this module
export type { PageResult } from "../types/paging";

export async function listStudents(params?: {
  status?: StudentStatus;
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
  try {
    window.dispatchEvent(new CustomEvent('calendar:classes-refresh', { detail: {} }));
  } catch {
    /* ignore cross-context dispatch errors */
  }
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
  try {
    window.dispatchEvent(new CustomEvent('calendar:classes-refresh', { detail: {} }));
  } catch {
    /* ignore cross-context dispatch errors */
  }
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
  try {
    window.dispatchEvent(new CustomEvent('calendar:classes-refresh', { detail: {} }));
  } catch {
    /* ignore cross-context dispatch errors */
  }
}

export type StudentPaymentInfo = {
  invoice: PaymentDetail | null;
  history: PaymentHistoryRow[];
};

export async function getStudentPaymentInfo(id: number): Promise<StudentPaymentInfo> {
  return await fetchJSON<StudentPaymentInfo>(`/api/students/${id}/payments`);
}

export type StudentReport = {
  id: number;
  filename: string;
  contentType: string | null;
  size: number;
  periodFrom?: string | null;
  periodTo?: string | null;
  createdAt: string;
  courseId?: number | null;
  courseTitle?: string | null;
  url?: string | null;
};

export async function listStudentReports(studentId: number, opts?: { presign?: boolean }): Promise<StudentReport[]> {
  const sp = new URLSearchParams();
  if (opts?.presign) sp.set("presign", "true");
  const q = Array.from(sp.keys()).length ? `?${sp.toString()}` : "";
  return await fetchJSON<StudentReport[]>(`/api/students/${studentId}/reports${q}`);
}

export async function downloadStudentReportBlob(studentId: number, reportId: number): Promise<Blob> {
  const url = resolveApiUrl(`/api/students/${studentId}/reports/${reportId}/file`);
  const token = (await import("../lib/auth")).getToken();
  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...getCanaryHeaders(),
  };
  const res = await fetch(url, {
    headers: Object.keys(headers).length ? headers : undefined,
    credentials: "omit",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  return await res.blob();
}

export async function deleteStudentReport(studentId: number, reportId: number): Promise<void> {
  await fetchJSON<void>(`/api/students/${studentId}/reports/${reportId}`, { method: "DELETE" });
}

export type StudentReportNotifyResult = {
  alertId: number;
  status: "PENDING" | "SENT" | "FAILED";
  message?: string | null;
  templateCode?: string | null;
  url?: string | null;
  sentAt?: string | null;
};

export async function sendStudentReportAlert(
  studentId: number,
  reportId: number,
  expireSec?: number,
): Promise<StudentReportNotifyResult> {
  const sp = new URLSearchParams();
  if (expireSec) sp.set("expireSec", String(expireSec));
  const q = Array.from(sp.keys()).length ? `?${sp.toString()}` : "";
  return await fetchJSON<StudentReportNotifyResult>(
    `/api/students/${studentId}/reports/${reportId}/notify${q}`,
    { method: "POST" },
  );
}

export async function renderStudentReport(
  studentId: number,
  payload: {
    html: string;
    filename?: string;
    format?: "pdf" | "png";
    width?: number;
    height?: number;
    courseId?: number | null;
    periodFrom?: string | null;
    periodTo?: string | null;
  },
): Promise<StudentReport> {
  const body = JSON.stringify(payload);
  return await fetchJSON<StudentReport>(`/api/students/${studentId}/reports/render`, {
    method: "POST",
    body,
  });
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
  const url = resolveApiUrl(`/api/students/import`);
  const token = (await import("../lib/auth")).getToken();
  const form = new FormData();
  form.append('file', file);
  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...getCanaryHeaders(),
  };
  const res = await fetch(url, {
    method: 'POST',
    body: form,
    headers: Object.keys(headers).length ? headers : undefined,
  });
  const text = await res.text().catch(() => '');
  if (!res.ok) throw new Error(text || `HTTP ${res.status} ${res.statusText}`);
  return text ? JSON.parse(text) : { created:0, updated:0, skipped:0, errors:[] };
}

export async function previewImportStudentsExcel(file: File): Promise<{
  created: number;
  updated: number;
  skipped: number;
  errors: string[];
  rows: unknown[];
}> {
  const url = resolveApiUrl(`/api/students/import/preview`);
  const token = (await import("../lib/auth")).getToken();
  const form = new FormData();
  form.append('file', file);
  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...getCanaryHeaders(),
  };
  const res = await fetch(url, {
    method: 'POST',
    body: form,
    headers: Object.keys(headers).length ? headers : undefined,
  });
  const text = await res.text().catch(() => '');
  if (!res.ok) throw new Error(text || `HTTP ${res.status} ${res.statusText}`);
  return text ? JSON.parse(text) : { created:0, updated:0, skipped:0, errors:[], rows: [] };
}

export async function bulkUpdateStudentCourses(args: {
  studentIds?: number[];
  selectAll?: boolean;
  filters?: { status?: 'ENROLLED'|'ON_LEAVE'|'PENDING'; q?: string; from?: string; to?: string; ageMin?: number; ageMax?: number };
  courseIds: number[];
  mode?: 'append'|'replace'|'remove';
}): Promise<{ updated: number; errors: string[] }> {
  const body: Record<string, unknown> = {
    studentIds: args.studentIds ?? [],
    selectAll: Boolean(args.selectAll),
    courseIds: args.courseIds,
    mode: args.mode ?? 'append',
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
