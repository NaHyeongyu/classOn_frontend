import{z as Z,r as i,u as W,j as t,l as q,q as k,S as j,h as J,d as r}from"./index-CJzRppoi.js";import{B as O}from"./BackButton-D3WMQeJJ.js";function $e(){const{state:e}=Z(),h=e?.items??[],z=e?.direction??"",F=e?.summary?.bullets??e?.bullets??[],[l,y]=i.useState(F),L=e?.tone??"WARM_VIVID",[m,M]=i.useState(e?.speechStyle??"SEUMNIDA"),D=W(),[p,v]=i.useState(e?.platformChoice??"INSTAGRAM"),[d,w]=i.useState(e?.formatStyle??"STORY"),[P,_]=i.useState(!1),[H]=i.useState(()=>Math.floor(Math.random()*1e3)),[T,Y]=i.useState(!1);function G(){_(!0),setTimeout(()=>{D("/marketing/rendering",{state:{items:h,direction:z,bullets:l,tone:L,speechStyle:m,platformChoice:p,formatStyle:d,summary:e?.summary}})},950)}function K(n,o){const s=n.slice(0,6).map(c=>`• ${c.date}${c.courseTitle?` [${c.courseTitle}]`:""}: ${c.content||""}`),S=n.length>6?`
... (외 ${n.length-6}행)`:"",$=o&&o.trim()?o.trim():s.join(`
`)+S;return t.jsx(N,{children:t.jsx("p",{style:{whiteSpace:"pre-wrap"},children:$})})}function E(n){if(!n)return"";let o=n.replace(/[\r\n]+/g," ").trim();return o=o.replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g,"[REDACTED]"),o=o.replace(/(\+?\d{1,3}[- ]?)?(\d{2,4}[- ]?\d{3,4}[- ]?\d{4})/g,"[REDACTED]"),o}function V(){const n=(h||[]).map(o=>o.date).filter(Boolean).sort();if(!n.length){const o=new Date().toISOString().slice(0,10);return{from:o,to:o}}return{from:n[0],to:n[n.length-1]}}function R(){const{from:n,to:o}=V(),x=m==="YO"?"요체":"입니다체",s=d==="STORY"?"스토리텔링":d==="LIST"?"정보 나열":"성과 중심",S=["[시스템]","당신은 학원·교육 기관·체험 수업을 홍보하는 인스타그램 전문 마케터입니다.","목표는 학부모와 학생이 공감하고, 학원의 커리큘럼/활동을 자연스럽게 알리는 매력적인 인스타그램 캡션을 작성하는 것입니다.","출력은 반드시 한국어로 하세요."].join(`
`),$=["[지시사항]","1) 원본 데이터를 기반으로, 이번 기간의 수업을 날짜 나열이 아닌 **하나의 흐름**으로 정리하세요.","2) 글 구조:","   - 도입: 이번 달/기간 활동의 큰 주제","   - 본문: 핵심 활동 + 아이들의 반응/느낀 점","   - 마무리: 교육적 효과 + 학원/기관 소개 + 부드러운 안내 문장","3) 이모지는 적절하게 사용하세요 (SNS 친화적으로)","4) 해시태그는 8개.","5) 글 길이: 450~900자.","6) 아래 변수를 반영해 작성하세요.",`   - 말투 (tone_of_voice): \`${x}\``,"   - 톤 (content_style):","     • `스토리텔링`: 서사 중심, 에피소드처럼 전개","     • `정보 나열`: 활동을 간결하게 나열하며 정리","     • `성과 중심`: 아이들의 성취, 결과, 성장 포인트 강조",`     → 선택: \`${s}\``,"7) 사진 추천(5~10개): 각 항목에 “아이디어/주제”를 제안하세요. 과도한 연출보다 수업 현장감이 느껴지는 자연스러운 컷을 권장합니다. 아동 개인 식별 가능 요소(얼굴·명찰 등)는 노출하지 않도록 유의합니다.","8) 금지:","   - 날짜/시간표 나열","   - 가격/할인/과장된 광고 문구","","[출력 형식]","<캡션 시작>","(최종 인스타그램 캡션)","빈 줄 1개","#해시태그","빈 줄 1개","[사진 추천(5~10개)]","- 아이디어 1","- 아이디어 2","- 아이디어 3","- 아이디어 4","- 아이디어 5","<캡션 끝>"].join(`
`),c=(h||[]).map(u=>`- ${u.date}${u.courseTitle?` [${E(u.courseTitle)}]`:""}: ${E(u.content||"")}`),U=["[원본 데이터]",`기간: ${n} ~ ${o}`,c.join(`
`)].join(`
`);return[S,"",$,"",U].join(`
`)}return t.jsxs(q,{children:[t.jsxs(ue,{children:[t.jsx(B,{"data-active":!1,"data-done":!0,children:"1. 작성 가이드"}),t.jsx(X,{}),t.jsx(B,{"data-active":!0,children:"2. 전송 미리보기"}),t.jsx(X,{}),t.jsx(B,{"data-active":!1,children:"3. 생성/편집"})]}),t.jsxs(Q,{children:[t.jsxs(ee,{children:[t.jsx(O,{backSteps:1,label:"뒤로"}),t.jsx(te,{children:"AI 요약 결과"})]}),t.jsx(re,{children:"AI가 분석한 수업 내용을 바탕으로 마케팅 콘텐츠를 생성하세요."})]}),t.jsxs(oe,{children:[t.jsxs(ne,{children:[t.jsx(g,{children:t.jsxs("div",{children:[t.jsx(f,{children:"AI 요약 내용"}),t.jsx(b,{children:"최근 수업 활동을 분석한 결과를 확인하고 핵심 문장을 검토하세요."})]})}),t.jsx(ae,{children:e?.summary?.summary?t.jsx(N,{children:t.jsx("p",{style:{whiteSpace:"pre-wrap"},children:e.summary.summary})}):K(h,z)})]}),t.jsxs(se,{children:[t.jsx(g,{children:t.jsxs("div",{children:[t.jsx(f,{children:"핵심 내용"}),t.jsx(b,{children:"핵심 문장을 확인하고 필요하면 바로 수정하세요."})]})}),t.jsx(ie,{role:"list",children:l.length===0?t.jsx(pe,{children:"핵심 문장이 아직 없습니다. 아래 버튼으로 추가해 보세요."}):l.map((n,o)=>t.jsxs(le,{children:[t.jsx(ce,{value:n,onChange:x=>{const s=l.slice();s[o]=x.target.value,y(s)},placeholder:`핵심 내용 ${o+1}`}),t.jsx(de,{"aria-label":"delete",onClick:()=>y(l.filter((x,s)=>s!==o)),children:"✕"})]},o))}),t.jsx(xe,{children:t.jsx(k,{as:"button",onClick:()=>y([...l,""]),children:"항목 추가"})})]})]}),t.jsxs(j,{children:[t.jsx(g,{children:t.jsxs("div",{children:[t.jsx(f,{children:"설정"}),t.jsx(b,{children:"말투, 양식, 플랫폼을 선택하세요. 결과에 반영됩니다."})]})}),t.jsxs(C,{children:[t.jsx(A,{children:"말투(~체)"}),t.jsxs(I,{children:[t.jsx(a,{type:"button","data-active":m==="SEUMNIDA",onClick:()=>M("SEUMNIDA"),children:"~습니다"}),t.jsx(a,{type:"button","data-active":m==="YO",onClick:()=>M("YO"),children:"~요"})]})]}),t.jsxs(C,{children:[t.jsx(A,{children:"양식"}),t.jsxs(I,{children:[t.jsx(a,{type:"button","data-active":d==="STORY",onClick:()=>w("STORY"),children:"스토리텔링형"}),t.jsx(a,{type:"button","data-active":d==="LIST",onClick:()=>w("LIST"),children:"정보나열형"}),t.jsx(a,{type:"button","data-active":d==="PERFORMANCE",onClick:()=>w("PERFORMANCE"),children:"성과형"})]})]}),t.jsxs(C,{children:[t.jsx(A,{children:"플랫폼"}),t.jsxs(I,{children:[t.jsx(a,{type:"button","data-active":p==="INSTAGRAM",onClick:()=>v("INSTAGRAM"),children:"인스타그램"}),t.jsx(a,{type:"button","data-active":p==="NAVER_BLOG",onClick:()=>v("NAVER_BLOG"),children:"블로그"}),t.jsx(a,{type:"button","data-active":p==="KAKAO_CHANNEL",onClick:()=>v("KAKAO_CHANNEL"),children:"카카오 채널"})]})]})]}),p==="INSTAGRAM"&&t.jsxs(j,{children:[t.jsxs(g,{children:[t.jsxs("div",{children:[t.jsx(f,{children:"전송 프롬프트 (Instagram)"}),t.jsx(b,{children:"현재 설정이 반영된 프롬프트를 확인하고 복사할 수 있어요."})]}),t.jsxs("div",{style:{display:"flex",gap:8},children:[t.jsx(k,{as:"button",onClick:()=>Y(n=>!n),children:T?"접기":"펼쳐보기"}),t.jsx(k,{as:"button",onClick:()=>{const n=R();navigator.clipboard?.writeText(n).catch(()=>{})},children:"전체 복사"})]})]}),T&&t.jsx(he,{style:{maxHeight:480,overflow:"auto"},children:R()})]}),t.jsxs(me,{children:[t.jsx(O,{backSteps:1,label:"이전 단계"}),t.jsx(J,{as:"button",onClick:G,children:"다음 단계"})]}),P&&t.jsx(ge,{"aria-live":"polite",children:t.jsxs(fe,{children:[t.jsx(be,{children:"콘텐츠 마법을 준비 중… ✨"}),t.jsxs(je,{"data-variant":H%3+1,"aria-hidden":!0,children:[t.jsx("span",{children:"🪄"}),t.jsx("span",{children:"📚"}),t.jsx("span",{children:"🧠"}),t.jsx("span",{children:"🎈"}),t.jsx("span",{children:"🌟"}),t.jsx("span",{children:"🚀"})]}),t.jsx(ye,{children:t.jsx(ve,{})})]})})]})}const Q=r.header`
  display: grid;
  gap: 6px;
  margin-bottom: 18px;
`,ee=r.div`
  display: flex;
  align-items: center;
  gap: 12px;
`,te=r.h2`
  margin: 0;
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: ${({theme:e})=>e.colors.text};
`,re=r.p`
  margin: 0;
  font-size: 13px;
  color: ${({theme:e})=>e.colors.textMuted};
`,oe=r.div`
  display: grid;
  gap: 16px;
  align-items: stretch;
  grid-template-columns: 1fr;
  @media (min-width: 1080px) {
    grid-template-columns: 1.4fr 1fr;
  }
`,ne=r(j)`
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 16px;
  padding: 0;
  background: transparent;
  border: none;
  box-shadow: none;
  min-height: 0;
`,se=r(j)`
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
`,g=r.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`,f=r.h3`
  margin: 0;
  font-size: 18px;
  color: #0f172a;
  font-weight: 800;
`,b=r.p`
  margin: 4px 0 0;
  font-size: 13px;
  color: #475569;
`;r.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;r.span`
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
`;const ae=r.div`
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
`,N=r.div`
  display: grid;
  gap: 14px;
  font-size: 14px;
  line-height: 1.8;
  color: #1f2937;
  p { margin: 0; }
`,ie=r.div`
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
`,le=r.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid ${({theme:e})=>e.colors.border};
  background: ${({theme:e})=>e.colors.surfaceMuted};
`;r.span`
  flex: 1;
  font-size: 13px;
  color: ${({theme:e})=>e.colors.text};
`;const de=r.button`
  border: none;
  background: transparent;
  font-size: 16px;
  color: ${({theme:e})=>e.colors.textMuted};
  cursor: pointer;
  padding: 0 4px;
`;r.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;const ce=r.input`
  flex: 1;
  height: 40px;
  border-radius: 12px;
  border: 1px solid ${({theme:e})=>e.colors.border};
  padding: 0 12px;
  background: #fff;
  font-size: 13px;
  color: ${({theme:e})=>e.colors.text};
`;r.button`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 1px solid ${({theme:e})=>e.colors.border};
  background: ${({theme:e})=>e.colors.primarySurface};
  color: ${({theme:e})=>e.colors.primary};
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
`;const pe=r.div`
  display: grid;
  place-items: center;
  padding: 14px;
  border-radius: 12px;
  border: 1px dashed ${({theme:e})=>e.colors.border};
  font-size: 13px;
  color: ${({theme:e})=>e.colors.textMuted};
`,xe=r.div`
  display: flex;
  justify-content: flex-end;
`,A=r.div`
  margin: 2px 0 6px;
  font-size: 12px;
  font-weight: 700;
  color: ${({theme:e})=>e.colors.text};
`,he=r.pre`
  margin: 0;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid ${({theme:e})=>e.colors.border};
  background: #fff;
  color: ${({theme:e})=>e.colors.text};
  font-size: 12px;
  line-height: 1.65;
  white-space: pre-wrap;
`,C=r.div`
  display: grid;
  gap: 6px;
  &:not(:last-child){ margin-bottom: 10px; }
`,I=r.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`,a=r.button`
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
`,me=r.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
`,ue=r.div`
  display: flex; align-items: center; gap: 8px; margin-bottom: 8px; flex-wrap: wrap;
`,B=r.div`
  padding: 4px 10px; border-radius: 999px; border: 1px solid ${({theme:e})=>e.colors.border}; font-size: 12px; color: ${({theme:e})=>e.colors.textMuted};
  &[data-active='true']{ background: ${({theme:e})=>e.colors.primarySurface}; color: ${({theme:e})=>e.colors.primary}; border-color: ${({theme:e})=>e.colors.border}; font-weight: 800; }
  &[data-done='true']{ background: ${({theme:e})=>e.colors.surfaceMuted}; color: ${({theme:e})=>e.colors.text}; }
`,X=r.span`
  width: 10px; height: 1px; background: ${({theme:e})=>e.colors.border}; display: inline-block;
`,ge=r.div`
  position: fixed; inset: 0; z-index: 60;
  background: rgba(255,255,255,0.88);
  backdrop-filter: blur(2px);
  display: grid; place-items: center; pointer-events: none;
`,fe=r.div`
  width: min(480px, 92vw);
  border: 1px solid ${({theme:e})=>e.colors.border};
  border-radius: 16px; background: #fff; padding: 16px;
  display: grid; gap: 10px; justify-items: center; text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  animation: pop .22s ease-out;
  @keyframes pop { 0%{ transform: scale(.98); opacity:.2 } 100%{ transform: scale(1); opacity:1 } }
`,be=r.div`
  font-weight: 900; letter-spacing: -0.01em; color: ${({theme:e})=>e.colors.text};
`,je=r.div`
  position: relative; height: 52px; overflow: visible;
  span{ position: absolute; left: 50%; transform: translateX(-50%); font-size: 18px; opacity: 0; animation: float 950ms ease-in forwards; }
  span:nth-child(1){ transform: translateX(-140%); animation-delay: 0ms; }
  span:nth-child(2){ transform: translateX(-70%); animation-delay: 60ms; }
  span:nth-child(3){ transform: translateX(-0%); animation-delay: 120ms; }
  span:nth-child(4){ transform: translateX(70%); animation-delay: 180ms; }
  span:nth-child(5){ transform: translateX(140%); animation-delay: 240ms; }
  span:nth-child(6){ transform: translateX(0%); animation-delay: 300ms; }
  @keyframes float { 0%{ transform: translateY(10px) translateX(var(--x,0)); opacity:0 } 60%{ opacity:1 } 100%{ transform: translateY(-18px) translateX(var(--x,0)); opacity:0 } }
`,ye=r.div`
  width: 100%; height: 10px; border-radius: 999px; overflow: hidden;
  background: ${({theme:e})=>e.colors.surfaceMuted}; border: 1px solid ${({theme:e})=>e.colors.border};
`,ve=r.div`
  height: 100%; width: 0%; background: ${({theme:e})=>e.colors.primary}; animation: fill 950ms ease forwards;
  @keyframes fill { to { width: 100% } }
`;export{$e as default};
