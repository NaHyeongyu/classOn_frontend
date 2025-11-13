import type { AuthUser } from "@/lib/auth";

export type MinimalTeacher = { name?: string | null; username?: string | null };

export function isMainAccountForTeacher(
  user: AuthUser | null,
  teacher: MinimalTeacher | null | undefined,
  representativeName?: string | null,
): boolean {
  if (!teacher) return false;
  const tName = (teacher.name || "").trim();
  const tUsername = (teacher.username || "").toLowerCase();
  const rep = (representativeName || "").trim();
  if (rep && tName === rep) return true;
  if (!user) return false;
  const uName = (user.name || "").trim();
  const uUsername = (user.username || "").toLowerCase();
  return (!!uUsername && tUsername === uUsername) || (!!uName && tName === uName);
}

