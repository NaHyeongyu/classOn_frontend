import{r as a,u as A,j as e,L as M,d as n}from"./index-Bf8ggjEf.js";import{b as P,S as z,c as m,f as I,T as O,P as Q}from"./UI-27qTHgPb.js";import{E as U}from"./EmptyPlaceholder-ilYvfVTi.js";import{g as V,b as H,S as _,f as W,l as Y,t as q,s as G,a as J,c as K}from"./constants-D9dLGhsB.js";function L(o){const d=o.getFullYear(),r=String(o.getMonth()+1).padStart(2,"0"),p=String(o.getDate()).padStart(2,"0");return`${d}-${r}-${p}`}function X(o,d){const r=new Date(o);return r.setDate(r.getDate()+d),r}function Z(){const o=a.useMemo(()=>L(new Date),[]),[d,r]=a.useState(o),[p,h]=a.useState(o),[j,y]=a.useState([]),[v,l]=a.useState(!1),[C,c]=a.useState(null);a.useEffect(()=>{let i=!1;async function x(){l(!0),c(null);try{const u=await V({from:p,to:p});i||y(u.map(f=>({...f,attendances:f.attendances??[]})))}catch(u){if(!i){const f=u instanceof Error?u.message:"출결 정보를 불러오지 못했습니다.";c(f)}}finally{i||l(!1)}}return x(),()=>{i=!0}},[p]);const k=a.useCallback(i=>{r(i),c(null)},[]),b=a.useCallback(()=>d?(c(null),h(d),!0):(c("조회할 날짜를 선택해주세요."),!1),[d]),S=a.useCallback(i=>{const x=L(X(new Date,i));return r(x),c(null),h(x),x},[]);return{formDate:d,rows:j,loading:v,error:C,setDate:k,submit:b,applyQuick:S}}function Ae(){const o=A(),{formDate:d,rows:r,loading:p,error:h,setDate:j,submit:y,applyQuick:v}=Z(),[l,C]=a.useState("daily"),[c,k]=a.useState("ALL");function b(s){C(s)}function S(s){s.preventDefault(),y()}function i(s){v(s),l!=="daily"&&b("daily")}function x(s,g){s&&g?o(`/classes/${s}/history/${g}`):s&&o(`/classes/${s}`)}function u(s){x(s.courseId,s.recordId??null)}const f=a.useMemo(()=>r.map(s=>({day:s,rows:H(s)})),[r]);return e.jsxs(Ee,{children:[e.jsx(P,{children:e.jsxs("div",{children:[e.jsx("h2",{children:"출결 관리"}),e.jsx("p",{children:"날짜별로 출결 현황을 확인하고 수업 상세로 이동하세요."})]})}),e.jsxs(ie,{children:[e.jsxs(re,{children:[e.jsx($,{type:"button","data-active":l==="daily"||void 0,onClick:()=>b("daily"),children:"일자별 보기"}),e.jsx($,{type:"button","data-active":l==="class"||void 0,onClick:()=>b("class"),children:"수업별 보기"})]}),l==="daily"&&e.jsx(de,{children:_.map(s=>e.jsx(le,{type:"button","data-active":c===s.value||void 0,onClick:()=>k(s.value),children:s.label},s.value))})]}),e.jsxs(z,{as:"form",onSubmit:S,children:[e.jsxs(ee,{children:[e.jsxs(te,{children:[e.jsx("label",{htmlFor:"attendance-date",children:"조회일"}),e.jsx("input",{id:"attendance-date",type:"date",value:d,onChange:s=>j(s.target.value)})]}),e.jsxs(ne,{children:[e.jsx(T,{type:"button",onClick:()=>i(0),children:"오늘"}),e.jsx(T,{type:"button",onClick:()=>i(-1),children:"어제"}),e.jsx(T,{type:"button",onClick:()=>i(-2),children:"이틀 전"})]}),e.jsx(se,{type:"submit",children:"조회"})]}),h&&e.jsx(ae,{children:h})]}),p&&e.jsxs(oe,{children:[e.jsx(M,{}),e.jsx("span",{children:"불러오는 중…"})]}),!p&&f.length===0&&e.jsx(z,{children:e.jsx(U,{title:"선택한 날짜에 출결 기록이 없습니다.",description:"수업 상세에서 출석을 체크하면 이곳에서 바로 확인할 수 있어요.",actionLabel:"수업 일정 보기",onAction:()=>o("/calendar"),actionVariant:"outline"})}),f.map(({day:s,rows:g})=>{const E=l==="daily"?W(g,c):[];return e.jsxs(z,{children:[e.jsxs(ce,{children:[e.jsxs("div",{children:[e.jsx("strong",{children:Y(s.date)}),e.jsx("span",{children:s.classCount?`${s.classCount}개의 수업`:"수업 없음"})]}),e.jsxs(pe,{children:[e.jsxs(D,{"data-type":"present",children:["출석 ",s.presentCount]}),e.jsxs(D,{"data-type":"absent",children:["결석 ",s.absentCount]}),e.jsxs(D,{"data-type":"unprocessed",children:["미처리 ",s.unprocessedCount]})]})]}),l==="class"?s.classes.length>0?e.jsx(xe,{children:e.jsxs(ue,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"수업"}),e.jsx("th",{children:"시간"}),e.jsx("th",{className:"num",children:"출석"}),e.jsx("th",{className:"num",children:"결석"}),e.jsx("th",{className:"num",children:"미처리"}),e.jsx("th",{children:"상세"})]})}),e.jsx("tbody",{children:s.classes.map((t,w)=>e.jsxs("tr",{children:[e.jsx("td",{children:e.jsxs(fe,{children:[e.jsx("button",{type:"button",onClick:()=>u(t),children:t.courseTitle||"제목 없음"}),t.topic&&e.jsx("small",{children:t.topic})]})}),e.jsx("td",{children:q(t.startTime,t.endTime)}),e.jsx("td",{className:"num",children:t.presentCount}),e.jsx("td",{className:"num",children:t.absentCount}),e.jsx("td",{className:"num",children:t.unprocessedCount}),e.jsx("td",{className:"actions",children:e.jsx(he,{type:"button",onClick:()=>u(t),children:"상세보기"})})]},`${s.date}-${t.recordId??`${t.courseId??"course"}-${w}`}`))})]})}):e.jsx(B,{children:"등록된 수업이 없습니다."}):e.jsxs(be,{children:[e.jsx(ge,{children:"출석 학생"}),E.length>0?e.jsx(me,{children:E.map(t=>e.jsxs(je,{children:[e.jsxs(ye,{children:[e.jsxs(ve,{children:[e.jsx("strong",{children:t.studentName}),e.jsx("span",{className:"course",children:t.courseTitle?t.courseId?e.jsx(ze,{type:"button",onClick:()=>x(t.courseId,t.recordId),children:t.courseTitle}):t.courseTitle:"-"})]}),e.jsxs(Ce,{children:[e.jsx(Se,{"data-type":t.status.toLowerCase(),children:G(t.status)}),e.jsx(ke,{children:t.status==="UNPROCESSED"?"미처리":J(t.createdAt)}),t.status!=="UNPROCESSED"&&e.jsx(we,{"data-type":(t.source??"MANUAL").toUpperCase(),children:K(t.source)})]})]}),t.status==="UNPROCESSED"?e.jsxs(N,{children:[e.jsxs(F,{children:["미처리 인원 ",t.count??0,"명"]}),t.students&&t.students.length>0&&e.jsx(De,{children:t.students.map((w,R)=>e.jsx(Ne,{children:w},`${t.key}-student-${R}`))})]}):t.reason?e.jsx(N,{children:e.jsx(Te,{children:t.reason})}):t.status==="ABSENT"?e.jsx(N,{children:e.jsx(F,{children:"사유 없음"})}):null]},t.key))}):e.jsx(B,{children:"조건에 맞는 출석 기록이 없습니다."})]})]},s.date)})]})}const ee=n.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  align-items: flex-end;
`,te=n.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  label {
    font-size: 13px;
    color: #4b5563;
  }
  input[type='date'] {
    height: 40px;
    padding: 0 12px;
    border-radius: 10px;
    border: 1px solid #e5e7eb;
    background: #fff;
    color: #111827;
    font-size: 14px;
  }
`,ne=n.div`
  display: inline-flex;
  flex-wrap: wrap;
  gap: 2px;
`,T=n.button`
  ${m.outline};
  height: 36px;
  padding: 0 14px;
  font-size: 13px;
`,se=n(I)`
  height: 40px;
  padding: 0 20px;
`,ae=n.div`
  margin-top: 12px;
  color: #b91c1c;
  font-size: 13px;
`,oe=n.div`
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #fff;
  color: #4b5563;
  font-size: 14px;
`,ie=n.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  flex-wrap: wrap;
  margin: 0 0 6px;
`,re=n.div`
  display: inline-flex;
  align-items: center;
  gap: 2px;
`,$=n.button`
  ${m.outline};
  height: 36px;
  padding: 0 18px;
  font-size: 13px;
  &[data-active] {
    background: #111827;
    color: #ffffff;
    border-color: #111827;
  }
`,de=n.div`
  display: inline-flex;
  flex-wrap: wrap;
  gap: 4px;
`,le=n.button`
  ${m.outline};
  height: 32px;
  padding: 0 14px;
  font-size: 12px;
  &[data-active] {
    background: #1f2937;
    color: #fff;
    border-color: #1f2937;
  }
`,ce=n.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  strong {
    display: block;
    font-size: 18px;
    color: #111827;
  }
  span {
    display: block;
    font-size: 13px;
    color: #6b7280;
    margin-top: 4px;
  }
  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
  }
`,pe=n.div`
  display: inline-flex;
  gap: 4px;
`,D=n.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 700;
  border: 1px solid #e5e7eb;
  &[data-type='present'] {
    background: #dcfce7;
    color: #15803d;
    border-color: #bbf7d0;
  }
  &[data-type='absent'] {
    background: #fee2e2;
    color: #b91c1c;
    border-color: #fecaca;
  }
  &[data-type='unprocessed'] {
    background: #f3f4f6;
    color: #4b5563;
    border-color: #e5e7eb;
  }
`,xe=n.div`
  overflow-x: auto;
`,ue=n(O)`
  min-width: 820px;
  thead th {
    padding: 12px 20px;
    font-size: 12px;
    color: #6b7280;
    background: #fafafa;
  }
  tbody td {
    padding: 14px 20px;
    border-bottom: 1px solid #edf2f7;
    font-size: 14px;
  }
  tbody tr:last-child td {
    border-bottom: none;
  }
  tbody td.num {
    text-align: right;
    font-feature-settings: 'tnum';
  }
  tbody td.actions {
    text-align: right;
    width: 120px;
  }
  tbody tr:hover td {
    background: #f9fafb;
  }
`,fe=n.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  button {
    all: unset;
    cursor: pointer;
    color: #1f2937;
    font-weight: 700;
    line-height: 1.2;
  }
  button:hover {
    text-decoration: underline;
  }
  small {
    color: #6b7280;
    font-size: 12px;
  }
`,he=n.button`
  ${m.subtle};
  height: 32px;
  padding: 0 14px;
  font-size: 13px;
`,B=n.div`
  padding: 12px;
  border-radius: 10px;
  background: #f9fafb;
  color: #6b7280;
  font-size: 13px;
`,be=n.div`
  margin-top: 16px;
  display: grid;
  gap: 2px;
`,ge=n.h4`
  margin: 0;
  font-size: 15px;
  color: #111827;
  font-weight: 700;
`,me=n.div`
  display: grid;
  gap: 4px;
`,je=n.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.06);
`,ye=n.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
`,ve=n.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  strong {
    font-size: 15px;
    color: #111827;
    letter-spacing: -0.01em;
  }
  .course {
    font-size: 13px;
    color: #6b7280;
  }
`,Ce=n.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
`,ke=n.span`
  font-size: 12px;
  color: #6b7280;
`,N=n.div`
  font-size: 12px;
  color: #4b5563;
  border-top: 1px solid #f3f4f6;
  padding-top: 6px;
`,Se=n.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 56px;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 700;
  border: 1px solid transparent;
  &[data-type='present'] {
    background: #dcfce7;
    color: #15803d;
    border-color: #bbf7d0;
  }
  &[data-type='absent'] {
    background: #fee2e2;
    color: #b91c1c;
    border-color: #fecaca;
  }
  &[data-type='unprocessed'] {
    background: #fef3c7;
    color: #b45309;
    border-color: #fcd34d;
  }
`,we=n.span`
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 700;
  border: 1px solid #e5e7eb;
  color: #374151;
  background: #f9fafb;
  &[data-type='MOBILE'] {
    background: #dcfce7;
    color: #16a34a;
    border-color: #bbf7d0;
  }
`,ze=n.button`
  all: unset;
  cursor: pointer;
  color: #2563eb;
  font-weight: 600;
  &:hover {
    text-decoration: underline;
  }
`,Te=n.div`
  font-size: 12px;
  color: #374151;
  line-height: 1.5;
`,F=n.div`
  font-size: 12px;
  color: #9ca3af;
`,De=n.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 6px;
`,Ne=n.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 9999px;
  background: #f3f4f6;
  color: #374151;
  font-size: 12px;
  border: 1px solid #e5e7eb;
`,Ee=n(Q)`
  gap: 16px;
`;export{Ae as default};
