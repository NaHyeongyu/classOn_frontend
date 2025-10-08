import{A as S,u as T,k as G,r as x,j as t,P as M,w,m as z,S as k,t as N,d as a}from"./index-_dJHzZeb.js";import{B as R}from"./BackButton-BTVQ3ZEP.js";import{c as C,s as E}from"./savedMarketing-FlkHwFy0.js";function oe(){const{state:e}=S(),o=T(),{success:c,error:l}=G(),n=e?.platformChoice??"INSTAGRAM",g=e?.tone??"WARM_VIVID",i=e?.speechStyle??"SEUMNIDA",s=x.useMemo(()=>L(e,n),[e,n,i]),p=x.useMemo(()=>s.tags.join(" "),[s.tags]),[h,f]=x.useState(p);x.useEffect(()=>{f(p)},[p]);const[r,b]=x.useState(0);x.useEffect(()=>{r>=s.images.length&&b(0)},[s.images.length,r]);const u=x.useMemo(()=>h.split(/\s+/).filter(Boolean),[h]),m=s.body,$=n==="NAVER_BLOG"?s.title??"":"",y=(d,j)=>{if(!d.trim()){l("복사할 내용이 없습니다.");return}navigator.clipboard?.writeText(d).then(()=>c(j)).catch(()=>l("복사에 실패했습니다."))},B=async()=>{if(!m.trim()&&u.length===0){l("저장할 내용이 없습니다.");return}try{const d=await C({platform:n,speechStyle:i,tone:g,title:$||void 0,body:m,tags:u});c("저장되었습니다."),o(`/marketing/saved/${d.id??""}`)}catch{try{E({platform:n,speechStyle:i,tone:g,title:$||void 0,body:m,tags:u}),c("오프라인으로 저장되었습니다."),o("/marketing/saved")}catch{l("저장에 실패했습니다.")}}};return t.jsxs(M,{children:[t.jsxs(F,{children:[t.jsx(R,{backSteps:1,label:"뒤로가기"}),t.jsxs(U,{children:[t.jsx(w,{as:"button",onClick:()=>y(m,"본문을 복사했습니다."),children:"본문 복사"}),t.jsx(w,{as:"button",onClick:()=>y([m,u.join(" ")].filter(Boolean).join(`

`),"본문과 태그를 복사했습니다."),children:"본문+태그 복사"}),t.jsx(w,{as:"button",onClick:()=>y(u.join(" "),"태그를 복사했습니다."),children:"태그 복사"}),t.jsx(z,{as:"button",onClick:B,children:"저장"})]})]}),t.jsxs(Y,{"aria-hidden":!0,children:[t.jsxs(v,{children:["플랫폼: ",V(n)]}),t.jsxs(v,{children:["톤: ",g]}),t.jsxs(v,{children:["말투: ",i==="SEUMNIDA"?"~습니다":"~요"]}),t.jsxs(v,{children:["핵심 문장: ",(e?.bullets??[]).length||s.tags.length,"개"]}),t.jsxs(v,{children:["데이터: ",(e?.items??[]).length,"건"]})]}),t.jsxs(H,{children:[t.jsxs(k,{children:[n==="NAVER_BLOG"&&t.jsx(W,{value:$,readOnly:!0,"aria-label":"blog-title",placeholder:"제목 없음"}),t.jsx(I,{children:"본문"}),t.jsx(A,{"aria-label":"summary-body",children:m||"요약이 비어 있습니다."}),t.jsx(I,{children:"태그 (수정 가능)"}),t.jsx(K,{value:h,onChange:d=>f(d.currentTarget.value),placeholder:"#키워드를 공백으로 구분하여 입력","aria-label":"summary-tags"})]}),t.jsxs(k,{children:[t.jsx(N,{children:"미리 보기"}),n==="INSTAGRAM"?t.jsx(q,{children:t.jsxs(J,{children:[t.jsxs(Q,{children:[t.jsx(X,{}),t.jsx(Z,{children:"our_academy"})]}),t.jsxs(ee,{role:"img","aria-label":"이미지 예시",children:[s.images.length>1&&t.jsxs(t.Fragment,{children:[t.jsx("button",{className:"nav prev",onClick:()=>b(d=>Math.max(0,d-1)),"aria-label":"이전",disabled:r<=0,children:"‹"}),t.jsx("button",{className:"nav next",onClick:()=>b(d=>Math.min(s.images.length-1,d+1)),"aria-label":"다음",disabled:r>=s.images.length-1,children:"›"})]}),t.jsx("span",{children:s.images[r]?.idea??"이미지 아이디어가 없습니다."})]}),s.images.length>1&&t.jsx(te,{children:s.images.map((d,j)=>t.jsx(se,{"data-active":j===r,onClick:()=>b(j)},j))}),t.jsxs(ae,{children:[t.jsx("strong",{children:"our_academy"})," ",m,u.length>0&&t.jsxs(t.Fragment,{children:[t.jsx("br",{}),t.jsx("span",{className:"tags",children:u.join(" ")})]})]})]})}):t.jsxs(A,{"aria-label":"preview",children:[n==="NAVER_BLOG"&&$?`${$}

`:"",m]})]})]})]})}function L(e,o,c){const l=(e?.bullets??[]).map(b=>b.trim()).filter(Boolean),n=e?.direction?.trim()??"",g=e?.items??[],i=e?.rendered,s=_({platform:o,bullets:l,direction:n,items:g});if(!i)return s;const p=(i.body??"").trim()||s.body,h=Array.isArray(i.tags)&&i.tags.length?i.tags.filter(Boolean):s.tags,f=i.images?.length?i.images:s.images;return{title:i.title??s.title,body:p,tags:h,images:f}}function _(e){const{platform:o,bullets:c,direction:l,items:n}=e,g=c.length?c:n.slice(0,5).map(r=>D(r)),s=[l.trim(),g.map(r=>`• ${r}`).join(`
`).trim()].filter(Boolean).join(`

`)||"요약을 생성할 수 없습니다.",p=c.slice(0,6).map(r=>`#${r.replace(/\s+/g,"")}`).filter(r=>r.length>1),h=O(n);return{title:o==="NAVER_BLOG"?P(l,n):void 0,body:s,tags:p,images:h}}function D(e){const o=e.date?`${e.date}`:"",c=e.courseTitle?`[${e.courseTitle}]`:"",l=e.content??"";return[o,c,l].filter(Boolean).join(" ").trim()}function O(e){return e.length?e.slice(0,5).map(o=>({idea:`${o.courseTitle??"수업"} 활동 모습`})):[{idea:"수업 현장 스냅"}]}function P(e,o){return e.trim()?e.trim().slice(0,60):o.length?`${o[0].courseTitle??"수업"} 하이라이트`:"이번 수업 이야기"}function V(e){switch(e){case"INSTAGRAM":return"인스타그램";case"NAVER_BLOG":return"네이버 블로그";case"KAKAO_CHANNEL":return"카카오 채널";default:return e}}const F=a.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${e=>e.theme.spacing.sm};
  flex-wrap: wrap;
`,U=a.div`
  display: inline-flex;
  gap: ${e=>e.theme.spacing.sm};
  flex-wrap: wrap;
  justify-content: flex-end;
`,Y=a.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${e=>e.theme.spacing.xs};
  margin: ${e=>e.theme.spacing.md} 0;
  display: none;
`,v=a.span`
  display: inline-flex;
  align-items: center;
  gap: ${e=>e.theme.spacing.xs};
  border-radius: 999px;
  border: 1px solid ${e=>e.theme.colors.border};
  background: ${e=>e.theme.colors.surfaceMuted};
  color: ${e=>e.theme.colors.text};
  font-size: ${e=>e.theme.font.size.sm};
  padding: ${e=>e.theme.spacing.xs} ${e=>e.theme.spacing.sm};
`,H=a.div`
  display: grid;
  gap: ${e=>e.theme.spacing.lg};
  grid-template-columns: 1fr;
  @media (min-width: 960px) {
    grid-template-columns: 2fr 1fr;
  }
`,I=a.div`
  margin: ${e=>e.theme.spacing.sm} 0 ${e=>e.theme.spacing.xs};
  color: ${e=>e.theme.colors.textMuted};
  font-size: ${e=>e.theme.font.size.sm};
`,A=a.pre`
  background: ${e=>e.theme.colors.surfaceMuted};
  border-radius: ${e=>e.theme.radii.md};
  padding: ${e=>e.theme.spacing.md};
  min-height: 160px;
  white-space: pre-wrap;
  word-break: break-word;
  font-size: ${e=>e.theme.font.size.md};
  color: ${e=>e.theme.colors.text};
`,K=a.textarea`
  width: 100%;
  min-height: 80px;
  border: 1px solid ${e=>e.theme.colors.border};
  border-radius: ${e=>e.theme.radii.md};
  padding: ${e=>e.theme.spacing.md};
  font-size: ${e=>e.theme.font.size.md};
  resize: vertical;
`,W=a.input`
  width: 100%;
  margin-bottom: ${e=>e.theme.spacing.sm};
  border: 1px solid ${e=>e.theme.colors.border};
  border-radius: ${e=>e.theme.radii.md};
  padding: ${e=>e.theme.spacing.sm} ${e=>e.theme.spacing.md};
  font-size: ${e=>e.theme.font.size.lg};
  font-weight: 700;
  background: ${e=>e.theme.colors.surfaceMuted};
`,q=a.div`
  display: flex;
  justify-content: center;
  padding: ${e=>e.theme.spacing.sm};
`,J=a.div`
  width: min(320px, 100%);
  border: 1px solid ${e=>e.theme.colors.border};
  border-radius: 28px;
  padding: ${e=>e.theme.spacing.lg};
  background: ${e=>e.theme.colors.surface};
  display: grid;
  gap: ${e=>e.theme.spacing.md};
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.08);
`,Q=a.div`
  display: flex;
  align-items: center;
  gap: ${e=>e.theme.spacing.sm};
`,X=a.span`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${e=>e.theme.colors.primarySurface};
`,Z=a.span`
  font-weight: 700;
  font-size: ${e=>e.theme.font.size.md};
`,ee=a.div`
  position: relative;
  border-radius: ${e=>e.theme.radii.md};
  background: #e2e8f0;
  padding: ${e=>e.theme.spacing.lg};
  min-height: 260px;
  display: grid;
  place-items: center;
  text-align: center;
  font-size: clamp(13px, 1.6vw, 16px);
  font-weight: 600;
  color: ${e=>e.theme.colors.text};
  line-height: 1.68;
  letter-spacing: -0.01em;
  box-shadow: inset 0 0 0 1px rgba(148, 163, 184, 0.28);
  span {
    display: block;
    padding: 0 ${e=>e.theme.spacing.lg};
    max-width: 80%;
    margin: 0 auto;
    white-space: pre-line;
  }
  button.nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    border: none;
    background: rgba(15, 23, 42, 0.6);
    color: #fff;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    cursor: pointer;
    display: grid;
    place-items: center;
    font-size: 16px;
    border: 1px solid rgba(255, 255, 255, 0.55);
    box-shadow: 0 6px 14px rgba(15, 23, 42, 0.18);
    transition: transform 0.18s ease, background 0.18s ease, box-shadow 0.18s ease;
    backdrop-filter: blur(2px);
  }
  button.nav:hover {
    background: rgba(79, 70, 229, 0.75);
    transform: translateY(-50%) scale(1.05);
    box-shadow: 0 8px 16px rgba(79, 70, 229, 0.25);
  }
  button.nav:active {
    transform: translateY(-50%) scale(0.97);
  }
  button.nav.prev { left: -24px; }
  button.nav.next { right: -24px; }
`,te=a.div`
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: ${e=>e.theme.spacing.sm};
`,se=a.button`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  padding: 0;
  background: ${({"data-active":e})=>e?"#1f2937":"rgba(148, 163, 184, 0.55)"};
  opacity: ${({"data-active":e})=>e?1:.65};
  transform: ${({"data-active":e})=>e?"scale(1.15)":"scale(1)"};
  transition: transform 0.18s ease, background 0.18s ease, opacity 0.18s ease;
  cursor: pointer;
  &:focus-visible {
    outline: 2px solid rgba(79, 70, 229, 0.45);
    outline-offset: 2px;
  }
`,ae=a.p`
  margin: 0;
  font-size: ${e=>e.theme.font.size.sm};
  color: ${e=>e.theme.colors.text};
  line-height: 1.68;
  white-space: pre-wrap;
  word-break: keep-all;
  overflow-wrap: anywhere;
  strong {
    margin-right: 6px;
  }
  .tags {
    display: block;
    margin-top: ${e=>e.theme.spacing.xs};
    color: ${e=>e.theme.colors.textMuted};
  }
`;export{oe as default};
