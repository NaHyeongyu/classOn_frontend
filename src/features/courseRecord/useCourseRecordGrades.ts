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
  type ExamPayload,
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

  // 시험 템플릿은 수업 상세 페이지에서만 관리하고,
  // 수업 내역 화면에서는 기존에 생성된 시험만 선택해서 사용합니다.

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

  // 템플릿 목록: 동일한 templateId(또는 id)를 기준으로 한 번씩만 노출
  const filteredExams = useMemo(() => {
    const byKey = new Map<string, Exam>();
    for (const exam of exams) {
      const key = exam.templateId ?? String(exam.id);
      const existing = byKey.get(key);
      if (!existing) {
        byKey.set(key, exam);
        continue;
      }
      // examDate가 없는 쪽(순수 템플릿)에 우선순위를 줍니다.
      if (existing.examDate && !exam.examDate) {
        byKey.set(key, exam);
        continue;
      }
      if (!!existing.examDate === !!exam.examDate) {
        // 둘 다 날짜가 있거나 둘 다 없으면 createdAt이 더 이른 쪽을 선택
        if (exam.createdAt && existing.createdAt && exam.createdAt < existing.createdAt) {
          byKey.set(key, exam);
        }
      }
    }
    let list = Array.from(byKey.values());
    const query = examQuery.trim().toLowerCase();
    if (query) {
      list = list.filter((exam) => (exam.title || "").toLowerCase().includes(query));
    }
    return list;
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
    let cancelled = false;
    (async () => {
      try {
        if (!courseId || !selectedExamId) {
          setExamResultsMap({});
          return;
        }
        // 시험을 바꿀 때 이전 시험의 성적이 잠깐이라도 섞여 보이지 않도록
        // 먼저 로컬 맵을 비워둔 뒤 새 시험 결과를 로드합니다.
        setExamResultsMap({});
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

  // 시험을 바꾸거나 새 시험을 생성했을 때는 기존 입력값(gradeMap)을 초기화해서
  // 이전 시험의 미저장 점수가 새 시험 폼에 섞여 보이지 않도록 합니다.
  useEffect(() => {
    setGradeMap({});
    setGradeFeedback("idle");
    lastGradeEditAtRef.current = 0;
  }, [selectedExamId, setGradeMap, setGradeFeedback]);

  const handleConfirmExamSelection = useCallback(async (): Promise<number | null> => {
    if (!courseId || !selectedExamId) return null;
    const dateKey = record?.recordDate || ymd || "";
    if (!dateKey) {
      setExamFormError("수업 일자를 먼저 선택해 주세요.");
      return null;
    }
    const base = exams.find((exam) => String(exam.id) === selectedExamId) || null;
    if (!base) return null;

    // 1) 이미 이 날짜용으로 만들어진 시험이면 그대로 사용
    if (base.examDate === dateKey) {
      setExamModalOpen(false);
      return base.id;
    }

    // 2) 같은 템플릿 + 같은 날짜로 생성된 Exam 이 있는지 확인
    const templateKey = base.templateId ?? String(base.id);
    const instance = exams.find(
      (exam) =>
        exam.id !== base.id &&
        (exam.templateId ?? String(exam.id)) === templateKey &&
        exam.examDate === dateKey,
    );
    if (instance) {
      setSelectedExamId(String(instance.id));
      setExamModalOpen(false);
      return instance.id;
    }

    // 3) 없으면 새로운 Exam 을 생성 (같은 템플릿 기반, 날짜만 다른 시험)
    const payload: ExamPayload = {
      title: base.title,
      inputMode: base.inputMode,
      kind: base.kind ?? "TEST",
      examDate: dateKey,
      templateId: templateKey,
    };
    try {
      setExamFormError(null);
      const created = await createExam(courseId, payload);
      await refreshExams({ selectId: created.id });
      setSelectedExamId(String(created.id));
      setExamModalOpen(false);
      return created.id;
    } catch (error) {
      setExamFormError(readableError(error, "시험을 생성하지 못했습니다."));
      return null;
    }
  }, [courseId, selectedExamId, record?.recordDate, ymd, exams, refreshExams, setExamFormError]);

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
        const payload: {
          studentId: number;
          score?: number;
          level?: string;
          outOf?: number;
        } = {
          studentId: sid,
        };
        if (score !== undefined) {
          payload.score = score;
          payload.outOf = 100;
        }
        if (level !== undefined) {
          payload.level = level;
        }
        return payload;
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
    handleDeleteSelectedExam,
    saveScoresForPresent,
  };
}

export type UseCourseRecordGradesReturn = ReturnType<typeof useCourseRecordGrades>;
