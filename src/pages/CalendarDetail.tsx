// 일정 상세 페이지: 날짜별 수업, 상담, 할 일 관리를 한 화면에서 처리합니다.
import { useNavigate, useParams } from "react-router-dom";
import CalendarDetailPageView from "@/views/calendar/detail/CalendarDetailPageView";
import { useCalendarDetailPage } from "@/features/calendar/useCalendarDetailPage";
import { useAuth } from "@/hooks/useAuth";
import { useCalendarPaymentList } from "@/features/calendar/useCalendarPaymentList";

export default function CalendarDetail() {
  const navigate = useNavigate();
  const { ymd } = useParams();
  const { user } = useAuth();
  const isTeacher = (user?.role ?? "").toString().toUpperCase() === "TEACHER";
  const {
    label,
    prevYMD,
    nextYMD,
    todayYMD,
    confirmDeleteDialog,
    classState,
    todoState,
    counselState,
    todoErrorMessage,
  } = useCalendarDetailPage({ ymdParam: ymd });

  const handleBack = () => navigate("/calendar");
  const handlePrev = () => navigate(`/calendar/${prevYMD()}`);
  const handleNext = () => navigate(`/calendar/${nextYMD()}`);
  const handleToday = () => navigate(`/calendar/${todayYMD()}`);
  const handleCounselDetail = (studentId: number) => navigate(`/students/${studentId}/counsels`);

  const paymentList = useCalendarPaymentList();

  return (
    <>
      <CalendarDetailPageView
        confirmDialog={confirmDeleteDialog}
        header={{
          label,
          onBack: handleBack,
          onPrev: handlePrev,
          onNext: handleNext,
          onToday: handleToday,
        }}
        todoList={{
          inProgress: todoState.inProgress,
          done: todoState.done,
          onAdd: todoState.onAdd,
          onDelete: todoState.onDelete,
          onEdit: todoState.onEdit,
        }}
        counselList={{
          items: counselState.items,
          onAdd: counselState.onAddCounsel,
          onDetail: handleCounselDetail,
        }}
        classList={{
          items: classState.classes,
          onAdd: isTeacher ? undefined : classState.onAddClass,
        }}
        paymentPanel={{
          rows: paymentList.rows,
          loading: paymentList.isLoading,
          error: paymentList.error,
          onMore: () => navigate("/payments"),
        }}
        todoModal={{
          open: todoState.open,
          editingId: todoState.editingId,
          formTitle: todoState.formTitle,
          formNotes: todoState.formNotes,
          todoErr: todoState.todoErr,
          onClose: todoState.onCloseModal,
          onSubmit: todoState.onSubmit,
          onChangeTitle: todoState.onChangeTitle,
          onChangeNotes: todoState.onChangeNotes,
        }}
        counselModal={{
          open: counselState.open,
          students: counselState.students,
          studFilter: counselState.studFilter,
          onChangeFilter: counselState.onChangeFilter,
          studBusy: counselState.studBusy,
          studErr: counselState.studErr,
          selStudent: counselState.selStudent,
          onPickStudent: counselState.onPickStudent,
          counselHour: counselState.counselHour,
          counselMin: counselState.counselMin,
          onChangeHour: counselState.onChangeHour,
          onChangeMin: counselState.onChangeMin,
          counselNote: counselState.counselNote,
          onChangeNote: counselState.onChangeNote,
          counselErr: counselState.counselErr,
          onClose: counselState.onCloseCounsel,
          onSave: counselState.onSaveCounsel,
          savingCounsel: counselState.savingCounsel,
          hours24: counselState.hours24,
          mins5: counselState.mins5,
        }}
        classModal={{
          open: classState.addOpen,
          courseRows: classState.courseRows,
          courseFilter: classState.courseFilter,
          onChangeFilter: classState.onChangeCourseFilter,
          courseBusy: classState.courseBusy,
          courseErr: classState.courseErr,
          selectedCourse: classState.selectedCourse,
          onPickCourse: classState.onPickCourse,
          hours24: classState.hours24,
          mins5: classState.mins5,
          startHour: classState.startHour,
          startMin: classState.startMin,
          endHour: classState.endHour,
          endMin: classState.endMin,
          onChangeStartHour: classState.onChangeStartHour,
          onChangeStartMin: classState.onChangeStartMin,
          onChangeEndHour: classState.onChangeEndHour,
          onChangeEndMin: classState.onChangeEndMin,
          addErr: classState.addErr,
          savingClass: classState.savingClass,
          onClose: classState.onCloseClassModal,
          onSave: classState.onSaveClass,
        }}
        todoErrorMessage={todoErrorMessage}
      />
    </>
  );
}
