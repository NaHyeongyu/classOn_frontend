import{a as R,u as F,r as o,j as t,y as p,x as H,d as s}from"./index-B92ulgNv.js";import{P as N,b as A,S as f}from"./UI-ktOMpaj3.js";import{g as B}from"./students-_bU7U7Hq.js";import{r as O}from"./errors-C6OcbAl5.js";import{b as T,a as G}from"./format-Do6vjlY3.js";function te(){const{studentId:e}=R(),h=F(),i=o.useMemo(()=>{if(!e)return null;const n=Number(e);return Number.isFinite(n)?n:null},[e]),[r,M]=o.useState(null),[v,z]=o.useState(!0),[w,S]=o.useState(null),u=o.useMemo(()=>{const n=new Date,d=n.toISOString().slice(0,10),g=new Date(n);return g.setMonth(g.getMonth()-1),{from:g.toISOString().slice(0,10),to:d}},[]),[a,x]=o.useState(u);o.useEffect(()=>{if(!i)return;let n=!0;return(async()=>{try{z(!0),S(null);const d=await B(i);if(!n)return;M(d)}catch(d){if(!n)return;S(O(d,"학생 정보를 불러오지 못했습니다."))}finally{n&&z(!1)}})(),()=>{n=!1}},[i]),o.useEffect(()=>{x(u)},[i,u]);const L=r?`${r.name} 학생 리포트`:v?"불러오는 중…":"학생 정보를 찾을 수 없습니다.",C=o.useMemo(()=>r?`${r.name} 학생의 최근 학습 상황을 요약해 학부모에게 전달할 수 있도록 정리합니다.`:"학생별 학습 결과 요약이 여기에 표시됩니다.",[r]);return t.jsxs(N,{children:[t.jsxs(A,{children:[t.jsxs("div",{children:[t.jsx("h2",{children:L}),t.jsx("p",{children:"선택한 학생의 리포트 기간과 미리보기를 준비합니다."})]}),t.jsxs(K,{children:[t.jsx(I,{type:"button",onClick:()=>h(p.report.studentList()),children:"학생 다시 선택"}),t.jsx(E,{type:"button",onClick:()=>h(H.report),children:"리포트 홈"})]})]}),w?t.jsx(_,{children:w}):null,t.jsxs(f,{"data-animated":"true",children:[t.jsx(j,{children:t.jsxs("div",{children:[t.jsx($,{children:"학생 정보"}),t.jsx(b,{children:"리포트에 포함될 기본 프로필입니다."})]})}),r?t.jsxs(J,{children:[t.jsxs(c,{children:[t.jsx(l,{children:"이름"}),t.jsx(m,{children:r.name})]}),t.jsxs(c,{children:[t.jsx(l,{children:"연락처"}),t.jsx(m,{children:T(r.phoneNumber)})]}),t.jsxs(c,{children:[t.jsx(l,{children:"등록일"}),t.jsx(m,{children:r.joinedDate?G(r.joinedDate):"-"})]}),t.jsxs(c,{children:[t.jsx(l,{children:"현재 상태"}),t.jsx(m,{children:V(r.status)})]}),t.jsxs(c,{children:[t.jsx(l,{children:"수강 중인 수업"}),t.jsx(m,{children:r.courses&&r.courses.length?r.courses.map(n=>n.title).join(", "):"등록된 수업이 없습니다."})]})]}):t.jsx(y,{children:"학생 정보를 불러오고 있습니다."})]}),t.jsxs(f,{"data-animated":"true",children:[t.jsx(j,{children:t.jsxs("div",{children:[t.jsx($,{children:"기간 설정"}),t.jsx(b,{children:"리포트에 포함할 상담/수업/시험 기록 범위를 선택하세요."})]})}),t.jsxs(Q,{children:[t.jsxs(P,{children:[t.jsx(k,{htmlFor:"student-range-from",children:"시작일"}),t.jsx(D,{id:"student-range-from",type:"date",value:a.from,max:a.to||void 0,onChange:n=>x({...a,from:n.currentTarget.value})})]}),t.jsxs(P,{children:[t.jsx(k,{htmlFor:"student-range-to",children:"종료일"}),t.jsx(D,{id:"student-range-to",type:"date",value:a.to,min:a.from||void 0,onChange:n=>x({...a,to:n.currentTarget.value})})]})]}),t.jsx(y,{children:"기간을 비워두면 전체 기록을 기준으로 리포트를 준비합니다."})]}),t.jsxs(f,{"data-animated":"true",children:[t.jsx(j,{children:t.jsxs("div",{children:[t.jsx($,{children:"다음 단계"}),t.jsx(b,{children:"리포트 자동 생성 기능은 준비 중입니다."})]})}),t.jsx(y,{children:"학생 상담 노트와 수업 기록, 시험 결과를 기반으로 한 리포트 자동화 기능을 개발하고 있습니다. 설정한 기간과 정보는 향후 업데이트에서 바로 활용됩니다."})]}),t.jsxs(q,{children:[t.jsx(I,{type:"button",onClick:()=>h(p.report.studentList()),children:"이전"}),t.jsx(E,{type:"button",onClick:()=>{i&&h(p.report.studentReview(i),{state:{student:r,range:a,summary:C}})},disabled:!i||v,children:"다음"})]})]})}function V(e){return e==="ENROLLED"?"수강중":e==="ON_LEAVE"?"휴학":"대기"}const K=s.div`
  display: inline-flex;
  gap: ${e=>e.theme.spacing.sm};
  flex-wrap: wrap;
  justify-content: flex-end;
`,I=s.button`
  height: 40px;
  padding: 0 ${e=>e.theme.spacing.md};
  border-radius: ${e=>e.theme.radii.md};
  border: 1px solid ${e=>e.theme.colors.border};
  background: ${e=>e.theme.colors.surface};
  font-size: ${e=>e.theme.font.size.sm};
  font-weight: ${e=>e.theme.font.weight.semiBold};
  cursor: pointer;
  &:hover:not(:disabled) {
    border-color: ${e=>e.theme.colors.borderStrong};
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`,E=s.button`
  height: 40px;
  padding: 0 ${e=>e.theme.spacing.lg};
  border-radius: ${e=>e.theme.radii.md};
  border: 1px solid transparent;
  background: ${e=>e.theme.colors.primary};
  color: ${e=>e.theme.colors.textInverted};
  font-size: ${e=>e.theme.font.size.sm};
  font-weight: ${e=>e.theme.font.weight.semiBold};
  cursor: pointer;
  &:hover:not(:disabled) {
    background: ${e=>e.theme.colors.primaryHover};
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`,j=s.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${e=>e.theme.spacing.md};
  margin-bottom: ${e=>e.theme.spacing.md};
`,$=s.h3`
  margin: 0;
  font-size: ${e=>e.theme.font.size.xl};
  font-weight: ${e=>e.theme.font.weight.bold};
  color: ${e=>e.theme.colors.text};
`,b=s.p`
  margin: ${e=>e.theme.spacing.xs} 0 0;
  font-size: ${e=>e.theme.font.size.sm};
  color: ${e=>e.theme.colors.textMuted};
`,y=s.p`
  margin: ${e=>e.theme.spacing.xs} 0 ${e=>e.theme.spacing.sm};
  font-size: ${e=>e.theme.font.size.sm};
  color: ${e=>e.theme.colors.textMuted};
`,_=s.p`
  margin: ${e=>e.theme.spacing.xs} 0 ${e=>e.theme.spacing.sm};
  font-size: ${e=>e.theme.font.size.sm};
  color: ${e=>e.theme.colors.danger};
`,q=s.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: ${e=>e.theme.spacing.sm};
  margin-top: ${e=>e.theme.spacing.xl};
`,J=s.div`
  display: grid;
  gap: ${e=>e.theme.spacing.sm};
`,c=s.div`
  display: grid;
  gap: ${e=>e.theme.spacing.xs};
  padding: ${e=>e.theme.spacing.sm};
  border-radius: ${e=>e.theme.radii.md};
  background: ${e=>e.theme.colors.surfaceAlt};
`,l=s.span`
  font-size: ${e=>e.theme.font.size.xs};
  color: ${e=>e.theme.colors.textMuted};
  letter-spacing: 0.02em;
`,m=s.span`
  font-size: ${e=>e.theme.font.size.sm};
  color: ${e=>e.theme.colors.text};
  line-height: ${e=>e.theme.font.lineHeight.relaxed};
`,Q=s.div`
  display: grid;
  gap: ${e=>e.theme.spacing.sm};
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
`,P=s.div`
  display: grid;
  gap: ${e=>e.theme.spacing.xs};
`,k=s.label`
  font-size: ${e=>e.theme.font.size.sm};
  color: ${e=>e.theme.colors.textMuted};
`,D=s.input`
  height: 40px;
  border: 1px solid ${e=>e.theme.colors.borderStrong};
  border-radius: ${e=>e.theme.radii.md};
  padding: 0 ${e=>e.theme.spacing.sm};
  font-size: ${e=>e.theme.font.size.md};
  color: ${e=>e.theme.colors.text};
  transition:
    border-color ${e=>e.theme.motion.duration.base} ${e=>e.theme.motion.easing.standard},
    box-shadow ${e=>e.theme.motion.duration.base} ${e=>e.theme.motion.easing.standard};
  &:focus {
    outline: none;
    border-color: ${e=>e.theme.colors.primary};
    box-shadow: ${e=>e.theme.shadow.focusPrimary};
  }
`;export{te as default};
