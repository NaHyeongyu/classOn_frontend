import { useEffect, useState, type FormEvent } from "react";
// EN: 4-step onboarding wizard (basic info -> phone verify -> credentials -> academy)
// KO: 4단계 온보딩 위저드(기본정보 -> 휴대폰 인증 -> 계정설정 -> 학원정보)
import styled from "styled-components";
import {
  PrimaryBtnLg as UIPrimaryBtn,
  buttonVariants,
} from "../components/common/UI";
import { Link, useNavigate } from "react-router-dom";
import { apiCheckUsername, apiRequestPhoneCode, apiVerifyPhoneCode, apiCheckBizNo, apiOnboardComplete } from "@/api/auth";
import { formatPhone } from "@/lib/format";

export default function Register() {
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: 담당자 기본 정보 / Basic info
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // Step 2: 휴대전화 인증 / Phone verification
  const [code, setCode] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [devCodeHint, setDevCodeHint] = useState<string | null>(null);

  useEffect(() => {
    const id = setInterval(() => setResendCooldown((n) => (n > 0 ? n - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);

  // Step 3: 계정(아이디/비밀번호) / Credentials
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

  // Step 4: 학원 정보 / Academy info
  const [academyName, setAcademyName] = useState("");
  const [bizNo, setBizNo] = useState("");
  const [bizNoAvailable, setBizNoAvailable] = useState<boolean | null>(null);
  const [address, setAddress] = useState("");
  const [repName, setRepName] = useState("");
  const [academyPhone, setAcademyPhone] = useState("");
  const [billingEmail, setBillingEmail] = useState("");

  // common
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Inline field errors per step
  const [step1Err, setStep1Err] = useState<{ name?: string; phone?: string }>({});
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
    const nextErr: { name?: string; phone?: string } = {};
    if (!name.trim()) nextErr.name = "이름은 필수입니다.";
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

  async function onComplete(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const { raw } = maskBizNo(bizNo);
    setLoading(true);
    try {
      await apiOnboardComplete({
        name,
        phone,
        username,
        password,
        academyName,
        bizNo: raw,
        address,
        representativeName: repName,
        academyPhone,
        billingEmail,
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
          <Sub>담당자 정보를 입력해 주세요.</Sub>
          <Form onSubmit={onNextFromStep1}>
            <Label>담당자 이름<span>*</span></Label>
            <Input value={name} onChange={(e) => { setName(e.target.value); if (step1Err.name) setStep1Err(s => ({ ...s, name: undefined })); }} placeholder="홍길동" aria-invalid={!!step1Err.name} required />

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
            {step1Err.name && <Hint danger>{step1Err.name}</Hint>}
            {step1Err.phone && <Hint danger>{step1Err.phone}</Hint>}

            {error && <ErrorText>{error}</ErrorText>}
            <UIPrimaryBtn as={"button" as any} type="submit">계정 만들기</UIPrimaryBtn>
            <SubCopy>가입하면 약관/개인정보 처리방침에 동의합니다</SubCopy>
          </Form>
        </>
      )}
      {step === 2 && (
        <>
          <Sub>인증 번호를 보냈어요. 10분 내 입력해 주세요.</Sub>
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
          <Sub>아이디와 비밀번호를 설정해 주세요.</Sub>
          <Form onSubmit={(e) => { e.preventDefault(); if (username && usernameAvailable !== false && pwRuleLen && pwRuleMix && password && password === password2) setStep(4); }}>
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

            {error && <ErrorText>{error}</ErrorText>}
            <UIPrimaryBtn as={"button" as any} type="submit" disabled={!username || usernameAvailable === false || !pwRuleLen || !pwRuleMix || !password || password !== password2}>다음</UIPrimaryBtn>
          </Form>
        </>
      )}
      {step === 4 && (
        <>
          <Sub>학원 정보를 입력해 주세요.</Sub>
          <Form onSubmit={onComplete}>
            <Label>학원명<span>*</span></Label>
            <Input value={academyName} onChange={(e) => setAcademyName(e.target.value)} placeholder="예: 오픈AI어학원" aria-invalid={academyName !== '' && !academyName} required />

            <Label>사업자번호<span>*</span></Label>
            <Input value={maskBizNo(bizNo).masked} onChange={(e) => void onBizNoChange(e.target.value)} placeholder="###-##-#####" aria-invalid={maskBizNo(bizNo).raw.length > 0 && (maskBizNo(bizNo).raw.length !== 10 || bizNoAvailable === false)} required />
            {bizNoAvailable === false && <Hint danger>이미 가입된 사업자번호입니다. 연결/문의를 진행해 주세요.</Hint>}

            <Label>주소 (선택)</Label>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="도로명 주소" />

            <Label>대표자명 (선택)</Label>
            <Input value={repName} onChange={(e) => setRepName(e.target.value)} placeholder="대표자명" />

            <Label>학원 대표번호 (선택)</Label>
            <Input value={academyPhone} onChange={(e) => setAcademyPhone(e.target.value)} placeholder="021234567" />

            <Label>청구용 이메일 (선택)</Label>
            <Input type="email" value={billingEmail} onChange={(e) => setBillingEmail(e.target.value)} placeholder="billing@example.com" />

            {error && <ErrorText>{error}</ErrorText>}
            <UIPrimaryBtn as={"button" as any} type="submit" disabled={loading || !academyName || !maskBizNo(bizNo).raw || usernameAvailable === false || !pwRuleLen || !pwRuleMix}>
              {loading ? "완료 중..." : "완료"}
            </UIPrimaryBtn>
          </Form>
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
