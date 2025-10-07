export function formatPhone(raw?: string | null): string {
  if (!raw) return "-";
  const digits = String(raw).replace(/[^0-9]/g, "");
  if (digits.length === 0) return "-";
  // Seoul area code (02)
  if (digits.startsWith("02")) {
    const rest = digits.slice(2);
    if (rest.length <= 7) {
      return `02-${rest.slice(0, 3)}-${rest.slice(3)}`.replace(/-$/,'');
    }
    return `02-${rest.slice(0, 4)}-${rest.slice(4)}`;
  }
  // Mobile 11-digit
  if (digits.length === 11) {
    return `${digits.slice(0,3)}-${digits.slice(3,7)}-${digits.slice(7)}`;
  }
  // 10-digit (old mobile or regional)
  if (digits.length === 10) {
    return `${digits.slice(0,3)}-${digits.slice(3,6)}-${digits.slice(6)}`;
  }
  // 8-digit numbers
  if (digits.length === 8) {
    return `${digits.slice(0,4)}-${digits.slice(4)}`;
  }
  // Fallback: best-effort split
  if (digits.length > 3 && digits.length <= 12) {
    const a = digits.slice(0, 3);
    const b = digits.slice(3, digits.length - 4);
    const c = digits.slice(-4);
    return [a, b, c].filter(Boolean).join("-");
  }
  return digits;
}

export function formatMoney(value?: number | string | null, suffix = '원'): string {
  if (value == null || value === '') return '-';
  const n = typeof value === 'string' ? Number(value) : value;
  if (Number.isNaN(n as number)) return '-';
  return `${Number(n).toLocaleString('ko-KR')}${suffix ? suffix : ''}`;
}

type DateInput = string | number | Date | null | undefined;

function toDate(value: DateInput): Date | null {
  if (value == null) return null;
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return new Date(value.getTime());
  }
  if (typeof value === "number") {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const ymdMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (ymdMatch) {
      const [, y, m, d] = ymdMatch;
      return new Date(Number(y), Number(m) - 1, Number(d));
    }
    const parsed = new Date(trimmed);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  return null;
}

const dateFormatterFull = new Intl.DateTimeFormat('ko-KR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

const dateFormatterNoYear = new Intl.DateTimeFormat('ko-KR', {
  month: 'long',
  day: 'numeric',
});

const weekdayFormatter = new Intl.DateTimeFormat('ko-KR', {
  weekday: 'short',
});

const timeFormatter = new Intl.DateTimeFormat('ko-KR', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

const timeFormatterWithSeconds = new Intl.DateTimeFormat('ko-KR', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
});

export function formatKoreanDate(
  value: DateInput,
  options?: { includeYear?: boolean; includeWeekday?: boolean }
): string {
  const date = toDate(value);
  if (!date) return '—';
  const { includeYear = true, includeWeekday = true } = options ?? {};
  const base = (includeYear ? dateFormatterFull : dateFormatterNoYear).format(date);
  const weekday = includeWeekday ? ` (${weekdayFormatter.format(date)})` : '';
  return `${base}${weekday}`;
}

export function formatKoreanDateTime(
  value: DateInput,
  options?: { includeYear?: boolean; includeWeekday?: boolean; showSeconds?: boolean }
): string {
  const date = toDate(value);
  if (!date) return '—';
  const { includeYear = true, includeWeekday = true, showSeconds = false } = options ?? {};
  const datePart = formatKoreanDate(date, { includeYear, includeWeekday });
  const timePart = (showSeconds ? timeFormatterWithSeconds : timeFormatter).format(date);
  return `${datePart} ${timePart}`.trim();
}

export function formatTimeLabel(value?: string | null, placeholder = '--:--'): string {
  if (!value) return placeholder;
  const str = String(value).trim();
  const match = str.match(/(\d{2}):(\d{2})/);
  if (match) return `${match[1]}:${match[2]}`;
  try {
    const d = new Date(str);
    if (Number.isNaN(d.getTime())) return placeholder;
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  } catch {
    return placeholder;
  }
}

export function formatTimeRangeLabel(
  start?: string | null,
  end?: string | null,
  placeholder = '--:--'
): string {
  const from = formatTimeLabel(start, placeholder);
  const to = formatTimeLabel(end, placeholder);
  return `${from} ~ ${to}`;
}
