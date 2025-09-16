import styled from "styled-components";
import { Link } from "react-router-dom";
// Design tokens (fallbacks if global CSS vars are not defined)
const bd = "#e5e7eb"; // border color
const fg = "#111827"; // text
const fgMuted = "#6b7280"; // muted text
const bg = "#ffffff"; // card bg
const radiusMd = "14px";
export const Page = styled.div ` display:grid; gap:12px; `;
export const SectionCard = styled.section `
  background:${bg};
  border:1px solid ${bd};
  border-radius:${radiusMd};
  padding:14px;
`;
export const TitleH3 = styled.h3 `
  margin:0 0 10px; font-size:15px; color:#0f172a;
`;
export const Scroller = styled.div ` overflow:auto; `;
export const TableBase = styled.table `
  width:100%; border-collapse:collapse;
  thead th { text-align:left; font-size:12px; color:${fgMuted}; padding:10px 8px; border-bottom:1px solid ${bd}; }
  tbody td { padding:10px 8px; border-bottom:1px solid #f1f5f9; font-size:14px; vertical-align:middle; }
`;
export const PrimaryBtn = styled(Link) `
  height:32px; padding:0 10px; border-radius:8px; border:1px solid ${fg}; background:${fg}; color:#fff; font-weight:800; font-size:12px; text-decoration:none;
  display:inline-flex; align-items:center; gap:6px;
`;
// Taller primary button for hero forms (e.g., Login/Register)
export const PrimaryBtnLg = styled(PrimaryBtn) `
  height: 48px;
  padding: 0 16px;
  border-radius: 12px;
  font-size: 14px;
`;
export const GhostBtn = styled(Link) `
  height:32px; padding:0 10px; border-radius:8px; border:1px solid ${bd}; background:${bg}; color:${fg}; font-weight:800; font-size:12px; text-decoration:none;
  display:inline-flex; align-items:center; gap:6px;
`;
export const GhostBtnSmall = styled(Link) `
  height:28px; padding:0 10px; border-radius:8px; border:1px solid ${bd}; background:${bg}; color:${fg}; font-weight:700; font-size:12px; text-decoration:none;
  display:inline-flex; align-items:center; gap:6px;
`;
export const SmallBtn = styled.button `
  height:28px; padding:0 10px; border-radius:8px; border:1px solid ${bd}; background:${bg}; color:${fg}; font-size:12px;
`;
