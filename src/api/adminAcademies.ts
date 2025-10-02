import { fetchJSON } from '@/lib/fetcher';
import { getAdminToken } from '@/lib/adminAuth';

export type AdminAcademyRow = {
  id: number; name: string; bizNo?: string; createdAt?: string;
  students: number; courses: number; classesToday: number;
  apiCalls: number; logins: number; paymentCount: number; paymentAmountCents: number;
};

export async function listAdminAcademies(params?: { from?: string; to?: string; page?: number; size?: number; q?: string; }) {
  const sp = new URLSearchParams();
  if (params?.from) sp.set('from', params.from);
  if (params?.to) sp.set('to', params.to);
  if (typeof params?.page === 'number') sp.set('page', String(params.page));
  if (typeof params?.size === 'number') sp.set('size', String(params.size));
  if (params?.q) sp.set('q', params.q);
  const q = sp.toString() ? `?${sp.toString()}` : '';
  const token = getAdminToken();
  return await fetchJSON<{ content: AdminAcademyRow[]; page: number; size: number; totalElements: number; totalPages: number }>(`/api/admin/academies${q}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
}
