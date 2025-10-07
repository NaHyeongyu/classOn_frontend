import{r,j as a,d}from"./index-DuqOyKVg.js";function A({value:o,onChange:m,options:n,placeholder:x,disabled:u,ariaLabel:v,className:g,style:k,width:l}){const[s,f]=r.useState(!1),[p,c]=r.useState(-1),h=r.useRef(null),y=r.useMemo(()=>n.find(e=>e.value===o)?.label??"",[n,o]),w=r.useCallback(()=>{u||f(t=>!t)},[u]),b=r.useCallback(t=>{const e=n[t];e&&(m(e.value),f(!1))},[n,m]);r.useEffect(()=>{function t(e){h.current&&(h.current.contains(e.target)||f(!1))}return document.addEventListener("mousedown",t),()=>document.removeEventListener("mousedown",t)},[]),r.useEffect(()=>{function t(e){if(s){if(e.key==="Escape"){e.preventDefault(),f(!1);return}e.key==="ArrowDown"&&(e.preventDefault(),c(i=>Math.min(n.length-1,Math.max(0,i+1)))),e.key==="ArrowUp"&&(e.preventDefault(),c(i=>Math.max(0,i<0?n.length-1:i-1))),e.key==="Enter"&&(e.preventDefault(),b(p>=0?p:Math.max(0,n.findIndex(i=>i.value===o))))}}return document.addEventListener("keydown",t),()=>document.removeEventListener("keydown",t)},[s,p,n,o,b]),r.useEffect(()=>{s||c(-1)},[s]);const j=r.useMemo(()=>l!=null?{width:typeof l=="number"?`${l}px`:l}:{},[l]);return a.jsxs(E,{ref:h,className:g,style:{...k,...j},"aria-label":v,"data-disabled":u||void 0,children:[a.jsxs(M,{type:"button",onClick:w,disabled:u,"data-open":s||void 0,children:[a.jsx("span",{className:!o&&x?"placeholder":void 0,children:!o&&x?x:y||o||""}),a.jsx(C,{"aria-hidden":!0,children:a.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:a.jsx("polyline",{points:"6 9 12 15 18 9"})})})]}),s&&a.jsxs(L,{role:"listbox",children:[n.map((t,e)=>a.jsx(D,{role:"option","aria-selected":t.value===o,"data-active":e===p||void 0,"data-selected":t.value===o||void 0,onMouseEnter:()=>c(e),onMouseLeave:()=>c(-1),onClick:()=>b(e),children:t.label},t.value)),n.length===0&&a.jsx(S,{children:"옵션이 없습니다."})]})]})}const E=d.div`
  position: relative;
  width: 100%;
  min-width: 80px;
`,M=d.button`
  width: 100%;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 10px 0 12px;
  background: #fff;
  color: #0f172a;
  font-size: 14px;
  cursor: pointer;
  .placeholder { color:#9ca3af; }
  &[data-open='true'] { border-color:#111827; box-shadow: 0 0 0 3px rgba(17,24,39,0.08); }
  &:disabled{ cursor: not-allowed; opacity: .6; }
`,C=d.span`
  display: inline-flex; color:#9ca3af;
`,L=d.div`
  position: absolute; inset: auto 0 0 0; transform: translateY(calc(100% + 4px));
  max-height: 220px; overflow: auto; border: 1px solid #e5e7eb; border-radius: 10px; background: #fff; box-shadow: 0 8px 24px rgba(0,0,0,0.06);
  z-index: 40; padding: 4px;
`,D=d.div`
  height: 36px; display: flex; align-items: center; padding: 0 10px; border-radius: 8px; font-size: 14px; color:#111827; cursor: pointer;
  &[data-active='true']{ background:#f3f4f6; }
  &[data-selected='true']{ background:#eef2ff; color:#1f2937; font-weight: 700; }
`,S=d.div`
  padding: 8px 10px; color:#6b7280; font-size: 13px;
`;export{A as S};
