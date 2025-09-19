const TOKEN_KEY = "auth:token";
// EN: Simple localStorage-based token store
// KO: localStorage 기반 간단 토큰 저장소

export type AuthUser = {
  id: string | number;
  name: string;
  username: string;
  email?: string;
  phone?: string;
};

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // noop: storage might be unavailable (private mode)
  }
}

export function clearToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // noop
  }
}

// Removed unused isAuthenticated helper; prefer explicit auth state via context
