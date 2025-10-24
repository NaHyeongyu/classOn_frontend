import { useCallback, useEffect, useState } from "react";

type UseStudentNotesOptions = {
  studentId: number | null;
};

type UseStudentNotesResult = {
  notes: string;
  notesInput: string;
  editing: boolean;
  setNotesInput: (value: string) => void;
  startEditing: () => void;
  cancelEditing: () => void;
  save: () => void;
};

export function useStudentNotes({
  studentId,
}: UseStudentNotesOptions): UseStudentNotesResult {
  const [notes, setNotes] = useState("");
  const [notesInput, setNotesInput] = useState("");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!studentId) {
      setNotes("");
      setNotesInput("");
      setEditing(false);
      return;
    }
    try {
      const saved = localStorage.getItem(`student:notes:${studentId}`) || "";
      setNotes(saved);
      setNotesInput(saved);
    } catch {
      setNotes("");
      setNotesInput("");
    }
  }, [studentId]);

  const startEditing = useCallback(() => {
    setNotesInput(notes);
    setEditing(true);
  }, [notes]);

  const cancelEditing = useCallback(() => {
    setNotesInput(notes);
    setEditing(false);
  }, [notes]);

  const save = useCallback(() => {
    if (!studentId) return;
    const text = (notesInput || "").trim();
    setNotes(text);
    setEditing(false);
    try {
      localStorage.setItem(`student:notes:${studentId}`, text);
    } catch {
      // ignore storage errors
    }
  }, [notesInput, studentId]);

  return {
    notes,
    notesInput,
    editing,
    setNotesInput,
    startEditing,
    cancelEditing,
    save,
  };
}
