import styled from "styled-components";
import { buttonVariants } from "./UI";
import type { ReactNode } from "react";

type Props = {
  icon?: ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionVariant?: "primary" | "outline";
  className?: string;
};

export function EmptyPlaceholder({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  actionVariant = "primary",
  className,
}: Props) {
  return (
    <Box className={className} role="status" aria-live="polite">
      {icon ? <IconWrap aria-hidden>{icon}</IconWrap> : null}
      <Content>
        <Title>{title}</Title>
        {description ? <Desc>{description}</Desc> : null}
      </Content>
      {actionLabel && onAction ? (
        <Action
          type="button"
          $variant={actionVariant}
          onClick={onAction}
        >
          {actionLabel}
        </Action>
      ) : null}
    </Box>
  );
}

const Box = styled.div`
  padding: 24px 12px;
  display: grid;
  gap: 6px;
  justify-items: center;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const IconWrap = styled.span`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Content = styled.div`
  display: grid;
  gap: 6px;
`;

const Title = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Desc = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Action = styled.button<{ $variant: "primary" | "outline" }>`
  ${({ $variant }) =>
    $variant === "outline" ? buttonVariants.outline : buttonVariants.primary};
  height: 40px;
  padding: 0 18px;
  font-size: 13px;
  margin-top: 4px;
`;
