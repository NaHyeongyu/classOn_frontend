// EN: Students API client
// KO: 원생 API 클라이언트

import { fetchJSON } from "../lib/fetcher";
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
  courses: { id: number; code: string; title: string; status: string }[];
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
  if (typeof params?.page === "number") sp.set("page", String(params.page));
  if (typeof params?.size === "number") sp.set("size", String(params.size));
  const q = Array.from(sp.keys()).length ? `?${sp}` : "";
  return await fetchJSON<PageResult<Student>>(`/api/students${q}`);
}

export async function getStudent(id: number): Promise<Student> {
  return await fetchJSON<Student>(`/api/students/${id}`);
}

export async function getStudentAttendance(id: number, params?: { from?: string; to?: string; page?: number; size?: number; }): Promise<StudentAttendance[]> {
  const sp = new URLSearchParams();
  if (params?.from) sp.set('from', params.from);
  if (params?.to) sp.set('to', params.to);
  if (typeof params?.page === 'number') sp.set('page', String(params.page));
  if (typeof params?.size === 'number') sp.set('size', String(params.size));
  const q = Array.from(sp.keys()).length ? `?${sp}` : '';
  return await fetchJSON<StudentAttendance[]>(`/api/students/${id}/attendance${q}`);
}

export async function createStudent(payload: StudentPayload): Promise<Student> {
  return await fetchJSON<Student>(`/api/students`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateStudent(id: number, payload: Partial<StudentPayload>): Promise<Student> {
  return await fetchJSON<Student>(`/api/students/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
