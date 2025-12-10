import { StudentDetailPageView } from "@/views/studentDetail/StudentDetailPageView";
import { useStudentDetailPage } from "@/features/studentDetail/hooks/useStudentDetailPage";
import { useAuth } from "@/hooks/useAuth";

export default function StudentDetail() {
  const state = useStudentDetailPage();
  const { user } = useAuth();
  const isTeacher = (user?.role ?? "").toString().toUpperCase() === "TEACHER";

  return (
    <StudentDetailPageView
      loading={state.loading}
      studentError={state.studentError}
      student={state.student}
      intlAge={state.intlAge}
      deleting={state.deleting}
      editHref={state.editHref}
      canDelete={!isTeacher}
      onDeleteStudent={() => void state.onDeleteStudent()}
      memos={state.memos}
      activeTab={state.activeTab}
      onSelectTab={state.onSelectTab}
      coursesCount={state.coursesCount}
      attendance={state.attendance}
      grades={state.grades}
      counsels={state.counsels}
      payments={state.payments}
      reports={state.reports}
      deleteConfirmDialog={state.deleteConfirmDialog}
      onOpenCourse={state.onOpenCourse}
    />
  );
}
