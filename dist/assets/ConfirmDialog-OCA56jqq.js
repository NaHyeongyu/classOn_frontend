import{j as i,d as e,c as t}from"./index-B7CgKAvQ.js";function z({open:d,title:l,message:n,confirmLabel:s="확인",cancelLabel:p="취소",tone:a="default",onConfirm:f,onCancel:r,busy:o=!1,hideCancel:x=!1}){return d?i.jsx(b,{onClick:o?void 0:r,children:i.jsxs(h,{role:"dialog","aria-modal":"true","aria-labelledby":"confirm-title","aria-describedby":"confirm-desc",onClick:g=>g.stopPropagation(),children:[i.jsx(u,{"data-tone":a,"aria-hidden":!0,children:a==="danger"?v:w}),i.jsxs(m,{children:[i.jsx(j,{id:"confirm-title",children:l}),n?i.jsx(k,{id:"confirm-desc",children:n}):null]}),i.jsxs(y,{children:[!x&&i.jsx(c,{type:"button","data-role":"cancel",onClick:r,disabled:o,children:p}),i.jsx(c,{type:"button","data-role":"confirm","data-tone":a,onClick:f,disabled:o,children:o?"진행 중…":s})]})]})}):null}const b=e.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.28);
  backdrop-filter: blur(3px);
  display: grid;
  place-items: center;
  z-index: 1200;
`,h=e.div`
  width: min(480px, calc(100% - 32px));
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  box-shadow: 0 28px 60px rgba(15, 23, 42, 0.22);
  padding: 24px 26px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 16px;
`,u=e.span`
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: ${({"data-tone":d})=>d==="danger"?"#fee2e2":"#e0f2fe"};
  color: ${({"data-tone":d})=>d==="danger"?"#b91c1c":"#2563eb"};
  font-size: 20px;
`,m=e.div`
  display: grid;
  gap: 8px;
`,j=e.h3`
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  color: #0f172a;
`,k=e.div`
  color: #475569;
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
`,y=e.div`
  grid-column: 1 / -1;
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`,c=e.button`
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
`,v="⚠️",w="ℹ️";export{z as C};
