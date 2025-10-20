import{h as R,r as c,u as z,j as e,d as n}from"./index-B92ulgNv.js";import{P as b,j as f}from"./UI-ktOMpaj3.js";import{f as A}from"./firstSummary-CYKEpxKZ.js";import{t as C}from"./utils-BiUlBUyf.js";function $(){const{state:a}=R(),o=c.useMemo(()=>a?.items??[],[a?.items]),g=a?.tone??"WARM_VIVID",l=a?.speechStyle??"SEUMNIDA",h=a?.platformChoice??"INSTAGRAM",d=z(),[m,p]=c.useState(8),[y,j]=c.useState(null),[v,I]=c.useState(0),x=c.useRef(0),i=c.useRef(null);function M(s){let r=0;for(let t=0;t<s.length;t++)r=(r<<5)-r+s.charCodeAt(t),r|=0;return Math.abs(r).toString(36)}const w=c.useMemo(()=>{const s=JSON.stringify({items:o,speechStyle:l});return`firstSummary:${M(s)}`},[o,l]);return c.useEffect(()=>{if(!o.length)return;let s=!1;try{const r=sessionStorage.getItem(w);if(r){const t=JSON.parse(r);return d("/marketing/preview",{state:{...a,items:o,summary:t,tone:g,speechStyle:l,platformChoice:h},replace:!0}),()=>{}}}catch{}return x.current=Date.now(),p(8),j(null),i.current=window.setInterval(()=>{const r=Date.now()-x.current,t=Math.min(94,Math.floor(r/6200*94));p(u=>t>u?t:u)},150),(async()=>{try{const r=await A(o,{language:"ko",speechStyle:l});if(s)return;const t={from:r.from,to:r.to,summary:r.summary,bullets:r.bullets,tokensUsed:r.tokensUsed,rawJson:JSON.stringify(r)};try{sessionStorage.setItem(w,JSON.stringify(t))}catch{}i.current!==null&&(window.clearInterval(i.current),i.current=null);const u=Date.now()-x.current,E=Math.max(0,900-u);window.setTimeout(()=>{s||(p(100),d("/marketing/preview",{state:{...a,items:o,summary:t,tone:g,speechStyle:l,platformChoice:h},replace:!0}))},E)}catch(r){if(s)return;i.current!==null&&(window.clearInterval(i.current),i.current=null),p(t=>t<96?96:t),j(C(r,"요약 생성에 실패했습니다. 잠시 후 다시 시도해 주세요."))}})(),()=>{s=!0,i.current!==null&&(window.clearInterval(i.current),i.current=null)}},[o,d,h,l,g,a,v]),o.length?e.jsx(b,{children:e.jsxs(S,{children:[e.jsx(N,{children:e.jsx(P,{role:"img","aria-hidden":!0,children:"🧠"})}),e.jsxs(k,{children:[e.jsx("h2",{children:"AI가 수업 내용을 분석하고 있습니다"}),e.jsx("p",{children:"잠시만 기다려주세요. 곧 마케팅 요약을 완성할게요."})]}),e.jsxs(D,{children:[e.jsxs(J,{children:[e.jsx("span",{children:"전체 진행률"}),e.jsxs("strong",{children:[m,"%"]})]}),e.jsx(T,{children:e.jsx(O,{style:{width:`${m}%`}})})]}),y?e.jsxs(G,{role:"alert",children:[e.jsx("p",{children:y}),e.jsxs(K,{children:[e.jsx(f,{as:"button",onClick:()=>I(s=>s+1),children:"다시 시도"}),e.jsx(f,{as:"button",onClick:()=>d("/marketing"),children:"마케팅 홈으로"})]})]}):e.jsxs(B,{children:["선택한 데이터 ",o.length,"건을 분석하는 중입니다…"]})]})}):e.jsx(b,{children:e.jsxs(S,{children:[e.jsxs(k,{children:[e.jsx("h2",{children:"선택된 데이터가 없습니다"}),e.jsx("p",{children:"마케팅 페이지에서 다시 수업과 기간을 선택해주세요."})]}),e.jsx(f,{as:"button",onClick:()=>d("/marketing"),children:"마케팅 홈으로"})]})})}const S=n.section`
  display: grid;
  justify-items: center;
  gap: 18px;
  padding: 48px 16px 24px;
  text-align: center;
`,N=n.div`
  width: 96px;
  height: 96px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: radial-gradient(circle at 50% 45%, #ffffff 0%, #f1f5ff 60%, rgba(241, 245, 255, 0.4) 100%);
  border: 1px solid rgba(148, 163, 184, 0.35);
  box-shadow: 0 24px 45px rgba(79, 70, 229, 0.18);
`,P=n.span`
  font-size: 38px;
`,k=n.div`
  display: grid;
  gap: 6px;
  max-width: 520px;
  h2 { margin: 0; font-size: 24px; font-weight: 800; color: #0f172a; }
  p { margin: 0; font-size: 14px; color: #475569; }
`,D=n.div`
  width: min(520px, 92%);
  display: grid;
  gap: 10px;
`,J=n.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: #475569;
  strong {
    font-size: 18px;
    font-weight: 800;
    color: #0f172a;
  }
`,T=n.div`
  width: 100%;
  height: 12px;
  border-radius: 999px;
  overflow: hidden;
  background: #e2e8f0;
  border: 1px solid rgba(203, 213, 225, 0.8);
`,O=n.div`
  height: 100%;
  background: linear-gradient(90deg, #111827, #6366f1);
  transition: width 0.25s ease;
`,B=n.p`
  margin: 12px 0 0;
  font-size: 13px;
  color: #64748b;
`,G=n.div`
  display: grid;
  gap: 12px;
  width: min(520px, 92%);
  padding: 16px;
  border-radius: 16px;
  border: 1px solid rgba(248, 113, 113, 0.4);
  background: rgba(254, 226, 226, 0.4);
  color: #b91c1c;
  font-size: 13px;
`,K=n.div`
  display: flex;
  gap: 8px;
  justify-content: center;
`;export{$ as default};
