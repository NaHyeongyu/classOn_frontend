import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import styled, { keyframes } from 'styled-components';

type ToastKind = 'info' | 'success' | 'error' | 'warning';
type Toast = { id: number; kind: ToastKind; title?: string; message: string; ttlMs: number };

type ToastContextValue = {
  show: (message: string, opts?: Partial<Pick<Toast, 'kind' | 'title' | 'ttlMs'>>) => void;
  success: (message: string, ttlMs?: number) => void;
  error: (message: string, ttlMs?: number) => void;
  warning: (message: string, ttlMs?: number) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback<ToastContextValue['show']>((message, opts) => {
    const toast: Toast = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      kind: opts?.kind || 'info',
      title: opts?.title,
      message,
      ttlMs: opts?.ttlMs ?? 2600,
    };
    setToasts((prev) => [...prev, toast]);
    window.setTimeout(() => remove(toast.id), toast.ttlMs);
  }, [remove]);

  const ctx = useMemo<ToastContextValue>(() => ({
    show,
    success: (m, ttl) => show(m, { kind: 'success', ttlMs: ttl }),
    error: (m, ttl) => show(m, { kind: 'error', ttlMs: ttl }),
    warning: (m, ttl) => show(m, { kind: 'warning', ttlMs: ttl }),
  }), [show]);

  return (
    <ToastContext.Provider value={ctx}>
      {children}
      <Container aria-live="polite" aria-atomic="true" role="region" aria-label="알림">
        {toasts.map((t) => (
          <Item key={t.id} data-kind={t.kind}>
            <Accent $kind={t.kind} />
            <Icon aria-hidden>
              {t.kind === 'success' ? '✅' : t.kind === 'error' ? '⚠️' : t.kind === 'warning' ? '⚠️' : 'ℹ️'}
            </Icon>
            <Body>
              {t.title ? <strong>{t.title}</strong> : null}
              <span>{t.message}</span>
            </Body>
            <Dismiss type="button" onClick={() => remove(t.id)} aria-label="닫기">
              ×
            </Dismiss>
          </Item>
        ))}
      </Container>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('ToastProvider가 필요합니다');
  return ctx;
}

const enter = keyframes`
  0% { opacity: 0; transform: translateY(6px) scale(0.98); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
`;

const Container = styled.div`
  position: fixed;
  right: 24px;
  top: 24px;
  display: grid;
  gap: 10px;
  z-index: 1200;
`;

const Item = styled.div`
  min-width: 240px;
  max-width: 360px;
  background: #ffffff;
  color: #0f172a;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.16);
  padding: 12px 14px 12px 18px;
  display: grid;
  grid-template-columns: auto auto 1fr auto;
  align-items: center;
  gap: 12px;
  animation: ${enter} 180ms ease-out;
`;

const Accent = styled.span<{ $kind: ToastKind }>`
  width: 4px;
  height: 100%;
  border-radius: 999px;
  background: ${({ $kind }) =>
    $kind === 'success'
      ? '#16a34a'
      : $kind === 'error'
      ? '#ef4444'
      : $kind === 'warning'
      ? '#f97316'
      : '#3b82f6'};
`;

const Icon = styled.span`
  font-size: 16px;
`;

const Body = styled.div`
  display: grid;
  gap: 2px;
  strong {
    font-size: 13px;
    color: #0f172a;
  }
  span {
    font-size: 13px;
    color: #475569;
  }
`;

const Dismiss = styled.button`
  border: none;
  background: transparent;
  color: #94a3b8;
  font-size: 16px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  &:hover {
    color: #64748b;
  }
`;
