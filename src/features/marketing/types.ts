import type { SavedPost } from "@/api/marketingSaved";
import type { SummarizeItem } from "@/api/summarize";

export type MarketingTone = "WARM_VIVID" | "CONCISE_NEUTRAL" | "TRUST_CALM" | "UPBEAT_POSITIVE";
export type MarketingSpeechStyle = "SEUMNIDA" | "YO";
export type MarketingPlatform = SavedPost["platform"];
export type MarketingFormatStyle = "STORY" | "LIST" | "PERFORMANCE";

export type MarketingPresetKey = "7d" | "30d" | "thisMonth" | "lastMonth";

export type MarketingDirection = {
  title?: string | null;
  because?: string | null;
  hook?: string | null;
  asset?: string | null;
  platform?: string | null;
};

export interface MarketingSummaryPayload {
  from: string;
  to: string;
  summary: string;
  bullets: string[];
  directions?: MarketingDirection[];
  tokensUsed?: number;
  rawJson?: string;
}

export interface MarketingRenderedDraft {
  title?: string | null;
  body?: string | null;
  tags?: string[] | null;
  images?: Array<{ idea: string }> | null;
  platform?: MarketingPlatform | string | null;
}

export interface MarketingSessionPayload {
  items: SummarizeItem[];
  tone: MarketingTone;
  speechStyle: MarketingSpeechStyle;
  platformChoice: MarketingPlatform;
  formatStyle?: MarketingFormatStyle;
  direction?: string;
  bullets?: string[];
  selectedDirectionIndex?: number | null;
  summary?: MarketingSummaryPayload;
  rendered?: MarketingRenderedDraft;
  from?: string;
}

export interface RangeSummary {
  label: string;
  days: number | null;
}
