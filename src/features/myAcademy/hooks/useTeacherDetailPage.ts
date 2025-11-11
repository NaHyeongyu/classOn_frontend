import { useCallback, useEffect, useState } from "react";
import { getTeacherDetail, type TeacherDetail } from "@/api/teachers";
import { getErrorMessage } from "@/lib/errors";

export function useTeacherDetailPage(teacherId: string | number | null | undefined) {
  const [detail, setDetail] = useState<TeacherDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!teacherId) {
      setDetail(null);
      setError("강사 정보를 확인할 수 없습니다. 올바른 링크인지 확인 후 다시 시도해 주세요.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await getTeacherDetail(teacherId);
      setDetail(res);
    } catch (err) {
      setError(getErrorMessage(err, "강사 상세 정보를 불러오지 못했습니다."));
    } finally {
      setLoading(false);
    }
  }, [teacherId]);

  useEffect(() => {
    void load();
  }, [load]);

  return {
    detail,
    loading,
    error,
    refresh: load,
  };
}
