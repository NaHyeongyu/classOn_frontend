import{d as e,m as t}from"./index-CyW3XeFu.js";const r=e.div`
  display: grid;
  gap: 16px;
`,s=e.header`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 0;
`,p=e.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  color: #0f172a;
`,d=e.span`
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: #64748b;
`;e.div`
  display: grid;
  gap: 4px;
`;const l=e.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`,f=e.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
`,c=e.span`
  font-size: 12px;
  color: #64748b;
  font-weight: 700;
`,g=e.label`
  font-size: 12px;
  font-weight: 700;
  color: #475569;
  display: inline-flex;
  align-items: center;
  gap: 6px;
`,x=e.input`
  height: 40px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #0f172a;
  font-size: 14px;
`,b=e.select`
  height: 40px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #0f172a;
  font-size: 14px;
  cursor: pointer;
`,a=`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 40px;
  padding: 0 14px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: background .15s ease, color .15s ease, border-color .15s ease;
`,u=e.button`
  ${a};
  background: #111827;
  color: #ffffff;
  border: 1px solid #111827;
  &:hover {
    background: #000000;
    border-color: #000000;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`,m=e.button`
  ${a};
  background: #ffffff;
  color: #111827;
  border: 1px solid #e5e7eb;
  &:hover {
    background: #f9fafb;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  }
`,y=e.section`
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #ffffff;
  padding: 16px;
  display: grid;
  gap: 12px;
`,h=e.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 800;
    color: #0f172a;
  }
`,w=e.span`
  font-size: 12px;
  color: #94a3b8;
`,k=e.div`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
`,v=e.div`
  display: grid;
  gap: 16px;
`,z=e.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 10px;
  li {
    display: grid;
    grid-template-columns: 140px 1fr;
    gap: 12px;
    font-size: 13px;
    color: #0f172a;
  }
  .label {
    font-weight: 700;
    color: #64748b;
    font-size: 12px;
    letter-spacing: .01em;
  }
  .value {
    font-weight: 800;
  }
`,T=e.div`
  width: 100%;
  overflow: auto;
  border: 1px solid #f1f5f9;
  border-radius: 12px;
`,P=e.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  thead th {
    position: sticky;
    top: 0;
    background: #f8fafc;
    font-size: 12px;
    font-weight: 800;
    color: #64748b;
    padding: 10px 12px;
    border-bottom: 1px solid #e5e7eb;
    text-align: left;
  }
  tbody td {
    padding: 10px 12px;
    border-bottom: 1px solid #f1f5f9;
    font-size: 13px;
    color: #0f172a;
  }
  tbody tr:nth-child(odd) td {
    background: #fcfcfd;
  }
  tbody tr:hover td {
    background: #f9fafb;
  }
`,n=t`
  0% { background-position: 100% 0; }
  100% { background-position: 0 0; }
`,j=e.span`
  display: block;
  width: ${({$width:o})=>typeof o=="number"?`${o}px`:o||"100%"};
  height: ${({$height:o})=>o?`${o}px`:"12px"};
  border-radius: 999px;
  background: linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 50%, #f1f5f9 100%);
  background-size: 200% 100%;
  animation: ${n} 1.2s ease-in-out infinite;
`,G=e.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 18px;
  font-size: 13px;
  font-weight: 600;
  color: ${({$variant:o})=>o==="error"?"#b91c1c":"#475569"};
`,S=e.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`,M=e.div`
  display: flex;
  align-items: center;
  gap: 8px;
`,$=e.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 999px;
  background: #e0f2fe;
  color: #0369a1;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: .02em;
`,B=e.span`
  font-size: 12px;
  color: #94a3b8;
`,C=e.div`
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid #fecaca;
  background: #fee2e2;
  color: #b91c1c;
  font-weight: 600;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 13px;
`;export{y as C,C as E,g as F,k as G,x as I,u as M,r as P,b as S,f as T,s as a,p as b,d as c,h as d,w as e,c as f,l as g,T as h,P as i,G as j,S as k,M as l,m,$ as n,B as o,z as p,j as q,v as r};
