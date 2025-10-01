import{f as k,z as v,u as z,r as i,j as r,l as j,d as e,S as b}from"./index-Cq8NHvix.js";const u=new Map;async function S(t,a){const p={items:t,language:a?.language,speechStyle:a?.speechStyle||"SEUMNIDA"},o=JSON.stringify({p}),d=u.get(o);if(d)return d;const n=k("/api/ai/first-summary",{method:"POST",body:JSON.stringify(p),timeoutMs:6e4}).finally(()=>{u.delete(o)});return u.set(o,n),await n}function U(){const{state:t}=v(),a=t?.items??[],p=t?.tone??"WARM_VIVID",o=t?.speechStyle??"SEUMNIDA",d=t?.platformChoice??"INSTAGRAM",n=z(),[m,l]=i.useState(8),[J,h]=i.useState(null),c=i.useRef(0),g=i.useRef(!1);return i.useEffect(()=>{if(!a.length){n("/marketing");return}if(g.current)return;g.current=!0,c.current=Date.now(),l(8),h(null);const y=window.setInterval(()=>{const s=Date.now()-c.current,x=Math.min(94,Math.floor(s/6200*94));l(f=>Math.max(f,x))},150);return(async()=>{try{const s=await S(a,{language:"ko",speechStyle:o}),x={from:s.from,to:s.to,summary:s.summary,bullets:s.bullets,tokensUsed:s.tokensUsed,rawJson:JSON.stringify(s)},f=Date.now()-c.current,w=Math.max(0,1200-f);window.setTimeout(()=>{l(100),n("/marketing/preview",{state:{items:a,summary:x,tone:p,speechStyle:o,platformChoice:d,from:"preview"}})},w)}catch(s){h(s?.message||"요약 생성에 실패했습니다. 잠시 후 다시 시도해 주세요.")}})(),()=>{g.current=!1,window.clearInterval(y)}},[a,n,d,o,p]),i.useMemo(()=>T(a.length),[a.length]),r.jsxs(j,{children:[r.jsxs(M,{children:[r.jsx(I,{children:r.jsx(N,{children:"🧠"})}),r.jsxs(P,{children:[r.jsx("h2",{children:"AI가 수업 내용을 분석하고 있습니다"}),r.jsx("p",{children:"잠시만 기다려주세요. 곧 멋진 마케팅 요약을 만들어드릴게요! ✨"})]}),r.jsxs(R,{children:[r.jsxs(A,{children:[r.jsx("span",{children:"전체 진행률"}),r.jsxs("strong",{children:[m,"%"]})]}),r.jsx(D,{children:r.jsx(E,{style:{width:`${m}%`}})})]})]}),null,null,null,null,null]})}const M=e.section`
  display: grid;
  justify-items: center;
  gap: 18px;
  padding: 48px 16px 12px;
  text-align: center;
`,I=e.div`
  width: 96px;
  height: 96px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: radial-gradient(circle at 50% 45%, #ffffff 0%, #f1f5ff 60%, rgba(241, 245, 255, 0.4) 100%);
  border: 1px solid rgba(148, 163, 184, 0.35);
  box-shadow: 0 24px 45px rgba(79, 70, 229, 0.18);
`,N=e.span`
  font-size: 38px;
`,P=e.div`
  display: grid;
  gap: 6px;
  max-width: 520px;
  h2 { margin: 0; font-size: 24px; font-weight: 800; color: #0f172a; }
  p { margin: 0; font-size: 14px; color: #475569; }
`,R=e.div`
  width: min(520px, 92%);
  display: grid;
  gap: 10px;
`,A=e.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: #475569;
  strong { font-size: 18px; font-weight: 800; color: #0f172a; }
`,D=e.div`
  width: 100%;
  height: 12px;
  border-radius: 999px;
  overflow: hidden;
  background: #e2e8f0;
  border: 1px solid rgba(203, 213, 225, 0.8);
`,E=e.div`
  height: 100%;
  background: linear-gradient(90deg, #111827, #6366f1);
  transition: width .25s ease;
`;e(b)`
  display: grid;
  gap: 16px;
  padding: 18px;
  border-radius: 18px;
  border: none;
  background: #ffffff;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.06);
`;e.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  h3 { margin: 0; font-size: 16px; color: #111827; }
  p { margin: 6px 0 0; font-size: 13px; color: #4b5563; }
`;e.span`
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  font-size: 20px;
  background: #eef2ff;
  color: #312e81;
`;e.div`
  display: flex;
  gap: 10px;
  align-items: center;
  border-radius: 14px;
  padding: 14px 16px;
  background: #f8fafc;
  color: #334155;
  font-size: 13px;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
  span:first-child { font-size: 16px; }
`;e.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 14px;
  padding: 6px 0;
`;e.div`
  display: grid;
  justify-items: center;
  gap: 10px;
  padding: 16px 10px 14px;
  border-radius: 20px;
  background: rgba(248, 250, 252, 0.82);
  border: 1px solid rgba(209, 213, 219, 0.6);
  transition: border-color .2s ease, background .2s ease, transform .2s ease;
  .dot {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    font-size: 18px;
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(203, 213, 225, 0.7);
    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
  }
  .label { font-size: 12px; color: #475569; text-align: center; }
  &[data-status='active'] {
    border-color: rgba(99, 102, 241, 0.45);
    background: rgba(99, 102, 241, 0.08);
    transform: translateY(-2px);
    .dot { border-color: rgba(99, 102, 241, 0.4); color: #4f46e5; box-shadow: 0 6px 18px rgba(79, 70, 229, 0.2); }
    .label { color: #312e81; font-weight: 700; }
  }
  &[data-status='done'] {
    border-color: rgba(34, 197, 94, 0.4);
    background: rgba(187, 247, 208, 0.22);
    .dot { border-color: rgba(34, 197, 94, 0.4); color: #15803d; }
    .label { color: #166534; font-weight: 600; }
  }
`;e(b)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 18px;
  border-radius: 18px;
  background: rgba(248, 250, 252, 0.9);
  border: none;
  span { font-size: 20px; }
  h4 { margin: 0; font-size: 14px; color: #0f172a; }
  p { margin: 4px 0 0; font-size: 13px; color: #475569; }
`;e.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
`;e(b)`
  display: grid;
  justify-items: center;
  gap: 4px;
  padding: 14px 10px;
  border-radius: 16px;
  background: #ffffff;
  border: none;
  .value { font-size: 22px; font-weight: 800; color: #111827; }
  .label { font-size: 12px; color: #64748b; }
`;e.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
  h5 { margin: 0; font-size: 13px; color: #1f2937; }
  span { font-size: 12px; color: #64748b; }
`;e.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 4px;
  color: ${({theme:t})=>t.colors.text};
  font-size: 13px;
`;e.div`
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
`;e.span`
  color: #b91c1c;
  font-size: 12px;
  margin-top: 8px;
`;function T(t){return t?t<3?"짧고 간결한 요약을 위해 핵심 문장을 다듬고 있어요.":t<6?"평균적으로 1시간 수업에서 학생들이 “이해했어요!”라고 말하는 횟수는 약 15회랍니다.":"수집한 수업 기록을 토대로 학부모에게 전할 이야기를 구성하고 있어요.":"아직 데이터를 불러오는 중입니다."}export{U as default};
