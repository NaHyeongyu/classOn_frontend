import type { FormEvent } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { StepPhoneForm } from "@/components/register/StepPhoneForm";
import { StepAccountForm } from "@/components/register/StepAccountForm";
import { StepPlanForm } from "@/components/register/StepPlanForm";
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

      {flow.step === 2 ? <StepAccountForm flow={flow} onSubmit={flow.handleAccountSubmit} /> : null}

      {flow.step === 3 ? <StepPlanForm flow={flow} onSubmit={onComplete} onBack={flow.backToAccount} /> : null}

      <Footer>
        이미 계정이 있으신가요? <Link to="/login">로그인</Link>
      </Footer>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 24px 24px 48px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const Title = styled.h1`
  margin: 0 0 12px;
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
