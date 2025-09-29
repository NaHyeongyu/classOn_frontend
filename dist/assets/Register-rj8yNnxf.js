import{u as Se,r as t,j as e,A as w,L as Ce,B as we,C as G,D as ke,F as ze,H as Ne,I as Be,d as o,c as Ae}from"./index-B7CgKAvQ.js";import{f as Ee}from"./format-CD1P4D3U.js";function Ie(){const d=Se(),[j,b]=t.useState(1),[B,X]=t.useState(""),[g,Y]=t.useState(""),[F,A]=t.useState(null),[_,L]=t.useState(!1),[x,H]=t.useState(""),[I,ee]=t.useState(""),[v,E]=t.useState(0),[U,V]=t.useState(null);t.useEffect(()=>{const s=setInterval(()=>E(n=>n>0?n-1:0),1e3);return()=>clearInterval(s)},[]);const[p,se]=t.useState(""),[f,R]=t.useState(null),[i,te]=t.useState(""),[m,ne]=t.useState(""),[y,ae]=t.useState(!1),[S,le]=t.useState(!1);t.useEffect(()=>{const s=i.length>=8&&i.length<=64,n=/[A-Za-z]/.test(i)&&/\d/.test(i);ae(s),le(n)},[i]);const[P,oe]=t.useState(""),[$,re]=t.useState(""),[ie,D]=t.useState(null),[O,ce]=t.useState(""),[T,de]=t.useState(""),[M,ue]=t.useState(""),[q,xe]=t.useState(""),[W,Z]=t.useState(!1),[u,r]=t.useState(null);async function he(){if(g){L(!0),A(null);try{const s=await we(g);A(s.available)}catch{A(null)}finally{L(!1)}}}function C(s){const n=s.replace(/\D/g,"").slice(0,10),c=n.slice(0,3),ve=n.slice(3,5),ye=n.slice(5,10);return{masked:[c,ve,ye].filter(Boolean).join("-"),raw:n}}async function pe(s){s.preventDefault(),r(null);const n=/.+@.+\..+/.test(g);if(!B||!n||!x){r("이메일/이름/휴대폰을 확인해 주세요.");return}if(F===!1){r("이미 사용 중인 이메일입니다.");return}try{const c=await G(x);c.code&&V(c.code),E(60),b(2)}catch(c){String(c?.message||"").includes("429")?r("너무 많은 요청입니다. 잠시 후 다시 시도해 주세요."):r(c?.message||"인증코드 요청에 실패했습니다.")}}async function ge(s){s.preventDefault(),r(null);try{(await ke(x,I)).success?b(3):r("인증코드가 올바르지 않습니다.")}catch(n){r(n?.message||"전화번호 인증에 실패했습니다.")}}async function fe(){if(!(v>0)){r(null);try{const s=await G(x);s.code&&V(s.code),E(60)}catch(s){String(s?.message||"").includes("429")?r("너무 많은 요청입니다. 잠시 후 다시 시도해 주세요."):r(s?.message||"인증코드 요청에 실패했습니다.")}}}async function me(){if(p)try{const s=await ze(p);R(s.available)}catch{R(null)}}async function je(s){re(s);const{raw:n}=C(s);if(n.length===10)try{const c=await Ne(n);D(c.available)}catch{D(null)}else D(null)}async function be(s){s.preventDefault(),r(null);const{raw:n}=C($);Z(!0);try{await Be({name:B,email:g,phone:x,username:p,password:i,academyName:P,bizNo:n,address:O,representativeName:T,academyPhone:M,billingEmail:q}),d("/login",{replace:!0})}catch(c){r(c?.message||"가입에 실패했습니다.")}finally{Z(!1)}}return e.jsxs("div",{children:[e.jsx(Re,{children:"계정 만들기"}),j===1&&e.jsxs(e.Fragment,{children:[e.jsx(k,{children:"담당자 정보를 입력해 주세요."}),e.jsxs(z,{onSubmit:pe,children:[e.jsx(a,{children:"담당자 이메일"}),e.jsx(l,{type:"email",value:g,onChange:s=>Y(s.target.value),onBlur:he,placeholder:"you@example.com"}),_&&e.jsx(h,{children:"이메일 확인 중..."}),F===!1&&e.jsx(h,{danger:!0,children:"이미 사용 중인 이메일입니다."}),e.jsx(a,{children:"담당자 이름"}),e.jsx(l,{value:B,onChange:s=>X(s.target.value),placeholder:"홍길동"}),e.jsx(a,{children:"휴대폰"}),e.jsx(l,{value:x,onChange:s=>H(s.target.value),placeholder:"010-1234-5678",pattern:"^010-\\\\d{4}-\\\\d{4}$",onBlur:s=>{const n=s.currentTarget.value.replace(/[^0-9]/g,"");n.length===11&&n.startsWith("010")&&H(`010-${n.slice(3,7)}-${n.slice(7)}`)}}),u&&e.jsx(N,{children:u}),e.jsx(w,{as:"button",type:"submit",children:"계정 만들기"}),e.jsx(De,{children:"가입하면 약관/개인정보 처리방침에 동의합니다"})]})]}),j===2&&e.jsxs(e.Fragment,{children:[e.jsx(k,{children:"인증 번호를 보냈어요. 10분 내 입력해 주세요."}),e.jsxs(z,{onSubmit:ge,children:[e.jsx(a,{children:"휴대폰 번호"}),e.jsxs(K,{children:[e.jsx(l,{style:{flex:1},value:Ee(x),disabled:!0}),e.jsx(Q,{type:"button",onClick:()=>b(1),children:"번호 변경"})]}),e.jsx(a,{children:"인증코드"}),e.jsxs(K,{children:[e.jsx(l,{style:{flex:1},value:I,onChange:s=>ee(s.target.value),placeholder:"6자리"}),e.jsx(Q,{type:"button",onClick:fe,disabled:v>0,children:v>0?`${v}s`:"재전송"})]}),U&&e.jsxs(h,{children:["개발용 인증코드: ",U]}),e.jsx(Fe,{children:"스팸함을 확인하고, 발신 도메인을 화이트리스트에 추가해 주세요."}),u&&e.jsx(N,{children:u}),e.jsx(w,{as:"button",type:"submit",children:"다음"})]})]}),j===3&&e.jsxs(e.Fragment,{children:[e.jsx(k,{children:"아이디와 비밀번호를 설정해 주세요."}),e.jsxs(z,{onSubmit:s=>{s.preventDefault(),p&&f!==!1&&y&&S&&i&&i===m&&b(4)},children:[e.jsx(a,{children:"아이디"}),e.jsx(l,{value:p,onChange:s=>{se(s.target.value),R(null)},onBlur:me,placeholder:"아이디"}),f===!0&&e.jsx(h,{success:!0,children:"사용 가능한 아이디입니다."}),f===!1&&e.jsx(h,{danger:!0,children:"이미 사용중인 아이디입니다."}),e.jsx(a,{children:"비밀번호"}),e.jsx(l,{type:"password",value:i,onChange:s=>te(s.target.value),placeholder:"8–64자, 문자+숫자"}),e.jsxs(Pe,{children:[e.jsx(J,{ok:y,children:"8–64자"}),e.jsx(J,{ok:S,children:"문자+숫자 포함"})]}),e.jsx(a,{children:"비밀번호 확인"}),e.jsx(l,{type:"password",value:m,onChange:s=>ne(s.target.value),placeholder:"비밀번호 다시 입력"}),m&&i!==m&&e.jsx(h,{danger:!0,children:"비밀번호가 일치하지 않습니다."}),u&&e.jsx(N,{children:u}),e.jsx(w,{as:"button",type:"submit",disabled:!p||f===!1||!y||!S||!i||i!==m,children:"다음"})]})]}),j===4&&e.jsxs(e.Fragment,{children:[e.jsx(k,{children:"학원 정보를 입력해 주세요."}),e.jsxs(z,{onSubmit:be,children:[e.jsx(a,{children:"학원명"}),e.jsx(l,{value:P,onChange:s=>oe(s.target.value),placeholder:"예: 오픈AI어학원"}),e.jsx(a,{children:"사업자번호"}),e.jsx(l,{value:C($).masked,onChange:s=>void je(s.target.value),placeholder:"###-##-#####"}),ie===!1&&e.jsx(h,{danger:!0,children:"이미 가입된 사업자번호입니다. 연결/문의를 진행해 주세요."}),e.jsx(a,{children:"주소 (선택)"}),e.jsx(l,{value:O,onChange:s=>ce(s.target.value),placeholder:"도로명 주소"}),e.jsx(a,{children:"대표자명 (선택)"}),e.jsx(l,{value:T,onChange:s=>de(s.target.value),placeholder:"대표자명"}),e.jsx(a,{children:"학원 대표번호 (선택)"}),e.jsx(l,{value:M,onChange:s=>ue(s.target.value),placeholder:"021234567"}),e.jsx(a,{children:"청구용 이메일 (선택)"}),e.jsx(l,{type:"email",value:q,onChange:s=>xe(s.target.value),placeholder:"billing@example.com"}),u&&e.jsx(N,{children:u}),e.jsx(w,{as:"button",type:"submit",disabled:W||!P||!C($).raw||f===!1||!y||!S,children:W?"완료 중...":"완료"})]})]}),e.jsxs($e,{children:["이미 계정이 있으신가요? ",e.jsx(Ce,{to:"/login",children:"로그인"})]})]})}const Re=o.h1`
  margin: 0 0 12px;
  font-size: 30px;
  color: #111827;
  text-align: center;
`,k=o.p`
  margin: 0 0 28px;
  color: #6b7280;
  font-size: 15px;
  text-align: center;
`,z=o.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`,Pe=o.div`
  display: flex;
  gap: 8px;
  font-size: 12px;
  color: #6b7280;
`,J=o.span`
  color: ${d=>d.ok?"#065f46":"#6b7280"};
`,K=o.div`
  display: flex;
  gap: 10px;
  align-items: center;
`,a=o.label`
  font-size: 13px;
  color: #6b7280;
`,l=o.input`
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
`,Q=o.button`
  ${Ae.subtle};
  height: 54px;
  border-radius: 14px;
  font-weight: 700;
  padding: 0 20px;
  &:disabled {
    opacity: 0.6;
  }
`,$e=o.div`
  margin-top: 18px;
  color: #6b7280;
  font-size: 14px;
  a { color: #4f46e5; font-weight: 700; }
`,N=o.div`
  color: #b91c1c;
  background: #fee2e2;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 14px;
`,h=o.div`
  color: ${d=>d.danger?"#b91c1c":d.success?"#065f46":"#6b7280"};
  background: ${d=>d.danger?"#fee2e2":d.success?"#d1fae5":"#f3f4f6"};
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 12px;
`,De=o.p`
  margin-top: 6px;
  color: #6b7280;
  font-size: 12px;
`,Fe=o.p`
  color: #6b7280;
  font-size: 12px;
`;export{Ie as default};
