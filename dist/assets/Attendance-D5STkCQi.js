import{j as e,L as A,d as n,r as l,u as B}from"./index-B0K7mn4q.js";import{b as F,S,c as v,f as R,T as P,P as O}from"./UI-Cj3YhchZ.js";import{E as I}from"./EmptyPlaceholder-0vR7E1DK.js";import{S as M,f as U,l as V,t as Q,s as H,a as _,c as W,g as Y,b as q}from"./constants-VkN453I-.js";function G({formDate:a,onChangeDate:o,onSubmit:i,onQuickSelect:d,loading:r,error:p,viewMode:x,onChangeView:h,statusFilter:u,onChangeStatusFilter:m,dailyRows:c,onNavigateCalendar:j,onOpenCourseRecord:y,onOpenRecord:g}){return e.jsxs(De,{children:[e.jsx(F,{children:e.jsxs("div",{children:[e.jsx("h2",{children:"출결 관리"}),e.jsx("p",{children:"날짜별로 출결 현황을 확인하고 수업 상세로 이동하세요."})]})}),e.jsxs(ne,{children:[e.jsxs(se,{children:[e.jsx(w,{type:"button","data-active":x==="daily"||void 0,onClick:()=>h("daily"),children:"일자별 보기"}),e.jsx(w,{type:"button","data-active":x==="class"||void 0,onClick:()=>h("class"),children:"수업별 보기"})]}),x==="daily"&&e.jsx(ae,{children:M.map(s=>e.jsx(oe,{type:"button","data-active":u===s.value||void 0,onClick:()=>m(s.value),children:s.label},s.value))})]}),e.jsxs(S,{as:"form",onSubmit:i,children:[e.jsxs(J,{children:[e.jsxs(K,{children:[e.jsx("label",{htmlFor:"attendance-date",children:"조회일"}),e.jsx("input",{id:"attendance-date",type:"date",value:a,onChange:s=>o(s.target.value)})]}),e.jsxs(X,{children:[e.jsx(z,{type:"button",onClick:()=>d(0),children:"오늘"}),e.jsx(z,{type:"button",onClick:()=>d(-1),children:"어제"}),e.jsx(z,{type:"button",onClick:()=>d(-2),children:"이틀 전"})]}),e.jsx(Z,{type:"submit",children:"조회"})]}),p&&e.jsx(ee,{children:p})]}),r&&e.jsxs(te,{children:[e.jsx(A,{}),e.jsx("span",{children:"불러오는 중…"})]}),!r&&c.length===0&&e.jsx(S,{children:e.jsx(I,{title:"선택한 날짜에 출결 기록이 없습니다.",description:"수업 상세에서 출석을 체크하면 이곳에서 바로 확인할 수 있어요.",actionLabel:"수업 일정 보기",onAction:j,actionVariant:"outline"})}),c.map(({day:s,rows:f})=>{const b=x==="daily"?U(f,u):f;return e.jsxs(S,{children:[e.jsxs(ie,{children:[e.jsxs("div",{children:[e.jsx("strong",{children:V(s.date)}),e.jsx("span",{children:s.classCount?`${s.classCount}개의 수업`:"수업 없음"})]}),e.jsxs(re,{children:[e.jsxs(D,{"data-type":"present",children:["출석 ",s.presentCount]}),e.jsxs(D,{"data-type":"absent",children:["결석 ",s.absentCount]}),e.jsxs(D,{"data-type":"unprocessed",children:["미처리 ",s.unprocessedCount]})]})]}),x==="class"?s.classes.length>0?e.jsx(de,{children:e.jsxs(le,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"수업"}),e.jsx("th",{children:"시간"}),e.jsx("th",{className:"num",children:"출석"}),e.jsx("th",{className:"num",children:"결석"}),e.jsx("th",{className:"num",children:"미처리"}),e.jsx("th",{children:"상세"})]})}),e.jsx("tbody",{children:s.classes.map((t,k)=>e.jsxs("tr",{children:[e.jsx("td",{children:e.jsxs(ce,{children:[e.jsx("button",{type:"button",onClick:()=>g(t),children:t.courseTitle||"제목 없음"}),t.topic&&e.jsx("small",{children:t.topic})]})}),e.jsx("td",{children:Q(t.startTime,t.endTime)}),e.jsx("td",{className:"num",children:t.presentCount}),e.jsx("td",{className:"num",children:t.absentCount}),e.jsx("td",{className:"num",children:t.unprocessedCount}),e.jsx("td",{className:"actions",children:e.jsx(pe,{type:"button",onClick:()=>g(t),children:"상세보기"})})]},`${s.date}-${t.recordId??`${t.courseId??"course"}-${k}`}`))})]})}):e.jsx(N,{children:"등록된 수업이 없습니다."}):e.jsxs(xe,{children:[e.jsx(ue,{children:"출석 학생"}),b.length>0?e.jsx(fe,{children:b.map(t=>e.jsxs(he,{children:[e.jsxs(be,{children:[e.jsxs(ge,{children:[e.jsx("strong",{children:t.studentName}),e.jsx("span",{className:"course",children:t.courseTitle?t.courseId?e.jsx(ve,{type:"button",onClick:()=>y(t.courseId,t.recordId),children:t.courseTitle}):t.courseTitle:"-"})]}),e.jsxs(me,{children:[e.jsx(ye,{"data-type":t.status.toLowerCase(),children:H(t.status)}),e.jsx(je,{children:t.status==="UNPROCESSED"?"미처리":_(t.createdAt)}),t.status!=="UNPROCESSED"&&e.jsx(Ce,{"data-type":(t.source??"MANUAL").toUpperCase(),children:W(t.source)})]})]}),t.status==="UNPROCESSED"?e.jsxs(T,{children:[e.jsxs(E,{children:["미처리 인원 ",t.count??0,"명"]}),t.students&&t.students.length>0&&e.jsx(Se,{children:t.students.map((k,$)=>e.jsx(ze,{children:k},`${t.key}-student-${$}`))})]}):t.reason?e.jsx(T,{children:e.jsx(ke,{children:t.reason})}):t.status==="ABSENT"?e.jsx(T,{children:e.jsx(E,{children:"사유 없음"})}):null]},t.key))}):e.jsx(N,{children:"조건에 맞는 출석 기록이 없습니다."})]})]},s.date)})]})}const J=n.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  align-items: flex-end;
`,K=n.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  label {
    font-size: 13px;
    color: #4b5563;
  }
  input[type="date"] {
    height: 40px;
    padding: 0 12px;
    border-radius: 10px;
    border: 1px solid #e5e7eb;
    background: #fff;
    color: #111827;
    font-size: 14px;
  }
`,X=n.div`
  display: inline-flex;
  flex-wrap: wrap;
  gap: 2px;
`,z=n.button`
  ${v.outline};
  height: 36px;
  padding: 0 14px;
  font-size: 13px;
`,Z=n(R)`
  height: 40px;
  padding: 0 20px;
`,ee=n.div`
  margin-top: 12px;
  color: #b91c1c;
  font-size: 13px;
`,te=n.div`
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #fff;
  color: #4b5563;
  font-size: 14px;
`,ne=n.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  flex-wrap: wrap;
  margin: 0 0 6px;
`,se=n.div`
  display: inline-flex;
  align-items: center;
  gap: 2px;
`,w=n.button`
  ${v.outline};
  height: 36px;
  padding: 0 18px;
  font-size: 13px;
  &[data-active] {
    background: #111827;
    color: #ffffff;
    border-color: #111827;
  }
`,ae=n.div`
  display: inline-flex;
  flex-wrap: wrap;
  gap: 4px;
`,oe=n.button`
  ${v.outline};
  height: 32px;
  padding: 0 14px;
  font-size: 12px;
  &[data-active] {
    background: #1f2937;
    color: #fff;
    border-color: #1f2937;
  }
`,ie=n.div`
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
`,re=n.div`
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
  &[data-type="present"] {
    background: #dcfce7;
    color: #15803d;
    border-color: #bbf7d0;
  }
  &[data-type="absent"] {
    background: #fee2e2;
    color: #b91c1c;
    border-color: #fecaca;
  }
  &[data-type="unprocessed"] {
    background: #f3f4f6;
    color: #4b5563;
    border-color: #e5e7eb;
  }
`,de=n.div`
  overflow-x: auto;
`,le=n(P)`
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
    font-feature-settings: "tnum";
  }
  tbody td.actions {
    text-align: right;
    width: 120px;
  }
  tbody tr:hover td {
    background: #f9fafb;
  }
`,ce=n.div`
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
`,pe=n.button`
  ${v.subtle};
  height: 32px;
  padding: 0 14px;
  font-size: 13px;
`,N=n.div`
  padding: 12px;
  border-radius: 10px;
  background: #f9fafb;
  color: #6b7280;
  font-size: 13px;
`,xe=n.div`
  margin-top: 16px;
  display: grid;
  gap: 2px;
`,ue=n.h4`
  margin: 0;
  font-size: 15px;
  color: #111827;
  font-weight: 700;
`,fe=n.div`
  display: grid;
  gap: 4px;
`,he=n.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.06);
`,be=n.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
`,ge=n.div`
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
`,me=n.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
`,je=n.span`
  font-size: 12px;
  color: #6b7280;
`,T=n.div`
  font-size: 12px;
  color: #4b5563;
  border-top: 1px solid #f3f4f6;
  padding-top: 6px;
`,ye=n.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 56px;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 700;
  border: 1px solid transparent;
  &[data-type="present"] {
    background: #dcfce7;
    color: #15803d;
    border-color: #bbf7d0;
  }
  &[data-type="absent"] {
    background: #fee2e2;
    color: #b91c1c;
    border-color: #fecaca;
  }
  &[data-type="unprocessed"] {
    background: #fef3c7;
    color: #b45309;
    border-color: #fcd34d;
  }
`,Ce=n.span`
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 700;
  border: 1px solid #e5e7eb;
  color: #374151;
  background: #f9fafb;
  &[data-type="MOBILE"] {
    background: #dcfce7;
    color: #16a34a;
    border-color: #bbf7d0;
  }
`,ve=n.button`
  all: unset;
  cursor: pointer;
  color: #2563eb;
  font-weight: 600;
  &:hover {
    text-decoration: underline;
  }
`,ke=n.div`
  font-size: 12px;
  color: #374151;
  line-height: 1.5;
`,E=n.div`
  font-size: 12px;
  color: #9ca3af;
`,Se=n.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 6px;
`,ze=n.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 9999px;
  background: #f3f4f6;
  color: #374151;
  font-size: 12px;
  border: 1px solid #e5e7eb;
`,De=n(O)`
  gap: 16px;
`;function L(a){const o=a.getFullYear(),i=String(a.getMonth()+1).padStart(2,"0"),d=String(a.getDate()).padStart(2,"0");return`${o}-${i}-${d}`}function Te(a,o){const i=new Date(a);return i.setDate(i.getDate()+o),i}function we(){const a=l.useMemo(()=>L(new Date),[]),[o,i]=l.useState(a),[d,r]=l.useState(a),[p,x]=l.useState([]),[h,u]=l.useState(!1),[m,c]=l.useState(null);l.useEffect(()=>{let s=!1;async function f(){u(!0),c(null);try{const C=await Y({from:d,to:d});s||x(C.map(b=>({...b,attendances:b.attendances??[]})))}catch(C){if(!s){const b=C instanceof Error?C.message:"출결 정보를 불러오지 못했습니다.";c(b)}}finally{s||u(!1)}}return f(),()=>{s=!0}},[d]);const j=l.useCallback(s=>{i(s),c(null)},[]),y=l.useCallback(()=>o?(c(null),r(o),!0):(c("조회할 날짜를 선택해주세요."),!1),[o]),g=l.useCallback(s=>{const f=L(Te(new Date,s));return i(f),c(null),r(f),f},[]);return{formDate:o,rows:p,loading:h,error:m,setDate:j,submit:y,applyQuick:g}}function Ne(){const{formDate:a,rows:o,loading:i,error:d,setDate:r,submit:p,applyQuick:x}=we(),[h,u]=l.useState("daily"),[m,c]=l.useState("ALL"),j=s=>{s.preventDefault(),p()},y=s=>{x(s),h!=="daily"&&u("daily")},g=l.useMemo(()=>o.map(s=>({day:s,rows:q(s)})),[o]);return{formDate:a,onChangeDate:r,onSubmit:j,onQuickSelect:y,loading:i,error:d,viewMode:h,onChangeView:u,statusFilter:m,onChangeStatusFilter:c,dailyRows:g}}function Be(){const a=B(),o=Ne(),i=(r,p)=>{r&&p?a(`/classes/${r}/history/${p}`):r&&a(`/classes/${r}`)},d=r=>{i(r.courseId,r.recordId??null)};return e.jsx(G,{...o,onNavigateCalendar:()=>a("/calendar"),onOpenCourseRecord:i,onOpenRecord:d})}export{Be as default};
