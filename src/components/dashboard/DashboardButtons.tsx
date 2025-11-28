import styled from "styled-components";
import { PrimaryButton } from "@/components/common/UI";

export const DashboardMoreButton = styled(PrimaryButton)`
  border-radius: ${(p) => p.theme.radii.lg};
  height: 40px;
  padding: 0 16px;
  &:hover:not(:disabled) {
    transform: none;
  }
  &:active:not(:disabled) {
    transform: none;
  }
`;
