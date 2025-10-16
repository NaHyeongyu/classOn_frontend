import{r as l,j as r,d as n,m as E,f as c,c as p}from"./index-WIHyZsXz.js";import{c as M}from"./UI-mdaSCs3C.js";function C({open:e,title:t,description:s,onClose:a,children:w,footer:f,maxWidth:x=560,blockOutsideClose:j=!1,initialFocusRef:y}){const i=l.useRef(null),h=l.useMemo(()=>t?`modal-title-${Math.random().toString(36).slice(2,8)}`:void 0,[t]),b=l.useMemo(()=>s?`modal-desc-${Math.random().toString(36).slice(2,8)}`:void 0,[s]);if(l.useEffect(()=>{if(!e)return;const m=document.activeElement;(y?.current||i.current?.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')||void 0)?.focus?.();const g=o=>{if(!(o.isComposing||o.keyCode===229)){if(o.key==="Escape"&&a)o.stopPropagation(),a();else if(o.key==="Tab"&&i.current){const d=Array.from(i.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')).filter(S=>!S.hasAttribute("disabled"));if(d.length===0)return;const $=d[0],v=d[d.length-1],u=document.activeElement;o.shiftKey?(u===$||!i.current.contains(u))&&(o.preventDefault(),v.focus()):(u===v||!i.current.contains(u))&&(o.preventDefault(),$.focus())}}};return document.addEventListener("keydown",g,!0),()=>{document.removeEventListener("keydown",g,!0),m?.focus?.()}},[e,a,y]),!e)return null;const k={width:"min(100% - 32px, "+(typeof x=="number"?`${x}px`:x)+")"};return r.jsx(P,{onClick:j?void 0:a,children:r.jsxs(T,{ref:i,role:"dialog","aria-modal":"true","aria-labelledby":h,"aria-describedby":b,onClick:m=>m.stopPropagation(),style:k,children:[(t||a)&&r.jsxs(z,{children:[t?r.jsx("h3",{id:h,children:t}):r.jsx("span",{}),a&&r.jsx(N,{type:"button",onClick:a,"aria-label":"닫기",children:"×"})]}),s?r.jsx(A,{id:b,children:s}):null,r.jsx(D,{children:w}),f?r.jsx(J,{children:f}):null]})})}const B=E`
  from { opacity: 0; }
  to { opacity: 1; }
`,O=E`
  0% { opacity: 0; transform: translateY(8px) scale(0.98); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
`,P=n.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.35);
  display: grid;
  place-items: center;
  z-index: 1200;
  animation: ${B} 140ms ease-out;
`,T=n.div`
  background: ${e=>e.theme.colors.surface};
  border: 1px solid ${e=>e.theme.colors.border};
  border-radius: ${e=>e.theme.radii.lg};
  box-shadow: 0 20px 60px rgba(2, 6, 23, 0.16);
  display: grid;
  grid-template-rows: auto auto 1fr auto;
  gap: 0;
  max-height: calc(100vh - 80px);
  overflow: hidden;
  animation: ${O} 160ms ease-out;
`,z=n.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid ${e=>e.theme.colors.borderMuted};
  background: ${e=>e.theme.colors.surface};
  h3 { margin: 0; font-size: 18px; font-weight: 800; color: ${e=>e.theme.colors.text}; }
`,A=n.div`
  padding: 10px 16px 0 16px;
  color: ${e=>e.theme.colors.textMuted};
  font-size: 13px;
`,D=n.div`
  padding: 14px 16px 16px 16px;
  overflow: auto;
`,J=n.div`
  padding: 12px 16px;
  border-top: 1px solid ${e=>e.theme.colors.borderMuted};
  background: ${e=>e.theme.colors.surface};
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
`,N=n.button`
  ${M.outline};
  height: 32px; padding: 0 10px; font-size: 14px;
`;async function F(e){return await c(`/api/courses/${e}/exams`)}async function K(e,t){const s=await c(`/api/courses/${e}/exams`,{method:"POST",body:JSON.stringify(t)});try{p(`/api/courses/${e}/exams`)}catch{}return s}async function Y(e,t,s){const a=await c(`/api/courses/${e}/exams/${t}`,{method:"PUT",body:JSON.stringify(s)});try{p(`/api/courses/${e}/exams`)}catch{}return a}async function H(e,t){await c(`/api/courses/${e}/exams/${t}`,{method:"DELETE"});try{p(`/api/courses/${e}/exams`)}catch{}}async function U(e,t){return await c(`/api/courses/${e}/exams/${t}/results`)}async function V(e,t,s){const a=await c(`/api/courses/${e}/exams/${t}/results`,{method:"POST",body:JSON.stringify(s)});try{p(`/api/courses/${e}/exams`)}catch{}return a}export{C as M,U as a,V as b,K as c,H as d,F as l,Y as u};
