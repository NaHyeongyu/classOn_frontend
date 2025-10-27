import{r as l,j as t,d as n,C as v}from"./index-B0K7mn4q.js";import{c as M}from"./UI-Cj3YhchZ.js";function P({open:e,title:s,description:i,onClose:r,children:$,footer:x,maxWidth:u=560,blockOutsideClose:j=!1,initialFocusRef:f}){const a=l.useRef(null),m=l.useMemo(()=>s?`modal-title-${Math.random().toString(36).slice(2,8)}`:void 0,[s]),b=l.useMemo(()=>i?`modal-desc-${Math.random().toString(36).slice(2,8)}`:void 0,[i]);if(l.useEffect(()=>{if(!e)return;const p=document.activeElement;(f?.current||a.current?.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')||void 0)?.focus?.();const h=o=>{if(!(o.isComposing||o.keyCode===229)){if(o.key==="Escape"&&r)o.stopPropagation(),r();else if(o.key==="Tab"&&a.current){const c=Array.from(a.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')).filter(w=>!w.hasAttribute("disabled"));if(c.length===0)return;const g=c[0],y=c[c.length-1],d=document.activeElement;o.shiftKey?(d===g||!a.current.contains(d))&&(o.preventDefault(),y.focus()):(d===y||!a.current.contains(d))&&(o.preventDefault(),g.focus())}}};return document.addEventListener("keydown",h,!0),()=>{document.removeEventListener("keydown",h,!0),p?.focus?.()}},[e,r,f]),!e)return null;const k={width:"min(100% - 32px, "+(typeof u=="number"?`${u}px`:u)+")"};return t.jsx(S,{onClick:j?void 0:r,children:t.jsxs(z,{ref:a,role:"dialog","aria-modal":"true","aria-labelledby":m,"aria-describedby":b,onClick:p=>p.stopPropagation(),style:k,children:[(s||r)&&t.jsxs(A,{children:[s?t.jsx("h3",{id:m,children:s}):t.jsx("span",{}),r&&t.jsx(F,{type:"button",onClick:r,"aria-label":"닫기",children:"×"})]}),i?t.jsx(D,{id:b,children:i}):null,t.jsx(q,{children:$}),x?t.jsx(C,{children:x}):null]})})}const E=v`
  from { opacity: 0; }
  to { opacity: 1; }
`,B=v`
  0% { opacity: 0; transform: translateY(8px) scale(0.98); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
`,S=n.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.35);
  display: grid;
  place-items: center;
  z-index: 1200;
  animation: ${E} 140ms ease-out;
`,z=n.div`
  background: ${e=>e.theme.colors.surface};
  border: 1px solid ${e=>e.theme.colors.border};
  border-radius: ${e=>e.theme.radii.lg};
  box-shadow: 0 20px 60px rgba(2, 6, 23, 0.16);
  display: grid;
  grid-template-rows: auto auto 1fr auto;
  gap: 0;
  max-height: calc(100vh - 80px);
  overflow: hidden;
  animation: ${B} 160ms ease-out;
`,A=n.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid ${e=>e.theme.colors.borderMuted};
  background: ${e=>e.theme.colors.surface};
  h3 { margin: 0; font-size: 18px; font-weight: 800; color: ${e=>e.theme.colors.text}; }
`,D=n.div`
  padding: 10px 16px 0 16px;
  color: ${e=>e.theme.colors.textMuted};
  font-size: 13px;
`,q=n.div`
  padding: 14px 16px 16px 16px;
  overflow: auto;
`,C=n.div`
  padding: 12px 16px;
  border-top: 1px solid ${e=>e.theme.colors.borderMuted};
  background: ${e=>e.theme.colors.surface};
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
`,F=n.button`
  ${M.outline};
  height: 32px; padding: 0 10px; font-size: 14px;
`;export{P as M};
