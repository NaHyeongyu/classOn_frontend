import{u as je,J as be,g as he,r as n,k as ye,j as e,K as T,S as I,q as E,d as a,w as Se,s as ke,L as ve}from"./index-kUE9BnSi.js";import{g as Ce,a as we,b as Le,l as Ae}from"./admin-D5Zq1krS.js";import{l as xe}from"./adminAcademies-B9cMrgk-.js";function Je(){const x=je(),{admin:u,logout:o}=be(),{success:P,error:S}=he(),[p,M]=n.useState(null),[O,d]=n.useState([]),[$,v]=n.useState([]),[G,r]=n.useState(!1),[N,Q]=n.useState(null),[j,B]=n.useState(null),[D,J]=n.useState(()=>{const s=new Date;return s.setDate(s.getDate()-30),s.toISOString().slice(0,10)}),[A,Y]=n.useState(()=>new Date().toISOString().slice(0,10)),[R,F]=n.useState(null),b=n.useRef(!0);n.useEffect(()=>()=>{b.current=!1},[]);const C=n.useCallback(async s=>{if(!b.current)return!1;r(!0),Q(null);try{const[i,y,te]=await Promise.all([Ce(),we(),Le()]);let Z=i;if(!i||i.academies==null)try{const ne=await xe({page:0,size:1});Z={...i||{},academies:ne.totalElements}}catch{}return b.current?(M(Z),d(y),v(te),B(new Date),s?.silent||P("대시보드 데이터를 새로고침했습니다."),!0):!1}catch(i){if(!b.current)return!1;const y=i instanceof Error?i.message:"대시보드 데이터를 불러오지 못했습니다.";return Q(y),S(y),!1}finally{b.current&&r(!1)}},[P,S]);n.useEffect(()=>{C({silent:!0})},[C]),n.useEffect(()=>{let s=!1;async function i(){try{const y=await Ae({from:D,to:A,page:0,size:1});!s&&b.current&&F(y.totalElements)}catch{!s&&b.current&&F(null)}}return i(),()=>{s=!0}},[D,A]);const g=n.useMemo(()=>[{label:"전체 학원 수",value:p?.academies??"—"},{label:"최근 30일 로그인",value:p?.logins30d??"—"},{label:"최근 30일 결제합계(원)",value:p?.paymentsAmount30d!=null?Math.round((p.paymentsAmount30d||0)/100).toLocaleString("ko-KR"):"—"},{label:"오늘 API 호출",value:p?.apiCallsToday??"—"},{label:"오늘 OpenAI 호출",value:p?.openaiCallsToday??"—"}],[p]),ee=n.useMemo(()=>{if(!j)return null;const s=Date.now()-j.getTime(),i=Math.floor(s/6e4);if(i<1)return"방금 전";if(i<60)return`${i}분 전`;const y=Math.floor(i/60);return y<24?`${y}시간 전`:j.toLocaleString("ko-KR",{dateStyle:"medium",timeStyle:"short"})},[j]),X=G&&!j&&!N,k=G&&!!j,w=n.useCallback(()=>{try{window.dispatchEvent(new CustomEvent("calendar:classes-refresh",{detail:{}}))}catch{}},[]),L=n.useCallback(()=>{ye(["/api/students","/api/courses","/api/calendar/classes","/api/calendar/classes-range","/api/dashboard/summary","/api/dashboard/attendance-today","/api/marketing/"]),w(),P("API 캐시를 초기화했습니다.")},[P,w]),z=n.useCallback(()=>{C()},[C]);return e.jsxs(Re,{children:[e.jsxs(ze,{children:[e.jsxs("div",{className:"info",children:[e.jsx("h1",{children:"관리자 대시보드"}),e.jsx("p",{children:"운영 현황을 빠르게 확인하고 도구를 실행하세요."}),e.jsxs(Ke,{children:[e.jsx("span",{className:"chip",children:"업데이트"}),e.jsx("span",{className:"value",title:j?j.toLocaleString("ko-KR",{dateStyle:"medium",timeStyle:"short"}):void 0,children:j?ee:"데이터 준비 중"}),k&&e.jsx(ie,{"aria-hidden":!0})]})]}),e.jsxs("div",{className:"actions",children:[u?e.jsx(c,{as:"button",onClick:()=>o(),children:"로그아웃"}):e.jsx(c,{as:"button",onClick:()=>x(T.admin+"/login"),children:"관리자 로그인"}),e.jsx(ge,{type:"button",onClick:L,children:"캐시 초기화"}),e.jsx(c,{as:"button",onClick:z,disabled:k,children:k?e.jsxs(e.Fragment,{children:[e.jsx(ie,{"aria-hidden":!0}),e.jsx("span",{children:"갱신 중…"})]}):"데이터 새로고침"})]})]}),u?e.jsxs(de,{children:[e.jsx("span",{className:"pill",children:"로그인"}),e.jsxs("span",{className:"who",children:[u.username,u.role?` (${u.role})`:""]})]}):e.jsxs(de,{children:[e.jsx("span",{className:"pill warn",children:"주의"}),e.jsx("span",{className:"who",children:"관리자 로그인이 없으므로 일부 기능이 제한될 수 있습니다."})]}),N&&e.jsxs(Ie,{role:"status",children:[e.jsx("span",{className:"label",children:"데이터 오류"}),e.jsx("span",{className:"message",children:N}),e.jsx(c,{as:"button",type:"button",onClick:z,disabled:k,children:"다시 시도"})]}),e.jsxs(Ee,{children:[e.jsxs(I,{children:[e.jsx(E,{children:"요약"}),e.jsx(Me,{children:g.map((s,i)=>e.jsx($e,{"data-variant":i%3+1,"data-loading":X||void 0,children:X?e.jsxs(e.Fragment,{children:[e.jsx(ce,{}),e.jsx(ce,{$size:"lg"})]}):e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"label",children:s.label}),e.jsx("span",{className:"value",children:s.value})]})},i))})]}),e.jsxs(I,{children:[e.jsx(E,{children:"빠른 작업"}),e.jsxs(De,{children:[e.jsx("li",{children:e.jsx(c,{type:"button",onClick:w,children:"캘린더 강제 새로고침"})}),e.jsx("li",{children:e.jsx(c,{type:"button",onClick:L,children:"API 캐시 전체 무효화"})}),e.jsx("li",{children:e.jsx(c,{as:"a",href:T.admin+"/logins",children:"로그인 기록 보기"})}),e.jsx("li",{children:e.jsx(c,{as:"a",href:T.admin+"/api-logs",children:"API 로그 보기"})}),e.jsx("li",{children:e.jsx(c,{as:"a",href:T.admin+"/openai-logs",children:"OpenAI 로그 보기"})}),e.jsx("li",{children:e.jsx(c,{as:"a",href:T.admin+"/payments",children:"결제 기록 보기"})})]})]}),e.jsxs(I,{children:[e.jsx(E,{children:"운영 데이터(학원별)"}),e.jsx(Ve,{from:D,to:A})]}),e.jsxs(Pe,{children:[e.jsxs(I,{children:[e.jsx(E,{children:"학원 기본정보"}),p?.academy?e.jsxs(Te,{children:[e.jsxs("li",{children:[e.jsx("span",{className:"k",children:"학원명"}),e.jsx("span",{className:"v",children:p.academy.name})]}),e.jsxs("li",{children:[e.jsx("span",{className:"k",children:"ID"}),e.jsx("span",{className:"v",children:p.academy.id})]})]}):e.jsx(_,{children:"관리자 계정에 학원 연결이 없습니다."})]}),e.jsxs(I,{children:[e.jsx(E,{children:"로그인 기록(최근)"}),e.jsx(oe,{children:e.jsxs(le,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"시간"}),e.jsx("th",{children:"아이디"}),e.jsx("th",{children:"IP"}),e.jsx("th",{children:"성공"})]})}),e.jsxs("tbody",{children:[O.map((s,i)=>e.jsxs("tr",{children:[e.jsx("td",{children:new Date(s.createdAt).toLocaleString("ko-KR",{dateStyle:"medium",timeStyle:"short"})}),e.jsx("td",{children:s.username}),e.jsx("td",{children:s.ip||"-"}),e.jsx("td",{children:s.success?"Y":"N"})]},s.id||i)),O.length===0&&e.jsx("tr",{children:e.jsx("td",{colSpan:4,children:e.jsx(_,{children:"표시할 데이터가 없습니다."})})})]})]})})]})]}),e.jsxs(I,{children:[e.jsx(E,{children:"결제 기록(최근)"}),e.jsx(oe,{children:e.jsxs(le,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"시간"}),e.jsx("th",{children:"금액"}),e.jsx("th",{children:"통화"}),e.jsx("th",{children:"상태"}),e.jsx("th",{children:"비고"})]})}),e.jsxs("tbody",{children:[$.map((s,i)=>e.jsxs("tr",{children:[e.jsx("td",{children:new Date(s.createdAt).toLocaleString("ko-KR",{dateStyle:"medium",timeStyle:"short"})}),e.jsx("td",{children:(s.amountCents/100).toLocaleString("ko-KR")}),e.jsx("td",{children:s.currency}),e.jsx("td",{children:s.status}),e.jsx("td",{children:s.description||"-"})]},s.id||i)),$.length===0&&e.jsx("tr",{children:e.jsx("td",{colSpan:5,children:e.jsx(_,{children:"표시할 데이터가 없습니다."})})})]})]})})]}),e.jsxs(I,{children:[e.jsx(E,{children:"범위 선택"}),e.jsxs("div",{style:{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"},children:[e.jsx("span",{className:"label",style:{color:"#6b7280",fontSize:12,fontWeight:700},children:"기간"}),e.jsx(re,{type:"date",lang:"ko-KR",value:D,onChange:s=>J(s.target.value)}),e.jsx("span",{children:"~"}),e.jsx(re,{type:"date",lang:"ko-KR",value:A,onChange:s=>Y(s.target.value)}),R!=null&&e.jsxs("span",{style:{color:"#334155",fontSize:12},children:["선택 기간 로그인 수: ",e.jsx("b",{children:R.toLocaleString("ko-KR")})]})]}),e.jsx(_,{children:"아래 학원 목록의 통계 범위가 위 기간에 맞춰 적용됩니다."})]})]})]})}const Re=a.div` display:grid; gap:14px; `,ze=a.header`
  display:flex; align-items:center; justify-content:space-between; padding:16px; border:1px solid #e5e7eb; border-radius:14px; background: linear-gradient(180deg, #f9fafb 0%, #ffffff 80%);
  .info { display:grid; gap:4px; }
  .info h1 { margin:0; font-size:20px; color:#0f172a; }
  .info p { margin:0; color:#6b7280; }
  .actions { display:inline-flex; gap:8px; }
`,Ke=a.div`
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
`,Ie=a.div`
  display:flex; gap:12px; align-items:center; border:1px solid #fecaca; background:#fee2e2; color:#b91c1c; padding:12px 16px; border-radius:12px; font-size:13px; font-weight:600;
  .label { font-weight:800; letter-spacing:.02em; }
  .message { flex:1; color:#7f1d1d; }
  button { margin-left:auto; }
`,Ee=a.div`
  display:grid; gap:16px;
`,Pe=a.div`
  display:grid; gap:16px;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
`,Me=a.div` display:grid; gap:12px; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); `,$e=a.div`
  position:relative; border:1px solid #e5e7eb; border-radius:12px; padding:14px; display:grid; gap:6px; background:#fff; overflow:hidden;
  &:before{ content:''; position:absolute; inset:auto -20% 0 -20%; height:40%; background:var(--kpi-bg,#eef2ff); filter:blur(20px); }
  &[data-variant='1']{ --kpi-bg:#e0e7ff; }
  &[data-variant='2']{ --kpi-bg:#dcfce7; }
  &[data-variant='3']{ --kpi-bg:#fee2e2; }
  &[data-loading]{ background:#f8fafc; }
  &[data-loading]:before{ opacity:0; }
  .label { color:#6b7280; font-size:12px; font-weight:700; }
  .value { color:#0f172a; font-size:18px; font-weight:800; }
`,Ne=ke`
  0% { background-position: 100% 0; }
  100% { background-position: 0 0; }
`,ce=a.span`
  display:block;
  width:60%;
  height:${({$size:x})=>x==="lg"?"20px":"12px"};
  border-radius:999px;
  background:linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 50%, #f1f5f9 100%);
  background-size:200% 100%;
  animation:${Ne} 1.2s ease-in-out infinite;
`,De=a.ul`
  list-style:none; padding:0; margin:0; display:grid; gap:8px;
  li { display:flex; }
`,_=a.div` color:#6b7280; font-size:12px; `,ue=Se`
  display:inline-flex; align-items:center; justify-content:center; gap:6px;
  height: 40px; padding: 0 14px; border-radius: 10px; font-weight: 700; font-size: 14px; cursor: pointer; transition: background .15s ease, color .15s ease, border-color .15s ease;
`,ge=a.button`
  ${ue};
  background:#111827; color:#fff; border:1px solid #111827;
  &:hover{ background:#000; border-color:#000; }
  &:disabled{ opacity:.6; cursor:not-allowed; }
`,c=a.button`
  ${ue};
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
`,Te=a.ul`
  list-style:none; padding:0; margin:0; display:grid; gap:8px;
  li{ display:grid; grid-template-columns: 120px 1fr; }
  .k{ color:#6b7280; font-size:12px; font-weight:700; }
  .v{ color:#111827; font-size:14px; }
`,re=a.input`
  height:40px; border:1px solid #e5e7eb; border-radius:10px; padding:0 12px; font-size:14px; background:#fff; color:#0f172a;
`,Oe=a.div`
  display:grid; gap:12px;
`,Be=a.div`
  display:flex; flex-wrap:wrap; gap:12px; align-items:center; justify-content:space-between;
`,pe=a.div`
  display:flex; flex-wrap:wrap; align-items:center; gap:8px;
`,Fe=a.span`
  font-size:12px; color:#64748b; font-weight:700;
`,Ue=a.select`
  height:40px; border:1px solid #e5e7eb; border-radius:10px; padding:0 12px; font-size:14px; background:#fff; color:#0f172a; cursor:pointer;
`,He=a.div`
  display:grid; gap:12px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
`,H=a.div`
  border:1px solid #e5e7eb; border-radius:12px; padding:12px 14px;
  background:linear-gradient(180deg, #f8fafc 0%, #ffffff 85%);
  display:grid; gap:4px;
`,V=a.span`
  font-size:12px; color:#64748b; font-weight:700; letter-spacing:.02em;
`,W=a.span`
  font-size:16px; font-weight:800; color:#0f172a;
`,q=a.span`
  font-size:12px; color:#94a3b8;
`,ae=a.div`
  display:flex; align-items:center; justify-content:center; gap:8px;
  padding:16px;
  font-size:13px; font-weight:600;
  color:${({$variant:x})=>x==="error"?"#b91c1c":"#475569"};
`;function Ve({from:x,to:u}){const[o,P]=n.useState([]),[S,p]=n.useState(!1),[M,O]=n.useState(null),[d,$]=n.useState(""),[v,G]=n.useState(0),[r,N]=n.useState(20),[Q,j]=n.useState(0),[B,D]=n.useState(0),[J,A]=n.useState(!1),{success:Y,error:R,warning:F}=he(),b=n.useRef(r),C=n.useRef(d),g=n.useCallback(async(t,l,f)=>{p(!0),O(null);try{const h=await xe({page:t,size:l,q:f||void 0,from:x,to:u});P(h.content||[]),G(h.page),N(h.size),j(h.totalPages),D(h.totalElements??0)}catch(h){const K=h instanceof Error?h.message:"불러오지 못했습니다.";O(K),R(K)}finally{p(!1)}},[x,u,R]);n.useEffect(()=>{b.current=r},[r]),n.useEffect(()=>{C.current=d},[d]),n.useEffect(()=>{g(0,b.current,C.current)},[x,u,g]);const ee=v*r+(o.length>0?1:0),X=v*r+o.length,k=Math.max(1,Q),w=n.useMemo(()=>o.length?o.reduce((t,l)=>({students:t.students+(l.students??0),courses:t.courses+(l.courses??0),apiCalls:t.apiCalls+(l.apiCalls??0),logins:t.logins+(l.logins??0),paymentCount:t.paymentCount+(l.paymentCount??0),paymentAmountCents:t.paymentAmountCents+(l.paymentAmountCents??0)}),{students:0,courses:0,apiCalls:0,logins:0,paymentCount:0,paymentAmountCents:0}):null,[o]),L=n.useMemo(()=>o.length?o.reduce((t,l)=>{const f=l.paymentAmountCents||0;return f>t.amount?{row:l,amount:f}:t},{row:null,amount:0}).row:null,[o]),z=n.useMemo(()=>o.length?o.reduce((t,l)=>{const f=(l.apiCalls||0)+(l.logins||0);return f>t.score?{row:l,score:f}:t},{row:null,score:-1/0}).row:null,[o]),s=n.useCallback(()=>{const t=d.trim();t!==d&&$(t),g(0,r,t)},[g,r,d]),i=n.useCallback(()=>{$(""),C.current="",g(0,r,"")},[g,r]),y=n.useCallback(t=>{const l=Number(t.target.value);N(l),b.current=l,g(0,l,d)},[g,d]),te=n.useCallback(()=>{if(o.length===0){F("표시된 데이터가 없어 내보낼 수 없습니다.");return}try{A(!0);const t=["학원명","사업자번호","학생수","수업수","오늘 수업","API 호출","로그인","결제건수","결제금액(원)","최근활동"],l=o.map(m=>{const me=[m.loginLastAt,m.apiLastAt,m.paymentLastAt].filter(Boolean).map(se=>new Date(se).toLocaleString("ko-KR",{dateStyle:"short",timeStyle:"short"})).sort().pop()||"";return[m.name,m.bizNo||"",String(m.students??0),String(m.courses??0),String(m.classesToday??0),String(m.apiCalls??0),String(m.logins??0),String(m.paymentCount??0),String(Math.round((m.paymentAmountCents||0)/100)),me].map(se=>`"${String(se).replace(/"/g,'""')}"`).join(",")}),f=[t.join(","),...l].join(`
`),h=new Blob([`\uFEFF${f}`],{type:"text/csv;charset=utf-8;"}),K=URL.createObjectURL(h),U=document.createElement("a");U.href=K,U.download=`classon-academies-${x}-${u}.csv`,document.body.appendChild(U),U.click(),document.body.removeChild(U),URL.revokeObjectURL(K),Y("현재 목록을 CSV로 내보냈습니다.")}catch{R("CSV 내보내기에 실패했습니다.")}finally{A(!1)}},[o,F,Y,R,x,u]),Z=[20,50,100],ne=B>0?`${(o.length?ee:0).toLocaleString("ko-KR")} – ${(o.length?X:0).toLocaleString("ko-KR")} / ${B.toLocaleString("ko-KR")}`:"0 / 0",fe=`페이지 ${(k>0?Math.min(v+1,k):1).toLocaleString("ko-KR")} / ${k.toLocaleString("ko-KR")} • ${ne}`;return e.jsxs(Oe,{children:[e.jsxs(Be,{children:[e.jsxs(pe,{children:[e.jsx(re,{placeholder:"학원명/사업자번호 검색",value:d,onChange:t=>$(t.target.value),onKeyDown:t=>{t.key==="Enter"&&(t.preventDefault(),s())}}),e.jsx(c,{as:"button",type:"button",onClick:s,disabled:S,children:"검색"}),e.jsx(c,{as:"button",type:"button",onClick:i,disabled:!d,children:"초기화"})]}),e.jsxs(pe,{children:[e.jsx(Fe,{children:fe}),e.jsx(Ue,{value:r,onChange:y,children:Z.map(t=>e.jsxs("option",{value:t,children:[t,"개씩"]},t))}),e.jsx(c,{as:"button",type:"button",onClick:()=>g(Math.max(0,v-1),r,d),disabled:v<=0||S,children:"이전"}),e.jsx(c,{as:"button",type:"button",onClick:()=>g(Math.min(k-1,v+1),r,d),disabled:v>=k-1||S,children:"다음"}),e.jsx(ge,{as:"button",type:"button",onClick:te,disabled:J||o.length===0,children:J?"CSV 생성 중…":"CSV 내보내기"})]})]}),e.jsxs(He,{children:[e.jsxs(H,{children:[e.jsx(V,{children:"현재 페이지 학원"}),e.jsxs(W,{children:[o.length.toLocaleString("ko-KR"),"개"]}),e.jsxs(q,{children:["전체 ",B.toLocaleString("ko-KR"),"개 • ",x," ~ ",u]})]}),w?e.jsxs(H,{children:[e.jsx(V,{children:"범위 결제 합계"}),e.jsxs(W,{children:["₩",Math.round(w.paymentAmountCents/100).toLocaleString("ko-KR")]}),e.jsxs(q,{children:[w.paymentCount.toLocaleString("ko-KR"),"건 • 학생 ",w.students.toLocaleString("ko-KR"),"명"]})]}):e.jsxs(H,{children:[e.jsx(V,{children:"범위 결제 합계"}),e.jsx(W,{children:"—"}),e.jsx(q,{children:"데이터 없음"})]}),L&&(L.paymentAmountCents||0)>0&&e.jsxs(H,{children:[e.jsx(V,{children:"최고 결제 학원"}),e.jsx(W,{children:L.name}),e.jsxs(q,{children:["₩",Math.round((L.paymentAmountCents||0)/100).toLocaleString("ko-KR")," • ",(L.paymentCount??0).toLocaleString("ko-KR"),"건"]})]}),z&&e.jsxs(H,{children:[e.jsx(V,{children:"활동량 상위"}),e.jsx(W,{children:z.name}),e.jsxs(q,{children:["API ",(z.apiCalls??0).toLocaleString("ko-KR")," • 로그인 ",(z.logins??0).toLocaleString("ko-KR")]})]})]}),e.jsx(oe,{children:e.jsxs(le,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"학원"}),e.jsx("th",{children:"학생수"}),e.jsx("th",{children:"수업수"}),e.jsx("th",{children:"오늘 수업"}),e.jsx("th",{children:"API(기간)"}),e.jsx("th",{children:"로그인(기간)"}),e.jsx("th",{children:"결제건수(기간)"}),e.jsx("th",{children:"결제합계(기간/원)"})]})}),e.jsxs("tbody",{children:[S&&e.jsx("tr",{children:e.jsx("td",{colSpan:8,children:e.jsxs(ae,{children:[e.jsx(ie,{"aria-hidden":!0}),e.jsx("span",{children:"데이터를 불러오는 중…"})]})})}),!S&&M&&e.jsx("tr",{children:e.jsx("td",{colSpan:8,children:e.jsxs(ae,{$variant:"error",children:["⚠️ ",M]})})}),!S&&!M&&o.map((t,l)=>e.jsxs("tr",{children:[e.jsx("td",{children:e.jsxs("div",{style:{display:"grid"},children:[e.jsx("a",{href:T.admin+"/academies/"+(t.id||""),style:{color:"#111827",textDecoration:"underline",fontWeight:800},children:t.name}),e.jsxs("div",{style:{color:"#64748b",fontSize:12},children:[t.bizNo||"-",t.createdAt?` • 가입일 ${new Date(t.createdAt).toLocaleDateString("ko-KR")}`:"",(()=>{const f=[t.loginLastAt,t.apiLastAt,t.paymentLastAt].filter(Boolean).map(K=>new Date(K).getTime());if(f.length===0)return"";const h=new Date(Math.max.apply(null,f));return` • 최근활동 ${h.toLocaleDateString("ko-KR")} ${h.toLocaleTimeString("ko-KR",{hour12:!1})}`})()]})]})}),e.jsx("td",{children:t.students}),e.jsx("td",{children:t.courses}),e.jsx("td",{children:t.classesToday}),e.jsx("td",{children:t.apiCalls}),e.jsx("td",{children:t.logins}),e.jsx("td",{children:t.paymentCount}),e.jsx("td",{children:Math.round((t.paymentAmountCents||0)/100).toLocaleString("ko-KR")})]},t.id||l)),!S&&!M&&o.length===0&&e.jsx("tr",{children:e.jsx("td",{colSpan:8,children:e.jsx(ae,{children:"표시할 데이터가 없습니다."})})})]})]})})]})}export{Je as default};
