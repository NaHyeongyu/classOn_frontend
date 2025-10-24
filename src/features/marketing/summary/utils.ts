import { composeDirectionSummary, normalizeMarketingDirections } from "@/features/marketing/utils";
import type { SummarizeItem } from "@/api/summarize";
import type { MarketingSummaryPayload } from "@/features/marketing/types";
import type { PlatformChoice, SpeechStyle, SummaryLocationState, Draft } from "./types";

export function resolveDirections(summary?: MarketingSummaryPayload): ReturnType<typeof normalizeMarketingDirections> {
  return normalizeMarketingDirections(summary?.directions);
}

export function composeDraft(
  state: SummaryLocationState | undefined,
  platformChoice: PlatformChoice,
  speechStyle: SpeechStyle,
  directionText: string
): Draft {
  const bullets = (state?.bullets ?? []).map((b) => b.trim()).filter(Boolean);
  const direction = directionText.trim();
  const items = state?.items ?? [];
  const rendered = state?.rendered;

  const fallback = buildFallbackDraft({
    platform: platformChoice,
    bullets,
    direction,
    items,
    speechStyle,
  });

  if (!rendered) {
    return fallback;
  }

  const body = (rendered.body ?? "").trim() || fallback.body;
  const tags = Array.isArray(rendered.tags) && rendered.tags.length
    ? rendered.tags.filter(Boolean)
    : fallback.tags;
  const images = rendered.images?.length ? rendered.images : fallback.images;
  const title = rendered.title ?? fallback.title;

  return { title, body, tags, images };
}

export function buildFallbackDraft(params: {
  platform: PlatformChoice;
  bullets: string[];
  direction: string;
  items: SummarizeItem[];
  speechStyle: SpeechStyle;
}): Draft {
  const { platform, bullets, direction, items } = params;

  const bulletLines = bullets.length
    ? bullets
    : items.slice(0, 5).map((item) => summarizeItemLine(item));

  const sections = [direction.trim(), bulletLines.map((b) => `• ${b}`).join("\n").trim()]
    .filter(Boolean);
  const body = sections.join("\n\n") || "요약을 생성할 수 없습니다.";

  const tags = bullets
    .slice(0, 6)
    .map((b) => `#${b.replace(/\s+/g, "")}`)
    .filter((tag) => tag.length > 1);
  const images = buildImageIdeas(items);
  const title = platform === "NAVER_BLOG"
    ? buildBlogTitle(direction, items)
    : undefined;

  return { title, body, tags, images };
}

export function summarizeItemLine(item: SummarizeItem): string {
  const date = item.date ? `${item.date}` : "";
  const course = item.courseTitle ? `[${item.courseTitle}]` : "";
  const content = item.content ?? "";
  return [date, course, content].filter(Boolean).join(" ").trim();
}

export function buildImageIdeas(items: SummarizeItem[]): Array<{ idea: string }> {
  if (!items.length) {
    return [{ idea: "수업 현장 스냅" }];
  }
  return items.slice(0, 5).map((item) => ({
    idea: `${item.courseTitle ?? "수업"} 활동 모습`,
  }));
}

export function buildBlogTitle(direction: string, items: SummarizeItem[]): string {
  if (direction.trim()) return direction.trim().slice(0, 60);
  if (items.length) {
    const first = items[0];
    const course = first.courseTitle ?? "수업";
    return `${course} 하이라이트`;
  }
  return "이번 수업 이야기";
}

export function platformLabel(platform: PlatformChoice): string {
  switch (platform) {
    case "INSTAGRAM":
      return "인스타그램";
    case "NAVER_BLOG":
      return "네이버 블로그";
    case "KAKAO_CHANNEL":
      return "카카오 채널";
    default:
      return platform;
  }
}

export function computeDirectionText(
  state: SummaryLocationState | undefined,
  directions: ReturnType<typeof normalizeMarketingDirections>,
  index: number | null
): string {
  const existing = state?.direction?.trim();
  if (existing) return existing;
  if (index == null) return "";
  const dir = directions[index];
  return dir ? composeDirectionSummary(dir) : "";
}
