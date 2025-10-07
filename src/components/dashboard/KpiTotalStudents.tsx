import { KPI, UsersIcon } from "./KPI";
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
  // delta hidden per request
  return (
    <KPI
      title="총 원생 수"
      icon={<UsersIcon />}
      iconAccent="indigo"
      value={value}
      footerLeft={undefined}
      footerRight={undefined}
      loading={loading}
      error={error}
      onRetry={onRetry}
    />
  );
}
