import { useState, type FormEvent } from "react";
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
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!username || !password) {
      setError("아이디와 비밀번호를 입력해 주세요.");
      return;
    }
    setLoading(true);
    try {
      await login(username, password);
      const redirectTo = (location.state as any)?.from || "/";
      navigate(redirectTo, { replace: true });
    } catch (err: any) {
      setError(err?.message || "로그인에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <LogoHead>
        <img src="/logo/logo.svg" alt="Academy Manager 로고" />
      </LogoHead>
      <Title>로그인</Title>
      <Sub>계정에 접속하여 서비스를 이용하세요.</Sub>
      <Form onSubmit={onSubmit}>
        <Label>아이디</Label>
        <Input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="아이디를 입력하세요"
        />
        <Label>비밀번호</Label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
        {error && <ErrorText>{error}</ErrorText>}
        <UIPrimaryBtn as={"button" as any} type="submit" disabled={loading}>
          {loading ? "로그인 중..." : "로그인"}
        </UIPrimaryBtn>
      </Form>
      <Alt>
        계정이 없으신가요? <Link to="/register">회원가입</Link>
      </Alt>
    </div>
  );
}

const Title = styled.h1`
  margin: 0 0 12px;
  font-size: 30px;
  color: #111827;
`;
const LogoHead = styled.div`
  display: grid;
  place-items: center;
  margin: 20px 0 8px;
  img { height: 48px; width: auto; }
`;
const Sub = styled.p`
  margin: 0 0 24px;
  color: #6b7280;
  font-size: 15px;
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
const Label = styled.label`
  font-size: 13px;
  color: #6b7280;
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
  &::placeholder {
    color: #9ca3af;
  }
  &:focus {
    background: #eef2ff;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.18);
  }
`;
// Button from common UI
const Alt = styled.div`
  margin-top: 18px;
  color: #6b7280;
  font-size: 14px;
  a {
    color: #4f46e5;
    font-weight: 700;
  }
`;
const ErrorText = styled.div`
  color: #b91c1c;
  background: #fee2e2;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 14px;
`;
