// EN: Todo API client (CRUD + reminders)
// KO: Todo API 클라이언트 (CRUD + 리마인더)
import { fetchJSON } from "../lib/fetcher";
export async function listTodos(status) {
    const q = status ? `?status=${status}` : "";
    return await fetchJSON(`/api/todos${q}`);
}
export async function listTodosByDate(dueYmd, status, init) {
    const params = new URLSearchParams();
    params.set("dueYmd", dueYmd);
    if (status)
        params.set("status", status);
    const q = `?${params.toString()}`;
    return await fetchJSON(`/api/todos${q}`, init);
}
export async function createTodo(payload) {
    return await fetchJSON(`/api/todos`, {
        method: "POST",
        body: JSON.stringify(payload),
    });
}
export async function updateTodo(id, payload) {
    return await fetchJSON(`/api/todos/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });
}
export async function deleteTodo(id) {
    return await fetchJSON(`/api/todos/${id}`, { method: "DELETE" });
}
export async function completeTodo(id, done = true) {
    const join = `?done=${done ? "true" : "false"}`;
    return await fetchJSON(`/api/todos/${id}/complete${join}`, { method: "POST" });
}
export async function fetchDueReminders() {
    return await fetchJSON(`/api/todos/reminders-due`);
}
