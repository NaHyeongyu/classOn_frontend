import{f as I,r as d,j as t,d as o,l as k,u as A}from"./index-D-9d_yHo.js";import{G as N,P,a as E,b as R}from"./UI-DfwAVYB9.js";import{K as C,U as T,C as F,a as U}from"./KPI-N5Zf3H7D.js";import{g as H,b as O,f as K,S as G,s as _,a as V,c as J}from"./constants-CFtM3F7y.js";import{E as z}from"./EmptyPlaceholder-YqQdqNYX.js";import{f as S}from"./dateUtils-CoPTMMCx.js";import{g as W}from"./calendar-Cnvy1ybX.js";import{f as Y}from"./format-Do6vjlY3.js";import{C as q}from"./ClassList-KnqHEOFy.js";async function Q(){return await I("/api/dashboard/summary")}function X(){const[e,s]=d.useState("idle"),[a,r]=d.useState(null),[i,m]=d.useState(null),l=d.useCallback(async()=>{s("loading"),m(null);try{const h=await Q();r(h),s("success")}catch(h){m(h),s("error")}},[]);return d.useEffect(()=>{e==="idle"&&l()},[e,l]),d.useMemo(()=>({status:e,data:a,error:i,refresh:l}),[e,a,i,l])}function Z({children:e}){return t.jsx(ee,{children:e})}function B({span:e=6,rowSpan:s=1,className:a,style:r,children:i}){return t.jsx(te,{className:a,style:r,$span:e,$rowSpan:s,children:i})}const ee=o.section`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  grid-auto-rows: minmax(0, auto);
  gap: ${e=>e.theme.spacing.pageGap};
  width: 100%;

  @media (max-width: 1200px) {
    gap: ${e=>e.theme.spacing.lg};
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${e=>e.theme.spacing.md};
  }
`,te=o.section`
  display: flex;
  flex-direction: column;
  gap: ${e=>e.theme.spacing.md};
  min-height: 0;
  grid-column: span ${({$span:e})=>e};
  ${({$rowSpan:e})=>e>1?k`
          grid-row: span ${e};
        `:null};
  border-radius: ${e=>e.theme.radii.md};
  border: 1px solid ${e=>e.theme.colors.border};
  background: ${e=>e.theme.colors.surface};
  box-shadow: ${e=>e.theme.shadow.low};
  padding: ${e=>e.theme.spacing.lg};
  color: ${e=>e.theme.colors.text};
  overflow: hidden;

  @media (max-width: 1024px) {
    grid-column: 1 / -1;
    ${({$rowSpan:e})=>e>1?k`
            grid-row: auto;
          `:null};
  }
`;function se({data:e,loading:s,error:a,onRetry:r}){const i=e?`${e.totalStudents}명`:"—";return t.jsx(C,{title:"총 원생 수",icon:t.jsx(T,{}),iconAccent:"indigo",value:i,footerLeft:void 0,footerRight:void 0,loading:s,error:a,onRetry:r})}function ne({data:e,loading:s,error:a,onRetry:r}){const i=e?`${e.attendanceRate}%`:"—",m=e?`${e.attendanceNumerator}/${e.attendanceDenominator}`:"—";return t.jsx(C,{title:"오늘 출석률",icon:t.jsx(F,{}),iconAccent:"green",value:i,footerLeft:m,footerRight:void 0,loading:s,error:a,onRetry:r})}function oe({data:e,loading:s,error:a,onRetry:r}){const i=e?`${e.classCountToday}개`:"—",m=e?e.dateLabel:"—";return t.jsx(C,{title:"오늘 수업",icon:t.jsx(U,{}),iconAccent:"violet",value:i,footerLeft:m,footerRight:void 0,loading:s,error:a,onRetry:r})}function re(){const e=A(),[s,a]=d.useState(null),[r,i]=d.useState(!1),[m,l]=d.useState(null),[c,h]=d.useState("ALL"),p=d.useCallback(async()=>{i(!0),l(null);try{const n=S(new Date),g=await H({from:n,to:n});a(g[0]??null)}catch(n){l(ae(n,"출결 데이터를 불러오지 못했습니다."))}finally{i(!1)}},[]);d.useEffect(()=>{p();const n=()=>{p()},g=setInterval(n,6e4);return window.addEventListener("calendar:classes-refresh",n),window.addEventListener("dashboard:attendance-refresh",n),()=>{clearInterval(g),window.removeEventListener("calendar:classes-refresh",n),window.removeEventListener("dashboard:attendance-refresh",n)}},[p]);const u=d.useMemo(()=>({present:s?.presentCount??0,absent:s?.absentCount??0,unprocessed:s?.unprocessedCount??0}),[s]),$=d.useMemo(()=>s?O(s):[],[s]),b=d.useMemo(()=>K($,c),[$,c]),v=!r&&!m&&!s&&u.present+u.absent+u.unprocessed===0,f=!r&&!m&&s!=null&&b.length===0;return t.jsxs(B,{span:6,children:[t.jsxs(ie,{children:[t.jsxs(ce,{children:[t.jsx(de,{children:"오늘 출결 요약"}),t.jsxs(le,{children:[t.jsx(he,{children:r?"불러오는 중…":`${s?s.classCount:0}개 수업`}),m?t.jsx(pe,{children:m}):null]})]}),t.jsx(me,{children:t.jsx(ue,{type:"button",onClick:()=>e("/attendance"),children:"더보기"})})]}),t.jsxs(fe,{children:[t.jsxs(j,{"data-variant":"present",children:["출석 ",u.present,"명"]}),t.jsxs(j,{"data-variant":"absent",children:["결석 ",u.absent,"명"]}),t.jsxs(j,{"data-variant":"none",children:["미처리 ",u.unprocessed,"명"]})]}),t.jsx(ge,{children:G.map(n=>t.jsx(xe,{type:"button","data-active":c===n.value||void 0,onClick:()=>h(n.value),children:n.label},n.value))}),v&&t.jsx(z,{title:"오늘 출결 데이터가 없습니다.",description:"출결 관리에서 수업 출석을 기록하면 이곳에서 요약으로 확인할 수 있어요.",actionLabel:"더보기",onAction:()=>e("/attendance"),actionVariant:"outline"}),t.jsxs($e,{children:[r&&t.jsx(be,{children:t.jsx("span",{role:"status",children:"불러오는 중…"})}),f&&t.jsx(z,{title:"선택한 필터에 해당하는 출결이 없습니다.",description:"다른 상태를 선택해 확인해 보세요."}),!r&&!f&&t.jsx(ye,{children:b.map(n=>t.jsxs(ve,{children:[t.jsxs(je,{children:[t.jsxs(we,{children:[t.jsx(Se,{children:n.studentName??"이름 없음"}),t.jsx(Ce,{children:n.courseTitle??"-"})]}),t.jsxs(ke,{children:[t.jsx(Ee,{"data-type":n.status.toLowerCase(),children:_(n.status)}),t.jsx(ze,{children:n.status==="UNPROCESSED"?"미처리":V(n.createdAt)}),n.status!=="UNPROCESSED"&&t.jsx(Me,{"data-type":(n.source??"MANUAL").toUpperCase(),children:J(n.source)})]})]}),n.status==="UNPROCESSED"?t.jsxs(w,{children:[t.jsxs(M,{children:["미처리 인원 ",n.count??0,"명"]}),n.students&&n.students.length>0&&t.jsx(Ae,{children:n.students.map((g,D)=>t.jsx(Be,{children:g},`${n.key}-student-${D}`))})]}):n.reason?t.jsx(w,{children:t.jsx(Le,{children:n.reason})}):n.status==="ABSENT"?t.jsx(w,{children:t.jsx(M,{children:"사유 없음"})}):null]},n.key))})]})]})}function ae(e,s){return e instanceof Error&&e.message?e.message:typeof e=="string"&&e.trim()?e:s}const ie=o.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${e=>e.theme.spacing.md};
  flex-wrap: wrap;
`,ce=o.div`
  display: flex;
  flex-direction: column;
  gap: ${e=>e.theme.spacing.xs};
`,de=o.h3`
  margin: 0;
  font-size: ${e=>e.theme.font.size.lg};
  font-weight: ${e=>e.theme.font.weight.semiBold};
  color: ${e=>e.theme.colors.text};
`,le=o.div`
  display: inline-flex;
  align-items: center;
  gap: ${e=>e.theme.spacing.xs};
`,me=o.div`
  display: inline-flex;
  align-items: center;
  gap: ${e=>e.theme.spacing.sm};
  flex-wrap: wrap;
`,ue=o(N)`
  border-color: ${e=>e.theme.colors.primary};
  background: ${e=>e.theme.colors.primary};
  color: #ffffff;
  &:hover {
    border-color: ${e=>e.theme.colors.primaryHover??"#4338ca"};
    background: ${e=>e.theme.colors.primaryHover??"#4338ca"};
  }
`,he=o.span`
  color: ${e=>e.theme.colors.textMuted};
  font-size: ${e=>e.theme.font.size.sm};
`,pe=o.span`
  color: ${e=>e.theme.colors.danger};
  font-size: ${e=>e.theme.font.size.sm};
  font-weight: ${e=>e.theme.font.weight.semiBold};
`,fe=o.div`
  display: inline-flex;
  gap: ${e=>e.theme.spacing.sm};
  flex-wrap: wrap;
  margin-top: ${e=>e.theme.spacing.sm};
`,j=o.span`
  display: inline-flex;
  align-items: center;
  gap: ${e=>e.theme.spacing.xs};
  padding: 4px 12px;
  border-radius: 999px;
  border: 1px solid ${e=>e.theme.colors.border};
  font-size: ${e=>e.theme.font.size.sm};
  font-weight: ${e=>e.theme.font.weight.semiBold};
  background: ${e=>e.theme.colors.surface};
  &[data-variant="present"] {
    background: ${e=>e.theme.colors.successSurface};
    color: ${e=>e.theme.colors.success};
    border-color: rgba(34, 197, 94, 0.4);
  }
  &[data-variant="absent"] {
    background: ${e=>e.theme.colors.dangerSurface};
    color: ${e=>e.theme.colors.danger};
    border-color: rgba(239, 68, 68, 0.4);
  }
  &[data-variant="none"] {
    background: ${e=>e.theme.colors.surfaceMuted};
    color: ${e=>e.theme.colors.textMuted};
  }
`,ge=o.div`
  display: inline-flex;
  gap: ${e=>e.theme.spacing.xs};
  margin: ${e=>e.theme.spacing.sm} 0 ${e=>e.theme.spacing.xs};
  flex-wrap: wrap;
`,xe=o.button`
  appearance: none;
  border: 1px solid ${e=>e.theme.colors.border};
  background: ${e=>e.theme.colors.surface};
  color: ${e=>e.theme.colors.text};
  border-radius: ${e=>e.theme.radii.sm};
  padding: 6px 14px;
  font-size: ${e=>e.theme.font.size.sm};
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease, border 0.15s ease;
  &[data-active] {
    background: #111827;
    color: #ffffff;
    border-color: #111827;
    font-weight: ${e=>e.theme.font.weight.semiBold};
  }
`,$e=o.section`
  display: grid;
  gap: ${e=>e.theme.spacing.sm};
`,be=o.div`
  display: inline-flex;
  align-items: center;
  gap: ${e=>e.theme.spacing.xs};
  padding: ${e=>e.theme.spacing.sm} ${e=>e.theme.spacing.md};
  border: 1px solid ${e=>e.theme.colors.border};
  border-radius: ${e=>e.theme.radii.sm};
  background: ${e=>e.theme.colors.surface};
  font-size: ${e=>e.theme.font.size.sm};
  color: ${e=>e.theme.colors.textMuted};
`,ye=o.div`
  display: grid;
  gap: ${e=>e.theme.spacing.sm};
`,ve=o.article`
  display: flex;
  flex-direction: column;
  gap: ${e=>e.theme.spacing.sm};
  padding: ${e=>e.theme.spacing.md};
  border: 1px solid ${e=>e.theme.colors.border};
  border-radius: ${e=>e.theme.radii.md};
  background: ${e=>e.theme.colors.surface};
  box-shadow: ${e=>e.theme.shadow.low};
`,je=o.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${e=>e.theme.spacing.md};
  flex-wrap: wrap;
`,we=o.div`
  display: flex;
  flex-direction: column;
  gap: ${e=>e.theme.spacing.xs};
  min-width: 0;
`,Se=o.strong`
  font-size: ${e=>e.theme.font.size.md};
  font-weight: ${e=>e.theme.font.weight.semiBold};
  color: ${e=>e.theme.colors.text};
  letter-spacing: -0.01em;
`,Ce=o.span`
  font-size: ${e=>e.theme.font.size.sm};
  color: ${e=>e.theme.colors.textMuted};
`,ke=o.div`
  display: inline-flex;
  align-items: center;
  gap: ${e=>e.theme.spacing.xs};
  flex-wrap: wrap;
`,Ee=o.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px ${e=>e.theme.spacing.sm};
  border-radius: 999px;
  font-size: ${e=>e.theme.font.size.xs};
  font-weight: ${e=>e.theme.font.weight.semiBold};
  background: ${e=>e.theme.colors.surfaceMuted};
  color: ${e=>e.theme.colors.text};
  border: 1px solid ${e=>e.theme.colors.border};
  &[data-type="present"] {
    background: ${e=>e.theme.colors.successSurface};
    color: ${e=>e.theme.colors.success};
    border-color: rgba(34, 197, 94, 0.4);
  }
  &[data-type="absent"] {
    background: ${e=>e.theme.colors.dangerSurface};
    color: ${e=>e.theme.colors.danger};
    border-color: rgba(239, 68, 68, 0.4);
  }
  &[data-type="unprocessed"] {
    background: ${e=>e.theme.colors.warningSurface??"rgba(250, 204, 21, 0.18)"};
    color: ${e=>e.theme.colors.warning??"#b45309"};
  }
`,ze=o.span`
  color: ${e=>e.theme.colors.textMuted};
  font-size: ${e=>e.theme.font.size.xs};
`,Me=o.span`
  padding: 2px ${e=>e.theme.spacing.sm};
  border-radius: 999px;
  font-size: ${e=>e.theme.font.size.xs};
  font-weight: ${e=>e.theme.font.weight.medium};
  border: 1px solid ${e=>e.theme.colors.border};
  color: ${e=>e.theme.colors.text};
  background: ${e=>e.theme.colors.surfaceMuted};
  &[data-type="MOBILE"] {
    background: ${e=>e.theme.colors.successSurface};
    color: ${e=>e.theme.colors.success};
    border-color: rgba(34, 197, 94, 0.4);
  }
`,w=o.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`,M=o.span`
  font-size: ${e=>e.theme.font.size.xs};
  color: ${e=>e.theme.colors.textMuted};
`,Le=o.p`
  margin: 0;
  font-size: ${e=>e.theme.font.size.sm};
  color: ${e=>e.theme.colors.text};
  line-height: 1.5;
`,Ae=o.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`,Be=o.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: ${e=>e.theme.font.size.xs};
  background: ${e=>e.theme.colors.surfaceMuted};
  color: ${e=>e.theme.colors.text};
  border: 1px solid ${e=>e.theme.colors.borderMuted};
`;function De(){const e=A(),[s,a]=d.useState([]),[r,i]=d.useState(null);d.useEffect(()=>{let l=!1;async function c(){i(null);try{const u=await W(S(new Date));l||a(u)}catch(u){l||i(Re(u,"오늘 수업을 불러오지 못했습니다."))}finally{}}c();const h=setInterval(c,15e3),p=()=>{document.visibilityState==="visible"&&c()};return document.addEventListener("visibilitychange",p),()=>{l=!0,clearInterval(h),document.removeEventListener("visibilitychange",p)}},[]);const m=s.map(l=>{const c=l,h=y(c,["startTime","start_at","startAt","start"]),p=y(c,["endTime","end_at","endAt","end"]),u=typeof c.attendance=="object"&&c.attendance!==null?c.attendance:null,$=x(c,["attPresent","presentCount","attendancePresent"])??L(u,["present"])??0,b=x(c,["attAbsent","absentCount","attendanceAbsent"])??L(u,["absent"])??0,v=x(c,["attUnprocessed","unprocessedCount"])??0,f=x(c,["recordId","id"]),n=Pe(y(c,["notes","content","topic"]));return{subject:l.courseTitle||"수업",time:Y(h,p),room:"-",teacher:"-",student:"-",done:!1,courseId:l.courseId||void 0,date:l.recordDate||y(c,["date"]),recordId:typeof f=="number"?f:void 0,notes:n,attPresent:$,attAbsent:b,attUnprocessed:v}});return t.jsx(B,{span:6,rowSpan:2,children:t.jsxs(Ne,{children:[t.jsx(q,{items:m,actionLabel:"더보기",onAdd:()=>e(`/calendar/${S(new Date)}`),titleMode:"subject",showNotes:!0,embedded:!0}),r&&t.jsx(Ie,{children:r})]})})}const Ie=o.div`
  color: ${e=>e.theme.colors.danger};
  font-size: ${e=>e.theme.font.size.sm};
  font-weight: ${e=>e.theme.font.weight.semiBold};
`,Ne=o.div`
  flex: 1;
  min-height: 0;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: ${e=>e.theme.spacing.sm};
`;function y(e,s){for(const a of s){const r=e[a];if(typeof r=="string"&&r.trim())return r}return null}function x(e,s){for(const a of s){const r=e[a];if(typeof r=="number"&&Number.isFinite(r))return r}return null}function L(e,s){return e?x(e,s):null}function Pe(e){if(!e)return null;const s=e.trim();return s==="정기 수업"||s==="정기수업"?null:s||null}function Re(e,s){return e instanceof Error&&e.message?e.message:typeof e=="string"&&e.trim()?e:s}function Ye(){const{status:e,data:s,error:a,refresh:r}=X(),i={data:s,loading:e==="loading",error:!!a,onRetry:r};return t.jsx(P,{children:t.jsxs(Z,{children:[t.jsxs(Fe,{children:[t.jsx("div",{children:t.jsx("h2",{children:"대시보드"})}),t.jsxs(Te,{children:[t.jsx(E,{to:"/students/new",children:"원생 추가"}),t.jsx(E,{to:"/classes/new",children:"수업 추가"})]})]}),t.jsx(se,{...i}),t.jsx(ne,{...i}),t.jsx(oe,{...i}),t.jsx(re,{}),t.jsx(De,{})]})})}const Te=o.div`
  display: inline-flex;
  gap: ${e=>e.theme.spacing.sm};
  align-items: center;
  flex-wrap: wrap;
`,Fe=o(R)`
  grid-column: 1 / -1;
`;export{Ye as default};
