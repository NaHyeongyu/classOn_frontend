import { getToken } from "./auth";
import { clearAdminToken, setAdminUser } from "./adminAuth";
// EN: JSON fetch helper that adds base URL and Authorization header
// KO: 기본 URL 및 인증 헤더를 추가하는 JSON fetch 헬퍼

// Support both VITE_API_BASE (new) and VITE_API_BASE_URL (legacy).
// In development: default to "" to use Vite dev proxy (no CORS, points to localhost:8080).
// Outside development: default to the production API domain.
const DEFAULT_API_BASE = import.meta.env.DEV ? "" : "https://api.myclasson.com/api";
const CANARY_HEADER_NAME = "X-Canary";
const CANARY_HEADER_VALUE = import.meta.env.VITE_USE_CANARY === "1" ? "1" : null;
declare global {
  interface Window {
    __CANARY_HEADER_ACTIVE__?: boolean;
    __CANARY_FETCH_PATCHED__?: boolean;
  }
}

export const API_BASE =
  (import.meta.env.VITE_API_BASE ?? import.meta.env.VITE_API_BASE_URL) ?? DEFAULT_API_BASE;

const API_ORIGIN = (() => {
  try {
    return API_BASE ? new URL(API_BASE).origin : null;
  } catch {
    return null;
  }
})();

if (CANARY_HEADER_VALUE && typeof window !== "undefined") {
  window.__CANARY_HEADER_ACTIVE__ = true;
  if (!window.__CANARY_FETCH_PATCHED__) {
    const originalFetch = window.fetch.bind(window);
    window.fetch = async (input: URL | RequestInfo, init?: RequestInit) => {
      const shouldApply = (() => {
        if (!API_ORIGIN) return false;
        try {
          if (typeof input === "string") {
            const target = new URL(input, API_BASE ?? window.location.origin);
            return target.origin === API_ORIGIN;
          }
          if (input instanceof URL) {
            return input.origin === API_ORIGIN;
          }
          if (input instanceof Request) {
            return new URL(input.url).origin === API_ORIGIN;
          }
        } catch {
          return false;
        }
        return false;
      })();
      if (!shouldApply) {
        const requestInfo = input instanceof URL ? input.toString() : (input as RequestInfo);
        return originalFetch(requestInfo, init);
      }

      const nextInit: RequestInit = { ...init };
      const headers = new Headers(init?.headers ?? {});
      if (!headers.has(CANARY_HEADER_NAME) && CANARY_HEADER_VALUE) {
        headers.set(CANARY_HEADER_NAME, CANARY_HEADER_VALUE);
      }
      nextInit.headers = headers;

      if (input instanceof Request) {
        const reqHeaders = new Headers(input.headers);
        if (!reqHeaders.has(CANARY_HEADER_NAME) && CANARY_HEADER_VALUE) {
          reqHeaders.set(CANARY_HEADER_NAME, CANARY_HEADER_VALUE);
          input = new Request(input, { headers: reqHeaders });
        }
      }
      const requestInfo = input instanceof URL ? input.toString() : (input as RequestInfo);
      return originalFetch(requestInfo, nextInit);
    };
    window.__CANARY_FETCH_PATCHED__ = true;
  }
}

const CACHE_TTL_MS = Number(import.meta.env.VITE_FETCH_TTL_MS ?? 30000);
const DEFAULT_TIMEOUT_MS = Number(import.meta.env.VITE_FETCH_TIMEOUT_MS ?? 10000);
// Certain highly-dynamic endpoints should bypass client TTL/ETag to reflect
// real-time updates (mobile/manual attendance, edited class times, KPI refresh).
// We still keep caching for other endpoints to reduce traffic.
const NO_CACHE_PREFIXES = [
  "/api/dashboard/summary",
  "/api/dashboard/attendance-today",
  "/api/calendar/classes",           // calendar daily view should refresh immediately
  "/api/calendar/classes-range",     // calendar monthly range should refresh immediately
  "/api/records/render",
  "/api/attendance/daily",
];

export function resolveApiUrl(path: string) {
  return API_BASE ? new URL(path, API_BASE).toString() : path;
}

export function getCanaryHeaders() {
  return CANARY_HEADER_VALUE ? { [CANARY_HEADER_NAME]: CANARY_HEADER_VALUE } : {};
}

function getCache(url: string) {
  try {
    const body = localStorage.getItem(`cache:${url}`);
    const etag = localStorage.getItem(`etag:${url}`);
    const ts = localStorage.getItem(`ts:${url}`);
    return { body, etag, ts: ts ? Number(ts) : 0 };
  } catch {
    // noop: localStorage may be unavailable
    return { body: null, etag: null, ts: 0 };
  }
}

function setCache(url: string, etag: string | null, body: string) {
  try {
    if (etag) localStorage.setItem(`etag:${url}`, etag);
    localStorage.setItem(`cache:${url}`, body);
    localStorage.setItem(`ts:${url}`, String(Date.now()));
  } catch {
    // noop: storage write may fail
  }
}

export function invalidateCache(paths: string | string[]) {
  const list = Array.isArray(paths) ? paths : [paths];
  for (const p of list) {
    const url = resolveApiUrl(p);
    try {
      localStorage.removeItem(`etag:${url}`);
      localStorage.removeItem(`cache:${url}`);
      localStorage.removeItem(`ts:${url}`);
    } catch {
      // noop
    }
  }
}

// Invalidate all cached entries whose URL starts with the given prefix(es).
// Useful when lists use varied querystrings and ETag/TTL may otherwise keep stale views.
export function invalidateCacheByPrefix(prefixes: string | string[]) {
  const list = (Array.isArray(prefixes) ? prefixes : [prefixes]).map(resolveApiUrl);
  try {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k) keys.push(k);
    }
    for (const k of keys) {
      for (const base of list) {
        if (k.startsWith(`cache:${base}`) || k.startsWith(`etag:${base}`) || k.startsWith(`ts:${base}`)) {
          try { localStorage.removeItem(k); } catch { /* noop */ }
        }
      }
    }
  } catch {
    // noop
  }
}

// EN: Read cached JSON for a given path without triggering a network request
// KO: 네트워크 요청 없이 주어진 경로의 캐시된 JSON을 조회
export function peekCache<T>(path: string): { data: T | null; ts: number } {
  const url = resolveApiUrl(path);
  const { body, ts } = getCache(url);
  if (!body) return { data: null, ts: 0 };
  try {
    return { data: JSON.parse(body) as T, ts };
  } catch {
    return { data: null, ts: 0 };
  }
}

type FetchInit = RequestInit & { timeoutMs?: number };

export async function fetchJSON<T>(path: string, init?: FetchInit): Promise<T> {
  const url = resolveApiUrl(path);
  const token = getToken();
  const noCache = NO_CACHE_PREFIXES.some((p) => url.startsWith(resolveApiUrl(p)));
  // Use credentials only for same-origin requests; omit for cross-origin to avoid CORS credential requirements
  const target = new URL(url, window.location.href);
  const sameOrigin = target.origin === window.location.origin;
  // Normalize method and apply safe overrides for known POST-only endpoints
  const originalMethod = (init?.method ?? "GET").toUpperCase();
  const method = (() => {
    // Ensure summarize endpoint is always POST (prevents accidental navigation/GET)
    if (path.startsWith("/api/records/summarize") && originalMethod === "GET") return "POST";
    return originalMethod;
  })();
  // Lightweight ETag cache for GET requests (reduces payload via 304 Not Modified)
  // 간단한 ETag 캐시 (GET 전용) – 304 응답 시 로컬 캐시 반환으로 트래픽 절감
  const isGet = method === "GET";
  const { body: cachedBody, etag: cachedEtag, ts } = isGet ? getCache(url) : { body: null, etag: null, ts: 0 };
  // Soft TTL: within TTL, serve cache immediately to avoid network
  if (isGet && !noCache && cachedBody && ts && Date.now() - ts < CACHE_TTL_MS) {
    try {
      return JSON.parse(cachedBody) as T;
    } catch { /* ignore cache parse failure */ }
  }
  const isFormData = init?.body instanceof FormData;
  const headers: Record<string, string> = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...normalizeHeaders(init?.headers),
    ...getCanaryHeaders(),
  };
  // For real-time endpoints, always fetch a fresh payload (avoid 304 with stale cache)
  if (isGet && cachedEtag && !noCache) headers["If-None-Match"] = cachedEtag;

  // Timeout + abort handling
  const controller = new AbortController();
  // If caller supplied a signal, abort our controller when that signal aborts
  if (init?.signal) {
    const extSignal = init.signal;
    if (extSignal.aborted) controller.abort();
    else extSignal.addEventListener("abort", () => controller.abort(), { once: true });
  }
  const timeoutMs = init?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const timer = setTimeout(() => {
    try { controller.abort(); } catch { /* noop */ }
  }, Math.max(1000, timeoutMs));

  let res: Response;
  try {
    res = await fetch(url, {
      headers,
      credentials: sameOrigin ? "include" : "omit",
      ...init,
      method,
      // Prefer our consolidated signal to ensure timeout works
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
  // Handle 304 with cache
  if (isGet && res.status === 304) {
    if (cachedBody) return JSON.parse(cachedBody) as T;
    // No cached body: fall through to error for visibility
  }

  const text = await res.text().catch(() => "");
  if (!res.ok) {
    // Try to parse API error payloads and surface a friendly message
    const contentType = res.headers.get('content-type') || '';
    let message = '' as string;
    let code: string | number | undefined;
    if (contentType.includes('application/json') && text) {
      try {
        const json = JSON.parse(text);
        // Common fields: { code, message, field } or generic { error, msg }
        message = json?.message || json?.error || json?.msg || '';
        code = json?.code;
      } catch { /* ignore parse error */ }
    }
    if (!message) {
      // Fallback to plain text or status text
      message = text?.trim() || res.statusText || '요청에 실패했습니다.';
    }
    const err = new Error(message) as Error & { status?: number; code?: string | number };
    err.status = res.status;
    if (code) err.code = code;

    const isAdminRequest = (() => {
      if (!path) return false;
      if (path.startsWith("/api/admin")) return true;
      if (path.startsWith("api/admin")) return true;
      try {
        return new URL(url).pathname.startsWith("/api/admin");
      } catch {
        return url.includes("/api/admin/");
      }
    })();
    if ((res.status === 401 || res.status === 403) && isAdminRequest) {
      try {
        clearAdminToken();
        setAdminUser(null);
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("admin-auth-lost"));
        }
      } catch {
        // noop
      }
    }
    throw err;
  }
  // Persist fresh cache for GET (store body always; ETag when available)
  if (isGet && !noCache) {
    const etag = res.headers.get("ETag");
    setCache(url, etag, text);
  }
  return (text ? (JSON.parse(text) as T) : ({} as unknown as T));

  function normalizeHeaders(h?: HeadersInit): Record<string, string> {
    if (!h) return {};
    if (h instanceof Headers) {
      const out: Record<string, string> = {};
      h.forEach((v, k) => { out[k] = v; });
      return out;
    }
    if (Array.isArray(h)) {
      const out: Record<string, string> = {};
      for (const [k, v] of h) out[k] = v as string;
      return out;
    }
    return { ...(h as Record<string, string>) };
  }
}
