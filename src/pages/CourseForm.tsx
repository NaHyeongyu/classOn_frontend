import { useNavigate } from "react-router-dom";
import { CourseFormPageView } from "@/views/courseForm/CourseFormPageView";
import { useCourseFormPage } from "@/features/courseForm/useCourseFormPage";
import { routes } from "@/routes";

export default function CourseForm() {
  const navigate = useNavigate();
  const state = useCourseFormPage();
  if (state.isTeacher && !state.isEdit) {
    // Teachers cannot open the create course form
    navigate(routes.classes, { replace: true });
    return null;
  }

  return (
    <CourseFormPageView
      isEdit={state.isEdit}
      onBack={() => navigate(routes.classes)}
      isTeacher={state.isTeacher}
      steps={state.steps}
      form={state.form}
      setForm={state.setForm}
      toggleDay={state.accordionToggle}
      recurring={state.recurring}
      setRecurring={state.setRecurring}
      studentLoading={state.studentLoading}
      studentError={state.studentError}
      studentFilter={state.studentFilter}
      setStudentFilter={state.setStudentFilter}
      filteredStudents={state.filteredStudents}
      teacherOptions={state.teacherOptions}
      teacherLoading={state.teacherLoading}
      teacherError={state.teacherError}
      fieldErrors={state.fieldErrors}
      setFieldErrors={state.setFieldErrors}
      feeInput={state.feeInput}
      setFeeInput={state.setFeeInput}
      loading={state.loading}
      saving={state.saving}
      error={state.error}
      success={state.success}
      onSubmit={state.submit}
      onSelectStudent={state.onSelectStudent}
      navigateEditStudents={state.navigateEditStudents}
      feeChangeNotice={state.feeChangeNotice}
      onCloseFeeChangeNotice={state.onCloseFeeChangeNotice}
    />
  );
}
