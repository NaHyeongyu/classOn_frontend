import{f as cs,u as us,h as xs,r as n,k as ps,j as e,y as hs,G as Ce,m as te,e as ke,T as dt,d as s,v as fs,g as kt}from"./index-_dJHzZeb.js";import{S as se}from"./SelectBox-D_6osxL0.js";import{B as gs}from"./BackButton-BTVQ3ZEP.js";import{C as ms}from"./ConfirmDialog-B8Hr7OO8.js";import{d as js,l as ne,a as bs,c as ys,u as vs}from"./counsels-D_TRtLOc.js";import{g as ws,b as Ss,c as Cs}from"./students-CxCnADOJ.js";import{l as ks,a as Es}from"./exams-CA-x8jp7.js";import{b as ct,d as Ns}from"./format-Do6vjlY3.js";import{u as $s}from"./useConfirmDialog-BiiGx_ax.js";import{r as v}from"./errors-C6OcbAl5.js";async function Ms(o,d){return await cs("/api/records/summarize",{method:"POST",body:JSON.stringify({items:o,options:d}),timeoutMs:6e4})}function Ds(o){return`grades:${o}`}function Is(o){try{const d=localStorage.getItem(Ds(o));if(!d)return[];const c=JSON.parse(d);return Array.isArray(c)?c:[]}catch{return[]}}function Jn(){const o=us(),{id:d,tab:c}=xs(),r=n.useMemo(()=>Number(d),[d]),[l,k]=n.useState(null),[b,g]=n.useState(!1),[E,H]=n.useState(null),[T,Ne]=n.useState(""),[$e,Me]=n.useState(!1),[De,Y]=n.useState(!1),[Ie,de]=n.useState(""),[N,ce]=n.useState([]),[ze,Te]=n.useState(""),[U,ue]=n.useState(null),[Le,_]=n.useState(""),[L,Et]=n.useState([]),[Nt,Ae]=n.useState(!1),[Oe,Ge]=n.useState(null),[xe,W]=n.useState([]),[$t,Be]=n.useState(!1),[Re,$]=n.useState(null),[Fe,Pe]=n.useState(!1),[He,pe]=n.useState(!1),[he,Ye]=n.useState(()=>{const t=new Date;return`${t.getFullYear()}-${j(t.getMonth()+1)}-${j(t.getDate())}`}),[K,J]=n.useState(""),[V,q]=n.useState(""),[Ue,fe]=n.useState(""),[Mt,_e]=n.useState(!1),[Dt,ge]=n.useState(null),[me,je]=n.useState(null),[We,Ke]=n.useState(!1),[Q,A]=n.useState(""),[X,O]=n.useState(""),[Z,G]=n.useState(""),[Je,ee]=n.useState(""),[It,Ve]=n.useState(!1),{error:be,success:zt}=ps(),{confirm:qe,dialog:Tt}=$s({confirmLabel:"삭제",cancelLabel:"취소",tone:"danger"}),[ye,Lt]=n.useState(""),[Qe,Xe]=n.useState(!1),[Ze,ve]=n.useState(null),[vn,At]=n.useState([]),[et,tt]=n.useState([]),[Ot,st]=n.useState(!1),[nt,rt]=n.useState(null),[it,wn]=n.useState(!1),[Sn,Cn]=n.useState(!1),[kn,En]=n.useState(null),[Nn,Gt]=n.useState(""),[$n,Bt]=n.useState(""),[Mn,Rt]=n.useState(""),[Dn,Ft]=n.useState("percent"),[In,Pt]=n.useState(""),[zn,Ht]=n.useState("100"),[Tn,Yt]=n.useState(""),[Ln,Ut]=n.useState(""),[An,_t]=n.useState(""),Wt=n.useMemo(()=>{if(!l?.birthDate)return;const[t,a,i]=l.birthDate.split("-").map(Number);if(!t||!a||!i)return;const u=new Date;let y=u.getFullYear()-t;const p=u.getMonth()+1,Se=u.getDate();return(p<a||p===a&&Se<i)&&(y-=1),y},[l?.birthDate]),x=n.useMemo(()=>{switch(c){case"courses":case"attendance":case"counsels":case"grades":return c;default:return"courses"}},[c]);function Kt(t){switch(t){case"IN_PROGRESS":return"진행중";case"PENDING":return"대기";case"STOPPED":return"중단";default:return t}}n.useEffect(()=>{if(!r||Number.isNaN(r))return;let t=!1;async function a(){g(!0),H(null);try{const i=await ws(r);t||k(i)}catch(i){t||H(v(i,"원생 정보를 불러오지 못했습니다."))}finally{t||g(!1)}}return a(),()=>{t=!0}},[r]),n.useEffect(()=>{if(!r||x!=="counsels")return;let t=!1;async function a(){Be(!0),$(null);try{const i=await ne({studentId:r,size:100});t||W(i.content||[])}catch(i){t||$(v(i,"상담 기록을 불러오지 못했습니다."))}finally{t||Be(!1)}}return a(),()=>{t=!0}},[r,x]),n.useEffect(()=>{!r||Number.isNaN(r)||At(Is(r))},[r]);async function Jt(){if(!r)return;const t=l?.courses||[];if(!t.length){tt([]);return}st(!0),rt(null);try{const i=(await Promise.all(t.map(async p=>(await ks(p.id)).map(w=>({courseId:p.id,courseTitle:p.title,exam:w}))))).flat(),y=(await Promise.all(i.map(async({courseId:p,courseTitle:Se,exam:w})=>{const B=(await Es(p,w.id)).find(ds=>ds.studentId===r);if(!B)return null;const ls=w.examDate||(w.createdAt?w.createdAt.slice(0,10):"");return{id:`exam:${p}:${w.id}:${r}`,date:ls,subject:w.title,courseId:p,score:B.score,outOf:B.outOf,level:B.level,note:B.note}}))).filter(p=>!!p);tt(y)}catch(a){rt(v(a,"시험 성적을 불러오지 못했습니다."))}finally{st(!1)}}n.useEffect(()=>{!r||x!=="grades"||Jt()},[r,x,l?.courses]);const at=n.useMemo(()=>et.slice().sort((a,i)=>{const u=Date.parse(a.date||""),y=Date.parse(i.date||"");return(isNaN(y)?0:y)-(isNaN(u)?0:u)}),[et]);function Vt(){const t=new Date,a=t.getFullYear(),i=String(t.getMonth()+1).padStart(2,"0"),u=String(t.getDate()).padStart(2,"0");Gt(`${a}-${i}-${u}`);const y=l?.courses?.[0]?.id;Bt(y??""),Rt(""),Ft("percent"),Pt(""),Ht("100"),Yt(""),Ut(""),_t("")}n.useEffect(()=>{it&&Vt()},[it]);async function qt(){if(r){Pe(!0);try{const t=await bs({studentId:r}),a=l?.name||`student_${r}`,i=dn(`${a}_counsels`);ln(t,`${i}.xlsx`)}catch(t){be(v(t,"상담 기록 엑셀 추출에 실패했습니다."))}finally{Pe(!1)}}}async function Qt(){if(r)try{Xe(!0),ve(null);const t=(xe||[]).slice(0,50).map(i=>({date:(i.counselTime||"").slice(0,10),content:(i.content||"").replace(/\s+/g," ").slice(0,500)}));if(!t.length){ve("요약할 상담 기록이 없습니다.");return}const a=await Ms(t,{language:"ko"});Lt(a.summary||"요약이 비어 있습니다.")}catch(t){ve(v(t,"요약 생성에 실패했습니다."))}finally{Xe(!1)}}n.useEffect(()=>{if(r)try{const t=localStorage.getItem(`student:notes:${r}`)||"";Ne(t),de(t)}catch{}},[r]),n.useEffect(()=>{if(r)try{const t=localStorage.getItem(`student:memos:${r}`),a=t?JSON.parse(t):[];ce(Array.isArray(a)?a:[])}catch{ce([])}},[r]),n.useEffect(()=>{if(!r||x!=="attendance")return;let t=!1;async function a(){Ae(!0),Ge(null);try{const i=await Ss(r,{size:200});t||Et(i?.content||[])}catch(i){t||Ge(v(i,"출석 정보를 불러오지 못했습니다."))}finally{t||Ae(!1)}}return a(),()=>{t=!0}},[r,x]);function Xt(){if(!r)return;const t=(Ie||"").trim();Ne(t),Y(!1);try{localStorage.setItem(`student:notes:${r}`,t)}catch{}}function we(t){ce(t);try{localStorage.setItem(`student:memos:${r}`,JSON.stringify(t))}catch{}}function Zt(){if(!r)return;const t=(ze||"").trim();if(!t)return;const a=new Date().toISOString(),i={id:Date.now(),text:t,createdAt:a};we([i,...N]),Te("")}function es(t){const a=N.find(i=>i.id===t);a&&(ue(t),_(a.text))}function ts(){if(U==null)return;const t=(Le||"").trim(),a=new Date().toISOString(),i=N.map(u=>u.id===U?{...u,text:t,updatedAt:a}:u);we(i),ue(null),_("")}function ss(){ue(null),_("")}function ns(t){const a=N.filter(i=>i.id!==t);we(a)}async function rs(t){await qe({title:"메모를 삭제할까요?",message:"삭제한 메모는 복구할 수 없습니다."})&&ns(t)}async function is(){if(!r)return;const t=l?.name?.trim();if(await qe({title:"원생을 삭제할까요?",message:t?`'${t}' 원생의 데이터를 삭제합니다. 되돌릴 수 없습니다.`:"선택한 원생의 데이터를 삭제합니다. 되돌릴 수 없습니다."})){Me(!0);try{await Cs(r),zt("원생을 삭제했습니다."),o("/students")}catch(i){be(v(i,"원생 삭제에 실패했습니다."))}finally{Me(!1)}}}const ot=n.useMemo(()=>Array.from({length:24},(t,a)=>String(a).padStart(2,"0")),[]),lt=n.useMemo(()=>["00","05","10","15","20","25","30","35","40","45","50","55"],[]);async function as(){if(!(!r||!he||!K||!V)){_e(!0),$(null);try{const t=`${he}T${K}:${V}:00`;await ys({studentId:r,counselTime:t,content:Ue||void 0});const a=await ne({studentId:r,size:100});W(a.content||[]),pe(!1),J(""),q(""),fe("")}catch(t){$(v(t,"저장에 실패했습니다."))}finally{_e(!1)}}}async function os(t){if(!(!Q||!X||!Z)){Ve(!0),$(null);try{const a=`${Q}T${X}:${Z}:00`;await vs(t,{counselTime:a,content:Je||void 0});const i=await ne({studentId:r,size:100});W(i.content||[]),ge(null),A(""),O(""),G(""),ee("")}catch(a){$(v(a,"수정에 실패했습니다."))}finally{Ve(!1)}}}return e.jsxs(zs,{children:[e.jsxs(Ts,{children:[e.jsx(gs,{to:"/students",label:"뒤로"}),e.jsx("h2",{children:"원생 상세"})]}),b&&e.jsxs(ut,{children:[e.jsxs(xt,{children:[e.jsxs(S,{children:[e.jsx(M,{children:"기본 정보"}),e.jsxs(an,{children:[e.jsx(rn,{}),e.jsxs("div",{children:[e.jsx(oe,{w:140,h:18}),e.jsx(oe,{w:120,h:12,mt:6})]}),e.jsx(on,{})]}),e.jsx(z,{}),e.jsx(z,{}),e.jsx(z,{}),e.jsx(z,{})]}),e.jsxs(S,{children:[e.jsx(M,{children:"부모님 정보"}),e.jsx(z,{}),e.jsx(z,{})]})]}),e.jsx(pt,{children:e.jsxs(S,{children:[e.jsx(gt,{children:e.jsxs(mt,{children:[e.jsxs(C,{"data-active":!0,children:["수강수업 ",e.jsx(jt,{children:"0"})]}),e.jsx(C,{children:"출석현황"}),e.jsx(C,{children:"성적"}),e.jsx(C,{children:"상담기록"})]})}),e.jsx(ht,{}),e.jsxs(F,{children:[e.jsx(oe,{w:240,h:14}),e.jsx(oe,{w:560,h:120,mt:10})]})]})})]}),E&&e.jsx(R,{children:E}),!b&&e.jsxs(ut,{children:[e.jsxs(xt,{children:[e.jsxs(S,{children:[e.jsxs(re,{children:[e.jsx(M,{children:"기본 정보"}),e.jsxs(Ee,{children:[e.jsx(hs,{to:`/students/${r}/edit`,"data-variant":"edit",children:"수정"}),e.jsx(Ce,{"data-variant":"danger",disabled:$e,onClick:()=>void is(),children:$e?"삭제 중...":"삭제"})]})]}),l?e.jsx(e.Fragment,{children:e.jsxs(ft,{children:[e.jsxs(Ls,{children:[e.jsx(As,{children:l.name.slice(0,1)}),e.jsxs("div",{children:[e.jsx(Os,{children:l.name}),e.jsxs(ie,{children:["코드 ",l.code," · ID ",l.id]})]}),e.jsx(Gs,{"data-type":l.status,children:l.status==="ENROLLED"?"수강중":l.status==="ON_LEAVE"?"휴학":"대기중"})]}),e.jsxs(h,{children:[e.jsx(f,{children:"연락처"}),e.jsx(D,{children:ct(l.phoneNumber)})]}),e.jsxs(h,{children:[e.jsx(f,{children:"생년월일"}),e.jsxs(D,{children:[l.birthDate||"-",l.birthDate?e.jsxs(e.Fragment,{children:[" ",`(만 ${Wt??"-"}세)`]}):null]})]}),e.jsxs(h,{children:[e.jsx(f,{children:"주소"}),e.jsx(D,{children:l.address||"-"})]}),e.jsxs(h,{children:[e.jsx(f,{children:"등록일"}),e.jsx(D,{children:l.joinedDate||l.createdAt?.slice(0,10)||"-"})]})]})}):e.jsx(I,{children:"원생 정보를 찾을 수 없습니다."})]}),e.jsxs(S,{children:[e.jsx(re,{children:e.jsx(M,{children:"부모님 정보"})}),l?e.jsxs(ft,{children:[e.jsxs(h,{children:[e.jsx(f,{children:"보호자 이름"}),e.jsx(D,{children:l.parentName||"-"})]}),e.jsxs(h,{children:[e.jsx(f,{children:"보호자 연락처"}),e.jsx(D,{children:ct(l.guardianPhone)})]})]}):e.jsx(I,{children:"부모님 정보를 찾을 수 없습니다."})]}),e.jsxs(S,{children:[e.jsxs(re,{children:[e.jsx(M,{children:"특이사항"}),e.jsx(Ee,{children:De?e.jsxs(e.Fragment,{children:[e.jsx(m,{type:"button",onClick:()=>{Y(!1),de(T)},children:"취소"}),e.jsx(te,{type:"button",onClick:Xt,children:"저장"})]}):T?e.jsx(Ce,{type:"button",onClick:()=>Y(!0),children:"편집"}):e.jsx(ke,{type:"button",onClick:()=>Y(!0),children:"메모 추가"})})]}),De?e.jsx(Vs,{rows:8,value:Ie,onChange:t=>de(t.target.value),placeholder:"예: 과학고 진학 관심, 수학 약점 보완 필요, 알러지 등"}):e.jsx(e.Fragment,{children:T?e.jsx(yt,{title:T,children:T}):e.jsx(P,{children:"특이사항이 없습니다. 메모를 추가해 주세요."})})]}),e.jsxs(S,{children:[e.jsxs(re,{children:[e.jsx(M,{children:"메모 사항"}),e.jsx(Ee,{children:e.jsx(ke,{type:"button",onClick:Zt,children:"추가"})})]}),e.jsx(qs,{children:e.jsx(vt,{rows:3,value:ze,onChange:t=>Te(t.target.value),placeholder:"메모를 입력하세요"})}),e.jsxs(Qs,{children:[N.length===0&&e.jsx(P,{children:"메모가 없습니다. 메모를 추가해 주세요."}),N.map(t=>e.jsxs(Xs,{children:[e.jsxs(Zs,{children:[e.jsxs(en,{children:[cn(t.updatedAt||t.createdAt),t.updatedAt?e.jsx("span",{style:{marginLeft:6,color:"#6b7280"},children:"(수정됨)"}):null]}),e.jsx(tn,{children:U===t.id?e.jsxs(e.Fragment,{children:[e.jsx(m,{type:"button",onClick:ss,children:"취소"}),e.jsx(te,{type:"button",onClick:ts,children:"저장"})]}):e.jsxs(e.Fragment,{children:[e.jsx(m,{type:"button",onClick:()=>es(t.id),children:"편집"}),e.jsx(m,{type:"button","data-variant":"danger",onClick:()=>void rs(t.id),children:"삭제"})]})})]}),U===t.id?e.jsx(vt,{rows:4,value:Le,onChange:a=>_(a.target.value)}):e.jsx(sn,{children:t.text})]},t.id))]})]})]}),e.jsx(pt,{children:e.jsxs(S,{children:[e.jsx(gt,{children:e.jsxs(mt,{children:[e.jsxs(C,{"data-active":x==="courses",onClick:()=>o(`/students/${r}/courses`),children:["수강수업 ",e.jsx(jt,{children:l?.courses?.length??0})]}),e.jsx(C,{"data-active":x==="attendance",onClick:()=>o(`/students/${r}/attendance`),children:"출석현황"}),e.jsx(C,{"data-active":x==="grades",onClick:()=>o(`/students/${r}/grades`),children:"성적"}),e.jsx(C,{"data-active":x==="counsels",onClick:()=>o(`/students/${r}/counsels`),children:"상담기록"})]})}),e.jsx(ht,{}),x==="courses"&&e.jsx(F,{children:l?.courses?.length?e.jsx(Bs,{children:l.courses.map(t=>e.jsxs(Rs,{children:[e.jsxs(Fs,{children:[e.jsx(Ps,{children:t.title}),e.jsx(m,{type:"button",onClick:()=>o(`/classes/${t.id}`),children:"상세"})]}),e.jsxs(Hs,{children:[e.jsx("code",{children:t.code}),e.jsx(Ys,{"data-type":t.status,children:Kt(t.status)})]})]},t.id))}):e.jsx(P,{children:"수강 중인 수업이 없습니다."})}),x==="attendance"&&e.jsxs(F,{children:[Oe&&e.jsx(R,{children:Oe}),e.jsxs(Us,{children:[e.jsxs(bt,{children:[e.jsx(ae,{children:"이번 달 출석률"}),e.jsx(_s,{children:un(L)}),e.jsx(ie,{children:xn(L)})]}),e.jsxs(bt,{children:[e.jsx(ae,{children:"최근 결석"}),e.jsx(ie,{children:pn(L)})]})]}),Nt?e.jsx(I,{children:"불러오는 중..."}):e.jsxs(dt,{style:{minWidth:640},children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"날짜"}),e.jsx("th",{children:"과목"}),e.jsx("th",{children:"상태"}),e.jsx("th",{children:"메모"})]})}),e.jsx("tbody",{children:L.length===0?e.jsx("tr",{children:e.jsx("td",{colSpan:4,children:e.jsx(I,{children:"출석 기록이 없습니다."})})}):L.map((t,a)=>e.jsxs("tr",{children:[e.jsx("td",{children:t.date}),e.jsx("td",{children:t.courseTitle}),e.jsx("td",{children:t.present?"출석":"결석"}),e.jsx("td",{children:t.reason||"-"})]},a))})]})]}),x==="grades"&&e.jsxs(F,{children:[e.jsx("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}),nt&&e.jsx(R,{children:nt}),Ot&&e.jsx(I,{children:"시험 성적을 불러오는 중..."}),at.length===0?e.jsx(P,{children:"등록된 성적이 없습니다."}):e.jsxs(dt,{style:{minWidth:720},children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"시험/과목"}),e.jsx("th",{children:"수업"}),e.jsx("th",{children:"일자"}),e.jsx("th",{children:"성적"})]})}),e.jsx("tbody",{children:at.map(t=>{const a=(l?.courses||[]).find(u=>u.id===t.courseId)?.title||"-",i=t.level?t.level:t.score!=null?`${t.score}${t.outOf!=null?`/${t.outOf}`:""}`:"-";return e.jsxs("tr",{children:[e.jsx("td",{children:e.jsxs("div",{style:{display:"grid"},children:[e.jsx("strong",{children:t.subject||"성적"}),t.note&&e.jsx(ie,{style:{maxWidth:420,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:t.note})]})}),e.jsx("td",{children:a}),e.jsx("td",{children:t.date}),e.jsx("td",{children:i})]},t.id)})})]})]}),x==="counsels"&&e.jsxs(F,{children:[Ze&&e.jsx(R,{style:{marginBottom:8},children:Ze}),!!ye&&e.jsxs("div",{style:{display:"grid",gap:8,marginBottom:12},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8},children:[e.jsx(ae,{style:{margin:0},children:"상담 AI 요약"}),e.jsx(Ce,{type:"button",onClick:()=>{try{navigator.clipboard?.writeText(ye)}catch{}},children:"복사"})]}),e.jsx(yt,{as:"pre",style:{whiteSpace:"pre-wrap"},children:ye})]}),e.jsxs(fn,{children:[e.jsx("div",{children:e.jsx(ae,{children:"상담기록"})}),e.jsxs("div",{style:{display:"inline-flex",gap:8,alignItems:"center"},children:[e.jsx(Js,{type:"button",onClick:Qt,disabled:Qe,children:Qe?"AI 요약 중…":"AI 요약"}),He?e.jsxs(e.Fragment,{children:[e.jsx(m,{type:"button",onClick:()=>{pe(!1),fe(""),J(""),q("")},children:"취소"}),e.jsx(te,{type:"button",onClick:as,disabled:Mt||!K||!V,children:"저장"})]}):e.jsxs(e.Fragment,{children:[e.jsx(m,{type:"button",onClick:qt,disabled:Fe,children:Fe?"엑셀 준비 중...":"엑셀 추출"}),e.jsx(ke,{type:"button",onClick:()=>{pe(!0),Ye(()=>{const t=new Date;return`${t.getFullYear()}-${j(t.getMonth()+1)}-${j(t.getDate())}`}),J(""),q("")},children:"상담 추가"})]})]})]}),Re&&e.jsx(R,{children:Re}),He&&e.jsxs(gn,{children:[e.jsxs(h,{children:[e.jsx(f,{children:"상담 일자"}),e.jsx(wt,{type:"date",lang:"ko-KR",value:he,onChange:t=>Ye(t.target.value)})]}),e.jsxs(h,{children:[e.jsx(f,{children:"시간"}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8},children:[e.jsx("div",{style:{flex:1},children:e.jsx(se,{ariaLabel:"시",value:K,onChange:J,placeholder:"시",options:ot.map(t=>({label:t,value:t}))})}),e.jsx("span",{children:":"}),e.jsx("div",{style:{flex:1},children:e.jsx(se,{ariaLabel:"분",value:V,onChange:q,placeholder:"분",options:lt.map(t=>({label:t,value:t}))})})]})]}),e.jsxs(h,{style:{gridColumn:"1 / -1"},children:[e.jsx(f,{children:"내용"}),e.jsx(St,{rows:4,value:Ue,onChange:t=>fe(t.target.value),placeholder:"상담 내용 또는 메모"})]})]}),$t?e.jsx(I,{children:"불러오는 중..."}):xe.length===0?e.jsx(P,{children:"상담 기록이 없습니다."}):e.jsx(Ws,{children:xe.map(t=>{const a=Dt===t.id;return e.jsx(Ks,{children:a?e.jsxs(e.Fragment,{children:[e.jsxs(yn,{children:[e.jsxs(h,{children:[e.jsx(f,{children:"상담 일자"}),e.jsx(wt,{type:"date",lang:"ko-KR",value:Q,onChange:i=>A(i.target.value)})]}),e.jsxs(h,{children:[e.jsx(f,{children:"시간"}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8},children:[e.jsx("div",{style:{flex:1},children:e.jsx(se,{ariaLabel:"시",value:X,onChange:O,placeholder:"시",options:ot.map(i=>({label:i,value:i}))})}),e.jsx("span",{children:":"}),e.jsx("div",{style:{flex:1},children:e.jsx(se,{ariaLabel:"분",value:Z,onChange:G,placeholder:"분",options:lt.map(i=>({label:i,value:i}))})})]})]}),e.jsxs(h,{style:{gridColumn:"1 / -1"},children:[e.jsx(f,{children:"내용"}),e.jsx(St,{rows:4,value:Je,onChange:i=>ee(i.target.value)})]})]}),e.jsxs(Ct,{children:[e.jsx(m,{type:"button",onClick:()=>{ge(null),A(""),O(""),G(""),ee("")},children:"취소"}),e.jsx(te,{type:"button",disabled:It||!Q||!X||!Z,onClick:()=>os(t.id),children:"저장"})]})]}):e.jsxs(e.Fragment,{children:[e.jsxs(mn,{children:[e.jsx(jn,{children:hn(t.counselTime)}),e.jsxs(Ct,{children:[e.jsx(m,{type:"button",onClick:()=>{ge(t.id);try{const i=new Date(t.counselTime);A(`${i.getFullYear()}-${j(i.getMonth()+1)}-${j(i.getDate())}`),O(j(i.getHours())),G(j(i.getMinutes()))}catch{A(""),O(""),G("")}ee(t.content||"")},children:"편집"}),e.jsx(m,{type:"button","data-variant":"danger",onClick:()=>je(t.id),children:"삭제"})]})]}),e.jsx(bn,{children:(t.content||"").trim()||"내용 없음"})]})},t.id)})})]})]})})]}),Tt,e.jsx(ms,{open:me!=null,title:"상담 일정 삭제",message:"이 상담 일정을 삭제하시겠어요? 되돌릴 수 없습니다.",confirmLabel:"삭제",cancelLabel:"취소",tone:"danger",busy:We,onCancel:()=>{We||je(null)},onConfirm:async()=>{if(!(!r||me==null)){Ke(!0);try{await js(me);const t=await ne({studentId:r,size:100});W(t.content||[]),je(null)}catch(t){be(t?.message||"삭제에 실패했습니다.")}finally{Ke(!1)}}}})]})}const zs=s.div`
  display: grid;
  gap: 14px;
`,Ts=s.div`
  display: flex;
  align-items: center;
  gap: 10px;
  h2 {
    margin: 0;
    font-size: 20px;
    color: #0f172a;
  }
`,ut=s.div`
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 14px;
  align-items: start;
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`,xt=s.aside`
  display: grid;
  gap: 18px;
`,pt=s.section``,S=s.section`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 16px;
  min-width: 0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
`,M=s.h3`
  margin: 0;
  font-size: 16px;
  color: #0f172a;
`,re=s.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`,Ee=s.div`
  display: inline-flex;
  gap: 12px;
`,ht=s.div`
  height: 1px;
  background: #e5e7eb;
  margin: 6px 0 10px;
`,ft=s.div`
  display: grid;
  gap: 14px;
`,Ls=s.div`
  display: grid;
  grid-template-columns: 44px 1fr auto;
  gap: 12px;
  align-items: center;
  margin-bottom: 6px;
`,As=s.div`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #eef2ff;
  color: #4f46e5;
  display: grid;
  place-items: center;
  font-weight: 800;
`,Os=s.div`
  font-size: 19px;
  font-weight: 900;
  color: #0f172a;
  letter-spacing: -0.01em;
`,ie=s.div`
  color: #6b7280;
  font-size: 12px;
`,Gs=s.span`
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
`,h=s.div`
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 8px;
`,f=s.div`
  color: #6b7280;
  font-size: 13px;
  align-self: center;
`,D=s.div`
  color: #111827;
  font-size: 15px;
`,I=s.div`
  color: #6b7280;
  font-size: 13px;
`,R=s.div`
  color: #b91c1c;
  font-size: 12px;
  font-weight: 700;
`,gt=s.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 5;
  padding-top: 2px;
`,mt=s.div`
  display: inline-flex;
  gap: 6px;
  flex-wrap: wrap;
`,C=s(kt)`
  height: 40px;
  padding: 0 16px;
  font-size: 14px;
  /* inactive: black text, white background, gray border (from UISmallBtn) */
  &[data-active="true"] {
    background: #f3f4f6; /* gray background */
    color: #111827; /* black text */
    border-color: #e5e7eb; /* gray border */
  }
`,jt=s.span`
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
`,F=s.div`
  display: grid;
  gap: 10px;
`,Bs=s.div`
  display: grid;
  gap: 8px;
`,Rs=s.div`
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px 12px;
  display: grid;
  gap: 6px;
  background: #fff;
`,Fs=s.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`,Ps=s.div`
  font-weight: 800;
  color: #0f172a;
  font-size: 14px;
`,Hs=s.div`
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
`,Ys=s.span`
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
`,Us=s.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
`,bt=s.div`
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px 12px;
  background: #fff;
`,ae=s.div`
  color: #6b7280;
  font-size: 12px;
`,_s=s.div`
  font-size: 22px;
  font-weight: 900;
  color: #0f172a;
  margin-top: 4px;
`,Ws=s.div`
  display: grid;
  gap: 8px;
`,Ks=s.div`
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px 12px;
  background: #fff;
  display: grid;
  gap: 4px;
  strong {
    color: #0f172a;
  }
`,P=s.div`
  color: #6b7280;
  font-size: 13px;
  text-align: center;
  border: 1px dashed #e5e7eb;
  border-radius: 10px;
  padding: 16px;
  background: #fafafa;
`;s.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;s.span`
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
`;s.div`
  color: #475569;
  font-size: 12px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;s.i`
  width: 4px;
  height: 4px;
  background: #cbd5e1;
  display: inline-block;
  border-radius: 50%;
`;s.ul`
  margin: 10px 0 0;
  padding-left: 18px;
  color: #334155;
  font-size: 13px;
`;s.ul`
  margin: 10px 0;
  padding-left: 18px;
  color: #111827;
  font-size: 13px;
`;s.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;const m=s(kt)`
  height: 40px;
  padding: 0 16px;
  font-size: 14px;
`,Js=s.button`
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
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.35) 0%,
      rgba(255, 255, 255, 0.05) 100%
    );
    mix-blend-mode: screen;
    opacity: 0.6;
    transition: opacity 0.2s ease;
    pointer-events: none;
  }
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 24px 44px rgba(99, 102, 241, 0.3);
    filter: saturate(1.1);
    &:before {
      opacity: 0.8;
    }
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
`,yt=s.pre`
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
`,Vs=s.textarea`
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
`,qs=s.div`
  display: grid;
  gap: 8px;
`,Qs=s.div`
  display: grid;
  gap: 8px;
`,Xs=s.div`
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px 12px;
  background: #fff;
  display: grid;
  gap: 6px;
`,Zs=s.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`,en=s.div`
  color: #6b7280;
  font-size: 12px;
`,tn=s.div`
  display: inline-flex;
  gap: 6px;
`,vt=s.textarea`
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 8px 10px;
  resize: vertical;
  font-size: 14px;
  color: #111827;
`,sn=s.pre`
  margin: 0;
  white-space: pre-wrap;
  color: #111827;
  font-size: 14px;
`,nn=fs`
  0% { background-position: -200px 0; }
  100% { background-position: 200px 0; }
`,le=s.div`
  background: linear-gradient(90deg, #eef2f7 25%, #f6f8fb 37%, #eef2f7 63%);
  background-size: 400px 100%;
  animation: ${nn} 1.2s ease-in-out infinite;
  border-radius: 8px;
  width: ${({w:o})=>o?`${o}px`:"100%"};
  height: ${({h:o})=>o?`${o}px`:"12px"};
  margin-top: ${({mt:o})=>o?`${o}px`:0};
`,oe=le,rn=s(le).attrs({w:44,h:44})`
  border-radius: 12px;
`,an=s.div`
  display: grid;
  grid-template-columns: 44px 1fr 80px;
  gap: 10px;
  align-items: center;
  margin-bottom: 8px;
`,on=s(le).attrs({w:80,h:24})``,z=s(le).attrs({h:16,mt:10})``;function ln(o,d){const c=URL.createObjectURL(o),r=document.createElement("a");r.href=c,r.download=d,document.body.appendChild(r),r.click(),r.remove(),URL.revokeObjectURL(c)}function dn(o){const c=(o?o.trim():"export").replace(/[\\/:*?"<>|]+/g,"_");return c.length?c:"export"}function j(o){return String(o).padStart(2,"0")}function cn(o){return Ns(o,{includeWeekday:!0})}function un(o){const d=new Date,c=d.getFullYear(),r=d.getMonth()+1,l=o.filter(g=>{const[E,H]=g.date.split("-").map(Number);return E===c&&H===r});if(l.length===0)return"—";const k=l.filter(g=>g.present).length;return`${Math.round(k/l.length*100)}%`}function xn(o){const d=new Date,c=d.getFullYear(),r=d.getMonth()+1,l=o.filter(b=>{const[g,E]=b.date.split("-").map(Number);return g===c&&E===r});return l.length===0?"—":`${l.filter(b=>b.present).length}/${l.length}회 출석`}function pn(o){const d=o.filter(c=>!c.present).slice(0,2).map(c=>c.date);return d.length===0?"없음":d.join(", ")}function hn(o){try{const d=new Date(o),c=["일","월","화","수","목","금","토"][d.getDay()],r=d.getFullYear(),l=d.getMonth()+1,k=d.getDate(),b=j(d.getHours()),g=j(d.getMinutes());return`${r}년 ${l}월 ${k}일 (${c}) ${b}:${g}`}catch{return o}}const fn=s.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`,gn=s.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin: 4px 0 8px;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`,wt=s.input`
  height: 36px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 10px;
  font-size: 14px;
`,St=s.textarea`
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 8px 10px;
  font-size: 14px;
  resize: vertical;
`;s.select`
  height: 36px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 8px;
  font-size: 14px;
  background: #fff;
  color: #0f172a;
`;const mn=s.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`,Ct=s.div`
  display: inline-flex;
  gap: 12px;
`,jn=s.div`
  font-weight: 900;
  color: #0f172a;
`,bn=s.pre`
  margin: 4px 0 0;
  white-space: pre-wrap;
  color: #111827;
  font-size: 14px;
`,yn=s.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;export{Jn as default};
