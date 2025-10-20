import{u as d,j as t,x as n,d as o}from"./index-B92ulgNv.js";import{P as h,b as m,S as l}from"./UI-ktOMpaj3.js";function f(){const e=d();return t.jsxs(h,{children:[t.jsx(m,{children:t.jsxs("div",{children:[t.jsx("h2",{children:"리포트"}),t.jsx("p",{children:"수업별 혹은 학생별 리포트를 빠르게 시작하세요."})]})}),t.jsxs(l,{"data-animated":"true",children:[t.jsx(c,{children:"어떤 리포트를 준비할까요?"}),t.jsx(g,{children:"필요한 리포트 유형을 선택하면 다음 화면에서 세부 정보를 이어서 설정할 수 있어요."}),t.jsxs(x,{children:[t.jsxs(i,{type:"button",onClick:()=>e(n.reportCourse),children:[t.jsx(r,{children:"수업 리포트"}),t.jsx(s,{children:"수업 전체 학생을 포함한 리포트"}),t.jsx(a,{children:"수업별 진행 현황과 출결, 시험 요약을 모아 학부모나 내부 공유용 리포트를 준비합니다."})]}),t.jsxs(i,{type:"button",onClick:()=>e(n.reportStudent),children:[t.jsx(r,{children:"학생 개별 리포트"}),t.jsx(s,{children:"학생 한 명에 집중한 리포트"}),t.jsx(a,{children:"상담 기록과 수업, 시험 참석 내역을 정리해 학부모 소통용 또는 내부 기록용 리포트를 만듭니다."})]})]})]})]})}const c=o.h3`
  margin: 0 0 ${e=>e.theme.spacing.xs};
  font-size: ${e=>e.theme.font.size.xl};
  font-weight: ${e=>e.theme.font.weight.bold};
  letter-spacing: -0.01em;
  color: ${e=>e.theme.colors.text};
`,g=o.p`
  margin: 0 0 ${e=>e.theme.spacing.lg};
  font-size: ${e=>e.theme.font.size.sm};
  line-height: ${e=>e.theme.font.lineHeight.relaxed};
  color: ${e=>e.theme.colors.textMuted};
`,x=o.div`
  display: grid;
  gap: ${e=>e.theme.spacing.lg};
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
`,i=o.button`
  display: grid;
  gap: ${e=>e.theme.spacing.sm};
  padding: ${e=>e.theme.spacing.xl};
  border-radius: ${e=>e.theme.radii.xl};
  border: 1px solid ${e=>e.theme.colors.border};
  background: ${e=>e.theme.colors.surface};
  text-align: left;
  cursor: pointer;
  transition:
    border-color ${e=>e.theme.motion.duration.base} ${e=>e.theme.motion.easing.standard},
    box-shadow ${e=>e.theme.motion.duration.base} ${e=>e.theme.motion.easing.standard},
    transform ${e=>e.theme.motion.duration.short} ${e=>e.theme.motion.easing.standard},
    background ${e=>e.theme.motion.duration.base} ${e=>e.theme.motion.easing.standard};
  &:hover {
    border-color: ${e=>e.theme.colors.borderStrong};
    transform: translateY(-2px);
    box-shadow: ${e=>e.theme.shadow.medium};
  }
`,r=o.span`
  font-size: ${e=>e.theme.font.size.lg};
  font-weight: ${e=>e.theme.font.weight.bold};
  color: ${e=>e.theme.colors.text};
`,s=o.span`
  font-size: ${e=>e.theme.font.size.sm};
  font-weight: ${e=>e.theme.font.weight.semiBold};
  color: ${e=>e.theme.colors.primary};
`,a=o.span`
  font-size: ${e=>e.theme.font.size.sm};
  line-height: ${e=>e.theme.font.lineHeight.relaxed};
  color: ${e=>e.theme.colors.textMuted};
`;export{f as default};
