import styled from "styled-components";
import type { FormEvent } from "react";
import Modal from "@/components/common/Modal";
import { GhostButton } from "@/components/common/UI";
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
  StepFooter,
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
  TeacherOption,
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
  isTeacher: boolean;
  steps: ReadonlyArray<CourseFormStepMeta>;
  form: FormState;
  setForm: (updater: (prev: FormState) => FormState) => void;
  toggleDay: (
    day: import("@/components/courseForm/courseFormHelpers").DayKey,
    next: boolean
  ) => void;
  recurring: boolean;
  setRecurring: (value: boolean) => void;
  studentLoading: boolean;
  studentError: string | null;
  studentFilter: string;
  setStudentFilter: (value: string) => void;
  filteredStudents: StudentOption[];
  teacherOptions: TeacherOption[];
  teacherLoading: boolean;
  teacherError: string | null;
  fieldErrors: {
    title?: string;
    schedule?: string;
    student?: string;
    instructor?: string;
  };
  setFieldErrors: (
    updater: (prev: {
      title?: string;
      schedule?: string;
      student?: string;
      instructor?: string;
    }) => {
      title?: string;
      schedule?: string;
      student?: string;
      instructor?: string;
    }
  ) => void;
  feeInput: string;
  setFeeInput: (value: string) => void;
  loading: boolean;
  saving: boolean;
  error: string | null;
  success: string | null;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onSelectStudent: (student: StudentOption) => void;
  navigateEditStudents: () => void;
  feeChangeNotice: string | null;
  onCloseFeeChangeNotice: () => void;
};

export function CourseFormPageView({
  isEdit,
  onBack,
  isTeacher,
  steps,
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
  teacherOptions,
  teacherLoading,
  teacherError,
  fieldErrors,
  setFieldErrors,
  feeInput,
  setFeeInput,
  loading,
  saving,
  error,
  success,
  onSubmit,
  onSelectStudent,
  navigateEditStudents,
  feeChangeNotice,
  onCloseFeeChangeNotice,
}: CourseFormPageViewProps) {
  const isIndividual = form.courseType === "INDIVIDUAL";
  return (
    <Page>
      <Modal
        open={Boolean(feeChangeNotice)}
        onClose={onCloseFeeChangeNotice}
        title="청구서 확인 안내"
      >
        <FeeNoticeBody>
          {feeChangeNotice ??
            "수강료가 변경되어 학생 청구서에 자동으로 반영되었습니다.\n청구서 발송 전에 금액을 다시 확인해 주세요."}
        </FeeNoticeBody>
        <FeeModalActions>
          <GhostButton type="button" onClick={onCloseFeeChangeNotice}>
            확인했습니다
          </GhostButton>
        </FeeModalActions>
      </Modal>
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
          <Sections>
            <CourseFormBasicStep
              form={form}
              setForm={setForm}
              fieldErr={fieldErrors}
              setFieldErr={setFieldErrors}
              teacherOptions={teacherOptions}
              teacherLoading={teacherLoading}
              teacherError={teacherError}
              isTeacher={isTeacher}
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
          </Sections>

          <StepFooter>
            <NavButton type="button" onClick={onBack}>
              취소
            </NavButton>
            <PrimaryAction type="submit" disabled={saving}>
              {saving ? "저장 중..." : isEdit ? "수업 수정 완료" : "수업 저장"}
            </PrimaryAction>
          </StepFooter>
        </FormRoot>
      )}
    </Page>
  );
}

const Sections = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  align-items: start;
`;

const FeeNoticeBody = styled.p`
  font-size: 16px;
  line-height: 1.7;
  margin: 0;
  white-space: pre-wrap;
`;

const FeeModalActions = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: center;
`;
