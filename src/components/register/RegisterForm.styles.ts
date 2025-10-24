import styled from "styled-components";
import { buttonVariants } from "@/components/common/UI";

export const Sub = styled.p`
  margin: 0 0 28px;
  color: #6b7280;
  font-size: 15px;
  text-align: center;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
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
  font-size: 13px;
  color: #6b7280;
  span {
    color: #ef4444;
    margin-left: 4px;
  }
`;

export const Input = styled.input`
  height: 54px;
  border: none;
  border-radius: 14px;
  padding: 0 16px;
  font-size: 15px;
  background: #f3f4f6;
  outline: none;
  transition: box-shadow 0.15s ease, background 0.15s ease;
  &::placeholder {
    color: #9ca3af;
  }
  &:focus {
    background: #eef2ff;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.18);
  }
  &[aria-invalid="true"] {
    background: #fee2e2;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.18);
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
  display: flex;
  gap: 10px;
  align-items: center;
  color: #6b7280;
  font-size: 13px;
  input {
    width: 18px;
    height: 18px;
  }
  label {
    user-select: none;
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
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  word-break: break-word;
  color: #374151;
  font-size: 14px;
  line-height: 1.7;
`;
