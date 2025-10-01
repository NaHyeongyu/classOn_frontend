import{z as K,r as d,u as V,j as t,l as U,q as k,S as j,h as Z,d as r}from"./index-BB2Wjh9A.js";import{B as W}from"./BackButton-B8mZX5Ky.js";function fe(){const{state:e}=K(),h=e?.items??[],z=e?.direction??"",L=e?.summary?.bullets??e?.bullets??[],[a,y]=d.useState(L),D=e?.tone??"WARM_VIVID",[u,R]=d.useState(e?.speechStyle??"SEUMNIDA"),P=V(),[p,S]=d.useState(e?.platformChoice??"INSTAGRAM"),[l,w]=d.useState(e?.formatStyle??"STORY"),[he,ue]=d.useState(!1),[T,_]=d.useState(!1);function H(){P("/marketing/rendering",{state:{items:h,direction:z,bullets:a,tone:D,speechStyle:u,platformChoice:p,formatStyle:l,summary:e?.summary}})}function G(n,o){const s=n.slice(0,6).map(c=>`• ${c.date}${c.courseTitle?` [${c.courseTitle}]`:""}: ${c.content||""}`),v=n.length>6?`
... (외 ${n.length-6}행)`:"",$=o&&o.trim()?o.trim():s.join(`
`)+v;return t.jsx(N,{children:t.jsx("p",{style:{whiteSpace:"pre-wrap"},children:$})})}function E(n){if(!n)return"";let o=n.replace(/[\r\n]+/g," ").trim();return o=o.replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g,"[REDACTED]"),o=o.replace(/(\+?\d{1,3}[- ]?)?(\d{2,4}[- ]?\d{3,4}[- ]?\d{4})/g,"[REDACTED]"),o}function Y(){const n=(h||[]).map(o=>o.date).filter(Boolean).sort();if(!n.length){const o=new Date().toISOString().slice(0,10);return{from:o,to:o}}return{from:n[0],to:n[n.length-1]}}function M(){const{from:n,to:o}=Y(),x=u==="YO"?"요체":"입니다체",s=l==="STORY"?"스토리텔링":l==="LIST"?"정보 나열":"성과 중심",v=["[시스템]","당신은 학원·교육 기관·체험 수업을 홍보하는 인스타그램 전문 마케터입니다.","목표는 학부모와 학생이 공감하고, 학원의 커리큘럼/활동을 자연스럽게 알리는 매력적인 인스타그램 캡션을 작성하는 것입니다.","출력은 반드시 한국어로 하세요."].join(`
`),$=["[지시사항]","1) 원본 데이터를 기반으로, 이번 기간의 수업을 날짜 나열이 아닌 **하나의 흐름**으로 정리하세요.","2) 글 구조:","   - 도입: 이번 달/기간 활동의 큰 주제","   - 본문: 핵심 활동 + 아이들의 반응/느낀 점","   - 마무리: 교육적 효과 + 학원/기관 소개 + 부드러운 안내 문장","3) 이모지는 적절하게 사용하세요 (SNS 친화적으로)","4) 해시태그는 8개.","5) 글 길이: 450~900자.","6) 아래 변수를 반영해 작성하세요.",`   - 말투 (tone_of_voice): \`${x}\``,"   - 톤 (content_style):","     • `스토리텔링`: 서사 중심, 에피소드처럼 전개","     • `정보 나열`: 활동을 간결하게 나열하며 정리","     • `성과 중심`: 아이들의 성취, 결과, 성장 포인트 강조",`     → 선택: \`${s}\``,"7) 사진 추천(5~10개): 각 항목에 “아이디어/주제”를 제안하세요. 과도한 연출보다 수업 현장감이 느껴지는 자연스러운 컷을 권장합니다. 아동 개인 식별 가능 요소(얼굴·명찰 등)는 노출하지 않도록 유의합니다.","8) 금지:","   - 날짜/시간표 나열","   - 가격/할인/과장된 광고 문구","","[출력 형식]","<캡션 시작>","(최종 인스타그램 캡션)","빈 줄 1개","#해시태그","빈 줄 1개","[사진 추천(5~10개)]","- 아이디어 1","- 아이디어 2","- 아이디어 3","- 아이디어 4","- 아이디어 5","<캡션 끝>"].join(`
`),c=(h||[]).map(g=>`- ${g.date}${g.courseTitle?` [${E(g.courseTitle)}]`:""}: ${E(g.content||"")}`),F=["[원본 데이터]",`기간: ${n} ~ ${o}`,c.join(`
`)].join(`
`);return[v,"",$,"",F].join(`
`)}return t.jsxs(U,{children:[t.jsxs(xe,{children:[t.jsx(B,{"data-active":!1,"data-done":!0,children:"1. 작성 가이드"}),t.jsx(O,{}),t.jsx(B,{"data-active":!0,children:"2. 전송 미리보기"}),t.jsx(O,{}),t.jsx(B,{"data-active":!1,children:"3. 생성/편집"})]}),t.jsxs(q,{children:[t.jsx(J,{children:t.jsx(Q,{children:"AI 요약 결과"})}),t.jsx(X,{children:"AI가 분석한 수업 내용을 바탕으로 마케팅 콘텐츠를 생성하세요."})]}),t.jsxs(ee,{children:[t.jsxs(te,{children:[t.jsx(m,{children:t.jsxs("div",{children:[t.jsx(f,{children:"AI 요약 내용"}),t.jsx(b,{children:"최근 수업 활동을 분석한 결과를 확인하고 핵심 문장을 검토하세요."})]})}),t.jsx(oe,{children:e?.summary?.summary?t.jsx(N,{children:t.jsx("p",{style:{whiteSpace:"pre-wrap"},children:e.summary.summary})}):G(h,z)})]}),t.jsxs(re,{children:[t.jsx(m,{children:t.jsxs("div",{children:[t.jsx(f,{children:"핵심 내용"}),t.jsx(b,{children:"핵심 문장을 확인하고 필요하면 바로 수정하세요."})]})}),t.jsx(ne,{role:"list",children:a.length===0?t.jsx(le,{children:"핵심 문장이 아직 없습니다. 아래 버튼으로 추가해 보세요."}):a.map((n,o)=>t.jsxs(se,{children:[t.jsx(ae,{value:n,onChange:x=>{const s=a.slice();s[o]=x.target.value,y(s)},placeholder:`핵심 내용 ${o+1}`}),t.jsx(ie,{"aria-label":"delete",onClick:()=>y(a.filter((x,s)=>s!==o)),children:"✕"})]},o))}),t.jsx(ce,{children:t.jsx(k,{as:"button",onClick:()=>y([...a,""]),children:"항목 추가"})})]})]}),t.jsxs(j,{children:[t.jsx(m,{children:t.jsxs("div",{children:[t.jsx(f,{children:"설정"}),t.jsx(b,{children:"말투, 양식, 플랫폼을 선택하세요. 결과에 반영됩니다."})]})}),t.jsxs(C,{children:[t.jsx(A,{children:"말투(~체)"}),t.jsxs(I,{children:[t.jsx(i,{type:"button","data-active":u==="SEUMNIDA",onClick:()=>R("SEUMNIDA"),children:"~습니다"}),t.jsx(i,{type:"button","data-active":u==="YO",onClick:()=>R("YO"),children:"~요"})]})]}),t.jsxs(C,{children:[t.jsx(A,{children:"양식"}),t.jsxs(I,{children:[t.jsx(i,{type:"button","data-active":l==="STORY",onClick:()=>w("STORY"),children:"스토리텔링형"}),t.jsx(i,{type:"button","data-active":l==="LIST",onClick:()=>w("LIST"),children:"정보나열형"}),t.jsx(i,{type:"button","data-active":l==="PERFORMANCE",onClick:()=>w("PERFORMANCE"),children:"성과형"})]})]}),t.jsxs(C,{children:[t.jsx(A,{children:"플랫폼"}),t.jsxs(I,{children:[t.jsx(i,{type:"button","data-active":p==="INSTAGRAM",onClick:()=>S("INSTAGRAM"),children:"인스타그램"}),t.jsx(i,{type:"button","data-active":p==="NAVER_BLOG",onClick:()=>S("NAVER_BLOG"),children:"블로그"}),t.jsx(i,{type:"button","data-active":p==="KAKAO_CHANNEL",onClick:()=>S("KAKAO_CHANNEL"),children:"카카오 채널"})]})]})]}),p==="INSTAGRAM"&&t.jsxs(j,{children:[t.jsxs(m,{children:[t.jsxs("div",{children:[t.jsx(f,{children:"전송 프롬프트 (Instagram)"}),t.jsx(b,{children:"현재 설정이 반영된 프롬프트를 확인하고 복사할 수 있어요."})]}),t.jsxs("div",{style:{display:"flex",gap:12},children:[t.jsx(k,{as:"button",onClick:()=>_(n=>!n),children:T?"접기":"펼쳐보기"}),t.jsx(k,{as:"button",onClick:()=>{const n=M();navigator.clipboard?.writeText(n).catch(()=>{})},children:"전체 복사"})]})]}),T&&t.jsx(de,{style:{maxHeight:480,overflow:"auto"},children:M()})]}),t.jsxs(pe,{children:[t.jsx(W,{backSteps:1,label:"이전 단계"}),t.jsx(Z,{as:"button",onClick:H,children:"다음 단계"})]})]})}const q=r.header`
  display: grid;
  gap: 6px;
  margin-bottom: 18px;
`,J=r.div`
  display: flex;
  align-items: center;
  gap: 12px;
`,Q=r.h2`
  margin: 0;
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: ${({theme:e})=>e.colors.text};
`,X=r.p`
  margin: 0;
  font-size: 13px;
  color: ${({theme:e})=>e.colors.textMuted};
`,ee=r.div`
  display: grid;
  gap: 16px;
  align-items: stretch;
  grid-template-columns: 1fr;
  @media (min-width: 1080px) {
    grid-template-columns: 1.4fr 1fr;
  }
`,te=r(j)`
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 16px;
  padding: 0;
  background: transparent;
  border: none;
  box-shadow: none;
  min-height: 0;
`,re=r(j)`
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
`,m=r.div`
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
`;const oe=r.div`
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
`,ne=r.div`
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
`,se=r.div`
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
`;const ie=r.button`
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
`;const ae=r.input`
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
`;const le=r.div`
  display: grid;
  place-items: center;
  padding: 14px;
  border-radius: 12px;
  border: 1px dashed ${({theme:e})=>e.colors.border};
  font-size: 13px;
  color: ${({theme:e})=>e.colors.textMuted};
`,ce=r.div`
  display: flex;
  justify-content: flex-end;
`,A=r.div`
  margin: 2px 0 6px;
  font-size: 12px;
  font-weight: 700;
  color: ${({theme:e})=>e.colors.text};
`,de=r.pre`
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
`,i=r.button`
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
`,pe=r.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
`,xe=r.div`
  display: flex; align-items: center; gap: 8px; margin-bottom: 8px; flex-wrap: wrap;
`,B=r.div`
  padding: 4px 10px; border-radius: 999px; border: 1px solid ${({theme:e})=>e.colors.border}; font-size: 12px; color: ${({theme:e})=>e.colors.textMuted};
  &[data-active='true']{ background: ${({theme:e})=>e.colors.primarySurface}; color: ${({theme:e})=>e.colors.primary}; border-color: ${({theme:e})=>e.colors.border}; font-weight: 800; }
  &[data-done='true']{ background: ${({theme:e})=>e.colors.surfaceMuted}; color: ${({theme:e})=>e.colors.text}; }
`,O=r.span`
  width: 10px; height: 1px; background: ${({theme:e})=>e.colors.border}; display: inline-block;
`;export{fe as default};
