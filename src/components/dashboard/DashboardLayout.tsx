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
  dense?: boolean;
  height?: string;
  maxHeight?: string;
};

export function DashboardPanel({
  span = 6,
  rowSpan = 1,
  className,
  style,
  dense = false,
  height,
  maxHeight,
  children,
}: PanelProps) {
  return (
    <Panel
      className={className}
      style={style}
      $span={span}
      $rowSpan={rowSpan}
      $dense={dense}
      $height={height}
      $maxHeight={maxHeight}
    >
      {children}
    </Panel>
  );
}

const Wrapper = styled.section`
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: minmax(0, auto);
  gap: ${(p) => p.theme.spacing.pageGap};
  width: 100%;

  @media (max-width: 768px) {
    gap: ${(p) => p.theme.spacing.md};
  }
`;

const Panel = styled.section<{
  $span: number;
  $rowSpan: number;
  $dense?: boolean;
  $height?: string;
  $maxHeight?: string;
}>`
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
  padding: ${({ $dense, theme }) => ($dense ? theme.spacing.md : theme.spacing.lg)};
  color: ${(p) => p.theme.colors.text};
  overflow: hidden;
  align-self: start;
  width: 100%;
  ${({ $height }) =>
    $height
      ? css`
          height: ${$height};
        `
      : null};
  ${({ $maxHeight, $height }) =>
    $maxHeight
      ? css`
          max-height: ${$maxHeight};
        `
      : $height
        ? css`
            max-height: ${$height};
          `
        : null};

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
