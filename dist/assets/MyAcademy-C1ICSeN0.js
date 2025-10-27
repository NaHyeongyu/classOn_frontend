import{r as t,j as n,d as l,f as H,F as un,u as pn,c as hn,H as fn,K as gn}from"./index-B0K7mn4q.js";import{M as U}from"./Modal-DH_Ki-Ju.js";import"./UI-Cj3YhchZ.js";function xn(e){return typeof e=="object"&&e!==null}function v(e,a){return e instanceof Error&&e.message||xn(e)&&typeof e.message=="string"?e.message:a}function Se(e){const a=(e||"").replace(/\D/g,"");return a.length===11&&a.startsWith("010")?`010-${a.slice(3,7)}-${a.slice(7)}`:null}function mn(e){return e==="교과목"?["국어","수학","사회","과학","영어"]:e==="예체능"?["스포츠","미술","음악"]:[]}function fe(e){const a=(e||"").replace(/\D/g,"").slice(0,10),r=a.slice(0,3),h=a.slice(3,5),i=a.slice(5,10);return[r,h,i].filter(Boolean).join("-")}function bn(e){return(e||"").replace(/\D/g,"").slice(0,10)}function yn({error:e,onDismissError:a,onLogout:r,account:h,academy:i}){const b=t.useMemo(()=>{if(!i.data)return"미설정";const{category1:f,category2:F,categoryEtc:A}=i.data;return f?f==="기타"?A?`${f} · ${A}`:f:F?`${f} · ${F}`:f:"미설정"},[i.data]);return n.jsxs(jn,{children:[n.jsxs(Mn,{children:[n.jsxs("div",{children:[n.jsx("h1",{children:"내 학원 정보"}),n.jsx("p",{children:"계정 및 학원 정보를 확인하고 필요 시 수정하세요."})]}),n.jsx(Cn,{children:n.jsx(wn,{type:"button",onClick:r,children:"로그아웃"})})]}),e?n.jsxs(kn,{children:[n.jsx("span",{children:e}),a?n.jsx(Sn,{type:"button",onClick:a,children:"닫기"}):null]}):null,n.jsxs(Ee,{children:[n.jsx(ze,{children:"계정 정보"}),n.jsxs(g,{children:[n.jsx(x,{children:"담당자 성함"}),n.jsx(m,{children:n.jsxs(pe,{children:[n.jsx("span",{children:h.name||"-"}),n.jsx(q,{type:"button",onClick:h.onOpenProfileModal,children:"이름 수정"})]})})]}),n.jsxs(g,{children:[n.jsx(x,{children:"휴대폰 번호"}),n.jsxs(m,{children:[n.jsxs(pe,{children:[n.jsx("span",{children:h.phone||"-"}),n.jsx(q,{type:"button",onClick:h.onOpenPhoneModal,children:"번호 변경"})]}),n.jsx(Pn,{children:"휴대폰 번호는 인증 모달에서 변경할 수 있습니다."})]})]}),n.jsxs(g,{children:[n.jsx(x,{children:"비밀번호"}),n.jsx(m,{children:n.jsxs(pe,{children:[n.jsx("span",{children:"••••••••"}),n.jsx(q,{type:"button",onClick:h.onOpenPasswordModal,children:"비밀번호 변경"})]})})]})]}),n.jsxs(Ee,{children:[n.jsxs(vn,{children:[n.jsx(ze,{children:"학원 정보"}),n.jsx(q,{type:"button",onClick:i.onOpenEditModal,children:"학원 정보 수정"})]}),n.jsxs(g,{children:[n.jsx(x,{children:"학원명"}),n.jsx(m,{children:i.data?.name||"-"})]}),n.jsxs(g,{children:[n.jsx(x,{children:"카테고리"}),n.jsx(m,{children:b||"-"})]}),n.jsxs(g,{children:[n.jsx(x,{children:"주소"}),n.jsx(m,{children:i.data?.address||"-"})]}),n.jsxs(g,{children:[n.jsx(x,{children:"대표자명"}),n.jsx(m,{children:i.data?.representativeName||"-"})]}),n.jsxs(g,{children:[n.jsx(x,{children:"학원 대표번호"}),n.jsx(m,{children:i.data?.phone||"-"})]}),n.jsxs(g,{children:[n.jsx(x,{children:"청구용 이메일"}),n.jsx(m,{children:i.data?.billingEmail||"-"})]}),n.jsxs(g,{children:[n.jsx(x,{children:"사업자번호"}),n.jsx(m,{children:i.data?.bizNo?fe(i.data.bizNo):"-"})]})]})]})}const jn=l.div`
  display: grid;
  gap: 16px;
`,Mn=l.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  h1 {
    margin: 0;
    font-size: 24px;
    color: #111827;
  }
  p {
    margin: 6px 0 0;
    color: #6b7280;
    font-size: 14px;
  }
`,Cn=l.div`
  display: flex;
  gap: 8px;
  align-items: center;
`,wn=l.button`
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #374151;
  font-weight: 600;
  border-radius: 10px;
  padding: 8px 16px;
  cursor: pointer;
  &:hover:not(:disabled) {
    background: #f8fafc;
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.65;
  }
`,Ee=l.section`
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: linear-gradient(180deg, #ffffff 0%, #f9fafb 100%);
  padding: 18px;
  display: grid;
  gap: 12px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05);
`,vn=l.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`,ze=l.h2`
  margin: 0;
  font-size: 16px;
  color: #1f2937;
`,g=l.div`
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 14px;
  align-items: flex-start;
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`,x=l.span`
  font-size: 12px;
  color: #6b7280;
  letter-spacing: 0.03em;
`,m=l.span`
  font-size: 15px;
  color: #111827;
  font-weight: 600;
  display: block;
`,pe=l.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`,q=l.button`
  border: none;
  background: transparent;
  color: #4f46e5;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  &:hover {
    text-decoration: underline;
  }
`,Pn=l.p`
  margin: 6px 0 0;
  font-size: 12px;
  color: #6b7280;
`,kn=l.div`
  border-radius: 12px;
  background: #fee2e2;
  border: 1px solid #fecaca;
  padding: 12px 16px;
  color: #b91c1c;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`,Sn=l.button`
  border: none;
  background: transparent;
  color: #b91c1c;
  font-weight: 600;
  cursor: pointer;
`;l.div`
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 18px;
  background: linear-gradient(90deg, #f3f4f6 0%, #f9fafb 50%, #f3f4f6 100%);
  background-size: 200% 100%;
  animation: shimmer 1.6s infinite;

  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;const I=l.form`
  display: grid;
  gap: 14px;
  min-width: 320px;
`,c=l.label`
  font-size: 13px;
  color: #475569;
`,p=l.input`
  height: 44px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 0 12px;
  font-size: 14px;
  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.18);
  }
`,En=l.textarea`
  min-height: 96px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 12px;
  font-size: 14px;
  resize: vertical;
  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.18);
  }
`,P=l.p`
  margin: -4px 0 0;
  font-size: 12px;
  color: ${({danger:e})=>e?"#b91c1c":"#64748b"};
`,J=l.p`
  margin: 0;
  font-size: 12px;
  color: #dc2626;
`,G=l.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`,N=l.button`
  border: 1px solid #cbd5f5;
  background: #ffffff;
  color: #4f46e5;
  font-size: 13px;
  border-radius: 999px;
  padding: 8px 16px;
  cursor: pointer;
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`,W=l.button`
  border: none;
  background: #4f46e5;
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
  border-radius: 999px;
  padding: 8px 18px;
  cursor: pointer;
  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`,zn=l.div`
  display: flex;
  align-items: center;
  gap: 10px;
`,Nn=l.span`
  font-size: 12px;
  color: #4f46e5;
`;function Fn({modal:e}){return n.jsx(U,{open:e.open,onClose:e.closeModal,title:"담당자 성함 수정",children:n.jsxs(I,{onSubmit:e.submit,children:[n.jsx(c,{htmlFor:"profile-name",children:"담당자 성함"}),n.jsx(p,{id:"profile-name",value:e.name,onChange:a=>e.setName(a.target.value),placeholder:"홍길동"}),n.jsx(P,{children:"계약 및 주요 안내를 받을 담당자 성함을 입력해 주세요."}),e.error?n.jsx(J,{children:e.error}):null,n.jsxs(G,{children:[n.jsx(N,{type:"button",onClick:e.closeModal,children:"취소"}),n.jsx(W,{type:"submit",disabled:e.submitting,children:e.submitting?"저장 중...":"저장"})]})]})})}function An({modal:e}){return n.jsx(U,{open:e.open,onClose:e.closeModal,title:"휴대폰 번호 변경",children:n.jsxs(I,{onSubmit:e.submit,children:[n.jsx(c,{htmlFor:"phone-modal-number",children:"새 휴대폰 번호"}),n.jsx(p,{id:"phone-modal-number",value:e.value,onChange:a=>e.setValue(a.target.value.replace(/\D/g,"").slice(0,11)),placeholder:"01012345678",inputMode:"numeric",autoComplete:"tel"}),n.jsx(P,{children:"010으로 시작하는 숫자 11자리를 입력해 주세요."}),n.jsxs(zn,{children:[n.jsx(N,{type:"button",onClick:e.sendCode,disabled:e.requesting||e.cooldown>0||e.digits.length!==11||!e.digits.startsWith("010"),children:e.requesting?"발송 중...":e.cooldown>0?`${e.cooldown}초 후 재전송`:"인증번호 발송"}),e.message?n.jsx(Nn,{children:e.message}):null]}),n.jsx(c,{htmlFor:"phone-modal-code",children:"인증번호"}),n.jsx(p,{id:"phone-modal-code",value:e.code,onChange:a=>e.setCode(a.target.value.replace(/\D/g,"").slice(0,6)),placeholder:"6자리 숫자",inputMode:"numeric",maxLength:6}),e.error?n.jsx(J,{children:e.error}):null,n.jsxs(G,{children:[n.jsx(N,{type:"button",onClick:e.closeModal,children:"취소"}),n.jsx(W,{type:"submit",disabled:e.submitting,children:e.submitting?"변경 중...":"번호 변경"})]})]})})}function On({modal:e}){return n.jsx(U,{open:e.open,onClose:e.closeModal,title:"비밀번호 변경",children:n.jsxs(I,{onSubmit:e.submit,children:[n.jsx(c,{htmlFor:"password-current",children:"현재 비밀번호"}),n.jsx(p,{id:"password-current",type:"password",value:e.current,onChange:a=>e.setCurrent(a.target.value),placeholder:"현재 비밀번호",autoComplete:"current-password"}),n.jsx(c,{htmlFor:"password-new",children:"새 비밀번호"}),n.jsx(p,{id:"password-new",type:"password",value:e.next,onChange:a=>e.setNext(a.target.value),placeholder:"새 비밀번호 (8자 이상)",autoComplete:"new-password"}),e.tooShort?n.jsx(P,{danger:!0,children:"새 비밀번호는 8자 이상 입력해 주세요."}):null,n.jsx(c,{htmlFor:"password-confirm",children:"비밀번호 확인"}),n.jsx(p,{id:"password-confirm",type:"password",value:e.confirm,onChange:a=>e.setConfirm(a.target.value),placeholder:"새 비밀번호 확인",autoComplete:"new-password"}),e.mismatch&&!e.tooShort?n.jsx(P,{danger:!0,children:"새 비밀번호가 일치하지 않습니다."}):null,e.error?n.jsx(J,{children:e.error}):null,n.jsxs(G,{children:[n.jsx(N,{type:"button",onClick:e.closeModal,children:"취소"}),n.jsx(W,{type:"submit",disabled:e.submitting,children:e.submitting?"변경 중...":"비밀번호 변경"})]})]})})}const Dn=["교과목","예체능","기타"];function Rn({modal:e}){const a=mn(e.form.category1);return n.jsx(U,{open:e.open,onClose:e.closeModal,title:"학원 정보 수정",children:n.jsxs(I,{onSubmit:e.submit,children:[n.jsx(c,{htmlFor:"academy-name",children:"학원명"}),n.jsx(p,{id:"academy-name",value:e.form.name,onChange:r=>e.updateField("name",r.target.value),placeholder:"예: 클라썬어학원"}),n.jsx(c,{children:"카테고리"}),n.jsx(Ne,{children:Dn.map(r=>n.jsx(Fe,{type:"button","data-active":e.form.category1===r,onClick:()=>e.selectCategory1(r),children:r},r))}),n.jsx(P,{children:"주력 분야를 선택해 주세요. 기타를 선택하면 직접 입력할 수 있습니다."}),e.form.category1&&e.form.category1!=="기타"&&n.jsxs(n.Fragment,{children:[n.jsx(c,{children:"세부 카테고리 (선택)"}),n.jsx(Ne,{children:a.map(r=>n.jsx(Fe,{type:"button","data-active":e.form.category2===r,onClick:()=>e.toggleCategory2(r),children:r},r))})]}),e.form.category1==="기타"&&n.jsxs(n.Fragment,{children:[n.jsx(c,{htmlFor:"academy-category-etc",children:"기타 분류"}),n.jsx(p,{id:"academy-category-etc",value:e.form.categoryEtc,onChange:r=>e.updateField("categoryEtc",r.target.value),placeholder:"예: 코딩, 바둑 등"})]}),n.jsx(c,{htmlFor:"academy-address",children:"주소"}),n.jsx(En,{id:"academy-address",value:e.form.address,onChange:r=>e.updateField("address",r.target.value),placeholder:"도로명 주소를 입력하세요"}),n.jsx(c,{htmlFor:"academy-representative",children:"대표자명"}),n.jsx(p,{id:"academy-representative",value:e.form.representativeName,onChange:r=>e.updateField("representativeName",r.target.value),placeholder:"대표자명을 입력하세요"}),n.jsx(c,{htmlFor:"academy-phone",children:"학원 대표번호"}),n.jsx(p,{id:"academy-phone",value:e.form.phone,onChange:r=>e.updateField("phone",r.target.value),placeholder:"예: 021234567"}),n.jsx(c,{htmlFor:"academy-email",children:"청구용 이메일"}),n.jsx(p,{id:"academy-email",type:"email",value:e.form.billingEmail,onChange:r=>e.updateField("billingEmail",r.target.value),placeholder:"billing@example.com"}),n.jsx(c,{htmlFor:"academy-bizno",children:"사업자번호"}),n.jsx(p,{id:"academy-bizno",value:e.form.bizNo,onChange:r=>e.updateField("bizNo",fe(r.target.value)),placeholder:"###-##-#####",inputMode:"numeric",maxLength:12}),n.jsx(P,{children:"숫자만 입력해도 자동으로 형식에 맞춰집니다."}),e.error?n.jsx(J,{children:e.error}):null,n.jsxs(G,{children:[n.jsx(N,{type:"button",onClick:e.closeModal,children:"취소"}),n.jsx(W,{type:"submit",disabled:e.submitting,children:e.submitting?"저장 중...":"학원 정보 저장"})]})]})})}const Ne=l.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`,Fe=l.button`
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  color: #374151;
  font-weight: 600;
  border-radius: 999px;
  padding: 6px 14px;
  cursor: pointer;
  &[data-active="true"] {
    background: #4f46e5;
    color: #ffffff;
    border-color: transparent;
  }
`;async function Tn(){return H("/api/account/academy")}async function Vn(e){return H("/api/account/academy",{method:"PUT",body:JSON.stringify(e)})}async function Ae(e){await H("/api/account/user",{method:"PUT",body:JSON.stringify(e)})}async function Bn(e,a){await H("/api/account/password",{method:"PUT",body:JSON.stringify({currentPassword:e,newPassword:a})})}function he(e){return{name:e?.name??"",category1:e?.category1??"",category2:e?.category2??"",categoryEtc:e?.categoryEtc??"",address:e?.address??"",representativeName:e?.representativeName??"",phone:e?.phone??"",billingEmail:e?.billingEmail??"",bizNo:fe(e?.bizNo??"")}}function $n(){const{user:e,validate:a,logout:r}=un(),h=pn(),i=hn(),[b,f]=t.useState(null),[F,A]=t.useState(!0),[Oe,ge]=t.useState(null),[K,xe]=t.useState(e?.name??""),[Y,me]=t.useState(e?.phone??""),[De,be]=t.useState(!1),[_,ye]=t.useState(""),[Re,k]=t.useState(null),[Te,O]=t.useState(!1),[Q,je]=t.useState(!1),[w,X]=t.useState(""),[Z,ee]=t.useState(""),[ne,D]=t.useState(0),[Ve,te]=t.useState(!1),[Be,R]=t.useState(!1),[$e,d]=t.useState(null),[Le,S]=t.useState(null),[qe,Me]=t.useState(!1),[T,oe]=t.useState(""),[j,se]=t.useState(""),[E,ae]=t.useState(""),[He,V]=t.useState(!1),[Ue,y]=t.useState(null),[Ie,Ce]=t.useState(!1),[u,z]=t.useState(he(null)),[Je,M]=t.useState(null),[Ge,B]=t.useState(!1),re=j.length>0&&j.length<8,le=j.length>0&&E.length>0&&j!==E,We=t.useMemo(()=>w.replace(/\D/g,""),[w]);t.useEffect(()=>{xe(e?.name??""),me(e?.phone??"")},[e?.name,e?.phone]),t.useEffect(()=>{if(!Q||ne<=0)return;const o=window.setTimeout(()=>{D(s=>s>0?s-1:0)},1e3);return()=>window.clearTimeout(o)},[Q,ne]),t.useEffect(()=>{let o=!0;return(async()=>{try{const s=await Tn();if(!o)return;f(s)}catch(s){if(!o)return;f({id:0,name:"",bizNo:"",address:"",representativeName:"",phone:"",billingEmail:"",category1:"",category2:"",categoryEtc:""}),ge(v(s,"학원 정보를 불러오지 못했습니다. 정보를 입력 후 저장해 주세요."))}finally{o&&A(!1)}})(),()=>{o=!1}},[]);const Ke=t.useCallback(()=>ge(null),[]),Ye=t.useCallback(()=>{r(),h("/login",{replace:!0})},[r,h]),we=t.useCallback(()=>{ye(K),k(null),O(!1),be(!0)},[K]),$=t.useCallback(()=>{be(!1),k(null),O(!1)},[]),_e=t.useCallback(async o=>{o.preventDefault();const s=_.trim();if(!s){k("담당자 성함을 입력해 주세요.");return}if(s===(e?.name??"")){$();return}O(!0);try{await Ae({name:s}),await a(),xe(s),i.success("프로필이 저장되었습니다."),$()}catch(C){k(v(C,"프로필 저장에 실패했습니다."))}finally{O(!1)}},[$,_,i,e?.name,a]),Qe=t.useCallback(o=>{ye(o),k(null)},[]),ve=t.useCallback(()=>{const o=(Y??"").replace(/\D/g,"");X(o),ee(""),d(null),S(null),D(0),R(!1),je(!0)},[Y]),ie=t.useCallback(()=>{je(!1),X(""),ee(""),d(null),S(null),te(!1),R(!1),D(0)},[]),Xe=t.useCallback(async()=>{d(null),S(null);const o=Se(w);if(!o){d("휴대폰 번호 형식을 확인해 주세요 (010-1234-5678).");return}te(!0);try{const s=await fn(o);s.success?(S(s.code?`인증번호(${s.code})가 발송되었습니다.`:"인증번호가 발송되었습니다."),D(60)):d("인증번호 발송에 실패했습니다.")}catch(s){d(v(s,"인증번호 발송에 실패했습니다."))}finally{te(!1)}},[w]),Ze=t.useCallback(o=>{X(o),d(null),S(null)},[]),en=t.useCallback(o=>{ee(o),d(null)},[]),nn=t.useCallback(async o=>{o.preventDefault(),d(null);const s=Se(w);if(!s){d("휴대폰 번호 형식을 확인해 주세요 (010-1234-5678).");return}const C=Z.trim();if(C.length!==6){d("인증번호 6자리를 입력해 주세요.");return}R(!0);try{if(!(await gn(s,C)).success){d("인증번호가 올바르지 않습니다.");return}await Ae({phone:s}),await a(),me(s),i.success("휴대폰 번호가 변경되었습니다."),ie()}catch(L){d(v(L,"휴대폰 번호 변경에 실패했습니다."))}finally{R(!1)}},[ie,Z,w,i,a]),Pe=t.useCallback(()=>{oe(""),se(""),ae(""),y(null),V(!1),Me(!0)},[]),ce=t.useCallback(()=>{Me(!1),oe(""),se(""),ae(""),y(null),V(!1)},[]),tn=t.useCallback(async o=>{if(o.preventDefault(),!T||!j||!E){y("현재 비밀번호와 새 비밀번호를 모두 입력해 주세요.");return}if(re){y("새 비밀번호는 8자 이상 입력해 주세요.");return}if(le){y("새 비밀번호 확인이 일치하지 않습니다.");return}V(!0);try{await Bn(T,j),i.success("비밀번호가 변경되었습니다."),ce()}catch(s){y(v(s,"비밀번호 변경에 실패했습니다."))}finally{V(!1)}},[ce,le,E,T,j,re,i]),on=t.useCallback(o=>{oe(o),y(null)},[]),sn=t.useCallback(o=>{se(o),y(null)},[]),an=t.useCallback(o=>{ae(o),y(null)},[]),ke=t.useCallback(()=>{z(he(b)),M(null),B(!1),Ce(!0)},[b]),de=t.useCallback(()=>{Ce(!1),M(null),B(!1),z(he(b))},[b]),rn=t.useCallback((o,s)=>{z(C=>({...C,[o]:s})),M(null)},[]),ln=t.useCallback(o=>{z(s=>({...s,category1:o,category2:"",categoryEtc:o==="기타"?s.categoryEtc:""})),M(null)},[]),cn=t.useCallback(o=>{z(s=>({...s,category2:s.category2===o?"":o})),M(null)},[]),dn=t.useCallback(async o=>{o.preventDefault();const s=u.name.trim();if(!s){M("학원명을 입력해 주세요.");return}if(!u.category1){M("최소 한 가지 카테고리를 선택해 주세요.");return}const C=bn(u.bizNo),L={id:b?.id,name:s,category1:u.category1,category2:u.category2||void 0,categoryEtc:u.category1==="기타"&&u.categoryEtc.trim()||void 0,address:u.address.trim()||void 0,representativeName:u.representativeName.trim()||void 0,phone:u.phone.trim()||void 0,billingEmail:u.billingEmail.trim()||void 0,bizNo:C||void 0};B(!0);try{const ue=await Vn(L);f(ue),i.success("학원 정보가 저장되었습니다."),de()}catch(ue){M(v(ue,"학원 정보 저장에 실패했습니다."))}finally{B(!1)}},[b,u,de,i]);return{loading:F,error:Oe,account:{name:K,phone:Y,onOpenProfileModal:we,onOpenPhoneModal:ve,onOpenPasswordModal:Pe},academy:{data:b,onOpenEditModal:ke},profileModal:{open:De,name:_,error:Re,submitting:Te,openModal:we,closeModal:$,setName:Qe,submit:_e},phoneModal:{open:Q,value:w,code:Z,digits:We,cooldown:ne,requesting:Ve,submitting:Be,error:$e,message:Le,openModal:ve,closeModal:ie,setValue:Ze,setCode:en,sendCode:Xe,submit:nn},passwordModal:{open:qe,current:T,next:j,confirm:E,tooShort:re,mismatch:le,submitting:He,error:Ue,openModal:Pe,closeModal:ce,setCurrent:on,setNext:sn,setConfirm:an,submit:tn},academyModal:{open:Ie,form:u,submitting:Ge,error:Je,openModal:ke,closeModal:de,updateField:rn,selectCategory1:ln,toggleCategory2:cn,submit:dn},handleLogout:Ye,clearError:Ke}}function Yn(){const e=$n();return n.jsxs(n.Fragment,{children:[n.jsx(yn,{error:e.error,onDismissError:e.clearError,onLogout:e.handleLogout,account:e.account,academy:e.academy}),n.jsx(Fn,{modal:e.profileModal}),n.jsx(An,{modal:e.phoneModal}),n.jsx(On,{modal:e.passwordModal}),n.jsx(Rn,{modal:e.academyModal})]})}export{Yn as default};
