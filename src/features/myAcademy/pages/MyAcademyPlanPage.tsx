import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiGetSubscription, apiUpsertSubscription, apiGetTossClientKey, type SubscriptionDto } from "@/api/billing";
import {
  apiGetMyAcademy,
  apiGetMySeller,
  apiGetPlanUsage,
  apiRequestSellerRegistration,
  apiSyncSeller,
  apiUpdateSeller,
  type AcademyDetail,
  type PlanUsage,
  type SellerDetail,
} from "@/api/account";
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
  PlanTrialBadge,
  PlanButton,
  Hint as RegisterHint,
  ChoiceList,
  ScaleCard,
  PlanFeatures,
  PlanFeatureItem,
  PlanFeatureIcon,
  PlanFeatureText,
  PlanFeatureSectionTitle,
  ChoiceBadge,
} from "@/components/register/RegisterForm.styles";
import styled from "styled-components";
import { useAuth } from "@/hooks/useAuth";
import { loadTossPayments } from "@/lib/tossPayments";
import { getErrorMessage } from "@/lib/errors";
import { PrimaryButton, GhostButton } from "@/components/common/UI";
import { MyAcademySellerModal } from "@/components/myAcademy/MyAcademySellerModal";
import type { SellerModalState } from "@/features/myAcademy/hooks/useMyAcademyPage";
import { PgFeeGuideModal } from "@/components/payments/PgFeeGuideModal";
import { PaymentRefundPolicyModal } from "@/components/billing/PaymentRefundPolicyModal";

type BillingPlanConfig = {
  id: string;
  name: string;
  label: string;
  desc: string;
  priceKrw: number;
  originalPrice?: string;
  paymentIncluded?: boolean;
  features: Array<{
    title: string;
    desc?: string;
    icon?: "check" | "x";
  }>;
};

const TRIAL_BADGE_BY_PLAN_ID: Record<string, string> = {
  "plan-100-basic": "2월 15일까지 무료",
  "plan-100-pay": "2월 15일까지 무료",
  "plan-300-basic": "1월 20일까지 무료",
  "plan-300-pay": "1월 20일까지 무료",
  "plan-500-basic": "1월 10일까지 무료",
  "plan-500-pay": "1월 10일까지 무료",
};

function getTrialBadge(planId: string) {
  return TRIAL_BADGE_BY_PLAN_ID[planId] ?? null;
}

const PLANS: BillingPlanConfig[] = [
  {
    id: "free",
    name: "Free",
    label: "무료 플랜",
    desc: "소규모 개인/체험 학원을 위한 입문 플랜",
    priceKrw: 0,
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
  {
    id: "plan-100-basic",
    name: "Small Basic",
    label: "120명 · 결제 기능 없음",
    desc: "원생 120명 이하, 결제 없이 운영하는 기본 유료 플랜",
    priceKrw: 9000,
    originalPrice: "9,000원",
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
  {
    id: "plan-100-pay",
    name: "Small Plus",
    label: "120명 · 결제 기능 포함",
    desc: "원생 120명 이하, 결제 및 보고서를 포함한 플랜",
    priceKrw: 19900,
    originalPrice: "19,900원",
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
  {
    id: "plan-300-basic",
    name: "Medium Basic",
    label: "300명 · 결제 기능 없음",
    desc: "중형 학원(최대 300명)을 위한 기본 플랜",
    priceKrw: 18000,
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
  {
    id: "plan-300-pay",
    name: "Medium Plus",
    label: "300명 · 결제 기능 포함",
    desc: "중형 학원의 결제·보고서까지 포함한 플랜",
    priceKrw: 36900,
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
  {
    id: "plan-500-basic",
    name: "Large Basic",
    label: "500명 · 결제 기능 없음",
    desc: "대형 학원(최대 500명)을 위한 기본 플랜",
    priceKrw: 27000,
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
  {
    id: "plan-500-pay",
    name: "Large Plus",
    label: "500명 · 결제 기능 포함",
    desc: "대형 학원의 결제·보고서까지 포함한 풀 패키지",
    priceKrw: 54900,
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
];

type StudentScaleOption = "UNDER_50" | "RANGE_50_100" | "RANGE_100_300" | "RANGE_300_500" | "OVER_500" | "";

const STUDENT_SCALE_OPTIONS: Array<{ id: StudentScaleOption; label: string }> = [
  { id: "UNDER_50", label: "50명 이하" },
  { id: "RANGE_50_100", label: "50~120명" },
  { id: "RANGE_100_300", label: "120~300명" },
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

function buildRefSellerId(academy: AcademyDetail | null) {
  const token = Date.now().toString(36).toUpperCase().slice(-8);
  if (academy?.id) return `SELLER_${academy.id}_${token}`;
  return `SELLER_TEMP_${token}`;
}

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

function createSellerForm(academy: AcademyDetail | null, seller: SellerDetail | null): SellerModalState["form"] {
  const company = seller?.company;
  const account = seller?.account;
  const individual = seller?.individual;
  return {
    businessType: seller?.businessType ?? "INDIVIDUAL_BUSINESS",
    refSellerId: seller?.refSellerId ?? buildRefSellerId(academy),
    tossSellerId: seller?.tossSellerId,
    companyName: company?.name ?? academy?.name ?? "",
    representativeName: company?.representativeName ?? academy?.representativeName ?? "",
    businessRegistrationNumber: company?.businessRegistrationNumber ?? academy?.bizNo ?? "",
    companyEmail: company?.email ?? academy?.billingEmail ?? "",
    companyPhone: company?.phone ?? academy?.phone ?? "",
    individualName: individual?.name ?? "",
    individualEmail: individual?.email ?? "",
    individualPhone: individual?.phone ?? "",
    accountBankCode: account?.bankCode ?? "",
    accountNumber: account?.accountNumber ?? "",
    accountHolderName: account?.holderName ?? company?.representativeName ?? academy?.representativeName ?? "",
    metadataJson: seller?.metadataJson,
  };
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
  const [pgFeeGuideOpen, setPgFeeGuideOpen] = useState(false);
  const [policyOpen, setPolicyOpen] = useState(false);
  const [subscription, setSubscription] = useState<SubscriptionDto | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [studentScale, setStudentScale] = useState<StudentScaleOption>("UNDER_50");
  const [planUsage, setPlanUsage] = useState<PlanUsage | null>(null);
  const [academy, setAcademy] = useState<AcademyDetail | null>(null);
  const [seller, setSeller] = useState<SellerDetail | null>(null);
  const [requireSeller, setRequireSeller] = useState(false);
  const [sellerSyncing, setSellerSyncing] = useState(false);
  const { success, error } = useToast();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const billingBlocked = locationState?.reason === "billing-block";
  const [clientKey, setClientKey] = useState<string | null>(null);
  const [academyId, setAcademyId] = useState<number | null>(null);
  const customerKeyRef = useRef<string | null>(null);

  const copyToClipboard = async (label: string, value: string) => {
    const text = (value ?? "").toString();
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      success(`${label}을(를) 복사했습니다.`);
    } catch {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        success(`${label}을(를) 복사했습니다.`);
      } catch {
        error("복사에 실패했습니다. 직접 선택해 복사해 주세요.");
      }
    }
  };

  const [sellerModalOpen, setSellerModalOpen] = useState(false);
  const [sellerModalSubmitting, setSellerModalSubmitting] = useState(false);
  const [sellerModalError, setSellerModalError] = useState<string | null>(null);
  const [sellerModalForm, setSellerModalForm] = useState<SellerModalState["form"]>(() =>
    createSellerForm(null, null),
  );

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [academy, seller, usage, sub, ck] = await Promise.all([
          apiGetMyAcademy().catch(
            (): Awaited<ReturnType<typeof apiGetMyAcademy>> | null => null,
          ),
          apiGetMySeller().catch((): SellerDetail | null => null),
          apiGetPlanUsage().catch((): PlanUsage | null => null),
          apiGetSubscription().catch(
            (): Awaited<ReturnType<typeof apiGetSubscription>> | null => null,
          ),
          apiGetTossClientKey().catch(
            (): Awaited<ReturnType<typeof apiGetTossClientKey>> | null => null,
          ),
        ]);
        if (!alive) return;
        const envBillingClientKey = (import.meta.env.VITE_TOSS_BILLING_CLIENT_KEY ?? "").trim();
        const apiClientKey = (ck?.clientKey ?? "").trim();
        const envLegacyClientKey = (import.meta.env.VITE_TOSS_CLIENT_KEY ?? "").trim();
        setClientKey(envBillingClientKey || apiClientKey || envLegacyClientKey || null);
        setRequireSeller(Boolean(ck?.requireSeller));
        if (academy) {
          setAcademy(academy);
          setAcademyId(academy.id);
        }
        setSeller(seller);
        if (usage) setPlanUsage(usage);
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
        setAcademy(null);
        setSeller(null);
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

  const selectedPlanNeedsPayments = Boolean(selectedPlan?.paymentIncluded);
  const sellerStatusUpper = (seller?.status ?? "").toUpperCase();
  const sellerVerificationPending =
    selectedPlanNeedsPayments &&
    requireSeller &&
    Boolean(seller?.tossSellerId) &&
    (sellerStatusUpper === "PENDING" || sellerStatusUpper === "APPROVAL_REQUIRED");
  const sellerApproved = sellerStatusUpper === "APPROVED";

  const syncSellerStatus = async () => {
    if (sellerSyncing) return;
    if (!seller?.tossSellerId) {
      error("토스 셀러 ID가 없어 동기화할 수 없습니다.");
      return;
    }
    setSellerSyncing(true);
    try {
      const updated = await apiSyncSeller();
      setSeller(updated);
      const status = (updated.status ?? "").toUpperCase();
      if (status === "APPROVED") {
        success("정산 계좌 인증이 완료되었습니다.");
      } else if (status === "REJECTED" || status === "SUSPENDED") {
        error("정산 계좌 인증이 완료되지 않았습니다. 상태를 확인해 주세요.");
      } else {
        success("정산 계좌 인증 상태를 확인했습니다. (인증 대기)");
      }
    } catch (err) {
      error(err instanceof Error ? err.message : "정산 계좌 상태 동기화에 실패했습니다.");
    } finally {
      setSellerSyncing(false);
    }
  };

  useEffect(() => {
    if (!sellerVerificationPending) return;
    let alive = true;
    let timeoutId: number | null = null;
    let totalElapsed = 0;
    const INITIAL_DELAY = 3000;
    const SLOW_DELAY = 10000;
    const SLOW_THRESHOLD = 60_000;
    const STOP_AFTER = 180_000;

    const schedule = (delay: number) => {
      timeoutId = window.setTimeout(() => {
        void poll();
      }, delay);
    };

    const poll = async () => {
      if (!alive) return;
      try {
        const updated = await apiSyncSeller();
        if (!alive) return;
        setSeller(updated);
        const status = (updated.status ?? "").toUpperCase();
        if (status === "APPROVED" || status === "REJECTED" || status === "SUSPENDED") {
          return;
        }
      } catch {
        if (!alive) return;
      }
      const delay = totalElapsed >= SLOW_THRESHOLD ? SLOW_DELAY : INITIAL_DELAY;
      totalElapsed += delay;
      if (totalElapsed > STOP_AFTER) return;
      schedule(delay);
    };

    void poll();
    return () => {
      alive = false;
      if (timeoutId !== null) window.clearTimeout(timeoutId);
    };
  }, [sellerVerificationPending]);

  const sellerModal: SellerModalState = {
    open: sellerModalOpen,
    creating: !seller?.tossSellerId,
    submitting: sellerModalSubmitting,
    error: sellerModalError,
    form: sellerModalForm,
    updateField: (field, value) => {
      setSellerModalForm((prev) => ({ ...prev, [field]: value }));
    },
    closeModal: () => {
      setSellerModalOpen(false);
      setSellerModalSubmitting(false);
      setSellerModalError(null);
    },
    submit: async (event) => {
      event.preventDefault();
      if (sellerModalSubmitting) return;
      setSellerModalSubmitting(true);
      setSellerModalError(null);
      try {
        const bankOk = sellerModalForm.accountBankCode.trim().length > 0;
        const accountNumberDigits = digitsOnly(sellerModalForm.accountNumber);
        const accountOk = accountNumberDigits.length > 0;
        const holderOk = sellerModalForm.accountHolderName.trim().length > 0;
        if (!bankOk || !accountOk || !holderOk) {
          setSellerModalError("정산 계좌(은행/계좌번호/예금주명)를 모두 입력해 주세요.");
          return;
        }

        const businessType = sellerModalForm.businessType;
        if (businessType === "INDIVIDUAL") {
          const nameOk = sellerModalForm.individualName.trim().length > 0;
          const emailOk = sellerModalForm.individualEmail.trim().length > 0;
          const phoneOk = digitsOnly(sellerModalForm.individualPhone).length > 0;
          if (!nameOk || !emailOk || !phoneOk) {
            setSellerModalError("개인 정산 정보(이름/이메일/연락처)를 모두 입력해 주세요.");
            return;
          }
        } else {
          const companyOk = sellerModalForm.companyName.trim().length > 0;
          const repOk = sellerModalForm.representativeName.trim().length > 0;
          const emailOk = sellerModalForm.companyEmail.trim().length > 0;
          const phoneOk = digitsOnly(sellerModalForm.companyPhone).length > 0;
          const bizDigits = digitsOnly(sellerModalForm.businessRegistrationNumber);
          const bizOk = bizDigits.length === 10;
          if (!companyOk || !repOk || !emailOk || !phoneOk || !bizOk) {
            setSellerModalError("사업자 정산 정보(사업자명/대표자명/사업자등록번호 10자리/이메일/연락처)를 모두 입력해 주세요.");
            return;
          }
        }

        const payload = {
          refSellerId: sellerModalForm.refSellerId,
          businessType: sellerModalForm.businessType,
          companyName: sellerModalForm.companyName.trim() || undefined,
          representativeName: sellerModalForm.representativeName.trim() || undefined,
          businessRegistrationNumber: digitsOnly(sellerModalForm.businessRegistrationNumber) || undefined,
          companyEmail: sellerModalForm.companyEmail.trim() || undefined,
          companyPhone: digitsOnly(sellerModalForm.companyPhone) || undefined,
          individualName:
            sellerModalForm.businessType === "INDIVIDUAL"
              ? sellerModalForm.individualName.trim() || undefined
              : undefined,
          individualEmail:
            sellerModalForm.businessType === "INDIVIDUAL"
              ? sellerModalForm.individualEmail.trim() || undefined
              : undefined,
          individualPhone:
            sellerModalForm.businessType === "INDIVIDUAL"
              ? digitsOnly(sellerModalForm.individualPhone) || undefined
              : undefined,
          bankCode: sellerModalForm.accountBankCode,
          accountNumber: accountNumberDigits,
          accountHolderName: sellerModalForm.accountHolderName.trim(),
          metadataJson: sellerModalForm.metadataJson,
        };

        if (seller?.tossSellerId) {
          await apiUpdateSeller(payload);
          success("정산 계좌 정보가 저장되었습니다.");
        } else {
          await apiRequestSellerRegistration(payload);
          success("토스 이메일/문자 인증을 완료해 주세요.");
        }
        const refreshed = await apiGetMySeller().catch((): SellerDetail | null => null);
        setSeller(refreshed);
        setSellerModalOpen(false);
      } catch (err) {
        setSellerModalError(err instanceof Error ? err.message : "정산 계좌 등록에 실패했습니다.");
      } finally {
        setSellerModalSubmitting(false);
      }
    },
  };

  const openSettlementRegistration = () => {
    setSellerModalError(null);
    setSellerModalForm(createSellerForm(academy, seller));
    setSellerModalOpen(true);
  };

  const ensureSettlementAccountBeforeProceed = () => {
    if (!selectedPlan?.paymentIncluded) return true;
    if (seller?.tossSellerId) return true;
    error("Plus 요금제를 이용하려면 정산 계좌 등록이 필요합니다.");
    openSettlementRegistration();
    return false;
  };

  const ensureSellerVerifiedBeforeProceed = () => {
    if (!selectedPlan?.paymentIncluded) return true;
    if (!requireSeller) return true;
    if (!seller?.tossSellerId) return true;
    if (sellerApproved) return true;
    error("정산 계좌 인증이 완료되지 않았습니다. 인증 완료 후 다시 시도해 주세요.");
    return false;
  };

  const handleCardRegister = async () => {
    if (!selectedPlan) {
      error("요금제를 선택해 주세요.");
      return;
    }
    if (!ensureSettlementAccountBeforeProceed()) {
      return;
    }
    if (!ensureSellerVerifiedBeforeProceed()) {
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
      error(getErrorMessage(err, "카드 등록 창을 열지 못했습니다."));
    }
  };

  const handleSubmit = async () => {
    if (!selectedPlan) return;
    if (!ensureSettlementAccountBeforeProceed()) {
      return;
    }
    if (!ensureSellerVerifiedBeforeProceed()) {
      return;
    }
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
      queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] }).catch(() => {});
      queryClient.invalidateQueries({ queryKey: ["account", "plan-usage"] }).catch(() => {});
      try {
        const { invalidateCache } = await import("@/lib/fetcher");
        invalidateCache([
          "/api/payments/toss/subscription",
          "/api/dashboard/summary",
          "/api/account/plan-usage",
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
		          <HeaderRight>
		            <FeePolicyBox aria-label="수수료 안내">
		              <div className="actions">
		                <GhostButton type="button" onClick={() => setPgFeeGuideOpen(true)}>
		                  수수료 규정 보기
		                </GhostButton>
	                <GhostButton type="button" onClick={() => setPolicyOpen(true)}>
	                  결제/환불 정책
	                </GhostButton>
		              </div>
		            </FeePolicyBox>
		            {billingBlocked ? (
		              <>
	                <BillingBadge>결제가 필요합니다</BillingBadge>
	                <LogoutButton type="button" onClick={handleLogout}>
	                  로그아웃
	                </LogoutButton>
	              </>
	            ) : null}
	          </HeaderRight>
	        </PlanHeaderBar>
        {planUsage ? (
          <UsageBar>
            <UsageHeader>
              <span className="label">현재 사용량</span>
              <span className="plan-name">{planUsage.planName || planUsage.planId || "플랜 정보 없음"}</span>
            </UsageHeader>
            <UsageGrid>
              <UsageItem>
                <span className="usage-label">원생</span>
                <div className="usage-value">
                  <span className="current">{planUsage.studentCount}</span>
                  <span className="separator">/</span>
                  <span>{planUsage.studentLimit ?? "무제한"}</span>
                </div>
              </UsageItem>
              <UsageItem>
                <span className="usage-label">강사</span>
                <div className="usage-value">
                  <span className="current">{planUsage.teacherCount}</span>
                  <span className="separator">/</span>
                  <span>{planUsage.teacherLimit ?? "무제한"}</span>
                </div>
              </UsageItem>
              <UsageItem>
                <span className="usage-label">마케팅</span>
                <div className="usage-value">
                  {planUsage.marketingLimit != null ? `월 ${planUsage.marketingLimit}회` : "무제한"}
                </div>
              </UsageItem>
            </UsageGrid>
          </UsageBar>
        ) : null}
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
              <SectionLabel>
                원생 규모<span>*</span>
              </SectionLabel>
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

              <SectionLabel>
                추천 요금제<span>*</span>
              </SectionLabel>
              <PlanGrid>
                {availablePlans.length === 0 ? (
                  <RegisterHint>원생 규모를 선택하면 추천 요금제가 나타납니다.</RegisterHint>
                ) : (
                  availablePlans.map((planId) => {
                    const plan = getPlanById(planId);
                    if (!plan) return null;
                    const active = selectedPlanId === plan.id;
                    const badgeVariant = plan.paymentIncluded ? "muted" : "warning";
                    const badgeLabel = plan.paymentIncluded ? "결제 기능 포함" : "결제 기능 미포함";
                    const trialBadge = getTrialBadge(plan.id);
                    const availableFeatures = plan.features.filter((feat) => feat.icon !== "x");
                    const unavailableFeatures = plan.features.filter((feat) => feat.icon === "x");
                    
                    return (
                      <PlanCard
                        key={plan.id}
                        type="button"
                        data-active={active}
                        onClick={() => setSelectedPlanId(plan.id)}
                      >
	                        <PlanHeader>
	                          <ChoiceBadge data-variant={badgeVariant}>{badgeLabel}</ChoiceBadge>
	                          <PlanTitle>{plan.name}</PlanTitle>
	                          <PlanDescription>{plan.desc}</PlanDescription>
	                          <PlanPriceWrapper>
	                            <PlanPrice>
	                              {plan.id === "free" ? "무료" : plan.priceKrw.toLocaleString("ko-KR") + "원"}
	                              {plan.id === "free" ? null : <span>/월</span>}
	                            </PlanPrice>
	                          </PlanPriceWrapper>
                            {trialBadge ? <PlanTrialBadge>{trialBadge}</PlanTrialBadge> : null}
	                        </PlanHeader>
                        
                        <PlanButton>{active ? "선택됨" : "이 요금제 선택"}</PlanButton>
                        
                        <PlanFeatures>
                          {availableFeatures.length > 0 && (
                            <>
                              <PlanFeatureSectionTitle>포함 기능</PlanFeatureSectionTitle>
                              {availableFeatures.map((feat, idx) => (
                                <PlanFeatureItem key={`a-${idx}`}>
                                  <PlanFeatureIcon>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                      <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                  </PlanFeatureIcon>
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
                                  <PlanFeatureIcon>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                      <line x1="18" y1="6" x2="6" y2="18" />
                                      <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                  </PlanFeatureIcon>
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
                  })
                )}
              </PlanGrid>
              {sellerVerificationPending ? (
                <SellerVerifyNotice>
                  <div className="head">
                    <div className="icon" aria-hidden>
                      ⏳
                    </div>
                    <div className="text">
                      <div className="title">정산 계좌 인증 대기</div>
                      <div className="desc">
                        토스페이먼츠 인증을 완료해야 결제 기능을 시작할 수 있습니다.
                      </div>
                    </div>
                    <div className="chip">인증 대기</div>
                  </div>

                  <ol className="steps" aria-label="인증 진행 순서">
                    <li>
                      <b>1</b> 토스에서 발송된 인증을 완료해 주세요.
                    </li>
                    <li>
                      <b>2</b> 인증이 끝나면 “상태 동기화”로 반영해 주세요.
                    </li>
                  </ol>

                  <div className="meta">
                    <div className="metaRow">
                      <span className="metaLabel">상태</span>
                      <span className="metaValue">{seller?.status || "PENDING"}</span>
                    </div>
                    <div className="metaRow">
                      <span className="metaLabel">토스 셀러 ID</span>
                      <span className="metaValue" title={seller?.tossSellerId || undefined}>
                        {seller?.tossSellerId || "-"}
                      </span>
                      <button
                        type="button"
                        className="copy"
                        disabled={!seller?.tossSellerId}
                        onClick={() => void copyToClipboard("토스 셀러 ID", seller?.tossSellerId || "")}
                      >
                        복사
                      </button>
                    </div>
                  </div>
                  <div className="actions">
                    <GhostButton type="button" onClick={syncSellerStatus} disabled={sellerSyncing}>
                      {sellerSyncing ? "동기화 중..." : "상태 동기화"}
                    </GhostButton>
                  </div>
                </SellerVerifyNotice>
              ) : null}
              <Actions>
                <GhostButton type="button" onClick={handleCancel} disabled={saving}>
                  취소
                </GhostButton>
                <PrimaryButton
                  type="button"
                  onClick={handleSubmit}
                  disabled={saving || !selectedPlan || sellerVerificationPending}
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
	      <PgFeeGuideModal open={pgFeeGuideOpen} onClose={() => setPgFeeGuideOpen(false)} />
	      <PaymentRefundPolicyModal open={policyOpen} onClose={() => setPolicyOpen(false)} />
	      <MyAcademySellerModal modal={sellerModal} />
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

const UsageBar = styled.div`
  background: ${(p) => p.theme.colors.surfaceMuted};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.md};
  padding: ${(p) => p.theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing.sm};
`;

const UsageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: ${(p) => p.theme.spacing.xs};
  border-bottom: 1px solid ${(p) => p.theme.colors.borderMuted};
  
  .label {
    font-size: ${(p) => p.theme.font.size.xs};
    color: ${(p) => p.theme.colors.textMuted};
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: ${(p) => p.theme.font.weight.semiBold};
  }
  
  .plan-name {
    font-size: ${(p) => p.theme.font.size.sm};
    font-weight: ${(p) => p.theme.font.weight.semiBold};
    color: ${(p) => p.theme.colors.text};
  }
`;

const UsageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: ${(p) => p.theme.spacing.xs};
`;

const UsageItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  
  .usage-label {
    font-size: ${(p) => p.theme.font.size.xs};
    color: ${(p) => p.theme.colors.textMuted};
  }
  
  .usage-value {
    font-size: ${(p) => p.theme.font.size.sm};
    font-weight: ${(p) => p.theme.font.weight.semiBold};
    color: ${(p) => p.theme.colors.text};
    
    .current {
      color: ${(p) => p.theme.colors.primary};
    }
    
    .separator {
      margin: 0 4px;
      color: ${(p) => p.theme.colors.textMuted};
    }
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

const FeePolicyBox = styled.div`
  display: grid;
  gap: 8px;
  justify-items: end;
  .top {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
  }
  .note {
    font-size: 12px;
    color: ${(p) => p.theme.colors.textMuted};
    white-space: nowrap;
  }
  button {
    padding: 6px 12px;
    font-size: 12px;
    border-radius: 999px;
  }
  .actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: flex-end;
  }
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

const SellerVerifyNotice = styled.div`
  margin-top: 14px;
  border-radius: ${(p) => p.theme.radii.lg};
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.surfaceAlt};
  padding: 16px;
  display: grid;
  gap: 12px;

  .head {
    display: grid;
    grid-template-columns: 28px 1fr auto;
    gap: 10px;
    align-items: start;
  }

  .icon {
    width: 28px;
    height: 28px;
    display: grid;
    place-items: center;
    border-radius: 10px;
    background: #eef2ff;
    color: #3730a3;
    font-size: 15px;
  }

  .text {
    display: grid;
    gap: 4px;
  }

  .title {
    font-size: 14px;
    font-weight: 800;
    color: ${(p) => p.theme.colors.text};
  }
  .desc {
    font-size: 13px;
    color: ${(p) => p.theme.colors.textMuted};
    line-height: 1.55;
  }

  .chip {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 26px;
    padding: 0 10px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 700;
    background: #fef3c7;
    color: #b45309;
    border: 1px solid #fcd34d;
  }

  .steps {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    gap: 6px;
    font-size: 13px;
    color: ${(p) => p.theme.colors.textMuted};
    b {
      display: inline-grid;
      place-items: center;
      width: 18px;
      height: 18px;
      border-radius: 999px;
      background: ${(p) => p.theme.colors.border};
      color: ${(p) => p.theme.colors.text};
      font-size: 12px;
      margin-right: 8px;
    }
  }

  .meta {
    display: grid;
    gap: 8px;
    padding: 12px;
    border-radius: ${(p) => p.theme.radii.md};
    background: ${(p) => p.theme.colors.surface};
    border: 1px solid ${(p) => p.theme.colors.border};
  }

  .metaRow {
    display: grid;
    grid-template-columns: 88px 1fr auto;
    gap: 10px;
    align-items: center;
    min-width: 0;
  }

  .metaLabel {
    font-size: 12px;
    color: ${(p) => p.theme.colors.textMuted};
  }

  .metaValue {
    font-size: 13px;
    color: ${(p) => p.theme.colors.text};
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .copy {
    height: 30px;
    border: 1px solid ${(p) => p.theme.colors.borderMuted};
    border-radius: 999px;
    padding: 0 10px;
    background: ${(p) => p.theme.colors.surfaceAlt};
    color: ${(p) => p.theme.colors.text};
    font-size: 12px;
    cursor: pointer;
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .actions {
    display: flex;
    justify-content: flex-end;
  }
`;

const Actions = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const SectionLabel = styled.div`
  font-size: ${(p) => p.theme.font.size.md};
  font-weight: ${(p) => p.theme.font.weight.semiBold};
  color: ${(p) => p.theme.colors.text};
  margin-bottom: ${(p) => p.theme.spacing.sm};
  
  span {
    color: ${(p) => p.theme.colors.danger};
    margin-left: 2px;
  }
`;
