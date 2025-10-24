import { useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { createTodo, deleteTodo, updateTodo } from "@/api/todos";
import { invalidateTodosCache } from "@/features/todos/cache";
import { useTodosByDate } from "@/features/todos/useTodosByDate";
import type { TaskItem } from "@/types/calendarDetail";
import { readableError } from "@/lib/errors";

type ConfirmFn = (options: { title?: string; message?: ReactNode }) => Promise<boolean>;

type UseCalendarDetailTodosOptions = {
  ymd: string;
  confirmDelete: ConfirmFn;
};

export function useCalendarDetailTodos({ ymd, confirmDelete }: UseCalendarDetailTodosOptions) {
  const { data, error, refresh } = useTodosByDate(ymd);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [todoErr, setTodoErr] = useState<string | null>(null);

  const inProgress: TaskItem[] = useMemo(
    () =>
      (data || [])
        .filter((item) => item.status !== "DONE")
        .map((item) => ({
          id: item.id,
          title: item.title,
          content: item.notes,
          done: false,
        })),
    [data],
  );

  const done: TaskItem[] = useMemo(
    () =>
      (data || [])
        .filter((item) => item.status === "DONE")
        .map((item) => ({
          id: item.id,
          title: item.title,
          content: item.notes,
          done: true,
        })),
    [data],
  );

  const handleAdd = () => {
    setEditingId(null);
    setFormTitle("");
    setFormNotes("");
    setTodoErr(null);
    setOpen(true);
  };

  const handleEdit = (id: number) => {
    const target = (data || []).find((item) => item.id === id);
    if (!target) return;
    setEditingId(id);
    setFormTitle(target.title);
    setFormNotes(target.notes || "");
    setTodoErr(null);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  const handleTitleChange = (value: string) => {
    setFormTitle(value);
    if (todoErr) setTodoErr(null);
  };

  const handleNotesChange = (value: string) => {
    setFormNotes(value);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!formTitle.trim()) {
      setTodoErr("제목을 입력해 주세요.");
      return;
    }
    try {
      if (editingId == null) {
        await createTodo({
          title: formTitle.trim(),
          notes: formNotes || undefined,
          calendarDate: ymd,
        });
      } else {
        await updateTodo(editingId, {
          title: formTitle.trim(),
          notes: formNotes || undefined,
        });
      }
      invalidateTodosCache(ymd);
      await refresh();
      setOpen(false);
      setTodoErr(null);
      setMutationError(null);
    } catch (err) {
      setMutationError(readableError(err, "저장에 실패했습니다."));
    }
  };

  const handleDelete = async (id: number) => {
    const target = (data || []).find((item) => item.id === id);
    const confirmed = await confirmDelete({
      title: "할 일을 삭제할까요?",
      message: target?.title
        ? `"${target.title}" 항목을 삭제합니다. 되돌릴 수 없습니다.`
        : "선택한 할 일을 삭제합니다. 되돌릴 수 없습니다.",
    });
    if (!confirmed) return;
    try {
      await deleteTodo(id);
      invalidateTodosCache(ymd);
      await refresh();
      setMutationError(null);
    } catch (err) {
      setMutationError(readableError(err, "삭제에 실패했습니다."));
    }
  };

  return {
    inProgress,
    done,
    open,
    editingId,
    formTitle,
    formNotes,
    todoErr,
    mutationError,
    error,
    onAdd: handleAdd,
    onEdit: handleEdit,
    onCloseModal: handleCloseModal,
    onSubmit: handleSubmit,
    onDelete: handleDelete,
    onChangeTitle: handleTitleChange,
    onChangeNotes: handleNotesChange,
  };
}
