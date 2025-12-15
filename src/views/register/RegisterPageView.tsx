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

  const settlementStatus = (flow.settlementRegistration?.status ?? "PENDING").toUpperCase();
  const settlementApproved = settlementStatus === "APPROVED";
  const settlementRejected = settlementStatus === "REJECTED";
  const statusLabel = (() => {
    switch (settlementStatus) {
      case "APPROVED":
        return "승인 완료";
      case "REJECTED":
        return "반려";
      case "PENDING":
      case "REQUESTED":
      case "REQUEST":
        return "인증 대기";
      default:
        return settlementStatus;
    }
  })();
  const lastCheckedLabel = (() => {
    if (flow.settlementLastCheckedAt == null) return null;
    const d = new Date(flow.settlementLastCheckedAt);
    const parts = d.toLocaleString("ko-KR", {
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    return parts;
  })();

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
            <PendingTitle>
              {settlementApproved
                ? "정산 계좌 인증 완료"
                : settlementRejected
                  ? "정산 계좌 인증이 반려되었습니다"
                  : "정산 계좌 인증 대기"}
            </PendingTitle>
            <PendingDesc>
              {settlementApproved ? (
                <>
                  인증이 완료되었습니다.
                  <br />이제 로그인해서 서비스를 이용해 주세요.
                </>
              ) : settlementRejected ? (
                <>
                  입력한 정보가 반려되었습니다.
                  <br />로그인 후 “정산 계좌 등록”에서 정보를 수정해 다시 요청해 주세요.
                </>
              ) : (
                <>
                  입력한 정보가 토스페이먼츠로 전달되었습니다.
                  <br />이메일/문자에서 인증을 완료하면 이 화면이 자동으로 갱신됩니다.
                </>
              )}
            </PendingDesc>
            <StatusRow>
              <StatusBadge data-status={settlementStatus}>{statusLabel}</StatusBadge>
              {lastCheckedLabel ? <LastChecked>마지막 확인: {lastCheckedLabel}</LastChecked> : null}
            </StatusRow>
            {flow.settlementPollingError ? <InlineError>{flow.settlementPollingError}</InlineError> : null}
            {!settlementApproved ? (
              <PendingHint>
                <li>인증 메일이 안 보이면 스팸/프로모션함도 함께 확인해 주세요.</li>
                <li>인증 완료까지 수 분 정도 걸릴 수 있어요.</li>
                <li>인증 후에도 반영이 늦으면 “상태 새로고침”을 눌러 확인해 주세요.</li>
              </PendingHint>
            ) : null}
            <PendingActions>
              {settlementApproved ? (
                <ApprovedText>인증이 완료되었습니다. 로그인해 주세요.</ApprovedText>
              ) : (
                <SpinnerBox>
                  {flow.settlementPolling ? <LoadingSpinner /> : null}
                  <span>{flow.settlementPolling ? "상태를 자동으로 확인하고 있어요" : "상태 새로고침으로 확인해 주세요"}</span>
                </SpinnerBox>
              )}
              <ButtonRow>
                {!settlementApproved ? (
                  <SecondaryButton
                    type="button"
                    onClick={() => void flow.refreshSettlementStatus()}
                    disabled={flow.settlementPolling}
                  >
                    상태 새로고침
                  </SecondaryButton>
                ) : null}
                <LinkButton to="/login">로그인으로 이동</LinkButton>
              </ButtonRow>
            </PendingActions>

            <Details>
              <summary>상세 정보</summary>
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
                  <span className="label">요청 ID</span>
                  <span className="value">{flow.settlementRegistration?.refSellerId || "-"}</span>
                </div>
              </PendingMeta>
            </Details>
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

const StatusRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: ${(p) => p.theme.font.size.xs};
  font-weight: ${(p) => p.theme.font.weight.semiBold};
  border: 1px solid ${(p) => p.theme.colors.borderMuted};
  background: ${(p) => p.theme.colors.surface};
  color: ${(p) => p.theme.colors.text};

  &[data-status="APPROVED"] {
    border-color: ${(p) => p.theme.colors.success};
    background: ${(p) => p.theme.colors.successSurface};
    color: ${(p) => p.theme.colors.success};
  }

  &[data-status="REJECTED"] {
    border-color: ${(p) => p.theme.colors.danger};
    background: ${(p) => p.theme.colors.dangerSurface};
    color: ${(p) => p.theme.colors.danger};
  }
`;

const LastChecked = styled.span`
  color: ${(p) => p.theme.colors.textMuted};
  font-size: ${(p) => p.theme.font.size.xs};
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

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
`;

const SecondaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 14px;
  border-radius: ${(p) => p.theme.radii.md};
  background: ${(p) => p.theme.colors.surface};
  color: ${(p) => p.theme.colors.text};
  font-weight: ${(p) => p.theme.font.weight.semiBold};
  border: 1px solid ${(p) => p.theme.colors.borderMuted};
  cursor: pointer;
  &:hover {
    filter: brightness(0.99);
  }
`;

const InlineError = styled.div`
  color: ${(p) => p.theme.colors.danger};
  font-size: ${(p) => p.theme.font.size.sm};
`;

const ApprovedText = styled.div`
  color: ${(p) => p.theme.colors.text};
  font-size: ${(p) => p.theme.font.size.sm};
  font-weight: ${(p) => p.theme.font.weight.semiBold};
`;

const Details = styled.details`
  border-top: 1px solid ${(p) => p.theme.colors.borderMuted};
  padding-top: 10px;

  summary {
    cursor: pointer;
    color: ${(p) => p.theme.colors.textMuted};
    font-size: ${(p) => p.theme.font.size.sm};
    font-weight: ${(p) => p.theme.font.weight.semiBold};
    user-select: none;
  }

  &[open] summary {
    margin-bottom: 10px;
  }
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
