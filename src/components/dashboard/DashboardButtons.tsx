import styled from "styled-components";
import { GhostButton } from "@/components/common/UI";

export const DashboardMoreButton = styled(GhostButton)`
  border-color: ${(p) => p.theme.colors.primary};
  background: ${(p) => p.theme.colors.primary};
  color: #ffffff;
  font-weight: ${(p) => p.theme.font.weight.semiBold};
  border-radius: ${(p) => p.theme.radii.lg};
  transition: background 0.2s ease, color 0.2s ease, border 0.2s ease;
  &:hover:not(:disabled) {
    background: ${(p) => p.theme.colors.surface};
    color: ${(p) => p.theme.colors.primary};
    border-color: ${(p) => p.theme.colors.primary};
    transform: none;
  }
  &:active:not(:disabled) {
    transform: none;
  }
`;
