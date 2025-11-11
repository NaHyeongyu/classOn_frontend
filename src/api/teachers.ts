import { fetchJSON, invalidateCacheByPrefix } from "@/lib/fetcher";

const TEACHER_CACHE_PREFIX = "/api/academy/teachers";

export type TeacherRefreshDetail = {
  reason: string;
  teacherId?: number;
  courseId?: number;
};

function emitTeacherRefresh(detail: TeacherRefreshDetail) {
  try {
    invalidateCacheByPrefix(TEACHER_CACHE_PREFIX);
  } catch {
    /* ignore cache eviction errors */
  }
  if (typeof window === "undefined") return;
  try {
    window.dispatchEvent(new CustomEvent("teachers:refresh", { detail }));
  } catch {
    /* ignore cross-context dispatch errors */
  }
}

export function dispatchTeacherRefresh(detail: TeacherRefreshDetail) {
  emitTeacherRefresh(detail);
}

export type TeacherListItem = {
  id: number;
  name: string;
  username: string;
  email?: string | null;
  phone?: string | null;
  phoneVerified?: boolean;
  courseCount: number;
};

export type TeacherCourseBrief = {
  id: number;
  title: string;
  status?: string | null;
  courseType?: string | null;
  courseTime?: string | null;
  recurrenceDays?: string | readonly string[] | null;
  recurring?: boolean | null;
  startTime?: string | null;
  endTime?: string | null;
};

export type TeacherProfile = {
  id: number;
  name: string;
  username: string;
  email?: string | null;
  phone?: string | null;
  phoneVerified?: boolean;
  courses: TeacherCourseBrief[];
};

export type TeacherDetail = {
  id: number;
  name: string;
  username: string;
  email?: string | null;
  phone?: string | null;
  phoneVerified: boolean;
  menus: string[];
  courses: TeacherCourseBrief[];
};

export type TeacherProfileUpdatePayload = {
  name?: string;
  email?: string;
  phone?: string;
};

export type ChangeTeacherPasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

export type CreateTeacherPayload = {
  username: string;
  name: string;
  email?: string;
  phone: string;
  password: string;
  menus?: string[];
};

export async function listTeachers(): Promise<TeacherListItem[]> {
  return await fetchJSON<TeacherListItem[]>("/api/academy/teachers");
}

export async function getMyTeacherProfile(): Promise<TeacherProfile> {
  return await fetchJSON<TeacherProfile>("/api/teachers/me");
}

export async function updateMyTeacherProfile(
  payload: TeacherProfileUpdatePayload,
): Promise<TeacherProfile> {
  return await fetchJSON<TeacherProfile>("/api/teachers/me", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function changeMyTeacherPassword(payload: ChangeTeacherPasswordPayload): Promise<void> {
  await fetchJSON<{ success?: boolean }>("/api/teachers/me/password", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function createTeacher(payload: CreateTeacherPayload): Promise<TeacherListItem> {
  const teacher = await fetchJSON<TeacherListItem>("/api/academy/teachers", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  emitTeacherRefresh({ reason: "create", teacherId: teacher?.id });
  return teacher;
}

export async function getTeacherDetail(id: number | string): Promise<TeacherDetail> {
  return await fetchJSON<TeacherDetail>(`/api/academy/teachers/${id}`);
}

export async function updateTeacherMenus(
  id: number | string,
  payload: { menus: string[] },
): Promise<TeacherDetail> {
  const detail = await fetchJSON<TeacherDetail>(`/api/academy/teachers/${id}/menus`, {
    method: "PUT",
    body: JSON.stringify({ menus: Array.isArray(payload.menus) ? payload.menus : [] }),
  });
  emitTeacherRefresh({ reason: "update-menus", teacherId: typeof id === "number" ? id : Number(id) });
  return detail;
}

export async function deleteTeacher(id: number | string): Promise<void> {
  await fetchJSON(`/api/academy/teachers/${id}`, { method: "DELETE" });
  emitTeacherRefresh({ reason: "delete", teacherId: typeof id === "number" ? id : Number(id) });
}
