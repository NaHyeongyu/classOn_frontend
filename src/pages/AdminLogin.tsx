import { useState } from 'react';
import styled, { css } from 'styled-components';
import { GhostButtonSmall } from '@/components/common/UI';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { readableError } from '@/lib/errors';
import { routes } from '@/routes';
// Removed admin creation; only login remains

export default function AdminLogin() {
  const nav = useNavigate();
  const { login, loading } = useAdminAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await login(username.trim(), password);
      nav(routes.admin, { replace: true });
    } catch (e) {
      setError(readableError(e, '로그인에 실패했습니다.'));
    }
  }


  return (
    <Wrap>
      <Card>
        <h2>관리자 로그인</h2>
        <p style={{ color:'#6b7280' }}>관리 전용 기능 접근을 위해 로그인하세요.</p>
        <Form onSubmit={onSubmit}>
          <label>아이디</label>
          <Input value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="classonadmin" required />
          <label>비밀번호</label>
          <Input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="비밀번호" required />
          {error && <Err>{error}</Err>}
          <Actions>
            <GhostButtonSmall as="button" type="button" onClick={()=>nav(routes.admin)}>취소</GhostButtonSmall>
            <MonoPrimary type="submit" disabled={loading}>{loading ? '로그인 중…' : '로그인'}</MonoPrimary>
          </Actions>
        </Form>
      </Card>
    </Wrap>
  );
}

const Wrap = styled.div` min-height: 60vh; display:grid; place-items:center; background:#fff; `;
const Card = styled.div` width:100%; max-width:540px; border:1px solid #e5e7eb; border-radius:16px; padding:20px; background:#fff; display:grid; gap:14px; `;
const Form = styled.form` display:grid; gap:10px; `;
const Input = styled.input` height:42px; border:1px solid #e5e7eb; border-radius:10px; padding:0 12px; font-size:14px; background:#fff; color:#111827; `;
const Actions = styled.div` display:flex; justify-content:flex-end; gap:8px; `;
const Err = styled.div` color:#b91c1c; font-size:13px; `;

const monoButtonBase = css`
  height: 40px; padding: 0 16px; border-radius: 10px; font-weight: 700; font-size: 14px; cursor: pointer; transition: background .15s ease, color .15s ease, border-color .15s ease;
`;
const MonoPrimary = styled.button`
  ${monoButtonBase};
  background: #111827; color: #fff; border:1px solid #111827;
  &:hover{ background:#000; border-color:#000; }
  &:disabled{ opacity:.6; cursor:not-allowed; }
`;
/* MonoGhost removed (unused) */
