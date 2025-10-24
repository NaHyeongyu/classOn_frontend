import { formatKoreanDate, formatKoreanDateTime } from "@/lib/format";

export function formatDateTime(value?: string | null): string {
  if (!value) return "-";
  const formatted = formatKoreanDateTime(value, { includeWeekday: true });
  return formatted === "—" ? value : formatted;
}

export function buildRangeLabel(
  items: { createdAt?: string | null }[],
  formatter: (value: string) => string
): string {
  if (!items.length) return "";
  const first = items[0]?.createdAt;
  const last = items[items.length - 1]?.createdAt;
  if (!first || !last) {
    return `${items.length.toLocaleString("ko-KR")}건 표시 중`;
  }
  const startText = formatter(first);
  const endText = formatter(last);
  const normalizedStart = startText === "—" ? first : startText;
  const normalizedEnd = endText === "—" ? last : endText;
  return `${normalizedStart} ~ ${normalizedEnd}`;
}

export function buildDateRangeLabel(
  items: { createdAt?: string | null }[]
): string {
  return buildRangeLabel(items, (value) =>
    formatKoreanDate(value, { includeWeekday: true })
  );
}

export function buildDateTimeRangeLabel(
  items: { createdAt?: string | null }[]
): string {
  return buildRangeLabel(items, (value) =>
    formatKoreanDateTime(value, { includeWeekday: true })
  );
}
