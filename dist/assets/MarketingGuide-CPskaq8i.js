import{z as X,u as O,r as i,j as e,l as _,q as x,h as L,d as a,S as R}from"./index-B7CgKAvQ.js";const B={WARM_VIVID:"따뜻·생동",CONCISE_NEUTRAL:"담백·간결",TRUST_CALM:"차분·신뢰",UPBEAT_POSITIVE:"밝음·긍정"};function le(){const{state:k}=X(),l=k?.items??[],m=O(),[f,C]=i.useState(""),[n,d]=i.useState([]),[c,A]=i.useState("WARM_VIVID"),[p,u]=i.useState("SEUMNIDA"),[b,N]=i.useState("INSTAGRAM"),[T,E]=i.useState(!1),[I]=i.useState(()=>Math.floor(Math.random()*1e3)),z=l.length>0&&n.every(s=>s.trim().length>0)&&n.length>=2;function M(){E(!0),setTimeout(()=>{m("/marketing/preview",{state:{items:l,direction:f,bullets:n,tone:c,speechStyle:p,platformChoice:b}})},750)}return e.jsxs(_,{children:[e.jsxs(P,{children:[e.jsxs(Z,{children:[e.jsx(g,{"data-active":!0,children:"1. 작성 가이드"}),e.jsx(w,{}),e.jsx(g,{children:"2. 전송 미리보기"}),e.jsx(w,{}),e.jsx(g,{children:"3. 생성/편집"})]}),e.jsxs(F,{children:[e.jsxs(U,{children:[e.jsx("h1",{children:"콘텐츠 방향을 정리해 볼까요?"}),e.jsx("p",{children:"수업 기록을 바탕으로 마케팅에 활용할 핵심 포인트를 미리 준비해요."})]}),e.jsxs(V,{children:[e.jsxs(v,{children:["선택된 수업 ",l.length,"건"]}),e.jsxs(v,{children:["현재 톤 ",B[c]]})]})]})]}),e.jsxs(G,{children:[e.jsxs(D,{children:[e.jsxs(o,{children:[e.jsx("h2",{children:"작성 가이드 (선택)"}),e.jsx("p",{className:"hint",children:"콘텐츠 방향이나 강조할 메시지를 간단히 적어두면 다음 단계에서 참고해 드려요."}),e.jsx(H,{placeholder:"예) 다음 주에는 실습 비중을 늘리고, 아이들 참여 사진을 강조",value:f,onChange:s=>C(s.target.value),rows:5})]}),e.jsxs(o,{children:[e.jsx("h2",{children:"핵심 문장"}),e.jsx("p",{className:"hint",children:"2~3개가 적당해요. 학부모에게 전하고 싶은 문장을 적어주세요."}),e.jsxs(W,{children:[n.map((s,r)=>e.jsxs(K,{children:[e.jsxs("span",{className:"index",children:["#",r+1]}),e.jsx("input",{value:s,onChange:j=>{const t=[...n];t[r]=j.target.value,d(t)},placeholder:"핵심 문장을 입력하세요"}),e.jsx(x,{as:"button",onClick:()=>d(n.filter((j,t)=>t!==r)),children:"삭제"})]},r)),e.jsx(x,{as:"button",onClick:()=>d([...n,""]),children:"+ 항목 추가"})]})]})]}),e.jsxs(Y,{children:[e.jsxs(o,{children:[e.jsx("h2",{children:"플랫폼 선택"}),e.jsx("p",{className:"hint",children:"콘텐츠를 게시할 채널을 먼저 선택해주세요."}),e.jsx(q,{children:re.map(s=>e.jsxs(J,{"data-active":b===s.value,onClick:()=>N(s.value),children:[e.jsx("span",{className:"icon",role:"img","aria-label":s.name,children:s.icon}),e.jsx("strong",{children:s.name}),e.jsx("small",{children:s.desc})]},s.value))})]}),e.jsxs(o,{children:[e.jsx("h2",{children:"톤 & 문장 어미"}),e.jsx("p",{className:"hint",children:"말투와 어조를 설정하면 결과물에 그대로 반영돼요."}),e.jsx(y,{children:"톤"}),e.jsx(S,{children:te.map(s=>e.jsxs(h,{"data-active":c===s.value,onClick:()=>A(s.value),children:[e.jsx("span",{children:s.icon}),e.jsx("span",{children:s.label})]},s.value))}),e.jsx(y,{children:"문장 어미"}),e.jsxs(S,{children:[e.jsxs(h,{"data-active":p==="SEUMNIDA",onClick:()=>u("SEUMNIDA"),children:[e.jsx("span",{children:"🧑‍🏫"}),e.jsx("span",{children:"~습니다"})]}),e.jsxs(h,{"data-active":p==="YO",onClick:()=>u("YO"),children:[e.jsx("span",{children:"😊"}),e.jsx("span",{children:"~요"})]})]})]})]})]}),e.jsxs(Q,{children:[e.jsx(x,{as:"button",onClick:()=>m("/marketing"),children:"← 이전"}),e.jsx(L,{as:"button",onClick:M,disabled:!z,children:"다음 단계"})]}),T&&e.jsx($,{"aria-live":"polite",children:e.jsxs(ee,{children:[e.jsx(ae,{children:"두근두근! 다음 단계로 이동 중…"}),e.jsxs(se,{"data-variant":I%3+1,"aria-hidden":!0,children:[e.jsx("span",{children:"✨"}),e.jsx("span",{children:"📸"}),e.jsx("span",{children:"📝"}),e.jsx("span",{children:"🎉"}),e.jsx("span",{children:"🚀"}),e.jsx("span",{children:"💡"})]}),e.jsx(ne,{children:e.jsx(ie,{})})]})})]})}const P=a.header`
  display: grid;
  gap: 16px;
`,F=a.section`
  display: grid;
  gap: 12px;
  padding: 18px;
  border-radius: 18px;
  background: linear-gradient(135deg, rgba(248, 250, 252, 0.94), rgba(224, 231, 255, 0.8));
  border: 1px solid rgba(203, 213, 225, 0.4);
`,U=a.div`
  display: grid;
  gap: 4px;
  h1 { margin: 0; font-size: 24px; font-weight: 800; color: #111827; }
  p { margin: 0; font-size: 14px; color: #475569; }
`,V=a.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`,v=a.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  font-size: 12px;
  border-radius: 999px;
  background: rgba(99, 102, 241, 0.08);
  color: #4338ca;
  font-weight: 600;
`,G=a.div`
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  gap: 16px;
  align-items: start;
  @media (max-width: 1080px) {
    grid-template-columns: 1fr;
  }
`,D=a.div`
  display: grid;
  gap: 16px;
`,Y=a.div`
  display: grid;
  gap: 16px;
`,o=a(R)`
  display: grid;
  gap: 12px;
  padding: 18px;
  border-radius: 18px;
  border: none;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.05);
  h2 { margin: 0; font-size: 18px; color: #111827; }
  .hint { margin: 0; font-size: 13px; color: #64748b; }
`,H=a.textarea`
  width: 100%;
  border: 1px solid rgba(203, 213, 225, 0.8);
  border-radius: 14px;
  padding: 12px 14px;
  font-size: 13px;
  line-height: 1.7;
  resize: vertical;
  min-height: 120px;
`,W=a.div`
  display: grid;
  gap: 8px;
`,K=a.div`
  display: grid;
  grid-template-columns: 42px 1fr auto;
  gap: 10px;
  align-items: center;
  input {
    height: 42px;
    padding: 0 12px;
    border-radius: 12px;
    border: 1px solid rgba(203, 213, 225, 0.8);
    font-size: 13px;
  }
  .index {
    font-size: 12px;
    font-weight: 700;
    color: #6366f1;
    text-align: center;
  }
`,q=a.div`
  display: grid;
  gap: 10px;
`,J=a.button`
  display: grid;
  gap: 6px;
  padding: 14px;
  text-align: left;
  border-radius: 16px;
  border: 1px solid rgba(203, 213, 225, 0.7);
  background: #ffffff;
  cursor: pointer;
  transition: border-color 0.18s ease, box-shadow 0.18s ease, transform 0.1s ease;
  .icon { font-size: 20px; }
  strong { font-size: 14px; color: #111827; }
  small { font-size: 12px; color: #64748b; }
  &[data-active='true'] {
    border-color: #4f46e5;
    box-shadow: 0 12px 24px rgba(79, 70, 229, 0.18);
    transform: translateY(-2px);
  }
`,y=a.div`
  margin-top: 6px;
  font-size: 12px;
  font-weight: 700;
  color: #475569;
`,S=a.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`,h=a.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid rgba(203, 213, 225, 0.8);
  background: #ffffff;
  cursor: pointer;
  font-size: 13px;
  transition: border-color 0.18s ease, background 0.18s ease, transform 0.12s ease;
  span:first-child { font-size: 16px; }
  &[data-active='true'] {
    border-color: #6366f1;
    background: rgba(99, 102, 241, 0.12);
    transform: translateY(-1px);
  }
`,Q=a.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 18px;
`,Z=a.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`,g=a.div`
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid rgba(203, 213, 225, 0.8);
  font-size: 12px;
  color: #64748b;
  &[data-active='true'], &[data-active] {
    background: rgba(99, 102, 241, 0.16);
    color: #4338ca;
    font-weight: 700;
    border-color: rgba(99, 102, 241, 0.4);
  }
`,w=a.span`
  width: 12px;
  height: 1px;
  background: rgba(203, 213, 225, 0.8);
  display: inline-block;
`,$=a.div`
  position: fixed;
  inset: 0;
  z-index: 60;
  background: rgba(249, 250, 251, 0.85);
  backdrop-filter: blur(3px);
  display: grid;
  place-items: center;
  pointer-events: none;
`,ee=a.div`
  width: min(420px, 92vw);
  border: 1px solid rgba(203, 213, 225, 0.6);
  border-radius: 18px;
  background: #ffffff;
  padding: 18px;
  display: grid;
  gap: 12px;
  justify-items: center;
  text-align: center;
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.16);
  animation: pop .22s ease-out;
  @keyframes pop {
    0% { transform: scale(.96); opacity: .3; }
    100% { transform: scale(1); opacity: 1; }
  }
`,ae=a.div`
  font-weight: 900;
  letter-spacing: -0.01em;
  color: #1f2937;
`,se=a.div`
  position: relative;
  height: 52px;
  overflow: visible;
  span {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    font-size: 18px;
    opacity: 0;
    animation: float 900ms ease-in forwards;
  }
  span:nth-child(1) { transform: translateX(-140%); animation-delay: 0ms; }
  span:nth-child(2) { transform: translateX(-70%); animation-delay: 60ms; }
  span:nth-child(3) { transform: translateX(0%); animation-delay: 120ms; }
  span:nth-child(4) { transform: translateX(70%); animation-delay: 180ms; }
  span:nth-child(5) { transform: translateX(140%); animation-delay: 240ms; }
  span:nth-child(6) { transform: translateX(0%); animation-delay: 300ms; }
  @keyframes float {
    0% { transform: translateY(10px) translateX(var(--x, 0)); opacity: 0; }
    60% { opacity: 1; }
    100% { transform: translateY(-18px) translateX(var(--x, 0)); opacity: 0; }
  }
`,ne=a.div`
  width: 100%;
  height: 10px;
  border-radius: 999px;
  overflow: hidden;
  background: rgba(226, 232, 240, 0.7);
`,ie=a.div`
  height: 100%;
  width: 100%;
  background: linear-gradient(90deg, #6366f1, #22d3ee);
  animation: fill 900ms ease forwards;
  @keyframes fill {
    0% { transform: scaleX(0); transform-origin: left; }
    100% { transform: scaleX(1); transform-origin: left; }
  }
`,re=[{value:"INSTAGRAM",name:"인스타그램",icon:"📸",desc:"짧고 임팩트 있는 메시지"},{value:"NAVER_BLOG",name:"네이버 블로그",icon:"📝",desc:"길고 친절한 설명에 적합"},{value:"KAKAO_CHANNEL",name:"카카오 채널",icon:"💬",desc:"알림톡 · 채널 소식 전용"}],te=[{value:"WARM_VIVID",label:"따뜻·생동",icon:"☀️"},{value:"CONCISE_NEUTRAL",label:"담백·간결",icon:"📘"},{value:"TRUST_CALM",label:"차분·신뢰",icon:"🛡"},{value:"UPBEAT_POSITIVE",label:"밝음·긍정",icon:"🎈"}];export{le as default};
