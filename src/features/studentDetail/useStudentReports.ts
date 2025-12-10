import { useQuery } from "@tanstack/react-query";
import { listStudentReports, type StudentReport } from "@/api/students";
import { readableError } from "@/lib/errors";

export function useStudentReports(opts: { studentId: number | null; enabled: boolean }) {
  const { studentId, enabled } = opts;
  const query = useQuery({
    queryKey: ["students", studentId, "reports"],
    enabled: Boolean(studentId) && enabled,
    queryFn: async () => {
      if (!studentId) throw new Error("학생 ID가 필요합니다.");
      return await listStudentReports(studentId, { presign: true });
    },
  });

  let error: string | null = null;
  if (query.error) {
    error = readableError(query.error, "보고서 목록을 불러오지 못했습니다.");
  }

  return {
    reports: (query.data ?? []) as StudentReport[],
    loading: query.status === "pending",
    error,
    refresh: () => {
      void query.refetch();
    },
  };
}
