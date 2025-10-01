import{z as A,u as S,g as T,r as f,j as t,l as z,q as I,h as G,S as w,s as N,d as n}from"./index-Cq8NHvix.js";import{B as R}from"./BackButton-DEQnWac-.js";import{c as C,s as E}from"./savedMarketing-BBIbWj3f.js";function oe(){const{state:e}=A(),o=S(),{success:l,error:c}=T(),i=e?.platformChoice??"INSTAGRAM",h=e?.tone??"WARM_VIVID",a=e?.speechStyle??"SEUMNIDA",s=f.useMemo(()=>L(e,i),[e,i,a]),g=f.useMemo(()=>s.tags.join(" "),[s.tags]),[p,b]=f.useState(g);f.useEffect(()=>{b(g)},[g]);const[r,x]=f.useState(0);f.useEffect(()=>{r>=s.images.length&&x(0)},[s.images.length,r]);const u=f.useMemo(()=>p.split(/\s+/).filter(Boolean),[p]),m=s.body,$=i==="NAVER_BLOG"?s.title??"":"",y=(d,j)=>{if(!d.trim()){c("복사할 내용이 없습니다.");return}navigator.clipboard?.writeText(d).then(()=>l(j)).catch(()=>c("복사에 실패했습니다."))},M=async()=>{if(!m.trim()&&u.length===0){c("저장할 내용이 없습니다.");return}try{const d=await C({platform:i,speechStyle:a,tone:h,title:$||void 0,body:m,tags:u});l("저장되었습니다."),o(`/marketing/saved/${d.id??""}`)}catch{try{E({platform:i,speechStyle:a,tone:h,title:$||void 0,body:m,tags:u}),l("오프라인으로 저장되었습니다."),o("/marketing/saved")}catch{c("저장에 실패했습니다.")}}};return t.jsxs(z,{children:[t.jsxs(F,{children:[t.jsx(R,{backSteps:1,label:"뒤로가기"}),t.jsxs(U,{children:[t.jsx(I,{as:"button",onClick:()=>y(m,"본문을 복사했습니다."),children:"본문 복사"}),t.jsx(I,{as:"button",onClick:()=>y([m,u.join(" ")].filter(Boolean).join(`

`),"본문과 태그를 복사했습니다."),children:"본문+태그 복사"}),t.jsx(I,{as:"button",onClick:()=>y(u.join(" "),"태그를 복사했습니다."),children:"태그 복사"}),t.jsx(G,{as:"button",onClick:M,children:"저장"})]})]}),t.jsxs(H,{children:[t.jsxs(v,{children:["플랫폼: ",P(i)]}),t.jsxs(v,{children:["톤: ",h]}),t.jsxs(v,{children:["말투: ",a==="SEUMNIDA"?"~습니다":"~요"]}),t.jsxs(v,{children:["핵심 문장: ",(e?.bullets??[]).length||s.tags.length,"개"]}),t.jsxs(v,{children:["데이터: ",(e?.items??[]).length,"건"]})]}),t.jsxs(K,{children:[t.jsxs(w,{children:[i==="NAVER_BLOG"&&t.jsx(q,{value:$,readOnly:!0,"aria-label":"blog-title",placeholder:"제목 없음"}),t.jsx(k,{children:"본문"}),t.jsx(B,{"aria-label":"summary-body",children:m||"요약이 비어 있습니다."}),t.jsx(k,{children:"태그 (수정 가능)"}),t.jsx(W,{value:p,onChange:d=>b(d.currentTarget.value),placeholder:"#키워드를 공백으로 구분하여 입력","aria-label":"summary-tags"})]}),t.jsxs(w,{children:[t.jsx(N,{children:"미리 보기"}),i==="INSTAGRAM"?t.jsx(Y,{children:t.jsxs(J,{children:[t.jsxs(Q,{children:[t.jsx(X,{}),t.jsx(Z,{children:"our_academy"})]}),t.jsxs(ee,{role:"img","aria-label":"이미지 예시",children:[s.images.length>1&&t.jsxs(t.Fragment,{children:[t.jsx("button",{className:"nav prev",onClick:()=>x(d=>Math.max(0,d-1)),"aria-label":"이전",disabled:r<=0,children:"‹"}),t.jsx("button",{className:"nav next",onClick:()=>x(d=>Math.min(s.images.length-1,d+1)),"aria-label":"다음",disabled:r>=s.images.length-1,children:"›"})]}),t.jsx("span",{children:s.images[r]?.idea??"이미지 아이디어가 없습니다."})]}),s.images.length>1&&t.jsx(te,{children:s.images.map((d,j)=>t.jsx(se,{"data-active":j===r,onClick:()=>x(j)},j))}),t.jsxs(ne,{children:[t.jsx("strong",{children:"our_academy"})," ",m,u.length>0&&t.jsxs(t.Fragment,{children:[t.jsx("br",{}),t.jsx("span",{className:"tags",children:u.join(" ")})]})]})]})}):t.jsxs(B,{"aria-label":"preview",children:[i==="NAVER_BLOG"&&$?`${$}

`:"",m]})]})]})]})}function L(e,o,l){const c=(e?.bullets??[]).map(x=>x.trim()).filter(Boolean),i=e?.direction?.trim()??"",h=e?.items??[],a=e?.rendered,s=_({platform:o,bullets:c,direction:i,items:h});if(!a)return s;const g=(a.body??"").trim()||s.body,p=Array.isArray(a.tags)&&a.tags.length?a.tags.filter(Boolean):s.tags,b=a.images?.length?a.images:s.images;return{title:a.title??s.title,body:g,tags:p,images:b}}function _(e){const{platform:o,bullets:l,direction:c,items:i}=e,h=l.length?l:i.slice(0,5).map(r=>D(r)),s=[c.trim(),h.map(r=>`• ${r}`).join(`
`).trim()].filter(Boolean).join(`

`)||"요약을 생성할 수 없습니다.",g=l.slice(0,6).map(r=>`#${r.replace(/\s+/g,"")}`).filter(r=>r.length>1),p=O(i);return{title:o==="NAVER_BLOG"?V(c,i):void 0,body:s,tags:g,images:p}}function D(e){const o=e.date?`${e.date}`:"",l=e.courseTitle?`[${e.courseTitle}]`:"",c=e.content??"";return[o,l,c].filter(Boolean).join(" ").trim()}function O(e){return e.length?e.slice(0,5).map(o=>({idea:`${o.courseTitle??"수업"} 활동 모습`})):[{idea:"수업 현장 스냅"}]}function V(e,o){return e.trim()?e.trim().slice(0,60):o.length?`${o[0].courseTitle??"수업"} 하이라이트`:"이번 수업 이야기"}function P(e){switch(e){case"INSTAGRAM":return"인스타그램";case"NAVER_BLOG":return"네이버 블로그";case"KAKAO_CHANNEL":return"카카오 채널";default:return e}}const F=n.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${e=>e.theme.spacing.sm};
  flex-wrap: wrap;
`,U=n.div`
  display: inline-flex;
  gap: ${e=>e.theme.spacing.sm};
  flex-wrap: wrap;
  justify-content: flex-end;
`,H=n.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${e=>e.theme.spacing.xs};
  margin: ${e=>e.theme.spacing.md} 0;
`,v=n.span`
  display: inline-flex;
  align-items: center;
  gap: ${e=>e.theme.spacing.xs};
  border-radius: 999px;
  border: 1px solid ${e=>e.theme.colors.border};
  background: ${e=>e.theme.colors.surfaceMuted};
  color: ${e=>e.theme.colors.text};
  font-size: ${e=>e.theme.font.size.sm};
  padding: ${e=>e.theme.spacing.xs} ${e=>e.theme.spacing.sm};
`,K=n.div`
  display: grid;
  gap: ${e=>e.theme.spacing.lg};
  grid-template-columns: 1fr;
  @media (min-width: 960px) {
    grid-template-columns: 2fr 1fr;
  }
`,k=n.div`
  margin: ${e=>e.theme.spacing.sm} 0 ${e=>e.theme.spacing.xs};
  color: ${e=>e.theme.colors.textMuted};
  font-size: ${e=>e.theme.font.size.sm};
`,B=n.pre`
  background: ${e=>e.theme.colors.surfaceMuted};
  border-radius: ${e=>e.theme.radii.md};
  padding: ${e=>e.theme.spacing.md};
  min-height: 160px;
  white-space: pre-wrap;
  word-break: break-word;
  font-size: ${e=>e.theme.font.size.md};
  color: ${e=>e.theme.colors.text};
`,W=n.textarea`
  width: 100%;
  min-height: 80px;
  border: 1px solid ${e=>e.theme.colors.border};
  border-radius: ${e=>e.theme.radii.md};
  padding: ${e=>e.theme.spacing.md};
  font-size: ${e=>e.theme.font.size.md};
  resize: vertical;
`,q=n.input`
  width: 100%;
  margin-bottom: ${e=>e.theme.spacing.sm};
  border: 1px solid ${e=>e.theme.colors.border};
  border-radius: ${e=>e.theme.radii.md};
  padding: ${e=>e.theme.spacing.sm} ${e=>e.theme.spacing.md};
  font-size: ${e=>e.theme.font.size.lg};
  font-weight: 700;
  background: ${e=>e.theme.colors.surfaceMuted};
`,Y=n.div`
  display: flex;
  justify-content: center;
`,J=n.div`
  width: 240px;
  border: 1px solid ${e=>e.theme.colors.border};
  border-radius: 28px;
  padding: ${e=>e.theme.spacing.md};
  background: ${e=>e.theme.colors.surface};
  display: grid;
  gap: ${e=>e.theme.spacing.sm};
`,Q=n.div`
  display: flex;
  align-items: center;
  gap: ${e=>e.theme.spacing.sm};
`,X=n.span`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${e=>e.theme.colors.primarySurface};
`,Z=n.span`
  font-weight: 700;
  font-size: ${e=>e.theme.font.size.md};
`,ee=n.div`
  position: relative;
  border-radius: ${e=>e.theme.radii.md};
  background: ${e=>e.theme.colors.surfaceMuted};
  padding: ${e=>e.theme.spacing.lg};
  min-height: 140px;
  display: grid;
  place-items: center;
  text-align: center;
  font-size: ${e=>e.theme.font.size.sm};
  color: ${e=>e.theme.colors.textMuted};
  button.nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    border: none;
    background: rgba(0, 0, 0, 0.35);
    color: #fff;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    cursor: pointer;
  }
  button.nav.prev { left: ${e=>e.theme.spacing.sm}; }
  button.nav.next { right: ${e=>e.theme.spacing.sm}; }
`,te=n.div`
  display: flex;
  justify-content: center;
  gap: 4px;
`,se=n.button`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  border: none;
  background: ${({"data-active":e})=>e?"#1f2937":"#d1d5db"};
  cursor: pointer;
`,ne=n.p`
  margin: 0;
  font-size: ${e=>e.theme.font.size.sm};
  color: ${e=>e.theme.colors.text};
  .tags {
    color: ${e=>e.theme.colors.textMuted};
  }
`;export{oe as default};
