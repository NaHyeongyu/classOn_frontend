import{u as ne,e as ie,r as d,j as t,P as ae,S as b,s as w,d as a,t as re,l as oe}from"./index-Cq8NHvix.js";import{I as de}from"./InfoBanner-rzT6Gq86.js";import{B as H}from"./BackButton-DEQnWac-.js";import{g as le,u as ce,c as he}from"./students-ChMs12vx.js";const me={ENROLLED:"수강중",ON_LEAVE:"휴학",PENDING:"대기중"},ge={ENROLLED:"현재 수업을 듣고 있는 원생입니다.",ON_LEAVE:"일시 휴학 상태로 관리됩니다.",PENDING:"상담/등록 대기 중인 원생입니다."},ue="ENROLLED",pe="현재 수업 상태를 선택하세요.",xe="미지정",fe=[{value:"ENROLLED",label:"수강중",icon:"🎓"},{value:"ON_LEAVE",label:"휴학",icon:"🌙"},{value:"PENDING",label:"대기중",icon:"⌛"}];function Ke(){const e=ne(),{id:j}=ie(),p=d.useMemo(()=>!!j,[j]),$=d.useMemo(()=>j?Number(j):null,[j]),[U,B]=d.useState(!1),[l,I]=d.useState(!1),[M,v]=d.useState(null),[_,N]=d.useState(null),[V,q]=d.useState(!0);function K(){const s=new Date,n=String(s.getMonth()+1).padStart(2,"0"),i=String(s.getDate()).padStart(2,"0");return`${s.getFullYear()}-${n}-${i}`}const[r,c]=d.useState({name:"",status:"ENROLLED",joinedDate:K()}),[z,L]=d.useState(""),[k,A]=d.useState(""),[F,C]=d.useState(""),W=new Date().getFullYear(),Z=Array.from({length:40},(s,n)=>String(W-n)),J=Array.from({length:12},(s,n)=>String(n+1).padStart(2,"0"));function Q(s,n){const i=Number(s),o=Number(n);return!i||!o?31:new Date(i,o,0).getDate()}const X=Array.from({length:Q(z,k)},(s,n)=>String(n+1).padStart(2,"0"));function Y(s){const[n,i,o]=s.split("-").map(h=>Number(h));return!n||!i||!o?null:{y:n,m:i,d:o}}function ee(s){if(!s)return;const n=Y(s);if(!n)return;const i=new Date;let o=i.getFullYear()-n.y;const h=i.getMonth()+1,x=i.getDate();return(h<n.m||h===n.m&&x<n.d)&&(o-=1),o}function te(s){if(!s)return;const n=Y(s);return n?new Date().getFullYear()-n.y+1:void 0}const S=d.useMemo(()=>ee(r.birthDate),[r.birthDate]),G=d.useMemo(()=>te(r.birthDate),[r.birthDate]),D=r.status??ue;d.useEffect(()=>{if(!p||!$)return;let s=!1;async function n(){B(!0),v(null);try{const i=await le($);if(!s)if(c({name:i.name,status:i.status,age:i.age,phoneNumber:i.phoneNumber,guardianPhone:i.guardianPhone,joinedDate:i.joinedDate??i.createdAt?.slice(0,10),birthDate:i.birthDate,address:i.address,parentName:i.parentName}),i.birthDate){const[o,h,x]=i.birthDate.split("-");L(o||""),A(h||""),C(x||"")}else L(""),A(""),C("")}catch(i){s||v(i?.message||"원생 정보를 불러오지 못했습니다.")}finally{s||B(!1)}}return n(),()=>{s=!0}},[p,$]);function T(s,n,i){const o=s??z,h=n??k,x=i??F;L(o),A(h),C(x),c(o&&h&&x?O=>({...O,birthDate:`${o}-${h}-${x}`}):O=>({...O,birthDate:void 0}))}async function se(s){if(s.preventDefault(),v(null),N(null),!r.name||!r.name.trim()){v("이름은 필수입니다.");return}I(!0);try{const n={...r,name:r.name.trim(),status:r.status||"ENROLLED"};S!=null&&(n.age=S);let i;p&&$?(i=await ce($,n),N("수정이 완료되었습니다."),e(`/students/${i.id}`,{replace:!0})):(i=await he(n),N("원생이 추가되었습니다."),e(`/students/${i.id}`,{replace:!0}))}catch(n){v(n?.message||"저장에 실패했습니다.")}finally{I(!1)}}return t.jsxs(be,{children:[t.jsxs(je,{children:[t.jsxs($e,{children:[t.jsx(H,{to:"/students",label:"뒤로"}),t.jsxs("div",{children:[t.jsx("h2",{children:p?"원생 정보 수정":"원생 추가하기"}),t.jsx("p",{children:"기본 정보를 입력하고 저장하세요."})]})]}),t.jsxs(ve,{children:[t.jsx(H,{to:"/students",label:"취소"}),t.jsx(ae,{as:"button",type:"button",onClick:()=>{const s=document.getElementById("student-form");if(s)try{s.requestSubmit?s.requestSubmit():s.submit()}catch{s.submit()}},disabled:l,children:l?"저장 중...":"저장"})]})]}),M&&t.jsx(De,{children:M}),_&&t.jsx(we,{children:_}),U?t.jsx(He,{}):t.jsxs(ye,{id:"student-form",onSubmit:se,children:[V?t.jsx(de,{title:p?"원생 정보를 빠르게 수정하는 방법":"원생 등록 3단계",description:p?"연락처·주소 변경 후 저장하면 바로 반영됩니다. 변경 이유를 메모에 남기면 추후 조회가 쉬워요.":"기본 정보 입력 → 보호자/주소 확인 → 저장 순으로 진행하면 1분 안에 등록을 마칠 수 있어요.",tips:["생년월일을 입력하면 나이가 자동 계산됩니다.","연락처는 하이픈(-)을 포함하면 검색 시 정확도가 높아집니다.","보호자 정보가 아직 없다면 비워둔 뒤 나중에 수정해도 괜찮아요."],onClose:()=>q(!1)}):null,t.jsxs(Ee,{children:[t.jsxs(Ne,{children:[t.jsxs(b,{children:[t.jsx(w,{children:"기본 정보"}),t.jsx(R,{children:"수업 및 청구에 사용되는 핵심 정보입니다."}),t.jsxs(E,{children:[t.jsxs(g,{children:[t.jsxs(u,{children:["이름",t.jsx("span",{children:"*"})]}),t.jsx(f,{value:r.name,onChange:s=>c(n=>({...n,name:s.target.value})),placeholder:"홍길동",required:!0,disabled:l}),t.jsx(y,{children:"출석부/청구서에 표시될 이름입니다."})]}),t.jsxs(g,{style:{gridColumn:"1 / -1"},children:[t.jsx(u,{children:"상태"}),t.jsx(Pe,{children:fe.map(s=>t.jsxs(Be,{type:"button","data-active":D===s.value,onClick:()=>c(n=>({...n,status:s.value})),disabled:l,children:[t.jsx("span",{"aria-hidden":!0,children:s.icon}),s.label]},s.value))}),t.jsx(y,{children:ge[D]??pe})]}),t.jsxs(g,{children:[t.jsx(u,{children:"생년월일"}),t.jsxs(Se,{children:[t.jsxs(P,{value:z,onChange:s=>T(s.target.value||"",void 0,void 0),disabled:l,children:[t.jsx("option",{value:"",children:"연도"}),Z.map(s=>t.jsx("option",{value:s,children:s},s))]}),t.jsxs(P,{value:k,onChange:s=>T(void 0,s.target.value||"",void 0),disabled:l,children:[t.jsx("option",{value:"",children:"월"}),J.map(s=>t.jsx("option",{value:s,children:s},s))]}),t.jsxs(P,{value:F,onChange:s=>T(void 0,void 0,s.target.value||""),disabled:l,children:[t.jsx("option",{value:"",children:"일"}),X.map(s=>t.jsx("option",{value:s,children:s},s))]})]}),t.jsx(y,{children:"생년월일 입력 시 나이는 자동 계산됩니다."})]}),t.jsxs(g,{children:[t.jsx(u,{children:"연락처"}),t.jsx(f,{value:r.phoneNumber??"",onChange:s=>c(n=>({...n,phoneNumber:s.target.value||void 0})),placeholder:"010-1234-5678",pattern:"^010-\\\\d{4}-\\\\d{4}$",onBlur:s=>{const n=s.currentTarget.value.replace(/[^0-9]/g,"");n.length===11&&n.startsWith("010")&&(s.currentTarget.value=`010-${n.slice(3,7)}-${n.slice(7)}`,c(i=>({...i,phoneNumber:s.currentTarget.value})))},disabled:l}),t.jsx(y,{children:"가능한 경우 학부모 연락처와 구분해서 입력하세요."})]}),t.jsxs(g,{children:[t.jsx(u,{children:"등록일"}),t.jsx(f,{type:"date",value:r.joinedDate??"",readOnly:!0,disabled:!0})]})]})]}),t.jsxs(b,{children:[t.jsx(w,{children:"부모님/주소"}),t.jsx(R,{children:"연락 경로와 청구 주소를 정돈해 두면 업무가 편해져요."}),t.jsxs(E,{children:[t.jsxs(g,{children:[t.jsx(u,{children:"보호자 이름"}),t.jsx(f,{value:r.parentName??"",onChange:s=>c(n=>({...n,parentName:s.target.value||void 0})),placeholder:"김철수",disabled:l})]}),t.jsxs(g,{children:[t.jsx(u,{children:"보호자 연락처"}),t.jsx(f,{value:r.guardianPhone??"",onChange:s=>c(n=>({...n,guardianPhone:s.target.value||void 0})),placeholder:"010-1234-5678",pattern:"^010-\\\\d{4}-\\\\d{4}$",onBlur:s=>{const n=s.currentTarget.value.replace(/[^0-9]/g,"");n.length===11&&n.startsWith("010")&&(s.currentTarget.value=`010-${n.slice(3,7)}-${n.slice(7)}`,c(i=>({...i,guardianPhone:s.currentTarget.value})))},disabled:l}),t.jsx(y,{children:"비상 연락을 위해 보호자 연락처를 입력해 주세요."})]}),t.jsxs(g,{style:{gridColumn:"1 / -1"},children:[t.jsx(u,{children:"주소"}),t.jsx(f,{value:r.address??"",onChange:s=>c(n=>({...n,address:s.target.value||void 0})),placeholder:"서울시 강남구 ...",disabled:l})]})]})]}),p&&t.jsxs(Ie,{children:[t.jsx(Me,{children:"위험 구역"}),t.jsx(_e,{children:"삭제 기능은 추후 연결됩니다. (디자인 프리셋)"}),t.jsx(Fe,{type:"button",disabled:!0,children:"원생 삭제"})]})]}),t.jsxs(ze,{"aria-label":"form tips",children:[t.jsxs(Le,{children:[t.jsx(ke,{children:"입력 미리 보기"}),t.jsxs(Ae,{children:[t.jsxs("li",{children:[t.jsx("span",{children:"이름"}),t.jsx("strong",{children:r.name?.trim()||"미입력"})]}),t.jsxs("li",{children:[t.jsx("span",{children:"상태"}),t.jsx(Ce,{$variant:D,children:me[D]??xe})]}),t.jsxs("li",{children:[t.jsx("span",{children:"나이"}),t.jsxs("strong",{children:[G!=null?`${G}세`:"-",S!=null?` / 만 ${S}`:""]})]}),t.jsxs("li",{children:[t.jsx("span",{children:"등록일"}),t.jsx("strong",{children:r.joinedDate??"-"})]})]}),t.jsx(Te,{children:"저장 전 요약을 빠르게 확인할 수 있어요."})]}),t.jsxs(Oe,{children:[t.jsx("h4",{children:"입력 팁"}),t.jsxs("ul",{children:[t.jsx("li",{children:"수강 상태는 언제든지 변경 가능하니 현재 상황을 기준으로 선택하세요."}),t.jsx("li",{children:"연락처는 하이픈(-)을 포함하면 더 읽기 쉬워요."}),t.jsx("li",{children:"주소를 입력해두면 청구·우편 발송 시 다시 묻지 않아도 됩니다."})]})]})]})]})]})]})}const be=a(oe)`
  gap: ${e=>e.theme.spacing.lg};
  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
  padding-bottom: ${e=>e.theme.spacing.xxl};
`,je=a.div`
  position: sticky;
  top: 0;
  z-index: 10;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: ${e=>e.theme.spacing.sm};
  padding: ${e=>e.theme.spacing.sm} ${e=>e.theme.spacing.xs}
    ${e=>e.theme.spacing.xs};
  h2 {
    margin: 0;
    font-size: 20px;
    color: #0f172a;
  }
  p {
    margin: 0;
    color: #6b7280;
  }
  &:after {
    content: "";
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    bottom: -6px;
    height: 6px;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.85),
      rgba(255, 255, 255, 0)
    );
    pointer-events: none;
  }
`,$e=a.div`
  display: flex;
  align-items: center;
  gap: ${e=>e.theme.spacing.sm};
  flex-wrap: wrap;
`,ve=a.div`
  display: inline-flex;
  gap: ${e=>e.theme.spacing.sm};
  flex-wrap: wrap;
  justify-content: flex-end;
`,ye=a.form`
  display: grid;
  gap: ${e=>e.theme.spacing.lg};
`,E=a.div`
  display: grid;
  gap: ${e=>e.theme.spacing.md};
  grid-template-columns: minmax(0, 1fr);
  @media (min-width: 720px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`,g=a.label`
  display: grid;
  gap: ${e=>e.theme.spacing.xs};
  align-items: start;
`,u=a.div`
  color: #475569;
  font-size: ${e=>e.theme.font.size.md};
  font-weight: 800;
  display: inline-flex;
  gap: ${e=>e.theme.spacing.xs};
  align-items: center;
  text-align: left;
  span {
    color: #ef4444;
  }
`,f=a.input`
  height: 42px;
  border: 1px solid ${e=>e.theme.colors.border};
  border-radius: ${e=>e.theme.radii.md};
  padding: 0 ${e=>e.theme.spacing.md};
  font-size: ${e=>e.theme.font.size.md};
  color: ${e=>e.theme.colors.text};
  width: 100%;
  &::placeholder {
    color: #9ca3af;
  }
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
  }
  &:disabled {
    background: #f9fafb;
    color: #6b7280;
  }
`,P=a.select`
  height: 42px;
  border: 1px solid ${e=>e.theme.colors.border};
  border-radius: ${e=>e.theme.radii.md};
  padding: 0 ${e=>e.theme.spacing.md};
  font-size: ${e=>e.theme.font.size.md};
  background: #fff;
  color: ${e=>e.theme.colors.text};
  width: 100%;
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
  }
  &:disabled {
    background: #f9fafb;
    color: #6b7280;
  }
`,Se=a.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${e=>e.theme.spacing.sm};
`,De=a.div`
  background: #fee2e2;
  color: #b91c1c;
  border: 1px solid #fecaca;
  padding: ${e=>e.theme.spacing.sm} ${e=>e.theme.spacing.md};
  border-radius: ${e=>e.theme.radii.md};
  font-size: ${e=>e.theme.font.size.sm};
`,we=a.div`
  background: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
  padding: ${e=>e.theme.spacing.sm} ${e=>e.theme.spacing.md};
  border-radius: ${e=>e.theme.radii.md};
  font-size: ${e=>e.theme.font.size.sm};
`,y=a.div`
  color: ${e=>e.theme.colors.textMuted};
  font-size: ${e=>e.theme.font.size.sm};
  line-height: 1.4;
`,R=a.p`
  margin: ${e=>e.theme.spacing.xs} 0 ${e=>e.theme.spacing.lg};
  color: ${e=>e.theme.colors.textMuted};
  font-size: ${e=>e.theme.font.size.md};
  line-height: 1.5;
`,Ee=a.div`
  display: grid;
  gap: ${e=>e.theme.spacing.xl};
  align-items: start;
  grid-template-columns: minmax(0, 1fr);
  @media (min-width: 1080px) {
    grid-template-columns: minmax(0, 1.6fr) minmax(0, 0.9fr);
  }
`,Ne=a.div`
  display: grid;
  gap: ${e=>e.theme.spacing.lg};
`,ze=a.aside`
  display: grid;
  gap: ${e=>e.theme.spacing.lg};
`,Le=a(b)`
  display: grid;
  gap: ${e=>e.theme.spacing.md};
  position: sticky;
  top: 96px;
`,ke=a.h4`
  margin: 0;
  font-size: ${e=>e.theme.font.size.lg};
  color: #111827;
  font-weight: 800;
`,Ae=a.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: ${e=>e.theme.spacing.sm};
  li {
    display: flex;
    justify-content: space-between;
    gap: ${e=>e.theme.spacing.md};
    font-size: ${e=>e.theme.font.size.md};
    color: #475569;
    strong {
      font-weight: 700;
      color: #111827;
    }
  }
`,Ce=a.span`
  display: inline-flex;
  align-items: center;
  gap: ${e=>e.theme.spacing.xs};
  padding: ${e=>e.theme.spacing.xs} ${e=>e.theme.spacing.sm};
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  background: ${({$variant:e})=>e==="ON_LEAVE"?"rgba(251, 191, 36, 0.18)":e==="PENDING"?"rgba(96, 165, 250, 0.16)":"rgba(34, 197, 94, 0.18)"};
  color: ${({$variant:e})=>e==="ON_LEAVE"?"#92400e":e==="PENDING"?"#1d4ed8":"#166534"};
`,Te=a.div`
  font-size: ${e=>e.theme.font.size.sm};
  color: ${e=>e.theme.colors.textMuted};
`,Oe=a(b)`
  display: grid;
  gap: ${e=>e.theme.spacing.sm};
  h4 {
    margin: 0;
    font-size: ${e=>e.theme.font.size.md};
    color: #111827;
  }
  ul {
    margin: 0;
    padding-left: ${e=>e.theme.spacing.lg};
    display: grid;
    gap: ${e=>e.theme.spacing.xs};
    font-size: ${e=>e.theme.font.size.md};
    color: #4b5563;
  }
`,Pe=a.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${e=>e.theme.spacing.xs};
`,Be=a.button`
  display: inline-flex;
  align-items: center;
  gap: ${e=>e.theme.spacing.xs};
  padding: ${e=>e.theme.spacing.sm} ${e=>e.theme.spacing.md};
  border-radius: ${e=>e.theme.radii.md};
  border: 1px solid ${e=>e.theme.colors.border};
  background: #fff;
  color: #1f2937;
  font-size: ${e=>e.theme.font.size.md};
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.18s ease, background 0.18s ease,
    transform 0.12s ease;
  span {
    font-size: 16px;
  }
  &[data-active="true"] {
    border-color: ${e=>e.theme.colors.primary};
    background: rgba(99, 102, 241, 0.12);
    color: #312e81;
    transform: translateY(-1px);
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`,Ie=a.section`
  background: #fff1f2;
  border: 1px solid #ffe4e6;
  border-radius: ${e=>e.theme.radii.lg};
  padding: ${e=>e.theme.spacing.md};
  display: grid;
  gap: ${e=>e.theme.spacing.sm};
`,Me=a.div`
  color: #be123c;
  font-weight: 900;
`,_e=a.div`
  color: #9f1239;
  font-size: 12px;
`,Fe=a.button`
  height: 36px;
  padding: 0 ${e=>e.theme.spacing.md};
  border-radius: ${e=>e.theme.radii.md};
  border: 1px solid #e11d48;
  background: #e11d48;
  color: #fff;
  font-weight: 800;
  font-size: ${e=>e.theme.font.size.sm};
  justify-self: start;
  opacity: 0.6;
  cursor: not-allowed;
`,Ye=re`
  0% { background-position: -200px 0; }
  100% { background-position: 200px 0; }
`,m=a.div`
  background: linear-gradient(90deg, #eef2f7 25%, #f6f8fb 37%, #eef2f7 63%);
  background-size: 400px 100%;
  animation: ${Ye} 1.2s ease-in-out infinite;
  border-radius: 8px;
  width: ${({w:e})=>e?`${e}px`:"100%"};
  height: ${({h:e})=>e?`${e}px`:"12px"};
`,Ge=a.div`
  display: grid;
  gap: ${e=>e.theme.spacing.md};
`;function He(){return t.jsxs(Ge,{children:[t.jsxs(b,{children:[t.jsx(w,{children:"기본 정보"}),t.jsxs(E,{children:[t.jsx(m,{h:38}),t.jsx(m,{h:38}),t.jsx(m,{h:38}),t.jsx(m,{h:38}),t.jsx(m,{h:38}),t.jsx(m,{h:38})]})]}),t.jsxs(b,{children:[t.jsx(w,{children:"부모님/주소"}),t.jsxs(E,{children:[t.jsx(m,{h:38}),t.jsx(m,{h:38}),t.jsx(m,{h:38})]})]})]})}export{Ke as default};
