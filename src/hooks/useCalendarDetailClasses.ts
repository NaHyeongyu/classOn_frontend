import { useCallback, useEffect, useMemo, useState } from "react";
import { listCourses, createCourseRecord, type Course } from "@/api/courses";
import { invalidateCacheByPrefix } from "@/lib/fetcher";
import { getClassesOn } from "@/api/calendar";
import type { ClassItem } from "@/types/calendarDetail";
import { readableError } from "@/lib/errors";

type UseCalendarDetailClassesOptions = {
  ymd: string;
  derivedClasses: ClassItem[];
  warning: (message: string) => void;
};

type RawRow = {
  startTime?: string;
  start_at?: string;
  startAt?: string;
  start?: string;
  endTime?: string;
  end_at?: string;
  endAt?: string;
  end?: string;
  courseTitle?: string;
  courseId?: number;
  recordDate?: string;
  date?: string;
  recordId?: number;
  id?: number;
  topic?: string;
  notes?: string;
  content?: string;
  attPresent?: number;
  presentCount?: number;
  attendancePresent?: number;
  attAbsent?: number;
  absentCount?: number;
  attendanceAbsent?: number;
  attUnprocessed?: number;
  attendance?: { present?: number; absent?: number };
};

function numOr(...vals: unknown[]): number {
  for (const value of vals) {
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
  }
  return 0;
}

function cleanNotes(value?: string | null): string | null {
  if (!value) return null;
  const trimmed = String(value).trim();
  if (trimmed === "정기 수업" || trimmed === "정기수업") return null;
  return trimmed || null;
}

function toHHMM(value?: string | null) {
  if (!value) return "";
  try {
    const str = String(value);
    const match = str.match(/(\d{2}):(\d{2})/);
    return match ? `${match[1]}:${match[2]}` : "";
  } catch {
    return "";
  }
}

function toHHMMSS(value: string): string | undefined {
  if (!value) return undefined;
  const [h, m] = value.split(":");
  return `${h?.padStart(2, "0")}:${m?.padStart(2, "0")}:00`;
}

export function useCalendarDetailClasses({
  ymd,
  derivedClasses,
  warning,
}: UseCalendarDetailClassesOptions) {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [courseRows, setCourseRows] = useState<Course[]>([]);
  const [courseFilter, setCourseFilter] = useState("");
  const [courseBusy, setCourseBusy] = useState(false);
  const [courseErr, setCourseErr] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [savingClass, setSavingClass] = useState(false);
  const [addErr, setAddErr] = useState<string | null>(null);
  const [startHour, setStartHour] = useState<string>("");
  const [startMin, setStartMin] = useState<string>("");
  const [endHour, setEndHour] = useState<string>("");
  const [endMin, setEndMin] = useState<string>("");

  const hours24 = useMemo(
    () => Array.from({ length: 24 }, (_, h) => String(h).padStart(2, "0")),
    [],
  );
  const mins5 = useMemo(
    () => ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"],
    [],
  );

  const mapRows = useCallback(
    (list: RawRow[]): ClassItem[] =>
      list.map((row) => {
        const start = row.startTime ?? row.start_at ?? row.startAt ?? row.start ?? null;
        const end = row.endTime ?? row.end_at ?? row.endAt ?? row.end ?? null;
        const present = numOr(
          row.attPresent,
          row.presentCount,
          row.attendancePresent,
          row.attendance?.present,
        );
        const absent = numOr(
          row.attAbsent,
          row.absentCount,
          row.attendanceAbsent,
          row.attendance?.absent,
        );
        const unprocessed = numOr(row.attUnprocessed);
        const notes = cleanNotes(row.notes || row.content || row.topic || null);
        return {
          subject: row.courseTitle || "수업",
          time: `${toDisplay(start)} ~ ${toDisplay(end)}`,
          room: "-",
          teacher: "-",
          student: "-",
          done: false,
          courseId: row.courseId || undefined,
          date: row.recordDate || row.date || ymd,
          recordId: row.recordId || row.id,
          notes,
          attPresent: present,
          attAbsent: absent,
          attUnprocessed: unprocessed,
        } as ClassItem;
      }),
    [ymd],
  );

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const list = await getClassesOn(ymd);
        if (cancelled) return;
        setClasses(mapRows(list));
      } catch {
        if (!cancelled) {
          setClasses(derivedClasses);
        }
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [derivedClasses, mapRows, ymd]);

  const openAddClass = async () => {
    setAddOpen(true);
    setAddErr(null);
    if (courseRows.length === 0) {
      setCourseBusy(true);
      setCourseErr(null);
      try {
        const res = await listCourses({ status: "IN_PROGRESS", size: 200 });
        setCourseRows(res.content);
      } catch (error) {
        setCourseErr(readableError(error, "수업 목록을 불러오지 못했습니다."));
      } finally {
        setCourseBusy(false);
      }
    }
  };

  const closeAddClass = () => {
    setAddOpen(false);
  };

  const pickCourse = (course: Course) => {
    setSelectedCourse(course);
    const start = toHHMM(course.startTime) || "00:00";
    const end = toHHMM(course.endTime) || "00:00";
    try {
      const [sh, sm] = start.split(":");
      setStartHour(sh);
      setStartMin(sm);
    } catch {
      /* ignore */
    }
    try {
      const [eh, em] = end.split(":");
      setEndHour(eh);
      setEndMin(em);
    } catch {
      /* ignore */
    }
    setAddErr(null);
  };

  const saveClass = async () => {
    if (!selectedCourse) {
      warning("수업 템플릿을 선택해 주세요.");
      return;
    }
    const start = toHHMMSS(
      `${(startHour || "00").padStart(2, "0")}:${(startMin || "00").padStart(2, "0")}`,
    );
    const end = toHHMMSS(
      `${(endHour || "00").padStart(2, "0")}:${(endMin || "00").padStart(2, "0")}`,
    );
    setSavingClass(true);
    setAddErr(null);
    try {
      await createCourseRecord(selectedCourse.id, {
        recordDate: ymd,
        startTime: start,
        endTime: end,
      });
      invalidateCacheByPrefix("/api/calendar/classes");
      invalidateCacheByPrefix("/api/calendar/classes-range");
      const list = await getClassesOn(ymd);
      setClasses(mapRows(list));
      setAddOpen(false);
      setSelectedCourse(null);
    } catch (error) {
      const msg = readableError(error, "");
      if (msg.includes("HTTP 409")) setAddErr("이미 등록된 수업이 있습니다.");
      else setAddErr("수업 추가에 실패했습니다.");
    } finally {
      setSavingClass(false);
    }
  };

  return {
    classes,
    addOpen,
    courseRows,
    courseFilter,
    courseBusy,
    courseErr,
    selectedCourse,
    savingClass,
    addErr,
    startHour,
    startMin,
    endHour,
    endMin,
    hours24,
    mins5,
    onAddClass: openAddClass,
    onCloseClassModal: closeAddClass,
    onPickCourse: pickCourse,
    onChangeCourseFilter: setCourseFilter,
    onChangeStartHour: setStartHour,
    onChangeStartMin: setStartMin,
    onChangeEndHour: setEndHour,
    onChangeEndMin: setEndMin,
    onSaveClass: saveClass,
  };
}

function toDisplay(value?: string | null) {
  if (!value) return "--:--";
  try {
    const match = String(value).match(/(\d{2}):(\d{2})/);
    return match ? `${match[1]}:${match[2]}` : "--:--";
  } catch {
    return "--:--";
  }
}
