import{j as t,d as i,c as P,r as o,b as st,p as ot,i as Et,u as Dt,e as $t,g as Lt,G as re,h as le,k as Ue}from"./index-DOSOOkBD.js";import{C as Mt}from"./ClassList-DtYNAQ2U.js";import{E as Bt}from"./EmptyPlaceholder-DeD2MjsD.js";import{p as It,s as zt,W as Rt,f as A}from"./dateUtils-CoPTMMCx.js";import{u as Nt,l as Ht,c as At,a as Pt,d as Yt}from"./todos-DZW5c8-r.js";import{l as Ot,c as Ft}from"./courses-DTk-37pS.js";import{l as it,c as Gt}from"./counsels-DawIxkmm.js";import{g as R}from"./calendar-D70WSNxb.js";import{l as Vt}from"./students-BEmDqlWf.js";import{f as _t}from"./format-CD1P4D3U.js";function Wt({label:s,onBack:a,onPrev:l,onNext:r,onToday:x}){return t.jsxs(Ut,{children:[t.jsx(Jt,{type:"button",onClick:a,children:"← 돌아가기"}),t.jsxs(qt,{children:[t.jsx(qe,{onClick:l,"aria-label":"이전 날짜",children:"‹"}),t.jsx(Kt,{children:s}),t.jsx(qe,{onClick:r,"aria-label":"다음 날짜",children:"›"})]}),t.jsx(Qt,{type:"button",onClick:x,children:"오늘"})]})}const Ut=i.div`
  display: flex; align-items: center; justify-content: space-between; gap: 10px;
`,qt=i.div`
  display: flex; align-items: center; gap: 8px;
`,Kt=i.div`
  font-weight: 800; color: #111827;
`,Jt=i.button`
  ${P.outline};
  height: 40px;
  padding: 0 16px;
  font-weight: 600;
`,qe=i.button`
  ${P.outline};
  width: 40px;
  height: 40px;
  padding: 0;
  font-weight: 700;
  font-size: 18px;
`,Qt=i.button`
  ${P.primary};
  height: 40px;
  padding: 0 18px;
  font-weight: 600;
`;function Xt({items:s,onAdd:a,onDetail:l}){return t.jsxs(Zt,{children:[t.jsxs(en,{children:[t.jsxs(tn,{children:[t.jsx(nn,{"aria-hidden":!0,children:dn}),t.jsx("h4",{children:"상담 일정"})]}),t.jsx(sn,{children:a?t.jsx(Ke,{type:"button",onClick:a,children:"+ 상담 추가"}):null})]}),t.jsx(on,{children:s.map((r,x)=>t.jsxs(an,{children:[t.jsxs(rn,{children:[t.jsx("div",{className:"left",children:t.jsx("strong",{children:r.with||"학생"})}),t.jsxs("div",{className:"right",children:[t.jsx(cn,{children:r.time}),l&&r.studentId?t.jsx(Ke,{type:"button",onClick:()=>l(r.studentId,r.id),children:"상세"}):null]})]}),t.jsx(ln,{children:(r.title||"").trim()||"내용 없음"})]},`cs-${x}`))})]})}const Zt=i.section`
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 12px;
  background: #fff;
  display: flex;
  flex-direction: column;
  height: 100%; /* fill half container */
  min-height: 0; /* allow Grid to scroll */
`,en=i.div`
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;
  h4 { margin: 0; font-size: 15px; color: #111827; }
`,tn=i.div`
  display: flex; align-items: center; gap: 8px;
`,nn=i.span`
  width: 28px; height: 28px; border-radius: 8px; display: grid; place-items: center; background: #f3f4f6; color: #4f46e5;
`,sn=i.div``,Ke=i.button`
  ${P.outline};
  height: 40px;
  padding: 0 16px;
  font-size: 14px;
  font-weight: 600;
`,on=i.div`
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
`,an=i.div`
  border: 1px solid #e5e7eb; border-radius: 12px; padding: 12px; background: #fff;
`,rn=i.div`
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;
  .right { display:inline-flex; align-items:center; gap:8px; }
`,ln=i.div` color:#374151; font-size:13px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; `,cn=i.span`
  color: #6b7280; font-size: 12px; font-weight: 700;
`,dn=t.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:t.jsx("path",{d:"M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"})});function un({inProgress:s,done:a,onAdd:l,onToggle:r,onDelete:x,onEdit:j}){const[h,y]=o.useState(s);return o.useEffect(()=>{y(s)},[s]),o.useEffect(()=>{},[a]),t.jsxs(pn,{children:[t.jsxs(fn,{children:[t.jsxs(xn,{children:[t.jsx(hn,{"aria-hidden":!0,children:$n}),t.jsx("h4",{children:"할 일"}),t.jsx(bn,{children:s.length})]}),t.jsx(gn,{children:t.jsx(mn,{type:"button",onClick:l,children:"+ 할일 추가"})})]}),h.length===0?t.jsx(Bt,{title:"오늘 등록된 할 일이 없습니다."}):t.jsx(jn,{children:h.map((p,m)=>t.jsxs(vn,{children:[t.jsxs(wn,{children:[t.jsx(En,{"aria-hidden":!0}),t.jsxs(Dn,{children:[t.jsx(yn,{title:p.title,children:p.title}),p.content&&t.jsx(Cn,{title:p.content,children:p.content})]})]}),t.jsxs(Tn,{children:[typeof p.id=="number"&&t.jsx(Sn,{type:"button",onClick:()=>j?.(p.id),children:"수정"}),typeof p.id=="number"&&t.jsx(kn,{type:"button",onClick:()=>x?.(p.id),children:"삭제"})]})]},`p-${p.id??m}`))})]})}const pn=i.section`
  border: 1px solid #e5e7eb; border-radius: 16px; padding: 12px; background: #fff; display: flex; flex-direction: column;
`,fn=i.div`
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;
  h4 { margin: 0; font-size: 15px; color: #111827; }
`,xn=i.div`
  display: flex; align-items: center; gap: 8px;
`,hn=i.span`
  width: 28px; height: 28px; border-radius: 8px; display: grid; place-items: center; background: #eef2ff; color: #4f46e5;
`,gn=i.div``,mn=i.button`
  ${P.outline};
  height: 40px;
  padding: 0 16px;
  font-size: 14px;
  font-weight: 600;
`,bn=i.span`
  background: #e5e7eb; color: #374151; height: 20px; min-width: 22px; padding: 0 6px; border-radius: 9999px; display: inline-flex; align-items: center; justify-content: center; font-weight: 700; font-size: 12px;
`,jn=i.div`
  display: grid;
  gap: 8px;
  padding: 4px 2px;
  /* 상세 페이지는 내부 스크롤 없이 전체 표시 */
`,vn=i.div`
  display: grid; grid-template-columns: 1fr auto; align-items: flex-start; gap: 10px;
  border: 1px solid #e5e7eb; border-radius: 10px; padding: 10px 12px; background: #fff;
  transition: background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
  &:hover { background: #fafafa; border-color: #e2e8f0; box-shadow: 0 1px 2px rgba(0,0,0,0.04); }
`,wn=i.div`
  display: grid; grid-template-columns: 10px 1fr; gap: 10px; align-items: flex-start; min-width: 0;
`,yn=i.div`
  font-weight: 800; margin-bottom: 2px; font-size: 14px; letter-spacing: -0.01em; color: #0f172a;
  display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;
`,Cn=i.div`
  color: #64748b;
  font-size: 12.5px;
  line-height: 1.5;
  white-space: pre-line;
  display: -webkit-box;
  -webkit-line-clamp: 5; /* 상세 페이지는 5줄 표시 */
  -webkit-box-orient: vertical;
  overflow: hidden;
`,Sn=i(st)`
  height: 40px;
  padding: 0 16px;
  font-size: 14px;
`,kn=i(st)`
  height: 40px;
  padding: 0 16px;
  font-size: 14px;
  border-color: #ef4444;
  color: #ef4444;
  &:hover {
    background: #fee2e2;
    border-color: #dc2626;
  }
`,Tn=i.div`
  display: flex; gap: 6px; align-items: center;
`,En=i.span`
  width: 10px; height: 10px; border-radius: 9999px; background: #4f46e5; margin-top: 5px;
`,Dn=i.div`
  display: flex; flex-direction: column; gap: 2px; min-width: 0;
`,$n=t.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:t.jsx("path",{d:"M20 6L9 17l-5-5"})});function Ln(s){const a=o.useMemo(()=>s?It(s):zt(new Date),[s]),l=`${a.getFullYear()}년 ${a.getMonth()+1}월 ${a.getDate()}일 (${Rt[a.getDay()]})`,{classesForDate:r}=Nt({dates:[[a]]}),x=o.useMemo(()=>r(a),[r,a]),[j,h]=o.useState([]);o.useEffect(()=>{let d=!1;async function g(){try{const T=A(a);try{const Y=`/api/counsels?${new URLSearchParams({onYmd:T,size:String(50)}).toString()}`,O=ot(Y);if(O.data&&!d){const E=(O.data.content||[]).map(w=>({id:w.id,studentId:w.studentId,time:Je(w.counselTime),title:(w.content||"").split(/\r?\n/)[0]||"상담",with:w.studentName,owner:"-",done:w.status==="CONVERTED"}));h(E)}}catch{}const v=await it({onYmd:T,size:50});if(d)return;const b=(v.content||[]).map(u=>({id:u.id,studentId:u.studentId,time:Je(u.counselTime),title:(u.content||"").split(/\r?\n/)[0]||"상담",with:u.studentName,owner:"-",done:u.status==="CONVERTED"}));h(b)}catch{d||h([])}}return g(),()=>{d=!0}},[a]);function y(){const d=new Date(a);return d.setDate(d.getDate()-1),A(d)}function p(){const d=new Date(a);return d.setDate(d.getDate()+1),A(d)}function m(){return A(new Date)}return{date:a,label:l,classes:x,counsels:j,prevYMD:y,nextYMD:p,todayYMD:m}}function Je(s){if(!s)return"--:--";try{return s.replace("T"," ").slice(11,16)}catch{return"--:--"}}function Mn(s){const[a,l]=o.useState(null),[r,x]=o.useState(!1),[j,h]=o.useState(!1),[y,p]=o.useState(null),m=o.useRef(null),d=o.useRef(s),g=o.useCallback(async v=>{m.current&&m.current.abort();const b=new AbortController;m.current=b,p(null),v&&d.current===s?(h(!0),x(!1)):(x(!0),h(!1));try{const u=await Ht(s,void 0,{signal:b.signal});if(d.current!==s)return;l(u)}catch(u){if(u?.name==="AbortError")return;p(u?.message||"Failed to load todos")}finally{d.current===s&&(x(!1),h(!1))}},[s]);o.useEffect(()=>{d.current=s;const v=`/api/todos?dueYmd=${s}`,b=ot(v),u=!!b.data;return u?(l(b.data),x(!1),h(!0)):(l(null),x(!0),h(!1)),g(u),()=>{m.current&&m.current.abort()}},[s,g]);const T=o.useCallback(()=>g(!!a&&d.current===s),[g,a,s]);return{data:a,loading:r,revalidating:j,error:y,refresh:T}}function ce(s){Et(`/api/todos?dueYmd=${s}`)}function Bn({children:s}){return t.jsx(Nn,{children:s})}function In({children:s}){return t.jsx(Hn,{children:s})}function zn({children:s}){return t.jsx(An,{children:s})}function Rn({children:s}){return t.jsx(Pn,{children:s})}const Nn=i.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  height: calc(100vh - 48px); /* account for main content padding */
  overflow: hidden; /* prevent page scroll; use internal scrolls */
`,Hn=i.div`
  display: flex;
  gap: 12px;
  align-items: stretch;
  flex: 1 1 auto;
  min-height: 0; /* allow children to compute internal scroll */
  overflow: hidden;
  @media (max-width: 960px) { flex-direction: column; height: auto; overflow: visible; }
`,An=i.div`
  flex: 1 1 0;
  display: grid;
  grid-template-rows: 1fr 1fr; /* 5:5 (1:1) vertical split */
  gap: 12px;
  height: 100%;
  min-height: 0; /* enable internal scrolls in children */
`,Pn=i.div`
  flex: 1 1 0;
  display: grid;
  gap: 12px;
  align-content: flex-start;
  height: 100%;
  min-height: 0;
  overflow: auto; /* right column can scroll if long */
`;function ts(){const s=Dt(),{ymd:a}=$t(),{warning:l}=Lt(),r=a??A(new Date),{label:x,classes:j,counsels:h,prevYMD:y,nextYMD:p,todayYMD:m}=Ln(r),[d,g]=o.useState([]),[T,v]=o.useState([]),[b,u]=o.useState(!1),[Y,O]=o.useState([]),[E,w]=o.useState(""),[ge,me]=o.useState(!1),[W,be]=o.useState(null),[U,je]=o.useState(null),[ve,we]=o.useState(!1),[ye,L]=o.useState(null);function q(...e){for(const n of e)if(typeof n=="number"&&Number.isFinite(n))return n;return 0}function M(e){return e.map(n=>{const c=n.startTime??n.start_at??n.startAt??n.start??null,f=n.endTime??n.end_at??n.endAt??n.end??null,S=q(n.attPresent,n.presentCount,n.attendancePresent,n?.attendance?.present),kt=q(n.attAbsent,n.absentCount,n.attendanceAbsent,n?.attendance?.absent),Tt=q(n.attUnprocessed);return{subject:n.courseTitle||"수업",time:Ze(c,f),room:"-",teacher:"-",student:"-",done:!1,courseId:n.courseId||void 0,date:n.recordDate||n.date||r,recordId:n.recordId||n.id,notes:n.notes||n.content||n.topic||null,attPresent:S,attAbsent:kt,attUnprocessed:Tt}})}o.useMemo(()=>{},[]),o.useEffect(()=>{let e=!1;async function n(){try{const c=await R(r);if(e)return;g(M(c))}catch{e||g(j)}}return n(),()=>{e=!0}},[r,j]),o.useEffect(()=>{let e=!1;const n=setInterval(async()=>{try{const c=await R(r);if(e)return;g(M(c))}catch{}},15e3);return()=>{e=!0,clearInterval(n)}},[r]),o.useEffect(()=>{v(h)},[h]),o.useEffect(()=>{function e(){document.visibilityState==="visible"&&R(r).then(n=>g(M(n))).catch(()=>{})}return document.addEventListener("visibilitychange",e),()=>document.removeEventListener("visibilitychange",e)},[r]),o.useEffect(()=>{function e(n){const f=n.detail?.ymd;(!f||f===r)&&R(r).then(S=>g(M(S))).catch(()=>{})}return window.addEventListener("calendar:classes-refresh",e),()=>{window.removeEventListener("calendar:classes-refresh",e)}},[r]);const{data:B,error:Ce,refresh:K}=Mn(r),[Se,ke]=o.useState(null),[rt,I]=o.useState(!1),[J,Te]=o.useState(null),[F,Q]=o.useState(""),[X,Z]=o.useState("");async function lt(){Te(null),Q(""),Z(""),I(!0)}function ct(e){const n=(B||[]).find(c=>c.id===e);n&&(Te(e),Q(n.title),Z(n.notes||""),I(!0))}const[G,ee]=o.useState(null);async function dt(e){if(e.preventDefault(),!F.trim()){ee("제목을 입력해 주세요.");return}const n=r;try{if(J==null){const c=await At({title:F.trim(),notes:X||void 0,calendarDate:n});ce(r),await K()}else{const c=await Pt(J,{title:F.trim(),notes:X||void 0});ce(r),await K()}I(!1),ee(null)}catch(c){ke($(c,"저장에 실패했습니다."))}}async function ut(e){try{await Yt(e),ce(r),await K()}catch(n){ke($(n,"삭제에 실패했습니다."))}}async function pt(){if(u(!0),L(null),Y.length===0){me(!0),be(null);try{const e=await Ot({status:"IN_PROGRESS",size:200});O(e.content)}catch(e){be($(e,"수업 목록을 불러오지 못했습니다."))}finally{me(!1)}}}function ft(e){je(e);const n=et(e.startTime)||"00:00",c=et(e.endTime)||"00:00";try{const[f,S]=n.split(":");Pe(f),Oe(S)}catch{}try{const[f,S]=c.split(":");Ge(f),_e(S)}catch{}L(null)}async function xt(){if(!U){l("수업 템플릿을 선택해 주세요.");return}const e=tt(`${(Ae||"00").padStart(2,"0")}:${(Ye||"00").padStart(2,"0")}`),n=tt(`${(Fe||"00").padStart(2,"0")}:${(Ve||"00").padStart(2,"0")}`);we(!0),L(null);try{await Ft(U.id,{recordDate:r,startTime:e,endTime:n}),Ue("/api/calendar/classes"),Ue("/api/calendar/classes-range");const c=await R(r);g(M(c)),u(!1),je(null)}catch(c){$(c,"").includes("HTTP 409")?L("이미 등록된 수업이 있습니다."):L("수업 추가에 실패했습니다.")}finally{we(!1)}}const ht=o.useMemo(()=>(B||[]).filter(e=>e.status!=="DONE").map(e=>({id:e.id,title:e.title,content:e.notes,done:!1})),[B]),gt=o.useMemo(()=>(B||[]).filter(e=>e.status==="DONE").map(e=>({id:e.id,title:e.title,content:e.notes,done:!0})),[B]),[mt,V]=o.useState(!1),[Ee,bt]=o.useState([]),[_,jt]=o.useState(""),[De,$e]=o.useState(!1),[te,Le]=o.useState(null),[C,Me]=o.useState(null),[ne,Be]=o.useState(""),[Ie,ze]=o.useState(""),[Re,Ne]=o.useState(!1),[He,z]=o.useState(null),se=o.useMemo(()=>Array.from({length:24},(e,n)=>String(n).padStart(2,"0")),[]),oe=o.useMemo(()=>["00","05","10","15","20","25","30","35","40","45","50","55"],[]),[vt,ie]=o.useState(""),[wt,ae]=o.useState(""),[Ae,Pe]=o.useState(""),[Ye,Oe]=o.useState(""),[Fe,Ge]=o.useState(""),[Ve,_e]=o.useState("");async function yt(){if(V(!0),z(null),ne)try{const[e,n]=ne.split(":");ie(e),ae(n)}catch{}else{const e=Gn();Be(e);try{const[n,c]=e.split(":");ie(n),ae(c)}catch{}}if(Ee.length===0){$e(!0),Le(null);try{const e=await Vt({status:"ENROLLED",size:200});bt(e.content)}catch(e){Le($(e,"학생 목록을 불러오지 못했습니다."))}finally{$e(!1)}}}function We(e){Me(e),z(null)}function Ct(e,n){return!n||!/^\d{2}:\d{2}$/.test(n)?`${e}T00:00:00`:`${e}T${n}:00`}async function St(){if(!C){z("학생을 선택해 주세요.");return}const e=Ct(r,ne);Ne(!0),z(null);try{await Gt({studentId:C.id,counselTime:e,content:Ie||void 0});const c=((await it({onYmd:r,size:50})).content||[]).map(f=>({id:f.id,studentId:f.studentId,time:f.counselTime.replace("T"," ").slice(11,16),title:(f.content||"").split(/\r?\n/)[0]||"상담",with:f.studentName,owner:"-",done:f.status==="CONVERTED"}));v(c),V(!1),Me(null),Be(""),ze("")}catch(n){z($(n,"상담 추가에 실패했습니다."))}finally{Ne(!1)}}return t.jsxs(Bn,{children:[t.jsx(Wt,{label:x,onBack:()=>s(-1),onPrev:()=>s(`/calendar/${y()}`),onNext:()=>s(`/calendar/${p()}`),onToday:()=>s(`/calendar/${m()}`)}),t.jsxs(In,{children:[t.jsxs(zn,{children:[t.jsx(un,{inProgress:ht,done:gt,onAdd:lt,onDelete:ut,onEdit:ct}),t.jsx(Xt,{items:T,onAdd:yt,onDetail:e=>s(`/students/${e}/counsels`)})]}),t.jsxs(Rn,{children:[t.jsx(Mt,{items:d,titleMode:"subject",showNotes:!0,onAdd:pt}),rt&&t.jsx(de,{onClick:()=>I(!1),children:t.jsxs(ue,{onClick:e=>e.stopPropagation(),children:[t.jsx(pe,{children:J==null?"할 일 추가":"할 일 수정"}),t.jsxs("form",{onSubmit:dt,children:[t.jsxs(k,{children:["제목",t.jsx("span",{children:"*"})]}),t.jsx(fe,{value:F,onChange:e=>{Q(e.target.value),G&&ee(null)},placeholder:"예: 상담 준비","aria-invalid":!!G,required:!0}),G&&t.jsx(N,{children:G}),t.jsx(k,{children:"메모 (선택)"}),t.jsx(nt,{rows:4,value:X,onChange:e=>Z(e.target.value),placeholder:"세부 내용 또는 참고사항"}),t.jsxs(xe,{children:[t.jsx(re,{type:"button",onClick:()=>I(!1),children:"취소"}),t.jsx(le,{type:"submit",children:"저장"})]})]})]})}),mt&&t.jsx(de,{onClick:()=>V(!1),children:t.jsxs(ue,{onClick:e=>e.stopPropagation(),children:[t.jsx(pe,{children:"상담 추가"}),t.jsx(k,{children:"학생 선택"}),t.jsx(fe,{placeholder:"학생 검색…",value:_,onChange:e=>jt(e.target.value)}),t.jsxs(On,{children:[De&&t.jsx(he,{children:"불러오는 중…"}),te&&t.jsx(N,{children:te}),!De&&!te&&(Ee||[]).filter(e=>!_||e.name.toLowerCase().includes(_.toLowerCase())||(e.code||"").toLowerCase().includes(_.toLowerCase())).map(e=>t.jsxs(Fn,{type:"button","data-selected":C?.id===e.id,onClick:()=>We(e),onKeyDown:n=>{(n.key==="Enter"||n.key===" ")&&(n.preventDefault(),We(e))},children:[t.jsxs("div",{children:[t.jsx("strong",{children:e.name}),t.jsx(H,{style:{marginLeft:8},children:e.code})]}),t.jsx(H,{children:_t(e.phoneNumber)})]},e.id))]}),t.jsx("div",{style:{marginTop:8},children:C?t.jsxs(Vn,{children:[t.jsx("span",{className:"label",children:"선택된 학생"}),t.jsx("span",{className:"name",children:C.name}),C.code&&t.jsx(H,{style:{marginLeft:6},children:C.code})]}):t.jsx(he,{children:"학생을 선택해 주세요."})}),t.jsx(k,{style:{marginTop:10},children:"시간"}),t.jsxs(Qe,{children:[t.jsx(D,{"aria-label":"시",value:vt,onChange:e=>ie(e.target.value),children:se.map(e=>t.jsx("option",{value:e,children:e},e))}),t.jsx("span",{children:":"}),t.jsx(D,{"aria-label":"분",value:wt,onChange:e=>ae(e.target.value),children:oe.map(e=>t.jsx("option",{value:e,children:e},e))})]}),t.jsx(k,{style:{marginTop:10},children:"메모 (선택)"}),t.jsx(nt,{rows:3,value:Ie,onChange:e=>ze(e.target.value),placeholder:"상담 메모"}),He&&t.jsx(N,{children:He}),t.jsxs(xe,{children:[t.jsx(re,{type:"button",onClick:()=>V(!1),children:"취소"}),t.jsx(le,{type:"button",disabled:Re,onClick:St,children:Re?"저장 중…":"저장"})]})]})}),b&&t.jsx(de,{onClick:()=>u(!1),children:t.jsxs(ue,{onClick:e=>e.stopPropagation(),children:[t.jsx(pe,{children:"수업 추가"}),t.jsx(k,{children:"수업 템플릿 선택"}),t.jsx(fe,{placeholder:"검색어로 필터…",value:E,onChange:e=>w(e.target.value)}),t.jsxs(at,{children:[ge&&t.jsx(he,{children:"불러오는 중…"}),W&&t.jsx(N,{children:W}),!ge&&!W&&(Y||[]).filter(e=>!E||e.title?.toLowerCase().includes(E.toLowerCase())||e.code?.toLowerCase().includes(E.toLowerCase())).map(e=>t.jsxs(Yn,{"data-selected":U?.id===e.id,onClick:()=>ft(e),children:[t.jsxs("div",{children:[t.jsx("strong",{children:e.title}),t.jsx(H,{style:{marginLeft:8},children:e.code})]}),t.jsx(H,{children:Ze(e.startTime,e.endTime)})]},e.id))]}),t.jsx(k,{style:{marginTop:10},children:"시간"}),t.jsxs(Qe,{children:[t.jsx(D,{"aria-label":"시",value:Ae,onChange:e=>{const n=e.target.value;Pe(n)},children:se.map(e=>t.jsx("option",{value:e,children:e},e))}),t.jsx("span",{children:":"}),t.jsx(D,{"aria-label":"분",value:Ye,onChange:e=>{const n=e.target.value;Oe(n)},children:oe.map(e=>t.jsx("option",{value:e,children:e},e))}),t.jsx("span",{children:"~"}),t.jsx(D,{"aria-label":"시",value:Fe,onChange:e=>{const n=e.target.value;Ge(n)},children:se.map(e=>t.jsx("option",{value:e,children:e},e))}),t.jsx("span",{children:":"}),t.jsx(D,{"aria-label":"분",value:Ve,onChange:e=>{const n=e.target.value;_e(n)},children:oe.map(e=>t.jsx("option",{value:e,children:e},e))})]}),ye&&t.jsx(N,{children:ye}),t.jsxs(xe,{children:[t.jsx(re,{type:"button",onClick:()=>u(!1),children:"취소"}),t.jsx(le,{type:"button",disabled:ve,onClick:xt,children:ve?"저장 중…":"저장"})]})]})}),(Ce||Se)&&t.jsx("div",{style:{color:"#b91c1c",marginTop:8},children:Se||Ce})]})]})]})}const de=i.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.28);
  display: grid;
  place-items: center;
  z-index: 1200;
`,ue=i.div`
  width: 480px;
  max-width: calc(100% - 32px);
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  box-shadow: 0 8px 28px rgba(2, 6, 23, 0.08);
  padding: 18px;
`,pe=i.h3`
  margin: 0 0 10px;
  font-size: 17px;
  font-weight: 700;
  color: #111827;
`,Qe=i.div` display:flex; align-items:center; gap:12px; `,at=i.div` max-height: 220px; overflow: auto; border: 1px solid #f1f5f9; border-radius: 10px; margin-top: 6px; `,Yn=i.div`
  padding: 8px 10px; display:flex; align-items:center; justify-content:space-between; cursor:pointer;
  border-bottom: 1px solid #f1f5f9;
  &[data-selected='true']{ background:#eef2ff; }
  &:hover{ background:#f9fafb; }
`,On=i(at)``,Fn=i.button`
  width: 100%; text-align: left; background: transparent; border: 0; padding: 8px 10px; display:flex; align-items:center; justify-content:space-between; cursor:pointer;
  border-bottom: 1px solid #f1f5f9;
  &[data-selected='true']{ background:#eef2ff; }
  &:hover{ background:#f9fafb; }
`,N=i.div` color:#b91c1c; font-size:12px; margin-top:6px; `;function Xe(s){if(!s)return"--:--";try{const l=String(s).match(/(\d{2}):(\d{2})/);return l?`${l[1]}:${l[2]}`:"--:--"}catch{return"--:--"}}function Ze(s,a){return`${Xe(s)} ~ ${Xe(a)}`}function et(s){if(!s)return"";try{const l=String(s).match(/(\d{2}):(\d{2})/);return l?`${l[1]}:${l[2]}`:""}catch{return""}}function tt(s){if(!s)return;const[a,l]=s.split(":");return`${a?.padStart(2,"0")}:${l?.padStart(2,"0")}:00`}function Gn(){const s=new Date;let a=s.getHours(),l=s.getMinutes();const r=Math.round(l/5)*5;return r===60?(a=(a+1)%24,l=0):l=r,`${String(a).padStart(2,"0")}:${String(l).padStart(2,"0")}`}const k=i.label`
  display: block;
  margin: 8px 0 6px;
  font-size: 12px;
  color: #6b7280;
  span { color: #ef4444; margin-left: 4px; }
`,fe=i.input`
  width: 100%;
  height: 40px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 12px;
  &[aria-invalid='true'] {
    border-color: #ef4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.12);
  }
`,D=i.select`
  width: 100%;
  height: 40px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 8px;
  background: #fff;
`,nt=i.textarea`
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 8px 12px;
  resize: vertical;
`,xe=i.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
`,H=i.span` color:#9ca3af; font-size:12px; `,he=i.div` color:#6b7280; font-size:12px; `,Vn=i.div`
  display: inline-flex; align-items: center; gap: 8px; padding: 6px 10px; border:1px solid #c7d2fe; background:#eef2ff; color:#1f2937; border-radius: 8px; font-size: 13px;
  .label { color:#4f46e5; font-weight: 800; }
  .name { font-weight: 800; }
`;function $(s,a){return typeof s=="string"?s:s&&typeof s=="object"&&"message"in s&&typeof s.message=="string"&&s.message||a}export{ts as default};
