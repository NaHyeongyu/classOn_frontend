import styled, { keyframes } from "styled-components";
import type {
  AdminDashboardSummaryMetric,
  AdminSummaryMetricId,
} from "@/features/admin/useAdminDashboardPage";

type Props = {
  items: AdminDashboardSummaryMetric[];
  loading?: boolean;
};

export function AdminSummaryCards({ items, loading }: Props) {
  return (
    <Kpis>
      {items.map((item, index) => (
        <Kpi
          key={item.id}
          data-variant={(index % 3) + 1}
          data-loading={loading ? true : undefined}
        >
          <div className="icon" aria-hidden>
            {renderIcon(item.id)}
          </div>
          <div className="content">
            {loading ? (
              <>
                <SkeletonLine />
                <SkeletonLine $size="lg" />
              </>
            ) : (
              <>
                <span className="label">{item.label}</span>
                <span className="value">{item.value}</span>
              </>
            )}
          </div>
        </Kpi>
      ))}
    </Kpis>
  );
}

const Kpis = styled.div`
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
`;

const Kpi = styled.div`
  position: relative;
  border: 1px solid rgba(226, 232, 240, 1);
  border-radius: 16px;
  padding: 18px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 14px;
  align-items: center;
  background: #ffffff;
  overflow: hidden;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    border-color 0.18s ease;
  &:hover {
    transform: translateY(-2px);
    border-color: rgba(148, 163, 184, 0.4);
    box-shadow: 0 16px 32px rgba(15, 23, 42, 0.08);
  }
  &:before {
    content: "";
    position: absolute;
    inset: auto -25% -35% -25%;
    height: 60%;
    background: var(--kpi-bg, #eef2ff);
    filter: blur(28px);
    z-index: 0;
  }
  &[data-variant="1"] {
    --kpi-bg: #e0e7ff;
    --kpi-icon-bg: rgba(224, 231, 255, 0.7);
    --kpi-icon-color: #4338ca;
  }
  &[data-variant="2"] {
    --kpi-bg: #dcfce7;
    --kpi-icon-bg: rgba(187, 247, 208, 0.7);
    --kpi-icon-color: #15803d;
  }
  &[data-variant="3"] {
    --kpi-bg: #fee2e2;
    --kpi-icon-bg: rgba(254, 215, 215, 0.7);
    --kpi-icon-color: #b91c1c;
  }
  &[data-loading] {
    background: #f8fafc;
  }
  &[data-loading]:before {
    opacity: 0;
  }
  &[data-loading] .icon {
    background: rgba(226, 232, 240, 0.8);
    color: #94a3b8;
  }
  .icon {
    position: relative;
    z-index: 1;
    display: grid;
    place-items: center;
    width: 48px;
    height: 48px;
    border-radius: 14px;
    background: var(--kpi-icon-bg, rgba(224, 231, 255, 0.7));
    color: var(--kpi-icon-color, #4338ca);
    flex-shrink: 0;
  }
  .content {
    position: relative;
    z-index: 1;
    display: grid;
    gap: 6px;
  }
  .label {
    color: #6b7280;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.01em;
  }
  .value {
    color: #0f172a;
    font-size: 20px;
    font-weight: 800;
    letter-spacing: -0.01em;
  }
`;

const shimmer = keyframes`
  0% { background-position: 100% 0; }
  100% { background-position: 0 0; }
`;

const SkeletonLine = styled.span<{ $size?: "lg" }>`
  display: block;
  width: 60%;
  height: ${({ $size }) => ($size === "lg" ? "20px" : "12px")};
  border-radius: 999px;
  background: linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 50%, #f1f5f9 100%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.2s ease-in-out infinite;
`;

function renderIcon(id: AdminSummaryMetricId) {
  switch (id) {
    case "academies":
      return (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 21h18" />
          <path d="M4 21V9l8-6 8 6v12" />
          <path d="M9 21V12h6v9" />
        </svg>
      );
    case "logins30d":
      return (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      );
    case "paymentsAmount30d":
      return (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="5" width="20" height="14" rx="3" />
          <path d="M16 12h4" />
          <path d="M16 9h4" />
        </svg>
      );
    case "apiCallsToday":
      return (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <rect x="9" y="9" width="6" height="6" rx="1" />
          <path d="M9 2v2 M15 2v2 M9 20v2 M15 20v2 M2 9h2 M2 15h2 M20 9h2 M20 15h2" />
        </svg>
      );
    case "openaiCallsToday":
      return (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m12 2 1.7 5.2L19 9l-4 3 1.5 5L12 14l-4.5 3 1.5-5-4-3 5.3-1.8L12 2z" />
        </svg>
      );
    case "feedbackNew":
      return (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 4h16l2 8-2 8H4l-2-8z" />
          <path d="M4 12h5l2 3h2l2-3h5" />
        </svg>
      );
    default:
      return null;
  }
}
