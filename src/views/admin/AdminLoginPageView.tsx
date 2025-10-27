import type { FormEvent } from "react";
import styled, { css } from "styled-components";
import { GhostButtonSmall } from "@/components/common/UI";

type AdminLoginPageViewProps = {
  username: string;
  password: string;
  loading: boolean;
  error: string | null;
  onChangeUsername: (value: string) => void;
  onChangePassword: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
};

export function AdminLoginPageView({
  username,
  password,
  loading,
  error,
  onChangeUsername,
  onChangePassword,
  onSubmit,
  onCancel,
}: AdminLoginPageViewProps) {
  return (
    <Wrap>
      <Card>
        <h2>관리자 로그인</h2>
        <p style={{ color: "#6b7280" }}>관리 전용 기능 접근을 위해 로그인하세요.</p>
        <Form onSubmit={onSubmit}>
          <label htmlFor="admin-login-username">아이디</label>
          <Input
            id="admin-login-username"
            value={username}
            onChange={(event) => onChangeUsername(event.target.value)}
            placeholder="classonadmin"
            required
          />
          <label htmlFor="admin-login-password">비밀번호</label>
          <Input
            id="admin-login-password"
            type="password"
            value={password}
            onChange={(event) => onChangePassword(event.target.value)}
            placeholder="비밀번호"
            required
          />
          {error ? <ErrorMessage role="alert">{error}</ErrorMessage> : null}
          <Actions>
            <GhostButtonSmall as="button" type="button" onClick={onCancel}>
              취소
            </GhostButtonSmall>
            <MonoPrimary type="submit" disabled={loading}>
              {loading ? "로그인 중…" : "로그인"}
            </MonoPrimary>
          </Actions>
        </Form>
      </Card>
    </Wrap>
  );
}

const Wrap = styled.div`
  min-height: 60vh;
  display: grid;
  place-items: center;
  background: #fff;
`;

const Card = styled.div`
  width: 100%;
  max-width: 540px;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 20px;
  background: #fff;
  display: grid;
  gap: 14px;
`;

const Form = styled.form`
  display: grid;
  gap: 10px;
`;

const Input = styled.input`
  height: 42px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 12px;
  font-size: 14px;
  background: #fff;
  color: #111827;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const ErrorMessage = styled.div`
  color: #b91c1c;
  font-size: 13px;
`;

const monoButtonBase = css`
  height: 40px;
  padding: 0 16px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition:
    background 0.15s ease,
    color 0.15s ease,
    border-color 0.15s ease;
`;

const MonoPrimary = styled.button`
  ${monoButtonBase};
  background: #111827;
  color: #fff;
  border: 1px solid #111827;

  &:hover {
    background: #000;
    border-color: #000;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
