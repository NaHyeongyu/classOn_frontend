import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import {
  Page as PageWrap,
  GhostButton as UIGhostBtn,
  buttonVariants,
  SectionCard as Section,
  TitleH3 as Title,
} from "@/components/common/UI";
// InfoBanner removed per request
import {
  createCourse,
  getCourse,
  type Course,
  updateCourse,
} from "@/api/courses";
import { listStudents, type Student } from "@/api/students";
import { getErrorMessage } from "@/lib/errors";

type FormState = {
  title: string;
  description?: string;
  status: Course["status"];
  courseType: 'INDIVIDUAL' | 'GROUP';
  capacity?: number;
  fee?: number;
  courseTime?: string;
  recurrenceDays?: string;
  startTime?: string;
  endTime?: string;
  primaryStudentId?: number | null;
  primaryStudentName?: string;
};

type StudentOption = Pick<Student, "id" | "name" | "code" | "status">;

const DEFAULT_FORM: FormState = {
  title: "",
  description: "",
  status: "IN_PROGRESS",
  courseType: 'GROUP',
  primaryStudentId: null,
  primaryStudentName: "",
};

export default function CourseForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = useMemo(() => !!id, [id]);
  const numericId = useMemo(() => (id ? Number(id) : null), [id]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  // Tip/guide banner removed
  const [fieldErr, setFieldErr] = useState<{
    title?: string;
    schedule?: string;
    student?: string;
  }>({});

  const [form, setForm] = useState<FormState>(() => ({ ...DEFAULT_FORM }));
  const [feeInput, setFeeInput] = useState<string>("");
  const toggleDay = useToggleDay(form, setForm);
  const [recurring, setRecurring] = useState(true);
  const [step, setStep] = useState(0);
  const [studentOptions, setStudentOptions] = useState<StudentOption[]>([]);
  const [studentLoading, setStudentLoading] = useState(false);
  const [studentError, setStudentError] = useState<string | null>(null);
  const [studentsLoaded, setStudentsLoaded] = useState(false);
  const [studentFilter, setStudentFilter] = useState("");

  const steps = [
    {
      key: "basic",
      title: "기본 정보",
      lead: "수업명과 상태를 먼저 확인해 주세요.",
    },
    {
      key: "schedule",
      title: "수업 일정",
      lead: "정기 반복 여부와 시간을 선택합니다.",
    },
    {
      key: "details",
      title: "추가 설정",
      lead: "정원, 수강료, 설명을 정리해 마무리하세요.",
    },
  ] as const;
  const isLastStep = step === steps.length - 1;
  const isIndividual = form.courseType === 'INDIVIDUAL';

  function pad2(n: number) {
    return String(n).padStart(2, "0");
  }
  function formatNumberKR(n: number | string): string {
    const digits = String(n ?? "").replace(/[^0-9]/g, "");
    if (!digits) return "";
    return Number(digits).toLocaleString("ko-KR");
  }

  const minuteOptions = useMemo(() => Array.from({ length: 12 }, (_, i) => pad2(i * 5)), []);
  const courseTypeOptions = useMemo(
    () => ([
      {
        value: 'INDIVIDUAL' as const,
        label: '개인 수업',
        description: '1명의 학생과 진행되는 1:1 수업',
      },
      {
        value: 'GROUP' as const,
        label: '단체 수업',
        description: '여러 학생이 함께 참여하는 그룹 수업',
      },
    ]),
    [],
  );
  const filteredStudents = useMemo(() => {
    const keyword = studentFilter.trim().toLowerCase();
    if (!keyword) return studentOptions;
    return studentOptions.filter((opt) => {
      const name = opt.name?.toLowerCase() ?? "";
      const code = opt.code?.toLowerCase() ?? "";
      return name.includes(keyword) || code.includes(keyword);
    });
  }, [studentOptions, studentFilter]);

  useEffect(() => {
    if (!isIndividual || studentsLoaded) return;
    let cancelled = false;
    async function loadStudents() {
      setStudentLoading(true);
      setStudentError(null);
      try {
        const size = 100;
        let page = 0;
        let aggregated: StudentOption[] = [];
        while (true) {
          const res = await listStudents({ page, size });
          const { content, last } = res;
          const mapped = content.map((s) => ({ id: s.id, name: s.name, code: s.code, status: s.status }));
          aggregated = aggregated.concat(mapped);
          if (last || content.length === 0 || page > 200) break;
          page += 1;
        }
          if (!cancelled) {
            const unique = new Map<number, StudentOption>();
            for (const row of aggregated) unique.set(row.id, row);
            if (form.primaryStudentId && !unique.has(form.primaryStudentId)) {
              unique.set(form.primaryStudentId, {
                id: form.primaryStudentId,
                name: form.primaryStudentName || `학생 #${form.primaryStudentId}`,
                code: undefined,
                status: 'ENROLLED',
              });
            }
          const ordered = Array.from(unique.values()).sort((a, b) =>
            (a.name || "").localeCompare(b.name || "", 'ko-KR')
          );
          setStudentOptions(ordered);
          setStudentsLoaded(true);
        }
      } catch (error) {
        if (!cancelled) {
          setStudentError(getErrorMessage(error, "학생 목록을 불러오지 못했습니다."));
          setStudentsLoaded(true);
        }
      } finally {
        if (!cancelled) setStudentLoading(false);
      }
    }
    void loadStudents();
    return () => { cancelled = true; };
  }, [isIndividual, studentsLoaded, form.primaryStudentId, form.primaryStudentName]);

  useEffect(() => {
    if (!isEdit || !numericId) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const found = await getCourse(numericId as number);
        if (!cancelled && found) {
          setForm({
            title: found.title,
            description: found.description,
            status: found.status,
            courseType: found.courseType ?? 'GROUP',
            capacity:
              (found.courseType ?? 'GROUP') === 'INDIVIDUAL' ? 1 : found.capacity,
            fee: found.fee,
            courseTime: found.courseTime,
            recurrenceDays: found.recurrenceDays,
            startTime: found.startTime ? found.startTime.slice(0, 5) : "",
            endTime: found.endTime ? found.endTime.slice(0, 5) : "",
            primaryStudentId: found.primaryStudentId ?? null,
            primaryStudentName: found.primaryStudentName ?? "",
          });
          setFeeInput(
            found.fee != null ? formatNumberKR(found.fee) : ""
          );
        }
      } catch (error) {
        if (!cancelled)
          setError(getErrorMessage(error, "수업 정보를 불러오지 못했습니다."));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [isEdit, numericId]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setFieldErr({});
    if (!form.title || !form.title.trim()) {
      setFieldErr((prev) => ({ ...prev, title: "수업명을 입력해 주세요." }));
      return;
    }
    if (isIndividual && !form.primaryStudentId) {
      setFieldErr((prev) => ({ ...prev, student: "학생을 선택해 주세요." }));
      return;
    }
    setSaving(true);
    try {
      // validation: recurrence days/time required
      if (
        recurring &&
        (!form.recurrenceDays ||
          !form.recurrenceDays.trim() ||
          !form.startTime ||
          !form.endTime)
      ) {
        setFieldErr((prev) => ({
          ...prev,
          schedule: "반복 요일과 시작/종료 시간을 선택해 주세요.",
        }));
        return;
      }
      if (isEdit && numericId) {
        await updateCourse(numericId, {
          ...form,
          // send LocalTime-compatible strings (HH:mm:ss)
          startTime:
            form.startTime?.length === 5
              ? `${form.startTime}:00`
              : form.startTime,
          endTime:
            form.endTime?.length === 5 ? `${form.endTime}:00` : form.endTime,
          recurring,
        });
        setSuccess("수정이 완료되었습니다.");
      } else {
        await createCourse({
          ...form,
          startTime:
            form.startTime?.length === 5
              ? `${form.startTime}:00`
              : form.startTime,
          endTime:
            form.endTime?.length === 5 ? `${form.endTime}:00` : form.endTime,
          recurring,
        });
        setSuccess("수업이 추가되었습니다.");
      }

      // 개인 수업 학생 선택은 저장 시 바로 반영됩니다.
      navigate(`/classes`, { replace: true });
    } catch (error) {
      setError(getErrorMessage(error, "저장에 실패했습니다."));
    } finally {
      setSaving(false);
    }
  }

  function validateStep(current: number): boolean {
    if (current === 0) {
      if (!form.title || !form.title.trim()) {
        setFieldErr((prev) => ({ ...prev, title: "수업명을 입력해 주세요." }));
        return false;
      }
      setFieldErr((prev) => ({ ...prev, title: undefined }));
    }
    if (current === 1) {
      if (form.courseType === 'INDIVIDUAL' && !form.primaryStudentId) {
        setFieldErr((prev) => ({
          ...prev,
          student: "학생을 선택해 주세요.",
        }));
        return false;
      }
      setFieldErr((prev) => ({ ...prev, student: undefined }));
      if (
        recurring &&
        (!form.recurrenceDays ||
          !form.recurrenceDays.trim() ||
          !form.startTime ||
          !form.endTime)
      ) {
        setFieldErr((prev) => ({
          ...prev,
          schedule: "반복 요일과 시작/종료 시간을 선택해 주세요.",
        }));
        return false;
      }
      setFieldErr((prev) => ({ ...prev, schedule: undefined }));
    }
    return true;
  }

  function goNext() {
    if (!validateStep(step)) return;
    setStep((idx) => Math.min(idx + 1, steps.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goPrev() {
    setStep((idx) => Math.max(idx - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <Wrap>
      <Head>
        <BackBtn type="button" onClick={() => navigate("/classes")}>
          {leftIcon} 뒤로
        </BackBtn>
        <h2>{isEdit ? "수업 수정" : "수업 추가하기"}</h2>
        <Actions />
      </Head>
      {error && <AlertError>{error}</AlertError>}
      {success && <AlertOk>{success}</AlertOk>}
      {loading ? (
        <FormSk />
      ) : (
        <Form id="course-form" onSubmit={onSubmit}>
          {/* Tip/guide banner removed */}

          <Stepper>
            {steps.map((meta, idx) => {
              const canClick = idx < step;
              return (
                <StepChip
                  key={meta.key}
                  type="button"
                  data-active={idx === step}
                  data-done={idx < step}
                  disabled={!canClick}
                  onClick={() => {
                    if (!canClick) return;
                    setStep(idx);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <span className="index">{idx + 1}</span>
                  <span className="label">{meta.title}</span>
                </StepChip>
              );
            })}
          </Stepper>

          {step === 0 ? (
            <StepCard>
              <StepHeader>
                <StepTitle>{steps[0].title}</StepTitle>
                <StepLead>{steps[0].lead}</StepLead>
              </StepHeader>
              <StepGrid>
                <Field>
                  <Label>
                    수업명<span>*</span>
                  </Label>
                  <Input
                    aria-invalid={!!fieldErr.title}
                    value={form.title}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, title: e.target.value }));
                      if (fieldErr.title)
                        setFieldErr((prev) => ({ ...prev, title: undefined }));
                    }}
                    placeholder="예: 영어 회화 A반"
                  />
                  {fieldErr.title ? <FieldErr>{fieldErr.title}</FieldErr> : null}
                </Field>

                <Field>
                  <Label>상태</Label>
                  <Select
                    value={form.status}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        status: e.target.value as Course["status"],
                      }))
                    }
                  >
                    <option value="IN_PROGRESS">진행중</option>
                    <option value="PENDING">대기</option>
                    <option value="STOPPED">중단</option>
                  </Select>
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
                          setForm((f) => {
                            const next: FormState = {
                              ...f,
                              courseType: option.value,
                            };
                            if (option.value === 'INDIVIDUAL') {
                              next.capacity = 1;
                              next.primaryStudentId = null;
                              next.primaryStudentName = "";
                            } else {
                              next.primaryStudentId = null;
                              next.primaryStudentName = "";
                            }
                            return next;
                          });
                          if (option.value !== 'INDIVIDUAL') {
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
            </StepCard>
          ) : null}

          {step === 1 ? (
            <StepCard>
              <StepHeader>
                <StepTitle>{steps[1].title}</StepTitle>
                <StepLead>{steps[1].lead}</StepLead>
              </StepHeader>
              {/* 상단 이전 단계 버튼 제거: 하단 네비만 유지 */}
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
                      data-invalid={fieldErr.student ? 'true' : undefined}
                      aria-busy={studentLoading}
                    >
                      {studentLoading ? (
                        <StudentPlaceholder>학생 목록을 불러오는 중입니다…</StudentPlaceholder>
                      ) : studentError ? (
                        <StudentPlaceholder>{studentError}</StudentPlaceholder>
                      ) : filteredStudents.length === 0 ? (
                        <StudentPlaceholder>
                          등록된 학생이 없습니다. 원생 등록 후 다시 시도해 주세요.
                        </StudentPlaceholder>
                      ) : (
                        filteredStudents.map((opt) => (
                          <StudentOptionBtn
                            key={opt.id}
                            type="button"
                            role="option"
                            data-active={form.primaryStudentId === opt.id}
                            aria-selected={form.primaryStudentId === opt.id}
                            onClick={() => {
                              setForm((f) => ({
                                ...f,
                                primaryStudentId: opt.id,
                                primaryStudentName: opt.name,
                              }));
                              if (fieldErr.student) {
                                setFieldErr((prev) => ({ ...prev, student: undefined }));
                              }
                            }}
                          >
                            <span className="name">{opt.name}</span>
                            {opt.code ? <span className="meta">{opt.code}</span> : null}
                          </StudentOptionBtn>
                        ))
                      )}
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
                  <Toggle>
                    <input
                      id="recurring"
                      type="checkbox"
                      checked={recurring}
                      onChange={(e) => setRecurring(e.currentTarget.checked)}
                    />
                    <label htmlFor="recurring">정기 반복</label>
                  </Toggle>
                  <Hint>정기 수업이 아니라면 체크를 해제하세요.</Hint>
                </Field>

                <Field>
                  <Label>반복 요일{recurring ? <span>*</span> : null}</Label>
                  <DayChips aria-disabled={!recurring} aria-invalid={recurring && !!fieldErr.schedule}>
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

                <Field>
                  <Label>반복 시간{recurring ? <span>*</span> : null}</Label>
                  <TimeRow>
                    <select
                      disabled={!recurring}
                      aria-invalid={recurring && !!fieldErr.schedule}
                      value={(form.startTime ?? "").slice(0, 2) || "00"}
                      onChange={(e) => {
                        const hh = e.target.value;
                        const mm = (form.startTime ?? "00:00").slice(3, 5) || "00";
                        setForm((f) => ({ ...f, startTime: `${hh}:${mm}` }));
                      }}
                    >
                      {Array.from({ length: 24 }, (_, i) => pad2(i)).map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>
                    <span>:</span>
                    <select
                      disabled={!recurring}
                      aria-invalid={recurring && !!fieldErr.schedule}
                      value={(form.startTime ?? "").slice(3, 5) || "00"}
                      onChange={(e) => {
                        const mm = e.target.value;
                        const hh = (form.startTime ?? "00:00").slice(0, 2) || "00";
                        setForm((f) => ({ ...f, startTime: `${hh}:${mm}` }));
                      }}
                    >
                      {minuteOptions.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                    <span>~</span>
                    <select
                      disabled={!recurring}
                      aria-invalid={recurring && !!fieldErr.schedule}
                      value={(form.endTime ?? "").slice(0, 2) || "00"}
                      onChange={(e) => {
                        const hh = e.target.value;
                        const mm = (form.endTime ?? "00:00").slice(3, 5) || "00";
                        setForm((f) => ({ ...f, endTime: `${hh}:${mm}` }));
                      }}
                    >
                      {Array.from({ length: 24 }, (_, i) => pad2(i)).map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>
                    <span>:</span>
                    <select
                      disabled={!recurring}
                      aria-invalid={recurring && !!fieldErr.schedule}
                      value={(form.endTime ?? "").slice(3, 5) || "00"}
                      onChange={(e) => {
                        const mm = e.target.value;
                        const hh = (form.endTime ?? "00:00").slice(0, 2) || "00";
                        setForm((f) => ({ ...f, endTime: `${hh}:${mm}` }));
                      }}
                    >
                      {minuteOptions.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </TimeRow>
                  <Hint>시/분을 고정 옵션으로 선택합니다(5분 단위).</Hint>
                  {fieldErr.schedule ? (
                    <FieldErr>{fieldErr.schedule}</FieldErr>
                  ) : null}
                </Field>
              </StepGrid>
            </StepCard>
          ) : null}

          {step === 2 ? (
            <StepCard>
              <StepHeader>
                <StepTitle>{steps[2].title}</StepTitle>
                <StepLead>{steps[2].lead}</StepLead>
              </StepHeader>
              {/* 상단 이전 단계 버튼 제거: 하단 네비만 유지 */}
              <StepGrid>
                <Field>
                  <Label>정원</Label>
                  <Input
                    type="number"
                    min={1}
                    value={form.capacity ?? ""}
                    disabled={isIndividual}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        capacity: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      }))
                    }
                    placeholder="예: 12"
                  />
                  {isIndividual ? (
                    <Hint>개인 수업은 정원이 1명으로 고정됩니다.</Hint>
                  ) : null}
                </Field>
                <Field>
                  <Label>수강료</Label>
                  <FeeWrap>
                    <Input
                      type="text"
                      inputMode="numeric"
                      value={feeInput}
                      onChange={(e) => {
                        const digits = (e.target.value || "").replace(/[^0-9]/g, "");
                        setFeeInput(formatNumberKR(digits));
                        setForm((f) => ({
                          ...f,
                          fee: digits ? Number(digits) : undefined,
                        }));
                      }}
                      placeholder="예: 150,000"
                      style={{ paddingRight: 38 }}
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
                      setForm((f) => ({ ...f, description: e.target.value }))
                    }
                    placeholder="수업에 대한 간단한 설명"
                  />
                </Field>
              </StepGrid>

              {isEdit ? (
                <GuideCard>
                  <StepLead>수강생 관리</StepLead>
                  <Hint>학생 관리는 상세 페이지의 ‘수강생 수정’에서 변경하세요.</Hint>
                  <UIGhostBtn
                    onClick={() => navigate(`/classes/${numericId}/edit-students`)}
                  >
                    수강생 수정 바로가기
                  </UIGhostBtn>
                </GuideCard>
              ) : null}
            </StepCard>
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
              <PrimaryAction key="next" type="button" onClick={goNext}>
                다음 단계
              </PrimaryAction>
            ) : (
              <PrimaryAction key="submit" type="submit" disabled={saving}>
                {saving ? "저장 중..." : isEdit ? "수업 수정 완료" : "수업 저장"}
              </PrimaryAction>
            )}
          </StepFooter>
        </Form>
      )}
    </Wrap>
  );
}

const Wrap = styled(PageWrap)`
  gap: ${(p) => p.theme.spacing.lg};
`;
const Head = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: ${(p) => p.theme.spacing.md};
  align-items: center;
`;
const Actions = styled.div`
  display: inline-flex;
  gap: ${(p) => p.theme.spacing.sm};
  flex-wrap: wrap;
  justify-content: flex-end;
`;
const Form = styled.form`
  display: grid;
  gap: ${(p) => p.theme.spacing.xl};
`;
// Section, Title from common UI
const Field = styled.label`
  display: grid;
  gap: ${(p) => p.theme.spacing.xs};
`;
const Label = styled.div`
  color: #6b7280;
  font-size: ${(p) => p.theme.font.size.sm};
  font-weight: 700;
  span {
    color: #ef4444;
  }
`;
const Input = styled.input`
  height: 38px;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.md};
  padding: 0 ${(p) => p.theme.spacing.md};
  font-size: ${(p) => p.theme.font.size.md};
`;
const FeeWrap = styled.div`
  position: relative;
  display: block;
`;
const Suffix = styled.span`
  position: absolute;
  right: ${(p) => p.theme.spacing.md};
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  font-size: ${(p) => p.theme.font.size.md};
`;
const Select = styled.select`
  height: 38px;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.md};
  padding: 0 ${(p) => p.theme.spacing.md};
  font-size: ${(p) => p.theme.font.size.md};
  background: #fff;
  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
  }
  &[aria-invalid='true'] {
    border-color: #ef4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.12);
  }
`;
const TextArea = styled.textarea`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.md};
  padding: ${(p) => p.theme.spacing.md};
  font-size: ${(p) => p.theme.font.size.md};
  resize: vertical;
  background: #fff;
  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
  }
`;
const Hint = styled.div`
  color: #6b7280;
  font-size: ${(p) => p.theme.font.size.sm};
  line-height: 1.4;
`;
const FieldErr = styled.div`
  color: #b91c1c;
  font-size: ${(p) => p.theme.font.size.sm};
  margin-top: ${(p) => p.theme.spacing.xs};
`;
const DayChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${(p) => p.theme.spacing.sm};
  &[aria-invalid='true'] {
    outline: 2px solid rgba(239, 68, 68, 0.35);
    outline-offset: 4px;
    border-radius: 12px;
    padding: 2px;
  }
`;
const ChipBtn = styled.button`
  height: 32px;
  padding: 0 ${(p) => p.theme.spacing.md};
  border-radius: 999px;
  border: 1px solid ${(p) => p.theme.colors.border};
  background: #fff;
  font-size: ${(p) => p.theme.font.size.md};
  color: #111827;
  &[data-active="true"] {
    background: #111827;
    color: #fff;
    border-color: #111827;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
const TypeToggleGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${(p) => p.theme.spacing.sm};
`;
const TypeToggleButton = styled.button`
  display: grid;
  gap: ${(p) => p.theme.spacing.xs};
  padding: ${(p) => p.theme.spacing.sm} ${(p) => p.theme.spacing.md};
  min-width: 140px;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.lg};
  background: #fff;
  text-align: left;
  font-size: ${(p) => p.theme.font.size.sm};
  color: #334155;
  transition: border-color 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
  .title {
    font-weight: 700;
    color: #111827;
  }
  .desc {
    font-size: ${(p) => p.theme.font.size.xs};
    color: #64748b;
  }
  &[data-active="true"] {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.18);
    background: rgba(99, 102, 241, 0.06);
    .title { color: #4338ca; }
  }
`;
const StudentList = styled.div`
  margin-top: ${(p) => p.theme.spacing.sm};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.md};
  background: #fff;
  max-height: 240px;
  overflow-y: auto;
  display: grid;
  gap: ${(p) => p.theme.spacing.xs};
  padding: ${(p) => p.theme.spacing.sm};
  &[data-invalid='true'] {
    border-color: #ef4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.12);
  }
`;
const StudentOptionBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${(p) => p.theme.spacing.sm};
  width: 100%;
  padding: ${(p) => p.theme.spacing.sm} ${(p) => p.theme.spacing.md};
  border: 1px solid transparent;
  border-radius: ${(p) => p.theme.radii.md};
  background: transparent;
  cursor: pointer;
  font-size: ${(p) => p.theme.font.size.md};
  color: #111827;
  transition: background 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
  .name {
    font-weight: 600;
  }
  .meta {
    font-size: ${(p) => p.theme.font.size.sm};
    color: #64748b;
  }
  &:hover {
    background: #f8fafc;
  }
  &[data-active='true'] {
    background: rgba(99, 102, 241, 0.08);
    border-color: #6366f1;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.12);
  }
`;
const StudentPlaceholder = styled.div`
  padding: ${(p) => p.theme.spacing.md};
  text-align: center;
  color: #64748b;
  font-size: ${(p) => p.theme.font.size.sm};
`;
const TimeRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr auto 1fr auto 1fr;
  gap: ${(p) => p.theme.spacing.sm};
  align-items: center;
  select[aria-invalid='true'] {
    border-color: #ef4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.12);
  }
`;
// Buttons from common UI
const AlertError = styled.div`
  background: #fee2e2;
  color: #b91c1c;
  border: 1px solid #fecaca;
  padding: ${(p) => p.theme.spacing.sm} ${(p) => p.theme.spacing.md};
  border-radius: ${(p) => p.theme.radii.md};
  font-size: ${(p) => p.theme.font.size.sm};
`;
const AlertOk = styled.div`
  background: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
  padding: ${(p) => p.theme.spacing.sm} ${(p) => p.theme.spacing.md};
  border-radius: ${(p) => p.theme.radii.md};
  font-size: ${(p) => p.theme.font.size.sm};
`;
// removed unused Muted style

const shimmer = keyframes` 0%{ background-position:-200px 0; } 100%{ background-position:200px 0; }`;
const Sk = styled.div<{ h?: number }>`
  background: linear-gradient(90deg, #eef2f7 25%, #f6f8fb 37%, #eef2f7 63%);
  background-size: 400px 100%;
  animation: ${shimmer} 1.2s ease-in-out infinite;
  border-radius: 8px;
  width: 100%;
  height: ${(p) => p.h || 12}px;
`;
function FormSk() {
  return (
    <Section>
      <Title>기본 정보</Title>
      <GridOne>
        <Sk h={38} />
        <Sk h={38} />
        <Sk h={38} />
        <Sk h={38} />
        <Sk h={120} />
      </GridOne>
    </Section>
  );
}

const Stepper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${(p) => p.theme.spacing.sm};
`;

const GridOne = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.md};
`;

const StepChip = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing.sm};
  padding: ${(p) => p.theme.spacing.xs} ${(p) => p.theme.spacing.md};
  border-radius: 999px;
  border: 1px solid #dbeafe;
  background: #f8fafb;
  color: #334155;
  font-size: ${(p) => p.theme.font.size.sm};
  font-weight: 600;
  cursor: pointer;
  transition: background 0.18s ease, border-color 0.18s ease, color 0.18s ease;
  &:disabled {
    cursor: default;
    pointer-events: none;
  }
  &:not(:disabled):hover {
    border-color: #c7d2fe;
    background: #eef2ff;
  }
  .index {
    width: 22px;
    height: 22px;
    border-radius: 999px;
    background: #e0e7ff;
    color: #4338ca;
    display: grid;
    place-items: center;
    font-weight: 700;
  }
  &[data-active='true'] {
    border-color: #c7d2fe;
    background: #eef2ff;
    color: #1f2937;
    box-shadow: 0 6px 18px rgba(79, 70, 229, 0.15);
    .index {
      background: #6366f1;
      color: #fff;
    }
  }
  &[data-done='true'] {
    border-color: #c7d2fe;
    background: #f5f3ff;
    color: #1f2937;
    .index {
      background: #4f46e5;
      color: #fff;
    }
  }
`;

const StepCard = styled(Section)`
  display: grid;
  gap: ${(p) => p.theme.spacing.xl};
`;

const StepHeader = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.xs};
`;

const StepTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
`;

const StepLead = styled.p`
  margin: 0;
  font-size: ${(p) => p.theme.font.size.md};
  color: #475569;
`;

const StepGrid = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.lg};
`;

const StepFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${(p) => p.theme.spacing.md};
`;

const InlineNav = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const NavButton = styled.button`
  ${buttonVariants.outline};
  height: 40px;
  padding: 0 ${(p) => p.theme.spacing.xl};
  font-size: ${(p) => p.theme.font.size.md};
  font-weight: 600;
`;

const PrimaryAction = styled.button`
  ${buttonVariants.primary};
  height: 40px;
  padding: 0 ${(p) => p.theme.spacing.xl};
  font-size: ${(p) => p.theme.font.size.md};
  font-weight: 700;
`;

const GuideCard = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.sm};
  border: 1px dashed #cbd5f5;
  border-radius: ${(p) => p.theme.radii.md};
  padding: ${(p) => p.theme.spacing.md};
  background: #f8fafc;
`;

const BackBtn = styled.button`
  ${buttonVariants.outline};
  height: 40px;
  padding: 0 ${(p) => p.theme.spacing.lg};
  font-weight: 600;
  font-size: ${(p) => p.theme.font.size.md};
`;
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

const dayOptions: Array<{ value: DayKey; label: string }> = [
  { value: "MON", label: "월" },
  { value: "TUE", label: "화" },
  { value: "WED", label: "수" },
  { value: "THU", label: "목" },
  { value: "FRI", label: "금" },
  { value: "SAT", label: "토" },
  { value: "SUN", label: "일" },
];

type DayKey = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";

function hasDay(recurrenceDays: string | undefined, d: DayKey): boolean {
  if (!recurrenceDays || !d) return false;
  return recurrenceDays
    .split(
      ","
    )
    .map((s) => s.trim().toUpperCase())
    .includes(d);
}

function joinDays(list: DayKey[]): string {
  return Array.from(new Set(list)).filter(Boolean).join(",");
}

function useToggleDay(
  form: Pick<FormState, "recurrenceDays">,
  setForm: React.Dispatch<React.SetStateAction<FormState>>
) {
  return (d: DayKey, checked: boolean) => {
    const current = (form.recurrenceDays || "")
      .split(",")
      .map((s) => s.trim())
      .filter((s): s is DayKey => Boolean(s))
      .map((s) => s.toUpperCase()) as DayKey[];
    const next = checked
      ? [...current, d]
      : current.filter((x) => x !== d);
    setForm((f) => ({ ...f, recurrenceDays: joinDays(next) }));
  };
}

const Toggle = styled.div`
  display: inline-flex;
  gap: ${(p) => p.theme.spacing.sm};
  align-items: center;
  input[type="checkbox"] {
    width: 18px;
    height: 18px;
  }
`;
