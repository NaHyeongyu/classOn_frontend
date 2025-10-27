import{j as n,d as p,r as i,p as N,u as R}from"./index-B0K7mn4q.js";import{W as T,i as E,s as P,b as A,f as k}from"./dateUtils-CoPTMMCx.js";import{S as Y}from"./UI-Cj3YhchZ.js";import{l as z,u as G}from"./todos-DjBL3ZpI.js";import{r as L}from"./errors-C6OcbAl5.js";import{l as B}from"./counsels-CKa17QDL.js";import{a as F}from"./calendar-CvBZyv8u.js";function V(){return n.jsx(H,{children:T.map(e=>n.jsx(K,{children:e},e))})}const H=p.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  padding: 0 2px;
  color: #111827;
  font-size: 12px;
  font-weight: 600;
  @media (min-width: 1024px) {
    padding: 0 4px;
  }
`,K=p.div`
  text-align: center;
  letter-spacing: 0.04em;
  color: #111827;
`;function W({viewDate:e,dates:t,onSelectDate:c,getEvents:b}){const g=i.useRef([]),m=i.useMemo(()=>{const r=t.findIndex(o=>E(o,new Date));return r>=0?r:0},[t]),[l,d]=i.useState(m);i.useEffect(()=>{d(m)},[m]);function y(r){const o=Math.max(0,Math.min(t.length-1,r));d(o);const x=g.current[o];x&&x.focus()}return n.jsx(O,{role:"grid","aria-label":"월간 달력",children:t.map((r,o)=>{const x=r.getMonth()===e.getMonth(),a=E(r,new Date),f=x?b(r):[],h=o;return n.jsxs(U,{ref:s=>{g.current[o]=s},tabIndex:h===l?0:-1,$dim:!x,$today:a,onClick:()=>c(r),onKeyDown:s=>{switch(s.key){case"ArrowRight":s.preventDefault(),y(h+1);break;case"ArrowLeft":s.preventDefault(),y(h-1);break;case"ArrowDown":s.preventDefault(),y(h+7);break;case"ArrowUp":s.preventDefault(),y(h-7);break;case"Home":s.preventDefault(),y(0);break;case"End":s.preventDefault(),y(t.length-1);break;case"Enter":case" ":s.preventDefault(),c(r);break}},role:"gridcell","aria-selected":h===l,children:[n.jsx(_,{$today:a,children:r.getDate()}),n.jsx(q,{children:(()=>{const s=w=>f.filter(D=>D.type===w).reduce((D,C)=>D+(C.count??1),0),$=s("class"),v=s("counsel"),u=s("todo");return $+v+u===0?null:n.jsxs(J,{children:[$>0&&n.jsxs(j,{"data-variant":"class",title:`수업 ${$}건`,children:["수업 ",$,"건"]}),v>0&&n.jsxs(j,{"data-variant":"counsel",title:`상담 ${v}건`,children:["상담 ",v,"건"]}),u>0&&n.jsxs(j,{"data-variant":"todo",title:`할일 ${u}개`,children:["할일 ",u,"개"]})]})})()})]},`${r.toISOString()}-${o}`)})})}const O=p.div`
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
`,U=p.div`
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
`,_=p.div`
  font-size: 14px;
  font-weight: 700;
  color: ${e=>e.$today?"#4338ca":"#111827"};
  width: fit-content;
  padding: 2px 6px;
  border-radius: 8px;
  background: ${e=>e.$today?"#eef2ff":"transparent"};
`,q=p.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1 1 auto;
  min-height: 0;
`,J=p.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: minmax(0, auto);
  gap: 6px;
`,j=p.span`
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
`;function Q({label:e,viewDate:t,dates:c,onPrevMonth:b,onNextMonth:g,onToday:m,onSelectDate:l,getEvents:d}){return n.jsx(X,{children:n.jsx(Z,{children:n.jsxs(ee,{children:[n.jsx(te,{children:n.jsxs(oe,{children:[n.jsxs(I,{children:[n.jsx("h2",{children:"캘린더"}),n.jsx("p",{children:"일정을 한눈에 확인해보세요"})]}),n.jsxs(ae,{children:[n.jsx(S,{type:"button",onClick:b,"aria-label":"이전 달",children:"<"}),n.jsx(se,{children:e}),n.jsx(S,{type:"button",onClick:g,"aria-label":"다음 달",children:">"})]}),n.jsx(ne,{children:n.jsx(ie,{type:"button",onClick:m,children:"오늘"})})]})}),n.jsxs(re,{children:[n.jsx(V,{}),n.jsx(W,{viewDate:t,dates:c,onSelectDate:l,getEvents:d})]})]})})})}const X=p.div`
  height: calc(100vh - 48px);
  overflow: hidden;
`,Z=p.section`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0;
  background: transparent;
  border-radius: ${e=>e.theme.radii.xl};
  padding: 0;
  min-height: 0;
`,ee=p.div`
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
`,te=p.div`
  padding: 0;
`,ne=p.div`
  justify-self: end;
  display: flex;
  gap: ${e=>e.theme.spacing.sm};
  @media (max-width: 768px) {
    justify-self: center;
  }
`,I=p.div`
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
`,oe=p.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: ${e=>e.theme.spacing.md};
  align-items: center;
  padding-bottom: ${e=>e.theme.spacing.sm};
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    justify-items: center;
    text-align: center;
    ${I} {
      align-items: center;
    }
  }
`,re=p(Y)`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: ${e=>e.theme.spacing.lg};
  border-radius: ${e=>e.theme.radii.xl};
  gap: ${e=>e.theme.spacing.md};
  min-height: 0;
  min-height: 500px;
  @media (min-width: 1280px) {
    padding: ${e=>e.theme.spacing.xl};
    min-height: 560px;
  }
`,ae=p.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${e=>e.theme.spacing.sm};
  flex-wrap: wrap;
`,se=p.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${e=>e.theme.radii.lg};
  padding: 0 16px;
  height: 36px;
  background: ${e=>e.theme.colors.primarySurface};
  color: ${e=>e.theme.colors.primary};
  font-weight: 700;
`,S=p.button`
  border: none;
  width: 34px;
  height: 34px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  font-weight: 700;
  cursor: pointer;
  background: ${e=>e.theme.colors.surface};
  border: 1px solid ${e=>e.theme.colors.border};
  transition:
    background 0.18s ease,
    color 0.18s ease,
    transform 0.18s ease;
  &:hover {
    background: ${e=>e.theme.colors.primarySurface};
    color: ${e=>e.theme.colors.primary};
  }
`,ie=p.button`
  padding: 0 16px;
  height: 34px;
  border-radius: 12px;
  border: 1px solid ${e=>e.theme.colors.border};
  background: ${e=>e.theme.colors.surface};
  color: ${e=>e.theme.colors.text};
  cursor: pointer;
  font-weight: 700;
  transition:
    background 0.18s ease,
    color 0.18s ease,
    transform 0.18s ease;
  &:hover {
    background: ${e=>e.theme.colors.primarySurface};
    color: ${e=>e.theme.colors.primary};
  }
`;function ce(e){const[t,c]=i.useState(()=>P(new Date)),b=i.useMemo(()=>A(t),[t]),g=i.useCallback(()=>{c(l=>new Date(l.getFullYear(),l.getMonth()-1,1))},[]),m=i.useCallback(()=>{c(l=>new Date(l.getFullYear(),l.getMonth()+1,1))},[]);return{viewDate:t,setViewDate:c,matrix:b,prevMonth:g,nextMonth:m}}function le(e){const[t,c]=i.useState({}),[b,g]=i.useState(!1),[m,l]=i.useState(null),d=i.useMemo(()=>!e||e.length===0?[]:e.map(r=>k(r)),[e]);return i.useEffect(()=>{let r=!1;const o=new AbortController;async function x(){if(!(!d||d.length===0)){g(!0),l(null);try{try{const u={};for(const w of d){const C=`/api/todos?${new URLSearchParams({dueYmd:w,status:"PENDING"}).toString()}`,M=N(C);M.data&&(u[w]=(M.data||[]).length)}Object.keys(u).length&&!r&&c(w=>({...w,...u}))}catch{}const a=6,f=[];let h=0;async function s(){for(;h<d.length&&!r;){const u=h++,w=d[u];try{const D=await z(w,"PENDING",{signal:o.signal});f.push([w,D.length])}catch{f.push([w,0])}}}const $=Array.from({length:Math.min(a,d.length)},()=>s());await Promise.all($);const v=f;if(r)return;c(u=>{const w={...u};for(const[D,C]of v)w[D]=C;return w})}catch(a){r||l(L(a,"할 일 정보를 불러오지 못했습니다."))}finally{r||g(!1)}}}return x(),()=>{r=!0,o.abort()}},[d]),{eventsForDate:i.useCallback(r=>{const o=k(r),x=t[o]||0;return x>0?[{type:"todo",label:`할 일 ${x}개`,count:x}]:[]},[t]),loading:b,error:m}}function de(e){const[t,c]=i.useState({}),[b,g]=i.useState(!1),[m,l]=i.useState(null),d=i.useMemo(()=>!e||e.length===0?[]:e.map(o=>k(o)),[e]),y=i.useMemo(()=>{if(!d.length)return null;const o=[...d].sort();return{from:o[0],to:o[o.length-1]}},[d]);return i.useEffect(()=>{let o=!1;const x=new AbortController;async function a(){if(y){g(!0),l(null);try{let h=0,s=[];for(;;){const v=await B({from:y.from,to:y.to,page:h,size:200},{signal:x.signal});if(s=s.concat(v.content||[]),v.last||(v.content||[]).length===0||h>200)break;h+=1}if(o)return;const $={};for(const v of s){const u=(v.counselTime||"").slice(0,10);u&&($[u]=($[u]||0)+1)}c($)}catch(f){o||l(L(f,"상담 정보를 불러오지 못했습니다."))}finally{o||g(!1)}}}return a(),()=>{o=!0,x.abort()}},[y]),{eventsForDate:i.useCallback(o=>{const x=k(o),a=t[x]||0;return a>0?[{type:"counsel",label:`상담 ${a}건`,count:a}]:[]},[t]),loading:b,error:m}}function ue(){const e=R(),{viewDate:t,matrix:c,prevMonth:b,nextMonth:g,setViewDate:m}=ce(),l=`${t.getFullYear()}년 ${t.getMonth()+1}월`,{eventsForDate:d}=G({dates:c}),{eventsForDate:y}=le(c),{eventsForDate:r}=de(c);return i.useEffect(()=>{function a(v){const u=A(v),w=u[0],D=u[u.length-1];return{from:k(w),to:k(D)}}const f=new Date(t.getFullYear(),t.getMonth()-1,1),h=new Date(t.getFullYear(),t.getMonth()+1,1),s=a(f),$=a(h);F(s.from,s.to),F($.from,$.to)},[t]),i.useEffect(()=>{function a(f){const h=f.target?.tagName?.toLowerCase();h==="input"||h==="textarea"||f.isComposing||(f.key==="ArrowLeft"?(f.preventDefault(),b()):f.key==="ArrowRight"?(f.preventDefault(),g()):f.key.toLowerCase()==="t"&&(f.preventDefault(),m(new Date)))}return window.addEventListener("keydown",a),()=>window.removeEventListener("keydown",a)},[b,g,m]),{viewDate:t,matrix:c,label:l,prevMonth:b,nextMonth:g,setViewDate:m,openDate:a=>{e(`/calendar/${k(a)}`)},getEventsForDate:a=>a.getMonth()!==t.getMonth()?[]:[...d(a),...r(a),...y(a)]}}function we(){const{label:e,viewDate:t,matrix:c,prevMonth:b,nextMonth:g,setViewDate:m,openDate:l,getEventsForDate:d}=ue();return n.jsx(Q,{label:e,viewDate:t,dates:c,onPrevMonth:b,onNextMonth:g,onToday:()=>m(new Date),onSelectDate:l,getEvents:d})}export{we as default};
