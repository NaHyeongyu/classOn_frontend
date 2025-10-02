import{u as ae,e as ie,r as i,j as e,P as oe,S as m,s as w,d as r,t as de}from"./index-CeMlVP5a.js";import{B as le}from"./BackButton-DHWIQ_85.js";import{g as ce,u as pe,c as ue}from"./students-DqSrMihH.js";const xe={ENROLLED:"수강중",ON_LEAVE:"휴학",PENDING:"대기중"},ge={ENROLLED:"현재 수업을 듣고 있는 원생입니다.",ON_LEAVE:"일시 휴학 상태로 관리됩니다.",PENDING:"상담/등록 대기 중인 원생입니다."},he="ENROLLED",fe="현재 수업 상태를 선택하세요.",me="미지정",be=[{value:"ENROLLED",label:"수강중"},{value:"ON_LEAVE",label:"휴학"},{value:"PENDING",label:"대기중"}];function He(){const o=ae(),{id:b}=ie(),S=i.useMemo(()=>!!b,[b]),j=i.useMemo(()=>b?Number(b):null,[b]),[J,Y]=i.useState(!1),[l,_]=i.useState(!1),[B,D]=i.useState(null),[I,k]=i.useState(null),[v,R]=i.useState({}),[A,G]=i.useState({}),H=i.useRef(null);function Q(){const t=new Date,n=String(t.getMonth()+1).padStart(2,"0"),s=String(t.getDate()).padStart(2,"0");return`${t.getFullYear()}-${n}-${s}`}const[a,p]=i.useState({name:"",status:"ENROLLED",joinedDate:Q()}),[C,z]=i.useState(""),[$,O]=i.useState(""),[U,F]=i.useState(""),W=new Date().getFullYear(),X=Array.from({length:40},(t,n)=>String(W-n)),Z=Array.from({length:12},(t,n)=>String(n+1).padStart(2,"0"));function ee(t,n){const s=Number(t),d=Number(n);return!s||!d?31:new Date(s,d,0).getDate()}const te=Array.from({length:ee(C,$)},(t,n)=>String(n+1).padStart(2,"0"));function V(t){const[n,s,d]=t.split("-").map(c=>Number(c));return!n||!s||!d?null:{y:n,m:s,d}}function ne(t){if(!t)return;const n=V(t);if(!n)return;const s=new Date;let d=s.getFullYear()-n.y;const c=s.getMonth()+1,h=s.getDate();return(c<n.m||c===n.m&&h<n.d)&&(d-=1),d}function se(t){if(!t)return;const n=V(t);return n?new Date().getFullYear()-n.y+1:void 0}const E=i.useMemo(()=>ne(a.birthDate),[a.birthDate]),K=i.useMemo(()=>se(a.birthDate),[a.birthDate]),N=a.status??he;i.useEffect(()=>{if(!S||!j)return;let t=!1;async function n(){Y(!0),D(null);try{const s=await ce(j);if(!t)if(p({name:s.name,status:s.status,age:s.age,phoneNumber:s.phoneNumber,guardianPhone:s.guardianPhone,joinedDate:s.joinedDate??s.createdAt?.slice(0,10),birthDate:s.birthDate,address:s.address,parentName:s.parentName}),s.birthDate){const[d,c,h]=s.birthDate.split("-");z(d||""),O(c||""),F(h||"")}else z(""),O(""),F("")}catch(s){t||D(s?.message||"원생 정보를 불러오지 못했습니다.")}finally{t||Y(!1)}}return n(),()=>{t=!0}},[S,j]);function P(t,n,s){const d=t??C,c=n??$,h=s??U;z(d),O(c),F(h),p(d&&c&&h?T=>({...T,birthDate:`${d}-${c}-${h}`}):T=>({...T,birthDate:void 0}))}async function re(t){if(t.preventDefault(),D(null),k(null),!a.name||!a.name.trim()){R(n=>({...n,name:"이름은 필수입니다."})),G(n=>({...n,name:!0}));try{H.current?.focus()}catch{}return}_(!0);try{const n={...a,name:a.name.trim(),status:a.status||"ENROLLED"};E!=null&&(n.age=E);let s;S&&j?(s=await pe(j,n),k("수정이 완료되었습니다."),o(`/students/${s.id}`,{replace:!0})):(s=await ue(n),k("원생이 추가되었습니다."),o(`/students/${s.id}`,{replace:!0}))}catch(n){D(n?.message||"저장에 실패했습니다.")}finally{_(!1)}}return e.jsxs(je,{children:[e.jsxs(ve,{children:[e.jsxs(ye,{children:[e.jsx(le,{to:"/students",label:"뒤로"}),e.jsxs("div",{children:[e.jsx("h2",{children:S?"원생 정보 수정":"원생 추가하기"}),e.jsx("p",{children:"기본 정보를 입력하고 저장하세요."})]})]}),e.jsx(Se,{children:e.jsx(oe,{as:"button",type:"button",onClick:()=>{const t=document.getElementById("student-form");if(t)try{t.requestSubmit?t.requestSubmit():t.submit()}catch{t.submit()}},disabled:l,children:l?"저장 중...":"저장"})})]}),B&&e.jsx(Ne,{children:B}),I&&e.jsx(we,{children:I}),J?e.jsx(Be,{}):e.jsx(De,{id:"student-form",onSubmit:re,children:e.jsxs(ke,{children:[e.jsxs(Ae,{children:[e.jsxs(m,{children:[e.jsx(w,{children:"기본 정보"}),e.jsx(q,{children:"수업 및 청구에 사용되는 핵심 정보입니다."}),e.jsxs(L,{children:[e.jsxs(x,{children:[e.jsxs(g,{children:["이름",e.jsx("span",{children:"*"})]}),e.jsx(f,{ref:H,value:a.name,onChange:t=>{p(n=>({...n,name:t.target.value})),v.name&&R(n=>({...n,name:void 0}))},onBlur:()=>G(t=>({...t,name:!0})),placeholder:"홍길동",required:!0,disabled:l,"aria-invalid":A.name&&!!v.name,"aria-describedby":A.name&&v.name?"err-name":void 0}),A.name&&v.name?e.jsx(Le,{id:"err-name",children:v.name}):null,e.jsx(y,{children:"출석부/청구서에 표시될 이름입니다."})]}),e.jsxs(x,{style:{gridColumn:"1 / -1"},children:[e.jsx(g,{children:"상태"}),e.jsx(Me,{children:be.map(t=>e.jsx(Ye,{type:"button","data-active":N===t.value,onClick:()=>p(n=>({...n,status:t.value})),disabled:l,children:t.label},t.value))}),e.jsx(y,{children:ge[N]??fe})]}),e.jsxs(x,{children:[e.jsx(g,{children:"생년월일"}),e.jsxs(Ee,{children:[e.jsxs(M,{value:C,onChange:t=>P(t.target.value||"",void 0,void 0),disabled:l,children:[e.jsx("option",{value:"",children:"연도"}),X.map(t=>e.jsx("option",{value:t,children:t},t))]}),e.jsxs(M,{value:$,onChange:t=>P(void 0,t.target.value||"",void 0),disabled:l,children:[e.jsx("option",{value:"",children:"월"}),Z.map(t=>e.jsx("option",{value:t,children:t},t))]}),e.jsxs(M,{value:U,onChange:t=>P(void 0,void 0,t.target.value||""),disabled:l,children:[e.jsx("option",{value:"",children:"일"}),te.map(t=>e.jsx("option",{value:t,children:t},t))]})]}),e.jsx(y,{children:"생년월일 입력 시 나이는 자동 계산됩니다."})]}),e.jsxs(x,{children:[e.jsx(g,{children:"연락처"}),e.jsx(f,{value:a.phoneNumber??"",onChange:t=>p(n=>({...n,phoneNumber:t.target.value||void 0})),placeholder:"010-1234-5678",disabled:l}),e.jsx(y,{children:"가능한 경우 학부모 연락처와 구분해서 입력하세요."})]}),e.jsxs(x,{children:[e.jsx(g,{children:"등록일"}),e.jsx(f,{type:"text",lang:"ko-KR",inputMode:"numeric",placeholder:"YYYY-MM-DD",value:a.joinedDate??"",readOnly:!0,disabled:!0})]})]})]}),e.jsxs(m,{children:[e.jsx(w,{children:"부모님/주소"}),e.jsx(q,{children:"연락 경로와 청구 주소를 정돈해 두면 업무가 편해져요."}),e.jsxs(L,{children:[e.jsxs(x,{children:[e.jsx(g,{children:"보호자 이름"}),e.jsx(f,{value:a.parentName??"",onChange:t=>p(n=>({...n,parentName:t.target.value||void 0})),placeholder:"김철수",disabled:l})]}),e.jsxs(x,{children:[e.jsx(g,{children:"보호자 연락처"}),e.jsx(f,{value:a.guardianPhone??"",onChange:t=>p(n=>({...n,guardianPhone:t.target.value||void 0})),placeholder:"010-0000-0000",disabled:l}),e.jsx(y,{children:"비상 연락을 위해 보호자 연락처를 입력해 주세요."})]}),e.jsxs(x,{style:{gridColumn:"1 / -1"},children:[e.jsx(g,{children:"주소"}),e.jsx(f,{value:a.address??"",onChange:t=>p(n=>({...n,address:t.target.value||void 0})),placeholder:"서울시 강남구 ...",disabled:l})]})]})]})]}),e.jsxs(Ce,{"aria-label":"form tips",children:[e.jsxs(ze,{children:[e.jsx($e,{children:"입력 미리 보기"}),e.jsxs(Oe,{children:[e.jsxs("li",{children:[e.jsx("span",{children:"이름"}),e.jsx("strong",{children:a.name?.trim()||"미입력"})]}),e.jsxs("li",{children:[e.jsx("span",{children:"상태"}),e.jsx(Fe,{$variant:N,children:xe[N]??me})]}),e.jsxs("li",{children:[e.jsx("span",{children:"나이"}),e.jsxs("strong",{children:[K!=null?`${K}세`:"-",E!=null?` / 만 ${E}`:""]})]}),e.jsxs("li",{children:[e.jsx("span",{children:"등록일"}),e.jsx("strong",{children:a.joinedDate??"-"})]})]}),e.jsx(Pe,{children:"저장 전 요약을 빠르게 확인할 수 있어요."})]}),e.jsxs(Te,{children:[e.jsx("h4",{children:"입력 팁"}),e.jsx("ul",{children:e.jsx("li",{children:"수강 상태는 언제든지 변경 가능하니 현재 상황을 기준으로 선택하세요."})})]})]})]})})]})}const je=r.div`
  display: grid;
  gap: 14px;
  padding-bottom: 32px;
`,ve=r.div`
  position: sticky;
  top: 0;
  z-index: 10;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 2px 6px;
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
`,ye=r.div`
  display: flex;
  align-items: center;
  gap: 10px;
`,Se=r.div`
  display: inline-flex;
  gap: 8px;
`,De=r.form`
  display: grid;
  gap: 16px;
`,L=r.div`
  display: grid;
  gap: 12px;
  grid-template-columns: minmax(0, 1fr);
  @media (min-width: 720px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`,x=r.label`
  display: grid;
  gap: 6px;
  align-items: start;
`,g=r.div`
  color: #475569;
  font-size: 13px;
  font-weight: 800;
  display: inline-flex;
  gap: 4px;
  align-items: center;
  text-align: left;
  span {
    color: #ef4444;
  }
`,f=r.input`
  height: 42px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 12px;
  font-size: 14px;
  color: #111827;
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
  &[aria-invalid='true'] {
    border-color: #ef4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.12);
  }
`,M=r.select`
  height: 42px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 12px;
  font-size: 14px;
  background: #fff;
  color: #111827;
  width: 100%;
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
  }
  &:disabled {
    background: #f9fafb;
    color: #6b7280;
  }
`,Ee=r.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
`,Ne=r.div`
  background: #fee2e2;
  color: #b91c1c;
  border: 1px solid #fecaca;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 13px;
`,we=r.div`
  background: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 13px;
`,y=r.div`
  color: #6b7280;
  font-size: 12px;
`,Le=r.div`
  color: #b91c1c;
  font-size: 12px;
`,q=r.p`
  margin: 4px 0 14px;
  color: #6b7280;
  font-size: 13px;
`,ke=r.div`
  display: grid;
  gap: 18px;
  align-items: start;
  grid-template-columns: minmax(0, 1fr);
  @media (min-width: 1080px) {
    grid-template-columns: minmax(0, 1.6fr) minmax(0, 0.9fr);
  }
`,Ae=r.div`
  display: grid;
  gap: 16px;
`,Ce=r.aside`
  display: grid;
  gap: 16px;
`,ze=r(m)`
  display: grid;
  gap: 14px;
  position: sticky;
  top: 84px;
`,$e=r.h4`
  margin: 0;
  font-size: 15px;
  color: #111827;
  font-weight: 800;
`,Oe=r.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 10px;
  li {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    font-size: 13px;
    color: #475569;
    strong {
      font-weight: 700;
      color: #111827;
    }
  }
`,Fe=r.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  background: ${({$variant:o})=>o==="ON_LEAVE"?"rgba(251, 191, 36, 0.18)":o==="PENDING"?"rgba(96, 165, 250, 0.16)":"rgba(34, 197, 94, 0.18)"};
  color: ${({$variant:o})=>o==="ON_LEAVE"?"#92400e":o==="PENDING"?"#1d4ed8":"#166534"};
`,Pe=r.div`
  font-size: 12px;
  color: #6b7280;
`,Te=r(m)`
  display: grid;
  gap: 10px;
  h4 {
    margin: 0;
    font-size: 14px;
    color: #111827;
  }
  ul {
    margin: 0;
    padding-left: 18px;
    display: grid;
    gap: 6px;
    font-size: 13px;
    color: #4b5563;
  }
`,Me=r.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`,Ye=r.button`
  display: inline-flex;
  align-items: center;
  gap: 0;
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: #fff;
  color: #1f2937;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.18s ease, background 0.18s ease,
    transform 0.12s ease;
  &[data-active="true"] {
    border-color: #6366f1;
    background: rgba(99, 102, 241, 0.08);
    color: #312e81;
    transform: translateY(-1px);
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;r.section`
  background: #fff1f2;
  border: 1px solid #ffe4e6;
  border-radius: 14px;
  padding: 14px;
  display: grid;
  gap: 8px;
`;r.div`
  color: #be123c;
  font-weight: 900;
`;r.div`
  color: #9f1239;
  font-size: 12px;
`;r.button`
  height: 40px;
  padding: 0 16px;
  border-radius: 10px;
  border: 1px solid #e11d48;
  background: #e11d48;
  color: #fff;
  font-weight: 800;
  font-size: 14px;
  justify-self: start;
  opacity: 0.6;
  cursor: not-allowed;
`;const _e=de`
  0% { background-position: -200px 0; }
  100% { background-position: 200px 0; }
`,u=r.div`
  background: linear-gradient(90deg, #eef2f7 25%, #f6f8fb 37%, #eef2f7 63%);
  background-size: 400px 100%;
  animation: ${_e} 1.2s ease-in-out infinite;
  border-radius: 8px;
  width: ${({w:o})=>o?`${o}px`:"100%"};
  height: ${({h:o})=>o?`${o}px`:"12px"};
`;function Be(){return e.jsxs("div",{style:{display:"grid",gap:12},children:[e.jsxs(m,{children:[e.jsx(w,{children:"기본 정보"}),e.jsxs(L,{children:[e.jsx(u,{h:38}),e.jsx(u,{h:38}),e.jsx(u,{h:38}),e.jsx(u,{h:38}),e.jsx(u,{h:38}),e.jsx(u,{h:38})]})]}),e.jsxs(m,{children:[e.jsx(w,{children:"부모님/주소"}),e.jsxs(L,{children:[e.jsx(u,{h:38}),e.jsx(u,{h:38}),e.jsx(u,{h:38})]})]})]})}export{He as default};
