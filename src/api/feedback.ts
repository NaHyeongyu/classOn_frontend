import { fetchJSON } from "@/lib/fetcher";

export type FeedbackPayload = {
  type: "BUG" | "FEATURE";
  title: string;
  body: string;
  contact?: string;
  pageUrl?: string;
  userAgent?: string;
};

export async function submitFeedback(payload: FeedbackPayload) {
  return await fetchJSON<{ id: number }>("/api/feedback", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

