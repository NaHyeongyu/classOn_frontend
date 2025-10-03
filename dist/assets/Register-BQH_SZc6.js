import{u as ve,r as t,j as e,A as B,B as ye,C as Q,D as Se,F as Ce,H as we,I as ze,d as r,c as ke}from"./index-C5H-3XpS.js";import{f as Ne}from"./format-CD1P4D3U.js";function Fe(){const d=ve(),[w,z]=t.useState(1),[q,ee]=t.useState(""),[u,D]=t.useState(""),[F,se]=t.useState(""),[k,$]=t.useState(0),[M,O]=t.useState(null);t.useEffect(()=>{const s=setInterval(()=>$(n=>n>0?n-1:0),1e3);return()=>clearInterval(s)},[]);const[f,ne]=t.useState(""),[j,L]=t.useState(null),[a,te]=t.useState(""),[g,ae]=t.useState(""),[v,re]=t.useState(!1),[y,le]=t.useState(!1);t.useEffect(()=>{const s=a.length>=8&&a.length<=64,n=/[A-Za-z]/.test(a)&&/\d/.test(a);re(s),le(n)},[a]);const[S,ie]=t.useState(""),[C,oe]=t.useState(""),[T,H]=t.useState(null),[U,ce]=t.useState(""),[V,de]=t.useState(""),[W,ue]=t.useState(""),[Z,he]=t.useState(""),[G,J]=t.useState(!1),[h,l]=t.useState(null),[p,I]=t.useState({}),[N,K]=t.useState({});function b(s){const n=s.replace(/\D/g,"").slice(0,10),c=n.slice(0,3),m=n.slice(3,5),be=n.slice(5,10);return{masked:[c,m,be].filter(Boolean).join("-"),raw:n}}function P(s){const n=s.replace(/[^0-9]/g,"");return n.length===11&&n.startsWith("010")?`010-${n.slice(3,7)}-${n.slice(7)}`:null}async function pe(s){s.preventDefault(),l(null);const n={};q.trim()||(n.name="이름은 필수입니다."),u.trim()||(n.phone="휴대폰 번호를 입력해 주세요.");const c=P(u);if(u.trim()&&!c&&(n.phone="010-1234-5678 형식으로 입력해 주세요."),I(n),!(Object.keys(n).length>0))try{D(c);const m=await Q(c);m.code&&O(m.code),$(60),z(2)}catch(m){String(m?.message||"").includes("429")?l("너무 많은 요청입니다. 잠시 후 다시 시도해 주세요."):l(m?.message||"인증코드 요청에 실패했습니다.")}}async function xe(s){if(s.preventDefault(),l(null),!F.trim()){K({code:"인증코드를 입력해 주세요."});return}try{const n=P(u);if(!n){l("휴대폰 번호 형식을 다시 확인해 주세요.");return}(await Se(n,F)).success?z(3):l("인증코드가 올바르지 않습니다.")}catch(n){l(n?.message||"전화번호 인증에 실패했습니다.")}}async function fe(){if(!(k>0)){l(null);try{const s=P(u);if(!s){l("휴대폰 번호 형식을 다시 확인해 주세요.");return}const n=await Q(s);n.code&&O(n.code),$(60)}catch(s){String(s?.message||"").includes("429")?l("너무 많은 요청입니다. 잠시 후 다시 시도해 주세요."):l(s?.message||"인증코드 요청에 실패했습니다.")}}}async function ge(){if(f)try{const s=await Ce(f);L(s.available)}catch{L(null)}}async function me(s){oe(s);const{raw:n}=b(s);if(n.length===10)try{const c=await we(n);H(c.available)}catch{H(null)}else H(null)}async function je(s){s.preventDefault(),l(null);const{raw:n}=b(C);J(!0);try{await ze({name:q,phone:u,username:f,password:a,academyName:S,bizNo:n,address:U,representativeName:V,academyPhone:W,billingEmail:Z}),d("/login",{replace:!0})}catch(c){l(c?.message||"가입에 실패했습니다.")}finally{J(!1)}}return e.jsxs("div",{children:[e.jsx(Pe,{children:"계정 만들기"}),w===1&&e.jsxs(e.Fragment,{children:[e.jsx(E,{children:"담당자 정보를 입력해 주세요."}),e.jsxs(R,{onSubmit:pe,children:[e.jsxs(i,{children:["담당자 이름",e.jsx("span",{children:"*"})]}),e.jsx(o,{value:q,onChange:s=>{ee(s.target.value),p.name&&I(n=>({...n,name:void 0}))},placeholder:"홍길동","aria-invalid":!!p.name,required:!0}),e.jsxs(i,{children:["휴대폰",e.jsx("span",{children:"*"})]}),e.jsx(o,{value:u,inputMode:"tel",autoComplete:"tel",onChange:s=>{D(s.target.value),p.phone&&I(n=>({...n,phone:void 0}))},placeholder:"010-1234-5678",onBlur:s=>{const n=P(s.currentTarget.value);D(n??s.currentTarget.value.trim())},"aria-invalid":!!p.phone,required:!0}),p.name&&e.jsx(x,{danger:!0,children:p.name}),p.phone&&e.jsx(x,{danger:!0,children:p.phone}),h&&e.jsx(A,{children:h}),e.jsx(B,{as:"button",type:"submit",children:"계정 만들기"}),e.jsx(Re,{children:"가입하면 약관/개인정보 처리방침에 동의합니다"})]})]}),w===2&&e.jsxs(e.Fragment,{children:[e.jsx(E,{children:"인증 번호를 보냈어요. 10분 내 입력해 주세요."}),e.jsxs(R,{onSubmit:xe,children:[e.jsx(i,{children:"휴대폰 번호"}),e.jsxs(Y,{children:[e.jsx(o,{style:{flex:1},value:Ne(u),disabled:!0}),e.jsx(_,{type:"button",onClick:()=>z(1),children:"번호 변경"})]}),e.jsxs(i,{children:["인증코드",e.jsx("span",{children:"*"})]}),e.jsxs(Y,{children:[e.jsx(o,{style:{flex:1},value:F,onChange:s=>{se(s.target.value),N.code&&K({})},placeholder:"6자리","aria-invalid":!!N.code,required:!0}),e.jsx(_,{type:"button",onClick:fe,disabled:k>0,children:k>0?`${k}s`:"재전송"})]}),N.code&&e.jsx(x,{danger:!0,children:N.code}),M&&e.jsxs(x,{children:["개발용 인증코드: ",M]}),e.jsx(Ae,{children:"스팸함을 확인하고, 발신 도메인을 화이트리스트에 추가해 주세요."}),h&&e.jsx(A,{children:h}),e.jsx(B,{as:"button",type:"submit",children:"다음"})]})]}),w===3&&e.jsxs(e.Fragment,{children:[e.jsx(E,{children:"아이디와 비밀번호를 설정해 주세요."}),e.jsxs(R,{onSubmit:s=>{s.preventDefault(),f&&j!==!1&&v&&y&&a&&a===g&&z(4)},children:[e.jsxs(i,{children:["아이디",e.jsx("span",{children:"*"})]}),e.jsx(o,{value:f,onChange:s=>{ne(s.target.value),L(null)},onBlur:ge,placeholder:"아이디","aria-invalid":!!f&&j===!1,required:!0}),j===!0&&e.jsx(x,{success:!0,children:"사용 가능한 아이디입니다."}),j===!1&&e.jsx(x,{danger:!0,children:"이미 사용중인 아이디입니다."}),e.jsxs(i,{children:["비밀번호",e.jsx("span",{children:"*"})]}),e.jsx(o,{type:"password",value:a,onChange:s=>te(s.target.value),placeholder:"8–64자, 문자+숫자","aria-invalid":a!==""&&!(v&&y),required:!0}),e.jsxs(Be,{children:[e.jsx(X,{ok:v,children:"8–64자"}),e.jsx(X,{ok:y,children:"문자+숫자 포함"})]}),e.jsxs(i,{children:["비밀번호 확인",e.jsx("span",{children:"*"})]}),e.jsx(o,{type:"password",value:g,onChange:s=>ae(s.target.value),placeholder:"비밀번호 다시 입력","aria-invalid":g!==""&&a!==g,required:!0}),g&&a!==g&&e.jsx(x,{danger:!0,children:"비밀번호가 일치하지 않습니다."}),h&&e.jsx(A,{children:h}),e.jsx(B,{as:"button",type:"submit",disabled:!f||j===!1||!v||!y||!a||a!==g,children:"다음"})]})]}),w===4&&e.jsxs(e.Fragment,{children:[e.jsx(E,{children:"학원 정보를 입력해 주세요."}),e.jsxs(R,{onSubmit:je,children:[e.jsxs(i,{children:["학원명",e.jsx("span",{children:"*"})]}),e.jsx(o,{value:S,onChange:s=>ie(s.target.value),placeholder:"예: 오픈AI어학원","aria-invalid":S!==""&&!S,required:!0}),e.jsxs(i,{children:["사업자번호",e.jsx("span",{children:"*"})]}),e.jsx(o,{value:b(C).masked,onChange:s=>void me(s.target.value),placeholder:"###-##-#####","aria-invalid":b(C).raw.length>0&&(b(C).raw.length!==10||T===!1),required:!0}),T===!1&&e.jsx(x,{danger:!0,children:"이미 가입된 사업자번호입니다. 연결/문의를 진행해 주세요."}),e.jsx(i,{children:"주소 (선택)"}),e.jsx(o,{value:U,onChange:s=>ce(s.target.value),placeholder:"도로명 주소"}),e.jsx(i,{children:"대표자명 (선택)"}),e.jsx(o,{value:V,onChange:s=>de(s.target.value),placeholder:"대표자명"}),e.jsx(i,{children:"학원 대표번호 (선택)"}),e.jsx(o,{value:W,onChange:s=>ue(s.target.value),placeholder:"021234567"}),e.jsx(i,{children:"청구용 이메일 (선택)"}),e.jsx(o,{type:"email",value:Z,onChange:s=>he(s.target.value),placeholder:"billing@example.com"}),h&&e.jsx(A,{children:h}),e.jsx(B,{as:"button",type:"submit",disabled:G||!S||!b(C).raw||j===!1||!v||!y,children:G?"완료 중...":"완료"})]})]}),e.jsxs(Ee,{children:["이미 계정이 있으신가요? ",e.jsx(ye,{to:"/login",children:"로그인"})]})]})}const Pe=r.h1`
  margin: 0 0 12px;
  font-size: 30px;
  color: #111827;
  text-align: center;
`,E=r.p`
  margin: 0 0 28px;
  color: #6b7280;
  font-size: 15px;
  text-align: center;
`,R=r.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`,Be=r.div`
  display: flex;
  gap: 8px;
  font-size: 12px;
  color: #6b7280;
`,X=r.span`
  color: ${d=>d.ok?"#065f46":"#6b7280"};
`,Y=r.div`
  display: flex;
  gap: 10px;
  align-items: center;
`,i=r.label`
  font-size: 13px;
  color: #6b7280;
  span { color: #ef4444; margin-left: 4px; }
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
  &[aria-invalid='true'] {
    background: #fee2e2;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.18);
  }
`,_=r.button`
  ${ke.subtle};
  height: 54px;
  border-radius: 14px;
  font-weight: 700;
  padding: 0 20px;
  &:disabled {
    opacity: 0.6;
  }
`,Ee=r.div`
  margin-top: 18px;
  color: #6b7280;
  font-size: 14px;
  a { color: #4f46e5; font-weight: 700; }
`,A=r.div`
  color: #b91c1c;
  background: #fee2e2;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 14px;
`,x=r.div`
  color: ${d=>d.danger?"#b91c1c":d.success?"#065f46":"#6b7280"};
  background: ${d=>d.danger?"#fee2e2":d.success?"#d1fae5":"#f3f4f6"};
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 12px;
`,Re=r.p`
  margin-top: 6px;
  color: #6b7280;
  font-size: 12px;
`,Ae=r.p`
  color: #6b7280;
  font-size: 12px;
`;export{Fe as default};
