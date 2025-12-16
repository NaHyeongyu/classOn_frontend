import styled from "styled-components";
import { buttonVariants } from "@/components/common/UI";
import BackButtonBase from "@/components/common/BackButton";

export const Sub = styled.p`
  margin: 0 0 24px;
  color: ${(p) => p.theme.colors.textMuted};
  font-size: ${(p) => p.theme.font.size.lg};
  text-align: center;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 560px;
  margin: 0 auto;
  width: 100%;
`;

export const SectionTitle = styled.h3`
  margin: 6px 0 4px;
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${(p) => p.theme.colors.text};
  font-weight: 600;
`;

export const Divider = styled.hr`
  border: none;
  margin: 6px 0 2px;
`;

export const Rules = styled.div`
  display: flex;
  gap: 8px;
  font-size: ${(p) => p.theme.font.size.xs};
  color: ${(p) => p.theme.colors.textMuted};
`;

export const Rule = styled.span<{ ok: boolean }>`
  color: ${({ ok, theme }) => (ok ? theme.colors.success : theme.colors.textMuted)};
  transition: color 0.2s;
`;

export const Label = styled.label`
  font-size: ${(p) => p.theme.font.size.md};
  font-weight: 600;
  color: ${(p) => p.theme.colors.text};
  margin-bottom: -16px; /* Pull closer to input */
  z-index: 1;
  span {
    color: ${(p) => p.theme.colors.danger};
    margin-left: 2px;
  }
`;

export const Input = styled.input`
  height: 64px;
  border: none;
  border-bottom: 2px solid ${(p) => p.theme.colors.borderMuted};
  border-radius: 0;
  padding: 0 ${(p) => p.theme.spacing.md};
  font-size: ${(p) => p.theme.font.size.lg};
  background: transparent;
  outline: none;
  transition: all 0.2s ease;
  color: ${(p) => p.theme.colors.text};

  &::placeholder {
    color: ${(p) => p.theme.colors.textMuted};
  }
  &:focus {
    border-bottom-color: ${(p) => p.theme.colors.primary};
    background: transparent;
  }
  &[aria-invalid="true"] {
    border-bottom-color: ${(p) => p.theme.colors.danger};
  }
`;

export const Pills = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const PillButton = styled.button`
  height: 48px;
  padding: 0 20px;
  border-radius: 999px;
  border: none;
  background: ${(p) => p.theme.colors.surfaceMuted};
  color: ${(p) => p.theme.colors.text};
  font-weight: 600;
  font-size: ${(p) => p.theme.font.size.md};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${(p) => p.theme.colors.borderStrong};
  }
  &[data-active="true"] {
    background: ${(p) => p.theme.colors.primary};
    color: ${(p) => p.theme.colors.textInverted};
    box-shadow: ${(p) => p.theme.shadow.medium};
  }
`;

export const PillInputWrap = styled.div`
  display: inline-flex;
  align-items: center;
  min-height: 40px;
  padding: 0 14px;
  border-radius: 999px;
  border: none;
  background: ${(p) => p.theme.colors.surfaceMuted};
  color: ${(p) => p.theme.colors.text};
  &:focus-within {
    background: ${(p) => p.theme.colors.surface};
    box-shadow: ${(p) => p.theme.shadow.focusPrimary};
  }
`;

export const PillTextInput = styled.input`
  border: none;
  background: transparent;
  outline: none;
  font-size: ${(p) => p.theme.font.size.sm};
  width: 100%;
  color: ${(p) => p.theme.colors.text};
  &::placeholder {
    color: ${(p) => p.theme.colors.textMuted};
  }
`;

export const Row = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

export const SmallButton = styled.button`
  ${buttonVariants.subtle};
  height: 64px;
  border-radius: ${(p) => p.theme.radii.lg};
  font-weight: 700;
  font-size: ${(p) => p.theme.font.size.md};
  padding: 0 24px;
  &:disabled {
    opacity: 0.6;
  }
`;

export const ErrorText = styled.div`
  color: ${(p) => p.theme.colors.danger};
  background: ${(p) => p.theme.colors.dangerSurface};
  padding: 10px 12px;
  border-radius: ${(p) => p.theme.radii.md};
  font-size: ${(p) => p.theme.font.size.sm};
`;

export const Hint = styled.div<{ success?: boolean; danger?: boolean }>`
  color: ${({ danger, success, theme }) => (danger ? theme.colors.danger : success ? theme.colors.success : theme.colors.textMuted)};
  background: ${({ danger, success, theme }) => (danger ? theme.colors.dangerSurface : success ? theme.colors.successSurface : theme.colors.surfaceMuted)};
  padding: 10px 12px;
  border-radius: ${(p) => p.theme.radii.md};
  font-size: ${(p) => p.theme.font.size.xs};
`;

export const AgreeRow = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
  align-items: start;
  color: ${(p) => p.theme.colors.textMuted};
  font-size: ${(p) => p.theme.font.size.sm};
  padding: 12px 14px;
  border: none;
  border-radius: ${(p) => p.theme.radii.md};
  background: ${(p) => p.theme.colors.surfaceMuted};
  input {
    width: 18px;
    height: 18px;
    margin-top: 2px;
    accent-color: ${(p) => p.theme.colors.primary};
  }
  label {
    user-select: none;
    line-height: 1.6;
  }
  a {
    color: ${(p) => p.theme.colors.primary};
    font-weight: 700;
    text-decoration: underline;
  }
`;

export const ScrollArea = styled.div`
  max-height: 70vh;
  overflow: auto;
  padding-right: 4px;
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${(p) => p.theme.colors.border};
    border-radius: 3px;
  }
`;

export const TermsBody = styled.div`
  white-space: pre-line;
  overflow-wrap: anywhere;
  word-break: keep-all;
  color: ${(p) => p.theme.colors.text};
  font-size: ${(p) => p.theme.font.size.sm};
  line-height: 1.6;
`;

export const ChoiceGrid = styled.div`
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
`;

export const ChoiceCard = styled.button`
  border: none;
  border-radius: ${(p) => p.theme.radii.md};
  background: ${(p) => p.theme.colors.surfaceMuted};
  padding: 14px 16px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    background: ${(p) => p.theme.colors.borderStrong};
  }
  &[data-active="true"] {
    background: ${(p) => p.theme.colors.primarySurface};
    box-shadow: ${(p) => p.theme.shadow.medium};
    transform: translateY(-1px);
  }
  &:focus-visible {
    outline: none;
    box-shadow: ${(p) => p.theme.shadow.focusPrimary};
  }
`;

export const ChoiceTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 700;
  color: ${(p) => p.theme.colors.text};
  margin-bottom: 4px;
  font-size: ${(p) => p.theme.font.size.md};
`;

export const ChoiceBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid transparent;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  background: ${(p) => p.theme.colors.primarySurface};
  color: ${(p) => p.theme.colors.primary};
  &[data-variant="warning"] {
    background: #fef2f2;
    color: #b91c1c;
    border-color: #fecaca;
  }
  &[data-variant="muted"] {
    background: #dcfce7;
    color: #166534;
    border-color: #16a34a;
  }
`;

export const ChoicePrice = styled.div`
  margin: 0 0 4px;
  font-weight: 700;
  color: ${(p) => p.theme.colors.text};
  font-size: ${(p) => p.theme.font.size.md};
`;

export const ChoiceMeta = styled.div`
  color: ${(p) => p.theme.colors.textMuted};
  font-size: ${(p) => p.theme.font.size.sm};
  margin-bottom: 0;
`;

export const ChoiceNote = styled.div`
  color: ${(p) => p.theme.colors.textMuted};
  font-size: ${(p) => p.theme.font.size.xs};
  line-height: 1.5;
`;

export const ChoiceList = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 32px;
`;

export const ScaleCard = styled.button`
  padding: 16px 28px;
  border-radius: 999px;
  border: 1px solid transparent;
  background: ${(p) => p.theme.colors.surfaceMuted};
  color: ${(p) => p.theme.colors.textMuted};
  font-size: ${(p) => p.theme.font.size.md};
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background: ${(p) => p.theme.colors.surface};
    border-color: ${(p) => p.theme.colors.border};
  }

  &[data-active="true"] {
    background: ${(p) => p.theme.colors.primarySurface};
    color: ${(p) => p.theme.colors.primary};
    border-color: ${(p) => p.theme.colors.primary};
    box-shadow: 0 0 0 1px ${(p) => p.theme.colors.primarySurface};
  }
`;

export const ActionRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
  align-items: center;
  margin-top: 32px;
`;

export const BackButton = styled(BackButtonBase).attrs({
  size: "lg",
  fullWidth: true,
  showIcon: false,
})`
  border-radius: ${(p) => p.theme.radii.md};
  font-weight: 700;
`;

export const PlanGrid = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  gap: 24px;
  align-items: stretch;
  overflow-x: auto;
  padding: 6px 0 4px;
`;

export const PlanCard = styled.button`
  flex: 1 0 0;
  min-width: 280px;
  max-width: 340px;
  background: ${(p) => p.theme.colors.surfaceMuted};
  border: 1px solid transparent;
  border-radius: 24px;
  padding: 32px;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${(p) => p.theme.shadow.high};
    background: ${(p) => p.theme.colors.surface};
  }

  &[data-active="true"] {
    background: #ffffff;
    border-color: ${(p) => p.theme.colors.primary};
    box-shadow: 0 14px 32px rgba(15, 23, 42, 0.18);
    transform: translateY(-6px);
  }
`;

export const PlanHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 24px;
`;

export const PlanTitle = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: ${(p) => p.theme.colors.text};
  margin-top: 12px;
  margin-bottom: 8px;
`;

export const PlanDescription = styled.div`
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${(p) => p.theme.colors.textMuted};
  line-height: 1.5;
  margin-bottom: 0;
  min-height: 42px;
`;

export const PlanPriceWrapper = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 6px;
  margin-top: 16px;
  margin-bottom: 8px;
`;

export const PlanTrialBadge = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: -0.2px;
  color: ${(p) => p.theme.colors.primary};
  background: ${(p) => p.theme.colors.primarySurface};
  border: 1px solid ${(p) => p.theme.colors.border};
  margin-top: 4px;
`;

export const PlanOriginalPrice = styled.div`
  font-size: 15px;
  text-decoration: line-through;
  color: ${(p) => p.theme.colors.textMuted};
`;

export const PlanPrice = styled.div`
  font-size: 40px;
  font-weight: 800;
  color: ${(p) => p.theme.colors.text};
  letter-spacing: -1px;
  display: flex;
  align-items: baseline;
  gap: 4px;
  span {
    font-size: 16px;
    font-weight: 500;
    color: ${(p) => p.theme.colors.textMuted};
    letter-spacing: normal;
  }
`;

export const PlanButton = styled.div`
  width: 100%;
  height: 48px;
  border-radius: 12px;
  background: #ffffff;
  border: 1px solid ${(p) => p.theme.colors.border};
  color: ${(p) => p.theme.colors.text};
  font-size: 15px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
  transition: all 0.2s ease;
  
  ${PlanCard}:hover & {
    border-color: ${(p) => p.theme.colors.primary};
    color: ${(p) => p.theme.colors.primary};
  }

  ${PlanCard}[data-active="true"] & {
    background: ${(p) => p.theme.colors.primary};
    color: ${(p) => p.theme.colors.textInverted};
    border-color: ${(p) => p.theme.colors.primary};
    box-shadow: ${(p) => p.theme.shadow.medium};
  }
  
  ${PlanCard}[data-active="true"]:hover & {
    background: ${(p) => p.theme.colors.primaryHover};
  }
`;

export const PlanDivider = styled.hr`
  display: none;
`;

export const PlanFeatures = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: 8px;
`;

export const PlanFeatureItem = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  &[data-unavailable="true"] {
    opacity: 0.9;
  }
`;

export const PlanFeatureIcon = styled.div`
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  color: ${(p) => p.theme.colors.primary};
  svg {
    width: 100%;
    height: 100%;
  }
  ${PlanFeatureItem}[data-unavailable="true"] & {
    color: ${(p) => p.theme.colors.danger};
  }
`;

export const PlanFeatureText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: ${(p) => p.theme.font.size.sm};
  line-height: 1.5;
  color: ${(p) => p.theme.colors.textMuted};
  text-align: left;
  b {
    font-weight: 600;
    color: ${(p) => p.theme.colors.text};
  }
  span {
    font-size: ${(p) => p.theme.font.size.xs};
    color: ${(p) => p.theme.colors.textMuted};
  }
  ${PlanFeatureItem}[data-unavailable="true"] & {
    color: ${(p) => p.theme.colors.textMuted};
    b {
      color: ${(p) => p.theme.colors.textMuted};
      text-decoration: line-through;
    }
  }
`;

export const PlanFeatureSectionTitle = styled.div`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${(p) => p.theme.colors.textMuted};
  margin-bottom: 4px;
  &[data-variant="negative"] {
    color: ${(p) => p.theme.colors.danger};
  }
`;

export const PlanLabel = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: ${(p) => p.theme.colors.text};
  text-align: center;
  width: 100%;
  margin-bottom: 20px;
  span {
    color: ${(p) => p.theme.colors.danger};
    margin-left: 2px;
  }
`;

export const PolicyBox = styled.div`
  border: none;
  border-radius: 16px;
  background: ${(p) => p.theme.colors.surfaceMuted};
  padding: 14px 16px;
`;

export const PolicyTitle = styled.div`
  font-weight: 700;
  color: ${(p) => p.theme.colors.text};
  margin-bottom: 8px;
`;
