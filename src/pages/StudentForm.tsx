import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import {
  PrimaryBtn as UIPrimaryBtn,
  SectionCard as Section,
  TitleH3 as SectionTitle,
} from "@/components/common/UI";
import BackButton from "@/components/common/BackButton";
import {
  createStudent,
  getStudent,
  updateStudent,
  type Student,
  type StudentPayload,
} from "@/api/students";

const statusLabel: Record<Student["status"], string> = {
  ENROLLED: "수강중",
  ON_LEAVE: "휴학",
  PENDING: "대기중",
};

const statusCopy: Record<Student["status"], string> = {
  ENROLLED: "현재 수업을 듣고 있는 원생입니다.",
  ON_LEAVE: "일시 휴학 상태로 관리됩니다.",
  PENDING: "상담/등록 대기 중인 원생입니다.",
};

const DEFAULT_STATUS: Student["status"] = "ENROLLED";
const STATUS_COPY_FALLBACK = "현재 수업 상태를 선택하세요.";
const STATUS_LABEL_FALLBACK = "미지정";

const STATUS_OPTIONS: Array<{
  value: Student["status"];
  label: string;
}> = [
  { value: "ENROLLED", label: "수강중" },
  { value: "ON_LEAVE", label: "휴학" },
  { value: "PENDING", label: "대기중" },
];

export default function StudentForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = useMemo(() => !!id, [id]);
  const numericId = useMemo(() => (id ? Number(id) : null), [id]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErr, setFieldErr] = useState<{ name?: string }>({});
  const [touched, setTouched] = useState<{ name?: boolean }>({});
  const nameRef = useRef<HTMLInputElement | null>(null);

  function today(): string {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${mm}-${dd}`;
  }

  const [form, setForm] = useState<StudentPayload>({
    name: "",
    status: "ENROLLED",
    joinedDate: today(),
  });
  // Birthdate pieces for friendlier selection (YYYY/MM/DD)
  const [dobY, setDobY] = useState<string>("");
  const [dobM, setDobM] = useState<string>("");
  const [dobD, setDobD] = useState<string>("");

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 40 }, (_, i) => String(currentYear - i));
  const months = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );
  function daysInMonth(y?: string, m?: string) {
    const yy = Number(y),
      mm = Number(m);
    if (!yy || !mm) return 31;
    return new Date(yy, mm, 0).getDate();
  }
  const days = Array.from({ length: daysInMonth(dobY, dobM) }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );

  function parseYMD(s: string) {
    const [y, m, d] = s.split("-").map((v) => Number(v));
    if (!y || !m || !d) return null;
    return { y, m, d };
  }

  function calcIntlAge(ymd?: string) {
    if (!ymd) return undefined;
    const parts = parseYMD(ymd);
    if (!parts) return undefined;
    const now = new Date();
    let age = now.getFullYear() - parts.y;
    const month = now.getMonth() + 1;
    const day = now.getDate();
    if (month < parts.m || (month === parts.m && day < parts.d)) age -= 1;
    return age;
  }

  function calcKoreanAge(ymd?: string) {
    if (!ymd) return undefined;
    const parts = parseYMD(ymd);
    if (!parts) return undefined;
    const now = new Date();
    return now.getFullYear() - parts.y + 1;
  }

  const intlAge = useMemo(() => calcIntlAge(form.birthDate), [form.birthDate]);
  const koreanAge = useMemo(
    () => calcKoreanAge(form.birthDate),
    [form.birthDate]
  );

  const currentStatus = (form.status ?? DEFAULT_STATUS) as Student["status"];

  useEffect(() => {
    if (!isEdit || !numericId) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const s = await getStudent(numericId as number);
        if (!cancelled) {
          setForm({
            name: s.name,
            status: s.status,
            age: s.age,
            phoneNumber: s.phoneNumber,
            guardianPhone: s.guardianPhone,
            joinedDate: s.joinedDate ?? s.createdAt?.slice(0, 10),
            birthDate: s.birthDate,
            address: s.address,
            parentName: s.parentName,
          });
          if (s.birthDate) {
            const [y, m, d] = s.birthDate.split("-");
            setDobY(y || "");
            setDobM(m || "");
            setDobD(d || "");
          } else {
            setDobY("");
            setDobM("");
            setDobD("");
          }
        }
      } catch (e: any) {
        if (!cancelled)
          setError(e?.message || "원생 정보를 불러오지 못했습니다.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [isEdit, numericId]);

  // Update form.birthDate when dob pieces change
  function updateDOB(y?: string, m?: string, d?: string) {
    const ny = y ?? dobY;
    const nm = m ?? dobM;
    const nd = d ?? dobD;
    setDobY(ny);
    setDobM(nm);
    setDobD(nd);
    if (ny && nm && nd) {
      setForm((f) => ({ ...f, birthDate: `${ny}-${nm}-${nd}` }));
    } else {
      setForm((f) => ({ ...f, birthDate: undefined }));
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!form.name || !form.name.trim()) {
      setFieldErr((prev) => ({ ...prev, name: "이름은 필수입니다." }));
      setTouched((prev) => ({ ...prev, name: true }));
      try { nameRef.current?.focus(); } catch {}
      return;
    }
    setSaving(true);
    try {
      const payload: StudentPayload = {
        ...form,
        name: form.name.trim(),
        status: form.status || "ENROLLED",
      };
      if (intlAge != null) (payload as any).age = intlAge;
      let res: Student;
      if (isEdit && numericId) {
        res = await updateStudent(numericId, payload);
        setSuccess("수정이 완료되었습니다.");
        navigate(`/students/${res.id}`, { replace: true });
      } else {
        res = await createStudent(payload);
        setSuccess("원생이 추가되었습니다.");
        navigate(`/students/${res.id}`, { replace: true });
      }
    } catch (e: any) {
      setError(e?.message || "저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Page>
      <Header>
        <HeadLeft>
          <BackButton to="/students" label="뒤로" />
          <div>
            <h2>{isEdit ? "원생 정보 수정" : "원생 추가하기"}</h2>
            <p>기본 정보를 입력하고 저장하세요.</p>
          </div>
        </HeadLeft>
        <HeadActions>
          <UIPrimaryBtn
            as={"button" as any}
            type="button"
            onClick={() => {
              const formEl = document.getElementById(
                "student-form"
              ) as HTMLFormElement | null;
              if (!formEl) return;
              try {
                // Prefer requestSubmit to trigger onSubmit + validation
                (formEl as any).requestSubmit
                  ? (formEl as any).requestSubmit()
                  : formEl.submit();
              } catch {
                formEl.submit();
              }
            }}
            disabled={saving}
          >
            {saving ? "저장 중..." : "저장"}
          </UIPrimaryBtn>
        </HeadActions>
      </Header>

      {error && <AlertError>{error}</AlertError>}
      {success && <AlertOk>{success}</AlertOk>}

      {loading ? (
        <FormSkeleton />
      ) : (
        <Form id="student-form" onSubmit={onSubmit}>
          <FormLayout>
            <MainColumn>
              <Section>
                <SectionTitle>기본 정보</SectionTitle>
                <SectionLead>
                  수업 및 청구에 사용되는 핵심 정보입니다.
                </SectionLead>
                <Grid>
                  <Field>
                    <Label>
                      이름<span>*</span>
                    </Label>
                    <Input
                      ref={nameRef}
                      value={form.name}
                      onChange={(e) => {
                        setForm((f) => ({ ...f, name: e.target.value }));
                        if (fieldErr.name) setFieldErr((prev) => ({ ...prev, name: undefined }));
                      }}
                      onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                      placeholder="홍길동"
                      required
                      disabled={saving}
                      aria-invalid={touched.name && !!fieldErr.name}
                      aria-describedby={touched.name && fieldErr.name ? 'err-name' : undefined}
                    />
                    {touched.name && fieldErr.name ? (
                      <FieldErr id="err-name">{fieldErr.name}</FieldErr>
                    ) : null}
                    <Help>출석부/청구서에 표시될 이름입니다.</Help>
                  </Field>
                  <Field style={{ gridColumn: "1 / -1" }}>
                    <Label>상태</Label>
                    <StatusSwitch>
                      {STATUS_OPTIONS.map((option) => (
                        <StatusButton
                          key={option.value}
                          type="button"
                          data-active={currentStatus === option.value}
                          onClick={() =>
                            setForm((f) => ({ ...f, status: option.value }))
                          }
                          disabled={saving}
                        >
                          {option.label}
                        </StatusButton>
                      ))}
                    </StatusSwitch>
                    <Help>
                      {statusCopy[currentStatus] ?? STATUS_COPY_FALLBACK}
                    </Help>
                  </Field>
                  <Field>
                    <Label>생년월일</Label>
                    <TripleGrid>
                      <Select
                        value={dobY}
                        onChange={(e) =>
                          updateDOB(e.target.value || "", undefined, undefined)
                        }
                        disabled={saving}
                      >
                        <option value="">연도</option>
                        {years.map((y) => (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        ))}
                      </Select>
                      <Select
                        value={dobM}
                        onChange={(e) =>
                          updateDOB(undefined, e.target.value || "", undefined)
                        }
                        disabled={saving}
                      >
                        <option value="">월</option>
                        {months.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </Select>
                      <Select
                        value={dobD}
                        onChange={(e) =>
                          updateDOB(undefined, undefined, e.target.value || "")
                        }
                        disabled={saving}
                      >
                        <option value="">일</option>
                        {days.map((dd) => (
                          <option key={dd} value={dd}>
                            {dd}
                          </option>
                        ))}
                      </Select>
                    </TripleGrid>
                    <Help>생년월일 입력 시 나이는 자동 계산됩니다.</Help>
                  </Field>
                  <Field>
                    <Label>연락처</Label>
                    <Input
                      value={form.phoneNumber ?? ""}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          phoneNumber: e.target.value || undefined,
                        }))
                      }
                      placeholder="010-1234-5678"
                      disabled={saving}
                    />
                    <Help>
                      가능한 경우 학부모 연락처와 구분해서 입력하세요.
                    </Help>
                  </Field>
                  <Field>
                    <Label>등록일</Label>
                    <Input
                      type="text"
                      lang="ko-KR"
                      inputMode="numeric"
                      placeholder="YYYY-MM-DD"
                      value={form.joinedDate ?? ""}
                      readOnly
                      disabled
                    />
                  </Field>
                </Grid>
              </Section>

              <Section>
                <SectionTitle>부모님/주소</SectionTitle>
                <SectionLead>
                  연락 경로와 청구 주소를 정돈해 두면 업무가 편해져요.
                </SectionLead>
                <Grid>
                  <Field>
                    <Label>보호자 이름</Label>
                    <Input
                      value={form.parentName ?? ""}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          parentName: e.target.value || undefined,
                        }))
                      }
                      placeholder="김철수"
                      disabled={saving}
                    />
                  </Field>
                  <Field>
                    <Label>보호자 연락처</Label>
                    <Input
                      value={form.guardianPhone ?? ""}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          guardianPhone: e.target.value || undefined,
                        }))
                      }
                      placeholder="010-0000-0000"
                      disabled={saving}
                    />
                    <Help>비상 연락을 위해 보호자 연락처를 입력해 주세요.</Help>
                  </Field>
                  <Field style={{ gridColumn: "1 / -1" }}>
                    <Label>주소</Label>
                    <Input
                      value={form.address ?? ""}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          address: e.target.value || undefined,
                        }))
                      }
                      placeholder="서울시 강남구 ..."
                      disabled={saving}
                    />
                  </Field>
                </Grid>
              </Section>
            </MainColumn>

            <SideColumn aria-label="form tips">
              <StickyCard>
                <SummaryTitle>입력 미리 보기</SummaryTitle>
                <SummaryList>
                  <li>
                    <span>이름</span>
                    <strong>{form.name?.trim() || "미입력"}</strong>
                  </li>
                  <li>
                    <span>상태</span>
                    <StatusBadge $variant={currentStatus}>
                      {statusLabel[currentStatus] ?? STATUS_LABEL_FALLBACK}
                    </StatusBadge>
                  </li>
                  <li>
                    <span>나이</span>
                    <strong>
                      {koreanAge != null ? `${koreanAge}세` : "-"}
                      {intlAge != null ? ` / 만 ${intlAge}` : ""}
                    </strong>
                  </li>
                  <li>
                    <span>등록일</span>
                    <strong>{form.joinedDate ?? "-"}</strong>
                  </li>
                </SummaryList>
                <TipNote>저장 전 요약을 빠르게 확인할 수 있어요.</TipNote>
              </StickyCard>

              <InfoCard>
                <h4>입력 팁</h4>
                <ul>
                  <li>
                    수강 상태는 언제든지 변경 가능하니 현재 상황을 기준으로
                    선택하세요.
                  </li>
                </ul>
              </InfoCard>
            </SideColumn>
          </FormLayout>
        </Form>
      )}
    </Page>
  );
}

const Page = styled.div`
  display: grid;
  gap: 14px;
  padding-bottom: 32px;
`;
const Header = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 2px 6px;
  h2 {
    margin: 0;
    font-size: 20px;
    color: #0f172a;
  }
  p {
    margin: 0;
    color: #6b7280;
  }
  &:after {
    content: "";
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    bottom: -6px;
    height: 6px;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.85),
      rgba(255, 255, 255, 0)
    );
    pointer-events: none;
  }
`;
const HeadLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
const HeadActions = styled.div`
  display: inline-flex;
  gap: 8px;
`;
// Back button now shared component
const Form = styled.form`
  display: grid;
  gap: 16px;
`;
// Section/Title from common UI
const Grid = styled.div`
  display: grid;
  gap: 12px;
  grid-template-columns: minmax(0, 1fr);
  @media (min-width: 720px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;
const Field = styled.label`
  display: grid;
  gap: 6px;
  align-items: start;
` as any;
const Label = styled.div`
  color: #475569;
  font-size: 13px;
  font-weight: 800;
  display: inline-flex;
  gap: 4px;
  align-items: center;
  text-align: left;
  span {
    color: #ef4444;
  }
`;
const Input = styled.input`
  height: 42px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 12px;
  font-size: 14px;
  color: #111827;
  width: 100%;
  &::placeholder {
    color: #9ca3af;
  }
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
  }
  &:disabled {
    background: #f9fafb;
    color: #6b7280;
  }
  &[aria-invalid='true'] {
    border-color: #ef4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.12);
  }
`;
const Select = styled.select`
  height: 42px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 12px;
  font-size: 14px;
  background: #fff;
  color: #111827;
  width: 100%;
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
  }
  &:disabled {
    background: #f9fafb;
    color: #6b7280;
  }
`;
const TripleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
`;
// Buttons from common UI
const AlertError = styled.div`
  background: #fee2e2;
  color: #b91c1c;
  border: 1px solid #fecaca;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 13px;
`;
const AlertOk = styled.div`
  background: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 13px;
`;

const Help = styled.div`
  color: #6b7280;
  font-size: 12px;
`;

const FieldErr = styled.div`
  color: #b91c1c;
  font-size: 12px;
`;

const SectionLead = styled.p`
  margin: 4px 0 14px;
  color: #6b7280;
  font-size: 13px;
`;

const FormLayout = styled.div`
  display: grid;
  gap: 18px;
  align-items: start;
  grid-template-columns: minmax(0, 1fr);
  @media (min-width: 1080px) {
    grid-template-columns: minmax(0, 1.6fr) minmax(0, 0.9fr);
  }
`;

const MainColumn = styled.div`
  display: grid;
  gap: 16px;
`;

const SideColumn = styled.aside`
  display: grid;
  gap: 16px;
`;

const StickyCard = styled(Section)`
  display: grid;
  gap: 14px;
  position: sticky;
  top: 84px;
`;

const SummaryTitle = styled.h4`
  margin: 0;
  font-size: 15px;
  color: #111827;
  font-weight: 800;
`;

const SummaryList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 10px;
  li {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    font-size: 13px;
    color: #475569;
    strong {
      font-weight: 700;
      color: #111827;
    }
  }
`;

const StatusBadge = styled.span<{ $variant: Student["status"] }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  background: ${({ $variant: variant }) =>
    variant === "ON_LEAVE"
      ? "rgba(251, 191, 36, 0.18)"
      : variant === "PENDING"
      ? "rgba(96, 165, 250, 0.16)"
      : "rgba(34, 197, 94, 0.18)"};
  color: ${({ $variant: variant }) =>
    variant === "ON_LEAVE"
      ? "#92400e"
      : variant === "PENDING"
      ? "#1d4ed8"
      : "#166534"};
`;

const TipNote = styled.div`
  font-size: 12px;
  color: #6b7280;
`;

const InfoCard = styled(Section)`
  display: grid;
  gap: 10px;
  h4 {
    margin: 0;
    font-size: 14px;
    color: #111827;
  }
  ul {
    margin: 0;
    padding-left: 18px;
    display: grid;
    gap: 6px;
    font-size: 13px;
    color: #4b5563;
  }
`;

const StatusSwitch = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const StatusButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0;
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: #fff;
  color: #1f2937;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.18s ease, background 0.18s ease,
    transform 0.12s ease;
  &[data-active="true"] {
    border-color: #6366f1;
    background: rgba(99, 102, 241, 0.08);
    color: #312e81;
    transform: translateY(-1px);
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

// Danger Zone (edit only)
const DangerZone = styled.section`
  background: #fff1f2;
  border: 1px solid #ffe4e6;
  border-radius: 14px;
  padding: 14px;
  display: grid;
  gap: 8px;
`;
const ZoneTitle = styled.div`
  color: #be123c;
  font-weight: 900;
`;
const ZoneDesc = styled.div`
  color: #9f1239;
  font-size: 12px;
`;
const DangerBtn = styled.button`
  height: 40px;
  padding: 0 16px;
  border-radius: 10px;
  border: 1px solid #e11d48;
  background: #e11d48;
  color: #fff;
  font-weight: 800;
  font-size: 14px;
  justify-self: start;
  opacity: 0.6;
  cursor: not-allowed;
`;

// Skeletons
const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: 200px 0; }
`;
const Sk = styled.div<{ w?: number; h?: number }>`
  background: linear-gradient(90deg, #eef2f7 25%, #f6f8fb 37%, #eef2f7 63%);
  background-size: 400px 100%;
  animation: ${shimmer} 1.2s ease-in-out infinite;
  border-radius: 8px;
  width: ${({ w }) => (w ? `${w}px` : "100%")};
  height: ${({ h }) => (h ? `${h}px` : "12px")};
`;
function FormSkeleton() {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Section>
        <SectionTitle>기본 정보</SectionTitle>
        <Grid>
          <Sk h={38} />
          <Sk h={38} />
          <Sk h={38} />
          <Sk h={38} />
          <Sk h={38} />
          <Sk h={38} />
        </Grid>
      </Section>
      <Section>
        <SectionTitle>부모님/주소</SectionTitle>
        <Grid>
          <Sk h={38} />
          <Sk h={38} />
          <Sk h={38} />
        </Grid>
      </Section>
    </div>
  );
}
