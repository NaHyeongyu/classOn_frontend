export type TrendPoint = {
  key: string;
  label: string;
  value: number;
};

export type TrendDataset = {
  series: TrendPoint[];
  total: number;
  max: number;
};

export function buildDailyTrend<T>(
  rangeDays: number,
  endDate: Date,
  rows: T[],
  dateSelector: (item: T) => string | undefined,
  valueSelector: (item: T) => number,
): TrendDataset {
  const valueByDay = new Map<string, number>();
  rows.forEach((row) => {
    const iso = dateSelector(row);
    if (!iso) return;
    const dayKey = toDayKey(iso);
    valueByDay.set(dayKey, (valueByDay.get(dayKey) || 0) + valueSelector(row));
  });

  const series: TrendPoint[] = [];
  for (let offset = rangeDays - 1; offset >= 0; offset -= 1) {
    const current = new Date(endDate);
    current.setHours(0, 0, 0, 0);
    current.setDate(current.getDate() - offset);
    const iso = current.toISOString().slice(0, 10);
    const value = roundToTwo(valueByDay.get(iso) || 0);
    series.push({ key: iso, label: isoToLabel(iso), value });
  }

  const values = series.map((point) => point.value);
  const total = roundToTwo(values.reduce((acc, cur) => acc + cur, 0));
  const max = values.length > 0 ? Math.max(...values) : 0;
  return { series, total, max };
}

export function isoToLabel(iso: string) {
  const parts = iso.split('-');
  if (parts.length < 3) return iso;
  const [, month, day] = parts;
  return `${month}.${day}`;
}

function toDayKey(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.slice(0, 10);
  const adjusted = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return adjusted.toISOString().slice(0, 10);
}

function roundToTwo(value: number) {
  return Math.round(value * 100) / 100;
}
