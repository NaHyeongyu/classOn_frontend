import { fetchJSON } from "../lib/fetcher";
// EN: Auth API layer used by screens/hooks
// KO: 화면/훅에서 사용하는 인증 API 레이어
import { setToken, clearToken } from "../lib/auth";
//
// EN: Local mock user when VITE_USE_MOCK=1
// KO: 개발용 목업 사용자(VITE_USE_MOCK=1 일 때)
const MOCK_USER = {
    id: 1,
    name: "관리자",
    username: "admin@academy.com",
    email: "admin@academy.com",
    phone: "01012345678",
};
// EN: Username login -> { token, user }
// KO: 아이디 로그인 -> { token, user }
export async function apiLogin(username, password) {
    if (import.meta.env.VITE_USE_MOCK === "1") {
        // simple credentials check for demo
        await delay(300);
        const token = btoa(`${username}:${Date.now()}`);
        setToken(token);
        return { token, user: MOCK_USER };
    }
    const res = await fetchJSON("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
    });
    setToken(res.token);
    return res;
}
// EN: Simple register used in quick flow (not the onboarding wizard)
// KO: 빠른 플로우에서 사용하는 간단 회원가입(온보딩 위저드와 별개)
export async function apiRegister(name, email, phone, password) {
    if (import.meta.env.VITE_USE_MOCK === "1") {
        await delay(300);
        const token = btoa(`${email}:${Date.now()}`);
        setToken(token);
        return { token, user: { id: 2, name, username: email, email, phone } };
    }
    const res = await fetchJSON("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, phone, password }),
    });
    setToken(res.token);
    return res;
}
// EN: Resolve current user with stored token
// KO: 저장된 토큰으로 현재 사용자 조회
export async function apiMe() {
    if (import.meta.env.VITE_USE_MOCK === "1") {
        await delay(200);
        return MOCK_USER;
    }
    // Keep a conservative timeout on bootstrap to avoid indefinite loading
    return await fetchJSON("/api/auth/me", { timeoutMs: 5000 });
}
// EN: Clear local token
// KO: 로컬 토큰 삭제
export function apiLogout() {
    clearToken();
}
// EN: Username availability check
// KO: 아이디 중복 확인
export async function apiCheckUsername(username) {
    if (import.meta.env.VITE_USE_MOCK === "1") {
        await delay(250);
        return { available: username.toLowerCase() !== "taken" };
    }
    const res = await fetchJSON(`/api/auth/check-username?username=${encodeURIComponent(username)}`);
    return { available: res.success };
}
// EN: Request phone verification code
// KO: 휴대폰 인증코드 요청
export async function apiRequestPhoneCode(phone) {
    if (import.meta.env.VITE_USE_MOCK === "1") {
        await delay(300);
        return { success: true, code: "123456" };
    }
    return await fetchJSON("/api/auth/phone/request", {
        method: "POST",
        body: JSON.stringify({ phone }),
    });
}
// EN: Verify phone code
// KO: 휴대폰 인증코드 검증
export async function apiVerifyPhoneCode(phone, code) {
    if (import.meta.env.VITE_USE_MOCK === "1") {
        await delay(250);
        return { success: code === "123456" };
    }
    return await fetchJSON("/api/auth/phone/verify", {
        method: "POST",
        body: JSON.stringify({ phone, code }),
    });
}
// EN: Email availability check
// KO: 이메일 중복 확인
export async function apiCheckEmail(email) {
    if (import.meta.env.VITE_USE_MOCK === "1") {
        await delay(150);
        return { available: !email.toLowerCase().startsWith("admin") };
    }
    const res = await fetchJSON(`/api/auth/check-email?email=${encodeURIComponent(email)}`);
    return { available: res.success };
}
// EN: BizNo availability check
// KO: 사업자번호 중복 확인
export async function apiCheckBizNo(bizNo) {
    if (import.meta.env.VITE_USE_MOCK === "1") {
        await delay(150);
        return { available: bizNo !== "0000000000" };
    }
    const res = await fetchJSON(`/api/onboard/check-bizno?bizNo=${encodeURIComponent(bizNo)}`);
    return { available: res.success };
}
// EN: Final onboarding submission; on success, navigate to login
// KO: 온보딩 최종 제출; 성공 시 로그인 페이지로 이동
export async function apiOnboardComplete(payload) {
    if (import.meta.env.VITE_USE_MOCK === "1") {
        await delay(300);
        const token = btoa(`${payload.email}:${Date.now()}`);
        setToken(token);
        const user = {
            id: Date.now(),
            name: payload.name,
            username: payload.username,
            email: payload.email,
            phone: payload.phone,
        };
        return { token, user };
    }
    const res = await fetchJSON("/api/onboard/complete", {
        method: "POST",
        body: JSON.stringify(payload),
    });
    setToken(res.token);
    return res;
}
//
function delay(ms) {
    return new Promise((res) => setTimeout(res, ms));
}
