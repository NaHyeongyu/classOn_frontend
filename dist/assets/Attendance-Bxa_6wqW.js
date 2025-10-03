import{f as R,u as M,r as l,j as e,l as P,a as V,S as b,L as _,d as r,c as A,h as O,T as Q}from"./index-C5H-3XpS.js";import{E as U}from"./EmptyPlaceholder-DH9zVN9s.js";async function H(s){const o=new URLSearchParams;s?.from&&o.set("from",s.from),s?.to&&o.set("to",s.to);const i=o.size?`?${o.toString()}`:"";return await R(`/api/attendance/daily${i}`)}function h(s){return s.toISOString().slice(0,10)}function $(s,o){const i=new Date(s);return i.setDate(i.getDate()+o),i}const K=new Intl.DateTimeFormat("ko-KR",{month:"numeric",day:"numeric",weekday:"short"}),q=864e5,G=60,J=new Intl.DateTimeFormat("ko-KR",{hour:"2-digit",minute:"2-digit"});function W(s,o){if(!s||!o)return 0;const i=new Date(`${s}T00:00:00`).getTime(),c=new Date(`${o}T00:00:00`).getTime();if(Number.isNaN(i)||Number.isNaN(c))return 0;const a=Math.floor((c-i)/q);return a<0?0:a}function X(s){try{const o=new Date(`${s}T00:00:00`);return K.format(o)}catch{return s}}function T(s){if(!s)return"";const[o,i]=s.split(":");return`${o}:${i}`}function Y(s,o){const i=T(s),c=T(o);return i&&c?`${i} ~ ${c}`:i?`${i} ~`:c?`~ ${c}`:"-"}function Z(s){if(!s)return"-";try{return J.format(new Date(s))}catch{return"-"}}function ee(s){return s?"출석":"결석"}function te(s){return s==="MOBILE"?"모바일":s==="MANUAL"?"수동":"-"}function fe(){const s=M(),o=l.useMemo(()=>new Date,[]),i=l.useMemo(()=>h(o),[o]),c=l.useMemo(()=>h($(o,-13)),[o]),[a,f]=l.useState({from:c,to:i}),[p,y]=l.useState(a),[w,L]=l.useState([]),[v,N]=l.useState(!1),[k,x]=l.useState(null);l.useEffect(()=>{let n=!1;async function t(){N(!0),x(null);try{const d=await H({from:p.from,to:p.to});n||L(d.map(u=>({...u,attendances:u.attendances??[]})))}catch(d){if(!n){const u=d instanceof Error?d.message:"출결 정보를 불러오지 못했습니다.";x(u)}}finally{n||N(!1)}}return t(),()=>{n=!0}},[p.from,p.to]);function B(n){if(n.preventDefault(),a.from&&a.to&&a.from>a.to){x("시작일이 종료일보다 앞서야 합니다.");return}if(a.from&&a.to&&W(a.from,a.to)>G-1){x("최대 60일까지 조회할 수 있습니다.");return}x(null),y(a)}function m(n){const t=new Date,d=$(t,-(n-1)),u={from:h(d),to:h(t)};f(u),x(null),y(u)}function C(n){n.courseId&&n.recordId?s(`/classes/${n.courseId}/history/${n.recordId}`):n.courseId&&s(`/classes/${n.courseId}`)}return e.jsxs(P,{children:[e.jsx(V,{children:e.jsxs("div",{children:[e.jsx("h2",{children:"출결 관리"}),e.jsx("p",{children:"날짜별로 출결 현황을 확인하고 수업 상세로 이동하세요."})]})}),e.jsxs(b,{as:"form",onSubmit:B,children:[e.jsxs(ne,{children:[e.jsxs(S,{children:[e.jsx("label",{htmlFor:"attendance-from",children:"시작일"}),e.jsx("input",{id:"attendance-from",type:"date",value:a.from,max:a.to||void 0,onChange:n=>{const t=n.target.value;f(d=>({...d,from:t})),x(null)}})]}),e.jsxs(S,{children:[e.jsx("label",{htmlFor:"attendance-to",children:"종료일"}),e.jsx("input",{id:"attendance-to",type:"date",value:a.to,min:a.from||void 0,onChange:n=>{const t=n.target.value;f(d=>({...d,to:t})),x(null)}})]}),e.jsxs(se,{children:[e.jsx(g,{type:"button",onClick:()=>m(7),children:"최근 7일"}),e.jsx(g,{type:"button",onClick:()=>m(14),children:"최근 14일"}),e.jsx(g,{type:"button",onClick:()=>m(30),children:"최근 30일"})]}),e.jsx(oe,{type:"submit",children:"조회"})]}),k&&e.jsx(re,{children:k})]}),v&&e.jsxs(ie,{children:[e.jsx(_,{}),e.jsx("span",{children:"불러오는 중…"})]}),!v&&w.length===0&&e.jsx(b,{children:e.jsx(U,{title:"선택한 기간에 출결 기록이 없습니다.",description:"수업 상세에서 출석을 체크하면 이곳에서 누적 기록을 볼 수 있어요.",actionLabel:"수업 일정 보기",onAction:()=>s("/calendar"),actionVariant:"outline"})}),w.map(n=>e.jsxs(b,{children:[e.jsxs(ae,{children:[e.jsxs("div",{children:[e.jsx("strong",{children:X(n.date)}),e.jsx("span",{children:n.classCount?`${n.classCount}개의 수업`:"수업 없음"})]}),e.jsxs(de,{children:[e.jsxs(j,{"data-type":"present",children:["출석 ",n.presentCount]}),e.jsxs(j,{"data-type":"absent",children:["결석 ",n.absentCount]}),e.jsxs(j,{"data-type":"unprocessed",children:["미처리 ",n.unprocessedCount]})]})]}),n.classes.length>0?e.jsx(D,{children:e.jsxs(F,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"수업"}),e.jsx("th",{children:"코드"}),e.jsx("th",{children:"시간"}),e.jsx("th",{className:"num",children:"출석"}),e.jsx("th",{className:"num",children:"결석"}),e.jsx("th",{className:"num",children:"미처리"}),e.jsx("th",{children:"상세"})]})}),e.jsx("tbody",{children:n.classes.map((t,d)=>e.jsxs("tr",{children:[e.jsx("td",{children:e.jsxs(ce,{children:[e.jsx("button",{type:"button",onClick:()=>C(t),children:t.courseTitle||"제목 없음"}),t.topic&&e.jsx("small",{children:t.topic})]})}),e.jsx("td",{children:t.courseCode?e.jsx("code",{children:t.courseCode}):"-"}),e.jsx("td",{children:Y(t.startTime,t.endTime)}),e.jsx("td",{className:"num",children:t.presentCount}),e.jsx("td",{className:"num",children:t.absentCount}),e.jsx("td",{className:"num",children:t.unprocessedCount}),e.jsx("td",{className:"actions",children:e.jsx(le,{type:"button",onClick:()=>C(t),children:"상세보기"})})]},`${n.date}-${t.recordId??`${t.courseId??"course"}-${d}`}`))})]})}):e.jsx(I,{children:"등록된 수업이 없습니다."}),n.attendances.length>0?e.jsxs(z,{children:[e.jsx(E,{children:"출석 학생"}),e.jsx(D,{children:e.jsxs(xe,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"학생"}),e.jsx("th",{children:"수업"}),e.jsx("th",{className:"status",children:"상태"}),e.jsx("th",{className:"num",children:"입력시간"}),e.jsx("th",{children:"사유"}),e.jsx("th",{className:"source",children:"입력경로"})]})}),e.jsx("tbody",{children:n.attendances.map((t,d)=>e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("strong",{children:t.studentName||"이름 없음"})}),e.jsx("td",{children:t.courseTitle||"-"}),e.jsx("td",{className:"status",children:e.jsx(ue,{"data-type":t.present?"present":"absent",children:ee(t.present)})}),e.jsx("td",{className:"num",children:Z(t.createdAt)}),e.jsx("td",{children:t.reason?t.reason:"-"}),e.jsx("td",{className:"source",children:te(t.source)})]},`${n.date}-att-${t.recordId??"record"}-${t.studentId??"student"}-${d}`))})]})})]}):e.jsxs(z,{children:[e.jsx(E,{children:"출석 학생"}),e.jsx(I,{children:"출석 기록이 없습니다."})]})]},n.date))]})}const ne=r.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: flex-end;
`,S=r.div`
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
`,se=r.div`
  display: inline-flex;
  flex-wrap: wrap;
  gap: 8px;
`,g=r.button`
  ${A.outline};
  height: 36px;
  padding: 0 14px;
  font-size: 13px;
`,oe=r(O)`
  height: 40px;
  padding: 0 20px;
`,re=r.div`
  margin-top: 12px;
  color: #b91c1c;
  font-size: 13px;
`,ie=r.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #fff;
  color: #4b5563;
  font-size: 14px;
`,ae=r.div`
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
`,de=r.div`
  display: inline-flex;
  gap: 10px;
`,j=r.span`
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
`,D=r.div`
  overflow-x: auto;
`,F=r(Q)`
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
`,ce=r.div`
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
`,le=r.button`
  ${A.subtle};
  height: 32px;
  padding: 0 14px;
  font-size: 13px;
`,I=r.div`
  padding: 12px;
  border-radius: 10px;
  background: #f9fafb;
  color: #6b7280;
  font-size: 13px;
`,z=r.div`
  margin-top: 24px;
  display: grid;
  gap: 12px;
`,E=r.h4`
  margin: 0;
  font-size: 15px;
  color: #111827;
  font-weight: 700;
`,xe=r(F)`
  min-width: 700px;
  thead th.status,
  tbody td.status {
    text-align: center;
    width: 110px;
  }
  thead th.source,
  tbody td.source {
    text-align: center;
    width: 120px;
  }
  tbody td {
    vertical-align: middle;
  }
`,ue=r.span`
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
`;export{fe as default};
