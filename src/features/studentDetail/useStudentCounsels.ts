import type { RefObject } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  listCounsels,
  createCounsel,
  updateCounsel,
  deleteCounsel,
  downloadCounselsExcel,
  type Counsel,
} from "@/api/counsels";
import { readableError } from "@/lib/errors";
import {
  defaultCounselDate,
  makeCounselTimestamp,
  makeCounselFilename,
  pad2,
  saveBlobAsFile,
} from "./utils";

type UseStudentCounselsOptions = {
  studentId: number | null;
  studentName?: string;
  enabled: boolean;
  onToastError: (message: string) => void;
};

type ConfirmDialogState = {
  open: boolean;
  busy: boolean;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
};

type UseStudentCounselsResult = {
  counsels: Counsel[];
  loading: boolean;
  listError: string | null;
  exporting: boolean;
  handleExport: () => Promise<void>;
  addModalOpen: boolean;
  openAddModal: () => void;
  closeAddModal: () => void;
  addForm: {
    date: string;
    hour: string;
    minute: string;
    content: string;
    setDate: (value: string) => void;
    setHour: (value: string) => void;
    setMinute: (value: string) => void;
    setContent: (value: string) => void;
    submitting: boolean;
    submit: () => Promise<void>;
    formError: string | null;
    textareaRef: RefObject<HTMLTextAreaElement>;
  };
  editState: {
    editingId: number | null;
    editDate: string;
    editHour: string;
    editMinute: string;
    editContent: string;
    beginEdit: (counsel: Counsel) => void;
    cancelEdit: () => void;
    setEditDate: (value: string) => void;
    setEditHour: (value: string) => void;
    setEditMinute: (value: string) => void;
    setEditContent: (value: string) => void;
    saveEdit: (id: number) => Promise<void>;
    saving: boolean;
    formError: string | null;
  };
  requestDelete: (id: number) => void;
  confirmDialog: ConfirmDialogState;
  hourOptions: string[];
  minuteOptions: string[];
};

export function useStudentCounsels({
  studentId,
  studentName,
  enabled,
  onToastError,
}: UseStudentCounselsOptions): UseStudentCounselsResult {
  const [counsels, setCounsels] = useState<Counsel[]>([]);
  const [loading, setLoading] = useState(false);
  const [listError, setListError] = useState<string | null>(null);

  const [exporting, setExporting] = useState(false);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newDate, setNewDate] = useState(defaultCounselDate);
  const [newHour, setNewHour] = useState("");
  const [newMinute, setNewMinute] = useState("");
  const [newContent, setNewContent] = useState("");
  const [addSubmitting, setAddSubmitting] = useState(false);
  const [addFormError, setAddFormError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDate, setEditDate] = useState("");
  const [editHour, setEditHour] = useState("");
  const [editMinute, setEditMinute] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editSaving, setEditSaving] = useState(false);
  const [editFormError, setEditFormError] = useState<string | null>(null);

  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [confirmBusy, setConfirmBusy] = useState(false);

  const hourOptions = useMemo(
    () => Array.from({ length: 24 }, (_, idx) => pad2(idx)),
    []
  );
  const minuteOptions = useMemo(
    () => ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"],
    []
  );

  const resetEditing = useCallback(() => {
    setEditingId(null);
    setEditDate("");
    setEditHour("");
    setEditMinute("");
    setEditContent("");
    setEditFormError(null);
  }, []);

  const resetAddForm = useCallback(() => {
    setNewDate(defaultCounselDate());
    setNewHour("");
    setNewMinute("");
    setNewContent("");
    setAddFormError(null);
  }, []);

  const load = useCallback(async () => {
    if (!studentId || !enabled) {
      setCounsels([]);
      setListError(null);
      return;
    }
    setLoading(true);
    setListError(null);
    try {
      const res = await listCounsels({ studentId, size: 100 });
      setCounsels(res.content || []);
    } catch (err) {
      setListError(readableError(err, "상담 기록을 불러오지 못했습니다."));
    } finally {
      setLoading(false);
    }
  }, [enabled, studentId]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!addModalOpen) return;
    const handle = requestAnimationFrame(() => {
      const el = textareaRef.current;
      if (el) {
        el.focus();
        const len = el.value.length;
        try {
          el.setSelectionRange(len, len);
        } catch {
          // ignore
        }
      }
    });
    return () => cancelAnimationFrame(handle);
  }, [addModalOpen]);

  useEffect(() => {
    resetEditing();
    resetAddForm();
    setCounsels([]);
    setListError(null);
  }, [studentId, resetEditing, resetAddForm]);

  const openAddModal = useCallback(() => {
    // 기본값: 오늘 날짜 + 현재 시각 반올림(5분)
    setAddModalOpen(true);
    const d = new Date();
    const date = `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
    const hour = pad2(d.getHours());
    const minute = pad2(Math.min(55, Math.ceil(d.getMinutes() / 5) * 5));
    setNewDate(date);
    setNewHour(hour);
    setNewMinute(minute);
    setNewContent("");
    setAddFormError(null);
  }, []);

  const closeAddModal = useCallback(() => {
    if (addSubmitting) return;
    setAddModalOpen(false);
    resetAddForm();
  }, [addSubmitting, resetAddForm]);

  const submit = useCallback(async () => {
    if (!studentId || !newDate || !newHour || !newMinute) return;
    setAddSubmitting(true);
    setAddFormError(null);
    try {
      const iso = makeCounselTimestamp(newDate, newHour, newMinute);
      await createCounsel({
        studentId,
        counselTime: iso,
        content: newContent || undefined,
      });
      await load();
      closeAddModal();
    } catch (err) {
      setAddFormError(readableError(err, "저장에 실패했습니다."));
    } finally {
      setAddSubmitting(false);
    }
  }, [studentId, newDate, newHour, newMinute, newContent, load, closeAddModal]);

  const beginEdit = useCallback((counsel: Counsel) => {
    setEditingId(counsel.id);
    setEditFormError(null);
    try {
      const d = new Date(counsel.counselTime);
      setEditDate(
        `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
      );
      setEditHour(pad2(d.getHours()));
      setEditMinute(pad2(d.getMinutes()));
    } catch {
      setEditDate("");
      setEditHour("");
      setEditMinute("");
    }
    setEditContent(counsel.content || "");
  }, []);

  const saveEdit = useCallback(
    async (id: number) => {
      if (!studentId || !editDate || !editHour || !editMinute) return;
      setEditSaving(true);
      setEditFormError(null);
      try {
        const iso = makeCounselTimestamp(editDate, editHour, editMinute);
        await updateCounsel(id, {
          counselTime: iso,
          content: editContent || undefined,
        });
        await load();
        resetEditing();
      } catch (err) {
        setEditFormError(readableError(err, "수정에 실패했습니다."));
      } finally {
        setEditSaving(false);
      }
    },
    [studentId, editDate, editHour, editMinute, editContent, load, resetEditing]
  );

  const requestDelete = useCallback((id: number) => {
    setConfirmId(id);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!studentId || confirmId == null) return;
    setConfirmBusy(true);
    try {
      await deleteCounsel(confirmId);
      await load();
      setConfirmId(null);
    } catch (err) {
      onToastError(readableError(err, "삭제에 실패했습니다."));
    } finally {
      setConfirmBusy(false);
    }
  }, [confirmId, load, onToastError, studentId]);

  const handleExport = useCallback(async () => {
    if (!studentId) return;
    setExporting(true);
    try {
      const blob = await downloadCounselsExcel({ studentId });
      const filename = makeCounselFilename(studentName, studentId);
      saveBlobAsFile(blob, `${filename}.xlsx`);
    } catch (err) {
      onToastError(readableError(err, "상담 기록 엑셀 추출에 실패했습니다."));
    } finally {
      setExporting(false);
    }
  }, [studentId, studentName, onToastError]);

  const confirmDialog: ConfirmDialogState = {
    open: confirmId != null,
    busy: confirmBusy,
    onCancel: () => {
      if (!confirmBusy) setConfirmId(null);
    },
    onConfirm: handleDelete,
  };

  return {
    counsels,
    loading,
    listError,
    exporting,
    handleExport,
    addModalOpen,
    openAddModal,
    closeAddModal,
    addForm: {
      date: newDate,
      hour: newHour,
      minute: newMinute,
      content: newContent,
      setDate: setNewDate,
      setHour: setNewHour,
      setMinute: setNewMinute,
      setContent: setNewContent,
      submitting: addSubmitting,
      submit,
      formError: addFormError,
      textareaRef,
    },
    editState: {
      editingId,
      editDate,
      editHour,
      editMinute,
      editContent,
      beginEdit,
      cancelEdit: resetEditing,
      setEditDate,
      setEditHour,
      setEditMinute,
      setEditContent,
      saveEdit,
      saving: editSaving,
      formError: editFormError,
    },
    requestDelete,
    confirmDialog,
    hourOptions,
    minuteOptions,
  };
}
