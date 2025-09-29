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
        <IconWrap data-tone={tone} aria-hidden>
          {tone === 'danger' ? DangerGlyph : InfoGlyph}
        </IconWrap>
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
  backdrop-filter: blur(3px);
  display: grid;
  place-items: center;
  z-index: 1200;
`;

const Card = styled.div`
  width: min(480px, calc(100% - 32px));
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  box-shadow: 0 28px 60px rgba(15, 23, 42, 0.22);
  padding: 24px 26px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 16px;
`;

const IconWrap = styled.span<{ 'data-tone': Props['tone'] }>`
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: ${({ 'data-tone': tone }) =>
    tone === 'danger' ? '#fee2e2' : '#e0f2fe'};
  color: ${({ 'data-tone': tone }) =>
    tone === 'danger' ? '#b91c1c' : '#2563eb'};
  font-size: 20px;
`;

const Content = styled.div`
  display: grid;
  gap: 8px;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  color: #0f172a;
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

const DangerGlyph = '⚠️';
const InfoGlyph = 'ℹ️';
