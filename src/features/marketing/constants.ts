import type {
  MarketingFormatStyle,
  MarketingPlatform,
  MarketingPresetKey,
  MarketingSpeechStyle,
  MarketingTone,
} from "./types";

export const MARKETING_COURSE_FETCH_SIZE = 500;
export const MAX_MARKETING_SELECTED_COURSES = 3;

export const MARKETING_PRESETS: Record<MarketingPresetKey, { label: string }> = {
  "7d": { label: "최근 7일" },
  "30d": { label: "최근 30일" },
  thisMonth: { label: "이번 달" },
  lastMonth: { label: "지난 달" },
};

export const MARKETING_TONE_LABELS: Record<MarketingTone, string> = {
  WARM_VIVID: "따뜻·생동",
  CONCISE_NEUTRAL: "담백·간결",
  TRUST_CALM: "차분·신뢰",
  UPBEAT_POSITIVE: "밝음·긍정",
};

export const MARKETING_SPEECH_STYLE_OPTIONS: Array<{ value: MarketingSpeechStyle; label: string; emoji: string }> = [
  { value: "SEUMNIDA", label: "~습니다", emoji: "🧑‍🏫" },
  { value: "YO", label: "~요", emoji: "😊" },
];

export const MARKETING_FORMAT_STYLE_LABELS: Record<MarketingFormatStyle, string> = {
  STORY: "스토리텔링",
  LIST: "정보 나열",
  PERFORMANCE: "성과 중심",
};

export const MARKETING_FORMAT_STYLE_OPTIONS: Array<{ value: MarketingFormatStyle; label: string; emoji: string }> = [
  { value: "STORY", label: MARKETING_FORMAT_STYLE_LABELS.STORY, emoji: "🧵" },
  { value: "LIST", label: MARKETING_FORMAT_STYLE_LABELS.LIST, emoji: "📋" },
  { value: "PERFORMANCE", label: MARKETING_FORMAT_STYLE_LABELS.PERFORMANCE, emoji: "🏆" },
];

export const MARKETING_SPEECH_STYLE_LABELS: Record<MarketingSpeechStyle, string> = {
  SEUMNIDA: "~습니다",
  YO: "~요",
};

export const MARKETING_PLATFORM_OPTIONS: Array<{
  value: MarketingPlatform;
  name: string;
  icon: string;
  description: string;
}> = [
  {
    value: "INSTAGRAM",
    name: "인스타그램",
    icon: "📸",
    description: "짧고 임팩트 있는 메시지",
  },
];
