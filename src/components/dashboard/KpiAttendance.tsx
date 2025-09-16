import { KPI, CheckIcon, DeltaPill } from "./KPI";
import type { DashboardSummary } from "../../types/dashboard";

type Props = {
  data: DashboardSummary | null;
  loading: boolean;
  error: boolean;
  onRetry: () => void;
};

export default function KpiAttendance({
  data,
  loading,
  error,
  onRetry,
}: Props) {
  const value = data ? `${data.attendanceRate}%` : "—";
  const denom = data
    ? `${data.attendanceNumerator}/${data.attendanceDenominator}`
    : "—";
  return (
    <KPI
      title="오늘 출석률"
      icon={<CheckIcon />}
      iconAccent="green"
      value={value}
      footerLeft={denom}
      footerRight={<DeltaPill $tone="neutral">오늘</DeltaPill>}
      loading={loading}
      error={error}
      onRetry={onRetry}
    />
  );
}
