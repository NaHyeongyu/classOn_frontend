import { useEffect, useState } from "react";
import { listCourses, type Course } from "@/api/courses";
import { MARKETING_COURSE_FETCH_SIZE } from "./constants";
import { toErrorMessage } from "./utils";

export function useMarketingCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const page = await listCourses({ status: "IN_PROGRESS", size: MARKETING_COURSE_FETCH_SIZE });
        if (!active) return;
        setCourses(page.content ?? []);
      } catch (err) {
        if (!active) return;
        setCourses([]);
        setError(toErrorMessage(err, "수업 목록을 불러오지 못했습니다."));
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, []);

  return { courses, loading, error };
}
