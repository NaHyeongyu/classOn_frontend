import{u as wt,e as Ct,r,g as St,j as e,t as U,P as V,T as kt,d as n,s as Et,b as st}from"./index-BONIAwcU.js";import{S as J}from"./SelectBox-ByhnF_qN.js";import{B as Mt}from"./BackButton-BYyQqFEH.js";import{C as $t}from"./ConfirmDialog-D6GHpncU.js";import{d as Dt,l as W,a as Nt,c as zt,u as It}from"./counsels-CoTO0lDG.js";import{g as Lt,b as Tt}from"./students-D_51L6uV.js";import{f as _e}from"./format-CD1P4D3U.js";function In(){const d=wt(),{id:l,tab:c}=Ct(),s=r.useMemo(()=>Number(l),[l]),[o,m]=r.useState(null),[h,g]=r.useState(!1),[v,T]=r.useState(null),[$,fe]=r.useState(""),[je,te]=r.useState(!1),[me,ne]=r.useState(""),[w,se]=r.useState([]),[be,ye]=r.useState(""),[A,ie]=r.useState(null),[ve,R]=r.useState(""),[D,it]=r.useState([]),[rt,we]=r.useState(!1),[Ce,Se]=r.useState(null),[ke,F]=r.useState([]),[ot,Ee]=r.useState(!1),[Me,C]=r.useState(null),[$e,De]=r.useState(!1),[Ne,re]=r.useState(!1),[oe,ze]=r.useState(()=>{const t=new Date;return`${t.getFullYear()}-${x(t.getMonth()+1)}-${x(t.getDate())}`}),[B,P]=r.useState(""),[O,H]=r.useState(""),[Ie,ae]=r.useState(""),[at,Le]=r.useState(!1),[dt,de]=r.useState(null),[le,ce]=r.useState(null),[Te,Ae]=r.useState(!1),[Y,N]=r.useState(""),[_,z]=r.useState(""),[G,I]=r.useState(""),[Re,K]=r.useState(""),[lt,Fe]=r.useState(!1),{error:Be}=St(),ct=r.useMemo(()=>{if(!o?.birthDate)return;const[t,a,i]=o.birthDate.split("-").map(Number);if(!t||!a||!i)return;const y=new Date;let He=y.getFullYear()-t;const Ye=y.getMonth()+1,vt=y.getDate();return(Ye<a||Ye===a&&vt<i)&&(He-=1),He},[o?.birthDate]),f=r.useMemo(()=>{switch(c){case"courses":case"attendance":case"counsels":return c;default:return"courses"}},[c]);function xt(t){switch(t){case"IN_PROGRESS":return"진행중";case"PENDING":return"대기";case"STOPPED":return"중단";default:return t}}r.useEffect(()=>{if(!s||Number.isNaN(s))return;let t=!1;async function a(){g(!0),T(null);try{const i=await Lt(s);t||m(i)}catch(i){t||T(i?.message||"원생 정보를 불러오지 못했습니다.")}finally{t||g(!1)}}return a(),()=>{t=!0}},[s]),r.useEffect(()=>{if(!s||f!=="counsels")return;let t=!1;async function a(){Ee(!0),C(null);try{const i=await W({studentId:s,size:100});t||F(i.content||[])}catch(i){t||C(i?.message||"상담 기록을 불러오지 못했습니다.")}finally{t||Ee(!1)}}return a(),()=>{t=!0}},[s,f]);async function ut(){if(s){De(!0);try{const t=await Nt({studentId:s}),a=o?.name||`student_${s}`,i=pn(`${a}_counsels`);un(t,`${i}.xlsx`)}catch(t){Be(t?.message||"상담 기록 엑셀 추출에 실패했습니다.")}finally{De(!1)}}}r.useEffect(()=>{if(s)try{const t=localStorage.getItem(`student:notes:${s}`)||"";fe(t),ne(t)}catch{}},[s]),r.useEffect(()=>{if(s)try{const t=localStorage.getItem(`student:memos:${s}`),a=t?JSON.parse(t):[];se(Array.isArray(a)?a:[])}catch{se([])}},[s]),r.useEffect(()=>{if(!s||f!=="attendance")return;let t=!1;async function a(){we(!0),Se(null);try{const i=await Tt(s,{size:200});t||it(i?.content||[])}catch(i){t||Se(i?.message||"출석 정보를 불러오지 못했습니다.")}finally{t||we(!1)}}return a(),()=>{t=!0}},[s,f]);function pt(){if(!s)return;const t=(me||"").trim();fe(t),te(!1);try{localStorage.setItem(`student:notes:${s}`,t)}catch{}}function xe(t){se(t);try{localStorage.setItem(`student:memos:${s}`,JSON.stringify(t))}catch{}}function ht(){if(!s)return;const t=(be||"").trim();if(!t)return;const a=new Date().toISOString(),i={id:Date.now(),text:t,createdAt:a};xe([i,...w]),ye("")}function gt(t){const a=w.find(i=>i.id===t);a&&(ie(t),R(a.text))}function ft(){if(A==null)return;const t=(ve||"").trim(),a=new Date().toISOString(),i=w.map(y=>y.id===A?{...y,text:t,updatedAt:a}:y);xe(i),ie(null),R("")}function jt(){ie(null),R("")}function mt(t){const a=w.filter(i=>i.id!==t);xe(a)}const Pe=r.useMemo(()=>Array.from({length:24},(t,a)=>String(a).padStart(2,"0")),[]),Oe=r.useMemo(()=>["00","05","10","15","20","25","30","35","40","45","50","55"],[]);async function bt(){if(!(!s||!oe||!B||!O)){Le(!0),C(null);try{const t=`${oe}T${B}:${O}:00`;await zt({studentId:s,counselTime:t,content:Ie||void 0});const a=await W({studentId:s,size:100});F(a.content||[]),re(!1),P(""),H(""),ae("")}catch(t){C(t?.message||"저장에 실패했습니다.")}finally{Le(!1)}}}async function yt(t){if(!(!Y||!_||!G)){Fe(!0),C(null);try{const a=`${Y}T${_}:${G}:00`;await It(t,{counselTime:a,content:Re||void 0});const i=await W({studentId:s,size:100});F(i.content||[]),de(null),N(""),z(""),I(""),K("")}catch(a){C(a?.message||"수정에 실패했습니다.")}finally{Fe(!1)}}}return e.jsxs(At,{children:[e.jsxs(Rt,{children:[e.jsx(Mt,{to:"/students",label:"뒤로"}),e.jsx("h2",{children:"원생 상세"})]}),e.jsxs(Ft,{children:["원생 관리 > ",o?.name||"상세"]}),h&&e.jsxs(Ge,{children:[e.jsxs(Ke,{children:[e.jsxs(b,{children:[e.jsx(S,{children:"기본 정보"}),e.jsxs(cn,{children:[e.jsx(ln,{}),e.jsxs("div",{children:[e.jsx(Z,{w:140,h:18}),e.jsx(Z,{w:120,h:12,mt:6})]}),e.jsx(xn,{})]}),e.jsx(M,{}),e.jsx(M,{}),e.jsx(M,{}),e.jsx(M,{})]}),e.jsxs(b,{children:[e.jsx(S,{children:"부모님 정보"}),e.jsx(M,{}),e.jsx(M,{})]})]}),e.jsx(Ue,{children:e.jsxs(b,{children:[e.jsx(We,{children:e.jsxs(qe,{children:[e.jsxs(E,{"data-active":!0,children:["수강수업 ",e.jsx(Qe,{children:"0"})]}),e.jsx(E,{children:"출석현황"}),e.jsx(E,{children:"상담기록"})]})}),e.jsx(Ve,{}),e.jsxs(Q,{children:[e.jsx(Z,{w:240,h:14}),e.jsx(Z,{w:560,h:120,mt:10})]})]})})]}),v&&e.jsx(he,{children:v}),!h&&e.jsxs(Ge,{children:[e.jsxs(Ke,{children:[e.jsxs(b,{children:[e.jsxs(q,{children:[e.jsx(S,{children:"기본 정보"}),e.jsx(ue,{children:e.jsx(U,{as:"button",onClick:()=>d(`/students/${s}/edit`),children:"수정"})})]}),o?e.jsx(e.Fragment,{children:e.jsxs(Je,{children:[e.jsxs(Bt,{children:[e.jsx(Pt,{children:o.name.slice(0,1)}),e.jsxs("div",{children:[e.jsx(Ot,{children:o.name}),e.jsxs(pe,{children:["코드 ",o.code," · ID ",o.id]})]}),e.jsx(Ht,{"data-type":o.status,children:o.status==="ENROLLED"?"수강중":o.status==="ON_LEAVE"?"휴학":"대기중"})]}),e.jsxs(u,{children:[e.jsx(p,{children:"연락처"}),e.jsx(k,{children:_e(o.phoneNumber)})]}),e.jsxs(u,{children:[e.jsx(p,{children:"생년월일"}),e.jsxs(k,{children:[o.birthDate||"-",o.birthDate?e.jsxs(e.Fragment,{children:[" ",`(만 ${ct??"-"}세)`]}):null]})]}),e.jsxs(u,{children:[e.jsx(p,{children:"주소"}),e.jsx(k,{children:o.address||"-"})]}),e.jsxs(u,{children:[e.jsx(p,{children:"등록일"}),e.jsx(k,{children:o.joinedDate||o.createdAt?.slice(0,10)||"-"})]})]})}):e.jsx(L,{children:"원생 정보를 찾을 수 없습니다."})]}),e.jsxs(b,{children:[e.jsx(q,{children:e.jsx(S,{children:"부모님 정보"})}),o?e.jsxs(Je,{children:[e.jsxs(u,{children:[e.jsx(p,{children:"보호자 이름"}),e.jsx(k,{children:o.parentName||"-"})]}),e.jsxs(u,{children:[e.jsx(p,{children:"보호자 연락처"}),e.jsx(k,{children:_e(o.guardianPhone)})]})]}):e.jsx(L,{children:"부모님 정보를 찾을 수 없습니다."})]}),e.jsxs(b,{children:[e.jsxs(q,{children:[e.jsx(S,{children:"특이사항"}),e.jsx(ue,{children:je?e.jsxs(e.Fragment,{children:[e.jsx(j,{type:"button",onClick:()=>{te(!1),ne($)},children:"취소"}),e.jsx(V,{as:"button",onClick:pt,children:"저장"})]}):e.jsx(U,{as:"button",onClick:()=>te(!0),children:$?"편집":"메모 추가"})})]}),je?e.jsx(Zt,{rows:8,value:me,onChange:t=>ne(t.target.value),placeholder:"예: 과학고 진학 관심, 수학 약점 보완 필요, 알러지 등"}):e.jsx(e.Fragment,{children:$?e.jsx(Xt,{title:$,children:$}):e.jsx(X,{children:"특이사항이 없습니다. 메모를 추가해 주세요."})})]}),e.jsxs(b,{children:[e.jsxs(q,{children:[e.jsx(S,{children:"메모 사항"}),e.jsx(ue,{children:e.jsx(U,{as:"button",onClick:ht,children:"추가"})})]}),e.jsx(en,{children:e.jsx(Ze,{rows:3,value:be,onChange:t=>ye(t.target.value),placeholder:"메모를 입력하세요"})}),e.jsxs(tn,{children:[w.length===0&&e.jsx(X,{children:"메모가 없습니다. 메모를 추가해 주세요."}),w.map(t=>e.jsxs(nn,{children:[e.jsxs(sn,{children:[e.jsxs(rn,{children:[hn(t.updatedAt||t.createdAt),t.updatedAt?e.jsx("span",{style:{marginLeft:6,color:"#6b7280"},children:"(수정됨)"}):null]}),e.jsx(on,{children:A===t.id?e.jsxs(e.Fragment,{children:[e.jsx(j,{type:"button",onClick:jt,children:"취소"}),e.jsx(V,{as:"button",onClick:ft,children:"저장"})]}):e.jsxs(e.Fragment,{children:[e.jsx(j,{type:"button",onClick:()=>gt(t.id),children:"편집"}),e.jsx(j,{type:"button",onClick:()=>mt(t.id),children:"삭제"})]})})]}),A===t.id?e.jsx(Ze,{rows:4,value:ve,onChange:a=>R(a.target.value)}):e.jsx(an,{children:t.text})]},t.id))]})]})]}),e.jsx(Ue,{children:e.jsxs(b,{children:[e.jsx(We,{children:e.jsxs(qe,{children:[e.jsxs(E,{"data-active":f==="courses",onClick:()=>d(`/students/${s}/courses`),children:["수강수업 ",e.jsx(Qe,{children:o?.courses?.length??0})]}),e.jsx(E,{"data-active":f==="attendance",onClick:()=>d(`/students/${s}/attendance`),children:"출석현황"}),e.jsx(E,{"data-active":f==="counsels",onClick:()=>d(`/students/${s}/counsels`),children:"상담기록"})]})}),e.jsx(Ve,{}),f==="courses"&&e.jsx(Q,{children:o?.courses?.length?e.jsx(Yt,{children:o.courses.map(t=>e.jsxs(_t,{children:[e.jsxs(Gt,{children:[e.jsx(Kt,{children:t.title}),e.jsx(j,{type:"button",onClick:()=>d(`/classes/${t.id}`),children:"상세"})]}),e.jsxs(Ut,{children:[e.jsx("code",{children:t.code}),e.jsx(Vt,{"data-type":t.status,children:xt(t.status)})]})]},t.id))}):e.jsx(X,{children:"수강 중인 수업이 없습니다."})}),f==="attendance"&&e.jsxs(Q,{children:[Ce&&e.jsx(he,{children:Ce}),e.jsxs(Jt,{children:[e.jsxs(Xe,{children:[e.jsx(ge,{children:"이번 달 출석률"}),e.jsx(Wt,{children:gn(D)}),e.jsx(pe,{children:fn(D)})]}),e.jsxs(Xe,{children:[e.jsx(ge,{children:"최근 결석"}),e.jsx(pe,{children:jn(D)})]})]}),rt?e.jsx(L,{children:"불러오는 중..."}):e.jsxs(kt,{style:{minWidth:640},children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"날짜"}),e.jsx("th",{children:"과목"}),e.jsx("th",{children:"상태"}),e.jsx("th",{children:"메모"})]})}),e.jsx("tbody",{children:D.length===0?e.jsx("tr",{children:e.jsx("td",{colSpan:4,children:e.jsx(L,{children:"출석 기록이 없습니다."})})}):D.map((t,a)=>e.jsxs("tr",{children:[e.jsx("td",{children:t.date}),e.jsx("td",{children:t.courseTitle}),e.jsx("td",{children:t.present?"출석":"결석"}),e.jsx("td",{children:t.reason||"-"})]},a))})]})]}),f==="counsels"&&e.jsxs(Q,{children:[e.jsxs(bn,{children:[e.jsx("div",{children:e.jsx(ge,{children:"상담기록"})}),e.jsx("div",{style:{display:"inline-flex",gap:8,alignItems:"center"},children:Ne?e.jsxs(e.Fragment,{children:[e.jsx(j,{type:"button",onClick:()=>{re(!1),ae(""),P(""),H("")},children:"취소"}),e.jsx(V,{as:"button",onClick:bt,disabled:at||!B||!O,children:"저장"})]}):e.jsxs(e.Fragment,{children:[e.jsx(j,{type:"button",onClick:ut,disabled:$e,children:$e?"엑셀 준비 중...":"엑셀 추출"}),e.jsx(U,{as:"button",onClick:()=>{re(!0),ze(()=>{const t=new Date;return`${t.getFullYear()}-${x(t.getMonth()+1)}-${x(t.getDate())}`}),P(""),H("")},children:"상담 추가"})]})})]}),Me&&e.jsx(he,{children:Me}),Ne&&e.jsxs(yn,{children:[e.jsxs(u,{children:[e.jsx(p,{children:"상담 일자"}),e.jsx(et,{type:"date",lang:"ko-KR",value:oe,onChange:t=>ze(t.target.value)})]}),e.jsxs(u,{children:[e.jsx(p,{children:"시간"}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8},children:[e.jsx("div",{style:{flex:1},children:e.jsx(J,{ariaLabel:"시",value:B,onChange:P,placeholder:"시",options:Pe.map(t=>({label:t,value:t}))})}),e.jsx("span",{children:":"}),e.jsx("div",{style:{flex:1},children:e.jsx(J,{ariaLabel:"분",value:O,onChange:H,placeholder:"분",options:Oe.map(t=>({label:t,value:t}))})})]})]}),e.jsxs(u,{style:{gridColumn:"1 / -1"},children:[e.jsx(p,{children:"내용"}),e.jsx(tt,{rows:4,value:Ie,onChange:t=>ae(t.target.value),placeholder:"상담 내용 또는 메모"})]})]}),ot?e.jsx(L,{children:"불러오는 중..."}):ke.length===0?e.jsx(X,{children:"상담 기록이 없습니다."}):e.jsx(qt,{children:ke.map(t=>{const a=dt===t.id;return e.jsx(Qt,{children:a?e.jsxs(e.Fragment,{children:[e.jsxs(Sn,{children:[e.jsxs(u,{children:[e.jsx(p,{children:"상담 일자"}),e.jsx(et,{type:"date",lang:"ko-KR",value:Y,onChange:i=>N(i.target.value)})]}),e.jsxs(u,{children:[e.jsx(p,{children:"시간"}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8},children:[e.jsx("div",{style:{flex:1},children:e.jsx(J,{ariaLabel:"시",value:_,onChange:z,placeholder:"시",options:Pe.map(i=>({label:i,value:i}))})}),e.jsx("span",{children:":"}),e.jsx("div",{style:{flex:1},children:e.jsx(J,{ariaLabel:"분",value:G,onChange:I,placeholder:"분",options:Oe.map(i=>({label:i,value:i}))})})]})]}),e.jsxs(u,{style:{gridColumn:"1 / -1"},children:[e.jsx(p,{children:"내용"}),e.jsx(tt,{rows:4,value:Re,onChange:i=>K(i.target.value)})]})]}),e.jsxs(nt,{children:[e.jsx(j,{type:"button",onClick:()=>{de(null),N(""),z(""),I(""),K("")},children:"취소"}),e.jsx(V,{as:"button",disabled:lt||!Y||!_||!G,onClick:()=>yt(t.id),children:"저장"})]})]}):e.jsxs(e.Fragment,{children:[e.jsxs(vn,{children:[e.jsx(wn,{children:mn(t.counselTime)}),e.jsxs(nt,{children:[e.jsx(j,{type:"button",onClick:()=>{de(t.id);try{const i=new Date(t.counselTime);N(`${i.getFullYear()}-${x(i.getMonth()+1)}-${x(i.getDate())}`),z(x(i.getHours())),I(x(i.getMinutes()))}catch{N(""),z(""),I("")}K(t.content||"")},children:"편집"}),e.jsx(j,{type:"button",onClick:()=>ce(t.id),children:"삭제"})]})]}),e.jsx(Cn,{children:(t.content||"").trim()||"내용 없음"})]})},t.id)})})]})]})})]}),e.jsx($t,{open:le!=null,title:"상담 일정 삭제",message:"이 상담 일정을 삭제하시겠어요? 되돌릴 수 없습니다.",confirmLabel:"삭제",cancelLabel:"취소",tone:"danger",busy:Te,onCancel:()=>{Te||ce(null)},onConfirm:async()=>{if(!(!s||le==null)){Ae(!0);try{await Dt(le);const t=await W({studentId:s,size:100});F(t.content||[]),ce(null)}catch(t){Be(t?.message||"삭제에 실패했습니다.")}finally{Ae(!1)}}}})]})}const At=n.div`
  display: grid; gap: 14px;
`,Rt=n.div`
  display: flex; align-items: center; gap: 10px;
  h2 { margin: 0; font-size: 20px; color: #0f172a; }
`,Ft=n.div`
  color: #9ca3af; font-size: 12px; margin-top: -6px; margin-bottom: 4px;
`,Ge=n.div`
  display: grid; grid-template-columns: 360px 1fr; gap: 14px; align-items: start;
  @media (max-width: 1200px) { grid-template-columns: 1fr; }
`,Ke=n.aside`
  display: grid; gap: 18px;
`,Ue=n.section``,b=n.section`
  background: #fff; border: 1px solid #e5e7eb; border-radius: 14px; padding: 16px; min-width: 0;
  box-shadow: 0 1px 2px rgba(0,0,0,0.03);
`,S=n.h3`
  margin: 0; font-size: 16px; color: #0f172a;
`,q=n.div`
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;
`,ue=n.div`
  display: inline-flex; gap: 12px;
`,Ve=n.div`
  height: 1px; background: #e5e7eb; margin: 6px 0 10px;
`,Je=n.div`
  display: grid; gap: 14px;
`,Bt=n.div`
  display: grid; grid-template-columns: 44px 1fr auto; gap: 12px; align-items: center; margin-bottom: 6px;
`,Pt=n.div`
  width: 44px; height: 44px; border-radius: 12px; background: #eef2ff; color: #4f46e5; display: grid; place-items: center; font-weight: 800;
`,Ot=n.div`
  font-size: 19px; font-weight: 900; color: #0f172a; letter-spacing: -0.01em;
`,pe=n.div`
  color: #6b7280; font-size: 12px;
`,Ht=n.span`
  padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: 800;
  &[data-type='ENROLLED'] { background:#dcfce7; color:#16a34a; }
  &[data-type='ON_LEAVE'] { background:#fef3c7; color:#b45309; }
  &[data-type='PENDING'] { background:#f3e8ff; color:#7c3aed; }
`,u=n.div`
  display: grid; grid-template-columns: 100px 1fr; gap: 8px;
`,p=n.div`
  color: #6b7280; font-size: 13px; align-self: center;
`,k=n.div`
  color: #111827; font-size: 15px;
`,L=n.div`
  color: #6b7280; font-size: 13px;
`,he=n.div`
  color: #b91c1c; font-size: 12px; font-weight: 700;
`,We=n.div`
  display: flex; align-items: center; justify-content: space-between;
  position: sticky; top: 0; background: #fff; z-index: 5; padding-top: 2px;
`,qe=n.div`
  display: inline-flex; gap: 6px; flex-wrap: wrap;
`,E=n(st)`
  height: 40px;
  padding: 0 16px;
  font-size: 14px;
  &[data-active='true'] {
    background:#111827;
    color:#fff;
    border-color:#111827;
  }
`,Qe=n.span`
  min-width: 18px; height: 18px; padding: 0 6px; border-radius: 9999px; background:#e5e7eb; color:#374151; font-weight: 800; font-size: 11px; display: inline-flex; align-items: center; justify-content: center;
`,Q=n.div`
  display: grid; gap: 10px;
`,Yt=n.div`
  display: grid; gap: 8px;
`,_t=n.div`
  border: 1px solid #e5e7eb; border-radius: 10px; padding: 10px 12px; display: grid; gap: 6px; background: #fff;
`,Gt=n.div`
  display: flex; align-items: center; justify-content: space-between; gap: 8px;
`,Kt=n.div`
  font-weight: 800; color: #0f172a; font-size: 14px;
`,Ut=n.div`
  display: flex; align-items: center; gap: 10px; color: #6b7280; font-size: 12px;
  code { background:#f3f4f6; padding: 2px 6px; border-radius: 6px; }
`,Vt=n.span`
  padding: 2px 8px; border-radius: 9999px; font-size: 12px; font-weight: 800;
  &[data-type='IN_PROGRESS'] { background:#dcfce7; color:#16a34a; }
  &[data-type='PENDING'] { background:#f3e8ff; color:#7c3aed; }
  &[data-type='STOPPED'] { background:#e5e7eb; color:#374151; }
`,Jt=n.div`
  display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px;
`,Xe=n.div`
  border: 1px solid #e5e7eb; border-radius: 10px; padding: 10px 12px; background: #fff;
`,ge=n.div`
  color: #6b7280; font-size: 12px;
`,Wt=n.div`
  font-size: 22px; font-weight: 900; color: #0f172a; margin-top: 4px;
`,qt=n.div`
  display: grid; gap: 8px;
`,Qt=n.div`
  border: 1px solid #e5e7eb; border-radius: 10px; padding: 10px 12px; background: #fff; display: grid; gap: 4px;
  strong { color: #0f172a; }
`,X=n.div`
  color: #6b7280; font-size: 13px; text-align: center; border: 1px dashed #e5e7eb; border-radius: 10px; padding: 16px; background: #fafafa;
`,j=n(st)`
  height: 40px;
  padding: 0 16px;
  font-size: 14px;
`,Xt=n.pre`
  margin: 0; white-space: pre-line; color: #111827; font-size: 15px; line-height: 1.7;
  background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 12px 14px; text-wrap: pretty;
`,Zt=n.textarea`
  width: 100%; border: 1px solid #e5e7eb; border-radius: 10px; padding: 10px 12px; resize: vertical; font-size: 14px; color: #111827; min-height: 120px;
  &:focus { outline: none; box-shadow: 0 0 0 3px rgba(79,70,229,0.15); }
`,en=n.div` display:grid; gap:8px; `,tn=n.div` display:grid; gap:8px; `,nn=n.div`
  border: 1px solid #e5e7eb; border-radius: 10px; padding: 10px 12px; background: #fff; display: grid; gap: 6px;
`,sn=n.div` display:flex; align-items:center; justify-content:space-between; gap:8px; `,rn=n.div` color:#6b7280; font-size:12px; `,on=n.div` display:inline-flex; gap:6px; `,Ze=n.textarea`
  width: 100%; border: 1px solid #e5e7eb; border-radius: 10px; padding: 8px 10px; resize: vertical; font-size: 14px; color: #111827;
`,an=n.pre` margin:0; white-space:pre-wrap; color:#111827; font-size:14px; `,dn=Et`
  0% { background-position: -200px 0; }
  100% { background-position: 200px 0; }
`,ee=n.div`
  background: linear-gradient(90deg, #eef2f7 25%, #f6f8fb 37%, #eef2f7 63%);
  background-size: 400px 100%;
  animation: ${dn} 1.2s ease-in-out infinite;
  border-radius: 8px;
  width: ${({w:d})=>d?`${d}px`:"100%"};
  height: ${({h:d})=>d?`${d}px`:"12px"};
  margin-top: ${({mt:d})=>d?`${d}px`:0};
`,Z=ee,ln=n(ee).attrs({w:44,h:44})`
  border-radius: 12px;
`,cn=n.div`
  display: grid; grid-template-columns: 44px 1fr 80px; gap: 10px; align-items: center; margin-bottom: 8px;
`,xn=n(ee).attrs({w:80,h:24})``,M=n(ee).attrs({h:16,mt:10})``;function un(d,l){const c=URL.createObjectURL(d),s=document.createElement("a");s.href=c,s.download=l,document.body.appendChild(s),s.click(),s.remove(),URL.revokeObjectURL(c)}function pn(d){const c=(d?d.trim():"export").replace(/[\\/:*?"<>|]+/g,"_");return c.length?c:"export"}function x(d){return String(d).padStart(2,"0")}function hn(d){try{const l=new Date(d),c=l.getFullYear(),s=x(l.getMonth()+1),o=x(l.getDate()),m=x(l.getHours()),h=x(l.getMinutes());return`${c}-${s}-${o} ${m}:${h}`}catch{return d}}function gn(d){const l=new Date,c=l.getFullYear(),s=l.getMonth()+1,o=d.filter(g=>{const[v,T]=g.date.split("-").map(Number);return v===c&&T===s});if(o.length===0)return"—";const m=o.filter(g=>g.present).length;return`${Math.round(m/o.length*100)}%`}function fn(d){const l=new Date,c=l.getFullYear(),s=l.getMonth()+1,o=d.filter(h=>{const[g,v]=h.date.split("-").map(Number);return g===c&&v===s});return o.length===0?"—":`${o.filter(h=>h.present).length}/${o.length}회 출석`}function jn(d){const l=d.filter(c=>!c.present).slice(0,2).map(c=>c.date);return l.length===0?"없음":l.join(", ")}function mn(d){try{const l=new Date(d),c=["일","월","화","수","목","금","토"][l.getDay()],s=l.getFullYear(),o=l.getMonth()+1,m=l.getDate(),h=x(l.getHours()),g=x(l.getMinutes());return`${s}년 ${o}월 ${m}일 (${c}) ${h}:${g}`}catch{return d}}const bn=n.div`
  display: flex; align-items: center; justify-content: space-between; gap: 8px;
`,yn=n.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 4px 0 8px;
  @media (max-width: 900px) { grid-template-columns: 1fr; }
`,et=n.input`
  height: 36px; border: 1px solid #e5e7eb; border-radius: 10px; padding: 0 10px; font-size: 14px;
`,tt=n.textarea`
  width: 100%; border: 1px solid #e5e7eb; border-radius: 10px; padding: 8px 10px; font-size: 14px; resize: vertical;
`;n.select`
  height: 36px; border: 1px solid #e5e7eb; border-radius: 10px; padding: 0 8px; font-size: 14px; background:#fff; color:#0f172a;
`;const vn=n.div` display:flex; align-items:center; justify-content:space-between; gap:8px; `,nt=n.div` display:inline-flex; gap:12px; `,wn=n.div` font-weight:900; color:#0f172a; `,Cn=n.pre` margin:4px 0 0; white-space:pre-wrap; color:#111827; font-size:14px; `,Sn=n.div` display:grid; grid-template-columns: 1fr 1fr; gap:10px; @media(max-width:900px){ grid-template-columns:1fr; }`;export{In as default};
