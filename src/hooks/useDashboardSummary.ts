import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchDashboardSummary } from "../api/dashboard";
import type { DashboardSummary } from "../types/dashboard";

type Status = "idle" | "loading" | "success" | "error";

export function useDashboardSummary() {
  const [status, setStatus] = useState<Status>("idle");
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState<unknown>(null);

  const load = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const d = await fetchDashboardSummary();
      setData(d);
      setStatus("success");
    } catch (e) {
      setError(e);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    if (status === "idle") {
      void load();
    }
  }, [status, load]);

  const value = useMemo(
    () => ({ status, data, error, refresh: load }),
    [status, data, error, load]
  );

  return value;
}
