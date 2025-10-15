import{u as La,a as Ba,e as Oa,b as Fa,r,c as G,j as e,d as i}from"./index-CyW3XeFu.js";import{h as B,l as Ra,G as Ve,S as _e,i as ve,d as vt,f as wt,e as Nt,c as qe}from"./UI-evna17pR.js";import{l as Pa,a as In,M as Ua,u as Ha,b as Ga,c as Ln,d as Wa}from"./exams-D9_Tjv2Z.js";import{C as St}from"./ConfirmDialog-Ba2sBuvj.js";import{i as Va,j as kt,g as _a,b as Ja,h as Qa,f as qa,k as Ka,m as Bn,n as Xa,o as Ya,c as Za,p as es,q as ts}from"./courses-D3Jx7eTn.js";import{f as ns}from"./dateUtils-CoPTMMCx.js";import{r as S}from"./errors-C6OcbAl5.js";import{a as as}from"./format-Do6vjlY3.js";const ss=[{value:"percent",label:"백분율 입력",description:"0~100점 점수로 기록합니다."},{value:"letter",label:"등급 입력",description:"A~F 등급으로 기록합니다."}];function Nr(){const p=La(),{id:j,recordId:N,ymd:x}=Ba(),[Me]=Oa(),{error:O}=Fa(),l=r.useMemo(()=>j?Number(j):null,[j]),L=r.useMemo(()=>N?Number(N):null,[N]),[y,Vn]=r.useState(null),[o,Ke]=r.useState(null),[ce,_n]=r.useState([]),[de,Dt]=r.useState(!1),[zt,At]=r.useState(null),[pe,Ee]=r.useState({}),[Xe,Ce]=r.useState("idle"),[It,ue]=r.useState(!1),[Lt,Ye]=r.useState(null),[Jn,Bt]=r.useState(0),[Ot,Ze]=r.useState({}),[et,tt]=r.useState({}),Qn=r.useRef({}),[Te,Ft]=r.useState(!1),[Rt,Pt]=r.useState(null),[qn,ee]=r.useState({}),[Ut,Kn]=r.useState({}),[F,Ht]=r.useState(null),[Xn,nt]=r.useState(!1),[$e,Ne]=r.useState({}),[fe,xr]=r.useState("all"),[at,mr]=r.useState(""),[xe,st]=r.useState({open:!1,studentId:null,target:null}),[De,rt]=r.useState(""),[me,it]=r.useState(""),[he,ot]=r.useState(""),[Gt,te]=r.useState([]),[Yn,Wt]=r.useState(!1),[Vt,q]=r.useState(null),[_t,Jt]=r.useState(""),[Zn,Qt]=r.useState({}),[qt,R]=r.useState([]),[lt,ea]=r.useState({}),[ta,ze]=r.useState({}),[na,ct]=r.useState(!1),[Kt,Xt]=r.useState(!1),[hr,Yt]=r.useState(""),[gr,Zt]=r.useState(""),[br,yr]=r.useState(!1),[jr,en]=r.useState("idle"),[D,tn]=r.useState("attendance"),[ne,V]=r.useState("intro"),[E,nn]=r.useState([]),[C,an]=r.useState(!1),[ae,dt]=r.useState(null),[b,se]=r.useState(""),[aa,sn]=r.useState(""),[rn,pt]=r.useState("percent"),[P,Ae]=r.useState(!1),[on,K]=r.useState(null),[sa,Ie]=r.useState(!1),[ut,Le]=r.useState("list"),[ft,ln]=r.useState(""),[ra,ge]=r.useState(!1),z=r.useMemo(()=>E.find(t=>String(t.id)===b)||null,[E,b]),[Be,Oe]=r.useState({}),cn=r.useMemo(()=>{const t=ft.trim().toLowerCase();return t?E.filter(n=>(n.title||"").toLowerCase().includes(t)):E},[E,ft]),[A,be]=r.useState({}),[ye,xt]=r.useState(!1),[ia,Fe]=r.useState("idle"),dn=r.useRef("");r.useEffect(()=>{dn.current=b},[b]),r.useEffect(()=>{const t=n=>{Object.keys(A).length>0&&(n.preventDefault(),n.returnValue="")};return window.addEventListener("beforeunload",t),()=>{window.removeEventListener("beforeunload",t)}},[A]),r.useEffect(()=>{D==="grades"?b?V("scores"):C||(E.length>0?V("list"):V("intro")):Ie(!1)},[D,b,C,E.length]),r.useEffect(()=>{D==="grades"&&ne==="list"&&!C&&E.length===0&&V("intro")},[ne,C,E.length,D]);const mt=5,pn=mt*1024*1024,un=new Set(["image/jpeg","image/png","image/webp","application/pdf"]);r.useEffect(()=>{if(!l)return;let t=!1;async function n(){Dt(!0),At(null);try{const[a,s,c]=await Promise.all([_a(l),Ja(l),Qa(l)]);if(!t){Vn(a);const u=s.find(f=>f.id===L)||null,d=x&&s.find(f=>f.recordDate===x)||null;Ke(u??d??null),_n(c)}}catch(a){t||At(S(a,"수업 내역을 불러오지 못했습니다."))}finally{t||Dt(!1)}}return n(),()=>{t=!0}},[l,L,x]),r.useEffect(()=>{const t=o?.recordDate||x||"",n=o?.startTime||y?.startTime||"",a=o?.endTime||y?.endTime||"";rt(t),it(Ge(n)),ot(Ge(a))},[o?.recordDate,o?.startTime,o?.endTime,y?.startTime,y?.endTime,x]),r.useEffect(()=>{!de&&x&&!o?.id&&ue(!0)},[de,x,o?.id]),r.useEffect(()=>{Jt(o?.content||"")},[o?.content]),r.useEffect(()=>{if(!o?.id){Yt(""),Zt(""),en("idle");return}Yt(o.performanceScore!==null&&o.performanceScore!==void 0?String(o.performanceScore):""),Zt(o.performanceNote??""),en("idle")},[o?.id,o?.performanceScore,o?.performanceNote]);const X=r.useCallback(()=>l?L?`attendance:${l}:${L}`:x?`attendanceDate:${l}:${x}`:`attendance:${l}:`:"attendance::",[l,L,x]),fn=r.useMemo(()=>{if(!l)return{};const t=X();try{return JSON.parse(localStorage.getItem(t)||"{}")}catch{return{}}},[l,X,Jn]),_=r.useMemo(()=>o?.id?Ot:fn,[Ot,fn,o?.id]),T=r.useMemo(()=>{const t=ce.map(s=>({id:s.id,name:s.name})),n=new Set(t.map(s=>s.id)),a=Object.keys(_).map(s=>Number(s)).filter(s=>Number.isFinite(s)&&!n.has(s)).map(s=>({id:s,name:Ut[s]||`학생#${s}`,isExtra:!0}));return[...t,...a].map(s=>{const u=Object.prototype.hasOwnProperty.call(_,s.id)?!!_[s.id]:null,d=u==null?"none":u?"present":"absent";return{...s,status:d}})},[ce,_,Ut]),Y=r.useMemo(()=>T.filter(t=>!t.isExtra),[T]),ht=Y.length,xn=r.useMemo(()=>{const t=T.filter(a=>fe==="present"?a.status==="present":fe==="absent"?a.status==="absent":fe==="none"?a.status==="none":!0),n=at.trim().toLowerCase();return n?t.filter(a=>a.name.toLowerCase().includes(n)):t},[T,fe,at]),oa=r.useMemo(()=>{let t=0,n=0,a=0;for(const s of Y)s.status==="present"?t+=1:s.status==="absent"?n+=1:a+=1;return{present:t,absent:n,none:a,total:Y.length}},[Y]),je=r.useMemo(()=>T.filter(t=>!t.isExtra).map(t=>({id:t.id,name:t.name})),[T]),la=r.useMemo(()=>Object.keys(A).length>0,[A]);function ca(t){if(t==null||!Number.isFinite(t))return null;const n=Math.round(Number(t));return n>=90?"A":n>=80?"B":n>=70?"C":n>=60?"D":n>=50?"E":"F"}function da(t){if(!t)return null;const n=(t.trim()[0]||"").toUpperCase();return n==="A"?100:n==="B"?90:n==="C"?80:n==="D"?70:n==="E"?60:n==="F"?50:null}const mn=r.useMemo(()=>{if(!z)return null;let t=0,n=0;for(const a of je){let s=null;if(z.inputMode==="percent"){const c=A[a.id]?.percent;if(c!==void 0&&c!==""){const u=Number(c);Number.isFinite(u)&&(s=Math.max(0,Math.min(100,Math.round(u))))}else{const u=Be[a.id]?.score;u!=null&&Number.isFinite(u)&&(s=Math.max(0,Math.min(100,Math.round(u))))}}else{const c=A[a.id]?.letter??Be[a.id]?.level??"";s=da(c)}s!=null&&(t+=s,n+=1)}return n===0?null:Math.round(t/n*10)/10},[z,je,A,Be]),hn=r.useMemo(()=>ca(mn),[mn]);async function pa(){if(!l)return;if(!z){alert("먼저 시험을 선택하거나 생성하세요.");return}const t=o?.recordDate||x||new Date().toISOString().slice(0,10);xt(!0),Fe("idle");try{const n=Object.entries(A).map(([a,s])=>{const c=Number(a);let u,d;if(z.inputMode==="percent"){const f=s?.percent;if(f!==void 0&&f!==""){const h=Number(f);u=Number.isFinite(h)?Math.max(0,Math.min(100,Math.round(h))):void 0}else u=void 0}else d=s?.letter;return{studentId:c,score:u,level:d}});if(n.length===0){xt(!1);return}if(!z.examDate&&t)try{await Ha(l,Number(b),{examDate:t})}catch{}await Ga(l,Number(b),n);try{G(`/api/courses/${l}/exams/${b}/results`)}catch{}try{const a=await In(l,Number(b)),s={};for(const c of a)s[c.studentId]={score:c.score,outOf:c.outOf,level:c.level,note:c.note};Oe(s)}catch{}Fe("success"),window.setTimeout(()=>{be({}),Fe("idle")},1500)}catch(n){O(S(n,"성적 저장에 실패했습니다. 다시 시도해 주세요.")),Fe("error")}finally{xt(!1)}}function gn(t,n){if(!l)return;const a=X(),s=(()=>{try{return JSON.parse(localStorage.getItem(a)||"{}")}catch{return{}}})();s[String(t)]=n;try{localStorage.setItem(a,JSON.stringify(s))}catch{}Bt(c=>c+1),yt()}function ua(t){if(!l)return;const n=X(),a=(()=>{try{return JSON.parse(localStorage.getItem(n)||"{}")}catch{return{}}})();Object.prototype.hasOwnProperty.call(a,String(t))&&delete a[String(t)];try{localStorage.setItem(n,JSON.stringify(a))}catch{}Bt(s=>s+1)}const bn=r.useMemo(()=>Object.values(_).filter(Boolean).length,[_]);r.useMemo(()=>T.filter(t=>t.status==="absent").length,[T]),r.useMemo(()=>T.filter(t=>t.status==="none").length,[T]);const yn=r.useMemo(()=>{const t=o?.recordDate||x||"";return t?new Date(t)<new Date(new Date().toDateString()):!1},[o?.recordDate,x]),gt=r.useMemo(()=>yn?Object.keys(_).length:ce.length,[yn,_,ce.length]),fa=r.useMemo(()=>gt?Math.round(bn/gt*100):null,[bn,gt]),jn=r.useMemo(()=>rs(o?.startTime||y?.startTime,o?.endTime||y?.endTime),[o?.startTime,o?.endTime,y?.startTime,y?.endTime]),xa=r.useMemo(()=>is(jn),[jn]),{present:bt,absent:vn,none:Re,total:$}=oa,wn=fa??($?Math.round(bt/$*100):null),ma=$?Math.round(bt/$*100):0,ha=$?Math.round(vn/$*100):0,ga=$?Math.round(Re/$*100):0,ba=fe!=="all"||at.trim().length>0,Z=de&&!y,ya=de&&Y.length===0;function yt(t){const n=t||o?.recordDate||x||ns(new Date);window.dispatchEvent(new CustomEvent("calendar:classes-refresh",{detail:{ymd:n}}))}const Pe=r.useMemo(()=>{const t=o?.recordDate||x||"",n=Mt(o?.startTime||y?.startTime,o?.endTime||y?.endTime);return{dateLabel:t?Fn(t):"일자 미지정",timeLabel:n||"시간 미지정",hasDate:!!(o?.recordDate||x),hasTime:!!n}},[o?.recordDate,o?.startTime,o?.endTime,y?.startTime,y?.endTime,x]),re=r.useCallback(async t=>{if(l){an(!0),dt(null);try{const n=await Pa(l);nn(n);let a="";if(t?.selectId&&n.some(s=>String(s.id)===String(t.selectId)))a=String(t.selectId);else{const s=dn.current;if(s&&n.some(c=>String(c.id)===s))a=s;else{const c=Me.get("examId");if(c&&n.some(u=>String(u.id)===c))a=c;else{const u=o?.recordDate||x||"";if(u){const d=n.find(f=>f.examDate===u);d&&(a=String(d.id))}}}}se(a)}catch(n){dt(S(n,"시험 목록을 불러오지 못했습니다.")),nn([]),t?.selectId&&se(String(t.selectId))}finally{an(!1)}}},[l,o?.recordDate,x,Me]);r.useEffect(()=>{re()},[re]),r.useEffect(()=>{if(!l||!b){Oe({});return}let t=!1;return(async()=>{try{try{G(`/api/courses/${l}/exams/${b}/results`)}catch{}const n=await In(l,Number(b));if(t)return;const a={};for(const s of n)a[s.studentId]={score:s.score,outOf:s.outOf,level:s.level,note:s.note};Oe(a)}catch{t||Oe({})}})(),()=>{t=!0}},[l,b]);function ja(t="list"){re(),Le(t),o?.recordDate||x||new Date().toISOString().slice(0,10),sn(t==="create"?"시험":""),pt("percent"),K(null),ge(!1),ln(""),Ie(!0)}function Sn(){P||(Ie(!1),K(null),Le("list"))}function kn(){b&&(V("scores"),Ie(!1))}async function va(){if(!l||P)return;const t=o?.recordDate||x||new Date().toISOString().slice(0,10);Ae(!0);try{const a=await Ln(l,{title:"시험",inputMode:"percent",kind:"TEST",examDate:t});await re({selectId:a.id}),se(String(a.id)),V("scores"),ge(!0),window.setTimeout(()=>ge(!1),1500)}catch(n){K(S(n,"시험 생성에 실패했습니다."))}finally{Ae(!1)}}async function wa(){if(!l||!b)return;const n=E.find(s=>String(s.id)===b)?.title||"선택한 시험";if(window.confirm(`${n}을(를) 삭제할까요?
관련 성적 데이터도 함께 삭제됩니다. 되돌릴 수 없습니다.`))try{await Wa(l,Number(b)),await re(),se(""),V("list")}catch(s){dt(S(s,"시험 삭제에 실패했습니다."))}}async function Sa(){if(!l||P)return;const t=(aa||"").trim()||"시험";K(null),Ae(!0);try{const n={title:t,inputMode:rn,kind:"TEST",examDate:o?.recordDate||x||void 0},a=await Ln(l,n);await re({selectId:a.id}),se(String(a.id)),sn(""),pt("percent"),K(null),Le("list"),V("scores"),ge(!0),window.setTimeout(()=>ge(!1),2e3)}catch(n){K(S(n,"시험 생성에 실패했습니다."))}finally{Ae(!1)}}r.useEffect(()=>{if(!l||!o?.id)return;let t=!1;async function n(){Ft(!0),Pt(null);try{const a=await qa(l,o.id);if(!t){const s={},c={},u={};a.forEach(d=>{s[d.studentId]=!!d.present,d.reason&&(c[d.studentId]=d.reason),d.studentName&&(u[d.studentId]=d.studentName)}),Ze(s),tt(c),Kn(u)}}catch(a){t||Pt(S(a,"출석 정보를 불러오지 못했습니다."))}finally{t||Ft(!1)}}return n(),()=>{t=!0}},[l,o]);async function ka(t,n){if(l&&o?.id){ee(a=>({...a,[t]:!0}));try{const a=et[t]?.trim()||void 0;await kt(l,o.id,t,{present:n,reason:a,source:"MANUAL"}),Ze(s=>({...s,[t]:n})),G(["/api/calendar/classes","/api/calendar/classes-range","/api/dashboard/summary","/api/dashboard/attendance-today","/api/attendance/daily",`/api/courses/${l}/records/${o.id}/attendance`]),yt(o?.recordDate??x??void 0);try{window.dispatchEvent(new CustomEvent("dashboard:attendance-refresh",{detail:{}}))}catch{}}catch(a){O(S(a,"출석 처리에 실패했습니다."))}finally{ee(a=>({...a,[t]:!1}))}}else gn(t,n)}function Mn(t,n){st({open:!0,studentId:t,target:n})}function Ma(){if(ht===0){window.alert("출석 처리할 학생이 없습니다.");return}const t={};Y.forEach(n=>{t[n.id]=n.status!=="present"}),Ne(t),nt(!0)}const Ea=r.useMemo(()=>Object.values($e).filter(Boolean).length,[$e]);function Ca(){F||(nt(!1),Ne({}))}async function Ta(){const t=Object.entries($e).filter(([,a])=>a).map(([a])=>Number(a));if(!t.length){window.alert("학생을 한 명 이상 선택해 주세요.");return}await En(!0,t)&&(nt(!1),Ne({}))}async function En(t,n){const a="present",c=T.filter(h=>!h.isExtra),u=n?new Set(n):null,d=c.filter(h=>u&&!u.has(h.id)?!1:h.status!==a);if(d.length===0)return window.alert(n?"선택한 학생은 이미 출석 처리됐습니다.":"이미 모든 학생이 출석 상태입니다."),!1;if(!n){const h=`총 ${d.length}명의 학생을 출석 처리할까요?${o?.id?`
변경 내용은 즉시 저장됩니다.`:""}`;if(!window.confirm(h))return!1}Ht(a);let f=!1;if(l&&o?.id){ee(g=>{const m={...g};return d.forEach(({id:w})=>{m[w]=!0}),m});const h=[];let ie=null;for(const g of d)try{const m=et[g.id]?.trim()||void 0;await kt(l,o.id,g.id,{present:t,reason:m,source:"MANUAL"}),h.push(g.id)}catch(m){ie||(ie=m)}if(ee(g=>{const m={...g};return d.forEach(({id:w})=>{delete m[w]}),m}),h.length){Ze(g=>{const m={...g};return h.forEach(w=>{m[w]=t}),m}),G(["/api/calendar/classes","/api/calendar/classes-range","/api/dashboard/summary","/api/dashboard/attendance-today","/api/attendance/daily",`/api/courses/${l}/records/${o.id}/attendance`]),yt(o?.recordDate??x??void 0);try{window.dispatchEvent(new CustomEvent("dashboard:attendance-refresh",{detail:{}}))}catch{}f=!0}ie&&O(S(ie,"일괄 출석 처리 중 일부가 실패했습니다."))}else d.forEach(({id:h})=>gn(h,t)),f=d.length>0;return Ht(null),f}r.useEffect(()=>{if(!l||o?.id)return;const t=X().replace("attendance","attendanceNote");try{const n=JSON.parse(localStorage.getItem(t)||"{}");tt(n||{})}catch{}},[l,o?.id,X]),r.useEffect(()=>{if(Xe!=="success")return;const t=window.setTimeout(()=>Ce("idle"),2500);return()=>window.clearTimeout(t)},[Xe]);const Ue=r.useCallback(()=>l?L?`attachments:${l}:${L}`:x?`attachmentsDate:${l}:${x}`:`attachments:${l}:`:"attachments::",[l,L,x]),He=r.useCallback(()=>{try{return JSON.parse(localStorage.getItem(Ue())||"[]")}catch{return[]}},[Ue]),Cn=r.useCallback(t=>{try{localStorage.setItem(Ue(),JSON.stringify(t))}catch{}},[Ue]);function Tn(t){const n=new Date().toISOString();return t.map((a,s)=>({id:-1-s,filename:a.name,size:a.size,createdAt:n}))}r.useEffect(()=>{if(!l)return;let t=!1;async function n(){if(q(null),o?.id){Wt(!0);try{const a=await Ka(l,o.id,{presign:!0});t||(te(a),Dn(a))}catch(a){t||q(S(a,"첨부를 불러오지 못했습니다."))}finally{t||Wt(!1)}}else{const a=He(),s=new Date().toISOString(),c=a.map((u,d)=>({id:-1-d,filename:u.name,size:u.size,createdAt:s}));te(c)}}return n(),()=>{t=!0}},[l,o,L,x,He]);function $n(t){const n=Array.from(t),a=n.filter(d=>d.size<=pn),s=n.filter(d=>d.size>pn),c=a.filter(d=>!d.type||un.has(d.type)),u=a.filter(d=>d.type&&!un.has(d.type));return s.length>0?q(`용량 제한(${mt}MB)을 초과한 파일 제외: ${s.map(d=>d.name).join(", ")}`):q(null),u.length>0&&q(d=>[d,`허용되지 않는 형식 제외: ${u.map(f=>f.name).join(", ")}`].filter(Boolean).join(" / ")),c}async function Nn(t){if(t.length===0)return;if(!(l&&o?.id)){const m=[...He(),...t.map(w=>({name:w.name,size:w.size}))];Cn(m),te(Tn(m));return}const n=8,a=3,s=t.slice(0,n),c=t.length-s.length;c>0&&q(g=>[g,`최대 ${n}개까지만 업로드됩니다 (추가 ${c}개 제외)`].filter(Boolean).join(" / "));const u=s.map((g,m)=>({id:`${Date.now()}-${m}-${Math.random().toString(36).slice(2,8)}`,name:g.name,size:g.size,progress:0,status:"pending"}));R(g=>[...u,...g]);const d=[];let f=0;async function h(g){const m=s[g],w=u[g].id;let We;try{We=await es(l,o.id,m.name,m.type||"application/octet-stream")}catch(oe){const U=S(oe,"첨부 파일 업로드를 사용할 수 없습니다.");throw q(U),R(I=>I.map(v=>v.id===w?{...v,status:"error",error:U}:v)),oe}await new Promise((oe,U)=>{const I=new XMLHttpRequest;I.open("PUT",We.url,!0);for(const[v,M]of Object.entries(We.headers||{}))try{I.setRequestHeader(v,M)}catch{}R(v=>v.map(M=>M.id===w?{...M,status:"uploading",progress:0}:M)),I.upload.onprogress=v=>{if(v.lengthComputable){const M=Math.max(1,Math.min(99,Math.round(v.loaded/v.total*100)));R(H=>H.map(jt=>jt.id===w?{...jt,progress:M}:jt))}},I.onload=()=>{if(I.status>=200&&I.status<300)R(v=>v.map(M=>M.id===w?{...M,progress:100}:M)),oe();else{const v=`S3 업로드 실패: HTTP ${I.status}`;R(M=>M.map(H=>H.id===w?{...H,status:"error",error:v}:H)),U(new Error(v))}},I.onerror=()=>{const v="S3 업로드 중 네트워크 오류";R(M=>M.map(H=>H.id===w?{...H,status:"error",error:v}:H)),U(new Error(v))},I.send(m)});const Ia=await ts(l,o.id,{key:We.key,filename:m.name,contentType:m.type||"application/octet-stream",size:m.size,etag:void 0,originalName:m.name});d.push(Ia),R(oe=>oe.map(U=>U.id===w?{...U,status:"done",progress:100}:U))}const ie=Array.from({length:Math.min(a,s.length)},async()=>{for(;f<s.length;){const g=f++;try{await h(g)}catch{}}});await Promise.all(ie),d.length&&(te(g=>[...d,...g]),Dn(d)),setTimeout(()=>R(g=>g.filter(m=>m.status!=="done"&&m.status!=="error")),2500)}async function $a(t){if(!t)return;const n=$n(t);await Nn(n)}const Na=async t=>{t.preventDefault();const n=t.dataTransfer?.files;if(!n||n.length===0)return;const a=$n(n);await Nn(a)};async function Dn(t){const n=t.filter(u=>(u.contentType||"").startsWith("image/")),a=3;let s=0;const c=async()=>{for(;s<n.length;){const u=n[s++];if(!lt[u.id])try{ze(f=>({...f,[u.id]:!0}));const d=u.downloadUrl||(await Bn(l,o.id,u.id)).url;ea(f=>({...f,[u.id]:d}))}catch{}finally{ze(d=>({...d,[u.id]:!1}))}}};await Promise.all(Array.from({length:Math.min(a,n.length)},()=>c()))}r.useEffect(()=>()=>{Object.values(lt).forEach(t=>{try{URL.revokeObjectURL(t)}catch{}})},[]);async function Da(t){if(!(!l||!o?.id))try{ze(s=>({...s,[t.id]:!0}));const n=t.downloadUrl;if(n){window.open(n,"_blank","noopener");return}const{url:a}=await Bn(l,o.id,t.id);window.open(a,"_blank","noopener")}catch(n){O(S(n,"파일을 열 수 없습니다."))}finally{ze(n=>({...n,[t.id]:!1}))}}async function za(t,n){const a=n?`"${n}" 파일을 삭제합니다. 되돌릴 수 없습니다.`:"선택한 파일을 삭제합니다. 되돌릴 수 없습니다.";if(window.confirm(a))if(l&&o?.id){Qt(c=>({...c,[t]:!0}));try{await Xa(l,o.id,t),te(c=>c.filter(u=>u.id!==t))}catch(c){O(S(c,"삭제에 실패했습니다."))}finally{Qt(c=>({...c,[t]:!1}))}}else{const u=He().filter(d=>d.name!==n);Cn(u),te(Tn(u))}}async function zn(t,n){if(!(!l||!o?.id)){n==="content"&&Ce("idle"),Ee(a=>({...a,[n]:!0}));try{const a=await Ya(l,o.id,t);Ke(a),G("/api/calendar/classes"),G("/api/calendar/classes-range"),n==="content"&&Ce("success")}catch(a){O(S(a,"저장에 실패했습니다."))}finally{Ee(a=>({...a,[n]:!1}))}}}function Ge(t){if(!t)return"";const[n,a]=t.split(":");return`${n}:${a}`}function An(t){if(!t)return;const n=t.split(":");if(n.length>=3)return`${n[0].padStart(2,"0")}:${n[1].padStart(2,"0")}:${n[2].padStart(2,"0")}`;if(n.length===2)return`${n[0].padStart(2,"0")}:${n[1].padStart(2,"0")}:00`}async function Aa(){if(!l)return;const t={recordDate:De||x||"",startTime:An(me),endTime:An(he)};if(Ye(null),o?.id){await zn(t,"when"),ue(!1);return}Ee(n=>({...n,when:!0}));try{const n=await Za(l,t);Ke(n),ue(!1),G("/api/calendar/classes"),G("/api/calendar/classes-range")}catch(n){S(n,"").includes("HTTP 409")?Ye("이미 등록된 수업이 있습니다."):Ye("기록 생성에 실패했습니다.")}finally{Ee(n=>({...n,when:!1}))}}return e.jsxs(os,{children:[e.jsxs(ls,{children:[e.jsxs(Gs,{type:"button",onClick:()=>p(`/classes/${l}`),children:[Ws," 뒤로"]}),e.jsxs(ds,{children:[Z?e.jsx(B,{w:220,h:26}):e.jsx("h2",{style:{margin:0},children:y?.title||"수업 내역 상세"}),e.jsx(ps,{children:Z?e.jsxs(e.Fragment,{children:[e.jsx(B,{w:120,h:20}),e.jsx(B,{w:100,h:18})]}):e.jsxs(e.Fragment,{children:[e.jsx(Rn,{"data-empty":String(!Pe.hasDate),children:Pe.dateLabel}),e.jsx(Pn,{"data-empty":String(!Pe.hasTime),children:Pe.timeLabel})]})})]}),e.jsxs(cs,{children:[e.jsx(Ra,{to:`/classes/${l}`,title:"수업으로",children:"수업으로"}),Z?e.jsx(B,{w:88,h:32}):o?.id&&e.jsx(Ve,{type:"button","data-variant":"danger",onClick:()=>ct(!0),children:"삭제"})]})]}),e.jsx(St,{open:na,title:"수업 내역 삭제",message:`이 수업 내역을 삭제할까요?
첨부/출결/파일도 함께 삭제됩니다. 되돌릴 수 없습니다.`,confirmLabel:"영구 삭제",cancelLabel:"취소",tone:"danger",busy:Kt,onCancel:()=>{Kt||ct(!1)},onConfirm:async()=>{if(!(!l||!o?.id)){Xt(!0);try{await Va(l,o.id),G(["/api/calendar/classes","/api/calendar/classes-range",`/api/courses/${l}`,`/api/courses/${l}/records`]),ct(!1),p(`/classes/${l}/history`)}catch(t){O(S(t,"삭제에 실패했습니다."))}finally{Xt(!1)}}}}),e.jsx(St,{open:xe.open,title:"출결 처리 확인",message:(()=>{const t=xe.studentId,n=xe.target;return`${t!=null?ce.find(c=>c.id===t)?.name||`학생#${t}`:"학생"}을(를) ${n?"출석":"결석"} 처리하시겠어요?`})(),confirmLabel:"확인",cancelLabel:"취소",tone:"default",busy:!1,onCancel:()=>st({open:!1,studentId:null,target:null}),onConfirm:async()=>{const t=xe.studentId,n=xe.target;st({open:!1,studentId:null,target:null}),!(t==null||n==null)&&await ka(t,n)}}),e.jsx(St,{open:Xn,title:"선택 출석 처리",message:e.jsxs(Rs,{children:[e.jsx("p",{children:"출석 처리할 학생을 선택하세요."}),e.jsx(Ps,{children:Y.map(t=>{const n=t.status==="present";return e.jsxs(Us,{"data-disabled":String(n),children:[e.jsx("input",{type:"checkbox",checked:$e[t.id]||!1,onChange:a=>{const s=a.target;if(!s)return;const{checked:c}=s;Ne(u=>({...u,[t.id]:c}))},disabled:n||F!==null}),e.jsx("span",{className:"name",children:t.name}),e.jsx("span",{className:"status",children:t.status==="present"?"이미 출석":t.status==="absent"?"결석":"미처리"})]},t.id)})}),e.jsx(Hs,{children:e.jsxs("span",{children:["선택된 학생: ",Ea,"명"]})})]}),confirmLabel:"출석 처리",cancelLabel:"취소",onCancel:Ca,onConfirm:()=>{F||Ta()},busy:F==="present",hideCancel:!1}),zt&&e.jsx(J,{children:zt}),de&&!Z&&e.jsx(Q,{children:"불러오는 중..."}),e.jsx(us,{children:ya?Array.from({length:4}).map((t,n)=>e.jsxs(we,{children:[e.jsx(B,{w:"40%",h:12}),e.jsx(B,{w:"60%",h:22,mt:6}),e.jsx(B,{w:"50%",h:10,mt:6})]},`stat-skeleton-${n}`)):e.jsxs(e.Fragment,{children:[e.jsxs(we,{"data-tone":"primary",children:[e.jsx("span",{className:"label",children:"출석률"}),e.jsx("strong",{children:wn!=null?`${wn}%`:"미집계"}),e.jsx(k,{children:$?`대상 ${$}명`:"대상 없음"})]}),e.jsxs(we,{"data-tone":"success",children:[e.jsx("span",{className:"label",children:"출석"}),e.jsxs("strong",{children:[bt,"명"]}),e.jsx(k,{children:$?`전체의 ${ma}%`:"기록 없음"})]}),e.jsxs(we,{"data-tone":"danger",children:[e.jsx("span",{className:"label",children:"결석"}),e.jsxs("strong",{children:[vn,"명"]}),e.jsx(k,{children:$?`전체의 ${ha}%`:"기록 없음"})]}),e.jsxs(we,{"data-tone":Re===0?"muted":"warning",children:[e.jsx("span",{className:"label",children:"미처리"}),e.jsxs("strong",{children:[Re,"명"]}),e.jsx(k,{children:Re===0?"모두 처리 완료":`전체의 ${ga}%`})]})]})}),e.jsxs(fs,{children:[e.jsxs(xs,{children:[e.jsxs(_e,{children:[e.jsxs(Je,{children:[e.jsx(ve,{children:"수업 정보"}),It?e.jsxs("div",{style:{display:"inline-flex",gap:8,alignItems:"center"},children:[e.jsx(W,{onClick:()=>{Aa()},disabled:!!pe.when,children:"저장"}),e.jsx(W,{onClick:()=>{ue(!1),rt(o?.recordDate||x||""),it(Ge(o?.startTime||y?.startTime||"")),ot(Ge(o?.endTime||y?.endTime||""))},children:"취소"})]}):e.jsx(W,{"data-variant":"edit",onClick:()=>ue(!0),children:"수정"})]}),It?e.jsxs(Un,{children:[e.jsxs("li",{children:[e.jsx(Se,{children:"날짜"}),e.jsx(le,{children:e.jsx(Ct,{type:"date",value:De||"",onChange:t=>rt(t.currentTarget.value)})})]}),e.jsxs("li",{children:[e.jsx(Se,{children:"시간"}),e.jsxs(le,{style:{display:"flex",alignItems:"center",gap:6},children:[e.jsx(Ct,{type:"time",step:300,value:me||"",onChange:t=>it(t.currentTarget.value)}),e.jsx("span",{children:"~"}),e.jsx(Ct,{type:"time",step:300,value:he||"",onChange:t=>ot(t.currentTarget.value)})]})]}),e.jsxs(gs,{children:[e.jsx(bs,{children:"미리보기"}),e.jsxs(ys,{children:[e.jsx(Rn,{"data-empty":String(!(De||o?.recordDate||x)),children:Fn(De||o?.recordDate||x||"")}),e.jsx(Pn,{"data-empty":String(!(me&&he)),children:me&&he?Mt(me,he):"시간 미지정"})]})]}),e.jsxs(js,{children:[!o?.id&&e.jsx(ke,{children:"저장 시 새 수업 내역을 생성합니다."}),pe.when&&e.jsx(k,{children:"저장 중..."}),Lt&&e.jsx(J,{style:{marginLeft:8},children:Lt})]})]}):e.jsxs(Un,{children:[e.jsxs("li",{children:[e.jsx(Se,{children:"수업일"}),Z?e.jsx(le,{children:e.jsx(B,{w:140,h:14})}):e.jsx(Et,{children:o?.recordDate||"-"})]}),e.jsxs("li",{children:[e.jsx(Se,{children:"수업시간"}),Z?e.jsx(le,{children:e.jsx(B,{w:160,h:14})}):e.jsx(Et,{children:Mt(o?.startTime||y?.startTime,o?.endTime||y?.endTime)||"-"})]}),e.jsxs("li",{children:[e.jsx(Se,{children:"진행 시간"}),Z?e.jsx(le,{children:e.jsx(B,{w:90,h:14})}):e.jsx(Et,{children:xa})]})]})]}),e.jsxs(_e,{children:[e.jsxs(Je,{children:[e.jsx(ve,{children:"수업 내용"}),o?.id?e.jsxs(Es,{children:[Xe==="success"&&!pe.content&&e.jsx(Tt,{role:"status",children:"저장 완료!"}),e.jsx(W,{onClick:()=>{zn({content:_t},"content")},disabled:!!pe.content,children:"저장"}),pe.content&&e.jsx(k,{children:"저장 중..."})]}):null]}),o?.id?e.jsx(Ns,{rows:8,value:_t,onChange:t=>{Jt(t.currentTarget.value),Ce("idle")},placeholder:"수업 내용을 입력하세요",id:"contentArea"}):e.jsx(Q,{children:"서버 기록이 없는 일정입니다. 생성 후 편집 가능합니다."})]}),e.jsxs(_e,{children:[e.jsxs(Je,{children:[e.jsx(ve,{children:"수업 파일"}),e.jsxs("label",{style:{display:"inline-flex",alignItems:"center",gap:8},children:[e.jsx(vt,{as:"span",children:"파일 추가"}),e.jsx("input",{type:"file",accept:"image/*,application/pdf",multiple:!0,style:{display:"none"},onChange:t=>{$a(t.currentTarget.files),t.currentTarget.value=""}})]})]}),e.jsx(Vs,{onDragOver:t=>{t.preventDefault()},onDrop:Na,children:e.jsx("span",{className:"hint",children:"여기로 파일을 끌어다 놓거나 ‘파일 추가’를 누르세요"})}),qt.length>0&&e.jsx(_s,{children:qt.map(t=>e.jsxs(Js,{children:[e.jsxs("div",{className:"meta",children:[e.jsx("span",{className:"name",title:t.name,children:t.name}),e.jsxs("span",{className:"size",children:[Math.round(t.size/1024)," KB"]}),e.jsx("span",{className:"status",children:t.status==="uploading"?"업로드 중":t.status==="done"?"완료":t.status==="error"?"오류":"대기"})]}),e.jsx("div",{className:"bar",children:e.jsx("i",{style:{width:`${t.progress}%`}})}),t.error&&e.jsx(k,{children:t.error})]},t.id))}),Vt&&e.jsx(J,{children:Vt}),Yn&&e.jsx(Q,{children:"불러오는 중..."}),Gt.length===0?e.jsx(Ds,{children:"첨부 없음"}):e.jsx(zs,{children:Gt.map(t=>{const n=(t.contentType||"").startsWith("image/"),a=(t.contentType||"")==="application/pdf"||/\.pdf$/i.test(t.filename),s=lt[t.id];return e.jsxs(As,{children:[e.jsx(Is,{children:n?s?e.jsx(Ls,{src:s,alt:t.filename}):e.jsx($t,{children:"이미지"}):a?e.jsx($t,{children:"PDF"}):e.jsx($t,{children:"FILE"})}),e.jsxs(Bs,{title:t.filename,children:[e.jsx("span",{className:"name",children:t.filename}),e.jsxs("span",{className:"size",children:[Math.round(t.size/1024)," KB"]})]}),e.jsxs(Os,{children:[e.jsx(W,{onClick:()=>void Da(t),disabled:!!ta[t.id],children:"보기"}),e.jsx(W,{"data-variant":"danger",disabled:!!Zn[t.id],onClick:()=>void za(t.id,t.filename),children:"삭제"})]})]},t.id)})}),!o?.id&&e.jsx(ke,{children:"서버 기록이 없어 로컬에만 저장됩니다."}),e.jsxs(ke,{children:["파일 크기 제한: 최대 ",mt,"MB (이미지/PDF만 허용)"]}),e.jsx(ke,{children:"원본파일이 클 경우 파일 인코딩을 통해 용량을 줄인 후 업로드 해주세요."})]})]}),e.jsxs(ms,{children:[e.jsx(qs,{children:e.jsxs(Qs,{children:[e.jsx(Wn,{"data-active":String(D==="attendance"),onClick:()=>tn("attendance"),children:"출결 현황"}),e.jsx(Wn,{"data-active":String(D==="grades"),onClick:()=>tn("grades"),children:"시험/테스트"})]})}),e.jsxs(_e,{children:[e.jsx(hs,{children:e.jsxs(Je,{children:[e.jsxs(Fs,{children:[e.jsx(ve,{children:D==="attendance"?"출결 현황":"시험/테스트"}),D==="attendance"?e.jsx(Q,{children:"학생별 출석 상태를 수동으로 처리하세요. 변경 시 확인 창이 표시됩니다."}):e.jsx(Q,{children:" "})]}),D==="attendance"&&e.jsxs(Hn,{children:[e.jsx(W,{type:"button",onClick:()=>{!F&&!Te&&En(!0)},disabled:F!==null||Te||ht===0,children:"전체 출석"}),e.jsx(W,{type:"button",onClick:Ma,disabled:F!==null||Te||ht===0,children:"선택 출석"}),F&&e.jsx(k,{children:"일괄 출석 처리 중…"})]}),D==="grades"&&e.jsxs(Hn,{children:[ra&&e.jsx(Tt,{role:"status",children:"시험 생성됨"}),!b&&E.length===0&&e.jsx(vt,{type:"button",onClick:()=>{va()},disabled:C||P,children:"시험 생성"}),!b&&E.length>0&&e.jsx(vt,{type:"button",onClick:()=>ja("list"),disabled:C,children:"시험 선택"}),!!b&&e.jsx(Ve,{type:"button","data-variant":"danger",onClick:()=>{wa()},disabled:C,children:"삭제"})]})]})}),D==="attendance"?e.jsxs(e.Fragment,{children:[!o?.id&&e.jsx(ke,{children:"서버 기록이 없어 출석 정보가 로컬에만 저장됩니다."}),Te&&e.jsx(Q,{children:"출석 불러오는 중..."}),Rt&&e.jsx(J,{children:Rt}),e.jsx(vs,{children:xn.length===0?e.jsx(Qe,{children:T.length===0?"등록된 학생이 없습니다.":ba?"조건에 맞는 학생이 없습니다.":"아직 출결 기록이 없습니다."}):xn.map(t=>{const n=t.status,a=n!=="none",s=n==="present",c=!!qn[t.id]||F!==null;return e.jsxs(ws,{children:[e.jsxs("div",{style:{display:"flex",alignItems:"center"},children:[e.jsx("strong",{children:t.name}),t.isExtra&&e.jsx(k,{style:{marginLeft:8},children:"(과거 수강생)"}),e.jsx($s,{"data-type":n,children:n==="present"?"출석":n==="absent"?"결석":"미처리"})]}),e.jsxs(Ss,{children:[e.jsx(ks,{placeholder:"메모",value:et[t.id]||"",onChange:u=>{const d=u.currentTarget.value;if(tt(f=>({...f,[t.id]:d})),l){const f=X().replace("attendance","attendanceNote");try{const h=JSON.parse(localStorage.getItem(f)||"{}");h[String(t.id)]=d,localStorage.setItem(f,JSON.stringify(h))}catch{}}if(l&&o?.id&&a){const f=Qn.current;f[t.id]&&window.clearTimeout(f[t.id]),f[t.id]=window.setTimeout(async()=>{ee(h=>({...h,[t.id]:!0}));try{const h=(d||"").trim()||void 0;await kt(l,o.id,t.id,{present:s===!0,reason:h,source:"MANUAL"})}catch(h){console.error("메모 자동 저장 실패",h)}finally{ee(h=>({...h,[t.id]:!1}))}},600)}},disabled:c}),e.jsxs(Ms,{children:[e.jsx(Gn,{"data-active":String(a&&s===!0),onClick:()=>{!c&&n!=="present"&&Mn(t.id,!0)},disabled:c,children:"출석"}),e.jsx(Gn,{"data-variant":"danger","data-active":String(a&&s===!1),onClick:()=>{!c&&n!=="absent"&&Mn(t.id,!1)},disabled:c,children:"결석"})]}),e.jsx(W,{title:o?.id?"서버 기록은 미처리로 되돌릴 수 없습니다.":"미처리로 초기화",onClick:()=>{o?.id||ua(t.id)},disabled:!!o?.id||c,children:"미처리"}),c&&e.jsx(k,{children:"저장 중..."})]})]},t.id)})})]}):e.jsxs(Ks,{"data-view":ne,children:[ne==="intro"&&e.jsxs(Xs,{children:[e.jsx(Ys,{children:"출석 학생의 성적을 기록하려면 우측 상단에서 시험을 생성하거나 선택하세요."}),C&&e.jsx(k,{children:"시험 정보를 불러오는 중입니다..."}),ae&&e.jsx(J,{children:ae})]}),ne==="list"&&e.jsxs(Zs,{children:[e.jsxs(er,{children:[e.jsxs("div",{children:[e.jsx(ve,{children:"등록된 시험/테스트"}),e.jsx(k,{children:"이 수업과 연결된 시험입니다."})]}),e.jsx("div",{className:"actions"})]}),C?e.jsx(Q,{children:"시험을 불러오는 중입니다..."}):ae?e.jsx(J,{children:ae}):e.jsx(Qe,{children:"우측 상단의 ‘시험 선택’에서 시험을 선택하세요."})]}),ne==="scores"&&(z?e.jsxs(ar,{children:[e.jsxs(sr,{children:[e.jsx("strong",{children:"성적 입력"}),e.jsxs("div",{className:"right",children:[e.jsx(lr,{"data-variant":z.inputMode==="percent"?"percent":"letter",children:z.inputMode==="percent"?"백분율":"등급"}),hn&&e.jsxs(k,{style:{marginLeft:8},children:["평균 ",hn]}),ia==="success"&&e.jsx(Tt,{role:"status",children:"저장 완료!"}),e.jsx(wt,{type:"button",onClick:()=>{pa()},disabled:ye||je.length===0||!la,children:ye?"저장 중…":"저장"}),e.jsx(Nt,{type:"button",onClick:()=>be({}),disabled:ye||Object.keys(A).length===0,children:"초기화"})]})]}),e.jsxs(rr,{children:[e.jsxs("div",{className:"row head",children:[e.jsx("span",{children:"학생명"}),e.jsx("span",{children:z.inputMode==="percent"?"점수(0~100)":"등급"})]}),je.length===0?e.jsx("div",{className:"row",children:e.jsx(k,{children:"학생이 없습니다."})}):je.map(t=>{const n=A[t.id]||{},a=Be[t.id];return e.jsxs("div",{className:"row",children:[e.jsxs("span",{className:"name",children:[t.name,A[t.id]?e.jsx(Ts,{title:"변경됨"}):null]}),e.jsx("span",{className:"control",children:z.inputMode==="percent"?e.jsx(ir,{type:"number",min:0,step:1,max:100,value:n.percent!==void 0?n.percent:a?.score!=null?String(a.score):"",placeholder:"0~100",onChange:s=>{const c=s.currentTarget.value;if(c===""){be(f=>({...f,[t.id]:{percent:""}}));return}const u=Number(c);if(!Number.isFinite(u))return;const d=Math.max(0,Math.min(100,Math.round(u)));be(f=>({...f,[t.id]:{percent:String(d)}}))},onWheel:s=>s.currentTarget.blur(),onKeyDown:s=>{["e","E","+","-"].includes(s.key)&&s.preventDefault()},inputMode:"numeric",pattern:"[0-9]*",disabled:ye}):e.jsxs(or,{value:n.letter!==void 0?n.letter:a?.level??"",onChange:s=>{const c=s.currentTarget.value,u=c===""?void 0:c;be(d=>({...d,[t.id]:{letter:u}}))},disabled:ye,children:[e.jsx("option",{value:"",children:"-"}),["A","B","C","D","E","F"].map(s=>e.jsx("option",{value:s,children:s},s))]})})]},`score2-${t.id}`)})]})]}):e.jsx(Qe,{children:"시험을 먼저 선택하세요."}))]})]})]})]}),e.jsx(Ua,{open:sa,title:ut==="create"?"시험/테스트 생성":"시험/테스트 선택",onClose:Sn,blockOutsideClose:!0,footer:ut==="create"?e.jsxs(e.Fragment,{children:[e.jsx(Ve,{type:"button",onClick:()=>{P||(Le("list"),K(null))},disabled:P,children:"목록으로"}),e.jsx(wt,{type:"button",onClick:()=>{Sa()},disabled:P,children:P?"생성 중…":"생성"})]}):e.jsxs(e.Fragment,{children:[e.jsx(Ve,{type:"button",onClick:Sn,children:"닫기"}),e.jsx(wt,{type:"button",onClick:kn,disabled:!b||C,children:"선택"})]}),children:ut==="create"?e.jsxs(pr,{children:[e.jsx("label",{children:"입력 방식"}),e.jsx(ur,{children:ss.map(t=>{const n=rn===t.value;return e.jsxs(fr,{type:"button","data-active":String(n),onClick:()=>pt(t.value),disabled:P,children:[e.jsxs("div",{className:"texts",children:[e.jsx("strong",{children:t.label}),e.jsx("span",{children:t.description})]}),n&&e.jsx("span",{className:"indicator",children:"선택됨"})]},t.value)})}),e.jsx(k,{children:"제목은 일자 기반으로 자동 지정됩니다."}),on&&e.jsx(J,{children:on})]}):e.jsx(cr,{children:C?e.jsx(Q,{children:"시험을 불러오는 중입니다..."}):ae?e.jsx(J,{children:ae}):E.length===0?e.jsx(Qe,{children:"등록된 시험이 없습니다."}):e.jsxs(dr,{children:[e.jsx("div",{style:{display:"flex",justifyContent:"flex-end",marginBottom:8},children:e.jsx(Cs,{placeholder:"시험 검색",value:ft,onChange:t=>ln(t.currentTarget.value)})}),e.jsx(tr,{children:cn.map(t=>{const n=String(t.id),a=b===n;return e.jsxs(nr,{type:"button","data-selected":String(a),onClick:()=>se(n),onDoubleClick:()=>kn(),disabled:C,children:[e.jsxs("div",{className:"meta",children:[e.jsx("strong",{children:t.title}),e.jsx("span",{children:t.inputMode==="percent"?"백분율 입력":"등급 입력"})]}),a&&e.jsx("span",{className:"indicator",children:"선택됨"})]},`modal-exam-${t.id}`)})}),cn.length===0&&e.jsx(k,{children:"조건에 맞는 시험이 없습니다."})]})})})]})}function On(p){if(!p)return"";const[j,N]=p.split(":");return`${j}:${N}`}function Mt(p,j){return p&&j?`${On(p)} ~ ${On(j)}`:""}function Fn(p){if(!p)return"일자 미지정";const j=as(p,{includeYear:!0,includeWeekday:!0});return j==="—"?p:j}function rs(p,j){if(!p||!j)return null;const[N,x]=p.split(":"),[Me,O]=j.split(":"),l=Number(N)*60+Number(x),y=Number(Me)*60+Number(O)-l;return y>=0?y:y+1440}function is(p){if(p==null||!Number.isFinite(p)||p<=0)return"미지정";const j=Math.floor(p/60),N=p%60;return j&&N?`${j}시간 ${N}분`:j?`${j}시간`:`${N}분`}const os=i.div`
  display: grid;
  gap: 12px;
`,ls=i.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 12px;
  align-items: center;
`,cs=i.div`
  display: inline-flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
`,ds=i.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
`,ps=i.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`,Rn=i.span`
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  border-radius: 999px;
  background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
  color: #312e81;
  font-weight: 800;
  font-size: 13px;
  white-space: nowrap;
  &[data-empty="true"] {
    background: #f3f4f6;
    color: #6b7280;
  }
`,Pn=i.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 999px;
  background: #f9fafb;
  color: #1f2937;
  font-weight: 700;
  font-size: 12px;
  border: 1px solid #e5e7eb;
  white-space: nowrap;
  &[data-empty="true"] {
    color: #6b7280;
    border-color: #e5e7eb;
  }
`,us=i.div`
  display: grid;
  gap: 8px;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  margin: 4px 0 8px;
  @media (max-width: 640px) {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  }
`,we=i.div`
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px 14px;
  background: #fff;
  display: grid;
  gap: 6px;
  .label {
    font-size: 12px;
    font-weight: 700;
    color: #6b7280;
  }
  strong {
    font-size: 20px;
    font-weight: 800;
    color: #111827;
  }
  &[data-tone="primary"] strong {
    color: #1d4ed8;
  }
  &[data-tone="success"] strong {
    color: #047857;
  }
  &[data-tone="danger"] strong {
    color: #b91c1c;
  }
  &[data-tone="warning"] strong {
    color: #b45309;
  }
  &[data-tone="muted"] strong {
    color: #4b5563;
  }
`,fs=i.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  @media (max-width: 1024px) {
    flex-direction: column;
  }
`,xs=i.div`
  flex: 1 1 0;
  display: grid;
  gap: 10px;
  align-content: flex-start;
  @media (max-width: 1024px) {
    order: 2;
  }
`,ms=i.div`
  flex: 1 1 0;
  display: grid;
  gap: 10px;
  align-content: flex-start;
  @media (max-width: 1024px) {
    order: 1;
  }
`,Je=i.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
`,hs=i.div`
  position: sticky;
  top: 0;
  z-index: 20;
  background: ${p=>p.theme.colors.surface};
  padding: 4px 0 0 0;
  margin-top: -4px;
  /* remove bottom divider under sticky attendance controls */
  border-bottom: 0;
`,Un=i.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 10px;
  li {
    display: grid;
    grid-template-columns: 110px 1fr;
    align-items: center;
  }
`,Se=i.span`
  color: #6b7280;
  font-size: 12px;
  font-weight: 700;
`,le=i.div`
  color: #111827;
  font-size: 14px;
  display: flex;
  align-items: center;
  min-height: 20px;
  column-gap: 6px;
`,Et=i(le)`
  font-weight: 800;
  font-size: 15px;
`,gs=i.div`
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 10px;
  border: 1px dashed #e5e7eb;
  border-radius: 10px;
  background: #f9fafb;
`,bs=i.span`
  color: #6b7280;
  font-size: 12px;
  font-weight: 700;
`,ys=i.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
`,Ct=i.input`
  height: 32px;
  padding: 0 10px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 13px;
`,js=i.div`
  grid-column: 1 / -1;
  display: flex;
  gap: 8px;
  align-items: center;
  margin-top: 2px;
`,Hn=i.div`
  display: flex;
  align-items: center;
  gap: ${p=>p.theme.spacing.sm};
  flex-wrap: wrap;
  justify-content: flex-end;
  margin-left: ${p=>p.theme.spacing.sm};
`,vs=i.div`
  display: grid;
  gap: 6px;
`,ws=i.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #fff;
`,Ss=i.div`
  display: flex;
  align-items: center;
  gap: 6px;
`,ks=i.input`
  height: 26px;
  width: 140px;
  padding: 0 8px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 12px;
  background: #fff;
`,Ms=i.div`
  display: inline-flex;
  gap: 6px;
`,Es=i.div`
  display: inline-flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
`,Tt=i.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 999px;
  background: #d1fae5;
  color: #047857;
  font-size: 11px;
  font-weight: 700;
  &:before {
    content: "✔";
  }
`;i.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  align-items: center;
  margin: 6px 0 6px 0;
`;i.div`
  display: inline-flex;
  gap: 6px;
  flex-wrap: wrap;
`;i.button`
  ${qe.outline};
  height: 30px;
  padding: 0 10px;
  font-size: 12px;
  &[data-active="true"] {
    background: #eef2ff;
    color: #3730a3;
    border-color: #c7d2fe;
  }
  &[data-variant="present"] {
    color: #065f46;
    border-color: #a7f3d0;
    background: #ecfdf5;
  }
  &[data-variant="present"][data-active="true"] {
    background: #d1fae5;
    color: #065f46;
    border-color: #6ee7b7;
  }
  &[data-variant="absent"] {
    color: #b91c1c;
    border-color: #fecaca;
    background: #fee2e2;
  }
  &[data-variant="absent"][data-active="true"] {
    background: #fecaca;
    color: #7f1d1d;
    border-color: #fca5a5;
  }
  &[data-variant="none"] {
    color: #374151;
    border-color: #e5e7eb;
    background: #f3f4f6;
  }
  &[data-variant="none"][data-active="true"] {
    background: #e5e7eb;
    color: #111827;
    border-color: #d1d5db;
  }
`;i.div`
  display: inline-flex;
  gap: 6px;
  align-items: center;
`;const Cs=i.input`
  height: 30px;
  padding: 0 10px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 12px;
`;i.button`
  ${qe.outline};
  height: 30px;
  padding: 0 12px;
  font-size: 12px;
`;const Ts=i.span`
  display: inline-block;
  width: 6px;
  height: 6px;
  margin-left: 6px;
  border-radius: 50%;
  background: #f59e0b; /* amber */
  vertical-align: middle;
`,Gn=i.button`
  ${qe.base};
  height: 32px;
  padding: 0 12px;
  font-size: 13px;
  background: ${p=>p.theme.colors.surfaceMuted};
  border: 1px solid ${p=>p.theme.colors.border};
  color: ${p=>p.theme.colors.text};
  &:hover:not(:disabled) {
    background: ${p=>p.theme.colors.surfaceAlt};
  }
  &:active:not(:disabled) {
    transform: translateY(1px);
    background: ${p=>p.theme.colors.surface};
  }
  &[data-active="true"] {
    background: #ecfdf5;
    border-color: #a7f3d0;
    color: #065f46;
  }
  &[data-variant="danger"] {
    background: ${p=>p.theme.colors.dangerSurface};
    border-color: ${p=>p.theme.colors.dangerSurface};
    color: ${p=>p.theme.colors.danger};
  }
  &[data-variant="danger"][data-active="true"] {
    background: ${p=>p.theme.colors.danger};
    border-color: ${p=>p.theme.colors.danger};
    color: ${p=>p.theme.colors.textInverted};
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`,$s=i.span`
  margin-left: 8px;
  padding: 2px 6px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  border: 1px solid #e5e7eb;
  color: #374151;
  background: #f3f4f6;
  &[data-type="present"] {
    background: #ecfdf5;
    color: #065f46;
    border-color: #a7f3d0;
  }
  &[data-type="absent"] {
    background: #fee2e2;
    color: #7f1d1d;
    border-color: #fecaca;
  }
  &[data-type="none"] {
    background: #f3f4f6;
    color: #6b7280;
    border-color: #e5e7eb;
  }
`,Ns=i.textarea`
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 8px 10px;
  font-size: 14px;
`;i.div`
  display: grid;
  gap: 6px;
  margin-top: 6px;
`;i.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 8px;
  border: 1px solid #f1f5f9;
  border-radius: 8px;
`;const Ds=i.div`
  color: #9ca3af;
  font-size: 13px;
  padding: 12px 0;
`,zs=i.div`
  display: grid;
  gap: 12px;
  margin-top: 10px;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
`;i.div`
  display: grid;
  gap: ${p=>p.theme.spacing.md};
`;i.div`
  display: flex;
  align-items: center;
  gap: ${p=>p.theme.spacing.sm};
`;const As=i.div`
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fff;
  padding: 10px;
  display: grid;
  gap: 8px;
`,Is=i.div`
  height: 120px;
  border-radius: 8px;
  background: #f3f4f6;
  display: grid;
  place-items: center;
  overflow: hidden;
`,Ls=i.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`,$t=i.div`
  color: #6b7280;
  font-size: 12px;
`,Bs=i.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  .name {
    font-size: 12px;
    color: #111827;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .size {
    font-size: 11px;
    color: #9ca3af;
  }
`,Os=i.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`,W=i(Nt)`
  height: 32px;
  padding: 0 12px;
  font-size: 13px;
`,ke=i.div`
  color: #6b7280;
  font-size: 12px;
  margin-top: 4px;
`,k=i.span`
  color: #9ca3af;
  font-size: 12px;
`,Fs=i.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`,Rs=i.div`
  display: grid;
  gap: ${p=>p.theme.spacing.sm};
  font-size: 14px;
  color: #334155;
`,Ps=i.div`
  display: grid;
  gap: ${p=>p.theme.spacing.xs};
  max-height: 240px;
  overflow-y: auto;
  padding-right: 4px;
`,Us=i.label`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #f9fafb;
  font-size: 13px;
  color: #1f2937;
  &[data-disabled="true"] {
    opacity: 0.6;
  }
  input {
    width: 16px;
    height: 16px;
  }
  .name {
    font-weight: 600;
  }
  .status {
    font-size: 12px;
    color: #6b7280;
    text-align: right;
  }
`,Hs=i.div`
  display: flex;
  justify-content: flex-end;
  font-size: 12px;
  color: #475569;
`,J=i.div`
  background: #fee2e2;
  color: #b91c1c;
  border: 1px solid #fecaca;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 13px;
`,Q=i.div`
  color: #6b7280;
  font-size: 12px;
`,Gs=i.button`
  ${qe.outline};
  height: 40px;
  padding: 0 16px;
  font-weight: 600;
  font-size: 14px;
`,Ws=e.jsx("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"15 18 9 12 15 6"})}),Vs=i.div`
  margin-top: 8px;
  border: 1px dashed #d1d5db;
  border-radius: 10px;
  padding: 10px;
  text-align: center;
  background: #f9fafb;
  color: #6b7280;
  font-size: 12px;
  .hint {
    pointer-events: none;
  }
`,_s=i.div`
  display: grid;
  gap: 8px;
  margin-top: 10px;
`,Js=i.div`
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 8px;
  background: #fff;
  display: grid;
  gap: 6px;
  .meta {
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: space-between;
  }
  .name {
    font-size: 12px;
    color: #111827;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
  }
  .size {
    font-size: 11px;
    color: #9ca3af;
  }
  .status {
    font-size: 11px;
    color: #6b7280;
  }
  .bar {
    height: 6px;
    background: #f3f4f6;
    border-radius: 999px;
    overflow: hidden;
  }
  .bar i {
    display: block;
    height: 100%;
    background: #a7f3d0;
  }
`,Qs=i.div`
  display: inline-flex;
  gap: 6px;
  align-items: center;
`,Wn=i(Nt)`
  height: 40px;
  padding: 0 16px;
  font-size: 14px;
  /* inactive: black text, white background, gray border (from UISmallBtn) */
  &[data-active="true"] {
    background: #f3f4f6; /* gray background */
    color: #111827; /* black text */
    border-color: #e5e7eb; /* gray border */
  }
`;i.div`
  height: 1px;
  background: #e5e7eb;
  margin: 6px 0 8px;
`;const qs=i.div`
  position: sticky;
  top: 0;
  z-index: 22;
  background: ${p=>p.theme.colors.surface};
  padding: 4px 0;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 6px;
`,Ks=i.div`
  display: grid;
  gap: 16px;
`,Xs=i.div`
  border: 1px dashed #d1d5db;
  border-radius: 12px;
  padding: 18px 20px;
  background: #f9fafb;
  display: grid;
  gap: 12px;
  max-width: 520px;
`;i.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 999px;
  background: #eef2ff;
  color: #3730a3;
  font-size: 12px;
  font-weight: 700;
`;const Ys=i.p`
  margin: 0;
  font-size: 13px;
  color: #475569;
  line-height: 1.6;
`,Zs=i.div`
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fff;
  padding: 16px;
  display: grid;
  gap: 16px;
`,er=i.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  .actions {
    display: inline-flex;
    gap: 8px;
    flex-wrap: wrap;
  }
  h2,
  h3,
  h4 {
    margin: 0;
  }
`,tr=i.div`
  display: grid;
  gap: 10px;
`,nr=i.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  text-align: left;
  padding: 12px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #f9fafb;
  cursor: pointer;
  transition: border-color 0.18s ease, background-color 0.18s ease;
  .meta {
    display: grid;
    gap: 4px;
  }
  .meta strong {
    font-size: 14px;
    color: #111827;
  }
  .meta span {
    font-size: 12px;
    color: #475569;
  }
  .indicator {
    font-size: 12px;
    color: #4f46e5;
    font-weight: 700;
  }
  &[data-selected="true"] {
    border-color: #6366f1;
    background: #eef2ff;
  }
`,ar=i.div`
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fff;
  padding: 12px;
  display: grid;
  gap: 10px;
`,sr=i.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  .right {
    display: inline-flex;
    gap: 8px;
    align-items: center;
  }
  .mode {
    font-size: 12px;
    color: #6b7280;
  }
`,rr=i.div`
  display: grid;
  gap: 8px;
  .row {
    display: grid;
    grid-template-columns: 1fr auto; /* name grows, control sticks to right */
    align-items: center;
    gap: 8px;
  }
  .row.head {
    color: #6b7280;
    font-size: 12px;
    font-weight: 800;
  }
  .row.head span:last-child {
    justify-self: end;
    text-align: right;
  }
  .name {
    font-weight: 700;
    color: #111827;
  }
  .control {
    display: inline-flex;
    justify-self: end; /* ensure input/select sits at far right */
  }
`,ir=i.input`
  height: 32px;
  padding: 0 10px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 12px;
  width: 100px;
`,or=i.select`
  height: 32px;
  padding: 0 10px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 12px;
  width: 100px;
  background: #fff;
`,lr=i.span`
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 800;
  border: 1px solid #e5e7eb;
  color: #374151;
  background: #f8fafc;
  &[data-variant="percent"] {
    background: #ecfdf5;
    color: #065f46;
    border-color: #a7f3d0;
  }
  &[data-variant="letter"] {
    background: #eef2ff;
    color: #3730a3;
    border-color: #c7d2fe;
  }
`;i.li`
  background: #f1f5f9;
  color: #475569;
  border: 1px dashed #cbd5e1;
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 12px;
  list-style: none;
`;i.div`
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #f8fafc;
  padding: 16px;
  display: grid;
  gap: 12px;
`;i.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  strong {
    font-size: 15px;
    color: #111827;
    display: block;
  }
  > div span {
    display: block;
    font-size: 12px;
    color: #475569;
    margin-top: 4px;
  }
  .count {
    font-size: 12px;
    font-weight: 700;
    color: #4f46e5;
  }
`;i.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  list-style: none;
  margin: 0;
  padding: 0;
  li {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 999px;
    padding: 6px 12px;
    font-size: 12px;
    color: #1f2937;
  }
`;const cr=i.div`
  display: grid;
  gap: 12px;
`,dr=i.div`
  max-height: 360px;
  overflow-y: auto;
  padding-right: 4px;
`;i.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  flex-wrap: wrap;
`;const pr=i.div`
  display: grid;
  gap: 12px;
  label {
    font-size: 12px;
    font-weight: 700;
    color: #475569;
  }
  input {
    height: 36px;
  }
`,ur=i.div`
  display: grid;
  gap: 8px;
`,fr=i.button`
  width: 100%;
  text-align: left;
  padding: 12px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  cursor: pointer;
  transition: border-color 0.18s ease, box-shadow 0.18s ease,
    background-color 0.18s ease;
  .texts {
    display: grid;
    gap: 4px;
  }
  .texts strong {
    font-size: 14px;
    color: #111827;
  }
  .texts span {
    font-size: 12px;
    color: #64748b;
  }
  .indicator {
    font-size: 12px;
    color: #4f46e5;
    font-weight: 700;
  }
  &[data-active="true"] {
    border-color: #4f46e5;
    background: #eef2ff;
    box-shadow: 0 2px 8px rgba(79, 70, 229, 0.12);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`,Qe=i.div`
  padding: 12px;
  color: #6b7280;
  font-size: 13px;
`;export{Nr as default};
