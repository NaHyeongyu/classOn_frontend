import{u as ie,e as ne,r as l,j as t,G as _,d as r,c as I,S as V,s as re,t as ae,l as oe}from"./index-B7CgKAvQ.js";import{I as le}from"./InfoBanner-hd3oxrZj.js";import{g as ce,u as de,b as he}from"./courses-Brx8tmdb.js";const ue={title:"",description:"",status:"IN_PROGRESS"};function He(){const e=ie(),{id:o}=ne(),c=l.useMemo(()=>!!o,[o]),g=l.useMemo(()=>o?Number(o):null,[o]),[y,T]=l.useState(!1),[d,G]=l.useState(!1),[M,S]=l.useState(null),[O,z]=l.useState(null),[Y,q]=l.useState(!0),[v,f]=l.useState({}),[n,h]=l.useState(()=>({...ue})),[J,B]=l.useState(""),Q=Be(n,h),[u,X]=l.useState(!0),[p,C]=l.useState(0),m=[{key:"basic",title:"기본 정보",lead:"수업명과 상태를 먼저 확인해 주세요."},{key:"schedule",title:"수업 일정",lead:"정기 반복 여부와 시간을 선택합니다."},{key:"details",title:"추가 설정",lead:"정원, 수강료, 설명을 정리해 마무리하세요."}],Z=p===m.length-1;function D(s){return String(s).padStart(2,"0")}function P(s){const i=String(s??"").replace(/[^0-9]/g,"");return i?Number(i).toLocaleString("ko-KR"):""}const L=l.useMemo(()=>Array.from({length:12},(s,i)=>D(i*5)),[]);l.useEffect(()=>{if(!c||!g)return;let s=!1;async function i(){T(!0),S(null);try{const a=await ce(g);!s&&a&&(h({title:a.title,description:a.description,status:a.status,capacity:a.capacity,fee:a.fee,courseTime:a.courseTime,recurrenceDays:a.recurrenceDays,startTime:a.startTime?a.startTime.slice(0,5):"",endTime:a.endTime?a.endTime.slice(0,5):""}),B(a.fee!=null?P(a.fee):""))}catch(a){s||S(K(a,"수업 정보를 불러오지 못했습니다."))}finally{s||T(!1)}}return i(),()=>{s=!0}},[c,g]);async function ee(s){if(s.preventDefault(),S(null),z(null),f({}),!n.title||!n.title.trim()){f(i=>({...i,title:"수업명을 입력해 주세요."}));return}G(!0);try{if(u&&(!n.recurrenceDays||!n.recurrenceDays.trim()||!n.startTime||!n.endTime)){f(i=>({...i,schedule:"반복 요일과 시작/종료 시간을 선택해 주세요."}));return}c&&g?(await de(g,{...n,startTime:n.startTime?.length===5?`${n.startTime}:00`:n.startTime,endTime:n.endTime?.length===5?`${n.endTime}:00`:n.endTime,recurring:u}),z("수정이 완료되었습니다.")):(await he({...n,startTime:n.startTime?.length===5?`${n.startTime}:00`:n.startTime,endTime:n.endTime?.length===5?`${n.endTime}:00`:n.endTime,recurring:u}),z("수업이 추가되었습니다.")),e("/classes",{replace:!0})}catch(i){S(K(i,"저장에 실패했습니다."))}finally{G(!1)}}function U(s){if(s===0){if(!n.title||!n.title.trim())return f(i=>({...i,title:"수업명을 입력해 주세요."})),!1;f(i=>({...i,title:void 0}))}if(s===1){if(u&&(!n.recurrenceDays||!n.recurrenceDays.trim()||!n.startTime||!n.endTime))return f(i=>({...i,schedule:"반복 요일과 시작/종료 시간을 선택해 주세요."})),!1;f(i=>({...i,schedule:void 0}))}return!0}function te(){U(p)&&(C(s=>Math.min(s+1,m.length-1)),window.scrollTo({top:0,behavior:"smooth"}))}function se(){C(s=>Math.max(s-1,0)),window.scrollTo({top:0,behavior:"smooth"})}return t.jsxs(pe,{children:[t.jsxs(me,{children:[t.jsxs(Re,{type:"button",onClick:()=>e("/classes"),children:[Ie," 뒤로"]}),t.jsx("h2",{children:c?"수업 수정":"수업 추가하기"}),t.jsx(ge,{children:t.jsx(_,{onClick:()=>e("/classes"),children:"취소"})})]}),M&&t.jsx(Se,{children:M}),O&&t.jsx(ke,{children:O}),y?t.jsx(ze,{}):t.jsxs(fe,{id:"course-form",onSubmit:ee,children:[Y?t.jsx(le,{title:c?"수업 정보를 빠르게 수정하는 팁":"수업 등록 체크리스트",description:c?"변경한 내용은 저장 즉시 반영됩니다. 수강생에게 공지해야 하는 정보는 메모나 캘린더 댓글로 남겨두면 좋아요.":"기본 정보 → 일정 → 추가 설정 순으로 차근차근 입력하면 절차를 놓치지 않아요.",tips:["반복 요일과 시간을 먼저 정해두면 공지 작성이 수월해집니다.","정원과 수강료를 입력하면 대시보드 통계에 자동 반영돼요.","저장은 마지막 단계에서 한 번만 눌러도 됩니다."],onClose:()=>q(!1)}):null,t.jsx(Ce,{children:m.map((s,i)=>t.jsxs(Ee,{type:"button","data-active":i===p,"data-done":i<p,onClick:()=>{i>p&&!U(p)||(C(i),window.scrollTo({top:0,behavior:"smooth"}))},children:[t.jsx("span",{className:"index",children:i+1}),t.jsx("span",{className:"label",children:s.title})]},s.key))}),p===0?t.jsxs(N,{children:[t.jsxs(F,{children:[t.jsx(A,{children:m[0].title}),t.jsx(w,{children:m[0].lead})]}),t.jsxs(R,{children:[t.jsxs(x,{children:[t.jsxs(b,{children:["수업명",t.jsx("span",{children:"*"})]}),t.jsx(E,{"aria-invalid":!!v.title,value:n.title,onChange:s=>{h(i=>({...i,title:s.target.value})),v.title&&f(i=>({...i,title:void 0}))},placeholder:"예: 영어 회화 A반"}),v.title?t.jsx(H,{children:v.title}):null]}),t.jsxs(x,{children:[t.jsx(b,{children:"상태"}),t.jsxs(je,{value:n.status,onChange:s=>h(i=>({...i,status:s.target.value})),children:[t.jsx("option",{value:"IN_PROGRESS",children:"진행중"}),t.jsx("option",{value:"PENDING",children:"대기"}),t.jsx("option",{value:"STOPPED",children:"중단"})]})]})]})]}):null,p===1?t.jsxs(N,{children:[t.jsxs(F,{children:[t.jsx(A,{children:m[1].title}),t.jsx(w,{children:m[1].lead})]}),t.jsxs(R,{children:[t.jsxs(x,{children:[t.jsx(b,{children:"반복 여부"}),t.jsxs(Pe,{children:[t.jsx("input",{id:"recurring",type:"checkbox",checked:u,onChange:s=>X(s.currentTarget.checked)}),t.jsx("label",{htmlFor:"recurring",children:"정기 반복"})]}),t.jsx(k,{children:"정기 수업이 아니라면 체크를 해제하세요."})]}),t.jsxs(x,{children:[t.jsx(b,{children:"반복 요일"}),t.jsx($e,{"aria-disabled":!u,children:Ge.map(s=>{const i=Me(n.recurrenceDays,s.value);return t.jsx(ye,{type:"button","data-active":i,disabled:!u,onClick:()=>Q(s.value,!i),children:s.label},s.value)})}),t.jsx(k,{children:"예: 월/수는 MON,WED 로 저장됩니다."})]}),t.jsxs(x,{children:[t.jsx(b,{children:"반복 시간"}),t.jsxs(Te,{children:[t.jsx("select",{disabled:!u,value:(n.startTime??"").slice(0,2)||"00",onChange:s=>{const i=s.target.value,a=(n.startTime??"00:00").slice(3,5)||"00";h(j=>({...j,startTime:`${i}:${a}`}))},children:Array.from({length:24},(s,i)=>D(i)).map(s=>t.jsx("option",{value:s,children:s},s))}),t.jsx("span",{children:":"}),t.jsx("select",{disabled:!u,value:(n.startTime??"").slice(3,5)||"00",onChange:s=>{const i=s.target.value,a=(n.startTime??"00:00").slice(0,2)||"00";h(j=>({...j,startTime:`${a}:${i}`}))},children:L.map(s=>t.jsx("option",{value:s,children:s},s))}),t.jsx("span",{children:"~"}),t.jsx("select",{disabled:!u,value:(n.endTime??"").slice(0,2)||"00",onChange:s=>{const i=s.target.value,a=(n.endTime??"00:00").slice(3,5)||"00";h(j=>({...j,endTime:`${i}:${a}`}))},children:Array.from({length:24},(s,i)=>D(i)).map(s=>t.jsx("option",{value:s,children:s},s))}),t.jsx("span",{children:":"}),t.jsx("select",{disabled:!u,value:(n.endTime??"").slice(3,5)||"00",onChange:s=>{const i=s.target.value,a=(n.endTime??"00:00").slice(0,2)||"00";h(j=>({...j,endTime:`${a}:${i}`}))},children:L.map(s=>t.jsx("option",{value:s,children:s},s))})]}),t.jsx(k,{children:"시/분을 고정 옵션으로 선택합니다(5분 단위)."}),v.schedule?t.jsx(H,{children:v.schedule}):null]})]})]}):null,p===2?t.jsxs(N,{children:[t.jsxs(F,{children:[t.jsx(A,{children:m[2].title}),t.jsx(w,{children:m[2].lead})]}),t.jsxs(R,{children:[t.jsxs(x,{children:[t.jsx(b,{children:"정원"}),t.jsx(E,{type:"number",value:n.capacity??"",onChange:s=>h(i=>({...i,capacity:s.target.value?Number(s.target.value):void 0})),placeholder:"예: 12"})]}),t.jsxs(x,{children:[t.jsx(b,{children:"수강료"}),t.jsxs(xe,{children:[t.jsx(E,{type:"text",inputMode:"numeric",value:J,onChange:s=>{const i=(s.target.value||"").replace(/[^0-9]/g,"");B(P(i)),h(a=>({...a,fee:i?Number(i):void 0}))},placeholder:"예: 150,000",style:{paddingRight:38}}),t.jsx(be,{children:"원"})]})]}),t.jsxs(x,{style:{gridColumn:"1 / -1"},children:[t.jsx(b,{children:"설명"}),t.jsx(ve,{rows:5,value:n.description??"",onChange:s=>h(i=>({...i,description:s.target.value})),placeholder:"수업에 대한 간단한 설명"})]})]}),c?t.jsxs(Ae,{children:[t.jsx(w,{children:"수강생 관리"}),t.jsx(k,{children:"학생 관리는 상세 페이지의 ‘수강생 수정’에서 변경하세요."}),t.jsx(_,{onClick:()=>e(`/classes/${g}/edit-students`),children:"수강생 수정 바로가기"})]}):null]}):null,t.jsxs(Ne,{children:[p>0?t.jsx(Fe,{type:"button",onClick:se,children:"이전 단계"}):t.jsx("span",{}),Z?t.jsx(W,{type:"submit",disabled:d,children:d?"저장 중...":c?"수업 수정 완료":"수업 저장"}):t.jsx(W,{type:"button",onClick:te,children:"다음 단계"})]})]})]})}const pe=r(oe)`
  gap: ${e=>e.theme.spacing.lg};
`,me=r.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: ${e=>e.theme.spacing.md};
  align-items: center;
`,ge=r.div`
  display: inline-flex;
  gap: ${e=>e.theme.spacing.sm};
  flex-wrap: wrap;
  justify-content: flex-end;
`,fe=r.form`
  display: grid;
  gap: ${e=>e.theme.spacing.xl};
`,x=r.label`
  display: grid;
  gap: ${e=>e.theme.spacing.xs};
`,b=r.div`
  color: #6b7280;
  font-size: ${e=>e.theme.font.size.sm};
  font-weight: 700;
  span {
    color: #ef4444;
  }
`,E=r.input`
  height: 38px;
  border: 1px solid ${e=>e.theme.colors.border};
  border-radius: ${e=>e.theme.radii.md};
  padding: 0 ${e=>e.theme.spacing.md};
  font-size: ${e=>e.theme.font.size.md};
`,xe=r.div`
  position: relative;
  display: block;
`,be=r.span`
  position: absolute;
  right: ${e=>e.theme.spacing.md};
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  font-size: ${e=>e.theme.font.size.md};
`,je=r.select`
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
`,ve=r.textarea`
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
`,k=r.div`
  color: #6b7280;
  font-size: ${e=>e.theme.font.size.sm};
  line-height: 1.4;
`,H=r.div`
  color: #b91c1c;
  font-size: ${e=>e.theme.font.size.sm};
  margin-top: ${e=>e.theme.spacing.xs};
`,$e=r.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${e=>e.theme.spacing.sm};
`,ye=r.button`
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
`,Te=r.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr auto 1fr auto 1fr;
  gap: ${e=>e.theme.spacing.sm};
  align-items: center;
`,Se=r.div`
  background: #fee2e2;
  color: #b91c1c;
  border: 1px solid #fecaca;
  padding: ${e=>e.theme.spacing.sm} ${e=>e.theme.spacing.md};
  border-radius: ${e=>e.theme.radii.md};
  font-size: ${e=>e.theme.font.size.sm};
`,ke=r.div`
  background: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
  padding: ${e=>e.theme.spacing.sm} ${e=>e.theme.spacing.md};
  border-radius: ${e=>e.theme.radii.md};
  font-size: ${e=>e.theme.font.size.sm};
`,we=ae` 0%{ background-position:-200px 0; } 100%{ background-position:200px 0; }`,$=r.div`
  background: linear-gradient(90deg, #eef2f7 25%, #f6f8fb 37%, #eef2f7 63%);
  background-size: 400px 100%;
  animation: ${we} 1.2s ease-in-out infinite;
  border-radius: 8px;
  width: 100%;
  height: ${e=>e.h||12}px;
`;function ze(){return t.jsxs(V,{children:[t.jsx(re,{children:"기본 정보"}),t.jsxs(De,{children:[t.jsx($,{h:38}),t.jsx($,{h:38}),t.jsx($,{h:38}),t.jsx($,{h:38}),t.jsx($,{h:120})]})]})}const Ce=r.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${e=>e.theme.spacing.sm};
`,De=r.div`
  display: grid;
  gap: ${e=>e.theme.spacing.md};
`,Ee=r.button`
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
`,N=r(V)`
  display: grid;
  gap: ${e=>e.theme.spacing.xl};
`,F=r.div`
  display: grid;
  gap: ${e=>e.theme.spacing.xs};
`,A=r.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  color: ${({theme:e})=>e.colors.text};
`,w=r.p`
  margin: 0;
  font-size: ${e=>e.theme.font.size.md};
  color: #475569;
`,R=r.div`
  display: grid;
  gap: ${e=>e.theme.spacing.lg};
`,Ne=r.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${e=>e.theme.spacing.md};
`,Fe=r.button`
  ${I.outline};
  height: 40px;
  padding: 0 ${e=>e.theme.spacing.xl};
  font-size: ${e=>e.theme.font.size.md};
  font-weight: 600;
`,W=r.button`
  ${I.primary};
  height: 42px;
  padding: 0 ${e=>e.theme.spacing.xl};
  font-size: ${e=>e.theme.font.size.md};
  font-weight: 700;
`,Ae=r.div`
  display: grid;
  gap: ${e=>e.theme.spacing.sm};
  border: 1px dashed #cbd5f5;
  border-radius: ${e=>e.theme.radii.md};
  padding: ${e=>e.theme.spacing.md};
  background: #f8fafc;
`,Re=r.button`
  ${I.outline};
  height: 36px;
  padding: 0 ${e=>e.theme.spacing.md};
  font-weight: 600;
  font-size: ${e=>e.theme.font.size.md};
`,Ie=t.jsx("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:t.jsx("polyline",{points:"15 18 9 12 15 6"})}),Ge=[{value:"MON",label:"월"},{value:"TUE",label:"화"},{value:"WED",label:"수"},{value:"THU",label:"목"},{value:"FRI",label:"금"},{value:"SAT",label:"토"},{value:"SUN",label:"일"}];function Me(e,o){return!e||!o?!1:e.split(",").map(c=>c.trim().toUpperCase()).includes(o)}function Oe(e){return Array.from(new Set(e)).filter(Boolean).join(",")}function Be(e,o){return(c,g)=>{const y=(e.recurrenceDays||"").split(",").map(d=>d.trim()).filter(d=>!!d).map(d=>d.toUpperCase()),T=g?[...y,c]:y.filter(d=>d!==c);o(d=>({...d,recurrenceDays:Oe(T)}))}}function K(e,o){return e instanceof Error?e.message||o:typeof e=="string"&&e||o}const Pe=r.div`
  display: inline-flex;
  gap: ${e=>e.theme.spacing.sm};
  align-items: center;
  input[type="checkbox"] {
    width: 18px;
    height: 18px;
  }
`;export{He as default};
