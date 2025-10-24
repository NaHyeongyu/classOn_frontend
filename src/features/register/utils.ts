type AnyRecord = Record<string, unknown>;

function isRecord(value: unknown): value is AnyRecord {
  return typeof value === "object" && value !== null;
}

export function readStatus(error: unknown): number | undefined {
  if (!isRecord(error)) return undefined;
  const { status } = error;
  if (typeof status === "number") return status;
  if (typeof status === "string") {
    const parsed = Number(status);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
}

export function toErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) return error.message;
  if (isRecord(error) && typeof error.message === "string") {
    return error.message;
  }
  return fallback;
}

export function normalizeMobile(input: string): string | null {
  const digits = input.replace(/[^0-9]/g, "");
  if (digits.length === 11 && digits.startsWith("010")) {
    return `010-${digits.slice(3, 7)}-${digits.slice(7)}`;
  }
  return null;
}

export function maskBizNo(input: string): { masked: string; raw: string } {
  const digits = input.replace(/\D/g, "").slice(0, 10);
  const p1 = digits.slice(0, 3);
  const p2 = digits.slice(3, 5);
  const p3 = digits.slice(5, 10);
  return {
    raw: digits,
    masked: [p1, p2, p3].filter(Boolean).join("-"),
  };
}

export function secondCategories(
  primary: "" | "교과목" | "예체능" | "기타"
): string[] {
  if (primary === "교과목") return ["국어", "수학", "사회", "과학", "영어"];
  if (primary === "예체능") return ["스포츠", "미술", "음악"];
  return [];
}
