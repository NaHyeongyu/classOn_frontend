import{u as ct,e as lt,r as o,g as xt,j as e,v as O,P as H,T as ut,d as n,t as pt,b as We}from"./index-CJzRppoi.js";import{B as ht}from"./BackButton-D3WMQeJJ.js";import{C as gt}from"./ConfirmDialog-D7cbhoS1.js";import{d as ft,l as G,c as mt,u as jt}from"./counsels-5uIYAHf5.js";import{g as bt,b as yt}from"./students-DebGYVgr.js";import{f as Ne}from"./format-CD1P4D3U.js";function mn(){const s=ct(),{id:a,tab:l}=lt(),i=o.useMemo(()=>Number(a),[a]),[r,p]=o.useState(null),[u,h]=o.useState(!1),[w,D]=o.useState(null),[$,de]=o.useState(""),[ce,K]=o.useState(!1),[le,q]=o.useState(""),[v,Q]=o.useState([]),[xe,ue]=o.useState(""),[I,U]=o.useState(null),[pe,T]=o.useState(""),[N,_e]=o.useState([]),[Ve,he]=o.useState(!1),[ge,fe]=o.useState(null),[me,L]=o.useState([]),[Je,je]=o.useState(!1),[be,C]=o.useState(null),[ye,X]=o.useState(!1),[A,F]=o.useState(""),[we,Z]=o.useState(""),[Ke,ve]=o.useState(!1),[qe,ee]=o.useState(null),[te,ne]=o.useState(null),[Ce,Se]=o.useState(!1),[R,B]=o.useState(""),[ke,P]=o.useState(""),[Qe,Ee]=o.useState(!1),{error:Ue}=xt(),Xe=o.useMemo(()=>{if(!r?.birthDate)return;const[t,d,c]=r.birthDate.split("-").map(Number);if(!t||!d||!c)return;const y=new Date;let Me=y.getFullYear()-t;const $e=y.getMonth()+1,dt=y.getDate();return($e<d||$e===d&&dt<c)&&(Me-=1),Me},[r?.birthDate]),g=o.useMemo(()=>{switch(l){case"courses":case"attendance":case"counsels":return l;default:return"courses"}},[l]);function Ze(t){switch(t){case"IN_PROGRESS":return"진행중";case"PENDING":return"대기";case"STOPPED":return"중단";default:return t}}o.useEffect(()=>{if(!i||Number.isNaN(i))return;let t=!1;async function d(){h(!0),D(null);try{const c=await bt(i);t||p(c)}catch(c){t||D(c?.message||"원생 정보를 불러오지 못했습니다.")}finally{t||h(!1)}}return d(),()=>{t=!0}},[i]),o.useEffect(()=>{if(!i||g!=="counsels")return;let t=!1;async function d(){je(!0),C(null);try{const c=await G({studentId:i,size:100});t||L(c.content||[])}catch(c){t||C(c?.message||"상담 기록을 불러오지 못했습니다.")}finally{t||je(!1)}}return d(),()=>{t=!0}},[i,g]),o.useEffect(()=>{if(i)try{const t=localStorage.getItem(`student:notes:${i}`)||"";de(t),q(t)}catch{}},[i]),o.useEffect(()=>{if(i)try{const t=localStorage.getItem(`student:memos:${i}`),d=t?JSON.parse(t):[];Q(Array.isArray(d)?d:[])}catch{Q([])}},[i]),o.useEffect(()=>{if(!i||g!=="attendance")return;let t=!1;async function d(){he(!0),fe(null);try{const c=await yt(i,{size:200});t||_e(c?.content||[])}catch(c){t||fe(c?.message||"출석 정보를 불러오지 못했습니다.")}finally{t||he(!1)}}return d(),()=>{t=!0}},[i,g]);function et(){if(!i)return;const t=(le||"").trim();de(t),K(!1);try{localStorage.setItem(`student:notes:${i}`,t)}catch{}}function se(t){Q(t);try{localStorage.setItem(`student:memos:${i}`,JSON.stringify(t))}catch{}}function tt(){if(!i)return;const t=(xe||"").trim();if(!t)return;const d=new Date().toISOString(),c={id:Date.now(),text:t,createdAt:d};se([c,...v]),ue("")}function nt(t){const d=v.find(c=>c.id===t);d&&(U(t),T(d.text))}function st(){if(I==null)return;const t=(pe||"").trim(),d=new Date().toISOString(),c=v.map(y=>y.id===I?{...y,text:t,updatedAt:d}:y);se(c),U(null),T("")}function it(){U(null),T("")}function rt(t){const d=v.filter(c=>c.id!==t);se(d)}async function ot(){if(!(!i||!A)){ve(!0),C(null);try{await mt({studentId:i,counselTime:Oe(A),content:we||void 0});const t=await G({studentId:i,size:100});L(t.content||[]),X(!1),F(""),Z("")}catch(t){C(t?.message||"저장에 실패했습니다.")}finally{ve(!1)}}}async function at(t){if(R){Ee(!0),C(null);try{await jt(t,{counselTime:Oe(R),content:ke||void 0});const d=await G({studentId:i,size:100});L(d.content||[]),ee(null),B(""),P("")}catch(d){C(d?.message||"수정에 실패했습니다.")}finally{Ee(!1)}}}return e.jsxs(wt,{children:[e.jsxs(vt,{children:[e.jsx(ht,{to:"/students",label:"뒤로"}),e.jsx("h2",{children:"원생 상세"})]}),e.jsxs(Ct,{children:["원생 관리 > ",r?.name||"상세"]}),u&&e.jsxs(ze,{children:[e.jsxs(De,{children:[e.jsxs(b,{children:[e.jsx(S,{children:"기본 정보"}),e.jsxs(qt,{children:[e.jsx(Kt,{}),e.jsxs("div",{children:[e.jsx(V,{w:140,h:18}),e.jsx(V,{w:120,h:12,mt:6})]}),e.jsx(Qt,{})]}),e.jsx(M,{}),e.jsx(M,{}),e.jsx(M,{}),e.jsx(M,{})]}),e.jsxs(b,{children:[e.jsx(S,{children:"부모님 정보"}),e.jsx(M,{}),e.jsx(M,{})]})]}),e.jsx(Ie,{children:e.jsxs(b,{children:[e.jsx(Ae,{children:e.jsxs(Fe,{children:[e.jsxs(E,{"data-active":!0,children:["수강수업 ",e.jsx(Re,{children:"0"})]}),e.jsx(E,{children:"출석현황"}),e.jsx(E,{children:"상담기록"})]})}),e.jsx(Te,{}),e.jsxs(W,{children:[e.jsx(V,{w:240,h:14}),e.jsx(V,{w:560,h:120,mt:10})]})]})})]}),w&&e.jsx(oe,{children:w}),!u&&e.jsxs(ze,{children:[e.jsxs(De,{children:[e.jsxs(b,{children:[e.jsxs(Y,{children:[e.jsx(S,{children:"기본 정보"}),e.jsx(ie,{children:e.jsx(O,{as:"button",onClick:()=>s(`/students/${i}/edit`),children:"수정"})})]}),r?e.jsx(e.Fragment,{children:e.jsxs(Le,{children:[e.jsxs(St,{children:[e.jsx(kt,{children:r.name.slice(0,1)}),e.jsxs("div",{children:[e.jsx(Et,{children:r.name}),e.jsxs(re,{children:["코드 ",r.code," · ID ",r.id]})]}),e.jsx(Mt,{"data-type":r.status,children:r.status==="ENROLLED"?"수강중":r.status==="ON_LEAVE"?"휴학":"대기중"})]}),e.jsxs(f,{children:[e.jsx(m,{children:"연락처"}),e.jsx(k,{children:Ne(r.phoneNumber)})]}),e.jsxs(f,{children:[e.jsx(m,{children:"생년월일"}),e.jsxs(k,{children:[r.birthDate||"-",r.birthDate?e.jsxs(e.Fragment,{children:[" ",`(만 ${Xe??"-"}세)`]}):null]})]}),e.jsxs(f,{children:[e.jsx(m,{children:"주소"}),e.jsx(k,{children:r.address||"-"})]}),e.jsxs(f,{children:[e.jsx(m,{children:"등록일"}),e.jsx(k,{children:r.joinedDate||r.createdAt?.slice(0,10)||"-"})]})]})}):e.jsx(z,{children:"원생 정보를 찾을 수 없습니다."})]}),e.jsxs(b,{children:[e.jsx(Y,{children:e.jsx(S,{children:"부모님 정보"})}),r?e.jsxs(Le,{children:[e.jsxs(f,{children:[e.jsx(m,{children:"보호자 이름"}),e.jsx(k,{children:r.parentName||"-"})]}),e.jsxs(f,{children:[e.jsx(m,{children:"보호자 연락처"}),e.jsx(k,{children:Ne(r.guardianPhone)})]})]}):e.jsx(z,{children:"부모님 정보를 찾을 수 없습니다."})]}),e.jsxs(b,{children:[e.jsxs(Y,{children:[e.jsx(S,{children:"특이사항"}),e.jsx(ie,{children:ce?e.jsxs(e.Fragment,{children:[e.jsx(j,{type:"button",onClick:()=>{K(!1),q($)},children:"취소"}),e.jsx(H,{as:"button",onClick:et,children:"저장"})]}):e.jsx(O,{as:"button",onClick:()=>K(!0),children:$?"편집":"메모 추가"})})]}),ce?e.jsx(Pt,{rows:8,value:le,onChange:t=>q(t.target.value),placeholder:"예: 과학고 진학 관심, 수학 약점 보완 필요, 알러지 등"}):e.jsx(e.Fragment,{children:$?e.jsx(Bt,{title:$,children:$}):e.jsx(_,{children:"특이사항이 없습니다. 메모를 추가해 주세요."})})]}),e.jsxs(b,{children:[e.jsxs(Y,{children:[e.jsx(S,{children:"메모 사항"}),e.jsx(ie,{children:e.jsx(O,{as:"button",onClick:tt,children:"추가"})})]}),e.jsx(Ot,{children:e.jsx(Pe,{rows:3,value:xe,onChange:t=>ue(t.target.value),placeholder:"메모를 입력하세요"})}),e.jsxs(Ht,{children:[v.length===0&&e.jsx(_,{children:"메모가 없습니다. 메모를 추가해 주세요."}),v.map(t=>e.jsxs(Gt,{children:[e.jsxs(Yt,{children:[e.jsxs(Wt,{children:[Ut(t.updatedAt||t.createdAt),t.updatedAt?e.jsx("span",{style:{marginLeft:6,color:"#6b7280"},children:"(수정됨)"}):null]}),e.jsx(_t,{children:I===t.id?e.jsxs(e.Fragment,{children:[e.jsx(j,{type:"button",onClick:it,children:"취소"}),e.jsx(H,{as:"button",onClick:st,children:"저장"})]}):e.jsxs(e.Fragment,{children:[e.jsx(j,{type:"button",onClick:()=>nt(t.id),children:"편집"}),e.jsx(j,{type:"button",onClick:()=>rt(t.id),children:"삭제"})]})})]}),I===t.id?e.jsx(Pe,{rows:4,value:pe,onChange:d=>T(d.target.value)}):e.jsx(Vt,{children:t.text})]},t.id))]})]})]}),e.jsx(Ie,{children:e.jsxs(b,{children:[e.jsx(Ae,{children:e.jsxs(Fe,{children:[e.jsxs(E,{"data-active":g==="courses",onClick:()=>s(`/students/${i}/courses`),children:["수강수업 ",e.jsx(Re,{children:r?.courses?.length??0})]}),e.jsx(E,{"data-active":g==="attendance",onClick:()=>s(`/students/${i}/attendance`),children:"출석현황"}),e.jsx(E,{"data-active":g==="counsels",onClick:()=>s(`/students/${i}/counsels`),children:"상담기록"})]})}),e.jsx(Te,{}),g==="courses"&&e.jsx(W,{children:r?.courses?.length?e.jsx($t,{children:r.courses.map(t=>e.jsxs(Nt,{children:[e.jsxs(zt,{children:[e.jsx(Dt,{children:t.title}),e.jsx(j,{type:"button",onClick:()=>s(`/classes/${t.id}`),children:"상세"})]}),e.jsxs(It,{children:[e.jsx("code",{children:t.code}),e.jsx(Tt,{"data-type":t.status,children:Ze(t.status)})]})]},t.id))}):e.jsx(_,{children:"수강 중인 수업이 없습니다."})}),g==="attendance"&&e.jsxs(W,{children:[ge&&e.jsx(oe,{children:ge}),e.jsxs(Lt,{children:[e.jsxs(Be,{children:[e.jsx(ae,{children:"이번 달 출석률"}),e.jsx(At,{children:Xt(N)}),e.jsx(re,{children:Zt(N)})]}),e.jsxs(Be,{children:[e.jsx(ae,{children:"최근 결석"}),e.jsx(re,{children:en(N)})]})]}),Ve?e.jsx(z,{children:"불러오는 중..."}):e.jsxs(ut,{style:{minWidth:640},children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"날짜"}),e.jsx("th",{children:"과목"}),e.jsx("th",{children:"상태"}),e.jsx("th",{children:"메모"})]})}),e.jsx("tbody",{children:N.length===0?e.jsx("tr",{children:e.jsx("td",{colSpan:4,children:e.jsx(z,{children:"출석 기록이 없습니다."})})}):N.map((t,d)=>e.jsxs("tr",{children:[e.jsx("td",{children:t.date}),e.jsx("td",{children:t.courseTitle}),e.jsx("td",{children:t.present?"출석":"결석"}),e.jsx("td",{children:t.reason||"-"})]},d))})]})]}),g==="counsels"&&e.jsxs(W,{children:[e.jsxs(rn,{children:[e.jsx("div",{children:e.jsx(ae,{children:"상담기록"})}),e.jsx("div",{children:ye?e.jsxs(e.Fragment,{children:[e.jsx(j,{type:"button",onClick:()=>{X(!1),Z(""),F("")},children:"취소"}),e.jsx(H,{as:"button",onClick:ot,disabled:Ke||!A,children:"저장"})]}):e.jsx(O,{as:"button",onClick:()=>{X(!0),F(nn())},children:"상담 추가"})})]}),be&&e.jsx(oe,{children:be}),ye&&e.jsxs(on,{children:[e.jsxs(f,{children:[e.jsx(m,{children:"상담 일시"}),e.jsx(He,{type:"datetime-local",value:A,onChange:t=>F(t.target.value),step:300})]}),e.jsxs(f,{style:{gridColumn:"1 / -1"},children:[e.jsx(m,{children:"내용"}),e.jsx(Ge,{rows:4,value:we,onChange:t=>Z(t.target.value),placeholder:"상담 내용 또는 메모"})]})]}),Je?e.jsx(z,{children:"불러오는 중..."}):me.length===0?e.jsx(_,{children:"상담 기록이 없습니다."}):e.jsx(Ft,{children:me.map(t=>{const d=qe===t.id;return e.jsx(Rt,{children:d?e.jsxs(e.Fragment,{children:[e.jsxs(ln,{children:[e.jsxs(f,{children:[e.jsx(m,{children:"상담 일시"}),e.jsx(He,{type:"datetime-local",value:R,onChange:c=>B(c.target.value),step:300})]}),e.jsxs(f,{style:{gridColumn:"1 / -1"},children:[e.jsx(m,{children:"내용"}),e.jsx(Ge,{rows:4,value:ke,onChange:c=>P(c.target.value)})]})]}),e.jsxs(Ye,{children:[e.jsx(j,{type:"button",onClick:()=>{ee(null),B(""),P("")},children:"취소"}),e.jsx(H,{as:"button",disabled:Qe||!R,onClick:()=>at(t.id),children:"저장"})]})]}):e.jsxs(e.Fragment,{children:[e.jsxs(an,{children:[e.jsx(dn,{children:tn(t.counselTime)}),e.jsxs(Ye,{children:[e.jsx(j,{type:"button",onClick:()=>{ee(t.id),B(sn(t.counselTime)),P(t.content||"")},children:"편집"}),e.jsx(j,{type:"button",onClick:()=>ne(t.id),children:"삭제"})]})]}),e.jsx(cn,{children:(t.content||"").trim()||"내용 없음"})]})},t.id)})})]})]})})]}),e.jsx(gt,{open:te!=null,title:"상담 일정 삭제",message:"이 상담 일정을 삭제하시겠어요? 되돌릴 수 없습니다.",confirmLabel:"삭제",cancelLabel:"취소",tone:"danger",busy:Ce,onCancel:()=>{Ce||ne(null)},onConfirm:async()=>{if(!(!i||te==null)){Se(!0);try{await ft(te);const t=await G({studentId:i,size:100});L(t.content||[]),ne(null)}catch(t){Ue(t?.message||"삭제에 실패했습니다.")}finally{Se(!1)}}}})]})}const wt=n.div`
  display: grid; gap: 14px;
`,vt=n.div`
  display: flex; align-items: center; gap: 10px;
  h2 { margin: 0; font-size: 20px; color: #0f172a; }
`,Ct=n.div`
  color: #9ca3af; font-size: 12px; margin-top: -6px; margin-bottom: 4px;
`,ze=n.div`
  display: grid; grid-template-columns: 360px 1fr; gap: 14px; align-items: start;
  @media (max-width: 1200px) { grid-template-columns: 1fr; }
`,De=n.aside`
  display: grid; gap: 18px;
`,Ie=n.section``,b=n.section`
  background: #fff; border: 1px solid #e5e7eb; border-radius: 14px; padding: 16px; min-width: 0;
  box-shadow: 0 1px 2px rgba(0,0,0,0.03);
`,S=n.h3`
  margin: 0; font-size: 16px; color: #0f172a;
`,Y=n.div`
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;
`,ie=n.div`
  display: inline-flex; gap: 8px;
`,Te=n.div`
  height: 1px; background: #e5e7eb; margin: 6px 0 10px;
`,Le=n.div`
  display: grid; gap: 14px;
`,St=n.div`
  display: grid; grid-template-columns: 44px 1fr auto; gap: 12px; align-items: center; margin-bottom: 6px;
`,kt=n.div`
  width: 44px; height: 44px; border-radius: 12px; background: #eef2ff; color: #4f46e5; display: grid; place-items: center; font-weight: 800;
`,Et=n.div`
  font-size: 19px; font-weight: 900; color: #0f172a; letter-spacing: -0.01em;
`,re=n.div`
  color: #6b7280; font-size: 12px;
`,Mt=n.span`
  padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: 800;
  &[data-type='ENROLLED'] { background:#dcfce7; color:#16a34a; }
  &[data-type='ON_LEAVE'] { background:#fef3c7; color:#b45309; }
  &[data-type='PENDING'] { background:#f3e8ff; color:#7c3aed; }
`,f=n.div`
  display: grid; grid-template-columns: 100px 1fr; gap: 8px;
`,m=n.div`
  color: #6b7280; font-size: 13px; align-self: center;
`,k=n.div`
  color: #111827; font-size: 15px;
`,z=n.div`
  color: #6b7280; font-size: 13px;
`,oe=n.div`
  color: #b91c1c; font-size: 12px; font-weight: 700;
`,Ae=n.div`
  display: flex; align-items: center; justify-content: space-between;
  position: sticky; top: 0; background: #fff; z-index: 5; padding-top: 2px;
`,Fe=n.div`
  display: inline-flex; gap: 6px; flex-wrap: wrap;
`,E=n(We)`
  height: 36px;
  padding: 0 14px;
  font-size: 13px;
  &[data-active='true'] {
    background:#111827;
    color:#fff;
    border-color:#111827;
  }
`,Re=n.span`
  min-width: 18px; height: 18px; padding: 0 6px; border-radius: 9999px; background:#e5e7eb; color:#374151; font-weight: 800; font-size: 11px; display: inline-flex; align-items: center; justify-content: center;
`,W=n.div`
  display: grid; gap: 10px;
`,$t=n.div`
  display: grid; gap: 8px;
`,Nt=n.div`
  border: 1px solid #e5e7eb; border-radius: 10px; padding: 10px 12px; display: grid; gap: 6px; background: #fff;
`,zt=n.div`
  display: flex; align-items: center; justify-content: space-between; gap: 8px;
`,Dt=n.div`
  font-weight: 800; color: #0f172a; font-size: 14px;
`,It=n.div`
  display: flex; align-items: center; gap: 10px; color: #6b7280; font-size: 12px;
  code { background:#f3f4f6; padding: 2px 6px; border-radius: 6px; }
`,Tt=n.span`
  padding: 2px 8px; border-radius: 9999px; font-size: 12px; font-weight: 800;
  &[data-type='IN_PROGRESS'] { background:#dcfce7; color:#16a34a; }
  &[data-type='PENDING'] { background:#f3e8ff; color:#7c3aed; }
  &[data-type='STOPPED'] { background:#e5e7eb; color:#374151; }
`,Lt=n.div`
  display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px;
`,Be=n.div`
  border: 1px solid #e5e7eb; border-radius: 10px; padding: 10px 12px; background: #fff;
`,ae=n.div`
  color: #6b7280; font-size: 12px;
`,At=n.div`
  font-size: 22px; font-weight: 900; color: #0f172a; margin-top: 4px;
`,Ft=n.div`
  display: grid; gap: 8px;
`,Rt=n.div`
  border: 1px solid #e5e7eb; border-radius: 10px; padding: 10px 12px; background: #fff; display: grid; gap: 4px;
  strong { color: #0f172a; }
`,_=n.div`
  color: #6b7280; font-size: 13px; text-align: center; border: 1px dashed #e5e7eb; border-radius: 10px; padding: 16px; background: #fafafa;
`,j=n(We)`
  height: 34px;
  padding: 0 14px;
  font-size: 13px;
`,Bt=n.pre`
  margin: 0; white-space: pre-line; color: #111827; font-size: 15px; line-height: 1.7;
  background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 12px 14px; text-wrap: pretty;
`,Pt=n.textarea`
  width: 100%; border: 1px solid #e5e7eb; border-radius: 10px; padding: 10px 12px; resize: vertical; font-size: 14px; color: #111827; min-height: 120px;
  &:focus { outline: none; box-shadow: 0 0 0 3px rgba(79,70,229,0.15); }
`,Ot=n.div` display:grid; gap:8px; `,Ht=n.div` display:grid; gap:8px; `,Gt=n.div`
  border: 1px solid #e5e7eb; border-radius: 10px; padding: 10px 12px; background: #fff; display: grid; gap: 6px;
`,Yt=n.div` display:flex; align-items:center; justify-content:space-between; gap:8px; `,Wt=n.div` color:#6b7280; font-size:12px; `,_t=n.div` display:inline-flex; gap:6px; `,Pe=n.textarea`
  width: 100%; border: 1px solid #e5e7eb; border-radius: 10px; padding: 8px 10px; resize: vertical; font-size: 14px; color: #111827;
`,Vt=n.pre` margin:0; white-space:pre-wrap; color:#111827; font-size:14px; `,Jt=pt`
  0% { background-position: -200px 0; }
  100% { background-position: 200px 0; }
`,J=n.div`
  background: linear-gradient(90deg, #eef2f7 25%, #f6f8fb 37%, #eef2f7 63%);
  background-size: 400px 100%;
  animation: ${Jt} 1.2s ease-in-out infinite;
  border-radius: 8px;
  width: ${({w:s})=>s?`${s}px`:"100%"};
  height: ${({h:s})=>s?`${s}px`:"12px"};
  margin-top: ${({mt:s})=>s?`${s}px`:0};
`,V=J,Kt=n(J).attrs({w:44,h:44})`
  border-radius: 12px;
`,qt=n.div`
  display: grid; grid-template-columns: 44px 1fr 80px; gap: 10px; align-items: center; margin-bottom: 8px;
`,Qt=n(J).attrs({w:80,h:24})``,M=n(J).attrs({h:16,mt:10})``;function x(s){return String(s).padStart(2,"0")}function Ut(s){try{const a=new Date(s),l=a.getFullYear(),i=x(a.getMonth()+1),r=x(a.getDate()),p=x(a.getHours()),u=x(a.getMinutes());return`${l}-${i}-${r} ${p}:${u}`}catch{return s}}function Xt(s){const a=new Date,l=a.getFullYear(),i=a.getMonth()+1,r=s.filter(h=>{const[w,D]=h.date.split("-").map(Number);return w===l&&D===i});if(r.length===0)return"—";const p=r.filter(h=>h.present).length;return`${Math.round(p/r.length*100)}%`}function Zt(s){const a=new Date,l=a.getFullYear(),i=a.getMonth()+1,r=s.filter(u=>{const[h,w]=u.date.split("-").map(Number);return h===l&&w===i});return r.length===0?"—":`${r.filter(u=>u.present).length}/${r.length}회 출석`}function en(s){const a=s.filter(l=>!l.present).slice(0,2).map(l=>l.date);return a.length===0?"없음":a.join(", ")}function tn(s){try{const a=new Date(s),l=["일","월","화","수","목","금","토"][a.getDay()],i=a.getFullYear(),r=a.getMonth()+1,p=a.getDate(),u=x(a.getHours()),h=x(a.getMinutes());return`${i}년 ${r}월 ${p}일 (${l}) ${u}:${h}`}catch{return s}}function nn(){const s=new Date,a=s.getFullYear(),l=x(s.getMonth()+1),i=x(s.getDate()),r=x(s.getHours()),p=x(s.getMinutes());return`${a}-${l}-${i}T${r}:${p}`}function Oe(s){return s&&(s.length===16?`${s}:00`:s)}function sn(s){try{const a=new Date(s),l=a.getFullYear(),i=x(a.getMonth()+1),r=x(a.getDate()),p=x(a.getHours()),u=x(a.getMinutes());return`${l}-${i}-${r}T${p}:${u}`}catch{return""}}const rn=n.div`
  display: flex; align-items: center; justify-content: space-between; gap: 8px;
`,on=n.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 4px 0 8px;
  @media (max-width: 900px) { grid-template-columns: 1fr; }
`,He=n.input`
  height: 36px; border: 1px solid #e5e7eb; border-radius: 10px; padding: 0 10px; font-size: 14px;
`,Ge=n.textarea`
  width: 100%; border: 1px solid #e5e7eb; border-radius: 10px; padding: 8px 10px; font-size: 14px; resize: vertical;
`,an=n.div` display:flex; align-items:center; justify-content:space-between; gap:8px; `,Ye=n.div` display:inline-flex; gap:8px; `,dn=n.div` font-weight:900; color:#0f172a; `,cn=n.pre` margin:4px 0 0; white-space:pre-wrap; color:#111827; font-size:14px; `,ln=n.div` display:grid; grid-template-columns: 1fr 1fr; gap:10px; @media(max-width:900px){ grid-template-columns:1fr; }`;export{mn as default};
