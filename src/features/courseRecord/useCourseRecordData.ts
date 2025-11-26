import { useCallback, useEffect, useState } from "react";
import {
  getCourse,
  listCourseRecords,
  listCourseStudents,
  type Course,
  type CourseRecord,
} from "@/api/courses";
import type { Student } from "@/api/students";
import { readableError } from "@/lib/errors";

type UseCourseRecordDataParams = {
  courseId: number | null;
  recId: number | null;
  ymd?: string | null;
};

export function useCourseRecordData({
  courseId,
  recId,
  ymd,
}: UseCourseRecordDataParams) {
  const [course, setCourse] = useState<Course | null>(null);
  const [record, setRecord] = useState<CourseRecord | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (!courseId) {
      setCourse(null);
      setRecord(null);
      setStudents([]);
      setError(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [courseData, recordsData, studentsData] = await Promise.all([
          getCourse(courseId),
          listCourseRecords(courseId),
          listCourseStudents(courseId),
        ]);
        if (cancelled) return;
        setCourse(courseData);
        const foundById =
          recordsData.find((item: CourseRecord) => item.id === recId) || null;
        const foundByDate =
          ymd && !foundById
            ? recordsData.find((item: CourseRecord) => item.recordDate === ymd) || null
            : null;
        setRecord(foundById ?? foundByDate ?? null);
        setStudents(studentsData);
      } catch (err) {
        if (!cancelled) {
          setError(readableError(err, "수업 내역을 불러오지 못했습니다."));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [courseId, recId, ymd, refreshKey]);

  return {
    course,
    record,
    setRecord,
    students,
    loading,
    error,
    refresh,
  };
}
