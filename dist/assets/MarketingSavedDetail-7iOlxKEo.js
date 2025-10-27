import{j as r,d as a,e as D,u as A,c as M,r as d}from"./index-B0K7mn4q.js";import{P as h,b as f,j as l,S as m,i as j}from"./UI-Cj3YhchZ.js";import{u as G}from"./useConfirmDialog-DCN8mg1d.js";import{g as k,b as P,S as R,r as C}from"./savedMarketing-QiWyiSGP.js";import{d as I}from"./format-DW-Kl_C3.js";import"./ConfirmDialog-ClQeXE4D.js";function B({record:e,createdAtLabel:t,tags:i,confirmDialog:o,onBack:c,onCopy:p,onDelete:x}){return e?r.jsxs(h,{children:[o,r.jsxs(f,{children:[r.jsxs("div",{children:[r.jsx("h2",{children:"저장 내역 상세"}),r.jsxs("p",{children:[b(e.platform)," · ",t??"-"]})]}),r.jsxs(E,{children:[r.jsx(l,{as:"button",onClick:c,children:"목록"}),r.jsx(l,{as:"button",onClick:p,children:"복사"}),r.jsx(l,{as:"button","data-variant":"danger",onClick:x,children:"삭제"})]})]}),r.jsxs(T,{children:[r.jsxs(m,{children:[r.jsx(j,{children:"저장한 캡션"}),r.jsxs(L,{children:[r.jsx(y,{children:b(e.platform)}),r.jsx(y,{children:t??"-"})]}),r.jsx(v,{children:"본문"}),r.jsx(N,{"aria-label":"body",children:e.body}),i?r.jsxs(r.Fragment,{children:[r.jsx(v,{children:"태그"}),r.jsx(z,{"aria-label":"tags",children:i})]}):null]}),r.jsxs(m,{children:[r.jsx(j,{children:"모바일 예시"}),r.jsx(_,{children:r.jsxs(K,{children:[r.jsxs(V,{children:[r.jsx(F,{}),r.jsx(H,{children:"our_academy"})]}),r.jsx(O,{role:"img","aria-label":"이미지 예시",children:r.jsx("span",{children:"미리보기"})}),r.jsxs(W,{children:[r.jsx("strong",{children:"our_academy"})," ",e.body,i?r.jsxs(r.Fragment,{children:[r.jsx("br",{}),r.jsx("span",{className:"tags",children:i})]}):null]})]})})]})]})]}):r.jsx(h,{children:r.jsxs(f,{children:[r.jsxs("div",{children:[r.jsx("h2",{children:"저장 내역 상세"}),r.jsx("p",{children:"항목을 찾을 수 없습니다."})]}),r.jsx(l,{as:"button",onClick:c,children:"목록으로"})]})})}function b(e){switch(e){case"INSTAGRAM":return"인스타그램";case"NAVER_BLOG":return"블로그";default:return"카카오 채널"}}const T=a.div`
  display: grid;
  gap: 12px;
  grid-template-columns: 1fr;
  @media (min-width: 960px) {
    grid-template-columns: 1fr 1fr;
  }
`,E=a.div`
  display: inline-flex;
  gap: 12px;
`,L=a.div`
  display: inline-flex;
  gap: 8px;
  flex-wrap: wrap;
`,y=a.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  background: rgba(148, 163, 184, 0.18);
  color: #475569;
`,v=a.h4`
  margin: 16px 0 6px;
  font-size: 14px;
  color: #475569;
`,N=a.pre`
  background: ${({theme:e})=>e.colors.surfaceMuted};
  border-radius: ${({theme:e})=>e.radii.md};
  padding: 16px;
  min-height: 160px;
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 14px;
  color: ${({theme:e})=>e.colors.text};
`,z=a.div`
  background: ${({theme:e})=>e.colors.surfaceMuted};
  border-radius: ${({theme:e})=>e.radii.md};
  padding: 12px;
  font-size: 13px;
  color: ${({theme:e})=>e.colors.text};
`,_=a.div`
  display: flex;
  justify-content: center;
  padding: ${({theme:e})=>e.spacing.sm};
`,K=a.div`
  width: min(320px, 100%);
  border: 1px solid ${({theme:e})=>e.colors.border};
  border-radius: 28px;
  padding: ${({theme:e})=>e.spacing.lg};
  background: ${({theme:e})=>e.colors.surface};
  display: grid;
  gap: ${({theme:e})=>e.spacing.md};
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.08);
`,V=a.div`
  display: flex;
  align-items: center;
  gap: ${({theme:e})=>e.spacing.sm};
`,F=a.span`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({theme:e})=>e.colors.primarySurface};
`,H=a.span`
  font-weight: 600;
  color: ${({theme:e})=>e.colors.text};
`,O=a.div`
  border-radius: ${({theme:e})=>e.radii.lg};
  background: ${({theme:e})=>e.colors.surfaceMuted};
  min-height: 220px;
  display: grid;
  place-items: center;
  color: ${({theme:e})=>e.colors.textMuted};
  font-size: 14px;
`,W=a.div`
  font-size: 14px;
  color: ${({theme:e})=>e.colors.text};
  line-height: 1.6;
  .tags {
    display: block;
    margin-top: ${({theme:e})=>e.spacing.xs};
    color: ${({theme:e})=>e.colors.primary};
  }
`;function J(e){try{const t=k();if(t.find(o=>o.id===e.id))return;const i=[e,...t].slice(0,50);localStorage.setItem(R,JSON.stringify(i))}catch{}}function U(e){return{id:String(e.id),createdAt:e.createdAt?new Date(e.createdAt).getTime():Date.now(),platform:e.platform,speechStyle:e.speechStyle,tone:e.tone??void 0,title:e.title??void 0,body:e.body,tags:Array.isArray(e.tags)?e.tags:[]}}function Y(){const{id:e}=D(),t=A(),{success:i,error:o}=M(),{confirm:c,dialog:p}=G({confirmLabel:"삭제",cancelLabel:"취소",tone:"danger"}),x=d.useMemo(()=>e?k().find(s=>s.id===e)??null:null,[e]),[n,w]=d.useState(x);d.useEffect(()=>{if(n||!e||!/^\d+$/.test(e))return;let s=!1;return(async()=>{try{const $=await P(Number(e));if(s)return;const u=U($);J(u),w(u)}catch{}})(),()=>{s=!0}},[e,n]);const S=d.useMemo(()=>{if(!n)return null;const s=I(n.createdAt,{includeWeekday:!0});if(s==="—")try{return new Date(n.createdAt).toLocaleString("ko-KR",{hour12:!1})}catch{return null}return s},[n]),g=n?.tags.join(" ")??"";return{state:{record:n,createdAtLabel:S,tags:g,confirmDialog:p},handlers:{handleCopy:()=>{if(!n)return;const s=[n.body,g].filter(Boolean).join(`

`);navigator.clipboard?.writeText(s).then(()=>i("복사되었습니다.")).catch(()=>o("복사에 실패했습니다."))},handleDelete:async()=>{!n||!await c({title:"이 항목을 삭제할까요?",message:"저장된 캡션이 삭제되며 되돌릴 수 없습니다."})||(C(n.id),i("삭제했습니다."),t("/marketing/saved"))},handleBack:()=>t("/marketing/saved")}}}function se(){const{state:e,handlers:t}=Y();return r.jsx(B,{record:e.record,createdAtLabel:e.createdAtLabel,tags:e.tags,confirmDialog:e.confirmDialog,onBack:t.handleBack,onCopy:t.handleCopy,onDelete:()=>{t.handleDelete()}})}export{se as default};
