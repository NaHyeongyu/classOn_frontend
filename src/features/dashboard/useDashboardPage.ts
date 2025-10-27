import { useMemo } from "react";
import { routes } from "@/routes";
import { useDashboardSummary } from "@/hooks/useDashboardSummary";

type DashboardSummaryState = ReturnType<typeof useDashboardSummary>;

export type DashboardKpiProps = {
  data: DashboardSummaryState["data"];
  loading: boolean;
  error: boolean;
  onRetry: DashboardSummaryState["refresh"];
};

export type DashboardPageData = {
  title: string;
  createStudentHref: string;
  createCourseHref: string;
  kpiProps: DashboardKpiProps;
};

export function useDashboardPage(): DashboardPageData {
  const summary = useDashboardSummary();

  const kpiProps = useMemo<DashboardKpiProps>(
    () => ({
      data: summary.data,
      loading: summary.status === "loading",
      error: Boolean(summary.error),
      onRetry: summary.refresh,
    }),
    [summary.data, summary.error, summary.refresh, summary.status],
  );

  return useMemo<DashboardPageData>(
    () => ({
      title: "대시보드",
      createStudentHref: routes.studentsNew,
      createCourseHref: routes.classesNew,
      kpiProps,
    }),
    [kpiProps],
  );
}
