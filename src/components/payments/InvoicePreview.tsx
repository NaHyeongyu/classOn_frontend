import { useEffect, useMemo, useRef, useState } from "react";
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
import { routes } from "@/routes";
import type { PaymentDetail } from "@classon/shared-types";
import type { TossPayments } from "@/types/tossPayments";

type TossPaymentWidget = {
  renderPaymentMethods(
    selector: HTMLElement,
    amount: { value: number },
    options?: Record<string, unknown>,
  ): unknown;
  renderAgreement(
    selector: HTMLElement,
    options?: Record<string, unknown>,
  ): unknown;
  requestPayment(args: {
    orderId: string;
    orderName?: string;
    successUrl?: string;
    failUrl?: string;
    customerName?: string | null;
    amount: number;
  }): Promise<void>;
};

type TossPaymentWidgetFactory = (clientKey: string, customerKey: string) => TossPaymentWidget;

declare global {
  interface Window {
    PaymentWidget?: TossPaymentWidgetFactory;
  }
}

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
  receiptToken?: string;
};

type InvoicePreviewProps = {
  mode: "admin" | "guardian";
  payment?: PaymentDetail;
  academyName?: string;
  token?: string;
  fallback?: Partial<InvoiceViewModel>;
  variant?: "page" | "modal";
};

type ApiError = Error & { status?: number; code?: string | number };

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
  receiptToken: undefined,
};

const statusLabel: Record<string, string> = {
  UNPAID: "대기",
  PENDING: "미납",
  COMPLETED: "완료",
  FAILED: "실패",
  CANCELED: "취소",
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
  const normalizedToken = typeof token === "string" && token.trim() ? token.trim() : undefined;
  const hasToken = Boolean(normalizedToken);
  const shouldFetch = mode === "guardian" && hasToken;
  const tokenMissing = mode === "guardian" && !hasToken;

  const invoiceQuery = useQuery({
    queryKey: ["public-invoice", normalizedToken],
    enabled: shouldFetch,
    queryFn: async () => {
      if (!normalizedToken) throw new Error("토큰이 없습니다.");
      return await getPublicPaymentInvoice(normalizedToken);
    },
    staleTime: 30_000,
    retry: 0,
  });

  const invoiceError = invoiceQuery.error as ApiError | null;
  const invoiceErrorCode = invoiceError?.code ? String(invoiceError.code) : undefined;
  const invoiceErrorMessage = invoiceError?.message?.trim();
  const invoiceDetached = invoiceErrorCode === "PAYMENT_INVOICE_DETACHED";
  const invoiceMissing = invoiceErrorCode === "PAYMENT_INVOICE_NOT_FOUND";
  const invoiceInvalidToken = invoiceErrorCode === "PAYMENT_INVOICE_INVALID_TOKEN";
  const criticalInvoiceIssue = invoiceDetached || invoiceMissing;

  useEffect(() => {
    if (invoiceQuery.isError && shouldFetch) {
      const msg = invoiceErrorMessage || "청구서를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.";
      showError(invoiceInvalidToken ? `${msg} 학원에 문의해 새 링크를 받아 주세요.` : msg);
    }
  }, [invoiceQuery.isError, shouldFetch, showError, invoiceErrorMessage, invoiceInvalidToken]);

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
  const disablePay = mode === "admin" || isStaffPreview || criticalInvoiceIssue;
  const receiptLink = resolvedData.receiptToken
    ? `${routes.paymentsReceipt}?token=${encodeURIComponent(resolvedData.receiptToken)}`
    : null;
  const showReceiptLink = mode === "guardian" && Boolean(receiptLink);
  const canPay = mode === "guardian" && hasToken && !disablePay && !showReceiptLink;
  
  const [paying, setPaying] = useState(false);
  const [tossPayments, setTossPayments] = useState<TossPayments | null>(null);
  const [refundPolicyExpanded, setRefundPolicyExpanded] = useState(false);
  const [customerServiceExpanded, setCustomerServiceExpanded] = useState(false);
  const paymentMethodsRef = useRef<HTMLDivElement | null>(null);
  const agreementRef = useRef<HTMLDivElement | null>(null);
  const widgetPaymentMethodsId = useMemo(
    () => `payment-widget-methods-${Math.random().toString(36).slice(2)}`,
    [],
  );
  const widgetAgreementId = useMemo(
    () => `payment-widget-agreement-${Math.random().toString(36).slice(2)}`,
    [],
  );
  const widgetInstanceRef = useRef<TossPaymentWidget | null>(null);
  const [widgetReady, setWidgetReady] = useState(false);
  const [widgetLoading, setWidgetLoading] = useState(false);
  const [widgetError, setWidgetError] = useState<string | null>(null);
  const [widgetPaying, setWidgetPaying] = useState(false);
  
  const checkoutQuery = useQuery({
    queryKey: ["public-checkout", normalizedToken],
    enabled: canPay,
    queryFn: async () => {
      if (!normalizedToken) throw new Error("토큰이 없습니다.");
      return await preparePublicPaymentCheckout(normalizedToken);
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

  const widgetClientKey = useMemo(() => {
    const fromApi = checkoutQuery.data?.widgetClientKey?.trim();
    if (fromApi) return fromApi;
    const fromEnv =
      typeof import.meta.env.VITE_TOSS_WIDGET_CLIENT_KEY === "string"
        ? import.meta.env.VITE_TOSS_WIDGET_CLIENT_KEY.trim()
        : "";
    return fromEnv || undefined;
  }, [checkoutQuery.data?.widgetClientKey]);
  const showWidget = canPay && Boolean(widgetClientKey);

  useEffect(() => {
    if (!showWidget) {
      setWidgetReady(false);
      setWidgetError(null);
      widgetInstanceRef.current = null;
      if (paymentMethodsRef.current) paymentMethodsRef.current.innerHTML = "";
      if (agreementRef.current) agreementRef.current.innerHTML = "";
    }
  }, [showWidget]);

  useEffect(() => {
    if (!showWidget || !checkoutQuery.data || !widgetClientKey) return;
    const container = paymentMethodsRef.current;
    const agreement = agreementRef.current;
    if (!container || !agreement) return;
    let canceled = false;
    setWidgetLoading(true);
    setWidgetError(null);
    setWidgetReady(false);
    (async () => {
      try {
        await ensureTossPaymentWidgetScript();
        if (canceled) return;
        if (typeof window === "undefined" || !window.PaymentWidget) {
          throw new Error("결제 위젯 스크립트를 찾을 수 없습니다.");
        }
        const widget = window.PaymentWidget(
          widgetClientKey,
          checkoutQuery.data.customerKey ?? checkoutQuery.data.orderId,
        );
        const methodsSelector = `#${widgetPaymentMethodsId}`;
        const agreementSelector = `#${widgetAgreementId}`;
        // Toss widget typings accept only HTMLElement, but runtime also supports CSS selectors.
        widget.renderPaymentMethods(
          methodsSelector as unknown as HTMLElement,
          { value: checkoutQuery.data.amount },
          { variantKey: "DEFAULT" },
        );
        widget.renderAgreement(agreementSelector as unknown as HTMLElement, { variantKey: "AGREEMENT" });
        widgetInstanceRef.current = widget;
        if (!canceled) {
          setWidgetReady(true);
          setWidgetError(null);
        }
      } catch (err) {
        if (canceled) return;
        console.error("Failed to load Toss Payments widget:", err);
        const message =
          err instanceof Error && err.message
            ? err.message
            : "결제 위젯을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.";
        setWidgetError(message);
        setWidgetReady(false);
        widgetInstanceRef.current = null;
        if (container) container.innerHTML = "";
        if (agreement) agreement.innerHTML = "";
      } finally {
        if (!canceled) setWidgetLoading(false);
      }
    })();
    return () => {
      canceled = true;
      widgetInstanceRef.current = null;
      if (container) container.innerHTML = "";
      if (agreement) agreement.innerHTML = "";
    };
  }, [
    showWidget,
    widgetClientKey,
    checkoutQuery.data,
    widgetPaymentMethodsId,
    widgetAgreementId,
  ]);

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

  const payDisabled =
    disablePay ||
    paying ||
    tokenMissing ||
    showReceiptLink ||
    (canPay && (!checkoutQuery.data || checkoutQuery.isLoading || !tossPayments));

  const widgetActionDisabled =
    !showWidget ||
    disablePay ||
    widgetLoading ||
    widgetPaying ||
    !widgetReady ||
    !checkoutQuery.data;
  const showFallbackButton = (!showWidget || Boolean(widgetError)) && !showReceiptLink;

  const handlePay = async () => {
    if (payDisabled || !tossPayments || !checkoutQuery.data) return;
    
    try {
      setPaying(true);
      const metadata: Record<string, string> = {};
      if (checkoutQuery.data.sellerRefId) metadata.sellerRefId = checkoutQuery.data.sellerRefId;
      if (checkoutQuery.data.tossSellerId) metadata.tossSellerId = checkoutQuery.data.tossSellerId;
      if (checkoutQuery.data.customerKey) metadata.customerKey = checkoutQuery.data.customerKey;
      await tossPayments.requestPayment("카드", {
        amount: checkoutQuery.data.amount,
        orderId: checkoutQuery.data.orderId,
        orderName: checkoutQuery.data.orderName,
        customerName: checkoutQuery.data.studentName ?? resolvedData.studentName,
        successUrl: checkoutQuery.data.successUrl ?? window.location.href,
        failUrl: checkoutQuery.data.failUrl ?? window.location.href,
        metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
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

  const handleWidgetPay = async () => {
    if (widgetActionDisabled || !widgetInstanceRef.current || !checkoutQuery.data) return;
    try {
      setWidgetPaying(true);
      await widgetInstanceRef.current.requestPayment({
        orderId: checkoutQuery.data.orderId,
        orderName: checkoutQuery.data.orderName ?? resolvedData.courseTitle,
        successUrl: checkoutQuery.data.successUrl ?? window.location.href,
        failUrl: checkoutQuery.data.failUrl ?? window.location.href,
        customerName: checkoutQuery.data.studentName ?? resolvedData.studentName,
        amount: checkoutQuery.data.amount,
      });
    } catch (err) {
      const message =
        err instanceof Error && err.message
          ? err.message
          : "결제 창을 열 수 없습니다. 잠시 후 다시 시도해 주세요.";
      showError(message);
      setWidgetPaying(false);
    }
  };

  const card = loading ? (
    <LoadingState>청구서 정보를 불러오는 중입니다...</LoadingState>
  ) : (
    <>
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
          {resolvedData.periodStart || resolvedData.periodEnd ? (
            <DetailRow>
              <Label>수강 기간</Label>
              <Value>{formatPeriod(resolvedData.periodStart, resolvedData.periodEnd) ?? "미정"}</Value>
            </DetailRow>
          ) : null}
        </DetailList>

        {resolvedData.memo ? (
          <>
            <SectionTitle>안내 메모</SectionTitle>
            <MemoBox>{resolvedData.memo}</MemoBox>
          </>
        ) : null}

        {canPay && checkoutErrorMessage ? <InlineError>{checkoutErrorMessage}</InlineError> : null}

        {showWidget ? (
          <>
            <Note>결제 버튼을 누르면 안전한 토스페이먼츠 결제 페이지로 이동합니다.</Note>
            <WidgetCard>
              {widgetLoading && !widgetReady ? (
                <WidgetHeader>
                  <small>결제 수단을 불러오는 중입니다...</small>
                </WidgetHeader>
              ) : null}
              {widgetError ? <InlineError>{widgetError}</InlineError> : null}
              <WidgetBody>
                <div id={widgetPaymentMethodsId} ref={paymentMethodsRef} />
                <div id={widgetAgreementId} ref={agreementRef} />
              </WidgetBody>
              <WidgetActions>
                <PrimaryButton
                  type="button"
                  onClick={handleWidgetPay}
                  disabled={widgetActionDisabled || widgetPaying}
                >
                  {widgetPaying ? "결제 창으로 이동..." : widgetReady ? "결제하기" : "결제 준비 중..."}
                </PrimaryButton>
              </WidgetActions>
            </WidgetCard>
          </>
        ) : null}
        {showReceiptLink ? (
          <WidgetCard>
            <ReceiptHeadline>이미 결제가 완료된 청구서입니다.</ReceiptHeadline>
            <ReceiptSub>아래 버튼을 눌러 영수증을 바로 확인할 수 있어요.</ReceiptSub>
            <WidgetActions>
              <ReceiptLinkButton href={receiptLink ?? "#"}>영수증 보기</ReceiptLinkButton>
            </WidgetActions>
          </WidgetCard>
        ) : null}
      </DataCard>

      {variant === "page" && (
        <FooterSection>
          <RefundPolicySection>
            <RefundPolicyHeader onClick={() => setRefundPolicyExpanded(!refundPolicyExpanded)}>
              <RefundPolicyTitle>취소 환불 규정</RefundPolicyTitle>
              <ToggleIcon $expanded={refundPolicyExpanded}>
                {refundPolicyExpanded ? "▲" : "▼"}
              </ToggleIcon>
            </RefundPolicyHeader>
            {refundPolicyExpanded && (
              <RefundPolicyContent>
                <RefundPolicyText>
                  각 학원의 취소 및 환불 규정에 따라 처리 가능하니 각 학원에 문의해주세요.
                </RefundPolicyText>
                <RefundPolicyText>
                  ClassOn은 「전자상거래 등에서의 소비자보호에 관한 법률」 제25조에 따른
                  통신판매중개자 및 전자지급결제대행자로서,
                  수업 제공·취소·환불·환급 등 거래 내용에 대한 책임은
                  <strong> 판매자(학원)</strong>에게 있습니다.
                  ClassOn은 결제 처리 및 정산에 필요한 기술적 서비스만 제공하며,
                  개별 거래의 계약 주체가 아니므로
                  거래 이행, 환불 승인, 금액 산정 등에는 책임을 지지 않습니다.
                </RefundPolicyText>
              </RefundPolicyContent>
            )}
          </RefundPolicySection>

          <CustomerServiceSection>
            <CustomerServiceHeader onClick={() => setCustomerServiceExpanded(!customerServiceExpanded)}>
              <CustomerServiceTitle>고객센터</CustomerServiceTitle>
              <ToggleIcon $expanded={customerServiceExpanded}>
                {customerServiceExpanded ? "▲" : "▼"}
              </ToggleIcon>
            </CustomerServiceHeader>
            {customerServiceExpanded && (
              <CustomerServiceContent>
                <CustomerServiceGrid>
                  <CustomerServiceRow>
                    <CustomerServiceLabel>상호명</CustomerServiceLabel>
                    <CustomerServiceValue>나루(NARU)</CustomerServiceValue>
                  </CustomerServiceRow>
                  <CustomerServiceRow>
                    <CustomerServiceLabel>대표자명</CustomerServiceLabel>
                    <CustomerServiceValue>나현규</CustomerServiceValue>
                  </CustomerServiceRow>
                  <CustomerServiceRow>
                    <CustomerServiceLabel>사업자등록번호</CustomerServiceLabel>
                    <CustomerServiceValue>890-21-02600</CustomerServiceValue>
                  </CustomerServiceRow>
                  <CustomerServiceRow>
                    <CustomerServiceLabel>통신판매업신고번호</CustomerServiceLabel>
                    <CustomerServiceValue>2025-경기안산-3576</CustomerServiceValue>
                  </CustomerServiceRow>
                  <CustomerServiceRow>
                    <CustomerServiceLabel>사업장주소</CustomerServiceLabel>
                    <CustomerServiceValue>안산시 상록구 댕이길 25 302호</CustomerServiceValue>
                  </CustomerServiceRow>
                  <CustomerServiceRow>
                    <CustomerServiceLabel>유선전화번호</CustomerServiceLabel>
                    <CustomerServiceValue>070-4509-2521</CustomerServiceValue>
                  </CustomerServiceRow>
                </CustomerServiceGrid>
              </CustomerServiceContent>
            )}
          </CustomerServiceSection>
        </FooterSection>
      )}
    </>
  );

  const DetachedBanner = criticalInvoiceIssue ? (
    <NoticeCard>
      <NoticeTitle>청구서를 찾을 수 없습니다.</NoticeTitle>
      <NoticeBody>
        학원에서 해당 청구서를 삭제했거나 연결이 해제되었습니다. 정확한 결제 안내는 학원에 문의해 주세요.
      </NoticeBody>
    </NoticeCard>
  ) : null;

  const InvalidTokenBanner =
    invoiceInvalidToken && !criticalInvoiceIssue ? (
      <NoticeCard>
        <NoticeTitle>청구서 링크가 올바르지 않습니다.</NoticeTitle>
        <NoticeBody>복사된 주소가 잘못되었을 수 있습니다. 학원에 문의해 새 링크를 받아 주세요.</NoticeBody>
      </NoticeCard>
    ) : null;

  const MissingTokenBanner =
    tokenMissing && !criticalInvoiceIssue ? (
      <NoticeCard>
        <NoticeTitle>결제 링크가 필요합니다.</NoticeTitle>
        <NoticeBody>
          카카오톡으로 받은 청구서 메시지에서 결제 버튼을 눌러 접속해 주세요. 링크가 없다면 학원에 재발급을
          요청해 주세요.
        </NoticeBody>
      </NoticeCard>
    ) : null;

  if (variant === "modal") {
    return (
      <ModalLayout>
        {DetachedBanner}
        {MissingTokenBanner}
        {InvalidTokenBanner}
        {card}
        {showFallbackButton ? (
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
        ) : null}
      </ModalLayout>
    );
  }

  return (
    <Shell>
      <ContentWrap>
        {DetachedBanner}
        {MissingTokenBanner}
        {InvalidTokenBanner}
        {card}
      </ContentWrap>
     <BottomBar>
        {showFallbackButton ? (
          <ActionStack>
            <BigPayButton type="button" onClick={handlePay} disabled={payDisabled}>
              {paying ? "결제 준비 중..." : "결제하기"}
            </BigPayButton>
            {disablePay ? (
              <StaffNotice>관리자/원장 미리보기에서는 결제가 비활성화됩니다.</StaffNotice>
            ) : null}
          </ActionStack>
        ) : null}
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
  if (typeof fallback.receiptToken === "string" && fallback.receiptToken.trim()) {
    next.receiptToken = fallback.receiptToken;
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
    receiptToken: data.receiptToken ?? undefined,
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
    receiptToken: undefined,
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

function formatPeriod(start?: string | null, end?: string | null) {
  const formattedStart = formatDate(start) ?? start;
  const formattedEnd = formatDate(end) ?? end;
  if (formattedStart && formattedEnd) {
    return `${formattedStart} ~ ${formattedEnd}`;
  }
  if (formattedStart) {
    return `${formattedStart} ~`;
  }
  if (formattedEnd) {
    return `~ ${formattedEnd}`;
  }
  return null;
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

const NoticeCard = styled.div`
  border: 1px solid #fee2e2;
  background: #fef2f2;
  color: #991b1b;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
`;

const NoticeTitle = styled.h2`
  margin: 0 0 6px;
  font-size: 16px;
  font-weight: 600;
  color: #b91c1c;
`;

const NoticeBody = styled.p`
  margin: 0;
  font-size: 14px;
  color: #7f1d1d;
  line-height: 1.5;
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

const WidgetCard = styled.div`
  margin-top: 16px;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.md};
  padding: 16px;
  display: grid;
  gap: 12px;
  background: #ffffff;
`;

const WidgetHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  small {
    font-size: 12px;
    color: ${(p) => p.theme.colors.textMuted};
  }
`;
const WidgetBody = styled.div`
  display: grid;
  gap: 10px;
  min-height: 120px;
  > div:first-child {
    min-height: 80px;
  }
`;

const WidgetActions = styled.div`
  display: flex;
  align-items: stretch;
  gap: 8px;
  & > * {
    flex: 1;
  }
  button {
    flex: 1;
  }
`;

const ReceiptHeadline = styled.p`
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: #111827;
`;

const ReceiptSub = styled.p`
  margin: 0;
  font-size: 13px;
  color: #6b7280;
`;

const ReceiptLinkButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 16px;
  border-radius: 999px;
  background: ${(p) => p.theme.colors.primary};
  color: #fff;
  font-weight: 700;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s ease;
  &:hover {
    opacity: 0.92;
  }
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
  justify-content: center;
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

const FooterSection = styled.div`
  width: 100%;
  max-width: 560px;
  margin: 16px auto 0;
  display: grid;
  gap: 12px;
`;

const RefundPolicySection = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
`;

const RefundPolicyHeader = styled.button`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  background: #f8fafc;
  border: none;
  cursor: pointer;
  transition: background 0.2s ease;
  
  &:hover {
    background: #f1f5f9;
  }
`;

const RefundPolicyTitle = styled.h3`
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
`;

const ToggleIcon = styled.span<{ $expanded: boolean }>`
  font-size: 12px;
  color: #64748b;
  transition: transform 0.2s ease;
`;

const RefundPolicyContent = styled.div`
  padding: 16px;
  display: grid;
  gap: 12px;
  background: #ffffff;
`;

const RefundPolicyText = styled.p`
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: #475569;
  
  strong {
    font-weight: 700;
    color: #0f172a;
  }
`;

const CustomerServiceSection = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
`;

const CustomerServiceHeader = styled.button`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  background: #f8fafc;
  border: none;
  cursor: pointer;
  transition: background 0.2s ease;
  
  &:hover {
    background: #f1f5f9;
  }
`;

const CustomerServiceTitle = styled.h3`
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
`;

const CustomerServiceContent = styled.div`
  padding: 16px;
  background: #ffffff;
`;

const CustomerServiceGrid = styled.div`
  display: grid;
  gap: 8px;
`;

const CustomerServiceRow = styled.div`
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 12px;
  align-items: start;
  font-size: 12px;
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 4px;
  }
`;

const CustomerServiceLabel = styled.div`
  color: #64748b;
  font-weight: 600;
`;

const CustomerServiceValue = styled.div`
  color: #0f172a;
  font-weight: 500;
`;

const TOSS_PAYMENTS_SCRIPT_URL = "https://js.tosspayments.com/v1";
let tossPaymentsScriptPromise: Promise<void> | null = null;
let tossWidgetScriptPromise: Promise<void> | null = null;

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

async function ensureTossPaymentWidgetScript(): Promise<void> {
  if (typeof window === "undefined") {
    throw new Error("브라우저 환경에서만 결제 위젯을 사용할 수 있습니다.");
  }
  if (window.PaymentWidget) return;
  if (!tossWidgetScriptPromise) {
    tossWidgetScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://js.tosspayments.com/v1/payment-widget";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("결제 위젯 스크립트를 불러오지 못했습니다."));
      document.head.appendChild(script);
    });
  }
  await tossWidgetScriptPromise;
}
