import{u as b,r,j as t,x as j,y as z,d as s}from"./index-B92ulgNv.js";import{P as S,b as w,S as y}from"./UI-ktOMpaj3.js";import{l as v}from"./students-_bU7U7Hq.js";import{r as E}from"./errors-C6OcbAl5.js";import{b as P}from"./format-Do6vjlY3.js";function J(){const e=b(),[a,p]=r.useState(""),[d,l]=r.useState([]),[c,h]=r.useState(0),[m,u]=r.useState(!1),[n,g]=r.useState(null);r.useEffect(()=>{let o=!0;u(!0),g(null);const x=window.setTimeout(()=>{(async()=>{try{const i=await v({q:a.trim()||void 0,status:"ENROLLED",size:40});if(!o)return;l(i.content??[]),h(i.totalElements??0)}catch(i){if(!o)return;l([]),h(0),g(E(i,"학생 목록을 불러오지 못했습니다."))}finally{o&&u(!1)}})()},250);return()=>{o=!1,window.clearTimeout(x)}},[a]);const $=r.useMemo(()=>m?"학생 목록을 불러오는 중입니다…":n||`총 ${c.toLocaleString()}명`,[m,n,c]);function f(o){e(z.report.studentDetail(o.id))}return t.jsxs(S,{children:[t.jsxs(w,{children:[t.jsxs("div",{children:[t.jsx("h2",{children:"학생 리포트"}),t.jsx("p",{children:"리포트를 만들 학생을 선택하세요."})]}),t.jsx(M,{children:t.jsx(L,{type:"button",onClick:()=>e(j.report),children:"리포트 홈으로"})})]}),t.jsxs(y,{"data-animated":"true",children:[t.jsxs(T,{children:[t.jsxs("div",{children:[t.jsx(k,{children:"학생 선택"}),t.jsx(B,{children:"학생별 상세 리포트는 다음 단계에서 설정합니다."})]}),t.jsx(C,{children:$})]}),t.jsx(H,{children:t.jsx(N,{id:"student-search",placeholder:"학생 이름 또는 연락처로 검색하세요","aria-label":"학생 검색",value:a,onChange:o=>p(o.currentTarget.value)})}),n?t.jsx(R,{children:n}):null,!m&&!n&&d.length===0?t.jsx(I,{children:"조건에 맞는 학생이 없습니다."}):null,t.jsx(q,{children:d.map(o=>t.jsxs(D,{type:"button",onClick:()=>f(o),children:[t.jsx("strong",{children:o.name}),t.jsx("span",{children:o.phoneNumber?P(o.phoneNumber):"연락처 없음"}),o.courses&&o.courses.length?t.jsx(A,{children:`${o.courses.length}개 수업 수강 중`}):null]},o.id))})]})]})}const M=s.div`
  display: inline-flex;
  gap: ${e=>e.theme.spacing.sm};
  align-items: center;
`,L=s.button`
  height: 40px;
  padding: 0 ${e=>e.theme.spacing.md};
  border-radius: ${e=>e.theme.radii.md};
  border: 1px solid ${e=>e.theme.colors.border};
  background: ${e=>e.theme.colors.surface};
  font-size: ${e=>e.theme.font.size.sm};
  font-weight: ${e=>e.theme.font.weight.semiBold};
  cursor: pointer;
  &:hover {
    border-color: ${e=>e.theme.colors.borderStrong};
  }
`,T=s.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${e=>e.theme.spacing.md};
  margin-bottom: ${e=>e.theme.spacing.md};
`,k=s.h3`
  margin: 0;
  font-size: ${e=>e.theme.font.size.xl};
  font-weight: ${e=>e.theme.font.weight.bold};
  color: ${e=>e.theme.colors.text};
`,B=s.p`
  margin: ${e=>e.theme.spacing.xs} 0 0;
  font-size: ${e=>e.theme.font.size.sm};
  color: ${e=>e.theme.colors.textMuted};
`,C=s.span`
  font-size: ${e=>e.theme.font.size.sm};
  color: ${e=>e.theme.colors.textMuted};
`,H=s.div`
  margin-bottom: ${e=>e.theme.spacing.sm};
`,N=s.input`
  width: 100%;
  height: 40px;
  border-radius: ${e=>e.theme.radii.md};
  border: 1px solid ${e=>e.theme.colors.borderStrong};
  padding: 0 ${e=>e.theme.spacing.sm};
  font-size: ${e=>e.theme.font.size.md};
  transition:
    border-color ${e=>e.theme.motion.duration.base} ${e=>e.theme.motion.easing.standard},
    box-shadow ${e=>e.theme.motion.duration.base} ${e=>e.theme.motion.easing.standard};
  &:focus {
    outline: none;
    border-color: ${e=>e.theme.colors.primary};
    box-shadow: ${e=>e.theme.shadow.focusPrimary};
  }
`,I=s.p`
  margin: ${e=>e.theme.spacing.xs} 0 ${e=>e.theme.spacing.sm};
  font-size: ${e=>e.theme.font.size.sm};
  color: ${e=>e.theme.colors.textMuted};
`,R=s.p`
  margin: ${e=>e.theme.spacing.xs} 0 ${e=>e.theme.spacing.sm};
  font-size: ${e=>e.theme.font.size.sm};
  color: ${e=>e.theme.colors.danger};
`,q=s.div`
  display: grid;
  gap: ${e=>e.theme.spacing.sm};
  margin-top: ${e=>e.theme.spacing.sm};
`,D=s.button`
  display: grid;
  gap: ${e=>e.theme.spacing.xs};
  padding: ${e=>e.theme.spacing.md};
  border-radius: ${e=>e.theme.radii.md};
  border: 1px solid ${e=>e.theme.colors.border};
  background: ${e=>e.theme.colors.surface};
  text-align: left;
  cursor: pointer;
  transition:
    border-color ${e=>e.theme.motion.duration.base} ${e=>e.theme.motion.easing.standard},
    box-shadow ${e=>e.theme.motion.duration.base} ${e=>e.theme.motion.easing.standard},
    transform ${e=>e.theme.motion.duration.short} ${e=>e.theme.motion.easing.standard};
  strong {
    font-size: ${e=>e.theme.font.size.md};
    font-weight: ${e=>e.theme.font.weight.semiBold};
    color: ${e=>e.theme.colors.text};
  }
  span {
    font-size: ${e=>e.theme.font.size.sm};
    color: ${e=>e.theme.colors.textMuted};
  }
  &:hover {
    border-color: ${e=>e.theme.colors.borderStrong};
    box-shadow: ${e=>e.theme.shadow.medium};
    transform: translateY(-2px);
  }
`,A=s.small`
  font-size: ${e=>e.theme.font.size.sm};
  color: ${e=>e.theme.colors.primary};
  font-style: normal;
`;export{J as default};
