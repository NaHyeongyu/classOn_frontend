import { getToken } from "./auth";
// EN: JSON fetch helper that adds base URL and Authorization header
// KO: 기본 URL 및 인증 헤더를 추가하는 JSON fetch 헬퍼
const API_BASE = import.meta.env.VITE_API_BASE_URL || "";
const CACHE_TTL_MS = Number(import.meta.env.VITE_FETCH_TTL_MS ?? 30000);
const DEFAULT_TIMEOUT_MS = Number(import.meta.env.VITE_FETCH_TIMEOUT_MS ?? 10000);
// Certain highly-dynamic endpoints should bypass client TTL/ETag to reflect
// real-time updates (mobile/manual attendance, edited class times, KPI refresh).
// We still keep caching for other endpoints to reduce traffic.
const NO_CACHE_PREFIXES = [
    "/api/calendar/classes",
    "/api/dashboard/summary",
    "/api/dashboard/attendance-today",
];
function resolveURL(path) {
    return API_BASE ? new URL(path, API_BASE).toString() : path;
}
function getCache(url) {
    try {
        const body = localStorage.getItem(`cache:${url}`);
        const etag = localStorage.getItem(`etag:${url}`);
        const ts = localStorage.getItem(`ts:${url}`);
        return { body, etag, ts: ts ? Number(ts) : 0 };
    }
    catch {
        return { body: null, etag: null, ts: 0 };
    }
}
function setCache(url, etag, body) {
    try {
        if (etag)
            localStorage.setItem(`etag:${url}`, etag);
        localStorage.setItem(`cache:${url}`, body);
        localStorage.setItem(`ts:${url}`, String(Date.now()));
    }
    catch { }
}
export function invalidateCache(paths) {
    const list = Array.isArray(paths) ? paths : [paths];
    for (const p of list) {
        const url = resolveURL(p);
        try {
            localStorage.removeItem(`etag:${url}`);
            localStorage.removeItem(`cache:${url}`);
            localStorage.removeItem(`ts:${url}`);
        }
        catch { }
    }
}
// Invalidate all cached entries whose URL starts with the given prefix(es).
// Useful when lists use varied querystrings and ETag/TTL may otherwise keep stale views.
export function invalidateCacheByPrefix(prefixes) {
    const list = (Array.isArray(prefixes) ? prefixes : [prefixes]).map(resolveURL);
    try {
        const keys = [];
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (k)
                keys.push(k);
        }
        for (const k of keys) {
            for (const base of list) {
                if (k.startsWith(`cache:${base}`) || k.startsWith(`etag:${base}`) || k.startsWith(`ts:${base}`)) {
                    try {
                        localStorage.removeItem(k);
                    }
                    catch { }
                }
            }
        }
    }
    catch { }
}
// EN: Read cached JSON for a given path without triggering a network request
// KO: 네트워크 요청 없이 주어진 경로의 캐시된 JSON을 조회
export function peekCache(path) {
    const url = resolveURL(path);
    const { body, ts } = getCache(url);
    if (!body)
        return { data: null, ts: 0 };
    try {
        return { data: JSON.parse(body), ts };
    }
    catch {
        return { data: null, ts: 0 };
    }
}
export async function fetchJSON(path, init) {
    const url = resolveURL(path);
    const token = getToken();
    const noCache = NO_CACHE_PREFIXES.some((p) => url.startsWith(resolveURL(p)));
    // Use credentials only for same-origin requests; omit for cross-origin to avoid CORS credential requirements
    const target = new URL(url, window.location.href);
    const sameOrigin = target.origin === window.location.origin;
    // Lightweight ETag cache for GET requests (reduces payload via 304 Not Modified)
    // 간단한 ETag 캐시 (GET 전용) – 304 응답 시 로컬 캐시 반환으로 트래픽 절감
    const isGet = (init?.method ?? "GET").toUpperCase() === "GET";
    const { body: cachedBody, etag: cachedEtag, ts } = isGet ? getCache(url) : { body: null, etag: null, ts: 0 };
    // Soft TTL: within TTL, serve cache immediately to avoid network
    if (isGet && !noCache && cachedBody && ts && Date.now() - ts < CACHE_TTL_MS) {
        try {
            return JSON.parse(cachedBody);
        }
        catch { }
    }
    const isFormData = init?.body instanceof FormData;
    const headers = {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init?.headers,
    };
    // For real-time endpoints, always fetch a fresh payload (avoid 304 with stale cache)
    if (isGet && cachedEtag && !noCache)
        headers["If-None-Match"] = cachedEtag;
    // Timeout + abort handling
    const controller = new AbortController();
    // If caller supplied a signal, abort our controller when that signal aborts
    if (init?.signal) {
        const extSignal = init.signal;
        if (extSignal.aborted)
            controller.abort();
        else
            extSignal.addEventListener("abort", () => controller.abort(), { once: true });
    }
    const timeoutMs = init?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    const timer = setTimeout(() => {
        try {
            controller.abort();
        }
        catch { }
    }, Math.max(1000, timeoutMs));
    let res;
    try {
        res = await fetch(url, {
            headers,
            credentials: sameOrigin ? "include" : "omit",
            ...init,
            // Prefer our consolidated signal to ensure timeout works
            signal: controller.signal,
        });
    }
    finally {
        clearTimeout(timer);
    }
    // Handle 304 with cache
    if (isGet && res.status === 304) {
        if (cachedBody)
            return JSON.parse(cachedBody);
        // No cached body: fall through to error for visibility
    }
    const text = await res.text().catch(() => "");
    if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText} ${text}`.trim());
    }
    // Persist fresh cache when ETag present
    if (isGet && !noCache) {
        const etag = res.headers.get("ETag");
        if (etag)
            setCache(url, etag, text);
    }
    return (text ? JSON.parse(text) : {});
}
