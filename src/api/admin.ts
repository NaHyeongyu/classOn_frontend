import { fetchJSON } from "@/lib/fetcher";
import { getAdminToken } from "@/lib/adminAuth";

function authHeaders(): Record<string, string> {
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

type AdminPage<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type AdminLoginLog = {
  id: number;
  createdAt: string;
  username: string;
  ip?: string | null;
  success: boolean;
};

export type AdminPayment = {
  id: number;
  createdAt: string;
  amountCents: number;
  currency: string;
  status: string;
  provider?: string | null;
  description?: string | null;
};

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

export async function getLoginLogs(): Promise<AdminLoginLog[]> {
  return await fetchJSON<AdminLoginLog[]>("/api/admin/login-logs", { headers: authHeaders() });
}

export async function getPayments(): Promise<AdminPayment[]> {
  return await fetchJSON<AdminPayment[]>("/api/admin/payments", { headers: authHeaders() });
}

export async function listLoginLogsPaged(params?: { q?: string; from?: string; to?: string; page?: number; size?: number }): Promise<AdminPage<AdminLoginLog>> {
  const sp = new URLSearchParams();
  if (params?.q) sp.set('q', params.q);
  if (params?.from) sp.set('from', params.from);
  if (params?.to) sp.set('to', params.to);
  if (typeof params?.page === 'number') sp.set('page', String(params.page));
  if (typeof params?.size === 'number') sp.set('size', String(params.size));
  const q = sp.toString() ? `?${sp.toString()}` : '';
  return await fetchJSON<AdminPage<AdminLoginLog>>(`/api/admin/login-logs/page${q}`, { headers: authHeaders() });
}

export async function getPaymentsPaged(params?: { from?: string; to?: string; page?: number; size?: number }): Promise<AdminPage<AdminPayment>> {
  const sp = new URLSearchParams();
  if (params?.from) sp.set('from', params.from);
  if (params?.to) sp.set('to', params.to);
  if (typeof params?.page === 'number') sp.set('page', String(params.page));
  if (typeof params?.size === 'number') sp.set('size', String(params.size));
  const q = sp.toString() ? `?${sp.toString()}` : '';
  return await fetchJSON<AdminPage<AdminPayment>>(`/api/admin/payments/page${q}`, { headers: authHeaders() });
}

export async function getApiLogsPaged(params?: { q?: string; errorsOnly?: boolean; from?: string; to?: string; page?: number; size?: number }): Promise<AdminPage<Record<string, unknown>>> {
  const sp = new URLSearchParams();
  if (params?.q) sp.set('q', params.q);
  if (params?.errorsOnly) sp.set('errorsOnly', 'true');
  if (params?.from) sp.set('from', params.from);
  if (params?.to) sp.set('to', params.to);
  if (typeof params?.page === 'number') sp.set('page', String(params.page));
  if (typeof params?.size === 'number') sp.set('size', String(params.size));
  const q = sp.toString() ? `?${sp.toString()}` : '';
  return await fetchJSON<AdminPage<Record<string, unknown>>>(`/api/admin/api-logs/page${q}`, { headers: authHeaders() });
}

export async function getOpenAiLogsPaged(params?: { model?: string; success?: boolean; from?: string; to?: string; page?: number; size?: number }): Promise<AdminPage<Record<string, unknown>>> {
  const sp = new URLSearchParams();
  if (params?.model) sp.set('model', params.model);
  if (typeof params?.success === 'boolean') sp.set('success', String(params.success));
  if (params?.from) sp.set('from', params.from);
  if (params?.to) sp.set('to', params.to);
  if (typeof params?.page === 'number') sp.set('page', String(params.page));
  if (typeof params?.size === 'number') sp.set('size', String(params.size));
  const q = sp.toString() ? `?${sp.toString()}` : '';
  return await fetchJSON<AdminPage<Record<string, unknown>>>(`/api/admin/openai-logs/page${q}`, { headers: authHeaders() });
}

export async function getAcademySummary(id: number | string, params?: { from?: string; to?: string }): Promise<Record<string, unknown>> {
  const sp = new URLSearchParams();
  if (params?.from) sp.set('from', params.from);
  if (params?.to) sp.set('to', params.to);
  const q = sp.toString() ? `?${sp.toString()}` : '';
  return await fetchJSON<Record<string, unknown>>(`/api/admin/academies/${id}/summary${q}`, { headers: authHeaders() });
}

export async function getAcademyPaymentsPaged(id: number | string, params?: { from?: string; to?: string; page?: number; size?: number }): Promise<AdminPage<AdminPayment>> {
  const sp = new URLSearchParams();
  if (params?.from) sp.set('from', params.from);
  if (params?.to) sp.set('to', params.to);
  if (typeof params?.page === 'number') sp.set('page', String(params.page));
  if (typeof params?.size === 'number') sp.set('size', String(params.size));
  const q = sp.toString() ? `?${sp.toString()}` : '';
  return await fetchJSON<AdminPage<AdminPayment>>(`/api/admin/academies/${id}/payments/page${q}`, { headers: authHeaders() });
}

export async function getAcademyLoginLogsPaged(id: number | string, params?: { q?: string; from?: string; to?: string; page?: number; size?: number }): Promise<AdminPage<AdminLoginLog>> {
  const sp = new URLSearchParams();
  if (params?.q) sp.set('q', params.q);
  if (params?.from) sp.set('from', params.from);
  if (params?.to) sp.set('to', params.to);
  if (typeof params?.page === 'number') sp.set('page', String(params.page));
  if (typeof params?.size === 'number') sp.set('size', String(params.size));
  const q = sp.toString() ? `?${sp.toString()}` : '';
  return await fetchJSON<AdminPage<AdminLoginLog>>(`/api/admin/academies/${id}/login-logs/page${q}`, { headers: authHeaders() });
}

export async function getAcademyApiLogsPaged(id: number | string, params?: { q?: string; from?: string; to?: string; page?: number; size?: number }): Promise<AdminPage<Record<string, unknown>>> {
  const sp = new URLSearchParams();
  if (params?.q) sp.set('q', params.q);
  if (params?.from) sp.set('from', params.from);
  if (params?.to) sp.set('to', params.to);
  if (typeof params?.page === 'number') sp.set('page', String(params.page));
  if (typeof params?.size === 'number') sp.set('size', String(params.size));
  const q = sp.toString() ? `?${sp.toString()}` : '';
  return await fetchJSON<AdminPage<Record<string, unknown>>>(`/api/admin/academies/${id}/api-logs/page${q}`, { headers: authHeaders() });
}
