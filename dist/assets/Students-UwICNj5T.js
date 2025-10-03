import{j as e,l as _,d as n,r as i,u as V,m as W,S as H,n as Q,T as J,o as X,E as Z,g as ee,P as te,G as I,a as se}from"./index-kUE9BnSi.js";import{l as M,d as ne,a as ae,i as oe}from"./students-69wN8rSD.js";import{S as ie}from"./SelectBox-s_icYUrD.js";import{f as Y}from"./format-CD1P4D3U.js";import{v as re}from"./pagination-CSW9EPYd.js";import{C as le}from"./ConfirmDialog-PQ5_VVUP.js";function ce({children:t}){return e.jsx(_,{children:t})}n.div`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 12px;
`;function de(){const[t,r]=i.useState(!0),[x,a]=i.useState(null),[p,f]=i.useState(0),[l,m]=i.useState(0),[d,j]=i.useState(0),[g,u]=i.useState(0);return i.useEffect(()=>{let h=!1;async function b(){r(!0),a(null);try{const[o,y,c,S]=await Promise.all([M({size:1}),M({status:"ENROLLED",size:1}),M({status:"ON_LEAVE",size:1}),M({status:"PENDING",size:1})]);h||(f(o.totalElements),m(y.totalElements),j(c.totalElements),u(S.totalElements))}catch(o){h||a(o?.message||"요약 정보를 불러오지 못했습니다.")}finally{h||r(!1)}}return b(),()=>{h=!0}},[]),e.jsxs(xe,{children:[e.jsxs(E,{children:[e.jsxs(C,{children:[e.jsx(L,{children:"총 원생 수"}),e.jsx(P,{"aria-hidden":!0,children:he})]}),e.jsx(D,{children:t?"…":`${p}명`}),x&&e.jsx(ue,{children:x})]}),e.jsxs(E,{children:[e.jsxs(C,{children:[e.jsx(L,{children:"수강중"}),e.jsx(P,{"aria-hidden":!0,children:pe})]}),e.jsx(D,{children:t?"…":`${l}명`})]}),e.jsxs(E,{children:[e.jsxs(C,{children:[e.jsx(L,{children:"휴학"}),e.jsx(P,{"aria-hidden":!0,children:ge})]}),e.jsx(D,{children:t?"…":`${d}명`})]}),e.jsxs(E,{children:[e.jsxs(C,{children:[e.jsx(L,{children:"대기중"}),e.jsx(P,{"aria-hidden":!0,children:fe})]}),e.jsx(D,{children:t?"…":`${g}명`})]})]})}const xe=n.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
`,E=n.article`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`,C=n.div`
  display: flex; align-items: center; justify-content: space-between;
`,L=n.h4`
  margin: 0; font-size: 14px; color: #6b7280; font-weight: 600;
`,P=n.span`
  width: 34px; height: 34px; border-radius: 10px; display: grid; place-items: center; background: #eef2ff; color: #4f46e5;
`,D=n.div`
  font-size: 28px; font-weight: 800; color: #111827; letter-spacing: -0.02em;
`,ue=n.div`
  color: #b91c1c; font-size: 12px;
`,he=e.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M20 21v-2a4 4 0 0 0-3-3.87"}),e.jsx("path",{d:"M4 21v-2a4 4 0 0 1 3-3.87"}),e.jsx("circle",{cx:"7",cy:"7",r:"4"}),e.jsx("circle",{cx:"17",cy:"7",r:"4"})]}),pe=e.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M22 10L12 4 2 10l10 6 10-6z"}),e.jsx("path",{d:"M6 12v5l6 3 6-3v-5"})]}),ge=e.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("rect",{x:"6",y:"4",width:"4",height:"16"}),e.jsx("rect",{x:"14",y:"4",width:"4",height:"16"})]}),fe=e.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"12",cy:"12",r:"10"}),e.jsx("path",{d:"M12 6v6l3 3"})]});function je({value:t,onChange:r,onApply:x}){const a=t,[p,f]=i.useState(!1),[l,m]=i.useState(a.q),d=i.useRef(null),[j,g]=i.useState(!1);i.useEffect(()=>{m(a.q)},[a.q]);function u(o,y){r({...a,[o]:y})}function h(){r({status:"",from:"",to:"",ageMin:"",ageMax:"",q:""})}function b(){const o=(d.current?.value??l).trim();r({...a,q:o}),x?.()}return e.jsxs(me,{children:[e.jsxs(q,{children:[e.jsx(z,{children:"상태"}),e.jsx(ie,{ariaLabel:"상태",value:a.status||"",onChange:o=>u("status",o),placeholder:"전체",options:[{label:"수강중",value:"ENROLLED"},{label:"휴학",value:"ON_LEAVE"},{label:"대기중",value:"PENDING"}]})]}),e.jsxs(q,{children:[e.jsx(z,{children:"등록일"}),e.jsxs(O,{children:[e.jsx(G,{type:"date",lang:"ko-KR","data-placeholder":"YYYY.MM.DD","data-has-value":!!a.from,value:a.from,onChange:o=>u("from",o.target.value)}),e.jsx(F,{children:"~"}),e.jsx(G,{type:"date",lang:"ko-KR","data-placeholder":"YYYY.MM.DD","data-has-value":!!a.to,value:a.to,onChange:o=>u("to",o.target.value)})]})]}),e.jsxs(q,{children:[e.jsx(z,{children:"나이"}),e.jsxs(O,{children:[e.jsx(A,{type:"number",placeholder:"12",value:a.ageMin,onChange:o=>u("ageMin",o.target.value)}),e.jsx(F,{children:"~"}),e.jsx(A,{type:"number",placeholder:"16",value:a.ageMax,onChange:o=>u("ageMax",o.target.value)})]})]}),e.jsxs(q,{children:[e.jsx(z,{children:"검색"}),e.jsxs(be,{children:[e.jsx(ve,{ref:d,placeholder:"학생명, 보호자, 연락처 등 검색",value:l,onChange:o=>m(o.target.value),onCompositionStart:()=>f(!0),onCompositionEnd:()=>{f(!1),j&&(g(!1),b())},onKeyDown:o=>{o.key==="Enter"&&(o.preventDefault(),p?g(!0):b())}}),e.jsx(ye,{type:"button",onClick:b,children:"검색"}),e.jsx(Se,{type:"button",onClick:h,children:"초기화"})]})]})]})}const me=n.div`
  display: grid; grid-template-columns: 0.6fr 1.2fr 1fr 2.7fr; gap: 12px; align-items: end;
  @media (max-width: 1080px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  @media (max-width: 720px) { grid-template-columns: 1fr; }
`,q=n.div`
  display: grid; gap: 8px; align-items: start;
`,z=n.span`
  color: #6b7280; font-size: 12px; font-weight: 700;
`,A=n.input`
  height: 36px; border: 1px solid #e5e7eb; border-radius: 10px; padding: 0 10px; width: 100%;
`,G=n.input`
  height: 36px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 10px;
  width: 100%;
  position: relative;
  background: #fff;
  /* Show custom placeholder when no value and not focused */
  &::before {
    content: attr(data-placeholder);
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
    pointer-events: none;
  }
  &:focus::before,
  &[data-has-value='true']::before {
    content: '';
  }
  /* Hide native empty ghost text on Safari */
  &::-webkit-datetime-edit { color: ${({"data-has-value":t})=>t?"#111827":"transparent"}; }
  &::-webkit-calendar-picker-indicator { opacity: 1; }
`,O=n.div`
  display: grid; grid-template-columns: 1fr auto 1fr; gap: 6px; align-items: center;
`,F=n.span`
  color: #6b7280; font-size: 12px; text-align: center;
`,be=n.div`
  display: grid; grid-template-columns: 1fr auto auto; gap: 8px; align-items: end;
`,ve=n.input`
  height: 36px; border: 1px solid #e5e7eb; border-radius: 10px; padding: 0 12px; width: 100%;
`,ye=n.button`
  height: 40px; padding: 0 16px; border-radius: 10px; border: 1px solid #111827; background: #111827; color: #fff; font-weight: 700;
`,Se=n.button`
  height: 40px; padding: 0 16px; border-radius: 10px; border: 1px solid #e5e7eb; background: #fff; color: #111827; font-weight: 700;
`;function we(t){return t==="ENROLLED"?"수강중":t==="ON_LEAVE"?"휴학":"대기중"}function ke({filters:t,refreshKey:r}){const x=V(),[a]=W(),[p,f]=i.useState([]),[l,m]=i.useState(null),[d,j]=i.useState(()=>{const s=Number(a.get("page"));return Number.isFinite(s)&&s>=0?s:0}),[g,u]=i.useState(()=>{const s=Number(a.get("size"));return s===10||s===20||s===50?s:10}),[h,b]=i.useState(0),[o,y]=i.useState(0),[c,S]=i.useState(!1),w="createdAt",N="DESC";i.useEffect(()=>{let s=!1;async function k(){m(null),S(!0);try{const v=await M({page:d,size:g,status:t.status||void 0,q:t.q||void 0,from:t.from||void 0,to:t.to||void 0,ageMin:t.ageMin?Number(t.ageMin):void 0,ageMax:t.ageMax?Number(t.ageMax):void 0,s:w,dir:N});s||(f(v.content),b(v.totalPages),y(v.totalElements))}catch(v){s||m(v?.message||"원생 불러오기에 실패했습니다.")}finally{s||S(!1)}}return k(),()=>{s=!0}},[d,g,t.status,t.q,t.from,t.to,t.ageMin,t.ageMax,r]),i.useEffect(()=>{j(0)},[t.status,t.q,t.from,t.to,t.ageMin,t.ageMax]);const $=i.useMemo(()=>p.map((s,k)=>{let v;if(s.birthDate){const B=Number(s.birthDate.split("-")[0]),U=new Date().getFullYear()-B+1;v=String(U)}else v=s.age!=null?String(s.age):"-";return{seq:Math.max(0,o-d*g-k),code:s.code,id:s.id,name:s.name,age:v,phone:Y(s.phoneNumber),course:s.courses?.map(B=>B.title).join(", ")||"-",guardian:Y(s.guardianPhone),status:we(s.status),joinedAt:s.joinedDate||s.createdAt?.slice(0,10)||"-"}}),[p,d,g,o]);function R(s){s<0||s>=h||j(s)}return e.jsx(H,{children:e.jsxs(ze,{children:[e.jsx(Me,{children:e.jsxs("div",{children:[e.jsx("strong",{children:"원생 목록"}),e.jsx(Ee,{children:c?"불러오는 중...":`총 ${o}명의 원생이 조회되었습니다.`}),l&&e.jsx(Pe,{children:l})]})}),e.jsx(Q,{children:e.jsxs(J,{style:{minWidth:900},children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"번호"}),e.jsx("th",{children:"코드"}),e.jsx("th",{children:"이름"}),e.jsx("th",{children:"나이"}),e.jsx("th",{children:"연락처"}),e.jsx("th",{children:"수강수업"}),e.jsx("th",{children:"보호자 연락처"}),e.jsx("th",{children:"상태"}),e.jsx("th",{children:"등록일"})]})}),e.jsxs("tbody",{children:[c&&p.length===0&&Array.from({length:5}).map((s,k)=>e.jsx("tr",{children:e.jsx("td",{colSpan:9,children:e.jsx(X,{h:14})})},`sk-${k}`)),!c&&$.length===0&&e.jsx("tr",{children:e.jsx("td",{colSpan:9,children:e.jsx(Z,{children:"조건에 맞는 결과가 없습니다."})})}),$.map(s=>e.jsxs("tr",{children:[e.jsx("td",{children:s.seq}),e.jsx("td",{children:s.code}),e.jsx("td",{children:e.jsx(Ce,{type:"button",onClick:()=>x(`/students/${s.id}/courses`),title:"상세 보기",children:s.name})}),e.jsx("td",{children:s.age}),e.jsx("td",{children:s.phone||"-"}),e.jsx("td",{children:s.course||"-"}),e.jsx("td",{children:s.guardian||"-"}),e.jsx("td",{children:e.jsx(Le,{type:s.status,children:s.status})}),e.jsx("td",{children:s.joinedAt})]},s.id))]})]})}),e.jsxs(De,{children:[e.jsx(T,{onClick:()=>R(d-1),disabled:d===0,children:"이전"}),re(d,h,7).map(s=>e.jsx(T,{"data-active":s===d,onClick:()=>R(s),children:s+1},s)),e.jsx(T,{onClick:()=>R(d+1),disabled:d>=h-1,children:"다음"}),e.jsxs(qe,{children:[e.jsx("span",{children:"페이지당"}),e.jsxs("select",{value:g,onChange:s=>{const k=Number(s.target.value);j(0),u(k)},children:[e.jsx("option",{value:10,children:"10"}),e.jsx("option",{value:20,children:"20"}),e.jsx("option",{value:50,children:"50"})]})]})]})]})})}const Me=n.div`
  display: flex; align-items: center; justify-content: flex-start;
`,Ee=n.div`
  color: #6b7280; font-size: 12px; margin-top: 4px;
`,Ce=n.button`
  all: unset; cursor: pointer; color: #1f2937; font-weight: 800;
  &:hover { text-decoration: underline; }
`,Le=n.span`
  padding: 2px 8px; border-radius: 9999px; font-size: 12px; font-weight: 800;
  ${({type:t})=>t==="수강중"?"background:#dcfce7; color:#16a34a;":t==="휴학"?"background:#fef3c7; color:#b45309;":"background:#f3e8ff; color:#7c3aed;"}
`,Pe=n.div`
  color: #b91c1c; font-size: 12px; margin-top: 4px;
`,De=n.div`
  display: flex; gap: 6px; justify-content: center; padding-top: 4px;
`,T=n.button`
  min-width: 28px; height: 28px; padding: 0 8px; border-radius: 8px; border: 1px solid #e5e7eb; background: #fff; font-size: 12px; color: #111827;
  &[data-active='true'] { background: #111827; color: #fff; border-color: #111827; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`,qe=n.div`
  display: inline-flex; align-items: center; gap: 6px; margin-left: 12px; color: #6b7280; font-size: 12px;
  select { height: 28px; border: 1px solid #e5e7eb; border-radius: 8px; background: #fff; padding: 0 8px; }
`,ze=n.div` position: relative; `;function _e(){const{show:t,success:r,error:x}=ee(),[a,p]=W(),f=i.useMemo(()=>({status:"",from:"",to:"",ageMin:"",ageMax:"",q:"",...Re(a)}),[]),[l,m]=i.useState(f),[d,j]=i.useState(0),[g,u]=i.useState(!1),h=i.useRef(null);i.useEffect(()=>{const c=Ne(l);p(c,{replace:!0})},[l,p]);async function b(){try{const c=await ne({status:l.status||void 0,q:l.q||void 0,from:l.from||void 0,to:l.to||void 0,ageMin:l.ageMin?Number(l.ageMin):void 0,ageMax:l.ageMax?Number(l.ageMax):void 0});await K(c,"students.xlsx"),r("엑셀 추출이 완료되었습니다.")}catch(c){x(c?.message||"엑셀 추출에 실패했습니다.")}}async function o(){try{const c=await ae();await K(c,"students_template.xlsx"),r("템플릿을 다운로드했습니다.")}catch(c){x(c?.message||"템플릿 다운로드에 실패했습니다.")}}async function y(c){const S=c.target.files?.[0];if(S)try{const w=await oe(S);t(`생성 ${w.created}, 수정 ${w.updated}, 건너뜀 ${w.skipped}`),j(N=>N+1)}catch(w){x(w?.message||"엑셀 업로드에 실패했습니다.")}finally{c.target.value=""}}return e.jsxs(ce,{children:[e.jsx(Be,{children:e.jsxs(Ie,{children:[e.jsxs(Te,{children:[e.jsxs("div",{children:[e.jsx("h2",{children:"원생 관리"}),e.jsx("p",{children:"등록된 원생들을 한눈에 확인해보세요!"})]}),e.jsxs("div",{style:{display:"inline-flex",alignItems:"center",gap:12},children:[e.jsx(te,{to:"/students/new",children:"원생 추가"}),e.jsx(I,{as:"button",onClick:o,children:"템플릿 다운"}),e.jsx(I,{as:"button",onClick:b,children:"추출"}),e.jsx(I,{as:"button",onClick:()=>u(!0),children:"엑셀 업로드"}),e.jsx("input",{ref:h,type:"file",accept:".xlsx,.xls",style:{display:"none"},onChange:y})]})]}),e.jsx(de,{}),e.jsx($e,{children:e.jsx(je,{value:l,onChange:m,onApply:()=>j(c=>c+1)})})]})}),e.jsx(ke,{filters:l,refreshKey:d}),e.jsx(le,{open:g,title:"엑셀 업로드 안내",message:e.jsxs(Ye,{children:[e.jsx("li",{children:"템플릿 헤더 이름과 순서를 변경하지 말아주세요."}),e.jsx("li",{children:"필수 입력값: 이름 (빈 행은 자동으로 건너뜁니다)."}),e.jsx("li",{children:"상태는 수강중/휴학/대기 중 하나만 입력하거나 비워두면 수강중으로 처리돼요."}),e.jsx("li",{children:"등록일·생년월일은 YYYY-MM-DD 형식을 사용하거나 엑셀 날짜 서식을 적용해주세요."}),e.jsx("li",{children:"연락처와 보호자 연락처는 0으로 시작할 수 있으니 텍스트 서식을 권장합니다."}),e.jsx("li",{children:"보호자 성함·보호자 연락처·주소는 선택 항목이며 필요 시에만 입력하세요."}),e.jsx("li",{children:"기존 원생은 이름과 연락처로 찾아 업데이트합니다. 연락처가 없으면 신규로 추가될 수 있습니다."})]}),confirmLabel:"업로드 진행",cancelLabel:"취소",onCancel:()=>u(!1),onConfirm:()=>{u(!1),setTimeout(()=>h.current?.click(),0)}})]})}function Ne(t){const r=new URLSearchParams;return t.status&&r.set("status",t.status),t.from&&r.set("from",t.from),t.to&&r.set("to",t.to),t.ageMin&&r.set("ageMin",t.ageMin),t.ageMax&&r.set("ageMax",t.ageMax),t.q&&t.q.trim()&&r.set("q",t.q.trim()),r}function Re(t){const r=t.get("status")||"",x=t.get("from")||"",a=t.get("to")||"",p=t.get("ageMin")||"",f=t.get("ageMax")||"",l=t.get("q")||"";return{status:r,from:x,to:a,ageMin:p,ageMax:f,q:l}}async function K(t,r){const x=URL.createObjectURL(t),a=document.createElement("a");a.href=x,a.download=r,document.body.appendChild(a),a.click(),a.remove(),URL.revokeObjectURL(x)}const Be=n.div`
  position: sticky;
  top: 0;
  z-index: 35; /* above table headers */
  background: ${({theme:t})=>t.colors.surface};
  border-bottom: 1px solid ${({theme:t})=>t.colors.border};
`,Ie=n.div`
  display: grid;
  gap: 12px;
  padding: 8px 0 12px;
`,Te=n(se)`
  position: static;
  margin-bottom: 0;
  box-shadow: none;
`,$e=n(H)`
  overflow: visible;
  position: relative;
  z-index: 36;
`,Ye=n.ul`
  margin: 0;
  padding-left: 18px;
  display: grid;
  gap: 6px;
  font-size: 14px;
  color: #374151;
  li { list-style: disc; }
`;export{_e as default};
