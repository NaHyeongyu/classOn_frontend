import{u as ye,a as ve,r as o,j as t,d as a,m as $e}from"./index-D-9d_yHo.js";import{G as Se,c as K,S as de,i as Te,P as we}from"./UI-DfwAVYB9.js";import{g as ke,u as Ie,a as ze}from"./courses-xqV3eExX.js";import{l as Ce}from"./students-BbqeIjnE.js";import{g as G}from"./errors-C6OcbAl5.js";const Ne={title:"",description:"",status:"IN_PROGRESS",courseType:"GROUP",primaryStudentId:null,primaryStudentName:""};function ht(){const e=ye(),{id:f}=ve(),h=o.useMemo(()=>!!f,[f]),y=o.useMemo(()=>f?Number(f):null,[f]),[k,I]=o.useState(!1),[m,q]=o.useState(!1),[Y,z]=o.useState(null),[J,E]=o.useState(null),[l,c]=o.useState({}),[r,u]=o.useState(()=>({...Ne})),[le,Q]=o.useState(""),ce=ot(r,u),[d,ue]=o.useState(!0),[b,A]=o.useState(0),[O,pe]=o.useState([]),[X,Z]=o.useState(!1),[ee,te]=o.useState(null),[se,ie]=o.useState(!1),[R,me]=o.useState(""),j=[{key:"basic",title:"기본 정보",lead:"수업명과 상태를 먼저 확인해 주세요."},{key:"schedule",title:"수업 일정",lead:"정기 반복 여부와 시간을 선택합니다."},{key:"details",title:"추가 설정",lead:"정원, 수강료, 설명을 정리해 마무리하세요."}],he=b===j.length-1,$=r.courseType==="INDIVIDUAL";function F(s){return String(s).padStart(2,"0")}function re(s){const i=String(s??"").replace(/[^0-9]/g,"");return i?Number(i).toLocaleString("ko-KR"):""}const ne=o.useMemo(()=>Array.from({length:12},(s,i)=>F(i*5)),[]),fe=o.useMemo(()=>[{value:"INDIVIDUAL",label:"개인 수업",description:"1명의 학생과 진행되는 1:1 수업"},{value:"GROUP",label:"단체 수업",description:"여러 학생이 함께 참여하는 그룹 수업"}],[]),ae=o.useMemo(()=>{const s=R.trim().toLowerCase();return s?O.filter(i=>{const n=i.name?.toLowerCase()??"",p=i.code?.toLowerCase()??"";return n.includes(s)||p.includes(s)}):O},[O,R]);o.useEffect(()=>{if(!$||se)return;let s=!1;async function i(){Z(!0),te(null);try{let p=0,U=[];for(;;){const S=await Ce({page:p,size:100}),{content:C,last:T}=S,P=C.map(N=>({id:N.id,name:N.name,code:N.code,status:N.status}));if(U=U.concat(P),T||C.length===0||p>200)break;p+=1}if(!s){const S=new Map;for(const T of U)S.set(T.id,T);r.primaryStudentId&&!S.has(r.primaryStudentId)&&S.set(r.primaryStudentId,{id:r.primaryStudentId,name:r.primaryStudentName||`학생 #${r.primaryStudentId}`,code:void 0,status:"ENROLLED"});const C=Array.from(S.values()).sort((T,P)=>(T.name||"").localeCompare(P.name||"","ko-KR"));pe(C),ie(!0)}}catch(n){s||(te(G(n,"학생 목록을 불러오지 못했습니다.")),ie(!0))}finally{s||Z(!1)}}return i(),()=>{s=!0}},[$,se,r.primaryStudentId,r.primaryStudentName]),o.useEffect(()=>{if(!h||!y)return;let s=!1;async function i(){I(!0),z(null);try{const n=await ke(y);!s&&n&&(u({title:n.title,description:n.description,status:n.status,courseType:n.courseType??"GROUP",capacity:(n.courseType??"GROUP")==="INDIVIDUAL"?1:n.capacity,fee:n.fee,courseTime:n.courseTime,recurrenceDays:n.recurrenceDays,startTime:n.startTime?n.startTime.slice(0,5):"",endTime:n.endTime?n.endTime.slice(0,5):"",primaryStudentId:n.primaryStudentId??null,primaryStudentName:n.primaryStudentName??""}),Q(n.fee!=null?re(n.fee):""))}catch(n){s||z(G(n,"수업 정보를 불러오지 못했습니다."))}finally{s||I(!1)}}return i(),()=>{s=!0}},[h,y]);async function ge(s){if(s.preventDefault(),z(null),E(null),c({}),!r.title||!r.title.trim()){c(i=>({...i,title:"수업명을 입력해 주세요."}));return}if($&&!r.primaryStudentId){c(i=>({...i,student:"학생을 선택해 주세요."}));return}q(!0);try{if(d&&(!r.recurrenceDays||!r.recurrenceDays.trim()||!r.startTime||!r.endTime)){c(i=>({...i,schedule:"반복 요일과 시작/종료 시간을 선택해 주세요."}));return}h&&y?(await Ie(y,{...r,startTime:r.startTime?.length===5?`${r.startTime}:00`:r.startTime,endTime:r.endTime?.length===5?`${r.endTime}:00`:r.endTime,recurring:d}),E("수정이 완료되었습니다.")):(await ze({...r,startTime:r.startTime?.length===5?`${r.startTime}:00`:r.startTime,endTime:r.endTime?.length===5?`${r.endTime}:00`:r.endTime,recurring:d}),E("수업이 추가되었습니다.")),e("/classes",{replace:!0})}catch(i){z(G(i,"저장에 실패했습니다."))}finally{q(!1)}}function xe(s){if(s===0){if(!r.title||!r.title.trim())return c(i=>({...i,title:"수업명을 입력해 주세요."})),!1;c(i=>({...i,title:void 0}))}if(s===1){if(r.courseType==="INDIVIDUAL"&&!r.primaryStudentId)return c(i=>({...i,student:"학생을 선택해 주세요."})),!1;if(c(i=>({...i,student:void 0})),d&&(!r.recurrenceDays||!r.recurrenceDays.trim()||!r.startTime||!r.endTime))return c(i=>({...i,schedule:"반복 요일과 시작/종료 시간을 선택해 주세요."})),!1;c(i=>({...i,schedule:void 0}))}return!0}function be(){xe(b)&&(A(s=>Math.min(s+1,j.length-1)),window.scrollTo({top:0,behavior:"smooth"}))}function je(){A(s=>Math.max(s-1,0)),window.scrollTo({top:0,behavior:"smooth"})}return t.jsxs(De,{children:[t.jsxs(Le,{children:[t.jsxs(st,{type:"button",onClick:()=>e("/classes"),children:[it," 뒤로"]}),t.jsx("h2",{children:h?"수업 수정":"수업 추가하기"}),t.jsx(Ee,{})]}),Y&&t.jsx(We,{children:Y}),J&&t.jsx(Ke,{children:J}),k?t.jsx(Ye,{}):t.jsxs(Ae,{id:"course-form",onSubmit:ge,children:[t.jsx(Je,{children:j.map((s,i)=>{const n=i<b;return t.jsxs(Xe,{type:"button","data-active":i===b,"data-done":i<b,disabled:!n,onClick:()=>{n&&(A(i),window.scrollTo({top:0,behavior:"smooth"}))},children:[t.jsx("span",{className:"index",children:i+1}),t.jsx("span",{className:"label",children:s.title})]},s.key)})}),b===0?t.jsxs(V,{children:[t.jsxs(_,{children:[t.jsx(H,{children:j[0].title}),t.jsx(L,{children:j[0].lead})]}),t.jsxs(W,{children:[t.jsxs(g,{children:[t.jsxs(x,{children:["수업명",t.jsx("span",{children:"*"})]}),t.jsx(D,{"aria-invalid":!!l.title,value:r.title,onChange:s=>{u(i=>({...i,title:s.target.value})),l.title&&c(i=>({...i,title:void 0}))},placeholder:"예: 영어 회화 A반"}),l.title?t.jsx(M,{children:l.title}):null]}),t.jsxs(g,{children:[t.jsx(x,{children:"상태"}),t.jsxs(Fe,{value:r.status,onChange:s=>u(i=>({...i,status:s.target.value})),children:[t.jsx("option",{value:"IN_PROGRESS",children:"진행중"}),t.jsx("option",{value:"PENDING",children:"대기"}),t.jsx("option",{value:"STOPPED",children:"중단"})]})]}),t.jsxs(g,{as:"div",children:[t.jsx(x,{children:"수업 형태"}),t.jsx(Me,{role:"radiogroup","aria-label":"수업 형태",children:fe.map(s=>t.jsxs(Be,{type:"button","data-active":r.courseType===s.value,onClick:()=>{u(i=>{const n={...i,courseType:s.value};return s.value==="INDIVIDUAL"?(n.capacity=1,n.primaryStudentId=null,n.primaryStudentName=""):(n.primaryStudentId=null,n.primaryStudentName=""),n}),s.value!=="INDIVIDUAL"&&c(i=>({...i,student:void 0}))},children:[t.jsx("span",{className:"title",children:s.label}),t.jsx("span",{className:"desc",children:s.description})]},s.value))}),t.jsx(v,{children:"수업 형태에 따라 통계와 요금 정책을 나눌 수 있어요."})]})]})]}):null,b===1?t.jsxs(V,{children:[t.jsxs(_,{children:[t.jsx(H,{children:j[1].title}),t.jsx(L,{children:j[1].lead})]}),t.jsxs(W,{children:[$?t.jsxs(g,{children:[t.jsxs(x,{children:["담당 학생",t.jsx("span",{children:"*"})]}),t.jsx(D,{type:"search",placeholder:"학생 이름이나 코드를 입력해 주세요",value:R,onChange:s=>me(s.target.value)}),t.jsx(Ve,{role:"listbox","data-invalid":l.student?"true":void 0,"aria-busy":X,children:X?t.jsx(B,{children:"학생 목록을 불러오는 중입니다…"}):ee?t.jsx(B,{children:ee}):ae.length===0?t.jsx(B,{children:"등록된 학생이 없습니다. 원생 등록 후 다시 시도해 주세요."}):ae.map(s=>t.jsxs(_e,{type:"button",role:"option","data-active":r.primaryStudentId===s.id,"aria-selected":r.primaryStudentId===s.id,onClick:()=>{u(i=>({...i,primaryStudentId:s.id,primaryStudentName:s.name})),l.student&&c(i=>({...i,student:void 0}))},children:[t.jsx("span",{className:"name",children:s.name}),s.code?t.jsx("span",{className:"meta",children:s.code}):null]},s.id))}),r.primaryStudentId?t.jsxs(v,{children:["선택된 학생: ",r.primaryStudentName||`학생 #${r.primaryStudentId}`]}):null,l.student?t.jsx(M,{children:l.student}):null]}):null,t.jsxs(g,{children:[t.jsx(x,{children:"반복 여부"}),t.jsxs(dt,{children:[t.jsx("input",{id:"recurring",type:"checkbox",checked:d,onChange:s=>ue(s.currentTarget.checked)}),t.jsx("label",{htmlFor:"recurring",children:"정기 반복"})]}),t.jsx(v,{children:"정기 수업이 아니라면 체크를 해제하세요."})]}),t.jsxs(g,{children:[t.jsxs(x,{children:["반복 요일",d?t.jsx("span",{children:"*"}):null]}),t.jsx(Pe,{"aria-disabled":!d,"aria-invalid":d&&!!l.schedule,children:rt.map(s=>{const i=nt(r.recurrenceDays,s.value);return t.jsx(Ge,{type:"button","data-active":i,disabled:!d,onClick:()=>ce(s.value,!i),children:s.label},s.value)})}),t.jsx(v,{children:"예: 월/수는 MON,WED 로 저장됩니다."})]}),t.jsxs(g,{children:[t.jsxs(x,{children:["반복 시간",d?t.jsx("span",{children:"*"}):null]}),t.jsxs(He,{children:[t.jsx("select",{disabled:!d,"aria-invalid":d&&!!l.schedule,value:(r.startTime??"").slice(0,2)||"00",onChange:s=>{const i=s.target.value,n=(r.startTime??"00:00").slice(3,5)||"00";u(p=>({...p,startTime:`${i}:${n}`}))},children:Array.from({length:24},(s,i)=>F(i)).map(s=>t.jsx("option",{value:s,children:s},s))}),t.jsx("span",{children:":"}),t.jsx("select",{disabled:!d,"aria-invalid":d&&!!l.schedule,value:(r.startTime??"").slice(3,5)||"00",onChange:s=>{const i=s.target.value,n=(r.startTime??"00:00").slice(0,2)||"00";u(p=>({...p,startTime:`${n}:${i}`}))},children:ne.map(s=>t.jsx("option",{value:s,children:s},s))}),t.jsx("span",{children:"~"}),t.jsx("select",{disabled:!d,"aria-invalid":d&&!!l.schedule,value:(r.endTime??"").slice(0,2)||"00",onChange:s=>{const i=s.target.value,n=(r.endTime??"00:00").slice(3,5)||"00";u(p=>({...p,endTime:`${i}:${n}`}))},children:Array.from({length:24},(s,i)=>F(i)).map(s=>t.jsx("option",{value:s,children:s},s))}),t.jsx("span",{children:":"}),t.jsx("select",{disabled:!d,"aria-invalid":d&&!!l.schedule,value:(r.endTime??"").slice(3,5)||"00",onChange:s=>{const i=s.target.value,n=(r.endTime??"00:00").slice(0,2)||"00";u(p=>({...p,endTime:`${n}:${i}`}))},children:ne.map(s=>t.jsx("option",{value:s,children:s},s))})]}),t.jsx(v,{children:"시/분을 고정 옵션으로 선택합니다(5분 단위)."}),l.schedule?t.jsx(M,{children:l.schedule}):null]})]})]}):null,b===2?t.jsxs(V,{children:[t.jsxs(_,{children:[t.jsx(H,{children:j[2].title}),t.jsx(L,{children:j[2].lead})]}),t.jsxs(W,{children:[t.jsxs(g,{children:[t.jsx(x,{children:"정원"}),t.jsx(D,{type:"number",min:1,value:r.capacity??"",disabled:$,onChange:s=>u(i=>({...i,capacity:s.target.value?Number(s.target.value):void 0})),placeholder:"예: 12"}),$?t.jsx(v,{children:"개인 수업은 정원이 1명으로 고정됩니다."}):null]}),t.jsxs(g,{children:[t.jsx(x,{children:"수강료"}),t.jsxs(Oe,{children:[t.jsx(D,{type:"text",inputMode:"numeric",value:le,onChange:s=>{const i=(s.target.value||"").replace(/[^0-9]/g,"");Q(re(i)),u(n=>({...n,fee:i?Number(i):void 0}))},placeholder:"예: 150,000",style:{paddingRight:38}}),t.jsx(Re,{children:"원"})]})]}),t.jsxs(g,{style:{gridColumn:"1 / -1"},children:[t.jsx(x,{children:"설명"}),t.jsx(Ue,{rows:5,value:r.description??"",onChange:s=>u(i=>({...i,description:s.target.value})),placeholder:"수업에 대한 간단한 설명"})]})]}),h?t.jsxs(tt,{children:[t.jsx(L,{children:"수강생 관리"}),t.jsx(v,{children:"학생 관리는 상세 페이지의 ‘수강생 수정’에서 변경하세요."}),t.jsx(Se,{onClick:()=>e(`/classes/${y}/edit-students`),children:"수강생 수정 바로가기"})]}):null]}):null,t.jsxs(Ze,{children:[b>0?t.jsx(et,{type:"button",onClick:je,children:"이전 단계"}):t.jsx("span",{}),he?t.jsx(oe,{type:"submit",disabled:m,children:m?"저장 중...":h?"수업 수정 완료":"수업 저장"},"submit"):t.jsx(oe,{type:"button",onClick:be,children:"다음 단계"},"next")]})]})]})}const De=a(we)`
  gap: ${e=>e.theme.spacing.lg};
`,Le=a.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: ${e=>e.theme.spacing.md};
  align-items: center;
`,Ee=a.div`
  display: inline-flex;
  gap: ${e=>e.theme.spacing.sm};
  flex-wrap: wrap;
  justify-content: flex-end;
`,Ae=a.form`
  display: grid;
  gap: ${e=>e.theme.spacing.xl};
`,g=a.label`
  display: grid;
  gap: ${e=>e.theme.spacing.xs};
`,x=a.div`
  color: #6b7280;
  font-size: ${e=>e.theme.font.size.sm};
  font-weight: 700;
  span {
    color: #ef4444;
  }
`,D=a.input`
  height: 38px;
  border: 1px solid ${e=>e.theme.colors.border};
  border-radius: ${e=>e.theme.radii.md};
  padding: 0 ${e=>e.theme.spacing.md};
  font-size: ${e=>e.theme.font.size.md};
`,Oe=a.div`
  position: relative;
  display: block;
`,Re=a.span`
  position: absolute;
  right: ${e=>e.theme.spacing.md};
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  font-size: ${e=>e.theme.font.size.md};
`,Fe=a.select`
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
  &[aria-invalid='true'] {
    border-color: #ef4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.12);
  }
`,Ue=a.textarea`
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
`,v=a.div`
  color: #6b7280;
  font-size: ${e=>e.theme.font.size.sm};
  line-height: 1.4;
`,M=a.div`
  color: #b91c1c;
  font-size: ${e=>e.theme.font.size.sm};
  margin-top: ${e=>e.theme.spacing.xs};
`,Pe=a.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${e=>e.theme.spacing.sm};
  &[aria-invalid='true'] {
    outline: 2px solid rgba(239, 68, 68, 0.35);
    outline-offset: 4px;
    border-radius: 12px;
    padding: 2px;
  }
`,Ge=a.button`
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
`,Me=a.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${e=>e.theme.spacing.sm};
`,Be=a.button`
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
`,Ve=a.div`
  margin-top: ${e=>e.theme.spacing.sm};
  border: 1px solid ${e=>e.theme.colors.border};
  border-radius: ${e=>e.theme.radii.md};
  background: #fff;
  max-height: 240px;
  overflow-y: auto;
  display: grid;
  gap: ${e=>e.theme.spacing.xs};
  padding: ${e=>e.theme.spacing.sm};
  &[data-invalid='true'] {
    border-color: #ef4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.12);
  }
`,_e=a.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${e=>e.theme.spacing.sm};
  width: 100%;
  padding: ${e=>e.theme.spacing.sm} ${e=>e.theme.spacing.md};
  border: 1px solid transparent;
  border-radius: ${e=>e.theme.radii.md};
  background: transparent;
  cursor: pointer;
  font-size: ${e=>e.theme.font.size.md};
  color: #111827;
  transition: background 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
  .name {
    font-weight: 600;
  }
  .meta {
    font-size: ${e=>e.theme.font.size.sm};
    color: #64748b;
  }
  &:hover {
    background: #f8fafc;
  }
  &[data-active='true'] {
    background: rgba(99, 102, 241, 0.08);
    border-color: #6366f1;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.12);
  }
`,B=a.div`
  padding: ${e=>e.theme.spacing.md};
  text-align: center;
  color: #64748b;
  font-size: ${e=>e.theme.font.size.sm};
`,He=a.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr auto 1fr auto 1fr;
  gap: ${e=>e.theme.spacing.sm};
  align-items: center;
  select[aria-invalid='true'] {
    border-color: #ef4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.12);
  }
`,We=a.div`
  background: #fee2e2;
  color: #b91c1c;
  border: 1px solid #fecaca;
  padding: ${e=>e.theme.spacing.sm} ${e=>e.theme.spacing.md};
  border-radius: ${e=>e.theme.radii.md};
  font-size: ${e=>e.theme.font.size.sm};
`,Ke=a.div`
  background: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
  padding: ${e=>e.theme.spacing.sm} ${e=>e.theme.spacing.md};
  border-radius: ${e=>e.theme.radii.md};
  font-size: ${e=>e.theme.font.size.sm};
`,qe=$e` 0%{ background-position:-200px 0; } 100%{ background-position:200px 0; }`,w=a.div`
  background: linear-gradient(90deg, #eef2f7 25%, #f6f8fb 37%, #eef2f7 63%);
  background-size: 400px 100%;
  animation: ${qe} 1.2s ease-in-out infinite;
  border-radius: 8px;
  width: 100%;
  height: ${e=>e.h||12}px;
`;function Ye(){return t.jsxs(de,{children:[t.jsx(Te,{children:"기본 정보"}),t.jsxs(Qe,{children:[t.jsx(w,{h:38}),t.jsx(w,{h:38}),t.jsx(w,{h:38}),t.jsx(w,{h:38}),t.jsx(w,{h:120})]})]})}const Je=a.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${e=>e.theme.spacing.sm};
`,Qe=a.div`
  display: grid;
  gap: ${e=>e.theme.spacing.md};
`,Xe=a.button`
  display: inline-flex;
  align-items: center;
  gap: ${e=>e.theme.spacing.sm};
  padding: ${e=>e.theme.spacing.xs} ${e=>e.theme.spacing.md};
  border-radius: 999px;
  border: 1px solid #dbeafe;
  background: #f8fafb;
  color: #334155;
  font-size: ${e=>e.theme.font.size.sm};
  font-weight: 600;
  cursor: pointer;
  transition: background 0.18s ease, border-color 0.18s ease, color 0.18s ease;
  &:disabled {
    cursor: default;
    pointer-events: none;
  }
  &:not(:disabled):hover {
    border-color: #c7d2fe;
    background: #eef2ff;
  }
  .index {
    width: 22px;
    height: 22px;
    border-radius: 999px;
    background: #e0e7ff;
    color: #4338ca;
    display: grid;
    place-items: center;
    font-weight: 700;
  }
  &[data-active='true'] {
    border-color: #c7d2fe;
    background: #eef2ff;
    color: #1f2937;
    box-shadow: 0 6px 18px rgba(79, 70, 229, 0.15);
    .index {
      background: #6366f1;
      color: #fff;
    }
  }
  &[data-done='true'] {
    border-color: #c7d2fe;
    background: #f5f3ff;
    color: #1f2937;
    .index {
      background: #4f46e5;
      color: #fff;
    }
  }
`,V=a(de)`
  display: grid;
  gap: ${e=>e.theme.spacing.xl};
`,_=a.div`
  display: grid;
  gap: ${e=>e.theme.spacing.xs};
`,H=a.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  color: ${({theme:e})=>e.colors.text};
`,L=a.p`
  margin: 0;
  font-size: ${e=>e.theme.font.size.md};
  color: #475569;
`,W=a.div`
  display: grid;
  gap: ${e=>e.theme.spacing.lg};
`,Ze=a.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${e=>e.theme.spacing.md};
`;a.div`
  display: flex;
  justify-content: flex-end;
`;const et=a.button`
  ${K.outline};
  height: 40px;
  padding: 0 ${e=>e.theme.spacing.xl};
  font-size: ${e=>e.theme.font.size.md};
  font-weight: 600;
`,oe=a.button`
  ${K.primary};
  height: 40px;
  padding: 0 ${e=>e.theme.spacing.xl};
  font-size: ${e=>e.theme.font.size.md};
  font-weight: 700;
`,tt=a.div`
  display: grid;
  gap: ${e=>e.theme.spacing.sm};
  border: 1px dashed #cbd5f5;
  border-radius: ${e=>e.theme.radii.md};
  padding: ${e=>e.theme.spacing.md};
  background: #f8fafc;
`,st=a.button`
  ${K.outline};
  height: 40px;
  padding: 0 ${e=>e.theme.spacing.lg};
  font-weight: 600;
  font-size: ${e=>e.theme.font.size.md};
`,it=t.jsx("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:t.jsx("polyline",{points:"15 18 9 12 15 6"})}),rt=[{value:"MON",label:"월"},{value:"TUE",label:"화"},{value:"WED",label:"수"},{value:"THU",label:"목"},{value:"FRI",label:"금"},{value:"SAT",label:"토"},{value:"SUN",label:"일"}];function nt(e,f){return!e||!f?!1:e.split(",").map(h=>h.trim().toUpperCase()).includes(f)}function at(e){return Array.from(new Set(e)).filter(Boolean).join(",")}function ot(e,f){return(h,y)=>{const k=(e.recurrenceDays||"").split(",").map(m=>m.trim()).filter(m=>!!m).map(m=>m.toUpperCase()),I=y?[...k,h]:k.filter(m=>m!==h);f(m=>({...m,recurrenceDays:at(I)}))}}const dt=a.div`
  display: inline-flex;
  gap: ${e=>e.theme.spacing.sm};
  align-items: center;
  input[type="checkbox"] {
    width: 18px;
    height: 18px;
  }
`;export{ht as default};
