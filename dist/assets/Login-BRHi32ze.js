import{d as o,r as s,j as t,E as Ze,F as _e,u as et,G as tt,H as ce,I as st,J as nt}from"./index-B0K7mn4q.js";import{C as ot}from"./ConfirmDialog-ClQeXE4D.js";import{M as fe}from"./Modal-DH_Ki-Ju.js";import"./UI-Cj3YhchZ.js";const pe=o.form`
  display: grid;
  gap: 14px;
  min-width: 280px;
`,q=o.label`
  font-size: 13px;
  color: #475569;
`,E=o.input`
  height: 46px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 0 14px;
  font-size: 14px;
  background: #f8fafc;
  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.18);
    background: #ffffff;
  }
  &[aria-invalid="true"] {
    border-color: #ef4444;
    background: #fef2f2;
  }
`,H=o.p`
  margin: -6px 0 0;
  font-size: 12px;
  color: #94a3b8;
`,ge=o.p`
  margin: 0;
  font-size: 12px;
  color: #dc2626;
`,it=o.span`
  font-size: 12px;
  color: #4f46e5;
`,xe=o.div`
  margin-top: 8px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`,G=o.button`
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
`,he=o.button`
  border: none;
  background: #4f46e5;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  border-radius: 999px;
  padding: 8px 18px;
  cursor: pointer;
  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`,be=o.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
`,rt=o.span`
  font-size: 12px;
  color: #4f46e5;
`,lt=s.forwardRef(function({modal:e,onSelectReset:a},l){return t.jsx(fe,{open:e.open,onClose:e.closeModal,title:"아이디 찾기",initialFocusRef:l,children:t.jsxs(pe,{onSubmit:e.submit,children:[t.jsx(q,{htmlFor:"find-phone",children:"가입자 연락처"}),t.jsx(E,{id:"find-phone",ref:l,value:e.phone,onChange:c=>e.setPhone(c.target.value),placeholder:"휴대폰 번호 (숫자만)",inputMode:"numeric",maxLength:11,"aria-invalid":e.submitted&&e.digits.length!==11}),t.jsx(H,{children:"가입자 휴대폰 번호로 인증번호를 받아주세요."}),t.jsxs(be,{children:[t.jsx(G,{type:"button",onClick:e.sendCode,disabled:e.requestingCode||e.cooldown>0||e.digits.length!==11||!e.digits.startsWith("010"),children:e.requestingCode?"발송 중...":e.cooldown>0?`${e.cooldown}초 후 재전송`:"인증번호 발송"}),e.message?t.jsx(rt,{children:e.message}):null]}),e.codeVisible?t.jsxs(t.Fragment,{children:[t.jsx(q,{htmlFor:"find-code",children:"인증번호"}),t.jsx(E,{id:"find-code",ref:e.codeRef,value:e.code,onChange:c=>e.setCode(c.target.value),placeholder:"6자리 숫자",inputMode:"numeric",maxLength:6,"aria-invalid":e.submitted&&e.code.trim().length<6}),t.jsx(H,{children:"수신한 6자리 인증번호를 입력해 주세요."})]}):null,e.error?t.jsx(ge,{children:e.error}):null,e.accounts.length>0?t.jsxs(at,{children:[t.jsx(ct,{children:"조회된 아이디"}),t.jsx(dt,{children:e.accounts.map(c=>t.jsxs(ut,{children:[t.jsx("strong",{children:c.username}),t.jsx(ft,{type:"button",onClick:()=>a(c,e.phone),children:"비밀번호 찾기"})]},c.username))}),t.jsx(pt,{children:"비밀번호가 기억나지 않는 계정을 선택하여 임시 비밀번호를 발급받을 수 있습니다."})]}):null,t.jsxs(xe,{children:[t.jsx(G,{type:"button",onClick:e.closeModal,children:"닫기"}),t.jsx(he,{type:"submit",disabled:e.loading,children:e.loading?"조회 중...":"조회"})]})]})})}),at=o.div`
  border: 2px solid #4f46e5;
  background: #eef2ff;
  border-radius: 14px;
  padding: 16px;
  font-size: 13px;
  color: #1f2937;
  box-shadow: 0 10px 24px rgba(79, 70, 229, 0.18);
`,ct=o.div`
  font-weight: 800;
  color: #312e81;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
`,dt=o.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 10px;
`,ut=o.li`
  padding: 12px 16px;
  border-radius: 12px;
  background: #fff;
  border: 1px solid #e0e7ff;
  box-shadow: 0 6px 14px rgba(79, 70, 229, 0.08);
  display: flex;
  align-items: center;
  gap: 12px;
  strong {
    font-size: 16px;
    color: #1f2937;
    flex: 1;
  }
`,ft=o.button`
  border: none;
  background: transparent;
  color: #4f46e5;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  &:hover {
    text-decoration: underline;
  }
`,pt=o.p`
  margin: 14px 0 0;
  font-size: 12px;
  color: #475569;
`,gt=s.forwardRef(function({modal:e},a){return t.jsx(fe,{open:e.open,onClose:e.closeModal,title:"비밀번호 찾기",initialFocusRef:a,children:t.jsxs(pe,{onSubmit:e.submit,children:[t.jsx(q,{htmlFor:"reset-username",children:"아이디"}),t.jsx(E,{id:"reset-username",value:e.username,onChange:l=>e.setUsername(l.target.value),placeholder:"아이디를 입력하세요","aria-invalid":e.submitted&&!e.username.trim()}),t.jsx(q,{htmlFor:"reset-phone",children:"휴대폰 번호"}),t.jsx(E,{id:"reset-phone",ref:a,value:e.phone,onChange:l=>e.setPhone(l.target.value),placeholder:"휴대폰 번호 (숫자만)",inputMode:"numeric",maxLength:11,"aria-invalid":e.submitted&&e.digits.length!==11}),t.jsx(H,{children:"아이디와 휴대폰 번호가 일치하면 임시 비밀번호를 발급해 드립니다."}),t.jsxs(be,{children:[t.jsx(G,{type:"button",onClick:e.sendCode,disabled:e.requestingCode||e.cooldown>0||e.digits.length!==11||!e.digits.startsWith("010")||!e.username.trim(),children:e.requestingCode?"발송 중...":e.cooldown>0?`${e.cooldown}초 후 재전송`:"인증번호 발송"}),e.message?t.jsx(it,{children:e.message}):null]}),e.codeVisible?t.jsxs(t.Fragment,{children:[t.jsx(q,{htmlFor:"reset-code",children:"인증번호"}),t.jsx(E,{id:"reset-code",ref:e.codeRef,value:e.code,onChange:l=>e.setCode(l.target.value),placeholder:"6자리 숫자",inputMode:"numeric",maxLength:6,"aria-invalid":e.submitted&&e.code.trim().length<6}),t.jsx(H,{children:"수신한 6자리 인증번호를 입력해 주세요."})]}):null,e.error?t.jsx(ge,{children:e.error}):null,e.result?t.jsxs(xt,{children:[t.jsx(ht,{children:"임시 비밀번호"}),t.jsx("p",{children:t.jsx(mt,{children:e.result})}),t.jsx(bt,{children:"로그인 후 비밀번호를 꼭 변경해 주세요."})]}):null,t.jsxs(xe,{children:[t.jsx(G,{type:"button",onClick:e.closeModal,children:"닫기"}),t.jsx(he,{type:"submit",disabled:e.submitting,children:e.submitting?"발급 중...":"임시 비밀번호 발급"})]})]})})}),xt=o.div`
  border: 2px solid #4f46e5;
  background: #eef2ff;
  border-radius: 14px;
  padding: 16px;
  font-size: 13px;
  color: #1f2937;
  box-shadow: 0 10px 24px rgba(79, 70, 229, 0.18);
`,ht=o.div`
  font-weight: 800;
  color: #312e81;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
`,bt=o.p`
  margin: 6px 0 0;
  font-size: 12px;
  color: #64748b;
`,mt=o.span`
  font-weight: 800;
  color: #1f2937;
  font-size: 16px;
`;function jt({form:n,dialog:e,findIdModal:a,resetModal:l}){return t.jsxs(Ct,{children:[t.jsx(wt,{children:t.jsx("img",{src:"/logo/logo.svg",alt:"Academy Manager 로고"})}),t.jsx(Rt,{children:"로그인"}),t.jsx(yt,{children:"계정에 접속하여 서비스를 이용하세요."}),t.jsxs(St,{onSubmit:n.onSubmit,children:[t.jsxs(de,{children:["아이디",t.jsx("span",{children:"*"})]}),t.jsx(ue,{type:"text",value:n.username,onChange:c=>n.setUsername(c.target.value),placeholder:"아이디를 입력하세요",required:!0,"aria-invalid":n.submitted&&!n.username.trim()}),t.jsxs(de,{children:["비밀번호",t.jsx("span",{children:"*"})]}),t.jsx(ue,{type:"password",value:n.password,onChange:c=>n.setPassword(c.target.value),placeholder:"••••••••",required:!0,"aria-invalid":n.submitted&&!n.password.trim()}),t.jsx(Mt,{type:"submit",disabled:n.loading,children:n.loading?"로그인 중...":"로그인"})]}),t.jsx(ot,{open:e.open,title:"로그인 실패",message:e.message,hideCancel:!0,onCancel:e.close,onConfirm:e.close}),t.jsxs(vt,{children:[t.jsxs(kt,{children:["계정이 없으신가요? ",t.jsx(Ze,{to:"/register",children:"회원가입"})]}),t.jsxs(Ft,{children:[t.jsx("button",{type:"button",onClick:a.openModal,children:"아이디 찾기"}),t.jsx(zt,{}),t.jsx("button",{type:"button",onClick:()=>l.openModal(),children:"비밀번호 찾기"})]})]}),t.jsx(lt,{modal:a,onSelectReset:l.openFromFind,ref:a.phoneRef}),t.jsx(gt,{modal:l,ref:l.phoneRef})]})}const Ct=o.div`
  padding: 48px 16px 64px;
  max-width: 480px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`,wt=o.div`
  display: grid;
  place-items: center;
  margin: 20px 0 8px;
  img {
    height: 48px;
    width: auto;
  }
`,Rt=o.h1`
  margin: 0 0 12px;
  font-size: 30px;
  color: #111827;
`,yt=o.p`
  margin: 0 0 24px;
  color: #6b7280;
  font-size: 15px;
`,St=o.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`,de=o.label`
  font-size: 13px;
  color: #6b7280;
  span {
    color: #ef4444;
    margin-left: 4px;
  }
`,ue=o.input`
  height: 54px;
  border: none;
  border-radius: 14px;
  padding: 0 16px;
  font-size: 15px;
  background: #f3f4f6;
  outline: none;
  transition: box-shadow 0.15s ease, background 0.15s ease;
  &::placeholder {
    color: #9ca3af;
  }
  &:focus {
    background: #eef2ff;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.18);
  }
  &[aria-invalid="true"] {
    background: #fee2e2;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.18);
  }
`,Mt=o.button`
  border: none;
  height: 54px;
  border-radius: 14px;
  background: #4f46e5;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  &:active:not(:disabled) {
    transform: translateY(1px);
  }
`,vt=o.div`
  margin-top: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  color: #6b7280;
  a {
    color: #4f46e5;
    font-weight: 700;
  }
`,kt=o.span``,Ft=o.div`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  button {
    border: none;
    background: transparent;
    color: #4f46e5;
    font-weight: 600;
    cursor: pointer;
    padding: 0;
  }
  button:hover {
    text-decoration: underline;
  }
`,zt=o.span`
  width: 1px;
  height: 12px;
  background: #cbd5f5;
  display: inline-block;
`;function Pt(){const{login:n}=_e(),e=et(),c=tt().state?.from||"/",[R,p]=s.useState(""),[T,me]=s.useState(""),[je,Ce]=s.useState(!1),[we,oe]=s.useState(!1),[Re,W]=s.useState(!1),[ye,ie]=s.useState("로그인에 실패했습니다."),[J,re]=s.useState(!1),[y,Y]=s.useState(""),[K,S]=s.useState(""),[Se,U]=s.useState(!1),[Me,I]=s.useState(!1),[ve,V]=s.useState(!1),[Q,M]=s.useState(0),[ke,x]=s.useState(null),[Fe,u]=s.useState(null),[ze,v]=s.useState(!1),[$,h]=s.useState([]),[X,Z]=s.useState(!1),[k,A]=s.useState(""),[_,B]=s.useState(""),[ee,b]=s.useState(""),[Pe,m]=s.useState(null),[Le,d]=s.useState(null),[De,g]=s.useState(null),[qe,O]=s.useState(!1),[Ee,F]=s.useState(!1),[te,j]=s.useState(0),[Te,z]=s.useState(!1),[Ue,C]=s.useState(!1),Ie=s.useRef(null),le=s.useRef(null),Ve=s.useRef(null),ae=s.useRef(null),P=s.useMemo(()=>ne(y),[y]),L=s.useMemo(()=>ne(_),[_]);s.useEffect(()=>{if(!J||Q<=0)return;const r=window.setTimeout(()=>{M(i=>i>0?i-1:0)},1e3);return()=>window.clearTimeout(r)},[J,Q]),s.useEffect(()=>{if(!X||te<=0)return;const r=window.setTimeout(()=>{j(i=>i>0?i-1:0)},1e3);return()=>window.clearTimeout(r)},[X,te]);const $e=s.useCallback(async r=>{if(r.preventDefault(),Ce(!0),!R.trim()||!T.trim()){ie("아이디와 비밀번호를 입력해 주세요."),W(!0);return}oe(!0);try{await n(R.trim(),T),e(c,{replace:!0})}catch(i){ie(Lt(i)),W(!0)}finally{oe(!1)}},[n,e,T,c,R]),Ae=s.useCallback(()=>{re(!0),Y(""),S(""),x(null),u(null),h([]),U(!1),I(!1),V(!1),M(0),v(!1)},[]),se=s.useCallback(()=>{re(!1),I(!1),V(!1),x(null),u(null),h([]),U(!1),Y(""),S(""),M(0),v(!1)},[]),Be=s.useCallback(r=>{Y(r.replace(/\D/g,"").slice(0,11)),x(null),u(null),h([]),S(""),M(0),v(!1)},[]),Oe=s.useCallback(r=>{S(r.replace(/\D/g,"").slice(0,6)),u(null)},[]),Ne=s.useCallback(async()=>{U(!1),u(null),x(null),h([]);const r=P;if(r.length!==11){u("휴대폰 번호 11자리를 입력해 주세요.");return}V(!0);try{const i=await ce(r);i.success?(x(i.code?`인증번호(${i.code})가 발급되었습니다.`:"인증번호가 발송되었습니다."),M(60),v(!0),S(""),window.setTimeout(()=>{le.current?.focus()},0)):u("인증번호 발송에 실패했습니다.")}catch(i){u(N(i,"인증번호 발송에 실패했습니다."))}finally{V(!1)}},[P]),He=s.useCallback(async r=>{r.preventDefault(),U(!0),u(null),x(null),h([]);const i=P;if(i.length!==11){u("휴대폰 번호 11자리를 입력해 주세요.");return}const f=K.trim();if(f.length!==6){v(!0),u("인증번호 6자리를 입력해 주세요.");return}I(!0);try{const w=(await st(i,f)).accounts??[];h(w),w.length===0&&u("일치하는 아이디를 찾지 못했습니다.")}catch(D){u(N(D,"아이디 조회에 실패했습니다."))}finally{I(!1)}},[K,P]),Ge=s.useCallback((r,i)=>{const f=r?.username??($.length===1?$[0]?.username??"":"");Z(!0),A(f),B((i?ne(i):y).slice(0,11)),b(""),m(null),d(null),g(null),O(!1),F(!1),j(0),C(!1),z(!1),se()},[se,y,$]),We=s.useCallback(()=>{Z(!0),A(""),B(""),b(""),m(null),d(null),g(null),O(!1),F(!1),j(0),C(!1),z(!1)},[]),Je=s.useCallback(()=>{Z(!1),z(!1),A(""),B(""),b(""),m(null),d(null),g(null),O(!1),F(!1),j(0),C(!1)},[]),Ye=s.useCallback(r=>{B(r.replace(/\D/g,"").slice(0,11)),m(null),d(null),g(null),b(""),j(0),C(!1)},[]),Ke=s.useCallback(r=>{b(r.replace(/\D/g,"").slice(0,6)),d(null)},[]),Qe=s.useCallback(async()=>{if(d(null),m(null),g(null),!k.trim()){d("아이디를 입력해 주세요.");return}const i=L;if(i.length!==11){d("휴대폰 번호 11자리를 입력해 주세요.");return}F(!0);try{const f=await ce(i);f.success?(m(f.code?`인증번호(${f.code})가 발급되었습니다.`:"인증번호가 발송되었습니다."),b(""),j(60),C(!0),window.setTimeout(()=>{ae.current?.focus()},0)):d("인증번호 발송에 실패했습니다.")}catch(f){d(N(f,"인증번호 발송에 실패했습니다."))}finally{F(!1)}},[L,k]),Xe=s.useCallback(async r=>{r.preventDefault(),O(!0),d(null),g(null);const i=k.trim();if(!i){d("아이디를 입력해 주세요.");return}const f=L;if(f.length!==11){d("휴대폰 번호 11자리를 입력해 주세요.");return}const D=ee.trim();if(D.length!==6){C(!0),d("인증번호 6자리를 입력해 주세요.");return}z(!0);try{const w=await nt(i,f,D);g(w.temporaryPassword)}catch(w){d(N(w,"임시 비밀번호 발급에 실패했습니다."))}finally{z(!1)}},[ee,L,k]);return{form:{username:R,setUsername:p,password:T,setPassword:me,submitted:je,loading:we,onSubmit:$e},dialog:{open:Re,message:ye,close:()=>W(!1)},findIdModal:{open:J,phone:y,code:K,message:ke,error:Fe,submitted:Se,loading:Me,requestingCode:ve,cooldown:Q,digits:P,codeVisible:ze,accounts:$,phoneRef:Ie,codeRef:le,openModal:Ae,closeModal:se,setPhone:Be,setCode:Oe,sendCode:Ne,submit:He},resetModal:{open:X,username:k,phone:_,code:ee,message:Pe,error:Le,result:De,submitted:qe,requestingCode:Ee,submitting:Te,cooldown:te,digits:L,codeVisible:Ue,phoneRef:Ve,codeRef:ae,openModal:We,openFromFind:Ge,closeModal:Je,setUsername:A,setPhone:Ye,setCode:Ke,sendCode:Qe,submit:Xe}}}function ne(n){return n.replace(/\D/g,"")}function Lt(n){const e="로그인에 실패했습니다.",a=typeof n=="object"&&n!==null&&"status"in n?n.status:void 0,l=typeof a=="number"?a:typeof a=="string"?Number(a):void 0,c=typeof n=="object"&&n!==null&&"message"in n?n.message:void 0,p=(typeof c=="string"?c:e).toLowerCase();return l===401||p.includes("401")?"아이디 또는 비밀번호가 올바르지 않습니다.":l===403||p.includes("403")?"접근이 거부되었습니다.":l===429||p.includes("429")?"요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.":l&&l>=500?"서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.":p.includes("network")||p.includes("failed to fetch")?"네트워크 연결을 확인해 주세요.":e}function N(n,e){if(n instanceof Error&&n.message)return n.message;if(typeof n=="object"&&n&&"message"in n){const a=n.message;if(typeof a=="string")return a}return e}function At(){const n=Pt();return t.jsx(jt,{...n})}export{At as default};
