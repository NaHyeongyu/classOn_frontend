import{j as e,S as V,t as W,m as Re,w as se,d as n,T as ce,a as Ge,G as le,x as de,c as pe,u as lt,h as dt,r as a,k as ct,y as ze}from"./index-ColAvXhj.js";import{C as pt}from"./ConfirmDialog-DHBjB3H8.js";import{d as ft,g as xt,b as ut,e as ht,f as Ne,h as gt}from"./courses-BGCRkQtB.js";import{b as mt,c as bt}from"./format-Do6vjlY3.js";import{l as yt}from"./students-B2rrXYlj.js";import{K as oe,U as jt,C as vt,a as wt}from"./KPI-mq8la7Xn.js";import{M as Et}from"./Modal-Ct9MXRh8.js";import{l as kt,u as St,c as Ct,d as Lt}from"./exams-Imq5yv_2.js";import{u as $t}from"./useConfirmDialog-oYDuMcAx.js";function Dt({exams:i,loading:c,error:r,onCreate:u,onEdit:f,onDelete:D,modalOpen:O,modalMode:o,examMode:N,examFormError:M,examSaving:T,onCloseModal:R,onSubmitModal:z,onExamModeChange:C,examTitleRef:s,onExamTitleChange:L}){return e.jsxs(V,{children:[e.jsxs(Rt,{children:[e.jsxs("div",{children:[e.jsx(W,{style:{margin:0},children:"시험 관리"}),e.jsx(Ie,{children:"수업과 연결된 시험을 확인하고 추가합니다."})]}),e.jsx(Re,{type:"button",onClick:u,children:"시험 생성"})]}),c&&e.jsx(Ie,{children:"시험을 불러오는 중..."}),r&&e.jsx(Ae,{children:r}),i.length===0?e.jsx(It,{children:e.jsx("p",{children:"아직 등록된 시험이 없습니다."})}):e.jsx(zt,{children:e.jsxs(Nt,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"시험명"}),e.jsx("th",{children:"형태"}),e.jsx("th",{children:"평균"}),e.jsxs("th",{className:"manage",children:[e.jsx("div",{className:"manage-header","aria-hidden":"true",children:e.jsx("span",{className:"manage-label",children:"관리"})}),e.jsx("span",{className:"sr-only",children:"관리"})]})]})}),e.jsx("tbody",{children:i.map(m=>e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx(At,{children:e.jsx("span",{className:"name",children:m.title})})}),e.jsx("td",{children:Mt(m.inputMode)}),e.jsx("td",{children:m.averageScore!=null?Tt(m.averageScore):"—"}),e.jsx("td",{className:"manage",children:e.jsxs("div",{className:"actions",children:[e.jsx(se,{type:"button","data-variant":"edit",onClick:()=>f(m),children:"수정"}),e.jsx(se,{type:"button","data-variant":"danger",onClick:()=>D(m),children:"삭제"})]})})]},m.id))})]})}),e.jsx(Et,{open:O,title:o==="edit"?"시험 수정":"시험 추가",onClose:R,footer:e.jsxs("div",{style:{display:"inline-flex",gap:8},children:[e.jsx(se,{type:"button",onClick:R,children:"취소"}),e.jsx(Re,{type:"button",onClick:z,disabled:T,children:T?"저장 중…":o==="edit"?"수정":"등록"})]}),children:e.jsxs(Ot,{children:[M&&e.jsx(Ae,{children:M}),e.jsx(Oe,{htmlFor:"exam-title",children:"시험 제목"}),e.jsx(Ft,{id:"exam-title",ref:s,placeholder:"예: 중간고사 수학",onChange:m=>L(m.currentTarget.value)}),e.jsx(Oe,{children:"입력 방식"}),e.jsxs("div",{style:{display:"inline-flex",gap:12},children:[e.jsxs("label",{style:{display:"inline-flex",alignItems:"center",gap:6,cursor:"pointer"},children:[e.jsx("input",{type:"radio",name:"examMode",checked:N==="percent",onChange:()=>C("percent")}),e.jsx("span",{children:"백분율"})]}),e.jsxs("label",{style:{display:"inline-flex",alignItems:"center",gap:6,cursor:"pointer"},children:[e.jsx("input",{type:"radio",name:"examMode",checked:N==="letter",onChange:()=>C("letter")}),e.jsx("span",{children:"등급"})]})]})]})})]})}function Mt(i){switch(i){case"percent":return"백분율";case"letter":return"등급";default:return"백분율"}}function Tt(i){const c=Math.round(i);return c>=90?"A":c>=80?"B":c>=70?"C":c>=60?"D":c>=50?"E":"F"}const Rt=n.div`
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
`,zt=n.div`
  overflow: auto;
`,Nt=n(ce)`
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
`,It=n.div`
  display: grid; gap: 12px; padding: 24px; border: 1px dashed #e2e8f0; border-radius: 12px; background: #f8fafc; text-align: center;
  p { margin: 0; color: #475569; font-size: 14px; font-weight: 600; }
`,At=n.div`
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  .name { font-weight: 700; color: #1f2937; }
`,Ot=n.div`
  display: grid; gap: 10px;
`,Oe=n.label`
  color: #6b7280; font-size: 12px; font-weight: 700;
`,Ft=n.input`
  height: 40px; border: 1px solid #e5e7eb; border-radius: 10px; padding: 0 12px; font-size: 14px; color: #111827; width: 100%;
`;function Pt({students:i,loading:c,error:r,editHref:u}){return e.jsxs(V,{children:[e.jsxs(Ut,{children:[e.jsxs("div",{children:[e.jsx(W,{style:{margin:0},children:"수강생 목록"}),e.jsxs(Fe,{children:["총 ",i.length,"명의 학생이 수강중입니다."]})]}),e.jsx(Ge,{to:u,children:"학생 추가"})]}),c&&e.jsx(Fe,{children:"불러오는 중..."}),r&&e.jsx(Gt,{children:r}),e.jsx(Ht,{children:e.jsxs(_t,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"학생명"}),e.jsx("th",{children:"연락처"}),e.jsx("th",{children:"등록일"}),e.jsx("th",{children:"상태"})]})}),e.jsx("tbody",{children:i.length===0&&!c?e.jsx("tr",{children:e.jsx("td",{colSpan:4,style:{color:"#6b7280"},children:"등록된 학생이 없습니다."})}):i.map(f=>e.jsxs("tr",{children:[e.jsxs("td",{children:[e.jsx("strong",{children:f.name}),e.jsx(Yt,{children:f.code})]}),e.jsx("td",{children:mt(f.phoneNumber)}),e.jsx("td",{children:f.joinedDate||"-"}),e.jsx("td",{children:e.jsx(Vt,{"data-type":f.status,children:Bt(f.status)})})]},f.id))})]})})]})}function Bt(i){switch(i){case"ENROLLED":return"수강중";case"ON_LEAVE":return"휴학";case"PENDING":return"대기";default:return i}}const Ut=n.div`
  display: flex; align-items: center; justify-content: space-between;
`,Fe=n.div`
  color: #6b7280; font-size: 12px;
`,Gt=n.div`
  color: #b91c1c; background: #fee2e2; border: 1px solid #fecaca; padding: 8px 10px; border-radius: 8px; font-size: 13px;
`,Ht=n.div` overflow: auto; `,_t=n(ce)`
  thead th { background:#f9fafb; }
  tbody tr:nth-child(even) td { background:#fcfcfd; }
  tbody tr:hover td { background:#f8fafc; }
`,Yt=n.div`
  color: #6b7280; font-size: 11px;
`,Vt=n.span`
  padding: 2px 8px; border-radius: 9999px; font-size: 12px; font-weight: 800;
  &[data-type='ENROLLED'] { background:#dcfce7; color:#16a34a; }
  &[data-type='ON_LEAVE'] { background:#fef3c7; color:#b45309; }
  &[data-type='PENDING'] { background:#f3e8ff; color:#7c3aed; }
`;function Wt({title:i="수업 내역",history:c,filterYear:r,filterMonth:u,onChangeYear:f,onChangeMonth:D,onResetFilters:O,exporting:o,onExport:N,collapsed:M,onToggleCollapsed:T,todayHref:R,detailHrefFor:z,getAttendanceMap:C}){return e.jsxs(V,{children:[e.jsxs(qt,{children:[e.jsx(W,{children:i}),e.jsxs("div",{style:{display:"inline-flex",gap:8},children:[e.jsx(le,{type:"button",onClick:N,disabled:o,children:o?"엑셀 준비 중...":"엑셀 추출"}),e.jsx(le,{type:"button",onClick:T,children:M?"펼치기":"목록 접기"}),e.jsx(Ge,{to:R,children:"수업 생성"})]})]}),e.jsxs(Qt,{children:[e.jsxs(Pe,{children:[e.jsx(Be,{children:"연도"}),e.jsx(Ue,{value:r??"",onChange:s=>f(Number(s.currentTarget.value)||new Date().getFullYear()),children:Kt().map(s=>e.jsxs("option",{value:s,children:[s,"년"]},s))})]}),e.jsxs(Pe,{children:[e.jsx(Be,{children:"월"}),e.jsxs(Ue,{value:u,onChange:s=>D(Number(s.currentTarget.value)),children:[e.jsx("option",{value:0,children:"전체"}),Array.from({length:12},(s,L)=>L+1).map(s=>e.jsxs("option",{value:s,children:[s,"월"]},s))]})]}),e.jsx("div",{style:{flex:1}}),e.jsx(Xt,{type:"button",onClick:O,children:"초기화"})]}),c.length===0&&e.jsx(Jt,{children:"표시할 일정이 없습니다."}),c.map(s=>M?e.jsxs(Zt,{children:[e.jsxs("div",{className:"left",children:[e.jsx("strong",{children:s.dateLabel}),e.jsx(B,{style:{marginLeft:8},children:s.time}),e.jsx(B,{style:{marginLeft:8},children:s.type})]}),e.jsx("div",{className:"right",children:e.jsx(de,{to:z(s.id,s.date),children:"상세"})})]},s.id||s.dateLabel):e.jsxs(en,{children:[e.jsxs(tn,{children:[e.jsxs("div",{children:[e.jsx("strong",{children:s.dateLabel}),e.jsx(B,{style:{marginLeft:8},children:s.time}),e.jsx(B,{style:{marginLeft:8},children:s.type}),s.id&&(()=>{const L=C(s.id),m=Object.values(L).filter(j=>j===!0).length,U=Object.values(L).filter(j=>j===!1).length,I=m+U;return I>0?e.jsxs(B,{style:{marginLeft:10},children:["출석 ",m," · 결석 ",U," · 처리 ",I]}):null})()]}),e.jsx("div",{children:e.jsx(de,{to:z(s.id,s.date),children:"상세"})})]}),s.notes&&e.jsx(nn,{children:e.jsx("p",{children:s.notes})})]},s.id||s.dateLabel))]})}function Kt(){const i=new Date().getFullYear(),c=i-1,r=i+1,u=[];for(let f=c;f<=r;f++)u.push(f);return u}const qt=n.div`
  display: flex; align-items: center; justify-content: space-between;
`,Jt=n.div`
  color: #6b7280; font-size: 12px;
`,B=n.span`
  color: #6b7280; font-size: 12px;
`,Qt=n.div`
  display: flex; gap: 12px; align-items: flex-end; margin-bottom: 8px; background:#f9fafb; border:1px solid #f1f5f9; border-radius:10px; padding:8px 10px;
`,Pe=n.label`
  display: grid; gap: 4px;
`,Be=n.span`
  display:block; color:#6b7280; font-size:12px; margin-bottom:4px;
`,Ue=n.select`
  height: 32px; padding: 0 10px; border:1px solid #e5e7eb; border-radius:8px; font-size:12px; background:#fff; min-width:110px;
`,Xt=n.button`
  ${pe.outline}; height:32px; padding:0 12px; font-size:12px;
`,Zt=n.div`
  display:flex; align-items:center; justify-content:space-between; padding:12px; border:1px solid #f1f5f9; border-radius:10px; margin-bottom:8px; background:#fff;
  .left{ display:flex; align-items:center; }
`,en=n.div`
  border:1px solid #f1f5f9; border-radius:12px; margin-bottom:10px; overflow:hidden; background:#fff;
`,tn=n.div`
  display:flex; align-items:center; justify-content:space-between; padding:12px; background:#f9fafb;
`,nn=n.div`
  padding:12px;
  p{ margin:0; color:#374151; font-size:14px; }
`;function Fn(){const i=lt(),{id:c}=dt(),r=a.useMemo(()=>c?Number(c):null,[c]),{error:u,success:f}=ct(),{confirm:D,dialog:O}=$t({confirmLabel:"삭제",cancelLabel:"취소",tone:"danger"}),[o,N]=a.useState(null),[M,T]=a.useState(!1),[R,z]=a.useState(null),[C,s]=a.useState([]),[L,m]=a.useState(!1),[U,I]=a.useState(null),[j,fe]=a.useState([]),[Cn,xe]=a.useState(!1),[Ln,ue]=a.useState(null),[He,he]=a.useState(!1),[_e,Ye]=a.useState([]),[Ve,ge]=a.useState(!1),[We,G]=a.useState(null),[Ke,K]=a.useState(!1),[q,H]=a.useState("percent"),[me,be]=a.useState(!1),[qe,F]=a.useState(null),[ye,J]=a.useState(null),[Q,X]=a.useState("create"),y=a.useRef(null),P=a.useRef(""),[v,Z]=a.useState(null),[A,je]=a.useState(new Date().getMonth()+1),[Je,ee]=a.useState(!1),[ve,we]=a.useState(!1),[te,Ee]=a.useState({});function E(t,l){return typeof t=="string"?t:t&&typeof t=="object"&&"message"in t&&typeof t.message=="string"&&t.message||l}a.useEffect(()=>{if(!r)return;let t=!1;async function l(){T(!0),z(null);try{const d=await xt(r);t||N(d)}catch(d){t||z(E(d,"수업 정보를 불러오지 못했습니다."))}finally{t||T(!1)}}return l(),()=>{t=!0}},[r]);const _=a.useCallback(async()=>{if(r){ge(!0),G(null);try{const t=await kt(r);Ye(t)}catch(t){G(E(t,"시험 목록을 불러오지 못했습니다."))}finally{ge(!1)}}},[r]);a.useEffect(()=>{_()},[_]);function ne(t){return String(t).padStart(2,"0")}function Qe(t,l){return new Date(t,l,0).getDate()}function ke(){if(v==null)return{};let t=`${v}-01-01`,l=`${v}-12-31`;if(A>=1){const d=Qe(v,A);t=`${v}-${ne(A)}-01`,l=`${v}-${ne(A)}-${ne(d)}`}return{from:t,to:l}}function Xe(t){switch(t){case"INDIVIDUAL":return"개인 수업";case"GROUP":return"단체 수업";default:return"단체 수업"}}a.useEffect(()=>{o&&v==null&&Z(new Date().getFullYear())},[o,v]),a.useEffect(()=>{if(!r||v==null)return;let t=!1;async function l(){xe(!0),ue(null);try{const d=ke(),x=await ut(r,d);t||fe(x)}catch(d){if(!t){const x=E(d,"");x.includes("404")?fe([]):ue(x||"수업 내역을 불러오지 못했습니다.")}}finally{t||xe(!1)}}return l(),()=>{t=!0}},[r,v,A]);async function Ze(){if(r){he(!0);try{const t=ke(),l=await ht(r,t),d=o?.title||`course_${r}`,x=t.from&&t.to?`${t.from}_${t.to}`:new Date().toISOString().slice(0,10),p=on(`${d}_${x}_records`);sn(l,`${p}.xlsx`)}catch(t){u(E(t,"수업 내역 엑셀 추출에 실패했습니다."))}finally{he(!1)}}}async function et(){if(!r||me)return;const t=P.current.trim();if(!t){F("시험 제목을 입력해주세요."),y.current?.focus();return}F(null),be(!0);try{Q==="edit"&&ye?(await St(r,ye.id,{title:t,inputMode:q}),f("시험이 수정되었습니다.")):(await Ct(r,{title:t,inputMode:q,kind:"TEST"}),f("시험이 생성되었습니다.")),await _(),Se()}catch(l){u(E(l,Q==="edit"?"시험 수정에 실패했습니다.":"시험 생성에 실패했습니다."))}finally{be(!1)}}function tt(){G(null),F(null),P.current="",y.current&&(y.current.value=""),H("percent"),X("create"),J(null),K(!0),requestAnimationFrame(()=>{y.current&&(y.current.value="",y.current.focus())})}function Se(){K(!1),F(null),J(null),X("create"),H("percent"),P.current="",y.current&&(y.current.value="")}function nt(t){G(null),F(null),X("edit"),J(t),H(t.inputMode??"percent"),P.current=t.title??"",K(!0),requestAnimationFrame(()=>{y.current&&(y.current.value=t.title??"",y.current.focus(),y.current.select())})}async function rt(t){if(!(!r||!await D({title:"시험을 삭제할까요?",message:`${t.title||"등록된 시험"}과(와) 해당 성적 데이터를 영구 삭제합니다. 되돌릴 수 없습니다.`})))try{await Lt(r,t.id),f("시험이 삭제되었습니다."),await _()}catch(d){u(E(d,"시험 삭제에 실패했습니다."))}}a.useEffect(()=>{if(!r||j.length===0)return;let t=!1;async function l(){const d=j.map(x=>x.id).filter(x=>typeof x=="number");if(d.length!==0)try{const x=await Promise.all(d.map(async p=>{try{const b=await Ne(r,p),h={};return b.forEach(g=>{h[g.studentId]=!!g.present}),[p,h]}catch{return[p,void 0]}}));t||Ee(p=>{const b={...p};return x.forEach(([h,g])=>{g&&(b[h]=g)}),b})}finally{}}return l(),()=>{t=!0}},[r,j]);const[$n,Ce]=a.useState(0);a.useEffect(()=>{function t(l){const d=l.detail?.ymd,x=j.filter(p=>!d||p.recordDate===d).map(p=>p.id).filter(p=>typeof p=="number");if(r){if(x.length===0){Ce(p=>p+1);return}(async()=>{try{const p=await Promise.all(x.map(async b=>{try{const h=await Ne(r,b),g={};return h.forEach(w=>{g[w.studentId]=!!w.present}),[b,g]}catch{return[b,void 0]}}));Ee(b=>{const h={...b};return p.forEach(([g,w])=>{w&&(h[g]=w)}),h})}catch{}finally{Ce(p=>p+1)}})()}}return window.addEventListener("calendar:classes-refresh",t),()=>window.removeEventListener("calendar:classes-refresh",t)},[r,j]),a.useEffect(()=>{if(!r)return;let t=!1;async function l(){m(!0),I(null);try{const d=await gt(r);t||s(d)}catch(d){const x=E(d,"");if(x.includes("404"))try{let p=0;const b=100;let h=[];for(;;){const{content:w,last:ae}=await yt({page:p,size:b});if(h=h.concat(w),ae||w.length===0||p>100)break;p+=1}const g=h.filter(w=>(w.courses||[]).some(ae=>ae.id===r));t||s(g)}catch(p){t||I(E(p,"등록 학생을 불러오지 못했습니다."))}else t||I(x||"등록 학생을 불러오지 못했습니다.")}finally{t||m(!1)}}return l(),()=>{t=!0}},[r]);const re=a.useMemo(()=>o?ln(o):null,[o]),$=a.useMemo(()=>o?j.map(t=>({id:t.id,date:new Date(t.recordDate),dateLabel:`${t.recordDate} (${"일월화수목금토"[new Date(t.recordDate).getDay()]})`,time:it(o),type:new Date(t.recordDate)<new Date?"지난 수업":"예정",notes:t.notes||t.content||null})):[],[o,j]);function Le(t){const l=t.getFullYear(),d=String(t.getMonth()+1).padStart(2,"0"),x=String(t.getDate()).padStart(2,"0");return`${l}-${d}-${x}`}function it(t){return t.startTime&&t.endTime?`${Y(t.startTime)} ~ ${Y(t.endTime)}`:t.courseTime||"-"}function $e(t){try{return JSON.parse(localStorage.getItem(`attendance:${r}:${t}`)||"{}")}catch{return{}}}const De=a.useMemo(()=>o?.enrolledCount!=null?o.enrolledCount:C.length,[o,C.length]),at=o?.capacity,ie=a.useMemo(()=>$.filter(t=>t.type==="지난 수업").length,[$]),Me=a.useMemo(()=>{const t=$.length||0;return t?Math.round(ie/t*100):null},[ie,$.length]),Te=a.useMemo(()=>{if(!$.length)return null;let t=0,l=0;for(const d of $){if(!d.id)continue;const x=te[d.id]||$e(d.id),p=Object.values(x).filter(g=>g===!0).length,b=Object.values(x).filter(g=>g===!1).length,h=p+b;h>0&&(t+=p,l+=h)}return l===0?null:Math.round(t/l*100)},[$,te]),[st,ot]=a.useState(!1);return e.jsxs(dn,{children:[e.jsxs(cn,{children:[e.jsxs(mn,{type:"button",onClick:()=>i("/classes"),children:[bn," 뒤로"]}),e.jsx("h2",{children:o?.title||"수업 상세"}),e.jsxs(pn,{children:[e.jsx(ze,{to:`/classes/${r||""}/edit-students`,title:"수강생 수정","data-variant":"edit",children:"수강생 수정"}),e.jsx(ze,{to:`/classes/${r||""}/edit`,title:"기본 정보 수정","data-variant":"edit",children:"기본정보 수정"}),r&&e.jsx(le,{type:"button",onClick:()=>ee(!0),children:"삭제"})]})]}),O,e.jsx(pt,{open:Je,title:"수업(템플릿) 삭제",message:"관련 수업 내역/출결/첨부가 모두 삭제됩니다. 이 작업은 되돌릴 수 없습니다.",confirmLabel:"영구 삭제",cancelLabel:"취소",tone:"danger",busy:ve,onCancel:()=>{ve||ee(!1)},onConfirm:async()=>{if(r){we(!0);try{await ft(r),ee(!1),i("/classes")}catch(t){u(E(t,"삭제에 실패했습니다."))}finally{we(!1)}}}}),R&&e.jsx(hn,{children:R}),M&&e.jsx(gn,{children:"불러오는 중..."}),e.jsxs(yn,{children:[e.jsx(oe,{title:"총 수강생",icon:e.jsx(jt,{}),iconAccent:"indigo",value:e.jsx(e.Fragment,{children:typeof De=="number"?`${De}명`:"—"}),footerLeft:e.jsxs("span",{children:["정원 ",at??"—","명"]})}),e.jsx(oe,{title:"평균 출석률",icon:e.jsx(vt,{}),iconAccent:"green",value:e.jsx(e.Fragment,{children:Te!=null?`${Te}%`:"—"}),footerLeft:e.jsx("span",{children:"처리된 회차 기준"})}),e.jsx(oe,{title:"완료된 수업",icon:e.jsx(wt,{}),iconAccent:"violet",value:e.jsxs(e.Fragment,{children:[ie||0,"회"]}),footerRight:Me!=null?e.jsxs("span",{children:["진행률 ",Me,"%"]}):e.jsx("span",{children:"—"})})]}),re&&e.jsxs(jn,{children:[e.jsx(vn,{children:e.jsxs(wn,{children:[e.jsxs(V,{children:[e.jsxs(kn,{children:[e.jsx(W,{children:"수업 정보"}),e.jsx("div",{children:e.jsx(de,{to:`/classes/${r||""}/edit`,"data-variant":"edit",children:"기본정보 수정"})})]}),e.jsxs(fn,{children:[e.jsxs(k,{children:[e.jsx(S,{children:"코드"}),e.jsx("div",{children:e.jsx("code",{children:o?.code})})]}),e.jsxs(k,{children:[e.jsx(S,{children:"상태"}),e.jsx("div",{children:e.jsx(un,{"data-type":o?.status,children:an(o?.status)})})]}),e.jsxs(k,{children:[e.jsx(S,{children:"수업 형태"}),e.jsx("div",{children:Xe(o?.courseType)})]}),e.jsxs(k,{children:[e.jsx(S,{children:"요일"}),e.jsx("div",{children:re.days||"-"})]}),e.jsxs(k,{children:[e.jsx(S,{children:"시간"}),e.jsx("div",{children:re.time||"-"})]}),e.jsxs(k,{children:[e.jsx(S,{children:"정원"}),e.jsx("div",{children:o?.capacity??"-"})]}),e.jsxs(k,{children:[e.jsx(S,{children:"수강료"}),e.jsx("div",{children:o?.fee!=null?bt(o.fee):"-"})]}),e.jsxs(k,{children:[e.jsx(S,{children:"생성일"}),e.jsx("div",{children:o?.createdAt?new Date(o.createdAt).toLocaleDateString():"-"})]}),e.jsxs(k,{style:{gridColumn:"1 / -1"},children:[e.jsx(S,{children:"수업 설명"}),e.jsx(xn,{children:o?.description||"-"})]})]})]}),e.jsx(Dt,{exams:_e,loading:Ve,error:We,onCreate:tt,onEdit:nt,onDelete:rt,modalOpen:Ke,modalMode:Q,examMode:q,examFormError:qe,examSaving:me,onCloseModal:Se,onSubmitModal:et,onExamModeChange:H,examTitleRef:y,onExamTitleChange:t=>{P.current=t}}),e.jsx(Pt,{students:C,loading:L,error:U,editHref:`/classes/${r||""}/edit-students`})]})}),e.jsxs(En,{children:[e.jsx(Wt,{history:$,filterYear:v,filterMonth:A,onChangeYear:t=>Z(t),onChangeMonth:t=>je(t),onResetFilters:()=>{Z(new Date().getFullYear()),je(0)},exporting:He,onExport:Ze,collapsed:st,onToggleCollapsed:()=>ot(t=>!t),todayHref:`/classes/${r||""}/history/date/${Le(new Date)}`,detailHrefFor:(t,l)=>t?`/classes/${r}/history/${t}`:`/classes/${r}/history/date/${Le(l)}`,getAttendanceMap:t=>te[t]||$e(t)}),!1]})]})]})}function Y(i){if(!i)return"";const[c,r]=i.split(":");return`${c}:${r}`}function rn(i){return{MON:"월",TUE:"화",WED:"수",THU:"목",FRI:"금",SAT:"토",SUN:"일"}[i.toUpperCase()]||i}function an(i){switch(i){case"IN_PROGRESS":return"진행중";case"PENDING":return"대기";case"STOPPED":return"중단";default:return i||"-"}}function sn(i,c){const r=URL.createObjectURL(i),u=document.createElement("a");u.href=r,u.download=c,document.body.appendChild(u),u.click(),u.remove(),URL.revokeObjectURL(r)}function on(i){const r=(i?i.trim():"export").replace(/[\\/:*?"<>|]+/g,"_");return r.length?r:"export"}function ln(i){const c={MON:0,TUE:1,WED:2,THU:3,FRI:4,SAT:5,SUN:6},r=(i.recurrenceDays||"").split(",").map(f=>f.trim().toUpperCase()).filter(Boolean).sort((f,D)=>c[f]-c[D]).map(rn).join("/"),u=i.startTime&&i.endTime?`${Y(i.startTime)} ~ ${Y(i.endTime)}`:i.courseTime||"-";return{days:r,time:u}}const dn=n.div`
  display: grid;
  gap: 12px;
`,cn=n.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 12px;
  align-items: center;
  h2 {
    margin: 0;
  }
`,pn=n.div`
  display: inline-flex;
  gap: 12px;
`,fn=n.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`,k=n.div`
  display: grid;
  gap: 6px;
`,S=n.div`
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
`;const un=n.span`
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
`;const hn=n.div`
  background: #fee2e2;
  color: #b91c1c;
  border: 1px solid #fecaca;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 13px;
`,gn=n.div`
  color: #6b7280;
  font-size: 12px;
`,mn=n.button`
  ${pe.outline};
  height: 40px;
  padding: 0 16px;
  font-weight: 600;
  font-size: 14px;
`,bn=e.jsx("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"15 18 9 12 15 6"})}),yn=n.div`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 12px;
`,jn=n.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
`,vn=n.div`
  flex: 4 1 0;
  display: grid;
  gap: 12px;
  align-content: flex-start;
`,wn=n.div`
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
`,En=n.div`
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
`;const Sn=n(ce)`
  thead th {
    background: #f9fafb;
  }
  tbody tr:nth-child(even) td {
    background: #fcfcfd;
  }
  tbody tr:hover td {
    background: #f8fafc;
  }
`;n(Sn)`
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
`;export{Fn as default};
