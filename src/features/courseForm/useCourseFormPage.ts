import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createCourse, getCourse, updateCourse } from "@/api/courses";
import { listStudents } from "@/api/students";
import { getErrorMessage } from "@/lib/errors";
import {
  DEFAULT_FORM,
  type FormState,
  type StudentOption,
  type CourseFormStepMeta,
} from "@/components/courseForm/courseFormTypes";
import { useToggleDay } from "@/components/courseForm/courseFormHelpers";
import { routes, paths } from "@/routes";

type FieldErrors = {
  title?: string;
  schedule?: string;
  student?: string;
};

type UseCourseFormPageResult = {
  isEdit: boolean;
  courseId: number | null;
  steps: ReadonlyArray<CourseFormStepMeta>;
  step: number;
  setStep: (index: number) => void;
  isLastStep: boolean;
  form: FormState;
  setForm: (updater: (prev: FormState) => FormState) => void;
  accordionToggle: (day: string, next: boolean) => void;
  recurring: boolean;
  setRecurring: (value: boolean) => void;
  studentLoading: boolean;
  studentError: string | null;
  studentFilter: string;
  setStudentFilter: (value: string) => void;
  filteredStudents: StudentOption[];
  fieldErrors: FieldErrors;
  setFieldErrors: (updater: (prev: FieldErrors) => FieldErrors) => void;
  feeInput: string;
  setFeeInput: (value: string) => void;
  loading: boolean;
  saving: boolean;
  error: string | null;
  success: string | null;
  goNext: () => void;
  goPrev: () => void;
  submit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  onSelectStudent: (student: StudentOption) => void;
  navigateEditStudents: () => void;
};

export function useCourseFormPage(): UseCourseFormPageResult {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = useMemo(() => Boolean(id), [id]);
  const courseId = useMemo(() => {
    if (!id) return null;
    const parsed = Number(id);
    return Number.isFinite(parsed) ? parsed : null;
  }, [id]);

  const [form, internalSetForm] = useState<FormState>(() => ({ ...DEFAULT_FORM }));
  const [feeInput, setFeeInput] = useState("");
  const toggleDay = useToggleDay(form, internalSetForm);
  const [recurring, setRecurring] = useState(true);
  const [step, setStep] = useState(0);

  const [studentOptions, setStudentOptions] = useState<StudentOption[]>([]);
  const [studentLoading, setStudentLoading] = useState(false);
  const [studentError, setStudentError] = useState<string | null>(null);
  const [studentsLoaded, setStudentsLoaded] = useState(false);
  const [studentFilter, setStudentFilter] = useState("");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const steps = useMemo<ReadonlyArray<CourseFormStepMeta>>(
    () => [
      {
        key: "basic",
        title: "기본 정보",
        lead: "수업명과 상태를 먼저 확인해 주세요.",
      },
      {
        key: "schedule",
        title: "수업 일정",
        lead: "정기 반복 여부와 시간을 선택합니다.",
      },
      {
        key: "details",
        title: "추가 설정",
        lead: "정원, 수강료, 설명을 정리해 마무리하세요.",
      },
    ],
    [],
  );

  const isLastStep = step === steps.length - 1;
  const isIndividual = form.courseType === "INDIVIDUAL";

  const setForm = useCallback(
    (updater: (prev: FormState) => FormState) => {
      internalSetForm((prev) => updater(prev));
    },
    [],
  );

  const setFieldErrorsSafe = useCallback(
    (updater: (prev: FieldErrors) => FieldErrors) => {
      setFieldErrors((prev) => updater(prev));
    },
    [],
  );

  const filteredStudents = useMemo(() => {
    const keyword = studentFilter.trim().toLowerCase();
    if (!keyword) return studentOptions;
    return studentOptions.filter((student) => {
      const name = student.name?.toLowerCase() ?? "";
      const code = student.code?.toLowerCase() ?? "";
      return name.includes(keyword) || code.includes(keyword);
    });
  }, [studentOptions, studentFilter]);

  useEffect(() => {
    if (!isIndividual || studentsLoaded) return;
    let cancelled = false;
    async function loadStudents() {
      setStudentLoading(true);
      setStudentError(null);
      try {
        const size = 100;
        let page = 0;
        let aggregated: StudentOption[] = [];
        while (true) {
          const res = await listStudents({ page, size });
          const { content, last } = res;
          const mapped = content.map((student) => ({
            id: student.id,
            name: student.name,
            code: student.code,
            status: student.status,
          }));
          aggregated = aggregated.concat(mapped);
          if (last || content.length === 0 || page > 200) break;
          page += 1;
        }
        if (!cancelled) {
          const unique = new Map<number, StudentOption>();
          for (const row of aggregated) unique.set(row.id, row);
          if (form.primaryStudentId && !unique.has(form.primaryStudentId)) {
            unique.set(form.primaryStudentId, {
              id: form.primaryStudentId,
              name: form.primaryStudentName || `학생 #${form.primaryStudentId}`,
              code: undefined,
              status: "ENROLLED",
            });
          }
          const ordered = Array.from(unique.values()).sort((a, b) =>
            (a.name || "").localeCompare(b.name || "", "ko-KR"),
          );
          setStudentOptions(ordered);
          setStudentsLoaded(true);
        }
      } catch (err) {
        if (!cancelled) {
          setStudentError(getErrorMessage(err, "학생 목록을 불러오지 못했습니다."));
          setStudentsLoaded(true);
        }
      } finally {
        if (!cancelled) setStudentLoading(false);
      }
    }
    void loadStudents();
    return () => {
      cancelled = true;
    };
  }, [form.primaryStudentId, form.primaryStudentName, isIndividual, studentsLoaded]);

  useEffect(() => {
    if (!isEdit || !courseId) return;
    let cancelled = false;
    async function loadCourse() {
      setLoading(true);
      setError(null);
      try {
        const found = await getCourse(courseId);
        if (!cancelled && found) {
          setForm(() => ({
            title: found.title,
            description: found.description,
            status: found.status,
            courseType: found.courseType ?? "GROUP",
            capacity: (found.courseType ?? "GROUP") === "INDIVIDUAL" ? 1 : found.capacity,
            fee: found.fee,
            courseTime: found.courseTime,
            recurrenceDays: found.recurrenceDays,
            startTime: found.startTime ? found.startTime.slice(0, 5) : "",
            endTime: found.endTime ? found.endTime.slice(0, 5) : "",
            primaryStudentId: found.primaryStudentId ?? null,
            primaryStudentName: found.primaryStudentName ?? "",
          }));
          setFeeInput(found.fee != null ? String(found.fee) : "");
        }
      } catch (err) {
        if (!cancelled) {
          setError(getErrorMessage(err, "수업 정보를 불러오지 못했습니다."));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void loadCourse();
    return () => {
      cancelled = true;
    };
  }, [courseId, isEdit, setForm]);

  const validateStep = useCallback(
    (current: number) => {
      if (current === 0) {
        if (!form.title || !form.title.trim()) {
    setFieldErrors((prev) => ({ ...prev, title: "수업명을 입력해 주세요." }));
          return false;
        }
        setFieldErrors((prev) => ({ ...prev, title: undefined }));
      }
      if (current === 1) {
        if (form.courseType === "INDIVIDUAL" && !form.primaryStudentId) {
    setFieldErrors((prev) => ({ ...prev, student: "학생을 선택해 주세요." }));
          return false;
        }
        setFieldErrors((prev) => ({ ...prev, student: undefined }));
        if (
          recurring &&
          (!form.recurrenceDays ||
            !form.recurrenceDays.trim() ||
            !form.startTime ||
            !form.endTime)
        ) {
    setFieldErrors((prev) => ({
        ...prev,
        schedule: "반복 요일과 시작/종료 시간을 선택해 주세요.",
      }));
          return false;
        }
        setFieldErrors((prev) => ({ ...prev, schedule: undefined }));
      }
      return true;
    },
    [form, recurring],
  );

  const goNext = useCallback(() => {
    if (!validateStep(step)) return;
    setStep((prev) => Math.min(prev + 1, steps.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step, steps.length, validateStep]);

  const goPrev = useCallback(() => {
    setStep((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const submit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setError(null);
      setSuccess(null);
      setFieldErrors({});
      if (!form.title || !form.title.trim()) {
        setFieldErrors((prev) => ({ ...prev, title: "수업명을 입력해 주세요." }));
        return;
      }
      if (isIndividual && !form.primaryStudentId) {
        setFieldErrors((prev) => ({ ...prev, student: "학생을 선택해 주세요." }));
        return;
      }
      setSaving(true);
      try {
        if (
          recurring &&
          (!form.recurrenceDays ||
            !form.recurrenceDays.trim() ||
            !form.startTime ||
            !form.endTime)
        ) {
          setFieldErrors((prev) => ({
            ...prev,
            schedule: "반복 요일과 시작/종료 시간을 선택해 주세요.",
          }));
          return;
        }
        const payload = {
          ...form,
          startTime: form.startTime?.length === 5 ? `${form.startTime}:00` : form.startTime,
          endTime: form.endTime?.length === 5 ? `${form.endTime}:00` : form.endTime,
          recurring,
        };
        if (isEdit && courseId) {
          await updateCourse(courseId, payload);
          setSuccess("수정이 완료되었습니다.");
        } else {
          await createCourse(payload);
          setSuccess("수업이 추가되었습니다.");
        }
        navigate(routes.classes, { replace: true });
      } catch (err) {
        setError(getErrorMessage(err, "저장에 실패했습니다."));
      } finally {
        setSaving(false);
      }
    },
    [courseId, form, isEdit, isIndividual, navigate, recurring],
  );

  const onSelectStudent = useCallback((student: StudentOption) => {
    setForm((prev) => ({
      ...prev,
      primaryStudentId: student.id,
      primaryStudentName: student.name,
    }));
  }, [setForm]);

  const navigateEditStudents = useCallback(() => {
    if (!courseId) return;
    navigate(paths.classes.editStudents(courseId));
  }, [courseId, navigate]);

  return {
    isEdit,
    courseId,
    steps,
    step,
    setStep,
    isLastStep,
    form,
    setForm,
    accordionToggle: toggleDay,
    recurring,
    setRecurring,
    studentLoading,
    studentError,
    studentFilter,
    setStudentFilter,
    filteredStudents,
    fieldErrors,
    setFieldErrors: setFieldErrorsSafe,
    feeInput,
    setFeeInput,
    loading,
    saving,
    error,
    success,
    goNext,
    goPrev,
    submit,
    onSelectStudent,
    navigateEditStudents,
  };
}
