import { useCallback, useMemo, useState } from "react";
import { useToast } from "@/components/common/Toast";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import { deleteCourse } from "@/api/courses";
import { readableError } from "@/lib/errors";
import { useCourseDetail } from "@/features/courseDetail/useCourseDetail";
import { useCourseExams } from "@/features/courseDetail/useCourseExams";
import { formatDateKey } from "@/features/courseDetail/utils";
import { paths, routes } from "@/routes";

export type UseCourseDetailPageOptions = {
  courseId: number | null;
  onDeleted?: () => void;
};

export function useCourseDetailPage({ courseId, onDeleted }: UseCourseDetailPageOptions) {
  const { error: showError, success } = useToast();
  const { confirm: confirmDanger, dialog: confirmDangerDialog } = useConfirmDialog({
    confirmLabel: "삭제",
    cancelLabel: "취소",
    tone: "danger",
  });

  const {
    course,
    loading,
    error: courseError,
    students,
    stuLoading,
    stuError,
    filterYear,
    onChangeYear,
    filterMonth,
    onChangeMonth,
    resetFilters,
    exportingRecords,
    onExportRecords,
    history,
    info,
    totalStudents,
    capacity,
    completedCount,
    progressPct,
    avgAttendance,
    getAttendanceMap,
  } = useCourseDetail({ courseId, onError: showError });

  const courseExams = useCourseExams({
    courseId,
    confirmDanger,
    onSuccess: success,
    onError: showError,
  });

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [confirmDeleteBusy, setConfirmDeleteBusy] = useState(false);
 const [collapsedList, setCollapsedList] = useState(false);

  const todayHref = useMemo(() => {
    if (!courseId) return routes.classes;
    return paths.classes.historyDate(courseId, formatDateKey(new Date()));
  }, [courseId]);

  const detailHrefFor = useCallback(
    (recordId?: number, date?: Date) => {
      if (!courseId) return routes.classes;
      if (recordId != null) {
        return paths.classes.historyRecord(courseId, recordId);
      }
      const target = date ?? new Date();
      return paths.classes.historyDate(courseId, formatDateKey(target));
    },
    [courseId],
  );

  const editHref = useMemo(() => (courseId ? paths.classes.edit(courseId) : routes.classes), [courseId]);
  const editStudentsHref = useMemo(() => (courseId ? paths.classes.editStudents(courseId) : routes.classes), [courseId]);

  const openDeleteDialog = useCallback(() => {
    setConfirmDeleteOpen(true);
  }, []);

  const cancelDelete = useCallback(() => {
    if (!confirmDeleteBusy) {
      setConfirmDeleteOpen(false);
    }
  }, [confirmDeleteBusy]);

  const confirmDeleteCourse = useCallback(async () => {
    if (!courseId) return;
    setConfirmDeleteBusy(true);
    try {
      await deleteCourse(courseId);
      setConfirmDeleteOpen(false);
      onDeleted?.();
    } catch (error) {
      showError(readableError(error, "삭제에 실패했습니다."));
    } finally {
      setConfirmDeleteBusy(false);
    }
  }, [courseId, onDeleted, showError]);

  const toggleCollapsed = useCallback(() => {
    setCollapsedList((prev) => !prev);
  }, []);

  return {
    confirmDangerDialog,
    confirmDelete: {
      open: confirmDeleteOpen,
      busy: confirmDeleteBusy,
      onCancel: cancelDelete,
      onConfirm: confirmDeleteCourse,
      onRequest: openDeleteDialog,
    },
    header: {
      title: course?.title,
      editHref,
      editStudentsHref,
      showDelete: Boolean(courseId),
    },
    courseMeta: {
      loading,
      error: courseError,
    },
    kpis: {
      totalStudents,
      capacity,
      avgAttendance,
      completedCount,
      progressPct,
    },
    info,
    course,
    students: {
      list: students,
      loading: stuLoading,
      error: stuError,
    },
    exams: courseExams,
    records: {
      history,
      filterYear,
      onChangeYear,
      filterMonth,
      onChangeMonth,
      onResetFilters: resetFilters,
      exporting: exportingRecords,
      onExport: onExportRecords,
      collapsed: collapsedList,
      onToggleCollapsed: toggleCollapsed,
      todayHref,
      detailHrefFor,
      getAttendanceMap,
    },
  } as const;
}
