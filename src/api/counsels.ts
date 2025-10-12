import { fetchJSON, invalidateCacheByPrefix } from "../lib/fetcher";
import type { PageResult } from "../types/paging";

export type Counsel = {
  id: number;
  code: string;
  studentId: number;
  studentName: string;
  counselTime: string; // ISO string
  content?: string;
  status?: string; // SCHEDULED | CONVERTED | PENDING | ON_HOLD
  createdAt: string;
};

// Re-export for existing imports from this module
export type { PageResult } from "../types/paging";

export async function listCounsels(params: {
  studentId?: number;
  page?: number;
  size?: number;
  status?: string;
  q?: string;
  from?: string;
  to?: string;
  onYmd?: string;
}, init?: RequestInit): Promise<PageResult<Counsel>> {
  const sp = new URLSearchParams();
  if (params.studentId) sp.set("studentId", String(params.studentId));
  if (typeof params.page === 'number') sp.set("page", String(params.page));
  if (typeof params.size === 'number') sp.set("size", String(params.size));
  if (params.status) sp.set("status", mapStatusParam(params.status));
  if (params.q) sp.set("q", params.q);
  if (params.from) sp.set("from", params.from);
  if (params.to) sp.set("to", params.to);
  if (params.onYmd) sp.set("onYmd", params.onYmd);
  const q = Array.from(sp.keys()).length ? `?${sp}` : '';
  return await fetchJSON<PageResult<Counsel>>(`/api/counsels${q}`, init);
}

function mapStatusParam(s: string) {
  switch (s) {
    case '예정': return 'SCHEDULED';
    case '전환': return 'CONVERTED';
    case '대기': return 'PENDING';
    case '보류': return 'ON_HOLD';
    default: return s; // pass through if already enum
  }
}

export async function createCounsel(payload: { studentId: number; counselTime: string; content?: string; }): Promise<Counsel> {
  const res = await fetchJSON<Counsel>(`/api/counsels`, { method: 'POST', body: JSON.stringify(payload) });
  // Bust list caches so newly created item appears immediately in lists
  invalidateCacheByPrefix('/api/counsels');
  return res;
}

export async function updateCounsel(id: number, payload: { studentId?: number; counselTime?: string; content?: string; status?: string; }): Promise<Counsel> {
  const res = await fetchJSON<Counsel>(`/api/counsels/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
  invalidateCacheByPrefix('/api/counsels');
  return res;
}

export async function getCounsel(id: number): Promise<Counsel> {
  return await fetchJSON<Counsel>(`/api/counsels/${id}`);
}

export async function deleteCounsel(id: number): Promise<void> {
  await fetchJSON<void>(`/api/counsels/${id}`, { method: 'DELETE' });
  invalidateCacheByPrefix('/api/counsels');
}

// Excel export helper
const COUNSEL_API_BASE = import.meta.env.VITE_API_BASE ?? import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.DEV ? "" : "https://api.myclasson.com/api");

function resolveCounselUrl(path: string): string {
  return COUNSEL_API_BASE ? new URL(path, COUNSEL_API_BASE).toString() : path;
}
async function fetchCounselBlob(path: string): Promise<Blob> {
  const url = resolveCounselUrl(path);
  const token = (await import("../lib/auth")).getToken();
  const res = await fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : undefined, credentials: 'omit' });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  return await res.blob();
}

export async function downloadCounselsExcel(params?: {
  studentId?: number;
  status?: string;
  from?: string;
  to?: string;
  onYmd?: string;
  q?: string;
}): Promise<Blob> {
  const sp = new URLSearchParams();
  if (typeof params?.studentId === 'number') sp.set('studentId', String(params.studentId));
  if (params?.status) sp.set('status', params.status);
  if (params?.from) sp.set('from', params.from);
  if (params?.to) sp.set('to', params.to);
  if (params?.onYmd) sp.set('onYmd', params.onYmd);
  if (params?.q && params.q.trim()) sp.set('q', params.q.trim());
  const qstr = Array.from(sp.keys()).length ? `?${sp}` : '';
  return await fetchCounselBlob(`/api/counsels/export${qstr}`);
}
