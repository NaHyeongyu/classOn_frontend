import styled from "styled-components";
import type { ReactNode } from "react";
import SelectBox from "@/components/common/SelectBox";
import { useAuth } from "@/hooks/useAuth";
import { useRepresentativeName } from "@/hooks/useRepresentativeName";
import { isMainAccountForTeacher } from "@/lib/users";
import {
  SectionCard as Section,
  GhostButton as UIGhostBtn,
  ToggleSwitch,
} from "@/components/common/UI";
import { Hint } from "@/components/courseRecord/CourseRecordStyles";
import type {
  CourseTypeValue,
  FormState,
  StudentOption,
  TeacherOption,
} from "@/components/courseForm/courseFormTypes";

type FieldErrors = {
  title?: string;
  schedule?: string;
  student?: string;
  instructor?: string;
};

type StepMeta = {
  title: string;
  lead: string;
};

type BasicStepProps = {
  form: FormState;
  setForm: (updater: (prev: FormState) => FormState) => void;
  fieldErr: FieldErrors;
  setFieldErr: (updater: (prev: FieldErrors) => FieldErrors) => void;
  teacherOptions: TeacherOption[];
  teacherLoading: boolean;
  teacherError: string | null;
  isTeacher: boolean;
  courseTypeOptions: Array<{
    value: CourseTypeValue;
    label: string;
    description: string;
  }>;
  meta: StepMeta;
};

export function CourseFormBasicStep({
  form,
  setForm,
  fieldErr,
  setFieldErr,
  teacherOptions,
  teacherLoading,
  teacherError,
  isTeacher,
  courseTypeOptions,
  meta,
}: BasicStepProps) {
  const { user } = useAuth();
  const repName = useRepresentativeName();
  const isMainAccount = (opt?: TeacherOption) => isMainAccountForTeacher(user, opt, repName);
  const selectedIds =
    Array.isArray(form.instructorIds) && form.instructorIds.length
      ? form.instructorIds
      : form.instructorId != null
      ? [form.instructorId]
      : [];
  const selectedTeachers = teacherOptions.filter((opt) =>
    selectedIds.includes(opt.id),
  );
  const primaryTeacher =
    selectedTeachers[0] ||
    teacherOptions.find((opt) => opt.id === form.instructorId);
  const primaryLabel =
    primaryTeacher?.name ||
    primaryTeacher?.username ||
    form.instructorName?.trim() ||
    "";
  const instructorDisplay =
    selectedTeachers.length <= 1
      ? primaryLabel
      : `${primaryLabel} 외 ${selectedTeachers.length - 1}명`;

  return (
    <StepSection meta={meta}>
      <StepGrid>
        <Field>
          <Label>
            수업명<span>*</span>
          </Label>
          <Input
            aria-invalid={!!fieldErr.title}
            value={form.title}
            onChange={(e) => {
              const value = e.target.value;
              setForm((state) => ({ ...state, title: value }));
              if (fieldErr.title) {
                setFieldErr((prev) => ({ ...prev, title: undefined }));
              }
            }}
            placeholder="예: 영어 회화 A반"
          />
          {fieldErr.title ? <FieldErr>{fieldErr.title}</FieldErr> : null}
        </Field>

        <Field style={{ gridColumn: "1 / -1" }}>
          <Label>상태</Label>
          <Select
            ariaLabel="수업 상태"
            placeholder="상태 선택"
            value={form.status}
            onChange={(value) =>
              setForm((state) => ({
                ...state,
                status: (value as FormState["status"]) || "IN_PROGRESS",
              }))
            }
            options={[
              { label: "진행중", value: "IN_PROGRESS" },
              { label: "대기", value: "PENDING" },
              { label: "중단", value: "STOPPED" },
            ]}
          />
        </Field>

        <Field style={{ gridColumn: "1 / -1" }}>
          <Label>담당 강사</Label>
          {isTeacher ? (
            <ReadOnlyField>{instructorDisplay || "본인"}</ReadOnlyField>
          ) : teacherLoading ? (
            <Select
              disabled
              ariaLabel="담당 강사"
              placeholder="강사 목록을 불러오는 중입니다…"
              value=""
              onChange={() => {}}
              options={[]}
            />
          ) : teacherError ? (
            <>
              <Select
                disabled
                aria-invalid={true}
                ariaLabel="담당 강사"
                placeholder="강사 목록을 불러오지 못했습니다."
                value=""
                onChange={() => {}}
                options={[]}
              />
              <FieldErr>{teacherError}</FieldErr>
            </>
          ) : teacherOptions.length === 0 ? (
            <>
              <Hint>강사를 먼저 등록해야 합니다. 내 정보 &gt; 강사 관리에서 추가해 주세요.</Hint>
            </>
          ) : (
            <>
              <TeacherList role="group" aria-label="담당 강사 선택">
                {teacherOptions.map((opt) => {
                  const checked = selectedIds.includes(opt.id);
              const base = opt.name || opt.username || `강사 #${opt.id}`;
              const suffix =
                typeof opt.courseCount === "number"
                  ? ` (담당 수업 ${opt.courseCount}개)`
                  : "";
              const mainTag = isMainAccount(opt) ? " [본계정]" : "";
              const label = `${base}${mainTag}${suffix}`;
              return (
                    <TeacherItem key={opt.id} data-active={checked || undefined}>
                      <label>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            const nextChecked = e.currentTarget.checked;
                            setForm((state) => {
                              const prevIds = Array.isArray(state.instructorIds)
                                ? state.instructorIds
                                : state.instructorId != null
                                ? [state.instructorId]
                                : [];
                              const raw = nextChecked
                                ? [...prevIds, opt.id]
                                : prevIds.filter((id) => id !== opt.id);
                              const uniq = Array.from(new Set(raw));
                              const nextPrimaryId = uniq[0] ?? null;
                              const nextPrimary =
                                teacherOptions.find((t) => t.id === nextPrimaryId) || null;
                              return {
                                ...state,
                                instructorIds: uniq.length ? uniq : null,
                                instructorId: nextPrimaryId,
                                instructorName:
                                  nextPrimary?.name ||
                                  nextPrimary?.username ||
                                  (nextPrimaryId != null ? `강사 #${nextPrimaryId}` : ""),
                              };
                            });
                          }}
                        />
                        <span>{label}</span>
                      </label>
                    </TeacherItem>
                  );
                })}
              </TeacherList>
              {selectedTeachers.length > 0 ? (
                <Hint>
                  선택된 강사:{" "}
                  {selectedTeachers
                    .map(
                      (t) =>
                        t.name ||
                        t.username ||
                        `강사 #${t.id}`,
                    )
                    .join(", ")}
                </Hint>
              ) : (
                <Hint>담당 강사는 선택 사항입니다. 필요 시 여러 명을 선택할 수 있습니다.</Hint>
              )}
              {user && !teacherOptions.some((opt) => isMainAccount(opt)) ? (
                <Hint>본계정(담당자)이 목록에 없으면 강사로 등록해 주세요.</Hint>
              ) : null}
            </>
          )}
        </Field>

        <Field as="div">
          <Label>수업 형태</Label>
          <TypeToggleGroup role="radiogroup" aria-label="수업 형태">
            {courseTypeOptions.map((option) => (
              <TypeToggleButton
                key={option.value}
                type="button"
                data-active={form.courseType === option.value}
                onClick={() => {
                  setForm((state) => {
                    const next: FormState = {
                      ...state,
                      courseType: option.value,
                    };
                    if (option.value === "INDIVIDUAL") {
                      next.capacity = 1;
                      next.primaryStudentId = null;
                      next.primaryStudentName = "";
                    } else {
                      next.primaryStudentId = null;
                      next.primaryStudentName = "";
                    }
                    return next;
                  });
                  if (option.value !== "INDIVIDUAL") {
                    setFieldErr((prev) => ({ ...prev, student: undefined }));
                  }
                }}
              >
                <span className="title">{option.label}</span>
                <span className="desc">{option.description}</span>
              </TypeToggleButton>
            ))}
          </TypeToggleGroup>
          <Hint>수업 형태에 따라 통계와 요금 정책을 나눌 수 있어요.</Hint>
        </Field>
      </StepGrid>
    </StepSection>
  );
}

type ScheduleStepProps = {
  form: FormState;
  setForm: (updater: (prev: FormState) => FormState) => void;
  fieldErr: FieldErrors;
  setFieldErr: (updater: (prev: FieldErrors) => FieldErrors) => void;
  meta: StepMeta;
  isIndividual: boolean;
  studentFilter: string;
  setStudentFilter: (value: string) => void;
  studentLoading: boolean;
  studentError: string | null;
  onSelectStudent: (student: StudentOption) => void;
  filteredStudents: StudentOption[];
  recurring: boolean;
  setRecurring: (value: boolean) => void;
  dayOptions: Array<{ value: import("@/components/courseForm/courseFormHelpers").DayKey; label: string }>;
  hasDay: (source: string | undefined, day: import("@/components/courseForm/courseFormHelpers").DayKey) => boolean;
  toggleDay: (day: import("@/components/courseForm/courseFormHelpers").DayKey, next: boolean) => void;
  minuteOptions: string[];
  hourOptions: string[];
};

export function CourseFormScheduleStep({
  form,
  setForm,
  fieldErr,
  setFieldErr,
  meta,
  isIndividual,
  studentFilter,
  setStudentFilter,
  studentLoading,
  studentError,
  onSelectStudent,
  filteredStudents,
  recurring,
  setRecurring,
  dayOptions,
  hasDay,
  toggleDay,
  minuteOptions,
  hourOptions,
}: ScheduleStepProps) {
  const renderStudentList = () => {
    if (studentLoading) {
      return <StudentPlaceholder>학생 목록을 불러오는 중입니다…</StudentPlaceholder>;
    }
    if (studentError) {
      return <StudentPlaceholder>{studentError}</StudentPlaceholder>;
    }
    if (filteredStudents.length === 0) {
      return (
        <StudentPlaceholder>
          등록된 학생이 없습니다. 원생 등록 후 다시 시도해 주세요.
        </StudentPlaceholder>
      );
    }
    return filteredStudents.map((opt) => (
      <StudentOptionBtn
        key={opt.id}
        type="button"
        role="option"
        data-active={form.primaryStudentId === opt.id}
        aria-selected={form.primaryStudentId === opt.id}
        onClick={() => {
          onSelectStudent(opt);
          if (fieldErr.student) {
            setFieldErr((prev) => ({ ...prev, student: undefined }));
          }
        }}
      >
        <span className="name">{opt.name}</span>
        {opt.code ? <span className="meta">{opt.code}</span> : null}
      </StudentOptionBtn>
    ));
  };

  return (
    <StepSection meta={meta}>
      <StepGrid>
        {isIndividual ? (
          <Field>
            <Label>
              담당 학생<span>*</span>
            </Label>
            <Input
              type="search"
              placeholder="학생 이름이나 코드를 입력해 주세요"
              value={studentFilter}
              onChange={(e) => setStudentFilter(e.target.value)}
            />
            <StudentList
              role="listbox"
              data-invalid={fieldErr.student ? "true" : undefined}
              aria-busy={studentLoading}
            >
              {renderStudentList()}
            </StudentList>
            {form.primaryStudentId ? (
              <Hint>
                선택된 학생: {form.primaryStudentName || `학생 #${form.primaryStudentId}`}
              </Hint>
            ) : null}
            {fieldErr.student ? <FieldErr>{fieldErr.student}</FieldErr> : null}
          </Field>
        ) : null}

        <Field>
          <Label>반복 여부</Label>
          <ToggleSwitch>
            <input
              type="checkbox"
              checked={recurring}
              onChange={(e) => setRecurring(e.currentTarget.checked)}
            />
            <span className="switch" aria-hidden="true" />
            <span className="text">정기 반복</span>
          </ToggleSwitch>
          <Hint>정기 수업이 아니라면 체크를 해제하세요.</Hint>
        </Field>

        <Field>
          <Label>반복 요일{recurring ? <span>*</span> : null}</Label>
          <DayChips
            aria-disabled={!recurring}
            aria-invalid={recurring && !!fieldErr.schedule}
          >
            {dayOptions.map((d) => {
              const active = hasDay(form.recurrenceDays, d.value);
              return (
                <ChipBtn
                  type="button"
                  key={d.value}
                  data-active={active}
                  disabled={!recurring}
                  onClick={() => toggleDay(d.value, !active)}
                >
                  {d.label}
                </ChipBtn>
              );
            })}
          </DayChips>
          <Hint>예: 월/수는 MON,WED 로 저장됩니다.</Hint>
        </Field>

        <Field style={{ gridColumn: "1 / -1" }}>
          <Label>반복 시간{recurring ? <span>*</span> : null}</Label>
          <TimeRow>
            <TimeSelect
              aria-label="시작 시간 시"
              disabled={!recurring}
              aria-invalid={recurring && !!fieldErr.schedule}
              placeholder="시"
              value={(form.startTime ?? "").slice(0, 2) || ""}
              onChange={(value) => {
                const hh = value || "00";
                const mm = (form.startTime ?? "00:00").slice(3, 5) || "00";
                setForm((state) => ({ ...state, startTime: `${hh}:${mm}` }));
              }}
              options={hourOptions.map((h) => ({ label: h, value: h }))}
            />
            <span>:</span>
            <TimeSelect
              aria-label="시작 시간 분"
              disabled={!recurring}
              aria-invalid={recurring && !!fieldErr.schedule}
              placeholder="분"
              value={(form.startTime ?? "").slice(3, 5) || ""}
              onChange={(value) => {
                const mm = value || "00";
                const hh = (form.startTime ?? "00:00").slice(0, 2) || "00";
                setForm((state) => ({ ...state, startTime: `${hh}:${mm}` }));
              }}
              options={minuteOptions.map((m) => ({ label: m, value: m }))}
            />
            <span>~</span>
            <TimeSelect
              aria-label="종료 시간 시"
              disabled={!recurring}
              aria-invalid={recurring && !!fieldErr.schedule}
              placeholder="시"
              value={(form.endTime ?? "").slice(0, 2) || ""}
              onChange={(value) => {
                const hh = value || "00";
                const mm = (form.endTime ?? "00:00").slice(3, 5) || "00";
                setForm((state) => ({ ...state, endTime: `${hh}:${mm}` }));
              }}
              options={hourOptions.map((h) => ({ label: h, value: h }))}
            />
            <span>:</span>
            <TimeSelect
              aria-label="종료 시간 분"
              disabled={!recurring}
              aria-invalid={recurring && !!fieldErr.schedule}
              placeholder="분"
              value={(form.endTime ?? "").slice(3, 5) || ""}
              onChange={(value) => {
                const mm = value || "00";
                const hh = (form.endTime ?? "00:00").slice(0, 2) || "00";
                setForm((state) => ({ ...state, endTime: `${hh}:${mm}` }));
              }}
              options={minuteOptions.map((m) => ({ label: m, value: m }))}
            />
          </TimeRow>
          <Hint>시/분을 고정 옵션으로 선택합니다(5분 단위).</Hint>
          {fieldErr.schedule ? <FieldErr>{fieldErr.schedule}</FieldErr> : null}
        </Field>
      </StepGrid>
    </StepSection>
  );
}

type DetailsStepProps = {
  form: FormState;
  setForm: (updater: (prev: FormState) => FormState) => void;
  meta: StepMeta;
  feeInput: string;
  setFeeInput: (value: string) => void;
  formatNumberKR: (value: string | number) => string;
  isIndividual: boolean;
  isEdit: boolean;
  onNavigateEditStudents: () => void;
};

export function CourseFormDetailsStep({
  form,
  setForm,
  meta,
  feeInput,
  setFeeInput,
  formatNumberKR,
  isIndividual,
  isEdit,
  onNavigateEditStudents,
}: DetailsStepProps) {
  return (
    <StepSection meta={meta}>
      <StepGrid>
        <Field>
          <Label>정원</Label>
          <Input
            type="number"
            min={1}
            value={form.capacity ?? ""}
            disabled={isIndividual}
            onChange={(e) =>
              setForm((state) => ({
                ...state,
                capacity: e.target.value ? Number(e.target.value) : undefined,
              }))
            }
            placeholder="예: 12"
          />
          {isIndividual ? <Hint>개인 수업은 정원이 1명으로 고정됩니다.</Hint> : null}
        </Field>

        <Field>
          <Label>수강료</Label>
          <FeeWrap>
            <FeeInput
              type="text"
              inputMode="numeric"
              value={feeInput}
              onChange={(e) => {
                const digits = (e.target.value || "").replace(/[^0-9]/g, "");
                setFeeInput(formatNumberKR(digits));
                setForm((state) => ({
                  ...state,
                  fee: digits ? Number(digits) : undefined,
                }));
              }}
              placeholder="예: 150,000"
            />
            <Suffix>원</Suffix>
          </FeeWrap>
        </Field>

        <Field style={{ gridColumn: "1 / -1" }}>
          <Label>설명</Label>
          <TextArea
            rows={5}
            value={form.description ?? ""}
            onChange={(e) =>
              setForm((state) => ({ ...state, description: e.target.value }))
            }
            placeholder="수업에 대한 간단한 설명"
          />
        </Field>
      </StepGrid>

      {isEdit ? (
        <GuideCard>
          <StepLead>수강생 관리</StepLead>
          <Hint>학생 관리는 상세 페이지의 ‘수강생 관리’에서 변경하세요.</Hint>
          <UIGhostBtn onClick={onNavigateEditStudents}>수강생 관리 바로가기</UIGhostBtn>
        </GuideCard>
      ) : null}
    </StepSection>
  );
}

const StepCard = styled(Section)`
  display: grid;
  gap: ${(p) => p.theme.spacing.md};
  height: 100%;
  align-content: start;
`;

const STEP_HEADER_GAP = 8;

const StepHeaderWrap = styled.header`
  display: grid;
  gap: ${STEP_HEADER_GAP}px;
`;

const StepTitle = styled.h3`
  margin: 0;
  font-size: ${(p) => p.theme.font.size.lg};
  font-weight: ${(p) => p.theme.font.weight.bold};
  line-height: ${(p) => p.theme.font.lineHeight.tight};
`;

const StepLead = styled.p`
  margin: 0;
  color: ${(p) => p.theme.colors.textMuted};
  font-size: ${(p) => p.theme.font.size.sm};
  line-height: ${(p) => p.theme.font.lineHeight.relaxed};
`;

function StepSection({ meta, children }: { meta: StepMeta; children: ReactNode }) {
  return (
    <StepCard>
      <StepHeaderWrap>
        <StepTitle>{meta.title}</StepTitle>
        <StepLead>{meta.lead}</StepLead>
      </StepHeaderWrap>
      {children}
    </StepCard>
  );
}

const StepGrid = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.md};
`;

const Field = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.xs};
`;

const Label = styled.label`
  font-size: ${(p) => p.theme.font.size.sm};
  font-weight: ${(p) => p.theme.font.weight.medium};
  color: ${(p) => p.theme.colors.text};
  span {
    margin-left: 4px;
    color: ${(p) => p.theme.colors.danger};
  }
`;

const Input = styled.input`
  height: 44px;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.md};
  padding: 0 ${(p) => p.theme.spacing.sm};
  font-size: ${(p) => p.theme.font.size.sm};
  width: 100%;
  box-sizing: border-box;
  color: ${(p) => p.theme.colors.text};
  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.primary};
    box-shadow: ${(p) => p.theme.shadow.focusPrimary};
  }
`;

const Select = styled(SelectBox)`
  width: 100%;
`;

const ReadOnlyField = styled.div`
  height: 44px;
  width: 100%;
  display: flex;
  align-items: center;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.md};
  padding: 0 ${(p) => p.theme.spacing.sm};
  background: ${(p) => p.theme.colors.surfaceAlt};
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${(p) => p.theme.colors.text};
  font-weight: ${(p) => p.theme.font.weight.semiBold};
  word-break: break-word;
`;

const TeacherList = styled.ul`
  list-style: none;
  padding: 6px;
  margin: 4px 0 0;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  border-radius: ${(p) => p.theme.radii.md};
  background: ${(p) => p.theme.colors.surfaceAlt};
`;

const TeacherItem = styled.li`
  label {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border-radius: 999px;
    border: 1px solid ${(p) => p.theme.colors.borderMuted};
    background: ${(p) => p.theme.colors.surface};
    font-size: ${(p) => p.theme.font.size.sm};
    color: ${(p) => p.theme.colors.text};
    cursor: pointer;
    transition: background 0.12s ease-out, border-color 0.12s ease-out, box-shadow 0.12s ease-out;
  }
  input[type="checkbox"] {
    width: 14px;
    height: 14px;
  }
  &[data-active='true'] label {
    border-color: ${(p) => p.theme.colors.primary};
    background: ${(p) => p.theme.colors.primarySurface};
    color: ${(p) => p.theme.colors.primary};
    box-shadow: 0 0 0 1px rgba(0,0,0,0.02);
  }
`;

const FieldErr = styled.span`
  font-size: ${(p) => p.theme.font.size.xs};
  color: ${(p) => p.theme.colors.danger};
`;

const TypeToggleGroup = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.sm};
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
`;

const TypeToggleButton = styled.button`
  display: grid;
  gap: ${(p) => p.theme.spacing.xs};
  padding: ${(p) => p.theme.spacing.sm};
  border-radius: ${(p) => p.theme.radii.md};
  border: 1px solid ${(p) => p.theme.colors.border};
  text-align: left;
  background: ${(p) => p.theme.colors.surface};
  cursor: pointer;
  .title {
    font-size: ${(p) => p.theme.font.size.sm};
    font-weight: ${(p) => p.theme.font.weight.semiBold};
  }
  .desc {
    font-size: ${(p) => p.theme.font.size.xs};
    color: ${(p) => p.theme.colors.textMuted};
  }
  &[data-active="true"] {
    border-color: ${(p) => p.theme.colors.primary};
    background: ${(p) => p.theme.colors.primarySurface};
  }
`;

const StudentList = styled.div`
  margin-top: ${(p) => p.theme.spacing.xs};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.md};
  max-height: 240px;
  overflow-y: auto;
  display: grid;
  gap: 2px;
  padding: 4px;
  &[data-invalid="true"] {
    border-color: ${(p) => p.theme.colors.danger};
  }
`;

const StudentPlaceholder = styled.div`
  padding: ${(p) => p.theme.spacing.md};
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${(p) => p.theme.colors.textMuted};
  text-align: center;
`;

const StudentOptionBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${(p) => p.theme.spacing.xs};
  padding: ${(p) => p.theme.spacing.sm};
  border-radius: ${(p) => p.theme.radii.sm};
  border: none;
  background: ${(p) => p.theme.colors.surface};
  cursor: pointer;
  .name {
    font-weight: ${(p) => p.theme.font.weight.medium};
    color: ${(p) => p.theme.colors.text};
  }
  .meta {
    font-size: ${(p) => p.theme.font.size.xs};
    color: ${(p) => p.theme.colors.textMuted};
  }
  &[data-active="true"] {
    background: ${(p) => p.theme.colors.primarySurface};
  }
`;

const DayChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${(p) => p.theme.spacing.xs};
`;

const ChipBtn = styled.button`
  min-width: 36px;
  height: 32px;
  padding: 0 ${(p) => p.theme.spacing.xs};
  border-radius: 999px;
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.surface};
  font-size: ${(p) => p.theme.font.size.xs};
  cursor: pointer;
  &[data-active="true"] {
    border-color: ${(p) => p.theme.colors.primary};
    background: ${(p) => p.theme.colors.primarySurface};
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const TimeRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing.xs};
  width: 100%;
  span {
    font-size: ${(p) => p.theme.font.size.sm};
    color: ${(p) => p.theme.colors.textMuted};
    flex-shrink: 0;
  }
`;

const TimeSelect = styled(SelectBox)`
  min-width: 0;
  flex: 1;
`;

const FeeWrap = styled.div`
  position: relative;
  display: inline-flex;
  width: 100%;
`;

const FeeInput = styled(Input)`
  padding-right: 38px;
`;

const Suffix = styled.span`
  position: absolute;
  right: ${(p) => p.theme.spacing.sm};
  top: 50%;
  transform: translateY(-50%);
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${(p) => p.theme.colors.textMuted};
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.md};
  padding: ${(p) => p.theme.spacing.sm};
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${(p) => p.theme.colors.text};
  resize: vertical;
`;

const GuideCard = styled.div`
  margin-top: ${(p) => p.theme.spacing.md};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.md};
  padding: ${(p) => p.theme.spacing.md};
  display: grid;
  gap: ${(p) => p.theme.spacing.xs};
  background: ${(p) => p.theme.colors.surfaceAlt};
  ${Hint} {
    margin: 0;
  }
`;
