import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPaymentReminderSetting,
  updatePaymentReminderSetting,
  type PaymentReminderSetting,
} from "@/api/payments";

const DEFAULT_DAYS = 7;

export function usePaymentReminderSettings() {
  const queryClient = useQueryClient();
  const query = useQuery<PaymentReminderSetting | null>({
    queryKey: ["payments", "reminder-setting"],
    queryFn: async () => {
      try {
        return await getPaymentReminderSetting();
      } catch (err) {
        if (err instanceof Error && (err as { status?: number }).status === 400) {
          return null;
        }
        throw err;
      }
    },
    staleTime: 60_000,
  });

  const mutation = useMutation({
    mutationFn: async (days: number) => {
      const normalized = Number.isFinite(days) && days > 0 ? Math.round(days) : DEFAULT_DAYS;
      return await updatePaymentReminderSetting({ reminderDays: normalized });
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["payments", "reminder-setting"], data);
    },
  });

  const rawDays = query.data?.reminderDays ?? null;
  const configured = typeof rawDays === "number" && rawDays > 0;
  const error = configured && query.error instanceof Error ? query.error.message : null;

  return {
    days: configured ? rawDays : null,
    loading: query.isLoading,
    error,
    configured,
    setDays: (next: number) => mutation.mutate(next),
    saving: mutation.isPending,
    defaultDays: DEFAULT_DAYS,
    refetch: query.refetch,
  };
}
