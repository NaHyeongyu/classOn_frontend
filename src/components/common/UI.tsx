/* eslint-disable react-refresh/only-export-components */
import styled, { css, keyframes } from "styled-components";
import { Link } from "react-router-dom";

export const Page = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.pageGap};
  width: 100%;
  /* Avoid interfering with sticky children; allow overflow to the viewport */
  overflow: visible;
`;
const cardEnter = keyframes`
  0% { opacity: 0; transform: translateY(6px) scale(0.995); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
`;

export const SectionCard = styled.section`
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.md};
  padding: ${(p) => p.theme.spacing.lg} ${(p) => p.theme.spacing.xl};
  width: 100%;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
  overflow: hidden; /* prevent child overflow from pushing layout */
  box-shadow: ${(p) => p.theme.shadow.low};
  /* Keep animations subtle and opt-in for compact sections only */
  &[data-animated='true'] {
    transition: transform ${(p) => p.theme.motion.duration.base} ${(p) => p.theme.motion.easing.standard},
      box-shadow ${(p) => p.theme.motion.duration.base} ${(p) => p.theme.motion.easing.standard},
      border-color ${(p) => p.theme.motion.duration.base} ${(p) => p.theme.motion.easing.standard},
      background ${(p) => p.theme.motion.duration.base} ${(p) => p.theme.motion.easing.standard};
    animation: ${cardEnter} 220ms ease-out;
  }
  &[data-animated='true']:hover {
    transform: translateY(-2px);
    box-shadow: ${(p) => p.theme.shadow.high};
    border-color: ${(p) => p.theme.colors.borderStrong};
  }
  &[data-animated='true']:active {
    transform: translateY(0);
    box-shadow: ${(p) => p.theme.shadow.medium};
  }
`;

export const TitleH3 = styled.h3`
  margin: 0 0 ${(p) => p.theme.spacing.sm};
  font-size: ${(p) => p.theme.font.size.lg};
  font-weight: ${(p) => p.theme.font.weight.semiBold};
  line-height: ${(p) => p.theme.font.lineHeight.tight};
  color: ${(p) => p.theme.colors.text};
`;

// Page header used across pages (title + description + optional actions)
export const PageHeader = styled.header`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: ${(p) => p.theme.spacing.md};
  align-items: center;
  padding-bottom: 0;
  margin-bottom: 0;
  h2 {
    margin: 0 0 4px;
    font-size: ${(p) => p.theme.font.size.display};
    font-weight: ${(p) => p.theme.font.weight.bold};
    line-height: ${(p) => p.theme.font.lineHeight.tight};
    color: ${(p) => p.theme.colors.text};
    letter-spacing: -0.01em;
  }
  p {
    margin: 0;
    color: ${(p) => p.theme.colors.textMuted};
    font-size: ${(p) => p.theme.font.size.sm};
    line-height: ${(p) => p.theme.font.lineHeight.relaxed};
  }
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    align-items: flex-start;
    gap: ${(p) => p.theme.spacing.sm};
  }
`;

// Simple page title (fallback when PageHeader is overkill)
export const PageTitle = styled.h1`
  margin: 0;
  font-size: ${(p) => p.theme.font.size.display};
  font-weight: ${(p) => p.theme.font.weight.bold};
  line-height: ${(p) => p.theme.font.lineHeight.tight};
  color: ${(p) => p.theme.colors.text};
  letter-spacing: -0.01em;
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
    font-size: ${(p) => p.theme.font.size.sm};
    font-weight: ${(p) => p.theme.font.weight.semiBold};
    color: ${(p) => p.theme.colors.text};
    padding: ${(p) => p.theme.spacing.md} ${(p) => p.theme.spacing.sm};
    border-bottom: 1px solid ${(p) => p.theme.colors.border};
    position: sticky;
    top: 0;
    background: ${(p) => p.theme.colors.surfaceAlt};
    z-index: 2;
  }
  tbody td {
    padding: ${(p) => p.theme.spacing.md} ${(p) => p.theme.spacing.sm};
    border-bottom: 1px solid ${(p) => p.theme.colors.borderMuted};
    font-size: ${(p) => p.theme.font.size.md};
    vertical-align: middle;
    color: ${(p) => p.theme.colors.text};
    height: 48px;
  }
  tbody tr:nth-child(even) td {
    background: ${(p) => p.theme.colors.tableStripe};
  }
  /* Place hover rule after stripe so hover always wins */
  tbody tr:hover td {
    background: ${(p) => p.theme.colors.surfaceMuted};
  }
  thead th.num,
  tbody td.num {
    text-align: right;
  }
  tbody tr[data-selected='true'] td {
    background: ${(p) => p.theme.colors.primarySurface};
  }
  tbody tr[data-selected='true'] td:first-child {
    position: relative;
  }
  tbody tr[data-selected='true'] td:first-child::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: ${(p) => p.theme.colors.primary};
  }
`;

const buttonBase = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 40px;
  padding: 0 16px;
  border-radius: 8px;
  font-weight: ${(p) => p.theme.font.weight.semiBold};
  font-size: ${(p) => p.theme.font.size.md};
  line-height: 1;
  border: 1px solid transparent;
  text-decoration: none;
  cursor: pointer;
  transition: background ${(p) => p.theme.motion.duration.base} ${(p) => p.theme.motion.easing.standard},
    color ${(p) => p.theme.motion.duration.base} ${(p) => p.theme.motion.easing.standard},
    border-color ${(p) => p.theme.motion.duration.base} ${(p) => p.theme.motion.easing.standard},
    box-shadow ${(p) => p.theme.motion.duration.base} ${(p) => p.theme.motion.easing.standard},
    transform ${(p) => p.theme.motion.duration.short} ${(p) => p.theme.motion.easing.standard};
  text-align: center;
  &:focus-visible {
    outline: none;
    box-shadow: ${(p) => p.theme.shadow.focusPrimary};
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
  color: ${(p) => p.theme.colors.textInverted};
  box-shadow: ${(p) => p.theme.shadow.medium};
  &:hover:not(:disabled) {
    background: ${(p) => p.theme.colors.primaryHover};
    transform: translateY(-1px);
    box-shadow: ${(p) => p.theme.shadow.high};
  }
  &:active:not(:disabled) {
    background: ${(p) => p.theme.colors.primaryActive};
    transform: translateY(1px);
    box-shadow: ${(p) => p.theme.shadow.low};
  }
`;

const buttonOutline = css`
  ${buttonBase};
  background: ${(p) => p.theme.colors.surface};
  border-color: ${(p) => p.theme.colors.border};
  color: ${(p) => p.theme.colors.navy};
  box-shadow: none;
  &:hover:not(:disabled) {
    background: ${(p) => p.theme.colors.surfaceMuted};
    border-color: ${(p) => p.theme.colors.borderStrong};
    transform: translateY(-1px);
  }
  &:active:not(:disabled) {
    background: ${(p) => p.theme.colors.surfaceAlt};
    transform: translateY(1px);
  }
  /* Edit outline variant (black border/text) */
  &[data-variant='edit'] {
    background: ${(p) => p.theme.colors.surface};
    border-color: ${(p) => p.theme.colors.border};
    color: ${(p) => p.theme.colors.text};
  }
  &[data-variant='edit']:hover:not(:disabled) {
    background: ${(p) => p.theme.colors.surfaceMuted};
    border-color: ${(p) => p.theme.colors.borderStrong};
  }
  &[data-variant='edit']:active:not(:disabled) {
    background: ${(p) => p.theme.colors.gray150};
    border-color: ${(p) => p.theme.colors.borderStrong};
    color: ${(p) => p.theme.colors.text};
    transform: translateY(1px);
  }
  /* Danger outline variant (opt-in via data-variant="danger") */
  &[data-variant='danger'] {
    background: ${(p) => p.theme.colors.dangerSurface};
    border-color: transparent;
    color: ${(p) => p.theme.colors.danger};
  }
  &[data-variant='danger']:hover:not(:disabled) {
    background: rgba(194, 65, 65, 0.14);
    color: ${(p) => p.theme.colors.dangerHover};
  }
  &[data-variant='danger']:active:not(:disabled) {
    background: rgba(170, 47, 47, 0.18);
    color: ${(p) => p.theme.colors.dangerActive};
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
    background: rgba(108, 92, 231, 0.18);
  }
  &:active:not(:disabled) {
    background: rgba(73, 59, 192, 0.25);
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
  border-radius: 8px;
  font-size: ${(p) => p.theme.font.size.lg};
`;

export const PrimaryButton = styled.button`
  ${buttonPrimary};
`;

export const PrimaryButtonLg = styled(PrimaryButton)`
  height: 56px;
  padding: 0 32px;
  border-radius: ${(p) => p.theme.radii.lg};
  font-size: 18px;
  font-weight: 700;
  /* Inherit styles from PrimaryButton (which uses theme) */
  box-shadow: ${(p) => p.theme.shadow.medium};
  
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: ${(p) => p.theme.shadow.high};
  }
  &:active:not(:disabled) {
    transform: translateY(1px);
    box-shadow: ${(p) => p.theme.shadow.low};
  }
`;

export const PrimaryButtonSm = styled(PrimaryButton)`
  height: 36px;
  padding: 0 14px;
  font-size: ${(p) => p.theme.font.size.sm};
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
  padding: 0 16px;
  font-size: ${(p) => p.theme.font.size.md};
`;

export const PrimaryBtnSm = styled(PrimaryBtn)`
  height: 36px;
  padding: 0 14px;
  font-size: ${(p) => p.theme.font.size.sm};
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

export const SmallBtn = styled.button`
  ${buttonOutline};
  height: 40px;
  padding: 0 16px;
  font-size: ${(p) => p.theme.font.size.md};
`;

export const ToggleSwitch = styled.label`
  display: inline-flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing.sm};
  cursor: pointer;
  position: relative;
  input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }
  .switch {
    width: 44px;
    height: 24px;
    border-radius: 999px;
    background: ${(p) => p.theme.colors.border};
    position: relative;
    transition: background 0.2s ease;
  }
  .switch::after {
    content: "";
    position: absolute;
    top: 2px;
    left: 2px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${(p) => p.theme.colors.surface};
    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.2);
    transition: transform 0.2s ease;
  }
  input:checked + .switch {
    background: ${(p) => p.theme.colors.primary};
  }
  input:checked + .switch::after {
    transform: translateX(20px);
  }
  input:focus-visible + .switch {
    box-shadow: ${(p) => p.theme.shadow.focusPrimary};
  }
  input:disabled + .switch {
    opacity: 0.5;
  }
  .text {
    font-size: ${(p) => p.theme.font.size.sm};
    font-weight: ${(p) => p.theme.font.weight.medium};
    color: ${(p) => p.theme.colors.text};
  }
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
  border-radius: ${(p) => p.theme.radii.sm};
  background: linear-gradient(90deg, ${(p) => p.theme.colors.gray100} 25%, ${(p) => p.theme.colors.gray200} 37%, ${(p) => p.theme.colors.gray100} 63%);
  background-size: 400% 100%;
  animation: shimmer 1.2s ease-in-out infinite;
  margin-top: ${({mt}) => (mt ? `${mt}px` : 0)};
  @keyframes shimmer { 0% { background-position: 100% 0; } 100% { background-position: 0 0; } }
`;
