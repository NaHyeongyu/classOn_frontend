import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styled from 'styled-components';
export default function ConfirmDialog({ open, title, message, confirmLabel = '확인', cancelLabel = '취소', tone = 'default', onConfirm, onCancel, busy = false }) {
    if (!open)
        return null;
    return (_jsx(Backdrop, { onClick: busy ? undefined : onCancel, children: _jsxs(Card, { role: "dialog", "aria-modal": "true", "aria-labelledby": "confirm-title", "aria-describedby": "confirm-desc", onClick: (e) => e.stopPropagation(), children: [_jsxs(Head, { children: [tone === 'danger' ? _jsx(DangerIcon, { "aria-hidden": true }) : _jsx(InfoIcon, { "aria-hidden": true }), _jsx(Title, { id: "confirm-title", children: title })] }), message && _jsx(Msg, { id: "confirm-desc", children: message }), _jsxs(Btns, { children: [_jsx(Btn, { type: "button", onClick: onCancel, disabled: busy, children: cancelLabel }), _jsx(Btn, { type: "button", "data-variant": tone, onClick: onConfirm, disabled: busy, children: busy ? '진행 중…' : confirmLabel })] })] }) }));
}
const Backdrop = styled.div `
  position: fixed; inset: 0; background: rgba(0,0,0,0.35); display:grid; place-items:center; z-index: 1000;
`;
const Card = styled.div `
  width: 520px; max-width: calc(100% - 32px);
  background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.15);
`;
const Head = styled.div `
  display:flex; align-items:center; gap:10px; margin-bottom:8px;
`;
const Title = styled.h3 `
  margin: 0; font-size: 18px; color: #111827;
`;
const Msg = styled.div `
  color:#374151; font-size:14px; line-height: 1.5; white-space: pre-wrap; margin-top: 6px;
`;
const Btns = styled.div `
  display:flex; justify-content:flex-end; gap:8px; margin-top: 14px;
`;
const Btn = styled.button `
  height: 36px; padding: 0 12px; border-radius: 8px; font-weight: 800; font-size: 13px; cursor: pointer;
  background:#fff; color:#111827; border:1px solid #e5e7eb;
  &[disabled]{ opacity: .6; cursor: default; }
  &[data-variant='danger']{
    background:#fee2e2; color:#7f1d1d; border-color:#fecaca;
  }
`;
const DangerIcon = () => (_jsx(IconBox, { "data-variant": "danger", children: _jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("path", { d: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" }), _jsx("line", { x1: "12", y1: "9", x2: "12", y2: "13" }), _jsx("line", { x1: "12", y1: "17", x2: "12.01", y2: "17" })] }) }));
const InfoIcon = () => (_jsx(IconBox, { children: _jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("circle", { cx: "12", cy: "12", r: "10" }), _jsx("line", { x1: "12", y1: "16", x2: "12", y2: "12" }), _jsx("line", { x1: "12", y1: "8", x2: "12.01", y2: "8" })] }) }));
const IconBox = styled.span `
  width: 28px; height: 28px; border-radius: 8px; display: grid; place-items: center; background: #f3f4f6; color:#2563eb;
  &[data-variant='danger']{ background:#fee2e2; color:#b91c1c; }
`;
