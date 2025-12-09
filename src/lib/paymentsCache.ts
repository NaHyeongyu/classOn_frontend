import type { QueryClient } from "@tanstack/react-query";

export function invalidatePaymentsQueries(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: ["payments", "summary"] }).catch(() => {});
  queryClient.invalidateQueries({ queryKey: ["payments", "invoices"] }).catch(() => {});
  queryClient.invalidateQueries({ queryKey: ["payments", "history"] }).catch(() => {});
  queryClient.invalidateQueries({ queryKey: ["payments", "history", "pending"] }).catch(() => {});
}
