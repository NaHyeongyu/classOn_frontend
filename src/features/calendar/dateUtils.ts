export const WEEK_LABELS = ["일", "월", "화", "수", "목", "금", "토"] as const;

export function stripTime(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function isSameDate(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function buildMonthMatrix(view: Date) {
  const first = new Date(view.getFullYear(), view.getMonth(), 1);
  const startOffset = first.getDay();
  const start = new Date(view.getFullYear(), view.getMonth(), 1 - startOffset);
  // 5 weeks (35 days) view
  return Array.from({ length: 35 }, (_, i) =>
    new Date(start.getFullYear(), start.getMonth(), start.getDate() + i)
  );
}

export function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export function formatYMD(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function parseYMD(s: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return stripTime(new Date());
  const y = Number(m[1]);
  const mo = Number(m[2]) - 1;
  const da = Number(m[3]);
  return new Date(y, mo, da);
}
