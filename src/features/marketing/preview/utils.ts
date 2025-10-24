import {
  composeDirectionSummary,
  marketingDirectionAssetLabel,
  marketingDirectionPlatformLabel,
  normalizeMarketingDirections,
} from "@/features/marketing/utils";
import {
  MARKETING_SPEECH_STYLE_LABELS,
  MARKETING_TONE_LABELS,
} from "@/features/marketing/constants";
import type {
  MarketingDirection,
  MarketingSessionPayload,
} from "@/features/marketing/types";

export function buildDirections(summary?: MarketingSessionPayload["summary"]): MarketingDirection[] {
  return normalizeMarketingDirections(summary?.directions);
}

export function buildInitialDirectionIndex(
  directions: MarketingDirection[],
  state: MarketingSessionPayload | undefined
): number | null {
  if (typeof state?.selectedDirectionIndex === "number") {
    const idx = state.selectedDirectionIndex;
    return idx >= 0 && idx < directions.length ? idx : null;
  }
  if (state?.direction?.trim()) return null;
  return directions.length ? 0 : null;
}

export function composeDirectionText(
  directions: MarketingDirection[],
  index: number | null
): string {
  if (index == null) return "";
  const dir = directions[index];
  return dir ? composeDirectionSummary(dir) : "";
}

export function buildToneLabel(tone: string): string {
  return MARKETING_TONE_LABELS[tone] ?? tone;
}

export function buildSpeechLabel(style: string): string {
  return MARKETING_SPEECH_STYLE_LABELS[style] ?? style;
}

export function summarizeDirection(direction: MarketingDirection) {
  return {
    assetLabel: direction.asset
      ? marketingDirectionAssetLabel(direction.asset)
      : undefined,
    platformLabel: direction.platform
      ? marketingDirectionPlatformLabel(direction.platform)
      : undefined,
  };
}
