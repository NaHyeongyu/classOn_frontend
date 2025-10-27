import{j as e,d as s,u as at,e as ot,r as a,c as lt}from"./index-B0K7mn4q.js";import{S as J,i as Q,f as De,j as de,T as Pe,a as Be,G as xe,k as pe,c as Ue,l as $e}from"./UI-Cj3YhchZ.js";import{C as ct}from"./ConfirmDialog-ClQeXE4D.js";import{d as dt,g as ut,b as ft,e as xt,f as Me,h as pt}from"./courses-DlbPyXYO.js";import{a as ht,c as mt}from"./format-DW-Kl_C3.js";import{l as gt}from"./students-BeT2wLPO.js";import{K as ue,U as jt,C as bt,a as yt}from"./KPI-BGVZTIzu.js";import{M as vt}from"./Modal-DH_Ki-Ju.js";import{l as wt,u as Et,c as St,d as Ct}from"./exams-DEQiqh-d.js";import{u as Lt}from"./useConfirmDialog-DCN8mg1d.js";function kt({exams:r,loading:o,error:n,onCreate:p,onEdit:j,onDelete:S,modalOpen:N,modalMode:u,examMode:z,examFormError:R,examSaving:I,onCloseModal:F,onSubmitModal:A,onExamModeChange:D,examTitleRef:l,onExamTitleChange:$}){return e.jsxs(J,{children:[e.jsxs(Tt,{children:[e.jsxs("div",{children:[e.jsx(Q,{style:{margin:0},children:"시험 관리"}),e.jsx(Te,{children:"수업과 연결된 시험을 확인하고 추가합니다."})]}),e.jsx(De,{type:"button",onClick:p,children:"시험 생성"})]}),o&&e.jsx(Te,{children:"시험을 불러오는 중..."}),n&&e.jsx(Ne,{children:n}),r.length===0?e.jsx(It,{children:e.jsx("p",{children:"아직 등록된 시험이 없습니다."})}):e.jsx(Nt,{children:e.jsxs(Rt,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"시험명"}),e.jsx("th",{children:"형태"}),e.jsx("th",{children:"평균"}),e.jsxs("th",{className:"manage",children:[e.jsx("div",{className:"manage-header","aria-hidden":"true",children:e.jsx("span",{className:"manage-label",children:"관리"})}),e.jsx("span",{className:"sr-only",children:"관리"})]})]})}),e.jsx("tbody",{children:r.map(b=>e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx(Ft,{children:e.jsx("span",{className:"name",children:b.title})})}),e.jsx("td",{children:Dt(b.inputMode)}),e.jsx("td",{children:$t(b)}),e.jsx("td",{className:"manage",children:e.jsxs("div",{className:"actions",children:[e.jsx(de,{type:"button","data-variant":"edit",onClick:()=>j(b),children:"수정"}),e.jsx(de,{type:"button","data-variant":"danger",onClick:()=>S(b),children:"삭제"})]})})]},b.id))})]})}),e.jsx(vt,{open:N,title:u==="edit"?"시험 수정":"시험 추가",onClose:F,footer:e.jsxs("div",{style:{display:"inline-flex",gap:8},children:[e.jsx(de,{type:"button",onClick:F,children:"취소"}),e.jsx(De,{type:"button",onClick:A,disabled:I,children:I?"저장 중…":u==="edit"?"수정":"등록"})]}),children:e.jsxs(At,{children:[R&&e.jsx(Ne,{children:R}),e.jsx(Re,{htmlFor:"exam-title",children:"시험 제목"}),e.jsx(zt,{id:"exam-title",ref:l,placeholder:"예: 중간고사 수학",onChange:b=>$(b.currentTarget.value)}),e.jsx(Re,{children:"입력 방식"}),e.jsxs("div",{style:{display:"inline-flex",gap:12},children:[e.jsxs("label",{style:{display:"inline-flex",alignItems:"center",gap:6,cursor:"pointer"},children:[e.jsx("input",{type:"radio",name:"examMode",checked:z==="percent",onChange:()=>D("percent")}),e.jsx("span",{children:"백분율"})]}),e.jsxs("label",{style:{display:"inline-flex",alignItems:"center",gap:6,cursor:"pointer"},children:[e.jsx("input",{type:"radio",name:"examMode",checked:z==="letter",onChange:()=>D("letter")}),e.jsx("span",{children:"등급"})]})]})]})})]})}function Dt(r){switch(r){case"percent":return"백분율";case"letter":return"등급";default:return"백분율"}}function $t(r){if(r.averageScore==null)return"—";if(r.inputMode==="letter")return Mt(r.averageScore);const o=Math.round(r.averageScore*10)/10;return`${Number.isInteger(o)?String(o):o.toFixed(1)}점`}function Mt(r){const o=Math.round(r);return o>=90?"A":o>=80?"B":o>=70?"C":o>=60?"D":o>=50?"E":"F"}const Tt=s.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`,Te=s.div`
  color: #6b7280;
  font-size: 12px;
`,Ne=s.div`
  color: #b91c1c;
  background: #fee2e2;
  border: 1px solid #fecaca;
  padding: 8px 10px;
  border-radius: 8px;
  font-size: 13px;
`,Nt=s.div`
  overflow: auto;
`,Rt=s(Pe)`
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
`,It=s.div`
  display: grid; gap: 12px; padding: 24px; border: 1px dashed #e2e8f0; border-radius: 12px; background: #f8fafc; text-align: center;
  p { margin: 0; color: #475569; font-size: 14px; font-weight: 600; }
`,Ft=s.div`
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  .name { font-weight: 700; color: #1f2937; }
`,At=s.div`
  display: grid; gap: 10px;
`,Re=s.label`
  color: #6b7280; font-size: 12px; font-weight: 700;
`,zt=s.input`
  height: 40px; border: 1px solid #e5e7eb; border-radius: 10px; padding: 0 12px; font-size: 14px; color: #111827; width: 100%;
`;function Ot({students:r,loading:o,error:n,editHref:p}){return e.jsxs(J,{children:[e.jsxs(Bt,{children:[e.jsxs("div",{children:[e.jsx(Q,{style:{margin:0},children:"수강생 목록"}),e.jsxs(Ie,{children:["총 ",r.length,"명의 학생이 수강중입니다."]})]}),e.jsx(Be,{to:p,children:"학생 추가"})]}),o&&e.jsx(Ie,{children:"불러오는 중..."}),n&&e.jsx(Ut,{children:n}),e.jsx(Gt,{children:e.jsxs(Ht,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"학생명"}),e.jsx("th",{children:"연락처"}),e.jsx("th",{children:"등록일"}),e.jsx("th",{children:"상태"})]})}),e.jsx("tbody",{children:r.length===0&&!o?e.jsx("tr",{children:e.jsx("td",{colSpan:4,style:{color:"#6b7280"},children:"등록된 학생이 없습니다."})}):r.map(j=>e.jsxs("tr",{children:[e.jsxs("td",{children:[e.jsx("strong",{children:j.name}),e.jsx(Yt,{children:j.code})]}),e.jsx("td",{children:ht(j.phoneNumber)}),e.jsx("td",{children:j.joinedDate||"-"}),e.jsx("td",{children:e.jsx(_t,{"data-type":j.status,children:Pt(j.status)})})]},j.id))})]})})]})}function Pt(r){switch(r){case"ENROLLED":return"수강중";case"ON_LEAVE":return"휴학";case"PENDING":return"대기";default:return r}}const Bt=s.div`
  display: flex; align-items: center; justify-content: space-between;
`,Ie=s.div`
  color: #6b7280; font-size: 12px;
`,Ut=s.div`
  color: #b91c1c; background: #fee2e2; border: 1px solid #fecaca; padding: 8px 10px; border-radius: 8px; font-size: 13px;
`,Gt=s.div` overflow: auto; `,Ht=s(Pe)`
  thead th { background:#f9fafb; }
  tbody tr:nth-child(even) td { background:#fcfcfd; }
  tbody tr:hover td { background:#f8fafc; }
`,Yt=s.div`
  color: #6b7280; font-size: 11px;
`,_t=s.span`
  padding: 2px 8px; border-radius: 9999px; font-size: 12px; font-weight: 800;
  &[data-type='ENROLLED'] { background:#dcfce7; color:#16a34a; }
  &[data-type='ON_LEAVE'] { background:#fef3c7; color:#b45309; }
  &[data-type='PENDING'] { background:#f3e8ff; color:#7c3aed; }
`;function Wt({title:r="수업 내역",history:o,filterYear:n,filterMonth:p,onChangeYear:j,onChangeMonth:S,onResetFilters:N,exporting:u,onExport:z,collapsed:R,onToggleCollapsed:I,todayHref:F,detailHrefFor:A,getAttendanceMap:D}){return e.jsxs(J,{children:[e.jsxs(Kt,{children:[e.jsx(Q,{children:r}),e.jsxs("div",{style:{display:"inline-flex",gap:8},children:[e.jsx(xe,{type:"button",onClick:z,disabled:u,children:u?"엑셀 준비 중...":"엑셀 추출"}),e.jsx(xe,{type:"button",onClick:I,children:R?"펼치기":"목록 접기"}),e.jsx(Be,{to:F,children:"수업 생성"})]})]}),e.jsxs(Jt,{children:[e.jsxs(Fe,{children:[e.jsx(Ae,{children:"연도"}),e.jsx(ze,{value:n??"",onChange:l=>j(Number(l.currentTarget.value)||new Date().getFullYear()),children:Vt().map(l=>e.jsxs("option",{value:l,children:[l,"년"]},l))})]}),e.jsxs(Fe,{children:[e.jsx(Ae,{children:"월"}),e.jsxs(ze,{value:p,onChange:l=>S(Number(l.currentTarget.value)),children:[e.jsx("option",{value:0,children:"전체"}),Array.from({length:12},(l,$)=>$+1).map(l=>e.jsxs("option",{value:l,children:[l,"월"]},l))]})]}),e.jsx("div",{style:{flex:1}}),e.jsx(Qt,{type:"button",onClick:N,children:"초기화"})]}),o.length===0&&e.jsx(qt,{children:"표시할 일정이 없습니다."}),o.map(l=>R?e.jsxs(Xt,{children:[e.jsxs("div",{className:"left",children:[e.jsx("strong",{children:l.dateLabel}),e.jsx(Y,{style:{marginLeft:8},children:l.time}),e.jsx(Y,{style:{marginLeft:8},children:l.type})]}),e.jsx("div",{className:"right",children:e.jsx(pe,{to:A(l.id,l.date),children:"상세"})})]},l.id||l.dateLabel):e.jsxs(Zt,{children:[e.jsxs(en,{children:[e.jsxs("div",{children:[e.jsx("strong",{children:l.dateLabel}),e.jsx(Y,{style:{marginLeft:8},children:l.time}),e.jsx(Y,{style:{marginLeft:8},children:l.type}),l.id&&(()=>{const $=D(l.id),b=Object.values($).filter(v=>v===!0).length,_=Object.values($).filter(v=>v===!1).length,O=b+_;return O>0?e.jsxs(Y,{style:{marginLeft:10},children:["출석 ",b," · 결석 ",_," · 처리 ",O]}):null})()]}),e.jsx("div",{children:e.jsx(pe,{to:A(l.id,l.date),children:"상세"})})]}),l.notes&&e.jsx(tn,{children:e.jsx("p",{children:l.notes})})]},l.id||l.dateLabel))]})}function Vt(){const r=new Date().getFullYear(),o=r-1,n=r+1,p=[];for(let j=o;j<=n;j++)p.push(j);return p}const Kt=s.div`
  display: flex; align-items: center; justify-content: space-between;
`,qt=s.div`
  color: #6b7280; font-size: 12px;
`,Y=s.span`
  color: #6b7280; font-size: 12px;
`,Jt=s.div`
  display: flex; gap: 12px; align-items: flex-end; margin-bottom: 8px; background:#f9fafb; border:1px solid #f1f5f9; border-radius:10px; padding:8px 10px;
`,Fe=s.label`
  display: grid; gap: 4px;
`,Ae=s.span`
  display:block; color:#6b7280; font-size:12px; margin-bottom:4px;
`,ze=s.select`
  height: 32px; padding: 0 10px; border:1px solid #e5e7eb; border-radius:8px; font-size:12px; background:#fff; min-width:110px;
`,Qt=s.button`
  ${Ue.outline}; height:32px; padding:0 12px; font-size:12px;
`,Xt=s.div`
  display:flex; align-items:center; justify-content:space-between; padding:12px; border:1px solid #f1f5f9; border-radius:10px; margin-bottom:8px; background:#fff;
  .left{ display:flex; align-items:center; }
`,Zt=s.div`
  border:1px solid #f1f5f9; border-radius:12px; margin-bottom:10px; overflow:hidden; background:#fff;
`,en=s.div`
  display:flex; align-items:center; justify-content:space-between; padding:12px; background:#f9fafb;
`,tn=s.div`
  padding:12px;
  p{ margin:0; color:#374151; font-size:14px; }
`;function fe(r){return String(r).padStart(2,"0")}function nn(r,o){return new Date(r,o,0).getDate()}function Oe(r,o){if(r==null)return{};let n=`${r}-01-01`,p=`${r}-12-31`;if(o>=1){const j=nn(r,o);n=`${r}-${fe(o)}-01`,p=`${r}-${fe(o)}-${fe(j)}`}return{from:n,to:p}}function Fn(){const r=at(),{id:o}=ot(),n=a.useMemo(()=>o?Number(o):null,[o]),{error:p,success:j}=lt(),{confirm:S,dialog:N}=Lt({confirmLabel:"삭제",cancelLabel:"취소",tone:"danger"}),[u,z]=a.useState(null),[R,I]=a.useState(!1),[F,A]=a.useState(null),[D,l]=a.useState([]),[$,b]=a.useState(!1),[_,O]=a.useState(null),[v,B]=a.useState([]),[Ge,he]=a.useState(!1),[He,Ye]=a.useState([]),[_e,me]=a.useState(!1),[We,W]=a.useState(null),[Ve,X]=a.useState(!1),[Z,V]=a.useState("percent"),[ge,je]=a.useState(!1),[Ke,U]=a.useState(null),[be,ee]=a.useState(null),[te,ne]=a.useState("create"),y=a.useRef(null),G=a.useRef(""),[w,re]=a.useState(null),[M,ye]=a.useState(new Date().getMonth()+1),[qe,se]=a.useState(!1),[ve,we]=a.useState(!1),[ie,H]=a.useState({});a.useEffect(()=>{if(!n)return;const t=g=>{if(w==null)return!0;const c=Number(g.slice(0,4));if(!Number.isFinite(c)||c!==w)return!1;if(M&&M>=1){const i=Number(g.slice(5,7));return Number.isFinite(i)&&i===M}return!0},x=g=>g.slice().sort((c,i)=>{const m=c.recordDate.localeCompare(i.recordDate);if(m!==0)return m;const E=c.startTime??"",ce=i.startTime??"";return E.localeCompare(ce)});function f(g){const c=g.detail;if(!c||c.courseId!==n)return;const{record:i}=c;!i||!t(i.recordDate)||B(m=>x([...m.filter(E=>E.id!==i.id),i]))}function h(g){const c=g.detail;if(!c||c.courseId!==n)return;const{record:i}=c;i&&B(m=>{const E=m.some(P=>P.id===i.id);if(!t(i.recordDate))return E?m.filter(P=>P.id!==i.id):m;const ce=E?m.map(P=>P.id===i.id?i:P):[...m,i];return x(ce)})}function d(g){const c=g.detail;!c||c.courseId!==n||(B(i=>i.filter(m=>m.id!==c.recordId)),H(i=>{if(i==null||!(c.recordId in i))return i;const m={...i};return delete m[c.recordId],m}))}return window.addEventListener("course-record:created",f),window.addEventListener("course-record:updated",h),window.addEventListener("course-record:deleted",d),()=>{window.removeEventListener("course-record:created",f),window.removeEventListener("course-record:updated",h),window.removeEventListener("course-record:deleted",d)}},[n,w,M,p]);function C(t,x){return typeof t=="string"?t:t&&typeof t=="object"&&"message"in t&&typeof t.message=="string"&&t.message||x}a.useEffect(()=>{if(!n)return;let t=!1;async function x(){I(!0),A(null);try{const f=await ut(n);t||z(f)}catch(f){t||A(C(f,"수업 정보를 불러오지 못했습니다."))}finally{t||I(!1)}}return x(),()=>{t=!0}},[n]);const K=a.useCallback(async()=>{if(n){me(!0),W(null);try{const t=await wt(n);Ye(t)}catch(t){W(C(t,"시험 목록을 불러오지 못했습니다."))}finally{me(!1)}}},[n]);a.useEffect(()=>{K()},[K]);function Je(t){switch(t){case"INDIVIDUAL":return"개인 수업";case"GROUP":return"단체 수업";default:return"단체 수업"}}a.useEffect(()=>{u&&w==null&&re(new Date().getFullYear())},[u,w]),a.useEffect(()=>{if(!n||w==null)return;let t=!1;async function x(){try{const f=Oe(w,M),h=await ft(n,f);t||B(h)}catch(f){if(t)return;const h=C(f,"");h.includes("404")?B([]):p(h||"수업 내역을 불러오지 못했습니다.")}}return x(),()=>{t=!0}},[n,w,M,p]);async function Qe(){if(n){he(!0);try{const t=Oe(w,M),x=await xt(n,t),f=u?.title||`course_${n}`,h=t.from&&t.to?`${t.from}_${t.to}`:new Date().toISOString().slice(0,10),d=on(`${f}_${h}_records`);an(x,`${d}.xlsx`)}catch(t){p(C(t,"수업 내역 엑셀 추출에 실패했습니다."))}finally{he(!1)}}}async function Xe(){if(!n||ge)return;const t=G.current.trim();if(!t){U("시험 제목을 입력해주세요."),y.current?.focus();return}U(null),je(!0);try{te==="edit"&&be?(await Et(n,be.id,{title:t,inputMode:Z}),j("시험이 수정되었습니다.")):(await St(n,{title:t,inputMode:Z,kind:"TEST"}),j("시험이 생성되었습니다.")),await K(),Ee()}catch(x){p(C(x,te==="edit"?"시험 수정에 실패했습니다.":"시험 생성에 실패했습니다."))}finally{je(!1)}}function Ze(){W(null),U(null),G.current="",y.current&&(y.current.value=""),V("percent"),ne("create"),ee(null),X(!0),requestAnimationFrame(()=>{y.current&&(y.current.value="",y.current.focus())})}function Ee(){X(!1),U(null),ee(null),ne("create"),V("percent"),G.current="",y.current&&(y.current.value="")}function et(t){W(null),U(null),ne("edit"),ee(t),V(t.inputMode??"percent"),G.current=t.title??"",X(!0),requestAnimationFrame(()=>{y.current&&(y.current.value=t.title??"",y.current.focus(),y.current.select())})}async function tt(t){if(!(!n||!await S({title:"시험을 삭제할까요?",message:`${t.title||"등록된 시험"}과(와) 해당 성적 데이터를 영구 삭제합니다. 되돌릴 수 없습니다.`})))try{await Ct(n,t.id),j("시험이 삭제되었습니다."),await K()}catch(f){p(C(f,"시험 삭제에 실패했습니다."))}}a.useEffect(()=>{if(!n||v.length===0)return;let t=!1;async function x(){const f=v.map(h=>h.id).filter(h=>typeof h=="number");if(f.length!==0)try{const h=await Promise.all(f.map(async d=>{try{const g=await Me(n,d),c={};return g.forEach(i=>{c[i.studentId]=!!i.present}),[d,c]}catch{return[d,void 0]}}));t||H(d=>{const g={...d};return h.forEach(([c,i])=>{i&&(g[c]=i)}),g})}finally{}}return x(),()=>{t=!0}},[n,v]),a.useEffect(()=>{function t(x){const f=x.detail?.ymd,h=v.filter(d=>!f||d.recordDate===f).map(d=>d.id).filter(d=>typeof d=="number");if(n){if(h.length===0){H(d=>({...d}));return}(async()=>{try{const d=await Promise.all(h.map(async g=>{try{const c=await Me(n,g),i={};return c.forEach(m=>{i[m.studentId]=!!m.present}),[g,i]}catch{return[g,void 0]}}));H(g=>{const c={...g};return d.forEach(([i,m])=>{m&&(c[i]=m)}),c})}catch{}finally{H(d=>({...d}))}})()}}return window.addEventListener("calendar:classes-refresh",t),()=>window.removeEventListener("calendar:classes-refresh",t)},[n,v]),a.useEffect(()=>{if(!n)return;let t=!1;async function x(){b(!0),O(null);try{const f=await pt(n);t||l(f)}catch(f){const h=C(f,"");if(h.includes("404"))try{let d=0;const g=100;let c=[];for(;;){const{content:m,last:E}=await gt({page:d,size:g});if(c=c.concat(m),E||m.length===0||d>100)break;d+=1}const i=c.filter(m=>(m.courses||[]).some(E=>E.id===n));t||l(i)}catch(d){t||O(C(d,"등록 학생을 불러오지 못했습니다."))}else t||O(h||"등록 학생을 불러오지 못했습니다.")}finally{t||b(!1)}}return x(),()=>{t=!0}},[n]);const ae=a.useMemo(()=>u?ln(u):null,[u]),T=a.useMemo(()=>u?v.map(t=>({id:t.id,date:new Date(t.recordDate),dateLabel:`${t.recordDate} (${"일월화수목금토"[new Date(t.recordDate).getDay()]})`,time:nt(u),type:new Date(t.recordDate)<new Date?"지난 수업":"예정",notes:t.notes||t.content||null})):[],[u,v]);function Se(t){const x=t.getFullYear(),f=String(t.getMonth()+1).padStart(2,"0"),h=String(t.getDate()).padStart(2,"0");return`${x}-${f}-${h}`}function nt(t){return t.startTime&&t.endTime?`${q(t.startTime)} ~ ${q(t.endTime)}`:t.courseTime||"-"}const oe=a.useCallback(t=>{try{return JSON.parse(localStorage.getItem(`attendance:${n}:${t}`)||"{}")}catch{return{}}},[n]),Ce=a.useMemo(()=>u?.enrolledCount!=null?u.enrolledCount:D.length,[u,D.length]),rt=u?.capacity,le=a.useMemo(()=>T.filter(t=>t.type==="지난 수업").length,[T]),Le=a.useMemo(()=>{const t=T.length||0;return t?Math.round(le/t*100):null},[le,T.length]),ke=a.useMemo(()=>{if(!T.length)return null;let t=0,x=0;for(const f of T){if(!f.id)continue;const h=ie[f.id]||oe(f.id),d=Object.values(h).filter(i=>i===!0).length,g=Object.values(h).filter(i=>i===!1).length,c=d+g;c>0&&(t+=d,x+=c)}return x===0?null:Math.round(t/x*100)},[T,ie,oe]),[st,it]=a.useState(!1);return e.jsxs(cn,{children:[e.jsxs(dn,{children:[e.jsxs(gn,{type:"button",onClick:()=>r("/classes"),children:[jn," 뒤로"]}),e.jsx("h2",{children:u?.title||"수업 상세"}),e.jsxs(un,{children:[e.jsx($e,{to:`/classes/${n||""}/edit-students`,title:"수강생 수정","data-variant":"edit",children:"수강생 수정"}),e.jsx($e,{to:`/classes/${n||""}/edit`,title:"기본 정보 수정","data-variant":"edit",children:"기본정보 수정"}),n&&e.jsx(xe,{type:"button",onClick:()=>se(!0),children:"삭제"})]})]}),N,e.jsx(ct,{open:qe,title:"수업(템플릿) 삭제",message:"관련 수업 내역/출결/첨부가 모두 삭제됩니다. 이 작업은 되돌릴 수 없습니다.",confirmLabel:"영구 삭제",cancelLabel:"취소",tone:"danger",busy:ve,onCancel:()=>{ve||se(!1)},onConfirm:async()=>{if(n){we(!0);try{await dt(n),se(!1),r("/classes")}catch(t){p(C(t,"삭제에 실패했습니다."))}finally{we(!1)}}}}),F&&e.jsx(hn,{children:F}),R&&e.jsx(mn,{children:"불러오는 중..."}),e.jsxs(bn,{children:[e.jsx(ue,{title:"총 수강생",icon:e.jsx(jt,{}),iconAccent:"indigo",value:e.jsx(e.Fragment,{children:typeof Ce=="number"?`${Ce}명`:"—"}),footerLeft:e.jsxs("span",{children:["정원 ",rt??"—","명"]})}),e.jsx(ue,{title:"평균 출석률",icon:e.jsx(bt,{}),iconAccent:"green",value:e.jsx(e.Fragment,{children:ke!=null?`${ke}%`:"—"}),footerLeft:e.jsx("span",{children:"처리된 회차 기준"})}),e.jsx(ue,{title:"완료된 수업",icon:e.jsx(yt,{}),iconAccent:"violet",value:e.jsxs(e.Fragment,{children:[le||0,"회"]}),footerRight:Le!=null?e.jsxs("span",{children:["진행률 ",Le,"%"]}):e.jsx("span",{children:"—"})})]}),ae&&e.jsxs(yn,{children:[e.jsx(vn,{children:e.jsxs(wn,{children:[e.jsxs(J,{children:[e.jsxs(Sn,{children:[e.jsx(Q,{children:"수업 정보"}),e.jsx("div",{children:e.jsx(pe,{to:`/classes/${n||""}/edit`,"data-variant":"edit",children:"기본정보 수정"})})]}),e.jsxs(fn,{children:[e.jsxs(L,{children:[e.jsx(k,{children:"코드"}),e.jsx("div",{children:e.jsx("code",{children:u?.code})})]}),e.jsxs(L,{children:[e.jsx(k,{children:"상태"}),e.jsx("div",{children:e.jsx(pn,{"data-type":u?.status,children:sn(u?.status)})})]}),e.jsxs(L,{children:[e.jsx(k,{children:"수업 형태"}),e.jsx("div",{children:Je(u?.courseType)})]}),e.jsxs(L,{children:[e.jsx(k,{children:"요일"}),e.jsx("div",{children:ae.days||"-"})]}),e.jsxs(L,{children:[e.jsx(k,{children:"시간"}),e.jsx("div",{children:ae.time||"-"})]}),e.jsxs(L,{children:[e.jsx(k,{children:"정원"}),e.jsx("div",{children:u?.capacity??"-"})]}),e.jsxs(L,{children:[e.jsx(k,{children:"수강료"}),e.jsx("div",{children:u?.fee!=null?mt(u.fee):"-"})]}),e.jsxs(L,{children:[e.jsx(k,{children:"생성일"}),e.jsx("div",{children:u?.createdAt?new Date(u.createdAt).toLocaleDateString():"-"})]}),e.jsxs(L,{style:{gridColumn:"1 / -1"},children:[e.jsx(k,{children:"수업 설명"}),e.jsx(xn,{children:u?.description||"-"})]})]})]}),e.jsx(Ot,{students:D,loading:$,error:_,editHref:`/classes/${n||""}/edit-students`}),e.jsx(kt,{exams:He,loading:_e,error:We,onCreate:Ze,onEdit:et,onDelete:tt,modalOpen:Ve,modalMode:te,examMode:Z,examFormError:Ke,examSaving:ge,onCloseModal:Ee,onSubmitModal:Xe,onExamModeChange:V,examTitleRef:y,onExamTitleChange:t=>{G.current=t}})]})}),e.jsx(En,{children:e.jsx(Wt,{history:T,filterYear:w,filterMonth:M,onChangeYear:t=>re(t),onChangeMonth:t=>ye(t),onResetFilters:()=>{re(new Date().getFullYear()),ye(0)},exporting:Ge,onExport:Qe,collapsed:st,onToggleCollapsed:()=>it(t=>!t),todayHref:`/classes/${n||""}/history/date/${Se(new Date)}`,detailHrefFor:(t,x)=>t?`/classes/${n}/history/${t}`:`/classes/${n}/history/date/${Se(x)}`,getAttendanceMap:t=>ie[t]||oe(t)})})]})]})}function q(r){if(!r)return"";const[o,n]=r.split(":");return`${o}:${n}`}function rn(r){return{MON:"월",TUE:"화",WED:"수",THU:"목",FRI:"금",SAT:"토",SUN:"일"}[r.toUpperCase()]||r}function sn(r){switch(r){case"IN_PROGRESS":return"진행중";case"PENDING":return"대기";case"STOPPED":return"중단";default:return r||"-"}}function an(r,o){const n=URL.createObjectURL(r),p=document.createElement("a");p.href=n,p.download=o,document.body.appendChild(p),p.click(),p.remove(),URL.revokeObjectURL(n)}function on(r){const n=(r?r.trim():"export").replace(/[\\/:*?"<>|]+/g,"_");return n.length?n:"export"}function ln(r){const o={MON:0,TUE:1,WED:2,THU:3,FRI:4,SAT:5,SUN:6},p=(Array.isArray(r.recurrenceDays)?r.recurrenceDays:String(r.recurrenceDays||"").split(",")).map(S=>String(S).trim().toUpperCase()).filter(Boolean).sort((S,N)=>o[S]-o[N]).map(rn).join("/"),j=r.startTime&&r.endTime?`${q(r.startTime)} ~ ${q(r.endTime)}`:r.courseTime||"-";return{days:p,time:j}}const cn=s.div`
  display: grid;
  gap: 12px;
`,dn=s.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 12px;
  align-items: center;
  h2 {
    margin: 0;
  }
`,un=s.div`
  display: inline-flex;
  gap: 12px;
`,fn=s.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`,L=s.div`
  display: grid;
  gap: 6px;
`,k=s.div`
  color: #6b7280;
  font-size: 12px;
  font-weight: 700;
`,xn=s.div`
  color: #111827;
  white-space: pre-wrap;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 6; /* clamp to ~6 lines */
  -webkit-box-orient: vertical;
`,pn=s.span`
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
`,hn=s.div`
  background: #fee2e2;
  color: #b91c1c;
  border: 1px solid #fecaca;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 13px;
`,mn=s.div`
  color: #6b7280;
  font-size: 12px;
`,gn=s.button`
  ${Ue.outline};
  height: 40px;
  padding: 0 16px;
  font-weight: 600;
  font-size: 14px;
`,jn=e.jsx("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"15 18 9 12 15 6"})}),bn=s.div`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 12px;
`,yn=s.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
`,vn=s.div`
  flex: 4 1 0;
  display: grid;
  gap: 12px;
  align-content: flex-start;
`,wn=s.div`
  position: sticky;
  top: var(--sticky-top, 64px); /* align with PageHeader sticky height */
  z-index: 31; /* above PageHeader's z-index(30) siblings */
  background: ${({theme:r})=>r.colors.surface};
  display: grid;
  gap: 12px;
  align-content: flex-start;
  align-self: start; /* ensure sticky box isn't stretched by parent grid/flex */
  height: max-content; /* collapse to content height for proper sticky behavior */
  will-change: top; /* hint for smoother stick */
  @media (max-width: 900px) {
    position: static; /* mobile: disable sticky to avoid cramped UI */
  }
`,En=s.div`
  flex: 6 1 0;
  display: grid;
  gap: 12px;
  align-content: flex-start;
`,Sn=s.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 8px;
`;export{Fn as default};
