import{j as t,d as o,l as E,u as B,r as c,f as T,a as k}from"./index-B0K7mn4q.js";import{G as I,P,a as z,b as R}from"./UI-Cj3YhchZ.js";import{K as C,U as F,C as U,a as H}from"./KPI-BGVZTIzu.js";import{g as O,b as K,f as _,S as G,s as q,a as V,c as J}from"./constants-VkN453I-.js";import{E as M}from"./EmptyPlaceholder-0vR7E1DK.js";import{f as S}from"./dateUtils-CoPTMMCx.js";import{g as Q}from"./calendar-CvBZyv8u.js";import{f as W}from"./format-DW-Kl_C3.js";import{C as Y}from"./ClassList-DQUoHMLi.js";import{u as X}from"./useQuery-zjDKxKyb.js";function Z({children:e}){return t.jsx(ee,{children:e})}function D({span:e=6,rowSpan:s=1,className:i,style:r,children:d}){return t.jsx(te,{className:i,style:r,$span:e,$rowSpan:s,children:d})}const ee=o.section`
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
  ${({$rowSpan:e})=>e>1?E`
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
    ${({$rowSpan:e})=>e>1?E`
            grid-row: auto;
          `:null};
  }
`;function se({data:e,loading:s,error:i,onRetry:r}){const d=e?`${e.totalStudents}명`:"—";return t.jsx(C,{title:"총 원생 수",icon:t.jsx(F,{}),iconAccent:"indigo",value:d,footerLeft:void 0,footerRight:void 0,loading:s,error:i,onRetry:r})}function ne({data:e,loading:s,error:i,onRetry:r}){const d=e?`${e.attendanceRate}%`:"—",u=e?`${e.attendanceNumerator}/${e.attendanceDenominator}`:"—";return t.jsx(C,{title:"오늘 출석률",icon:t.jsx(U,{}),iconAccent:"green",value:d,footerLeft:u,footerRight:void 0,loading:s,error:i,onRetry:r})}function oe({data:e,loading:s,error:i,onRetry:r}){const d=e?`${e.classCountToday}개`:"—",u=e?e.dateLabel:"—";return t.jsx(C,{title:"오늘 수업",icon:t.jsx(H,{}),iconAccent:"violet",value:d,footerLeft:u,footerRight:void 0,loading:s,error:i,onRetry:r})}function re(){const e=B(),[s,i]=c.useState(null),[r,d]=c.useState(!1),[u,m]=c.useState(null),[a,p]=c.useState("ALL"),h=c.useCallback(async()=>{d(!0),m(null);try{const n=S(new Date),g=await O({from:n,to:n});i(g[0]??null)}catch(n){m(ae(n,"출결 데이터를 불러오지 못했습니다."))}finally{d(!1)}},[]);c.useEffect(()=>{h();const n=()=>{h()},g=setInterval(n,6e4);return window.addEventListener("calendar:classes-refresh",n),window.addEventListener("dashboard:attendance-refresh",n),()=>{clearInterval(g),window.removeEventListener("calendar:classes-refresh",n),window.removeEventListener("dashboard:attendance-refresh",n)}},[h]);const l=c.useMemo(()=>({present:s?.presentCount??0,absent:s?.absentCount??0,unprocessed:s?.unprocessedCount??0}),[s]),$=c.useMemo(()=>s?K(s):[],[s]),b=c.useMemo(()=>_($,a),[$,a]),j=!r&&!u&&!s&&l.present+l.absent+l.unprocessed===0,f=!r&&!u&&s!=null&&b.length===0;return t.jsxs(D,{span:6,children:[t.jsxs(ie,{children:[t.jsxs(ce,{children:[t.jsx(de,{children:"오늘 출결 요약"}),t.jsxs(le,{children:[t.jsx(he,{children:r?"불러오는 중…":`${s?s.classCount:0}개 수업`}),u?t.jsx(pe,{children:u}):null]})]}),t.jsx(me,{children:t.jsx(ue,{type:"button",onClick:()=>e("/attendance"),children:"더보기"})})]}),t.jsxs(fe,{children:[t.jsxs(v,{"data-variant":"present",children:["출석 ",l.present,"명"]}),t.jsxs(v,{"data-variant":"absent",children:["결석 ",l.absent,"명"]}),t.jsxs(v,{"data-variant":"none",children:["미처리 ",l.unprocessed,"명"]})]}),t.jsx(ge,{children:G.map(n=>t.jsx(xe,{type:"button","data-active":a===n.value||void 0,onClick:()=>p(n.value),children:n.label},n.value))}),j&&t.jsx(M,{title:"오늘 출결 데이터가 없습니다.",description:"출결 관리에서 수업 출석을 기록하면 이곳에서 요약으로 확인할 수 있어요.",actionLabel:"더보기",onAction:()=>e("/attendance"),actionVariant:"outline"}),t.jsxs($e,{children:[r&&t.jsx(be,{children:t.jsx("span",{role:"status",children:"불러오는 중…"})}),f&&t.jsx(M,{title:"선택한 필터에 해당하는 출결이 없습니다.",description:"다른 상태를 선택해 확인해 보세요."}),!r&&!f&&t.jsx(ye,{children:b.map(n=>t.jsxs(je,{children:[t.jsxs(ve,{children:[t.jsxs(we,{children:[t.jsx(Se,{children:n.studentName??"이름 없음"}),t.jsx(Ce,{children:n.courseTitle??"-"})]}),t.jsxs(Ee,{children:[t.jsx(ke,{"data-type":n.status.toLowerCase(),children:q(n.status)}),t.jsx(ze,{children:n.status==="UNPROCESSED"?"미처리":V(n.createdAt)}),n.status!=="UNPROCESSED"&&t.jsx(Me,{"data-type":(n.source??"MANUAL").toUpperCase(),children:J(n.source)})]})]}),n.status==="UNPROCESSED"?t.jsxs(w,{children:[t.jsxs(L,{children:["미처리 인원 ",n.count??0,"명"]}),n.students&&n.students.length>0&&t.jsx(Ae,{children:n.students.map((g,N)=>t.jsx(Be,{children:g},`${n.key}-student-${N}`))})]}):n.reason?t.jsx(w,{children:t.jsx(Le,{children:n.reason})}):n.status==="ABSENT"?t.jsx(w,{children:t.jsx(L,{children:"사유 없음"})}):null]},n.key))})]})]})}function ae(e,s){return e instanceof Error&&e.message?e.message:typeof e=="string"&&e.trim()?e:s}const ie=o.header`
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
`,ue=o(I)`
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
`,v=o.span`
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
`,je=o.article`
  display: flex;
  flex-direction: column;
  gap: ${e=>e.theme.spacing.sm};
  padding: ${e=>e.theme.spacing.md};
  border: 1px solid ${e=>e.theme.colors.border};
  border-radius: ${e=>e.theme.radii.md};
  background: ${e=>e.theme.colors.surface};
  box-shadow: ${e=>e.theme.shadow.low};
`,ve=o.div`
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
`,Ee=o.div`
  display: inline-flex;
  align-items: center;
  gap: ${e=>e.theme.spacing.xs};
  flex-wrap: wrap;
`,ke=o.span`
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
`,L=o.span`
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
`;function De(){const e=B(),[s,i]=c.useState([]),[r,d]=c.useState(null);c.useEffect(()=>{let m=!1;async function a(){d(null);try{const l=await Q(S(new Date));m||i(l)}catch(l){m||d(Pe(l,"오늘 수업을 불러오지 못했습니다."))}finally{}}a();const p=setInterval(a,15e3),h=()=>{document.visibilityState==="visible"&&a()};return document.addEventListener("visibilitychange",h),()=>{m=!0,clearInterval(p),document.removeEventListener("visibilitychange",h)}},[]);const u=s.map(m=>{const a=m,p=y(a,["startTime","start_at","startAt","start"]),h=y(a,["endTime","end_at","endAt","end"]),l=typeof a.attendance=="object"&&a.attendance!==null?a.attendance:null,$=x(a,["attPresent","presentCount","attendancePresent"])??A(l,["present"])??0,b=x(a,["attAbsent","absentCount","attendanceAbsent"])??A(l,["absent"])??0,j=x(a,["attUnprocessed","unprocessedCount"])??0,f=x(a,["recordId","id"]),n=Ie(y(a,["notes","content","topic"]));return{subject:m.courseTitle||"수업",time:W(p,h),room:"-",teacher:"-",student:"-",done:!1,courseId:m.courseId||void 0,date:m.recordDate||y(a,["date"]),recordId:typeof f=="number"?f:void 0,notes:n,attPresent:$,attAbsent:b,attUnprocessed:j}});return t.jsx(D,{span:6,rowSpan:2,children:t.jsxs(Te,{children:[t.jsx(Y,{items:u,actionLabel:"더보기",onAdd:()=>e(`/calendar/${S(new Date)}`),titleMode:"subject",showNotes:!0,embedded:!0}),r&&t.jsx(Ne,{children:r})]})})}const Ne=o.div`
  color: ${e=>e.theme.colors.danger};
  font-size: ${e=>e.theme.font.size.sm};
  font-weight: ${e=>e.theme.font.weight.semiBold};
`,Te=o.div`
  flex: 1;
  min-height: 0;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: ${e=>e.theme.spacing.sm};
`;function y(e,s){for(const i of s){const r=e[i];if(typeof r=="string"&&r.trim())return r}return null}function x(e,s){for(const i of s){const r=e[i];if(typeof r=="number"&&Number.isFinite(r))return r}return null}function A(e,s){return e?x(e,s):null}function Ie(e){if(!e)return null;const s=e.trim();return s==="정기 수업"||s==="정기수업"?null:s||null}function Pe(e,s){return e instanceof Error&&e.message?e.message:typeof e=="string"&&e.trim()?e:s}const Re="대시보드";function Fe({title:e=Re,createStudentHref:s,createCourseHref:i,kpiProps:r}){return t.jsx(P,{children:t.jsxs(Z,{children:[t.jsxs(He,{children:[t.jsx("div",{children:t.jsx("h2",{children:e})}),t.jsxs(Ue,{children:[t.jsx(z,{to:s,children:"원생 추가"}),t.jsx(z,{to:i,children:"수업 추가"})]})]}),t.jsx(se,{...r}),t.jsx(ne,{...r}),t.jsx(oe,{...r}),t.jsx(re,{}),t.jsx(De,{})]})})}const Ue=o.div`
  display: inline-flex;
  gap: ${e=>e.theme.spacing.sm};
  align-items: center;
  flex-wrap: wrap;
`,He=o(R)`
  grid-column: 1 / -1;
`;async function Oe(){return await T("/api/dashboard/summary")}function Ke(){const e=X({queryKey:["dashboard","summary"],queryFn:Oe,staleTime:3e4,gcTime:3e5,retry:1});return{status:e.status==="pending"?"loading":e.status==="error"?"error":e.status==="success"?"success":"idle",data:e.data??null,error:e.error,refresh:e.refetch}}function _e(){const e=Ke(),s=c.useMemo(()=>({data:e.data,loading:e.status==="loading",error:!!e.error,onRetry:e.refresh}),[e.data,e.error,e.refresh,e.status]);return c.useMemo(()=>({title:"대시보드",createStudentHref:k.studentsNew,createCourseHref:k.classesNew,kpiProps:s}),[s])}function tt(){const e=_e();return t.jsx(Fe,{...e})}export{tt as default};
