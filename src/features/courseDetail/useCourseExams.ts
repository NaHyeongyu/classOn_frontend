import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  createExam,
  deleteExam,
  listExams,
  updateExam,
  type Exam,
} from "@/api/exams";
import { readableError } from "@/lib/errors";

type ConfirmFn = (options: {
  title?: string;
  message?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "default" | "danger";
  hideCancel?: boolean;
}) => Promise<boolean>;

type UseCourseExamsOptions = {
  courseId: number | null;
  confirmDanger: ConfirmFn;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
};

export type UseCourseExamsResult = {
  exams: Exam[];
  loading: boolean;
  error: string | null;
  modalOpen: boolean;
  modalMode: "create" | "edit";
  examMode: "percent" | "letter";
  examFormError: string | null;
  examSaving: boolean;
  examTitleRef: React.RefObject<HTMLInputElement>;
  onOpenCreate: () => void;
  onOpenEdit: (exam: Exam) => void;
  onCloseModal: () => void;
  onSubmitModal: () => Promise<void>;
  onDeleteExam: (exam: Exam) => Promise<void>;
  onExamModeChange: (mode: "percent" | "letter") => void;
  onExamTitleChange: (value: string) => void;
};

export function useCourseExams({
  courseId,
  confirmDanger,
  onSuccess,
  onError,
}: UseCourseExamsOptions): UseCourseExamsResult {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [examMode, setExamMode] = useState<"percent" | "letter">("percent");
  const [examFormError, setExamFormError] = useState<string | null>(null);
  const [examSaving, setExamSaving] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);

  const examTitleRef = useRef<HTMLInputElement | null>(null);
  const examTitleValueRef = useRef("");

  const refresh = useCallback(async () => {
    if (!courseId) return;
    setLoading(true);
    setError(null);
    try {
      const list = await listExams(courseId);
      setExams(list);
    } catch (err) {
      setError(readableError(err, "시험 목록을 불러오지 못했습니다."));
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const resetForm = useCallback(() => {
    setExamFormError(null);
    setExamMode("percent");
    setModalMode("create");
    setEditingExam(null);
    examTitleValueRef.current = "";
    if (examTitleRef.current) {
      examTitleRef.current.value = "";
    }
  }, []);

  const onOpenCreate = useCallback(() => {
    resetForm();
    setModalOpen(true);
    requestAnimationFrame(() => {
      if (examTitleRef.current) {
        examTitleRef.current.focus();
      }
    });
  }, [resetForm]);

  const onOpenEdit = useCallback((exam: Exam) => {
    setExamFormError(null);
    setModalMode("edit");
    setEditingExam(exam);
    setExamMode(exam.inputMode ?? "percent");
    examTitleValueRef.current = exam.title ?? "";
    setModalOpen(true);
    requestAnimationFrame(() => {
      if (examTitleRef.current) {
        examTitleRef.current.value = exam.title ?? "";
        examTitleRef.current.focus();
        examTitleRef.current.select();
      }
    });
  }, []);

  const onCloseModal = useCallback(() => {
    setModalOpen(false);
    resetForm();
  }, [resetForm]);

  const onSubmitModal = useCallback(async () => {
    if (!courseId || examSaving) return;
    const title = examTitleValueRef.current.trim();
    if (!title) {
      setExamFormError("시험 제목을 입력해주세요.");
      examTitleRef.current?.focus();
      return;
    }
    setExamFormError(null);
    setExamSaving(true);
    try {
      if (modalMode === "edit" && editingExam) {
        await updateExam(courseId, editingExam.id, {
          title,
          inputMode: examMode,
        });
        onSuccess("시험이 수정되었습니다.");
      } else {
        await createExam(courseId, {
          title,
          inputMode: examMode,
          kind: "TEST",
        });
        onSuccess("시험이 생성되었습니다.");
      }
      await refresh();
      onCloseModal();
    } catch (err) {
      onError(
        readableError(
          err,
          modalMode === "edit"
            ? "시험 수정에 실패했습니다."
            : "시험 생성에 실패했습니다."
        )
      );
    } finally {
      setExamSaving(false);
    }
  }, [
    courseId,
    examSaving,
    modalMode,
    editingExam,
    examMode,
    onSuccess,
    onError,
    refresh,
    onCloseModal,
  ]);

  const onDeleteExam = useCallback(
    async (exam: Exam) => {
      if (!courseId) return;
      const confirmed = await confirmDanger({
        title: "시험을 삭제할까요?",
        message: `${
          exam.title || "등록된 시험"
        }과(와) 해당 성적 데이터를 영구 삭제합니다. 되돌릴 수 없습니다.`,
        tone: "danger",
        confirmLabel: "삭제",
      });
      if (!confirmed) return;
      try {
        await deleteExam(courseId, exam.id);
        onSuccess("시험이 삭제되었습니다.");
        await refresh();
      } catch (err) {
        onError(readableError(err, "시험 삭제에 실패했습니다."));
      }
    },
    [confirmDanger, courseId, onSuccess, onError, refresh]
  );

  const onExamModeChange = useCallback((mode: "percent" | "letter") => {
    setExamMode(mode);
  }, []);

  const onExamTitleChange = useCallback((value: string) => {
    examTitleValueRef.current = value;
  }, []);

  return {
    exams,
    loading,
    error,
    modalOpen,
    modalMode,
    examMode,
    examFormError,
    examSaving,
    examTitleRef,
    onOpenCreate,
    onOpenEdit,
    onCloseModal,
    onSubmitModal,
    onDeleteExam,
    onExamModeChange,
    onExamTitleChange,
  };
}
