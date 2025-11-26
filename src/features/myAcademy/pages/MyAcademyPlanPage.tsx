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
import { loadTossPayments } from "@/lib/tossPayments";

type BillingPlanConfig = {
  id: string;
  name: string;
  desc: string;
  priceKrw: number;
  originalPrice?: string;
};

const PLANS: BillingPlanConfig[] = [
  { id: "free", name: "Free", desc: "50명 이하 · 무료 체험용", priceKrw: 0 },
  { id: "plan-100-basic", name: "Small Basic", desc: "총원 100명 · 결제 기능 없음(무료 플랜과 중복 불가)", priceKrw: 9000 },
  { id: "plan-100-pay", name: "Small Plus", desc: "총원 100명 · 결제 기능 포함", priceKrw: 18000 },
  { id: "plan-300-basic", name: "Midium Basic", desc: "300명 · 결제 기능 없음", priceKrw: 18000 },
  { id: "plan-300-pay", name: "Midium Plus", desc: "300명 · 결제 기능 포함", priceKrw: 34000 },
  { id: "plan-500-basic", name: "Large Basic", desc: "500명 · 결제 기능 없음", priceKrw: 27000 },
  { id: "plan-500-pay", name: "Large Plus", desc: "500명 · 결제 기능 포함", priceKrw: 52000 },
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [subscription, setSubscription] = useState<SubscriptionDto | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [studentScale, setStudentScale] = useState<StudentScaleOption>("UNDER_50");
  const { success, error } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const billingBlocked = Boolean((location.state as any)?.reason === "billing-block");
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
        if (sub && (sub as any)?.id) {
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
    } catch (e: any) {
      error(e?.message || "카드 등록 창을 열지 못했습니다.");
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
    } catch (e: any) {
      error(e?.message || "요금제 변경에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(routes.myAcademy, { replace: true });
  };

  return (
    <PageContainer>
      <Header>
        <div>
          <h1>요금제 선택 / 변경</h1>
          <p>원생 규모와 요금제를 회원가입 시 화면과 동일하게 다시 선택할 수 있습니다.</p>
        </div>
      </Header>
      {loading ? (
        <RegisterHint>현재 요금제를 불러오는 중입니다…</RegisterHint>
      ) : (
        <>
          {isTrialing && (
            <RegisterHint>
              무료 체험 기간에는 요금제를 변경할 수 없습니다. 체험 종료 후 결제수단 등록과 함께 요금제를 선택해 주세요.
            </RegisterHint>
          )}
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
                          {plan.id === "free"
                            ? "무료"
                            : plan.priceKrw.toLocaleString("ko-KR")}
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
            <OutlineBtn type="button" onClick={handleCancel} disabled={saving}>
              취소
            </OutlineBtn>
            <PrimaryBtn
              type="button"
              onClick={handleSubmit}
              disabled={saving || !selectedPlan || isTrialing}
            >
              {saving
                ? "진행 중..."
                : billingBlocked
                ? "카드 등록하기"
                : "요금제 변경 완료"}
            </PrimaryBtn>
          </Actions>
        </>
      )}
    </PageContainer>
  );
}

const PageContainer = styled.div`
  display: grid;
  gap: 16px;
`;

const Header = styled.header`
  h1 {
    margin: 0;
    font-size: 22px;
    color: #111827;
  }
  p {
    margin: 6px 0 0;
    color: #6b7280;
    font-size: 13px;
  }
`;

const CurrentPlanCard = styled.div`
  border-radius: 14px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const Label = styled.span`
  font-size: 12px;
  color: #6b7280;
  letter-spacing: 0.03em;
`;

const Value = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: #111827;
`;

const PlanCard = styled(RegisterPlanCard)``;

const Actions = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const OutlineBtn = styled.button`
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const PrimaryBtn = styled.button`
  border-radius: 999px;
  border: none;
  background: #4f46e5;
  padding: 8px 18px;
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
  cursor: pointer;
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
