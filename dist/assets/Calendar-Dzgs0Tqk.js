import{j as n,d as l,r as a,p as A,u as I,a as N,S as P,b as L}from"./index-CJzRppoi.js";import{W as R,i as E,s as Y,b as z,f as k}from"./dateUtils-CoPTMMCx.js";import{l as T,u as B}from"./todos-BkvxqzYj.js";import{l as G}from"./counsels-5uIYAHf5.js";import{a as F}from"./calendar-CCmF4Wm4.js";function W(){return n.jsx(H,{children:R.map((e,o)=>n.jsx(K,{$red:o===0||o===6,children:e},e))})}const H=l.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  padding: 0 4px 10px;
  color: #94a3b8;
  font-size: 12px;
  font-weight: 600;
`,K=l.div`
  text-align: center;
  letter-spacing: 0.04em;
  color: ${e=>e.$red?"#ef4444":"#64748b"};
`;function V({viewDate:e,dates:o,onSelectDate:d,getEvents:v}){const g=a.useRef([]),w=a.useMemo(()=>{const r=o.findIndex(t=>E(t,new Date));return r>=0?r:0},[o]),[f,p]=a.useState(w);a.useEffect(()=>{p(w)},[w]);function x(r){const t=Math.max(0,Math.min(o.length-1,r));p(t);const s=g.current[t];s&&s.focus()}return n.jsx(O,{role:"grid","aria-label":"월간 달력",children:o.map((r,t)=>{const s=r.getMonth()===e.getMonth(),u=E(r,new Date),b=r.getDay(),y=s?v(r):[],m=t;return n.jsxs(U,{ref:i=>{g.current[t]=i},tabIndex:m===f?0:-1,$dim:!s,$today:u,onClick:()=>d(r),onKeyDown:i=>{switch(i.key){case"ArrowRight":i.preventDefault(),x(m+1);break;case"ArrowLeft":i.preventDefault(),x(m-1);break;case"ArrowDown":i.preventDefault(),x(m+7);break;case"ArrowUp":i.preventDefault(),x(m-7);break;case"Home":i.preventDefault(),x(0);break;case"End":i.preventDefault(),x(o.length-1);break;case"Enter":case" ":i.preventDefault(),d(r);break}},role:"gridcell","aria-selected":m===f,children:[n.jsx(X,{$red:b===0||b===6,$today:u,children:r.getDate()}),n.jsx(_,{children:(()=>{const $=y.slice(0,3),h=y.length-$.length;return n.jsxs(n.Fragment,{children:[$.map((c,D)=>n.jsx(q,{$type:c.type,title:`[${c.type}] ${c.label}
Enter로 날짜 이동 후 상세 보기`,"aria-label":`${c.type} 이벤트: ${c.label}`,children:c.label},D)),h>0?n.jsxs(J,{children:["+",h]}):null]})})()})]},`${r.toISOString()}-${t}`)})})}const O=l.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  /* Exactly 5 rows, each sharing height evenly regardless of content */
  grid-template-rows: repeat(5, minmax(0, 1fr));
  gap: 10px;
  padding: 0 4px;
  height: 100%;
  min-height: 0;
`,U=l.div`
  background: ${e=>e.$dim?"#f8fafc":"#ffffff"};
  border: 1px solid ${e=>e.$today?"#c7d2fe":"#e2e8f0"};
  border-radius: 14px;
  padding: 12px;
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
`,X=l.div`
  font-size: 13px;
  font-weight: 800;
  color: ${e=>e.$today?"#4338ca":e.$red?"#ef4444":"#475569"};
  width: fit-content;
  padding: 2px 6px;
  border-radius: 8px;
  background: ${e=>e.$today?"#eef2ff":"transparent"};
`,_=l.div`
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
`,q=l.div`
  font-size: 12px;
  font-weight: 600;
  padding: 6px 8px;
  border-radius: 8px;
  width: fit-content;
  color: #5b21b6;
  background: #f5f3ff;
  border: 1px solid #ede9fe;
  ${e=>e.$type==="counsel"?"color:#1d4ed8; background:#eff6ff; border-color:#dbeafe;":e.$type==="todo"?"color:#047857; background:#ecfdf5; border-color:#bbf7d0;":""}
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`,J=l.span`
  font-size: 11px;
  font-weight: 600;
  padding: 4px 6px;
  border-radius: 8px;
  background: #e2e8f0;
  color: #475569;
  width: fit-content;
`;function Q(e){const[o,d]=a.useState(()=>Y(new Date)),v=a.useMemo(()=>z(o),[o]),g=a.useCallback(()=>{d(f=>new Date(f.getFullYear(),f.getMonth()-1,1))},[]),w=a.useCallback(()=>{d(f=>new Date(f.getFullYear(),f.getMonth()+1,1))},[]);return{viewDate:o,setViewDate:d,matrix:v,prevMonth:g,nextMonth:w}}function Z(e){const[o,d]=a.useState({}),[v,g]=a.useState(!1),[w,f]=a.useState(null),p=a.useMemo(()=>!e||e.length===0?[]:e.map(r=>k(r)),[e]);return a.useEffect(()=>{let r=!1;const t=new AbortController;async function s(){if(!(!p||p.length===0)){g(!0),f(null);try{try{const h={};for(const c of p){const j=`/api/todos?${new URLSearchParams({dueYmd:c,status:"PENDING"}).toString()}`,M=A(j);M.data&&(h[c]=(M.data||[]).length)}Object.keys(h).length&&!r&&d(c=>({...c,...h}))}catch{}const u=6,b=[];let y=0;async function m(){for(;y<p.length&&!r;){const h=y++,c=p[h];try{const D=await T(c,"PENDING",{signal:t.signal});b.push([c,D.length])}catch{b.push([c,0])}}}const i=Array.from({length:Math.min(u,p.length)},()=>m());await Promise.all(i);const $=b;if(r)return;d(h=>{const c={...h};for(const[D,j]of $)c[D]=j;return c})}catch(u){r||f(u?.message||"할 일 정보를 불러오지 못했습니다.")}finally{r||g(!1)}}}return s(),()=>{r=!0,t.abort()}},[p]),{eventsForDate:a.useCallback(r=>{const t=k(r),s=o[t]||0;return s>0?[{type:"todo",label:`할 일 ${s}개`}]:[]},[o]),loading:v,error:w}}function ee(e){const[o,d]=a.useState({}),[v,g]=a.useState(!1),[w,f]=a.useState(null),p=a.useMemo(()=>!e||e.length===0?[]:e.map(t=>k(t)),[e]),x=a.useMemo(()=>{if(!p.length)return null;const t=[...p].sort();return{from:t[0],to:t[t.length-1]}},[p]);return a.useEffect(()=>{let t=!1;const s=new AbortController;async function u(){if(x){g(!0),f(null);try{let y=0,m=[];for(;;){const $=await G({from:x.from,to:x.to,page:y,size:200},{signal:s.signal});if(m=m.concat($.content||[]),$.last||($.content||[]).length===0||y>200)break;y+=1}if(t)return;const i={};for(const $ of m){const h=($.counselTime||"").slice(0,10);h&&(i[h]=(i[h]||0)+1)}d(i)}catch(b){t||f(b?.message||"상담 정보를 불러오지 못했습니다.")}finally{t||g(!1)}}}return u(),()=>{t=!0,s.abort()}},[x]),{eventsForDate:a.useCallback(t=>{const s=k(t),u=o[s]||0;return u>0?[{type:"counsel",label:`상담 ${u}개`}]:[]},[o]),loading:v,error:w}}function ge(){const e=I(),{viewDate:o,matrix:d,prevMonth:v,nextMonth:g,setViewDate:w}=Q(),f=`${o.getFullYear()}년 ${o.getMonth()+1}월`,{eventsForDate:p}=B({dates:d}),{eventsForDate:x}=Z(d),{eventsForDate:r}=ee(d);return a.useEffect(()=>{function t(m){const i=z(m),$=i[0],h=i[i.length-1];return{from:k($),to:k(h)}}const s=new Date(o.getFullYear(),o.getMonth()-1,1),u=new Date(o.getFullYear(),o.getMonth()+1,1),b=t(s),y=t(u);F(b.from,b.to),F(y.from,y.to)},[o]),a.useEffect(()=>{function t(s){const u=s.target?.tagName?.toLowerCase();u==="input"||u==="textarea"||s.isComposing||(s.key==="ArrowLeft"?(s.preventDefault(),v()):s.key==="ArrowRight"?(s.preventDefault(),g()):s.key.toLowerCase()==="t"&&(s.preventDefault(),w(new Date)))}return window.addEventListener("keydown",t),()=>window.removeEventListener("keydown",t)},[v,g,w]),n.jsx(te,{children:n.jsx(ne,{children:n.jsxs(oe,{children:[n.jsx(re,{children:n.jsxs(N,{children:[n.jsxs("div",{children:[n.jsx("h2",{children:"캘린더"}),n.jsx("p",{children:"일정을 한눈에 확인해보세요"})]}),n.jsxs(ie,{children:[n.jsx(S,{type:"button",onClick:v,"aria-label":"이전 달",children:"‹"}),n.jsx(le,{children:f}),n.jsx(S,{type:"button",onClick:g,"aria-label":"다음 달",children:"›"}),n.jsx(ce,{type:"button",onClick:()=>w(new Date),children:"오늘"})]})]})}),n.jsxs(se,{children:[n.jsx(W,{}),n.jsx(V,{viewDate:o,dates:d,onSelectDate:t=>e(`/calendar/${k(t)}`),getEvents:t=>t.getMonth()!==o.getMonth()?[]:[...p(t),...r(t),...x(t)]})]}),n.jsxs(ae,{children:[n.jsx(C,{$variant:"class",children:"수업"}),n.jsx(C,{$variant:"counsel",children:"상담"}),n.jsx(C,{$variant:"todo",children:"할 일"})]})]})})})}const te=l.div`
  height: calc(100vh - 48px);
  overflow: hidden; /* 페이지 스크롤 방지 */
`,ne=l.section`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: ${e=>e.theme.spacing.lg};
  background: transparent;
  border-radius: ${e=>e.theme.radii.xl};
  padding: ${e=>e.theme.spacing.sm} ${e=>e.theme.spacing.xs}
    ${e=>e.theme.spacing.lg};
  min-height: 0; /* allow children to shrink within viewport */
`,oe=l.div`
  /* Center the calendar content and cap overly wide screens */
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
`,re=l.div`
  padding: 0 ${e=>e.theme.spacing.xs};
  display: grid;
  gap: ${e=>e.theme.spacing.sm};
`,se=l(P)`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: ${e=>e.theme.spacing.xl};
  border-radius: ${e=>e.theme.radii.xl};
  gap: ${e=>e.theme.spacing.md};
  min-height: 0; /* ensure grid can size within */
`,ae=l.div`
  padding: 0 ${e=>e.theme.spacing.xs};
  display: flex;
  gap: ${e=>e.theme.spacing.sm};
  flex-wrap: wrap;
`,C=l.span`
  display: inline-flex;
  align-items: center;
  font-size: ${e=>e.theme.font.size.sm};
  font-weight: 600;
  padding: ${e=>e.theme.spacing.xs} ${e=>e.theme.spacing.md};
  border-radius: 999px;
  background: ${({$variant:e})=>e==="class"?"#ede9fe":e==="counsel"?"#dbeafe":"#d1fae5"};
  color: ${({$variant:e})=>e==="class"?"#6d28d9":e==="counsel"?"#1d4ed8":"#047857"};
`,ie=l.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${e=>e.theme.spacing.sm};
  flex-wrap: wrap;
`,le=l.span`
  min-width: 120px;
  text-align: center;
  font-weight: 700;
  font-size: 16px;
  color: ${({theme:e})=>e.colors.text};
`,S=l(L)`
  width: 34px;
  height: 34px;
  padding: 0;
  font-size: 18px;
  font-weight: 700;
`,ce=l(L)`
  height: 34px;
  padding: 0 ${e=>e.theme.spacing.md};
  font-size: ${e=>e.theme.font.size.md};
  font-weight: 700;
`;export{ge as default};
