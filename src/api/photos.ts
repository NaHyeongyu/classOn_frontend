import { fetchJSON } from "../lib/fetcher";

export type ProgressCounts = {
  photos_done?: number;
  faces_done?: number;
  faces_total_est?: number;
};

export async function uploadPhotos(files: File[]): Promise<{ job_id: string }> {
  const fd = new FormData();
  files.forEach((f) => fd.append("files", f, f.name));
  // fetchJSON preserves FormData (no JSON content-type)
  return await fetchJSON<{ job_id: string }>("/api/upload", { method: "POST", body: fd as any });
}

export async function getProgress(jobId: string): Promise<{ phase: string; progress: number; counts?: ProgressCounts }>{
  return await fetchJSON(`/api/progress?job_id=${encodeURIComponent(jobId)}`);
}

export type ResultOriginal = { photo: string; thumb?: string };
export type ResultCluster = { cluster_id: number; name: string; originals: ResultOriginal[] };

export async function getResult(jobId: string): Promise<{
  meta: { total_photos: number; total_faces: number };
  clusters: ResultCluster[];
  unassigned: ResultOriginal[];
}> {
  return await fetchJSON(`/api/result?job_id=${encodeURIComponent(jobId)}`);
}

