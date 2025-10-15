import{j as e,d as n,u as ct,a as ft,r as s,b as pt}from"./index-CyW3XeFu.js";import{S as q,i as J,f as ze,j as ce,T as xe,a as _e,G as pe,k as ue,c as he,l as Ie}from"./UI-evna17pR.js";import{C as ut}from"./ConfirmDialog-Ba2sBuvj.js";import{d as xt,g as ht,b as gt,e as mt,f as Fe,h as bt}from"./courses-D3Jx7eTn.js";import{b as yt,c as jt}from"./format-Do6vjlY3.js";import{l as vt}from"./students-9Fwn5gCF.js";import{K as fe,U as wt,C as Et,a as St}from"./KPI-Cy3mP5AU.js";import{M as kt,l as Ct,u as Lt,c as Dt,d as $t}from"./exams-D9_Tjv2Z.js";import{u as Mt}from"./useConfirmDialog-BAuS9Lmd.js";function Tt({exams:i,loading:c,error:r,onCreate:b,onEdit:m,onDelete:T,modalOpen:P,modalMode:u,examMode:F,examFormError:N,examSaving:R,onCloseModal:z,onSubmitModal:I,onExamModeChange:D,examTitleRef:o,onExamTitleChange:$}){return e.jsxs(q,{children:[e.jsxs(It,{children:[e.jsxs("div",{children:[e.jsx(J,{style:{margin:0},children:"시험 관리"}),e.jsx(Ae,{children:"수업과 연결된 시험을 확인하고 추가합니다."})]}),e.jsx(ze,{type:"button",onClick:b,children:"시험 생성"})]}),c&&e.jsx(Ae,{children:"시험을 불러오는 중..."}),r&&e.jsx(Oe,{children:r}),i.length===0?e.jsx(Ot,{children:e.jsx("p",{children:"아직 등록된 시험이 없습니다."})}):e.jsx(Ft,{children:e.jsxs(At,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"시험명"}),e.jsx("th",{children:"형태"}),e.jsx("th",{children:"평균"}),e.jsxs("th",{className:"manage",children:[e.jsx("div",{className:"manage-header","aria-hidden":"true",children:e.jsx("span",{className:"manage-label",children:"관리"})}),e.jsx("span",{className:"sr-only",children:"관리"})]})]})}),e.jsx("tbody",{children:i.map(y=>e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx(Pt,{children:e.jsx("span",{className:"name",children:y.title})})}),e.jsx("td",{children:Nt(y.inputMode)}),e.jsx("td",{children:Rt(y)}),e.jsx("td",{className:"manage",children:e.jsxs("div",{className:"actions",children:[e.jsx(ce,{type:"button","data-variant":"edit",onClick:()=>m(y),children:"수정"}),e.jsx(ce,{type:"button","data-variant":"danger",onClick:()=>T(y),children:"삭제"})]})})]},y.id))})]})}),e.jsx(kt,{open:P,title:u==="edit"?"시험 수정":"시험 추가",onClose:z,footer:e.jsxs("div",{style:{display:"inline-flex",gap:8},children:[e.jsx(ce,{type:"button",onClick:z,children:"취소"}),e.jsx(ze,{type:"button",onClick:I,disabled:R,children:R?"저장 중…":u==="edit"?"수정":"등록"})]}),children:e.jsxs(Bt,{children:[N&&e.jsx(Oe,{children:N}),e.jsx(Pe,{htmlFor:"exam-title",children:"시험 제목"}),e.jsx(Ut,{id:"exam-title",ref:o,placeholder:"예: 중간고사 수학",onChange:y=>$(y.currentTarget.value)}),e.jsx(Pe,{children:"입력 방식"}),e.jsxs("div",{style:{display:"inline-flex",gap:12},children:[e.jsxs("label",{style:{display:"inline-flex",alignItems:"center",gap:6,cursor:"pointer"},children:[e.jsx("input",{type:"radio",name:"examMode",checked:F==="percent",onChange:()=>D("percent")}),e.jsx("span",{children:"백분율"})]}),e.jsxs("label",{style:{display:"inline-flex",alignItems:"center",gap:6,cursor:"pointer"},children:[e.jsx("input",{type:"radio",name:"examMode",checked:F==="letter",onChange:()=>D("letter")}),e.jsx("span",{children:"등급"})]})]})]})})]})}function Nt(i){switch(i){case"percent":return"백분율";case"letter":return"등급";default:return"백분율"}}function Rt(i){if(i.averageScore==null)return"—";if(i.inputMode==="letter")return zt(i.averageScore);const c=Math.round(i.averageScore*10)/10;return`${Number.isInteger(c)?String(c):c.toFixed(1)}점`}function zt(i){const c=Math.round(i);return c>=90?"A":c>=80?"B":c>=70?"C":c>=60?"D":c>=50?"E":"F"}const It=n.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`,Ae=n.div`
  color: #6b7280;
  font-size: 12px;
`,Oe=n.div`
  color: #b91c1c;
  background: #fee2e2;
  border: 1px solid #fecaca;
  padding: 8px 10px;
  border-radius: 8px;
  font-size: 13px;
`,Ft=n.div`
  overflow: auto;
`,At=n(xe)`
  width: 100%;
  thead th, tbody td { vertical-align: middle; }
  thead th:first-child, tbody td:first-child { text-align: left; width: 40%; }
  thead th:nth-child(2), tbody td:nth-child(2), thead th:nth-child(3), tbody td:nth-child(3) { width: 20%; text-align: center; }
  thead th.manage, tbody td.manage { width: 160px; text-align: right; white-space: nowrap; }
  thead th.manage { position: relative; }
  thead th.manage .sr-only { position: absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0; }
  thead th.manage .manage-header { display:inline-flex; align-items:center; justify-content:flex-end; gap:6px; width:100%; font-size:12px; color:#94a3b8; }
  thead th.manage .manage-label { color:#1f2937; font-weight:600; }
  tbody td.manage .actions { display:inline-flex; gap:6px; justify-content:flex-end; flex-wrap:nowrap; }
`,Ot=n.div`
  display: grid; gap: 12px; padding: 24px; border: 1px dashed #e2e8f0; border-radius: 12px; background: #f8fafc; text-align: center;
  p { margin: 0; color: #475569; font-size: 14px; font-weight: 600; }
`,Pt=n.div`
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  .name { font-weight: 700; color: #1f2937; }
`,Bt=n.div`
  display: grid; gap: 10px;
`,Pe=n.label`
  color: #6b7280; font-size: 12px; font-weight: 700;
`,Ut=n.input`
  height: 40px; border: 1px solid #e5e7eb; border-radius: 10px; padding: 0 12px; font-size: 14px; color: #111827; width: 100%;
`;function Gt({students:i,loading:c,error:r,editHref:b}){return e.jsxs(q,{children:[e.jsxs(_t,{children:[e.jsxs("div",{children:[e.jsx(J,{style:{margin:0},children:"수강생 목록"}),e.jsxs(Be,{children:["총 ",i.length,"명의 학생이 수강중입니다."]})]}),e.jsx(_e,{to:b,children:"학생 추가"})]}),c&&e.jsx(Be,{children:"불러오는 중..."}),r&&e.jsx(Yt,{children:r}),e.jsx(Vt,{children:e.jsxs(Wt,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"학생명"}),e.jsx("th",{children:"연락처"}),e.jsx("th",{children:"등록일"}),e.jsx("th",{children:"상태"})]})}),e.jsx("tbody",{children:i.length===0&&!c?e.jsx("tr",{children:e.jsx("td",{colSpan:4,style:{color:"#6b7280"},children:"등록된 학생이 없습니다."})}):i.map(m=>e.jsxs("tr",{children:[e.jsxs("td",{children:[e.jsx("strong",{children:m.name}),e.jsx(Kt,{children:m.code})]}),e.jsx("td",{children:yt(m.phoneNumber)}),e.jsx("td",{children:m.joinedDate||"-"}),e.jsx("td",{children:e.jsx(qt,{"data-type":m.status,children:Ht(m.status)})})]},m.id))})]})})]})}function Ht(i){switch(i){case"ENROLLED":return"수강중";case"ON_LEAVE":return"휴학";case"PENDING":return"대기";default:return i}}const _t=n.div`
  display: flex; align-items: center; justify-content: space-between;
`,Be=n.div`
  color: #6b7280; font-size: 12px;
`,Yt=n.div`
  color: #b91c1c; background: #fee2e2; border: 1px solid #fecaca; padding: 8px 10px; border-radius: 8px; font-size: 13px;
`,Vt=n.div` overflow: auto; `,Wt=n(xe)`
  thead th { background:#f9fafb; }
  tbody tr:nth-child(even) td { background:#fcfcfd; }
  tbody tr:hover td { background:#f8fafc; }
`,Kt=n.div`
  color: #6b7280; font-size: 11px;
`,qt=n.span`
  padding: 2px 8px; border-radius: 9999px; font-size: 12px; font-weight: 800;
  &[data-type='ENROLLED'] { background:#dcfce7; color:#16a34a; }
  &[data-type='ON_LEAVE'] { background:#fef3c7; color:#b45309; }
  &[data-type='PENDING'] { background:#f3e8ff; color:#7c3aed; }
`;function Jt({title:i="수업 내역",history:c,filterYear:r,filterMonth:b,onChangeYear:m,onChangeMonth:T,onResetFilters:P,exporting:u,onExport:F,collapsed:N,onToggleCollapsed:R,todayHref:z,detailHrefFor:I,getAttendanceMap:D}){return e.jsxs(q,{children:[e.jsxs(Xt,{children:[e.jsx(J,{children:i}),e.jsxs("div",{style:{display:"inline-flex",gap:8},children:[e.jsx(pe,{type:"button",onClick:F,disabled:u,children:u?"엑셀 준비 중...":"엑셀 추출"}),e.jsx(pe,{type:"button",onClick:R,children:N?"펼치기":"목록 접기"}),e.jsx(_e,{to:z,children:"수업 생성"})]})]}),e.jsxs(en,{children:[e.jsxs(Ue,{children:[e.jsx(Ge,{children:"연도"}),e.jsx(He,{value:r??"",onChange:o=>m(Number(o.currentTarget.value)||new Date().getFullYear()),children:Qt().map(o=>e.jsxs("option",{value:o,children:[o,"년"]},o))})]}),e.jsxs(Ue,{children:[e.jsx(Ge,{children:"월"}),e.jsxs(He,{value:b,onChange:o=>T(Number(o.currentTarget.value)),children:[e.jsx("option",{value:0,children:"전체"}),Array.from({length:12},(o,$)=>$+1).map(o=>e.jsxs("option",{value:o,children:[o,"월"]},o))]})]}),e.jsx("div",{style:{flex:1}}),e.jsx(tn,{type:"button",onClick:P,children:"초기화"})]}),c.length===0&&e.jsx(Zt,{children:"표시할 일정이 없습니다."}),c.map(o=>N?e.jsxs(nn,{children:[e.jsxs("div",{className:"left",children:[e.jsx("strong",{children:o.dateLabel}),e.jsx(H,{style:{marginLeft:8},children:o.time}),e.jsx(H,{style:{marginLeft:8},children:o.type})]}),e.jsx("div",{className:"right",children:e.jsx(ue,{to:I(o.id,o.date),children:"상세"})})]},o.id||o.dateLabel):e.jsxs(rn,{children:[e.jsxs(sn,{children:[e.jsxs("div",{children:[e.jsx("strong",{children:o.dateLabel}),e.jsx(H,{style:{marginLeft:8},children:o.time}),e.jsx(H,{style:{marginLeft:8},children:o.type}),o.id&&(()=>{const $=D(o.id),y=Object.values($).filter(w=>w===!0).length,_=Object.values($).filter(w=>w===!1).length,A=y+_;return A>0?e.jsxs(H,{style:{marginLeft:10},children:["출석 ",y," · 결석 ",_," · 처리 ",A]}):null})()]}),e.jsx("div",{children:e.jsx(ue,{to:I(o.id,o.date),children:"상세"})})]}),o.notes&&e.jsx(an,{children:e.jsx("p",{children:o.notes})})]},o.id||o.dateLabel))]})}function Qt(){const i=new Date().getFullYear(),c=i-1,r=i+1,b=[];for(let m=c;m<=r;m++)b.push(m);return b}const Xt=n.div`
  display: flex; align-items: center; justify-content: space-between;
`,Zt=n.div`
  color: #6b7280; font-size: 12px;
`,H=n.span`
  color: #6b7280; font-size: 12px;
`,en=n.div`
  display: flex; gap: 12px; align-items: flex-end; margin-bottom: 8px; background:#f9fafb; border:1px solid #f1f5f9; border-radius:10px; padding:8px 10px;
`,Ue=n.label`
  display: grid; gap: 4px;
`,Ge=n.span`
  display:block; color:#6b7280; font-size:12px; margin-bottom:4px;
`,He=n.select`
  height: 32px; padding: 0 10px; border:1px solid #e5e7eb; border-radius:8px; font-size:12px; background:#fff; min-width:110px;
`,tn=n.button`
  ${he.outline}; height:32px; padding:0 12px; font-size:12px;
`,nn=n.div`
  display:flex; align-items:center; justify-content:space-between; padding:12px; border:1px solid #f1f5f9; border-radius:10px; margin-bottom:8px; background:#fff;
  .left{ display:flex; align-items:center; }
`,rn=n.div`
  border:1px solid #f1f5f9; border-radius:12px; margin-bottom:10px; overflow:hidden; background:#fff;
`,sn=n.div`
  display:flex; align-items:center; justify-content:space-between; padding:12px; background:#f9fafb;
`,an=n.div`
  padding:12px;
  p{ margin:0; color:#374151; font-size:14px; }
`;function Un(){const i=ct(),{id:c}=ft(),r=s.useMemo(()=>c?Number(c):null,[c]),{error:b,success:m}=pt(),{confirm:T,dialog:P}=Mt({confirmLabel:"삭제",cancelLabel:"취소",tone:"danger"}),[u,F]=s.useState(null),[N,R]=s.useState(!1),[z,I]=s.useState(null),[D,o]=s.useState([]),[$,y]=s.useState(!1),[_,A]=s.useState(null),[w,B]=s.useState([]),[$n,ge]=s.useState(!1),[Mn,me]=s.useState(null),[Ye,be]=s.useState(!1),[Ve,We]=s.useState([]),[Ke,ye]=s.useState(!1),[qe,Y]=s.useState(null),[Je,Q]=s.useState(!1),[X,V]=s.useState("percent"),[je,ve]=s.useState(!1),[Qe,U]=s.useState(null),[we,Z]=s.useState(null),[ee,te]=s.useState("create"),v=s.useRef(null),G=s.useRef(""),[j,ne]=s.useState(null),[E,Ee]=s.useState(new Date().getMonth()+1),[Xe,re]=s.useState(!1),[Se,ke]=s.useState(!1),[ie,se]=s.useState({});s.useEffect(()=>{if(!r)return;const t=g=>{if(j==null)return!0;const d=Number(g.slice(0,4));if(!Number.isFinite(d)||d!==j)return!1;if(E&&E>=1){const a=Number(g.slice(5,7));return Number.isFinite(a)&&a===E}return!0},l=g=>g.slice().sort((d,a)=>{const h=d.recordDate.localeCompare(a.recordDate);if(h!==0)return h;const S=d.startTime??"",le=a.startTime??"";return S.localeCompare(le)});function f(g){const d=g.detail;if(!d||d.courseId!==r)return;const{record:a}=d;!a||!t(a.recordDate)||B(h=>l([...h.filter(S=>S.id!==a.id),a]))}function x(g){const d=g.detail;if(!d||d.courseId!==r)return;const{record:a}=d;a&&B(h=>{const S=h.some(O=>O.id===a.id);if(!t(a.recordDate))return S?h.filter(O=>O.id!==a.id):h;const le=S?h.map(O=>O.id===a.id?a:O):[...h,a];return l(le)})}function p(g){const d=g.detail;!d||d.courseId!==r||(B(a=>a.filter(h=>h.id!==d.recordId)),se(a=>{if(a==null||!(d.recordId in a))return a;const h={...a};return delete h[d.recordId],h}))}return window.addEventListener("course-record:created",f),window.addEventListener("course-record:updated",x),window.addEventListener("course-record:deleted",p),()=>{window.removeEventListener("course-record:created",f),window.removeEventListener("course-record:updated",x),window.removeEventListener("course-record:deleted",p)}},[r,j,E]);function k(t,l){return typeof t=="string"?t:t&&typeof t=="object"&&"message"in t&&typeof t.message=="string"&&t.message||l}s.useEffect(()=>{if(!r)return;let t=!1;async function l(){R(!0),I(null);try{const f=await ht(r);t||F(f)}catch(f){t||I(k(f,"수업 정보를 불러오지 못했습니다."))}finally{t||R(!1)}}return l(),()=>{t=!0}},[r]);const W=s.useCallback(async()=>{if(r){ye(!0),Y(null);try{const t=await Ct(r);We(t)}catch(t){Y(k(t,"시험 목록을 불러오지 못했습니다."))}finally{ye(!1)}}},[r]);s.useEffect(()=>{W()},[W]);function ae(t){return String(t).padStart(2,"0")}function Ze(t,l){return new Date(t,l,0).getDate()}function Ce(){if(j==null)return{};let t=`${j}-01-01`,l=`${j}-12-31`;if(E>=1){const f=Ze(j,E);t=`${j}-${ae(E)}-01`,l=`${j}-${ae(E)}-${ae(f)}`}return{from:t,to:l}}function et(t){switch(t){case"INDIVIDUAL":return"개인 수업";case"GROUP":return"단체 수업";default:return"단체 수업"}}s.useEffect(()=>{u&&j==null&&ne(new Date().getFullYear())},[u,j]),s.useEffect(()=>{if(!r||j==null)return;let t=!1;async function l(){ge(!0),me(null);try{const f=Ce(),x=await gt(r,f);t||B(x)}catch(f){if(!t){const x=k(f,"");x.includes("404")?B([]):me(x||"수업 내역을 불러오지 못했습니다.")}}finally{t||ge(!1)}}return l(),()=>{t=!0}},[r,j,E]);async function tt(){if(r){be(!0);try{const t=Ce(),l=await mt(r,t),f=u?.title||`course_${r}`,x=t.from&&t.to?`${t.from}_${t.to}`:new Date().toISOString().slice(0,10),p=cn(`${f}_${x}_records`);ln(l,`${p}.xlsx`)}catch(t){b(k(t,"수업 내역 엑셀 추출에 실패했습니다."))}finally{be(!1)}}}async function nt(){if(!r||je)return;const t=G.current.trim();if(!t){U("시험 제목을 입력해주세요."),v.current?.focus();return}U(null),ve(!0);try{ee==="edit"&&we?(await Lt(r,we.id,{title:t,inputMode:X}),m("시험이 수정되었습니다.")):(await Dt(r,{title:t,inputMode:X,kind:"TEST"}),m("시험이 생성되었습니다.")),await W(),Le()}catch(l){b(k(l,ee==="edit"?"시험 수정에 실패했습니다.":"시험 생성에 실패했습니다."))}finally{ve(!1)}}function rt(){Y(null),U(null),G.current="",v.current&&(v.current.value=""),V("percent"),te("create"),Z(null),Q(!0),requestAnimationFrame(()=>{v.current&&(v.current.value="",v.current.focus())})}function Le(){Q(!1),U(null),Z(null),te("create"),V("percent"),G.current="",v.current&&(v.current.value="")}function it(t){Y(null),U(null),te("edit"),Z(t),V(t.inputMode??"percent"),G.current=t.title??"",Q(!0),requestAnimationFrame(()=>{v.current&&(v.current.value=t.title??"",v.current.focus(),v.current.select())})}async function st(t){if(!(!r||!await T({title:"시험을 삭제할까요?",message:`${t.title||"등록된 시험"}과(와) 해당 성적 데이터를 영구 삭제합니다. 되돌릴 수 없습니다.`})))try{await $t(r,t.id),m("시험이 삭제되었습니다."),await W()}catch(f){b(k(f,"시험 삭제에 실패했습니다."))}}s.useEffect(()=>{if(!r||w.length===0)return;let t=!1;async function l(){const f=w.map(x=>x.id).filter(x=>typeof x=="number");if(f.length!==0)try{const x=await Promise.all(f.map(async p=>{try{const g=await Fe(r,p),d={};return g.forEach(a=>{d[a.studentId]=!!a.present}),[p,d]}catch{return[p,void 0]}}));t||se(p=>{const g={...p};return x.forEach(([d,a])=>{a&&(g[d]=a)}),g})}finally{}}return l(),()=>{t=!0}},[r,w]);const[Tn,De]=s.useState(0);s.useEffect(()=>{function t(l){const f=l.detail?.ymd,x=w.filter(p=>!f||p.recordDate===f).map(p=>p.id).filter(p=>typeof p=="number");if(r){if(x.length===0){De(p=>p+1);return}(async()=>{try{const p=await Promise.all(x.map(async g=>{try{const d=await Fe(r,g),a={};return d.forEach(h=>{a[h.studentId]=!!h.present}),[g,a]}catch{return[g,void 0]}}));se(g=>{const d={...g};return p.forEach(([a,h])=>{h&&(d[a]=h)}),d})}catch{}finally{De(p=>p+1)}})()}}return window.addEventListener("calendar:classes-refresh",t),()=>window.removeEventListener("calendar:classes-refresh",t)},[r,w]),s.useEffect(()=>{if(!r)return;let t=!1;async function l(){y(!0),A(null);try{const f=await bt(r);t||o(f)}catch(f){const x=k(f,"");if(x.includes("404"))try{let p=0;const g=100;let d=[];for(;;){const{content:h,last:S}=await vt({page:p,size:g});if(d=d.concat(h),S||h.length===0||p>100)break;p+=1}const a=d.filter(h=>(h.courses||[]).some(S=>S.id===r));t||o(a)}catch(p){t||A(k(p,"등록 학생을 불러오지 못했습니다."))}else t||A(x||"등록 학생을 불러오지 못했습니다.")}finally{t||y(!1)}}return l(),()=>{t=!0}},[r]);const oe=s.useMemo(()=>u?fn(u):null,[u]),M=s.useMemo(()=>u?w.map(t=>({id:t.id,date:new Date(t.recordDate),dateLabel:`${t.recordDate} (${"일월화수목금토"[new Date(t.recordDate).getDay()]})`,time:at(u),type:new Date(t.recordDate)<new Date?"지난 수업":"예정",notes:t.notes||t.content||null})):[],[u,w]);function $e(t){const l=t.getFullYear(),f=String(t.getMonth()+1).padStart(2,"0"),x=String(t.getDate()).padStart(2,"0");return`${l}-${f}-${x}`}function at(t){return t.startTime&&t.endTime?`${K(t.startTime)} ~ ${K(t.endTime)}`:t.courseTime||"-"}function Me(t){try{return JSON.parse(localStorage.getItem(`attendance:${r}:${t}`)||"{}")}catch{return{}}}const Te=s.useMemo(()=>u?.enrolledCount!=null?u.enrolledCount:D.length,[u,D.length]),ot=u?.capacity,de=s.useMemo(()=>M.filter(t=>t.type==="지난 수업").length,[M]),Ne=s.useMemo(()=>{const t=M.length||0;return t?Math.round(de/t*100):null},[de,M.length]),Re=s.useMemo(()=>{if(!M.length)return null;let t=0,l=0;for(const f of M){if(!f.id)continue;const x=ie[f.id]||Me(f.id),p=Object.values(x).filter(a=>a===!0).length,g=Object.values(x).filter(a=>a===!1).length,d=p+g;d>0&&(t+=p,l+=d)}return l===0?null:Math.round(t/l*100)},[M,ie]),[dt,lt]=s.useState(!1);return e.jsxs(pn,{children:[e.jsxs(un,{children:[e.jsxs(jn,{type:"button",onClick:()=>i("/classes"),children:[vn," 뒤로"]}),e.jsx("h2",{children:u?.title||"수업 상세"}),e.jsxs(xn,{children:[e.jsx(Ie,{to:`/classes/${r||""}/edit-students`,title:"수강생 수정","data-variant":"edit",children:"수강생 수정"}),e.jsx(Ie,{to:`/classes/${r||""}/edit`,title:"기본 정보 수정","data-variant":"edit",children:"기본정보 수정"}),r&&e.jsx(pe,{type:"button",onClick:()=>re(!0),children:"삭제"})]})]}),P,e.jsx(ut,{open:Xe,title:"수업(템플릿) 삭제",message:"관련 수업 내역/출결/첨부가 모두 삭제됩니다. 이 작업은 되돌릴 수 없습니다.",confirmLabel:"영구 삭제",cancelLabel:"취소",tone:"danger",busy:Se,onCancel:()=>{Se||re(!1)},onConfirm:async()=>{if(r){ke(!0);try{await xt(r),re(!1),i("/classes")}catch(t){b(k(t,"삭제에 실패했습니다."))}finally{ke(!1)}}}}),z&&e.jsx(bn,{children:z}),N&&e.jsx(yn,{children:"불러오는 중..."}),e.jsxs(wn,{children:[e.jsx(fe,{title:"총 수강생",icon:e.jsx(wt,{}),iconAccent:"indigo",value:e.jsx(e.Fragment,{children:typeof Te=="number"?`${Te}명`:"—"}),footerLeft:e.jsxs("span",{children:["정원 ",ot??"—","명"]})}),e.jsx(fe,{title:"평균 출석률",icon:e.jsx(Et,{}),iconAccent:"green",value:e.jsx(e.Fragment,{children:Re!=null?`${Re}%`:"—"}),footerLeft:e.jsx("span",{children:"처리된 회차 기준"})}),e.jsx(fe,{title:"완료된 수업",icon:e.jsx(St,{}),iconAccent:"violet",value:e.jsxs(e.Fragment,{children:[de||0,"회"]}),footerRight:Ne!=null?e.jsxs("span",{children:["진행률 ",Ne,"%"]}):e.jsx("span",{children:"—"})})]}),oe&&e.jsxs(En,{children:[e.jsx(Sn,{children:e.jsxs(kn,{children:[e.jsxs(q,{children:[e.jsxs(Ln,{children:[e.jsx(J,{children:"수업 정보"}),e.jsx("div",{children:e.jsx(ue,{to:`/classes/${r||""}/edit`,"data-variant":"edit",children:"기본정보 수정"})})]}),e.jsxs(hn,{children:[e.jsxs(C,{children:[e.jsx(L,{children:"코드"}),e.jsx("div",{children:e.jsx("code",{children:u?.code})})]}),e.jsxs(C,{children:[e.jsx(L,{children:"상태"}),e.jsx("div",{children:e.jsx(mn,{"data-type":u?.status,children:dn(u?.status)})})]}),e.jsxs(C,{children:[e.jsx(L,{children:"수업 형태"}),e.jsx("div",{children:et(u?.courseType)})]}),e.jsxs(C,{children:[e.jsx(L,{children:"요일"}),e.jsx("div",{children:oe.days||"-"})]}),e.jsxs(C,{children:[e.jsx(L,{children:"시간"}),e.jsx("div",{children:oe.time||"-"})]}),e.jsxs(C,{children:[e.jsx(L,{children:"정원"}),e.jsx("div",{children:u?.capacity??"-"})]}),e.jsxs(C,{children:[e.jsx(L,{children:"수강료"}),e.jsx("div",{children:u?.fee!=null?jt(u.fee):"-"})]}),e.jsxs(C,{children:[e.jsx(L,{children:"생성일"}),e.jsx("div",{children:u?.createdAt?new Date(u.createdAt).toLocaleDateString():"-"})]}),e.jsxs(C,{style:{gridColumn:"1 / -1"},children:[e.jsx(L,{children:"수업 설명"}),e.jsx(gn,{children:u?.description||"-"})]})]})]}),e.jsx(Tt,{exams:Ve,loading:Ke,error:qe,onCreate:rt,onEdit:it,onDelete:st,modalOpen:Je,modalMode:ee,examMode:X,examFormError:Qe,examSaving:je,onCloseModal:Le,onSubmitModal:nt,onExamModeChange:V,examTitleRef:v,onExamTitleChange:t=>{G.current=t}}),e.jsx(Gt,{students:D,loading:$,error:_,editHref:`/classes/${r||""}/edit-students`})]})}),e.jsxs(Cn,{children:[e.jsx(Jt,{history:M,filterYear:j,filterMonth:E,onChangeYear:t=>ne(t),onChangeMonth:t=>Ee(t),onResetFilters:()=>{ne(new Date().getFullYear()),Ee(0)},exporting:Ye,onExport:tt,collapsed:dt,onToggleCollapsed:()=>lt(t=>!t),todayHref:`/classes/${r||""}/history/date/${$e(new Date)}`,detailHrefFor:(t,l)=>t?`/classes/${r}/history/${t}`:`/classes/${r}/history/date/${$e(l)}`,getAttendanceMap:t=>ie[t]||Me(t)}),!1]})]})]})}function K(i){if(!i)return"";const[c,r]=i.split(":");return`${c}:${r}`}function on(i){return{MON:"월",TUE:"화",WED:"수",THU:"목",FRI:"금",SAT:"토",SUN:"일"}[i.toUpperCase()]||i}function dn(i){switch(i){case"IN_PROGRESS":return"진행중";case"PENDING":return"대기";case"STOPPED":return"중단";default:return i||"-"}}function ln(i,c){const r=URL.createObjectURL(i),b=document.createElement("a");b.href=r,b.download=c,document.body.appendChild(b),b.click(),b.remove(),URL.revokeObjectURL(r)}function cn(i){const r=(i?i.trim():"export").replace(/[\\/:*?"<>|]+/g,"_");return r.length?r:"export"}function fn(i){const c={MON:0,TUE:1,WED:2,THU:3,FRI:4,SAT:5,SUN:6},r=(i.recurrenceDays||"").split(",").map(m=>m.trim().toUpperCase()).filter(Boolean).sort((m,T)=>c[m]-c[T]).map(on).join("/"),b=i.startTime&&i.endTime?`${K(i.startTime)} ~ ${K(i.endTime)}`:i.courseTime||"-";return{days:r,time:b}}const pn=n.div`
  display: grid;
  gap: 12px;
`,un=n.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 12px;
  align-items: center;
  h2 {
    margin: 0;
  }
`,xn=n.div`
  display: inline-flex;
  gap: 12px;
`,hn=n.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`,C=n.div`
  display: grid;
  gap: 6px;
`,L=n.div`
  color: #6b7280;
  font-size: 12px;
  font-weight: 700;
`,gn=n.div`
  color: #111827;
  white-space: pre-wrap;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 6; /* clamp to ~6 lines */
  -webkit-box-orient: vertical;
`;n.span`
  margin-left: 8px;
  color: #9ca3af;
  font-size: 12px;
`;const mn=n.span`
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 800;
  &[data-type="IN_PROGRESS"] {
    background: #dcfce7;
    color: #16a34a;
  }
  &[data-type="PENDING"] {
    background: #f3e8ff;
    color: #7c3aed;
  }
  &[data-type="STOPPED"] {
    background: #e5e7eb;
    color: #374151;
  }
`;n.span`
  margin-left: 8px;
  padding: 2px 6px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  border: 1px solid #e5e7eb;
  color: #374151;
  background: #f9fafb;
  &[data-type="ENROLLED"] {
    background: #ecfdf5;
    color: #047857;
    border-color: #a7f3d0;
  }
  &[data-type="ON_LEAVE"] {
    background: #fff7ed;
    color: #b45309;
    border-color: #fed7aa;
  }
  &[data-type="PENDING"] {
    background: #f5f3ff;
    color: #6d28d9;
    border-color: #ddd6fe;
  }
`;const bn=n.div`
  background: #fee2e2;
  color: #b91c1c;
  border: 1px solid #fecaca;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 13px;
`,yn=n.div`
  color: #6b7280;
  font-size: 12px;
`,jn=n.button`
  ${he.outline};
  height: 40px;
  padding: 0 16px;
  font-weight: 600;
  font-size: 14px;
`,vn=e.jsx("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"15 18 9 12 15 6"})}),wn=n.div`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 12px;
`,En=n.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
`,Sn=n.div`
  flex: 4 1 0;
  display: grid;
  gap: 12px;
  align-content: flex-start;
`,kn=n.div`
  position: sticky;
  top: var(--sticky-top, 64px); /* align with PageHeader sticky height */
  z-index: 31; /* above PageHeader's z-index(30) siblings */
  background: ${({theme:i})=>i.colors.surface};
  display: grid;
  gap: 12px;
  align-content: flex-start;
  align-self: start; /* ensure sticky box isn't stretched by parent grid/flex */
  height: max-content; /* collapse to content height for proper sticky behavior */
  will-change: top; /* hint for smoother stick */
  @media (max-width: 900px) {
    position: static; /* mobile: disable sticky to avoid cramped UI */
  }
`,Cn=n.div`
  flex: 6 1 0;
  display: grid;
  gap: 12px;
  align-content: flex-start;
`,Ln=n.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 8px;
`;n.span`
  display: block;
  color: #6b7280;
  font-size: 12px;
  margin-bottom: 4px;
`;n.select`
  height: 32px;
  padding: 0 10px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 12px;
  background: #fff;
  min-width: 110px;
`;n.div`
  display: flex;
  gap: 12px;
  align-items: flex-end;
  margin-bottom: 8px;
  background: #f9fafb;
  border: 1px solid #f1f5f9;
  border-radius: 10px;
  padding: 8px 10px;
`;n.label`
  display: grid;
  gap: 4px;
`;n.button`
  ${he.outline};
  height: 32px;
  padding: 0 12px;
  font-size: 12px;
`;const Dn=n(xe)`
  thead th {
    background: #f9fafb;
  }
  tbody tr:nth-child(even) td {
    background: #fcfcfd;
  }
  tbody tr:hover td {
    background: #f8fafc;
  }
`;n(Dn)`
  width: 100%;
  thead th,
  tbody td {
    vertical-align: middle;
  }
  thead th:first-child,
  tbody td:first-child {
    text-align: left;
    width: 40%;
  }
  thead th:nth-child(2),
  tbody td:nth-child(2),
  thead th:nth-child(3),
  tbody td:nth-child(3) {
    width: 20%;
    text-align: center;
  }
  thead th.manage,
  tbody td.manage {
    width: 160px;
    text-align: right;
    white-space: nowrap;
  }
  thead th.manage {
    position: relative;
  }
  thead th.manage .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
  thead th.manage .manage-header {
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
    gap: 6px;
    width: 100%;
    font-size: 12px;
    color: #94a3b8;
  }
  thead th.manage .manage-label {
    color: #1f2937;
    font-weight: 600;
  }
  tbody td.manage .actions {
    display: inline-flex;
    gap: 6px;
    justify-content: flex-end;
    flex-wrap: nowrap;
  }
`;n.div`
  display: grid;
  gap: 12px;
  padding: 24px;
  border: 1px dashed #e2e8f0;
  border-radius: 12px;
  background: #f8fafc;
  text-align: center;
  p {
    margin: 0;
    color: #475569;
    font-size: 14px;
    font-weight: 600;
  }
`;n.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  .name {
    font-weight: 700;
    color: #1f2937;
  }
  .actions {
    display: inline-flex;
    gap: 8px;
  }
  .actions > * {
    min-width: 0;
  }
`;n.div`
  max-height: 420px;
  overflow: auto;
  border: 1px solid #f1f5f9;
  border-radius: 10px;
`;n.div`
  display: grid;
  gap: 16px;
  .row {
    display: grid;
    grid-template-columns: 100px 1fr;
    gap: 12px;
    align-items: center;
  }
  label {
    font-weight: 700;
    color: #334155;
    font-size: 14px;
  }
`;n.input`
  height: 40px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 12px;
  font-size: 14px;
  width: 100%;
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
  }
`;n.div`
  display: inline-flex;
  gap: 8px;
`;n.button`
  min-width: 120px;
  height: 40px;
  padding: 0 16px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: #fff;
  font-weight: 700;
  font-size: 13px;
  color: #374151;
  cursor: pointer;
  transition: background 0.18s ease, border-color 0.18s ease, color 0.18s ease;
  &[data-active="true"] {
    background: #eef2ff;
    border-color: #c7d2fe;
    color: #3730a3;
  }
`;n.div`
  margin-left: 100px;
  color: #dc2626;
  font-size: 13px;
`;n.div`
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px;
  display: grid;
  gap: 10px;
  margin-bottom: 10px;
`;n.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;n.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 10px 12px;
  background: #fff;
  margin-bottom: 10px;
  .left {
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;n.div`
  font-size: 12px;
  font-weight: 800;
  color: #6b7280;
  margin-top: 4px;
`;n.span`
  margin-left: 8px;
  padding: 2px 6px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  border: 1px solid #e5e7eb;
  color: #374151;
  background: #f3f4f6;
`;n.div`
  white-space: pre-wrap;
  border: 1px solid #f1f5f9;
  border-radius: 10px;
  padding: 10px;
  background: #f9fafb;
  color: #111827;
  font-size: 14px;
  line-height: 1.5;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3; /* show 3 lines */
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
`;n.div`
  display: grid;
  gap: 6px;
  margin-top: 6px;
`;n.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 8px;
  border: 1px solid #f1f5f9;
  border-radius: 8px;
`;n.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  font-size: 12px;
  font-weight: 800;
  color: #374151;
  background: #fff;
  &[data-variant="present"] {
    background: #ecfdf5;
    color: #065f46;
    border-color: #a7f3d0;
  }
  &[data-variant="absent"] {
    background: #fee2e2;
    color: #7f1d1d;
    border-color: #fecaca;
  }
  &[data-variant="none"] {
    background: #f3f4f6;
    color: #6b7280;
    border-color: #e5e7eb;
  }
`;export{Un as default};
