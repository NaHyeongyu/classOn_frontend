import React, { useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import styled, { keyframes } from "styled-components";
import { buttonVariants } from "./UI";

type ModalProps = {
  open: boolean;
  title?: string;
  description?: string;
  onClose?: () => void;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: number | string;
  blockOutsideClose?: boolean;
  initialFocusRef?: React.RefObject<HTMLElement>;
};

export default function Modal({
  open,
  title,
  description,
  onClose,
  children,
  footer,
  maxWidth = 560,
  blockOutsideClose = false,
  initialFocusRef,
}: ModalProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const latestOnClose = useRef(onClose);
  useEffect(() => {
    latestOnClose.current = onClose;
  }, [onClose]);
  const labelledBy = useMemo(() => (title ? `modal-title-${Math.random().toString(36).slice(2,8)}` : undefined), [title]);
  const describedBy = useMemo(() => (description ? `modal-desc-${Math.random().toString(36).slice(2,8)}` : undefined), [description]);

  useEffect(() => {
    if (!open) return;
    const prevActive = document.activeElement as HTMLElement | null;
    const toFocus = initialFocusRef?.current || cardRef.current?.querySelector<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])') || undefined;
    toFocus?.focus?.();
    const onKey = (e: KeyboardEvent) => {
      // Ignore key handling during IME composition to prevent Korean text issues
      // Some browsers set keyCode 229 during composition
      if (e.isComposing || e.keyCode === 229) return;
      const close = latestOnClose.current;
      if (e.key === 'Escape' && close) {
        e.stopPropagation();
        close();
      } else if (e.key === 'Tab' && cardRef.current) {
        // simple focus trap
        const focusables = Array.from(cardRef.current.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')).filter(el => !el.hasAttribute('disabled'));
        if (focusables.length === 0) return;
        const first = focusables[0], last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (e.shiftKey) {
          if (active === first || !cardRef.current.contains(active)) { e.preventDefault(); last.focus(); }
        } else {
          if (active === last || !cardRef.current.contains(active)) { e.preventDefault(); first.focus(); }
        }
      }
    };
    document.addEventListener('keydown', onKey, true);
    return () => {
      document.removeEventListener('keydown', onKey, true);
      prevActive?.focus?.();
    };
  }, [open, initialFocusRef]);

  if (!open) return null;
  const widthStyle = {
    width: `min(100% - 32px, ${typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth})`,
  } as React.CSSProperties;

  const modalContent = (
    <Backdrop onClick={blockOutsideClose ? undefined : onClose}>
      <Card
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        onClick={(e) => e.stopPropagation()}
        style={widthStyle}
      >
        {(title || onClose) && (
          <Header>
            {title ? <h3 id={labelledBy}>{title}</h3> : <span />}
            {onClose ? (
              <CloseBtn type="button" onClick={onClose} aria-label="닫기">
                ×
              </CloseBtn>
            ) : null}
          </Header>
        )}
        {description ? <Desc id={describedBy}>{description}</Desc> : null}
        <Body>{children}</Body>
        {footer ? <Footer>{footer}</Footer> : null}
      </Card>
    </Backdrop>
  );

  if (typeof document === "undefined") {
    return modalContent;
  }
  return createPortal(modalContent, document.body);
}

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;
const popIn = keyframes`
  0% { opacity: 0; transform: translateY(8px) scale(0.98); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
`;

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.35);
  display: grid;
  place-items: center;
  z-index: 1200;
  animation: ${fadeIn} 140ms ease-out;
`;

const Card = styled.div`
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.lg};
  box-shadow: 0 20px 60px rgba(2, 6, 23, 0.16);
  display: grid;
  grid-template-rows: auto auto 1fr auto;
  gap: 0;
  max-height: calc(100vh - 80px);
  overflow: hidden;
  animation: ${popIn} 160ms ease-out;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid ${(p) => p.theme.colors.borderMuted};
  background: ${(p) => p.theme.colors.surface};
  h3 { margin: 0; font-size: 18px; font-weight: 800; color: ${(p) => p.theme.colors.text}; }
`;

const Desc = styled.div`
  padding: 10px 16px 0 16px;
  color: ${(p) => p.theme.colors.textMuted};
  font-size: 13px;
`;

const Body = styled.div`
  padding: 14px 16px 16px 16px;
  overflow: auto;
`;

const Footer = styled.div`
  padding: 12px 16px;
  border-top: 1px solid ${(p) => p.theme.colors.borderMuted};
  background: ${(p) => p.theme.colors.surface};
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
`;

const CloseBtn = styled.button`
  ${buttonVariants.outline};
  height: 32px; padding: 0 10px; font-size: 14px;
`;
