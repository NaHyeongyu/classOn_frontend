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
