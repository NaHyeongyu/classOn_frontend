import{j as r,d as o}from"./index-Da2dCk2M.js";function c({title:l,description:a,tips:n,onClose:e,className:i}){return r.jsxs(p,{className:i,role:"note",children:[r.jsxs(s,{children:[l?r.jsx("h4",{children:l}):null,a?r.jsx("p",{children:a}):null,n&&n.length?r.jsx("ul",{children:n.map((d,t)=>r.jsx("li",{children:d},t))}):null]}),e?r.jsx(g,{type:"button",onClick:e,"aria-label":"도움말 닫기",children:"×"}):null]})}const p=o.div`
  position: relative;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: flex-start;
  gap: 12px;
  padding: 16px 18px;
  border-radius: 16px;
  border: 1px solid rgba(96, 165, 250, 0.28);
  background: linear-gradient(135deg, rgba(219, 234, 254, 0.38), rgba(255, 255, 255, 0.9));
  color: #0f172a;
`,s=o.div`
  display: grid;
  gap: 6px;
  h4 {
    margin: 0;
    font-size: 15px;
    font-weight: 800;
    color: #1d4ed8;
  }
  p {
    margin: 0;
    font-size: 13px;
    color: #475569;
  }
  ul {
    margin: 0;
    padding-left: 18px;
    display: grid;
    gap: 4px;
    font-size: 12.5px;
    color: #475569;
  }
`,g=o.button`
  border: none;
  background: transparent;
  color: #64748b;
  font-size: 18px;
  padding: 0 4px;
  cursor: pointer;
  align-self: start;
  &:hover {
    color: #1d4ed8;
  }
`;export{c as I};
