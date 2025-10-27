import{j as r,d as o,l as h,C as l}from"./index-B0K7mn4q.js";function y({title:e,icon:s,iconAccent:d,value:c,loading:i,error:a,onRetry:n}){return r.jsxs(x,{"aria-busy":i,children:[r.jsx(p,{children:i?r.jsxs(r.Fragment,{children:[r.jsx($,{}),r.jsx(j,{})]}):r.jsxs(r.Fragment,{children:[r.jsx(g,{children:e}),r.jsx(b,{$accent:d,children:s})]})}),i?r.jsx(v,{}):a?r.jsxs(k,{children:[r.jsx("span",{children:"불러오기 실패"}),n&&r.jsx(m,{type:"button",onClick:n,children:"다시 시도"})]}):r.jsx(u,{children:c})]})}function M(){return r.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[r.jsx("path",{d:"M20 21v-2a5 5 0 0 0-5-5H9a5 5 0 0 0-5 5v2"}),r.jsx("circle",{cx:"12",cy:"7",r:"4"})]})}function C(){return r.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[r.jsx("circle",{cx:"12",cy:"12",r:"10"}),r.jsx("path",{d:"M9 12l2 2 4-4"})]})}function I(){return r.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[r.jsx("rect",{x:"3",y:"4",width:"18",height:"18",rx:"4"}),r.jsx("path",{d:"M16 2v4M8 2v4"}),r.jsx("path",{d:"M3 10h18"}),r.jsx("path",{d:"M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"})]})}const x=o.article`
  /* Card visuals aligned across pages */
  --kpi-card-height: 140px;
  height: var(--kpi-card-height);
  min-height: var(--kpi-card-height);
  grid-column: span 4; /* 3-up layout on 12-col dashboard */
  border-radius: ${e=>e.theme.radii.xl};
  border: 1px solid ${e=>e.theme.colors.border};
  background: ${e=>e.theme.colors.surface};
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-sizing: border-box;
`,p=o.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`,g=o.h4`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: ${e=>e.theme.colors.textMuted};
`,u=o.div`
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: ${e=>e.theme.colors.text};
`;o.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${e=>e.theme.colors.textMuted};
  font-size: 12px;
  margin-top: auto; /* pin footer to bottom for consistent vertical rhythm */
`;const f=l`
  0% { background-position: 100% 0; }
  100% { background-position: 0 0; }
`,t=h`
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 37%, #f3f4f6 63%);
  background-size: 400% 100%;
  animation: ${f} 1.2s ease-in-out infinite;
`,b=o.span`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  font-size: 0;
  ${e=>e.$accent==="emerald"?"background:linear-gradient(180deg,#ecfdf5 0%,#dcfce7 100%); color:#059669;":e.$accent==="green"?"background:linear-gradient(180deg,#dcfce7 0%,#bbf7d0 100%); color:#16a34a;":e.$accent==="violet"?"background:linear-gradient(180deg,#f3e8ff 0%,#e9d5ff 100%); color:#7c3aed;":"background:linear-gradient(180deg,#eef2ff 0%,#e0e7ff 100%); color:#4f46e5;"}
  box-shadow: inset 0 0 0 1px rgba(0,0,0,0.02);
`;o.span`
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
  ${e=>e.$tone==="positive"?"background:#dcfce7; color:#16a34a;":e.$tone==="negative"?"background:#fee2e2; color:#b91c1c;":"background:#e5e7eb; color:#6b7280;"}
`;o.div`
  width: ${e=>e.$w?`${e.$w}px`:"100%"};
  height: ${e=>e.$h?`${e.$h}px`:"14px"};
  border-radius: 6px;
  ${t}
`;const k=o.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #b91c1c;
  font-weight: 600;
`,m=o.button`
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid #fecaca;
  background: #fee2e2;
  color: #991b1b;
  cursor: pointer;
`,j=o.div`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  ${t}
`,$=o.div`
  width: 140px;
  height: 14px;
  border-radius: 6px;
  ${t}
`,v=o.div`
  width: 200px;
  height: 28px;
  border-radius: 8px;
  margin-top: 6px;
  ${t}
`;export{C,y as K,M as U,I as a};
