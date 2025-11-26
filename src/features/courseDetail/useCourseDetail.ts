import { useCallback, useEffect, useMemo, useState } from "react";
import {
  downloadCourseRecordsExcel,
  getCourse,
  listCourseRecords,
  listCourseStudents,
  listRecordAttendance,
  type Course,
  type CourseRecord,
} from "@/api/courses";
import { listStudents, type Student } from "@/api/students";
import { readableError } from "@/lib/errors";
import {
  buildCourseInfo,
  buildFilterRange,
  formatCourseTime,
  formatDateKey,
  sanitizeFilename,
  saveBlobAsFile,
} from "./utils";

type AttendanceMap = Record<number, Record<number, boolean>>;

export type CourseHistoryItem = {
  id?: number;
  date: Date;
  dateLabel: string;
  time: string;
  type: "지난 수업" | "예정";
  notes?: string | null;
};

type UseCourseDetailOptions = {
  courseId: number | null;
  onError: (message: string) => void;
};

export type UseCourseDetailResult = {
  course: Course | null;
  loading: boolean;
  error: string | null;
  students: Student[];
  stuLoading: boolean;
  stuError: string | null;
  filterYear: number | null;
  onChangeYear: (value: number | null) => void;
  filterMonth: number;
  onChangeMonth: (value: number) => void;
  resetFilters: () => void;
  exportingRecords: boolean;
  onExportRecords: () => void;
  history: CourseHistoryItem[];
  info: ReturnType<typeof buildCourseInfo> | null;
  totalStudents: number;
  capacity: number | undefined;
  completedCount: number;
  progressPct: number | null;
  avgAttendance: number | null;
  getAttendanceMap: (recordId: number) => Record<number, boolean>;
};

export function useCourseDetail({
  courseId,
  onError,
}: UseCourseDetailOptions): UseCourseDetailResult {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [students, setStudents] = useState<Student[]>([]);
  const [stuLoading, setStuLoading] = useState(false);
  const [stuError, setStuError] = useState<string | null>(null);

  const [records, setRecords] = useState<CourseRecord[]>([]);
  const [exportingRecords, setExportingRecords] = useState(false);
  const [attByRec, setAttByRec] = useState<AttendanceMap>({});

  const [filterYear, setFilterYear] = useState<number | null>(null);
  const [filterMonth, setFilterMonth] = useState<number>(
    new Date().getMonth() + 1
  );

  const loadCourse = useCallback(async () => {
    if (!courseId) return;
    setLoading(true);
    setError(null);
    try {
      const detail = await getCourse(courseId);
      setCourse(detail);
    } catch (err) {
      setError(readableError(err, "수업 정보를 불러오지 못했습니다."));
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    void loadCourse();
  }, [loadCourse]);

  useEffect(() => {
    if (!course) return;
    setFilterYear((prev) => {
      if (prev == null) {
        return new Date().getFullYear();
      }
      return prev;
    });
  }, [course]);

  useEffect(() => {
    if (!courseId) return;
    let cancelled = false;
    setStuLoading(true);
    setStuError(null);
    (async () => {
      try {
        const list = await listCourseStudents(courseId);
        if (!cancelled) setStudents(list);
      } catch (err) {
        const message = readableError(err, "");
        if (message.includes("404")) {
          try {
            let page = 0;
            const size = 100;
            let all: Student[] = [];
            while (true) {
              const { content, last } = await listStudents({ page, size });
              all = all.concat(content);
              if (last || content.length === 0 || page > 100) break;
              page += 1;
            }
            const filtered = all.filter((student) =>
              (student.courses ?? []).some(
                (course: NonNullable<Student["courses"]>[number]) => course?.id === courseId,
              )
            );
            if (!cancelled) setStudents(filtered);
          } catch (nested) {
            if (!cancelled) {
              setStuError(
                readableError(
                  nested,
                  "등록 학생을 불러오지 못했습니다."
                )
              );
            }
          }
        } else if (!cancelled) {
          setStuError(
            message || "등록 학생을 불러오지 못했습니다."
          );
        }
      } finally {
        if (!cancelled) setStuLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [courseId]);

  useEffect(() => {
    if (!courseId || filterYear == null) return;
    let cancelled = false;
    (async () => {
      try {
        const range = buildFilterRange(filterYear, filterMonth);
        const list = await listCourseRecords(courseId, range);
        if (!cancelled) {
          setRecords(list);
        }
      } catch (err) {
        if (cancelled) return;
        const message = readableError(err, "");
        if (message.includes("404")) {
          setRecords([]);
        } else {
          onError(message || "수업 내역을 불러오지 못했습니다.");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [courseId, filterYear, filterMonth, onError]);

  useEffect(() => {
    if (!courseId) return;

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
      items
        .slice()
        .sort((a, b) => {
          const byDate = a.recordDate.localeCompare(b.recordDate);
          if (byDate !== 0) return byDate;
          const startA = a.startTime ?? "";
          const startB = b.startTime ?? "";
          return startA.localeCompare(startB);
        });

    function onCreated(
      event: CustomEvent<{ courseId: number; record: CourseRecord }>
    ) {
      const detail = event.detail;
      if (!detail || detail.courseId !== courseId) return;
      const { record } = detail;
      if (!record || !matchesFilter(record.recordDate)) return;
      setRecords((prev) =>
        sortRecords([
          ...prev.filter((item) => item.id !== record.id),
          record,
        ])
      );
    }

    function onUpdated(
      event: CustomEvent<{ courseId: number; record: CourseRecord }>
    ) {
      const detail = event.detail;
      if (!detail || detail.courseId !== courseId) return;
      const { record } = detail;
      if (!record) return;
      setRecords((prev) => {
        const exists = prev.some((item) => item.id === record.id);
        if (!matchesFilter(record.recordDate)) {
          return exists ? prev.filter((item) => item.id !== record.id) : prev;
        }
        const next = exists
          ? prev.map((item) => (item.id === record.id ? record : item))
          : [...prev, record];
        return sortRecords(next);
      });
    }

    function onDeleted(
      event: CustomEvent<{ courseId: number; recordId: number }>
    ) {
      const detail = event.detail;
      if (!detail || detail.courseId !== courseId) return;
      setRecords((prev) => prev.filter((item) => item.id !== detail.recordId));
      setAttByRec((prev) => {
        if (prev == null || !(detail.recordId in prev)) return prev;
        const next = { ...prev };
        delete next[detail.recordId];
        return next;
      });
    }

    window.addEventListener(
      "course-record:created",
      onCreated as EventListener
    );
    window.addEventListener(
      "course-record:updated",
      onUpdated as EventListener
    );
    window.addEventListener(
      "course-record:deleted",
      onDeleted as EventListener
    );
    return () => {
      window.removeEventListener(
        "course-record:created",
        onCreated as EventListener
      );
      window.removeEventListener(
        "course-record:updated",
        onUpdated as EventListener
      );
      window.removeEventListener(
        "course-record:deleted",
        onDeleted as EventListener
      );
    };
  }, [courseId, filterYear, filterMonth]);

  useEffect(() => {
    if (!courseId || records.length === 0) return;
    let cancelled = false;
    (async () => {
      const ids = records
        .map((record) => record.id)
        .filter((value): value is number => typeof value === "number");
      if (ids.length === 0) return;
      try {
        const pairs = await Promise.all(
          ids.map(async (recordId) => {
            try {
              const list = await listRecordAttendance(courseId, recordId);
              const map: Record<number, boolean> = {};
              list.forEach((entry) => {
                map[entry.studentId] = !!entry.present;
              });
              return [recordId, map] as const;
            } catch {
              return [recordId, undefined] as const;
            }
          })
        );
        if (!cancelled) {
          setAttByRec((prev) => {
            const next = { ...prev };
            pairs.forEach(([recordId, map]) => {
              if (map) next[recordId] = map;
            });
            return next;
          });
        }
      } finally {
        // no-op
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [courseId, records]);

  useEffect(() => {
    if (!courseId) return;
    function onRefresh(event: Event) {
      const detail = (event as CustomEvent<{ ymd?: string }>).detail;
      const ymd = detail?.ymd;
      const ids = records
        .filter((record) => !ymd || record.recordDate === ymd)
        .map((record) => record.id)
        .filter((value): value is number => typeof value === "number");
      if (!courseId) return;
      if (ids.length === 0) {
        setAttByRec((prev) => ({ ...prev }));
        return;
      }
      (async () => {
        try {
          const pairs = await Promise.all(
            ids.map(async (recordId) => {
              try {
                const list = await listRecordAttendance(courseId, recordId);
                const map: Record<number, boolean> = {};
                list.forEach((entry) => {
                  map[entry.studentId] = !!entry.present;
                });
                return [recordId, map] as const;
              } catch {
                return [recordId, undefined] as const;
              }
            })
          );
          setAttByRec((prev) => {
            const next = { ...prev };
            pairs.forEach(([recordId, map]) => {
              if (map) next[recordId] = map;
            });
            return next;
          });
        } catch {
          // ignore
        } finally {
          setAttByRec((prev) => ({ ...prev }));
        }
      })();
    }
    window.addEventListener(
      "calendar:classes-refresh",
      onRefresh as EventListener
    );
    return () => {
      window.removeEventListener(
        "calendar:classes-refresh",
        onRefresh as EventListener
      );
    };
  }, [courseId, records]);

  const readAttendanceCache = useCallback(
    (recordId: number): Record<number, boolean> => {
      if (!courseId) return {};
      try {
        return JSON.parse(
          localStorage.getItem(`attendance:${courseId}:${recordId}`) || "{}"
        ) as Record<number, boolean>;
      } catch {
        return {};
      }
    },
    [courseId]
  );

  const getAttendanceMap = useCallback(
    (recordId: number) => attByRec[recordId] || readAttendanceCache(recordId),
    [attByRec, readAttendanceCache]
  );

  const info = useMemo(
    () => (course ? buildCourseInfo(course) : null),
    [course]
  );

  const history = useMemo<CourseHistoryItem[]>(() => {
    if (!course) return [];
    return records.map((record) => ({
      id: record.id,
      date: new Date(record.recordDate),
      dateLabel: `${record.recordDate} (${
        "일월화수목금토"[new Date(record.recordDate).getDay()]
      })`,
      time: formatCourseTime(course),
      type: new Date(record.recordDate) < new Date() ? "지난 수업" : "예정",
      notes: record.notes || record.content || null,
    }));
  }, [course, records]);

  const totalStudents = useMemo(() => {
    if (course?.enrolledCount != null) return course.enrolledCount;
    return students.length;
  }, [course?.enrolledCount, students.length]);

  const capacity = course?.capacity;

  const completedCount = useMemo(
    () => history.filter((entry) => entry.type === "지난 수업").length,
    [history]
  );

  const progressPct = useMemo(() => {
    const total = history.length || 0;
    if (!total) return null;
    return Math.round((completedCount / total) * 100);
  }, [completedCount, history.length]);

  const avgAttendance = useMemo(() => {
    if (!history.length) return null as null | number;
    let presentSum = 0;
    let processedSum = 0;
    for (const entry of history) {
      if (!entry.id) continue;
      const map = getAttendanceMap(entry.id);
      const values = Object.values(map);
      const present = values.filter((value) => value === true).length;
      const absent = values.filter((value) => value === false).length;
      const processed = present + absent;
      if (processed > 0) {
        presentSum += present;
        processedSum += processed;
      }
    }
    if (processedSum === 0) return null;
    return Math.round((presentSum / processedSum) * 100);
  }, [history, getAttendanceMap]);

  const onExportRecords = useCallback(async () => {
    if (!courseId) return;
    setExportingRecords(true);
    try {
      const range = buildFilterRange(filterYear, filterMonth);
      const blob = await downloadCourseRecordsExcel(courseId, range);
      const baseTitle = course?.title || `course_${courseId}`;
      const dateLabel =
        range.from && range.to
          ? `${range.from}_${range.to}`
          : formatDateKey(new Date());
      const filename = sanitizeFilename(`${baseTitle}_${dateLabel}_records`);
      saveBlobAsFile(blob, `${filename}.xlsx`);
    } catch (err) {
      onError(readableError(err, "수업 내역 엑셀 추출에 실패했습니다."));
    } finally {
      setExportingRecords(false);
    }
  }, [courseId, filterYear, filterMonth, course?.title, onError]);

  const onChangeYear = useCallback((value: number | null) => {
    setFilterYear(value);
  }, []);

  const onChangeMonth = useCallback((value: number) => {
    setFilterMonth(value);
  }, []);

  const resetFilters = useCallback(() => {
    const now = new Date();
    setFilterYear(now.getFullYear());
    setFilterMonth(0);
  }, []);

  return {
    course,
    loading,
    error,
    students,
    stuLoading,
    stuError,
    filterYear,
    onChangeYear,
    filterMonth,
    onChangeMonth,
    resetFilters,
    exportingRecords,
    onExportRecords,
    history,
    info,
    totalStudents,
    capacity,
    completedCount,
    progressPct,
    avgAttendance,
    getAttendanceMap,
  };
}
