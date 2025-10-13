import{j as e,d as o,r as i,p as ot,i as $t,u as Mt,a as Bt,b as zt,c as Ke}from"./index-B5k8kNhE.js";import{B as Nt}from"./BackButton-CJycML1k.js";import{C as Rt}from"./ClassList-BqCMnd3W.js";import{c as It,d as it,e as at,G as ie,f as ae}from"./UI-BZ18PvHk.js";import{E as Ht}from"./EmptyPlaceholder-DRoifR72.js";import{S as M}from"./SelectBox-Co92addf.js";import{p as At,s as Pt,f as A}from"./dateUtils-CoPTMMCx.js";import{u as Yt,l as Ot,c as Ft,a as Gt,d as Vt}from"./todos-Cn7qEtaP.js";import{l as Wt,c as _t}from"./courses-BmGwMg8m.js";import{l as rt,c as Ut}from"./counsels-Bex1Cej_.js";import{a as Kt,b as qt}from"./format-Do6vjlY3.js";import{g as qe}from"./calendar-BDiSd5hd.js";import{r as D}from"./errors-C6OcbAl5.js";import{l as Jt}from"./students-BCS5i-8E.js";import{u as Qt}from"./useConfirmDialog-CYG_Gyva.js";import"./ConfirmDialog-20rXmZ8b.js";function Xt({label:s,onBack:a,onPrev:r,onNext:f,onToday:p}){return e.jsxs(Zt,{children:[e.jsx(en,{children:e.jsx(on,{label:"돌아가기",onClick:a})}),e.jsxs(tn,{children:[e.jsx(Je,{onClick:r,"aria-label":"이전 날짜",children:"<"}),e.jsx(sn,{children:s}),e.jsx(Je,{onClick:f,"aria-label":"다음 날짜",children:">"})]}),e.jsx(nn,{children:e.jsx(an,{type:"button",onClick:p,children:"오늘"})})]})}const Zt=o.div`
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
`,en=o.div`
  display: flex;
  @media (max-width: 768px) {
    order: 2;
  }
`,tn=o.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`,nn=o.div`
  display: flex;
  justify-content: flex-end;
  @media (max-width: 768px) {
    justify-content: center;
    order: 3;
  }
`,sn=o.span`
  min-width: 150px;
  text-align: center;
  font-weight: 600;
  font-size: 25px;
  letter-spacing: -0.01em;
  color: #111827;
  padding: 6px 12px;
`,on=o(Nt)`
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
`,Je=o.button`
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
`;function rn({items:s,onAdd:a,onDetail:r}){return e.jsxs(ln,{children:[e.jsxs(cn,{children:[e.jsxs(dn,{children:[e.jsx(un,{"aria-hidden":!0,children:vn}),e.jsx("h4",{children:"상담 일정"})]}),e.jsx(pn,{children:a?e.jsx(fn,{type:"button",onClick:a,children:"+ 상담 추가"}):null})]}),e.jsx(hn,{children:s.map((f,p)=>e.jsxs(gn,{children:[e.jsxs(mn,{children:[e.jsx("div",{className:"left",children:e.jsx("strong",{children:f.with||"학생"})}),e.jsxs("div",{className:"right",children:[e.jsx(jn,{children:f.time}),r&&f.studentId?e.jsx(xn,{type:"button",onClick:()=>r(f.studentId,f.id),children:"상세"}):null]})]}),e.jsx(bn,{children:(f.title||"").trim()||"내용 없음"})]},`cs-${p}`))})]})}const ln=o.section`
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 12px;
  background: #fff;
  display: flex;
  flex-direction: column;
  height: 100%; /* fill half container */
  min-height: 0; /* allow Grid to scroll */
`,cn=o.div`
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;
  h4 { margin: 0; font-size: 15px; color: #111827; }
`,dn=o.div`
  display: flex; align-items: center; gap: 8px;
`,un=o.span`
  width: 28px; height: 28px; border-radius: 8px; display: grid; place-items: center; background: #f3f4f6; color: #4f46e5;
`,pn=o.div``,fn=o(it)``,xn=o.button`
  ${It.outline};
  height: 40px;
  padding: 0 16px;
  font-size: 14px;
  font-weight: 600;
`,hn=o.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  padding: 4px 2px;
  flex: 1 1 auto;
  min-height: 0;
  align-content: start; /* avoid vertical stretching when few items */
  align-items: start;
  grid-auto-rows: max-content;
`,gn=o.div`
  border: 1px solid #e5e7eb; border-radius: 12px; padding: 12px; background: #fff;
`,mn=o.div`
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;
  .right { display:inline-flex; align-items:center; gap:8px; }
`,bn=o.div` color:#374151; font-size:13px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; `,jn=o.span`
  color: #6b7280; font-size: 12px; font-weight: 700;
`,vn=e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"})});function wn({inProgress:s,done:a,onAdd:r,onToggle:f,onDelete:p,onEdit:c}){const[x,v]=i.useState(s);return i.useEffect(()=>{v(s)},[s]),i.useEffect(()=>{},[a]),e.jsxs(yn,{children:[e.jsxs(Cn,{children:[e.jsxs(Sn,{children:[e.jsx(kn,{"aria-hidden":!0,children:An}),e.jsx("h4",{children:"할 일"}),e.jsx(Dn,{children:s.length})]}),e.jsx(Tn,{children:e.jsx(it,{type:"button",onClick:r,children:"+ 할일 추가"})})]}),x.length===0?e.jsx(Ht,{title:"오늘 등록된 할 일이 없습니다."}):e.jsx(Ln,{children:x.map((u,b)=>e.jsxs(En,{children:[e.jsxs($n,{children:[e.jsx(In,{"aria-hidden":!0}),e.jsxs(Hn,{children:[e.jsx(Mn,{title:u.title,children:u.title}),u.content&&e.jsx(Bn,{title:u.content,children:u.content})]})]}),e.jsxs(Rn,{children:[typeof u.id=="number"&&e.jsx(zn,{type:"button","data-variant":"edit",onClick:()=>c?.(u.id),children:"수정"}),typeof u.id=="number"&&e.jsx(Nn,{type:"button",onClick:()=>void p?.(u.id),children:"삭제"})]})]},`p-${u.id??b}`))})]})}const yn=o.section`
  border: 1px solid #e5e7eb; border-radius: 16px; padding: 12px; background: #fff; display: flex; flex-direction: column;
`,Cn=o.div`
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;
  h4 { margin: 0; font-size: 15px; color: #111827; }
`,Sn=o.div`
  display: flex; align-items: center; gap: 8px;
`,kn=o.span`
  width: 28px; height: 28px; border-radius: 8px; display: grid; place-items: center; background: #eef2ff; color: #4f46e5;
`,Tn=o.div``,Dn=o.span`
  background: #e5e7eb; color: #374151; height: 20px; min-width: 22px; padding: 0 6px; border-radius: 9999px; display: inline-flex; align-items: center; justify-content: center; font-weight: 700; font-size: 12px;
`,Ln=o.div`
  display: grid;
  gap: 8px;
  padding: 4px 2px;
  /* 상세 페이지는 내부 스크롤 없이 전체 표시 */
`,En=o.div`
  display: grid; grid-template-columns: 1fr auto; align-items: flex-start; gap: 10px;
  border: 1px solid #e5e7eb; border-radius: 10px; padding: 10px 12px; background: #fff;
  transition: background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
  &:hover { background: #fafafa; border-color: #e2e8f0; box-shadow: 0 1px 2px rgba(0,0,0,0.04); }
`,$n=o.div`
  display: grid; grid-template-columns: 10px 1fr; gap: 10px; align-items: flex-start; min-width: 0;
`,Mn=o.div`
  font-weight: 800; margin-bottom: 2px; font-size: 14px; letter-spacing: -0.01em; color: #0f172a;
  display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;
`,Bn=o.div`
  color: #64748b;
  font-size: 12.5px;
  line-height: 1.5;
  white-space: pre-line;
  display: -webkit-box;
  -webkit-line-clamp: 5; /* 상세 페이지는 5줄 표시 */
  -webkit-box-orient: vertical;
  overflow: hidden;
`,zn=o(at)`
  height: 40px;
  padding: 0 16px;
  font-size: 14px;
`,Nn=o(at)`
  height: 40px;
  padding: 0 16px;
  font-size: 14px;
  border-color: #ef4444;
  color: #ef4444;
  &:hover {
    background: #fee2e2;
    border-color: #dc2626;
  }
`,Rn=o.div`
  display: flex; gap: 6px; align-items: center;
`,In=o.span`
  width: 10px; height: 10px; border-radius: 9999px; background: #4f46e5; margin-top: 5px;
`,Hn=o.div`
  display: flex; flex-direction: column; gap: 2px; min-width: 0;
`,An=e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"M20 6L9 17l-5-5"})});function Pn(s){const a=i.useMemo(()=>s?At(s):Pt(new Date),[s]),r=Kt(a,{includeWeekday:!0}),f=r==="—"?`${a.getFullYear()}년 ${a.getMonth()+1}월 ${a.getDate()}일`:r,{classesForDate:p}=Yt({dates:[[a]]}),c=i.useMemo(()=>p(a),[p,a]),[x,v]=i.useState([]);i.useEffect(()=>{let d=!1;async function B(){try{const w=A(a);try{const L=`/api/counsels?${new URLSearchParams({onYmd:w,size:String(50)}).toString()}`,z=ot(L);if(z.data&&!d){const _=(z.data.content||[]).map(j=>({id:j.id,studentId:j.studentId,time:Qe(j.counselTime),title:(j.content||"").split(/\r?\n/)[0]||"상담",with:j.studentName,owner:"-",done:j.status==="CONVERTED"}));v(_)}}catch{}const C=await rt({onYmd:w,size:50});if(d)return;const h=(C.content||[]).map(S=>({id:S.id,studentId:S.studentId,time:Qe(S.counselTime),title:(S.content||"").split(/\r?\n/)[0]||"상담",with:S.studentName,owner:"-",done:S.status==="CONVERTED"}));v(h)}catch{d||v([])}}return B(),()=>{d=!0}},[a]);function u(){const d=new Date(a);return d.setDate(d.getDate()-1),A(d)}function b(){const d=new Date(a);return d.setDate(d.getDate()+1),A(d)}function y(){return A(new Date)}return{date:a,label:f,classes:c,counsels:x,prevYMD:u,nextYMD:b,todayYMD:y}}function Qe(s){if(!s)return"--:--";try{return s.replace("T"," ").slice(11,16)}catch{return"--:--"}}function Yn(s){const[a,r]=i.useState(null),[f,p]=i.useState(!1),[c,x]=i.useState(!1),[v,u]=i.useState(null),b=i.useRef(null),y=i.useRef(s),d=i.useCallback(async w=>{b.current&&b.current.abort();const C=new AbortController;b.current=C,u(null),w&&y.current===s?(x(!0),p(!1)):(p(!0),x(!1));try{const h=await Ot(s,void 0,{signal:C.signal});if(y.current!==s)return;r(h)}catch(h){if(h?.name==="AbortError")return;u(D(h,"Failed to load todos"))}finally{y.current===s&&(p(!1),x(!1))}},[s]);i.useEffect(()=>{y.current=s;const w=`/api/todos?dueYmd=${s}`,C=ot(w),h=!!C.data;return h?(r(C.data),p(!1),x(!0)):(r(null),p(!0),x(!1)),d(h),()=>{b.current&&b.current.abort()}},[s,d]);const B=i.useCallback(()=>d(!!a&&y.current===s),[d,a,s]);return{data:a,loading:f,revalidating:c,error:v,refresh:B}}function re(s){$t(`/api/todos?dueYmd=${s}`)}function On({children:s}){return e.jsx(Wn,{children:s})}function Fn({children:s}){return e.jsx(_n,{children:s})}function Gn({children:s}){return e.jsx(Un,{children:s})}function Vn({children:s}){return e.jsx(Kn,{children:s})}const Wn=o.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  height: calc(100vh - 48px); /* account for main content padding */
  overflow: hidden; /* prevent page scroll; use internal scrolls */
`,_n=o.div`
  display: flex;
  gap: 12px;
  align-items: stretch;
  flex: 1 1 auto;
  min-height: 0; /* allow children to compute internal scroll */
  overflow: hidden;
  @media (max-width: 960px) { flex-direction: column; height: auto; overflow: visible; }
`,Un=o.div`
  flex: 1 1 0;
  display: grid;
  grid-template-rows: 1fr 1fr; /* 5:5 (1:1) vertical split */
  gap: 12px;
  height: 100%;
  min-height: 0; /* enable internal scrolls in children */
`,Kn=o.div`
  flex: 1 1 0;
  display: grid;
  gap: 12px;
  align-content: flex-start;
  height: 100%;
  min-height: 0;
  overflow: auto; /* right column can scroll if long */
`;function gs(){const s=Mt(),{ymd:a}=Bt(),{warning:r}=zt(),{confirm:f,dialog:p}=Qt({confirmLabel:"삭제",cancelLabel:"취소",tone:"danger"}),c=a??A(new Date),{label:x,classes:v,counsels:u,prevYMD:b,nextYMD:y,todayYMD:d}=Pn(c),[B,w]=i.useState([]),[C,h]=i.useState([]),[S,L]=i.useState(!1),[z,_]=i.useState([]),[j,ct]=i.useState(""),[xe,he]=i.useState(!1),[U,ge]=i.useState(null),[K,me]=i.useState(null),[be,je]=i.useState(!1),[ve,N]=i.useState(null);function q(...t){for(const n of t)if(typeof n=="number"&&Number.isFinite(n))return n;return 0}function dt(t){if(!t)return null;const n=String(t).trim();return n==="정기 수업"||n==="정기수업"?null:n||null}function we(t){return t.map(n=>{const l=n.startTime??n.start_at??n.startAt??n.start??null,g=n.endTime??n.end_at??n.endAt??n.end??null,m=q(n.attPresent,n.presentCount,n.attendancePresent,n?.attendance?.present),Dt=q(n.attAbsent,n.absentCount,n.attendanceAbsent,n?.attendance?.absent),Lt=q(n.attUnprocessed),Et=dt(n.notes||n.content||n.topic||null);return{subject:n.courseTitle||"수업",time:et(l,g),room:"-",teacher:"-",student:"-",done:!1,courseId:n.courseId||void 0,date:n.recordDate||n.date||c,recordId:n.recordId||n.id,notes:Et,attPresent:m,attAbsent:Dt,attUnprocessed:Lt}})}i.useMemo(()=>{},[]),i.useEffect(()=>{let t=!1;async function n(){try{const l=await qe(c);if(t)return;w(we(l))}catch{t||w(v)}}return n(),()=>{t=!0}},[c,v]),i.useEffect(()=>{h(u)},[u]);const{data:E,error:ye,refresh:J}=Yn(c),[Ce,Se]=i.useState(null),[ut,R]=i.useState(!1),[Q,ke]=i.useState(null),[P,X]=i.useState(""),[Z,ee]=i.useState("");async function pt(){ke(null),X(""),ee(""),R(!0)}function ft(t){const n=(E||[]).find(l=>l.id===t);n&&(ke(t),X(n.title),ee(n.notes||""),R(!0))}const[Y,te]=i.useState(null);async function xt(t){if(t.preventDefault(),!P.trim()){te("제목을 입력해 주세요.");return}const n=c;try{if(Q==null){const l=await Ft({title:P.trim(),notes:Z||void 0,calendarDate:n});re(c),await J()}else{const l=await Gt(Q,{title:P.trim(),notes:Z||void 0});re(c),await J()}R(!1),te(null)}catch(l){Se(D(l,"저장에 실패했습니다."))}}async function ht(t){const n=(E||[]).find(g=>g.id===t);if(await f({title:"할 일을 삭제할까요?",message:n?.title?`"${n.title}" 항목을 삭제합니다. 되돌릴 수 없습니다.`:"선택한 할 일을 삭제합니다. 되돌릴 수 없습니다."}))try{await Vt(t),re(c),await J()}catch(g){Se(D(g,"삭제에 실패했습니다."))}}async function gt(){if(L(!0),N(null),z.length===0){he(!0),ge(null);try{const t=await Wt({status:"IN_PROGRESS",size:200});_(t.content)}catch(t){ge(D(t,"수업 목록을 불러오지 못했습니다."))}finally{he(!1)}}}function mt(t){me(t);const n=tt(t.startTime)||"00:00",l=tt(t.endTime)||"00:00";try{const[g,m]=n.split(":");Ye(g),Fe(m)}catch{}try{const[g,m]=l.split(":");Ve(g),_e(m)}catch{}N(null)}async function bt(){if(!K){r("수업 템플릿을 선택해 주세요.");return}const t=nt(`${(Pe||"00").padStart(2,"0")}:${(Oe||"00").padStart(2,"0")}`),n=nt(`${(Ge||"00").padStart(2,"0")}:${(We||"00").padStart(2,"0")}`);je(!0),N(null);try{await _t(K.id,{recordDate:c,startTime:t,endTime:n}),Ke("/api/calendar/classes"),Ke("/api/calendar/classes-range");const l=await qe(c);w(we(l)),L(!1),me(null)}catch(l){D(l,"").includes("HTTP 409")?N("이미 등록된 수업이 있습니다."):N("수업 추가에 실패했습니다.")}finally{je(!1)}}const jt=i.useMemo(()=>(E||[]).filter(t=>t.status!=="DONE").map(t=>({id:t.id,title:t.title,content:t.notes,done:!1})),[E]),vt=i.useMemo(()=>(E||[]).filter(t=>t.status==="DONE").map(t=>({id:t.id,title:t.title,content:t.notes,done:!0})),[E]),[wt,O]=i.useState(!1),[Te,yt]=i.useState([]),[F,Ct]=i.useState(""),[De,Le]=i.useState(!1),[ne,Ee]=i.useState(null),[k,$e]=i.useState(null),[Zn,Me]=i.useState(""),[Be,ze]=i.useState(""),[Ne,Re]=i.useState(!1),[Ie,$]=i.useState(null),se=i.useMemo(()=>Array.from({length:24},(t,n)=>String(n).padStart(2,"0")),[]),oe=i.useMemo(()=>["00","05","10","15","20","25","30","35","40","45","50","55"],[]),[G,He]=i.useState(""),[V,Ae]=i.useState(""),[Pe,Ye]=i.useState(""),[Oe,Fe]=i.useState(""),[Ge,Ve]=i.useState(""),[We,_e]=i.useState("");async function St(){if(O(!0),$(null),He(""),Ae(""),Me(""),Te.length===0){Le(!0),Ee(null);try{const t=await Jt({status:"ENROLLED",size:200});yt(t.content)}catch(t){Ee(D(t,"학생 목록을 불러오지 못했습니다."))}finally{Le(!1)}}}function Ue(t){$e(t),$(null)}function kt(t,n){return!n||!/^\d{2}:\d{2}$/.test(n)?`${t}T00:00:00`:`${t}T${n}:00`}async function Tt(){if(!k){$("학생을 선택해 주세요.");return}const t=G&&V?`${G}:${V}`:"";if(!t){$("시간을 선택해 주세요.");return}const n=kt(c,t);Re(!0),$(null);try{await Ut({studentId:k.id,counselTime:n,content:Be||void 0});const g=((await rt({onYmd:c,size:50})).content||[]).map(m=>({id:m.id,studentId:m.studentId,time:m.counselTime.replace("T"," ").slice(11,16),title:(m.content||"").split(/\r?\n/)[0]||"상담",with:m.studentName,owner:"-",done:m.status==="CONVERTED"}));h(g),O(!1),$e(null),Me(""),ze("")}catch(l){$(D(l,"상담 추가에 실패했습니다."))}finally{Re(!1)}}return e.jsxs(On,{children:[p,e.jsx(Xt,{label:x,onBack:()=>s("/calendar"),onPrev:()=>s(`/calendar/${b()}`),onNext:()=>s(`/calendar/${y()}`),onToday:()=>s(`/calendar/${d()}`)}),e.jsxs(Fn,{children:[e.jsxs(Gn,{children:[e.jsx(wn,{inProgress:jt,done:vt,onAdd:pt,onDelete:ht,onEdit:ft}),e.jsx(rn,{items:C,onAdd:St,onDetail:t=>s(`/students/${t}/counsels`)})]}),e.jsxs(Vn,{children:[e.jsx(Rt,{items:B,titleMode:"subject",showNotes:!0,onAdd:gt}),ut&&e.jsx(le,{onClick:()=>R(!1),children:e.jsxs(ce,{onClick:t=>t.stopPropagation(),children:[e.jsx(de,{children:Q==null?"할 일 추가":"할 일 수정"}),e.jsxs("form",{onSubmit:xt,noValidate:!0,children:[e.jsxs(T,{children:["제목",e.jsx("span",{children:"*"})]}),e.jsx(ue,{value:P,onChange:t=>{X(t.target.value),Y&&te(null)},placeholder:"예: 상담 준비","aria-invalid":!!Y}),Y&&e.jsx(I,{children:Y}),e.jsx(T,{children:"메모 (선택)"}),e.jsx(st,{rows:4,value:Z,onChange:t=>ee(t.target.value),placeholder:"세부 내용 또는 참고사항"}),e.jsxs(pe,{children:[e.jsx(ie,{type:"button",onClick:()=>R(!1),children:"취소"}),e.jsx(ae,{type:"submit",children:"저장"})]})]})]})}),wt&&e.jsx(le,{onClick:()=>O(!1),children:e.jsxs(ce,{onClick:t=>t.stopPropagation(),children:[e.jsx(de,{children:"상담 추가"}),e.jsx(T,{children:"학생 선택"}),e.jsx(ue,{placeholder:"학생 검색…",value:F,onChange:t=>Ct(t.target.value)}),e.jsxs(Jn,{children:[De&&e.jsx(fe,{children:"불러오는 중…"}),ne&&e.jsx(I,{children:ne}),!De&&!ne&&(Te||[]).filter(t=>!F||t.name.toLowerCase().includes(F.toLowerCase())||(t.code||"").toLowerCase().includes(F.toLowerCase())).map(t=>e.jsxs(Qn,{type:"button","data-selected":k?.id===t.id,onClick:()=>Ue(t),onKeyDown:n=>{(n.key==="Enter"||n.key===" ")&&(n.preventDefault(),Ue(t))},children:[e.jsxs("div",{children:[e.jsx("strong",{children:t.name}),e.jsx(H,{style:{marginLeft:8},children:t.code})]}),e.jsx(H,{children:qt(t.phoneNumber)})]},t.id))]}),e.jsx("div",{style:{marginTop:8},children:k?e.jsxs(Xn,{children:[e.jsx("span",{className:"label",children:"선택된 학생"}),e.jsx("span",{className:"name",children:k.name}),k.code&&e.jsx(H,{style:{marginLeft:6},children:k.code})]}):e.jsx(fe,{children:"학생을 선택해 주세요."})}),e.jsx(T,{style:{marginTop:10},children:"시간"}),e.jsxs(Xe,{children:[e.jsx("div",{style:{flex:1},children:e.jsx(M,{ariaLabel:"시",value:G,onChange:He,placeholder:"시",options:se.map(t=>({label:t,value:t}))})}),e.jsx("span",{children:":"}),e.jsx("div",{style:{flex:1},children:e.jsx(M,{ariaLabel:"분",value:V,onChange:Ae,placeholder:"분",options:oe.map(t=>({label:t,value:t}))})})]}),e.jsx(T,{style:{marginTop:10},children:"메모 (선택)"}),e.jsx(st,{rows:3,value:Be,onChange:t=>ze(t.target.value),placeholder:"상담 메모"}),Ie&&e.jsx(I,{children:Ie}),e.jsxs(pe,{children:[e.jsx(ie,{type:"button",onClick:()=>O(!1),children:"취소"}),e.jsx(ae,{type:"button",disabled:Ne||!G||!V||!k,onClick:Tt,children:Ne?"저장 중…":"저장"})]})]})}),S&&e.jsx(le,{onClick:()=>L(!1),children:e.jsxs(ce,{onClick:t=>t.stopPropagation(),children:[e.jsx(de,{children:"수업 추가"}),e.jsx(T,{children:"수업 템플릿 선택"}),e.jsx(ue,{placeholder:"검색어로 필터…",value:j,onChange:t=>ct(t.target.value)}),e.jsxs(lt,{children:[xe&&e.jsx(fe,{children:"불러오는 중…"}),U&&e.jsx(I,{children:U}),!xe&&!U&&(z||[]).filter(t=>!j||t.title?.toLowerCase().includes(j.toLowerCase())||t.code?.toLowerCase().includes(j.toLowerCase())).map(t=>e.jsxs(qn,{"data-selected":K?.id===t.id,onClick:()=>mt(t),children:[e.jsxs("div",{children:[e.jsx("strong",{children:t.title}),e.jsx(H,{style:{marginLeft:8},children:t.code})]}),e.jsx(H,{children:et(t.startTime,t.endTime)})]},t.id))]}),e.jsx(T,{style:{marginTop:10},children:"시간"}),e.jsxs(Xe,{children:[e.jsx(W,{children:e.jsx(M,{ariaLabel:"시",value:Pe,onChange:Ye,placeholder:"시",options:se.map(t=>({label:t,value:t}))})}),e.jsx("span",{children:":"}),e.jsx(W,{children:e.jsx(M,{ariaLabel:"분",value:Oe,onChange:Fe,placeholder:"분",options:oe.map(t=>({label:t,value:t}))})}),e.jsx("span",{children:"~"}),e.jsx(W,{children:e.jsx(M,{ariaLabel:"시",value:Ge,onChange:Ve,placeholder:"시",options:se.map(t=>({label:t,value:t}))})}),e.jsx("span",{children:":"}),e.jsx(W,{children:e.jsx(M,{ariaLabel:"분",value:We,onChange:_e,placeholder:"분",options:oe.map(t=>({label:t,value:t}))})})]}),ve&&e.jsx(I,{children:ve}),e.jsxs(pe,{children:[e.jsx(ie,{type:"button",onClick:()=>L(!1),children:"취소"}),e.jsx(ae,{type:"button",disabled:be,onClick:bt,children:be?"저장 중…":"저장"})]})]})}),(ye||Ce)&&e.jsx("div",{style:{color:"#b91c1c",marginTop:8},children:Ce||ye})]})]})]})}const le=o.div`
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
`,Xe=o.div`
  display: flex;
  align-items: center;
  gap: 12px;
`,W=o.div`
  flex: 1;
  min-width: 0;
`,lt=o.div` max-height: 220px; overflow: auto; border: 1px solid #f1f5f9; border-radius: 10px; margin-top: 6px; background: #fff; `,qn=o.div`
  padding: 8px 10px; display:flex; align-items:center; justify-content:space-between; cursor:pointer;
  border-bottom: 1px solid #f1f5f9;
  &[data-selected='true']{ background:#eef2ff; }
  &:hover{ background:${({theme:s})=>s.colors.surfaceMuted}; }
`,Jn=o(lt)``,Qn=o.button`
  width: 100%; text-align: left; background: transparent; border: 0; padding: 8px 10px; display:flex; align-items:center; justify-content:space-between; cursor:pointer;
  border-bottom: 1px solid #f1f5f9;
  &[data-selected='true']{ background:#eef2ff; }
  &:hover{ background:${({theme:s})=>s.colors.surfaceMuted}; }
`,I=o.div` color:#b91c1c; font-size:12px; margin-top:6px; `;function Ze(s){if(!s)return"--:--";try{const r=String(s).match(/(\d{2}):(\d{2})/);return r?`${r[1]}:${r[2]}`:"--:--"}catch{return"--:--"}}function et(s,a){return`${Ze(s)} ~ ${Ze(a)}`}function tt(s){if(!s)return"";try{const r=String(s).match(/(\d{2}):(\d{2})/);return r?`${r[1]}:${r[2]}`:""}catch{return""}}function nt(s){if(!s)return;const[a,r]=s.split(":");return`${a?.padStart(2,"0")}:${r?.padStart(2,"0")}:00`}const T=o.label`
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
`;const st=o.textarea`
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
`,H=o.span` color:#9ca3af; font-size:12px; `,fe=o.div` color:#6b7280; font-size:12px; `,Xn=o.div`
  display: inline-flex; align-items: center; gap: 8px; padding: 6px 10px; border:1px solid #c7d2fe; background:#eef2ff; color:#1f2937; border-radius: 8px; font-size: 13px;
  .label { color:#4f46e5; font-weight: 800; }
  .name { font-weight: 800; }
`;export{gs as default};
