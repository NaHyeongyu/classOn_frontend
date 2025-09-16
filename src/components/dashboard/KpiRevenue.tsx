import { KPI, CreditIcon, DeltaPill } from "./KPI";
import type { DashboardSummary } from "../../types/dashboard";

type Props = {
  data: DashboardSummary | null;
  loading: boolean;
  error: boolean;
  onRetry: () => void;
};

export default function KpiRevenue({ data, loading, error, onRetry }: Props) {
  const value = data ? `₩${data.thisMonthRevenue.toLocaleString()}` : "—";
  const delta = data ? `+${data.revenueMoMPercent}%` : "—";
  return (
    <KPI
      title="이번 달 매출"
      icon={<CreditIcon />}
      iconAccent="emerald"
      value={value}
      footerLeft="전월 대비"
      footerRight={<DeltaPill $tone="positive">{delta}</DeltaPill>}
      loading={loading}
      error={error}
      onRetry={onRetry}
    />
  );
}
