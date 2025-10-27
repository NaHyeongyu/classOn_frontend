import{d as i,j as e,E as Ye,r as n,H as Ce,K as Ze,M as Je,N as Qe,O as et,u as tt}from"./index-B0K7mn4q.js";import{c as nt,m as xe}from"./UI-Cj3YhchZ.js";import{a as Be}from"./format-DW-Kl_C3.js";import{C as ye}from"./ConfirmDialog-ClQeXE4D.js";const ge=i.p`
  margin: 0 0 28px;
  color: #6b7280;
  font-size: 15px;
  text-align: center;
`,fe=i.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`,Se=i.h3`
  margin: 6px 0 4px;
  font-size: 14px;
  color: #374151;
`,st=i.hr`
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 6px 0 2px;
`,at=i.div`
  display: flex;
  gap: 8px;
  font-size: 12px;
  color: #6b7280;
`,ke=i.span`
  color: ${({ok:t})=>t?"#065f46":"#6b7280"};
`,c=i.label`
  font-size: 13px;
  color: #6b7280;
  span {
    color: #ef4444;
    margin-left: 4px;
  }
`,p=i.input`
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
`,we=i.div`
  display: flex;
  gap: 8px;
`,Pe=i.button`
  height: 40px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  color: #374151;
  font-weight: 600;
  &:hover {
    background: #eef2ff;
  }
  &[data-active="true"] {
    background: #4f46e5;
    color: #ffffff;
    border-color: transparent;
  }
`,rt=i.div`
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
`,ot=i.input`
  border: none;
  background: transparent;
  outline: none;
  font-size: 15px;
  width: 100%;
  &::placeholder {
    color: #9ca3af;
  }
`,ze=i.div`
  display: flex;
  gap: 10px;
  align-items: center;
`,Ae=i.button`
  ${nt.subtle};
  height: 54px;
  border-radius: 14px;
  font-weight: 700;
  padding: 0 20px;
  &:disabled {
    opacity: 0.6;
  }
`,me=i.div`
  color: #b91c1c;
  background: #fee2e2;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 14px;
`,A=i.div`
  color: ${({danger:t,success:a})=>t?"#b91c1c":a?"#065f46":"#6b7280"};
  background: ${({danger:t,success:a})=>t?"#fee2e2":a?"#d1fae5":"#f3f4f6"};
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 12px;
`,lt=i.div`
  display: flex;
  gap: 10px;
  align-items: center;
  color: #6b7280;
  font-size: 13px;
  input {
    width: 18px;
    height: 18px;
  }
  label {
    user-select: none;
  }
  a {
    color: #4f46e5;
    font-weight: 700;
    text-decoration: underline;
  }
`,Re=i.div`
  max-height: 70vh;
  overflow: auto;
  padding-right: 4px;
`,Ee=i.div`
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  word-break: break-word;
  color: #374151;
  font-size: 14px;
  line-height: 1.7;
`;function it({phone:t,setPhone:a,normalizeMobile:l,onSubmit:g,stepError:d,error:y}){return e.jsxs(e.Fragment,{children:[e.jsx(ge,{children:"휴대폰 번호를 입력해 주세요."}),e.jsxs(fe,{onSubmit:g,children:[e.jsxs(c,{children:["휴대폰",e.jsx("span",{children:"*"})]}),e.jsx(p,{value:t,inputMode:"tel",autoComplete:"tel",onChange:u=>a(u.target.value),placeholder:"010-1234-5678",onBlur:u=>{const v=l(u.currentTarget.value);a(v??u.currentTarget.value.trim())},"aria-invalid":!!d,required:!0}),d&&e.jsx(A,{danger:!0,children:d}),y&&e.jsx(me,{children:y}),e.jsx(xe,{type:"submit",children:"인증 코드 보내기"})]})]})}function ct({phone:t,code:a,setCode:l,resendCooldown:g,onResendCode:d,onSubmit:y,onBackToPhone:u,devCodeHint:v,stepError:f,error:S}){return e.jsxs(e.Fragment,{children:[e.jsx(ge,{children:"인증 번호를 보냈어요. 3분 내 입력해 주세요."}),e.jsxs(fe,{onSubmit:y,children:[e.jsx(c,{children:"휴대폰 번호"}),e.jsxs(ze,{children:[e.jsx(p,{style:{flex:1},value:Be(t),disabled:!0}),e.jsx(Ae,{type:"button",onClick:u,children:"번호 변경"})]}),e.jsxs(c,{children:["인증코드",e.jsx("span",{children:"*"})]}),e.jsxs(ze,{children:[e.jsx(p,{style:{flex:1},value:a,onChange:R=>l(R.target.value),placeholder:"6자리","aria-invalid":!!f,required:!0}),e.jsx(Ae,{type:"button",onClick:()=>{d()},disabled:g>0,children:g>0?`${g}s`:"재전송"})]}),f&&e.jsx(A,{danger:!0,children:f}),v&&e.jsxs(A,{children:["인증코드 힌트: ",v]}),S&&e.jsx(me,{children:S}),e.jsx(xe,{type:"submit",children:"다음"})]})]})}const dt=`제1조 (목적)

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
	3.	협의가 이루어지지 않을 경우, 서울중앙지방법원을 관할 법원으로 합니다.`,ut=`# 🔒 ClassOn 개인정보처리방침
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
   - 기타 법령이 정한 경우 그에 따름`;function ht({flow:t,onSubmit:a}){const{username:l,setUsername:g,usernameAvailable:d,checkUsername:y,password:u,setPassword:v,password2:f,setPassword2:S,pwRuleLen:R,pwRuleMix:E,academyName:m,setAcademyName:Z,category1:C,setCategory1:N,category2:h,setCategory2:J,categoryEtc:B,setCategoryEtc:Q,secondCategories:T,phone:ee,name:F,setName:te,bizNo:k,bizNoAvailable:W,handleBizNoChange:M,maskBizNo:ne,academyAddress:I,setAcademyAddress:se,representative:V,setRepresentative:ae,academyPhone:D,setAcademyPhone:re,billingEmail:w,setBillingEmail:oe,referral:L,setReferral:O,error:j,agree:le,setAgree:q,showTerms:X,setShowTerms:P,showPrivacy:_,setShowPrivacy:z,loading:ie,canSubmitStep3:U}=t,$=ne(k);return e.jsxs(e.Fragment,{children:[e.jsx(ge,{children:"아이디/비밀번호와 학원 정보를 입력해 주세요."}),e.jsxs(fe,{onSubmit:a,children:[e.jsx(Se,{children:"계정 정보"}),e.jsxs(c,{children:["아이디",e.jsx("span",{children:"*"})]}),e.jsx(p,{value:l,onChange:s=>g(s.target.value),onBlur:()=>{y()},placeholder:"아이디","aria-invalid":!!l&&d===!1,required:!0}),d===!0&&e.jsx(A,{success:!0,children:"사용 가능한 아이디입니다."}),d===!1&&e.jsx(A,{danger:!0,children:"이미 사용중인 아이디입니다."}),e.jsxs(c,{children:["비밀번호",e.jsx("span",{children:"*"})]}),e.jsx(p,{type:"password",value:u,onChange:s=>v(s.target.value),placeholder:"8–64자, 문자+숫자","aria-invalid":u!==""&&!(R&&E),required:!0}),e.jsxs(at,{children:[e.jsx(ke,{ok:R,children:"8–64자"}),e.jsx(ke,{ok:E,children:"문자+숫자 포함"})]}),e.jsxs(c,{children:["비밀번호 확인",e.jsx("span",{children:"*"})]}),e.jsx(p,{type:"password",value:f,onChange:s=>S(s.target.value),placeholder:"비밀번호 다시 입력","aria-invalid":f!==""&&u!==f,required:!0}),f&&u!==f&&e.jsx(A,{danger:!0,children:"비밀번호가 일치하지 않습니다."}),e.jsx(st,{}),e.jsx(Se,{children:"학원 정보"}),e.jsxs(c,{children:["학원명",e.jsx("span",{children:"*"})]}),e.jsx(p,{value:m,onChange:s=>Z(s.target.value),"aria-invalid":m!==""&&!m,required:!0}),e.jsxs(c,{children:["카테고리",e.jsx("span",{children:"*"})]}),e.jsx(we,{children:["교과목","예체능","기타"].map(s=>e.jsx(Pe,{type:"button","data-active":C===s,onClick:()=>N(s),children:s},s))}),C&&C!=="기타"?e.jsxs(e.Fragment,{children:[e.jsx(c,{children:"세부 카테고리 (선택)"}),e.jsx(we,{children:T(C).map(s=>e.jsx(Pe,{type:"button","data-active":h===s,"aria-pressed":h===s,onClick:()=>J(h===s?"":s),children:s},s))})]}):null,C==="기타"?e.jsxs(e.Fragment,{children:[e.jsx(c,{children:"기타 분류"}),e.jsx(rt,{children:e.jsx(ot,{value:B,onChange:s=>Q(s.target.value),placeholder:"예: 코딩, 바둑 등"})})]}):null,e.jsx(c,{children:"담당자 연락처"}),e.jsx(p,{value:Be(ee),disabled:!0}),e.jsx(c,{children:"담당자 성함 (선택)"}),e.jsx(p,{value:F,onChange:s=>te(s.target.value),placeholder:"홍길동"}),e.jsx(c,{children:"사업자번호 (선택)"}),e.jsx(p,{value:$.masked,onChange:s=>{M(s.target.value)},placeholder:"###-##-#####","aria-invalid":$.raw.length>0&&($.raw.length!==10||W===!1)}),W===!1&&e.jsx(A,{danger:!0,children:"이미 가입된 사업자번호입니다. 연결/문의를 진행해 주세요."}),e.jsx(c,{children:"학원 주소 (선택)"}),e.jsx(p,{value:I,onChange:s=>se(s.target.value),placeholder:"도로명 주소"}),e.jsx(c,{children:"대표자명 (선택)"}),e.jsx(p,{value:V,onChange:s=>ae(s.target.value),placeholder:"대표자 성함"}),e.jsx(c,{children:"학원 대표번호 (선택)"}),e.jsx(p,{value:D,onChange:s=>re(s.target.value),placeholder:"02-1234-5678"}),e.jsx(c,{children:"청구용 이메일 (선택)"}),e.jsx(p,{value:w,onChange:s=>oe(s.target.value),placeholder:"billing@example.com"}),e.jsx(c,{children:"가입 경로 (선택)"}),e.jsx(p,{value:L,onChange:s=>O(s.target.value),placeholder:"예: 친구 추천, 광고, 검색 등"}),j&&e.jsx(me,{children:j}),e.jsxs(lt,{children:[e.jsx("input",{id:"agree",type:"checkbox",checked:le,onChange:s=>q(s.target.checked)}),e.jsxs("label",{htmlFor:"agree",children:["이용약관 및 개인정보 처리방침에 동의합니다"," ",e.jsx("a",{href:"#",onClick:s=>{s.preventDefault(),P(!0)},children:"이용약관"})," ","·"," ",e.jsx("a",{href:"#",onClick:s=>{s.preventDefault(),z(!0)},children:"개인정보 처리방침"})]})]}),e.jsx(xe,{type:"submit",disabled:!U,children:ie?"완료 중...":"완료"})]}),e.jsx(ye,{open:X,title:"이용약관",message:e.jsx(Re,{children:e.jsx(Ee,{children:dt})}),hideCancel:!0,confirmLabel:"닫기",maxWidth:720,onConfirm:()=>P(!1),onCancel:()=>P(!1)}),e.jsx(ye,{open:_,title:"개인정보 처리방침",message:e.jsx(Re,{children:e.jsx(Ee,{children:ut})}),hideCancel:!0,confirmLabel:"닫기",maxWidth:720,onConfirm:()=>z(!1),onCancel:()=>z(!1)})]})}function pt({flow:t,onComplete:a}){return e.jsxs(xt,{children:[e.jsx(gt,{children:"계정 만들기"}),t.step===1?e.jsx(it,{phone:t.phone,setPhone:t.setPhone,normalizeMobile:t.normalizeMobile,onSubmit:t.handleStep1Submit,stepError:t.step1Err.phone,error:t.error}):null,t.step===2?e.jsx(ct,{phone:t.phone,code:t.code,setCode:t.setCode,resendCooldown:t.resendCooldown,onResendCode:t.handleResendCode,onSubmit:t.handleCodeSubmit,onBackToPhone:t.backToStep1,devCodeHint:t.devCodeHint,stepError:t.step2Err.code,error:t.error}):null,t.step===3?e.jsx(ht,{flow:t,onSubmit:a}):null,e.jsxs(ft,{children:["이미 계정이 있으신가요? ",e.jsx(Ye,{to:"/login",children:"로그인"})]})]})}const xt=i.div`
  max-width: 480px;
  margin: 0 auto;
  padding: 48px 16px 64px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`,gt=i.h1`
  margin: 0 0 20px;
  font-size: 30px;
  color: #111827;
  text-align: center;
`,ft=i.div`
  margin-top: 24px;
  text-align: center;
  font-size: 14px;
  color: #6b7280;
  a {
    color: #4f46e5;
    font-weight: 700;
  }
`;function Te(t){return typeof t=="object"&&t!==null}function Ne(t){if(!Te(t))return;const{status:a}=t;if(typeof a=="number")return a;if(typeof a=="string"){const l=Number(a);return Number.isFinite(l)?l:void 0}}function G(t,a){return t instanceof Error&&t.message||Te(t)&&typeof t.message=="string"?t.message:a}function K(t){const a=t.replace(/[^0-9]/g,"");return a.length===11&&a.startsWith("010")?`010-${a.slice(3,7)}-${a.slice(7)}`:null}function Y(t){const a=t.replace(/\D/g,"").slice(0,10),l=a.slice(0,3),g=a.slice(3,5),d=a.slice(5,10);return{raw:a,masked:[l,g,d].filter(Boolean).join("-")}}function mt(t){return t==="교과목"?["국어","수학","사회","과학","영어"]:t==="예체능"?["스포츠","미술","음악"]:[]}function bt(){const[t,a]=n.useState(1),[l,g]=n.useState(""),[d,y]=n.useState(""),[u,v]=n.useState(""),[f,S]=n.useState(0),[R,E]=n.useState(null),[m,Z]=n.useState(""),[C,N]=n.useState(null),[h,J]=n.useState(""),[B,Q]=n.useState(""),[T,ee]=n.useState(!1),[F,te]=n.useState(!1),[k,W]=n.useState(""),[M,ne]=n.useState(""),[I,se]=n.useState(""),[V,ae]=n.useState(""),[D,re]=n.useState(""),[w,oe]=n.useState(""),[L,O]=n.useState(null),[j,le]=n.useState(""),[q,X]=n.useState(""),[P,_]=n.useState(""),[z,ie]=n.useState(""),[U,$]=n.useState(!1),[s,Fe]=n.useState(!1),[Me,Ie]=n.useState(!1),[ce,be]=n.useState(!1),[Ve,x]=n.useState(null),[de,je]=n.useState({}),[ue,he]=n.useState({});n.useEffect(()=>{const r=window.setInterval(()=>{S(o=>o>0?o-1:0)},1e3);return()=>window.clearInterval(r)},[]),n.useEffect(()=>{const r=h.length>=8&&h.length<=64,o=/[A-Za-z]/.test(h)&&/\d/.test(h);ee(r),te(o)},[h]);const pe=n.useCallback(r=>{g(r),de.phone&&je({})},[de.phone]),De=n.useCallback(r=>{v(r),ue.code&&he({})},[ue.code]),Le=n.useCallback(r=>{Z(r),N(null)},[]),Oe=n.useCallback(async r=>{r.preventDefault(),x(null);const o={};l.trim()||(o.phone="휴대폰 번호를 입력해 주세요.");const b=K(l);if(l.trim()&&!b&&(o.phone="010-1234-5678 형식으로 입력해 주세요."),je(o),!(Object.keys(o).length>0))try{pe(b);const H=await Ce(b);H.code&&E(H.code),S(60),a(2)}catch(H){const Ke=Ne(H),ve=G(H,"인증코드 요청에 실패했습니다.");Ke===429||ve.includes("429")?x("너무 많은 요청입니다. 잠시 후 다시 시도해 주세요."):x(ve)}},[l,pe]),qe=n.useCallback(async r=>{if(r.preventDefault(),x(null),!u.trim()){he({code:"인증코드를 입력해 주세요."});return}try{const o=K(l);if(!o){x("휴대폰 번호 형식을 다시 확인해 주세요.");return}(await Ze(o,u)).success?a(3):x("인증코드가 올바르지 않습니다.")}catch(o){x(G(o,"전화번호 인증에 실패했습니다."))}},[u,l]),Ue=n.useCallback(async()=>{if(!(f>0)){x(null);try{const r=K(l);if(!r){x("휴대폰 번호 형식을 다시 확인해 주세요.");return}const o=await Ce(r);o.code&&E(o.code),S(60)}catch(r){const o=Ne(r),b=G(r,"인증코드 요청에 실패했습니다.");o===429||b.includes("429")?x("너무 많은 요청입니다. 잠시 후 다시 시도해 주세요."):x(b)}}},[l,f]),$e=n.useCallback(()=>{a(1),v(""),he({})},[]),He=n.useCallback(async()=>{if(m)try{const r=await Je(m);N(r.available)}catch{N(null)}},[m]),We=n.useCallback(async r=>{oe(r);const{raw:o}=Y(r);if(o.length===10)try{const b=await Qe(o);O(b.available)}catch{O(null)}else O(null)},[]),Xe=n.useCallback(async r=>{r.preventDefault(),x(null);const{raw:o}=Y(w);be(!0);try{return await et({name:d||void 0,phone:l,username:m,password:h,academyName:k,bizNo:o||void 0,category1:j,category2:j!=="기타"&&q||void 0,categoryEtc:j==="기타"&&P||void 0,referral:z||void 0,address:M||void 0,representativeName:I||void 0,academyPhone:V||void 0,billingEmail:D||void 0}),!0}catch(b){return x(G(b,"가입에 실패했습니다.")),!1}finally{be(!1)}},[M,k,V,D,w,j,q,P,d,h,l,z,I,m]),_e=n.useCallback(r=>{le(r),X(""),_("")},[]),Ge=n.useMemo(()=>{const{raw:r}=Y(w),o=r.length===0||r.length===10&&L!==!1;return!ce&&m.length>0&&C!==!1&&T&&F&&h.length>0&&h===B&&k.trim().length>0&&j!==""&&o&&U},[k,U,w,L,j,ce,h,B,T,F,C,m]);return{step:t,error:Ve,loading:ce,phone:l,setPhone:pe,name:d,setName:y,step1Err:de,handleStep1Submit:Oe,code:u,setCode:De,step2Err:ue,resendCooldown:f,devCodeHint:R,handleCodeSubmit:qe,handleResendCode:Ue,backToStep1:$e,username:m,setUsername:Le,usernameAvailable:C,checkUsername:He,password:h,setPassword:J,password2:B,setPassword2:Q,pwRuleLen:T,pwRuleMix:F,academyName:k,setAcademyName:W,academyAddress:M,setAcademyAddress:ne,representative:I,setRepresentative:se,academyPhone:V,setAcademyPhone:ae,billingEmail:D,setBillingEmail:re,bizNo:w,bizNoAvailable:L,handleBizNoChange:We,category1:j,setCategory1:_e,category2:q,setCategory2:X,categoryEtc:P,setCategoryEtc:_,referral:z,setReferral:ie,agree:U,setAgree:$,showTerms:s,setShowTerms:Fe,showPrivacy:Me,setShowPrivacy:Ie,completeRegistration:Xe,setError:x,canSubmitStep3:Ge,maskBizNo:Y,normalizeMobile:K,secondCategories:mt}}function St(){const t=bt(),a=tt(),l=async g=>{await t.completeRegistration(g)&&a("/login",{replace:!0})};return e.jsx(pt,{flow:t,onComplete:l})}export{St as default};
