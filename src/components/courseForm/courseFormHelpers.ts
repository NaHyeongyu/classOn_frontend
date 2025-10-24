import { useCallback } from "react";
import type { FormState } from "@/components/courseForm/courseFormTypes";

export type DayKey = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";

export const DAY_OPTIONS: Array<{ value: DayKey; label: string }> = [
  { value: "MON", label: "월" },
  { value: "TUE", label: "화" },
  { value: "WED", label: "수" },
  { value: "THU", label: "목" },
  { value: "FRI", label: "금" },
  { value: "SAT", label: "토" },
  { value: "SUN", label: "일" },
];

const pad2 = (value: number): string => String(value).padStart(2, "0");

export const HOUR_OPTIONS = Array.from({ length: 24 }, (_, i) => pad2(i));
export const MINUTE_OPTIONS = Array.from({ length: 12 }, (_, i) => pad2(i * 5));

export function formatNumberKR(input: number | string): string {
  const digits = String(input ?? "").replace(/[^0-9]/g, "");
  if (!digits) return "";
  return Number(digits).toLocaleString("ko-KR");
}

export function hasDay(recurrenceDays: string | undefined, day: DayKey): boolean {
  if (!recurrenceDays) return false;
  return recurrenceDays
    .split(",")
    .map((token) => token.trim().toUpperCase())
    .includes(day);
}

function joinDays(list: DayKey[]): string {
  return Array.from(new Set(list)).filter(Boolean).join(",");
}

export function useToggleDay(
  form: Pick<FormState, "recurrenceDays">,
  setForm: React.Dispatch<React.SetStateAction<FormState>>
) {
  return useCallback(
    (day: DayKey, checked: boolean) => {
      const current = (form.recurrenceDays || "")
        .split(",")
        .map((token) => token.trim())
        .filter((token): token is DayKey => Boolean(token))
        .map((token) => token.toUpperCase() as DayKey);
      const next = checked ? [...current, day] : current.filter((value) => value !== day);
      setForm((prev) => ({ ...prev, recurrenceDays: joinDays(next) }));
    },
    [form.recurrenceDays, setForm]
  );
}
