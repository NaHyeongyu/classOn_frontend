import{j as e,d as y,r as s,c as te}from"./index-B0K7mn4q.js";import{P as re,e as se,f as ae,g as ne,d as O,F as M,I as K,S as W,M as oe,E as le,C as ie,a as de,b as ce,T as Q,c as he,h as H,l as ue,i as pe,j as ge,k as xe}from"./AdminStyles-Chj6B07V.js";import{c as fe}from"./admin-DSlJSHO4.js";function je({rows:n,loading:t,error:S,page:h,size:v,totalPages:P,totalElements:C,from:g,to:R,onChangeFrom:u,onChangeTo:I,pathInput:d,onChangePathInput:A,errorsFilterInput:x,onChangeErrorsFilter:z,pathQuery:o,errorsFilter:L,rangeLabel:l,displayedRange:T,pageInfo:f,onApplyFilters:k,onChangeSize:p,onChangePage:F}){return e.jsxs(re,{children:[e.jsxs(se,{children:[e.jsxs("div",{children:[e.jsx(ae,{children:"API 요청 로그"}),e.jsx(ne,{children:T})]}),e.jsxs(O,{children:[e.jsx(M,{htmlFor:"api-log-from",children:"기간"}),e.jsx(K,{id:"api-log-from",type:"date",lang:"ko-KR",value:g,onChange:r=>u(r.target.value)}),e.jsx("span",{children:"~"}),e.jsx(K,{id:"api-log-to",type:"date",lang:"ko-KR",value:R,onChange:r=>I(r.target.value)}),e.jsx(M,{htmlFor:"api-log-path",children:"경로"}),e.jsx(K,{id:"api-log-path",placeholder:"예: /api/admin",value:d,onChange:r=>A(r.target.value),onKeyDown:r=>{r.key==="Enter"&&(r.preventDefault(),k())}}),e.jsxs(W,{"aria-label":"오류 필터",value:x,onChange:r=>z(r.target.value),children:[e.jsx("option",{value:"all",children:"모든 상태"}),e.jsx("option",{value:"errors",children:"오류만 (상태 ≥ 400)"})]}),e.jsx(oe,{type:"button",onClick:k,disabled:t,children:"필터 적용"})]})]}),S?e.jsxs(le,{role:"status",children:["⚠️ ",S]}):null,e.jsxs(ie,{children:[e.jsxs(de,{children:[e.jsxs("div",{children:[e.jsx("h3",{children:"요청 목록"}),e.jsx(ce,{children:f})]}),e.jsx(Q,{children:l})]}),e.jsxs(he,{children:[e.jsxs(Q,{children:["경로 필터: ",o||"없음"," · 오류 필터:"," ",L==="errors"?"오류만":"전체"]}),e.jsxs(O,{children:[e.jsx(M,{htmlFor:"api-log-size",children:"페이지 크기"}),e.jsx(W,{id:"api-log-size",value:v,onChange:r=>p(Number(r.target.value)),children:[20,50,100].map(r=>e.jsxs("option",{value:r,children:[r,"개씩"]},r))})]})]}),e.jsx(me,{children:e.jsxs("table",{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{style:{minWidth:140},children:"시간"}),e.jsx("th",{style:{width:80},children:"메서드"}),e.jsx("th",{children:"경로"}),e.jsx("th",{style:{width:80},children:"상태"}),e.jsx("th",{style:{width:160},children:"IP"}),e.jsx("th",{style:{width:160},children:"사용자"})]})}),e.jsx("tbody",{children:t?e.jsx("tr",{children:e.jsx("td",{colSpan:6,children:e.jsx(H,{children:e.jsx("span",{children:"API 로그를 불러오는 중…"})})})}):n.length===0?e.jsx("tr",{children:e.jsx("td",{colSpan:6,children:e.jsx(H,{children:"표시할 데이터가 없습니다."})})}):n.map((r,$)=>e.jsxs("tr",{children:[e.jsx("td",{children:ve(r.createdAt)}),e.jsx("td",{children:r.method}),e.jsx("td",{children:e.jsx(be,{title:r.path,children:r.path})}),e.jsx("td",{children:e.jsx(ye,{"data-error":r.status>=400||void 0,children:r.status})}),e.jsx("td",{children:r.ip||"-"}),e.jsx("td",{children:r.userId||e.jsx(ue,{children:"익명"})})]},r.id??$))})]})}),e.jsxs(pe,{children:[e.jsxs(ge,{children:[e.jsx(N,{type:"button",onClick:()=>F(h-1),disabled:h<=0||t,children:"이전"}),e.jsxs(Se,{children:[h+1," / ",P||1]}),e.jsx(N,{type:"button",onClick:()=>F(h+1),disabled:h>=P-1||t,children:"다음"})]}),e.jsxs(Q,{children:["총 ",C.toLocaleString("ko-KR"),"건"]})]})]})]})}const me=y.div`
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
    vertical-align: middle;
  }
  tbody tr:nth-child(odd) td {
    background: #fcfcfd;
  }
  tbody tr:hover td {
    background: #f9fafb;
  }
`,be=y.span`
  display: inline-block;
  max-width: 320px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`,ye=y.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 54px;
  padding: 4px 8px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 12px;
  background: ${({"data-error":n})=>n?"#fee2e2":"#dcfce7"};
  color: ${({"data-error":n})=>n?"#b91c1c":"#15803d"};
  border: 1px solid
    ${({"data-error":n})=>n?"#fecaca":"#bbf7d0"};
`,N=y(xe)`
  height: 32px;
  padding: 0 12px;
  font-size: 13px;
`,Se=y.span`
  font-size: 12px;
  color: #475569;
  font-weight: 700;
`;function ve(n){return new Date(n).toLocaleString("ko-KR",{dateStyle:"medium",timeStyle:"short"})}function Pe({toastError:n}){const[t,S]=s.useState([]),[h,v]=s.useState(!1),[P,C]=s.useState(null),[g,R]=s.useState(0),[u,I]=s.useState(20),[d,A]=s.useState(0),[x,z]=s.useState(0),[o,L]=s.useState(()=>{const a=new Date;return a.setDate(a.getDate()-7),a.toISOString().slice(0,10)}),[l,T]=s.useState(()=>new Date().toISOString().slice(0,10)),[f,k]=s.useState(""),[p,F]=s.useState(""),[r,$]=s.useState("all"),[E,q]=s.useState("all"),j=s.useRef(u),m=s.useRef(p),b=s.useRef(E);s.useEffect(()=>{j.current=u},[u]),s.useEffect(()=>{m.current=p},[p]),s.useEffect(()=>{b.current=E},[E]);const c=s.useCallback(async(a,w,B,ee,G)=>{v(!0),C(null);try{const i=await fe({page:a,size:w,q:B||void 0,errorsOnly:ee==="errors",from:G.from,to:G.to});S(i.content||[]),R(i.page),I(i.size),A(i.totalPages),z(i.totalElements??i.content?.length??0)}catch(D){const i=D instanceof Error?D.message:"API 로그를 불러오지 못했습니다.";C(i),n(i)}finally{v(!1)}},[n]);s.useEffect(()=>{c(0,j.current,m.current,b.current,{from:o,to:l})},[o,l,c]);const J=s.useCallback(()=>{const a=f.trim();F(a),q(r),m.current=a,b.current=r,c(0,j.current,a,r,{from:o,to:l})},[r,o,l,c,f]),U=s.useCallback(a=>{a<0||a>=d||c(a,j.current,m.current,b.current,{from:o,to:l})},[o,l,c,d]),X=s.useCallback(a=>{I(a),j.current=a,c(0,a,m.current,b.current,{from:o,to:l})},[o,l,c]),Y=s.useMemo(()=>`${o} ~ ${l}`,[o,l]),Z=s.useMemo(()=>{if(t.length===0)return"표시할 데이터가 없습니다.";const a=t[0]?.createdAt,w=t[t.length-1]?.createdAt;return!a||!w?`${t.length.toLocaleString("ko-KR")}건 표시 중`:`${V(a)} ~ ${V(w)}`},[t]),_=s.useMemo(()=>{const a=Math.max(1,d);return`페이지 ${d===0?0:g+1} / ${a} • 총 ${x.toLocaleString("ko-KR")}건`},[g,x,d]);return{rows:t,loading:h,error:P,page:g,size:u,totalPages:d,totalElements:x,from:o,to:l,setFrom:L,setTo:T,pathInput:f,setPathInput:k,pathQuery:p,errorsFilterInput:r,setErrorsFilterInput:$,errorsFilter:E,rangeLabel:Y,displayedRange:Z,pageInfo:_,handleApplyFilters:J,handleChangeSize:X,handleChangePage:U}}function V(n){return new Date(n).toLocaleString("ko-KR",{dateStyle:"medium",timeStyle:"short"})}function Fe(){const{error:n}=te(),t=Pe({toastError:n});return e.jsx(je,{rows:t.rows,loading:t.loading,error:t.error,page:t.page,size:t.size,totalPages:t.totalPages,totalElements:t.totalElements,from:t.from,to:t.to,onChangeFrom:t.setFrom,onChangeTo:t.setTo,pathInput:t.pathInput,onChangePathInput:t.setPathInput,errorsFilterInput:t.errorsFilterInput,onChangeErrorsFilter:t.setErrorsFilterInput,pathQuery:t.pathQuery,errorsFilter:t.errorsFilter,rangeLabel:t.rangeLabel,displayedRange:t.displayedRange,pageInfo:t.pageInfo,onApplyFilters:t.handleApplyFilters,onChangeSize:t.handleChangeSize,onChangePage:t.handleChangePage})}export{Fe as default};
