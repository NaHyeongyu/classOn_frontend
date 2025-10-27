import{j as r,d as s,f as E,G as N,r as a,u as B}from"./index-B0K7mn4q.js";import{P as M,j as w}from"./UI-Cj3YhchZ.js";import{t as z}from"./utils-D2trpR9j.js";function C({progress:e,error:t,helperText:c,onRetry:o,onBackToPreview:n}){return r.jsx(M,{children:r.jsxs(v,{children:[r.jsx(D,{children:r.jsx(H,{role:"img","aria-hidden":!0,children:"📝"})}),r.jsxs(R,{children:[r.jsx("h2",{children:"플랫폼 전용 캡션을 준비 중이에요"}),r.jsx("p",{children:"선택한 말투와 톤에 맞춰 문장을 다듬고 있어요."})]}),r.jsxs(O,{children:[r.jsxs(V,{children:[r.jsx("span",{children:"전체 진행률"}),r.jsxs("strong",{children:[e,"%"]})]}),r.jsx(L,{children:r.jsx(J,{style:{width:`${e}%`}})})]}),t?r.jsxs(_,{role:"alert",children:[r.jsx("p",{children:t}),r.jsxs(U,{children:[r.jsx(w,{as:"button",onClick:o,children:"다시 시도"}),r.jsx(w,{as:"button",onClick:n,children:"이전 단계로"})]})]}):r.jsx(K,{children:c})]})})}function G({onBackHome:e}){return r.jsx(M,{children:r.jsxs(v,{children:[r.jsxs(R,{children:[r.jsx("h2",{children:"선택된 데이터가 없습니다"}),r.jsx("p",{children:"마케팅 페이지에서 다시 수업과 기간을 선택해주세요."})]}),r.jsx(w,{as:"button",onClick:e,children:"마케팅 홈으로"})]})})}const v=s.section`
  display: grid;
  justify-items: center;
  gap: 18px;
  padding: 48px 16px 24px;
  text-align: center;
`,D=s.div`
  width: 96px;
  height: 96px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: radial-gradient(circle at 50% 45%, #ffffff 0%, #f1f5ff 60%, rgba(241, 245, 255, 0.4) 100%);
  border: 1px solid rgba(148, 163, 184, 0.35);
  box-shadow: 0 24px 45px rgba(79, 70, 229, 0.18);
`,H=s.span`
  font-size: 38px;
`,R=s.div`
  display: grid;
  gap: 6px;
  max-width: 520px;
  h2 { margin: 0; font-size: 24px; font-weight: 800; color: #0f172a; }
  p { margin: 0; font-size: 14px; color: #475569; }
`,O=s.div`
  width: min(520px, 92%);
  display: grid;
  gap: 10px;
`,V=s.div`
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
`,L=s.div`
  width: 100%;
  height: 12px;
  border-radius: 999px;
  overflow: hidden;
  background: #e2e8f0;
  border: 1px solid rgba(203, 213, 225, 0.8);
`,J=s.div`
  height: 100%;
  background: linear-gradient(90deg, #111827, #6366f1);
  transition: width 0.25s ease;
`,K=s.p`
  margin: 12px 0 0;
  font-size: 13px;
  color: #64748b;
`,_=s.div`
  display: grid;
  gap: 12px;
  width: min(520px, 92%);
  padding: 16px;
  border-radius: 16px;
  border: 1px solid rgba(248, 113, 113, 0.4);
  background: rgba(254, 226, 226, 0.4);
  color: #b91c1c;
  font-size: 13px;
`,U=s.div`
  display: flex;
  gap: 8px;
  justify-content: center;
`,y=new Map;async function W(e,t){const o={items:e,options:t,brief:t.brief?{direction:t.brief.direction,bullets:t.brief.bullets}:void 0},n=JSON.stringify({b:o}),l=y.get(n);if(l)return l;const d=E("/api/records/render",{method:"POST",body:JSON.stringify(o),timeoutMs:6e4}).finally(()=>{y.delete(n)});return y.set(n,d),await d}function $(){const{state:e}=N(),t=a.useMemo(()=>e?.items??[],[e?.items]),c=e?.tone??"WARM_VIVID",o=e?.speechStyle??"SEUMNIDA",n=e?.platformChoice??"INSTAGRAM",l=e?.direction??"",d=a.useMemo(()=>e?.bullets??[],[e?.bullets]),m=e?.formatStyle,g=B(),[S,f]=a.useState(10),[P,j]=a.useState(null),[T,I]=a.useState(0),b=a.useRef(0),i=a.useRef(null);a.useEffect(()=>{if(!t.length)return;let p=!1;b.current=Date.now(),f(10),j(null);const k=n==="INSTAGRAM"||n==="NAVER_BLOG"?n:null;if(k===null){g("/marketing/summary",{state:{...e,items:t,tone:c,speechStyle:o,platformChoice:n,direction:l,bullets:d,formatStyle:m}});return}return i.current=window.setInterval(()=>{const x=Date.now()-b.current,u=Math.min(96,Math.floor(x/5200*96));f(h=>u>h?u:h)},150),(async()=>{try{const x=await W(t,{platform:k,tone:c,speechStyle:o,brief:{direction:l,bullets:d}});if(p)return;i.current!==null&&(window.clearInterval(i.current),i.current=null);const u=Date.now()-b.current,h=Math.max(0,900-u);window.setTimeout(()=>{p||(f(100),g("/marketing/summary",{state:{...e,items:t,tone:c,speechStyle:o,platformChoice:n,direction:l,bullets:d,formatStyle:m,rendered:x},replace:!0}))},h)}catch(x){if(p)return;i.current!==null&&(window.clearInterval(i.current),i.current=null),f(u=>u<96?96:u),j(z(x,"플랫폼 전용 문장을 생성하지 못했습니다. 잠시 후 다시 시도해 주세요."))}})(),()=>{p=!0,i.current!==null&&(window.clearInterval(i.current),i.current=null)}},[t,g,n,o,c,l,d,m,e,T]);const A=a.useMemo(()=>n==="INSTAGRAM"?"인스타그램 캡션을 구성하는 중입니다…":"블로그용 글을 다듬고 있습니다…",[n]);return{items:t,progress:S,error:P,helperText:A,retry:()=>I(p=>p+1),goBackToPreview:()=>g("/marketing/preview",{state:e}),goHome:()=>g("/marketing")}}function X(){const e=$();return e.items.length?r.jsx(C,{progress:e.progress,error:e.error,helperText:e.helperText,onRetry:e.retry,onBackToPreview:e.goBackToPreview}):r.jsx(G,{onBackHome:e.goHome})}export{X as default};
