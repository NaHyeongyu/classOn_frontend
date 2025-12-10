import type { FormEvent } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { StepPhoneForm } from "@/components/register/StepPhoneForm";
import { StepVerifyForm } from "@/components/register/StepVerifyForm";
import { StepAccountForm } from "@/components/register/StepAccountForm";
import { StepPlanForm } from "@/components/register/StepPlanForm";
import type { UseRegisterFlowResult } from "@/features/register/useRegisterFlow";

type RegisterPageViewProps = {
  flow: UseRegisterFlowResult;
  onComplete: (event: FormEvent<HTMLFormElement>) => Promise<void> | void;
};

export function RegisterPageView({ flow, onComplete }: RegisterPageViewProps) {
  return (
    <PageWrapper>
      <RegisterCard>
        <Header>
          <Title>계정 만들기</Title>
          <Sub>학원 관리를 위한 첫 걸음을 시작하세요.</Sub>
        </Header>

        {flow.step === 1 ? (
          <StepPhoneForm
            phone={flow.phone}
            setPhone={flow.setPhone}
            normalizeMobile={flow.normalizeMobile}
            onSubmit={flow.handleStep1Submit}
            stepError={flow.step1Err.phone}
            error={flow.error}
          />
        ) : null}

        {flow.step === 2 ? (
          <StepVerifyForm
            phone={flow.phone}
            code={flow.code}
            setCode={flow.setCode}
            resendCooldown={flow.resendCooldown}
            onResendCode={flow.handleResendCode}
            onSubmit={flow.handleCodeSubmit}
            onBackToPhone={flow.backToStep1}
            devCodeHint={flow.devCodeHint}
            stepError={flow.step2Err.code}
            error={flow.error}
          />
        ) : null}

        {flow.step === 3 ? <StepAccountForm flow={flow} onSubmit={flow.handleAccountSubmit} /> : null}

        {flow.step === 4 ? <StepPlanForm flow={flow} onSubmit={onComplete} onBack={flow.backToAccount} /> : null}

        <Footer>
          이미 계정이 있으신가요? <Link to="/login">로그인</Link>
        </Footer>
      </RegisterCard>
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

const RegisterCard = styled.div`
  width: 100%;
  max-width: 1120px; /* Slightly wider to fit plan cards comfortably in one row */
  background: transparent;
  padding: 48px 40px;
  display: flex;
  flex-direction: column;
  align-items: stretch;

  @media (max-width: 640px) {
    padding: 32px 24px;
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

const Footer = styled.div`
  margin-top: 32px;
  text-align: center;
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
