import{r as i,B as ie,d as s,j as e,C as oe,e as le,u as de}from"./index-B0K7mn4q.js";import{g as ce,u as ue,e as pe}from"./students-BeT2wLPO.js";import{r as I}from"./errors-C6OcbAl5.js";import{B as xe}from"./BackButton-BW37zkWn.js";import{S as _,i as he,f as ge}from"./UI-Cj3YhchZ.js";const B="ENROLLED",G="미지정",K="현재 수업 상태를 선택하세요.",me={ENROLLED:"수강중",ON_LEAVE:"휴학",PENDING:"대기중",WITHDRAWN:"퇴원"},fe={ENROLLED:"현재 수업을 듣고 있는 원생입니다.",ON_LEAVE:"일시 휴학 상태로 관리됩니다.",PENDING:"상담/등록 대기 중인 원생입니다.",WITHDRAWN:"퇴원(수강 종료) 상태입니다."},be=[{value:"ENROLLED",label:"수강중"},{value:"ON_LEAVE",label:"휴학"},{value:"PENDING",label:"대기중"},{value:"WITHDRAWN",label:"퇴원"}];function je({studentId:r,focusNameInput:f}){const d=i.useMemo(()=>Number.isFinite(r),[r]),p=ie(),c=i.useCallback(()=>{const a=new Date,t=String(a.getMonth()+1).padStart(2,"0"),o=String(a.getDate()).padStart(2,"0");return`${a.getFullYear()}-${t}-${o}`},[]),[l,v]=i.useState({name:"",status:B,joinedDate:c()}),[b,u]=i.useState(""),[j,k]=i.useState(""),[g,m]=i.useState(""),[n,x]=i.useState(!1),[C,P]=i.useState(!1),[W,A]=i.useState(null),[Q,R]=i.useState({}),[V,H]=i.useState({});i.useEffect(()=>{if(!d||!r)return;let a=!1;return(async()=>{x(!0),A(null);try{const t=await ce(r);if(a)return;if(v({name:t.name,status:t.status,age:t.age,phoneNumber:t.phoneNumber,guardianPhone:t.guardianPhone,joinedDate:t.joinedDate??t.createdAt?.slice(0,10),birthDate:t.birthDate,address:t.address,parentName:t.parentName}),t.birthDate){const[o,h,y]=String(t.birthDate).split("-");u(o||""),k(h||""),m(y||"")}else u(""),k(""),m("")}catch(t){a||A(I(t,"원생 정보를 불러오지 못했습니다."))}finally{a||x(!1)}})(),()=>{a=!0}},[d,r]);const J=i.useMemo(()=>{const a=new Date().getFullYear();return Array.from({length:40},(t,o)=>String(a-o))},[]),X=i.useMemo(()=>Array.from({length:12},(a,t)=>String(t+1).padStart(2,"0")),[]),q=i.useCallback((a,t)=>{const o=Number(a),h=Number(t);return!o||!h?31:new Date(o,h,0).getDate()},[]),Z=i.useMemo(()=>Array.from({length:q(b,j)},(a,t)=>String(t+1).padStart(2,"0")),[b,j,q]),ee=i.useCallback((a,t,o)=>{const h=a??b,y=t??j,w=o??g;u(h),k(y),m(w),v(ae=>({...ae,birthDate:h&&y&&w?`${h}-${y}-${w}`:void 0}))},[g,j,b]),F=i.useCallback(a=>{const[t,o,h]=a.split("-").map(y=>Number(y));return!t||!o||!h?null:{y:t,m:o,d:h}},[]),$=i.useMemo(()=>{const a=l.birthDate;if(!a)return;const t=F(a);if(!t)return;const o=new Date;let h=o.getFullYear()-t.y;const y=o.getMonth()+1,w=o.getDate();return(y<t.m||y===t.m&&w<t.d)&&(h-=1),h},[l.birthDate,F]),te=i.useMemo(()=>{const a=l.birthDate;if(!a)return;const t=F(a);return t?new Date().getFullYear()-t.y+1:void 0},[l.birthDate,F]),O=l.status??B,ne=me[O]??G,re=fe[O]??K,se=i.useCallback(async a=>{if(a?.preventDefault(),A(null),!l.name||!l.name.trim())return R(t=>({...t,name:"이름은 필수입니다."})),H(t=>({...t,name:!0})),f?.(),null;P(!0);try{const t={...l,name:l.name.trim(),status:l.status||B};$!=null&&(t.age=$);let o;return d&&r?(o=await ue(r,t),p.invalidateQueries({queryKey:["students"]}),p.invalidateQueries({queryKey:["dashboard","summary"]}),{student:o,mode:"update"}):(o=await pe(t),p.invalidateQueries({queryKey:["students"]}),p.invalidateQueries({queryKey:["dashboard","summary"]}),{student:o,mode:"create"})}catch(t){return A(I(t,"저장에 실패했습니다.")),null}finally{P(!1)}},[f,l,$,d,p,r]);return{isEdit:d,form:l,setForm:v,loading:n,saving:C,error:W,setError:A,fieldErr:Q,setFieldErr:R,touched:V,setTouched:H,statusOptions:be,currentStatus:O,currentStatusLabel:ne,currentStatusCopy:re,statusLabelFallback:G,statusCopyFallback:K,intlAge:$,koreanAge:te,dob:{y:b,m:j,d:g,years:J,months:X,days:Z,update:ee},handleSubmit:se}}const ve=s.div`
  display: grid;
  gap: 14px;
  padding-bottom: 32px;
`,ye=s.div`
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
`,Se=s.div`
  display: flex;
  align-items: center;
  gap: 10px;
`,De=s.div`
  display: inline-flex;
  gap: 8px;
`,Ee=s.form`
  display: grid;
  gap: 16px;
`,T=_,M=he,U=s.p`
  margin: 4px 0 14px;
  color: #6b7280;
  font-size: 13px;
`,z=s.div`
  display: grid;
  gap: 12px;
  grid-template-columns: minmax(0, 1fr);
  @media (min-width: 720px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`,D=s.label`
  display: grid;
  gap: 6px;
  align-items: start;
`,E=s.div`
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
`,N=s.input`
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
  &[aria-invalid="true"] {
    border-color: #ef4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.12);
  }
`,Y=s.select`
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
`,Ne=s.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
`,ke=s.div`
  background: #fee2e2;
  color: #b91c1c;
  border: 1px solid #fecaca;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 13px;
`,Ce=s.div`
  background: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 13px;
`,L=s.div`
  color: #6b7280;
  font-size: 12px;
`,Ae=s.div`
  color: #b91c1c;
  font-size: 12px;
`,we=s.div`
  display: grid;
  gap: 18px;
  align-items: start;
  grid-template-columns: minmax(0, 1fr);
  @media (min-width: 1080px) {
    grid-template-columns: minmax(0, 1.6fr) minmax(0, 0.9fr);
  }
`,Le=s.div`
  display: grid;
  gap: 16px;
`,Fe=s.aside`
  display: grid;
  gap: 16px;
`,$e=s(_)`
  display: grid;
  gap: 14px;
  position: sticky;
  top: 84px;
`,Te=s.h4`
  margin: 0;
  font-size: 15px;
  color: #111827;
  font-weight: 800;
`,Me=s.ul`
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
`,ze=s.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  background: ${({$variant:r})=>r==="ON_LEAVE"?"rgba(251, 191, 36, 0.18)":r==="PENDING"?"rgba(96, 165, 250, 0.16)":"rgba(34, 197, 94, 0.18)"};
  color: ${({$variant:r})=>r==="ON_LEAVE"?"#92400e":r==="PENDING"?"#1d4ed8":"#166534"};
`,Oe=s.div`
  font-size: 12px;
  color: #6b7280;
`,Be=s(_)`
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
`,Ye=s.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`,_e=s.button`
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
`;function Pe({isEdit:r,saving:f,onSaveClick:d}){return e.jsxs(ye,{children:[e.jsxs(Se,{children:[e.jsx(xe,{to:"/students",label:"뒤로"}),e.jsxs("div",{children:[e.jsx("h2",{children:r?"원생 정보 수정":"원생 추가하기"}),e.jsx("p",{children:"기본 정보를 입력하고 저장하세요."})]})]}),e.jsx(De,{children:e.jsx(ge,{type:"button",onClick:d,disabled:f,children:f?"저장 중...":"저장"})})]})}function Re({flow:r,nameInputRef:f}){const{form:d,setForm:p,fieldErr:c,setFieldErr:l,touched:v,setTouched:b,statusOptions:u,currentStatus:j,currentStatusCopy:k,saving:g,dob:m}=r;return e.jsxs(e.Fragment,{children:[e.jsxs(T,{children:[e.jsx(M,{children:"기본 정보"}),e.jsx(U,{children:"수업 및 청구에 사용되는 핵심 정보입니다."}),e.jsxs(z,{children:[e.jsxs(D,{children:[e.jsxs(E,{children:["이름",e.jsx("span",{children:"*"})]}),e.jsx(N,{ref:f,value:d.name,onChange:n=>{const x=n.target.value;p(C=>({...C,name:x})),c.name&&l(C=>({...C,name:void 0}))},onBlur:()=>b(n=>({...n,name:!0})),placeholder:"홍길동",required:!0,disabled:g,"aria-invalid":!!(v.name&&c.name),"aria-describedby":v.name&&c.name?"err-name":void 0}),v.name&&c.name?e.jsx(Ae,{id:"err-name",children:c.name}):null,e.jsx(L,{children:"출석부/청구서에 표시될 이름입니다."})]}),e.jsxs(D,{style:{gridColumn:"1 / -1"},children:[e.jsx(E,{children:"상태"}),e.jsx(Ye,{children:u.map(n=>e.jsx(_e,{type:"button","data-active":j===n.value,onClick:()=>p(x=>({...x,status:n.value})),disabled:g,children:n.label},n.value))}),e.jsx(L,{children:k})]}),e.jsxs(D,{children:[e.jsx(E,{children:"생년월일"}),e.jsxs(Ne,{children:[e.jsxs(Y,{value:m.y,onChange:n=>m.update(n.target.value||"",void 0,void 0),disabled:g,children:[e.jsx("option",{value:"",children:"연도"}),m.years.map(n=>e.jsx("option",{value:n,children:n},n))]}),e.jsxs(Y,{value:m.m,onChange:n=>m.update(void 0,n.target.value||"",void 0),disabled:g,children:[e.jsx("option",{value:"",children:"월"}),m.months.map(n=>e.jsx("option",{value:n,children:n},n))]}),e.jsxs(Y,{value:m.d,onChange:n=>m.update(void 0,void 0,n.target.value||""),disabled:g,children:[e.jsx("option",{value:"",children:"일"}),m.days.map(n=>e.jsx("option",{value:n,children:n},n))]})]}),e.jsx(L,{children:"생년월일 입력 시 나이는 자동 계산됩니다."})]}),e.jsxs(D,{children:[e.jsx(E,{children:"연락처"}),e.jsx(N,{value:d.phoneNumber??"",onChange:n=>p(x=>({...x,phoneNumber:n.target.value||void 0})),placeholder:"010-1234-5678",disabled:g}),e.jsx(L,{children:"가능한 경우 학부모 연락처와 구분해서 입력하세요."})]}),e.jsxs(D,{children:[e.jsx(E,{children:"등록일"}),e.jsx(N,{type:"text",lang:"ko-KR",inputMode:"numeric",placeholder:"YYYY-MM-DD",value:d.joinedDate??"",readOnly:!0,disabled:!0})]})]})]}),e.jsxs(T,{children:[e.jsx(M,{children:"부모님/주소"}),e.jsx(U,{children:"연락 경로와 청구 주소를 정돈해 두면 업무가 편해져요."}),e.jsxs(z,{children:[e.jsxs(D,{children:[e.jsx(E,{children:"보호자 이름"}),e.jsx(N,{value:d.parentName??"",onChange:n=>p(x=>({...x,parentName:n.target.value||void 0})),placeholder:"김철수",disabled:g})]}),e.jsxs(D,{children:[e.jsx(E,{children:"보호자 연락처"}),e.jsx(N,{value:d.guardianPhone??"",onChange:n=>p(x=>({...x,guardianPhone:n.target.value||void 0})),placeholder:"010-0000-0000",disabled:g}),e.jsx(L,{children:"비상 연락을 위해 보호자 연락처를 입력해 주세요."})]}),e.jsxs(D,{style:{gridColumn:"1 / -1"},children:[e.jsx(E,{children:"주소"}),e.jsx(N,{value:d.address??"",onChange:n=>p(x=>({...x,address:n.target.value||void 0})),placeholder:"서울시 강남구 ...",disabled:g})]})]})]})]})}function He({flow:r}){const{form:f,currentStatus:d,currentStatusLabel:p,koreanAge:c,intlAge:l}=r;return e.jsxs(Fe,{"aria-label":"form tips",children:[e.jsxs($e,{children:[e.jsx(Te,{children:"입력 미리 보기"}),e.jsxs(Me,{children:[e.jsxs("li",{children:[e.jsx("span",{children:"이름"}),e.jsx("strong",{children:f.name?.trim()||"미입력"})]}),e.jsxs("li",{children:[e.jsx("span",{children:"상태"}),e.jsx(ze,{$variant:d,children:p})]}),e.jsxs("li",{children:[e.jsx("span",{children:"나이"}),e.jsxs("strong",{children:[c!=null?`${c}세`:"-",l!=null?` / 만 ${l}`:""]})]}),e.jsxs("li",{children:[e.jsx("span",{children:"등록일"}),e.jsx("strong",{children:f.joinedDate??"-"})]})]}),e.jsx(Oe,{children:"저장 전 요약을 빠르게 확인할 수 있어요."})]}),e.jsxs(Be,{children:[e.jsx("h4",{children:"입력 팁"}),e.jsx("ul",{children:e.jsx("li",{children:"수강 상태는 언제든지 변경 가능하니 현재 상황을 기준으로 선택하세요."})})]})]})}const qe=oe`
  0% { background-position: -200px 0; }
  100% { background-position: 200px 0; }
`,S=s.div`
  background: linear-gradient(90deg, #eef2f7 25%, #f6f8fb 37%, #eef2f7 63%);
  background-size: 400px 100%;
  animation: ${qe} 1.2s ease-in-out infinite;
  border-radius: 8px;
  width: ${({$width:r})=>r?`${r}px`:"100%"};
  height: ${({$height:r})=>r?`${r}px`:"12px"};
`;function Ie(){return e.jsxs("div",{style:{display:"grid",gap:12},children:[e.jsxs(T,{children:[e.jsx(M,{children:"기본 정보"}),e.jsxs(z,{children:[e.jsx(S,{$height:38}),e.jsx(S,{$height:38}),e.jsx(S,{$height:38}),e.jsx(S,{$height:38}),e.jsx(S,{$height:38}),e.jsx(S,{$height:38})]})]}),e.jsxs(T,{children:[e.jsx(M,{children:"부모님/주소"}),e.jsxs(z,{children:[e.jsx(S,{$height:38}),e.jsx(S,{$height:38}),e.jsx(S,{$height:38})]})]})]})}function Ve(){const{id:r}=le(),f=de(),d=i.useRef(null),p=i.useMemo(()=>{if(!r)return null;const u=Number(r);return Number.isFinite(u)?u:null},[r]),c=je({studentId:p,focusNameInput:()=>d.current?.focus()}),[l,v]=i.useState(null);async function b(u){u?.preventDefault(),v(null);const j=await c.handleSubmit(u);j&&(v(j.mode==="create"?"원생이 추가되었습니다.":"수정이 완료되었습니다."),f(`/students/${j.student.id}`,{replace:!0}))}return e.jsxs(ve,{children:[e.jsx(Pe,{isEdit:c.isEdit,saving:c.saving,onSaveClick:()=>{const u=document.getElementById("student-form");if(!u){b();return}try{if(typeof u.requestSubmit=="function"){u.requestSubmit();return}}catch{}b()}}),c.error?e.jsx(ke,{children:c.error}):null,l?e.jsx(Ce,{children:l}):null,c.loading?e.jsx(Ie,{}):e.jsx(Ee,{id:"student-form",onSubmit:u=>{b(u)},children:e.jsxs(we,{children:[e.jsx(Le,{children:e.jsx(Re,{flow:c,nameInputRef:d})}),e.jsx(He,{flow:c})]})})]})}export{Ve as default};
