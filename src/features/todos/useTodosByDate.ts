import { useCallback, useEffect, useRef, useState } from "react";
import { listTodosByDate, type Todo } from "../../api/todos";
import { peekCache } from "../../lib/fetcher";
import { readableError } from "@/lib/errors";

export function useTodosByDate(ymd: string) {
  const [data, setData] = useState<Todo[] | null>(null);
  const [loading, setLoading] = useState(false); // initial fetch only
  const [revalidating, setRevalidating] = useState(false); // true when updating data in background
  const [error, setError] = useState<string | null>(null);
  const ctrlRef = useRef<AbortController | null>(null);
  const ymdRef = useRef<string>(ymd);

  const load = useCallback(async (seeded: boolean) => {
    // Cancel any in-flight request for this hook instance
    if (ctrlRef.current) ctrlRef.current.abort();
    const controller = new AbortController();
    ctrlRef.current = controller;

    setError(null);
    // If we already have data (from cache seed), treat as background revalidation
    if (seeded && ymdRef.current === ymd) {
      setRevalidating(true);
      setLoading(false);
    } else {
      setLoading(true);
      setRevalidating(false);
    }

    try {
      const list = await listTodosByDate(ymd, undefined, { signal: controller.signal });
      // Ignore late results for previous ymd
      if (ymdRef.current !== ymd) return;
      setData(list);
    } catch (e) {
      if ((e as { name?: string })?.name === "AbortError") return; // aborted due to ymd change/unmount
      setError(readableError(e, "Failed to load todos"));
    } finally {
      if (ymdRef.current === ymd) {
        setLoading(false);
        setRevalidating(false);
      }
    }
  }, [ymd]);

  useEffect(() => {
    ymdRef.current = ymd;
    // Seed from local cache immediately for snappier UI
    const q = `/api/todos?dueYmd=${ymd}`;
    const cached = peekCache<Todo[]>(q);
    const seeded = Boolean(cached.data);
    if (seeded) {
      setData(cached.data);
      setLoading(false);
      setRevalidating(true);
    } else {
      // Clear previous day's data to avoid showing wrong date while loading
      setData(null);
      setLoading(true);
      setRevalidating(false);
    }
    void load(seeded);
    return () => {
      if (ctrlRef.current) ctrlRef.current.abort();
    };
  }, [ymd, load]);

  const refresh = useCallback(() => load(Boolean(data) && ymdRef.current === ymd), [load, data, ymd]);

  return { data, loading, revalidating, error, refresh };
}
