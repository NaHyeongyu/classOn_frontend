import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Page, SectionCard, GhostButtonSmall } from '@/components/common/UI';
import type { SummarizeItem } from '@/api/summarize';
import { firstSummary } from '@/api/firstSummary';

export default function MarketingGenerating() {
  const { state } = useLocation() as { state?: { items?: SummarizeItem[]; tone?: string; speechStyle?: 'SEUMNIDA'|'YO'; platformChoice?: 'INSTAGRAM'|'NAVER_BLOG'|'KAKAO_CHANNEL' } };
  const items = state?.items ?? [];
  const tone = state?.tone ?? 'WARM_VIVID';
  const speechStyle = state?.speechStyle ?? 'SEUMNIDA';
  const platformChoice = state?.platformChoice ?? 'INSTAGRAM';
  const navigate = useNavigate();

  const [progress, setProgress] = useState(8);
  const [error, setError] = useState<string | null>(null);
  const startRef = useRef<number>(0);
  const startedRef = useRef<boolean>(false);
  const HIDE_EXTRAS = true;

  useEffect(() => {
    if (!items.length) { navigate('/marketing'); return; }
    // In React StrictMode, effects mount->cleanup->mount once. Allow the
    // second mount to re-initialize timers by resetting the flag in cleanup.
    if (startedRef.current) return;
    startedRef.current = true;
    startRef.current = Date.now();
    setProgress(8);
    setError(null);

    const progressTimer = window.setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      const pct = Math.min(94, Math.floor((elapsed / 6200) * 94));
      setProgress((prev) => Math.max(prev, pct));
    }, 150);

    (async () => {
      try {
        const resp = await firstSummary(items, { language: 'ko', speechStyle });
        const sum = {
          from: resp.from,
          to: resp.to,
          summary: resp.summary,
          bullets: resp.bullets,
          tokensUsed: resp.tokensUsed,
          rawJson: JSON.stringify(resp),
        };
        const elapsed = Date.now() - startRef.current;
        const remain = Math.max(0, 1200 - elapsed);
        window.setTimeout(() => {
          setProgress(100);
          navigate('/marketing/preview', {
            state: { items, summary: sum, tone, speechStyle, platformChoice, from: 'preview' },
          });
        }, remain);
      } catch (e: any) {
        setError(e?.message || '요약 생성에 실패했습니다. 잠시 후 다시 시도해 주세요.');
      }
    })();

    return () => {
      startedRef.current = false; // allow re-init on re-mount (StrictMode)
      window.clearInterval(progressTimer);
    };
  }, [items, navigate, platformChoice, speechStyle, tone]);

  const factCopy = useMemo(() => funFact(items.length), [items.length]);
  const stepIndex = currentStepIndex(progress);
  const step = STAGE_FLOW[stepIndex];

  return (
    <Page>
      <Viewport>
        <Lamp>
          <LampIcon>🧠</LampIcon>
        </Lamp>
        <HeroText>
          <h2>AI가 수업 내용을 분석하고 있습니다</h2>
          <p>잠시만 기다려주세요. 곧 멋진 마케팅 요약을 만들어드릴게요! ✨</p>
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
      </Viewport>

      {HIDE_EXTRAS ? null : (
      <StageCard>
        <StageHeader>
          <StageEmblem>{step.stageIcon}</StageEmblem>
          <div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </div>
        </StageHeader>
        <StageHighlight>
          <span role="img" aria-hidden>{step.highlight.icon}</span>
          <span>{step.highlight.copy}</span>
        </StageHighlight>
      </StageCard>
      )}

      {HIDE_EXTRAS ? null : (
        <Pipeline>
          {STAGE_FLOW.map((flow, idx) => {
            const status = idx < stepIndex ? 'done' : idx === stepIndex ? 'active' : 'todo';
            return (
              <PipelineStep key={flow.key} data-status={status}>
                <span className="dot">{flow.icon}</span>
                <span className="label">{flow.label}</span>
              </PipelineStep>
            );
          })}
        </Pipeline>
      )}

      {HIDE_EXTRAS ? null : (
        <FactCard>
          <span role="img" aria-hidden>🎉</span>
          <div>
            <h4>AI 분석 중 재미있는 사실!</h4>
            <p>{factCopy}</p>
          </div>
        </FactCard>
      )}

      {HIDE_EXTRAS ? null : (
        <MetricRow>
          <MetricBox>
            <span className="value">{items.length}</span>
            <span className="label">분석할 수업</span>
          </MetricBox>
          <MetricBox>
            <span className="value">{distinctCourses(items)}</span>
            <span className="label">선택된 클래스</span>
          </MetricBox>
          <MetricBox>
            <span className="value">{`${toneLabel[tone] ?? '맞춤'} · ${speechStyle === 'SEUMNIDA' ? '~습니다' : '~요'}`}</span>
            <span className="label">톤 & 말투</span>
          </MetricBox>
        </MetricRow>
      )}

      {HIDE_EXTRAS ? null : (
        <SectionCard>
          <ListHeader>
            <h5>지금 처리 중인 데이터</h5>
            <span>{items.length}건</span>
          </ListHeader>
          <MiniList>
            {items.slice(0, 6).map((it, i) => (
              <li key={i}>• {it.date}{it.courseTitle ? ` [${it.courseTitle}]` : ''}: {it.content.slice(0, 64)}</li>
            ))}
            {items.length > 6 && <li>… 외 {items.length - 6}건</li>}
          </MiniList>
          {error ? <ErrorText>{error}</ErrorText> : null}
          <ListActions>
            <GhostButtonSmall as="button" onClick={() => navigate('/marketing')}>취소</GhostButtonSmall>
          </ListActions>
        </SectionCard>
      )}
    </Page>
  );
}

const Viewport = styled.section`
  display: grid;
  justify-items: center;
  gap: 18px;
  padding: 48px 16px 12px;
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
  strong { font-size: 18px; font-weight: 800; color: #0f172a; }
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
  transition: width .25s ease;
`;

const StageCard = styled(SectionCard)`
  display: grid;
  gap: 16px;
  padding: 18px;
  border-radius: 18px;
  border: none;
  background: #ffffff;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.06);
`;

const StageHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  h3 { margin: 0; font-size: 16px; color: #111827; }
  p { margin: 6px 0 0; font-size: 13px; color: #4b5563; }
`;

const StageEmblem = styled.span`
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  font-size: 20px;
  background: #eef2ff;
  color: #312e81;
`;

const StageHighlight = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  border-radius: 14px;
  padding: 14px 16px;
  background: #f8fafc;
  color: #334155;
  font-size: 13px;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
  span:first-child { font-size: 16px; }
`;

const Pipeline = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 14px;
  padding: 6px 0;
`;

const PipelineStep = styled.div`
  display: grid;
  justify-items: center;
  gap: 10px;
  padding: 16px 10px 14px;
  border-radius: 20px;
  background: rgba(248, 250, 252, 0.82);
  border: 1px solid rgba(209, 213, 219, 0.6);
  transition: border-color .2s ease, background .2s ease, transform .2s ease;
  .dot {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    font-size: 18px;
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(203, 213, 225, 0.7);
    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
  }
  .label { font-size: 12px; color: #475569; text-align: center; }
  &[data-status='active'] {
    border-color: rgba(99, 102, 241, 0.45);
    background: rgba(99, 102, 241, 0.08);
    transform: translateY(-2px);
    .dot { border-color: rgba(99, 102, 241, 0.4); color: #4f46e5; box-shadow: 0 6px 18px rgba(79, 70, 229, 0.2); }
    .label { color: #312e81; font-weight: 700; }
  }
  &[data-status='done'] {
    border-color: rgba(34, 197, 94, 0.4);
    background: rgba(187, 247, 208, 0.22);
    .dot { border-color: rgba(34, 197, 94, 0.4); color: #15803d; }
    .label { color: #166534; font-weight: 600; }
  }
`;

const FactCard = styled(SectionCard)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 18px;
  border-radius: 18px;
  background: rgba(248, 250, 252, 0.9);
  border: none;
  span { font-size: 20px; }
  h4 { margin: 0; font-size: 14px; color: #0f172a; }
  p { margin: 4px 0 0; font-size: 13px; color: #475569; }
`;

const MetricRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
`;

const MetricBox = styled(SectionCard)`
  display: grid;
  justify-items: center;
  gap: 4px;
  padding: 14px 10px;
  border-radius: 16px;
  background: #ffffff;
  border: none;
  .value { font-size: 22px; font-weight: 800; color: #111827; }
  .label { font-size: 12px; color: #64748b; }
`;

const ListHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
  h5 { margin: 0; font-size: 13px; color: #1f2937; }
  span { font-size: 12px; color: #64748b; }
`;

const MiniList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 4px;
  color: ${({ theme }) => theme.colors.text};
  font-size: 13px;
`;

const ListActions = styled.div`
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
`;

const ErrorText = styled.span`
  color: #b91c1c;
  font-size: 12px;
  margin-top: 8px;
`;

const toneLabel: Record<string, string> = {
  WARM_VIVID: '따뜻·생동',
  CONCISE_NEUTRAL: '담백·간결',
  TRUST_CALM: '차분·신뢰',
  UPBEAT_POSITIVE: '밝음·긍정',
};

const STAGE_FLOW = [
  {
    key: 'collect',
    label: '수업 데이터 수집',
    icon: '📥',
    stageIcon: '🎯',
    title: '수업 데이터를 수집하고 있어요',
    description: '각 수업 기록에서 활용 가능한 정보를 추출하고 있어요.',
    highlight: { icon: '🗂', copy: '학생들의 변화를 데이터로 정리하는 중…' },
  },
  {
    key: 'pattern',
    label: '학습 패턴 분석',
    icon: '🧭',
    stageIcon: '🧮',
    title: '학습 패턴을 분석 중이에요',
    description: '학생 참여도와 반응을 패턴으로 정리하고 있어요.',
    highlight: { icon: '✨', copy: '공감할 만한 에피소드를 골라내고 있어요.' },
  },
  {
    key: 'effect',
    label: '교육 효과 측정',
    icon: '🎯',
    stageIcon: '🎯',
    title: '교육 효과를 측정하고 있어요',
    description: '성장 포인트와 성과를 평가하는 중이에요.',
    highlight: { icon: '📊', copy: '학부모님께 전달할 지표를 정리하는 중…' },
  },
  {
    key: 'points',
    label: '마케팅 포인트 추출',
    icon: '💡',
    stageIcon: '💡',
    title: '마케팅 포인트를 정리하고 있어요',
    description: '활용할 메시지와 스토리를 구성하는 중이에요.',
    highlight: { icon: '🪄', copy: '핵심 문장을 다듬어 매력적인 메시지를 만드는 중…' },
  },
  {
    key: 'summary',
    label: '최종 요약 생성',
    icon: '📝',
    stageIcon: '📝',
    title: '최종 요약을 작성 중이에요',
    description: '선택한 플랫폼에 맞춰 결과물을 마무리하고 있어요.',
    highlight: { icon: '📬', copy: '마케팅 초안을 전달할 준비를 하고 있어요!' },
  },
];

function currentStepIndex(progress: number) {
  if (progress >= 90) return 4;
  if (progress >= 70) return 3;
  if (progress >= 50) return 2;
  if (progress >= 30) return 1;
  return 0;
}

function funFact(count: number) {
  if (!count) return '아직 데이터를 불러오는 중입니다.';
  if (count < 3) return '짧고 간결한 요약을 위해 핵심 문장을 다듬고 있어요.';
  if (count < 6) return '평균적으로 1시간 수업에서 학생들이 “이해했어요!”라고 말하는 횟수는 약 15회랍니다.';
  return '수집한 수업 기록을 토대로 학부모에게 전할 이야기를 구성하고 있어요.';
}

function distinctCourses(items: SummarizeItem[]) {
  const set = new Set(items.map((it) => it.courseTitle).filter(Boolean));
  return set.size || '-';
}
