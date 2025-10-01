import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import {
  Page as PageWrap,
  PrimaryBtn as UIPrimaryBtn,
  SectionCard as Section,
  TitleH3 as SectionTitle,
  GhostButtonSmall,
} from "@/components/common/UI";
import InfoBanner from "@/components/common/InfoBanner";
import BackButton from "@/components/common/BackButton";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import {
  createStudent,
  getStudent,
  updateStudent,
  deleteStudent as apiDeleteStudent,
  type Student,
  type StudentPayload,
} from "@/api/students";
import { useToast } from "@/components/common/Toast";

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
  const { success: showSuccess, error: showErrorToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showHelper, setShowHelper] = useState(true);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

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
      setError("이름은 필수입니다.");
      return;
    }
    setSaving(true);
    try {
      const payload: StudentPayload = {
        ...form,
        name: form.name.trim(),
        status: form.status || "ENROLLED",
      };
      // Defensive: normalize phone formats at submit time as well
      const normalizePhone = (v?: string) => {
        const rawStr = (v ?? '').trim();
        if (!rawStr) return undefined;
        const digits = rawStr.replace(/[^0-9]/g, '');
        if (!digits) return undefined; // treat symbols/hyphens-only as empty
        if (digits.length === 11 && digits.startsWith('010')) {
          return `010-${digits.slice(3,7)}-${digits.slice(7)}`;
        }
        // unsupported formats: drop to avoid server-side 400
        return undefined;
      };
      (payload as any).phoneNumber = normalizePhone(payload.phoneNumber as any);
      (payload as any).guardianPhone = normalizePhone(payload.guardianPhone as any);
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
          {isEdit && (
            <GhostButtonSmall as={"button" as any} onClick={() => setConfirmDeleteOpen(true)}>
              삭제
            </GhostButtonSmall>
          )}
          <BackButton to="/students" label="취소" />
          <UIPrimaryBtn
            as={"button" as any}
            type="button"
            onClick={() => {
              const formEl = document.getElementById("student-form") as HTMLFormElement | null;
              if (!formEl) return;
              try {
                // Prefer requestSubmit to trigger onSubmit + validation
                (formEl as any).requestSubmit ? (formEl as any).requestSubmit() : formEl.submit();
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
          {showHelper ? (
            <InfoBanner
              title={isEdit ? "원생 정보를 빠르게 수정하는 방법" : "원생 등록 3단계"}
              description={
                isEdit
                  ? "연락처·주소 변경 후 저장하면 바로 반영됩니다. 변경 이유를 메모에 남기면 추후 조회가 쉬워요."
                  : "기본 정보 입력 → 보호자/주소 확인 → 저장 순으로 진행하면 1분 안에 등록을 마칠 수 있어요."
              }
              tips={[
                "생년월일을 입력하면 나이가 자동 계산됩니다.",
                "연락처는 하이픈(-)을 포함하면 검색 시 정확도가 높아집니다.",
                "보호자 정보가 아직 없다면 비워둔 뒤 나중에 수정해도 괜찮아요.",
              ]}
              onClose={() => setShowHelper(false)}
            />
          ) : null}
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
                      value={form.name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, name: e.target.value }))
                      }
                      placeholder="홍길동"
                      required
                      disabled={saving}
                    />
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
                      inputMode="numeric"
                      autoComplete="tel"
                      onBlur={(e)=>{
                        try {
                          const val = (e.target as HTMLInputElement | null)?.value ?? '';
                          const d = val.replace(/[^0-9]/g,'');
                          if (d.length===11 && d.startsWith('010')) {
                            const formatted = `010-${d.slice(3,7)}-${d.slice(7)}`;
                            setForm(f=>({...f, phoneNumber: formatted }));
                          }
                        } catch {}
                      }}
                      disabled={saving}
                    />
                    <Help>
                      가능한 경우 학부모 연락처와 구분해서 입력하세요.
                    </Help>
                  </Field>
                  <Field>
                    <Label>등록일</Label>
                    <Input
                      type="date"
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
                      placeholder="010-1234-5678"
                      inputMode="numeric"
                      autoComplete="tel"
                      onBlur={(e)=>{
                        try {
                          const val = (e.target as HTMLInputElement | null)?.value ?? '';
                          const d = val.replace(/[^0-9]/g,'');
                          if (d.length===11 && d.startsWith('010')) {
                            const formatted = `010-${d.slice(3,7)}-${d.slice(7)}`;
                            setForm(f=>({...f, guardianPhone: formatted }));
                          }
                        } catch {}
                      }}
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

              {isEdit && (
                <DangerZone>
                  <ZoneTitle>위험 구역</ZoneTitle>
                  <ZoneDesc>
                    삭제 기능은 추후 연결됩니다. (디자인 프리셋)
                  </ZoneDesc>
                  <DangerBtn type="button" disabled>
                    원생 삭제
                  </DangerBtn>
                </DangerZone>
              )}
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
                  <li>연락처는 하이픈(-)을 포함하면 더 읽기 쉬워요.</li>
                  <li>
                    주소를 입력해두면 청구·우편 발송 시 다시 묻지 않아도 됩니다.
                  </li>
                </ul>
              </InfoCard>
            </SideColumn>
          </FormLayout>
        </Form>
      )}

      {/* Delete confirmation: only for edit mode */}
      <ConfirmDialog
        open={isEdit && confirmDeleteOpen}
        title="원생 삭제"
        message={"이 원생을 삭제하시겠어요? 되돌릴 수 없습니다. 출석/상담 기록도 함께 삭제됩니다."}
        confirmLabel="삭제"
        cancelLabel="취소"
        tone="danger"
        busy={deleting}
        onCancel={() => { if (!deleting) setConfirmDeleteOpen(false); }}
        onConfirm={async () => {
          if (!isEdit || !numericId) return;
          setDeleting(true);
          try {
            await apiDeleteStudent(numericId);
            showSuccess('원생을 삭제했습니다.');
            navigate('/students');
          } catch (e: any) {
            showErrorToast(e?.message || '삭제에 실패했습니다.');
          } finally {
            setDeleting(false);
          }
        }}
      />
    </Page>
  );
}

const Page = styled(PageWrap)`
  gap: ${(p) => p.theme.spacing.lg};
  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
  padding-bottom: ${(p) => p.theme.spacing.xxl};
`;
const Header = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: ${(p) => p.theme.spacing.sm};
  padding: ${(p) => p.theme.spacing.sm} ${(p) => p.theme.spacing.xs}
    ${(p) => p.theme.spacing.xs};
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
  gap: ${(p) => p.theme.spacing.sm};
  flex-wrap: wrap;
`;
const HeadActions = styled.div`
  display: inline-flex;
  gap: ${(p) => p.theme.spacing.sm};
  flex-wrap: wrap;
  justify-content: flex-end;
`;
// Back button now shared component
const Form = styled.form`
  display: grid;
  gap: ${(p) => p.theme.spacing.lg};
`;
// Section/Title from common UI
const Grid = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.md};
  grid-template-columns: minmax(0, 1fr);
  @media (min-width: 720px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;
const Field = styled.label`
  display: grid;
  gap: ${(p) => p.theme.spacing.xs};
  align-items: start;
` as any;
const Label = styled.div`
  color: #475569;
  font-size: ${(p) => p.theme.font.size.md};
  font-weight: 800;
  display: inline-flex;
  gap: ${(p) => p.theme.spacing.xs};
  align-items: center;
  text-align: left;
  span {
    color: #ef4444;
  }
`;
const Input = styled.input`
  height: 42px;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.md};
  padding: 0 ${(p) => p.theme.spacing.md};
  font-size: ${(p) => p.theme.font.size.md};
  color: ${(p) => p.theme.colors.text};
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
`;
const Select = styled.select`
  height: 42px;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.md};
  padding: 0 ${(p) => p.theme.spacing.md};
  font-size: ${(p) => p.theme.font.size.md};
  background: #fff;
  color: ${(p) => p.theme.colors.text};
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
  gap: ${(p) => p.theme.spacing.sm};
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

const Help = styled.div`
  color: ${(p) => p.theme.colors.textMuted};
  font-size: ${(p) => p.theme.font.size.sm};
  line-height: 1.4;
`;

const SectionLead = styled.p`
  margin: ${(p) => p.theme.spacing.xs} 0 ${(p) => p.theme.spacing.lg};
  color: ${(p) => p.theme.colors.textMuted};
  font-size: ${(p) => p.theme.font.size.md};
  line-height: 1.5;
`;

const FormLayout = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.xl};
  align-items: start;
  grid-template-columns: minmax(0, 1fr);
  @media (min-width: 1080px) {
    grid-template-columns: minmax(0, 1.6fr) minmax(0, 0.9fr);
  }
`;

const MainColumn = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.lg};
`;

const SideColumn = styled.aside`
  display: grid;
  gap: ${(p) => p.theme.spacing.lg};
`;

const StickyCard = styled(Section)`
  display: grid;
  gap: ${(p) => p.theme.spacing.md};
  position: sticky;
  top: 96px;
`;

const SummaryTitle = styled.h4`
  margin: 0;
  font-size: ${(p) => p.theme.font.size.lg};
  color: #111827;
  font-weight: 800;
`;

const SummaryList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: ${(p) => p.theme.spacing.sm};
  li {
    display: flex;
    justify-content: space-between;
    gap: ${(p) => p.theme.spacing.md};
    font-size: ${(p) => p.theme.font.size.md};
    color: #475569;
    strong {
      font-weight: 700;
      color: #111827;
    }
  }
`;

const StatusBadge = styled.span<{ $variant: Student['status'] }>`
  display: inline-flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing.xs};
  padding: ${(p) => p.theme.spacing.xs} ${(p) => p.theme.spacing.sm};
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  background: ${({ $variant }) =>
    $variant === "ON_LEAVE"
      ? "rgba(251, 191, 36, 0.18)"
      : $variant === "PENDING"
      ? "rgba(96, 165, 250, 0.16)"
      : "rgba(34, 197, 94, 0.18)"};
  color: ${({ $variant }) =>
    $variant === "ON_LEAVE"
      ? "#92400e"
      : $variant === "PENDING"
      ? "#1d4ed8"
      : "#166534"};
`;

const TipNote = styled.div`
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${(p) => p.theme.colors.textMuted};
`;

const InfoCard = styled(Section)`
  display: grid;
  gap: ${(p) => p.theme.spacing.sm};
  h4 {
    margin: 0;
    font-size: ${(p) => p.theme.font.size.md};
    color: #111827;
  }
  ul {
    margin: 0;
    padding-left: ${(p) => p.theme.spacing.lg};
    display: grid;
    gap: ${(p) => p.theme.spacing.xs};
    font-size: ${(p) => p.theme.font.size.md};
    color: #4b5563;
  }
`;

const StatusSwitch = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${(p) => p.theme.spacing.xs};
`;

const StatusButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing.xs};
  padding: ${(p) => p.theme.spacing.sm} ${(p) => p.theme.spacing.md};
  border-radius: ${(p) => p.theme.radii.md};
  border: 1px solid ${(p) => p.theme.colors.border};
  background: #fff;
  color: #1f2937;
  font-size: ${(p) => p.theme.font.size.md};
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.18s ease, background 0.18s ease,
    transform 0.12s ease;
  &[data-active="true"] {
    border-color: ${(p) => p.theme.colors.primary};
    background: rgba(99, 102, 241, 0.12);
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
  border-radius: ${(p) => p.theme.radii.lg};
  padding: ${(p) => p.theme.spacing.md};
  display: grid;
  gap: ${(p) => p.theme.spacing.sm};
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
  height: 36px;
  padding: 0 ${(p) => p.theme.spacing.md};
  border-radius: ${(p) => p.theme.radii.md};
  border: 1px solid #e11d48;
  background: #e11d48;
  color: #fff;
  font-weight: 800;
  font-size: ${(p) => p.theme.font.size.sm};
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

const SkeletonWrap = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.md};
`;
function FormSkeleton() {
  return (
    <SkeletonWrap>
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
    </SkeletonWrap>
  );
}

// arrow icon moved into BackButton component
