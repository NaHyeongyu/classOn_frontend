import{j as e,d as r,c as a}from"./index-DuqOyKVg.js";function y({open:o,title:l,message:t,confirmLabel:c="확인",cancelLabel:s="취소",tone:p="default",onConfirm:g,onCancel:n,busy:i=!1,hideCancel:x=!1}){return o?e.jsx(b,{onClick:i?void 0:n,children:e.jsxs(h,{role:"dialog","aria-modal":"true","aria-labelledby":"confirm-title","aria-describedby":"confirm-desc",onClick:f=>f.stopPropagation(),children:[e.jsxs(m,{children:[e.jsx(u,{id:"confirm-title",children:l}),t?e.jsx(j,{id:"confirm-desc",children:t}):null]}),e.jsxs(k,{children:[!x&&e.jsx(d,{type:"button","data-role":"cancel",onClick:n,disabled:i,children:s}),e.jsx(d,{type:"button","data-role":"confirm","data-tone":p,onClick:g,disabled:i,children:i?"진행 중…":c})]})]})}):null}const b=r.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.28);
  display: grid;
  place-items: center;
  z-index: 1200;
`,h=r.div`
  width: min(480px, calc(100% - 32px));
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 8px 28px rgba(2, 6, 23, 0.08);
  padding: 18px 20px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
`,m=r.div`
  display: grid;
  gap: 8px;
`,u=r.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #111827;
`,j=r.div`
  color: #475569;
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
`,k=r.div`
  grid-column: 1 / -1;
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`,d=r.button`
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
`;export{y as C};
