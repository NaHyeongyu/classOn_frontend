// EN: Students API client
// KO: 원생 API 클라이언트
import { fetchJSON } from "../lib/fetcher";
export async function listStudents(params) {
    const sp = new URLSearchParams();
    if (params?.status)
        sp.set("status", params.status);
    if (params?.q) {
        const qv = params.q.trim();
        if (qv)
            sp.set("q", qv);
    }
    if (params?.from)
        sp.set("from", params.from);
    if (params?.to)
        sp.set("to", params.to);
    if (typeof params?.ageMin === "number")
        sp.set("ageMin", String(params.ageMin));
    if (typeof params?.ageMax === "number")
        sp.set("ageMax", String(params.ageMax));
    if (typeof params?.page === "number")
        sp.set("page", String(params.page));
    if (typeof params?.size === "number")
        sp.set("size", String(params.size));
    const q = Array.from(sp.keys()).length ? `?${sp}` : "";
    return await fetchJSON(`/api/students${q}`);
}
export async function getStudent(id) {
    return await fetchJSON(`/api/students/${id}`);
}
export async function getStudentAttendance(id, params) {
    const sp = new URLSearchParams();
    if (params?.from)
        sp.set('from', params.from);
    if (params?.to)
        sp.set('to', params.to);
    if (typeof params?.page === 'number')
        sp.set('page', String(params.page));
    if (typeof params?.size === 'number')
        sp.set('size', String(params.size));
    const q = Array.from(sp.keys()).length ? `?${sp}` : '';
    return await fetchJSON(`/api/students/${id}/attendance${q}`);
}
export async function createStudent(payload) {
    return await fetchJSON(`/api/students`, {
        method: "POST",
        body: JSON.stringify(payload),
    });
}
export async function updateStudent(id, payload) {
    return await fetchJSON(`/api/students/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
}
