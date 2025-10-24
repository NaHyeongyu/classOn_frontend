import type { ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import type { StudentMemo } from "./types";

type ConfirmFn = (options: {
  title?: string;
  message?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "default" | "danger";
  hideCancel?: boolean;
}) => Promise<boolean>;

type UseStudentMemosOptions = {
  studentId: number | null;
  confirmDelete: ConfirmFn;
};

type UseStudentMemosResult = {
  memos: StudentMemo[];
  newMemo: string;
  setNewMemo: (value: string) => void;
  editingMemoId: number | null;
  editingMemoText: string;
  setEditingMemoText: (value: string) => void;
  addMemo: () => void;
  beginEditMemo: (id: number) => void;
  cancelEditMemo: () => void;
  saveEditMemo: () => void;
  requestDeleteMemo: (id: number) => Promise<void>;
};

export function useStudentMemos({
  studentId,
  confirmDelete,
}: UseStudentMemosOptions): UseStudentMemosResult {
  const [memos, setMemos] = useState<StudentMemo[]>([]);
  const [newMemo, setNewMemo] = useState("");
  const [editingMemoId, setEditingMemoId] = useState<number | null>(null);
  const [editingMemoText, setEditingMemoText] = useState("");

  useEffect(() => {
    if (!studentId) {
      setMemos([]);
      setNewMemo("");
      setEditingMemoId(null);
      setEditingMemoText("");
      return;
    }
    try {
      const raw = localStorage.getItem(`student:memos:${studentId}`);
      const parsed = raw ? (JSON.parse(raw) as StudentMemo[]) : [];
      setMemos(Array.isArray(parsed) ? parsed : []);
    } catch {
      setMemos([]);
    }
  }, [studentId]);

  const persist = useCallback(
    (next: StudentMemo[]) => {
      setMemos(next);
      if (!studentId) return;
      try {
        localStorage.setItem(`student:memos:${studentId}`, JSON.stringify(next));
      } catch {
        // ignore storage errors
      }
    },
    [studentId]
  );

  const addMemo = useCallback(() => {
    if (!studentId) return;
    const text = (newMemo || "").trim();
    if (!text) return;
    const now = new Date().toISOString();
    const entry: StudentMemo = { id: Date.now(), text, createdAt: now };
    persist([entry, ...memos]);
    setNewMemo("");
  }, [memos, newMemo, persist, studentId]);

  const beginEditMemo = useCallback(
    (id: number) => {
      const target = memos.find((memo) => memo.id === id);
      if (!target) return;
      setEditingMemoId(id);
      setEditingMemoText(target.text);
    },
    [memos]
  );

  const cancelEditMemo = useCallback(() => {
    setEditingMemoId(null);
    setEditingMemoText("");
  }, []);

  const saveEditMemo = useCallback(() => {
    if (editingMemoId == null) return;
    const text = (editingMemoText || "").trim();
    const now = new Date().toISOString();
    const next = memos.map((memo) =>
      memo.id === editingMemoId ? { ...memo, text, updatedAt: now } : memo
    );
    persist(next);
    setEditingMemoId(null);
    setEditingMemoText("");
  }, [editingMemoId, editingMemoText, memos, persist]);

  const requestDeleteMemo = useCallback(
    async (id: number) => {
      const confirmed = await confirmDelete({
        title: "메모를 삭제할까요?",
        message: "삭제한 메모는 복구할 수 없습니다.",
      });
      if (!confirmed) return;
      const next = memos.filter((memo) => memo.id !== id);
      persist(next);
    },
    [confirmDelete, memos, persist]
  );

  return {
    memos,
    newMemo,
    setNewMemo,
    editingMemoId,
    editingMemoText,
    setEditingMemoText,
    addMemo,
    beginEditMemo,
    cancelEditMemo,
    saveEditMemo,
    requestDeleteMemo,
  };
}
