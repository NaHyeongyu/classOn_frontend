import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { adminLogin as apiLogin, adminLogout as apiLogout, adminMe } from '@/api/adminAuth';
import type { AdminUser } from '@/lib/adminAuth';
import { getAdminToken } from '@/lib/adminAuth';

type Ctx = {
  admin: AdminUser | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  validate: () => Promise<boolean>;
};

const AdminAuthContext = createContext<Ctx | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const validate = useCallback(async () => {
    const token = getAdminToken();
    if (!token) { setAdmin(null); return false; }
    setLoading(true);
    try {
      const me = await adminMe();
      setAdmin(me);
      return true;
    } catch {
      setAdmin(null);
      return false;
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { void validate(); }, [validate]);

  const login = useCallback(async (username: string, password: string) => {
    setLoading(true);
    try {
      const { user } = await apiLogin(username, password);
      setAdmin(user);
    } finally { setLoading(false); }
  }, []);

  const logout = useCallback(() => { apiLogout(); setAdmin(null); }, []);

  const value = useMemo(() => ({ admin, loading, login, logout, validate }), [admin, loading, login, logout, validate]);
  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}

