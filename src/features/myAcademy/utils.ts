type UnknownRecord = Record<string, unknown>;

export function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

export function toErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) return error.message;
  if (isRecord(error) && typeof error.message === "string") {
    return error.message;
  }
  return fallback;
}

export function normalizeMobile(input: string): string | null {
  const digits = (input || "").replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("010")) {
    return `010-${digits.slice(3, 7)}-${digits.slice(7)}`;
  }
  return null;
}

export function secondCategories(category1: string): string[] {
  if (category1 === "교과목") return ["국어", "수학", "사회", "과학", "영어"];
  if (category1 === "예체능") return ["스포츠", "미술", "음악"];
  return [];
}

export function maskBiz(input: string): string {
  const digits = (input || "").replace(/\D/g, "").slice(0, 10);
  const p1 = digits.slice(0, 3);
  const p2 = digits.slice(3, 5);
  const p3 = digits.slice(5, 10);
  return [p1, p2, p3].filter(Boolean).join("-");
}

export function unmaskBiz(input: string): string {
  return (input || "").replace(/\D/g, "").slice(0, 10);
}
