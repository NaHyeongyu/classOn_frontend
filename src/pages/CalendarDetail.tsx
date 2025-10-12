import { useNavigate, useParams } from "react-router-dom";
import CalendarDetailHeader from "@/components/calendar/detail/CalendarDetailHeader";
import ClassList from "@/components/calendar/detail/ClassList";
import CounselList from "@/components/calendar/detail/CounselList";
import TodoList from "@/components/calendar/detail/TodoList";
import { useEffect, useMemo, useState } from "react";
import SelectBox from "@/components/common/SelectBox";
import type { FormEvent } from "react";
import styled from "styled-components";
import { GhostButton as UIGhostButton, PrimaryButton as UIPrimaryButton } from "@/components/common/UI";
import { useToast } from "@/components/common/Toast";
import { formatYMD } from "@/features/calendar/dateUtils";
import { createTodo, deleteTodo, updateTodo } from "@/api/todos";
import { listCourses, createCourseRecord, type Course } from "@/api/courses";
import { invalidateCacheByPrefix } from "@/lib/fetcher";
import type { ClassItem, TaskItem } from "@/types/calendarDetail";
import { useCalendarDetail } from "@/hooks/useCalendarDetail";
import { getClassesOn } from "@/api/calendar";
import { useTodosByDate } from "@/features/todos/useTodosByDate";
import { listStudents, type Student } from "@/api/students";
import { createCounsel, listCounsels, type Counsel, type PageResult as PageCounsel } from "@/api/counsels";
import { invalidateTodosCache } from "@/features/todos/cache";
import { formatPhone } from "@/lib/format";
import { readableError } from "@/lib/errors";
import {
  DetailPage,
  DetailColumns,
  DetailLeft,
  DetailRight,
} from "@/components/calendar/detail/DetailLayout";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";

export default function CalendarDetail() {
  const navigate = useNavigate();
  const { ymd } = useParams();
  const { warning } = useToast();
  const { confirm: confirmDelete, dialog: confirmDeleteDialog } = useConfirmDialog({
    confirmLabel: "삭제",
    cancelLabel: "취소",
    tone: "danger",
  });
  const ymdSafe = ymd ?? formatYMD(new Date());
  const { label, classes: classesDerived, counsels, prevYMD, nextYMD, todayYMD } =
    useCalendarDetail(ymdSafe);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [counselItems, setCounselItems] = useState<typeof counsels>([]);
  // Add-class modal state
  const [addOpen, setAddOpen] = useState(false);
  const [courseRows, setCourseRows] = useState<Course[]>([]);
  const [courseFilter, setCourseFilter] = useState("");
  const [courseBusy, setCourseBusy] = useState(false);
  const [courseErr, setCourseErr] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  // Selected time parts are managed by startHour/min, endHour/min
  const [savingClass, setSavingClass] = useState(false);
  const [addErr, setAddErr] = useState<string | null>(null);
  function numOr(...vals: unknown[]): number {
    for (const v of vals) {
      if (typeof v === 'number' && Number.isFinite(v)) return v as number;
    }
    return 0;
  }
  type RawRow = {
    startTime?: string; start_at?: string; startAt?: string; start?: string;
    endTime?: string; end_at?: string; endAt?: string; end?: string;
    courseTitle?: string; courseId?: number; recordDate?: string; date?: string; recordId?: number; id?: number;
    topic?: string; notes?: string; content?: string;
    attPresent?: number; presentCount?: number; attendancePresent?: number;
    attAbsent?: number; absentCount?: number; attendanceAbsent?: number;
    attUnprocessed?: number;
    attendance?: { present?: number; absent?: number };
  };
  function cleanNotes(s?: string | null): string | null {
    if (!s) return null;
    const t = String(s).trim();
    if (t === '정기 수업' || t === '정기수업') return null;
    return t || null;
  }
  function mapRows(list: RawRow[]): ClassItem[] {
    return list.map((r) => {
      const s = r.startTime ?? r.start_at ?? r.startAt ?? r.start ?? null;
      const e = r.endTime ?? r.end_at ?? r.endAt ?? r.end ?? null;
      const present = numOr(r.attPresent, r.presentCount, r.attendancePresent, r?.attendance?.present);
      const absent = numOr(r.attAbsent, r.absentCount, r.attendanceAbsent, r?.attendance?.absent);
      const unprocessed = numOr(r.attUnprocessed);
      const notes = cleanNotes(r.notes || r.content || (r as any).topic || null);
      return {
        subject: r.courseTitle || '수업',
        time: formatRange(s, e),
        room: '-',
        teacher: '-',
        student: '-',
        done: false,
        courseId: r.courseId || undefined,
        date: r.recordDate || r.date || ymdSafe,
        recordId: r.recordId || r.id,
        notes,
        attPresent: present,
        attAbsent: absent,
        attUnprocessed: unprocessed,
      } as ClassItem;
    });
  }

  // Load classes via unified API (same as dashboard)
  useMemo(() => { void 0; }, []);
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const list = await getClassesOn(ymdSafe);
        if (cancelled) return;
        setClasses(mapRows(list));
      } catch {
        if (!cancelled) {
          // fallback to derived client-side list to avoid blank
          setClasses(classesDerived);
        }
      }
    }
    void load();
    return () => { cancelled = true; };
  }, [ymdSafe, classesDerived]);

  // Keep local counselItems in sync with hook
  useEffect(() => { setCounselItems(counsels); }, [counsels]);


  const { data, error, refresh } = useTodosByDate(ymdSafe);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formNotes, setFormNotes] = useState("");

  // 데이터 로딩은 useTodosByDate 훅으로 일원화됨

  async function onAdd() {
    setEditingId(null);
    setFormTitle("");
    setFormNotes("");
    setOpen(true);
  }

  function onEdit(id: number) {
    const t = (data || []).find((x) => x.id === id);
    if (!t) return;
    setEditingId(id);
    setFormTitle(t.title);
    setFormNotes(t.notes || "");
    setOpen(true);
  }

  const [todoErr, setTodoErr] = useState<string | null>(null);
  async function onSubmitModal(e: FormEvent) {
    e.preventDefault();
    if (!formTitle.trim()) { setTodoErr('제목을 입력해 주세요.'); return; }
    const calendarDate = ymdSafe;
    try {
      if (editingId == null) {
        const created = await createTodo({
          title: formTitle.trim(),
          notes: formNotes || undefined,
          calendarDate,
        });
        void created; // suppress unused var in no-op since we refresh
        invalidateTodosCache(ymdSafe);
        await refresh();
      } else {
        const updated = await updateTodo(editingId, {
          title: formTitle.trim(),
          notes: formNotes || undefined,
        });
        void updated;
        invalidateTodosCache(ymdSafe);
        await refresh();
      }
      setOpen(false);
      setTodoErr(null);
    } catch (e) {
      setMutationError(readableError(e, "저장에 실패했습니다."));
    }
  }
  // Toggle removed in UI; status changes handled in detail edit or future bulk actions

  async function onDelete(id: number) {
    const target = (data || []).find((item) => item.id === id);
    const confirmed = await confirmDelete({
      title: "할 일을 삭제할까요?",
      message: target?.title ? `"${target.title}" 항목을 삭제합니다. 되돌릴 수 없습니다.` : "선택한 할 일을 삭제합니다. 되돌릴 수 없습니다.",
    });
    if (!confirmed) return;
    try {
      await deleteTodo(id);
      invalidateTodosCache(ymdSafe);
      await refresh();
    } catch (e) {
      setMutationError(readableError(e, "삭제에 실패했습니다."));
    }
  }

  // Launch add-class modal
  async function onAddClass() {
    setAddOpen(true);
    setAddErr(null);
    if (courseRows.length === 0) {
      setCourseBusy(true); setCourseErr(null);
      try {
        const res = await listCourses({ status: "IN_PROGRESS", size: 200 });
        setCourseRows(res.content);
      } catch (e) {
        setCourseErr(readableError(e, "수업 목록을 불러오지 못했습니다."));
      } finally {
        setCourseBusy(false);
      }
    }
  }
  function onPickCourse(c: Course) {
    setSelectedCourse(c);
    const s = toHHMM(c.startTime) || '00:00';
    const e = toHHMM(c.endTime) || '00:00';
    try { const [sh, sm] = s.split(":"); setStartHour(sh); setStartMin(sm); } catch { /* noop */ }
    try { const [eh, em] = e.split(":"); setEndHour(eh); setEndMin(em); } catch { /* noop */ }
    setAddErr(null);
  }
  async function onSaveClass() {
    if (!selectedCourse) { warning("수업 템플릿을 선택해 주세요."); return; }
    const start = toHHMMSS(`${(startHour||'00').padStart(2,'0')}:${(startMin||'00').padStart(2,'0')}`);
    const end = toHHMMSS(`${(endHour||'00').padStart(2,'0')}:${(endMin||'00').padStart(2,'0')}`);
    setSavingClass(true);
    setAddErr(null);
    try {
      await createCourseRecord(selectedCourse.id, { recordDate: ymdSafe, startTime: start, endTime: end });
      invalidateCacheByPrefix('/api/calendar/classes');
      invalidateCacheByPrefix('/api/calendar/classes-range');
      const list = await getClassesOn(ymdSafe);
      setClasses(mapRows(list));
      setAddOpen(false);
      setSelectedCourse(null);
    } catch (e) {
      const msg = readableError(e, '');
      if (msg.includes('HTTP 409')) setAddErr('이미 등록된 수업이 있습니다.');
      else setAddErr('수업 추가에 실패했습니다.');
    } finally {
      setSavingClass(false);
    }
  }

  const inProgress: TaskItem[] = useMemo(
    () =>
      (data || [])
        .filter((t) => t.status !== "DONE")
        .map((t) => ({
          id: t.id,
          title: t.title,
          content: t.notes,
          done: false,
        })),
    [data]
  );
  const done: TaskItem[] = useMemo(
    () =>
      (data || [])
        .filter((t) => t.status === "DONE")
        .map((t) => ({
          id: t.id,
          title: t.title,
          content: t.notes,
          done: true,
        })),
    [data]
  );

  // Counsel add modal state
  const [counselOpen, setCounselOpen] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [studFilter, setStudFilter] = useState("");
  const [studBusy, setStudBusy] = useState(false);
  const [studErr, setStudErr] = useState<string | null>(null);
  const [selStudent, setSelStudent] = useState<Student | null>(null);
  const [counselTime, setCounselTime] = useState(""); // HH:mm (kept for compatibility)
  const [counselNote, setCounselNote] = useState("");
  const [savingCounsel, setSavingCounsel] = useState(false);
  const [counselErr, setCounselErr] = useState<string | null>(null);
  // Time pickers: hours (00-23) and minutes (00,05,...,55)
  const hours24 = useMemo(() => Array.from({ length: 24 }, (_, h) => String(h).padStart(2, '0')), []);
  const mins5 = useMemo(() => ['00','05','10','15','20','25','30','35','40','45','50','55'], []);
  // Counsel time (split)
  const [counselHour, setCounselHour] = useState<string>("");
  const [counselMin, setCounselMin] = useState<string>("");
  // Class add time (split)
  const [startHour, setStartHour] = useState<string>("");
  const [startMin, setStartMin] = useState<string>("");
  const [endHour, setEndHour] = useState<string>("");
  const [endMin, setEndMin] = useState<string>("");

  async function onAddCounsel() {
    setCounselOpen(true);
    setCounselErr(null);
    // Default to no time selected; user must choose hour/min explicitly
    setCounselHour("");
    setCounselMin("");
    setCounselTime("");
    if (students.length === 0) {
      setStudBusy(true); setStudErr(null);
      try {
        const res = await listStudents({ status: 'ENROLLED', size: 200 });
        setStudents(res.content);
      } catch (e) {
        setStudErr(readableError(e, '학생 목록을 불러오지 못했습니다.'));
      } finally { setStudBusy(false); }
    }
  }
  function onPickStudent(s: Student) { setSelStudent(s); setCounselErr(null); }
  function isoFromYmdHm(ymd: string, hm: string) {
    if (!hm || !/^\d{2}:\d{2}$/.test(hm)) return `${ymd}T00:00:00`;
    return `${ymd}T${hm}:00`;
  }
  async function onSaveCounsel() {
    if (!selStudent) { setCounselErr('학생을 선택해 주세요.'); return; }
    const hm = (counselHour && counselMin) ? `${counselHour}:${counselMin}` : "";
    if (!hm) { setCounselErr('시간을 선택해 주세요.'); return; }
    const iso = isoFromYmdHm(ymdSafe, hm);
    setSavingCounsel(true);
    setCounselErr(null);
    try {
      await createCounsel({ studentId: selStudent.id, counselTime: iso, content: counselNote || undefined });
      // Refresh counsel list for the day
      const res: PageCounsel<Counsel> = await listCounsels({ onYmd: ymdSafe, size: 50 });
      const items = (res.content || []).map(c => ({ id: c.id, studentId: c.studentId, time: c.counselTime.replace('T',' ').slice(11,16), title: (c.content||'').split(/\r?\n/)[0] || '상담', with: c.studentName, owner: '-', done: c.status === 'CONVERTED' }));
      setCounselItems(items);
      setCounselOpen(false);
      setSelStudent(null); setCounselTime(""); setCounselNote("");
    } catch (e) {
      setCounselErr(readableError(e, '상담 추가에 실패했습니다.'));
    } finally { setSavingCounsel(false); }
  }

  return (
    <DetailPage>
      {confirmDeleteDialog}
      <CalendarDetailHeader
        label={label}
        onBack={() => navigate('/calendar')}
        onPrev={() => navigate(`/calendar/${prevYMD()}`)}
        onNext={() => navigate(`/calendar/${nextYMD()}`)}
        onToday={() => navigate(`/calendar/${todayYMD()}`)}
      />
      <DetailColumns>
        <DetailLeft>
          <TodoList
            inProgress={inProgress}
            done={done}
            onAdd={onAdd}
            onDelete={onDelete}
            onEdit={onEdit}
          />
          <CounselList items={counselItems} onAdd={onAddCounsel} onDetail={(studentId) => navigate(`/students/${studentId}/counsels`)} />
        </DetailLeft>
        <DetailRight>
          <ClassList items={classes} titleMode="subject" showNotes={true} onAdd={onAddClass} />
          {open && (
            <ModalBackdrop onClick={() => setOpen(false)}>
              <ModalCard onClick={(e) => e.stopPropagation()}>
                <ModalTitle>
                  {editingId == null ? "할 일 추가" : "할 일 수정"}
                </ModalTitle>
                <form onSubmit={onSubmitModal} noValidate>
                  <Label>제목<span>*</span></Label>
                  <Input
                    value={formTitle}
                    onChange={(e) => { setFormTitle(e.target.value); if (todoErr) setTodoErr(null); }}
                    placeholder="예: 상담 준비"
                    aria-invalid={!!todoErr}
                  />
                  {todoErr && <Err>{todoErr}</Err>}
                  <Label>메모 (선택)</Label>
                  <TextArea
                    rows={4}
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    placeholder="세부 내용 또는 참고사항"
                  />
                  <BtnRow>
                    <UIGhostButton type="button" onClick={() => setOpen(false)}>취소</UIGhostButton>
                    <UIPrimaryButton type="submit">저장</UIPrimaryButton>
                  </BtnRow>
                </form>
              </ModalCard>
            </ModalBackdrop>
          )}
          {counselOpen && (
            <ModalBackdrop onClick={() => setCounselOpen(false)}>
              <ModalCard onClick={(e) => e.stopPropagation()}>
                <ModalTitle>상담 추가</ModalTitle>
                <Label>학생 선택</Label>
                <Input placeholder="학생 검색…" value={studFilter} onChange={(e)=>setStudFilter(e.target.value)} />
                <StudentList>
                  {studBusy && <Muted>불러오는 중…</Muted>}
                  {studErr && <Err>{studErr}</Err>}
                  {!studBusy && !studErr && (
                    (students||[])
                      .filter(s => !studFilter || s.name.toLowerCase().includes(studFilter.toLowerCase()) || (s.code||'').toLowerCase().includes(studFilter.toLowerCase()))
                      .map(s => (
                        <StudentRow key={s.id} type="button" data-selected={selStudent?.id===s.id}
                          onClick={()=>onPickStudent(s)} onKeyDown={(e)=>{ if(e.key==='Enter' || e.key===' ') { e.preventDefault(); onPickStudent(s);} }}>
                          <div>
                            <strong>{s.name}</strong>
                            <SmallText style={{ marginLeft: 8 }}>{s.code}</SmallText>
                          </div>
                          <SmallText>{formatPhone(s.phoneNumber)}</SmallText>
                        </StudentRow>
                      ))
                  )}
                </StudentList>
                <div style={{ marginTop: 8 }}>
                  {selStudent ? (
                    <SelectedBox>
                      <span className="label">선택된 학생</span>
                      <span className="name">{selStudent.name}</span>
                      {selStudent.code && <SmallText style={{ marginLeft: 6 }}>{selStudent.code}</SmallText>}
                    </SelectedBox>
                  ) : (
                    <Muted>학생을 선택해 주세요.</Muted>
                  )}
                </div>
                <Label style={{ marginTop: 10 }}>시간</Label>
                <Row>
                  <div style={{ flex: 1 }}>
                    <SelectBox ariaLabel="시" value={counselHour} onChange={setCounselHour} placeholder="시"
                      options={hours24.map(h => ({ label: h, value: h }))} />
                  </div>
                  <span>:</span>
                  <div style={{ flex: 1 }}>
                    <SelectBox ariaLabel="분" value={counselMin} onChange={setCounselMin} placeholder="분"
                      options={mins5.map(m => ({ label: m, value: m }))} />
                  </div>
                </Row>
                <Label style={{ marginTop: 10 }}>메모 (선택)</Label>
                <TextArea rows={3} value={counselNote} onChange={(e)=>setCounselNote(e.target.value)} placeholder="상담 메모" />
                {counselErr && <Err>{counselErr}</Err>}
                <BtnRow>
                  <UIGhostButton type="button" onClick={() => setCounselOpen(false)}>취소</UIGhostButton>
                  <UIPrimaryButton type="button" disabled={savingCounsel || !counselHour || !counselMin || !selStudent} onClick={onSaveCounsel}>{savingCounsel ? '저장 중…' : '저장'}</UIPrimaryButton>
                </BtnRow>
              </ModalCard>
            </ModalBackdrop>
          )}
          {addOpen && (
            <ModalBackdrop onClick={() => setAddOpen(false)}>
              <ModalCard onClick={(e) => e.stopPropagation()}>
                <ModalTitle>수업 추가</ModalTitle>
                <Label>수업 템플릿 선택</Label>
                <Input
                  placeholder="검색어로 필터…"
                  value={courseFilter}
                  onChange={(e) => setCourseFilter(e.target.value)}
                />
                <CourseList>
                  {courseBusy && <Muted>불러오는 중…</Muted>}
                  {courseErr && <Err>{courseErr}</Err>}
                  {!courseBusy && !courseErr && (
                    (courseRows || [])
                      .filter(c => !courseFilter || (c.title?.toLowerCase().includes(courseFilter.toLowerCase()) || c.code?.toLowerCase().includes(courseFilter.toLowerCase())))
                      .map(c => (
                        <CourseRow key={c.id} data-selected={selectedCourse?.id === c.id} onClick={() => onPickCourse(c)}>
                          <div>
                            <strong>{c.title}</strong>
                            <SmallText style={{ marginLeft: 8 }}>{c.code}</SmallText>
                          </div>
                          <SmallText>{formatRange(c.startTime, c.endTime)}</SmallText>
                        </CourseRow>
                      ))
                  )}
                </CourseList>
                <Label style={{ marginTop: 10 }}>시간</Label>
                <Row>
                  <TimeSelect>
                    <SelectBox
                      ariaLabel="시"
                      value={startHour}
                      onChange={setStartHour}
                      placeholder="시"
                      options={hours24.map((h) => ({ label: h, value: h }))}
                    />
                  </TimeSelect>
                  <span>:</span>
                  <TimeSelect>
                    <SelectBox
                      ariaLabel="분"
                      value={startMin}
                      onChange={setStartMin}
                      placeholder="분"
                      options={mins5.map((m) => ({ label: m, value: m }))}
                    />
                  </TimeSelect>
                  <span>~</span>
                  <TimeSelect>
                    <SelectBox
                      ariaLabel="시"
                      value={endHour}
                      onChange={setEndHour}
                      placeholder="시"
                      options={hours24.map((h) => ({ label: h, value: h }))}
                    />
                  </TimeSelect>
                  <span>:</span>
                  <TimeSelect>
                    <SelectBox
                      ariaLabel="분"
                      value={endMin}
                      onChange={setEndMin}
                      placeholder="분"
                      options={mins5.map((m) => ({ label: m, value: m }))}
                    />
                  </TimeSelect>
                </Row>
                {addErr && <Err>{addErr}</Err>}
                <BtnRow>
                  <UIGhostButton type="button" onClick={() => setAddOpen(false)}>취소</UIGhostButton>
                  <UIPrimaryButton type="button" disabled={savingClass} onClick={onSaveClass}>{savingClass ? '저장 중…' : '저장'}</UIPrimaryButton>
                </BtnRow>
              </ModalCard>
            </ModalBackdrop>
          )}
          {(error || mutationError) && (
            <div style={{ color: "#b91c1c", marginTop: 8 }}>
              {mutationError || error}
            </div>
          )}
        </DetailRight>
      </DetailColumns>
    </DetailPage>
  );
}

const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.28);
  display: grid;
  place-items: center;
  z-index: 1200;
`;
const ModalCard = styled.div`
  width: 480px;
  max-width: calc(100% - 32px);
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  box-shadow: 0 8px 28px rgba(2, 6, 23, 0.08);
  padding: 18px;
`;
  const ModalTitle = styled.h3`
  margin: 0 0 10px;
  font-size: 17px;
  font-weight: 700;
  color: #111827;
`;
const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;
const TimeSelect = styled.div`
  flex: 1;
  min-width: 0;
`;
const CourseList = styled.div` max-height: 220px; overflow: auto; border: 1px solid #f1f5f9; border-radius: 10px; margin-top: 6px; background: #fff; `;
const CourseRow = styled.div`
  padding: 8px 10px; display:flex; align-items:center; justify-content:space-between; cursor:pointer;
  border-bottom: 1px solid #f1f5f9;
  &[data-selected='true']{ background:#eef2ff; }
  &:hover{ background:${({ theme }) => theme.colors.surfaceMuted}; }
`;
// Separate list styles for student picker (use button for better accessibility)
const StudentList = styled(CourseList)``;
const StudentRow = styled.button`
  width: 100%; text-align: left; background: transparent; border: 0; padding: 8px 10px; display:flex; align-items:center; justify-content:space-between; cursor:pointer;
  border-bottom: 1px solid #f1f5f9;
  &[data-selected='true']{ background:#eef2ff; }
  &:hover{ background:${({ theme }) => theme.colors.surfaceMuted}; }
`;
const Err = styled.div` color:#b91c1c; font-size:12px; margin-top:6px; `;

function hhmm(s?: string | null) {
  if (!s) return "--:--";
  try {
    const str = String(s);
    const m = str.match(/(\d{2}):(\d{2})/);
    return m ? `${m[1]}:${m[2]}` : "--:--";
  } catch { return "--:--"; }
}
function formatRange(start?: string | null, end?: string | null) {
  return `${hhmm(start)} ~ ${hhmm(end)}`;
}
function toHHMM(s?: string | null) { if (!s) return ""; try { const str = String(s); const m = str.match(/(\d{2}):(\d{2})/); return m ? `${m[1]}:${m[2]}` : ""; } catch { return ""; } }
function toHHMMSS(s: string): string | undefined { if (!s) return undefined; const [h,m] = s.split(":"); return `${h?.padStart(2,'0')}:${m?.padStart(2,'0')}:00`; }
function nowHHMM5() { const d=new Date(); let h=d.getHours(), m=d.getMinutes(); const r=Math.round(m/5)*5; if (r===60) { h=(h+1)%24; m=0; } else m=r; return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`; }
const Label = styled.label`
  display: block;
  margin: 8px 0 6px;
  font-size: 12px;
  color: #6b7280;
  span { color: #ef4444; margin-left: 4px; }
`;
const Input = styled.input`
  width: 100%;
  height: 40px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 12px;
  &[aria-invalid='true'] {
    border-color: #ef4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.12);
  }
`;
const Select = styled.select`
  width: 100%;
  height: 40px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 8px;
  background: #fff;
`;
const TextArea = styled.textarea`
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 8px 12px;
  resize: vertical;
`;
const BtnRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
`;
// Buttons from common UI
const SmallText = styled.span` color:#9ca3af; font-size:12px; `;
const Muted = styled.div` color:#6b7280; font-size:12px; `;
const SelectedBox = styled.div`
  display: inline-flex; align-items: center; gap: 8px; padding: 6px 10px; border:1px solid #c7d2fe; background:#eef2ff; color:#1f2937; border-radius: 8px; font-size: 13px;
  .label { color:#4f46e5; font-weight: 800; }
  .name { font-weight: 800; }
`;
