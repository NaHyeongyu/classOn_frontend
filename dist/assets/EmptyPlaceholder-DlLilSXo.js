import{j as n,d as o,c as i}from"./index-Da2dCk2M.js";function m({icon:t,title:l,description:e,actionLabel:s,onAction:r,actionVariant:p="primary",className:a}){return n.jsxs(x,{className:a,role:"status","aria-live":"polite",children:[t?n.jsx(c,{"aria-hidden":!0,children:t}):null,n.jsxs(d,{children:[n.jsx(u,{children:l}),e?n.jsx(h,{children:e}):null]}),s&&r?n.jsx(g,{type:"button",$variant:p,onClick:r,children:s}):null]})}const x=o.div`
  padding: 24px 12px;
  display: grid;
  gap: 6px;
  justify-items: center;
  text-align: center;
  color: ${({theme:t})=>t.colors.textMuted};
`,c=o.span`
  font-size: 18px;
  color: ${({theme:t})=>t.colors.textMuted};
`,d=o.div`
  display: grid;
  gap: 6px;
`,u=o.span`
  font-size: 13px;
  color: ${({theme:t})=>t.colors.textMuted};
`,h=o.span`
  font-size: 13px;
  color: ${({theme:t})=>t.colors.textMuted};
`,g=o.button`
  ${({$variant:t})=>t==="outline"?i.outline:i.primary};
  height: 38px;
  padding: 0 18px;
  font-size: 13px;
  margin-top: 4px;
`;export{m as E};
