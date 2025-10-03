import{j as e,d as i,c as H,r as o,b as it,p as at,i as $t,u as Lt,e as Mt,g as Bt,G as ae,h as re,k as qe}from"./index-C5H-3XpS.js";import{C as It}from"./ClassList-Ctt_BaJ1.js";import{E as zt}from"./EmptyPlaceholder-DH9zVN9s.js";import{S as Ke}from"./SelectBox-lInkDLwW.js";import{p as Rt,s as Nt,W as At,f as A}from"./dateUtils-CoPTMMCx.js";import{u as Ht,l as Pt,c as Yt,a as Ot,d as Ft}from"./todos-9c_DSD79.js";import{l as Gt,c as Vt}from"./courses-Cjb6BW_b.js";import{l as rt,c as _t}from"./counsels-Bn14hZaJ.js";import{g as z}from"./calendar-DM7NEQaA.js";import{l as Wt}from"./students-DtpvHDV6.js";import{f as Ut}from"./format-CD1P4D3U.js";function qt({label:s,onBack:r,onPrev:l,onNext:a,onToday:f}){return e.jsxs(Kt,{children:[e.jsx(Xt,{type:"button",onClick:r,children:"← 돌아가기"}),e.jsxs(Jt,{children:[e.jsx(Je,{onClick:l,"aria-label":"이전 날짜",children:"‹"}),e.jsx(Qt,{children:s}),e.jsx(Je,{onClick:a,"aria-label":"다음 날짜",children:"›"})]}),e.jsx(Zt,{type:"button",onClick:f,children:"오늘"})]})}const Kt=i.div`
  display: flex; align-items: center; justify-content: space-between; gap: 10px;
`,Jt=i.div`
  display: flex; align-items: center; gap: 8px;
`,Qt=i.div`
  font-weight: 800; color: #111827;
`,Xt=i.button`
  ${H.outline};
  height: 40px;
  padding: 0 16px;
  font-weight: 600;
`,Je=i.button`
  ${H.outline};
  width: 40px;
  height: 40px;
  padding: 0;
  font-weight: 700;
  font-size: 18px;
`,Zt=i.button`
  ${H.primary};
  height: 40px;
  padding: 0 18px;
  font-weight: 600;
`;function en({items:s,onAdd:r,onDetail:l}){return e.jsxs(tn,{children:[e.jsxs(nn,{children:[e.jsxs(sn,{children:[e.jsx(on,{"aria-hidden":!0,children:pn}),e.jsx("h4",{children:"상담 일정"})]}),e.jsx(an,{children:r?e.jsx(Qe,{type:"button",onClick:r,children:"+ 상담 추가"}):null})]}),e.jsx(rn,{children:s.map((a,f)=>e.jsxs(ln,{children:[e.jsxs(cn,{children:[e.jsx("div",{className:"left",children:e.jsx("strong",{children:a.with||"학생"})}),e.jsxs("div",{className:"right",children:[e.jsx(un,{children:a.time}),l&&a.studentId?e.jsx(Qe,{type:"button",onClick:()=>l(a.studentId,a.id),children:"상세"}):null]})]}),e.jsx(dn,{children:(a.title||"").trim()||"내용 없음"})]},`cs-${f}`))})]})}const tn=i.section`
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 12px;
  background: #fff;
  display: flex;
  flex-direction: column;
  height: 100%; /* fill half container */
  min-height: 0; /* allow Grid to scroll */
`,nn=i.div`
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;
  h4 { margin: 0; font-size: 15px; color: #111827; }
`,sn=i.div`
  display: flex; align-items: center; gap: 8px;
`,on=i.span`
  width: 28px; height: 28px; border-radius: 8px; display: grid; place-items: center; background: #f3f4f6; color: #4f46e5;
`,an=i.div``,Qe=i.button`
  ${H.outline};
  height: 40px;
  padding: 0 16px;
  font-size: 14px;
  font-weight: 600;
`,rn=i.div`
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
`,ln=i.div`
  border: 1px solid #e5e7eb; border-radius: 12px; padding: 12px; background: #fff;
`,cn=i.div`
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;
  .right { display:inline-flex; align-items:center; gap:8px; }
`,dn=i.div` color:#374151; font-size:13px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; `,un=i.span`
  color: #6b7280; font-size: 12px; font-weight: 700;
`,pn=e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"})});function fn({inProgress:s,done:r,onAdd:l,onToggle:a,onDelete:f,onEdit:v}){const[x,S]=o.useState(s);return o.useEffect(()=>{S(s)},[s]),o.useEffect(()=>{},[r]),e.jsxs(xn,{children:[e.jsxs(hn,{children:[e.jsxs(gn,{children:[e.jsx(mn,{"aria-hidden":!0,children:Mn}),e.jsx("h4",{children:"할 일"}),e.jsx(vn,{children:s.length})]}),e.jsx(bn,{children:e.jsx(jn,{type:"button",onClick:l,children:"+ 할일 추가"})})]}),x.length===0?e.jsx(zt,{title:"오늘 등록된 할 일이 없습니다."}):e.jsx(wn,{children:x.map((p,m)=>e.jsxs(yn,{children:[e.jsxs(Cn,{children:[e.jsx($n,{"aria-hidden":!0}),e.jsxs(Ln,{children:[e.jsx(Sn,{title:p.title,children:p.title}),p.content&&e.jsx(kn,{title:p.content,children:p.content})]})]}),e.jsxs(Dn,{children:[typeof p.id=="number"&&e.jsx(Tn,{type:"button",onClick:()=>v?.(p.id),children:"수정"}),typeof p.id=="number"&&e.jsx(En,{type:"button",onClick:()=>f?.(p.id),children:"삭제"})]})]},`p-${p.id??m}`))})]})}const xn=i.section`
  border: 1px solid #e5e7eb; border-radius: 16px; padding: 12px; background: #fff; display: flex; flex-direction: column;
`,hn=i.div`
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;
  h4 { margin: 0; font-size: 15px; color: #111827; }
`,gn=i.div`
  display: flex; align-items: center; gap: 8px;
`,mn=i.span`
  width: 28px; height: 28px; border-radius: 8px; display: grid; place-items: center; background: #eef2ff; color: #4f46e5;
`,bn=i.div``,jn=i.button`
  ${H.outline};
  height: 40px;
  padding: 0 16px;
  font-size: 14px;
  font-weight: 600;
`,vn=i.span`
  background: #e5e7eb; color: #374151; height: 20px; min-width: 22px; padding: 0 6px; border-radius: 9999px; display: inline-flex; align-items: center; justify-content: center; font-weight: 700; font-size: 12px;
`,wn=i.div`
  display: grid;
  gap: 8px;
  padding: 4px 2px;
  /* 상세 페이지는 내부 스크롤 없이 전체 표시 */
`,yn=i.div`
  display: grid; grid-template-columns: 1fr auto; align-items: flex-start; gap: 10px;
  border: 1px solid #e5e7eb; border-radius: 10px; padding: 10px 12px; background: #fff;
  transition: background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
  &:hover { background: #fafafa; border-color: #e2e8f0; box-shadow: 0 1px 2px rgba(0,0,0,0.04); }
`,Cn=i.div`
  display: grid; grid-template-columns: 10px 1fr; gap: 10px; align-items: flex-start; min-width: 0;
`,Sn=i.div`
  font-weight: 800; margin-bottom: 2px; font-size: 14px; letter-spacing: -0.01em; color: #0f172a;
  display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;
`,kn=i.div`
  color: #64748b;
  font-size: 12.5px;
  line-height: 1.5;
  white-space: pre-line;
  display: -webkit-box;
  -webkit-line-clamp: 5; /* 상세 페이지는 5줄 표시 */
  -webkit-box-orient: vertical;
  overflow: hidden;
`,Tn=i(it)`
  height: 40px;
  padding: 0 16px;
  font-size: 14px;
`,En=i(it)`
  height: 40px;
  padding: 0 16px;
  font-size: 14px;
  border-color: #ef4444;
  color: #ef4444;
  &:hover {
    background: #fee2e2;
    border-color: #dc2626;
  }
`,Dn=i.div`
  display: flex; gap: 6px; align-items: center;
`,$n=i.span`
  width: 10px; height: 10px; border-radius: 9999px; background: #4f46e5; margin-top: 5px;
`,Ln=i.div`
  display: flex; flex-direction: column; gap: 2px; min-width: 0;
`,Mn=e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"M20 6L9 17l-5-5"})});function Bn(s){const r=o.useMemo(()=>s?Rt(s):Nt(new Date),[s]),l=`${r.getFullYear()}년 ${r.getMonth()+1}월 ${r.getDate()}일 (${At[r.getDay()]})`,{classesForDate:a}=Ht({dates:[[r]]}),f=o.useMemo(()=>a(r),[a,r]),[v,x]=o.useState([]);o.useEffect(()=>{let d=!1;async function g(){try{const T=A(r);try{const P=`/api/counsels?${new URLSearchParams({onYmd:T,size:String(50)}).toString()}`,Y=at(P);if(Y.data&&!d){const E=(Y.data.content||[]).map(y=>({id:y.id,studentId:y.studentId,time:Xe(y.counselTime),title:(y.content||"").split(/\r?\n/)[0]||"상담",with:y.studentName,owner:"-",done:y.status==="CONVERTED"}));x(E)}}catch{}const w=await rt({onYmd:T,size:50});if(d)return;const j=(w.content||[]).map(u=>({id:u.id,studentId:u.studentId,time:Xe(u.counselTime),title:(u.content||"").split(/\r?\n/)[0]||"상담",with:u.studentName,owner:"-",done:u.status==="CONVERTED"}));x(j)}catch{d||x([])}}return g(),()=>{d=!0}},[r]);function S(){const d=new Date(r);return d.setDate(d.getDate()-1),A(d)}function p(){const d=new Date(r);return d.setDate(d.getDate()+1),A(d)}function m(){return A(new Date)}return{date:r,label:l,classes:f,counsels:v,prevYMD:S,nextYMD:p,todayYMD:m}}function Xe(s){if(!s)return"--:--";try{return s.replace("T"," ").slice(11,16)}catch{return"--:--"}}function In(s){const[r,l]=o.useState(null),[a,f]=o.useState(!1),[v,x]=o.useState(!1),[S,p]=o.useState(null),m=o.useRef(null),d=o.useRef(s),g=o.useCallback(async w=>{m.current&&m.current.abort();const j=new AbortController;m.current=j,p(null),w&&d.current===s?(x(!0),f(!1)):(f(!0),x(!1));try{const u=await Pt(s,void 0,{signal:j.signal});if(d.current!==s)return;l(u)}catch(u){if(u?.name==="AbortError")return;p(u?.message||"Failed to load todos")}finally{d.current===s&&(f(!1),x(!1))}},[s]);o.useEffect(()=>{d.current=s;const w=`/api/todos?dueYmd=${s}`,j=at(w),u=!!j.data;return u?(l(j.data),f(!1),x(!0)):(l(null),f(!0),x(!1)),g(u),()=>{m.current&&m.current.abort()}},[s,g]);const T=o.useCallback(()=>g(!!r&&d.current===s),[g,r,s]);return{data:r,loading:a,revalidating:v,error:S,refresh:T}}function le(s){$t(`/api/todos?dueYmd=${s}`)}function zn({children:s}){return e.jsx(Hn,{children:s})}function Rn({children:s}){return e.jsx(Pn,{children:s})}function Nn({children:s}){return e.jsx(Yn,{children:s})}function An({children:s}){return e.jsx(On,{children:s})}const Hn=i.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  height: calc(100vh - 48px); /* account for main content padding */
  overflow: hidden; /* prevent page scroll; use internal scrolls */
`,Pn=i.div`
  display: flex;
  gap: 12px;
  align-items: stretch;
  flex: 1 1 auto;
  min-height: 0; /* allow children to compute internal scroll */
  overflow: hidden;
  @media (max-width: 960px) { flex-direction: column; height: auto; overflow: visible; }
`,Yn=i.div`
  flex: 1 1 0;
  display: grid;
  grid-template-rows: 1fr 1fr; /* 5:5 (1:1) vertical split */
  gap: 12px;
  height: 100%;
  min-height: 0; /* enable internal scrolls in children */
`,On=i.div`
  flex: 1 1 0;
  display: grid;
  gap: 12px;
  align-content: flex-start;
  height: 100%;
  min-height: 0;
  overflow: auto; /* right column can scroll if long */
`;function os(){const s=Lt(),{ymd:r}=Mt(),{warning:l}=Bt(),a=r??A(new Date),{label:f,classes:v,counsels:x,prevYMD:S,nextYMD:p,todayYMD:m}=Bn(a),[d,g]=o.useState([]),[T,w]=o.useState([]),[j,u]=o.useState(!1),[P,Y]=o.useState([]),[E,y]=o.useState(""),[he,ge]=o.useState(!1),[q,me]=o.useState(null),[K,be]=o.useState(null),[je,ve]=o.useState(!1),[we,L]=o.useState(null);function J(...t){for(const n of t)if(typeof n=="number"&&Number.isFinite(n))return n;return 0}function ct(t){if(!t)return null;const n=String(t).trim();return n==="정기 수업"||n==="정기수업"?null:n||null}function M(t){return t.map(n=>{const c=n.startTime??n.start_at??n.startAt??n.start??null,b=n.endTime??n.end_at??n.endAt??n.end??null,h=J(n.attPresent,n.presentCount,n.attendancePresent,n?.attendance?.present),Tt=J(n.attAbsent,n.absentCount,n.attendanceAbsent,n?.attendance?.absent),Et=J(n.attUnprocessed),Dt=ct(n.notes||n.content||n.topic||null);return{subject:n.courseTitle||"수업",time:tt(c,b),room:"-",teacher:"-",student:"-",done:!1,courseId:n.courseId||void 0,date:n.recordDate||n.date||a,recordId:n.recordId||n.id,notes:Dt,attPresent:h,attAbsent:Tt,attUnprocessed:Et}})}o.useMemo(()=>{},[]),o.useEffect(()=>{let t=!1;async function n(){try{const c=await z(a);if(t)return;g(M(c))}catch{t||g(v)}}return n(),()=>{t=!0}},[a,v]),o.useEffect(()=>{let t=!1;const n=setInterval(async()=>{try{const c=await z(a);if(t)return;g(M(c))}catch{}},15e3);return()=>{t=!0,clearInterval(n)}},[a]),o.useEffect(()=>{w(x)},[x]),o.useEffect(()=>{function t(){document.visibilityState==="visible"&&z(a).then(n=>g(M(n))).catch(()=>{})}return document.addEventListener("visibilitychange",t),()=>document.removeEventListener("visibilitychange",t)},[a]),o.useEffect(()=>{function t(n){const b=n.detail?.ymd;(!b||b===a)&&z(a).then(h=>g(M(h))).catch(()=>{})}return window.addEventListener("calendar:classes-refresh",t),()=>{window.removeEventListener("calendar:classes-refresh",t)}},[a]);const{data:B,error:ye,refresh:Q}=In(a),[Ce,Se]=o.useState(null),[dt,I]=o.useState(!1),[X,ke]=o.useState(null),[O,Z]=o.useState(""),[ee,te]=o.useState("");async function ut(){ke(null),Z(""),te(""),I(!0)}function pt(t){const n=(B||[]).find(c=>c.id===t);n&&(ke(t),Z(n.title),te(n.notes||""),I(!0))}const[F,ne]=o.useState(null);async function ft(t){if(t.preventDefault(),!O.trim()){ne("제목을 입력해 주세요.");return}const n=a;try{if(X==null){const c=await Yt({title:O.trim(),notes:ee||void 0,calendarDate:n});le(a),await Q()}else{const c=await Ot(X,{title:O.trim(),notes:ee||void 0});le(a),await Q()}I(!1),ne(null)}catch(c){Se($(c,"저장에 실패했습니다."))}}async function xt(t){try{await Ft(t),le(a),await Q()}catch(n){Se($(n,"삭제에 실패했습니다."))}}async function ht(){if(u(!0),L(null),P.length===0){ge(!0),me(null);try{const t=await Gt({status:"IN_PROGRESS",size:200});Y(t.content)}catch(t){me($(t,"수업 목록을 불러오지 못했습니다."))}finally{ge(!1)}}}function gt(t){be(t);const n=nt(t.startTime)||"00:00",c=nt(t.endTime)||"00:00";try{const[b,h]=n.split(":");Ye(b),Fe(h)}catch{}try{const[b,h]=c.split(":");Ve(b),We(h)}catch{}L(null)}async function mt(){if(!K){l("수업 템플릿을 선택해 주세요.");return}const t=st(`${(Pe||"00").padStart(2,"0")}:${(Oe||"00").padStart(2,"0")}`),n=st(`${(Ge||"00").padStart(2,"0")}:${(_e||"00").padStart(2,"0")}`);ve(!0),L(null);try{await Vt(K.id,{recordDate:a,startTime:t,endTime:n}),qe("/api/calendar/classes"),qe("/api/calendar/classes-range");const c=await z(a);g(M(c)),u(!1),be(null)}catch(c){$(c,"").includes("HTTP 409")?L("이미 등록된 수업이 있습니다."):L("수업 추가에 실패했습니다.")}finally{ve(!1)}}const bt=o.useMemo(()=>(B||[]).filter(t=>t.status!=="DONE").map(t=>({id:t.id,title:t.title,content:t.notes,done:!1})),[B]),jt=o.useMemo(()=>(B||[]).filter(t=>t.status==="DONE").map(t=>({id:t.id,title:t.title,content:t.notes,done:!0})),[B]),[vt,G]=o.useState(!1),[Te,wt]=o.useState([]),[V,yt]=o.useState(""),[Ee,De]=o.useState(!1),[se,$e]=o.useState(null),[C,Le]=o.useState(null),[Wn,Me]=o.useState(""),[Be,Ie]=o.useState(""),[ze,Re]=o.useState(!1),[Ne,D]=o.useState(null),oe=o.useMemo(()=>Array.from({length:24},(t,n)=>String(n).padStart(2,"0")),[]),ie=o.useMemo(()=>["00","05","10","15","20","25","30","35","40","45","50","55"],[]),[_,Ae]=o.useState(""),[W,He]=o.useState(""),[Pe,Ye]=o.useState(""),[Oe,Fe]=o.useState(""),[Ge,Ve]=o.useState(""),[_e,We]=o.useState("");async function Ct(){if(G(!0),D(null),Ae(""),He(""),Me(""),Te.length===0){De(!0),$e(null);try{const t=await Wt({status:"ENROLLED",size:200});wt(t.content)}catch(t){$e($(t,"학생 목록을 불러오지 못했습니다."))}finally{De(!1)}}}function Ue(t){Le(t),D(null)}function St(t,n){return!n||!/^\d{2}:\d{2}$/.test(n)?`${t}T00:00:00`:`${t}T${n}:00`}async function kt(){if(!C){D("학생을 선택해 주세요.");return}const t=_&&W?`${_}:${W}`:"";if(!t){D("시간을 선택해 주세요.");return}const n=St(a,t);Re(!0),D(null);try{await _t({studentId:C.id,counselTime:n,content:Be||void 0});const b=((await rt({onYmd:a,size:50})).content||[]).map(h=>({id:h.id,studentId:h.studentId,time:h.counselTime.replace("T"," ").slice(11,16),title:(h.content||"").split(/\r?\n/)[0]||"상담",with:h.studentName,owner:"-",done:h.status==="CONVERTED"}));w(b),G(!1),Le(null),Me(""),Ie("")}catch(c){D($(c,"상담 추가에 실패했습니다."))}finally{Re(!1)}}return e.jsxs(zn,{children:[e.jsx(qt,{label:f,onBack:()=>s(-1),onPrev:()=>s(`/calendar/${S()}`),onNext:()=>s(`/calendar/${p()}`),onToday:()=>s(`/calendar/${m()}`)}),e.jsxs(Rn,{children:[e.jsxs(Nn,{children:[e.jsx(fn,{inProgress:bt,done:jt,onAdd:ut,onDelete:xt,onEdit:pt}),e.jsx(en,{items:T,onAdd:Ct,onDetail:t=>s(`/students/${t}/counsels`)})]}),e.jsxs(An,{children:[e.jsx(It,{items:d,titleMode:"subject",showNotes:!0,onAdd:ht}),dt&&e.jsx(ce,{onClick:()=>I(!1),children:e.jsxs(de,{onClick:t=>t.stopPropagation(),children:[e.jsx(ue,{children:X==null?"할 일 추가":"할 일 수정"}),e.jsxs("form",{onSubmit:ft,children:[e.jsxs(k,{children:["제목",e.jsx("span",{children:"*"})]}),e.jsx(pe,{value:O,onChange:t=>{Z(t.target.value),F&&ne(null)},placeholder:"예: 상담 준비","aria-invalid":!!F,required:!0}),F&&e.jsx(R,{children:F}),e.jsx(k,{children:"메모 (선택)"}),e.jsx(ot,{rows:4,value:ee,onChange:t=>te(t.target.value),placeholder:"세부 내용 또는 참고사항"}),e.jsxs(fe,{children:[e.jsx(ae,{type:"button",onClick:()=>I(!1),children:"취소"}),e.jsx(re,{type:"submit",children:"저장"})]})]})]})}),vt&&e.jsx(ce,{onClick:()=>G(!1),children:e.jsxs(de,{onClick:t=>t.stopPropagation(),children:[e.jsx(ue,{children:"상담 추가"}),e.jsx(k,{children:"학생 선택"}),e.jsx(pe,{placeholder:"학생 검색…",value:V,onChange:t=>yt(t.target.value)}),e.jsxs(Gn,{children:[Ee&&e.jsx(xe,{children:"불러오는 중…"}),se&&e.jsx(R,{children:se}),!Ee&&!se&&(Te||[]).filter(t=>!V||t.name.toLowerCase().includes(V.toLowerCase())||(t.code||"").toLowerCase().includes(V.toLowerCase())).map(t=>e.jsxs(Vn,{type:"button","data-selected":C?.id===t.id,onClick:()=>Ue(t),onKeyDown:n=>{(n.key==="Enter"||n.key===" ")&&(n.preventDefault(),Ue(t))},children:[e.jsxs("div",{children:[e.jsx("strong",{children:t.name}),e.jsx(N,{style:{marginLeft:8},children:t.code})]}),e.jsx(N,{children:Ut(t.phoneNumber)})]},t.id))]}),e.jsx("div",{style:{marginTop:8},children:C?e.jsxs(_n,{children:[e.jsx("span",{className:"label",children:"선택된 학생"}),e.jsx("span",{className:"name",children:C.name}),C.code&&e.jsx(N,{style:{marginLeft:6},children:C.code})]}):e.jsx(xe,{children:"학생을 선택해 주세요."})}),e.jsx(k,{style:{marginTop:10},children:"시간"}),e.jsxs(Ze,{children:[e.jsx("div",{style:{flex:1},children:e.jsx(Ke,{ariaLabel:"시",value:_,onChange:Ae,placeholder:"시",options:oe.map(t=>({label:t,value:t}))})}),e.jsx("span",{children:":"}),e.jsx("div",{style:{flex:1},children:e.jsx(Ke,{ariaLabel:"분",value:W,onChange:He,placeholder:"분",options:ie.map(t=>({label:t,value:t}))})})]}),e.jsx(k,{style:{marginTop:10},children:"메모 (선택)"}),e.jsx(ot,{rows:3,value:Be,onChange:t=>Ie(t.target.value),placeholder:"상담 메모"}),Ne&&e.jsx(R,{children:Ne}),e.jsxs(fe,{children:[e.jsx(ae,{type:"button",onClick:()=>G(!1),children:"취소"}),e.jsx(re,{type:"button",disabled:ze||!_||!W||!C,onClick:kt,children:ze?"저장 중…":"저장"})]})]})}),j&&e.jsx(ce,{onClick:()=>u(!1),children:e.jsxs(de,{onClick:t=>t.stopPropagation(),children:[e.jsx(ue,{children:"수업 추가"}),e.jsx(k,{children:"수업 템플릿 선택"}),e.jsx(pe,{placeholder:"검색어로 필터…",value:E,onChange:t=>y(t.target.value)}),e.jsxs(lt,{children:[he&&e.jsx(xe,{children:"불러오는 중…"}),q&&e.jsx(R,{children:q}),!he&&!q&&(P||[]).filter(t=>!E||t.title?.toLowerCase().includes(E.toLowerCase())||t.code?.toLowerCase().includes(E.toLowerCase())).map(t=>e.jsxs(Fn,{"data-selected":K?.id===t.id,onClick:()=>gt(t),children:[e.jsxs("div",{children:[e.jsx("strong",{children:t.title}),e.jsx(N,{style:{marginLeft:8},children:t.code})]}),e.jsx(N,{children:tt(t.startTime,t.endTime)})]},t.id))]}),e.jsx(k,{style:{marginTop:10},children:"시간"}),e.jsxs(Ze,{children:[e.jsx(U,{"aria-label":"시",value:Pe,onChange:t=>{const n=t.target.value;Ye(n)},children:oe.map(t=>e.jsx("option",{value:t,children:t},t))}),e.jsx("span",{children:":"}),e.jsx(U,{"aria-label":"분",value:Oe,onChange:t=>{const n=t.target.value;Fe(n)},children:ie.map(t=>e.jsx("option",{value:t,children:t},t))}),e.jsx("span",{children:"~"}),e.jsx(U,{"aria-label":"시",value:Ge,onChange:t=>{const n=t.target.value;Ve(n)},children:oe.map(t=>e.jsx("option",{value:t,children:t},t))}),e.jsx("span",{children:":"}),e.jsx(U,{"aria-label":"분",value:_e,onChange:t=>{const n=t.target.value;We(n)},children:ie.map(t=>e.jsx("option",{value:t,children:t},t))})]}),we&&e.jsx(R,{children:we}),e.jsxs(fe,{children:[e.jsx(ae,{type:"button",onClick:()=>u(!1),children:"취소"}),e.jsx(re,{type:"button",disabled:je,onClick:mt,children:je?"저장 중…":"저장"})]})]})}),(ye||Ce)&&e.jsx("div",{style:{color:"#b91c1c",marginTop:8},children:Ce||ye})]})]})]})}const ce=i.div`
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
`,Ze=i.div` display:flex; align-items:center; gap:12px; `,lt=i.div` max-height: 220px; overflow: auto; border: 1px solid #f1f5f9; border-radius: 10px; margin-top: 6px; `,Fn=i.div`
  padding: 8px 10px; display:flex; align-items:center; justify-content:space-between; cursor:pointer;
  border-bottom: 1px solid #f1f5f9;
  &[data-selected='true']{ background:#eef2ff; }
  &:hover{ background:#f9fafb; }
`,Gn=i(lt)``,Vn=i.button`
  width: 100%; text-align: left; background: transparent; border: 0; padding: 8px 10px; display:flex; align-items:center; justify-content:space-between; cursor:pointer;
  border-bottom: 1px solid #f1f5f9;
  &[data-selected='true']{ background:#eef2ff; }
  &:hover{ background:#f9fafb; }
`,R=i.div` color:#b91c1c; font-size:12px; margin-top:6px; `;function et(s){if(!s)return"--:--";try{const l=String(s).match(/(\d{2}):(\d{2})/);return l?`${l[1]}:${l[2]}`:"--:--"}catch{return"--:--"}}function tt(s,r){return`${et(s)} ~ ${et(r)}`}function nt(s){if(!s)return"";try{const l=String(s).match(/(\d{2}):(\d{2})/);return l?`${l[1]}:${l[2]}`:""}catch{return""}}function st(s){if(!s)return;const[r,l]=s.split(":");return`${r?.padStart(2,"0")}:${l?.padStart(2,"0")}:00`}const k=i.label`
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
`,U=i.select`
  width: 100%;
  height: 40px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 8px;
  background: #fff;
`,ot=i.textarea`
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
`,N=i.span` color:#9ca3af; font-size:12px; `,xe=i.div` color:#6b7280; font-size:12px; `,_n=i.div`
  display: inline-flex; align-items: center; gap: 8px; padding: 6px 10px; border:1px solid #c7d2fe; background:#eef2ff; color:#1f2937; border-radius: 8px; font-size: 13px;
  .label { color:#4f46e5; font-weight: 800; }
  .name { font-weight: 800; }
`;function $(s,r){return typeof s=="string"?s:s&&typeof s=="object"&&"message"in s&&typeof s.message=="string"&&s.message||r}export{os as default};
