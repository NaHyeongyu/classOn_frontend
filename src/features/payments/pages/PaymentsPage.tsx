import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
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
  ToggleSwitch,
} from "@/components/common/UI";
import Modal from "@/components/common/Modal";
import ConfirmModal from "@/components/common/ConfirmModal";
import { useToast } from "@/components/common/Toast";
import {
  cancelPayment,
  cancelScheduledAlert,
  deletePaymentInvoice,
  getPaymentDetail,
  getPaymentSummary,
  listPaymentHistory,
  listPendingHistory,
  listPaymentInvoices,
  listPaymentTemplates,
  markOnsitePayment,
  sendScheduledAlertNow,
  updatePaymentTemplateAutoGenerate,
  updatePaymentInvoice,
  type PaymentInvoiceUpdatePayload,
  type PaymentOnsitePayload,
  type PaymentTemplateSetup,
} from "@/api/payments";
import { listStudents, type Student } from "@/api/students";
import type {
  PaymentSummary,
  PaymentHistoryRow,
  PaymentDetail,
} from "@classon/shared-types";
import type { PageResult } from "@/types/paging";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatKoreanDate, formatMoney } from "@/lib/format";
import { formatPhoneKR } from "@/lib/paymentUiLabels";
import { readableError } from "@/lib/errors";
import { useNavigate } from "react-router-dom";
import { routes, paths } from "@/routes";
import { invalidatePaymentsQueries } from "@/lib/paymentsCache";
import { PgFeeGuideModal } from "@/components/payments/PgFeeGuideModal";
import { useMyAcademyPage } from "@/features/myAcademy/hooks/useMyAcademyPage";
import { HistoryTable, InvoicesTable } from "@/features/payments/components/PaymentsTables";
import { DetailModal, OnsiteCandidateModal, OnsitePaymentModal } from "@/features/payments/components/PaymentsModals";
import type { DetailState } from "@/features/payments/types";
import Pagination from "@/components/common/Pagination";

const today = new Date();
const defaultMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;

const formatDateInput = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const getMonthRangeFor = (base: Date) => {
  const start = new Date(base.getFullYear(), base.getMonth(), 1);
  const end = new Date(base.getFullYear(), base.getMonth() + 1, 0);
  return { from: formatDateInput(start), to: formatDateInput(end) };
};

const currentMonthRange = getMonthRangeFor(today);

const createMonthRange = () => ({ ...currentMonthRange });

const invoiceStatusParam = "UNPAID,SCHEDULED";
const createDefaultHistoryFilters = (): HistoryFilters => ({
  from: "",
  to: "",
  q: "",
});

type StudentStatusFilter = "ALL" | "ENROLLED" | "ON_LEAVE" | "PENDING" | "STOPPED";
type HistoryFilters = {
  from: string;
  to: string;
  q: string;
};

export default function Payments() {
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();
  const academyState = useMyAcademyPage();
  const paymentEnabled = academyState.academy.paymentEnabled;
  const queryClient = useQueryClient();

  const [invoiceSearch, setInvoiceSearch] = useState("");
  const [invoiceSearchInput, setInvoiceSearchInput] = useState("");
  const [invoiceStudentStatus, setInvoiceStudentStatus] = useState<StudentStatusFilter>("ALL");
  const [invoiceDateRange, setInvoiceDateRange] = useState(() => createMonthRange());
  const [invoicePage, setInvoicePage] = useState(0);
  const invoicePageSize = 10;
  const invoiceListFilters = useMemo(
    () => ({
      q: invoiceSearch,
      from: invoiceDateRange.from || undefined,
      to: invoiceDateRange.to || undefined,
      studentStatus: invoiceStudentStatus === "ALL" ? undefined : invoiceStudentStatus,
    }),
    [invoiceSearch, invoiceDateRange.from, invoiceDateRange.to, invoiceStudentStatus],
  );

  const [historyFilters, setHistoryFilters] = useState<HistoryFilters>(() => ({
    ...createDefaultHistoryFilters(),
  }));
  const [historyCompletedPage, setHistoryCompletedPage] = useState(0);
  const [historyPendingPage, setHistoryPendingPage] = useState(0);
  const historyPageSize = 10;
  const showCompletedColumn = true;
  const pendingEmptyMessage: string | undefined = undefined;
  const completedPlaceholderMessage: string | undefined = undefined;

  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState<number[]>([]);
  const [invoiceSelectAllLoading, setInvoiceSelectAllLoading] = useState(false);
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

  const [templateSearchInput, setTemplateSearchInput] = useState("");
  const [templateSearch, setTemplateSearch] = useState("");
  const [templatePage, setTemplatePage] = useState(0);
  const templatePageSize = 10;

  const summaryQuery = useQuery<PaymentSummary>({
    queryKey: ["payments", "summary", defaultMonth],
    queryFn: () => getPaymentSummary({ month: defaultMonth }),
    staleTime: 30_000,
    enabled: paymentEnabled,
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
        status: invoiceStatusParam,
        from: invoiceDateRange.from || undefined,
        to: invoiceDateRange.to || undefined,
        studentStatus: invoiceStudentStatus === "ALL" ? undefined : invoiceStudentStatus,
      }),
    placeholderData: (previousData: PageResult<PaymentHistoryRow> | undefined) => previousData,
    enabled: paymentEnabled,
  });

  const completedHistoryStatusParam =
    "COMPLETED,CANCELED";

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
        status: completedHistoryStatusParam,
        q: historyFilters.q,
        page: historyCompletedPage,
        size: historyPageSize,
      }),
    placeholderData: (previousData: PageResult<PaymentHistoryRow> | undefined) => previousData,
    enabled: paymentEnabled && showCompletedColumn,
  });

  const pendingHistoryQuery = useQuery<PageResult<PaymentHistoryRow>>({
    queryKey: [
      "payments",
      "history",
      "pending",
      historyFilters.from,
      historyFilters.to,
      historyFilters.q,
      historyPendingPage,
      historyPageSize,
    ],
    queryFn: () =>
      listPendingHistory({
        from: historyFilters.from || undefined,
        to: historyFilters.to || undefined,
        q: historyFilters.q,
        status: "PENDING,SCHEDULED,UNPAID,FAILED",
        page: historyPendingPage,
        size: historyPageSize,
      }),
    placeholderData: (previousData: PageResult<PaymentHistoryRow> | undefined) => previousData,
    enabled: paymentEnabled,
  });

  const templatesQuery = useQuery<PaymentTemplateSetup[]>({
    queryKey: ["payments", "templates"],
    queryFn: () => listPaymentTemplates(),
    staleTime: 30_000,
    enabled: paymentEnabled,
  });

  const templateToggleMutation = useMutation({
    mutationFn: (vars: { templateId: number; autoGenerate: boolean }) =>
      updatePaymentTemplateAutoGenerate(vars.templateId, vars.autoGenerate),
    onSuccess: (updated: PaymentTemplateSetup) => {
      queryClient.setQueryData<PaymentTemplateSetup[]>(["payments", "templates"], (prev) =>
        (prev ?? []).map((row) => (row.templateId === updated.templateId ? updated : row)),
      );
      invalidatePaymentsQueries(queryClient);
      success(updated.autoGenerate ? "자동 생성이 켜졌습니다." : "자동 생성이 꺼졌습니다.");
    },
    onError: (err: unknown) => toastError(readableError(err, "자동 생성 변경에 실패했습니다.")),
  });

  const studentsQuery = useQuery<PageResult<Student>>({
    queryKey: ["payments", "templates", "students"],
    queryFn: () => listStudents({ size: 1000 }),
    staleTime: 60_000,
    enabled: paymentEnabled,
  });

  const studentById = useMemo(() => {
    const map = new Map<number, Student>();
    for (const student of studentsQuery.data?.content ?? []) {
      if (typeof student.id === "number") {
        map.set(student.id, student);
      }
    }
    return map;
  }, [studentsQuery.data]);

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
    setSelectedInvoiceIds([]);
  }, [invoiceSearch, invoiceDateRange.from, invoiceDateRange.to, invoiceStudentStatus]);

  useEffect(() => {
    setHistoryCompletedPage(0);
    setHistoryPendingPage(0);
  }, [historyFilters.from, historyFilters.to, historyFilters.q]);

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: PaymentInvoiceUpdatePayload }) =>
      updatePaymentInvoice(id, payload),
    onSuccess: (detail: PaymentDetail) => {
      success("청구서를 업데이트했습니다.");
      setDetailState({ open: false });
      invalidatePaymentsQueries(queryClient);
    },
    onError: (err: unknown) => toastError(readableError(err, "청구서 수정에 실패했습니다.")),
  });

  const [deletePrompt, setDeletePrompt] = useState<{ open: boolean; id: number | null }>({
    open: false,
    id: null,
  });

  const deleteInvoiceMutation = useMutation({
    mutationFn: (id: number) => deletePaymentInvoice(id),
    onSuccess: () => {
      success("청구서를 삭제했습니다.");
      setDetailState({ open: false });
      setDeletePrompt({ open: false, id: null });
      invalidatePaymentsQueries(queryClient);
      setSelectedInvoiceIds([]);
    },
    onError: (err: unknown) => toastError(readableError(err, "청구서 삭제에 실패했습니다.")),
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
      const sendFailed =
        detail.info.status === "FAILED" ||
        detail.latestAlert?.status === "FAILED";
      if (sendFailed) {
        toastError("카카오톡 발송에 실패했습니다. 상세 원인을 확인한 뒤 다시 시도해 주세요.");
      } else {
        success("예약을 즉시 발송으로 전환했습니다.");
      }
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

  const invoiceTotalElements = invoices?.totalElements ?? invoiceRows.length;
  const isAllInvoicesSelected =
    invoiceTotalElements > 0 && selectedInvoiceIds.length >= invoiceTotalElements;

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
      onsiteContext === "invoice" ? invoiceStudentStatus : "PENDING,SCHEDULED,UNPAID,FAILED",
      onsitePage,
      onsitePageSize,
    ],
    queryFn: () => {
      if (onsiteContext === "history") {
        return listPendingHistory({
          from: historyFilters.from || undefined,
          to: historyFilters.to || undefined,
          q: historyFilters.q,
          status: "PENDING,SCHEDULED,UNPAID,FAILED",
          page: onsitePage,
          size: onsitePageSize,
        });
      }
      return listPaymentInvoices({
        status: invoiceStatusParam,
        q: invoiceSearch,
        page: onsitePage,
        size: onsitePageSize,
        from: invoiceDateRange.from || undefined,
        to: invoiceDateRange.to || undefined,
        studentStatus: invoiceStudentStatus === "ALL" ? undefined : invoiceStudentStatus,
      });
    },
    enabled:
      paymentEnabled &&
      onsiteSelectorOpen &&
      (onsiteContext === "invoice" || onsiteContext === "history"),
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

  const handleInvoiceSelectAll = useCallback(async () => {
    if (invoiceSelectAllLoading) return;
    if (!invoiceTotalElements) return;

    if (isAllInvoicesSelected) {
      setSelectedInvoiceIds([]);
      return;
    }

    const collected = new Set<number>(selectedInvoiceIds);
    invoiceRows.forEach((row) => collected.add(row.id));

    if (invoiceTotalPages <= 1) {
      setSelectedInvoiceIds(Array.from(collected));
      return;
    }

    setInvoiceSelectAllLoading(true);
    try {
      for (let pageIndex = 0; pageIndex < invoiceTotalPages; pageIndex += 1) {
        if (pageIndex === invoicePage) continue;
        const pageResult = await listPaymentInvoices({
          ...invoiceListFilters,
          status: invoiceStatusParam,
          page: pageIndex,
          size: invoicePageSize,
        });
        pageResult.content.forEach((row) => collected.add(row.id));
      }
      setSelectedInvoiceIds(Array.from(collected));
    } catch (err) {
      toastError(readableError(err, "전체 선택을 완료하지 못했습니다."));
    } finally {
      setInvoiceSelectAllLoading(false);
    }
  }, [
    invoiceSelectAllLoading,
    invoiceTotalElements,
    isAllInvoicesSelected,
    selectedInvoiceIds,
    invoiceRows,
    invoiceTotalPages,
    invoicePage,
    invoiceListFilters,
    invoicePageSize,
    toastError,
  ]);

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
    navigate(
      paths.payments.kakaoConfirm({ ids: String(row.id), template: "PAYMENT_RETRY" }),
    );
  };

  const closeResendPrompt = () => {
    setResendPrompt({ open: false, row: null, reason: null, loading: false });
  };

  const handleConfirmResend = () => {
    if (!resendPrompt.row) {
      closeResendPrompt();
      return;
    }
    navigate(
      paths.payments.kakaoConfirm({
        ids: String(resendPrompt.row.id),
        template: "PAYMENT_RETRY",
      }),
    );
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
    setInvoiceDateRange(createMonthRange());
    setInvoicePage(0);
  };

  const handleApplyHistoryFilters = () => {
    setHistoryCompletedPage(0);
    setHistoryPendingPage(0);
    setOnsitePage(0);
  };

  const handleResetHistoryFilters = () => {
    setHistoryFilters({
      ...createDefaultHistoryFilters(),
    });
    setOnsitePage(0);
  };

  const handleSaveInvoice = async (form: PaymentInvoiceUpdatePayload) => {
    if (!detailState.open) return;
    const normalizeDate = (value?: string) => (value && value.trim() ? value : undefined);
    const payload: PaymentInvoiceUpdatePayload = {
      ...form,
      dueDate: normalizeDate(form.dueDate),
      periodStart: normalizeDate(form.periodStart),
      periodEnd: normalizeDate(form.periodEnd),
    };
    updateMutation.mutate({ id: detailState.id, payload });
  };

  const [activeSection, setActiveSection] = useState<"invoice" | "pending" | "history" | "templates">("invoice");

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

  const sectionTitle =
    activeSection === "invoice"
      ? "미발송"
      : activeSection === "pending"
        ? "미납 내역"
        : activeSection === "history"
          ? "결제 내역"
          : "청구서 템플릿";
  const sectionDescription =
    activeSection === "invoice"
      ? "미발송(대기) 청구서를 선택해 한 번에 발송하거나 검색해 관리하세요."
      : activeSection === "pending"
        ? "발송된 청구서 중 결제가 완료되지 않은 내역입니다."
        : activeSection === "history"
          ? "완료·취소된 결제 내역을 확인하세요."
          : "저장된 템플릿을 확인하고 자동 생성 여부를 관리하세요.";

  const templateRows = useMemo(() => {
    const rows: PaymentTemplateSetup[] = templatesQuery.data ?? [];
    const keyword = templateSearch.trim().toLowerCase();
    const base = keyword
      ? rows.filter((row: PaymentTemplateSetup) => {
          const student = studentById.get(row.studentId);
          const studentName = (student?.name ?? "").toLowerCase();
          const courseTitle =
            row.courseTitleSnapshot?.toLowerCase() ??
            row.courseCodeSnapshot?.toLowerCase() ??
            "";
          return studentName.includes(keyword) || courseTitle.includes(keyword);
        })
      : rows;
    return [...base].sort((a: PaymentTemplateSetup, b: PaymentTemplateSetup) =>
      (a.nextDueDate || "").localeCompare(b.nextDueDate || ""),
    );
  }, [templatesQuery.data, templateSearch, studentById]);

  const templatesCount = templatesQuery.data?.length ?? 0;
  const templateTotalPages = Math.max(1, Math.ceil(templateRows.length / templatePageSize));
  const showTemplatePager = templateTotalPages > 1;
  useEffect(() => {
    setTemplatePage(0);
  }, [templateSearch]);
  useEffect(() => {
    if (templatePage > templateTotalPages - 1) {
      setTemplatePage(Math.max(0, templateTotalPages - 1));
    }
  }, [templatePage, templateTotalPages]);
  const pagedTemplateRows = useMemo(() => {
    const start = templatePage * templatePageSize;
    return templateRows.slice(start, start + templatePageSize);
  }, [templateRows, templatePage, templatePageSize]);

  const [pgFeeGuideOpen, setPgFeeGuideOpen] = useState(false);

  if (!paymentEnabled) {
    return (
      <Page>
        <PageHeader>
          <div>
            <h2>결제 관리</h2>
            <p>현재 요금제로 이용할 수 없습니다.</p>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <GhostButton type="button" onClick={() => setPgFeeGuideOpen(true)}>
              PG 수수료 안내
            </GhostButton>
          </div>
        </PageHeader>
        <SectionCard>
          <EmptyState>
            <div>결제 관리 기능은 결제 기능이 포함된 요금제에서 이용할 수 있습니다.</div>
            <PrimaryButton type="button" onClick={() => navigate(routes.myAcademyPlan)}>
              요금제 변경하기
            </PrimaryButton>
          </EmptyState>
        </SectionCard>
        <PgFeeGuideModal open={pgFeeGuideOpen} onClose={() => setPgFeeGuideOpen(false)} />
      </Page>
    );
  }

  return (
    <Page>
      <PageHeader>
        <div>
          <h2>결제 관리</h2>
          <p>학원의 결제 업무를 한눈에 관리하세요.</p>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <GhostButton type="button" onClick={() => setPgFeeGuideOpen(true)}>
            PG 수수료 안내
          </GhostButton>
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

      <TabRow>
        <ToggleGroup role="tablist" aria-label="결제 관리">
          <ToggleButton
            type="button"
            $active={activeSection === "invoice"}
            aria-pressed={activeSection === "invoice"}
            onClick={() => setActiveSection("invoice")}
          >
            미발송
          </ToggleButton>
          <ToggleButton
            type="button"
            $active={activeSection === "pending"}
            aria-pressed={activeSection === "pending"}
            onClick={() => setActiveSection("pending")}
          >
            미납 내역
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
          <TemplateControlButton
            type="button"
            data-active={activeSection === "templates"}
            onClick={() => setActiveSection("templates")}
          >
            템플릿 관리
            {templatesCount > 0 ? <span className="count">{templatesCount}</span> : null}
          </TemplateControlButton>
          <Divider aria-hidden />
          <PrimaryButton type="button" onClick={() => navigate(routes.paymentsCreate)}>
            청구서 생성
          </PrimaryButton>
        </PanelControls>
      </TabRow>

      <Panels>
        <SectionCard>
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
                  disabled={!invoiceRows.length || invoiceSelectAllLoading}
                >
                  {invoiceSelectAllLoading
                    ? "선택 중..."
                    : isAllInvoicesSelected
                      ? "전체 해제"
                      : "전체 선택"}
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
            ) : activeSection === "templates" ? (
              <SectionActions>
                <GhostButton
                  type="button"
                  onClick={() => templatesQuery.refetch()}
                  disabled={templatesQuery.isFetching}
                >
                  새로고침
                </GhostButton>
              </SectionActions>
            ) : (
              <SectionActions />
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
          ) : activeSection === "templates" ? (
            <>
              <HistoryFilters>
                <FilterFieldWide>
                  <span>검색</span>
                  <Input
                    type="text"
                    value={templateSearchInput}
                    placeholder="학생명/수업명 검색"
                    onChange={(event) => setTemplateSearchInput(event.target.value)}
                  />
                </FilterFieldWide>
                <FilterActions>
                  <PrimaryButton type="button" onClick={() => setTemplateSearch(templateSearchInput)}>
                    검색
                  </PrimaryButton>
                  <GhostButton
                    type="button"
                    onClick={() => {
                      setTemplateSearch("");
                      setTemplateSearchInput("");
                      setTemplatePage(0);
                    }}
                  >
                    초기화
                  </GhostButton>
                </FilterActions>
              </HistoryFilters>

              <TemplateTableWrapper>
              <TemplatesTable>
                <colgroup>
                  <col style={{ width: "6%" }} />
                  <col style={{ width: "18%" }} />
                  <col style={{ width: "26%" }} />
                  <col style={{ width: "14%" }} />
                  <col style={{ width: "16%" }} />
                  <col style={{ width: "10%" }} />
                  <col style={{ width: "10%" }} />
                </colgroup>
                <thead>
                  <tr>
                    <th className="text-center">번호</th>
                    <th>학생</th>
                    <th>수업</th>
                    <th className="text-right">금액</th>
                    <th className="text-center">결제일</th>
                    <th className="text-center">주기</th>
                    <th className="text-center">자동</th>
                  </tr>
                </thead>
                <tbody>
                  {templatesQuery.isLoading || studentsQuery.isLoading ? (
                    <tr>
                      <td colSpan={7}>
                        <Skeleton h={36} />
                      </td>
                    </tr>
                  ) : templateRows.length === 0 ? (
                    <tr>
                      <td colSpan={7}>
                        <EmptyState>저장된 템플릿이 없습니다.</EmptyState>
                      </td>
                    </tr>
                  ) : (
                    pagedTemplateRows.map((row, index) => {
                      const student = studentById.get(row.studentId);
                      const studentName = student?.name ?? `#${row.studentId}`;
                      const recipient = formatPhoneKR(student?.guardianPhone ?? student?.phoneNumber ?? "") || "-";
                      const courseTitle = row.courseTitleSnapshot?.trim() || "-";
                      const cycleLabel =
                        row.cycleUnit === "DAYS"
                          ? `${row.cycleValue}일`
                          : row.cycleUnit === "WEEKS"
                            ? `${row.cycleValue}주`
                            : `${row.cycleValue}개월`;
                      const dueDateLabel = row.nextDueDate
                        ? formatKoreanDate(row.nextDueDate, { includeWeekday: false })
                        : "-";
                      return (
                        <tr
                          key={row.templateId}
                          onClick={() => navigate(paths.students.detail(row.studentId))}
                          style={{ cursor: "pointer" }}
                        >
                          <td className="text-center">{templatePage * templatePageSize + index + 1}</td>
                          <td>
                            <strong>{studentName}</strong>
                            <TemplateMetaText>{recipient}</TemplateMetaText>
                          </td>
                          <td>
                            <strong>{courseTitle}</strong>
                          </td>
                          <td className="text-right amount-cell">{formatMoney(row.finalAmount ?? 0)}</td>
                          <td className="text-center">{dueDateLabel}</td>
                          <td className="text-center">{cycleLabel}</td>
                          <td className="text-center" onClick={(e) => e.stopPropagation()}>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <ToggleSwitch>
                              <input
                                type="checkbox"
                                checked={Boolean(row.autoGenerate)}
                                disabled={templateToggleMutation.isPending}
                                onChange={(e) =>
                                  templateToggleMutation.mutate({
                                    templateId: row.templateId,
                                    autoGenerate: e.target.checked,
                                  })
                                }
                              />
                              <span className="switch" />
                            </ToggleSwitch>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </TemplatesTable>
              {showTemplatePager ? (
                <Pagination page={templatePage} totalPages={templateTotalPages} onChangePage={setTemplatePage} />
              ) : null}
              </TemplateTableWrapper>
            </>
          ) : activeSection === "pending" ? (
            <>
              <HistoryFilters>
                <PeriodFilter>
                  <span>결제일</span>
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
                <FilterActions>
                  <PrimaryButton type="button" onClick={handleApplyHistoryFilters}>
                    검색
                  </PrimaryButton>
                  <GhostButton type="button" onClick={handleResetHistoryFilters}>
                    초기화
                  </GhostButton>
                </FilterActions>
              </HistoryFilters>
              <HistoryTable
                rows={pendingRows}
                loading={pendingHistoryQuery.isLoading}
                page={historyPendingPage}
                size={historyPageSize}
                totalPages={pendingTotalPages}
                onChangePage={setHistoryPendingPage}
                onRowClick={handleHistoryRowClick}
                activeId={activeHistoryId}
                variant="pending"
                onResendClick={handleHistoryResend}
                emptyMessage={pendingEmptyMessage}
              />
            </>
          ) : (
            <>
              <HistoryFilters>
                <PeriodFilter>
                  <span>결제일</span>
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
                <FilterActions>
                  <PrimaryButton type="button" onClick={handleApplyHistoryFilters}>
                    검색
                  </PrimaryButton>
                  <GhostButton type="button" onClick={handleResetHistoryFilters}>
                    초기화
                  </GhostButton>
                </FilterActions>
              </HistoryFilters>
              <HistoryTable
                rows={completedRows}
                loading={completedHistoryQuery.isLoading}
                page={historyCompletedPage}
                size={historyPageSize}
                totalPages={completedTotalPages}
                onChangePage={setHistoryCompletedPage}
                onRowClick={handleHistoryRowClick}
                activeId={activeHistoryId}
                variant="completed"
                emptyMessage={completedPlaceholderMessage}
              />
            </>
          )}
        </SectionCard>
      </Panels>

      <PgFeeGuideModal open={pgFeeGuideOpen} onClose={() => setPgFeeGuideOpen(false)} />

      <DetailModal
        state={detailState}
        onClose={() => setDetailState({ open: false })}
        onSave={handleSaveInvoice}
        saving={updateMutation.isPending}
        onDeleteInvoice={(detail) => {
          if (!detail?.info?.id) return;
          setDeletePrompt({ open: true, id: detail.info.id });
        }}
        deleting={deleteInvoiceMutation.isPending}
        onCancelPayment={handleCancelPayment}
        canceling={cancelMutation.isPending}
        onCancelSchedule={handleCancelSchedule}
        onSendScheduleNow={handleSendScheduleNow}
        scheduleCancelling={cancelScheduleMutation.isPending}
        scheduleSending={sendScheduleNowMutation.isPending}
      />
      <ConfirmModal
        open={deletePrompt.open}
        title="청구서 삭제"
        description="미발송(대기) 청구서를 삭제할까요? 삭제 후 복구할 수 없습니다."
        confirmText="삭제"
        loading={deleteInvoiceMutation.isPending}
        onClose={() => {
          if (deleteInvoiceMutation.isPending) return;
          setDeletePrompt({ open: false, id: null });
        }}
        onConfirm={() => {
          if (deleteInvoiceMutation.isPending) return;
          if (!deletePrompt.id) return;
          deleteInvoiceMutation.mutate(deletePrompt.id);
        }}
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

type SummaryStat = {
  label: string;
  value: string;
  hint?: string;
  icon: ReactNode;
  tone: "primary" | "success" | "warning" | "danger" | "muted";
};

function extractSummary(summary?: PaymentSummary | null, unsentOverride?: number): SummaryStat[] {
  if (!summary) {
    return [
      { label: "이번달 총 결제액", value: "—", icon: paidIcon, tone: "primary" },
      { label: "이번달 대기 금액", value: "—", icon: unpaidIcon, tone: "primary" },
      { label: "이번달 미납 금액", value: "—", icon: overdueIcon, tone: "primary" },
      { label: "청구서 대기 인원", value: "—", icon: peopleIcon, tone: "primary" },
      { label: "미납 인원", value: "—", icon: warningIcon, tone: "primary" },
    ];
  }
  const unsent = typeof unsentOverride === "number" ? unsentOverride : summary.unsentCount;
  const overdueAmount = summary.overdueAmount ?? 0;
  const overdueCount = summary.overdueCount ?? 0;
  return [
    {
      label: "이번달 총 결제액",
      value: formatMoney(summary.paidAmount),
      icon: paidIcon,
      tone: "primary",
    },
    {
      label: "이번달 대기 금액",
      value: formatMoney(summary.unpaidAmount),
      icon: unpaidIcon,
      tone: "primary",
      hint: `${summary.unpaidCount}명`,
    },
    {
      label: "이번달 미납 금액",
      value: formatMoney(overdueAmount),
      icon: overdueIcon,
      tone: "primary",
      hint: `${overdueCount}명`,
    },
    {
      label: "청구서 대기 인원",
      value: `${unsent}명`,
      icon: peopleIcon,
      tone: "primary",
    },
    {
      label: "미납 인원",
      value: `${overdueCount}명`,
      icon: warningIcon,
      tone: "primary",
    },
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

const overdueIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    <path d="M12 7v5l3 3" />
  </svg>
);

const warningIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
    <path d="m10.29 3.86-8 14A1 1 0 0 0 3.15 19h17.7a1 1 0 0 0 .86-1.5l-8-14a1 1 0 0 0-1.72 0Z" />
  </svg>
);

const TabRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  flex-wrap: wrap;
  gap: 16px;
`;

const TemplateTableWrapper = styled.div`
  overflow-x: auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 10px;
`;

const TemplateMetaText = styled.span`
  display: block;
  font-size: 12px;
  color: ${(p) => p.theme.colors.textMuted};
`;

const TemplatesTable = styled(TableBase)`
  table-layout: fixed;
  width: 100%;

  th,
  td {
    vertical-align: middle;
    padding: 14px 20px;
    text-align: center;
  }

  thead th {
    font-weight: 700;
    color: ${(p) => p.theme.colors.textMuted};
    background: ${(p) => p.theme.colors.surfaceAlt ?? "#f9fafb"};
    font-size: 13px;
    text-align: center;
  }

  tbody tr {
    transition: background 0.15s ease;
  }

  tbody tr:hover td {
    background: ${(p) => p.theme.colors.surfaceAlt ?? "#f9fafb"};
  }

  .amount-cell {
    font-weight: 700;
    font-feature-settings: 'tnum';
  }
`;

const Panels = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
  gap: 24px;
`;

const PanelControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
`;

const Divider = styled.div`
  width: 1px;
  height: 24px;
  background: ${(p) => p.theme.colors.borderMuted};
`;

const TemplateControlButton = styled.button`
  height: 40px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.surface};
  color: ${(p) => p.theme.colors.text};
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  .count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 20px;
    padding: 0 6px;
    border-radius: 999px;
    background: ${(p) => p.theme.colors.borderMuted};
    color: ${(p) => p.theme.colors.textMuted};
    font-size: 12px;
    font-weight: 700;
  }

  &[data-active="true"] {
    border-color: ${(p) => p.theme.colors.primary};
    background: ${(p) => p.theme.colors.primarySurface};
    color: ${(p) => p.theme.colors.primary};
    .count {
      background: ${(p) => p.theme.colors.primary}1A;
      color: ${(p) => p.theme.colors.primary};
    }
  }

  &:hover {
    border-color: ${(p) => p.theme.colors.primary};
    color: ${(p) => p.theme.colors.primary};
  }
`;

const ToggleGroup = styled.div`
  display: inline-flex;
  gap: 8px;
`;

const ToggleButton = styled.button<{ $active?: boolean }>`
  height: 40px;
  padding: 0 20px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 10px;
  transition: all 0.2s ease;
  cursor: pointer;

  /* Active State */
  background: ${({ $active, theme }) => ($active ? theme.colors.primary : "#ffffff")};
  color: ${({ $active }) => ($active ? "#ffffff" : "inherit")};
  border: 1px solid ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.border)};
  box-shadow: ${({ $active }) => ($active ? "0 1px 2px rgba(0, 0, 0, 0.05)" : "none")};

  ${({ $active, theme }) =>
    !$active &&
    `
    color: ${theme.colors.text};
    &:hover {
      background: ${theme.colors.surfaceMuted};
      border-color: ${theme.colors.borderMuted};
    }
  `}
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

const FilterActions = styled.div`
  display: flex;
  gap: 8px;
  margin-left: auto;
  align-items: flex-end;
  flex-wrap: wrap;
`;
