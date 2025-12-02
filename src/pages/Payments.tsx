import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import styled from "styled-components";
import SelectBox from "@/components/common/SelectBox";
import {
  Page,
  SectionCard,
  PageHeader,
  TitleH3,
  GhostButton,
  PrimaryButton,
  TableBase,
  EmptyState,
  Skeleton,
} from "@/components/common/UI";
import Modal from "@/components/common/Modal";
import { useToast } from "@/components/common/Toast";
import {
  cancelPayment,
  cancelScheduledAlert,
  getPaymentDetail,
  getPaymentSummary,
  listPaymentHistory,
  listPendingHistory,
  listPaymentInvoices,
  markOnsitePayment,
  sendScheduledAlertNow,
  updatePaymentInvoice,
  type PaymentInvoiceUpdatePayload,
  type PaymentOnsitePayload,
} from "@/api/payments";
import type {
  PaymentSummary,
  PaymentHistoryRow,
  PaymentDetail,
  PaymentMethod,
  PaymentType,
  PaymentCourseBrief,
} from "@classon/shared-types";
import type { PageResult } from "@/types/paging";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatMoney, formatKoreanDate, formatKoreanDateTimeKST } from "@/lib/format";
import { readableError } from "@/lib/errors";
import { useNavigate } from "react-router-dom";
import { routes, paths } from "@/routes";
import { invalidatePaymentsQueries } from "@/lib/paymentsCache";
import { DiscountFields } from "@/components/payments/DiscountFields";

type DetailState =
  | {
      open: true;
      id: number;
      variant: "invoice" | "history";
      loading: boolean;
      data: PaymentDetail | null;
    }
  | { open: false };

const today = new Date();
const defaultMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
const createDefaultDateRange = () => {
  const rangeStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const rangeEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  return {
    from: rangeStart.toISOString().slice(0, 10),
    to: rangeEnd.toISOString().slice(0, 10),
  };
};
const createDefaultHistoryFilters = (): HistoryFilters => ({
  ...createDefaultDateRange(),
  q: "",
  status: "ALL",
});

const statusLabel: Record<string, string> = {
  UNPAID: "대기",
  SCHEDULED: "예약",
  PENDING: "미납",
  COMPLETED: "완료",
  FAILED: "실패",
  CANCELED: "취소",
};

const statusColor: Record<string, string> = {
  UNPAID: "#4b5563",
  SCHEDULED: "#f59e0b",
  PENDING: "#2563EB",
  COMPLETED: "#059669",
  FAILED: "#dc2626",
  CANCELED: "#dc2626",
};

const studentStatusColor: Record<string, string> = {
  ENROLLED: "#059669",
  ON_LEAVE: "#8b5cf6",
  PENDING: "#f97316",
  STOPPED: "#dc2626",
};

const methodLabel: Record<string, string> = {
  CARD: "카드",
  BANK_TRANSFER: "계좌이체",
  CASH: "현금",
};

const paymentTypeLabel: Record<string, string> = {
  ONLINE: "온라인",
  OFFLINE: "오프라인",
};

type StudentStatusFilter = "ALL" | "ENROLLED" | "ON_LEAVE" | "PENDING" | "STOPPED";
type HistoryStatusFilter = "ALL" | "UNPAID" | "PENDING" | "COMPLETED" | "FAILED";

const studentStatusLabel: Record<string, string> = {
  ENROLLED: "수강중",
  ON_LEAVE: "휴학",
  PENDING: "대기중",
  STOPPED: "퇴원",
};

type HistoryFilters = {
  from: string;
  to: string;
  q: string;
  status: HistoryStatusFilter;
};

const resolvePendingStatusParam = (status: HistoryStatusFilter | "ALL"): string => {
  if (status === "ALL") return "ALL";
  if (status === "PENDING") return "PENDING,SCHEDULED";
  return status;
};

export default function Payments() {
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [invoiceSearch, setInvoiceSearch] = useState("");
  const [invoiceSearchInput, setInvoiceSearchInput] = useState("");
  const [invoiceStudentStatus, setInvoiceStudentStatus] = useState<StudentStatusFilter>("ALL");
  const [invoiceDateRange, setInvoiceDateRange] = useState(createDefaultDateRange);
  const [invoicePage, setInvoicePage] = useState(0);
  const invoicePageSize = 10;

  const [historyFilters, setHistoryFilters] = useState<HistoryFilters>(createDefaultHistoryFilters);
  const [historyCompletedPage, setHistoryCompletedPage] = useState(0);
  const [historyPendingPage, setHistoryPendingPage] = useState(0);
  const historyPageSize = 10;

  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState<number[]>([]);
  const [detailState, setDetailState] = useState<DetailState>({ open: false });
  const [onsiteTarget, setOnsiteTarget] = useState<PaymentHistoryRow | null>(null);
  const [onsiteModalOpen, setOnsiteModalOpen] = useState(false);
  const [onsiteSelectorOpen, setOnsiteSelectorOpen] = useState(false);
  const [onsiteDetail, setOnsiteDetail] = useState<PaymentDetail | null>(null);
  const [onsiteDetailLoading, setOnsiteDetailLoading] = useState(false);
  const [activeHistoryId, setActiveHistoryId] = useState<number | null>(null);
  const [cancelPrompt, setCancelPrompt] = useState<{
    open: boolean;
    detail: PaymentDetail | null;
    reason: string;
  }>({ open: false, detail: null, reason: "" });
  const [resendPrompt, setResendPrompt] = useState<{
    open: boolean;
    row: PaymentHistoryRow | null;
    reason: string | null;
    loading: boolean;
  }>({ open: false, row: null, reason: null, loading: false });

  const summaryQuery = useQuery<PaymentSummary>({
    queryKey: ["payments", "summary", defaultMonth],
    queryFn: () => getPaymentSummary({ month: defaultMonth }),
    staleTime: 30_000,
  });

  const invoiceQuery = useQuery<PageResult<PaymentHistoryRow>>({
    queryKey: [
      "payments",
      "invoices",
      invoiceSearch,
      invoiceDateRange.from,
      invoiceDateRange.to,
      invoiceStudentStatus,
      invoicePage,
      invoicePageSize,
    ],
    queryFn: () =>
      listPaymentInvoices({
        q: invoiceSearch,
        page: invoicePage,
        size: invoicePageSize,
        status: "UNPAID",
        from: invoiceDateRange.from || undefined,
        to: invoiceDateRange.to || undefined,
        studentStatus: invoiceStudentStatus === "ALL" ? undefined : invoiceStudentStatus,
      }),
    placeholderData: (previousData: PageResult<PaymentHistoryRow> | undefined) => previousData,
  });

  const completedHistoryQuery = useQuery<PageResult<PaymentHistoryRow>>({
    queryKey: [
      "payments",
      "history",
      "completed",
      historyFilters.from,
      historyFilters.to,
      historyFilters.q,
      historyCompletedPage,
      historyPageSize,
    ],
    queryFn: () =>
      listPaymentHistory({
        from: historyFilters.from || undefined,
        to: historyFilters.to || undefined,
        status: "COMPLETED,CANCELED",
        q: historyFilters.q,
        page: historyCompletedPage,
        size: historyPageSize,
      }),
    placeholderData: (previousData: PageResult<PaymentHistoryRow> | undefined) => previousData,
  });

  const pendingHistoryQuery = useQuery<PageResult<PaymentHistoryRow>>({
    queryKey: [
      "payments",
      "history",
      "pending",
      historyFilters.from,
      historyFilters.to,
      historyFilters.q,
      historyFilters.status,
      historyPendingPage,
      historyPageSize,
    ],
    queryFn: () =>
      listPendingHistory({
        from: historyFilters.from || undefined,
        to: historyFilters.to || undefined,
        q: historyFilters.q,
        status: resolvePendingStatusParam(historyFilters.status),
        page: historyPendingPage,
        size: historyPageSize,
      }),
    placeholderData: (previousData: PageResult<PaymentHistoryRow> | undefined) => previousData,
  });

  useEffect(() => {
    setInvoicePage(0);
  }, [invoiceSearch]);

  useEffect(() => {
    setInvoicePage(0);
  }, [invoiceDateRange.from, invoiceDateRange.to, invoiceStudentStatus]);

  useEffect(() => {
    setInvoiceSearchInput(invoiceSearch);
  }, [invoiceSearch]);

  useEffect(() => {
    setHistoryCompletedPage(0);
    setHistoryPendingPage(0);
  }, [historyFilters.from, historyFilters.to, historyFilters.q, historyFilters.status]);

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: PaymentInvoiceUpdatePayload }) =>
      updatePaymentInvoice(id, payload),
    onSuccess: (detail: PaymentDetail) => {
      success("청구서를 업데이트했습니다.");
      setDetailState((prev) =>
        prev.open && prev.id === detail.info.id ? { ...prev, data: detail, loading: false } : prev,
      );
      invalidatePaymentsQueries(queryClient);
    },
    onError: (err: unknown) => toastError(readableError(err, "청구서 수정에 실패했습니다.")),
  });

  const onsiteMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: PaymentOnsitePayload }) =>
      markOnsitePayment(id, payload),
    onSuccess: (detail: PaymentDetail) => {
      success("현장 결제가 기록되었습니다.");
      setOnsiteModalOpen(false);
      setOnsiteTarget(null);
      setOnsiteDetail(null);
      setDetailState((prev) =>
        prev.open && prev.id === detail.info.id ? { ...prev, data: detail, loading: false } : prev,
      );
      invalidatePaymentsQueries(queryClient);
    },
    onError: (err: unknown) => toastError(readableError(err, "현장 결제 처리에 실패했습니다.")),
  });

  const cancelMutation = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) =>
      cancelPayment(id, reason ? { reason } : undefined),
    onSuccess: (detail: PaymentDetail) => {
      success("결제를 취소했습니다.");
      setDetailState((prev) =>
        prev.open && prev.id === detail.info.id ? { ...prev, data: detail, loading: false } : prev,
      );
      invalidatePaymentsQueries(queryClient);
      setCancelPrompt({ open: false, detail: null, reason: "" });
    },
    onError: (err: unknown) => toastError(readableError(err, "결제 취소에 실패했습니다.")),
  });

  const cancelScheduleMutation = useMutation({
    mutationFn: ({ paymentId, alertId }: { paymentId: number; alertId: number }) =>
      cancelScheduledAlert(paymentId, alertId),
    onSuccess: (detail: PaymentDetail) => {
      success("예약 발송을 취소했습니다.");
      setDetailState((prev) =>
        prev.open && prev.id === detail.info.id ? { ...prev, data: detail, loading: false } : prev,
      );
      invalidatePaymentsQueries(queryClient);
    },
    onError: (err: unknown) => toastError(readableError(err, "예약 취소에 실패했습니다.")),
  });

  const sendScheduleNowMutation = useMutation({
    mutationFn: ({ paymentId, alertId }: { paymentId: number; alertId: number }) =>
      sendScheduledAlertNow(paymentId, alertId),
    onSuccess: (detail: PaymentDetail) => {
      success("예약을 즉시 발송으로 전환했습니다.");
      setDetailState((prev) =>
        prev.open && prev.id === detail.info.id ? { ...prev, data: detail, loading: false } : prev,
      );
      invalidatePaymentsQueries(queryClient);
    },
    onError: (err: unknown) => toastError(readableError(err, "즉시 발송 전환에 실패했습니다.")),
  });

  const loadDetail = useCallback(async (id: number, variant: "invoice" | "history") => {
    setDetailState({ open: true, id, variant, loading: true, data: null });
    try {
      const detail = await getPaymentDetail(id);
      setDetailState({ open: true, id, variant, loading: false, data: detail });
    } catch (err) {
      setDetailState({ open: false });
      toastError(readableError(err, "결제 상세를 불러오지 못했습니다."));
    }
  }, [toastError]);

  const handleCancelPayment = useCallback((detail: PaymentDetail) => {
    if (!detail?.info?.id) return;
    setCancelPrompt({ open: true, detail, reason: "" });
  }, []);

  const handleCancelSchedule = useCallback(
    (detail: PaymentDetail, alertId: number) => {
      if (!detail?.info?.id || !alertId) return;
      cancelScheduleMutation.mutate({ paymentId: detail.info.id, alertId });
    },
    [cancelScheduleMutation],
  );

  const handleSendScheduleNow = useCallback(
    (detail: PaymentDetail, alertId: number) => {
      if (!detail?.info?.id || !alertId) return;
      sendScheduleNowMutation.mutate({ paymentId: detail.info.id, alertId });
    },
    [sendScheduleNowMutation],
  );

  const summary = summaryQuery.data;
  const invoices = invoiceQuery.data;
  const invoiceRows = useMemo<PaymentHistoryRow[]>(
    () => invoices?.content ?? [],
    [invoices],
  );
  const completedRows = completedHistoryQuery.data?.content ?? [];
  const pendingRows = useMemo<PaymentHistoryRow[]>(
    () => pendingHistoryQuery.data?.content ?? [],
    [pendingHistoryQuery.data],
  );
  const completedTotalPages = completedHistoryQuery.data?.totalPages ?? 0;
  const pendingTotalPages = pendingHistoryQuery.data?.totalPages ?? 0;
  const completedIsLast = completedHistoryQuery.data?.last ?? true;
  const pendingIsLast = pendingHistoryQuery.data?.last ?? true;
  const pendingTitle =
    historyFilters.status === "UNPAID"
      ? "미납 내역"
      : historyFilters.status === "FAILED"
        ? "발송 실패 내역"
        : "발송 내역";
  const pendingDescription = historyFilters.status === "COMPLETED"
    ? "선택한 상태는 오른쪽 완료·취소 내역에서 확인하세요."
    : historyFilters.status === "UNPAID"
      ? "청구서 발송 전 미납 청구서"
      : historyFilters.status === "FAILED"
        ? "솔라피 발송이 실패한 청구서입니다. 원인을 확인하고 재발송하세요."
        : "발송 후 결제 대기 중인 청구서 (발송 5일 후 재발송 버튼이 노출됩니다.)";

  useEffect(() => {
    const completedRows = completedHistoryQuery.data?.content ?? [];
    if (!completedRows.length && !pendingRows.length) {
      setActiveHistoryId(null);
      setOnsiteTarget(null);
      return;
    }
    if (activeHistoryId == null) return;
    const exists =
      completedRows.some((row: PaymentHistoryRow) => row.id === activeHistoryId) ||
      pendingRows.some((row: PaymentHistoryRow) => row.id === activeHistoryId);
    if (!exists) {
      setActiveHistoryId(null);
      setOnsiteTarget(null);
    }
  }, [completedHistoryQuery.data, pendingRows, activeHistoryId]);
  useEffect(() => {
    if (!invoices) return;
    const totalPages = invoices.totalPages ?? 0;
    if (totalPages === 0) {
      if (invoicePage !== 0) setInvoicePage(0);
      return;
    }
    if (invoicePage >= totalPages) {
      setInvoicePage(Math.max(0, totalPages - 1));
      return;
    }
    if (!invoiceQuery.isFetching && invoicePage > 0 && invoiceRows.length === 0) {
      setInvoicePage((prev) => Math.max(0, prev - 1));
    }
  }, [invoices, invoicePage, invoiceRows.length, invoiceQuery.isFetching]);
  const invoiceTotalPages = invoices?.totalPages ?? 0;
  const showInvoicePager = invoiceTotalPages > 1;

  useEffect(() => {
    const idsOnPage = new Set(invoiceRows.map((item) => item.id));
    setSelectedInvoiceIds((prev) => prev.filter((id) => idsOnPage.has(id)));
  }, [invoiceRows]);
  const invoiceTotalElements = invoices?.totalElements ?? invoiceRows.length;
  const pendingTotalElements = historyFilters.status === "COMPLETED"
    ? 0
    : (pendingHistoryQuery.data?.totalElements ?? pendingRows.length);

  const [onsitePage, setOnsitePage] = useState(0);
  const [onsiteContext, setOnsiteContext] = useState<"invoice" | "history">("invoice");
  const onsitePageSize = historyPageSize;
  const onsiteCandidatesQuery = useQuery<PageResult<PaymentHistoryRow>>({
    queryKey: [
      "payments",
      "onsite-candidates",
      onsiteContext,
      onsiteContext === "invoice" ? invoiceSearch : historyFilters.q,
      onsiteContext === "invoice" ? invoiceDateRange.from : historyFilters.from,
      onsiteContext === "invoice" ? invoiceDateRange.to : historyFilters.to,
      onsiteContext === "invoice" ? invoiceStudentStatus : historyFilters.status,
      onsitePage,
      onsitePageSize,
    ],
    queryFn: () => {
      if (onsiteContext === "history") {
        const statusParam =
          historyFilters.status === "COMPLETED"
            ? "PENDING,SCHEDULED"
            : resolvePendingStatusParam(historyFilters.status);
        return listPendingHistory({
          from: historyFilters.from || undefined,
          to: historyFilters.to || undefined,
          q: historyFilters.q,
          status: statusParam,
          page: onsitePage,
          size: onsitePageSize,
        });
      }
      return listPaymentInvoices({
        status: "UNPAID",
        q: invoiceSearch,
        page: onsitePage,
        size: onsitePageSize,
        from: invoiceDateRange.from || undefined,
        to: invoiceDateRange.to || undefined,
        studentStatus: invoiceStudentStatus === "ALL" ? undefined : invoiceStudentStatus,
      });
    },
    enabled:
      onsiteSelectorOpen &&
      (onsiteContext === "invoice" || (onsiteContext === "history" && historyFilters.status !== "COMPLETED")),
    placeholderData: (previousData: PageResult<PaymentHistoryRow> | undefined) => previousData,
  });
  const onsiteCandidates = onsiteCandidatesQuery.data?.content ?? [];
  const onsiteTotalPages = onsiteCandidatesQuery.data?.totalPages ?? 0;

  const summaryStats = useMemo(
    () => extractSummary(summary, invoiceRows.length),
    [summary, invoiceRows.length],
  );

  const handleSendSelected = () => {
    if (!selectedInvoiceIds.length) {
      toastError("카카오톡 알림을 보낼 청구서를 선택해 주세요.");
      return;
    }
    const idsParam = selectedInvoiceIds.join(",");
    navigate(paths.payments.kakaoConfirm({ ids: idsParam }));
  };

  const handleScheduleSend = () => {
    if (!selectedInvoiceIds.length) {
      toastError("예약 발송할 청구서를 선택해 주세요.");
      return;
    }
    const idsParam = selectedInvoiceIds.join(",");
    navigate(paths.payments.kakaoSchedule({ ids: idsParam }));
  };

  const handleInvoiceSelectAll = () => {
    const ids = invoiceRows.map((row) => row.id);
    const allSelected = ids.every((id) => selectedInvoiceIds.includes(id));
    if (allSelected) {
      setSelectedInvoiceIds((prev) => prev.filter((id) => !ids.includes(id)));
    } else {
      setSelectedInvoiceIds((prev) => Array.from(new Set([...prev, ...ids])));
    }
  };

  const handleInvoiceRowClick = (row: PaymentHistoryRow) => {
    loadDetail(row.id, "invoice");
  };

  const handleHistoryRowClick = (row: PaymentHistoryRow) => {
    setActiveHistoryId(row.id);
    loadDetail(row.id, "history");
  };

  const handleHistoryResend = (row: PaymentHistoryRow) => {
    if (row.status === "FAILED") {
      setResendPrompt({ open: true, row, reason: null, loading: true });
      getPaymentDetail(row.id)
        .then((detail) => {
          const reason =
            detail.latestAlert?.errorMessage ||
            detail.alerts?.find((alert) => alert.status === "FAILED")?.errorMessage ||
            "실패 사유를 확인할 수 없습니다.";
          setResendPrompt((prev) => ({ ...prev, loading: false, reason }));
        })
        .catch(() => {
          setResendPrompt((prev) => ({
            ...prev,
            loading: false,
            reason: "실패 사유를 불러오지 못했습니다.",
          }));
        });
      return;
    }
    navigate(paths.payments.kakaoConfirm({ ids: String(row.id), template: "RETRY" }));
  };

  const closeResendPrompt = () => {
    setResendPrompt({ open: false, row: null, reason: null, loading: false });
  };

  const handleConfirmResend = () => {
    if (!resendPrompt.row) {
      closeResendPrompt();
      return;
    }
    navigate(paths.payments.kakaoConfirm({ ids: String(resendPrompt.row.id), template: "RETRY" }));
    closeResendPrompt();
  };

  const handleHistoryDateChange = (key: "from" | "to", value: string) => {
    setHistoryFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleInvoiceSearchChange = (value: string) => {
    setInvoiceSearchInput(value);
  };

  const handleApplyInvoiceSearch = () => {
    setInvoiceSearch(invoiceSearchInput.trim());
    setInvoicePage(0);
  };

  const handleResetInvoiceSearch = () => {
    setInvoiceSearch("");
    setInvoiceSearchInput("");
    setInvoiceStudentStatus("ALL");
    setInvoiceDateRange(createDefaultDateRange());
    setInvoicePage(0);
  };

  const handleApplyHistoryFilters = () => {
    setHistoryCompletedPage(0);
    setHistoryPendingPage(0);
    setOnsitePage(0);
  };

  const handleResetHistoryFilters = () => {
    setHistoryFilters(createDefaultHistoryFilters());
    setOnsitePage(0);
  };

  const handleSaveInvoice = async (form: PaymentInvoiceUpdatePayload) => {
    if (!detailState.open) return;
    const payload: PaymentInvoiceUpdatePayload = {
      ...form,
      cycleUnit:
        form.cycleUnit ??
        (detailState.open && detailState.data?.schedule?.cycleUnit) ??
        "MONTHS",
    };
    updateMutation.mutate({ id: detailState.id, payload });
  };

  const [activeSection, setActiveSection] = useState<"invoice" | "history">("invoice");

  const handleOnsiteSubmit = async (payload: PaymentOnsitePayload) => {
    if (!onsiteTarget) return;
    onsiteMutation.mutate({ id: onsiteTarget.id, payload });
  };

  const openOnsiteModalForRow = useCallback(
    async (row: PaymentHistoryRow) => {
      setOnsiteTarget(row);
      setOnsiteModalOpen(true);
      if (onsiteDetail?.info.id === row.id) return;
      setOnsiteDetail(null);
      setOnsiteDetailLoading(true);
      try {
        const detail = await getPaymentDetail(row.id);
        setOnsiteDetail(detail);
      } catch (err) {
        toastError(readableError(err, "현장 결제 정보를 불러오지 못했습니다."));
        setOnsiteModalOpen(false);
      } finally {
        setOnsiteDetailLoading(false);
      }
    },
    [onsiteDetail?.info.id, toastError],
  );

  const handleOnsiteButtonClick = (context: "invoice" | "history") => {
    setOnsiteContext(context);
    setOnsiteTarget(null);
    setOnsiteDetail(null);
    setOnsitePage(0);
    setOnsiteSelectorOpen(true);
  };

  const handleSelectOnsiteCandidate = (row: PaymentHistoryRow) => {
    setOnsiteSelectorOpen(false);
    openOnsiteModalForRow(row);
  };

  const sectionTitle = activeSection === "invoice" ? "청구서" : "결제 내역";
  const sectionDescription =
    activeSection === "invoice"
      ? "청구서를 선택해 한 번에 발송하거나 검색해 관리하세요."
      : "결제 내역을 필터링하고 상세 정보를 확인하세요.";

  return (
    <Page>
      <PageHeader>
        <div>
          <h2>결제 관리</h2>
          <p>학원의 결제 업무를 한눈에 관리하세요.</p>
        </div>
      </PageHeader>

      <StatsRow>
        {summaryStats.map((stat) => (
          <StatCard key={stat.label} data-tone={stat.tone}>
            <StatHead>
              <StatTitle>{stat.label}</StatTitle>
              <StatIcon data-tone={stat.tone} aria-hidden>
                {stat.icon}
              </StatIcon>
            </StatHead>
            <StatValue>{stat.value}</StatValue>
          </StatCard>
        ))}
      </StatsRow>

      <Panels>
        <SectionCard>
          <SectionHeader>
            <ToggleGroup role="tablist" aria-label="결제 관리">
              <ToggleButton
                type="button"
                $active={activeSection === "invoice"}
                aria-pressed={activeSection === "invoice"}
                onClick={() => setActiveSection("invoice")}
              >
                청구서
              </ToggleButton>
              <ToggleButton
                type="button"
                $active={activeSection === "history"}
                aria-pressed={activeSection === "history"}
                onClick={() => setActiveSection("history")}
              >
                결제 내역
              </ToggleButton>
            </ToggleGroup>
            <PanelControls>
              <PrimaryButton type="button" onClick={() => navigate(routes.paymentsCreate)}>
                청구서 생성
              </PrimaryButton>
            </PanelControls>
          </SectionHeader>
          <SectionInfo>
            <InfoText>
              <TitleH3>{sectionTitle}</TitleH3>
              <SmallText>{sectionDescription}</SmallText>
            </InfoText>
            {activeSection === "invoice" ? (
              <SectionActions>
                <GhostButton
                  type="button"
                  onClick={handleInvoiceSelectAll}
                  disabled={!invoiceRows.length}
                >
                  전체 선택
                </GhostButton>
                <GhostButton
                  type="button"
                  onClick={() => handleOnsiteButtonClick("invoice")}
                  disabled={!invoiceTotalElements}
                >
                  현장 결제
                </GhostButton>
                <GhostButton
                  type="button"
                  onClick={handleScheduleSend}
                  disabled={!selectedInvoiceIds.length}
                >
                  예약 발송
                </GhostButton>
                <KakaoButton
                  type="button"
                  onClick={handleSendSelected}
                  disabled={!selectedInvoiceIds.length}
                >
                  <img src="/logo/kakaotalk_sharing_btn_small.png" alt="카카오톡" width="20" height="20" />
                  청구서 발송
                </KakaoButton>
              </SectionActions>
            ) : (
              <SectionActions>
                <GhostButton
                  type="button"
                  onClick={() => handleOnsiteButtonClick("history")}
                  disabled={historyFilters.status === "COMPLETED" || pendingTotalElements === 0}
                >
                  현장 결제
                </GhostButton>
              </SectionActions>
            )}
          </SectionInfo>

          {activeSection === "invoice" ? (
            <>
              <HistoryFilters>
                <PeriodFilter>
                  <span>결제 예정일</span>
                  <div>
                    <Input
                      type="date"
                      value={invoiceDateRange.from}
                      onChange={(event) =>
                        setInvoiceDateRange((prev) => ({ ...prev, from: event.target.value }))
                      }
                    />
                    <span>~</span>
                    <Input
                      type="date"
                      value={invoiceDateRange.to}
                      onChange={(event) =>
                        setInvoiceDateRange((prev) => ({ ...prev, to: event.target.value }))
                      }
                    />
                  </div>
                </PeriodFilter>
                <FilterFieldWide>
                  <span>검색</span>
                  <Input
                    type="text"
                    value={invoiceSearchInput}
                    placeholder="학생명을 입력해 주세요."
                    onChange={(event) => handleInvoiceSearchChange(event.target.value)}
                  />
                </FilterFieldWide>
                <FilterFieldCompact>
                  <span>학생 상태</span>
                  <Select
                    ariaLabel="학생 상태"
                    placeholder="전체"
                    value={invoiceStudentStatus}
                    onChange={(value) => setInvoiceStudentStatus((value || "ALL") as StudentStatusFilter)}
                    options={[
                      { label: "전체", value: "ALL" },
                      { label: "수강중", value: "ENROLLED" },
                      { label: "휴학", value: "ON_LEAVE" },
                      { label: "대기중", value: "PENDING" },
                      { label: "퇴원", value: "STOPPED" },
                    ]}
                  />
                </FilterFieldCompact>
                <FilterActions>
                  <PrimaryButton type="button" onClick={handleApplyInvoiceSearch}>
                    검색
                  </PrimaryButton>
                  <GhostButton type="button" onClick={handleResetInvoiceSearch}>
                    초기화
                  </GhostButton>
                </FilterActions>
              </HistoryFilters>
              <InvoicesTable
                rows={invoiceRows}
                loading={invoiceQuery.isLoading}
                page={invoicePage}
                size={invoicePageSize}
                totalPages={invoiceTotalPages}
                showPager={showInvoicePager}
                onChangePage={setInvoicePage}
                selected={selectedInvoiceIds}
                onToggleSelect={(id) =>
                  setSelectedInvoiceIds((prev) =>
                    prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id],
                  )
                }
                onRowClick={handleInvoiceRowClick}
              />
            </>
          ) : (
            <>
              <HistoryFilters>
                <PeriodFilter>
                  <span>결제 예정일</span>
                  <div>
                    <Input
                      type="date"
                      value={historyFilters.from}
                      onChange={(event) => handleHistoryDateChange("from", event.target.value)}
                    />
                    <span>~</span>
                    <Input
                      type="date"
                      value={historyFilters.to}
                      onChange={(event) => handleHistoryDateChange("to", event.target.value)}
                    />
                  </div>
                </PeriodFilter>
                <FilterFieldWide>
                  <span>검색</span>
                  <Input
                    type="text"
                    value={historyFilters.q}
                    placeholder="이름 검색"
                    onChange={(event) =>
                      setHistoryFilters((prev) => ({ ...prev, q: event.target.value }))
                    }
                  />
                </FilterFieldWide>
                <FilterFieldCompact>
                  <span>상태</span>
                  <Select
                    ariaLabel="결제 상태"
                    placeholder="전체"
                    value={historyFilters.status}
                    onChange={(value) =>
                      setHistoryFilters((prev) => ({
                        ...prev,
                        status: (value || "ALL") as HistoryStatusFilter,
                      }))
                    }
                    options={[
                      { label: "전체", value: "ALL" },
                      { label: "발송 내역", value: "PENDING" },
                      { label: "미납", value: "UNPAID" },
                      { label: "완료", value: "COMPLETED" },
                      { label: "실패", value: "FAILED" },
                    ]}
                  />
                </FilterFieldCompact>
                <FilterActions>
                  <PrimaryButton type="button" onClick={handleApplyHistoryFilters}>
                    검색
                  </PrimaryButton>
                  <GhostButton type="button" onClick={handleResetHistoryFilters}>
                    초기화
                  </GhostButton>
                </FilterActions>
              </HistoryFilters>
              <HistorySplit>
                <HistoryColumnSticky>
                  <HistoryColumnHeader>
                    <ColumnTitle>완료·취소 내역</ColumnTitle>
                    <small>결제가 완료되었거나 취소된 청구서</small>
                  </HistoryColumnHeader>
                  <HistoryTable
                    rows={completedRows}
                    loading={completedHistoryQuery.isLoading}
                    page={historyCompletedPage}
                    size={historyPageSize}
                    totalPages={completedTotalPages}
                    last={completedIsLast}
                    onChangePage={setHistoryCompletedPage}
                    onRowClick={handleHistoryRowClick}
                    activeId={activeHistoryId}
                  />
                </HistoryColumnSticky>
              <HistoryColumn>
                <HistoryColumnHeader>
                  <ColumnTitle>{pendingTitle}</ColumnTitle>
                  <small>{pendingDescription}</small>
                </HistoryColumnHeader>
                  <HistoryTable
                    rows={pendingRows}
                    loading={historyFilters.status === "COMPLETED" ? false : pendingHistoryQuery.isLoading}
                    page={historyFilters.status === "COMPLETED" ? 0 : historyPendingPage}
                    size={historyPageSize}
                    totalPages={pendingTotalPages}
                    last={pendingIsLast}
                    onChangePage={historyFilters.status === "COMPLETED" ? () => {} : setHistoryPendingPage}
                    onRowClick={historyFilters.status === "COMPLETED" ? () => {} : handleHistoryRowClick}
                    activeId={activeHistoryId}
                    variant="pending"
                    onResendClick={handleHistoryResend}
                  />
                </HistoryColumn>
              </HistorySplit>
            </>
          )}
        </SectionCard>
      </Panels>

      <DetailModal
        state={detailState}
        onClose={() => setDetailState({ open: false })}
        onSave={handleSaveInvoice}
        saving={updateMutation.isPending}
        onCancelPayment={handleCancelPayment}
        canceling={cancelMutation.isPending}
        onCancelSchedule={handleCancelSchedule}
        onSendScheduleNow={handleSendScheduleNow}
        scheduleCancelling={cancelScheduleMutation.isPending}
        scheduleSending={sendScheduleNowMutation.isPending}
      />
      <Modal
        open={resendPrompt.open}
        onClose={closeResendPrompt}
        title="재발송 안내"
        maxWidth={480}
      >
        {resendPrompt.loading ? (
          <Skeleton h={60} />
        ) : (
          <>
            <p style={{ margin: "0 0 8px", color: "#374151", fontWeight: 600 }}>
              최근 카카오 발송이 실패했습니다.
            </p>
            <ReasonBox>
              {resendPrompt.reason || "실패 사유를 확인할 수 없습니다."}
            </ReasonBox>
            <HintTitle>주요 실패 원인</HintTitle>
            <HintList>
              <li>템플릿 검수가 완료되지 않았거나 삭제되었습니다.</li>
              <li>발신 프로필(카카오 채널)이 미등록 또는 연동 해제되었습니다.</li>
              <li>발신 번호가 템플릿/프로필에 매핑되지 않았습니다.</li>
              <li>수신자 전화번호 형식이 잘못되었거나 수신 차단 상태입니다.</li>
              <li>Solapi 이용 한도/잔액이 부족하거나 API 키가 변경되었습니다.</li>
            </HintList>
            <HintFooter>
              <strong>위 항목을 반드시 확인·수정한 뒤 다시 재발송을 진행해 주세요.</strong>
            </HintFooter>
            <HintFooter>
              문제가 지속될 경우{" "}
              <HintLink
                href="https://help.solapi.com/ko/articles/10294122"
                target="_blank"
                rel="noreferrer"
              >
                오류/요청 페이지
              </HintLink>
              를 통해 문의해 주세요.
            </HintFooter>
          </>
        )}
        <ModalActions>
          <GhostButton type="button" onClick={closeResendPrompt}>
            확인
          </GhostButton>
          <PrimaryButton
            type="button"
            onClick={handleConfirmResend}
            disabled={resendPrompt.loading || !resendPrompt.row}
          >
            카카오톡 재발송
          </PrimaryButton>
        </ModalActions>
      </Modal>

      <OnsiteCandidateModal
        open={onsiteSelectorOpen}
        onClose={() => {
          setOnsiteSelectorOpen(false);
          setOnsitePage(0);
        }}
        rows={onsiteCandidates}
        loading={onsiteCandidatesQuery.isLoading || onsiteCandidatesQuery.isFetching}
        page={onsitePage}
        totalPages={onsiteTotalPages}
        onChangePage={setOnsitePage}
        onSelect={handleSelectOnsiteCandidate}
      />
      <OnsitePaymentModal
        open={onsiteModalOpen}
        onClose={() => {
          setOnsiteModalOpen(false);
          setOnsiteDetail(null);
          setOnsiteTarget(null);
        }}
        onSubmit={handleOnsiteSubmit}
        submitting={onsiteMutation.isPending}
        target={onsiteTarget}
        detail={onsiteDetail}
        detailLoading={onsiteDetailLoading}
      />
      <Modal
        open={cancelPrompt.open}
        onClose={() => (!cancelMutation.isPending ? setCancelPrompt({ open: false, detail: null, reason: "" }) : undefined)}
        title="결제 취소"
        maxWidth={480}
      >
        {cancelPrompt.detail ? (
          <>
            <ConfirmIntro>
              <p>
                <strong>{cancelPrompt.detail.student.name}</strong> 학생의{" "}
                <strong>
                  {formatMoney(
                    cancelPrompt.detail.info.finalAmount ?? cancelPrompt.detail.info.originalAmount ?? 0,
                  )}
                </strong>{" "}
                결제를 취소합니다.
              </p>
              <p>결제가 취소되면 되돌릴 수 없습니다.</p>
            </ConfirmIntro>
            <label style={{ display: "block", textAlign: "left", fontSize: 14, marginBottom: 6 }}>
              취소 사유 (선택)
            </label>
            <Textarea
              value={cancelPrompt.reason}
              placeholder="예: 학부모 요청으로 환불"
              onChange={(event) =>
                setCancelPrompt((prev) => ({ ...prev, reason: event.target.value.slice(0, 80) }))
              }
            />
            <ModalActions>
              <GhostButton
                type="button"
                onClick={() => setCancelPrompt({ open: false, detail: null, reason: "" })}
                disabled={cancelMutation.isPending}
              >
                닫기
              </GhostButton>
              <PrimaryButton
                type="button"
                onClick={() => {
                  if (!cancelPrompt.detail?.info.id) return;
                  cancelMutation.mutate({
                    id: cancelPrompt.detail.info.id,
                    reason: cancelPrompt.reason.trim() || undefined,
                  });
                }}
                disabled={cancelMutation.isPending}
              >
                {cancelMutation.isPending ? "취소 중..." : "결제 취소"}
              </PrimaryButton>
            </ModalActions>
          </>
        ) : null}
      </Modal>
    </Page>
  );
}

function InvoicesTable(props: {
  rows: PaymentHistoryRow[];
  loading: boolean;
  page: number;
  size: number;
  totalPages: number;
  showPager: boolean;
  onChangePage: (page: number) => void;
  selected: number[];
  onToggleSelect: (id: number) => void;
  onRowClick: (row: PaymentHistoryRow) => void;
}) {
  const {
    rows,
    loading,
    page,
    size,
    totalPages,
    showPager,
    onChangePage,
    selected,
    onToggleSelect,
    onRowClick,
  } = props;
  const lastPage = Math.max(totalPages - 1, 0);
  const resolveCourseInfo = (row: PaymentHistoryRow) => {
    const anyRow = row as PaymentHistoryRow & {
      courseTitle?: string | null;
      courseCode?: string | null;
      courses?: PaymentCourseBrief[] | null;
    };
    const fallbackCourse =
      Array.isArray(anyRow.courses) && anyRow.courses.length ? anyRow.courses[0] : undefined;
    const title =
      row.course?.title?.trim() ||
      anyRow.courseTitle?.trim() ||
      fallbackCourse?.title?.trim() ||
      undefined;
    const code =
      row.course?.code?.trim() ||
      anyRow.courseCode?.trim() ||
      fallbackCourse?.code?.trim() ||
      undefined;
    return { title, code };
  };

  const renderStudentStatus = (status?: string | null) => {
    const value = status ?? "";
    if (!value) return "미정";
    return studentStatusLabel[value] ?? "미정";
  };

  const renderDueDate = (value?: string | null) => {
    if (!value) return "-";
    const formatted = formatKoreanDate(value, { includeWeekday: false });
    return <span className="due-date-text">{formatted}</span>;
  };
  return (
    <TableWrapper>
      <CenteredTable>
        <colgroup>
          <col style={{ width: "32px" }} />
          <col style={{ width: "68px" }} />
          <col style={{ width: "18%" }} />
          <col style={{ width: "22%" }} />
          <col style={{ width: "11%" }} />
          <col style={{ width: "10%" }} />
          <col style={{ width: "15%" }} />
          <col style={{ width: "20%" }} />
        </colgroup>
        <thead>
          <tr>
            <th />
            <th className="number-cell">번호</th>
            <th>학생</th>
            <th>수강과목</th>
            <th>학생 상태</th>
            <th>상태</th>
            <th>총 결제금액</th>
            <th>결제 예정일</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={8}>
                <Skeleton h={32} />
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={8}>
                <EmptyState>발송 대기 중인 청구서가 없습니다.</EmptyState>
              </td>
            </tr>
          ) : (
            rows.map((row, index) => {
              const courseInfo = resolveCourseInfo(row);
              return (
                <tr key={row.id} onClick={() => onRowClick(row)}>
                <td onClick={(event) => event.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selected.includes(row.id)}
                    onChange={() => onToggleSelect(row.id)}
                  />
                </td>
                <td className="number-cell">{page * size + index + 1}</td>
                <td>
                  <strong>{row.student.name}</strong>
                  <MetaText>{row.student.code}</MetaText>
                </td>
                <td>
                  {courseInfo.title ? (
                    <>
                      <strong>{courseInfo.title}</strong>
                      {courseInfo.code ? <MetaText>{courseInfo.code}</MetaText> : null}
                    </>
                  ) : (
                    <MetaText>-</MetaText>
                  )}
                </td>
                <td>
                  <StudentStatusBadge data-status={row.student.status ?? undefined}>
                    {renderStudentStatus(row.student.status)}
                  </StudentStatusBadge>
                </td>
                <td>
                  <StatusBadge status={row.status}>{statusLabel[row.status] ?? row.status}</StatusBadge>
                </td>
                <td>{formatMoney(row.finalAmount)}</td>
                <td>{renderDueDate(row.dueDate)}</td>
              </tr>
              );
            })
        )}
        </tbody>
      </CenteredTable>
      {showPager ? (
        <PagerBar>
          <GhostButton
            type="button"
            onClick={() => onChangePage(Math.max(0, page - 1))}
            disabled={page <= 0}
          >
            이전
          </GhostButton>
          <span>
            {page + 1} / {Math.max(1, totalPages)}
          </span>
          <GhostButton
            type="button"
            onClick={() => onChangePage(Math.min(lastPage, page + 1))}
            disabled={totalPages === 0 || page >= totalPages - 1}
          >
            다음
          </GhostButton>
        </PagerBar>
      ) : null}
    </TableWrapper>
  );
}

function HistoryTable(props: {
  rows: PaymentHistoryRow[];
  loading: boolean;
  page: number;
  size: number;
  totalPages: number;
  last?: boolean;
  onChangePage: (page: number) => void;
  onRowClick: (row: PaymentHistoryRow) => void;
  activeId: number | null;
  variant?: "pending" | "completed";
  onResendClick?: (row: PaymentHistoryRow) => void;
}) {
  const {
    rows,
    loading,
    page,
    totalPages,
    last,
    onChangePage,
    onRowClick,
    activeId,
    variant = "completed",
    onResendClick,
  } = props;
  const isLastPage = last ?? (totalPages === 0 || page >= totalPages - 1);
  const isPendingVariant = variant === "pending";
  const mapPendingStatus = (status: string) => {
    if (status === "UNPAID") return "PENDING";
    return status;
  };
  const resolvePendingSentDate = (row: PaymentHistoryRow) => {
    if (row.status === "SCHEDULED" || row.status === "FAILED") {
      return "-";
    }
    if (!row.invoiceRequestedAt) return "-";
    return formatKoreanDate(row.invoiceRequestedAt, { includeWeekday: false });
  };
  const normalizeStatus = (status?: string) => (status ?? "").trim().toUpperCase();
  const getPendingWeight = (status?: string) => {
    const normalized = normalizeStatus(status);
    if (normalized === "SCHEDULED") return 0;
    if (normalized === "FAILED") return 1;
    return 2;
  };
  const parseTimestamp = (value?: string | null) => {
    if (!value) return Number.MAX_SAFE_INTEGER;
    const time = Date.parse(value);
    return Number.isNaN(time) ? Number.MAX_SAFE_INTEGER : time;
  };
  const getPendingSortTimestamp = (row: PaymentHistoryRow) => {
    const anyRow = row as PaymentHistoryRow & { createdAt?: string | null };
    const requested = parseTimestamp(row.invoiceRequestedAt);
    const due = parseTimestamp(row.dueDate);
    const created = parseTimestamp(anyRow.createdAt);
    return Math.min(requested, due, created);
  };
  return (
    <TableWrapper>
      <CenteredTable>
        <colgroup>
          <col style={{ width: "28%" }} />
          <col style={{ width: "16%" }} />
          <col style={{ width: "22%" }} />
          <col style={{ width: "22%" }} />
          {isPendingVariant ? <col style={{ width: "12%" }} /> : null}
        </colgroup>
        <thead>
          <tr>
            <th>학생</th>
            <th>상태</th>
            <th>{isPendingVariant ? "최근 발송일" : "결제 완료일"}</th>
            <th>결제 수단</th>
            {isPendingVariant ? <th>재발송</th> : null}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={4}>
                <Skeleton h={32} />
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={4}>
                <EmptyState>표시할 결제 내역이 없습니다.</EmptyState>
              </td>
            </tr>
          ) : (
            (isPendingVariant
              ? [...rows].sort((a, b) => {
                  const weightDiff = getPendingWeight(a.status) - getPendingWeight(b.status);
                  if (weightDiff !== 0) return weightDiff;
                  const timeDiff = getPendingSortTimestamp(a) - getPendingSortTimestamp(b);
                  if (timeDiff !== 0) return timeDiff;
                  return (a.id ?? 0) - (b.id ?? 0);
                })
              : rows
            ).map((row) => {
              const canResend = row.status === "UNPAID" || row.status === "FAILED";
              const displayStatus = isPendingVariant ? mapPendingStatus(row.status) : row.status;
              return (
            <tr
              key={row.id}
              data-active={activeId === row.id}
              onClick={() => onRowClick(row)}
            >
                <td>
                  <strong>{row.student.name}</strong>
                  <MetaText>{row.student.code}</MetaText>
                </td>
                <td>
                  <StatusBadge status={displayStatus}>{statusLabel[displayStatus] ?? displayStatus}</StatusBadge>
                </td>
              <td>
                {isPendingVariant
                  ? resolvePendingSentDate(row)
                  : row.completedAt
                    ? formatKoreanDate(row.completedAt, { includeWeekday: false })
                    : "-"}
              </td>
              <td>
                {getPaymentMethodDisplay(row.paymentMethod, row.paymentType)}
              </td>
              {isPendingVariant ? (
                <td>
                  <ResendButton
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onResendClick?.(row);
                    }}
                    disabled={!canResend}
                  >
                    재발송
                  </ResendButton>
                </td>
              ) : null}
            </tr>
          );
            })
        )}
        </tbody>
      </CenteredTable>
      <PagerBar>
        <GhostButton
          type="button"
          onClick={() => onChangePage(Math.max(0, page - 1))}
          disabled={page <= 0}
        >
          이전
        </GhostButton>
        <span>
          {page + 1} / {Math.max(1, totalPages)}
        </span>
        <GhostButton
          type="button"
          onClick={() => onChangePage(page + 1)}
          disabled={isLastPage}
        >
          다음
        </GhostButton>
      </PagerBar>
    </TableWrapper>
  );
}

type DetailModalProps = {
  state: DetailState;
  onClose: () => void;
  onSave: (payload: PaymentInvoiceUpdatePayload) => void;
  saving: boolean;
  onCancelPayment?: (detail: PaymentDetail) => void;
  canceling?: boolean;
  onCancelSchedule?: (detail: PaymentDetail, alertId: number) => void;
  onSendScheduleNow?: (detail: PaymentDetail, alertId: number) => void;
  scheduleCancelling?: boolean;
  scheduleSending?: boolean;
};

function DetailModal({
  state,
  onClose,
  onSave,
  saving,
  onCancelPayment,
  canceling,
  onCancelSchedule,
  onSendScheduleNow,
  scheduleCancelling,
  scheduleSending,
}: DetailModalProps) {
  const isOpen = state.open;
  const detail = state.open ? state.data : null;
  const variant = state.open ? state.variant : "invoice";
  const [form, setForm] = useState<PaymentInvoiceUpdatePayload>({
    dueDate: "",
    amount: undefined,
    memo: "",
    discountType: undefined,
    discountValue: undefined,
    managerMemo: "",
    cycleValue: undefined,
    cycleUnit: undefined,
  });
  const [isEditing, setIsEditing] = useState(false);
  const saveInFlight = useRef(false);
  const [discountEnabled, setDiscountEnabled] = useState(false);

  useEffect(() => {
    if (!detail || variant !== "invoice") return;
    setForm({
      dueDate: detail.info.dueDate ?? "",
      amount: detail.info.originalAmount ?? undefined,
      memo: detail.info.memo ?? "",
      managerMemo: detail.info.managerMemo ?? "",
      discountType: detail.info.discountType ?? undefined,
      discountValue: detail.info.discountValue ?? undefined,
      cycleValue: detail.schedule?.cycleValue ?? undefined,
      cycleUnit: detail.schedule?.cycleUnit ?? "MONTHS",
    });
    setDiscountEnabled(Boolean(detail.info.discountType));
  }, [detail, variant]);

  useEffect(() => {
    setIsEditing(false);
  }, [detail?.info.id, variant]);

  useEffect(() => {
    if (!isEditing) {
      saveInFlight.current = false;
      return;
    }
    if (saving) {
      saveInFlight.current = true;
      return;
    }
    if (!saving && saveInFlight.current) {
      saveInFlight.current = false;
      setIsEditing(false);
    }
  }, [saving, isEditing]);

  if (!isOpen) return null;

  const isInvoiceVariant = variant === "invoice";
  const isScheduledPayment = detail?.info.status === "SCHEDULED";
  const scheduledAlertId =
    isScheduledPayment && detail?.latestAlert?.status === "PENDING"
      ? detail.latestAlert?.id ?? undefined
      : isScheduledPayment
        ? detail?.alerts?.find((alert) => alert.status === "PENDING")?.id ?? undefined
        : undefined;
  const canCancelPayment =
    !isInvoiceVariant &&
    detail?.info.status === "COMPLETED";
  const courseEntries: PaymentCourseBrief[] =
    detail?.courses && detail.courses.length
      ? detail.courses
      : [
          detail?.course ?? null,
          detail?.info.course ?? null,
        ].filter((item): item is PaymentCourseBrief => Boolean(item));
  const courseRows: PaymentCourseBrief[] = courseEntries.length
    ? courseEntries
    : [
        {
          id: 0,
          title: "수강 과목 정보가 없습니다.",
          code: "",
          fee: detail?.info.originalAmount ?? 0,
        },
      ];
  const modalClosable = !isInvoiceVariant || !isEditing;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!detail) return;
    onSave(form);
  };

  return (
    <Modal
      open={isOpen}
      onClose={modalClosable ? onClose : undefined}
      blockOutsideClose={isInvoiceVariant && isEditing}
      title={isInvoiceVariant ? "청구서 상세" : "결제 상세"}
      maxWidth={720}
    >
      {state.open && state.loading && (
        <Skeleton h={160} />
      )}
      {!state.loading && detail ? (
        <DetailLayout>
          <DetailColumn>
            <SectionTitle>학생 정보</SectionTitle>
            {isInvoiceVariant ? (
              <DetailList>
                <li>
                  <span>이름</span>
                  <strong>{detail.student.name}</strong>
                </li>
                <li>
                  <span>학생 코드</span>
                  <strong>{detail.student.code ?? "-"}</strong>
                </li>
                <li>
                  <span>연락처</span>
                  <strong>{detail.student.phoneNumber ?? "-"}</strong>
                </li>
                <li>
                  <span>보호자</span>
                  <strong>{detail.student.guardianPhone ?? "-"}</strong>
                </li>
              </DetailList>
            ) : (
              <InfoCard>
                <InfoRow>
                  <span>이름</span>
                  <strong>{detail.student.name}</strong>
                </InfoRow>
                <InfoRow>
                  <span>코드</span>
                  <strong>{detail.student.code ?? "-"}</strong>
                </InfoRow>
                <InfoRow>
                  <span>등록일</span>
                  <strong>
                    {detail.student.joinedDate
                      ? formatKoreanDate(detail.student.joinedDate, { includeWeekday: false })
                      : "-"}
                  </strong>
                </InfoRow>
                <InfoRow>
                  <span>연락처</span>
                  <strong>{detail.student.phoneNumber ?? "-"}</strong>
                </InfoRow>
                <InfoRow>
                  <span>학부모 연락처</span>
                  <strong>{detail.student.guardianPhone ?? "-"}</strong>
                </InfoRow>
              </InfoCard>
            )}
            <SectionTitle>수강 과목</SectionTitle>
            <CourseList>
            {courseRows.map((course: PaymentCourseBrief, index: number) => (
              <li key={`${course.id ?? "course"}-${index}`}>
                  <div className="info">
                    <strong>{course.title ?? "-"}</strong>
                    {course.code ? <span className="code">{course.code}</span> : null}
                  </div>
                  <span className="fee">{formatMoney(Number(course.fee ?? 0))}</span>
                </li>
              ))}
            </CourseList>
          </DetailColumn>
          <DetailColumn>
            {isInvoiceVariant ? (
              <form onSubmit={handleSubmit}>
                <SectionTitle>청구 정보</SectionTitle>
                {isScheduledPayment ? (
                  <ScheduleNotice>
                    <strong>예약 발송 예정</strong>
                    <span>
                      {detail?.latestAlert?.scheduledAt
                        ? formatKoreanDateTimeKST(detail.latestAlert.scheduledAt, {
                            includeWeekday: true,
                            showSeconds: true,
                          })
                        : "예약 시각 정보가 없습니다."}
                    </span>
                  </ScheduleNotice>
                ) : null}
                <label>
                  결제 예정일
                  <Input
                    type="date"
                    value={form.dueDate ?? ""}
                    disabled={!isEditing}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, dueDate: event.target.value }))
                    }
                  />
                </label>
                <label>
                  청구 금액
                  <Input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={
                      isEditing
                        ? String(form.amount ?? detail.info.originalAmount ?? "")
                        : formatCurrencyInput(
                            typeof form.amount === "number" ? form.amount : detail.info.originalAmount,
                          )
                    }
                    disabled={!isEditing}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        amount: parseNumericInput(event.target.value),
                      }))
                    }
                  />
                </label>
                <label>
                  결제 주기
                  <Input
                    type={isEditing ? "number" : "text"}
                    min={1}
                    value={
                      isEditing
                        ? String(form.cycleValue ?? detail.schedule?.cycleValue ?? "")
                        : formatCycleLabelFromSchedule(detail)
                    }
                    disabled={!isEditing}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        cycleValue: event.target.value ? Number(event.target.value) : undefined,
                      }))
                    }
                  />
                </label>
                <DiscountBox>
                  <DiscountFields
                    enabled={discountEnabled}
                    discountType={form.discountType ?? undefined}
                    discountValue={form.discountValue}
                    onToggleEnabled={(next) => {
                      if (!isEditing) return;
                      setDiscountEnabled(next);
                      setForm((prev) => ({
                        ...prev,
                        discountType: next ? prev.discountType ?? "AMOUNT" : undefined,
                        discountValue: next ? prev.discountValue : undefined,
                      }));
                    }}
                    onChangeType={(next) => {
                      if (!isEditing) return;
                      setForm((prev) => ({ ...prev, discountType: next }));
                    }}
                    onChangeValue={(value) => {
                      if (!isEditing) return;
                      setForm((prev) => ({
                        ...prev,
                        discountValue: typeof value === "number" ? value : undefined,
                      }));
                    }}
                    onChangeStartDate={() => {}}
                    onChangeEndDate={() => {}}
                    showPeriod={false}
                    disabled={!isEditing}
                  />
                </DiscountBox>
                <label>
                  메모
                  <Textarea
                    value={resolveMemoValue(form.memo, form.managerMemo)}
                    disabled={!isEditing}
                    onChange={(event) => {
                      const nextValue = event.target.value;
                      setForm((prev) => ({ ...prev, memo: nextValue, managerMemo: nextValue }));
                    }}
                  />
                </label>
                {isScheduledPayment && scheduledAlertId ? (
                  <ScheduleActions>
                    <GhostButton
                      type="button"
                      data-variant="warning"
                      onClick={(event) => {
                        event.preventDefault();
                        if (!detail) return;
                        onCancelSchedule?.(detail, scheduledAlertId);
                      }}
                      disabled={scheduleCancelling}
                    >
                      {scheduleCancelling ? "예약 취소 중..." : "예약 취소"}
                    </GhostButton>
                    <PrimaryButton
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        if (!detail) return;
                        onSendScheduleNow?.(detail, scheduledAlertId);
                      }}
                      disabled={scheduleSending}
                    >
                      {scheduleSending ? "즉시 발송 중..." : "즉시 발송"}
                    </PrimaryButton>
                  </ScheduleActions>
                ) : null}
                <ModalActions>
                  {isEditing ? (
                    <>
                      <PrimaryButton type="submit" disabled={saving}>
                        {saving ? "저장 중..." : "저장"}
                      </PrimaryButton>
                      <GhostButton type="button" onClick={onClose} disabled={isEditing || saving}>
                        닫기
                      </GhostButton>
                    </>
                  ) : (
                    <>
                      <PrimaryButton
                        type="button"
                        onClick={(event) => {
                          event.preventDefault();
                          setIsEditing(true);
                        }}
                      >
                        수정
                      </PrimaryButton>
                      <GhostButton type="button" onClick={onClose} disabled={saving}>
                        닫기
                      </GhostButton>
                    </>
                  )}
                </ModalActions>
              </form>
          ) : (
            (() => {
              const discountAmount = Math.max(
                0,
                (detail.info.originalAmount ?? 0) - (detail.info.finalAmount ?? 0),
                );
                const discountDisplay = discountAmount ? formatMoney(discountAmount) : "—";
                const methodDisplay = getPaymentMethodDisplay(
                  detail.info.paymentMethod,
                  detail.info.paymentType,
                );
                const completedText = detail.info.completedAt
                  ? formatKoreanDateTimeKST(detail.info.completedAt, {
                      includeWeekday: true,
                      showSeconds: true,
                    })
                  : "-";
                const canceledText = detail.info.canceledAt
                  ? formatKoreanDateTimeKST(detail.info.canceledAt, {
                      includeWeekday: true,
                      showSeconds: true,
                    })
                  : "-";
                const approvalNumber =
                  detail.info.approvalNumber && detail.info.approvalNumber.trim()
                    ? detail.info.approvalNumber
                    : "-";
                const statusText = statusLabel[detail.info.status] ?? detail.info.status;
                const nextDueText = computeNextDueDateLabel(detail);

                return (
                  <div>
                    {isScheduledPayment ? (
                      <>
                        <ScheduleNotice>
                          <strong>예약 발송 예정</strong>
                          <span>
                            {detail?.latestAlert?.scheduledAt
                              ? formatKoreanDateTimeKST(detail.latestAlert.scheduledAt, {
                                  includeWeekday: true,
                                  showSeconds: true,
                                })
                              : "예약 시각 정보가 없습니다."}
                          </span>
                        </ScheduleNotice>
                        {scheduledAlertId ? (
                          <ScheduleActions>
                            <GhostButton
                              type="button"
                              data-variant="warning"
                              onClick={() => detail && onCancelSchedule?.(detail, scheduledAlertId)}
                              disabled={scheduleCancelling}
                            >
                              {scheduleCancelling ? "예약 취소 중..." : "예약 취소"}
                            </GhostButton>
                            <PrimaryButton
                              type="button"
                              onClick={() => detail && onSendScheduleNow?.(detail, scheduledAlertId)}
                              disabled={scheduleSending}
                            >
                              {scheduleSending ? "즉시 발송 중..." : "즉시 발송"}
                            </PrimaryButton>
                          </ScheduleActions>
                        ) : null}
                      </>
                    ) : null}
                    <SectionTitle>상세 정보</SectionTitle>
                    <DetailInfoCard>
                      <DetailInfoRows>
                        <li>
                          <span>수강 금액</span>
                          <strong>{formatMoney(detail.info.originalAmount ?? 0)}</strong>
                        </li>
                        <li>
                          <span>할인</span>
                          <strong>{discountDisplay}</strong>
                        </li>
                        <li>
                          <span>최종 결제금액</span>
                          <strong>{formatMoney(detail.info.finalAmount ?? 0)}</strong>
                        </li>
                        <li>
                          <span>결제 수단</span>
                          <strong>{methodDisplay}</strong>
                        </li>
                        <li>
                          <span>결제 주기</span>
                          <strong>{getCycleLabel(detail, isInvoiceVariant ? "invoice" : "history")}</strong>
                        </li>
                        <li>
                          <span>결제 시간</span>
                          <strong>{completedText}</strong>
                        </li>
                        {detail.info.status === "CANCELED" ? (
                          <li>
                            <span>취소 시간</span>
                            <strong>{canceledText}</strong>
                          </li>
                        ) : null}
                        <li>
                          <span>승인 번호</span>
                          <strong>{approvalNumber}</strong>
                        </li>
                        <li>
                          <span>승인 상태</span>
                          <strong>{statusText}</strong>
                        </li>
                        <li>
                          <span>다음 결제일</span>
                          <strong>{nextDueText}</strong>
                        </li>
                      </DetailInfoRows>
                    </DetailInfoCard>
                    <SectionTitle>메모</SectionTitle>
                    <Paragraph>
                      {combineMemoValues(detail.info.memo, detail.info.managerMemo) || "메모가 없습니다."}
                    </Paragraph>
                    <ModalActions>
                      <PrimaryButton type="button" onClick={onClose}>
                        확인
                      </PrimaryButton>
                      {canCancelPayment && detail ? (
                        <GhostButton
                          type="button"
                          data-variant="danger"
                          onClick={() => onCancelPayment?.(detail)}
                          disabled={canceling}
                        >
                          {canceling ? "취소 중..." : "결제 취소"}
                        </GhostButton>
                      ) : null}
                    </ModalActions>
                  </div>
                );
              })()
            )}
          </DetailColumn>
        </DetailLayout>
      ) : null}
    </Modal>
  );
}

function parseNumericInput(raw: string): number | undefined {
  const digits = raw.replace(/[^0-9]/g, "");
  if (!digits) return undefined;
  const parsed = Number(digits);
  return Number.isNaN(parsed) ? undefined : parsed;
}

function formatCurrencyInput(value?: number | null): string {
  if (value == null || Number.isNaN(value)) return "";
  return formatMoney(value);
}

function combineMemoValues(memo?: string | null, managerMemo?: string | null): string {
  const parts = [memo, managerMemo]
    .map((value) => (typeof value === "string" ? value.trim() : ""))
    .filter((value) => value.length);
  return parts.join("\n");
}

function resolveMemoValue(memo?: string | null, managerMemo?: string | null): string {
  const combined = combineMemoValues(memo, managerMemo);
  return combined || "";
}

function getCycleLabel(detail: PaymentDetail, variant: "invoice" | "history"): string {
  if (variant === "history") {
    return (
      formatCycleLabelFromPeriod(detail.info.periodStart, detail.info.periodEnd) ??
      formatCycleLabelFromSchedule(detail)
    );
  }
  return formatCycleLabelFromSchedule(detail);
}

function formatCycleLabelFromSchedule(detail: PaymentDetail): string {
  const value = detail.schedule?.cycleValue;
  const unit = detail.schedule?.cycleUnit ?? "MONTHS";
  if (!value) return "—";
  const unitLabel =
    unit === "MONTHS" ? "개월" : unit === "WEEKS" ? "주" : unit === "DAYS" ? "일" : "";
  return `${value}${unitLabel || ""}`;
}

function formatCycleLabelFromPeriod(
  periodStart?: string | null,
  periodEnd?: string | null,
): string | null {
  if (!periodStart || !periodEnd) return null;
  const start = new Date(`${periodStart}T00:00:00`);
  const end = new Date(`${periodEnd}T00:00:00`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
    return null;
  }
  const totalMonths =
    (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  const anchor = new Date(start);
  anchor.setMonth(anchor.getMonth() + totalMonths);
  let months = totalMonths;
  if (anchor > end) {
    months = Math.max(0, months - 1);
  }
  if (months >= 1) {
    return `${months}개월`;
  }
  const dayMs = 1000 * 60 * 60 * 24;
  const days = Math.max(1, Math.round((end.getTime() - start.getTime()) / dayMs));
  if (days % 7 === 0) {
    const weeks = days / 7;
    return `${weeks}주`;
  }
  return `${days}일`;
}

function toLocalDateInputValue(date: Date = new Date()): string {
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60000);
  return local.toISOString().slice(0, 10);
}

function getPaymentMethodDisplay(method?: PaymentMethod | null, type?: PaymentType | null): string {
  const methodText = method ? methodLabel[method] ?? method : null;
  const typeText = type ? paymentTypeLabel[type] ?? type : null;
  return [typeText, methodText].filter(Boolean).join(" / ") || "-";
}

function computeNextDueDateLabel(detail: PaymentDetail): string {
  const dueDate = detail.info.dueDate;
  const cycleValue = detail.schedule?.cycleValue;
  const cycleUnit = detail.schedule?.cycleUnit ?? "MONTHS";
  if (!dueDate || !cycleValue) return "-";
  const base = new Date(dueDate);
  if (Number.isNaN(base.getTime())) return "-";
  const next = new Date(base);
  if (cycleUnit === "MONTHS") {
    next.setMonth(next.getMonth() + cycleValue);
  } else if (cycleUnit === "WEEKS") {
    next.setDate(next.getDate() + cycleValue * 7);
  } else if (cycleUnit === "DAYS") {
    next.setDate(next.getDate() + cycleValue);
  } else {
    return "-";
  }
  return formatKoreanDate(next, { includeWeekday: false });
}

type OnsiteCandidateModalProps = {
  open: boolean;
  onClose: () => void;
  rows: PaymentHistoryRow[];
  loading: boolean;
  page: number;
  totalPages: number;
  onChangePage: (page: number) => void;
  onSelect: (row: PaymentHistoryRow) => void;
};

function OnsiteCandidateModal({
  open,
  onClose,
  rows,
  loading,
  page,
  totalPages,
  onChangePage,
  onSelect,
}: OnsiteCandidateModalProps) {
  const lastPage = Math.max(totalPages - 1, 0);
  return (
    <Modal open={open} onClose={onClose} title="현장 결제 대상 선택" maxWidth={760}>
      {loading ? (
        <Skeleton h={160} />
      ) : rows.length === 0 ? (
        <EmptyState>발송 가능한 청구서가 없습니다.</EmptyState>
      ) : (
        <>
          <TableWrapper>
            <CandidateTable>
              <thead>
                <tr>
                  <th>학생</th>
                  <th>수강 과목</th>
                  <th>청구 금액</th>
                  <th>결제 예정일</th>
                  <th>상태</th>
                  <th>선택</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <strong>{row.student.name}</strong>
                      <span className="sub">{row.student.code ?? "-"}</span>
                    </td>
                    <td>{row.course?.title ?? "과목 정보 없음"}</td>
                    <td>{formatMoney(row.finalAmount ?? row.originalAmount ?? 0)}</td>
                    <td>
                      {row.dueDate
                        ? formatKoreanDate(row.dueDate, { includeWeekday: false })
                        : "-"}
                    </td>
                    <td>
                      <StatusBadge status={row.status}>
                        {statusLabel[row.status] ?? row.status}
                      </StatusBadge>
                    </td>
                    <td>
                      <SelectButton type="button" onClick={() => onSelect(row)}>
                        선택
                      </SelectButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </CandidateTable>
          </TableWrapper>
          {totalPages > 1 ? (
            <PagerBar>
              <GhostButton type="button" onClick={() => onChangePage(Math.max(0, page - 1))} disabled={page <= 0}>
                이전
              </GhostButton>
              <span>
                {Math.min(page + 1, totalPages)} / {totalPages}
              </span>
              <GhostButton
                type="button"
                onClick={() => onChangePage(Math.min(lastPage, page + 1))}
                disabled={page >= lastPage}
              >
                다음
              </GhostButton>
            </PagerBar>
          ) : null}
        </>
      )}
    </Modal>
  );
}

type OnsiteModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: PaymentOnsitePayload) => void;
  submitting: boolean;
  target: PaymentHistoryRow | null;
  detail: PaymentDetail | null;
  detailLoading: boolean;
};

function OnsitePaymentModal({
  open,
  onClose,
  onSubmit,
  submitting,
  target,
  detail,
  detailLoading,
}: OnsiteModalProps) {
  const [tuitionAmount, setTuitionAmount] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [paymentDate, setPaymentDate] = useState(() => toLocalDateInputValue());
  const [method, setMethod] = useState<PaymentMethod>("CASH");
  const [memoValue, setMemoValue] = useState("");

  useEffect(() => {
    if (!open) return;
    const baseAmount =
      detail?.info.originalAmount ?? target?.originalAmount ?? target?.finalAmount ?? 0;
    const finalFromDetail = detail?.info.finalAmount ?? target?.finalAmount ?? baseAmount;
    const computedDiscount =
      typeof baseAmount === "number" && typeof finalFromDetail === "number"
        ? Math.max(0, baseAmount - finalFromDetail)
        : 0;
    setTuitionAmount(baseAmount);
    setDiscountAmount(computedDiscount);
    setPaymentDate(toLocalDateInputValue());
    setMethod("CASH");
    setMemoValue(detail?.info.memo ?? "");
  }, [
    open,
    detail?.info.id,
    detail?.info.originalAmount,
    detail?.info.finalAmount,
    detail?.info.memo,
    target?.id,
    target?.originalAmount,
    target?.finalAmount,
  ]);

  if (!open || !target) return null;

  const student = detail?.student ?? target.student;
  const courseItems: PaymentCourseBrief[] =
    detail?.courses && detail.courses.length
      ? detail.courses
      : detail?.course
        ? [detail.course]
        : target.course
          ? [target.course]
          : [];
  const dueDate = detail?.info.dueDate ?? target.dueDate ?? "";
  const finalAmount = Math.max(0, tuitionAmount - discountAmount);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({
      amount: finalAmount,
      method,
      paymentType: "OFFLINE",
      paidAt: paymentDate ? new Date(paymentDate).toISOString() : undefined,
      memo: memoValue,
    });
  };

  const formatNumber = (value?: number) => {
    if (value == null || Number.isNaN(value)) return "";
    return Number(value).toLocaleString("ko-KR");
  };

  const joinedDateText = student?.joinedDate
    ? formatKoreanDate(student.joinedDate, { includeWeekday: false })
    : "-";

  return (
    <Modal open={open} onClose={onClose} title="현장 결제" maxWidth={560}>
      {detailLoading ? (
        <Skeleton h={320} />
      ) : (
        <form onSubmit={handleSubmit}>
          <OnsiteSection>
            <SectionHeading>학생 정보</SectionHeading>
            <InfoCard>
              <InfoRow>
                <span>이름</span>
                <strong>{student?.name ?? "-"}</strong>
              </InfoRow>
              <InfoRow>
                <span>코드</span>
                <strong>{student?.code ?? "-"}</strong>
              </InfoRow>
              <InfoRow>
                <span>등록일</span>
                <strong>{joinedDateText}</strong>
              </InfoRow>
              <InfoRow>
                <span>연락처</span>
                <strong>{student?.phoneNumber ?? "-"}</strong>
              </InfoRow>
            </InfoCard>
          </OnsiteSection>

          <OnsiteSection>
            <SectionHeading>수강 과목</SectionHeading>
            {courseItems.length ? (
              <CourseCard>
                {courseItems.map((course: PaymentCourseBrief) => (
                  <li key={course?.id ?? course?.title ?? "course"}>
                    <div>
                      <strong>{course?.title ?? "과목 정보 없음"}</strong>
                      {course?.code ? <span className="code">{course.code}</span> : null}
                    </div>
                    <span className="fee">{formatMoney(Number(course?.fee ?? 0))}</span>
                  </li>
                ))}
              </CourseCard>
            ) : (
              <EmptyState>등록된 수강 과목이 없습니다.</EmptyState>
            )}
          </OnsiteSection>

          <OnsiteSection>
            <SectionHeading>상세 정보</SectionHeading>
            <AmountGrid>
              <label>
                수강 금액
                <AmountInputWrapper>
                  <AmountInput
                    type="text"
                    inputMode="numeric"
                    value={formatNumber(tuitionAmount)}
                    onChange={(event) =>
                      setTuitionAmount(parseNumericInput(event.target.value) ?? 0)
                    }
                  />
                  <AmountSuffix>원</AmountSuffix>
                </AmountInputWrapper>
              </label>
              <label>
                할인
                <AmountInputWrapper>
                  <AmountInput
                    type="text"
                    inputMode="numeric"
                    value={formatNumber(discountAmount)}
                    onChange={(event) =>
                      setDiscountAmount(parseNumericInput(event.target.value) ?? 0)
                    }
                  />
                  <AmountSuffix>원</AmountSuffix>
                </AmountInputWrapper>
              </label>
              <label>
                최종 결제 금액
                <AmountInputWrapper>
                  <AmountInput type="text" value={formatNumber(finalAmount)} readOnly />
                  <AmountSuffix>원</AmountSuffix>
                </AmountInputWrapper>
              </label>
            </AmountGrid>
            <label>
              결제일
              <Input
                type="date"
                value={paymentDate}
                onChange={(event) => setPaymentDate(event.target.value)}
              />
            </label>
            <label>
              결제 수단
              <MethodToggle>
                {[
                  { label: "카드", value: "CARD" },
                  { label: "현금", value: "CASH" },
                  { label: "계좌이체", value: "BANK_TRANSFER" },
                ].map((option) => (
                  <MethodButton
                    type="button"
                    key={option.value}
                    data-active={method === option.value}
                    onClick={() => setMethod(option.value as PaymentMethod)}
                  >
                    {option.label}
                  </MethodButton>
                ))}
              </MethodToggle>
            </label>
            <label>
              결제 예정일
              <Input type="date" value={dueDate ?? ""} disabled />
            </label>
          </OnsiteSection>

          <OnsiteSection>
            <SectionHeading>메모</SectionHeading>
            <Textarea value={memoValue} onChange={(event) => setMemoValue(event.target.value)} />
          </OnsiteSection>

          <ModalActions>
            <GhostButton type="button" onClick={onClose}>
              취소
            </GhostButton>
            <PrimaryButton type="submit" disabled={submitting}>
              {submitting ? "저장 중..." : "저장"}
            </PrimaryButton>
          </ModalActions>
        </form>
      )}
    </Modal>
  );
}

type SummaryStat = {
  label: string;
  value: string;
  icon: ReactNode;
  tone: "primary" | "success" | "warning" | "danger" | "muted";
};

function extractSummary(summary?: PaymentSummary | null, unsentOverride?: number): SummaryStat[] {
  if (!summary) {
    return [
      { label: "이번달 총 결제액", value: "—", icon: paidIcon, tone: "muted" },
      { label: "이번달 대기 금액", value: "—", icon: unpaidIcon, tone: "muted" },
      { label: "이번달 대기 인원", value: "—", icon: peopleIcon, tone: "muted" },
      { label: "청구서 미발송 인원", value: "—", icon: paperIcon, tone: "muted" },
    ];
  }
  const unsent = typeof unsentOverride === "number" ? unsentOverride : summary.unsentCount;
  return [
    { label: "이번달 총 결제액", value: formatMoney(summary.paidAmount), icon: paidIcon, tone: "primary" },
    { label: "이번달 대기 금액", value: formatMoney(summary.unpaidAmount), icon: unpaidIcon, tone: "danger" },
    { label: "이번달 대기 인원", value: `${summary.unpaidCount}명`, icon: peopleIcon, tone: "warning" },
    { label: "청구서 미발송 인원", value: `${unsent}명`, icon: paperIcon, tone: "success" },
  ];
}

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
  margin-bottom: 16px;
`;

const StatCard = styled.article`
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.borderMuted ?? p.theme.colors.border};
  border-radius: 16px;
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: ${(p) => p.theme.shadow?.low ?? "0 4px 12px rgba(15, 23, 42, 0.06)"};
`;

const StatHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const StatTitle = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${(p) => p.theme.colors.textMuted};
`;

const StatValue = styled.span`
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: ${(p) => p.theme.colors.text};
`;

const StatIcon = styled.span<{ "data-tone": SummaryStat["tone"] }>`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  font-size: 18px;
  ${({ "data-tone": tone, theme }) => {
    const palette: Record<SummaryStat["tone"], { bg: string; fg: string }> = {
      primary: { bg: theme.colors.primarySurface ?? "#eef2ff", fg: theme.colors.primary },
      success: { bg: "#ecfdf5", fg: "#059669" },
      warning: { bg: "#fff7ed", fg: "#ea580c" },
      danger: { bg: "#fef2f2", fg: "#dc2626" },
      muted: { bg: theme.colors.surfaceAlt ?? "#f3f4f6", fg: theme.colors.textMuted },
    };
    const current = palette[tone] ?? palette.muted;
    return `
      background: ${current.bg};
      color: ${current.fg};
    `;
  }}
`;

const paidIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1v22" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const unpaidIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M6 21h12" />
    <path d="M12 7v6" />
    <path d="M9 10h6" />
  </svg>
);

const peopleIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const paperIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
    <path d="M16 13H8" />
    <path d="M16 17H8" />
    <path d="M10 9H8" />
  </svg>
);

const Panels = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
  gap: 24px;
`;

const PanelControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const ToggleGroup = styled.div`
  display: inline-flex;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.xl};
  overflow: hidden;
`;

const ToggleButton = styled.button<{ $active?: boolean }>`
  border: none;
  background: ${({ $active, theme }) => ($active ? theme.colors.primarySurface : "transparent")};
  color: ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.text)};
  font-weight: 600;
  padding: 6px 14px;
  cursor: pointer;
  font-size: 13px;
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 12px;
  flex-wrap: wrap;
`;

const SectionInfo = styled.div`
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  align-items: flex-start;
`;

const InfoText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 200px;
`;

const SectionActions = styled.div`
  display: inline-flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: flex-end;
`;

const SectionHeading = styled.h4`
  margin: 0;
  font-size: 15px;
  color: ${(p) => p.theme.colors.text};
`;

const SmallText = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${(p) => p.theme.colors.textMuted};
`;

const HistoryFilters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: flex-end;
  margin-bottom: 16px;
  width: 100%;
`;

const HistorySplit = styled.div`
  display: grid;
  gap: 18px;
  grid-template-columns: 1fr;
  grid-template-areas:
    "completed"
    "pending";
  @media (min-width: 960px) {
    grid-template-columns: minmax(320px, 1.1fr) minmax(320px, 0.9fr);
    grid-template-areas: "pending completed";
    align-items: flex-start;
  }
`;

const HistoryColumn = styled.div`
  display: grid;
  gap: 12px;
  grid-area: pending;
`;

const HistoryColumnSticky = styled.div`
  display: grid;
  gap: 12px;
  grid-area: completed;
  position: sticky;
  top: var(--sticky-top, 0px);
  align-self: flex-start;
`;

const HistoryColumnHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  small {
    color: ${(p) => p.theme.colors.textMuted};
    font-size: 12px;
  }
`;

const ColumnTitle = styled.h4`
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: ${(p) => p.theme.colors.text};
`;

const KakaoButton = styled.button`
  border: 1px solid #f4d000;
  background: #fee500;
  color: #1e1200;
  border-radius: ${(p) => p.theme.radii.md};
  padding: 0 18px;
  height: 40px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: transform 0.15s ease;
  &:hover:not(:disabled) {
    transform: translateY(-1px);
  }
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

const PeriodFilter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1 1 280px;
  span {
    font-size: 13px;
    color: ${(p) => p.theme.colors.text};
    font-weight: 600;
  }
  div {
    display: flex;
    align-items: center;
    gap: 8px;
    input {
      flex: 1 1 0;
      min-width: 0;
    }
  }
`;

const FilterField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1 1 240px;
  span {
    font-size: 13px;
    color: ${(p) => p.theme.colors.text};
    font-weight: 600;
  }
  input,
  select {
    min-width: 0;
    width: 100%;
  }
`;

const FilterFieldWide = styled(FilterField)`
  flex: 2 1 360px;
`;

const FilterFieldCompact = styled(FilterField)`
  flex: 0 0 180px;
`;

const Input = styled.input`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 10px;
  padding: 8px 12px;
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;
`;

const Select = styled(SelectBox)`
  width: 100%;
`;

const Textarea = styled.textarea`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 10px;
  padding: 8px 12px;
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;
  min-height: 96px;
`;

const CandidateTable = styled(TableBase)`
  thead th {
    text-align: center;
  }
  th,
  td {
    text-align: center;
  }
  td {
    vertical-align: middle;
  }
  td .sub {
    display: block;
    margin-top: 4px;
    font-size: 12px;
    color: ${(p) => p.theme.colors.textMuted};
  }
`;

const TableWrapper = styled.div`
  overflow-x: auto;
`;

const SelectButton = styled(PrimaryButton)`
  height: 32px;
  padding: 0 12px;
  font-size: 13px;
`;

const ResendButton = styled(PrimaryButton)`
  height: 30px;
  padding: 0 12px;
  font-size: 12px;
`;

const ReasonBox = styled.div`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.md};
  padding: ${(p) => p.theme.spacing.sm};
  background: ${(p) => p.theme.colors.surfaceMuted};
  color: ${(p) => p.theme.colors.text};
  min-height: 48px;
  white-space: pre-wrap;
  font-size: ${(p) => p.theme.font.size.sm};
`;

const HintTitle = styled.p`
  margin: ${(p) => p.theme.spacing.md} 0 ${(p) => p.theme.spacing.xs};
  font-weight: 600;
  color: ${(p) => p.theme.colors.text};
  font-size: ${(p) => p.theme.font.size.sm};
`;

const HintList = styled.ul`
  margin: 0;
  padding-left: 18px;
  color: ${(p) => p.theme.colors.textMuted};
  font-size: ${(p) => p.theme.font.size.xs};
  display: grid;
  gap: 4px;
`;

const HintFooter = styled.p`
  margin: ${(p) => p.theme.spacing.sm} 0 0;
  font-size: ${(p) => p.theme.font.size.xs};
  color: ${(p) => p.theme.colors.textMuted};
`;

const HintLink = styled.a`
  color: ${(p) => p.theme.colors.primary};
  text-decoration: underline;
`;

const OnsiteSection = styled.div`
  display: grid;
  gap: 12px;
  margin-bottom: 20px;
`;

const InfoCard = styled.div`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.md};
  padding: 16px;
  display: grid;
  gap: 10px;
  background: ${(p) => p.theme.colors.surfaceAlt};
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  span {
    color: ${(p) => p.theme.colors.textMuted};
  }
  strong {
    color: ${(p) => p.theme.colors.text};
  }
`;

const CourseCard = styled.ul`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.md};
  padding: 0;
  margin: 0;
  list-style: none;
  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid ${(p) => p.theme.colors.borderMuted};
  }
  li:last-child {
    border-bottom: none;
  }
  .code {
    font-size: 12px;
    color: ${(p) => p.theme.colors.textMuted};
    margin-left: 6px;
  }
  .fee {
    font-weight: 600;
    color: ${(p) => p.theme.colors.text};
  }
`;

const DetailInfoCard = styled.div`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.md};
  padding: 16px;
  display: grid;
  gap: 12px;
  background: ${(p) => p.theme.colors.surfaceAlt};
`;

const DetailInfoRows = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 10px;
  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
  }
  span {
    color: ${(p) => p.theme.colors.textMuted};
  }
  strong {
    color: ${(p) => p.theme.colors.text};
  }
`;

const AmountGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px 16px;
`;

const AmountInputWrapper = styled.div`
  position: relative;
`;

const AmountInput = styled.input`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 10px;
  padding: 8px 40px 8px 12px;
  width: 100%;
  font-size: 14px;
  box-sizing: border-box;
`;

const AmountSuffix = styled.span`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 13px;
  color: ${(p) => p.theme.colors.textMuted};
`;

const MethodToggle = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const MethodButton = styled.button`
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.surface};
  color: ${(p) => p.theme.colors.text};
  border-radius: 999px;
  padding: 8px 16px;
  font-size: 13px;
  cursor: pointer;
  &[data-active='true'] {
    border-color: ${(p) => p.theme.colors.primary};
    background: ${(p) => p.theme.colors.primarySurface};
    color: ${(p) => p.theme.colors.primary};
    font-weight: 600;
  }
`;

const StyledTable = styled(TableBase)`
  tbody tr[data-active='true'] td {
    background: ${(p) => p.theme.colors.primarySurface};
  }

  tbody tr td {
    cursor: pointer;
  }

  tbody tr td:first-child input {
    cursor: pointer;
  }
  .due-date-text {
    display: inline-block;
    min-width: 140px;
    white-space: nowrap;
  }
  .number-cell {
    white-space: nowrap;
  }
`;

const CenteredTable = styled(StyledTable)`
  thead th {
    text-align: center;
  }
  th,
  td {
    text-align: center;
  }
`;

const PagerBar = styled.div`
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  span {
    font-size: 13px;
    color: ${(p) => p.theme.colors.textMuted};
  }
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  background: ${({ status }) => (statusColor[status] ?? "#d1d5db")}1A;
  color: ${({ status }) => statusColor[status] ?? "#52525b"};
`;

const StudentStatusBadge = styled.span<{ "data-status"?: string }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  background: ${({ "data-status": status }) =>
    (studentStatusColor[status ?? ""] ?? "#94a3b8")}1A;
  color: ${({ "data-status": status }) => studentStatusColor[status ?? ""] ?? "#475569"};
`;

const MetaText = styled.span`
  display: block;
  font-size: 12px;
  color: ${(p) => p.theme.colors.textMuted};
`;

const DetailLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  max-height: 70vh;
  overflow: auto;
  align-items: flex-start;
  align-content: flex-start;
`;

const DetailColumn = styled.div`
  display: grid;
  gap: 16px;
  align-items: flex-start;
  align-content: flex-start;
`;

const SectionTitle = styled.h4`
  margin: 0;
  font-size: 15px;
  color: ${(p) => p.theme.colors.text};
`;

const DetailList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.md};
  li {
    display: flex;
    justify-content: space-between;
    padding: 10px 12px;
    border-bottom: 1px solid ${(p) => p.theme.colors.borderMuted};
    span {
      font-size: 13px;
      color: ${(p) => p.theme.colors.textMuted};
    }
    strong {
      font-size: 14px;
      color: ${(p) => p.theme.colors.text};
    }
  }
  li:last-child {
    border-bottom: none;
  }
`;

const ModalActions = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const ConfirmIntro = styled.div`
  text-align: center;
  margin-bottom: 18px;
  p {
    margin: 6px 0;
    font-size: 15px;
    font-weight: 600;
    color: ${(p) => p.theme.colors.text};
  }
`;

const Paragraph = styled.p`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.md};
  padding: 12px;
  min-height: 80px;
  white-space: pre-wrap;
`;

const DiscountBox = styled.div`
  margin: 12px 0;
  padding: 12px;
  border: 1px solid ${(p) => p.theme.colors.borderMuted ?? p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.md};
  background: ${(p) => p.theme.colors.surfaceAlt ?? "#f9fafb"};
`;

const ScheduleNotice = styled.div`
  margin: 12px 0;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #fed7aa;
  background: #fff7ed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  strong {
    color: #c2410c;
  }
  span {
    color: #7c2d12;
    font-weight: 600;
  }
`;

const ScheduleActions = styled.div`
  display: flex;
  gap: 8px;
  margin: 16px 0 8px;
  flex-wrap: wrap;
  button[data-variant="warning"] {
    border-color: #f97316;
    color: #b45309;
  }
`;

const CourseList = styled(DetailList)`
  li {
    align-items: center;
  }
  .info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .info .code {
    font-size: 12px;
    color: ${(p) => p.theme.colors.textMuted};
  }
  .fee {
    font-weight: 700;
    font-size: 14px;
    color: ${(p) => p.theme.colors.text};
  }
`;
const FilterActions = styled.div`
  display: flex;
  gap: 8px;
  margin-left: auto;
  align-items: flex-end;
  flex-wrap: wrap;
`;
