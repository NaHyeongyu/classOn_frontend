import{u as We,r as s,j as e,k as Ue,n as re,o as Ve,q as He,s as Xe,t as _e,d as a}from"./index-B92ulgNv.js";import{C as oe}from"./ConfirmDialog-B0Nr7O58.js";import{m as F,c as Ge}from"./UI-ktOMpaj3.js";import{b as ie}from"./format-Do6vjlY3.js";function cn(){const d=We(),[A,P]=s.useState(1),[u,E]=s.useState(""),[U,ge]=s.useState(""),[R,be]=s.useState(""),[y,I]=s.useState(0),[V,H]=s.useState(null);s.useEffect(()=>{const n=setInterval(()=>I(t=>t>0?t-1:0),1e3);return()=>clearInterval(n)},[]);const[f,me]=s.useState(""),[C,T]=s.useState(null),[l,je]=s.useState(""),[g,ve]=s.useState(""),[N,ye]=s.useState(!1),[B,Ce]=s.useState(!1);s.useEffect(()=>{const n=l.length>=8&&l.length<=64,t=/[A-Za-z]/.test(l)&&/\d/.test(l);ye(n),Ce(t)},[l]);const[j,Se]=s.useState(""),[X,we]=s.useState(""),[_,ke]=s.useState(""),[G,ze]=s.useState(""),[Y,Ae]=s.useState(""),[v,Pe]=s.useState(""),[D,L]=s.useState(null),[h,Ee]=s.useState(""),[S,Z]=s.useState(""),[J,K]=s.useState(""),[Q,Re]=s.useState(""),[ee,Ie]=s.useState(!1),[Te,O]=s.useState(!1),[Ne,q]=s.useState(!1),[ne,te]=s.useState(!1),[b,i]=s.useState(null),[w,se]=s.useState({}),[k,ae]=s.useState({});function m(n){const t=n.replace(/\D/g,"").slice(0,10),c=t.slice(0,3),x=t.slice(3,5),$e=t.slice(5,10);return{masked:[c,x,$e].filter(Boolean).join("-"),raw:t}}function z(n){const t=n.replace(/[^0-9]/g,"");return t.length===11&&t.startsWith("010")?`010-${t.slice(3,7)}-${t.slice(7)}`:null}async function Be(n){n.preventDefault(),i(null);const t={};u.trim()||(t.phone="휴대폰 번호를 입력해 주세요.");const c=z(u);if(u.trim()&&!c&&(t.phone="010-1234-5678 형식으로 입력해 주세요."),se(t),!(Object.keys(t).length>0))try{E(c);const x=await re(c);x.code&&H(x.code),I(60),P(2)}catch(x){String(x?.message||"").includes("429")?i("너무 많은 요청입니다. 잠시 후 다시 시도해 주세요."):i(x?.message||"인증코드 요청에 실패했습니다.")}}async function De(n){if(n.preventDefault(),i(null),!R.trim()){ae({code:"인증코드를 입력해 주세요."});return}try{const t=z(u);if(!t){i("휴대폰 번호 형식을 다시 확인해 주세요.");return}(await Ve(t,R)).success?P(3):i("인증코드가 올바르지 않습니다.")}catch(t){i(t?.message||"전화번호 인증에 실패했습니다.")}}async function Le(){if(!(y>0)){i(null);try{const n=z(u);if(!n){i("휴대폰 번호 형식을 다시 확인해 주세요.");return}const t=await re(n);t.code&&H(t.code),I(60)}catch(n){String(n?.message||"").includes("429")?i("너무 많은 요청입니다. 잠시 후 다시 시도해 주세요."):i(n?.message||"인증코드 요청에 실패했습니다.")}}}async function Oe(){if(f)try{const n=await He(f);T(n.available)}catch{T(null)}}async function qe(n){Pe(n);const{raw:t}=m(n);if(t.length===10)try{const c=await Xe(t);L(c.available)}catch{L(null)}else L(null)}function Fe(n){return n==="교과목"?["국어","수학","사회","과학","영어"]:n==="예체능"?["스포츠","미술","음악"]:[]}async function Me(n){n.preventDefault(),i(null);const{raw:t}=m(v);te(!0);try{await _e({name:U||void 0,phone:u,username:f,password:l,academyName:j,bizNo:t||void 0,category1:h,category2:h!=="기타"&&S||void 0,categoryEtc:h==="기타"&&J||void 0,referral:Q||void 0,address:X||void 0,representativeName:_||void 0,academyPhone:G||void 0,billingEmail:Y||void 0}),d("/login",{replace:!0})}catch(c){i(c?.message||"가입에 실패했습니다.")}finally{te(!1)}}return e.jsxs("div",{children:[e.jsx(Ye,{children:"계정 만들기"}),A===1&&e.jsxs(e.Fragment,{children:[e.jsx(M,{children:"휴대폰 번호를 입력해 주세요."}),e.jsxs($,{onSubmit:Be,children:[e.jsxs(r,{children:["휴대폰",e.jsx("span",{children:"*"})]}),e.jsx(o,{value:u,inputMode:"tel",autoComplete:"tel",onChange:n=>{E(n.target.value),w.phone&&se(t=>({...t,phone:void 0}))},placeholder:"010-1234-5678",onBlur:n=>{const t=z(n.currentTarget.value);E(t??n.currentTarget.value.trim())},"aria-invalid":!!w.phone,required:!0}),w.phone&&e.jsx(p,{danger:!0,children:w.phone}),b&&e.jsx(W,{children:b}),e.jsx(F,{as:"button",type:"submit",children:"인증 코드 보내기"})]})]}),A===2&&e.jsxs(e.Fragment,{children:[e.jsx(M,{children:"인증 번호를 보냈어요. 3분 내 입력해 주세요."}),e.jsxs($,{onSubmit:De,children:[e.jsx(r,{children:"휴대폰 번호"}),e.jsxs(de,{children:[e.jsx(o,{style:{flex:1},value:ie(u),disabled:!0}),e.jsx(xe,{type:"button",onClick:()=>P(1),children:"번호 변경"})]}),e.jsxs(r,{children:["인증코드",e.jsx("span",{children:"*"})]}),e.jsxs(de,{children:[e.jsx(o,{style:{flex:1},value:R,onChange:n=>{be(n.target.value),k.code&&ae({})},placeholder:"6자리","aria-invalid":!!k.code,required:!0}),e.jsx(xe,{type:"button",onClick:Le,disabled:y>0,children:y>0?`${y}s`:"재전송"})]}),k.code&&e.jsx(p,{danger:!0,children:k.code}),V&&e.jsxs(p,{children:["인증코드 힌트: ",V]}),b&&e.jsx(W,{children:b}),e.jsx(F,{as:"button",type:"submit",children:"다음"})]})]}),A===3&&e.jsxs(e.Fragment,{children:[e.jsx(M,{children:"아이디/비밀번호와 학원 정보를 입력해 주세요."}),e.jsxs($,{onSubmit:Me,children:[e.jsx(le,{children:"계정 정보"}),e.jsxs(r,{children:["아이디",e.jsx("span",{children:"*"})]}),e.jsx(o,{value:f,onChange:n=>{me(n.target.value),T(null)},onBlur:Oe,placeholder:"아이디","aria-invalid":!!f&&C===!1,required:!0}),C===!0&&e.jsx(p,{success:!0,children:"사용 가능한 아이디입니다."}),C===!1&&e.jsx(p,{danger:!0,children:"이미 사용중인 아이디입니다."}),e.jsxs(r,{children:["비밀번호",e.jsx("span",{children:"*"})]}),e.jsx(o,{type:"password",value:l,onChange:n=>je(n.target.value),placeholder:"8–64자, 문자+숫자","aria-invalid":l!==""&&!(N&&B),required:!0}),e.jsxs(Ze,{children:[e.jsx(ce,{ok:N,children:"8–64자"}),e.jsx(ce,{ok:B,children:"문자+숫자 포함"})]}),e.jsxs(r,{children:["비밀번호 확인",e.jsx("span",{children:"*"})]}),e.jsx(o,{type:"password",value:g,onChange:n=>ve(n.target.value),placeholder:"비밀번호 다시 입력","aria-invalid":g!==""&&l!==g,required:!0}),g&&l!==g&&e.jsx(p,{danger:!0,children:"비밀번호가 일치하지 않습니다."}),e.jsx(Je,{}),e.jsx(le,{children:"학원 정보"}),e.jsxs(r,{children:["학원명",e.jsx("span",{children:"*"})]}),e.jsx(o,{value:j,onChange:n=>Se(n.target.value),"aria-invalid":j!==""&&!j,required:!0}),e.jsxs(r,{children:["카테고리",e.jsx("span",{children:"*"})]}),e.jsx(ue,{children:["교과목","예체능","기타"].map(n=>e.jsx(he,{type:"button","data-active":h===n,onClick:()=>{Ee(n),Z(""),K("")},children:n},n))}),h&&h!=="기타"&&e.jsxs(e.Fragment,{children:[e.jsx(r,{children:"세부 카테고리 (선택)"}),e.jsx(ue,{children:Fe(h).map(n=>e.jsx(he,{type:"button","data-active":S===n,"aria-pressed":S===n,onClick:()=>Z(S===n?"":n),children:n},n))})]}),h==="기타"&&e.jsxs(e.Fragment,{children:[e.jsx(r,{children:"기타 분류"}),e.jsx(Ke,{children:e.jsx(Qe,{value:J,onChange:n=>K(n.target.value),placeholder:"예: 코딩, 바둑 등"})})]}),e.jsx(r,{children:"담당자 연락처"}),e.jsx(o,{value:ie(u),disabled:!0}),e.jsx(r,{children:"담당자 성함 (선택)"}),e.jsx(o,{value:U,onChange:n=>ge(n.target.value),placeholder:"홍길동"}),e.jsx(r,{children:"사업자번호 (선택)"}),e.jsx(o,{value:m(v).masked,onChange:n=>void qe(n.target.value),placeholder:"###-##-#####","aria-invalid":m(v).raw.length>0&&(m(v).raw.length!==10||D===!1)}),D===!1&&e.jsx(p,{danger:!0,children:"이미 가입된 사업자번호입니다. 연결/문의를 진행해 주세요."}),e.jsx(r,{children:"학원 주소 (선택)"}),e.jsx(o,{value:X,onChange:n=>we(n.target.value),placeholder:"도로명 주소"}),e.jsx(r,{children:"대표자명 (선택)"}),e.jsx(o,{value:_,onChange:n=>ke(n.target.value),placeholder:"대표자 성함"}),e.jsx(r,{children:"학원 대표번호 (선택)"}),e.jsx(o,{value:G,onChange:n=>ze(n.target.value),placeholder:"02-1234-5678"}),e.jsx(r,{children:"청구용 이메일 (선택)"}),e.jsx(o,{value:Y,onChange:n=>Ae(n.target.value),placeholder:"billing@example.com"}),e.jsx(r,{children:"가입 경로 (선택)"}),e.jsx(o,{value:Q,onChange:n=>Re(n.target.value),placeholder:"예: 친구 추천, 광고, 검색 등"}),b&&e.jsx(W,{children:b}),e.jsxs(nn,{children:[e.jsx("input",{id:"agree",type:"checkbox",checked:ee,onChange:n=>Ie(n.target.checked)}),e.jsxs("label",{htmlFor:"agree",children:["이용약관 및 개인정보 처리방침에 동의합니다"," ",e.jsx("a",{href:"#",onClick:n=>{n.preventDefault(),O(!0)},children:"이용약관"})," ","·"," ",e.jsx("a",{href:"#",onClick:n=>{n.preventDefault(),q(!0)},children:"개인정보 처리방침"})]})]}),e.jsx(F,{as:"button",type:"submit",disabled:ne||!f||C===!1||!N||!B||!l||l!==g||!j||h===""||m(v).raw.length===10&&D===!1||!ee,children:ne?"완료 중...":"완료"})]}),e.jsx(oe,{open:Te,title:"이용약관",message:e.jsx(pe,{children:e.jsx(fe,{children:tn})}),hideCancel:!0,confirmLabel:"닫기",maxWidth:720,onConfirm:()=>O(!1),onCancel:()=>O(!1)}),e.jsx(oe,{open:Ne,title:"개인정보 처리방침",message:e.jsx(pe,{children:e.jsx(fe,{children:sn})}),hideCancel:!0,confirmLabel:"닫기",maxWidth:720,onConfirm:()=>q(!1),onCancel:()=>q(!1)})]}),e.jsxs(en,{children:["이미 계정이 있으신가요? ",e.jsx(Ue,{to:"/login",children:"로그인"})]})]})}const Ye=a.h1`
  margin: 0 0 12px;
  font-size: 30px;
  color: #111827;
  text-align: center;
`,M=a.p`
  margin: 0 0 28px;
  color: #6b7280;
  font-size: 15px;
  text-align: center;
`,$=a.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`,Ze=a.div`
  display: flex;
  gap: 8px;
  font-size: 12px;
  color: #6b7280;
`,le=a.h3`
  margin: 6px 0 4px;
  font-size: 14px;
  color: #374151;
`,Je=a.hr`
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 6px 0 2px;
`,ce=a.span`
  color: ${d=>d.ok?"#065f46":"#6b7280"};
`,de=a.div`
  display: flex;
  gap: 10px;
  align-items: center;
`,r=a.label`
  font-size: 13px;
  color: #6b7280;
  span { color: #ef4444; margin-left: 4px; }
`,o=a.input`
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
`;a.select`
  height: 54px;
  border: none;
  border-radius: 14px;
  padding: 0 16px;
  font-size: 15px;
  background: #f3f4f6;
  outline: none;
  transition: box-shadow 0.15s ease, background 0.15s ease;
  &:focus {
    background: #eef2ff;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.18);
  }
`;const ue=a.div`
    display: flex;
    gap: 8px;
  `,he=a.button`
  height: 40px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  color: #374151;
  font-weight: 600;
  &:hover { background: #eef2ff; }
  &[data-active='true'] {
    background: #4f46e5;
    color: #ffffff;
    border-color: transparent;
  }
`,Ke=a.div`
  display: inline-flex;
  align-items: center;
  min-height: 40px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  color: #374151;
  &:focus-within {
    background: #eef2ff;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.18);
  }
`,Qe=a.input`
  border: none;
  background: transparent;
  outline: none;
  font-size: 15px;
  width: 100%;
  &::placeholder { color: #9ca3af; }
`,xe=a.button`
  ${Ge.subtle};
  height: 54px;
  border-radius: 14px;
  font-weight: 700;
  padding: 0 20px;
  &:disabled {
    opacity: 0.6;
  }
`,en=a.div`
  margin-top: 18px;
  color: #6b7280;
  font-size: 14px;
  a { color: #4f46e5; font-weight: 700; }
`,W=a.div`
  color: #b91c1c;
  background: #fee2e2;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 14px;
`,p=a.div`
  color: ${d=>d.danger?"#b91c1c":d.success?"#065f46":"#6b7280"};
  background: ${d=>d.danger?"#fee2e2":d.success?"#d1fae5":"#f3f4f6"};
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 12px;
`;a.p`
  margin-top: 6px;
  color: #6b7280;
  font-size: 12px;
`;a.p`
  color: #6b7280;
  font-size: 12px;
`;const nn=a.div`
  display: flex;
  gap: 10px;
  align-items: center;
  color: #6b7280;
  font-size: 13px;
  input { width: 18px; height: 18px; }
  label { user-select: none; }
  a { color: #4f46e5; font-weight: 700; text-decoration: underline; }
`,pe=a.div`
  max-height: 70vh;
  overflow: auto;
  padding-right: 4px;
`,fe=a.div`
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  word-break: break-word;
  color: #374151;
  font-size: 14px;
  line-height: 1.7;
`,tn=`제1조 (목적)

이 약관은 회사가 제공하는 ClassOn 서비스의 이용 조건 및 절차, 회사와 회원 간의 권리·의무, 책임사항 및 기타 필요한 사항을 규정함을 목적으로 합니다.

⸻

제2조 (용어의 정의)
	1.	“서비스”란 학원, 강사, 학생 등의 학원 운영과 수업 관리를 돕기 위해 제공되는 웹 및 모바일 기반 플랫폼을 말합니다.
	2.	“회원”이란 본 약관에 동의하고 서비스를 이용하는 개인 또는 기관을 의미합니다.
	3.	“강사회원”이란 수업 등록, 출결관리, 상담, 성적 관리 등의 기능을 사용하는 회원을 의미합니다.
	4.	“학원관리자회원”이란 학원 전체 운영, 결제 및 회원 관리를 수행하는 주체를 의미합니다.
	5.	“학생회원” 또는 “학부모회원”이란 학원에서 제공하는 출결 및 알림 서비스를 조회하거나 이용하는 자를 말합니다.
	6.	“콘텐츠”란 회원이 서비스 내에서 입력·등록한 수업자료, 상담기록, 시험결과, 이미지, 텍스트 등의 데이터를 말합니다.

⸻

제3조 (약관의 효력 및 변경)
	1.	본 약관은 서비스 화면 또는 기타 방법으로 공지함으로써 효력이 발생합니다.
	2.	회사는 관련 법령을 위반하지 않는 범위 내에서 약관을 개정할 수 있으며, 변경 시 개정 내용을 공지합니다.
	3.	회원은 변경된 약관에 동의하지 않을 경우 서비스 이용을 중단하고 회원 탈퇴를 요청할 수 있습니다.

⸻

제4조 (회원가입 및 계정 관리)
	1.	회원은 회사가 정한 절차에 따라 가입하며, 필수 정보를 정확하게 입력해야 합니다.
	2.	타인의 정보를 도용하거나 허위 정보를 입력한 경우 서비스 이용이 제한될 수 있습니다.
	3.	회원은 계정 및 비밀번호를 관리할 책임이 있으며, 제3자에게 양도·대여할 수 없습니다.

⸻

제5조 (서비스의 제공 및 변경)
	1.	회사는 다음과 같은 서비스를 제공합니다.
	•	(1) 학원 및 수업 일정 관리
	•	(2) 학생 출결 및 통계 관리
	•	(3) 수납 및 결제 내역 관리
	•	(4) 상담 및 성적 관리
	•	(5) 문자(SMS) 발송, 알림, 리포트 생성 기능
	•	(6) AI 기반 요약, 리포트 자동 생성 등 부가 기능
	2.	회사는 서비스 품질 향상을 위해 기능을 추가하거나 변경할 수 있습니다.
	3.	무료로 제공되는 기능은 사전 고지 없이 변경 또는 종료될 수 있습니다.

⸻

제6조 (결제 및 요금)
	1.	회사는 유료 서비스의 가격, 결제방식 및 환불 정책을 별도로 고지합니다.
	2.	회원이 유료 서비스를 이용하는 경우, 결제 완료 후 이용이 가능합니다.
	3.	이용자가 관련 법령 및 환불 정책을 위반하거나 부정 이용한 경우, 환불이 제한될 수 있습니다.

⸻

제7조 (회원의 의무)
	1.	회원은 다음 행위를 하여서는 안 됩니다.
	•	(1) 타인의 개인정보 또는 계정을 부정하게 사용
	•	(2) 서비스 내 데이터 무단 복제, 배포, 상업적 이용
	•	(3) 서버나 네트워크에 과도한 부하를 주는 행위
	•	(4) AI 기능을 이용하여 허위·왜곡된 정보를 생성하거나, 투자·의료 등 법적으로 제한된 목적에 사용하는 행위
	2.	회원은 관계법령, 본 약관, 서비스 내 안내사항을 준수해야 합니다.

⸻

제8조 (개인정보의 보호)
	1.	회사는 개인정보 보호법 등 관련 법령을 준수하며, 개인정보처리방침을 통해 수집·이용 목적 및 보관 기간 등을 명시합니다.
	2.	회사는 서비스 운영에 필요한 최소한의 개인정보만을 수집합니다.

⸻

제9조 (저작권 및 콘텐츠 관리)
	1.	회원이 서비스 내에 등록한 자료(수업 자료, 리포트 등)의 저작권은 해당 회원에게 있습니다.
	2.	단, 회사는 서비스 운영 및 홍보를 위해 필요한 범위 내에서 비상업적으로 이를 사용할 수 있습니다.
	3.	회사가 제공한 콘텐츠(디자인, 코드, 데이터 등)에 대한 저작권은 회사에 귀속됩니다.

⸻

제10조 (서비스 이용의 제한 및 해지)
	1.	회원이 본 약관 또는 관련 법령을 위반한 경우, 회사는 서비스 이용을 제한하거나 계정을 정지할 수 있습니다.
	2.	회원은 언제든지 서비스 내 탈퇴 절차를 통해 계약을 해지할 수 있습니다.
	3.	회원이 1년 이상 로그인하지 않은 경우, 회사는 사전 통지 후 계정을 삭제할 수 있습니다.

⸻

제11조 (면책 조항)
	1.	회사는 천재지변, 통신장애, 서버 오류 등 불가항력적인 사유로 인한 서비스 중단에 대해 책임을 지지 않습니다.
	2.	회원의 귀책으로 인한 데이터 손실, 접근 제한 등에 대해서는 회사가 책임을 지지 않습니다.
	3.	회사는 회원이 서비스 내 AI 기능을 통해 생성한 콘텐츠의 정확성, 신뢰성에 대해 보증하지 않습니다.

⸻

제12조 (분쟁 해결)
	1.	본 약관에 명시되지 않은 사항은 관계 법령 및 상관례에 따릅니다.
	2.	서비스 이용과 관련하여 발생한 분쟁에 대해 회사와 회원은 상호 협의로 해결을 원칙으로 합니다.
	3.	협의가 이루어지지 않을 경우, 서울중앙지방법원을 관할 법원으로 합니다.`,sn=`# 🔒 ClassOn 개인정보처리방침
**시행일자: 2025년 10월 9일**  
Naru Corp.(이하 “회사”)는 이용자의 개인정보를 중요하게 생각하며, 「개인정보 보호법」 등 관계 법령을 준수합니다. 회사는 이용자의 개인정보가 어떠한 용도와 방식으로 이용되고 있으며, 이를 보호하기 위해 어떠한 조치를 취하는지 다음과 같이 알려드립니다.

---

## 제1조 (수집하는 개인정보 항목 및 수집 방법)

### 1. 수집 항목
회사는 서비스 제공을 위해 다음과 같은 개인정보를 수집할 수 있습니다.  
1) **회원가입 시**  
- 이름, 아이디, 비밀번호, 이메일, 휴대폰번호, 소속 학원명, 직책(강사/관리자 등)

2) **서비스 이용 시 자동 수집 항목**  
- 접속 로그, 접속 IP, 쿠키, 기기정보(브라우저 종류, OS 등), 이용기록, 결제기록

3) **유료 서비스 결제 시**  
- 카드사명, 결제 금액, 거래 일시, PG사 결제번호(단, 카드번호 등은 저장하지 않음)

4) **AI 기능 이용 시**  
- 사용자가 입력한 텍스트·음성·이미지 데이터(서비스 품질 향상 및 피드백 분석 목적에 한함)

### 2. 수집 방법  
- 홈페이지 및 모바일앱을 통한 회원가입  
- 상담, 이벤트, 이메일 문의 등 이용자 자발적 제공  
- 서비스 이용 중 자동 수집

---

## 제2조 (개인정보의 수집 및 이용 목적)
회사는 다음 목적을 위해 개인정보를 이용합니다.  
1. 회원 식별 및 본인 확인  
2. 학원, 수업, 학생, 상담 등 관리 기능 제공  
3. 출결, 리포트, 결제 등 서비스 운영 관리  
4. AI 기반 리포트 생성, 데이터 분석 등 부가 서비스 제공  
5. 고객 문의 대응, 공지사항 전달  
6. 부정 이용 방지 및 법적 의무 준수  
7. 신규 서비스 개발 및 품질 개선

---

## 제3조 (개인정보의 보유 및 이용 기간)
1. 회사는 개인정보 수집 및 이용 목적이 달성되면 지체 없이 파기합니다.  
2. 단, 다음의 경우 관련 법령에 따라 일정 기간 보관할 수 있습니다.  
   - 전자상거래 등에서의 소비자보호에 관한 법률: 계약/결제기록 5년  
   - 통신비밀보호법: 접속로그 3개월  
   - 기타 법령이 정한 경우 그에 따름

---

## 제4조 (개인정보의 제3자 제공)
1. 회사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다.  
2. 다만, 다음의 경우에는 예외적으로 제공할 수 있습니다.  
   - 이용자가 사전에 동의한 경우  
   - 법령에 의거하여 수사기관이 적법한 절차에 따라 요청한 경우  
3. 회사는 서비스 운영을 위해 최소한의 개인정보를 외부 위탁업체에 처리할 수 있으며, 위탁 내역은 홈페이지에 고지합니다.

---

## 제5조 (개인정보의 처리 위탁)
회사는 원활한 서비스 제공을 위해 다음과 같이 개인정보 처리를 위탁할 수 있습니다.

| 위탁업체 | 위탁업무 내용 | 보유 및 이용기간 |
|---|---|---|
| Amazon Web Services | 데이터베이스 및 서버 인프라 관리 | 위탁계약 종료 시까지 |
| (주)알리고 / Twilio | 문자(SMS) 발송 서비스 | 위탁계약 종료 시까지 |
| Toss Payments | 결제 및 정산 업무 | 위탁계약 종료 시까지 |

회사는 위탁계약 체결 시 관련 법령에 따라 개인정보 보호가 안전하게 이루어지도록 관리·감독합니다.

---

## 제6조 (개인정보의 파기 절차 및 방법)
1. 회사는 개인정보 보유기간이 경과하거나 처리 목적이 달성된 경우 즉시 파기합니다.  
2. 전자적 파일 형태는 복구 불가능한 기술적 방법으로 삭제하며, 종이 문서는 분쇄 또는 소각합니다.

---

## 제7조 (이용자 및 법정대리인의 권리)
1. 이용자는 언제든지 자신의 개인정보를 조회하거나 수정할 수 있으며, 회원 탈퇴를 통해 개인정보 삭제를 요청할 수 있습니다.  
2. 만 14세 미만 아동의 경우, 법정대리인의 동의를 받아야 회원가입이 가능합니다.  
3. 법정대리인은 아동의 개인정보 열람·정정·삭제를 요청할 수 있습니다.

---

## 제8조 (개인정보의 안전성 확보 조치)
회사는 개인정보 보호를 위해 다음과 같은 기술적/관리적 조치를 시행합니다.  
1. 비밀번호 및 주요 정보 암호화 저장  
2. SSL 인증서 기반의 데이터 전송 암호화  
3. 개인정보 접근 권한 최소화  
4. 서버 접근 통제 및 로그 관리  
5. 정기적인 보안 점검 및 백업 관리

---

## 제9조 (쿠키의 운용 및 거부)
1. 회사는 맞춤형 서비스 제공을 위해 쿠키를 사용할 수 있습니다.  
2. 이용자는 웹 브라우저 설정을 통해 쿠키 저장을 거부할 수 있습니다.  
3. 쿠키 차단 시 일부 서비스 이용이 제한될 수 있습니다.

---

## 제10조 (개인정보 보호책임자 및 문의처)
회사는 개인정보 관련 문의를 신속히 처리하기 위해 다음과 같은 개인정보 보호책임자를 지정합니다.

- **개인정보 보호책임자:** 나현규 (CEO)  
- **이메일:** nahg0525@gmail.com

---

## 제11조 (AI 서비스 관련 추가 고지)
1. ClassOn의 AI 기능은 회원이 입력한 데이터(수업 기록, 상담 내용 등)를 기반으로 통계, 리포트, 요약을 제공합니다.  
2. AI 생성 콘텐츠는 참고용으로만 제공되며, 회사는 그 정확성이나 신뢰성을 보장하지 않습니다.  
3. 회사는 AI 기능 품질 향상을 위해 비식별화된 데이터를 학습·분석할 수 있으며, 이용자는 이에 동의하지 않을 권리가 있습니다.

---

## 제12조 (개인정보처리방침의 변경)
1. 본 방침은 시행일로부터 적용됩니다.  
2. 회사는 법령, 서비스 변경 등에 따라 방침을 수정할 수 있으며, 변경 시 홈페이지 공지사항을 통해 고지합니다.

---

📘 **시행일:** 2025년 10월 9일  
📍 **최초 제정일:** 2025년 10월 9일  
📍 **버전:** v1.0`;export{cn as default};
