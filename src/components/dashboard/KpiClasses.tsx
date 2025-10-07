import { KPI, ClassIcon } from "./KPI";
import type { DashboardSummary } from "../../types/dashboard";

type Props = {
  data: DashboardSummary | null;
  loading: boolean;
  error: boolean;
  onRetry: () => void;
};

export default function KpiClasses({ data, loading, error, onRetry }: Props) {
  const value = data ? `${data.classCountToday}개` : "—";
  const date = data ? data.dateLabel : "—";
  return (
    <KPI
      title="오늘 수업"
      icon={<ClassIcon />}
      iconAccent="violet"
      value={value}
      footerLeft={date}
      footerRight={undefined}
      loading={loading}
      error={error}
      onRetry={onRetry}
    />
  );
}
