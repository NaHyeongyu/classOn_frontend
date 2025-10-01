import styled, { css } from "styled-components";
import { Link } from "react-router-dom";

export const Page = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.lg};
  width: 100%;
  overflow-x: hidden;
`;
export const SectionCard = styled.section`
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.lg};
  padding: ${(p) => p.theme.spacing.xl};
  width: 100%;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
  overflow: hidden; /* prevent child overflow from pushing layout */
`;

export const TitleH3 = styled.h3`
  margin: 0 0 ${(p) => p.theme.spacing.sm};
  font-size: ${(p) => p.theme.font.size.lg};
  color: ${(p) => p.theme.colors.text};
`;

// Page header used across pages (title + description + optional actions)
export const PageHeader = styled.header`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: ${(p) => p.theme.spacing.md};
  align-items: center;
  margin-bottom: ${(p) => p.theme.spacing.sm};
  h2 {
    margin: 0;
    font-size: 22px;
    color: ${(p) => p.theme.colors.text};
    letter-spacing: -0.01em;
  }
  p {
    margin: 0;
    color: ${(p) => p.theme.colors.textMuted};
    font-size: 13px;
  }
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    align-items: flex-start;
    gap: ${(p) => p.theme.spacing.sm};
  }
`;

export const Scroller = styled.div`
  overflow: auto;
`;

export const TableBase = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  thead th {
    text-align: left;
    font-size: 12px;
    color: ${(p) => p.theme.colors.textMuted};
    padding: ${(p) => p.theme.spacing.md} ${(p) => p.theme.spacing.sm};
    border-bottom: 1px solid ${(p) => p.theme.colors.border};
    position: sticky;
    top: 0;
    background: ${(p) => p.theme.colors.surface};
    z-index: 2;
  }
  tbody td {
    padding: ${(p) => p.theme.spacing.md} ${(p) => p.theme.spacing.sm};
    border-bottom: 1px solid ${(p) => p.theme.colors.borderMuted};
    font-size: 14px;
    vertical-align: middle;
    color: ${(p) => p.theme.colors.text};
  }
  tbody tr:hover td {
    background: ${(p) => p.theme.colors.gray50};
  }
  tbody tr:nth-child(even) td {
    background: #fcfcfd;
  }
  thead th.num,
  tbody td.num {
    text-align: right;
  }
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
  background: ${(p) => p.theme.colors.primary};
  border-color: ${(p) => p.theme.colors.primaryHover};
  color: #fff;
  box-shadow: 0 4px 14px rgba(79, 70, 229, 0.18);
  &:hover:not(:disabled) {
    background: ${(p) => p.theme.colors.primaryHover};
  }
  &:active:not(:disabled) {
    background: ${(p) => p.theme.colors.primaryActive};
    transform: translateY(1px);
    box-shadow: 0 3px 10px rgba(79, 70, 229, 0.22);
  }
`;

const buttonOutline = css`
  ${buttonBase};
  background: ${(p) => p.theme.colors.bg};
  border-color: ${(p) => p.theme.colors.border};
  color: ${(p) => p.theme.colors.text};
  box-shadow: none;
  &:hover:not(:disabled) {
    background: ${(p) => p.theme.colors.gray50};
    border-color: ${(p) => p.theme.colors.border};
  }
  &:active:not(:disabled) {
    background: ${(p) => p.theme.colors.gray100};
    transform: translateY(1px);
  }
`;

const buttonSubtle = css`
  ${buttonBase};
  background: ${(p) => p.theme.colors.primarySurface};
  border-color: transparent;
  color: ${(p) => p.theme.colors.primary};
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

export const PrimaryButton = styled.button`
  ${buttonPrimary};
`;

export const PrimaryButtonLg = styled(PrimaryButton)`
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
`;

export const GhostButton = styled.button`
  ${buttonOutline};
`;

export const GhostButtonSmall = styled(GhostButton)`
  height: 40px;
`;

export const SmallBtn = styled.button`
  ${buttonOutline};
  height: 40px;
`;

// Empty state pattern
export const EmptyState = styled.div`
  display: grid;
  place-items: center;
  gap: ${(p) => p.theme.spacing.sm};
  padding: ${(p) => p.theme.spacing.xl} ${(p) => p.theme.spacing.md};
  color: ${(p) => p.theme.colors.textMuted};
  svg {
    width: 28px;
    height: 28px;
    opacity: 0.6;
  }
`;

// Lightweight skeleton block
export const Skeleton = styled.div<{ w?: number|string; h?: number; mt?: number }>`
  --w: ${({w}) => (typeof w === 'number' ? `${w}px` : (w || '100%'))};
  --h: ${({h}) => (h ? `${h}px` : '14px')};
  width: var(--w); height: var(--h);
  border-radius: 8px;
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 37%, #f3f4f6 63%);
  background-size: 400% 100%;
  animation: shimmer 1.2s ease-in-out infinite;
  margin-top: ${({mt}) => (mt ? `${mt}px` : 0)};
  @keyframes shimmer { 0% { background-position: 100% 0; } 100% { background-position: 0 0; } }
`;
