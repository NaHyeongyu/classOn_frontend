import type { ReactNode } from "react";
import styled, { keyframes, css } from "styled-components";

export type KPIProps = {
  title: string;
  icon: ReactNode;
  iconAccent: "indigo" | "emerald" | "green" | "violet";
  value: ReactNode;
  footerLeft?: ReactNode;
  footerRight?: ReactNode;
  loading?: boolean;
  error?: boolean;
  onRetry?: () => void;
};

export function KPI({
  title,
  icon,
  iconAccent,
  value,
  footerLeft,
  footerRight,
  loading,
  error,
  onRetry,
}: KPIProps) {
  return (
    <KPICard aria-busy={loading}>
      <KPIHeader>
        {loading ? (
          <>
            <SkeletonTitle />
            <SkeletonIcon />
          </>
        ) : (
          <>
            <KPITitle>{title}</KPITitle>
            <IconBadge $accent={iconAccent}>{icon}</IconBadge>
          </>
        )}
      </KPIHeader>
      {loading ? (
        <SkeletonValue />
      ) : error ? (
        <ErrorRow>
          <span>불러오기 실패</span>
          {onRetry && (
            <RetryButton type="button" onClick={onRetry}>
              다시 시도
            </RetryButton>
          )}
        </ErrorRow>
      ) : (
        <KPIValue>{value}</KPIValue>
      )}
      <KPIFooter>
        {loading ? (
          <>
            <SkeletonPill style={{ width: 90 }} />
            <SkeletonPill style={{ width: 64 }} />
          </>
        ) : (
          <>
            <span>{footerLeft}</span>
            <span>{footerRight}</span>
          </>
        )}
      </KPIFooter>
    </KPICard>
  );
}

export function UsersIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M4 21v-2a4 4 0 0 1 3-3.87" />
      <circle cx="7" cy="7" r="4" />
      <circle cx="17" cy="7" r="4" />
    </svg>
  );
}

export function CreditIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
      <rect x="6" y="14" width="6" height="2" />
    </svg>
  );
}

export function CheckIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export function ClassIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 10L12 4 2 10l10 6 10-6z" />
      <path d="M6 12v5l6 3 6-3v-5" />
    </svg>
  );
}

export const KPICard = styled.article`
  /* Card visuals aligned across pages */
  --kpi-card-height: 140px;
  height: var(--kpi-card-height);
  min-height: var(--kpi-card-height);
  grid-column: span 4; /* 3-up layout on 12-col dashboard */
  border-radius: ${(p) => p.theme.radii.xl};
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.surface};
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-sizing: border-box;
`;

export const KPIHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const KPITitle = styled.h4`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: ${(p) => p.theme.colors.textMuted};
`;

export const KPIValue = styled.div`
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: ${(p) => p.theme.colors.text};
`;

export const KPIFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${(p) => p.theme.colors.textMuted};
  font-size: 12px;
  margin-top: auto; /* pin footer to bottom for consistent vertical rhythm */
`;

// Shimmer utilities shared by skeletons
const shimmer = keyframes`
  0% { background-position: 100% 0; }
  100% { background-position: 0 0; }
`;

const shimmerCss = css`
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 37%, #f3f4f6 63%);
  background-size: 400% 100%;
  animation: ${shimmer} 1.2s ease-in-out infinite;
`;

export const IconBadge = styled.span<{
  $accent?: "indigo" | "emerald" | "green" | "violet";
}>`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  font-size: 0;
  ${(p) =>
    p.$accent === "emerald"
      ? "background:#ecfdf5; color:#059669;"
      : p.$accent === "green"
      ? "background:#dcfce7; color:#16a34a;"
      : p.$accent === "violet"
      ? "background:#f3e8ff; color:#7c3aed;"
      : "background:#eef2ff; color:#4f46e5;"}
`;

export const DeltaPill = styled.span<{
  $tone?: "positive" | "negative" | "neutral";
}>`
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
  ${(p) =>
    p.$tone === "positive"
      ? "background:#dcfce7; color:#16a34a;"
      : p.$tone === "negative"
      ? "background:#fee2e2; color:#b91c1c;"
      : "background:#e5e7eb; color:#6b7280;"}
`;

export const SkeletonLine = styled.div<{ $w?: number; $h?: number }>`
  width: ${(p) => (p.$w ? `${p.$w}px` : "100%")};
  height: ${(p) => (p.$h ? `${p.$h}px` : "14px")};
  border-radius: 6px;
  ${shimmerCss}
`;

const ErrorRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #b91c1c;
  font-weight: 600;
`;

const RetryButton = styled.button`
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid #fecaca;
  background: #fee2e2;
  color: #991b1b;
  cursor: pointer;
`;

const SkeletonIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  ${shimmerCss}
`;

const SkeletonTitle = styled.div`
  width: 140px;
  height: 14px;
  border-radius: 6px;
  ${shimmerCss}
`;

const SkeletonValue = styled.div`
  width: 200px;
  height: 28px;
  border-radius: 8px;
  margin-top: 6px;
  ${shimmerCss}
`;

const SkeletonPill = styled.div`
  height: 20px;
  border-radius: 9999px;
  ${shimmerCss}
`;
