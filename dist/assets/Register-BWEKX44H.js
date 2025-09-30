import{u as Se,r as n,j as e,A as k,L as we,B as ze,C as K,D as ke,F as Ne,H as Be,I as Pe,d as r,c as Ae}from"./index-CJzRppoi.js";import{f as Ee}from"./format-CD1P4D3U.js";function Me(){const d=Se(),[b,v]=n.useState(1),[A,_]=n.useState(""),[g,ee]=n.useState(""),[I,E]=n.useState(null),[te,M]=n.useState(!1),[x,R]=n.useState(""),[T,se]=n.useState(""),[y,D]=n.useState(0),[U,V]=n.useState(null);n.useEffect(()=>{const t=setInterval(()=>D(s=>s>0?s-1:0),1e3);return()=>clearInterval(t)},[]);const[f,ne]=n.useState(""),[m,F]=n.useState(null),[i,ae]=n.useState(""),[j,le]=n.useState(""),[C,oe]=n.useState(!1),[S,re]=n.useState(!1);n.useEffect(()=>{const t=i.length>=8&&i.length<=64,s=/[A-Za-z]/.test(i)&&/\d/.test(i);oe(t),re(s)},[i]);const[L,ie]=n.useState(""),[$,ce]=n.useState(""),[de,H]=n.useState(null),[O,ue]=n.useState(""),[q,xe]=n.useState(""),[W,he]=n.useState(""),[Z,pe]=n.useState(""),[G,J]=n.useState(!1),[u,a]=n.useState(null);async function fe(){if(g){M(!0),E(null);try{const t=await ze(g);E(t.available)}catch{E(null)}finally{M(!1)}}}function w(t){const s=t.replace(/\D/g,"").slice(0,10),c=s.slice(0,3),h=s.slice(3,5),Ce=s.slice(5,10);return{masked:[c,h,Ce].filter(Boolean).join("-"),raw:s}}function z(t){const s=t.replace(/[^0-9]/g,"");return s.length===11&&s.startsWith("010")?`010-${s.slice(3,7)}-${s.slice(7)}`:null}async function ge(t){t.preventDefault(),a(null);const s=/.+@.+\..+/.test(g);if(!A||!s||!x){a("이메일/이름/휴대폰을 확인해 주세요.");return}const c=z(x);if(!c){a("휴대폰 번호 형식이 올바르지 않습니다. 010-1234-5678 형태로 입력해 주세요.");return}if(I===!1){a("이미 사용 중인 이메일입니다.");return}try{R(c);const h=await K(c);h.code&&V(h.code),D(60),v(2)}catch(h){String(h?.message||"").includes("429")?a("너무 많은 요청입니다. 잠시 후 다시 시도해 주세요."):a(h?.message||"인증코드 요청에 실패했습니다.")}}async function me(t){t.preventDefault(),a(null);try{const s=z(x);if(!s){a("휴대폰 번호 형식을 다시 확인해 주세요.");return}(await ke(s,T)).success?v(3):a("인증코드가 올바르지 않습니다.")}catch(s){a(s?.message||"전화번호 인증에 실패했습니다.")}}async function je(){if(!(y>0)){a(null);try{const t=z(x);if(!t){a("휴대폰 번호 형식을 다시 확인해 주세요.");return}const s=await K(t);s.code&&V(s.code),D(60)}catch(t){String(t?.message||"").includes("429")?a("너무 많은 요청입니다. 잠시 후 다시 시도해 주세요."):a(t?.message||"인증코드 요청에 실패했습니다.")}}}async function be(){if(f)try{const t=await Ne(f);F(t.available)}catch{F(null)}}async function ve(t){ce(t);const{raw:s}=w(t);if(s.length===10)try{const c=await Be(s);H(c.available)}catch{H(null)}else H(null)}async function ye(t){t.preventDefault(),a(null);const{raw:s}=w($);J(!0);try{await Pe({name:A,email:g,phone:x,username:f,password:i,academyName:L,bizNo:s,address:O,representativeName:q,academyPhone:W,billingEmail:Z}),d("/login",{replace:!0})}catch(c){a(c?.message||"가입에 실패했습니다.")}finally{J(!1)}}return e.jsxs("div",{children:[e.jsx(Re,{children:"계정 만들기"}),b===1&&e.jsxs(e.Fragment,{children:[e.jsx(N,{children:"담당자 정보를 입력해 주세요."}),e.jsxs(B,{onSubmit:ge,children:[e.jsx(l,{children:"담당자 이메일"}),e.jsx(o,{type:"email",value:g,onChange:t=>ee(t.target.value),onBlur:fe,placeholder:"you@example.com"}),te&&e.jsx(p,{children:"이메일 확인 중..."}),I===!1&&e.jsx(p,{danger:!0,children:"이미 사용 중인 이메일입니다."}),e.jsx(l,{children:"담당자 이름"}),e.jsx(o,{value:A,onChange:t=>_(t.target.value),placeholder:"홍길동"}),e.jsx(l,{children:"휴대폰"}),e.jsx(o,{value:x,inputMode:"tel",autoComplete:"tel",onChange:t=>R(t.target.value),placeholder:"010-1234-5678",onBlur:t=>{const s=z(t.currentTarget.value);R(s??t.currentTarget.value.trim())}}),u&&e.jsx(P,{children:u}),e.jsx(k,{as:"button",type:"submit",children:"계정 만들기"}),e.jsx(Le,{children:"가입하면 약관/개인정보 처리방침에 동의합니다"})]})]}),b===2&&e.jsxs(e.Fragment,{children:[e.jsx(N,{children:"인증 번호를 보냈어요. 10분 내 입력해 주세요."}),e.jsxs(B,{onSubmit:me,children:[e.jsx(l,{children:"휴대폰 번호"}),e.jsxs(X,{children:[e.jsx(o,{style:{flex:1},value:Ee(x),disabled:!0}),e.jsx(Y,{type:"button",onClick:()=>v(1),children:"번호 변경"})]}),e.jsx(l,{children:"인증코드"}),e.jsxs(X,{children:[e.jsx(o,{style:{flex:1},value:T,onChange:t=>se(t.target.value),placeholder:"6자리"}),e.jsx(Y,{type:"button",onClick:je,disabled:y>0,children:y>0?`${y}s`:"재전송"})]}),U&&e.jsxs(p,{children:["개발용 인증코드: ",U]}),e.jsx($e,{children:"스팸함을 확인하고, 발신 도메인을 화이트리스트에 추가해 주세요."}),u&&e.jsx(P,{children:u}),e.jsx(k,{as:"button",type:"submit",children:"다음"})]})]}),b===3&&e.jsxs(e.Fragment,{children:[e.jsx(N,{children:"아이디와 비밀번호를 설정해 주세요."}),e.jsxs(B,{onSubmit:t=>{t.preventDefault(),f&&m!==!1&&C&&S&&i&&i===j&&v(4)},children:[e.jsx(l,{children:"아이디"}),e.jsx(o,{value:f,onChange:t=>{ne(t.target.value),F(null)},onBlur:be,placeholder:"아이디"}),m===!0&&e.jsx(p,{success:!0,children:"사용 가능한 아이디입니다."}),m===!1&&e.jsx(p,{danger:!0,children:"이미 사용중인 아이디입니다."}),e.jsx(l,{children:"비밀번호"}),e.jsx(o,{type:"password",value:i,onChange:t=>ae(t.target.value),placeholder:"8–64자, 문자+숫자"}),e.jsxs(De,{children:[e.jsx(Q,{ok:C,children:"8–64자"}),e.jsx(Q,{ok:S,children:"문자+숫자 포함"})]}),e.jsx(l,{children:"비밀번호 확인"}),e.jsx(o,{type:"password",value:j,onChange:t=>le(t.target.value),placeholder:"비밀번호 다시 입력"}),j&&i!==j&&e.jsx(p,{danger:!0,children:"비밀번호가 일치하지 않습니다."}),u&&e.jsx(P,{children:u}),e.jsx(k,{as:"button",type:"submit",disabled:!f||m===!1||!C||!S||!i||i!==j,children:"다음"})]})]}),b===4&&e.jsxs(e.Fragment,{children:[e.jsx(N,{children:"학원 정보를 입력해 주세요."}),e.jsxs(B,{onSubmit:ye,children:[e.jsx(l,{children:"학원명"}),e.jsx(o,{value:L,onChange:t=>ie(t.target.value),placeholder:"예: 오픈AI어학원"}),e.jsx(l,{children:"사업자번호"}),e.jsx(o,{value:w($).masked,onChange:t=>void ve(t.target.value),placeholder:"###-##-#####"}),de===!1&&e.jsx(p,{danger:!0,children:"이미 가입된 사업자번호입니다. 연결/문의를 진행해 주세요."}),e.jsx(l,{children:"주소 (선택)"}),e.jsx(o,{value:O,onChange:t=>ue(t.target.value),placeholder:"도로명 주소"}),e.jsx(l,{children:"대표자명 (선택)"}),e.jsx(o,{value:q,onChange:t=>xe(t.target.value),placeholder:"대표자명"}),e.jsx(l,{children:"학원 대표번호 (선택)"}),e.jsx(o,{value:W,onChange:t=>he(t.target.value),placeholder:"021234567"}),e.jsx(l,{children:"청구용 이메일 (선택)"}),e.jsx(o,{type:"email",value:Z,onChange:t=>pe(t.target.value),placeholder:"billing@example.com"}),u&&e.jsx(P,{children:u}),e.jsx(k,{as:"button",type:"submit",disabled:G||!L||!w($).raw||m===!1||!C||!S,children:G?"완료 중...":"완료"})]})]}),e.jsxs(Fe,{children:["이미 계정이 있으신가요? ",e.jsx(we,{to:"/login",children:"로그인"})]})]})}const Re=r.h1`
  margin: 0 0 12px;
  font-size: 30px;
  color: #111827;
  text-align: center;
`,N=r.p`
  margin: 0 0 28px;
  color: #6b7280;
  font-size: 15px;
  text-align: center;
`,B=r.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`,De=r.div`
  display: flex;
  gap: 8px;
  font-size: 12px;
  color: #6b7280;
`,Q=r.span`
  color: ${d=>d.ok?"#065f46":"#6b7280"};
`,X=r.div`
  display: flex;
  gap: 10px;
  align-items: center;
`,l=r.label`
  font-size: 13px;
  color: #6b7280;
`,o=r.input`
  height: 54px;
  border: none;
  border-radius: 14px;
  padding: 0 16px;
  font-size: 15px;
  background: #f3f4f6;
  outline: none;
  transition: box-shadow 0.15s ease, background 0.15s ease;
  &::placeholder { color: #9ca3af; }
  &:focus {
    background: #eef2ff;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.18);
  }
`,Y=r.button`
  ${Ae.subtle};
  height: 54px;
  border-radius: 14px;
  font-weight: 700;
  padding: 0 20px;
  &:disabled {
    opacity: 0.6;
  }
`,Fe=r.div`
  margin-top: 18px;
  color: #6b7280;
  font-size: 14px;
  a { color: #4f46e5; font-weight: 700; }
`,P=r.div`
  color: #b91c1c;
  background: #fee2e2;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 14px;
`,p=r.div`
  color: ${d=>d.danger?"#b91c1c":d.success?"#065f46":"#6b7280"};
  background: ${d=>d.danger?"#fee2e2":d.success?"#d1fae5":"#f3f4f6"};
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 12px;
`,Le=r.p`
  margin-top: 6px;
  color: #6b7280;
  font-size: 12px;
`,$e=r.p`
  color: #6b7280;
  font-size: 12px;
`;export{Me as default};
