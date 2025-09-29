import { fetchJSON } from '@/lib/fetcher';
import type { PageResult } from '@/types/paging';

export type SavedPost = {
  id: number;
  platform: 'INSTAGRAM'|'NAVER_BLOG'|'KAKAO_CHANNEL';
  speechStyle?: 'SEUMNIDA'|'YO';
  tone?: string | null;
  title?: string | null;
  body: string;
  tags: string[];
  createdAt?: string | null;
};

export async function listSaved(params?: { page?: number; size?: number; platform?: SavedPost['platform']; from?: string; to?: string; q?: string; }): Promise<PageResult<SavedPost>> {
  const sp = new URLSearchParams();
  if (typeof params?.page === 'number') sp.set('page', String(params.page));
  if (typeof params?.size === 'number') sp.set('size', String(params.size));
  if (params?.platform) sp.set('platform', params.platform);
  if (params?.from) sp.set('from', params.from);
  if (params?.to) sp.set('to', params.to);
  if (params?.q && params.q.trim()) sp.set('q', params.q.trim());
  const q = Array.from(sp.keys()).length ? `?${sp}` : '';
  return await fetchJSON<PageResult<SavedPost>>(`/api/marketing/posts${q}`);
}

export async function getSaved(id: number): Promise<SavedPost> {
  return await fetchJSON<SavedPost>(`/api/marketing/posts/${id}`);
}

export async function createSaved(payload: { platform: SavedPost['platform']; speechStyle?: SavedPost['speechStyle']; tone?: string | null; title?: string | null; body: string; tags?: string[] }) {
  return await fetchJSON<SavedPost>("/api/marketing/posts", { method: 'POST', body: JSON.stringify(payload) });
}

export async function deleteSaved(id: number) {
  await fetchJSON<{ success: boolean }>(`/api/marketing/posts/${id}`, { method: 'DELETE' });
}
