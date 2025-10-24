import styled, { keyframes } from "styled-components";
import type { AdminSummaryItem } from "@/features/admin/useAdminDashboard";

type Props = {
  items: AdminSummaryItem[];
  loading?: boolean;
};

export function AdminSummaryCards({ items, loading }: Props) {
  return (
    <Kpis>
      {items.map((item, index) => (
        <Kpi
          key={item.label}
          data-variant={(index % 3) + 1}
          data-loading={loading ? true : undefined}
        >
          <div className="icon" aria-hidden>
            {item.icon}
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
