import{j as e,d as n,f as C,r as t}from"./index-B0K7mn4q.js";import{f as T,G as W}from"./UI-Cj3YhchZ.js";function q({stats:r,busy:a,busyCourses:c,busySeed:o,msg:u,msgCourses:p,msgSeed:g,err:h,errCourses:j,errSeed:m,seedStudents:w,setSeedStudents:f,seedCourses:k,setSeedCourses:b,seedCounsels:$,setSeedCounsels:x,loadStats:D,onReset:v,onResetCourses:E,onSeed:S}){return e.jsxs(F,{children:[e.jsx(K,{children:e.jsx("h2",{children:"개발 도구"})}),e.jsxs(y,{children:[e.jsxs(B,{children:[e.jsxs("div",{children:[e.jsx("h3",{children:"데이터 생성"}),e.jsx("p",{children:"테스트용 더미 데이터를 생성합니다. 수업 내역(1주)도 함께 준비됩니다."})]}),e.jsxs(Q,{children:[e.jsxs("div",{children:[e.jsx(L,{children:"학생 수"}),e.jsx("input",{type:"number",min:0,value:w,onChange:i=>f(Number(i.target.value||0))})]}),e.jsxs("div",{children:[e.jsx(L,{children:"수업 수"}),e.jsx("input",{type:"number",min:0,value:k,onChange:i=>b(Number(i.target.value||0))})]}),e.jsxs("div",{children:[e.jsx(L,{children:"상담 수"}),e.jsx("input",{type:"number",min:0,value:$,onChange:i=>x(Number(i.target.value||0))})]}),e.jsx("div",{style:{gridColumn:"1 / -1",textAlign:"right"},children:e.jsx(T,{disabled:o,onClick:()=>{S()},children:o?"진행중…":"데이터 생성"})})]})]}),g&&e.jsx(O,{children:g}),m&&e.jsx(R,{children:m})]}),e.jsxs(y,{children:[e.jsxs(B,{children:[e.jsxs("div",{children:[e.jsx("h3",{children:"데이터 초기화"}),e.jsx("p",{children:"수업기록/출석/첨부/상담 데이터를 모두 삭제합니다. 학생/수업/등록은 유지됩니다."})]}),e.jsx("div",{children:e.jsx(T,{disabled:a,onClick:()=>{v()},children:a?"진행중…":"초기화 실행"})})]}),u&&e.jsx(O,{children:u}),h&&e.jsx(R,{children:h})]}),e.jsxs(y,{children:[e.jsxs(B,{children:[e.jsxs("div",{children:[e.jsx("h3",{children:"수업 초기화"}),e.jsx("p",{children:"수업과 수업 내역(출결/첨부)을 모두 삭제합니다. 학생/상담은 유지됩니다."})]}),e.jsx("div",{children:e.jsx(T,{disabled:c,onClick:()=>{E()},children:c?"진행중…":"수업 초기화 실행"})})]}),p&&e.jsx(O,{children:p}),j&&e.jsx(R,{children:j})]}),e.jsxs(y,{children:[e.jsx("h3",{children:"현재 통계"}),r?e.jsxs(Y,{children:[e.jsxs(G,{children:[e.jsx(M,{children:"학생 수"}),e.jsx(N,{children:r.students})]}),e.jsxs(G,{children:[e.jsx(M,{children:"수업 수"}),e.jsx(N,{children:r.courses})]}),e.jsxs(G,{children:[e.jsx(M,{children:"상담 수"}),e.jsx(N,{children:r.counsels})]})]}):e.jsx(X,{children:"불러오는 중…"}),e.jsx(W,{onClick:()=>{D()},style:{marginTop:8},children:"새로고침"})]}),e.jsx(Z,{children:"백엔드 설정(app.dev-endpoints=true)에서만 동작합니다."})]})}const F=n.div`
  display: grid;
  gap: 12px;
`,K=n.div`
  display: flex;
  align-items: center;
  gap: 8px;
  h2 {
    margin: 0;
    font-size: 20px;
  }
`,y=n.section`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 14px;
`,B=n.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`,Q=n.div`
  display: grid;
  grid-template-columns: repeat(3, 120px);
  gap: 8px;
  align-items: center;
  input {
    width: 100%;
    height: 36px;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    padding: 0 10px;
  }
  @media (max-width: 720px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`,O=n.div`
  margin-top: 8px;
  background: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
  padding: 8px 10px;
  border-radius: 8px;
  font-size: 13px;
`,R=n.div`
  margin-top: 8px;
  background: #fee2e2;
  color: #b91c1c;
  border: 1px solid #fecaca;
  padding: 8px 10px;
  border-radius: 8px;
  font-size: 13px;
`,X=n.div`
  color: #6b7280;
  font-size: 13px;
`,Y=n.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  @media (max-width: 600px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 420px) {
    grid-template-columns: 1fr;
  }
`,G=n.div`
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px;
  background: #fafafa;
  display: grid;
  gap: 6px;
`,M=n.div`
  color: #6b7280;
  font-size: 12px;
`,N=n.div`
  font-size: 18px;
  font-weight: 900;
  color: #0f172a;
`,Z=n.div`
  color: #6b7280;
  font-size: 12px;
`,L=n.div`
  color: #6b7280;
  font-size: 12px;
  margin-bottom: 4px;
`;async function _(r){const a=r?.students??100,c=r?.courses??10,o=r?.counsels??50,u=new URLSearchParams({students:String(a),courses:String(c),counsels:String(o)});return await C(`/api/dev/seed?${u}`,{method:"POST"})}function ee(){const[r,a]=t.useState(null),[c,o]=t.useState(!1),[u,p]=t.useState(!1),[g,h]=t.useState(!1),[j,m]=t.useState(null),[w,f]=t.useState(null),[k,b]=t.useState(null),[$,x]=t.useState(null),[D,v]=t.useState(null),[E,S]=t.useState(null),[i,H]=t.useState(50),[z,V]=t.useState(8),[P,A]=t.useState(40),l=t.useCallback(async()=>{try{const s=await C("/api/dev/stats");a(s),x(null)}catch(s){const d=s instanceof Error?s.message:"통계 조회 실패";x(d),a(null)}},[]);t.useEffect(()=>{l()},[l]);const I=t.useCallback(async()=>{o(!0),x(null),m(null);try{const s=await C("/api/dev/reset",{method:"POST"});m(`초기화 완료: records=${s.recordsDeleted??"-"}, attendance=${s.attendanceDeleted??"-"}, files=${s.filesDeleted??"-"}, counsels=${s.counselsDeleted??"-"}`),await l()}catch(s){const d=s instanceof Error?s.message:"초기화 실패";x(d)}finally{o(!1)}},[l]),J=t.useCallback(async()=>{p(!0),v(null),f(null);try{const s=await C("/api/dev/reset-courses",{method:"POST"});f(`수업 초기화 완료: courses=${s.coursesDeleted??"-"}, records=${s.recordsDeleted??"-"}, attendance=${s.attendanceDeleted??"-"}, files=${s.filesDeleted??"-"}, enrollmentsCleared=${s.enrollmentsCleared??"-"}`),await l()}catch(s){const d=s instanceof Error?s.message:"수업 초기화 실패";v(d)}finally{p(!1)}},[l]),U=t.useCallback(async()=>{h(!0),S(null),b(null);try{const d=await _({students:i,courses:z,counsels:P});b(`생성 완료: students=${d.studentsCreated??"-"}, courses=${d.coursesCreated??"-"}, counsels=${d.counselsCreated??"-"}`),await l()}catch(s){const d=s instanceof Error?s.message:"데이터 생성 실패";S(d)}finally{h(!1)}},[l,P,z,i]);return{stats:r,busy:c,busyCourses:u,busySeed:g,msg:j,msgCourses:w,msgSeed:k,err:$,errCourses:D,errSeed:E,seedStudents:i,setSeedStudents:H,seedCourses:z,setSeedCourses:V,seedCounsels:P,setSeedCounsels:A,loadStats:l,onReset:I,onResetCourses:J,onSeed:U}}function ne(){const r=ee();return e.jsx(q,{...r})}export{ne as default};
