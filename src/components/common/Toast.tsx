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
            {t.title ? <strong>{t.title}</strong> : null}
            <span>{t.message}</span>
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
  right: 16px; bottom: 16px;
  display: grid; gap: 8px;
  z-index: 1000;
`;

const Item = styled.div`
  min-width: 220px;
  max-width: 360px;
  background: #111827;
  color: #fff;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow: 0 8px 24px rgba(0,0,0,0.18);
  padding: 10px 12px;
  animation: ${enter} 180ms ease-out;
  display: grid; gap: 4px;
  strong { font-size: 13px; }
  span { font-size: 13px; opacity: 0.95; }
  &[data-kind='success'] { background:#065f46; border-color:#064e3b; }
  &[data-kind='error'] { background:#991b1b; border-color:#7f1d1d; }
  &[data-kind='warning'] { background:#92400e; border-color:#78350f; }
`;

