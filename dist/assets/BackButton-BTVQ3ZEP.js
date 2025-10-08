import{u as d,j as t,d as i,w as u}from"./index-_dJHzZeb.js";function f({to:n,label:o="뒤로가기",className:r,backSteps:a=1,icon:l,onClick:e}){const s=d(),c=()=>{if(e)return e();s(n||-Math.abs(a))};return t.jsxs(p,{as:"button",type:"button",onClick:c,className:r,children:[t.jsx(h,{"aria-hidden":!0,children:l??x}),o]})}const p=i(u)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
`,h=i.span`
  display: inline-grid;
  place-items: center;
`,x=t.jsx("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:t.jsx("polyline",{points:"15 18 9 12 15 6"})});export{f as B};
