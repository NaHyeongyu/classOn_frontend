import{j as e,L as H,d as g,k as V,r as a,M as X}from"./index-_dJHzZeb.js";import{P as Y,a as ee,b as se,c as te,T as ne,F as ae,S as re,m as ie,M as le,E as oe,C as b,d as v,e as k,p as ce,q as de,G as K,f as I,h as E,i as O,j as F,o as z}from"./AdminStyles-CZuHR3TS.js";import{g as he,e as xe,l as ue}from"./admin-C3PkB2Fo.js";import{l as me}from"./adminAcademies-D1wq-gq9.js";function je({points:t,color:n,loading:o,height:c=120,unitLabel:p}){if(o)return e.jsxs(U,{children:[e.jsx(H,{}),e.jsx("span",{children:"데이터를 불러오는 중…"})]});if(t.length===0)return e.jsx(_,{children:"표시할 데이터가 없습니다."});const h=t.map(i=>i.value),u=be(h,240,c),r=ve(h,240,c),m=`spark-${n.replace("#","")}`;return e.jsxs(ge,{children:[e.jsxs("svg",{viewBox:`0 0 240 ${c}`,role:"img","aria-label":"변화 추이 그래프",children:[e.jsx("defs",{children:e.jsxs("linearGradient",{id:m,x1:"0",y1:"0",x2:"0",y2:"1",children:[e.jsx("stop",{offset:"0%",stopColor:n,stopOpacity:"0.4"}),e.jsx("stop",{offset:"100%",stopColor:n,stopOpacity:"0"})]})}),e.jsx("path",{d:u,fill:`url(#${m})`,stroke:"none"}),e.jsx("polyline",{points:r,fill:"none",stroke:n,strokeWidth:2,strokeLinejoin:"round",strokeLinecap:"round"})]}),e.jsx(fe,{children:t.map((i,l)=>e.jsx("span",{"aria-hidden":!0,children:l%Math.ceil(t.length/6||1)===0?i.label:""},i.key||l))}),p?e.jsxs(ye,{children:[p," 단위"]}):null]})}function pe({points:t,color:n,loading:o,maxTicks:c=6}){if(o)return e.jsxs(U,{children:[e.jsx(H,{}),e.jsx("span",{children:"데이터를 불러오는 중…"})]});if(t.length===0)return e.jsx(_,{children:"표시할 데이터가 없습니다."});const p=t.map(r=>r.value),h=Math.max(...p,1),u=Math.max(1,Math.ceil(t.length/c));return e.jsx(Se,{children:t.map((r,m)=>e.jsxs("div",{className:"bar-item",children:[e.jsx("div",{className:"bar",style:{height:`${r.value/h*100||2}%`,background:`linear-gradient(180deg, ${n} 0%, ${n}33 100%)`}}),e.jsx("span",{className:"tick","aria-hidden":!0,children:m%u===0?r.label:""})]},r.key||m))})}const ge=g.div`
  display: grid;
  gap: 6px;
  svg {
    width: 100%;
    height: auto;
  }
`,fe=g.div`
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #94a3b8;
`,ye=g.span`
  font-size: 12px;
  color: #94a3b8;
`,Se=g.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(0, 1fr);
  align-items: end;
  gap: 6px;
  height: 120px;
  .bar-item {
    display: grid;
    gap: 4px;
    justify-items: center;
  }
  .bar {
    width: 100%;
    border-radius: 6px 6px 0 0;
    min-height: 2px;
  }
  .tick {
    font-size: 10px;
    color: #94a3b8;
  }
`,U=g.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #94a3b8;
  font-size: 13px;
`,_=g.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: #94a3b8;
  font-size: 13px;
`;function be(t,n,o){if(t.length===0)return"";const c=Math.min(...t),h=Math.max(...t)-c||1,u=t.length>1?n/(t.length-1):n,r=t.map((i,l)=>{const d=l*u,j=o-(i-c)/h*o;return`${d.toFixed(2)},${j.toFixed(2)}`}).join(" "),m=`${n.toFixed(2)},${o.toFixed(2)} 0,${o.toFixed(2)}`;return`M ${r} L ${m} Z`}function ve(t,n,o){if(t.length===0)return"";const c=Math.min(...t),h=Math.max(...t)-c||1,u=t.length>1?n/(t.length-1):n;return t.map((r,m)=>{const i=m*u,l=o-(r-c)/h*o;return`${i.toFixed(2)},${l.toFixed(2)}`}).join(" ")}function w(t,n,o,c,p){const h=new Map;o.forEach(l=>{const d=c(l);if(!d)return;const j=Le(d);h.set(j,(h.get(j)||0)+p(l))});const u=[];for(let l=t-1;l>=0;l-=1){const d=new Date(n);d.setHours(0,0,0,0),d.setDate(d.getDate()-l);const j=d.toISOString().slice(0,10),L=G(h.get(j)||0);u.push({key:j,label:ke(j),value:L})}const r=u.map(l=>l.value),m=G(r.reduce((l,d)=>l+d,0)),i=r.length>0?Math.max(...r):0;return{series:u,total:m,max:i}}function ke(t){const n=t.split("-");if(n.length<3)return t;const[,o,c]=n;return`${o}.${c}`}function Le(t){const n=new Date(t);return Number.isNaN(n.getTime())?t.slice(0,10):new Date(n.getTime()-n.getTimezoneOffset()*6e4).toISOString().slice(0,10)}function G(t){return Math.round(t*100)/100}const Me=[7,14,30];function De(){const{error:t}=V(),[n,o]=a.useState(null),[c,p]=a.useState([]),[h,u]=a.useState([]),[r,m]=a.useState([]),[i,l]=a.useState(14),[d,j]=a.useState(!1),[L,D]=a.useState(null),[M,q]=a.useState(null),R=a.useRef(!0);a.useEffect(()=>()=>{R.current=!1},[]);const f=a.useMemo(()=>new Date,[]),y=a.useMemo(()=>f.toISOString().slice(0,10),[f]),S=a.useMemo(()=>{const s=new Date(f);return s.setDate(s.getDate()-(i-1)),s.toISOString().slice(0,10)},[f,i]),P=a.useCallback(async()=>{j(!0),D(null);try{const[s,x,A,Q]=await Promise.all([he(),xe({page:0,size:200,from:S,to:y}),ue({page:0,size:200,from:S,to:y}),me({page:0,size:200,from:S,to:y})]);if(!R.current)return;o(s),p(x.content||[]),u(A.content||[]),m(Q.content||[]),q(new Date)}catch(s){if(!R.current)return;const x=s instanceof Error?s.message:"통계를 불러오지 못했습니다.";D(x),t(x)}finally{R.current&&j(!1)}},[S,y,t]);a.useEffect(()=>{P()},[P]);const T=a.useMemo(()=>w(i,f,c,s=>s?.createdAt,s=>(s?.amountCents||0)/100),[i,f,c]),C=a.useMemo(()=>w(i,f,h,s=>s?.createdAt,()=>1),[i,f,h]),N=a.useMemo(()=>[...r].sort((s,x)=>(x.paymentAmountCents||0)-(s.paymentAmountCents||0)).slice(0,5),[r]),$=a.useMemo(()=>[...r].map(s=>({...s,usageScore:(s.apiCalls||0)+(s.logins||0)})).sort((s,x)=>(x.usageScore||0)-(s.usageScore||0)).slice(0,5),[r]),Z=a.useMemo(()=>{if(!M)return"데이터 준비 중";const s=Date.now()-M.getTime(),x=Math.floor(s/6e4);if(x<1)return"방금 전";if(x<60)return`${x}분 전`;const A=Math.floor(x/60);return A<24?`${A}시간 전`:M.toLocaleString("ko-KR",{dateStyle:"medium",timeStyle:"short"})},[M]),J=a.useMemo(()=>n?[{label:"전체 학원 수",value:n.academies?.toLocaleString("ko-KR")??"-"},{label:"최근 30일 로그인",value:n.logins30d?.toLocaleString("ko-KR")??"-"},{label:"최근 30일 결제합계(원)",value:n.paymentsAmount30d!=null?Math.round((n.paymentsAmount30d||0)/100).toLocaleString("ko-KR"):"-"},{label:"오늘 API 호출",value:n.apiCallsToday?.toLocaleString("ko-KR")??"-"},{label:"오늘 OpenAI 호출",value:n.openaiCallsToday?.toLocaleString("ko-KR")??"-"}]:[],[n]);return e.jsxs(Y,{children:[e.jsxs(ee,{children:[e.jsxs("div",{children:[e.jsx(se,{children:"관리자 통계"}),e.jsxs(te,{children:[S," ~ ",y," · 마지막 업데이트 ",Z]})]}),e.jsxs(ne,{children:[e.jsx(ae,{htmlFor:"admin-stats-range",children:"기간"}),e.jsx(re,{id:"admin-stats-range",value:i,onChange:s=>l(Number(s.target.value)),disabled:d,children:Me.map(s=>e.jsxs("option",{value:s,children:["최근 ",s,"일"]},s))}),e.jsx(ie,{as:"a",href:X.admin,children:"대시보드로 이동"}),e.jsx(le,{type:"button",onClick:()=>P(),disabled:d,children:d?"새로고침 중…":"데이터 새로고침"})]})]}),L?e.jsxs(oe,{role:"status",children:["⚠️ ",L]}):null,e.jsxs(b,{children:[e.jsx(v,{children:e.jsxs("div",{children:[e.jsx("h3",{children:"핵심 지표"}),e.jsx(k,{children:"오늘 기준 상태"})]})}),n?e.jsx(ce,{children:J.map(s=>e.jsxs("li",{children:[e.jsx("span",{className:"label",children:s.label}),e.jsx("span",{className:"value",children:s.value})]},s.label))}):e.jsx(Re,{children:Array.from({length:5}).map((s,x)=>e.jsx(de,{$height:16},x))})]}),e.jsxs(K,{children:[e.jsxs(b,{children:[e.jsxs(v,{children:[e.jsxs("div",{children:[e.jsx("h3",{children:"결제 추이"}),e.jsxs(k,{children:[i,"일 합계 ₩",T.total.toLocaleString("ko-KR")]})]}),e.jsxs(I,{children:["최대 일 매출 ₩",T.max.toLocaleString("ko-KR")]})]}),e.jsx(je,{points:T.series,color:"#0ea5e9",loading:d,unitLabel:"₩"}),e.jsx(W,{children:T.series.slice(-5).map(s=>e.jsxs(B,{children:[e.jsx("span",{className:"label",children:s.label}),e.jsxs("span",{className:"value",children:["₩",s.value.toLocaleString("ko-KR")]})]},s.key))})]}),e.jsxs(b,{children:[e.jsxs(v,{children:[e.jsxs("div",{children:[e.jsx("h3",{children:"로그인 추이"}),e.jsxs(k,{children:[i,"일 총 ",C.total.toLocaleString("ko-KR"),"회"]})]}),e.jsxs(I,{children:[" 최대 일 로그인 ",C.max.toLocaleString("ko-KR"),"회"]})]}),e.jsx(pe,{points:C.series,color:"#6366f1",loading:d}),e.jsx(W,{children:C.series.slice(-5).map(s=>e.jsxs(B,{children:[e.jsx("span",{className:"label",children:s.label}),e.jsxs("span",{className:"value",children:[s.value.toLocaleString("ko-KR"),"회"]})]},s.key))})]})]}),e.jsxs(K,{children:[e.jsxs(b,{children:[e.jsx(v,{children:e.jsxs("div",{children:[e.jsx("h3",{children:"상위 학원 (결제)"}),e.jsxs(k,{children:[S," ~ ",y]})]})}),e.jsx(E,{children:e.jsxs(O,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"학원"}),e.jsx("th",{children:"결제건수"}),e.jsx("th",{children:"결제합계(원)"})]})}),e.jsx("tbody",{children:N.length===0?e.jsx("tr",{children:e.jsx("td",{colSpan:3,children:e.jsx(F,{children:"표시할 데이터가 없습니다."})})}):N.map(s=>e.jsxs("tr",{children:[e.jsx("td",{children:e.jsxs("div",{className:"academy",children:[e.jsx("span",{className:"name",children:s.name}),e.jsxs(z,{children:["#",s.id]})]})}),e.jsx("td",{children:s.paymentCount?.toLocaleString("ko-KR")??"0"}),e.jsxs("td",{children:["₩",Math.round((s.paymentAmountCents||0)/100).toLocaleString("ko-KR")]})]},s.id))})]})})]}),e.jsxs(b,{children:[e.jsx(v,{children:e.jsxs("div",{children:[e.jsx("h3",{children:"상위 학원 (활동량)"}),e.jsx(k,{children:"API + 로그인 횟수"})]})}),e.jsx(E,{children:e.jsxs(O,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"학원"}),e.jsx("th",{children:"API"}),e.jsx("th",{children:"로그인"}),e.jsx("th",{children:"총합"})]})}),e.jsx("tbody",{children:$.length===0?e.jsx("tr",{children:e.jsx("td",{colSpan:4,children:e.jsx(F,{children:"표시할 데이터가 없습니다."})})}):$.map(s=>e.jsxs("tr",{children:[e.jsx("td",{children:e.jsxs("div",{className:"academy",children:[e.jsx("span",{className:"name",children:s.name}),e.jsxs(z,{children:["#",s.id]})]})}),e.jsx("td",{children:s.apiCalls?.toLocaleString("ko-KR")??"0"}),e.jsx("td",{children:s.logins?.toLocaleString("ko-KR")??"0"}),e.jsx("td",{children:s.usageScore?.toLocaleString("ko-KR")??"0"})]},s.id))})]})})]})]})]})}const Re=g.div`
  display: grid;
  gap: 8px;
`,W=g.div`
  display: grid;
  gap: 6px;
`,B=g.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  .label {
    color: #94a3b8;
    font-weight: 700;
  }
  .value {
    color: #0f172a;
    font-weight: 800;
  }
`;export{De as default};
