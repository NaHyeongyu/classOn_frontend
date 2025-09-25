import { fetchJSON } from "../lib/fetcher";

export type SummarizeItem = { date: string; content: string; courseTitle?: string };

export type SummarizeOptions = {
  language?: "ko" | "en";
  maxBullets?: number;
  style?: "concise" | "detailed";
};

export type SummarizeResponse = {
  from: string;
  to: string;
  summary: string;
  bullets: string[];
  tokensUsed?: number;
  rawJson?: string;
};

export async function summarizeRecords(items: SummarizeItem[], options?: SummarizeOptions) {
  const TIMEOUT = Number(import.meta.env.VITE_SUMMARIZE_TIMEOUT_MS ?? 60000);
  return await fetchJSON<SummarizeResponse>("/api/records/summarize", {
    method: "POST",
    body: JSON.stringify({ items, options }),
    timeoutMs: TIMEOUT,
  });
}
