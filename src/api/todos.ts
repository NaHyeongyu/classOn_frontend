// EN: Todo API client (CRUD + reminders)
// KO: Todo API 클라이언트 (CRUD + 리마인더)

import { fetchJSON } from "../lib/fetcher";

export type Todo = {
  id: number;
  title: string;
  notes?: string;
  status: "PENDING" | "DONE";
  orderIndex: number;
  dueAt?: string;
  remindAt?: string;
  remindedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type TodoPayload = Partial<Pick<Todo, "title" | "notes" | "status" | "orderIndex">> & {
  calendarDate?: string; // YYYY-MM-DD (required on create)
};

export async function listTodos(status?: "PENDING" | "DONE"): Promise<Todo[]> {
  const q = status ? `?status=${status}` : "";
  return await fetchJSON<Todo[]>(`/api/todos${q}`);
}

export async function listTodosByDate(
  dueYmd: string,
  status?: "PENDING" | "DONE",
  init?: RequestInit
): Promise<Todo[]> {
  const params = new URLSearchParams();
  params.set("dueYmd", dueYmd);
  if (status) params.set("status", status);
  const q = `?${params.toString()}`;
  return await fetchJSON<Todo[]>(`/api/todos${q}`, init);
}

export async function createTodo(payload: { title: string } & TodoPayload): Promise<Todo> {
  return await fetchJSON<Todo>(`/api/todos`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateTodo(id: number, payload: TodoPayload): Promise<Todo> {
  return await fetchJSON<Todo>(`/api/todos/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteTodo(id: number): Promise<void> {
  await fetchJSON<void>(`/api/todos/${id}`, { method: "DELETE" });
}

export async function completeTodo(id: number, done = true): Promise<Todo> {
  const join = `?done=${done ? "true" : "false"}`;
  return await fetchJSON<Todo>(`/api/todos/${id}/complete${join}`, { method: "POST" });
}
