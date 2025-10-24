import { fetchJSON } from "../lib/fetcher";

export type SeedDemoResponse = {
  studentsCreated?: number;
  coursesCreated?: number;
  counselsCreated?: number;
};

export async function seedDemo(params?: {
  students?: number;
  courses?: number;
  counsels?: number;
}): Promise<SeedDemoResponse> {
  const s = params?.students ?? 100;
  const c = params?.courses ?? 10;
  const k = params?.counsels ?? 50;
  const sp = new URLSearchParams({
    students: String(s),
    courses: String(c),
    counsels: String(k),
  });
  return await fetchJSON<SeedDemoResponse>(`/api/dev/seed?${sp}`, {
    method: "POST",
  });
}
