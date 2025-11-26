import styled from "styled-components";
import { buttonVariants } from "@/components/common/UI";

export const Sub = styled.p`
  margin: 0 0 20px;
  color: #6b7280;
  font-size: 15px;
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
  font-size: 14px;
  color: #374151;
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 6px 0 2px;
`;

export const Rules = styled.div`
  display: flex;
  gap: 8px;
  font-size: 12px;
  color: #6b7280;
`;

export const Rule = styled.span<{ ok: boolean }>`
  color: ${({ ok }) => (ok ? "#065f46" : "#6b7280")};
`;

export const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #202124;
  margin-bottom: -16px; /* Pull closer to input */
  z-index: 1;
  span {
    color: #d93025;
    margin-left: 2px;
  }
`;

export const Input = styled.input`
  height: 56px;
  border: 1px solid #dadce0;
  border-radius: 4px;
  padding: 0 16px;
  font-size: 16px;
  background: #ffffff;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  color: #202124;

  &::placeholder {
    color: #9aa0a6;
  }
  &:focus {
    border-color: #1967d2;
    border-width: 2px;
    padding: 0 15px; /* Compensate for border width */
  }
  &[aria-invalid="true"] {
    border-color: #d93025;
    background: #fce8e6;
  }
`;

export const Pills = styled.div`
  display: flex;
  gap: 8px;
`;

export const PillButton = styled.button`
  height: 40px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  color: #374151;
  font-weight: 600;
  &:hover {
    background: #eef2ff;
  }
  &[data-active="true"] {
    background: #4f46e5;
    color: #ffffff;
    border-color: transparent;
  }
`;

export const PillInputWrap = styled.div`
  display: inline-flex;
  align-items: center;
  min-height: 40px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  color: #374151;
  &:focus-within {
    background: #eef2ff;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.18);
  }
`;

export const PillTextInput = styled.input`
  border: none;
  background: transparent;
  outline: none;
  font-size: 15px;
  width: 100%;
  &::placeholder {
    color: #9ca3af;
  }
`;

export const Row = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

export const SmallButton = styled.button`
  ${buttonVariants.subtle};
  height: 54px;
  border-radius: 14px;
  font-weight: 700;
  padding: 0 20px;
  &:disabled {
    opacity: 0.6;
  }
`;

export const ErrorText = styled.div`
  color: #b91c1c;
  background: #fee2e2;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 14px;
`;

export const Hint = styled.div<{ success?: boolean; danger?: boolean }>`
  color: ${({ danger, success }) => (danger ? "#b91c1c" : success ? "#065f46" : "#6b7280")};
  background: ${({ danger, success }) => (danger ? "#fee2e2" : success ? "#d1fae5" : "#f3f4f6")};
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 12px;
`;

export const AgreeRow = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
  align-items: start;
  color: #6b7280;
  font-size: 13px;
  padding: 12px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: #f9fafb;
  input {
    width: 18px;
    height: 18px;
    margin-top: 2px;
  }
  label {
    user-select: none;
    line-height: 1.6;
  }
  a {
    color: #4f46e5;
    font-weight: 700;
    text-decoration: underline;
  }
`;

export const ScrollArea = styled.div`
  max-height: 70vh;
  overflow: auto;
  padding-right: 4px;
`;

export const TermsBody = styled.div`
  white-space: pre-line;
  overflow-wrap: anywhere;
  word-break: keep-all;
  color: #374151;
  font-size: 13px;
  line-height: 1.6;
`;

export const ChoiceGrid = styled.div`
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
`;

export const ChoiceCard = styled.button`
  border: 1.5px solid #e5e7eb;
  border-radius: 14px;
  background: #f9fafb;
  padding: 14px 16px;
  text-align: left;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease;
  &:hover {
    background: #f1f5f9;
  }
  &[data-active="true"] {
    border-color: #4f46e5;
    background: #eef2ff;
    box-shadow: 0 10px 20px rgba(79, 70, 229, 0.14);
    transform: translateY(-1px);
  }
  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.18);
  }
`;

export const ChoiceTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 4px;
  font-size: 16px;
`;

export const ChoiceBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  background: #eef2ff;
  color: #4f46e5;
  border: 1px solid transparent;
  &[data-variant="warning"] {
    background: #fff7ed;
    color: #c2410c;
    border-color: #fed7aa;
  }
  &[data-variant="muted"] {
    background: #f3f4f6;
    color: #4b5563;
    border-color: #e5e7eb;
  }
`;

export const ChoicePrice = styled.div`
  margin: 0 0 4px;
  font-weight: 700;
  color: #111827;
  font-size: 16px;
`;

export const ChoiceMeta = styled.div`
  color: #5f6368;
  font-size: 13px;
  margin-bottom: 0;
`;

export const ChoiceNote = styled.div`
  color: #4b5563;
  font-size: 12px;
  line-height: 1.5;
`;

export const ChoiceList = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 32px;
`;

export const ScaleCard = styled.button`
  padding: 10px 20px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #4b5563;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background: #f9fafb;
    border-color: #d1d5db;
  }

  &[data-active="true"] {
    background: #111827;
    color: #ffffff;
    border-color: #111827;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

export const ActionRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
  align-items: center;
  margin-top: 32px;
`;

export const BackButton = styled.button`
  ${buttonVariants.outline};
  height: 48px;
  border-radius: 14px;
  font-weight: 700;
  padding: 0 20px;
  width: 100%;
`;

export const PlanGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 24px;
  align-items: stretch;
`;

export const PlanCard = styled.button`
  flex: 1;
  min-width: 300px;
  max-width: 380px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
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
    box-shadow: 0 12px 24px -10px rgba(0, 0, 0, 0.1);
  }

  &[data-active="true"] {
    border-color: #4f46e5;
    box-shadow: 0 0 0 1px #4f46e5, 0 20px 40px -12px rgba(79, 70, 229, 0.15);
    background: #ffffff;
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
  color: #111827;
  margin-top: 12px;
  margin-bottom: 8px;
`;

export const PlanDescription = styled.div`
  font-size: 14px;
  color: #6b7280;
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

export const PlanOriginalPrice = styled.div`
  font-size: 15px;
  text-decoration: line-through;
  color: #9ca3af;
`;

export const PlanPrice = styled.div`
  font-size: 40px;
  font-weight: 800;
  color: #111827;
  letter-spacing: -1px;
  display: flex;
  align-items: baseline;
  gap: 4px;
  span {
    font-size: 16px;
    font-weight: 500;
    color: #6b7280;
    letter-spacing: normal;
  }
`;

export const PlanButton = styled.div`
  width: 100%;
  height: 48px;
  border-radius: 12px;
  background: #f3f4f6;
  color: #111827;
  font-size: 15px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
  transition: all 0.2s ease;
  
  ${PlanCard}:hover & {
    background: #e5e7eb;
  }

  ${PlanCard}[data-active="true"] & {
    background: #4f46e5;
    color: #ffffff;
  }
  
  ${PlanCard}[data-active="true"]:hover & {
    background: #4338ca;
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
`;

export const PlanFeatureIcon = styled.div`
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  color: #4f46e5;
  svg {
    width: 100%;
    height: 100%;
  }
`;

export const PlanFeatureText = styled.div`
  font-size: 14px;
  line-height: 1.5;
  color: #4b5563;
  text-align: left;
  b {
    font-weight: 600;
    color: #111827;
  }
`;

export const PlanLabel = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  text-align: center;
  width: 100%;
  margin-bottom: 16px;
  span {
    color: #ef4444;
    margin-left: 2px;
  }
`;

export const PolicyBox = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: #f9fafb;
  padding: 14px 16px;
`;

export const PolicyTitle = styled.div`
  font-weight: 700;
  color: #111827;
  margin-bottom: 8px;
`;
