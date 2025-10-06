import { useEffect, useMemo, useState } from "react";
import SelectBox from "@/components/common/SelectBox";
import { useNavigate, useParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import {
  TableBase as UITable,
  GhostBtn as UIGhostBtn,
  PrimaryBtn as UIPrimaryBtn,
  SmallBtn as UISmallBtn,
} from "@/components/common/UI";
import BackButton from "@/components/common/BackButton";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { listCounsels, createCounsel, updateCounsel, deleteCounsel, downloadCounselsExcel, type Counsel } from "@/api/counsels";
import { getStudent, getStudentAttendance, type Student, type StudentAttendance } from "@/api/students";
// formatMoney 사용 제거됨 (MVP)
import { formatPhone } from "@/lib/format";
import { calcRisk, recommendActions, type RiskResult } from "@/features/risk/riskUtils";
import { summarizeRecords, type SummarizeItem } from "@/api/summarize";
import { getStudentGrades, type GradeEntry } from "@/features/grades/gradesStorage";
import { useToast } from "@/components/common/Toast";

type TabKey = "courses" | "attendance" | "counsels" | "grades";

export default function StudentDetail() {
  const navigate = useNavigate();
  const { id, tab: tabParam } = useParams();
  const numericId = useMemo(() => Number(id), [id]);
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState<string>("");
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesInput, setNotesInput] = useState("");
  // Tuition UI removed (MVP)
  // Per-item memos (temporary local persistence until API ready)
  type MemoItem = { id: number; text: string; createdAt: string; updatedAt?: string };
  const [memos, setMemos] = useState<MemoItem[]>([]);
  const [newMemo, setNewMemo] = useState("");
  const [editingMemoId, setEditingMemoId] = useState<number | null>(null);
  const [editingMemoText, setEditingMemoText] = useState("");
  // Attendance state
  const [attRows, setAttRows] = useState<StudentAttendance[]>([]);
  const [attLoading, setAttLoading] = useState(false);
  const [attError, setAttError] = useState<string | null>(null);
  // 결제 관련 상태 제거 (MVP)
  // Counsels state (loaded per student)
  const [counsels, setCounsels] = useState<Counsel[]>([]);
  const [counselLoading, setCounselLoading] = useState(false);
  const [counselError, setCounselError] = useState<string | null>(null);
  const [exportingCounsel, setExportingCounsel] = useState(false);
  const [addingCounsel, setAddingCounsel] = useState(false);
  // New counsel form: date + hour/min (default: today with no time selected)
  const [newDate, setNewDate] = useState<string>(() => {
    const d = new Date();
    return `${d.getFullYear()}-${two(d.getMonth()+1)}-${two(d.getDate())}`;
  });
  const [newHour, setNewHour] = useState<string>("");
  const [newMin, setNewMin] = useState<string>("");
  const [newContent, setNewContent] = useState<string>("");
  const [newSubmitting, setNewSubmitting] = useState(false);
  // Edit existing counsel
  const [editingCounselId, setEditingCounselId] = useState<number | null>(null);
  const [confirmCounselId, setConfirmCounselId] = useState<number | null>(null);
  const [confirmCounselBusy, setConfirmCounselBusy] = useState(false);
  // Edit counsel form: date + hour/min
  const [editDate, setEditDate] = useState<string>("");
  const [editHour, setEditHour] = useState<string>("");
  const [editMin, setEditMin] = useState<string>("");
  const [editContent, setEditContent] = useState<string>("");
  const [savingEdit, setSavingEdit] = useState(false);
  const { error: showError } = useToast();
  // Predictive risk
  const [risk, setRisk] = useState<RiskResult | null>(null);
  const [riskLoading, setRiskLoading] = useState(false);
  const [riskError, setRiskError] = useState<string | null>(null);
  // Counsel AI summary
  const [counselSummary, setCounselSummary] = useState<string>("");
  const [counselSummaryLoading, setCounselSummaryLoading] = useState(false);
  const [counselSummaryError, setCounselSummaryError] = useState<string | null>(null);
  // Grades (display only)
  const [grades, setGrades] = useState<GradeEntry[]>([]);
  const intlAge = useMemo(() => {
    if (!student?.birthDate) return undefined;
    const [y, m, d] = student.birthDate.split("-").map(Number);
    if (!y || !m || !d) return undefined;
    const now = new Date();
    let age = now.getFullYear() - y;
    const mm = now.getMonth() + 1;
    const dd = now.getDate();
    if (mm < m || (mm === m && dd < d)) age -= 1;
    return age;
  }, [student?.birthDate]);
  // koreanAge removed (unused)
  const activeTab: TabKey = useMemo(() => {
    switch (tabParam) {
      case "courses":
      case "attendance":
      case "counsels":
      case "grades":
        return tabParam as TabKey;
      default:
        return "courses";
    }
  }, [tabParam]);

  function courseStatusLabel(s: string) {
    switch (s) {
      case "IN_PROGRESS": return "진행중";
      case "PENDING": return "대기";
      case "STOPPED": return "중단";
      default: return s;
    }
  }

  useEffect(() => {
    if (!numericId || Number.isNaN(numericId)) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await getStudent(numericId);
        if (!cancelled) setStudent(res);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "원생 정보를 불러오지 못했습니다.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => { cancelled = true; };
  }, [numericId]);

  // Load minimal data for predictive risk (attendance + counsels)
  useEffect(() => {
    if (!numericId || Number.isNaN(numericId)) return;
    let cancelled = false;
    async function loadRisk() {
      setRiskLoading(true); setRiskError(null);
      try {
        const [att, cons] = await Promise.all([
          getStudentAttendance(numericId, { size: 200 }),
          listCounsels({ studentId: numericId, size: 100 }),
        ]);
        if (cancelled) return;
        const computed = calcRisk(att.content || [], cons.content || [], { days: 30 });
        setRisk(computed);
      } catch (e: any) {
        if (!cancelled) setRiskError(e?.message || '예측 분석 정보를 불러오지 못했습니다.');
      } finally {
        if (!cancelled) setRiskLoading(false);
      }
    }
    void loadRisk();
    return () => { cancelled = true; };
  }, [numericId]);

  // Load counsels when switching to the tab or student changes
  useEffect(() => {
    if (!numericId || activeTab !== "counsels") return;
    let cancelled = false;
    async function load() {
      setCounselLoading(true);
      setCounselError(null);
      try {
        const res = await listCounsels({ studentId: numericId, size: 100 });
        if (!cancelled) setCounsels(res.content || []);
      } catch (e: any) {
        if (!cancelled) setCounselError(e?.message || "상담 기록을 불러오지 못했습니다.");
      } finally {
        if (!cancelled) setCounselLoading(false);
      }
    }
    void load();
    return () => { cancelled = true; };
  }, [numericId, activeTab]);

  // Load grades (display-only)
  useEffect(() => {
    if (!numericId || Number.isNaN(numericId)) return;
    setGrades(getStudentGrades(numericId));
  }, [numericId]);

  async function handleCounselExport() {
    if (!numericId) return;
    setExportingCounsel(true);
    try {
      const blob = await downloadCounselsExcel({ studentId: numericId });
      const studentName = student?.name || `student_${numericId}`;
      const filename = sanitizeFilename(`${studentName}_counsels`);
      saveBlobAsFile(blob, `${filename}.xlsx`);
    } catch (e: any) {
      showError(e?.message || '상담 기록 엑셀 추출에 실패했습니다.');
    } finally {
      setExportingCounsel(false);
    }
  }

  async function handleCounselSummarize() {
    if (!numericId) return;
    try {
      setCounselSummaryLoading(true);
      setCounselSummaryError(null);
      const items: SummarizeItem[] = (counsels || []).slice(0, 50).map((c) => ({
        date: (c.counselTime || '').slice(0, 10),
        content: (c.content || '').replace(/\s+/g, ' ').slice(0, 500),
      }));
      if (!items.length) {
        setCounselSummaryError('요약할 상담 기록이 없습니다.');
        return;
      }
      const resp = await summarizeRecords(items, { language: 'ko' });
      setCounselSummary(resp.summary || '요약이 비어 있습니다.');
    } catch (e: any) {
      setCounselSummaryError(e?.message || '요약 생성에 실패했습니다.');
    } finally {
      setCounselSummaryLoading(false);
    }
  }

  // Load saved notes from localStorage (temporary persistence until API exists)
  useEffect(() => {
    if (!numericId) return;
    try {
      const saved = localStorage.getItem(`student:notes:${numericId}`) || "";
      setNotes(saved);
      setNotesInput(saved);
    } catch {}
  }, [numericId]);

  // Load memo list
  useEffect(() => {
    if (!numericId) return;
    try {
      const raw = localStorage.getItem(`student:memos:${numericId}`);
      const arr = raw ? (JSON.parse(raw) as MemoItem[]) : [];
      setMemos(Array.isArray(arr) ? arr : []);
    } catch {
      setMemos([]);
    }
  }, [numericId]);

  // Load attendance when tab is active
  useEffect(() => {
    if (!numericId || activeTab !== 'attendance') return;
    let cancelled = false;
    async function load() {
      setAttLoading(true); setAttError(null);
      try {
        const res = await getStudentAttendance(numericId, { size: 200 });
        if (!cancelled) setAttRows(res?.content || []);
      } catch (e: any) {
        if (!cancelled) setAttError(e?.message || '출석 정보를 불러오지 못했습니다.');
      } finally {
        if (!cancelled) setAttLoading(false);
      }
    }
    void load();
    return () => { cancelled = true; };
  }, [numericId, activeTab]);

  // 결제 내역 로딩 제거 (MVP)

  function saveNotes() {
    if (!numericId) return;
    const text = (notesInput || "").trim();
    setNotes(text);
    setEditingNotes(false);
    try { localStorage.setItem(`student:notes:${numericId}`, text); } catch {}
  }

  function persistMemos(next: MemoItem[]) {
    setMemos(next);
    try { localStorage.setItem(`student:memos:${numericId}`, JSON.stringify(next)); } catch {}
  }

  function addMemo() {
    if (!numericId) return;
    const text = (newMemo || "").trim();
    if (!text) return;
    const now = new Date().toISOString();
    const item: MemoItem = { id: Date.now(), text, createdAt: now };
    persistMemos([item, ...memos]);
    setNewMemo("");
  }

  function beginEditMemo(id: number) {
    const found = memos.find(m => m.id === id);
    if (!found) return;
    setEditingMemoId(id);
    setEditingMemoText(found.text);
  }

  function saveEditMemo() {
    if (editingMemoId == null) return;
    const text = (editingMemoText || "").trim();
    const now = new Date().toISOString();
    const next = memos.map(m => m.id === editingMemoId ? { ...m, text, updatedAt: now } : m);
    persistMemos(next);
    setEditingMemoId(null);
    setEditingMemoText("");
  }

  function cancelEditMemo() {
    setEditingMemoId(null);
    setEditingMemoText("");
  }

  function removeMemo(id: number) {
    const next = memos.filter(m => m.id !== id);
    persistMemos(next);
  }

  const hours24 = useMemo(() => Array.from({ length: 24 }, (_, h) => String(h).padStart(2, '0')), []);
  const mins5 = useMemo(() => ['00','05','10','15','20','25','30','35','40','45','50','55'], []);

  async function onSubmitNewCounsel() {
    if (!numericId || !newDate || !newHour || !newMin) return;
    setNewSubmitting(true);
    setCounselError(null);
    try {
      const iso = `${newDate}T${newHour}:${newMin}:00`;
      await createCounsel({ studentId: numericId, counselTime: iso, content: newContent || undefined });
      const res = await listCounsels({ studentId: numericId, size: 100 });
      setCounsels(res.content || []);
      setAddingCounsel(false);
      setNewHour(""); setNewMin("");
      setNewContent("");
    } catch (e: any) {
      setCounselError(e?.message || '저장에 실패했습니다.');
    } finally {
      setNewSubmitting(false);
    }
  }

  async function onSaveEdit(id: number) {
    if (!editDate || !editHour || !editMin) return;
    setSavingEdit(true);
    setCounselError(null);
    try {
      const iso = `${editDate}T${editHour}:${editMin}:00`;
      await updateCounsel(id, { counselTime: iso, content: editContent || undefined });
      const res = await listCounsels({ studentId: numericId, size: 100 });
      setCounsels(res.content || []);
      setEditingCounselId(null);
      setEditDate(""); setEditHour(""); setEditMin("");
      setEditContent("");
    } catch (e: any) {
      setCounselError(e?.message || '수정에 실패했습니다.');
    } finally {
      setSavingEdit(false);
    }
  }

  return (
    <Page>
      <TopBar>
        <BackButton to="/students" label="뒤로" />
        <h2>원생 상세</h2>
      </TopBar>
      <Crumbs>원생 관리 &gt; {student?.name || '상세'}</Crumbs>
      {loading && (
        <Columns>
          <Left>
            <Card>
              <SectionTitle>기본 정보</SectionTitle>
              <SkeletonRow>
                <AvatarSkeleton />
                <div>
                  <Skeleton w={140} h={18} />
                  <Skeleton w={120} h={12} mt={6} />
                </div>
                <SkeletonChip />
              </SkeletonRow>
              <SkField />
              <SkField />
              <SkField />
              <SkField />
            </Card>
            <Card>
              <SectionTitle>부모님 정보</SectionTitle>
              <SkField />
              <SkField />
            </Card>
          </Left>
          <Right>
            {/* 예측 분석 */}
            <Card>
              <CardHead>
                <SectionTitle>예측 분석</SectionTitle>
                <CardActions>
                  <UISmallBtn as={"button" as any} onClick={() => navigate(`/students/${numericId}/counsels`)}>상담 추가</UISmallBtn>
                </CardActions>
              </CardHead>
              {riskLoading ? (
                <SectionBody>
                  <Skeleton w={180} h={14} />
                  <Skeleton w={420} h={14} mt={8} />
                </SectionBody>
              ) : riskError ? (
                <SectionBody>
                  <Error>{riskError}</Error>
                </SectionBody>
              ) : risk ? (
                <SectionBody>
                  <RiskRow>
                    <RiskPill data-level={risk.level}>
                      {risk.level === 'RISK' ? '위험 단계' : risk.level === 'CAUTION' ? '주의 단계' : '양호'}
                    </RiskPill>
                    <RiskMetrics>
                      <span>출석률 {risk.metrics.attRate30 != null ? `${risk.metrics.attRate30}%` : '—'}</span>
                      <Dot />
                      <span>결석 {risk.metrics.absences30}회</span>
                      <Dot />
                      <span>부정 신호 {risk.metrics.negativeCounselCount30}건</span>
                    </RiskMetrics>
                  </RiskRow>
                  {risk.reasons.length > 0 && (
                    <ReasonList>
                      {risk.reasons.slice(0,3).map((r, i) => (<li key={i}>{r}</li>))}
                    </ReasonList>
                  )}
                  <RecList>
                    {recommendActions(risk).map((s, i) => (<li key={i}>{s}</li>))}
                  </RecList>
                  <ActionRow>
                    <UISmallBtn as={"button" as any} onClick={() => navigate('/classes')}>보강 수업 찾기</UISmallBtn>
                    <UISmallBtn as={"button" as any} onClick={() => navigate(`/students/${numericId}/counsels`)}>상담 일정</UISmallBtn>
                  </ActionRow>
                </SectionBody>
              ) : (
                <SectionBody>
                  <Muted>예측 분석 정보를 준비 중입니다.</Muted>
                </SectionBody>
              )}
            </Card>

            {/* 시험/성적 */}
            <Card>
              <CardHead>
                <SectionTitle>시험/성적</SectionTitle>
                <CardActions>
                  {!gradeOpen ? (
                    <UISmallBtn as={"button" as any} onClick={() => setGradeOpen(true)}>추가</UISmallBtn>
                  ) : (
                    <UISmallBtn as={"button" as any} onClick={() => { setGradeOpen(false); setGErr(null); }}>닫기</UISmallBtn>
                  )}
                </CardActions>
              </CardHead>
              {gradeOpen && (
                <SectionBody>
                  {gErr && <Error>{gErr}</Error>}
                  <EditGrid>
                    <div>
                      <Label>일자</Label>
                      <Input type="date" value={gDate} onChange={(e)=>setGDate(e.currentTarget.value)} />
                    </div>
                    <div>
                      <Label>과목/시험</Label>
                      <Input placeholder="예: 중간고사 수학" value={gSubject} onChange={(e)=>setGSubject(e.currentTarget.value)} />
                    </div>
                    <div>
                      <Label>점수</Label>
                      <Input placeholder="예: 87" value={gScore} onChange={(e)=>setGScore(e.currentTarget.value)} />
                    </div>
                    <div>
                      <Label>만점</Label>
                      <Input placeholder="예: 100" value={gOutOf} onChange={(e)=>setGOutOf(e.currentTarget.value)} />
                    </div>
                    <div>
                      <Label>등급</Label>
                      <Input placeholder="예: A / 상" value={gLevel} onChange={(e)=>setGLevel(e.currentTarget.value)} />
                    </div>
                    <div>
                      <Label>메모</Label>
                      <TextArea rows={3} placeholder="간단한 메모" value={gNote} onChange={(e)=>setGNote(e.currentTarget.value)} />
                    </div>
                  </EditGrid>
                  <div style={{ display:'flex', gap:8 }}>
                    <UIPrimaryBtn as={"button" as any} onClick={() => {
                      if (!numericId) return;
                      setGErr(null);
                      if (!gDate) { setGErr('일자를 입력해 주세요.'); return; }
                      const score = gScore.trim() ? Number(gScore) : undefined;
                      const outOf = gOutOf.trim() ? Number(gOutOf) : undefined;
                      if (gScore.trim() && Number.isNaN(score)) { setGErr('점수는 숫자로 입력해 주세요.'); return; }
                      if (gOutOf.trim() && Number.isNaN(outOf)) { setGErr('만점은 숫자로 입력해 주세요.'); return; }
                      setGradeBusy(true);
                      try {
                        addStudentGrade(numericId, { date: gDate, subject: gSubject || undefined, score, outOf, level: gLevel || undefined, note: gNote || undefined });
                        setGrades(getStudentGrades(numericId));
                        setGNote(''); setGLevel(''); setGOutOf(''); setGScore('');
                      } finally { setGradeBusy(false); }
                    }}>
                      {gradeBusy ? '저장 중…' : '저장'}
                    </UIPrimaryBtn>
                    <UIGhostBtn as={"button" as any} onClick={() => { setGradeOpen(false); setGErr(null); }}>취소</UIGhostBtn>
                  </div>
                </SectionBody>
              )}
              <Divider />
              <SectionBody>
                {grades.length === 0 ? (
                  <Empty>등록된 성적이 없습니다.</Empty>
                ) : (
                  <List>
                    {grades.map(g => (
                      <ListItem key={g.id}>
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:8, flexWrap:'wrap' }}>
                          <div style={{ display:'grid' }}>
                            <strong>{g.subject || '성적'}</strong>
                            <SmallMuted>{g.date}</SmallMuted>
                          </div>
                          <div style={{ display:'inline-flex', gap:8, alignItems:'center' }}>
                            <span>{g.score != null ? g.score : '-'}{g.outOf != null ? `/${g.outOf}` : ''}</span>
                            {g.level && <StatusChip data-type='ENROLLED'>{g.level}</StatusChip>}
                            <UIGhostBtn as={"button" as any} onClick={() => { if (!numericId) return; removeStudentGrade(numericId, g.id); setGrades(getStudentGrades(numericId)); }}>삭제</UIGhostBtn>
                          </div>
                        </div>
                        {g.note && <div style={{ color:'#475569', fontSize:13 }}>{g.note}</div>}
                      </ListItem>
                    ))}
                  </List>
                )}
              </SectionBody>
            </Card>
            {/* 예측 분석 */}
            <Card>
              <CardHead>
                <SectionTitle>예측 분석</SectionTitle>
                <CardActions>
                  <UISmallBtn as={"button" as any} onClick={() => navigate(`/students/${numericId}/counsels`)}>상담 추가</UISmallBtn>
                </CardActions>
              </CardHead>
              {riskLoading ? (
                <SectionBody>
                  <Skeleton w={180} h={14} />
                  <Skeleton w={420} h={14} mt={8} />
                </SectionBody>
              ) : riskError ? (
                <SectionBody>
                  <Error>{riskError}</Error>
                </SectionBody>
              ) : risk ? (
                <SectionBody>
                  <RiskRow>
                    <RiskPill data-level={risk.level}>
                      {risk.level === 'RISK' ? '위험 단계' : risk.level === 'CAUTION' ? '주의 단계' : '양호'}
                    </RiskPill>
                    <RiskMetrics>
                      <span>출석률 {risk.metrics.attRate30 != null ? `${risk.metrics.attRate30}%` : '—'}</span>
                      <Dot />
                      <span>결석 {risk.metrics.absences30}회</span>
                      <Dot />
                      <span>부정 신호 {risk.metrics.negativeCounselCount30}건</span>
                    </RiskMetrics>
                  </RiskRow>
                  {risk.reasons.length > 0 && (
                    <ReasonList>
                      {risk.reasons.slice(0,3).map((r, i) => (<li key={i}>{r}</li>))}
                    </ReasonList>
                  )}
                  <RecList>
                    {recommendActions(risk).map((s, i) => (<li key={i}>{s}</li>))}
                  </RecList>
                  <ActionRow>
                    <UISmallBtn as={"button" as any} onClick={() => navigate('/classes')}>보강 수업 찾기</UISmallBtn>
                    <UISmallBtn as={"button" as any} onClick={() => navigate(`/students/${numericId}/counsels`)}>상담 일정</UISmallBtn>
                  </ActionRow>
                </SectionBody>
              ) : (
                <SectionBody>
                  <Muted>예측 분석 정보를 준비 중입니다.</Muted>
                </SectionBody>
              )}
            </Card>

            {/* 시험/성적 */}
            <Card>
              <CardHead>
                <SectionTitle>시험/성적</SectionTitle>
                <CardActions>
                  {!gradeOpen ? (
                    <UISmallBtn as={"button" as any} onClick={() => setGradeOpen(true)}>추가</UISmallBtn>
                  ) : (
                    <UISmallBtn as={"button" as any} onClick={() => { setGradeOpen(false); setGErr(null); }}>닫기</UISmallBtn>
                  )}
                </CardActions>
              </CardHead>
              {gradeOpen && (
                <SectionBody>
                  {gErr && <Error>{gErr}</Error>}
                  <EditGrid>
                    <div>
                      <Label>일자</Label>
                      <Input type="date" value={gDate} onChange={(e)=>setGDate(e.currentTarget.value)} />
                    </div>
                    <div>
                      <Label>과목/시험</Label>
                      <Input placeholder="예: 중간고사 수학" value={gSubject} onChange={(e)=>setGSubject(e.currentTarget.value)} />
                    </div>
                    <div>
                      <Label>점수</Label>
                      <Input placeholder="예: 87" value={gScore} onChange={(e)=>setGScore(e.currentTarget.value)} />
                    </div>
                    <div>
                      <Label>만점</Label>
                      <Input placeholder="예: 100" value={gOutOf} onChange={(e)=>setGOutOf(e.currentTarget.value)} />
                    </div>
                    <div>
                      <Label>등급</Label>
                      <Input placeholder="예: A / 상" value={gLevel} onChange={(e)=>setGLevel(e.currentTarget.value)} />
                    </div>
                    <div>
                      <Label>메모</Label>
                      <TextArea rows={3} placeholder="간단한 메모" value={gNote} onChange={(e)=>setGNote(e.currentTarget.value)} />
                    </div>
                  </EditGrid>
                  <div style={{ display:'flex', gap:8 }}>
                    <UIPrimaryBtn as={"button" as any} onClick={() => {
                      if (!numericId) return;
                      setGErr(null);
                      if (!gDate) { setGErr('일자를 입력해 주세요.'); return; }
                      const score = gScore.trim() ? Number(gScore) : undefined;
                      const outOf = gOutOf.trim() ? Number(gOutOf) : undefined;
                      if (gScore.trim() && Number.isNaN(score)) { setGErr('점수는 숫자로 입력해 주세요.'); return; }
                      if (gOutOf.trim() && Number.isNaN(outOf)) { setGErr('만점은 숫자로 입력해 주세요.'); return; }
                      setGradeBusy(true);
                      try {
                        addStudentGrade(numericId, { date: gDate, subject: gSubject || undefined, score, outOf, level: gLevel || undefined, note: gNote || undefined });
                        setGrades(getStudentGrades(numericId));
                        setGNote(''); setGLevel(''); setGOutOf(''); setGScore('');
                      } finally { setGradeBusy(false); }
                    }}>
                      {gradeBusy ? '저장 중…' : '저장'}
                    </UIPrimaryBtn>
                    <UIGhostBtn as={"button" as any} onClick={() => { setGradeOpen(false); setGErr(null); }}>취소</UIGhostBtn>
                  </div>
                </SectionBody>
              )}
              <Divider />
              <SectionBody>
                {grades.length === 0 ? (
                  <Empty>등록된 성적이 없습니다.</Empty>
                ) : (
                  <List>
                    {grades.map(g => (
                      <ListItem key={g.id}>
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:8, flexWrap:'wrap' }}>
                          <div style={{ display:'grid' }}>
                            <strong>{g.subject || '성적'}</strong>
                            <SmallMuted>{g.date}</SmallMuted>
                          </div>
                          <div style={{ display:'inline-flex', gap:8, alignItems:'center' }}>
                            <span>{g.score != null ? g.score : '-'}{g.outOf != null ? `/${g.outOf}` : ''}</span>
                            {g.level && <StatusChip data-type='ENROLLED'>{g.level}</StatusChip>}
                            <UIGhostBtn as={"button" as any} onClick={() => { if (!numericId) return; removeStudentGrade(numericId, g.id); setGrades(getStudentGrades(numericId)); }}>삭제</UIGhostBtn>
                          </div>
                        </div>
                        {g.note && <div style={{ color:'#475569', fontSize:13 }}>{g.note}</div>}
                      </ListItem>
                    ))}
                  </List>
                )}
              </SectionBody>
            </Card>
            {/* Predictive analytics */}
            <Card>
              <CardHead>
                <SectionTitle>예측 분석</SectionTitle>
                <CardActions>
                  <UISmallBtn as={"button" as any} onClick={() => navigate(`/students/${numericId}/counsels`)}>상담 추가</UISmallBtn>
                </CardActions>
              </CardHead>
              {riskLoading ? (
                <SectionBody>
                  <Skeleton w={180} h={14} />
                  <Skeleton w={420} h={14} mt={8} />
                </SectionBody>
              ) : riskError ? (
                <SectionBody>
                  <Error>{riskError}</Error>
                </SectionBody>
              ) : risk ? (
                <SectionBody>
                  <RiskRow>
                    <RiskPill data-level={risk.level}>
                      {risk.level === 'RISK' ? '위험 단계' : risk.level === 'CAUTION' ? '주의 단계' : '양호'}
                    </RiskPill>
                    <RiskMetrics>
                      <span>출석률 {risk.metrics.attRate30 != null ? `${risk.metrics.attRate30}%` : '—'}</span>
                      <Dot />
                      <span>결석 {risk.metrics.absences30}회</span>
                      <Dot />
                      <span>부정 신호 {risk.metrics.negativeCounselCount30}건</span>
                    </RiskMetrics>
                  </RiskRow>
                  {risk.reasons.length > 0 && (
                    <ReasonList>
                      {risk.reasons.slice(0,3).map((r, i) => (<li key={i}>{r}</li>))}
                    </ReasonList>
                  )}
                  <RecList>
                    {recommendActions(risk).map((s, i) => (<li key={i}>{s}</li>))}
                  </RecList>
                  <ActionRow>
                    <UISmallBtn as={"button" as any} onClick={() => navigate('/classes')}>보강 수업 찾기</UISmallBtn>
                    <UISmallBtn as={"button" as any} onClick={() => navigate(`/students/${numericId}/counsels`)}>상담 일정</UISmallBtn>
                  </ActionRow>
                </SectionBody>
              ) : (
                <SectionBody>
                  <Muted>예측 분석 정보를 준비 중입니다.</Muted>
                </SectionBody>
              )}
            </Card>

            {/* Grades */}
            <Card>
              <CardHead>
                <SectionTitle>시험/성적</SectionTitle>
                <CardActions>
                  {!gradeOpen ? (
                    <UISmallBtn as={"button" as any} onClick={() => setGradeOpen(true)}>추가</UISmallBtn>
                  ) : (
                    <UISmallBtn as={"button" as any} onClick={() => { setGradeOpen(false); setGErr(null); }}>닫기</UISmallBtn>
                  )}
                </CardActions>
              </CardHead>
              {gradeOpen && (
                <SectionBody>
                  {gErr && <Error>{gErr}</Error>}
                  <EditGrid>
                    <div>
                      <Label>일자</Label>
                      <Input type="date" value={gDate} onChange={(e)=>setGDate(e.currentTarget.value)} />
                    </div>
                    <div>
                      <Label>과목/시험</Label>
                      <Input placeholder="예: 중간고사 수학" value={gSubject} onChange={(e)=>setGSubject(e.currentTarget.value)} />
                    </div>
                    <div>
                      <Label>점수</Label>
                      <Input placeholder="예: 87" value={gScore} onChange={(e)=>setGScore(e.currentTarget.value)} />
                    </div>
                    <div>
                      <Label>만점</Label>
                      <Input placeholder="예: 100" value={gOutOf} onChange={(e)=>setGOutOf(e.currentTarget.value)} />
                    </div>
                    <div>
                      <Label>등급</Label>
                      <Input placeholder="예: A / 상" value={gLevel} onChange={(e)=>setGLevel(e.currentTarget.value)} />
                    </div>
                    <div>
                      <Label>메모</Label>
                      <TextArea rows={3} placeholder="간단한 메모" value={gNote} onChange={(e)=>setGNote(e.currentTarget.value)} />
                    </div>
                  </EditGrid>
                  <div style={{ display:'flex', gap:8 }}>
                    <UIPrimaryBtn as={"button" as any} onClick={() => {
                      if (!numericId) return;
                      setGErr(null);
                      if (!gDate) { setGErr('일자를 입력해 주세요.'); return; }
                      const score = gScore.trim() ? Number(gScore) : undefined;
                      const outOf = gOutOf.trim() ? Number(gOutOf) : undefined;
                      if (gScore.trim() && Number.isNaN(score)) { setGErr('점수는 숫자로 입력해 주세요.'); return; }
                      if (gOutOf.trim() && Number.isNaN(outOf)) { setGErr('만점은 숫자로 입력해 주세요.'); return; }
                      setGradeBusy(true);
                      try {
                        addStudentGrade(numericId, { date: gDate, subject: gSubject || undefined, score, outOf, level: gLevel || undefined, note: gNote || undefined });
                        setGrades(getStudentGrades(numericId));
                        setGNote(''); setGLevel(''); setGOutOf(''); setGScore('');
                      } finally { setGradeBusy(false); }
                    }}>
                      {gradeBusy ? '저장 중…' : '저장'}
                    </UIPrimaryBtn>
                    <UIGhostBtn as={"button" as any} onClick={() => { setGradeOpen(false); setGErr(null); }}>취소</UIGhostBtn>
                  </div>
                </SectionBody>
              )}
              <Divider />
              <SectionBody>
                {grades.length === 0 ? (
                  <Empty>등록된 성적이 없습니다.</Empty>
                ) : (
                  <List>
                    {grades.map(g => (
                      <ListItem key={g.id}>
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:8, flexWrap:'wrap' }}>
                          <div style={{ display:'grid' }}>
                            <strong>{g.subject || '성적'}</strong>
                            <SmallMuted>{g.date}</SmallMuted>
                          </div>
                          <div style={{ display:'inline-flex', gap:8, alignItems:'center' }}>
                            <span>{g.score != null ? g.score : '-'}{g.outOf != null ? `/${g.outOf}` : ''}</span>
                            {g.level && <StatusChip data-type='ENROLLED'>{g.level}</StatusChip>}
                            <UIGhostBtn as={"button" as any} onClick={() => { if (!numericId) return; removeStudentGrade(numericId, g.id); setGrades(getStudentGrades(numericId)); }}>삭제</UIGhostBtn>
                          </div>
                        </div>
                        {g.note && <div style={{ color:'#475569', fontSize:13 }}>{g.note}</div>}
                      </ListItem>
                    ))}
                  </List>
                )}
              </SectionBody>
            </Card>
            {/* Predictive analytics */}
            <Card>
              <CardHead>
                <SectionTitle>예측 분석</SectionTitle>
                <CardActions>
                  <UISmallBtn as={"button" as any} onClick={() => navigate(`/students/${numericId}/counsels`)}>상담 추가</UISmallBtn>
                </CardActions>
              </CardHead>
              {riskLoading ? (
                <SectionBody>
                  <Skeleton w={180} h={14} />
                  <Skeleton w={420} h={14} mt={8} />
                </SectionBody>
              ) : riskError ? (
                <SectionBody>
                  <Error>{riskError}</Error>
                </SectionBody>
              ) : risk ? (
                <SectionBody>
                  <RiskRow>
                    <RiskPill data-level={risk.level}>
                      {risk.level === 'RISK' ? '위험 단계' : risk.level === 'CAUTION' ? '주의 단계' : '양호'}
                    </RiskPill>
                    <RiskMetrics>
                      <span>출석률 {risk.metrics.attRate30 != null ? `${risk.metrics.attRate30}%` : '—'}</span>
                      <Dot />
                      <span>결석 {risk.metrics.absences30}회</span>
                      <Dot />
                      <span>부정 신호 {risk.metrics.negativeCounselCount30}건</span>
                    </RiskMetrics>
                  </RiskRow>
                  {risk.reasons.length > 0 && (
                    <ReasonList>
                      {risk.reasons.slice(0,3).map((r, i) => (<li key={i}>{r}</li>))}
                    </ReasonList>
                  )}
                  <RecList>
                    {recommendActions(risk).map((s, i) => (<li key={i}>{s}</li>))}
                  </RecList>
                  <ActionRow>
                    <UISmallBtn as={"button" as any} onClick={() => navigate('/classes')}>보강 수업 찾기</UISmallBtn>
                    <UISmallBtn as={"button" as any} onClick={() => navigate(`/students/${numericId}/counsels`)}>상담 일정</UISmallBtn>
                  </ActionRow>
                </SectionBody>
              ) : (
                <SectionBody>
                  <Muted>예측 분석 정보를 준비 중입니다.</Muted>
                </SectionBody>
              )}
            </Card>

            {/* Grades */}
            <Card>
              <CardHead>
                <SectionTitle>시험/성적</SectionTitle>
                <CardActions>
                  {!gradeOpen ? (
                    <UISmallBtn as={"button" as any} onClick={() => setGradeOpen(true)}>추가</UISmallBtn>
                  ) : (
                    <UISmallBtn as={"button" as any} onClick={() => { setGradeOpen(false); setGErr(null); }}>닫기</UISmallBtn>
                  )}
                </CardActions>
              </CardHead>
              {gradeOpen && (
                <SectionBody>
                  {gErr && <Error>{gErr}</Error>}
                  <EditGrid>
                    <div>
                      <Label>일자</Label>
                      <Input type="date" value={gDate} onChange={(e)=>setGDate(e.currentTarget.value)} />
                    </div>
                    <div>
                      <Label>과목/시험</Label>
                      <Input placeholder="예: 중간고사 수학" value={gSubject} onChange={(e)=>setGSubject(e.currentTarget.value)} />
                    </div>
                    <div>
                      <Label>점수</Label>
                      <Input placeholder="예: 87" value={gScore} onChange={(e)=>setGScore(e.currentTarget.value)} />
                    </div>
                    <div>
                      <Label>만점</Label>
                      <Input placeholder="예: 100" value={gOutOf} onChange={(e)=>setGOutOf(e.currentTarget.value)} />
                    </div>
                    <div>
                      <Label>등급</Label>
                      <Input placeholder="예: A / 상" value={gLevel} onChange={(e)=>setGLevel(e.currentTarget.value)} />
                    </div>
                    <div>
                      <Label>메모</Label>
                      <TextArea rows={3} placeholder="간단한 메모" value={gNote} onChange={(e)=>setGNote(e.currentTarget.value)} />
                    </div>
                  </EditGrid>
                  <div style={{ display:'flex', gap:8 }}>
                    <UIPrimaryBtn as={"button" as any} onClick={() => {
                      if (!numericId) return;
                      setGErr(null);
                      if (!gDate) { setGErr('일자를 입력해 주세요.'); return; }
                      const score = gScore.trim() ? Number(gScore) : undefined;
                      const outOf = gOutOf.trim() ? Number(gOutOf) : undefined;
                      if (gScore.trim() && Number.isNaN(score)) { setGErr('점수는 숫자로 입력해 주세요.'); return; }
                      if (gOutOf.trim() && Number.isNaN(outOf)) { setGErr('만점은 숫자로 입력해 주세요.'); return; }
                      setGradeBusy(true);
                      try {
                        addStudentGrade(numericId, { date: gDate, subject: gSubject || undefined, score, outOf, level: gLevel || undefined, note: gNote || undefined });
                        setGrades(getStudentGrades(numericId));
                        setGNote(''); setGLevel(''); setGOutOf(''); setGScore('');
                      } finally { setGradeBusy(false); }
                    }}>
                      {gradeBusy ? '저장 중…' : '저장'}
                    </UIPrimaryBtn>
                    <UIGhostBtn as={"button" as any} onClick={() => { setGradeOpen(false); setGErr(null); }}>취소</UIGhostBtn>
                  </div>
                </SectionBody>
              )}
              <Divider />
              <SectionBody>
                {grades.length === 0 ? (
                  <Empty>등록된 성적이 없습니다.</Empty>
                ) : (
                  <List>
                    {grades.map(g => (
                      <ListItem key={g.id}>
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:8, flexWrap:'wrap' }}>
                          <div style={{ display:'grid' }}>
                            <strong>{g.subject || '성적'}</strong>
                            <SmallMuted>{g.date}</SmallMuted>
                          </div>
                          <div style={{ display:'inline-flex', gap:8, alignItems:'center' }}>
                            <span>{g.score != null ? g.score : '-'}{g.outOf != null ? `/${g.outOf}` : ''}</span>
                            {g.level && <StatusChip data-type='ENROLLED'>{g.level}</StatusChip>}
                            <UIGhostBtn as={"button" as any} onClick={() => { if (!numericId) return; removeStudentGrade(numericId, g.id); setGrades(getStudentGrades(numericId)); }}>삭제</UIGhostBtn>
                          </div>
                        </div>
                        {g.note && <div style={{ color:'#475569', fontSize:13 }}>{g.note}</div>}
                      </ListItem>
                    ))}
                  </List>
                )}
              </SectionBody>
            </Card>
            <Card>
              <MiniHead>
                <Tabs>
                  <TabButton data-active>{/* active visual only */}수강수업 <Badge>0</Badge></TabButton>
                  <TabButton>출석현황</TabButton>
                  <TabButton>성적</TabButton>
                  <TabButton>상담기록</TabButton>
                </Tabs>
              </MiniHead>
              <Divider />
              <SectionBody>
                <Skeleton w={240} h={14} />
                <Skeleton w={560} h={120} mt={10} />
              </SectionBody>
            </Card>
          </Right>
        </Columns>
      )}
      {error && <Error>{error}</Error>}
      {!loading && (
        <Columns>
          <Left>
            <Card>
              <CardHead>
                <SectionTitle>기본 정보</SectionTitle>
                <CardActions>
                  <UIGhostBtn as={"button" as any} onClick={() => navigate(`/students/${numericId}/edit`)}>수정</UIGhostBtn>
                </CardActions>
              </CardHead>
              {student ? (
                <>
                  <InfoList>
                    <Row>
                      <Avatar>{student.name.slice(0, 1)}</Avatar>
                      <div>
                        <Name>{student.name}</Name>
                        <SmallMuted>코드 {student.code} · ID {student.id}</SmallMuted>
                      </div>
                      <StatusChip data-type={student.status}>
                        {student.status === "ENROLLED" ? "수강중" : student.status === "ON_LEAVE" ? "휴학" : "대기중"}
                      </StatusChip>
                    </Row>
                    <Field>
                      <Label>연락처</Label>
                      <Value>{formatPhone(student.phoneNumber)}</Value>
                    </Field>
                    <Field>
                      <Label>생년월일</Label>
                      <Value>
                        {student.birthDate || "-"}
                        {student.birthDate ? (
                          <> {`(만 ${intlAge ?? "-"}세)`}</>
                        ) : null}
                      </Value>
                    </Field>
                    <Field>
                      <Label>주소</Label>
                      <Value>{student.address || "-"}</Value>
                    </Field>
                    <Field>
                      <Label>등록일</Label>
                      <Value>{student.joinedDate || student.createdAt?.slice(0, 10) || "-"}</Value>
                    </Field>
                    {/* 수강료/할인 UI 제거 (MVP) */}
                  </InfoList>
                  {/* actions moved to header */}
                </>
              ) : (
                <Muted>원생 정보를 찾을 수 없습니다.</Muted>
              )}
            </Card>

            <Card>
              <CardHead>
                <SectionTitle>부모님 정보</SectionTitle>
              </CardHead>
              {student ? (
                <InfoList>
                  <Field>
                    <Label>보호자 이름</Label>
                    <Value>{student.parentName || "-"}</Value>
                  </Field>
                  <Field>
                      <Label>보호자 연락처</Label>
                      <Value>{formatPhone(student.guardianPhone)}</Value>
                  </Field>
                </InfoList>
              ) : (
                <Muted>부모님 정보를 찾을 수 없습니다.</Muted>
              )}
            </Card>

            <Card>
              <CardHead>
                <SectionTitle>특이사항</SectionTitle>
                <CardActions>
                  {editingNotes ? (
                    <>
                      <ModalBtn type="button" onClick={() => { setEditingNotes(false); setNotesInput(notes); }}>취소</ModalBtn>
                      <UIPrimaryBtn as={"button" as any} onClick={saveNotes}>저장</UIPrimaryBtn>
                    </>
                  ) : (
                    <UIGhostBtn as={"button" as any} onClick={() => setEditingNotes(true)}>{notes ? "편집" : "메모 추가"}</UIGhostBtn>
                  )}
                </CardActions>
              </CardHead>
              {editingNotes ? (
                <NotesTextarea
                  rows={8}
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder="예: 과학고 진학 관심, 수학 약점 보완 필요, 알러지 등"
                />
              ) : (
                <>
                  {notes ? (
                    <NotesBox title={notes}>{notes}</NotesBox>
                  ) : (
                    <Empty>특이사항이 없습니다. 메모를 추가해 주세요.</Empty>
                  )}
                </>
              )}
            </Card>

            <Card>
              <CardHead>
                <SectionTitle>메모 사항</SectionTitle>
                <CardActions>
                  <UIGhostBtn as={"button" as any} onClick={addMemo}>추가</UIGhostBtn>
                </CardActions>
              </CardHead>
              <MemoNew>
                <MemoTextarea
                  rows={3}
                  value={newMemo}
                  onChange={(e) => setNewMemo(e.target.value)}
                  placeholder="메모를 입력하세요"
                />
              </MemoNew>
              <MemoList>
                {memos.length === 0 && (
                  <Empty>메모가 없습니다. 메모를 추가해 주세요.</Empty>
                )}
                {memos.map(m => (
                  <MemoItemBox key={m.id}>
                    <MemoHeader>
                      <MemoDate>
                        {formatDate(m.updatedAt || m.createdAt)}
                        {m.updatedAt ? <span style={{ marginLeft: 6, color: '#6b7280' }}>(수정됨)</span> : null}
                      </MemoDate>
                      <MemoActions>
                        {editingMemoId === m.id ? (
                          <>
                            <ModalBtn type="button" onClick={cancelEditMemo}>취소</ModalBtn>
                            <UIPrimaryBtn as={"button" as any} onClick={saveEditMemo}>저장</UIPrimaryBtn>
                          </>
                        ) : (
                          <>
                            <ModalBtn type="button" onClick={() => beginEditMemo(m.id)}>편집</ModalBtn>
                            <ModalBtn type="button" onClick={() => removeMemo(m.id)}>삭제</ModalBtn>
                          </>
                        )}
                      </MemoActions>
                    </MemoHeader>
                    {editingMemoId === m.id ? (
                      <MemoTextarea rows={4} value={editingMemoText} onChange={(e)=>setEditingMemoText(e.target.value)} />
                    ) : (
                      <MemoText>{m.text}</MemoText>
                    )}
                  </MemoItemBox>
                ))}
              </MemoList>
            </Card>
          </Left>

          <Right>
            <Card>
              <MiniHead>
                <Tabs>
                  <TabButton data-active={activeTab === "courses"} onClick={() => navigate(`/students/${numericId}/courses`)}>
                    수강수업 <Badge>{student?.courses?.length ?? 0}</Badge>
                  </TabButton>
                  <TabButton data-active={activeTab === "attendance"} onClick={() => navigate(`/students/${numericId}/attendance`)}>출석현황</TabButton>
                  {/* 결제 탭 제거 (MVP) */}
                  <TabButton data-active={activeTab === "grades"} onClick={() => navigate(`/students/${numericId}/grades`)}>성적</TabButton>
                  <TabButton data-active={activeTab === "counsels"} onClick={() => navigate(`/students/${numericId}/counsels`)}>상담기록</TabButton>
                </Tabs>
              </MiniHead>

              <Divider />

              {activeTab === "courses" && (
                <SectionBody>
                  {student?.courses?.length ? (
                    <CourseList>
                      {student.courses.map((c) => (
                        <CourseItem key={c.id}>
                          <CourseHeader>
                            <CourseTitle>{c.title}</CourseTitle>
                            <ModalBtn type="button" onClick={() => navigate(`/classes/${c.id}`)}>상세</ModalBtn>
                          </CourseHeader>
                          <CourseMeta>
                            <code>{c.code}</code>
                            <CourseStatus data-type={c.status}>{courseStatusLabel(c.status)}</CourseStatus>
                          </CourseMeta>
                        </CourseItem>
                      ))}
                    </CourseList>
                  ) : (
                    <Empty>수강 중인 수업이 없습니다.</Empty>
                  )}
                </SectionBody>
              )}

              {activeTab === "attendance" && (
                <SectionBody>
                  {attError && <Error>{attError}</Error>}
                  <Subgrid>
                    <SmallCard>
                      <SmallTitle>이번 달 출석률</SmallTitle>
                      <KPI>{formatMonthRate(attRows)}</KPI>
                      <SmallMuted>{formatMonthCounts(attRows)}</SmallMuted>
                    </SmallCard>
                    <SmallCard>
                      <SmallTitle>최근 결석</SmallTitle>
                      <SmallMuted>{formatRecentAbsents(attRows)}</SmallMuted>
                    </SmallCard>
                  </Subgrid>
                  {attLoading ? (
                    <Muted>불러오는 중...</Muted>
                  ) : (
                    <UITable style={{ minWidth: 640 }}>
                      <thead>
                        <tr>
                          <th>날짜</th>
                          <th>과목</th>
                          <th>상태</th>
                          <th>메모</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attRows.length === 0 ? (
                          <tr><td colSpan={4}><Muted>출석 기록이 없습니다.</Muted></td></tr>
                        ) : (
                          attRows.map((r, i) => (
                            <tr key={i}>
                              <td>{r.date}</td>
                              <td>{r.courseTitle}</td>
                              <td>{r.present ? '출석' : '결석'}</td>
                              <td>{r.reason || '-'}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </UITable>
                  )}
                </SectionBody>
              )}

              {activeTab === "grades" && (
                <SectionBody>
                  <SmallTitle>시험/성적</SmallTitle>
                  <Divider />
                  {grades.length === 0 ? (
                    <Empty>등록된 성적이 없습니다.</Empty>
                  ) : (
                    <List>
                      {grades.map(g => (
                        <ListItem key={g.id}>
                          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:8, flexWrap:'wrap' }}>
                            <div style={{ display:'grid' }}>
                              <strong>{g.subject || '성적'}</strong>
                              <SmallMuted>{g.date}</SmallMuted>
                            </div>
                            <div style={{ display:'inline-flex', gap:8, alignItems:'center' }}>
                              <span>{g.score != null ? g.score : '-'}{g.outOf != null ? `/${g.outOf}` : ''}</span>
                              {g.level && <StatusChip data-type='ENROLLED'>{g.level}</StatusChip>}
                            </div>
                          </div>
                          {g.note && <div style={{ color:'#475569', fontSize:13 }}>{g.note}</div>}
                        </ListItem>
                      ))}
                    </List>
                  )}
                </SectionBody>
              )}
              {/* 결제 탭 본문 제거 (MVP) */}

              {activeTab === "counsels" && (
                <SectionBody>
                  <div style={{ display:'grid', gap:8 }}>
                    <SmallTitle>상담 AI 요약</SmallTitle>
                    <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
                      <UIPrimaryBtn as={"button" as any} onClick={handleCounselSummarize} disabled={counselSummaryLoading}>
                        {counselSummaryLoading ? '요약 생성 중…' : '요약 생성'}
                      </UIPrimaryBtn>
                      {!!counselSummary && (
                        <UIGhostBtn as={"button" as any} onClick={() => { try { navigator.clipboard?.writeText(counselSummary); } catch {} }}>복사</UIGhostBtn>
                      )}
                      {counselSummaryError && <Error style={{ marginLeft: 6 }}>{counselSummaryError}</Error>}
                    </div>
                    {!!counselSummary && (
                      <NotesBox as="pre" style={{ whiteSpace: 'pre-wrap' }}>{counselSummary}</NotesBox>
                    )}
                  </div>
                  <Divider />
                  <CounselHeader>
                    <div>
                      <SmallTitle>상담기록</SmallTitle>
                    </div>
                    <div style={{ display:'inline-flex', gap: 8, alignItems:'center' }}>
                      {addingCounsel ? (
                        <>
                          <ModalBtn type="button" onClick={() => { setAddingCounsel(false); setNewContent(""); setNewHour(""); setNewMin(""); }}>취소</ModalBtn>
                          <UIPrimaryBtn as={"button" as any} onClick={onSubmitNewCounsel} disabled={newSubmitting || !newHour || !newMin}>저장</UIPrimaryBtn>
                        </>
                      ) : (
                        <>
                          <ModalBtn type="button" onClick={handleCounselExport} disabled={exportingCounsel}>
                            {exportingCounsel ? '엑셀 준비 중...' : '엑셀 추출'}
                          </ModalBtn>
                          <UIGhostBtn as={"button" as any} onClick={() => { setAddingCounsel(true); /* default to today without time */ setNewDate(() => { const d=new Date(); return `${d.getFullYear()}-${two(d.getMonth()+1)}-${two(d.getDate())}`; }); setNewHour(""); setNewMin(""); }}>상담 추가</UIGhostBtn>
                        </>
                      )}
                    </div>
                  </CounselHeader>
                  {counselError && <Error>{counselError}</Error>}
                  {addingCounsel && (
                    <NewCounselForm>
                      <Field>
                        <Label>상담 일자</Label>
                        <Input type="date" lang="ko-KR" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
                      </Field>
                      <Field>
                        <Label>시간</Label>
                        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                          <div style={{ flex:1 }}>
                            <SelectBox ariaLabel="시" value={newHour} onChange={setNewHour} placeholder="시" options={hours24.map(h => ({ label: h, value: h }))} />
                          </div>
                          <span>:</span>
                          <div style={{ flex:1 }}>
                            <SelectBox ariaLabel="분" value={newMin} onChange={setNewMin} placeholder="분" options={mins5.map(m => ({ label: m, value: m }))} />
                          </div>
                        </div>
                      </Field>
                      <Field style={{ gridColumn: "1 / -1" }}>
                        <Label>내용</Label>
                        <TextArea rows={4} value={newContent} onChange={(e) => setNewContent(e.target.value)} placeholder="상담 내용 또는 메모" />
                      </Field>
                    </NewCounselForm>
                  )}
                  {counselLoading ? (
                    <Muted>불러오는 중...</Muted>
                  ) : counsels.length === 0 ? (
                    <Empty>상담 기록이 없습니다.</Empty>
                  ) : (
                    <List>
                      {counsels.map((c) => {
                        const isEditing = editingCounselId === c.id;
                        return (
                          <ListItem key={c.id}>
                            {!isEditing ? (
                              <>
                                <CounselRow>
                                  <When>{formatKDateTime(c.counselTime)}</When>
                                  <RowActions>
                                    <ModalBtn type="button" onClick={() => { setEditingCounselId(c.id); try { const d = new Date(c.counselTime); setEditDate(`${d.getFullYear()}-${two(d.getMonth()+1)}-${two(d.getDate())}`); setEditHour(two(d.getHours())); setEditMin(two(d.getMinutes())); } catch { setEditDate(''); setEditHour(''); setEditMin(''); } setEditContent(c.content || ""); }}>편집</ModalBtn>
                                    <ModalBtn type="button" onClick={() => setConfirmCounselId(c.id)}>삭제</ModalBtn>
                                  </RowActions>
                                </CounselRow>
                                <CounselContent>{(c.content || '').trim() || '내용 없음'}</CounselContent>
                              </>
                            ) : (
                              <>
                                <EditGrid>
                                  <Field>
                                    <Label>상담 일자</Label>
                                    <Input type="date" lang="ko-KR" value={editDate} onChange={(e)=>setEditDate(e.target.value)} />
                                  </Field>
                                  <Field>
                                    <Label>시간</Label>
                                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                                      <div style={{ flex:1 }}>
                                        <SelectBox ariaLabel="시" value={editHour} onChange={setEditHour} placeholder="시" options={hours24.map(h => ({ label: h, value: h }))} />
                                      </div>
                                      <span>:</span>
                                      <div style={{ flex:1 }}>
                                        <SelectBox ariaLabel="분" value={editMin} onChange={setEditMin} placeholder="분" options={mins5.map(m => ({ label: m, value: m }))} />
                                      </div>
                                    </div>
                                  </Field>
                                  <Field style={{ gridColumn: '1 / -1' }}>
                                    <Label>내용</Label>
                                    <TextArea rows={4} value={editContent} onChange={(e)=>setEditContent(e.target.value)} />
                                  </Field>
                                </EditGrid>
                                <RowActions>
                                  <ModalBtn type="button" onClick={() => { setEditingCounselId(null); setEditDate(""); setEditHour(""); setEditMin(""); setEditContent(""); }}>취소</ModalBtn>
                                  <UIPrimaryBtn as={"button" as any} disabled={savingEdit || !editDate || !editHour || !editMin} onClick={() => onSaveEdit(c.id)}>저장</UIPrimaryBtn>
                                </RowActions>
                              </>
                            )}
                          </ListItem>
                        );
                      })}
                    </List>
                  )}
                </SectionBody>
              )}
            </Card>
          </Right>
        </Columns>
      )}

      <ConfirmDialog
        open={confirmCounselId != null}
        title="상담 일정 삭제"
        message="이 상담 일정을 삭제하시겠어요? 되돌릴 수 없습니다."
        confirmLabel="삭제"
        cancelLabel="취소"
        tone="danger"
        busy={confirmCounselBusy}
        onCancel={() => { if (!confirmCounselBusy) setConfirmCounselId(null); }}
        onConfirm={async () => {
          if (!numericId || confirmCounselId == null) return;
          setConfirmCounselBusy(true);
          try {
            await deleteCounsel(confirmCounselId);
            const res = await listCounsels({ studentId: numericId, size: 100 });
            setCounsels(res.content || []);
            setConfirmCounselId(null);
          } catch (e: any) {
            showError(e?.message || '삭제에 실패했습니다.');
          } finally {
            setConfirmCounselBusy(false);
          }
        }}
      />

    </Page>
  );
}

// 결제내역: 현재 API 미구현으로 더미/목업 데이터 제거, 빈 상태로 표시합니다.


// Layout
const Page = styled.div`
  display: grid; gap: 14px;
`;
const TopBar = styled.div`
  display: flex; align-items: center; gap: 10px;
  h2 { margin: 0; font-size: 20px; color: #0f172a; }
`;
const Crumbs = styled.div`
  color: #9ca3af; font-size: 12px; margin-top: -6px; margin-bottom: 4px;
`;
// Back button unified via shared component
const Columns = styled.div`
  display: grid; grid-template-columns: 360px 1fr; gap: 14px; align-items: start;
  @media (max-width: 1200px) { grid-template-columns: 1fr; }
`;
const Left = styled.aside`
  display: grid; gap: 18px;
`;
const Right = styled.section``;

// Cards/blocks
const Card = styled.section`
  background: #fff; border: 1px solid #e5e7eb; border-radius: 14px; padding: 16px; min-width: 0;
  box-shadow: 0 1px 2px rgba(0,0,0,0.03);
`;
const SectionTitle = styled.h3`
  margin: 0; font-size: 16px; color: #0f172a;
`;
const CardHead = styled.div`
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;
`;
const CardActions = styled.div`
  display: inline-flex; gap: 12px;
`;
const Divider = styled.div`
  height: 1px; background: #e5e7eb; margin: 6px 0 10px;
`;
const InfoList = styled.div`
  display: grid; gap: 14px;
`;
const Row = styled.div`
  display: grid; grid-template-columns: 44px 1fr auto; gap: 12px; align-items: center; margin-bottom: 6px;
`;
const Avatar = styled.div`
  width: 44px; height: 44px; border-radius: 12px; background: #eef2ff; color: #4f46e5; display: grid; place-items: center; font-weight: 800;
`;
const Name = styled.div`
  font-size: 19px; font-weight: 900; color: #0f172a; letter-spacing: -0.01em;
`;
const SmallMuted = styled.div`
  color: #6b7280; font-size: 12px;
`;
const StatusChip = styled.span`
  padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: 800;
  &[data-type='ENROLLED'] { background:#dcfce7; color:#16a34a; }
  &[data-type='ON_LEAVE'] { background:#fef3c7; color:#b45309; }
  &[data-type='PENDING'] { background:#f3e8ff; color:#7c3aed; }
`;
const Field = styled.div`
  display: grid; grid-template-columns: 100px 1fr; gap: 8px;
`;
const Label = styled.div`
  color: #6b7280; font-size: 13px; align-self: center;
`;
const Value = styled.div`
  color: #111827; font-size: 15px;
`;
const Muted = styled.div`
  color: #6b7280; font-size: 13px;
`;
// Hint removed (unused)
const Error = styled.div`
  color: #b91c1c; font-size: 12px; font-weight: 700;
`;

// Right side mini header and content
const MiniHead = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  position: sticky; top: 0; background: #fff; z-index: 5; padding-top: 2px;
`;
const Tabs = styled.div`
  display: inline-flex; gap: 6px; flex-wrap: wrap;
`;
const TabButton = styled(UISmallBtn)`
  height: 40px;
  padding: 0 16px;
  font-size: 14px;
  &[data-active='true'] {
    background:#111827;
    color:#fff;
    border-color:#111827;
  }
`;
const Badge = styled.span`
  min-width: 18px; height: 18px; padding: 0 6px; border-radius: 9999px; background:#e5e7eb; color:#374151; font-weight: 800; font-size: 11px; display: inline-flex; align-items: center; justify-content: center;
`;

const SectionBody = styled.div`
  display: grid; gap: 10px;
`;
const CourseList = styled.div`
  display: grid; gap: 8px;
`;
const CourseItem = styled.div`
  border: 1px solid #e5e7eb; border-radius: 10px; padding: 10px 12px; display: grid; gap: 6px; background: #fff;
`;
const CourseHeader = styled.div`
  display: flex; align-items: center; justify-content: space-between; gap: 8px;
`;
const CourseTitle = styled.div`
  font-weight: 800; color: #0f172a; font-size: 14px;
`;
const CourseMeta = styled.div`
  display: flex; align-items: center; gap: 10px; color: #6b7280; font-size: 12px;
  code { background:#f3f4f6; padding: 2px 6px; border-radius: 6px; }
`;
const CourseStatus = styled.span`
  padding: 2px 8px; border-radius: 9999px; font-size: 12px; font-weight: 800;
  &[data-type='IN_PROGRESS'] { background:#dcfce7; color:#16a34a; }
  &[data-type='PENDING'] { background:#f3e8ff; color:#7c3aed; }
  &[data-type='STOPPED'] { background:#e5e7eb; color:#374151; }
`;

const Subgrid = styled.div`
  display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px;
`;
const SmallCard = styled.div`
  border: 1px solid #e5e7eb; border-radius: 10px; padding: 10px 12px; background: #fff;
`;
const SmallTitle = styled.div`
  color: #6b7280; font-size: 12px;
`;
const KPI = styled.div`
  font-size: 22px; font-weight: 900; color: #0f172a; margin-top: 4px;
`;

// Table from common UI

const List = styled.div`
  display: grid; gap: 8px;
`;
const ListItem = styled.div`
  border: 1px solid #e5e7eb; border-radius: 10px; padding: 10px 12px; background: #fff; display: grid; gap: 4px;
  strong { color: #0f172a; }
`;
const Empty = styled.div`
  color: #6b7280; font-size: 13px; text-align: center; border: 1px dashed #e5e7eb; border-radius: 10px; padding: 16px; background: #fafafa;
`;

// Risk styles
const RiskRow = styled.div` display:flex; align-items:center; gap:12px; flex-wrap:wrap; `;
const RiskPill = styled.span`
  display:inline-flex; align-items:center; justify-content:center; gap:6px;
  padding: 4px 10px; border-radius: 9999px; font-weight: 800; font-size: 12px;
  color:#0f172a; background:#f3f4f6; border:1px solid #e5e7eb;
  &[data-level='CAUTION']{ background:#fef3c7; color:#b45309; border-color:#fcd34d; }
  &[data-level='RISK']{ background:#fee2e2; color:#b91c1c; border-color:#fecaca; }
  &[data-level='LOW']{ background:#dcfce7; color:#15803d; border-color:#bbf7d0; }
`;
const RiskMetrics = styled.div` color:#475569; font-size:12px; display:inline-flex; align-items:center; gap:10px; flex-wrap:wrap; `;
const Dot = styled.i` width:4px; height:4px; background:#cbd5e1; display:inline-block; border-radius:50%; `;
const ReasonList = styled.ul` margin:10px 0 0; padding-left: 18px; color:#334155; font-size:13px; `;
const RecList = styled.ul` margin:10px 0; padding-left: 18px; color:#111827; font-size:13px; `;
const ActionRow = styled.div` display:flex; gap:8px; flex-wrap:wrap; `;

// Actions under basic info
// Button from common UI
// BtnRow removed (unused)
const ModalBtn = styled(UISmallBtn)`
  height: 40px;
  padding: 0 16px;
  font-size: 14px;
`;
// Button from common UI

// Notes section styles
const NotesBox = styled.pre`
  margin: 0; white-space: pre-line; color: #111827; font-size: 15px; line-height: 1.7;
  background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 12px 14px; text-wrap: pretty;
`;
const NotesTextarea = styled.textarea`
  width: 100%; border: 1px solid #e5e7eb; border-radius: 10px; padding: 10px 12px; resize: vertical; font-size: 14px; color: #111827; min-height: 120px;
  &:focus { outline: none; box-shadow: 0 0 0 3px rgba(79,70,229,0.15); }
`;

// Memo list styles
const MemoNew = styled.div` display:grid; gap:8px; `;
const MemoList = styled.div` display:grid; gap:8px; `;
const MemoItemBox = styled.div`
  border: 1px solid #e5e7eb; border-radius: 10px; padding: 10px 12px; background: #fff; display: grid; gap: 6px;
`;
const MemoHeader = styled.div` display:flex; align-items:center; justify-content:space-between; gap:8px; `;
const MemoDate = styled.div` color:#6b7280; font-size:12px; `;
const MemoActions = styled.div` display:inline-flex; gap:6px; `;
const MemoTextarea = styled.textarea`
  width: 100%; border: 1px solid #e5e7eb; border-radius: 10px; padding: 8px 10px; resize: vertical; font-size: 14px; color: #111827;
`;
const MemoText = styled.pre` margin:0; white-space:pre-wrap; color:#111827; font-size:14px; `;

// Skeletons
const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: 200px 0; }
`;
const SkeletonBase = styled.div<{ w?: number; h?: number; mt?: number }>`
  background: linear-gradient(90deg, #eef2f7 25%, #f6f8fb 37%, #eef2f7 63%);
  background-size: 400px 100%;
  animation: ${shimmer} 1.2s ease-in-out infinite;
  border-radius: 8px;
  width: ${({ w }) => (w ? `${w}px` : "100%")};
  height: ${({ h }) => (h ? `${h}px` : "12px")};
  margin-top: ${({ mt }) => (mt ? `${mt}px` : 0)};
`;
const Skeleton = SkeletonBase;
const AvatarSkeleton = styled(SkeletonBase).attrs({ w: 44, h: 44 })`
  border-radius: 12px;
`;
const SkeletonRow = styled.div`
  display: grid; grid-template-columns: 44px 1fr 80px; gap: 10px; align-items: center; margin-bottom: 8px;
`;
const SkeletonChip = styled(SkeletonBase).attrs({ w: 80, h: 24 })``;
const SkField = styled(SkeletonBase).attrs({ h: 16, mt: 10 })``;

// Arrow icon resides in BackButton

function saveBlobAsFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function sanitizeFilename(raw: string) {
  const base = raw ? raw.trim() : 'export';
  const cleaned = base.replace(/[\\/:*?"<>|]+/g, '_');
  return cleaned.length ? cleaned : 'export';
}

function two(n: number) { return String(n).padStart(2, '0'); }
function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    const y = d.getFullYear();
    const m = two(d.getMonth()+1);
    const da = two(d.getDate());
    const hh = two(d.getHours());
    const mi = two(d.getMinutes());
    return `${y}-${m}-${da} ${hh}:${mi}`;
  } catch {
    return iso;
  }
}

// Attendance helpers
function formatMonthRate(rows: StudentAttendance[]): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  const monthRows = rows.filter(r => {
    const [yy, mm] = r.date.split('-').map(Number);
    return yy === y && mm === m;
  });
  if (monthRows.length === 0) return '—';
  const present = monthRows.filter(r => r.present).length;
  const rate = Math.round((present / monthRows.length) * 100);
  return `${rate}%`;
}
function formatMonthCounts(rows: StudentAttendance[]): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  const monthRows = rows.filter(r => {
    const [yy, mm] = r.date.split('-').map(Number);
    return yy === y && mm === m;
  });
  if (monthRows.length === 0) return '—';
  const present = monthRows.filter(r => r.present).length;
  return `${present}/${monthRows.length}회 출석`;
}
function formatRecentAbsents(rows: StudentAttendance[]): string {
  const abs = rows.filter(r => !r.present).slice(0, 2).map(r => r.date);
  if (abs.length === 0) return '없음';
  return abs.join(', ');
}

// Counsel helpers
function formatKDateTime(iso: string) {
  try {
    const d = new Date(iso);
    const yoil = ['일','월','화','수','목','금','토'][d.getDay()];
    const y = d.getFullYear();
    const m = d.getMonth()+1;
    const da = d.getDate();
    const hh = two(d.getHours());
    const mi = two(d.getMinutes());
    return `${y}년 ${m}월 ${da}일 (${yoil}) ${hh}:${mi}`;
  } catch { return iso; }
}
function nowLocalInput() {
  const d = new Date();
  const y = d.getFullYear();
  const m = two(d.getMonth()+1);
  const da = two(d.getDate());
  const hh = two(d.getHours());
  const mi = two(d.getMinutes());
  return `${y}-${m}-${da}T${hh}:${mi}`;
}
function fromLocalInput(local: string) {
  if (!local) return local;
  return local.length === 16 ? `${local}:00` : local;
}
function isoToLocalInput(iso: string) {
  try {
    const d = new Date(iso);
    const y = d.getFullYear();
    const m = two(d.getMonth()+1);
    const da = two(d.getDate());
    const hh = two(d.getHours());
    const mi = two(d.getMinutes());
    return `${y}-${m}-${da}T${hh}:${mi}`;
  } catch { return ''; }
}


// Styles for counsel section
const CounselHeader = styled.div`
  display: flex; align-items: center; justify-content: space-between; gap: 8px;
`;
const NewCounselForm = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 4px 0 8px;
  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;
const Input = styled.input`
  height: 36px; border: 1px solid #e5e7eb; border-radius: 10px; padding: 0 10px; font-size: 14px;
`;
const TextArea = styled.textarea`
  width: 100%; border: 1px solid #e5e7eb; border-radius: 10px; padding: 8px 10px; font-size: 14px; resize: vertical;
`;
const Select = styled.select`
  height: 36px; border: 1px solid #e5e7eb; border-radius: 10px; padding: 0 8px; font-size: 14px; background:#fff; color:#0f172a;
`;
const CounselRow = styled.div` display:flex; align-items:center; justify-content:space-between; gap:8px; `;
const RowActions = styled.div` display:inline-flex; gap:12px; `;
const When = styled.div` font-weight:900; color:#0f172a; `;
const CounselContent = styled.pre` margin:4px 0 0; white-space:pre-wrap; color:#111827; font-size:14px; `;
const EditGrid = styled.div` display:grid; grid-template-columns: 1fr 1fr; gap:10px; @media(max-width:900px){ grid-template-columns:1fr; }`;

// moved onSaveEdit into component scope above
