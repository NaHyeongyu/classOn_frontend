import { useEffect, useState } from "react";
import { getStudentAttendance, type StudentAttendance } from "@/api/students";
import { readableError } from "@/lib/errors";

type UseStudentAttendanceOptions = {
  studentId: number | null;
  enabled: boolean;
};

type UseStudentAttendanceResult = {
  rows: StudentAttendance[];
  loading: boolean;
  error: string | null;
};

export function useStudentAttendance({
  studentId,
  enabled,
}: UseStudentAttendanceOptions): UseStudentAttendanceResult {
  const [rows, setRows] = useState<StudentAttendance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!studentId || !enabled) {
      setRows([]);
      setError(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const res = await getStudentAttendance(studentId, { size: 200 });
        if (!cancelled) {
          setRows(res?.content || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(readableError(err, "출석 정보를 불러오지 못했습니다."));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [studentId, enabled]);

  return { rows, loading, error };
}
