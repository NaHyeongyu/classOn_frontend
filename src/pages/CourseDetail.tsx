import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { SectionCard as Section, TitleH3 as Title, GhostBtn as UIGhostBtn, GhostBtnSmall as UIGhostBtnSmall, PrimaryBtn as UIPrimaryBtn, TableBase as UITable } from "../components/common/UI";
import ConfirmDialog from "../components/common/ConfirmDialog";
import { getCourse, type Course, type CourseRecord, listCourseStudents, listCourseRecords, listRecordAttendance, deleteCourse } from "../api/courses";
import { listStudents, type Student } from "../api/students";
import { KPI, UsersIcon, ClassIcon, CheckIcon, DeltaPill } from "../components/dashboard/KPI";
import { formatPhone } from "../lib/format";

export default function CourseDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const numericId = useMemo(() => (id ? Number(id) : null), [id]);
  // info/students를 하나의 관리 화면으로 통합 (탭 상태 제거)

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [students, setStudents] = useState<Student[]>([]);
  const [stuLoading, setStuLoading] = useState(false);
  const [stuError, setStuError] = useState<string | null>(null);
  const [records, setRecords] = useState<CourseRecord[]>([]);
  const [recLoading, setRecLoading] = useState(false);
  const [recError, setRecError] = useState<string | null>(null);
  // History filter state
  const [filterYear, setFilterYear] = useState<number | null>(null);
  // 0 = 전체, 1..12 = 월
  const [filterMonth, setFilterMonth] = useState<number>(new Date().getMonth() + 1);
  // removed: bulk generation state (replaced with manual create flow)
  // Danger confirm for deleting this course (template)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [confirmBusy, setConfirmBusy] = useState(false);
  const [attByRec, setAttByRec] = useState<Record<number, Record<number, boolean>>>({});
  function readableError(e: unknown, fallback: string) {
    if (typeof e === 'string') return e;
    if (e && typeof e === 'object' && 'message' in e && typeof (e as { message?: unknown }).message === 'string') {
      return (e as { message?: string }).message || fallback;
    }
    return fallback;
  }

  useEffect(() => {
    if (!numericId) return;
    let cancelled = false;
    async function load() {
      setLoading(true); setError(null);
      try {
        const c = await getCourse(numericId!);
        if (!cancelled) setCourse(c);
      } catch (e) {
        if (!cancelled) setError(readableError(e, "수업 정보를 불러오지 못했습니다."));
      } finally { if (!cancelled) setLoading(false); }
    }
    void load();
    return () => { cancelled = true; };
  }, [numericId]);

  // Utility helpers for filter
  function pad2(n: number) { return String(n).padStart(2, '0'); }
  function endOfMonthDay(y: number, m1: number) { return new Date(y, m1, 0).getDate(); }

  // removed: generateNext14Days (replaced by create single record via detail page)

  // Initialize filter year after course loads
  useEffect(() => {
    if (!course) return;
    if (filterYear == null) setFilterYear(new Date().getFullYear());
  }, [course, filterYear]);

  // Load records for selected year/month
  useEffect(() => {
    if (!numericId || filterYear == null) return;
    let cancelled = false;
    async function loadByFilter() {
      setRecLoading(true); setRecError(null);
      try {
        let from = `${filterYear}-01-01`;
        let to = `${filterYear}-12-31`;
        if (filterMonth >= 1) {
          from = `${filterYear}-${pad2(filterMonth)}-01`;
          const end = endOfMonthDay(filterYear, filterMonth);
          to = `${filterYear}-${pad2(filterMonth)}-${pad2(end)}`;
        }
        const list = await listCourseRecords(numericId!, { from, to });
        if (!cancelled) setRecords(list);
      } catch (e) {
        if (!cancelled) {
          const msg = readableError(e, '');
          if (!msg.includes('404')) setRecError(msg || '수업 내역을 불러오지 못했습니다.');
          else setRecords([]);
        }
      } finally { if (!cancelled) setRecLoading(false); }
    }
    void loadByFilter();
    return () => { cancelled = true; };
  }, [numericId, filterYear, filterMonth]);

  // Load attendance for records (server) when available
  useEffect(() => {
    if (!numericId || records.length === 0) return;
    let cancelled = false;
    async function loadAll() {
      const ids = records.map(r => r.id).filter((x): x is number => typeof x === 'number');
      if (ids.length === 0) return;
      try {
        const pairs = await Promise.all(ids.map(async (rid) => {
          try {
            const list = await listRecordAttendance(numericId!, rid);
            const map: Record<number, boolean> = {};
            list.forEach(a => { map[a.studentId] = !!a.present; });
            return [rid, map] as const;
          } catch {
            return [rid, undefined] as const;
          }
        }));
        if (!cancelled) {
          setAttByRec(prev => {
            const next = { ...prev };
            pairs.forEach(([rid, map]) => { if (map) next[rid] = map; });
            return next;
          });
        }
      } finally {
        // no-op
      }
    }
    void loadAll();
    return () => { cancelled = true; };
  }, [numericId, records]);

  useEffect(() => {
    if (!numericId) return;
    let cancelled = false;
    async function loadStudents() {
      setStuLoading(true); setStuError(null);
      try {
        const list = await listCourseStudents(numericId!);
        if (!cancelled) setStudents(list);
      } catch (e: any) {
        const msg = e?.message || "";
        if (msg.includes("404")) {
          try {
            // fallback: gather all then filter
            let page = 0; const size = 100; let all: Student[] = [];
            while (true) {
              const res = await listStudents({ page, size });
              all = all.concat(res.content);
              if (res.last || res.content.length === 0 || page > 100) break;
              page += 1;
            }
            const filtered = all.filter(s => (s.courses || []).some(c => c.id === numericId));
            if (!cancelled) setStudents(filtered);
          } catch (e2: any) {
            if (!cancelled) setStuError(e2?.message || "등록 학생을 불러오지 못했습니다.");
          }
        } else {
          if (!cancelled) setStuError(msg || "등록 학생을 불러오지 못했습니다.");
        }
      } finally { if (!cancelled) setStuLoading(false); }
    }
    void loadStudents();
    return () => { cancelled = true; };
  }, [numericId]);

  const info = useMemo(() => course ? buildInfo(course) : null, [course]);
  type HistoryItem = { id?: number; date: Date; dateLabel: string; time: string; type: '지난 수업' | '예정'; notes?: string | null };
  const history: HistoryItem[] = useMemo(() => {
    if (!course) return [];
    return records.map(r => ({
      id: r.id,
      date: new Date(r.recordDate),
      dateLabel: `${r.recordDate} (${"일월화수목금토"[new Date(r.recordDate).getDay()]})`,
      time: formatCourseTime(course),
      type: new Date(r.recordDate) < new Date() ? '지난 수업' : '예정',
      notes: r.notes,
    }));
  }, [course, records]);
  function fmt(d: Date) { const y=d.getFullYear(), m=String(d.getMonth()+1).padStart(2,'0'), da=String(d.getDate()).padStart(2,'0'); return `${y}-${m}-${da}`; }
  function formatCourseTime(c: Course) { return c.startTime && c.endTime ? `${hhmm(c.startTime)} ~ ${hhmm(c.endTime)}` : (c.courseTime || '-'); }

  // Attendance local storage helpers
  // removed unused getAttendanceMap
  // removed unused setAttendance
  // derived helpers removed (unused)

  // Attachments local storage helpers
function getAttachments(recordId: number): { name: string; size: number }[] {
  try { return JSON.parse(localStorage.getItem(`attachments:${numericId}:${recordId}`) || '[]') as { name: string; size: number }[]; } catch { return []; }
}

  // Attendance helpers (server-preferred, local fallback)
function localAttendanceMap(recordId: number): Record<number, boolean> {
  try { return JSON.parse(localStorage.getItem(`attendance:${numericId}:${recordId}`) || '{}') as Record<number, boolean>; } catch { return {}; }
}
  // removed unused setAttachments
  // unused actions removed: local-only attendance bulk/update, attachments add/remove, notes editor
  const totalStudents = useMemo(() => (typeof course?.enrolledCount === 'number' ? course!.enrolledCount! : students.length), [course?.enrolledCount, students.length]);
  const activeStudents = useMemo(() => students.filter(s => s.status === 'ENROLLED').length, [students]);
  const capacity = course?.capacity;
  const activeRate = useMemo(() => (capacity && capacity > 0 ? Math.round((activeStudents / capacity) * 100) : null), [activeStudents, capacity]);
  const completedCount = useMemo(() => history.filter(h => h.type === '지난 수업').length, [history]);
  const progressPct = useMemo(() => {
    const total = history.length || 0;
    if (!total) return null;
    return Math.round((completedCount / total) * 100);
  }, [completedCount, history.length]);

  return (
    <Wrap>
      <Head>
        <BackBtn type="button" onClick={() => navigate("/classes")}>{leftIcon} 뒤로</BackBtn>
        <h2>{course?.title || "수업 상세"}</h2>
        <Actions>
          <UIGhostBtn to={`/classes/${numericId || ''}/edit-students`} title="수강생 수정">수강생 수정</UIGhostBtn>
          <UIPrimaryBtn to={`/classes/${numericId || ''}/edit`} title="기본 정보 수정">기본정보 수정</UIPrimaryBtn>
          {numericId && (
            <UIGhostBtn as="button" onClick={() => setConfirmDeleteOpen(true)}>삭제</UIGhostBtn>
          )}
        </Actions>
      </Head>
      <ConfirmDialog
        open={confirmDeleteOpen}
        title="수업(템플릿) 삭제"
        message={"관련 수업 내역/출결/첨부가 모두 삭제됩니다. 이 작업은 되돌릴 수 없습니다."}
        confirmLabel="영구 삭제"
        cancelLabel="취소"
        tone="danger"
        busy={confirmBusy}
        onCancel={() => { if (!confirmBusy) setConfirmDeleteOpen(false); }}
        onConfirm={async () => {
          if (!numericId) return;
          setConfirmBusy(true);
          try {
            await deleteCourse(numericId);
            setConfirmDeleteOpen(false);
            navigate('/classes');
          } catch (e) {
            alert(readableError(e, '삭제에 실패했습니다.'));
          } finally {
            setConfirmBusy(false);
          }
        }}
      />
      {error && <AlertError>{error}</AlertError>}
      {loading && <Muted>불러오는 중...</Muted>}

      {/* Tabs removed: 기본/학생 + 내역을 동시에 표시합니다. */}

      {/* KPI row */}
      <KPIGrid>
        <KPI
          title="총 수강생"
          icon={<UsersIcon />}
          iconAccent="indigo"
          value={<>{typeof totalStudents === 'number' ? `${totalStudents}명` : '—'}</>}
          footerLeft={<span>정원 {capacity ?? '—'}명</span>}
        />
        <KPI
          title="활성 수강생"
          icon={<UsersIcon />}
          iconAccent="emerald"
          value={<>{activeStudents}명</>}
          footerLeft={activeRate != null ? <DeltaPill $tone="positive">{activeRate}%</DeltaPill> : <span>—</span>}
          footerRight={<span>수강율</span>}
        />
        <KPI
          title="평균 출석률"
          icon={<CheckIcon />}
          iconAccent="green"
          value={<>—</>}
          footerLeft={<span>전체 평균</span>}
        />
        <KPI
          title="완료된 수업"
          icon={<ClassIcon />}
          iconAccent="violet"
          value={<>{completedCount || 0}회</>}
          footerRight={progressPct != null ? <span>진행률 {progressPct}%</span> : <span>—</span>}
        />
      </KPIGrid>

      {/* Segmented tabs removed */}

      {/* Two-column layout: 좌측(기본+학생), 우측(수업 내역) */}
      {info && (
        <Columns>
          <Left>
            <Section>
              <SectionHead>
                <Title>수업 정보</Title>
                <div>
                  <UIGhostBtnSmall to={`/classes/${numericId || ''}/edit`}>기본정보 수정</UIGhostBtnSmall>
                </div>
              </SectionHead>
              <GridTwo>
                <Field><Label>코드</Label><div><code>{course?.code}</code></div></Field>
                <Field><Label>상태</Label><div><StatusChip data-type={course?.status}>{statusLabel(course?.status)}</StatusChip></div></Field>
                <Field><Label>요일</Label><div>{info.days || '-'}</div></Field>
                <Field><Label>시간</Label><div>{info.time || '-'}</div></Field>
                <Field><Label>정원</Label><div>{course?.capacity ?? '-'}</div></Field>
                <Field><Label>수강료</Label><div>{course?.fee ? `${course.fee.toLocaleString()}원` : '-'}</div></Field>
                <Field style={{ gridColumn: '1 / -1' }}>
                  <Label>수업 설명</Label>
                  <Desc>{course?.description || '-'}</Desc>
                </Field>
              </GridTwo>
            </Section>
            {/* 진행 현황 섹션 제거 */}
            <Section>
              <SectionHead>
                <div>
                  <Title style={{ margin: 0 }}>수강생 목록</Title>
                  <Muted>총 {students.length}명의 학생이 수강중입니다.</Muted>
                </div>
                <Actions>
                  <UIPrimaryBtn to={`/classes/${numericId || ''}/edit-students`}>학생 추가</UIPrimaryBtn>
                </Actions>
              </SectionHead>
              {stuLoading && <Muted>불러오는 중...</Muted>}
              {stuError && <AlertError>{stuError}</AlertError>}
              <TableScroller>
              <TableEx>
                  <thead>
                    <tr>
                      <th>학생명</th>
                      <th>연락처</th>
                      <th>등록일</th>
                      <th>상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.length === 0 && !stuLoading ? (
                      <tr><td colSpan={4} style={{ color: '#6b7280' }}>등록된 학생이 없습니다.</td></tr>
                    ) : (
                      students.map(s => (
                        <tr key={s.id}>
                          <td>
                            <strong>{s.name}</strong>
                            <SmallMuted>{s.code}</SmallMuted>
                          </td>
                          <td>{formatPhone(s.phoneNumber)}</td>
                          <td>{s.joinedDate || '-'}</td>
                          <td><StatusTag data-type={s.status}>{studentStatusText(s.status)}</StatusTag></td>
                        </tr>
                      ))
                    )}
                  </tbody>
              </TableEx>
              </TableScroller>
            </Section>
          </Left>
          <Right>
            <Section>
              <SectionHead>
                <Title>수업 내역</Title>
                <UIGhostBtnSmall to={`/classes/${numericId || ''}/history/date/${fmt(new Date())}`}>수업 생성</UIGhostBtnSmall>
              </SectionHead>
              <FilterRow>
                <FilterItem>
                  <SmallLabel>연도</SmallLabel>
                  <SmallSelect value={filterYear ?? ''} onChange={(e) => setFilterYear(Number(e.currentTarget.value) || new Date().getFullYear())}>
                    {(() => {
                      const todayY = new Date().getFullYear();
                      const startY = (() => { try { return course ? new Date(course.createdAt).getFullYear() : todayY - 1; } catch { return todayY - 1; } })();
                      const endY = todayY + 1;
                      const opts: number[] = [];
                      for (let y = startY; y <= endY; y++) opts.push(y);
                      return opts.map(y => (<option key={y} value={y}>{y}년</option>));
                    })()}
                  </SmallSelect>
                </FilterItem>
                <FilterItem>
                  <SmallLabel>월</SmallLabel>
                  <SmallSelect value={filterMonth} onChange={(e) => setFilterMonth(Number(e.currentTarget.value))}>
                    <option value={0}>전체</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                      <option key={m} value={m}>{m}월</option>
                    ))}
                  </SmallSelect>
                </FilterItem>
                <div style={{ flex: 1 }} />
                <SmallLink type="button" onClick={() => { const now = new Date(); setFilterYear(now.getFullYear()); setFilterMonth(0); }}>초기화</SmallLink>
              </FilterRow>
              {(recLoading || !course) && <Muted>불러오는 중...</Muted>}
              {recError && <AlertError>{recError}</AlertError>}
              {history.length === 0 && !recLoading && <Muted>표시할 일정이 없습니다.</Muted>}
              {history.map((h) => (
                <RecordCard key={h.id || h.dateLabel}>
                  <RecordHead>
                    <div>
                      <strong>{h.dateLabel}</strong>
                      <SmallMuted style={{ marginLeft: 8 }}>{h.time}</SmallMuted>
                      <SmallMuted style={{ marginLeft: 8 }}>{h.type}</SmallMuted>
                      {h.id && (() => {
                        const m = attByRec[h.id!] || localAttendanceMap(h.id!);
                        const processed = Object.keys(m).length;
                        const isPast = new Date(h.date) < new Date(new Date().toDateString());
                        const totalNow = typeof course?.enrolledCount === 'number' ? course!.enrolledCount! : students.length;
                        const unprocessed = isPast ? 0 : Math.max(0, totalNow - processed);
                        return (
                          <RecBadge>
                            {`처리 ${processed}명 · 미처리 ${unprocessed}명`}
                          </RecBadge>
                        );
                      })()}
                    </div>
                    <div>
                      {h.id ? (
                        <UIGhostBtnSmall to={`/classes/${numericId}/history/${h.id}`}>상세</UIGhostBtnSmall>
                      ) : (
                        <UIGhostBtnSmall to={`/classes/${numericId}/history/date/${fmt(h.date)}`}>상세</UIGhostBtnSmall>
                      )}
                    </div>
                  </RecordHead>
                  <BlockTitle>출석</BlockTitle>
                  {(() => {
                    const map = h.id ? (attByRec[h.id!] || localAttendanceMap(h.id!)) : {} as Record<number, boolean>;
                    const present = Object.values(map).filter(v => v === true).length;
                    const absent = Object.values(map).filter(v => v === false).length;
                    const isPast = h.date < new Date(new Date().toDateString());
                    const totalNow = typeof course?.enrolledCount === 'number' ? course!.enrolledCount! : students.length;
                    const unprocessed = isPast ? 0 : Math.max(0, totalNow - (present + absent));
                    return (
                      <div style={{ display:'flex', gap:12, alignItems:'center' }}>
                        <CountPill data-variant='present'>출석 {present}명</CountPill>
                        <CountPill data-variant='absent'>결석 {absent}명</CountPill>
                        <CountPill data-variant='none'>미처리 {unprocessed}명</CountPill>
                      </div>
                    );
                  })()}
                  <BlockTitle>수업 내용</BlockTitle>
                  <ReadOnlyBox>
                    {(h.notes && h.notes.trim()) ? h.notes : '—'}
                  </ReadOnlyBox>
                  {h.id && (
                    <>
                      <BlockTitle>첨부</BlockTitle>
                      <AttachList>
                        {getAttachments(h.id).length === 0 ? (
                          <SmallMuted>첨부 없음</SmallMuted>
                        ) : (
                          getAttachments(h.id).map((f, idx) => (
                            <AttachRow key={`${h.id}-${idx}`}>
                              <div>{f.name} <SmallMuted>{(f.size/1024).toFixed(1)}KB</SmallMuted></div>
                            </AttachRow>
                          ))
                        )}
                      </AttachList>
                    </>
                  )}
                </RecordCard>
              ))}
            </Section>
          </Right>
        </Columns>
      )}

      {/* history block moved to right column */}
    </Wrap>
  );
}

// utils
function hhmm(t?: string) { if (!t) return ""; const [h, m] = t.split(":"); return `${h}:${m}`; }
function dayLabel(code: string) { const map: Record<string,string> = { MON:"월", TUE:"화", WED:"수", THU:"목", FRI:"금", SAT:"토", SUN:"일" }; return map[code.toUpperCase()] || code; }
function statusLabel(s?: Course["status"]) {
  switch (s) { case "IN_PROGRESS": return "진행중"; case "PENDING": return "대기"; case "STOPPED": return "중단"; default: return s || "-"; }
}
function studentStatusText(s: Student["status"]) { switch (s) { case "ENROLLED": return "수강중"; case "ON_LEAVE": return "휴학"; case "PENDING": return "대기"; default: return s; } }

function buildInfo(c: Course) {
  const order: Record<'MON'|'TUE'|'WED'|'THU'|'FRI'|'SAT'|'SUN', number> = { MON:0, TUE:1, WED:2, THU:3, FRI:4, SAT:5, SUN:6 };
  const days = (c.recurrenceDays || '')
    .split(',')
    .map(s=>s.trim().toUpperCase())
    .filter(Boolean)
    .sort((a,b)=>order[a as keyof typeof order] - order[b as keyof typeof order])
    .map(dayLabel)
    .join('/');
  const time = c.startTime && c.endTime ? `${hhmm(c.startTime)} ~ ${hhmm(c.endTime)}` : (c.courseTime || '-');
  return { days, time };
}

function buildHistory(c: Course, fromOffset = 0, toOffset = 6) {
  // Generate limited future window (default: today..+6)
  const start = new Date(); start.setDate(start.getDate() + fromOffset);
  const end = new Date(); end.setDate(end.getDate() + toOffset);
  const days = (c.recurrenceDays || '')
    .split(',').map(s=>s.trim().toUpperCase()).filter(Boolean);
  const mapDow: Record<'SUN'|'MON'|'TUE'|'WED'|'THU'|'FRI'|'SAT', number> = { SUN:0, MON:1, TUE:2, WED:3, THU:4, FRI:5, SAT:6 };
  const dow: number[] = days
    .map((d) => mapDow[d as keyof typeof mapDow])
    .filter((n): n is number => typeof n === 'number');
  const list: { date: Date; dateLabel: string; time: string; type: string }[] = [];
  if (dow.length === 0) return list;
  const time = c.startTime && c.endTime ? `${hhmm(c.startTime)} ~ ${hhmm(c.endTime)}` : (c.courseTime || '-');
  for (let d = new Date(start); d <= end; d.setDate(d.getDate()+1)) {
    const day = d.getDay();
    if (dow.includes(day)) {
      list.push({
        date: new Date(d),
        dateLabel: `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} (${"일월화수목금토"[day]})`,
        time,
        type: d < new Date() ? '지난 수업' : '예정',
      });
    }
  }
  // sort by date ascending
  list.sort((a,b)=>a.date.getTime()-b.date.getTime());
  return list;
}

// styles
const Wrap = styled.div` display:grid; gap:12px; `;
const Head = styled.div` display:grid; grid-template-columns:auto 1fr auto; gap:12px; align-items:center; `;
const Actions = styled.div` display:inline-flex; gap:8px; `;
// (tabs removed)
// Section, Title from common UI
const GridTwo = styled.div` display:grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap:12px; @media(max-width:900px){ grid-template-columns:1fr; }`;
const Field = styled.div` display:grid; gap:6px; `;
const Label = styled.div` color:#6b7280; font-size:12px; font-weight:700; `;
const Desc = styled.div`
  color:#111827;
  white-space: pre-wrap;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 6; /* clamp to ~6 lines */
  -webkit-box-orient: vertical;
`;
// removed unused ListBox/Row styles
const SmallMuted = styled.span` margin-left:8px; color:#9ca3af; font-size:12px; `;
const StatusChip = styled.span`
  padding: 2px 8px; border-radius: 9999px; font-size: 12px; font-weight: 800;
  &[data-type='IN_PROGRESS'] { background:#dcfce7; color:#16a34a; }
  &[data-type='PENDING'] { background:#f3e8ff; color:#7c3aed; }
  &[data-type='STOPPED'] { background:#e5e7eb; color:#374151; }
`;
const StatusTag = styled.span`
  margin-left:8px; padding:2px 6px; border-radius:999px; font-size:11px; font-weight:700; border:1px solid #e5e7eb; color:#374151; background:#f9fafb;
  &[data-type='ENROLLED'] { background:#ecfdf5; color:#047857; border-color:#a7f3d0; }
  &[data-type='ON_LEAVE'] { background:#fff7ed; color:#b45309; border-color:#fed7aa; }
  &[data-type='PENDING'] { background:#f5f3ff; color:#6d28d9; border-color:#ddd6fe; }
`;
// Buttons from common UI
const AlertError = styled.div` background:#fee2e2; color:#b91c1c; border:1px solid #fecaca; padding:10px 12px; border-radius:10px; font-size:13px; `;
const Muted = styled.div` color:#6b7280; font-size:12px; `;
const BackBtn = styled(UIGhostBtnSmall).attrs({ as: "button" })`
  font-weight: 600;
  font-size: 13px;
`;
const leftIcon = (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>);

// new layout styles
const KPIGrid = styled.div` display:grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap:12px; `;
const Columns = styled.div` display:flex; gap:12px; align-items:flex-start; `;
const Left = styled.div` flex:4 1 0; display:grid; gap:12px; align-content:flex-start; `;
const Right = styled.div` flex:6 1 0; display:grid; gap:12px; align-content:flex-start; `;
const SectionHead = styled.div` display:flex; align-items:flex-end; justify-content:space-between; margin-bottom:8px; `;
// 진행 현황 섹션 제거로 불필요한 스타일 삭제됨
const SmallLabel = styled.span` display:block; color:#6b7280; font-size:12px; margin-bottom:4px; `;
const SmallSelect = styled.select`
  height:32px; padding:0 10px; border:1px solid #e5e7eb; border-radius:8px; font-size:12px; background:#fff;
  min-width: 110px;
`;
const FilterRow = styled.div`
  display:flex; gap:12px; align-items:flex-end; margin-bottom:8px;
  background:#f9fafb; border:1px solid #f1f5f9; border-radius:10px; padding:8px 10px;
`;
const FilterItem = styled.label` display:grid; gap:4px; `;
const SmallLink = styled.button`
  height:28px; padding:0 8px; border:1px solid transparent; background:transparent; color:#6b7280; font-size:12px; border-radius:8px;
  &:hover{ background:#eef2ff; color:#1f2937; border-color:#e0e7ff; }
`;
const TableEx = styled(UITable)`
  thead th { background:#f9fafb; }
  tbody tr:nth-child(even) td { background:#fcfcfd; }
  tbody tr:hover td { background:#f8fafc; }
`;
const TableScroller = styled.div`
  max-height: 420px;
  overflow: auto;
  border: 1px solid #f1f5f9;
  border-radius: 10px;
`;

// Records UI
const RecordCard = styled.div` border:1px solid #e5e7eb; border-radius:12px; padding:12px; display:grid; gap:10px; margin-bottom:10px; `;
const RecordHead = styled.div` display:flex; align-items:center; justify-content:space-between; `;
const BlockTitle = styled.div` font-size:12px; font-weight:800; color:#6b7280; margin-top:4px; `;
const RecBadge = styled.span` margin-left:8px; padding:2px 6px; border-radius:999px; font-size:11px; font-weight:700; border:1px solid #e5e7eb; color:#374151; background:#f3f4f6; `;
const ReadOnlyBox = styled.div` white-space:pre-wrap; border:1px solid #f1f5f9; border-radius:10px; padding:10px; background:#f9fafb; color:#111827; font-size:14px; `;
const AttachList = styled.div` display:grid; gap:6px; margin-top:6px; `;
const AttachRow = styled.div` display:flex; align-items:center; justify-content:space-between; padding:6px 8px; border:1px solid #f1f5f9; border-radius:8px; `;
// removed unused SmallBtn/Hint styles
const CountPill = styled.span`
  display:inline-flex; align-items:center; gap:4px; padding:2px 8px; border-radius:999px; border:1px solid #e5e7eb; font-size:12px; font-weight:800; color:#374151; background:#fff;
  &[data-variant='present']{ background:#ecfdf5; color:#065f46; border-color:#a7f3d0; }
  &[data-variant='absent']{ background:#fee2e2; color:#7f1d1d; border-color:#fecaca; }
  &[data-variant='none']{ background:#f3f4f6; color:#6b7280; border-color:#e5e7eb; }
`;
