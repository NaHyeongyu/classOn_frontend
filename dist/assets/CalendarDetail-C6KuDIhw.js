import{j as e,d as o,r as i,p as st,i as Mt,u as Bt,a as zt,b as Nt,c as Ue}from"./index-CyW3XeFu.js";import{B as Rt}from"./BackButton-CqwBrKvh.js";import{C as It}from"./ClassList-BG1XC6pL.js";import{c as Ht,d as ot,e as it,G as ie,f as re}from"./UI-evna17pR.js";import{E as At}from"./EmptyPlaceholder-CEMwEeyM.js";import{S as M}from"./SelectBox-0wdeeUm0.js";import{p as Pt,s as Yt,f as A}from"./dateUtils-CoPTMMCx.js";import{u as Ot,l as Ft,c as Gt,a as Vt,d as Wt}from"./todos-DITf7dYu.js";import{l as _t,c as Ut}from"./courses-D3Jx7eTn.js";import{l as rt,c as Kt}from"./counsels-DdF3oVhC.js";import{a as qt,b as Jt}from"./format-Do6vjlY3.js";import{g as Ke}from"./calendar-8RuGfxTo.js";import{r as D}from"./errors-C6OcbAl5.js";import{l as Qt}from"./students-9Fwn5gCF.js";import{u as Xt}from"./useConfirmDialog-BAuS9Lmd.js";import"./ConfirmDialog-Ba2sBuvj.js";function Zt({label:s,onBack:r,onPrev:a,onNext:f,onToday:p}){return e.jsxs(en,{children:[e.jsx(tn,{children:e.jsx(rn,{label:"돌아가기",onClick:r})}),e.jsxs(nn,{children:[e.jsx(qe,{onClick:a,"aria-label":"이전 날짜",children:"<"}),e.jsx(on,{children:s}),e.jsx(qe,{onClick:f,"aria-label":"다음 날짜",children:">"})]}),e.jsx(sn,{children:e.jsx(an,{type:"button",onClick:p,children:"오늘"})})]})}const en=o.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 12px;
  padding-bottom: 12px;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    justify-items: center;
    text-align: center;
  }
`,tn=o.div`
  display: flex;
  @media (max-width: 768px) {
    order: 2;
  }
`,nn=o.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`,sn=o.div`
  display: flex;
  justify-content: flex-end;
  @media (max-width: 768px) {
    justify-content: center;
    order: 3;
  }
`,on=o.span`
  min-width: 150px;
  text-align: center;
  font-weight: 600;
  font-size: 25px;
  letter-spacing: -0.01em;
  color: #111827;
  padding: 6px 12px;
`,rn=o(Rt)`
  button {
    appearance: none;
    background: transparent;
    border: none;
    color: #111827;
    font-size: 14px;
    font-weight: 600;
    padding: 0;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
  }
  button:hover { color: #1f2937; }
  button:focus-visible { outline: 2px solid #111827; border-radius: 10px; outline-offset: 2px; }
`,qe=o.button`
  appearance: none;
  width: 30px;
  height: 30px;
  border: none;
  background: transparent;
  color: #111827;
  font-size: 18px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover { color: #1f2937; }
  &:active { transform: translateY(1px); }
  &:focus-visible { outline: 2px solid #111827; border-radius: 12px; outline-offset: 2px; }
`,an=o.button`
  appearance: none;
  height: 36px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid #4f46e5;
  background: transparent;
  color: #4f46e5;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
  &:hover { background: rgba(79, 70, 229, 0.08); }
  &:active { background: rgba(79, 70, 229, 0.16); transform: translateY(1px); }
  &:focus-visible { outline: 2px solid #4f46e5; border-radius: 12px; outline-offset: 2px; }
`;function ln({items:s,onAdd:r,onDetail:a}){return e.jsxs(cn,{children:[e.jsxs(dn,{children:[e.jsxs(un,{children:[e.jsx(pn,{"aria-hidden":!0,children:wn}),e.jsx("h4",{children:"상담 일정"})]}),e.jsx(fn,{children:r?e.jsx(xn,{type:"button",onClick:r,children:"+ 상담 추가"}):null})]}),e.jsx(gn,{children:s.map((f,p)=>e.jsxs(mn,{children:[e.jsxs(bn,{children:[e.jsx("div",{className:"left",children:e.jsx("strong",{children:f.with||"학생"})}),e.jsxs("div",{className:"right",children:[e.jsx(vn,{children:f.time}),a&&f.studentId?e.jsx(hn,{type:"button",onClick:()=>a(f.studentId,f.id),children:"상세"}):null]})]}),e.jsx(jn,{children:(f.title||"").trim()||"내용 없음"})]},`cs-${p}`))})]})}const cn=o.section`
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 12px;
  background: #fff;
  display: flex;
  flex-direction: column;
  height: 100%; /* fill half container */
  min-height: 0; /* allow Grid to scroll */
`,dn=o.div`
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;
  h4 { margin: 0; font-size: 15px; color: #111827; }
`,un=o.div`
  display: flex; align-items: center; gap: 8px;
`,pn=o.span`
  width: 28px; height: 28px; border-radius: 8px; display: grid; place-items: center; background: #f3f4f6; color: #4f46e5;
`,fn=o.div``,xn=o(ot)``,hn=o.button`
  ${Ht.outline};
  height: 40px;
  padding: 0 16px;
  font-size: 14px;
  font-weight: 600;
`,gn=o.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  padding: 4px 2px;
  flex: 1 1 auto;
  min-height: 0;
  align-content: start; /* avoid vertical stretching when few items */
  align-items: start;
  grid-auto-rows: max-content;
`,mn=o.div`
  border: 1px solid #e5e7eb; border-radius: 12px; padding: 12px; background: #fff;
`,bn=o.div`
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;
  .right { display:inline-flex; align-items:center; gap:8px; }
`,jn=o.div` color:#374151; font-size:13px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; `,vn=o.span`
  color: #6b7280; font-size: 12px; font-weight: 700;
`,wn=e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"})});function yn({inProgress:s,done:r,onAdd:a,onToggle:f,onDelete:p,onEdit:c}){const[x,v]=i.useState(s);return i.useEffect(()=>{v(s)},[s]),i.useEffect(()=>{},[r]),e.jsxs(Cn,{children:[e.jsxs(Sn,{children:[e.jsxs(kn,{children:[e.jsx(Tn,{"aria-hidden":!0,children:Pn}),e.jsx("h4",{children:"할 일"}),e.jsx(Ln,{children:s.length})]}),e.jsx(Dn,{children:e.jsx(ot,{type:"button",onClick:a,children:"+ 할일 추가"})})]}),x.length===0?e.jsx(At,{title:"오늘 등록된 할 일이 없습니다."}):e.jsx(En,{children:x.map((u,b)=>e.jsxs($n,{children:[e.jsxs(Mn,{children:[e.jsx(Hn,{"aria-hidden":!0}),e.jsxs(An,{children:[e.jsx(Bn,{title:u.title,children:u.title}),u.content&&e.jsx(zn,{title:u.content,children:u.content})]})]}),e.jsxs(In,{children:[typeof u.id=="number"&&e.jsx(Nn,{type:"button","data-variant":"edit",onClick:()=>c?.(u.id),children:"수정"}),typeof u.id=="number"&&e.jsx(Rn,{type:"button",onClick:()=>void p?.(u.id),children:"삭제"})]})]},`p-${u.id??b}`))})]})}const Cn=o.section`
  border: 1px solid #e5e7eb; border-radius: 16px; padding: 12px; background: #fff; display: flex; flex-direction: column;
`,Sn=o.div`
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;
  h4 { margin: 0; font-size: 15px; color: #111827; }
`,kn=o.div`
  display: flex; align-items: center; gap: 8px;
`,Tn=o.span`
  width: 28px; height: 28px; border-radius: 8px; display: grid; place-items: center; background: #eef2ff; color: #4f46e5;
`,Dn=o.div``,Ln=o.span`
  background: #e5e7eb; color: #374151; height: 20px; min-width: 22px; padding: 0 6px; border-radius: 9999px; display: inline-flex; align-items: center; justify-content: center; font-weight: 700; font-size: 12px;
`,En=o.div`
  display: grid;
  gap: 8px;
  padding: 4px 2px;
  /* 상세 페이지는 내부 스크롤 없이 전체 표시 */
`,$n=o.div`
  display: grid; grid-template-columns: 1fr auto; align-items: flex-start; gap: 10px;
  border: 1px solid #e5e7eb; border-radius: 10px; padding: 10px 12px; background: #fff;
  transition: background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
  &:hover { background: #fafafa; border-color: #e2e8f0; box-shadow: 0 1px 2px rgba(0,0,0,0.04); }
`,Mn=o.div`
  display: grid; grid-template-columns: 10px 1fr; gap: 10px; align-items: flex-start; min-width: 0;
`,Bn=o.div`
  font-weight: 800; margin-bottom: 2px; font-size: 14px; letter-spacing: -0.01em; color: #0f172a;
  display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;
`,zn=o.div`
  color: #64748b;
  font-size: 12.5px;
  line-height: 1.5;
  white-space: pre-line;
  display: -webkit-box;
  -webkit-line-clamp: 5; /* 상세 페이지는 5줄 표시 */
  -webkit-box-orient: vertical;
  overflow: hidden;
`,Nn=o(it)`
  height: 40px;
  padding: 0 16px;
  font-size: 14px;
`,Rn=o(it)`
  height: 40px;
  padding: 0 16px;
  font-size: 14px;
  border-color: #ef4444;
  color: #ef4444;
  &:hover {
    background: #fee2e2;
    border-color: #dc2626;
  }
`,In=o.div`
  display: flex; gap: 6px; align-items: center;
`,Hn=o.span`
  width: 10px; height: 10px; border-radius: 9999px; background: #4f46e5; margin-top: 5px;
`,An=o.div`
  display: flex; flex-direction: column; gap: 2px; min-width: 0;
`,Pn=e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"M20 6L9 17l-5-5"})});function Yn(s){const r=i.useMemo(()=>s?Pt(s):Yt(new Date),[s]),a=qt(r,{includeWeekday:!0}),f=a==="—"?`${r.getFullYear()}년 ${r.getMonth()+1}월 ${r.getDate()}일`:a,{classesForDate:p}=Ot({dates:[[r]]}),c=i.useMemo(()=>p(r),[p,r]),[x,v]=i.useState([]);i.useEffect(()=>{let d=!1;async function B(){try{const w=A(r);try{const L=`/api/counsels?${new URLSearchParams({onYmd:w,size:String(50)}).toString()}`,z=st(L);if(z.data&&!d){const _=(z.data.content||[]).map(j=>({id:j.id,studentId:j.studentId,time:Je(j.counselTime),title:(j.content||"").split(/\r?\n/)[0]||"상담",with:j.studentName,owner:"-",done:j.status==="CONVERTED"}));v(_)}}catch{}const C=await rt({onYmd:w,size:50});if(d)return;const h=(C.content||[]).map(S=>({id:S.id,studentId:S.studentId,time:Je(S.counselTime),title:(S.content||"").split(/\r?\n/)[0]||"상담",with:S.studentName,owner:"-",done:S.status==="CONVERTED"}));v(h)}catch{d||v([])}}return B(),()=>{d=!0}},[r]);function u(){const d=new Date(r);return d.setDate(d.getDate()-1),A(d)}function b(){const d=new Date(r);return d.setDate(d.getDate()+1),A(d)}function y(){return A(new Date)}return{date:r,label:f,classes:c,counsels:x,prevYMD:u,nextYMD:b,todayYMD:y}}function Je(s){if(!s)return"--:--";try{return s.replace("T"," ").slice(11,16)}catch{return"--:--"}}function On(s){const[r,a]=i.useState(null),[f,p]=i.useState(!1),[c,x]=i.useState(!1),[v,u]=i.useState(null),b=i.useRef(null),y=i.useRef(s),d=i.useCallback(async w=>{b.current&&b.current.abort();const C=new AbortController;b.current=C,u(null),w&&y.current===s?(x(!0),p(!1)):(p(!0),x(!1));try{const h=await Ft(s,void 0,{signal:C.signal});if(y.current!==s)return;a(h)}catch(h){if(h?.name==="AbortError")return;u(D(h,"Failed to load todos"))}finally{y.current===s&&(p(!1),x(!1))}},[s]);i.useEffect(()=>{y.current=s;const w=`/api/todos?dueYmd=${s}`,C=st(w),h=!!C.data;return h?(a(C.data),p(!1),x(!0)):(a(null),p(!0),x(!1)),d(h),()=>{b.current&&b.current.abort()}},[s,d]);const B=i.useCallback(()=>d(!!r&&y.current===s),[d,r,s]);return{data:r,loading:f,revalidating:c,error:v,refresh:B}}function ae(s){Mt(`/api/todos?dueYmd=${s}`)}function Fn({children:s}){return e.jsx(_n,{children:s})}function Gn({children:s}){return e.jsx(Un,{children:s})}function Vn({children:s}){return e.jsx(Kn,{children:s})}function Wn({children:s}){return e.jsx(qn,{children:s})}const _n=o.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  height: calc(100vh - 48px); /* account for main content padding */
  overflow: hidden; /* prevent page scroll; use internal scrolls */
`,Un=o.div`
  display: flex;
  gap: 12px;
  align-items: stretch;
  flex: 1 1 auto;
  min-height: 0; /* allow children to compute internal scroll */
  overflow: hidden;
  @media (max-width: 960px) { flex-direction: column; height: auto; overflow: visible; }
`,Kn=o.div`
  flex: 1 1 0;
  display: grid;
  grid-template-rows: 1fr 1fr; /* 5:5 (1:1) vertical split */
  gap: 12px;
  height: 100%;
  min-height: 0; /* enable internal scrolls in children */
`,qn=o.div`
  flex: 1 1 0;
  display: grid;
  gap: 12px;
  align-content: flex-start;
  height: 100%;
  min-height: 0;
  overflow: auto; /* right column can scroll if long */
`;function ms(){const s=Bt(),{ymd:r}=zt(),{warning:a}=Nt(),{confirm:f,dialog:p}=Xt({confirmLabel:"삭제",cancelLabel:"취소",tone:"danger"}),c=r??A(new Date),{label:x,classes:v,counsels:u,prevYMD:b,nextYMD:y,todayYMD:d}=Yn(c),[B,w]=i.useState([]),[C,h]=i.useState([]),[S,L]=i.useState(!1),[z,_]=i.useState([]),[j,lt]=i.useState(""),[xe,he]=i.useState(!1),[U,ge]=i.useState(null),[K,me]=i.useState(null),[be,je]=i.useState(!1),[ve,N]=i.useState(null);function q(...t){for(const n of t)if(typeof n=="number"&&Number.isFinite(n))return n;return 0}function ct(t){if(!t)return null;const n=String(t).trim();return n==="정기 수업"||n==="정기수업"?null:n||null}function we(t){return t.map(n=>{const l=n.startTime??n.start_at??n.startAt??n.start??null,g=n.endTime??n.end_at??n.endAt??n.end??null,m=q(n.attPresent,n.presentCount,n.attendancePresent,n?.attendance?.present),Lt=q(n.attAbsent,n.absentCount,n.attendanceAbsent,n?.attendance?.absent),Et=q(n.attUnprocessed),$t=ct(n.notes||n.content||n.topic||null);return{subject:n.courseTitle||"수업",time:Ze(l,g),room:"-",teacher:"-",student:"-",done:!1,courseId:n.courseId||void 0,date:n.recordDate||n.date||c,recordId:n.recordId||n.id,notes:$t,attPresent:m,attAbsent:Lt,attUnprocessed:Et}})}i.useMemo(()=>{},[]),i.useEffect(()=>{let t=!1;async function n(){try{const l=await Ke(c);if(t)return;w(we(l))}catch{t||w(v)}}return n(),()=>{t=!0}},[c,v]),i.useEffect(()=>{h(u)},[u]);const{data:E,error:ye,refresh:J}=On(c),[Ce,Se]=i.useState(null),[dt,R]=i.useState(!1),[Q,ke]=i.useState(null),[P,X]=i.useState(""),[Z,ee]=i.useState("");async function ut(){ke(null),X(""),ee(""),R(!0)}function pt(t){const n=(E||[]).find(l=>l.id===t);n&&(ke(t),X(n.title),ee(n.notes||""),R(!0))}const[Y,te]=i.useState(null);async function ft(t){if(t.preventDefault(),!P.trim()){te("제목을 입력해 주세요.");return}const n=c;try{if(Q==null){const l=await Gt({title:P.trim(),notes:Z||void 0,calendarDate:n});ae(c),await J()}else{const l=await Vt(Q,{title:P.trim(),notes:Z||void 0});ae(c),await J()}R(!1),te(null)}catch(l){Se(D(l,"저장에 실패했습니다."))}}async function xt(t){const n=(E||[]).find(g=>g.id===t);if(await f({title:"할 일을 삭제할까요?",message:n?.title?`"${n.title}" 항목을 삭제합니다. 되돌릴 수 없습니다.`:"선택한 할 일을 삭제합니다. 되돌릴 수 없습니다."}))try{await Wt(t),ae(c),await J()}catch(g){Se(D(g,"삭제에 실패했습니다."))}}async function ht(){if(L(!0),N(null),z.length===0){he(!0),ge(null);try{const t=await _t({status:"IN_PROGRESS",size:200});_(t.content)}catch(t){ge(D(t,"수업 목록을 불러오지 못했습니다."))}finally{he(!1)}}}function gt(t){me(t);const n=et(t.startTime)||"00:00",l=et(t.endTime)||"00:00";try{const[g,m]=n.split(":");Pe(g),Oe(m)}catch{}try{const[g,m]=l.split(":");Ge(g),We(m)}catch{}N(null)}async function mt(){if(!K){a("수업 템플릿을 선택해 주세요.");return}const t=tt(`${(Ae||"00").padStart(2,"0")}:${(Ye||"00").padStart(2,"0")}`),n=tt(`${(Fe||"00").padStart(2,"0")}:${(Ve||"00").padStart(2,"0")}`);je(!0),N(null);try{await Ut(K.id,{recordDate:c,startTime:t,endTime:n}),Ue("/api/calendar/classes"),Ue("/api/calendar/classes-range");const l=await Ke(c);w(we(l)),L(!1),me(null)}catch(l){D(l,"").includes("HTTP 409")?N("이미 등록된 수업이 있습니다."):N("수업 추가에 실패했습니다.")}finally{je(!1)}}const bt=i.useMemo(()=>(E||[]).filter(t=>t.status!=="DONE").map(t=>({id:t.id,title:t.title,content:t.notes,done:!1})),[E]),jt=i.useMemo(()=>(E||[]).filter(t=>t.status==="DONE").map(t=>({id:t.id,title:t.title,content:t.notes,done:!0})),[E]),[vt,O]=i.useState(!1),[wt,yt]=i.useState([]),[F,Ct]=i.useState(""),[Te,De]=i.useState(!1),[ne,Le]=i.useState(null),[k,Ee]=i.useState(null),[es,$e]=i.useState(""),[Me,Be]=i.useState(""),[ze,Ne]=i.useState(!1),[Re,$]=i.useState(null),se=i.useMemo(()=>Array.from({length:24},(t,n)=>String(n).padStart(2,"0")),[]),oe=i.useMemo(()=>["00","05","10","15","20","25","30","35","40","45","50","55"],[]),[G,Ie]=i.useState(""),[V,He]=i.useState(""),[Ae,Pe]=i.useState(""),[Ye,Oe]=i.useState(""),[Fe,Ge]=i.useState(""),[Ve,We]=i.useState(""),St=async()=>{De(!0),Le(null);try{const t=await Qt({status:"ENROLLED",size:200});yt(t.content)}catch(t){Le(D(t,"학생 목록을 불러오지 못했습니다."))}finally{De(!1)}};async function kt(){O(!0),$(null),Ie(""),He(""),$e(""),St()}function _e(t){Ee(t),$(null)}function Tt(t,n){return!n||!/^\d{2}:\d{2}$/.test(n)?`${t}T00:00:00`:`${t}T${n}:00`}async function Dt(){if(!k){$("학생을 선택해 주세요.");return}const t=G&&V?`${G}:${V}`:"";if(!t){$("시간을 선택해 주세요.");return}const n=Tt(c,t);Ne(!0),$(null);try{await Kt({studentId:k.id,counselTime:n,content:Me||void 0});const g=((await rt({onYmd:c,size:50})).content||[]).map(m=>({id:m.id,studentId:m.studentId,time:m.counselTime.replace("T"," ").slice(11,16),title:(m.content||"").split(/\r?\n/)[0]||"상담",with:m.studentName,owner:"-",done:m.status==="CONVERTED"}));h(g),O(!1),Ee(null),$e(""),Be("")}catch(l){$(D(l,"상담 추가에 실패했습니다."))}finally{Ne(!1)}}return e.jsxs(Fn,{children:[p,e.jsx(Zt,{label:x,onBack:()=>s("/calendar"),onPrev:()=>s(`/calendar/${b()}`),onNext:()=>s(`/calendar/${y()}`),onToday:()=>s(`/calendar/${d()}`)}),e.jsxs(Gn,{children:[e.jsxs(Vn,{children:[e.jsx(yn,{inProgress:bt,done:jt,onAdd:ut,onDelete:xt,onEdit:pt}),e.jsx(ln,{items:C,onAdd:kt,onDetail:t=>s(`/students/${t}/counsels`)})]}),e.jsxs(Wn,{children:[e.jsx(It,{items:B,titleMode:"subject",showNotes:!0,onAdd:ht}),dt&&e.jsx(le,{onClick:()=>R(!1),children:e.jsxs(ce,{onClick:t=>t.stopPropagation(),children:[e.jsx(de,{children:Q==null?"할 일 추가":"할 일 수정"}),e.jsxs("form",{onSubmit:ft,noValidate:!0,children:[e.jsxs(T,{children:["제목",e.jsx("span",{children:"*"})]}),e.jsx(ue,{value:P,onChange:t=>{X(t.target.value),Y&&te(null)},placeholder:"예: 상담 준비","aria-invalid":!!Y}),Y&&e.jsx(I,{children:Y}),e.jsx(T,{children:"메모 (선택)"}),e.jsx(nt,{rows:4,value:Z,onChange:t=>ee(t.target.value),placeholder:"세부 내용 또는 참고사항"}),e.jsxs(pe,{children:[e.jsx(ie,{type:"button",onClick:()=>R(!1),children:"취소"}),e.jsx(re,{type:"submit",children:"저장"})]})]})]})}),vt&&e.jsx(le,{onClick:()=>O(!1),children:e.jsxs(ce,{onClick:t=>t.stopPropagation(),children:[e.jsx(de,{children:"상담 추가"}),e.jsx(T,{children:"학생 선택"}),e.jsx(ue,{placeholder:"학생 검색…",value:F,onChange:t=>Ct(t.target.value)}),e.jsxs(Qn,{children:[Te&&e.jsx(fe,{children:"불러오는 중…"}),ne&&e.jsx(I,{children:ne}),!Te&&!ne&&(wt||[]).filter(t=>!F||t.name.toLowerCase().includes(F.toLowerCase())||(t.code||"").toLowerCase().includes(F.toLowerCase())).map(t=>e.jsxs(Xn,{type:"button","data-selected":k?.id===t.id,onClick:()=>_e(t),onKeyDown:n=>{(n.key==="Enter"||n.key===" ")&&(n.preventDefault(),_e(t))},children:[e.jsxs("div",{children:[e.jsx("strong",{children:t.name}),e.jsx(H,{style:{marginLeft:8},children:t.code})]}),e.jsx(H,{children:Jt(t.phoneNumber)})]},t.id))]}),e.jsx("div",{style:{marginTop:8},children:k?e.jsxs(Zn,{children:[e.jsx("span",{className:"label",children:"선택된 학생"}),e.jsx("span",{className:"name",children:k.name}),k.code&&e.jsx(H,{style:{marginLeft:6},children:k.code})]}):e.jsx(fe,{children:"학생을 선택해 주세요."})}),e.jsx(T,{style:{marginTop:10},children:"시간"}),e.jsxs(Qe,{children:[e.jsx("div",{style:{flex:1},children:e.jsx(M,{ariaLabel:"시",value:G,onChange:Ie,placeholder:"시",options:se.map(t=>({label:t,value:t}))})}),e.jsx("span",{children:":"}),e.jsx("div",{style:{flex:1},children:e.jsx(M,{ariaLabel:"분",value:V,onChange:He,placeholder:"분",options:oe.map(t=>({label:t,value:t}))})})]}),e.jsx(T,{style:{marginTop:10},children:"메모 (선택)"}),e.jsx(nt,{rows:3,value:Me,onChange:t=>Be(t.target.value),placeholder:"상담 메모"}),Re&&e.jsx(I,{children:Re}),e.jsxs(pe,{children:[e.jsx(ie,{type:"button",onClick:()=>O(!1),children:"취소"}),e.jsx(re,{type:"button",disabled:ze||!G||!V||!k,onClick:Dt,children:ze?"저장 중…":"저장"})]})]})}),S&&e.jsx(le,{onClick:()=>L(!1),children:e.jsxs(ce,{onClick:t=>t.stopPropagation(),children:[e.jsx(de,{children:"수업 추가"}),e.jsx(T,{children:"수업 템플릿 선택"}),e.jsx(ue,{placeholder:"검색어로 필터…",value:j,onChange:t=>lt(t.target.value)}),e.jsxs(at,{children:[xe&&e.jsx(fe,{children:"불러오는 중…"}),U&&e.jsx(I,{children:U}),!xe&&!U&&(z||[]).filter(t=>!j||t.title?.toLowerCase().includes(j.toLowerCase())||t.code?.toLowerCase().includes(j.toLowerCase())).map(t=>e.jsxs(Jn,{"data-selected":K?.id===t.id,onClick:()=>gt(t),children:[e.jsxs("div",{children:[e.jsx("strong",{children:t.title}),e.jsx(H,{style:{marginLeft:8},children:t.code})]}),e.jsx(H,{children:Ze(t.startTime,t.endTime)})]},t.id))]}),e.jsx(T,{style:{marginTop:10},children:"시간"}),e.jsxs(Qe,{children:[e.jsx(W,{children:e.jsx(M,{ariaLabel:"시",value:Ae,onChange:Pe,placeholder:"시",options:se.map(t=>({label:t,value:t}))})}),e.jsx("span",{children:":"}),e.jsx(W,{children:e.jsx(M,{ariaLabel:"분",value:Ye,onChange:Oe,placeholder:"분",options:oe.map(t=>({label:t,value:t}))})}),e.jsx("span",{children:"~"}),e.jsx(W,{children:e.jsx(M,{ariaLabel:"시",value:Fe,onChange:Ge,placeholder:"시",options:se.map(t=>({label:t,value:t}))})}),e.jsx("span",{children:":"}),e.jsx(W,{children:e.jsx(M,{ariaLabel:"분",value:Ve,onChange:We,placeholder:"분",options:oe.map(t=>({label:t,value:t}))})})]}),ve&&e.jsx(I,{children:ve}),e.jsxs(pe,{children:[e.jsx(ie,{type:"button",onClick:()=>L(!1),children:"취소"}),e.jsx(re,{type:"button",disabled:be,onClick:mt,children:be?"저장 중…":"저장"})]})]})}),(ye||Ce)&&e.jsx("div",{style:{color:"#b91c1c",marginTop:8},children:Ce||ye})]})]})]})}const le=o.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.28);
  display: grid;
  place-items: center;
  z-index: 1200;
`,ce=o.div`
  width: 480px;
  max-width: calc(100% - 32px);
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  box-shadow: 0 8px 28px rgba(2, 6, 23, 0.08);
  padding: 18px;
`,de=o.h3`
  margin: 0 0 10px;
  font-size: 17px;
  font-weight: 700;
  color: #111827;
`,Qe=o.div`
  display: flex;
  align-items: center;
  gap: 12px;
`,W=o.div`
  flex: 1;
  min-width: 0;
`,at=o.div` max-height: 220px; overflow: auto; border: 1px solid #f1f5f9; border-radius: 10px; margin-top: 6px; background: #fff; `,Jn=o.div`
  padding: 8px 10px; display:flex; align-items:center; justify-content:space-between; cursor:pointer;
  border-bottom: 1px solid #f1f5f9;
  &[data-selected='true']{ background:#eef2ff; }
  &:hover{ background:${({theme:s})=>s.colors.surfaceMuted}; }
`,Qn=o(at)``,Xn=o.button`
  width: 100%; text-align: left; background: transparent; border: 0; padding: 8px 10px; display:flex; align-items:center; justify-content:space-between; cursor:pointer;
  border-bottom: 1px solid #f1f5f9;
  &[data-selected='true']{ background:#eef2ff; }
  &:hover{ background:${({theme:s})=>s.colors.surfaceMuted}; }
`,I=o.div` color:#b91c1c; font-size:12px; margin-top:6px; `;function Xe(s){if(!s)return"--:--";try{const a=String(s).match(/(\d{2}):(\d{2})/);return a?`${a[1]}:${a[2]}`:"--:--"}catch{return"--:--"}}function Ze(s,r){return`${Xe(s)} ~ ${Xe(r)}`}function et(s){if(!s)return"";try{const a=String(s).match(/(\d{2}):(\d{2})/);return a?`${a[1]}:${a[2]}`:""}catch{return""}}function tt(s){if(!s)return;const[r,a]=s.split(":");return`${r?.padStart(2,"0")}:${a?.padStart(2,"0")}:00`}const T=o.label`
  display: block;
  margin: 8px 0 6px;
  font-size: 12px;
  color: #6b7280;
  span { color: #ef4444; margin-left: 4px; }
`,ue=o.input`
  width: 100%;
  height: 40px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 12px;
  &[aria-invalid='true'] {
    border-color: #ef4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.12);
  }
`;o.select`
  width: 100%;
  height: 40px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 8px;
  background: #fff;
`;const nt=o.textarea`
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 8px 12px;
  resize: vertical;
`,pe=o.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
`,H=o.span` color:#9ca3af; font-size:12px; `,fe=o.div` color:#6b7280; font-size:12px; `,Zn=o.div`
  display: inline-flex; align-items: center; gap: 8px; padding: 6px 10px; border:1px solid #c7d2fe; background:#eef2ff; color:#1f2937; border-radius: 8px; font-size: 13px;
  .label { color:#4f46e5; font-weight: 800; }
  .name { font-weight: 800; }
`;export{ms as default};
