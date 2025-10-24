import { useQuery } from "@tanstack/react-query";
import { fetchDashboardSummary } from "../api/dashboard";
import type { DashboardSummary } from "../types/dashboard";

type Status = "idle" | "loading" | "success" | "error";

export function useDashboardSummary() {
  const query = useQuery<DashboardSummary>({
    queryKey: ["dashboard", "summary"],
    queryFn: fetchDashboardSummary,
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
  });

  const status: Status =
    query.status === "pending"
      ? "loading"
      : query.status === "error"
        ? "error"
        : query.status === "success"
          ? "success"
          : "idle";

  return {
    status,
    data: query.data ?? null,
    error: query.error,
    refresh: query.refetch,
  };
}
