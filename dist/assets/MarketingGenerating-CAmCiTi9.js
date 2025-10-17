import{f as A,h as J,r as d,u as O,j as e,d as i}from"./index-Bf8ggjEf.js";import{P as S,j as x}from"./UI-27qTHgPb.js";import{t as P}from"./utils-BiUlBUyf.js";const m=new Map;async function R(o,s){const u={items:o,language:s?.language,speechStyle:s?.speechStyle||"SEUMNIDA"},a=JSON.stringify({p:u}),p=m.get(a);if(p)return p;const l=A("/api/ai/first-summary",{method:"POST",body:JSON.stringify(u),timeoutMs:6e4}).finally(()=>{m.delete(a)});return m.set(a,l),await l}function F(){const{state:o}=J(),s=d.useMemo(()=>o?.items??[],[o?.items]),u=o?.tone??"WARM_VIVID",a=o?.speechStyle??"SEUMNIDA",p=o?.platformChoice??"INSTAGRAM",l=O(),[y,g]=d.useState(8),[w,j]=d.useState(null),[M,I]=d.useState(0),f=d.useRef(0),c=d.useRef(null);function N(n){let t=0;for(let r=0;r<n.length;r++)t=(t<<5)-t+n.charCodeAt(r),t|=0;return Math.abs(t).toString(36)}const b=d.useMemo(()=>{const n=JSON.stringify({items:s,speechStyle:a});return`firstSummary:${N(n)}`},[s,a]);return d.useEffect(()=>{if(!s.length)return;let n=!1;try{const t=sessionStorage.getItem(b);if(t){const r=JSON.parse(t);return l("/marketing/preview",{state:{...o,items:s,summary:r,tone:u,speechStyle:a,platformChoice:p},replace:!0}),()=>{}}}catch{}return f.current=Date.now(),g(8),j(null),c.current=window.setInterval(()=>{const t=Date.now()-f.current,r=Math.min(94,Math.floor(t/6200*94));g(h=>r>h?r:h)},150),(async()=>{try{const t=await R(s,{language:"ko",speechStyle:a});if(n)return;const r={from:t.from,to:t.to,summary:t.summary,bullets:t.bullets,tokensUsed:t.tokensUsed,rawJson:JSON.stringify(t)};try{sessionStorage.setItem(b,JSON.stringify(r))}catch{}c.current!==null&&(window.clearInterval(c.current),c.current=null);const h=Date.now()-f.current,E=Math.max(0,900-h);window.setTimeout(()=>{n||(g(100),l("/marketing/preview",{state:{...o,items:s,summary:r,tone:u,speechStyle:a,platformChoice:p},replace:!0}))},E)}catch(t){if(n)return;c.current!==null&&(window.clearInterval(c.current),c.current=null),g(r=>r<96?96:r),j(P(t,"요약 생성에 실패했습니다. 잠시 후 다시 시도해 주세요."))}})(),()=>{n=!0,c.current!==null&&(window.clearInterval(c.current),c.current=null)}},[s,l,p,a,u,o,M]),s.length?e.jsx(S,{children:e.jsxs(k,{children:[e.jsx(z,{children:e.jsx(C,{role:"img","aria-hidden":!0,children:"🧠"})}),e.jsxs(v,{children:[e.jsx("h2",{children:"AI가 수업 내용을 분석하고 있습니다"}),e.jsx("p",{children:"잠시만 기다려주세요. 곧 마케팅 요약을 완성할게요."})]}),e.jsxs(D,{children:[e.jsxs(T,{children:[e.jsx("span",{children:"전체 진행률"}),e.jsxs("strong",{children:[y,"%"]})]}),e.jsx(U,{children:e.jsx(B,{style:{width:`${y}%`}})})]}),w?e.jsxs(K,{role:"alert",children:[e.jsx("p",{children:w}),e.jsxs(L,{children:[e.jsx(x,{as:"button",onClick:()=>I(n=>n+1),children:"다시 시도"}),e.jsx(x,{as:"button",onClick:()=>l("/marketing"),children:"마케팅 홈으로"})]})]}):e.jsxs(G,{children:["선택한 데이터 ",s.length,"건을 분석하는 중입니다…"]})]})}):e.jsx(S,{children:e.jsxs(k,{children:[e.jsxs(v,{children:[e.jsx("h2",{children:"선택된 데이터가 없습니다"}),e.jsx("p",{children:"마케팅 페이지에서 다시 수업과 기간을 선택해주세요."})]}),e.jsx(x,{as:"button",onClick:()=>l("/marketing"),children:"마케팅 홈으로"})]})})}const k=i.section`
  display: grid;
  justify-items: center;
  gap: 18px;
  padding: 48px 16px 24px;
  text-align: center;
`,z=i.div`
  width: 96px;
  height: 96px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: radial-gradient(circle at 50% 45%, #ffffff 0%, #f1f5ff 60%, rgba(241, 245, 255, 0.4) 100%);
  border: 1px solid rgba(148, 163, 184, 0.35);
  box-shadow: 0 24px 45px rgba(79, 70, 229, 0.18);
`,C=i.span`
  font-size: 38px;
`,v=i.div`
  display: grid;
  gap: 6px;
  max-width: 520px;
  h2 { margin: 0; font-size: 24px; font-weight: 800; color: #0f172a; }
  p { margin: 0; font-size: 14px; color: #475569; }
`,D=i.div`
  width: min(520px, 92%);
  display: grid;
  gap: 10px;
`,T=i.div`
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
`,U=i.div`
  width: 100%;
  height: 12px;
  border-radius: 999px;
  overflow: hidden;
  background: #e2e8f0;
  border: 1px solid rgba(203, 213, 225, 0.8);
`,B=i.div`
  height: 100%;
  background: linear-gradient(90deg, #111827, #6366f1);
  transition: width 0.25s ease;
`,G=i.p`
  margin: 12px 0 0;
  font-size: 13px;
  color: #64748b;
`,K=i.div`
  display: grid;
  gap: 12px;
  width: min(520px, 92%);
  padding: 16px;
  border-radius: 16px;
  border: 1px solid rgba(248, 113, 113, 0.4);
  background: rgba(254, 226, 226, 0.4);
  color: #b91c1c;
  font-size: 13px;
`,L=i.div`
  display: flex;
  gap: 8px;
  justify-content: center;
`;export{F as default};
