import { useState } from 'react';
import styled, { css } from 'styled-components';
import { GhostButtonSmall } from '@/components/common/UI';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { createAdminUser } from '@/api/adminAuth';
import { routes } from '@/routes';
// Removed admin creation; only login remains

export default function AdminLogin() {
  const nav = useNavigate();
  const { login, loading } = useAdminAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  // Admin creation UI (bootstrap)
  const [createOpen, setCreateOpen] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [creating, setCreating] = useState(false);
  const [createMsg, setCreateMsg] = useState<string | null>(null);
  

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await login(username.trim(), password);
      nav(routes.admin, { replace: true });
    } catch (e: any) {
      setError(e?.message || '로그인에 실패했습니다.');
    }
  }

  async function onCreateAdmin(e: React.FormEvent) {
    e.preventDefault();
    setCreateMsg(null);
    setError(null);
    if (!newUsername || !newPassword) { setError('아이디와 비밀번호를 입력하세요.'); return; }
    setCreating(true);
    try {
      await createAdminUser({ username: newUsername.trim(), password: newPassword, name: newName || undefined, email: newEmail || undefined, phone: newPhone || undefined });
      setCreateMsg('관리자 계정이 생성되었습니다. 바로 로그인할 수 있습니다.');
      setUsername(newUsername.trim());
      setPassword(newPassword);
      // 안전을 위해 입력값은 유지하되, 필요 시 닫기만 수행
    } catch (e: any) {
      setError(e?.message || '관리자 계정 생성에 실패했습니다.');
    } finally {
      setCreating(false);
    }
  }

  return (
    <Wrap>
      <Card>
        <h2>관리자 로그인</h2>
        <p style={{ color:'#6b7280' }}>관리 전용 기능 접근을 위해 로그인하세요.</p>
        <Form onSubmit={onSubmit}>
          <label>아이디</label>
          <Input value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="admin@example.com" required />
          <label>비밀번호</label>
          <Input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="비밀번호" required />
          {error && <Err>{error}</Err>}
          <Actions>
            <GhostButtonSmall as="button" type="button" onClick={()=>nav(routes.admin)}>취소</GhostButtonSmall>
            <MonoPrimary type="submit" disabled={loading}>{loading ? '로그인 중…' : '로그인'}</MonoPrimary>
          </Actions>
        </Form>
        <Divider />
        <ToggleRow>
          <span>관리자 계정 만들기(부트스트랩)</span>
          <MonoGhost type="button" onClick={()=>setCreateOpen(v=>!v)}>{createOpen ? '닫기' : '열기'}</MonoGhost>
        </ToggleRow>
        {createOpen && (
          <Form onSubmit={onCreateAdmin}>
            <Hint>최초 1회는 로그인 없이 생성할 수 있어요. 이후에는 관리자 토큰이 필요합니다.</Hint>
            <label>아이디</label>
            <Input value={newUsername} onChange={(e)=>setNewUsername(e.target.value)} placeholder="예: skgusrb" required />
            <label>비밀번호</label>
            <Input type="password" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} placeholder="비밀번호" required />
            <label>이름(선택)</label>
            <Input value={newName} onChange={(e)=>setNewName(e.target.value)} placeholder="이름" />
            <label>이메일(선택)</label>
            <Input value={newEmail} onChange={(e)=>setNewEmail(e.target.value)} placeholder="이메일" />
            <label>전화번호(선택)</label>
            <Input value={newPhone} onChange={(e)=>setNewPhone(e.target.value)} placeholder="010-0000-0000" />
            {createMsg && <Ok>{createMsg}</Ok>}
            {error && <Err>{error}</Err>}
            <Actions>
              <MonoGhost as="button" type="button" onClick={()=>setCreateOpen(false)}>닫기</MonoGhost>
              <MonoPrimary type="submit" disabled={creating}>{creating ? '생성 중…' : '관리자 생성'}</MonoPrimary>
            </Actions>
          </Form>
        )}
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
const Hint = styled.div` color:#6b7280; font-size:12px; `;
const Ok = styled.div` color:#065f46; font-size:12px; `;
const Divider = styled.hr` border:none; height:1px; background:#f3f4f6; margin:8px 0; `;
const ToggleRow = styled.div` display:flex; align-items:center; justify-content:space-between; color:#6b7280; `;

const monoButtonBase = css`
  height: 40px; padding: 0 16px; border-radius: 10px; font-weight: 700; font-size: 14px; cursor: pointer; transition: background .15s ease, color .15s ease, border-color .15s ease;
`;
const MonoPrimary = styled.button`
  ${monoButtonBase};
  background: #111827; color: #fff; border:1px solid #111827;
  &:hover{ background:#000; border-color:#000; }
  &:disabled{ opacity:.6; cursor:not-allowed; }
`;
const MonoGhost = styled.button`
  ${monoButtonBase};
  background:#fff; color:#111827; border:1px solid #e5e7eb; &:hover{ background:#f9fafb; }
`;
