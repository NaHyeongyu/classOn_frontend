import{u as ne,e as re,r as l,j as t,G as ae,d as r,c as G,S as W,q as oe,s as le,l as ce}from"./index-Dutj9l30.js";import{I as de}from"./InfoBanner-DgEMHfPy.js";import{g as ue,u as pe,a as he}from"./courses-BLp9JMdM.js";const me={title:"",description:"",status:"IN_PROGRESS",courseType:"GROUP"};function qe(){const e=ne(),{id:c}=re(),d=l.useMemo(()=>!!c,[c]),b=l.useMemo(()=>c?Number(c):null,[c]),[T,k]=l.useState(!1),[u,O]=l.useState(!1),[F,w]=l.useState(null),[U,z]=l.useState(null),[K,q]=l.useState(!0),[h,j]=l.useState({}),[n,p]=l.useState(()=>({...me})),[Y,P]=l.useState(""),J=_e(n,p),[o,Q]=l.useState(!0),[m,C]=l.useState(0),g=[{key:"basic",title:"기본 정보",lead:"수업명과 상태를 먼저 확인해 주세요."},{key:"schedule",title:"수업 일정",lead:"정기 반복 여부와 시간을 선택합니다."},{key:"details",title:"추가 설정",lead:"정원, 수강료, 설명을 정리해 마무리하세요."}],X=m===g.length-1,L=n.courseType==="INDIVIDUAL";function D(s){return String(s).padStart(2,"0")}function M(s){const i=String(s??"").replace(/[^0-9]/g,"");return i?Number(i).toLocaleString("ko-KR"):""}const B=l.useMemo(()=>Array.from({length:12},(s,i)=>D(i*5)),[]),Z=l.useMemo(()=>[{value:"INDIVIDUAL",label:"개인 수업",description:"1명의 학생과 진행되는 1:1 수업"},{value:"GROUP",label:"단체 수업",description:"여러 학생이 함께 참여하는 그룹 수업"}],[]);l.useEffect(()=>{if(!d||!b)return;let s=!1;async function i(){k(!0),w(null);try{const a=await ue(b);!s&&a&&(p({title:a.title,description:a.description,status:a.status,courseType:a.courseType??"GROUP",capacity:(a.courseType??"GROUP")==="INDIVIDUAL"?1:a.capacity,fee:a.fee,courseTime:a.courseTime,recurrenceDays:a.recurrenceDays,startTime:a.startTime?a.startTime.slice(0,5):"",endTime:a.endTime?a.endTime.slice(0,5):""}),P(a.fee!=null?M(a.fee):""))}catch(a){s||w(V(a,"수업 정보를 불러오지 못했습니다."))}finally{s||k(!1)}}return i(),()=>{s=!0}},[d,b]);async function ee(s){if(s.preventDefault(),w(null),z(null),j({}),!n.title||!n.title.trim()){j(i=>({...i,title:"수업명을 입력해 주세요."}));return}O(!0);try{if(o&&(!n.recurrenceDays||!n.recurrenceDays.trim()||!n.startTime||!n.endTime)){j(i=>({...i,schedule:"반복 요일과 시작/종료 시간을 선택해 주세요."}));return}d&&b?(await pe(b,{...n,startTime:n.startTime?.length===5?`${n.startTime}:00`:n.startTime,endTime:n.endTime?.length===5?`${n.endTime}:00`:n.endTime,recurring:o}),z("수정이 완료되었습니다.")):(await he({...n,startTime:n.startTime?.length===5?`${n.startTime}:00`:n.startTime,endTime:n.endTime?.length===5?`${n.endTime}:00`:n.endTime,recurring:o}),z("수업이 추가되었습니다.")),e("/classes",{replace:!0})}catch(i){w(V(i,"저장에 실패했습니다."))}finally{O(!1)}}function te(s){if(s===0){if(!n.title||!n.title.trim())return j(i=>({...i,title:"수업명을 입력해 주세요."})),!1;j(i=>({...i,title:void 0}))}if(s===1){if(o&&(!n.recurrenceDays||!n.recurrenceDays.trim()||!n.startTime||!n.endTime))return j(i=>({...i,schedule:"반복 요일과 시작/종료 시간을 선택해 주세요."})),!1;j(i=>({...i,schedule:void 0}))}return!0}function se(){te(m)&&(C(s=>Math.min(s+1,g.length-1)),window.scrollTo({top:0,behavior:"smooth"}))}function ie(){C(s=>Math.max(s-1,0)),window.scrollTo({top:0,behavior:"smooth"})}return t.jsxs(ge,{children:[t.jsxs(fe,{children:[t.jsxs(Ue,{type:"button",onClick:()=>e("/classes"),children:[Pe," 뒤로"]}),t.jsx("h2",{children:d?"수업 수정":"수업 추가하기"}),t.jsx(xe,{})]}),F&&t.jsx(Ce,{children:F}),U&&t.jsx(De,{children:U}),T?t.jsx(Ne,{}):t.jsxs(be,{id:"course-form",onSubmit:ee,children:[K?t.jsx(de,{title:d?"수업 정보를 빠르게 수정하는 팁":"수업 등록 체크리스트",description:d?"변경한 내용은 저장 즉시 반영됩니다. 수강생에게 공지해야 하는 정보는 메모나 캘린더 댓글로 남겨두면 좋아요.":"기본 정보 → 일정 → 추가 설정 순으로 차근차근 입력하면 절차를 놓치지 않아요.",tips:["반복 요일과 시간을 먼저 정해두면 공지 작성이 수월해집니다.","정원과 수강료를 입력하면 대시보드 통계에 자동 반영돼요.","저장은 마지막 단계에서 한 번만 눌러도 됩니다."],onClose:()=>q(!1)}):null,t.jsx(Ee,{children:g.map((s,i)=>{const a=i<m;return t.jsxs(Re,{type:"button","data-active":i===m,"data-done":i<m,disabled:!a,onClick:()=>{a&&(C(i),window.scrollTo({top:0,behavior:"smooth"}))},children:[t.jsx("span",{className:"index",children:i+1}),t.jsx("span",{className:"label",children:s.title})]},s.key)})}),m===0?t.jsxs(N,{children:[t.jsxs(E,{children:[t.jsx(A,{children:g[0].title}),t.jsx(S,{children:g[0].lead})]}),t.jsxs(R,{children:[t.jsxs(f,{children:[t.jsxs(x,{children:["수업명",t.jsx("span",{children:"*"})]}),t.jsx(I,{"aria-invalid":!!h.title,value:n.title,onChange:s=>{p(i=>({...i,title:s.target.value})),h.title&&j(i=>({...i,title:void 0}))},placeholder:"예: 영어 회화 A반"}),h.title?t.jsx(_,{children:h.title}):null]}),t.jsxs(f,{children:[t.jsx(x,{children:"상태"}),t.jsxs(ye,{value:n.status,onChange:s=>p(i=>({...i,status:s.target.value})),children:[t.jsx("option",{value:"IN_PROGRESS",children:"진행중"}),t.jsx("option",{value:"PENDING",children:"대기"}),t.jsx("option",{value:"STOPPED",children:"중단"})]})]}),t.jsxs(f,{as:"div",children:[t.jsx(x,{children:"수업 형태"}),t.jsx(we,{role:"radiogroup","aria-label":"수업 형태",children:Z.map(s=>t.jsxs(Se,{type:"button","data-active":n.courseType===s.value,onClick:()=>p(i=>{const a={...i,courseType:s.value};return s.value==="INDIVIDUAL"&&(a.capacity=1),a}),children:[t.jsx("span",{className:"title",children:s.label}),t.jsx("span",{className:"desc",children:s.description})]},s.value))}),t.jsx(y,{children:"수업 형태에 따라 통계와 요금 정책을 나눌 수 있어요."})]})]})]}):null,m===1?t.jsxs(N,{children:[t.jsxs(E,{children:[t.jsx(A,{children:g[1].title}),t.jsx(S,{children:g[1].lead})]}),t.jsxs(R,{children:[t.jsxs(f,{children:[t.jsx(x,{children:"반복 여부"}),t.jsxs(He,{children:[t.jsx("input",{id:"recurring",type:"checkbox",checked:o,onChange:s=>Q(s.currentTarget.checked)}),t.jsx("label",{htmlFor:"recurring",children:"정기 반복"})]}),t.jsx(y,{children:"정기 수업이 아니라면 체크를 해제하세요."})]}),t.jsxs(f,{children:[t.jsxs(x,{children:["반복 요일",o?t.jsx("span",{children:"*"}):null]}),t.jsx(Te,{"aria-disabled":!o,"aria-invalid":o&&!!h.schedule,children:Le.map(s=>{const i=Me(n.recurrenceDays,s.value);return t.jsx(ke,{type:"button","data-active":i,disabled:!o,onClick:()=>J(s.value,!i),children:s.label},s.value)})}),t.jsx(y,{children:"예: 월/수는 MON,WED 로 저장됩니다."})]}),t.jsxs(f,{children:[t.jsxs(x,{children:["반복 시간",o?t.jsx("span",{children:"*"}):null]}),t.jsxs(ze,{children:[t.jsx("select",{disabled:!o,"aria-invalid":o&&!!h.schedule,value:(n.startTime??"").slice(0,2)||"00",onChange:s=>{const i=s.target.value,a=(n.startTime??"00:00").slice(3,5)||"00";p(v=>({...v,startTime:`${i}:${a}`}))},children:Array.from({length:24},(s,i)=>D(i)).map(s=>t.jsx("option",{value:s,children:s},s))}),t.jsx("span",{children:":"}),t.jsx("select",{disabled:!o,"aria-invalid":o&&!!h.schedule,value:(n.startTime??"").slice(3,5)||"00",onChange:s=>{const i=s.target.value,a=(n.startTime??"00:00").slice(0,2)||"00";p(v=>({...v,startTime:`${a}:${i}`}))},children:B.map(s=>t.jsx("option",{value:s,children:s},s))}),t.jsx("span",{children:"~"}),t.jsx("select",{disabled:!o,"aria-invalid":o&&!!h.schedule,value:(n.endTime??"").slice(0,2)||"00",onChange:s=>{const i=s.target.value,a=(n.endTime??"00:00").slice(3,5)||"00";p(v=>({...v,endTime:`${i}:${a}`}))},children:Array.from({length:24},(s,i)=>D(i)).map(s=>t.jsx("option",{value:s,children:s},s))}),t.jsx("span",{children:":"}),t.jsx("select",{disabled:!o,"aria-invalid":o&&!!h.schedule,value:(n.endTime??"").slice(3,5)||"00",onChange:s=>{const i=s.target.value,a=(n.endTime??"00:00").slice(0,2)||"00";p(v=>({...v,endTime:`${a}:${i}`}))},children:B.map(s=>t.jsx("option",{value:s,children:s},s))})]}),t.jsx(y,{children:"시/분을 고정 옵션으로 선택합니다(5분 단위)."}),h.schedule?t.jsx(_,{children:h.schedule}):null]})]})]}):null,m===2?t.jsxs(N,{children:[t.jsxs(E,{children:[t.jsx(A,{children:g[2].title}),t.jsx(S,{children:g[2].lead})]}),t.jsxs(R,{children:[t.jsxs(f,{children:[t.jsx(x,{children:"정원"}),t.jsx(I,{type:"number",min:1,value:n.capacity??"",disabled:L,onChange:s=>p(i=>({...i,capacity:s.target.value?Number(s.target.value):void 0})),placeholder:"예: 12"}),L?t.jsx(y,{children:"개인 수업은 정원이 1명으로 고정됩니다."}):null]}),t.jsxs(f,{children:[t.jsx(x,{children:"수강료"}),t.jsxs(je,{children:[t.jsx(I,{type:"text",inputMode:"numeric",value:Y,onChange:s=>{const i=(s.target.value||"").replace(/[^0-9]/g,"");P(M(i)),p(a=>({...a,fee:i?Number(i):void 0}))},placeholder:"예: 150,000",style:{paddingRight:38}}),t.jsx(ve,{children:"원"})]})]}),t.jsxs(f,{style:{gridColumn:"1 / -1"},children:[t.jsx(x,{children:"설명"}),t.jsx($e,{rows:5,value:n.description??"",onChange:s=>p(i=>({...i,description:s.target.value})),placeholder:"수업에 대한 간단한 설명"})]})]}),d?t.jsxs(Fe,{children:[t.jsx(S,{children:"수강생 관리"}),t.jsx(y,{children:"학생 관리는 상세 페이지의 ‘수강생 수정’에서 변경하세요."}),t.jsx(ae,{onClick:()=>e(`/classes/${b}/edit-students`),children:"수강생 수정 바로가기"})]}):null]}):null,t.jsxs(Ge,{children:[m>0?t.jsx(Oe,{type:"button",onClick:ie,children:"이전 단계"}):t.jsx("span",{}),X?t.jsx(H,{type:"submit",disabled:u,children:u?"저장 중...":d?"수업 수정 완료":"수업 저장"},"submit"):t.jsx(H,{type:"button",onClick:se,children:"다음 단계"},"next")]})]})]})}const ge=r(ce)`
  gap: ${e=>e.theme.spacing.lg};
`,fe=r.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: ${e=>e.theme.spacing.md};
  align-items: center;
`,xe=r.div`
  display: inline-flex;
  gap: ${e=>e.theme.spacing.sm};
  flex-wrap: wrap;
  justify-content: flex-end;
`,be=r.form`
  display: grid;
  gap: ${e=>e.theme.spacing.xl};
`,f=r.label`
  display: grid;
  gap: ${e=>e.theme.spacing.xs};
`,x=r.div`
  color: #6b7280;
  font-size: ${e=>e.theme.font.size.sm};
  font-weight: 700;
  span {
    color: #ef4444;
  }
`,I=r.input`
  height: 38px;
  border: 1px solid ${e=>e.theme.colors.border};
  border-radius: ${e=>e.theme.radii.md};
  padding: 0 ${e=>e.theme.spacing.md};
  font-size: ${e=>e.theme.font.size.md};
`,je=r.div`
  position: relative;
  display: block;
`,ve=r.span`
  position: absolute;
  right: ${e=>e.theme.spacing.md};
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  font-size: ${e=>e.theme.font.size.md};
`,ye=r.select`
  height: 38px;
  border: 1px solid ${e=>e.theme.colors.border};
  border-radius: ${e=>e.theme.radii.md};
  padding: 0 ${e=>e.theme.spacing.md};
  font-size: ${e=>e.theme.font.size.md};
  background: #fff;
  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
  }
`,$e=r.textarea`
  border: 1px solid ${e=>e.theme.colors.border};
  border-radius: ${e=>e.theme.radii.md};
  padding: ${e=>e.theme.spacing.md};
  font-size: ${e=>e.theme.font.size.md};
  resize: vertical;
  background: #fff;
  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
  }
`,y=r.div`
  color: #6b7280;
  font-size: ${e=>e.theme.font.size.sm};
  line-height: 1.4;
`,_=r.div`
  color: #b91c1c;
  font-size: ${e=>e.theme.font.size.sm};
  margin-top: ${e=>e.theme.spacing.xs};
`,Te=r.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${e=>e.theme.spacing.sm};
  &[aria-invalid='true'] {
    outline: 2px solid rgba(239, 68, 68, 0.35);
    outline-offset: 4px;
    border-radius: 12px;
    padding: 2px;
  }
`,ke=r.button`
  height: 32px;
  padding: 0 ${e=>e.theme.spacing.md};
  border-radius: 999px;
  border: 1px solid ${e=>e.theme.colors.border};
  background: #fff;
  font-size: ${e=>e.theme.font.size.md};
  color: #111827;
  &[data-active="true"] {
    background: #111827;
    color: #fff;
    border-color: #111827;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`,we=r.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${e=>e.theme.spacing.sm};
`,Se=r.button`
  display: grid;
  gap: ${e=>e.theme.spacing.xs};
  padding: ${e=>e.theme.spacing.sm} ${e=>e.theme.spacing.md};
  min-width: 140px;
  border: 1px solid ${e=>e.theme.colors.border};
  border-radius: ${e=>e.theme.radii.lg};
  background: #fff;
  text-align: left;
  font-size: ${e=>e.theme.font.size.sm};
  color: #334155;
  transition: border-color 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
  .title {
    font-weight: 700;
    color: #111827;
  }
  .desc {
    font-size: ${e=>e.theme.font.size.xs};
    color: #64748b;
  }
  &[data-active="true"] {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.18);
    background: rgba(99, 102, 241, 0.06);
    .title { color: #4338ca; }
  }
`,ze=r.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr auto 1fr auto 1fr;
  gap: ${e=>e.theme.spacing.sm};
  align-items: center;
  select[aria-invalid='true'] {
    border-color: #ef4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.12);
  }
`,Ce=r.div`
  background: #fee2e2;
  color: #b91c1c;
  border: 1px solid #fecaca;
  padding: ${e=>e.theme.spacing.sm} ${e=>e.theme.spacing.md};
  border-radius: ${e=>e.theme.radii.md};
  font-size: ${e=>e.theme.font.size.sm};
`,De=r.div`
  background: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
  padding: ${e=>e.theme.spacing.sm} ${e=>e.theme.spacing.md};
  border-radius: ${e=>e.theme.radii.md};
  font-size: ${e=>e.theme.font.size.sm};
`,Ie=le` 0%{ background-position:-200px 0; } 100%{ background-position:200px 0; }`,$=r.div`
  background: linear-gradient(90deg, #eef2f7 25%, #f6f8fb 37%, #eef2f7 63%);
  background-size: 400px 100%;
  animation: ${Ie} 1.2s ease-in-out infinite;
  border-radius: 8px;
  width: 100%;
  height: ${e=>e.h||12}px;
`;function Ne(){return t.jsxs(W,{children:[t.jsx(oe,{children:"기본 정보"}),t.jsxs(Ae,{children:[t.jsx($,{h:38}),t.jsx($,{h:38}),t.jsx($,{h:38}),t.jsx($,{h:38}),t.jsx($,{h:120})]})]})}const Ee=r.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${e=>e.theme.spacing.sm};
`,Ae=r.div`
  display: grid;
  gap: ${e=>e.theme.spacing.md};
`,Re=r.button`
  display: inline-flex;
  align-items: center;
  gap: ${e=>e.theme.spacing.sm};
  padding: ${e=>e.theme.spacing.xs} ${e=>e.theme.spacing.md};
  border-radius: 999px;
  border: 1px solid #e2e8f0;
  background: #fff;
  color: #475569;
  font-size: ${e=>e.theme.font.size.sm};
  font-weight: 600;
  cursor: pointer;
  transition: background 0.18s ease, border-color 0.18s ease, color 0.18s ease;
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
    pointer-events: none;
  }
  .index {
    width: 22px;
    height: 22px;
    border-radius: 999px;
    background: #e2e8f0;
    color: #475569;
    display: grid;
    place-items: center;
    font-weight: 700;
  }
  &[data-active='true'] {
    border-color: #6366f1;
    background: #eef2ff;
    color: #312e81;
    .index {
      background: #6366f1;
      color: #fff;
    }
  }
  &[data-done='true'] {
    border-color: #6366f1;
    color: #312e81;
    .index {
      background: #4f46e5;
      color: #fff;
    }
  }
`,N=r(W)`
  display: grid;
  gap: ${e=>e.theme.spacing.xl};
`,E=r.div`
  display: grid;
  gap: ${e=>e.theme.spacing.xs};
`,A=r.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  color: ${({theme:e})=>e.colors.text};
`,S=r.p`
  margin: 0;
  font-size: ${e=>e.theme.font.size.md};
  color: #475569;
`,R=r.div`
  display: grid;
  gap: ${e=>e.theme.spacing.lg};
`,Ge=r.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${e=>e.theme.spacing.md};
`;r.div`
  display: flex;
  justify-content: flex-end;
`;const Oe=r.button`
  ${G.outline};
  height: 40px;
  padding: 0 ${e=>e.theme.spacing.xl};
  font-size: ${e=>e.theme.font.size.md};
  font-weight: 600;
`,H=r.button`
  ${G.primary};
  height: 40px;
  padding: 0 ${e=>e.theme.spacing.xl};
  font-size: ${e=>e.theme.font.size.md};
  font-weight: 700;
`,Fe=r.div`
  display: grid;
  gap: ${e=>e.theme.spacing.sm};
  border: 1px dashed #cbd5f5;
  border-radius: ${e=>e.theme.radii.md};
  padding: ${e=>e.theme.spacing.md};
  background: #f8fafc;
`,Ue=r.button`
  ${G.outline};
  height: 40px;
  padding: 0 ${e=>e.theme.spacing.lg};
  font-weight: 600;
  font-size: ${e=>e.theme.font.size.md};
`,Pe=t.jsx("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:t.jsx("polyline",{points:"15 18 9 12 15 6"})}),Le=[{value:"MON",label:"월"},{value:"TUE",label:"화"},{value:"WED",label:"수"},{value:"THU",label:"목"},{value:"FRI",label:"금"},{value:"SAT",label:"토"},{value:"SUN",label:"일"}];function Me(e,c){return!e||!c?!1:e.split(",").map(d=>d.trim().toUpperCase()).includes(c)}function Be(e){return Array.from(new Set(e)).filter(Boolean).join(",")}function _e(e,c){return(d,b)=>{const T=(e.recurrenceDays||"").split(",").map(u=>u.trim()).filter(u=>!!u).map(u=>u.toUpperCase()),k=b?[...T,d]:T.filter(u=>u!==d);c(u=>({...u,recurrenceDays:Be(k)}))}}function V(e,c){return e instanceof Error?e.message||c:typeof e=="string"&&e||c}const He=r.div`
  display: inline-flex;
  gap: ${e=>e.theme.spacing.sm};
  align-items: center;
  input[type="checkbox"] {
    width: 18px;
    height: 18px;
  }
`;export{qe as default};
