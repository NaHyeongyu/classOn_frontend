import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import {
  SectionCard as Section,
  TitleH3 as Title,
  GhostBtn as UIGhostBtn,
  SmallBtn as UISmallBtn,
  buttonVariants,
} from "../components/common/UI";
import { getCourse, listCourseStudents } from "../api/courses";
import { listStudents, type Student, updateStudent, type StudentPayload } from "../api/students";

export default function CourseStudentsEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const numericId = useMemo(() => (id ? Number(id) : null), [id]);

  const [title, setTitle] = useState<string>("");
  const [capacity, setCapacity] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [studentSearch, setStudentSearch] = useState("");
  const [studentOptions, setStudentOptions] = useState<Student[]>([]);
  const [studentLoading, setStudentLoading] = useState(false);
  const [studentError, setStudentError] = useState<string | null>(null);

  const [enrolledStudents, setEnrolledStudents] = useState<Student[]>([]);
  const [enrolledLoading, setEnrolledLoading] = useState(false);
  const [enrolledError, setEnrolledError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [addingId, setAddingId] = useState<number | null>(null);

  useEffect(() => {
    if (!numericId) return;
    let cancelled = false;
    async function load() {
      try {
        const c = await getCourse(numericId!);
        if (!cancelled) { setTitle(c.title); setCapacity(c.capacity ?? null); }
      } catch (e: any) { if (!cancelled) setError(e?.message || "수업 정보를 불러오지 못했습니다."); }
    }
    void load();
    return () => { cancelled = true; };
  }, [numericId]);

  useEffect(() => {
    if (!numericId) return;
    let cancelled = false;
    async function loadEnrolled() {
      setEnrolledLoading(true); setEnrolledError(null);
      try {
        const list = await listCourseStudents(numericId!);
        if (!cancelled) setEnrolledStudents(list);
      } catch (e: any) {
        const msg = e?.message || "";
        if (msg.includes("404")) {
          try {
            let page = 0; const size = 100; let all: Student[] = [];
            while (true) {
              const res = await listStudents({ page, size });
              all = all.concat(res.content);
              if (res.last || res.content.length === 0 || page > 100) break;
              page += 1;
            }
            const filtered = all.filter(s => (s.courses || []).some(c => c.id === numericId));
            if (!cancelled) setEnrolledStudents(filtered);
          } catch (e2: any) {
            if (!cancelled) setEnrolledError(e2?.message || "등록된 학생 목록을 불러오지 못했습니다.");
          }
        } else {
          if (!cancelled) setEnrolledError(msg || "등록된 학생 목록을 불러오지 못했습니다.");
        }
      } finally { if (!cancelled) setEnrolledLoading(false); }
    }
    void loadEnrolled();
    return () => { cancelled = true; };
  }, [numericId]);

  // Load all students with optional server-side query
  useEffect(() => {
    let cancelled = false;
    const t = setTimeout(() => {
      async function run() {
        setStudentLoading(true); setStudentError(null);
        try {
          const size = 100; let page = 0; let all: Student[] = [];
          const qv = studentSearch.trim();
          while (true) {
            const res = await listStudents({ q: qv || undefined, page, size });
            all = all.concat(res.content);
            if (res.last || res.content.length === 0 || page > 200) break;
            page += 1;
          }
          if (!cancelled) setStudentOptions(all);
        } catch (e: any) { if (!cancelled) setStudentError(e?.message || "학생 목록을 불러오지 못했습니다."); }
        finally { if (!cancelled) setStudentLoading(false); }
      }
      void run();
    }, 200);
    return () => { cancelled = true; clearTimeout(t); };
  }, [studentSearch]);

  async function onEnroll(s: Student) {
    if (!numericId) return;
    try {
      // capacity guard
      const cap = capacity ?? undefined;
      if (cap && enrolledStudents.length >= cap) { setStudentError("정원이 가득 찼습니다."); return; }
      setAddingId(s.id);
      const existing = Array.isArray(s.courses) ? s.courses.map((c) => c.id) : [];
      if (existing.includes(numericId!)) return;
      const next = Array.from(new Set<number>([...existing, numericId!]));
      await updateStudent(s.id, { courseIds: next } as Partial<StudentPayload>);
      setEnrolledStudents((prev) => (prev.some(p=>p.id===s.id) ? prev : [...prev, s]));
      setStudentOptions((opts) => opts.map((x) => x.id === s.id ? { ...x, courses: [...(x.courses || []), { id: numericId!, code: '', title: '', status: '' } as any] } : x));
    } catch (e: any) { setStudentError(e?.message || "추가에 실패했습니다."); }
    finally { setAddingId(null); }
  }

  async function onUnenroll(s: Student) {
    if (!numericId) return;
    try {
      setRemovingId(s.id);
      const existing = Array.isArray(s.courses) ? s.courses.map((c) => c.id) : [];
      const next = existing.filter((cid) => cid !== numericId);
      await updateStudent(s.id, { courseIds: next } as Partial<StudentPayload>);
      setEnrolledStudents((prev) => prev.filter((x) => x.id !== s.id));
      setStudentOptions((opts) => opts.map((x) => x.id === s.id ? { ...x, courses: (x.courses || []).filter(c => c.id !== numericId) } : x));
    } catch (e: any) { setEnrolledError(e?.message || "해제에 실패했습니다."); }
    finally { setRemovingId(null); }
  }

  function statusText(s: Student["status"]) {
    switch (s) { case "ENROLLED": return "수강중"; case "ON_LEAVE": return "휴학"; case "PENDING": return "대기"; default: return s; }
  }

  return (
    <Wrap>
      <Head>
        <BackBtn type="button" onClick={() => navigate(`/classes/${numericId}`)}>{leftIcon} 상세</BackBtn>
        <h2>수강생 수정</h2>
        <Actions>
          <UIGhostBtn as={"button" as any} onClick={() => navigate(`/classes/${numericId}`)}>완료</UIGhostBtn>
        </Actions>
      </Head>
      {(error || enrolledError) && <AlertError>{error || enrolledError}</AlertError>}

      <Section>
        <Title>{title || '수업'} - 학생 관리</Title>
        <Grid>
          <div>
            <Field>
              <Label>학생 검색</Label>
              <Input placeholder="이름/연락처로 검색 (빈칸=전체)" value={studentSearch} onChange={(e)=>setStudentSearch(e.target.value)} />
              <Hint>{studentLoading ? "검색 중..." : studentError ? studentError : `총 ${studentOptions.length}명 조회됨`}</Hint>
            </Field>
            <Field>
              <Label>검색 결과</Label>
              <ListBox>
                {studentOptions.length === 0 && <Muted>검색 결과가 없습니다.</Muted>}
                {studentOptions.map(s => {
                  const alreadyEnrolled = enrolledStudents.some(es => es.id === s.id);
                  const atCapacity = (capacity ?? 0) > 0 && enrolledStudents.length >= (capacity ?? 0);
                  return (
                    <Row key={s.id}>
                      <div>
                        <strong>{s.name}</strong>
                        <SmallMuted>{s.code}</SmallMuted>
                        <StatusTag data-type={s.status}>{statusText(s.status)}</StatusTag>
                      </div>
                      <RowActions>
                        {alreadyEnrolled ? (
                          <SmallBtn type="button" disabled title="이미 등록된 학생">등록됨</SmallBtn>
                        ) : (
                          <SmallBtn type="button" onClick={()=>onEnroll(s)} disabled={addingId===s.id || atCapacity} title={atCapacity?"정원 초과":"추가"}>
                            {addingId===s.id ? "추가 중..." : "추가"}
                          </SmallBtn>
                        )}
                      </RowActions>
                    </Row>
                  );
                })}
              </ListBox>
            </Field>
          </div>

          <div>
            <Field>
              <Label>등록된 학생 ({enrolledStudents.length}명{capacity ? ` / 정원 ${capacity}명` : ''})</Label>
              <ListBox>
                {enrolledLoading && <Muted>불러오는 중...</Muted>}
                {!enrolledLoading && enrolledStudents.length === 0 && <Muted>아직 등록된 학생이 없습니다.</Muted>}
                {enrolledStudents.map(s => (
                  <Row key={`en-${s.id}`}>
                    <div>
                      <strong>{s.name}</strong>
                      <SmallMuted>{s.code}</SmallMuted>
                      <StatusTag data-type={s.status}>{statusText(s.status)}</StatusTag>
                    </div>
                    <RowActions>
                      <SmallBtn type="button" data-variant="danger" onClick={()=>onUnenroll(s)} disabled={removingId===s.id}>
                        {removingId===s.id ? "해제 중..." : "해제"}
                      </SmallBtn>
                    </RowActions>
                  </Row>
                ))}
              </ListBox>
            </Field>
          </div>
        </Grid>
      </Section>
    </Wrap>
  );
}

// styles
const Wrap = styled.div` display:grid; gap:12px; `;
const Head = styled.div` display:grid; grid-template-columns:auto 1fr auto; gap:12px; align-items:center; `;
const Actions = styled.div` display:inline-flex; gap:8px; `;
// Section, Title from common UI
const Grid = styled.div` display:grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap:12px; @media(max-width:900px){ grid-template-columns:1fr; }`;
const Field = styled.div` display:grid; gap:6px; `;
const Label = styled.div` color:#6b7280; font-size:12px; font-weight:700; `;
const Input = styled.input` height:38px; border:1px solid #e5e7eb; border-radius:10px; padding:0 10px; font-size:14px; `;
const Hint = styled.div` color:#6b7280; font-size:12px; `;
const ListBox = styled.div` border:1px solid #e5e7eb; border-radius:10px; min-height:40px; max-height:420px; overflow:auto; padding:6px; display:grid; gap:6px; `;
const Row = styled.div` display:flex; align-items:center; justify-content:space-between; gap:8px; padding:8px 10px; border:1px solid #f1f5f9; border-radius:10px; `;
const RowActions = styled.div` display:inline-flex; gap:6px; `;
const SmallBtn = styled(UISmallBtn)`
  height: 32px;
  padding: 0 12px;
  font-size: 12px;
  &[data-active='true']{
    background:#111827;
    color:#fff;
    border-color:#111827;
  }
  &[data-variant='danger']{
    border-color:#fecaca;
    color:#b91c1c;
  }
`;
const SmallMuted = styled.span` margin-left:8px; color:#9ca3af; font-size:12px; `;
const StatusTag = styled.span`
  margin-left:8px; padding:2px 6px; border-radius:999px; font-size:11px; font-weight:700; border:1px solid #e5e7eb; color:#374151; background:#f9fafb;
  &[data-type='ENROLLED'] { background:#ecfdf5; color:#047857; border-color:#a7f3d0; }
  &[data-type='ON_LEAVE'] { background:#fff7ed; color:#b45309; border-color:#fed7aa; }
  &[data-type='PENDING'] { background:#f5f3ff; color:#6d28d9; border-color:#ddd6fe; }
`;
const AlertError = styled.div` background:#fee2e2; color:#b91c1c; border:1px solid #fecaca; padding:10px 12px; border-radius:10px; font-size:13px; `;
const Muted = styled.div` color:#6b7280; font-size:12px; `;
// Buttons from common UI; keep BackBtn local
const BackBtn = styled.button`
  ${buttonVariants.outline};
  height: 36px;
  padding: 0 14px;
  font-weight: 600;
  font-size: 13px;
`;
const leftIcon = (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>);
