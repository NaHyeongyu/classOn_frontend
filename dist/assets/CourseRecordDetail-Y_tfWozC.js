import{u as At,e as Et,g as Ct,r,j as e,v as Mt,G as $t,k as z,S as Y,s as Q,d as c,c as lt,b as Lt}from"./index-Cq8NHvix.js";import{C as zt}from"./ConfirmDialog-ByhVw2ZS.js";import{K as ge,U as It,D as Nt,C as Rt,a as Bt}from"./KPI-DwLOj2Lp.js";import{k as Pt,m as et,g as Ot,f as Ft,j as Ut,h as Ht,n as _t,p as Jt,o as Wt,q as tt,r as Vt,s as Kt,c as Gt}from"./courses-BtQDTuwP.js";import{f as Xt}from"./dateUtils-CoPTMMCx.js";function In(){const u=At(),{id:h,recordId:T,ymd:p}=Et(),{error:S}=Ct(),o=r.useMemo(()=>h?Number(h):null,[h]),j=r.useMemo(()=>T?Number(T):null,[T]),[x,I]=r.useState(null),[a,ie]=r.useState(null),[U,dt]=r.useState([]),[re,Se]=r.useState(!1),[ve,Te]=r.useState(null),[N,H]=r.useState({}),[oe,_]=r.useState("idle"),[De,R]=r.useState(!1),[ke,ce]=r.useState(null),[pt,Ae]=r.useState(0),[Ee,Ce]=r.useState({}),[Me,le]=r.useState({}),ut=r.useRef({}),[ft,$e]=r.useState(!1),[Le,ze]=r.useState(null),[B,J]=r.useState({}),[xt,mt]=r.useState({}),[W,de]=r.useState(""),[P,pe]=r.useState(""),[O,ue]=r.useState(""),[Ie,$]=r.useState([]),[ht,Ne]=r.useState(!1),[Re,L]=r.useState(null),[Be,Pe]=r.useState(""),[gt,Oe]=r.useState({}),[fe,yt]=r.useState({}),[bt,V]=r.useState({}),[jt,xe]=r.useState(!1),[Fe,Ue]=r.useState(!1),me=4,He=me*1024*1024,_e=new Set(["image/jpeg","image/png","image/webp","application/pdf"]);r.useEffect(()=>{if(!o)return;let t=!1;async function s(){Se(!0),Te(null);try{const[i,l,f]=await Promise.all([Ot(o),Ft(o),Ut(o)]);if(!t){I(i);const d=l.find(m=>m.id===j)||null,n=p&&l.find(m=>m.recordDate===p)||null;ie(d??n??null),dt(f)}}catch(i){t||Te(v(i,"수업 내역을 불러오지 못했습니다."))}finally{t||Se(!1)}}return s(),()=>{t=!0}},[o,j,p]),r.useEffect(()=>{const t=a?.recordDate||p||"",s=a?.startTime||x?.startTime||"",i=a?.endTime||x?.endTime||"";de(t),pe(q(s)),ue(q(i))},[a?.recordDate,a?.startTime,a?.endTime,x?.startTime,x?.endTime,p]),r.useEffect(()=>{!re&&p&&!a?.id&&R(!0)},[re,p,a?.id]),r.useEffect(()=>{Pe(a?.content||"")},[a?.content]);const A=r.useCallback(()=>o?j?`attendance:${o}:${j}`:p?`attendanceDate:${o}:${p}`:`attendance:${o}:`:"attendance::",[o,j,p]),Je=r.useMemo(()=>{if(!o)return{};const t=A();try{return JSON.parse(localStorage.getItem(t)||"{}")}catch{return{}}},[o,A,pt]),E=r.useMemo(()=>a?.id?Ee:Je,[Ee,Je,a?.id]);function wt(t,s){if(!o)return;const i=A(),l=(()=>{try{return JSON.parse(localStorage.getItem(i)||"{}")}catch{return{}}})();l[String(t)]=s;try{localStorage.setItem(i,JSON.stringify(l))}catch{}Ae(f=>f+1),Ke()}function St(t){if(!o)return;const s=A(),i=(()=>{try{return JSON.parse(localStorage.getItem(s)||"{}")}catch{return{}}})();Object.prototype.hasOwnProperty.call(i,String(t))&&delete i[String(t)];try{localStorage.setItem(s,JSON.stringify(i))}catch{}Ae(l=>l+1)}const he=r.useMemo(()=>Object.values(E).filter(Boolean).length,[E]),We=r.useMemo(()=>{const t=a?.recordDate||p||"";return t?new Date(t)<new Date(new Date().toDateString()):!1},[a?.recordDate,p]),K=r.useMemo(()=>We?Object.keys(E).length:U.length,[We,E,U.length]),D=r.useMemo(()=>K?Math.round(he/K*100):null,[he,K]),Ve=r.useMemo(()=>Zt(a?.startTime||x?.startTime,a?.endTime||x?.endTime),[a?.startTime,a?.endTime,x?.startTime,x?.endTime]);function Ke(t){const s=t||a?.recordDate||p||Xt(new Date);window.dispatchEvent(new CustomEvent("calendar:classes-refresh",{detail:{ymd:s}}))}const G=r.useMemo(()=>{const t=a?.recordDate||p||"",s=ee(a?.startTime||x?.startTime,a?.endTime||x?.endTime);return{dateLabel:t?at(t):"일자 미지정",timeLabel:s||"시간 미지정",hasDate:!!(a?.recordDate||p),hasTime:!!s}},[a?.recordDate,a?.startTime,a?.endTime,x?.startTime,x?.endTime,p]);r.useEffect(()=>{if(!o||!a?.id)return;let t=!1;async function s(){$e(!0),ze(null);try{const i=await Ht(o,a.id);if(!t){const l={},f={},d={};i.forEach(n=>{l[n.studentId]=!!n.present,n.reason&&(f[n.studentId]=n.reason),n.studentName&&(d[n.studentId]=n.studentName)}),Ce(l),le(f),mt(d)}}catch(i){t||ze(v(i,"출석 정보를 불러오지 못했습니다."))}finally{t||$e(!1)}}return s(),()=>{t=!0}},[o,a]);async function Ge(t,s){const i=U.find(d=>d.id===t)?.name||"학생",l=s?"출석":"결석";if(window.confirm(`${i}을(를) ${l} 처리하시겠어요?`))if(o&&a?.id){J(d=>({...d,[t]:!0}));try{const d=Me[t]?.trim()||void 0;await et(o,a.id,t,{present:s,reason:d,source:"MANUAL"}),Ce(n=>({...n,[t]:s})),z(["/api/calendar/classes","/api/dashboard/summary"]),Ke(a?.recordDate??p??void 0)}catch(d){S(v(d,"출석 처리에 실패했습니다."))}finally{J(d=>({...d,[t]:!1}))}}else wt(t,s)}r.useEffect(()=>{if(!o||a?.id)return;const t=A().replace("attendance","attendanceNote");try{const s=JSON.parse(localStorage.getItem(t)||"{}");le(s||{})}catch{}},[o,a?.id,A]),r.useEffect(()=>{if(oe!=="success")return;const t=window.setTimeout(()=>_("idle"),2500);return()=>window.clearTimeout(t)},[oe]);const X=r.useCallback(()=>o?j?`attachments:${o}:${j}`:p?`attachmentsDate:${o}:${p}`:`attachments:${o}:`:"attachments::",[o,j,p]),Z=r.useCallback(()=>{try{return JSON.parse(localStorage.getItem(X())||"[]")}catch{return[]}},[X]),Xe=r.useCallback(t=>{try{localStorage.setItem(X(),JSON.stringify(t))}catch{}},[X]);function Ze(t){const s=new Date().toISOString();return t.map((i,l)=>({id:-1-l,filename:i.name,size:i.size,createdAt:s}))}r.useEffect(()=>{if(!o)return;let t=!1;async function s(){if(L(null),a?.id){Ne(!0);try{const i=await _t(o,a.id,{presign:!0});t||($(i),qe(i))}catch(i){t||L(v(i,"첨부를 불러오지 못했습니다."))}finally{t||Ne(!1)}}else{const i=Z(),l=new Date().toISOString(),f=i.map((d,n)=>({id:-1-n,filename:d.name,size:d.size,createdAt:l}));$(f)}}return s(),()=>{t=!0}},[o,a,j,p,Z]);async function vt(t){if(!t)return;const s=Array.from(t),i=s.filter(n=>n.size<=He),l=s.filter(n=>n.size>He),f=i.filter(n=>!n.type||_e.has(n.type)),d=i.filter(n=>n.type&&!_e.has(n.type));if(l.length>0?L(`용량 제한(${me}MB)을 초과한 파일 제외: ${l.map(n=>n.name).join(", ")}`):L(null),d.length>0&&L(n=>[n,`허용되지 않는 형식 제외: ${d.map(m=>m.name).join(", ")}`].filter(Boolean).join(" / ")),f.length!==0)if(o&&a?.id)try{const m=f.slice(0,5),g=f.length-m.length;g>0&&L(y=>[y,`최대 5개까지만 업로드됩니다 (추가 ${g}개 제외)`].filter(Boolean).join(" / "));const C=[];for(const y of m){const M=await Jt(o,a.id,y.name,y.type||"application/octet-stream"),w=await fetch(M.url,{method:"PUT",headers:M.headers,body:y});if(!w.ok)throw new Error(`S3 업로드 실패: HTTP ${w.status}`);const b=await Wt(o,a.id,{key:M.key,filename:y.name,contentType:y.type||"application/octet-stream",size:y.size});C.push(b)}$(y=>[...C,...y]),qe(C)}catch(n){S(v(n,"업로드에 실패했습니다."))}else{const m=[...Z(),...f.map(g=>({name:g.name,size:g.size}))];Xe(m),$(Ze(m))}}async function qe(t){const s=t.filter(d=>(d.contentType||"").startsWith("image/")),i=3;let l=0;const f=async()=>{for(;l<s.length;){const d=s[l++];if(!fe[d.id])try{V(m=>({...m,[d.id]:!0}));const n=d.downloadUrl||(await tt(o,a.id,d.id)).url;yt(m=>({...m,[d.id]:n}))}catch{}finally{V(n=>({...n,[d.id]:!1}))}}};await Promise.all(Array.from({length:Math.min(i,s.length)},()=>f()))}r.useEffect(()=>()=>{Object.values(fe).forEach(t=>{try{URL.revokeObjectURL(t)}catch{}})},[]);async function Tt(t){if(!(!o||!a?.id))try{V(l=>({...l,[t.id]:!0}));const s=t.downloadUrl;if(s){window.open(s,"_blank","noopener");return}const{url:i}=await tt(o,a.id,t.id);window.open(i,"_blank","noopener")}catch(s){S(v(s,"파일을 열 수 없습니다."))}finally{V(s=>({...s,[t.id]:!1}))}}async function Dt(t,s){if(window.confirm("이 파일을 삭제할까요?"))if(o&&a?.id){Oe(l=>({...l,[t]:!0}));try{await Vt(o,a.id,t),$(l=>l.filter(f=>f.id!==t))}catch(l){S(v(l,"삭제에 실패했습니다."))}finally{Oe(l=>({...l,[t]:!1}))}}else{const f=Z().filter(d=>d.name!==s);Xe(f),$(Ze(f))}}async function Ye(t,s){if(!(!o||!a?.id)){s==="content"&&_("idle"),H(i=>({...i,[s]:!0}));try{const i=await Kt(o,a.id,t);ie(i),z("/api/calendar/classes"),z("/api/calendar/classes-range"),s==="content"&&_("success")}catch(i){S(v(i,"저장에 실패했습니다."))}finally{H(i=>({...i,[s]:!1}))}}}function q(t){if(!t)return"";const[s,i]=t.split(":");return`${s}:${i}`}function Qe(t){if(!t)return;const s=t.split(":");if(s.length>=3)return`${s[0].padStart(2,"0")}:${s[1].padStart(2,"0")}:${s[2].padStart(2,"0")}`;if(s.length===2)return`${s[0].padStart(2,"0")}:${s[1].padStart(2,"0")}:00`}async function kt(){if(!o)return;const t={recordDate:W||p||"",startTime:Qe(P),endTime:Qe(O)};if(ce(null),a?.id){await Ye(t,"when"),R(!1);return}H(s=>({...s,when:!0}));try{const s=await Gt(o,t);ie(s),R(!1),z("/api/calendar/classes"),z("/api/calendar/classes-range")}catch(s){v(s,"").includes("HTTP 409")?ce("이미 등록된 수업이 있습니다."):ce("기록 생성에 실패했습니다.")}finally{H(s=>({...s,when:!1}))}}return e.jsxs(qt,{children:[e.jsxs(Yt,{children:[e.jsxs(An,{type:"button",onClick:()=>u(`/classes/${o}`),children:[En," 뒤로"]}),e.jsxs(en,{children:[e.jsx("h2",{style:{margin:0},children:x?.title||"수업 내역 상세"}),e.jsxs(tn,{children:[e.jsx(st,{"data-empty":String(!G.hasDate),children:G.dateLabel}),e.jsx(it,{"data-empty":String(!G.hasTime),children:G.timeLabel})]})]}),e.jsxs(Qt,{children:[e.jsx(Mt,{to:`/classes/${o}`,title:"수업으로",children:"수업으로"}),a?.id&&e.jsx($t,{type:"button",onClick:()=>xe(!0),children:"삭제"})]})]}),e.jsx(zt,{open:jt,title:"수업 내역 삭제",message:`이 수업 내역을 삭제할까요?
첨부/출결/파일도 함께 삭제됩니다. 되돌릴 수 없습니다.`,confirmLabel:"영구 삭제",cancelLabel:"취소",tone:"danger",busy:Fe,onCancel:()=>{Fe||xe(!1)},onConfirm:async()=>{if(!(!o||!a?.id)){Ue(!0);try{await Pt(o,a.id),z("/api/calendar/classes"),xe(!1),u(`/classes/${o}/history`)}catch(t){S(v(t,"삭제에 실패했습니다."))}finally{Ue(!1)}}}}),ve&&e.jsx(se,{children:ve}),re&&e.jsx(F,{children:"불러오는 중..."}),e.jsxs(nn,{children:[e.jsx(ge,{title:"참석",icon:e.jsx(It,{}),iconAccent:"indigo",value:e.jsxs(e.Fragment,{children:[he,"명"]}),footerLeft:e.jsxs("span",{children:["총 ",K,"명"]})}),e.jsx(ge,{title:"출석률",icon:e.jsx(Rt,{}),iconAccent:"green",value:e.jsx(e.Fragment,{children:D!=null?`${D}%`:"—"}),footerLeft:e.jsx(Nt,{$tone:D!=null&&D>=75?"positive":D!=null&&D<50?"negative":"neutral",children:D!=null?`${D}%`:"—"})}),e.jsx(ge,{title:"수업 시간",icon:e.jsx(Bt,{}),iconAccent:"violet",value:e.jsx(e.Fragment,{children:Ve!=null?`${Ve}분`:"—"}),footerLeft:e.jsx("span",{children:ee(a?.startTime||x?.startTime,a?.endTime||x?.endTime)||"-"})})]}),e.jsxs(an,{children:[e.jsxs(sn,{children:[e.jsxs(Y,{children:[e.jsxs(ye,{children:[e.jsx(Q,{children:"수업 정보"}),De?e.jsxs("div",{style:{display:"inline-flex",gap:8,alignItems:"center"},children:[e.jsx(k,{onClick:()=>{kt()},disabled:!!N.when,children:"저장"}),e.jsx(k,{onClick:()=>{R(!1),de(a?.recordDate||p||""),pe(q(a?.startTime||x?.startTime||"")),ue(q(a?.endTime||x?.endTime||""))},children:"취소"})]}):e.jsx(k,{onClick:()=>R(!0),children:"수정"})]}),De?e.jsxs(rt,{children:[e.jsxs("li",{children:[e.jsx(te,{children:"날짜"}),e.jsx(we,{children:e.jsx(be,{type:"date",value:W||"",onChange:t=>de(t.currentTarget.value)})})]}),e.jsxs("li",{children:[e.jsx(te,{children:"시간"}),e.jsxs(we,{style:{display:"flex",alignItems:"center",gap:6},children:[e.jsx(be,{type:"time",step:300,value:P||"",onChange:t=>pe(t.currentTarget.value)}),e.jsx("span",{children:"~"}),e.jsx(be,{type:"time",step:300,value:O||"",onChange:t=>ue(t.currentTarget.value)})]})]}),e.jsxs(on,{children:[e.jsx(cn,{children:"미리보기"}),e.jsxs(ln,{children:[e.jsx(st,{"data-empty":String(!(W||a?.recordDate||p)),children:at(W||a?.recordDate||p||"")}),e.jsx(it,{"data-empty":String(!(P&&O)),children:P&&O?ee(P,O):"시간 미지정"})]})]}),e.jsxs(dn,{children:[!a?.id&&e.jsx(ne,{children:"저장 시 새 수업 내역을 생성합니다."}),N.when&&e.jsx(ae,{children:"저장 중..."}),ke&&e.jsx(se,{style:{marginLeft:8},children:ke})]})]}):e.jsxs(rt,{children:[e.jsxs("li",{children:[e.jsx(te,{children:"수업일"}),e.jsx(ot,{children:a?.recordDate||"-"})]}),e.jsxs("li",{children:[e.jsx(te,{children:"수업시간"}),e.jsx(ot,{children:ee(a?.startTime||x?.startTime,a?.endTime||x?.endTime)||"-"})]})]})]}),e.jsxs(Y,{children:[e.jsxs(ye,{children:[e.jsx(Q,{children:"수업 내용"}),a?.id?e.jsxs(hn,{children:[oe==="success"&&!N.content&&e.jsx(gn,{role:"status",children:"저장 완료!"}),e.jsx(k,{onClick:()=>{Ye({content:Be},"content")},disabled:!!N.content,children:"저장"}),N.content&&e.jsx(ae,{children:"저장 중..."})]}):null]}),a?.id?e.jsx(bn,{rows:8,value:Be,onChange:t=>{Pe(t.currentTarget.value),_("idle")},placeholder:"수업 내용을 입력하세요",id:"contentArea"}):e.jsx(F,{children:"서버 기록이 없는 일정입니다. 생성 후 편집 가능합니다."})]}),e.jsxs(Y,{children:[e.jsxs(ye,{children:[e.jsx(Q,{children:"수업 파일"}),e.jsxs("label",{style:{display:"inline-flex",alignItems:"center",gap:8},children:[e.jsx(k,{as:"span",children:"파일 추가"}),e.jsx("input",{type:"file",accept:"image/*,application/pdf",multiple:!0,style:{display:"none"},onChange:t=>vt(t.currentTarget.files)})]})]}),Re&&e.jsx(se,{children:Re}),ht&&e.jsx(F,{children:"불러오는 중..."}),Ie.length===0?e.jsx(jn,{children:"첨부 없음"}):e.jsx(wn,{children:Ie.map(t=>{const s=(t.contentType||"").startsWith("image/"),i=(t.contentType||"")==="application/pdf"||/\.pdf$/i.test(t.filename),l=fe[t.id];return e.jsxs(Sn,{children:[e.jsx(vn,{children:s?l?e.jsx(Tn,{src:l,alt:t.filename}):e.jsx(je,{children:"이미지"}):i?e.jsx(je,{children:"PDF"}):e.jsx(je,{children:"FILE"})}),e.jsxs(Dn,{title:t.filename,children:[e.jsx("span",{className:"name",children:t.filename}),e.jsxs("span",{className:"size",children:[Math.round(t.size/1024)," KB"]})]}),e.jsxs(kn,{children:[e.jsx(k,{onClick:()=>void Tt(t),disabled:!!bt[t.id],children:"보기"}),e.jsx(k,{"data-variant":"danger",disabled:!!gt[t.id],onClick:()=>void Dt(t.id,t.filename),children:"삭제"})]})]},t.id)})}),!a?.id&&e.jsx(ne,{children:"서버 기록이 없어 로컬에만 저장됩니다."}),e.jsxs(ne,{children:["파일 크기 제한: 최대 ",me,"MB (이미지/PDF만 허용)"]})]})]}),e.jsx(rn,{children:e.jsxs(Y,{children:[e.jsx(Q,{children:"출결 현황"}),e.jsx(F,{children:"학생별 출석 상태를 수동으로 처리하세요. 변경 시 확인 창이 표시됩니다."}),!a?.id&&e.jsx(ne,{children:"서버 기록이 없어 출석 정보가 로컬에만 저장됩니다."}),ft&&e.jsx(F,{children:"출석 불러오는 중..."}),Le&&e.jsx(se,{children:Le}),e.jsx(pn,{children:(()=>{const t=U.map(n=>({id:n.id,name:n.name})),s=new Set(t.map(n=>n.id)),i=Object.keys(E).map(Number).filter(n=>!s.has(n)).map(n=>({id:n,name:xt[n]||`학생#${n}`,isExtra:!0})),l=a?.recordDate||p||"";return((l?new Date(l)<new Date(new Date().toDateString()):!1)?i:[...t,...i]).map(n=>{const m=Object.prototype.hasOwnProperty.call(E,n.id),g=m?!!E[n.id]:null,C=m?g?"present":"absent":"none";return e.jsxs(un,{children:[e.jsxs("div",{style:{display:"flex",alignItems:"center"},children:[e.jsx("strong",{children:n.name}),n.isExtra&&e.jsx(ae,{style:{marginLeft:8},children:"(과거 수강생)"}),e.jsx(yn,{"data-type":C,children:C==="present"?"출석":C==="absent"?"결석":"미처리"})]}),e.jsxs(fn,{children:[e.jsx(xn,{placeholder:"메모",value:Me[n.id]||"",onChange:y=>{const M=y.currentTarget.value;if(le(w=>({...w,[n.id]:M})),o){const w=A().replace("attendance","attendanceNote");try{const b=JSON.parse(localStorage.getItem(w)||"{}");b[String(n.id)]=M,localStorage.setItem(w,JSON.stringify(b))}catch{}}if(!n.isExtra&&o&&a?.id&&m){const w=ut.current;w[n.id]&&window.clearTimeout(w[n.id]),w[n.id]=window.setTimeout(async()=>{J(b=>({...b,[n.id]:!0}));try{const b=(M||"").trim()||void 0;await et(o,a.id,n.id,{present:g===!0,reason:b,source:"MANUAL"})}catch(b){console.error("메모 자동 저장 실패",b)}finally{J(b=>({...b,[n.id]:!1}))}},600)}},disabled:!!n.isExtra}),e.jsxs(mn,{children:[e.jsx(ct,{"data-active":String(g===!0),onClick:()=>{!n.isExtra&&g!==!0&&!B[n.id]&&Ge(n.id,!0)},disabled:!!B[n.id]||!!n.isExtra,children:"출석"}),e.jsx(ct,{"data-variant":"danger","data-active":String(m&&g===!1),onClick:()=>{!n.isExtra&&g!==!1&&!B[n.id]&&Ge(n.id,!1)},disabled:!!B[n.id]||!!n.isExtra,children:"결석"})]}),e.jsx(k,{title:a?.id?"서버 기록은 미처리로 되돌릴 수 없습니다.":"미처리로 초기화",onClick:()=>{a?.id||St(n.id)},disabled:!!a?.id,children:"미처리"}),B[n.id]&&e.jsx(ae,{children:"저장 중..."})]})]},n.id)})})()})]})})]})]})}function nt(u){if(!u)return"";const[h,T]=u.split(":");return`${h}:${T}`}function ee(u,h){return u&&h?`${nt(u)} ~ ${nt(h)}`:""}function v(u,h){return typeof u=="string"?u:u&&typeof u=="object"&&"message"in u&&typeof u.message=="string"&&u.message||h}function at(u){if(!u)return"일자 미지정";try{const h=new Date(u);if(Number.isNaN(h.getTime()))return u;const T=String(h.getMonth()+1).padStart(2,"0"),p=String(h.getDate()).padStart(2,"0"),S="일월화수목금토"[h.getDay()];return`${T}월 ${p}일 (${S})`}catch{return u}}function Zt(u,h){if(!u||!h)return null;const[T,p]=u.split(":"),[S,o]=h.split(":"),j=Number(T)*60+Number(p),I=Number(S)*60+Number(o)-j;return I>=0?I:I+1440}const qt=c.div` display:grid; gap:12px; `,Yt=c.div` display:grid; grid-template-columns:auto 1fr auto; gap:12px; align-items:center; `,Qt=c.div` display:inline-flex; gap:8px; flex-wrap:wrap; justify-content:flex-end; `,en=c.div` display:flex; align-items:center; gap:16px; flex-wrap:wrap; `,tn=c.div` display:inline-flex; align-items:center; gap:8px; flex-wrap:wrap; `,st=c.span`
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
`,nn=c.div` display:grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap:12px; `,an=c.div`
  display:flex; gap:12px; align-items:flex-start;
  @media (max-width: 1024px) { flex-direction: column; }
`,sn=c.div` flex: 5 1 0; display:grid; gap:12px; align-content:flex-start; `,rn=c.div` flex: 7 1 0; display:grid; gap:12px; align-content:flex-start; `,ye=c.div` display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; `,rt=c.ul`
  list-style:none; padding:0; margin:0; display:grid; gap:10px;
  li { display:grid; grid-template-columns: 110px 1fr; align-items:center; }
`,te=c.span` color:#6b7280; font-size:12px; font-weight:700; `,we=c.span` color:#111827; font-size:14px; `,ot=c(we)`
  font-weight:800;
  font-size:15px;
`,on=c.div`
  grid-column: 1 / -1;
  display:flex;
  align-items:center;
  gap:12px;
  padding:6px 10px;
  border:1px dashed #e5e7eb;
  border-radius:10px;
  background:#f9fafb;
`,cn=c.span` color:#6b7280; font-size:12px; font-weight:700; `,ln=c.div` display:flex; gap:8px; flex-wrap:wrap; align-items:center; `,be=c.input` height:32px; padding:0 10px; border:1px solid #e5e7eb; border-radius:8px; font-size:13px; `,dn=c.div` grid-column: 1 / -1; display:flex; gap:8px; align-items:center; margin-top:2px; `,pn=c.div` display:grid; gap:8px; `,un=c.div` display:flex; align-items:center; justify-content:space-between; padding:10px; border:1px solid #f1f5f9; border-radius:10px; background:#f9fafb; `,fn=c.div` display:flex; align-items:center; gap:8px; `,xn=c.input` height:28px; width: 180px; padding:0 8px; border:1px solid #e5e7eb; border-radius:8px; font-size:12px; background:#fff; `,mn=c.div` display:inline-flex; gap:6px; `,hn=c.div` display:inline-flex; gap:8px; align-items:center; flex-wrap:wrap; `,gn=c.span`
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
`,yn=c.span`
  margin-left:8px; padding:2px 6px; border-radius:999px; font-size:11px; font-weight:700; border:1px solid #e5e7eb; color:#374151; background:#f3f4f6;
  &[data-type='present']{ background:#ecfdf5; color:#065f46; border-color:#a7f3d0; }
  &[data-type='absent']{ background:#fee2e2; color:#7f1d1d; border-color:#fecaca; }
  &[data-type='none']{ background:#f3f4f6; color:#6b7280; border-color:#e5e7eb; }
`,bn=c.textarea` width:100%; border:1px solid #e5e7eb; border-radius:10px; padding:8px 10px; font-size:14px; `;c.div` display:grid; gap:6px; margin-top:6px; `;c.div` display:flex; align-items:center; justify-content:space-between; padding:6px 8px; border:1px solid #f1f5f9; border-radius:8px; `;const jn=c.div`
  color: #9ca3af; font-size: 13px; padding: 12px 0;
`,wn=c.div`
  display: grid; gap: 12px; margin-top: 10px;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
`,Sn=c.div`
  border: 1px solid #e5e7eb; border-radius: 12px; background: #fff; padding: 10px; display: grid; gap: 8px;
`,vn=c.div`
  height: 120px; border-radius: 8px; background: #f3f4f6; display: grid; place-items: center; overflow: hidden;
`,Tn=c.img`
  width: 100%; height: 100%; object-fit: cover; display: block;
`,je=c.div`
  color: #6b7280; font-size: 12px;
`,Dn=c.div`
  display: flex; justify-content: space-between; align-items: center; gap: 8px;
  .name { font-size: 12px; color: #111827; flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .size { font-size: 11px; color: #9ca3af; }
`,kn=c.div`
  display: flex; gap: 8px; justify-content: flex-end;
`,k=c(Lt)`
  height: 32px;
  padding: 0 12px;
  font-size: 12px;
  &[data-variant='danger']{
    border-color:#fecaca;
    color:#b91c1c;
  }
`,ne=c.div` color:#6b7280; font-size:12px; margin-top:4px; `,ae=c.span` color:#9ca3af; font-size:12px; `,se=c.div` background:#fee2e2; color:#b91c1c; border:1px solid #fecaca; padding:10px 12px; border-radius:10px; font-size:13px; `,F=c.div` color:#6b7280; font-size:12px; `,An=c.button`
  ${lt.outline};
  height: 36px;
  padding: 0 14px;
  font-weight: 600;
  font-size: 13px;
`,En=e.jsx("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"15 18 9 12 15 6"})});export{In as default};
