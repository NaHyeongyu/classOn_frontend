import { fetchJSON } from '@/lib/fetcher';
import { getAdminToken } from '@/lib/adminAuth';

function authHeaders() {
  const t = getAdminToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export type AdminOverview = {
  academy?: { id: number; name: string } | null;
  apiCalls: number;
  logins: number;
  openaiCalls: number;
  payments: number;
  academies?: number;
  apiCallsToday?: number;
  openaiCallsToday?: number;
  logins30d?: number;
  paymentsAmount30d?: number;
};

export async function getAdminOverview(): Promise<AdminOverview> {
  return await fetchJSON<AdminOverview>('/api/admin/overview', { headers: authHeaders() });
}

export async function getLoginLogs(): Promise<Array<{ id:number; createdAt:string; username:string; ip?:string; success:boolean }>> {
  return await fetchJSON('/api/admin/login-logs', { headers: authHeaders() });
}

export async function getPayments(): Promise<Array<{ id:number; createdAt:string; amountCents:number; currency:string; status:string; provider?:string; description?:string }>> {
  return await fetchJSON('/api/admin/payments', { headers: authHeaders() });
}

export async function listLoginLogsPaged(params?: { q?: string; from?: string; to?: string; page?: number; size?: number }) {
  const sp = new URLSearchParams();
  if (params?.q) sp.set('q', params.q);
  if (params?.from) sp.set('from', params.from);
  if (params?.to) sp.set('to', params.to);
  if (typeof params?.page === 'number') sp.set('page', String(params.page));
  if (typeof params?.size === 'number') sp.set('size', String(params.size));
  const q = sp.toString() ? `?${sp.toString()}` : '';
  return await fetchJSON<{ content:any[]; page:number; size:number; totalElements:number; totalPages:number }>(`/api/admin/login-logs/page${q}`, { headers: authHeaders() });
}
