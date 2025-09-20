import styled, { css } from "styled-components";
import { Link } from "react-router-dom";

// Design tokens (fallbacks if global CSS vars are not defined)
const bd = "#e5e7eb"; // border color
const fg = "#111827"; // text
const fgMuted = "#6b7280"; // muted text
const bg = "#ffffff"; // card bg
const radiusMd = "14px";

export const Page = styled.div` display:grid; gap:12px; `;
export const SectionCard = styled.section`
  background:${bg};
  border:1px solid ${bd};
  border-radius:${radiusMd};
  padding:14px;
`;

export const TitleH3 = styled.h3`
  margin:0 0 10px; font-size:15px; color:#0f172a;
`;

export const Scroller = styled.div` overflow:auto; `;

export const TableBase = styled.table`
  width:100%; border-collapse:collapse;
  thead th { text-align:left; font-size:12px; color:${fgMuted}; padding:10px 8px; border-bottom:1px solid ${bd}; }
  tbody td { padding:10px 8px; border-bottom:1px solid #f1f5f9; font-size:14px; vertical-align:middle; }
`;

const buttonBase = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 40px;
  padding: 0 16px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  line-height: 1;
  border: 1px solid transparent;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.18s ease, color 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease, transform 0.1s ease;
  text-align: center;
  &:focus-visible {
    outline: 3px solid rgba(79, 70, 229, 0.3);
    outline-offset: 2px;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }
`;

const buttonPrimary = css`
  ${buttonBase};
  background: #4f46e5;
  border-color: #4338ca;
  color: #fff;
  box-shadow: 0 4px 14px rgba(79, 70, 229, 0.18);
  &:hover:not(:disabled) {
    background: #4338ca;
  }
  &:active:not(:disabled) {
    background: #3730a3;
    transform: translateY(1px);
    box-shadow: 0 3px 10px rgba(79, 70, 229, 0.22);
  }
`;

const buttonOutline = css`
  ${buttonBase};
  background: #fff;
  border-color: #d1d5db;
  color: #111827;
  box-shadow: none;
  &:hover:not(:disabled) {
    background: #f9fafb;
    border-color: #cdd5df;
  }
  &:active:not(:disabled) {
    background: #f3f4f6;
    transform: translateY(1px);
  }
`;

const buttonSubtle = css`
  ${buttonBase};
  background: #eef2ff;
  border-color: transparent;
  color: #4f46e5;
  box-shadow: none;
  &:hover:not(:disabled) {
    background: #e0e7ff;
  }
  &:active:not(:disabled) {
    background: #c7d2fe;
    transform: translateY(1px);
  }
`;

export const buttonVariants = {
  base: buttonBase,
  primary: buttonPrimary,
  outline: buttonOutline,
  subtle: buttonSubtle,
};

export const PrimaryBtn = styled(Link)`
  ${buttonPrimary};
`;

// Taller primary button for hero forms (e.g., Login/Register)
export const PrimaryBtnLg = styled(PrimaryBtn)`
  height: 48px;
  padding: 0 20px;
  border-radius: 14px;
  font-size: 15px;
`;

export const GhostBtn = styled(Link)`
  ${buttonOutline};
`;

export const GhostBtnSmall = styled(Link)`
  ${buttonOutline};
  height: 36px;
  padding: 0 14px;
  font-size: 13px;
  border-radius: 10px;
`;

export const SmallBtn = styled.button`
  ${buttonOutline};
  height: 36px;
  padding: 0 12px;
  font-size: 13px;
  border-radius: 10px;
`;
