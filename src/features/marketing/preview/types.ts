import type { SummarizeItem } from "@/api/summarize";
import type {
  MarketingFormatStyle,
  MarketingDirection,
  MarketingSessionPayload,
  MarketingSpeechStyle,
  MarketingPlatform,
} from "@/features/marketing/types";

export type PreviewState = {
  directionText: string;
  selectedDirectionIndex: number | null;
  bullets: string[];
  speechStyle: MarketingSpeechStyle;
  platformChoice: MarketingPlatform;
  formatStyle: MarketingFormatStyle;
};

export type PreviewComputed = {
  items: SummarizeItem[];
  tone: string;
  toneLabel: string;
  speechLabel: string;
  directions: MarketingDirection[];
  summary: MarketingSessionPayload["summary"];
};

export type PreviewDialogState = {
  pendingDeleteIndex: number | null;
  setPendingDeleteIndex: (index: number | null) => void;
};

export type PreviewHandlers = {
  handleSelectDirection: (index: number) => void;
  handleDirectionChange: (value: string) => void;
  handleAddBullet: () => void;
  handleUpdateBullet: (index: number, value: string) => void;
  handleDeleteBullet: () => void;
  handleSpeechChange: (value: MarketingSpeechStyle) => void;
  handlePlatformChange: (value: MarketingPlatform) => void;
  handleFormatChange: (value: MarketingFormatStyle) => void;
  handleNext: () => void;
};

export type UseMarketingPreviewReturn = {
  state: PreviewState;
  computed: PreviewComputed;
  dialog: PreviewDialogState;
  handlers: PreviewHandlers;
};
