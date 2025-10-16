import{j as r,d as e}from"./index-CyW3XeFu.js";import{c as a}from"./UI-evna17pR.js";function C({open:o,title:l,message:t,confirmLabel:c="확인",cancelLabel:s="취소",tone:p="default",onConfirm:x,onCancel:n,busy:i=!1,hideCancel:f=!1,maxWidth:g=480}){return o?r.jsx(b,{onClick:i?void 0:n,children:r.jsxs(h,{role:"dialog","aria-modal":"true","aria-labelledby":"confirm-title","aria-describedby":"confirm-desc",onClick:m=>m.stopPropagation(),$maxWidth:g,children:[r.jsxs(u,{children:[r.jsx(j,{id:"confirm-title",children:l}),t?r.jsx(k,{id:"confirm-desc",children:t}):null]}),r.jsxs(v,{children:[!f&&r.jsx(d,{type:"button","data-role":"cancel",onClick:n,disabled:i,children:s}),r.jsx(d,{type:"button","data-role":"confirm","data-tone":p,onClick:x,disabled:i,children:i?"진행 중…":c})]})]})}):null}const b=e.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.28);
  display: grid;
  place-items: center;
  z-index: 1200;
`,h=e.div`
  width: ${({$maxWidth:o})=>`min(${o??480}px, calc(100% - 32px))`};
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 8px 28px rgba(2, 6, 23, 0.08);
  padding: 18px 20px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
`,u=e.div`
  display: grid;
  gap: 8px;
`,j=e.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #111827;
`,k=e.div`
  color: #475569;
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
`,v=e.div`
  grid-column: 1 / -1;
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`,d=e.button`
  ${a.outline};
  height: 40px;
  padding: 0 18px;
  font-size: 14px;
  font-weight: 600;
  &[disabled] {
    opacity: 0.65;
    cursor: default;
  }
  &[data-role='confirm'] {
    ${a.primary};
  }
  &[data-role='confirm'][data-tone='danger'] {
    background: ${o=>o.theme.colors.dangerSurface};
    border-color: transparent;
    color: ${o=>o.theme.colors.danger};
    &:hover:not(:disabled) {
      background: rgba(194, 65, 65, 0.14);
      color: ${o=>o.theme.colors.dangerHover};
    }
    &:active:not(:disabled) {
      background: rgba(170, 47, 47, 0.18);
      color: ${o=>o.theme.colors.dangerActive};
    }
  }
`;export{C};
