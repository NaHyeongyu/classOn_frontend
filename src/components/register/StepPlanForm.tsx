import { useEffect, useMemo, useState, type FormEventHandler } from "react";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { PrimaryButtonLg as UIPrimaryBtn } from "@/components/common/UI";
import type { PlanSelection, StudentScaleOption, UseRegisterFlowResult } from "@/features/register/useRegisterFlow";
import {
  Sub,
  Form,
  Label,
  Hint,
  ErrorText,
  ChoiceBadge,
  ChoiceList,
  ScaleCard,
  ChoiceTitle,
  ChoiceMeta,
  ChoiceNote,
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
  PlanButton,
  PlanDivider,
  PlanFeatures,
  PlanFeatureItem,
  PlanFeatureIcon,
  PlanFeatureText,
  PlanLabel,
  PlanOriginalPrice,
} from "./RegisterForm.styles";
import { TERMS_TEXT, PRIVACY_TEXT } from "./registerTermsContent";

const cleanPolicyText = (value: string) => value.replace(/\t+/g, "").replace(/ {2,}/g, " ").trim();

type StepPlanFormProps = {
  flow: UseRegisterFlowResult;
  onSubmit: FormEventHandler<HTMLFormElement>;
  onBack: () => void;
};

type PlanId = Exclude<PlanSelection, "">;

const STUDENT_SCALE_OPTIONS: Array<{ id: StudentScaleOption; label: string; helper: string }> = [
  { id: "UNDER_50", label: "50명 이하", helper: "신규·소규모 학원" },
  { id: "RANGE_50_100", label: "50~100명", helper: "원생 100명까지 관리" },
  { id: "RANGE_100_300", label: "100~300명", helper: "중형 학원 추천" },
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

const PAYMENT_POLICY_TEXT = `제1조 (결제 방식)
1. 본 플랫폼(이하 "제공자")이 제공하는 SaaS 서비스(이하 "서비스")는 월정액 방식의 자동결제로만 제공됩니다.
2. 가입기관이 결제를 완료한 시점부터 해당 월의 서비스 이용이 시작됩니다.
3. 결제 완료 시 제공자는 가입기관에게 청구서 또는 결제내역을 발행하며, 그 내역에는 요금제 명칭, 결제금액, 결제일, 이용기간 등이 포함됩니다.

제2조 (자동 연장 및 해지)
1. 이용기간이 만료되기 전에 가입기관이 별도의 해지 요청을 하지 않을 경우, 본 계약은 동일 요금 및 조건으로 자동 연장됩니다.
2. 자동 연장 적용 이전에 요금 또는 약관의 주요 변경이 있을 경우, 제공자는 적어도 30일 전에 서면(전자문서 포함) 또는 플랫폼 알림으로 가입기관에 안내해야 합니다.
3. 가입기관이 다음 월 결제를 원치 않을 경우, 현재 이용기간 만료일 3영업일 전까지 제공자에게 서면 또는 전자문서로 해지 의사를 통보해야 하며, 통보가 없으면 자동으로 다음 월 결제가 진행됩니다.

제3조 (환불 정책)
1. 가입기관이 월정액 결제를 완료한 후 서비스 이용이 시작된 경우, 원칙적으로 환불이 불가능합니다.
2. 다만 다음과 같은 예외 사유가 확인된 경우에는 제공자가 잔여기간에 대해 일할 산정 환불 또는 크레딧 형태 환불을 제공할 수 있습니다:
- 제공자의 귀책사유로 인해 서비스 제공이 불가능하거나, 약정된 주요 기능이 현저히 미제공된 경우
- 결제 오류, 이중결제 등 명백한 과실이 확인된 경우
3. 가입기관 사유(내부 사정, 이용의지 부족 등)로 인한 해지 요청 시에는 제1항의 환불 불가 원칙이 적용됨을 명확히 고지합니다.

제4조 (환불 요청 및 처리 절차)
1. 환불을 요청하고자 하는 가입기관은 요청일로부터 영업일 기준 5일 이내에 제공자에게 서면 또는 전자문서로 요청해야 하며, 제공자는 요청 접수 후 3영업일 이내에 환불 가능 여부 및 산정내역을 통지합니다.
2. 환불이 승인된 경우, 제공자는 통지 후 최대 7영업일 이내에 결제에 사용된 동일한 수단으로 환급을 완료하도록 노력합니다. 동일 수단이 불가능할 경우, 그 사유 및 대체방법을 사전에 안내해야 합니다.
3. 환불이 불가한 사유(본 약관 제3조 해당, 약관 미고지 등)는 환불 요청 이전에 가입기관에게 명확히 고지되어야 합니다.

제5조 (요금 및 약관 변경)
1. 제공자는 요금 또는 서비스 조건을 변경할 경우 그 사유, 적용일자, 변경내용을 가입기관에게 최소 30일 이상 전에 고지해야 합니다.
2. 가입기관이 고지된 변경 적용일 이전에 별도 해지 의사를 통보하지 않는 경우, 자동으로 변경된 요금 및 조건이 적용됩니다.
3. 가입기관이 변경된 조건을 수용할 수 없고 변경 적용일 이전 해지 의사를 통보한 경우, 다음 월 결제는 진행되지 않으며 환불 대상이 아닙니다.

제6조 (서비스 중단 및 환불)
1. 제공자가 예외적으로 서비스 전체 또는 일부를 중단(폐지 포함)하는 경우, 제공자는 가능한 한 사전 고지하며, 이용이 불가능한 잔여기간에 해당하는 금액을 일할 산정하여 환불 또는 동등한 대체서비스 크레딧을 제공할 수 있습니다.
2. 가입기관이 이 사유로 인해 이용을 중단할 경우, 해지일 이후 잔여기간에 대해서만 제1항 기준에 따라 환불 적용됩니다.

제7조 (고지 및 동의)
1. 본 결제/환불 정책은 가입기관이 결제하기 전에 약관 및 결제화면에서 확인할 수 있어야 하며, 가입기관이 결제 버튼을 클릭함으로써 본 정책에 동의한 것으로 간주됩니다.
2. 본 정책이 변경될 경우, 제공자는 변경 내용 및 적용일을 가입기관에게 서면 또는 전자문서로 최소 30일 전에 고지해야 하며, 변경 적용일 이전 해지 통보가 없는 가입기관에 대해서는 변경된 정책이 적용됩니다.

제8조 (준거법 및 분쟁해결)
1. 본 약관에 명시되지 않은 사항은 대한민국 법령(전자상거래 등에서의 소비자보호에 관한 법률, 약관의 규제에 관한 법률, 민법 등) 및 기타 관련 법령을 준수합니다.
2. 제공자와 가입기관은 본 약관과 관련해 분쟁이 발생한 경우 상호 협의하여 해결하며, 합의가 이루어지지 않을 경우 제공자 본사의 소재지를 관할하는 법원을 제1심 관할 법원으로 합니다.
3. 본 약관은 가입기관이 결제를 완료하는 시점에 효력이 발생합니다.`;

type PlanFeature = {
  title: string;
  desc?: string;
  icon?: "sparkle" | "check" | "infinity";
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
    label: "무료 체험용",
    desc: "소규모 개인/체험 학원을 위한 기본 플랜",
    price: "무료",
    period: "/월",
    btnLabel: "무료로 시작하기",
    paymentIncluded: false,
    features: [
      { title: "원생 50명 이하 기본 관리" },
      { title: "강사 계정 관리 없음" },
      { title: "결제 기능 미제공" },
      { title: "월 AI 호출 30회" },
      { title: "파일 첨부 기능 사용 불가" },
    ],
  },
  "plan-100-basic": {
    name: "Small Basic",
    label: "100명 · 결제 기능 없음",
    desc: "원생 총원 100명 이하, 결제 없이 운영하는 유료 플랜",
    price: "9,000원",
    period: "/월",
    btnLabel: "Small Basic 선택",
    highlight: true,
    paymentIncluded: false,
    features: [
      { title: "원생 총원 100명까지 관리" },
      { title: "강사 계정 최대 3명" },
      { title: "결제 기능 미포함 (무료 플랜과 중복 사용 불가)" },
      { title: "마케팅 AI 호출 월 200회 제한" },
      { title: "출결·수업·공지 기본 제공" },
    ],
  },
  "plan-100-pay": {
    name: "Small Plus",
    label: "100명 · 결제 기능 포함",
    desc: "원생 총원 100명 이하, 온라인 수강료 결제·미납 관리를 포함한 플랜",
    price: "18,000원",
    period: "/월",
    btnLabel: "Small Plus 선택",
    paymentIncluded: true,
    features: [
      { title: "원생 총원 100명까지 관리" },
      { title: "강사 계정 최대 3명" },
      { title: "수강료 결제/미납 관리 포함" },
      { title: "마케팅 AI 호출 월 200회 제한" },
      { title: "결제 내역·정산 리포트 제공" },
    ],
  },
  "plan-300-basic": {
    name: "Midium Basic",
    label: "300명 · 결제 기능 없음",
    desc: "중형 학원이 오프라인 결제로만 운영할 때 적합한 플랜",
    price: "18,000원",
    period: "/월",
    btnLabel: "Midium Basic 선택",
    paymentIncluded: false,
    features: [
      { title: "원생 300명 이하 관리" },
      { title: "강사 계정 최대 7명" },
      { title: "결제 기능 미포함" },
      { title: "마케팅 AI 호출 월 600회 제한" },
      { title: "수업·반·원생 관리 고급 기능" },
    ],
  },
  "plan-300-pay": {
    name: "Midium Plus",
    label: "300명 · 결제 기능 포함",
    desc: "중형 학원의 자동 결제·미납 관리를 포함한 플랜",
    price: "34,000원",
    period: "/월",
    btnLabel: "Midium Plus 선택",
    highlight: true,
    paymentIncluded: true,
    features: [
      { title: "원생 300명 이하 관리" },
      { title: "강사 계정 최대 7명" },
      { title: "수강료 결제·미납 자동 관리" },
      { title: "마케팅 AI 호출 월 600회 제한" },
      { title: "정산 리포트 및 청구 자동화" },
    ],
  },
  "plan-500-basic": {
    name: "Large Basic",
    label: "500명 · 결제 기능 없음",
    desc: "대형 학원의 운영·관리를 위한 기본 플랜",
    price: "27,000원",
    period: "/월",
    btnLabel: "Large Basic 선택",
    paymentIncluded: false,
    features: [
      { title: "원생 500명 이하 관리" },
      { title: "강사 계정 최대 10명" },
      { title: "결제 기능 미포함" },
      { title: "마케팅 AI 호출 월 1,000회 제한" },
      { title: "복수 지점·반 구성 대응" },
    ],
  },
  "plan-500-pay": {
    name: "Large Plus",
    label: "500명 · 결제 기능 포함",
    desc: "대형 학원의 결제·정산·운영까지 포함한 풀 패키지",
    price: "52,000원",
    period: "/월",
    btnLabel: "Large Plus 선택",
    highlight: true,
    paymentIncluded: true,
    features: [
      { title: "원생 500명 이하 관리" },
      { title: "강사 계정 최대 10명" },
      { title: "수강료 결제·미납·정산 관리 풀세트" },
      { title: "마케팅 AI 호출 월 1,000회 제한" },
      { title: "다수 지점 및 고급 리포트 제공" },
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

  const availablePlans = useMemo(() => PLAN_MAPPING[studentScale] ?? [], [studentScale]);

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

        <PlanLabel>
          추천 요금제<span>*</span>
        </PlanLabel>
        {availablePlans.length === 0 ? (
          <Hint>원생 규모를 선택하면 추천 요금제가 나타납니다.</Hint>
        ) : (
          <PlanGrid>
            {availablePlans.map((planId) => {
              const plan = PLANS[planId];
              const active = selectedPlan === planId;
              const badgeVariant = plan.paymentIncluded ? "muted" : "warning";
              const badgeLabel = plan.paymentIncluded ? "결제 기능 포함" : "결제 기능 미포함";
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
                  </PlanHeader>
                  
                  <PlanButton>{plan.btnLabel}</PlanButton>
                  
                  <PlanFeatures>
                    {plan.features.map((feat, idx) => (
                      <PlanFeatureItem key={idx}>
                        <PlanFeatureIcon>{Icons[feat.icon || "check"]}</PlanFeatureIcon>
                        <PlanFeatureText>
                          <b>{feat.title}</b>
                          {feat.desc && <span>{feat.desc}</span>}
                        </PlanFeatureText>
                      </PlanFeatureItem>
                    ))}
                  </PlanFeatures>
                </PlanCard>
              );
            })}
          </PlanGrid>
        )}
        {availablePlans.length > 0 && selectedPlan === "" && <Hint>결제 없이 선택만 진행됩니다. 원하는 요금제를 눌러 주세요.</Hint>}

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
          <BackButton type="button" onClick={onBack}>
            이전
          </BackButton>
          <UIPrimaryBtn type="submit" disabled={!canSubmitStep3}>
            {loading ? "완료 중..." : "완료"}
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
    </>
  );
}
