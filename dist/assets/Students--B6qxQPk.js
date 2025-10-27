import{j as e,d as i,r as d,u as U,g as K,c as V}from"./index-B0K7mn4q.js";import{P as Q,S as _,g as J,h as X,E as Z,T as ee,a as te,G as I,b as ne}from"./UI-Cj3YhchZ.js";import{l as N,i as se,d as ie,a as re,p as ae}from"./students-BeT2wLPO.js";import{r as M}from"./errors-C6OcbAl5.js";import{S as oe}from"./SelectBox-DLApmcHT.js";import{u as de}from"./useQuery-zjDKxKyb.js";import{a as B}from"./format-DW-Kl_C3.js";import{v as le}from"./pagination-B12eDNVl.js";import{C as Y}from"./ConfirmDialog-ClQeXE4D.js";function ce({children:t}){return e.jsx(Q,{children:t})}i.div`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 12px;
`;function he(){const[t,s]=d.useState(!0),[x,a]=d.useState(null),[h,l]=d.useState(0),[u,j]=d.useState(0),[m,w]=d.useState(0),[p,g]=d.useState(0);return d.useEffect(()=>{let f=!1;async function c(){s(!0),a(null);try{const[o,v,y,k]=await Promise.all([N({size:1}),N({status:"ENROLLED",size:1}),N({status:"ON_LEAVE",size:1}),N({status:"PENDING",size:1})]);f||(l(o.totalElements),j(v.totalElements),w(y.totalElements),g(k.totalElements))}catch(o){f||a(M(o,"요약 정보를 불러오지 못했습니다."))}finally{f||s(!1)}}return c(),()=>{f=!0}},[]),e.jsxs(xe,{children:[e.jsxs(C,{children:[e.jsxs(L,{children:[e.jsx(D,{children:"총 원생 수"}),e.jsx(z,{"aria-hidden":!0,children:ue})]}),e.jsx(q,{children:t?"…":`${h}명`}),x&&e.jsx(pe,{children:x})]}),e.jsxs(C,{children:[e.jsxs(L,{children:[e.jsx(D,{children:"수강중"}),e.jsx(z,{"aria-hidden":!0,children:ge})]}),e.jsx(q,{children:t?"…":`${u}명`})]}),e.jsxs(C,{children:[e.jsxs(L,{children:[e.jsx(D,{children:"휴학"}),e.jsx(z,{"aria-hidden":!0,children:fe})]}),e.jsx(q,{children:t?"…":`${m}명`})]}),e.jsxs(C,{children:[e.jsxs(L,{children:[e.jsx(D,{children:"대기중"}),e.jsx(z,{"aria-hidden":!0,children:je})]}),e.jsx(q,{children:t?"…":`${p}명`})]})]})}const xe=i.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
`,C=i.article`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`,L=i.div`
  display: flex; align-items: center; justify-content: space-between;
`,D=i.h4`
  margin: 0; font-size: 14px; color: #6b7280; font-weight: 600;
`,z=i.span`
  width: 34px; height: 34px; border-radius: 10px; display: grid; place-items: center; background: #eef2ff; color: #4f46e5;
`,q=i.div`
  font-size: 28px; font-weight: 800; color: #111827; letter-spacing: -0.02em;
`,pe=i.div`
  color: #b91c1c; font-size: 12px;
`,ue=e.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M20 21v-2a4 4 0 0 0-3-3.87"}),e.jsx("path",{d:"M4 21v-2a4 4 0 0 1 3-3.87"}),e.jsx("circle",{cx:"7",cy:"7",r:"4"}),e.jsx("circle",{cx:"17",cy:"7",r:"4"})]}),ge=e.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M22 10L12 4 2 10l10 6 10-6z"}),e.jsx("path",{d:"M6 12v5l6 3 6-3v-5"})]}),fe=e.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("rect",{x:"6",y:"4",width:"4",height:"16"}),e.jsx("rect",{x:"14",y:"4",width:"4",height:"16"})]}),je=e.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"12",cy:"12",r:"10"}),e.jsx("path",{d:"M12 6v6l3 3"})]});function me({value:t,onChange:s,onApply:x}){const a=t,[h,l]=d.useState(!1),[u,j]=d.useState(a.q),m=d.useRef(null),[w,p]=d.useState(!1);d.useEffect(()=>{j(a.q)},[a.q]);function g(o,v){s({...a,[o]:v})}function f(){s({status:"",from:"",to:"",ageMin:"",ageMax:"",q:""})}function c(){const o=(m.current?.value??u).trim();s({...a,q:o}),x?.()}return e.jsxs(be,{children:[e.jsxs(R,{children:[e.jsx(T,{children:"상태"}),e.jsx(oe,{ariaLabel:"상태",value:a.status||"",onChange:o=>g("status",o),placeholder:"전체",options:[{label:"수강중",value:"ENROLLED"},{label:"휴학",value:"ON_LEAVE"},{label:"대기중",value:"PENDING"}]})]}),e.jsxs(R,{children:[e.jsx(T,{children:"등록일"}),e.jsxs(F,{children:[e.jsx($,{type:"date",lang:"ko-KR","data-placeholder":"YYYY.MM.DD","data-has-value":!!a.from,value:a.from,onChange:o=>g("from",o.target.value)}),e.jsx(W,{children:"~"}),e.jsx($,{type:"date",lang:"ko-KR","data-placeholder":"YYYY.MM.DD","data-has-value":!!a.to,value:a.to,onChange:o=>g("to",o.target.value)})]})]}),e.jsxs(R,{children:[e.jsx(T,{children:"나이"}),e.jsxs(F,{children:[e.jsx(O,{type:"number",placeholder:"12",value:a.ageMin,onChange:o=>g("ageMin",o.target.value)}),e.jsx(W,{children:"~"}),e.jsx(O,{type:"number",placeholder:"16",value:a.ageMax,onChange:o=>g("ageMax",o.target.value)})]})]}),e.jsxs(R,{children:[e.jsx(T,{children:"검색"}),e.jsxs(ve,{children:[e.jsx(ye,{ref:m,placeholder:"학생명, 보호자, 연락처 등 검색",value:u,onChange:o=>j(o.target.value),onCompositionStart:()=>l(!0),onCompositionEnd:()=>{l(!1),w&&(p(!1),c())},onKeyDown:o=>{o.key==="Enter"&&(o.preventDefault(),h?p(!0):c())}}),e.jsx(we,{type:"button",onClick:c,children:"검색"}),e.jsx(ke,{type:"button",onClick:f,children:"초기화"})]})]})]})}const be=i.div`
  display: grid; grid-template-columns: 0.6fr 1.2fr 1fr 2.7fr; gap: 12px; align-items: end;
  @media (max-width: 1080px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  @media (max-width: 720px) { grid-template-columns: 1fr; }
  /* Make filters sticky when scrolling under the header block */
  position: sticky;
  top: 64px; /* adjust if page header height differs */
  z-index: 37;
  background: #fff;
`,R=i.div`
  display: grid; gap: 8px; align-items: start;
`,T=i.span`
  color: #6b7280; font-size: 12px; font-weight: 700;
`,O=i.input`
  height: 36px; border: 1px solid #e5e7eb; border-radius: 10px; padding: 0 10px; width: 100%;
`,$=i.input`
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
`,F=i.div`
  display: grid; grid-template-columns: 1fr auto 1fr; gap: 6px; align-items: center;
`,W=i.span`
  color: #6b7280; font-size: 12px; text-align: center;
`,ve=i.div`
  display: grid; grid-template-columns: 1fr auto auto; gap: 8px; align-items: end;
`,ye=i.input`
  height: 36px; border: 1px solid #e5e7eb; border-radius: 10px; padding: 0 12px; width: 100%;
`,we=i.button`
  height: 40px; padding: 0 16px; border-radius: 10px; border: 1px solid #111827; background: #111827; color: #fff; font-weight: 700;
`,ke=i.button`
  height: 40px; padding: 0 16px; border-radius: 10px; border: 1px solid #e5e7eb; background: #fff; color: #111827; font-weight: 700;
`;function Se(t){return t==="ENROLLED"?"수강중":t==="ON_LEAVE"?"휴학":"대기중"}const Ee=[];function Me({filters:t,refreshKey:s}){const x=U(),[a]=K(),[h,l]=d.useState(()=>{const n=Number(a.get("page"));return Number.isFinite(n)&&n>=0?n:0}),[u,j]=d.useState(()=>{const n=Number(a.get("size"));return n===10||n===20||n===50?n:10}),m=(t.q??"").trim(),w=s??0,p=de({queryKey:["students",h,u,t.status??"",m,t.from??"",t.to??"",t.ageMin??"",t.ageMax??"",w],queryFn:()=>N({page:h,size:u,status:t.status||void 0,q:m||void 0,from:t.from||void 0,to:t.to||void 0,ageMin:t.ageMin?Number(t.ageMin):void 0,ageMax:t.ageMax?Number(t.ageMax):void 0}),placeholderData:n=>n,staleTime:3e4,gcTime:300*1e3,retry:1}),g=p.data?.content??Ee,f=p.data?.totalPages??0,c=p.data?.totalElements??0,o=p.isPending&&g.length===0,v=p.isFetching,y=p.error?M(p.error,"원생 불러오기에 실패했습니다."):null;d.useEffect(()=>{l(0)},[t.status,t.q,t.from,t.to,t.ageMin,t.ageMax]);const k=d.useMemo(()=>g.map((n,S)=>{let r;if(n.birthDate){const E=Number(n.birthDate.split("-")[0]),H=new Date().getFullYear()-E+1;r=String(H)}else r=n.age!=null?String(n.age):"-";return{seq:Math.max(0,c-h*u-S),code:n.code,id:n.id,name:n.name,age:r,phone:B(n.phoneNumber),course:n.courses?.map(E=>E.title).join(", ")||"-",guardian:B(n.guardianPhone),status:Se(n.status),joinedAt:n.joinedDate||n.createdAt?.slice(0,10)||"-"}}),[g,h,u,c]);function P(n){n<0||n>=f||l(n)}return e.jsx(_,{children:e.jsxs(qe,{children:[e.jsx(Pe,{children:e.jsxs("div",{children:[e.jsx("strong",{children:"원생 목록"}),e.jsx(Ne,{children:o||v?"불러오는 중...":`총 ${c}명의 원생이 조회되었습니다.`}),y&&e.jsx(Le,{children:y})]})}),e.jsx(J,{children:e.jsxs(Re,{children:[e.jsxs("colgroup",{children:[e.jsx("col",{style:{width:"7%"}}),"       ",e.jsx("col",{style:{width:"16%"}}),"      ",e.jsx("col",{style:{width:"12%"}}),"      ",e.jsx("col",{style:{width:"7%"}}),"       ",e.jsx("col",{style:{width:"27%"}}),"      ",e.jsx("col",{style:{width:"10%"}}),"      ",e.jsx("col",{style:{width:"7%"}}),"       ",e.jsx("col",{style:{width:"14%"}}),"      "]}),e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"번호"}),e.jsx("th",{children:"이름"}),e.jsx("th",{children:"연락처"}),e.jsx("th",{children:"나이"}),e.jsx("th",{children:"수강수업"}),e.jsx("th",{children:"보호자 연락처"}),e.jsx("th",{children:"상태"}),e.jsx("th",{children:"등록일"})]})}),e.jsxs("tbody",{children:[o&&g.length===0&&Array.from({length:5}).map((n,S)=>e.jsx("tr",{children:e.jsx("td",{colSpan:8,children:e.jsx(X,{h:14})})},`sk-${S}`)),!o&&k.length===0&&e.jsx("tr",{children:e.jsx("td",{colSpan:8,children:e.jsx(Z,{children:"조건에 맞는 결과가 없습니다."})})}),k.map(n=>e.jsxs("tr",{onClick:()=>x(`/students/${n.id}/courses`),"data-clickable":"true",children:[e.jsx("td",{children:n.seq}),e.jsx("td",{children:e.jsx(Te,{title:n.name,children:n.name})}),e.jsx("td",{children:n.phone||"-"}),e.jsx("td",{children:n.age}),e.jsx("td",{children:e.jsx(Ie,{title:n.course||"-",children:n.course||"-"})}),e.jsx("td",{children:n.guardian||"-"}),e.jsx("td",{children:e.jsx(Ce,{type:n.status,children:n.status})}),e.jsx("td",{children:n.joinedAt})]},n.id))]})]})}),e.jsxs(De,{children:[e.jsx(A,{onClick:()=>P(h-1),disabled:h===0,children:"이전"}),le(h,f,7).map(n=>e.jsx(A,{"data-active":n===h,onClick:()=>P(n),children:n+1},n)),e.jsx(A,{onClick:()=>P(h+1),disabled:h>=f-1,children:"다음"}),e.jsxs(ze,{children:[e.jsx("span",{children:"페이지당"}),e.jsxs("select",{value:u,onChange:n=>{const S=Number(n.target.value);l(0),j(S)},children:[e.jsx("option",{value:10,children:"10"}),e.jsx("option",{value:20,children:"20"}),e.jsx("option",{value:50,children:"50"})]})]})]})]})})}const Pe=i.div`
  display: flex; align-items: center; justify-content: flex-start;
`,Ne=i.div`
  color: #6b7280; font-size: 12px; margin-top: 4px;
`,Ce=i.span`
  padding: 2px 8px; border-radius: 9999px; font-size: 12px; font-weight: 800;
  ${({type:t})=>t==="수강중"?"background:#dcfce7; color:#16a34a;":t==="휴학"?"background:#fef3c7; color:#b45309;":"background:#f3e8ff; color:#7c3aed;"}
`,Le=i.div`
  color: #b91c1c; font-size: 12px; margin-top: 4px;
`,De=i.div`
  display: flex; gap: 6px; justify-content: center; padding-top: 4px;
`,A=i.button`
  min-width: 28px; height: 28px; padding: 0 8px; border-radius: 8px; border: 1px solid #e5e7eb; background: #fff; font-size: 12px; color: #111827;
  &[data-active='true'] { background: #111827; color: #fff; border-color: #111827; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`,ze=i.div`
  display: inline-flex; align-items: center; gap: 6px; margin-left: 12px; color: #6b7280; font-size: 12px;
  select { height: 28px; border: 1px solid #e5e7eb; border-radius: 8px; background: #fff; padding: 0 8px; }
`,qe=i.div` position: relative; `,Re=i(ee)`
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
`,Te=i.span`
  display: inline-block;
  max-width: 240px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`,Ie=i.span`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  white-space: normal;
  line-height: 1.4;
  max-height: calc(1.4em * 2);
`;function Ae(t){if(!t||typeof t!="object")return{};const s=t;return{row:typeof s.row=="number"?s.row:void 0,name:typeof s.name=="string"?s.name:void 0,status:typeof s.status=="string"?s.status:void 0,joinedDate:typeof s.joinedDate=="string"?s.joinedDate:void 0,birthDate:typeof s.birthDate=="string"?s.birthDate:void 0,phoneNumber:typeof s.phoneNumber=="string"?s.phoneNumber:void 0,guardianPhone:typeof s.guardianPhone=="string"?s.guardianPhone:void 0,address:typeof s.address=="string"?s.address:void 0,isNew:typeof s.isNew=="boolean"?s.isNew:void 0}}function Be(t){const s=Array.isArray(t.rows)?t.rows.map(a=>Ae(a)):[],x=Array.isArray(t.errors)?t.errors.map(a=>String(a)):[];return{created:typeof t.created=="number"?t.created:Number(t.created)||0,updated:typeof t.updated=="number"?t.updated:Number(t.updated)||0,skipped:typeof t.skipped=="number"?t.skipped:Number(t.skipped)||0,errors:x,rows:s}}function lt(){const{show:t,success:s,error:x}=V(),[a,h]=K(),[l,u]=d.useState(()=>({status:"",from:"",to:"",ageMin:"",ageMax:"",q:"",...Oe(a)})),[j,m]=d.useState(0),[w,p]=d.useState(!1),[g,f]=d.useState(!1),[c,o]=d.useState(null),[v,y]=d.useState(null),k=d.useRef(null);d.useEffect(()=>{const r=Ye(l);h(r,{replace:!0})},[l,h]);async function P(){try{const r=await ie({status:l.status||void 0,q:l.q||void 0,from:l.from||void 0,to:l.to||void 0,ageMin:l.ageMin?Number(l.ageMin):void 0,ageMax:l.ageMax?Number(l.ageMax):void 0});await G(r,"students.xlsx"),s("엑셀 추출이 완료되었습니다.")}catch(r){x(M(r,"엑셀 추출에 실패했습니다."))}}async function n(){try{const r=await re();await G(r,"students_template.xlsx"),s("템플릿을 다운로드했습니다.")}catch(r){x(M(r,"템플릿 다운로드에 실패했습니다."))}}async function S(r){const b=r.target.files?.[0];if(b)try{const E=await ae(b);y(b),o(Be(E)),f(!0)}catch(E){x(M(E,"미리보기 생성에 실패했습니다."))}finally{r.target.value=""}}return e.jsxs(ce,{children:[e.jsx(Ue,{children:e.jsxs(Ve,{children:[e.jsxs(Qe,{children:[e.jsxs("div",{children:[e.jsx("h2",{children:"원생 관리"}),e.jsx("p",{children:"등록된 원생들을 한눈에 확인해보세요!"})]}),e.jsxs(_e,{children:[e.jsx(te,{to:"/students/new",children:"원생 추가"}),e.jsxs(He,{children:[e.jsx(I,{as:"button",onClick:n,children:"템플릿 다운"}),e.jsx(I,{as:"button",onClick:P,children:"추출"}),e.jsx(I,{as:"button",onClick:()=>p(!0),children:"엑셀 업로드"})]}),e.jsx("input",{ref:k,type:"file",accept:".xlsx,.xls",style:{display:"none"},onChange:S})]})]}),e.jsx(he,{}),e.jsx(Je,{children:e.jsx(me,{value:l,onChange:u,onApply:()=>m(r=>r+1)})})]})}),e.jsx(Me,{filters:l,refreshKey:j}),e.jsx(Y,{open:w,title:"엑셀 업로드 안내",message:e.jsxs(Xe,{children:[e.jsx("li",{children:"템플릿 헤더 이름과 순서를 변경하지 말아주세요."}),e.jsx("li",{children:"필수 입력값: 이름 (빈 행은 자동으로 건너뜁니다)."}),e.jsx("li",{children:"상태는 수강중/휴학/대기 중 하나만 입력하거나 비워두면 수강중으로 처리돼요."}),e.jsx("li",{children:"등록일·생년월일은 YYYY-MM-DD 형식을 사용하거나 엑셀 날짜 서식을 적용해주세요."}),e.jsx("li",{children:"연락처와 보호자 연락처는 0으로 시작할 수 있으니 텍스트 서식을 권장합니다."}),e.jsx("li",{children:"보호자 성함·보호자 연락처·주소는 선택 항목이며 필요 시에만 입력하세요."}),e.jsx("li",{children:"기존 원생은 이름과 연락처로 찾아 업데이트합니다. 연락처가 없으면 신규로 추가될 수 있습니다."})]}),confirmLabel:"업로드 진행",cancelLabel:"취소",onCancel:()=>p(!1),onConfirm:()=>{p(!1),setTimeout(()=>k.current?.click(),0)}}),e.jsx(Y,{open:g,title:"업로드 미리보기",message:c?e.jsxs($e,{children:[e.jsxs(Fe,{children:[e.jsxs("span",{children:["신규 ",c.created,"건"]}),e.jsxs("span",{children:["수정 ",c.updated,"건"]}),e.jsxs("span",{children:["건너뜀 ",c.skipped,"건"]})]}),c.errors&&c.errors.length>0&&e.jsxs(We,{children:[e.jsx("strong",{children:"유의사항"}),e.jsxs("ul",{children:[c.errors.slice(0,5).map((r,b)=>e.jsx("li",{children:r},b)),c.errors.length>5&&e.jsxs("li",{children:["외 ",c.errors.length-5,"건"]})]})]}),e.jsx(Ge,{children:e.jsxs("table",{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"행"}),e.jsx("th",{children:"이름"}),e.jsx("th",{children:"상태"}),e.jsx("th",{children:"등록일"}),e.jsx("th",{children:"생년월일"}),e.jsx("th",{children:"연락처"}),e.jsx("th",{children:"보호자"}),e.jsx("th",{children:"주소"}),e.jsx("th",{children:"유형"})]})}),e.jsx("tbody",{children:(c.rows||[]).slice(0,20).map((r,b)=>e.jsxs("tr",{children:[e.jsx("td",{children:r.row}),e.jsx("td",{children:r.name}),e.jsx("td",{children:r.status||""}),e.jsx("td",{children:r.joinedDate||""}),e.jsx("td",{children:r.birthDate||""}),e.jsx("td",{children:r.phoneNumber||""}),e.jsx("td",{children:r.guardianPhone||""}),e.jsx("td",{children:r.address||""}),e.jsx("td",{children:r.isNew?"신규":"수정"})]},b))})]})}),e.jsx(Ke,{children:"표시된 내용이 맞는지 확인 후 업로드를 진행하세요. 최대 20행까지만 미리보기로 표시됩니다."})]}):null,confirmLabel:"확인 및 업로드",cancelLabel:"취소",onCancel:()=>{f(!1),o(null),y(null)},maxWidth:720,onConfirm:async()=>{if(v)try{const r=await se(v);t(`생성 ${r.created}, 수정 ${r.updated}, 건너뜀 ${r.skipped}`),m(b=>b+1)}catch(r){x(M(r,"엑셀 업로드에 실패했습니다."))}finally{f(!1),o(null),y(null)}}})]})}function Ye(t){const s=new URLSearchParams;return t.status&&s.set("status",t.status),t.from&&s.set("from",t.from),t.to&&s.set("to",t.to),t.ageMin&&s.set("ageMin",t.ageMin),t.ageMax&&s.set("ageMax",t.ageMax),t.q&&t.q.trim()&&s.set("q",t.q.trim()),s}function Oe(t){const s=t.get("status"),x=s==="ENROLLED"||s==="ON_LEAVE"||s==="PENDING"?s:"",a=t.get("from")||"",h=t.get("to")||"",l=t.get("ageMin")||"",u=t.get("ageMax")||"",j=t.get("q")||"";return{status:x,from:a,to:h,ageMin:l,ageMax:u,q:j}}async function G(t,s){const x=URL.createObjectURL(t),a=document.createElement("a");a.href=x,a.download=s,document.body.appendChild(a),a.click(),a.remove(),URL.revokeObjectURL(x)}const $e=i.div`
  display: grid;
  gap: 10px;
`,Fe=i.div`
  display: flex;
  gap: 10px;
  color: #374151;
  font-size: 13px;
  font-weight: 700;
  span {
    background: #f3f4f6;
    padding: 6px 8px;
    border-radius: 8px;
  }
`,We=i.div`
  background: #fff7ed;
  color: #9a3412;
  border: 1px solid #fdba74;
  padding: 8px 10px;
  border-radius: 10px;
  font-size: 12px;
  ul {
    margin: 6px 0 0 16px;
  }
`,Ge=i.div`
  max-height: 50vh;
  overflow: auto;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
  }
  th,
  td {
    padding: 8px 10px;
    border-bottom: 1px solid #f1f5f9;
    text-align: left;
    white-space: nowrap;
  }
  thead th {
    position: sticky;
    top: 0;
    background: #f9fafb;
    z-index: 1;
  }
`,Ke=i.div`
  color: #6b7280;
  font-size: 12px;
`,_e=i.div`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`,He=i.div`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  @media (max-width: 768px) {
    display: none;
  }
`,Ue=i.div`
  position: sticky;
  top: 0;
  z-index: 35; /* above table headers */
  background: ${({theme:t})=>t.colors.surface};
  /* remove bottom divider under sticky filter area */
  border-bottom: 0;
`,Ve=i.div`
  display: grid;
  gap: 12px;
  padding: 8px 0 0;
`,Qe=i(ne)`
  position: static;
  margin-bottom: 0;
  box-shadow: none;
`,Je=i(_)`
  overflow: visible;
  position: relative;
  z-index: 36;
`,Xe=i.ul`
  margin: 0;
  padding-left: 18px;
  display: grid;
  gap: 6px;
  font-size: 14px;
  color: #374151;
  li {
    list-style: disc;
  }
`;export{lt as default};
