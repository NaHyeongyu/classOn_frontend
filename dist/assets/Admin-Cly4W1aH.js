import{u as ke,v as Se,b as ge,r as s,c as ve,j as e,w as L,d as a,l as Ce,m as we,L as Le}from"./index-B5k8kNhE.js";import{S as C,i as w}from"./UI-BZ18PvHk.js";import{g as Ae,a as Re,b as ze,l as Ee}from"./admin-eRf7uxCc.js";import{l as fe}from"./adminAcademies-oBFGF-67.js";import{l as he}from"./adminFeedback-o5kcBXO0.js";import{d as me,a as Ke}from"./format-Do6vjlY3.js";function it(){const g=ke(),{admin:f,logout:l}=Se(),{success:I,error:y}=ge(),[x,M]=s.useState(null),[W,p]=s.useState([]),[P,k]=s.useState([]),[Y,d]=s.useState(!1),[T,J]=s.useState(null),[j,O]=s.useState(null),[$,X]=s.useState(()=>{const t=new Date;return t.setDate(t.getDate()-30),t.toISOString().slice(0,10)}),[A,Z]=s.useState(()=>new Date().toISOString().slice(0,10)),[R,U]=s.useState(null),[D,z]=s.useState([]),[u,B]=s.useState(null),[E,S]=s.useState(null),[K,v]=s.useState(null),o=s.useRef(!0);s.useEffect(()=>()=>{o.current=!1},[]);const N=s.useCallback(async t=>{if(!o.current)return!1;d(!0),J(null);try{v(null);const[n,i,h]=await Promise.all([Ae(),Re(),ze()]);let b=n;if(!n||n.academies==null)try{const r=await fe({page:0,size:1});b={...n||{},academies:r.totalElements}}catch{}if(!o.current)return!1;M(b),p(i),k(h),O(new Date);try{const r=await he({page:0,size:5});o.current&&(z((r?.content||[]).slice(0,5)),B(typeof r?.totalElements=="number"?r.totalElements:null))}catch(r){o.current&&(z([]),B(null),v(r instanceof Error?r.message:"문의 목록을 불러오지 못했습니다."))}try{const r=await he({status:"NEW",page:0,size:1});o.current&&S(typeof r?.totalElements=="number"?r.totalElements:null)}catch{o.current&&S(null)}return t?.silent||I("대시보드 데이터를 새로고침했습니다."),!0}catch(n){if(!o.current)return!1;const i=n instanceof Error?n.message:"대시보드 데이터를 불러오지 못했습니다.";return J(i),y(i),z([]),B(null),S(null),v("문의 데이터를 불러오지 못했습니다."),!1}finally{o.current&&d(!1)}},[I,y]);s.useEffect(()=>{N({silent:!0})},[N]),s.useEffect(()=>{let t=!1;async function n(){try{const i=await Ee({from:$,to:A,page:0,size:1});!t&&o.current&&U(i.totalElements)}catch{!t&&o.current&&U(null)}}return n(),()=>{t=!0}},[$,A]);const ie=s.useMemo(()=>[{label:"전체 학원 수",value:x?.academies??"—"},{label:"최근 30일 로그인",value:x?.logins30d??"—"},{label:"최근 30일 결제합계(원)",value:x?.paymentsAmount30d!=null?Math.round((x.paymentsAmount30d||0)/100).toLocaleString("ko-KR"):"—"},{label:"오늘 API 호출",value:x?.apiCallsToday??"—"},{label:"오늘 OpenAI 호출",value:x?.openaiCallsToday??"—"},{label:"미처리 문의",value:E??"—"}],[x,E]),le=s.useMemo(()=>{if(!j)return null;const t=Date.now()-j.getTime(),n=Math.floor(t/6e4);if(n<1)return"방금 전";if(n<60)return`${n}분 전`;const i=Math.floor(n/60);return i<24?`${i}시간 전`:j.toLocaleString("ko-KR",{dateStyle:"medium",timeStyle:"short"})},[j]),_=Y&&!j&&!T,F=Y&&!!j,H=s.useCallback(()=>{try{window.dispatchEvent(new CustomEvent("calendar:classes-refresh",{detail:{}}))}catch{}},[]),re=s.useCallback(()=>{ve(["/api/students","/api/courses","/api/calendar/classes","/api/calendar/classes-range","/api/dashboard/summary","/api/dashboard/attendance-today","/api/marketing/"]),H(),I("API 캐시를 초기화했습니다.")},[I,H]),ee=s.useCallback(()=>{N()},[N]);return e.jsxs(Ne,{children:[e.jsxs(Ie,{children:[e.jsxs("div",{className:"info",children:[e.jsx("h1",{children:"관리자 대시보드"}),e.jsx("p",{children:"운영 현황을 빠르게 확인하고 도구를 실행하세요."}),e.jsxs(Me,{children:[e.jsx("span",{className:"chip",children:"업데이트"}),e.jsx("span",{className:"value",title:j?j.toLocaleString("ko-KR",{dateStyle:"medium",timeStyle:"short"}):void 0,children:j?le:"데이터 준비 중"}),F&&e.jsx(ce,{"aria-hidden":!0})]})]}),e.jsxs("div",{className:"actions",children:[f?e.jsx(c,{as:"button",onClick:()=>l(),children:"로그아웃"}):e.jsx(c,{as:"button",onClick:()=>g(L.admin+"/login"),children:"관리자 로그인"}),e.jsx(be,{type:"button",onClick:re,children:"캐시 초기화"}),e.jsx(c,{as:"button",onClick:ee,disabled:F,children:F?e.jsxs(e.Fragment,{children:[e.jsx(ce,{"aria-hidden":!0}),e.jsx("span",{children:"갱신 중…"})]}):"데이터 새로고침"})]})]}),f?e.jsxs(pe,{children:[e.jsx("span",{className:"pill",children:"로그인"}),e.jsxs("span",{className:"who",children:[f.username,f.role?` (${f.role})`:""]})]}):e.jsxs(pe,{children:[e.jsx("span",{className:"pill warn",children:"주의"}),e.jsx("span",{className:"who",children:"관리자 로그인이 없으므로 일부 기능이 제한될 수 있습니다."})]}),T&&e.jsxs(Pe,{role:"status",children:[e.jsx("span",{className:"label",children:"데이터 오류"}),e.jsx("span",{className:"message",children:T}),e.jsx(c,{as:"button",type:"button",onClick:ee,disabled:F,children:"다시 시도"})]}),e.jsxs(Te,{children:[e.jsxs(C,{children:[e.jsx(w,{children:"요약"}),e.jsx(De,{children:ie.map((t,n)=>e.jsx(Fe,{"data-variant":n%3+1,"data-loading":_||void 0,children:_?e.jsxs(e.Fragment,{children:[e.jsx(xe,{}),e.jsx(xe,{$size:"lg"})]}):e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"label",children:t.label}),e.jsx("span",{className:"value",children:t.value})]})},n))})]}),e.jsxs(C,{children:[e.jsx(w,{children:"빠른 작업"}),e.jsxs(Oe,{children:[e.jsx("li",{children:e.jsx(c,{type:"button",onClick:H,children:"캘린더 강제 새로고침"})}),e.jsx("li",{children:e.jsx(c,{type:"button",onClick:re,children:"API 캐시 전체 무효화"})}),e.jsx("li",{children:e.jsx(c,{as:"a",href:L.admin+"/logins",children:"로그인 기록 보기"})}),e.jsx("li",{children:e.jsx(c,{as:"a",href:L.admin+"/api-logs",children:"API 로그 보기"})}),e.jsx("li",{children:e.jsx(c,{as:"a",href:L.admin+"/openai-logs",children:"OpenAI 로그 보기"})}),e.jsx("li",{children:e.jsx(c,{as:"a",href:L.admin+"/payments",children:"결제 기록 보기"})}),e.jsx("li",{children:e.jsx(c,{as:"a",href:L.admin+"/feedbacks",children:"문의/피드백 전체 보기"})})]})]}),e.jsxs(C,{children:[e.jsx(w,{children:"문의/피드백"}),e.jsxs(Ue,{children:[e.jsxs("span",{children:["총 ",u!=null?u.toLocaleString("ko-KR"):"—","건"]}),e.jsxs("span",{children:["신규 ",E!=null?E.toLocaleString("ko-KR"):"—","건"]}),e.jsx(c,{as:"a",href:L.admin+"/feedbacks",children:"전체 목록 이동"})]}),K?e.jsxs(Be,{role:"status",children:["⚠️ ",K]}):null,e.jsx(se,{children:e.jsxs(ne,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{style:{minWidth:160},children:"시간"}),e.jsx("th",{children:"제목 · 내용"}),e.jsx("th",{style:{width:90},children:"유형"}),e.jsx("th",{style:{width:90},children:"상태"}),e.jsx("th",{style:{width:160},children:"연락처"})]})}),e.jsx("tbody",{children:D.length===0?e.jsx("tr",{children:e.jsx("td",{colSpan:5,children:e.jsx(ae,{children:"표시할 문의가 없습니다."})})}):D.map(t=>e.jsxs("tr",{children:[e.jsx("td",{children:me(t.createdAt)}),e.jsx("td",{children:e.jsxs(He,{children:[e.jsx("span",{className:"subject",children:t.title}),t.body?e.jsx("span",{className:"excerpt",children:t.body.length>120?`${t.body.slice(0,120)}…`:t.body}):null,t.pageUrl?e.jsxs("span",{className:"meta",children:["페이지: ",t.pageUrl]}):null]})}),e.jsx("td",{children:t.type==="FEATURE"?"기능":"오류"}),e.jsx("td",{children:e.jsx(Ve,{"data-status":t.status,children:t.status==="NEW"?"신규":t.status==="ACK"?"확인":"종료"})}),e.jsx("td",{children:t.contact||"—"})]},t.id))})]})})]}),e.jsxs(C,{children:[e.jsx(w,{children:"운영 데이터(학원별)"}),e.jsx(Ze,{from:$,to:A})]}),e.jsxs($e,{children:[e.jsxs(C,{children:[e.jsx(w,{children:"학원 기본정보"}),x?.academy?e.jsxs(qe,{children:[e.jsxs("li",{children:[e.jsx("span",{className:"k",children:"학원명"}),e.jsx("span",{className:"v",children:x.academy.name})]}),e.jsxs("li",{children:[e.jsx("span",{className:"k",children:"ID"}),e.jsx("span",{className:"v",children:x.academy.id})]})]}):e.jsx(te,{children:"관리자 계정에 학원 연결이 없습니다."})]}),e.jsxs(C,{children:[e.jsx(w,{children:"로그인 기록(최근)"}),e.jsx(se,{children:e.jsxs(ne,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"시간"}),e.jsx("th",{children:"아이디"}),e.jsx("th",{children:"IP"}),e.jsx("th",{children:"성공"})]})}),e.jsxs("tbody",{children:[W.map((t,n)=>e.jsxs("tr",{children:[e.jsx("td",{children:new Date(t.createdAt).toLocaleString("ko-KR",{dateStyle:"medium",timeStyle:"short"})}),e.jsx("td",{children:t.username}),e.jsx("td",{children:t.ip||"-"}),e.jsx("td",{children:t.success?"Y":"N"})]},t.id||n)),W.length===0&&e.jsx("tr",{children:e.jsx("td",{colSpan:4,children:e.jsx(te,{children:"표시할 데이터가 없습니다."})})})]})]})})]})]}),e.jsxs(C,{children:[e.jsx(w,{children:"결제 기록(최근)"}),e.jsx(se,{children:e.jsxs(ne,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"시간"}),e.jsx("th",{children:"금액"}),e.jsx("th",{children:"통화"}),e.jsx("th",{children:"상태"}),e.jsx("th",{children:"비고"})]})}),e.jsxs("tbody",{children:[P.map((t,n)=>e.jsxs("tr",{children:[e.jsx("td",{children:new Date(t.createdAt).toLocaleString("ko-KR",{dateStyle:"medium",timeStyle:"short"})}),e.jsx("td",{children:(t.amountCents/100).toLocaleString("ko-KR")}),e.jsx("td",{children:t.currency}),e.jsx("td",{children:t.status}),e.jsx("td",{children:t.description||"-"})]},t.id||n)),P.length===0&&e.jsx("tr",{children:e.jsx("td",{colSpan:5,children:e.jsx(te,{children:"표시할 데이터가 없습니다."})})})]})]})})]}),e.jsxs(C,{children:[e.jsx(w,{children:"범위 선택"}),e.jsxs("div",{style:{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"},children:[e.jsx("span",{className:"label",style:{color:"#6b7280",fontSize:12,fontWeight:700},children:"기간"}),e.jsx(de,{type:"date",lang:"ko-KR",value:$,onChange:t=>X(t.target.value)}),e.jsx("span",{children:"~"}),e.jsx(de,{type:"date",lang:"ko-KR",value:A,onChange:t=>Z(t.target.value)}),R!=null&&e.jsxs("span",{style:{color:"#334155",fontSize:12},children:["선택 기간 로그인 수: ",e.jsx("b",{children:R.toLocaleString("ko-KR")})]})]}),e.jsx(te,{children:"아래 학원 목록의 통계 범위가 위 기간에 맞춰 적용됩니다."})]})]})]})}const Ne=a.div` display:grid; gap:14px; `,Ie=a.header`
  display:flex; align-items:center; justify-content:space-between; padding:16px; border:1px solid #e5e7eb; border-radius:14px; background: linear-gradient(180deg, #f9fafb 0%, #ffffff 80%);
  .info { display:grid; gap:4px; }
  .info h1 { margin:0; font-size:20px; color:#0f172a; }
  .info p { margin:0; color:#6b7280; }
  .actions { display:inline-flex; gap:8px; }
`,Me=a.div`
  display:inline-flex; align-items:center; gap:8px; margin-top:4px; font-size:12px; color:#64748b;
  .chip { background:#e0f2fe; color:#0369a1; border-radius:999px; padding:2px 8px; font-weight:700; letter-spacing:.02em; }
  .value { font-weight:700; color:#0f172a; }
`,ce=a(Le)`
  width:16px;
  height:16px;
  flex-shrink:0;
`,pe=a.div`
  display:flex; gap:10px; align-items:center; color:#475569; font-size:12px;
  .pill { background:#111827; color:#fff; border-radius:999px; padding:4px 8px; font-weight:800; letter-spacing:.02em; }
  .pill.warn { background:#b91c1c; }
  .who { color:#334155; }
`,Pe=a.div`
  display:flex; gap:12px; align-items:center; border:1px solid #fecaca; background:#fee2e2; color:#b91c1c; padding:12px 16px; border-radius:12px; font-size:13px; font-weight:600;
  .label { font-weight:800; letter-spacing:.02em; }
  .message { flex:1; color:#7f1d1d; }
  button { margin-left:auto; }
`,Te=a.div`
  display:grid; gap:16px;
`,$e=a.div`
  display:grid; gap:16px;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
`,De=a.div` display:grid; gap:12px; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); `,Fe=a.div`
  position:relative; border:1px solid #e5e7eb; border-radius:12px; padding:14px; display:grid; gap:6px; background:#fff; overflow:hidden;
  &:before{ content:''; position:absolute; inset:auto -20% 0 -20%; height:40%; background:var(--kpi-bg,#eef2ff); filter:blur(20px); }
  &[data-variant='1']{ --kpi-bg:#e0e7ff; }
  &[data-variant='2']{ --kpi-bg:#dcfce7; }
  &[data-variant='3']{ --kpi-bg:#fee2e2; }
  &[data-loading]{ background:#f8fafc; }
  &[data-loading]:before{ opacity:0; }
  .label { color:#6b7280; font-size:12px; font-weight:700; }
  .value { color:#0f172a; font-size:18px; font-weight:800; }
`,We=we`
  0% { background-position: 100% 0; }
  100% { background-position: 0 0; }
`,xe=a.span`
  display:block;
  width:60%;
  height:${({$size:g})=>g==="lg"?"20px":"12px"};
  border-radius:999px;
  background:linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 50%, #f1f5f9 100%);
  background-size:200% 100%;
  animation:${We} 1.2s ease-in-out infinite;
`,Oe=a.ul`
  list-style:none; padding:0; margin:0; display:grid; gap:8px;
  li { display:flex; }
`,Ue=a.div`
  display:flex;
  align-items:center;
  flex-wrap:wrap;
  gap:10px;
  margin-bottom:10px;
  font-size:12px;
  color:#475569;
  span { font-weight:700; }
  a { margin-left:auto; }
`,Be=a.div`
  margin-bottom:8px;
  padding:10px 12px;
  border-radius:10px;
  border:1px solid #fecaca;
  background:#fef2f2;
  color:#b91c1c;
  font-size:12px;
  font-weight:600;
`,He=a.div`
  display:grid;
  gap:4px;
  .subject { font-weight:700; color:#111827; }
  .excerpt { color:#475569; font-size:12px; line-height:1.5; white-space:pre-line; }
  .meta { color:#94a3b8; font-size:11px; }
`,Ve=a.span`
  display:inline-flex;
  align-items:center;
  justify-content:center;
  min-width:52px;
  padding:4px 10px;
  border-radius:999px;
  font-size:12px;
  font-weight:700;
  background:#e2e8f0;
  color:#0f172a;
  &[data-status='NEW'] { background:#fef3c7; color:#b45309; }
  &[data-status='ACK'] { background:#e0e7ff; color:#4338ca; }
  &[data-status='CLOSED'] { background:#dcfce7; color:#15803d; }
`,te=a.div` color:#6b7280; font-size:12px; `,je=Ce`
  display:inline-flex; align-items:center; justify-content:center; gap:6px;
  height: 40px; padding: 0 14px; border-radius: 10px; font-weight: 700; font-size: 14px; cursor: pointer; transition: background .15s ease, color .15s ease, border-color .15s ease;
`,be=a.button`
  ${je};
  background:#111827; color:#fff; border:1px solid #111827;
  &:hover{ background:#000; border-color:#000; }
  &:disabled{ opacity:.6; cursor:not-allowed; }
`,c=a.button`
  ${je};
  background:#fff; color:#111827; border:1px solid #e5e7eb;
  &:hover{ background:#f9fafb; }
  &:disabled{ opacity:.6; cursor:not-allowed; pointer-events:none; }
`,ne=a.table`
  width:100%; border-collapse:separate; border-spacing:0; overflow:hidden; border:1px solid #e5e7eb; border-radius:12px; background:#fff;
  thead th { text-align:left; font-size:12px; color:#6b7280; font-weight:800; padding:10px 12px; border-bottom:1px solid #e5e7eb; background:#f9fafb; position:sticky; top:0; }
  tbody td { font-size:13px; color:#0f172a; padding:10px 12px; border-bottom:1px solid #f1f5f9; }
  tbody tr:nth-child(odd) td{ background:#fcfcfd; }
  tbody tr:hover td{ background:#f9fafb; }
`,se=a.div`
  width:100%; overflow:auto; border:1px solid #f1f5f9; border-radius:12px;
  table{ min-width: 520px; }
`,qe=a.ul`
  list-style:none; padding:0; margin:0; display:grid; gap:8px;
  li{ display:grid; grid-template-columns: 120px 1fr; }
  .k{ color:#6b7280; font-size:12px; font-weight:700; }
  .v{ color:#111827; font-size:14px; }
`,de=a.input`
  height:40px; border:1px solid #e5e7eb; border-radius:10px; padding:0 12px; font-size:14px; background:#fff; color:#0f172a;
`,Ge=a.div`
  display:grid; gap:12px;
`,Qe=a.div`
  display:flex; flex-wrap:wrap; gap:12px; align-items:center; justify-content:space-between;
`,ue=a.div`
  display:flex; flex-wrap:wrap; align-items:center; gap:8px;
`,Ye=a.span`
  font-size:12px; color:#64748b; font-weight:700;
`,Je=a.select`
  height:40px; border:1px solid #e5e7eb; border-radius:10px; padding:0 12px; font-size:14px; background:#fff; color:#0f172a; cursor:pointer;
`,Xe=a.div`
  display:grid; gap:12px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
`,V=a.div`
  border:1px solid #e5e7eb; border-radius:12px; padding:12px 14px;
  background:linear-gradient(180deg, #f8fafc 0%, #ffffff 85%);
  display:grid; gap:4px;
`,q=a.span`
  font-size:12px; color:#64748b; font-weight:700; letter-spacing:.02em;
`,G=a.span`
  font-size:16px; font-weight:800; color:#0f172a;
`,Q=a.span`
  font-size:12px; color:#94a3b8;
`,ae=a.div`
  display:flex; align-items:center; justify-content:center; gap:8px;
  padding:16px;
  font-size:13px; font-weight:600;
  color:${({$variant:g})=>g==="error"?"#b91c1c":"#475569"};
`;function Ze({from:g,to:f}){const[l,I]=s.useState([]),[y,x]=s.useState(!1),[M,W]=s.useState(null),[p,P]=s.useState(""),[k,Y]=s.useState(0),[d,T]=s.useState(20),[J,j]=s.useState(0),[O,$]=s.useState(0),[X,A]=s.useState(!1),{success:Z,error:R,warning:U}=ge(),D=s.useRef(d),z=s.useRef(p),u=s.useCallback(async(t,n,i)=>{x(!0),W(null);try{const h=await fe({page:t,size:n,q:i||void 0,from:g,to:f});I(h.content||[]),Y(h.page),T(h.size),j(h.totalPages),$(h.totalElements??0)}catch(h){const b=h instanceof Error?h.message:"불러오지 못했습니다.";W(b),R(b)}finally{x(!1)}},[g,f,R]);s.useEffect(()=>{D.current=d},[d]),s.useEffect(()=>{z.current=p},[p]),s.useEffect(()=>{u(0,D.current,z.current)},[g,f,u]);const B=k*d+(l.length>0?1:0),E=k*d+l.length,S=Math.max(1,J),K=s.useMemo(()=>l.length?l.reduce((t,n)=>({students:t.students+(n.students??0),courses:t.courses+(n.courses??0),apiCalls:t.apiCalls+(n.apiCalls??0),logins:t.logins+(n.logins??0),paymentCount:t.paymentCount+(n.paymentCount??0),paymentAmountCents:t.paymentAmountCents+(n.paymentAmountCents??0)}),{students:0,courses:0,apiCalls:0,logins:0,paymentCount:0,paymentAmountCents:0}):null,[l]),v=s.useMemo(()=>l.length?l.reduce((t,n)=>{const i=n.paymentAmountCents||0;return i>t.amount?{row:n,amount:i}:t},{row:null,amount:0}).row:null,[l]),o=s.useMemo(()=>l.length?l.reduce((t,n)=>{const i=(n.apiCalls||0)+(n.logins||0);return i>t.score?{row:n,score:i}:t},{row:null,score:-1/0}).row:null,[l]),N=s.useCallback(()=>{const t=p.trim();t!==p&&P(t),u(0,d,t)},[u,d,p]),ie=s.useCallback(()=>{P(""),z.current="",u(0,d,"")},[u,d]),le=s.useCallback(t=>{const n=Number(t.target.value);T(n),D.current=n,u(0,n,p)},[u,p]),_=s.useCallback(()=>{if(l.length===0){U("표시된 데이터가 없어 내보낼 수 없습니다.");return}try{A(!0);const t=["학원명","사업자번호","학생수","수업수","오늘 수업","API 호출","로그인","결제건수","결제금액(원)","최근활동"],n=l.map(m=>{const ye=[m.loginLastAt,m.apiLastAt,m.paymentLastAt].filter(Boolean).map(oe=>new Date(oe).toLocaleString("ko-KR",{dateStyle:"short",timeStyle:"short"})).sort().pop()||"";return[m.name,m.bizNo||"",String(m.students??0),String(m.courses??0),String(m.classesToday??0),String(m.apiCalls??0),String(m.logins??0),String(m.paymentCount??0),String(Math.round((m.paymentAmountCents||0)/100)),ye].map(oe=>`"${String(oe).replace(/"/g,'""')}"`).join(",")}),i=[t.join(","),...n].join(`
`),h=new Blob([`\uFEFF${i}`],{type:"text/csv;charset=utf-8;"}),b=URL.createObjectURL(h),r=document.createElement("a");r.href=b,r.download=`classon-academies-${g}-${f}.csv`,document.body.appendChild(r),r.click(),document.body.removeChild(r),URL.revokeObjectURL(b),Z("현재 목록을 CSV로 내보냈습니다.")}catch{R("CSV 내보내기에 실패했습니다.")}finally{A(!1)}},[l,U,Z,R,g,f]),F=[20,50,100],H=O>0?`${(l.length?B:0).toLocaleString("ko-KR")} – ${(l.length?E:0).toLocaleString("ko-KR")} / ${O.toLocaleString("ko-KR")}`:"0 / 0",ee=`페이지 ${(S>0?Math.min(k+1,S):1).toLocaleString("ko-KR")} / ${S.toLocaleString("ko-KR")} • ${H}`;return e.jsxs(Ge,{children:[e.jsxs(Qe,{children:[e.jsxs(ue,{children:[e.jsx(de,{placeholder:"학원명/사업자번호 검색",value:p,onChange:t=>P(t.target.value),onKeyDown:t=>{t.key==="Enter"&&(t.preventDefault(),N())}}),e.jsx(c,{as:"button",type:"button",onClick:N,disabled:y,children:"검색"}),e.jsx(c,{as:"button",type:"button",onClick:ie,disabled:!p,children:"초기화"})]}),e.jsxs(ue,{children:[e.jsx(Ye,{children:ee}),e.jsx(Je,{value:d,onChange:le,children:F.map(t=>e.jsxs("option",{value:t,children:[t,"개씩"]},t))}),e.jsx(c,{as:"button",type:"button",onClick:()=>u(Math.max(0,k-1),d,p),disabled:k<=0||y,children:"이전"}),e.jsx(c,{as:"button",type:"button",onClick:()=>u(Math.min(S-1,k+1),d,p),disabled:k>=S-1||y,children:"다음"}),e.jsx(be,{as:"button",type:"button",onClick:_,disabled:X||l.length===0,children:X?"CSV 생성 중…":"CSV 내보내기"})]})]}),e.jsxs(Xe,{children:[e.jsxs(V,{children:[e.jsx(q,{children:"현재 페이지 학원"}),e.jsxs(G,{children:[l.length.toLocaleString("ko-KR"),"개"]}),e.jsxs(Q,{children:["전체 ",O.toLocaleString("ko-KR"),"개 • ",g," ~ ",f]})]}),K?e.jsxs(V,{children:[e.jsx(q,{children:"범위 결제 합계"}),e.jsxs(G,{children:["₩",Math.round(K.paymentAmountCents/100).toLocaleString("ko-KR")]}),e.jsxs(Q,{children:[K.paymentCount.toLocaleString("ko-KR"),"건 • 학생 ",K.students.toLocaleString("ko-KR"),"명"]})]}):e.jsxs(V,{children:[e.jsx(q,{children:"범위 결제 합계"}),e.jsx(G,{children:"—"}),e.jsx(Q,{children:"데이터 없음"})]}),v&&(v.paymentAmountCents||0)>0&&e.jsxs(V,{children:[e.jsx(q,{children:"최고 결제 학원"}),e.jsx(G,{children:v.name}),e.jsxs(Q,{children:["₩",Math.round((v.paymentAmountCents||0)/100).toLocaleString("ko-KR")," • ",(v.paymentCount??0).toLocaleString("ko-KR"),"건"]})]}),o&&e.jsxs(V,{children:[e.jsx(q,{children:"활동량 상위"}),e.jsx(G,{children:o.name}),e.jsxs(Q,{children:["API ",(o.apiCalls??0).toLocaleString("ko-KR")," • 로그인 ",(o.logins??0).toLocaleString("ko-KR")]})]})]}),e.jsx(se,{children:e.jsxs(ne,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"학원"}),e.jsx("th",{children:"학생수"}),e.jsx("th",{children:"수업수"}),e.jsx("th",{children:"오늘 수업"}),e.jsx("th",{children:"API(기간)"}),e.jsx("th",{children:"로그인(기간)"}),e.jsx("th",{children:"결제건수(기간)"}),e.jsx("th",{children:"결제합계(기간/원)"})]})}),e.jsxs("tbody",{children:[y&&e.jsx("tr",{children:e.jsx("td",{colSpan:8,children:e.jsxs(ae,{children:[e.jsx(ce,{"aria-hidden":!0}),e.jsx("span",{children:"데이터를 불러오는 중…"})]})})}),!y&&M&&e.jsx("tr",{children:e.jsx("td",{colSpan:8,children:e.jsxs(ae,{$variant:"error",children:["⚠️ ",M]})})}),!y&&!M&&l.map((t,n)=>e.jsxs("tr",{children:[e.jsx("td",{children:e.jsxs("div",{style:{display:"grid"},children:[e.jsx("a",{href:L.admin+"/academies/"+(t.id||""),style:{color:"#111827",textDecoration:"underline",fontWeight:800},children:t.name}),e.jsxs("div",{style:{color:"#64748b",fontSize:12},children:[t.bizNo||"-",t.createdAt?(()=>{const i=Ke(t.createdAt,{includeWeekday:!0});return` • 가입일 ${i==="—"?t.createdAt:i}`})():"",(()=>{const i=[t.loginLastAt,t.apiLastAt,t.paymentLastAt].filter(Boolean).map(r=>new Date(r).getTime()).filter(r=>Number.isFinite(r));if(i.length===0)return"";const h=new Date(Math.max(...i)),b=me(h,{includeWeekday:!0});return` • 최근활동 ${b==="—"?h.toLocaleString("ko-KR",{hour12:!1}):b}`})()]})]})}),e.jsx("td",{children:t.students}),e.jsx("td",{children:t.courses}),e.jsx("td",{children:t.classesToday}),e.jsx("td",{children:t.apiCalls}),e.jsx("td",{children:t.logins}),e.jsx("td",{children:t.paymentCount}),e.jsx("td",{children:Math.round((t.paymentAmountCents||0)/100).toLocaleString("ko-KR")})]},t.id||n)),!y&&!M&&l.length===0&&e.jsx("tr",{children:e.jsx("td",{colSpan:8,children:e.jsx(ae,{children:"표시할 데이터가 없습니다."})})})]})]})})]})}export{it as default};
