import { useCallback, useEffect, useMemo, useState } from "react";
import { listExams, listExamResults } from "@/api/exams";
import type { Student } from "@/api/students";
import { readableError } from "@/lib/errors";
import type { StudentGradeEntry } from "./types";

type UseStudentGradesOptions = {
  studentId: number | null;
  courses: Student["courses"];
  enabled: boolean;
};

type UseStudentGradesResult = {
  grades: StudentGradeEntry[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
};

export function useStudentGrades({
  studentId,
  courses,
  enabled,
}: UseStudentGradesOptions): UseStudentGradesResult {
  const [rawGrades, setRawGrades] = useState<StudentGradeEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!studentId || !courses?.length) {
      setRawGrades([]);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const courseRefs = Array.isArray(courses) ? courses : [];
      const pairs = (
        await Promise.all(
          courseRefs.map(async ({ id }) => {
            const list = await listExams(id);
            return list.map((exam) => ({ courseId: id, exam }));
          })
        )
      ).flat();
      const results = await Promise.all(
        pairs.map(async ({ courseId, exam }) => {
          try {
            const rows = await listExamResults(courseId, exam.id);
            const mine = rows.find((row) => row.studentId === studentId);
            if (!mine) return null;
            const examDate =
              exam.examDate ||
              (exam.createdAt ? exam.createdAt.slice(0, 10) : "");
            const entry: StudentGradeEntry = {
              id: `exam:${courseId}:${exam.id}:${studentId}`,
              date: examDate,
              subject: exam.title,
              courseId,
              score: mine.score,
              outOf: mine.outOf,
              level: mine.level,
              note: mine.note,
            };
            return entry;
          } catch {
            return null;
          }
        })
      );
      setRawGrades(results.filter((entry): entry is StudentGradeEntry => !!entry));
    } catch (err) {
      setError(readableError(err, "시험 성적을 불러오지 못했습니다."));
    } finally {
      setLoading(false);
    }
  }, [courses, studentId]);

  useEffect(() => {
    if (!enabled) return;
    void reload();
  }, [enabled, reload]);

  const grades = useMemo(() => {
    const cloned = rawGrades.slice();
    return cloned.sort((a, b) => {
      const ta = Date.parse(a.date || "");
      const tb = Date.parse(b.date || "");
      return (isNaN(tb) ? 0 : tb) - (isNaN(ta) ? 0 : ta);
    });
  }, [rawGrades]);

  return {
    grades,
    loading,
    error,
    reload,
  };
}
