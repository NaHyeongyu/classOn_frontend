import { useEffect, useState, type FormEvent } from "react";
// EN: 3-step onboarding wizard (phone -> verify -> account + academy)
// KO: 3단계 온보딩 위저드(휴대폰 -> 인증 -> 계정/학원 정보)
import styled from "styled-components";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import {
  PrimaryBtnLg as UIPrimaryBtn,
  buttonVariants,
} from "../components/common/UI";
import { Link, useNavigate } from "react-router-dom";
import { apiCheckUsername, apiRequestPhoneCode, apiVerifyPhoneCode, apiCheckBizNo, apiOnboardComplete } from "@/api/auth";
import { formatPhone } from "@/lib/format";

export default function Register() {
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: 휴대폰 입력
  const [phone, setPhone] = useState("");
  // 담당자 성함(선택)은 3단계에서 입력
  const [name, setName] = useState("");

  // Step 2: 휴대전화 인증 / Phone verification
  const [code, setCode] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [devCodeHint, setDevCodeHint] = useState<string | null>(null);

  useEffect(() => {
    const id = setInterval(() => setResendCooldown((n) => (n > 0 ? n - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);

  // Step 3: 계정(아이디/비밀번호) + 학원 정보
  const [username, setUsername] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [pwRuleLen, setPwRuleLen] = useState(false);
  const [pwRuleMix, setPwRuleMix] = useState(false);
  useEffect(() => {
    const lenOk = password.length >= 8 && password.length <= 64;
    const mixOk = /[A-Za-z]/.test(password) && /\d/.test(password);
    setPwRuleLen(lenOk);
    setPwRuleMix(mixOk);
  }, [password]);

  // 학원 정보 / Academy info
  const [academyName, setAcademyName] = useState("");
  const [bizNo, setBizNo] = useState("");
  const [bizNoAvailable, setBizNoAvailable] = useState<boolean | null>(null);
  // 카테고리
  const [category1, setCategory1] = useState<"" | "교과목" | "예체능" | "기타">("");
  const [category2, setCategory2] = useState<string>("");
  const [categoryEtc, setCategoryEtc] = useState<string>("");
  // 가입 경로(선택)
  const [referral, setReferral] = useState("");
  // 약관 동의
  const [agree, setAgree] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  // common
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Inline field errors per step
  const [step1Err, setStep1Err] = useState<{ phone?: string }>({});
  const [step2Err, setStep2Err] = useState<{ code?: string }>({});

  // Email 수집 제거됨: 담당자 이메일은 혼선을 주어 수집하지 않습니다.

  function maskBizNo(input: string) {
    const digits = input.replace(/\D/g, "").slice(0, 10);
    const p1 = digits.slice(0, 3);
    const p2 = digits.slice(3, 5);
    const p3 = digits.slice(5, 10);
    return { masked: [p1, p2, p3].filter(Boolean).join("-"), raw: digits };
  }

  function normalizeMobile(input: string): string | null {
    const digits = input.replace(/[^0-9]/g, "");
    if (digits.length === 11 && digits.startsWith("010")) {
      return `010-${digits.slice(3, 7)}-${digits.slice(7)}`;
    }
    return null;
  }

  async function onNextFromStep1(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const nextErr: { phone?: string } = {};
    if (!phone.trim()) nextErr.phone = "휴대폰 번호를 입력해 주세요.";
    const normalizedPhone = normalizeMobile(phone);
    if (phone.trim() && !normalizedPhone) nextErr.phone = "010-1234-5678 형식으로 입력해 주세요.";
    setStep1Err(nextErr);
    if (Object.keys(nextErr).length > 0) return;
    try {
      setPhone(normalizedPhone!);
      const res = await apiRequestPhoneCode(normalizedPhone);
      if (res.code) setDevCodeHint(res.code);
      setResendCooldown(60);
      setStep(2);
    } catch (e: any) {
      if (String(e?.message || "").includes("429")) setError("너무 많은 요청입니다. 잠시 후 다시 시도해 주세요.");
      else setError(e?.message || "인증코드 요청에 실패했습니다.");
    }
  }

  async function onVerifyCode(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!code.trim()) { setStep2Err({ code: '인증코드를 입력해 주세요.' }); return; }
    try {
      const normalizedPhone = normalizeMobile(phone);
      if (!normalizedPhone) {
        setError("휴대폰 번호 형식을 다시 확인해 주세요.");
        return;
      }
      const res = await apiVerifyPhoneCode(normalizedPhone, code);
      if (res.success) setStep(3);
      else setError("인증코드가 올바르지 않습니다.");
    } catch (e: any) {
      setError(e?.message || "전화번호 인증에 실패했습니다.");
    }
  }

  async function onResendCode() {
    if (resendCooldown > 0) return;
    setError(null);
    try {
      const normalizedPhone = normalizeMobile(phone);
      if (!normalizedPhone) {
        setError("휴대폰 번호 형식을 다시 확인해 주세요.");
        return;
      }
      const res = await apiRequestPhoneCode(normalizedPhone);
      if (res.code) setDevCodeHint(res.code);
      setResendCooldown(60);
    } catch (e: any) {
      if (String(e?.message || "").includes("429")) setError("너무 많은 요청입니다. 잠시 후 다시 시도해 주세요.");
      else setError(e?.message || "인증코드 요청에 실패했습니다.");
    }
  }

  async function onUsernameBlur() {
    if (!username) return;
    try {
      const r = await apiCheckUsername(username);
      setUsernameAvailable(r.available);
    } catch {
      setUsernameAvailable(null);
    }
  }

  async function onBizNoChange(value: string) {
    setBizNo(value);
    const { raw } = maskBizNo(value);
    if (raw.length === 10) {
      try {
        const res = await apiCheckBizNo(raw);
        setBizNoAvailable(res.available);
      } catch {
        setBizNoAvailable(null);
      }
    } else {
      setBizNoAvailable(null);
    }
  }

  function secondCategories(depth1: typeof category1): string[] {
    if (depth1 === "교과목") return ["국어", "수학", "사회", "과학", "영어"];
    if (depth1 === "예체능") return ["스포츠", "미술", "음악"];
    return [];
  }

  async function onComplete(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const { raw } = maskBizNo(bizNo);
    setLoading(true);
    try {
      await apiOnboardComplete({
        name: name || undefined,
        phone,
        username,
        password,
        academyName,
        bizNo: raw || undefined,
        category1: category1 as string,
        category2: category1 !== "기타" ? (category2 || undefined) : undefined,
        categoryEtc: category1 === "기타" ? (categoryEtc || undefined) : undefined,
        referral: referral || undefined,
      });
      navigate("/login", { replace: true });
    } catch (err: any) {
      setError(err?.message || "가입에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Title>계정 만들기</Title>
      {step === 1 && (
        <>
          <Sub>휴대폰 번호를 입력해 주세요.</Sub>
          <Form onSubmit={onNextFromStep1}>
            <Label>휴대폰<span>*</span></Label>
            <Input
              value={phone}
              inputMode="tel"
              autoComplete="tel"
              onChange={(e) => { setPhone(e.target.value); if (step1Err.phone) setStep1Err(s => ({ ...s, phone: undefined })); }}
              placeholder="010-1234-5678"
              onBlur={(e)=>{
                const normalized = normalizeMobile(e.currentTarget.value);
                setPhone(normalized ?? e.currentTarget.value.trim());
              }}
              aria-invalid={!!step1Err.phone}
              required
            />
            {step1Err.phone && <Hint danger>{step1Err.phone}</Hint>}

            {error && <ErrorText>{error}</ErrorText>}
            <UIPrimaryBtn as={"button" as any} type="submit">인증 코드 보내기</UIPrimaryBtn>
          </Form>
        </>
      )}
      {step === 2 && (
        <>
          <Sub>인증 번호를 보냈어요. 3분 내 입력해 주세요.</Sub>
          <Form onSubmit={onVerifyCode}>
            <Label>휴대폰 번호</Label>
            <Row>
              <Input style={{ flex: 1 }} value={formatPhone(phone)} disabled />
              <SmallButton type="button" onClick={() => setStep(1)}>번호 변경</SmallButton>
            </Row>
            <Label>인증코드<span>*</span></Label>
            <Row>
              <Input style={{ flex: 1 }} value={code} onChange={(e) => { setCode(e.target.value); if (step2Err.code) setStep2Err({}); }} placeholder="6자리" aria-invalid={!!step2Err.code} required />
              <SmallButton type="button" onClick={onResendCode} disabled={resendCooldown > 0}>
                {resendCooldown > 0 ? `${resendCooldown}s` : "재전송"}
              </SmallButton>
            </Row>
            {step2Err.code && <Hint danger>{step2Err.code}</Hint>}
            {devCodeHint && <Hint>개발용 인증코드: {devCodeHint}</Hint>}
            <Help>스팸함을 확인하고, 발신 도메인을 화이트리스트에 추가해 주세요.</Help>
            {error && <ErrorText>{error}</ErrorText>}
            <UIPrimaryBtn as={"button" as any} type="submit">다음</UIPrimaryBtn>
          </Form>
        </>
      )}
      {step === 3 && (
        <>
          <Sub>아이디/비밀번호와 학원 정보를 입력해 주세요.</Sub>
          <Form onSubmit={onComplete}>
            <SectionTitle>계정 정보</SectionTitle>
            <Label>아이디<span>*</span></Label>
            <Input value={username} onChange={(e) => { setUsername(e.target.value); setUsernameAvailable(null); }} onBlur={onUsernameBlur} placeholder="아이디" aria-invalid={!!username && usernameAvailable === false} required />
            {usernameAvailable === true && <Hint success>사용 가능한 아이디입니다.</Hint>}
            {usernameAvailable === false && <Hint danger>이미 사용중인 아이디입니다.</Hint>}

            <Label>비밀번호<span>*</span></Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="8–64자, 문자+숫자" aria-invalid={password !== '' && !(pwRuleLen && pwRuleMix)} required />
            <Rules>
              <Rule ok={pwRuleLen}>8–64자</Rule>
              <Rule ok={pwRuleMix}>문자+숫자 포함</Rule>
            </Rules>

            <Label>비밀번호 확인<span>*</span></Label>
            <Input type="password" value={password2} onChange={(e) => setPassword2(e.target.value)} placeholder="비밀번호 다시 입력" aria-invalid={password2 !== '' && password !== password2} required />
            {password2 && password !== password2 && <Hint danger>비밀번호가 일치하지 않습니다.</Hint>}

            <Divider />
            <SectionTitle>학원 정보</SectionTitle>
            <Label>학원명<span>*</span></Label>
            <Input value={academyName} onChange={(e) => setAcademyName(e.target.value)} placeholder="예: 오픈AI어학원" aria-invalid={academyName !== '' && !academyName} required />

            <Label>카테고리<span>*</span></Label>
            <Pills>
              {(["교과목", "예체능", "기타"] as const).map((opt) => (
                <PillButton
                  key={opt}
                  type="button"
                  data-active={category1 === opt}
                  onClick={() => { setCategory1(opt); setCategory2(""); setCategoryEtc(""); }}
                >
                  {opt}
                </PillButton>
              ))}
            </Pills>

            {category1 && category1 !== "기타" && (
              <>
                <Label>세부 카테고리 (선택)</Label>
                <Pills>
                  {secondCategories(category1).map((c) => (
                    <PillButton
                      key={c}
                      type="button"
                      data-active={category2 === c}
                      aria-pressed={category2 === c}
                      onClick={() => setCategory2(category2 === c ? "" : c)}
                    >
                      {c}
                    </PillButton>
                  ))}
                </Pills>
              </>
            )}
            {category1 === "기타" && (
              <>
                <Label>기타 분류</Label>
                <PillInputWrap>
                  <PillTextInput
                    value={categoryEtc}
                    onChange={(e) => setCategoryEtc(e.target.value)}
                    placeholder="예: 코딩, 바둑 등"
                  />
                </PillInputWrap>
              </>
            )}

            <Label>담당자 연락처</Label>
            <Input value={formatPhone(phone)} disabled />

            <Label>담당자 성함 (선택)</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="홍길동" />

            <Label>사업자번호 (선택)</Label>
            <Input value={maskBizNo(bizNo).masked} onChange={(e) => void onBizNoChange(e.target.value)} placeholder="###-##-#####" aria-invalid={maskBizNo(bizNo).raw.length > 0 && (maskBizNo(bizNo).raw.length !== 10 || bizNoAvailable === false)} />
            {bizNoAvailable === false && <Hint danger>이미 가입된 사업자번호입니다. 연결/문의를 진행해 주세요.</Hint>}

            <Label>가입 경로 (선택)</Label>
            <Input value={referral} onChange={(e) => setReferral(e.target.value)} placeholder="예: 친구 추천, 광고, 검색 등" />

            {error && <ErrorText>{error}</ErrorText>}
            <AgreeRow>
              <input id="agree" type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
              <label htmlFor="agree">
                이용약관 및 개인정보 처리방침에 동의합니다
                {' '}<a href="#" onClick={(e)=>{e.preventDefault(); setShowTerms(true);}}>이용약관</a>
                {' '}·{' '}
                <a href="#" onClick={(e)=>{e.preventDefault(); setShowPrivacy(true);}}>개인정보 처리방침</a>
              </label>
            </AgreeRow>
            <UIPrimaryBtn as={"button" as any} type="submit"
              disabled={
                loading || !username || usernameAvailable === false || !pwRuleLen || !pwRuleMix || !password || password !== password2 || !academyName || category1 === "" || (maskBizNo(bizNo).raw.length === 10 && bizNoAvailable === false) || !agree
              }>
              {loading ? "완료 중..." : "완료"}
            </UIPrimaryBtn>
          </Form>

          {/* 약관/개인정보 모달 */}
          <ConfirmDialog
            open={showTerms}
            title="이용약관"
            message={<ScrollArea><TermsBody>{TERMS_TEXT}</TermsBody></ScrollArea>}
            hideCancel
            confirmLabel="닫기"
            maxWidth={720}
            onConfirm={() => setShowTerms(false)}
            onCancel={() => setShowTerms(false)}
          />
          <ConfirmDialog
            open={showPrivacy}
            title="개인정보 처리방침"
            message={<ScrollArea><TermsBody>{PRIVACY_TEXT}</TermsBody></ScrollArea>}
            hideCancel
            confirmLabel="닫기"
            maxWidth={720}
            onConfirm={() => setShowPrivacy(false)}
            onCancel={() => setShowPrivacy(false)}
          />
        </>
      )}

      <Alt>
        이미 계정이 있으신가요? <Link to="/login">로그인</Link>
      </Alt>
    </div>
  );
}

const Title = styled.h1`
  margin: 0 0 12px;
  font-size: 30px;
  color: #111827;
  text-align: center;
`;
const Sub = styled.p`
  margin: 0 0 28px;
  color: #6b7280;
  font-size: 15px;
  text-align: center;
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
const Rules = styled.div`
  display: flex;
  gap: 8px;
  font-size: 12px;
  color: #6b7280;
`;
const SectionTitle = styled.h3`
  margin: 6px 0 4px;
  font-size: 14px;
  color: #374151;
`;
const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 6px 0 2px;
`;
const Rule = styled.span<{ ok: boolean }>`
  color: ${(p) => (p.ok ? "#065f46" : "#6b7280")};
`;
const Row = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;
const Label = styled.label`
  font-size: 13px;
  color: #6b7280;
  span { color: #ef4444; margin-left: 4px; }
`;
const Input = styled.input`
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
`;
const Select = styled.select`
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
`;
  const Pills = styled.div`
    display: flex;
    gap: 8px;
  `;
  const PillButton = styled.button`
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
`;
const PillInputWrap = styled.div`
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
`;
const PillTextInput = styled.input`
  border: none;
  background: transparent;
  outline: none;
  font-size: 15px;
  width: 100%;
  &::placeholder { color: #9ca3af; }
`;
// Button from common UI
const SmallButton = styled.button`
  ${buttonVariants.subtle};
  height: 54px;
  border-radius: 14px;
  font-weight: 700;
  padding: 0 20px;
  &:disabled {
    opacity: 0.6;
  }
`;
const Alt = styled.div`
  margin-top: 18px;
  color: #6b7280;
  font-size: 14px;
  a { color: #4f46e5; font-weight: 700; }
`;
const ErrorText = styled.div`
  color: #b91c1c;
  background: #fee2e2;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 14px;
`;
const Hint = styled.div<{ success?: boolean; danger?: boolean }>`
  color: ${(p) => (p.danger ? "#b91c1c" : p.success ? "#065f46" : "#6b7280")};
  background: ${(p) => (p.danger ? "#fee2e2" : p.success ? "#d1fae5" : "#f3f4f6")};
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 12px;
`;
const SubCopy = styled.p`
  margin-top: 6px;
  color: #6b7280;
  font-size: 12px;
`;
const Help = styled.p`
  color: #6b7280;
  font-size: 12px;
`;
const AgreeRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  color: #6b7280;
  font-size: 13px;
  input { width: 18px; height: 18px; }
  label { user-select: none; }
  a { color: #4f46e5; font-weight: 700; text-decoration: underline; }
`;

const ScrollArea = styled.div`
  max-height: 70vh;
  overflow: auto;
  padding-right: 4px;
`;

const TermsBody = styled.div`
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  word-break: break-word;
  color: #374151;
  font-size: 14px;
  line-height: 1.7;
`;

// Terms & Privacy content (provided)
const TERMS_TEXT = `제1조 (목적)

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
	3.	협의가 이루어지지 않을 경우, 서울중앙지방법원을 관할 법원으로 합니다.`;

const PRIVACY_TEXT = `# 🔒 ClassOn 개인정보처리방침
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
📍 **버전:** v1.0`;
