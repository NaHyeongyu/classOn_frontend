import{j as e,d as n,r as s,p as xe,i as X,b as ve,c as ye,u as Se,e as we}from"./index-B0K7mn4q.js";import{B as ke}from"./BackButton-BW37zkWn.js";import{C as Me}from"./ClassList-DQUoHMLi.js";import{c as De,d as fe,e as he,G as U,f as K}from"./UI-Cj3YhchZ.js";import{E as Te}from"./EmptyPlaceholder-0vR7E1DK.js";import{S as I}from"./SelectBox-DLApmcHT.js";import{a as $e,b as Ee}from"./format-DW-Kl_C3.js";import{p as Be,s as Ne,f as O}from"./dateUtils-CoPTMMCx.js";import{u as Le,l as ze,d as Ae,c as He,a as Pe}from"./todos-DjBL3ZpI.js";import{l as ge,c as Re}from"./counsels-CKa17QDL.js";import{c as Ie,l as Ye}from"./courses-DlbPyXYO.js";import{g as Z}from"./calendar-CvBZyv8u.js";import{r as P}from"./errors-C6OcbAl5.js";import{l as Fe}from"./students-BeT2wLPO.js";import{u as Oe}from"./useConfirmDialog-DCN8mg1d.js";import"./ConfirmDialog-ClQeXE4D.js";function Ge({label:t,onBack:o,onPrev:a,onNext:f,onToday:d}){return e.jsxs(Ve,{children:[e.jsx(We,{children:e.jsx(Ke,{label:"돌아가기",onClick:o})}),e.jsxs(_e,{children:[e.jsx(ee,{onClick:a,"aria-label":"이전 날짜",children:"<"}),e.jsx(Ue,{children:t}),e.jsx(ee,{onClick:f,"aria-label":"다음 날짜",children:">"})]}),e.jsx(qe,{children:e.jsx(Je,{type:"button",onClick:d,children:"오늘"})})]})}const Ve=n.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 12px;
  padding-bottom: 12px;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    justify-items: center;
    text-align: center;
  }
`,We=n.div`
  display: flex;
  @media (max-width: 768px) {
    order: 2;
  }
`,_e=n.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`,qe=n.div`
  display: flex;
  justify-content: flex-end;
  @media (max-width: 768px) {
    justify-content: center;
    order: 3;
  }
`,Ue=n.span`
  min-width: 150px;
  text-align: center;
  font-weight: 600;
  font-size: 25px;
  letter-spacing: -0.01em;
  color: #111827;
  padding: 6px 12px;
`,Ke=n(ke)`
  button {
    appearance: none;
    background: transparent;
    border: none;
    color: #111827;
    font-size: 14px;
    font-weight: 600;
    padding: 0;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
  }
  button:hover { color: #1f2937; }
  button:focus-visible { outline: 2px solid #111827; border-radius: 10px; outline-offset: 2px; }
`,ee=n.button`
  appearance: none;
  width: 30px;
  height: 30px;
  border: none;
  background: transparent;
  color: #111827;
  font-size: 18px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover { color: #1f2937; }
  &:active { transform: translateY(1px); }
  &:focus-visible { outline: 2px solid #111827; border-radius: 12px; outline-offset: 2px; }
`,Je=n.button`
  appearance: none;
  height: 36px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid #4f46e5;
  background: transparent;
  color: #4f46e5;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
  &:hover { background: rgba(79, 70, 229, 0.08); }
  &:active { background: rgba(79, 70, 229, 0.16); transform: translateY(1px); }
  &:focus-visible { outline: 2px solid #4f46e5; border-radius: 12px; outline-offset: 2px; }
`;function Qe({items:t,onAdd:o,onDetail:a}){return e.jsxs(Xe,{children:[e.jsxs(Ze,{children:[e.jsxs(et,{children:[e.jsx(tt,{"aria-hidden":!0,children:ct}),e.jsx("h4",{children:"상담 일정"})]}),e.jsx(nt,{children:o?e.jsx(ot,{type:"button",onClick:o,children:"+ 상담 추가"}):null})]}),e.jsx(at,{children:t.map((f,d)=>e.jsxs(rt,{children:[e.jsxs(it,{children:[e.jsx("div",{className:"left",children:e.jsx("strong",{children:f.with||"학생"})}),e.jsxs("div",{className:"right",children:[e.jsx(dt,{children:f.time}),a&&f.studentId?e.jsx(st,{type:"button",onClick:()=>a(f.studentId,f.id),children:"상세"}):null]})]}),e.jsx(lt,{children:(f.title||"").trim()||"내용 없음"})]},`cs-${d}`))})]})}const Xe=n.section`
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 12px;
  background: #fff;
  display: flex;
  flex-direction: column;
  height: 100%; /* fill half container */
  min-height: 0; /* allow Grid to scroll */
`,Ze=n.div`
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;
  h4 { margin: 0; font-size: 15px; color: #111827; }
`,et=n.div`
  display: flex; align-items: center; gap: 8px;
`,tt=n.span`
  width: 28px; height: 28px; border-radius: 8px; display: grid; place-items: center; background: #f3f4f6; color: #4f46e5;
`,nt=n.div``,ot=n(fe)``,st=n.button`
  ${De.outline};
  height: 40px;
  padding: 0 16px;
  font-size: 14px;
  font-weight: 600;
`,at=n.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  padding: 4px 2px;
  flex: 1 1 auto;
  min-height: 0;
  align-content: start; /* avoid vertical stretching when few items */
  align-items: start;
  grid-auto-rows: max-content;
`,rt=n.div`
  border: 1px solid #e5e7eb; border-radius: 12px; padding: 12px; background: #fff;
`,it=n.div`
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;
  .right { display:inline-flex; align-items:center; gap:8px; }
`,lt=n.div` color:#374151; font-size:13px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; `,dt=n.span`
  color: #6b7280; font-size: 12px; font-weight: 700;
`,ct=e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"})});function ut({inProgress:t,done:o,onAdd:a,onToggle:f,onDelete:d,onEdit:g}){const[u,l]=s.useState(t);return s.useEffect(()=>{l(t)},[t]),s.useEffect(()=>{},[o]),e.jsxs(pt,{children:[e.jsxs(xt,{children:[e.jsxs(ft,{children:[e.jsx(ht,{"aria-hidden":!0,children:Tt}),e.jsx("h4",{children:"할 일"}),e.jsx(mt,{children:t.length})]}),e.jsx(gt,{children:e.jsx(fe,{type:"button",onClick:a,children:"+ 할일 추가"})})]}),u.length===0?e.jsx(Te,{title:"오늘 등록된 할 일이 없습니다."}):e.jsx(bt,{children:u.map((i,r)=>e.jsxs(Ct,{children:[e.jsxs(jt,{children:[e.jsx(Mt,{"aria-hidden":!0}),e.jsxs(Dt,{children:[e.jsx(vt,{title:i.title,children:i.title}),i.content&&e.jsx(yt,{title:i.content,children:i.content})]})]}),e.jsxs(kt,{children:[typeof i.id=="number"&&e.jsx(St,{type:"button","data-variant":"edit",onClick:()=>g?.(i.id),children:"수정"}),typeof i.id=="number"&&e.jsx(wt,{type:"button",onClick:()=>void d?.(i.id),children:"삭제"})]})]},`p-${i.id??r}`))})]})}const pt=n.section`
  border: 1px solid #e5e7eb; border-radius: 16px; padding: 12px; background: #fff; display: flex; flex-direction: column;
`,xt=n.div`
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;
  h4 { margin: 0; font-size: 15px; color: #111827; }
`,ft=n.div`
  display: flex; align-items: center; gap: 8px;
`,ht=n.span`
  width: 28px; height: 28px; border-radius: 8px; display: grid; place-items: center; background: #eef2ff; color: #4f46e5;
`,gt=n.div``,mt=n.span`
  background: #e5e7eb; color: #374151; height: 20px; min-width: 22px; padding: 0 6px; border-radius: 9999px; display: inline-flex; align-items: center; justify-content: center; font-weight: 700; font-size: 12px;
`,bt=n.div`
  display: grid;
  gap: 8px;
  padding: 4px 2px;
  /* 상세 페이지는 내부 스크롤 없이 전체 표시 */
`,Ct=n.div`
  display: grid; grid-template-columns: 1fr auto; align-items: flex-start; gap: 10px;
  border: 1px solid #e5e7eb; border-radius: 10px; padding: 10px 12px; background: #fff;
  transition: background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
  &:hover { background: #fafafa; border-color: #e2e8f0; box-shadow: 0 1px 2px rgba(0,0,0,0.04); }
`,jt=n.div`
  display: grid; grid-template-columns: 10px 1fr; gap: 10px; align-items: flex-start; min-width: 0;
`,vt=n.div`
  font-weight: 800; margin-bottom: 2px; font-size: 14px; letter-spacing: -0.01em; color: #0f172a;
  display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;
`,yt=n.div`
  color: #64748b;
  font-size: 12.5px;
  line-height: 1.5;
  white-space: pre-line;
  display: -webkit-box;
  -webkit-line-clamp: 5; /* 상세 페이지는 5줄 표시 */
  -webkit-box-orient: vertical;
  overflow: hidden;
`,St=n(he)`
  height: 40px;
  padding: 0 16px;
  font-size: 14px;
`,wt=n(he)`
  height: 40px;
  padding: 0 16px;
  font-size: 14px;
  border-color: #ef4444;
  color: #ef4444;
  &:hover {
    background: #fee2e2;
    border-color: #dc2626;
  }
`,kt=n.div`
  display: flex; gap: 6px; align-items: center;
`,Mt=n.span`
  width: 10px; height: 10px; border-radius: 9999px; background: #4f46e5; margin-top: 5px;
`,Dt=n.div`
  display: flex; flex-direction: column; gap: 2px; min-width: 0;
`,Tt=e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"M20 6L9 17l-5-5"})});function $t({children:t}){return e.jsx(Lt,{children:t})}function Et({children:t}){return e.jsx(zt,{children:t})}function Bt({children:t}){return e.jsx(At,{children:t})}function Nt({children:t}){return e.jsx(Ht,{children:t})}const Lt=n.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  height: calc(100vh - 48px); /* account for main content padding */
  overflow: hidden; /* prevent page scroll; use internal scrolls */
`,zt=n.div`
  display: flex;
  gap: 12px;
  align-items: stretch;
  flex: 1 1 auto;
  min-height: 0; /* allow children to compute internal scroll */
  overflow: hidden;
  @media (max-width: 960px) { flex-direction: column; height: auto; overflow: visible; }
`,At=n.div`
  flex: 1 1 0;
  display: grid;
  grid-template-rows: 1fr 1fr; /* 5:5 (1:1) vertical split */
  gap: 12px;
  height: 100%;
  min-height: 0; /* enable internal scrolls in children */
`,Ht=n.div`
  flex: 1 1 0;
  display: grid;
  gap: 12px;
  align-content: flex-start;
  height: 100%;
  min-height: 0;
  overflow: auto; /* right column can scroll if long */
`;function Pt({open:t,editingId:o,formTitle:a,formNotes:f,todoErr:d,onClose:g,onSubmit:u,onChangeTitle:l,onChangeNotes:i}){return t?e.jsx(Rt,{onClick:g,children:e.jsxs(It,{onClick:r=>r.stopPropagation(),children:[e.jsx(Yt,{children:o==null?"할 일 추가":"할 일 수정"}),e.jsxs("form",{onSubmit:u,noValidate:!0,children:[e.jsxs(te,{children:["제목",e.jsx("span",{children:"*"})]}),e.jsx(Ft,{value:a,onChange:r=>l(r.target.value),placeholder:"예: 상담 준비","aria-invalid":!!d}),d&&e.jsx(Vt,{children:d}),e.jsx(te,{children:"메모 (선택)"}),e.jsx(Ot,{rows:4,value:f,onChange:r=>i(r.target.value),placeholder:"세부 내용 또는 참고사항"}),e.jsxs(Gt,{children:[e.jsx(U,{type:"button",onClick:g,children:"취소"}),e.jsx(K,{type:"submit",children:"저장"})]})]})]})}):null}const Rt=n.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.28);
  display: grid;
  place-items: center;
  z-index: 1200;
`,It=n.div`
  width: 480px;
  max-width: calc(100% - 32px);
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  box-shadow: 0 8px 28px rgba(2, 6, 23, 0.08);
  padding: 18px;
`,Yt=n.h3`
  margin: 0 0 10px;
  font-size: 17px;
  font-weight: 700;
  color: #111827;
`,te=n.label`
  display: block;
  margin: 8px 0 6px;
  font-size: 12px;
  color: #6b7280;

  span {
    color: #ef4444;
    margin-left: 4px;
  }
`,Ft=n.input`
  width: 100%;
  height: 40px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 12px;

  &[aria-invalid="true"] {
    border-color: #ef4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.12);
  }
`,Ot=n.textarea`
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 8px 12px;
  resize: vertical;
`,Gt=n.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
`,Vt=n.div`
  color: #b91c1c;
  font-size: 12px;
  margin-top: 6px;
`;function Wt({open:t,students:o,studFilter:a,onChangeFilter:f,studBusy:d,studErr:g,selStudent:u,onPickStudent:l,counselHour:i,counselMin:r,onChangeHour:S,onChangeMin:x,counselNote:w,onChangeNote:y,counselErr:b,onClose:C,onSave:j,savingCounsel:E,hours24:T,mins5:N}){if(!t)return null;const k=(o||[]).filter(h=>{if(!a)return!0;const c=a.toLowerCase();return h.name.toLowerCase().includes(c)||(h.code||"").toLowerCase().includes(c)}),$=E||!i||!r||!u;return e.jsx(_t,{onClick:C,children:e.jsxs(qt,{onClick:h=>h.stopPropagation(),children:[e.jsx(Ut,{children:"상담 추가"}),e.jsx(W,{children:"학생 선택"}),e.jsx(Kt,{placeholder:"학생 검색…",value:a,onChange:h=>f(h.target.value)}),e.jsxs(Jt,{children:[d&&e.jsx(ne,{children:"불러오는 중…"}),g&&e.jsx(oe,{children:g}),!d&&!g&&k.map(h=>e.jsxs(Qt,{type:"button","data-selected":u?.id===h.id,onClick:()=>l(h),onKeyDown:c=>{(c.key==="Enter"||c.key===" ")&&(c.preventDefault(),l(h))},children:[e.jsxs("div",{children:[e.jsx("strong",{children:h.name}),e.jsx(_,{style:{marginLeft:8},children:h.code})]}),e.jsx(_,{children:$e(h.phoneNumber)})]},h.id))]}),e.jsx("div",{style:{marginTop:8},children:u?e.jsxs(Xt,{children:[e.jsx("span",{className:"label",children:"선택된 학생"}),e.jsx("span",{className:"name",children:u.name}),u.code&&e.jsx(_,{style:{marginLeft:6},children:u.code})]}):e.jsx(ne,{children:"학생을 선택해 주세요."})}),e.jsx(W,{style:{marginTop:10},children:"시간"}),e.jsxs(Zt,{children:[e.jsx("div",{style:{flex:1},children:e.jsx(I,{ariaLabel:"시",value:i,onChange:S,placeholder:"시",options:T.map(h=>({label:h,value:h}))})}),e.jsx("span",{children:":"}),e.jsx("div",{style:{flex:1},children:e.jsx(I,{ariaLabel:"분",value:r,onChange:x,placeholder:"분",options:N.map(h=>({label:h,value:h}))})})]}),e.jsx(W,{style:{marginTop:10},children:"메모 (선택)"}),e.jsx(en,{rows:3,value:w,onChange:h=>y(h.target.value),placeholder:"상담 메모"}),b&&e.jsx(oe,{children:b}),e.jsxs(tn,{children:[e.jsx(U,{type:"button",onClick:C,children:"취소"}),e.jsx(K,{type:"button",disabled:$,onClick:j,children:E?"저장 중…":"저장"})]})]})})}const _t=n.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.28);
  display: grid;
  place-items: center;
  z-index: 1200;
`,qt=n.div`
  width: 480px;
  max-width: calc(100% - 32px);
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  box-shadow: 0 8px 28px rgba(2, 6, 23, 0.08);
  padding: 18px;
`,Ut=n.h3`
  margin: 0 0 10px;
  font-size: 17px;
  font-weight: 700;
  color: #111827;
`,W=n.label`
  display: block;
  margin: 8px 0 6px;
  font-size: 12px;
  color: #6b7280;
`,Kt=n.input`
  width: 100%;
  height: 40px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 12px;
`,Jt=n.div`
  max-height: 220px;
  overflow: auto;
  border: 1px solid #f1f5f9;
  border-radius: 10px;
  margin-top: 6px;
  background: #fff;
`,Qt=n.button`
  width: 100%;
  text-align: left;
  background: transparent;
  border: 0;
  padding: 8px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  border-bottom: 1px solid #f1f5f9;

  &[data-selected="true"] {
    background: #eef2ff;
  }

  &:hover {
    background: ${({theme:t})=>t.colors.surfaceMuted};
  }
`,_=n.span`
  color: #9ca3af;
  font-size: 12px;
`,ne=n.div`
  color: #6b7280;
  font-size: 12px;
`,Xt=n.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border: 1px solid #c7d2fe;
  background: #eef2ff;
  color: #1f2937;
  border-radius: 8px;
  font-size: 13px;

  .label {
    color: #4f46e5;
    font-weight: 800;
  }

  .name {
    font-weight: 800;
  }
`,Zt=n.div`
  display: flex;
  align-items: center;
  gap: 12px;
`,en=n.textarea`
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 8px 12px;
  resize: vertical;
`,tn=n.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
`,oe=n.div`
  color: #b91c1c;
  font-size: 12px;
  margin-top: 6px;
`;function nn({open:t,courseRows:o,courseFilter:a,onChangeFilter:f,courseBusy:d,courseErr:g,selectedCourse:u,onPickCourse:l,hours24:i,mins5:r,startHour:S,startMin:x,endHour:w,endMin:y,onChangeStartHour:b,onChangeStartMin:C,onChangeEndHour:j,onChangeEndMin:E,addErr:T,savingClass:N,onClose:k,onSave:$}){if(!t)return null;const h=(o||[]).filter(c=>{if(!a)return!0;const L=a.toLowerCase(),z=c.title?.toLowerCase()??"",m=c.code?.toLowerCase()??"";return z.includes(L)||m.includes(L)});return e.jsx(sn,{onClick:k,children:e.jsxs(an,{onClick:c=>c.stopPropagation(),children:[e.jsx(rn,{children:"수업 추가"}),e.jsx(ae,{children:"수업 템플릿 선택"}),e.jsx(ln,{placeholder:"검색어로 필터…",value:a,onChange:c=>f(c.target.value)}),e.jsxs(dn,{children:[d&&e.jsx(xn,{children:"불러오는 중…"}),g&&e.jsx(ie,{children:g}),!d&&!g&&h.map(c=>e.jsxs(cn,{"data-selected":u?.id===c.id,onClick:()=>l(c),children:[e.jsxs("div",{children:[e.jsx("strong",{children:c.title}),e.jsx(re,{style:{marginLeft:8},children:c.code})]}),e.jsx(re,{children:on(c.startTime,c.endTime)})]},c.id))]}),e.jsx(ae,{style:{marginTop:10},children:"시간"}),e.jsxs(un,{children:[e.jsx(G,{children:e.jsx(I,{ariaLabel:"시",value:S,onChange:b,placeholder:"시",options:i.map(c=>({label:c,value:c}))})}),e.jsx("span",{children:":"}),e.jsx(G,{children:e.jsx(I,{ariaLabel:"분",value:x,onChange:C,placeholder:"분",options:r.map(c=>({label:c,value:c}))})}),e.jsx("span",{children:"~"}),e.jsx(G,{children:e.jsx(I,{ariaLabel:"시",value:w,onChange:j,placeholder:"시",options:i.map(c=>({label:c,value:c}))})}),e.jsx("span",{children:":"}),e.jsx(G,{children:e.jsx(I,{ariaLabel:"분",value:y,onChange:E,placeholder:"분",options:r.map(c=>({label:c,value:c}))})})]}),T&&e.jsx(ie,{children:T}),e.jsxs(pn,{children:[e.jsx(U,{type:"button",onClick:k,children:"취소"}),e.jsx(K,{type:"button",disabled:N,onClick:$,children:N?"저장 중…":"저장"})]})]})})}function se(t){if(!t)return"--:--";try{const a=String(t).match(/(\d{2}):(\d{2})/);return a?`${a[1]}:${a[2]}`:"--:--"}catch{return"--:--"}}function on(t,o){return`${se(t)} ~ ${se(o)}`}const sn=n.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.28);
  display: grid;
  place-items: center;
  z-index: 1200;
`,an=n.div`
  width: 480px;
  max-width: calc(100% - 32px);
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  box-shadow: 0 8px 28px rgba(2, 6, 23, 0.08);
  padding: 18px;
`,rn=n.h3`
  margin: 0 0 10px;
  font-size: 17px;
  font-weight: 700;
  color: #111827;
`,ae=n.label`
  display: block;
  margin: 8px 0 6px;
  font-size: 12px;
  color: #6b7280;
`,ln=n.input`
  width: 100%;
  height: 40px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 12px;
`,dn=n.div`
  max-height: 220px;
  overflow: auto;
  border: 1px solid #f1f5f9;
  border-radius: 10px;
  margin-top: 6px;
  background: #fff;
`,cn=n.div`
  padding: 8px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  border-bottom: 1px solid #f1f5f9;

  &[data-selected="true"] {
    background: #eef2ff;
  }

  &:hover {
    background: ${({theme:t})=>t.colors.surfaceMuted};
  }
`,re=n.span`
  color: #9ca3af;
  font-size: 12px;
`,un=n.div`
  display: flex;
  align-items: center;
  gap: 12px;
`,G=n.div`
  flex: 1;
  min-width: 0;
`,pn=n.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
`,ie=n.div`
  color: #b91c1c;
  font-size: 12px;
  margin-top: 6px;
`,xn=n.div`
  color: #6b7280;
  font-size: 12px;
`;function fn({confirmDialog:t,header:o,todoList:a,counselList:f,classList:d,todoModal:g,counselModal:u,classModal:l,todoErrorMessage:i}){return e.jsxs($t,{children:[t,e.jsx(Ge,{label:o.label,onBack:o.onBack,onPrev:o.onPrev,onNext:o.onNext,onToday:o.onToday}),e.jsxs(Et,{children:[e.jsxs(Bt,{children:[e.jsx(ut,{inProgress:a.inProgress,done:a.done,onAdd:a.onAdd,onDelete:a.onDelete,onEdit:a.onEdit}),e.jsx(Qe,{items:f.items,onAdd:f.onAdd,onDetail:f.onDetail})]}),e.jsxs(Nt,{children:[e.jsx(Me,{items:d.items,titleMode:"subject",showNotes:!0,onAdd:d.onAdd}),e.jsx(Pt,{...g}),e.jsx(Wt,{...u}),e.jsx(nn,{...l}),i&&e.jsx("div",{style:{color:"#b91c1c",marginTop:8},children:i})]})]})]})}function hn(t){const o=s.useMemo(()=>t?Be(t):Ne(new Date),[t]),a=Ee(o,{includeWeekday:!0}),f=a==="—"?`${o.getFullYear()}년 ${o.getMonth()+1}월 ${o.getDate()}일`:a,{classesForDate:d}=Le({dates:[[o]]}),g=s.useMemo(()=>d(o),[d,o]),[u,l]=s.useState([]);s.useEffect(()=>{let x=!1;async function w(){try{const y=O(o);try{const E=`/api/counsels?${new URLSearchParams({onYmd:y,size:String(50)}).toString()}`,T=xe(E);if(T.data&&!x){const N=(T.data.content||[]).map(k=>({id:k.id,studentId:k.studentId,time:le(k.counselTime),title:(k.content||"").split(/\r?\n/)[0]||"상담",with:k.studentName,owner:"-",done:k.status==="CONVERTED"}));l(N)}}catch{}const b=await ge({onYmd:y,size:50});if(x)return;const C=(b.content||[]).map(j=>({id:j.id,studentId:j.studentId,time:le(j.counselTime),title:(j.content||"").split(/\r?\n/)[0]||"상담",with:j.studentName,owner:"-",done:j.status==="CONVERTED"}));l(C)}catch{x||l([])}}return w(),()=>{x=!0}},[o]);function i(){const x=new Date(o);return x.setDate(x.getDate()-1),O(x)}function r(){const x=new Date(o);return x.setDate(x.getDate()+1),O(x)}function S(){return O(new Date)}return{date:o,label:f,classes:g,counsels:u,prevYMD:i,nextYMD:r,todayYMD:S}}function le(t){if(!t)return"--:--";try{return t.replace("T"," ").slice(11,16)}catch{return"--:--"}}function q(...t){for(const o of t)if(typeof o=="number"&&Number.isFinite(o))return o;return 0}function gn(t){if(!t)return null;const o=String(t).trim();return o==="정기 수업"||o==="정기수업"?null:o||null}function de(t){if(!t)return"";try{const a=String(t).match(/(\d{2}):(\d{2})/);return a?`${a[1]}:${a[2]}`:""}catch{return""}}function ce(t){if(!t)return;const[o,a]=t.split(":");return`${o?.padStart(2,"0")}:${a?.padStart(2,"0")}:00`}function mn({ymd:t,derivedClasses:o,warning:a}){const[f,d]=s.useState([]),[g,u]=s.useState(!1),[l,i]=s.useState([]),[r,S]=s.useState(""),[x,w]=s.useState(!1),[y,b]=s.useState(null),[C,j]=s.useState(null),[E,T]=s.useState(!1),[N,k]=s.useState(null),[$,h]=s.useState(""),[c,L]=s.useState(""),[z,m]=s.useState(""),[B,A]=s.useState(""),H=s.useMemo(()=>Array.from({length:24},(v,p)=>String(p).padStart(2,"0")),[]),V=s.useMemo(()=>["00","05","10","15","20","25","30","35","40","45","50","55"],[]),Y=s.useCallback(v=>v.map(p=>{const M=p.startTime??p.start_at??p.startAt??p.start??null,R=p.endTime??p.end_at??p.endAt??p.end??null,F=q(p.attPresent,p.presentCount,p.attendancePresent,p.attendance?.present),be=q(p.attAbsent,p.absentCount,p.attendanceAbsent,p.attendance?.absent),Ce=q(p.attUnprocessed),je=gn(p.notes||p.content||p.topic||null);return{subject:p.courseTitle||"수업",time:`${ue(M)} ~ ${ue(R)}`,room:"-",teacher:"-",student:"-",done:!1,courseId:p.courseId||void 0,date:p.recordDate||p.date||t,recordId:p.recordId||p.id,notes:je,attPresent:F,attAbsent:be,attUnprocessed:Ce}}),[t]);return s.useEffect(()=>{let v=!1;async function p(){try{const M=await Z(t);if(v)return;d(Y(M))}catch{v||d(o)}}return p(),()=>{v=!0}},[o,Y,t]),{classes:f,addOpen:g,courseRows:l,courseFilter:r,courseBusy:x,courseErr:y,selectedCourse:C,savingClass:E,addErr:N,startHour:$,startMin:c,endHour:z,endMin:B,hours24:H,mins5:V,onAddClass:async()=>{if(u(!0),k(null),l.length===0){w(!0),b(null);try{const v=await Ye({status:"IN_PROGRESS",size:200});i(v.content)}catch(v){b(P(v,"수업 목록을 불러오지 못했습니다."))}finally{w(!1)}}},onCloseClassModal:()=>{u(!1)},onPickCourse:v=>{j(v);const p=de(v.startTime)||"00:00",M=de(v.endTime)||"00:00";try{const[R,F]=p.split(":");h(R),L(F)}catch{}try{const[R,F]=M.split(":");m(R),A(F)}catch{}k(null)},onChangeCourseFilter:S,onChangeStartHour:h,onChangeStartMin:L,onChangeEndHour:m,onChangeEndMin:A,onSaveClass:async()=>{if(!C){a("수업 템플릿을 선택해 주세요.");return}const v=ce(`${($||"00").padStart(2,"0")}:${(c||"00").padStart(2,"0")}`),p=ce(`${(z||"00").padStart(2,"0")}:${(B||"00").padStart(2,"0")}`);T(!0),k(null);try{await Ie(C.id,{recordDate:t,startTime:v,endTime:p}),X("/api/calendar/classes"),X("/api/calendar/classes-range");const M=await Z(t);d(Y(M)),u(!1),j(null)}catch(M){P(M,"").includes("HTTP 409")?k("이미 등록된 수업이 있습니다."):k("수업 추가에 실패했습니다.")}finally{T(!1)}}}}function ue(t){if(!t)return"--:--";try{const o=String(t).match(/(\d{2}):(\d{2})/);return o?`${o[1]}:${o[2]}`:"--:--"}catch{return"--:--"}}function bn({ymd:t,initialCounsels:o}){const[a,f]=s.useState(o);s.useEffect(()=>{f(o)},[o]);const[d,g]=s.useState(!1),[u,l]=s.useState([]),[i,r]=s.useState(""),[S,x]=s.useState(!1),[w,y]=s.useState(null),[b,C]=s.useState(null),[j,E]=s.useState(""),[T,N]=s.useState(!1),[k,$]=s.useState(null),[h,c]=s.useState(""),[L,z]=s.useState(""),m=s.useMemo(()=>Array.from({length:24},(D,v)=>String(v).padStart(2,"0")),[]),B=s.useMemo(()=>["00","05","10","15","20","25","30","35","40","45","50","55"],[]),A=s.useCallback(async()=>{x(!0),y(null);try{const D=await Fe({status:"ENROLLED",size:200});l(D.content)}catch(D){y(P(D,"학생 목록을 불러오지 못했습니다."))}finally{x(!1)}},[]),H=()=>{g(!0),$(null),c(""),z(""),A()},V=()=>{g(!1)},Y=D=>{C(D),$(null)},J=(D,v)=>!v||!/^\d{2}:\d{2}$/.test(v)?`${D}T00:00:00`:`${D}T${v}:00`,Q=s.useCallback(async D=>{const p=((await ge({onYmd:D,size:50})).content||[]).map(M=>({id:M.id,studentId:M.studentId,time:M.counselTime.replace("T"," ").slice(11,16),title:(M.content||"").split(/\r?\n/)[0]||"상담",with:M.studentName,owner:"-",done:M.status==="CONVERTED"}));f(p)},[]);return{items:a,open:d,students:u,studFilter:i,studBusy:S,studErr:w,selStudent:b,counselHour:h,counselMin:L,counselNote:j,counselErr:k,savingCounsel:T,hours24:m,mins5:B,onAddCounsel:H,onCloseCounsel:V,onChangeFilter:r,onChangeHour:c,onChangeMin:z,onChangeNote:E,onPickStudent:Y,onSaveCounsel:async()=>{if(!b){$("학생을 선택해 주세요.");return}const D=h&&L?`${h}:${L}`:"";if(!D){$("시간을 선택해 주세요.");return}const v=J(t,D);N(!0),$(null);try{await Re({studentId:b.id,counselTime:v,content:j||void 0}),await Q(t),g(!1),C(null),E("")}catch(p){$(P(p,"상담 추가에 실패했습니다."))}finally{N(!1)}}}}function pe(t){ve(`/api/todos?dueYmd=${t}`)}function Cn(t){const[o,a]=s.useState(null),[f,d]=s.useState(!1),[g,u]=s.useState(!1),[l,i]=s.useState(null),r=s.useRef(null),S=s.useRef(t),x=s.useCallback(async y=>{r.current&&r.current.abort();const b=new AbortController;r.current=b,i(null),y&&S.current===t?(u(!0),d(!1)):(d(!0),u(!1));try{const C=await ze(t,void 0,{signal:b.signal});if(S.current!==t)return;a(C)}catch(C){if(C?.name==="AbortError")return;i(P(C,"Failed to load todos"))}finally{S.current===t&&(d(!1),u(!1))}},[t]);s.useEffect(()=>{S.current=t;const y=`/api/todos?dueYmd=${t}`,b=xe(y),C=!!b.data;return C?(a(b.data),d(!1),u(!0)):(a(null),d(!0),u(!1)),x(C),()=>{r.current&&r.current.abort()}},[t,x]);const w=s.useCallback(()=>x(!!o&&S.current===t),[x,o,t]);return{data:o,loading:f,revalidating:g,error:l,refresh:w}}function jn({ymd:t,confirmDelete:o}){const{data:a,error:f,refresh:d}=Cn(t),[g,u]=s.useState(null),[l,i]=s.useState(!1),[r,S]=s.useState(null),[x,w]=s.useState(""),[y,b]=s.useState(""),[C,j]=s.useState(null),E=s.useMemo(()=>(a||[]).filter(m=>m.status!=="DONE").map(m=>({id:m.id,title:m.title,content:m.notes,done:!1})),[a]),T=s.useMemo(()=>(a||[]).filter(m=>m.status==="DONE").map(m=>({id:m.id,title:m.title,content:m.notes,done:!0})),[a]);return{inProgress:E,done:T,open:l,editingId:r,formTitle:x,formNotes:y,todoErr:C,mutationError:g,error:f,onAdd:()=>{S(null),w(""),b(""),j(null),i(!0)},onEdit:m=>{const B=(a||[]).find(A=>A.id===m);B&&(S(m),w(B.title),b(B.notes||""),j(null),i(!0))},onCloseModal:()=>{i(!1)},onSubmit:async m=>{if(m.preventDefault(),!x.trim()){j("제목을 입력해 주세요.");return}try{r==null?await He({title:x.trim(),notes:y||void 0,calendarDate:t}):await Pe(r,{title:x.trim(),notes:y||void 0}),pe(t),await d(),i(!1),j(null),u(null)}catch(B){u(P(B,"저장에 실패했습니다."))}},onDelete:async m=>{const B=(a||[]).find(H=>H.id===m);if(await o({title:"할 일을 삭제할까요?",message:B?.title?`"${B.title}" 항목을 삭제합니다. 되돌릴 수 없습니다.`:"선택한 할 일을 삭제합니다. 되돌릴 수 없습니다."}))try{await Ae(m),pe(t),await d(),u(null)}catch(H){u(P(H,"삭제에 실패했습니다."))}},onChangeTitle:m=>{w(m),C&&j(null)},onChangeNotes:m=>{b(m)}}}function vn({ymdParam:t}){const{warning:o}=ye(),{confirm:a,dialog:f}=Oe({confirmLabel:"삭제",cancelLabel:"취소",tone:"danger"}),d=t??O(new Date),{label:g,classes:u,counsels:l,prevYMD:i,nextYMD:r,todayYMD:S}=hn(d),x=mn({ymd:d,derivedClasses:u,warning:o}),w=jn({ymd:d,confirmDelete:a}),y=bn({ymd:d,initialCounsels:l}),b=w.mutationError||w.error||null;return{label:g,prevYMD:i,nextYMD:r,todayYMD:S,confirmDeleteDialog:f,classState:x,todoState:w,counselState:y,todoErrorMessage:b}}function Rn(){const t=Se(),{ymd:o}=we(),{label:a,prevYMD:f,nextYMD:d,todayYMD:g,confirmDeleteDialog:u,classState:l,todoState:i,counselState:r,todoErrorMessage:S}=vn({ymdParam:o}),x=()=>t("/calendar"),w=()=>t(`/calendar/${f()}`),y=()=>t(`/calendar/${d()}`),b=()=>t(`/calendar/${g()}`),C=j=>t(`/students/${j}/counsels`);return e.jsx(fn,{confirmDialog:u,header:{label:a,onBack:x,onPrev:w,onNext:y,onToday:b},todoList:{inProgress:i.inProgress,done:i.done,onAdd:i.onAdd,onDelete:i.onDelete,onEdit:i.onEdit},counselList:{items:r.items,onAdd:r.onAddCounsel,onDetail:C},classList:{items:l.classes,onAdd:l.onAddClass},todoModal:{open:i.open,editingId:i.editingId,formTitle:i.formTitle,formNotes:i.formNotes,todoErr:i.todoErr,onClose:i.onCloseModal,onSubmit:i.onSubmit,onChangeTitle:i.onChangeTitle,onChangeNotes:i.onChangeNotes},counselModal:{open:r.open,students:r.students,studFilter:r.studFilter,onChangeFilter:r.onChangeFilter,studBusy:r.studBusy,studErr:r.studErr,selStudent:r.selStudent,onPickStudent:r.onPickStudent,counselHour:r.counselHour,counselMin:r.counselMin,onChangeHour:r.onChangeHour,onChangeMin:r.onChangeMin,counselNote:r.counselNote,onChangeNote:r.onChangeNote,counselErr:r.counselErr,onClose:r.onCloseCounsel,onSave:r.onSaveCounsel,savingCounsel:r.savingCounsel,hours24:r.hours24,mins5:r.mins5},classModal:{open:l.addOpen,courseRows:l.courseRows,courseFilter:l.courseFilter,onChangeFilter:l.onChangeCourseFilter,courseBusy:l.courseBusy,courseErr:l.courseErr,selectedCourse:l.selectedCourse,onPickCourse:l.onPickCourse,hours24:l.hours24,mins5:l.mins5,startHour:l.startHour,startMin:l.startMin,endHour:l.endHour,endMin:l.endMin,onChangeStartHour:l.onChangeStartHour,onChangeStartMin:l.onChangeStartMin,onChangeEndHour:l.onChangeEndHour,onChangeEndMin:l.onChangeEndMin,addErr:l.addErr,savingClass:l.savingClass,onClose:l.onCloseClassModal,onSave:l.onSaveClass},todoErrorMessage:S})}export{Rn as default};
