import { useCallback, useEffect, useMemo, useState } from "react";
import { getDailyAttendance, type AttendanceDailySummary } from "@/api/attendance";
import { useAuth } from "@/hooks/useAuth";

type UseDailyAttendanceResult = {
  formDate: string;
  rows: AttendanceDailySummary[];
  loading: boolean;
  error: string | null;
  setDate: (value: string) => void;
  submit: () => boolean;
  applyQuick: (offset: number) => string;
};

function formatDateInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(base: Date, offset: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + offset);
  return d;
}

export function useDailyAttendance(): UseDailyAttendanceResult {
  const initialDate = useMemo(() => formatDateInput(new Date()), []);
  const { authGeneration } = useAuth();
  const [formDate, setFormDate] = useState(initialDate);
  const [appliedDate, setAppliedDate] = useState(initialDate);
  const [rows, setRows] = useState<AttendanceDailySummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await getDailyAttendance({ from: appliedDate, to: appliedDate });
        if (!cancelled) {
          setRows(res.map((day) => ({ ...day, attendances: day.attendances ?? [] })));
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : "출결 정보를 불러오지 못했습니다.";
          setError(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [appliedDate, authGeneration]);

  useEffect(() => {
    const today = formatDateInput(new Date());
    setFormDate(today);
    setAppliedDate(today);
    setRows([]);
    setError(null);
  }, [authGeneration]);

  const setDate = useCallback((value: string) => {
    setFormDate(value);
    setError(null);
  }, []);

  const submit = useCallback(() => {
    if (!formDate) {
      setError("조회할 날짜를 선택해주세요.");
      return false;
    }
    setError(null);
    setAppliedDate(formDate);
    return true;
  }, [formDate]);

  const applyQuick = useCallback((offset: number) => {
    const target = formatDateInput(addDays(new Date(), offset));
    setFormDate(target);
    setError(null);
    setAppliedDate(target);
    return target;
  }, []);

  return {
    formDate,
    rows,
    loading,
    error,
    setDate,
    submit,
    applyQuick,
  };
}
