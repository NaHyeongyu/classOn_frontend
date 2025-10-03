import{f as y,r as l,j as t,d as i,u as w,P as b,a as L}from"./index-BONIAwcU.js";import{K as g,D as m,U as $,C as A,a as I}from"./KPI-BlI0ySbZ.js";import{E as D}from"./EmptyPlaceholder-Q9LpzrIK.js";import{g as M}from"./calendar-DmGVsd_S.js";import{f as v}from"./dateUtils-CoPTMMCx.js";import{C as P}from"./ClassList-tJYwfdg5.js";async function T(){return await y("/api/dashboard/attendance-today")}async function k(){return await y("/api/dashboard/summary")}function R(){const[n,s]=l.useState("idle"),[o,a]=l.useState(null),[d,c]=l.useState(null),u=l.useCallback(async()=>{s("loading"),c(null);try{const e=await k();a(e),s("success")}catch(e){c(e),s("error")}},[]);return l.useEffect(()=>{n==="idle"&&u()},[n,u]),l.useMemo(()=>({status:n,data:o,error:d,refresh:u}),[n,o,d,u])}function N({children:n}){return t.jsx(H,{children:n})}function z({span:n=6,bg:s="#ffffff",children:o}){return t.jsx(K,{style:{gridColumn:`span ${n}`,background:s},children:o})}const H=i.section`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  grid-template-rows: auto auto 1fr; /* KPI row + two content rows fill viewport */
  gap: 16px;
  height: calc(100vh - 48px); /* account for content padding (24px top/bottom) */
  overflow: hidden; /* page-level no scroll */
`,K=i.div`
  min-height: 0; /* allow to shrink inside the row */
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 16px;
  color: #111827;
  display: flex;
  flex-direction: column;
  overflow: auto; /* internal scroll only, page stays fixed */
  font-weight: 600;
`;function B({data:n,loading:s,error:o,onRetry:a}){const d=n?`${n.totalStudents}명`:"—",c=n?`+${n.deltaStudents}`:"—";return t.jsx(g,{title:"총 원생 수",icon:t.jsx($,{}),iconAccent:"indigo",value:d,footerLeft:"전월 대비",footerRight:t.jsx(m,{$tone:"positive",children:c}),loading:s,error:o,onRetry:a})}function O({data:n,loading:s,error:o,onRetry:a}){const d=n?`${n.attendanceRate}%`:"—",c=n?`${n.attendanceNumerator}/${n.attendanceDenominator}`:"—";return t.jsx(g,{title:"오늘 출석률",icon:t.jsx(A,{}),iconAccent:"green",value:d,footerLeft:c,footerRight:t.jsx(m,{$tone:"neutral",children:"오늘"}),loading:s,error:o,onRetry:a})}function U({data:n,loading:s,error:o,onRetry:a}){const d=n?`${n.classCountToday}개`:"—",c=n?n.dateLabel:"—";return t.jsx(g,{title:"오늘 수업",icon:t.jsx(I,{}),iconAccent:"violet",value:d,footerLeft:c,footerRight:t.jsx(m,{$tone:"neutral",children:"일정"}),loading:s,error:o,onRetry:a})}function V(){const n=w(),[s,o]=l.useState([]),[a,d]=l.useState(!1),[c,u]=l.useState(null),f=l.useCallback(async()=>{d(!0),u(null);try{const e=await T();o(e.filter(r=>r.present))}catch(e){u(e?.message||"출석 정보를 불러오지 못했습니다.")}finally{d(!1)}},[]);return l.useEffect(()=>{f();const e=setInterval(f,6e4);function r(){f()}return window.addEventListener("calendar:classes-refresh",r),window.addEventListener("dashboard:attendance-refresh",r),()=>{clearInterval(e),window.removeEventListener("calendar:classes-refresh",r),window.removeEventListener("dashboard:attendance-refresh",r)}},[f]),t.jsxs(z,{span:6,children:[t.jsx(G,{children:t.jsxs("div",{children:[t.jsx("strong",{children:"출석 학생"}),t.jsx(J,{children:a?"불러오는 중...":`${s.length}건`}),c&&t.jsx(W,{children:c})]})}),t.jsxs(Y,{children:[s.length===0&&!a&&t.jsx(D,{title:"오늘 등록된 출석 기록이 없습니다.",description:"수업 상세에서 출석을 체크하면 이곳에서 바로 확인할 수 있어요.",actionLabel:"출석 입력하러 가기",onAction:()=>n("/calendar"),actionVariant:"outline"}),s.map(e=>t.jsx(q,{children:t.jsxs(Q,{children:[t.jsxs(X,{children:[t.jsx("strong",{children:e.studentName}),t.jsx("span",{className:"course",children:e.courseTitle?e.courseId?t.jsx(se,{type:"button",onClick:()=>n(`/classes/${e.courseId}`),children:e.courseTitle}):e.courseTitle:"-"})]}),t.jsxs(Z,{children:[t.jsx(te,{children:"출석"}),t.jsx(ee,{children:_(e.createdAt)}),t.jsx(ne,{"data-type":e.source,children:F(e.source)})]})]})},e.id))]})]})}function _(n){try{const s=new Date(n),o=String(s.getHours()).padStart(2,"0"),a=String(s.getMinutes()).padStart(2,"0");return`${o}:${a}`}catch{return n}}function F(n){return n==="MOBILE"?"모바일":"수동"}const G=i.div` display:flex; align-items:center; justify-content:space-between; `,J=i.div` color:#6b7280; font-size:12px; margin-top:4px; `,W=i.div` color:#b91c1c; font-size:12px; `,Y=i.div` display:grid; gap:8px; margin-top:8px; `,q=i.div`
  display:flex;
  flex-direction:column;
  gap:6px;
  padding:12px 16px;
  border:1px solid #e5e7eb;
  border-radius:14px;
  background:#ffffff;
  box-shadow:0 1px 2px rgba(15,23,42,0.06);
`,Q=i.div` display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap; `,X=i.div`
  display:flex;
  flex-direction:column;
  gap:2px;
  strong { font-size:15px; color:#111827; letter-spacing:-0.01em; }
  .course { font-size:13px; color:#6b7280; }
`,Z=i.div` display:inline-flex; align-items:center; gap:8px; flex-wrap:wrap; `,ee=i.span` font-size:12px; color:#6b7280; `,te=i.span`
  padding:2px 10px; border-radius:9999px; font-size:12px; font-weight:800;
  background:#dcfce7; color:#16a34a; border:1px solid #bbf7d0;
`,ne=i.span`
  padding:2px 8px; border-radius:9999px; font-size:12px; font-weight:700; border:1px solid #e5e7eb; color:#374151; background:#f9fafb;
  &[data-type='MOBILE'] { background:#dcfce7; color:#16a34a; border-color:#bbf7d0; }
  &[data-type='MANUAL'] { background:#f3f4f6; color:#374151; border-color:#e5e7eb; }
`,se=i.button`
  all:unset;
  cursor:pointer;
  color:#2563eb;
  font-weight:600;
  &:hover { text-decoration:underline; }
`;function oe(){const n=w(),[s,o]=l.useState([]),[a,d]=l.useState(null);l.useEffect(()=>{let e=!1;async function r(){d(null);try{const p=await M(v(new Date));e||o(p)}catch(p){e||d(p?.message||"오늘 수업을 불러오지 못했습니다.")}finally{}}r();const h=setInterval(r,15e3),x=()=>{document.visibilityState==="visible"&&r()};return document.addEventListener("visibilitychange",x),()=>{e=!0,clearInterval(h),document.removeEventListener("visibilitychange",x)}},[]);function c(...e){for(const r of e)if(typeof r=="number"&&Number.isFinite(r))return r;return 0}function u(e){if(!e)return null;const r=String(e).trim();return r==="정기 수업"||r==="정기수업"?null:r||null}const f=s.map(e=>{const r=e.startTime??e.start_at??e.startAt??e.start??null,h=e.endTime??e.end_at??e.endAt??e.end??null,x=c(e.attPresent,e.presentCount,e.attendancePresent,e?.attendance?.present),p=c(e.attAbsent,e.absentCount,e.attendanceAbsent,e?.attendance?.absent),S=c(e.attUnprocessed),C=e.recordId||e.id,E=u(e.notes||e.content||e.topic||null);return{subject:e.courseTitle||"수업",time:re(r,h),room:"-",teacher:"-",student:"-",done:!1,courseId:e.courseId||void 0,date:e.recordDate||e.date,recordId:C,notes:E,attPresent:x,attAbsent:p,attUnprocessed:S}});return t.jsx("div",{style:{gridColumn:"span 6",minHeight:0,display:"flex"},children:t.jsxs("div",{style:{flex:1,minHeight:0,overflow:"auto"},children:[t.jsx(P,{items:f,actionLabel:"더보기",onAdd:()=>n(`/calendar/${v(new Date)}`),titleMode:"subject",showNotes:!0}),a&&t.jsx(ae,{children:a})]})})}function j(n){if(!n)return"--:--";try{const s=String(n).match(/(\d{2}):(\d{2})/);return s?`${s[1]}:${s[2]}`:"--:--"}catch{return"--:--"}}function re(n,s){return`${j(n)} ~ ${j(s)}`}const ae=i.div` color:#b91c1c; font-size:12px; `;function he(){const{status:n,data:s,error:o,refresh:a}=R();return t.jsxs(N,{children:[t.jsxs(ce,{children:[t.jsxs("div",{children:[t.jsx("h2",{children:"대시보드"}),t.jsx("p",{children:"학원 현황을  한눈에 확인해보세요!"})]}),t.jsxs(ie,{children:[t.jsx(b,{to:"/students/new",children:"원생 추가"}),t.jsx(b,{to:"/classes/new",children:"수업 추가"})]})]}),t.jsx(B,{data:s,loading:n==="loading",error:!!o,onRetry:a}),t.jsx(O,{data:s,loading:n==="loading",error:!!o,onRetry:a}),t.jsx(U,{data:s,loading:n==="loading",error:!!o,onRetry:a}),t.jsx(V,{}),t.jsx(oe,{})]})}const ie=i.div`
  display: inline-flex;
  gap: 12px;
  align-items: center;
`,ce=i(L)`
  grid-column: 1 / -1;
`;export{he as default};
