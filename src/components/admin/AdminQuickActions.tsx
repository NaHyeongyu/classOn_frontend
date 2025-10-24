import styled from "styled-components";
import type { ReactNode } from "react";

export type AdminQuickAction = {
  title: string;
  description: string;
  icon: ReactNode;
  href?: string;
  onClick?: () => void;
};

type Props = {
  actions: AdminQuickAction[];
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
              {action.icon}
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
