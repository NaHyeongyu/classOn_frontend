import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { GhostButtonSmall } from "./UI";
import type { ReactNode } from "react";

type Props = {
  to?: string;
  label?: string;
  className?: string;
  backSteps?: number; // defaults to 1
  icon?: ReactNode;
  onClick?: () => void;
};

export default function BackButton({ to, label = "뒤로가기", className, backSteps = 1, icon, onClick }: Props) {
  const navigate = useNavigate();
  const goBack = () => {
    if (onClick) return onClick();
    if (to) navigate(to);
    else navigate(-Math.abs(backSteps));
  };
  return (
    <Btn as="button" type="button" onClick={goBack} className={className}>
      <Icon aria-hidden>{icon ?? leftIcon}</Icon>
      {label}
    </Btn>
  );
}

const Btn = styled(GhostButtonSmall)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
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

