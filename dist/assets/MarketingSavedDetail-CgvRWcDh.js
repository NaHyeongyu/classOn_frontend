import{a as I,u as M,b as R,r as p,j as e,d as s}from"./index-CyW3XeFu.js";import{P as f,b as m,j as c,S as u,i as b}from"./UI-evna17pR.js";import{g as y,b as D,r as P,S as T}from"./savedMarketing-BASlNGy4.js";import{d as E}from"./format-Do6vjlY3.js";import{u as z}from"./useConfirmDialog-BAuS9Lmd.js";import"./ConfirmDialog-Ba2sBuvj.js";function ee(){const{id:r}=I(),a=M(),{success:d,error:l}=R(),{confirm:k,dialog:S}=z({confirmLabel:"삭제",cancelLabel:"취소",tone:"danger"}),A=p.useMemo(()=>y().find(o=>o.id===r)??null,[r]),[t,$]=p.useState(A);async function G(){!t||!await k({title:"이 항목을 삭제할까요?",message:"저장된 캡션이 삭제되며 되돌릴 수 없습니다."})||(P(t.id),d("삭제했습니다."),a("/marketing/saved"))}if(p.useEffect(()=>{if(t||!r||!/^\d+$/.test(r))return;let i=!1;return(async()=>{try{const o=await D(Number(r));if(i)return;const h={id:String(o.id),createdAt:o.createdAt?new Date(o.createdAt).getTime():Date.now(),platform:o.platform,speechStyle:o.speechStyle,tone:o.tone??void 0,title:o.title??void 0,body:o.body,tags:Array.isArray(o.tags)?o.tags:[]};C(h),$(h)}catch{}})(),()=>{i=!0}},[r,t]),!t)return e.jsx(f,{children:e.jsxs(m,{children:[e.jsxs("div",{children:[e.jsx("h2",{children:"저장 내역 상세"}),e.jsx("p",{children:"항목을 찾을 수 없습니다."})]}),e.jsx(c,{as:"button",onClick:()=>a("/marketing/saved"),children:"목록으로"})]})});const n=t.tags.join(" "),x=E(t.createdAt,{includeWeekday:!0}),g=x==="—"?new Date(t.createdAt).toLocaleString("ko-KR",{hour12:!1}):x;return e.jsxs(f,{children:[S,e.jsxs(m,{children:[e.jsxs("div",{children:[e.jsx("h2",{children:"저장 내역 상세"}),e.jsxs("p",{children:[j(t.platform)," · ",g]})]}),e.jsxs("div",{style:{display:"flex",gap:12},children:[e.jsx(c,{as:"button",onClick:()=>a("/marketing/saved"),children:"목록"}),e.jsx(c,{as:"button",onClick:()=>{const i=[t.body,n].filter(Boolean).join(`

`);navigator.clipboard?.writeText(i).then(()=>d("복사되었습니다.")).catch(()=>l("복사에 실패했습니다."))},children:"복사"}),e.jsx(c,{as:"button","data-variant":"danger",onClick:()=>void G(),children:"삭제"})]})]}),e.jsxs(L,{children:[e.jsxs(u,{children:[e.jsx(b,{children:"저장한 캡션"}),e.jsxs(N,{children:[e.jsx(v,{children:j(t.platform)}),e.jsx(v,{children:g})]}),e.jsx(w,{children:"본문"}),e.jsx(_,{"aria-label":"body",children:t.body}),n?e.jsxs(e.Fragment,{children:[e.jsx(w,{children:"태그"}),e.jsx(B,{"aria-label":"tags",children:n})]}):null]}),e.jsxs(u,{children:[e.jsx(b,{children:"모바일 예시"}),e.jsx(K,{children:e.jsxs(F,{children:[e.jsxs(H,{children:[e.jsx(O,{}),e.jsx(V,{children:"our_academy"})]}),e.jsx(W,{role:"img","aria-label":"이미지 예시",children:e.jsx("span",{children:"미리보기"})}),e.jsxs(J,{children:[e.jsx("strong",{children:"our_academy"})," ",t.body,n?e.jsxs(e.Fragment,{children:[e.jsx("br",{}),e.jsx("span",{className:"tags",children:n})]}):null]})]})})]})]})]})}function j(r){switch(r){case"INSTAGRAM":return"인스타그램";case"NAVER_BLOG":return"블로그";default:return"카카오 채널"}}function C(r){try{const a=y();if(a.find(l=>l.id===r.id))return;const d=[r,...a].slice(0,50);localStorage.setItem(T,JSON.stringify(d))}catch{}}const L=s.div`
  display: grid;
  gap: 12px;
  grid-template-columns: 1fr;
  @media (min-width: 960px) {
    grid-template-columns: 2fr 1fr;
  }
`,N=s.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin: 6px 0 10px;
`,v=s.span`
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  border: 1px solid ${({theme:r})=>r.colors.border};
  font-size: 12px;
  color: ${({theme:r})=>r.colors.text};
`,w=s.div`
  font-size: 12px;
  font-weight: 700;
  color: ${({theme:r})=>r.colors.textMuted};
  margin: 6px 0 4px;
`,B=s.div`
  border: 1px solid ${({theme:r})=>r.colors.border};
  border-radius: 10px;
  padding: 10px;
  background: #fff;
  font-size: 13px;
  color: ${({theme:r})=>r.colors.text};
`,_=s.pre`
  white-space: pre-wrap;
  word-break: break-word;
  border: 1px solid ${({theme:r})=>r.colors.border};
  border-radius: 10px;
  padding: 10px;
  background: #fff;
  font-size: 13px;
  color: ${({theme:r})=>r.colors.text};
  margin: 0;
`,K=s.div`
  display: grid;
  place-items: center;
  padding: 8px;
`,F=s.div`
  width: 360px;
  max-width: 100%;
  background: #fff;
  border: 1px solid ${({theme:r})=>r.colors.border};
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
`,H=s.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
`,O=s.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${({theme:r})=>r.colors.surfaceMuted};
  border: 1px solid ${({theme:r})=>r.colors.border};
`,V=s.div`
  font-weight: 800;
  color: ${({theme:r})=>r.colors.text};
  font-size: 13px;
`,W=s.div`
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 5;
  background: #e5e7eb;
  display: grid;
  place-items: center;
  color: #6b7280;
  span {
    font-size: 12px;
    padding: 4px 8px;
    background: rgba(255, 255, 255, 0.7);
    border-radius: 8px;
  }
`,J=s.div`
  padding: 10px;
  font-size: 13px;
  line-height: 1.5;
  color: ${({theme:r})=>r.colors.text};
  white-space: pre-wrap;
  word-break: break-word;
  strong {
    margin-right: 6px;
  }
  .tags {
    display: block;
    margin-top: 6px;
    color: ${({theme:r})=>r.colors.textMuted};
  }
`;export{ee as default};
