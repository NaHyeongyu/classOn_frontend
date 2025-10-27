import{j as e,d as o,l as Z,L as _,C as ee,a as S,r as s,R as te,i as ne,u as re,c as oe}from"./index-B0K7mn4q.js";import{d as ie}from"./format-DW-Kl_C3.js";import{P as se,G as ae,C as W,a as D,b as K,T as de,c as le,d as ce}from"./AdminStyles-Chj6B07V.js";import{g as pe,a as he,b as xe,l as ue}from"./admin-DSlJSHO4.js";import{l as fe}from"./adminAcademies-CBKU-oZ4.js";import{l as Y}from"./adminFeedback-DkRBYDOp.js";function ge({adminName:n,adminRole:t,isLoggedIn:i,lastUpdatedLabel:d,isRefreshing:r,onRefresh:c,onClearCaches:g,onLogout:a,onLogin:b}){return e.jsxs(be,{children:[e.jsxs(me,{children:[e.jsxs(je,{children:[e.jsx("span",{className:"badge accent",children:"ADMIN PANEL"}),i?e.jsxs("span",{className:"badge muted",children:["로그인: ",n,t?` · ${t}`:""]}):e.jsx("span",{className:"badge warn",children:"관리자 로그인 필요"})]}),e.jsx("h1",{children:"관리자 대시보드"}),e.jsx("p",{children:"운영 현황을 빠르게 확인하고 도구를 실행하세요."}),e.jsxs(ke,{children:[e.jsx("span",{className:"chip",children:"업데이트"}),e.jsx("span",{className:"value",children:d??"데이터 준비 중"}),r?e.jsx(Q,{"aria-hidden":!0}):null]})]}),e.jsxs(we,{children:[e.jsx(ve,{type:"button",onClick:g,children:"캐시 초기화"}),e.jsx(H,{as:"button",type:"button",onClick:c,disabled:r,children:r?e.jsxs(e.Fragment,{children:[e.jsx(Q,{"aria-hidden":!0}),e.jsx("span",{children:"갱신 중…"})]}):"데이터 새로고침"}),i?e.jsx(H,{as:"button",type:"button",onClick:a,children:"로그아웃"}):e.jsx(H,{as:"button",type:"button",onClick:b,children:"관리자 로그인"})]})]})}const be=o.header`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  align-items: flex-start;
  justify-content: space-between;
  padding: 28px 32px;
  border-radius: 20px;
  border: 1px solid rgba(99, 102, 241, 0.16);
  background: radial-gradient(
    140% 100% at 0% 0%,
    rgba(79, 70, 229, 0.14) 0%,
    rgba(59, 130, 246, 0.1) 40%,
    #ffffff 75%
  );
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
`,me=o.div`
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
`,je=o.div`
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
    letter-spacing: 0.04em;
    font-weight: 700;
  }
  .badge.accent {
    background: rgba(99, 102, 241, 0.16);
    color: #312e81;
  }
  .badge.muted {
    background: rgba(241, 245, 249, 0.85);
    color: #475569;
  }
  .badge.warn {
    background: #fee2e2;
    color: #b91c1c;
  }
`,ke=o.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  .chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: rgba(15, 23, 42, 0.06);
    color: #1f2937;
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.02em;
  }
  .value {
    font-size: 13px;
    font-weight: 700;
    color: #0f172a;
  }
`,we=o.div`
  position: relative;
  z-index: 1;
  display: inline-flex;
  flex-wrap: wrap;
  gap: 10px;
`,J=Z`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 40px;
  padding: 0 14px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition:
    background 0.15s ease,
    color 0.15s ease,
    border-color 0.15s ease;
`,ve=o.button`
  ${J};
  background: #111827;
  color: #fff;
  border: 1px solid #111827;
  &:hover {
    background: #000;
    border-color: #000;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`,H=o.button`
  ${J};
  background: #fff;
  color: #111827;
  border: 1px solid #e5e7eb;
  &:hover {
    background: #f9fafb;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  }
`,Q=o(_)`
  width: 16px;
  height: 16px;
  flex-shrink: 0;
`;function ye({isLoggedIn:n,username:t,role:i}){return e.jsxs(Le,{children:[e.jsx("span",{className:`pill ${n?"":"warn"}`,children:n?"로그인":"주의"}),e.jsx("span",{className:"who",children:n?`${t}${i?` (${i})`:""}`:"관리자 로그인이 없으므로 일부 기능이 제한될 수 있습니다."})]})}const Le=o.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 14px;
  border: 1px dashed rgba(148, 163, 184, 0.6);
  background: rgba(241, 245, 249, 0.8);
  font-size: 12px;
  color: #475569;
  .pill {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    border-radius: 999px;
    padding: 4px 10px;
    background: #111827;
    color: #fff;
    font-weight: 800;
    letter-spacing: 0.03em;
  }
  .pill.warn {
    background: #dc2626;
  }
  .who {
    color: #1f2937;
    font-weight: 700;
  }
`;function Ce({actions:n}){return e.jsx(Se,{children:n.map(t=>{const d=!!t.href?{as:"a",href:t.href}:{as:"button",type:"button",onClick:t.onClick};return e.jsxs(ze,{...d,children:[e.jsx("div",{className:"iconWrap","aria-hidden":!0,children:Me(t.icon)}),e.jsxs("div",{className:"body",children:[e.jsx("span",{className:"title",children:t.title}),e.jsx("span",{className:"desc",children:t.description})]})]},t.title)})})}const Se=o.div`
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
`,ze=o.button`
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
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    border-color 0.18s ease,
    background 0.18s ease;
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
`;function Me(n){switch(n){case"spark":return e.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"m12 2 1.7 5.2L19 9l-4 3 1.5 5L12 14l-4.5 3 1.5-5-4-3 5.3-1.8L12 2z"})});case"refresh":return e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("polyline",{points:"23 4 23 10 17 10"}),e.jsx("polyline",{points:"1 20 1 14 7 14"}),e.jsx("path",{d:"M3.51 9a9 9 0 0 1 14.63-3.36L23 10"}),e.jsx("path",{d:"M20.49 15a9 9 0 0 1-14.63 3.36L1 14"})]});case"cpu":return e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("rect",{x:"4",y:"4",width:"16",height:"16",rx:"2"}),e.jsx("rect",{x:"9",y:"9",width:"6",height:"6",rx:"1"}),e.jsx("path",{d:"M9 2v2 M15 2v2 M9 20v2 M15 20v2 M2 9h2 M2 15h2 M20 9h2 M20 15h2"})]});case"activity":return e.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"22 12 18 12 15 21 9 3 6 12 2 12"})});case"terminal":return e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("rect",{x:"3",y:"4",width:"18",height:"14",rx:"2"}),e.jsx("path",{d:"m7 8 3 3-3 3"}),e.jsx("path",{d:"M11 16h6"})]});case"wallet":return e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("rect",{x:"2",y:"5",width:"20",height:"14",rx:"3"}),e.jsx("path",{d:"M16 12h4"}),e.jsx("path",{d:"M16 9h4"})]});case"inbox":return e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M4 4h16l2 8-2 8H4l-2-8z"}),e.jsx("path",{d:"M4 12h5l2 3h2l2-3h5"})]});default:return null}}function Ae({items:n,loading:t}){return e.jsx(Re,{children:n.map((i,d)=>e.jsxs(Ne,{"data-variant":d%3+1,"data-loading":t?!0:void 0,children:[e.jsx("div",{className:"icon","aria-hidden":!0,children:Ee(i.id)}),e.jsx("div",{className:"content",children:t?e.jsxs(e.Fragment,{children:[e.jsx(V,{}),e.jsx(V,{$size:"lg"})]}):e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"label",children:i.label}),e.jsx("span",{className:"value",children:i.value})]})})]},i.id))})}const Re=o.div`
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
`,Ne=o.div`
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
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    border-color 0.18s ease;
  &:hover {
    transform: translateY(-2px);
    border-color: rgba(148, 163, 184, 0.4);
    box-shadow: 0 16px 32px rgba(15, 23, 42, 0.08);
  }
  &:before {
    content: "";
    position: absolute;
    inset: auto -25% -35% -25%;
    height: 60%;
    background: var(--kpi-bg, #eef2ff);
    filter: blur(28px);
    z-index: 0;
  }
  &[data-variant="1"] {
    --kpi-bg: #e0e7ff;
    --kpi-icon-bg: rgba(224, 231, 255, 0.7);
    --kpi-icon-color: #4338ca;
  }
  &[data-variant="2"] {
    --kpi-bg: #dcfce7;
    --kpi-icon-bg: rgba(187, 247, 208, 0.7);
    --kpi-icon-color: #15803d;
  }
  &[data-variant="3"] {
    --kpi-bg: #fee2e2;
    --kpi-icon-bg: rgba(254, 215, 215, 0.7);
    --kpi-icon-color: #b91c1c;
  }
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
  .label {
    color: #6b7280;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.01em;
  }
  .value {
    color: #0f172a;
    font-size: 20px;
    font-weight: 800;
    letter-spacing: -0.01em;
  }
`,Te=ee`
  0% { background-position: 100% 0; }
  100% { background-position: 0 0; }
`,V=o.span`
  display: block;
  width: 60%;
  height: ${({$size:n})=>n==="lg"?"20px":"12px"};
  border-radius: 999px;
  background: linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 50%, #f1f5f9 100%);
  background-size: 200% 100%;
  animation: ${Te} 1.2s ease-in-out infinite;
`;function Ee(n){switch(n){case"academies":return e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M3 21h18"}),e.jsx("path",{d:"M4 21V9l8-6 8 6v12"}),e.jsx("path",{d:"M9 21V12h6v9"})]});case"logins30d":return e.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"22 12 18 12 15 21 9 3 6 12 2 12"})});case"paymentsAmount30d":return e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("rect",{x:"2",y:"5",width:"20",height:"14",rx:"3"}),e.jsx("path",{d:"M16 12h4"}),e.jsx("path",{d:"M16 9h4"})]});case"apiCallsToday":return e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("rect",{x:"4",y:"4",width:"16",height:"16",rx:"2"}),e.jsx("rect",{x:"9",y:"9",width:"6",height:"6",rx:"1"}),e.jsx("path",{d:"M9 2v2 M15 2v2 M9 20v2 M15 20v2 M2 9h2 M2 15h2 M20 9h2 M20 15h2"})]});case"openaiCallsToday":return e.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"m12 2 1.7 5.2L19 9l-4 3 1.5 5L12 14l-4.5 3 1.5-5-4-3 5.3-1.8L12 2z"})});case"feedbackNew":return e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M4 4h16l2 8-2 8H4l-2-8z"}),e.jsx("path",{d:"M4 12h5l2 3h2l2-3h5"})]});default:return null}}function Ie({logs:n}){return e.jsx(Be,{children:e.jsxs(Pe,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"시간"}),e.jsx("th",{children:"아이디"}),e.jsx("th",{children:"IP"}),e.jsx("th",{children:"성공"})]})}),e.jsx("tbody",{children:n.length===0?e.jsx("tr",{children:e.jsx("td",{colSpan:4,children:e.jsx(We,{children:"표시할 데이터가 없습니다."})})}):n.map((t,i)=>e.jsxs("tr",{children:[e.jsx("td",{children:new Date(t.createdAt).toLocaleString("ko-KR",{dateStyle:"medium",timeStyle:"short"})}),e.jsx("td",{children:t.username}),e.jsx("td",{children:t.ip||"-"}),e.jsx("td",{children:t.success?"Y":"N"})]},t.id||i))})]})})}const Be=o.div`
  width: 100%;
  overflow: auto;
  border: 1px solid #f1f5f9;
  border-radius: 12px;
`,Pe=o.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fff;
  thead th {
    text-align: left;
    font-size: 12px;
    color: #6b7280;
    font-weight: 800;
    padding: 10px 12px;
    border-bottom: 1px solid #e5e7eb;
    background: #f9fafb;
  }
  tbody td {
    font-size: 13px;
    color: #0f172a;
    padding: 10px 12px;
    border-bottom: 1px solid #f1f5f9;
  }
  tbody tr:nth-child(odd) td {
    background: #fcfcfd;
  }
  tbody tr:hover td {
    background: #f9fafb;
  }
`,We=o.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 18px;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  background: rgba(241, 245, 249, 0.9);
  border: 1px dashed rgba(148, 163, 184, 0.5);
  border-radius: 12px;
`;function Ke({payments:n}){return e.jsx($e,{children:e.jsxs(Fe,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"시간"}),e.jsx("th",{children:"금액"}),e.jsx("th",{children:"통화"}),e.jsx("th",{children:"상태"}),e.jsx("th",{children:"비고"})]})}),e.jsx("tbody",{children:n.length===0?e.jsx("tr",{children:e.jsx("td",{colSpan:5,children:e.jsx(De,{children:"표시할 데이터가 없습니다."})})}):n.map((t,i)=>e.jsxs("tr",{children:[e.jsx("td",{children:new Date(t.createdAt).toLocaleString("ko-KR",{dateStyle:"medium",timeStyle:"short"})}),e.jsx("td",{children:(t.amountCents/100).toLocaleString("ko-KR")}),e.jsx("td",{children:t.currency}),e.jsx("td",{children:t.status}),e.jsx("td",{children:t.description||"-"})]},t.id||i))})]})})}const $e=o.div`
  width: 100%;
  overflow: auto;
  border: 1px solid #f1f5f9;
  border-radius: 12px;
`,Fe=o.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fff;
  thead th {
    text-align: left;
    font-size: 12px;
    color: #6b7280;
    font-weight: 800;
    padding: 10px 12px;
    border-bottom: 1px solid #e5e7eb;
    background: #f9fafb;
  }
  tbody td {
    font-size: 13px;
    color: #0f172a;
    padding: 10px 12px;
    border-bottom: 1px solid #f1f5f9;
  }
  tbody tr:nth-child(odd) td {
    background: #fcfcfd;
  }
  tbody tr:hover td {
    background: #f9fafb;
  }
`,De=o.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 18px;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  background: rgba(241, 245, 249, 0.9);
  border: 1px dashed rgba(148, 163, 184, 0.5);
  border-radius: 12px;
`;function He({rows:n,total:t,newCount:i,error:d}){return e.jsxs("div",{children:[e.jsxs(Ue,{children:[e.jsxs("span",{children:["총 ",t!=null?t.toLocaleString("ko-KR"):"—","건"]}),e.jsxs("span",{children:["신규 ",i!=null?i.toLocaleString("ko-KR"):"—","건"]}),e.jsx(Oe,{href:S.admin+"/feedbacks",children:"전체 목록 이동"})]}),d?e.jsxs(Ge,{role:"status",children:["⚠️ ",d]}):null,e.jsx(Ye,{children:e.jsxs(Qe,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{style:{minWidth:160},children:"시간"}),e.jsx("th",{children:"제목 · 내용"}),e.jsx("th",{style:{width:90},children:"유형"}),e.jsx("th",{style:{width:90},children:"상태"}),e.jsx("th",{style:{width:160},children:"연락처"})]})}),e.jsx("tbody",{children:n.length===0?e.jsx("tr",{children:e.jsx("td",{colSpan:5,children:e.jsx(Ve,{children:"표시할 문의가 없습니다."})})}):n.map(r=>e.jsxs("tr",{children:[e.jsx("td",{children:ie(r.createdAt)}),e.jsx("td",{children:e.jsxs(qe,{children:[e.jsx("span",{className:"subject",children:r.title}),r.body?e.jsx("span",{className:"excerpt",children:r.body.length>120?`${r.body.slice(0,120)}…`:r.body}):null,r.pageUrl?e.jsxs("span",{className:"meta",children:["페이지: ",r.pageUrl]}):null]})}),e.jsx("td",{children:r.type==="FEATURE"?"기능":"오류"}),e.jsx("td",{children:e.jsx(Je,{"data-status":r.status,children:r.status==="NEW"?"신규":r.status==="ACK"?"확인":"종료"})}),e.jsx("td",{children:r.contact||"—"})]},r.id))})]})})]})}const Ue=o.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
  font-size: 12px;
  color: #475569;
  span {
    font-weight: 700;
  }
`,Oe=o.a`
  margin-left: auto;
  font-size: 12px;
  color: ${({theme:n})=>n.colors.primary};
  text-decoration: underline;
`,Ge=o.div`
  margin-bottom: 8px;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #fecaca;
  background: #fef2f2;
  color: #b91c1c;
  font-size: 12px;
  font-weight: 600;
`,Ye=o.div`
  width: 100%;
  overflow: auto;
  border: 1px solid #f1f5f9;
  border-radius: 12px;
`,Qe=o.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fff;
  thead th {
    text-align: left;
    font-size: 12px;
    color: #6b7280;
    font-weight: 800;
    padding: 10px 12px;
    border-bottom: 1px solid #e5e7eb;
    background: #f9fafb;
  }
  tbody td {
    font-size: 13px;
    color: #0f172a;
    padding: 10px 12px;
    border-bottom: 1px solid #f1f5f9;
  }
  tbody tr:nth-child(odd) td {
    background: #fcfcfd;
  }
  tbody tr:hover td {
    background: #f9fafb;
  }
`,Ve=o.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 18px;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  background: rgba(241, 245, 249, 0.9);
  border: 1px dashed rgba(148, 163, 184, 0.5);
  border-radius: 12px;
`,qe=o.div`
  display: grid;
  gap: 4px;
  .subject {
    font-weight: 700;
    color: #111827;
  }
  .excerpt {
    color: #475569;
    font-size: 12px;
    line-height: 1.5;
    white-space: pre-line;
  }
  .meta {
    color: #94a3b8;
    font-size: 11px;
  }
`,Je=o.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 52px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  background: #e2e8f0;
  color: #0f172a;
  &[data-status="NEW"] {
    background: #fef3c7;
    color: #b45309;
  }
  &[data-status="ACK"] {
    background: #e0e7ff;
    color: #4338ca;
  }
  &[data-status="CLOSED"] {
    background: #dcfce7;
    color: #15803d;
  }
`;function Xe({from:n,to:t,onChangeFrom:i,onChangeTo:d,loginsInRange:r}){return e.jsxs(Ze,{children:[e.jsxs(_e,{children:[e.jsx("span",{className:"label",children:"기간"}),e.jsxs(et,{children:[e.jsx(q,{type:"date",lang:"ko-KR",value:n,onChange:c=>i(c.target.value)}),e.jsx("span",{children:"~"}),e.jsx(q,{type:"date",lang:"ko-KR",value:t,onChange:c=>d(c.target.value)}),r!=null?e.jsxs(tt,{children:["선택 기간 로그인 수: ",e.jsx("b",{children:r.toLocaleString("ko-KR")})]}):null]})]}),e.jsx(nt,{children:"아래 학원 목록의 통계 범위가 위 기간에 맞춰 적용됩니다."})]})}const Ze=o.div`
  display: grid;
  gap: 8px;
`,_e=o.div`
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
  .label {
    color: #6b7280;
    font-size: 12px;
    font-weight: 700;
  }
`,et=o.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`,q=o.input`
  height: 40px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 12px;
  font-size: 14px;
  background: #fff;
  color: #0f172a;
`,tt=o.span`
  color: #334155;
  font-size: 12px;
`,nt=o.p`
  margin: 0;
  color: #6b7280;
  font-size: 12px;
`;function rt({hero:n,statusBar:t,summary:i,quickActions:d,feedback:r,payments:c,loginLogs:g,range:a,loadError:b,onRetry:j,isRefreshing:z}){return e.jsxs(se,{children:[e.jsx(ge,{...n}),e.jsx(ye,{...t}),b?e.jsxs(ot,{role:"status",children:[e.jsx("span",{className:"label",children:"데이터 오류"}),e.jsx("span",{className:"message",children:b}),e.jsx("button",{type:"button",onClick:j,disabled:z,children:"다시 시도"})]}):null,e.jsx(Ae,{items:i.items,loading:i.loading}),e.jsx(Ce,{actions:d}),e.jsxs(ae,{children:[e.jsxs(W,{children:[e.jsx(D,{children:e.jsxs("div",{children:[e.jsx("h3",{children:"기간별 통계 범위"}),e.jsx(K,{children:"선택한 기간에 따라 학원 목록 및 로그인 통계가 갱신됩니다."})]})}),e.jsx(Xe,{from:a.from,to:a.to,onChangeFrom:a.onChangeFrom,onChangeTo:a.onChangeTo,loginsInRange:a.loginsInRange})]}),e.jsxs(W,{children:[e.jsxs(D,{children:[e.jsxs("div",{children:[e.jsx("h3",{children:"최근 결제 기록"}),e.jsx(K,{children:"최신 결제 내역을 확인하세요."})]}),e.jsxs(de,{children:["표시 건수: ",c.length.toLocaleString("ko-KR"),"건"]})]}),e.jsx(Ke,{payments:c})]})]}),e.jsxs(W,{children:[e.jsx(D,{children:e.jsxs("div",{children:[e.jsx("h3",{children:"최근 문의/피드백"}),e.jsx(K,{children:"우선 처리할 문의를 빠르게 파악하세요."})]})}),e.jsx(He,{rows:r.rows,total:r.total,newCount:r.newCount,error:r.error})]}),e.jsxs(W,{children:[e.jsx(le,{children:e.jsx(ce,{children:e.jsxs("div",{children:[e.jsx("h3",{style:{margin:0},children:"최근 관리자 로그인"}),e.jsxs(K,{children:["총 ",g.length.toLocaleString("ko-KR"),"건 표시 중"]})]})})}),e.jsx(Ie,{logs:g})]})]})}const ot=o.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid #fecaca;
  background: #fef2f2;
  color: #b91c1c;
  font-size: 13px;
  button {
    margin-left: auto;
    background: #ffffff;
    border: 1px solid #fca5a5;
    color: #b91c1c;
    border-radius: 999px;
    padding: 6px 14px;
    font-weight: 700;
    cursor: pointer;
  }
  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;function it({showSuccess:n,showError:t}){const[i,d]=s.useState(null),[r,c]=s.useState([]),[g,a]=s.useState([]),[b,j]=s.useState([]),[z,M]=s.useState(null),[k,A]=s.useState(null),[$,R]=s.useState(null),[w,v]=s.useState(!1),[N,T]=s.useState(null),[u,B]=s.useState(null),[y,P]=s.useState(()=>{const h=new Date;return h.setDate(h.getDate()-30),h.toISOString().slice(0,10)}),[E,L]=s.useState(()=>new Date().toISOString().slice(0,10)),[C,m]=s.useState(null),p=s.useRef(!0);s.useEffect(()=>()=>{p.current=!1},[]);const I=s.useCallback(async h=>{if(!p.current)return!1;v(!0),T(null);try{R(null);const[l,f,X]=await Promise.all([pe(),he(),xe()]);let G=l;if(!l||l.academies==null)try{const x=await fe({page:0,size:1});G={...l||{},academies:x.totalElements}}catch{}if(!p.current)return!1;d(G),c(f),a(X),B(new Date);try{const x=await Y({page:0,size:5});p.current&&(j((x?.content||[]).slice(0,5)),M(typeof x?.totalElements=="number"?x.totalElements:null))}catch(x){p.current&&(j([]),M(null),R(x instanceof Error?x.message:"문의 목록을 불러오지 못했습니다."))}try{const x=await Y({status:"NEW",page:0,size:1});p.current&&A(typeof x?.totalElements=="number"?x.totalElements:null)}catch{p.current&&A(null)}return h?.silent||n("대시보드 데이터를 새로고침했습니다."),!0}catch(l){if(!p.current)return!1;const f=l instanceof Error?l.message:"대시보드 데이터를 불러오지 못했습니다.";return T(f),t(f),j([]),M(null),A(null),R("문의 데이터를 불러오지 못했습니다."),!1}finally{p.current&&v(!1)}},[t,n]);s.useEffect(()=>{I({silent:!0})},[I]),s.useEffect(()=>{let h=!1;async function l(){try{const f=await ue({from:y,to:E,page:0,size:1});!h&&p.current&&m(f.totalElements)}catch{!h&&p.current&&m(null)}}return l(),()=>{h=!0}},[y,E]);const F=s.useMemo(()=>{if(!u)return null;const h=Date.now()-u.getTime(),l=Math.floor(h/6e4);if(l<1)return"방금 전";if(l<60)return`${l}분 전`;const f=Math.floor(l/60);return f<24?`${f}시간 전`:u.toLocaleString("ko-KR",{dateStyle:"medium",timeStyle:"short"})},[u]);return{overview:i,loginLogs:r,payments:g,feedbackRows:b,feedbackTotal:z,feedbackNewCount:k,feedbackError:$,loading:w,loadError:N,lastUpdatedAt:u,lastUpdatedLabel:F,isInitialLoading:w&&!u&&!N,isRefreshing:w&&!!u,from:y,to:E,setFrom:P,setTo:L,loginsInRange:C,loadAll:I}}function st(n){const{onLogin:t,showSuccess:i,showError:d}=n,{admin:r,logout:c}=te(),g=it({showSuccess:i,showError:d}),{overview:a,loginLogs:b,payments:j,feedbackRows:z,feedbackTotal:M,feedbackNewCount:k,feedbackError:A,loading:$,loadError:R,lastUpdatedLabel:w,isRefreshing:v,from:N,to:T,setFrom:u,setTo:B,loginsInRange:y,loadAll:P}=g,E=$&&!a,L=s.useCallback(()=>{try{window.dispatchEvent(new CustomEvent("calendar:classes-refresh",{detail:{}}))}catch{}},[]),C=s.useCallback(()=>{ne(["/api/students","/api/courses","/api/calendar/classes","/api/calendar/classes-range","/api/dashboard/summary","/api/dashboard/attendance-today","/api/marketing/"]),L(),i("API 캐시를 초기화했습니다.")},[i,L]),m=s.useCallback(()=>{P()},[P]),p=s.useMemo(()=>[{id:"academies",label:"전체 학원 수",value:a?.academies!=null?a.academies.toLocaleString("ko-KR"):"—"},{id:"logins30d",label:"최근 30일 로그인",value:a?.logins30d!=null?a.logins30d.toLocaleString("ko-KR"):"—"},{id:"paymentsAmount30d",label:"최근 30일 결제합계(원)",value:a?.paymentsAmount30d!=null?Math.round((a.paymentsAmount30d||0)/100).toLocaleString("ko-KR"):"—"},{id:"apiCallsToday",label:"오늘 API 호출",value:a?.apiCallsToday!=null?a.apiCallsToday.toLocaleString("ko-KR"):"—"},{id:"openaiCallsToday",label:"오늘 OpenAI 호출",value:a?.openaiCallsToday!=null?a.openaiCallsToday.toLocaleString("ko-KR"):"—"},{id:"feedbackNew",label:"미처리 문의",value:k!=null?k.toLocaleString("ko-KR"):"—"}],[a,k]),I=s.useMemo(()=>[{id:"refresh-data",title:"데이터 새로고침",description:"대시보드 요약과 로그 데이터를 즉시 갱신합니다.",icon:"spark",onClick:m},{id:"refresh-calendar",title:"캘린더 강제 새로고침",description:"클라이언트 캘린더 캐시를 초기화하고 새로고침 이벤트를 발송합니다.",icon:"refresh",onClick:L},{id:"clear-api-cache",title:"API 캐시 초기화",description:"학생·수업·캘린더 관련 캐시를 비워 데이터 오류를 예방합니다.",icon:"cpu",onClick:C},{id:"view-login-logs",title:"로그인 기록",description:"최근 관리자 로그인 이벤트를 확인합니다.",icon:"activity",href:S.admin+"/logins"},{id:"view-api-logs",title:"API 로그",description:"서비스 API 호출 이력을 실시간으로 살펴봅니다.",icon:"terminal",href:S.admin+"/api-logs"},{id:"view-payments",title:"결제 기록",description:"결제 발생 내역과 상태를 점검합니다.",icon:"wallet",href:S.admin+"/payments"},{id:"view-feedbacks",title:"문의/피드백",description:"사용자 문의를 처리하고 상태를 업데이트합니다.",icon:"inbox",href:S.admin+"/feedbacks"}],[C,m,L]),F=s.useMemo(()=>({adminName:r?.username,adminRole:r?.role??null,isLoggedIn:!!r,lastUpdatedLabel:w,isRefreshing:v,onRefresh:m,onClearCaches:C,onLogout:()=>c(),onLogin:t}),[r,m,C,v,w,c,t]),U=s.useMemo(()=>({isLoggedIn:!!r,username:r?.username,role:r?.role??null}),[r]),O=s.useMemo(()=>({from:N,to:T,onChangeFrom:u,onChangeTo:B,loginsInRange:y}),[N,T,u,B,y]);return{hero:F,statusBar:U,summary:{items:p,loading:E},quickActions:I,feedback:{rows:z,total:M,newCount:k,error:A},payments:j,loginLogs:b,range:O,loadError:R,onRetry:m,isRefreshing:v}}function xt(){const n=re(),{success:t,error:i}=oe(),d=st({onLogin:()=>n(S.admin+"/login"),showSuccess:t,showError:i});return e.jsx(rt,{...d})}export{xt as default};
