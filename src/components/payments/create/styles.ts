import styled from "styled-components";

export const SmallText = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${(p) => p.theme.colors.textMuted};
`;

export const Input = styled.input`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 10px;
  padding: 8px 12px;
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;
`;

export const Checkbox = styled.input`
  width: 16px;
  height: 16px;
`;

export const BadgeButton = styled.button<{ $active?: boolean }>`
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid ${(p) => (p.$active ? p.theme.colors.primary : p.theme.colors.border)};
  background: ${(p) => (p.$active ? p.theme.colors.primarySurface : "transparent")};
  color: ${(p) => (p.$active ? p.theme.colors.primary : p.theme.colors.textMuted)};
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    border-color: ${(p) => p.theme.colors.primary};
    color: ${(p) => p.theme.colors.primary};
  }
`;

export const HeaderFlex = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 16px;
`;

export const EditButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  font-size: 12px;
  color: ${(p) => p.theme.colors.textMuted};
  text-decoration: underline;
  cursor: pointer;
  &:hover {
    color: ${(p) => p.theme.colors.primary};
  }
`;

export const Textarea = styled.textarea`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 10px;
  padding: 8px 12px;
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;
  min-height: 96px;
`;

export const TotalAmountSection = styled.div`
  padding: 24px;
  background: ${(p) => p.theme.colors.primarySurface};
  text-align: center;
  .label {
    font-size: 13px;
    font-weight: 600;
    color: ${(p) => p.theme.colors.primary};
    margin-bottom: 4px;
  }
  .amount {
    font-size: 32px;
    font-weight: 800;
    color: ${(p) => p.theme.colors.primary};
    letter-spacing: -0.5px;
    margin-bottom: 8px;
  }
  .desc {
    font-size: 12px;
    color: ${(p) => p.theme.colors.textMuted};
    opacity: 0.8;
  }
`;
