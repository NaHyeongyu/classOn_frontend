import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Page, SectionCard, GhostButtonSmall } from '@/components/common/UI';
import type { SummarizeItem } from '@/api/summarize';
import { renderRecords } from '@/api/render';

export default function MarketingRendering() {
  const { state } = useLocation() as { state?: { items?: SummarizeItem[]; direction?: string; bullets?: string[]; tone?: string; speechStyle?: 'SEUMNIDA'|'YO'; platformChoice?: 'INSTAGRAM'|'NAVER_BLOG'|'KAKAO_CHANNEL'; formatStyle?: 'STORY'|'LIST'|'PERFORMANCE'; summary?: any } };
  const items = state?.items ?? [];
  const tone = state?.tone ?? 'WARM_VIVID';
  const speechStyle = state?.speechStyle ?? 'SEUMNIDA';
  const platformChoice = state?.platformChoice ?? 'INSTAGRAM';
  const direction = state?.direction || '';
  const bullets = state?.bullets || [];
  const navigate = useNavigate();

  const [progress, setProgress] = useState(10);
  const [error, setError] = useState<string | null>(null);
  const startRef = useRef<number>(0);
  const startedRef = useRef<boolean>(false);
  const HIDE_EXTRAS = true;

  useEffect(() => {
    if (!items.length) { navigate('/marketing'); return; }
    if (startedRef.current) return;
    startedRef.current = true;
    startRef.current = Date.now();
    setProgress(10); setError(null);

    const progressTimer = window.setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      const pct = Math.min(96, Math.floor((elapsed / 5200) * 96));
      setProgress((prev) => Math.max(prev, pct));
    }, 150);

    (async () => {
      try {
        const platform = platformChoice === 'INSTAGRAM' ? 'INSTAGRAM' : platformChoice === 'NAVER_BLOG' ? 'NAVER_BLOG' : null;
        if (platform) {
          const resp = await renderRecords(items, { platform, tone, speechStyle, brief: { direction, bullets } });
          const elapsed = Date.now() - startRef.current;
          const remain = Math.max(0, 900 - elapsed);
          window.setTimeout(() => {
            setProgress(100);
            navigate('/marketing/summary', { state: { items, direction, bullets, tone, speechStyle, platformChoice, formatStyle: state?.formatStyle, rendered: resp, summary: state?.summary, from: 'rendering' } });
          }, remain);
          return;
        }
        // Fallback for Kakao 채널: 바로 Summary로 이동 (로컬 컴포즈)
        navigate('/marketing/summary', { state: { items, direction, bullets, tone, speechStyle, platformChoice, formatStyle: state?.formatStyle, summary: state?.summary, from: 'rendering' } });
      } catch (e: any) {
        setError(e?.message || '생성 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
      }
    })();

    return () => { startedRef.current = false; window.clearInterval(progressTimer); };
  }, [items, navigate, platformChoice, speechStyle, tone, direction, bullets, state?.formatStyle, state?.summary]);

  return (
    <Page>
      <Viewport>
        <Lamp><span>📝</span></Lamp>
        <HeroText>
          <h2>플랫폼 전용 캡션을 준비 중이에요</h2>
          <p>선택한 말투·양식·플랫폼에 맞게 AI가 문장을 다듬고 있어요.</p>
        </HeroText>
        <ProgressBlock>
          <ProgressMeta>
            <span>전체 진행률</span>
            <strong>{progress}%</strong>
          </ProgressMeta>
          <ProgressTrack><ProgressBar style={{ width: `${progress}%` }} /></ProgressTrack>
        </ProgressBlock>
      </Viewport>

      {HIDE_EXTRAS ? null : (
        <SectionCard>
          <ListHeader>
            <h5>반영된 설정</h5>
            <span>{platformChoice==='INSTAGRAM'?'인스타그램':platformChoice==='NAVER_BLOG'?'블로그':'카카오 채널'}</span>
          </ListHeader>
          <MiniList>
            <li>말투: {speechStyle==='SEUMNIDA'?'~습니다':'~요'}</li>
            <li>톤: {toneLabel[tone] ?? '맞춤'}</li>
            <li>핵심 문장 {bullets.length}개</li>
          </MiniList>
          {error ? <ErrorText>{error}</ErrorText> : null}
          <ListActions>
            <GhostButtonSmall as="button" onClick={() => navigate('/marketing/preview', { state })}>취소</GhostButtonSmall>
          </ListActions>
        </SectionCard>
      )}
    </Page>
  );
}

const Viewport = styled.section`
  display: grid; justify-items: center; gap: 18px; padding: 48px 16px 12px; text-align: center;
`;
const Lamp = styled.div`
  width: 96px; height: 96px; border-radius: 999px; display: grid; place-items: center;
  background: radial-gradient(circle at 50% 45%, #ffffff 0%, #f1f5ff 60%, rgba(241, 245, 255, 0.4) 100%);
  border: 1px solid rgba(148, 163, 184, 0.35);
  box-shadow: 0 24px 45px rgba(79, 70, 229, 0.18);
  span{ font-size: 38px; }
`;
const HeroText = styled.div`
  display: grid; gap: 6px; max-width: 520px;
  h2 { margin: 0; font-size: 24px; font-weight: 800; color: #0f172a; }
  p { margin: 0; font-size: 14px; color: #475569; }
`;
const ProgressBlock = styled.div`
  width: min(520px, 92%); display: grid; gap: 10px;
`;
const ProgressMeta = styled.div`
  display: flex; align-items: center; justify-content: space-between; font-size: 12px; color: #475569;
  strong { font-size: 18px; font-weight: 800; color: #0f172a; }
`;
const ProgressTrack = styled.div`
  width: 100%; height: 12px; border-radius: 999px; overflow: hidden; background: #e2e8f0; border: 1px solid rgba(203, 213, 225, 0.8);
`;
const ProgressBar = styled.div`
  height: 100%; background: linear-gradient(90deg, #111827, #6366f1); transition: width .25s ease;
`;
const ListHeader = styled.div`
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;
  h5 { margin: 0; font-size: 13px; color: #1f2937; }
  span { font-size: 12px; color: #64748b; }
`;
const MiniList = styled.ul`
  list-style: none; margin: 0; padding: 0; display: grid; gap: 4px; color: ${({ theme }) => theme.colors.text}; font-size: 13px;
`;
const ListActions = styled.div`
  margin-top: 12px; display: flex; justify-content: flex-end;
`;
const ErrorText = styled.span`
  color: #b91c1c; font-size: 12px; margin-top: 8px;
`;

const toneLabel: Record<string, string> = {
  WARM_VIVID: '따뜻·생동',
  CONCISE_NEUTRAL: '담백·간결',
  TRUST_CALM: '차분·신뢰',
  UPBEAT_POSITIVE: '밝음·긍정',
};
