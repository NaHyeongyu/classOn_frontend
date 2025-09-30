import{u as kt,e as Ct,g as Et,r,j as e,v as Mt,G as Lt,k as L,S as q,s as Y,d as c,c as lt,b as $t}from"./index-CJzRppoi.js";import{C as It}from"./ConfirmDialog-D7cbhoS1.js";import{K as ge,U as zt,D as Nt,C as Rt,a as Bt}from"./KPI-CQWM21CD.js";import{k as Ot,m as et,g as Pt,f as Ft,j as Ut,h as Ht,n as Jt,o as Wt,p as tt,q as _t,r as Vt,c as Kt}from"./courses-l4AOqPcF.js";import{f as Gt}from"./dateUtils-CoPTMMCx.js";function In(){const u=kt(),{id:m,recordId:v,ymd:p}=Ct(),{error:b}=Et(),o=r.useMemo(()=>m?Number(m):null,[m]),y=r.useMemo(()=>v?Number(v):null,[v]),[x,$]=r.useState(null),[a,se]=r.useState(null),[F,dt]=r.useState([]),[ie,ve]=r.useState(!1),[Se,Te]=r.useState(null),[I,U]=r.useState({}),[re,H]=r.useState("idle"),[De,z]=r.useState(!1),[Ae,oe]=r.useState(null),[pt,ke]=r.useState(0),[Ce,Ee]=r.useState({}),[Me,ce]=r.useState({}),ut=r.useRef({}),[ft,Le]=r.useState(!1),[$e,Ie]=r.useState(null),[N,J]=r.useState({}),[xt,mt]=r.useState({}),[W,le]=r.useState(""),[R,de]=r.useState(""),[B,pe]=r.useState(""),[ze,C]=r.useState([]),[ht,Ne]=r.useState(!1),[Re,E]=r.useState(null),[Be,Oe]=r.useState(""),[gt,Pe]=r.useState({}),[ue,yt]=r.useState({}),[bt,_]=r.useState({}),[jt,fe]=r.useState(!1),[Fe,Ue]=r.useState(!1),xe=4,He=xe*1024*1024,Je=new Set(["image/jpeg","image/png","image/webp","application/pdf"]);r.useEffect(()=>{if(!o)return;let t=!1;async function s(){ve(!0),Te(null);try{const[i,l,f]=await Promise.all([Pt(o),Ft(o),Ut(o)]);if(!t){$(i);const d=l.find(h=>h.id===y)||null,n=p&&l.find(h=>h.recordDate===p)||null;se(d??n??null),dt(f)}}catch(i){t||Te(w(i,"수업 내역을 불러오지 못했습니다."))}finally{t||ve(!1)}}return s(),()=>{t=!0}},[o,y,p]),r.useEffect(()=>{const t=a?.recordDate||p||"",s=a?.startTime||x?.startTime||"",i=a?.endTime||x?.endTime||"";le(t),de(Z(s)),pe(Z(i))},[a?.recordDate,a?.startTime,a?.endTime,x?.startTime,x?.endTime,p]),r.useEffect(()=>{!ie&&p&&!a?.id&&z(!0)},[ie,p,a?.id]),r.useEffect(()=>{Oe(a?.content||"")},[a?.content]);const A=r.useCallback(()=>o?y?`attendance:${o}:${y}`:p?`attendanceDate:${o}:${p}`:`attendance:${o}:`:"attendance::",[o,y,p]),We=r.useMemo(()=>{if(!o)return{};const t=A();try{return JSON.parse(localStorage.getItem(t)||"{}")}catch{return{}}},[o,A,pt]),k=r.useMemo(()=>a?.id?Ce:We,[Ce,We,a?.id]);function wt(t,s){if(!o)return;const i=A(),l=(()=>{try{return JSON.parse(localStorage.getItem(i)||"{}")}catch{return{}}})();l[String(t)]=s;try{localStorage.setItem(i,JSON.stringify(l))}catch{}ke(f=>f+1),Ke()}function vt(t){if(!o)return;const s=A(),i=(()=>{try{return JSON.parse(localStorage.getItem(s)||"{}")}catch{return{}}})();Object.prototype.hasOwnProperty.call(i,String(t))&&delete i[String(t)];try{localStorage.setItem(s,JSON.stringify(i))}catch{}ke(l=>l+1)}const me=r.useMemo(()=>Object.values(k).filter(Boolean).length,[k]),_e=r.useMemo(()=>{const t=a?.recordDate||p||"";return t?new Date(t)<new Date(new Date().toDateString()):!1},[a?.recordDate,p]),V=r.useMemo(()=>_e?Object.keys(k).length:F.length,[_e,k,F.length]),S=r.useMemo(()=>V?Math.round(me/V*100):null,[me,V]),Ve=r.useMemo(()=>Xt(a?.startTime||x?.startTime,a?.endTime||x?.endTime),[a?.startTime,a?.endTime,x?.startTime,x?.endTime]);function Ke(t){const s=t||a?.recordDate||p||Gt(new Date);window.dispatchEvent(new CustomEvent("calendar:classes-refresh",{detail:{ymd:s}}))}const K=r.useMemo(()=>{const t=a?.recordDate||p||"",s=Q(a?.startTime||x?.startTime,a?.endTime||x?.endTime);return{dateLabel:t?at(t):"일자 미지정",timeLabel:s||"시간 미지정",hasDate:!!(a?.recordDate||p),hasTime:!!s}},[a?.recordDate,a?.startTime,a?.endTime,x?.startTime,x?.endTime,p]);r.useEffect(()=>{if(!o||!a?.id)return;let t=!1;async function s(){Le(!0),Ie(null);try{const i=await Ht(o,a.id);if(!t){const l={},f={},d={};i.forEach(n=>{l[n.studentId]=!!n.present,n.reason&&(f[n.studentId]=n.reason),n.studentName&&(d[n.studentId]=n.studentName)}),Ee(l),ce(f),mt(d)}}catch(i){t||Ie(w(i,"출석 정보를 불러오지 못했습니다."))}finally{t||Le(!1)}}return s(),()=>{t=!0}},[o,a]);async function Ge(t,s){const i=F.find(d=>d.id===t)?.name||"학생",l=s?"출석":"결석";if(window.confirm(`${i}을(를) ${l} 처리하시겠어요?`))if(o&&a?.id){J(d=>({...d,[t]:!0}));try{const d=Me[t]?.trim()||void 0;await et(o,a.id,t,{present:s,reason:d,source:"MANUAL"}),Ee(n=>({...n,[t]:s})),L(["/api/calendar/classes","/api/dashboard/summary"]),Ke(a?.recordDate??p??void 0)}catch(d){b(w(d,"출석 처리에 실패했습니다."))}finally{J(d=>({...d,[t]:!1}))}}else wt(t,s)}r.useEffect(()=>{if(!o||a?.id)return;const t=A().replace("attendance","attendanceNote");try{const s=JSON.parse(localStorage.getItem(t)||"{}");ce(s||{})}catch{}},[o,a?.id,A]),r.useEffect(()=>{if(re!=="success")return;const t=window.setTimeout(()=>H("idle"),2500);return()=>window.clearTimeout(t)},[re]);const G=r.useCallback(()=>o?y?`attachments:${o}:${y}`:p?`attachmentsDate:${o}:${p}`:`attachments:${o}:`:"attachments::",[o,y,p]),X=r.useCallback(()=>{try{return JSON.parse(localStorage.getItem(G())||"[]")}catch{return[]}},[G]),Xe=r.useCallback(t=>{try{localStorage.setItem(G(),JSON.stringify(t))}catch{}},[G]);function Ze(t){const s=new Date().toISOString();return t.map((i,l)=>({id:-1-l,filename:i.name,size:i.size,createdAt:s}))}r.useEffect(()=>{if(!o)return;let t=!1;async function s(){if(E(null),a?.id){Ne(!0);try{const i=await Jt(o,a.id);t||(C(i),qe(i))}catch(i){t||E(w(i,"첨부를 불러오지 못했습니다."))}finally{t||Ne(!1)}}else{const i=X(),l=new Date().toISOString(),f=i.map((d,n)=>({id:-1-n,filename:d.name,size:d.size,createdAt:l}));C(f)}}return s(),()=>{t=!0}},[o,a,y,p,X]);async function St(t){if(!t)return;const s=Array.from(t),i=s.filter(n=>n.size<=He),l=s.filter(n=>n.size>He),f=i.filter(n=>!n.type||Je.has(n.type)),d=i.filter(n=>n.type&&!Je.has(n.type));if(l.length>0?E(`용량 제한(${xe}MB)을 초과한 파일 제외: ${l.map(n=>n.name).join(", ")}`):E(null),d.length>0&&E(n=>[n,`허용되지 않는 형식 제외: ${d.map(h=>h.name).join(", ")}`].filter(Boolean).join(" / ")),f.length!==0)if(o&&a?.id)try{const h=f.slice(0,5),g=f.length-h.length;g>0&&E(O=>[O,`최대 5개까지만 업로드됩니다 (추가 ${g}개 제외)`].filter(Boolean).join(" / "));const M=await Wt(o,a.id,h);C(O=>[...M,...O]),qe(M)}catch(n){b(w(n,"업로드에 실패했습니다."))}else{const h=[...X(),...f.map(g=>({name:g.name,size:g.size}))];Xe(h),C(Ze(h))}}async function qe(t){const s=t.filter(d=>(d.contentType||"").startsWith("image/")),i=3;let l=0;const f=async()=>{for(;l<s.length;){const d=s[l++];if(!ue[d.id])try{_(g=>({...g,[d.id]:!0}));const n=await tt(o,a.id,d.id),h=URL.createObjectURL(n);yt(g=>({...g,[d.id]:h}))}catch{}finally{_(n=>({...n,[d.id]:!1}))}}};await Promise.all(Array.from({length:Math.min(i,s.length)},()=>f()))}r.useEffect(()=>()=>{Object.values(ue).forEach(t=>{try{URL.revokeObjectURL(t)}catch{}})},[]);async function Tt(t){if(!(!o||!a?.id))try{_(l=>({...l,[t.id]:!0}));const s=await tt(o,a.id,t.id),i=URL.createObjectURL(s);window.open(i,"_blank","noopener")}catch(s){b(w(s,"파일을 열 수 없습니다."))}finally{_(s=>({...s,[t.id]:!1}))}}async function Dt(t,s){if(window.confirm("이 파일을 삭제할까요?"))if(o&&a?.id){Pe(l=>({...l,[t]:!0}));try{await _t(o,a.id,t),C(l=>l.filter(f=>f.id!==t))}catch(l){b(w(l,"삭제에 실패했습니다."))}finally{Pe(l=>({...l,[t]:!1}))}}else{const f=X().filter(d=>d.name!==s);Xe(f),C(Ze(f))}}async function Ye(t,s){if(!(!o||!a?.id)){s==="content"&&H("idle"),U(i=>({...i,[s]:!0}));try{const i=await Vt(o,a.id,t);se(i),L("/api/calendar/classes"),L("/api/calendar/classes-range"),s==="content"&&H("success")}catch(i){b(w(i,"저장에 실패했습니다."))}finally{U(i=>({...i,[s]:!1}))}}}function Z(t){if(!t)return"";const[s,i]=t.split(":");return`${s}:${i}`}function Qe(t){if(!t)return;const s=t.split(":");if(s.length>=3)return`${s[0].padStart(2,"0")}:${s[1].padStart(2,"0")}:${s[2].padStart(2,"0")}`;if(s.length===2)return`${s[0].padStart(2,"0")}:${s[1].padStart(2,"0")}:00`}async function At(){if(!o)return;const t={recordDate:W||p||"",startTime:Qe(R),endTime:Qe(B)};if(oe(null),a?.id){await Ye(t,"when"),z(!1);return}U(s=>({...s,when:!0}));try{const s=await Kt(o,t);se(s),z(!1),L("/api/calendar/classes"),L("/api/calendar/classes-range")}catch(s){w(s,"").includes("HTTP 409")?oe("이미 등록된 수업이 있습니다."):oe("기록 생성에 실패했습니다.")}finally{U(s=>({...s,when:!1}))}}return e.jsxs(Zt,{children:[e.jsxs(qt,{children:[e.jsxs(An,{type:"button",onClick:()=>u(`/classes/${o}`),children:[kn," 뒤로"]}),e.jsxs(Qt,{children:[e.jsx("h2",{style:{margin:0},children:x?.title||"수업 내역 상세"}),e.jsxs(en,{children:[e.jsx(st,{"data-empty":String(!K.hasDate),children:K.dateLabel}),e.jsx(it,{"data-empty":String(!K.hasTime),children:K.timeLabel})]})]}),e.jsxs(Yt,{children:[e.jsx(Mt,{to:`/classes/${o}`,title:"수업으로",children:"수업으로"}),a?.id&&e.jsx(Lt,{type:"button",onClick:()=>fe(!0),children:"삭제"})]})]}),e.jsx(It,{open:jt,title:"수업 내역 삭제",message:`이 수업 내역을 삭제할까요?
첨부/출결/파일도 함께 삭제됩니다. 되돌릴 수 없습니다.`,confirmLabel:"영구 삭제",cancelLabel:"취소",tone:"danger",busy:Fe,onCancel:()=>{Fe||fe(!1)},onConfirm:async()=>{if(!(!o||!a?.id)){Ue(!0);try{await Ot(o,a.id),L("/api/calendar/classes"),fe(!1),u(`/classes/${o}/history`)}catch(t){b(w(t,"삭제에 실패했습니다."))}finally{Ue(!1)}}}}),Se&&e.jsx(ae,{children:Se}),ie&&e.jsx(P,{children:"불러오는 중..."}),e.jsxs(tn,{children:[e.jsx(ge,{title:"참석",icon:e.jsx(zt,{}),iconAccent:"indigo",value:e.jsxs(e.Fragment,{children:[me,"명"]}),footerLeft:e.jsxs("span",{children:["총 ",V,"명"]})}),e.jsx(ge,{title:"출석률",icon:e.jsx(Rt,{}),iconAccent:"green",value:e.jsx(e.Fragment,{children:S!=null?`${S}%`:"—"}),footerLeft:e.jsx(Nt,{$tone:S!=null&&S>=75?"positive":S!=null&&S<50?"negative":"neutral",children:S!=null?`${S}%`:"—"})}),e.jsx(ge,{title:"수업 시간",icon:e.jsx(Bt,{}),iconAccent:"violet",value:e.jsx(e.Fragment,{children:Ve!=null?`${Ve}분`:"—"}),footerLeft:e.jsx("span",{children:Q(a?.startTime||x?.startTime,a?.endTime||x?.endTime)||"-"})})]}),e.jsxs(nn,{children:[e.jsxs(an,{children:[e.jsxs(q,{children:[e.jsxs(ye,{children:[e.jsx(Y,{children:"수업 정보"}),De?e.jsxs("div",{style:{display:"inline-flex",gap:8,alignItems:"center"},children:[e.jsx(D,{onClick:()=>{At()},disabled:!!I.when,children:"저장"}),e.jsx(D,{onClick:()=>{z(!1),le(a?.recordDate||p||""),de(Z(a?.startTime||x?.startTime||"")),pe(Z(a?.endTime||x?.endTime||""))},children:"취소"})]}):e.jsx(D,{onClick:()=>z(!0),children:"수정"})]}),De?e.jsxs(rt,{children:[e.jsxs("li",{children:[e.jsx(ee,{children:"날짜"}),e.jsx(we,{children:e.jsx(be,{type:"date",value:W||"",onChange:t=>le(t.currentTarget.value)})})]}),e.jsxs("li",{children:[e.jsx(ee,{children:"시간"}),e.jsxs(we,{style:{display:"flex",alignItems:"center",gap:6},children:[e.jsx(be,{type:"time",step:300,value:R||"",onChange:t=>de(t.currentTarget.value)}),e.jsx("span",{children:"~"}),e.jsx(be,{type:"time",step:300,value:B||"",onChange:t=>pe(t.currentTarget.value)})]})]}),e.jsxs(rn,{children:[e.jsx(on,{children:"미리보기"}),e.jsxs(cn,{children:[e.jsx(st,{"data-empty":String(!(W||a?.recordDate||p)),children:at(W||a?.recordDate||p||"")}),e.jsx(it,{"data-empty":String(!(R&&B)),children:R&&B?Q(R,B):"시간 미지정"})]})]}),e.jsxs(ln,{children:[!a?.id&&e.jsx(te,{children:"저장 시 새 수업 내역을 생성합니다."}),I.when&&e.jsx(ne,{children:"저장 중..."}),Ae&&e.jsx(ae,{style:{marginLeft:8},children:Ae})]})]}):e.jsxs(rt,{children:[e.jsxs("li",{children:[e.jsx(ee,{children:"수업일"}),e.jsx(ot,{children:a?.recordDate||"-"})]}),e.jsxs("li",{children:[e.jsx(ee,{children:"수업시간"}),e.jsx(ot,{children:Q(a?.startTime||x?.startTime,a?.endTime||x?.endTime)||"-"})]})]})]}),e.jsxs(q,{children:[e.jsxs(ye,{children:[e.jsx(Y,{children:"수업 내용"}),a?.id?e.jsxs(mn,{children:[re==="success"&&!I.content&&e.jsx(hn,{role:"status",children:"저장 완료!"}),e.jsx(D,{onClick:()=>{Ye({content:Be},"content")},disabled:!!I.content,children:"저장"}),I.content&&e.jsx(ne,{children:"저장 중..."})]}):null]}),a?.id?e.jsx(yn,{rows:8,value:Be,onChange:t=>{Oe(t.currentTarget.value),H("idle")},placeholder:"수업 내용을 입력하세요",id:"contentArea"}):e.jsx(P,{children:"서버 기록이 없는 일정입니다. 생성 후 편집 가능합니다."})]}),e.jsxs(q,{children:[e.jsxs(ye,{children:[e.jsx(Y,{children:"수업 파일"}),e.jsxs("label",{style:{display:"inline-flex",alignItems:"center",gap:8},children:[e.jsx(D,{as:"span",children:"파일 추가"}),e.jsx("input",{type:"file",accept:"image/*,application/pdf",multiple:!0,style:{display:"none"},onChange:t=>St(t.currentTarget.files)})]})]}),Re&&e.jsx(ae,{children:Re}),ht&&e.jsx(P,{children:"불러오는 중..."}),ze.length===0?e.jsx(bn,{children:"첨부 없음"}):e.jsx(jn,{children:ze.map(t=>{const s=(t.contentType||"").startsWith("image/"),i=(t.contentType||"")==="application/pdf"||/\.pdf$/i.test(t.filename),l=ue[t.id];return e.jsxs(wn,{children:[e.jsx(vn,{children:s?l?e.jsx(Sn,{src:l,alt:t.filename}):e.jsx(je,{children:"이미지"}):i?e.jsx(je,{children:"PDF"}):e.jsx(je,{children:"FILE"})}),e.jsxs(Tn,{title:t.filename,children:[e.jsx("span",{className:"name",children:t.filename}),e.jsxs("span",{className:"size",children:[Math.round(t.size/1024)," KB"]})]}),e.jsxs(Dn,{children:[e.jsx(D,{onClick:()=>void Tt(t),disabled:!!bt[t.id],children:"보기"}),e.jsx(D,{"data-variant":"danger",disabled:!!gt[t.id],onClick:()=>void Dt(t.id,t.filename),children:"삭제"})]})]},t.id)})}),!a?.id&&e.jsx(te,{children:"서버 기록이 없어 로컬에만 저장됩니다."}),e.jsxs(te,{children:["파일 크기 제한: 최대 ",xe,"MB (이미지/PDF만 허용)"]})]})]}),e.jsx(sn,{children:e.jsxs(q,{children:[e.jsx(Y,{children:"출결 현황"}),e.jsx(P,{children:"학생별 출석 상태를 수동으로 처리하세요. 변경 시 확인 창이 표시됩니다."}),!a?.id&&e.jsx(te,{children:"서버 기록이 없어 출석 정보가 로컬에만 저장됩니다."}),ft&&e.jsx(P,{children:"출석 불러오는 중..."}),$e&&e.jsx(ae,{children:$e}),e.jsx(dn,{children:(()=>{const t=F.map(n=>({id:n.id,name:n.name})),s=new Set(t.map(n=>n.id)),i=Object.keys(k).map(Number).filter(n=>!s.has(n)).map(n=>({id:n,name:xt[n]||`학생#${n}`,isExtra:!0})),l=a?.recordDate||p||"";return((l?new Date(l)<new Date(new Date().toDateString()):!1)?i:[...t,...i]).map(n=>{const h=Object.prototype.hasOwnProperty.call(k,n.id),g=h?!!k[n.id]:null,M=h?g?"present":"absent":"none";return e.jsxs(pn,{children:[e.jsxs("div",{style:{display:"flex",alignItems:"center"},children:[e.jsx("strong",{children:n.name}),n.isExtra&&e.jsx(ne,{style:{marginLeft:8},children:"(과거 수강생)"}),e.jsx(gn,{"data-type":M,children:M==="present"?"출석":M==="absent"?"결석":"미처리"})]}),e.jsxs(un,{children:[e.jsx(fn,{placeholder:"메모",value:Me[n.id]||"",onChange:O=>{const he=O.currentTarget.value;if(ce(T=>({...T,[n.id]:he})),o){const T=A().replace("attendance","attendanceNote");try{const j=JSON.parse(localStorage.getItem(T)||"{}");j[String(n.id)]=he,localStorage.setItem(T,JSON.stringify(j))}catch{}}if(!n.isExtra&&o&&a?.id&&h){const T=ut.current;T[n.id]&&window.clearTimeout(T[n.id]),T[n.id]=window.setTimeout(async()=>{J(j=>({...j,[n.id]:!0}));try{const j=(he||"").trim()||void 0;await et(o,a.id,n.id,{present:g===!0,reason:j,source:"MANUAL"})}catch(j){console.error("메모 자동 저장 실패",j)}finally{J(j=>({...j,[n.id]:!1}))}},600)}},disabled:!!n.isExtra}),e.jsxs(xn,{children:[e.jsx(ct,{"data-active":String(g===!0),onClick:()=>{!n.isExtra&&g!==!0&&!N[n.id]&&Ge(n.id,!0)},disabled:!!N[n.id]||!!n.isExtra,children:"출석"}),e.jsx(ct,{"data-variant":"danger","data-active":String(h&&g===!1),onClick:()=>{!n.isExtra&&g!==!1&&!N[n.id]&&Ge(n.id,!1)},disabled:!!N[n.id]||!!n.isExtra,children:"결석"})]}),e.jsx(D,{title:a?.id?"서버 기록은 미처리로 되돌릴 수 없습니다.":"미처리로 초기화",onClick:()=>{a?.id||vt(n.id)},disabled:!!a?.id,children:"미처리"}),N[n.id]&&e.jsx(ne,{children:"저장 중..."})]})]},n.id)})})()})]})})]})]})}function nt(u){if(!u)return"";const[m,v]=u.split(":");return`${m}:${v}`}function Q(u,m){return u&&m?`${nt(u)} ~ ${nt(m)}`:""}function w(u,m){return typeof u=="string"?u:u&&typeof u=="object"&&"message"in u&&typeof u.message=="string"&&u.message||m}function at(u){if(!u)return"일자 미지정";try{const m=new Date(u);if(Number.isNaN(m.getTime()))return u;const v=String(m.getMonth()+1).padStart(2,"0"),p=String(m.getDate()).padStart(2,"0"),b="일월화수목금토"[m.getDay()];return`${v}월 ${p}일 (${b})`}catch{return u}}function Xt(u,m){if(!u||!m)return null;const[v,p]=u.split(":"),[b,o]=m.split(":"),y=Number(v)*60+Number(p),$=Number(b)*60+Number(o)-y;return $>=0?$:$+1440}const Zt=c.div` display:grid; gap:12px; `,qt=c.div` display:grid; grid-template-columns:auto 1fr auto; gap:12px; align-items:center; `,Yt=c.div` display:inline-flex; gap:8px; flex-wrap:wrap; justify-content:flex-end; `,Qt=c.div` display:flex; align-items:center; gap:16px; flex-wrap:wrap; `,en=c.div` display:inline-flex; align-items:center; gap:8px; flex-wrap:wrap; `,st=c.span`
  display:inline-flex;
  align-items:center;
  padding:6px 14px;
  border-radius:999px;
  background:linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
  color:#312e81;
  font-weight:800;
  font-size:13px;
  white-space:nowrap;
  &[data-empty='true']{
    background:#f3f4f6;
    color:#6b7280;
  }
`,it=c.span`
  display:inline-flex;
  align-items:center;
  padding:4px 12px;
  border-radius:999px;
  background:#f9fafb;
  color:#1f2937;
  font-weight:700;
  font-size:12px;
  border:1px solid #e5e7eb;
  white-space:nowrap;
  &[data-empty='true']{
    color:#6b7280;
    border-color:#e5e7eb;
  }
`,tn=c.div` display:grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap:12px; `,nn=c.div`
  display:flex; gap:12px; align-items:flex-start;
  @media (max-width: 1024px) { flex-direction: column; }
`,an=c.div` flex: 5 1 0; display:grid; gap:12px; align-content:flex-start; `,sn=c.div` flex: 7 1 0; display:grid; gap:12px; align-content:flex-start; `,ye=c.div` display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; `,rt=c.ul`
  list-style:none; padding:0; margin:0; display:grid; gap:10px;
  li { display:grid; grid-template-columns: 110px 1fr; align-items:center; }
`,ee=c.span` color:#6b7280; font-size:12px; font-weight:700; `,we=c.span` color:#111827; font-size:14px; `,ot=c(we)`
  font-weight:800;
  font-size:15px;
`,rn=c.div`
  grid-column: 1 / -1;
  display:flex;
  align-items:center;
  gap:12px;
  padding:6px 10px;
  border:1px dashed #e5e7eb;
  border-radius:10px;
  background:#f9fafb;
`,on=c.span` color:#6b7280; font-size:12px; font-weight:700; `,cn=c.div` display:flex; gap:8px; flex-wrap:wrap; align-items:center; `,be=c.input` height:32px; padding:0 10px; border:1px solid #e5e7eb; border-radius:8px; font-size:13px; `,ln=c.div` grid-column: 1 / -1; display:flex; gap:8px; align-items:center; margin-top:2px; `,dn=c.div` display:grid; gap:8px; `,pn=c.div` display:flex; align-items:center; justify-content:space-between; padding:10px; border:1px solid #f1f5f9; border-radius:10px; background:#f9fafb; `,un=c.div` display:flex; align-items:center; gap:8px; `,fn=c.input` height:28px; width: 180px; padding:0 8px; border:1px solid #e5e7eb; border-radius:8px; font-size:12px; background:#fff; `,xn=c.div` display:inline-flex; gap:6px; `,mn=c.div` display:inline-flex; gap:8px; align-items:center; flex-wrap:wrap; `,hn=c.span`
  display:inline-flex;
  align-items:center;
  gap:4px;
  padding:2px 8px;
  border-radius:999px;
  background:#d1fae5;
  color:#047857;
  font-size:11px;
  font-weight:700;
  &:before {
    content:'✔';
  }
`,ct=c.button`
  ${lt.outline};
  height: 32px;
  padding: 0 12px;
  font-size: 13px;
  &[data-active='true']{ background:#ecfdf5; color:#065f46; border-color:#a7f3d0; }
  &[data-variant='danger']{ background:#fff; color:#b91c1c; }
  &[data-variant='danger'][data-active='true']{ background:#fee2e2; color:#7f1d1d; border-color:#fecaca; }
  &:disabled{ opacity:0.6; cursor:not-allowed; }
`,gn=c.span`
  margin-left:8px; padding:2px 6px; border-radius:999px; font-size:11px; font-weight:700; border:1px solid #e5e7eb; color:#374151; background:#f3f4f6;
  &[data-type='present']{ background:#ecfdf5; color:#065f46; border-color:#a7f3d0; }
  &[data-type='absent']{ background:#fee2e2; color:#7f1d1d; border-color:#fecaca; }
  &[data-type='none']{ background:#f3f4f6; color:#6b7280; border-color:#e5e7eb; }
`,yn=c.textarea` width:100%; border:1px solid #e5e7eb; border-radius:10px; padding:8px 10px; font-size:14px; `;c.div` display:grid; gap:6px; margin-top:6px; `;c.div` display:flex; align-items:center; justify-content:space-between; padding:6px 8px; border:1px solid #f1f5f9; border-radius:8px; `;const bn=c.div`
  color: #9ca3af; font-size: 13px; padding: 12px 0;
`,jn=c.div`
  display: grid; gap: 12px; margin-top: 10px;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
`,wn=c.div`
  border: 1px solid #e5e7eb; border-radius: 12px; background: #fff; padding: 10px; display: grid; gap: 8px;
`,vn=c.div`
  height: 120px; border-radius: 8px; background: #f3f4f6; display: grid; place-items: center; overflow: hidden;
`,Sn=c.img`
  width: 100%; height: 100%; object-fit: cover; display: block;
`,je=c.div`
  color: #6b7280; font-size: 12px;
`,Tn=c.div`
  display: flex; justify-content: space-between; align-items: center; gap: 8px;
  .name { font-size: 12px; color: #111827; flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .size { font-size: 11px; color: #9ca3af; }
`,Dn=c.div`
  display: flex; gap: 8px; justify-content: flex-end;
`,D=c($t)`
  height: 32px;
  padding: 0 12px;
  font-size: 12px;
  &[data-variant='danger']{
    border-color:#fecaca;
    color:#b91c1c;
  }
`,te=c.div` color:#6b7280; font-size:12px; margin-top:4px; `,ne=c.span` color:#9ca3af; font-size:12px; `,ae=c.div` background:#fee2e2; color:#b91c1c; border:1px solid #fecaca; padding:10px 12px; border-radius:10px; font-size:13px; `,P=c.div` color:#6b7280; font-size:12px; `,An=c.button`
  ${lt.outline};
  height: 36px;
  padding: 0 14px;
  font-weight: 600;
  font-size: 13px;
`,kn=e.jsx("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"15 18 9 12 15 6"})});export{In as default};
