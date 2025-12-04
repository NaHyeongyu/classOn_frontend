import { fetchJSON } from "@/lib/fetcher";

export type MaterialItem = {
  id: number;
  filename: string;
  contentType?: string | null;
  size: number;
  createdAt: string;
  courseId?: number | null;
  courseTitle?: string | null;
  recordId?: number | null;
  recordDate?: string | null;
  downloadUrl?: string | null;
};

export async function listMaterials(params?: { courseId?: number; presign?: boolean }): Promise<MaterialItem[]> {
  const sp = new URLSearchParams();
  if (params?.courseId) sp.set("courseId", String(params.courseId));
  if (params?.presign !== undefined) sp.set("presign", params.presign ? "true" : "false");
  const qs = sp.toString();
  const url = qs ? `/api/materials?${qs}` : "/api/materials";
  return await fetchJSON<MaterialItem[]>(url);
}
