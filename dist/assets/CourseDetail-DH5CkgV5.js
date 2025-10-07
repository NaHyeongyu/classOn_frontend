import{u as ht,h as gt,r as s,k as mt,j as e,w as Be,G as z,S as P,t as B,x as T,a as U,y as Ue,d as a,c as qe,T as jt}from"./index-DuqOyKVg.js";import{C as bt}from"./ConfirmDialog-B4qO0ati.js";import{d as yt,g as vt,b as wt,e as Et,f as Ge,h as St}from"./courses-Bib7YEXJ.js";import{c as kt,b as Ct}from"./format-Do6vjlY3.js";import{l as Dt}from"./students-BqdD7vYY.js";import{K as ie,U as Lt,C as $t,a as Mt}from"./KPI-DE1ZrzEf.js";import{M as Rt}from"./Modal-Dl-vMBLH.js";import{l as Tt,u as Nt,c as Ft,d as At}from"./exams-C7p0s-Gu.js";import{u as It}from"./useConfirmDialog-C_qr8el7.js";function Mn(){const d=ht(),{id:h}=gt(),n=s.useMemo(()=>h?Number(h):null,[h]),{error:g,success:E}=mt(),{confirm:H,dialog:Qe}=It({confirmLabel:"삭제",cancelLabel:"취소",tone:"danger"}),[l,Xe]=s.useState(null),[Ze,ce]=s.useState(!1),[de,ue]=s.useState(null),[S,xe]=s.useState([]),[fe,pe]=s.useState(!1),[he,V]=s.useState(null),[k,ge]=s.useState([]),[me,je]=s.useState(!1),[be,ye]=s.useState(null),[ve,we]=s.useState(!1),[Ee,et]=s.useState([]),[tt,Se]=s.useState(!1),[ke,N]=s.useState(null),[nt,K]=s.useState(!1),[F,M]=s.useState("percent"),[W,Ce]=s.useState(!1),[De,R]=s.useState(null),[Le,q]=s.useState(null),[A,J]=s.useState("create"),p=s.useRef(null),L=s.useRef(""),[m,Q]=s.useState(null),[$,$e]=s.useState(new Date().getMonth()+1),[rt,X]=s.useState(!1),[Me,Re]=s.useState(!1),[I,Te]=s.useState({});function b(t,r){return typeof t=="string"?t:t&&typeof t=="object"&&"message"in t&&typeof t.message=="string"&&t.message||r}s.useEffect(()=>{if(!n)return;let t=!1;async function r(){ce(!0),ue(null);try{const o=await vt(n);t||Xe(o)}catch(o){t||ue(b(o,"수업 정보를 불러오지 못했습니다."))}finally{t||ce(!1)}}return r(),()=>{t=!0}},[n]);const O=s.useCallback(async()=>{if(n){Se(!0),N(null);try{const t=await Tt(n);et(t)}catch(t){N(b(t,"시험 목록을 불러오지 못했습니다."))}finally{Se(!1)}}},[n]);s.useEffect(()=>{O()},[O]);function st(t){const r=Math.round(t);return r>=90?"A":r>=80?"B":r>=70?"C":r>=60?"D":r>=50?"E":"F"}function Z(t){return String(t).padStart(2,"0")}function at(t,r){return new Date(t,r,0).getDate()}function Ne(){if(m==null)return{};let t=`${m}-01-01`,r=`${m}-12-31`;if($>=1){const o=at(m,$);t=`${m}-${Z($)}-01`,r=`${m}-${Z($)}-${Z(o)}`}return{from:t,to:r}}function it(t){switch(t){case"INDIVIDUAL":return"개인 수업";case"GROUP":return"단체 수업";default:return"단체 수업"}}s.useEffect(()=>{l&&m==null&&Q(new Date().getFullYear())},[l,m]),s.useEffect(()=>{if(!n||m==null)return;let t=!1;async function r(){je(!0),ye(null);try{const o=Ne(),c=await wt(n,o);t||ge(c)}catch(o){if(!t){const c=b(o,"");c.includes("404")?ge([]):ye(c||"수업 내역을 불러오지 못했습니다.")}}finally{t||je(!1)}}return r(),()=>{t=!0}},[n,m,$]);async function ot(){if(n){we(!0);try{const t=Ne(),r=await Et(n,t),o=l?.title||`course_${n}`,c=t.from&&t.to?`${t.from}_${t.to}`:new Date().toISOString().slice(0,10),i=Gt(`${o}_${c}_records`);Ut(r,`${i}.xlsx`)}catch(t){g(b(t,"수업 내역 엑셀 추출에 실패했습니다."))}finally{we(!1)}}}async function lt(){if(!n||W)return;const t=L.current.trim();if(!t){R("시험 제목을 입력해주세요."),p.current?.focus();return}R(null),Ce(!0);try{A==="edit"&&Le?(await Nt(n,Le.id,{title:t,inputMode:F}),E("시험이 수정되었습니다.")):(await Ft(n,{title:t,inputMode:F,kind:"TEST"}),E("시험이 생성되었습니다.")),await O(),ee()}catch(r){g(b(r,A==="edit"?"시험 수정에 실패했습니다.":"시험 생성에 실패했습니다."))}finally{Ce(!1)}}function ct(){N(null),R(null),L.current="",p.current&&(p.current.value=""),M("percent"),J("create"),q(null),K(!0),requestAnimationFrame(()=>{p.current&&(p.current.value="",p.current.focus())})}function ee(){K(!1),R(null),q(null),J("create"),M("percent"),L.current="",p.current&&(p.current.value="")}function dt(t){N(null),R(null),J("edit"),q(t),M(t.inputMode??"percent"),L.current=t.title??"",K(!0),requestAnimationFrame(()=>{p.current&&(p.current.value=t.title??"",p.current.focus(),p.current.select())})}async function ut(t){if(!(!n||!await H({title:"시험을 삭제할까요?",message:`${t.title||"등록된 시험"}과(와) 해당 성적 데이터를 영구 삭제합니다. 되돌릴 수 없습니다.`})))try{await At(n,t.id),E("시험이 삭제되었습니다."),await O()}catch(o){g(b(o,"시험 삭제에 실패했습니다."))}}s.useEffect(()=>{if(!n||k.length===0)return;let t=!1;async function r(){const o=k.map(c=>c.id).filter(c=>typeof c=="number");if(o.length!==0)try{const c=await Promise.all(o.map(async i=>{try{const x=await Ge(n,i),f={};return x.forEach(u=>{f[u.studentId]=!!u.present}),[i,f]}catch{return[i,void 0]}}));t||Te(i=>{const x={...i};return c.forEach(([f,u])=>{u&&(x[f]=u)}),x})}finally{}}return r(),()=>{t=!0}},[n,k]);const[yn,Fe]=s.useState(0);s.useEffect(()=>{function t(r){const o=r.detail?.ymd,c=k.filter(i=>!o||i.recordDate===o).map(i=>i.id).filter(i=>typeof i=="number");if(n){if(c.length===0){Fe(i=>i+1);return}(async()=>{try{const i=await Promise.all(c.map(async x=>{try{const f=await Ge(n,x),u={};return f.forEach(j=>{u[j.studentId]=!!j.present}),[x,u]}catch{return[x,void 0]}}));Te(x=>{const f={...x};return i.forEach(([u,j])=>{j&&(f[u]=j)}),f})}catch{}finally{Fe(i=>i+1)}})()}}return window.addEventListener("calendar:classes-refresh",t),()=>window.removeEventListener("calendar:classes-refresh",t)},[n,k]),s.useEffect(()=>{if(!n)return;let t=!1;async function r(){pe(!0),V(null);try{const o=await St(n);t||xe(o)}catch(o){const c=b(o,"");if(c.includes("404"))try{let i=0;const x=100;let f=[];for(;;){const{content:j,last:ae}=await Dt({page:i,size:x});if(f=f.concat(j),ae||j.length===0||i>100)break;i+=1}const u=f.filter(j=>(j.courses||[]).some(ae=>ae.id===n));t||xe(u)}catch(i){t||V(b(i,"등록 학생을 불러오지 못했습니다."))}else t||V(c||"등록 학생을 불러오지 못했습니다.")}finally{t||pe(!1)}}return r(),()=>{t=!0}},[n]);const te=s.useMemo(()=>l?Yt(l):null,[l]),y=s.useMemo(()=>l?k.map(t=>({id:t.id,date:new Date(t.recordDate),dateLabel:`${t.recordDate} (${"일월화수목금토"[new Date(t.recordDate).getDay()]})`,time:xt(l),type:new Date(t.recordDate)<new Date?"지난 수업":"예정",notes:t.notes||t.content||null})):[],[l,k]);function ne(t){const r=t.getFullYear(),o=String(t.getMonth()+1).padStart(2,"0"),c=String(t.getDate()).padStart(2,"0");return`${r}-${o}-${c}`}function xt(t){return t.startTime&&t.endTime?`${_(t.startTime)} ~ ${_(t.endTime)}`:t.courseTime||"-"}function Ae(t){try{return JSON.parse(localStorage.getItem(`attachments:${n}:${t}`)||"[]")}catch{return[]}}function re(t){try{return JSON.parse(localStorage.getItem(`attendance:${n}:${t}`)||"{}")}catch{return{}}}const Ie=s.useMemo(()=>l?.enrolledCount!=null?l.enrolledCount:S.length,[l,S.length]),ft=l?.capacity,se=s.useMemo(()=>y.filter(t=>t.type==="지난 수업").length,[y]),Oe=s.useMemo(()=>{const t=y.length||0;return t?Math.round(se/t*100):null},[se,y.length]),ze=s.useMemo(()=>{if(!y.length)return null;let t=0,r=0;for(const o of y){if(!o.id)continue;const c=I[o.id]||re(o.id),i=Object.values(c).filter(u=>u===!0).length,x=Object.values(c).filter(u=>u===!1).length,f=i+x;f>0&&(t+=i,r+=f)}return r===0?null:Math.round(t/r*100)},[y,I]),[Pe,pt]=s.useState(!1);return e.jsxs(_t,{children:[e.jsxs(Ht,{children:[e.jsxs(Jt,{type:"button",onClick:()=>d("/classes"),children:[Qt," 뒤로"]}),e.jsx("h2",{children:l?.title||"수업 상세"}),e.jsxs(Ye,{children:[e.jsx(Be,{to:`/classes/${n||""}/edit-students`,title:"수강생 수정","data-variant":"edit",children:"수강생 수정"}),e.jsx(Be,{to:`/classes/${n||""}/edit`,title:"기본 정보 수정","data-variant":"edit",children:"기본정보 수정"}),n&&e.jsx(z,{type:"button",onClick:()=>X(!0),children:"삭제"})]})]}),Qe,e.jsx(bt,{open:rt,title:"수업(템플릿) 삭제",message:"관련 수업 내역/출결/첨부가 모두 삭제됩니다. 이 작업은 되돌릴 수 없습니다.",confirmLabel:"영구 삭제",cancelLabel:"취소",tone:"danger",busy:Me,onCancel:()=>{Me||X(!1)},onConfirm:async()=>{if(n){Re(!0);try{await yt(n),X(!1),d("/classes")}catch(t){g(b(t,"삭제에 실패했습니다."))}finally{Re(!1)}}}}),de&&e.jsx(G,{children:de}),Ze&&e.jsx(D,{children:"불러오는 중..."}),e.jsxs(Xt,{children:[e.jsx(ie,{title:"총 수강생",icon:e.jsx(Lt,{}),iconAccent:"indigo",value:e.jsx(e.Fragment,{children:typeof Ie=="number"?`${Ie}명`:"—"}),footerLeft:e.jsxs("span",{children:["정원 ",ft??"—","명"]})}),e.jsx(ie,{title:"평균 출석률",icon:e.jsx($t,{}),iconAccent:"green",value:e.jsx(e.Fragment,{children:ze!=null?`${ze}%`:"—"}),footerLeft:e.jsx("span",{children:"처리된 회차 기준"})}),e.jsx(ie,{title:"완료된 수업",icon:e.jsx(Mt,{}),iconAccent:"violet",value:e.jsxs(e.Fragment,{children:[se||0,"회"]}),footerRight:Oe!=null?e.jsxs("span",{children:["진행률 ",Oe,"%"]}):e.jsx("span",{children:"—"})})]}),te&&e.jsxs(Zt,{children:[e.jsx(en,{children:e.jsxs(tn,{children:[e.jsxs(P,{children:[e.jsxs(Y,{children:[e.jsx(B,{children:"수업 정보"}),e.jsx("div",{children:e.jsx(T,{to:`/classes/${n||""}/edit`,"data-variant":"edit",children:"기본정보 수정"})})]}),e.jsxs(Vt,{children:[e.jsxs(v,{children:[e.jsx(w,{children:"코드"}),e.jsx("div",{children:e.jsx("code",{children:l?.code})})]}),e.jsxs(v,{children:[e.jsx(w,{children:"상태"}),e.jsx("div",{children:e.jsx(Wt,{"data-type":l?.status,children:zt(l?.status)})})]}),e.jsxs(v,{children:[e.jsx(w,{children:"수업 형태"}),e.jsx("div",{children:it(l?.courseType)})]}),e.jsxs(v,{children:[e.jsx(w,{children:"요일"}),e.jsx("div",{children:te.days||"-"})]}),e.jsxs(v,{children:[e.jsx(w,{children:"시간"}),e.jsx("div",{children:te.time||"-"})]}),e.jsxs(v,{children:[e.jsx(w,{children:"정원"}),e.jsx("div",{children:l?.capacity??"-"})]}),e.jsxs(v,{children:[e.jsx(w,{children:"수강료"}),e.jsx("div",{children:l?.fee!=null?kt(l.fee):"-"})]}),e.jsxs(v,{children:[e.jsx(w,{children:"생성일"}),e.jsx("div",{children:l?.createdAt?new Date(l.createdAt).toLocaleDateString():"-"})]}),e.jsxs(v,{style:{gridColumn:"1 / -1"},children:[e.jsx(w,{children:"수업 설명"}),e.jsx(Kt,{children:l?.description||"-"})]})]})]}),e.jsxs(P,{children:[e.jsxs(Y,{children:[e.jsxs("div",{children:[e.jsx(B,{style:{margin:0},children:"시험 관리"}),e.jsx(D,{children:"수업과 연결된 시험을 확인하고 추가합니다."})]}),e.jsx(U,{as:"button",type:"button",onClick:ct,children:"시험 생성"})]}),tt&&e.jsx(D,{children:"시험을 불러오는 중..."}),ke&&e.jsx(G,{children:ke}),Ee.length===0?e.jsx(on,{children:e.jsx("p",{children:"아직 등록된 시험이 없습니다."})}):e.jsx(Ke,{children:e.jsxs(an,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"시험명"}),e.jsx("th",{children:"형태"}),e.jsx("th",{children:"평균"}),e.jsxs("th",{className:"manage",children:[e.jsx("div",{className:"manage-header","aria-hidden":"true",children:e.jsx("span",{className:"manage-label",children:"관리"})}),e.jsx("span",{className:"sr-only",children:"관리"})]})]})}),e.jsx("tbody",{children:Ee.map(t=>e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx(ln,{children:e.jsx("span",{className:"name",children:t.title})})}),e.jsx("td",{children:Bt(t.inputMode)}),e.jsx("td",{children:t.averageScore!=null?st(t.averageScore):"—"}),e.jsx("td",{className:"manage",children:e.jsxs("div",{className:"actions",children:[e.jsx(Ue,{type:"button","data-variant":"edit",onClick:()=>dt(t),children:"수정"}),e.jsx(Ue,{type:"button","data-variant":"danger",onClick:()=>ut(t),children:"삭제"})]})})]},t.id))})]})})]}),e.jsxs(P,{children:[e.jsxs(Y,{children:[e.jsxs("div",{children:[e.jsx(B,{style:{margin:0},children:"수강생 목록"}),e.jsxs(D,{children:["총 ",S.length,"명의 학생이 수강중입니다."]})]}),e.jsx(Ye,{children:e.jsx(U,{to:`/classes/${n||""}/edit-students`,children:"학생 추가"})})]}),fe&&e.jsx(D,{children:"불러오는 중..."}),he&&e.jsx(G,{children:he}),e.jsx(Ke,{children:e.jsxs(Je,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"학생명"}),e.jsx("th",{children:"연락처"}),e.jsx("th",{children:"등록일"}),e.jsx("th",{children:"상태"})]})}),e.jsx("tbody",{children:S.length===0&&!fe?e.jsx("tr",{children:e.jsx("td",{colSpan:4,style:{color:"#6b7280"},children:"등록된 학생이 없습니다."})}):S.map(t=>e.jsxs("tr",{children:[e.jsxs("td",{children:[e.jsx("strong",{children:t.name}),e.jsx(C,{children:t.code})]}),e.jsx("td",{children:Ct(t.phoneNumber)}),e.jsx("td",{children:t.joinedDate||"-"}),e.jsx("td",{children:e.jsx(qt,{"data-type":t.status,children:Pt(t.status)})})]},t.id))})]})})]})]})}),e.jsx(nn,{children:e.jsxs(P,{children:[e.jsxs(Y,{children:[e.jsx(B,{children:"수업 내역"}),e.jsxs("div",{style:{display:"inline-flex",gap:8},children:[e.jsx(z,{type:"button",onClick:ot,disabled:ve,children:ve?"엑셀 준비 중...":"엑셀 추출"}),e.jsx(z,{type:"button",onClick:()=>pt(t=>!t),children:Pe?"펼치기":"목록 접기"}),e.jsx(U,{to:`/classes/${n||""}/history/date/${ne(new Date)}`,children:"수업 생성"})]})]}),e.jsxs(rn,{children:[e.jsxs(Ve,{children:[e.jsx(_e,{children:"연도"}),e.jsx(He,{value:m??"",onChange:t=>Q(Number(t.currentTarget.value)||new Date().getFullYear()),children:(()=>{const t=new Date().getFullYear(),r=(()=>{try{return l?new Date(l.createdAt).getFullYear():t-1}catch{return t-1}})(),o=t+1,c=[];for(let i=r;i<=o;i++)c.push(i);return c.map(i=>e.jsxs("option",{value:i,children:[i,"년"]},i))})()})]}),e.jsxs(Ve,{children:[e.jsx(_e,{children:"월"}),e.jsxs(He,{value:$,onChange:t=>$e(Number(t.currentTarget.value)),children:[e.jsx("option",{value:0,children:"전체"}),Array.from({length:12},(t,r)=>r+1).map(t=>e.jsxs("option",{value:t,children:[t,"월"]},t))]})]}),e.jsx("div",{style:{flex:1}}),e.jsx(sn,{type:"button",onClick:()=>{Q(new Date().getFullYear()),$e(0)},children:"초기화"})]}),(me||!l)&&e.jsx(D,{children:"불러오는 중..."}),be&&e.jsx(G,{children:be}),y.length===0&&!me&&e.jsx(D,{children:"표시할 일정이 없습니다."}),y.map(t=>Pe?e.jsxs(hn,{children:[e.jsxs("div",{className:"left",children:[e.jsx("strong",{children:t.dateLabel}),e.jsx(C,{style:{marginLeft:8},children:t.time}),e.jsx(C,{style:{marginLeft:8},children:t.type})]}),e.jsx("div",{className:"right",children:t.id?e.jsx(T,{to:`/classes/${n}/history/${t.id}`,children:"상세"}):e.jsx(T,{to:`/classes/${n}/history/date/${ne(t.date)}`,children:"상세"})})]},t.id||t.dateLabel):e.jsxs(fn,{children:[e.jsxs(pn,{children:[e.jsxs("div",{children:[e.jsx("strong",{children:t.dateLabel}),e.jsx(C,{style:{marginLeft:8},children:t.time}),e.jsx(C,{style:{marginLeft:8},children:t.type}),t.id&&(()=>{const r=I[t.id]||re(t.id),o=Object.keys(r).length,c=new Date(t.date)<new Date(new Date().toDateString()),i=typeof l?.enrolledCount=="number"?l.enrolledCount:S.length,x=c?0:Math.max(0,i-o);return e.jsx(gn,{children:`처리 ${o}명 · 미처리 ${x}명`})})()]}),e.jsx("div",{children:t.id?e.jsx(T,{to:`/classes/${n}/history/${t.id}`,children:"상세"}):e.jsx(T,{to:`/classes/${n}/history/date/${ne(t.date)}`,children:"상세"})})]}),e.jsx(oe,{children:"출석"}),(()=>{const r=t.id?I[t.id]||re(t.id):{},o=Object.values(r).filter(u=>u===!0).length,c=Object.values(r).filter(u=>u===!1).length,i=t.date<new Date(new Date().toDateString()),x=typeof l?.enrolledCount=="number"?l.enrolledCount:S.length,f=i?0:Math.max(0,x-(o+c));return e.jsxs("div",{style:{display:"flex",gap:12,alignItems:"center"},children:[e.jsxs(le,{"data-variant":"present",children:["출석 ",o,"명"]}),e.jsxs(le,{"data-variant":"absent",children:["결석 ",c,"명"]}),e.jsxs(le,{"data-variant":"none",children:["미처리 ",f,"명"]})]})})(),e.jsx(oe,{children:"수업 내용"}),e.jsx(mn,{children:t.notes&&t.notes.trim()?t.notes:"—"}),t.id&&e.jsxs(e.Fragment,{children:[e.jsx(oe,{children:"첨부"}),e.jsx(jn,{children:Ae(t.id).length===0?e.jsx(C,{children:"첨부 없음"}):Ae(t.id).map((r,o)=>e.jsx(bn,{children:e.jsxs("div",{children:[r.name," ",e.jsxs(C,{children:[(r.size/1024).toFixed(1),"KB"]})]})},`${t.id}-${o}`))})]})]},t.id||t.dateLabel))]})})]}),e.jsx(Rt,{open:nt,title:A==="edit"?"시험 수정":"시험 추가",onClose:ee,blockOutsideClose:!0,initialFocusRef:p,footer:e.jsxs(e.Fragment,{children:[e.jsx(z,{type:"button",onClick:ee,children:"취소"}),e.jsx(U,{as:"button",type:"button",onClick:lt,disabled:W,children:W?"저장 중...":A==="edit"?"수정":"생성"})]}),children:e.jsxs(cn,{children:[e.jsxs("div",{className:"row",children:[e.jsx("label",{htmlFor:"course-exam-title",children:"제목"}),e.jsx(dn,{id:"course-exam-title",ref:p,defaultValue:L.current,onChange:t=>{L.current=t.currentTarget.value},placeholder:"예) 중간 평가",autoComplete:"off"})]}),e.jsxs("div",{className:"row",children:[e.jsx("label",{children:"성적 방식"}),e.jsxs(un,{children:[e.jsx(We,{type:"button","data-active":F==="percent",onClick:()=>M("percent"),children:"백분율 (0-100)"}),e.jsx(We,{type:"button","data-active":F==="letter",onClick:()=>M("letter"),children:"등급 (A-F)"})]})]}),De&&e.jsx(xn,{role:"alert",children:De})]})})]})}function _(d){if(!d)return"";const[h,n]=d.split(":");return`${h}:${n}`}function Ot(d){return{MON:"월",TUE:"화",WED:"수",THU:"목",FRI:"금",SAT:"토",SUN:"일"}[d.toUpperCase()]||d}function zt(d){switch(d){case"IN_PROGRESS":return"진행중";case"PENDING":return"대기";case"STOPPED":return"중단";default:return d||"-"}}function Pt(d){switch(d){case"ENROLLED":return"수강중";case"ON_LEAVE":return"휴학";case"PENDING":return"대기";default:return d}}function Bt(d){return d==="percent"?"백분율":"등급"}function Ut(d,h){const n=URL.createObjectURL(d),g=document.createElement("a");g.href=n,g.download=h,document.body.appendChild(g),g.click(),g.remove(),URL.revokeObjectURL(n)}function Gt(d){const n=(d?d.trim():"export").replace(/[\\/:*?"<>|]+/g,"_");return n.length?n:"export"}function Yt(d){const h={MON:0,TUE:1,WED:2,THU:3,FRI:4,SAT:5,SUN:6},n=(d.recurrenceDays||"").split(",").map(E=>E.trim().toUpperCase()).filter(Boolean).sort((E,H)=>h[E]-h[H]).map(Ot).join("/"),g=d.startTime&&d.endTime?`${_(d.startTime)} ~ ${_(d.endTime)}`:d.courseTime||"-";return{days:n,time:g}}const _t=a.div`
  display: grid;
  gap: 12px;
`,Ht=a.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 12px;
  align-items: center;
  h2 {
    margin: 0;
  }
`,Ye=a.div`
  display: inline-flex;
  gap: 12px;
`,Vt=a.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`,v=a.div`
  display: grid;
  gap: 6px;
`,w=a.div`
  color: #6b7280;
  font-size: 12px;
  font-weight: 700;
`,Kt=a.div`
  color: #111827;
  white-space: pre-wrap;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 6; /* clamp to ~6 lines */
  -webkit-box-orient: vertical;
`,C=a.span`
  margin-left: 8px;
  color: #9ca3af;
  font-size: 12px;
`,Wt=a.span`
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
`,qt=a.span`
  margin-left: 8px;
  padding: 2px 6px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  border: 1px solid #e5e7eb;
  color: #374151;
  background: #f9fafb;
  &[data-type="ENROLLED"] {
    background: #ecfdf5;
    color: #047857;
    border-color: #a7f3d0;
  }
  &[data-type="ON_LEAVE"] {
    background: #fff7ed;
    color: #b45309;
    border-color: #fed7aa;
  }
  &[data-type="PENDING"] {
    background: #f5f3ff;
    color: #6d28d9;
    border-color: #ddd6fe;
  }
`,G=a.div`
  background: #fee2e2;
  color: #b91c1c;
  border: 1px solid #fecaca;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 13px;
`,D=a.div`
  color: #6b7280;
  font-size: 12px;
`,Jt=a.button`
  ${qe.outline};
  height: 40px;
  padding: 0 16px;
  font-weight: 600;
  font-size: 14px;
`,Qt=e.jsx("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"15 18 9 12 15 6"})}),Xt=a.div`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 12px;
`,Zt=a.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
`,en=a.div`
  flex: 4 1 0;
  display: grid;
  gap: 12px;
  align-content: flex-start;
`,tn=a.div`
  position: sticky;
  top: var(--sticky-top, 64px); /* align with PageHeader sticky height */
  z-index: 31; /* above PageHeader's z-index(30) siblings */
  background: ${({theme:d})=>d.colors.surface};
  display: grid;
  gap: 12px;
  align-content: flex-start;
  align-self: start; /* ensure sticky box isn't stretched by parent grid/flex */
  height: max-content; /* collapse to content height for proper sticky behavior */
  will-change: top; /* hint for smoother stick */
  @media (max-width: 900px) {
    position: static; /* mobile: disable sticky to avoid cramped UI */
  }
`,nn=a.div`
  flex: 6 1 0;
  display: grid;
  gap: 12px;
  align-content: flex-start;
`,Y=a.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 8px;
`,_e=a.span`
  display: block;
  color: #6b7280;
  font-size: 12px;
  margin-bottom: 4px;
`,He=a.select`
  height: 32px;
  padding: 0 10px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 12px;
  background: #fff;
  min-width: 110px;
`,rn=a.div`
  display: flex;
  gap: 12px;
  align-items: flex-end;
  margin-bottom: 8px;
  background: #f9fafb;
  border: 1px solid #f1f5f9;
  border-radius: 10px;
  padding: 8px 10px;
`,Ve=a.label`
  display: grid;
  gap: 4px;
`,sn=a.button`
  ${qe.outline};
  height: 32px;
  padding: 0 12px;
  font-size: 12px;
`,Je=a(jt)`
  thead th {
    background: #f9fafb;
  }
  tbody tr:nth-child(even) td {
    background: #fcfcfd;
  }
  tbody tr:hover td {
    background: #f8fafc;
  }
`,an=a(Je)`
  width: 100%;
  thead th,
  tbody td {
    vertical-align: middle;
  }
  thead th:first-child,
  tbody td:first-child {
    text-align: left;
    width: 40%;
  }
  thead th:nth-child(2),
  tbody td:nth-child(2),
  thead th:nth-child(3),
  tbody td:nth-child(3) {
    width: 20%;
    text-align: center;
  }
  thead th.manage,
  tbody td.manage {
    width: 160px;
    text-align: right;
    white-space: nowrap;
  }
  thead th.manage {
    position: relative;
  }
  thead th.manage .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
  thead th.manage .manage-header {
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
    gap: 6px;
    width: 100%;
    font-size: 12px;
    color: #94a3b8;
  }
  thead th.manage .manage-label {
    color: #1f2937;
    font-weight: 600;
  }
  tbody td.manage .actions {
    display: inline-flex;
    gap: 6px;
    justify-content: flex-end;
    flex-wrap: nowrap;
  }
`,on=a.div`
  display: grid;
  gap: 12px;
  padding: 24px;
  border: 1px dashed #e2e8f0;
  border-radius: 12px;
  background: #f8fafc;
  text-align: center;
  p {
    margin: 0;
    color: #475569;
    font-size: 14px;
    font-weight: 600;
  }
`,ln=a.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  .name {
    font-weight: 700;
    color: #1f2937;
  }
  .actions {
    display: inline-flex;
    gap: 8px;
  }
  .actions > * {
    min-width: 0;
  }
`,Ke=a.div`
  max-height: 420px;
  overflow: auto;
  border: 1px solid #f1f5f9;
  border-radius: 10px;
`,cn=a.div`
  display: grid;
  gap: 16px;
  .row {
    display: grid;
    grid-template-columns: 100px 1fr;
    gap: 12px;
    align-items: center;
  }
  label {
    font-weight: 700;
    color: #334155;
    font-size: 14px;
  }
`,dn=a.input`
  height: 40px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 12px;
  font-size: 14px;
  width: 100%;
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
  }
`,un=a.div`
  display: inline-flex;
  gap: 8px;
`,We=a.button`
  min-width: 120px;
  height: 40px;
  padding: 0 16px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: #fff;
  font-weight: 700;
  font-size: 13px;
  color: #374151;
  cursor: pointer;
  transition: background 0.18s ease, border-color 0.18s ease, color 0.18s ease;
  &[data-active="true"] {
    background: #eef2ff;
    border-color: #c7d2fe;
    color: #3730a3;
  }
`,xn=a.div`
  margin-left: 100px;
  color: #dc2626;
  font-size: 13px;
`,fn=a.div`
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px;
  display: grid;
  gap: 10px;
  margin-bottom: 10px;
`,pn=a.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`,hn=a.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 10px 12px;
  background: #fff;
  margin-bottom: 10px;
  .left {
    display: flex;
    align-items: center;
    gap: 8px;
  }
`,oe=a.div`
  font-size: 12px;
  font-weight: 800;
  color: #6b7280;
  margin-top: 4px;
`,gn=a.span`
  margin-left: 8px;
  padding: 2px 6px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  border: 1px solid #e5e7eb;
  color: #374151;
  background: #f3f4f6;
`,mn=a.div`
  white-space: pre-wrap;
  border: 1px solid #f1f5f9;
  border-radius: 10px;
  padding: 10px;
  background: #f9fafb;
  color: #111827;
  font-size: 14px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* show 2 lines */
  -webkit-box-orient: vertical;
`,jn=a.div`
  display: grid;
  gap: 6px;
  margin-top: 6px;
`,bn=a.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 8px;
  border: 1px solid #f1f5f9;
  border-radius: 8px;
`,le=a.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  font-size: 12px;
  font-weight: 800;
  color: #374151;
  background: #fff;
  &[data-variant="present"] {
    background: #ecfdf5;
    color: #065f46;
    border-color: #a7f3d0;
  }
  &[data-variant="absent"] {
    background: #fee2e2;
    color: #7f1d1d;
    border-color: #fecaca;
  }
  &[data-variant="none"] {
    background: #f3f4f6;
    color: #6b7280;
    border-color: #e5e7eb;
  }
`;export{Mn as default};
