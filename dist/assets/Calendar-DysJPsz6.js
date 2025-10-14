import{j as o,d as c,r as s,p as Y,u as I}from"./index-9hpupD9q.js";import{W as R,i as E,s as N,b as A,f as j}from"./dateUtils-CoPTMMCx.js";import{l as T,u as G}from"./todos-CUF4zwNa.js";import{r as z}from"./errors-C6OcbAl5.js";import{l as B}from"./counsels-lweYs0xR.js";import{a as F}from"./calendar-CC5KeZ-2.js";import{S as P}from"./UI-JuCZ2e8U.js";function H(){return o.jsx(K,{children:R.map(e=>o.jsx(V,{children:e},e))})}const K=c.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  padding: 0 2px;
  color: #111827;
  font-size: 12px;
  font-weight: 600;
  @media (min-width: 1024px) {
    padding: 0 4px;
  }
`,V=c.div`
  text-align: center;
  letter-spacing: 0.04em;
  color: #111827;
`;function W({viewDate:e,dates:a,onSelectDate:p,getEvents:y}){const x=s.useRef([]),w=s.useMemo(()=>{const r=a.findIndex(t=>E(t,new Date));return r>=0?r:0},[a]),[u,f]=s.useState(w);s.useEffect(()=>{f(w)},[w]);function h(r){const t=Math.max(0,Math.min(a.length-1,r));f(t);const n=x.current[t];n&&n.focus()}return o.jsx(O,{role:"grid","aria-label":"월간 달력",children:a.map((r,t)=>{const n=r.getMonth()===e.getMonth(),d=E(r,new Date),k=n?y(r):[],g=t;return o.jsxs(U,{ref:i=>{x.current[t]=i},tabIndex:g===u?0:-1,$dim:!n,$today:d,onClick:()=>p(r),onKeyDown:i=>{switch(i.key){case"ArrowRight":i.preventDefault(),h(g+1);break;case"ArrowLeft":i.preventDefault(),h(g-1);break;case"ArrowDown":i.preventDefault(),h(g+7);break;case"ArrowUp":i.preventDefault(),h(g-7);break;case"Home":i.preventDefault(),h(0);break;case"End":i.preventDefault(),h(a.length-1);break;case"Enter":case" ":i.preventDefault(),p(r);break}},role:"gridcell","aria-selected":g===u,children:[o.jsx(_,{$today:d,children:r.getDate()}),o.jsx(q,{children:(()=>{const i=v=>k.filter($=>$.type===v).reduce(($,C)=>$+(C.count??1),0),m=i("class"),b=i("counsel"),l=i("todo");return m+b+l===0?null:o.jsxs(J,{children:[m>0&&o.jsxs(D,{"data-variant":"class",title:`수업 ${m}건`,children:["수업 ",m,"건"]}),b>0&&o.jsxs(D,{"data-variant":"counsel",title:`상담 ${b}건`,children:["상담 ",b,"건"]}),l>0&&o.jsxs(D,{"data-variant":"todo",title:`할일 ${l}개`,children:["할일 ",l,"개"]})]})})()})]},`${r.toISOString()}-${t}`)})})}const O=c.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(5, minmax(100px, 1fr));
  gap: 6px;
  padding: 0 4px;
  height: 100%;
  min-height: 0;
  @media (min-width: 1024px) {
    grid-template-rows: repeat(5, minmax(120px, 1fr));
    gap: 8px;
    padding: 0 6px;
  }
  @media (min-width: 1536px) {
    grid-template-rows: repeat(5, minmax(135px, 1fr));
    gap: 10px;
  }
`,U=c.div`
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
  @media (min-width: 1280px) { padding: 16px; gap: 10px; }
`,_=c.div`
  font-size: 14px;
  font-weight: 700;
  color: ${e=>e.$today?"#4338ca":"#111827"};
  width: fit-content;
  padding: 2px 6px;
  border-radius: 8px;
  background: ${e=>e.$today?"#eef2ff":"transparent"};
`,q=c.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1 1 auto;
  min-height: 0;
`,J=c.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: minmax(0, auto);
  gap: 6px;
`,D=c.span`
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
`;function Q(e){const[a,p]=s.useState(()=>N(new Date)),y=s.useMemo(()=>A(a),[a]),x=s.useCallback(()=>{p(u=>new Date(u.getFullYear(),u.getMonth()-1,1))},[]),w=s.useCallback(()=>{p(u=>new Date(u.getFullYear(),u.getMonth()+1,1))},[]);return{viewDate:a,setViewDate:p,matrix:y,prevMonth:x,nextMonth:w}}function X(e){const[a,p]=s.useState({}),[y,x]=s.useState(!1),[w,u]=s.useState(null),f=s.useMemo(()=>!e||e.length===0?[]:e.map(r=>j(r)),[e]);return s.useEffect(()=>{let r=!1;const t=new AbortController;async function n(){if(!(!f||f.length===0)){x(!0),u(null);try{try{const l={};for(const v of f){const C=`/api/todos?${new URLSearchParams({dueYmd:v,status:"PENDING"}).toString()}`,M=Y(C);M.data&&(l[v]=(M.data||[]).length)}Object.keys(l).length&&!r&&p(v=>({...v,...l}))}catch{}const d=6,k=[];let g=0;async function i(){for(;g<f.length&&!r;){const l=g++,v=f[l];try{const $=await T(v,"PENDING",{signal:t.signal});k.push([v,$.length])}catch{k.push([v,0])}}}const m=Array.from({length:Math.min(d,f.length)},()=>i());await Promise.all(m);const b=k;if(r)return;p(l=>{const v={...l};for(const[$,C]of b)v[$]=C;return v})}catch(d){r||u(z(d,"할 일 정보를 불러오지 못했습니다."))}finally{r||x(!1)}}}return n(),()=>{r=!0,t.abort()}},[f]),{eventsForDate:s.useCallback(r=>{const t=j(r),n=a[t]||0;return n>0?[{type:"todo",label:`할 일 ${n}개`,count:n}]:[]},[a]),loading:y,error:w}}function Z(e){const[a,p]=s.useState({}),[y,x]=s.useState(!1),[w,u]=s.useState(null),f=s.useMemo(()=>!e||e.length===0?[]:e.map(t=>j(t)),[e]),h=s.useMemo(()=>{if(!f.length)return null;const t=[...f].sort();return{from:t[0],to:t[t.length-1]}},[f]);return s.useEffect(()=>{let t=!1;const n=new AbortController;async function d(){if(h){x(!0),u(null);try{let g=0,i=[];for(;;){const b=await B({from:h.from,to:h.to,page:g,size:200},{signal:n.signal});if(i=i.concat(b.content||[]),b.last||(b.content||[]).length===0||g>200)break;g+=1}if(t)return;const m={};for(const b of i){const l=(b.counselTime||"").slice(0,10);l&&(m[l]=(m[l]||0)+1)}p(m)}catch(k){t||u(z(k,"상담 정보를 불러오지 못했습니다."))}finally{t||x(!1)}}}return d(),()=>{t=!0,n.abort()}},[h]),{eventsForDate:s.useCallback(t=>{const n=j(t),d=a[n]||0;return d>0?[{type:"counsel",label:`상담 ${d}건`,count:d}]:[]},[a]),loading:y,error:w}}function me(){const e=I(),{viewDate:a,matrix:p,prevMonth:y,nextMonth:x,setViewDate:w}=Q(),u=`${a.getFullYear()}년 ${a.getMonth()+1}월`,{eventsForDate:f}=G({dates:p}),{eventsForDate:h}=X(p),{eventsForDate:r}=Z(p);return s.useEffect(()=>{function t(i){const m=A(i),b=m[0],l=m[m.length-1];return{from:j(b),to:j(l)}}const n=new Date(a.getFullYear(),a.getMonth()-1,1),d=new Date(a.getFullYear(),a.getMonth()+1,1),k=t(n),g=t(d);F(k.from,k.to),F(g.from,g.to)},[a]),s.useEffect(()=>{function t(n){const d=n.target?.tagName?.toLowerCase();d==="input"||d==="textarea"||n.isComposing||(n.key==="ArrowLeft"?(n.preventDefault(),y()):n.key==="ArrowRight"?(n.preventDefault(),x()):n.key.toLowerCase()==="t"&&(n.preventDefault(),w(new Date)))}return window.addEventListener("keydown",t),()=>window.removeEventListener("keydown",t)},[y,x,w]),o.jsx(ee,{children:o.jsx(te,{children:o.jsxs(ne,{children:[o.jsx(oe,{children:o.jsxs(ae,{children:[o.jsxs(L,{children:[o.jsx("h2",{children:"캘린더"}),o.jsx("p",{children:"일정을 한눈에 확인해보세요"})]}),o.jsxs(ie,{children:[o.jsx(S,{type:"button",onClick:y,"aria-label":"이전 달",children:"<"}),o.jsx(ce,{children:u}),o.jsx(S,{type:"button",onClick:x,"aria-label":"다음 달",children:">"})]}),o.jsx(re,{children:o.jsx(le,{type:"button",onClick:()=>w(new Date),children:"오늘"})})]})}),o.jsxs(se,{children:[o.jsx(H,{}),o.jsx(W,{viewDate:a,dates:p,onSelectDate:t=>e(`/calendar/${j(t)}`),getEvents:t=>t.getMonth()!==a.getMonth()?[]:[...f(t),...r(t),...h(t)]})]})]})})})}const ee=c.div`
  height: calc(100vh - 48px);
  overflow: hidden; /* 페이지 스크롤 방지 */
`,te=c.section`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0;
  background: transparent;
  border-radius: ${e=>e.theme.radii.xl};
  padding: 0;
  min-height: 0; /* allow children to shrink within viewport */
`,ne=c.div`
  width: 100%;
  max-width: 1480px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  padding: 0;
  @media (min-width: 1440px) {
    max-width: 1600px;
  }
`,oe=c.div`
  padding: 0;
`,re=c.div`
  justify-self: end;
  display: flex;
  gap: ${e=>e.theme.spacing.sm};
  @media (max-width: 768px) {
    justify-self: center;
  }
`,L=c.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  h2 {
    margin: 0;
    font-size: 26px;
    font-weight: 700;
    color: #111827;
  }
  p {
    margin: 0;
    color: #6b7280;
    font-size: 14px;
  }
`,ae=c.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: ${e=>e.theme.spacing.md};
  align-items: center;
  padding-bottom: ${e=>e.theme.spacing.sm};
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    justify-items: center;
    text-align: center;
    ${L} {
      align-items: center;
    }
  }
`,se=c(P)`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: ${e=>e.theme.spacing.lg};
  border-radius: ${e=>e.theme.radii.xl};
  gap: ${e=>e.theme.spacing.md};
  min-height: 0; /* ensure grid can size within */
  min-height: 500px;
  @media (min-width: 1280px) {
    padding: ${e=>e.theme.spacing.xl};
    min-height: 560px;
  }
`,ie=c.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${e=>e.theme.spacing.sm};
  flex-wrap: wrap;
`,ce=c.span`
  min-width: 140px;
  text-align: center;
  font-weight: 600;
  font-size: 25px;
  letter-spacing: -0.01em;
  color: #111827;
  padding: 6px 12px;
`,S=c.button`
  appearance: none;
  width: 30px;
  height: 30px;
  border: none;
  background: transparent;
  color: #111827;
  font-size: 18px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover { color: #1f2937; }
  &:active { transform: translateY(1px); }
  &:focus-visible { outline: 2px solid #111827; border-radius: 12px; outline-offset: 2px; }
`,le=c.button`
  appearance: none;
  height: 36px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid #4f46e5;
  background: transparent;
  color: #4f46e5;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
  &:hover { background: rgba(79, 70, 229, 0.08); }
  &:active { background: rgba(79, 70, 229, 0.16); transform: translateY(1px); }
  &:focus-visible { outline: 2px solid #4f46e5; border-radius: 12px; outline-offset: 2px; }
`;export{me as default};
