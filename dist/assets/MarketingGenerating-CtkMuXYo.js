import{j as e,d as a,f as R,G as A,r as g,u as C}from"./index-B0K7mn4q.js";import{P as b,j}from"./UI-Cj3YhchZ.js";import{t as J}from"./utils-D2trpR9j.js";function O({itemsCount:t,progress:r,error:n,onRetry:o,onBackHome:l}){return e.jsx(b,{children:e.jsxs(S,{children:[e.jsx(G,{children:e.jsx(H,{role:"img","aria-hidden":!0,children:"🧠"})}),e.jsxs(k,{children:[e.jsx("h2",{children:"AI가 수업 내용을 분석하고 있습니다"}),e.jsx("p",{children:"잠시만 기다려주세요. 곧 마케팅 요약을 완성할게요."})]}),e.jsxs(B,{children:[e.jsxs(D,{children:[e.jsx("span",{children:"전체 진행률"}),e.jsxs("strong",{children:[r,"%"]})]}),e.jsx(T,{children:e.jsx(U,{style:{width:`${r}%`}})})]}),n?e.jsxs(K,{role:"alert",children:[e.jsx("p",{children:n}),e.jsxs(L,{children:[e.jsx(j,{as:"button",onClick:o,children:"다시 시도"}),e.jsx(j,{as:"button",onClick:l,children:"마케팅 홈으로"})]})]}):e.jsxs(V,{children:["선택한 데이터 ",t,"건을 분석하는 중입니다…"]})]})})}function z({onBackHome:t}){return e.jsx(b,{children:e.jsxs(S,{children:[e.jsxs(k,{children:[e.jsx("h2",{children:"선택된 데이터가 없습니다"}),e.jsx("p",{children:"마케팅 페이지에서 다시 수업과 기간을 선택해주세요."})]}),e.jsx(j,{as:"button",onClick:t,children:"마케팅 홈으로"})]})})}const S=a.section`
  display: grid;
  justify-items: center;
  gap: 18px;
  padding: 48px 16px 24px;
  text-align: center;
`,G=a.div`
  width: 96px;
  height: 96px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: radial-gradient(circle at 50% 45%, #ffffff 0%, #f1f5ff 60%, rgba(241, 245, 255, 0.4) 100%);
  border: 1px solid rgba(148, 163, 184, 0.35);
  box-shadow: 0 24px 45px rgba(79, 70, 229, 0.18);
`,H=a.span`
  font-size: 38px;
`,k=a.div`
  display: grid;
  gap: 6px;
  max-width: 520px;
  h2 { margin: 0; font-size: 24px; font-weight: 800; color: #0f172a; }
  p { margin: 0; font-size: 14px; color: #475569; }
`,B=a.div`
  width: min(520px, 92%);
  display: grid;
  gap: 10px;
`,D=a.div`
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
`,T=a.div`
  width: 100%;
  height: 12px;
  border-radius: 999px;
  overflow: hidden;
  background: #e2e8f0;
  border: 1px solid rgba(203, 213, 225, 0.8);
`,U=a.div`
  height: 100%;
  background: linear-gradient(90deg, #111827, #6366f1);
  transition: width 0.25s ease;
`,V=a.p`
  margin: 12px 0 0;
  font-size: 13px;
  color: #64748b;
`,K=a.div`
  display: grid;
  gap: 12px;
  width: min(520px, 92%);
  padding: 16px;
  border-radius: 16px;
  border: 1px solid rgba(248, 113, 113, 0.4);
  background: rgba(254, 226, 226, 0.4);
  color: #b91c1c;
  font-size: 13px;
`,L=a.div`
  display: flex;
  gap: 8px;
  justify-content: center;
`,y=new Map;async function $(t,r){const n={items:t,language:r?.language,speechStyle:r?.speechStyle||"SEUMNIDA"},o=JSON.stringify({p:n}),l=y.get(o);if(l)return l;const p=R("/api/ai/first-summary",{method:"POST",body:JSON.stringify(n),timeoutMs:6e4}).finally(()=>{y.delete(o)});return y.set(o,p),await p}function F(t){let r=0;for(let n=0;n<t.length;n++)r=(r<<5)-r+t.charCodeAt(n),r|=0;return Math.abs(r).toString(36)}function W(){const{state:t}=A(),r=g.useMemo(()=>t?.items??[],[t?.items]),n=t?.tone??"WARM_VIVID",o=t?.speechStyle??"SEUMNIDA",l=t?.platformChoice??"INSTAGRAM",p=C(),[v,h]=g.useState(8),[M,w]=g.useState(null),[I,N]=g.useState(0),m=g.useRef(0),c=g.useRef(null),x=g.useMemo(()=>{const u=JSON.stringify({items:r,speechStyle:o});return`firstSummary:${F(u)}`},[r,o]);return g.useEffect(()=>{if(!r.length)return;let u=!1;try{const s=sessionStorage.getItem(x);if(s){const d=JSON.parse(s);p("/marketing/preview",{state:{...t,items:r,summary:d,tone:n,speechStyle:o,platformChoice:l},replace:!0});return}}catch{}return m.current=Date.now(),h(8),w(null),c.current=window.setInterval(()=>{const s=Date.now()-m.current,d=Math.min(94,Math.floor(s/6200*94));h(f=>d>f?d:f)},150),(async()=>{try{const s=await $(r,{language:"ko",speechStyle:o});if(u)return;const d=(s.directions??[]).map(i=>({title:i.title?.trim()||void 0,because:i.because?.trim()||void 0,hook:i.hook?.trim()||void 0,asset:i.asset?.trim()||void 0,platform:i.platform?.trim()||void 0})).filter(i=>!!(i.title||i.because||i.hook||i.asset||i.platform)),f={from:s.from,to:s.to,summary:s.summary,bullets:s.bullets,directions:d,tokensUsed:s.tokensUsed,rawJson:JSON.stringify(s)};try{sessionStorage.setItem(x,JSON.stringify(f))}catch{}c.current!==null&&(window.clearInterval(c.current),c.current=null);const P=Date.now()-m.current,E=Math.max(0,900-P);window.setTimeout(()=>{u||(h(100),p("/marketing/preview",{state:{...t,items:r,summary:f,tone:n,speechStyle:o,platformChoice:l},replace:!0}))},E)}catch(s){if(u)return;c.current!==null&&(window.clearInterval(c.current),c.current=null),h(d=>d<96?96:d),w(J(s,"요약 생성에 실패했습니다. 잠시 후 다시 시도해 주세요."))}})(),()=>{u=!0,c.current!==null&&(window.clearInterval(c.current),c.current=null)}},[r,p,l,o,n,t,I,x]),{items:r,tone:n,speechStyle:o,platformChoice:l,progress:v,error:M,retry:()=>N(u=>u+1),goHome:()=>p("/marketing")}}function X(){const t=W();return t.items.length?e.jsx(O,{itemsCount:t.items.length,progress:t.progress,error:t.error,onRetry:t.retry,onBackHome:t.goHome}):e.jsx(z,{onBackHome:t.goHome})}export{X as default};
