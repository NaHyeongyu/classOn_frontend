import{u as Ft,e as Ut,g as Ht,r as i,j as e,v as Jt,G as Wt,k as R,S as ae,s as se,d as c,c as jt,b as _t}from"./index-Cl4EBL6b.js";import{C as Kt}from"./ConfirmDialog-CF5z6nt_.js";import{K as ke,U as Vt,D as Gt,C as qt,a as Qt}from"./KPI-DFyg-Wym.js";import{k as Xt,m as pt,g as Yt,f as Zt,j as en,h as tn,n as nn,o as ut,p as an,q as sn,c as rn,r as on,s as cn}from"./courses-R9HzmiYd.js";import{f as ln}from"./dateUtils-CoPTMMCx.js";function Xn(){const x=Ft(),{id:h,recordId:v,ymd:u}=Ut(),{error:S}=Ht(),o=i.useMemo(()=>h?Number(h):null,[h]),w=i.useMemo(()=>v?Number(v):null,[v]),[g,B]=i.useState(null),[a,le]=i.useState(null),[K,wt]=i.useState([]),[de,$e]=i.useState(!1),[ze,Ee]=i.useState(null),[O,V]=i.useState({}),[pe,G]=i.useState("idle"),[Ne,P]=i.useState(!1),[Le,ue]=i.useState(null),[vt,Ie]=i.useState(0),[Re,Be]=i.useState({}),[Oe,fe]=i.useState({}),St=i.useRef({}),[Tt,Pe]=i.useState(!1),[Fe,Ue]=i.useState(null),[F,q]=i.useState({}),[kt,Dt]=i.useState({}),[Q,me]=i.useState(""),[U,xe]=i.useState(""),[H,ge]=i.useState(""),[He,N]=i.useState([]),[At,Je]=i.useState(!1),[We,L]=i.useState(null),[_e,Ke]=i.useState(""),[Ct,Ve]=i.useState({}),[Ge,C]=i.useState([]),[he,Mt]=i.useState({}),[$t,X]=i.useState({}),[zt,ye]=i.useState(!1),[qe,Qe]=i.useState(!1),be=4,Xe=be*1024*1024,Ye=new Set(["image/jpeg","image/png","image/webp","application/pdf"]);i.useEffect(()=>{if(!o)return;let t=!1;async function n(){$e(!0),Ee(null);try{const[s,l,r]=await Promise.all([Yt(o),Zt(o),en(o)]);if(!t){B(s);const p=l.find(y=>y.id===w)||null,d=u&&l.find(y=>y.recordDate===u)||null;le(p??d??null),wt(r)}}catch(s){t||Ee(A(s,"수업 내역을 불러오지 못했습니다."))}finally{t||$e(!1)}}return n(),()=>{t=!0}},[o,w,u]),i.useEffect(()=>{const t=a?.recordDate||u||"",n=a?.startTime||g?.startTime||"",s=a?.endTime||g?.endTime||"";me(t),xe(ne(n)),ge(ne(s))},[a?.recordDate,a?.startTime,a?.endTime,g?.startTime,g?.endTime,u]),i.useEffect(()=>{!de&&u&&!a?.id&&P(!0)},[de,u,a?.id]),i.useEffect(()=>{Ke(a?.content||"")},[a?.content]);const z=i.useCallback(()=>o?w?`attendance:${o}:${w}`:u?`attendanceDate:${o}:${u}`:`attendance:${o}:`:"attendance::",[o,w,u]),Ze=i.useMemo(()=>{if(!o)return{};const t=z();try{return JSON.parse(localStorage.getItem(t)||"{}")}catch{return{}}},[o,z,vt]),E=i.useMemo(()=>a?.id?Re:Ze,[Re,Ze,a?.id]);function Et(t,n){if(!o)return;const s=z(),l=(()=>{try{return JSON.parse(localStorage.getItem(s)||"{}")}catch{return{}}})();l[String(t)]=n;try{localStorage.setItem(s,JSON.stringify(l))}catch{}Ie(r=>r+1),nt()}function Nt(t){if(!o)return;const n=z(),s=(()=>{try{return JSON.parse(localStorage.getItem(n)||"{}")}catch{return{}}})();Object.prototype.hasOwnProperty.call(s,String(t))&&delete s[String(t)];try{localStorage.setItem(n,JSON.stringify(s))}catch{}Ie(l=>l+1)}const je=i.useMemo(()=>Object.values(E).filter(Boolean).length,[E]),et=i.useMemo(()=>{const t=a?.recordDate||u||"";return t?new Date(t)<new Date(new Date().toDateString()):!1},[a?.recordDate,u]),Y=i.useMemo(()=>et?Object.keys(E).length:K.length,[et,E,K.length]),M=i.useMemo(()=>Y?Math.round(je/Y*100):null,[je,Y]),tt=i.useMemo(()=>dn(a?.startTime||g?.startTime,a?.endTime||g?.endTime),[a?.startTime,a?.endTime,g?.startTime,g?.endTime]);function nt(t){const n=t||a?.recordDate||u||ln(new Date);window.dispatchEvent(new CustomEvent("calendar:classes-refresh",{detail:{ymd:n}}))}const Z=i.useMemo(()=>{const t=a?.recordDate||u||"",n=re(a?.startTime||g?.startTime,a?.endTime||g?.endTime);return{dateLabel:t?mt(t):"일자 미지정",timeLabel:n||"시간 미지정",hasDate:!!(a?.recordDate||u),hasTime:!!n}},[a?.recordDate,a?.startTime,a?.endTime,g?.startTime,g?.endTime,u]);i.useEffect(()=>{if(!o||!a?.id)return;let t=!1;async function n(){Pe(!0),Ue(null);try{const s=await tn(o,a.id);if(!t){const l={},r={},p={};s.forEach(d=>{l[d.studentId]=!!d.present,d.reason&&(r[d.studentId]=d.reason),d.studentName&&(p[d.studentId]=d.studentName)}),Be(l),fe(r),Dt(p)}}catch(s){t||Ue(A(s,"출석 정보를 불러오지 못했습니다."))}finally{t||Pe(!1)}}return n(),()=>{t=!0}},[o,a]);async function at(t,n){const s=K.find(p=>p.id===t)?.name||"학생",l=n?"출석":"결석";if(window.confirm(`${s}을(를) ${l} 처리하시겠어요?`))if(o&&a?.id){q(p=>({...p,[t]:!0}));try{const p=Oe[t]?.trim()||void 0;await pt(o,a.id,t,{present:n,reason:p,source:"MANUAL"}),Be(d=>({...d,[t]:n})),R(["/api/calendar/classes","/api/calendar/classes-range","/api/dashboard/summary","/api/dashboard/attendance-today",`/api/courses/${o}/records/${a.id}/attendance`]),nt(a?.recordDate??u??void 0)}catch(p){S(A(p,"출석 처리에 실패했습니다."))}finally{q(p=>({...p,[t]:!1}))}}else Et(t,n)}i.useEffect(()=>{if(!o||a?.id)return;const t=z().replace("attendance","attendanceNote");try{const n=JSON.parse(localStorage.getItem(t)||"{}");fe(n||{})}catch{}},[o,a?.id,z]),i.useEffect(()=>{if(pe!=="success")return;const t=window.setTimeout(()=>G("idle"),2500);return()=>window.clearTimeout(t)},[pe]);const ee=i.useCallback(()=>o?w?`attachments:${o}:${w}`:u?`attachmentsDate:${o}:${u}`:`attachments:${o}:`:"attachments::",[o,w,u]),te=i.useCallback(()=>{try{return JSON.parse(localStorage.getItem(ee())||"[]")}catch{return[]}},[ee]),st=i.useCallback(t=>{try{localStorage.setItem(ee(),JSON.stringify(t))}catch{}},[ee]);function rt(t){const n=new Date().toISOString();return t.map((s,l)=>({id:-1-l,filename:s.name,size:s.size,createdAt:n}))}i.useEffect(()=>{if(!o)return;let t=!1;async function n(){if(L(null),a?.id){Je(!0);try{const s=await nn(o,a.id,{presign:!0});t||(N(s),ct(s))}catch(s){t||L(A(s,"첨부를 불러오지 못했습니다."))}finally{t||Je(!1)}}else{const s=te(),l=new Date().toISOString(),r=s.map((p,d)=>({id:-1-d,filename:p.name,size:p.size,createdAt:l}));N(r)}}return n(),()=>{t=!0}},[o,a,w,u,te]);function it(t){const n=Array.from(t),s=n.filter(d=>d.size<=Xe),l=n.filter(d=>d.size>Xe),r=s.filter(d=>!d.type||Ye.has(d.type)),p=s.filter(d=>d.type&&!Ye.has(d.type));return l.length>0?L(`용량 제한(${be}MB)을 초과한 파일 제외: ${l.map(d=>d.name).join(", ")}`):L(null),p.length>0&&L(d=>[d,`허용되지 않는 형식 제외: ${p.map(y=>y.name).join(", ")}`].filter(Boolean).join(" / ")),r}async function ot(t){if(t.length===0)return;if(!(o&&a?.id)){const f=[...te(),...t.map(T=>({name:T.name,size:T.size}))];st(f),N(rt(f));return}const n=8,s=3,l=t.slice(0,n),r=t.length-l.length;r>0&&L(m=>[m,`최대 ${n}개까지만 업로드됩니다 (추가 ${r}개 제외)`].filter(Boolean).join(" / "));const p=l.map((m,f)=>({id:`${Date.now()}-${f}-${Math.random().toString(36).slice(2,8)}`,name:m.name,size:m.size,progress:0,status:"pending"}));C(m=>[...p,...m]);const d=[];let y=0;async function we(m){const f=l[m],T=p[m].id,ve=await on(o,a.id,f.name,f.type||"application/octet-stream");await new Promise((Se,I)=>{const k=new XMLHttpRequest;k.open("PUT",ve.url,!0);for(const[b,j]of Object.entries(ve.headers||{}))try{k.setRequestHeader(b,j)}catch{}C(b=>b.map(j=>j.id===T?{...j,status:"uploading",progress:0}:j)),k.upload.onprogress=b=>{if(b.lengthComputable){const j=Math.max(1,Math.min(99,Math.round(b.loaded/b.total*100)));C(D=>D.map(Te=>Te.id===T?{...Te,progress:j}:Te))}},k.onload=()=>{if(k.status>=200&&k.status<300)C(b=>b.map(j=>j.id===T?{...j,progress:100}:j)),Se();else{const b=`S3 업로드 실패: HTTP ${k.status}`;C(j=>j.map(D=>D.id===T?{...D,status:"error",error:b}:D)),I(new Error(b))}},k.onerror=()=>{const b="S3 업로드 중 네트워크 오류";C(j=>j.map(D=>D.id===T?{...D,status:"error",error:b}:D)),I(new Error(b))},k.send(f)});const Pt=await cn(o,a.id,{key:ve.key,filename:f.name,contentType:f.type||"application/octet-stream",size:f.size,etag:void 0,originalName:f.name});d.push(Pt),C(Se=>Se.map(I=>I.id===T?{...I,status:"done",progress:100}:I))}const J=Array.from({length:Math.min(s,l.length)},async()=>{for(;y<l.length;){const m=y++;try{await we(m)}catch{}}});await Promise.all(J),d.length&&(N(m=>[...d,...m]),ct(d)),setTimeout(()=>C(m=>m.filter(f=>f.status!=="done"&&f.status!=="error")),2500)}async function Lt(t){if(!t)return;const n=it(t);await ot(n)}const It=async t=>{t.preventDefault();const n=t.dataTransfer?.files;if(!n||n.length===0)return;const s=it(n);await ot(s)};async function ct(t){const n=t.filter(p=>(p.contentType||"").startsWith("image/")),s=3;let l=0;const r=async()=>{for(;l<n.length;){const p=n[l++];if(!he[p.id])try{X(y=>({...y,[p.id]:!0}));const d=p.downloadUrl||(await ut(o,a.id,p.id)).url;Mt(y=>({...y,[p.id]:d}))}catch{}finally{X(d=>({...d,[p.id]:!1}))}}};await Promise.all(Array.from({length:Math.min(s,n.length)},()=>r()))}i.useEffect(()=>()=>{Object.values(he).forEach(t=>{try{URL.revokeObjectURL(t)}catch{}})},[]);async function Rt(t){if(!(!o||!a?.id))try{X(l=>({...l,[t.id]:!0}));const n=t.downloadUrl;if(n){window.open(n,"_blank","noopener");return}const{url:s}=await ut(o,a.id,t.id);window.open(s,"_blank","noopener")}catch(n){S(A(n,"파일을 열 수 없습니다."))}finally{X(n=>({...n,[t.id]:!1}))}}async function Bt(t,n){if(window.confirm("이 파일을 삭제할까요?"))if(o&&a?.id){Ve(l=>({...l,[t]:!0}));try{await an(o,a.id,t),N(l=>l.filter(r=>r.id!==t))}catch(l){S(A(l,"삭제에 실패했습니다."))}finally{Ve(l=>({...l,[t]:!1}))}}else{const r=te().filter(p=>p.name!==n);st(r),N(rt(r))}}async function lt(t,n){if(!(!o||!a?.id)){n==="content"&&G("idle"),V(s=>({...s,[n]:!0}));try{const s=await sn(o,a.id,t);le(s),R("/api/calendar/classes"),R("/api/calendar/classes-range"),n==="content"&&G("success")}catch(s){S(A(s,"저장에 실패했습니다."))}finally{V(s=>({...s,[n]:!1}))}}}function ne(t){if(!t)return"";const[n,s]=t.split(":");return`${n}:${s}`}function dt(t){if(!t)return;const n=t.split(":");if(n.length>=3)return`${n[0].padStart(2,"0")}:${n[1].padStart(2,"0")}:${n[2].padStart(2,"0")}`;if(n.length===2)return`${n[0].padStart(2,"0")}:${n[1].padStart(2,"0")}:00`}async function Ot(){if(!o)return;const t={recordDate:Q||u||"",startTime:dt(U),endTime:dt(H)};if(ue(null),a?.id){await lt(t,"when"),P(!1);return}V(n=>({...n,when:!0}));try{const n=await rn(o,t);le(n),P(!1),R("/api/calendar/classes"),R("/api/calendar/classes-range")}catch(n){A(n,"").includes("HTTP 409")?ue("이미 등록된 수업이 있습니다."):ue("기록 생성에 실패했습니다.")}finally{V(n=>({...n,when:!1}))}}return e.jsxs(pn,{children:[e.jsxs(un,{children:[e.jsxs(Fn,{type:"button",onClick:()=>x(`/classes/${o}`),children:[Un," 뒤로"]}),e.jsxs(mn,{children:[e.jsx("h2",{style:{margin:0},children:g?.title||"수업 내역 상세"}),e.jsxs(xn,{children:[e.jsx(xt,{"data-empty":String(!Z.hasDate),children:Z.dateLabel}),e.jsx(gt,{"data-empty":String(!Z.hasTime),children:Z.timeLabel})]})]}),e.jsxs(fn,{children:[e.jsx(Jt,{to:`/classes/${o}`,title:"수업으로",children:"수업으로"}),a?.id&&e.jsx(Wt,{type:"button",onClick:()=>ye(!0),children:"삭제"})]})]}),e.jsx(Kt,{open:zt,title:"수업 내역 삭제",message:`이 수업 내역을 삭제할까요?
첨부/출결/파일도 함께 삭제됩니다. 되돌릴 수 없습니다.`,confirmLabel:"영구 삭제",cancelLabel:"취소",tone:"danger",busy:qe,onCancel:()=>{qe||ye(!1)},onConfirm:async()=>{if(!(!o||!a?.id)){Qe(!0);try{await Xt(o,a.id),R("/api/calendar/classes"),ye(!1),x(`/classes/${o}/history`)}catch(t){S(A(t,"삭제에 실패했습니다."))}finally{Qe(!1)}}}}),ze&&e.jsx(ce,{children:ze}),de&&e.jsx(_,{children:"불러오는 중..."}),e.jsxs(gn,{children:[e.jsx(ke,{title:"참석",icon:e.jsx(Vt,{}),iconAccent:"indigo",value:e.jsxs(e.Fragment,{children:[je,"명"]}),footerLeft:e.jsxs("span",{children:["총 ",Y,"명"]})}),e.jsx(ke,{title:"출석률",icon:e.jsx(qt,{}),iconAccent:"green",value:e.jsx(e.Fragment,{children:M!=null?`${M}%`:"—"}),footerLeft:e.jsx(Gt,{$tone:M!=null&&M>=75?"positive":M!=null&&M<50?"negative":"neutral",children:M!=null?`${M}%`:"—"})}),e.jsx(ke,{title:"수업 시간",icon:e.jsx(Qt,{}),iconAccent:"violet",value:e.jsx(e.Fragment,{children:tt!=null?`${tt}분`:"—"}),footerLeft:e.jsx("span",{children:re(a?.startTime||g?.startTime,a?.endTime||g?.endTime)||"-"})})]}),e.jsxs(hn,{children:[e.jsxs(yn,{children:[e.jsxs(ae,{children:[e.jsxs(De,{children:[e.jsx(se,{children:"수업 정보"}),Ne?e.jsxs("div",{style:{display:"inline-flex",gap:8,alignItems:"center"},children:[e.jsx($,{onClick:()=>{Ot()},disabled:!!O.when,children:"저장"}),e.jsx($,{onClick:()=>{P(!1),me(a?.recordDate||u||""),xe(ne(a?.startTime||g?.startTime||"")),ge(ne(a?.endTime||g?.endTime||""))},children:"취소"})]}):e.jsx($,{onClick:()=>P(!0),children:"수정"})]}),Ne?e.jsxs(ht,{children:[e.jsxs("li",{children:[e.jsx(ie,{children:"날짜"}),e.jsx(Me,{children:e.jsx(Ae,{type:"date",value:Q||"",onChange:t=>me(t.currentTarget.value)})})]}),e.jsxs("li",{children:[e.jsx(ie,{children:"시간"}),e.jsxs(Me,{style:{display:"flex",alignItems:"center",gap:6},children:[e.jsx(Ae,{type:"time",step:300,value:U||"",onChange:t=>xe(t.currentTarget.value)}),e.jsx("span",{children:"~"}),e.jsx(Ae,{type:"time",step:300,value:H||"",onChange:t=>ge(t.currentTarget.value)})]})]}),e.jsxs(jn,{children:[e.jsx(wn,{children:"미리보기"}),e.jsxs(vn,{children:[e.jsx(xt,{"data-empty":String(!(Q||a?.recordDate||u)),children:mt(Q||a?.recordDate||u||"")}),e.jsx(gt,{"data-empty":String(!(U&&H)),children:U&&H?re(U,H):"시간 미지정"})]})]}),e.jsxs(Sn,{children:[!a?.id&&e.jsx(oe,{children:"저장 시 새 수업 내역을 생성합니다."}),O.when&&e.jsx(W,{children:"저장 중..."}),Le&&e.jsx(ce,{style:{marginLeft:8},children:Le})]})]}):e.jsxs(ht,{children:[e.jsxs("li",{children:[e.jsx(ie,{children:"수업일"}),e.jsx(yt,{children:a?.recordDate||"-"})]}),e.jsxs("li",{children:[e.jsx(ie,{children:"수업시간"}),e.jsx(yt,{children:re(a?.startTime||g?.startTime,a?.endTime||g?.endTime)||"-"})]})]})]}),e.jsxs(ae,{children:[e.jsxs(De,{children:[e.jsx(se,{children:"수업 내용"}),a?.id?e.jsxs(Mn,{children:[pe==="success"&&!O.content&&e.jsx($n,{role:"status",children:"저장 완료!"}),e.jsx($,{onClick:()=>{lt({content:_e},"content")},disabled:!!O.content,children:"저장"}),O.content&&e.jsx(W,{children:"저장 중..."})]}):null]}),a?.id?e.jsx(En,{rows:8,value:_e,onChange:t=>{Ke(t.currentTarget.value),G("idle")},placeholder:"수업 내용을 입력하세요",id:"contentArea"}):e.jsx(_,{children:"서버 기록이 없는 일정입니다. 생성 후 편집 가능합니다."})]}),e.jsxs(ae,{children:[e.jsxs(De,{children:[e.jsx(se,{children:"수업 파일"}),e.jsxs("label",{style:{display:"inline-flex",alignItems:"center",gap:8},children:[e.jsx($,{as:"span",children:"파일 추가"}),e.jsx("input",{type:"file",accept:"image/*,application/pdf",multiple:!0,style:{display:"none"},onChange:t=>{Lt(t.currentTarget.files),t.currentTarget.value=""}})]})]}),e.jsx(Hn,{onDragOver:t=>{t.preventDefault()},onDrop:It,children:e.jsx("span",{className:"hint",children:"여기로 파일을 끌어다 놓거나 ‘파일 추가’를 누르세요"})}),Ge.length>0&&e.jsx(Jn,{children:Ge.map(t=>e.jsxs(Wn,{children:[e.jsxs("div",{className:"meta",children:[e.jsx("span",{className:"name",title:t.name,children:t.name}),e.jsxs("span",{className:"size",children:[Math.round(t.size/1024)," KB"]}),e.jsx("span",{className:"status",children:t.status==="uploading"?"업로드 중":t.status==="done"?"완료":t.status==="error"?"오류":"대기"})]}),e.jsx("div",{className:"bar",children:e.jsx("i",{style:{width:`${t.progress}%`}})}),t.error&&e.jsx(W,{children:t.error})]},t.id))}),We&&e.jsx(ce,{children:We}),At&&e.jsx(_,{children:"불러오는 중..."}),He.length===0?e.jsx(Nn,{children:"첨부 없음"}):e.jsx(Ln,{children:He.map(t=>{const n=(t.contentType||"").startsWith("image/"),s=(t.contentType||"")==="application/pdf"||/\.pdf$/i.test(t.filename),l=he[t.id];return e.jsxs(In,{children:[e.jsx(Rn,{children:n?l?e.jsx(Bn,{src:l,alt:t.filename}):e.jsx(Ce,{children:"이미지"}):s?e.jsx(Ce,{children:"PDF"}):e.jsx(Ce,{children:"FILE"})}),e.jsxs(On,{title:t.filename,children:[e.jsx("span",{className:"name",children:t.filename}),e.jsxs("span",{className:"size",children:[Math.round(t.size/1024)," KB"]})]}),e.jsxs(Pn,{children:[e.jsx($,{onClick:()=>void Rt(t),disabled:!!$t[t.id],children:"보기"}),e.jsx($,{"data-variant":"danger",disabled:!!Ct[t.id],onClick:()=>void Bt(t.id,t.filename),children:"삭제"})]})]},t.id)})}),!a?.id&&e.jsx(oe,{children:"서버 기록이 없어 로컬에만 저장됩니다."}),e.jsxs(oe,{children:["파일 크기 제한: 최대 ",be,"MB (이미지/PDF만 허용)"]})]})]}),e.jsx(bn,{children:e.jsxs(ae,{children:[e.jsx(se,{children:"출결 현황"}),e.jsx(_,{children:"학생별 출석 상태를 수동으로 처리하세요. 변경 시 확인 창이 표시됩니다."}),!a?.id&&e.jsx(oe,{children:"서버 기록이 없어 출석 정보가 로컬에만 저장됩니다."}),Tt&&e.jsx(_,{children:"출석 불러오는 중..."}),Fe&&e.jsx(ce,{children:Fe}),e.jsx(Tn,{children:(()=>{const t=K.map(r=>({id:r.id,name:r.name})),n=new Set(t.map(r=>r.id)),s=Object.keys(E).map(Number).filter(r=>!n.has(r)).map(r=>({id:r,name:kt[r]||`학생#${r}`,isExtra:!0}));return[...t,...s].map(r=>{const p=Object.prototype.hasOwnProperty.call(E,r.id),d=p?!!E[r.id]:null,y=p?d?"present":"absent":"none";return e.jsxs(kn,{children:[e.jsxs("div",{style:{display:"flex",alignItems:"center"},children:[e.jsx("strong",{children:r.name}),r.isExtra&&e.jsx(W,{style:{marginLeft:8},children:"(과거 수강생)"}),e.jsx(zn,{"data-type":y,children:y==="present"?"출석":y==="absent"?"결석":"미처리"})]}),e.jsxs(Dn,{children:[e.jsx(An,{placeholder:"메모",value:Oe[r.id]||"",onChange:we=>{const J=we.currentTarget.value;if(fe(m=>({...m,[r.id]:J})),o){const m=z().replace("attendance","attendanceNote");try{const f=JSON.parse(localStorage.getItem(m)||"{}");f[String(r.id)]=J,localStorage.setItem(m,JSON.stringify(f))}catch{}}if(o&&a?.id&&p){const m=St.current;m[r.id]&&window.clearTimeout(m[r.id]),m[r.id]=window.setTimeout(async()=>{q(f=>({...f,[r.id]:!0}));try{const f=(J||"").trim()||void 0;await pt(o,a.id,r.id,{present:d===!0,reason:f,source:"MANUAL"})}catch(f){console.error("메모 자동 저장 실패",f)}finally{q(f=>({...f,[r.id]:!1}))}},600)}}}),e.jsxs(Cn,{children:[e.jsx(bt,{"data-active":String(d===!0),onClick:()=>{d!==!0&&!F[r.id]&&at(r.id,!0)},disabled:!!F[r.id],children:"출석"}),e.jsx(bt,{"data-variant":"danger","data-active":String(p&&d===!1),onClick:()=>{d!==!1&&!F[r.id]&&at(r.id,!1)},disabled:!!F[r.id],children:"결석"})]}),e.jsx($,{title:a?.id?"서버 기록은 미처리로 되돌릴 수 없습니다.":"미처리로 초기화",onClick:()=>{a?.id||Nt(r.id)},disabled:!!a?.id,children:"미처리"}),F[r.id]&&e.jsx(W,{children:"저장 중..."})]})]},r.id)})})()})]})})]})]})}function ft(x){if(!x)return"";const[h,v]=x.split(":");return`${h}:${v}`}function re(x,h){return x&&h?`${ft(x)} ~ ${ft(h)}`:""}function A(x,h){return typeof x=="string"?x:x&&typeof x=="object"&&"message"in x&&typeof x.message=="string"&&x.message||h}function mt(x){if(!x)return"일자 미지정";try{const h=new Date(x);if(Number.isNaN(h.getTime()))return x;const v=String(h.getMonth()+1).padStart(2,"0"),u=String(h.getDate()).padStart(2,"0"),S="일월화수목금토"[h.getDay()];return`${v}월 ${u}일 (${S})`}catch{return x}}function dn(x,h){if(!x||!h)return null;const[v,u]=x.split(":"),[S,o]=h.split(":"),w=Number(v)*60+Number(u),B=Number(S)*60+Number(o)-w;return B>=0?B:B+1440}const pn=c.div` display:grid; gap:12px; `,un=c.div` display:grid; grid-template-columns:auto 1fr auto; gap:12px; align-items:center; `,fn=c.div` display:inline-flex; gap:8px; flex-wrap:wrap; justify-content:flex-end; `,mn=c.div` display:flex; align-items:center; gap:16px; flex-wrap:wrap; `,xn=c.div` display:inline-flex; align-items:center; gap:8px; flex-wrap:wrap; `,xt=c.span`
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
`,gt=c.span`
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
`,gn=c.div` display:grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap:12px; `,hn=c.div`
  display:flex; gap:12px; align-items:flex-start;
  @media (max-width: 1024px) { flex-direction: column; }
`,yn=c.div` flex: 5 1 0; display:grid; gap:12px; align-content:flex-start; `,bn=c.div` flex: 7 1 0; display:grid; gap:12px; align-content:flex-start; `,De=c.div` display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; `,ht=c.ul`
  list-style:none; padding:0; margin:0; display:grid; gap:10px;
  li { display:grid; grid-template-columns: 110px 1fr; align-items:center; }
`,ie=c.span` color:#6b7280; font-size:12px; font-weight:700; `,Me=c.span` color:#111827; font-size:14px; `,yt=c(Me)`
  font-weight:800;
  font-size:15px;
`,jn=c.div`
  grid-column: 1 / -1;
  display:flex;
  align-items:center;
  gap:12px;
  padding:6px 10px;
  border:1px dashed #e5e7eb;
  border-radius:10px;
  background:#f9fafb;
`,wn=c.span` color:#6b7280; font-size:12px; font-weight:700; `,vn=c.div` display:flex; gap:8px; flex-wrap:wrap; align-items:center; `,Ae=c.input` height:32px; padding:0 10px; border:1px solid #e5e7eb; border-radius:8px; font-size:13px; `,Sn=c.div` grid-column: 1 / -1; display:flex; gap:8px; align-items:center; margin-top:2px; `,Tn=c.div` display:grid; gap:8px; `,kn=c.div` display:flex; align-items:center; justify-content:space-between; padding:10px; border:1px solid #f1f5f9; border-radius:10px; background:#f9fafb; `,Dn=c.div` display:flex; align-items:center; gap:8px; `,An=c.input` height:28px; width: 180px; padding:0 8px; border:1px solid #e5e7eb; border-radius:8px; font-size:12px; background:#fff; `,Cn=c.div` display:inline-flex; gap:6px; `,Mn=c.div` display:inline-flex; gap:8px; align-items:center; flex-wrap:wrap; `,$n=c.span`
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
`,bt=c.button`
  ${jt.outline};
  height: 40px;
  padding: 0 16px;
  font-size: 14px;
  &[data-active='true']{ background:#ecfdf5; color:#065f46; border-color:#a7f3d0; }
  &[data-variant='danger']{ background:#fff; color:#b91c1c; }
  &[data-variant='danger'][data-active='true']{ background:#fee2e2; color:#7f1d1d; border-color:#fecaca; }
  &:disabled{ opacity:0.6; cursor:not-allowed; }
`,zn=c.span`
  margin-left:8px; padding:2px 6px; border-radius:999px; font-size:11px; font-weight:700; border:1px solid #e5e7eb; color:#374151; background:#f3f4f6;
  &[data-type='present']{ background:#ecfdf5; color:#065f46; border-color:#a7f3d0; }
  &[data-type='absent']{ background:#fee2e2; color:#7f1d1d; border-color:#fecaca; }
  &[data-type='none']{ background:#f3f4f6; color:#6b7280; border-color:#e5e7eb; }
`,En=c.textarea` width:100%; border:1px solid #e5e7eb; border-radius:10px; padding:8px 10px; font-size:14px; `;c.div` display:grid; gap:6px; margin-top:6px; `;c.div` display:flex; align-items:center; justify-content:space-between; padding:6px 8px; border:1px solid #f1f5f9; border-radius:8px; `;const Nn=c.div`
  color: #9ca3af; font-size: 13px; padding: 12px 0;
`,Ln=c.div`
  display: grid; gap: 12px; margin-top: 10px;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
`,In=c.div`
  border: 1px solid #e5e7eb; border-radius: 12px; background: #fff; padding: 10px; display: grid; gap: 8px;
`,Rn=c.div`
  height: 120px; border-radius: 8px; background: #f3f4f6; display: grid; place-items: center; overflow: hidden;
`,Bn=c.img`
  width: 100%; height: 100%; object-fit: cover; display: block;
`,Ce=c.div`
  color: #6b7280; font-size: 12px;
`,On=c.div`
  display: flex; justify-content: space-between; align-items: center; gap: 8px;
  .name { font-size: 12px; color: #111827; flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .size { font-size: 11px; color: #9ca3af; }
`,Pn=c.div`
  display: flex; gap: 8px; justify-content: flex-end;
`,$=c(_t)`
  height: 40px;
  padding: 0 16px;
  font-size: 14px;
  &[data-variant='danger']{
    border-color:#fecaca;
    color:#b91c1c;
  }
`,oe=c.div` color:#6b7280; font-size:12px; margin-top:4px; `,W=c.span` color:#9ca3af; font-size:12px; `,ce=c.div` background:#fee2e2; color:#b91c1c; border:1px solid #fecaca; padding:10px 12px; border-radius:10px; font-size:13px; `,_=c.div` color:#6b7280; font-size:12px; `,Fn=c.button`
  ${jt.outline};
  height: 40px;
  padding: 0 16px;
  font-weight: 600;
  font-size: 14px;
`,Un=e.jsx("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"15 18 9 12 15 6"})}),Hn=c.div`
  margin-top: 8px;
  border: 1px dashed #d1d5db;
  border-radius: 10px;
  padding: 10px;
  text-align: center;
  background: #f9fafb;
  color: #6b7280;
  font-size: 12px;
  .hint{ pointer-events: none; }
`,Jn=c.div`
  display: grid; gap: 8px; margin-top: 10px;
`,Wn=c.div`
  border: 1px solid #e5e7eb; border-radius: 10px; padding: 8px; background: #fff; display: grid; gap: 6px;
  .meta{ display:flex; gap:8px; align-items:center; justify-content:space-between; }
  .name{ font-size:12px; color:#111827; flex:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; text-align:left; }
  .size{ font-size:11px; color:#9ca3af; }
  .status{ font-size:11px; color:#6b7280; }
  .bar{ height:6px; background:#f3f4f6; border-radius:999px; overflow:hidden; }
  .bar i{ display:block; height:100%; background:#a7f3d0; }
`;export{Xn as default};
