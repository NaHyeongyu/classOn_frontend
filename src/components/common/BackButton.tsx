import { useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import { GhostButtonSmall } from "./UI";
import type { ReactNode } from "react";

type BackButtonSize = "sm" | "md" | "lg";

type Props = {
  to?: string;
  label?: string;
  className?: string;
  backSteps?: number; // defaults to 1
  icon?: ReactNode;
  showIcon?: boolean;
  size?: BackButtonSize;
  fullWidth?: boolean;
  onClick?: () => void;
};

export default function BackButton({
  to,
  label = "뒤로가기",
  className,
  backSteps = 1,
  icon,
  showIcon = true,
  size = "sm",
  fullWidth = false,
  onClick,
}: Props) {
  const navigate = useNavigate();
  const goBack = () => {
    if (onClick) return onClick();
    if (to) navigate(to);
    else navigate(-Math.abs(backSteps));
  };
  return (
    <Btn
      as="button"
      type="button"
      onClick={goBack}
      className={className}
      $size={size}
      $fullWidth={fullWidth}
    >
      {showIcon ? <Icon aria-hidden>{icon ?? leftIcon}</Icon> : null}
      {label}
    </Btn>
  );
}

const Btn = styled(GhostButtonSmall)<{ $size: BackButtonSize; $fullWidth: boolean }>`
  gap: 6px;

  ${(p) =>
    p.$size === "sm" &&
    css`
      height: 32px;
      padding: 0 12px;
      font-size: ${p.theme.font.size.sm};
      border-radius: ${p.theme.radii.sm};
    `}

  ${(p) =>
    p.$size === "lg" &&
    css`
      height: 48px;
      padding: 0 20px;
    `}

  ${(p) =>
    p.$fullWidth
      ? css`
          width: 100%;
          place-self: stretch;
        `
      : css`
          /* Prevent stretching inside grid containers like Page */
          place-self: start;
          width: max-content;
        `}
`;

const Icon = styled.span`
  display: inline-grid;
  place-items: center;
`;

const leftIcon = (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
