import { fetchJSON } from "../lib/fetcher";

export type ProgressCounts = {
  photos_done?: number;
  faces_done?: number;
  faces_total_est?: number;
};

export async function uploadPhotosChunk(files: File[], opts?: { jobId?: string; final?: boolean }): Promise<{ job_id: string; started?: boolean }>{
  const fd = new FormData();
  files.forEach((f) => fd.append("files", f, f.name));
  if (opts?.jobId) fd.append("job_id", opts.jobId);
  if (opts?.final) fd.append("final", "1");
  return await fetchJSON("/api/upload", { method: "POST", body: fd as any });
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
