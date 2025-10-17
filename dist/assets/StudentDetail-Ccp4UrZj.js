import{u as xn,a as pn,r as s,b as fn,j as e,d as n,m as hn}from"./index-Bf8ggjEf.js";import{S as se}from"./SelectBox-5KPS12av.js";import{l as gn,G as Ce,f as re,d as ke,T as xt,e as $t}from"./UI-27qTHgPb.js";import{B as mn}from"./BackButton-DhSxc3o1.js";import{C as jn}from"./ConfirmDialog-DKQj8lN5.js";import{M as bn,l as yn,a as vn}from"./exams-DToHRdUQ.js";import{d as wn,l as ie,a as Sn,c as Cn,u as kn}from"./counsels-deuQUhQC.js";import{g as En,b as Mn,c as $n}from"./students-XVseebBQ.js";import{b as pt,d as Dn}from"./format-Do6vjlY3.js";import{u as Nn}from"./useConfirmDialog-bDFFuRPy.js";import{r as S}from"./errors-C6OcbAl5.js";function In(l){return`grades:${l}`}function zn(l){try{const d=localStorage.getItem(In(l));if(!d)return[];const c=JSON.parse(d);return Array.isArray(c)?c:[]}catch{return[]}}function Us(){const l=xn(),{id:d,tab:c}=pn(),r=s.useMemo(()=>Number(d),[d]),[o,E]=s.useState(null),[m,h]=s.useState(!1),[M,Y]=s.useState(null),[T,De]=s.useState(""),[Ne,Ie]=s.useState(!1),[ze,_]=s.useState(!1),[Le,ce]=s.useState(""),[$,ue]=s.useState([]),[Te,Ae]=s.useState(""),[K,xe]=s.useState(null),[Ge,U]=s.useState(""),[A,Dt]=s.useState([]),[Nt,Re]=s.useState(!1),[Fe,Oe]=s.useState(null),[Be,W]=s.useState([]),[It,Pe]=s.useState(!1),[q,v]=s.useState(null),[He,Ye]=s.useState(!1),[D,_e]=s.useState(!1),[J,Ke]=s.useState(()=>{const t=new Date;return`${t.getFullYear()}-${g(t.getMonth()+1)}-${g(t.getDate())}`}),[V,pe]=s.useState(""),[Q,fe]=s.useState(""),[Ue,he]=s.useState(""),[X,We]=s.useState(!1),ge=s.useRef(null),[zt,me]=s.useState(null),[je,be]=s.useState(null),[qe,Je]=s.useState(!1),[Z,G]=s.useState(""),[ee,R]=s.useState(""),[te,F]=s.useState(""),[Ve,ne]=s.useState(""),[Lt,Qe]=s.useState(!1),{error:ye,success:Tt}=fn(),{confirm:Xe,dialog:At}=Nn({confirmLabel:"삭제",cancelLabel:"취소",tone:"danger"}),[ws,Gt]=s.useState([]),[Ze,et]=s.useState([]),[Rt,tt]=s.useState(!1),[nt,st]=s.useState(null),[rt,Ss]=s.useState(!1),[Cs,ks]=s.useState(!1),[Es,Ms]=s.useState(null),[$s,Ft]=s.useState(""),[Ds,Ot]=s.useState(""),[Ns,Bt]=s.useState(""),[it,Pt]=s.useState("percent"),[Ht,at]=s.useState(""),[Yt,ot]=s.useState("100"),[_t,lt]=s.useState(""),[Is,Kt]=s.useState(""),[zs,Ut]=s.useState("");s.useEffect(()=>{it==="percent"?_t&&lt(""):(Ht&&at(""),Yt&&ot(""))},[it]);const Wt=s.useMemo(()=>{if(!o?.birthDate)return;const[t,a,i]=o.birthDate.split("-").map(Number);if(!t||!a||!i)return;const u=new Date;let j=u.getFullYear()-t;const p=u.getMonth()+1,Se=u.getDate();return(p<a||p===a&&Se<i)&&(j-=1),j},[o?.birthDate]),x=s.useMemo(()=>{switch(c){case"courses":case"attendance":case"counsels":case"grades":return c;default:return"courses"}},[c]);function qt(t){switch(t){case"IN_PROGRESS":return"진행중";case"PENDING":return"대기";case"STOPPED":return"중단";default:return t}}s.useEffect(()=>{if(!r||Number.isNaN(r))return;let t=!1;async function a(){h(!0),Y(null);try{const i=await En(r);t||E(i)}catch(i){t||Y(S(i,"원생 정보를 불러오지 못했습니다."))}finally{t||h(!1)}}return a(),()=>{t=!0}},[r]),s.useEffect(()=>{if(!r||x!=="counsels")return;let t=!1;async function a(){Pe(!0),v(null);try{const i=await ie({studentId:r,size:100});t||W(i.content||[])}catch(i){t||v(S(i,"상담 기록을 불러오지 못했습니다."))}finally{t||Pe(!1)}}return a(),()=>{t=!0}},[r,x]),s.useEffect(()=>{!r||Number.isNaN(r)||Gt(zn(r))},[r]);async function Jt(){if(!r)return;const t=o?.courses||[];if(!t.length){et([]);return}tt(!0),st(null);try{const i=(await Promise.all(t.map(async p=>(await yn(p.id)).map(w=>({courseId:p.id,courseTitle:p.title,exam:w}))))).flat(),j=(await Promise.all(i.map(async({courseId:p,courseTitle:Se,exam:w})=>{const O=(await vn(p,w.id)).find(un=>un.studentId===r);if(!O)return null;const cn=w.examDate||(w.createdAt?w.createdAt.slice(0,10):"");return{id:`exam:${p}:${w.id}:${r}`,date:cn,subject:w.title,courseId:p,score:O.score,outOf:O.outOf,level:O.level,note:O.note}}))).filter(p=>!!p);et(j)}catch(a){st(S(a,"시험 성적을 불러오지 못했습니다."))}finally{tt(!1)}}s.useEffect(()=>{!r||x!=="grades"||Jt()},[r,x,o?.courses]);const dt=s.useMemo(()=>Ze.slice().sort((a,i)=>{const u=Date.parse(a.date||""),j=Date.parse(i.date||"");return(isNaN(j)?0:j)-(isNaN(u)?0:u)}),[Ze]);function Vt(){const t=new Date,a=t.getFullYear(),i=String(t.getMonth()+1).padStart(2,"0"),u=String(t.getDate()).padStart(2,"0");Ft(`${a}-${i}-${u}`);const j=o?.courses?.[0]?.id;Ot(j??""),Bt(""),Pt("percent"),at(""),ot("100"),lt(""),Kt(""),Ut("")}s.useEffect(()=>{rt&&Vt()},[rt]);async function Qt(){if(r){Ye(!0);try{const t=await Sn({studentId:r}),a=o?.name||`student_${r}`,i=ds(`${a}_counsels`);ls(t,`${i}.xlsx`)}catch(t){ye(S(t,"상담 기록 엑셀 추출에 실패했습니다."))}finally{Ye(!1)}}}s.useEffect(()=>{if(r)try{const t=localStorage.getItem(`student:notes:${r}`)||"";De(t),ce(t)}catch{}},[r]),s.useEffect(()=>{if(r)try{const t=localStorage.getItem(`student:memos:${r}`),a=t?JSON.parse(t):[];ue(Array.isArray(a)?a:[])}catch{ue([])}},[r]),s.useEffect(()=>{if(!D)return;const t=requestAnimationFrame(()=>{const a=ge.current;if(a){a.focus();const i=a.value.length;try{a.setSelectionRange(i,i)}catch{}}});return()=>cancelAnimationFrame(t)},[D]),s.useEffect(()=>{if(!r||x!=="attendance")return;let t=!1;async function a(){Re(!0),Oe(null);try{const i=await Mn(r,{size:200});t||Dt(i?.content||[])}catch(i){t||Oe(S(i,"출석 정보를 불러오지 못했습니다."))}finally{t||Re(!1)}}return a(),()=>{t=!0}},[r,x]);function Xt(){if(!r)return;const t=(Le||"").trim();De(t),_(!1);try{localStorage.setItem(`student:notes:${r}`,t)}catch{}}function ve(t){ue(t);try{localStorage.setItem(`student:memos:${r}`,JSON.stringify(t))}catch{}}function Zt(){if(!r)return;const t=(Te||"").trim();if(!t)return;const a=new Date().toISOString(),i={id:Date.now(),text:t,createdAt:a};ve([i,...$]),Ae("")}function en(t){const a=$.find(i=>i.id===t);a&&(xe(t),U(a.text))}function tn(){if(K==null)return;const t=(Ge||"").trim(),a=new Date().toISOString(),i=$.map(u=>u.id===K?{...u,text:t,updatedAt:a}:u);ve(i),xe(null),U("")}function nn(){xe(null),U("")}function sn(t){const a=$.filter(i=>i.id!==t);ve(a)}async function rn(t){await Xe({title:"메모를 삭제할까요?",message:"삭제한 메모는 복구할 수 없습니다."})&&sn(t)}async function an(){if(!r)return;const t=o?.name?.trim();if(await Xe({title:"원생을 삭제할까요?",message:t?`'${t}' 원생의 데이터를 삭제합니다. 되돌릴 수 없습니다.`:"선택한 원생의 데이터를 삭제합니다. 되돌릴 수 없습니다."})){Ie(!0);try{await $n(r),Tt("원생을 삭제했습니다."),l("/students")}catch(i){ye(S(i,"원생 삭제에 실패했습니다."))}finally{Ie(!1)}}}const ct=s.useMemo(()=>Array.from({length:24},(t,a)=>String(a).padStart(2,"0")),[]),ut=s.useMemo(()=>["00","05","10","15","20","25","30","35","40","45","50","55"],[]);function on(){_e(!0),v(null),Ke(()=>{const t=new Date;return`${t.getFullYear()}-${g(t.getMonth()+1)}-${g(t.getDate())}`}),pe(""),fe(""),he("")}function we(){_e(!1),pe(""),fe(""),he(""),v(null)}async function ln(){if(!(!r||!J||!V||!Q)){We(!0),v(null);try{const t=`${J}T${V}:${Q}:00`;await Cn({studentId:r,counselTime:t,content:Ue||void 0});const a=await ie({studentId:r,size:100});W(a.content||[]),we()}catch(t){v(S(t,"저장에 실패했습니다."))}finally{We(!1)}}}async function dn(t){if(!(!Z||!ee||!te)){Qe(!0),v(null);try{const a=`${Z}T${ee}:${te}:00`;await kn(t,{counselTime:a,content:Ve||void 0});const i=await ie({studentId:r,size:100});W(i.content||[]),me(null),G(""),R(""),F(""),ne("")}catch(a){v(S(a,"수정에 실패했습니다."))}finally{Qe(!1)}}}return e.jsxs(Ln,{children:[e.jsxs(Tn,{children:[e.jsx(mn,{to:"/students",label:"뒤로"}),e.jsx("h2",{children:"원생 상세"})]}),m&&e.jsxs(ft,{children:[e.jsxs(ht,{children:[e.jsxs(C,{children:[e.jsx(N,{children:"기본 정보"}),e.jsxs(as,{children:[e.jsx(is,{}),e.jsxs("div",{children:[e.jsx(le,{w:140,h:18}),e.jsx(le,{w:120,h:12,mt:6})]}),e.jsx(os,{})]}),e.jsx(L,{}),e.jsx(L,{}),e.jsx(L,{}),e.jsx(L,{})]}),e.jsxs(C,{children:[e.jsx(N,{children:"부모님 정보"}),e.jsx(L,{}),e.jsx(L,{})]})]}),e.jsx(gt,{children:e.jsxs(C,{children:[e.jsx(bt,{children:e.jsxs(yt,{children:[e.jsxs(k,{"data-active":!0,children:["수강수업 ",e.jsx(vt,{children:"0"})]}),e.jsx(k,{children:"출석현황"}),e.jsx(k,{children:"성적"}),e.jsx(k,{children:"상담기록"})]})}),e.jsx(mt,{}),e.jsxs(P,{children:[e.jsx(le,{w:240,h:14}),e.jsx(le,{w:560,h:120,mt:10})]})]})})]}),M&&e.jsx(B,{children:M}),!m&&e.jsxs(ft,{children:[e.jsxs(ht,{children:[e.jsxs(C,{children:[e.jsxs(ae,{children:[e.jsx(N,{children:"기본 정보"}),e.jsxs(Ee,{children:[e.jsx(gn,{to:`/students/${r}/edit`,"data-variant":"edit",children:"수정"}),e.jsx(Ce,{"data-variant":"danger",disabled:Ne,onClick:()=>void an(),children:Ne?"삭제 중...":"삭제"})]})]}),o?e.jsx(e.Fragment,{children:e.jsxs(jt,{children:[e.jsxs(An,{children:[e.jsx(Gn,{children:o.name.slice(0,1)}),e.jsxs("div",{children:[e.jsx(Rn,{children:o.name}),e.jsxs(oe,{children:["코드 ",o.code," · ID ",o.id]})]}),e.jsx(Fn,{"data-type":o.status,children:o.status==="ENROLLED"?"수강중":o.status==="ON_LEAVE"?"휴학":"대기중"})]}),e.jsxs(b,{children:[e.jsx(f,{children:"연락처"}),e.jsx(I,{children:pt(o.phoneNumber)})]}),e.jsxs(b,{children:[e.jsx(f,{children:"생년월일"}),e.jsxs(I,{children:[o.birthDate||"-",o.birthDate?e.jsxs(e.Fragment,{children:[" ",`(만 ${Wt??"-"}세)`]}):null]})]}),e.jsxs(b,{children:[e.jsx(f,{children:"주소"}),e.jsx(I,{children:o.address||"-"})]}),e.jsxs(b,{children:[e.jsx(f,{children:"등록일"}),e.jsx(I,{children:o.joinedDate||o.createdAt?.slice(0,10)||"-"})]})]})}):e.jsx(z,{children:"원생 정보를 찾을 수 없습니다."})]}),e.jsxs(C,{children:[e.jsx(ae,{children:e.jsx(N,{children:"부모님 정보"})}),o?e.jsxs(jt,{children:[e.jsxs(b,{children:[e.jsx(f,{children:"보호자 이름"}),e.jsx(I,{children:o.parentName||"-"})]}),e.jsxs(b,{children:[e.jsx(f,{children:"보호자 연락처"}),e.jsx(I,{children:pt(o.guardianPhone)})]})]}):e.jsx(z,{children:"부모님 정보를 찾을 수 없습니다."})]}),e.jsxs(C,{children:[e.jsxs(ae,{children:[e.jsx(N,{children:"특이사항"}),e.jsx(Ee,{children:ze?e.jsxs(e.Fragment,{children:[e.jsx(y,{type:"button",onClick:()=>{_(!1),ce(T)},children:"취소"}),e.jsx(re,{type:"button",onClick:Xt,children:"저장"})]}):T?e.jsx(Ce,{type:"button",onClick:()=>_(!0),children:"편집"}):e.jsx(ke,{type:"button",onClick:()=>_(!0),children:"메모 추가"})})]}),ze?e.jsx(Vn,{rows:8,value:Le,onChange:t=>ce(t.target.value),placeholder:"예: 과학고 진학 관심, 수학 약점 보완 필요, 알러지 등"}):e.jsx(e.Fragment,{children:T?e.jsx(Jn,{title:T,children:T}):e.jsx(H,{children:"특이사항이 없습니다. 메모를 추가해 주세요."})})]}),e.jsxs(C,{children:[e.jsxs(ae,{children:[e.jsx(N,{children:"메모 사항"}),e.jsx(Ee,{children:e.jsx(ke,{type:"button",onClick:Zt,children:"추가"})})]}),e.jsx(Qn,{children:e.jsx(St,{rows:3,value:Te,onChange:t=>Ae(t.target.value),placeholder:"메모를 입력하세요"})}),e.jsxs(Xn,{children:[$.length===0&&e.jsx(H,{children:"메모가 없습니다. 메모를 추가해 주세요."}),$.map(t=>e.jsxs(Zn,{children:[e.jsxs(es,{children:[e.jsxs(ts,{children:[cs(t.updatedAt||t.createdAt),t.updatedAt?e.jsx("span",{style:{marginLeft:6,color:"#6b7280"},children:"(수정됨)"}):null]}),e.jsx(ns,{children:K===t.id?e.jsxs(e.Fragment,{children:[e.jsx(y,{type:"button",onClick:nn,children:"취소"}),e.jsx(re,{type:"button",onClick:tn,children:"저장"})]}):e.jsxs(e.Fragment,{children:[e.jsx(y,{type:"button",onClick:()=>en(t.id),children:"편집"}),e.jsx(y,{type:"button","data-variant":"danger",onClick:()=>void rn(t.id),children:"삭제"})]})})]}),K===t.id?e.jsx(St,{rows:4,value:Ge,onChange:a=>U(a.target.value)}):e.jsx(ss,{children:t.text})]},t.id))]})]})]}),e.jsx(gt,{children:e.jsxs(C,{children:[e.jsx(bt,{children:e.jsxs(yt,{children:[e.jsxs(k,{"data-active":x==="courses",onClick:()=>l(`/students/${r}/courses`),children:["수강수업 ",e.jsx(vt,{children:o?.courses?.length??0})]}),e.jsx(k,{"data-active":x==="attendance",onClick:()=>l(`/students/${r}/attendance`),children:"출석현황"}),e.jsx(k,{"data-active":x==="grades",onClick:()=>l(`/students/${r}/grades`),children:"성적"}),e.jsx(k,{"data-active":x==="counsels",onClick:()=>l(`/students/${r}/counsels`),children:"상담기록"})]})}),e.jsx(mt,{}),x==="courses"&&e.jsx(P,{children:o?.courses?.length?e.jsx(On,{children:o.courses.map(t=>e.jsxs(Bn,{children:[e.jsxs(Pn,{children:[e.jsx(Hn,{children:t.title}),e.jsx(y,{type:"button",onClick:()=>l(`/classes/${t.id}`),children:"상세"})]}),e.jsxs(Yn,{children:[e.jsx("code",{children:t.code}),e.jsx(_n,{"data-type":t.status,children:qt(t.status)})]})]},t.id))}):e.jsx(H,{children:"수강 중인 수업이 없습니다."})}),x==="attendance"&&e.jsxs(P,{children:[Fe&&e.jsx(B,{children:Fe}),e.jsxs(Kn,{children:[e.jsxs(wt,{children:[e.jsx(Me,{children:"이번 달 출석률"}),e.jsx(Un,{children:us(A)}),e.jsx(oe,{children:xs(A)})]}),e.jsxs(wt,{children:[e.jsx(Me,{children:"최근 결석"}),e.jsx(oe,{children:ps(A)})]})]}),Nt?e.jsx(z,{children:"불러오는 중..."}):e.jsxs(xt,{style:{minWidth:640},children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"날짜"}),e.jsx("th",{children:"과목"}),e.jsx("th",{children:"상태"}),e.jsx("th",{children:"메모"})]})}),e.jsx("tbody",{children:A.length===0?e.jsx("tr",{children:e.jsx("td",{colSpan:4,children:e.jsx(z,{children:"출석 기록이 없습니다."})})}):A.map((t,a)=>e.jsxs("tr",{children:[e.jsx("td",{children:t.date}),e.jsx("td",{children:t.courseTitle}),e.jsx("td",{children:t.present?"출석":"결석"}),e.jsx("td",{children:t.reason||"-"})]},a))})]})]}),x==="grades"&&e.jsxs(P,{children:[e.jsx("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}),nt&&e.jsx(B,{children:nt}),Rt&&e.jsx(z,{children:"시험 성적을 불러오는 중..."}),dt.length===0?e.jsx(H,{children:"등록된 성적이 없습니다."}):e.jsxs(xt,{style:{minWidth:720},children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"시험/과목"}),e.jsx("th",{children:"수업"}),e.jsx("th",{children:"일자"}),e.jsx("th",{children:"성적"})]})}),e.jsx("tbody",{children:dt.map(t=>{const a=(o?.courses||[]).find(u=>u.id===t.courseId)?.title||"-",i=t.level?t.level:t.score!=null?`${t.score}${t.outOf!=null?`/${t.outOf}`:""}`:"-";return e.jsxs("tr",{children:[e.jsx("td",{children:e.jsxs("div",{style:{display:"grid"},children:[e.jsx("strong",{children:t.subject||"성적"}),t.note&&e.jsx(oe,{style:{maxWidth:420,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:t.note})]})}),e.jsx("td",{children:a}),e.jsx("td",{children:t.date}),e.jsx("td",{children:i})]},t.id)})})]})]}),x==="counsels"&&e.jsxs(P,{children:[e.jsxs(hs,{children:[e.jsx("div",{children:e.jsx(Me,{children:"상담기록"})}),e.jsxs("div",{style:{display:"inline-flex",gap:8,alignItems:"center"},children:[e.jsx(y,{type:"button",onClick:Qt,disabled:He,children:He?"엑셀 준비 중...":"엑셀 추출"}),e.jsx(ke,{type:"button",onClick:on,disabled:D,children:"상담 추가"})]})]}),q&&!D&&e.jsx(B,{children:q}),It?e.jsx(z,{children:"불러오는 중..."}):Be.length===0?e.jsx(H,{children:"상담 기록이 없습니다."}):e.jsx(Wn,{children:Be.map(t=>{const a=zt===t.id;return e.jsx(qn,{children:a?e.jsxs(e.Fragment,{children:[e.jsxs(vs,{children:[e.jsxs(b,{children:[e.jsx(f,{children:"상담 일자"}),e.jsx(kt,{type:"date",lang:"ko-KR",value:Z,onChange:i=>G(i.target.value)})]}),e.jsxs(b,{children:[e.jsx(f,{children:"시간"}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8},children:[e.jsx("div",{style:{flex:1},children:e.jsx(se,{ariaLabel:"시",value:ee,onChange:R,placeholder:"시",options:ct.map(i=>({label:i,value:i}))})}),e.jsx("span",{children:":"}),e.jsx("div",{style:{flex:1},children:e.jsx(se,{ariaLabel:"분",value:te,onChange:F,placeholder:"분",options:ut.map(i=>({label:i,value:i}))})})]})]}),e.jsxs(b,{style:{gridColumn:"1 / -1"},children:[e.jsx(f,{children:"내용"}),e.jsx(Et,{rows:4,value:Ve,onChange:i=>ne(i.target.value)})]})]}),e.jsxs(Mt,{children:[e.jsx(y,{type:"button",onClick:()=>{me(null),G(""),R(""),F(""),ne("")},children:"취소"}),e.jsx(re,{type:"button",disabled:Lt||!Z||!ee||!te,onClick:()=>dn(t.id),children:"저장"})]})]}):e.jsxs(e.Fragment,{children:[e.jsxs(js,{children:[e.jsx(bs,{children:fs(t.counselTime)}),e.jsxs(Mt,{children:[e.jsx(y,{type:"button",onClick:()=>{me(t.id);try{const i=new Date(t.counselTime);G(`${i.getFullYear()}-${g(i.getMonth()+1)}-${g(i.getDate())}`),R(g(i.getHours())),F(g(i.getMinutes()))}catch{G(""),R(""),F("")}ne(t.content||"")},children:"편집"}),e.jsx(y,{type:"button","data-variant":"danger",onClick:()=>be(t.id),children:"삭제"})]})]}),e.jsx(ys,{children:(t.content||"").trim()||"내용 없음"})]})},t.id)})})]})]})})]}),At,e.jsx(bn,{open:D,title:"상담 추가",onClose:()=>{X||we()},initialFocusRef:ge,footer:e.jsxs(e.Fragment,{children:[e.jsx(Ce,{type:"button",onClick:we,disabled:X,children:"취소"}),e.jsx(re,{type:"button",onClick:ln,disabled:X||!J||!V||!Q,children:X?"저장 중...":"저장"})]}),children:e.jsxs(gs,{children:[e.jsxs($e,{children:[e.jsx(f,{style:{alignSelf:"auto"},children:"상담 일자"}),e.jsx(kt,{type:"date",lang:"ko-KR",value:J,onChange:t=>Ke(t.target.value)})]}),e.jsxs($e,{children:[e.jsx(f,{style:{alignSelf:"auto"},children:"시간"}),e.jsxs(ms,{children:[e.jsx(Ct,{children:e.jsx(se,{ariaLabel:"시",value:V,onChange:pe,placeholder:"시",options:ct.map(t=>({label:t,value:t}))})}),e.jsx("span",{children:":"}),e.jsx(Ct,{children:e.jsx(se,{ariaLabel:"분",value:Q,onChange:fe,placeholder:"분",options:ut.map(t=>({label:t,value:t}))})})]})]}),e.jsxs($e,{children:[e.jsx(f,{style:{alignSelf:"auto"},children:"내용"}),e.jsx(Et,{ref:ge,rows:4,value:Ue,onChange:t=>he(t.target.value),placeholder:"상담 내용 또는 메모",autoFocus:!0})]}),D&&q&&e.jsx(B,{role:"alert",children:q})]})}),e.jsx(jn,{open:je!=null,title:"상담 일정 삭제",message:"이 상담 일정을 삭제하시겠어요? 되돌릴 수 없습니다.",confirmLabel:"삭제",cancelLabel:"취소",tone:"danger",busy:qe,onCancel:()=>{qe||be(null)},onConfirm:async()=>{if(!(!r||je==null)){Je(!0);try{await wn(je);const t=await ie({studentId:r,size:100});W(t.content||[]),be(null)}catch(t){ye(t?.message||"삭제에 실패했습니다.")}finally{Je(!1)}}}})]})}const Ln=n.div`
  display: grid;
  gap: 14px;
`,Tn=n.div`
  display: flex;
  align-items: center;
  gap: 10px;
  h2 {
    margin: 0;
    font-size: 20px;
    color: #0f172a;
  }
`,ft=n.div`
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 14px;
  align-items: start;
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`,ht=n.aside`
  display: grid;
  gap: 18px;
`,gt=n.section``,C=n.section`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 16px;
  min-width: 0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
`,N=n.h3`
  margin: 0;
  font-size: 16px;
  color: #0f172a;
`,ae=n.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`,Ee=n.div`
  display: inline-flex;
  gap: 12px;
`,mt=n.div`
  height: 1px;
  background: #e5e7eb;
  margin: 6px 0 10px;
`,jt=n.div`
  display: grid;
  gap: 14px;
`,An=n.div`
  display: grid;
  grid-template-columns: 44px 1fr auto;
  gap: 12px;
  align-items: center;
  margin-bottom: 6px;
`,Gn=n.div`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #eef2ff;
  color: #4f46e5;
  display: grid;
  place-items: center;
  font-weight: 800;
`,Rn=n.div`
  font-size: 19px;
  font-weight: 900;
  color: #0f172a;
  letter-spacing: -0.01em;
`,oe=n.div`
  color: #6b7280;
  font-size: 12px;
`,Fn=n.span`
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 800;
  &[data-type="ENROLLED"] {
    background: #dcfce7;
    color: #16a34a;
  }
  &[data-type="ON_LEAVE"] {
    background: #fef3c7;
    color: #b45309;
  }
  &[data-type="PENDING"] {
    background: #f3e8ff;
    color: #7c3aed;
  }
`,b=n.div`
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 8px;
`,f=n.div`
  color: #6b7280;
  font-size: 13px;
  align-self: center;
`,I=n.div`
  color: #111827;
  font-size: 15px;
`,z=n.div`
  color: #6b7280;
  font-size: 13px;
`,B=n.div`
  color: #b91c1c;
  font-size: 12px;
  font-weight: 700;
`,bt=n.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 5;
  padding-top: 2px;
`,yt=n.div`
  display: inline-flex;
  gap: 6px;
  flex-wrap: wrap;
`,k=n($t)`
  height: 40px;
  padding: 0 16px;
  font-size: 14px;
  /* inactive: black text, white background, gray border (from UISmallBtn) */
  &[data-active="true"] {
    background: #f3f4f6; /* gray background */
    color: #111827; /* black text */
    border-color: #e5e7eb; /* gray border */
  }
`,vt=n.span`
  min-width: 18px;
  height: 18px;
  padding: 0 6px;
  border-radius: 9999px;
  background: #e5e7eb;
  color: #374151;
  font-weight: 800;
  font-size: 11px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`,P=n.div`
  display: grid;
  gap: 10px;
`,On=n.div`
  display: grid;
  gap: 8px;
`,Bn=n.div`
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px 12px;
  display: grid;
  gap: 6px;
  background: #fff;
`,Pn=n.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`,Hn=n.div`
  font-weight: 800;
  color: #0f172a;
  font-size: 14px;
`,Yn=n.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #6b7280;
  font-size: 12px;
  code {
    background: #f3f4f6;
    padding: 2px 6px;
    border-radius: 6px;
  }
`,_n=n.span`
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 800;
  &[data-type="IN_PROGRESS"] {
    background: #dcfce7;
    color: #16a34a;
  }
  &[data-type="PENDING"] {
    background: #f3e8ff;
    color: #7c3aed;
  }
  &[data-type="STOPPED"] {
    background: #e5e7eb;
    color: #374151;
  }
`,Kn=n.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
`,wt=n.div`
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px 12px;
  background: #fff;
`,Me=n.div`
  color: #6b7280;
  font-size: 12px;
`,Un=n.div`
  font-size: 22px;
  font-weight: 900;
  color: #0f172a;
  margin-top: 4px;
`,Wn=n.div`
  display: grid;
  gap: 8px;
`,qn=n.div`
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px 12px;
  background: #fff;
  display: grid;
  gap: 4px;
  strong {
    color: #0f172a;
  }
`,H=n.div`
  color: #6b7280;
  font-size: 13px;
  text-align: center;
  border: 1px dashed #e5e7eb;
  border-radius: 10px;
  padding: 16px;
  background: #fafafa;
`;n.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;n.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 9999px;
  font-weight: 800;
  font-size: 12px;
  color: #0f172a;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  &[data-level="CAUTION"] {
    background: #fef3c7;
    color: #b45309;
    border-color: #fcd34d;
  }
  &[data-level="RISK"] {
    background: #fee2e2;
    color: #b91c1c;
    border-color: #fecaca;
  }
  &[data-level="LOW"] {
    background: #dcfce7;
    color: #15803d;
    border-color: #bbf7d0;
  }
`;n.div`
  color: #475569;
  font-size: 12px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;n.i`
  width: 4px;
  height: 4px;
  background: #cbd5e1;
  display: inline-block;
  border-radius: 50%;
`;n.ul`
  margin: 10px 0 0;
  padding-left: 18px;
  color: #334155;
  font-size: 13px;
`;n.ul`
  margin: 10px 0;
  padding-left: 18px;
  color: #111827;
  font-size: 13px;
`;n.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;const y=n($t)`
  height: 40px;
  padding: 0 16px;
  font-size: 14px;
`,Jn=n.pre`
  margin: 0;
  white-space: pre-line;
  color: #111827;
  font-size: 15px;
  line-height: 1.7;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 12px 14px;
  text-wrap: pretty;
`,Vn=n.textarea`
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px 12px;
  resize: vertical;
  font-size: 14px;
  color: #111827;
  min-height: 120px;
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
  }
`,Qn=n.div`
  display: grid;
  gap: 8px;
`,Xn=n.div`
  display: grid;
  gap: 8px;
`,Zn=n.div`
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px 12px;
  background: #fff;
  display: grid;
  gap: 6px;
`,es=n.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`,ts=n.div`
  color: #6b7280;
  font-size: 12px;
`,ns=n.div`
  display: inline-flex;
  gap: 6px;
`,St=n.textarea`
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 8px 10px;
  resize: vertical;
  font-size: 14px;
  color: #111827;
`,ss=n.pre`
  margin: 0;
  white-space: pre-wrap;
  color: #111827;
  font-size: 14px;
`,rs=hn`
  0% { background-position: -200px 0; }
  100% { background-position: 200px 0; }
`,de=n.div`
  background: linear-gradient(90deg, #eef2f7 25%, #f6f8fb 37%, #eef2f7 63%);
  background-size: 400px 100%;
  animation: ${rs} 1.2s ease-in-out infinite;
  border-radius: 8px;
  width: ${({w:l})=>l?`${l}px`:"100%"};
  height: ${({h:l})=>l?`${l}px`:"12px"};
  margin-top: ${({mt:l})=>l?`${l}px`:0};
`,le=de,is=n(de).attrs({w:44,h:44})`
  border-radius: 12px;
`,as=n.div`
  display: grid;
  grid-template-columns: 44px 1fr 80px;
  gap: 10px;
  align-items: center;
  margin-bottom: 8px;
`,os=n(de).attrs({w:80,h:24})``,L=n(de).attrs({h:16,mt:10})``;function ls(l,d){const c=URL.createObjectURL(l),r=document.createElement("a");r.href=c,r.download=d,document.body.appendChild(r),r.click(),r.remove(),URL.revokeObjectURL(c)}function ds(l){const c=(l?l.trim():"export").replace(/[\\/:*?"<>|]+/g,"_");return c.length?c:"export"}function g(l){return String(l).padStart(2,"0")}function cs(l){return Dn(l,{includeWeekday:!0})}function us(l){const d=new Date,c=d.getFullYear(),r=d.getMonth()+1,o=l.filter(h=>{const[M,Y]=h.date.split("-").map(Number);return M===c&&Y===r});if(o.length===0)return"—";const E=o.filter(h=>h.present).length;return`${Math.round(E/o.length*100)}%`}function xs(l){const d=new Date,c=d.getFullYear(),r=d.getMonth()+1,o=l.filter(m=>{const[h,M]=m.date.split("-").map(Number);return h===c&&M===r});return o.length===0?"—":`${o.filter(m=>m.present).length}/${o.length}회 출석`}function ps(l){const d=l.filter(c=>!c.present).slice(0,2).map(c=>c.date);return d.length===0?"없음":d.join(", ")}function fs(l){try{const d=new Date(l),c=["일","월","화","수","목","금","토"][d.getDay()],r=d.getFullYear(),o=d.getMonth()+1,E=d.getDate(),m=g(d.getHours()),h=g(d.getMinutes());return`${r}년 ${o}월 ${E}일 (${c}) ${m}:${h}`}catch{return l}}const hs=n.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`,gs=n.div`
  display: grid;
  gap: 14px;
`,$e=n.div`
  display: grid;
  gap: 6px;
`,ms=n.div`
  display: flex;
  align-items: center;
  gap: 8px;
`,Ct=n.div`
  flex: 1;
  min-width: 0;
`,kt=n.input`
  height: 36px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 10px;
  font-size: 14px;
`,Et=n.textarea`
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 8px 10px;
  font-size: 14px;
  resize: vertical;
`,js=n.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`,Mt=n.div`
  display: inline-flex;
  gap: 12px;
`,bs=n.div`
  font-weight: 900;
  color: #0f172a;
`,ys=n.pre`
  margin: 4px 0 0;
  white-space: pre-wrap;
  color: #111827;
  font-size: 14px;
`,vs=n.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;export{Us as default};
