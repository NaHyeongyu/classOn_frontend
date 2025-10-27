import{j as t,d as o,G as K,u as U,c as W,r as d}from"./index-B0K7mn4q.js";import{B as Y}from"./BackButton-BW37zkWn.js";import{P as q,j as z,f as J,S as E,i as P}from"./UI-Cj3YhchZ.js";import{b as Q,c as X,m as _,d as Z}from"./utils-D2trpR9j.js";import{c as ee,s as te}from"./savedMarketing-QiWyiSGP.js";import{b as se,c as ne}from"./constants-UoNuUtwe.js";function oe(e){return Q(e?.directions)}function ie(e,s,r,i){const n=(e?.bullets??[]).map($=>$.trim()).filter(Boolean),f=i.trim(),h=e?.items??[],c=e?.rendered,l=re({platform:s,bullets:n,direction:f,items:h});if(!c)return l;const j=(c.body??"").trim()||l.body,m=Array.isArray(c.tags)&&c.tags.length?c.tags.filter(Boolean):l.tags,u=c.images?.length?c.images:l.images;return{title:c.title??l.title,body:j,tags:m,images:u}}function re(e){const{platform:s,bullets:r,direction:i,items:n}=e,f=r.length?r:n.slice(0,5).map(u=>ae(u)),c=[i.trim(),f.map(u=>`• ${u}`).join(`
`).trim()].filter(Boolean).join(`

`)||"요약을 생성할 수 없습니다.",l=r.slice(0,6).map(u=>`#${u.replace(/\s+/g,"")}`).filter(u=>u.length>1),j=ce(n);return{title:s==="NAVER_BLOG"?le(i,n):void 0,body:c,tags:l,images:j}}function ae(e){const s=e.date?`${e.date}`:"",r=e.courseTitle?`[${e.courseTitle}]`:"",i=e.content??"";return[s,r,i].filter(Boolean).join(" ").trim()}function ce(e){return e.length?e.slice(0,5).map(s=>({idea:`${s.courseTitle??"수업"} 활동 모습`})):[{idea:"수업 현장 스냅"}]}function le(e,s){return e.trim()?e.trim().slice(0,60):s.length?`${s[0].courseTitle??"수업"} 하이라이트`:"이번 수업 이야기"}function de(e){switch(e){case"INSTAGRAM":return"인스타그램";case"NAVER_BLOG":return"네이버 블로그";case"KAKAO_CHANNEL":return"카카오 채널";default:return e}}function O(e,s,r){const i=e?.direction?.trim();if(i)return i;if(r==null)return"";const n=s[r];return n?X(n):""}function ge({itemsCount:e,toneLabel:s,speechLabel:r,platformChoice:i,directionText:n,body:f,tagInput:h,onTagInputChange:c,tagsList:l,tagCount:j,blogTitle:m,summaryDirections:u,selectedDirectionIndex:y,images:$,currentImageIndex:I,onPrevImage:C,onNextImage:g,onSelectImage:S,canPrevImage:k,canNextImage:A,onCopyBody:T,onCopyBodyAndTags:M,onCopyTags:x,onSaveDraft:G}){const w=$.length>0,v=w?$[I]?.idea??"":"";return t.jsxs(q,{children:[t.jsxs(me,{children:[t.jsx(Y,{backSteps:1,label:"뒤로가기"}),t.jsxs(ue,{children:[t.jsx(z,{as:"button",onClick:T,children:"본문 복사"}),t.jsx(z,{as:"button",onClick:M,children:"본문+태그 복사"}),t.jsx(z,{as:"button",onClick:x,children:"태그 복사"}),t.jsx(J,{as:"button",onClick:G,children:"저장"})]})]}),t.jsxs(pe,{"aria-hidden":!0,children:[t.jsxs(B,{children:["플랫폼: ",de(i)]}),t.jsxs(B,{children:["톤: ",s]}),t.jsxs(B,{children:["말투: ",r]}),t.jsxs(B,{children:["핵심 문장: ",j,"개"]}),t.jsxs(B,{children:["데이터: ",e,"건"]})]}),t.jsxs(he,{children:[t.jsxs(E,{children:[i==="NAVER_BLOG"?t.jsx(be,{value:m??"",readOnly:!0,"aria-label":"blog-title",placeholder:"제목 없음"}):null,n?t.jsxs(t.Fragment,{children:[t.jsx(N,{children:"선택한 콘텐츠 방향"}),t.jsx(R,{"aria-label":"summary-direction",children:n})]}):null,t.jsx(N,{children:"본문"}),t.jsx(R,{"aria-label":"summary-body",children:f||"요약이 비어 있습니다."}),t.jsx(N,{children:"태그 (수정 가능)"}),t.jsx(fe,{value:h,onChange:a=>c(a.currentTarget.value),placeholder:"#키워드를 공백으로 구분하여 입력","aria-label":"summary-tags"})]}),t.jsxs(xe,{children:[t.jsxs(E,{children:[t.jsx(P,{children:"미리 보기"}),i==="INSTAGRAM"?t.jsx(De,{children:t.jsxs(Be,{children:[t.jsxs(Ae,{children:[t.jsx(Me,{}),t.jsx(Le,{children:"our_academy"})]}),t.jsxs(Ce,{role:"img","aria-label":"이미지 예시",children:[w&&$.length>1?t.jsxs(t.Fragment,{children:[t.jsx("button",{className:"nav prev",onClick:C,"aria-label":"이전",disabled:!k,children:"‹"}),t.jsx("button",{className:"nav next",onClick:g,"aria-label":"다음",disabled:!A,children:"›"})]}):null,t.jsx("span",{children:v||"이미지 아이디어가 없습니다."})]}),w&&$.length>1?t.jsx(Ge,{children:$.map((a,b)=>t.jsx(ze,{"data-active":b===I,onClick:()=>S(b)},b))}):null,t.jsxs(Ee,{children:[t.jsx("strong",{children:"our_academy"})," ",f,l.length>0?t.jsxs(t.Fragment,{children:[t.jsx("br",{}),t.jsx("span",{className:"tags",children:l.join(" ")})]}):null]})]})}):t.jsx(R,{"aria-label":"preview",children:i==="NAVER_BLOG"&&m?`${m}

${f}`:f})]}),u.length?t.jsxs(E,{"aria-labelledby":"direction-suggestions-heading",children:[t.jsx(P,{id:"direction-suggestions-heading",children:"AI 방향 제안"}),t.jsx(ye,{children:u.map((a,b)=>{const D=y===b;return t.jsxs($e,{"data-selected":D||void 0,children:[t.jsxs(je,{children:[t.jsx(Ie,{"data-selected":D||void 0,children:D?"선택됨":`추천 #${b+1}`}),a.platform?t.jsx(ve,{children:_(a.platform)}):null]}),t.jsx(Se,{children:a.title||`콘텐츠 방향 ${b+1}`}),a.because?t.jsx(ke,{children:a.because}):null,a.hook?t.jsxs(Te,{children:["“",a.hook,"”"]}):null,t.jsxs(we,{children:[a.asset?t.jsx(V,{children:Z(a.asset)}):null,a.platform?t.jsx(V,{tone:"neutral",children:_(a.platform)}):null]})]},b)})})]}):null]})]})]})}const me=o.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${e=>e.theme.spacing.sm};
  flex-wrap: wrap;
`,ue=o.div`
  display: inline-flex;
  gap: ${e=>e.theme.spacing.sm};
  flex-wrap: wrap;
  justify-content: flex-end;
`,pe=o.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${e=>e.theme.spacing.xs};
  margin: ${e=>e.theme.spacing.md} 0;
  display: none;
`,B=o.span`
  display: inline-flex;
  align-items: center;
  gap: ${e=>e.theme.spacing.xs};
  border-radius: 999px;
  border: 1px solid ${e=>e.theme.colors.border};
  background: ${e=>e.theme.colors.surfaceMuted};
  color: ${e=>e.theme.colors.text};
  font-size: ${e=>e.theme.font.size.sm};
  padding: ${e=>e.theme.spacing.xs} ${e=>e.theme.spacing.sm};
`,he=o.div`
  display: grid;
  gap: ${e=>e.theme.spacing.lg};
  grid-template-columns: 1fr;
  @media (min-width: 960px) {
    grid-template-columns: 2fr 1fr;
  }
`,xe=o.div`
  display: grid;
  gap: ${e=>e.theme.spacing.lg};
`,N=o.div`
  margin: ${e=>e.theme.spacing.sm} 0 ${e=>e.theme.spacing.xs};
  color: ${e=>e.theme.colors.textMuted};
  font-size: ${e=>e.theme.font.size.sm};
`,R=o.pre`
  background: ${e=>e.theme.colors.surfaceMuted};
  border-radius: ${e=>e.theme.radii.md};
  padding: ${e=>e.theme.spacing.md};
  min-height: 160px;
  white-space: pre-wrap;
  word-break: break-word;
  font-size: ${e=>e.theme.font.size.md};
  color: ${e=>e.theme.colors.text};
`,fe=o.textarea`
  width: 100%;
  min-height: 80px;
  border: 1px solid ${e=>e.theme.colors.border};
  border-radius: ${e=>e.theme.radii.md};
  padding: ${e=>e.theme.spacing.md};
  font-size: ${e=>e.theme.font.size.md};
  resize: vertical;
`,be=o.input`
  width: 100%;
  margin-bottom: ${e=>e.theme.spacing.sm};
  border: 1px solid ${e=>e.theme.colors.border};
  border-radius: ${e=>e.theme.radii.md};
  padding: ${e=>e.theme.spacing.sm} ${e=>e.theme.spacing.md};
  font-size: ${e=>e.theme.font.size.lg};
  font-weight: 700;
  background: ${e=>e.theme.colors.surfaceMuted};
`,ye=o.div`
  display: grid;
  gap: ${e=>e.theme.spacing.sm};
`,$e=o.div`
  border: 1px solid ${({theme:e})=>e.colors.border};
  border-radius: ${({theme:e})=>e.radii.md};
  padding: ${e=>e.theme.spacing.md};
  background: ${({theme:e})=>e.colors.surface};
  display: grid;
  gap: ${e=>e.theme.spacing.xs};
  &[data-selected="true"] {
    border-color: ${({theme:e})=>e.colors.primary};
    background: ${({theme:e})=>e.colors.primarySurface};
  }
`,je=o.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${e=>e.theme.spacing.xs};
`,Ie=o.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  background: ${({theme:e,"data-selected":s})=>s?e.colors.primary:"rgba(79, 70, 229, 0.12)"};
  color: ${({"data-selected":e})=>e?"#fff":"#4338ca"};
`,ve=o.span`
  font-size: 12px;
  color: ${({theme:e})=>e.colors.textMuted};
`,Se=o.h4`
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: ${({theme:e})=>e.colors.text};
`,ke=o.p`
  margin: 0;
  font-size: 13px;
  color: ${({theme:e})=>e.colors.textMuted};
`,Te=o.p`
  margin: 0;
  font-size: 14px;
  color: ${({theme:e})=>e.colors.text};
  font-weight: 600;
`,we=o.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`,V=o.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  background: ${({tone:e})=>e==="neutral"?"rgba(148, 163, 184, 0.16)":"rgba(79, 70, 229, 0.12)"};
  color: ${({tone:e})=>e==="neutral"?"#475569":"#3730a3"};
`,De=o.div`
  display: flex;
  justify-content: center;
  padding: ${e=>e.theme.spacing.sm};
`,Be=o.div`
  width: min(320px, 100%);
  border: 1px solid ${e=>e.theme.colors.border};
  border-radius: 28px;
  padding: ${e=>e.theme.spacing.lg};
  background: ${e=>e.theme.colors.surface};
  display: grid;
  gap: ${e=>e.theme.spacing.md};
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.08);
`,Ae=o.div`
  display: flex;
  align-items: center;
  gap: ${e=>e.theme.spacing.sm};
`,Me=o.span`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${e=>e.theme.colors.primarySurface};
`,Le=o.span`
  font-weight: 600;
  color: ${e=>e.theme.colors.text};
`,Ce=o.div`
  position: relative;
  border-radius: ${e=>e.theme.radii.lg};
  background: ${e=>e.theme.colors.surfaceMuted};
  min-height: 220px;
  display: grid;
  place-items: center;
  padding: ${e=>e.theme.spacing.md};
  text-align: center;
  color: ${e=>e.theme.colors.text};

  button.nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: none;
    background: rgba(15, 23, 42, 0.6);
    color: #fff;
    font-size: 18px;
    cursor: pointer;
  }
  button.nav.prev {
    left: 12px;
  }
  button.nav.next {
    right: 12px;
  }
  button.nav:disabled {
    opacity: 0.4;
    cursor: default;
  }
`,Ge=o.div`
  display: flex;
  justify-content: center;
  gap: 8px;
`,ze=o.button`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  border: none;
  background: ${({"data-active":e})=>e?"#312e81":"rgba(49, 46, 129, 0.26)"};
  cursor: pointer;
`,Ee=o.div`
  font-size: 14px;
  color: ${e=>e.theme.colors.text};
  line-height: 1.6;
  .tags {
    color: ${e=>e.theme.colors.primary};
  }
`;function Ne(){const e=K(),s=U(),{success:r,error:i}=W(),n=e.state,f=d.useMemo(()=>n?.items??[],[n?.items]),h=n?.platformChoice??"INSTAGRAM",c=n?.tone??"WARM_VIVID",l=n?.speechStyle??"SEUMNIDA",j=n?.formatStyle,m=d.useMemo(()=>oe(n?.summary),[n?.summary]),u=d.useMemo(()=>{const p=typeof n?.selectedDirectionIndex=="number"?n.selectedDirectionIndex:null;return p==null?null:p>=0&&p<m.length?p:null},[n?.selectedDirectionIndex,m.length]),[y,$]=d.useState(u),[I,C]=d.useState(()=>O(n,m,u));d.useEffect(()=>{C(p=>{const L=O(n,m,y);return p===L?p:L})},[n,m,y]),d.useEffect(()=>{y!=null&&y>=m.length&&$(null)},[y,m.length]);const g=d.useMemo(()=>ie(n,h,l,I),[n,h,l,I]),S=d.useMemo(()=>g.tags.join(" "),[g.tags]),[k,A]=d.useState(S);d.useEffect(()=>{A(S)},[S]);const[T,M]=d.useState(0);d.useEffect(()=>{T>=g.images.length&&M(0)},[T,g.images.length]);const x=d.useMemo(()=>k.split(/\s+/).filter(Boolean),[k]),G=ne[c]??c,w=se[l]??l,v=h==="NAVER_BLOG"?g.title??"":"",a=d.useCallback(async(p,L)=>{if(!p.trim()){i("복사할 내용이 없습니다.");return}try{await navigator.clipboard.writeText(p),r(L)}catch{i("복사에 실패했습니다.")}},[i,r]),b=d.useCallback(()=>{a(g.body,"본문을 복사했습니다.")},[a,g.body]),D=d.useCallback(()=>{const p=[g.body,x.join(" ")].filter(Boolean).join(`

`);a(p,"본문과 태그를 복사했습니다.")},[a,g.body,x]),H=d.useCallback(()=>{a(x.join(" "),"태그를 복사했습니다.")},[a,x]),F=d.useCallback(async()=>{if(!g.body.trim()&&x.length===0){i("저장할 내용이 없습니다.");return}try{const p=await ee({platform:h,speechStyle:l,tone:c,title:v||void 0,body:g.body,tags:x});r("저장되었습니다."),s(`/marketing/saved/${p.id??""}`)}catch{try{te({platform:h,speechStyle:l,tone:c,title:v||void 0,body:g.body,tags:x}),r("오프라인으로 저장되었습니다."),s("/marketing/saved")}catch{i("저장에 실패했습니다.")}}},[v,g.body,i,s,h,l,r,x,c]);return{data:{items:f,summary:n?.summary,tone:c,toneLabel:G,speechStyle:l,speechLabel:w,platformChoice:h,formatStyle:j,directionText:I,summaryDirections:m,selectedDirectionIndex:y,draft:g,tagsList:x,blogTitle:v},ui:{tagInput:k,setTagInput:A,igImgIdx:T,setIgImgIdx:M},actions:{copyBody:b,copyBodyAndTags:D,copyTags:H,saveDraft:F}}}function Fe(){const{data:e,ui:s,actions:r}=Ne();return t.jsx(ge,{itemsCount:e.items.length,toneLabel:e.toneLabel,speechLabel:e.speechLabel,platformChoice:e.platformChoice,directionText:e.directionText,body:e.draft.body,tagInput:s.tagInput,onTagInputChange:s.setTagInput,tagsList:e.tagsList,tagCount:e.draft.tags.length,blogTitle:e.blogTitle,summaryDirections:e.summaryDirections,selectedDirectionIndex:e.selectedDirectionIndex,images:e.draft.images,currentImageIndex:s.igImgIdx,onPrevImage:()=>s.setIgImgIdx(i=>Math.max(0,i-1)),onNextImage:()=>s.setIgImgIdx(i=>Math.min(e.draft.images.length-1,i+1)),onSelectImage:i=>s.setIgImgIdx(i),canPrevImage:s.igImgIdx>0,canNextImage:s.igImgIdx<e.draft.images.length-1,onCopyBody:r.copyBody,onCopyBodyAndTags:r.copyBodyAndTags,onCopyTags:r.copyTags,onSaveDraft:r.saveDraft})}export{Fe as default};
