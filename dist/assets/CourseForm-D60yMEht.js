import{d as r,j as t,C as Se,r as u,u as ue,e as Te,a as me,D as ke}from"./index-B0K7mn4q.js";import{c as ie,S as pe,i as Ie,P as we,G as Ce}from"./UI-Cj3YhchZ.js";import{H as I}from"./CourseRecordStyles-zX-y5yWu.js";import{u as ze,a as Ne,g as De}from"./courses-DlbPyXYO.js";import{l as Le}from"./students-BeT2wLPO.js";import{g as te}from"./errors-C6OcbAl5.js";const Fe=r(we)`
  gap: ${e=>e.theme.spacing.lg};
`,Oe=r.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: ${e=>e.theme.spacing.md};
  align-items: center;
  @media (max-width: 720px) {
    grid-template-columns: 1fr;
    gap: ${e=>e.theme.spacing.sm};
  }
`;r.div`
  display: inline-flex;
  gap: ${e=>e.theme.spacing.sm};
  flex-wrap: wrap;
  justify-content: flex-end;
`;const Pe=r.form`
  display: grid;
  gap: ${e=>e.theme.spacing.xl};
`,Ee=r.div`
  background: #fee2e2;
  color: #b91c1c;
  border: 1px solid #fecaca;
  padding: ${e=>e.theme.spacing.sm} ${e=>e.theme.spacing.md};
  border-radius: ${e=>e.theme.radii.md};
  font-size: ${e=>e.theme.font.size.sm};
`,Ae=r.div`
  background: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
  padding: ${e=>e.theme.spacing.sm} ${e=>e.theme.spacing.md};
  border-radius: ${e=>e.theme.radii.md};
  font-size: ${e=>e.theme.font.size.sm};
`,Re=r.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${e=>e.theme.spacing.sm};
`,Me=r.button`
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
  &[data-active="true"] {
    border-color: #c7d2fe;
    background: #eef2ff;
    color: #1f2937;
    box-shadow: 0 6px 18px rgba(79, 70, 229, 0.15);
    .index {
      background: #6366f1;
      color: #fff;
    }
  }
  &[data-done="true"] {
    border-color: #c7d2fe;
    background: #f5f3ff;
    color: #1f2937;
    .index {
      background: #4f46e5;
      color: #fff;
    }
  }
`,Ue=r.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${e=>e.theme.spacing.md};
`,Be=r.button`
  ${ie.outline};
  height: 40px;
  padding: 0 ${e=>e.theme.spacing.xl};
  font-size: ${e=>e.theme.font.size.md};
  font-weight: 600;
`,ce=r.button`
  ${ie.primary};
  height: 40px;
  padding: 0 ${e=>e.theme.spacing.xl};
  font-size: ${e=>e.theme.font.size.md};
  font-weight: 700;
`,Ge=r.button`
  ${ie.outline};
  height: 40px;
  padding: 0 ${e=>e.theme.spacing.lg};
  font-weight: 600;
  font-size: ${e=>e.theme.font.size.md};
  display: inline-flex;
  align-items: center;
  gap: ${e=>e.theme.spacing.xs};
`,Ve=Se`
  0% { background-position: -200px 0; }
  100% { background-position: 200px 0; }
`,B=r.div`
  background: linear-gradient(90deg, #eef2f7 25%, #f6f8fb 37%, #eef2f7 63%);
  background-size: 400px 100%;
  animation: ${Ve} 1.2s ease-in-out infinite;
  border-radius: 8px;
  width: 100%;
  height: ${({$height:e})=>e||12}px;
`,_e=r.div`
  display: grid;
  gap: ${e=>e.theme.spacing.md};
`;function He(){return t.jsxs(pe,{children:[t.jsx(Ie,{children:"기본 정보"}),t.jsxs(_e,{children:[t.jsx(B,{$height:38}),t.jsx(B,{$height:38}),t.jsx(B,{$height:38}),t.jsx(B,{$height:38}),t.jsx(B,{$height:120})]})]})}function We({form:e,setForm:s,fieldErr:a,setFieldErr:m,courseTypeOptions:n,meta:$}){return t.jsxs(re,{children:[t.jsxs(ae,{children:[t.jsx(oe,{children:$.title}),t.jsx(q,{children:$.lead})]}),t.jsxs(le,{children:[t.jsxs(T,{children:[t.jsxs(k,{children:["수업명",t.jsx("span",{children:"*"})]}),t.jsx(J,{"aria-invalid":!!a.title,value:e.title,onChange:o=>{const x=o.target.value;s(h=>({...h,title:x})),a.title&&m(h=>({...h,title:void 0}))},placeholder:"예: 영어 회화 A반"}),a.title?t.jsx(ne,{children:a.title}):null]}),t.jsxs(T,{children:[t.jsx(k,{children:"상태"}),t.jsxs(qe,{value:e.status,onChange:o=>s(x=>({...x,status:o.target.value})),children:[t.jsx("option",{value:"IN_PROGRESS",children:"진행중"}),t.jsx("option",{value:"PENDING",children:"대기"}),t.jsx("option",{value:"STOPPED",children:"중단"})]})]}),t.jsxs(T,{as:"div",children:[t.jsx(k,{children:"수업 형태"}),t.jsx(Je,{role:"radiogroup","aria-label":"수업 형태",children:n.map(o=>t.jsxs(Qe,{type:"button","data-active":e.courseType===o.value,onClick:()=>{s(x=>{const h={...x,courseType:o.value};return o.value==="INDIVIDUAL"?(h.capacity=1,h.primaryStudentId=null,h.primaryStudentName=""):(h.primaryStudentId=null,h.primaryStudentName=""),h}),o.value!=="INDIVIDUAL"&&m(x=>({...x,student:void 0}))},children:[t.jsx("span",{className:"title",children:o.label}),t.jsx("span",{className:"desc",children:o.description})]},o.value))}),t.jsx(I,{children:"수업 형태에 따라 통계와 요금 정책을 나눌 수 있어요."})]})]})]})}function Ke({form:e,setForm:s,fieldErr:a,setFieldErr:m,meta:n,isIndividual:$,studentFilter:o,setStudentFilter:x,studentLoading:h,studentError:f,onSelectStudent:y,filteredStudents:S,recurring:p,setRecurring:w,dayOptions:A,hasDay:R,toggleDay:C,minuteOptions:z,hourOptions:N}){const L=()=>h?t.jsx(se,{children:"학생 목록을 불러오는 중입니다…"}):f?t.jsx(se,{children:f}):S.length===0?t.jsx(se,{children:"등록된 학생이 없습니다. 원생 등록 후 다시 시도해 주세요."}):S.map(i=>t.jsxs(Ze,{type:"button",role:"option","data-active":e.primaryStudentId===i.id,"aria-selected":e.primaryStudentId===i.id,onClick:()=>{y(i),a.student&&m(g=>({...g,student:void 0}))},children:[t.jsx("span",{className:"name",children:i.name}),i.code?t.jsx("span",{className:"meta",children:i.code}):null]},i.id));return t.jsxs(re,{children:[t.jsxs(ae,{children:[t.jsx(oe,{children:n.title}),t.jsx(q,{children:n.lead})]}),t.jsxs(le,{children:[$?t.jsxs(T,{children:[t.jsxs(k,{children:["담당 학생",t.jsx("span",{children:"*"})]}),t.jsx(J,{type:"search",placeholder:"학생 이름이나 코드를 입력해 주세요",value:o,onChange:i=>x(i.target.value)}),t.jsx(Xe,{role:"listbox","data-invalid":a.student?"true":void 0,"aria-busy":h,children:L()}),e.primaryStudentId?t.jsxs(I,{children:["선택된 학생: ",e.primaryStudentName||`학생 #${e.primaryStudentId}`]}):null,a.student?t.jsx(ne,{children:a.student}):null]}):null,t.jsxs(T,{children:[t.jsx(k,{children:"반복 여부"}),t.jsxs(et,{children:[t.jsx("input",{id:"recurring",type:"checkbox",checked:p,onChange:i=>w(i.currentTarget.checked)}),t.jsx("label",{htmlFor:"recurring",children:"정기 반복"})]}),t.jsx(I,{children:"정기 수업이 아니라면 체크를 해제하세요."})]}),t.jsxs(T,{children:[t.jsxs(k,{children:["반복 요일",p?t.jsx("span",{children:"*"}):null]}),t.jsx(tt,{"aria-disabled":!p,"aria-invalid":p&&!!a.schedule,children:A.map(i=>{const g=R(e.recurrenceDays,i.value);return t.jsx(st,{type:"button","data-active":g,disabled:!p,onClick:()=>C(i.value,!g),children:i.label},i.value)})}),t.jsx(I,{children:"예: 월/수는 MON,WED 로 저장됩니다."})]}),t.jsxs(T,{children:[t.jsxs(k,{children:["반복 시간",p?t.jsx("span",{children:"*"}):null]}),t.jsxs(nt,{children:[t.jsx("select",{disabled:!p,"aria-invalid":p&&!!a.schedule,value:(e.startTime??"").slice(0,2)||"00",onChange:i=>{const g=i.target.value,j=(e.startTime??"00:00").slice(3,5)||"00";s(v=>({...v,startTime:`${g}:${j}`}))},children:N.map(i=>t.jsx("option",{value:i,children:i},i))}),t.jsx("span",{children:":"}),t.jsx("select",{disabled:!p,"aria-invalid":p&&!!a.schedule,value:(e.startTime??"").slice(3,5)||"00",onChange:i=>{const g=i.target.value,j=(e.startTime??"00:00").slice(0,2)||"00";s(v=>({...v,startTime:`${j}:${g}`}))},children:z.map(i=>t.jsx("option",{value:i,children:i},i))}),t.jsx("span",{children:"~"}),t.jsx("select",{disabled:!p,"aria-invalid":p&&!!a.schedule,value:(e.endTime??"").slice(0,2)||"00",onChange:i=>{const g=i.target.value,j=(e.endTime??"00:00").slice(3,5)||"00";s(v=>({...v,endTime:`${g}:${j}`}))},children:N.map(i=>t.jsx("option",{value:i,children:i},i))}),t.jsx("span",{children:":"}),t.jsx("select",{disabled:!p,"aria-invalid":p&&!!a.schedule,value:(e.endTime??"").slice(3,5)||"00",onChange:i=>{const g=i.target.value,j=(e.endTime??"00:00").slice(0,2)||"00";s(v=>({...v,endTime:`${j}:${g}`}))},children:z.map(i=>t.jsx("option",{value:i,children:i},i))})]}),t.jsx(I,{children:"시/분을 고정 옵션으로 선택합니다(5분 단위)."}),a.schedule?t.jsx(ne,{children:a.schedule}):null]})]})]})}function Ye({form:e,setForm:s,meta:a,feeInput:m,setFeeInput:n,formatNumberKR:$,isIndividual:o,isEdit:x,onNavigateEditStudents:h}){return t.jsxs(re,{children:[t.jsxs(ae,{children:[t.jsx(oe,{children:a.title}),t.jsx(q,{children:a.lead})]}),t.jsxs(le,{children:[t.jsxs(T,{children:[t.jsx(k,{children:"정원"}),t.jsx(J,{type:"number",min:1,value:e.capacity??"",disabled:o,onChange:f=>s(y=>({...y,capacity:f.target.value?Number(f.target.value):void 0})),placeholder:"예: 12"}),o?t.jsx(I,{children:"개인 수업은 정원이 1명으로 고정됩니다."}):null]}),t.jsxs(T,{children:[t.jsx(k,{children:"수강료"}),t.jsxs(it,{children:[t.jsx(J,{type:"text",inputMode:"numeric",value:m,onChange:f=>{const y=(f.target.value||"").replace(/[^0-9]/g,"");n($(y)),s(S=>({...S,fee:y?Number(y):void 0}))},placeholder:"예: 150,000",style:{paddingRight:38}}),t.jsx(rt,{children:"원"})]})]}),t.jsxs(T,{style:{gridColumn:"1 / -1"},children:[t.jsx(k,{children:"설명"}),t.jsx(at,{rows:5,value:e.description??"",onChange:f=>s(y=>({...y,description:f.target.value})),placeholder:"수업에 대한 간단한 설명"})]})]}),x?t.jsxs(ot,{children:[t.jsx(q,{children:"수강생 관리"}),t.jsx(I,{children:"학생 관리는 상세 페이지의 ‘수강생 수정’에서 변경하세요."}),t.jsx(Ce,{onClick:h,children:"수강생 수정 바로가기"})]}):null]})}const re=r(pe)`
  display: grid;
  gap: ${e=>e.theme.spacing.md};
`,ae=r.header`
  display: grid;
  gap: ${e=>e.theme.spacing.xs};
`,oe=r.h3`
  margin: 0;
  font-size: ${e=>e.theme.font.size.lg};
  font-weight: ${e=>e.theme.font.weight.bold};
`,q=r.p`
  margin: 0;
  color: ${e=>e.theme.colors.textMuted};
  font-size: ${e=>e.theme.font.size.sm};
`,le=r.div`
  display: grid;
  gap: ${e=>e.theme.spacing.md};
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
`,T=r.div`
  display: grid;
  gap: ${e=>e.theme.spacing.xs};
`,k=r.label`
  font-size: ${e=>e.theme.font.size.sm};
  font-weight: ${e=>e.theme.font.weight.medium};
  color: ${e=>e.theme.colors.text};
  span {
    margin-left: 4px;
    color: ${e=>e.theme.colors.danger};
  }
`,J=r.input`
  height: 44px;
  border: 1px solid ${e=>e.theme.colors.border};
  border-radius: ${e=>e.theme.radii.md};
  padding: 0 ${e=>e.theme.spacing.sm};
  font-size: ${e=>e.theme.font.size.sm};
  color: ${e=>e.theme.colors.text};
  &:focus {
    outline: none;
    border-color: ${e=>e.theme.colors.primary};
    box-shadow: ${e=>e.theme.shadow.focusPrimary};
  }
`,qe=r.select`
  height: 44px;
  border: 1px solid ${e=>e.theme.colors.border};
  border-radius: ${e=>e.theme.radii.md};
  padding: 0 ${e=>e.theme.spacing.sm};
  font-size: ${e=>e.theme.font.size.sm};
  color: ${e=>e.theme.colors.text};
`,ne=r.span`
  font-size: ${e=>e.theme.font.size.xs};
  color: ${e=>e.theme.colors.danger};
`,Je=r.div`
  display: grid;
  gap: ${e=>e.theme.spacing.sm};
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
`,Qe=r.button`
  display: grid;
  gap: ${e=>e.theme.spacing.xs};
  padding: ${e=>e.theme.spacing.sm};
  border-radius: ${e=>e.theme.radii.md};
  border: 1px solid ${e=>e.theme.colors.border};
  text-align: left;
  background: ${e=>e.theme.colors.surface};
  cursor: pointer;
  .title {
    font-size: ${e=>e.theme.font.size.sm};
    font-weight: ${e=>e.theme.font.weight.semiBold};
  }
  .desc {
    font-size: ${e=>e.theme.font.size.xs};
    color: ${e=>e.theme.colors.textMuted};
  }
  &[data-active="true"] {
    border-color: ${e=>e.theme.colors.primary};
    background: ${e=>e.theme.colors.primarySurface};
  }
`,Xe=r.div`
  margin-top: ${e=>e.theme.spacing.xs};
  border: 1px solid ${e=>e.theme.colors.border};
  border-radius: ${e=>e.theme.radii.md};
  max-height: 240px;
  overflow-y: auto;
  display: grid;
  gap: 2px;
  padding: 4px;
  &[data-invalid="true"] {
    border-color: ${e=>e.theme.colors.danger};
  }
`,se=r.div`
  padding: ${e=>e.theme.spacing.md};
  font-size: ${e=>e.theme.font.size.sm};
  color: ${e=>e.theme.colors.textMuted};
  text-align: center;
`,Ze=r.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${e=>e.theme.spacing.xs};
  padding: ${e=>e.theme.spacing.sm};
  border-radius: ${e=>e.theme.radii.sm};
  border: none;
  background: ${e=>e.theme.colors.surface};
  cursor: pointer;
  .name {
    font-weight: ${e=>e.theme.font.weight.medium};
    color: ${e=>e.theme.colors.text};
  }
  .meta {
    font-size: ${e=>e.theme.font.size.xs};
    color: ${e=>e.theme.colors.textMuted};
  }
  &[data-active="true"] {
    background: ${e=>e.theme.colors.primarySurface};
  }
`,et=r.div`
  display: inline-flex;
  align-items: center;
  gap: ${e=>e.theme.spacing.xs};
  input {
    width: 18px;
    height: 18px;
  }
  label {
    font-size: ${e=>e.theme.font.size.sm};
    color: ${e=>e.theme.colors.text};
  }
`,tt=r.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${e=>e.theme.spacing.xs};
`,st=r.button`
  min-width: 36px;
  height: 32px;
  padding: 0 ${e=>e.theme.spacing.xs};
  border-radius: 999px;
  border: 1px solid ${e=>e.theme.colors.border};
  background: ${e=>e.theme.colors.surface};
  font-size: ${e=>e.theme.font.size.xs};
  cursor: pointer;
  &[data-active="true"] {
    border-color: ${e=>e.theme.colors.primary};
    background: ${e=>e.theme.colors.primarySurface};
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`,nt=r.div`
  display: inline-flex;
  align-items: center;
  gap: ${e=>e.theme.spacing.xs};
  select {
    height: 40px;
    border: 1px solid ${e=>e.theme.colors.border};
    border-radius: ${e=>e.theme.radii.md};
    padding: 0 ${e=>e.theme.spacing.xs};
  }
  span {
    font-size: ${e=>e.theme.font.size.sm};
    color: ${e=>e.theme.colors.textMuted};
  }
`,it=r.div`
  position: relative;
  display: inline-flex;
  width: 100%;
`,rt=r.span`
  position: absolute;
  right: ${e=>e.theme.spacing.sm};
  top: 50%;
  transform: translateY(-50%);
  font-size: ${e=>e.theme.font.size.sm};
  color: ${e=>e.theme.colors.textMuted};
`,at=r.textarea`
  width: 100%;
  min-height: 120px;
  border: 1px solid ${e=>e.theme.colors.border};
  border-radius: ${e=>e.theme.radii.md};
  padding: ${e=>e.theme.spacing.sm};
  font-size: ${e=>e.theme.font.size.sm};
  color: ${e=>e.theme.colors.text};
  resize: vertical;
`,ot=r.div`
  margin-top: ${e=>e.theme.spacing.md};
  border: 1px solid ${e=>e.theme.colors.border};
  border-radius: ${e=>e.theme.radii.md};
  padding: ${e=>e.theme.spacing.md};
  display: grid;
  gap: ${e=>e.theme.spacing.xs};
  background: ${e=>e.theme.colors.surfaceAlt};
  ${I} {
    margin: 0;
  }
`,lt=[{value:"MON",label:"월"},{value:"TUE",label:"화"},{value:"WED",label:"수"},{value:"THU",label:"목"},{value:"FRI",label:"금"},{value:"SAT",label:"토"},{value:"SUN",label:"일"}],he=e=>String(e).padStart(2,"0"),dt=Array.from({length:24},(e,s)=>he(s)),ct=Array.from({length:12},(e,s)=>he(s*5));function ut(e){const s=String(e??"").replace(/[^0-9]/g,"");return s?Number(s).toLocaleString("ko-KR"):""}function mt(e,s){return e?e.split(",").map(a=>a.trim().toUpperCase()).includes(s):!1}function pt(e){return Array.from(new Set(e)).filter(Boolean).join(",")}function ht(e,s){return u.useCallback((a,m)=>{const n=(e.recurrenceDays||"").split(",").map(o=>o.trim()).filter(o=>!!o).map(o=>o.toUpperCase()),$=m?[...n,a]:n.filter(o=>o!==a);s(o=>({...o,recurrenceDays:pt($)}))},[e.recurrenceDays,s])}const gt=t.jsx("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:t.jsx("polyline",{points:"15 18 9 12 15 6"})});function xt({isEdit:e,onBack:s,steps:a,step:m,setStep:n,isLastStep:$,form:o,setForm:x,toggleDay:h,recurring:f,setRecurring:y,studentLoading:S,studentError:p,studentFilter:w,setStudentFilter:A,filteredStudents:R,fieldErrors:C,setFieldErrors:z,feeInput:N,setFeeInput:L,loading:i,saving:g,error:j,success:v,goNext:G,goPrev:Q,onSubmit:V,onSelectStudent:X,navigateEditStudents:F}){const _=o.courseType==="INDIVIDUAL";return t.jsxs(Fe,{children:[t.jsxs(Oe,{children:[t.jsxs(Ge,{type:"button",onClick:s,children:[gt," 뒤로"]}),t.jsx("h2",{children:e?"수업 수정":"수업 추가하기"})]}),j?t.jsx(Ee,{children:j}):null,v?t.jsx(Ae,{children:v}):null,i?t.jsx(He,{}):t.jsxs(Pe,{id:"course-form",onSubmit:V,children:[t.jsx(Re,{children:a.map((O,D)=>{const b=D<m;return t.jsxs(Me,{type:"button","data-active":D===m,"data-done":D<m,disabled:!b,onClick:()=>{b&&(n(D),window.scrollTo({top:0,behavior:"smooth"}))},children:[t.jsx("span",{className:"index",children:D+1}),t.jsx("span",{className:"label",children:O.title})]},O.key)})}),m===0?t.jsx(We,{form:o,setForm:x,fieldErr:C,setFieldErr:z,courseTypeOptions:[{value:"INDIVIDUAL",label:"개인 수업",description:"1명의 학생과 진행되는 1:1 수업"},{value:"GROUP",label:"단체 수업",description:"여러 학생이 함께 참여하는 그룹 수업"}],meta:a[0]}):null,m===1?t.jsx(Ke,{form:o,setForm:x,fieldErr:C,setFieldErr:z,meta:a[1],isIndividual:_,studentFilter:w,setStudentFilter:A,studentLoading:S,studentError:p,filteredStudents:R,onSelectStudent:X,recurring:f,setRecurring:y,dayOptions:lt,hasDay:mt,toggleDay:h,minuteOptions:ct,hourOptions:dt}):null,m===2?t.jsx(Ye,{form:o,setForm:x,meta:a[2],feeInput:N,setFeeInput:L,formatNumberKR:ut,isIndividual:_,isEdit:e,onNavigateEditStudents:F}):null,t.jsxs(Ue,{children:[m>0?t.jsx(Be,{type:"button",onClick:Q,children:"이전 단계"}):t.jsx("span",{}),$?t.jsx(ce,{type:"submit",disabled:g,children:g?"저장 중...":e?"수업 수정 완료":"수업 저장"}):t.jsx(ce,{type:"button",onClick:G,children:"다음 단계"})]})]})]})}const ft={title:"",description:"",status:"IN_PROGRESS",courseType:"GROUP",primaryStudentId:null,primaryStudentName:""};function bt(){const e=ue(),{id:s}=Te(),a=u.useMemo(()=>!!s,[s]),m=u.useMemo(()=>{if(!s)return null;const d=Number(s);return Number.isFinite(d)?d:null},[s]),[n,$]=u.useState(()=>({...ft})),[o,x]=u.useState(""),h=ht(n,$),[f,y]=u.useState(!0),[S,p]=u.useState(0),[w,A]=u.useState([]),[R,C]=u.useState(!1),[z,N]=u.useState(null),[L,i]=u.useState(!1),[g,j]=u.useState(""),[v,G]=u.useState(!1),[Q,V]=u.useState(!1),[X,F]=u.useState(null),[_,O]=u.useState(null),[D,b]=u.useState({}),H=u.useMemo(()=>[{key:"basic",title:"기본 정보",lead:"수업명과 상태를 먼저 확인해 주세요."},{key:"schedule",title:"수업 일정",lead:"정기 반복 여부와 시간을 선택합니다."},{key:"details",title:"추가 설정",lead:"정원, 수강료, 설명을 정리해 마무리하세요."}],[]),ge=S===H.length-1,W=n.courseType==="INDIVIDUAL",M=u.useCallback(d=>{$(l=>d(l))},[]),xe=u.useCallback(d=>{b(l=>d(l))},[]),fe=u.useMemo(()=>{const d=g.trim().toLowerCase();return d?w.filter(l=>{const c=l.name?.toLowerCase()??"",U=l.code?.toLowerCase()??"";return c.includes(d)||U.includes(d)}):w},[w,g]);u.useEffect(()=>{if(!W||L)return;let d=!1;async function l(){C(!0),N(null);try{let U=0,Z=[];for(;;){const P=await Le({page:U,size:100}),{content:K,last:E}=P,ee=K.map(Y=>({id:Y.id,name:Y.name,code:Y.code,status:Y.status}));if(Z=Z.concat(ee),E||K.length===0||U>200)break;U+=1}if(!d){const P=new Map;for(const E of Z)P.set(E.id,E);n.primaryStudentId&&!P.has(n.primaryStudentId)&&P.set(n.primaryStudentId,{id:n.primaryStudentId,name:n.primaryStudentName||`학생 #${n.primaryStudentId}`,code:void 0,status:"ENROLLED"});const K=Array.from(P.values()).sort((E,ee)=>(E.name||"").localeCompare(ee.name||"","ko-KR"));A(K),i(!0)}}catch(c){d||(N(te(c,"학생 목록을 불러오지 못했습니다.")),i(!0))}finally{d||C(!1)}}return l(),()=>{d=!0}},[n.primaryStudentId,n.primaryStudentName,W,L]),u.useEffect(()=>{if(!a||!m)return;let d=!1;async function l(){G(!0),F(null);try{const c=await De(m);!d&&c&&(M(()=>({title:c.title,description:c.description,status:c.status,courseType:c.courseType??"GROUP",capacity:(c.courseType??"GROUP")==="INDIVIDUAL"?1:c.capacity,fee:c.fee,courseTime:c.courseTime,recurrenceDays:Array.isArray(c.recurrenceDays)?c.recurrenceDays.join(","):c.recurrenceDays??"",startTime:c.startTime?c.startTime.slice(0,5):"",endTime:c.endTime?c.endTime.slice(0,5):"",primaryStudentId:c.primaryStudentId??null,primaryStudentName:c.primaryStudentName??""})),x(c.fee!=null?String(c.fee):""))}catch(c){d||F(te(c,"수업 정보를 불러오지 못했습니다."))}finally{d||G(!1)}}return l(),()=>{d=!0}},[m,a,M]);const de=u.useCallback(d=>{if(d===0){if(!n.title||!n.title.trim())return b(l=>({...l,title:"수업명을 입력해 주세요."})),!1;b(l=>({...l,title:void 0}))}if(d===1){if(n.courseType==="INDIVIDUAL"&&!n.primaryStudentId)return b(l=>({...l,student:"학생을 선택해 주세요."})),!1;if(b(l=>({...l,student:void 0})),f&&(!n.recurrenceDays||!n.recurrenceDays.trim()||!n.startTime||!n.endTime))return b(l=>({...l,schedule:"반복 요일과 시작/종료 시간을 선택해 주세요."})),!1;b(l=>({...l,schedule:void 0}))}return!0},[n,f]),be=u.useCallback(()=>{de(S)&&(p(d=>Math.min(d+1,H.length-1)),window.scrollTo({top:0,behavior:"smooth"}))},[S,H.length,de]),$e=u.useCallback(()=>{p(d=>Math.max(d-1,0)),window.scrollTo({top:0,behavior:"smooth"})},[]),ye=u.useCallback(async d=>{if(d.preventDefault(),F(null),O(null),b({}),!n.title||!n.title.trim()){b(l=>({...l,title:"수업명을 입력해 주세요."}));return}if(W&&!n.primaryStudentId){b(l=>({...l,student:"학생을 선택해 주세요."}));return}V(!0);try{if(f&&(!n.recurrenceDays||!n.recurrenceDays.trim()||!n.startTime||!n.endTime)){b(c=>({...c,schedule:"반복 요일과 시작/종료 시간을 선택해 주세요."}));return}const l={...n,startTime:n.startTime?.length===5?`${n.startTime}:00`:n.startTime,endTime:n.endTime?.length===5?`${n.endTime}:00`:n.endTime,recurring:f};a&&m?(await ze(m,l),O("수정이 완료되었습니다.")):(await Ne(l),O("수업이 추가되었습니다.")),e(me.classes,{replace:!0})}catch(l){F(te(l,"저장에 실패했습니다."))}finally{V(!1)}},[m,n,a,W,e,f]),je=u.useCallback(d=>{M(l=>({...l,primaryStudentId:d.id,primaryStudentName:d.name}))},[M]),ve=u.useCallback(()=>{m&&e(ke.classes.editStudents(m))},[m,e]);return{isEdit:a,courseId:m,steps:H,step:S,setStep:p,isLastStep:ge,form:n,setForm:M,accordionToggle:h,recurring:f,setRecurring:y,studentLoading:R,studentError:z,studentFilter:g,setStudentFilter:j,filteredStudents:fe,fieldErrors:D,setFieldErrors:xe,feeInput:o,setFeeInput:x,loading:v,saving:Q,error:X,success:_,goNext:be,goPrev:$e,submit:ye,onSelectStudent:je,navigateEditStudents:ve}}function kt(){const e=ue(),s=bt();return t.jsx(xt,{isEdit:s.isEdit,onBack:()=>e(me.classes),steps:s.steps,step:s.step,setStep:s.setStep,isLastStep:s.isLastStep,form:s.form,setForm:s.setForm,toggleDay:s.accordionToggle,recurring:s.recurring,setRecurring:s.setRecurring,studentLoading:s.studentLoading,studentError:s.studentError,studentFilter:s.studentFilter,setStudentFilter:s.setStudentFilter,filteredStudents:s.filteredStudents,fieldErrors:s.fieldErrors,setFieldErrors:s.setFieldErrors,feeInput:s.feeInput,setFeeInput:s.setFeeInput,loading:s.loading,saving:s.saving,error:s.error,success:s.success,goNext:s.goNext,goPrev:s.goPrev,onSubmit:s.submit,onSelectStudent:s.onSelectStudent,navigateEditStudents:s.navigateEditStudents})}export{kt as default};
