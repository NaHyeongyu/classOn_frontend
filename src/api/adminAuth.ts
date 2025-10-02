import { fetchJSON } from "../lib/fetcher";
import { getAdminToken, setAdminToken, clearAdminToken, setAdminUser, type AdminUser } from "../lib/adminAuth";

type AdminLoginResponse = { token: string; user: AdminUser };

export async function adminLogin(username: string, password: string): Promise<AdminLoginResponse> {
  // Enforce admin login strictly via admin endpoint and only for allowed usernames
  const uname = username.trim();
  if (uname !== 'skgusrb' && uname !== 'classonadmin') {
    throw new Error('허용되지 않은 관리자 아이디입니다.');
  }
  const res = await fetchJSON<AdminLoginResponse>('/api/admin/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
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

// Admin bootstrap: create admin user. If an admin already exists, requires admin token.
// createAdminUser removed as per request
// createAdminUser removed from UI usage; endpoint remains for future admin-only tooling.
