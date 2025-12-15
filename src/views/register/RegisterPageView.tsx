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
import { LoadingSpinner } from "@/components/common/Loading";

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
            <PendingTitle>정산 계좌 인증 대기</PendingTitle>
            <PendingDesc>
              입력한 정보가 토스페이먼츠로 전달되었습니다.
              <br />
              등록한 이메일/휴대폰에서 인증을 완료한 뒤 로그인해 주세요.
            </PendingDesc>
            <PendingMeta>
              <div>
                <span className="label">등록 이메일</span>
                <span className="value">{flow.settlementRegistration?.email || "-"}</span>
              </div>
              <div>
                <span className="label">토스 셀러 ID</span>
                <span className="value">{flow.settlementRegistration?.tossSellerId || "-"}</span>
              </div>
              <div>
                <span className="label">상태</span>
                <span className="value">{flow.settlementRegistration?.status || "PENDING"}</span>
              </div>
            </PendingMeta>
            <PendingHint>
              <li>스팸메일함도 함께 확인해 주세요.</li>
              <li>인증 완료 후 로그인하면 “정산 계좌 등록”이 승인 상태로 반영됩니다.</li>
            </PendingHint>
            <PendingActions>
              <SpinnerBox>
                <LoadingSpinner />
                <span>인증 완료 후 로그인해 주세요</span>
              </SpinnerBox>
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

const PendingMeta = styled.div`
  display: grid;
  gap: 10px;
  padding: 12px 12px;
  border-radius: ${(p) => p.theme.radii.md};
  border: 1px solid ${(p) => p.theme.colors.borderMuted};
  background: ${(p) => p.theme.colors.surface};
  .label {
    font-size: ${(p) => p.theme.font.size.xs};
    color: ${(p) => p.theme.colors.textMuted};
    font-weight: ${(p) => p.theme.font.weight.semiBold};
    margin-right: 10px;
  }
  .value {
    font-size: ${(p) => p.theme.font.size.sm};
    color: ${(p) => p.theme.colors.text};
    font-weight: ${(p) => p.theme.font.weight.semiBold};
    word-break: break-all;
  }
`;

const PendingHint = styled.ul`
  margin: 0;
  padding-left: 18px;
  color: ${(p) => p.theme.colors.textMuted};
  font-size: ${(p) => p.theme.font.size.sm};
  line-height: 1.55;
`;

const PendingActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

const SpinnerBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: ${(p) => p.theme.colors.textMuted};
  font-size: ${(p) => p.theme.font.size.sm};
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
