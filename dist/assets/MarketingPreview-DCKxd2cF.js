import{z as _,r as d,u as F,j as e,l as H,q as x,h as V,d as t,S}from"./index-CeMlVP5a.js";function he(){const{state:r}=_(),c=r?.items??[],$=r?.direction??"",E=r?.summary?.bullets??r?.bullets??[],[s,f]=d.useState(E),O=r?.tone??"WARM_VIVID",[m,k]=d.useState(r?.speechStyle??"SEUMNIDA"),z=F(),[b,B]=d.useState(r?.platformChoice??"INSTAGRAM"),[a,j]=d.useState(r?.formatStyle??"STORY"),[pe,xe]=d.useState(!1),[C,P]=d.useState(!1);function D(){z("/marketing/rendering",{state:{items:c,direction:$,bullets:s,tone:O,speechStyle:m,platformChoice:b,formatStyle:a,summary:r?.summary}})}function L(o,i){const n=o.slice(0,6).map(l=>`• ${l.date}${l.courseTitle?` [${l.courseTitle}]`:""}: ${l.content||""}`),y=o.length>6?`
... (외 ${o.length-6}행)`:"",w=i&&i.trim()?i.trim():n.join(`
`)+y;return e.jsx(T,{children:e.jsx("p",{style:{whiteSpace:"pre-wrap"},children:w})})}function A(o){if(!o)return"";let i=o.replace(/[\r\n]+/g," ").trim();return i=i.replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g,"[REDACTED]"),i=i.replace(/(\+?\d{1,3}[- ]?)?(\d{2,4}[- ]?\d{3,4}[- ]?\d{4})/g,"[REDACTED]"),i}function G(){const o=(c||[]).map(i=>i.date).filter(Boolean).sort();if(!o.length){const i=new Date().toISOString().slice(0,10);return{from:i,to:i}}return{from:o[0],to:o[o.length-1]}}function M(){const{from:o,to:i}=G(),p=m==="YO"?"요체":"입니다체",n=a==="STORY"?"스토리텔링":a==="LIST"?"정보 나열":"성과 중심",y=["[시스템]","당신은 학원·교육 기관·체험 수업을 홍보하는 인스타그램 전문 마케터입니다.","목표는 학부모와 학생이 공감하고, 학원의 커리큘럼/활동을 자연스럽게 알리는 매력적인 인스타그램 캡션을 작성하는 것입니다.","출력은 반드시 한국어로 하세요."].join(`
`),w=["[지시사항]","1) 원본 데이터를 기반으로, 이번 기간의 수업을 날짜 나열이 아닌 **하나의 흐름**으로 정리하세요.","2) 글 구조:","   - 도입: 이번 달/기간 활동의 큰 주제","   - 본문: 핵심 활동 + 아이들의 반응/느낀 점","   - 마무리: 교육적 효과 + 학원/기관 소개 + 부드러운 안내 문장","3) 이모지는 적절하게 사용하세요 (SNS 친화적으로)","4) 해시태그는 8개.","5) 글 길이: 450~900자.","6) 아래 변수를 반영해 작성하세요.",`   - 말투 (tone_of_voice): \`${p}\``,"   - 톤 (content_style):","     • `스토리텔링`: 서사 중심, 에피소드처럼 전개","     • `정보 나열`: 활동을 간결하게 나열하며 정리","     • `성과 중심`: 아이들의 성취, 결과, 성장 포인트 강조",`     → 선택: \`${n}\``,"7) 사진 추천(5~10개): 각 항목에 “아이디어/주제”를 제안하세요. 과도한 연출보다 수업 현장감이 느껴지는 자연스러운 컷을 권장합니다. 아동 개인 식별 가능 요소(얼굴·명찰 등)는 노출하지 않도록 유의합니다.","8) 금지:","   - 날짜/시간표 나열","   - 가격/할인/과장된 광고 문구","","[출력 형식]","<캡션 시작>","(최종 인스타그램 캡션)","빈 줄 1개","#해시태그","빈 줄 1개","[사진 추천(5~10개)]","- 아이디어 1","- 아이디어 2","- 아이디어 3","- 아이디어 4","- 아이디어 5","<캡션 끝>"].join(`
`),l=(c||[]).map(u=>`- ${u.date}${u.courseTitle?` [${A(u.courseTitle)}]`:""}: ${A(u.content||"")}`),Y=["[원본 데이터]",`기간: ${o} ~ ${i}`,l.join(`
`)].join(`
`);return[y,"",w,"",Y].join(`
`)}return e.jsxs(H,{children:[e.jsxs(Q,{children:[e.jsx(v,{"data-active":!1,"data-done":!0,children:"1. 작성 가이드"}),e.jsx(I,{}),e.jsx(v,{"data-active":!0,children:"2. 전송 미리보기"}),e.jsx(I,{}),e.jsx(v,{"data-active":!1,children:"3. 생성/편집"})]}),e.jsx(X,{children:e.jsxs(ee,{children:[e.jsxs(re,{children:[e.jsx("h1",{children:"전송 전 내용을 한번 더 점검해요"}),e.jsx("p",{children:"요약과 핵심 문장을 확인하고 설정을 마친 뒤 다음 단계로 넘어가세요."})]}),e.jsx(te,{children:e.jsxs(oe,{children:["선택 항목 ",c.length,"건"]})})]})}),e.jsxs(ie,{children:[e.jsxs(ne,{children:[e.jsxs(g,{children:[e.jsx("h2",{children:"AI 요약 내용"}),e.jsx("p",{className:"hint",children:"최근 수업 활동을 분석한 결과를 확인하세요."}),e.jsx(U,{children:r?.summary?.summary?e.jsx(T,{children:e.jsx("p",{style:{whiteSpace:"pre-wrap"},children:r.summary.summary})}):L(c,$)})]}),e.jsxs(g,{children:[e.jsx("h2",{children:"핵심 문장"}),e.jsx("p",{className:"hint",children:"핵심 문장을 검토하고 바로 수정할 수 있어요."}),e.jsx(Z,{role:"list",children:s.length===0?e.jsx(W,{children:"핵심 문장이 아직 없습니다. 아래 버튼으로 추가해 보세요."}):s.map((o,i)=>e.jsxs(q,{children:[e.jsxs("span",{className:"index",children:["#",i+1]}),e.jsx(K,{value:o,onChange:p=>{const n=s.slice();n[i]=p.target.value,f(n)},placeholder:`핵심 내용 ${i+1}`}),e.jsx(x,{as:"button",onClick:()=>f(s.filter((p,n)=>n!==i)),children:"삭제"})]},i))}),e.jsx("div",{children:e.jsx(x,{as:"button",onClick:()=>f([...s,""]),children:"+ 항목 추가"})})]}),b==="INSTAGRAM"&&e.jsxs(g,{children:[e.jsx("h2",{children:"전송 프롬프트 (Instagram)"}),e.jsx("p",{className:"hint",children:"현재 설정이 반영된 프롬프트를 확인하고 복사할 수 있어요."}),e.jsxs("div",{style:{display:"flex",gap:12,justifyContent:"flex-end"},children:[e.jsx(x,{as:"button",onClick:()=>P(o=>!o),children:C?"접기":"펼쳐보기"}),e.jsx(x,{as:"button",onClick:()=>{const o=M();navigator.clipboard?.writeText(o).catch(()=>{})},children:"전체 복사"})]}),C&&e.jsx(J,{style:{maxHeight:480,overflow:"auto"},children:M()})]})]}),e.jsxs(se,{children:[e.jsxs(g,{children:[e.jsx("h2",{children:"플랫폼 선택"}),e.jsx("p",{className:"hint",children:"콘텐츠를 게시할 채널을 선택하세요."}),e.jsx(ae,{children:ce.map(o=>e.jsxs(le,{"data-active":b===o.value,onClick:()=>B(o.value),children:[e.jsx("span",{className:"icon",role:"img","aria-label":o.name,children:o.icon}),e.jsx("strong",{children:o.name}),e.jsx("small",{children:o.desc})]},o.value))})]}),e.jsxs(g,{children:[e.jsx("h2",{children:"톤 & 문장 어미"}),e.jsx("p",{className:"hint",children:"말투와 어조를 설정하면 결과물에 반영돼요."}),e.jsx(N,{children:"문장 어미"}),e.jsxs(R,{children:[e.jsxs(h,{"data-active":m==="SEUMNIDA",onClick:()=>k("SEUMNIDA"),children:[e.jsx("span",{children:"🧑‍🏫"}),e.jsx("span",{children:"~습니다"})]}),e.jsxs(h,{"data-active":m==="YO",onClick:()=>k("YO"),children:[e.jsx("span",{children:"😊"}),e.jsx("span",{children:"~요"})]})]}),e.jsx(N,{children:"양식"}),e.jsxs(R,{children:[e.jsxs(h,{"data-active":a==="STORY",onClick:()=>j("STORY"),children:[e.jsx("span",{children:"🧵"}),e.jsx("span",{children:"스토리텔링"})]}),e.jsxs(h,{"data-active":a==="LIST",onClick:()=>j("LIST"),children:[e.jsx("span",{children:"📋"}),e.jsx("span",{children:"정보 나열"})]}),e.jsxs(h,{"data-active":a==="PERFORMANCE",onClick:()=>j("PERFORMANCE"),children:[e.jsx("span",{children:"🏆"}),e.jsx("span",{children:"성과 중심"})]})]})]})]})]}),e.jsxs(de,{children:[e.jsx(x,{as:"button",onClick:()=>z("/marketing/guide"),children:"← 이전"}),e.jsx(V,{as:"button",onClick:D,children:"다음 단계"})]})]})}t.header`
  display: grid;
  gap: 6px;
  margin-bottom: 18px;
`;t.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;t.h2`
  margin: 0;
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: ${({theme:r})=>r.colors.text};
`;t.p`
  margin: 0;
  font-size: 13px;
  color: ${({theme:r})=>r.colors.textMuted};
`;t.div`
  display: grid;
  gap: 16px;
  align-items: stretch;
  grid-template-columns: 1fr;
  @media (min-width: 1080px) {
    grid-template-columns: 1.4fr 1fr;
  }
`;t(S)`
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 16px;
  padding: 0;
  background: transparent;
  border: none;
  box-shadow: none;
  min-height: 0;
`;t(S)`
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
`;t.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;t.h3`
  margin: 0;
  font-size: 18px;
  color: #0f172a;
  font-weight: 800;
`;t.p`
  margin: 4px 0 0;
  font-size: 13px;
  color: #475569;
`;t.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;t.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid ${({theme:r})=>r.colors.border};
  background: ${({theme:r})=>r.colors.surfaceMuted};
  color: ${({theme:r})=>r.colors.text};
  font-size: 12px;
  font-weight: 600;
`;const U=t.div`
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
`,T=t.div`
  display: grid;
  gap: 14px;
  font-size: 14px;
  line-height: 1.8;
  color: #1f2937;
  p { margin: 0; }
`,Z=t.div`
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
`,q=t.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid ${({theme:r})=>r.colors.border};
  background: ${({theme:r})=>r.colors.surfaceMuted};
`;t.span`
  flex: 1;
  font-size: 13px;
  color: ${({theme:r})=>r.colors.text};
`;t.button`
  border: none;
  background: transparent;
  font-size: 16px;
  color: ${({theme:r})=>r.colors.textMuted};
  cursor: pointer;
  padding: 0 4px;
`;t.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;const K=t.input`
  flex: 1;
  height: 40px;
  border-radius: 12px;
  border: 1px solid ${({theme:r})=>r.colors.border};
  padding: 0 12px;
  background: #fff;
  font-size: 13px;
  color: ${({theme:r})=>r.colors.text};
`;t.button`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 1px solid ${({theme:r})=>r.colors.border};
  background: ${({theme:r})=>r.colors.primarySurface};
  color: ${({theme:r})=>r.colors.primary};
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
`;const W=t.div`
  display: grid;
  place-items: center;
  padding: 14px;
  border-radius: 12px;
  border: 1px dashed ${({theme:r})=>r.colors.border};
  font-size: 13px;
  color: ${({theme:r})=>r.colors.textMuted};
`;t.div`
  display: flex;
  justify-content: flex-end;
`;t.div`
  margin: 2px 0 6px;
  font-size: 12px;
  font-weight: 700;
  color: ${({theme:r})=>r.colors.text};
`;const J=t.pre`
  margin: 0;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid ${({theme:r})=>r.colors.border};
  background: #fff;
  color: ${({theme:r})=>r.colors.text};
  font-size: 12px;
  line-height: 1.65;
  white-space: pre-wrap;
`;t.div`
  display: grid;
  gap: 6px;
  &:not(:last-child){ margin-bottom: 10px; }
`;t.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;t.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  border-radius: 999px;
  border: 1px solid ${({theme:r})=>r.colors.border};
  background: #fff;
  color: ${({theme:r})=>r.colors.text};
  font-size: 12px;
  cursor: pointer;
  &[data-active='true']{
    background: ${({theme:r})=>r.colors.primarySurface};
    color: ${({theme:r})=>r.colors.primary};
    border-color: ${({theme:r})=>r.colors.border};
    font-weight: 800;
  }
`;t.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
`;const Q=t.div`
  display: flex; align-items: center; gap: 8px; margin-bottom: 8px; flex-wrap: wrap;
`,v=t.div`
  padding: 4px 10px; border-radius: 999px; border: 1px solid ${({theme:r})=>r.colors.border}; font-size: 12px; color: ${({theme:r})=>r.colors.textMuted};
  &[data-active='true']{ background: ${({theme:r})=>r.colors.primarySurface}; color: ${({theme:r})=>r.colors.primary}; border-color: ${({theme:r})=>r.colors.border}; font-weight: 800; }
  &[data-done='true']{ background: ${({theme:r})=>r.colors.surfaceMuted}; color: ${({theme:r})=>r.colors.text}; }
`,I=t.span`
  width: 10px; height: 1px; background: ${({theme:r})=>r.colors.border}; display: inline-block;
`,X=t.header`
  display: grid; gap: 16px; margin-bottom: 12px;
`,ee=t.section`
  display: grid; gap: 12px; padding: 18px; border-radius: 18px;
  background: linear-gradient(135deg, rgba(248, 250, 252, 0.94), rgba(224, 231, 255, 0.8));
  border: 1px solid rgba(203, 213, 225, 0.4);
`,re=t.div`
  display: grid; gap: 4px;
  h1 { margin: 0; font-size: 24px; font-weight: 800; color: #111827; }
  p { margin: 0; font-size: 14px; color: #475569; }
`,te=t.div`
  display: flex; gap: 8px; flex-wrap: wrap;
`,oe=t.span`
  display: inline-flex; align-items: center; gap: 6px; padding: 6px 10px; font-size: 12px;
  border-radius: 999px; background: rgba(99, 102, 241, 0.08); color: #4338ca; font-weight: 600;
`,ie=t.div`
  display: grid; grid-template-columns: minmax(0, 2fr) minmax(0, 1fr); gap: 16px; align-items: start;
  @media (max-width: 1080px){ grid-template-columns: 1fr; }
`,ne=t.div` display: grid; gap: 16px; `,se=t.div` display: grid; gap: 16px; `,g=t(S)`
  display: grid; gap: 12px; padding: 18px; border-radius: 18px; border: none;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.05);
  h2 { margin: 0; font-size: 18px; color: #111827; }
  .hint { margin: 0; font-size: 13px; color: #64748b; }
`,N=t.div`
  margin-top: 6px; font-size: 12px; font-weight: 700; color: #475569;
`,ae=t.div` display: grid; gap: 10px; `,le=t.button`
  display: grid; gap: 6px; padding: 14px; text-align: left; border-radius: 16px;
  border: 1px solid rgba(203, 213, 225, 0.7); background: #ffffff; cursor: pointer;
  transition: border-color .18s ease, box-shadow .18s ease, transform .1s ease;
  .icon { font-size: 20px; }
  strong { font-size: 14px; color: #111827; }
  small { font-size: 12px; color: #64748b; }
  &[data-active='true']{ border-color: #4f46e5; box-shadow: 0 12px 24px rgba(79, 70, 229, 0.18); transform: translateY(-2px); }
`,R=t.div` display: flex; flex-wrap: wrap; gap: 8px; `,h=t.button`
  display: inline-flex; align-items: center; gap: 6px; padding: 8px 10px; border-radius: 999px;
  border: 1px solid rgba(203, 213, 225, 0.8); background: #fff; cursor: pointer;
  span { font-size: 13px; }
  &[data-active='true']{ background: rgba(99,102,241,.16); color: #4338ca; border-color: rgba(99,102,241,.4); font-weight: 700; }
`,de=t.div` display:flex; justify-content: space-between; align-items:center; margin-top: 18px; `,ce=[{value:"INSTAGRAM",name:"인스타그램",icon:"📸",desc:"짧고 임팩트 있는 메시지"},{value:"NAVER_BLOG",name:"네이버 블로그",icon:"📝",desc:"길고 친절한 설명에 적합"}];export{he as default};
