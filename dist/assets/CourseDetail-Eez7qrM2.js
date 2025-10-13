import{j as e,d as n,u as lt,a as dt,r as a,b as ct}from"./index-B5k8kNhE.js";import{S as V,i as W,f as Re,j as se,T as ce,a as Ge,G as le,k as de,c as pe,l as ze}from"./UI-BZ18PvHk.js";import{C as pt}from"./ConfirmDialog-20rXmZ8b.js";import{d as ft,g as ut,b as xt,e as ht,f as Ne,h as gt}from"./courses-BmGwMg8m.js";import{b as mt,c as bt}from"./format-Do6vjlY3.js";import{l as jt}from"./students-BCS5i-8E.js";import{K as oe,U as yt,C as vt,a as wt}from"./KPI-UvtT2Jh4.js";import{M as Et,l as St,u as kt,c as Ct,d as Lt}from"./exams-O1cK7ema.js";import{u as $t}from"./useConfirmDialog-CYG_Gyva.js";function Dt({exams:i,loading:o,error:r,onCreate:x,onEdit:f,onDelete:D,modalOpen:F,modalMode:l,examMode:N,examFormError:M,examSaving:T,onCloseModal:R,onSubmitModal:z,onExamModeChange:C,examTitleRef:s,onExamTitleChange:L}){return e.jsxs(V,{children:[e.jsxs(zt,{children:[e.jsxs("div",{children:[e.jsx(W,{style:{margin:0},children:"시험 관리"}),e.jsx(Ie,{children:"수업과 연결된 시험을 확인하고 추가합니다."})]}),e.jsx(Re,{type:"button",onClick:x,children:"시험 생성"})]}),o&&e.jsx(Ie,{children:"시험을 불러오는 중..."}),r&&e.jsx(Ae,{children:r}),i.length===0?e.jsx(At,{children:e.jsx("p",{children:"아직 등록된 시험이 없습니다."})}):e.jsx(Nt,{children:e.jsxs(It,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"시험명"}),e.jsx("th",{children:"형태"}),e.jsx("th",{children:"평균"}),e.jsxs("th",{className:"manage",children:[e.jsx("div",{className:"manage-header","aria-hidden":"true",children:e.jsx("span",{className:"manage-label",children:"관리"})}),e.jsx("span",{className:"sr-only",children:"관리"})]})]})}),e.jsx("tbody",{children:i.map(m=>e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx(Ft,{children:e.jsx("span",{className:"name",children:m.title})})}),e.jsx("td",{children:Mt(m.inputMode)}),e.jsx("td",{children:Tt(m)}),e.jsx("td",{className:"manage",children:e.jsxs("div",{className:"actions",children:[e.jsx(se,{type:"button","data-variant":"edit",onClick:()=>f(m),children:"수정"}),e.jsx(se,{type:"button","data-variant":"danger",onClick:()=>D(m),children:"삭제"})]})})]},m.id))})]})}),e.jsx(Et,{open:F,title:l==="edit"?"시험 수정":"시험 추가",onClose:R,footer:e.jsxs("div",{style:{display:"inline-flex",gap:8},children:[e.jsx(se,{type:"button",onClick:R,children:"취소"}),e.jsx(Re,{type:"button",onClick:z,disabled:T,children:T?"저장 중…":l==="edit"?"수정":"등록"})]}),children:e.jsxs(Ot,{children:[M&&e.jsx(Ae,{children:M}),e.jsx(Fe,{htmlFor:"exam-title",children:"시험 제목"}),e.jsx(Pt,{id:"exam-title",ref:s,placeholder:"예: 중간고사 수학",onChange:m=>L(m.currentTarget.value)}),e.jsx(Fe,{children:"입력 방식"}),e.jsxs("div",{style:{display:"inline-flex",gap:12},children:[e.jsxs("label",{style:{display:"inline-flex",alignItems:"center",gap:6,cursor:"pointer"},children:[e.jsx("input",{type:"radio",name:"examMode",checked:N==="percent",onChange:()=>C("percent")}),e.jsx("span",{children:"백분율"})]}),e.jsxs("label",{style:{display:"inline-flex",alignItems:"center",gap:6,cursor:"pointer"},children:[e.jsx("input",{type:"radio",name:"examMode",checked:N==="letter",onChange:()=>C("letter")}),e.jsx("span",{children:"등급"})]})]})]})})]})}function Mt(i){switch(i){case"percent":return"백분율";case"letter":return"등급";default:return"백분율"}}function Tt(i){if(i.averageScore==null)return"—";if(i.inputMode==="letter")return Rt(i.averageScore);const o=Math.round(i.averageScore*10)/10;return`${Number.isInteger(o)?String(o):o.toFixed(1)}점`}function Rt(i){const o=Math.round(i);return o>=90?"A":o>=80?"B":o>=70?"C":o>=60?"D":o>=50?"E":"F"}const zt=n.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`,Ie=n.div`
  color: #6b7280;
  font-size: 12px;
`,Ae=n.div`
  color: #b91c1c;
  background: #fee2e2;
  border: 1px solid #fecaca;
  padding: 8px 10px;
  border-radius: 8px;
  font-size: 13px;
`,Nt=n.div`
  overflow: auto;
`,It=n(ce)`
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
`,At=n.div`
  display: grid; gap: 12px; padding: 24px; border: 1px dashed #e2e8f0; border-radius: 12px; background: #f8fafc; text-align: center;
  p { margin: 0; color: #475569; font-size: 14px; font-weight: 600; }
`,Ft=n.div`
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  .name { font-weight: 700; color: #1f2937; }
`,Ot=n.div`
  display: grid; gap: 10px;
`,Fe=n.label`
  color: #6b7280; font-size: 12px; font-weight: 700;
`,Pt=n.input`
  height: 40px; border: 1px solid #e5e7eb; border-radius: 10px; padding: 0 12px; font-size: 14px; color: #111827; width: 100%;
`;function Bt({students:i,loading:o,error:r,editHref:x}){return e.jsxs(V,{children:[e.jsxs(Gt,{children:[e.jsxs("div",{children:[e.jsx(W,{style:{margin:0},children:"수강생 목록"}),e.jsxs(Oe,{children:["총 ",i.length,"명의 학생이 수강중입니다."]})]}),e.jsx(Ge,{to:x,children:"학생 추가"})]}),o&&e.jsx(Oe,{children:"불러오는 중..."}),r&&e.jsx(Ht,{children:r}),e.jsx(_t,{children:e.jsxs(Yt,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"학생명"}),e.jsx("th",{children:"연락처"}),e.jsx("th",{children:"등록일"}),e.jsx("th",{children:"상태"})]})}),e.jsx("tbody",{children:i.length===0&&!o?e.jsx("tr",{children:e.jsx("td",{colSpan:4,style:{color:"#6b7280"},children:"등록된 학생이 없습니다."})}):i.map(f=>e.jsxs("tr",{children:[e.jsxs("td",{children:[e.jsx("strong",{children:f.name}),e.jsx(Vt,{children:f.code})]}),e.jsx("td",{children:mt(f.phoneNumber)}),e.jsx("td",{children:f.joinedDate||"-"}),e.jsx("td",{children:e.jsx(Wt,{"data-type":f.status,children:Ut(f.status)})})]},f.id))})]})})]})}function Ut(i){switch(i){case"ENROLLED":return"수강중";case"ON_LEAVE":return"휴학";case"PENDING":return"대기";default:return i}}const Gt=n.div`
  display: flex; align-items: center; justify-content: space-between;
`,Oe=n.div`
  color: #6b7280; font-size: 12px;
`,Ht=n.div`
  color: #b91c1c; background: #fee2e2; border: 1px solid #fecaca; padding: 8px 10px; border-radius: 8px; font-size: 13px;
`,_t=n.div` overflow: auto; `,Yt=n(ce)`
  thead th { background:#f9fafb; }
  tbody tr:nth-child(even) td { background:#fcfcfd; }
  tbody tr:hover td { background:#f8fafc; }
`,Vt=n.div`
  color: #6b7280; font-size: 11px;
`,Wt=n.span`
  padding: 2px 8px; border-radius: 9999px; font-size: 12px; font-weight: 800;
  &[data-type='ENROLLED'] { background:#dcfce7; color:#16a34a; }
  &[data-type='ON_LEAVE'] { background:#fef3c7; color:#b45309; }
  &[data-type='PENDING'] { background:#f3e8ff; color:#7c3aed; }
`;function Kt({title:i="수업 내역",history:o,filterYear:r,filterMonth:x,onChangeYear:f,onChangeMonth:D,onResetFilters:F,exporting:l,onExport:N,collapsed:M,onToggleCollapsed:T,todayHref:R,detailHrefFor:z,getAttendanceMap:C}){return e.jsxs(V,{children:[e.jsxs(Jt,{children:[e.jsx(W,{children:i}),e.jsxs("div",{style:{display:"inline-flex",gap:8},children:[e.jsx(le,{type:"button",onClick:N,disabled:l,children:l?"엑셀 준비 중...":"엑셀 추출"}),e.jsx(le,{type:"button",onClick:T,children:M?"펼치기":"목록 접기"}),e.jsx(Ge,{to:R,children:"수업 생성"})]})]}),e.jsxs(Xt,{children:[e.jsxs(Pe,{children:[e.jsx(Be,{children:"연도"}),e.jsx(Ue,{value:r??"",onChange:s=>f(Number(s.currentTarget.value)||new Date().getFullYear()),children:qt().map(s=>e.jsxs("option",{value:s,children:[s,"년"]},s))})]}),e.jsxs(Pe,{children:[e.jsx(Be,{children:"월"}),e.jsxs(Ue,{value:x,onChange:s=>D(Number(s.currentTarget.value)),children:[e.jsx("option",{value:0,children:"전체"}),Array.from({length:12},(s,L)=>L+1).map(s=>e.jsxs("option",{value:s,children:[s,"월"]},s))]})]}),e.jsx("div",{style:{flex:1}}),e.jsx(Zt,{type:"button",onClick:F,children:"초기화"})]}),o.length===0&&e.jsx(Qt,{children:"표시할 일정이 없습니다."}),o.map(s=>M?e.jsxs(en,{children:[e.jsxs("div",{className:"left",children:[e.jsx("strong",{children:s.dateLabel}),e.jsx(B,{style:{marginLeft:8},children:s.time}),e.jsx(B,{style:{marginLeft:8},children:s.type})]}),e.jsx("div",{className:"right",children:e.jsx(de,{to:z(s.id,s.date),children:"상세"})})]},s.id||s.dateLabel):e.jsxs(tn,{children:[e.jsxs(nn,{children:[e.jsxs("div",{children:[e.jsx("strong",{children:s.dateLabel}),e.jsx(B,{style:{marginLeft:8},children:s.time}),e.jsx(B,{style:{marginLeft:8},children:s.type}),s.id&&(()=>{const L=C(s.id),m=Object.values(L).filter(y=>y===!0).length,U=Object.values(L).filter(y=>y===!1).length,I=m+U;return I>0?e.jsxs(B,{style:{marginLeft:10},children:["출석 ",m," · 결석 ",U," · 처리 ",I]}):null})()]}),e.jsx("div",{children:e.jsx(de,{to:z(s.id,s.date),children:"상세"})})]}),s.notes&&e.jsx(rn,{children:e.jsx("p",{children:s.notes})})]},s.id||s.dateLabel))]})}function qt(){const i=new Date().getFullYear(),o=i-1,r=i+1,x=[];for(let f=o;f<=r;f++)x.push(f);return x}const Jt=n.div`
  display: flex; align-items: center; justify-content: space-between;
`,Qt=n.div`
  color: #6b7280; font-size: 12px;
`,B=n.span`
  color: #6b7280; font-size: 12px;
`,Xt=n.div`
  display: flex; gap: 12px; align-items: flex-end; margin-bottom: 8px; background:#f9fafb; border:1px solid #f1f5f9; border-radius:10px; padding:8px 10px;
`,Pe=n.label`
  display: grid; gap: 4px;
`,Be=n.span`
  display:block; color:#6b7280; font-size:12px; margin-bottom:4px;
`,Ue=n.select`
  height: 32px; padding: 0 10px; border:1px solid #e5e7eb; border-radius:8px; font-size:12px; background:#fff; min-width:110px;
`,Zt=n.button`
  ${pe.outline}; height:32px; padding:0 12px; font-size:12px;
`,en=n.div`
  display:flex; align-items:center; justify-content:space-between; padding:12px; border:1px solid #f1f5f9; border-radius:10px; margin-bottom:8px; background:#fff;
  .left{ display:flex; align-items:center; }
`,tn=n.div`
  border:1px solid #f1f5f9; border-radius:12px; margin-bottom:10px; overflow:hidden; background:#fff;
`,nn=n.div`
  display:flex; align-items:center; justify-content:space-between; padding:12px; background:#f9fafb;
`,rn=n.div`
  padding:12px;
  p{ margin:0; color:#374151; font-size:14px; }
`;function Pn(){const i=lt(),{id:o}=dt(),r=a.useMemo(()=>o?Number(o):null,[o]),{error:x,success:f}=ct(),{confirm:D,dialog:F}=$t({confirmLabel:"삭제",cancelLabel:"취소",tone:"danger"}),[l,N]=a.useState(null),[M,T]=a.useState(!1),[R,z]=a.useState(null),[C,s]=a.useState([]),[L,m]=a.useState(!1),[U,I]=a.useState(null),[y,fe]=a.useState([]),[Ln,ue]=a.useState(!1),[$n,xe]=a.useState(null),[He,he]=a.useState(!1),[_e,Ye]=a.useState([]),[Ve,ge]=a.useState(!1),[We,G]=a.useState(null),[Ke,K]=a.useState(!1),[q,H]=a.useState("percent"),[me,be]=a.useState(!1),[qe,O]=a.useState(null),[je,J]=a.useState(null),[Q,X]=a.useState("create"),j=a.useRef(null),P=a.useRef(""),[v,Z]=a.useState(null),[A,ye]=a.useState(new Date().getMonth()+1),[Je,ee]=a.useState(!1),[ve,we]=a.useState(!1),[te,Ee]=a.useState({});function E(t,d){return typeof t=="string"?t:t&&typeof t=="object"&&"message"in t&&typeof t.message=="string"&&t.message||d}a.useEffect(()=>{if(!r)return;let t=!1;async function d(){T(!0),z(null);try{const c=await ut(r);t||N(c)}catch(c){t||z(E(c,"수업 정보를 불러오지 못했습니다."))}finally{t||T(!1)}}return d(),()=>{t=!0}},[r]);const _=a.useCallback(async()=>{if(r){ge(!0),G(null);try{const t=await St(r);Ye(t)}catch(t){G(E(t,"시험 목록을 불러오지 못했습니다."))}finally{ge(!1)}}},[r]);a.useEffect(()=>{_()},[_]);function ne(t){return String(t).padStart(2,"0")}function Qe(t,d){return new Date(t,d,0).getDate()}function Se(){if(v==null)return{};let t=`${v}-01-01`,d=`${v}-12-31`;if(A>=1){const c=Qe(v,A);t=`${v}-${ne(A)}-01`,d=`${v}-${ne(A)}-${ne(c)}`}return{from:t,to:d}}function Xe(t){switch(t){case"INDIVIDUAL":return"개인 수업";case"GROUP":return"단체 수업";default:return"단체 수업"}}a.useEffect(()=>{l&&v==null&&Z(new Date().getFullYear())},[l,v]),a.useEffect(()=>{if(!r||v==null)return;let t=!1;async function d(){ue(!0),xe(null);try{const c=Se(),u=await xt(r,c);t||fe(u)}catch(c){if(!t){const u=E(c,"");u.includes("404")?fe([]):xe(u||"수업 내역을 불러오지 못했습니다.")}}finally{t||ue(!1)}}return d(),()=>{t=!0}},[r,v,A]);async function Ze(){if(r){he(!0);try{const t=Se(),d=await ht(r,t),c=l?.title||`course_${r}`,u=t.from&&t.to?`${t.from}_${t.to}`:new Date().toISOString().slice(0,10),p=ln(`${c}_${u}_records`);on(d,`${p}.xlsx`)}catch(t){x(E(t,"수업 내역 엑셀 추출에 실패했습니다."))}finally{he(!1)}}}async function et(){if(!r||me)return;const t=P.current.trim();if(!t){O("시험 제목을 입력해주세요."),j.current?.focus();return}O(null),be(!0);try{Q==="edit"&&je?(await kt(r,je.id,{title:t,inputMode:q}),f("시험이 수정되었습니다.")):(await Ct(r,{title:t,inputMode:q,kind:"TEST"}),f("시험이 생성되었습니다.")),await _(),ke()}catch(d){x(E(d,Q==="edit"?"시험 수정에 실패했습니다.":"시험 생성에 실패했습니다."))}finally{be(!1)}}function tt(){G(null),O(null),P.current="",j.current&&(j.current.value=""),H("percent"),X("create"),J(null),K(!0),requestAnimationFrame(()=>{j.current&&(j.current.value="",j.current.focus())})}function ke(){K(!1),O(null),J(null),X("create"),H("percent"),P.current="",j.current&&(j.current.value="")}function nt(t){G(null),O(null),X("edit"),J(t),H(t.inputMode??"percent"),P.current=t.title??"",K(!0),requestAnimationFrame(()=>{j.current&&(j.current.value=t.title??"",j.current.focus(),j.current.select())})}async function rt(t){if(!(!r||!await D({title:"시험을 삭제할까요?",message:`${t.title||"등록된 시험"}과(와) 해당 성적 데이터를 영구 삭제합니다. 되돌릴 수 없습니다.`})))try{await Lt(r,t.id),f("시험이 삭제되었습니다."),await _()}catch(c){x(E(c,"시험 삭제에 실패했습니다."))}}a.useEffect(()=>{if(!r||y.length===0)return;let t=!1;async function d(){const c=y.map(u=>u.id).filter(u=>typeof u=="number");if(c.length!==0)try{const u=await Promise.all(c.map(async p=>{try{const b=await Ne(r,p),h={};return b.forEach(g=>{h[g.studentId]=!!g.present}),[p,h]}catch{return[p,void 0]}}));t||Ee(p=>{const b={...p};return u.forEach(([h,g])=>{g&&(b[h]=g)}),b})}finally{}}return d(),()=>{t=!0}},[r,y]);const[Dn,Ce]=a.useState(0);a.useEffect(()=>{function t(d){const c=d.detail?.ymd,u=y.filter(p=>!c||p.recordDate===c).map(p=>p.id).filter(p=>typeof p=="number");if(r){if(u.length===0){Ce(p=>p+1);return}(async()=>{try{const p=await Promise.all(u.map(async b=>{try{const h=await Ne(r,b),g={};return h.forEach(w=>{g[w.studentId]=!!w.present}),[b,g]}catch{return[b,void 0]}}));Ee(b=>{const h={...b};return p.forEach(([g,w])=>{w&&(h[g]=w)}),h})}catch{}finally{Ce(p=>p+1)}})()}}return window.addEventListener("calendar:classes-refresh",t),()=>window.removeEventListener("calendar:classes-refresh",t)},[r,y]),a.useEffect(()=>{if(!r)return;let t=!1;async function d(){m(!0),I(null);try{const c=await gt(r);t||s(c)}catch(c){const u=E(c,"");if(u.includes("404"))try{let p=0;const b=100;let h=[];for(;;){const{content:w,last:ae}=await jt({page:p,size:b});if(h=h.concat(w),ae||w.length===0||p>100)break;p+=1}const g=h.filter(w=>(w.courses||[]).some(ae=>ae.id===r));t||s(g)}catch(p){t||I(E(p,"등록 학생을 불러오지 못했습니다."))}else t||I(u||"등록 학생을 불러오지 못했습니다.")}finally{t||m(!1)}}return d(),()=>{t=!0}},[r]);const re=a.useMemo(()=>l?dn(l):null,[l]),$=a.useMemo(()=>l?y.map(t=>({id:t.id,date:new Date(t.recordDate),dateLabel:`${t.recordDate} (${"일월화수목금토"[new Date(t.recordDate).getDay()]})`,time:it(l),type:new Date(t.recordDate)<new Date?"지난 수업":"예정",notes:t.notes||t.content||null})):[],[l,y]);function Le(t){const d=t.getFullYear(),c=String(t.getMonth()+1).padStart(2,"0"),u=String(t.getDate()).padStart(2,"0");return`${d}-${c}-${u}`}function it(t){return t.startTime&&t.endTime?`${Y(t.startTime)} ~ ${Y(t.endTime)}`:t.courseTime||"-"}function $e(t){try{return JSON.parse(localStorage.getItem(`attendance:${r}:${t}`)||"{}")}catch{return{}}}const De=a.useMemo(()=>l?.enrolledCount!=null?l.enrolledCount:C.length,[l,C.length]),at=l?.capacity,ie=a.useMemo(()=>$.filter(t=>t.type==="지난 수업").length,[$]),Me=a.useMemo(()=>{const t=$.length||0;return t?Math.round(ie/t*100):null},[ie,$.length]),Te=a.useMemo(()=>{if(!$.length)return null;let t=0,d=0;for(const c of $){if(!c.id)continue;const u=te[c.id]||$e(c.id),p=Object.values(u).filter(g=>g===!0).length,b=Object.values(u).filter(g=>g===!1).length,h=p+b;h>0&&(t+=p,d+=h)}return d===0?null:Math.round(t/d*100)},[$,te]),[st,ot]=a.useState(!1);return e.jsxs(cn,{children:[e.jsxs(pn,{children:[e.jsxs(bn,{type:"button",onClick:()=>i("/classes"),children:[jn," 뒤로"]}),e.jsx("h2",{children:l?.title||"수업 상세"}),e.jsxs(fn,{children:[e.jsx(ze,{to:`/classes/${r||""}/edit-students`,title:"수강생 수정","data-variant":"edit",children:"수강생 수정"}),e.jsx(ze,{to:`/classes/${r||""}/edit`,title:"기본 정보 수정","data-variant":"edit",children:"기본정보 수정"}),r&&e.jsx(le,{type:"button",onClick:()=>ee(!0),children:"삭제"})]})]}),F,e.jsx(pt,{open:Je,title:"수업(템플릿) 삭제",message:"관련 수업 내역/출결/첨부가 모두 삭제됩니다. 이 작업은 되돌릴 수 없습니다.",confirmLabel:"영구 삭제",cancelLabel:"취소",tone:"danger",busy:ve,onCancel:()=>{ve||ee(!1)},onConfirm:async()=>{if(r){we(!0);try{await ft(r),ee(!1),i("/classes")}catch(t){x(E(t,"삭제에 실패했습니다."))}finally{we(!1)}}}}),R&&e.jsx(gn,{children:R}),M&&e.jsx(mn,{children:"불러오는 중..."}),e.jsxs(yn,{children:[e.jsx(oe,{title:"총 수강생",icon:e.jsx(yt,{}),iconAccent:"indigo",value:e.jsx(e.Fragment,{children:typeof De=="number"?`${De}명`:"—"}),footerLeft:e.jsxs("span",{children:["정원 ",at??"—","명"]})}),e.jsx(oe,{title:"평균 출석률",icon:e.jsx(vt,{}),iconAccent:"green",value:e.jsx(e.Fragment,{children:Te!=null?`${Te}%`:"—"}),footerLeft:e.jsx("span",{children:"처리된 회차 기준"})}),e.jsx(oe,{title:"완료된 수업",icon:e.jsx(wt,{}),iconAccent:"violet",value:e.jsxs(e.Fragment,{children:[ie||0,"회"]}),footerRight:Me!=null?e.jsxs("span",{children:["진행률 ",Me,"%"]}):e.jsx("span",{children:"—"})})]}),re&&e.jsxs(vn,{children:[e.jsx(wn,{children:e.jsxs(En,{children:[e.jsxs(V,{children:[e.jsxs(kn,{children:[e.jsx(W,{children:"수업 정보"}),e.jsx("div",{children:e.jsx(de,{to:`/classes/${r||""}/edit`,"data-variant":"edit",children:"기본정보 수정"})})]}),e.jsxs(un,{children:[e.jsxs(S,{children:[e.jsx(k,{children:"코드"}),e.jsx("div",{children:e.jsx("code",{children:l?.code})})]}),e.jsxs(S,{children:[e.jsx(k,{children:"상태"}),e.jsx("div",{children:e.jsx(hn,{"data-type":l?.status,children:sn(l?.status)})})]}),e.jsxs(S,{children:[e.jsx(k,{children:"수업 형태"}),e.jsx("div",{children:Xe(l?.courseType)})]}),e.jsxs(S,{children:[e.jsx(k,{children:"요일"}),e.jsx("div",{children:re.days||"-"})]}),e.jsxs(S,{children:[e.jsx(k,{children:"시간"}),e.jsx("div",{children:re.time||"-"})]}),e.jsxs(S,{children:[e.jsx(k,{children:"정원"}),e.jsx("div",{children:l?.capacity??"-"})]}),e.jsxs(S,{children:[e.jsx(k,{children:"수강료"}),e.jsx("div",{children:l?.fee!=null?bt(l.fee):"-"})]}),e.jsxs(S,{children:[e.jsx(k,{children:"생성일"}),e.jsx("div",{children:l?.createdAt?new Date(l.createdAt).toLocaleDateString():"-"})]}),e.jsxs(S,{style:{gridColumn:"1 / -1"},children:[e.jsx(k,{children:"수업 설명"}),e.jsx(xn,{children:l?.description||"-"})]})]})]}),e.jsx(Dt,{exams:_e,loading:Ve,error:We,onCreate:tt,onEdit:nt,onDelete:rt,modalOpen:Ke,modalMode:Q,examMode:q,examFormError:qe,examSaving:me,onCloseModal:ke,onSubmitModal:et,onExamModeChange:H,examTitleRef:j,onExamTitleChange:t=>{P.current=t}}),e.jsx(Bt,{students:C,loading:L,error:U,editHref:`/classes/${r||""}/edit-students`})]})}),e.jsxs(Sn,{children:[e.jsx(Kt,{history:$,filterYear:v,filterMonth:A,onChangeYear:t=>Z(t),onChangeMonth:t=>ye(t),onResetFilters:()=>{Z(new Date().getFullYear()),ye(0)},exporting:He,onExport:Ze,collapsed:st,onToggleCollapsed:()=>ot(t=>!t),todayHref:`/classes/${r||""}/history/date/${Le(new Date)}`,detailHrefFor:(t,d)=>t?`/classes/${r}/history/${t}`:`/classes/${r}/history/date/${Le(d)}`,getAttendanceMap:t=>te[t]||$e(t)}),!1]})]})]})}function Y(i){if(!i)return"";const[o,r]=i.split(":");return`${o}:${r}`}function an(i){return{MON:"월",TUE:"화",WED:"수",THU:"목",FRI:"금",SAT:"토",SUN:"일"}[i.toUpperCase()]||i}function sn(i){switch(i){case"IN_PROGRESS":return"진행중";case"PENDING":return"대기";case"STOPPED":return"중단";default:return i||"-"}}function on(i,o){const r=URL.createObjectURL(i),x=document.createElement("a");x.href=r,x.download=o,document.body.appendChild(x),x.click(),x.remove(),URL.revokeObjectURL(r)}function ln(i){const r=(i?i.trim():"export").replace(/[\\/:*?"<>|]+/g,"_");return r.length?r:"export"}function dn(i){const o={MON:0,TUE:1,WED:2,THU:3,FRI:4,SAT:5,SUN:6},r=(i.recurrenceDays||"").split(",").map(f=>f.trim().toUpperCase()).filter(Boolean).sort((f,D)=>o[f]-o[D]).map(an).join("/"),x=i.startTime&&i.endTime?`${Y(i.startTime)} ~ ${Y(i.endTime)}`:i.courseTime||"-";return{days:r,time:x}}const cn=n.div`
  display: grid;
  gap: 12px;
`,pn=n.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 12px;
  align-items: center;
  h2 {
    margin: 0;
  }
`,fn=n.div`
  display: inline-flex;
  gap: 12px;
`,un=n.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`,S=n.div`
  display: grid;
  gap: 6px;
`,k=n.div`
  color: #6b7280;
  font-size: 12px;
  font-weight: 700;
`,xn=n.div`
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
`;const hn=n.span`
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
`;const gn=n.div`
  background: #fee2e2;
  color: #b91c1c;
  border: 1px solid #fecaca;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 13px;
`,mn=n.div`
  color: #6b7280;
  font-size: 12px;
`,bn=n.button`
  ${pe.outline};
  height: 40px;
  padding: 0 16px;
  font-weight: 600;
  font-size: 14px;
`,jn=e.jsx("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"15 18 9 12 15 6"})}),yn=n.div`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 12px;
`,vn=n.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
`,wn=n.div`
  flex: 4 1 0;
  display: grid;
  gap: 12px;
  align-content: flex-start;
`,En=n.div`
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
`,Sn=n.div`
  flex: 6 1 0;
  display: grid;
  gap: 12px;
  align-content: flex-start;
`,kn=n.div`
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
  ${pe.outline};
  height: 32px;
  padding: 0 12px;
  font-size: 12px;
`;const Cn=n(ce)`
  thead th {
    background: #f9fafb;
  }
  tbody tr:nth-child(even) td {
    background: #fcfcfd;
  }
  tbody tr:hover td {
    background: #f8fafc;
  }
`;n(Cn)`
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
`;export{Pn as default};
