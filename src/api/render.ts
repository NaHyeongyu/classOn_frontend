import { fetchJSON } from "../lib/fetcher";
import type { SummarizeItem } from "./summarize";

export type Platform = "INSTAGRAM" | "NAVER_BLOG";

export type RenderOptions = { platform: Platform; tone?: string; speechStyle?: 'SEUMNIDA'|'YO'; brief?: { direction?: string; bullets?: string[] } };

export type Section = { heading: string; text: string; bullets?: string[] };
export type ImageIdea = { idea: string };

export type RenderResponse = {
  title: string | null;
  body: string;
  tags: string[];
  platform: Platform;
  sections?: Section[];
  images?: ImageIdea[];
};

// In-flight de-duplication (prevents duplicate requests under StrictMode remounts)
const inflightRender = new Map<string, Promise<RenderResponse>>();

export async function renderRecords(items: SummarizeItem[], options: RenderOptions) {
  const timeoutRaw = import.meta.env.VITE_RENDER_TIMEOUT_MS;
  const timeoutMs = Number(timeoutRaw ?? 60_000);
  const body = { items, options, brief: options.brief ? { direction: options.brief.direction, bullets: options.brief.bullets } : undefined };
  const key = JSON.stringify({ b: body });
  const existing = inflightRender.get(key);
  if (existing) return existing;
  const p = fetchJSON<RenderResponse>("/api/records/render", {
    method: "POST",
    body: JSON.stringify(body),
    timeoutMs,
  }).finally(() => { inflightRender.delete(key); });
  inflightRender.set(key, p);
  return await p;
}
