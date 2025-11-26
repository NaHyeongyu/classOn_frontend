import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteStudent, getStudentPaymentInfo, type StudentPaymentInfo } from "@/api/students";
import { useToast } from "@/components/common/Toast";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import { readableError } from "@/lib/errors";
import { useStudentInfo } from "@/features/studentDetail/useStudentInfo";
import { useStudentMemos } from "@/features/studentDetail/useStudentMemos";
import { useStudentAttendance } from "@/features/studentDetail/useStudentAttendance";
import { useStudentGrades } from "@/features/studentDetail/useStudentGrades";
import { useStudentCounsels } from "@/features/studentDetail/useStudentCounsels";

export type TabKey = "courses" | "attendance" | "counsels" | "grades";

type ConfirmDialogResult = {
  dialog: ReactNode;
  confirm: ReturnType<typeof useConfirmDialog>["confirm"];
};

function useDeleteConfirmDialog(): ConfirmDialogResult {
  const { confirm, dialog } = useConfirmDialog({
    confirmLabel: "삭제",
    cancelLabel: "취소",
    tone: "danger",
  });
  return { confirm, dialog };
}

export type StudentDetailPageState = {
  numericId: number | null;
  loading: boolean;
  studentError: string | null;
  student: ReturnType<typeof useStudentInfo>["student"];
  intlAge?: number;
  deleting: boolean;
  editHref: string;
  activeTab: TabKey;
  coursesCount: number;
  onSelectTab: (tab: TabKey) => void;
  onOpenCourse: (courseId: number) => void;
  onDeleteStudent: () => Promise<void>;
  memos: ReturnType<typeof useStudentMemos>;
  attendance: ReturnType<typeof useStudentAttendance>;
  grades: ReturnType<typeof useStudentGrades>;
  counsels: ReturnType<typeof useStudentCounsels> & {
    tabError: string | null;
    handleProtectedCloseAddModal: () => void;
  };
  payments: {
    data: StudentPaymentInfo | null;
    loading: boolean;
    error: string | null;
    refresh: () => void;
  };
  deleteConfirmDialog: ReactNode;
};

export function useStudentDetailPage(): StudentDetailPageState {
  const navigate = useNavigate();
  const { id, tab: tabParam } = useParams();
  const numericId = useMemo(() => {
    const value = Number(id);
    return Number.isFinite(value) ? value : null;
  }, [id]);

  const { error: showError, success: showSuccess } = useToast();
  const { confirm: confirmDelete, dialog: deleteConfirmDialog } =
    useDeleteConfirmDialog();

  const {
    student,
    loading,
    error: studentError,
    intlAge,
  } = useStudentInfo({ studentId: numericId });

  const memos = useStudentMemos({
    studentId: numericId,
    confirmDelete: confirmDelete,
  });

  const activeTab: TabKey = useMemo(() => {
    switch (tabParam) {
      case "courses":
      case "attendance":
      case "counsels":
      case "grades":
        return tabParam;
      default:
        return "courses";
    }
  }, [tabParam]);

  const attendance = useStudentAttendance({
    studentId: numericId,
    enabled: activeTab === "attendance",
  });

  const grades = useStudentGrades({
    studentId: numericId,
    courses: student?.courses,
    enabled: activeTab === "grades",
  });

  const counsels = useStudentCounsels({
    studentId: numericId,
    studentName: student?.name,
    enabled: activeTab === "counsels",
    onToastError: showError,
  });

  const paymentsQuery = useQuery({
    queryKey: ["students", numericId, "payments"],
    enabled: Boolean(numericId),
    queryFn: () => {
      if (!numericId) throw new Error("학생 ID가 필요합니다.");
      return getStudentPaymentInfo(numericId);
    },
    staleTime: 30_000,
  });

  const [deleting, setDeleting] = useState(false);

  async function onDeleteStudent() {
    if (!numericId) return;
    const targetName = student?.name?.trim();
    const confirmed = await confirmDelete({
      title: "원생을 삭제할까요?",
      message: targetName
        ? `'${targetName}' 원생의 데이터를 삭제합니다. 되돌릴 수 없습니다.`
        : "선택한 원생의 데이터를 삭제합니다. 되돌릴 수 없습니다.",
    });
    if (!confirmed) return;
    setDeleting(true);
    try {
      await deleteStudent(numericId);
      showSuccess("원생을 삭제했습니다.");
      navigate("/students");
    } catch (err) {
      showError(readableError(err, "원생 삭제에 실패했습니다."));
      setDeleting(false);
    }
  }

  const handleSelectTab = (tab: TabKey) => {
    if (!numericId) return;
    navigate(`/students/${numericId}/${tab}`);
  };

  const handleOpenCourse = (courseId: number) => {
    navigate(`/classes/${courseId}`);
  };

  const handleProtectedCloseAddModal = () => {
    if (counsels.addForm.submitting) return;
    counsels.closeAddModal();
  };

  const counselTabError =
    counsels.listError || counsels.editState.formError || null;

  const paymentError =
    paymentsQuery.error && numericId
      ? paymentsQuery.error instanceof Error
        ? paymentsQuery.error.message
        : "결제 정보를 불러오지 못했습니다."
      : null;

  const paymentsLoading = paymentsQuery.status === "pending" && Boolean(numericId);

  return {
    numericId,
    loading,
    studentError,
    student,
    intlAge,
    deleting,
    editHref: numericId ? `/students/${numericId}/edit` : "/students",
    activeTab,
    coursesCount: student?.courses?.length ?? 0,
    onSelectTab: handleSelectTab,
    onOpenCourse: handleOpenCourse,
    onDeleteStudent,
    memos,
    attendance,
    grades,
    counsels: {
      ...counsels,
      tabError: counselTabError,
      handleProtectedCloseAddModal,
    },
    payments: {
      data: paymentsQuery.data ?? null,
      loading: paymentsLoading,
      error: paymentError,
      refresh: () => {
        void paymentsQuery.refetch();
      },
    },
    deleteConfirmDialog,
  };
}
