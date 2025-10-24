import ConfirmDialog from "@/components/common/ConfirmDialog";
import type { StudentDetailPageState } from "@/features/studentDetail/hooks/useStudentDetailPage";

type StudentCounselDeleteDialogProps = {
  confirmDialog: StudentDetailPageState["counsels"]["confirmDialog"];
};

export function StudentCounselDeleteDialog({
  confirmDialog,
}: StudentCounselDeleteDialogProps) {
  return (
    <ConfirmDialog
      open={confirmDialog.open}
      title="상담 일정 삭제"
      message="이 상담 일정을 삭제하시겠어요? 되돌릴 수 없습니다."
      confirmLabel="삭제"
      cancelLabel="취소"
      tone="danger"
      busy={confirmDialog.busy}
      onCancel={confirmDialog.onCancel}
      onConfirm={confirmDialog.onConfirm}
    />
  );
}
