import{j as e,d as r,x as p,t as g}from"./index-CeMlVP5a.js";function L({title:o,icon:c,iconAccent:d,value:a,footerLeft:l,footerRight:x,loading:i,error:h,onRetry:n}){return e.jsxs(u,{"aria-busy":i,children:[e.jsx(f,{children:i?e.jsxs(e.Fragment,{children:[e.jsx(I,{}),e.jsx(y,{})]}):e.jsxs(e.Fragment,{children:[e.jsx(b,{children:o}),e.jsx($,{$accent:d,children:c})]})}),i?e.jsx(C,{}):h?e.jsxs(v,{children:[e.jsx("span",{children:"불러오기 실패"}),n&&e.jsx(w,{type:"button",onClick:n,children:"다시 시도"})]}):e.jsx(j,{children:a}),e.jsx(k,{children:i?e.jsxs(e.Fragment,{children:[e.jsx(s,{style:{width:90}}),e.jsx(s,{style:{width:64}})]}):e.jsxs(e.Fragment,{children:[e.jsx("span",{children:l}),e.jsx("span",{children:x})]})})]})}function P(){return e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M20 21v-2a4 4 0 0 0-3-3.87"}),e.jsx("path",{d:"M4 21v-2a4 4 0 0 1 3-3.87"}),e.jsx("circle",{cx:"7",cy:"7",r:"4"}),e.jsx("circle",{cx:"17",cy:"7",r:"4"})]})}function K(){return e.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"M20 6L9 17l-5-5"})})}function M(){return e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M22 10L12 4 2 10l10 6 10-6z"}),e.jsx("path",{d:"M6 12v5l6 3 6-3v-5"})]})}const u=r.article`
  /* Card visuals aligned across pages */
  --kpi-card-height: 140px;
  height: var(--kpi-card-height);
  min-height: var(--kpi-card-height);
  grid-column: span 4; /* 3-up layout on 12-col dashboard */
  border-radius: ${o=>o.theme.radii.xl};
  border: 1px solid ${o=>o.theme.colors.border};
  background: ${o=>o.theme.colors.surface};
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-sizing: border-box;
`,f=r.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`,b=r.h4`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: ${o=>o.theme.colors.textMuted};
`,j=r.div`
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: ${o=>o.theme.colors.text};
`,k=r.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${o=>o.theme.colors.textMuted};
  font-size: 12px;
  margin-top: auto; /* pin footer to bottom for consistent vertical rhythm */
`,m=g`
  0% { background-position: 100% 0; }
  100% { background-position: 0 0; }
`,t=p`
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 37%, #f3f4f6 63%);
  background-size: 400% 100%;
  animation: ${m} 1.2s ease-in-out infinite;
`,$=r.span`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  font-size: 0;
  ${o=>o.$accent==="emerald"?"background:#ecfdf5; color:#059669;":o.$accent==="green"?"background:#dcfce7; color:#16a34a;":o.$accent==="violet"?"background:#f3e8ff; color:#7c3aed;":"background:#eef2ff; color:#4f46e5;"}
`,B=r.span`
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
  ${o=>o.$tone==="positive"?"background:#dcfce7; color:#16a34a;":o.$tone==="negative"?"background:#fee2e2; color:#b91c1c;":"background:#e5e7eb; color:#6b7280;"}
`;r.div`
  width: ${o=>o.$w?`${o.$w}px`:"100%"};
  height: ${o=>o.$h?`${o.$h}px`:"14px"};
  border-radius: 6px;
  ${t}
`;const v=r.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #b91c1c;
  font-weight: 600;
`,w=r.button`
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid #fecaca;
  background: #fee2e2;
  color: #991b1b;
  cursor: pointer;
`,y=r.div`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  ${t}
`,I=r.div`
  width: 140px;
  height: 14px;
  border-radius: 6px;
  ${t}
`,C=r.div`
  width: 200px;
  height: 28px;
  border-radius: 8px;
  margin-top: 6px;
  ${t}
`,s=r.div`
  height: 20px;
  border-radius: 9999px;
  ${t}
`;export{K as C,B as D,L as K,P as U,M as a};
