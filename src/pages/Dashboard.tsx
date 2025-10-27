import { DashboardPageView } from "@/views/dashboard/DashboardPageView";
import { useDashboardPage } from "@/features/dashboard/useDashboardPage";

export default function Dashboard() {
  const state = useDashboardPage();
  return <DashboardPageView {...state} />;
}
