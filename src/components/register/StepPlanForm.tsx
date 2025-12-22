import { useEffect, useMemo, useState, type FormEventHandler } from "react";
import styled from "styled-components";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { PrimaryButtonLg as UIPrimaryBtn } from "@/components/common/UI";
import type { PlanSelection, StudentScaleOption, UseRegisterFlowResult } from "@/features/register/useRegisterFlow";
import {
  Sub,
  Form,
  Hint,
  ErrorText,
  ChoiceBadge,
  ChoiceList,
  ScaleCard,
  AgreeRow,
  ScrollArea,
  TermsBody,
  ActionRow,
  BackButton,
  PlanGrid,
  PlanCard,
  PlanHeader,
  PlanTitle,
  PlanDescription,
  PlanPriceWrapper,
  PlanPrice,
  PlanTrialBadge,
  PlanButton,
  PlanFeatures,
  PlanFeatureItem,
  PlanFeatureIcon,
  PlanFeatureText,
  PlanLabel,
  PlanOriginalPrice,
  PlanFeatureSectionTitle,
} from "./RegisterForm.styles";
import { TERMS_TEXT, PRIVACY_TEXT } from "./registerTermsContent";
import { PgFeeGuideModal } from "@/components/payments/PgFeeGuideModal";
import { cleanPolicyText, PAYMENT_REFUND_POLICY_TEXT } from "@/lib/policyText";

type StepPlanFormProps = {
  flow: UseRegisterFlowResult;
  onSubmit: FormEventHandler<HTMLFormElement>;
  onBack: () => void;
};

type PlanId = Exclude<PlanSelection, "">;

const STUDENT_SCALE_OPTIONS: Array<{ id: StudentScaleOption; label: string; helper: string }> = [
  { id: "UNDER_50", label: "50명 이하", helper: "신규·소규모 학원" },
  { id: "RANGE_50_100", label: "50~120명", helper: "원생 120명까지 관리" },
  { id: "RANGE_100_300", label: "120~300명", helper: "중형 학원 추천" },
  { id: "RANGE_300_500", label: "300~500명", helper: "대형 학원·지점" },
  { id: "OVER_500", label: "500명 이상", helper: "맞춤 상담 연결" },
];

const PLAN_MAPPING: Record<StudentScaleOption, PlanId[]> = {
  UNDER_50: ["free", "plan-100-basic", "plan-100-pay"],
  RANGE_50_100: ["plan-100-basic", "plan-100-pay"],
  RANGE_100_300: ["plan-300-basic", "plan-300-pay"],
  RANGE_300_500: ["plan-500-basic", "plan-500-pay"],
  OVER_500: ["enterprise"],
  "": [],
};

const PAYMENT_POLICY_TEXT = PAYMENT_REFUND_POLICY_TEXT;

type PlanFeature = {
  title: string;
  desc?: string;
  icon?: "sparkle" | "check" | "infinity" | "x";
};

const PLANS: Record<
  PlanId,
  {
    name: string;
    label: string;
    desc: string;
    price: string;
    originalPrice?: string;
    period?: string;
    btnLabel: string;
    features: PlanFeature[];
    highlight?: boolean;
    paymentIncluded?: boolean;
  }
> = {
  free: {
    name: "Free",
    label: "무료 플랜",
    desc: "소규모 개인/체험 학원을 위한 입문 플랜",
    price: "무료",
    period: "/월",
    btnLabel: "무료로 시작하기",
    paymentIncluded: false,
    features: [
      { title: "원생관리", desc: "최대 50명 · 원생 정보·시험·상담을 한눈에 관리" },
      { title: "수업관리", desc: "파일 첨부 불가 · 수업 기록과 내용을 간편하게 정리" },
      { title: "출결관리", desc: "모바일 앱과 연동해 출결을 자동으로 관리" },
      { title: "마케팅", desc: "월 30회 · 수업 내용만 입력하면 AI가 인스타그램/블로그 캡션을 자동 생성" },
      { icon: "x", title: "결제관리", desc: "포함되지 않음 · 결제 요청·미납 관리는 상위 플랜에서 이용 가능" },
      { icon: "x", title: "보고서", desc: "포함되지 않음 · 월간 보고서 생성 기능은 상위 플랜에서 제공" },
      { icon: "x", title: "강사관리", desc: "포함되지 않음 · 강사별 관리 기능 미제공" },
    ],
  },
  "plan-100-basic": {
    name: "Small Basic",
    label: "120명 · 결제 기능 없음",
    desc: "원생 120명 이하, 결제 없이 운영하는 기본 유료 플랜",
    price: "무료",
    originalPrice: "9,000원",
    period: "/월",
    btnLabel: "Small Basic 선택",
    highlight: true,
    paymentIncluded: false,
    features: [
      { title: "원생관리", desc: "최대 120명 · 원생 정보·시험·상담을 한눈에 관리" },
      { title: "수업관리", desc: "수업 기록과 내용을 간편하게 정리" },
      { title: "출결관리", desc: "모바일 앱과 연동해 출결을 자동으로 관리" },
      { title: "마케팅", desc: "월 60회 · 수업 내용만 입력하면 AI가 인스타그램/블로그 캡션을 자동 생성" },
      { title: "강사관리", desc: "최대 3명 · 강사별 수업·원생 관리" },
      { icon: "x", title: "결제관리", desc: "포함되지 않음 · 결제 요청·미납 관리 기능 없음" },
      { icon: "x", title: "보고서", desc: "포함되지 않음 · 월간 보고서 생성 기능 없음" },
    ],
  },
  "plan-100-pay": {
    name: "Small Plus",
    label: "120명 · 결제 기능 포함",
    desc: "원생 120명 이하, 결제 및 보고서를 포함한 플랜",
    price: "무료",
    originalPrice: "19,900원",
    period: "/월",
    btnLabel: "Small Plus 선택",
    paymentIncluded: true,
    features: [
      { title: "원생관리", desc: "최대 120명 · 원생 정보·시험·상담을 한눈에 관리" },
      { title: "수업관리", desc: "수업 기록과 내용을 간편하게 정리" },
      { title: "출결관리", desc: "모바일 앱과 연동해 출결을 자동으로 관리" },
      { title: "마케팅", desc: "월 60회 · 수업 내용만 입력하면 AI가 인스타그램/블로그 캡션을 자동 생성" },
      { title: "강사관리", desc: "최대 3명 · 강사별 수업·원생 관리" },
      { title: "결제관리", desc: "결제 요청부터 미납 관리까지 한 화면에서 처리" },
      { title: "보고서", desc: "입력된 데이터를 바탕으로 월간 학습 보고서 자동 생성" },
    ],
  },
  "plan-300-basic": {
    name: "Medium Basic",
    label: "300명 · 결제 기능 없음",
    desc: "중형 학원(최대 300명)을 위한 기본 플랜",
    price: "18,000원",
    period: "/월",
    btnLabel: "Medium Basic 선택",
    paymentIncluded: false,
    features: [
      { title: "원생관리", desc: "최대 300명 · 원생 정보·시험·상담을 한눈에 관리" },
      { title: "수업관리", desc: "수업 기록과 내용을 간편하게 정리" },
      { title: "출결관리", desc: "모바일 앱과 연동해 출결을 자동으로 관리" },
      { title: "마케팅", desc: "월 60회 · 수업 내용만 입력하면 AI가 인스타그램/블로그 캡션을 자동 생성" },
      { title: "강사관리", desc: "최대 7명 · 강사별 수업·원생 관리" },
      { icon: "x", title: "결제관리", desc: "포함되지 않음 · 결제 요청·미납 관리 기능 없음" },
      { icon: "x", title: "보고서", desc: "포함되지 않음 · 월간 보고서 생성 기능 없음" },
    ],
  },
  "plan-300-pay": {
    name: "Medium Plus",
    label: "300명 · 결제 기능 포함",
    desc: "중형 학원의 결제·보고서까지 포함한 플랜",
    price: "36,900원",
    period: "/월",
    btnLabel: "Medium Plus 선택",
    highlight: true,
    paymentIncluded: true,
    features: [
      { title: "원생관리", desc: "최대 300명 · 원생 정보·시험·상담을 한눈에 관리" },
      { title: "수업관리", desc: "수업 기록과 내용을 간편하게 정리" },
      { title: "출결관리", desc: "모바일 앱과 연동해 출결을 자동으로 관리" },
      { title: "마케팅", desc: "월 60회 · 수업 내용만 입력하면 AI가 인스타그램/블로그 캡션을 자동 생성" },
      { title: "강사관리", desc: "최대 7명 · 강사별 수업·원생 관리" },
      { title: "결제관리", desc: "결제 요청부터 미납 관리까지 한 화면에서 처리" },
      { title: "보고서", desc: "입력된 데이터를 바탕으로 월간 학습 보고서 자동 생성" },
    ],
  },
  "plan-500-basic": {
    name: "Large Basic",
    label: "500명 · 결제 기능 없음",
    desc: "대형 학원(최대 500명)을 위한 기본 플랜",
    price: "27,000원",
    period: "/월",
    btnLabel: "Large Basic 선택",
    paymentIncluded: false,
    features: [
      { title: "원생관리", desc: "최대 500명 · 원생 정보·시험·상담을 한눈에 관리" },
      { title: "수업관리", desc: "수업 기록과 내용을 간편하게 정리" },
      { title: "출결관리", desc: "모바일 앱과 연동해 출결을 자동으로 관리" },
      { title: "마케팅", desc: "월 60회 · 수업 내용만 입력하면 AI가 인스타그램/블로그 캡션을 자동 생성" },
      { title: "강사관리", desc: "최대 10명 · 강사별 수업·원생 관리" },
      { icon: "x", title: "결제관리", desc: "포함되지 않음 · 결제 요청·미납 관리 기능 없음" },
      { icon: "x", title: "보고서", desc: "포함되지 않음 · 월간 보고서 생성 기능 없음" },
    ],
  },
  "plan-500-pay": {
    name: "Large Plus",
    label: "500명 · 결제 기능 포함",
    desc: "대형 학원의 결제·보고서까지 포함한 풀 패키지",
    price: "54,900원",
    period: "/월",
    btnLabel: "Large Plus 선택",
    highlight: true,
    paymentIncluded: true,
    features: [
      { title: "원생관리", desc: "최대 500명 · 원생 정보·시험·상담을 한눈에 관리" },
      { title: "수업관리", desc: "수업 기록과 내용을 간편하게 정리" },
      { title: "출결관리", desc: "모바일 앱과 연동해 출결을 자동으로 관리" },
      { title: "마케팅", desc: "월 60회 · 수업 내용만 입력하면 AI가 인스타그램/블로그 캡션을 자동 생성" },
      { title: "강사관리", desc: "최대 10명 · 강사별 수업·원생 관리" },
      { title: "결제관리", desc: "결제 요청부터 미납 관리까지 한 화면에서 처리" },
      { title: "보고서", desc: "입력된 데이터를 바탕으로 월간 학습 보고서 자동 생성" },
    ],
  },
  enterprise: {
    name: "Enterprise",
    label: "500명 이상",
    desc: "500명 이상 대형 학원/교육 기업을 위한 맞춤 플랜",
    price: "별도 협의",
    btnLabel: "세일즈 팀에 문의하기",
    paymentIncluded: true,
    features: [
      { title: "원생 500명 이상 대형 조직 지원" },
      { title: "맞춤 요금제·기능 구성" },
      { title: "전담 온보딩 및 운영 지원" },
      { title: "전용 AI 사용량/정산 구조 협의" },
    ],
  },
};

const TRIAL_BADGE_BY_PLAN: Partial<Record<PlanId, string>> = {
  "plan-100-basic": "2월 15일까지 무료",
  "plan-100-pay": "2월 15일까지 무료",
  "plan-300-basic": "1월 20일까지 무료",
  "plan-300-pay": "1월 20일까지 무료",
  "plan-500-basic": "1월 10일까지 무료",
  "plan-500-pay": "1월 10일까지 무료",
};

function getTrialBadge(planId: PlanId): string | null {
  return TRIAL_BADGE_BY_PLAN[planId] ?? null;
}

const Icons = {
  sparkle: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="currentColor" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  infinity: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18.83 16a5.5 5.5 0 0 0 0-7.78l-6.9 8a5.5 5.5 0 0 1-7.78 0 5.5 5.5 0 0 1 0-7.78l6.9 8a5.5 5.5 0 0 0 7.78 0Z" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
};

export function StepPlanForm({ flow, onSubmit, onBack }: StepPlanFormProps) {
  const {
    studentScale,
    setStudentScale,
    selectedPlan,
    setSelectedPlan,
    agree,
    setAgree,
    showTerms,
    setShowTerms,
    showPrivacy,
    setShowPrivacy,
    loading,
    canSubmitStep3,
    error,
  } = flow;
  const [showPolicy, setShowPolicy] = useState(false);
  const [pgFeeGuideOpen, setPgFeeGuideOpen] = useState(false);

  const availablePlans = useMemo(() => PLAN_MAPPING[studentScale] ?? [], [studentScale]);
  const requiresSettlementAccount = useMemo(() => {
    if (!selectedPlan) return false;
    return Boolean(PLANS[selectedPlan as PlanId]?.paymentIncluded);
  }, [selectedPlan]);
  const submitLabel = requiresSettlementAccount ? "정산 계좌 등록하기" : "완료";

  useEffect(() => {
    if (availablePlans.length === 0) {
      setSelectedPlan("");
      return;
    }
    if (selectedPlan !== "" && !availablePlans.includes(selectedPlan as PlanId)) {
      setSelectedPlan("");
    }
  }, [availablePlans, selectedPlan, setSelectedPlan]);

  return (
    <>
      <Sub>원생 규모와 요금제를 선택해 주세요.</Sub>
      <Form onSubmit={onSubmit} style={{ maxWidth: '100%' }}>
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

	        <PlanLabelRow>
	          <PlanLabel>
	            추천 요금제<span>*</span>
	          </PlanLabel>
	          <FeePolicyBox aria-label="수수료 안내">
	            <PolicyButton type="button" onClick={() => setPgFeeGuideOpen(true)}>
	              수수료 규정
	            </PolicyButton>
	          </FeePolicyBox>
	        </PlanLabelRow>
        {availablePlans.length === 0 ? (
          <Hint>원생 규모를 선택하면 추천 요금제가 나타납니다.</Hint>
        ) : (
          <PlanGrid>
            {availablePlans.map((planId) => {
              const plan = PLANS[planId];
              const active = selectedPlan === planId;
              const badgeVariant = plan.paymentIncluded ? "muted" : "warning";
              const badgeLabel = plan.paymentIncluded ? "결제 기능 포함" : "결제 기능 미포함";
              const trialBadge = getTrialBadge(planId);
              const availableFeatures = plan.features.filter((feat) => feat.icon !== "x");
              const unavailableFeatures = plan.features.filter((feat) => feat.icon === "x");
              return (
                <PlanCard
                  key={planId}
                  type="button"
                  data-active={active}
                  data-highlight={plan.highlight ? "true" : "false"}
                  onClick={() => setSelectedPlan(planId)}
                >
	                  <PlanHeader>
	                    <ChoiceBadge data-variant={badgeVariant}>{badgeLabel}</ChoiceBadge>
	                    <PlanTitle>{plan.name}</PlanTitle>
	                    <PlanDescription>{plan.desc}</PlanDescription>
	                    <PlanPriceWrapper>
	                      {plan.originalPrice && <PlanOriginalPrice>{plan.originalPrice}</PlanOriginalPrice>}
	                      <PlanPrice>
	                        {plan.price}
	                        {plan.period && <span>{plan.period}</span>}
	                      </PlanPrice>
	                    </PlanPriceWrapper>
                      {trialBadge ? <PlanTrialBadge>{trialBadge}</PlanTrialBadge> : null}
	                  </PlanHeader>
                  
                  <PlanButton>{plan.btnLabel}</PlanButton>
                  
                  <PlanFeatures>
                    {availableFeatures.length > 0 && (
                      <>
                        <PlanFeatureSectionTitle>포함 기능</PlanFeatureSectionTitle>
                        {availableFeatures.map((feat, idx) => (
                          <PlanFeatureItem key={`a-${idx}`}>
                            <PlanFeatureIcon>{Icons[feat.icon || "check"]}</PlanFeatureIcon>
                            <PlanFeatureText>
                              <b>{feat.title}</b>
                              {feat.desc && <span>{feat.desc}</span>}
                            </PlanFeatureText>
                          </PlanFeatureItem>
                        ))}
                      </>
                    )}
                    {unavailableFeatures.length > 0 && (
                      <>
                        <PlanFeatureSectionTitle data-variant="negative">
                          미포함 / 제한
                        </PlanFeatureSectionTitle>
                        {unavailableFeatures.map((feat, idx) => (
                          <PlanFeatureItem key={`u-${idx}`} data-unavailable="true">
                            <PlanFeatureIcon>{Icons[feat.icon || "x"]}</PlanFeatureIcon>
                            <PlanFeatureText>
                              <b>{feat.title}</b>
                              {feat.desc && <span>{feat.desc}</span>}
                            </PlanFeatureText>
                          </PlanFeatureItem>
                        ))}
                      </>
                    )}
                  </PlanFeatures>
                </PlanCard>
              );
            })}
          </PlanGrid>
        )}

        {error && <ErrorText>{error}</ErrorText>}

        <AgreeRow>
          <input id="agree-plan" type="checkbox" checked={agree} onChange={(event) => setAgree(event.target.checked)} />
          <label htmlFor="agree-plan">
            이용약관 및 개인정보 처리방침에 동의합니다{" "}
            <a
              href="#"
              onClick={(event) => {
                event.preventDefault();
                setShowTerms(true);
              }}
            >
              이용약관
            </a>{" "}
            ·{" "}
            <a
              href="#"
              onClick={(event) => {
                event.preventDefault();
                setShowPrivacy(true);
              }}
            >
              개인정보 처리방침
            </a>
            {" · "}
            <a
              href="#"
              onClick={(event) => {
                event.preventDefault();
                setShowPolicy(true);
              }}
            >
              결제/환불 정책
            </a>
          </label>
        </AgreeRow>

        <ActionRow>
          <BackButton label="뒤로" onClick={onBack} />
          <UIPrimaryBtn type="submit" disabled={!canSubmitStep3}>
            {loading ? "완료 중..." : submitLabel}
          </UIPrimaryBtn>
        </ActionRow>
      </Form>

      <ConfirmDialog
        open={showTerms}
        title="이용약관"
        message={
          <ScrollArea>
            <TermsBody>{cleanPolicyText(TERMS_TEXT)}</TermsBody>
          </ScrollArea>
        }
        hideCancel
        confirmLabel="닫기"
        maxWidth={720}
        onConfirm={() => setShowTerms(false)}
        onCancel={() => setShowTerms(false)}
      />
      <ConfirmDialog
        open={showPrivacy}
        title="개인정보 처리방침"
        message={
          <ScrollArea>
            <TermsBody>{cleanPolicyText(PRIVACY_TEXT)}</TermsBody>
          </ScrollArea>
        }
        hideCancel
        confirmLabel="닫기"
        maxWidth={720}
        onConfirm={() => setShowPrivacy(false)}
        onCancel={() => setShowPrivacy(false)}
      />
	      <ConfirmDialog
	        open={showPolicy}
	        title="결제/환불 정책"
	        message={
          <ScrollArea>
            <TermsBody>{cleanPolicyText(PAYMENT_POLICY_TEXT)}</TermsBody>
          </ScrollArea>
        }
        hideCancel
        confirmLabel="닫기"
        maxWidth={720}
	        onConfirm={() => setShowPolicy(false)}
	        onCancel={() => setShowPolicy(false)}
	      />
	      <PgFeeGuideModal open={pgFeeGuideOpen} onClose={() => setPgFeeGuideOpen(false)} />
	    </>
	  );
	}

const PlanLabelRow = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

const FeePolicyBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  flex-wrap: wrap;
  .note {
    font-size: 12px;
    color: ${(p) => p.theme.colors.textMuted};
    white-space: nowrap;
  }
`;

const PolicyButton = styled.button`
  height: 30px;
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.surface};
  border-radius: 999px;
  padding: 0 12px;
  font-size: 12px;
  font-weight: 700;
  color: ${(p) => p.theme.colors.text};
  cursor: pointer;
  &:hover {
    background: ${(p) => p.theme.colors.surfaceMuted};
  }
`;
