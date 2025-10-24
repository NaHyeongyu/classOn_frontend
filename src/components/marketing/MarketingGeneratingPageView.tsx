import styled from "styled-components";
import { Page, GhostButtonSmall } from "@/components/common/UI";

type Props = {
  itemsCount: number;
  progress: number;
  error: string | null;
  onRetry: () => void;
  onBackHome: () => void;
};

export function MarketingGeneratingPageView({ itemsCount, progress, error, onRetry, onBackHome }: Props) {
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
              <GhostButtonSmall as="button" onClick={onRetry}>
                다시 시도
              </GhostButtonSmall>
              <GhostButtonSmall as="button" onClick={onBackHome}>
                마케팅 홈으로
              </GhostButtonSmall>
            </ErrorActions>
          </ErrorCard>
        ) : (
          <HelperText>선택한 데이터 {itemsCount}건을 분석하는 중입니다…</HelperText>
        )}
      </Viewport>
    </Page>
  );
}

export function MarketingGeneratingEmptyState({ onBackHome }: { onBackHome: () => void }) {
  return (
    <Page>
      <Viewport>
        <HeroText>
          <h2>선택된 데이터가 없습니다</h2>
          <p>마케팅 페이지에서 다시 수업과 기간을 선택해주세요.</p>
        </HeroText>
        <GhostButtonSmall as="button" onClick={onBackHome}>
          마케팅 홈으로
        </GhostButtonSmall>
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

