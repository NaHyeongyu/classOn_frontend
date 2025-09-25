import { fetchJSON } from "../lib/fetcher";
import type { SummarizeItem } from "./summarize";

export type BriefOptions = { language?: "ko"|"en"; tone?: string };
export type BriefResponse = {
  from: string; to: string;
  direction: string; summary?: string;
  bullets: string[]; angles?: string[]; imageIdeas?: string[];
};

export async function briefRecords(items: SummarizeItem[], options?: BriefOptions) {
  return await fetchJSON<BriefResponse>("/api/records/brief", {
    method: "POST",
    body: JSON.stringify({ items, options }),
    timeoutMs: Number((import.meta as any).env?.VITE_BRIEF_TIMEOUT_MS ?? 45000),
  });
}

