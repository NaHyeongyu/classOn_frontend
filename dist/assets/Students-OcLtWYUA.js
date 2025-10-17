import{j as e,d as i,r as o,u as V,e as K,b as Q}from"./index-D-9d_yHo.js";import{P as J,S as _,g as X,h as Z,E as ee,T as te,a as se,G as I,b as ne}from"./UI-DfwAVYB9.js";import{l as P,i as ie,d as ae,a as oe,p as re}from"./students-BbqeIjnE.js";import{r as M}from"./errors-C6OcbAl5.js";import{S as le}from"./SelectBox-CHixGp0g.js";import{b as $}from"./format-Do6vjlY3.js";import{v as de}from"./pagination-B12eDNVl.js";import{C as A}from"./ConfirmDialog-DPGaIXtR.js";function ce({children:t}){return e.jsx(J,{children:t})}i.div`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 12px;
`;function xe(){const[t,l]=o.useState(!0),[x,r]=o.useState(null),[p,m]=o.useState(0),[d,f]=o.useState(0),[c,b]=o.useState(0),[u,h]=o.useState(0);return o.useEffect(()=>{let g=!1;async function j(){l(!0),r(null);try{const[a,w,k,S]=await Promise.all([P({size:1}),P({status:"ENROLLED",size:1}),P({status:"ON_LEAVE",size:1}),P({status:"PENDING",size:1})]);g||(m(a.totalElements),f(w.totalElements),b(k.totalElements),h(S.totalElements))}catch(a){g||r(M(a,"요약 정보를 불러오지 못했습니다."))}finally{g||l(!1)}}return j(),()=>{g=!0}},[]),e.jsxs(he,{children:[e.jsxs(z,{children:[e.jsxs(N,{children:[e.jsx(D,{children:"총 원생 수"}),e.jsx(q,{"aria-hidden":!0,children:ue})]}),e.jsx(R,{children:t?"…":`${p}명`}),x&&e.jsx(pe,{children:x})]}),e.jsxs(z,{children:[e.jsxs(N,{children:[e.jsx(D,{children:"수강중"}),e.jsx(q,{"aria-hidden":!0,children:ge})]}),e.jsx(R,{children:t?"…":`${d}명`})]}),e.jsxs(z,{children:[e.jsxs(N,{children:[e.jsx(D,{children:"휴학"}),e.jsx(q,{"aria-hidden":!0,children:fe})]}),e.jsx(R,{children:t?"…":`${c}명`})]}),e.jsxs(z,{children:[e.jsxs(N,{children:[e.jsx(D,{children:"대기중"}),e.jsx(q,{"aria-hidden":!0,children:je})]}),e.jsx(R,{children:t?"…":`${u}명`})]})]})}const he=i.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
`,z=i.article`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`,N=i.div`
  display: flex; align-items: center; justify-content: space-between;
`,D=i.h4`
  margin: 0; font-size: 14px; color: #6b7280; font-weight: 600;
`,q=i.span`
  width: 34px; height: 34px; border-radius: 10px; display: grid; place-items: center; background: #eef2ff; color: #4f46e5;
`,R=i.div`
  font-size: 28px; font-weight: 800; color: #111827; letter-spacing: -0.02em;
`,pe=i.div`
  color: #b91c1c; font-size: 12px;
`,ue=e.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M20 21v-2a4 4 0 0 0-3-3.87"}),e.jsx("path",{d:"M4 21v-2a4 4 0 0 1 3-3.87"}),e.jsx("circle",{cx:"7",cy:"7",r:"4"}),e.jsx("circle",{cx:"17",cy:"7",r:"4"})]}),ge=e.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M22 10L12 4 2 10l10 6 10-6z"}),e.jsx("path",{d:"M6 12v5l6 3 6-3v-5"})]}),fe=e.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("rect",{x:"6",y:"4",width:"4",height:"16"}),e.jsx("rect",{x:"14",y:"4",width:"4",height:"16"})]}),je=e.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"12",cy:"12",r:"10"}),e.jsx("path",{d:"M12 6v6l3 3"})]});function me({value:t,onChange:l,onApply:x}){const r=t,[p,m]=o.useState(!1),[d,f]=o.useState(r.q),c=o.useRef(null),[b,u]=o.useState(!1);o.useEffect(()=>{f(r.q)},[r.q]);function h(a,w){l({...r,[a]:w})}function g(){l({status:"",from:"",to:"",ageMin:"",ageMax:"",q:""})}function j(){const a=(c.current?.value??d).trim();l({...r,q:a}),x?.()}return e.jsxs(be,{children:[e.jsxs(T,{children:[e.jsx(B,{children:"상태"}),e.jsx(le,{ariaLabel:"상태",value:r.status||"",onChange:a=>h("status",a),placeholder:"전체",options:[{label:"수강중",value:"ENROLLED"},{label:"휴학",value:"ON_LEAVE"},{label:"대기중",value:"PENDING"}]})]}),e.jsxs(T,{children:[e.jsx(B,{children:"등록일"}),e.jsxs(W,{children:[e.jsx(G,{type:"date",lang:"ko-KR","data-placeholder":"YYYY.MM.DD","data-has-value":!!r.from,value:r.from,onChange:a=>h("from",a.target.value)}),e.jsx(F,{children:"~"}),e.jsx(G,{type:"date",lang:"ko-KR","data-placeholder":"YYYY.MM.DD","data-has-value":!!r.to,value:r.to,onChange:a=>h("to",a.target.value)})]})]}),e.jsxs(T,{children:[e.jsx(B,{children:"나이"}),e.jsxs(W,{children:[e.jsx(O,{type:"number",placeholder:"12",value:r.ageMin,onChange:a=>h("ageMin",a.target.value)}),e.jsx(F,{children:"~"}),e.jsx(O,{type:"number",placeholder:"16",value:r.ageMax,onChange:a=>h("ageMax",a.target.value)})]})]}),e.jsxs(T,{children:[e.jsx(B,{children:"검색"}),e.jsxs(ve,{children:[e.jsx(we,{ref:c,placeholder:"학생명, 보호자, 연락처 등 검색",value:d,onChange:a=>f(a.target.value),onCompositionStart:()=>m(!0),onCompositionEnd:()=>{m(!1),b&&(u(!1),j())},onKeyDown:a=>{a.key==="Enter"&&(a.preventDefault(),p?u(!0):j())}}),e.jsx(ye,{type:"button",onClick:j,children:"검색"}),e.jsx(ke,{type:"button",onClick:g,children:"초기화"})]})]})]})}const be=i.div`
  display: grid; grid-template-columns: 0.6fr 1.2fr 1fr 2.7fr; gap: 12px; align-items: end;
  @media (max-width: 1080px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  @media (max-width: 720px) { grid-template-columns: 1fr; }
  /* Make filters sticky when scrolling under the header block */
  position: sticky;
  top: 64px; /* adjust if page header height differs */
  z-index: 37;
  background: #fff;
`,T=i.div`
  display: grid; gap: 8px; align-items: start;
`,B=i.span`
  color: #6b7280; font-size: 12px; font-weight: 700;
`,O=i.input`
  height: 36px; border: 1px solid #e5e7eb; border-radius: 10px; padding: 0 10px; width: 100%;
`,G=i.input`
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
`,W=i.div`
  display: grid; grid-template-columns: 1fr auto 1fr; gap: 6px; align-items: center;
`,F=i.span`
  color: #6b7280; font-size: 12px; text-align: center;
`,ve=i.div`
  display: grid; grid-template-columns: 1fr auto auto; gap: 8px; align-items: end;
`,we=i.input`
  height: 36px; border: 1px solid #e5e7eb; border-radius: 10px; padding: 0 12px; width: 100%;
`,ye=i.button`
  height: 40px; padding: 0 16px; border-radius: 10px; border: 1px solid #111827; background: #111827; color: #fff; font-weight: 700;
`,ke=i.button`
  height: 40px; padding: 0 16px; border-radius: 10px; border: 1px solid #e5e7eb; background: #fff; color: #111827; font-weight: 700;
`;function Se(t){return t==="ENROLLED"?"수강중":t==="ON_LEAVE"?"휴학":"대기중"}function Ee({filters:t,refreshKey:l}){const x=V(),[r]=K(),[p,m]=o.useState([]),[d,f]=o.useState(null),[c,b]=o.useState(()=>{const s=Number(r.get("page"));return Number.isFinite(s)&&s>=0?s:0}),[u,h]=o.useState(()=>{const s=Number(r.get("size"));return s===10||s===20||s===50?s:10}),[g,j]=o.useState(0),[a,w]=o.useState(0),[k,S]=o.useState(!1);o.useEffect(()=>{let s=!1;async function y(){f(null),S(!0);try{const n=await P({page:c,size:u,status:t.status||void 0,q:t.q||void 0,from:t.from||void 0,to:t.to||void 0,ageMin:t.ageMin?Number(t.ageMin):void 0,ageMax:t.ageMax?Number(t.ageMax):void 0});s||(m(n.content),j(n.totalPages),w(n.totalElements))}catch(n){s||f(M(n,"원생 불러오기에 실패했습니다."))}finally{s||S(!1)}}return y(),()=>{s=!0}},[c,u,t.status,t.q,t.from,t.to,t.ageMin,t.ageMax,l]),o.useEffect(()=>{b(0)},[t.status,t.q,t.from,t.to,t.ageMin,t.ageMax]);const L=o.useMemo(()=>p.map((s,y)=>{let n;if(s.birthDate){const E=Number(s.birthDate.split("-")[0]),U=new Date().getFullYear()-E+1;n=String(U)}else n=s.age!=null?String(s.age):"-";return{seq:Math.max(0,a-c*u-y),code:s.code,id:s.id,name:s.name,age:n,phone:$(s.phoneNumber),course:s.courses?.map(E=>E.title).join(", ")||"-",guardian:$(s.guardianPhone),status:Se(s.status),joinedAt:s.joinedDate||s.createdAt?.slice(0,10)||"-"}}),[p,c,u,a]);function C(s){s<0||s>=g||b(s)}return e.jsx(_,{children:e.jsxs(De,{children:[e.jsx(Me,{children:e.jsxs("div",{children:[e.jsx("strong",{children:"원생 목록"}),e.jsx(Le,{children:k?"불러오는 중...":`총 ${a}명의 원생이 조회되었습니다.`}),d&&e.jsx(Pe,{children:d})]})}),e.jsx(X,{children:e.jsxs(qe,{children:[e.jsxs("colgroup",{children:[e.jsx("col",{style:{width:"7%"}}),"       ",e.jsx("col",{style:{width:"16%"}}),"      ",e.jsx("col",{style:{width:"12%"}}),"      ",e.jsx("col",{style:{width:"7%"}}),"       ",e.jsx("col",{style:{width:"27%"}}),"      ",e.jsx("col",{style:{width:"10%"}}),"      ",e.jsx("col",{style:{width:"7%"}}),"       ",e.jsx("col",{style:{width:"14%"}}),"      "]}),e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"번호"}),e.jsx("th",{children:"이름"}),e.jsx("th",{children:"연락처"}),e.jsx("th",{children:"나이"}),e.jsx("th",{children:"수강수업"}),e.jsx("th",{children:"보호자 연락처"}),e.jsx("th",{children:"상태"}),e.jsx("th",{children:"등록일"})]})}),e.jsxs("tbody",{children:[k&&p.length===0&&Array.from({length:5}).map((s,y)=>e.jsx("tr",{children:e.jsx("td",{colSpan:8,children:e.jsx(Z,{h:14})})},`sk-${y}`)),!k&&L.length===0&&e.jsx("tr",{children:e.jsx("td",{colSpan:8,children:e.jsx(ee,{children:"조건에 맞는 결과가 없습니다."})})}),L.map(s=>e.jsxs("tr",{onClick:()=>x(`/students/${s.id}/courses`),"data-clickable":"true",children:[e.jsx("td",{children:s.seq}),e.jsx("td",{children:e.jsx(Re,{title:s.name,children:s.name})}),e.jsx("td",{children:s.phone||"-"}),e.jsx("td",{children:s.age}),e.jsx("td",{children:e.jsx(Te,{title:s.course||"-",children:s.course||"-"})}),e.jsx("td",{children:s.guardian||"-"}),e.jsx("td",{children:e.jsx(Ce,{type:s.status,children:s.status})}),e.jsx("td",{children:s.joinedAt})]},s.id))]})]})}),e.jsxs(ze,{children:[e.jsx(Y,{onClick:()=>C(c-1),disabled:c===0,children:"이전"}),de(c,g,7).map(s=>e.jsx(Y,{"data-active":s===c,onClick:()=>C(s),children:s+1},s)),e.jsx(Y,{onClick:()=>C(c+1),disabled:c>=g-1,children:"다음"}),e.jsxs(Ne,{children:[e.jsx("span",{children:"페이지당"}),e.jsxs("select",{value:u,onChange:s=>{const y=Number(s.target.value);b(0),h(y)},children:[e.jsx("option",{value:10,children:"10"}),e.jsx("option",{value:20,children:"20"}),e.jsx("option",{value:50,children:"50"})]})]})]})]})})}const Me=i.div`
  display: flex; align-items: center; justify-content: flex-start;
`,Le=i.div`
  color: #6b7280; font-size: 12px; margin-top: 4px;
`,Ce=i.span`
  padding: 2px 8px; border-radius: 9999px; font-size: 12px; font-weight: 800;
  ${({type:t})=>t==="수강중"?"background:#dcfce7; color:#16a34a;":t==="휴학"?"background:#fef3c7; color:#b45309;":"background:#f3e8ff; color:#7c3aed;"}
`,Pe=i.div`
  color: #b91c1c; font-size: 12px; margin-top: 4px;
`,ze=i.div`
  display: flex; gap: 6px; justify-content: center; padding-top: 4px;
`,Y=i.button`
  min-width: 28px; height: 28px; padding: 0 8px; border-radius: 8px; border: 1px solid #e5e7eb; background: #fff; font-size: 12px; color: #111827;
  &[data-active='true'] { background: #111827; color: #fff; border-color: #111827; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`,Ne=i.div`
  display: inline-flex; align-items: center; gap: 6px; margin-left: 12px; color: #6b7280; font-size: 12px;
  select { height: 28px; border: 1px solid #e5e7eb; border-radius: 8px; background: #fff; padding: 0 8px; }
`,De=i.div` position: relative; `,qe=i(te)`
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
`,Re=i.span`
  display: inline-block;
  max-width: 240px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`,Te=i.span`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  white-space: normal;
  line-height: 1.4;
  max-height: calc(1.4em * 2);
`;function at(){const{show:t,success:l,error:x}=Q(),[r,p]=K(),m=o.useMemo(()=>({status:"",from:"",to:"",ageMin:"",ageMax:"",q:"",...Ie(r)}),[]),[d,f]=o.useState(m),[c,b]=o.useState(0),[u,h]=o.useState(!1),[g,j]=o.useState(!1),[a,w]=o.useState(null),[k,S]=o.useState(null),L=o.useRef(null);o.useEffect(()=>{const n=Be(d);p(n,{replace:!0})},[d,p]);async function C(){try{const n=await ae({status:d.status||void 0,q:d.q||void 0,from:d.from||void 0,to:d.to||void 0,ageMin:d.ageMin?Number(d.ageMin):void 0,ageMax:d.ageMax?Number(d.ageMax):void 0});await H(n,"students.xlsx"),l("엑셀 추출이 완료되었습니다.")}catch(n){x(M(n,"엑셀 추출에 실패했습니다."))}}async function s(){try{const n=await oe();await H(n,"students_template.xlsx"),l("템플릿을 다운로드했습니다.")}catch(n){x(M(n,"템플릿 다운로드에 실패했습니다."))}}async function y(n){const v=n.target.files?.[0];if(v)try{const E=await re(v);S(v),w(E),j(!0)}catch(E){x(M(E,"미리보기 생성에 실패했습니다."))}finally{n.target.value=""}}return e.jsxs(ce,{children:[e.jsx(He,{children:e.jsxs(Ke,{children:[e.jsxs(_e,{children:[e.jsxs("div",{children:[e.jsx("h2",{children:"원생 관리"}),e.jsx("p",{children:"등록된 원생들을 한눈에 확인해보세요!"})]}),e.jsxs(We,{children:[e.jsx(se,{to:"/students/new",children:"원생 추가"}),e.jsxs(Fe,{children:[e.jsx(I,{as:"button",onClick:s,children:"템플릿 다운"}),e.jsx(I,{as:"button",onClick:C,children:"추출"}),e.jsx(I,{as:"button",onClick:()=>h(!0),children:"엑셀 업로드"})]}),e.jsx("input",{ref:L,type:"file",accept:".xlsx,.xls",style:{display:"none"},onChange:y})]})]}),e.jsx(xe,{}),e.jsx(Ue,{children:e.jsx(me,{value:d,onChange:f,onApply:()=>b(n=>n+1)})})]})}),e.jsx(Ee,{filters:d,refreshKey:c}),e.jsx(A,{open:u,title:"엑셀 업로드 안내",message:e.jsxs(Ve,{children:[e.jsx("li",{children:"템플릿 헤더 이름과 순서를 변경하지 말아주세요."}),e.jsx("li",{children:"필수 입력값: 이름 (빈 행은 자동으로 건너뜁니다)."}),e.jsx("li",{children:"상태는 수강중/휴학/대기 중 하나만 입력하거나 비워두면 수강중으로 처리돼요."}),e.jsx("li",{children:"등록일·생년월일은 YYYY-MM-DD 형식을 사용하거나 엑셀 날짜 서식을 적용해주세요."}),e.jsx("li",{children:"연락처와 보호자 연락처는 0으로 시작할 수 있으니 텍스트 서식을 권장합니다."}),e.jsx("li",{children:"보호자 성함·보호자 연락처·주소는 선택 항목이며 필요 시에만 입력하세요."}),e.jsx("li",{children:"기존 원생은 이름과 연락처로 찾아 업데이트합니다. 연락처가 없으면 신규로 추가될 수 있습니다."})]}),confirmLabel:"업로드 진행",cancelLabel:"취소",onCancel:()=>h(!1),onConfirm:()=>{h(!1),setTimeout(()=>L.current?.click(),0)}}),e.jsx(A,{open:g,title:"업로드 미리보기",message:a?e.jsxs(Ye,{children:[e.jsxs($e,{children:[e.jsxs("span",{children:["신규 ",a.created,"건"]}),e.jsxs("span",{children:["수정 ",a.updated,"건"]}),e.jsxs("span",{children:["건너뜀 ",a.skipped,"건"]})]}),a.errors&&a.errors.length>0&&e.jsxs(Ae,{children:[e.jsx("strong",{children:"유의사항"}),e.jsxs("ul",{children:[a.errors.slice(0,5).map((n,v)=>e.jsx("li",{children:n},v)),a.errors.length>5&&e.jsxs("li",{children:["외 ",a.errors.length-5,"건"]})]})]}),e.jsx(Oe,{children:e.jsxs("table",{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"행"}),e.jsx("th",{children:"이름"}),e.jsx("th",{children:"상태"}),e.jsx("th",{children:"등록일"}),e.jsx("th",{children:"생년월일"}),e.jsx("th",{children:"연락처"}),e.jsx("th",{children:"보호자"}),e.jsx("th",{children:"주소"}),e.jsx("th",{children:"유형"})]})}),e.jsx("tbody",{children:(a.rows||[]).slice(0,20).map((n,v)=>e.jsxs("tr",{children:[e.jsx("td",{children:n.row}),e.jsx("td",{children:n.name}),e.jsx("td",{children:n.status||""}),e.jsx("td",{children:n.joinedDate||""}),e.jsx("td",{children:n.birthDate||""}),e.jsx("td",{children:n.phoneNumber||""}),e.jsx("td",{children:n.guardianPhone||""}),e.jsx("td",{children:n.address||""}),e.jsx("td",{children:n.isNew?"신규":"수정"})]},v))})]})}),e.jsx(Ge,{children:"표시된 내용이 맞는지 확인 후 업로드를 진행하세요. 최대 20행까지만 미리보기로 표시됩니다."})]}):null,confirmLabel:"확인 및 업로드",cancelLabel:"취소",onCancel:()=>{j(!1),w(null),S(null)},maxWidth:720,onConfirm:async()=>{if(k)try{const n=await ie(k);t(`생성 ${n.created}, 수정 ${n.updated}, 건너뜀 ${n.skipped}`),b(v=>v+1)}catch(n){x(M(n,"엑셀 업로드에 실패했습니다."))}finally{j(!1),w(null),S(null)}}})]})}function Be(t){const l=new URLSearchParams;return t.status&&l.set("status",t.status),t.from&&l.set("from",t.from),t.to&&l.set("to",t.to),t.ageMin&&l.set("ageMin",t.ageMin),t.ageMax&&l.set("ageMax",t.ageMax),t.q&&t.q.trim()&&l.set("q",t.q.trim()),l}function Ie(t){const l=t.get("status"),x=l==="ENROLLED"||l==="ON_LEAVE"||l==="PENDING"?l:"",r=t.get("from")||"",p=t.get("to")||"",m=t.get("ageMin")||"",d=t.get("ageMax")||"",f=t.get("q")||"";return{status:x,from:r,to:p,ageMin:m,ageMax:d,q:f}}async function H(t,l){const x=URL.createObjectURL(t),r=document.createElement("a");r.href=x,r.download=l,document.body.appendChild(r),r.click(),r.remove(),URL.revokeObjectURL(x)}const Ye=i.div`
  display: grid; gap: 10px;
`,$e=i.div`
  display: flex; gap: 10px; color: #374151; font-size: 13px; font-weight: 700;
  span { background: #f3f4f6; padding: 6px 8px; border-radius: 8px; }
`,Ae=i.div`
  background: #fff7ed; color: #9a3412; border: 1px solid #fdba74; padding: 8px 10px; border-radius: 10px; font-size: 12px;
  ul { margin: 6px 0 0 16px; }
`,Oe=i.div`
  max-height: 50vh; overflow: auto; border: 1px solid #e5e7eb; border-radius: 10px;
  table { width: 100%; border-collapse: collapse; font-size: 12px; }
  th, td { padding: 8px 10px; border-bottom: 1px solid #f1f5f9; text-align: left; white-space: nowrap; }
  thead th { position: sticky; top: 0; background: #f9fafb; z-index: 1; }
`,Ge=i.div`
  color: #6b7280; font-size: 12px;
`,We=i.div`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`,Fe=i.div`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  @media (max-width: 768px) {
    display: none;
  }
`,He=i.div`
  position: sticky;
  top: 0;
  z-index: 35; /* above table headers */
  background: ${({theme:t})=>t.colors.surface};
  /* remove bottom divider under sticky filter area */
  border-bottom: 0;
`,Ke=i.div`
  display: grid;
  gap: 12px;
  padding: 8px 0 0;
`,_e=i(ne)`
  position: static;
  margin-bottom: 0;
  box-shadow: none;
`,Ue=i(_)`
  overflow: visible;
  position: relative;
  z-index: 36;
`,Ve=i.ul`
  margin: 0;
  padding-left: 18px;
  display: grid;
  gap: 6px;
  font-size: 14px;
  color: #374151;
  li { list-style: disc; }
`;export{at as default};
