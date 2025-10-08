import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Page, GhostButtonSmall } from "@/components/common/UI";
import { firstSummary } from "@/api/firstSummary";
import type { SummarizeItem } from "@/api/summarize";
import { toErrorMessage } from "@/features/marketing/utils";
import type { MarketingSessionPayload, MarketingSummaryPayload } from "@/features/marketing/types";

export default function MarketingGenerating() {
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

  // Simple stable hash for session cache keys
  function hashString(input: string): string {
    let h = 0;
    for (let i = 0; i < input.length; i++) {
      h = (h << 5) - h + input.charCodeAt(i);
      h |= 0;
    }
    return Math.abs(h).toString(36);
  }
  const cacheKey = useMemo(() => {
    const s = JSON.stringify({ items, speechStyle });
    return `firstSummary:${hashString(s)}`;
  }, [items, speechStyle]);

  useEffect(() => {
    if (!items.length) return;
    let cancelled = false;
    // 1) Try to restore from session cache first (avoid re-generation on back)
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        const summary = JSON.parse(cached);
        navigate("/marketing/preview", {
          state: { ...state, items, summary, tone, speechStyle, platformChoice },
          replace: true,
        });
        return () => { /* no timers to clean up */ };
      }
    } catch { /* ignore cache parse errors */ }
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

        const summary: MarketingSummaryPayload = {
          from: response.from,
          to: response.to,
          summary: response.summary,
          bullets: response.bullets,
          tokensUsed: response.tokensUsed,
          rawJson: JSON.stringify(response),
        };

        // Save to session cache for restoration on back navigation
        try { sessionStorage.setItem(cacheKey, JSON.stringify(summary)); } catch { /* ignore quota */ }

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
  }, [items, navigate, platformChoice, speechStyle, tone, state, retryKey]);

  if (!items.length) {
    return (
      <Page>
        <Viewport>
          <HeroText>
            <h2>선택된 데이터가 없습니다</h2>
            <p>마케팅 페이지에서 다시 수업과 기간을 선택해주세요.</p>
          </HeroText>
          <GhostButtonSmall as="button" onClick={() => navigate("/marketing")}>마케팅 홈으로</GhostButtonSmall>
        </Viewport>
      </Page>
    );
  }

  return (
    <Page>
      <Viewport>
        <Lamp>
          <LampIcon role="img" aria-hidden>
            🧠
          </LampIcon>
        </Lamp>
        <HeroText>
          <h2>AI가 수업 내용을 분석하고 있습니다</h2>
          <p>잠시만 기다려주세요. 곧 마케팅 요약을 완성할게요.</p>
        </HeroText>
        <ProgressBlock>
          <ProgressMeta>
            <span>전체 진행률</span>
            <strong>{progress}%</strong>
          </ProgressMeta>
          <ProgressTrack>
            <ProgressBar style={{ width: `${progress}%` }} />
          </ProgressTrack>
        </ProgressBlock>
        {error ? (
          <ErrorCard role="alert">
            <p>{error}</p>
            <ErrorActions>
              <GhostButtonSmall as="button" onClick={() => setRetryKey((key) => key + 1)}>
                다시 시도
              </GhostButtonSmall>
              <GhostButtonSmall as="button" onClick={() => navigate("/marketing")}>
                마케팅 홈으로
              </GhostButtonSmall>
            </ErrorActions>
          </ErrorCard>
        ) : (
          <HelperText>선택한 데이터 {items.length}건을 분석하는 중입니다…</HelperText>
        )}
      </Viewport>
    </Page>
  );
}

const Viewport = styled.section`
  display: grid;
  justify-items: center;
  gap: 18px;
  padding: 48px 16px 24px;
  text-align: center;
`;

const Lamp = styled.div`
  width: 96px;
  height: 96px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: radial-gradient(circle at 50% 45%, #ffffff 0%, #f1f5ff 60%, rgba(241, 245, 255, 0.4) 100%);
  border: 1px solid rgba(148, 163, 184, 0.35);
  box-shadow: 0 24px 45px rgba(79, 70, 229, 0.18);
`;

const LampIcon = styled.span`
  font-size: 38px;
`;

const HeroText = styled.div`
  display: grid;
  gap: 6px;
  max-width: 520px;
  h2 { margin: 0; font-size: 24px; font-weight: 800; color: #0f172a; }
  p { margin: 0; font-size: 14px; color: #475569; }
`;

const ProgressBlock = styled.div`
  width: min(520px, 92%);
  display: grid;
  gap: 10px;
`;

const ProgressMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: #475569;
  strong {
    font-size: 18px;
    font-weight: 800;
    color: #0f172a;
  }
`;

const ProgressTrack = styled.div`
  width: 100%;
  height: 12px;
  border-radius: 999px;
  overflow: hidden;
  background: #e2e8f0;
  border: 1px solid rgba(203, 213, 225, 0.8);
`;

const ProgressBar = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #111827, #6366f1);
  transition: width 0.25s ease;
`;

const HelperText = styled.p`
  margin: 12px 0 0;
  font-size: 13px;
  color: #64748b;
`;

const ErrorCard = styled.div`
  display: grid;
  gap: 12px;
  width: min(520px, 92%);
  padding: 16px;
  border-radius: 16px;
  border: 1px solid rgba(248, 113, 113, 0.4);
  background: rgba(254, 226, 226, 0.4);
  color: #b91c1c;
  font-size: 13px;
`;

const ErrorActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
`;
