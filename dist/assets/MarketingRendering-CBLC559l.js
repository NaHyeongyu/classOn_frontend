import{f as S,z as v,u as M,r as l,j as t,l as R,d as r}from"./index-Da2dCk2M.js";const T={},h=new Map;async function _(e,s){const c=Number(T?.VITE_RENDER_TIMEOUT_MS??6e4),i={items:e,options:s,brief:s.brief?{direction:s.brief.direction,bullets:s.brief.bullets}:void 0},n=JSON.stringify({b:i}),o=h.get(n);if(o)return o;const a=S("/api/records/render",{method:"POST",body:JSON.stringify(i),timeoutMs:c}).finally(()=>{h.delete(n)});return h.set(n,a),await a}function V(){const{state:e}=v(),s=e?.items??[],c=e?.tone??"WARM_VIVID",i=e?.speechStyle??"SEUMNIDA",n=e?.platformChoice??"INSTAGRAM",o=e?.direction||"",a=e?.bullets||[],p=M(),[y,f]=l.useState(10),[P,b]=l.useState(null),g=l.useRef(0),m=l.useRef(!1);return l.useEffect(()=>{if(!s.length){p("/marketing");return}if(m.current)return;m.current=!0,g.current=Date.now(),f(10),b(null);const w=window.setInterval(()=>{const d=Date.now()-g.current,x=Math.min(96,Math.floor(d/5200*96));f(u=>Math.max(u,x))},150);return(async()=>{try{const d=n==="INSTAGRAM"?"INSTAGRAM":n==="NAVER_BLOG"?"NAVER_BLOG":null;if(d){const x=await _(s,{platform:d,tone:c,speechStyle:i,brief:{direction:o,bullets:a}}),u=Date.now()-g.current,j=Math.max(0,900-u);window.setTimeout(()=>{f(100),p("/marketing/summary",{state:{items:s,direction:o,bullets:a,tone:c,speechStyle:i,platformChoice:n,formatStyle:e?.formatStyle,rendered:x,summary:e?.summary,from:"rendering"}})},j);return}p("/marketing/summary",{state:{items:s,direction:o,bullets:a,tone:c,speechStyle:i,platformChoice:n,formatStyle:e?.formatStyle,summary:e?.summary,from:"rendering"}})}catch(d){b(d?.message||"생성 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.")}})(),()=>{m.current=!1,window.clearInterval(w)}},[s,p,n,i,c,o,a,e?.formatStyle,e?.summary]),t.jsxs(R,{children:[t.jsxs(E,{children:[t.jsx(I,{children:t.jsx("span",{children:"📝"})}),t.jsxs(N,{children:[t.jsx("h2",{children:"플랫폼 전용 캡션을 준비 중이에요"}),t.jsx("p",{children:"선택한 말투·양식·플랫폼에 맞게 AI가 문장을 다듬고 있어요."})]}),t.jsxs(A,{children:[t.jsxs(k,{children:[t.jsx("span",{children:"전체 진행률"}),t.jsxs("strong",{children:[y,"%"]})]}),t.jsx(z,{children:t.jsx(O,{style:{width:`${y}%`}})})]})]}),null]})}const E=r.section`
  display: grid; justify-items: center; gap: 18px; padding: 48px 16px 12px; text-align: center;
`,I=r.div`
  width: 96px; height: 96px; border-radius: 999px; display: grid; place-items: center;
  background: radial-gradient(circle at 50% 45%, #ffffff 0%, #f1f5ff 60%, rgba(241, 245, 255, 0.4) 100%);
  border: 1px solid rgba(148, 163, 184, 0.35);
  box-shadow: 0 24px 45px rgba(79, 70, 229, 0.18);
  span{ font-size: 38px; }
`,N=r.div`
  display: grid; gap: 6px; max-width: 520px;
  h2 { margin: 0; font-size: 24px; font-weight: 800; color: #0f172a; }
  p { margin: 0; font-size: 14px; color: #475569; }
`,A=r.div`
  width: min(520px, 92%); display: grid; gap: 10px;
`,k=r.div`
  display: flex; align-items: center; justify-content: space-between; font-size: 12px; color: #475569;
  strong { font-size: 18px; font-weight: 800; color: #0f172a; }
`,z=r.div`
  width: 100%; height: 12px; border-radius: 999px; overflow: hidden; background: #e2e8f0; border: 1px solid rgba(203, 213, 225, 0.8);
`,O=r.div`
  height: 100%; background: linear-gradient(90deg, #111827, #6366f1); transition: width .25s ease;
`;r.div`
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;
  h5 { margin: 0; font-size: 13px; color: #1f2937; }
  span { font-size: 12px; color: #64748b; }
`;r.ul`
  list-style: none; margin: 0; padding: 0; display: grid; gap: 4px; color: ${({theme:e})=>e.colors.text}; font-size: 13px;
`;r.div`
  margin-top: 12px; display: flex; justify-content: flex-end;
`;r.span`
  color: #b91c1c; font-size: 12px; margin-top: 8px;
`;export{V as default};
