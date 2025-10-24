
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { firstSummary } from "@/api/firstSummary";
import type { SummarizeItem } from "@/api/summarize";
import { toErrorMessage } from "@/features/marketing/utils";
import type {
  MarketingDirection,
  MarketingSessionPayload,
  MarketingSummaryPayload,
  MarketingSpeechStyle,
  MarketingTone,
  MarketingPlatform,
} from "@/features/marketing/types";

type UseMarketingGeneratingPageReturn = {
  items: SummarizeItem[];
  tone: MarketingTone;
  speechStyle: MarketingSpeechStyle;
  platformChoice: MarketingPlatform;
  progress: number;
  error: string | null;
  retry: () => void;
  goHome: () => void;
};

function hashString(input: string): string {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h << 5) - h + input.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h).toString(36);
}

export function useMarketingGeneratingPage(): UseMarketingGeneratingPageReturn {
  const { state } = useLocation() as { state?: MarketingSessionPayload };
  const items = useMemo<SummarizeItem[]>(() => state?.items ?? [], [state?.items]);
  const tone = state?.tone ?? "WARM_VIVID";
  const speechStyle = state?.speechStyle ?? "SEUMNIDA";
  const platformChoice = state?.platformChoice ?? "INSTAGRAM";
  const navigate = useNavigate();

  const [progress, setProgress] = useState(8);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  const startRef = useRef<number>(0);
  const timerRef = useRef<number | null>(null);

  const cacheKey = useMemo(() => {
    const signature = JSON.stringify({ items, speechStyle });
    return `firstSummary:${hashString(signature)}`;
  }, [items, speechStyle]);

  useEffect(() => {
    if (!items.length) return;
    let cancelled = false;

    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        const summary = JSON.parse(cached) as MarketingSummaryPayload;
        navigate("/marketing/preview", {
          state: { ...state, items, summary, tone, speechStyle, platformChoice },
          replace: true,
        });
        return;
      }
    } catch {
      /* ignore cache errors */
    }

    startRef.current = Date.now();
    setProgress(8);
    setError(null);

    timerRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      const pct = Math.min(94, Math.floor((elapsed / 6200) * 94));
      setProgress((prev) => (pct > prev ? pct : prev));
    }, 150);

    (async () => {
      try {
        const response = await firstSummary(items, { language: "ko", speechStyle });
        if (cancelled) return;

        const directions: MarketingDirection[] = (response.directions ?? [])
          .map((dir) => ({
            title: dir.title?.trim() || undefined,
            because: dir.because?.trim() || undefined,
            hook: dir.hook?.trim() || undefined,
            asset: dir.asset?.trim() || undefined,
            platform: dir.platform?.trim() || undefined,
          }))
          .filter((dir) => Boolean(dir.title || dir.because || dir.hook || dir.asset || dir.platform));

        const summary: MarketingSummaryPayload = {
          from: response.from,
          to: response.to,
          summary: response.summary,
          bullets: response.bullets,
          directions,
          tokensUsed: response.tokensUsed,
          rawJson: JSON.stringify(response),
        };

        try {
          sessionStorage.setItem(cacheKey, JSON.stringify(summary));
        } catch {
          /* ignore quota errors */
        }

        if (timerRef.current !== null) {
          window.clearInterval(timerRef.current);
          timerRef.current = null;
        }

        const elapsed = Date.now() - startRef.current;
        const delay = Math.max(0, 900 - elapsed);
        window.setTimeout(() => {
          if (cancelled) return;
          setProgress(100);
          navigate("/marketing/preview", {
            state: { ...state, items, summary, tone, speechStyle, platformChoice },
            replace: true,
          });
        }, delay);
      } catch (err) {
        if (cancelled) return;
        if (timerRef.current !== null) {
          window.clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setProgress((prev) => (prev < 96 ? 96 : prev));
        setError(toErrorMessage(err, "요약 생성에 실패했습니다. 잠시 후 다시 시도해 주세요."));
      }
    })();

    return () => {
      cancelled = true;
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [items, navigate, platformChoice, speechStyle, tone, state, retryKey, cacheKey]);

  return {
    items,
    tone,
    speechStyle,
    platformChoice,
    progress,
    error,
    helperText,
    retry: () => setRetryKey((key) => key + 1),
    goHome: () => navigate("/marketing"),
  };
}
