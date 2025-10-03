import{u as bt,e as yt,r as i,g as vt,j as e,v as V,P as J,T as wt,d as n,t as Ct,b as et}from"./index-C5H-3XpS.js";import{S as W}from"./SelectBox-lInkDLwW.js";import{B as St}from"./BackButton-DBqWFaLj.js";import{C as kt}from"./ConfirmDialog-BCGi_FT2.js";import{d as Mt,l as q,c as Et,u as $t}from"./counsels-Bn14hZaJ.js";import{g as Dt,b as Nt}from"./students-DtpvHDV6.js";import{f as He}from"./format-CD1P4D3U.js";function Mn(){const d=bt(),{id:l,tab:c}=yt(),r=i.useMemo(()=>Number(l),[l]),[o,m]=i.useState(null),[h,g]=i.useState(!1),[v,T]=i.useState(null),[$,fe]=i.useState(""),[je,te]=i.useState(!1),[me,ne]=i.useState(""),[w,se]=i.useState([]),[be,ye]=i.useState(""),[A,ie]=i.useState(null),[ve,F]=i.useState(""),[D,tt]=i.useState([]),[nt,we]=i.useState(!1),[Ce,Se]=i.useState(null),[ke,R]=i.useState([]),[st,Me]=i.useState(!1),[Ee,C]=i.useState(null),[$e,re]=i.useState(!1),[oe,De]=i.useState(()=>{const t=new Date;return`${t.getFullYear()}-${x(t.getMonth()+1)}-${x(t.getDate())}`}),[B,P]=i.useState(""),[H,O]=i.useState(""),[Ne,ae]=i.useState(""),[it,ze]=i.useState(!1),[rt,de]=i.useState(null),[le,ce]=i.useState(null),[Ie,Le]=i.useState(!1),[Y,N]=i.useState(""),[G,z]=i.useState(""),[_,I]=i.useState(""),[Te,K]=i.useState(""),[ot,Ae]=i.useState(!1),{error:at}=vt(),dt=i.useMemo(()=>{if(!o?.birthDate)return;const[t,a,s]=o.birthDate.split("-").map(Number);if(!t||!a||!s)return;const y=new Date;let Be=y.getFullYear()-t;const Pe=y.getMonth()+1,mt=y.getDate();return(Pe<a||Pe===a&&mt<s)&&(Be-=1),Be},[o?.birthDate]),f=i.useMemo(()=>{switch(c){case"courses":case"attendance":case"counsels":return c;default:return"courses"}},[c]);function lt(t){switch(t){case"IN_PROGRESS":return"진행중";case"PENDING":return"대기";case"STOPPED":return"중단";default:return t}}i.useEffect(()=>{if(!r||Number.isNaN(r))return;let t=!1;async function a(){g(!0),T(null);try{const s=await Dt(r);t||m(s)}catch(s){t||T(s?.message||"원생 정보를 불러오지 못했습니다.")}finally{t||g(!1)}}return a(),()=>{t=!0}},[r]),i.useEffect(()=>{if(!r||f!=="counsels")return;let t=!1;async function a(){Me(!0),C(null);try{const s=await q({studentId:r,size:100});t||R(s.content||[])}catch(s){t||C(s?.message||"상담 기록을 불러오지 못했습니다.")}finally{t||Me(!1)}}return a(),()=>{t=!0}},[r,f]),i.useEffect(()=>{if(r)try{const t=localStorage.getItem(`student:notes:${r}`)||"";fe(t),ne(t)}catch{}},[r]),i.useEffect(()=>{if(r)try{const t=localStorage.getItem(`student:memos:${r}`),a=t?JSON.parse(t):[];se(Array.isArray(a)?a:[])}catch{se([])}},[r]),i.useEffect(()=>{if(!r||f!=="attendance")return;let t=!1;async function a(){we(!0),Se(null);try{const s=await Nt(r,{size:200});t||tt(s?.content||[])}catch(s){t||Se(s?.message||"출석 정보를 불러오지 못했습니다.")}finally{t||we(!1)}}return a(),()=>{t=!0}},[r,f]);function ct(){if(!r)return;const t=(me||"").trim();fe(t),te(!1);try{localStorage.setItem(`student:notes:${r}`,t)}catch{}}function xe(t){se(t);try{localStorage.setItem(`student:memos:${r}`,JSON.stringify(t))}catch{}}function xt(){if(!r)return;const t=(be||"").trim();if(!t)return;const a=new Date().toISOString(),s={id:Date.now(),text:t,createdAt:a};xe([s,...w]),ye("")}function ut(t){const a=w.find(s=>s.id===t);a&&(ie(t),F(a.text))}function pt(){if(A==null)return;const t=(ve||"").trim(),a=new Date().toISOString(),s=w.map(y=>y.id===A?{...y,text:t,updatedAt:a}:y);xe(s),ie(null),F("")}function ht(){ie(null),F("")}function gt(t){const a=w.filter(s=>s.id!==t);xe(a)}const Fe=i.useMemo(()=>Array.from({length:24},(t,a)=>String(a).padStart(2,"0")),[]),Re=i.useMemo(()=>["00","05","10","15","20","25","30","35","40","45","50","55"],[]);async function ft(){if(!(!r||!oe||!B||!H)){ze(!0),C(null);try{const t=`${oe}T${B}:${H}:00`;await Et({studentId:r,counselTime:t,content:Ne||void 0});const a=await q({studentId:r,size:100});R(a.content||[]),re(!1),P(""),O(""),ae("")}catch(t){C(t?.message||"저장에 실패했습니다.")}finally{ze(!1)}}}async function jt(t){if(!(!Y||!G||!_)){Ae(!0),C(null);try{const a=`${Y}T${G}:${_}:00`;await $t(t,{counselTime:a,content:Te||void 0});const s=await q({studentId:r,size:100});R(s.content||[]),de(null),N(""),z(""),I(""),K("")}catch(a){C(a?.message||"수정에 실패했습니다.")}finally{Ae(!1)}}}return e.jsxs(zt,{children:[e.jsxs(It,{children:[e.jsx(St,{to:"/students",label:"뒤로"}),e.jsx("h2",{children:"원생 상세"})]}),e.jsxs(Lt,{children:["원생 관리 > ",o?.name||"상세"]}),h&&e.jsxs(Oe,{children:[e.jsxs(Ye,{children:[e.jsxs(b,{children:[e.jsx(S,{children:"기본 정보"}),e.jsxs(on,{children:[e.jsx(rn,{}),e.jsxs("div",{children:[e.jsx(Z,{w:140,h:18}),e.jsx(Z,{w:120,h:12,mt:6})]}),e.jsx(an,{})]}),e.jsx(E,{}),e.jsx(E,{}),e.jsx(E,{}),e.jsx(E,{})]}),e.jsxs(b,{children:[e.jsx(S,{children:"부모님 정보"}),e.jsx(E,{}),e.jsx(E,{})]})]}),e.jsx(Ge,{children:e.jsxs(b,{children:[e.jsx(Ve,{children:e.jsxs(Je,{children:[e.jsxs(M,{"data-active":!0,children:["수강수업 ",e.jsx(We,{children:"0"})]}),e.jsx(M,{children:"출석현황"}),e.jsx(M,{children:"상담기록"})]})}),e.jsx(_e,{}),e.jsxs(U,{children:[e.jsx(Z,{w:240,h:14}),e.jsx(Z,{w:560,h:120,mt:10})]})]})})]}),v&&e.jsx(he,{children:v}),!h&&e.jsxs(Oe,{children:[e.jsxs(Ye,{children:[e.jsxs(b,{children:[e.jsxs(Q,{children:[e.jsx(S,{children:"기본 정보"}),e.jsx(ue,{children:e.jsx(V,{as:"button",onClick:()=>d(`/students/${r}/edit`),children:"수정"})})]}),o?e.jsx(e.Fragment,{children:e.jsxs(Ke,{children:[e.jsxs(Tt,{children:[e.jsx(At,{children:o.name.slice(0,1)}),e.jsxs("div",{children:[e.jsx(Ft,{children:o.name}),e.jsxs(pe,{children:["코드 ",o.code," · ID ",o.id]})]}),e.jsx(Rt,{"data-type":o.status,children:o.status==="ENROLLED"?"수강중":o.status==="ON_LEAVE"?"휴학":"대기중"})]}),e.jsxs(u,{children:[e.jsx(p,{children:"연락처"}),e.jsx(k,{children:He(o.phoneNumber)})]}),e.jsxs(u,{children:[e.jsx(p,{children:"생년월일"}),e.jsxs(k,{children:[o.birthDate||"-",o.birthDate?e.jsxs(e.Fragment,{children:[" ",`(만 ${dt??"-"}세)`]}):null]})]}),e.jsxs(u,{children:[e.jsx(p,{children:"주소"}),e.jsx(k,{children:o.address||"-"})]}),e.jsxs(u,{children:[e.jsx(p,{children:"등록일"}),e.jsx(k,{children:o.joinedDate||o.createdAt?.slice(0,10)||"-"})]})]})}):e.jsx(L,{children:"원생 정보를 찾을 수 없습니다."})]}),e.jsxs(b,{children:[e.jsx(Q,{children:e.jsx(S,{children:"부모님 정보"})}),o?e.jsxs(Ke,{children:[e.jsxs(u,{children:[e.jsx(p,{children:"보호자 이름"}),e.jsx(k,{children:o.parentName||"-"})]}),e.jsxs(u,{children:[e.jsx(p,{children:"보호자 연락처"}),e.jsx(k,{children:He(o.guardianPhone)})]})]}):e.jsx(L,{children:"부모님 정보를 찾을 수 없습니다."})]}),e.jsxs(b,{children:[e.jsxs(Q,{children:[e.jsx(S,{children:"특이사항"}),e.jsx(ue,{children:je?e.jsxs(e.Fragment,{children:[e.jsx(j,{type:"button",onClick:()=>{te(!1),ne($)},children:"취소"}),e.jsx(J,{as:"button",onClick:ct,children:"저장"})]}):e.jsx(V,{as:"button",onClick:()=>te(!0),children:$?"편집":"메모 추가"})})]}),je?e.jsx(qt,{rows:8,value:me,onChange:t=>ne(t.target.value),placeholder:"예: 과학고 진학 관심, 수학 약점 보완 필요, 알러지 등"}):e.jsx(e.Fragment,{children:$?e.jsx(Wt,{title:$,children:$}):e.jsx(X,{children:"특이사항이 없습니다. 메모를 추가해 주세요."})})]}),e.jsxs(b,{children:[e.jsxs(Q,{children:[e.jsx(S,{children:"메모 사항"}),e.jsx(ue,{children:e.jsx(V,{as:"button",onClick:xt,children:"추가"})})]}),e.jsx(Qt,{children:e.jsx(Qe,{rows:3,value:be,onChange:t=>ye(t.target.value),placeholder:"메모를 입력하세요"})}),e.jsxs(Ut,{children:[w.length===0&&e.jsx(X,{children:"메모가 없습니다. 메모를 추가해 주세요."}),w.map(t=>e.jsxs(Xt,{children:[e.jsxs(Zt,{children:[e.jsxs(en,{children:[dn(t.updatedAt||t.createdAt),t.updatedAt?e.jsx("span",{style:{marginLeft:6,color:"#6b7280"},children:"(수정됨)"}):null]}),e.jsx(tn,{children:A===t.id?e.jsxs(e.Fragment,{children:[e.jsx(j,{type:"button",onClick:ht,children:"취소"}),e.jsx(J,{as:"button",onClick:pt,children:"저장"})]}):e.jsxs(e.Fragment,{children:[e.jsx(j,{type:"button",onClick:()=>ut(t.id),children:"편집"}),e.jsx(j,{type:"button",onClick:()=>gt(t.id),children:"삭제"})]})})]}),A===t.id?e.jsx(Qe,{rows:4,value:ve,onChange:a=>F(a.target.value)}):e.jsx(nn,{children:t.text})]},t.id))]})]})]}),e.jsx(Ge,{children:e.jsxs(b,{children:[e.jsx(Ve,{children:e.jsxs(Je,{children:[e.jsxs(M,{"data-active":f==="courses",onClick:()=>d(`/students/${r}/courses`),children:["수강수업 ",e.jsx(We,{children:o?.courses?.length??0})]}),e.jsx(M,{"data-active":f==="attendance",onClick:()=>d(`/students/${r}/attendance`),children:"출석현황"}),e.jsx(M,{"data-active":f==="counsels",onClick:()=>d(`/students/${r}/counsels`),children:"상담기록"})]})}),e.jsx(_e,{}),f==="courses"&&e.jsx(U,{children:o?.courses?.length?e.jsx(Bt,{children:o.courses.map(t=>e.jsxs(Pt,{children:[e.jsxs(Ht,{children:[e.jsx(Ot,{children:t.title}),e.jsx(j,{type:"button",onClick:()=>d(`/classes/${t.id}`),children:"상세"})]}),e.jsxs(Yt,{children:[e.jsx("code",{children:t.code}),e.jsx(Gt,{"data-type":t.status,children:lt(t.status)})]})]},t.id))}):e.jsx(X,{children:"수강 중인 수업이 없습니다."})}),f==="attendance"&&e.jsxs(U,{children:[Ce&&e.jsx(he,{children:Ce}),e.jsxs(_t,{children:[e.jsxs(qe,{children:[e.jsx(ge,{children:"이번 달 출석률"}),e.jsx(Kt,{children:ln(D)}),e.jsx(pe,{children:cn(D)})]}),e.jsxs(qe,{children:[e.jsx(ge,{children:"최근 결석"}),e.jsx(pe,{children:xn(D)})]})]}),nt?e.jsx(L,{children:"불러오는 중..."}):e.jsxs(wt,{style:{minWidth:640},children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"날짜"}),e.jsx("th",{children:"과목"}),e.jsx("th",{children:"상태"}),e.jsx("th",{children:"메모"})]})}),e.jsx("tbody",{children:D.length===0?e.jsx("tr",{children:e.jsx("td",{colSpan:4,children:e.jsx(L,{children:"출석 기록이 없습니다."})})}):D.map((t,a)=>e.jsxs("tr",{children:[e.jsx("td",{children:t.date}),e.jsx("td",{children:t.courseTitle}),e.jsx("td",{children:t.present?"출석":"결석"}),e.jsx("td",{children:t.reason||"-"})]},a))})]})]}),f==="counsels"&&e.jsxs(U,{children:[e.jsxs(pn,{children:[e.jsx("div",{children:e.jsx(ge,{children:"상담기록"})}),e.jsx("div",{children:$e?e.jsxs(e.Fragment,{children:[e.jsx(j,{type:"button",onClick:()=>{re(!1),ae(""),P(""),O("")},children:"취소"}),e.jsx(J,{as:"button",onClick:ft,disabled:it||!B||!H,children:"저장"})]}):e.jsx(V,{as:"button",onClick:()=>{re(!0),De(()=>{const t=new Date;return`${t.getFullYear()}-${x(t.getMonth()+1)}-${x(t.getDate())}`}),P(""),O("")},children:"상담 추가"})})]}),Ee&&e.jsx(he,{children:Ee}),$e&&e.jsxs(hn,{children:[e.jsxs(u,{children:[e.jsx(p,{children:"상담 일자"}),e.jsx(Ue,{type:"date",lang:"ko-KR",value:oe,onChange:t=>De(t.target.value)})]}),e.jsxs(u,{children:[e.jsx(p,{children:"시간"}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8},children:[e.jsx("div",{style:{flex:1},children:e.jsx(W,{ariaLabel:"시",value:B,onChange:P,placeholder:"시",options:Fe.map(t=>({label:t,value:t}))})}),e.jsx("span",{children:":"}),e.jsx("div",{style:{flex:1},children:e.jsx(W,{ariaLabel:"분",value:H,onChange:O,placeholder:"분",options:Re.map(t=>({label:t,value:t}))})})]})]}),e.jsxs(u,{style:{gridColumn:"1 / -1"},children:[e.jsx(p,{children:"내용"}),e.jsx(Xe,{rows:4,value:Ne,onChange:t=>ae(t.target.value),placeholder:"상담 내용 또는 메모"})]})]}),st?e.jsx(L,{children:"불러오는 중..."}):ke.length===0?e.jsx(X,{children:"상담 기록이 없습니다."}):e.jsx(Vt,{children:ke.map(t=>{const a=rt===t.id;return e.jsx(Jt,{children:a?e.jsxs(e.Fragment,{children:[e.jsxs(mn,{children:[e.jsxs(u,{children:[e.jsx(p,{children:"상담 일자"}),e.jsx(Ue,{type:"date",lang:"ko-KR",value:Y,onChange:s=>N(s.target.value)})]}),e.jsxs(u,{children:[e.jsx(p,{children:"시간"}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8},children:[e.jsx("div",{style:{flex:1},children:e.jsx(W,{ariaLabel:"시",value:G,onChange:z,placeholder:"시",options:Fe.map(s=>({label:s,value:s}))})}),e.jsx("span",{children:":"}),e.jsx("div",{style:{flex:1},children:e.jsx(W,{ariaLabel:"분",value:_,onChange:I,placeholder:"분",options:Re.map(s=>({label:s,value:s}))})})]})]}),e.jsxs(u,{style:{gridColumn:"1 / -1"},children:[e.jsx(p,{children:"내용"}),e.jsx(Xe,{rows:4,value:Te,onChange:s=>K(s.target.value)})]})]}),e.jsxs(Ze,{children:[e.jsx(j,{type:"button",onClick:()=>{de(null),N(""),z(""),I(""),K("")},children:"취소"}),e.jsx(J,{as:"button",disabled:ot||!Y||!G||!_,onClick:()=>jt(t.id),children:"저장"})]})]}):e.jsxs(e.Fragment,{children:[e.jsxs(gn,{children:[e.jsx(fn,{children:un(t.counselTime)}),e.jsxs(Ze,{children:[e.jsx(j,{type:"button",onClick:()=>{de(t.id);try{const s=new Date(t.counselTime);N(`${s.getFullYear()}-${x(s.getMonth()+1)}-${x(s.getDate())}`),z(x(s.getHours())),I(x(s.getMinutes()))}catch{N(""),z(""),I("")}K(t.content||"")},children:"편집"}),e.jsx(j,{type:"button",onClick:()=>ce(t.id),children:"삭제"})]})]}),e.jsx(jn,{children:(t.content||"").trim()||"내용 없음"})]})},t.id)})})]})]})})]}),e.jsx(kt,{open:le!=null,title:"상담 일정 삭제",message:"이 상담 일정을 삭제하시겠어요? 되돌릴 수 없습니다.",confirmLabel:"삭제",cancelLabel:"취소",tone:"danger",busy:Ie,onCancel:()=>{Ie||ce(null)},onConfirm:async()=>{if(!(!r||le==null)){Le(!0);try{await Mt(le);const t=await q({studentId:r,size:100});R(t.content||[]),ce(null)}catch(t){at(t?.message||"삭제에 실패했습니다.")}finally{Le(!1)}}}})]})}const zt=n.div`
  display: grid; gap: 14px;
`,It=n.div`
  display: flex; align-items: center; gap: 10px;
  h2 { margin: 0; font-size: 20px; color: #0f172a; }
`,Lt=n.div`
  color: #9ca3af; font-size: 12px; margin-top: -6px; margin-bottom: 4px;
`,Oe=n.div`
  display: grid; grid-template-columns: 360px 1fr; gap: 14px; align-items: start;
  @media (max-width: 1200px) { grid-template-columns: 1fr; }
`,Ye=n.aside`
  display: grid; gap: 18px;
`,Ge=n.section``,b=n.section`
  background: #fff; border: 1px solid #e5e7eb; border-radius: 14px; padding: 16px; min-width: 0;
  box-shadow: 0 1px 2px rgba(0,0,0,0.03);
`,S=n.h3`
  margin: 0; font-size: 16px; color: #0f172a;
`,Q=n.div`
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;
`,ue=n.div`
  display: inline-flex; gap: 12px;
`,_e=n.div`
  height: 1px; background: #e5e7eb; margin: 6px 0 10px;
`,Ke=n.div`
  display: grid; gap: 14px;
`,Tt=n.div`
  display: grid; grid-template-columns: 44px 1fr auto; gap: 12px; align-items: center; margin-bottom: 6px;
`,At=n.div`
  width: 44px; height: 44px; border-radius: 12px; background: #eef2ff; color: #4f46e5; display: grid; place-items: center; font-weight: 800;
`,Ft=n.div`
  font-size: 19px; font-weight: 900; color: #0f172a; letter-spacing: -0.01em;
`,pe=n.div`
  color: #6b7280; font-size: 12px;
`,Rt=n.span`
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
`,Ve=n.div`
  display: flex; align-items: center; justify-content: space-between;
  position: sticky; top: 0; background: #fff; z-index: 5; padding-top: 2px;
`,Je=n.div`
  display: inline-flex; gap: 6px; flex-wrap: wrap;
`,M=n(et)`
  height: 40px;
  padding: 0 16px;
  font-size: 14px;
  &[data-active='true'] {
    background:#111827;
    color:#fff;
    border-color:#111827;
  }
`,We=n.span`
  min-width: 18px; height: 18px; padding: 0 6px; border-radius: 9999px; background:#e5e7eb; color:#374151; font-weight: 800; font-size: 11px; display: inline-flex; align-items: center; justify-content: center;
`,U=n.div`
  display: grid; gap: 10px;
`,Bt=n.div`
  display: grid; gap: 8px;
`,Pt=n.div`
  border: 1px solid #e5e7eb; border-radius: 10px; padding: 10px 12px; display: grid; gap: 6px; background: #fff;
`,Ht=n.div`
  display: flex; align-items: center; justify-content: space-between; gap: 8px;
`,Ot=n.div`
  font-weight: 800; color: #0f172a; font-size: 14px;
`,Yt=n.div`
  display: flex; align-items: center; gap: 10px; color: #6b7280; font-size: 12px;
  code { background:#f3f4f6; padding: 2px 6px; border-radius: 6px; }
`,Gt=n.span`
  padding: 2px 8px; border-radius: 9999px; font-size: 12px; font-weight: 800;
  &[data-type='IN_PROGRESS'] { background:#dcfce7; color:#16a34a; }
  &[data-type='PENDING'] { background:#f3e8ff; color:#7c3aed; }
  &[data-type='STOPPED'] { background:#e5e7eb; color:#374151; }
`,_t=n.div`
  display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px;
`,qe=n.div`
  border: 1px solid #e5e7eb; border-radius: 10px; padding: 10px 12px; background: #fff;
`,ge=n.div`
  color: #6b7280; font-size: 12px;
`,Kt=n.div`
  font-size: 22px; font-weight: 900; color: #0f172a; margin-top: 4px;
`,Vt=n.div`
  display: grid; gap: 8px;
`,Jt=n.div`
  border: 1px solid #e5e7eb; border-radius: 10px; padding: 10px 12px; background: #fff; display: grid; gap: 4px;
  strong { color: #0f172a; }
`,X=n.div`
  color: #6b7280; font-size: 13px; text-align: center; border: 1px dashed #e5e7eb; border-radius: 10px; padding: 16px; background: #fafafa;
`,j=n(et)`
  height: 40px;
  padding: 0 16px;
  font-size: 14px;
`,Wt=n.pre`
  margin: 0; white-space: pre-line; color: #111827; font-size: 15px; line-height: 1.7;
  background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 12px 14px; text-wrap: pretty;
`,qt=n.textarea`
  width: 100%; border: 1px solid #e5e7eb; border-radius: 10px; padding: 10px 12px; resize: vertical; font-size: 14px; color: #111827; min-height: 120px;
  &:focus { outline: none; box-shadow: 0 0 0 3px rgba(79,70,229,0.15); }
`,Qt=n.div` display:grid; gap:8px; `,Ut=n.div` display:grid; gap:8px; `,Xt=n.div`
  border: 1px solid #e5e7eb; border-radius: 10px; padding: 10px 12px; background: #fff; display: grid; gap: 6px;
`,Zt=n.div` display:flex; align-items:center; justify-content:space-between; gap:8px; `,en=n.div` color:#6b7280; font-size:12px; `,tn=n.div` display:inline-flex; gap:6px; `,Qe=n.textarea`
  width: 100%; border: 1px solid #e5e7eb; border-radius: 10px; padding: 8px 10px; resize: vertical; font-size: 14px; color: #111827;
`,nn=n.pre` margin:0; white-space:pre-wrap; color:#111827; font-size:14px; `,sn=Ct`
  0% { background-position: -200px 0; }
  100% { background-position: 200px 0; }
`,ee=n.div`
  background: linear-gradient(90deg, #eef2f7 25%, #f6f8fb 37%, #eef2f7 63%);
  background-size: 400px 100%;
  animation: ${sn} 1.2s ease-in-out infinite;
  border-radius: 8px;
  width: ${({w:d})=>d?`${d}px`:"100%"};
  height: ${({h:d})=>d?`${d}px`:"12px"};
  margin-top: ${({mt:d})=>d?`${d}px`:0};
`,Z=ee,rn=n(ee).attrs({w:44,h:44})`
  border-radius: 12px;
`,on=n.div`
  display: grid; grid-template-columns: 44px 1fr 80px; gap: 10px; align-items: center; margin-bottom: 8px;
`,an=n(ee).attrs({w:80,h:24})``,E=n(ee).attrs({h:16,mt:10})``;function x(d){return String(d).padStart(2,"0")}function dn(d){try{const l=new Date(d),c=l.getFullYear(),r=x(l.getMonth()+1),o=x(l.getDate()),m=x(l.getHours()),h=x(l.getMinutes());return`${c}-${r}-${o} ${m}:${h}`}catch{return d}}function ln(d){const l=new Date,c=l.getFullYear(),r=l.getMonth()+1,o=d.filter(g=>{const[v,T]=g.date.split("-").map(Number);return v===c&&T===r});if(o.length===0)return"—";const m=o.filter(g=>g.present).length;return`${Math.round(m/o.length*100)}%`}function cn(d){const l=new Date,c=l.getFullYear(),r=l.getMonth()+1,o=d.filter(h=>{const[g,v]=h.date.split("-").map(Number);return g===c&&v===r});return o.length===0?"—":`${o.filter(h=>h.present).length}/${o.length}회 출석`}function xn(d){const l=d.filter(c=>!c.present).slice(0,2).map(c=>c.date);return l.length===0?"없음":l.join(", ")}function un(d){try{const l=new Date(d),c=["일","월","화","수","목","금","토"][l.getDay()],r=l.getFullYear(),o=l.getMonth()+1,m=l.getDate(),h=x(l.getHours()),g=x(l.getMinutes());return`${r}년 ${o}월 ${m}일 (${c}) ${h}:${g}`}catch{return d}}const pn=n.div`
  display: flex; align-items: center; justify-content: space-between; gap: 8px;
`,hn=n.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 4px 0 8px;
  @media (max-width: 900px) { grid-template-columns: 1fr; }
`,Ue=n.input`
  height: 36px; border: 1px solid #e5e7eb; border-radius: 10px; padding: 0 10px; font-size: 14px;
`,Xe=n.textarea`
  width: 100%; border: 1px solid #e5e7eb; border-radius: 10px; padding: 8px 10px; font-size: 14px; resize: vertical;
`;n.select`
  height: 36px; border: 1px solid #e5e7eb; border-radius: 10px; padding: 0 8px; font-size: 14px; background:#fff; color:#0f172a;
`;const gn=n.div` display:flex; align-items:center; justify-content:space-between; gap:8px; `,Ze=n.div` display:inline-flex; gap:12px; `,fn=n.div` font-weight:900; color:#0f172a; `,jn=n.pre` margin:4px 0 0; white-space:pre-wrap; color:#111827; font-size:14px; `,mn=n.div` display:grid; grid-template-columns: 1fr 1fr; gap:10px; @media(max-width:900px){ grid-template-columns:1fr; }`;export{Mn as default};
