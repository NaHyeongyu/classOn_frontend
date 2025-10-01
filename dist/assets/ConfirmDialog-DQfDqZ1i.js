import{j as i,d as o,c as t}from"./index-BB2Wjh9A.js";function y({open:a,title:c,message:e,confirmLabel:l="확인",cancelLabel:s="취소",tone:p="default",onConfirm:x,onCancel:n,busy:d=!1,hideCancel:f=!1}){return a?i.jsx(b,{onClick:d?void 0:n,children:i.jsxs(u,{role:"dialog","aria-modal":"true","aria-labelledby":"confirm-title","aria-describedby":"confirm-desc",onClick:g=>g.stopPropagation(),children:[i.jsxs(h,{children:[i.jsx(m,{id:"confirm-title",children:c}),e?i.jsx(j,{id:"confirm-desc",children:e}):null]}),i.jsxs(k,{children:[!f&&i.jsx(r,{type:"button","data-role":"cancel",onClick:n,disabled:d,children:s}),i.jsx(r,{type:"button","data-role":"confirm","data-tone":p,onClick:x,disabled:d,children:d?"진행 중…":l})]})]})}):null}const b=o.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.28);
  display: grid;
  place-items: center;
  z-index: 1200;
`,u=o.div`
  width: min(480px, calc(100% - 32px));
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 8px 28px rgba(2, 6, 23, 0.08);
  padding: 18px 20px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
`,h=o.div`
  display: grid;
  gap: 8px;
`,m=o.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #111827;
`,j=o.div`
  color: #475569;
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
`,k=o.div`
  grid-column: 1 / -1;
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`,r=o.button`
  ${t.outline};
  height: 40px;
  padding: 0 18px;
  font-size: 14px;
  font-weight: 600;
  &[disabled] {
    opacity: 0.65;
    cursor: default;
  }
  &[data-role='confirm'] {
    ${t.primary};
  }
  &[data-role='confirm'][data-tone='danger'] {
    background: #ef4444;
    border-color: #dc2626;
    &:hover:not(:disabled) {
      background: #dc2626;
    }
    &:active:not(:disabled) {
      background: #b91c1c;
    }
  }
`;export{y as C};
