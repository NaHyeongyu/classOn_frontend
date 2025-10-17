import{u as b,j as t,d as o}from"./index-Bf8ggjEf.js";import{d as $,e as j}from"./UI-27qTHgPb.js";import{E as v}from"./EmptyPlaceholder-ilYvfVTi.js";import{a as g}from"./format-Do6vjlY3.js";function Y({items:e,onAdd:n,actionLabel:a="+ 수업 추가",titleMode:i="subject",showNotes:d=!0,embedded:c=!1}){const l=b(),p=Array.isArray(e)?e:[],s=typeof n=="function";return t.jsxs(H,{$embedded:c,children:[t.jsxs(I,{"data-embedded":c||void 0,children:[t.jsxs(M,{children:[t.jsx(z,{"aria-hidden":!0,children:q}),t.jsx("h4",{children:"수업 내역"})]}),s&&t.jsx(B,{children:t.jsx(A,{type:"button",onClick:n,children:a})})]}),t.jsx(C,{$embedded:c,children:p.length===0?t.jsx(v,{title:"등록된 수업 내역이 없습니다.",description:"오늘 수업을 기록하면 출석과 수업 내용을 한 번에 관리할 수 있어요.",actionLabel:s?a.replace(/^\+\s*/,""):void 0,onAction:s?n:void 0,actionVariant:"outline"}):p.map((r,f)=>{const u=k(r.date,r.time),x=S(u);return t.jsxs(L,{children:[t.jsxs(R,{children:[t.jsxs("div",{children:[t.jsx("strong",{children:i==="date"?w(r.date):r.subject||"수업"}),(r.time||u)&&t.jsxs(E,{children:[r.time&&t.jsx(P,{children:r.time}),u&&t.jsxs(W,{"data-variant":x,children:[t.jsx("span",{"aria-hidden":!0,children:D(x)}),u]})]})]}),t.jsxs(G,{children:[r.date&&t.jsx(N,{"aria-label":"수업 일자",children:y(r.date)}),r.courseId&&(r.recordId||r.date)&&t.jsx(V,{type:"button",onClick:()=>{r.recordId?l(`/classes/${r.courseId}/history/${r.recordId}`):l(`/classes/${r.courseId}/history/date/${r.date}`)},children:"상세"})]})]}),t.jsx(m,{children:"출석"}),t.jsxs("div",{style:{display:"flex",gap:12,alignItems:"center"},children:[t.jsxs(h,{"data-variant":"present",children:["출석 ",r.attPresent??0,"명"]}),t.jsxs(h,{"data-variant":"absent",children:["결석 ",r.attAbsent??0,"명"]}),t.jsxs(h,{"data-variant":"none",children:["미처리 ",r.attUnprocessed??0,"명"]})]}),d&&t.jsxs(t.Fragment,{children:[t.jsx(m,{children:"수업 내용"}),t.jsx(T,{children:r.notes&&r.notes.trim()?r.notes:"—"})]})]},`cls-${f}`)})})]})}function w(e){if(!e)return"-";const n=g(e,{includeWeekday:!0});return n==="—"?e:n}function y(e){if(!e)return"-";const n=g(e,{includeYear:!1,includeWeekday:!0});return n==="—"?e:n}function k(e,n){if(!e)return"";try{const a=new Date;a.setHours(0,0,0,0);const i=new Date(e);if(i.setHours(0,0,0,0),i<a)return"지난 수업";if(i>a)return"예정";const d=(n||"").split("~")[1]?.trim();if(d&&/^\d{2}:\d{2}$/.test(d)){const[c,l]=d.split(":").map(Number),p=new Date,s=new Date;if(s.setHours(c,l,0,0),p>s)return"지난 수업"}return"예정"}catch{return""}}function S(e){return e==="지난 수업"?"past":e==="예정"?"upcoming":"default"}function D(e){switch(e){case"past":return"⌛";case"upcoming":return"🗓";default:return"•"}}const H=o.section`
  border: ${({$embedded:e,theme:n})=>e?"none":`1px solid ${n.colors.border}`};
  border-radius: ${({$embedded:e,theme:n})=>e?"0":n.radii.lg};
  padding: ${({$embedded:e})=>e?"0":"12px"};
  background: ${({$embedded:e,theme:n})=>e?"transparent":n.colors.surface};
  display: flex;
  flex-direction: column;
  height: 100%; /* fill half container */
  min-height: 0; /* allow Grid to scroll */
`,I=o.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  h4 {
    margin: 0;
    font-size: 15px;
    color: ${e=>e.theme.colors.text};
  }
  &[data-embedded] {
    margin-bottom: 12px;
  }
`,M=o.div`
  display: flex;
  align-items: center;
  gap: 8px;
`,z=o.span`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  background: ${e=>e.theme.colors.primarySurface};
  color: ${e=>e.theme.colors.primary};
`,B=o.div``,A=o($)`
  white-space: nowrap;
`,C=o.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  padding: ${({$embedded:e})=>e?"0":"4px 2px"};
  flex: 1 1 auto;
  min-height: 0;
  align-content: start; /* prevent single card from stretching to fill */
  align-items: start; /* keep item height to content */
  grid-auto-rows: max-content; /* row height equals content height */
`,L=o.div`
  border: 1px solid ${e=>e.theme.colors.border};
  border-radius: ${e=>e.theme.radii.md};
  padding: 12px;
  background: ${e=>e.theme.colors.surface};
  display: grid;
  gap: 10px;
`,R=o.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`,P=o.span`
  color: ${e=>e.theme.colors.textMuted};
  font-size: 12px;
`,E=o.div`
  display: flex;
  gap: 8px;
  margin-top: 4px;
  flex-wrap: wrap;
`,W=o.span`
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
`,G=o.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  flex-wrap: wrap;
`,N=o.span`
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
`,m=o.div`
  font-size: 12px;
  font-weight: 800;
  color: #6b7280;
  margin-top: 4px;
`,T=o.div`
  white-space: pre-wrap;
  border: 1px solid ${e=>e.theme.colors.borderMuted};
  border-radius: ${e=>e.theme.radii.md};
  padding: 10px;
  background: ${e=>e.theme.colors.surfaceMuted};
  color: ${e=>e.theme.colors.text};
  font-size: 14px;
  line-height: 1.5;
  max-height: calc(1.5em * 3 + 20px); /* 3 lines + vertical padding */
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3; /* show 3 lines */
  -webkit-box-orient: vertical;
`,h=o.span`
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
`,V=o(j)`
  height: 40px;
  padding: 0 16px;
  font-size: 14px;
`,q=t.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[t.jsx("path",{d:"M4 19.5A2.5 2.5 0 0 1 6.5 17H20"}),t.jsx("path",{d:"M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"})]});export{Y as C};
