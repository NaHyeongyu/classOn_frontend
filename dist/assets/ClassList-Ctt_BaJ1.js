import{u as f,j as t,d as n,c as m,b}from"./index-C5H-3XpS.js";import{E as $}from"./EmptyPlaceholder-DH9zVN9s.js";function O({items:e,onAdd:o,actionLabel:s="+ 수업 추가",titleMode:a="subject",showNotes:i=!0}){const c=f(),l=Array.isArray(e)?e:[],d=typeof o=="function";return t.jsxs(S,{children:[t.jsxs(D,{children:[t.jsxs(M,{children:[t.jsx(z,{"aria-hidden":!0,children:G}),t.jsx("h4",{children:"수업 내역"})]}),d&&t.jsx(H,{children:t.jsx(I,{type:"button",onClick:o,children:s})})]}),t.jsx(A,{children:l.length===0?t.jsx($,{title:"등록된 수업 내역이 없습니다.",description:"오늘 수업을 기록하면 출석과 수업 내용을 한 번에 관리할 수 있어요.",actionLabel:d?s.replace(/^\+\s*/,""):void 0,onAction:d?o:void 0,actionVariant:"outline"}):l.map((r,g)=>{const p=v(r.date,r.time),h=y(p);return t.jsxs(B,{children:[t.jsxs(C,{children:[t.jsxs("div",{children:[t.jsx("strong",{children:a==="date"?j(r.date):r.subject||"수업"}),(r.time||p)&&t.jsxs(L,{children:[r.time&&t.jsx(N,{children:r.time}),p&&t.jsxs(R,{"data-variant":h,children:[t.jsx("span",{"aria-hidden":!0,children:k(h)}),p]})]})]}),t.jsxs(T,{children:[r.date&&t.jsx(E,{"aria-label":"수업 일자",children:w(r.date)}),r.courseId&&(r.recordId||r.date)&&t.jsx(V,{type:"button",onClick:()=>{r.recordId?c(`/classes/${r.courseId}/history/${r.recordId}`):c(`/classes/${r.courseId}/history/date/${r.date}`)},children:"상세"})]})]}),t.jsx(x,{children:"출석"}),t.jsxs("div",{style:{display:"flex",gap:12,alignItems:"center"},children:[t.jsxs(u,{"data-variant":"present",children:["출석 ",r.attPresent??0,"명"]}),t.jsxs(u,{"data-variant":"absent",children:["결석 ",r.attAbsent??0,"명"]}),t.jsxs(u,{"data-variant":"none",children:["미처리 ",r.attUnprocessed??0,"명"]})]}),i&&t.jsxs(t.Fragment,{children:[t.jsx(x,{children:"수업 내용"}),t.jsx(P,{children:r.notes&&r.notes.trim()?r.notes:"—"})]})]},`cls-${g}`)})})]})}function j(e){if(!e)return"-";try{const o=new Date(e);if(Number.isNaN(o.getTime()))return e;const s="일월화수목금토"[o.getDay()];return`${e} (${s})`}catch{return e}}function w(e){if(!e)return"-";try{const o=new Date(e);if(Number.isNaN(o.getTime()))return e;const s=String(o.getMonth()+1).padStart(2,"0"),a=String(o.getDate()).padStart(2,"0"),i="일월화수목금토"[o.getDay()];return`${s}월 ${a}일 (${i})`}catch{return e}}function v(e,o){if(!e)return"";try{const s=new Date;s.setHours(0,0,0,0);const a=new Date(e);if(a.setHours(0,0,0,0),a<s)return"지난 수업";if(a>s)return"예정";const i=(o||"").split("~")[1]?.trim();if(i&&/^\d{2}:\d{2}$/.test(i)){const[c,l]=i.split(":").map(Number),d=new Date,r=new Date;if(r.setHours(c,l,0,0),d>r)return"지난 수업"}return"예정"}catch{return""}}function y(e){return e==="지난 수업"?"past":e==="예정"?"upcoming":"default"}function k(e){switch(e){case"past":return"⌛";case"upcoming":return"🗓";default:return"•"}}const S=n.section`
  border: 1px solid ${e=>e.theme.colors.border};
  border-radius: ${e=>e.theme.radii.lg};
  padding: 12px;
  background: ${e=>e.theme.colors.surface};
  display: flex;
  flex-direction: column;
  height: 100%; /* fill half container */
  min-height: 0; /* allow Grid to scroll */
`,D=n.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  h4 {
    margin: 0;
    font-size: 15px;
    color: ${e=>e.theme.colors.text};
  }
`,M=n.div`
  display: flex;
  align-items: center;
  gap: 8px;
`,z=n.span`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  background: ${e=>e.theme.colors.primarySurface};
  color: ${e=>e.theme.colors.primary};
`,H=n.div``,I=n.button`
  ${m.outline};
  height: 40px;
  padding: 0 16px;
  font-size: 14px;
  font-weight: 600;
`,A=n.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  padding: 4px 2px;
  overflow: auto; /* scroll within fixed half */
  flex: 1 1 auto;
  min-height: 0;
  align-content: start; /* prevent single card from stretching to fill */
  align-items: start; /* keep item height to content */
  grid-auto-rows: max-content; /* row height equals content height */
`,B=n.div`
  border: 1px solid ${e=>e.theme.colors.border};
  border-radius: ${e=>e.theme.radii.md};
  padding: 12px;
  background: ${e=>e.theme.colors.surface};
  display: grid;
  gap: 10px;
`,C=n.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`,N=n.span`
  color: ${e=>e.theme.colors.textMuted};
  font-size: 12px;
`,L=n.div`
  display: flex;
  gap: 8px;
  margin-top: 4px;
  flex-wrap: wrap;
`,R=n.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  background: ${e=>e.theme.colors.surfaceMuted};
  color: #4b5563;
  &[data-variant="past"] {
    background: ${e=>e.theme.colors.dangerSurface};
    color: ${e=>e.theme.colors.danger};
  }
  &[data-variant="upcoming"] {
    background: ${e=>e.theme.colors.successSurface};
    color: ${e=>e.theme.colors.success};
  }
`,T=n.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  flex-wrap: wrap;
`,E=n.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 999px;
  background: ${e=>e.theme.colors.primarySurface};
  color: ${e=>e.theme.colors.primary};
  font-weight: 700;
  font-size: 12px;
  white-space: nowrap;
`,x=n.div`
  font-size: 12px;
  font-weight: 800;
  color: #6b7280;
  margin-top: 4px;
`,P=n.div`
  white-space: pre-wrap;
  border: 1px solid ${e=>e.theme.colors.borderMuted};
  border-radius: ${e=>e.theme.radii.md};
  padding: 10px;
  background: ${e=>e.theme.colors.surfaceMuted};
  color: ${e=>e.theme.colors.text};
  font-size: 14px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* show 2 lines */
  -webkit-box-orient: vertical;
`,u=n.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid ${e=>e.theme.colors.border};
  font-size: 12px;
  font-weight: 800;
  color: #374151;
  background: ${e=>e.theme.colors.bg};
  &[data-variant="present"] {
    background: ${e=>e.theme.colors.successSurface};
    color: ${e=>e.theme.colors.success};
    border-color: #a7f3d0;
  }
  &[data-variant="absent"] {
    background: ${e=>e.theme.colors.dangerSurface};
    color: #7f1d1d;
    border-color: #fecaca;
  }
  &[data-variant="none"] {
    background: ${e=>e.theme.colors.surfaceMuted};
    color: ${e=>e.theme.colors.textMuted};
    border-color: ${e=>e.theme.colors.border};
  }
`,V=n(b)`
  height: 40px;
  padding: 0 16px;
  font-size: 14px;
`,G=t.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[t.jsx("path",{d:"M4 19.5A2.5 2.5 0 0 1 6.5 17H20"}),t.jsx("path",{d:"M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"})]});export{O as C};
