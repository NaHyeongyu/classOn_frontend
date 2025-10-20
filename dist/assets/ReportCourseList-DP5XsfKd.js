import{u as p,r as d,j as t,x as u,y as $,d as r}from"./index-B92ulgNv.js";import{P as x,b as f,S as b}from"./UI-ktOMpaj3.js";import{u as j}from"./hooks-35CwLTFQ.js";import{a as z}from"./utils-BiUlBUyf.js";import"./courses-BqfN_zpR.js";import"./constants-DQX3OTK7.js";function D(){const e=p(),{courses:s,loading:i,error:a}=j(),[n,h]=d.useState(""),m=d.useMemo(()=>{const o=n.trim().toLowerCase();return o?s.filter(g=>g.title.toLowerCase().includes(o)):s},[s,n]);function c(o){e($.report.courseDetail(o.id),{state:{course:o}})}return t.jsxs(x,{children:[t.jsxs(f,{children:[t.jsxs("div",{children:[t.jsx("h2",{children:"수업 리포트"}),t.jsx("p",{children:"리포트를 만들 수업을 선택하세요."})]}),t.jsx(w,{children:t.jsx(y,{type:"button",onClick:()=>e(u.report),children:"리포트 홈으로"})})]}),t.jsxs(b,{"data-animated":"true",children:[t.jsx(C,{children:t.jsxs("div",{children:[t.jsx(v,{children:"수업 선택"}),t.jsx(S,{children:"선택한 수업의 학생과 기간을 다음 단계에서 설정합니다."})]})}),t.jsx(M,{children:t.jsx(P,{id:"course-search",placeholder:"수업명을 입력해 검색하세요","aria-label":"수업 검색",value:n,onChange:o=>h(o.currentTarget.value)})}),a?t.jsx(k,{children:a}):null,i?t.jsx(l,{children:"수업 목록을 불러오는 중입니다…"}):null,!i&&m.length===0?t.jsx(l,{children:"조건에 맞는 수업이 없습니다."}):null,t.jsx(B,{children:m.map(o=>t.jsxs(H,{type:"button",onClick:()=>c(o),children:[t.jsx("strong",{children:o.title}),t.jsx("span",{children:z(o)}),o.enrolledCount!=null?t.jsx(L,{children:`등록 학생 ${o.enrolledCount}명`}):null]},o.id))})]})]})}const w=r.div`
  display: inline-flex;
  gap: ${e=>e.theme.spacing.sm};
  align-items: center;
`,y=r.button`
  height: 40px;
  padding: 0 ${e=>e.theme.spacing.md};
  border-radius: ${e=>e.theme.radii.md};
  border: 1px solid ${e=>e.theme.colors.border};
  background: ${e=>e.theme.colors.surface};
  font-size: ${e=>e.theme.font.size.sm};
  font-weight: ${e=>e.theme.font.weight.semiBold};
  cursor: pointer;
  transition: border-color ${e=>e.theme.motion.duration.base} ${e=>e.theme.motion.easing.standard};
  &:hover {
    border-color: ${e=>e.theme.colors.borderStrong};
  }
`,C=r.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${e=>e.theme.spacing.md};
  margin-bottom: ${e=>e.theme.spacing.md};
`,v=r.h3`
  margin: 0;
  font-size: ${e=>e.theme.font.size.xl};
  font-weight: ${e=>e.theme.font.weight.bold};
  color: ${e=>e.theme.colors.text};
`,S=r.p`
  margin: ${e=>e.theme.spacing.xs} 0 0;
  font-size: ${e=>e.theme.font.size.sm};
  color: ${e=>e.theme.colors.textMuted};
`,M=r.div`
  margin-bottom: ${e=>e.theme.spacing.sm};
`,P=r.input`
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
`,l=r.p`
  margin: ${e=>e.theme.spacing.xs} 0 ${e=>e.theme.spacing.sm};
  font-size: ${e=>e.theme.font.size.sm};
  color: ${e=>e.theme.colors.textMuted};
`,k=r.p`
  margin: ${e=>e.theme.spacing.xs} 0 ${e=>e.theme.spacing.sm};
  font-size: ${e=>e.theme.font.size.sm};
  color: ${e=>e.theme.colors.danger};
`,B=r.div`
  display: grid;
  gap: ${e=>e.theme.spacing.sm};
  margin-top: ${e=>e.theme.spacing.sm};
`,H=r.button`
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
`,L=r.small`
  font-size: ${e=>e.theme.font.size.sm};
  color: ${e=>e.theme.colors.primary};
  font-style: normal;
`;export{D as default};
