import React from 'react';
import styled from 'styled-components';
import { buttonVariants } from './UI';

type Props = {
  open: boolean;
  title: string;
  message?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'default' | 'danger';
  onConfirm: () => void;
  onCancel: () => void;
  busy?: boolean;
  hideCancel?: boolean;
};

export default function ConfirmDialog({ open, title, message, confirmLabel = '확인', cancelLabel = '취소', tone = 'default', onConfirm, onCancel, busy = false, hideCancel = false }: Props) {
  if (!open) return null;
  return (
    <Backdrop onClick={busy ? undefined : onCancel}>
      <Card role="dialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-desc" onClick={(e) => e.stopPropagation()}>
        <Content>
          <Title id="confirm-title">{title}</Title>
          {message ? <Msg id="confirm-desc">{message}</Msg> : null}
        </Content>
        <Btns>
          {!hideCancel && (
            <Action type="button" data-role="cancel" onClick={onCancel} disabled={busy}>
              {cancelLabel}
            </Action>
          )}
          <Action
            type="button"
            data-role="confirm"
            data-tone={tone}
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? '진행 중…' : confirmLabel}
          </Action>
        </Btns>
      </Card>
    </Backdrop>
  );
}

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.28);
  display: grid;
  place-items: center;
  z-index: 1200;
`;

const Card = styled.div`
  width: min(480px, calc(100% - 32px));
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 8px 28px rgba(2, 6, 23, 0.08);
  padding: 18px 20px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
`;

// Icon removed for a cleaner, minimal dialog

const Content = styled.div`
  display: grid;
  gap: 8px;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #111827;
`;

const Msg = styled.div`
  color: #475569;
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
`;

const Btns = styled.div`
  grid-column: 1 / -1;
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const Action = styled.button`
  ${buttonVariants.outline};
  height: 40px;
  padding: 0 18px;
  font-size: 14px;
  font-weight: 600;
  &[disabled] {
    opacity: 0.65;
    cursor: default;
  }
  &[data-role='confirm'] {
    ${buttonVariants.primary};
  }
  &[data-role='confirm'][data-tone='danger'] {
    background: #ef4444;
    border-color: #dc2626;
    &:hover:not(:disabled) {
      background: #dc2626;
    }
    &:active:not(:disabled) {
      background: #b91c1c;
    }
  }
`;

// No glyphs
