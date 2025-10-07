import styled, { css } from "styled-components";
import type { CSSProperties, ReactNode } from "react";

export function DashboardGrid({ children }: { children: ReactNode }) {
  return <Wrapper>{children}</Wrapper>;
}

type PanelProps = {
  span?: number;
  rowSpan?: number;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function DashboardPanel({
  span = 6,
  rowSpan = 1,
  className,
  style,
  children,
}: PanelProps) {
  return (
    <Panel
      className={className}
      style={style}
      $span={span}
      $rowSpan={rowSpan}
    >
      {children}
    </Panel>
  );
}

const Wrapper = styled.section`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  grid-auto-rows: minmax(0, auto);
  gap: ${(p) => p.theme.spacing.pageGap};
  width: 100%;

  @media (max-width: 1200px) {
    gap: ${(p) => p.theme.spacing.lg};
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${(p) => p.theme.spacing.md};
  }
`;

const Panel = styled.section<{ $span: number; $rowSpan: number }>`
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing.md};
  min-height: 0;
  grid-column: span ${({ $span }) => $span};
  ${({ $rowSpan }) =>
    $rowSpan > 1
      ? css`
          grid-row: span ${$rowSpan};
        `
      : null};
  border-radius: ${(p) => p.theme.radii.md};
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.surface};
  box-shadow: ${(p) => p.theme.shadow.low};
  padding: ${(p) => p.theme.spacing.lg};
  color: ${(p) => p.theme.colors.text};
  overflow: hidden;

  @media (max-width: 1024px) {
    grid-column: 1 / -1;
    ${({ $rowSpan }) =>
      $rowSpan > 1
        ? css`
            grid-row: auto;
          `
        : null};
  }
`;
