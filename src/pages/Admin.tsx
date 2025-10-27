import { useNavigate } from "react-router-dom";
import { routes } from "@/routes";
import { useToast } from "@/components/common/Toast";
import { AdminDashboardPageView } from "@/views/admin/AdminDashboardPageView";
import { useAdminDashboardPage } from "@/features/admin/useAdminDashboardPage";

export default function AdminPage() {
  const navigate = useNavigate();
  const { success: showSuccess, error: showError } = useToast();

  const state = useAdminDashboardPage({
    onLogin: () => navigate(routes.admin + "/login"),
    showSuccess,
    showError,
  });

  return <AdminDashboardPageView {...state} />;
}
