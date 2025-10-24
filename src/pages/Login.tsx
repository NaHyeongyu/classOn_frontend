import { LoginPageView } from "@/components/auth/LoginPageView";
import { useLoginPage } from "@/features/auth/hooks/useLoginPage";

export default function Login() {
  const state = useLoginPage();
  return <LoginPageView {...state} />;
}
