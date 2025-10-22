import { useEffect, useMemo, useRef, useState } from "react";
import SelectBox from "@/components/common/SelectBox";
import { useNavigate, useParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import {
  TableBase as UITable,
  GhostBtn as UIGhostLink,
  GhostButton as UIGhostButton,
  PrimaryButton as UIPrimaryButton,
  PrimaryButtonSm as UIPrimaryButtonSm,
  SmallBtn as UISmallBtn,
} from "@/components/common/UI";
import BackButton from "@/components/common/BackButton";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import Modal from "@/components/common/Modal";
import {
  listCounsels,
  createCounsel,
  updateCounsel,
  deleteCounsel,
  downloadCounselsExcel,
  type Counsel,
} from "@/api/counsels";
import {
  getStudent,
  getStudentAttendance,
  deleteStudent,
  type Student,
  type StudentAttendance,
} from "@/api/students";
import { listExams, listExamResults } from "@/api/exams";
// formatMoney 사용 제거됨 (MVP)
import { formatPhone, formatKoreanDateTime } from "@/lib/format";
// import { calcRisk, recommendActions, type RiskResult } from "@/features/risk/riskUtils"; // RISK FEATURE DISABLED
import { useToast } from "@/components/common/Toast";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import { readableError } from "@/lib/errors";

type TabKey = "courses" | "attendance" | "counsels" | "grades";

type GradeEntry = {
  id: string;
  date?: string;
  subject?: string | null;
  courseId?: number;
  score?: number | null;
  outOf?: number | null;
  level?: string | null;
  note?: string | null;
};

export default function StudentDetail() {
  const navigate = useNavigate();
  const { id, tab: tabParam } = useParams();
  const numericId = useMemo(() => Number(id), [id]);
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState<string>("");
  const [deleting, setDeleting] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesInput, setNotesInput] = useState("");
  // Tuition UI removed (MVP)
  // Per-item memos (temporary local persistence until API ready)
  type MemoItem = {
    id: number;
    text: string;
    createdAt: string;
    updatedAt?: string;
  };
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
    return `${d.getFullYear()}-${two(d.getMonth() + 1)}-${two(d.getDate())}`;
  });
  const [newHour, setNewHour] = useState<string>("");
  const [newMin, setNewMin] = useState<string>("");
  const [newContent, setNewContent] = useState<string>("");
  const [newSubmitting, setNewSubmitting] = useState(false);
  const newCounselContentRef = useRef<HTMLTextAreaElement | null>(null);
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
  const { error: showError, success: showSuccess } = useToast();
  const { confirm: confirmDelete, dialog: deleteConfirmDialog } =
    useConfirmDialog({
      confirmLabel: "삭제",
      cancelLabel: "취소",
      tone: "danger",
    });
  // Predictive risk (disabled) – placeholders to avoid runtime refs
  // Predictive risk feature disabled
  // 시험 성적 목록 (API 기반)
  const [examGrades, setExamGrades] = useState<GradeEntry[]>([]);
  const [examGradesLoading, setExamGradesLoading] = useState(false);
  const [examGradesError, setExamGradesError] = useState<string | null>(null);
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
      case "IN_PROGRESS":
        return "진행중";
      case "PENDING":
        return "대기";
      case "STOPPED":
        return "중단";
      default:
        return s;
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
      } catch (e) {
        if (!cancelled)
          setError(readableError(e, "원생 정보를 불러오지 못했습니다."));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [numericId]);

  // Load minimal data for predictive risk (disabled)
  // useEffect(() => {
  //   if (!numericId || Number.isNaN(numericId)) return;
  //   let cancelled = false;
  //   async function loadRisk() {
  //     setRiskLoading(true); setRiskError(null);
  //     try {
  //       const att = await getStudentAttendance(numericId, { size: 200 });
  //       if (cancelled) return;
  //       const computed = calcRisk(att.content || [], [], { days: 30 });
  //       setRisk(computed);
  //     } catch (e: any) {
  //       if (!cancelled) setRiskError(e?.message || '예측 분석 정보를 불러오지 못했습니다.');
  //     } finally {
  //       if (!cancelled) setRiskLoading(false);
  //     }
  //   }
  //   void loadRisk();
  //   return () => { cancelled = true; };
  // }, [numericId]);

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
      } catch (e) {
        if (!cancelled)
          setCounselError(readableError(e, "상담 기록을 불러오지 못했습니다."));
      } finally {
        if (!cancelled) setCounselLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [numericId, activeTab]);

  // helper to (re)load exam grades for current student
  async function reloadExamGrades() {
    if (!numericId) return;
    const courses = student?.courses || [];
    if (!courses.length) {
      setExamGrades([]);
      return;
    }
    setExamGradesLoading(true);
    setExamGradesError(null);
    try {
      const examsPerCourse = await Promise.all(
        courses.map(async (c) => {
          const list = await listExams(c.id);
          return list.map((ex) => ({
            courseId: c.id,
            courseTitle: c.title,
            exam: ex,
          }));
        })
      );
      const pairs = examsPerCourse.flat();
      const results = await Promise.all(
        pairs.map(async ({ courseId, courseTitle, exam }) => {
          const rows = await listExamResults(courseId, exam.id);
          const mine = rows.find((r) => r.studentId === numericId);
          if (!mine) return null;
          const date =
            exam.examDate ||
            (exam.createdAt ? exam.createdAt.slice(0, 10) : "");
          const entry: GradeEntry = {
            id: `exam:${courseId}:${exam.id}:${numericId}`,
            date,
            subject: exam.title,
            courseId,
            score: mine.score,
            outOf: mine.outOf,
            level: mine.level,
            note: mine.note,
          };
          return entry;
        })
      );
      const filtered = results.filter((x): x is GradeEntry => !!x);
      setExamGrades(filtered);
    } catch (e) {
      setExamGradesError(readableError(e, "시험 성적을 불러오지 못했습니다."));
    } finally {
      setExamGradesLoading(false);
    }
  }

  // Load exam-based grades linked to student's courses when Grades tab is active
  useEffect(() => {
    if (!numericId || activeTab !== "grades") return;
    void reloadExamGrades();
  }, [numericId, activeTab, student?.courses]);

  const displayGrades = useMemo(() => {
    // Use only exam-based grades; manual grades removed
    const list = examGrades.slice();
    return list.sort((a, b) => {
      const ta = Date.parse(a.date || "");
      const tb = Date.parse(b.date || "");
      return (isNaN(tb) ? 0 : tb) - (isNaN(ta) ? 0 : ta);
    });
  }, [examGrades]);

  // EXAM input options for add form
  const EXAM_MODE_OPTIONS = [
    {
      value: "percent" as const,
      label: "백분율 입력",
      description: "0~100점 점수로 기록합니다.",
    },
    {
      value: "letter" as const,
      label: "등급 입력",
      description: "A~F 등급으로 기록합니다.",
    },
  ];

  function initGradeForm() {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, "0");
    const d = String(today.getDate()).padStart(2, "0");
    setGDate(`${y}-${m}-${d}`);
    const firstCourseId = student?.courses?.[0]?.id;
    setGCourseId(firstCourseId ?? "");
    setGTitle("");
    setGMode("percent");
    setGScore("");
    setGOutOf("100");
    setGLevel("");
    setGNote("");
    setGSubject("");
  }

  useEffect(() => {
    if (gradeOpen) initGradeForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gradeOpen]);

  async function handleAddExamResult() {
    if (!numericId) return;
    setGErr(null);
    const courseId =
      typeof gCourseId === "number" ? gCourseId : Number(gCourseId);
    if (!courseId || Number.isNaN(courseId)) {
      setGErr("수업을 선택해 주세요.");
      return;
    }
    if (!gDate) {
      setGErr("일자를 입력해 주세요.");
      return;
    }
    const title = (gTitle || "").trim();
    if (!title) {
      setGErr("시험 제목을 입력해 주세요.");
      return;
    }
    let score: number | undefined = undefined;
    let outOf: number | undefined = undefined;
    let level: string | undefined = undefined;
    if (gMode === "percent") {
      const s = (gScore || "").trim();
      if (s) {
        const n = Number(s);
        if (Number.isNaN(n)) {
          setGErr("점수는 숫자로 입력해 주세요.");
          return;
        }
        score = Math.max(0, Math.min(100, Math.round(n)));
        const o = (gOutOf || "").trim();
        outOf = o ? Number(o) : 100;
        if (Number.isNaN(outOf)) {
          setGErr("만점은 숫자로 입력해 주세요.");
          return;
        }
      }
    } else {
      const lv = (gLevel || "").trim();
      level = lv || undefined;
    }
    setGradeBusy(true);
    try {
      const exam = await createExam(courseId, {
        title,
        examDate: gDate,
        kind: "TEST",
        inputMode: gMode,
      });
      await upsertExamResults(courseId, exam.id, [
        {
          studentId: numericId,
          score,
          outOf,
          level,
          note: (gNote || "").trim() || undefined,
        },
      ]);
      try {
        (await import("@/lib/fetcher")).invalidateCacheByPrefix(
          `/api/courses/${courseId}/exams/${exam.id}/results`
        );
      } catch {}
      showSuccess("시험 성적을 추가했습니다.");
      await reloadExamGrades();
      initGradeForm();
      setGradeOpen(false);
    } catch (e) {
      setGErr(readableError(e, "시험 성적을 추가하지 못했습니다."));
    } finally {
      setGradeBusy(false);
    }
  }

  async function handleCounselExport() {
    if (!numericId) return;
    setExportingCounsel(true);
    try {
      const blob = await downloadCounselsExcel({ studentId: numericId });
      const studentName = student?.name || `student_${numericId}`;
      const filename = sanitizeFilename(`${studentName}_counsels`);
      saveBlobAsFile(blob, `${filename}.xlsx`);
    } catch (e) {
      showError(readableError(e, "상담 기록 엑셀 추출에 실패했습니다."));
    } finally {
      setExportingCounsel(false);
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

  useEffect(() => {
    if (!addingCounsel) return;
    const handle = requestAnimationFrame(() => {
      const el = newCounselContentRef.current;
      if (el) {
        el.focus();
        const len = el.value.length;
        try {
          el.setSelectionRange(len, len);
        } catch {
          /* ignore unsupported browsers */
        }
      }
    });
    return () => cancelAnimationFrame(handle);
  }, [addingCounsel]);

  // Load attendance when tab is active
  useEffect(() => {
    if (!numericId || activeTab !== "attendance") return;
    let cancelled = false;
    async function load() {
      setAttLoading(true);
      setAttError(null);
      try {
        const res = await getStudentAttendance(numericId, { size: 200 });
        if (!cancelled) setAttRows(res?.content || []);
      } catch (e) {
        if (!cancelled)
          setAttError(readableError(e, "출석 정보를 불러오지 못했습니다."));
      } finally {
        if (!cancelled) setAttLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [numericId, activeTab]);

  // 결제 내역 로딩 제거 (MVP)

  function saveNotes() {
    if (!numericId) return;
    const text = (notesInput || "").trim();
    setNotes(text);
    setEditingNotes(false);
    try {
      localStorage.setItem(`student:notes:${numericId}`, text);
    } catch {}
  }

  function persistMemos(next: MemoItem[]) {
    setMemos(next);
    try {
      localStorage.setItem(`student:memos:${numericId}`, JSON.stringify(next));
    } catch {}
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
    const found = memos.find((m) => m.id === id);
    if (!found) return;
    setEditingMemoId(id);
    setEditingMemoText(found.text);
  }

  function saveEditMemo() {
    if (editingMemoId == null) return;
    const text = (editingMemoText || "").trim();
    const now = new Date().toISOString();
    const next = memos.map((m) =>
      m.id === editingMemoId ? { ...m, text, updatedAt: now } : m
    );
    persistMemos(next);
    setEditingMemoId(null);
    setEditingMemoText("");
  }

  function cancelEditMemo() {
    setEditingMemoId(null);
    setEditingMemoText("");
  }

  function removeMemo(id: number) {
    const next = memos.filter((m) => m.id !== id);
    persistMemos(next);
  }

  async function requestDeleteGrade(entry: GradeEntry) {
    if (!numericId) return;
    const subject = entry.subject?.trim();
    const label = [entry.date, subject].filter(Boolean).join(" · ");
    const confirmed = await confirmDelete({
      title: "성적을 삭제할까요?",
      message: label
        ? `${label} 기록을 삭제합니다. 되돌릴 수 없습니다.`
        : "선택한 성적 기록을 삭제합니다. 되돌릴 수 없습니다.",
    });
    if (!confirmed) return;
    removeStudentGrade(numericId, entry.id);
    setGrades(getStudentGrades(numericId));
  }

  async function requestDeleteMemo(id: number) {
    const confirmed = await confirmDelete({
      title: "메모를 삭제할까요?",
      message: "삭제한 메모는 복구할 수 없습니다.",
    });
    if (!confirmed) return;
    removeMemo(id);
  }

  async function requestDeleteStudent() {
    if (!numericId) return;
    const targetName = student?.name?.trim();
    const confirmed = await confirmDelete({
      title: "원생을 삭제할까요?",
      message: targetName
        ? `'${targetName}' 원생의 데이터를 삭제합니다. 되돌릴 수 없습니다.`
        : "선택한 원생의 데이터를 삭제합니다. 되돌릴 수 없습니다.",
    });
    if (!confirmed) return;
    setDeleting(true);
    try {
      await deleteStudent(numericId);
      showSuccess("원생을 삭제했습니다.");
      navigate("/students");
    } catch (e) {
      showError(readableError(e, "원생 삭제에 실패했습니다."));
    } finally {
      setDeleting(false);
    }
  }

  const hours24 = useMemo(
    () => Array.from({ length: 24 }, (_, h) => String(h).padStart(2, "0")),
    []
  );
  const mins5 = useMemo(
    () => [
      "00",
      "05",
      "10",
      "15",
      "20",
      "25",
      "30",
      "35",
      "40",
      "45",
      "50",
      "55",
    ],
    []
  );

  function openAddCounselModal() {
    setAddingCounsel(true);
    setCounselError(null);
    setNewDate(() => {
      const d = new Date();
      return `${d.getFullYear()}-${two(d.getMonth() + 1)}-${two(d.getDate())}`;
    });
    setNewHour("");
    setNewMin("");
    setNewContent("");
  }

  function closeAddCounselModal() {
    setAddingCounsel(false);
    setNewHour("");
    setNewMin("");
    setNewContent("");
    setCounselError(null);
  }

  async function onSubmitNewCounsel() {
    if (!numericId || !newDate || !newHour || !newMin) return;
    setNewSubmitting(true);
    setCounselError(null);
    try {
      const iso = `${newDate}T${newHour}:${newMin}:00`;
      await createCounsel({
        studentId: numericId,
        counselTime: iso,
        content: newContent || undefined,
      });
      const res = await listCounsels({ studentId: numericId, size: 100 });
      setCounsels(res.content || []);
      closeAddCounselModal();
    } catch (e) {
      setCounselError(readableError(e, "저장에 실패했습니다."));
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
      await updateCounsel(id, {
        counselTime: iso,
        content: editContent || undefined,
      });
      const res = await listCounsels({ studentId: numericId, size: 100 });
      setCounsels(res.content || []);
      setEditingCounselId(null);
      setEditDate("");
      setEditHour("");
      setEditMin("");
      setEditContent("");
    } catch (e) {
      setCounselError(readableError(e, "수정에 실패했습니다."));
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
      {/* Breadcrumb removed per request */}
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
            <Card>
              <MiniHead>
                <Tabs>
                  <TabButton data-active>
                    {/* active visual only */}수강수업 <Badge>0</Badge>
                  </TabButton>
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
                  <UIGhostLink
                    to={`/students/${numericId}/edit`}
                    data-variant="edit"
                  >
                    수정
                  </UIGhostLink>
                  <UIGhostButton
                    data-variant="danger"
                    disabled={deleting}
                    onClick={() => void requestDeleteStudent()}
                  >
                    {deleting ? "삭제 중..." : "삭제"}
                  </UIGhostButton>
                </CardActions>
              </CardHead>
              {student ? (
                <>
                  <InfoList>
                    <Row>
                      <Avatar>{student.name.slice(0, 1)}</Avatar>
                      <div>
                        <Name>{student.name}</Name>
                        <SmallMuted>
                          코드 {student.code} · ID {student.id}
                        </SmallMuted>
                      </div>
                      <StatusChip data-type={student.status}>
                        {student.status === "ENROLLED"
                          ? "수강중"
                          : student.status === "ON_LEAVE"
                          ? "휴학"
                          : "대기중"}
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
                      <Value>
                        {student.joinedDate ||
                          student.createdAt?.slice(0, 10) ||
                          "-"}
                      </Value>
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
                      <ModalBtn
                        type="button"
                        onClick={() => {
                          setEditingNotes(false);
                          setNotesInput(notes);
                        }}
                      >
                        취소
                      </ModalBtn>
                      <UIPrimaryButton type="button" onClick={saveNotes}>
                        저장
                      </UIPrimaryButton>
                    </>
                  ) : notes ? (
                    <UIGhostButton
                      type="button"
                      onClick={() => setEditingNotes(true)}
                    >
                      편집
                    </UIGhostButton>
                  ) : (
                    <UIPrimaryButtonSm
                      type="button"
                      onClick={() => setEditingNotes(true)}
                    >
                      메모 추가
                    </UIPrimaryButtonSm>
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
                  <UIPrimaryButtonSm type="button" onClick={addMemo}>
                    추가
                  </UIPrimaryButtonSm>
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
                {memos.map((m) => (
                  <MemoItemBox key={m.id}>
                    <MemoHeader>
                      <MemoDate>
                        {formatDate(m.updatedAt || m.createdAt)}
                        {m.updatedAt ? (
                          <span style={{ marginLeft: 6, color: "#6b7280" }}>
                            (수정됨)
                          </span>
                        ) : null}
                      </MemoDate>
                      <MemoActions>
                        {editingMemoId === m.id ? (
                          <>
                            <ModalBtn type="button" onClick={cancelEditMemo}>
                              취소
                            </ModalBtn>
                            <UIPrimaryButton
                              type="button"
                              onClick={saveEditMemo}
                            >
                              저장
                            </UIPrimaryButton>
                          </>
                        ) : (
                          <>
                            <ModalBtn
                              type="button"
                              onClick={() => beginEditMemo(m.id)}
                            >
                              편집
                            </ModalBtn>
                            <ModalBtn
                              type="button"
                              data-variant="danger"
                              onClick={() => void requestDeleteMemo(m.id)}
                            >
                              삭제
                            </ModalBtn>
                          </>
                        )}
                      </MemoActions>
                    </MemoHeader>
                    {editingMemoId === m.id ? (
                      <MemoTextarea
                        rows={4}
                        value={editingMemoText}
                        onChange={(e) => setEditingMemoText(e.target.value)}
                      />
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
                  <TabButton
                    data-active={activeTab === "courses"}
                    onClick={() => navigate(`/students/${numericId}/courses`)}
                  >
                    수강수업 <Badge>{student?.courses?.length ?? 0}</Badge>
                  </TabButton>
                  <TabButton
                    data-active={activeTab === "attendance"}
                    onClick={() =>
                      navigate(`/students/${numericId}/attendance`)
                    }
                  >
                    출석현황
                  </TabButton>
                  {/* 결제 탭 제거 (MVP) */}
                  <TabButton
                    data-active={activeTab === "grades"}
                    onClick={() => navigate(`/students/${numericId}/grades`)}
                  >
                    성적
                  </TabButton>
                  <TabButton
                    data-active={activeTab === "counsels"}
                    onClick={() => navigate(`/students/${numericId}/counsels`)}
                  >
                    상담기록
                  </TabButton>
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
                            <ModalBtn
                              type="button"
                              onClick={() => navigate(`/classes/${c.id}`)}
                            >
                              상세
                            </ModalBtn>
                          </CourseHeader>
                          <CourseMeta>
                            <code>{c.code}</code>
                            <CourseStatus data-type={c.status}>
                              {courseStatusLabel(c.status)}
                            </CourseStatus>
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
                          <tr>
                            <td colSpan={4}>
                              <Muted>출석 기록이 없습니다.</Muted>
                            </td>
                          </tr>
                        ) : (
                          attRows.map((r, i) => (
                            <tr key={i}>
                              <td>{r.date}</td>
                              <td>{r.courseTitle}</td>
                              <td>{r.present ? "출석" : "결석"}</td>
                              <td>{r.reason || "-"}</td>
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
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  ></div>
                  {examGradesError && <Error>{examGradesError}</Error>}
                  {examGradesLoading && (
                    <Muted>시험 성적을 불러오는 중...</Muted>
                  )}
                  {displayGrades.length === 0 ? (
                    <Empty>등록된 성적이 없습니다.</Empty>
                  ) : (
                    <UITable style={{ minWidth: 720 }}>
                      <thead>
                        <tr>
                          <th>시험/과목</th>
                          <th>수업</th>
                          <th>일자</th>
                          <th>성적</th>
                        </tr>
                      </thead>
                      <tbody>
                        {displayGrades.map((g: any) => {
                          const courseTitle =
                            (student?.courses || []).find(
                              (c) => c.id === g.courseId
                            )?.title || "-";
                          const scoreText = g.level
                            ? g.level
                            : g.score != null
                            ? `${g.score}${
                                g.outOf != null ? `/${g.outOf}` : ""
                              }`
                            : "-";
                          return (
                            <tr key={g.id}>
                              <td>
                                <div style={{ display: "grid" }}>
                                  <strong>{g.subject || "성적"}</strong>
                                  {g.note && (
                                    <SmallMuted
                                      style={{
                                        maxWidth: 420,
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                      }}
                                    >
                                      {g.note}
                                    </SmallMuted>
                                  )}
                                </div>
                              </td>
                              <td>{courseTitle}</td>
                              <td>{g.date}</td>
                              <td>{scoreText}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </UITable>
                  )}
                </SectionBody>
              )}
              {/* 결제 탭 본문 제거 (MVP) */}

              {activeTab === "counsels" && (
                <SectionBody>
                  <CounselHeader>
                    <div>
                      <SmallTitle>상담기록</SmallTitle>
                    </div>
                    <div
                      style={{
                        display: "inline-flex",
                        gap: 8,
                        alignItems: "center",
                      }}
                    >
                      <ModalBtn
                        type="button"
                        onClick={handleCounselExport}
                        disabled={exportingCounsel}
                      >
                        {exportingCounsel ? "엑셀 준비 중..." : "엑셀 추출"}
                      </ModalBtn>
                      <UIPrimaryButtonSm
                        type="button"
                        onClick={openAddCounselModal}
                        disabled={addingCounsel}
                      >
                        상담 추가
                      </UIPrimaryButtonSm>
                    </div>
                  </CounselHeader>
                  {counselError && !addingCounsel && <Error>{counselError}</Error>}
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
                                    <ModalBtn
                                      type="button"
                                      onClick={() => {
                                        setEditingCounselId(c.id);
                                        try {
                                          const d = new Date(c.counselTime);
                                          setEditDate(
                                            `${d.getFullYear()}-${two(
                                              d.getMonth() + 1
                                            )}-${two(d.getDate())}`
                                          );
                                          setEditHour(two(d.getHours()));
                                          setEditMin(two(d.getMinutes()));
                                        } catch {
                                          setEditDate("");
                                          setEditHour("");
                                          setEditMin("");
                                        }
                                        setEditContent(c.content || "");
                                      }}
                                    >
                                      편집
                                    </ModalBtn>
                                    <ModalBtn
                                      type="button"
                                      data-variant="danger"
                                      onClick={() => setConfirmCounselId(c.id)}
                                    >
                                      삭제
                                    </ModalBtn>
                                  </RowActions>
                                </CounselRow>
                                <CounselContent>
                                  {(c.content || "").trim() || "내용 없음"}
                                </CounselContent>
                              </>
                            ) : (
                              <>
                                <EditGrid>
                                  <Field>
                                    <Label>상담 일자</Label>
                                    <Input
                                      type="date"
                                      lang="ko-KR"
                                      value={editDate}
                                      onChange={(e) =>
                                        setEditDate(e.target.value)
                                      }
                                    />
                                  </Field>
                                  <Field>
                                    <Label>시간</Label>
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 8,
                                      }}
                                    >
                                      <div style={{ flex: 1 }}>
                                        <SelectBox
                                          ariaLabel="시"
                                          value={editHour}
                                          onChange={setEditHour}
                                          placeholder="시"
                                          options={hours24.map((h) => ({
                                            label: h,
                                            value: h,
                                          }))}
                                        />
                                      </div>
                                      <span>:</span>
                                      <div style={{ flex: 1 }}>
                                        <SelectBox
                                          ariaLabel="분"
                                          value={editMin}
                                          onChange={setEditMin}
                                          placeholder="분"
                                          options={mins5.map((m) => ({
                                            label: m,
                                            value: m,
                                          }))}
                                        />
                                      </div>
                                    </div>
                                  </Field>
                                  <Field style={{ gridColumn: "1 / -1" }}>
                                    <Label>내용</Label>
                                    <TextArea
                                      rows={4}
                                      value={editContent}
                                      onChange={(e) =>
                                        setEditContent(e.target.value)
                                      }
                                    />
                                  </Field>
                                </EditGrid>
                                <RowActions>
                                  <ModalBtn
                                    type="button"
                                    onClick={() => {
                                      setEditingCounselId(null);
                                      setEditDate("");
                                      setEditHour("");
                                      setEditMin("");
                                      setEditContent("");
                                    }}
                                  >
                                    취소
                                  </ModalBtn>
                                  <UIPrimaryButton
                                    type="button"
                                    disabled={
                                      savingEdit ||
                                      !editDate ||
                                      !editHour ||
                                      !editMin
                                    }
                                    onClick={() => onSaveEdit(c.id)}
                                  >
                                    저장
                                  </UIPrimaryButton>
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

      {deleteConfirmDialog}
      <Modal
        open={addingCounsel}
        title="상담 추가"
        onClose={() => {
          if (newSubmitting) return;
          closeAddCounselModal();
        }}
        initialFocusRef={newCounselContentRef}
        footer={
          <>
            <UIGhostButton
              type="button"
              onClick={closeAddCounselModal}
              disabled={newSubmitting}
            >
              취소
            </UIGhostButton>
            <UIPrimaryButton
              type="button"
              onClick={onSubmitNewCounsel}
              disabled={newSubmitting || !newDate || !newHour || !newMin}
            >
              {newSubmitting ? "저장 중..." : "저장"}
            </UIPrimaryButton>
          </>
        }
      >
        <ModalForm>
          <ModalField>
            <Label style={{ alignSelf: "auto" }}>상담 일자</Label>
            <Input
              type="date"
              lang="ko-KR"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
            />
          </ModalField>
          <ModalField>
            <Label style={{ alignSelf: "auto" }}>시간</Label>
          <TimeRow>
            <TimeSelect>
              <SelectBox
                ariaLabel="시"
                value={newHour}
                onChange={setNewHour}
                placeholder="시"
                options={hours24.map((h) => ({
                  label: h,
                  value: h,
                }))}
              />
            </TimeSelect>
            <span>:</span>
            <TimeSelect>
              <SelectBox
                ariaLabel="분"
                value={newMin}
                onChange={setNewMin}
                placeholder="분"
                options={mins5.map((m) => ({
                  label: m,
                  value: m,
                }))}
              />
            </TimeSelect>
          </TimeRow>
          </ModalField>
          <ModalField>
            <Label style={{ alignSelf: "auto" }}>내용</Label>
            <TextArea
              ref={newCounselContentRef}
              rows={4}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="상담 내용 또는 메모"
              autoFocus
            />
          </ModalField>
          {addingCounsel && counselError && (
            <Error role="alert">{counselError}</Error>
          )}
        </ModalForm>
      </Modal>
      <ConfirmDialog
        open={confirmCounselId != null}
        title="상담 일정 삭제"
        message="이 상담 일정을 삭제하시겠어요? 되돌릴 수 없습니다."
        confirmLabel="삭제"
        cancelLabel="취소"
        tone="danger"
        busy={confirmCounselBusy}
        onCancel={() => {
          if (!confirmCounselBusy) setConfirmCounselId(null);
        }}
        onConfirm={async () => {
          if (!numericId || confirmCounselId == null) return;
          setConfirmCounselBusy(true);
          try {
            await deleteCounsel(confirmCounselId);
            const res = await listCounsels({ studentId: numericId, size: 100 });
            setCounsels(res.content || []);
            setConfirmCounselId(null);
          } catch (e: any) {
            showError(e?.message || "삭제에 실패했습니다.");
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
  display: grid;
  gap: 14px;
`;
const TopBar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  h2 {
    margin: 0;
    font-size: 20px;
    color: #0f172a;
  }
`;
// Breadcrumb removed
// Back button unified via shared component
const Columns = styled.div`
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 14px;
  align-items: start;
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;
const Left = styled.aside`
  display: grid;
  gap: 18px;
`;
const Right = styled.section``;

// Cards/blocks
const Card = styled.section`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 16px;
  min-width: 0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
`;
const SectionTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  color: #0f172a;
`;
const CardHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;
const CardActions = styled.div`
  display: inline-flex;
  gap: 12px;
`;
const Divider = styled.div`
  height: 1px;
  background: #e5e7eb;
  margin: 6px 0 10px;
`;
const InfoList = styled.div`
  display: grid;
  gap: 14px;
`;
const Row = styled.div`
  display: grid;
  grid-template-columns: 44px 1fr auto;
  gap: 12px;
  align-items: center;
  margin-bottom: 6px;
`;
const Avatar = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #eef2ff;
  color: #4f46e5;
  display: grid;
  place-items: center;
  font-weight: 800;
`;
const Name = styled.div`
  font-size: 19px;
  font-weight: 900;
  color: #0f172a;
  letter-spacing: -0.01em;
`;
const SmallMuted = styled.div`
  color: #6b7280;
  font-size: 12px;
`;
const StatusChip = styled.span`
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 800;
  &[data-type="ENROLLED"] {
    background: #dcfce7;
    color: #16a34a;
  }
  &[data-type="ON_LEAVE"] {
    background: #fef3c7;
    color: #b45309;
  }
  &[data-type="PENDING"] {
    background: #f3e8ff;
    color: #7c3aed;
  }
`;
const Field = styled.div`
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 8px;
`;
const Label = styled.div`
  color: #6b7280;
  font-size: 13px;
  align-self: center;
`;
const Value = styled.div`
  color: #111827;
  font-size: 15px;
`;
const Muted = styled.div`
  color: #6b7280;
  font-size: 13px;
`;
// Hint removed (unused)
const Error = styled.div`
  color: #b91c1c;
  font-size: 12px;
  font-weight: 700;
`;

// Right side mini header and content
const MiniHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 5;
  padding-top: 2px;
`;
const Tabs = styled.div`
  display: inline-flex;
  gap: 6px;
  flex-wrap: wrap;
`;
const TabButton = styled(UISmallBtn)`
  height: 40px;
  padding: 0 16px;
  font-size: 14px;
  /* inactive: black text, white background, gray border (from UISmallBtn) */
  &[data-active="true"] {
    background: #f3f4f6; /* gray background */
    color: #111827; /* black text */
    border-color: #e5e7eb; /* gray border */
  }
`;
const Badge = styled.span`
  min-width: 18px;
  height: 18px;
  padding: 0 6px;
  border-radius: 9999px;
  background: #e5e7eb;
  color: #374151;
  font-weight: 800;
  font-size: 11px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const SectionBody = styled.div`
  display: grid;
  gap: 10px;
`;
const CourseList = styled.div`
  display: grid;
  gap: 8px;
`;
const CourseItem = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px 12px;
  display: grid;
  gap: 6px;
  background: #fff;
`;
const CourseHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;
const CourseTitle = styled.div`
  font-weight: 800;
  color: #0f172a;
  font-size: 14px;
`;
const CourseMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #6b7280;
  font-size: 12px;
  code {
    background: #f3f4f6;
    padding: 2px 6px;
    border-radius: 6px;
  }
`;
const CourseStatus = styled.span`
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 800;
  &[data-type="IN_PROGRESS"] {
    background: #dcfce7;
    color: #16a34a;
  }
  &[data-type="PENDING"] {
    background: #f3e8ff;
    color: #7c3aed;
  }
  &[data-type="STOPPED"] {
    background: #e5e7eb;
    color: #374151;
  }
`;

const Subgrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
`;
const SmallCard = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px 12px;
  background: #fff;
`;
const SmallTitle = styled.div`
  color: #6b7280;
  font-size: 12px;
`;
const KPI = styled.div`
  font-size: 22px;
  font-weight: 900;
  color: #0f172a;
  margin-top: 4px;
`;

// Table from common UI

const List = styled.div`
  display: grid;
  gap: 8px;
`;
const ListItem = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px 12px;
  background: #fff;
  display: grid;
  gap: 4px;
  strong {
    color: #0f172a;
  }
`;
const Empty = styled.div`
  color: #6b7280;
  font-size: 13px;
  text-align: center;
  border: 1px dashed #e5e7eb;
  border-radius: 10px;
  padding: 16px;
  background: #fafafa;
`;

// Risk styles
const RiskRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;
const RiskPill = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 9999px;
  font-weight: 800;
  font-size: 12px;
  color: #0f172a;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  &[data-level="CAUTION"] {
    background: #fef3c7;
    color: #b45309;
    border-color: #fcd34d;
  }
  &[data-level="RISK"] {
    background: #fee2e2;
    color: #b91c1c;
    border-color: #fecaca;
  }
  &[data-level="LOW"] {
    background: #dcfce7;
    color: #15803d;
    border-color: #bbf7d0;
  }
`;
const RiskMetrics = styled.div`
  color: #475569;
  font-size: 12px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;
const Dot = styled.i`
  width: 4px;
  height: 4px;
  background: #cbd5e1;
  display: inline-block;
  border-radius: 50%;
`;
const ReasonList = styled.ul`
  margin: 10px 0 0;
  padding-left: 18px;
  color: #334155;
  font-size: 13px;
`;
const RecList = styled.ul`
  margin: 10px 0;
  padding-left: 18px;
  color: #111827;
  font-size: 13px;
`;
const ActionRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

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
  margin: 0;
  white-space: pre-line;
  color: #111827;
  font-size: 15px;
  line-height: 1.7;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 12px 14px;
  text-wrap: pretty;
`;
const NotesTextarea = styled.textarea`
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px 12px;
  resize: vertical;
  font-size: 14px;
  color: #111827;
  min-height: 120px;
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
  }
`;

// Memo list styles
const MemoNew = styled.div`
  display: grid;
  gap: 8px;
`;
const MemoList = styled.div`
  display: grid;
  gap: 8px;
`;
const MemoItemBox = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px 12px;
  background: #fff;
  display: grid;
  gap: 6px;
`;
const MemoHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;
const MemoDate = styled.div`
  color: #6b7280;
  font-size: 12px;
`;
const MemoActions = styled.div`
  display: inline-flex;
  gap: 6px;
`;
const MemoTextarea = styled.textarea`
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 8px 10px;
  resize: vertical;
  font-size: 14px;
  color: #111827;
`;
const MemoText = styled.pre`
  margin: 0;
  white-space: pre-wrap;
  color: #111827;
  font-size: 14px;
`;

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
  display: grid;
  grid-template-columns: 44px 1fr 80px;
  gap: 10px;
  align-items: center;
  margin-bottom: 8px;
`;
const SkeletonChip = styled(SkeletonBase).attrs({ w: 80, h: 24 })``;
const SkField = styled(SkeletonBase).attrs({ h: 16, mt: 10 })``;

// Arrow icon resides in BackButton

function saveBlobAsFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function sanitizeFilename(raw: string) {
  const base = raw ? raw.trim() : "export";
  const cleaned = base.replace(/[\\/:*?"<>|]+/g, "_");
  return cleaned.length ? cleaned : "export";
}

function two(n: number) {
  return String(n).padStart(2, "0");
}
function formatDate(iso: string) {
  return formatKoreanDateTime(iso, { includeWeekday: true });
}

// Attendance helpers
function formatMonthRate(rows: StudentAttendance[]): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  const monthRows = rows.filter((r) => {
    const [yy, mm] = r.date.split("-").map(Number);
    return yy === y && mm === m;
  });
  if (monthRows.length === 0) return "—";
  const present = monthRows.filter((r) => r.present).length;
  const rate = Math.round((present / monthRows.length) * 100);
  return `${rate}%`;
}
function formatMonthCounts(rows: StudentAttendance[]): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  const monthRows = rows.filter((r) => {
    const [yy, mm] = r.date.split("-").map(Number);
    return yy === y && mm === m;
  });
  if (monthRows.length === 0) return "—";
  const present = monthRows.filter((r) => r.present).length;
  return `${present}/${monthRows.length}회 출석`;
}
function formatRecentAbsents(rows: StudentAttendance[]): string {
  const abs = rows
    .filter((r) => !r.present)
    .slice(0, 2)
    .map((r) => r.date);
  if (abs.length === 0) return "없음";
  return abs.join(", ");
}

// Counsel helpers
function formatKDateTime(iso: string) {
  try {
    const d = new Date(iso);
    const yoil = ["일", "월", "화", "수", "목", "금", "토"][d.getDay()];
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const da = d.getDate();
    const hh = two(d.getHours());
    const mi = two(d.getMinutes());
    return `${y}년 ${m}월 ${da}일 (${yoil}) ${hh}:${mi}`;
  } catch {
    return iso;
  }
}
function nowLocalInput() {
  const d = new Date();
  const y = d.getFullYear();
  const m = two(d.getMonth() + 1);
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
    const m = two(d.getMonth() + 1);
    const da = two(d.getDate());
    const hh = two(d.getHours());
    const mi = two(d.getMinutes());
    return `${y}-${m}-${da}T${hh}:${mi}`;
  } catch {
    return "";
  }
}

// Styles for counsel section
const CounselHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;
const ModalForm = styled.div`
  display: grid;
  gap: 14px;
`;
const ModalField = styled.div`
  display: grid;
  gap: 6px;
`;
const TimeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
const TimeSelect = styled.div`
  flex: 1;
  min-width: 0;
`;
const Input = styled.input`
  height: 36px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 10px;
  font-size: 14px;
`;
const TextArea = styled.textarea`
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 8px 10px;
  font-size: 14px;
  resize: vertical;
`;
const CounselRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;
const RowActions = styled.div`
  display: inline-flex;
  gap: 12px;
`;
const When = styled.div`
  font-weight: 900;
  color: #0f172a;
`;
const CounselContent = styled.pre`
  margin: 4px 0 0;
  white-space: pre-wrap;
  color: #111827;
  font-size: 14px;
`;
const EditGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

// moved onSaveEdit into component scope above
