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
  phone?: string | null;
  phoneVerified?: boolean;
  courseCount: number;
  createdAt?: string;
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
  phone?: string | null;
  phoneVerified?: boolean;
  courses: TeacherCourseBrief[];
};

export type TeacherDetail = {
  id: number;
  name: string;
  username: string;
  phone?: string | null;
  phoneVerified: boolean;
  courses: TeacherCourseBrief[];
};

export type InstructorCourseCount = {
  instructorId: number;
  courseCount: number;
};

export type TeacherProfileUpdatePayload = {
  name?: string;
  phone?: string;
};

export type ChangeTeacherPasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

export type CreateTeacherPayload = {
  username: string;
  name: string;
  phone: string;
  password: string;
};

export type UsernameAvailability = { available: boolean };
export type PasswordCheck = { valid: boolean; code?: string; message?: string };

export async function listTeachers(): Promise<TeacherListItem[]> {
  return await fetchJSON<TeacherListItem[]>("/api/academy/teachers");
}

export async function getInstructorCourseCounts(ids: number[]): Promise<InstructorCourseCount[]> {
  if (!ids.length) return [];
  const sp = new URLSearchParams();
  sp.set("ids", ids.join(","));
  return await fetchJSON<InstructorCourseCount[]>(`/api/academy/teachers/course-counts?${sp.toString()}`);
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

export async function createTeacher(payload: CreateTeacherPayload): Promise<TeacherDetail> {
  const teacher = await fetchJSON<TeacherDetail>("/api/academy/teachers", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  emitTeacherRefresh({ reason: "create", teacherId: teacher?.id });
  return teacher;
}

export async function getTeacherDetail(id: number | string): Promise<TeacherDetail> {
  return await fetchJSON<TeacherDetail>(`/api/academy/teachers/${id}`);
}

// updateTeacherMenus removed: teacher menus are fixed to default set on backend

export async function deleteTeacher(id: number | string): Promise<void> {
  await fetchJSON(`/api/academy/teachers/${id}`, { method: "DELETE" });
  emitTeacherRefresh({ reason: "delete", teacherId: typeof id === "number" ? id : Number(id) });
}

export async function checkTeacherUsername(username: string): Promise<UsernameAvailability> {
  const sp = new URLSearchParams();
  sp.set("username", username);
  // Reuse existing auth endpoint which returns OperationResponse { success }
  const res = await fetchJSON<{ success: boolean; code?: string; message?: string }>(`/api/auth/check-username?${sp.toString()}`);
  return { available: !!res?.success };
}

export async function checkPasswordStrength(password: string): Promise<PasswordCheck> {
  const res = await fetchJSON<{ success: boolean; code?: string; message?: string }>(`/api/auth/check-password`, {
    method: "POST",
    body: JSON.stringify({ password }),
  });
  return { valid: !!res?.success, code: res?.code, message: res?.message };
}

export async function resetTeacherPassword(id: number | string, newPassword: string): Promise<void> {
  await fetchJSON<{ success?: boolean }>(`/api/academy/teachers/${id}/password`, {
    method: "PUT",
    body: JSON.stringify({ newPassword }),
  });
}
