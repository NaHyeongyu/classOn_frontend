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

export async function renderRecords(items: SummarizeItem[], options: RenderOptions) {
  const TIMEOUT = Number((import.meta as any).env?.VITE_RENDER_TIMEOUT_MS ?? 60000);
  return await fetchJSON<RenderResponse>("/api/records/render", {
    method: "POST",
    body: JSON.stringify({ items, options, brief: options.brief ? { direction: options.brief.direction, bullets: options.brief.bullets } : undefined }),
    timeoutMs: TIMEOUT,
  });
}
