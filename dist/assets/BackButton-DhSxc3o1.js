import{u as d,j as t,d as s}from"./index-Bf8ggjEf.js";import{j as p}from"./UI-27qTHgPb.js";function j({to:n,label:o="뒤로가기",className:r,backSteps:a=1,icon:l,onClick:e}){const i=d(),c=()=>{if(e)return e();i(n||-Math.abs(a))};return t.jsxs(u,{as:"button",type:"button",onClick:c,className:r,children:[t.jsx(h,{"aria-hidden":!0,children:l??x}),o]})}const u=s(p)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
`,h=s.span`
  display: inline-grid;
  place-items: center;
`,x=t.jsx("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:t.jsx("polyline",{points:"15 18 9 12 15 6"})});export{j as B};
