import { useQuery } from "@tanstack/react-query";
import { listPaymentInvoices } from "@/api/payments";
import type { PageResult } from "@/types/paging";
import type { PaymentHistoryRow } from "@classon/shared-types";

export function useCalendarPaymentInvoices(enabled = true) {
  return useQuery<PageResult<PaymentHistoryRow>>({
    queryKey: ["calendar", "payments", "invoices"],
    queryFn: () => listPaymentInvoices({ status: "UNPAID", page: 0, size: 500 }),
    staleTime: 60_000,
    enabled,
  });
}
