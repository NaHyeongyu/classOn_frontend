import{d as t,j as e,G as ne,u as te,r as a}from"./index-B0K7mn4q.js";import{C as re}from"./ConfirmDialog-ClQeXE4D.js";import{S as ie,d as X,P as se,j as Y}from"./UI-Cj3YhchZ.js";import{d as ae,e as oe,f as le,c as ce,b as de}from"./constants-UoNuUtwe.js";import{m as Z,d as pe,b as xe,c as ue}from"./utils-D2trpR9j.js";const he=t.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
`,R=t.div`
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid ${({theme:n})=>n.colors.border};
  font-size: 12px;
  color: ${({theme:n})=>n.colors.textMuted};
  &[data-active='true'] {
    background: ${({theme:n})=>n.colors.primarySurface};
    color: ${({theme:n})=>n.colors.primary};
    border-color: ${({theme:n})=>n.colors.border};
    font-weight: 800;
  }
  &[data-done='true'] {
    background: ${({theme:n})=>n.colors.surfaceMuted};
    color: ${({theme:n})=>n.colors.text};
  }
`,K=t.span`
  width: 10px;
  height: 1px;
  background: ${({theme:n})=>n.colors.border};
  display: inline-block;
`,ge=t.header`
  display: grid;
  gap: 16px;
  margin-bottom: 12px;
`,fe=t.section`
  display: grid;
  gap: 12px;
  padding: 18px;
  border-radius: 18px;
  background: linear-gradient(135deg, rgba(248, 250, 252, 0.94), rgba(224, 231, 255, 0.8));
  border: 1px solid rgba(203, 213, 225, 0.4);
`,me=t.div`
  display: grid;
  gap: 4px;
  h1 {
    margin: 0;
    font-size: 24px;
    font-weight: 800;
    color: #111827;
  }
  p {
    margin: 0;
    font-size: 14px;
    color: #475569;
  }
`,be=t.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`,H=t.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  font-size: 12px;
  border-radius: 999px;
  background: rgba(99, 102, 241, 0.08);
  color: #4338ca;
  font-weight: 600;
`,je=t.div`
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  gap: 16px;
  align-items: start;
  @media (max-width: 1080px) {
    grid-template-columns: 1fr;
  }
`,ye=t.div`
  display: grid;
  gap: 16px;
`,ve=t.div`
  display: grid;
  gap: 16px;
`,w=t(ie)`
  display: grid;
  gap: 12px;
  padding: 18px;
  border-radius: 18px;
  border: none;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.05);
  h2 {
    margin: 0;
    font-size: 18px;
    color: #111827;
  }
  .hint {
    margin: 0;
    font-size: 13px;
    color: #64748b;
  }
`,Se=t.div`
  border-radius: 18px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  padding: 20px;
  min-height: 220px;
  display: grid;
  gap: 10px;
  box-shadow: 0 18px 42px rgba(15, 23, 42, 0.08);
  border: 1px solid rgba(226, 232, 240, 0.7);
  max-height: 380px;
  overflow-y: auto;
`,U=t.div`
  display: grid;
  gap: 14px;
  font-size: 14px;
  line-height: 1.8;
  color: #1f2937;
  white-space: pre-wrap;
  p {
    margin: 0;
  }
`,De=t.div`
  display: grid;
  gap: 12px;
`,ke=t.button`
  display: grid;
  gap: 10px;
  padding: 16px;
  border-radius: 18px;
  border: 1px solid rgba(203, 213, 225, 0.7);
  background: #ffffff;
  text-align: left;
  cursor: pointer;
  transition: border-color 0.18s ease, box-shadow 0.18s ease, transform 0.12s ease;
  &[data-active='true'] {
    border-color: #4f46e5;
    box-shadow: 0 16px 32px rgba(79, 70, 229, 0.16);
    transform: translateY(-1px);
  }
`,Ce=t.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
`,Ie=t.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  background: rgba(59, 130, 246, 0.12);
  color: #1d4ed8;
`,we=t.span`
  font-size: 12px;
  color: #475569;
`,Te=t.h3`
  margin: 0;
  font-size: 16px;
  color: #111827;
`,$e=t.p`
  margin: 0;
  font-size: 13px;
  color: #475569;
`,ze=t.p`
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: #1f2937;
`,Le=t.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`,V=t.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  background: ${({tone:n})=>n==="neutral"?"#f1f5f9":"#eef2ff"};
  color: ${({tone:n})=>n==="neutral"?"#475569":"#4338ca"};
`,Me=t.span`
  font-size: 12px;
  color: #64748b;
`,Ee=t.div`
  display: grid;
  gap: 8px;
`,Pe=t.span`
  font-size: 13px;
  font-weight: 700;
  color: #1f2937;
`,Ae=t.textarea`
  border: 1px solid ${({theme:n})=>n.colors.border};
  border-radius: 14px;
  padding: 12px 14px;
  resize: vertical;
  font-size: 14px;
  min-height: 80px;
`,Ne=t.span`
  font-size: 12px;
  color: #64748b;
`,Be=t.div`
  display: grid;
  gap: 8px;
`,_e=t.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid ${({theme:n})=>n.colors.border};
  background: ${({theme:n})=>n.colors.surfaceMuted};
  .index {
    font-weight: 700;
    color: ${({theme:n})=>n.colors.text};
  }
`,Ge=t.input`
  flex: 1;
  min-width: 0;
  height: 40px;
  border-radius: 12px;
  border: 1px solid ${({theme:n})=>n.colors.border};
  padding: 0 12px;
  background: #ffffff;
  font-size: 13px;
  color: ${({theme:n})=>n.colors.text};
`,W=t.div`
  display: grid;
  place-items: center;
  padding: 14px;
  border-radius: 12px;
  border: 1px dashed ${({theme:n})=>n.colors.border};
  font-size: 13px;
  color: ${({theme:n})=>n.colors.textMuted};
`,Oe=t.div`
  display: grid;
  gap: 10px;
`,Re=t.button`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  text-align: left;
  border-radius: 16px;
  border: 1px solid rgba(203, 213, 225, 0.7);
  background: #ffffff;
  cursor: pointer;
  transition: border-color 0.18s ease, box-shadow 0.18s ease, transform 0.12s ease;
  .icon {
    font-size: 20px;
  }
  strong {
    font-size: 14px;
    color: #111827;
  }
  small {
    font-size: 12px;
    color: #64748b;
  }
  &[data-active='true'] {
    border-color: #4f46e5;
    box-shadow: 0 12px 24px rgba(79, 70, 229, 0.18);
    transform: translateY(-2px);
  }
`,q=t.div`
  margin-top: 6px;
  font-size: 12px;
  font-weight: 700;
  color: #475569;
`,J=t.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`,Q=t.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 12px;
  border-radius: 999px;
  border: 1px solid rgba(203, 213, 225, 0.8);
  background: #ffffff;
  cursor: pointer;
  font-size: 13px;
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
  &[data-active='true'] {
    background: rgba(99, 102, 241, 0.16);
    color: #4338ca;
    border-color: rgba(99, 102, 241, 0.4);
    font-weight: 700;
  }
`,He=t.footer`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 18px;
`,Fe=t(X)`
  min-width: 148px;
`;function Ye({state:n,computed:c,dialog:i,handlers:S}){const{directionText:x,selectedDirectionIndex:u,bullets:l,speechStyle:D,platformChoice:h,formatStyle:f}=n,{items:d,toneLabel:m,speechLabel:k,directions:b,summary:g}=c,{pendingDeleteIndex:C,setPendingDeleteIndex:j}=i,{handleSelectDirection:M,handleDirectionChange:I,handleAddBullet:E,handleUpdateBullet:y,handleDeleteBullet:T,handleSpeechChange:P,handlePlatformChange:A,handleFormatChange:N,handleNext:B}=S,$=C!==null?`#${C+1}`:"",_=(r,o)=>{const G=r.slice(0,6).map(p=>`• ${p.date}${p.courseTitle?` [${p.courseTitle}]`:""}: ${p.content||""}`),O=r.length>6?`
... (외 ${r.length-6}행)`:"",s=o.trim()?o.trim():`${G.join(`
`)}${O}`;return e.jsx(U,{children:e.jsx("p",{children:s})})};return e.jsxs(se,{children:[e.jsxs(he,{children:[e.jsx(R,{"data-active":!1,"data-done":!0,"aria-current":!1,children:"1. 작성 가이드"}),e.jsx(K,{}),e.jsx(R,{"data-active":!0,"aria-current":"step",children:"2. 전송 미리보기"}),e.jsx(K,{}),e.jsx(R,{"data-active":!1,"aria-current":!1,children:"3. 생성/편집"})]}),e.jsx(ge,{children:e.jsxs(fe,{children:[e.jsxs(me,{children:[e.jsx("h1",{children:"전송 전 내용을 한번 더 점검해요"}),e.jsx("p",{children:"요약과 핵심 문장을 확인하고 설정을 마친 뒤 다음 단계로 넘어가세요."})]}),e.jsxs(be,{children:[e.jsxs(H,{children:["선택 항목 ",d.length,"건"]}),e.jsxs(H,{children:["톤 ",m]}),e.jsxs(H,{children:["말투 ",k]})]})]})}),e.jsxs(je,{children:[e.jsxs(ye,{children:[e.jsxs(w,{children:[e.jsx("h2",{children:"AI 요약 내용"}),e.jsx("p",{className:"hint",children:"최근 수업 활동을 분석한 결과를 확인하세요."}),e.jsx(Se,{children:g?.summary?e.jsx(U,{children:e.jsx("p",{children:g.summary})}):_(d,x)})]}),e.jsxs(w,{children:[e.jsx("h2",{children:"콘텐츠 방향 제안"}),e.jsx("p",{className:"hint",children:"AI가 추천한 방향을 선택하고 필요하면 내용을 다듬어 주세요."}),b.length?e.jsx(De,{role:"list",children:b.map((r,o)=>e.jsxs(ke,{type:"button",role:"listitem","data-active":u===o||void 0,"aria-pressed":u===o,onClick:()=>M(o),children:[e.jsxs(Ce,{children:[e.jsxs(Ie,{children:["추천 #",o+1]}),r.platform?e.jsx(we,{children:Z(r.platform)}):null]}),e.jsx(Te,{children:r.title||`콘텐츠 방향 ${o+1}`}),r.because?e.jsx($e,{children:r.because}):null,r.hook?e.jsxs(ze,{"aria-label":"hook",children:["“",r.hook,"”"]}):null,e.jsx(Le,{children:e.jsx(Ke,{direction:r})}),e.jsx(Me,{"aria-hidden":!0,children:u===o?"선택됨":"이 방향 사용"})]},o))}):e.jsx(W,{children:"추천 방향이 없어요. 아래 입력 칸에 직접 작성해 주세요."}),e.jsxs(Ee,{children:[e.jsx(Pe,{children:"선택한 방향 (수정 가능)"}),e.jsx(Ae,{value:x,onChange:r=>I(r.currentTarget.value),placeholder:"예) 실습 과정을 사진으로 보여 주고, 오답 교정을 강조해 주세요.",rows:4}),e.jsx(Ne,{children:"이 내용은 다음 단계에서 플랫폼별 문장을 생성할 때 참고합니다."})]})]}),e.jsxs(w,{children:[e.jsx("h2",{children:"핵심 문장"}),e.jsx("p",{className:"hint",children:"핵심 문장을 검토하고 바로 수정할 수 있어요."}),e.jsx(Be,{role:"list",children:l.length===0?e.jsx(W,{children:"핵심 문장이 아직 없습니다. 아래 버튼으로 추가해 보세요."}):l.map((r,o)=>e.jsxs(_e,{children:[e.jsxs("span",{className:"index",children:["#",o+1]}),e.jsx(Ge,{value:r,onChange:z=>y(o,z.target.value),placeholder:`핵심 내용 ${o+1}`}),e.jsx(Y,{as:"button","data-variant":"danger",onClick:()=>j(o),children:"삭제"})]},o))}),e.jsx("div",{children:e.jsx(X,{type:"button",onClick:E,children:"+ 항목 추가"})})]})]}),e.jsxs(ve,{children:[e.jsxs(w,{children:[e.jsx("h2",{children:"플랫폼 선택"}),e.jsx("p",{className:"hint",children:"콘텐츠를 게시할 채널을 선택하세요."}),e.jsx(Oe,{children:ae.map(r=>e.jsxs(Re,{"data-active":h===r.value,onClick:()=>A(r.value),children:[e.jsx("span",{className:"icon",role:"img","aria-label":r.name,children:r.icon}),e.jsx("strong",{children:r.name}),e.jsx("small",{children:r.description})]},r.value))})]}),e.jsxs(w,{children:[e.jsx("h2",{children:"톤 & 문장 어미"}),e.jsx("p",{className:"hint",children:"말투와 양식을 설정하면 결과물에 반영돼요."}),e.jsx(q,{children:"문장 어미"}),e.jsx(J,{children:oe.map(r=>e.jsxs(Q,{"data-active":D===r.value,onClick:()=>P(r.value),children:[e.jsx("span",{children:r.emoji}),e.jsx("span",{children:r.label})]},r.value))}),e.jsx(q,{children:"양식"}),e.jsx(J,{children:le.map(r=>e.jsxs(Q,{"data-active":f===r.value,onClick:()=>N(r.value),children:[e.jsx("span",{children:r.emoji}),e.jsx("span",{children:r.label})]},r.value))})]})]})]}),e.jsxs(He,{children:[e.jsx(Y,{as:"button",onClick:()=>window.history.back(),children:"← 이전"}),e.jsx(Fe,{type:"button",onClick:B,disabled:!d.length,children:"다음 단계"})]}),e.jsx(re,{open:C!==null,title:"항목을 삭제할까요?",message:$?`${$} 핵심 문장을 삭제합니다.`:"선택한 항목을 삭제합니다.",confirmLabel:"삭제",cancelLabel:"취소",tone:"danger",onConfirm:T,onCancel:()=>j(null)})]})}function Ke({direction:n}){return e.jsxs(e.Fragment,{children:[n.asset?e.jsx(V,{children:pe(n.asset)}):null,n.platform?e.jsx(V,{tone:"neutral",children:Z(n.platform)}):null]})}function Ue(n){return xe(n?.directions)}function Ve(n,c){if(typeof c?.selectedDirectionIndex=="number"){const i=c.selectedDirectionIndex;return i>=0&&i<n.length?i:null}return c?.direction?.trim()?null:n.length?0:null}function F(n,c){if(c==null)return"";const i=n[c];return i?ue(i):""}function We(n){return ce[n]??n}function qe(n){return de[n]??n}function Je(){const n=ne(),c=te(),i=n.state,S=a.useMemo(()=>i?.items??[],[i?.items]),x=i?.summary,u=i?.tone??"WARM_VIVID",l=a.useMemo(()=>Ue(x),[x]),D=a.useMemo(()=>Ve(l,i),[l,i]),[h,f]=a.useState(()=>{const s=i?.direction?.trim();return s||(D!==null?F(l,D):"")}),[d,m]=a.useState(D),[k,b]=a.useState(x?.bullets??i?.bullets??[]),[g,C]=a.useState(i?.speechStyle??"SEUMNIDA"),[j,M]=a.useState(i?.platformChoice??"INSTAGRAM"),[I,E]=a.useState(i?.formatStyle??"STORY"),[y,T]=a.useState(null);a.useEffect(()=>{const s=i?.direction?.trim();if(s){h!==s&&f(s);const L=typeof i?.selectedDirectionIndex=="number"?i.selectedDirectionIndex:null;d!==L&&m(L);return}if(!l.length){h!==""&&f(""),d!==null&&m(null);return}const p=typeof i?.selectedDirectionIndex=="number"&&i.selectedDirectionIndex>=0&&i.selectedDirectionIndex<l.length?i.selectedDirectionIndex:0,v=F(l,p);d!==p&&m(p),h!==v&&f(v)},[h,l,d,i?.direction,i?.selectedDirectionIndex]);const P=a.useMemo(()=>We(u),[u]),A=a.useMemo(()=>qe(g),[g]),N=a.useCallback(s=>{m(s),f(F(l,s))},[l]),B=a.useCallback(s=>{f(s),m(null)},[]),$=a.useCallback(()=>{b(s=>[...s,""])},[]),_=a.useCallback((s,p)=>{b(v=>v.map((L,ee)=>ee===s?p:L))},[]),r=a.useCallback(()=>{b(s=>y==null?s:s.filter((p,v)=>v!==y)),T(null)},[y]),o=a.useCallback(s=>{C(s)},[]),z=a.useCallback(s=>{M(s)},[]),G=a.useCallback(s=>{E(s)},[]),O=a.useCallback(()=>{c("/marketing/rendering",{state:{...i,items:S,direction:h.trim(),bullets:k,tone:u,speechStyle:g,platformChoice:j,formatStyle:I,summary:x,selectedDirectionIndex:d}})},[c,i,S,h,k,u,g,j,I,x,d]);return{state:{directionText:h,selectedDirectionIndex:d,bullets:k,speechStyle:g,platformChoice:j,formatStyle:I},computed:{items:S,tone:u,toneLabel:P,speechLabel:A,directions:l,summary:x},dialog:{pendingDeleteIndex:y,setPendingDeleteIndex:T},handlers:{handleSelectDirection:N,handleDirectionChange:B,handleAddBullet:$,handleUpdateBullet:_,handleDeleteBullet:r,handleSpeechChange:o,handlePlatformChange:z,handleFormatChange:G,handleNext:O}}}function tn(){const n=Je();return e.jsx(Ye,{...n})}export{tn as default};
