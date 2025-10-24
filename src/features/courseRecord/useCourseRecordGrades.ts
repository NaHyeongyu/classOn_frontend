import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  createExam,
  deleteExam,
  listExams,
  listExamResults,
  updateExam,
  upsertExamResults,
  type Exam,
} from "@/api/exams";
import { invalidateCacheByPrefix } from "@/lib/fetcher";
import { readableError } from "@/lib/errors";
import type { CourseRecord } from "@/api/courses";

type GradeMapValue = {
  percent?: string;
  letter?: "A" | "B" | "C" | "D" | "E" | "F";
};

type ExamResultValue = {
  score?: number;
  outOf?: number;
  level?: string;
  note?: string;
};

type UseCourseRecordGradesOptions = {
  courseId: number | null;
  record: CourseRecord | null;
  ymd?: string | null;
  searchParams: URLSearchParams;
  showError: (message: string) => void;
};

export function useCourseRecordGrades({
  courseId,
  record,
  ymd,
  searchParams,
  showError,
}: UseCourseRecordGradesOptions) {
  const [exams, setExams] = useState<Exam[]>([]);
  const [examLoading, setExamLoading] = useState(false);
  const [examError, setExamError] = useState<string | null>(null);
  const [selectedExamId, setSelectedExamId] = useState<string>("");
  const selectedExamIdRef = useRef("");

  const [examFormTitle, setExamFormTitle] = useState("");
  const [examFormMode, setExamFormMode] = useState<"percent" | "letter">(
    "percent"
  );
  const [examFormSaving, setExamFormSaving] = useState(false);
  const [examFormError, setExamFormError] = useState<string | null>(null);
  const [examModalOpen, setExamModalOpen] = useState(false);
  const [examModalView, setExamModalView] = useState<"list" | "create">(
    "list"
  );
  const [examQuery, setExamQuery] = useState("");
  const [examCreateOk, setExamCreateOk] = useState(false);

  const [examResultsMap, setExamResultsMap] = useState<Record<number, ExamResultValue>>({});
  const [gradeMap, setGradeMap] = useState<Record<number, GradeMapValue>>({});
  const [gradeSaving, setGradeSaving] = useState(false);
  const [gradeFeedback, setGradeFeedback] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const gradeAutoSaveTimerRef = useRef<number | null>(null);
  const lastGradeEditAtRef = useRef<number>(0);

  useEffect(() => {
    selectedExamIdRef.current = selectedExamId;
  }, [selectedExamId]);

  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (Object.keys(gradeMap).length > 0) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, [gradeMap]);

  const selectedExam = useMemo(
    () => exams.find((exam) => String(exam.id) === selectedExamId) || null,
    [exams, selectedExamId]
  );

  const filteredExams = useMemo(() => {
    const query = examQuery.trim().toLowerCase();
    if (!query) return exams;
    return exams.filter((exam) => (exam.title || "").toLowerCase().includes(query));
  }, [exams, examQuery]);

  const hasGradeChanges = useMemo(
    () => Object.keys(gradeMap).length > 0,
    [gradeMap]
  );

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
          list.some((exam) => String(exam.id) === String(opts.selectId))
        ) {
          nextId = String(opts.selectId);
        } else {
          const current = selectedExamIdRef.current;
          if (current && list.some((exam) => String(exam.id) === current)) {
            nextId = current;
          } else {
            const byQuery = searchParams.get("examId");
            if (byQuery && list.some((exam) => String(exam.id) === byQuery)) {
              nextId = byQuery;
            } else {
              const dateKey = record?.recordDate || ymd || "";
              if (dateKey) {
                const matching = list.find((exam) => exam.examDate === dateKey);
                if (matching) nextId = String(matching.id);
              }
            }
          }
        }
        setSelectedExamId(nextId);
      } catch (error) {
        setExamError(readableError(error, "시험 목록을 불러오지 못했습니다."));
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
        } catch (error) {
          if (import.meta.env.DEV) {
            console.debug("시험 결과 캐시 초기화 실패", error);
          }
        }
        const list = await listExamResults(courseId, Number(selectedExamId));
        if (cancelled) return;
        const map: Record<number, ExamResultValue> = {};
        for (const result of list) {
          map[result.studentId] = {
            score: result.score,
            outOf: result.outOf,
            level: result.level,
            note: result.note,
          };
        }
        setExamResultsMap(map);
      } catch {
        if (!cancelled) setExamResultsMap({});
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [courseId, selectedExamId]);

  const handleConfirmExamSelection = useCallback(() => {
    if (!selectedExamId) return false;
    setExamModalOpen(false);
    return true;
  }, [selectedExamId]);

  const quickCreateExamPercent = useCallback(async () => {
    if (!courseId || examFormSaving) return null;
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
      setExamCreateOk(true);
      window.setTimeout(() => setExamCreateOk(false), 1500);
      return created.id;
    } catch (error) {
      setExamFormError(readableError(error, "시험 생성에 실패했습니다."));
      return null;
    } finally {
      setExamFormSaving(false);
    }
  }, [courseId, examFormSaving, record?.recordDate, ymd, refreshExams]);

  const handleDeleteSelectedExam = useCallback(async () => {
    if (!courseId || !selectedExamId) return false;
    try {
      await deleteExam(courseId, Number(selectedExamId));
      await refreshExams();
      setSelectedExamId("");
      return true;
    } catch (error) {
      setExamError(readableError(error, "시험 삭제에 실패했습니다."));
      return false;
    }
  }, [courseId, selectedExamId, refreshExams]);

  const handleCreateExamInline = useCallback(async () => {
    if (!courseId || examFormSaving) return false;
    const title = (examFormTitle || "").trim() || "시험";
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
      setExamCreateOk(true);
      window.setTimeout(() => setExamCreateOk(false), 2000);
      return created.id;
    } catch (error) {
      setExamFormError(readableError(error, "시험 생성에 실패했습니다."));
      return null;
    } finally {
      setExamFormSaving(false);
    }
  }, [courseId, examFormMode, examFormSaving, examFormTitle, record?.recordDate, ymd, refreshExams]);

  const saveScoresForPresent = useCallback(async () => {
    if (!courseId) return;
    if (!selectedExam) {
      alert("먼저 시험을 선택하거나 생성하세요.");
      return;
    }
    const date =
      record?.recordDate || ymd || new Date().toISOString().slice(0, 10);
    const saveRequestedAt = lastGradeEditAtRef.current;
    setGradeSaving(true);
    setGradeFeedback("idle");
    try {
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
      if (items.length === 0) {
        setGradeSaving(false);
        return;
      }
      if (!selectedExam.examDate && date) {
        try {
          await updateExam(courseId, Number(selectedExamId), {
            examDate: date,
          });
        } catch (error) {
          if (import.meta.env.DEV) {
            console.debug("시험 날짜 자동 설정 실패", error);
          }
        }
      }
      await upsertExamResults(courseId, Number(selectedExamId), items);
      try {
        invalidateCacheByPrefix(
          `/api/courses/${courseId}/exams/${selectedExamId}/results`
        );
      } catch (error) {
        if (import.meta.env.DEV) {
          console.debug("시험 결과 캐시 무효화 실패", error);
        }
      }
      try {
        const saved = await listExamResults(courseId, Number(selectedExamId));
        const nextMap: Record<number, ExamResultValue> = {};
        for (const result of saved) {
          nextMap[result.studentId] = {
            score: result.score,
            outOf: result.outOf,
            level: result.level,
            note: result.note,
          };
        }
        setExamResultsMap(nextMap);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.debug("시험 결과 재조회 실패", error);
        }
      }
      const noNewEdits = lastGradeEditAtRef.current === saveRequestedAt;
      if (noNewEdits) {
        setGradeFeedback("success");
      }
      window.setTimeout(() => {
        if (lastGradeEditAtRef.current === saveRequestedAt) {
          setGradeMap({});
          setGradeFeedback("idle");
        }
      }, 1500);
    } catch (error) {
      showError(
        readableError(error, "성적 저장에 실패했습니다. 다시 시도해 주세요.")
      );
      setGradeFeedback("error");
    } finally {
      setGradeSaving(false);
    }
  }, [courseId, gradeMap, record?.recordDate, selectedExam, selectedExamId, showError, ymd]);

  return {
    exams,
    examLoading,
    examError,
    selectedExamId,
    setSelectedExamId,
    examFormTitle,
    setExamFormTitle,
    examFormMode,
    setExamFormMode,
    examFormSaving,
    setExamFormSaving,
    examFormError,
    setExamFormError,
    examModalOpen,
    setExamModalOpen,
    examModalView,
    setExamModalView,
    examQuery,
    setExamQuery,
    examCreateOk,
    setExamCreateOk,
    selectedExam,
    filteredExams,
    examResultsMap,
    setExamResultsMap,
    gradeMap,
    setGradeMap,
    gradeSaving,
    setGradeSaving,
    gradeFeedback,
    setGradeFeedback,
    gradeAutoSaveTimerRef,
    lastGradeEditAtRef,
    selectedExamIdRef,
    hasGradeChanges,
    refreshExams,
    handleConfirmExamSelection,
    quickCreateExamPercent,
    handleDeleteSelectedExam,
    handleCreateExamInline,
    saveScoresForPresent,
  };
}

export type UseCourseRecordGradesReturn = ReturnType<typeof useCourseRecordGrades>;
