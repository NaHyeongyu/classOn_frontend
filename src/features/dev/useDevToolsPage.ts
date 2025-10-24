import { useCallback, useEffect, useState } from "react";
import { fetchJSON } from "@/lib/fetcher";
import { seedDemo } from "@/api/dev";

type Stats = {
  academyId: number | null;
  students: number;
  courses: number;
  counsels: number;
};

export function useDevToolsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [busy, setBusy] = useState(false);
  const [busyCourses, setBusyCourses] = useState(false);
  const [busySeed, setBusySeed] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [msgCourses, setMsgCourses] = useState<string | null>(null);
  const [msgSeed, setMsgSeed] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [errCourses, setErrCourses] = useState<string | null>(null);
  const [errSeed, setErrSeed] = useState<string | null>(null);
  const [seedStudents, setSeedStudents] = useState(50);
  const [seedCourses, setSeedCourses] = useState(8);
  const [seedCounsels, setSeedCounsels] = useState(40);

  const loadStats = useCallback(async () => {
    try {
      const s = await fetchJSON<Stats>("/api/dev/stats");
      setStats(s);
      setErr(null);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "통계 조회 실패";
      setErr(message);
      setStats(null);
    }
  }, []);

  useEffect(() => {
    void loadStats();
  }, [loadStats]);

  const onReset = useCallback(async () => {
    setBusy(true);
    setErr(null);
    setMsg(null);
    try {
      const res = await fetchJSON<{
        recordsDeleted?: number;
        attendanceDeleted?: number;
        filesDeleted?: number;
        counselsDeleted?: number;
      }>("/api/dev/reset", { method: "POST" });
      setMsg(
        `초기화 완료: records=${res.recordsDeleted ?? "-"}, attendance=${
          res.attendanceDeleted ?? "-"
        }, files=${res.filesDeleted ?? "-"}, counsels=${
          res.counselsDeleted ?? "-"
        }`,
      );
      await loadStats();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "초기화 실패";
      setErr(message);
    } finally {
      setBusy(false);
    }
  }, [loadStats]);

  const onResetCourses = useCallback(async () => {
    setBusyCourses(true);
    setErrCourses(null);
    setMsgCourses(null);
    try {
      const res = await fetchJSON<{
        coursesDeleted?: number;
        recordsDeleted?: number;
        attendanceDeleted?: number;
        filesDeleted?: number;
        enrollmentsCleared?: number;
      }>("/api/dev/reset-courses", { method: "POST" });
      setMsgCourses(
        `수업 초기화 완료: courses=${res.coursesDeleted ?? "-"}, records=${
          res.recordsDeleted ?? "-"
        }, attendance=${res.attendanceDeleted ?? "-"}, files=${
          res.filesDeleted ?? "-"
        }, enrollmentsCleared=${res.enrollmentsCleared ?? "-"}`,
      );
      await loadStats();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "수업 초기화 실패";
      setErrCourses(message);
    } finally {
      setBusyCourses(false);
    }
  }, [loadStats]);

  const onSeed = useCallback(async () => {
    setBusySeed(true);
    setErrSeed(null);
    setMsgSeed(null);
    try {
      const res = await seedDemo({
        students: seedStudents,
        courses: seedCourses,
        counsels: seedCounsels,
      });
      const payload = res as Record<string, number | undefined>;
      setMsgSeed(
        `생성 완료: students=${payload.studentsCreated ?? "-"}, courses=${
          payload.coursesCreated ?? "-"
        }, counsels=${payload.counselsCreated ?? "-"}`,
      );
      await loadStats();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "데이터 생성 실패";
      setErrSeed(message);
    } finally {
      setBusySeed(false);
    }
  }, [loadStats, seedCounsels, seedCourses, seedStudents]);

  return {
    stats,
    busy,
    busyCourses,
    busySeed,
    msg,
    msgCourses,
    msgSeed,
    err,
    errCourses,
    errSeed,
    seedStudents,
    setSeedStudents,
    seedCourses,
    setSeedCourses,
    seedCounsels,
    setSeedCounsels,
    loadStats,
    onReset,
    onResetCourses,
    onSeed,
  };
}
