import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiLogin, apiMe, apiRegister, apiLogout } from "../api/auth";
import { getToken } from "../lib/auth";
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const bootstrap = useCallback(async () => {
        const token = getToken();
        if (!token) {
            setLoading(false);
            return;
        }
        try {
            const res = await apiMe();
            setUser(res);
        }
        catch {
            // ignore
        }
        finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        void bootstrap();
    }, [bootstrap]);
    const login = useCallback(async (username, password) => {
        const res = await apiLogin(username, password);
        setUser(res.user);
    }, []);
    const register = useCallback(async (name, email, phone, password) => {
        const res = await apiRegister(name, email, phone, password);
        setUser(res.user);
    }, []);
    const logout = useCallback(() => {
        apiLogout();
        setUser(null);
    }, []);
    const value = useMemo(() => ({ user, loading, login, register, logout }), [user, loading, login, register, logout]);
    return _jsx(AuthContext.Provider, { value: value, children: children });
}
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx)
        throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
