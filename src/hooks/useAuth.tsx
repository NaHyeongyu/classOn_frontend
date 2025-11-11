/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
// EN: AuthContext provides user state and auth actions across the app
// KO: 앱 전역에 사용자 상태와 인증 액션을 제공하는 컨텍스트
import type { ReactNode } from "react";
import { apiLogin, apiMe, apiRegister, apiLogout } from "../api/auth";
import type { AuthUser } from "../lib/auth";
import { getToken } from "../lib/auth";
import { invalidateCacheByPrefix } from "../lib/fetcher";

type AuthState = {
  user: AuthUser | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<AuthUser>;
  register: (name: string, email: string, phone: string, password: string) => Promise<AuthUser>;
  logout: () => void;
  validate: () => Promise<boolean>;
  authGeneration: number;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authGeneration, setAuthGeneration] = useState(0);
  const resetCaches = useCallback(() => {
    invalidateCacheByPrefix("/api/");
  }, []);

  const bootstrap = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await apiMe();
      setUser(res);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  const login = useCallback(async (username: string, password: string) => {
    const res = await apiLogin(username, password);
    resetCaches();
    setUser(res.user);
    setAuthGeneration((prev) => prev + 1);
    return res.user;
  }, [resetCaches]);

  const register = useCallback(async (name: string, email: string, phone: string, password: string) => {
    const res = await apiRegister(name, email, phone, password);
    resetCaches();
    setUser(res.user);
    setAuthGeneration((prev) => prev + 1);
    return res.user;
  }, [resetCaches]);

  const logout = useCallback(() => {
    apiLogout();
    resetCaches();
    setUser(null);
    setAuthGeneration((prev) => prev + 1);
  }, [resetCaches]);

  const validate = useCallback(async () => {
    const token = getToken();
    if (!token) { setUser(null); return false; }
    try {
      const res = await apiMe();
      setUser(res);
      return true;
    } catch {
      setUser(null);
      return false;
    }
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, register, logout, validate, authGeneration }),
    [user, loading, login, register, logout, validate, authGeneration],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
