import{A as H,u as F,r as o,j as e,P as K,w as $,e as Y,d as s,c as D,S as V}from"./index-_dJHzZeb.js";import{C as U}from"./ConfirmDialog-B8Hr7OO8.js";import{b as W,c as q,d as J,e as Q,f as X}from"./constants-LflU8o8-.js";function je(){const{state:r}=H(),l=r?.items??[],y=r?.direction??"",d=r?.summary,h=r?.tone??"WARM_VIVID",v=F(),M=d?.bullets??r?.bullets??[],[i,u]=o.useState(M),[m,I]=o.useState(r?.speechStyle??"SEUMNIDA"),[S,L]=o.useState(r?.platformChoice??"INSTAGRAM"),[w,z]=o.useState(r?.formatStyle??"STORY"),[n,b]=o.useState(null),_=W[h]??h,P=q[m],k=n!==null?`#${n+1}`:"",B=()=>{v("/marketing/rendering",{state:{...r,items:l,direction:y,bullets:i,tone:h,speechStyle:m,platformChoice:S,formatStyle:w,summary:d}})},O=(a,t)=>{const p=a.slice(0,6).map(x=>`• ${x.date}${x.courseTitle?` [${x.courseTitle}]`:""}: ${x.content||""}`),R=a.length>6?`
... (외 ${a.length-6}행)`:"",G=t.trim()?t.trim():`${p.join(`
`)}${R}`;return e.jsx(T,{children:e.jsx("p",{style:{whiteSpace:"pre-wrap"},children:G})})};return e.jsxs(K,{children:[e.jsxs(Z,{children:[e.jsx(f,{"data-active":!1,"data-done":!0,"aria-current":!1,children:"1. 작성 가이드"}),e.jsx(C,{}),e.jsx(f,{"data-active":!0,"aria-current":"step",children:"2. 전송 미리보기"}),e.jsx(C,{}),e.jsx(f,{"data-active":!1,"aria-current":!1,children:"3. 생성/편집"})]}),e.jsx(ee,{children:e.jsxs(re,{children:[e.jsxs(ae,{children:[e.jsx("h1",{children:"전송 전 내용을 한번 더 점검해요"}),e.jsx("p",{children:"요약과 핵심 문장을 확인하고 설정을 마친 뒤 다음 단계로 넘어가세요."})]}),e.jsxs(se,{children:[e.jsxs(j,{children:["선택 항목 ",l.length,"건"]}),e.jsxs(j,{children:["톤 ",_]}),e.jsxs(j,{children:["말투 ",P]})]})]})}),e.jsxs(te,{children:[e.jsxs(ie,{children:[e.jsxs(g,{children:[e.jsx("h2",{children:"AI 요약 내용"}),e.jsx("p",{className:"hint",children:"최근 수업 활동을 분석한 결과를 확인하세요."}),e.jsx(oe,{children:d?.summary?e.jsx(T,{children:e.jsx("p",{style:{whiteSpace:"pre-wrap"},children:d.summary})}):O(l,y)})]}),e.jsxs(g,{children:[e.jsx("h2",{children:"핵심 문장"}),e.jsx("p",{className:"hint",children:"핵심 문장을 검토하고 바로 수정할 수 있어요."}),e.jsx(le,{role:"list",children:i.length===0?e.jsx(pe,{children:"핵심 문장이 아직 없습니다. 아래 버튼으로 추가해 보세요."}):i.map((a,t)=>e.jsxs(de,{children:[e.jsxs("span",{className:"index",children:["#",t+1]}),e.jsx(ce,{value:a,onChange:c=>{const p=i.slice();p[t]=c.target.value,u(p)},placeholder:`핵심 내용 ${t+1}`}),e.jsx($,{as:"button","data-variant":"danger",onClick:()=>b(t),children:"삭제"})]},t))}),e.jsx("div",{children:e.jsx(Y,{type:"button",onClick:()=>u([...i,""]),children:"+ 항목 추가"})})]})]}),e.jsxs(ne,{children:[e.jsxs(g,{children:[e.jsx("h2",{children:"플랫폼 선택"}),e.jsx("p",{className:"hint",children:"콘텐츠를 게시할 채널을 선택하세요."}),e.jsx(xe,{children:J.map(a=>e.jsxs(ge,{"data-active":S===a.value,onClick:()=>L(a.value),children:[e.jsx("span",{className:"icon",role:"img","aria-label":a.name,children:a.icon}),e.jsx("strong",{children:a.name}),e.jsx("small",{children:a.description})]},a.value))})]}),e.jsxs(g,{children:[e.jsx("h2",{children:"톤 & 문장 어미"}),e.jsx("p",{className:"hint",children:"말투와 양식을 설정하면 결과물에 반영돼요."}),e.jsx(E,{children:"문장 어미"}),e.jsx(N,{children:Q.map(a=>e.jsxs(A,{"data-active":m===a.value,onClick:()=>I(a.value),children:[e.jsx("span",{children:a.emoji}),e.jsx("span",{children:a.label})]},a.value))}),e.jsx(E,{children:"양식"}),e.jsx(N,{children:X.map(a=>e.jsxs(A,{"data-active":w===a.value,onClick:()=>z(a.value),children:[e.jsx("span",{children:a.emoji}),e.jsx("span",{children:a.label})]},a.value))})]})]})]}),e.jsxs(he,{children:[e.jsx($,{as:"button",onClick:()=>v("/marketing"),children:"← 이전"}),e.jsx(ue,{type:"button",onClick:B,disabled:!l.length,children:"다음 단계"})]}),e.jsx(U,{open:n!==null,title:"항목을 삭제할까요?",message:k?`${k} 핵심 문장을 삭제합니다.`:"선택한 항목을 삭제합니다.",confirmLabel:"삭제",cancelLabel:"취소",tone:"danger",onConfirm:()=>{n!==null&&(u(a=>a.filter((t,c)=>c!==n)),b(null))},onCancel:()=>b(null)})]})}const Z=s.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
`,f=s.div`
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid ${({theme:r})=>r.colors.border};
  font-size: 12px;
  color: ${({theme:r})=>r.colors.textMuted};
  &[data-active='true'] {
    background: ${({theme:r})=>r.colors.primarySurface};
    color: ${({theme:r})=>r.colors.primary};
    border-color: ${({theme:r})=>r.colors.border};
    font-weight: 800;
  }
  &[data-done='true'] {
    background: ${({theme:r})=>r.colors.surfaceMuted};
    color: ${({theme:r})=>r.colors.text};
  }
`,C=s.span`
  width: 10px;
  height: 1px;
  background: ${({theme:r})=>r.colors.border};
  display: inline-block;
`,ee=s.header`
  display: grid;
  gap: 16px;
  margin-bottom: 12px;
`,re=s.section`
  display: grid;
  gap: 12px;
  padding: 18px;
  border-radius: 18px;
  background: linear-gradient(135deg, rgba(248, 250, 252, 0.94), rgba(224, 231, 255, 0.8));
  border: 1px solid rgba(203, 213, 225, 0.4);
`,ae=s.div`
  display: grid;
  gap: 4px;
  h1 {
    margin: 0;
    font-size: 24px;
    font-weight: 800;
    color: #111827;
  }
  p {
    margin: 0;
    font-size: 14px;
    color: #475569;
  }
`,se=s.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`,j=s.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  font-size: 12px;
  border-radius: 999px;
  background: rgba(99, 102, 241, 0.08);
  color: #4338ca;
  font-weight: 600;
`,te=s.div`
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  gap: 16px;
  align-items: start;
  @media (max-width: 1080px) {
    grid-template-columns: 1fr;
  }
`,ie=s.div`
  display: grid;
  gap: 16px;
`,ne=s.div`
  display: grid;
  gap: 16px;
`,g=s(V)`
  display: grid;
  gap: 12px;
  padding: 18px;
  border-radius: 18px;
  border: none;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.05);
  h2 {
    margin: 0;
    font-size: 18px;
    color: #111827;
  }
  .hint {
    margin: 0;
    font-size: 13px;
    color: #64748b;
  }
`,oe=s.div`
  border-radius: 18px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  padding: 20px;
  min-height: 220px;
  display: grid;
  gap: 10px;
  box-shadow: 0 18px 42px rgba(15, 23, 42, 0.08);
  border: 1px solid rgba(226, 232, 240, 0.7);
  max-height: 380px;
  overflow-y: auto;
`,T=s.div`
  display: grid;
  gap: 14px;
  font-size: 14px;
  line-height: 1.8;
  color: #1f2937;
  p {
    margin: 0;
  }
`,le=s.div`
  display: grid;
  gap: 8px;
  overflow-y: auto;
  padding-right: 4px;
  min-height: 0;
  scrollbar-width: thin;
  scrollbar-color: rgba(148, 163, 184, 0.55) transparent;
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(148, 163, 184, 0.55);
    border-radius: 999px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
`,de=s.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid ${({theme:r})=>r.colors.border};
  background: ${({theme:r})=>r.colors.surfaceMuted};
  .index {
    font-weight: 700;
    color: ${({theme:r})=>r.colors.text};
  }
`,ce=s.input`
  flex: 1;
  min-width: 0;
  height: 40px;
  border-radius: 12px;
  border: 1px solid ${({theme:r})=>r.colors.border};
  padding: 0 12px;
  background: #fff;
  font-size: 13px;
  color: ${({theme:r})=>r.colors.text};
`,pe=s.div`
  display: grid;
  place-items: center;
  padding: 14px;
  border-radius: 12px;
  border: 1px dashed ${({theme:r})=>r.colors.border};
  font-size: 13px;
  color: ${({theme:r})=>r.colors.textMuted};
`,xe=s.div`
  display: grid;
  gap: 10px;
`,ge=s.button`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  text-align: left;
  border-radius: 16px;
  border: 1px solid rgba(203, 213, 225, 0.7);
  background: #ffffff;
  cursor: pointer;
  transition: border-color 0.18s ease, box-shadow 0.18s ease, transform 0.1s ease;
  .icon {
    font-size: 20px;
  }
  .text {
    display: grid;
    gap: 4px;
  }
  strong {
    font-size: 14px;
    color: #111827;
  }
  small {
    font-size: 12px;
    color: #64748b;
  }
  &[data-active='true'] {
    border-color: #4f46e5;
    box-shadow: 0 12px 24px rgba(79, 70, 229, 0.18);
    transform: translateY(-2px);
  }
`,E=s.div`
  margin-top: 6px;
  font-size: 12px;
  font-weight: 700;
  color: #475569;
`,N=s.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`,A=s.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 12px;
  border-radius: 999px;
  border: 1px solid rgba(203, 213, 225, 0.8);
  background: #fff;
  cursor: pointer;
  font-size: 13px;
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
  &[data-active='true'] {
    background: rgba(99, 102, 241, 0.16);
    color: #4338ca;
    border-color: rgba(99, 102, 241, 0.4);
    font-weight: 700;
  }
`,he=s.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 18px;
`,ue=s.button`
  ${D.primary};
  min-width: 148px;
  height: 44px;
  font-size: 15px;
  font-weight: 700;
  border-radius: ${({theme:r})=>r.radii.md};
  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;export{je as default};
