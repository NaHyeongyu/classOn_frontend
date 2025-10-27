import type { FormEvent } from "react";
import { useCallback, useMemo, useState } from "react";
import { readableError } from "@/lib/errors";
import { useAdminAuth } from "@/hooks/useAdminAuth";

type UseAdminLoginPageOptions = {
  /**
   * Navigate or perform side effects after a successful login.
   */
  onSuccess?: () => void;
};

export function useAdminLoginPage(options?: UseAdminLoginPageOptions) {
  const { onSuccess } = options ?? {};
  const { login, loading } = useAdminAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (event?: FormEvent<HTMLFormElement>) => {
      event?.preventDefault();
      setError(null);
      try {
        await login(username.trim(), password);
        onSuccess?.();
      } catch (err) {
        setError(readableError(err, "로그인에 실패했습니다."));
      }
    },
    [login, onSuccess, password, username],
  );

  const state = useMemo(
    () => ({
      username,
      password,
      error,
      loading,
    }),
    [error, loading, password, username],
  );

  return {
    ...state,
    setUsername,
    setPassword,
    handleSubmit,
  };
}
