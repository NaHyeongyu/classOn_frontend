import{e as k,u as y,g as S,r as $,j as e,l as g,a as h,q as d,S as b,s as f,d as s}from"./index-CeMlVP5a.js";import{g as j,b as G,S as I,r as M}from"./savedMarketing-C4WqSvSI.js";function H(){const{id:r}=k(),n=y(),{success:c,error:v}=S(),o=$.useMemo(()=>j().find(a=>a.id===r),[r]);if(!o&&r&&/^\d+$/.test(r)&&G(Number(r)).then(t=>{const a={id:String(t.id),platform:t.platform,speechStyle:t.speechStyle,tone:t.tone||void 0,title:t.title||void 0,body:t.body,tags:t.tags||[],createdAt:t.createdAt?new Date(t.createdAt).getTime():Date.now()};try{const p=j();if(!p.find(l=>l.id===a.id)){const l=[a,...p].slice(0,50);localStorage.setItem(I,JSON.stringify(l))}}catch{}}).catch(()=>{}),!o)return e.jsx(g,{children:e.jsxs(h,{children:[e.jsxs("div",{children:[e.jsx("h2",{children:"저장 내역 상세"}),e.jsx("p",{children:"항목을 찾을 수 없습니다."})]}),e.jsx(d,{as:"button",onClick:()=>n("/marketing/saved"),children:"목록"})]})});const i=o.tags?.join(" ")||"",x=new Date(o.createdAt).toLocaleString();return e.jsxs(g,{children:[e.jsxs(h,{children:[e.jsxs("div",{children:[e.jsx("h2",{children:"저장 내역 상세"}),e.jsxs("p",{children:[u(o.platform)," · ",x]})]}),e.jsxs("div",{style:{display:"flex",gap:12},children:[e.jsx(d,{as:"button",onClick:()=>n("/marketing/saved"),children:"목록"}),e.jsx(d,{as:"button",onClick:()=>{const t=[o.body,i].filter(Boolean).join(`

`);navigator.clipboard?.writeText(t).then(()=>c("복사되었습니다.")).catch(()=>v("복사 실패"))},children:"복사"}),e.jsx(d,{as:"button",onClick:()=>{M(o.id),n("/marketing/saved"),c("삭제했습니다.")},children:"삭제"})]})]}),e.jsxs(A,{children:[e.jsxs(b,{children:[e.jsx(f,{children:"저장한 캡션"}),e.jsxs(z,{children:[e.jsx(m,{children:u(o.platform)}),e.jsx(m,{children:x})]}),e.jsx(w,{children:"본문"}),e.jsx(T,{"aria-label":"body",children:o.body}),i?e.jsxs(e.Fragment,{children:[e.jsx(w,{children:"태그"}),e.jsx(P,{"aria-label":"tags",children:i})]}):null]}),e.jsxs(b,{children:[e.jsx(f,{children:"모바일 예시"}),e.jsx(E,{children:e.jsxs(N,{children:[e.jsxs(C,{children:[e.jsx(B,{}),e.jsx(D,{children:"our_academy"})]}),e.jsx(R,{role:"img","aria-label":"이미지 예시",children:e.jsx("span",{children:"미리보기"})}),e.jsxs(_,{children:[e.jsx("strong",{children:"our_academy"})," ",o.body,i?e.jsxs(e.Fragment,{children:[e.jsx("br",{}),e.jsx("span",{className:"tags",children:i})]}):null]})]})})]})]})]})}function u(r){return r==="INSTAGRAM"?"인스타그램":r==="NAVER_BLOG"?"블로그":"카카오 채널"}s.div`
  color: ${({theme:r})=>r.colors.textMuted}; font-size: 13px;
`;const A=s.div`
  display: grid; gap: 12px; grid-template-columns: 1fr; @media (min-width: 960px){ grid-template-columns: 2fr 1fr; }
`,z=s.div`
  display: flex; gap: 6px; flex-wrap: wrap; margin: 6px 0 10px;
`,m=s.span`
  display: inline-flex; align-items: center; height: 24px; padding: 0 10px; border-radius: 999px; border: 1px solid ${({theme:r})=>r.colors.border}; font-size: 12px; color: ${({theme:r})=>r.colors.text};
`,w=s.div`
  font-size: 12px; font-weight: 700; color: ${({theme:r})=>r.colors.textMuted}; margin: 6px 0 4px;
`,P=s.div`
  border: 1px solid ${({theme:r})=>r.colors.border}; border-radius: 10px; padding: 10px; background: #fff; font-size: 13px; color: ${({theme:r})=>r.colors.text};
`,T=s.pre`
  white-space: pre-wrap; word-break: break-word; border: 1px solid ${({theme:r})=>r.colors.border}; border-radius: 10px; padding: 10px; background: #fff; font-size: 13px; color: ${({theme:r})=>r.colors.text}; margin: 0;
`,E=s.div`
  display: grid; place-items: center; padding: 8px;
`,N=s.div`
  width: 360px; max-width: 100%; background: #fff; border: 1px solid ${({theme:r})=>r.colors.border}; border-radius: 18px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.08);
`,C=s.div`
  display: flex; align-items: center; gap: 8px; padding: 10px;
`,B=s.div`
  width: 28px; height: 28px; border-radius: 50%; background: ${({theme:r})=>r.colors.surfaceMuted}; border: 1px solid ${({theme:r})=>r.colors.border};
`,D=s.div`
  font-weight: 800; color: ${({theme:r})=>r.colors.text}; font-size: 13px;
`,R=s.div`
  position: relative; width: 100%; aspect-ratio: 4/5; background: #e5e7eb; display: grid; place-items: center; color: #6b7280;
  span{ font-size: 12px; padding: 4px 8px; background: rgba(255,255,255,0.7); border-radius: 8px; }
`,_=s.div`
  padding: 10px; font-size: 13px; line-height: 1.5; color: ${({theme:r})=>r.colors.text}; white-space: pre-wrap; word-break: break-word;
  strong{ margin-right: 6px; }
  .tags{ display: block; margin-top: 6px; color: ${({theme:r})=>r.colors.textMuted}; }
`;export{H as default};
