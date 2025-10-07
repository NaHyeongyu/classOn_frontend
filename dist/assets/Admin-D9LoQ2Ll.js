import{u as je,K as be,k as he,r as n,n as ye,j as e,M as O,S as E,t as M,d as a,l as Se,v as ke,L as ve}from"./index-DuqOyKVg.js";import{g as Ce,a as we,b as Le,l as Ae}from"./admin-BlxoAirN.js";import{l as ue}from"./adminAcademies-D1SptId0.js";import{a as Re,d as ze}from"./format-Do6vjlY3.js";function Ze(){const x=je(),{admin:g,logout:o}=be(),{success:P,error:S}=he(),[h,N]=n.useState(null),[F,c]=n.useState([]),[$,v]=n.useState([]),[G,r]=n.useState(!1),[D,Q]=n.useState(null),[j,B]=n.useState(null),[T,Y]=n.useState(()=>{const s=new Date;return s.setDate(s.getDate()-30),s.toISOString().slice(0,10)}),[z,J]=n.useState(()=>new Date().toISOString().slice(0,10)),[K,U]=n.useState(null),b=n.useRef(!0);n.useEffect(()=>()=>{b.current=!1},[]);const w=n.useCallback(async s=>{if(!b.current)return!1;r(!0),Q(null);try{const[i,y,te]=await Promise.all([Ce(),we(),Le()]);let Z=i;if(!i||i.academies==null)try{const ne=await ue({page:0,size:1});Z={...i||{},academies:ne.totalElements}}catch{}return b.current?(N(Z),c(y),v(te),B(new Date),s?.silent||P("대시보드 데이터를 새로고침했습니다."),!0):!1}catch(i){if(!b.current)return!1;const y=i instanceof Error?i.message:"대시보드 데이터를 불러오지 못했습니다.";return Q(y),S(y),!1}finally{b.current&&r(!1)}},[P,S]);n.useEffect(()=>{w({silent:!0})},[w]),n.useEffect(()=>{let s=!1;async function i(){try{const y=await Ae({from:T,to:z,page:0,size:1});!s&&b.current&&U(y.totalElements)}catch{!s&&b.current&&U(null)}}return i(),()=>{s=!0}},[T,z]);const f=n.useMemo(()=>[{label:"전체 학원 수",value:h?.academies??"—"},{label:"최근 30일 로그인",value:h?.logins30d??"—"},{label:"최근 30일 결제합계(원)",value:h?.paymentsAmount30d!=null?Math.round((h.paymentsAmount30d||0)/100).toLocaleString("ko-KR"):"—"},{label:"오늘 API 호출",value:h?.apiCallsToday??"—"},{label:"오늘 OpenAI 호출",value:h?.openaiCallsToday??"—"}],[h]),ee=n.useMemo(()=>{if(!j)return null;const s=Date.now()-j.getTime(),i=Math.floor(s/6e4);if(i<1)return"방금 전";if(i<60)return`${i}분 전`;const y=Math.floor(i/60);return y<24?`${y}시간 전`:j.toLocaleString("ko-KR",{dateStyle:"medium",timeStyle:"short"})},[j]),X=G&&!j&&!D,k=G&&!!j,L=n.useCallback(()=>{try{window.dispatchEvent(new CustomEvent("calendar:classes-refresh",{detail:{}}))}catch{}},[]),A=n.useCallback(()=>{ye(["/api/students","/api/courses","/api/calendar/classes","/api/calendar/classes-range","/api/dashboard/summary","/api/dashboard/attendance-today","/api/marketing/"]),L(),P("API 캐시를 초기화했습니다.")},[P,L]),I=n.useCallback(()=>{w()},[w]);return e.jsxs(Ke,{children:[e.jsxs(Ie,{children:[e.jsxs("div",{className:"info",children:[e.jsx("h1",{children:"관리자 대시보드"}),e.jsx("p",{children:"운영 현황을 빠르게 확인하고 도구를 실행하세요."}),e.jsxs(Ee,{children:[e.jsx("span",{className:"chip",children:"업데이트"}),e.jsx("span",{className:"value",title:j?j.toLocaleString("ko-KR",{dateStyle:"medium",timeStyle:"short"}):void 0,children:j?ee:"데이터 준비 중"}),k&&e.jsx(ie,{"aria-hidden":!0})]})]}),e.jsxs("div",{className:"actions",children:[g?e.jsx(p,{as:"button",onClick:()=>o(),children:"로그아웃"}):e.jsx(p,{as:"button",onClick:()=>x(O.admin+"/login"),children:"관리자 로그인"}),e.jsx(ge,{type:"button",onClick:A,children:"캐시 초기화"}),e.jsx(p,{as:"button",onClick:I,disabled:k,children:k?e.jsxs(e.Fragment,{children:[e.jsx(ie,{"aria-hidden":!0}),e.jsx("span",{children:"갱신 중…"})]}):"데이터 새로고침"})]})]}),g?e.jsxs(de,{children:[e.jsx("span",{className:"pill",children:"로그인"}),e.jsxs("span",{className:"who",children:[g.username,g.role?` (${g.role})`:""]})]}):e.jsxs(de,{children:[e.jsx("span",{className:"pill warn",children:"주의"}),e.jsx("span",{className:"who",children:"관리자 로그인이 없으므로 일부 기능이 제한될 수 있습니다."})]}),D&&e.jsxs(Me,{role:"status",children:[e.jsx("span",{className:"label",children:"데이터 오류"}),e.jsx("span",{className:"message",children:D}),e.jsx(p,{as:"button",type:"button",onClick:I,disabled:k,children:"다시 시도"})]}),e.jsxs(Pe,{children:[e.jsxs(E,{children:[e.jsx(M,{children:"요약"}),e.jsx($e,{children:f.map((s,i)=>e.jsx(De,{"data-variant":i%3+1,"data-loading":X||void 0,children:X?e.jsxs(e.Fragment,{children:[e.jsx(ce,{}),e.jsx(ce,{$size:"lg"})]}):e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"label",children:s.label}),e.jsx("span",{className:"value",children:s.value})]})},i))})]}),e.jsxs(E,{children:[e.jsx(M,{children:"빠른 작업"}),e.jsxs(Oe,{children:[e.jsx("li",{children:e.jsx(p,{type:"button",onClick:L,children:"캘린더 강제 새로고침"})}),e.jsx("li",{children:e.jsx(p,{type:"button",onClick:A,children:"API 캐시 전체 무효화"})}),e.jsx("li",{children:e.jsx(p,{as:"a",href:O.admin+"/logins",children:"로그인 기록 보기"})}),e.jsx("li",{children:e.jsx(p,{as:"a",href:O.admin+"/api-logs",children:"API 로그 보기"})}),e.jsx("li",{children:e.jsx(p,{as:"a",href:O.admin+"/openai-logs",children:"OpenAI 로그 보기"})}),e.jsx("li",{children:e.jsx(p,{as:"a",href:O.admin+"/payments",children:"결제 기록 보기"})}),!1]})]}),e.jsxs(E,{children:[e.jsx(M,{children:"운영 데이터(학원별)"}),e.jsx(qe,{from:T,to:z})]}),e.jsxs(Ne,{children:[e.jsxs(E,{children:[e.jsx(M,{children:"학원 기본정보"}),h?.academy?e.jsxs(Fe,{children:[e.jsxs("li",{children:[e.jsx("span",{className:"k",children:"학원명"}),e.jsx("span",{className:"v",children:h.academy.name})]}),e.jsxs("li",{children:[e.jsx("span",{className:"k",children:"ID"}),e.jsx("span",{className:"v",children:h.academy.id})]})]}):e.jsx(_,{children:"관리자 계정에 학원 연결이 없습니다."})]}),e.jsxs(E,{children:[e.jsx(M,{children:"로그인 기록(최근)"}),e.jsx(oe,{children:e.jsxs(le,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"시간"}),e.jsx("th",{children:"아이디"}),e.jsx("th",{children:"IP"}),e.jsx("th",{children:"성공"})]})}),e.jsxs("tbody",{children:[F.map((s,i)=>e.jsxs("tr",{children:[e.jsx("td",{children:new Date(s.createdAt).toLocaleString("ko-KR",{dateStyle:"medium",timeStyle:"short"})}),e.jsx("td",{children:s.username}),e.jsx("td",{children:s.ip||"-"}),e.jsx("td",{children:s.success?"Y":"N"})]},s.id||i)),F.length===0&&e.jsx("tr",{children:e.jsx("td",{colSpan:4,children:e.jsx(_,{children:"표시할 데이터가 없습니다."})})})]})]})})]})]}),e.jsxs(E,{children:[e.jsx(M,{children:"결제 기록(최근)"}),e.jsx(oe,{children:e.jsxs(le,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"시간"}),e.jsx("th",{children:"금액"}),e.jsx("th",{children:"통화"}),e.jsx("th",{children:"상태"}),e.jsx("th",{children:"비고"})]})}),e.jsxs("tbody",{children:[$.map((s,i)=>e.jsxs("tr",{children:[e.jsx("td",{children:new Date(s.createdAt).toLocaleString("ko-KR",{dateStyle:"medium",timeStyle:"short"})}),e.jsx("td",{children:(s.amountCents/100).toLocaleString("ko-KR")}),e.jsx("td",{children:s.currency}),e.jsx("td",{children:s.status}),e.jsx("td",{children:s.description||"-"})]},s.id||i)),$.length===0&&e.jsx("tr",{children:e.jsx("td",{colSpan:5,children:e.jsx(_,{children:"표시할 데이터가 없습니다."})})})]})]})})]}),e.jsxs(E,{children:[e.jsx(M,{children:"범위 선택"}),e.jsxs("div",{style:{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"},children:[e.jsx("span",{className:"label",style:{color:"#6b7280",fontSize:12,fontWeight:700},children:"기간"}),e.jsx(re,{type:"date",lang:"ko-KR",value:T,onChange:s=>Y(s.target.value)}),e.jsx("span",{children:"~"}),e.jsx(re,{type:"date",lang:"ko-KR",value:z,onChange:s=>J(s.target.value)}),K!=null&&e.jsxs("span",{style:{color:"#334155",fontSize:12},children:["선택 기간 로그인 수: ",e.jsx("b",{children:K.toLocaleString("ko-KR")})]})]}),e.jsx(_,{children:"아래 학원 목록의 통계 범위가 위 기간에 맞춰 적용됩니다."})]})]})]})}const Ke=a.div` display:grid; gap:14px; `,Ie=a.header`
  display:flex; align-items:center; justify-content:space-between; padding:16px; border:1px solid #e5e7eb; border-radius:14px; background: linear-gradient(180deg, #f9fafb 0%, #ffffff 80%);
  .info { display:grid; gap:4px; }
  .info h1 { margin:0; font-size:20px; color:#0f172a; }
  .info p { margin:0; color:#6b7280; }
  .actions { display:inline-flex; gap:8px; }
`,Ee=a.div`
  display:inline-flex; align-items:center; gap:8px; margin-top:4px; font-size:12px; color:#64748b;
  .chip { background:#e0f2fe; color:#0369a1; border-radius:999px; padding:2px 8px; font-weight:700; letter-spacing:.02em; }
  .value { font-weight:700; color:#0f172a; }
`,ie=a(ve)`
  width:16px;
  height:16px;
  flex-shrink:0;
`,de=a.div`
  display:flex; gap:10px; align-items:center; color:#475569; font-size:12px;
  .pill { background:#111827; color:#fff; border-radius:999px; padding:4px 8px; font-weight:800; letter-spacing:.02em; }
  .pill.warn { background:#b91c1c; }
  .who { color:#334155; }
`,Me=a.div`
  display:flex; gap:12px; align-items:center; border:1px solid #fecaca; background:#fee2e2; color:#b91c1c; padding:12px 16px; border-radius:12px; font-size:13px; font-weight:600;
  .label { font-weight:800; letter-spacing:.02em; }
  .message { flex:1; color:#7f1d1d; }
  button { margin-left:auto; }
`,Pe=a.div`
  display:grid; gap:16px;
`,Ne=a.div`
  display:grid; gap:16px;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
`,$e=a.div` display:grid; gap:12px; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); `,De=a.div`
  position:relative; border:1px solid #e5e7eb; border-radius:12px; padding:14px; display:grid; gap:6px; background:#fff; overflow:hidden;
  &:before{ content:''; position:absolute; inset:auto -20% 0 -20%; height:40%; background:var(--kpi-bg,#eef2ff); filter:blur(20px); }
  &[data-variant='1']{ --kpi-bg:#e0e7ff; }
  &[data-variant='2']{ --kpi-bg:#dcfce7; }
  &[data-variant='3']{ --kpi-bg:#fee2e2; }
  &[data-loading]{ background:#f8fafc; }
  &[data-loading]:before{ opacity:0; }
  .label { color:#6b7280; font-size:12px; font-weight:700; }
  .value { color:#0f172a; font-size:18px; font-weight:800; }
`,Te=ke`
  0% { background-position: 100% 0; }
  100% { background-position: 0 0; }
`,ce=a.span`
  display:block;
  width:60%;
  height:${({$size:x})=>x==="lg"?"20px":"12px"};
  border-radius:999px;
  background:linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 50%, #f1f5f9 100%);
  background-size:200% 100%;
  animation:${Te} 1.2s ease-in-out infinite;
`,Oe=a.ul`
  list-style:none; padding:0; margin:0; display:grid; gap:8px;
  li { display:flex; }
`,_=a.div` color:#6b7280; font-size:12px; `,xe=Se`
  display:inline-flex; align-items:center; justify-content:center; gap:6px;
  height: 40px; padding: 0 14px; border-radius: 10px; font-weight: 700; font-size: 14px; cursor: pointer; transition: background .15s ease, color .15s ease, border-color .15s ease;
`,ge=a.button`
  ${xe};
  background:#111827; color:#fff; border:1px solid #111827;
  &:hover{ background:#000; border-color:#000; }
  &:disabled{ opacity:.6; cursor:not-allowed; }
`,p=a.button`
  ${xe};
  background:#fff; color:#111827; border:1px solid #e5e7eb;
  &:hover{ background:#f9fafb; }
  &:disabled{ opacity:.6; cursor:not-allowed; pointer-events:none; }
`,le=a.table`
  width:100%; border-collapse:separate; border-spacing:0; overflow:hidden; border:1px solid #e5e7eb; border-radius:12px; background:#fff;
  thead th { text-align:left; font-size:12px; color:#6b7280; font-weight:800; padding:10px 12px; border-bottom:1px solid #e5e7eb; background:#f9fafb; position:sticky; top:0; }
  tbody td { font-size:13px; color:#0f172a; padding:10px 12px; border-bottom:1px solid #f1f5f9; }
  tbody tr:nth-child(odd) td{ background:#fcfcfd; }
  tbody tr:hover td{ background:#f9fafb; }
`,oe=a.div`
  width:100%; overflow:auto; border:1px solid #f1f5f9; border-radius:12px;
  table{ min-width: 520px; }
`,Fe=a.ul`
  list-style:none; padding:0; margin:0; display:grid; gap:8px;
  li{ display:grid; grid-template-columns: 120px 1fr; }
  .k{ color:#6b7280; font-size:12px; font-weight:700; }
  .v{ color:#111827; font-size:14px; }
`,re=a.input`
  height:40px; border:1px solid #e5e7eb; border-radius:10px; padding:0 12px; font-size:14px; background:#fff; color:#0f172a;
`,Be=a.div`
  display:grid; gap:12px;
`,Ue=a.div`
  display:flex; flex-wrap:wrap; gap:12px; align-items:center; justify-content:space-between;
`,pe=a.div`
  display:flex; flex-wrap:wrap; align-items:center; gap:8px;
`,We=a.span`
  font-size:12px; color:#64748b; font-weight:700;
`,He=a.select`
  height:40px; border:1px solid #e5e7eb; border-radius:10px; padding:0 12px; font-size:14px; background:#fff; color:#0f172a; cursor:pointer;
`,Ve=a.div`
  display:grid; gap:12px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
`,W=a.div`
  border:1px solid #e5e7eb; border-radius:12px; padding:12px 14px;
  background:linear-gradient(180deg, #f8fafc 0%, #ffffff 85%);
  display:grid; gap:4px;
`,H=a.span`
  font-size:12px; color:#64748b; font-weight:700; letter-spacing:.02em;
`,V=a.span`
  font-size:16px; font-weight:800; color:#0f172a;
`,q=a.span`
  font-size:12px; color:#94a3b8;
`,ae=a.div`
  display:flex; align-items:center; justify-content:center; gap:8px;
  padding:16px;
  font-size:13px; font-weight:600;
  color:${({$variant:x})=>x==="error"?"#b91c1c":"#475569"};
`;function qe({from:x,to:g}){const[o,P]=n.useState([]),[S,h]=n.useState(!1),[N,F]=n.useState(null),[c,$]=n.useState(""),[v,G]=n.useState(0),[r,D]=n.useState(20),[Q,j]=n.useState(0),[B,T]=n.useState(0),[Y,z]=n.useState(!1),{success:J,error:K,warning:U}=he(),b=n.useRef(r),w=n.useRef(c),f=n.useCallback(async(t,l,d)=>{h(!0),F(null);try{const u=await ue({page:t,size:l,q:d||void 0,from:x,to:g});P(u.content||[]),G(u.page),D(u.size),j(u.totalPages),T(u.totalElements??0)}catch(u){const R=u instanceof Error?u.message:"불러오지 못했습니다.";F(R),K(R)}finally{h(!1)}},[x,g,K]);n.useEffect(()=>{b.current=r},[r]),n.useEffect(()=>{w.current=c},[c]),n.useEffect(()=>{f(0,b.current,w.current)},[x,g,f]);const ee=v*r+(o.length>0?1:0),X=v*r+o.length,k=Math.max(1,Q),L=n.useMemo(()=>o.length?o.reduce((t,l)=>({students:t.students+(l.students??0),courses:t.courses+(l.courses??0),apiCalls:t.apiCalls+(l.apiCalls??0),logins:t.logins+(l.logins??0),paymentCount:t.paymentCount+(l.paymentCount??0),paymentAmountCents:t.paymentAmountCents+(l.paymentAmountCents??0)}),{students:0,courses:0,apiCalls:0,logins:0,paymentCount:0,paymentAmountCents:0}):null,[o]),A=n.useMemo(()=>o.length?o.reduce((t,l)=>{const d=l.paymentAmountCents||0;return d>t.amount?{row:l,amount:d}:t},{row:null,amount:0}).row:null,[o]),I=n.useMemo(()=>o.length?o.reduce((t,l)=>{const d=(l.apiCalls||0)+(l.logins||0);return d>t.score?{row:l,score:d}:t},{row:null,score:-1/0}).row:null,[o]),s=n.useCallback(()=>{const t=c.trim();t!==c&&$(t),f(0,r,t)},[f,r,c]),i=n.useCallback(()=>{$(""),w.current="",f(0,r,"")},[f,r]),y=n.useCallback(t=>{const l=Number(t.target.value);D(l),b.current=l,f(0,l,c)},[f,c]),te=n.useCallback(()=>{if(o.length===0){U("표시된 데이터가 없어 내보낼 수 없습니다.");return}try{z(!0);const t=["학원명","사업자번호","학생수","수업수","오늘 수업","API 호출","로그인","결제건수","결제금액(원)","최근활동"],l=o.map(m=>{const me=[m.loginLastAt,m.apiLastAt,m.paymentLastAt].filter(Boolean).map(se=>new Date(se).toLocaleString("ko-KR",{dateStyle:"short",timeStyle:"short"})).sort().pop()||"";return[m.name,m.bizNo||"",String(m.students??0),String(m.courses??0),String(m.classesToday??0),String(m.apiCalls??0),String(m.logins??0),String(m.paymentCount??0),String(Math.round((m.paymentAmountCents||0)/100)),me].map(se=>`"${String(se).replace(/"/g,'""')}"`).join(",")}),d=[t.join(","),...l].join(`
`),u=new Blob([`\uFEFF${d}`],{type:"text/csv;charset=utf-8;"}),R=URL.createObjectURL(u),C=document.createElement("a");C.href=R,C.download=`classon-academies-${x}-${g}.csv`,document.body.appendChild(C),C.click(),document.body.removeChild(C),URL.revokeObjectURL(R),J("현재 목록을 CSV로 내보냈습니다.")}catch{K("CSV 내보내기에 실패했습니다.")}finally{z(!1)}},[o,U,J,K,x,g]),Z=[20,50,100],ne=B>0?`${(o.length?ee:0).toLocaleString("ko-KR")} – ${(o.length?X:0).toLocaleString("ko-KR")} / ${B.toLocaleString("ko-KR")}`:"0 / 0",fe=`페이지 ${(k>0?Math.min(v+1,k):1).toLocaleString("ko-KR")} / ${k.toLocaleString("ko-KR")} • ${ne}`;return e.jsxs(Be,{children:[e.jsxs(Ue,{children:[e.jsxs(pe,{children:[e.jsx(re,{placeholder:"학원명/사업자번호 검색",value:c,onChange:t=>$(t.target.value),onKeyDown:t=>{t.key==="Enter"&&(t.preventDefault(),s())}}),e.jsx(p,{as:"button",type:"button",onClick:s,disabled:S,children:"검색"}),e.jsx(p,{as:"button",type:"button",onClick:i,disabled:!c,children:"초기화"})]}),e.jsxs(pe,{children:[e.jsx(We,{children:fe}),e.jsx(He,{value:r,onChange:y,children:Z.map(t=>e.jsxs("option",{value:t,children:[t,"개씩"]},t))}),e.jsx(p,{as:"button",type:"button",onClick:()=>f(Math.max(0,v-1),r,c),disabled:v<=0||S,children:"이전"}),e.jsx(p,{as:"button",type:"button",onClick:()=>f(Math.min(k-1,v+1),r,c),disabled:v>=k-1||S,children:"다음"}),e.jsx(ge,{as:"button",type:"button",onClick:te,disabled:Y||o.length===0,children:Y?"CSV 생성 중…":"CSV 내보내기"})]})]}),e.jsxs(Ve,{children:[e.jsxs(W,{children:[e.jsx(H,{children:"현재 페이지 학원"}),e.jsxs(V,{children:[o.length.toLocaleString("ko-KR"),"개"]}),e.jsxs(q,{children:["전체 ",B.toLocaleString("ko-KR"),"개 • ",x," ~ ",g]})]}),L?e.jsxs(W,{children:[e.jsx(H,{children:"범위 결제 합계"}),e.jsxs(V,{children:["₩",Math.round(L.paymentAmountCents/100).toLocaleString("ko-KR")]}),e.jsxs(q,{children:[L.paymentCount.toLocaleString("ko-KR"),"건 • 학생 ",L.students.toLocaleString("ko-KR"),"명"]})]}):e.jsxs(W,{children:[e.jsx(H,{children:"범위 결제 합계"}),e.jsx(V,{children:"—"}),e.jsx(q,{children:"데이터 없음"})]}),A&&(A.paymentAmountCents||0)>0&&e.jsxs(W,{children:[e.jsx(H,{children:"최고 결제 학원"}),e.jsx(V,{children:A.name}),e.jsxs(q,{children:["₩",Math.round((A.paymentAmountCents||0)/100).toLocaleString("ko-KR")," • ",(A.paymentCount??0).toLocaleString("ko-KR"),"건"]})]}),I&&e.jsxs(W,{children:[e.jsx(H,{children:"활동량 상위"}),e.jsx(V,{children:I.name}),e.jsxs(q,{children:["API ",(I.apiCalls??0).toLocaleString("ko-KR")," • 로그인 ",(I.logins??0).toLocaleString("ko-KR")]})]})]}),e.jsx(oe,{children:e.jsxs(le,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"학원"}),e.jsx("th",{children:"학생수"}),e.jsx("th",{children:"수업수"}),e.jsx("th",{children:"오늘 수업"}),e.jsx("th",{children:"API(기간)"}),e.jsx("th",{children:"로그인(기간)"}),e.jsx("th",{children:"결제건수(기간)"}),e.jsx("th",{children:"결제합계(기간/원)"})]})}),e.jsxs("tbody",{children:[S&&e.jsx("tr",{children:e.jsx("td",{colSpan:8,children:e.jsxs(ae,{children:[e.jsx(ie,{"aria-hidden":!0}),e.jsx("span",{children:"데이터를 불러오는 중…"})]})})}),!S&&N&&e.jsx("tr",{children:e.jsx("td",{colSpan:8,children:e.jsxs(ae,{$variant:"error",children:["⚠️ ",N]})})}),!S&&!N&&o.map((t,l)=>e.jsxs("tr",{children:[e.jsx("td",{children:e.jsxs("div",{style:{display:"grid"},children:[e.jsx("a",{href:O.admin+"/academies/"+(t.id||""),style:{color:"#111827",textDecoration:"underline",fontWeight:800},children:t.name}),e.jsxs("div",{style:{color:"#64748b",fontSize:12},children:[t.bizNo||"-",t.createdAt?(()=>{const d=Re(t.createdAt,{includeWeekday:!0});return` • 가입일 ${d==="—"?t.createdAt:d}`})():"",(()=>{const d=[t.loginLastAt,t.apiLastAt,t.paymentLastAt].filter(Boolean).map(C=>new Date(C).getTime()).filter(C=>Number.isFinite(C));if(d.length===0)return"";const u=new Date(Math.max(...d)),R=ze(u,{includeWeekday:!0});return` • 최근활동 ${R==="—"?u.toLocaleString("ko-KR",{hour12:!1}):R}`})()]})]})}),e.jsx("td",{children:t.students}),e.jsx("td",{children:t.courses}),e.jsx("td",{children:t.classesToday}),e.jsx("td",{children:t.apiCalls}),e.jsx("td",{children:t.logins}),e.jsx("td",{children:t.paymentCount}),e.jsx("td",{children:Math.round((t.paymentAmountCents||0)/100).toLocaleString("ko-KR")})]},t.id||l)),!S&&!N&&o.length===0&&e.jsx("tr",{children:e.jsx("td",{colSpan:8,children:e.jsx(ae,{children:"표시할 데이터가 없습니다."})})})]})]})})]})}export{Ze as default};
