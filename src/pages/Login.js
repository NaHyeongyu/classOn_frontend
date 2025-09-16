import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
// EN: Username/password login page
// KO: 아이디/비밀번호 로그인 화면
import styled from "styled-components";
import { PrimaryBtnLg as UIPrimaryBtn } from "../components/common/UI";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    async function onSubmit(e) {
        e.preventDefault();
        setError(null);
        if (!username || !password) {
            setError("아이디와 비밀번호를 입력해 주세요.");
            return;
        }
        setLoading(true);
        try {
            await login(username, password);
            const redirectTo = location.state?.from || "/";
            navigate(redirectTo, { replace: true });
        }
        catch (err) {
            setError(err?.message || "로그인에 실패했습니다.");
        }
        finally {
            setLoading(false);
        }
    }
    return (_jsxs("div", { children: [_jsx(LogoHead, { children: _jsx("img", { src: "/logo/logo.svg", alt: "Academy Manager \uB85C\uACE0" }) }), _jsx(Title, { children: "\uB85C\uADF8\uC778" }), _jsx(Sub, { children: "\uACC4\uC815\uC5D0 \uC811\uC18D\uD558\uC5EC \uC11C\uBE44\uC2A4\uB97C \uC774\uC6A9\uD558\uC138\uC694." }), _jsxs(Form, { onSubmit: onSubmit, children: [_jsx(Label, { children: "\uC544\uC774\uB514" }), _jsx(Input, { type: "text", value: username, onChange: (e) => setUsername(e.target.value), placeholder: "\uC544\uC774\uB514\uB97C \uC785\uB825\uD558\uC138\uC694" }), _jsx(Label, { children: "\uBE44\uBC00\uBC88\uD638" }), _jsx(Input, { type: "password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" }), error && _jsx(ErrorText, { children: error }), _jsx(UIPrimaryBtn, { as: "button", type: "submit", disabled: loading, children: loading ? "로그인 중..." : "로그인" })] }), _jsxs(Alt, { children: ["\uACC4\uC815\uC774 \uC5C6\uC73C\uC2E0\uAC00\uC694? ", _jsx(Link, { to: "/register", children: "\uD68C\uC6D0\uAC00\uC785" })] })] }));
}
const Title = styled.h1 `
  margin: 0 0 12px;
  font-size: 30px;
  color: #111827;
`;
const LogoHead = styled.div `
  display: grid;
  place-items: center;
  margin: 20px 0 8px;
  img { height: 48px; width: auto; }
`;
const Sub = styled.p `
  margin: 0 0 24px;
  color: #6b7280;
  font-size: 15px;
`;
const Form = styled.form `
  display: flex;
  flex-direction: column;
  gap: 16px;
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
  &::placeholder {
    color: #9ca3af;
  }
  &:focus {
    background: #eef2ff;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.18);
  }
`;
// Button from common UI
const Alt = styled.div `
  margin-top: 18px;
  color: #6b7280;
  font-size: 14px;
  a {
    color: #4f46e5;
    font-weight: 700;
  }
`;
const ErrorText = styled.div `
  color: #b91c1c;
  background: #fee2e2;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 14px;
`;
