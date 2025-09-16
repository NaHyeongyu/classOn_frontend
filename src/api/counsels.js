import { fetchJSON, invalidateCacheByPrefix } from "../lib/fetcher";
export async function listCounsels(params) {
    const sp = new URLSearchParams();
    if (params.studentId)
        sp.set("studentId", String(params.studentId));
    if (typeof params.page === 'number')
        sp.set("page", String(params.page));
    if (typeof params.size === 'number')
        sp.set("size", String(params.size));
    if (params.status)
        sp.set("status", mapStatusParam(params.status));
    if (params.q)
        sp.set("q", params.q);
    if (params.from)
        sp.set("from", params.from);
    if (params.to)
        sp.set("to", params.to);
    if (params.onYmd)
        sp.set("onYmd", params.onYmd);
    const q = Array.from(sp.keys()).length ? `?${sp}` : '';
    return await fetchJSON(`/api/counsels${q}`);
}
function mapStatusParam(s) {
    switch (s) {
        case '예정': return 'SCHEDULED';
        case '전환': return 'CONVERTED';
        case '대기': return 'PENDING';
        case '보류': return 'ON_HOLD';
        default: return s; // pass through if already enum
    }
}
export async function createCounsel(payload) {
    const res = await fetchJSON(`/api/counsels`, { method: 'POST', body: JSON.stringify(payload) });
    // Bust list caches so newly created item appears immediately in lists
    invalidateCacheByPrefix('/api/counsels');
    return res;
}
export async function updateCounsel(id, payload) {
    const res = await fetchJSON(`/api/counsels/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
    invalidateCacheByPrefix('/api/counsels');
    return res;
}
export async function getCounsel(id) {
    return await fetchJSON(`/api/counsels/${id}`);
}
export async function deleteCounsel(id) {
    await fetchJSON(`/api/counsels/${id}`, { method: 'DELETE' });
}
