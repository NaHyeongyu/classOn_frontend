import styled, { css } from "styled-components";
import { LoadingSpinner } from "@/components/common/Loading";

type AdminHeroProps = {
  adminName?: string;
  adminRole?: string | null;
  isLoggedIn: boolean;
  lastUpdatedLabel: string | null;
  isRefreshing: boolean;
  onRefresh: () => void;
  onClearCaches: () => void;
  onLogout: () => void;
  onLogin: () => void;
};

export function AdminHero({
  adminName,
  adminRole,
  isLoggedIn,
  lastUpdatedLabel,
  isRefreshing,
  onRefresh,
  onClearCaches,
  onLogout,
  onLogin,
}: AdminHeroProps) {
  return (
    <Hero>
      <HeroContent>
        <HeroBadges>
          <span className="badge accent">ADMIN PANEL</span>
          {isLoggedIn ? (
            <span className="badge muted">
              로그인: {adminName}
              {adminRole ? ` · ${adminRole}` : ""}
            </span>
          ) : (
            <span className="badge warn">관리자 로그인 필요</span>
          )}
        </HeroBadges>
        <h1>관리자 대시보드</h1>
        <p>운영 현황을 빠르게 확인하고 도구를 실행하세요.</p>
        <HeroMeta>
          <span className="chip">업데이트</span>
          <span className="value">
            {lastUpdatedLabel ?? "데이터 준비 중"}
          </span>
          {isRefreshing ? <SpinnerInline aria-hidden /> : null}
        </HeroMeta>
      </HeroContent>
      <HeroActions>
        <MonoPrimary type="button" onClick={onClearCaches}>
          캐시 초기화
        </MonoPrimary>
        <MonoGhost
          as="button"
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          {isRefreshing ? (
            <>
              <SpinnerInline aria-hidden />
              <span>갱신 중…</span>
            </>
          ) : (
            "데이터 새로고침"
          )}
        </MonoGhost>
        {isLoggedIn ? (
          <MonoGhost as="button" type="button" onClick={onLogout}>
            로그아웃
          </MonoGhost>
        ) : (
          <MonoGhost as="button" type="button" onClick={onLogin}>
            관리자 로그인
          </MonoGhost>
        )}
      </HeroActions>
    </Hero>
  );
}

const Hero = styled.header`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  align-items: flex-start;
  justify-content: space-between;
  padding: 28px 32px;
  border-radius: 20px;
  border: 1px solid rgba(99, 102, 241, 0.16);
  background: radial-gradient(
    140% 100% at 0% 0%,
    rgba(79, 70, 229, 0.14) 0%,
    rgba(59, 130, 246, 0.1) 40%,
    #ffffff 75%
  );
  box-shadow: 0 20px 45px rgba(15, 23, 42, 0.08);
  overflow: hidden;
  isolation: isolate;
  &::before {
    content: "";
    position: absolute;
    inset: -55% 35% auto -10%;
    height: 220px;
    border-radius: 50%;
    background: rgba(79, 70, 229, 0.18);
    filter: blur(90px);
    z-index: 0;
  }
  @media (max-width: 640px) {
    padding: 24px 20px;
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  gap: 12px;
  max-width: min(560px, 100%);
  h1 {
    margin: 0;
    font-size: 24px;
    font-weight: 800;
    letter-spacing: -0.01em;
    color: #0f172a;
  }
  p {
    margin: 0;
    color: #475569;
    font-size: 14px;
    line-height: 1.6;
  }
`;

const HeroBadges = styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  gap: 8px;
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 11px;
    letter-spacing: 0.04em;
    font-weight: 700;
  }
  .badge.accent {
    background: rgba(99, 102, 241, 0.16);
    color: #312e81;
  }
  .badge.muted {
    background: rgba(241, 245, 249, 0.85);
    color: #475569;
  }
  .badge.warn {
    background: #fee2e2;
    color: #b91c1c;
  }
`;

const HeroMeta = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  .chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: rgba(15, 23, 42, 0.06);
    color: #1f2937;
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.02em;
  }
  .value {
    font-size: 13px;
    font-weight: 700;
    color: #0f172a;
  }
`;

const HeroActions = styled.div`
  position: relative;
  z-index: 1;
  display: inline-flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const monoButtonBase = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 40px;
  padding: 0 14px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition:
    background 0.15s ease,
    color 0.15s ease,
    border-color 0.15s ease;
`;

const MonoPrimary = styled.button`
  ${monoButtonBase};
  background: #111827;
  color: #fff;
  border: 1px solid #111827;
  &:hover {
    background: #000;
    border-color: #000;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const MonoGhost = styled.button`
  ${monoButtonBase};
  background: #fff;
  color: #111827;
  border: 1px solid #e5e7eb;
  &:hover {
    background: #f9fafb;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  }
`;

const SpinnerInline = styled(LoadingSpinner)`
  width: 16px;
  height: 16px;
  flex-shrink: 0;
`;
