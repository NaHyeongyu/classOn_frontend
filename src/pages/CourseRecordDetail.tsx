import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type React from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import {
  SectionCard as Section,
  TitleH3 as Title,
  GhostBtn as UIGhostBtn,
  GhostButton as UIGhostButton,
  SmallBtn as UISmallBtn,
  PrimaryButton as UIPrimaryButton,
  PrimaryButtonSm as UIPrimaryButtonSm,
  buttonVariants,
  Skeleton as UISkeleton,
} from "../components/common/UI";
import Modal from "@/components/common/Modal";
import ConfirmDialog from "@/components/common/ConfirmDialog";
// KPI widgets removed from this view for a cleaner layout
import { useToast } from "@/components/common/Toast";
import {
  getCourse,
  type Course,
  type CourseRecord,
  listCourseRecords,
  listCourseStudents,
  updateCourseRecord,
  createCourseRecord,
  listRecordAttendance,
  upsertAttendance,
  listRecordAttachments,
  uploadRecordAttachments,
  deleteRecordAttachment,
  deleteCourseRecord,
  type Attachment,
  type Attendance,
  presignRecordAttachment,
  confirmRecordAttachment,
  getRecordAttachmentDownloadUrl,
} from "@/api/courses";
import { invalidateCacheByPrefix } from "@/lib/fetcher";
import type { Student } from "@/api/students";
import { formatYMD } from "@/features/calendar/dateUtils";
import type { Exam } from "@/api/exams";
import {
  createExam,
  listExams,
  listExamResults,
  upsertExamResults,
  updateExam,
  deleteExam,
} from "@/api/exams";
// exam templates not used here
// KPIs removed from this view for a simpler layout
import { readableError } from "@/lib/errors";
import { formatKoreanDate } from "@/lib/format";

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
] as const;

export default function CourseRecordDetail() {
  const navigate = useNavigate();
  const { id, recordId, ymd } = useParams();
  const [searchParams] = useSearchParams();
  const { error: showError } = useToast();
  const courseId = useMemo(() => (id ? Number(id) : null), [id]);
  const recId = useMemo(() => (recordId ? Number(recordId) : null), [recordId]);

  const [course, setCourse] = useState<Course | null>(null);
  const [record, setRecord] = useState<CourseRecord | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<{ content?: boolean; when?: boolean }>(
    {}
  );
  const [contentFeedback, setContentFeedback] = useState<"idle" | "success">(
    "idle"
  );
  const [editingWhen, setEditingWhen] = useState(false);
  const [whenError, setWhenError] = useState<string | null>(null);
  const [attVersion, setAttVersion] = useState(0);
  const [attMap, setAttMap] = useState<Record<number, boolean>>({});
  const [attNoteMap, setAttNoteMap] = useState<Record<number, string>>({});
  const noteTimersRef = useRef<Record<number, number>>({});
  const [attLoading, setAttLoading] = useState(false);
  const [attError, setAttError] = useState<string | null>(null);
  const [attSavingMap, setAttSavingMap] = useState<Record<number, boolean>>({});
  // Preserve names of attendees no longer enrolled to display historical attendance properly
  const [attStudentNames, setAttStudentNames] = useState<
    Record<number, string>
  >({});
  const [bulkStatus, setBulkStatus] = useState<"present" | "absent" | null>(
    null
  );
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Record<number, boolean>>({});
  // UI: filters/search for attendance list
  const [attFilter, setAttFilter] = useState<
    "all" | "present" | "absent" | "none"
  >("all");
  const [attQuery, setAttQuery] = useState("");
  // Single confirm dialog state for per-student action
  const [confirmOne, setConfirmOne] = useState<{
    open: boolean;
    studentId: number | null;
    target: boolean | null;
  }>({ open: false, studentId: null, target: null });
  // editable date/time
  const [editDate, setEditDate] = useState<string>("");
  const [editStart, setEditStart] = useState<string>("");
  const [editEnd, setEditEnd] = useState<string>("");
  // attachments
  const [files, setFiles] = useState<Attachment[]>([]);
  const [filesLoading, setFilesLoading] = useState(false);
  const [filesError, setFilesError] = useState<string | null>(null);
  const [contentValue, setContentValue] = useState<string>("");
  const [fileBusy, setFileBusy] = useState<Record<number, boolean>>({});
  type UploadQueueItem = {
    id: string;
    name: string;
    size: number;
    progress: number;
    status: "pending" | "uploading" | "done" | "error";
    error?: string;
  };
  const [uploadQueue, setUploadQueue] = useState<UploadQueueItem[]>([]);
  const [thumbUrl, setThumbUrl] = useState<Record<number, string>>({});
  const [previewBusy, setPreviewBusy] = useState<Record<number, boolean>>({});
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [confirmBusy, setConfirmBusy] = useState(false);
  const [performanceScore, setPerformanceScore] = useState<string>("");
  const [performanceNote, setPerformanceNote] = useState("");
  const [performanceSaving, setPerformanceSaving] = useState(false);
  const [performanceFeedback, setPerformanceFeedback] = useState<
    "idle" | "success"
  >("idle");
  // right panel tabs
  const [rightTab, setRightTab] = useState<"attendance" | "grades">(
    "attendance"
  );
  // grades section view state
  const [gradeView, setGradeView] = useState<"intro" | "list" | "scores">(
    "intro"
  );
  // exams (per course)
  const [exams, setExams] = useState<Exam[]>([]);
  const [examLoading, setExamLoading] = useState(false);
  const [examError, setExamError] = useState<string | null>(null);
  const [selectedExamId, setSelectedExamId] = useState<string>("");
  const [examFormTitle, setExamFormTitle] = useState("");
  const [examFormMode, setExamFormMode] = useState<"percent" | "letter">(
    "percent"
  );
  const [examFormSaving, setExamFormSaving] = useState(false);
  const [examFormError, setExamFormError] = useState<string | null>(null);
  const [examModalOpen, setExamModalOpen] = useState(false);
  const [examModalView, setExamModalView] = useState<"list" | "create">("list");
  const [examQuery, setExamQuery] = useState("");
  const [examCreateOk, setExamCreateOk] = useState(false);
  const selectedExam = useMemo(
    () => exams.find((ex) => String(ex.id) === selectedExamId) || null,
    [exams, selectedExamId]
  );
  // score inputs
  const [examResultsMap, setExamResultsMap] = useState<
    Record<
      number,
      { score?: number; outOf?: number; level?: string; note?: string }
    >
  >({});
  const filteredExams = useMemo(() => {
    const q = examQuery.trim().toLowerCase();
    if (!q) return exams;
    return exams.filter((ex) => (ex.title || "").toLowerCase().includes(q));
  }, [exams, examQuery]);
  const [gradeMap, setGradeMap] = useState<
    Record<
      number,
      { percent?: string; letter?: "A" | "B" | "C" | "D" | "E" | "F" }
    >
  >({});
  const [gradeSaving, setGradeSaving] = useState(false);
  const [gradeFeedback, setGradeFeedback] = useState<
    "idle" | "success" | "error"
  >("idle");
  const selectedExamIdRef = useRef("");
  useEffect(() => {
    selectedExamIdRef.current = selectedExamId;
  }, [selectedExamId]);
  // Warn on window close when there are unsaved grade edits
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (Object.keys(gradeMap).length > 0) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, [gradeMap]);
  useEffect(() => {
    if (rightTab === "grades") {
      // Keep current view if already on scores or list
      // Auto-pick best view when entering the tab
      if (selectedExamId) {
        setGradeView("scores");
      } else if (!examLoading) {
        if (exams.length > 0) setGradeView("list");
        else setGradeView("intro");
      }
    } else {
      setExamModalOpen(false);
    }
  }, [rightTab, selectedExamId, examLoading, exams.length]);
  useEffect(() => {
    if (rightTab !== "grades") return;
    if (gradeView === "list" && !examLoading && exams.length === 0) {
      setGradeView("intro");
    }
  }, [gradeView, examLoading, exams.length, rightTab]);
  // file size limit (MB)
  // Match server max (5MB per file in CourseRecordService)
  const MAX_FILE_SIZE_MB = 5;
  const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;
  const ALLOWED_MIME = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
  ]);
  // Right column shows attendance; content/files move to left below info

  useEffect(() => {
    if (!courseId) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [courseData, recordsData, studentsData] = await Promise.all([
          getCourse(courseId),
          listCourseRecords(courseId),
          listCourseStudents(courseId),
        ]);
        if (!cancelled) {
          setCourse(courseData);
          const foundById = recordsData.find((r) => r.id === recId) || null;
          const foundByDate = ymd
            ? recordsData.find((r) => r.recordDate === ymd) || null
            : null;
          setRecord(foundById ?? foundByDate ?? null);
          setStudents(studentsData);
        }
      } catch (error) {
        if (!cancelled) {
          setError(readableError(error, "수업 내역을 불러오지 못했습니다."));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [courseId, recId, ymd]);

  // initialize editable date/time when record loads
  useEffect(() => {
    const d = record?.recordDate || ymd || "";
    const s = record?.startTime || course?.startTime || "";
    const e = record?.endTime || course?.endTime || "";
    setEditDate(d);
    setEditStart(toHHMM(s));
    setEditEnd(toHHMM(e));
  }, [
    record?.recordDate,
    record?.startTime,
    record?.endTime,
    course?.startTime,
    course?.endTime,
    ymd,
  ]);

  // If opened by date to create a new record, start in editing mode
  useEffect(() => {
    if (!loading && ymd && !record?.id) {
      setEditingWhen(true);
    }
  }, [loading, ymd, record?.id]);

  useEffect(() => {
    setContentValue(record?.content || "");
  }, [record?.content]);

  useEffect(() => {
    if (!record?.id) {
      setPerformanceScore("");
      setPerformanceNote("");
      setPerformanceFeedback("idle");
      return;
    }
    setPerformanceScore(
      record.performanceScore !== null && record.performanceScore !== undefined
        ? String(record.performanceScore)
        : ""
    );
    setPerformanceNote(record.performanceNote ?? "");
    setPerformanceFeedback("idle");
  }, [record?.id, record?.performanceScore, record?.performanceNote]);

  // Attendance local storage (unified with CourseDetail)
  const getLocalAttendanceKey = useCallback(() => {
    if (!courseId) return `attendance::`;
    if (recId) return `attendance:${courseId}:${recId}`;
    if (ymd) return `attendanceDate:${courseId}:${ymd}`;
    return `attendance:${courseId}:`;
  }, [courseId, recId, ymd]);

  const localAttMap = useMemo(() => {
    if (!courseId) return {} as Record<string, boolean>;
    const key = getLocalAttendanceKey();
    void attVersion;
    try {
      return JSON.parse(localStorage.getItem(key) || "{}") as Record<
        string,
        boolean
      >;
    } catch {
      return {};
    }
  }, [courseId, getLocalAttendanceKey, attVersion]);
  const presentMap = useMemo(() => {
    // Prefer server map when record exists; fallback to local when not available
    if (record?.id) return attMap;
    return localAttMap;
  }, [attMap, localAttMap, record?.id]);
  type AttendanceRow = {
    id: number;
    name: string;
    isExtra?: boolean;
    status: "present" | "absent" | "none";
  };
  const attendanceRows = useMemo<AttendanceRow[]>(() => {
    const baseRows = students.map((s) => ({ id: s.id, name: s.name }));
    const baseIds = new Set(baseRows.map((r) => r.id));
    const extraRows = Object.keys(presentMap)
      .map((id) => Number(id))
      .filter((id) => Number.isFinite(id) && !baseIds.has(id))
      .map((id) => ({
        id,
        name: attStudentNames[id] || `학생#${id}`,
        isExtra: true,
      }));
    return [...baseRows, ...extraRows].map((row) => {
      const has = Object.prototype.hasOwnProperty.call(presentMap, row.id);
      const value = has
        ? Boolean((presentMap as Record<number, boolean>)[row.id])
        : null;
      const status: "present" | "absent" | "none" =
        value == null ? "none" : value ? "present" : "absent";
      return { ...row, status };
    });
  }, [students, presentMap, attStudentNames]);
  const actionableRows = useMemo(
    () => attendanceRows.filter((row) => !row.isExtra),
    [attendanceRows]
  );
  const actionableCount = actionableRows.length;
  const filteredAttendanceRows = useMemo(() => {
    const narrowed = attendanceRows.filter((row) => {
      if (attFilter === "present") return row.status === "present";
      if (attFilter === "absent") return row.status === "absent";
      if (attFilter === "none") return row.status === "none";
      return true;
    });
    const query = attQuery.trim().toLowerCase();
    if (!query) return narrowed;
    return narrowed.filter((row) => row.name.toLowerCase().includes(query));
  }, [attendanceRows, attFilter, attQuery]);
  const attendanceBuckets = useMemo(() => {
    let present = 0;
    let absent = 0;
    let none = 0;
    for (const row of actionableRows) {
      if (row.status === "present") present += 1;
      else if (row.status === "absent") absent += 1;
      else none += 1;
    }
    return { present, absent, none, total: actionableRows.length };
  }, [actionableRows]);
  // 점수 입력 대상: 현재 수업의 재학생 전원(출석 여부 무관)
  const scoreStudents = useMemo(
    () =>
      attendanceRows
        .filter((row) => !row.isExtra)
        .map((row) => ({ id: row.id, name: row.name })),
    [attendanceRows]
  );

  const hasGradeChanges = useMemo(
    () => Object.keys(gradeMap).length > 0,
    [gradeMap]
  );

  function letterFromNumeric(n?: number | null): string | null {
    if (n == null || !Number.isFinite(n)) return null;
    const v = Math.round(Number(n));
    if (v >= 90) return "A";
    if (v >= 80) return "B";
    if (v >= 70) return "C";
    if (v >= 60) return "D";
    if (v >= 50) return "E";
    return "F";
  }
  function numericFromLetter(lv?: string): number | null {
    if (!lv) return null;
    const c = (lv.trim()[0] || "").toUpperCase();
    if (c === "A") return 100;
    if (c === "B") return 90;
    if (c === "C") return 80;
    if (c === "D") return 70;
    if (c === "E") return 60;
    if (c === "F") return 50;
    return null;
  }
  // Average score across modes, then show as letter
  const avgNumeric = useMemo(() => {
    if (!selectedExam) return null;
    let sum = 0;
    let count = 0;
    for (const s of scoreStudents) {
      let n: number | null = null;
      if (selectedExam.inputMode === "percent") {
        const v = gradeMap[s.id]?.percent;
        if (v !== undefined && v !== "") {
          const raw = Number(v);
          if (Number.isFinite(raw))
            n = Math.max(0, Math.min(100, Math.round(raw)));
        } else {
          const existing = examResultsMap[s.id]?.score;
          if (existing != null && Number.isFinite(existing))
            n = Math.max(0, Math.min(100, Math.round(existing)));
        }
      } else {
        const lv = gradeMap[s.id]?.letter ?? examResultsMap[s.id]?.level ?? "";
        n = numericFromLetter(lv);
      }
      if (n != null) {
        sum += n;
        count += 1;
      }
    }
    if (count === 0) return null;
    return Math.round((sum / count) * 10) / 10;
  }, [selectedExam, scoreStudents, gradeMap, examResultsMap]);
  const avgLetter = useMemo(() => letterFromNumeric(avgNumeric), [avgNumeric]);

  async function saveScoresForPresent() {
    if (!courseId) return;
    if (!selectedExam) {
      alert("먼저 시험을 선택하거나 생성하세요.");
      return;
    }
    const date =
      record?.recordDate || ymd || new Date().toISOString().slice(0, 10);
    setGradeSaving(true);
    setGradeFeedback("idle");
    try {
      // 변경된 학생만 저장 (기존 값이 유지되도록)
      const items = Object.entries(gradeMap).map(([sidStr, input]) => {
        const sid = Number(sidStr);
        let score: number | undefined = undefined;
        let level: string | undefined = undefined;
        if (selectedExam.inputMode === "percent") {
          const raw = input?.percent;
          if (raw !== undefined && raw !== "") {
            const n = Number(raw);
            score = Number.isFinite(n)
              ? Math.max(0, Math.min(100, Math.round(n)))
              : undefined;
          } else {
            score = undefined;
          }
        } else {
          level = input?.letter;
        }
        return {
          studentId: sid,
          score,
          level,
        };
      });
      // 변경 사항이 없으면 조용히 반환
      if (items.length === 0) {
        setGradeSaving(false);
        return;
      }
      // 시험 날짜가 없으면 현재 수업 날짜로 세팅
      if (!selectedExam.examDate && date) {
        try {
          await updateExam(courseId, Number(selectedExamId), {
            examDate: date,
          });
        } catch {}
      }
      await upsertExamResults(courseId, Number(selectedExamId), items);
      try {
        invalidateCacheByPrefix(
          `/api/courses/${courseId}/exams/${selectedExamId}/results`
        );
      } catch {}
      // 저장 후 최신 결과 재조회하여 입력값을 유지 표시
      try {
        const saved = await listExamResults(courseId, Number(selectedExamId));
        const nextMap: Record<
          number,
          { score?: number; outOf?: number; level?: string; note?: string }
        > = {};
        for (const r of saved)
          nextMap[r.studentId] = {
            score: r.score,
            outOf: r.outOf,
            level: r.level,
            note: r.note,
          };
        setExamResultsMap(nextMap);
      } catch {}
      setGradeFeedback("success");
      // 로컬 변경사항 초기화 (서버 값으로 표시 유지)
      window.setTimeout(() => {
        setGradeMap({});
        setGradeFeedback("idle");
      }, 1500);
    } catch (e) {
      showError(
        readableError(e, "성적 저장에 실패했습니다. 다시 시도해 주세요.")
      );
      setGradeFeedback("error");
    } finally {
      setGradeSaving(false);
    }
  }
  function setAttendance(studentId: number, present: boolean) {
    if (!courseId) return;
    const key = getLocalAttendanceKey();
    const map: Record<string, boolean> = (() => {
      try {
        return JSON.parse(localStorage.getItem(key) || "{}") as Record<
          string,
          boolean
        >;
      } catch {
        return {};
      }
    })();
    map[String(studentId)] = present;
    try {
      localStorage.setItem(key, JSON.stringify(map));
    } catch {
      // ignore quota errors
    }
    setAttVersion((v) => v + 1);
    emitCalendarClassesRefresh();
  }
  function clearAttendanceLocal(studentId: number) {
    if (!courseId) return;
    const key = getLocalAttendanceKey();
    const map: Record<string, boolean> = (() => {
      try {
        return JSON.parse(localStorage.getItem(key) || "{}") as Record<
          string,
          boolean
        >;
      } catch {
        return {};
      }
    })();
    if (Object.prototype.hasOwnProperty.call(map, String(studentId)))
      delete map[String(studentId)];
    try {
      localStorage.setItem(key, JSON.stringify(map));
    } catch {
      // ignore quota errors
    }
    setAttVersion((v) => v + 1);
  }
  const presentCount = useMemo(
    () => Object.values(presentMap).filter(Boolean).length,
    [presentMap]
  );
  const absentCount = useMemo(
    () => attendanceRows.filter((r) => r.status === "absent").length,
    [attendanceRows]
  );
  const noneCount = useMemo(
    () => attendanceRows.filter((r) => r.status === "none").length,
    [attendanceRows]
  );
  const isPastRecord = useMemo(() => {
    const recDateStr = record?.recordDate || ymd || "";
    return recDateStr
      ? new Date(recDateStr) < new Date(new Date().toDateString())
      : false;
  }, [record?.recordDate, ymd]);
  const denom = useMemo(() => {
    if (isPastRecord) return Object.keys(presentMap).length; // processed only for past
    return students.length;
  }, [isPastRecord, presentMap, students.length]);
  const attendanceRate = useMemo(
    () => (denom ? Math.round((presentCount / denom) * 100) : null),
    [presentCount, denom]
  );
  const durationMin = useMemo(
    () =>
      getDurationMinutes(
        record?.startTime || course?.startTime,
        record?.endTime || course?.endTime
      ),
    [record?.startTime, record?.endTime, course?.startTime, course?.endTime]
  );
  const durationLabel = useMemo(
    () => formatDuration(durationMin),
    [durationMin]
  );
  const {
    present: actionablePresent,
    absent: actionableAbsent,
    none: actionableNone,
    total: actionableTotal,
  } = attendanceBuckets;
  const summaryRate =
    attendanceRate ??
    (actionableTotal
      ? Math.round((actionablePresent / actionableTotal) * 100)
      : null);
  const presentShare = actionableTotal
    ? Math.round((actionablePresent / actionableTotal) * 100)
    : 0;
  const absentShare = actionableTotal
    ? Math.round((actionableAbsent / actionableTotal) * 100)
    : 0;
  const noneShare = actionableTotal
    ? Math.round((actionableNone / actionableTotal) * 100)
    : 0;
  const hasAttendanceFilter = attFilter !== "all" || attQuery.trim().length > 0;
  const headLoading = loading && !course;
  const statsLoading = loading && actionableRows.length === 0;
  // participation metrics removed

  function emitCalendarClassesRefresh(target?: string) {
    const payload =
      target || record?.recordDate || ymd || formatYMD(new Date());
    window.dispatchEvent(
      new CustomEvent("calendar:classes-refresh", { detail: { ymd: payload } })
    );
  }

  const whenInfo = useMemo(() => {
    const rawDate = record?.recordDate || ymd || "";
    const range = formatRange(
      record?.startTime || course?.startTime,
      record?.endTime || course?.endTime
    );
    const dateLabel = rawDate ? formatDateBadge(rawDate) : "일자 미지정";
    const timeLabel = range || "시간 미지정";
    return {
      dateLabel,
      timeLabel,
      hasDate: Boolean(record?.recordDate || ymd),
      hasTime: Boolean(range),
    };
  }, [
    record?.recordDate,
    record?.startTime,
    record?.endTime,
    course?.startTime,
    course?.endTime,
    ymd,
  ]);

  const refreshExams = useCallback(
    async (opts?: { selectId?: string | number }) => {
      if (!courseId) return;
      setExamLoading(true);
      setExamError(null);
      try {
        const list = await listExams(courseId);
        setExams(list);
        let nextId = "";
        if (
          opts?.selectId &&
          list.some((ex) => String(ex.id) === String(opts.selectId))
        ) {
          nextId = String(opts.selectId);
        } else {
          const current = selectedExamIdRef.current;
          if (current && list.some((ex) => String(ex.id) === current)) {
            nextId = current;
          } else {
            const byQuery = searchParams.get("examId");
            if (byQuery && list.some((ex) => String(ex.id) === byQuery)) {
              nextId = byQuery;
            } else {
              const dateKey = record?.recordDate || ymd || "";
              if (dateKey) {
                const matching = list.find((ex) => ex.examDate === dateKey);
                if (matching) nextId = String(matching.id);
              }
            }
          }
        }
        setSelectedExamId(nextId);
      } catch (e) {
        setExamError(readableError(e, "시험 목록을 불러오지 못했습니다."));
        setExams([]);
        if (opts?.selectId) setSelectedExamId(String(opts.selectId));
      } finally {
        setExamLoading(false);
      }
    },
    [courseId, record?.recordDate, ymd, searchParams]
  );

  useEffect(() => {
    void refreshExams();
  }, [refreshExams]);

  // 시험 선택 시 기존 결과를 불러와 입력란을 미리 채움
  useEffect(() => {
    if (!courseId || !selectedExamId) {
      setExamResultsMap({});
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        try {
          invalidateCacheByPrefix(
            `/api/courses/${courseId}/exams/${selectedExamId}/results`
          );
        } catch {}
        const list = await listExamResults(courseId, Number(selectedExamId));
        if (cancelled) return;
        const map: Record<
          number,
          { score?: number; outOf?: number; level?: string; note?: string }
        > = {};
        for (const r of list)
          map[r.studentId] = {
            score: r.score,
            outOf: r.outOf,
            level: r.level,
            note: r.note,
          };
        setExamResultsMap(map);
      } catch {
        if (!cancelled) setExamResultsMap({});
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [courseId, selectedExamId]);

  function openExamModal(view: "list" | "create" = "list") {
    void refreshExams();
    setExamModalView(view);
    const dateKey =
      record?.recordDate || ymd || new Date().toISOString().slice(0, 10);
    // Pre-fill default title to a simple label (no date in name)
    setExamFormTitle(view === "create" ? `시험` : "");
    setExamFormMode("percent");
    setExamFormError(null);
    setExamCreateOk(false);
    setExamQuery("");
    setExamModalOpen(true);
  }

  function closeExamModal() {
    if (examFormSaving) return;
    setExamModalOpen(false);
    setExamFormError(null);
    setExamModalView("list");
  }

  function handleGradesPrimaryAction() {
    // 시험이 없으면 바로 생성, 있으면 선택 모달
    if (exams.length === 0) {
      void quickCreateExamPercent();
    } else {
      setGradeView("list");
      openExamModal("list");
    }
  }

  function handleConfirmExamSelection() {
    if (!selectedExamId) return;
    setGradeView("scores");
    setExamModalOpen(false);
  }

  async function quickCreateExamPercent() {
    if (!courseId || examFormSaving) return;
    const date =
      record?.recordDate || ymd || new Date().toISOString().slice(0, 10);
    setExamFormSaving(true);
    try {
      const payload = {
        title: "시험",
        inputMode: "percent" as const,
        kind: "TEST" as const,
        examDate: date,
      };
      const created = await createExam(courseId, payload);
      await refreshExams({ selectId: created.id });
      setSelectedExamId(String(created.id));
      setGradeView("scores");
      setExamCreateOk(true);
      window.setTimeout(() => setExamCreateOk(false), 1500);
    } catch (e) {
      setExamFormError(readableError(e, "시험 생성에 실패했습니다."));
    } finally {
      setExamFormSaving(false);
    }
  }

  async function handleDeleteSelectedExam() {
    if (!courseId || !selectedExamId) return;
    const exam = exams.find((ex) => String(ex.id) === selectedExamId);
    const name = exam?.title || "선택한 시험";
    const ok = window.confirm(
      `${name}을(를) 삭제할까요?\n관련 성적 데이터도 함께 삭제됩니다. 되돌릴 수 없습니다.`
    );
    if (!ok) return;
    try {
      await deleteExam(courseId, Number(selectedExamId));
      await refreshExams();
      setSelectedExamId("");
      setGradeView("list");
    } catch (e) {
      setExamError(readableError(e, "시험 삭제에 실패했습니다."));
    }
  }

  async function handleCreateExamInline() {
    if (!courseId || examFormSaving) return;
    const title = (examFormTitle || "").trim() || `시험`;
    setExamFormError(null);
    setExamFormSaving(true);
    try {
      const payload = {
        title,
        inputMode: examFormMode,
        kind: "TEST" as const,
        examDate: record?.recordDate || ymd || undefined,
      };
      const created = await createExam(courseId, payload);
      await refreshExams({ selectId: created.id });
      setSelectedExamId(String(created.id));
      setExamFormTitle("");
      setExamFormMode("percent");
      setExamFormError(null);
      setExamModalView("list");
      setGradeView("scores");
      setExamCreateOk(true);
      window.setTimeout(() => setExamCreateOk(false), 2000);
    } catch (e) {
      setExamFormError(readableError(e, "시험 생성에 실패했습니다."));
    } finally {
      setExamFormSaving(false);
    }
  }

  // Load attendance from server when record id is available
  useEffect(() => {
    if (!courseId || !record?.id) return;
    let cancelled = false;
    async function loadAttendance() {
      setAttLoading(true);
      setAttError(null);
      try {
        const list = await listRecordAttendance(courseId!, record!.id);
        if (!cancelled) {
          const m: Record<number, boolean> = {};
          const notes: Record<number, string> = {};
          const names: Record<number, string> = {};
          (list as Attendance[]).forEach((a) => {
            m[a.studentId] = !!a.present;
            if (a.reason) notes[a.studentId] = a.reason;
            if (a.studentName) names[a.studentId] = a.studentName;
          });
          setAttMap(m);
          setAttNoteMap(notes);
          setAttStudentNames(names);
        }
      } catch (error) {
        if (!cancelled)
          setAttError(readableError(error, "출석 정보를 불러오지 못했습니다."));
      } finally {
        if (!cancelled) setAttLoading(false);
      }
    }
    void loadAttendance();
    return () => {
      cancelled = true;
    };
  }, [courseId, record]);

  async function confirmAndSetAttendance(studentId: number, target: boolean) {
    if (courseId && record?.id) {
      // Server update
      setAttSavingMap((m) => ({ ...m, [studentId]: true }));
      try {
        const reason = attNoteMap[studentId]?.trim() || undefined;
        await upsertAttendance(courseId!, record!.id, studentId, {
          present: target,
          reason,
          source: "MANUAL",
        });
        setAttMap((m) => ({ ...m, [studentId]: target }));
        // Invalidate calendars and dashboards to reflect latest attendance
        invalidateCacheByPrefix([
          "/api/calendar/classes",
          "/api/calendar/classes-range",
          "/api/dashboard/summary",
          "/api/dashboard/attendance-today",
          "/api/attendance/daily",
          `/api/courses/${courseId}/records/${record!.id}/attendance`,
        ]);
        emitCalendarClassesRefresh(record?.recordDate ?? ymd ?? undefined);
        try {
          window.dispatchEvent(
            new CustomEvent("dashboard:attendance-refresh", { detail: {} })
          );
        } catch {}
      } catch (error) {
        showError(readableError(error, "출석 처리에 실패했습니다."));
      } finally {
        setAttSavingMap((m) => ({ ...m, [studentId]: false }));
      }
    } else {
      // Local fallback
      setAttendance(studentId, target);
    }
  }

  function promptSetAttendance(studentId: number, target: boolean) {
    setConfirmOne({ open: true, studentId, target });
  }

  function openBulkSelect() {
    if (actionableCount === 0) {
      window.alert("출석 처리할 학생이 없습니다.");
      return;
    }
    const initial: Record<number, boolean> = {};
    actionableRows.forEach((row) => {
      initial[row.id] = row.status !== "present";
    });
    setSelectedIds(initial);
    setBulkDialogOpen(true);
  }

  const selectedCount = useMemo(
    () => Object.values(selectedIds).filter(Boolean).length,
    [selectedIds]
  );

  function cancelBulkDialog() {
    if (bulkStatus) return;
    setBulkDialogOpen(false);
    setSelectedIds({});
  }

  async function confirmBulkSelection() {
    const ids = Object.entries(selectedIds)
      .filter(([, v]) => v)
      .map(([key]) => Number(key));
    if (!ids.length) {
      window.alert("학생을 한 명 이상 선택해 주세요.");
      return;
    }
    const ok = await bulkSetAttendance(true, ids);
    if (ok) {
      setBulkDialogOpen(false);
      setSelectedIds({});
    }
  }

  async function bulkSetAttendance(
    target: boolean,
    targetIds?: number[]
  ): Promise<boolean> {
    const desiredStatus: "present" | "absent" = target ? "present" : "absent";
    const label = target ? "출석" : "결석";
    const baseCandidates = attendanceRows.filter((row) => !row.isExtra);
    const effectiveIds = targetIds ? new Set(targetIds) : null;
    const candidates = baseCandidates.filter((row) => {
      if (effectiveIds && !effectiveIds.has(row.id)) return false;
      return row.status !== desiredStatus;
    });
    if (candidates.length === 0) {
      window.alert(
        targetIds
          ? "선택한 학생은 이미 출석 처리됐습니다."
          : `이미 모든 학생이 ${label} 상태입니다.`
      );
      return false;
    }
    if (!targetIds) {
      const confirmMessage = `총 ${
        candidates.length
      }명의 학생을 ${label} 처리할까요?${
        record?.id ? "\n변경 내용은 즉시 저장됩니다." : ""
      }`;
      if (!window.confirm(confirmMessage)) return false;
    }

    setBulkStatus(desiredStatus);

    let success = false;
    if (courseId && record?.id) {
      setAttSavingMap((m) => {
        const next = { ...m };
        candidates.forEach(({ id }) => {
          next[id] = true;
        });
        return next;
      });
      const succeeded: number[] = [];
      let failure: unknown = null;
      for (const row of candidates) {
        try {
          const reason = attNoteMap[row.id]?.trim() || undefined;
          await upsertAttendance(courseId, record.id, row.id, {
            present: target,
            reason,
            source: "MANUAL",
          });
          succeeded.push(row.id);
        } catch (error) {
          if (!failure) failure = error;
        }
      }
      setAttSavingMap((m) => {
        const next = { ...m };
        candidates.forEach(({ id }) => {
          delete next[id];
        });
        return next;
      });
      if (succeeded.length) {
        setAttMap((prev) => {
          const next = { ...prev };
          succeeded.forEach((id) => {
            next[id] = target;
          });
          return next;
        });
        invalidateCacheByPrefix([
          "/api/calendar/classes",
          "/api/calendar/classes-range",
          "/api/dashboard/summary",
          "/api/dashboard/attendance-today",
          "/api/attendance/daily",
          `/api/courses/${courseId}/records/${record.id}/attendance`,
        ]);
        emitCalendarClassesRefresh(record?.recordDate ?? ymd ?? undefined);
        try {
          window.dispatchEvent(
            new CustomEvent("dashboard:attendance-refresh", { detail: {} })
          );
        } catch {}
        success = true;
      }
      if (failure) {
        showError(
          readableError(failure, `일괄 ${label} 처리 중 일부가 실패했습니다.`)
        );
      }
    } else {
      candidates.forEach(({ id }) => setAttendance(id, target));
      success = candidates.length > 0;
    }

    setBulkStatus(null);
    return success;
  }

  // Load/save local notes when no server record
  useEffect(() => {
    if (!courseId || record?.id) return;
    const key = getLocalAttendanceKey().replace("attendance", "attendanceNote");
    try {
      const parsed = JSON.parse(localStorage.getItem(key) || "{}") as Record<
        string,
        string
      >;
      setAttNoteMap(parsed || {});
    } catch {
      // ignore localStorage errors
    }
  }, [courseId, record?.id, getLocalAttendanceKey]);

  useEffect(() => {
    if (contentFeedback !== "success") return;
    const t = window.setTimeout(() => setContentFeedback("idle"), 2500);
    return () => window.clearTimeout(t);
  }, [contentFeedback]);

  // Attachments helpers: server if record exists; otherwise local fallback keyed by date
  const localAttachKey = useCallback(() => {
    if (!courseId) return `attachments::`;
    if (recId) return `attachments:${courseId}:${recId}`;
    if (ymd) return `attachmentsDate:${courseId}:${ymd}`;
    return `attachments:${courseId}:`;
  }, [courseId, recId, ymd]);
  const getLocalAttachments = useCallback((): {
    name: string;
    size: number;
  }[] => {
    try {
      return JSON.parse(localStorage.getItem(localAttachKey()) || "[]");
    } catch {
      return [];
    }
  }, [localAttachKey]);
  const setLocalAttachments = useCallback(
    (list: { name: string; size: number }[]) => {
      try {
        localStorage.setItem(localAttachKey(), JSON.stringify(list));
      } catch {
        // ignore quota errors
      }
    },
    [localAttachKey]
  );
  function toAttachmentRows(
    list: { name: string; size: number }[]
  ): Attachment[] {
    const now = new Date().toISOString();
    return list.map((item, idx) => ({
      id: -1 - idx,
      filename: item.name,
      size: item.size,
      createdAt: now,
    }));
  }
  useEffect(() => {
    if (!courseId) return;
    let cancelled = false;
    async function loadFiles() {
      setFilesError(null);
      if (record?.id) {
        setFilesLoading(true);
        try {
          const list = await listRecordAttachments(courseId!, record!.id, {
            presign: true,
          });
          if (!cancelled) {
            setFiles(list);
            // Preload thumbnails for images (best-effort)
            void preloadThumbs(list);
          }
        } catch (error) {
          if (!cancelled)
            setFilesError(readableError(error, "첨부를 불러오지 못했습니다."));
        } finally {
          if (!cancelled) setFilesLoading(false);
        }
      } else {
        // local fallback
        const local = getLocalAttachments();
        const now = new Date().toISOString();
        const mapped: Attachment[] = local.map((x, i) => ({
          id: -1 - i,
          filename: x.name,
          size: x.size,
          createdAt: now,
        }));
        setFiles(mapped);
      }
    }
    void loadFiles();
    return () => {
      cancelled = true;
    };
  }, [courseId, record, recId, ymd, getLocalAttachments]);
  function filterIncoming(filesList: FileList | File[]) {
    const all = Array.from(filesList);
    const sized = all.filter((f) => f.size <= MAX_FILE_SIZE);
    const rejectedSize = all.filter((f) => f.size > MAX_FILE_SIZE);
    const accepted = sized.filter((f) => !f.type || ALLOWED_MIME.has(f.type));
    const rejectedType = sized.filter(
      (f) => f.type && !ALLOWED_MIME.has(f.type)
    );
    if (rejectedSize.length > 0)
      setFilesError(
        `용량 제한(${MAX_FILE_SIZE_MB}MB)을 초과한 파일 제외: ${rejectedSize
          .map((f) => f.name)
          .join(", ")}`
      );
    else setFilesError(null);
    if (rejectedType.length > 0)
      setFilesError((prev) =>
        [
          prev,
          `허용되지 않는 형식 제외: ${rejectedType
            .map((f) => f.name)
            .join(", ")}`,
        ]
          .filter(Boolean)
          .join(" / ")
      );
    return accepted;
  }
  async function startUpload(accepted: File[]) {
    if (accepted.length === 0) return;
    if (!(courseId && record?.id)) {
      // local fallback
      const prev = getLocalAttachments();
      const next = [
        ...prev,
        ...accepted.map((f) => ({ name: f.name, size: f.size })),
      ];
      setLocalAttachments(next);
      setFiles(toAttachmentRows(next));
      return;
    }
    // limit concurrency for smoother UI
    const MAX_FILES = 8;
    const CONCURRENCY = 3;
    const send = accepted.slice(0, MAX_FILES);
    const omitted = accepted.length - send.length;
    if (omitted > 0)
      setFilesError((prev) =>
        [
          prev,
          `최대 ${MAX_FILES}개까지만 업로드됩니다 (추가 ${omitted}개 제외)`,
        ]
          .filter(Boolean)
          .join(" / ")
      );
    // queue items
    const newItems: UploadQueueItem[] = send.map((f, i) => ({
      id: `${Date.now()}-${i}-${Math.random().toString(36).slice(2, 8)}`,
      name: f.name,
      size: f.size,
      progress: 0,
      status: "pending",
    }));
    setUploadQueue((q) => [...newItems, ...q]);
    const created: Attachment[] = [];
    let idx = 0;
    async function uploadOne(index: number) {
      const f = send[index];
      const qid = newItems[index].id;
      // 1) presign
      const pres = await presignRecordAttachment(
        courseId!,
        record!.id,
        f.name,
        f.type || "application/octet-stream"
      );
      // 2) PUT with progress via XHR
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", pres.url, true);
        for (const [k, v] of Object.entries(pres.headers || {})) {
          try {
            xhr.setRequestHeader(k, v as string);
          } catch {}
        }
        setUploadQueue((q) =>
          q.map((it) =>
            it.id === qid ? { ...it, status: "uploading", progress: 0 } : it
          )
        );
        xhr.upload.onprogress = (ev) => {
          if (ev.lengthComputable) {
            const pct = Math.max(
              1,
              Math.min(99, Math.round((ev.loaded / ev.total) * 100))
            );
            setUploadQueue((q) =>
              q.map((it) => (it.id === qid ? { ...it, progress: pct } : it))
            );
          }
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            setUploadQueue((q) =>
              q.map((it) => (it.id === qid ? { ...it, progress: 100 } : it))
            );
            resolve();
          } else {
            const err = `S3 업로드 실패: HTTP ${xhr.status}`;
            setUploadQueue((q) =>
              q.map((it) =>
                it.id === qid ? { ...it, status: "error", error: err } : it
              )
            );
            reject(new Error(err));
          }
        };
        xhr.onerror = () => {
          const err = "S3 업로드 중 네트워크 오류";
          setUploadQueue((q) =>
            q.map((it) =>
              it.id === qid ? { ...it, status: "error", error: err } : it
            )
          );
          reject(new Error(err));
        };
        xhr.send(f);
      });
      // 3) confirm
      const etag: string | undefined = undefined; // ETag는 S3 CORS ExposeHeaders 설정 시 접근 가능
      // XHR로는 헤더 접근이 제한될 수 있어 여기서는 생략; presigned GET 없이도 confirm 가능
      const meta = await confirmRecordAttachment(courseId!, record!.id, {
        key: pres.key,
        filename: f.name,
        contentType: f.type || "application/octet-stream",
        size: f.size,
        etag,
        originalName: f.name,
      });
      created.push(meta);
      setUploadQueue((q) =>
        q.map((it) =>
          it.id === qid ? { ...it, status: "done", progress: 100 } : it
        )
      );
    }
    const workers = Array.from(
      { length: Math.min(CONCURRENCY, send.length) },
      async () => {
        while (idx < send.length) {
          const cur = idx++;
          try {
            await uploadOne(cur);
          } catch (e) {
            /* already marked in queue */
          }
        }
      }
    );
    await Promise.all(workers);
    if (created.length) {
      setFiles((prev) => [...created, ...prev]);
      void preloadThumbs(created);
    }
    // cleanup finished items after short delay
    setTimeout(
      () =>
        setUploadQueue((q) =>
          q.filter((it) => it.status !== "done" && it.status !== "error")
        ),
      2500
    );
  }
  async function onUpload(filesList: FileList | null) {
    if (!filesList) return;
    const accepted = filterIncoming(filesList);
    await startUpload(accepted);
  }
  const onDropFiles = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const items = e.dataTransfer?.files;
    if (!items || items.length === 0) return;
    const accepted = filterIncoming(items);
    await startUpload(accepted);
  };
  async function preloadThumbs(list: Attachment[]) {
    // Only for images; best-effort with small concurrency
    const imgs = list.filter((f) => (f.contentType || "").startsWith("image/"));
    const limit = 3;
    let idx = 0;
    const run = async () => {
      while (idx < imgs.length) {
        const cur = imgs[idx++];
        if (thumbUrl[cur.id]) continue; // already loaded
        try {
          setPreviewBusy((m) => ({ ...m, [cur.id]: true }));
          // Prefer downloadUrl from list; fallback to a one-off presigned GET
          const url =
            cur.downloadUrl ||
            (
              await getRecordAttachmentDownloadUrl(
                courseId!,
                record!.id,
                cur.id
              )
            ).url;
          setThumbUrl((m) => ({ ...m, [cur.id]: url }));
        } catch {
          // ignore preview failures
        } finally {
          setPreviewBusy((m) => ({ ...m, [cur.id]: false }));
        }
      }
    };
    await Promise.all(
      Array.from({ length: Math.min(limit, imgs.length) }, () => run())
    );
  }
  useEffect(() => {
    return () => {
      // Revoke object URLs on unmount
      Object.values(thumbUrl).forEach((u) => {
        try {
          URL.revokeObjectURL(u);
        } catch {}
      });
    };
  }, []);
  async function openAttachment(f: Attachment) {
    if (!courseId || !record?.id) return;
    try {
      setPreviewBusy((m) => ({ ...m, [f.id]: true }));
      // Prefer presigned GET if available
      const maybeUrl = f.downloadUrl;
      if (maybeUrl) {
        window.open(maybeUrl, "_blank", "noopener");
        return;
      }
      // fallback to API-proxied download URL
      const { url } = await getRecordAttachmentDownloadUrl(
        courseId!,
        record!.id,
        f.id
      );
      window.open(url, "_blank", "noopener");
    } catch (err) {
      showError(readableError(err, "파일을 열 수 없습니다."));
    } finally {
      setPreviewBusy((m) => ({ ...m, [f.id]: false }));
    }
  }
  async function onDeleteFile(fileId: number, name?: string) {
    const msg = name
      ? `"${name}" 파일을 삭제합니다. 되돌릴 수 없습니다.`
      : "선택한 파일을 삭제합니다. 되돌릴 수 없습니다.";
    const confirmed = window.confirm(msg);
    if (!confirmed) return;
    if (courseId && record?.id) {
      setFileBusy((m) => ({ ...m, [fileId]: true }));
      try {
        await deleteRecordAttachment(courseId!, record!.id, fileId);
        setFiles((prev) => prev.filter((f) => f.id !== fileId));
      } catch (error) {
        showError(readableError(error, "삭제에 실패했습니다."));
      } finally {
        setFileBusy((m) => ({ ...m, [fileId]: false }));
      }
    } else {
      const prev = getLocalAttachments();
      const next = prev.filter((x) => x.name !== name);
      setLocalAttachments(next);
      setFiles(toAttachmentRows(next));
    }
  }

  // Save helpers
  async function saveField(
    patch: Partial<
      Pick<CourseRecord, "content" | "recordDate" | "startTime" | "endTime">
    >,
    key: keyof typeof saving
  ) {
    if (!courseId || !record?.id) return;
    if (key === "content") setContentFeedback("idle");
    setSaving((s) => ({ ...s, [key]: true }));
    try {
      const updated = await updateCourseRecord(courseId!, record!.id, patch);
      setRecord(updated);
      // Reflect updated record immediately in dashboard classes
      invalidateCacheByPrefix("/api/calendar/classes");
      invalidateCacheByPrefix("/api/calendar/classes-range");
      if (key === "content") setContentFeedback("success");
    } catch (error) {
      showError(readableError(error, "저장에 실패했습니다."));
    } finally {
      setSaving((s) => ({ ...s, [key]: false }));
    }
  }

  async function savePerformance() {
    if (!courseId || !record?.id) return;
    const numericScore =
      performanceScore === "" ? null : Number(performanceScore);
    if (numericScore != null && Number.isNaN(numericScore)) {
      showError("성과 점수는 숫자로 입력해 주세요.");
      return;
    }
    setPerformanceSaving(true);
    try {
      const updated = await updateCourseRecord(courseId, record.id, {
        performanceScore: numericScore,
        performanceNote: performanceNote.trim().length ? performanceNote : null,
      });
      setRecord(updated);
      setPerformanceFeedback("success");
      invalidateCacheByPrefix("/api/calendar/classes");
    } catch (error) {
      showError(readableError(error, "성과를 저장하지 못했습니다."));
    } finally {
      setPerformanceSaving(false);
    }
  }
  function toHHMM(t?: string) {
    if (!t) return "";
    const [h, m] = t.split(":");
    return `${h}:${m}`;
  }
  function toHHMMSS(t?: string) {
    if (!t) return undefined;
    const parts = t.split(":");
    if (parts.length >= 3)
      return `${parts[0].padStart(2, "0")}:${parts[1].padStart(
        2,
        "0"
      )}:${parts[2].padStart(2, "0")}`;
    if (parts.length === 2)
      return `${parts[0].padStart(2, "0")}:${parts[1].padStart(2, "0")}:00`;
    return undefined;
  }
  async function saveWhen() {
    if (!courseId) return;
    const payload: {
      recordDate: string;
      startTime?: string;
      endTime?: string;
    } = {
      recordDate: editDate || ymd || "",
      startTime: toHHMMSS(editStart),
      endTime: toHHMMSS(editEnd),
    };
    // If server record exists, update; otherwise create and set state
    setWhenError(null);
    if (record?.id) {
      await saveField(payload, "when");
      setEditingWhen(false);
      return;
    }
    // Create new record for this date
    setSaving((s) => ({ ...s, when: true }));
    try {
      const created = await createCourseRecord(courseId, payload);
      setRecord(created);
      setEditingWhen(false);
      // New record may appear in dashboard classes
      invalidateCacheByPrefix("/api/calendar/classes");
      invalidateCacheByPrefix("/api/calendar/classes-range");
    } catch (error) {
      const msg = readableError(error, "");
      if (msg.includes("HTTP 409"))
        setWhenError("이미 등록된 수업이 있습니다.");
      else setWhenError("기록 생성에 실패했습니다.");
    } finally {
      setSaving((s) => ({ ...s, when: false }));
    }
  }

  return (
    <Wrap>
      <Head>
        <BackBtn type="button" onClick={() => navigate(`/classes/${courseId}`)}>
          {leftIcon} 뒤로
        </BackBtn>
        <HeadTitle>
          {headLoading ? (
            <UISkeleton w={220} h={26} />
          ) : (
            <h2 style={{ margin: 0 }}>{course?.title || "수업 내역 상세"}</h2>
          )}
          <WhenMeta>
            {headLoading ? (
              <>
                <UISkeleton w={120} h={20} />
                <UISkeleton w={100} h={18} />
              </>
            ) : (
              <>
                <DateBadge data-empty={String(!whenInfo.hasDate)}>
                  {whenInfo.dateLabel}
                </DateBadge>
                <TimePill data-empty={String(!whenInfo.hasTime)}>
                  {whenInfo.timeLabel}
                </TimePill>
              </>
            )}
          </WhenMeta>
        </HeadTitle>
        <HeadRight>
          <UIGhostBtn to={`/classes/${courseId}`} title="수업으로">
            수업으로
          </UIGhostBtn>
          {headLoading ? (
            <UISkeleton w={88} h={32} />
          ) : (
            record?.id && (
              <UIGhostButton
                type="button"
                data-variant="danger"
                onClick={() => setConfirmDeleteOpen(true)}
              >
                삭제
              </UIGhostButton>
            )
          )}
        </HeadRight>
      </Head>
      <ConfirmDialog
        open={confirmDeleteOpen}
        title="수업 내역 삭제"
        message={
          "이 수업 내역을 삭제할까요?\n첨부/출결/파일도 함께 삭제됩니다. 되돌릴 수 없습니다."
        }
        confirmLabel="영구 삭제"
        cancelLabel="취소"
        tone="danger"
        busy={confirmBusy}
        onCancel={() => {
          if (!confirmBusy) setConfirmDeleteOpen(false);
        }}
        onConfirm={async () => {
          if (!courseId || !record?.id) return;
          setConfirmBusy(true);
          try {
            await deleteCourseRecord(courseId, record.id);
            invalidateCacheByPrefix([
              "/api/calendar/classes",
              "/api/calendar/classes-range",
              `/api/courses/${courseId}`,
              `/api/courses/${courseId}/records`,
            ]);
            setConfirmDeleteOpen(false);
            navigate(`/classes/${courseId}/history`);
          } catch (error) {
            showError(readableError(error, "삭제에 실패했습니다."));
          } finally {
            setConfirmBusy(false);
          }
        }}
      />
      <ConfirmDialog
        open={confirmOne.open}
        title="출결 처리 확인"
        message={(() => {
          const sid = confirmOne.studentId;
          const tgt = confirmOne.target;
          const sName =
            sid != null
              ? students.find((s) => s.id === sid)?.name || `학생#${sid}`
              : "학생";
          const label = tgt ? "출석" : "결석";
          return `${sName}을(를) ${label} 처리하시겠어요?`;
        })()}
        confirmLabel="확인"
        cancelLabel="취소"
        tone="default"
        busy={false}
        onCancel={() =>
          setConfirmOne({ open: false, studentId: null, target: null })
        }
        onConfirm={async () => {
          const sid = confirmOne.studentId;
          const tgt = confirmOne.target;
          setConfirmOne({ open: false, studentId: null, target: null });
          if (sid == null || tgt == null) return;
          await confirmAndSetAttendance(sid, tgt);
        }}
      />
      <ConfirmDialog
        open={bulkDialogOpen}
        title="선택 출석 처리"
        message={
          <BulkDialogBody>
            <p>출석 처리할 학생을 선택하세요.</p>
            <BulkList>
              {actionableRows.map((row) => {
                const disabled = row.status === "present";
                return (
                  <BulkItem key={row.id} data-disabled={String(disabled)}>
                    <input
                      type="checkbox"
                      checked={selectedIds[row.id] || false}
                      onChange={(e) => {
                        const targetInput = e.target as HTMLInputElement | null;
                        if (!targetInput) return;
                        const { checked } = targetInput;
                        setSelectedIds((prev) => ({
                          ...prev,
                          [row.id]: checked,
                        }));
                      }}
                      disabled={disabled || bulkStatus !== null}
                    />
                    <span className="name">{row.name}</span>
                    <span className="status">
                      {row.status === "present"
                        ? "이미 출석"
                        : row.status === "absent"
                        ? "결석"
                        : "미처리"}
                    </span>
                  </BulkItem>
                );
              })}
            </BulkList>
            <BulkFooter>
              <span>선택된 학생: {selectedCount}명</span>
            </BulkFooter>
          </BulkDialogBody>
        }
        confirmLabel="출석 처리"
        cancelLabel="취소"
        onCancel={cancelBulkDialog}
        onConfirm={() => {
          if (!bulkStatus) void confirmBulkSelection();
        }}
        busy={bulkStatus === "present"}
        hideCancel={false}
      />
      {error && <AlertError>{error}</AlertError>}
      {loading && !headLoading && <Muted>불러오는 중...</Muted>}

      {/* KPIs removed for a simpler layout */}

      <QuickStats>
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <StatCard key={`stat-skeleton-${index}`}>
              <UISkeleton w={"40%"} h={12} />
              <UISkeleton w={"60%"} h={22} mt={6} />
              <UISkeleton w={"50%"} h={10} mt={6} />
            </StatCard>
          ))
        ) : (
          <>
            <StatCard data-tone="primary">
              <span className="label">출석률</span>
              <strong>
                {summaryRate != null ? `${summaryRate}%` : "미집계"}
              </strong>
              <SmallMuted>
                {actionableTotal ? `대상 ${actionableTotal}명` : "대상 없음"}
              </SmallMuted>
            </StatCard>
            <StatCard data-tone="success">
              <span className="label">출석</span>
              <strong>{actionablePresent}명</strong>
              <SmallMuted>
                {actionableTotal ? `전체의 ${presentShare}%` : "기록 없음"}
              </SmallMuted>
            </StatCard>
            <StatCard data-tone="danger">
              <span className="label">결석</span>
              <strong>{actionableAbsent}명</strong>
              <SmallMuted>
                {actionableTotal ? `전체의 ${absentShare}%` : "기록 없음"}
              </SmallMuted>
            </StatCard>
            <StatCard data-tone={actionableNone === 0 ? "muted" : "warning"}>
              <span className="label">미처리</span>
              <strong>{actionableNone}명</strong>
              <SmallMuted>
                {actionableNone === 0
                  ? "모두 처리 완료"
                  : `전체의 ${noneShare}%`}
              </SmallMuted>
            </StatCard>
          </>
        )}
      </QuickStats>

      {/* Simplified layout: Info, When(editable), Content, Files, Attendance */}

      <Columns>
        <Left>
          <Section>
            <SectionHeader>
              <Title>수업 정보</Title>
              {!editingWhen ? (
                <SmallBtn
                  data-variant="edit"
                  onClick={() => setEditingWhen(true)}
                >
                  수정
                </SmallBtn>
              ) : (
                <div
                  style={{
                    display: "inline-flex",
                    gap: 8,
                    alignItems: "center",
                  }}
                >
                  <SmallBtn
                    onClick={() => {
                      void saveWhen();
                    }}
                    disabled={!!saving.when}
                  >
                    저장
                  </SmallBtn>
                  <SmallBtn
                    onClick={() => {
                      setEditingWhen(false);
                      setEditDate(record?.recordDate || ymd || "");
                      setEditStart(
                        toHHMM(record?.startTime || course?.startTime || "")
                      );
                      setEditEnd(
                        toHHMM(record?.endTime || course?.endTime || "")
                      );
                    }}
                  >
                    취소
                  </SmallBtn>
                </div>
              )}
            </SectionHeader>
            {!editingWhen ? (
              <InfoList>
                <li>
                  <Label>수업일</Label>
                  {headLoading ? (
                    <Value>
                      <UISkeleton w={140} h={14} />
                    </Value>
                  ) : (
                    <StrongValue>{record?.recordDate || "-"}</StrongValue>
                  )}
                </li>
                <li>
                  <Label>수업시간</Label>
                  {headLoading ? (
                    <Value>
                      <UISkeleton w={160} h={14} />
                    </Value>
                  ) : (
                    <StrongValue>
                      {formatRange(
                        record?.startTime || course?.startTime,
                        record?.endTime || course?.endTime
                      ) || "-"}
                    </StrongValue>
                  )}
                </li>
                <li>
                  <Label>진행 시간</Label>
                  {headLoading ? (
                    <Value>
                      <UISkeleton w={90} h={14} />
                    </Value>
                  ) : (
                    <StrongValue>{durationLabel}</StrongValue>
                  )}
                </li>
              </InfoList>
            ) : (
              <InfoList>
                <li>
                  <Label>날짜</Label>
                  <Value>
                    <Input
                      type="date"
                      value={editDate || ""}
                      onChange={(e) => setEditDate(e.currentTarget.value)}
                    />
                  </Value>
                </li>
                <li>
                  <Label>시간</Label>
                  <Value
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <Input
                      type="time"
                      step={300}
                      value={editStart || ""}
                      onChange={(e) => setEditStart(e.currentTarget.value)}
                    />
                    <span>~</span>
                    <Input
                      type="time"
                      step={300}
                      value={editEnd || ""}
                      onChange={(e) => setEditEnd(e.currentTarget.value)}
                    />
                  </Value>
                </li>
                <PreviewRow>
                  <PreviewLabel>미리보기</PreviewLabel>
                  <PreviewMeta>
                    <DateBadge
                      data-empty={String(
                        !(editDate || record?.recordDate || ymd)
                      )}
                    >
                      {formatDateBadge(
                        editDate || record?.recordDate || ymd || ""
                      )}
                    </DateBadge>
                    <TimePill data-empty={String(!(editStart && editEnd))}>
                      {editStart && editEnd
                        ? formatRange(editStart, editEnd)
                        : "시간 미지정"}
                    </TimePill>
                  </PreviewMeta>
                </PreviewRow>
                <RowHelp>
                  {!record?.id && (
                    <Hint>저장 시 새 수업 내역을 생성합니다.</Hint>
                  )}
                  {saving.when && <SmallMuted>저장 중...</SmallMuted>}
                  {whenError && (
                    <AlertError style={{ marginLeft: 8 }}>
                      {whenError}
                    </AlertError>
                  )}
                </RowHelp>
              </InfoList>
            )}
          </Section>
          {/* 성과 기록(개별 수업) 섹션 제거 */}

          {/* Content */}
          <Section>
            <SectionHeader>
              <Title>수업 내용</Title>
              {record?.id ? (
                <ContentActions>
                  {contentFeedback === "success" && !saving.content && (
                    <SuccessBadge role="status">저장 완료!</SuccessBadge>
                  )}
                  <SmallBtn
                    onClick={() => {
                      void saveField({ content: contentValue }, "content");
                    }}
                    disabled={!!saving.content}
                  >
                    저장
                  </SmallBtn>
                  {saving.content && <SmallMuted>저장 중...</SmallMuted>}
                </ContentActions>
              ) : null}
            </SectionHeader>
            {record?.id ? (
              <TextArea
                rows={8}
                value={contentValue}
                onChange={(e) => {
                  setContentValue(e.currentTarget.value);
                  setContentFeedback("idle");
                }}
                placeholder="수업 내용을 입력하세요"
                id="contentArea"
              />
            ) : (
              <Muted>
                서버 기록이 없는 일정입니다. 생성 후 편집 가능합니다.
              </Muted>
            )}
          </Section>

          {/* Files */}
          <Section>
            <SectionHeader>
              <Title>수업 파일</Title>
              <label
                style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
              >
                <UIPrimaryButtonSm as="span">파일 추가</UIPrimaryButtonSm>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  multiple
                  style={{ display: "none" }}
                  onChange={(e) => {
                    void onUpload(e.currentTarget.files);
                    e.currentTarget.value = "";
                  }}
                />
              </label>
            </SectionHeader>
            <DropArea
              onDragOver={(e) => {
                e.preventDefault();
              }}
              onDrop={onDropFiles}
            >
              <span className="hint">
                여기로 파일을 끌어다 놓거나 ‘파일 추가’를 누르세요
              </span>
            </DropArea>
            {uploadQueue.length > 0 && (
              <UploadQueue>
                {uploadQueue.map((u) => (
                  <QueueItem key={u.id}>
                    <div className="meta">
                      <span className="name" title={u.name}>
                        {u.name}
                      </span>
                      <span className="size">
                        {Math.round(u.size / 1024)} KB
                      </span>
                      <span className="status">
                        {u.status === "uploading"
                          ? "업로드 중"
                          : u.status === "done"
                          ? "완료"
                          : u.status === "error"
                          ? "오류"
                          : "대기"}
                      </span>
                    </div>
                    <div className="bar">
                      <i style={{ width: `${u.progress}%` }} />
                    </div>
                    {u.error && <SmallMuted>{u.error}</SmallMuted>}
                  </QueueItem>
                ))}
              </UploadQueue>
            )}
            {filesError && <AlertError>{filesError}</AlertError>}
            {filesLoading && <Muted>불러오는 중...</Muted>}
            {files.length === 0 ? (
              <AttachEmpty>첨부 없음</AttachEmpty>
            ) : (
              <AttachGrid>
                {files.map((f) => {
                  const isImg = (f.contentType || "").startsWith("image/");
                  const isPdf =
                    (f.contentType || "") === "application/pdf" ||
                    /\.pdf$/i.test(f.filename);
                  const url = thumbUrl[f.id];
                  return (
                    <AttachCard key={f.id}>
                      <ThumbArea>
                        {isImg ? (
                          url ? (
                            <ThumbImg src={url} alt={f.filename} />
                          ) : (
                            <ThumbPlaceholder>이미지</ThumbPlaceholder>
                          )
                        ) : isPdf ? (
                          <ThumbPlaceholder>PDF</ThumbPlaceholder>
                        ) : (
                          <ThumbPlaceholder>FILE</ThumbPlaceholder>
                        )}
                      </ThumbArea>
                      <AttachMeta title={f.filename}>
                        <span className="name">{f.filename}</span>
                        <span className="size">
                          {Math.round(f.size / 1024)} KB
                        </span>
                      </AttachMeta>
                      <AttachActions>
                        <SmallBtn
                          onClick={() => void openAttachment(f)}
                          disabled={!!previewBusy[f.id]}
                        >
                          보기
                        </SmallBtn>
                        <SmallBtn
                          data-variant="danger"
                          disabled={!!fileBusy[f.id]}
                          onClick={() => void onDeleteFile(f.id, f.filename)}
                        >
                          삭제
                        </SmallBtn>
                      </AttachActions>
                    </AttachCard>
                  );
                })}
              </AttachGrid>
            )}
            {!record?.id && <Hint>서버 기록이 없어 로컬에만 저장됩니다.</Hint>}
            <Hint>
              파일 크기 제한: 최대 {MAX_FILE_SIZE_MB}MB (이미지/PDF만 허용)
            </Hint>
            <Hint>
              원본파일이 클 경우 파일 인코딩을 통해 용량을 줄인 후 업로드
              해주세요.
            </Hint>
          </Section>
        </Left>
        <Right>
          <TopTabs>
            <TabBar>
              <TabBtn
                data-active={String(rightTab === "attendance")}
                onClick={() => setRightTab("attendance")}
              >
                출결 현황
              </TabBtn>
              <TabBtn
                data-active={String(rightTab === "grades")}
                onClick={() => setRightTab("grades")}
              >
                시험/테스트
              </TabBtn>
            </TabBar>
          </TopTabs>
          <Section>
            <AttSticky>
              <SectionHeader>
                <HeaderText>
                  <Title>
                    {rightTab === "attendance" ? "출결 현황" : "시험/테스트"}
                  </Title>
                  {rightTab === "attendance" ? (
                    <Muted>
                      학생별 출석 상태를 수동으로 처리하세요. 변경 시 확인 창이
                      표시됩니다.
                    </Muted>
                  ) : (
                    <Muted> </Muted>
                  )}
                </HeaderText>
                {rightTab === "attendance" && (
                  <BulkActions>
                    <SmallBtn
                      type="button"
                      onClick={() => {
                        if (!bulkStatus && !attLoading)
                          void bulkSetAttendance(true);
                      }}
                      disabled={
                        bulkStatus !== null ||
                        attLoading ||
                        actionableCount === 0
                      }
                    >
                      전체 출석
                    </SmallBtn>
                    <SmallBtn
                      type="button"
                      onClick={openBulkSelect}
                      disabled={
                        bulkStatus !== null ||
                        attLoading ||
                        actionableCount === 0
                      }
                    >
                      선택 출석
                    </SmallBtn>
                    {bulkStatus && <SmallMuted>일괄 출석 처리 중…</SmallMuted>}
                  </BulkActions>
                )}
                {rightTab === "grades" && (
                  <BulkActions>
                    {examCreateOk && (
                      <SuccessBadge role="status">시험 생성됨</SuccessBadge>
                    )}
                    {!selectedExamId && exams.length === 0 && (
                      <UIPrimaryButtonSm
                        type="button"
                        onClick={() => {
                          void quickCreateExamPercent();
                        }}
                        disabled={examLoading || examFormSaving}
                      >
                        시험 생성
                      </UIPrimaryButtonSm>
                    )}
                    {!selectedExamId && exams.length > 0 && (
                      <UIPrimaryButtonSm
                        type="button"
                        onClick={() => openExamModal("list")}
                        disabled={examLoading}
                      >
                        시험 선택
                      </UIPrimaryButtonSm>
                    )}
                    {!!selectedExamId && (
                      <UIGhostButton
                        type="button"
                        data-variant="danger"
                        onClick={() => {
                          void handleDeleteSelectedExam();
                        }}
                        disabled={examLoading}
                      >
                        삭제
                      </UIGhostButton>
                    )}
                  </BulkActions>
                )}
              </SectionHeader>
            </AttSticky>
            {rightTab === "attendance" ? (
              <>
                {!record?.id && (
                  <Hint>서버 기록이 없어 출석 정보가 로컬에만 저장됩니다.</Hint>
                )}
                {attLoading && <Muted>출석 불러오는 중...</Muted>}
                {attError && <AlertError>{attError}</AlertError>}
                <List>
                  {filteredAttendanceRows.length === 0 ? (
                    <EmptyHint>
                      {attendanceRows.length === 0
                        ? "등록된 학생이 없습니다."
                        : hasAttendanceFilter
                        ? "조건에 맞는 학생이 없습니다."
                        : "아직 출결 기록이 없습니다."}
                    </EmptyHint>
                  ) : (
                    filteredAttendanceRows.map((row) => {
                      const status = row.status;
                      const has = status !== "none";
                      const present = status === "present";
                      const isSaving =
                        !!attSavingMap[row.id] || bulkStatus !== null;
                      return (
                        <Item key={row.id}>
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <strong>{row.name}</strong>
                            {row.isExtra && (
                              <SmallMuted style={{ marginLeft: 8 }}>
                                (과거 수강생)
                              </SmallMuted>
                            )}
                            <Processed data-type={status}>
                              {status === "present"
                                ? "출석"
                                : status === "absent"
                                ? "결석"
                                : "미처리"}
                            </Processed>
                          </div>
                          <RowRight>
                            <NoteInput
                              placeholder="메모"
                              value={attNoteMap[row.id] || ""}
                              onChange={(e) => {
                                const v = e.currentTarget.value;
                                setAttNoteMap((prev) => ({
                                  ...prev,
                                  [row.id]: v,
                                }));
                                if (courseId) {
                                  const key = getLocalAttendanceKey().replace(
                                    "attendance",
                                    "attendanceNote"
                                  );
                                  try {
                                    const obj = JSON.parse(
                                      localStorage.getItem(key) || "{}"
                                    );
                                    obj[String(row.id)] = v;
                                    localStorage.setItem(
                                      key,
                                      JSON.stringify(obj)
                                    );
                                  } catch {
                                    // ignore local persistence failure
                                  }
                                }
                                if (courseId && record?.id && has) {
                                  const timers = noteTimersRef.current;
                                  if (timers[row.id])
                                    window.clearTimeout(timers[row.id]);
                                  timers[row.id] = window.setTimeout(
                                    async () => {
                                      setAttSavingMap((m) => ({
                                        ...m,
                                        [row.id]: true,
                                      }));
                                      try {
                                        const reason =
                                          (v || "").trim() || undefined;
                                        await upsertAttendance(
                                          courseId!,
                                          record!.id,
                                          row.id,
                                          {
                                            present: present === true,
                                            reason,
                                            source: "MANUAL",
                                          }
                                        );
                                      } catch (err) {
                                        console.error(
                                          "메모 자동 저장 실패",
                                          err
                                        );
                                      } finally {
                                        setAttSavingMap((m) => ({
                                          ...m,
                                          [row.id]: false,
                                        }));
                                      }
                                    },
                                    600
                                  );
                                }
                              }}
                              disabled={isSaving}
                            />
                            <AttSeg>
                              <AttBtn
                                data-active={String(has && present === true)}
                                onClick={() => {
                                  if (!isSaving && status !== "present")
                                    promptSetAttendance(row.id, true);
                                }}
                                disabled={isSaving}
                              >
                                출석
                              </AttBtn>
                              <AttBtn
                                data-variant="danger"
                                data-active={String(has && present === false)}
                                onClick={() => {
                                  if (!isSaving && status !== "absent")
                                    promptSetAttendance(row.id, false);
                                }}
                                disabled={isSaving}
                              >
                                결석
                              </AttBtn>
                            </AttSeg>
                            <SmallBtn
                              title={
                                record?.id
                                  ? "서버 기록은 미처리로 되돌릴 수 없습니다."
                                  : "미처리로 초기화"
                              }
                              onClick={() => {
                                if (!record?.id) clearAttendanceLocal(row.id);
                              }}
                              disabled={!!record?.id || isSaving}
                            >
                              미처리
                            </SmallBtn>
                            {isSaving && <SmallMuted>저장 중...</SmallMuted>}
                          </RowRight>
                        </Item>
                      );
                    })
                  )}
                </List>
              </>
            ) : (
              <GradesWrapper data-view={gradeView}>
                {gradeView === "intro" && (
                  <GradesIntro>
                    <IntroText>
                      출석 학생의 성적을 기록하려면 우측 상단에서 시험을
                      생성하거나 선택하세요.
                    </IntroText>
                    {examLoading && (
                      <SmallMuted>시험 정보를 불러오는 중입니다...</SmallMuted>
                    )}
                    {examError && <AlertError>{examError}</AlertError>}
                  </GradesIntro>
                )}
                {gradeView === "list" && (
                  <GradesList>
                    <GradesListHead>
                      <div>
                        <Title>등록된 시험/테스트</Title>
                        <SmallMuted>이 수업과 연결된 시험입니다.</SmallMuted>
                      </div>
                      <div className="actions" />
                    </GradesListHead>
                    {examLoading ? (
                      <Muted>시험을 불러오는 중입니다...</Muted>
                    ) : examError ? (
                      <AlertError>{examError}</AlertError>
                    ) : (
                      <EmptyHint>
                        우측 상단의 ‘시험 선택’에서 시험을 선택하세요.
                      </EmptyHint>
                    )}
                  </GradesList>
                )}
                {gradeView === "scores" &&
                  (selectedExam ? (
                    <ScorePanel>
                      <ScoreHead>
                        <strong>성적 입력</strong>
                        <div className="right">
                          <ModeBadge
                            data-variant={
                              selectedExam.inputMode === "percent"
                                ? "percent"
                                : "letter"
                            }
                          >
                            {selectedExam.inputMode === "percent"
                              ? "백분율"
                              : "등급"}
                          </ModeBadge>
                          {avgLetter && (
                            <SmallMuted style={{ marginLeft: 8 }}>
                              평균 {avgLetter}
                            </SmallMuted>
                          )}
                          {gradeFeedback === "success" && (
                            <SuccessBadge role="status">
                              저장 완료!
                            </SuccessBadge>
                          )}
                          <UIPrimaryButton
                            type="button"
                            onClick={() => {
                              void saveScoresForPresent();
                            }}
                            disabled={
                              gradeSaving ||
                              scoreStudents.length === 0 ||
                              !hasGradeChanges
                            }
                          >
                            {gradeSaving ? "저장 중…" : "저장"}
                          </UIPrimaryButton>
                          <UISmallBtn
                            type="button"
                            onClick={() => setGradeMap({})}
                            disabled={
                              gradeSaving || Object.keys(gradeMap).length === 0
                            }
                          >
                            초기화
                          </UISmallBtn>
                        </div>
                      </ScoreHead>
                      <ScoreTable>
                        <div className="row head">
                          <span>학생명</span>
                          <span>
                            {selectedExam.inputMode === "percent"
                              ? "점수(0~100)"
                              : "등급"}
                          </span>
                        </div>
                        {scoreStudents.length === 0 ? (
                          <div className="row">
                            <SmallMuted>학생이 없습니다.</SmallMuted>
                          </div>
                        ) : (
                          scoreStudents.map((s) => {
                            const v = gradeMap[s.id] || {};
                            const existing = examResultsMap[s.id];
                            return (
                              <div key={`score2-${s.id}`} className="row">
                                <span className="name">
                                  {s.name}
                                  {gradeMap[s.id] ? (
                                    <ChangedDot title="변경됨" />
                                  ) : null}
                                </span>
                                <span className="control">
                                  {selectedExam.inputMode === "percent" ? (
                                    <ScoreInput
                                      type="number"
                                      min={0}
                                      step={1}
                                      max={100}
                                      value={
                                        v.percent !== undefined
                                          ? v.percent
                                          : existing?.score != null
                                          ? String(existing.score)
                                          : ""
                                      }
                                      placeholder="0~100"
                                      onChange={(e) => {
                                        const raw = e.currentTarget.value;
                                        if (raw === "") {
                                          setGradeMap((m) => ({
                                            ...m,
                                            [s.id]: { percent: "" },
                                          }));
                                          return;
                                        }
                                        const n = Number(raw);
                                        if (!Number.isFinite(n)) return;
                                        const clamped = Math.max(
                                          0,
                                          Math.min(100, Math.round(n))
                                        );
                                        setGradeMap((m) => ({
                                          ...m,
                                          [s.id]: { percent: String(clamped) },
                                        }));
                                      }}
                                      onWheel={(e) =>
                                        (
                                          e.currentTarget as HTMLInputElement
                                        ).blur()
                                      }
                                      onKeyDown={(e) => {
                                        if (
                                          ["e", "E", "+", "-"].includes(e.key)
                                        )
                                          e.preventDefault();
                                      }}
                                      inputMode="numeric"
                                      pattern="[0-9]*"
                                      disabled={gradeSaving}
                                    />
                                  ) : (
                                    <ScoreSelect
                                      value={
                                        v.letter !== undefined
                                          ? v.letter
                                          : existing?.level ?? ""
                                      }
                                      onChange={(e) => {
                                        const raw = e.currentTarget.value;
                                        const val =
                                          raw === ""
                                            ? undefined
                                            : (raw as
                                                | "A"
                                                | "B"
                                                | "C"
                                                | "D"
                                                | "E"
                                                | "F");
                                        setGradeMap((m) => ({
                                          ...m,
                                          [s.id]: { letter: val },
                                        }));
                                      }}
                                      disabled={gradeSaving}
                                    >
                                      <option value="">-</option>
                                      {["A", "B", "C", "D", "E", "F"].map(
                                        (x) => (
                                          <option key={x} value={x}>
                                            {x}
                                          </option>
                                        )
                                      )}
                                    </ScoreSelect>
                                  )}
                                </span>
                              </div>
                            );
                          })
                        )}
                      </ScoreTable>
                    </ScorePanel>
                  ) : (
                    <EmptyHint>시험을 먼저 선택하세요.</EmptyHint>
                  ))}
              </GradesWrapper>
            )}
          </Section>
        </Right>
      </Columns>

      <Modal
        open={examModalOpen}
        title={
          examModalView === "create" ? "시험/테스트 생성" : "시험/테스트 선택"
        }
        onClose={closeExamModal}
        blockOutsideClose
        footer={
          examModalView === "create" ? (
            <>
              <UIGhostButton
                type="button"
                onClick={() => {
                  if (examFormSaving) return;
                  setExamModalView("list");
                  setExamFormError(null);
                }}
                disabled={examFormSaving}
              >
                목록으로
              </UIGhostButton>
              <UIPrimaryButton
                type="button"
                onClick={() => {
                  void handleCreateExamInline();
                }}
                disabled={examFormSaving}
              >
                {examFormSaving ? "생성 중…" : "생성"}
              </UIPrimaryButton>
            </>
          ) : (
            <>
              <UIGhostButton type="button" onClick={closeExamModal}>
                닫기
              </UIGhostButton>
              <UIPrimaryButton
                type="button"
                onClick={handleConfirmExamSelection}
                disabled={!selectedExamId || examLoading}
              >
                선택
              </UIPrimaryButton>
            </>
          )
        }
      >
        {examModalView === "create" ? (
          <CreateForm>
            <label>입력 방식</label>
            <ModeList>
              {EXAM_MODE_OPTIONS.map((option) => {
                const active = examFormMode === option.value;
                return (
                  <ModeOption
                    key={option.value}
                    type="button"
                    data-active={String(active)}
                    onClick={() => setExamFormMode(option.value)}
                    disabled={examFormSaving}
                  >
                    <div className="texts">
                      <strong>{option.label}</strong>
                      <span>{option.description}</span>
                    </div>
                    {active && <span className="indicator">선택됨</span>}
                  </ModeOption>
                );
              })}
            </ModeList>
            <SmallMuted>제목은 일자 기반으로 자동 지정됩니다.</SmallMuted>
            {examFormError && <AlertError>{examFormError}</AlertError>}
          </CreateForm>
        ) : (
          <ModalListBody>
            {examLoading ? (
              <Muted>시험을 불러오는 중입니다...</Muted>
            ) : examError ? (
              <AlertError>{examError}</AlertError>
            ) : exams.length === 0 ? (
              <EmptyHint>등록된 시험이 없습니다.</EmptyHint>
            ) : (
              <ModalListScroller>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginBottom: 8,
                  }}
                >
                  <SearchInput
                    placeholder="시험 검색"
                    value={examQuery}
                    onChange={(e) => setExamQuery(e.currentTarget.value)}
                  />
                </div>
                <ExamList>
                  {filteredExams.map((exam) => {
                    const examIdStr = String(exam.id);
                    const selected = selectedExamId === examIdStr;
                    return (
                      <ExamListItem
                        key={`modal-exam-${exam.id}`}
                        type="button"
                        data-selected={String(selected)}
                        onClick={() => setSelectedExamId(examIdStr)}
                        onDoubleClick={() => handleConfirmExamSelection()}
                        disabled={examLoading}
                      >
                        <div className="meta">
                          <strong>{exam.title}</strong>
                          <span>
                            {exam.inputMode === "percent"
                              ? "백분율 입력"
                              : "등급 입력"}
                          </span>
                        </div>
                        {selected && <span className="indicator">선택됨</span>}
                      </ExamListItem>
                    );
                  })}
                </ExamList>
                {filteredExams.length === 0 && (
                  <SmallMuted>조건에 맞는 시험이 없습니다.</SmallMuted>
                )}
              </ModalListScroller>
            )}
          </ModalListBody>
        )}
      </Modal>
    </Wrap>
  );
}

function hhmm(t?: string) {
  if (!t) return "";
  const [h, m] = t.split(":");
  return `${h}:${m}`;
}
function formatRange(s?: string, e?: string) {
  return s && e ? `${hhmm(s)} ~ ${hhmm(e)}` : "";
}
function formatDateBadge(ymd?: string) {
  if (!ymd) return "일자 미지정";
  const formatted = formatKoreanDate(ymd, {
    includeYear: true,
    includeWeekday: true,
  });
  return formatted === "—" ? ymd : formatted;
}
function getDurationMinutes(s?: string, e?: string) {
  if (!s || !e) return null;
  const [sh, sm] = s.split(":"),
    [eh, em] = e.split(":");
  const start = Number(sh) * 60 + Number(sm);
  const end = Number(eh) * 60 + Number(em);
  const diff = end - start;
  return diff >= 0 ? diff : diff + 24 * 60;
}
function formatDuration(minutes: number | null) {
  if (minutes == null || !Number.isFinite(minutes) || minutes <= 0)
    return "미지정";
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs && mins) return `${hrs}시간 ${mins}분`;
  if (hrs) return `${hrs}시간`;
  return `${mins}분`;
}

const Wrap = styled.div`
  display: grid;
  gap: 12px;
`;
const Head = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 12px;
  align-items: center;
`;
const HeadRight = styled.div`
  display: inline-flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
`;
const HeadTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
`;
const WhenMeta = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;
const DateBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  border-radius: 999px;
  background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
  color: #312e81;
  font-weight: 800;
  font-size: 13px;
  white-space: nowrap;
  &[data-empty="true"] {
    background: #f3f4f6;
    color: #6b7280;
  }
`;
const TimePill = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 999px;
  background: #f9fafb;
  color: #1f2937;
  font-weight: 700;
  font-size: 12px;
  border: 1px solid #e5e7eb;
  white-space: nowrap;
  &[data-empty="true"] {
    color: #6b7280;
    border-color: #e5e7eb;
  }
`;
const QuickStats = styled.div`
  display: grid;
  gap: 8px;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  margin: 4px 0 8px;
  @media (max-width: 640px) {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  }
`;
const StatCard = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px 14px;
  background: #fff;
  display: grid;
  gap: 6px;
  .label {
    font-size: 12px;
    font-weight: 700;
    color: #6b7280;
  }
  strong {
    font-size: 20px;
    font-weight: 800;
    color: #111827;
  }
  &[data-tone="primary"] strong {
    color: #1d4ed8;
  }
  &[data-tone="success"] strong {
    color: #047857;
  }
  &[data-tone="danger"] strong {
    color: #b91c1c;
  }
  &[data-tone="warning"] strong {
    color: #b45309;
  }
  &[data-tone="muted"] strong {
    color: #4b5563;
  }
`;
// removed unused Sub
// KPIGrid removed
const Columns = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;
const Left = styled.div`
  flex: 1 1 0;
  display: grid;
  gap: 10px;
  align-content: flex-start;
  @media (max-width: 1024px) {
    order: 2;
  }
`;
const Right = styled.div`
  flex: 1 1 0;
  display: grid;
  gap: 10px;
  align-content: flex-start;
  @media (max-width: 1024px) {
    order: 1;
  }
`;
// removed segmented tabs; simple two-column layout
const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
`;
const AttSticky = styled.div`
  position: sticky;
  top: 0;
  z-index: 20;
  background: ${(p) => p.theme.colors.surface};
  padding: 4px 0 0 0;
  margin-top: -4px;
  /* remove bottom divider under sticky attendance controls */
  border-bottom: 0;
`;
// Section, Title from common UI
const InfoList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 10px;
  li {
    display: grid;
    grid-template-columns: 110px 1fr;
    align-items: center;
  }
`;
const Label = styled.span`
  color: #6b7280;
  font-size: 12px;
  font-weight: 700;
`;
const Value = styled.div`
  color: #111827;
  font-size: 14px;
  display: flex;
  align-items: center;
  min-height: 20px;
  column-gap: 6px;
`;
const StrongValue = styled(Value)`
  font-weight: 800;
  font-size: 15px;
`;
const PreviewRow = styled.div`
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 10px;
  border: 1px dashed #e5e7eb;
  border-radius: 10px;
  background: #f9fafb;
`;
const PreviewLabel = styled.span`
  color: #6b7280;
  font-size: 12px;
  font-weight: 700;
`;
const PreviewMeta = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
`;
const Input = styled.input`
  height: 32px;
  padding: 0 10px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 13px;
`;
const RowHelp = styled.div`
  grid-column: 1 / -1;
  display: flex;
  gap: 8px;
  align-items: center;
  margin-top: 2px;
`;
const BulkActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing.sm};
  flex-wrap: wrap;
  justify-content: flex-end;
  margin-left: ${(p) => p.theme.spacing.sm};
`;
const List = styled.div`
  display: grid;
  gap: 6px;
`;
const Item = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #fff;
`;
const RowRight = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;
const NoteInput = styled.input`
  height: 26px;
  width: 140px;
  padding: 0 8px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 12px;
  background: #fff;
`;
const AttSeg = styled.div`
  display: inline-flex;
  gap: 6px;
`;
const ContentActions = styled.div`
  display: inline-flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
`;
const SuccessBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 999px;
  background: #d1fae5;
  color: #047857;
  font-size: 11px;
  font-weight: 700;
  &:before {
    content: "✔";
  }
`;
const Toolbar = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  align-items: center;
  margin: 6px 0 6px 0;
`;
const Filters = styled.div`
  display: inline-flex;
  gap: 6px;
  flex-wrap: wrap;
`;
const Pill = styled.button`
  ${buttonVariants.outline};
  height: 30px;
  padding: 0 10px;
  font-size: 12px;
  &[data-active="true"] {
    background: #eef2ff;
    color: #3730a3;
    border-color: #c7d2fe;
  }
  &[data-variant="present"] {
    color: #065f46;
    border-color: #a7f3d0;
    background: #ecfdf5;
  }
  &[data-variant="present"][data-active="true"] {
    background: #d1fae5;
    color: #065f46;
    border-color: #6ee7b7;
  }
  &[data-variant="absent"] {
    color: #b91c1c;
    border-color: #fecaca;
    background: #fee2e2;
  }
  &[data-variant="absent"][data-active="true"] {
    background: #fecaca;
    color: #7f1d1d;
    border-color: #fca5a5;
  }
  &[data-variant="none"] {
    color: #374151;
    border-color: #e5e7eb;
    background: #f3f4f6;
  }
  &[data-variant="none"][data-active="true"] {
    background: #e5e7eb;
    color: #111827;
    border-color: #d1d5db;
  }
`;
const Searcher = styled.div`
  display: inline-flex;
  gap: 6px;
  align-items: center;
`;
const SearchInput = styled.input`
  height: 30px;
  padding: 0 10px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 12px;
`;
const ClearBtn = styled.button`
  ${buttonVariants.outline};
  height: 30px;
  padding: 0 12px;
  font-size: 12px;
`;
/* removed transient attendance summary/sort UI from this page */
const ChangedDot = styled.span`
  display: inline-block;
  width: 6px;
  height: 6px;
  margin-left: 6px;
  border-radius: 50%;
  background: #f59e0b; /* amber */
  vertical-align: middle;
`;
const AttBtn = styled.button`
  ${buttonVariants.base};
  height: 32px;
  padding: 0 12px;
  font-size: 13px;
  background: ${(p) => p.theme.colors.surfaceMuted};
  border: 1px solid ${(p) => p.theme.colors.border};
  color: ${(p) => p.theme.colors.text};
  &:hover:not(:disabled) {
    background: ${(p) => p.theme.colors.surfaceAlt};
  }
  &:active:not(:disabled) {
    transform: translateY(1px);
    background: ${(p) => p.theme.colors.surface};
  }
  &[data-active="true"] {
    background: #ecfdf5;
    border-color: #a7f3d0;
    color: #065f46;
  }
  &[data-variant="danger"] {
    background: ${(p) => p.theme.colors.dangerSurface};
    border-color: ${(p) => p.theme.colors.dangerSurface};
    color: ${(p) => p.theme.colors.danger};
  }
  &[data-variant="danger"][data-active="true"] {
    background: ${(p) => p.theme.colors.danger};
    border-color: ${(p) => p.theme.colors.danger};
    color: ${(p) => p.theme.colors.textInverted};
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
const Processed = styled.span`
  margin-left: 8px;
  padding: 2px 6px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  border: 1px solid #e5e7eb;
  color: #374151;
  background: #f3f4f6;
  &[data-type="present"] {
    background: #ecfdf5;
    color: #065f46;
    border-color: #a7f3d0;
  }
  &[data-type="absent"] {
    background: #fee2e2;
    color: #7f1d1d;
    border-color: #fecaca;
  }
  &[data-type="none"] {
    background: #f3f4f6;
    color: #6b7280;
    border-color: #e5e7eb;
  }
`;
// removed unused BlockTitle
const TextArea = styled.textarea`
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 8px 10px;
  font-size: 14px;
`;
const AttachList = styled.div`
  display: grid;
  gap: 6px;
  margin-top: 6px;
`;
const AttachRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 8px;
  border: 1px solid #f1f5f9;
  border-radius: 8px;
`;
const AttachEmpty = styled.div`
  color: #9ca3af;
  font-size: 13px;
  padding: 12px 0;
`;
const AttachGrid = styled.div`
  display: grid;
  gap: 12px;
  margin-top: 10px;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
`;
const PerformanceGrid = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.md};
`;
const ScoreRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing.sm};
`;
const AttachCard = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fff;
  padding: 10px;
  display: grid;
  gap: 8px;
`;
const ThumbArea = styled.div`
  height: 120px;
  border-radius: 8px;
  background: #f3f4f6;
  display: grid;
  place-items: center;
  overflow: hidden;
`;
const ThumbImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;
const ThumbPlaceholder = styled.div`
  color: #6b7280;
  font-size: 12px;
`;
const AttachMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  .name {
    font-size: 12px;
    color: #111827;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .size {
    font-size: 11px;
    color: #9ca3af;
  }
`;
const AttachActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;
const SmallBtn = styled(UISmallBtn)`
  height: 32px;
  padding: 0 12px;
  font-size: 13px;
`;
const Hint = styled.div`
  color: #6b7280;
  font-size: 12px;
  margin-top: 4px;
`;
// removed unused Badge
const SmallMuted = styled.span`
  color: #9ca3af;
  font-size: 12px;
`;
const HeaderText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
const BulkDialogBody = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.sm};
  font-size: 14px;
  color: #334155;
`;
const BulkList = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.xs};
  max-height: 240px;
  overflow-y: auto;
  padding-right: 4px;
`;
const BulkItem = styled.label`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #f9fafb;
  font-size: 13px;
  color: #1f2937;
  &[data-disabled="true"] {
    opacity: 0.6;
  }
  input {
    width: 16px;
    height: 16px;
  }
  .name {
    font-weight: 600;
  }
  .status {
    font-size: 12px;
    color: #6b7280;
    text-align: right;
  }
`;
const BulkFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  font-size: 12px;
  color: #475569;
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

// Upload UX additions
const DropArea = styled.div`
  margin-top: 8px;
  border: 1px dashed #d1d5db;
  border-radius: 10px;
  padding: 10px;
  text-align: center;
  background: #f9fafb;
  color: #6b7280;
  font-size: 12px;
  .hint {
    pointer-events: none;
  }
`;
const UploadQueue = styled.div`
  display: grid;
  gap: 8px;
  margin-top: 10px;
`;
const QueueItem = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 8px;
  background: #fff;
  display: grid;
  gap: 6px;
  .meta {
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: space-between;
  }
  .name {
    font-size: 12px;
    color: #111827;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
  }
  .size {
    font-size: 11px;
    color: #9ca3af;
  }
  .status {
    font-size: 11px;
    color: #6b7280;
  }
  .bar {
    height: 6px;
    background: #f3f4f6;
    border-radius: 999px;
    overflow: hidden;
  }
  .bar i {
    display: block;
    height: 100%;
    background: #a7f3d0;
  }
`;

// Tabs like StudentDetail
const TabBar = styled.div`
  display: inline-flex;
  gap: 6px;
  align-items: center;
`;
const TabBtn = styled(UISmallBtn)`
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
const DividerLine = styled.div`
  height: 1px;
  background: #e5e7eb;
  margin: 6px 0 8px;
`;
const TopTabs = styled.div`
  position: sticky;
  top: 0;
  z-index: 22;
  background: ${(p) => p.theme.colors.surface};
  padding: 4px 0;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 6px;
`;

const GradesWrapper = styled.div`
  display: grid;
  gap: 16px;
`;
const GradesIntro = styled.div`
  border: 1px dashed #d1d5db;
  border-radius: 12px;
  padding: 18px 20px;
  background: #f9fafb;
  display: grid;
  gap: 12px;
  max-width: 520px;
`;
const IntroBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 999px;
  background: #eef2ff;
  color: #3730a3;
  font-size: 12px;
  font-weight: 700;
`;
const IntroText = styled.p`
  margin: 0;
  font-size: 13px;
  color: #475569;
  line-height: 1.6;
`;
const GradesList = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fff;
  padding: 16px;
  display: grid;
  gap: 16px;
`;
const GradesListHead = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  .actions {
    display: inline-flex;
    gap: 8px;
    flex-wrap: wrap;
  }
  h2,
  h3,
  h4 {
    margin: 0;
  }
`;
const ExamList = styled.div`
  display: grid;
  gap: 10px;
`;
const ExamListItem = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  text-align: left;
  padding: 12px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #f9fafb;
  cursor: pointer;
  transition: border-color 0.18s ease, background-color 0.18s ease;
  .meta {
    display: grid;
    gap: 4px;
  }
  .meta strong {
    font-size: 14px;
    color: #111827;
  }
  .meta span {
    font-size: 12px;
    color: #475569;
  }
  .indicator {
    font-size: 12px;
    color: #4f46e5;
    font-weight: 700;
  }
  &[data-selected="true"] {
    border-color: #6366f1;
    background: #eef2ff;
  }
`;
const ScorePanel = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fff;
  padding: 12px;
  display: grid;
  gap: 10px;
`;
const ScoreHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  .right {
    display: inline-flex;
    gap: 8px;
    align-items: center;
  }
  .mode {
    font-size: 12px;
    color: #6b7280;
  }
`;
const ScoreTable = styled.div`
  display: grid;
  gap: 8px;
  .row {
    display: grid;
    grid-template-columns: 1fr auto; /* name grows, control sticks to right */
    align-items: center;
    gap: 8px;
  }
  .row.head {
    color: #6b7280;
    font-size: 12px;
    font-weight: 800;
  }
  .row.head span:last-child {
    justify-self: end;
    text-align: right;
  }
  .name {
    font-weight: 700;
    color: #111827;
  }
  .control {
    display: inline-flex;
    justify-self: end; /* ensure input/select sits at far right */
  }
`;
const ScoreInput = styled.input`
  height: 32px;
  padding: 0 10px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 12px;
  width: 100px;
`;
const ScoreSelect = styled.select`
  height: 32px;
  padding: 0 10px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 12px;
  width: 100px;
  background: #fff;
`;
const ModeBadge = styled.span`
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 800;
  border: 1px solid #e5e7eb;
  color: #374151;
  background: #f8fafc;
  &[data-variant="percent"] {
    background: #ecfdf5;
    color: #065f46;
    border-color: #a7f3d0;
  }
  &[data-variant="letter"] {
    background: #eef2ff;
    color: #3730a3;
    border-color: #c7d2fe;
  }
`;
const MoreChip = styled.li`
  background: #f1f5f9;
  color: #475569;
  border: 1px dashed #cbd5e1;
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 12px;
  list-style: none;
`;
const SelectedExamCard = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #f8fafc;
  padding: 16px;
  display: grid;
  gap: 12px;
`;
const SelectedExamHead = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  strong {
    font-size: 15px;
    color: #111827;
    display: block;
  }
  > div span {
    display: block;
    font-size: 12px;
    color: #475569;
    margin-top: 4px;
  }
  .count {
    font-size: 12px;
    font-weight: 700;
    color: #4f46e5;
  }
`;
const StudentChipList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  list-style: none;
  margin: 0;
  padding: 0;
  li {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 999px;
    padding: 6px 12px;
    font-size: 12px;
    color: #1f2937;
  }
`;
const ModalListBody = styled.div`
  display: grid;
  gap: 12px;
`;
const ModalListScroller = styled.div`
  max-height: 360px;
  overflow-y: auto;
  padding-right: 4px;
`;
const ModalListActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  flex-wrap: wrap;
`;
const CreateForm = styled.div`
  display: grid;
  gap: 12px;
  label {
    font-size: 12px;
    font-weight: 700;
    color: #475569;
  }
  input {
    height: 36px;
  }
`;
const ModeList = styled.div`
  display: grid;
  gap: 8px;
`;
const ModeOption = styled.button`
  width: 100%;
  text-align: left;
  padding: 12px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  cursor: pointer;
  transition: border-color 0.18s ease, box-shadow 0.18s ease,
    background-color 0.18s ease;
  .texts {
    display: grid;
    gap: 4px;
  }
  .texts strong {
    font-size: 14px;
    color: #111827;
  }
  .texts span {
    font-size: 12px;
    color: #64748b;
  }
  .indicator {
    font-size: 12px;
    color: #4f46e5;
    font-weight: 700;
  }
  &[data-active="true"] {
    border-color: #4f46e5;
    background: #eef2ff;
    box-shadow: 0 2px 8px rgba(79, 70, 229, 0.12);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
const EmptyHint = styled.div`
  padding: 12px;
  color: #6b7280;
  font-size: 13px;
`;
