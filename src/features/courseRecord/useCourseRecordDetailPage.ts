import { useCallback, useEffect, useMemo, useState } from "react";
import { useToast } from "@/components/common/Toast";
import { deleteCourseRecord } from "@/api/courses";
import { invalidateCacheByPrefix } from "@/lib/fetcher";
import { readableError } from "@/lib/errors";
import { useCourseRecordData } from "@/features/courseRecord/useCourseRecordData";
import { useCourseRecordEditor } from "@/features/courseRecord/useCourseRecordEditor";
import { useCourseRecordAttendance } from "@/features/courseRecord/useCourseRecordAttendance";
import { useCourseRecordAttachments } from "@/features/courseRecord/useCourseRecordAttachments";
import { useCourseRecordGrades } from "@/features/courseRecord/useCourseRecordGrades";
import type { CourseRecordAttendanceProps, CourseRecordGradesPanelProps } from "@/components/courseRecord/CourseRecordRightPanel";

const GRADE_AUTO_SAVE_DELAY = 1000;

export type UseCourseRecordDetailPageOptions = {
  courseId: number | null;
  recordId: number | null;
  ymd?: string;
  searchParams: URLSearchParams;
};

export function useCourseRecordDetailPage({ courseId, recordId, ymd, searchParams }: UseCourseRecordDetailPageOptions) {
  const { error: showError } = useToast();

  const {
    course,
    record,
    setRecord,
    students,
    loading,
    error,
  } = useCourseRecordData({ courseId, recId: recordId, ymd });

  const editor = useCourseRecordEditor({
    courseId,
    course,
    record,
    setRecord,
    ymd,
    showError,
  });

  const attendance = useCourseRecordAttendance({
    courseId,
    record,
    students,
    ymd,
    showError,
  });

  const MAX_FILE_SIZE_MB = 5;
  const attachments = useCourseRecordAttachments({
    courseId,
    recordId,
    recId: recordId,
    ymd,
    maxFileSizeMB: MAX_FILE_SIZE_MB,
    allowedMime: new Set([
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ]),
    showError,
  });

  const grades = useCourseRecordGrades({
    courseId,
    record,
    ymd,
    searchParams,
    showError,
  });
  const {
    setExamModalView,
    setExamModalOpen,
    setExamFormError,
    handleDeleteSelectedExam,
    gradeMap,
    examResultsMap,
    gradeSaving,
    hasGradeChanges,
    gradeAutoSaveTimerRef,
    saveScoresForPresent,
    examCreateOk,
    examLoading,
    selectedExamId,
    exams,
    selectedExam,
  } = grades;

  const [rightTab, setRightTab] = useState<"attendance" | "grades">("attendance");
  const [gradeView, setGradeView] = useState<"intro" | "list" | "scores">("intro");

  // 시험 개수에 따라 초기 뷰만 조정하고,
  // 실제 성적 입력 화면으로 전환은 모달에서 "선택" 버튼을 눌렀을 때만 이루어지도록 합니다.
  useEffect(() => {
    if (exams.length === 0 && gradeView !== "intro") {
      setGradeView("intro");
    }
  }, [exams.length, gradeView]);

  const scoreStudents = useMemo(
    () =>
      attendance.attendanceRows
        .filter((row) => !row.isExtra)
        .map((row) => ({ id: row.id, name: row.name })),
    [attendance.attendanceRows],
  );

  useEffect(() => {
    if (!selectedExam) return;
    if (!hasGradeChanges) return;
    if (gradeSaving) return;
    if (scoreStudents.length === 0) return;
    if (gradeAutoSaveTimerRef.current) {
      window.clearTimeout(gradeAutoSaveTimerRef.current);
    }
    gradeAutoSaveTimerRef.current = window.setTimeout(() => {
      gradeAutoSaveTimerRef.current = null;
      void saveScoresForPresent();
    }, GRADE_AUTO_SAVE_DELAY);
    return () => {
      if (gradeAutoSaveTimerRef.current) {
        window.clearTimeout(gradeAutoSaveTimerRef.current);
        gradeAutoSaveTimerRef.current = null;
      }
    };
  }, [gradeAutoSaveTimerRef, gradeSaving, hasGradeChanges, saveScoresForPresent, scoreStudents.length, selectedExam]);

  // 저장된 시험이 있으면 바로 성적 입력 뷰로 전환해 다시 들어와도 보이게 한다.
  useEffect(() => {
    if (selectedExam && gradeView !== "scores") {
      setGradeView("scores");
    }
  }, [gradeView, selectedExam]);

  const actionableCount = attendance.actionableRows.filter((row) => row.status !== "present").length;
  const filteredAttendanceRows = attendance.attendanceRows;

  const handleBulkAllPresent = useCallback(() => {
    if (!attendance.bulkStatus && !attendance.attLoading && actionableCount > 0) {
      void attendance.bulkSetAttendance(true);
    }
  }, [attendance, actionableCount]);

  const handleOpenBulkSelect = useCallback(() => {
    if (!attendance.bulkStatus && !attendance.attLoading && actionableCount > 0) {
      attendance.openBulkSelect();
    }
  }, [attendance, actionableCount]);

  const handleOpenExamSelect = useCallback(() => {
    setExamModalView("list");
    setExamFormError(null);
    setExamModalOpen(true);
  }, [setExamFormError, setExamModalOpen, setExamModalView]);

  const handleDeleteExam = useCallback(async () => {
    const removed = await handleDeleteSelectedExam();
    if (removed) {
      setGradeView("list");
    }
  }, [handleDeleteSelectedExam]);

  const attendancePanelProps: CourseRecordAttendanceProps = {
    recordId: record?.id ?? null,
    rows: filteredAttendanceRows,
    attLoading: attendance.attLoading,
    attError: attendance.attError,
    attSavingMap: attendance.attSavingMap,
    bulkStatus: attendance.bulkStatus,
    actionableRows: attendance.actionableRows,
    selectedIds: attendance.selectedIds,
    setSelectedIds: attendance.setSelectedIds,
    selectedCount: attendance.selectedCount,
    bulkDialogOpen: attendance.bulkDialogOpen,
    cancelBulkDialog: attendance.cancelBulkDialog,
    confirmBulkSelection: attendance.confirmBulkSelection,
    attNoteMap: attendance.attNoteMap,
    updateNote: attendance.updateNote,
    clearAttendanceLocal: attendance.clearAttendanceLocal,
    confirmOne: attendance.confirmOne,
    setConfirmOne: attendance.setConfirmOne,
    promptSetAttendance: attendance.promptSetAttendance,
    confirmAndSetAttendance: attendance.confirmAndSetAttendance,
    students,
    showLocalHint: !record?.id,
  };

  const gradesPanelProps: CourseRecordGradesPanelProps = {
    gradeView,
    setGradeView,
    scoreStudents,
    grades,
    openExamModal: handleOpenExamSelect,
    closeExamModal: () => setExamModalOpen(false),
  };

  const attendanceCounts = attendance.attendanceBuckets;
  const actionableTotal = attendanceCounts.total;
  const summaryRate = attendance.attendanceRate ?? (actionableTotal ? Math.round((attendanceCounts.present / actionableTotal) * 100) : null);
  const presentShare = actionableTotal ? Math.round((attendanceCounts.present / actionableTotal) * 100) : 0;
  const absentShare = actionableTotal ? Math.round((attendanceCounts.absent / actionableTotal) * 100) : 0;
  const noneShare = actionableTotal ? Math.round((attendanceCounts.none / actionableTotal) * 100) : 0;

  const headLoading = loading && !course;
  const statsLoading = loading && attendance.actionableRows.length === 0;

  const deleteRecord = useCallback(async () => {
    if (!courseId || !record?.id) return false;
    try {
      await deleteCourseRecord(courseId, record.id);
      invalidateCacheByPrefix([
        "/api/calendar/classes",
        "/api/calendar/classes-range",
        `/api/courses/${courseId}`,
        `/api/courses/${courseId}/records`,
      ]);
      return true;
    } catch (err) {
      showError(readableError(err, "삭제에 실패했습니다."));
      return false;
    }
  }, [courseId, record?.id, showError]);

  return {
    course,
    record,
    loading,
    error,
    editor,
    attendance,
    attachments,
    maxFileSizeMb: MAX_FILE_SIZE_MB,
    grades,
    rightTab,
    setRightTab,
    attendancePanelProps,
    gradesPanelProps,
    attendanceMeta: {
      actionableCount,
      onBulkAllPresent: handleBulkAllPresent,
      onOpenBulkSelect: handleOpenBulkSelect,
    },
    gradesMeta: {
      examCreateOk,
      selectedExamId: selectedExamId ? Number(selectedExamId) : null,
      examLoading,
      onOpenExamModal: handleOpenExamSelect,
      onDeleteExam: handleDeleteExam,
    },
    stats: {
      loading: statsLoading,
      summaryRate,
      actionableTotal,
      actionablePresent: attendanceCounts.present,
      actionableAbsent: attendanceCounts.absent,
      actionableNone: attendanceCounts.none,
      presentShare,
      absentShare,
      noneShare,
    },
    headLoading,
    deleteRecord,
  } as const;
}
