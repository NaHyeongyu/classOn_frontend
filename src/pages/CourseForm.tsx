import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { GhostBtn as UIGhostBtn, PrimaryBtn as UIPrimaryBtn, buttonVariants } from "../components/common/UI";
import { SectionCard as Section, TitleH3 as Title } from "../components/common/UI";
import { createCourse, getCourse, type Course, updateCourse } from "../api/courses";
import { formatMoney } from "../lib/format";

export default function CourseForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = useMemo(() => !!id, [id]);
  const numericId = useMemo(() => (id ? Number(id) : null), [id]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErr, setFieldErr] = useState<{ title?: string; schedule?: string }>({});

  const [form, setForm] = useState<{ title: string; description?: string; status: Course["status"]; capacity?: number; fee?: number; courseTime?: string; recurrenceDays?: string; startTime?: string; endTime?: string; }>({
    title: "",
    description: "",
    status: "IN_PROGRESS",
  });
  const [feeInput, setFeeInput] = useState<string>("");
  const toggleDay = useToggleDay(form, setForm);
  const [recurring, setRecurring] = useState(true);

  function pad2(n: number) { return String(n).padStart(2, '0'); }
  function formatNumberKR(n: number | string): string {
    const digits = String(n ?? '').replace(/[^0-9]/g, '');
    if (!digits) return '';
    return Number(digits).toLocaleString('ko-KR');
  }

  useEffect(() => {
    if (!isEdit || !numericId) return;
    let cancelled = false;
    async function load() {
      setLoading(true); setError(null);
      try {
        const found = await getCourse(numericId as number);
        if (!cancelled && found) {
          setForm({
            title: found.title,
            description: found.description,
            status: found.status,
            capacity: found.capacity,
            fee: found.fee,
            courseTime: found.courseTime,
            recurrenceDays: found.recurrenceDays,
            startTime: found.startTime ? found.startTime.slice(0,5) : "",
            endTime: found.endTime ? found.endTime.slice(0,5) : "",
          });
          setFeeInput(found.fee != null ? formatNumberKR(found.fee as any) : "");
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "수업 정보를 불러오지 못했습니다.");
      } finally { if (!cancelled) setLoading(false); }
    }
    void load();
    return () => { cancelled = true; };
  }, [isEdit, numericId]);


  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setSuccess(null); setFieldErr({});
    if (!form.title || !form.title.trim()) { setFieldErr(prev=>({ ...prev, title: '수업명을 입력해 주세요.' })); return; }
    setSaving(true);
    try {
      // validation: recurrence days/time required
      if (recurring && (!form.recurrenceDays || !form.recurrenceDays.trim() || !form.startTime || !form.endTime)) {
        setFieldErr(prev=>({ ...prev, schedule: '반복 요일과 시작/종료 시간을 선택해 주세요.' }));
        return;
      }
      if (isEdit && numericId) {
        await updateCourse(numericId, {
          ...form,
          // send LocalTime-compatible strings (HH:mm:ss)
          startTime: form.startTime?.length === 5 ? `${form.startTime}:00` : form.startTime,
          endTime: form.endTime?.length === 5 ? `${form.endTime}:00` : form.endTime,
          recurring,
        });
        setSuccess("수정이 완료되었습니다.");
      } else {
        await createCourse({
          ...form,
          startTime: form.startTime?.length === 5 ? `${form.startTime}:00` : form.startTime,
          endTime: form.endTime?.length === 5 ? `${form.endTime}:00` : form.endTime,
          recurring,
        });
        setSuccess("수업이 추가되었습니다.");
      }

      // 학생 추가는 편집 화면에서 즉시 반영하므로 여기서는 별도 처리 없음
      navigate(`/classes`, { replace: true });
    } catch (e: any) {
      setError(e?.message || "저장에 실패했습니다.");
    } finally { setSaving(false); }
  }

  return (
    <Wrap>
      <Head>
        <BackBtn type="button" onClick={() => navigate("/classes")}>{leftIcon} 뒤로</BackBtn>
        <h2>{isEdit ? "수업 수정" : "수업 추가하기"}</h2>
        <Actions>
          <UIGhostBtn as={"button" as any} onClick={() => navigate("/classes")}>취소</UIGhostBtn>
          <UIPrimaryBtn as={"button" as any} type="submit" form="course-form" disabled={saving}>{saving ? "저장 중..." : "저장"}</UIPrimaryBtn>
        </Actions>
      </Head>
      {error && <AlertError>{error}</AlertError>}
      {success && <AlertOk>{success}</AlertOk>}
          {loading ? <FormSk /> : (
        <Form id="course-form" onSubmit={onSubmit}>
          <Section>
            <Title>기본 정보</Title>
            <GridOne>
              <Field>
                <Label>수업명<span>*</span></Label>
                <Input aria-invalid={!!fieldErr.title} value={form.title} onChange={(e)=>{ setForm(f=>({...f, title:e.target.value})); if (fieldErr.title) setFieldErr(prev=>({...prev, title: undefined})); }} placeholder="예: 영어 회화 A반" />
                {fieldErr.title ? <FieldErr>{fieldErr.title}</FieldErr> : null}
              </Field>
              <Field>
                <Label>상태</Label>
                <Select value={form.status} onChange={(e)=>setForm(f=>({...f, status:e.target.value as any}))}>
                  <option value="IN_PROGRESS">진행중</option>
                  <option value="PENDING">대기</option>
                  <option value="STOPPED">중단</option>
                </Select>
              </Field>
              { /* courseTime free-text removed; derived from recurrence/time */ }
              <Field>
                <Label>반복 여부</Label>
                <Toggle>
                  <input id="recurring" type="checkbox" checked={recurring} onChange={(e)=>setRecurring(e.currentTarget.checked)} />
                  <label htmlFor="recurring">정기 반복</label>
                </Toggle>
              </Field>
              <Field>
                <Label>반복 요일</Label>
                <DayChips aria-disabled={!recurring}>
                  {dayOptions.map(d => {
                    const active = hasDay(form.recurrenceDays, d.value);
                    return (
                      <ChipBtn type="button" key={d.value} data-active={active} disabled={!recurring}
                        onClick={()=> toggleDay(d.value, !active)}>{d.label}</ChipBtn>
                    );
                  })}
                </DayChips>
                <Hint>예: 월/수는 MON,WED 로 저장됩니다.</Hint>
              </Field>
              <Field>
                <Label>반복 시간</Label>
                <TimeRow>
                  <select disabled={!recurring}
                    value={(form.startTime ?? '').slice(0,2) || '00'}
                    onChange={(e)=>{
                      const hh = e.target.value;
                      const mm = (form.startTime ?? '00:00').slice(3,5) || '00';
                      setForm(f=>({...f, startTime: `${hh}:${mm}`}));
                    }}
                  >
                    {Array.from({length:24}, (_,i)=>pad2(i)).map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                  <span>:</span>
                  <select disabled={!recurring}
                    value={(form.startTime ?? '').slice(3,5) || '00'}
                    onChange={(e)=>{
                      const mm = e.target.value;
                      const hh = (form.startTime ?? '00:00').slice(0,2) || '00';
                      setForm(f=>({...f, startTime: `${hh}:${mm}`}));
                    }}
                  >
                    {['00','05','10','15','20','25','30','35','40','45','50','55'].map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <span>~</span>
                  <select disabled={!recurring}
                    value={(form.endTime ?? '').slice(0,2) || '00'}
                    onChange={(e)=>{
                      const hh = e.target.value;
                      const mm = (form.endTime ?? '00:00').slice(3,5) || '00';
                      setForm(f=>({...f, endTime: `${hh}:${mm}`}));
                    }}
                  >
                    {Array.from({length:24}, (_,i)=>pad2(i)).map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                  <span>:</span>
                  <select disabled={!recurring}
                    value={(form.endTime ?? '').slice(3,5) || '00'}
                    onChange={(e)=>{
                      const mm = e.target.value;
                      const hh = (form.endTime ?? '00:00').slice(0,2) || '00';
                      setForm(f=>({...f, endTime: `${hh}:${mm}`}));
                    }}
                  >
                    {['00','05','10','15','20','25','30','35','40','45','50','55'].map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </TimeRow>
                <Hint>시/분을 고정 옵션으로 선택합니다(5분 단위).</Hint>
                {fieldErr.schedule ? <FieldErr>{fieldErr.schedule}</FieldErr> : null}
              </Field>
              <Field>
                <Label>정원</Label>
                <Input type="number" value={form.capacity ?? ""} onChange={(e)=>setForm(f=>({...f, capacity: e.target.value? Number(e.target.value): undefined}))} placeholder="예: 12" />
              </Field>
              <Field>
                <Label>수강료</Label>
                <FeeWrap>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={feeInput}
                    onChange={(e)=>{
                      const digits = (e.target.value || '').replace(/[^0-9]/g, '');
                      setFeeInput(formatNumberKR(digits));
                      setForm(f=>({ ...f, fee: digits ? Number(digits) : undefined }));
                    }}
                    placeholder="예: 150,000"
                    style={{ paddingRight: 38 }}
                  />
                  <Suffix>원</Suffix>
                </FeeWrap>
                <Hint>천 단위 구분으로 가독성을 높였습니다.</Hint>
              </Field>
              <Field style={{ gridColumn: "1 / -1" }}>
                <Label>설명</Label>
                <TextArea rows={5} value={form.description ?? ""} onChange={(e)=>setForm(f=>({...f, description:e.target.value}))} placeholder="수업에 대한 간단한 설명" />
              </Field>
            </GridOne>
          </Section>

          <Section>
            <Title>학생 관리</Title>
            <Hint>학생 관리는 상세 페이지의 ‘수강생 수정’에서 변경하세요.</Hint>
            {isEdit && (
              <div>
                <UIGhostBtn as={"button" as any} onClick={()=>navigate(`/classes/${numericId}/edit-students`)}>수강생 수정 바로가기</UIGhostBtn>
              </div>
            )}
          </Section>
        </Form>
      )}
    </Wrap>
  );
}

const Wrap = styled.div` display:grid; gap:12px; `;
const Head = styled.div` display:grid; grid-template-columns:auto 1fr auto; gap:12px; align-items:center; `;
const Actions = styled.div` display:inline-flex; gap:8px; `;
const Form = styled.form`
  display: grid;
  gap: 12px;
  /* 3.5 : 6.5 ratio (35% : 65%) */
  grid-template-columns: 7fr 13fr;
  align-items: start;
  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;
// Section, Title from common UI
const GridOne = styled.div` display:grid; grid-template-columns: 1fr; gap:12px; `;
const Field = styled.label` display:grid; gap:6px; ` as any;
const Label = styled.div` color:#6b7280; font-size:12px; font-weight:700; span{ color:#ef4444; }`;
const Input = styled.input` height:38px; border:1px solid #e5e7eb; border-radius:10px; padding:0 10px; font-size:14px; `;
const FeeWrap = styled.div` position: relative; display:block; `;
const Suffix = styled.span`
  position:absolute; right:10px; top:50%; transform: translateY(-50%);
  color:#6b7280; font-size:13px;
`;
const Select = styled.select`
  height:38px; border:1px solid #e5e7eb; border-radius:10px; padding:0 10px; font-size:14px; background:#fff;
  &:focus { outline:none; border-color:#6366f1; box-shadow:0 0 0 3px rgba(99,102,241,.12); }
`;
const TextArea = styled.textarea`
  border:1px solid #e5e7eb; border-radius:10px; padding:10px; font-size:14px; resize:vertical; background:#fff;
  &:focus { outline:none; border-color:#6366f1; box-shadow:0 0 0 3px rgba(99,102,241,.12); }
`;
const Hint = styled.div` color:#6b7280; font-size:12px; `;
const FieldErr = styled.div` color:#b91c1c; font-size:12px; margin-top:4px; `;
const Days = styled.div` display:flex; flex-wrap:wrap; gap:10px; `;
const DayChips = styled.div` display:flex; flex-wrap:wrap; gap:8px; `;
const ChipBtn = styled.button`
  height:32px; padding:0 12px; border-radius:999px; border:1px solid #e5e7eb; background:#fff; font-size:13px; color:#111827;
  &[data-active='true'] { background:#111827; color:#fff; border-color:#111827; }
  &:disabled { opacity:0.6; cursor:not-allowed; }
`;
const TimeRow = styled.div` display:grid; grid-template-columns: 1fr auto 1fr auto 1fr auto 1fr; gap:8px; align-items:center; `;
// Buttons from common UI
const AlertError = styled.div` background:#fee2e2; color:#b91c1c; border:1px solid #fecaca; padding:10px 12px; border-radius:10px; font-size:13px; `;
const AlertOk = styled.div` background:#dcfce7; color:#166534; border:1px solid #bbf7d0; padding:10px 12px; border-radius:10px; font-size:13px; `;
// removed unused Muted style

const shimmer = keyframes` 0%{ background-position:-200px 0; } 100%{ background-position:200px 0; }`;
const Sk = styled.div<{h?:number}>` background:linear-gradient(90deg,#eef2f7 25%,#f6f8fb 37%,#eef2f7 63%); background-size:400px 100%; animation:${shimmer} 1.2s ease-in-out infinite; border-radius:8px; width:100%; height:${p=>p.h||12}px; `;
function FormSk(){
  return (
    <Section>
      <Title>기본 정보</Title>
      <GridOne>
        <Sk h={38}/><Sk h={38}/><Sk h={38}/><Sk h={38}/><Sk h={120}/>
      </GridOne>
    </Section>
  );
}

const BackBtn = styled.button`
  ${buttonVariants.outline};
  height: 36px;
  padding: 0 14px;
  font-weight: 600;
  font-size: 13px;
`;
const leftIcon = (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>);

const dayOptions = [
  { value: "MON", label: "월" },
  { value: "TUE", label: "화" },
  { value: "WED", label: "수" },
  { value: "THU", label: "목" },
  { value: "FRI", label: "금" },
  { value: "SAT", label: "토" },
  { value: "SUN", label: "일" },
];

function hasDay(recurrenceDays?: string, d?: string) {
  if (!recurrenceDays || !d) return false;
  return recurrenceDays.split(',').map(s=>s.trim().toUpperCase()).includes(d);
}

function joinDays(list: string[]) {
  return Array.from(new Set(list)).filter(Boolean).join(',');
}

function useToggleDay(form: any, setForm: any) {
  return (d: string, checked: boolean) => {
    const current = (form.recurrenceDays || '').split(',').map((s:string)=>s.trim()).filter((s:string)=>s);
    const next = checked ? [...current, d] : current.filter((x:string)=>x!==d);
    setForm((f:any)=>({...f, recurrenceDays: joinDays(next)}));
  };
}
const Toggle = styled.div` display:inline-flex; gap:8px; align-items:center; input[type='checkbox']{ width:18px; height:18px; }`;
