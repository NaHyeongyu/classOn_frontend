import { fetchJSON } from "@/lib/fetcher";
import { getAdminToken } from "@/lib/adminAuth";

function authHeaders(): Record<string, string> {
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export type AdminFeedbackRow = {
  id: number;
  createdAt: string;
  type: "BUG" | "FEATURE";
  status: "NEW" | "ACK" | "CLOSED";
  title: string;
  body: string;
  contact?: string | null;
  pageUrl?: string | null;
  userAgent?: string | null;
  userId?: number | null;
  username?: string | null;
  academyId?: number | null;
  academyName?: string | null;
};

export type AdminPage<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export async function listFeedbacksPaged(params?: {
  type?: "BUG" | "FEATURE";
  status?: "NEW" | "ACK" | "CLOSED";
  q?: string;
  from?: string; // YYYY-MM-DD
  to?: string;   // YYYY-MM-DD
  page?: number;
  size?: number;
}): Promise<AdminPage<AdminFeedbackRow>> {
  const sp = new URLSearchParams();
  if (params?.type) sp.set('type', params.type);
  if (params?.status) sp.set('status', params.status);
  if (params?.q) sp.set('q', params.q);
  if (params?.from) sp.set('from', params.from);
  if (params?.to) sp.set('to', params.to);
  if (typeof params?.page === 'number') sp.set('page', String(params.page));
  if (typeof params?.size === 'number') sp.set('size', String(params.size));
  const q = sp.toString() ? `?${sp.toString()}` : '';
  return await fetchJSON<AdminPage<AdminFeedbackRow>>(`/api/admin/feedbacks/page${q}`, { headers: authHeaders() });
}

export async function updateFeedbackStatus(id: number, status: "NEW" | "ACK" | "CLOSED") {
  const sp = new URLSearchParams({ status });
  return await fetchJSON<{ id: number; status: string }>(`/api/admin/feedbacks/${id}/status?${sp.toString()}`, {
    method: 'PATCH',
    headers: authHeaders(),
  });
}

