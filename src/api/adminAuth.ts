import { fetchJSON } from "../lib/fetcher";
import { getAdminToken, setAdminToken, clearAdminToken, setAdminUser, type AdminUser } from "../lib/adminAuth";

type AdminLoginResponse = { token: string; user: AdminUser };

export async function adminLogin(username: string, password: string): Promise<AdminLoginResponse> {
  // Local demo credentials (temporary): allow configured or default admin
  const demo = readLocalAdminCred();
  const fallbackUser = { token: `admin-local-${Date.now()}`, user: { id: 0, username, role: 'ADMIN', name: 'Admin' } } as AdminLoginResponse;
  if ((demo && username === demo.username && password === demo.password) || (!demo && username === 'admin' && password === 'admin1234')) {
    setAdminToken(fallbackUser.token);
    setAdminUser(fallbackUser.user);
    return fallbackUser;
  }
  // If backend doesn't provide, fall back to shared auth endpoint as a best-effort
  const prefer = '/api/admin/login';
  let res: AdminLoginResponse;
  try {
    res = await fetchJSON<AdminLoginResponse>(prefer, { method: 'POST', body: JSON.stringify({ username, password }) });
  } catch {
    // fallback to regular login path but treat as admin session client-side
    res = await fetchJSON<AdminLoginResponse>('/api/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) });
  }
  setAdminToken(res.token);
  setAdminUser(res.user);
  return res;
}

export async function adminMe(): Promise<AdminUser> {
  const token = getAdminToken();
  if (!token) throw new Error('No admin token');
  try {
    // preferred admin endpoint
    const me = await fetchJSON<AdminUser>('/api/admin/me', { headers: { Authorization: `Bearer ${token}` } });
    setAdminUser(me);
    return me;
  } catch {
    // fallback: keep last known user
    const cached = ((): AdminUser | null => { try { return JSON.parse(localStorage.getItem('admin:user') || 'null'); } catch { return null; } })();
    if (cached) return cached;
    throw new Error('Admin session 확인 실패');
  }
}

export function adminLogout() {
  clearAdminToken();
  setAdminUser(null);
}

// Temporary local admin credential storage (for demo/testing only)
export function saveLocalAdminCred(username: string, password: string) {
  try { localStorage.setItem('admin:cred', JSON.stringify({ username, password })); } catch {}
}
export function readLocalAdminCred(): { username: string; password: string } | null {
  try { const s = localStorage.getItem('admin:cred'); return s ? JSON.parse(s) : null; } catch { return null; }
}

// createAdminUser removed from UI usage; endpoint remains for future admin-only tooling.
