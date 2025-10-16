import{d as t,l as r,m,k as n}from"./index-CyW3XeFu.js";const b=t.div`
  display: grid;
  gap: ${e=>e.theme.spacing.pageGap};
  width: 100%;
  /* Avoid interfering with sticky children; allow overflow to the viewport */
  overflow: visible;
`,h=m`
  0% { opacity: 0; transform: translateY(6px) scale(0.995); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
`,p=t.section`
  background: ${e=>e.theme.colors.surface};
  border: 1px solid ${e=>e.theme.colors.border};
  border-radius: ${e=>e.theme.radii.md};
  padding: ${e=>e.theme.spacing.lg} ${e=>e.theme.spacing.xl};
  width: 100%;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
  overflow: hidden; /* prevent child overflow from pushing layout */
  box-shadow: ${e=>e.theme.shadow.low};
  /* Keep animations subtle and opt-in for compact sections only */
  &[data-animated='true'] {
    transition: transform ${e=>e.theme.motion.duration.base} ${e=>e.theme.motion.easing.standard},
      box-shadow ${e=>e.theme.motion.duration.base} ${e=>e.theme.motion.easing.standard},
      border-color ${e=>e.theme.motion.duration.base} ${e=>e.theme.motion.easing.standard},
      background ${e=>e.theme.motion.duration.base} ${e=>e.theme.motion.easing.standard};
    animation: ${h} 220ms ease-out;
  }
  &[data-animated='true']:hover {
    transform: translateY(-2px);
    box-shadow: ${e=>e.theme.shadow.high};
    border-color: ${e=>e.theme.colors.borderStrong};
  }
  &[data-animated='true']:active {
    transform: translateY(0);
    box-shadow: ${e=>e.theme.shadow.medium};
  }
`,$=t.h3`
  margin: 0 0 ${e=>e.theme.spacing.sm};
  font-size: ${e=>e.theme.font.size.lg};
  font-weight: ${e=>e.theme.font.weight.semiBold};
  line-height: ${e=>e.theme.font.lineHeight.tight};
  color: ${e=>e.theme.colors.text};
`,u=t.header`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: ${e=>e.theme.spacing.md};
  align-items: center;
  padding-bottom: 0;
  margin-bottom: 0;
  h2 {
    margin: 0;
    font-size: ${e=>e.theme.font.size.display};
    font-weight: ${e=>e.theme.font.weight.bold};
    line-height: ${e=>e.theme.font.lineHeight.tight};
    color: ${e=>e.theme.colors.text};
    letter-spacing: -0.01em;
  }
  p {
    margin: 0;
    color: ${e=>e.theme.colors.textMuted};
    font-size: ${e=>e.theme.font.size.sm};
    line-height: ${e=>e.theme.font.lineHeight.relaxed};
  }
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    align-items: flex-start;
    gap: ${e=>e.theme.spacing.sm};
  }
`,f=t.div`
  overflow: auto;
`,x=t.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  thead th {
    text-align: left;
    font-size: ${e=>e.theme.font.size.sm};
    font-weight: ${e=>e.theme.font.weight.semiBold};
    color: ${e=>e.theme.colors.text};
    padding: ${e=>e.theme.spacing.md} ${e=>e.theme.spacing.sm};
    border-bottom: 1px solid ${e=>e.theme.colors.border};
    position: sticky;
    top: 0;
    background: ${e=>e.theme.colors.surfaceAlt};
    z-index: 2;
  }
  tbody td {
    padding: ${e=>e.theme.spacing.md} ${e=>e.theme.spacing.sm};
    border-bottom: 1px solid ${e=>e.theme.colors.borderMuted};
    font-size: ${e=>e.theme.font.size.md};
    vertical-align: middle;
    color: ${e=>e.theme.colors.text};
    height: 48px;
  }
  tbody tr:nth-child(even) td {
    background: ${e=>e.theme.colors.tableStripe};
  }
  /* Place hover rule after stripe so hover always wins */
  tbody tr:hover td {
    background: ${e=>e.theme.colors.surfaceMuted};
  }
  thead th.num,
  tbody td.num {
    text-align: right;
  }
  tbody tr[data-selected='true'] td {
    background: ${e=>e.theme.colors.primarySurface};
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
    background: ${e=>e.theme.colors.primary};
  }
`,a=r`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 40px;
  padding: 0 16px;
  border-radius: 12px;
  font-weight: ${e=>e.theme.font.weight.semiBold};
  font-size: ${e=>e.theme.font.size.md};
  line-height: 1;
  border: 1px solid transparent;
  text-decoration: none;
  cursor: pointer;
  transition: background ${e=>e.theme.motion.duration.base} ${e=>e.theme.motion.easing.standard},
    color ${e=>e.theme.motion.duration.base} ${e=>e.theme.motion.easing.standard},
    border-color ${e=>e.theme.motion.duration.base} ${e=>e.theme.motion.easing.standard},
    box-shadow ${e=>e.theme.motion.duration.base} ${e=>e.theme.motion.easing.standard},
    transform ${e=>e.theme.motion.duration.short} ${e=>e.theme.motion.easing.standard};
  text-align: center;
  &:focus-visible {
    outline: none;
    box-shadow: ${e=>e.theme.shadow.focusPrimary};
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }
`,i=r`
  ${a};
  background: ${e=>e.theme.colors.primary};
  border-color: ${e=>e.theme.colors.primaryHover};
  color: ${e=>e.theme.colors.textInverted};
  box-shadow: ${e=>e.theme.shadow.medium};
  &:hover:not(:disabled) {
    background: ${e=>e.theme.colors.primaryHover};
    transform: translateY(-1px);
    box-shadow: ${e=>e.theme.shadow.high};
  }
  &:active:not(:disabled) {
    background: ${e=>e.theme.colors.primaryActive};
    transform: translateY(1px);
    box-shadow: ${e=>e.theme.shadow.low};
  }
`,o=r`
  ${a};
  background: ${e=>e.theme.colors.surface};
  border-color: ${e=>e.theme.colors.border};
  color: ${e=>e.theme.colors.navy};
  box-shadow: none;
  &:hover:not(:disabled) {
    background: ${e=>e.theme.colors.surfaceMuted};
    border-color: ${e=>e.theme.colors.borderStrong};
    transform: translateY(-1px);
  }
  &:active:not(:disabled) {
    background: ${e=>e.theme.colors.surfaceAlt};
    transform: translateY(1px);
  }
  /* Edit outline variant (black border/text) */
  &[data-variant='edit'] {
    background: ${e=>e.theme.colors.surface};
    border-color: ${e=>e.theme.colors.border};
    color: ${e=>e.theme.colors.text};
  }
  &[data-variant='edit']:hover:not(:disabled) {
    background: ${e=>e.theme.colors.surfaceMuted};
    border-color: ${e=>e.theme.colors.borderStrong};
  }
  &[data-variant='edit']:active:not(:disabled) {
    background: ${e=>e.theme.colors.gray150};
    border-color: ${e=>e.theme.colors.borderStrong};
    color: ${e=>e.theme.colors.text};
    transform: translateY(1px);
  }
  /* Danger outline variant (opt-in via data-variant="danger") */
  &[data-variant='danger'] {
    background: ${e=>e.theme.colors.dangerSurface};
    border-color: transparent;
    color: ${e=>e.theme.colors.danger};
  }
  &[data-variant='danger']:hover:not(:disabled) {
    background: rgba(194, 65, 65, 0.14);
    color: ${e=>e.theme.colors.dangerHover};
  }
  &[data-variant='danger']:active:not(:disabled) {
    background: rgba(170, 47, 47, 0.18);
    color: ${e=>e.theme.colors.dangerActive};
    transform: translateY(1px);
  }
`,l=r`
  ${a};
  background: ${e=>e.theme.colors.primarySurface};
  border-color: transparent;
  color: ${e=>e.theme.colors.primary};
  box-shadow: none;
  &:hover:not(:disabled) {
    background: rgba(108, 92, 231, 0.18);
  }
  &:active:not(:disabled) {
    background: rgba(73, 59, 192, 0.25);
    transform: translateY(1px);
  }
`,v={base:a,primary:i,outline:o,subtle:l},s=t(n)`
  ${i};
`,w=t(s)`
  height: 48px;
  padding: 0 20px;
  border-radius: ${e=>e.theme.radii.lg};
  font-size: ${e=>e.theme.font.size.lg};
`,d=t.button`
  ${i};
`;t(d)`
  height: 48px;
  padding: 0 20px;
  border-radius: ${e=>e.theme.radii.lg};
  font-size: ${e=>e.theme.font.size.lg};
`;const y=t(d)`
  height: 36px;
  padding: 0 14px;
  font-size: ${e=>e.theme.font.size.sm};
`,k=t(n)`
  ${o};
`,z=t(n)`
  ${o};
`,c=t.button`
  ${o};
`,S=t(c)`
  height: 40px;
  padding: 0 16px;
  font-size: ${e=>e.theme.font.size.md};
`;t(s)`
  height: 36px;
  padding: 0 14px;
  font-size: ${e=>e.theme.font.size.sm};
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;const B=t.button`
  ${o};
  height: 40px;
  padding: 0 16px;
  font-size: ${e=>e.theme.font.size.md};
`,Y=t.div`
  display: grid;
  place-items: center;
  gap: ${e=>e.theme.spacing.sm};
  padding: ${e=>e.theme.spacing.xl} ${e=>e.theme.spacing.md};
  color: ${e=>e.theme.colors.textMuted};
  svg {
    width: 28px;
    height: 28px;
    opacity: 0.6;
  }
`,P=t.div`
  --w: ${({w:e})=>typeof e=="number"?`${e}px`:e||"100%"};
  --h: ${({h:e})=>e?`${e}px`:"14px"};
  width: var(--w); height: var(--h);
  border-radius: ${e=>e.theme.radii.sm};
  background: linear-gradient(90deg, ${e=>e.theme.colors.gray100} 25%, ${e=>e.theme.colors.gray200} 37%, ${e=>e.theme.colors.gray100} 63%);
  background-size: 400% 100%;
  animation: shimmer 1.2s ease-in-out infinite;
  margin-top: ${({mt:e})=>e?`${e}px`:0};
  @keyframes shimmer { 0% { background-position: 100% 0; } 100% { background-position: 0 0; } }
`;export{Y as E,c as G,b as P,p as S,x as T,s as a,u as b,v as c,y as d,B as e,d as f,f as g,P as h,$ as i,S as j,z as k,k as l,w as m};
