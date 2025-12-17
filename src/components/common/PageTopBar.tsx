import type { ReactNode } from "react";
import styled, { css } from "styled-components";
import BackButton from "@/components/common/BackButton";

type Align = "center" | "left";

type Props = {
  title: ReactNode;
  titleAs?: "h1" | "h2";
  titleSize?: "display" | "lg" | "md";
  align?: Align;
  className?: string;
  actions?: ReactNode;

  backLabel?: string;
  to?: string;
  onBack?: () => void;
  backSteps?: number;
  backSize?: "sm" | "md" | "lg";
  backButton?: ReactNode;
};

export default function PageTopBar({
  title,
  titleAs = "h2",
  titleSize = "display",
  align = "center",
  className,
  actions,
  backLabel = "뒤로",
  to,
  onBack,
  backSteps,
  backSize = "sm",
  backButton,
}: Props) {
  const hasBack = Boolean(backButton || to || onBack || backSteps);
  const hasActions = Boolean(actions);
  const renderedBack =
    backButton ??
    (hasBack ? (
      <BackButton
        label={backLabel}
        to={to}
        onClick={onBack}
        backSteps={backSteps}
        size={backSize}
      />
    ) : null);

  const renderedTitle =
    typeof title === "string" ? (
      <Title as={titleAs} $size={titleSize}>
        {title}
      </Title>
    ) : (
      title
    );

  if (align === "left") {
    return (
      <Root
        className={className}
        $align="left"
        $hasBack={Boolean(renderedBack)}
        $hasActions={hasActions}
      >
        <LeftGroup>
          {renderedBack}
          <TitleWrap>{renderedTitle}</TitleWrap>
        </LeftGroup>
        {hasActions ? <ActionsWrap>{actions}</ActionsWrap> : null}
      </Root>
    );
  }

  return (
    <Root
      className={className}
      $align="center"
      $hasBack={Boolean(renderedBack)}
      $hasActions={hasActions}
    >
      {renderedBack ? <BackWrap>{renderedBack}</BackWrap> : null}
      <TitleCenter>{renderedTitle}</TitleCenter>
      {hasActions ? <ActionsWrap>{actions}</ActionsWrap> : null}
    </Root>
  );
}

const Root = styled.header<{ $align: Align; $hasBack: boolean; $hasActions: boolean }>`
  display: grid;
  align-items: center;
  gap: ${(p) => p.theme.spacing.md};
  min-width: 0;

  ${(p) =>
    p.$align === "left"
      ? css`
          grid-template-columns: ${p.$hasActions ? "1fr auto" : "1fr"};
          justify-content: space-between;
        `
      : css`
          grid-template-columns: ${p.$hasBack ? "auto 1fr" : "1fr"}${p.$hasActions ? " auto" : ""};
        `}

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
    gap: ${(p) => p.theme.spacing.sm};
    justify-items: flex-start;
  }

`;

const Title = styled.h2<{ $size: NonNullable<Props["titleSize"]> }>`
  margin: 0;
  color: ${(p) => p.theme.colors.text};
  letter-spacing: -0.01em;
  line-height: ${(p) => p.theme.font.lineHeight.tight};
  font-weight: ${(p) => p.theme.font.weight.bold};
  ${(p) =>
    p.$size === "md"
      ? css`
          font-size: ${p.theme.font.size.lg};
        `
      : p.$size === "lg"
      ? css`
          font-size: ${p.theme.font.size.xl};
        `
      : css`
          font-size: ${p.theme.font.size.display};
        `}
`;

const LeftGroup = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing.sm};
  min-width: 0;
`;

const BackWrap = styled.div`
  display: inline-flex;
  align-items: center;
`;

const TitleWrap = styled.div`
  min-width: 0;
`;

const TitleCenter = styled.div`
  min-width: 0;
  @media (min-width: 721px) {
    justify-self: center;
    text-align: center;
  }
`;

const ActionsWrap = styled.div`
  display: inline-flex;
  gap: ${(p) => p.theme.spacing.sm};
  flex-wrap: wrap;
  justify-content: flex-end;
  @media (max-width: 720px) {
    justify-content: flex-start;
  }
`;
