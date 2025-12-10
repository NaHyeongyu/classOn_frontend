import type { Dispatch, SetStateAction } from "react";
import type { SummarizeItem, SummarizeOptions } from "@/api/summarize";
import type { MarketingSummaryPayload } from "@/features/marketing/types";
import type { SavedPost } from "@/api/marketingSaved";

export type PlatformChoice = SavedPost["platform"];
export type SpeechStyle = NonNullable<SavedPost["speechStyle"]>;

type RenderedDraft = {
  title?: string | null;
  body?: string | null;
  tags?: string[] | null;
  images?: Array<{ idea: string }> | null;
  platform?: PlatformChoice | string | null;
};

export type SummaryLocationState = {
  items?: SummarizeItem[];
  options?: SummarizeOptions;
  direction?: string;
  bullets?: string[];
  tone?: string;
  speechStyle?: SpeechStyle;
  platformChoice?: PlatformChoice;
  formatStyle?: "STORY" | "LIST" | "PERFORMANCE";
  from?: string;
  rendered?: RenderedDraft;
  summary?: MarketingSummaryPayload;
  selectedDirectionIndex?: number | null;
};

export type Draft = {
  title?: string;
  body: string;
  tags: string[];
  images: Array<{ idea: string }>;
};

export type UseMarketingSummaryResult = {
  data: {
    items: SummarizeItem[];
    summary?: MarketingSummaryPayload;
    tone: string;
    toneLabel: string;
    speechStyle: SpeechStyle;
    speechLabel: string;
    platformChoice: PlatformChoice;
    formatStyle: SummaryLocationState["formatStyle"];
    directionText: string;
    draft: Draft;
    tagsList: string[];
    blogTitle: string;
    bodyInput: string;
  };
  ui: {
    setBodyInput: (value: string) => void;
    tagInput: string;
    setTagInput: (value: string) => void;
    igImgIdx: number;
    setIgImgIdx: Dispatch<SetStateAction<number>>;
  };
  actions: {
    copyBody: () => void;
    copyBodyAndTags: () => void;
    copyTags: () => void;
    saveDraft: () => Promise<void>;
  };
};

export type PlatformLabelFn = (platform: PlatformChoice) => string;
