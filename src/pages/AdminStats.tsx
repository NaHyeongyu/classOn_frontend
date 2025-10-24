import { routes } from "@/routes";
import { useToast } from "@/components/common/Toast";
import { AdminStatsPageView } from "@/components/admin/AdminStatsPageView";
import {
  RANGE_OPTIONS,
  useAdminStatsPage,
} from "@/features/admin/useAdminStatsPage";

export default function AdminStatsPage() {
  const { error: toastError } = useToast();
  const state = useAdminStatsPage({ toastError });

  return (
    <AdminStatsPageView
      overviewStats={state.overviewStats}
      loading={state.loading}
      error={state.error}
      rangeDays={state.rangeDays}
      onChangeRange={(value) =>
        state.setRangeDays(value as (typeof RANGE_OPTIONS)[number])
      }
      rangeOptions={RANGE_OPTIONS}
      lastUpdatedLabel={state.lastUpdatedLabel}
      fromDateStr={state.fromDateStr}
      toDateStr={state.toDateStr}
      onRefresh={() => state.fetchStats()}
      dashboardHref={routes.admin}
      paymentTrend={state.paymentTrend}
      loginTrend={state.loginTrend}
      topPaymentAcademies={state.topPaymentAcademies}
      topUsageAcademies={state.topUsageAcademies}
    />
  );
}
