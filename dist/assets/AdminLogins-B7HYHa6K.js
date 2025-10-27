import{j as e,d as E,r as n,c as B}from"./index-B0K7mn4q.js";import{P as G,e as Q,H as q,f as N,g as W,d as V,F as I,I as Y,M as J,E as O,C as U,a as X,b as Z,T as _,h as R,i as ee,j as T,S as te,k as se}from"./AdminStyles-Chj6B07V.js";import{l as ne}from"./admin-DSlJSHO4.js";function re({rows:a,loading:t,error:p,page:c,size:j,totalPages:b,totalElements:m,searchInput:h,searchQuery:S,onChangeSearchInput:d,onSearch:u,onChangeSize:l,onChangePage:y,rangeLabel:g,pageInfo:C}){return e.jsxs(G,{children:[e.jsxs(Q,{children:[e.jsxs(q,{children:[e.jsx(N,{children:"로그인 기록"}),e.jsx(W,{children:g})]}),e.jsxs(V,{children:[e.jsx(I,{htmlFor:"admin-login-search",children:"아이디 검색"}),e.jsx(Y,{id:"admin-login-search",placeholder:"아이디 검색",value:h,onChange:s=>d(s.target.value),onKeyDown:s=>{s.key==="Enter"&&(s.preventDefault(),u())}}),e.jsx(J,{type:"button",onClick:u,disabled:t,children:"검색"})]})]}),p?e.jsxs(O,{role:"status",children:["⚠️ ",p]}):null,e.jsxs(U,{children:[e.jsxs(X,{children:[e.jsxs("div",{children:[e.jsx("h3",{children:"로그 목록"}),e.jsx(Z,{children:C})]}),e.jsxs(_,{children:["검색어: ",S||"없음"," · 총"," ",m.toLocaleString("ko-KR"),"건"]})]}),e.jsx(ae,{children:e.jsxs("table",{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"시간"}),e.jsx("th",{children:"아이디"}),e.jsx("th",{children:"IP"}),e.jsx("th",{children:"성공"})]})}),e.jsx("tbody",{children:t?e.jsx("tr",{children:e.jsx("td",{colSpan:4,children:e.jsx(R,{children:e.jsx("span",{children:"로그를 불러오는 중…"})})})}):a.length===0?e.jsx("tr",{children:e.jsx("td",{colSpan:4,children:e.jsx(R,{children:"표시할 데이터가 없습니다."})})}):a.map((s,L)=>e.jsxs("tr",{children:[e.jsx("td",{children:le(s.createdAt)}),e.jsx("td",{children:s.username}),e.jsx("td",{children:s.ip||"-"}),e.jsx("td",{children:s.success?"Y":"N"})]},s.id??L))})]})}),e.jsxs(ee,{children:[e.jsxs(T,{children:[e.jsx(w,{type:"button",onClick:()=>y(c-1),disabled:c<=0||t,children:"이전"}),e.jsxs(oe,{children:[c+1," / ",b||1]}),e.jsx(w,{type:"button",onClick:()=>y(c+1),disabled:c>=b-1||t,children:"다음"})]}),e.jsxs(T,{children:[e.jsx(I,{htmlFor:"admin-login-size",children:"페이지 크기"}),e.jsx(te,{id:"admin-login-size",value:j,onChange:s=>l(Number(s.target.value)),children:[20,50,100].map(s=>e.jsxs("option",{value:s,children:[s,"개씩"]},s))})]})]})]})]})}const ae=E.div`
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
`,w=E(se)`
  height: 32px;
  padding: 0 12px;
  font-size: 13px;
`,oe=E.span`
  font-size: 12px;
  color: #475569;
  font-weight: 700;
`;function le(a){return new Date(a).toLocaleString("ko-KR",{dateStyle:"medium",timeStyle:"short"})}function ie({toastError:a}){const[t,p]=n.useState([]),[c,j]=n.useState(!1),[b,m]=n.useState(null),[h,S]=n.useState(0),[d,u]=n.useState(20),[l,y]=n.useState(0),[g,C]=n.useState(0),[s,L]=n.useState(""),[P,$]=n.useState(""),f=n.useRef(d),x=n.useRef(P);n.useEffect(()=>{f.current=d},[d]),n.useEffect(()=>{x.current=P},[P]);const i=n.useCallback(async(r,k,z)=>{j(!0),m(null);try{const o=await ne({page:r,size:k,q:z||void 0});p(o.content||[]),S(o.page),u(o.size),y(o.totalPages),C(o.totalElements??o.content?.length??0)}catch(v){const o=v instanceof Error?v.message:"로그인 기록을 불러오지 못했습니다.";m(o),a(o)}finally{j(!1)}},[a]);n.useEffect(()=>{i(0,f.current,x.current)},[i]);const A=n.useCallback(()=>{const r=s.trim();$(r),x.current=r,i(0,f.current,r)},[i,s]),D=n.useCallback(r=>{u(r),f.current=r,i(0,r,x.current)},[i]),K=n.useCallback(r=>{r<0||r>=l||i(r,f.current,x.current)},[i,l]),F=n.useMemo(()=>{if(t.length===0)return"표시할 데이터가 없습니다.";const r=t[0]?.createdAt,k=t[t.length-1]?.createdAt;return!r||!k?`${t.length.toLocaleString("ko-KR")}건 표시 중`:`${M(r)} ~ ${M(k)}`},[t]),H=n.useMemo(()=>{const r=Math.max(1,l);return`페이지 ${l===0?0:h+1} / ${r} • 총 ${g.toLocaleString("ko-KR")}건`},[h,g,l]);return{rows:t,loading:c,error:b,page:h,size:d,totalPages:l,totalElements:g,searchInput:s,setSearchInput:L,searchQuery:P,handleSearch:A,handleChangeSize:D,handleChangePage:K,rangeLabel:F,pageInfo:H}}function M(a){return new Date(a).toLocaleString("ko-KR",{dateStyle:"medium",timeStyle:"short"})}function ue(){const{error:a}=B(),t=ie({toastError:a});return e.jsx(re,{rows:t.rows,loading:t.loading,error:t.error,page:t.page,size:t.size,totalPages:t.totalPages,totalElements:t.totalElements,searchInput:t.searchInput,searchQuery:t.searchQuery,onChangeSearchInput:t.setSearchInput,onSearch:t.handleSearch,onChangeSize:t.handleChangeSize,onChangePage:t.handleChangePage,rangeLabel:t.rangeLabel,pageInfo:t.pageInfo})}export{ue as default};
