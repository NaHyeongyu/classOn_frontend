import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getCourse,
  listCourseStudents,
  type Course,
} from "@/api/courses";
import {
  listStudents,
  type Student,
  updateStudent,
  type StudentPayload,
} from "@/api/students";
import { invalidateCacheByPrefix } from "@/lib/fetcher";
import { getErrorMessage } from "@/lib/errors";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";

export function useCourseStudents(courseId: number | null) {
  const [courseInfo, setCourseInfo] = useState<Course | null>(null);
  const [title, setTitle] = useState("");
  const [capacity, setCapacity] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [studentSearch, setStudentSearch] = useState("");
  const [studentOptions, setStudentOptions] = useState<Student[]>([]);
  const [studentLoading, setStudentLoading] = useState(false);
  const [studentError, setStudentError] = useState<string | null>(null);

  const [enrolledStudents, setEnrolledStudents] = useState<Student[]>([]);
  const [enrolledLoading, setEnrolledLoading] = useState(false);
  const [enrolledError, setEnrolledError] = useState<string | null>(null);

  const [addingId, setAddingId] = useState<number | null>(null);
  const [removingId, setRemovingId] = useState<number | null>(null);

  const {
    confirm: confirmUnenroll,
    dialog: confirmUnenrollDialog,
  } = useConfirmDialog({
    confirmLabel: "해제",
    cancelLabel: "취소",
    tone: "danger",
  });

  const capacityLimit = useMemo(
    () => (capacity ?? undefined),
    [capacity]
  );

  useEffect(() => {
    if (!courseId) {
      setCourseInfo(null);
      setTitle("");
      setCapacity(null);
      setError(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const course = await getCourse(courseId);
        if (cancelled) return;
        setCourseInfo(course);
        setTitle(course.title);
        setCapacity(course.capacity ?? null);
      } catch (err) {
        if (!cancelled) {
          setError(getErrorMessage(err, "수업 정보를 불러오지 못했습니다."));
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [courseId]);

  useEffect(() => {
    if (!courseId) {
      setEnrolledStudents([]);
      setEnrolledError(null);
      return;
    }
    let cancelled = false;
    (async () => {
      setEnrolledLoading(true);
      setEnrolledError(null);
      try {
        const list = await listCourseStudents(courseId);
        if (!cancelled) {
          setEnrolledStudents(list);
        }
      } catch (err) {
        const msg = getErrorMessage(err, "");
        if (msg.includes("404")) {
          // fallback: older API missing course endpoint
          try {
            let page = 0;
            const size = 100;
            let all: Student[] = [];
            while (true) {
              const res = await listStudents({ page, size });
              const { content, last } = res;
              all = all.concat(content);
              if (last || content.length === 0 || page > 100) break;
              page += 1;
            }
            const filtered = all.filter((student) =>
              (student.courses ?? []).some(
                (course: NonNullable<Student["courses"]>[number]) => course?.id === courseId,
              )
            );
            if (!cancelled) setEnrolledStudents(filtered);
          } catch (nested) {
            if (!cancelled) {
              setEnrolledError(
                getErrorMessage(
                  nested,
                  "등록된 학생 목록을 불러오지 못했습니다."
                )
              );
            }
          }
        } else if (!cancelled) {
          setEnrolledError(
            msg || "등록된 학생 목록을 불러오지 못했습니다."
          );
        }
      } finally {
        if (!cancelled) setEnrolledLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [courseId]);

  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(() => {
      (async () => {
        setStudentLoading(true);
        setStudentError(null);
        try {
          let page = 0;
          const size = 100;
          let all: Student[] = [];
          const query = studentSearch.trim();
          while (true) {
            const res = await listStudents({
              q: query || undefined,
              page,
              size,
            });
            const { content, last } = res;
            all = all.concat(content);
            if (last || content.length === 0 || page > 200) break;
            page += 1;
          }
          if (!cancelled) setStudentOptions(all);
        } catch (err) {
          if (!cancelled) {
            setStudentError(
              getErrorMessage(err, "학생 목록을 불러오지 못했습니다.")
            );
          }
        } finally {
          if (!cancelled) setStudentLoading(false);
        }
      })();
    }, 200);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [studentSearch]);

  const onEnroll = useCallback(
    async (student: Student) => {
      if (!courseId) return;
      try {
        if (
          capacityLimit &&
          enrolledStudents.length >= capacityLimit
        ) {
          setStudentError("정원이 가득 찼습니다.");
          return;
        }
        setAddingId(student.id);
        const existing = Array.isArray(student.courses)
          ? student.courses.map((c: NonNullable<Student["courses"]>[number]) => c.id)
          : [];
        if (existing.includes(courseId)) return;
        const nextCourseIds = Array.from(
          new Set<number>([...existing, courseId])
        );
        await updateStudent(student.id, {
          courseIds: nextCourseIds,
        } as Partial<StudentPayload>);
        invalidateCacheByPrefix([
          `/api/courses/${courseId}`,
          `/api/courses/${courseId}/students`,
          "/api/students",
          "/api/calendar/classes",
          "/api/calendar/classes-range",
          "/api/dashboard/summary",
        ]);
        try {
          window.dispatchEvent(
            new CustomEvent("calendar:classes-refresh", { detail: {} })
          );
        } catch (dispatchError) {
          if (import.meta.env.DEV) {
            console.debug(
              "수강생 추가 후 달력 갱신 이벤트 전파 실패",
              dispatchError
            );
          }
        }
        setEnrolledStudents((prev) =>
          prev.some((item) => item.id === student.id)
            ? prev
            : [...prev, student]
        );
        setStudentOptions((options) =>
          options.map((option) => {
            if (option.id !== student.id) return option;
            const entry: Student["courses"][number] = courseInfo
              ? {
                  id: courseInfo.id,
                  code: courseInfo.code,
                  title: courseInfo.title,
                  status: courseInfo.status,
                  fee: courseInfo.fee ?? null,
                }
              : {
                  id: courseId,
                  code: "",
                  title: title || "",
                  status: "IN_PROGRESS",
                  fee: null,
                };
            const alreadyHas = option.courses.some(
              (course: NonNullable<Student["courses"]>[number]) => course?.id === courseId,
            );
            return {
              ...option,
              courses: alreadyHas ? option.courses : [...option.courses, entry],
            };
          })
        );
      } catch (err) {
        setStudentError(getErrorMessage(err, "추가에 실패했습니다."));
      } finally {
        setAddingId(null);
      }
    },
    [
      courseId,
      capacityLimit,
      enrolledStudents.length,
      courseInfo,
      title,
    ]
  );

  const onUnenroll = useCallback(
    async (student: Student) => {
      if (!courseId) return;
      const label = student.name?.trim() || "선택한";
      const confirmed = await confirmUnenroll({
        title: "수업에서 해제할까요?",
        message: `${label} 학생을 이 수업에서 해제합니다. 되돌릴 수 없습니다.`,
      });
      if (!confirmed) return;
      try {
        setRemovingId(student.id);
        const existing = Array.isArray(student.courses)
          ? student.courses.map((course: NonNullable<Student["courses"]>[number]) => course.id)
          : [];
        const nextCourseIds = existing.filter((id: number) => id !== courseId);
        await updateStudent(student.id, {
          courseIds: nextCourseIds,
        } as Partial<StudentPayload>);
        invalidateCacheByPrefix([
          `/api/courses/${courseId}`,
          `/api/courses/${courseId}/students`,
          "/api/students",
          "/api/calendar/classes",
          "/api/calendar/classes-range",
          "/api/dashboard/summary",
        ]);
        try {
          window.dispatchEvent(
            new CustomEvent("calendar:classes-refresh", { detail: {} })
          );
        } catch (dispatchError) {
          if (import.meta.env.DEV) {
            console.debug(
              "수강생 해제 후 달력 갱신 이벤트 전파 실패",
              dispatchError
            );
          }
        }
        setEnrolledStudents((prev) =>
          prev.filter((item) => item.id !== student.id)
        );
        setStudentOptions((options) =>
          options.map((option) =>
            option.id === student.id
              ? {
                  ...option,
                  courses: option.courses.filter(
                    (course: NonNullable<Student["courses"]>[number]) => course?.id !== courseId,
                  ),
                }
              : option
          )
        );
      } catch (err) {
        setEnrolledError(getErrorMessage(err, "해제에 실패했습니다."));
      } finally {
        setRemovingId(null);
      }
    },
    [courseId, confirmUnenroll]
  );

  return {
    title,
    courseInfo,
    capacity,
    error,
    studentSearch,
    setStudentSearch,
    studentOptions,
    studentLoading,
    studentError,
    enrolledStudents,
    enrolledLoading,
    enrolledError,
    addingId,
    removingId,
    onEnroll,
    onUnenroll,
    confirmUnenrollDialog,
  };
}
