import styled from "styled-components";
import { SectionCard } from "@/components/common/UI";

export const ReceiptCard = styled(SectionCard)`
  border: 1px solid ${(p) => p.theme.colors.border};
  box-shadow: ${(p) => p.theme.shadow.medium};
  padding: 0;
  overflow: hidden;
  background: #fff;
`;

export const ReceiptHeader = styled.div`
  background: ${(p) => p.theme.colors.surfaceAlt};
  padding: 20px 24px;
  border-bottom: 1px dashed ${(p) => p.theme.colors.border};
  h3 {
    margin: 0 0 4px;
    font-size: 18px;
    font-weight: 700;
  }
  p {
    margin: 0;
    font-size: 13px;
    color: ${(p) => p.theme.colors.textMuted};
  }
`;

export const ReceiptSection = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid ${(p) => p.theme.colors.borderMuted};
`;

export const SectionTitle = styled.h4`
  margin: 0 0 12px;
  font-size: 14px;
  font-weight: 600;
  color: ${(p) => p.theme.colors.text};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Badge = styled.span`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 999px;
  background: ${(p) => p.theme.colors.primarySurface};
  color: ${(p) => p.theme.colors.primary};
  font-size: 11px;
  font-weight: 600;
`;

export const RepresentativeCard = styled.div`
  margin: 20px 24px 0;
  padding: 16px;
  background: ${(p) => p.theme.colors.surfaceAlt};
  border-radius: 8px;
  display: grid;
  gap: 12px;

  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .label {
    font-size: 13px;
    font-weight: 600;
    color: ${(p) => p.theme.colors.textMuted};
    flex-shrink: 0;
  }
  .value {
    font-size: 14px;
    color: ${(p) => p.theme.colors.text};
    text-align: right;
    font-weight: 500;
  }
  .input-wrap {
    width: 160px;
  }
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px 16px;
  margin-bottom: 16px;
  .full-row {
    grid-column: 1 / -1;
  }
  .period-grid {
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 12px 16px;
  }
  label {
    display: grid;
    gap: 6px;
    font-size: 13px;
    color: ${(p) => p.theme.colors.textMuted};
  }
  .period-grid label {
    margin: 0;
  }
`;

export const SelectLike = styled.select`
  width: 100%;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 14px;
  background: #fff;
  appearance: none;
`;

export const EmptyReceipt = styled.div`
  padding: 48px 0;
  text-align: center;
  color: ${(p) => p.theme.colors.textMuted};
  .icon {
    font-size: 36px;
    margin-bottom: 12px;
  }
  p {
    margin: 0;
    line-height: 1.5;
    font-size: 15px;
  }
`;

export const PeriodRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  .arrow {
    color: ${(p) => p.theme.colors.textMuted};
    font-size: 14px;
  }
`;

export const PeriodValue = styled.div`
  flex: 1;
  display: grid;
  gap: 4px;
  text-align: left;
  span {
    font-size: 12px;
    color: ${(p) => p.theme.colors.textMuted};
  }
  strong {
    font-size: 15px;
    color: ${(p) => p.theme.colors.text};
  }
`;

export const AccordionCard = styled.div`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.md};
  margin-bottom: 16px;
  background: ${(p) => p.theme.colors.surfaceAlt ?? "#f9fafb"};
`;

export const AccordionHeader = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: none;
  border: none;
  font-size: 14px;
  font-weight: 600;
  color: ${(p) => p.theme.colors.text};
  cursor: pointer;
`;

export const AccordionBody = styled.div`
  border-top: 1px solid ${(p) => p.theme.colors.border};
  padding: 12px 16px;
`;

export const CaretIcon = styled.span<{ $open: boolean }>`
  border: solid currentColor;
  border-width: 0 2px 2px 0;
  display: inline-block;
  padding: 4px;
  transform: rotate(${(p) => (p.$open ? "45deg" : "-45deg")});
  transition: transform 120ms ease;
`;
