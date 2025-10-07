import{f as E,A,r as l,u as N,j as e,P as b,y as h,d as t}from"./index-DuqOyKVg.js";import{t as P}from"./utils-BiUlBUyf.js";const m=new Map;async function R(s,i){const p={items:s,language:i?.language,speechStyle:i?.speechStyle||"SEUMNIDA"},o=JSON.stringify({p}),u=m.get(o);if(u)return u;const a=E("/api/ai/first-summary",{method:"POST",body:JSON.stringify(p),timeoutMs:6e4}).finally(()=>{m.delete(o)});return m.set(o,a),await a}function H(){const{state:s}=A(),i=l.useMemo(()=>s?.items??[],[s?.items]),p=s?.tone??"WARM_VIVID",o=s?.speechStyle??"SEUMNIDA",u=s?.platformChoice??"INSTAGRAM",a=N(),[y,x]=l.useState(8),[w,j]=l.useState(null),[v,M]=l.useState(0),f=l.useRef(0),r=l.useRef(null);return l.useEffect(()=>{if(!i.length)return;let d=!1;return f.current=Date.now(),x(8),j(null),r.current=window.setInterval(()=>{const n=Date.now()-f.current,c=Math.min(94,Math.floor(n/6200*94));x(g=>c>g?c:g)},150),(async()=>{try{const n=await R(i,{language:"ko",speechStyle:o});if(d)return;const c={from:n.from,to:n.to,summary:n.summary,bullets:n.bullets,tokensUsed:n.tokensUsed,rawJson:JSON.stringify(n)};r.current!==null&&(window.clearInterval(r.current),r.current=null);const g=Date.now()-f.current,I=Math.max(0,900-g);window.setTimeout(()=>{d||(x(100),a("/marketing/preview",{state:{...s,items:i,summary:c,tone:p,speechStyle:o,platformChoice:u}}))},I)}catch(n){if(d)return;r.current!==null&&(window.clearInterval(r.current),r.current=null),x(c=>c<96?96:c),j(P(n,"요약 생성에 실패했습니다. 잠시 후 다시 시도해 주세요."))}})(),()=>{d=!0,r.current!==null&&(window.clearInterval(r.current),r.current=null)}},[i,a,u,o,p,s,v]),i.length?e.jsx(b,{children:e.jsxs(S,{children:[e.jsx(z,{children:e.jsx(C,{role:"img","aria-hidden":!0,children:"🧠"})}),e.jsxs(k,{children:[e.jsx("h2",{children:"AI가 수업 내용을 분석하고 있습니다"}),e.jsx("p",{children:"잠시만 기다려주세요. 곧 마케팅 요약을 완성할게요."})]}),e.jsxs(D,{children:[e.jsxs(T,{children:[e.jsx("span",{children:"전체 진행률"}),e.jsxs("strong",{children:[y,"%"]})]}),e.jsx(J,{children:e.jsx(O,{style:{width:`${y}%`}})})]}),w?e.jsxs(B,{role:"alert",children:[e.jsx("p",{children:w}),e.jsxs(G,{children:[e.jsx(h,{as:"button",onClick:()=>M(d=>d+1),children:"다시 시도"}),e.jsx(h,{as:"button",onClick:()=>a("/marketing"),children:"마케팅 홈으로"})]})]}):e.jsxs(U,{children:["선택한 데이터 ",i.length,"건을 분석하는 중입니다…"]})]})}):e.jsx(b,{children:e.jsxs(S,{children:[e.jsxs(k,{children:[e.jsx("h2",{children:"선택된 데이터가 없습니다"}),e.jsx("p",{children:"마케팅 페이지에서 다시 수업과 기간을 선택해주세요."})]}),e.jsx(h,{as:"button",onClick:()=>a("/marketing"),children:"마케팅 홈으로"})]})})}const S=t.section`
  display: grid;
  justify-items: center;
  gap: 18px;
  padding: 48px 16px 24px;
  text-align: center;
`,z=t.div`
  width: 96px;
  height: 96px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: radial-gradient(circle at 50% 45%, #ffffff 0%, #f1f5ff 60%, rgba(241, 245, 255, 0.4) 100%);
  border: 1px solid rgba(148, 163, 184, 0.35);
  box-shadow: 0 24px 45px rgba(79, 70, 229, 0.18);
`,C=t.span`
  font-size: 38px;
`,k=t.div`
  display: grid;
  gap: 6px;
  max-width: 520px;
  h2 { margin: 0; font-size: 24px; font-weight: 800; color: #0f172a; }
  p { margin: 0; font-size: 14px; color: #475569; }
`,D=t.div`
  width: min(520px, 92%);
  display: grid;
  gap: 10px;
`,T=t.div`
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
`,J=t.div`
  width: 100%;
  height: 12px;
  border-radius: 999px;
  overflow: hidden;
  background: #e2e8f0;
  border: 1px solid rgba(203, 213, 225, 0.8);
`,O=t.div`
  height: 100%;
  background: linear-gradient(90deg, #111827, #6366f1);
  transition: width 0.25s ease;
`,U=t.p`
  margin: 12px 0 0;
  font-size: 13px;
  color: #64748b;
`,B=t.div`
  display: grid;
  gap: 12px;
  width: min(520px, 92%);
  padding: 16px;
  border-radius: 16px;
  border: 1px solid rgba(248, 113, 113, 0.4);
  background: rgba(254, 226, 226, 0.4);
  color: #b91c1c;
  font-size: 13px;
`,G=t.div`
  display: flex;
  gap: 8px;
  justify-content: center;
`;export{H as default};
