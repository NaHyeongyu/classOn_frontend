import{j as e,d as C,r as s,c as O}from"./index-B0K7mn4q.js";import{P as N,e as V,f as q,g as J,d as L,F as $,I as K,M as Q,E as U,C as X,a as Y,b as Z,T as A,c as _,S as ee,h as M,i as te,j as ne,k as se}from"./AdminStyles-Chj6B07V.js";import{e as ae}from"./admin-DSlJSHO4.js";function re({rows:l,loading:t,error:p,page:h,size:j,totalPages:b,totalElements:y,from:f,to:k,onChangeFrom:x,onChangeTo:S,rangeLabel:i,displayedRange:R,rangeSummary:m,pageInfo:v,onApplyRange:o,onChangeSize:z,onChangePage:r}){return e.jsxs(N,{children:[e.jsxs(V,{children:[e.jsxs("div",{children:[e.jsx(q,{children:"결제 기록"}),e.jsx(J,{children:R})]}),e.jsxs(L,{children:[e.jsx($,{htmlFor:"admin-payments-from",children:"기간"}),e.jsx(K,{id:"admin-payments-from",type:"date",lang:"ko-KR",value:f,onChange:a=>x(a.target.value)}),e.jsx("span",{children:"~"}),e.jsx(K,{id:"admin-payments-to",type:"date",lang:"ko-KR",value:k,onChange:a=>S(a.target.value)}),e.jsx(Q,{type:"button",onClick:o,disabled:t,children:"필터 적용"})]})]}),p?e.jsxs(U,{role:"status",children:["⚠️ ",p]}):null,e.jsxs(X,{children:[e.jsxs(Y,{children:[e.jsxs("div",{children:[e.jsx("h3",{children:"결제 목록"}),e.jsx(Z,{children:v})]}),e.jsx(A,{children:i})]}),e.jsxs(_,{children:[e.jsxs(A,{children:["표시된 결제: ",l.length.toLocaleString("ko-KR"),"건"]}),e.jsxs(L,{children:[e.jsx($,{htmlFor:"admin-payments-size",children:"페이지 크기"}),e.jsx(ee,{id:"admin-payments-size",value:j,onChange:a=>z(Number(a.target.value)),children:[20,50,100].map(a=>e.jsxs("option",{value:a,children:[a,"개씩"]},a))})]})]}),e.jsx(oe,{children:e.jsxs("table",{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"시간"}),e.jsx("th",{children:"금액(원)"}),e.jsx("th",{children:"통화"}),e.jsx("th",{children:"상태"}),e.jsx("th",{children:"비고"})]})}),e.jsx("tbody",{children:t?e.jsx("tr",{children:e.jsx("td",{colSpan:5,children:e.jsx(M,{children:e.jsx("span",{children:"결제 데이터를 불러오는 중…"})})})}):l.length===0?e.jsx("tr",{children:e.jsx("td",{colSpan:5,children:e.jsx(M,{children:"표시할 데이터가 없습니다."})})}):l.map((a,u)=>e.jsxs("tr",{children:[e.jsx("td",{children:ie(a.createdAt)}),e.jsx("td",{children:Math.round((a.amountCents||0)/100).toLocaleString("ko-KR")}),e.jsx("td",{children:a.currency||"KRW"}),e.jsx("td",{children:a.status}),e.jsx("td",{children:a.description||"-"})]},a.id??u))})]})}),e.jsxs(te,{children:[e.jsxs(ne,{children:[e.jsx(w,{type:"button",onClick:()=>r(h-1),disabled:h<=0||t,children:"이전"}),e.jsxs(le,{children:[h+1," / ",b||1]}),e.jsx(w,{type:"button",onClick:()=>r(h+1),disabled:h>=b-1||t,children:"다음"})]}),e.jsxs(A,{children:["총 ",y.toLocaleString("ko-KR"),"건"]})]}),m?e.jsxs(de,{children:["표시 범위: ",m]}):null]})]})}const oe=C.div`
  width: 100%;
  overflow: auto;
  border: 1px solid #f1f5f9;
  border-radius: 12px;
  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    overflow: hidden;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    background: #fff;
  }
  thead th {
    text-align: left;
    font-size: 12px;
    color: #6b7280;
    font-weight: 800;
    padding: 10px 12px;
    border-bottom: 1px solid #e5e7eb;
    background: #f9fafb;
  }
  tbody td {
    font-size: 13px;
    color: #0f172a;
    padding: 10px 12px;
    border-bottom: 1px solid #f1f5f9;
  }
  tbody tr:nth-child(odd) td {
    background: #fcfcfd;
  }
  tbody tr:hover td {
    background: #f9fafb;
  }
`,w=C(se)`
  height: 32px;
  padding: 0 12px;
  font-size: 13px;
`,le=C.span`
  font-size: 12px;
  color: #475569;
  font-weight: 700;
`,de=C.div`
  margin-top: 8px;
  font-size: 12px;
  color: #475569;
`;function ie(l){return new Date(l).toLocaleString("ko-KR",{dateStyle:"medium",timeStyle:"short"})}function ce({toastError:l}){const[t,p]=s.useState([]),[h,j]=s.useState(!1),[b,y]=s.useState(null),[f,k]=s.useState(0),[x,S]=s.useState(20),[i,R]=s.useState(0),[m,v]=s.useState(0),[o,z]=s.useState(()=>{const n=new Date;return n.setDate(n.getDate()-30),n.toISOString().slice(0,10)}),[r,a]=s.useState(()=>new Date().toISOString().slice(0,10)),u=s.useRef(x);s.useEffect(()=>{u.current=x},[x]);const c=s.useCallback(async(n,g,E)=>{j(!0),y(null);try{const d=await ae({page:n,size:g,from:E.from,to:E.to});p(d.content||[]),k(d.page),S(d.size),R(d.totalPages),v(d.totalElements??d.content?.length??0)}catch(T){const d=T instanceof Error?T.message:"결제 기록을 불러오지 못했습니다.";y(d),l(d)}finally{j(!1)}},[l]);s.useEffect(()=>{c(0,u.current,{from:o,to:r})},[o,r,c]);const I=s.useCallback(()=>{c(0,u.current,{from:o,to:r})},[o,r,c]),D=s.useCallback(n=>{n<0||n>=i||c(n,u.current,{from:o,to:r})},[o,r,c,i]),F=s.useCallback(n=>{S(n),u.current=n,c(0,n,{from:o,to:r})},[o,r,c]),G=s.useMemo(()=>`${o} ~ ${r}`,[o,r]),H=s.useMemo(()=>{if(t.length===0)return"표시할 데이터가 없습니다.";const n=t[0]?.createdAt,g=t[t.length-1]?.createdAt;return!n||!g?`${t.length.toLocaleString("ko-KR")}건 표시 중`:`${P(n)} ~ ${P(g)}`},[t]),W=s.useMemo(()=>{const n=Math.max(1,i);return`페이지 ${i===0?0:f+1} / ${n} • 총 ${m.toLocaleString("ko-KR")}건`},[f,m,i]),B=s.useMemo(()=>{if(t.length===0)return null;const n=t[0],g=t[t.length-1];return!n?.createdAt||!g?.createdAt?null:`${P(n.createdAt)} ~ ${P(g.createdAt)}`},[t]);return{rows:t,loading:h,error:b,page:f,size:x,totalPages:i,totalElements:m,from:o,to:r,setFrom:z,setTo:a,rangeLabel:G,displayedRange:H,rangeSummary:B,pageInfo:W,handleApplyRange:I,handleChangeSize:F,handleChangePage:D}}function P(l){return new Date(l).toLocaleString("ko-KR",{dateStyle:"medium",timeStyle:"short"})}function xe(){const{error:l}=O(),t=ce({toastError:l});return e.jsx(re,{rows:t.rows,loading:t.loading,error:t.error,page:t.page,size:t.size,totalPages:t.totalPages,totalElements:t.totalElements,from:t.from,to:t.to,onChangeFrom:t.setFrom,onChangeTo:t.setTo,rangeLabel:t.rangeLabel,displayedRange:t.displayedRange,rangeSummary:t.rangeSummary,pageInfo:t.pageInfo,onApplyRange:t.handleApplyRange,onChangeSize:t.handleChangeSize,onChangePage:t.handleChangePage})}export{xe as default};
