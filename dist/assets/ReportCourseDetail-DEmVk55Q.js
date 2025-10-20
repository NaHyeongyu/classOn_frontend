import{a as O,u as T,h as V,r,j as t,y as f,x as _,d as s}from"./index-B92ulgNv.js";import{P as q,b as J,S as p}from"./UI-ktOMpaj3.js";import{g as K,h as Q}from"./courses-BqfN_zpR.js";import{b as U}from"./format-Do6vjlY3.js";import{r as M}from"./errors-C6OcbAl5.js";function de(){const{courseId:e}=O(),d=T(),v=V().state?.course??null,n=r.useMemo(()=>{if(!e)return null;const o=Number(e);return Number.isFinite(o)?o:null},[e]),[a,R]=r.useState(v),[w,S]=r.useState(!v),[z,k]=r.useState(null),[l,C]=r.useState([]),[E,P]=r.useState(!1),[m,L]=r.useState(null),h=r.useMemo(()=>{const o=new Date,i=o.toISOString().slice(0,10),g=new Date(o);return g.setMonth(g.getMonth()-1),{from:g.toISOString().slice(0,10),to:i}},[]),[c,u]=r.useState(h);r.useEffect(()=>{if(!n||a)return;let o=!0;return(async()=>{try{S(!0),k(null);const i=await K(n);if(!o)return;R(i)}catch(i){if(!o)return;k(M(i,"수업 정보를 불러오지 못했습니다."))}finally{o&&S(!1)}})(),()=>{o=!1}},[n,a]),r.useEffect(()=>{if(!n)return;let o=!0;return(async()=>{try{P(!0),L(null);const i=await Q(n);if(!o)return;C(i??[])}catch(i){if(!o)return;C([]),L(M(i,"수업에 등록된 학생 목록을 불러오지 못했습니다."))}finally{o&&P(!1)}})(),()=>{o=!1}},[n]),r.useEffect(()=>{u(h)},[n,h]);const H=a?.title??(w?"불러오는 중…":"수업 정보 없음"),G=r.useMemo(()=>a?.description&&a.description.trim()?a.description.trim():"최근 수업 흐름과 학생 반응을 요약해 리포트에서 바로 활용할 수 있도록 준비합니다.",[a]);return t.jsxs(q,{children:[t.jsxs(J,{children:[t.jsxs("div",{children:[t.jsx("h2",{children:H}),t.jsx("p",{children:"선택한 수업의 학생 구성과 리포트 기간을 설정하세요."})]}),t.jsxs(W,{children:[t.jsx(B,{type:"button",onClick:()=>d(f.report.courseList()),children:"수업 다시 선택"}),t.jsx(I,{type:"button",onClick:()=>d(_.report),children:"리포트 홈"})]})]}),z?t.jsx(N,{children:z}):null,t.jsxs(p,{"data-animated":"true",children:[t.jsxs(x,{children:[t.jsxs("div",{children:[t.jsx($,{children:"1. 학생 리스트"}),t.jsx(j,{children:"리포트에 포함될 수업 구성원입니다."})]}),t.jsx(X,{children:E?"불러오는 중…":`${l.length.toLocaleString()}명`})]}),m?t.jsx(N,{children:m}):null,!m&&!E&&l.length===0?t.jsx(b,{children:"현재 이 수업에 등록된 학생이 없습니다."}):null,l.length>0?t.jsx(Y,{children:t.jsx(Z,{children:l.map(o=>t.jsxs(ee,{children:[t.jsxs("div",{children:[t.jsx("strong",{children:o.name}),t.jsx("small",{children:o.phoneNumber?U(o.phoneNumber):"연락처 없음"})]}),o.status==="ON_LEAVE"?t.jsx(y,{"data-tone":"warning",children:"휴학"}):o.status==="PENDING"?t.jsx(y,{"data-tone":"pending",children:"대기"}):t.jsx(y,{"data-tone":"active",children:"수강중"})]},o.id))})}):null]}),t.jsxs(p,{"data-animated":"true",children:[t.jsx(x,{children:t.jsxs("div",{children:[t.jsx($,{children:"2. 기간 설정"}),t.jsx(j,{children:"리포트에 포함할 수업 기록 범위를 선택하세요."})]})}),t.jsxs(te,{children:[t.jsxs(A,{children:[t.jsx(D,{htmlFor:"course-range-from",children:"시작일"}),t.jsx(F,{id:"course-range-from",type:"date",value:c.from,max:c.to||void 0,onChange:o=>u({...c,from:o.currentTarget.value})})]}),t.jsxs(A,{children:[t.jsx(D,{htmlFor:"course-range-to",children:"종료일"}),t.jsx(F,{id:"course-range-to",type:"date",value:c.to,min:c.from||void 0,onChange:o=>u({...c,to:o.currentTarget.value})})]})]}),t.jsx(b,{children:"기간을 비워두면 전체 수업 기록을 기반으로 리포트를 생성합니다."})]}),t.jsxs(p,{"data-animated":"true",children:[t.jsx(x,{children:t.jsxs("div",{children:[t.jsx($,{children:"다음 단계"}),t.jsx(j,{children:"정식 리포트 생성 기능은 준비 중입니다."})]})}),t.jsx(b,{children:"데이터를 분석해 리포트를 자동으로 제안하는 기능을 개발 중입니다. 설정한 정보는 곧바로 활용될 수 있도록 저장됩니다."})]}),t.jsxs(oe,{children:[t.jsx(B,{type:"button",onClick:()=>d(f.report.courseList()),children:"이전"}),t.jsx(I,{type:"button",onClick:()=>{n&&d(f.report.courseReview(n),{state:{course:a,range:c,students:l,summary:G}})},disabled:!n||w,children:"다음"})]})]})}const W=s.div`
  display: inline-flex;
  gap: ${e=>e.theme.spacing.sm};
  flex-wrap: wrap;
  justify-content: flex-end;
`,I=s.button`
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
`,B=s.button`
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
`,x=s.div`
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
`,j=s.p`
  margin: ${e=>e.theme.spacing.xs} 0 0;
  font-size: ${e=>e.theme.font.size.sm};
  color: ${e=>e.theme.colors.textMuted};
`,X=s.span`
  font-size: ${e=>e.theme.font.size.sm};
  color: ${e=>e.theme.colors.textMuted};
`,b=s.p`
  margin: ${e=>e.theme.spacing.xs} 0 ${e=>e.theme.spacing.sm};
  font-size: ${e=>e.theme.font.size.sm};
  color: ${e=>e.theme.colors.textMuted};
`,N=s.p`
  margin: ${e=>e.theme.spacing.xs} 0 ${e=>e.theme.spacing.sm};
  font-size: ${e=>e.theme.font.size.sm};
  color: ${e=>e.theme.colors.danger};
`,Y=s.div`
  border: 1px solid ${e=>e.theme.colors.border};
  border-radius: ${e=>e.theme.radii.md};
  max-height: 300px;
  overflow: auto;
  background: ${e=>e.theme.colors.surface};
`,Z=s.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`,ee=s.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${e=>e.theme.spacing.md};
  padding: ${e=>e.theme.spacing.sm} ${e=>e.theme.spacing.md};
  font-size: ${e=>e.theme.font.size.sm};
  color: ${e=>e.theme.colors.text};
  &:nth-child(even) {
    background: ${e=>e.theme.colors.surfaceAlt};
  }
  div {
    display: grid;
    gap: 2px;
  }
  strong {
    font-weight: ${e=>e.theme.font.weight.semiBold};
  }
  small {
    font-size: ${e=>e.theme.font.size.xs};
    color: ${e=>e.theme.colors.textMuted};
  }
`,y=s.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 10px;
  border-radius: ${e=>e.theme.radii.sm};
  font-size: ${e=>e.theme.font.size.xs};
  font-weight: ${e=>e.theme.font.weight.semiBold};
  background: ${e=>e.theme.colors.surfaceAlt};
  &[data-tone='active'] {
    color: ${e=>e.theme.colors.success};
    background: ${e=>e.theme.colors.successSurface};
  }
  &[data-tone='warning'] {
    color: ${e=>e.theme.colors.warning};
    background: ${e=>e.theme.colors.warningSurface};
  }
  &[data-tone='pending'] {
    color: ${e=>e.theme.colors.info};
    background: ${e=>e.theme.colors.infoSurface};
  }
`,te=s.div`
  display: grid;
  gap: ${e=>e.theme.spacing.sm};
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
`,A=s.div`
  display: grid;
  gap: ${e=>e.theme.spacing.xs};
`,D=s.label`
  font-size: ${e=>e.theme.font.size.sm};
  color: ${e=>e.theme.colors.textMuted};
`,F=s.input`
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
`,oe=s.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: ${e=>e.theme.spacing.sm};
  margin-top: ${e=>e.theme.spacing.xl};
`;export{de as default};
