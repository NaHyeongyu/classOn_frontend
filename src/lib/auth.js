const TOKEN_KEY = "auth:token";
export function getToken() {
    try {
        return localStorage.getItem(TOKEN_KEY);
    }
    catch {
        return null;
    }
}
export function setToken(token) {
    try {
        localStorage.setItem(TOKEN_KEY, token);
    }
    catch { }
}
export function clearToken() {
    try {
        localStorage.removeItem(TOKEN_KEY);
    }
    catch { }
}
// Removed unused isAuthenticated helper; prefer explicit auth state via context
