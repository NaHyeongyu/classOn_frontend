import type { FormEvent } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { StepPhoneForm } from "@/components/register/StepPhoneForm";
import { StepVerifyForm } from "@/components/register/StepVerifyForm";
import { StepAccountForm } from "@/components/register/StepAccountForm";
import type { UseRegisterFlowResult } from "@/features/register/useRegisterFlow";

type RegisterPageViewProps = {
  flow: UseRegisterFlowResult;
  onComplete: (event: FormEvent<HTMLFormElement>) => Promise<void> | void;
};

export function RegisterPageView({ flow, onComplete }: RegisterPageViewProps) {
  return (
    <Wrapper>
      <Title>계정 만들기</Title>

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

      {flow.step === 3 ? <StepAccountForm flow={flow} onSubmit={onComplete} /> : null}

      <Footer>
        이미 계정이 있으신가요? <Link to="/login">로그인</Link>
      </Footer>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  max-width: 480px;
  margin: 0 auto;
  padding: 48px 16px 64px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const Title = styled.h1`
  margin: 0 0 20px;
  font-size: 30px;
  color: #111827;
  text-align: center;
`;

const Footer = styled.div`
  margin-top: 24px;
  text-align: center;
  font-size: 14px;
  color: #6b7280;
  a {
    color: #4f46e5;
    font-weight: 700;
  }
`;
