import styled from "styled-components";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { AcademyDetail, SellerDetail } from "@/api/account";
import { maskBiz } from "@/features/myAcademy/utils";
import { BANK_OPTIONS } from "@/features/myAcademy/banks";
import type { SubscriptionDto } from "@/api/billing";
import { apiIssueBillingKey, apiGetTossClientKey } from "@/api/billing";
import { formatMoney } from "@/lib/format";
import { loadTossPayments } from "@/lib/tossPayments";
import { useToast } from "@/components/common/Toast";
import { routes } from "@/routes";

type AccountSectionProps = {
  name: string;
  username: string;
  phone: string;
  onOpenProfileModal: () => void;
  onOpenPhoneModal: () => void;
  onOpenPasswordModal: () => void;
};

type AcademySectionProps = {
  data: AcademyDetail | null;
  onOpenEditModal: () => void;
};

type BillingSectionProps = {
  loading: boolean;
  data: SubscriptionDto | null;
  createOrUpdate: (payload: {
    planId: string;
    planName: string;
    amountKrw: number;
    currency?: string;
    billingKey?: string;
    customerKey?: string;
    cardCompany?: string;
    cardNumber?: string;
  }) => Promise<void>;
  cancel: () => Promise<void>;
};

type SellerSectionProps = {
  loading: boolean;
  data: SellerDetail | null;
  canRegister: boolean;
  canEdit: boolean;
  status: string | null;
  showPendingBadge: boolean;
  buttonText: string;
  onOpenRegister: () => void;
  awaitingVerification: boolean;
  pendingEmail: string | null;
  pendingTossSellerId: string | null;
};

type MyAcademyPageViewProps = {
  error: string | null;
  onDismissError?: () => void;
  onLogout: () => void;
  account: AccountSectionProps;
  academy: AcademySectionProps;
  billing: BillingSectionProps;
  seller: SellerSectionProps;
};

type MyAcademyLocationState = {
  billingBlock?: boolean;
  selectedPlanId?: string;
  triggerCardRegister?: boolean;
} | null;

export function MyAcademyPageView({
  error,
  onDismissError,
  onLogout,
  account,
  academy,
  billing,
  seller,
}: MyAcademyPageViewProps) {
  const location = useLocation();
  const locationState = (location.state as MyAcademyLocationState) ?? null;
  const navigate = useNavigate();
  const { success, error: showError, warning } = useToast();
  const [clientKey, setClientKey] = useState<string | null>(null);
  const [requireSeller, setRequireSeller] = useState(true);
  const billingBlockState = locationState;
  const selectedPlanFromState = billingBlockState?.selectedPlanId;
  const shouldTriggerCardRegister = billingBlockState?.triggerCardRegister;
  const lastCustomerKeyRef = useRef<string | null>(null);
  const processedAuthKeyRef = useRef<string | null>(null);

  const academyCategory = useMemo(() => {
    if (!academy.data) return "미설정";
    const { category1, category2, categoryEtc } = academy.data;
    if (!category1) return "미설정";
    if (category1 === "기타") {
      return categoryEtc ? `${category1} · ${categoryEtc}` : category1;
    }
    return category2 ? `${category1} · ${category2}` : category1;
  }, [academy.data]);

  const subscriptionStatus = useMemo(() => {
    if (!billing.data) return "결제수단 미등록";
    const status = billing.data.status?.toUpperCase() || "UNKNOWN";
    if (status === "ACTIVE") return "정상";
    if (status === "PAST_DUE") return "연체";
    if (status === "CANCELED") return "해지됨";
    return status;
  }, [billing.data]);

  const cardLabel = useMemo(() => {
    if (!billing.data?.cardNumber) return billing.data ? "등록된 카드" : "-";
    return `${billing.data.cardCompany ?? ""} ${billing.data.cardNumber}`;
  }, [billing.data]);

  const trialEndLabel = useMemo(() => {
    const endRaw = academy.data?.billingCurrentPeriodEnd;
    if (!endRaw) return "-";
    return new Date(endRaw).toLocaleString("ko-KR");
  }, [academy.data]);

  const currentPlanLabel = useMemo(() => {
    if (billing.data) {
      return billing.data.planName || getPlanById(billing.data.planId)?.name || "-";
    }
    const academyPlanId = academy.data?.billingSubscriptionId;
    if (!academyPlanId) return "Free";
    const plan = getPlanById(academyPlanId);
    return plan?.name ?? academyPlanId;
  }, [billing.data, academy.data?.billingSubscriptionId]);

  const [selectedPlanId, setSelectedPlanId] = useState<string>(() =>
    billing.data?.planId || BILLING_PLANS[0].id,
  );

  useEffect(() => {
    if (selectedPlanFromState) {
      setSelectedPlanId(selectedPlanFromState);
    } else if (billing.data?.planId) {
      setSelectedPlanId(billing.data.planId);
    }
  }, [billing.data?.planId, selectedPlanFromState]);

  const isTrialing = useMemo(() => {
    const status = academy.data?.billingStatus;
    const endRaw = academy.data?.billingCurrentPeriodEnd;
    const end = endRaw ? new Date(endRaw) : null;
    if (!status) return false;
    if (status.toUpperCase() !== "TRIALING") return false;
    if (!end) return false;
    return new Date() <= end;
  }, [academy.data]);

  const hasSeller = Boolean(seller.data?.tossSellerId);
  const sellerActionDisabled = seller.awaitingVerification
    ? true
    : hasSeller
      ? !seller.canEdit
      : !seller.canRegister;
  const showSellerEmptyState =
    requireSeller && !seller.loading && !hasSeller && !seller.awaitingVerification;

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await apiGetTossClientKey();
        if (!alive) return;
        setClientKey(res?.clientKey || null);
        setRequireSeller(res?.requireSeller ?? false);
      } catch {
        if (!alive) return;
        setClientKey(null);
        setRequireSeller(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const handleRegisterOrChangeCard = async () => {
    if (!academy.data?.id) {
      warning("학원 정보가 아직 로드되지 않았습니다. 잠시 후 다시 시도해 주세요.");
      return;
    }
    if (!clientKey) {
      showError("결제 연동 키를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.");
      return;
    }
    const academyId = academy.data?.id ?? null;
    const customerKey = getOrCreateCustomerKey(academyId);
    lastCustomerKeyRef.current = customerKey;
    try {
      const tossPayments = await loadTossPayments(clientKey);
      const planIdForBilling = selectedPlanId;
      const successUrl = `${window.location.origin}${routes.myAcademy}?billingPlan=${encodeURIComponent(
        planIdForBilling,
      )}&customerKey=${encodeURIComponent(customerKey)}`;
      const failUrl = successUrl;
      await tossPayments.requestBillingAuth("카드", {
        customerKey,
        successUrl,
        failUrl,
      });
    } catch (err) {
      showError(err instanceof Error ? err.message : "카드 등록 창을 열지 못했습니다.");
    }
  };

  const handleCancel = async () => {
    try {
      await billing.cancel();
      success("자동결제가 해지되었습니다. 현재 결제 주기 종료일까지는 이용이 유지됩니다.");
    } catch (err) {
      showError(err instanceof Error ? err.message : "자동결제 해지에 실패했습니다.");
    }
  };

  const handleOpenPlanPage = () => {
    navigate(routes.myAcademyPlan);
  };

  useEffect(() => {
    const search = location.search;
    if (!search) return;
    const params = new URLSearchParams(search);
    const authKey = params.get("authKey");
    const returnCustomerKey = params.get("customerKey");
    const failCode = params.get("code");
    const failMsg = params.get("message");
    const planId = params.get("billingPlan");
    if (!authKey && !failCode) return;

    // 학원 정보가 아직 없으면 처리하지 않고 학원 로드 후 다시 시도
    if (!academy.data?.id) {
      return;
    }

    if (processedAuthKeyRef.current === authKey) return;
    processedAuthKeyRef.current = authKey;

    const clean = () => {
      navigate(routes.myAcademy, { replace: true, state: {} });
    };

    if (failCode) {
      warning(`카드 등록 실패: ${failMsg || failCode}`);
      clean();
      return;
    }

    const academyId = academy.data.id;
    const expectedCustomerKey = lastCustomerKeyRef.current || getOrCreateCustomerKey(academyId);
    const observedCustomerKey = returnCustomerKey || expectedCustomerKey;
    if (observedCustomerKey) lastCustomerKeyRef.current = observedCustomerKey;
    if (!observedCustomerKey || (expectedCustomerKey && observedCustomerKey !== expectedCustomerKey)) {
      warning("고객 식별값이 일치하지 않아 카드 정보를 등록하지 않았습니다.");
      clean();
      return;
    }

    (async () => {
      try {
        const customerKeyForIssue = observedCustomerKey!;
        const res = await apiIssueBillingKey({
          authKey,
          customerKey: customerKeyForIssue,
        });
        const plan = getPlanById(planId || selectedPlanId);
        await billing.createOrUpdate({
          planId: plan.id,
          planName: plan.name,
          amountKrw: plan.priceKrw,
          currency: "KRW",
          billingKey: res.billingKey,
          customerKey: customerKeyForIssue,
          cardCompany: res.cardCompany,
          cardNumber: res.cardNumber,
        });
        try {
          const { invalidateCache } = await import("@/lib/fetcher");
          invalidateCache([
            "/api/payments/toss/subscription",
            "/api/account/academy",
          ]);
        } catch {
          // ignore cache invalidation failures
        }
        success("카드가 등록되고 요금제가 설정되었습니다.");
      } catch (err) {
        showError(err instanceof Error ? err.message : "카드 등록에 실패했습니다.");
      } finally {
        clean();
      }
    })();
  }, [location.search, academy.data?.id, billing, navigate, selectedPlanId, success, showError, warning]);

  const autoCardRequested = useRef(false);
  useEffect(() => {
    if (!shouldTriggerCardRegister) return;
    if (autoCardRequested.current) return;
    if (!academy.data?.id) return;
    autoCardRequested.current = true;
    handleRegisterOrChangeCard();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldTriggerCardRegister, academy.data?.id]);

  return (
    <>
      <Container>
        <Header>
          <div>
            <h1>내 학원 정보</h1>
          <p>계정 및 학원 정보를 확인하고 필요 시 수정하세요.</p>
        </div>
        <HeaderActions>
          <OutlineButton type="button" onClick={onLogout}>
            로그아웃
          </OutlineButton>
        </HeaderActions>
      </Header>

      {error ? (
        <ErrorBanner>
          <span>{error}</span>
          {onDismissError ? (
            <DismissButton type="button" onClick={onDismissError}>
              닫기
            </DismissButton>
          ) : null}
        </ErrorBanner>
      ) : null}

      <Card>
        <SectionTitle>계정 정보</SectionTitle>
        <InfoRow>
          <Label>담당자 성함</Label>
          <Value>
            <ValueRow>
              <span>{account.name || "-"}</span>
              <InlineButton type="button" onClick={account.onOpenProfileModal}>
                이름 수정
              </InlineButton>
            </ValueRow>
          </Value>
        </InfoRow>
        <InfoRow>
          <Label>아이디</Label>
          <Value>{account.username || "-"}</Value>
        </InfoRow>
        <InfoRow>
          <Label>휴대폰 번호</Label>
          <Value>
            <ValueRow>
              <span>{account.phone || "-"}</span>
              <InlineButton type="button" onClick={account.onOpenPhoneModal}>
                번호 변경
              </InlineButton>
            </ValueRow>
            <Hint>휴대폰 번호는 인증 모달에서 변경할 수 있습니다.</Hint>
          </Value>
        </InfoRow>
        <InfoRow>
          <Label>비밀번호</Label>
          <Value>
            <ValueRow>
              <span>••••••••</span>
              <InlineButton
                type="button"
                onClick={account.onOpenPasswordModal}
              >
                비밀번호 변경
              </InlineButton>
            </ValueRow>
          </Value>
        </InfoRow>
      </Card>

      <Card>
        <SectionHeader>
          <SectionTitle>학원 정보</SectionTitle>
          <InlineButton type="button" onClick={academy.onOpenEditModal}>
            학원 정보 수정
          </InlineButton>
        </SectionHeader>
        <InfoRow>
          <Label>학원명</Label>
          <Value>{academy.data?.name || "-"}</Value>
        </InfoRow>
        <InfoRow>
          <Label>카테고리</Label>
          <Value>{academyCategory || "-"}</Value>
        </InfoRow>
        <InfoRow>
          <Label>주소</Label>
          <Value>{academy.data?.address || "-"}</Value>
        </InfoRow>
        <InfoRow>
          <Label>대표자명</Label>
          <Value>{academy.data?.representativeName || "-"}</Value>
        </InfoRow>
        <InfoRow>
          <Label>학원 대표번호</Label>
          <Value>{academy.data?.phone || "-"}</Value>
        </InfoRow>
        <InfoRow>
          <Label>청구용 이메일</Label>
          <Value>{academy.data?.billingEmail || "-"}</Value>
        </InfoRow>
        <InfoRow>
          <Label>사업자번호</Label>
          <Value>{academy.data?.bizNo ? maskBiz(academy.data.bizNo) : "-"}</Value>
        </InfoRow>
      </Card>

      <Card>
        <SectionHeader>
          <SectionTitle>내 요금제 / 결제수단</SectionTitle>
        </SectionHeader>
        {billing.loading ? (
          <Hint>불러오는 중...</Hint>
        ) : billing.data ? (
          <>
            <CurrentPlanHighlight>
              <PlanBadge data-status={subscriptionStatus}>
                {subscriptionStatus}
              </PlanBadge>
              <CurrentPlanName>{currentPlanLabel}</CurrentPlanName>
              <CurrentPlanPrice>
                {formatMoney((billing.data.amountCents || 0) / 100)}
                <span>/월</span>
              </CurrentPlanPrice>
              {!isTrialing && (
                <ChangePlanButton type="button" onClick={handleOpenPlanPage}>
                  요금제 변경
                </ChangePlanButton>
              )}
            </CurrentPlanHighlight>
            
            <InfoRow>
              <Label>다음 청구 예정일</Label>
              <Value>{billing.data.nextChargeAt ? new Date(billing.data.nextChargeAt).toLocaleString("ko-KR") : "예약 없음"}</Value>
            </InfoRow>
            <InfoRow>
              <Label>마지막 청구</Label>
              <Value>{billing.data.lastChargeAt ? new Date(billing.data.lastChargeAt).toLocaleString("ko-KR") : "-"}</Value>
            </InfoRow>
            {!isTrialing && (
              <InfoRow>
                <Label>등록 카드</Label>
                <ValueRow>
                  <span>{cardLabel || "카드 미등록"}</span>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <InlineButton type="button" onClick={handleRegisterOrChangeCard} disabled={billing.loading}>
                      카드 {billing.data ? "변경" : "등록"}
                    </InlineButton>
                    <DangerInlineButton type="button" onClick={handleCancel} disabled={billing.loading}>
                      해지
                    </DangerInlineButton>
                  </div>
                </ValueRow>
              </InfoRow>
            )}
          </>
        ) : (
          <>
            <CurrentPlanHighlight>
              <PlanBadge data-status="Free">
                {isTrialing ? "체험 중" : "Free"}
              </PlanBadge>
              <CurrentPlanName>{currentPlanLabel}</CurrentPlanName>
              {isTrialing && (
                <TrialEndInfo>
                  체험 종료일: {trialEndLabel}
                </TrialEndInfo>
              )}
            </CurrentPlanHighlight>
            
            {!isTrialing && (
              <>
                <Hint>요금제 선택 후 카드 등록을 진행하면 자동결제가 시작됩니다.</Hint>
                <ActionsRow>
                  <InlineButton type="button" onClick={handleRegisterOrChangeCard} disabled={billing.loading}>
                    카드 등록하고 시작하기
                  </InlineButton>
                </ActionsRow>
              </>
            )}
          </>
        )}
      </Card>

      <Card>
        <SectionHeader>
          <SectionTitle>
            셀러 등록
            {seller.showPendingBadge ? <PendingBadge>인증 대기</PendingBadge> : null}
          </SectionTitle>
          {requireSeller && hasSeller ? (
            <SellerHeaderActions>
              <SellerRegisterButton
                type="button"
                onClick={seller.onOpenRegister}
                disabled={sellerActionDisabled}
              >
                {seller.buttonText}
              </SellerRegisterButton>
            </SellerHeaderActions>
          ) : null}
        </SectionHeader>
        {!requireSeller ? (
          <Hint>현재 환경에서는 셀러 등록이 필요하지 않습니다.</Hint>
        ) : seller.loading ? (
          <Hint>불러오는 중...</Hint>
        ) : seller.awaitingVerification ? (
          <SellerPendingNotice>
            <PendingTitle>인증 대기 중</PendingTitle>
            <PendingDescription>
              등록한 메일 또는 번호로 토스페이먼츠 인증이 발송되었습니다.
              <br />
              본인 인증을 완료하면 자동으로 등록이 마무리됩니다.
            </PendingDescription>
            <PendingMeta>
              <span>등록 이메일: {seller.pendingEmail || "-"}</span>
              <span>토스 셀러 ID: {seller.pendingTossSellerId || "발급 대기"}</span>
            </PendingMeta>
            <PendingHintList>
              <li>스팸메일함도 함께 확인해 주세요.</li>
              <li>인증을 완료하면 화면이 자동으로 갱신됩니다.</li>
              <li>문제가 지속되면 고객센터로 문의해 주세요.</li>
            </PendingHintList>
          </SellerPendingNotice>
        ) : showSellerEmptyState ? (
          <SellerEmptyState>
            <EmptyIcon>🏪</EmptyIcon>
            <EmptyTitle>셀러 등록이 필요합니다</EmptyTitle>
            <EmptyDescription>
              토스페이먼츠 셀러 등록을 완료하면 결제 정산 서비스를 이용할 수 있습니다.
            </EmptyDescription>
            <SellerRegisterButton
              type="button"
              onClick={seller.onOpenRegister}
              disabled={sellerActionDisabled}
            >
              {seller.buttonText}
            </SellerRegisterButton>
            {!seller.canRegister && (
              <Hint danger>학원 정보를 먼저 저장한 후 다시 시도해 주세요.</Hint>
            )}
          </SellerEmptyState>
        ) : (
          <>
            <InfoRow>
              <Label>상태</Label>
              <Value>
                <StatusBadge data-status={seller.status ?? "UNKNOWN"}>
                  {renderSellerStatus(seller.status)}
                </StatusBadge>
              </Value>
            </InfoRow>
            <InfoRow>
              <Label>셀러 ID</Label>
              <Value>{seller.data?.refSellerId || "-"}</Value>
            </InfoRow>
            <InfoRow title={seller.data?.tossSellerId || undefined}>
              <Label>토스 셀러 ID</Label>
              <Value>{seller.data?.tossSellerId || "-"}</Value>
            </InfoRow>
            <InfoRow>
              <Label>정산 계좌</Label>
              <Value>{formatSellerAccount(seller.data?.account)}</Value>
            </InfoRow>
          </>
        )}
      </Card>

        {/* 강사 관리는 상단 탭(강사관리)에서 관리합니다. */}
      </Container>
    </>
  );
}

export function MyAcademyLoadingView() {
  return (
    <Container>
      <Header>
        <div>
          <h1>내 학원 정보</h1>
          <p>불러오는 중…</p>
        </div>
        <HeaderActions>
          <OutlineButton type="button" disabled>
            로그아웃
          </OutlineButton>
        </HeaderActions>
      </Header>
      <SkeletonCard />
      <SkeletonCard />
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.lg};
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${(p) => p.theme.spacing.md};
  margin-bottom: ${(p) => p.theme.spacing.xxl};
  
  h1 {
    margin: 0;
    font-size: ${(p) => p.theme.font.size.display};
    font-weight: ${(p) => p.theme.font.weight.bold};
    color: ${(p) => p.theme.colors.text};
    letter-spacing: -0.02em;
  }
  p {
    margin: 6px 0 0;
    color: ${(p) => p.theme.colors.textMuted};
    font-size: ${(p) => p.theme.font.size.md};
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: ${(p) => p.theme.spacing.xs};
  align-items: center;
`;

const OutlineButton = styled.button`
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.surface};
  color: ${(p) => p.theme.colors.text};
  font-weight: ${(p) => p.theme.font.weight.semiBold};
  border-radius: ${(p) => p.theme.radii.sm};
  padding: 10px 18px;
  cursor: pointer;
  font-size: ${(p) => p.theme.font.size.md};
  transition: all ${(p) => p.theme.motion.duration.base} ${(p) => p.theme.motion.easing.standard};
  
  &:hover:not(:disabled) {
    background: ${(p) => p.theme.colors.surfaceMuted};
    border-color: ${(p) => p.theme.colors.borderStrong};
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const Card = styled.section`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.md};
  background: ${(p) => p.theme.colors.surface};
  padding: ${(p) => p.theme.spacing.xl};
  display: flex;
  flex-direction: column;
  gap: 0;
  box-shadow: ${(p) => p.theme.shadow.low};
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${(p) => p.theme.spacing.md};
  margin-bottom: ${(p) => p.theme.spacing.md};
  padding-bottom: ${(p) => p.theme.spacing.md};
  border-bottom: 1px solid ${(p) => p.theme.colors.borderMuted};
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-size: ${(p) => p.theme.font.size.lg};
  font-weight: ${(p) => p.theme.font.weight.bold};
  color: ${(p) => p.theme.colors.text};
`;

const InfoRow = styled.div`
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: ${(p) => p.theme.spacing.md};
  align-items: center;
  padding: ${(p) => p.theme.spacing.md} 0;
  border-bottom: 1px solid ${(p) => p.theme.colors.borderMuted};

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: ${(p) => p.theme.spacing.xs};
    align-items: flex-start;
    padding: ${(p) => p.theme.spacing.sm} 0;
  }
`;

const Label = styled.span`
  font-size: ${(p) => p.theme.font.size.sm};
  font-weight: ${(p) => p.theme.font.weight.medium};
  color: ${(p) => p.theme.colors.textMuted};
`;

const Value = styled.span`
  font-size: ${(p) => p.theme.font.size.md};
  color: ${(p) => p.theme.colors.text};
  font-weight: ${(p) => p.theme.font.weight.semiBold};
  display: block;
  line-height: ${(p) => p.theme.font.lineHeight.normal};
`;

const ValueRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${(p) => p.theme.spacing.sm};
  flex-wrap: wrap;
`;

const InlineButton = styled.button`
  border: none;
  background: transparent;
  color: ${(p) => p.theme.colors.primary};
  font-size: ${(p) => p.theme.font.size.sm};
  font-weight: ${(p) => p.theme.font.weight.semiBold};
  cursor: pointer;
  padding: 0;
  transition: color ${(p) => p.theme.motion.duration.base};
  
  &:hover {
    color: ${(p) => p.theme.colors.primaryHover};
    text-decoration: underline;
  }
`;

const Hint = styled.p.withConfig({
  shouldForwardProp: (prop) => prop !== "danger",
})<{ danger?: boolean }>`
  margin: ${(p) => p.theme.spacing.xs} 0 0;
  font-size: ${(p) => p.theme.font.size.xs};
  color: ${({ danger, theme }) => (danger ? theme.colors.danger : theme.colors.textMuted)};
`;

const SellerRegisterButton = styled.button`
  border: none;
  background: ${(p) => p.theme.colors.primary};
  color: ${(p) => p.theme.colors.textInverted};
  font-size: ${(p) => p.theme.font.size.sm};
  font-weight: ${(p) => p.theme.font.weight.semiBold};
  border-radius: ${(p) => p.theme.radii.sm};
  padding: 10px 18px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all ${(p) => p.theme.motion.duration.base} ${(p) => p.theme.motion.easing.standard};
  box-shadow: ${(p) => p.theme.shadow.medium};
  
  &:hover:not(:disabled) {
    background: ${(p) => p.theme.colors.primaryHover};
    transform: translateY(-1px);
    box-shadow: ${(p) => p.theme.shadow.high};
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: ${(p) => p.theme.shadow.low};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SellerHeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing.sm};
  flex-wrap: wrap;
  justify-content: flex-end;
  min-height: 34px;
`;

const SellerEmptyState = styled.div`
  display: grid;
  place-items: center;
  text-align: center;
  gap: ${(p) => p.theme.spacing.sm};
  padding: ${(p) => p.theme.spacing.lg} ${(p) => p.theme.spacing.md};
  border: 1px dashed ${(p) => p.theme.colors.borderMuted};
  border-radius: ${(p) => p.theme.radii.md};
  background: ${(p) => p.theme.colors.surfaceAlt};
`;

const SellerPendingNotice = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.md};
  text-align: center;
  padding: ${(p) => p.theme.spacing.xl} ${(p) => p.theme.spacing.lg};
  border-radius: ${(p) => p.theme.radii.lg};
  border: 1px dashed ${(p) => p.theme.colors.borderMuted};
  background: ${(p) => p.theme.colors.surfaceAlt};
`;

const PendingTitle = styled.h3`
  margin: 0;
  font-size: ${(p) => p.theme.font.size.lg};
  color: ${(p) => p.theme.colors.text};
`;

const PendingDescription = styled.p`
  margin: 0;
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${(p) => p.theme.colors.textMuted};
  line-height: 1.6;
`;

const PendingMeta = styled.div`
  display: grid;
  gap: 4px;
  font-size: 13px;
  color: ${(p) => p.theme.colors.textMuted};
`;

const PendingHintList = styled.ul`
  margin: 0;
  padding-left: ${(p) => p.theme.spacing.lg};
  text-align: left;
  color: ${(p) => p.theme.colors.textMuted};
  font-size: ${(p) => p.theme.font.size.sm};
  display: inline-block;
  li + li {
    margin-top: 4px;
  }
`;

const EmptyIcon = styled.div`
  font-size: 32px;
`;

const EmptyTitle = styled.h3`
  margin: 0;
  font-size: ${(p) => p.theme.font.size.md};
  color: ${(p) => p.theme.colors.text};
`;

const EmptyDescription = styled.p`
  margin: 0;
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${(p) => p.theme.colors.textMuted};
`;

const PendingBadge = styled.span`
  display: inline-flex;
  padding: 0 10px;
  margin-left: ${(p) => p.theme.spacing.sm};
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  background: #fef3c7;
  color: #b45309;
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  background: #eef2ff;
  color: #4c1d95;
  &[data-status="APPROVED"] {
    background: #ecfdf5;
    color: #065f46;
  }
  &[data-status="REJECTED"] {
    background: #fef2f2;
    color: #b91c1c;
  }
`;

const ErrorBanner = styled.div`
  border-radius: ${(p) => p.theme.radii.sm};
  background: ${(p) => p.theme.colors.dangerSurface};
  border: 1px solid ${(p) => p.theme.colors.danger};
  padding: ${(p) => p.theme.spacing.sm} ${(p) => p.theme.spacing.md};
  color: ${(p) => p.theme.colors.danger};
  font-size: ${(p) => p.theme.font.size.sm};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${(p) => p.theme.spacing.sm};
`;

const DismissButton = styled.button`
  border: none;
  background: transparent;
  color: ${(p) => p.theme.colors.danger};
  font-weight: ${(p) => p.theme.font.weight.semiBold};
  cursor: pointer;
  font-size: ${(p) => p.theme.font.size.sm};
  
  &:hover {
    text-decoration: underline;
  }
`;

const SkeletonCard = styled.div`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.md};
  padding: ${(p) => p.theme.spacing.xl};
  background: linear-gradient(
    90deg,
    ${(p) => p.theme.colors.gray100} 0%,
    ${(p) => p.theme.colors.gray200} 50%,
    ${(p) => p.theme.colors.gray100} 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.6s ease-in-out infinite;

  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

const ActionsRow = styled.div`
  margin-top: ${(p) => p.theme.spacing.sm};
  display: flex;
  flex-wrap: wrap;
  gap: ${(p) => p.theme.spacing.xs};
`;

const DangerInlineButton = styled.button`
  border: 1px solid ${(p) => p.theme.colors.danger};
  background: ${(p) => p.theme.colors.dangerSurface};
  color: ${(p) => p.theme.colors.danger};
  font-size: ${(p) => p.theme.font.size.sm};
  font-weight: ${(p) => p.theme.font.weight.semiBold};
  border-radius: ${(p) => p.theme.radii.sm};
  padding: 8px 16px;
  cursor: pointer;
  transition: all ${(p) => p.theme.motion.duration.base} ${(p) => p.theme.motion.easing.standard};
  
  &:hover:not(:disabled) {
    background: ${(p) => p.theme.colors.danger};
    color: ${(p) => p.theme.colors.textInverted};
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const CurrentPlanHighlight = styled.div`
  background: linear-gradient(135deg, ${(p) => p.theme.colors.primarySurface} 0%, ${(p) => p.theme.colors.surface} 100%);
  border: 1px solid ${(p) => p.theme.colors.primary}20;
  border-radius: ${(p) => p.theme.radii.md};
  padding: ${(p) => p.theme.spacing.lg};
  margin-bottom: ${(p) => p.theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing.sm};
  align-items: center;
  text-align: center;
`;

const PlanBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: ${(p) => p.theme.font.size.xs};
  font-weight: ${(p) => p.theme.font.weight.semiBold};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  
  &[data-status="정상"],
  &[data-status="Free"] {
    background: ${(p) => p.theme.colors.successSurface};
    color: ${(p) => p.theme.colors.success};
    border: 1px solid ${(p) => p.theme.colors.success};
  }
  
  &[data-status="연체"] {
    background: ${(p) => p.theme.colors.dangerSurface};
    color: ${(p) => p.theme.colors.danger};
    border: 1px solid ${(p) => p.theme.colors.danger};
  }
  
  &[data-status="해지됨"] {
    background: ${(p) => p.theme.colors.surfaceMuted};
    color: ${(p) => p.theme.colors.textMuted};
    border: 1px solid ${(p) => p.theme.colors.borderMuted};
  }
`;

const CurrentPlanName = styled.div`
  font-size: ${(p) => p.theme.font.size.xl};
  font-weight: ${(p) => p.theme.font.weight.bold};
  color: ${(p) => p.theme.colors.text};
  margin-top: ${(p) => p.theme.spacing.xs};
`;

const CurrentPlanPrice = styled.div`
  font-size: ${(p) => p.theme.font.size.display};
  font-weight: ${(p) => p.theme.font.weight.bold};
  color: ${(p) => p.theme.colors.primary};
  letter-spacing: -0.02em;
  
  span {
    font-size: ${(p) => p.theme.font.size.lg};
    color: ${(p) => p.theme.colors.textMuted};
    font-weight: ${(p) => p.theme.font.weight.medium};
    margin-left: 4px;
  }
`;

const ChangePlanButton = styled.button`
  margin-top: ${(p) => p.theme.spacing.xs};
  padding: 10px 24px;
  background: ${(p) => p.theme.colors.primary};
  color: ${(p) => p.theme.colors.textInverted};
  border: none;
  border-radius: ${(p) => p.theme.radii.sm};
  font-size: ${(p) => p.theme.font.size.sm};
  font-weight: ${(p) => p.theme.font.weight.semiBold};
  cursor: pointer;
  transition: all ${(p) => p.theme.motion.duration.base} ${(p) => p.theme.motion.easing.standard};
  
  &:hover {
    background: ${(p) => p.theme.colors.primaryHover};
    transform: translateY(-1px);
    box-shadow: ${(p) => p.theme.shadow.medium};
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const TrialEndInfo = styled.div`
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${(p) => p.theme.colors.textMuted};
  margin-top: ${(p) => p.theme.spacing.xs};
`;

type BillingPlan = { id: string; name: string; priceKrw: number };

const BILLING_PLANS: BillingPlan[] = [
  { id: "plan-100-basic", name: "Small Basic", priceKrw: 9000 },
  { id: "plan-100-pay", name: "Small Plus", priceKrw: 18000 },
  { id: "plan-300-basic", name: "Midium Basic", priceKrw: 18000 },
  { id: "plan-300-pay", name: "Midium Plus", priceKrw: 34000 },
  { id: "plan-500-basic", name: "Large Basic", priceKrw: 27000 },
  { id: "plan-500-pay", name: "Large Plus", priceKrw: 52000 },
];

function getPlanById(id?: string | null): BillingPlan {
  return BILLING_PLANS.find((p) => p.id === id) ?? BILLING_PLANS[0];
}

const CUSTOMER_KEY_PREFIX = "billing:customerKey:";
function getOrCreateCustomerKey(academyId?: number | null) {
  if (typeof window === "undefined") return "";
  const key = `${CUSTOMER_KEY_PREFIX}${academyId ?? "anon"}`;
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const generated = `academy-${academyId ?? "anon"}-${crypto.randomUUID()}`;
  window.localStorage.setItem(key, generated);
  return generated;
}

function formatBankName(code?: string | null) {
  if (!code) return "";
  return BANK_OPTIONS.find((bank) => bank.code === code)?.name ?? code;
}

function formatSellerAccount(account?: SellerDetail["account"]) {
  if (!account) return "-";
  const bank = formatBankName(account.bankCode);
  const parts = [];
  if (bank) parts.push(bank);
  if (account.accountNumber) parts.push(account.accountNumber);
  if (account.holderName) parts.push(`(${account.holderName})`);
  return parts.length > 0 ? parts.join(" ") : "-";
}

function renderSellerStatus(status?: string | null) {
  const normalized = (status || "").toUpperCase();
  if (!normalized) return "미등록";
  if (normalized === "APPROVAL_REQUIRED" || normalized === "PENDING") return "이메일 확인 중";
  if (normalized === "APPROVED") return "승인 완료";
  if (normalized === "REJECTED") return "반려됨";
  if (normalized === "SUSPENDED") return "중단됨";
  return normalized;
}
