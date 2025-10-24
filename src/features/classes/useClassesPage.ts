import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

export type ClassesStatusFilter = "" | "IN_PROGRESS" | "STOPPED" | "PENDING";

export type ClassesFiltersState = {
  status: ClassesStatusFilter;
  q: string;
};

function sanitizeStatus(value: string | null): ClassesStatusFilter {
  if (value === "IN_PROGRESS" || value === "STOPPED" || value === "PENDING") {
    return value;
  }
  return "";
}

export function useClassesPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialFilters = useMemo<ClassesFiltersState>(() => {
    return {
      status: sanitizeStatus(searchParams.get("status")),
      q: searchParams.get("q") || "",
    };
  }, [searchParams]);

  const [filters, setFilters] = useState<ClassesFiltersState>(initialFilters);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setFilters((prev) => {
      if (prev.status === initialFilters.status && prev.q === initialFilters.q) {
        return prev;
      }
      return initialFilters;
    });
  }, [initialFilters]);

  useEffect(() => {
    function handleRefresh() {
      setRefreshKey((prev) => prev + 1);
    }
    window.addEventListener("courses:refresh", handleRefresh);
    return () => window.removeEventListener("courses:refresh", handleRefresh);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.status) params.set("status", filters.status);
    const trimmed = filters.q.trim();
    if (trimmed) params.set("q", trimmed);
    const next = params.toString();
    if (next !== searchParams.toString()) {
      setSearchParams(params, { replace: true });
    }
  }, [filters, searchParams, setSearchParams]);

  const applyFilters = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  const updateFilters = useCallback((next: ClassesFiltersState) => {
    setFilters(next);
  }, []);

  return {
    filters,
    refreshKey,
    applyFilters,
    updateFilters,
  } as const;
}
