import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import { PrimaryButton } from "@/components/common/UI";
import { formatKoreanDate, formatMoney } from "@/lib/format";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/common/Toast";
import {
  getPublicPaymentInvoice,
  preparePublicPaymentCheckout,
  type PublicPaymentInvoice,
} from "@/api/payments";
import type { PaymentDetail } from "@classon/shared-types";
import type { TossPayments } from "@/types/tossPayments";

type InvoiceViewModel = {
  academyName: string;
  courseTitle: string;
  studentName: string;
  amount: number;
  originalAmount?: number;
  discountAmount?: number;
  currency?: string;
  dueDate?: string;
  periodStart?: string;
  periodEnd?: string;
  memo?: string;
  status?: string;
  checkoutUrl?: string;
};

type InvoicePreviewProps = {
  mode: "admin" | "guardian";
  payment?: PaymentDetail;
  academyName?: string;
  token?: string;
  fallback?: Partial<InvoiceViewModel>;
  variant?: "page" | "modal";
};

const SAMPLE_DATA: InvoiceViewModel = {
  academyName: "클래스온 어학원",
  courseTitle: "중2 심화반",
  studentName: "홍길동",
  amount: 120_000,
  originalAmount: 120_000,
  currency: "KRW",
  dueDate: undefined,
  periodStart: undefined,
  periodEnd: undefined,
  memo: "",
  status: "UNPAID",
  checkoutUrl: undefined,
};

const statusLabel: Record<string, string> = {
  UNPAID: "미납",
  PENDING: "결제 중",
  COMPLETED: "완료",
  FAILED: "실패",
};

export default function InvoicePreview({
  mode,
  payment,
  academyName,
  token,
  fallback,
  variant = "page",
}: InvoicePreviewProps) {
  const { user } = useAuth();
  const { error: showError } = useToast();
  const isStaffPreview = user?.role === "ADMIN" || user?.role === "OWNER";
  const shouldFetch = mode === "guardian" && Boolean(token);

  const invoiceQuery = useQuery({
    queryKey: ["public-invoice", token],
    enabled: shouldFetch,
    queryFn: async () => {
      if (!token) throw new Error("토큰이 없습니다.");
      return await getPublicPaymentInvoice(token);
    },
    staleTime: 30_000,
    retry: 0,
  });

  useEffect(() => {
    if (invoiceQuery.isError && shouldFetch) {
      showError("청구서를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.");
    }
  }, [invoiceQuery.isError, shouldFetch, showError]);

  const resolvedData = useMemo<InvoiceViewModel>(() => {
    let base: InvoiceViewModel;
    if (mode === "admin" && payment) {
      base = mapPaymentDetail(payment, academyName);
    } else if (invoiceQuery.data) {
      base = mapPublicInvoice(invoiceQuery.data);
    } else if (fallback) {
      base = {
        ...SAMPLE_DATA,
        ...fallback,
        amount: typeof fallback.amount === "number" && Number.isFinite(fallback.amount) ? fallback.amount : SAMPLE_DATA.amount,
      };
    } else {
      base = SAMPLE_DATA;
    }
    return applyFallbackOverrides(base, fallback);
  }, [mode, payment, academyName, invoiceQuery.data, fallback]);

  const loading =
    (shouldFetch && invoiceQuery.isLoading && !invoiceQuery.data) ||
    (mode === "admin" && !payment);
  const disablePay = mode === "admin" || isStaffPreview;
  const canPay = mode === "guardian" && Boolean(token) && !disablePay;
  
  const [paying, setPaying] = useState(false);
  const [tossPayments, setTossPayments] = useState<TossPayments | null>(null);
  
  const checkoutQuery = useQuery({
    queryKey: ["public-checkout", token],
    enabled: canPay && Boolean(token),
    queryFn: async () => {
      if (!token) throw new Error("토큰이 없습니다.");
      return await preparePublicPaymentCheckout(token);
    },
    retry: 0,
    staleTime: 300_000,
  });

  // Load TossPayments SDK
  useEffect(() => {
    if (!canPay || !checkoutQuery.data) return;
    
    const loadTossPayments = async () => {
      try {
        await ensureTossPaymentsScript();
        if (typeof window !== "undefined" && window.TossPayments) {
          const instance = window.TossPayments(checkoutQuery.data!.clientKey);
          setTossPayments(instance);
        }
      } catch (error) {
        console.error("Failed to load TossPayments SDK:", error);
        showError("결제 모듈을 불러오지 못했습니다.");
      }
    };
    
    loadTossPayments();
  }, [canPay, checkoutQuery.data, showError]);

  const checkoutErrorMessage = useMemo(() => {
    if (!checkoutQuery.error) return null;
    const err = checkoutQuery.error;
    if (err instanceof Error) {
      return err.message || "결제 설정을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.";
    }
    if (typeof err === "string") {
      return err;
    }
    return "결제 설정을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.";
  }, [checkoutQuery.error]);

  const payDisabled = disablePay || paying || (canPay && (!checkoutQuery.data || checkoutQuery.isLoading || !tossPayments));

  const handlePay = async () => {
    if (payDisabled || !tossPayments || !checkoutQuery.data) return;
    
    try {
      setPaying(true);
      await tossPayments.requestPayment("카드", {
        amount: checkoutQuery.data.amount,
        orderId: checkoutQuery.data.orderId,
        orderName: checkoutQuery.data.orderName,
        customerName: checkoutQuery.data.studentName ?? resolvedData.studentName,
        successUrl: checkoutQuery.data.successUrl ?? window.location.href,
        failUrl: checkoutQuery.data.failUrl ?? window.location.href,
      });
    } catch (err) {
      const message =
        err instanceof Error && err.message
          ? err.message
          : "결제 창을 열 수 없습니다. 잠시 후 다시 시도해 주세요.";
      showError(message);
      setPaying(false);
    }
  };

  const card = loading ? (
    <LoadingState>청구서 정보를 불러오는 중입니다...</LoadingState>
  ) : (
    <DataCard>
      <Top>
        <Academy>{resolvedData.academyName}</Academy>
        <Course>{resolvedData.courseTitle}</Course>
        <StudentRow>
          <SmallLabel>수강생</SmallLabel>
          <StudentChip>{resolvedData.studentName}</StudentChip>
        </StudentRow>
        <StatusRow>
          <SmallLabel>상태</SmallLabel>
          <StatusChip data-status={resolvedData.status ?? "UNPAID"}>
            {statusLabel[resolvedData.status ?? "UNPAID"] ?? resolvedData.status ?? "-"}
          </StatusChip>
        </StatusRow>
        <AmountBox>
          <AmountLabel>최종 수강료 금액</AmountLabel>
          <AmountValue>{formatMoney(resolvedData.amount ?? 0)}</AmountValue>
        </AmountBox>
      </Top>

      <SectionTitle>결제 정보</SectionTitle>
      <DetailList>
        <DetailRow>
          <Label>학원명</Label>
          <Value>{resolvedData.academyName}</Value>
        </DetailRow>
        <DetailRow>
          <Label>수업명</Label>
          <Value>{resolvedData.courseTitle}</Value>
        </DetailRow>
        <DetailRow>
          <Label>수강생</Label>
          <Value>{resolvedData.studentName}</Value>
        </DetailRow>
        <DetailRow>
          <Label>수강료 금액</Label>
          <Value>{formatMoney(resolvedData.originalAmount ?? resolvedData.amount)}</Value>
        </DetailRow>
        {typeof resolvedData.discountAmount === "number" && resolvedData.discountAmount > 0 ? (
          <DetailRow>
            <Label>할인 금액</Label>
            <Value>-{formatMoney(resolvedData.discountAmount)}</Value>
          </DetailRow>
        ) : null}
        <DetailRow>
          <Label>납부 기한</Label>
          <Value>{formatDate(resolvedData.dueDate) ?? "미정"}</Value>
        </DetailRow>
      </DetailList>

      {resolvedData.memo ? (
        <>
          <SectionTitle>안내 메모</SectionTitle>
          <MemoBox>{resolvedData.memo}</MemoBox>
        </>
      ) : null}

      {canPay && checkoutErrorMessage ? <InlineError>{checkoutErrorMessage}</InlineError> : null}

      <Note>결제 버튼을 누르면 안전한 토스페이먼츠 결제 페이지로 이동합니다.</Note>
    </DataCard>
  );

  if (variant === "modal") {
    return (
      <ModalLayout>
        {card}
        <ModalActions>
          <ActionStack>
            <BigPayButton type="button" onClick={handlePay} disabled={payDisabled}>
              {paying ? "결제 준비 중..." : "결제하기"}
            </BigPayButton>
            {disablePay ? (
              <StaffNotice>관리자/원장 미리보기에서는 결제가 비활성화됩니다.</StaffNotice>
            ) : null}
          </ActionStack>
        </ModalActions>
      </ModalLayout>
    );
  }

  return (
    <Shell>
      <ContentWrap>{card}</ContentWrap>
      <BottomBar>
        <ActionStack>
          <BigPayButton type="button" onClick={handlePay} disabled={payDisabled}>
            {paying ? "결제 준비 중..." : "결제하기"}
          </BigPayButton>
          {disablePay ? (
            <StaffNotice>관리자/원장 미리보기에서는 결제가 비활성화됩니다.</StaffNotice>
          ) : null}
        </ActionStack>
      </BottomBar>
    </Shell>
  );
}

function applyFallbackOverrides(data: InvoiceViewModel, fallback?: Partial<InvoiceViewModel>): InvoiceViewModel {
  if (!fallback) return data;
  const next = { ...data };
  if (typeof fallback.academyName === "string" && fallback.academyName.trim()) {
    next.academyName = fallback.academyName;
  }
  if (typeof fallback.courseTitle === "string" && fallback.courseTitle.trim()) {
    next.courseTitle = fallback.courseTitle;
  }
  if (typeof fallback.studentName === "string" && fallback.studentName.trim()) {
    next.studentName = fallback.studentName;
  }
  if (typeof fallback.amount === "number" && Number.isFinite(fallback.amount)) {
    next.amount = fallback.amount;
  }
  if (typeof fallback.originalAmount === "number" && Number.isFinite(fallback.originalAmount)) {
    next.originalAmount = fallback.originalAmount;
  }
  if (typeof fallback.discountAmount === "number" && Number.isFinite(fallback.discountAmount)) {
    next.discountAmount = fallback.discountAmount;
  }
  if (typeof fallback.dueDate === "string" && fallback.dueDate.trim()) {
    next.dueDate = fallback.dueDate;
  }
  if (typeof fallback.periodStart === "string" && fallback.periodStart.trim()) {
    next.periodStart = fallback.periodStart;
  }
  if (typeof fallback.periodEnd === "string" && fallback.periodEnd.trim()) {
    next.periodEnd = fallback.periodEnd;
  }
  if (typeof fallback.memo === "string") {
    next.memo = fallback.memo;
  }
  if (typeof fallback.status === "string" && fallback.status.trim()) {
    next.status = fallback.status;
  }
  if (typeof fallback.checkoutUrl === "string" && fallback.checkoutUrl.trim()) {
    next.checkoutUrl = fallback.checkoutUrl;
  }
  return next;
}

function mapPublicInvoice(data: PublicPaymentInvoice): InvoiceViewModel {
  return {
    academyName: data.academyName ?? SAMPLE_DATA.academyName,
    courseTitle: data.courseTitle ?? SAMPLE_DATA.courseTitle,
    studentName: data.studentName ?? SAMPLE_DATA.studentName,
    amount: data.finalAmount ?? SAMPLE_DATA.amount,
    originalAmount: data.originalAmount ?? data.finalAmount ?? SAMPLE_DATA.amount,
    discountAmount:
      typeof data.originalAmount === "number" && typeof data.finalAmount === "number"
        ? Math.max(0, data.originalAmount - data.finalAmount)
        : undefined,
    currency: data.currency ?? "KRW",
    dueDate: data.dueDate ?? undefined,
    periodStart: data.periodStart ?? undefined,
    periodEnd: data.periodEnd ?? undefined,
    memo: data.memo ?? "",
    status: data.status ?? "UNPAID",
    checkoutUrl: undefined,
  };
}

function mapPaymentDetail(detail: PaymentDetail, academyNameOverride?: string): InvoiceViewModel {
  const info = detail.info;
  const courseTitle =
    detail.course?.title ??
    detail.info.course?.title ??
    (detail.courses && detail.courses.length ? detail.courses[0]?.title : null) ??
    SAMPLE_DATA.courseTitle;
  return {
    academyName: academyNameOverride || SAMPLE_DATA.academyName,
    courseTitle: courseTitle ?? SAMPLE_DATA.courseTitle,
    studentName: detail.student?.name ?? SAMPLE_DATA.studentName,
    amount: info.finalAmount ?? SAMPLE_DATA.amount,
    originalAmount: info.originalAmount ?? info.finalAmount ?? SAMPLE_DATA.originalAmount,
    discountAmount:
      typeof info.originalAmount === "number" && typeof info.finalAmount === "number"
        ? Math.max(0, info.originalAmount - info.finalAmount)
        : undefined,
    currency: info.currency ?? "KRW",
    dueDate: info.dueDate ?? undefined,
    periodStart: info.periodStart ?? undefined,
    periodEnd: info.periodEnd ?? undefined,
    memo: info.memo ?? undefined,
    status: info.status ?? "UNPAID",
    checkoutUrl: undefined,
  };
}

function formatDate(value?: string | null) {
  if (!value) return null;
  try {
    return formatKoreanDate(value, { includeWeekday: false });
  } catch {
    return value;
  }
}

const Shell = styled.div`
  min-height: 100vh;
  background: #f6f7fb;
  padding: 16px 12px calc(110px + env(safe-area-inset-bottom));
`;

const ContentWrap = styled.div`
  width: 100%;
  max-width: 560px;
  margin: 0 auto;
  padding: 4px 2px;
`;

const ModalLayout = styled.div`
  display: grid;
  gap: 16px;
  min-width: min(560px, 90vw);
`;

const DataCard = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  box-shadow: 0 14px 30px rgba(2, 6, 23, 0.06);
  padding: 18px;
`;

const Top = styled.div`
  display: grid;
  gap: 8px;
`;

const Academy = styled.div`
  color: #475569;
  font-size: 14px;
  font-weight: 700;
`;

const Course = styled.h1`
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
`;

const StudentRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  margin-top: 2px;
`;

const StatusRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const SmallLabel = styled.div`
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
`;

const StudentChip = styled.span`
  display: inline-flex;
  align-items: center;
  height: 26px;
  padding: 0 10px;
  border-radius: 999px;
  background: #eef2ff;
  color: #3730a3;
  font-size: 12px;
  font-weight: 800;
`;

const StatusChip = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  color: #0f172a;
  background: #f1f5f9;
`;

const AmountBox = styled.div`
  margin-top: 8px;
  display: grid;
  gap: 6px;
  background: #f8fafc;
  border: 1px solid #eef2ff;
  border-radius: 12px;
  padding: 12px;
`;

const AmountLabel = styled.div`
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.1px;
`;

const AmountValue = styled.div`
  color: #0f172a;
  font-size: 28px;
  font-weight: 900;
  letter-spacing: -0.2px;
`;

const SectionTitle = styled.h2`
  margin: 16px 0 10px;
  font-size: 13px;
  color: #6b7280;
  font-weight: 800;
`;

const DetailList = styled.div`
  display: grid;
  border: 1px solid #f1f5f9;
  border-radius: 12px;
  overflow: hidden;
`;

const DetailRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
  align-items: center;
  padding: 12px 14px;
  background: #fff;
  & + & {
    border-top: 1px solid #f1f5f9;
  }
`;

const Label = styled.div`
  color: #64748b;
  font-size: 14px;
`;

const Value = styled.div`
  color: #0f172a;
  font-size: 16px;
  font-weight: 700;
  text-align: right;
`;

const MemoBox = styled.div`
  border: 1px solid #f1f5f9;
  background: #f8fafc;
  border-radius: 12px;
  padding: 12px;
  color: #334155;
  font-size: 14px;
  line-height: 1.5;
`;

const Note = styled.p`
  margin: 14px 0 0 0;
  color: #6b7280;
  font-size: 13px;
`;

const InlineError = styled.p`
  margin: 6px 0 0 0;
  color: #dc2626;
  font-size: 12px;
  font-weight: 600;
`;

const LoadingState = styled.div`
  min-height: 180px;
  display: grid;
  place-items: center;
  color: #6b7280;
  font-size: 14px;
`;

const BottomBar = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #ffffff;
  border-top: 1px solid #e5e7eb;
  padding: 14px 16px calc(20px + env(safe-area-inset-bottom));
  display: flex;
  justify-content: flex-end;
`;

const ActionStack = styled.div`
  display: grid;
  gap: 6px;
  justify-items: stretch;
`;

const BigPayButton = styled(PrimaryButton)`
  height: 52px;
  font-size: 16px;
  border-radius: 12px;
  &[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const StaffNotice = styled.span`
  font-size: 12px;
  color: #6b7280;
  text-align: right;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const TOSS_PAYMENTS_SCRIPT_URL = "https://js.tosspayments.com/v1";
let tossPaymentsScriptPromise: Promise<void> | null = null;

async function ensureTossPaymentsScript(): Promise<void> {
  if (typeof window === "undefined") return;
  if (window.TossPayments) return;
  if (!tossPaymentsScriptPromise) {
    tossPaymentsScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = TOSS_PAYMENTS_SCRIPT_URL;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load TossPayments SDK"));
      document.head.appendChild(script);
    });
  }
  await tossPaymentsScriptPromise;
}
