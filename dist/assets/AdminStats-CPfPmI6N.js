import{j as e,L as U,d as f,r as c,c as Q,a as X}from"./index-B0K7mn4q.js";import{P as Y,e as ee,f as se,g as te,d as ne,F as ae,S as re,k as ie,M as le,E as oe,C as L,a as M,b as R,p as ce,q as de,G as T,T as N,m as K,n as $,h as I,l as O}from"./AdminStyles-Chj6B07V.js";import{g as he,e as xe,l as ue}from"./admin-DSlJSHO4.js";import{l as me}from"./adminAcademies-CBKU-oZ4.js";function je({points:t,color:s,loading:i,height:l=120,unitLabel:g}){if(i)return e.jsxs(G,{children:[e.jsx(U,{}),e.jsx("span",{children:"데이터를 불러오는 중…"})]});if(t.length===0)return e.jsx(H,{children:"표시할 데이터가 없습니다."});const h=t.map(d=>d.value),j=be(h,240,l),a=ve(h,240,l),u=`spark-${s.replace("#","")}`;return e.jsxs(ge,{children:[e.jsxs("svg",{viewBox:`0 0 240 ${l}`,role:"img","aria-label":"변화 추이 그래프",children:[e.jsx("defs",{children:e.jsxs("linearGradient",{id:u,x1:"0",y1:"0",x2:"0",y2:"1",children:[e.jsx("stop",{offset:"0%",stopColor:s,stopOpacity:"0.4"}),e.jsx("stop",{offset:"100%",stopColor:s,stopOpacity:"0"})]})}),e.jsx("path",{d:j,fill:`url(#${u})`,stroke:"none"}),e.jsx("polyline",{points:a,fill:"none",stroke:s,strokeWidth:2,strokeLinejoin:"round",strokeLinecap:"round"})]}),e.jsx(fe,{children:t.map((d,o)=>e.jsx("span",{"aria-hidden":!0,children:o%Math.ceil(t.length/6||1)===0?d.label:""},d.key||o))}),g?e.jsxs(Se,{children:[g," 단위"]}):null]})}function pe({points:t,color:s,loading:i,maxTicks:l=6}){if(i)return e.jsxs(G,{children:[e.jsx(U,{}),e.jsx("span",{children:"데이터를 불러오는 중…"})]});if(t.length===0)return e.jsx(H,{children:"표시할 데이터가 없습니다."});const g=t.map(a=>a.value),h=Math.max(...g,1),j=Math.max(1,Math.ceil(t.length/l));return e.jsx(ye,{children:t.map((a,u)=>e.jsxs("div",{className:"bar-item",children:[e.jsx("div",{className:"bar",style:{height:`${a.value/h*100||2}%`,background:`linear-gradient(180deg, ${s} 0%, ${s}33 100%)`}}),e.jsx("span",{className:"tick","aria-hidden":!0,children:u%j===0?a.label:""})]},a.key||u))})}const ge=f.div`
  display: grid;
  gap: 6px;
  svg {
    width: 100%;
    height: auto;
  }
`,fe=f.div`
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #94a3b8;
`,Se=f.span`
  font-size: 12px;
  color: #94a3b8;
`,ye=f.div`
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
`,G=f.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #94a3b8;
  font-size: 13px;
`,H=f.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: #94a3b8;
  font-size: 13px;
`;function be(t,s,i){if(t.length===0)return"";const l=Math.min(...t),h=Math.max(...t)-l||1,j=t.length>1?s/(t.length-1):s,a=t.map((d,o)=>{const x=o*j,m=i-(d-l)/h*i;return`${x.toFixed(2)},${m.toFixed(2)}`}).join(" "),u=`${s.toFixed(2)},${i.toFixed(2)} 0,${i.toFixed(2)}`;return`M ${a} L ${u} Z`}function ve(t,s,i){if(t.length===0)return"";const l=Math.min(...t),h=Math.max(...t)-l||1,j=t.length>1?s/(t.length-1):s;return t.map((a,u)=>{const d=u*j,o=i-(a-l)/h*i;return`${d.toFixed(2)},${o.toFixed(2)}`}).join(" ")}function ke({overviewStats:t,loading:s,error:i,rangeDays:l,onChangeRange:g,rangeOptions:h,lastUpdatedLabel:j,fromDateStr:a,toDateStr:u,onRefresh:d,dashboardHref:o,paymentTrend:x,loginTrend:m,topPaymentAcademies:y,topUsageAcademies:b}){return e.jsxs(Y,{children:[e.jsxs(ee,{children:[e.jsxs("div",{children:[e.jsx(se,{children:"관리자 통계"}),e.jsxs(te,{children:[a," ~ ",u," · 마지막 업데이트 ",j]})]}),e.jsxs(ne,{children:[e.jsx(ae,{htmlFor:"admin-stats-range",children:"기간"}),e.jsx(re,{id:"admin-stats-range",value:l,onChange:n=>g(Number(n.target.value)),disabled:s,children:h.map(n=>e.jsxs("option",{value:n,children:["최근 ",n,"일"]},n))}),e.jsx(ie,{as:"a",href:o,children:"대시보드로 이동"}),e.jsx(le,{type:"button",onClick:d,disabled:s,children:s?"새로고침 중…":"데이터 새로고침"})]})]}),i?e.jsxs(oe,{role:"status",children:["⚠️ ",i]}):null,e.jsxs(L,{children:[e.jsx(M,{children:e.jsxs("div",{children:[e.jsx("h3",{children:"핵심 지표"}),e.jsx(R,{children:"오늘 기준 상태"})]})}),t.length>0?e.jsx(ce,{children:t.map(n=>e.jsxs("li",{children:[e.jsx("span",{className:"label",children:n.label}),e.jsx("span",{className:"value",children:n.value})]},n.label))}):e.jsx(Le,{children:Array.from({length:5}).map((n,P)=>e.jsx(de,{},P))})]}),e.jsxs(T,{children:[e.jsxs(L,{children:[e.jsxs(M,{children:[e.jsxs("div",{children:[e.jsx("h3",{children:"결제 추이"}),e.jsxs(R,{children:[l,"일 합계 ₩",x.total.toLocaleString("ko-KR")]})]}),e.jsxs(N,{children:["최대 일 매출 ₩",x.max.toLocaleString("ko-KR")]})]}),e.jsx(je,{points:x.series,color:"#0ea5e9",loading:s,unitLabel:"₩"}),e.jsx(w,{children:x.series.slice(-5).map(n=>e.jsxs(E,{children:[e.jsx("span",{className:"label",children:n.label}),e.jsxs("span",{className:"value",children:["₩",n.value.toLocaleString("ko-KR")]})]},n.key))})]}),e.jsxs(L,{children:[e.jsxs(M,{children:[e.jsxs("div",{children:[e.jsx("h3",{children:"로그인 추이"}),e.jsxs(R,{children:[l,"일 총 ",m.total.toLocaleString("ko-KR"),"회"]})]}),e.jsxs(N,{children:["최대 일 로그인 ",m.max.toLocaleString("ko-KR"),"회"]})]}),e.jsx(pe,{points:m.series,color:"#6366f1",loading:s}),e.jsx(w,{children:m.series.slice(-5).map(n=>e.jsxs(E,{children:[e.jsx("span",{className:"label",children:n.label}),e.jsxs("span",{className:"value",children:[n.value.toLocaleString("ko-KR"),"회"]})]},n.key))})]})]}),e.jsxs(T,{children:[e.jsxs(L,{children:[e.jsx(M,{children:e.jsxs("div",{children:[e.jsx("h3",{children:"상위 학원 (결제)"}),e.jsxs(R,{children:[a," ~ ",u]})]})}),e.jsx(K,{children:e.jsxs($,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"학원"}),e.jsx("th",{children:"결제건수"}),e.jsx("th",{children:"결제합계(원)"})]})}),e.jsx("tbody",{children:y.length===0?e.jsx("tr",{children:e.jsx("td",{colSpan:3,children:e.jsx(I,{children:"표시할 데이터가 없습니다."})})}):y.map(n=>e.jsxs("tr",{children:[e.jsx("td",{children:e.jsxs("div",{className:"academy",children:[e.jsx("span",{className:"name",children:n.name}),e.jsxs(O,{children:["#",n.id]})]})}),e.jsx("td",{children:n.paymentCount?.toLocaleString("ko-KR")??"0"}),e.jsxs("td",{children:["₩",Math.round((n.paymentAmountCents||0)/100).toLocaleString("ko-KR")]})]},n.id))})]})})]}),e.jsxs(L,{children:[e.jsx(M,{children:e.jsxs("div",{children:[e.jsx("h3",{children:"상위 학원 (활동량)"}),e.jsx(R,{children:"API + 로그인 횟수"})]})}),e.jsx(K,{children:e.jsxs($,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"학원"}),e.jsx("th",{children:"API"}),e.jsx("th",{children:"로그인"}),e.jsx("th",{children:"총합"})]})}),e.jsx("tbody",{children:b.length===0?e.jsx("tr",{children:e.jsx("td",{colSpan:4,children:e.jsx(I,{children:"표시할 데이터가 없습니다."})})}):b.map(n=>e.jsxs("tr",{children:[e.jsx("td",{children:e.jsxs("div",{className:"academy",children:[e.jsx("span",{className:"name",children:n.name}),e.jsxs(O,{children:["#",n.id]})]})}),e.jsx("td",{children:n.apiCalls?.toLocaleString("ko-KR")??"0"}),e.jsx("td",{children:n.logins?.toLocaleString("ko-KR")??"0"}),e.jsx("td",{children:n.usageScore?.toLocaleString("ko-KR")??"0"})]},n.id))})]})})]})]})]})}const Le=f.div`
  display: grid;
  gap: 8px;
`,w=f.div`
  display: grid;
  gap: 6px;
`,E=f.div`
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
`;function F(t,s,i,l,g){const h=new Map;i.forEach(o=>{const x=l(o);if(!x)return;const m=Re(x);h.set(m,(h.get(m)||0)+g(o))});const j=[];for(let o=t-1;o>=0;o-=1){const x=new Date(s);x.setHours(0,0,0,0),x.setDate(x.getDate()-o);const m=x.toISOString().slice(0,10),y=z(h.get(m)||0);j.push({key:m,label:Me(m),value:y})}const a=j.map(o=>o.value),u=z(a.reduce((o,x)=>o+x,0)),d=a.length>0?Math.max(...a):0;return{series:j,total:u,max:d}}function Me(t){const s=t.split("-");if(s.length<3)return t;const[,i,l]=s;return`${i}.${l}`}function Re(t){const s=new Date(t);return Number.isNaN(s.getTime())?t.slice(0,10):new Date(s.getTime()-s.getTimezoneOffset()*6e4).toISOString().slice(0,10)}function z(t){return Math.round(t*100)/100}const Ae=[7,14,30];function Ce({toastError:t}){const[s,i]=c.useState(null),[l,g]=c.useState([]),[h,j]=c.useState([]),[a,u]=c.useState([]),[d,o]=c.useState(14),[x,m]=c.useState(!1),[y,b]=c.useState(null),[n,P]=c.useState(null),A=c.useRef(!0);c.useEffect(()=>()=>{A.current=!1},[]);const S=c.useMemo(()=>new Date,[]),v=c.useMemo(()=>S.toISOString().slice(0,10),[S]),k=c.useMemo(()=>{const r=new Date(S);return r.setDate(r.getDate()-(d-1)),r.toISOString().slice(0,10)},[S,d]),D=c.useCallback(async()=>{m(!0),b(null);try{const[r,p,C,J]=await Promise.all([he(),xe({page:0,size:200,from:k,to:v}),ue({page:0,size:200,from:k,to:v}),me({page:0,size:200,from:k,to:v})]);if(!A.current)return;i(r),g(p.content||[]),j(C.content||[]),u(J.content||[]),P(new Date)}catch(r){if(!A.current)return;const p=r instanceof Error?r.message:"통계를 불러오지 못했습니다.";b(p),t(p)}finally{A.current&&m(!1)}},[k,v,t]);c.useEffect(()=>{D()},[D]);const W=c.useMemo(()=>F(d,S,l,r=>r?.createdAt,r=>(r?.amountCents||0)/100),[d,S,l]),B=c.useMemo(()=>F(d,S,h,r=>r?.createdAt,()=>1),[d,S,h]),_=c.useMemo(()=>[...a].sort((r,p)=>(p.paymentAmountCents||0)-(r.paymentAmountCents||0)).slice(0,5),[a]),q=c.useMemo(()=>[...a].map(r=>({...r,usageScore:(r.apiCalls||0)+(r.logins||0)})).sort((r,p)=>(p.usageScore||0)-(r.usageScore||0)).slice(0,5),[a]),V=c.useMemo(()=>{if(!n)return"데이터 준비 중";const r=Date.now()-n.getTime(),p=Math.floor(r/6e4);if(p<1)return"방금 전";if(p<60)return`${p}분 전`;const C=Math.floor(p/60);return C<24?`${C}시간 전`:n.toLocaleString("ko-KR",{dateStyle:"medium",timeStyle:"short"})},[n]),Z=c.useMemo(()=>s?[{label:"전체 학원 수",value:s.academies?.toLocaleString("ko-KR")??"-"},{label:"최근 30일 로그인",value:s.logins30d?.toLocaleString("ko-KR")??"-"},{label:"최근 30일 결제합계(원)",value:s.paymentsAmount30d!=null?Math.round((s.paymentsAmount30d||0)/100).toLocaleString("ko-KR"):"-"},{label:"오늘 API 호출",value:s.apiCallsToday?.toLocaleString("ko-KR")??"-"},{label:"오늘 OpenAI 호출",value:s.openaiCallsToday?.toLocaleString("ko-KR")??"-"}]:[],[s]);return{overview:s,overviewStats:Z,payments:l,logins:h,academies:a,rangeDays:d,setRangeDays:o,loading:x,error:y,lastUpdatedLabel:V,fetchStats:D,paymentTrend:W,loginTrend:B,topPaymentAcademies:_,topUsageAcademies:q,fromDateStr:k,toDateStr:v}}function Ke(){const{error:t}=Q(),s=Ce({toastError:t});return e.jsx(ke,{overviewStats:s.overviewStats,loading:s.loading,error:s.error,rangeDays:s.rangeDays,onChangeRange:i=>s.setRangeDays(i),rangeOptions:Ae,lastUpdatedLabel:s.lastUpdatedLabel,fromDateStr:s.fromDateStr,toDateStr:s.toDateStr,onRefresh:()=>s.fetchStats(),dashboardHref:X.admin,paymentTrend:s.paymentTrend,loginTrend:s.loginTrend,topPaymentAcademies:s.topPaymentAcademies,topUsageAcademies:s.topUsageAcademies})}export{Ke as default};
