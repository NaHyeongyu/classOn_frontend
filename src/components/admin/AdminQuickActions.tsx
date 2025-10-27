import styled from "styled-components";
import type {
  AdminDashboardQuickAction,
  AdminQuickActionIcon,
} from "@/features/admin/useAdminDashboardPage";

type Props = {
  actions: AdminDashboardQuickAction[];
};

export function AdminQuickActions({ actions }: Props) {
  return (
    <QuickGrid>
      {actions.map((action) => {
        const isLink = Boolean(action.href);
        const cardProps = isLink
          ? ({ as: "a", href: action.href } as const)
          : ({
              as: "button",
              type: "button" as const,
              onClick: action.onClick,
            });
        return (
          <QuickCard key={action.title} {...cardProps}>
            <div className="iconWrap" aria-hidden>
              {renderIcon(action.icon)}
            </div>
            <div className="body">
              <span className="title">{action.title}</span>
              <span className="desc">{action.description}</span>
            </div>
          </QuickCard>
        );
      })}
    </QuickGrid>
  );
}

const QuickGrid = styled.div`
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
`;

const QuickCard = styled.button`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  background: #ffffff;
  color: #0f172a;
  text-align: left;
  cursor: pointer;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    border-color 0.18s ease,
    background 0.18s ease;
  text-decoration: none;
  position: relative;
  z-index: 0;
  .iconWrap {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: rgba(224, 231, 255, 0.6);
    color: #4338ca;
    flex-shrink: 0;
  }
  .body {
    display: grid;
    gap: 6px;
  }
  .title {
    font-size: 14px;
    font-weight: 700;
    letter-spacing: -0.005em;
  }
  .desc {
    font-size: 12px;
    color: #475569;
    line-height: 1.5;
  }
  &:hover {
    transform: translateY(-2px);
    border-color: rgba(99, 102, 241, 0.35);
    box-shadow: 0 16px 32px rgba(15, 23, 42, 0.12);
  }
  &:focus-visible {
    outline: 2px solid rgba(79, 70, 229, 0.55);
    outline-offset: 2px;
  }
  &:active {
    transform: translateY(0);
    box-shadow: 0 6px 18px rgba(15, 23, 42, 0.12);
  }
  &[href] {
    cursor: pointer;
  }
`;

function renderIcon(icon: AdminQuickActionIcon) {
  switch (icon) {
    case "spark":
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
    case "refresh":
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
          <polyline points="23 4 23 10 17 10" />
          <polyline points="1 20 1 14 7 14" />
          <path d="M3.51 9a9 9 0 0 1 14.63-3.36L23 10" />
          <path d="M20.49 15a9 9 0 0 1-14.63 3.36L1 14" />
        </svg>
      );
    case "cpu":
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
    case "activity":
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
    case "terminal":
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
          <rect x="3" y="4" width="18" height="14" rx="2" />
          <path d="m7 8 3 3-3 3" />
          <path d="M11 16h6" />
        </svg>
      );
    case "wallet":
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
    case "inbox":
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
