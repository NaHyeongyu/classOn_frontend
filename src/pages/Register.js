import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
// EN: 4-step onboarding wizard (basic info -> phone verify -> credentials -> academy)
// KO: 4단계 온보딩 위저드(기본정보 -> 휴대폰 인증 -> 계정설정 -> 학원정보)
import styled from "styled-components";
import { PrimaryBtnLg as UIPrimaryBtn } from "../components/common/UI";
import { Link, useNavigate } from "react-router-dom";
import { apiCheckEmail, apiCheckUsername, apiRequestPhoneCode, apiVerifyPhoneCode, apiCheckBizNo, apiOnboardComplete } from "../api/auth";
import { formatPhone } from "../lib/format";
export default function Register() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    // Step 1: 담당자 기본 정보 / Basic info
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [emailAvailable, setEmailAvailable] = useState(null);
    const [emailChecking, setEmailChecking] = useState(false);
    const [phone, setPhone] = useState("");
    // Step 2: 휴대전화 인증 / Phone verification
    const [code, setCode] = useState("");
    const [resendCooldown, setResendCooldown] = useState(0);
    const [devCodeHint, setDevCodeHint] = useState(null);
    useEffect(() => {
        const id = setInterval(() => setResendCooldown((n) => (n > 0 ? n - 1 : 0)), 1000);
        return () => clearInterval(id);
    }, []);
    // Step 3: 계정(아이디/비밀번호) / Credentials
    const [username, setUsername] = useState("");
    const [usernameAvailable, setUsernameAvailable] = useState(null);
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
    const [bizNoAvailable, setBizNoAvailable] = useState(null);
    const [address, setAddress] = useState("");
    const [repName, setRepName] = useState("");
    const [academyPhone, setAcademyPhone] = useState("");
    const [billingEmail, setBillingEmail] = useState("");
    // common
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    async function onEmailBlur() {
        if (!email)
            return;
        setEmailChecking(true);
        setEmailAvailable(null);
        try {
            const res = await apiCheckEmail(email);
            setEmailAvailable(res.available);
        }
        catch {
            setEmailAvailable(null);
        }
        finally {
            setEmailChecking(false);
        }
    }
    function maskBizNo(input) {
        const digits = input.replace(/\D/g, "").slice(0, 10);
        const p1 = digits.slice(0, 3);
        const p2 = digits.slice(3, 5);
        const p3 = digits.slice(5, 10);
        return { masked: [p1, p2, p3].filter(Boolean).join("-"), raw: digits };
    }
    async function onNextFromStep1(e) {
        e.preventDefault();
        setError(null);
        const emailValid = /.+@.+\..+/.test(email);
        if (!name || !emailValid || !phone) {
            setError("이메일/이름/휴대폰을 확인해 주세요.");
            return;
        }
        if (emailAvailable === false) {
            setError("이미 사용 중인 이메일입니다.");
            return;
        }
        try {
            const res = await apiRequestPhoneCode(phone);
            if (res.code)
                setDevCodeHint(res.code);
            setResendCooldown(60);
            setStep(2);
        }
        catch (e) {
            if (String(e?.message || "").includes("429"))
                setError("너무 많은 요청입니다. 잠시 후 다시 시도해 주세요.");
            else
                setError(e?.message || "인증코드 요청에 실패했습니다.");
        }
    }
    async function onVerifyCode(e) {
        e.preventDefault();
        setError(null);
        try {
            const res = await apiVerifyPhoneCode(phone, code);
            if (res.success)
                setStep(3);
            else
                setError("인증코드가 올바르지 않습니다.");
        }
        catch (e) {
            setError(e?.message || "전화번호 인증에 실패했습니다.");
        }
    }
    async function onResendCode() {
        if (resendCooldown > 0)
            return;
        setError(null);
        try {
            const res = await apiRequestPhoneCode(phone);
            if (res.code)
                setDevCodeHint(res.code);
            setResendCooldown(60);
        }
        catch (e) {
            if (String(e?.message || "").includes("429"))
                setError("너무 많은 요청입니다. 잠시 후 다시 시도해 주세요.");
            else
                setError(e?.message || "인증코드 요청에 실패했습니다.");
        }
    }
    async function onUsernameBlur() {
        if (!username)
            return;
        try {
            const r = await apiCheckUsername(username);
            setUsernameAvailable(r.available);
        }
        catch {
            setUsernameAvailable(null);
        }
    }
    async function onBizNoChange(value) {
        setBizNo(value);
        const { raw } = maskBizNo(value);
        if (raw.length === 10) {
            try {
                const res = await apiCheckBizNo(raw);
                setBizNoAvailable(res.available);
            }
            catch {
                setBizNoAvailable(null);
            }
        }
        else {
            setBizNoAvailable(null);
        }
    }
    async function onComplete(e) {
        e.preventDefault();
        setError(null);
        const { raw } = maskBizNo(bizNo);
        setLoading(true);
        try {
            await apiOnboardComplete({
                name,
                email,
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
        }
        catch (err) {
            setError(err?.message || "가입에 실패했습니다.");
        }
        finally {
            setLoading(false);
        }
    }
    return (_jsxs("div", { children: [_jsx(Title, { children: "\uACC4\uC815 \uB9CC\uB4E4\uAE30" }), step === 1 && (_jsxs(_Fragment, { children: [_jsx(Sub, { children: "\uB2F4\uB2F9\uC790 \uC815\uBCF4\uB97C \uC785\uB825\uD574 \uC8FC\uC138\uC694." }), _jsxs(Form, { onSubmit: onNextFromStep1, children: [_jsx(Label, { children: "\uB2F4\uB2F9\uC790 \uC774\uBA54\uC77C" }), _jsx(Input, { type: "email", value: email, onChange: (e) => setEmail(e.target.value), onBlur: onEmailBlur, placeholder: "you@example.com" }), emailChecking && _jsx(Hint, { children: "\uC774\uBA54\uC77C \uD655\uC778 \uC911..." }), emailAvailable === false && _jsx(Hint, { danger: true, children: "\uC774\uBBF8 \uC0AC\uC6A9 \uC911\uC778 \uC774\uBA54\uC77C\uC785\uB2C8\uB2E4." }), _jsx(Label, { children: "\uB2F4\uB2F9\uC790 \uC774\uB984" }), _jsx(Input, { value: name, onChange: (e) => setName(e.target.value), placeholder: "\uD64D\uAE38\uB3D9" }), _jsx(Label, { children: "\uD734\uB300\uD3F0" }), _jsx(Input, { value: phone, onChange: (e) => setPhone(e.target.value), placeholder: "01012345678" }), error && _jsx(ErrorText, { children: error }), _jsx(UIPrimaryBtn, { as: "button", type: "submit", children: "\uACC4\uC815 \uB9CC\uB4E4\uAE30" }), _jsx(SubCopy, { children: "\uAC00\uC785\uD558\uBA74 \uC57D\uAD00/\uAC1C\uC778\uC815\uBCF4 \uCC98\uB9AC\uBC29\uCE68\uC5D0 \uB3D9\uC758\uD569\uB2C8\uB2E4" })] })] })), step === 2 && (_jsxs(_Fragment, { children: [_jsx(Sub, { children: "\uC778\uC99D \uBC88\uD638\uB97C \uBCF4\uB0C8\uC5B4\uC694. 10\uBD84 \uB0B4 \uC785\uB825\uD574 \uC8FC\uC138\uC694." }), _jsxs(Form, { onSubmit: onVerifyCode, children: [_jsx(Label, { children: "\uD734\uB300\uD3F0 \uBC88\uD638" }), _jsxs(Row, { children: [_jsx(Input, { style: { flex: 1 }, value: formatPhone(phone), disabled: true }), _jsx(SmallButton, { type: "button", onClick: () => setStep(1), children: "\uBC88\uD638 \uBCC0\uACBD" })] }), _jsx(Label, { children: "\uC778\uC99D\uCF54\uB4DC" }), _jsxs(Row, { children: [_jsx(Input, { style: { flex: 1 }, value: code, onChange: (e) => setCode(e.target.value), placeholder: "6\uC790\uB9AC" }), _jsx(SmallButton, { type: "button", onClick: onResendCode, disabled: resendCooldown > 0, children: resendCooldown > 0 ? `${resendCooldown}s` : "재전송" })] }), devCodeHint && _jsxs(Hint, { children: ["\uAC1C\uBC1C\uC6A9 \uC778\uC99D\uCF54\uB4DC: ", devCodeHint] }), _jsx(Help, { children: "\uC2A4\uD338\uD568\uC744 \uD655\uC778\uD558\uACE0, \uBC1C\uC2E0 \uB3C4\uBA54\uC778\uC744 \uD654\uC774\uD2B8\uB9AC\uC2A4\uD2B8\uC5D0 \uCD94\uAC00\uD574 \uC8FC\uC138\uC694." }), error && _jsx(ErrorText, { children: error }), _jsx(UIPrimaryBtn, { as: "button", type: "submit", children: "\uB2E4\uC74C" })] })] })), step === 3 && (_jsxs(_Fragment, { children: [_jsx(Sub, { children: "\uC544\uC774\uB514\uC640 \uBE44\uBC00\uBC88\uD638\uB97C \uC124\uC815\uD574 \uC8FC\uC138\uC694." }), _jsxs(Form, { onSubmit: (e) => { e.preventDefault(); if (username && usernameAvailable !== false && pwRuleLen && pwRuleMix && password && password === password2)
                            setStep(4); }, children: [_jsx(Label, { children: "\uC544\uC774\uB514" }), _jsx(Input, { value: username, onChange: (e) => { setUsername(e.target.value); setUsernameAvailable(null); }, onBlur: onUsernameBlur, placeholder: "\uC544\uC774\uB514" }), usernameAvailable === true && _jsx(Hint, { success: true, children: "\uC0AC\uC6A9 \uAC00\uB2A5\uD55C \uC544\uC774\uB514\uC785\uB2C8\uB2E4." }), usernameAvailable === false && _jsx(Hint, { danger: true, children: "\uC774\uBBF8 \uC0AC\uC6A9\uC911\uC778 \uC544\uC774\uB514\uC785\uB2C8\uB2E4." }), _jsx(Label, { children: "\uBE44\uBC00\uBC88\uD638" }), _jsx(Input, { type: "password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: "8\u201364\uC790, \uBB38\uC790+\uC22B\uC790" }), _jsxs(Rules, { children: [_jsx(Rule, { ok: pwRuleLen, children: "8\u201364\uC790" }), _jsx(Rule, { ok: pwRuleMix, children: "\uBB38\uC790+\uC22B\uC790 \uD3EC\uD568" })] }), _jsx(Label, { children: "\uBE44\uBC00\uBC88\uD638 \uD655\uC778" }), _jsx(Input, { type: "password", value: password2, onChange: (e) => setPassword2(e.target.value), placeholder: "\uBE44\uBC00\uBC88\uD638 \uB2E4\uC2DC \uC785\uB825" }), password2 && password !== password2 && _jsx(Hint, { danger: true, children: "\uBE44\uBC00\uBC88\uD638\uAC00 \uC77C\uCE58\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4." }), error && _jsx(ErrorText, { children: error }), _jsx(UIPrimaryBtn, { as: "button", type: "submit", disabled: !username || usernameAvailable === false || !pwRuleLen || !pwRuleMix || !password || password !== password2, children: "\uB2E4\uC74C" })] })] })), step === 4 && (_jsxs(_Fragment, { children: [_jsx(Sub, { children: "\uD559\uC6D0 \uC815\uBCF4\uB97C \uC785\uB825\uD574 \uC8FC\uC138\uC694." }), _jsxs(Form, { onSubmit: onComplete, children: [_jsx(Label, { children: "\uD559\uC6D0\uBA85" }), _jsx(Input, { value: academyName, onChange: (e) => setAcademyName(e.target.value), placeholder: "\uC608: \uC624\uD508AI\uC5B4\uD559\uC6D0" }), _jsx(Label, { children: "\uC0AC\uC5C5\uC790\uBC88\uD638" }), _jsx(Input, { value: maskBizNo(bizNo).masked, onChange: (e) => void onBizNoChange(e.target.value), placeholder: "###-##-#####" }), bizNoAvailable === false && _jsx(Hint, { danger: true, children: "\uC774\uBBF8 \uAC00\uC785\uB41C \uC0AC\uC5C5\uC790\uBC88\uD638\uC785\uB2C8\uB2E4. \uC5F0\uACB0/\uBB38\uC758\uB97C \uC9C4\uD589\uD574 \uC8FC\uC138\uC694." }), _jsx(Label, { children: "\uC8FC\uC18C (\uC120\uD0DD)" }), _jsx(Input, { value: address, onChange: (e) => setAddress(e.target.value), placeholder: "\uB3C4\uB85C\uBA85 \uC8FC\uC18C" }), _jsx(Label, { children: "\uB300\uD45C\uC790\uBA85 (\uC120\uD0DD)" }), _jsx(Input, { value: repName, onChange: (e) => setRepName(e.target.value), placeholder: "\uB300\uD45C\uC790\uBA85" }), _jsx(Label, { children: "\uD559\uC6D0 \uB300\uD45C\uBC88\uD638 (\uC120\uD0DD)" }), _jsx(Input, { value: academyPhone, onChange: (e) => setAcademyPhone(e.target.value), placeholder: "021234567" }), _jsx(Label, { children: "\uCCAD\uAD6C\uC6A9 \uC774\uBA54\uC77C (\uC120\uD0DD)" }), _jsx(Input, { type: "email", value: billingEmail, onChange: (e) => setBillingEmail(e.target.value), placeholder: "billing@example.com" }), error && _jsx(ErrorText, { children: error }), _jsx(UIPrimaryBtn, { as: "button", type: "submit", disabled: loading || !academyName || !maskBizNo(bizNo).raw || usernameAvailable === false || !pwRuleLen || !pwRuleMix, children: loading ? "완료 중..." : "완료" })] })] })), _jsxs(Alt, { children: ["\uC774\uBBF8 \uACC4\uC815\uC774 \uC788\uC73C\uC2E0\uAC00\uC694? ", _jsx(Link, { to: "/login", children: "\uB85C\uADF8\uC778" })] })] }));
}
const Title = styled.h1 `
  margin: 0 0 12px;
  font-size: 30px;
  color: #111827;
  text-align: center;
`;
const Sub = styled.p `
  margin: 0 0 28px;
  color: #6b7280;
  font-size: 15px;
  text-align: center;
`;
const Form = styled.form `
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
const Rules = styled.div `
  display: flex;
  gap: 8px;
  font-size: 12px;
  color: #6b7280;
`;
const Rule = styled.span `
  color: ${(p) => (p.ok ? "#065f46" : "#6b7280")};
`;
const Row = styled.div `
  display: flex;
  gap: 10px;
  align-items: center;
`;
const Label = styled.label `
  font-size: 13px;
  color: #6b7280;
`;
const Input = styled.input `
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
`;
// Button from common UI
const SmallButton = styled.button `
  height: 54px;
  padding: 0 16px;
  border-radius: 14px;
  border: none;
  background: #eef2ff;
  color: #4f46e5;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s ease, box-shadow 0.15s ease;
  &:hover { background: #e0e7ff; }
  &:disabled { opacity: 0.7; cursor: not-allowed; }
`;
const Alt = styled.div `
  margin-top: 18px;
  color: #6b7280;
  font-size: 14px;
  a { color: #4f46e5; font-weight: 700; }
`;
const ErrorText = styled.div `
  color: #b91c1c;
  background: #fee2e2;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 14px;
`;
const Hint = styled.div `
  color: ${(p) => (p.danger ? "#b91c1c" : p.success ? "#065f46" : "#6b7280")};
  background: ${(p) => (p.danger ? "#fee2e2" : p.success ? "#d1fae5" : "#f3f4f6")};
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 12px;
`;
const SubCopy = styled.p `
  margin-top: 6px;
  color: #6b7280;
  font-size: 12px;
`;
const Help = styled.p `
  color: #6b7280;
  font-size: 12px;
`;
