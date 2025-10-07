const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-DuqOyKVg.js","assets/index-D0ux4l9v.css"])))=>i.map(i=>d[i]);
import{f as Nn,u as Mn,h as Dn,r as s,k as $n,j as e,w as In,G as ue,m as Y,e as xe,T as Ot,g as Ae,_ as Tn,d as n,v as zn}from"./index-DuqOyKVg.js";import{S as I}from"./SelectBox-CYVo06N3.js";import{B as Ln}from"./BackButton-CwJC1z2Q.js";import{C as An}from"./ConfirmDialog-B4qO0ati.js";import{d as On,l as pe,a as Gn,c as Bn,u as Rn}from"./counsels-CRUCTIfJ.js";import{g as Fn,b as Pn,c as _n}from"./students-BqdD7vYY.js";import{l as Hn,a as Yn,c as Un,b as Wn}from"./exams-C7p0s-Gu.js";import{b as Gt,d as Kn}from"./format-Do6vjlY3.js";import{u as Jn}from"./useConfirmDialog-C_qr8el7.js";import{r as b}from"./errors-C6OcbAl5.js";async function Vn(l,d){return await Nn("/api/records/summarize",{method:"POST",body:JSON.stringify({items:l,options:d}),timeoutMs:6e4})}function qn(l){return`grades:${l}`}function Qn(l){try{const d=localStorage.getItem(qn(l));if(!d)return[];const c=JSON.parse(d);return Array.isArray(c)?c:[]}catch{return[]}}function Zs(){const l=Mn(),{id:d,tab:c}=Dn(),r=s.useMemo(()=>Number(d),[d]),[o,N]=s.useState(null),[w,j]=s.useState(!1),[M,J]=s.useState(null),[B,Oe]=s.useState(""),[Ge,Be]=s.useState(!1),[Re,V]=s.useState(!1),[Fe,je]=s.useState(""),[D,be]=s.useState([]),[Pe,_e]=s.useState(""),[q,ye]=s.useState(null),[He,Q]=s.useState(""),[R,Qt]=s.useState([]),[Xt,Ye]=s.useState(!1),[Ue,We]=s.useState(null),[ve,X]=s.useState([]),[Zt,Ke]=s.useState(!1),[Je,$]=s.useState(null),[Ve,qe]=s.useState(!1),[Qe,we]=s.useState(!1),[Se,Xe]=s.useState(()=>{const t=new Date;return`${t.getFullYear()}-${v(t.getMonth()+1)}-${v(t.getDate())}`}),[Z,ee]=s.useState(""),[te,ne]=s.useState(""),[Ze,Ce]=s.useState(""),[en,et]=s.useState(!1),[tn,ke]=s.useState(null),[Ee,Ne]=s.useState(null),[tt,nt]=s.useState(!1),[se,F]=s.useState(""),[re,P]=s.useState(""),[ie,_]=s.useState(""),[st,ae]=s.useState(""),[nn,rt]=s.useState(!1),{error:Me,success:it}=$n(),{confirm:at,dialog:sn}=Jn({confirmLabel:"삭제",cancelLabel:"취소",tone:"danger"}),[De,rn]=s.useState(""),[ot,lt]=s.useState(!1),[dt,$e]=s.useState(null),[Rs,an]=s.useState([]),[ct,ut]=s.useState([]),[on,xt]=s.useState(!1),[pt,ht]=s.useState(null),[oe,le]=s.useState(!1),[ft,gt]=s.useState(!1),[mt,S]=s.useState(null),[Ie,jt]=s.useState(""),[de,bt]=s.useState(""),[yt,vt]=s.useState(""),[ce,wt]=s.useState("percent"),[St,Ct]=s.useState(""),[kt,Et]=s.useState("100"),[Nt,Mt]=s.useState(""),[Dt,$t]=s.useState(""),[Fs,ln]=s.useState(""),dn=s.useMemo(()=>{if(!o?.birthDate)return;const[t,a,i]=o.birthDate.split("-").map(Number);if(!t||!a||!i)return;const p=new Date;let g=p.getFullYear()-t;const u=p.getMonth()+1,C=p.getDate();return(u<a||u===a&&C<i)&&(g-=1),g},[o?.birthDate]),h=s.useMemo(()=>{switch(c){case"courses":case"attendance":case"counsels":case"grades":return c;default:return"courses"}},[c]);function cn(t){switch(t){case"IN_PROGRESS":return"진행중";case"PENDING":return"대기";case"STOPPED":return"중단";default:return t}}s.useEffect(()=>{if(!r||Number.isNaN(r))return;let t=!1;async function a(){j(!0),J(null);try{const i=await Fn(r);t||N(i)}catch(i){t||J(b(i,"원생 정보를 불러오지 못했습니다."))}finally{t||j(!1)}}return a(),()=>{t=!0}},[r]),s.useEffect(()=>{if(!r||h!=="counsels")return;let t=!1;async function a(){Ke(!0),$(null);try{const i=await pe({studentId:r,size:100});t||X(i.content||[])}catch(i){t||$(b(i,"상담 기록을 불러오지 못했습니다."))}finally{t||Ke(!1)}}return a(),()=>{t=!0}},[r,h]),s.useEffect(()=>{!r||Number.isNaN(r)||an(Qn(r))},[r]);async function It(){if(!r)return;const t=o?.courses||[];if(!t.length){ut([]);return}xt(!0),ht(null);try{const i=(await Promise.all(t.map(async u=>(await Hn(u.id)).map(f=>({courseId:u.id,courseTitle:u.title,exam:f}))))).flat(),g=(await Promise.all(i.map(async({courseId:u,courseTitle:C,exam:f})=>{const H=(await Yn(u,f.id)).find(En=>En.studentId===r);if(!H)return null;const kn=f.examDate||(f.createdAt?f.createdAt.slice(0,10):"");return{id:`exam:${u}:${f.id}:${r}`,date:kn,subject:f.title,courseId:u,score:H.score,outOf:H.outOf,level:H.level,note:H.note}}))).filter(u=>!!u);ut(g)}catch(a){ht(b(a,"시험 성적을 불러오지 못했습니다."))}finally{xt(!1)}}s.useEffect(()=>{!r||h!=="grades"||It()},[r,h,o?.courses]);const Tt=s.useMemo(()=>ct.slice().sort((a,i)=>{const p=Date.parse(a.date||""),g=Date.parse(i.date||"");return(isNaN(g)?0:g)-(isNaN(p)?0:p)}),[ct]),un=[{value:"percent",label:"백분율 입력",description:"0~100점 점수로 기록합니다."},{value:"letter",label:"등급 입력",description:"A~F 등급으로 기록합니다."}];function zt(){const t=new Date,a=t.getFullYear(),i=String(t.getMonth()+1).padStart(2,"0"),p=String(t.getDate()).padStart(2,"0");jt(`${a}-${i}-${p}`);const g=o?.courses?.[0]?.id;bt(g??""),vt(""),wt("percent"),Ct(""),Et("100"),Mt(""),$t(""),ln("")}s.useEffect(()=>{oe&&zt()},[oe]);async function xn(){if(!r)return;S(null);const t=typeof de=="number"?de:Number(de);if(!t||Number.isNaN(t)){S("수업을 선택해 주세요.");return}if(!Ie){S("일자를 입력해 주세요.");return}const a=(yt||"").trim();if(!a){S("시험 제목을 입력해 주세요.");return}let i,p,g;if(ce==="percent"){const u=(St||"").trim();if(u){const C=Number(u);if(Number.isNaN(C)){S("점수는 숫자로 입력해 주세요.");return}i=Math.max(0,Math.min(100,Math.round(C)));const f=(kt||"").trim();if(p=f?Number(f):100,Number.isNaN(p)){S("만점은 숫자로 입력해 주세요.");return}}}else g=(Nt||"").trim()||void 0;gt(!0);try{const u=await Un(t,{title:a,examDate:Ie,kind:"TEST",inputMode:ce});await Wn(t,u.id,[{studentId:r,score:i,outOf:p,level:g,note:(Dt||"").trim()||void 0}]);try{(await Tn(async()=>{const{invalidateCacheByPrefix:C}=await import("./index-DuqOyKVg.js").then(f=>f.Q);return{invalidateCacheByPrefix:C}},__vite__mapDeps([0,1]))).invalidateCacheByPrefix(`/api/courses/${t}/exams/${u.id}/results`)}catch{}it("시험 성적을 추가했습니다."),await It(),zt(),le(!1)}catch(u){S(b(u,"시험 성적을 추가하지 못했습니다."))}finally{gt(!1)}}async function pn(){if(r){qe(!0);try{const t=await Gn({studentId:r}),a=o?.name||`student_${r}`,i=Ms(`${a}_counsels`);Ns(t,`${i}.xlsx`)}catch(t){Me(b(t,"상담 기록 엑셀 추출에 실패했습니다."))}finally{qe(!1)}}}async function hn(){if(r)try{lt(!0),$e(null);const t=(ve||[]).slice(0,50).map(i=>({date:(i.counselTime||"").slice(0,10),content:(i.content||"").replace(/\s+/g," ").slice(0,500)}));if(!t.length){$e("요약할 상담 기록이 없습니다.");return}const a=await Vn(t,{language:"ko"});rn(a.summary||"요약이 비어 있습니다.")}catch(t){$e(b(t,"요약 생성에 실패했습니다."))}finally{lt(!1)}}s.useEffect(()=>{if(r)try{const t=localStorage.getItem(`student:notes:${r}`)||"";Oe(t),je(t)}catch{}},[r]),s.useEffect(()=>{if(r)try{const t=localStorage.getItem(`student:memos:${r}`),a=t?JSON.parse(t):[];be(Array.isArray(a)?a:[])}catch{be([])}},[r]),s.useEffect(()=>{if(!r||h!=="attendance")return;let t=!1;async function a(){Ye(!0),We(null);try{const i=await Pn(r,{size:200});t||Qt(i?.content||[])}catch(i){t||We(b(i,"출석 정보를 불러오지 못했습니다."))}finally{t||Ye(!1)}}return a(),()=>{t=!0}},[r,h]);function fn(){if(!r)return;const t=(Fe||"").trim();Oe(t),V(!1);try{localStorage.setItem(`student:notes:${r}`,t)}catch{}}function Te(t){be(t);try{localStorage.setItem(`student:memos:${r}`,JSON.stringify(t))}catch{}}function gn(){if(!r)return;const t=(Pe||"").trim();if(!t)return;const a=new Date().toISOString(),i={id:Date.now(),text:t,createdAt:a};Te([i,...D]),_e("")}function mn(t){const a=D.find(i=>i.id===t);a&&(ye(t),Q(a.text))}function jn(){if(q==null)return;const t=(He||"").trim(),a=new Date().toISOString(),i=D.map(p=>p.id===q?{...p,text:t,updatedAt:a}:p);Te(i),ye(null),Q("")}function bn(){ye(null),Q("")}function yn(t){const a=D.filter(i=>i.id!==t);Te(a)}async function vn(t){await at({title:"메모를 삭제할까요?",message:"삭제한 메모는 복구할 수 없습니다."})&&yn(t)}async function wn(){if(!r)return;const t=o?.name?.trim();if(await at({title:"원생을 삭제할까요?",message:t?`'${t}' 원생의 데이터를 삭제합니다. 되돌릴 수 없습니다.`:"선택한 원생의 데이터를 삭제합니다. 되돌릴 수 없습니다."})){Be(!0);try{await _n(r),it("원생을 삭제했습니다."),l("/students")}catch(i){Me(b(i,"원생 삭제에 실패했습니다."))}finally{Be(!1)}}}const Lt=s.useMemo(()=>Array.from({length:24},(t,a)=>String(a).padStart(2,"0")),[]),At=s.useMemo(()=>["00","05","10","15","20","25","30","35","40","45","50","55"],[]);async function Sn(){if(!(!r||!Se||!Z||!te)){et(!0),$(null);try{const t=`${Se}T${Z}:${te}:00`;await Bn({studentId:r,counselTime:t,content:Ze||void 0});const a=await pe({studentId:r,size:100});X(a.content||[]),we(!1),ee(""),ne(""),Ce("")}catch(t){$(b(t,"저장에 실패했습니다."))}finally{et(!1)}}}async function Cn(t){if(!(!se||!re||!ie)){rt(!0),$(null);try{const a=`${se}T${re}:${ie}:00`;await Rn(t,{counselTime:a,content:st||void 0});const i=await pe({studentId:r,size:100});X(i.content||[]),ke(null),F(""),P(""),_(""),ae("")}catch(a){$(b(a,"수정에 실패했습니다."))}finally{rt(!1)}}}return e.jsxs(Xn,{children:[e.jsxs(Zn,{children:[e.jsx(Ln,{to:"/students",label:"뒤로"}),e.jsx("h2",{children:"원생 상세"})]}),w&&e.jsxs(Bt,{children:[e.jsxs(Rt,{children:[e.jsxs(k,{children:[e.jsx(T,{children:"기본 정보"}),e.jsxs(ks,{children:[e.jsx(Cs,{}),e.jsxs("div",{children:[e.jsx(ge,{w:140,h:18}),e.jsx(ge,{w:120,h:12,mt:6})]}),e.jsx(Es,{})]}),e.jsx(O,{}),e.jsx(O,{}),e.jsx(O,{}),e.jsx(O,{})]}),e.jsxs(k,{children:[e.jsx(T,{children:"부모님 정보"}),e.jsx(O,{}),e.jsx(O,{})]})]}),e.jsxs(Ft,{children:[!1,!1,!1,!1,e.jsxs(k,{children:[e.jsx(Ht,{children:e.jsxs(Yt,{children:[e.jsxs(E,{"data-active":!0,children:["수강수업 ",e.jsx(Ut,{children:"0"})]}),e.jsx(E,{children:"출석현황"}),e.jsx(E,{children:"성적"}),e.jsx(E,{children:"상담기록"})]})}),e.jsx(Pt,{}),e.jsxs(U,{children:[e.jsx(ge,{w:240,h:14}),e.jsx(ge,{w:560,h:120,mt:10})]})]})]})]}),M&&e.jsx(A,{children:M}),!w&&e.jsxs(Bt,{children:[e.jsxs(Rt,{children:[e.jsxs(k,{children:[e.jsxs(he,{children:[e.jsx(T,{children:"기본 정보"}),e.jsxs(ze,{children:[e.jsx(In,{to:`/students/${r}/edit`,"data-variant":"edit",children:"수정"}),e.jsx(ue,{"data-variant":"danger",disabled:Ge,onClick:()=>void wn(),children:Ge?"삭제 중...":"삭제"})]})]}),o?e.jsx(e.Fragment,{children:e.jsxs(_t,{children:[e.jsxs(es,{children:[e.jsx(ts,{children:o.name.slice(0,1)}),e.jsxs("div",{children:[e.jsx(ns,{children:o.name}),e.jsxs(fe,{children:["코드 ",o.code," · ID ",o.id]})]}),e.jsx(ss,{"data-type":o.status,children:o.status==="ENROLLED"?"수강중":o.status==="ON_LEAVE"?"휴학":"대기중"})]}),e.jsxs(m,{children:[e.jsx(x,{children:"연락처"}),e.jsx(z,{children:Gt(o.phoneNumber)})]}),e.jsxs(m,{children:[e.jsx(x,{children:"생년월일"}),e.jsxs(z,{children:[o.birthDate||"-",o.birthDate?e.jsxs(e.Fragment,{children:[" ",`(만 ${dn??"-"}세)`]}):null]})]}),e.jsxs(m,{children:[e.jsx(x,{children:"주소"}),e.jsx(z,{children:o.address||"-"})]}),e.jsxs(m,{children:[e.jsx(x,{children:"등록일"}),e.jsx(z,{children:o.joinedDate||o.createdAt?.slice(0,10)||"-"})]})]})}):e.jsx(L,{children:"원생 정보를 찾을 수 없습니다."})]}),e.jsxs(k,{children:[e.jsx(he,{children:e.jsx(T,{children:"부모님 정보"})}),o?e.jsxs(_t,{children:[e.jsxs(m,{children:[e.jsx(x,{children:"보호자 이름"}),e.jsx(z,{children:o.parentName||"-"})]}),e.jsxs(m,{children:[e.jsx(x,{children:"보호자 연락처"}),e.jsx(z,{children:Gt(o.guardianPhone)})]})]}):e.jsx(L,{children:"부모님 정보를 찾을 수 없습니다."})]}),e.jsxs(k,{children:[e.jsxs(he,{children:[e.jsx(T,{children:"특이사항"}),e.jsx(ze,{children:Re?e.jsxs(e.Fragment,{children:[e.jsx(y,{type:"button",onClick:()=>{V(!1),je(B)},children:"취소"}),e.jsx(Y,{type:"button",onClick:fn,children:"저장"})]}):B?e.jsx(ue,{type:"button",onClick:()=>V(!0),children:"편집"}):e.jsx(xe,{type:"button",onClick:()=>V(!0),children:"메모 추가"})})]}),Re?e.jsx(fs,{rows:8,value:Fe,onChange:t=>je(t.target.value),placeholder:"예: 과학고 진학 관심, 수학 약점 보완 필요, 알러지 등"}):e.jsx(e.Fragment,{children:B?e.jsx(Kt,{title:B,children:B}):e.jsx(K,{children:"특이사항이 없습니다. 메모를 추가해 주세요."})})]}),e.jsxs(k,{children:[e.jsxs(he,{children:[e.jsx(T,{children:"메모 사항"}),e.jsx(ze,{children:e.jsx(xe,{type:"button",onClick:gn,children:"추가"})})]}),e.jsx(gs,{children:e.jsx(Jt,{rows:3,value:Pe,onChange:t=>_e(t.target.value),placeholder:"메모를 입력하세요"})}),e.jsxs(ms,{children:[D.length===0&&e.jsx(K,{children:"메모가 없습니다. 메모를 추가해 주세요."}),D.map(t=>e.jsxs(js,{children:[e.jsxs(bs,{children:[e.jsxs(ys,{children:[Ds(t.updatedAt||t.createdAt),t.updatedAt?e.jsx("span",{style:{marginLeft:6,color:"#6b7280"},children:"(수정됨)"}):null]}),e.jsx(vs,{children:q===t.id?e.jsxs(e.Fragment,{children:[e.jsx(y,{type:"button",onClick:bn,children:"취소"}),e.jsx(Y,{type:"button",onClick:jn,children:"저장"})]}):e.jsxs(e.Fragment,{children:[e.jsx(y,{type:"button",onClick:()=>mn(t.id),children:"편집"}),e.jsx(y,{type:"button","data-variant":"danger",onClick:()=>void vn(t.id),children:"삭제"})]})})]}),q===t.id?e.jsx(Jt,{rows:4,value:He,onChange:a=>Q(a.target.value)}):e.jsx(ws,{children:t.text})]},t.id))]})]})]}),e.jsx(Ft,{children:e.jsxs(k,{children:[e.jsx(Ht,{children:e.jsxs(Yt,{children:[e.jsxs(E,{"data-active":h==="courses",onClick:()=>l(`/students/${r}/courses`),children:["수강수업 ",e.jsx(Ut,{children:o?.courses?.length??0})]}),e.jsx(E,{"data-active":h==="attendance",onClick:()=>l(`/students/${r}/attendance`),children:"출석현황"}),e.jsx(E,{"data-active":h==="grades",onClick:()=>l(`/students/${r}/grades`),children:"성적"}),e.jsx(E,{"data-active":h==="counsels",onClick:()=>l(`/students/${r}/counsels`),children:"상담기록"})]})}),e.jsx(Pt,{}),h==="courses"&&e.jsx(U,{children:o?.courses?.length?e.jsx(rs,{children:o.courses.map(t=>e.jsxs(is,{children:[e.jsxs(as,{children:[e.jsx(os,{children:t.title}),e.jsx(y,{type:"button",onClick:()=>l(`/classes/${t.id}`),children:"상세"})]}),e.jsxs(ls,{children:[e.jsx("code",{children:t.code}),e.jsx(ds,{"data-type":t.status,children:cn(t.status)})]})]},t.id))}):e.jsx(K,{children:"수강 중인 수업이 없습니다."})}),h==="attendance"&&e.jsxs(U,{children:[Ue&&e.jsx(A,{children:Ue}),e.jsxs(cs,{children:[e.jsxs(Wt,{children:[e.jsx(W,{children:"이번 달 출석률"}),e.jsx(us,{children:$s(R)}),e.jsx(fe,{children:Is(R)})]}),e.jsxs(Wt,{children:[e.jsx(W,{children:"최근 결석"}),e.jsx(fe,{children:Ts(R)})]})]}),Xt?e.jsx(L,{children:"불러오는 중..."}):e.jsxs(Ot,{style:{minWidth:640},children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"날짜"}),e.jsx("th",{children:"과목"}),e.jsx("th",{children:"상태"}),e.jsx("th",{children:"메모"})]})}),e.jsx("tbody",{children:R.length===0?e.jsx("tr",{children:e.jsx("td",{colSpan:4,children:e.jsx(L,{children:"출석 기록이 없습니다."})})}):R.map((t,a)=>e.jsxs("tr",{children:[e.jsx("td",{children:t.date}),e.jsx("td",{children:t.courseTitle}),e.jsx("td",{children:t.present?"출석":"결석"}),e.jsx("td",{children:t.reason||"-"})]},a))})]})]}),h==="grades"&&e.jsxs(U,{children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8},children:[e.jsx(W,{style:{margin:0},children:"시험/성적"}),oe?e.jsx(Ae,{type:"button",onClick:()=>{le(!1),S(null)},children:"닫기"}):e.jsx(xe,{type:"button",onClick:()=>le(!0),children:"추가"})]}),oe&&e.jsxs("div",{style:{marginBottom:10},children:[mt&&e.jsx(A,{children:mt}),e.jsxs(qt,{children:[e.jsxs("div",{children:[e.jsx(x,{children:"일자"}),e.jsx(G,{type:"date",value:Ie,onChange:t=>jt(t.currentTarget.value)})]}),e.jsxs("div",{children:[e.jsx(x,{children:"수업"}),e.jsx(I,{value:String(de||""),onChange:t=>bt(t?Number(t):""),options:(o?.courses||[]).map(t=>({value:String(t.id),label:t.title})),placeholder:"수업 선택"})]}),e.jsxs("div",{children:[e.jsx(x,{children:"시험 제목"}),e.jsx(G,{placeholder:"예: 중간고사 수학",value:yt,onChange:t=>vt(t.currentTarget.value)})]}),e.jsxs("div",{style:{gridColumn:"1 / -1"},children:[e.jsx(x,{children:"입력 방식"}),e.jsx("div",{style:{display:"inline-flex",gap:8,marginLeft:8},children:un.map(t=>e.jsxs("label",{style:{display:"inline-flex",alignItems:"center",gap:6,cursor:"pointer"},children:[e.jsx("input",{type:"radio",name:"gMode",checked:ce===t.value,onChange:()=>wt(t.value)}),e.jsx("span",{children:t.label})]},t.value))})]}),ce==="percent"?e.jsxs(e.Fragment,{children:[e.jsxs("div",{children:[e.jsx(x,{children:"점수"}),e.jsx(G,{type:"number",inputMode:"numeric",pattern:"[0-9]*",placeholder:"예: 87",value:St,onChange:t=>Ct(t.currentTarget.value)})]}),e.jsxs("div",{children:[e.jsx(x,{children:"만점"}),e.jsx(G,{type:"number",inputMode:"numeric",pattern:"[0-9]*",placeholder:"예: 100",value:kt,onChange:t=>Et(t.currentTarget.value)})]})]}):e.jsxs("div",{children:[e.jsx(x,{children:"등급"}),e.jsx(I,{value:Nt,onChange:t=>Mt(t),options:[{value:"",label:"-"}].concat(["A","B","C","D","E","F"].map(t=>({value:t,label:t})))})]}),e.jsxs("div",{children:[e.jsx(x,{children:"메모"}),e.jsx(Le,{rows:3,placeholder:"간단한 메모",value:Dt,onChange:t=>$t(t.currentTarget.value)})]})]}),e.jsxs("div",{style:{display:"flex",gap:8},children:[e.jsx(Y,{type:"button",onClick:()=>void xn(),disabled:ft,children:ft?"저장 중…":"시험 결과 저장"}),e.jsx(ue,{type:"button",onClick:()=>{le(!1),S(null)},children:"취소"})]})]}),pt&&e.jsx(A,{children:pt}),on&&e.jsx(L,{children:"시험 성적을 불러오는 중..."}),Tt.length===0?e.jsx(K,{children:"등록된 성적이 없습니다."}):e.jsxs(Ot,{style:{minWidth:720},children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"시험/과목"}),e.jsx("th",{children:"수업"}),e.jsx("th",{children:"일자"}),e.jsx("th",{children:"성적"})]})}),e.jsx("tbody",{children:Tt.map(t=>{const a=(o?.courses||[]).find(p=>p.id===t.courseId)?.title||"-",i=t.level?t.level:t.score!=null?`${t.score}${t.outOf!=null?`/${t.outOf}`:""}`:"-";return e.jsxs("tr",{children:[e.jsx("td",{children:e.jsxs("div",{style:{display:"grid"},children:[e.jsx("strong",{children:t.subject||"성적"}),t.note&&e.jsx(fe,{style:{maxWidth:420,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:t.note})]})}),e.jsx("td",{children:a}),e.jsx("td",{children:t.date}),e.jsx("td",{children:i})]},t.id)})})]})]}),h==="counsels"&&e.jsxs(U,{children:[dt&&e.jsx(A,{style:{marginBottom:8},children:dt}),!!De&&e.jsxs("div",{style:{display:"grid",gap:8,marginBottom:12},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8},children:[e.jsx(W,{style:{margin:0},children:"상담 AI 요약"}),e.jsx(ue,{type:"button",onClick:()=>{try{navigator.clipboard?.writeText(De)}catch{}},children:"복사"})]}),e.jsx(Kt,{as:"pre",style:{whiteSpace:"pre-wrap"},children:De})]}),e.jsxs(Ls,{children:[e.jsx("div",{children:e.jsx(W,{children:"상담기록"})}),e.jsxs("div",{style:{display:"inline-flex",gap:8,alignItems:"center"},children:[e.jsx(hs,{type:"button",onClick:hn,disabled:ot,children:ot?"AI 요약 중…":"AI 요약"}),Qe?e.jsxs(e.Fragment,{children:[e.jsx(y,{type:"button",onClick:()=>{we(!1),Ce(""),ee(""),ne("")},children:"취소"}),e.jsx(Y,{type:"button",onClick:Sn,disabled:en||!Z||!te,children:"저장"})]}):e.jsxs(e.Fragment,{children:[e.jsx(y,{type:"button",onClick:pn,disabled:Ve,children:Ve?"엑셀 준비 중...":"엑셀 추출"}),e.jsx(xe,{type:"button",onClick:()=>{we(!0),Xe(()=>{const t=new Date;return`${t.getFullYear()}-${v(t.getMonth()+1)}-${v(t.getDate())}`}),ee(""),ne("")},children:"상담 추가"})]})]})]}),Je&&e.jsx(A,{children:Je}),Qe&&e.jsxs(As,{children:[e.jsxs(m,{children:[e.jsx(x,{children:"상담 일자"}),e.jsx(G,{type:"date",lang:"ko-KR",value:Se,onChange:t=>Xe(t.target.value)})]}),e.jsxs(m,{children:[e.jsx(x,{children:"시간"}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8},children:[e.jsx("div",{style:{flex:1},children:e.jsx(I,{ariaLabel:"시",value:Z,onChange:ee,placeholder:"시",options:Lt.map(t=>({label:t,value:t}))})}),e.jsx("span",{children:":"}),e.jsx("div",{style:{flex:1},children:e.jsx(I,{ariaLabel:"분",value:te,onChange:ne,placeholder:"분",options:At.map(t=>({label:t,value:t}))})})]})]}),e.jsxs(m,{style:{gridColumn:"1 / -1"},children:[e.jsx(x,{children:"내용"}),e.jsx(Le,{rows:4,value:Ze,onChange:t=>Ce(t.target.value),placeholder:"상담 내용 또는 메모"})]})]}),Zt?e.jsx(L,{children:"불러오는 중..."}):ve.length===0?e.jsx(K,{children:"상담 기록이 없습니다."}):e.jsx(xs,{children:ve.map(t=>{const a=tn===t.id;return e.jsx(ps,{children:a?e.jsxs(e.Fragment,{children:[e.jsxs(qt,{children:[e.jsxs(m,{children:[e.jsx(x,{children:"상담 일자"}),e.jsx(G,{type:"date",lang:"ko-KR",value:se,onChange:i=>F(i.target.value)})]}),e.jsxs(m,{children:[e.jsx(x,{children:"시간"}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8},children:[e.jsx("div",{style:{flex:1},children:e.jsx(I,{ariaLabel:"시",value:re,onChange:P,placeholder:"시",options:Lt.map(i=>({label:i,value:i}))})}),e.jsx("span",{children:":"}),e.jsx("div",{style:{flex:1},children:e.jsx(I,{ariaLabel:"분",value:ie,onChange:_,placeholder:"분",options:At.map(i=>({label:i,value:i}))})})]})]}),e.jsxs(m,{style:{gridColumn:"1 / -1"},children:[e.jsx(x,{children:"내용"}),e.jsx(Le,{rows:4,value:st,onChange:i=>ae(i.target.value)})]})]}),e.jsxs(Vt,{children:[e.jsx(y,{type:"button",onClick:()=>{ke(null),F(""),P(""),_(""),ae("")},children:"취소"}),e.jsx(Y,{type:"button",disabled:nn||!se||!re||!ie,onClick:()=>Cn(t.id),children:"저장"})]})]}):e.jsxs(e.Fragment,{children:[e.jsxs(Os,{children:[e.jsx(Gs,{children:zs(t.counselTime)}),e.jsxs(Vt,{children:[e.jsx(y,{type:"button",onClick:()=>{ke(t.id);try{const i=new Date(t.counselTime);F(`${i.getFullYear()}-${v(i.getMonth()+1)}-${v(i.getDate())}`),P(v(i.getHours())),_(v(i.getMinutes()))}catch{F(""),P(""),_("")}ae(t.content||"")},children:"편집"}),e.jsx(y,{type:"button","data-variant":"danger",onClick:()=>Ne(t.id),children:"삭제"})]})]}),e.jsx(Bs,{children:(t.content||"").trim()||"내용 없음"})]})},t.id)})})]})]})})]}),sn,e.jsx(An,{open:Ee!=null,title:"상담 일정 삭제",message:"이 상담 일정을 삭제하시겠어요? 되돌릴 수 없습니다.",confirmLabel:"삭제",cancelLabel:"취소",tone:"danger",busy:tt,onCancel:()=>{tt||Ne(null)},onConfirm:async()=>{if(!(!r||Ee==null)){nt(!0);try{await On(Ee);const t=await pe({studentId:r,size:100});X(t.content||[]),Ne(null)}catch(t){Me(t?.message||"삭제에 실패했습니다.")}finally{nt(!1)}}}})]})}const Xn=n.div`
  display: grid; gap: 14px;
`,Zn=n.div`
  display: flex; align-items: center; gap: 10px;
  h2 { margin: 0; font-size: 20px; color: #0f172a; }
`,Bt=n.div`
  display: grid; grid-template-columns: 360px 1fr; gap: 14px; align-items: start;
  @media (max-width: 1200px) { grid-template-columns: 1fr; }
`,Rt=n.aside`
  display: grid; gap: 18px;
`,Ft=n.section``,k=n.section`
  background: #fff; border: 1px solid #e5e7eb; border-radius: 14px; padding: 16px; min-width: 0;
  box-shadow: 0 1px 2px rgba(0,0,0,0.03);
`,T=n.h3`
  margin: 0; font-size: 16px; color: #0f172a;
`,he=n.div`
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;
`,ze=n.div`
  display: inline-flex; gap: 12px;
`,Pt=n.div`
  height: 1px; background: #e5e7eb; margin: 6px 0 10px;
`,_t=n.div`
  display: grid; gap: 14px;
`,es=n.div`
  display: grid; grid-template-columns: 44px 1fr auto; gap: 12px; align-items: center; margin-bottom: 6px;
`,ts=n.div`
  width: 44px; height: 44px; border-radius: 12px; background: #eef2ff; color: #4f46e5; display: grid; place-items: center; font-weight: 800;
`,ns=n.div`
  font-size: 19px; font-weight: 900; color: #0f172a; letter-spacing: -0.01em;
`,fe=n.div`
  color: #6b7280; font-size: 12px;
`,ss=n.span`
  padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: 800;
  &[data-type='ENROLLED'] { background:#dcfce7; color:#16a34a; }
  &[data-type='ON_LEAVE'] { background:#fef3c7; color:#b45309; }
  &[data-type='PENDING'] { background:#f3e8ff; color:#7c3aed; }
`,m=n.div`
  display: grid; grid-template-columns: 100px 1fr; gap: 8px;
`,x=n.div`
  color: #6b7280; font-size: 13px; align-self: center;
`,z=n.div`
  color: #111827; font-size: 15px;
`,L=n.div`
  color: #6b7280; font-size: 13px;
`,A=n.div`
  color: #b91c1c; font-size: 12px; font-weight: 700;
`,Ht=n.div`
  display: flex; align-items: center; justify-content: space-between;
  position: sticky; top: 0; background: #fff; z-index: 5; padding-top: 2px;
`,Yt=n.div`
  display: inline-flex; gap: 6px; flex-wrap: wrap;
`,E=n(Ae)`
  height: 40px;
  padding: 0 16px;
  font-size: 14px;
  &[data-active='true'] {
    background:#111827;
    color:#fff;
    border-color:#111827;
  }
`,Ut=n.span`
  min-width: 18px; height: 18px; padding: 0 6px; border-radius: 9999px; background:#e5e7eb; color:#374151; font-weight: 800; font-size: 11px; display: inline-flex; align-items: center; justify-content: center;
`,U=n.div`
  display: grid; gap: 10px;
`,rs=n.div`
  display: grid; gap: 8px;
`,is=n.div`
  border: 1px solid #e5e7eb; border-radius: 10px; padding: 10px 12px; display: grid; gap: 6px; background: #fff;
`,as=n.div`
  display: flex; align-items: center; justify-content: space-between; gap: 8px;
`,os=n.div`
  font-weight: 800; color: #0f172a; font-size: 14px;
`,ls=n.div`
  display: flex; align-items: center; gap: 10px; color: #6b7280; font-size: 12px;
  code { background:#f3f4f6; padding: 2px 6px; border-radius: 6px; }
`,ds=n.span`
  padding: 2px 8px; border-radius: 9999px; font-size: 12px; font-weight: 800;
  &[data-type='IN_PROGRESS'] { background:#dcfce7; color:#16a34a; }
  &[data-type='PENDING'] { background:#f3e8ff; color:#7c3aed; }
  &[data-type='STOPPED'] { background:#e5e7eb; color:#374151; }
`,cs=n.div`
  display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px;
`,Wt=n.div`
  border: 1px solid #e5e7eb; border-radius: 10px; padding: 10px 12px; background: #fff;
`,W=n.div`
  color: #6b7280; font-size: 12px;
`,us=n.div`
  font-size: 22px; font-weight: 900; color: #0f172a; margin-top: 4px;
`,xs=n.div`
  display: grid; gap: 8px;
`,ps=n.div`
  border: 1px solid #e5e7eb; border-radius: 10px; padding: 10px 12px; background: #fff; display: grid; gap: 4px;
  strong { color: #0f172a; }
`,K=n.div`
  color: #6b7280; font-size: 13px; text-align: center; border: 1px dashed #e5e7eb; border-radius: 10px; padding: 16px; background: #fafafa;
`;n.div` display:flex; align-items:center; gap:12px; flex-wrap:wrap; `;n.span`
  display:inline-flex; align-items:center; justify-content:center; gap:6px;
  padding: 4px 10px; border-radius: 9999px; font-weight: 800; font-size: 12px;
  color:#0f172a; background:#f3f4f6; border:1px solid #e5e7eb;
  &[data-level='CAUTION']{ background:#fef3c7; color:#b45309; border-color:#fcd34d; }
  &[data-level='RISK']{ background:#fee2e2; color:#b91c1c; border-color:#fecaca; }
  &[data-level='LOW']{ background:#dcfce7; color:#15803d; border-color:#bbf7d0; }
`;n.div` color:#475569; font-size:12px; display:inline-flex; align-items:center; gap:10px; flex-wrap:wrap; `;n.i` width:4px; height:4px; background:#cbd5e1; display:inline-block; border-radius:50%; `;n.ul` margin:10px 0 0; padding-left: 18px; color:#334155; font-size:13px; `;n.ul` margin:10px 0; padding-left: 18px; color:#111827; font-size:13px; `;n.div` display:flex; gap:8px; flex-wrap:wrap; `;const y=n(Ae)`
  height: 40px;
  padding: 0 16px;
  font-size: 14px;
`,hs=n.button`
  appearance: none;
  height: 40px;
  padding: 0 22px;
  border-radius: 999px;
  border: none;
  background: linear-gradient(135deg, #4f46e5 0%, #ec4899 100%);
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.01em;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.2s ease;
  box-shadow: 0 18px 36px rgba(99, 102, 241, 0.25);
  & > * {
    position: relative;
    z-index: 1;
  }
  &:before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.05) 100%);
    mix-blend-mode: screen;
    opacity: 0.6;
    transition: opacity 0.2s ease;
    pointer-events: none;
  }
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 24px 44px rgba(99, 102, 241, 0.3);
    filter: saturate(1.1);
    &:before { opacity: 0.8; }
  }
  &:active {
    transform: translateY(0);
    box-shadow: 0 12px 26px rgba(79, 70, 229, 0.25);
  }
  &:focus-visible {
    outline: 2px solid rgba(129, 140, 248, 0.7);
    outline-offset: 3px;
  }
  &:disabled {
    opacity: 0.55;
    cursor: progress;
    transform: none;
    box-shadow: 0 10px 24px rgba(99, 102, 241, 0.16);
  }
`,Kt=n.pre`
  margin: 0; white-space: pre-line; color: #111827; font-size: 15px; line-height: 1.7;
  background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 12px 14px; text-wrap: pretty;
`,fs=n.textarea`
  width: 100%; border: 1px solid #e5e7eb; border-radius: 10px; padding: 10px 12px; resize: vertical; font-size: 14px; color: #111827; min-height: 120px;
  &:focus { outline: none; box-shadow: 0 0 0 3px rgba(79,70,229,0.15); }
`,gs=n.div` display:grid; gap:8px; `,ms=n.div` display:grid; gap:8px; `,js=n.div`
  border: 1px solid #e5e7eb; border-radius: 10px; padding: 10px 12px; background: #fff; display: grid; gap: 6px;
`,bs=n.div` display:flex; align-items:center; justify-content:space-between; gap:8px; `,ys=n.div` color:#6b7280; font-size:12px; `,vs=n.div` display:inline-flex; gap:6px; `,Jt=n.textarea`
  width: 100%; border: 1px solid #e5e7eb; border-radius: 10px; padding: 8px 10px; resize: vertical; font-size: 14px; color: #111827;
`,ws=n.pre` margin:0; white-space:pre-wrap; color:#111827; font-size:14px; `,Ss=zn`
  0% { background-position: -200px 0; }
  100% { background-position: 200px 0; }
`,me=n.div`
  background: linear-gradient(90deg, #eef2f7 25%, #f6f8fb 37%, #eef2f7 63%);
  background-size: 400px 100%;
  animation: ${Ss} 1.2s ease-in-out infinite;
  border-radius: 8px;
  width: ${({w:l})=>l?`${l}px`:"100%"};
  height: ${({h:l})=>l?`${l}px`:"12px"};
  margin-top: ${({mt:l})=>l?`${l}px`:0};
`,ge=me,Cs=n(me).attrs({w:44,h:44})`
  border-radius: 12px;
`,ks=n.div`
  display: grid; grid-template-columns: 44px 1fr 80px; gap: 10px; align-items: center; margin-bottom: 8px;
`,Es=n(me).attrs({w:80,h:24})``,O=n(me).attrs({h:16,mt:10})``;function Ns(l,d){const c=URL.createObjectURL(l),r=document.createElement("a");r.href=c,r.download=d,document.body.appendChild(r),r.click(),r.remove(),URL.revokeObjectURL(c)}function Ms(l){const c=(l?l.trim():"export").replace(/[\\/:*?"<>|]+/g,"_");return c.length?c:"export"}function v(l){return String(l).padStart(2,"0")}function Ds(l){return Kn(l,{includeWeekday:!0})}function $s(l){const d=new Date,c=d.getFullYear(),r=d.getMonth()+1,o=l.filter(j=>{const[M,J]=j.date.split("-").map(Number);return M===c&&J===r});if(o.length===0)return"—";const N=o.filter(j=>j.present).length;return`${Math.round(N/o.length*100)}%`}function Is(l){const d=new Date,c=d.getFullYear(),r=d.getMonth()+1,o=l.filter(w=>{const[j,M]=w.date.split("-").map(Number);return j===c&&M===r});return o.length===0?"—":`${o.filter(w=>w.present).length}/${o.length}회 출석`}function Ts(l){const d=l.filter(c=>!c.present).slice(0,2).map(c=>c.date);return d.length===0?"없음":d.join(", ")}function zs(l){try{const d=new Date(l),c=["일","월","화","수","목","금","토"][d.getDay()],r=d.getFullYear(),o=d.getMonth()+1,N=d.getDate(),w=v(d.getHours()),j=v(d.getMinutes());return`${r}년 ${o}월 ${N}일 (${c}) ${w}:${j}`}catch{return l}}const Ls=n.div`
  display: flex; align-items: center; justify-content: space-between; gap: 8px;
`,As=n.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 4px 0 8px;
  @media (max-width: 900px) { grid-template-columns: 1fr; }
`,G=n.input`
  height: 36px; border: 1px solid #e5e7eb; border-radius: 10px; padding: 0 10px; font-size: 14px;
`,Le=n.textarea`
  width: 100%; border: 1px solid #e5e7eb; border-radius: 10px; padding: 8px 10px; font-size: 14px; resize: vertical;
`;n.select`
  height: 36px; border: 1px solid #e5e7eb; border-radius: 10px; padding: 0 8px; font-size: 14px; background:#fff; color:#0f172a;
`;const Os=n.div` display:flex; align-items:center; justify-content:space-between; gap:8px; `,Vt=n.div` display:inline-flex; gap:12px; `,Gs=n.div` font-weight:900; color:#0f172a; `,Bs=n.pre` margin:4px 0 0; white-space:pre-wrap; color:#111827; font-size:14px; `,qt=n.div` display:grid; grid-template-columns: 1fr 1fr; gap:10px; @media(max-width:900px){ grid-template-columns:1fr; }`;export{Zs as default};
