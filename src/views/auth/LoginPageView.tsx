import ConfirmDialog from "@/components/common/ConfirmDialog";
import { LoginFindIdModal } from "@/components/auth/LoginFindIdModal";
import { LoginResetPasswordModal } from "@/components/auth/LoginResetPasswordModal";
import type { UseLoginPageResult } from "@/features/auth/hooks/useLoginPage";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { PrimaryButtonLg, ToggleSwitch } from "@/components/common/UI";
import { Input as BaseInput, Label } from "@/components/common/Input";

export function LoginPageView({ form, dialog, findIdModal, resetModal }: UseLoginPageResult) {
  return (
    <PageWrapper>
      <LoginCard>
        <LogoHead>
          <img src="/logo/logo.svg" alt="Academy Manager 로고" />
        </LogoHead>
        <Header>
          <Title>로그인</Title>
          <Sub>계정에 접속하여 서비스를 이용하세요.</Sub>
        </Header>
        <Form onSubmit={form.onSubmit}>
          <Field>
            <Label>
              아이디<span>*</span>
            </Label>
            <LoginInput
              type="text"
              value={form.username}
              onChange={(event) => form.setUsername(event.target.value)}
              placeholder="아이디를 입력하세요"
              required
              aria-invalid={form.submitted && !form.username.trim()}
            />
          </Field>
          <Field>
            <Label>
              비밀번호<span>*</span>
            </Label>
            <LoginInput
              type="password"
              value={form.password}
              onChange={(event) => form.setPassword(event.target.value)}
              placeholder="••••••••"
              required
              aria-invalid={form.submitted && !form.password.trim()}
            />
          </Field>
          <OptionsRow>
            <ToggleSwitch>
              <input
                type="checkbox"
                checked={form.rememberId}
                onChange={(event) => form.setRememberId(event.currentTarget.checked)}
                disabled={form.loading}
              />
              <span className="switch" aria-hidden="true" />
              <span className="text">아이디 저장</span>
            </ToggleSwitch>
          </OptionsRow>
          <LoginButton type="submit" disabled={form.loading}>
            {form.loading ? "로그인 중..." : "로그인"}
          </LoginButton>
        </Form>
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
        {/*
          <DesktopDownloadRow>
            <Link to="/desktop?auto=1">데스크탑 앱 다운로드</Link>
          </DesktopDownloadRow>
        */}
      </LoginCard>

      <ConfirmDialog
        open={dialog.open}
        title="로그인 실패"
        message={dialog.message}
        hideCancel
        onCancel={dialog.close}
        onConfirm={dialog.close}
      />
      <LoginFindIdModal
        modal={findIdModal}
        onSelectReset={resetModal.openFromFind}
        ref={findIdModal.phoneRef}
      />
      <LoginResetPasswordModal modal={resetModal} ref={resetModal.phoneRef} />
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(p) => p.theme.colors.surface};
  padding: ${(p) => p.theme.spacing.md};
`;

const LoginCard = styled.div`
  width: 100%;
  max-width: 520px;
  background: transparent;
  padding: 48px 40px;
  display: flex;
  flex-direction: column;
  align-items: stretch;

  @media (max-width: 480px) {
    padding: 32px 24px;
  }
`;

const LogoHead = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 32px;
  img {
    height: 40px;
    width: auto;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  margin: 0 0 8px;
  font-size: 32px;
  font-weight: 800;
  color: ${(p) => p.theme.colors.text};
  letter-spacing: -0.02em;
`;

const Sub = styled.p`
  margin: 0;
  color: ${(p) => p.theme.colors.textMuted};
  font-size: ${(p) => p.theme.font.size.lg};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 8px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
`;

const LoginInput = styled(BaseInput)`
  height: 52px;
  border-radius: ${(p) => p.theme.radii.lg};
  border: 1px solid ${(p) => p.theme.colors.borderMuted};
  padding: 0 ${(p) => p.theme.spacing.md};
  background: ${(p) => p.theme.colors.surface};
  &:focus {
    border-color: ${(p) => p.theme.colors.primary};
    background: ${(p) => p.theme.colors.surface};
  }
`;

const LoginButton = styled(PrimaryButtonLg)`
  width: 100%;
  margin-top: 12px;
  border-radius: ${(p) => p.theme.radii.lg};
`;

const OptionsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 2px;
`;

const Footer = styled.div`
  margin-top: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${(p) => p.theme.colors.textMuted};
  a {
    color: ${(p) => p.theme.colors.primary};
    font-weight: 600;
    margin-left: 4px;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const FooterLeft = styled.div`
  display: flex;
  align-items: center;
`;

const FooterActions = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  button {
    border: none;
    background: transparent;
    color: ${(p) => p.theme.colors.textMuted};
    font-size: ${(p) => p.theme.font.size.sm};
    cursor: pointer;
    padding: 0;
    transition: color 0.2s;
    &:hover {
      color: ${(p) => p.theme.colors.text};
      text-decoration: underline;
    }
  }
`;

const LinkDivider = styled.span`
  width: 1px;
  height: 10px;
  background: ${(p) => p.theme.colors.border};
  display: inline-block;
`;

// const DesktopDownloadRow = styled.div`
//   margin-top: 18px;
//   text-align: center;
//   a {
//     color: ${(p) => p.theme.colors.textMuted};
//     font-size: ${(p) => p.theme.font.size.sm};
//     text-decoration: none;
//     font-weight: 600;
//     &:hover {
//       color: ${(p) => p.theme.colors.text};
//       text-decoration: underline;
//     }
//   }
// `;
