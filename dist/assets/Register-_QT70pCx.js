import{u as fe,r as n,j as e,A as w,L as me,B as q,C as je,D as be,F as ve,H as ye,d as l,c as Se}from"./index-Cq8NHvix.js";import{f as Ce}from"./format-CD1P4D3U.js";function Ae(){const d=fe(),[m,j]=n.useState(1),[P,J]=n.useState(""),[x,B]=n.useState(""),[L,K]=n.useState(""),[b,R]=n.useState(0),[$,H]=n.useState(null);n.useEffect(()=>{const s=setInterval(()=>R(t=>t>0?t-1:0),1e3);return()=>clearInterval(s)},[]);const[h,Q]=n.useState(""),[p,A]=n.useState(null),[i,X]=n.useState(""),[g,Y]=n.useState(""),[v,_]=n.useState(!1),[y,ee]=n.useState(!1);n.useEffect(()=>{const s=i.length>=8&&i.length<=64,t=/[A-Za-z]/.test(i)&&/\d/.test(i);_(s),ee(t)},[i]);const[E,se]=n.useState(""),[D,te]=n.useState(""),[ne,F]=n.useState(null),[I,ae]=n.useState(""),[M,le]=n.useState(""),[T,oe]=n.useState(""),[U,re]=n.useState(""),[O,V]=n.useState(!1),[u,a]=n.useState(null);function S(s){const t=s.replace(/\D/g,"").slice(0,10),c=t.slice(0,3),pe=t.slice(3,5),ge=t.slice(5,10);return{masked:[c,pe,ge].filter(Boolean).join("-"),raw:t}}function C(s){const t=s.replace(/[^0-9]/g,"");return t.length===11&&t.startsWith("010")?`010-${t.slice(3,7)}-${t.slice(7)}`:null}async function ie(s){if(s.preventDefault(),a(null),!P||!x){a("이름/휴대폰을 확인해 주세요.");return}const t=C(x);if(!t){a("휴대폰 번호 형식이 올바르지 않습니다. 010-1234-5678 형태로 입력해 주세요.");return}try{B(t);const c=await q(t);c.code&&H(c.code),R(60),j(2)}catch(c){String(c?.message||"").includes("429")?a("너무 많은 요청입니다. 잠시 후 다시 시도해 주세요."):a(c?.message||"인증코드 요청에 실패했습니다.")}}async function ce(s){s.preventDefault(),a(null);try{const t=C(x);if(!t){a("휴대폰 번호 형식을 다시 확인해 주세요.");return}(await je(t,L)).success?j(3):a("인증코드가 올바르지 않습니다.")}catch(t){a(t?.message||"전화번호 인증에 실패했습니다.")}}async function de(){if(!(b>0)){a(null);try{const s=C(x);if(!s){a("휴대폰 번호 형식을 다시 확인해 주세요.");return}const t=await q(s);t.code&&H(t.code),R(60)}catch(s){String(s?.message||"").includes("429")?a("너무 많은 요청입니다. 잠시 후 다시 시도해 주세요."):a(s?.message||"인증코드 요청에 실패했습니다.")}}}async function ue(){if(h)try{const s=await be(h);A(s.available)}catch{A(null)}}async function xe(s){te(s);const{raw:t}=S(s);if(t.length===10)try{const c=await ve(t);F(c.available)}catch{F(null)}else F(null)}async function he(s){s.preventDefault(),a(null);const{raw:t}=S(D);V(!0);try{await ye({name:P,phone:x,username:h,password:i,academyName:E,bizNo:t,address:I,representativeName:M,academyPhone:T,billingEmail:U}),d("/login",{replace:!0})}catch(c){a(c?.message||"가입에 실패했습니다.")}finally{V(!1)}}return e.jsxs("div",{children:[e.jsx(we,{children:"계정 만들기"}),m===1&&e.jsxs(e.Fragment,{children:[e.jsx(z,{children:"담당자 정보를 입력해 주세요."}),e.jsxs(k,{onSubmit:ie,children:[e.jsx(o,{children:"담당자 이름"}),e.jsx(r,{value:P,onChange:s=>J(s.target.value),placeholder:"홍길동"}),e.jsx(o,{children:"휴대폰"}),e.jsx(r,{value:x,inputMode:"tel",autoComplete:"tel",onChange:s=>B(s.target.value),placeholder:"010-1234-5678",onBlur:s=>{const t=C(s.currentTarget.value);B(t??s.currentTarget.value.trim())}}),u&&e.jsx(N,{children:u}),e.jsx(w,{as:"button",type:"submit",children:"계정 만들기"}),e.jsx(Ne,{children:"가입하면 약관/개인정보 처리방침에 동의합니다"})]})]}),m===2&&e.jsxs(e.Fragment,{children:[e.jsx(z,{children:"인증 번호를 보냈어요. 10분 내 입력해 주세요."}),e.jsxs(k,{onSubmit:ce,children:[e.jsx(o,{children:"휴대폰 번호"}),e.jsxs(Z,{children:[e.jsx(r,{style:{flex:1},value:Ce(x),disabled:!0}),e.jsx(G,{type:"button",onClick:()=>j(1),children:"번호 변경"})]}),e.jsx(o,{children:"인증코드"}),e.jsxs(Z,{children:[e.jsx(r,{style:{flex:1},value:L,onChange:s=>K(s.target.value),placeholder:"6자리"}),e.jsx(G,{type:"button",onClick:de,disabled:b>0,children:b>0?`${b}s`:"재전송"})]}),$&&e.jsxs(f,{children:["개발용 인증코드: ",$]}),e.jsx(Pe,{children:"스팸함을 확인하고, 발신 도메인을 화이트리스트에 추가해 주세요."}),u&&e.jsx(N,{children:u}),e.jsx(w,{as:"button",type:"submit",children:"다음"})]})]}),m===3&&e.jsxs(e.Fragment,{children:[e.jsx(z,{children:"아이디와 비밀번호를 설정해 주세요."}),e.jsxs(k,{onSubmit:s=>{s.preventDefault(),h&&p!==!1&&v&&y&&i&&i===g&&j(4)},children:[e.jsx(o,{children:"아이디"}),e.jsx(r,{value:h,onChange:s=>{Q(s.target.value),A(null)},onBlur:ue,placeholder:"아이디"}),p===!0&&e.jsx(f,{success:!0,children:"사용 가능한 아이디입니다."}),p===!1&&e.jsx(f,{danger:!0,children:"이미 사용중인 아이디입니다."}),e.jsx(o,{children:"비밀번호"}),e.jsx(r,{type:"password",value:i,onChange:s=>X(s.target.value),placeholder:"8–64자, 문자+숫자"}),e.jsxs(ze,{children:[e.jsx(W,{ok:v,children:"8–64자"}),e.jsx(W,{ok:y,children:"문자+숫자 포함"})]}),e.jsx(o,{children:"비밀번호 확인"}),e.jsx(r,{type:"password",value:g,onChange:s=>Y(s.target.value),placeholder:"비밀번호 다시 입력"}),g&&i!==g&&e.jsx(f,{danger:!0,children:"비밀번호가 일치하지 않습니다."}),u&&e.jsx(N,{children:u}),e.jsx(w,{as:"button",type:"submit",disabled:!h||p===!1||!v||!y||!i||i!==g,children:"다음"})]})]}),m===4&&e.jsxs(e.Fragment,{children:[e.jsx(z,{children:"학원 정보를 입력해 주세요."}),e.jsxs(k,{onSubmit:he,children:[e.jsx(o,{children:"학원명"}),e.jsx(r,{value:E,onChange:s=>se(s.target.value),placeholder:"예: 오픈AI어학원"}),e.jsx(o,{children:"사업자번호"}),e.jsx(r,{value:S(D).masked,onChange:s=>void xe(s.target.value),placeholder:"###-##-#####"}),ne===!1&&e.jsx(f,{danger:!0,children:"이미 가입된 사업자번호입니다. 연결/문의를 진행해 주세요."}),e.jsx(o,{children:"주소 (선택)"}),e.jsx(r,{value:I,onChange:s=>ae(s.target.value),placeholder:"도로명 주소"}),e.jsx(o,{children:"대표자명 (선택)"}),e.jsx(r,{value:M,onChange:s=>le(s.target.value),placeholder:"대표자명"}),e.jsx(o,{children:"학원 대표번호 (선택)"}),e.jsx(r,{value:T,onChange:s=>oe(s.target.value),placeholder:"021234567"}),e.jsx(o,{children:"청구용 이메일 (선택)"}),e.jsx(r,{type:"email",value:U,onChange:s=>re(s.target.value),placeholder:"billing@example.com"}),u&&e.jsx(N,{children:u}),e.jsx(w,{as:"button",type:"submit",disabled:O||!E||!S(D).raw||p===!1||!v||!y,children:O?"완료 중...":"완료"})]})]}),e.jsxs(ke,{children:["이미 계정이 있으신가요? ",e.jsx(me,{to:"/login",children:"로그인"})]})]})}const we=l.h1`
  margin: 0 0 12px;
  font-size: 30px;
  color: #111827;
  text-align: center;
`,z=l.p`
  margin: 0 0 28px;
  color: #6b7280;
  font-size: 15px;
  text-align: center;
`,k=l.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`,ze=l.div`
  display: flex;
  gap: 8px;
  font-size: 12px;
  color: #6b7280;
`,W=l.span`
  color: ${d=>d.ok?"#065f46":"#6b7280"};
`,Z=l.div`
  display: flex;
  gap: 10px;
  align-items: center;
`,o=l.label`
  font-size: 13px;
  color: #6b7280;
`,r=l.input`
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
`,G=l.button`
  ${Se.subtle};
  height: 54px;
  border-radius: 14px;
  font-weight: 700;
  padding: 0 20px;
  &:disabled {
    opacity: 0.6;
  }
`,ke=l.div`
  margin-top: 18px;
  color: #6b7280;
  font-size: 14px;
  a { color: #4f46e5; font-weight: 700; }
`,N=l.div`
  color: #b91c1c;
  background: #fee2e2;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 14px;
`,f=l.div`
  color: ${d=>d.danger?"#b91c1c":d.success?"#065f46":"#6b7280"};
  background: ${d=>d.danger?"#fee2e2":d.success?"#d1fae5":"#f3f4f6"};
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 12px;
`,Ne=l.p`
  margin-top: 6px;
  color: #6b7280;
  font-size: 12px;
`,Pe=l.p`
  color: #6b7280;
  font-size: 12px;
`;export{Ae as default};
