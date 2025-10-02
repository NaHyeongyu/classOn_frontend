import{z as B,r as n,u as O,j as r,l as P,q as f,h as L,d as o,S as j}from"./index-Cl4EBL6b.js";function de(){const{state:e}=B(),x=e?.items??[],y=e?.direction??"",M=e?.summary?.bullets??e?.bullets??[],[s,g]=n.useState(M),N=e?.tone??"WARM_VIVID",[h,w]=n.useState(e?.speechStyle??"SEUMNIDA"),v=O(),[S,A]=n.useState(e?.platformChoice??"INSTAGRAM"),[l,m]=n.useState(e?.formatStyle??"STORY"),[ae,ie]=n.useState(!1),[se,te]=n.useState(!1);function I(){v("/marketing/rendering",{state:{items:x,direction:y,bullets:s,tone:N,speechStyle:h,platformChoice:S,formatStyle:l,summary:e?.summary}})}function R(a,i){const t=a.slice(0,6).map(p=>`• ${p.date}${p.courseTitle?` [${p.courseTitle}]`:""}: ${p.content||""}`),T=a.length>6?`
... (외 ${a.length-6}행)`:"",E=i&&i.trim()?i.trim():t.join(`
`)+T;return r.jsx(k,{children:r.jsx("p",{style:{whiteSpace:"pre-wrap"},children:E})})}return r.jsxs(P,{children:[r.jsxs(U,{children:[r.jsx(b,{"data-active":!1,"data-done":!0,children:"1. 작성 가이드"}),r.jsx($,{}),r.jsx(b,{"data-active":!0,children:"2. 전송 미리보기"}),r.jsx($,{}),r.jsx(b,{"data-active":!1,children:"3. 생성/편집"})]}),r.jsx(V,{children:r.jsxs(_,{children:[r.jsxs(q,{children:[r.jsx("h1",{children:"전송 전 내용을 한번 더 점검해요"}),r.jsx("p",{children:"요약과 핵심 문장을 확인하고 설정을 마친 뒤 다음 단계로 넘어가세요."})]}),r.jsx(W,{children:r.jsxs(J,{children:["선택 항목 ",x.length,"건"]})})]})}),r.jsxs(K,{children:[r.jsxs(Q,{children:[r.jsxs(c,{children:[r.jsx("h2",{children:"AI 요약 내용"}),r.jsx("p",{className:"hint",children:"최근 수업 활동을 분석한 결과를 확인하세요."}),r.jsx(G,{children:e?.summary?.summary?r.jsx(k,{children:r.jsx("p",{style:{whiteSpace:"pre-wrap"},children:e.summary.summary})}):R(x,y)})]}),r.jsxs(c,{children:[r.jsx("h2",{children:"핵심 문장"}),r.jsx("p",{className:"hint",children:"핵심 문장을 검토하고 바로 수정할 수 있어요."}),r.jsx(F,{role:"list",children:s.length===0?r.jsx(D,{children:"핵심 문장이 아직 없습니다. 아래 버튼으로 추가해 보세요."}):s.map((a,i)=>r.jsxs(Y,{children:[r.jsxs("span",{className:"index",children:["#",i+1]}),r.jsx(H,{value:a,onChange:u=>{const t=s.slice();t[i]=u.target.value,g(t)},placeholder:`핵심 내용 ${i+1}`}),r.jsx(f,{as:"button",onClick:()=>g(s.filter((u,t)=>t!==i)),children:"삭제"})]},i))}),r.jsx("div",{children:r.jsx(f,{as:"button",onClick:()=>g([...s,""]),children:"+ 항목 추가"})})]}),!1]}),r.jsxs(X,{children:[r.jsxs(c,{children:[r.jsx("h2",{children:"플랫폼 선택"}),r.jsx("p",{className:"hint",children:"콘텐츠를 게시할 채널을 선택하세요."}),r.jsx(Z,{children:oe.map(a=>r.jsxs(ee,{"data-active":S===a.value,onClick:()=>A(a.value),children:[r.jsx("span",{className:"icon",role:"img","aria-label":a.name,children:a.icon}),r.jsx("strong",{children:a.name}),r.jsx("small",{children:a.desc})]},a.value))})]}),r.jsxs(c,{children:[r.jsx("h2",{children:"톤 & 문장 어미"}),r.jsx("p",{className:"hint",children:"말투와 어조를 설정하면 결과물에 반영돼요."}),r.jsx(z,{children:"문장 어미"}),r.jsxs(C,{children:[r.jsxs(d,{"data-active":h==="SEUMNIDA",onClick:()=>w("SEUMNIDA"),children:[r.jsx("span",{children:"🧑‍🏫"}),r.jsx("span",{children:"~습니다"})]}),r.jsxs(d,{"data-active":h==="YO",onClick:()=>w("YO"),children:[r.jsx("span",{children:"😊"}),r.jsx("span",{children:"~요"})]})]}),r.jsx(z,{children:"양식"}),r.jsxs(C,{children:[r.jsxs(d,{"data-active":l==="STORY",onClick:()=>m("STORY"),children:[r.jsx("span",{children:"🧵"}),r.jsx("span",{children:"스토리텔링"})]}),r.jsxs(d,{"data-active":l==="LIST",onClick:()=>m("LIST"),children:[r.jsx("span",{children:"📋"}),r.jsx("span",{children:"정보 나열"})]}),r.jsxs(d,{"data-active":l==="PERFORMANCE",onClick:()=>m("PERFORMANCE"),children:[r.jsx("span",{children:"🏆"}),r.jsx("span",{children:"성과 중심"})]})]})]})]})]}),r.jsxs(re,{children:[r.jsx(f,{as:"button",onClick:()=>v("/marketing/guide"),children:"← 이전"}),r.jsx(L,{as:"button",onClick:I,children:"다음 단계"})]})]})}o.header`
  display: grid;
  gap: 6px;
  margin-bottom: 18px;
`;o.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;o.h2`
  margin: 0;
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: ${({theme:e})=>e.colors.text};
`;o.p`
  margin: 0;
  font-size: 13px;
  color: ${({theme:e})=>e.colors.textMuted};
`;o.div`
  display: grid;
  gap: 16px;
  align-items: stretch;
  grid-template-columns: 1fr;
  @media (min-width: 1080px) {
    grid-template-columns: 1.4fr 1fr;
  }
`;o(j)`
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 16px;
  padding: 0;
  background: transparent;
  border: none;
  box-shadow: none;
  min-height: 0;
`;o(j)`
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  gap: 16px;
  align-self: stretch;
  min-height: 0;
  overflow: hidden;
  max-height: 420px;
  @media (max-width: 1079px) {
    max-height: none;
  }
`;o.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;o.h3`
  margin: 0;
  font-size: 18px;
  color: #0f172a;
  font-weight: 800;
`;o.p`
  margin: 4px 0 0;
  font-size: 13px;
  color: #475569;
`;o.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;o.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid ${({theme:e})=>e.colors.border};
  background: ${({theme:e})=>e.colors.surfaceMuted};
  color: ${({theme:e})=>e.colors.text};
  font-size: 12px;
  font-weight: 600;
`;const G=o.div`
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
`,k=o.div`
  display: grid;
  gap: 14px;
  font-size: 14px;
  line-height: 1.8;
  color: #1f2937;
  p { margin: 0; }
`,F=o.div`
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
`,Y=o.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid ${({theme:e})=>e.colors.border};
  background: ${({theme:e})=>e.colors.surfaceMuted};
`;o.span`
  flex: 1;
  font-size: 13px;
  color: ${({theme:e})=>e.colors.text};
`;o.button`
  border: none;
  background: transparent;
  font-size: 16px;
  color: ${({theme:e})=>e.colors.textMuted};
  cursor: pointer;
  padding: 0 4px;
`;o.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;const H=o.input`
  flex: 1;
  height: 40px;
  border-radius: 12px;
  border: 1px solid ${({theme:e})=>e.colors.border};
  padding: 0 12px;
  background: #fff;
  font-size: 13px;
  color: ${({theme:e})=>e.colors.text};
`;o.button`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 1px solid ${({theme:e})=>e.colors.border};
  background: ${({theme:e})=>e.colors.primarySurface};
  color: ${({theme:e})=>e.colors.primary};
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
`;const D=o.div`
  display: grid;
  place-items: center;
  padding: 14px;
  border-radius: 12px;
  border: 1px dashed ${({theme:e})=>e.colors.border};
  font-size: 13px;
  color: ${({theme:e})=>e.colors.textMuted};
`;o.div`
  display: flex;
  justify-content: flex-end;
`;o.div`
  margin: 2px 0 6px;
  font-size: 12px;
  font-weight: 700;
  color: ${({theme:e})=>e.colors.text};
`;o.pre`
  margin: 0;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid ${({theme:e})=>e.colors.border};
  background: #fff;
  color: ${({theme:e})=>e.colors.text};
  font-size: 12px;
  line-height: 1.65;
  white-space: pre-wrap;
`;o.div`
  display: grid;
  gap: 6px;
  &:not(:last-child){ margin-bottom: 10px; }
`;o.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;o.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  border-radius: 999px;
  border: 1px solid ${({theme:e})=>e.colors.border};
  background: #fff;
  color: ${({theme:e})=>e.colors.text};
  font-size: 12px;
  cursor: pointer;
  &[data-active='true']{
    background: ${({theme:e})=>e.colors.primarySurface};
    color: ${({theme:e})=>e.colors.primary};
    border-color: ${({theme:e})=>e.colors.border};
    font-weight: 800;
  }
`;o.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
`;const U=o.div`
  display: flex; align-items: center; gap: 8px; margin-bottom: 8px; flex-wrap: wrap;
`,b=o.div`
  padding: 4px 10px; border-radius: 999px; border: 1px solid ${({theme:e})=>e.colors.border}; font-size: 12px; color: ${({theme:e})=>e.colors.textMuted};
  &[data-active='true']{ background: ${({theme:e})=>e.colors.primarySurface}; color: ${({theme:e})=>e.colors.primary}; border-color: ${({theme:e})=>e.colors.border}; font-weight: 800; }
  &[data-done='true']{ background: ${({theme:e})=>e.colors.surfaceMuted}; color: ${({theme:e})=>e.colors.text}; }
`,$=o.span`
  width: 10px; height: 1px; background: ${({theme:e})=>e.colors.border}; display: inline-block;
`,V=o.header`
  display: grid; gap: 16px; margin-bottom: 12px;
`,_=o.section`
  display: grid; gap: 12px; padding: 18px; border-radius: 18px;
  background: linear-gradient(135deg, rgba(248, 250, 252, 0.94), rgba(224, 231, 255, 0.8));
  border: 1px solid rgba(203, 213, 225, 0.4);
`,q=o.div`
  display: grid; gap: 4px;
  h1 { margin: 0; font-size: 24px; font-weight: 800; color: #111827; }
  p { margin: 0; font-size: 14px; color: #475569; }
`,W=o.div`
  display: flex; gap: 8px; flex-wrap: wrap;
`,J=o.span`
  display: inline-flex; align-items: center; gap: 6px; padding: 6px 10px; font-size: 12px;
  border-radius: 999px; background: rgba(99, 102, 241, 0.08); color: #4338ca; font-weight: 600;
`,K=o.div`
  display: grid; grid-template-columns: minmax(0, 2fr) minmax(0, 1fr); gap: 16px; align-items: start;
  @media (max-width: 1080px){ grid-template-columns: 1fr; }
`,Q=o.div` display: grid; gap: 16px; `,X=o.div` display: grid; gap: 16px; `,c=o(j)`
  display: grid; gap: 12px; padding: 18px; border-radius: 18px; border: none;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.05);
  h2 { margin: 0; font-size: 18px; color: #111827; }
  .hint { margin: 0; font-size: 13px; color: #64748b; }
`,z=o.div`
  margin-top: 6px; font-size: 12px; font-weight: 700; color: #475569;
`,Z=o.div` display: grid; gap: 10px; `,ee=o.button`
  display: grid; gap: 6px; padding: 14px; text-align: left; border-radius: 16px;
  border: 1px solid rgba(203, 213, 225, 0.7); background: #ffffff; cursor: pointer;
  transition: border-color .18s ease, box-shadow .18s ease, transform .1s ease;
  .icon { font-size: 20px; }
  strong { font-size: 14px; color: #111827; }
  small { font-size: 12px; color: #64748b; }
  &[data-active='true']{ border-color: #4f46e5; box-shadow: 0 12px 24px rgba(79, 70, 229, 0.18); transform: translateY(-2px); }
`,C=o.div` display: flex; flex-wrap: wrap; gap: 8px; `,d=o.button`
  display: inline-flex; align-items: center; gap: 6px; padding: 8px 10px; border-radius: 999px;
  border: 1px solid rgba(203, 213, 225, 0.8); background: #fff; cursor: pointer;
  span { font-size: 13px; }
  &[data-active='true']{ background: rgba(99,102,241,.16); color: #4338ca; border-color: rgba(99,102,241,.4); font-weight: 700; }
`,re=o.div` display:flex; justify-content: space-between; align-items:center; margin-top: 18px; `,oe=[{value:"INSTAGRAM",name:"인스타그램",icon:"📸",desc:"짧고 임팩트 있는 메시지"},{value:"NAVER_BLOG",name:"네이버 블로그",icon:"📝",desc:"길고 친절한 설명에 적합"}];export{de as default};
