import{j as e,d as c,r as n,i as V,e as ae,u as ie,a as le}from"./index-B0K7mn4q.js";import{S as oe,i as ce,d as de,e as ue}from"./UI-Cj3YhchZ.js";import{B as fe}from"./BackButton-BW37zkWn.js";import{g as pe,h as xe}from"./courses-DlbPyXYO.js";import{l as W,u as q}from"./students-BeT2wLPO.js";import{g as z}from"./errors-C6OcbAl5.js";import{u as he}from"./useConfirmDialog-DCN8mg1d.js";import"./ConfirmDialog-ClQeXE4D.js";const ge={ENROLLED:"수강중",ON_LEAVE:"휴학",PENDING:"대기",WITHDRAWN:"퇴원"};function F(t){return t?ge[t]??t:"-"}function me({title:t,capacity:d,studentSearch:y,onChangeStudentSearch:v,studentOptions:b,studentLoading:p,studentError:g,enrolledStudents:j,enrolledLoading:w,enrolledError:S,addingId:C,removingId:L,onEnroll:E,onUnenroll:B,confirmUnenrollDialog:k,onBack:$,atCapacity:m}){return e.jsxs(ye,{children:[k,e.jsxs(be,{children:[e.jsx(fe,{onClick:$,label:"뒤로"}),e.jsx("h2",{children:"수강생 수정"}),e.jsx(je,{})]}),(g||S)&&e.jsx(we,{children:g||S}),e.jsxs(oe,{children:[e.jsxs(ce,{children:[t||"수업"," - 학생 관리"]}),e.jsxs(Se,{children:[e.jsxs("div",{children:[e.jsxs(O,{children:[e.jsx(U,{children:"학생 검색"}),e.jsx(Ee,{placeholder:"이름/연락처로 검색 (빈칸=전체)",value:y,onChange:r=>v(r.target.value)}),e.jsx(ve,{children:p?"검색 중...":g||`총 ${b.length}명 조회됨`})]}),e.jsxs(O,{children:[e.jsx(U,{children:"검색 결과"}),e.jsxs(J,{children:[b.length===0&&!p?e.jsx(H,{children:"검색 결과가 없습니다."}):null,b.map(r=>{const x=j.some(A=>A.id===r.id),R=x||m;return e.jsxs(K,{children:[e.jsxs("div",{children:[e.jsx("strong",{children:r.name}),e.jsx(Y,{children:r.code}),e.jsx(Z,{"data-type":r.status,children:F(r.status)})]}),e.jsx(Q,{children:x?e.jsx(X,{type:"button",disabled:!0,title:"이미 등록됨",children:"등록됨"}):e.jsx(de,{type:"button",onClick:()=>E(r),disabled:R||C===r.id,title:m?"정원 초과":"추가",children:C===r.id?"추가 중...":"추가"})})]},r.id)})]})]})]}),e.jsx("div",{children:e.jsxs(O,{children:[e.jsxs(U,{children:["등록된 학생 (",j.length,"명",d?` / 정원 ${d}명`:"",")"]}),e.jsxs(J,{children:[w?e.jsx(H,{children:"불러오는 중..."}):null,!w&&j.length===0?e.jsx(H,{children:"아직 등록된 학생이 없습니다."}):null,j.map(r=>e.jsxs(K,{children:[e.jsxs("div",{children:[e.jsx("strong",{children:r.name}),e.jsx(Y,{children:r.code}),e.jsx(Z,{"data-type":r.status,children:F(r.status)})]}),e.jsx(Q,{children:e.jsx(X,{type:"button","data-variant":"danger",onClick:()=>B(r),disabled:L===r.id,children:L===r.id?"해제 중...":"해제"})})]},`en-${r.id}`))]})]})})]})]})]})}const ye=c.div`
  display: grid;
  gap: 12px;
`,be=c.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 12px;
  align-items: center;
`,je=c.div`
  display: inline-flex;
  gap: 8px;
`,Se=c.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`,O=c.div`
  display: grid;
  gap: 6px;
`,U=c.div`
  color: #6b7280;
  font-size: 12px;
  font-weight: 700;
`,Ee=c.input`
  height: 38px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 10px;
  font-size: 14px;
`,ve=c.div`
  color: #6b7280;
  font-size: 12px;
`,J=c.div`
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  min-height: 40px;
  max-height: 420px;
  overflow: auto;
  padding: 6px;
  display: grid;
  gap: 6px;
`,K=c.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 10px;
  border: 1px solid #f1f5f9;
  border-radius: 10px;
`,Q=c.div`
  display: inline-flex;
  gap: 6px;
`,X=c(ue)`
  height: 40px;
  padding: 0 16px;
  font-size: 14px;
  &[data-active='true'] {
    background: #111827;
    color: #fff;
    border-color: #111827;
  }
`,Y=c.span`
  margin-left: 8px;
  color: #9ca3af;
  font-size: 12px;
`,Z=c.span`
  margin-left: 8px;
  padding: 2px 6px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  border: 1px solid #e5e7eb;
  color: #374151;
  background: #f9fafb;

  &[data-type='ENROLLED'] {
    background: #ecfdf5;
    color: #047857;
    border-color: #a7f3d0;
  }
  &[data-type='ON_LEAVE'] {
    background: #fff7ed;
    color: #b45309;
    border-color: #fed7aa;
  }
  &[data-type='PENDING'] {
    background: #f5f3ff;
    color: #6d28d9;
    border-color: #ddd6fe;
  }
`,we=c.div`
  background: #fee2e2;
  color: #b91c1c;
  border: 1px solid #fecaca;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 13px;
`,H=c.div`
  color: #6b7280;
  font-size: 12px;
`;function Ce(t){const[d,y]=n.useState(null),[v,b]=n.useState(""),[p,g]=n.useState(null),[j,w]=n.useState(null),[S,C]=n.useState(""),[L,E]=n.useState([]),[B,k]=n.useState(!1),[$,m]=n.useState(null),[r,x]=n.useState([]),[R,A]=n.useState(!1),[D,T]=n.useState(null),[I,M]=n.useState(null),[ee,G]=n.useState(null),{confirm:_,dialog:te}=he({confirmLabel:"해제",cancelLabel:"취소",tone:"danger"}),P=n.useMemo(()=>p??void 0,[p]);n.useEffect(()=>{if(!t){y(null),b(""),g(null),w(null);return}let s=!1;return(async()=>{try{const i=await pe(t);if(s)return;y(i),b(i.title),g(i.capacity??null)}catch(i){s||w(z(i,"수업 정보를 불러오지 못했습니다."))}})(),()=>{s=!0}},[t]),n.useEffect(()=>{if(!t){x([]),T(null);return}let s=!1;return(async()=>{A(!0),T(null);try{const i=await xe(t);s||x(i)}catch(i){const f=z(i,"");if(f.includes("404"))try{let a=0;const l=100;let o=[];for(;;){const h=await W({page:a,size:l}),{content:N,last:ne}=h;if(o=o.concat(N),ne||N.length===0||a>100)break;a+=1}const u=o.filter(h=>(h.courses||[]).some(N=>N.id===t));s||x(u)}catch(a){s||T(z(a,"등록된 학생 목록을 불러오지 못했습니다."))}else s||T(f||"등록된 학생 목록을 불러오지 못했습니다.")}finally{s||A(!1)}})(),()=>{s=!0}},[t]),n.useEffect(()=>{let s=!1;const i=window.setTimeout(()=>{(async()=>{k(!0),m(null);try{let f=0;const a=100;let l=[];const o=S.trim();for(;;){const u=await W({q:o||void 0,page:f,size:a}),{content:h,last:N}=u;if(l=l.concat(h),N||h.length===0||f>200)break;f+=1}s||E(l)}catch(f){s||m(z(f,"학생 목록을 불러오지 못했습니다."))}finally{s||k(!1)}})()},200);return()=>{s=!0,window.clearTimeout(i)}},[S]);const se=n.useCallback(async s=>{if(t)try{if(P&&r.length>=P){m("정원이 가득 찼습니다.");return}M(s.id);const i=Array.isArray(s.courses)?s.courses.map(a=>a.id):[];if(i.includes(t))return;const f=Array.from(new Set([...i,t]));await q(s.id,{courseIds:f}),V([`/api/courses/${t}`,`/api/courses/${t}/students`,"/api/students","/api/calendar/classes","/api/calendar/classes-range","/api/dashboard/summary"]);try{window.dispatchEvent(new CustomEvent("calendar:classes-refresh",{detail:{}}))}catch{}x(a=>a.some(l=>l.id===s.id)?a:[...a,s]),E(a=>a.map(l=>{if(l.id!==s.id)return l;const o=d?{id:d.id,code:d.code,title:d.title,status:d.status,fee:d.fee??null}:{id:t,code:"",title:v||"",status:"IN_PROGRESS",fee:null},u=l.courses.some(h=>h.id===t);return{...l,courses:u?l.courses:[...l.courses,o]}}))}catch(i){m(z(i,"추가에 실패했습니다."))}finally{M(null)}},[t,P,r.length,d,v]),re=n.useCallback(async s=>{if(!t)return;const i=s.name?.trim()||"선택한";if(await _({title:"수업에서 해제할까요?",message:`${i} 학생을 이 수업에서 해제합니다. 되돌릴 수 없습니다.`}))try{G(s.id);const l=(Array.isArray(s.courses)?s.courses.map(o=>o.id):[]).filter(o=>o!==t);await q(s.id,{courseIds:l}),V([`/api/courses/${t}`,`/api/courses/${t}/students`,"/api/students","/api/calendar/classes","/api/calendar/classes-range","/api/dashboard/summary"]);try{window.dispatchEvent(new CustomEvent("calendar:classes-refresh",{detail:{}}))}catch{}x(o=>o.filter(u=>u.id!==s.id)),E(o=>o.map(u=>u.id===s.id?{...u,courses:u.courses.filter(h=>h.id!==t)}:u))}catch(a){T(z(a,"해제에 실패했습니다."))}finally{G(null)}},[t,_]);return{title:v,courseInfo:d,capacity:p,error:j,studentSearch:S,setStudentSearch:C,studentOptions:L,studentLoading:B,studentError:$,enrolledStudents:r,enrolledLoading:R,enrolledError:D,addingId:I,removingId:ee,onEnroll:se,onUnenroll:re,confirmUnenrollDialog:te}}function Te(){const{id:t}=ae(),d=ie(),y=n.useMemo(()=>{if(!t)return null;const D=Number(t);return Number.isFinite(D)?D:null},[t]),{courseInfo:v,title:b,capacity:p,error:g,studentSearch:j,setStudentSearch:w,studentOptions:S,studentLoading:C,studentError:L,enrolledStudents:E,enrolledLoading:B,enrolledError:k,addingId:$,removingId:m,onEnroll:r,onUnenroll:x,confirmUnenrollDialog:R}=Ce(y),A=p!=null&&E.length>=p;return e.jsx(me,{title:b||v?.title||"수업",capacity:p,studentSearch:j,onChangeStudentSearch:w,studentOptions:S,studentLoading:C,studentError:L||g,enrolledStudents:E,enrolledLoading:B,enrolledError:k,addingId:$,removingId:m,onEnroll:r,onUnenroll:x,confirmUnenrollDialog:R,onBack:()=>d(y?`/classes/${y}`:le.classes),atCapacity:A})}export{Te as default};
