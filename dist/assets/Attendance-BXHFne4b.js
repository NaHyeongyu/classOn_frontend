import{f as Q,u as K,r as u,j as e,l as q,a as J,S as v,L as W,d as s,c as g,h as G,T as X}from"./index-Dutj9l30.js";import{E as Y}from"./EmptyPlaceholder-DDO4CkSR.js";async function Z(r){const o=new URLSearchParams;r?.from&&o.set("from",r.from),r?.to&&o.set("to",r.to);const i=o.size?`?${o.toString()}`:"";return await Q(`/api/attendance/daily${i}`)}function D(r){return r.toISOString().slice(0,10)}function _(r,o){const i=new Date(r);return i.setDate(i.getDate()+o),i}const ee=new Intl.DateTimeFormat("ko-KR",{month:"numeric",day:"numeric",weekday:"short"}),te=[{value:"PRESENT",label:"출석"},{value:"ABSENT",label:"결석"},{value:"UNPROCESSED",label:"미처리"},{value:"ALL",label:"전체"}];function ne(r){try{const o=new Date(`${r}T00:00:00`);return ee.format(o)}catch{return r}}function B(r){if(!r)return"";const[o,i]=r.split(":");return`${o}:${i}`}function se(r,o){const i=B(r),c=B(o);return i&&c?`${i} ~ ${c}`:i?`${i} ~`:c?`~ ${c}`:"-"}function re(r){if(!r)return"-";try{const o=new Date(r);if(Number.isNaN(o.getTime()))return"-";const i=String(o.getHours()).padStart(2,"0"),c=String(o.getMinutes()).padStart(2,"0");return`${i}:${c}`}catch{return"-"}}function ae(r){switch(r){case"PRESENT":return"출석";case"ABSENT":return"결석";case"UNPROCESSED":default:return"미처리"}}function oe(r){return r==="MOBILE"?"모바일":r==="MANUAL"?"수동":"-"}function Me(){const r=K(),o=u.useMemo(()=>new Date,[]),i=u.useMemo(()=>D(o),[o]),[c,T]=u.useState({date:i}),[m,k]=u.useState(c),[$,M]=u.useState([]),[w,A]=u.useState(!1),[R,f]=u.useState(null),[x,O]=u.useState("daily"),[b,j]=u.useState("PRESENT");function y(n){O(n),n==="daily"&&b==="ALL"&&j("PRESENT"),n==="class"&&b!=="ALL"&&j("ALL")}u.useEffect(()=>{let n=!1;async function d(){A(!0),f(null);try{const l=await Z({from:m.date,to:m.date});n||M(l.map(t=>({...t,attendances:t.attendances??[]})))}catch(l){if(!n){const t=l instanceof Error?l.message:"출결 정보를 불러오지 못했습니다.";f(t)}}finally{n||A(!1)}}return d(),()=>{n=!0}},[m.date]);function U(n){if(n.preventDefault(),!c.date){f("조회할 날짜를 선택해주세요.");return}f(null),k({date:c.date})}function z(n,d){n&&d?r(`/classes/${n}/history/${d}`):n&&r(`/classes/${n}`)}function V(n){const d=[],l=(n.attendances??[]).slice().sort((a,p)=>!a.createdAt&&!p.createdAt?0:a.createdAt?p.createdAt?new Date(p.createdAt).getTime()-new Date(a.createdAt).getTime():-1:1).map((a,p)=>({key:`att-${n.date}-${a.recordId??"record"}-${a.studentId??"student"}-${p}`,studentName:a.studentName||"이름 없음",courseTitle:a.courseTitle,courseId:a.courseId??null,recordId:a.recordId??null,status:a.present?"PRESENT":"ABSENT",createdAt:a.createdAt??null,reason:a.reason??null,source:a.source??null}));d.push(...l);const t=n.classes.filter(a=>a.unprocessedCount>0).map((a,p)=>({key:`unprocessed-${n.date}-${a.recordId??"record"}-${p}`,studentName:`미처리 ${a.unprocessedCount}명`,courseTitle:a.courseTitle,courseId:a.courseId??null,recordId:a.recordId??null,status:"UNPROCESSED",createdAt:null,reason:null,source:null,count:a.unprocessedCount,students:(a.unprocessedStudents??[]).map(h=>h?.name||null).filter(h=>!!h).sort((h,H)=>h.localeCompare(H,"ko-KR"))}));return d.push(...t),d}function S(n){const l=_(new Date,n),t=D(l);T({date:t}),f(null),k({date:t}),x!=="daily"&&y("daily")}function L(n){z(n.courseId,n.recordId??null)}return e.jsxs(q,{children:[e.jsx(J,{children:e.jsxs("div",{children:[e.jsx("h2",{children:"출결 관리"}),e.jsx("p",{children:"날짜별로 출결 현황을 확인하고 수업 상세로 이동하세요."})]})}),e.jsxs(xe,{children:[e.jsxs(fe,{children:[e.jsx(I,{type:"button","data-active":x==="daily"||void 0,onClick:()=>y("daily"),children:"일자별 보기"}),e.jsx(I,{type:"button","data-active":x==="class"||void 0,onClick:()=>y("class"),children:"수업별 보기"})]}),x==="daily"&&e.jsx(he,{children:te.map(n=>e.jsx(be,{type:"button","data-active":b===n.value||void 0,onClick:()=>j(n.value),children:n.label},n.value))})]}),e.jsxs(v,{as:"form",onSubmit:U,children:[e.jsxs(ie,{children:[e.jsxs(de,{children:[e.jsx("label",{htmlFor:"attendance-date",children:"조회일"}),e.jsx("input",{id:"attendance-date",type:"date",value:c.date,onChange:n=>{const d=n.target.value;T({date:d}),f(null)}})]}),e.jsxs(ce,{children:[e.jsx(C,{type:"button",onClick:()=>S(0),children:"오늘"}),e.jsx(C,{type:"button",onClick:()=>S(-1),children:"어제"}),e.jsx(C,{type:"button",onClick:()=>S(-2),children:"이틀 전"})]}),e.jsx(le,{type:"submit",children:"조회"})]}),R&&e.jsx(ue,{children:R})]}),w&&e.jsxs(pe,{children:[e.jsx(W,{}),e.jsx("span",{children:"불러오는 중…"})]}),!w&&$.length===0&&e.jsx(v,{children:e.jsx(Y,{title:"선택한 날짜에 출결 기록이 없습니다.",description:"수업 상세에서 출석을 체크하면 이곳에서 바로 확인할 수 있어요.",actionLabel:"수업 일정 보기",onAction:()=>r("/calendar"),actionVariant:"outline"})}),$.map(n=>{const d=x==="daily"?V(n):[],l=x==="daily"?d.filter(t=>{switch(b){case"PRESENT":return t.status==="PRESENT";case"ABSENT":return t.status==="ABSENT";case"UNPROCESSED":return t.status==="UNPROCESSED";case"ALL":default:return!0}}):[];return e.jsxs(v,{children:[e.jsxs(ge,{children:[e.jsxs("div",{children:[e.jsx("strong",{children:ne(n.date)}),e.jsx("span",{children:n.classCount?`${n.classCount}개의 수업`:"수업 없음"})]}),e.jsxs(me,{children:[e.jsxs(E,{"data-type":"present",children:["출석 ",n.presentCount]}),e.jsxs(E,{"data-type":"absent",children:["결석 ",n.absentCount]}),e.jsxs(E,{"data-type":"unprocessed",children:["미처리 ",n.unprocessedCount]})]})]}),x==="class"?n.classes.length>0?e.jsx(je,{children:e.jsxs(ye,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"수업"}),e.jsx("th",{children:"코드"}),e.jsx("th",{children:"시간"}),e.jsx("th",{className:"num",children:"출석"}),e.jsx("th",{className:"num",children:"결석"}),e.jsx("th",{className:"num",children:"미처리"}),e.jsx("th",{children:"상세"})]})}),e.jsx("tbody",{children:n.classes.map((t,a)=>e.jsxs("tr",{children:[e.jsx("td",{children:e.jsxs(Se,{children:[e.jsx("button",{type:"button",onClick:()=>L(t),children:t.courseTitle||"제목 없음"}),t.topic&&e.jsx("small",{children:t.topic})]})}),e.jsx("td",{children:t.courseCode?e.jsx("code",{children:t.courseCode}):"-"}),e.jsx("td",{children:se(t.startTime,t.endTime)}),e.jsx("td",{className:"num",children:t.presentCount}),e.jsx("td",{className:"num",children:t.absentCount}),e.jsx("td",{className:"num",children:t.unprocessedCount}),e.jsx("td",{className:"actions",children:e.jsx(ve,{type:"button",onClick:()=>L(t),children:"상세보기"})})]},`${n.date}-${t.recordId??`${t.courseId??"course"}-${a}`}`))})]})}):e.jsx(P,{children:"등록된 수업이 없습니다."}):e.jsxs(Ce,{children:[e.jsx(Ee,{children:"출석 학생"}),l.length>0?e.jsx(Ne,{children:l.map(t=>e.jsxs(Te,{children:[e.jsxs(ke,{children:[e.jsxs($e,{children:[e.jsx("strong",{children:t.studentName}),e.jsx("span",{className:"course",children:t.courseTitle?t.courseId?e.jsx(Le,{type:"button",onClick:()=>z(t.courseId,t.recordId),children:t.courseTitle}):t.courseTitle:"-"})]}),e.jsxs(we,{children:[e.jsx(Re,{"data-type":t.status.toLowerCase(),children:ae(t.status)}),e.jsx(Ae,{children:t.status==="UNPROCESSED"?"미처리":re(t.createdAt)}),t.status!=="UNPROCESSED"&&e.jsx(ze,{"data-type":(t.source??"MANUAL").toUpperCase(),children:oe(t.source)})]})]}),t.status==="UNPROCESSED"?e.jsxs(N,{children:[e.jsxs(F,{children:["미처리 인원 ",t.count??0,"명"]}),t.students&&t.students.length>0&&e.jsx(Be,{children:t.students.map((a,p)=>e.jsx(Ie,{children:a},`${t.key}-student-${p}`))})]}):t.reason?e.jsx(N,{children:e.jsx(De,{children:t.reason})}):t.status==="ABSENT"?e.jsx(N,{children:e.jsx(F,{children:"사유 없음"})}):null]},t.key))}):e.jsx(P,{children:"조건에 맞는 출석 기록이 없습니다."})]})]},n.date)})]})}const ie=s.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: flex-end;
`,de=s.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
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
`,ce=s.div`
  display: inline-flex;
  flex-wrap: wrap;
  gap: 8px;
`,C=s.button`
  ${g.outline};
  height: 36px;
  padding: 0 14px;
  font-size: 13px;
`,le=s(G)`
  height: 40px;
  padding: 0 20px;
`,ue=s.div`
  margin-top: 12px;
  color: #b91c1c;
  font-size: 13px;
`,pe=s.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #fff;
  color: #4b5563;
  font-size: 14px;
`,xe=s.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin: 24px 0 12px;
`,fe=s.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`,I=s.button`
  ${g.subtle};
  height: 36px;
  padding: 0 18px;
  font-size: 13px;
  &[data-active] {
    background: #4f46e5;
    color: #fff;
    border-color: #4338ca;
  }
`,he=s.div`
  display: inline-flex;
  flex-wrap: wrap;
  gap: 8px;
`,be=s.button`
  ${g.outline};
  height: 32px;
  padding: 0 14px;
  font-size: 12px;
  &[data-active] {
    background: #1f2937;
    color: #fff;
    border-color: #1f2937;
  }
`,ge=s.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
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
`,me=s.div`
  display: inline-flex;
  gap: 10px;
`,E=s.span`
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
`,je=s.div`
  overflow-x: auto;
`,ye=s(X)`
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
`,Se=s.div`
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
`,ve=s.button`
  ${g.subtle};
  height: 32px;
  padding: 0 14px;
  font-size: 13px;
`,P=s.div`
  padding: 12px;
  border-radius: 10px;
  background: #f9fafb;
  color: #6b7280;
  font-size: 13px;
`,Ce=s.div`
  margin-top: 24px;
  display: grid;
  gap: 12px;
`,Ee=s.h4`
  margin: 0;
  font-size: 15px;
  color: #111827;
  font-weight: 700;
`,Ne=s.div`
  display: grid;
  gap: 8px;
`,Te=s.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.06);
`,ke=s.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`,$e=s.div`
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
`,we=s.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`,Ae=s.span`
  font-size: 12px;
  color: #6b7280;
`,N=s.div`
  font-size: 12px;
  color: #4b5563;
  border-top: 1px solid #f3f4f6;
  padding-top: 6px;
`,Re=s.span`
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
`,ze=s.span`
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
`,Le=s.button`
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
`,F=s.div`
  font-size: 12px;
  color: #9ca3af;
`,Be=s.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 6px;
`,Ie=s.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 9999px;
  background: #f3f4f6;
  color: #374151;
  font-size: 12px;
  border: 1px solid #e5e7eb;
`;export{Me as default};
