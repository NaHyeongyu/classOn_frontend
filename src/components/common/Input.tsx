import styled from "styled-components";

export const Label = styled.label`
  display: block;
  font-size: ${(p) => p.theme.font.size.md};
  font-weight: ${(p) => p.theme.font.weight.semiBold};
  color: ${(p) => p.theme.colors.text};
  margin-bottom: 8px;
  span {
    color: ${(p) => p.theme.colors.danger};
    margin-left: 2px;
  }
`;

export const Input = styled.input`
  width: 100%;
  height: 56px;
  padding: 0 ${(p) => p.theme.spacing.md};
  border-radius: 0;
  border: none;
  border-bottom: 2px solid ${(p) => p.theme.colors.borderMuted};
  background: transparent;
  color: ${(p) => p.theme.colors.text};
  font-size: ${(p) => p.theme.font.size.lg};
  outline: none;
  transition: all 0.2s ease;
  box-sizing: border-box;

  &::placeholder {
    color: ${(p) => p.theme.colors.textMuted};
  }

  &:focus {
    border-bottom-color: ${(p) => p.theme.colors.primary};
    background: transparent;
  }

  &:disabled {
    background: transparent;
    color: ${(p) => p.theme.colors.textMuted};
    cursor: not-allowed;
    opacity: 0.6;
  }

  &[aria-invalid="true"] {
    border-bottom-color: ${(p) => p.theme.colors.danger};
    &:focus {
      border-bottom-color: ${(p) => p.theme.colors.danger};
    }
  }
`;

export const HelperText = styled.p<{ error?: boolean }>`
  margin: 4px 0 0;
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${(p) => (p.error ? p.theme.colors.danger : p.theme.colors.textMuted)};
`;
