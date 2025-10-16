import{j as o,d as n}from"./index-WIHyZsXz.js";import{c as i}from"./UI-mdaSCs3C.js";function f({icon:t,title:l,description:e,actionLabel:r,onAction:s,actionVariant:p="primary",className:a}){return o.jsxs(x,{className:a,role:"status","aria-live":"polite",children:[t?o.jsx(c,{"aria-hidden":!0,children:t}):null,o.jsxs(d,{children:[o.jsx(u,{children:l}),e?o.jsx(h,{children:e}):null]}),r&&s?o.jsx(m,{type:"button",$variant:p,onClick:s,children:r}):null]})}const x=n.div`
  padding: 24px 12px;
  display: grid;
  gap: 6px;
  justify-items: center;
  text-align: center;
  color: ${({theme:t})=>t.colors.textMuted};
`,c=n.span`
  font-size: 18px;
  color: ${({theme:t})=>t.colors.textMuted};
`,d=n.div`
  display: grid;
  gap: 6px;
`,u=n.span`
  font-size: 13px;
  color: ${({theme:t})=>t.colors.textMuted};
`,h=n.span`
  font-size: 13px;
  color: ${({theme:t})=>t.colors.textMuted};
`,m=n.button`
  ${({$variant:t})=>t==="outline"?i.outline:i.primary};
  height: 40px;
  padding: 0 18px;
  font-size: 13px;
  margin-top: 4px;
`;export{f as E};
