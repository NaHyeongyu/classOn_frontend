import { formatYMD } from "@/features/calendar/dateUtils";
import { useCalendarDetail } from "@/hooks/useCalendarDetail";
import { useCalendarDetailClasses } from "@/hooks/useCalendarDetailClasses";
import { useCalendarDetailCounsel } from "@/hooks/useCalendarDetailCounsel";
import { useCalendarDetailTodos } from "@/hooks/useCalendarDetailTodos";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import { useToast } from "@/components/common/Toast";

type UseCalendarDetailPageOptions = {
  ymdParam?: string;
};

export function useCalendarDetailPage({ ymdParam }: UseCalendarDetailPageOptions) {
  const { warning } = useToast();
  const { confirm: confirmDelete, dialog: confirmDeleteDialog } = useConfirmDialog({
    confirmLabel: "삭제",
    cancelLabel: "취소",
    tone: "danger",
  });

  const ymdSafe = ymdParam ?? formatYMD(new Date());
  const { label, classes: classesDerived, counsels, prevYMD, nextYMD, todayYMD } =
    useCalendarDetail(ymdSafe);

  const classState = useCalendarDetailClasses({
    ymd: ymdSafe,
    derivedClasses: classesDerived,
    warning,
  });

  const todoState = useCalendarDetailTodos({
    ymd: ymdSafe,
    confirmDelete,
  });

  const counselState = useCalendarDetailCounsel({
    ymd: ymdSafe,
    initialCounsels: counsels,
  });

  const todoErrorMessage = todoState.mutationError || todoState.error || null;

  return {
    label,
    prevYMD,
    nextYMD,
    todayYMD,
    confirmDeleteDialog,
    classState,
    todoState,
    counselState,
    todoErrorMessage,
  };
}
