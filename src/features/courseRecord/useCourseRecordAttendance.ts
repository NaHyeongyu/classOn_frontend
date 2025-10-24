import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  listRecordAttendance,
  upsertAttendance,
  type Attendance,
  type CourseRecord,
} from "@/api/courses";
import type { Student } from "@/api/students";
import { invalidateCacheByPrefix } from "@/lib/fetcher";
import { readableError } from "@/lib/errors";
import { formatYMD } from "@/features/calendar/dateUtils";

export type AttendanceRow = {
  id: number;
  name: string;
  isExtra?: boolean;
  status: "present" | "absent" | "none";
};

type AttendanceBuckets = {
  present: number;
  absent: number;
  none: number;
  total: number;
};

type UseAttendanceOptions = {
  courseId: number | null;
  record: CourseRecord | null;
  students: Student[];
  ymd?: string | null;
  showError: (message: string) => void;
};

export function useCourseRecordAttendance({
  courseId,
  record,
  students,
  ymd,
  showError,
}: UseAttendanceOptions) {
  const [attVersion, setAttVersion] = useState(0);
  const [attMap, setAttMap] = useState<Record<number, boolean>>({});
  const [attNoteMap, setAttNoteMap] = useState<Record<number, string>>({});
  const [attStudentNames, setAttStudentNames] = useState<Record<number, string>>(
    {}
  );
  const noteTimersRef = useRef<Record<number, number>>({});

  const [attLoading, setAttLoading] = useState(false);
  const [attError, setAttError] = useState<string | null>(null);
  const [attSavingMap, setAttSavingMap] = useState<Record<number, boolean>>({});

  const [confirmOne, setConfirmOne] = useState<{
    open: boolean;
    studentId: number | null;
    target: boolean | null;
  }>({ open: false, studentId: null, target: null });

  const [bulkStatus, setBulkStatus] = useState<"present" | "absent" | null>(
    null
  );
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Record<number, boolean>>({});

  const getLocalAttendanceKey = useCallback(() => {
    if (!courseId) return `attendance::`;
    if (record?.id) return `attendance:${courseId}:${record.id}`;
    if (ymd) return `attendanceDate:${courseId}:${ymd}`;
    return `attendance:${courseId}:`;
  }, [courseId, record?.id, ymd]);

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
    if (record?.id) return attMap;
    return localAttMap;
  }, [attMap, localAttMap, record?.id]);

  const attendanceRows = useMemo<AttendanceRow[]>(() => {
    const baseRows = students.map((student) => ({
      id: student.id,
      name: student.name,
    }));
    const baseIds = new Set(baseRows.map((row) => row.id));
    const extraRows = Object.keys(presentMap)
      .map((key) => Number(key))
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

  const attendanceBuckets = useMemo<AttendanceBuckets>(() => {
    let present = 0;
    let absent = 0;
    let none = 0;
    for (const row of actionableRows) {
      if (row.status === "present") present += 1;
      else if (row.status === "absent") absent += 1;
      else none += 1;
    }
    return {
      present,
      absent,
      none,
      total: actionableRows.length,
    };
  }, [actionableRows]);

  const presentCount = useMemo(
    () => Object.values(presentMap).filter(Boolean).length,
    [presentMap]
  );

  const isPastRecord = useMemo(() => {
    const recDateStr = record?.recordDate || ymd || "";
    return recDateStr
      ? new Date(recDateStr) < new Date(new Date().toDateString())
      : false;
  }, [record?.recordDate, ymd]);

  const attendanceDenominator = useMemo(() => {
    if (isPastRecord) return Object.keys(presentMap).length;
    return students.length;
  }, [isPastRecord, presentMap, students.length]);

  const attendanceRate = useMemo(
    () =>
      attendanceDenominator
        ? Math.round((presentCount / attendanceDenominator) * 100)
        : null,
    [presentCount, attendanceDenominator]
  );

  const emitCalendarClassesRefresh = useCallback(
    (target?: string) => {
      const payload =
        target || record?.recordDate || ymd || formatYMD(new Date());
      window.dispatchEvent(
        new CustomEvent("calendar:classes-refresh", {
          detail: { ymd: payload },
        })
      );
    },
    [record?.recordDate, ymd]
  );

  const setAttendanceLocal = useCallback(
    (studentId: number, present: boolean) => {
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
    },
    [courseId, getLocalAttendanceKey, emitCalendarClassesRefresh]
  );

  const clearAttendanceLocal = useCallback(
    (studentId: number) => {
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
    },
    [courseId, getLocalAttendanceKey]
  );

  useEffect(() => {
    if (!courseId || !record?.id) return;
    let cancelled = false;
    (async () => {
      setAttLoading(true);
      setAttError(null);
      try {
        const list = await listRecordAttendance(courseId, record.id);
        if (cancelled) return;
        const nextMap: Record<number, boolean> = {};
        const notes: Record<number, string> = {};
        const names: Record<number, string> = {};
        (list as Attendance[]).forEach((entry) => {
          nextMap[entry.studentId] = !!entry.present;
          if (entry.reason) notes[entry.studentId] = entry.reason;
          if (entry.studentName) names[entry.studentId] = entry.studentName;
        });
        setAttMap(nextMap);
        setAttNoteMap(notes);
        setAttStudentNames(names);
      } catch (err) {
        if (!cancelled) {
          setAttError(readableError(err, "출석 정보를 불러오지 못했습니다."));
        }
      } finally {
        if (!cancelled) setAttLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [courseId, record?.id]);

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

  const updateNote = useCallback(
    (studentId: number, value: string, status: "present" | "absent" | "none") => {
      setAttNoteMap((prev) => ({ ...prev, [studentId]: value }));
      if (courseId) {
        const key = getLocalAttendanceKey().replace(
          "attendance",
          "attendanceNote"
        );
        try {
          const obj = JSON.parse(localStorage.getItem(key) || "{}");
          obj[String(studentId)] = value;
          localStorage.setItem(key, JSON.stringify(obj));
        } catch {
          // ignore local persistence failure
        }
      }
      if (courseId && record?.id && status !== "none") {
        const timers = noteTimersRef.current;
        if (timers[studentId]) window.clearTimeout(timers[studentId]);
        timers[studentId] = window.setTimeout(async () => {
          setAttSavingMap((map) => ({ ...map, [studentId]: true }));
          try {
            const reason = value.trim() || undefined;
            await upsertAttendance(courseId, record.id!, studentId, {
              present: status === "present",
              reason,
              source: "MANUAL",
            });
          } catch (err) {
            if (import.meta.env.DEV) {
              console.debug("메모 자동 저장 실패", err);
            }
          } finally {
            setAttSavingMap((map) => {
              const next = { ...map };
              delete next[studentId];
              return next;
            });
          }
        }, 600);
      }
    },
    [courseId, record?.id, getLocalAttendanceKey]
  );

  const confirmAndSetAttendance = useCallback(
    async (studentId: number, target: boolean) => {
      if (courseId && record?.id) {
        setAttSavingMap((map) => ({ ...map, [studentId]: true }));
        try {
          const reason = attNoteMap[studentId]?.trim() || undefined;
          await upsertAttendance(courseId, record.id, studentId, {
            present: target,
            reason,
            source: "MANUAL",
          });
          setAttMap((map) => ({ ...map, [studentId]: target }));
          invalidateCacheByPrefix([
            "/api/calendar/classes",
            "/api/calendar/classes-range",
            "/api/dashboard/summary",
            "/api/dashboard/attendance-today",
            "/api/attendance/daily",
            `/api/courses/${courseId}/records/${record.id}/attendance`,
          ]);
          emitCalendarClassesRefresh(record.recordDate ?? ymd ?? undefined);
          try {
            window.dispatchEvent(
              new CustomEvent("dashboard:attendance-refresh", {
                detail: {},
              })
            );
          } catch (err) {
            if (import.meta.env.DEV) {
              console.debug("대시보드 출석 이벤트 전파 실패", err);
            }
          }
        } catch (err) {
          showError(readableError(err, "출석 처리에 실패했습니다."));
        } finally {
          setAttSavingMap((map) => ({ ...map, [studentId]: false }));
        }
      } else {
        setAttendanceLocal(studentId, target);
      }
    },
    [
      courseId,
      record?.id,
      record?.recordDate,
      attNoteMap,
      setAttendanceLocal,
      emitCalendarClassesRefresh,
      showError,
      ymd,
    ]
  );

  const promptSetAttendance = useCallback((studentId: number, target: boolean) => {
    setConfirmOne({ open: true, studentId, target });
  }, []);

  const openBulkSelect = useCallback(() => {
    const initial: Record<number, boolean> = {};
    actionableRows.forEach((row) => {
      initial[row.id] = row.status !== "present";
    });
    setSelectedIds(initial);
    setBulkDialogOpen(true);
  }, [actionableRows]);

  const cancelBulkDialog = useCallback(() => {
    if (bulkStatus) return;
    setBulkDialogOpen(false);
    setSelectedIds({});
  }, [bulkStatus]);

  const bulkSetAttendance = useCallback(
    async (target: boolean, targetIds?: number[]) => {
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
        setAttSavingMap((map) => {
          const next = { ...map };
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
          } catch (err) {
            if (!failure) failure = err;
          }
        }
        setAttSavingMap((map) => {
          const next = { ...map };
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
          } catch (err) {
            if (import.meta.env.DEV) {
              console.debug("대시보드 출석 이벤트 전파 실패", err);
            }
          }
          success = true;
        }
        if (failure) {
          showError(
            readableError(failure, `일괄 ${label} 처리 중 일부가 실패했습니다.`)
          );
        }
      } else {
        candidates.forEach(({ id }) => setAttendanceLocal(id, target));
        success = candidates.length > 0;
      }
      setBulkStatus(null);
      return success;
    },
    [
      attendanceRows,
      courseId,
      record?.id,
      attNoteMap,
      emitCalendarClassesRefresh,
      setAttendanceLocal,
      showError,
      record?.recordDate,
      ymd,
    ]
  );

  const confirmBulkSelection = useCallback(async () => {
    const ids = Object.entries(selectedIds)
      .filter(([, value]) => value)
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
  }, [bulkSetAttendance, selectedIds]);

  const selectedCount = useMemo(
    () => Object.values(selectedIds).filter(Boolean).length,
    [selectedIds]
  );

  return {
    attLoading,
    attError,
    attSavingMap,
    attendanceRows,
    actionableRows,
    attendanceBuckets,
    attendanceRate,
    presentCount,
    bulkStatus,
    bulkDialogOpen,
    selectedIds,
    setSelectedIds,
    selectedCount,
    openBulkSelect,
    cancelBulkDialog,
    confirmBulkSelection,
    bulkSetAttendance,
    attNoteMap,
    updateNote,
    clearAttendanceLocal,
    confirmOne,
    setConfirmOne,
    promptSetAttendance,
    confirmAndSetAttendance,
  };
}
