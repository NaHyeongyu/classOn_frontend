import { fetchJSON } from "../lib/fetcher";
import type { SummarizeItem } from "./summarize";

export type FirstDirection = { title: string; because: string; hook: string; asset: string; platform: string };
export type FirstSummaryResp = { from: string; to: string; summary: string; bullets: string[]; directions: FirstDirection[]; tokensUsed?: number };

// In-flight de-duplication to prevent double calls (e.g., React StrictMode)
const inflightFirstSummary = new Map<string, Promise<FirstSummaryResp>>();

export async function firstSummary(items: SummarizeItem[], opts?: { language?: 'ko'|'en'; speechStyle?: 'SEUMNIDA'|'YO' }) {
  const payload = { items, language: opts?.language || 'ko', speechStyle: opts?.speechStyle || 'SEUMNIDA' };
  const key = JSON.stringify({ p: payload });
  const existing = inflightFirstSummary.get(key);
  if (existing) return existing;
  const p = fetchJSON<FirstSummaryResp>("/api/ai/first-summary", {
    method: 'POST',
    body: JSON.stringify(payload),
    timeoutMs: 60000,
  }).finally(() => { inflightFirstSummary.delete(key); });
  inflightFirstSummary.set(key, p);
  return await p;
}
