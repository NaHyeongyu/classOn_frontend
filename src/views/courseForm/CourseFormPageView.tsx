import type { FormEvent } from "react";
import {
  AlertError,
  AlertOk,
  BackButton,
  CourseFormSkeleton,
  Form as FormRoot,
  Header,
  NavButton,
  Page,
  PrimaryAction,
  StepChip,
  StepFooter,
  Stepper,
} from "@/components/courseForm/CourseForm.styles";
import {
  CourseFormBasicStep,
  CourseFormScheduleStep,
  CourseFormDetailsStep,
} from "@/components/courseForm/CourseFormSteps";
import type {
  CourseFormStepMeta,
  FormState,
  StudentOption,
} from "@/components/courseForm/courseFormTypes";
import {
  DAY_OPTIONS,
  HOUR_OPTIONS,
  MINUTE_OPTIONS,
  formatNumberKR,
  hasDay,
} from "@/components/courseForm/courseFormHelpers";

const leftIcon = (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

type CourseFormPageViewProps = {
  isEdit: boolean;
  onBack: () => void;
  steps: ReadonlyArray<CourseFormStepMeta>;
  step: number;
  setStep: (index: number) => void;
  isLastStep: boolean;
  form: FormState;
  setForm: (updater: (prev: FormState) => FormState) => void;
  toggleDay: (day: import("@/components/courseForm/courseFormHelpers").DayKey, next: boolean) => void;
  recurring: boolean;
  setRecurring: (value: boolean) => void;
  studentLoading: boolean;
  studentError: string | null;
  studentFilter: string;
  setStudentFilter: (value: string) => void;
  filteredStudents: StudentOption[];
  fieldErrors: {
    title?: string;
    schedule?: string;
    student?: string;
  };
  setFieldErrors: (updater: (prev: { title?: string; schedule?: string; student?: string }) => { title?: string; schedule?: string; student?: string }) => void;
  feeInput: string;
  setFeeInput: (value: string) => void;
  loading: boolean;
  saving: boolean;
  error: string | null;
  success: string | null;
  goNext: () => void;
  goPrev: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onSelectStudent: (student: StudentOption) => void;
  navigateEditStudents: () => void;
};

export function CourseFormPageView({
  isEdit,
  onBack,
  steps,
  step,
  setStep,
  isLastStep,
  form,
  setForm,
  toggleDay,
  recurring,
  setRecurring,
  studentLoading,
  studentError,
  studentFilter,
  setStudentFilter,
  filteredStudents,
  fieldErrors,
  setFieldErrors,
  feeInput,
  setFeeInput,
  loading,
  saving,
  error,
  success,
  goNext,
  goPrev,
  onSubmit,
  onSelectStudent,
  navigateEditStudents,
}: CourseFormPageViewProps) {
  const isIndividual = form.courseType === "INDIVIDUAL";

  return (
    <Page>
      <Header>
        <BackButton type="button" onClick={onBack}>
          {leftIcon} 뒤로
        </BackButton>
        <h2>{isEdit ? "수업 수정" : "수업 추가하기"}</h2>
      </Header>
      {error ? <AlertError>{error}</AlertError> : null}
      {success ? <AlertOk>{success}</AlertOk> : null}
      {loading ? (
        <CourseFormSkeleton />
      ) : (
        <FormRoot id="course-form" onSubmit={onSubmit}>
          <Stepper>
            {steps.map((meta, index) => {
              const canClick = index < step;
              return (
                <StepChip
                  key={meta.key}
                  type="button"
                  data-active={index === step}
                  data-done={index < step}
                  disabled={!canClick}
                  onClick={() => {
                    if (!canClick) return;
                    setStep(index);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  <span className="index">{index + 1}</span>
                  <span className="label">{meta.title}</span>
                </StepChip>
              );
            })}
          </Stepper>

          {step === 0 ? (
            <CourseFormBasicStep
              form={form}
              setForm={setForm}
              fieldErr={fieldErrors}
              setFieldErr={setFieldErrors}
              courseTypeOptions={[
                {
                  value: "INDIVIDUAL",
                  label: "개인 수업",
                  description: "1명의 학생과 진행되는 1:1 수업",
                },
                {
                  value: "GROUP",
                  label: "단체 수업",
                  description: "여러 학생이 함께 참여하는 그룹 수업",
                },
              ]}
              meta={steps[0]}
            />
          ) : null}

          {step === 1 ? (
            <CourseFormScheduleStep
              form={form}
              setForm={setForm}
              fieldErr={fieldErrors}
              setFieldErr={setFieldErrors}
              meta={steps[1]}
              isIndividual={isIndividual}
              studentFilter={studentFilter}
              setStudentFilter={setStudentFilter}
              studentLoading={studentLoading}
              studentError={studentError}
              filteredStudents={filteredStudents}
              onSelectStudent={onSelectStudent}
              recurring={recurring}
              setRecurring={setRecurring}
              dayOptions={DAY_OPTIONS}
              hasDay={hasDay}
              toggleDay={toggleDay}
              minuteOptions={MINUTE_OPTIONS}
              hourOptions={HOUR_OPTIONS}
            />
          ) : null}

          {step === 2 ? (
            <CourseFormDetailsStep
              form={form}
              setForm={setForm}
              meta={steps[2]}
              feeInput={feeInput}
              setFeeInput={setFeeInput}
              formatNumberKR={formatNumberKR}
              isIndividual={isIndividual}
              isEdit={isEdit}
              onNavigateEditStudents={navigateEditStudents}
            />
          ) : null}

          <StepFooter>
            {step > 0 ? (
              <NavButton type="button" onClick={goPrev}>
                이전 단계
              </NavButton>
            ) : (
              <span />
            )}
            {!isLastStep ? (
              <PrimaryAction type="button" onClick={goNext}>
                다음 단계
              </PrimaryAction>
            ) : (
              <PrimaryAction type="submit" disabled={saving}>
                {saving ? "저장 중..." : isEdit ? "수업 수정 완료" : "수업 저장"}
              </PrimaryAction>
            )}
          </StepFooter>
        </FormRoot>
      )}
    </Page>
  );
}
