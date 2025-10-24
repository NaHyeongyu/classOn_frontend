import type { Course, CourseRecord } from "@/api/courses";
import type { MarketingDirection, RangeSummary } from "./types";

export function toErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string" && error.trim()) return error;
  return fallback;
}

export function normalizeYMDInput(input: string): string {
  const value = (input || "").trim();
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

  const compactYmd = value.match(/^(\d{4})[./-]?(\d{2})[./-]?(\d{2})$/);
  if (compactYmd) {
    const [, y, m, d] = compactYmd;
    return `${y}-${m}-${d}`;
  }

  const mdy = value.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/);
  if (mdy) {
    const [, mm, dd, yyyy] = mdy;
    return `${yyyy}-${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}`;
  }

  const digits = value.replace(/\D/g, "");
  if (digits.length === 8) {
    if (/^\d{4}/.test(digits)) {
      return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
    }
    return `${digits.slice(4, 8)}-${digits.slice(0, 2)}-${digits.slice(2, 4)}`;
  }

  return value;
}

export function ymd(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function formatKoreanDate(ymdValue?: string): string {
  if (!ymdValue) return "-";
  const [year, month, day] = ymdValue.split("-");
  if (!year || !month || !day) return ymdValue;
  return `${Number(year)}년 ${Number(month)}월 ${Number(day)}일`;
}

export function countDaysInclusive(start?: string, end?: string): number | null {
  if (!start || !end) return null;
  try {
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      return null;
    }
    const diff = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
  } catch {
    return null;
  }
}

export function formatRangeSummary(from?: string, to?: string): RangeSummary {
  if (!from || !to) {
    return { label: "기간을 선택하면 조회 안내가 표시돼요.", days: null };
  }
  const days = countDaysInclusive(from, to);
  const label = `${formatKoreanDate(from)} ~ ${formatKoreanDate(to)}`;
  return { label, days };
}

export function buildTimeRange(start?: string | null, end?: string | null): string {
  if (!start && !end) return "";
  const s = start ? start.slice(0, 5) : "?";
  const e = end ? end.slice(0, 5) : "?";
  return `${s} ~ ${e}`;
}

export function formatCourseMeta(course: Course): string {
  const time = course.courseTime || buildTimeRange(course.startTime, course.endTime);
  const nextDate = course.nextClassDate ? `다음 수업 ${formatKoreanDate(course.nextClassDate)}` : "";
  return [time, nextDate].filter(Boolean).join(" · ") || "일정 정보 없음";
}

export function recordPreview(record: CourseRecord): string {
  return (
    record.content?.trim() ||
    record.notes?.trim() ||
    record.topic?.trim() ||
    "(기록된 내용이 없습니다)"
  );
}

export function normalizeMarketingDirection(
  input?: MarketingDirection | null
): MarketingDirection | null {
  if (!input) return null;
  const title = input.title?.trim() || undefined;
  const because = input.because?.trim() || undefined;
  const hook = input.hook?.trim() || undefined;
  const asset = input.asset?.trim() || undefined;
  const platform = input.platform?.trim() || undefined;
  if (!title && !because && !hook && !asset && !platform) return null;
  return { title, because, hook, asset, platform };
}

export function normalizeMarketingDirections(
  list?: MarketingDirection[] | null
): MarketingDirection[] {
  if (!list) return [];
  return list
    .map((direction) => normalizeMarketingDirection(direction))
    .filter((direction): direction is MarketingDirection => Boolean(direction));
}

export function composeDirectionSummary(direction: MarketingDirection): string {
  const parts: string[] = [];
  if (direction.title) parts.push(direction.title);
  if (direction.because) parts.push(`근거: ${direction.because}`);
  if (direction.hook) parts.push(`훅: ${direction.hook}`);
  if (direction.asset) parts.push(`추천 자산: ${marketingDirectionAssetLabel(direction.asset)}`);
  if (direction.platform) parts.push(`권장 채널: ${marketingDirectionPlatformLabel(direction.platform)}`);
  return parts.join("\n");
}

export function marketingDirectionAssetLabel(asset?: string | null): string {
  const normalized = (asset ?? "").toLowerCase();
  switch (normalized) {
    case "diagram":
      return "자료/도표";
    case "photo":
      return "사진";
    case "short_video":
      return "숏폼 영상";
    case "testimonial":
      return "후기/인터뷰";
    default:
      return asset ?? "콘텐츠";
  }
}

export function marketingDirectionPlatformLabel(platform?: string | null): string {
  switch (platform) {
    case "INSTAGRAM":
      return "인스타그램";
    case "NAVER_BLOG":
      return "네이버 블로그";
    case "KAKAO_CHANNEL":
      return "카카오 채널";
    case "GENERIC":
      return "공통";
    default:
      return platform ?? "플랫폼 공통";
  }
}
