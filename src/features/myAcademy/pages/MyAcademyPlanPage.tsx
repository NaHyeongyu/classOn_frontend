import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiGetSubscription, apiUpsertSubscription, apiGetTossClientKey, type SubscriptionDto } from "@/api/billing";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/common/Toast";
import { routes } from "@/routes";
import {
  PlanGrid,
  PlanCard as RegisterPlanCard,
  PlanHeader,
  PlanTitle,
  PlanDescription,
  PlanPriceWrapper,
  PlanPrice,
  PlanOriginalPrice,
  PlanButton,
  Hint as RegisterHint,
  ChoiceList,
  ScaleCard,
  PlanLabel,
} from "@/components/register/RegisterForm.styles";
import styled from "styled-components";
import { apiGetMyAcademy } from "@/api/account";
import { useAuth } from "@/hooks/useAuth";
import { loadTossPayments } from "@/lib/tossPayments";
import { PrimaryButton, GhostButton } from "@/components/common/UI";

type BillingPlanConfig = {
  id: string;
  name: string;
  desc: string;
  priceKrw: number;
  originalPrice?: string;
};

const PLANS: BillingPlanConfig[] = [
  { id: "free", name: "Free", desc: "50명 이하 · 무료 체험용", priceKrw: 0 },
  { id: "plan-100-basic", name: "Small Basic", desc: "총원 120명 · 결제 기능 없음(무료 플랜과 중복 불가)", priceKrw: 9000 },
  { id: "plan-100-pay", name: "Small Plus", desc: "총원 120명 · 결제 기능 포함", priceKrw: 19900 },
  { id: "plan-300-basic", name: "Midium Basic", desc: "총원 300명 · 결제 기능 없음", priceKrw: 18000 },
  { id: "plan-300-pay", name: "Midium Plus", desc: "총원 300명 · 결제 기능 포함", priceKrw: 36900 },
  { id: "plan-500-basic", name: "Large Basic", desc: "총원 500명 · 결제 기능 없음", priceKrw: 27000 },
  { id: "plan-500-pay", name: "Large Plus", desc: "총원 500명 · 결제 기능 포함", priceKrw: 54900 },
];

type StudentScaleOption = "UNDER_50" | "RANGE_50_100" | "RANGE_100_300" | "RANGE_300_500" | "OVER_500" | "";

const STUDENT_SCALE_OPTIONS: Array<{ id: StudentScaleOption; label: string }> = [
  { id: "UNDER_50", label: "50명 이하" },
  { id: "RANGE_50_100", label: "50~100명" },
  { id: "RANGE_100_300", label: "100~300명" },
  { id: "RANGE_300_500", label: "300~500명" },
  { id: "OVER_500", label: "500명 이상" },
];

const PLAN_MAPPING: Record<StudentScaleOption, string[]> = {
  UNDER_50: ["free", "plan-100-basic", "plan-100-pay"],
  RANGE_50_100: ["plan-100-basic", "plan-100-pay"],
  RANGE_100_300: ["plan-300-basic", "plan-300-pay"],
  RANGE_300_500: ["plan-500-basic", "plan-500-pay"],
  OVER_500: ["enterprise"],
  "": [],
};

function getPlanById(id: string | null | undefined): BillingPlanConfig | null {
  return PLANS.find((p) => p.id === id) ?? null;
}

const CUSTOMER_KEY_PREFIX = "billing:customerKey:";
type PlanPageLocationState = { reason?: string } | null;
function getOrCreateCustomerKey(academyId?: number | null) {
  if (typeof window === "undefined") return "";
  const key = `${CUSTOMER_KEY_PREFIX}${academyId ?? "anon"}`;
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const generated = `academy-${academyId ?? "anon"}-${crypto.randomUUID()}`;
  window.localStorage.setItem(key, generated);
  return generated;
}

export default function MyAcademyPlanPage() {
  const location = useLocation();
  const locationState = (location.state as PlanPageLocationState) ?? null;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [subscription, setSubscription] = useState<SubscriptionDto | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [studentScale, setStudentScale] = useState<StudentScaleOption>("UNDER_50");
  const { success, error } = useToast();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const billingBlocked = locationState?.reason === "billing-block";
  const [clientKey, setClientKey] = useState<string | null>(null);
  const [academyId, setAcademyId] = useState<number | null>(null);
  const [isTrialing, setIsTrialing] = useState(false);
  const customerKeyRef = useRef<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [academy, sub, ck] = await Promise.all([
          apiGetMyAcademy().catch(
            (): Awaited<ReturnType<typeof apiGetMyAcademy>> | null => null,
          ),
          apiGetSubscription().catch(
            (): Awaited<ReturnType<typeof apiGetSubscription>> | null => null,
          ),
          apiGetTossClientKey().catch(
            (): Awaited<ReturnType<typeof apiGetTossClientKey>> | null => null,
          ),
        ]);
        if (!alive) return;
        setClientKey(ck?.clientKey || null);
        if (academy) {
          setAcademyId(academy.id);
          const status = (academy.billingStatus || "").toUpperCase();
          const endRaw = academy.billingCurrentPeriodEnd;
          const end = endRaw ? new Date(endRaw) : null;
          const trialActive =
            status === "TRIALING" && end !== null && new Date() <= end;
          setIsTrialing(trialActive);
        }
        if (sub?.id) {
          setSubscription(sub);
          setSelectedPlanId(sub.planId);
          const mappingEntries = Object.entries(PLAN_MAPPING) as Array<[StudentScaleOption, string[]]>;
          const found = mappingEntries.find(([, ids]) => ids.includes(sub.planId));
          if (found) setStudentScale(found[0]);
        } else {
          setStudentScale("UNDER_50");
          setSelectedPlanId(null);
        }
      } catch {
        if (!alive) return;
        setClientKey(null);
        setStudentScale("UNDER_50");
        setSelectedPlanId(null);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const availablePlans = useMemo(
    () => PLAN_MAPPING[studentScale] ?? [],
    [studentScale],
  );

  useEffect(() => {
    if (availablePlans.length === 0) {
      setSelectedPlanId(null);
      return;
    }
    if (selectedPlanId && !availablePlans.includes(selectedPlanId)) {
      setSelectedPlanId(null);
    }
  }, [availablePlans, selectedPlanId]);

  const selectedPlan = useMemo(
    () => (selectedPlanId ? getPlanById(selectedPlanId) : null),
    [selectedPlanId],
  );

  const handleCardRegister = async () => {
    if (!selectedPlan) {
      error("요금제를 선택해 주세요.");
      return;
    }
    if (!clientKey) {
      error("결제 연동 키를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.");
      return;
    }
    let acadId = academyId;
    if (!acadId) {
      try {
        const aca = await apiGetMyAcademy();
        acadId = aca.id;
        setAcademyId(aca.id);
      } catch {
        error("학원 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.");
        return;
      }
    }
    const customerKey = getOrCreateCustomerKey(acadId);
    customerKeyRef.current = customerKey;
    try {
      const tossPayments = await loadTossPayments(clientKey);
      const successUrl = `${window.location.origin}${routes.myAcademy}?billingPlan=${encodeURIComponent(
        selectedPlan.id,
      )}&customerKey=${encodeURIComponent(customerKey)}`;
      const failUrl = successUrl;
      await tossPayments.requestBillingAuth("카드", {
        customerKey,
        successUrl,
        failUrl,
      });
    } catch (err) {
      error(err instanceof Error ? err.message : "카드 등록 창을 열지 못했습니다.");
    }
  };

  // 카드 등록 완료 후 처리는 마이페이지(MyAcademy)가 담당 (successUrl을 myAcademy로 지정)

  const handleSubmit = async () => {
    if (!selectedPlan) return;
    // 요금제 다운그레이드 시 원생 수 초과 여부는 서버에서 최종 검증합니다.
    if (billingBlocked) {
      await handleCardRegister();
      return;
    }
    setSaving(true);
    try {
      await apiUpsertSubscription({
        planId: selectedPlan.id,
        planName: selectedPlan.name,
        amountKrw: selectedPlan.priceKrw,
        currency: "KRW",
      });
      // Clear cached subscription/KPI so UI reflects the new plan immediately
      queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] }).catch(() => {});
      try {
        const { invalidateCache } = await import("@/lib/fetcher");
        invalidateCache([
          "/api/payments/toss/subscription",
          "/api/dashboard/summary",
        ]);
      } catch {
        /* ignore cache invalidation failures */
      }
      success("요금제가 변경되었습니다.");
      navigate(routes.myAcademy, { replace: true });
    } catch (err) {
      error(err instanceof Error ? err.message : "요금제 변경에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(routes.myAcademy, { replace: true });
  };

  const handleLogout = () => {
    logout();
    navigate(routes.login, { replace: true });
  };

  return (
    <PageWrapper>
      <PlanCardShell>
        <PlanHeaderBar>
          <div>
            <h1>요금제 선택 / 변경</h1>
            <p>원생 규모에 맞는 요금제를 선택하고 필요 시 결제수단을 등록하세요.</p>
          </div>
          {billingBlocked && (
            <HeaderRight>
              <BillingBadge>결제가 필요합니다</BillingBadge>
              <LogoutButton type="button" onClick={handleLogout}>
                로그아웃
              </LogoutButton>
            </HeaderRight>
          )}
        </PlanHeaderBar>
        <PageContainer>
          {loading ? (
            <RegisterHint>현재 요금제를 불러오는 중입니다…</RegisterHint>
          ) : (
            <>
              {subscription && (
                <CurrentPlanCard>
                  <Label>현재 요금제</Label>
                  <Value>
                    {subscription.planName || getPlanById(subscription.planId)?.name || "설정되지 않음"}
                  </Value>
                </CurrentPlanCard>
              )}
              <PlanLabel>
                원생 규모<span>*</span>
              </PlanLabel>
              <ChoiceList>
                {STUDENT_SCALE_OPTIONS.map((option) => (
                  <ScaleCard
                    key={option.id}
                    type="button"
                    data-active={studentScale === option.id}
                    onClick={() => setStudentScale(option.id)}
                  >
                    {option.label}
                  </ScaleCard>
                ))}
              </ChoiceList>

              <PlanLabel>
                추천 요금제<span>*</span>
              </PlanLabel>
              <PlanGrid>
                {availablePlans.length === 0 ? (
                  <RegisterHint>원생 규모를 선택하면 추천 요금제가 나타납니다.</RegisterHint>
                ) : (
                  availablePlans.map((planId) => {
                    const plan = getPlanById(planId);
                    if (!plan) return null;
                    const active = selectedPlanId === plan.id;
                    return (
                      <PlanCard
                        key={plan.id}
                        type="button"
                        data-active={active}
                        onClick={() => setSelectedPlanId(plan.id)}
                      >
                        <PlanHeader>
                          <PlanTitle>{plan.name}</PlanTitle>
                          <PlanDescription>{plan.desc}</PlanDescription>
                          <PlanPriceWrapper>
                            {plan.originalPrice && <PlanOriginalPrice>{plan.originalPrice}</PlanOriginalPrice>}
                            <PlanPrice>
                              {plan.id === "free" ? "무료" : plan.priceKrw.toLocaleString("ko-KR")}
                              {plan.id === "free" ? null : <span>/월</span>}
                            </PlanPrice>
                          </PlanPriceWrapper>
                        </PlanHeader>
                        <PlanButton>{active ? "선택됨" : "이 요금제 선택"}</PlanButton>
                      </PlanCard>
                    );
                  })
                )}
              </PlanGrid>
              <Actions>
                <GhostButton type="button" onClick={handleCancel} disabled={saving}>
                  취소
                </GhostButton>
                <PrimaryButton
                  type="button"
                  onClick={handleSubmit}
                  disabled={saving || !selectedPlan}
                >
                  {saving
                    ? "진행 중..."
                    : billingBlocked
                    ? "카드 등록하기"
                    : "요금제 변경 완료"}
                </PrimaryButton>
              </Actions>
            </>
          )}
        </PageContainer>
      </PlanCardShell>
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

const PlanCardShell = styled.div`
  width: 100%;
  max-width: 1120px;
  background: transparent;
  padding: 48px 40px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  @media (max-width: 640px) {
    padding: 32px 24px;
  }
`;

const PlanHeaderBar = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  h1 {
    margin: 0;
    font-size: 28px;
    font-weight: 800;
    color: ${(p) => p.theme.colors.text};
    letter-spacing: -0.03em;
  }
  p {
    margin: 6px 0 0;
    color: ${(p) => p.theme.colors.textMuted};
    font-size: 14px;
  }
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
`;

const BillingBadge = styled.span`
  padding: 6px 10px;
  border-radius: 999px;
  background: #fef2f2;
  color: #b91c1c;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

const LogoutButton = styled.button`
  border-radius: 999px;
  border: 1px solid ${(p) => p.theme.colors.border};
  background: #ffffff;
  padding: 8px 14px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  color: ${(p) => p.theme.colors.text};
  &:hover {
    background: ${(p) => p.theme.colors.surfaceMuted};
  }
`;

const PageContainer = styled.div`
  display: grid;
  gap: 16px;
`;

const CurrentPlanCard = styled.div`
  border-radius: 14px;
  border: none;
  background: ${(p) => p.theme.colors.surfaceMuted};
  padding: 12px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const Label = styled.span`
  font-size: 12px;
  color: ${(p) => p.theme.colors.textMuted};
  letter-spacing: 0.03em;
`;

const Value = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: ${(p) => p.theme.colors.text};
`;

const PlanCard = styled(RegisterPlanCard)``;

const Actions = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;
