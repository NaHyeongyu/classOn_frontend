import type { FormEvent } from "react";
import { useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { StepPhoneForm } from "@/components/register/StepPhoneForm";
import { StepVerifyForm } from "@/components/register/StepVerifyForm";
import { StepAccountForm } from "@/components/register/StepAccountForm";
import { StepPlanForm } from "@/components/register/StepPlanForm";
import { StepSettlementAccountForm } from "@/components/register/StepSettlementAccountForm";
import type { UseRegisterFlowResult } from "@/features/register/useRegisterFlow";

type RegisterPageViewProps = {
  flow: UseRegisterFlowResult;
  onComplete: (event: FormEvent<HTMLFormElement>) => Promise<void> | void;
};

export function RegisterPageView({ flow, onComplete }: RegisterPageViewProps) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const id = window.requestAnimationFrame(() => {
      const el = document.scrollingElement ?? document.documentElement;
      el.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
    return () => window.cancelAnimationFrame(id);
  }, [flow.step]);

  return (
    <PageWrapper>
      <RegisterCard>
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

        {flow.step === 5 ? (
          <StepSettlementAccountForm flow={flow} onSubmit={onComplete} onBack={flow.backToPlan} />
        ) : null}

        {flow.step === 6 ? (
          <PendingWrap>
            <PendingTitle>정산 계좌 인증</PendingTitle>
            <PendingDesc>
              입력한 정보가 토스페이먼츠로 전달되었습니다.
              <br />
              인증을 완료하고 로그인 진행해 주세요.
            </PendingDesc>
            <PendingActions>
              <LinkButton to="/login">로그인으로 이동</LinkButton>
            </PendingActions>
          </PendingWrap>
        ) : null}

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

const PendingWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-width: 560px;
  margin: 0 auto;
  padding: 20px 18px;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.lg};
  background: ${(p) => p.theme.colors.surfaceAlt};
`;

const PendingTitle = styled.h2`
  margin: 0;
  font-size: ${(p) => p.theme.font.size.lg};
  font-weight: ${(p) => p.theme.font.weight.bold};
  color: ${(p) => p.theme.colors.text};
`;

const PendingDesc = styled.p`
  margin: 0;
  color: ${(p) => p.theme.colors.textMuted};
  line-height: 1.6;
  font-size: ${(p) => p.theme.font.size.sm};
`;

const PendingActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  flex-wrap: wrap;
`;

const LinkButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 14px;
  border-radius: ${(p) => p.theme.radii.md};
  background: ${(p) => p.theme.colors.primary};
  color: white;
  font-weight: ${(p) => p.theme.font.weight.semiBold};
  text-decoration: none;
  &:hover {
    filter: brightness(0.98);
  }
`;
