import{j as e,P as H,d as n,r as i,u as U,o as K,S as W,q as V,s as Q,E as J,T as X,k as Z,a as ee,G as B,b as te}from"./index-DuqOyKVg.js";import{l as M,d as se,a as ne,i as ae}from"./students-BqdD7vYY.js";import{r as L}from"./errors-C6OcbAl5.js";import{S as oe}from"./SelectBox-CYVo06N3.js";import{b as Y}from"./format-Do6vjlY3.js";import{v as ie}from"./pagination-B12eDNVl.js";import{C as re}from"./ConfirmDialog-B4qO0ati.js";function le({children:t}){return e.jsx(H,{children:t})}n.div`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 12px;
`;function de(){const[t,r]=i.useState(!0),[h,a]=i.useState(null),[p,j]=i.useState(0),[l,f]=i.useState(0),[c,m]=i.useState(0),[g,x]=i.useState(0);return i.useEffect(()=>{let u=!1;async function b(){r(!0),a(null);try{const[o,w,d,k]=await Promise.all([M({size:1}),M({status:"ENROLLED",size:1}),M({status:"ON_LEAVE",size:1}),M({status:"PENDING",size:1})]);u||(j(o.totalElements),f(w.totalElements),m(d.totalElements),x(k.totalElements))}catch(o){u||a(L(o,"요약 정보를 불러오지 못했습니다."))}finally{u||r(!1)}}return b(),()=>{u=!0}},[]),e.jsxs(ce,{children:[e.jsxs(C,{children:[e.jsxs(P,{children:[e.jsx(N,{children:"총 원생 수"}),e.jsx(D,{"aria-hidden":!0,children:xe})]}),e.jsx(q,{children:t?"…":`${p}명`}),h&&e.jsx(he,{children:h})]}),e.jsxs(C,{children:[e.jsxs(P,{children:[e.jsx(N,{children:"수강중"}),e.jsx(D,{"aria-hidden":!0,children:ue})]}),e.jsx(q,{children:t?"…":`${l}명`})]}),e.jsxs(C,{children:[e.jsxs(P,{children:[e.jsx(N,{children:"휴학"}),e.jsx(D,{"aria-hidden":!0,children:pe})]}),e.jsx(q,{children:t?"…":`${c}명`})]}),e.jsxs(C,{children:[e.jsxs(P,{children:[e.jsx(N,{children:"대기중"}),e.jsx(D,{"aria-hidden":!0,children:ge})]}),e.jsx(q,{children:t?"…":`${g}명`})]})]})}const ce=n.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
`,C=n.article`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`,P=n.div`
  display: flex; align-items: center; justify-content: space-between;
`,N=n.h4`
  margin: 0; font-size: 14px; color: #6b7280; font-weight: 600;
`,D=n.span`
  width: 34px; height: 34px; border-radius: 10px; display: grid; place-items: center; background: #eef2ff; color: #4f46e5;
`,q=n.div`
  font-size: 28px; font-weight: 800; color: #111827; letter-spacing: -0.02em;
`,he=n.div`
  color: #b91c1c; font-size: 12px;
`,xe=e.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M20 21v-2a4 4 0 0 0-3-3.87"}),e.jsx("path",{d:"M4 21v-2a4 4 0 0 1 3-3.87"}),e.jsx("circle",{cx:"7",cy:"7",r:"4"}),e.jsx("circle",{cx:"17",cy:"7",r:"4"})]}),ue=e.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M22 10L12 4 2 10l10 6 10-6z"}),e.jsx("path",{d:"M6 12v5l6 3 6-3v-5"})]}),pe=e.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("rect",{x:"6",y:"4",width:"4",height:"16"}),e.jsx("rect",{x:"14",y:"4",width:"4",height:"16"})]}),ge=e.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"12",cy:"12",r:"10"}),e.jsx("path",{d:"M12 6v6l3 3"})]});function fe({value:t,onChange:r,onApply:h}){const a=t,[p,j]=i.useState(!1),[l,f]=i.useState(a.q),c=i.useRef(null),[m,g]=i.useState(!1);i.useEffect(()=>{f(a.q)},[a.q]);function x(o,w){r({...a,[o]:w})}function u(){r({status:"",from:"",to:"",ageMin:"",ageMax:"",q:""})}function b(){const o=(c.current?.value??l).trim();r({...a,q:o}),h?.()}return e.jsxs(je,{children:[e.jsxs(z,{children:[e.jsx(R,{children:"상태"}),e.jsx(oe,{ariaLabel:"상태",value:a.status||"",onChange:o=>x("status",o),placeholder:"전체",options:[{label:"수강중",value:"ENROLLED"},{label:"휴학",value:"ON_LEAVE"},{label:"대기중",value:"PENDING"}]})]}),e.jsxs(z,{children:[e.jsx(R,{children:"등록일"}),e.jsxs(O,{children:[e.jsx(A,{type:"date",lang:"ko-KR","data-placeholder":"YYYY.MM.DD","data-has-value":!!a.from,value:a.from,onChange:o=>x("from",o.target.value)}),e.jsx(G,{children:"~"}),e.jsx(A,{type:"date",lang:"ko-KR","data-placeholder":"YYYY.MM.DD","data-has-value":!!a.to,value:a.to,onChange:o=>x("to",o.target.value)})]})]}),e.jsxs(z,{children:[e.jsx(R,{children:"나이"}),e.jsxs(O,{children:[e.jsx($,{type:"number",placeholder:"12",value:a.ageMin,onChange:o=>x("ageMin",o.target.value)}),e.jsx(G,{children:"~"}),e.jsx($,{type:"number",placeholder:"16",value:a.ageMax,onChange:o=>x("ageMax",o.target.value)})]})]}),e.jsxs(z,{children:[e.jsx(R,{children:"검색"}),e.jsxs(me,{children:[e.jsx(be,{ref:c,placeholder:"학생명, 보호자, 연락처 등 검색",value:l,onChange:o=>f(o.target.value),onCompositionStart:()=>j(!0),onCompositionEnd:()=>{j(!1),m&&(g(!1),b())},onKeyDown:o=>{o.key==="Enter"&&(o.preventDefault(),p?g(!0):b())}}),e.jsx(ve,{type:"button",onClick:b,children:"검색"}),e.jsx(ye,{type:"button",onClick:u,children:"초기화"})]})]})]})}const je=n.div`
  display: grid; grid-template-columns: 0.6fr 1.2fr 1fr 2.7fr; gap: 12px; align-items: end;
  @media (max-width: 1080px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  @media (max-width: 720px) { grid-template-columns: 1fr; }
  /* Make filters sticky when scrolling under the header block */
  position: sticky;
  top: 64px; /* adjust if page header height differs */
  z-index: 37;
  background: #fff;
`,z=n.div`
  display: grid; gap: 8px; align-items: start;
`,R=n.span`
  color: #6b7280; font-size: 12px; font-weight: 700;
`,$=n.input`
  height: 36px; border: 1px solid #e5e7eb; border-radius: 10px; padding: 0 10px; width: 100%;
`,A=n.input`
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
  &::-webkit-datetime-edit { color: transparent; }
  &[data-has-value='true']::-webkit-datetime-edit { color: #111827; }
  &::-webkit-calendar-picker-indicator { opacity: 1; }
`,O=n.div`
  display: grid; grid-template-columns: 1fr auto 1fr; gap: 6px; align-items: center;
`,G=n.span`
  color: #6b7280; font-size: 12px; text-align: center;
`,me=n.div`
  display: grid; grid-template-columns: 1fr auto auto; gap: 8px; align-items: end;
`,be=n.input`
  height: 36px; border: 1px solid #e5e7eb; border-radius: 10px; padding: 0 12px; width: 100%;
`,ve=n.button`
  height: 40px; padding: 0 16px; border-radius: 10px; border: 1px solid #111827; background: #111827; color: #fff; font-weight: 700;
`,ye=n.button`
  height: 40px; padding: 0 16px; border-radius: 10px; border: 1px solid #e5e7eb; background: #fff; color: #111827; font-weight: 700;
`;function we(t){return t==="ENROLLED"?"수강중":t==="ON_LEAVE"?"휴학":"대기중"}function ke({filters:t,refreshKey:r}){const h=U(),[a]=K(),[p,j]=i.useState([]),[l,f]=i.useState(null),[c,m]=i.useState(()=>{const s=Number(a.get("page"));return Number.isFinite(s)&&s>=0?s:0}),[g,x]=i.useState(()=>{const s=Number(a.get("size"));return s===10||s===20||s===50?s:10}),[u,b]=i.useState(0),[o,w]=i.useState(0),[d,k]=i.useState(!1);i.useEffect(()=>{let s=!1;async function S(){f(null),k(!0);try{const v=await M({page:c,size:g,status:t.status||void 0,q:t.q||void 0,from:t.from||void 0,to:t.to||void 0,ageMin:t.ageMin?Number(t.ageMin):void 0,ageMax:t.ageMax?Number(t.ageMax):void 0});s||(j(v.content),b(v.totalPages),w(v.totalElements))}catch(v){s||f(L(v,"원생 불러오기에 실패했습니다."))}finally{s||k(!1)}}return S(),()=>{s=!0}},[c,g,t.status,t.q,t.from,t.to,t.ageMin,t.ageMax,r]),i.useEffect(()=>{m(0)},[t.status,t.q,t.from,t.to,t.ageMin,t.ageMax]);const y=i.useMemo(()=>p.map((s,S)=>{let v;if(s.birthDate){const T=Number(s.birthDate.split("-")[0]),_=new Date().getFullYear()-T+1;v=String(_)}else v=s.age!=null?String(s.age):"-";return{seq:Math.max(0,o-c*g-S),code:s.code,id:s.id,name:s.name,age:v,phone:Y(s.phoneNumber),course:s.courses?.map(T=>T.title).join(", ")||"-",guardian:Y(s.guardianPhone),status:we(s.status),joinedAt:s.joinedDate||s.createdAt?.slice(0,10)||"-"}}),[p,c,g,o]);function E(s){s<0||s>=u||m(s)}return e.jsx(W,{children:e.jsxs(Ne,{children:[e.jsx(Se,{children:e.jsxs("div",{children:[e.jsx("strong",{children:"원생 목록"}),e.jsx(Ee,{children:d?"불러오는 중...":`총 ${o}명의 원생이 조회되었습니다.`}),l&&e.jsx(Le,{children:l})]})}),e.jsx(V,{children:e.jsxs(De,{children:[e.jsxs("colgroup",{children:[e.jsx("col",{style:{width:"7%"}}),"       ",e.jsx("col",{style:{width:"16%"}}),"      ",e.jsx("col",{style:{width:"12%"}}),"      ",e.jsx("col",{style:{width:"7%"}}),"       ",e.jsx("col",{style:{width:"27%"}}),"      ",e.jsx("col",{style:{width:"10%"}}),"      ",e.jsx("col",{style:{width:"7%"}}),"       ",e.jsx("col",{style:{width:"14%"}}),"      "]}),e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"번호"}),e.jsx("th",{children:"이름"}),e.jsx("th",{children:"연락처"}),e.jsx("th",{children:"나이"}),e.jsx("th",{children:"수강수업"}),e.jsx("th",{children:"보호자 연락처"}),e.jsx("th",{children:"상태"}),e.jsx("th",{children:"등록일"})]})}),e.jsxs("tbody",{children:[d&&p.length===0&&Array.from({length:5}).map((s,S)=>e.jsx("tr",{children:e.jsx("td",{colSpan:8,children:e.jsx(Q,{h:14})})},`sk-${S}`)),!d&&y.length===0&&e.jsx("tr",{children:e.jsx("td",{colSpan:8,children:e.jsx(J,{children:"조건에 맞는 결과가 없습니다."})})}),y.map(s=>e.jsxs("tr",{onClick:()=>h(`/students/${s.id}/courses`),"data-clickable":"true",children:[e.jsx("td",{children:s.seq}),e.jsx("td",{children:e.jsx(qe,{title:s.name,children:s.name})}),e.jsx("td",{children:s.phone||"-"}),e.jsx("td",{children:s.age}),e.jsx("td",{children:e.jsx(ze,{title:s.course||"-",children:s.course||"-"})}),e.jsx("td",{children:s.guardian||"-"}),e.jsx("td",{children:e.jsx(Me,{type:s.status,children:s.status})}),e.jsx("td",{children:s.joinedAt})]},s.id))]})]})}),e.jsxs(Ce,{children:[e.jsx(I,{onClick:()=>E(c-1),disabled:c===0,children:"이전"}),ie(c,u,7).map(s=>e.jsx(I,{"data-active":s===c,onClick:()=>E(s),children:s+1},s)),e.jsx(I,{onClick:()=>E(c+1),disabled:c>=u-1,children:"다음"}),e.jsxs(Pe,{children:[e.jsx("span",{children:"페이지당"}),e.jsxs("select",{value:g,onChange:s=>{const S=Number(s.target.value);m(0),x(S)},children:[e.jsx("option",{value:10,children:"10"}),e.jsx("option",{value:20,children:"20"}),e.jsx("option",{value:50,children:"50"})]})]})]})]})})}const Se=n.div`
  display: flex; align-items: center; justify-content: flex-start;
`,Ee=n.div`
  color: #6b7280; font-size: 12px; margin-top: 4px;
`,Me=n.span`
  padding: 2px 8px; border-radius: 9999px; font-size: 12px; font-weight: 800;
  ${({type:t})=>t==="수강중"?"background:#dcfce7; color:#16a34a;":t==="휴학"?"background:#fef3c7; color:#b45309;":"background:#f3e8ff; color:#7c3aed;"}
`,Le=n.div`
  color: #b91c1c; font-size: 12px; margin-top: 4px;
`,Ce=n.div`
  display: flex; gap: 6px; justify-content: center; padding-top: 4px;
`,I=n.button`
  min-width: 28px; height: 28px; padding: 0 8px; border-radius: 8px; border: 1px solid #e5e7eb; background: #fff; font-size: 12px; color: #111827;
  &[data-active='true'] { background: #111827; color: #fff; border-color: #111827; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`,Pe=n.div`
  display: inline-flex; align-items: center; gap: 6px; margin-left: 12px; color: #6b7280; font-size: 12px;
  select { height: 28px; border: 1px solid #e5e7eb; border-radius: 8px; background: #fff; padding: 0 8px; }
`,Ne=n.div` position: relative; `,De=n(X)`
  table-layout: fixed;
  width: 100%;
  thead th {
    background: #f8fafc;
    color: #334155;
    font-weight: 800;
    text-align: center;
  }
  thead th, tbody td {
    vertical-align: middle;
    padding: 12px;
    text-align: center;
    /* vertical separators between columns */
    border-right: 1px solid #f1f5f9;
  }
  thead th:last-child, tbody td:last-child { border-right: none; }
  tbody td { font-size: 13.5px; color: #0f172a; }
  tbody tr[data-clickable='true'] { cursor: pointer; }
  tbody tr[data-clickable='true']:active td { background: ${({theme:t})=>t.colors.surfaceAlt}; }
  /* 숫자 폰트 형태 정리: 번호(1열), 나이(4열) */
  thead th:nth-child(1), tbody td:nth-child(1),
  thead th:nth-child(4), tbody td:nth-child(4) { font-feature-settings: 'tnum'; }
`,qe=n.span`
  display: inline-block;
  max-width: 240px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`,ze=n.span`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  white-space: normal;
  line-height: 1.4;
  max-height: calc(1.4em * 2);
`;function Qe(){const{show:t,success:r,error:h}=Z(),[a,p]=K(),j=i.useMemo(()=>({status:"",from:"",to:"",ageMin:"",ageMax:"",q:"",...Te(a)}),[]),[l,f]=i.useState(j),[c,m]=i.useState(0),[g,x]=i.useState(!1),u=i.useRef(null);i.useEffect(()=>{const d=Re(l);p(d,{replace:!0})},[l,p]);async function b(){try{const d=await se({status:l.status||void 0,q:l.q||void 0,from:l.from||void 0,to:l.to||void 0,ageMin:l.ageMin?Number(l.ageMin):void 0,ageMax:l.ageMax?Number(l.ageMax):void 0});await F(d,"students.xlsx"),r("엑셀 추출이 완료되었습니다.")}catch(d){h(L(d,"엑셀 추출에 실패했습니다."))}}async function o(){try{const d=await ne();await F(d,"students_template.xlsx"),r("템플릿을 다운로드했습니다.")}catch(d){h(L(d,"템플릿 다운로드에 실패했습니다."))}}async function w(d){const k=d.target.files?.[0];if(k)try{const y=await ae(k);t(`생성 ${y.created}, 수정 ${y.updated}, 건너뜀 ${y.skipped}`),m(E=>E+1)}catch(y){h(L(y,"엑셀 업로드에 실패했습니다."))}finally{d.target.value=""}}return e.jsxs(le,{children:[e.jsx(Be,{children:e.jsxs(Ie,{children:[e.jsxs(Ye,{children:[e.jsxs("div",{children:[e.jsx("h2",{children:"원생 관리"}),e.jsx("p",{children:"등록된 원생들을 한눈에 확인해보세요!"})]}),e.jsxs("div",{style:{display:"inline-flex",alignItems:"center",gap:12},children:[e.jsx(ee,{to:"/students/new",children:"원생 추가"}),e.jsx(B,{as:"button",onClick:o,children:"템플릿 다운"}),e.jsx(B,{as:"button",onClick:b,children:"추출"}),e.jsx(B,{as:"button",onClick:()=>x(!0),children:"엑셀 업로드"}),e.jsx("input",{ref:u,type:"file",accept:".xlsx,.xls",style:{display:"none"},onChange:w})]})]}),e.jsx(de,{}),e.jsx($e,{children:e.jsx(fe,{value:l,onChange:f,onApply:()=>m(d=>d+1)})})]})}),e.jsx(ke,{filters:l,refreshKey:c}),e.jsx(re,{open:g,title:"엑셀 업로드 안내",message:e.jsxs(Ae,{children:[e.jsx("li",{children:"템플릿 헤더 이름과 순서를 변경하지 말아주세요."}),e.jsx("li",{children:"필수 입력값: 이름 (빈 행은 자동으로 건너뜁니다)."}),e.jsx("li",{children:"상태는 수강중/휴학/대기 중 하나만 입력하거나 비워두면 수강중으로 처리돼요."}),e.jsx("li",{children:"등록일·생년월일은 YYYY-MM-DD 형식을 사용하거나 엑셀 날짜 서식을 적용해주세요."}),e.jsx("li",{children:"연락처와 보호자 연락처는 0으로 시작할 수 있으니 텍스트 서식을 권장합니다."}),e.jsx("li",{children:"보호자 성함·보호자 연락처·주소는 선택 항목이며 필요 시에만 입력하세요."}),e.jsx("li",{children:"기존 원생은 이름과 연락처로 찾아 업데이트합니다. 연락처가 없으면 신규로 추가될 수 있습니다."})]}),confirmLabel:"업로드 진행",cancelLabel:"취소",onCancel:()=>x(!1),onConfirm:()=>{x(!1),setTimeout(()=>u.current?.click(),0)}})]})}function Re(t){const r=new URLSearchParams;return t.status&&r.set("status",t.status),t.from&&r.set("from",t.from),t.to&&r.set("to",t.to),t.ageMin&&r.set("ageMin",t.ageMin),t.ageMax&&r.set("ageMax",t.ageMax),t.q&&t.q.trim()&&r.set("q",t.q.trim()),r}function Te(t){const r=t.get("status"),h=r==="ENROLLED"||r==="ON_LEAVE"||r==="PENDING"?r:"",a=t.get("from")||"",p=t.get("to")||"",j=t.get("ageMin")||"",l=t.get("ageMax")||"",f=t.get("q")||"";return{status:h,from:a,to:p,ageMin:j,ageMax:l,q:f}}async function F(t,r){const h=URL.createObjectURL(t),a=document.createElement("a");a.href=h,a.download=r,document.body.appendChild(a),a.click(),a.remove(),URL.revokeObjectURL(h)}const Be=n.div`
  position: sticky;
  top: 0;
  z-index: 35; /* above table headers */
  background: ${({theme:t})=>t.colors.surface};
  /* remove bottom divider under sticky filter area */
  border-bottom: 0;
`,Ie=n.div`
  display: grid;
  gap: 12px;
  padding: 8px 0 0;
`,Ye=n(te)`
  position: static;
  margin-bottom: 0;
  box-shadow: none;
`,$e=n(W)`
  overflow: visible;
  position: relative;
  z-index: 36;
`,Ae=n.ul`
  margin: 0;
  padding-left: 18px;
  display: grid;
  gap: 6px;
  font-size: 14px;
  color: #374151;
  li { list-style: disc; }
`;export{Qe as default};
