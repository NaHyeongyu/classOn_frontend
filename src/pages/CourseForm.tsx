import { useNavigate } from "react-router-dom";
import { CourseFormPageView } from "@/views/courseForm/CourseFormPageView";
import { useCourseFormPage } from "@/features/courseForm/useCourseFormPage";
import { routes } from "@/routes";

export default function CourseForm() {
  const navigate = useNavigate();
  const state = useCourseFormPage();

  return (
    <CourseFormPageView
      isEdit={state.isEdit}
      onBack={() => navigate(routes.classes)}
      steps={state.steps}
      step={state.step}
      setStep={state.setStep}
      isLastStep={state.isLastStep}
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
      fieldErrors={state.fieldErrors}
      setFieldErrors={state.setFieldErrors}
      feeInput={state.feeInput}
      setFeeInput={state.setFeeInput}
      loading={state.loading}
      saving={state.saving}
      error={state.error}
      success={state.success}
      goNext={state.goNext}
      goPrev={state.goPrev}
      onSubmit={state.submit}
      onSelectStudent={state.onSelectStudent}
      navigateEditStudents={state.navigateEditStudents}
    />
  );
}
