import { KPI, UsersIcon, DeltaPill } from "./KPI";
import type { DashboardSummary } from "../../types/dashboard";

type Props = {
  data: DashboardSummary | null;
  loading: boolean;
  error: boolean;
  onRetry: () => void;
};

export default function KpiTotalStudents({
  data,
  loading,
  error,
  onRetry,
}: Props) {
  const value = data ? `${data.totalStudents}명` : "—";
  const delta = data ? `+${data.deltaStudents}` : "—";
  return (
    <KPI
      title="총 원생 수"
      icon={<UsersIcon />}
      iconAccent="indigo"
      value={value}
      footerLeft="전월 대비"
      footerRight={<DeltaPill $tone="positive">{delta}</DeltaPill>}
      loading={loading}
      error={error}
      onRetry={onRetry}
    />
  );
}
