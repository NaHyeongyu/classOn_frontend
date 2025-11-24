import ConfirmDialog from "@/components/common/ConfirmDialog";
import { LoginFindIdModal } from "@/components/auth/LoginFindIdModal";
import { LoginResetPasswordModal } from "@/components/auth/LoginResetPasswordModal";
import type { UseLoginPageResult } from "@/features/auth/hooks/useLoginPage";
import { Link } from "react-router-dom";
import styled from "styled-components";

export function LoginPageView({ form, dialog, findIdModal, resetModal }: UseLoginPageResult) {
  return (
    <Container>
      <LogoHead>
        <img src="/logo/logo.svg" alt="Academy Manager 로고" />
      </LogoHead>
      <Title>로그인</Title>
      <Sub>계정에 접속하여 서비스를 이용하세요.</Sub>
      <Form onSubmit={form.onSubmit}>
        <Label>
          아이디<span>*</span>
        </Label>
        <Input
          type="text"
          value={form.username}
          onChange={(event) => form.setUsername(event.target.value)}
          placeholder="아이디를 입력하세요"
          required
          aria-invalid={form.submitted && !form.username.trim()}
        />
        <Label>
          비밀번호<span>*</span>
        </Label>
        <Input
          type="password"
          value={form.password}
          onChange={(event) => form.setPassword(event.target.value)}
          placeholder="••••••••"
          required
          aria-invalid={form.submitted && !form.password.trim()}
        />
        <PrimaryButton type="submit" disabled={form.loading}>
          {form.loading ? "로그인 중..." : "로그인"}
        </PrimaryButton>
      </Form>
      <ConfirmDialog
        open={dialog.open}
        title="로그인 실패"
        message={dialog.message}
        hideCancel
        onCancel={dialog.close}
        onConfirm={dialog.close}
      />
      <Footer>
        <FooterLeft>
          계정이 없으신가요? <Link to="/register">회원가입</Link>
        </FooterLeft>
        <FooterActions>
          <button type="button" onClick={findIdModal.openModal}>
            아이디 찾기
          </button>
          <LinkDivider />
          <button type="button" onClick={() => resetModal.openModal()}>
            비밀번호 찾기
          </button>
        </FooterActions>
      </Footer>

      <LoginFindIdModal
        modal={findIdModal}
        onSelectReset={resetModal.openFromFind}
        ref={findIdModal.phoneRef}
      />
      <LoginResetPasswordModal modal={resetModal} ref={resetModal.phoneRef} />
    </Container>
  );
}

const Container = styled.div`
  padding: 48px 16px 64px;
  max-width: 480px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const LogoHead = styled.div`
  display: grid;
  place-items: center;
  margin: 20px 0 8px;
  img {
    height: 48px;
    width: auto;
  }
`;

const Title = styled.h1`
  margin: 0 0 12px;
  font-size: 30px;
  color: #111827;
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
  span {
    color: #ef4444;
    margin-left: 4px;
  }
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
  &[aria-invalid="true"] {
    background: #fee2e2;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.18);
  }
`;

const PrimaryButton = styled.button`
  border: none;
  height: 48px;
  border-radius: 4px;
  background: #1a73e8;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
  &:hover {
    background: #1765cc;
    box-shadow: 0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15);
  }
  &:disabled {
    background: #e8eaed;
    color: #9aa0a6;
    cursor: not-allowed;
    box-shadow: none;
  }
`;


const Footer = styled.div`
  margin-top: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  color: #6b7280;
  a {
    color: #4f46e5;
    font-weight: 700;
  }
`;

const FooterLeft = styled.span``;

const FooterActions = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  button {
    border: none;
    background: transparent;
    color: #4f46e5;
    font-weight: 600;
    cursor: pointer;
    padding: 0;
  }
  button:hover {
    text-decoration: underline;
  }
`;

const LinkDivider = styled.span`
  width: 1px;
  height: 12px;
  background: #cbd5f5;
  display: inline-block;
`;
