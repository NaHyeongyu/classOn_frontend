import{j as n,d as c,r as i,p as I,u as N,a as R,S as Y,b as z}from"./index-DOSOOkBD.js";import{W as P,i as S,s as T,b as A,f as C}from"./dateUtils-CoPTMMCx.js";import{l as B,u as G}from"./todos-DZW5c8-r.js";import{l as W}from"./counsels-DawIxkmm.js";import{a as F}from"./calendar-D70WSNxb.js";function H(){return n.jsx(K,{children:P.map((e,o)=>n.jsx(V,{$red:o===0||o===6,children:e},e))})}const K=c.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  padding: 0 2px 8px;
  color: #94a3b8;
  font-size: 12px;
  font-weight: 600;
  @media (min-width: 1024px) {
    padding: 0 4px 10px;
  }
`,V=c.div`
  text-align: center;
  letter-spacing: 0.04em;
  color: ${e=>e.$red?"#ef4444":"#64748b"};
`;function O({viewDate:e,dates:o,onSelectDate:f,getEvents:y}){const g=i.useRef([]),b=i.useMemo(()=>{const r=o.findIndex(t=>S(t,new Date));return r>=0?r:0},[o]),[u,p]=i.useState(b);i.useEffect(()=>{p(b)},[b]);function x(r){const t=Math.max(0,Math.min(o.length-1,r));p(t);const a=g.current[t];a&&a.focus()}return n.jsx(U,{role:"grid","aria-label":"월간 달력",children:o.map((r,t)=>{const a=r.getMonth()===e.getMonth(),d=S(r,new Date),v=r.getDay(),$=a?y(r):[],m=t;return n.jsxs(_,{ref:s=>{g.current[t]=s},tabIndex:m===u?0:-1,$dim:!a,$today:d,onClick:()=>f(r),onKeyDown:s=>{switch(s.key){case"ArrowRight":s.preventDefault(),x(m+1);break;case"ArrowLeft":s.preventDefault(),x(m-1);break;case"ArrowDown":s.preventDefault(),x(m+7);break;case"ArrowUp":s.preventDefault(),x(m-7);break;case"Home":s.preventDefault(),x(0);break;case"End":s.preventDefault(),x(o.length-1);break;case"Enter":case" ":s.preventDefault(),f(r);break}},role:"gridcell","aria-selected":m===u,children:[n.jsx(q,{$red:v===0||v===6,$today:d,children:r.getDate()}),n.jsx(J,{children:(()=>{const s=D=>$.filter(k=>k.type===D).reduce((k,j)=>k+(j.count??1),0),w=s("class"),l=s("counsel"),h=s("todo");return w+l+h===0?null:n.jsxs(Q,{children:[w>0&&n.jsxs(M,{"data-variant":"class",title:`수업 ${w}건`,children:["수업 ",w,"건"]}),l>0&&n.jsxs(M,{"data-variant":"counsel",title:`상담 ${l}건`,children:["상담 ",l,"건"]}),h>0&&n.jsxs(M,{"data-variant":"todo",title:`할일 ${h}개`,children:["할일 ",h,"개"]})]})})()})]},`${r.toISOString()}-${t}`)})})}const U=c.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  /* Exactly 5 rows, each sharing height evenly regardless of content */
  grid-template-rows: repeat(5, minmax(0, 1fr));
  gap: 8px;
  padding: 0 2px;
  height: 100%;
  min-height: 0;
  @media (min-width: 1024px) {
    gap: 10px;
    padding: 0 4px;
  }
  @media (min-width: 1536px) {
    gap: 12px;
  }
`,_=c.div`
  background: ${e=>e.$dim?"#f8fafc":"#ffffff"};
  border: 1px solid ${e=>e.$today?"#c7d2fe":"#e2e8f0"};
  border-radius: 14px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow: hidden;
  min-height: 0;
  height: 100%;
  opacity: ${e=>e.$dim?.4:1};
  cursor: pointer;
  transition: border-color 0.18s ease, box-shadow 0.18s ease, transform 0.12s ease;
  box-shadow: ${e=>e.$today?"0 0 0 2px rgba(99, 102, 241, 0.18)":"0 2px 6px rgba(15, 23, 42, 0.04)"};
  &:hover { border-color: #cbd5f5; box-shadow: 0 12px 26px rgba(15, 23, 42, 0.08); transform: translateY(-2px); }
  &:focus-visible { outline: 0; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.28); border-color: #93c5fd; }
  @media (min-width: 1280px) { padding: 12px; }
`,q=c.div`
  font-size: 13px;
  font-weight: 800;
  color: ${e=>e.$today?"#4338ca":e.$red?"#ef4444":"#475569"};
  width: fit-content;
  padding: 2px 6px;
  border-radius: 8px;
  background: ${e=>e.$today?"#eef2ff":"transparent"};
`,J=c.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 2px;
  scrollbar-width: thin;
  scrollbar-color: rgba(148, 163, 184, 0.6) transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(148, 163, 184, 0.6);
    border-radius: 999px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
`,Q=c.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: minmax(0, auto);
  gap: 6px;
`,M=c.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  padding: 6px 8px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  color: #334155;
  &[data-variant='class'] { color:#5b21b6; background:#f5f3ff; border-color:#ede9fe; }
  &[data-variant='counsel'] { color:#1d4ed8; background:#eff6ff; border-color:#dbeafe; }
  &[data-variant='todo'] { color:#047857; background:#ecfdf5; border-color:#bbf7d0; }
`;function X(e){const[o,f]=i.useState(()=>T(new Date)),y=i.useMemo(()=>A(o),[o]),g=i.useCallback(()=>{f(u=>new Date(u.getFullYear(),u.getMonth()-1,1))},[]),b=i.useCallback(()=>{f(u=>new Date(u.getFullYear(),u.getMonth()+1,1))},[]);return{viewDate:o,setViewDate:f,matrix:y,prevMonth:g,nextMonth:b}}function Z(e){const[o,f]=i.useState({}),[y,g]=i.useState(!1),[b,u]=i.useState(null),p=i.useMemo(()=>!e||e.length===0?[]:e.map(r=>C(r)),[e]);return i.useEffect(()=>{let r=!1;const t=new AbortController;async function a(){if(!(!p||p.length===0)){g(!0),u(null);try{try{const l={};for(const h of p){const k=`/api/todos?${new URLSearchParams({dueYmd:h,status:"PENDING"}).toString()}`,j=I(k);j.data&&(l[h]=(j.data||[]).length)}Object.keys(l).length&&!r&&f(h=>({...h,...l}))}catch{}const d=6,v=[];let $=0;async function m(){for(;$<p.length&&!r;){const l=$++,h=p[l];try{const D=await B(h,"PENDING",{signal:t.signal});v.push([h,D.length])}catch{v.push([h,0])}}}const s=Array.from({length:Math.min(d,p.length)},()=>m());await Promise.all(s);const w=v;if(r)return;f(l=>{const h={...l};for(const[D,k]of w)h[D]=k;return h})}catch(d){r||u(d?.message||"할 일 정보를 불러오지 못했습니다.")}finally{r||g(!1)}}}return a(),()=>{r=!0,t.abort()}},[p]),{eventsForDate:i.useCallback(r=>{const t=C(r),a=o[t]||0;return a>0?[{type:"todo",label:`할 일 ${a}개`,count:a}]:[]},[o]),loading:y,error:b}}function ee(e){const[o,f]=i.useState({}),[y,g]=i.useState(!1),[b,u]=i.useState(null),p=i.useMemo(()=>!e||e.length===0?[]:e.map(t=>C(t)),[e]),x=i.useMemo(()=>{if(!p.length)return null;const t=[...p].sort();return{from:t[0],to:t[t.length-1]}},[p]);return i.useEffect(()=>{let t=!1;const a=new AbortController;async function d(){if(x){g(!0),u(null);try{let $=0,m=[];for(;;){const w=await W({from:x.from,to:x.to,page:$,size:200},{signal:a.signal});if(m=m.concat(w.content||[]),w.last||(w.content||[]).length===0||$>200)break;$+=1}if(t)return;const s={};for(const w of m){const l=(w.counselTime||"").slice(0,10);l&&(s[l]=(s[l]||0)+1)}f(s)}catch(v){t||u(v?.message||"상담 정보를 불러오지 못했습니다.")}finally{t||g(!1)}}}return d(),()=>{t=!0,a.abort()}},[x]),{eventsForDate:i.useCallback(t=>{const a=C(t),d=o[a]||0;return d>0?[{type:"counsel",label:`상담 ${d}건`,count:d}]:[]},[o]),loading:y,error:b}}function ge(){const e=N(),{viewDate:o,matrix:f,prevMonth:y,nextMonth:g,setViewDate:b}=X(),u=`${o.getFullYear()}년 ${o.getMonth()+1}월`,{eventsForDate:p}=G({dates:f}),{eventsForDate:x}=Z(f),{eventsForDate:r}=ee(f);return i.useEffect(()=>{function t(m){const s=A(m),w=s[0],l=s[s.length-1];return{from:C(w),to:C(l)}}const a=new Date(o.getFullYear(),o.getMonth()-1,1),d=new Date(o.getFullYear(),o.getMonth()+1,1),v=t(a),$=t(d);F(v.from,v.to),F($.from,$.to)},[o]),i.useEffect(()=>{function t(a){const d=a.target?.tagName?.toLowerCase();d==="input"||d==="textarea"||a.isComposing||(a.key==="ArrowLeft"?(a.preventDefault(),y()):a.key==="ArrowRight"?(a.preventDefault(),g()):a.key.toLowerCase()==="t"&&(a.preventDefault(),b(new Date)))}return window.addEventListener("keydown",t),()=>window.removeEventListener("keydown",t)},[y,g,b]),n.jsx(te,{children:n.jsx(ne,{children:n.jsxs(oe,{children:[n.jsx(re,{children:n.jsxs(R,{children:[n.jsxs("div",{children:[n.jsx("h2",{children:"캘린더"}),n.jsx("p",{children:"일정을 한눈에 확인해보세요"})]}),n.jsxs(ie,{children:[n.jsx(L,{type:"button",onClick:y,"aria-label":"이전 달",children:"‹"}),n.jsx(ce,{children:u}),n.jsx(L,{type:"button",onClick:g,"aria-label":"다음 달",children:"›"}),n.jsx(le,{type:"button",onClick:()=>b(new Date),children:"오늘"})]})]})}),n.jsxs(ae,{children:[n.jsx(H,{}),n.jsx(O,{viewDate:o,dates:f,onSelectDate:t=>e(`/calendar/${C(t)}`),getEvents:t=>t.getMonth()!==o.getMonth()?[]:[...p(t),...r(t),...x(t)]})]}),n.jsxs(se,{children:[n.jsx(E,{$variant:"class",children:"수업"}),n.jsx(E,{$variant:"counsel",children:"상담"}),n.jsx(E,{$variant:"todo",children:"할 일"})]})]})})})}const te=c.div`
  height: calc(100vh - 48px);
  overflow: hidden; /* 페이지 스크롤 방지 */
`,ne=c.section`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: ${e=>e.theme.spacing.lg};
  background: transparent;
  border-radius: ${e=>e.theme.radii.xl};
  padding: ${e=>e.theme.spacing.sm} ${e=>e.theme.spacing.xs}
    ${e=>e.theme.spacing.lg};
  min-height: 0; /* allow children to shrink within viewport */
`,oe=c.div`
  /* Center the calendar content and cap overly wide screens */
  width: 100%;
  max-width: 1360px; /* align with app content width */
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  @media (min-width: 1536px) {
    max-width: 1480px; /* match ContentInner large cap */
  }
`,re=c.div`
  padding: 0 ${e=>e.theme.spacing.xs};
  display: grid;
  gap: ${e=>e.theme.spacing.sm};
`,ae=c(Y)`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: ${e=>e.theme.spacing.lg};
  border-radius: ${e=>e.theme.radii.xl};
  gap: ${e=>e.theme.spacing.md};
  min-height: 0; /* ensure grid can size within */
  @media (min-width: 1280px) {
    padding: ${e=>e.theme.spacing.xl};
  }
`,se=c.div`
  padding: 0 ${e=>e.theme.spacing.xs};
  display: flex;
  gap: ${e=>e.theme.spacing.sm};
  flex-wrap: wrap;
`,E=c.span`
  display: inline-flex;
  align-items: center;
  font-size: ${e=>e.theme.font.size.sm};
  font-weight: 600;
  padding: ${e=>e.theme.spacing.xs} ${e=>e.theme.spacing.md};
  border-radius: 999px;
  background: ${({$variant:e})=>e==="class"?"#ede9fe":e==="counsel"?"#dbeafe":"#d1fae5"};
  color: ${({$variant:e})=>e==="class"?"#6d28d9":e==="counsel"?"#1d4ed8":"#047857"};
`,ie=c.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${e=>e.theme.spacing.sm};
  flex-wrap: wrap;
`,ce=c.span`
  min-width: 120px;
  text-align: center;
  font-weight: 700;
  font-size: 16px;
  color: ${({theme:e})=>e.colors.text};
`,L=c(z)`
  width: 40px;
  height: 40px;
  padding: 0;
  font-size: 18px;
  font-weight: 700;
`,le=c(z)`
  height: 40px;
  padding: 0 ${e=>e.theme.spacing.lg};
  font-size: ${e=>e.theme.font.size.md};
  font-weight: 700;
`;export{ge as default};
