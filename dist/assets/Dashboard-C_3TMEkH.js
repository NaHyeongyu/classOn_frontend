import{f as j,r as l,j as t,d as r,l as $,u as y,P as z,a as b,b as A}from"./index-ColAvXhj.js";import{K as g,U as M,C as k,a as D}from"./KPI-mq8la7Xn.js";import{E as N}from"./EmptyPlaceholder-DMEQhbP7.js";import{g as T}from"./calendar-DhlMyOOb.js";import{f as v}from"./dateUtils-CoPTMMCx.js";import{f as P}from"./format-Do6vjlY3.js";import{C as B}from"./ClassList-CIW2R9Aa.js";async function R(){return await j("/api/dashboard/attendance-today")}async function H(){return await j("/api/dashboard/summary")}function K(){const[e,n]=l.useState("idle"),[a,s]=l.useState(null),[c,u]=l.useState(null),d=l.useCallback(async()=>{n("loading"),u(null);try{const o=await H();s(o),n("success")}catch(o){u(o),n("error")}},[]);return l.useEffect(()=>{e==="idle"&&d()},[e,d]),l.useMemo(()=>({status:e,data:a,error:c,refresh:d}),[e,a,c,d])}function F({children:e}){return t.jsx(O,{children:e})}function S({span:e=6,rowSpan:n=1,className:a,style:s,children:c}){return t.jsx(U,{className:a,style:s,$span:e,$rowSpan:n,children:c})}const O=r.section`
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
`,U=r.section`
  display: flex;
  flex-direction: column;
  gap: ${e=>e.theme.spacing.md};
  min-height: 0;
  grid-column: span ${({$span:e})=>e};
  ${({$rowSpan:e})=>e>1?$`
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
    ${({$rowSpan:e})=>e>1?$`
            grid-row: auto;
          `:null};
  }
`;function G({data:e,loading:n,error:a,onRetry:s}){const c=e?`${e.totalStudents}명`:"—";return t.jsx(g,{title:"총 원생 수",icon:t.jsx(M,{}),iconAccent:"indigo",value:c,footerLeft:void 0,footerRight:void 0,loading:n,error:a,onRetry:s})}function V({data:e,loading:n,error:a,onRetry:s}){const c=e?`${e.attendanceRate}%`:"—",u=e?`${e.attendanceNumerator}/${e.attendanceDenominator}`:"—";return t.jsx(g,{title:"오늘 출석률",icon:t.jsx(k,{}),iconAccent:"green",value:c,footerLeft:u,footerRight:void 0,loading:n,error:a,onRetry:s})}function _({data:e,loading:n,error:a,onRetry:s}){const c=e?`${e.classCountToday}개`:"—",u=e?e.dateLabel:"—";return t.jsx(g,{title:"오늘 수업",icon:t.jsx(D,{}),iconAccent:"violet",value:c,footerLeft:u,footerRight:void 0,loading:n,error:a,onRetry:s})}function J(){const e=y(),[n,a]=l.useState([]),[s,c]=l.useState(!1),[u,d]=l.useState(null),i=l.useCallback(async()=>{c(!0),d(null);try{const o=await R();a(o.filter(m=>m.present))}catch(o){d(q(o,"출석 정보를 불러오지 못했습니다."))}finally{c(!1)}},[]);return l.useEffect(()=>{i();const o=setInterval(i,6e4);function m(){i()}return window.addEventListener("calendar:classes-refresh",m),window.addEventListener("dashboard:attendance-refresh",m),()=>{clearInterval(o),window.removeEventListener("calendar:classes-refresh",m),window.removeEventListener("dashboard:attendance-refresh",m)}},[i]),t.jsxs(S,{span:6,children:[t.jsx(Q,{children:t.jsxs(X,{children:[t.jsx(Z,{children:"출석 학생"}),t.jsxs(ee,{children:[t.jsx(te,{children:s?"불러오는 중…":`${n.length}건`}),u?t.jsx(ne,{children:u}):null]})]})}),t.jsxs(se,{children:[n.length===0&&!s&&t.jsx(N,{title:"오늘 등록된 출석 기록이 없습니다.",description:"수업 상세에서 출석을 체크하면 이곳에서 바로 확인할 수 있어요.",actionLabel:"출석 입력하러 가기",onAction:()=>e("/calendar"),actionVariant:"outline"}),n.map(o=>t.jsx(oe,{children:t.jsxs(re,{children:[t.jsxs(ae,{children:[t.jsx(ie,{children:o.studentName}),t.jsx(ce,{children:o.courseTitle?o.courseId?t.jsx(he,{type:"button",onClick:()=>e(`/classes/${o.courseId}`),children:o.courseTitle}):o.courseTitle:"-"})]}),t.jsxs(de,{children:[t.jsx(ue,{children:"출석"}),t.jsx(le,{children:W(o.createdAt)}),t.jsx(me,{"data-type":o.source,children:Y(o.source)})]})]})},o.id))]})]})}function W(e){try{const n=new Date(e);if(Number.isNaN(n.getTime()))return e;const a=String(n.getHours()).padStart(2,"0"),s=String(n.getMinutes()).padStart(2,"0");return`${a}:${s}`}catch{return e}}function Y(e){return e==="MOBILE"?"모바일":"수동"}function q(e,n){return e instanceof Error&&e.message?e.message:typeof e=="string"&&e.trim()?e:n}const Q=r.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${e=>e.theme.spacing.md};
  flex-wrap: wrap;
`,X=r.div`
  display: flex;
  flex-direction: column;
  gap: ${e=>e.theme.spacing.xs};
`,Z=r.h3`
  margin: 0;
  font-size: ${e=>e.theme.font.size.lg};
  font-weight: ${e=>e.theme.font.weight.semiBold};
  color: ${e=>e.theme.colors.text};
`,ee=r.div`
  display: inline-flex;
  align-items: center;
  gap: ${e=>e.theme.spacing.xs};
`,te=r.span`
  color: ${e=>e.theme.colors.textMuted};
  font-size: ${e=>e.theme.font.size.sm};
`,ne=r.span`
  color: ${e=>e.theme.colors.danger};
  font-size: ${e=>e.theme.font.size.sm};
  font-weight: ${e=>e.theme.font.weight.semiBold};
`,se=r.div`
  display: grid;
  gap: ${e=>e.theme.spacing.sm};
  margin-top: ${e=>e.theme.spacing.sm};
`,oe=r.article`
  display: flex;
  flex-direction: column;
  gap: ${e=>e.theme.spacing.sm};
  padding: ${e=>e.theme.spacing.md} ${e=>e.theme.spacing.lg};
  border: 1px solid ${e=>e.theme.colors.border};
  border-radius: ${e=>e.theme.radii.md};
  background: ${e=>e.theme.colors.surface};
  box-shadow: ${e=>e.theme.shadow.low};
`,re=r.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${e=>e.theme.spacing.md};
  flex-wrap: wrap;
`,ae=r.div`
  display: flex;
  flex-direction: column;
  gap: ${e=>e.theme.spacing.xs};
  min-width: 0;
`,ie=r.strong`
  font-size: ${e=>e.theme.font.size.lg};
  font-weight: ${e=>e.theme.font.weight.semiBold};
  color: ${e=>e.theme.colors.text};
  letter-spacing: -0.01em;
`,ce=r.span`
  font-size: ${e=>e.theme.font.size.sm};
  color: ${e=>e.theme.colors.textMuted};
`,de=r.div`
  display: inline-flex;
  align-items: center;
  gap: ${e=>e.theme.spacing.xs};
  flex-wrap: wrap;
`,le=r.span`
  font-size: ${e=>e.theme.font.size.sm};
  color: ${e=>e.theme.colors.textMuted};
`,ue=r.span`
  display: inline-flex;
  align-items: center;
  gap: ${e=>e.theme.spacing.xs};
  padding: 4px ${e=>e.theme.spacing.sm};
  border-radius: 9999px;
  font-size: ${e=>e.theme.font.size.sm};
  font-weight: ${e=>e.theme.font.weight.bold};
  background: ${e=>e.theme.colors.successSurface};
  color: ${e=>e.theme.colors.success};
  border: 1px solid rgba(5, 150, 105, 0.3);
`,me=r.span`
  padding: 2px ${e=>e.theme.spacing.sm};
  border-radius: 9999px;
  font-size: ${e=>e.theme.font.size.sm};
  font-weight: ${e=>e.theme.font.weight.medium};
  border: 1px solid ${e=>e.theme.colors.border};
  color: ${e=>e.theme.colors.text};
  background: ${e=>e.theme.colors.surfaceAlt};

  &[data-type='MOBILE'] {
    background: ${e=>e.theme.colors.successSurface};
    color: ${e=>e.theme.colors.success};
    border-color: rgba(5, 150, 105, 0.3);
  }
`,he=r.button`
  all: unset;
  cursor: pointer;
  color: ${e=>e.theme.colors.info};
  font-weight: ${e=>e.theme.font.weight.semiBold};
  &:hover {
    text-decoration: underline;
  }
`;function fe(){const e=y(),[n,a]=l.useState([]),[s,c]=l.useState(null);l.useEffect(()=>{let d=!1;async function i(){c(null);try{const h=await T(v(new Date));d||a(h)}catch(h){d||c($e(h,"오늘 수업을 불러오지 못했습니다."))}finally{}}i();const o=setInterval(i,15e3),m=()=>{document.visibilityState==="visible"&&i()};return document.addEventListener("visibilitychange",m),()=>{d=!0,clearInterval(o),document.removeEventListener("visibilitychange",m)}},[]);const u=n.map(d=>{const i=d,o=p(i,["startTime","start_at","startAt","start"]),m=p(i,["endTime","end_at","endAt","end"]),h=typeof i.attendance=="object"&&i.attendance!==null?i.attendance:null,E=f(i,["attPresent","presentCount","attendancePresent"])??w(h,["present"])??0,C=f(i,["attAbsent","absentCount","attendanceAbsent"])??w(h,["absent"])??0,L=f(i,["attUnprocessed","unprocessedCount"])??0,x=f(i,["recordId","id"]),I=xe(p(i,["notes","content","topic"]));return{subject:d.courseTitle||"수업",time:P(o,m),room:"-",teacher:"-",student:"-",done:!1,courseId:d.courseId||void 0,date:d.recordDate||p(i,["date"]),recordId:typeof x=="number"?x:void 0,notes:I,attPresent:E,attAbsent:C,attUnprocessed:L}});return t.jsx(S,{span:6,rowSpan:2,children:t.jsxs(ge,{children:[t.jsx(B,{items:u,actionLabel:"더보기",onAdd:()=>e(`/calendar/${v(new Date)}`),titleMode:"subject",showNotes:!0}),s&&t.jsx(pe,{children:s})]})})}const pe=r.div`
  color: ${e=>e.theme.colors.danger};
  font-size: ${e=>e.theme.font.size.sm};
  font-weight: ${e=>e.theme.font.weight.semiBold};
`,ge=r.div`
  flex: 1;
  min-height: 0;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: ${e=>e.theme.spacing.sm};
`;function p(e,n){for(const a of n){const s=e[a];if(typeof s=="string"&&s.trim())return s}return null}function f(e,n){for(const a of n){const s=e[a];if(typeof s=="number"&&Number.isFinite(s))return s}return null}function w(e,n){return e?f(e,n):null}function xe(e){if(!e)return null;const n=e.trim();return n==="정기 수업"||n==="정기수업"?null:n||null}function $e(e,n){return e instanceof Error&&e.message?e.message:typeof e=="string"&&e.trim()?e:n}function Ie(){const{status:e,data:n,error:a,refresh:s}=K(),c={data:n,loading:e==="loading",error:!!a,onRetry:s};return t.jsx(z,{children:t.jsxs(F,{children:[t.jsxs(ve,{children:[t.jsx("div",{children:t.jsx("h2",{children:"대시보드"})}),t.jsxs(be,{children:[t.jsx(b,{to:"/students/new",children:"원생 추가"}),t.jsx(b,{to:"/classes/new",children:"수업 추가"})]})]}),t.jsx(G,{...c}),t.jsx(V,{...c}),t.jsx(_,{...c}),t.jsx(J,{}),t.jsx(fe,{})]})})}const be=r.div`
  display: inline-flex;
  gap: ${e=>e.theme.spacing.sm};
  align-items: center;
  flex-wrap: wrap;
`,ve=r(A)`
  grid-column: 1 / -1;
`;export{Ie as default};
