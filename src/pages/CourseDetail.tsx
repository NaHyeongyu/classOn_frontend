// 수업 상세 페이지: 수업 기본 정보, 재원생, 시험, 수업 기록 요약을 보여줍니다.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import {
  SectionCard as Section,
  TitleH3 as Title,
  GhostBtn as UIGhostBtn,
  GhostBtnSmall as UIGhostBtnSmall,
  buttonVariants,
  GhostButton as UIGhostButton,
} from "@/components/common/UI";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import {
  getCourse,
  type Course,
  type CourseRecord,
  listCourseStudents,
  listCourseRecords,
  listRecordAttendance,
  deleteCourse,
  downloadCourseRecordsExcel,
} from "@/api/courses";
import { formatMoney } from "@/lib/format";
import { listStudents, type Student } from "@/api/students";
import {
  KPI,
  UsersIcon,
  ClassIcon,
  CheckIcon,
} from "@/components/dashboard/KPI";
import { useToast } from "@/components/common/Toast";
import CourseExamsPanel from "@/components/courses/CourseExamsPanel";
import CourseStudentsPanel from "@/components/courses/CourseStudentsPanel";
import CourseRecordsPanel from "@/components/courses/CourseRecordsPanel";
import {
  listExams,
  createExam,
  updateExam,
  deleteExam,
  type Exam,
} from "@/api/exams";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function endOfMonthDay(y: number, m1: number) {
  return new Date(y, m1, 0).getDate();
}

function buildFilterRange(
  year: number | null,
  month: number
): { from?: string; to?: string } {
  if (year == null) return {};
  let from = `${year}-01-01`;
  let to = `${year}-12-31`;
  if (month >= 1) {
    const end = endOfMonthDay(year, month);
    from = `${year}-${pad2(month)}-01`;
    to = `${year}-${pad2(month)}-${pad2(end)}`;
  }
  return { from, to };
}

export default function CourseDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const numericId = useMemo(() => (id ? Number(id) : null), [id]);
  const { error: showError, success } = useToast();
  const { confirm: confirmDanger, dialog: confirmDangerDialog } =
    useConfirmDialog({
      confirmLabel: "삭제",
      cancelLabel: "취소",
      tone: "danger",
    });
  // info/students를 하나의 관리 화면으로 통합 (탭 상태 제거)

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [students, setStudents] = useState<Student[]>([]);
  const [stuLoading, setStuLoading] = useState(false);
  const [stuError, setStuError] = useState<string | null>(null);
  const [records, setRecords] = useState<CourseRecord[]>([]);
  const [exportingRecords, setExportingRecords] = useState(false);
  const [exams, setExams] = useState<Exam[]>([]);
  const [examLoading, setExamLoading] = useState(false);
  const [examError, setExamError] = useState<string | null>(null);
  const [examModalOpen, setExamModalOpen] = useState(false);
  const [examMode, setExamMode] = useState<"percent" | "letter">("percent");
  const [examSaving, setExamSaving] = useState(false);
  const [examFormError, setExamFormError] = useState<string | null>(null);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [examModalMode, setExamModalMode] = useState<"create" | "edit">(
    "create"
  );
  const examTitleRef = useRef<HTMLInputElement | null>(null);
  const examTitleValueRef = useRef("");
  // History filter state
  const [filterYear, setFilterYear] = useState<number | null>(null);
  // 0 = 전체, 1..12 = 월
  const [filterMonth, setFilterMonth] = useState<number>(
    new Date().getMonth() + 1
  );
  // removed: bulk generation state (replaced with manual create flow)
  // Danger confirm for deleting this course (template)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [confirmBusy, setConfirmBusy] = useState(false);
  const [attByRec, setAttByRec] = useState<
    Record<number, Record<number, boolean>>
  >({});
  useEffect(() => {
    if (!numericId) return;
    const matchesFilter = (recordDate: string) => {
      if (filterYear == null) return true;
      const year = Number(recordDate.slice(0, 4));
      if (!Number.isFinite(year) || year !== filterYear) return false;
      if (filterMonth && filterMonth >= 1) {
        const month = Number(recordDate.slice(5, 7));
        return Number.isFinite(month) && month === filterMonth;
      }
      return true;
    };
    const sortRecords = (items: CourseRecord[]) =>
      items.slice().sort((a, b) => {
        const byDate = a.recordDate.localeCompare(b.recordDate);
        if (byDate !== 0) return byDate;
        const startA = a.startTime ?? "";
        const startB = b.startTime ?? "";
        return startA.localeCompare(startB);
      });

    function onCreated(event: CustomEvent<{ courseId: number; record: CourseRecord }>) {
      const detail = event.detail;
      if (!detail || detail.courseId !== numericId) return;
      const { record } = detail;
      if (!record || !matchesFilter(record.recordDate)) return;
      setRecords((prev) => sortRecords([...prev.filter((r) => r.id !== record.id), record]));
    }

    function onUpdated(event: CustomEvent<{ courseId: number; record: CourseRecord }>) {
      const detail = event.detail;
      if (!detail || detail.courseId !== numericId) return;
      const { record } = detail;
      if (!record) return;
      setRecords((prev) => {
        const exists = prev.some((r) => r.id === record.id);
        if (!matchesFilter(record.recordDate)) {
          return exists ? prev.filter((r) => r.id !== record.id) : prev;
        }
        const next = exists
          ? prev.map((r) => (r.id === record.id ? record : r))
          : [...prev, record];
        return sortRecords(next);
      });
    }

    function onDeleted(event: CustomEvent<{ courseId: number; recordId: number }>) {
      const detail = event.detail;
      if (!detail || detail.courseId !== numericId) return;
      setRecords((prev) => prev.filter((r) => r.id !== detail.recordId));
      setAttByRec((prev) => {
        if (prev == null || !(detail.recordId in prev)) return prev;
        const next = { ...prev };
        delete next[detail.recordId];
        return next;
      });
    }

    window.addEventListener("course-record:created", onCreated as EventListener);
    window.addEventListener("course-record:updated", onUpdated as EventListener);
    window.addEventListener("course-record:deleted", onDeleted as EventListener);
    return () => {
      window.removeEventListener("course-record:created", onCreated as EventListener);
      window.removeEventListener("course-record:updated", onUpdated as EventListener);
      window.removeEventListener("course-record:deleted", onDeleted as EventListener);
    };
  }, [numericId, filterYear, filterMonth, showError]);
  function readableError(e: unknown, fallback: string) {
    if (typeof e === "string") return e;
    if (
      e &&
      typeof e === "object" &&
      "message" in e &&
      typeof (e as { message?: unknown }).message === "string"
    ) {
      return (e as { message?: string }).message || fallback;
    }
    return fallback;
  }

  useEffect(() => {
    if (!numericId) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const c = await getCourse(numericId!);
        if (!cancelled) setCourse(c);
      } catch (e) {
        if (!cancelled)
          setError(readableError(e, "수업 정보를 불러오지 못했습니다."));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [numericId]);

  const refreshExams = useCallback(async () => {
    if (!numericId) return;
    setExamLoading(true);
    setExamError(null);
    try {
      const list = await listExams(numericId);
      setExams(list);
    } catch (e) {
      setExamError(readableError(e, "시험 목록을 불러오지 못했습니다."));
    } finally {
      setExamLoading(false);
    }
  }, [numericId]);

  useEffect(() => {
    void refreshExams();
  }, [refreshExams]);

  // removed: generateNext14Days (replaced by create single record via detail page)
  function courseTypeLabel(type?: Course["courseType"]) {
    switch (type) {
      case "INDIVIDUAL":
        return "개인 수업";
      case "GROUP":
        return "단체 수업";
      default:
        return "단체 수업";
    }
  }

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
      try {
        const range = buildFilterRange(filterYear, filterMonth);
        const list = await listCourseRecords(numericId!, range);
        if (!cancelled) setRecords(list);
      } catch (e) {
        if (cancelled) return;
        const msg = readableError(e, "");
        if (msg.includes("404")) setRecords([]);
        else showError(msg || "수업 내역을 불러오지 못했습니다.");
      }
    }
    void loadByFilter();
    return () => {
      cancelled = true;
    };
  }, [numericId, filterYear, filterMonth, showError]);

  async function handleExportRecords() {
    if (!numericId) return;
    setExportingRecords(true);
    try {
      const range = buildFilterRange(filterYear, filterMonth);
      const blob = await downloadCourseRecordsExcel(numericId, range);
      const baseTitle = course?.title || `course_${numericId}`;
      const dateLabel =
        range.from && range.to
          ? `${range.from}_${range.to}`
          : new Date().toISOString().slice(0, 10);
      const filename = sanitizeFilename(`${baseTitle}_${dateLabel}_records`);
      saveBlobAsFile(blob, `${filename}.xlsx`);
    } catch (e) {
      showError(readableError(e, "수업 내역 엑셀 추출에 실패했습니다."));
    } finally {
      setExportingRecords(false);
    }
  }

  async function handleSubmitExam() {
    if (!numericId || examSaving) return;
    const title = examTitleValueRef.current.trim();
    if (!title) {
      setExamFormError("시험 제목을 입력해주세요.");
      examTitleRef.current?.focus();
      return;
    }
    setExamFormError(null);
    setExamSaving(true);
    try {
      if (examModalMode === "edit" && editingExam) {
        await updateExam(numericId, editingExam.id, {
          title,
          inputMode: examMode,
        });
        success("시험이 수정되었습니다.");
      } else {
        await createExam(numericId, {
          title,
          inputMode: examMode,
          kind: "TEST",
        });
        success("시험이 생성되었습니다.");
      }
      await refreshExams();
      closeExamModal();
    } catch (e) {
      showError(
        readableError(
          e,
          examModalMode === "edit"
            ? "시험 수정에 실패했습니다."
            : "시험 생성에 실패했습니다."
        )
      );
    } finally {
      setExamSaving(false);
    }
  }

  function openExamModal() {
    setExamError(null);
    setExamFormError(null);
    examTitleValueRef.current = "";
    if (examTitleRef.current) examTitleRef.current.value = "";
    setExamMode("percent");
    setExamModalMode("create");
    setEditingExam(null);
    setExamModalOpen(true);
    requestAnimationFrame(() => {
      if (examTitleRef.current) {
        examTitleRef.current.value = "";
        examTitleRef.current.focus();
      }
    });
  }

  function closeExamModal() {
    setExamModalOpen(false);
    setExamFormError(null);
    setEditingExam(null);
    setExamModalMode("create");
    setExamMode("percent");
    examTitleValueRef.current = "";
    if (examTitleRef.current) examTitleRef.current.value = "";
  }

  function openEditExamModal(exam: Exam) {
    setExamError(null);
    setExamFormError(null);
    setExamModalMode("edit");
    setEditingExam(exam);
    setExamMode(exam.inputMode ?? "percent");
    examTitleValueRef.current = exam.title ?? "";
    setExamModalOpen(true);
    requestAnimationFrame(() => {
      if (examTitleRef.current) {
        examTitleRef.current.value = exam.title ?? "";
        examTitleRef.current.focus();
        examTitleRef.current.select();
      }
    });
  }

  async function handleDeleteExam(exam: Exam) {
    if (!numericId) return;
    const confirmed = await confirmDanger({
      title: "시험을 삭제할까요?",
      message: `${
        exam.title || "등록된 시험"
      }과(와) 해당 성적 데이터를 영구 삭제합니다. 되돌릴 수 없습니다.`,
    });
    if (!confirmed) return;
    try {
      await deleteExam(numericId, exam.id);
      success("시험이 삭제되었습니다.");
      await refreshExams();
    } catch (e) {
      showError(readableError(e, "시험 삭제에 실패했습니다."));
    }
  }

  // Load attendance for records (server) when available
  useEffect(() => {
    if (!numericId || records.length === 0) return;
    let cancelled = false;
    async function loadAll() {
      const ids = records
        .map((r) => r.id)
        .filter((x): x is number => typeof x === "number");
      if (ids.length === 0) return;
      try {
        const pairs = await Promise.all(
          ids.map(async (rid) => {
            try {
              const list = await listRecordAttendance(numericId!, rid);
              const map: Record<number, boolean> = {};
              list.forEach((a) => {
                map[a.studentId] = !!a.present;
              });
              return [rid, map] as const;
            } catch {
              return [rid, undefined] as const;
            }
          })
        );
        if (!cancelled) {
          setAttByRec((prev) => {
            const next = { ...prev };
            pairs.forEach(([rid, map]) => {
              if (map) next[rid] = map;
            });
            return next;
          });
        }
      } finally {
        // no-op
      }
    }
    void loadAll();
    return () => {
      cancelled = true;
    };
  }, [numericId, records]);

  // Real-time: refresh attendance counts when records are edited elsewhere
  useEffect(() => {
    function onRefresh(event: Event) {
      const ymd = (event as CustomEvent<{ ymd?: string }>).detail?.ymd;
      // Narrow reload to records matching the date, if provided
      const ids = records
        .filter((r) => !ymd || r.recordDate === ymd)
        .map((r) => r.id)
        .filter((x): x is number => typeof x === "number");
      if (!numericId) return;
      if (ids.length === 0) {
        // still trigger re-render for local-only entries
        setAttByRec((prev) => ({ ...prev }));
        return;
      }
      (async () => {
        try {
          const pairs = await Promise.all(
            ids.map(async (rid) => {
              try {
                const list = await listRecordAttendance(numericId!, rid);
                const map: Record<number, boolean> = {};
                list.forEach((a) => {
                  map[a.studentId] = !!a.present;
                });
                return [rid, map] as const;
              } catch {
                return [rid, undefined] as const;
              }
            })
          );
          setAttByRec((prev) => {
            const next = { ...prev };
            pairs.forEach(([rid, map]) => {
              if (map) next[rid] = map;
            });
            return next;
          });
        } catch {
          // ignore
        } finally {
          // ensure UI updates
          setAttByRec((prev) => ({ ...prev }));
        }
      })();
    }
    window.addEventListener(
      "calendar:classes-refresh",
      onRefresh as EventListener
    );
    return () =>
      window.removeEventListener(
        "calendar:classes-refresh",
        onRefresh as EventListener
      );
  }, [numericId, records]);

  useEffect(() => {
    if (!numericId) return;
    let cancelled = false;
    async function loadStudents() {
      setStuLoading(true);
      setStuError(null);
      try {
        const list = await listCourseStudents(numericId!);
        if (!cancelled) setStudents(list);
      } catch (error) {
        const msg = readableError(error, "");
        if (msg.includes("404")) {
          try {
            // fallback: gather all then filter
            let page = 0;
            const size = 100;
            let all: Student[] = [];
            while (true) {
              const { content, last } = await listStudents({ page, size });
              all = all.concat(content);
              if (last || content.length === 0 || page > 100) break;
              page += 1;
            }
            const filtered = all.filter((s) =>
              (s.courses || []).some((c) => c.id === numericId)
            );
            if (!cancelled) setStudents(filtered);
          } catch (nestedError) {
            if (!cancelled)
              setStuError(
                readableError(nestedError, "등록 학생을 불러오지 못했습니다.")
              );
          }
        } else {
          if (!cancelled)
            setStuError(msg || "등록 학생을 불러오지 못했습니다.");
        }
      } finally {
        if (!cancelled) setStuLoading(false);
      }
    }
    void loadStudents();
    return () => {
      cancelled = true;
    };
  }, [numericId]);

  const info = useMemo(() => (course ? buildInfo(course) : null), [course]);
  type HistoryItem = {
    id?: number;
    date: Date;
    dateLabel: string;
    time: string;
    type: "지난 수업" | "예정";
    notes?: string | null;
  };
  const history: HistoryItem[] = useMemo(() => {
    if (!course) return [];
    return records.map((r) => ({
      id: r.id,
      date: new Date(r.recordDate),
      dateLabel: `${r.recordDate} (${
        "일월화수목금토"[new Date(r.recordDate).getDay()]
      })`,
      time: formatCourseTime(course),
      type: new Date(r.recordDate) < new Date() ? "지난 수업" : "예정",
      notes: r.notes || r.content || null,
    }));
  }, [course, records]);
  function fmt(d: Date) {
    const y = d.getFullYear(),
      m = String(d.getMonth() + 1).padStart(2, "0"),
      da = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${da}`;
  }
  function formatCourseTime(c: Course) {
    return c.startTime && c.endTime
      ? `${hhmm(c.startTime)} ~ ${hhmm(c.endTime)}`
      : c.courseTime || "-";
  }

  // Attendance 로컬 캐시: 서버 응답이 없을 때를 대비한 보조 용도
  const localAttendanceMap = useCallback(
    (recordId: number): Record<number, boolean> => {
      try {
        return JSON.parse(
          localStorage.getItem(`attendance:${numericId}:${recordId}`) || "{}"
        ) as Record<number, boolean>;
      } catch {
        return {};
      }
    },
    [numericId]
  );
  const totalStudents = useMemo(() => {
    if (course?.enrolledCount != null) return course.enrolledCount;
    return students.length;
  }, [course, students.length]);
  const capacity = course?.capacity;
  const completedCount = useMemo(
    () => history.filter((h) => h.type === "지난 수업").length,
    [history]
  );
  const progressPct = useMemo(() => {
    const total = history.length || 0;
    if (!total) return null;
    return Math.round((completedCount / total) * 100);
  }, [completedCount, history.length]);

  // Compute average attendance across processed entries in current filter
  const avgAttendance = useMemo(() => {
    if (!history.length) return null as null | number;
    let presentSum = 0;
    let processedSum = 0;
    for (const h of history) {
      if (!h.id) continue;
      const map = attByRec[h.id] || localAttendanceMap(h.id);
      const present = Object.values(map).filter((v) => v === true).length;
      const absent = Object.values(map).filter((v) => v === false).length;
      const processed = present + absent;
      if (processed > 0) {
        presentSum += present;
        processedSum += processed;
      }
    }
    if (processedSum === 0) return null;
    return Math.round((presentSum / processedSum) * 100);
  }, [history, attByRec, localAttendanceMap]);

  // Toggle to collapse/expand the session list view
  const [collapsedList, setCollapsedList] = useState(false);

  return (
    <Wrap>
      <Head>
        <BackBtn type="button" onClick={() => navigate("/classes")}>
          {leftIcon} 뒤로
        </BackBtn>
        <h2>{course?.title || "수업 상세"}</h2>
        <Actions>
          <UIGhostBtn
            to={`/classes/${numericId || ""}/edit-students`}
            title="수강생 수정"
            data-variant="edit"
          >
            수강생 수정
          </UIGhostBtn>
          <UIGhostBtn
            to={`/classes/${numericId || ""}/edit`}
            title="기본 정보 수정"
            data-variant="edit"
          >
            기본정보 수정
          </UIGhostBtn>
          {numericId && (
            <UIGhostButton
              type="button"
              onClick={() => setConfirmDeleteOpen(true)}
            >
              삭제
            </UIGhostButton>
          )}
        </Actions>
      </Head>
      {/* Breadcrumb removed per request */}
      {confirmDangerDialog}
      <ConfirmDialog
        open={confirmDeleteOpen}
        title="수업(템플릿) 삭제"
        message={
          "관련 수업 내역/출결/첨부가 모두 삭제됩니다. 이 작업은 되돌릴 수 없습니다."
        }
        confirmLabel="영구 삭제"
        cancelLabel="취소"
        tone="danger"
        busy={confirmBusy}
        onCancel={() => {
          if (!confirmBusy) setConfirmDeleteOpen(false);
        }}
        onConfirm={async () => {
          if (!numericId) return;
          setConfirmBusy(true);
          try {
            await deleteCourse(numericId);
            setConfirmDeleteOpen(false);
            navigate("/classes");
          } catch (e) {
            showError(readableError(e, "삭제에 실패했습니다."));
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
          value={
            <>
              {typeof totalStudents === "number" ? `${totalStudents}명` : "—"}
            </>
          }
          footerLeft={<span>정원 {capacity ?? "—"}명</span>}
        />
        <KPI
          title="평균 출석률"
          icon={<CheckIcon />}
          iconAccent="green"
          value={<>{avgAttendance != null ? `${avgAttendance}%` : "—"}</>}
          footerLeft={<span>처리된 회차 기준</span>}
        />
        <KPI
          title="완료된 수업"
          icon={<ClassIcon />}
          iconAccent="violet"
          value={<>{completedCount || 0}회</>}
          footerRight={
            progressPct != null ? (
              <span>진행률 {progressPct}%</span>
            ) : (
              <span>—</span>
            )
          }
        />
      </KPIGrid>

      {/* Segmented tabs removed */}

      {/* Two-column layout: 좌측(기본+학생), 우측(수업 내역) */}
      {info && (
        <Columns>
          <Left>
            <StickyLeft>
              <Section>
                <SectionHead>
                  <Title>수업 정보</Title>
                  <div>
                    <UIGhostBtnSmall
                      to={`/classes/${numericId || ""}/edit`}
                      data-variant="edit"
                    >
                      기본정보 수정
                    </UIGhostBtnSmall>
                  </div>
                </SectionHead>
                <GridTwo>
                  <Field>
                    <Label>코드</Label>
                    <div>
                      <code>{course?.code}</code>
                    </div>
                  </Field>
                  <Field>
                    <Label>상태</Label>
                    <div>
                      <StatusChip data-type={course?.status}>
                        {statusLabel(course?.status)}
                      </StatusChip>
                    </div>
                  </Field>
                  <Field>
                    <Label>수업 형태</Label>
                    <div>{courseTypeLabel(course?.courseType)}</div>
                  </Field>
                  <Field>
                    <Label>요일</Label>
                    <div>{info.days || "-"}</div>
                  </Field>
                  <Field>
                    <Label>시간</Label>
                    <div>{info.time || "-"}</div>
                  </Field>
                  <Field>
                    <Label>정원</Label>
                    <div>{course?.capacity ?? "-"}</div>
                  </Field>
                  <Field>
                    <Label>수강료</Label>
                    <div>
                      {course?.fee != null ? formatMoney(course.fee) : "-"}
                    </div>
                  </Field>
                  <Field>
                    <Label>생성일</Label>
                    <div>
                      {course?.createdAt
                        ? new Date(course.createdAt).toLocaleDateString()
                        : "-"}
                    </div>
                  </Field>
                  <Field style={{ gridColumn: "1 / -1" }}>
                    <Label>수업 설명</Label>
                    <Desc>{course?.description || "-"}</Desc>
                  </Field>
                </GridTwo>
              </Section>
              <CourseStudentsPanel
                students={students}
                loading={stuLoading}
                error={stuError}
                editHref={`/classes/${numericId || ''}/edit-students`}
              />
              <CourseExamsPanel
                exams={exams}
                loading={examLoading}
                error={examError}
                onCreate={openExamModal}
                onEdit={openEditExamModal}
                onDelete={handleDeleteExam}
                modalOpen={examModalOpen}
                modalMode={examModalMode}
                examMode={examMode}
                examFormError={examFormError}
                examSaving={examSaving}
                onCloseModal={closeExamModal}
                onSubmitModal={handleSubmitExam}
                onExamModeChange={setExamMode}
                examTitleRef={examTitleRef}
                onExamTitleChange={(val: string) => { examTitleValueRef.current = val; }}
              />
              {/* 진행 현황 섹션 제거 */}
            </StickyLeft>
          </Left>
          <Right>
            <CourseRecordsPanel
              history={history}
              filterYear={filterYear}
              filterMonth={filterMonth}
              onChangeYear={(y) => setFilterYear(y)}
              onChangeMonth={(m) => setFilterMonth(m)}
              onResetFilters={() => { const now = new Date(); setFilterYear(now.getFullYear()); setFilterMonth(0); }}
              exporting={exportingRecords}
              onExport={handleExportRecords}
              collapsed={collapsedList}
              onToggleCollapsed={() => setCollapsedList(v => !v)}
              todayHref={`/classes/${numericId || ''}/history/date/${fmt(new Date())}`}
              detailHrefFor={(id, date) => id ? `/classes/${numericId}/history/${id}` : `/classes/${numericId}/history/date/${fmt(date!)}`}
              getAttendanceMap={(recordId) => (attByRec[recordId] || localAttendanceMap(recordId))}
            />
          </Right>
        </Columns>
      )}

      {/* history block moved to right column */}
      {/* Exam modal moved into CourseExamsPanel */}
    </Wrap>
  );
}

// utils
function hhmm(t?: string) {
  if (!t) return "";
  const [h, m] = t.split(":");
  return `${h}:${m}`;
}
function dayLabel(code: string) {
  const map: Record<string, string> = {
    MON: "월",
    TUE: "화",
    WED: "수",
    THU: "목",
    FRI: "금",
    SAT: "토",
    SUN: "일",
  };
  return map[code.toUpperCase()] || code;
}
function statusLabel(s?: Course["status"]) {
  switch (s) {
    case "IN_PROGRESS":
      return "진행중";
    case "PENDING":
      return "대기";
    case "STOPPED":
      return "중단";
    default:
      return s || "-";
  }
}
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

function buildInfo(c: Course) {
  const order: Record<
    "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN",
    number
  > = { MON: 0, TUE: 1, WED: 2, THU: 3, FRI: 4, SAT: 5, SUN: 6 };
  const days = (c.recurrenceDays || "")
    .split(",")
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean)
    .sort(
      (a, b) => order[a as keyof typeof order] - order[b as keyof typeof order]
    )
    .map(dayLabel)
    .join("/");
  const time =
    c.startTime && c.endTime
      ? `${hhmm(c.startTime)} ~ ${hhmm(c.endTime)}`
      : c.courseTime || "-";
  return { days, time };
}

// styles
const Wrap = styled.div`
  display: grid;
  gap: 12px;
`;
const Head = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 12px;
  align-items: center;
  h2 {
    margin: 0;
  }
`;
const Actions = styled.div`
  display: inline-flex;
  gap: 12px;
`;
// (tabs removed)
// Section, Title from common UI
const GridTwo = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;
const Field = styled.div`
  display: grid;
  gap: 6px;
`;
const Label = styled.div`
  color: #6b7280;
  font-size: 12px;
  font-weight: 700;
`;
const Desc = styled.div`
  color: #111827;
  white-space: pre-wrap;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 6; /* clamp to ~6 lines */
  -webkit-box-orient: vertical;
`;
const StatusChip = styled.span`
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
// Buttons from common UI
const AlertError = styled.div`
  background: #fee2e2;
  color: #b91c1c;
  border: 1px solid #fecaca;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 13px;
`;
const Muted = styled.div`
  color: #6b7280;
  font-size: 12px;
`;
const BackBtn = styled.button`
  ${buttonVariants.outline};
  height: 40px;
  padding: 0 16px;
  font-weight: 600;
  font-size: 14px;
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
// Breadcrumb removed

// new layout styles
const KPIGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 12px;
`;
const Columns = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
`;
const Left = styled.div`
  flex: 4 1 0;
  display: grid;
  gap: 12px;
  align-content: flex-start;
`;
const StickyLeft = styled.div`
  position: sticky;
  top: var(--sticky-top, 64px); /* align with PageHeader sticky height */
  z-index: 31; /* above PageHeader's z-index(30) siblings */
  background: ${({ theme }) => theme.colors.surface};
  display: grid;
  gap: 12px;
  align-content: flex-start;
  align-self: start; /* ensure sticky box isn't stretched by parent grid/flex */
  height: max-content; /* collapse to content height for proper sticky behavior */
  will-change: top; /* hint for smoother stick */
  @media (max-width: 900px) {
    position: static; /* mobile: disable sticky to avoid cramped UI */
  }
`;
const Right = styled.div`
  flex: 6 1 0;
  display: grid;
  gap: 12px;
  align-content: flex-start;
`;
const SectionHead = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 8px;
`;
// 진행 현황 섹션 제거로 불필요한 스타일 삭제됨
