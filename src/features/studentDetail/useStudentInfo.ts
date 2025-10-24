import { useCallback, useEffect, useMemo, useState } from "react";
import { getStudent, type Student } from "@/api/students";
import { readableError } from "@/lib/errors";

type UseStudentInfoOptions = {
  studentId: number | null;
};

type UseStudentInfoResult = {
  student: Student | null;
  loading: boolean;
  error: string | null;
  intlAge?: number;
  refresh: () => Promise<void>;
};

export function useStudentInfo({
  studentId,
}: UseStudentInfoOptions): UseStudentInfoResult {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!studentId || Number.isNaN(studentId)) {
      setStudent(null);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const detail = await getStudent(studentId);
      setStudent(detail);
    } catch (err) {
      setError(readableError(err, "원생 정보를 불러오지 못했습니다."));
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    void load();
  }, [load]);

  const intlAge = useMemo(() => {
    const birth = student?.birthDate;
    if (!birth) return undefined;
    const [y, m, d] = birth.split("-").map(Number);
    if (!y || !m || !d) return undefined;
    const now = new Date();
    let age = now.getFullYear() - y;
    const mm = now.getMonth() + 1;
    const dd = now.getDate();
    if (mm < m || (mm === m && dd < d)) age -= 1;
    return age;
  }, [student?.birthDate]);

  return {
    student,
    loading,
    error,
    intlAge,
    refresh: load,
  };
}
