import { useNavigate } from "react-router-dom";
import { routes } from "@/routes";
import { AdminLoginPageView } from "@/views/admin/AdminLoginPageView";
import { useAdminLoginPage } from "@/features/admin/useAdminLoginPage";

export default function AdminLogin() {
  const navigate = useNavigate();
  const {
    username,
    password,
    error,
    loading,
    setUsername,
    setPassword,
    handleSubmit,
  } = useAdminLoginPage({
    onSuccess: () => navigate(routes.admin, { replace: true }),
  });

  return (
    <AdminLoginPageView
      username={username}
      password={password}
      loading={loading}
      error={error}
      onChangeUsername={setUsername}
      onChangePassword={setPassword}
      onSubmit={handleSubmit}
      onCancel={() => navigate(routes.admin)}
    />
  );
}
