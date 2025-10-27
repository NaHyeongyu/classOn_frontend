import { useNavigate } from "react-router-dom";
import type { FormEvent } from "react";
import { RegisterPageView } from "@/views/register/RegisterPageView";
import { useRegisterFlow } from "@/features/register/useRegisterFlow";

export default function Register() {
  const flow = useRegisterFlow();
  const navigate = useNavigate();

  const handleComplete = async (event: FormEvent<HTMLFormElement>) => {
    const ok = await flow.completeRegistration(event);
    if (ok) {
      navigate("/login", { replace: true });
    }
  };

  return <RegisterPageView flow={flow} onComplete={handleComplete} />;
}
