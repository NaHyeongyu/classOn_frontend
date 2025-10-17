import{u as Le,x as Ae,b as ke,r as s,j as e,c as ze,y as N,d as a,l as Re,m as Me,L as Ee}from"./index-D-9d_yHo.js";import{S,i as C}from"./UI-DfwAVYB9.js";import{g as Ne,a as Ie,b as Ke,l as Pe}from"./admin-DquYjcbO.js";import{l as ye}from"./adminAcademies-DOVL9QnR.js";import{l as pe}from"./adminFeedback-B3DoW5wn.js";import{d as ve,a as $e}from"./format-Do6vjlY3.js";const Te=e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M3 21h18"}),e.jsx("path",{d:"M4 21V9l8-6 8 6v12"}),e.jsx("path",{d:"M9 21V12h6v9"})]}),he=e.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"22 12 18 12 15 21 9 3 6 12 2 12"})}),xe=e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("rect",{x:"2",y:"5",width:"20",height:"14",rx:"3"}),e.jsx("path",{d:"M16 12h4"}),e.jsx("path",{d:"M16 9h4"})]}),ue=e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("rect",{x:"4",y:"4",width:"16",height:"16",rx:"2"}),e.jsx("rect",{x:"9",y:"9",width:"6",height:"6",rx:"1"}),e.jsx("path",{d:"M9 2v2 M15 2v2 M9 20v2 M15 20v2 M2 9h2 M2 15h2 M20 9h2 M20 15h2"})]}),ge=e.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"m12 2 1.7 5.2L19 9l-4 3 1.5 5L12 14l-4.5 3 1.5-5-4-3 5.3-1.8L12 2z"})}),fe=e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M4 4h16l2 8-2 8H4l-2-8z"}),e.jsx("path",{d:"M4 12h5l2 3h2l2-3h5"})]}),De=e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("polyline",{points:"23 4 23 10 17 10"}),e.jsx("polyline",{points:"1 20 1 14 7 14"}),e.jsx("path",{d:"M3.51 9a9 9 0 0 1 14.63-3.36L23 10"}),e.jsx("path",{d:"M20.49 15a9 9 0 0 1-14.63 3.36L1 14"})]}),We=e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("rect",{x:"3",y:"4",width:"18",height:"14",rx:"2"}),e.jsx("path",{d:"m7 8 3 3-3 3"}),e.jsx("path",{d:"M11 16h6"})]});function bt(){const d=Le(),{admin:c,logout:l}=Ae(),{success:I,error:m}=ke(),[u,K]=s.useState(null),[U,x]=s.useState([]),[P,k]=s.useState([]),[J,h]=s.useState(!1),[$,X]=s.useState(null),[b,H]=s.useState(null),[T,Z]=s.useState(()=>{const t=new Date;return t.setDate(t.getDate()-30),t.toISOString().slice(0,10)}),[L,_]=s.useState(()=>new Date().toISOString().slice(0,10)),[A,O]=s.useState(null),[D,z]=s.useState([]),[g,V]=s.useState(null),[R,y]=s.useState(null),[M,v]=s.useState(null),p=s.useRef(!0);s.useEffect(()=>()=>{p.current=!1},[]);const E=s.useCallback(async t=>{if(!p.current)return!1;h(!0),X(null);try{v(null);const[i,r,j]=await Promise.all([Ne(),Ie(),Ke()]);let f=i;if(!i||i.academies==null)try{const o=await ye({page:0,size:1});f={...i||{},academies:o.totalElements}}catch{}if(!p.current)return!1;K(f),x(r),k(j),H(new Date);try{const o=await pe({page:0,size:5});p.current&&(z((o?.content||[]).slice(0,5)),V(typeof o?.totalElements=="number"?o.totalElements:null))}catch(o){p.current&&(z([]),V(null),v(o instanceof Error?o.message:"문의 목록을 불러오지 못했습니다."))}try{const o=await pe({status:"NEW",page:0,size:1});p.current&&y(typeof o?.totalElements=="number"?o.totalElements:null)}catch{p.current&&y(null)}return t?.silent||I("대시보드 데이터를 새로고침했습니다."),!0}catch(i){if(!p.current)return!1;const r=i instanceof Error?i.message:"대시보드 데이터를 불러오지 못했습니다.";return X(r),m(r),z([]),V(null),y(null),v("문의 데이터를 불러오지 못했습니다."),!1}finally{p.current&&h(!1)}},[I,m]);s.useEffect(()=>{E({silent:!0})},[E]),s.useEffect(()=>{let t=!1;async function i(){try{const r=await Pe({from:T,to:L,page:0,size:1});!t&&p.current&&O(r.totalElements)}catch{!t&&p.current&&O(null)}}return i(),()=>{t=!0}},[T,L]);const re=s.useMemo(()=>[{label:"전체 학원 수",value:u?.academies??"—",icon:Te},{label:"최근 30일 로그인",value:u?.logins30d??"—",icon:he},{label:"최근 30일 결제합계(원)",value:u?.paymentsAmount30d!=null?Math.round((u.paymentsAmount30d||0)/100).toLocaleString("ko-KR"):"—",icon:xe},{label:"오늘 API 호출",value:u?.apiCallsToday??"—",icon:ue},{label:"오늘 OpenAI 호출",value:u?.openaiCallsToday??"—",icon:ge},{label:"미처리 문의",value:R??"—",icon:fe}],[u,R]),oe=s.useMemo(()=>{if(!b)return null;const t=Date.now()-b.getTime(),i=Math.floor(t/6e4);if(i<1)return"방금 전";if(i<60)return`${i}분 전`;const r=Math.floor(i/60);return r<24?`${r}시간 전`:b.toLocaleString("ko-KR",{dateStyle:"medium",timeStyle:"short"})},[b]),ee=J&&!b&&!$,W=J&&!!b,B=s.useCallback(()=>{try{window.dispatchEvent(new CustomEvent("calendar:classes-refresh",{detail:{}}))}catch{}},[]),te=s.useCallback(()=>{ze(["/api/students","/api/courses","/api/calendar/classes","/api/calendar/classes-range","/api/dashboard/summary","/api/dashboard/attendance-today","/api/marketing/"]),B(),I("API 캐시를 초기화했습니다.")},[I,B]),F=s.useCallback(()=>{E()},[E]),n=s.useMemo(()=>[{title:"데이터 새로고침",description:"대시보드 요약과 로그 데이터를 즉시 갱신합니다.",icon:ge,onClick:F},{title:"캘린더 강제 새로고침",description:"클라이언트 캘린더 캐시를 초기화하고 새로고침 이벤트를 발송합니다.",icon:De,onClick:B},{title:"API 캐시 초기화",description:"학생·수업·캘린더 관련 캐시를 비워 데이터 오류를 예방합니다.",icon:ue,onClick:te},{title:"로그인 기록",description:"최근 관리자 로그인 이벤트를 확인합니다.",icon:he,href:N.admin+"/logins"},{title:"API 로그",description:"서비스 API 호출 이력을 실시간으로 살펴봅니다.",icon:We,href:N.admin+"/api-logs"},{title:"결제 기록",description:"결제 발생 내역과 상태를 점검합니다.",icon:xe,href:N.admin+"/payments"},{title:"문의/피드백",description:"사용자 문의를 처리하고 상태를 업데이트합니다.",icon:fe,href:N.admin+"/feedbacks"}],[F,B,te]);return e.jsxs(Be,{children:[e.jsxs(Fe,{children:[e.jsxs(Ue,{children:[e.jsxs(He,{children:[e.jsx("span",{className:"badge accent",children:"ADMIN PANEL"}),c?e.jsxs("span",{className:"badge muted",children:["로그인: ",c.username,c.role?` · ${c.role}`:""]}):e.jsx("span",{className:"badge warn",children:"관리자 로그인 필요"})]}),e.jsx("h1",{children:"관리자 대시보드"}),e.jsx("p",{children:"운영 현황을 빠르게 확인하고 도구를 실행하세요."}),e.jsxs(Ve,{children:[e.jsx("span",{className:"chip",children:"업데이트"}),e.jsx("span",{className:"value",title:b?b.toLocaleString("ko-KR",{dateStyle:"medium",timeStyle:"short"}):void 0,children:b?oe:"데이터 준비 중"}),W&&e.jsx(de,{"aria-hidden":!0})]})]}),e.jsxs(Oe,{children:[e.jsx(Se,{type:"button",onClick:te,children:"캐시 초기화"}),e.jsx(w,{as:"button",type:"button",onClick:F,disabled:W,children:W?e.jsxs(e.Fragment,{children:[e.jsx(de,{"aria-hidden":!0}),e.jsx("span",{children:"갱신 중…"})]}):"데이터 새로고침"}),c?e.jsx(w,{as:"button",type:"button",onClick:()=>l(),children:"로그아웃"}):e.jsx(w,{as:"button",type:"button",onClick:()=>d(N.admin+"/login"),children:"관리자 로그인"})]})]}),c?e.jsxs(be,{children:[e.jsx("span",{className:"pill",children:"로그인"}),e.jsxs("span",{className:"who",children:[c.username,c.role?` (${c.role})`:""]})]}):e.jsxs(be,{children:[e.jsx("span",{className:"pill warn",children:"주의"}),e.jsx("span",{className:"who",children:"관리자 로그인이 없으므로 일부 기능이 제한될 수 있습니다."})]}),$&&e.jsxs(qe,{role:"status",children:[e.jsx("span",{className:"label",children:"데이터 오류"}),e.jsx("span",{className:"message",children:$}),e.jsx(w,{as:"button",type:"button",onClick:F,disabled:W,children:"다시 시도"})]}),e.jsxs(Ye,{children:[e.jsxs(S,{children:[e.jsx(C,{children:"요약"}),e.jsx(Qe,{children:re.map((t,i)=>e.jsxs(Je,{"data-variant":i%3+1,"data-loading":ee?!0:void 0,children:[e.jsx("div",{className:"icon","aria-hidden":!0,children:t.icon}),e.jsx("div",{className:"content",children:ee?e.jsxs(e.Fragment,{children:[e.jsx(me,{}),e.jsx(me,{$size:"lg"})]}):e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"label",children:t.label}),e.jsx("span",{className:"value",children:t.value})]})})]},i))})]}),e.jsxs(S,{children:[e.jsx(C,{children:"빠른 작업"}),e.jsx(Ze,{children:n.map(t=>{const r=!!t.href?{as:"a",href:t.href}:{as:"button",type:"button",onClick:t.onClick};return e.jsxs(_e,{...r,children:[e.jsx("div",{className:"iconWrap","aria-hidden":!0,children:t.icon}),e.jsxs("div",{className:"body",children:[e.jsx("span",{className:"title",children:t.title}),e.jsx("span",{className:"desc",children:t.description})]})]},t.title)})})]}),e.jsxs(S,{children:[e.jsx(C,{children:"문의/피드백"}),e.jsxs(et,{children:[e.jsxs("span",{children:["총 ",g!=null?g.toLocaleString("ko-KR"):"—","건"]}),e.jsxs("span",{children:["신규 ",R!=null?R.toLocaleString("ko-KR"):"—","건"]}),e.jsx(w,{as:"a",href:N.admin+"/feedbacks",children:"전체 목록 이동"})]}),M?e.jsxs(tt,{role:"status",children:["⚠️ ",M]}):null,e.jsx(ie,{children:e.jsxs(se,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{style:{minWidth:160},children:"시간"}),e.jsx("th",{children:"제목 · 내용"}),e.jsx("th",{style:{width:90},children:"유형"}),e.jsx("th",{style:{width:90},children:"상태"}),e.jsx("th",{style:{width:160},children:"연락처"})]})}),e.jsx("tbody",{children:D.length===0?e.jsx("tr",{children:e.jsx("td",{colSpan:5,children:e.jsx(ae,{children:"표시할 문의가 없습니다."})})}):D.map(t=>e.jsxs("tr",{children:[e.jsx("td",{children:ve(t.createdAt)}),e.jsx("td",{children:e.jsxs(nt,{children:[e.jsx("span",{className:"subject",children:t.title}),t.body?e.jsx("span",{className:"excerpt",children:t.body.length>120?`${t.body.slice(0,120)}…`:t.body}):null,t.pageUrl?e.jsxs("span",{className:"meta",children:["페이지: ",t.pageUrl]}):null]})}),e.jsx("td",{children:t.type==="FEATURE"?"기능":"오류"}),e.jsx("td",{children:e.jsx(st,{"data-status":t.status,children:t.status==="NEW"?"신규":t.status==="ACK"?"확인":"종료"})}),e.jsx("td",{children:t.contact||"—"})]},t.id))})]})})]}),e.jsxs(S,{children:[e.jsx(C,{children:"운영 데이터(학원별)"}),e.jsx(ct,{from:T,to:L})]}),e.jsxs(Ge,{children:[e.jsxs(S,{children:[e.jsx(C,{children:"학원 기본정보"}),u?.academy?e.jsxs(it,{children:[e.jsxs("li",{children:[e.jsx("span",{className:"k",children:"학원명"}),e.jsx("span",{className:"v",children:u.academy.name})]}),e.jsxs("li",{children:[e.jsx("span",{className:"k",children:"ID"}),e.jsx("span",{className:"v",children:u.academy.id})]})]}):e.jsx(ne,{children:"관리자 계정에 학원 연결이 없습니다."})]}),e.jsxs(S,{children:[e.jsx(C,{children:"로그인 기록(최근)"}),e.jsx(ie,{children:e.jsxs(se,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"시간"}),e.jsx("th",{children:"아이디"}),e.jsx("th",{children:"IP"}),e.jsx("th",{children:"성공"})]})}),e.jsxs("tbody",{children:[U.map((t,i)=>e.jsxs("tr",{children:[e.jsx("td",{children:new Date(t.createdAt).toLocaleString("ko-KR",{dateStyle:"medium",timeStyle:"short"})}),e.jsx("td",{children:t.username}),e.jsx("td",{children:t.ip||"-"}),e.jsx("td",{children:t.success?"Y":"N"})]},t.id||i)),U.length===0&&e.jsx("tr",{children:e.jsx("td",{colSpan:4,children:e.jsx(ne,{children:"표시할 데이터가 없습니다."})})})]})]})})]})]}),e.jsxs(S,{children:[e.jsx(C,{children:"결제 기록(최근)"}),e.jsx(ie,{children:e.jsxs(se,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"시간"}),e.jsx("th",{children:"금액"}),e.jsx("th",{children:"통화"}),e.jsx("th",{children:"상태"}),e.jsx("th",{children:"비고"})]})}),e.jsxs("tbody",{children:[P.map((t,i)=>e.jsxs("tr",{children:[e.jsx("td",{children:new Date(t.createdAt).toLocaleString("ko-KR",{dateStyle:"medium",timeStyle:"short"})}),e.jsx("td",{children:(t.amountCents/100).toLocaleString("ko-KR")}),e.jsx("td",{children:t.currency}),e.jsx("td",{children:t.status}),e.jsx("td",{children:t.description||"-"})]},t.id||i)),P.length===0&&e.jsx("tr",{children:e.jsx("td",{colSpan:5,children:e.jsx(ne,{children:"표시할 데이터가 없습니다."})})})]})]})})]}),e.jsxs(S,{children:[e.jsx(C,{children:"범위 선택"}),e.jsxs("div",{style:{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"},children:[e.jsx("span",{className:"label",style:{color:"#6b7280",fontSize:12,fontWeight:700},children:"기간"}),e.jsx(ce,{type:"date",lang:"ko-KR",value:T,onChange:t=>Z(t.target.value)}),e.jsx("span",{children:"~"}),e.jsx(ce,{type:"date",lang:"ko-KR",value:L,onChange:t=>_(t.target.value)}),A!=null&&e.jsxs("span",{style:{color:"#334155",fontSize:12},children:["선택 기간 로그인 수: ",e.jsx("b",{children:A.toLocaleString("ko-KR")})]})]}),e.jsx(ne,{children:"아래 학원 목록의 통계 범위가 위 기간에 맞춰 적용됩니다."})]})]})]})}const Be=a.div` display:grid; gap:14px; `,Fe=a.header`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  align-items: flex-start;
  justify-content: space-between;
  padding: 28px 32px;
  border-radius: 20px;
  border: 1px solid rgba(99, 102, 241, 0.16);
  background: radial-gradient(140% 100% at 0% 0%, rgba(79, 70, 229, 0.14) 0%, rgba(59, 130, 246, 0.1) 40%, #ffffff 75%);
  box-shadow: 0 20px 45px rgba(15, 23, 42, 0.08);
  overflow: hidden;
  isolation: isolate;
  &::before {
    content: "";
    position: absolute;
    inset: -55% 35% auto -10%;
    height: 220px;
    border-radius: 50%;
    background: rgba(79, 70, 229, 0.18);
    filter: blur(90px);
    z-index: 0;
  }
  @media (max-width: 640px) {
    padding: 24px 20px;
  }
`,Ue=a.div`
  position: relative;
  z-index: 1;
  display: grid;
  gap: 12px;
  max-width: min(560px, 100%);
  h1 {
    margin: 0;
    font-size: 24px;
    font-weight: 800;
    letter-spacing: -0.01em;
    color: #0f172a;
  }
  p {
    margin: 0;
    color: #475569;
    font-size: 14px;
    line-height: 1.6;
  }
`,He=a.div`
  display: inline-flex;
  flex-wrap: wrap;
  gap: 8px;
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.02em;
    background: rgba(148, 163, 184, 0.18);
    color: #1f2937;
  }
  .badge.accent {
    background: rgba(79, 70, 229, 0.2);
    color: #312e81;
  }
  .badge.muted {
    background: rgba(148, 163, 184, 0.16);
  }
  .badge.warn {
    background: rgba(248, 113, 113, 0.22);
    color: #b91c1c;
  }
`,Oe=a.div`
  position: relative;
  z-index: 1;
  display: inline-flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  justify-content: flex-end;
  margin-left: auto;
`,Ve=a.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  color: #475569;
  .chip {
    background: rgba(59, 130, 246, 0.18);
    color: #1d4ed8;
    border-radius: 999px;
    padding: 2px 10px;
    font-weight: 700;
    letter-spacing: 0.03em;
  }
  .value {
    font-weight: 700;
    color: #0f172a;
  }
`,de=a(Ee)`
  width:16px;
  height:16px;
  flex-shrink:0;
`,be=a.div`
  display:flex;
  align-items:center;
  gap:12px;
  padding:12px 16px;
  border-radius:14px;
  border:1px dashed rgba(148, 163, 184, 0.6);
  background: rgba(241, 245, 249, 0.8);
  font-size:12px;
  color:#475569;
  .pill {
    display:inline-flex;
    align-items:center;
    gap:4px;
    border-radius:999px;
    padding:4px 10px;
    background:#111827;
    color:#fff;
    font-weight:800;
    letter-spacing:0.03em;
  }
  .pill.warn {
    background:#dc2626;
  }
  .who {
    color:#1f2937;
    font-weight:700;
  }
`,qe=a.div`
  display:flex; gap:12px; align-items:center; border:1px solid #fecaca; background:#fee2e2; color:#b91c1c; padding:12px 16px; border-radius:12px; font-size:13px; font-weight:600;
  .label { font-weight:800; letter-spacing:.02em; }
  .message { flex:1; color:#7f1d1d; }
  button { margin-left:auto; }
`,Ye=a.div`
  display:grid; gap:16px;
`,Ge=a.div`
  display:grid; gap:16px;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
`,Qe=a.div` display:grid; gap:12px; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); `,Je=a.div`
  position: relative;
  border: 1px solid rgba(226, 232, 240, 1);
  border-radius: 16px;
  padding: 18px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 14px;
  align-items: center;
  background: #ffffff;
  overflow: hidden;
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
  &:hover {
    transform: translateY(-2px);
    border-color: rgba(148, 163, 184, 0.4);
    box-shadow: 0 16px 32px rgba(15, 23, 42, 0.08);
  }
  &:before {
    content: '';
    position: absolute;
    inset: auto -25% -35% -25%;
    height: 60%;
    background: var(--kpi-bg, #eef2ff);
    filter: blur(28px);
    z-index: 0;
  }
  &[data-variant='1'] { --kpi-bg:#e0e7ff; --kpi-icon-bg:rgba(224,231,255,0.7); --kpi-icon-color:#4338ca; }
  &[data-variant='2'] { --kpi-bg:#dcfce7; --kpi-icon-bg:rgba(187,247,208,0.7); --kpi-icon-color:#15803d; }
  &[data-variant='3'] { --kpi-bg:#fee2e2; --kpi-icon-bg:rgba(254,215,215,0.7); --kpi-icon-color:#b91c1c; }
  &[data-loading] {
    background: #f8fafc;
  }
  &[data-loading]:before {
    opacity: 0;
  }
  &[data-loading] .icon {
    background: rgba(226, 232, 240, 0.8);
    color: #94a3b8;
  }
  .icon {
    position: relative;
    z-index: 1;
    display: grid;
    place-items: center;
    width: 48px;
    height: 48px;
    border-radius: 14px;
    background: var(--kpi-icon-bg, rgba(224, 231, 255, 0.7));
    color: var(--kpi-icon-color, #4338ca);
    flex-shrink: 0;
  }
  .content {
    position: relative;
    z-index: 1;
    display: grid;
    gap: 6px;
  }
  .label { color:#6b7280; font-size:12px; font-weight:700; letter-spacing:0.01em; }
  .value { color:#0f172a; font-size:20px; font-weight:800; letter-spacing:-0.01em; }
`,Xe=Me`
  0% { background-position: 100% 0; }
  100% { background-position: 0 0; }
`,me=a.span`
  display:block;
  width:60%;
  height:${({$size:d})=>d==="lg"?"20px":"12px"};
  border-radius:999px;
  background:linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 50%, #f1f5f9 100%);
  background-size:200% 100%;
  animation:${Xe} 1.2s ease-in-out infinite;
`,Ze=a.div`
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
`,_e=a.button`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  background: #ffffff;
  color: #0f172a;
  text-align: left;
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease, background 0.18s ease;
  text-decoration: none;
  position: relative;
  z-index: 0;
  .iconWrap {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: rgba(224, 231, 255, 0.6);
    color: #4338ca;
    flex-shrink: 0;
  }
  .body {
    display: grid;
    gap: 6px;
  }
  .title {
    font-size: 14px;
    font-weight: 700;
    letter-spacing: -0.005em;
  }
  .desc {
    font-size: 12px;
    color: #475569;
    line-height: 1.5;
  }
  &:hover {
    transform: translateY(-2px);
    border-color: rgba(99, 102, 241, 0.35);
    box-shadow: 0 16px 32px rgba(15, 23, 42, 0.12);
  }
  &:focus-visible {
    outline: 2px solid rgba(79, 70, 229, 0.55);
    outline-offset: 2px;
  }
  &:active {
    transform: translateY(0);
    box-shadow: 0 6px 18px rgba(15, 23, 42, 0.12);
  }
  &[href] {
    cursor: pointer;
  }
`,et=a.div`
  display:flex;
  align-items:center;
  flex-wrap:wrap;
  gap:10px;
  margin-bottom:10px;
  font-size:12px;
  color:#475569;
  span { font-weight:700; }
  a { margin-left:auto; }
`,tt=a.div`
  margin-bottom:8px;
  padding:10px 12px;
  border-radius:10px;
  border:1px solid #fecaca;
  background:#fef2f2;
  color:#b91c1c;
  font-size:12px;
  font-weight:600;
`,nt=a.div`
  display:grid;
  gap:4px;
  .subject { font-weight:700; color:#111827; }
  .excerpt { color:#475569; font-size:12px; line-height:1.5; white-space:pre-line; }
  .meta { color:#94a3b8; font-size:11px; }
`,st=a.span`
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
`,ne=a.div` color:#6b7280; font-size:12px; `,we=Re`
  display:inline-flex; align-items:center; justify-content:center; gap:6px;
  height: 40px; padding: 0 14px; border-radius: 10px; font-weight: 700; font-size: 14px; cursor: pointer; transition: background .15s ease, color .15s ease, border-color .15s ease;
`,Se=a.button`
  ${we};
  background:#111827; color:#fff; border:1px solid #111827;
  &:hover{ background:#000; border-color:#000; }
  &:disabled{ opacity:.6; cursor:not-allowed; }
`,w=a.button`
  ${we};
  background:#fff; color:#111827; border:1px solid #e5e7eb;
  &:hover{ background:#f9fafb; }
  &:disabled{ opacity:.6; cursor:not-allowed; pointer-events:none; }
`,se=a.table`
  width:100%; border-collapse:separate; border-spacing:0; overflow:hidden; border:1px solid #e5e7eb; border-radius:12px; background:#fff;
  thead th { text-align:left; font-size:12px; color:#6b7280; font-weight:800; padding:10px 12px; border-bottom:1px solid #e5e7eb; background:#f9fafb; position:sticky; top:0; }
  tbody td { font-size:13px; color:#0f172a; padding:10px 12px; border-bottom:1px solid #f1f5f9; }
  tbody tr:nth-child(odd) td{ background:#fcfcfd; }
  tbody tr:hover td{ background:#f9fafb; }
`,ie=a.div`
  width:100%; overflow:auto; border:1px solid #f1f5f9; border-radius:12px;
  table{ min-width: 520px; }
`,it=a.ul`
  list-style:none; padding:0; margin:0; display:grid; gap:8px;
  li{ display:grid; grid-template-columns: 120px 1fr; }
  .k{ color:#6b7280; font-size:12px; font-weight:700; }
  .v{ color:#111827; font-size:14px; }
`,ce=a.input`
  height:40px; border:1px solid #e5e7eb; border-radius:10px; padding:0 12px; font-size:14px; background:#fff; color:#0f172a;
`,at=a.div`
  display:grid; gap:12px;
`,rt=a.div`
  display:flex; flex-wrap:wrap; gap:12px; align-items:center; justify-content:space-between;
`,je=a.div`
  display:flex; flex-wrap:wrap; align-items:center; gap:8px;
`,ot=a.span`
  font-size:12px; color:#64748b; font-weight:700;
`,lt=a.select`
  height:40px; border:1px solid #e5e7eb; border-radius:10px; padding:0 12px; font-size:14px; background:#fff; color:#0f172a; cursor:pointer;
`,dt=a.div`
  display:grid; gap:12px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
`,q=a.div`
  border:1px solid #e5e7eb; border-radius:12px; padding:12px 14px;
  background:linear-gradient(180deg, #f8fafc 0%, #ffffff 85%);
  display:grid; gap:4px;
`,Y=a.span`
  font-size:12px; color:#64748b; font-weight:700; letter-spacing:.02em;
`,G=a.span`
  font-size:16px; font-weight:800; color:#0f172a;
`,Q=a.span`
  font-size:12px; color:#94a3b8;
`,ae=a.div`
  display:flex;
  align-items:center;
  justify-content:center;
  gap:8px;
  padding:18px;
  font-size:13px;
  font-weight:600;
  color:${({$variant:d})=>d==="error"?"#b91c1c":"#475569"};
  background:${({$variant:d})=>d==="error"?"rgba(254, 242, 242, 0.9)":"rgba(241, 245, 249, 0.9)"};
  border:1px dashed ${({$variant:d})=>d==="error"?"rgba(248, 113, 113, 0.6)":"rgba(148, 163, 184, 0.5)"};
  border-radius:12px;
`;function ct({from:d,to:c}){const[l,I]=s.useState([]),[m,u]=s.useState(!1),[K,U]=s.useState(null),[x,P]=s.useState(""),[k,J]=s.useState(0),[h,$]=s.useState(20),[X,b]=s.useState(0),[H,T]=s.useState(0),[Z,L]=s.useState(!1),{success:_,error:A,warning:O}=ke(),D=s.useRef(h),z=s.useRef(x),g=s.useCallback(async(n,t,i)=>{u(!0),U(null);try{const r=await ye({page:n,size:t,q:i||void 0,from:d,to:c});I(r.content||[]),J(r.page),$(r.size),b(r.totalPages),T(r.totalElements??0)}catch(r){const j=r instanceof Error?r.message:"불러오지 못했습니다.";U(j),A(j)}finally{u(!1)}},[d,c,A]);s.useEffect(()=>{D.current=h},[h]),s.useEffect(()=>{z.current=x},[x]),s.useEffect(()=>{g(0,D.current,z.current)},[d,c,g]);const V=k*h+(l.length>0?1:0),R=k*h+l.length,y=Math.max(1,X),M=s.useMemo(()=>l.length?l.reduce((n,t)=>({students:n.students+(t.students??0),courses:n.courses+(t.courses??0),apiCalls:n.apiCalls+(t.apiCalls??0),logins:n.logins+(t.logins??0),paymentCount:n.paymentCount+(t.paymentCount??0),paymentAmountCents:n.paymentAmountCents+(t.paymentAmountCents??0)}),{students:0,courses:0,apiCalls:0,logins:0,paymentCount:0,paymentAmountCents:0}):null,[l]),v=s.useMemo(()=>l.length?l.reduce((n,t)=>{const i=t.paymentAmountCents||0;return i>n.amount?{row:t,amount:i}:n},{row:null,amount:0}).row:null,[l]),p=s.useMemo(()=>l.length?l.reduce((n,t)=>{const i=(t.apiCalls||0)+(t.logins||0);return i>n.score?{row:t,score:i}:n},{row:null,score:-1/0}).row:null,[l]),E=s.useCallback(()=>{const n=x.trim();n!==x&&P(n),g(0,h,n)},[g,h,x]),re=s.useCallback(()=>{P(""),z.current="",g(0,h,"")},[g,h]),oe=s.useCallback(n=>{const t=Number(n.target.value);$(t),D.current=t,g(0,t,x)},[g,x]),ee=s.useCallback(()=>{if(l.length===0){O("표시된 데이터가 없어 내보낼 수 없습니다.");return}try{L(!0);const n=["학원명","사업자번호","학생수","수업수","오늘 수업","API 호출","로그인","결제건수","결제금액(원)","최근활동"],t=l.map(o=>{const Ce=[o.loginLastAt,o.apiLastAt,o.paymentLastAt].filter(Boolean).map(le=>new Date(le).toLocaleString("ko-KR",{dateStyle:"short",timeStyle:"short"})).sort().pop()||"";return[o.name,o.bizNo||"",String(o.students??0),String(o.courses??0),String(o.classesToday??0),String(o.apiCalls??0),String(o.logins??0),String(o.paymentCount??0),String(Math.round((o.paymentAmountCents||0)/100)),Ce].map(le=>`"${String(le).replace(/"/g,'""')}"`).join(",")}),i=[n.join(","),...t].join(`
`),r=new Blob([`\uFEFF${i}`],{type:"text/csv;charset=utf-8;"}),j=URL.createObjectURL(r),f=document.createElement("a");f.href=j,f.download=`classon-academies-${d}-${c}.csv`,document.body.appendChild(f),f.click(),document.body.removeChild(f),URL.revokeObjectURL(j),_("현재 목록을 CSV로 내보냈습니다.")}catch{A("CSV 내보내기에 실패했습니다.")}finally{L(!1)}},[l,O,_,A,d,c]),W=[20,50,100],B=H>0?`${(l.length?V:0).toLocaleString("ko-KR")} – ${(l.length?R:0).toLocaleString("ko-KR")} / ${H.toLocaleString("ko-KR")}`:"0 / 0",F=`페이지 ${(y>0?Math.min(k+1,y):1).toLocaleString("ko-KR")} / ${y.toLocaleString("ko-KR")} • ${B}`;return e.jsxs(at,{children:[e.jsxs(rt,{children:[e.jsxs(je,{children:[e.jsx(ce,{placeholder:"학원명/사업자번호 검색",value:x,onChange:n=>P(n.target.value),onKeyDown:n=>{n.key==="Enter"&&(n.preventDefault(),E())}}),e.jsx(w,{as:"button",type:"button",onClick:E,disabled:m,children:"검색"}),e.jsx(w,{as:"button",type:"button",onClick:re,disabled:!x,children:"초기화"})]}),e.jsxs(je,{children:[e.jsx(ot,{children:F}),e.jsx(lt,{value:h,onChange:oe,children:W.map(n=>e.jsxs("option",{value:n,children:[n,"개씩"]},n))}),e.jsx(w,{as:"button",type:"button",onClick:()=>g(Math.max(0,k-1),h,x),disabled:k<=0||m,children:"이전"}),e.jsx(w,{as:"button",type:"button",onClick:()=>g(Math.min(y-1,k+1),h,x),disabled:k>=y-1||m,children:"다음"}),e.jsx(Se,{as:"button",type:"button",onClick:ee,disabled:Z||l.length===0,children:Z?"CSV 생성 중…":"CSV 내보내기"})]})]}),e.jsxs(dt,{children:[e.jsxs(q,{children:[e.jsx(Y,{children:"현재 페이지 학원"}),e.jsxs(G,{children:[l.length.toLocaleString("ko-KR"),"개"]}),e.jsxs(Q,{children:["전체 ",H.toLocaleString("ko-KR"),"개 • ",d," ~ ",c]})]}),M?e.jsxs(q,{children:[e.jsx(Y,{children:"범위 결제 합계"}),e.jsxs(G,{children:["₩",Math.round(M.paymentAmountCents/100).toLocaleString("ko-KR")]}),e.jsxs(Q,{children:[M.paymentCount.toLocaleString("ko-KR"),"건 • 학생 ",M.students.toLocaleString("ko-KR"),"명"]})]}):e.jsxs(q,{children:[e.jsx(Y,{children:"범위 결제 합계"}),e.jsx(G,{children:"—"}),e.jsx(Q,{children:"데이터 없음"})]}),v&&(v.paymentAmountCents||0)>0&&e.jsxs(q,{children:[e.jsx(Y,{children:"최고 결제 학원"}),e.jsx(G,{children:v.name}),e.jsxs(Q,{children:["₩",Math.round((v.paymentAmountCents||0)/100).toLocaleString("ko-KR")," • ",(v.paymentCount??0).toLocaleString("ko-KR"),"건"]})]}),p&&e.jsxs(q,{children:[e.jsx(Y,{children:"활동량 상위"}),e.jsx(G,{children:p.name}),e.jsxs(Q,{children:["API ",(p.apiCalls??0).toLocaleString("ko-KR")," • 로그인 ",(p.logins??0).toLocaleString("ko-KR")]})]})]}),e.jsx(ie,{children:e.jsxs(se,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"학원"}),e.jsx("th",{children:"학생수"}),e.jsx("th",{children:"수업수"}),e.jsx("th",{children:"오늘 수업"}),e.jsx("th",{children:"API(기간)"}),e.jsx("th",{children:"로그인(기간)"}),e.jsx("th",{children:"결제건수(기간)"}),e.jsx("th",{children:"결제합계(기간/원)"})]})}),e.jsxs("tbody",{children:[m&&e.jsx("tr",{children:e.jsx("td",{colSpan:8,children:e.jsxs(ae,{children:[e.jsx(de,{"aria-hidden":!0}),e.jsx("span",{children:"데이터를 불러오는 중…"})]})})}),!m&&K&&e.jsx("tr",{children:e.jsx("td",{colSpan:8,children:e.jsxs(ae,{$variant:"error",children:["⚠️ ",K]})})}),!m&&!K&&l.map((n,t)=>e.jsxs("tr",{children:[e.jsx("td",{children:e.jsxs("div",{style:{display:"grid"},children:[e.jsx("a",{href:N.admin+"/academies/"+(n.id||""),style:{color:"#111827",textDecoration:"underline",fontWeight:800},children:n.name}),e.jsxs("div",{style:{color:"#64748b",fontSize:12},children:[n.bizNo||"-",n.createdAt?(()=>{const i=$e(n.createdAt,{includeWeekday:!0});return` • 가입일 ${i==="—"?n.createdAt:i}`})():"",(()=>{const i=[n.loginLastAt,n.apiLastAt,n.paymentLastAt].filter(Boolean).map(f=>new Date(f).getTime()).filter(f=>Number.isFinite(f));if(i.length===0)return"";const r=new Date(Math.max(...i)),j=ve(r,{includeWeekday:!0});return` • 최근활동 ${j==="—"?r.toLocaleString("ko-KR",{hour12:!1}):j}`})()]})]})}),e.jsx("td",{children:n.students}),e.jsx("td",{children:n.courses}),e.jsx("td",{children:n.classesToday}),e.jsx("td",{children:n.apiCalls}),e.jsx("td",{children:n.logins}),e.jsx("td",{children:n.paymentCount}),e.jsx("td",{children:Math.round((n.paymentAmountCents||0)/100).toLocaleString("ko-KR")})]},n.id||t)),!m&&!K&&l.length===0&&e.jsx("tr",{children:e.jsx("td",{colSpan:8,children:e.jsx(ae,{children:"표시할 데이터가 없습니다."})})})]})]})})]})}export{bt as default};
