import styled from "styled-components";

export const ModalForm = styled.form`
  display: grid;
  gap: 14px;
  min-width: 280px;
`;

export const ModalLabel = styled.label`
  font-size: 13px;
  color: #475569;
`;

export const ModalInput = styled.input`
  height: 46px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 0 14px;
  font-size: 14px;
  background: #f8fafc;
  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.18);
    background: #ffffff;
  }
  &[aria-invalid="true"] {
    border-color: #ef4444;
    background: #fef2f2;
  }
`;

export const ModalHint = styled.p`
  margin: -6px 0 0;
  font-size: 12px;
  color: #94a3b8;
`;

export const ModalError = styled.p`
  margin: 0;
  font-size: 12px;
  color: #dc2626;
`;

export const ModalMessage = styled.span`
  font-size: 12px;
  color: #4f46e5;
`;

export const ModalActions = styled.div`
  margin-top: 8px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

export const ModalGhostButton = styled.button`
  border: 1px solid #cbd5f5;
  background: #ffffff;
  color: #4f46e5;
  font-size: 13px;
  border-radius: 999px;
  padding: 8px 16px;
  cursor: pointer;
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const ModalPrimaryButton = styled.button`
  border: none;
  background: #4f46e5;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  border-radius: 999px;
  padding: 8px 18px;
  cursor: pointer;
  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

export const SendCodeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
`;

export const CodeStatus = styled.span`
  font-size: 12px;
  color: #4f46e5;
`;
