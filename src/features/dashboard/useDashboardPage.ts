import { useDashboardSummary } from "@/hooks/useDashboardSummary";

export function useDashboardPage() {
  const summary = useDashboardSummary();

  return {
    status: summary.status,
    data: summary.data,
    error: summary.error,
    refresh: summary.refresh,
    loading: summary.status === "loading",
  } as const;
}

export type UseDashboardPageReturn = ReturnType<typeof useDashboardPage>;
