import{j as e,l as V,S as G,d as a,r as i,u as H,m as W,n as Q,T as Y,o as J,E as X,g as Z,a as ee,P as te,G as T}from"./index-Cl4EBL6b.js";import{l as k,d as se,a as ne,i as ae}from"./students-CdH5xAZ-.js";import{f as $}from"./format-CD1P4D3U.js";import{v as ie}from"./pagination-CSW9EPYd.js";function oe({children:t}){return e.jsx(V,{children:t})}function re({children:t}){return e.jsx(G,{children:t})}a.div`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 12px;
`;function ce(){const[t,r]=i.useState(!0),[l,o]=i.useState(null),[u,f]=i.useState(0),[c,m]=i.useState(0),[d,j]=i.useState(0),[x,p]=i.useState(0);return i.useEffect(()=>{let h=!1;async function b(){r(!0),o(null);try{const[n,y,g,w]=await Promise.all([k({size:1}),k({status:"ENROLLED",size:1}),k({status:"ON_LEAVE",size:1}),k({status:"PENDING",size:1})]);h||(f(n.totalElements),m(y.totalElements),j(g.totalElements),p(w.totalElements))}catch(n){h||o(n?.message||"요약 정보를 불러오지 못했습니다.")}finally{h||r(!1)}}return b(),()=>{h=!0}},[]),e.jsxs(de,{children:[e.jsxs(E,{children:[e.jsxs(M,{children:[e.jsx(C,{children:"총 원생 수"}),e.jsx(L,{"aria-hidden":!0,children:xe})]}),e.jsx(P,{children:t?"…":`${u}명`}),l&&e.jsx(le,{children:l})]}),e.jsxs(E,{children:[e.jsxs(M,{children:[e.jsx(C,{children:"수강중"}),e.jsx(L,{"aria-hidden":!0,children:ue})]}),e.jsx(P,{children:t?"…":`${c}명`})]}),e.jsxs(E,{children:[e.jsxs(M,{children:[e.jsx(C,{children:"휴학"}),e.jsx(L,{"aria-hidden":!0,children:he})]}),e.jsx(P,{children:t?"…":`${d}명`})]}),e.jsxs(E,{children:[e.jsxs(M,{children:[e.jsx(C,{children:"대기중"}),e.jsx(L,{"aria-hidden":!0,children:pe})]}),e.jsx(P,{children:t?"…":`${x}명`})]})]})}const de=a.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
`,E=a.article`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`,M=a.div`
  display: flex; align-items: center; justify-content: space-between;
`,C=a.h4`
  margin: 0; font-size: 14px; color: #6b7280; font-weight: 600;
`,L=a.span`
  width: 34px; height: 34px; border-radius: 10px; display: grid; place-items: center; background: #eef2ff; color: #4f46e5;
`,P=a.div`
  font-size: 28px; font-weight: 800; color: #111827; letter-spacing: -0.02em;
`,le=a.div`
  color: #b91c1c; font-size: 12px;
`,xe=e.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M20 21v-2a4 4 0 0 0-3-3.87"}),e.jsx("path",{d:"M4 21v-2a4 4 0 0 1 3-3.87"}),e.jsx("circle",{cx:"7",cy:"7",r:"4"}),e.jsx("circle",{cx:"17",cy:"7",r:"4"})]}),ue=e.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M22 10L12 4 2 10l10 6 10-6z"}),e.jsx("path",{d:"M6 12v5l6 3 6-3v-5"})]}),he=e.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("rect",{x:"6",y:"4",width:"4",height:"16"}),e.jsx("rect",{x:"14",y:"4",width:"4",height:"16"})]}),pe=e.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"12",cy:"12",r:"10"}),e.jsx("path",{d:"M12 6v6l3 3"})]});function ge({value:t,onChange:r,onApply:l}){const o=t,[u,f]=i.useState(!1),[c,m]=i.useState(o.q),d=i.useRef(null),[j,x]=i.useState(!1);i.useEffect(()=>{m(o.q)},[o.q]);function p(n,y){r({...o,[n]:y})}function h(){r({status:"",from:"",to:"",ageMin:"",ageMax:"",q:""})}function b(){const n=(d.current?.value??c).trim();r({...o,q:n}),l?.()}return e.jsxs(fe,{children:[e.jsxs(q,{children:[e.jsx(N,{children:"상태"}),e.jsxs(je,{value:o.status,onChange:n=>p("status",n.target.value),children:[e.jsx("option",{value:"",children:"전체"}),e.jsx("option",{value:"ENROLLED",children:"수강중"}),e.jsx("option",{value:"ON_LEAVE",children:"휴학"}),e.jsx("option",{value:"PENDING",children:"대기중"})]})]}),e.jsxs(q,{children:[e.jsx(N,{children:"등록일"}),e.jsxs(A,{children:[e.jsx(z,{type:"date",value:o.from,onChange:n=>p("from",n.target.value)}),e.jsx(O,{children:"~"}),e.jsx(z,{type:"date",value:o.to,onChange:n=>p("to",n.target.value)})]})]}),e.jsxs(q,{children:[e.jsx(N,{children:"나이"}),e.jsxs(A,{children:[e.jsx(z,{type:"number",placeholder:"12",value:o.ageMin,onChange:n=>p("ageMin",n.target.value)}),e.jsx(O,{children:"~"}),e.jsx(z,{type:"number",placeholder:"16",value:o.ageMax,onChange:n=>p("ageMax",n.target.value)})]})]}),e.jsxs(q,{children:[e.jsx(N,{children:"검색"}),e.jsxs(me,{children:[e.jsx(be,{ref:d,placeholder:"학생명, 보호자, 연락처 등 검색",value:c,onChange:n=>m(n.target.value),onCompositionStart:()=>f(!0),onCompositionEnd:()=>{f(!1),j&&(x(!1),b())},onKeyDown:n=>{n.key==="Enter"&&(n.preventDefault(),u?x(!0):b())}}),e.jsx(ve,{type:"button",onClick:b,children:"검색"}),e.jsx(ye,{type:"button",onClick:h,children:"초기화"})]})]})]})}const fe=a.div`
  display: grid; grid-template-columns: 0.6fr 1.2fr 1fr 2.7fr; gap: 12px; align-items: end;
  @media (max-width: 1080px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  @media (max-width: 720px) { grid-template-columns: 1fr; }
`,q=a.div`
  display: grid; gap: 8px; align-items: start;
`,N=a.span`
  color: #6b7280; font-size: 12px; font-weight: 700;
`,je=a.select`
  height: 36px; border: 1px solid #e5e7eb; border-radius: 10px; padding: 0 10px; background: #fff; width: 100%;
`,z=a.input`
  height: 36px; border: 1px solid #e5e7eb; border-radius: 10px; padding: 0 10px; width: 100%;
`,A=a.div`
  display: grid; grid-template-columns: 1fr auto 1fr; gap: 6px; align-items: center;
`,O=a.span`
  color: #6b7280; font-size: 12px; text-align: center;
`,me=a.div`
  display: grid; grid-template-columns: 1fr auto auto; gap: 8px; align-items: end;
`,be=a.input`
  height: 36px; border: 1px solid #e5e7eb; border-radius: 10px; padding: 0 12px; width: 100%;
`,ve=a.button`
  height: 40px; padding: 0 16px; border-radius: 10px; border: 1px solid #111827; background: #111827; color: #fff; font-weight: 700;
`,ye=a.button`
  height: 40px; padding: 0 16px; border-radius: 10px; border: 1px solid #e5e7eb; background: #fff; color: #111827; font-weight: 700;
`;function Se(t){return t==="ENROLLED"?"수강중":t==="ON_LEAVE"?"휴학":"대기중"}function we({filters:t,refreshKey:r}){const l=H(),[o]=W(),[u,f]=i.useState([]),[c,m]=i.useState(null),[d,j]=i.useState(()=>{const s=Number(o.get("page"));return Number.isFinite(s)&&s>=0?s:0}),[x,p]=i.useState(()=>{const s=Number(o.get("size"));return s===10||s===20||s===50?s:10}),[h,b]=i.useState(0),[n,y]=i.useState(0),[g,w]=i.useState(!1),K="createdAt",U="DESC";i.useEffect(()=>{let s=!1;async function S(){m(null),w(!0);try{const v=await k({page:d,size:x,status:t.status||void 0,q:t.q||void 0,from:t.from||void 0,to:t.to||void 0,ageMin:t.ageMin?Number(t.ageMin):void 0,ageMax:t.ageMax?Number(t.ageMax):void 0,s:K,dir:U});s||(f(v.content),b(v.totalPages),y(v.totalElements))}catch(v){s||m(v?.message||"원생 불러오기에 실패했습니다.")}finally{s||w(!1)}}return S(),()=>{s=!0}},[d,x,t.status,t.q,t.from,t.to,t.ageMin,t.ageMax,r]),i.useEffect(()=>{j(0)},[t.status,t.q,t.from,t.to,t.ageMin,t.ageMax]);const I=i.useMemo(()=>u.map((s,S)=>{let v;if(s.birthDate){const R=Number(s.birthDate.split("-")[0]),_=new Date().getFullYear()-R+1;v=String(_)}else v=s.age!=null?String(s.age):"-";return{seq:Math.max(0,n-d*x-S),code:s.code,id:s.id,name:s.name,age:v,birth:s.birthDate||"-",phone:$(s.phoneNumber),course:s.courses?.map(R=>R.title).join(", ")||"-",guardian:$(s.guardianPhone),status:Se(s.status),joinedAt:s.joinedDate||s.createdAt?.slice(0,10)||"-"}}),[u,d,x,n]);function D(s){s<0||s>=h||j(s)}return e.jsx(G,{children:e.jsxs(Ne,{children:[e.jsx(ke,{children:e.jsxs("div",{children:[e.jsx("strong",{children:"원생 목록"}),e.jsx(Ee,{children:g?"불러오는 중...":`총 ${n}명의 원생이 조회되었습니다.`}),c&&e.jsx(Le,{children:c})]})}),e.jsx(Q,{children:e.jsxs(Y,{style:{minWidth:900},children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"번호"}),e.jsx("th",{children:"코드"}),e.jsx("th",{children:"이름"}),e.jsx("th",{children:"생일"}),e.jsx("th",{children:"나이"}),e.jsx("th",{children:"연락처"}),e.jsx("th",{children:"수강수업"}),e.jsx("th",{children:"보호자 연락처"}),e.jsx("th",{children:"상태"}),e.jsx("th",{children:"등록일"})]})}),e.jsxs("tbody",{children:[g&&u.length===0&&Array.from({length:5}).map((s,S)=>e.jsx("tr",{children:e.jsx("td",{colSpan:10,children:e.jsx(J,{h:14})})},`sk-${S}`)),!g&&I.length===0&&e.jsx("tr",{children:e.jsx("td",{colSpan:10,children:e.jsx(X,{children:"조건에 맞는 결과가 없습니다."})})}),I.map(s=>e.jsxs("tr",{children:[e.jsx("td",{children:s.seq}),e.jsx("td",{children:s.code}),e.jsx("td",{children:e.jsx(Me,{type:"button",onClick:()=>l(`/students/${s.id}/courses`),title:"상세 보기",children:s.name})}),e.jsx("td",{children:s.birth||"-"}),e.jsx("td",{children:s.age}),e.jsx("td",{children:s.phone||"-"}),e.jsx("td",{children:s.course||"-"}),e.jsx("td",{children:s.guardian||"-"}),e.jsx("td",{children:e.jsx(Ce,{type:s.status,children:s.status})}),e.jsx("td",{children:s.joinedAt})]},s.id))]})]})}),e.jsxs(Pe,{children:[e.jsx(B,{onClick:()=>D(d-1),disabled:d===0,children:"이전"}),ie(d,h,7).map(s=>e.jsx(B,{"data-active":s===d,onClick:()=>D(s),children:s+1},s)),e.jsx(B,{onClick:()=>D(d+1),disabled:d>=h-1,children:"다음"}),e.jsxs(qe,{children:[e.jsx("span",{children:"페이지당"}),e.jsxs("select",{value:x,onChange:s=>{const S=Number(s.target.value);j(0),p(S)},children:[e.jsx("option",{value:10,children:"10"}),e.jsx("option",{value:20,children:"20"}),e.jsx("option",{value:50,children:"50"})]})]})]})]})})}const ke=a.div`
  display: flex; align-items: center; justify-content: flex-start;
`,Ee=a.div`
  color: #6b7280; font-size: 12px; margin-top: 4px;
`,Me=a.button`
  all: unset; cursor: pointer; color: #1f2937; font-weight: 800;
  &:hover { text-decoration: underline; }
`,Ce=a.span`
  padding: 2px 8px; border-radius: 9999px; font-size: 12px; font-weight: 800;
  ${({type:t})=>t==="수강중"?"background:#dcfce7; color:#16a34a;":t==="휴학"?"background:#fef3c7; color:#b45309;":"background:#f3e8ff; color:#7c3aed;"}
`,Le=a.div`
  color: #b91c1c; font-size: 12px; margin-top: 4px;
`,Pe=a.div`
  display: flex; gap: 6px; justify-content: center; padding-top: 4px;
`,B=a.button`
  min-width: 28px; height: 28px; padding: 0 8px; border-radius: 8px; border: 1px solid #e5e7eb; background: #fff; font-size: 12px; color: #111827;
  &[data-active='true'] { background: #111827; color: #fff; border-color: #111827; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`,qe=a.div`
  display: inline-flex; align-items: center; gap: 6px; margin-left: 12px; color: #6b7280; font-size: 12px;
  select { height: 28px; border: 1px solid #e5e7eb; border-radius: 8px; background: #fff; padding: 0 8px; }
`,Ne=a.div` position: relative; `;function Oe(){const{show:t,success:r,error:l}=Z(),[o,u]=W(),f=i.useMemo(()=>({status:"",from:"",to:"",ageMin:"",ageMax:"",q:"",...De(o)}),[]),[c,m]=i.useState(f),[d,j]=i.useState(0),x=i.useRef(null);i.useEffect(()=>{const n=ze(c);u(n,{replace:!0})},[c,u]);async function p(){try{const n=await se({status:c.status||void 0,q:c.q||void 0,from:c.from||void 0,to:c.to||void 0,ageMin:c.ageMin?Number(c.ageMin):void 0,ageMax:c.ageMax?Number(c.ageMax):void 0});await F(n,"students.xlsx"),r("엑셀 추출이 완료되었습니다.")}catch(n){l(n?.message||"엑셀 추출에 실패했습니다.")}}async function h(){try{const n=await ne();await F(n,"students_template.xlsx"),r("템플릿을 다운로드했습니다.")}catch(n){l(n?.message||"템플릿 다운로드에 실패했습니다.")}}async function b(n){const y=n.target.files?.[0];if(y)try{const g=await ae(y);t(`생성 ${g.created}, 수정 ${g.updated}, 건너뜀 ${g.skipped}`),j(w=>w+1)}catch(g){l(g?.message||"엑셀 업로드에 실패했습니다.")}finally{n.target.value=""}}return e.jsxs(oe,{children:[e.jsxs(ee,{children:[e.jsxs("div",{children:[e.jsx("h2",{children:"원생 관리"}),e.jsx("p",{children:"등록된 원생들을 한눈에 확인해보세요!"})]}),e.jsxs("div",{style:{display:"inline-flex",alignItems:"center",gap:12},children:[e.jsx(te,{to:"/students/new",children:"원생 추가"}),e.jsx(T,{as:"button",onClick:h,children:"템플릿 다운"}),e.jsx(T,{as:"button",onClick:p,children:"추출"}),e.jsx(T,{as:"button",onClick:()=>x.current?.click(),children:"엑셀 업로드"}),e.jsx("input",{ref:x,type:"file",accept:".xlsx,.xls",style:{display:"none"},onChange:b})]})]}),e.jsx(ce,{}),e.jsx(re,{children:e.jsx(ge,{value:c,onChange:m,onApply:()=>j(n=>n+1)})}),e.jsx(we,{filters:c,refreshKey:d})]})}function ze(t){const r=new URLSearchParams;return t.status&&r.set("status",t.status),t.from&&r.set("from",t.from),t.to&&r.set("to",t.to),t.ageMin&&r.set("ageMin",t.ageMin),t.ageMax&&r.set("ageMax",t.ageMax),t.q&&t.q.trim()&&r.set("q",t.q.trim()),r}function De(t){const r=t.get("status")||"",l=t.get("from")||"",o=t.get("to")||"",u=t.get("ageMin")||"",f=t.get("ageMax")||"",c=t.get("q")||"";return{status:r,from:l,to:o,ageMin:u,ageMax:f,q:c}}async function F(t,r){const l=URL.createObjectURL(t),o=document.createElement("a");o.href=l,o.download=r,document.body.appendChild(o),o.click(),o.remove(),URL.revokeObjectURL(l)}export{Oe as default};
