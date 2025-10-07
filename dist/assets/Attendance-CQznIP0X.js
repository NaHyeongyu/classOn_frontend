import{f as P,r as d,u as F,j as e,b as M,S as E,L as O,d as s,c as S,m as U,T as Q,P as V}from"./index-DuqOyKVg.js";import{E as H}from"./EmptyPlaceholder-BTOahZwW.js";async function K(t){const r=new URLSearchParams;t?.from&&r.set("from",t.from),t?.to&&r.set("to",t.to);const o=r.size?`?${r.toString()}`:"";return await P(`/api/attendance/daily${o}`)}function A(t){const r=t.getFullYear(),o=String(t.getMonth()+1).padStart(2,"0"),c=String(t.getDate()).padStart(2,"0");return`${r}-${o}-${c}`}function _(t,r){const o=new Date(t);return o.setDate(o.getDate()+r),o}function q(){const t=d.useMemo(()=>A(new Date),[]),[r,o]=d.useState(t),[c,i]=d.useState(t),[u,p]=d.useState([]),[m,x]=d.useState(!1),[C,f]=d.useState(null);d.useEffect(()=>{let l=!1;async function h(){x(!0),f(null);try{const b=await K({from:c,to:c});l||p(b.map(g=>({...g,attendances:g.attendances??[]})))}catch(b){if(!l){const g=b instanceof Error?b.message:"출결 정보를 불러오지 못했습니다.";f(g)}}finally{l||x(!1)}}return h(),()=>{l=!0}},[c]);const v=d.useCallback(l=>{o(l),f(null)},[]),j=d.useCallback(()=>r?(f(null),i(r),!0):(f("조회할 날짜를 선택해주세요."),!1),[r]),k=d.useCallback(l=>{const h=A(_(new Date,l));return o(h),f(null),i(h),h},[]);return{formDate:r,rows:u,loading:m,error:C,setDate:v,submit:j,applyQuick:k}}const J=[{value:"ALL",label:"전체"},{value:"PRESENT",label:"출석"},{value:"ABSENT",label:"결석"},{value:"UNPROCESSED",label:"미처리"}],W=new Intl.DateTimeFormat("ko-KR",{month:"numeric",day:"numeric",weekday:"short"});function R(t){if(!t)return"";const[r,o]=t.split(":");return`${r}:${o}`}function Y(t){try{const r=new Date(`${t}T00:00:00`);return W.format(r)}catch{return t}}function G(t,r){const o=R(t),c=R(r);return o&&c?`${o} ~ ${c}`:o?`${o} ~`:c?`~ ${c}`:"-"}function X(t){if(!t)return"-";try{const r=new Date(t);if(Number.isNaN(r.getTime()))return"-";const o=String(r.getHours()).padStart(2,"0"),c=String(r.getMinutes()).padStart(2,"0");return`${o}:${c}`}catch{return"-"}}function Z(t){switch(t){case"PRESENT":return"출석";case"ABSENT":return"결석";case"UNPROCESSED":default:return"미처리"}}function ee(t){return t==="MOBILE"?"모바일":t==="MANUAL"?"수동":"-"}function te(t){const r=[],o=(t.attendances??[]).slice().sort((i,u)=>!i.createdAt&&!u.createdAt?0:i.createdAt?u.createdAt?new Date(u.createdAt).getTime()-new Date(i.createdAt).getTime():-1:1).map((i,u)=>({key:`att-${t.date}-${i.recordId??"record"}-${i.studentId??"student"}-${u}`,studentName:i.studentName||"이름 없음",courseTitle:i.courseTitle,courseId:i.courseId??null,recordId:i.recordId??null,status:i.present?"PRESENT":"ABSENT",createdAt:i.createdAt??null,reason:i.reason??null,source:i.source??null}));r.push(...o);const c=t.classes.filter(i=>i.unprocessedCount>0).map((i,u)=>({key:`unprocessed-${t.date}-${i.recordId??"record"}-${u}`,studentName:`미처리 ${i.unprocessedCount}명`,courseTitle:i.courseTitle,courseId:i.courseId??null,recordId:i.recordId??null,status:"UNPROCESSED",createdAt:null,reason:null,source:null,count:i.unprocessedCount,students:(i.unprocessedStudents??[]).map(p=>p?.name||null).filter(p=>!!p).sort((p,m)=>p.localeCompare(m,"ko-KR"))}));return r.push(...c),r}function ne(t,r){switch(r){case"PRESENT":return t.filter(o=>o.status==="PRESENT");case"ABSENT":return t.filter(o=>o.status==="ABSENT");case"UNPROCESSED":return t.filter(o=>o.status==="UNPROCESSED");case"ALL":default:return t}}function Pe(){const t=F(),{formDate:r,rows:o,loading:c,error:i,setDate:u,submit:p,applyQuick:m}=q(),[x,C]=d.useState("daily"),[f,v]=d.useState("ALL");function j(a){C(a)}function k(a){a.preventDefault(),p()}function l(a){m(a),x!=="daily"&&j("daily")}function h(a,y){a&&y?t(`/classes/${a}/history/${y}`):a&&t(`/classes/${a}`)}function b(a){h(a.courseId,a.recordId??null)}const g=d.useMemo(()=>o.map(a=>({day:a,rows:te(a)})),[o]);return e.jsxs(ze,{children:[e.jsx(M,{children:e.jsxs("div",{children:[e.jsx("h2",{children:"출결 관리"}),e.jsx("p",{children:"날짜별로 출결 현황을 확인하고 수업 상세로 이동하세요."})]})}),e.jsxs(de,{children:[e.jsxs(le,{children:[e.jsx(z,{type:"button","data-active":x==="daily"||void 0,onClick:()=>j("daily"),children:"일자별 보기"}),e.jsx(z,{type:"button","data-active":x==="class"||void 0,onClick:()=>j("class"),children:"수업별 보기"})]}),x==="daily"&&e.jsx(ue,{children:J.map(a=>e.jsx(pe,{type:"button","data-active":f===a.value||void 0,onClick:()=>v(a.value),children:a.label},a.value))})]}),e.jsxs(E,{as:"form",onSubmit:k,children:[e.jsxs(se,{children:[e.jsxs(ae,{children:[e.jsx("label",{htmlFor:"attendance-date",children:"조회일"}),e.jsx("input",{id:"attendance-date",type:"date",value:r,onChange:a=>u(a.target.value)})]}),e.jsxs(re,{children:[e.jsx(N,{type:"button",onClick:()=>l(0),children:"오늘"}),e.jsx(N,{type:"button",onClick:()=>l(-1),children:"어제"}),e.jsx(N,{type:"button",onClick:()=>l(-2),children:"이틀 전"})]}),e.jsx(oe,{type:"submit",children:"조회"})]}),i&&e.jsx(ie,{children:i})]}),c&&e.jsxs(ce,{children:[e.jsx(O,{}),e.jsx("span",{children:"불러오는 중…"})]}),!c&&g.length===0&&e.jsx(E,{children:e.jsx(H,{title:"선택한 날짜에 출결 기록이 없습니다.",description:"수업 상세에서 출석을 체크하면 이곳에서 바로 확인할 수 있어요.",actionLabel:"수업 일정 보기",onAction:()=>t("/calendar"),actionVariant:"outline"})}),g.map(({day:a,rows:y})=>{const D=x==="daily"?ne(y,f):[];return e.jsxs(E,{children:[e.jsxs(xe,{children:[e.jsxs("div",{children:[e.jsx("strong",{children:Y(a.date)}),e.jsx("span",{children:a.classCount?`${a.classCount}개의 수업`:"수업 없음"})]}),e.jsxs(fe,{children:[e.jsxs(w,{"data-type":"present",children:["출석 ",a.presentCount]}),e.jsxs(w,{"data-type":"absent",children:["결석 ",a.absentCount]}),e.jsxs(w,{"data-type":"unprocessed",children:["미처리 ",a.unprocessedCount]})]})]}),x==="class"?a.classes.length>0?e.jsx(he,{children:e.jsxs(be,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"수업"}),e.jsx("th",{children:"시간"}),e.jsx("th",{className:"num",children:"출석"}),e.jsx("th",{className:"num",children:"결석"}),e.jsx("th",{className:"num",children:"미처리"}),e.jsx("th",{children:"상세"})]})}),e.jsx("tbody",{children:a.classes.map((n,T)=>e.jsxs("tr",{children:[e.jsx("td",{children:e.jsxs(ge,{children:[e.jsx("button",{type:"button",onClick:()=>b(n),children:n.courseTitle||"제목 없음"}),n.topic&&e.jsx("small",{children:n.topic})]})}),e.jsx("td",{children:G(n.startTime,n.endTime)}),e.jsx("td",{className:"num",children:n.presentCount}),e.jsx("td",{className:"num",children:n.absentCount}),e.jsx("td",{className:"num",children:n.unprocessedCount}),e.jsx("td",{className:"actions",children:e.jsx(me,{type:"button",onClick:()=>b(n),children:"상세보기"})})]},`${a.date}-${n.recordId??`${n.courseId??"course"}-${T}`}`))})]})}):e.jsx(L,{children:"등록된 수업이 없습니다."}):e.jsxs(je,{children:[e.jsx(ye,{children:"출석 학생"}),D.length>0?e.jsx(Se,{children:D.map(n=>e.jsxs(Ce,{children:[e.jsxs(ve,{children:[e.jsxs(ke,{children:[e.jsx("strong",{children:n.studentName}),e.jsx("span",{className:"course",children:n.courseTitle?n.courseId?e.jsx($e,{type:"button",onClick:()=>h(n.courseId,n.recordId),children:n.courseTitle}):n.courseTitle:"-"})]}),e.jsxs(Te,{children:[e.jsx(Ne,{"data-type":n.status.toLowerCase(),children:Z(n.status)}),e.jsx(Ee,{children:n.status==="UNPROCESSED"?"미처리":X(n.createdAt)}),n.status!=="UNPROCESSED"&&e.jsx(we,{"data-type":(n.source??"MANUAL").toUpperCase(),children:ee(n.source)})]})]}),n.status==="UNPROCESSED"?e.jsxs($,{children:[e.jsxs(B,{children:["미처리 인원 ",n.count??0,"명"]}),n.students&&n.students.length>0&&e.jsx(Ae,{children:n.students.map((T,I)=>e.jsx(Re,{children:T},`${n.key}-student-${I}`))})]}):n.reason?e.jsx($,{children:e.jsx(De,{children:n.reason})}):n.status==="ABSENT"?e.jsx($,{children:e.jsx(B,{children:"사유 없음"})}):null]},n.key))}):e.jsx(L,{children:"조건에 맞는 출석 기록이 없습니다."})]})]},a.date)})]})}const se=s.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  align-items: flex-end;
`,ae=s.div`
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
`,re=s.div`
  display: inline-flex;
  flex-wrap: wrap;
  gap: 2px;
`,N=s.button`
  ${S.outline};
  height: 36px;
  padding: 0 14px;
  font-size: 13px;
`,oe=s(U)`
  height: 40px;
  padding: 0 20px;
`,ie=s.div`
  margin-top: 12px;
  color: #b91c1c;
  font-size: 13px;
`,ce=s.div`
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #fff;
  color: #4b5563;
  font-size: 14px;
`,de=s.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  flex-wrap: wrap;
  margin: 0 0 6px;
`,le=s.div`
  display: inline-flex;
  align-items: center;
  gap: 2px;
`,z=s.button`
  ${S.subtle};
  height: 36px;
  padding: 0 18px;
  font-size: 13px;
  &[data-active] {
    background: #4f46e5;
    color: #fff;
    border-color: #4338ca;
  }
`,ue=s.div`
  display: inline-flex;
  flex-wrap: wrap;
  gap: 4px;
`,pe=s.button`
  ${S.outline};
  height: 32px;
  padding: 0 14px;
  font-size: 12px;
  &[data-active] {
    background: #1f2937;
    color: #fff;
    border-color: #1f2937;
  }
`,xe=s.div`
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
`,fe=s.div`
  display: inline-flex;
  gap: 4px;
`,w=s.span`
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
`,he=s.div`
  overflow-x: auto;
`,be=s(Q)`
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
`,ge=s.div`
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
`,me=s.button`
  ${S.subtle};
  height: 32px;
  padding: 0 14px;
  font-size: 13px;
`,L=s.div`
  padding: 12px;
  border-radius: 10px;
  background: #f9fafb;
  color: #6b7280;
  font-size: 13px;
`,je=s.div`
  margin-top: 16px;
  display: grid;
  gap: 2px;
`,ye=s.h4`
  margin: 0;
  font-size: 15px;
  color: #111827;
  font-weight: 700;
`,Se=s.div`
  display: grid;
  gap: 4px;
`,Ce=s.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.06);
`,ve=s.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
`,ke=s.div`
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
`,Te=s.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
`,Ee=s.span`
  font-size: 12px;
  color: #6b7280;
`,$=s.div`
  font-size: 12px;
  color: #4b5563;
  border-top: 1px solid #f3f4f6;
  padding-top: 6px;
`,Ne=s.span`
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
`,we=s.span`
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
`,$e=s.button`
  all: unset;
  cursor: pointer;
  color: #2563eb;
  font-weight: 600;
  &:hover {
    text-decoration: underline;
  }
`,De=s.div`
  font-size: 12px;
  color: #374151;
  line-height: 1.5;
`,B=s.div`
  font-size: 12px;
  color: #9ca3af;
`,Ae=s.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 6px;
`,Re=s.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 9999px;
  background: #f3f4f6;
  color: #374151;
  font-size: 12px;
  border: 1px solid #e5e7eb;
`,ze=s(V)`
  gap: 16px;
`;export{Pe as default};
