import { fetchJSON } from "../lib/fetcher";

export type CourseDigest = {
  courseId: number;
  courseTitle: string;
  sessions: number;
  topTopics: string[];
  snapshots: string[];
  aiSummary?: string | null;
  aiInsights?: string[] | null;
};

export type ContentDigest = {
  from: string;
  to: string;
  totalSessions: number;
  avgAttendanceRate?: number | null;
  topKeywords: string[];
  suggestedTags: string[];
  courses: CourseDigest[];
  aiSummary?: string | null;
  aiInsights?: string[] | null;
};

export type Platform = "INSTAGRAM" | "NAVER_BLOG";

export type ExtractParams = {
  courseIds?: number[];
  from?: string;
  to?: string;
  days?: number;
  useAi?: boolean;
};

export type RenderRequest = {
  platform: Platform;
  digest: ContentDigest;
  tone?: string | null;
};

export type RenderResponse = {
  title: string | null;
  body: string;
  tags: string[];
  platform: string;
};

export type RecommendRequest = {
  courseIds: number[];
  from: string;
  to: string;
  useAi?: boolean;
  platform?: Platform;
  tone?: string;
};

export type RecommendResponse = {
  digest: ContentDigest;
  recommendation: RenderResponse;
};

export async function extractDigest(params: ExtractParams = {}) {
  const sp = new URLSearchParams();
  if (params.courseIds?.length) {
    for (const id of params.courseIds) sp.append("courseId", String(id));
  }
  if (params.from) sp.set("from", params.from);
  if (params.to) sp.set("to", params.to);
  if (typeof params.days === "number") sp.set("days", String(params.days));
  if (typeof params.useAi === "boolean") sp.set("ai", String(params.useAi));
  const q = Array.from(sp.keys()).length ? `?${sp.toString()}` : "";
  return await fetchJSON<ContentDigest>(`/api/marketing/extract${q}`);
}

export async function renderPost(payload: RenderRequest) {
  return await fetchJSON<RenderResponse>("/api/marketing/render", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function recommendMarketing(payload: RecommendRequest) {
  return await fetchJSON<RecommendResponse>("/api/marketing/recommend", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
