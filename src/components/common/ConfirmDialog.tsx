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
};

export default function ConfirmDialog({ open, title, message, confirmLabel = '확인', cancelLabel = '취소', tone = 'default', onConfirm, onCancel, busy = false }: Props) {
  if (!open) return null;
  return (
    <Backdrop onClick={busy ? undefined : onCancel}>
      <Card role="dialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-desc" onClick={(e) => e.stopPropagation()}>
        <Head>
          {tone === 'danger' ? <DangerIcon aria-hidden /> : <InfoIcon aria-hidden />}
          <Title id="confirm-title">{title}</Title>
        </Head>
        {message && <Msg id="confirm-desc">{message}</Msg>}
        <Btns>
          <Btn type="button" onClick={onCancel} disabled={busy}>{cancelLabel}</Btn>
          <Btn
            type="button"
            data-variant={tone}
            onClick={onConfirm}
            disabled={busy}
          >{busy ? '진행 중…' : confirmLabel}</Btn>
        </Btns>
      </Card>
    </Backdrop>
  );
}

const Backdrop = styled.div`
  position: fixed; inset: 0; background: rgba(0,0,0,0.35); display:grid; place-items:center; z-index: 1000;
`;
const Card = styled.div`
  width: 520px; max-width: calc(100% - 32px);
  background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.15);
`;
const Head = styled.div`
  display:flex; align-items:center; gap:10px; margin-bottom:8px;
`;
const Title = styled.h3`
  margin: 0; font-size: 18px; color: #111827;
`;
const Msg = styled.div`
  color:#374151; font-size:14px; line-height: 1.5; white-space: pre-wrap; margin-top: 6px;
`;
const Btns = styled.div`
  display:flex; justify-content:flex-end; gap:8px; margin-top: 14px;
`;
const Btn = styled.button`
  ${buttonVariants.outline};
  height: 40px;
  padding: 0 18px;
  font-size: 14px;
  font-weight: 600;
  &[disabled]{ opacity: .65; cursor: default; }
  &[data-variant='danger']{
    background:#fee2e2;
    color:#7f1d1d;
    border-color:#fecaca;
  }
`;

const DangerIcon = () => (
  <IconBox data-variant="danger">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  </IconBox>
);
const InfoIcon = () => (
  <IconBox>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  </IconBox>
);

const IconBox = styled.span`
  width: 28px; height: 28px; border-radius: 8px; display: grid; place-items: center; background: #f3f4f6; color:#2563eb;
  &[data-variant='danger']{ background:#fee2e2; color:#b91c1c; }
`;
