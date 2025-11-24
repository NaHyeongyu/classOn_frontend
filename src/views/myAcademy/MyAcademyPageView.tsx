import styled from "styled-components";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { AcademyDetail } from "@/api/account";
import { maskBiz } from "@/features/myAcademy/utils";
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

type MyAcademyPageViewProps = {
  error: string | null;
  onDismissError?: () => void;
  onLogout: () => void;
  account: AccountSectionProps;
  academy: AcademySectionProps;
  billing: BillingSectionProps;
};

export function MyAcademyPageView({
  error,
  onDismissError,
  onLogout,
  account,
  academy,
  billing,
}: MyAcademyPageViewProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { success, error: showError, warning } = useToast();
  const [clientKey, setClientKey] = useState<string | null>(null);
  const billingBlockState = (location.state as any) || {};
  const customerKeyRef = useRef<string | null>(null);
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
    if (billingBlockState.selectedPlanId) {
      setSelectedPlanId(billingBlockState.selectedPlanId);
    } else if (billing.data?.planId) {
      setSelectedPlanId(billing.data.planId);
    }
  }, [billing.data?.planId, billingBlockState.selectedPlanId]);

  const selectedPlan = useMemo(
    () => getPlanById(selectedPlanId),
    [selectedPlanId],
  );

  const isTrialing = useMemo(() => {
    const status = academy.data?.billingStatus;
    const endRaw = academy.data?.billingCurrentPeriodEnd;
    const end = endRaw ? new Date(endRaw) : null;
    if (!status) return false;
    if (status.toUpperCase() !== "TRIALING") return false;
    if (!end) return false;
    return new Date() <= end;
  }, [academy.data]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await apiGetTossClientKey();
        if (!alive) return;
        setClientKey(res?.clientKey || null);
      } catch {
        if (!alive) return;
        setClientKey(null);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const handlePlanSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPlanId(event.target.value);
  };

  const handleRegisterOrChangeCard = async () => {
    if (!academy.data?.id) {
      warning("학원 정보가 아직 로드되지 않았습니다. 잠시 후 다시 시도해 주세요.");
      return;
    }
    if (isTrialing && !billingBlockState?.billingBlock) {
      warning("무료 체험 기간에는 카드 등록이 불가능합니다. 체험 기간 종료 후 등록해 주세요.");
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
    } catch (e: any) {
      showError(e?.message || "카드 등록 창을 열지 못했습니다.");
    }
  };

  const handleCancel = async () => {
    try {
      await billing.cancel();
      success("자동결제가 해지되었습니다.");
    } catch (e: any) {
      showError(e?.message || "자동결제 해지에 실패했습니다.");
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
      } catch (e: any) {
        showError(e?.message || "카드 등록에 실패했습니다.");
      } finally {
        clean();
      }
    })();
  }, [location.search, academy.data?.id, billing, navigate, selectedPlanId, success, showError, warning]);

  const autoCardRequested = useRef(false);
  useEffect(() => {
    if (!billingBlockState.triggerCardRegister) return;
    if (autoCardRequested.current) return;
    if (!academy.data?.id) return;
    autoCardRequested.current = true;
    handleRegisterOrChangeCard();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [billingBlockState.triggerCardRegister, academy.data?.id]);

  return (
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
            <InfoRow>
              <Label>현재 요금제</Label>
              <ValueRow>
                <span>{currentPlanLabel}</span>
                {!isTrialing && (
                  <InlineButton type="button" onClick={handleOpenPlanPage}>
                    요금제 변경
                  </InlineButton>
                )}
              </ValueRow>
            </InfoRow>
            <InfoRow>
              <Label>월 요금</Label>
              <Value>{formatMoney((billing.data.amountCents || 0) / 100)}</Value>
            </InfoRow>
            <InfoRow>
              <Label>상태</Label>
              <Value>{subscriptionStatus}</Value>
            </InfoRow>
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
                <Value>{cardLabel || "카드 미등록"}</Value>
              </InfoRow>
            )}
            <ActionsRow>
              {!isTrialing && (
                <>
                  <InlineButton type="button" onClick={handleRegisterOrChangeCard} disabled={billing.loading}>
                    카드 {billing.data ? "변경" : "등록하고 시작하기"}
                  </InlineButton>
                  <DangerInlineButton type="button" onClick={handleCancel} disabled={billing.loading}>
                    자동결제 해지
                  </DangerInlineButton>
                </>
              )}
            </ActionsRow>
          </>
        ) : (
          <>
            <InfoRow>
              <Label>현재 요금제</Label>
              <Value>{currentPlanLabel}</Value>
            </InfoRow>
            {isTrialing && (
              <InfoRow>
                <Label>체험 종료일</Label>
                <Value>{trialEndLabel}</Value>
              </InfoRow>
            )}
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

      {/* 강사 관리는 상단 탭(강사관리)에서 관리합니다. */}
    </Container>
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
  gap: 16px;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  h1 {
    margin: 0;
    font-size: 24px;
    color: #111827;
  }
  p {
    margin: 6px 0 0;
    color: #6b7280;
    font-size: 14px;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const OutlineButton = styled.button`
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #374151;
  font-weight: 600;
  border-radius: 10px;
  padding: 8px 16px;
  cursor: pointer;
  &:hover:not(:disabled) {
    background: #f8fafc;
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.65;
  }
`;

const Card = styled.section`
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: linear-gradient(180deg, #ffffff 0%, #f9fafb 100%);
  padding: 18px;
  display: grid;
  gap: 12px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05);
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-size: 16px;
  color: #1f2937;
`;

const InfoRow = styled.div`
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 14px;
  align-items: flex-start;
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

const Label = styled.span`
  font-size: 12px;
  color: #6b7280;
  letter-spacing: 0.03em;
`;

const Value = styled.span`
  font-size: 15px;
  color: #111827;
  font-weight: 600;
  display: block;
`;

const ValueRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

const InlineButton = styled.button`
  border: none;
  background: transparent;
  color: #4f46e5;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  &:hover {
    text-decoration: underline;
  }
`;

const Hint = styled.p.withConfig({
  shouldForwardProp: (prop) => prop !== "danger",
})<{ danger?: boolean }>`
  margin: 6px 0 0;
  font-size: 12px;
  color: ${({ danger }) => (danger ? "#b91c1c" : "#6b7280")};
`;

/* removed unused TeacherActions/PrimaryButton */

const ErrorBanner = styled.div`
  border-radius: 12px;
  background: #fee2e2;
  border: 1px solid #fecaca;
  padding: 12px 16px;
  color: #b91c1c;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const DismissButton = styled.button`
  border: none;
  background: transparent;
  color: #b91c1c;
  font-weight: 600;
  cursor: pointer;
`;

const SkeletonCard = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 18px;
  background: linear-gradient(90deg, #f3f4f6 0%, #f9fafb 50%, #f3f4f6 100%);
  background-size: 200% 100%;
  animation: shimmer 1.6s infinite;

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
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const DangerInlineButton = styled.button`
  border: 1px solid #fecaca;
  background: #fef2f2;
  color: #b91c1c;
  font-size: 12px;
  font-weight: 600;
  border-radius: 999px;
  padding: 6px 12px;
  cursor: pointer;
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const PlanSelect = styled.select`
  min-width: 220px;
  max-width: 100%;
  height: 36px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  padding: 0 10px;
  font-size: 13px;
  color: #111827;
  background: #ffffff;
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
