import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { renderRecords } from "@/api/render";
import type { SummarizeItem } from "@/api/summarize";
import { toErrorMessage } from "@/features/marketing/utils";
import type { MarketingRenderedDraft, MarketingSessionPayload, MarketingSpeechStyle, MarketingTone, MarketingPlatform } from "@/features/marketing/types";

type UseMarketingRenderingPageReturn = {
  items: SummarizeItem[];
  progress: number;
  error: string | null;
  helperText: string;
  retry: () => void;
  goBackToPreview: () => void;
  goHome: () => void;
};

export function useMarketingRenderingPage(): UseMarketingRenderingPageReturn {
  const { state } = useLocation() as { state?: MarketingSessionPayload };
  const items = useMemo<SummarizeItem[]>(() => state?.items ?? [], [state?.items]);
  const tone: MarketingTone = state?.tone ?? "WARM_VIVID";
  const speechStyle: MarketingSpeechStyle = state?.speechStyle ?? "SEUMNIDA";
  const platformChoice: MarketingPlatform = state?.platformChoice ?? "INSTAGRAM";
  const direction = state?.direction ?? "";
  const bullets = useMemo(() => state?.bullets ?? [], [state?.bullets]);
  const formatStyle = state?.formatStyle;
  const navigate = useNavigate();

  const [progress, setProgress] = useState(10);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  const startRef = useRef<number>(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!items.length) return;
    let cancelled = false;
    startRef.current = Date.now();
    setProgress(10);
    setError(null);

    const platform: MarketingPlatform | null =
      platformChoice === "INSTAGRAM" || platformChoice === "NAVER_BLOG"
        ? platformChoice
        : null;

    if (platform === null) {
      navigate('/marketing/summary', {
        state: { ...state, items, tone, speechStyle, platformChoice, direction, bullets, formatStyle },
      });
      return;
    }

    timerRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      const pct = Math.min(96, Math.floor((elapsed / 5200) * 96));
      setProgress((prev) => (pct > prev ? pct : prev));
    }, 150);

    (async () => {
      try {
        const rendered = await renderRecords(items, {
          platform,
          tone,
          speechStyle,
          brief: { direction, bullets },
        });
        if (cancelled) return;
        if (timerRef.current !== null) {
          window.clearInterval(timerRef.current);
          timerRef.current = null;
        }
        const elapsed = Date.now() - startRef.current;
        const delay = Math.max(0, 900 - elapsed);
        window.setTimeout(() => {
          if (cancelled) return;
          setProgress(100);
          navigate('/marketing/summary', {
            state: {
              ...state,
              items,
              tone,
              speechStyle,
              platformChoice,
              direction,
              bullets,
              formatStyle,
              rendered: rendered as MarketingRenderedDraft,
            },
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
        setError(toErrorMessage(err, '플랫폼 전용 문장을 생성하지 못했습니다. 잠시 후 다시 시도해 주세요.'));
      }
    })();

    return () => {
      cancelled = true;
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [items, navigate, platformChoice, speechStyle, tone, direction, bullets, formatStyle, state, retryKey]);

  const helperText = useMemo(() =>
    platformChoice === 'INSTAGRAM'
      ? '인스타그램 캡션을 구성하는 중입니다…'
      : '블로그용 글을 다듬고 있습니다…',
    [platformChoice]
  );

  return {
    items,
    progress,
    error,
    helperText,
    retry: () => setRetryKey((key) => key + 1),
    goBackToPreview: () => navigate('/marketing/preview', { state }),
    goHome: () => navigate('/marketing'),
  };
}
