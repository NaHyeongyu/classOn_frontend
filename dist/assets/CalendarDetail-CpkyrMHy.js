import{j as t,d as i,c as A,r as o,b as tt,p as nt,i as kt,u as Tt,e as Et,g as Dt,G as ie,h as ae,k as _e}from"./index-Cq8NHvix.js";import{C as $t}from"./ClassList-C1O4mMdG.js";import{E as Lt}from"./EmptyPlaceholder-CUCJzKcO.js";import{p as Mt,s as Bt,W as It,f as H}from"./dateUtils-CoPTMMCx.js";import{u as zt,l as Rt,c as Nt,a as Ht,d as At}from"./todos-B9c4-XbF.js";import{l as Pt,c as Yt}from"./courses-BtQDTuwP.js";import{l as st,c as Ot}from"./counsels-CPcylzW7.js";import{g as R}from"./calendar-D4xafI2X.js";import{l as Ft}from"./students-ChMs12vx.js";import{f as Gt}from"./format-CD1P4D3U.js";function Vt({label:s,onBack:a,onPrev:l,onNext:r,onToday:x}){return t.jsxs(_t,{children:[t.jsx(Kt,{type:"button",onClick:a,children:"← 돌아가기"}),t.jsxs(Wt,{children:[t.jsx(We,{onClick:l,"aria-label":"이전 날짜",children:"‹"}),t.jsx(Ut,{children:s}),t.jsx(We,{onClick:r,"aria-label":"다음 날짜",children:"›"})]}),t.jsx(qt,{type:"button",onClick:x,children:"오늘"})]})}const _t=i.div`
  display: flex; align-items: center; justify-content: space-between; gap: 10px;
`,Wt=i.div`
  display: flex; align-items: center; gap: 8px;
`,Ut=i.div`
  font-weight: 800; color: #111827;
`,Kt=i.button`
  ${A.outline};
  height: 36px;
  padding: 0 14px;
  font-weight: 600;
`,We=i.button`
  ${A.outline};
  width: 34px;
  height: 34px;
  padding: 0;
  font-weight: 700;
  font-size: 18px;
`,qt=i.button`
  ${A.primary};
  height: 40px;
  padding: 0 18px;
  font-weight: 600;
`;function Jt({items:s,onAdd:a,onDetail:l}){return t.jsxs(Qt,{children:[t.jsxs(Xt,{children:[t.jsxs(Zt,{children:[t.jsx(en,{"aria-hidden":!0,children:ln}),t.jsx("h4",{children:"상담 일정"})]}),t.jsx(tn,{children:a?t.jsx(Ue,{type:"button",onClick:a,children:"+ 상담 추가"}):null})]}),t.jsx(nn,{children:s.map((r,x)=>t.jsxs(sn,{children:[t.jsxs(on,{children:[t.jsx("div",{className:"left",children:t.jsx("strong",{children:r.with||"학생"})}),t.jsxs("div",{className:"right",children:[t.jsx(rn,{children:r.time}),l&&r.studentId?t.jsx(Ue,{type:"button",onClick:()=>l(r.studentId,r.id),children:"상세"}):null]})]}),t.jsx(an,{children:(r.title||"").trim()||"내용 없음"})]},`cs-${x}`))})]})}const Qt=i.section`
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 12px;
  background: #fff;
  display: flex;
  flex-direction: column;
  height: 100%; /* fill half container */
  min-height: 0; /* allow Grid to scroll */
`,Xt=i.div`
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;
  h4 { margin: 0; font-size: 15px; color: #111827; }
`,Zt=i.div`
  display: flex; align-items: center; gap: 8px;
`,en=i.span`
  width: 28px; height: 28px; border-radius: 8px; display: grid; place-items: center; background: #f3f4f6; color: #4f46e5;
`,tn=i.div``,Ue=i.button`
  ${A.outline};
  height: 34px;
  padding: 0 14px;
  font-size: 13px;
  font-weight: 600;
`,nn=i.div`
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
`,sn=i.div`
  border: 1px solid #e5e7eb; border-radius: 12px; padding: 12px; background: #fff;
`,on=i.div`
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;
  .right { display:inline-flex; align-items:center; gap:8px; }
`,an=i.div` color:#374151; font-size:13px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; `,rn=i.span`
  color: #6b7280; font-size: 12px; font-weight: 700;
`,ln=t.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:t.jsx("path",{d:"M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"})});function cn({inProgress:s,done:a,onAdd:l,onToggle:r,onDelete:x,onEdit:j}){const[h,y]=o.useState(s);return o.useEffect(()=>{y(s)},[s]),o.useEffect(()=>{},[a]),t.jsxs(dn,{children:[t.jsxs(un,{children:[t.jsxs(pn,{children:[t.jsx(fn,{"aria-hidden":!0,children:En}),t.jsx("h4",{children:"할 일"}),t.jsx(gn,{children:s.length})]}),t.jsx(xn,{children:t.jsx(hn,{type:"button",onClick:l,children:"+ 할일 추가"})})]}),h.length===0?t.jsx(Lt,{title:"오늘 등록된 할 일이 없습니다."}):t.jsx(mn,{children:h.map((p,m)=>t.jsxs(bn,{children:[t.jsxs(jn,{children:[t.jsx(kn,{"aria-hidden":!0}),t.jsxs(Tn,{children:[t.jsx(vn,{title:p.title,children:p.title}),p.content&&t.jsx(wn,{title:p.content,children:p.content})]})]}),t.jsxs(Sn,{children:[typeof p.id=="number"&&t.jsx(yn,{type:"button",onClick:()=>j?.(p.id),children:"수정"}),typeof p.id=="number"&&t.jsx(Cn,{type:"button",onClick:()=>x?.(p.id),children:"삭제"})]})]},`p-${p.id??m}`))})]})}const dn=i.section`
  border: 1px solid #e5e7eb; border-radius: 16px; padding: 12px; background: #fff; display: flex; flex-direction: column;
`,un=i.div`
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;
  h4 { margin: 0; font-size: 15px; color: #111827; }
`,pn=i.div`
  display: flex; align-items: center; gap: 8px;
`,fn=i.span`
  width: 28px; height: 28px; border-radius: 8px; display: grid; place-items: center; background: #eef2ff; color: #4f46e5;
`,xn=i.div``,hn=i.button`
  ${A.outline};
  height: 36px;
  padding: 0 14px;
  font-size: 13px;
  font-weight: 600;
`,gn=i.span`
  background: #e5e7eb; color: #374151; height: 20px; min-width: 22px; padding: 0 6px; border-radius: 9999px; display: inline-flex; align-items: center; justify-content: center; font-weight: 700; font-size: 12px;
`,mn=i.div`
  display: grid;
  gap: 8px;
  padding: 4px 2px;
  /* 상세 페이지는 내부 스크롤 없이 전체 표시 */
`,bn=i.div`
  display: grid; grid-template-columns: 1fr auto; align-items: flex-start; gap: 10px;
  border: 1px solid #e5e7eb; border-radius: 10px; padding: 10px 12px; background: #fff;
  transition: background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
  &:hover { background: #fafafa; border-color: #e2e8f0; box-shadow: 0 1px 2px rgba(0,0,0,0.04); }
`,jn=i.div`
  display: grid; grid-template-columns: 10px 1fr; gap: 10px; align-items: flex-start; min-width: 0;
`,vn=i.div`
  font-weight: 800; margin-bottom: 2px; font-size: 14px; letter-spacing: -0.01em; color: #0f172a;
  display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;
`,wn=i.div`
  color: #64748b;
  font-size: 12.5px;
  line-height: 1.5;
  white-space: pre-line;
  display: -webkit-box;
  -webkit-line-clamp: 5; /* 상세 페이지는 5줄 표시 */
  -webkit-box-orient: vertical;
  overflow: hidden;
`,yn=i(tt)`
  height: 32px;
  padding: 0 12px;
  font-size: 13px;
`,Cn=i(tt)`
  height: 32px;
  padding: 0 12px;
  font-size: 13px;
  border-color: #ef4444;
  color: #ef4444;
  &:hover {
    background: #fee2e2;
    border-color: #dc2626;
  }
`,Sn=i.div`
  display: flex; gap: 6px; align-items: center;
`,kn=i.span`
  width: 10px; height: 10px; border-radius: 9999px; background: #4f46e5; margin-top: 5px;
`,Tn=i.div`
  display: flex; flex-direction: column; gap: 2px; min-width: 0;
`,En=t.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:t.jsx("path",{d:"M20 6L9 17l-5-5"})});function Dn(s){const a=o.useMemo(()=>s?Mt(s):Bt(new Date),[s]),l=`${a.getFullYear()}년 ${a.getMonth()+1}월 ${a.getDate()}일 (${It[a.getDay()]})`,{classesForDate:r}=zt({dates:[[a]]}),x=o.useMemo(()=>r(a),[r,a]),[j,h]=o.useState([]);o.useEffect(()=>{let d=!1;async function g(){try{const T=H(a);try{const P=`/api/counsels?${new URLSearchParams({onYmd:T,size:String(50)}).toString()}`,Y=nt(P);if(Y.data&&!d){const E=(Y.data.content||[]).map(w=>({id:w.id,studentId:w.studentId,time:Ke(w.counselTime),title:(w.content||"").split(/\r?\n/)[0]||"상담",with:w.studentName,owner:"-",done:w.status==="CONVERTED"}));h(E)}}catch{}const v=await st({onYmd:T,size:50});if(d)return;const b=(v.content||[]).map(u=>({id:u.id,studentId:u.studentId,time:Ke(u.counselTime),title:(u.content||"").split(/\r?\n/)[0]||"상담",with:u.studentName,owner:"-",done:u.status==="CONVERTED"}));h(b)}catch{d||h([])}}return g(),()=>{d=!0}},[a]);function y(){const d=new Date(a);return d.setDate(d.getDate()-1),H(d)}function p(){const d=new Date(a);return d.setDate(d.getDate()+1),H(d)}function m(){return H(new Date)}return{date:a,label:l,classes:x,counsels:j,prevYMD:y,nextYMD:p,todayYMD:m}}function Ke(s){if(!s)return"--:--";try{return s.replace("T"," ").slice(11,16)}catch{return"--:--"}}function $n(s){const[a,l]=o.useState(null),[r,x]=o.useState(!1),[j,h]=o.useState(!1),[y,p]=o.useState(null),m=o.useRef(null),d=o.useRef(s),g=o.useCallback(async v=>{m.current&&m.current.abort();const b=new AbortController;m.current=b,p(null),v&&d.current===s?(h(!0),x(!1)):(x(!0),h(!1));try{const u=await Rt(s,void 0,{signal:b.signal});if(d.current!==s)return;l(u)}catch(u){if(u?.name==="AbortError")return;p(u?.message||"Failed to load todos")}finally{d.current===s&&(x(!1),h(!1))}},[s]);o.useEffect(()=>{d.current=s;const v=`/api/todos?dueYmd=${s}`,b=nt(v),u=!!b.data;return u?(l(b.data),x(!1),h(!0)):(l(null),x(!0),h(!1)),g(u),()=>{m.current&&m.current.abort()}},[s,g]);const T=o.useCallback(()=>g(!!a&&d.current===s),[g,a,s]);return{data:a,loading:r,revalidating:j,error:y,refresh:T}}function re(s){kt(`/api/todos?dueYmd=${s}`)}function Ln({children:s}){return t.jsx(zn,{children:s})}function Mn({children:s}){return t.jsx(Rn,{children:s})}function Bn({children:s}){return t.jsx(Nn,{children:s})}function In({children:s}){return t.jsx(Hn,{children:s})}const zn=i.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  height: calc(100vh - 48px); /* account for main content padding */
  overflow: hidden; /* prevent page scroll; use internal scrolls */
`,Rn=i.div`
  display: flex;
  gap: 12px;
  align-items: stretch;
  flex: 1 1 auto;
  min-height: 0; /* allow children to compute internal scroll */
  overflow: hidden;
  @media (max-width: 960px) { flex-direction: column; height: auto; overflow: visible; }
`,Nn=i.div`
  flex: 1 1 0;
  display: grid;
  grid-template-rows: 1fr 1fr; /* 5:5 (1:1) vertical split */
  gap: 12px;
  height: 100%;
  min-height: 0; /* enable internal scrolls in children */
`,Hn=i.div`
  flex: 1 1 0;
  display: grid;
  gap: 12px;
  align-content: flex-start;
  height: 100%;
  min-height: 0;
  overflow: auto; /* right column can scroll if long */
`;function Zn(){const s=Tt(),{ymd:a}=Et(),{warning:l}=Dt(),r=a??H(new Date),{label:x,classes:j,counsels:h,prevYMD:y,nextYMD:p,todayYMD:m}=Dn(r),[d,g]=o.useState([]),[T,v]=o.useState([]),[b,u]=o.useState(!1),[P,Y]=o.useState([]),[E,w]=o.useState(""),[xe,he]=o.useState(!1),[_,ge]=o.useState(null),[W,me]=o.useState(null),[be,je]=o.useState(!1),[ve,L]=o.useState(null);function U(...e){for(const n of e)if(typeof n=="number"&&Number.isFinite(n))return n;return 0}function M(e){return e.map(n=>{const c=n.startTime??n.start_at??n.startAt??n.start??null,f=n.endTime??n.end_at??n.endAt??n.end??null,S=U(n.attPresent,n.presentCount,n.attendancePresent,n?.attendance?.present),Ct=U(n.attAbsent,n.absentCount,n.attendanceAbsent,n?.attendance?.absent),St=U(n.attUnprocessed);return{subject:n.courseTitle||"수업",time:Qe(c,f),room:"-",teacher:"-",student:"-",done:!1,courseId:n.courseId||void 0,date:n.recordDate||n.date||r,recordId:n.recordId||n.id,notes:n.notes||n.content||n.topic||null,attPresent:S,attAbsent:Ct,attUnprocessed:St}})}o.useMemo(()=>{},[]),o.useEffect(()=>{let e=!1;async function n(){try{const c=await R(r);if(e)return;g(M(c))}catch{e||g(j)}}return n(),()=>{e=!0}},[r,j]),o.useEffect(()=>{let e=!1;const n=setInterval(async()=>{try{const c=await R(r);if(e)return;g(M(c))}catch{}},15e3);return()=>{e=!0,clearInterval(n)}},[r]),o.useEffect(()=>{v(h)},[h]),o.useEffect(()=>{function e(){document.visibilityState==="visible"&&R(r).then(n=>g(M(n))).catch(()=>{})}return document.addEventListener("visibilitychange",e),()=>document.removeEventListener("visibilitychange",e)},[r]),o.useEffect(()=>{function e(n){const f=n.detail?.ymd;(!f||f===r)&&R(r).then(S=>g(M(S))).catch(()=>{})}return window.addEventListener("calendar:classes-refresh",e),()=>{window.removeEventListener("calendar:classes-refresh",e)}},[r]);const{data:B,error:we,refresh:K}=$n(r),[ye,Ce]=o.useState(null),[it,I]=o.useState(!1),[q,Se]=o.useState(null),[O,J]=o.useState(""),[Q,X]=o.useState("");async function at(){Se(null),J(""),X(""),I(!0)}function rt(e){const n=(B||[]).find(c=>c.id===e);n&&(Se(e),J(n.title),X(n.notes||""),I(!0))}async function lt(e){if(e.preventDefault(),!O.trim())return;const n=r;try{if(q==null){const c=await Nt({title:O.trim(),notes:Q||void 0,calendarDate:n});re(r),await K()}else{const c=await Ht(q,{title:O.trim(),notes:Q||void 0});re(r),await K()}I(!1)}catch(c){Ce($(c,"저장에 실패했습니다."))}}async function ct(e){try{await At(e),re(r),await K()}catch(n){Ce($(n,"삭제에 실패했습니다."))}}async function dt(){if(u(!0),L(null),P.length===0){he(!0),ge(null);try{const e=await Pt({status:"IN_PROGRESS",size:200});Y(e.content)}catch(e){ge($(e,"수업 목록을 불러오지 못했습니다."))}finally{he(!1)}}}function ut(e){me(e);const n=Xe(e.startTime)||"00:00",c=Xe(e.endTime)||"00:00";try{const[f,S]=n.split(":");He(f),Pe(S)}catch{}try{const[f,S]=c.split(":");Oe(f),Ge(S)}catch{}L(null)}async function pt(){if(!W){l("수업 템플릿을 선택해 주세요.");return}const e=Ze(`${(Ne||"00").padStart(2,"0")}:${(Ae||"00").padStart(2,"0")}`),n=Ze(`${(Ye||"00").padStart(2,"0")}:${(Fe||"00").padStart(2,"0")}`);je(!0),L(null);try{await Yt(W.id,{recordDate:r,startTime:e,endTime:n}),_e("/api/calendar/classes"),_e("/api/calendar/classes-range");const c=await R(r);g(M(c)),u(!1),me(null)}catch(c){$(c,"").includes("HTTP 409")?L("이미 등록된 수업이 있습니다."):L("수업 추가에 실패했습니다.")}finally{je(!1)}}const ft=o.useMemo(()=>(B||[]).filter(e=>e.status!=="DONE").map(e=>({id:e.id,title:e.title,content:e.notes,done:!1})),[B]),xt=o.useMemo(()=>(B||[]).filter(e=>e.status==="DONE").map(e=>({id:e.id,title:e.title,content:e.notes,done:!0})),[B]),[ht,F]=o.useState(!1),[ke,gt]=o.useState([]),[G,mt]=o.useState(""),[Te,Ee]=o.useState(!1),[Z,De]=o.useState(null),[C,$e]=o.useState(null),[ee,Le]=o.useState(""),[Me,Be]=o.useState(""),[Ie,ze]=o.useState(!1),[Re,z]=o.useState(null),te=o.useMemo(()=>Array.from({length:24},(e,n)=>String(n).padStart(2,"0")),[]),ne=o.useMemo(()=>["00","05","10","15","20","25","30","35","40","45","50","55"],[]),[bt,se]=o.useState(""),[jt,oe]=o.useState(""),[Ne,He]=o.useState(""),[Ae,Pe]=o.useState(""),[Ye,Oe]=o.useState(""),[Fe,Ge]=o.useState("");async function vt(){if(F(!0),z(null),ee)try{const[e,n]=ee.split(":");se(e),oe(n)}catch{}else{const e=On();Le(e);try{const[n,c]=e.split(":");se(n),oe(c)}catch{}}if(ke.length===0){Ee(!0),De(null);try{const e=await Ft({status:"ENROLLED",size:200});gt(e.content)}catch(e){De($(e,"학생 목록을 불러오지 못했습니다."))}finally{Ee(!1)}}}function Ve(e){$e(e),z(null)}function wt(e,n){return!n||!/^\d{2}:\d{2}$/.test(n)?`${e}T00:00:00`:`${e}T${n}:00`}async function yt(){if(!C){z("학생을 선택해 주세요.");return}const e=wt(r,ee);ze(!0),z(null);try{await Ot({studentId:C.id,counselTime:e,content:Me||void 0});const c=((await st({onYmd:r,size:50})).content||[]).map(f=>({id:f.id,studentId:f.studentId,time:f.counselTime.replace("T"," ").slice(11,16),title:(f.content||"").split(/\r?\n/)[0]||"상담",with:f.studentName,owner:"-",done:f.status==="CONVERTED"}));v(c),F(!1),$e(null),Le(""),Be("")}catch(n){z($(n,"상담 추가에 실패했습니다."))}finally{ze(!1)}}return t.jsxs(Ln,{children:[t.jsx(Vt,{label:x,onBack:()=>s(-1),onPrev:()=>s(`/calendar/${y()}`),onNext:()=>s(`/calendar/${p()}`),onToday:()=>s(`/calendar/${m()}`)}),t.jsxs(Mn,{children:[t.jsxs(Bn,{children:[t.jsx(cn,{inProgress:ft,done:xt,onAdd:at,onDelete:ct,onEdit:rt}),t.jsx(Jt,{items:T,onAdd:vt,onDetail:e=>s(`/students/${e}/counsels`)})]}),t.jsxs(In,{children:[t.jsx($t,{items:d,titleMode:"subject",showNotes:!0,onAdd:dt}),it&&t.jsx(le,{onClick:()=>I(!1),children:t.jsxs(ce,{onClick:e=>e.stopPropagation(),children:[t.jsx(de,{children:q==null?"할 일 추가":"할 일 수정"}),t.jsxs("form",{onSubmit:lt,children:[t.jsx(k,{children:"제목"}),t.jsx(ue,{value:O,onChange:e=>J(e.target.value),placeholder:"예: 상담 준비"}),t.jsx(k,{children:"메모 (선택)"}),t.jsx(et,{rows:4,value:Q,onChange:e=>X(e.target.value),placeholder:"세부 내용 또는 참고사항"}),t.jsxs(pe,{children:[t.jsx(ie,{type:"button",onClick:()=>I(!1),children:"취소"}),t.jsx(ae,{type:"submit",children:"저장"})]})]})]})}),ht&&t.jsx(le,{onClick:()=>F(!1),children:t.jsxs(ce,{onClick:e=>e.stopPropagation(),children:[t.jsx(de,{children:"상담 추가"}),t.jsx(k,{children:"학생 선택"}),t.jsx(ue,{placeholder:"학생 검색…",value:G,onChange:e=>mt(e.target.value)}),t.jsxs(Pn,{children:[Te&&t.jsx(fe,{children:"불러오는 중…"}),Z&&t.jsx(V,{children:Z}),!Te&&!Z&&(ke||[]).filter(e=>!G||e.name.toLowerCase().includes(G.toLowerCase())||(e.code||"").toLowerCase().includes(G.toLowerCase())).map(e=>t.jsxs(Yn,{type:"button","data-selected":C?.id===e.id,onClick:()=>Ve(e),onKeyDown:n=>{(n.key==="Enter"||n.key===" ")&&(n.preventDefault(),Ve(e))},children:[t.jsxs("div",{children:[t.jsx("strong",{children:e.name}),t.jsx(N,{style:{marginLeft:8},children:e.code})]}),t.jsx(N,{children:Gt(e.phoneNumber)})]},e.id))]}),t.jsx("div",{style:{marginTop:8},children:C?t.jsxs(Fn,{children:[t.jsx("span",{className:"label",children:"선택된 학생"}),t.jsx("span",{className:"name",children:C.name}),C.code&&t.jsx(N,{style:{marginLeft:6},children:C.code})]}):t.jsx(fe,{children:"학생을 선택해 주세요."})}),t.jsx(k,{style:{marginTop:10},children:"시간"}),t.jsxs(qe,{children:[t.jsx(D,{"aria-label":"시",value:bt,onChange:e=>se(e.target.value),children:te.map(e=>t.jsx("option",{value:e,children:e},e))}),t.jsx("span",{children:":"}),t.jsx(D,{"aria-label":"분",value:jt,onChange:e=>oe(e.target.value),children:ne.map(e=>t.jsx("option",{value:e,children:e},e))})]}),t.jsx(k,{style:{marginTop:10},children:"메모 (선택)"}),t.jsx(et,{rows:3,value:Me,onChange:e=>Be(e.target.value),placeholder:"상담 메모"}),Re&&t.jsx(V,{children:Re}),t.jsxs(pe,{children:[t.jsx(ie,{type:"button",onClick:()=>F(!1),children:"취소"}),t.jsx(ae,{type:"button",disabled:Ie,onClick:yt,children:Ie?"저장 중…":"저장"})]})]})}),b&&t.jsx(le,{onClick:()=>u(!1),children:t.jsxs(ce,{onClick:e=>e.stopPropagation(),children:[t.jsx(de,{children:"수업 추가"}),t.jsx(k,{children:"수업 템플릿 선택"}),t.jsx(ue,{placeholder:"검색어로 필터…",value:E,onChange:e=>w(e.target.value)}),t.jsxs(ot,{children:[xe&&t.jsx(fe,{children:"불러오는 중…"}),_&&t.jsx(V,{children:_}),!xe&&!_&&(P||[]).filter(e=>!E||e.title?.toLowerCase().includes(E.toLowerCase())||e.code?.toLowerCase().includes(E.toLowerCase())).map(e=>t.jsxs(An,{"data-selected":W?.id===e.id,onClick:()=>ut(e),children:[t.jsxs("div",{children:[t.jsx("strong",{children:e.title}),t.jsx(N,{style:{marginLeft:8},children:e.code})]}),t.jsx(N,{children:Qe(e.startTime,e.endTime)})]},e.id))]}),t.jsx(k,{style:{marginTop:10},children:"시간"}),t.jsxs(qe,{children:[t.jsx(D,{"aria-label":"시",value:Ne,onChange:e=>{const n=e.target.value;He(n)},children:te.map(e=>t.jsx("option",{value:e,children:e},e))}),t.jsx("span",{children:":"}),t.jsx(D,{"aria-label":"분",value:Ae,onChange:e=>{const n=e.target.value;Pe(n)},children:ne.map(e=>t.jsx("option",{value:e,children:e},e))}),t.jsx("span",{children:"~"}),t.jsx(D,{"aria-label":"시",value:Ye,onChange:e=>{const n=e.target.value;Oe(n)},children:te.map(e=>t.jsx("option",{value:e,children:e},e))}),t.jsx("span",{children:":"}),t.jsx(D,{"aria-label":"분",value:Fe,onChange:e=>{const n=e.target.value;Ge(n)},children:ne.map(e=>t.jsx("option",{value:e,children:e},e))})]}),ve&&t.jsx(V,{children:ve}),t.jsxs(pe,{children:[t.jsx(ie,{type:"button",onClick:()=>u(!1),children:"취소"}),t.jsx(ae,{type:"button",disabled:be,onClick:pt,children:be?"저장 중…":"저장"})]})]})}),(we||ye)&&t.jsx("div",{style:{color:"#b91c1c",marginTop:8},children:ye||we})]})]})]})}const le=i.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.28);
  display: grid;
  place-items: center;
  z-index: 1200;
`,ce=i.div`
  width: 480px;
  max-width: calc(100% - 32px);
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  box-shadow: 0 8px 28px rgba(2, 6, 23, 0.08);
  padding: 18px;
`,de=i.h3`
  margin: 0 0 10px;
  font-size: 17px;
  font-weight: 700;
  color: #111827;
`,qe=i.div` display:flex; align-items:center; gap:8px; `,ot=i.div` max-height: 220px; overflow: auto; border: 1px solid #f1f5f9; border-radius: 10px; margin-top: 6px; `,An=i.div`
  padding: 8px 10px; display:flex; align-items:center; justify-content:space-between; cursor:pointer;
  border-bottom: 1px solid #f1f5f9;
  &[data-selected='true']{ background:#eef2ff; }
  &:hover{ background:#f9fafb; }
`,Pn=i(ot)``,Yn=i.button`
  width: 100%; text-align: left; background: transparent; border: 0; padding: 8px 10px; display:flex; align-items:center; justify-content:space-between; cursor:pointer;
  border-bottom: 1px solid #f1f5f9;
  &[data-selected='true']{ background:#eef2ff; }
  &:hover{ background:#f9fafb; }
`,V=i.div` color:#b91c1c; font-size:12px; margin-top:6px; `;function Je(s){if(!s)return"--:--";try{const l=String(s).match(/(\d{2}):(\d{2})/);return l?`${l[1]}:${l[2]}`:"--:--"}catch{return"--:--"}}function Qe(s,a){return`${Je(s)} ~ ${Je(a)}`}function Xe(s){if(!s)return"";try{const l=String(s).match(/(\d{2}):(\d{2})/);return l?`${l[1]}:${l[2]}`:""}catch{return""}}function Ze(s){if(!s)return;const[a,l]=s.split(":");return`${a?.padStart(2,"0")}:${l?.padStart(2,"0")}:00`}function On(){const s=new Date;let a=s.getHours(),l=s.getMinutes();const r=Math.round(l/5)*5;return r===60?(a=(a+1)%24,l=0):l=r,`${String(a).padStart(2,"0")}:${String(l).padStart(2,"0")}`}const k=i.label`
  display: block;
  margin: 8px 0 6px;
  font-size: 12px;
  color: #6b7280;
`,ue=i.input`
  width: 100%;
  height: 40px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 12px;
`,D=i.select`
  width: 100%;
  height: 40px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 8px;
  background: #fff;
`,et=i.textarea`
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 8px 12px;
  resize: vertical;
`,pe=i.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
`,N=i.span` color:#9ca3af; font-size:12px; `,fe=i.div` color:#6b7280; font-size:12px; `,Fn=i.div`
  display: inline-flex; align-items: center; gap: 8px; padding: 6px 10px; border:1px solid #c7d2fe; background:#eef2ff; color:#1f2937; border-radius: 8px; font-size: 13px;
  .label { color:#4f46e5; font-weight: 800; }
  .name { font-weight: 800; }
`;function $(s,a){return typeof s=="string"?s:s&&typeof s=="object"&&"message"in s&&typeof s.message=="string"&&s.message||a}export{Zn as default};
