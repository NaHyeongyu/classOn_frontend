import{j as e,d as i,c as $t,e as ot,r as o,g as it,p as rt,i as Mt,u as Bt,h as zt,k as It,G as re,m as ae,n as Ke}from"./index-_dJHzZeb.js";import{B as Rt}from"./BackButton-BTVQ3ZEP.js";import{C as Nt}from"./ClassList-CcKguM51.js";import{E as Ht}from"./EmptyPlaceholder-CB-qW_Ik.js";import{S as qe}from"./SelectBox-D_6osxL0.js";import{p as At,s as Pt,f as P}from"./dateUtils-CoPTMMCx.js";import{u as Yt,l as Ot,c as Ft,a as Vt,d as Gt}from"./todos-BhqsQNS3.js";import{l as Wt,c as _t}from"./courses-Dn2IKeDS.js";import{l as at,c as Ut}from"./counsels-D_TRtLOc.js";import{a as Kt,b as qt}from"./format-Do6vjlY3.js";import{g as N}from"./calendar-CHBtw2LB.js";import{r as D}from"./errors-C6OcbAl5.js";import{l as Jt}from"./students-CxCnADOJ.js";import{u as Qt}from"./useConfirmDialog-BiiGx_ax.js";import"./ConfirmDialog-B8Hr7OO8.js";function Xt({label:s,onBack:r,onPrev:l,onNext:f,onToday:p}){return e.jsxs(Zt,{children:[e.jsx(en,{children:e.jsx(on,{label:"돌아가기",onClick:r})}),e.jsxs(tn,{children:[e.jsx(Je,{onClick:l,"aria-label":"이전 날짜",children:"<"}),e.jsx(sn,{children:s}),e.jsx(Je,{onClick:f,"aria-label":"다음 날짜",children:">"})]}),e.jsx(nn,{children:e.jsx(rn,{type:"button",onClick:p,children:"오늘"})})]})}const Zt=i.div`
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
`,en=i.div`
  display: flex;
  @media (max-width: 768px) {
    order: 2;
  }
`,tn=i.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`,nn=i.div`
  display: flex;
  justify-content: flex-end;
  @media (max-width: 768px) {
    justify-content: center;
    order: 3;
  }
`,sn=i.span`
  min-width: 150px;
  text-align: center;
  font-weight: 600;
  font-size: 25px;
  letter-spacing: -0.01em;
  color: #111827;
  padding: 6px 12px;
`,on=i(Rt)`
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
`,Je=i.button`
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
`,rn=i.button`
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
`;function an({items:s,onAdd:r,onDetail:l}){return e.jsxs(ln,{children:[e.jsxs(cn,{children:[e.jsxs(dn,{children:[e.jsx(un,{"aria-hidden":!0,children:jn}),e.jsx("h4",{children:"상담 일정"})]}),e.jsx(pn,{children:r?e.jsx(fn,{type:"button",onClick:r,children:"+ 상담 추가"}):null})]}),e.jsx(hn,{children:s.map((f,p)=>e.jsxs(gn,{children:[e.jsxs(mn,{children:[e.jsx("div",{className:"left",children:e.jsx("strong",{children:f.with||"학생"})}),e.jsxs("div",{className:"right",children:[e.jsx(vn,{children:f.time}),l&&f.studentId?e.jsx(xn,{type:"button",onClick:()=>l(f.studentId,f.id),children:"상세"}):null]})]}),e.jsx(bn,{children:(f.title||"").trim()||"내용 없음"})]},`cs-${p}`))})]})}const ln=i.section`
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 12px;
  background: #fff;
  display: flex;
  flex-direction: column;
  height: 100%; /* fill half container */
  min-height: 0; /* allow Grid to scroll */
`,cn=i.div`
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;
  h4 { margin: 0; font-size: 15px; color: #111827; }
`,dn=i.div`
  display: flex; align-items: center; gap: 8px;
`,un=i.span`
  width: 28px; height: 28px; border-radius: 8px; display: grid; place-items: center; background: #f3f4f6; color: #4f46e5;
`,pn=i.div``,fn=i(ot)``,xn=i.button`
  ${$t.outline};
  height: 40px;
  padding: 0 16px;
  font-size: 14px;
  font-weight: 600;
`,hn=i.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  padding: 4px 2px;
  overflow: auto; /* scroll within fixed half */
  flex: 1 1 auto;
  min-height: 0;
  align-content: start; /* avoid vertical stretching when few items */
  align-items: start;
  grid-auto-rows: max-content;
`,gn=i.div`
  border: 1px solid #e5e7eb; border-radius: 12px; padding: 12px; background: #fff;
`,mn=i.div`
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;
  .right { display:inline-flex; align-items:center; gap:8px; }
`,bn=i.div` color:#374151; font-size:13px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; `,vn=i.span`
  color: #6b7280; font-size: 12px; font-weight: 700;
`,jn=e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"})});function wn({inProgress:s,done:r,onAdd:l,onToggle:f,onDelete:p,onEdit:a}){const[m,w]=o.useState(s);return o.useEffect(()=>{w(s)},[s]),o.useEffect(()=>{},[r]),e.jsxs(yn,{children:[e.jsxs(Cn,{children:[e.jsxs(Sn,{children:[e.jsx(kn,{"aria-hidden":!0,children:An}),e.jsx("h4",{children:"할 일"}),e.jsx(Dn,{children:s.length})]}),e.jsx(Tn,{children:e.jsx(ot,{type:"button",onClick:l,children:"+ 할일 추가"})})]}),m.length===0?e.jsx(Ht,{title:"오늘 등록된 할 일이 없습니다."}):e.jsx(En,{children:m.map((u,v)=>e.jsxs(Ln,{children:[e.jsxs($n,{children:[e.jsx(Nn,{"aria-hidden":!0}),e.jsxs(Hn,{children:[e.jsx(Mn,{title:u.title,children:u.title}),u.content&&e.jsx(Bn,{title:u.content,children:u.content})]})]}),e.jsxs(Rn,{children:[typeof u.id=="number"&&e.jsx(zn,{type:"button","data-variant":"edit",onClick:()=>a?.(u.id),children:"수정"}),typeof u.id=="number"&&e.jsx(In,{type:"button",onClick:()=>void p?.(u.id),children:"삭제"})]})]},`p-${u.id??v}`))})]})}const yn=i.section`
  border: 1px solid #e5e7eb; border-radius: 16px; padding: 12px; background: #fff; display: flex; flex-direction: column;
`,Cn=i.div`
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;
  h4 { margin: 0; font-size: 15px; color: #111827; }
`,Sn=i.div`
  display: flex; align-items: center; gap: 8px;
`,kn=i.span`
  width: 28px; height: 28px; border-radius: 8px; display: grid; place-items: center; background: #eef2ff; color: #4f46e5;
`,Tn=i.div``,Dn=i.span`
  background: #e5e7eb; color: #374151; height: 20px; min-width: 22px; padding: 0 6px; border-radius: 9999px; display: inline-flex; align-items: center; justify-content: center; font-weight: 700; font-size: 12px;
`,En=i.div`
  display: grid;
  gap: 8px;
  padding: 4px 2px;
  /* 상세 페이지는 내부 스크롤 없이 전체 표시 */
`,Ln=i.div`
  display: grid; grid-template-columns: 1fr auto; align-items: flex-start; gap: 10px;
  border: 1px solid #e5e7eb; border-radius: 10px; padding: 10px 12px; background: #fff;
  transition: background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
  &:hover { background: #fafafa; border-color: #e2e8f0; box-shadow: 0 1px 2px rgba(0,0,0,0.04); }
`,$n=i.div`
  display: grid; grid-template-columns: 10px 1fr; gap: 10px; align-items: flex-start; min-width: 0;
`,Mn=i.div`
  font-weight: 800; margin-bottom: 2px; font-size: 14px; letter-spacing: -0.01em; color: #0f172a;
  display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;
`,Bn=i.div`
  color: #64748b;
  font-size: 12.5px;
  line-height: 1.5;
  white-space: pre-line;
  display: -webkit-box;
  -webkit-line-clamp: 5; /* 상세 페이지는 5줄 표시 */
  -webkit-box-orient: vertical;
  overflow: hidden;
`,zn=i(it)`
  height: 40px;
  padding: 0 16px;
  font-size: 14px;
`,In=i(it)`
  height: 40px;
  padding: 0 16px;
  font-size: 14px;
  border-color: #ef4444;
  color: #ef4444;
  &:hover {
    background: #fee2e2;
    border-color: #dc2626;
  }
`,Rn=i.div`
  display: flex; gap: 6px; align-items: center;
`,Nn=i.span`
  width: 10px; height: 10px; border-radius: 9999px; background: #4f46e5; margin-top: 5px;
`,Hn=i.div`
  display: flex; flex-direction: column; gap: 2px; min-width: 0;
`,An=e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"M20 6L9 17l-5-5"})});function Pn(s){const r=o.useMemo(()=>s?At(s):Pt(new Date),[s]),l=Kt(r,{includeWeekday:!0}),f=l==="—"?`${r.getFullYear()}년 ${r.getMonth()+1}월 ${r.getDate()}일`:l,{classesForDate:p}=Yt({dates:[[r]]}),a=o.useMemo(()=>p(r),[p,r]),[m,w]=o.useState([]);o.useEffect(()=>{let d=!1;async function M(){try{const g=P(r);try{const E=`/api/counsels?${new URLSearchParams({onYmd:g,size:String(50)}).toString()}`,B=rt(E);if(B.data&&!d){const U=(B.data.content||[]).map(j=>({id:j.id,studentId:j.studentId,time:Qe(j.counselTime),title:(j.content||"").split(/\r?\n/)[0]||"상담",with:j.studentName,owner:"-",done:j.status==="CONVERTED"}));w(U)}}catch{}const C=await at({onYmd:g,size:50});if(d)return;const b=(C.content||[]).map(S=>({id:S.id,studentId:S.studentId,time:Qe(S.counselTime),title:(S.content||"").split(/\r?\n/)[0]||"상담",with:S.studentName,owner:"-",done:S.status==="CONVERTED"}));w(b)}catch{d||w([])}}return M(),()=>{d=!0}},[r]);function u(){const d=new Date(r);return d.setDate(d.getDate()-1),P(d)}function v(){const d=new Date(r);return d.setDate(d.getDate()+1),P(d)}function y(){return P(new Date)}return{date:r,label:f,classes:a,counsels:m,prevYMD:u,nextYMD:v,todayYMD:y}}function Qe(s){if(!s)return"--:--";try{return s.replace("T"," ").slice(11,16)}catch{return"--:--"}}function Yn(s){const[r,l]=o.useState(null),[f,p]=o.useState(!1),[a,m]=o.useState(!1),[w,u]=o.useState(null),v=o.useRef(null),y=o.useRef(s),d=o.useCallback(async g=>{v.current&&v.current.abort();const C=new AbortController;v.current=C,u(null),g&&y.current===s?(m(!0),p(!1)):(p(!0),m(!1));try{const b=await Ot(s,void 0,{signal:C.signal});if(y.current!==s)return;l(b)}catch(b){if(b?.name==="AbortError")return;u(D(b,"Failed to load todos"))}finally{y.current===s&&(p(!1),m(!1))}},[s]);o.useEffect(()=>{y.current=s;const g=`/api/todos?dueYmd=${s}`,C=rt(g),b=!!C.data;return b?(l(C.data),p(!1),m(!0)):(l(null),p(!0),m(!1)),d(b),()=>{v.current&&v.current.abort()}},[s,d]);const M=o.useCallback(()=>d(!!r&&y.current===s),[d,r,s]);return{data:r,loading:f,revalidating:a,error:w,refresh:M}}function le(s){Mt(`/api/todos?dueYmd=${s}`)}function On({children:s}){return e.jsx(Wn,{children:s})}function Fn({children:s}){return e.jsx(_n,{children:s})}function Vn({children:s}){return e.jsx(Un,{children:s})}function Gn({children:s}){return e.jsx(Kn,{children:s})}const Wn=i.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  height: calc(100vh - 48px); /* account for main content padding */
  overflow: hidden; /* prevent page scroll; use internal scrolls */
`,_n=i.div`
  display: flex;
  gap: 12px;
  align-items: stretch;
  flex: 1 1 auto;
  min-height: 0; /* allow children to compute internal scroll */
  overflow: hidden;
  @media (max-width: 960px) { flex-direction: column; height: auto; overflow: visible; }
`,Un=i.div`
  flex: 1 1 0;
  display: grid;
  grid-template-rows: 1fr 1fr; /* 5:5 (1:1) vertical split */
  gap: 12px;
  height: 100%;
  min-height: 0; /* enable internal scrolls in children */
`,Kn=i.div`
  flex: 1 1 0;
  display: grid;
  gap: 12px;
  align-content: flex-start;
  height: 100%;
  min-height: 0;
  overflow: auto; /* right column can scroll if long */
`;function hs(){const s=Bt(),{ymd:r}=zt(),{warning:l}=It(),{confirm:f,dialog:p}=Qt({confirmLabel:"삭제",cancelLabel:"취소",tone:"danger"}),a=r??P(new Date),{label:m,classes:w,counsels:u,prevYMD:v,nextYMD:y,todayYMD:d}=Pn(a),[M,g]=o.useState([]),[C,b]=o.useState([]),[S,E]=o.useState(!1),[B,U]=o.useState([]),[j,ct]=o.useState(""),[he,ge]=o.useState(!1),[K,me]=o.useState(null),[q,be]=o.useState(null),[ve,je]=o.useState(!1),[we,z]=o.useState(null);function J(...t){for(const n of t)if(typeof n=="number"&&Number.isFinite(n))return n;return 0}function dt(t){if(!t)return null;const n=String(t).trim();return n==="정기 수업"||n==="정기수업"?null:n||null}function I(t){return t.map(n=>{const c=n.startTime??n.start_at??n.startAt??n.start??null,x=n.endTime??n.end_at??n.endAt??n.end??null,h=J(n.attPresent,n.presentCount,n.attendancePresent,n?.attendance?.present),Dt=J(n.attAbsent,n.absentCount,n.attendanceAbsent,n?.attendance?.absent),Et=J(n.attUnprocessed),Lt=dt(n.notes||n.content||n.topic||null);return{subject:n.courseTitle||"수업",time:et(c,x),room:"-",teacher:"-",student:"-",done:!1,courseId:n.courseId||void 0,date:n.recordDate||n.date||a,recordId:n.recordId||n.id,notes:Lt,attPresent:h,attAbsent:Dt,attUnprocessed:Et}})}o.useMemo(()=>{},[]),o.useEffect(()=>{let t=!1;async function n(){try{const c=await N(a);if(t)return;g(I(c))}catch{t||g(w)}}return n(),()=>{t=!0}},[a,w]),o.useEffect(()=>{let t=!1;const n=setInterval(async()=>{try{const c=await N(a);if(t)return;g(I(c))}catch{}},15e3);return()=>{t=!0,clearInterval(n)}},[a]),o.useEffect(()=>{b(u)},[u]),o.useEffect(()=>{function t(){document.visibilityState==="visible"&&N(a).then(n=>g(I(n))).catch(()=>{})}return document.addEventListener("visibilitychange",t),()=>document.removeEventListener("visibilitychange",t)},[a]),o.useEffect(()=>{function t(n){const x=n.detail?.ymd;(!x||x===a)&&N(a).then(h=>g(I(h))).catch(()=>{})}return window.addEventListener("calendar:classes-refresh",t),()=>{window.removeEventListener("calendar:classes-refresh",t)}},[a]);const{data:L,error:ye,refresh:Q}=Yn(a),[Ce,Se]=o.useState(null),[ut,R]=o.useState(!1),[X,ke]=o.useState(null),[Y,Z]=o.useState(""),[ee,te]=o.useState("");async function pt(){ke(null),Z(""),te(""),R(!0)}function ft(t){const n=(L||[]).find(c=>c.id===t);n&&(ke(t),Z(n.title),te(n.notes||""),R(!0))}const[O,ne]=o.useState(null);async function xt(t){if(t.preventDefault(),!Y.trim()){ne("제목을 입력해 주세요.");return}const n=a;try{if(X==null){const c=await Ft({title:Y.trim(),notes:ee||void 0,calendarDate:n});le(a),await Q()}else{const c=await Vt(X,{title:Y.trim(),notes:ee||void 0});le(a),await Q()}R(!1),ne(null)}catch(c){Se(D(c,"저장에 실패했습니다."))}}async function ht(t){const n=(L||[]).find(x=>x.id===t);if(await f({title:"할 일을 삭제할까요?",message:n?.title?`"${n.title}" 항목을 삭제합니다. 되돌릴 수 없습니다.`:"선택한 할 일을 삭제합니다. 되돌릴 수 없습니다."}))try{await Gt(t),le(a),await Q()}catch(x){Se(D(x,"삭제에 실패했습니다."))}}async function gt(){if(E(!0),z(null),B.length===0){ge(!0),me(null);try{const t=await Wt({status:"IN_PROGRESS",size:200});U(t.content)}catch(t){me(D(t,"수업 목록을 불러오지 못했습니다."))}finally{ge(!1)}}}function mt(t){be(t);const n=tt(t.startTime)||"00:00",c=tt(t.endTime)||"00:00";try{const[x,h]=n.split(":");Ye(x),Fe(h)}catch{}try{const[x,h]=c.split(":");Ge(x),_e(h)}catch{}z(null)}async function bt(){if(!q){l("수업 템플릿을 선택해 주세요.");return}const t=nt(`${(Pe||"00").padStart(2,"0")}:${(Oe||"00").padStart(2,"0")}`),n=nt(`${(Ve||"00").padStart(2,"0")}:${(We||"00").padStart(2,"0")}`);je(!0),z(null);try{await _t(q.id,{recordDate:a,startTime:t,endTime:n}),Ke("/api/calendar/classes"),Ke("/api/calendar/classes-range");const c=await N(a);g(I(c)),E(!1),be(null)}catch(c){D(c,"").includes("HTTP 409")?z("이미 등록된 수업이 있습니다."):z("수업 추가에 실패했습니다.")}finally{je(!1)}}const vt=o.useMemo(()=>(L||[]).filter(t=>t.status!=="DONE").map(t=>({id:t.id,title:t.title,content:t.notes,done:!1})),[L]),jt=o.useMemo(()=>(L||[]).filter(t=>t.status==="DONE").map(t=>({id:t.id,title:t.title,content:t.notes,done:!0})),[L]),[wt,F]=o.useState(!1),[Te,yt]=o.useState([]),[V,Ct]=o.useState(""),[De,Ee]=o.useState(!1),[se,Le]=o.useState(null),[k,$e]=o.useState(null),[Zn,Me]=o.useState(""),[Be,ze]=o.useState(""),[Ie,Re]=o.useState(!1),[Ne,$]=o.useState(null),oe=o.useMemo(()=>Array.from({length:24},(t,n)=>String(n).padStart(2,"0")),[]),ie=o.useMemo(()=>["00","05","10","15","20","25","30","35","40","45","50","55"],[]),[G,He]=o.useState(""),[W,Ae]=o.useState(""),[Pe,Ye]=o.useState(""),[Oe,Fe]=o.useState(""),[Ve,Ge]=o.useState(""),[We,_e]=o.useState("");async function St(){if(F(!0),$(null),He(""),Ae(""),Me(""),Te.length===0){Ee(!0),Le(null);try{const t=await Jt({status:"ENROLLED",size:200});yt(t.content)}catch(t){Le(D(t,"학생 목록을 불러오지 못했습니다."))}finally{Ee(!1)}}}function Ue(t){$e(t),$(null)}function kt(t,n){return!n||!/^\d{2}:\d{2}$/.test(n)?`${t}T00:00:00`:`${t}T${n}:00`}async function Tt(){if(!k){$("학생을 선택해 주세요.");return}const t=G&&W?`${G}:${W}`:"";if(!t){$("시간을 선택해 주세요.");return}const n=kt(a,t);Re(!0),$(null);try{await Ut({studentId:k.id,counselTime:n,content:Be||void 0});const x=((await at({onYmd:a,size:50})).content||[]).map(h=>({id:h.id,studentId:h.studentId,time:h.counselTime.replace("T"," ").slice(11,16),title:(h.content||"").split(/\r?\n/)[0]||"상담",with:h.studentName,owner:"-",done:h.status==="CONVERTED"}));b(x),F(!1),$e(null),Me(""),ze("")}catch(c){$(D(c,"상담 추가에 실패했습니다."))}finally{Re(!1)}}return e.jsxs(On,{children:[p,e.jsx(Xt,{label:m,onBack:()=>s("/calendar"),onPrev:()=>s(`/calendar/${v()}`),onNext:()=>s(`/calendar/${y()}`),onToday:()=>s(`/calendar/${d()}`)}),e.jsxs(Fn,{children:[e.jsxs(Vn,{children:[e.jsx(wn,{inProgress:vt,done:jt,onAdd:pt,onDelete:ht,onEdit:ft}),e.jsx(an,{items:C,onAdd:St,onDetail:t=>s(`/students/${t}/counsels`)})]}),e.jsxs(Gn,{children:[e.jsx(Nt,{items:M,titleMode:"subject",showNotes:!0,onAdd:gt}),ut&&e.jsx(ce,{onClick:()=>R(!1),children:e.jsxs(de,{onClick:t=>t.stopPropagation(),children:[e.jsx(ue,{children:X==null?"할 일 추가":"할 일 수정"}),e.jsxs("form",{onSubmit:xt,noValidate:!0,children:[e.jsxs(T,{children:["제목",e.jsx("span",{children:"*"})]}),e.jsx(pe,{value:Y,onChange:t=>{Z(t.target.value),O&&ne(null)},placeholder:"예: 상담 준비","aria-invalid":!!O}),O&&e.jsx(H,{children:O}),e.jsx(T,{children:"메모 (선택)"}),e.jsx(st,{rows:4,value:ee,onChange:t=>te(t.target.value),placeholder:"세부 내용 또는 참고사항"}),e.jsxs(fe,{children:[e.jsx(re,{type:"button",onClick:()=>R(!1),children:"취소"}),e.jsx(ae,{type:"submit",children:"저장"})]})]})]})}),wt&&e.jsx(ce,{onClick:()=>F(!1),children:e.jsxs(de,{onClick:t=>t.stopPropagation(),children:[e.jsx(ue,{children:"상담 추가"}),e.jsx(T,{children:"학생 선택"}),e.jsx(pe,{placeholder:"학생 검색…",value:V,onChange:t=>Ct(t.target.value)}),e.jsxs(Jn,{children:[De&&e.jsx(xe,{children:"불러오는 중…"}),se&&e.jsx(H,{children:se}),!De&&!se&&(Te||[]).filter(t=>!V||t.name.toLowerCase().includes(V.toLowerCase())||(t.code||"").toLowerCase().includes(V.toLowerCase())).map(t=>e.jsxs(Qn,{type:"button","data-selected":k?.id===t.id,onClick:()=>Ue(t),onKeyDown:n=>{(n.key==="Enter"||n.key===" ")&&(n.preventDefault(),Ue(t))},children:[e.jsxs("div",{children:[e.jsx("strong",{children:t.name}),e.jsx(A,{style:{marginLeft:8},children:t.code})]}),e.jsx(A,{children:qt(t.phoneNumber)})]},t.id))]}),e.jsx("div",{style:{marginTop:8},children:k?e.jsxs(Xn,{children:[e.jsx("span",{className:"label",children:"선택된 학생"}),e.jsx("span",{className:"name",children:k.name}),k.code&&e.jsx(A,{style:{marginLeft:6},children:k.code})]}):e.jsx(xe,{children:"학생을 선택해 주세요."})}),e.jsx(T,{style:{marginTop:10},children:"시간"}),e.jsxs(Xe,{children:[e.jsx("div",{style:{flex:1},children:e.jsx(qe,{ariaLabel:"시",value:G,onChange:He,placeholder:"시",options:oe.map(t=>({label:t,value:t}))})}),e.jsx("span",{children:":"}),e.jsx("div",{style:{flex:1},children:e.jsx(qe,{ariaLabel:"분",value:W,onChange:Ae,placeholder:"분",options:ie.map(t=>({label:t,value:t}))})})]}),e.jsx(T,{style:{marginTop:10},children:"메모 (선택)"}),e.jsx(st,{rows:3,value:Be,onChange:t=>ze(t.target.value),placeholder:"상담 메모"}),Ne&&e.jsx(H,{children:Ne}),e.jsxs(fe,{children:[e.jsx(re,{type:"button",onClick:()=>F(!1),children:"취소"}),e.jsx(ae,{type:"button",disabled:Ie||!G||!W||!k,onClick:Tt,children:Ie?"저장 중…":"저장"})]})]})}),S&&e.jsx(ce,{onClick:()=>E(!1),children:e.jsxs(de,{onClick:t=>t.stopPropagation(),children:[e.jsx(ue,{children:"수업 추가"}),e.jsx(T,{children:"수업 템플릿 선택"}),e.jsx(pe,{placeholder:"검색어로 필터…",value:j,onChange:t=>ct(t.target.value)}),e.jsxs(lt,{children:[he&&e.jsx(xe,{children:"불러오는 중…"}),K&&e.jsx(H,{children:K}),!he&&!K&&(B||[]).filter(t=>!j||t.title?.toLowerCase().includes(j.toLowerCase())||t.code?.toLowerCase().includes(j.toLowerCase())).map(t=>e.jsxs(qn,{"data-selected":q?.id===t.id,onClick:()=>mt(t),children:[e.jsxs("div",{children:[e.jsx("strong",{children:t.title}),e.jsx(A,{style:{marginLeft:8},children:t.code})]}),e.jsx(A,{children:et(t.startTime,t.endTime)})]},t.id))]}),e.jsx(T,{style:{marginTop:10},children:"시간"}),e.jsxs(Xe,{children:[e.jsx(_,{"aria-label":"시",value:Pe,onChange:t=>{const n=t.target.value;Ye(n)},children:oe.map(t=>e.jsx("option",{value:t,children:t},t))}),e.jsx("span",{children:":"}),e.jsx(_,{"aria-label":"분",value:Oe,onChange:t=>{const n=t.target.value;Fe(n)},children:ie.map(t=>e.jsx("option",{value:t,children:t},t))}),e.jsx("span",{children:"~"}),e.jsx(_,{"aria-label":"시",value:Ve,onChange:t=>{const n=t.target.value;Ge(n)},children:oe.map(t=>e.jsx("option",{value:t,children:t},t))}),e.jsx("span",{children:":"}),e.jsx(_,{"aria-label":"분",value:We,onChange:t=>{const n=t.target.value;_e(n)},children:ie.map(t=>e.jsx("option",{value:t,children:t},t))})]}),we&&e.jsx(H,{children:we}),e.jsxs(fe,{children:[e.jsx(re,{type:"button",onClick:()=>E(!1),children:"취소"}),e.jsx(ae,{type:"button",disabled:ve,onClick:bt,children:ve?"저장 중…":"저장"})]})]})}),(ye||Ce)&&e.jsx("div",{style:{color:"#b91c1c",marginTop:8},children:Ce||ye})]})]})]})}const ce=i.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.28);
  display: grid;
  place-items: center;
  z-index: 1200;
`,de=i.div`
  width: 480px;
  max-width: calc(100% - 32px);
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  box-shadow: 0 8px 28px rgba(2, 6, 23, 0.08);
  padding: 18px;
`,ue=i.h3`
  margin: 0 0 10px;
  font-size: 17px;
  font-weight: 700;
  color: #111827;
`,Xe=i.div` display:flex; align-items:center; gap:12px; `,lt=i.div` max-height: 220px; overflow: auto; border: 1px solid #f1f5f9; border-radius: 10px; margin-top: 6px; background: #fff; `,qn=i.div`
  padding: 8px 10px; display:flex; align-items:center; justify-content:space-between; cursor:pointer;
  border-bottom: 1px solid #f1f5f9;
  &[data-selected='true']{ background:#eef2ff; }
  &:hover{ background:${({theme:s})=>s.colors.surfaceMuted}; }
`,Jn=i(lt)``,Qn=i.button`
  width: 100%; text-align: left; background: transparent; border: 0; padding: 8px 10px; display:flex; align-items:center; justify-content:space-between; cursor:pointer;
  border-bottom: 1px solid #f1f5f9;
  &[data-selected='true']{ background:#eef2ff; }
  &:hover{ background:${({theme:s})=>s.colors.surfaceMuted}; }
`,H=i.div` color:#b91c1c; font-size:12px; margin-top:6px; `;function Ze(s){if(!s)return"--:--";try{const l=String(s).match(/(\d{2}):(\d{2})/);return l?`${l[1]}:${l[2]}`:"--:--"}catch{return"--:--"}}function et(s,r){return`${Ze(s)} ~ ${Ze(r)}`}function tt(s){if(!s)return"";try{const l=String(s).match(/(\d{2}):(\d{2})/);return l?`${l[1]}:${l[2]}`:""}catch{return""}}function nt(s){if(!s)return;const[r,l]=s.split(":");return`${r?.padStart(2,"0")}:${l?.padStart(2,"0")}:00`}const T=i.label`
  display: block;
  margin: 8px 0 6px;
  font-size: 12px;
  color: #6b7280;
  span { color: #ef4444; margin-left: 4px; }
`,pe=i.input`
  width: 100%;
  height: 40px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 12px;
  &[aria-invalid='true'] {
    border-color: #ef4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.12);
  }
`,_=i.select`
  width: 100%;
  height: 40px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 8px;
  background: #fff;
`,st=i.textarea`
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 8px 12px;
  resize: vertical;
`,fe=i.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
`,A=i.span` color:#9ca3af; font-size:12px; `,xe=i.div` color:#6b7280; font-size:12px; `,Xn=i.div`
  display: inline-flex; align-items: center; gap: 8px; padding: 6px 10px; border:1px solid #c7d2fe; background:#eef2ff; color:#1f2937; border-radius: 8px; font-size: 13px;
  .label { color:#4f46e5; font-weight: 800; }
  .name { font-weight: 800; }
`;export{hs as default};
