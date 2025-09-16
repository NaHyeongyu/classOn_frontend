import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { GhostBtn as UIGhostBtn, PrimaryBtn as UIPrimaryBtn, SectionCard as Section, TitleH3 as SectionTitle } from "../components/common/UI";
import { createStudent, getStudent, updateStudent, type Student, type StudentPayload } from "../api/students";

export default function StudentForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = useMemo(() => !!id, [id]);
  const numericId = useMemo(() => (id ? Number(id) : null), [id]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
  function daysInMonth(y?: string, m?: string) {
    const yy = Number(y), mm = Number(m);
    if (!yy || !mm) return 31;
    return new Date(yy, mm, 0).getDate();
  }
  const days = Array.from({ length: daysInMonth(dobY, dobM) }, (_, i) => String(i + 1).padStart(2, "0"));

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
  const koreanAge = useMemo(() => calcKoreanAge(form.birthDate), [form.birthDate]);

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
            setDobY(y || ""); setDobM(m || ""); setDobD(d || "");
          } else {
            setDobY(""); setDobM(""); setDobD("");
          }
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "원생 정보를 불러오지 못했습니다.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => { cancelled = true; };
  }, [isEdit, numericId]);

  // Update form.birthDate when dob pieces change
  function updateDOB(y?: string, m?: string, d?: string) {
    const ny = y ?? dobY;
    const nm = m ?? dobM;
    const nd = d ?? dobD;
    setDobY(ny); setDobM(nm); setDobD(nd);
    if (ny && nm && nd) {
      setForm((f) => ({ ...f, birthDate: `${ny}-${nm}-${nd}` }));
    } else {
      setForm((f) => ({ ...f, birthDate: undefined }));
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setSuccess(null);
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
          <BackBtn type="button" onClick={() => navigate("/students")} title="목록으로">{leftIcon} 뒤로</BackBtn>
          <div>
            <h2>{isEdit ? "원생 정보 수정" : "원생 추가하기"}</h2>
            <p>기본 정보를 입력하고 저장하세요.</p>
          </div>
        </HeadLeft>
        <HeadActions>
          <UIGhostBtn as={"button" as any} onClick={() => navigate("/students")}>취소</UIGhostBtn>
          <UIPrimaryBtn as={"button" as any} type="submit" form="student-form" disabled={saving}>{saving ? "저장 중..." : "저장"}</UIPrimaryBtn>
        </HeadActions>
      </Header>

      {error && <AlertError>{error}</AlertError>}
      {success && <AlertOk>{success}</AlertOk>}

      {loading ? (
        <FormSkeleton />
      ) : (
      <Form id="student-form" onSubmit={onSubmit}>
        <Section>
          <SectionTitle>기본 정보</SectionTitle>
          <Grid>
            <Field>
              <Label>이름<span>*</span></Label>
              <Input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} placeholder="홍길동" required disabled={saving} />
              <Help>출석부/청구서에 표시될 이름입니다.</Help>
            </Field>
            <Field>
              <Label>상태</Label>
              <Select value={form.status || "ENROLLED"} onChange={(e) => setForm(f => ({ ...f, status: e.target.value as any }))} disabled={saving}>
                <option value="ENROLLED">수강중</option>
                <option value="ON_LEAVE">휴학</option>
                <option value="PENDING">대기중</option>
              </Select>
            </Field>
            <Field>
              <Label>생년월일</Label>
              <TripleGrid>
                <Select value={dobY} onChange={(e) => updateDOB(e.target.value || "", undefined, undefined)} disabled={saving}>
                  <option value="">연도</option>
                  {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </Select>
                <Select value={dobM} onChange={(e) => updateDOB(undefined, e.target.value || "", undefined)} disabled={saving}>
                  <option value="">월</option>
                  {months.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </Select>
                <Select value={dobD} onChange={(e) => updateDOB(undefined, undefined, e.target.value || "")} disabled={saving}>
                  <option value="">일</option>
                  {days.map((dd) => (
                    <option key={dd} value={dd}>{dd}</option>
                  ))}
                </Select>
              </TripleGrid>
              <Help>생년월일 입력 시 나이는 자동 계산됩니다.</Help>
            </Field>
            <Field>
              <Label>나이(자동)</Label>
              <Input value={koreanAge != null ? `${koreanAge} (만 ${intlAge ?? "-"}세)` : "-"} readOnly disabled />
            </Field>
            <Field>
              <Label>연락처</Label>
              <Input value={form.phoneNumber ?? ""} onChange={(e) => setForm(f => ({ ...f, phoneNumber: e.target.value || undefined }))} placeholder="010-1234-5678" disabled={saving} />
            </Field>
            <Field>
              <Label>등록일</Label>
              <Input type="date" value={form.joinedDate ?? ""} readOnly disabled />
            </Field>
          </Grid>
        </Section>

        <Section>
          <SectionTitle>부모님/주소</SectionTitle>
          <Grid>
            <Field>
              <Label>보호자 이름</Label>
              <Input value={form.parentName ?? ""} onChange={(e) => setForm(f => ({ ...f, parentName: e.target.value || undefined }))} placeholder="김철수" disabled={saving} />
            </Field>
            <Field>
              <Label>보호자 연락처</Label>
              <Input value={form.guardianPhone ?? ""} onChange={(e) => setForm(f => ({ ...f, guardianPhone: e.target.value || undefined }))} placeholder="010-0000-0000" disabled={saving} />
            </Field>
            <Field style={{ gridColumn: "1 / -1" }}>
              <Label>주소</Label>
              <Input value={form.address ?? ""} onChange={(e) => setForm(f => ({ ...f, address: e.target.value || undefined }))} placeholder="서울시 강남구 ..." disabled={saving} />
            </Field>
          </Grid>
        </Section>
        {isEdit && (
          <DangerZone>
            <ZoneTitle>위험 구역</ZoneTitle>
            <ZoneDesc>삭제 기능은 추후 연결됩니다. (디자인 프리셋)</ZoneDesc>
            <DangerBtn type="button" disabled>원생 삭제</DangerBtn>
          </DangerZone>
        )}
      </Form>
      )}
    </Page>
  );
}

const Page = styled.div`
  display: grid; gap: 12px;
`;
const Header = styled.div`
  position: sticky; top: 0; z-index: 10; background: #fff;
  display: flex; align-items: center; justify-content: space-between; gap: 10px;
  padding-top: 2px;
  h2 { margin: 0; font-size: 20px; color: #0f172a; }
  p { margin: 0; color: #6b7280; }
  &:after { content: ""; display: block; position: absolute; left: 0; right: 0; bottom: -6px; height: 6px; background: linear-gradient(180deg, rgba(255,255,255,0.85), rgba(255,255,255,0)); pointer-events: none; }
`;
const HeadLeft = styled.div`
  display: flex; align-items: center; gap: 10px;
`;
const HeadActions = styled.div`
  display: inline-flex; gap: 8px;
`;
const BackBtn = styled.button`
  height: 32px; padding: 0 10px; border-radius: 8px; border: 1px solid #e5e7eb; background: #fff; color: #111827; font-weight: 800; font-size: 12px; display: inline-flex; align-items: center; gap: 6px;
`;
const Form = styled.form`
  display: grid; gap: 12px;
`;
// Section/Title from common UI
const Grid = styled.div`
  display: grid; grid-template-columns: 1fr; gap: 12px;
`;
const Field = styled.label`
  display: grid; gap: 6px; align-items: start;
` as any;
const Label = styled.div`
  color: #475569; font-size: 13px; font-weight: 800; display: inline-flex; gap: 4px; align-items: center; text-align: left;
  span { color: #ef4444; }
`;
const Input = styled.input`
  height: 42px; border: 1px solid #e5e7eb; border-radius: 10px; padding: 0 12px; font-size: 14px; color: #111827; width: 100%;
  &::placeholder { color: #9ca3af; }
  &:focus { outline: none; box-shadow: 0 0 0 3px rgba(79,70,229,0.15); }
  &:disabled { background: #f9fafb; color: #6b7280; }
`;
const Select = styled.select`
  height: 42px; border: 1px solid #e5e7eb; border-radius: 10px; padding: 0 12px; font-size: 14px; background: #fff; color: #111827; width: 100%;
  &:focus { outline: none; box-shadow: 0 0 0 3px rgba(79,70,229,0.15); }
  &:disabled { background: #f9fafb; color: #6b7280; }
`;
const TripleGrid = styled.div`
  display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px;
`;
// Buttons from common UI
const AlertError = styled.div`
  background:#fee2e2; color:#b91c1c; border:1px solid #fecaca; padding:10px 12px; border-radius:10px; font-size:13px;
`;
const AlertOk = styled.div`
  background:#dcfce7; color:#166534; border:1px solid #bbf7d0; padding:10px 12px; border-radius:10px; font-size:13px;
`;

const Help = styled.div`
  color: #6b7280; font-size: 12px;
`;

// Danger Zone (edit only)
const DangerZone = styled.section`
  background: #fff1f2; border: 1px solid #ffe4e6; border-radius: 14px; padding: 14px; display: grid; gap: 8px;
`;
const ZoneTitle = styled.div`
  color: #be123c; font-weight: 900;
`;
const ZoneDesc = styled.div`
  color: #9f1239; font-size: 12px;
`;
const DangerBtn = styled.button`
  height: 36px; padding: 0 14px; border-radius: 10px; border: 1px solid #e11d48; background: #e11d48; color: #fff; font-weight: 800; font-size: 12px; justify-self: start; opacity: 0.6; cursor: not-allowed;
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

const leftIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
