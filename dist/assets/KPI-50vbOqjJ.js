import{j as e,d as t,w as p,s as g}from"./index-Dutj9l30.js";function P({title:r,icon:d,iconAccent:c,value:a,footerLeft:l,footerRight:h,loading:i,error:x,onRetry:n}){return e.jsxs(u,{"aria-busy":i,children:[e.jsx(f,{children:i?e.jsxs(e.Fragment,{children:[e.jsx(M,{}),e.jsx(y,{})]}):e.jsxs(e.Fragment,{children:[e.jsx(b,{children:r}),e.jsx($,{$accent:c,children:d})]})}),i?e.jsx(I,{}):x?e.jsxs(v,{children:[e.jsx("span",{children:"불러오기 실패"}),n&&e.jsx(w,{type:"button",onClick:n,children:"다시 시도"})]}):e.jsx(j,{children:a}),e.jsx(k,{children:i?e.jsxs(e.Fragment,{children:[e.jsx(s,{style:{width:90}}),e.jsx(s,{style:{width:64}})]}):e.jsxs(e.Fragment,{children:[e.jsx("span",{children:l}),e.jsx("span",{children:h})]})})]})}function z(){return e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M20 21v-2a5 5 0 0 0-5-5H9a5 5 0 0 0-5 5v2"}),e.jsx("circle",{cx:"12",cy:"7",r:"4"})]})}function K(){return e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"12",cy:"12",r:"10"}),e.jsx("path",{d:"M9 12l2 2 4-4"})]})}function L(){return e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("rect",{x:"3",y:"4",width:"18",height:"18",rx:"4"}),e.jsx("path",{d:"M16 2v4M8 2v4"}),e.jsx("path",{d:"M3 10h18"}),e.jsx("path",{d:"M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"})]})}const u=t.article`
  /* Card visuals aligned across pages */
  --kpi-card-height: 140px;
  height: var(--kpi-card-height);
  min-height: var(--kpi-card-height);
  grid-column: span 4; /* 3-up layout on 12-col dashboard */
  border-radius: ${r=>r.theme.radii.xl};
  border: 1px solid ${r=>r.theme.colors.border};
  background: ${r=>r.theme.colors.surface};
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-sizing: border-box;
`,f=t.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`,b=t.h4`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: ${r=>r.theme.colors.textMuted};
`,j=t.div`
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: ${r=>r.theme.colors.text};
`,k=t.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${r=>r.theme.colors.textMuted};
  font-size: 12px;
  margin-top: auto; /* pin footer to bottom for consistent vertical rhythm */
`,m=g`
  0% { background-position: 100% 0; }
  100% { background-position: 0 0; }
`,o=p`
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 37%, #f3f4f6 63%);
  background-size: 400% 100%;
  animation: ${m} 1.2s ease-in-out infinite;
`,$=t.span`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  font-size: 0;
  ${r=>r.$accent==="emerald"?"background:linear-gradient(180deg,#ecfdf5 0%,#dcfce7 100%); color:#059669;":r.$accent==="green"?"background:linear-gradient(180deg,#dcfce7 0%,#bbf7d0 100%); color:#16a34a;":r.$accent==="violet"?"background:linear-gradient(180deg,#f3e8ff 0%,#e9d5ff 100%); color:#7c3aed;":"background:linear-gradient(180deg,#eef2ff 0%,#e0e7ff 100%); color:#4f46e5;"}
  box-shadow: inset 0 0 0 1px rgba(0,0,0,0.02);
`,B=t.span`
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
  ${r=>r.$tone==="positive"?"background:#dcfce7; color:#16a34a;":r.$tone==="negative"?"background:#fee2e2; color:#b91c1c;":"background:#e5e7eb; color:#6b7280;"}
`;t.div`
  width: ${r=>r.$w?`${r.$w}px`:"100%"};
  height: ${r=>r.$h?`${r.$h}px`:"14px"};
  border-radius: 6px;
  ${o}
`;const v=t.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #b91c1c;
  font-weight: 600;
`,w=t.button`
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid #fecaca;
  background: #fee2e2;
  color: #991b1b;
  cursor: pointer;
`,y=t.div`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  ${o}
`,M=t.div`
  width: 140px;
  height: 14px;
  border-radius: 6px;
  ${o}
`,I=t.div`
  width: 200px;
  height: 28px;
  border-radius: 8px;
  margin-top: 6px;
  ${o}
`,s=t.div`
  height: 20px;
  border-radius: 9999px;
  ${o}
`;export{K as C,B as D,P as K,z as U,L as a};
