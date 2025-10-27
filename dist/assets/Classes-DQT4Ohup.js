import{r as n,j as e,d as l,u as F,a as G,g as M}from"./index-B0K7mn4q.js";import{S as O,g as U,T as A,P as H,b as W,a as V}from"./UI-Cj3YhchZ.js";import{r as B}from"./errors-C6OcbAl5.js";import{l as E}from"./courses-DlbPyXYO.js";import{v as _}from"./pagination-B12eDNVl.js";import{f as K}from"./dateUtils-CoPTMMCx.js";function Y({value:t,onChange:r,onApply:i}){const a=t,[p,f]=n.useState(a.q),h=n.useRef(null),[d,x]=n.useState(!1),[o,u]=n.useState(!1);n.useEffect(()=>{f(a.q)},[a.q]);function g(c,m){r({...a,[c]:m})}function j(){const c=(h.current?.value??p).trim();r({...a,q:c}),i?.()}return e.jsxs(Q,{children:[e.jsxs(z,{children:[e.jsx($,{children:"상태"}),e.jsxs(J,{value:a.status,onChange:c=>g("status",c.target.value),children:[e.jsx("option",{value:"",children:"전체"}),e.jsx("option",{value:"IN_PROGRESS",children:"진행중"}),e.jsx("option",{value:"STOPPED",children:"중단"}),e.jsx("option",{value:"PENDING",children:"대기"})]})]}),e.jsxs(z,{children:[e.jsx($,{children:"검색"}),e.jsxs(X,{children:[e.jsx(Z,{ref:h,placeholder:"수업명, 코드, 설명 검색",value:p,onChange:c=>f(c.target.value),onCompositionStart:()=>x(!0),onCompositionEnd:()=>{x(!1),o&&(u(!1),j())},onKeyDown:c=>{c.key==="Enter"&&(c.preventDefault(),d?u(!0):j())}}),e.jsx(ee,{type:"button",onClick:j,children:"검색"})]})]})]})}const Q=l.div`
  display: grid;
  grid-template-columns: 0.7fr 2.3fr;
  gap: 12px;
  align-items: end;
  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`,z=l.div`
  display: grid;
  gap: 8px;
`,$=l.span`
  color: #6b7280;
  font-size: 12px;
  font-weight: 700;
`,J=l.select`
  height: 36px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 10px;
  width: 100%;
`,X=l.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
`,Z=l.input`
  height: 36px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 12px;
  width: 100%;
`,ee=l.button`
  height: 40px;
  padding: 0 16px;
  border-radius: 10px;
  border: 1px solid #111827;
  background: #111827;
  color: #fff;
  font-weight: 700;
`,v={MON:0,TUE:1,WED:2,THU:3,FRI:4,SAT:5,SUN:6};function S(t){if(!t)return"";const[r,i]=t.split(":");return`${r}:${i}`}function C(t){return{MON:"월",TUE:"화",WED:"수",THU:"목",FRI:"금",SAT:"토",SUN:"일"}[t.toUpperCase()]||t}function te(t){if(Array.isArray(t.recurrenceDays))return t.recurrenceDays.slice().sort((r,i)=>(v[r]??0)-(v[i]??0)).map(r=>C(r)).join("/");if(typeof t.recurrenceDays=="string"&&t.recurrenceDays.trim()){const r=t.recurrenceDays.split(",").map(i=>i.trim().toUpperCase()).filter(Boolean);return r.sort((i,a)=>v[i]-v[a]),r.map(i=>C(i)).join("/")}return t.schedule&&t.schedule.length>0?t.schedule.map(r=>r.dayOfWeek).filter(Boolean).map(r=>C(r)).join(", "):"-"}function se(t){if(t.startTime&&t.endTime)return`${S(t.startTime)} ~ ${S(t.endTime)}`;if(t.schedule&&t.schedule.length>0){const r=t.schedule[0];return`${S(r.startTime)} ~ ${S(r.endTime)}`}return t.courseTime||"-"}function ne(t){switch(t){case"IN_PROGRESS":return"진행중";case"PENDING":return"대기";case"STOPPED":return"중단";default:return t}}function re(t){switch(t){case"INDIVIDUAL":return"개인";case"GROUP":return"단체";default:return"단체"}}function ie({filters:t,refreshKey:r}){const i=F(),[a,p]=n.useState([]),[f,h]=n.useState(null),[d,x]=n.useState(0),[o,u]=n.useState(10),[g,j]=n.useState(0),[c,m]=n.useState(0),[b,w]=n.useState(!1);n.useEffect(()=>{x(0)},[t.status,t.q]),n.useEffect(()=>{let s=!1;async function T(){h(null),w(!0);try{const y=await E({page:d,size:o,status:t.status||void 0,q:t.q||void 0});s||(p(y.content),j(y.totalPages),m(y.totalElements))}catch(y){s||h(B(y,"수업 불러오기에 실패했습니다."))}finally{s||w(!1)}}return T(),()=>{s=!0}},[d,o,t.status,t.q,r]);const P=n.useMemo(()=>a.map((s,T)=>({seq:Math.max(0,c-d*o-T),id:s.id,title:s.title,code:s.code,courseType:re(s.courseType),rawStatus:s.status,statusText:ne(s.status),days:te(s),time:se(s),enrolled:s.enrolledCount??"-",next:s.nextClassDate||"-"})),[a,d,o,c]);function k(s){s>=0&&s<g&&x(s)}return e.jsx(O,{children:e.jsxs(he,{children:[e.jsx(oe,{children:e.jsxs("div",{children:[e.jsx("strong",{children:"수업 목록"}),e.jsx(ae,{children:b?"불러오는 중...":`총 ${c}개의 수업이 조회되었습니다.`}),f&&e.jsx(le,{children:f})]})}),e.jsx(U,{children:e.jsxs(xe,{children:[e.jsxs("colgroup",{children:[e.jsx("col",{style:{width:"7%"}}),"    ",e.jsx("col",{style:{width:"28%"}}),"   ",e.jsx("col",{style:{width:"10%"}}),"   ",e.jsx("col",{style:{width:"12%"}}),"   ",e.jsx("col",{style:{width:"18%"}}),"   ",e.jsx("col",{style:{width:"9%"}}),"    ",e.jsx("col",{style:{width:"10%"}}),"   ",e.jsx("col",{style:{width:"6%"}}),"    "]}),e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"번호"}),e.jsx("th",{children:"수업명"}),e.jsx("th",{children:"유형"}),e.jsx("th",{children:"요일"}),e.jsx("th",{children:"시간"}),e.jsx("th",{children:"수강인원"}),e.jsx("th",{children:"다음 수업"}),e.jsx("th",{children:"상태"})]})}),e.jsx("tbody",{children:P.map(s=>e.jsxs("tr",{onClick:()=>i(`/classes/${s.id}`),"data-clickable":"true",children:[e.jsx("td",{children:s.seq}),e.jsx("td",{children:e.jsx(pe,{children:s.title})}),e.jsx("td",{children:s.courseType}),e.jsx("td",{children:s.days}),e.jsx("td",{children:s.time}),e.jsx("td",{children:s.enrolled}),e.jsx("td",{children:s.next}),e.jsx("td",{children:e.jsx(ce,{"data-type":s.rawStatus,children:s.statusText})})]},s.id))})]})}),e.jsxs(de,{children:[e.jsx(D,{onClick:()=>k(d-1),disabled:d===0,children:"이전"}),_(d,g,7).map(s=>e.jsx(D,{"data-active":s===d,onClick:()=>k(s),children:s+1},s)),e.jsx(D,{onClick:()=>k(d+1),disabled:d>=g-1,children:"다음"}),e.jsxs(ue,{children:[e.jsx("span",{children:"페이지당"}),e.jsxs("select",{value:o,onChange:s=>{x(0),u(Number(s.target.value))},children:[e.jsx("option",{value:10,children:"10"}),e.jsx("option",{value:20,children:"20"}),e.jsx("option",{value:50,children:"50"})]})]})]})]})})}const oe=l.div` display:flex; align-items:center; justify-content:flex-start; `,ae=l.div` color:#6b7280; font-size:12px; margin-top:4px; `,le=l.div` color:#b91c1c; font-size:12px; `,ce=l.span`
  padding: 2px 8px; border-radius: 9999px; font-size: 12px; font-weight: 800;
  &[data-type='IN_PROGRESS'] { background:#dcfce7; color:#16a34a; }
  &[data-type='PENDING'] { background:#f3e8ff; color:#7c3aed; }
  &[data-type='STOPPED'] { background:#e5e7eb; color:#374151; }
`,de=l.div` display:flex; gap:6px; justify-content:center; padding-top:4px; `,D=l.button`
  min-width:28px; height:28px; padding:0 8px; border-radius:8px; border:1px solid #e5e7eb; background:#fff; font-size:12px; color:#111827;
  &[data-active='true'] { background:#111827; color:#fff; border-color:#111827; }
  &:disabled { opacity:.5; cursor:not-allowed; }
`,ue=l.div` display:inline-flex; align-items:center; gap:6px; margin-left:12px; color:#6b7280; font-size:12px; select{ height:28px; border:1px solid #e5e7eb; border-radius:8px; background:#fff; padding:0 8px; }`,he=l.div` position: relative; `,xe=l(A)`
  table-layout: fixed;
  width: 100%;
  thead th {
    background: #f8fafc;
    color: #334155;
    font-weight: 800;
    text-align: center;
  }
  thead th, tbody td {
    vertical-align: middle;
    padding: 12px;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    /* vertical separators between columns */
    border-right: 1px solid #f1f5f9;
  }
  thead th:last-child, tbody td:last-child { border-right: none; }
  tbody td { font-size: 13.5px; color: #0f172a; }
  tbody tr[data-clickable='true'] { cursor: pointer; }
  tbody tr[data-clickable='true']:active td { background: ${({theme:t})=>t.colors.surfaceAlt}; }
`,pe=l.span`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  white-space: normal;
  line-height: 1.4;
  max-height: calc(1.4em * 2);
`;function fe(){const[t,r]=n.useState(!0),[i,a]=n.useState(null),[p,f]=n.useState(0),[h,d]=n.useState(0),[x,o]=n.useState(0),[u,g]=n.useState(0),j=n.useMemo(()=>K(new Date),[]);return n.useEffect(()=>{const c=()=>g(m=>m+1);return window.addEventListener("courses:refresh",c),()=>window.removeEventListener("courses:refresh",c)},[]),n.useEffect(()=>{let c=!1;async function m(){r(!0),a(null);try{const[b,w,P]=await Promise.all([E({size:1}),E({status:"IN_PROGRESS",size:1}),E({onYmd:j,size:1})]);c||(f(b.totalElements),d(w.totalElements),o(P.totalElements))}catch(b){c||a(B(b,"수업 요약 정보를 불러오지 못했습니다."))}finally{c||r(!1)}}return m(),()=>{c=!0}},[j,u]),e.jsxs(ge,{children:[e.jsxs(R,{children:[e.jsxs(I,{children:[e.jsx(N,{children:"총 수업 수"}),e.jsx(q,{"aria-hidden":!0,children:me})]}),e.jsx(L,{children:t?"…":`${p}개`}),i&&e.jsx(je,{children:i})]}),e.jsxs(R,{children:[e.jsxs(I,{children:[e.jsx(N,{children:"진행중 수업"}),e.jsx(q,{"aria-hidden":!0,children:ye})]}),e.jsx(L,{children:t?"…":`${h}개`})]}),e.jsxs(R,{children:[e.jsxs(I,{children:[e.jsx(N,{children:"오늘 수업"}),e.jsx(q,{"aria-hidden":!0,children:be})]}),e.jsx(L,{children:t?"…":`${x}개`})]})]})}const ge=l.div`
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;
`,R=l.article`
  background: #fff; border: 1px solid #e5e7eb; border-radius: 14px; padding: 14px; display: flex; flex-direction: column; gap: 8px;
`,I=l.div` display: flex; align-items: center; justify-content: space-between; `,N=l.h4` margin: 0; font-size: 14px; color: #6b7280; font-weight: 600; `,q=l.span` width: 34px; height: 34px; border-radius: 10px; display: grid; place-items: center; background: #eef2ff; color: #4f46e5; `,L=l.div` font-size: 28px; font-weight: 800; color: #111827; letter-spacing: -0.02em; `,je=l.div` color: #b91c1c; font-size: 12px; `,me=e.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M4 19.5A2.5 2.5 0 0 1 6.5 17H20"}),e.jsx("path",{d:"M4 4v15.5A2.5 2.5 0 0 0 6.5 22H20"}),e.jsx("path",{d:"M20 22V6a2 2 0 0 0-2-2H6"})]}),ye=e.jsx("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polygon",{points:"5 3 19 12 5 21 5 3"})}),be=e.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("rect",{x:"3",y:"4",width:"18",height:"18",rx:"2"}),e.jsx("line",{x1:"16",y1:"2",x2:"16",y2:"6"}),e.jsx("line",{x1:"8",y1:"2",x2:"8",y2:"6"}),e.jsx("line",{x1:"3",y1:"10",x2:"21",y2:"10"})]});function we({filters:t,onChangeFilters:r,onApplyFilters:i,refreshKey:a}){return e.jsxs(H,{children:[e.jsxs(W,{children:[e.jsxs("div",{children:[e.jsx("h2",{children:"수업 관리"}),e.jsx("p",{children:"개설된 수업을 조회하고 빠르게 검색하세요."})]}),e.jsx("div",{style:{display:"inline-flex",alignItems:"center",gap:12},children:e.jsx(V,{to:G.classesNew,children:"수업 추가"})})]}),e.jsx(fe,{}),e.jsx(O,{children:e.jsx(Y,{value:t,onChange:r,onApply:i})}),e.jsx(ie,{filters:t,refreshKey:a})]})}function ve(t){return t==="IN_PROGRESS"||t==="STOPPED"||t==="PENDING"?t:""}function Se(){const[t,r]=M(),i=n.useMemo(()=>({status:ve(t.get("status")),q:t.get("q")||""}),[t]),[a,p]=n.useState(i),[f,h]=n.useState(0);n.useEffect(()=>{p(o=>o.status===i.status&&o.q===i.q?o:i)},[i]),n.useEffect(()=>{function o(){h(u=>u+1)}return window.addEventListener("courses:refresh",o),()=>window.removeEventListener("courses:refresh",o)},[]),n.useEffect(()=>{const o=new URLSearchParams;a.status&&o.set("status",a.status);const u=a.q.trim();u&&o.set("q",u),o.toString()!==t.toString()&&r(o,{replace:!0})},[a,t,r]);const d=n.useCallback(()=>{h(o=>o+1)},[]),x=n.useCallback(o=>{p(o)},[]);return{filters:a,refreshKey:f,applyFilters:d,updateFilters:x}}function Re(){const{filters:t,refreshKey:r,applyFilters:i,updateFilters:a}=Se();return e.jsx(we,{filters:t,refreshKey:r,onChangeFilters:a,onApplyFilters:i})}export{Re as default};
