const ADMIN_TOKEN_KEY = "admin:token";

export type AdminUser = {
  id: string | number;
  username: string;
  role?: string;
  name?: string;
};

export function getAdminToken(): string | null {
  try { return localStorage.getItem(ADMIN_TOKEN_KEY); } catch { return null; }
}
export function setAdminToken(token: string) {
  try { localStorage.setItem(ADMIN_TOKEN_KEY, token); } catch { /* ignore storage errors */ }
}
export function clearAdminToken() {
  try { localStorage.removeItem(ADMIN_TOKEN_KEY); } catch { /* ignore storage errors */ }
}

export function getAdminUser(): AdminUser | null {
  try { const s = localStorage.getItem('admin:user'); return s ? JSON.parse(s) as AdminUser : null; } catch { return null; }
}
export function setAdminUser(u: AdminUser | null) {
  try {
    if (u) localStorage.setItem('admin:user', JSON.stringify(u));
    else localStorage.removeItem('admin:user');
  } catch { /* ignore storage errors */ }
}
