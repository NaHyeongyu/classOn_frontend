import styled from "styled-components";

export const ModalForm = styled.form`
  display: grid;
  gap: 18px;
  width: 100%;
  min-width: 360px;
  max-width: 520px;
`;

export const ModalLabel = styled.label`
  font-size: 13px;
  color: #475569;
  display: block;
  margin-bottom: 8px;
`;

export const ModalInput = styled.input`
  width: 100%;
  height: 44px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 0 12px;
  font-size: 14px;
  box-sizing: border-box;
  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.18);
  }
`;

export const ModalTextarea = styled.textarea`
  min-height: 96px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 12px;
  font-size: 14px;
  resize: vertical;
  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.18);
  }
`;

export const ModalSelect = styled.select`
  width: 100%;
  height: 44px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 0 12px;
  font-size: 14px;
  background: #fff;
  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.18);
  }
`;

export const ModalHint = styled.p<{ danger?: boolean }>`
  margin: 4px 0 0;
  font-size: 12px;
  color: ${({ danger }) => (danger ? "#b91c1c" : "#64748b")};
`;

export const ModalError = styled.p`
  margin: 4px 0 0;
  font-size: 12px;
  color: #dc2626;
`;

export const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  width: 100%;
  margin-top: 4px;
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
  color: #ffffff;
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

export const ModalSendRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const ModalMessage = styled.span`
  font-size: 12px;
  color: #4f46e5;
`;

export const ModalCheckboxGroup = styled.div`
  display: grid;
  gap: 10px;
`;

export const ModalCheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: #475569;
  input {
    width: 16px;
    height: 16px;
    accent-color: #4f46e5;
  }
  span {
    flex: 1;
  }
`;
