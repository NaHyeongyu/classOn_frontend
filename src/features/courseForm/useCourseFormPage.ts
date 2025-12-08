import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createCourse, getCourse, updateCourse } from "@/api/courses";
import { listStudents } from "@/api/students";
import { listTeachers, getInstructorCourseCounts } from "@/api/teachers";
import { getErrorMessage } from "@/lib/errors";
import { useAuth } from "@/hooks/useAuth";
import {
  DEFAULT_FORM,
  type FormState,
  type StudentOption,
  type CourseFormStepMeta,
  type TeacherOption,
} from "@/components/courseForm/courseFormTypes";
import { useToggleDay } from "@/components/courseForm/courseFormHelpers";
import { routes, paths } from "@/routes";

type FieldErrors = {
  title?: string;
  schedule?: string;
  student?: string;
  instructor?: string;
};

type UseCourseFormPageResult = {
  isEdit: boolean;
  courseId: number | null;
  isTeacher: boolean;
  steps: ReadonlyArray<CourseFormStepMeta>;
  form: FormState;
  setForm: (updater: (prev: FormState) => FormState) => void;
  accordionToggle: (day: import("@/components/courseForm/courseFormHelpers").DayKey, next: boolean) => void;
  recurring: boolean;
  setRecurring: (value: boolean) => void;
  studentLoading: boolean;
  studentError: string | null;
  studentFilter: string;
  setStudentFilter: (value: string) => void;
  filteredStudents: StudentOption[];
  teacherOptions: TeacherOption[];
  teacherLoading: boolean;
  teacherError: string | null;
  fieldErrors: FieldErrors;
  setFieldErrors: (updater: (prev: FieldErrors) => FieldErrors) => void;
  feeInput: string;
  setFeeInput: (value: string) => void;
  loading: boolean;
  saving: boolean;
  error: string | null;
  success: string | null;
  submit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  onSelectStudent: (student: StudentOption) => void;
  navigateEditStudents: () => void;
  feeChangeNotice: string | null;
  onCloseFeeChangeNotice: () => void;
};

export function useCourseFormPage(): UseCourseFormPageResult {
  const navigate = useNavigate();
  const { user } = useAuth();
  const roleValue = (user?.role ?? "").toString().toUpperCase();
  const isTeacher = roleValue === "TEACHER";
  const isOwnerOrAdmin = roleValue === "OWNER" || roleValue === "ADMIN";
  const authId = user?.id;
  const teacherId = useMemo<number | null>(() => {
    if (!isTeacher) return null;
    if (typeof authId === "number") return authId;
    if (typeof authId === "string") {
      const parsed = Number(authId);
      return Number.isFinite(parsed) ? parsed : null;
    }
    return null;
  }, [authId, isTeacher]);
  const ownerInstructorId = useMemo<number | null>(() => {
    if (!isOwnerOrAdmin) return null;
    if (typeof authId === "number") return authId;
    if (typeof authId === "string") {
      const parsed = Number(authId);
      return Number.isFinite(parsed) ? parsed : null;
    }
    return null;
  }, [authId, isOwnerOrAdmin]);
  const teacherDisplayName = useMemo(() => {
    const base = (user?.name ?? "").trim();
    if (base.length > 0) return base;
    const fallback = (user?.username ?? "").trim();
    if (fallback.length > 0) return fallback;
    if (teacherId != null) return `강사 #${teacherId}`;
    return "";
  }, [teacherId, user?.name, user?.username]);
  const teacherUsername = user?.username ?? undefined;

  const { id } = useParams();
  const isEdit = useMemo(() => Boolean(id), [id]);
  const courseId = useMemo(() => {
    if (!id) return null;
    const parsed = Number(id);
    return Number.isFinite(parsed) ? parsed : null;
  }, [id]);

  const [form, internalSetForm] = useState<FormState>(() => ({ ...DEFAULT_FORM }));
  const [initialFee, setInitialFee] = useState<number | null>(null);
  const [feeChangeNotice, setFeeChangeNotice] = useState<string | null>(null);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const [feeInput, setFeeInput] = useState("");
  const toggleDay = useToggleDay(form, internalSetForm);
  const [recurring, setRecurring] = useState(true);
  const [studentOptions, setStudentOptions] = useState<StudentOption[]>([]);
  const [studentLoading, setStudentLoading] = useState(false);
  const [studentError, setStudentError] = useState<string | null>(null);
  const [studentsLoaded, setStudentsLoaded] = useState(false);
  const [studentFilter, setStudentFilter] = useState("");
  const [teacherOptions, setTeacherOptions] = useState<TeacherOption[]>([]);
  const [teacherLoading, setTeacherLoading] = useState(false);
  const [teacherError, setTeacherError] = useState<string | null>(null);
  const [teachersLoaded, setTeachersLoaded] = useState(false);
  const ensureInstructorOption = useCallback((id: number | null | undefined, name?: string | null) => {
    if (!id) return;
    setTeacherOptions((prev) => {
      if (prev.some((teacher) => teacher.id === id)) return prev;
      const next = prev.concat({ id, name, username: undefined });
      return next.sort((a, b) => (a.name || "").localeCompare(b.name || "", "ko-KR"));
    });
  }, []);

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
    if (teachersLoaded || isTeacher) return;
    let cancelled = false;
    async function loadTeachers() {
      setTeacherLoading(true);
      setTeacherError(null);
      try {
        const rows = await listTeachers();
        if (!cancelled) {
          let mapped = rows
            .map((teacher) => ({
              id: teacher.id,
              name: teacher.name,
              username: teacher.username,
              phone: teacher.phone,
              courseCount: teacher.courseCount,
            }))
            .sort((a, b) =>
              (a.name || a.username || "").localeCompare(b.name || b.username || "", "ko-KR"),
            );
          // Ensure current login account appears as selectable option when owner/admin
          if (isOwnerOrAdmin && user && ownerInstructorId != null) {
            const exists = mapped.some((t) => t.id === ownerInstructorId);
            if (!exists) {
              const display = user.name?.trim() || user.username || `사용자 #${ownerInstructorId}`;
              mapped = mapped
                .concat({
                  id: ownerInstructorId,
                  name: display,
                  username: user.username,
                  phone: undefined,
                  courseCount: undefined,
                })
                .sort((a, b) => (a.name || "").localeCompare(b.name || "", "ko-KR"));
            }
          }
          setTeacherOptions(mapped);
          setTeachersLoaded(true);
        }
      } catch (err) {
        if (!cancelled) {
          setTeacherError(getErrorMessage(err, "강사 목록을 불러오지 못했습니다."));
          setTeachersLoaded(true);
        }
      } finally {
        if (!cancelled) setTeacherLoading(false);
      }
    }
    void loadTeachers();
    return () => {
      cancelled = true;
    };
  }, [teachersLoaded, isTeacher, isOwnerOrAdmin, ownerInstructorId, user]);

  useEffect(() => {
    if (!isTeacher || !teacherId) return;
    const displayName = teacherDisplayName;
    setTeacherOptions([
      {
        id: teacherId,
        name: displayName,
        username: teacherUsername,
        courseCount: undefined,
        phone: undefined,
      },
    ]);
    setTeachersLoaded(true);
    internalSetForm((prev) => {
      if (prev.instructorId === teacherId && prev.instructorName) {
        return prev;
      }
      return {
        ...prev,
        instructorId: teacherId,
        instructorName: displayName,
        instructorIds: [teacherId],
      };
    });
  }, [isTeacher, teacherId, teacherDisplayName, teacherUsername]);

  useEffect(() => {
    if (!ownerInstructorId) return;
    if (!teacherOptions.some((teacher) => teacher.id === ownerInstructorId)) return;
    const needsCount = teacherOptions.some(
      (teacher) => teacher.id === ownerInstructorId && typeof teacher.courseCount !== "number",
    );
    if (!needsCount) return;
    let cancelled = false;
    async function loadSelfCourseCount() {
      try {
        const counts = await getInstructorCourseCounts([ownerInstructorId]);
        const resolved = counts[0]?.courseCount ?? 0;
        if (!cancelled) {
          setTeacherOptions((prev) =>
            prev.map((teacher) =>
              teacher.id === ownerInstructorId ? { ...teacher, courseCount: resolved } : teacher,
            ),
          );
        }
      } catch {
        // Ignore count fetch errors to avoid blocking the form.
      }
    }
    void loadSelfCourseCount();
    return () => {
      cancelled = true;
    };
  }, [ownerInstructorId, teacherOptions]);

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
          const resolvedInstructorId =
            typeof found.instructorId === "number" ? found.instructorId : null;
          const resolvedInstructorName =
            typeof found.instructorName === "string" ? found.instructorName : "";
          const resolvedInstructorIds =
            Array.isArray((found as any).instructorIds) && (found as any).instructorIds.length
              ? (found as any).instructorIds.filter((id: unknown) => typeof id === "number")
              : (resolvedInstructorId != null ? [resolvedInstructorId] : []);
          setForm(() => ({
            title: found.title,
            description: found.description,
            status: found.status,
            courseType: (found.courseType ?? "GROUP") as import("@/components/courseForm/courseFormTypes").CourseTypeValue,
            capacity: (found.courseType ?? "GROUP") === "INDIVIDUAL" ? 1 : found.capacity,
            fee: found.fee,
            courseTime: found.courseTime,
            recurrenceDays: Array.isArray(found.recurrenceDays)
              ? found.recurrenceDays.join(",")
              : (found.recurrenceDays ?? ""),
            startTime: found.startTime ? found.startTime.slice(0, 5) : "",
            endTime: found.endTime ? found.endTime.slice(0, 5) : "",
            primaryStudentId: found.primaryStudentId ?? null,
            primaryStudentName: found.primaryStudentName ?? "",
            instructorId: resolvedInstructorId,
            instructorName: resolvedInstructorName,
            instructorIds: resolvedInstructorIds,
          }));
          setFeeInput(found.fee != null ? String(found.fee) : "");
          setInitialFee(found.fee ?? null);
          ensureInstructorOption(resolvedInstructorId, resolvedInstructorName);
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
  }, [courseId, ensureInstructorOption, isEdit, setForm]);

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
      // 담당 강사는 선택 사항입니다.
      if (isIndividual && !form.primaryStudentId) {
        setFieldErrors((prev) => ({ ...prev, student: "학생을 선택해 주세요." }));
        return;
      }
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
      setSaving(true);
      try {
        const normalizedInstructorIds = (() => {
          const src = Array.isArray(form.instructorIds)
            ? form.instructorIds
            : (form.instructorId != null ? [form.instructorId] : []);
          const uniq = new Set<number>();
          for (const v of src) {
            if (typeof v === "number" && Number.isFinite(v)) uniq.add(v);
          }
          return Array.from(uniq);
        })();
        const payload = {
          ...form,
          instructorIds: normalizedInstructorIds,
          startTime: form.startTime?.length === 5 ? `${form.startTime}:00` : form.startTime,
          endTime: form.endTime?.length === 5 ? `${form.endTime}:00` : form.endTime,
          recurring,
        };
        if (isEdit && courseId) {
          await updateCourse(courseId, payload);
          const updatedFee = payload.fee ?? null;
          const normalizedInitial = initialFee ?? null;
          const feeChanged = (normalizedInitial ?? null) !== (updatedFee ?? null);
          setInitialFee(updatedFee ?? null);
          if (feeChanged) {
            setFeeChangeNotice("수강료가 변경되어 학생 청구서에 자동으로 반영되었습니다.\n청구서 발송 전에 금액을 다시 확인해 주세요.");
            setPendingNavigation(paths.classes.detail(courseId));
          } else {
            navigate(paths.classes.detail(courseId), { replace: true });
          }
          setSuccess("수정이 완료되었습니다.");
        } else {
          const created = await createCourse(payload);
          setSuccess("수업이 추가되었습니다.");
          navigate(routes.classes, { replace: true });
        }
      } catch (err) {
        setError(getErrorMessage(err, "저장에 실패했습니다."));
      } finally {
        setSaving(false);
      }
    },
    [courseId, form, initialFee, isEdit, isIndividual, navigate, recurring, isOwnerOrAdmin, user?.id],
  );

  const closeFeeNotice = useCallback(() => {
    setFeeChangeNotice(null);
    if (pendingNavigation) {
      navigate(pendingNavigation, { replace: true });
      setPendingNavigation(null);
    }
  }, [navigate, pendingNavigation]);

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
    isTeacher,
    steps,
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
    teacherOptions,
    teacherLoading,
    teacherError,
    fieldErrors,
    setFieldErrors: setFieldErrorsSafe,
    feeInput,
    setFeeInput,
    loading,
    saving,
    error,
    success,
    submit,
    onSelectStudent,
    navigateEditStudents,
    feeChangeNotice,
    onCloseFeeChangeNotice: closeFeeNotice,
  };
}
