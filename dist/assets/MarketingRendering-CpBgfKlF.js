import{f as E,h as P,r as o,u as T,j as e,d as s}from"./index-Bf8ggjEf.js";import{P as v,j}from"./UI-27qTHgPb.js";import{t as z}from"./utils-BiUlBUyf.js";const y=new Map;async function C(r,t){const c={items:r,options:t,brief:t.brief?{direction:t.brief.direction,bullets:t.brief.bullets}:void 0},n=JSON.stringify({b:c}),a=y.get(n);if(a)return a;const l=E("/api/records/render",{method:"POST",body:JSON.stringify(c),timeoutMs:6e4}).finally(()=>{y.delete(n)});return y.set(n,l),await l}function q(){const{state:r}=P(),t=o.useMemo(()=>r?.items??[],[r?.items]),p=r?.tone??"WARM_VIVID",c=r?.speechStyle??"SEUMNIDA",n=r?.platformChoice??"INSTAGRAM",a=r?.direction??"",l=o.useMemo(()=>r?.bullets??[],[r?.bullets]),m=r?.formatStyle,f=T(),[w,g]=o.useState(10),[M,S]=o.useState(null),[A,N]=o.useState(0),b=o.useRef(0),i=o.useRef(null);return o.useEffect(()=>{if(!t.length)return;let u=!1;b.current=Date.now(),g(10),S(null);const k=n==="INSTAGRAM"||n==="NAVER_BLOG"?n:null;if(k===null){f("/marketing/summary",{state:{...r,items:t,tone:p,speechStyle:c,platformChoice:n,direction:a,bullets:l,formatStyle:m}});return}return i.current=window.setInterval(()=>{const x=Date.now()-b.current,d=Math.min(96,Math.floor(x/5200*96));g(h=>d>h?d:h)},150),(async()=>{try{const x=await C(t,{platform:k,tone:p,speechStyle:c,brief:{direction:a,bullets:l}});if(u)return;i.current!==null&&(window.clearInterval(i.current),i.current=null);const d=Date.now()-b.current,h=Math.max(0,900-d);window.setTimeout(()=>{if(u)return;g(100),f("/marketing/summary",{state:{...r,items:t,tone:p,speechStyle:c,platformChoice:n,direction:a,bullets:l,formatStyle:m,rendered:x},replace:!0})},h)}catch(x){if(u)return;i.current!==null&&(window.clearInterval(i.current),i.current=null),g(d=>d<96?96:d),S(z(x,"플랫폼 전용 문장을 생성하지 못했습니다. 잠시 후 다시 시도해 주세요."))}})(),()=>{u=!0,i.current!==null&&(window.clearInterval(i.current),i.current=null)}},[t,f,n,c,p,a,l,m,r,A]),t.length?e.jsx(v,{children:e.jsxs(R,{children:[e.jsx(D,{children:e.jsx(G,{role:"img","aria-hidden":!0,children:"📝"})}),e.jsxs(I,{children:[e.jsx("h2",{children:"플랫폼 전용 캡션을 준비 중이에요"}),e.jsx("p",{children:"선택한 말투와 톤에 맞춰 문장을 다듬고 있어요."})]}),e.jsxs(O,{children:[e.jsxs(B,{children:[e.jsx("span",{children:"전체 진행률"}),e.jsxs("strong",{children:[w,"%"]})]}),e.jsx(L,{children:e.jsx(V,{style:{width:`${w}%`}})})]}),M?e.jsxs(H,{role:"alert",children:[e.jsx("p",{children:M}),e.jsxs(K,{children:[e.jsx(j,{as:"button",onClick:()=>N(u=>u+1),children:"다시 시도"}),e.jsx(j,{as:"button",onClick:()=>f("/marketing/preview",{state:r}),children:"이전 단계로"})]})]}):e.jsx(J,{children:n==="INSTAGRAM"?"인스타그램 캡션을 구성하는 중입니다…":"블로그용 글을 다듬고 있습니다…"})]})}):e.jsx(v,{children:e.jsxs(R,{children:[e.jsxs(I,{children:[e.jsx("h2",{children:"선택된 데이터가 없습니다"}),e.jsx("p",{children:"마케팅 페이지에서 다시 수업과 기간을 선택해주세요."})]}),e.jsx(j,{as:"button",onClick:()=>f("/marketing"),children:"마케팅 홈으로"})]})})}const R=s.section`
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
`,G=s.span`
  font-size: 38px;
`,I=s.div`
  display: grid;
  gap: 6px;
  max-width: 520px;
  h2 { margin: 0; font-size: 24px; font-weight: 800; color: #0f172a; }
  p { margin: 0; font-size: 14px; color: #475569; }
`,O=s.div`
  width: min(520px, 92%);
  display: grid;
  gap: 10px;
`,B=s.div`
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
`,V=s.div`
  height: 100%;
  background: linear-gradient(90deg, #111827, #6366f1);
  transition: width 0.25s ease;
`,J=s.p`
  margin: 12px 0 0;
  font-size: 13px;
  color: #64748b;
`,H=s.div`
  display: grid;
  gap: 12px;
  width: min(520px, 92%);
  padding: 16px;
  border-radius: 16px;
  border: 1px solid rgba(248, 113, 113, 0.4);
  background: rgba(254, 226, 226, 0.4);
  color: #b91c1c;
  font-size: 13px;
`,K=s.div`
  display: flex;
  gap: 8px;
  justify-content: center;
`;export{q as default};
