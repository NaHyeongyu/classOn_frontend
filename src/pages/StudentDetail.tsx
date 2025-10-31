import { StudentDetailPageView } from "@/views/studentDetail/StudentDetailPageView";
import { useStudentDetailPage } from "@/features/studentDetail/hooks/useStudentDetailPage";

export default function StudentDetail() {
  const state = useStudentDetailPage();

  return (
    <StudentDetailPageView
      loading={state.loading}
      studentError={state.studentError}
      student={state.student}
      intlAge={state.intlAge}
      deleting={state.deleting}
      editHref={state.editHref}
      onDeleteStudent={() => void state.onDeleteStudent()}
      memos={state.memos}
      activeTab={state.activeTab}
      onSelectTab={state.onSelectTab}
      coursesCount={state.coursesCount}
      attendance={state.attendance}
      grades={state.grades}
      counsels={state.counsels}
      deleteConfirmDialog={state.deleteConfirmDialog}
      onOpenCourse={state.onOpenCourse}
    />
  );
}
