import { useState, type FormEvent } from "react";
// EN: Username/password login page
// KO: 아이디/비밀번호 로그인 화면
import styled from "styled-components";
import { PrimaryBtnLg as UIPrimaryBtn } from "@/components/common/UI";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errOpen, setErrOpen] = useState(false);
  const [errMsg, setErrMsg] = useState<string>("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!username || !password) {
      setErrMsg("아이디와 비밀번호를 입력해 주세요.");
      setErrOpen(true);
      return;
    }
    setLoading(true);
    try {
      await login(username, password);
      const redirectTo = (location.state as any)?.from || "/";
      navigate(redirectTo, { replace: true });
    } catch (err: any) {
      setErrMsg(readableLoginError(err));
      setErrOpen(true);
    } finally {
      setLoading(false);
    }
  }

  function readableLoginError(e: unknown): string {
    const fallback = "로그인에 실패했습니다.";
    const status = (e && typeof e === 'object' && 'status' in e) ? Number((e as any).status) : undefined;
    const msg = (e && typeof e === 'object' && 'message' in e) ? String((e as any).message) : String(e ?? '');
    const lc = msg.toLowerCase();
    if (status === 401) return '아이디 또는 비밀번호가 올바르지 않습니다.';
    if (status === 403) return '접근이 거부되었습니다.';
    if (status === 429) return '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.';
    if (status && status >= 500) return '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
    if (lc.includes('401')) return '아이디 또는 비밀번호가 올바르지 않습니다.';
    if (lc.includes('403')) return '접근이 거부되었습니다.';
    if (lc.includes('429')) return '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.';
    if (lc.includes('abort') || lc.includes('timeout')) return '서버 응답이 지연되고 있습니다. 잠시 후 다시 시도해 주세요.';
    if (lc.includes('network') || lc.includes('failed to fetch')) return '네트워크 연결을 확인해 주세요.';
    if (lc.includes('500')) return '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
    // Try to find a human-friendly message tail if present
    const parts = msg.split('\n').filter(Boolean);
    if (parts.length > 1) return parts.slice(-1)[0].trim() || fallback;
    return fallback;
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
        <UIPrimaryBtn as={"button" as any} type="submit" disabled={loading}>
          {loading ? "로그인 중..." : "로그인"}
        </UIPrimaryBtn>
      </Form>
      <ConfirmDialog
        open={errOpen}
        title="로그인 실패"
        message={errMsg}
        hideCancel
        onCancel={() => setErrOpen(false)}
        onConfirm={() => setErrOpen(false)}
      />
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
// Inline 오류 박스는 토스트/모달로 대체되어 제거
