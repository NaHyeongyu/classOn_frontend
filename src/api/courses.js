import { fetchJSON } from "../lib/fetcher";
export async function listCourses(params) {
    const sp = new URLSearchParams();
    if (params?.status)
        sp.set("status", params.status);
    if (params?.q && params.q.trim())
        sp.set("q", params.q.trim());
    if (typeof params?.page === "number")
        sp.set("page", String(params.page));
    if (typeof params?.size === "number")
        sp.set("size", String(params.size));
    if (params?.onYmd)
        sp.set("onYmd", params.onYmd);
    const q = Array.from(sp.keys()).length ? `?${sp}` : "";
    return await fetchJSON(`/api/courses${q}`);
}
export async function getCourse(id) {
    return await fetchJSON(`/api/courses/${id}`);
}
export async function createCourse(payload) {
    const body = JSON.stringify({
        title: payload.title,
        description: payload.description,
        status: payload.status,
        capacity: payload.capacity,
        fee: payload.fee,
        courseTime: payload.courseTime,
        recurrenceDays: payload.recurrenceDays,
        startTime: payload.startTime,
        endTime: payload.endTime,
        recurring: payload.recurring ?? true,
    });
    return await fetchJSON(`/api/courses`, { method: "POST", body });
}
export async function updateCourse(id, payload) {
    const body = JSON.stringify({
        title: payload.title,
        description: payload.description,
        status: payload.status,
        capacity: payload.capacity,
        fee: payload.fee,
        courseTime: payload.courseTime,
        recurrenceDays: payload.recurrenceDays,
        startTime: payload.startTime,
        endTime: payload.endTime,
        recurring: payload.recurring ?? true,
    });
    return await fetchJSON(`/api/courses/${id}`, { method: "PUT", body });
}
export async function listCourseStudents(id) {
    return await fetchJSON(`/api/courses/${id}/students`);
}
export async function listCourseRecords(id, params) {
    const sp = new URLSearchParams();
    if (params?.from)
        sp.set("from", params.from);
    if (params?.to)
        sp.set("to", params.to);
    const q = Array.from(sp.keys()).length ? `?${sp}` : "";
    return await fetchJSON(`/api/courses/${id}/records${q}`);
}
export async function updateCourseRecord(courseId, recordId, payload) {
    const body = JSON.stringify(payload);
    return await fetchJSON(`/api/courses/${courseId}/records/${recordId}`, { method: 'PUT', body });
}
export async function deleteCourseRecord(courseId, recordId) {
    return await fetchJSON(`/api/courses/${courseId}/records/${recordId}`, { method: 'DELETE' });
}
export async function createCourseRecord(courseId, payload) {
    const body = JSON.stringify(payload);
    return await fetchJSON(`/api/courses/${courseId}/records`, { method: 'POST', body });
}
export async function generateCourseRecords(courseId, params) {
    const sp = new URLSearchParams();
    if (params?.from)
        sp.set('from', params.from);
    if (params?.to)
        sp.set('to', params.to);
    const q = Array.from(sp.keys()).length ? `?${sp}` : '';
    return await fetchJSON(`/api/courses/${courseId}/records/generate${q}`, { method: 'POST' });
}
export async function deleteCourseRecordsRange(courseId, params) {
    const sp = new URLSearchParams({ from: params.from, to: params.to });
    return await fetchJSON(`/api/courses/${courseId}/records?${sp}`, { method: 'DELETE' });
}
export async function listRecordAttendance(courseId, recordId) {
    return await fetchJSON(`/api/courses/${courseId}/records/${recordId}/attendance`);
}
export async function upsertAttendance(courseId, recordId, studentId, payload) {
    const body = JSON.stringify(payload);
    return await fetchJSON(`/api/courses/${courseId}/records/${recordId}/attendance/${studentId}`, { method: 'PUT', body });
}
export async function listRecordAttachments(courseId, recordId) {
    return await fetchJSON(`/api/courses/${courseId}/records/${recordId}/attachments`);
}
export async function uploadRecordAttachments(courseId, recordId, files) {
    const form = new FormData();
    files.forEach(f => form.append('files', f));
    return await fetchJSON(`/api/courses/${courseId}/records/${recordId}/attachments`, { method: 'POST', body: form });
}
export async function deleteRecordAttachment(courseId, recordId, fileId) {
    await fetchJSON(`/api/courses/${courseId}/records/${recordId}/attachments/${fileId}`, { method: 'DELETE' });
}
export async function deleteCourse(id) {
    await fetchJSON(`/api/courses/${id}`, { method: 'DELETE' });
}
