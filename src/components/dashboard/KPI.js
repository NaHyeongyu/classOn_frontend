import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import styled, { keyframes, css } from "styled-components";
export function KPI({ title, icon, iconAccent, value, footerLeft, footerRight, loading, error, onRetry, }) {
    return (_jsxs(KPICard, { "aria-busy": loading, children: [_jsx(KPIHeader, { children: loading ? (_jsxs(_Fragment, { children: [_jsx(SkeletonTitle, {}), _jsx(SkeletonIcon, {})] })) : (_jsxs(_Fragment, { children: [_jsx(KPITitle, { children: title }), _jsx(IconBadge, { "$accent": iconAccent, children: icon })] })) }), loading ? (_jsx(SkeletonValue, {})) : error ? (_jsxs(ErrorRow, { children: [_jsx("span", { children: "\uBD88\uB7EC\uC624\uAE30 \uC2E4\uD328" }), onRetry && (_jsx(RetryButton, { type: "button", onClick: onRetry, children: "\uB2E4\uC2DC \uC2DC\uB3C4" }))] })) : (_jsx(KPIValue, { children: value })), _jsx(KPIFooter, { children: loading ? (_jsxs(_Fragment, { children: [_jsx(SkeletonPill, { style: { width: 90 } }), _jsx(SkeletonPill, { style: { width: 64 } })] })) : (_jsxs(_Fragment, { children: [_jsx("span", { children: footerLeft }), _jsx("span", { children: footerRight })] })) })] }));
}
export function UsersIcon() {
    return (_jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("path", { d: "M20 21v-2a4 4 0 0 0-3-3.87" }), _jsx("path", { d: "M4 21v-2a4 4 0 0 1 3-3.87" }), _jsx("circle", { cx: "7", cy: "7", r: "4" }), _jsx("circle", { cx: "17", cy: "7", r: "4" })] }));
}
export function CreditIcon() {
    return (_jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("rect", { x: "2", y: "5", width: "20", height: "14", rx: "2" }), _jsx("line", { x1: "2", y1: "10", x2: "22", y2: "10" }), _jsx("rect", { x: "6", y: "14", width: "6", height: "2" })] }));
}
export function CheckIcon() {
    return (_jsx("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: _jsx("path", { d: "M20 6L9 17l-5-5" }) }));
}
export function ClassIcon() {
    return (_jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("path", { d: "M22 10L12 4 2 10l10 6 10-6z" }), _jsx("path", { d: "M6 12v5l6 3 6-3v-5" })] }));
}
export const KPICard = styled.article `
  grid-column: span 3;
  /* unified height across pages */
  --kpi-card-height: 150px;
  height: var(--kpi-card-height);
  min-height: var(--kpi-card-height);
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-sizing: border-box;
`;
export const KPIHeader = styled.div `
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
export const KPITitle = styled.h4 `
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #6b7280;
`;
export const KPIValue = styled.div `
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #111827;
`;
export const KPIFooter = styled.div `
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6b7280;
  font-size: 12px;
  margin-top: auto; /* pin footer to bottom for consistent vertical rhythm */
`;
// Shimmer utilities shared by skeletons
const shimmer = keyframes `
  0% { background-position: 100% 0; }
  100% { background-position: 0 0; }
`;
const shimmerCss = css `
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 37%, #f3f4f6 63%);
  background-size: 400% 100%;
  animation: ${shimmer} 1.2s ease-in-out infinite;
`;
export const IconBadge = styled.span `
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  font-size: 0;
  ${(p) => p.$accent === "emerald"
    ? "background:#ecfdf5; color:#059669;"
    : p.$accent === "green"
        ? "background:#dcfce7; color:#16a34a;"
        : p.$accent === "violet"
            ? "background:#f3e8ff; color:#7c3aed;"
            : "background:#eef2ff; color:#4f46e5;"}
`;
export const DeltaPill = styled.span `
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
  ${(p) => p.$tone === "positive"
    ? "background:#dcfce7; color:#16a34a;"
    : p.$tone === "negative"
        ? "background:#fee2e2; color:#b91c1c;"
        : "background:#e5e7eb; color:#6b7280;"}
`;
export const SkeletonLine = styled.div `
  width: ${(p) => (p.$w ? `${p.$w}px` : "100%")};
  height: ${(p) => (p.$h ? `${p.$h}px` : "14px")};
  border-radius: 6px;
  ${shimmerCss}
`;
const ErrorRow = styled.div `
  display: flex;
  align-items: center;
  gap: 8px;
  color: #b91c1c;
  font-weight: 600;
`;
const RetryButton = styled.button `
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid #fecaca;
  background: #fee2e2;
  color: #991b1b;
  cursor: pointer;
`;
const SkeletonIcon = styled.div `
  width: 36px;
  height: 36px;
  border-radius: 10px;
  ${shimmerCss}
`;
const SkeletonTitle = styled.div `
  width: 140px;
  height: 14px;
  border-radius: 6px;
  ${shimmerCss}
`;
const SkeletonValue = styled.div `
  width: 200px;
  height: 28px;
  border-radius: 8px;
  margin-top: 6px;
  ${shimmerCss}
`;
const SkeletonPill = styled.div `
  height: 20px;
  border-radius: 9999px;
  ${shimmerCss}
`;
