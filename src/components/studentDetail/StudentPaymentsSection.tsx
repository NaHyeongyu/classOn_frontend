import { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import { SectionCard } from "@/components/common/UI";
import ConfirmModal from "@/components/common/ConfirmModal";
import { useToast } from "@/components/common/Toast";
import { DetailModal } from "@/features/payments/components/PaymentsModals";
import { HistoryTable as PaymentsHistoryTable, InvoicesTable } from "@/features/payments/components/PaymentsTables";
import type { DetailState } from "@/features/payments/types";
import {
  cancelPayment,
  cancelScheduledAlert,
  deletePaymentInvoice,
  getPaymentDetail,
  listPaymentHistory,
  listPaymentInvoices,
  listPendingHistory,
  sendScheduledAlertNow,
  updatePaymentInvoice,
  type PaymentInvoiceUpdatePayload,
} from "@/api/payments";
import { invalidatePaymentsQueries } from "@/lib/paymentsCache";
import { readableError } from "@/lib/errors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { PaymentDetail, PaymentHistoryRow } from "@classon/shared-types";
import { useNavigate } from "react-router-dom";
import { paths } from "@/routes";
import type { PageResult } from "@/types/paging";

type Props = {
  studentId: number | null;
  enabled?: boolean;
  error: string | null;
};

const invoiceStatusParam = "UNPAID,SCHEDULED";
const pendingStatusParam = "PENDING,FAILED,UNPAID";
const completedStatusParam = "COMPLETED,CANCELED";

export function StudentPaymentsSection({ studentId, enabled = true, error }: Props) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { success, error: toastError } = useToast();

  const [invoicePage, setInvoicePage] = useState(0);
  const invoicePageSize = 10;
  const [pendingPage, setPendingPage] = useState(0);
  const [completedPage, setCompletedPage] = useState(0);
  const historyPageSize = 10;

  const [detailState, setDetailState] = useState<DetailState>({ open: false });
  const activeId = detailState.open ? detailState.id : null;

  const loadDetail = useCallback(
    async (id: number, variant: "invoice" | "history") => {
      setDetailState({ open: true, id, variant, loading: true, data: null });
      try {
        const detail = await getPaymentDetail(id);
        setDetailState({ open: true, id, variant, loading: false, data: detail });
      } catch (e) {
        setDetailState({ open: false });
        toastError(readableError(e, "결제 상세를 불러오지 못했습니다."));
      }
    },
    [toastError],
  );

  const invoiceQuery = useQuery<PageResult<PaymentHistoryRow>>({
    queryKey: ["payments", "invoices", "student", studentId, invoiceStatusParam, invoicePage, invoicePageSize],
    enabled: enabled && typeof studentId === "number",
    queryFn: () =>
      listPaymentInvoices({
        status: invoiceStatusParam,
        studentId: studentId as number,
        page: invoicePage,
        size: invoicePageSize,
      }),
    placeholderData: (previousData: PageResult<PaymentHistoryRow> | undefined) => previousData,
  });

  const pendingQuery = useQuery<PageResult<PaymentHistoryRow>>({
    queryKey: ["payments", "history", "pending", "student", studentId, pendingStatusParam, pendingPage, historyPageSize],
    enabled: enabled && typeof studentId === "number",
    queryFn: () =>
      listPendingHistory({
        status: pendingStatusParam,
        studentId: studentId as number,
        page: pendingPage,
        size: historyPageSize,
      }),
    placeholderData: (previousData: PageResult<PaymentHistoryRow> | undefined) => previousData,
  });

  const completedQuery = useQuery<PageResult<PaymentHistoryRow>>({
    queryKey: [
      "payments",
      "history",
      "completed",
      "student",
      studentId,
      completedStatusParam,
      completedPage,
      historyPageSize,
    ],
    enabled: enabled && typeof studentId === "number",
    queryFn: () =>
      listPaymentHistory({
        status: completedStatusParam,
        studentId: studentId as number,
        page: completedPage,
        size: historyPageSize,
      }),
    placeholderData: (previousData: PageResult<PaymentHistoryRow> | undefined) => previousData,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: PaymentInvoiceUpdatePayload }) => updatePaymentInvoice(id, payload),
    onSuccess: () => {
      success("결제 정보를 업데이트했습니다.");
      invalidatePaymentsQueries(queryClient);
      setDetailState({ open: false });
    },
    onError: (e: unknown) => toastError(readableError(e, "결제 수정에 실패했습니다.")),
  });

  const deleteInvoiceMutation = useMutation({
    mutationFn: (id: number) => deletePaymentInvoice(id),
    onSuccess: () => {
      success("청구서를 삭제했습니다.");
      invalidatePaymentsQueries(queryClient);
      setDeletePrompt({ open: false, id: null });
      setDetailState({ open: false });
    },
    onError: (e: unknown) => toastError(readableError(e, "청구서 삭제에 실패했습니다.")),
  });

  const cancelMutation = useMutation({
    mutationFn: (id: number) => cancelPayment(id),
    onSuccess: (detail: PaymentDetail) => {
      success("결제를 취소했습니다.");
      invalidatePaymentsQueries(queryClient);
      setCancelPrompt({ open: false, id: null });
      setDetailState((prev) => (prev.open && prev.id === detail.info.id ? { ...prev, data: detail, loading: false } : prev));
    },
    onError: (e: unknown) => toastError(readableError(e, "결제 취소에 실패했습니다.")),
  });

  const cancelScheduleMutation = useMutation({
    mutationFn: ({ paymentId, alertId }: { paymentId: number; alertId: number }) => cancelScheduledAlert(paymentId, alertId),
    onSuccess: (detail: PaymentDetail) => {
      success("예약 발송을 취소했습니다.");
      invalidatePaymentsQueries(queryClient);
      setDetailState((prev) => (prev.open && prev.id === detail.info.id ? { ...prev, data: detail, loading: false } : prev));
    },
    onError: (e: unknown) => toastError(readableError(e, "예약 취소에 실패했습니다.")),
  });

  const sendScheduleNowMutation = useMutation({
    mutationFn: ({ paymentId, alertId }: { paymentId: number; alertId: number }) => sendScheduledAlertNow(paymentId, alertId),
    onSuccess: (detail: PaymentDetail) => {
      success("즉시 발송으로 전환했습니다.");
      invalidatePaymentsQueries(queryClient);
      setDetailState((prev) => (prev.open && prev.id === detail.info.id ? { ...prev, data: detail, loading: false } : prev));
    },
    onError: (e: unknown) => toastError(readableError(e, "즉시 발송 전환에 실패했습니다.")),
  });

  const handleSave = useCallback(
    (payload: PaymentInvoiceUpdatePayload) => {
      if (!detailState.open) return;
      updateMutation.mutate({ id: detailState.id, payload });
    },
    [detailState, updateMutation],
  );

  const [resendPrompt, setResendPrompt] = useState<{
    open: boolean;
    row: PaymentHistoryRow | null;
    reason: string | null;
    loading: boolean;
  }>({ open: false, row: null, reason: null, loading: false });

  const [deletePrompt, setDeletePrompt] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });
  const [cancelPrompt, setCancelPrompt] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });

  const canShowList = Boolean(studentId);
  const invoiceRows = invoiceQuery.data?.content ?? [];
  const invoiceTotalPages = invoiceQuery.data?.totalPages ?? 1;
  const pendingRows = pendingQuery.data?.content ?? [];
  const pendingTotalPages = pendingQuery.data?.totalPages ?? 1;
  const completedRows = completedQuery.data?.content ?? [];
  const completedTotalPages = completedQuery.data?.totalPages ?? 1;
  const listError = useMemo(() => {
    const firstError = invoiceQuery.error ?? pendingQuery.error ?? completedQuery.error;
    return firstError ? readableError(firstError, "결제 내역을 불러오지 못했습니다.") : null;
  }, [completedQuery.error, invoiceQuery.error, pendingQuery.error]);

  if (!canShowList) return null;
  if (!enabled) {
    return (
      <Root>
        {error ? <ErrorText>{error}</ErrorText> : null}
      </Root>
    );
  }

  return (
    <Root>
      {error ? <ErrorText>{error}</ErrorText> : null}
      {listError ? <ErrorText>{listError}</ErrorText> : null}

      <SectionCard>
        <SectionTitle>발송 대기 청구서</SectionTitle>
        <InvoicesTable
          rows={invoiceRows}
          loading={invoiceQuery.isFetching}
          page={invoicePage}
          size={invoicePageSize}
          totalPages={invoiceTotalPages}
          showPager={invoiceTotalPages > 1}
          onChangePage={setInvoicePage}
          onRowClick={(row) => loadDetail(row.id, "invoice")}
          selectable={false}
        />
      </SectionCard>

      <SectionCard>
        <SectionTitle>미납/실패 내역</SectionTitle>
        <PaymentsHistoryTable
          rows={pendingRows}
          loading={pendingQuery.isFetching}
          page={pendingPage}
          size={historyPageSize}
          totalPages={pendingTotalPages}
          onChangePage={setPendingPage}
          onRowClick={(row) => loadDetail(row.id, "history")}
          activeId={activeId}
          variant="pending"
          emptyMessage="미납 내역이 없습니다."
          onResendClick={(row) => {
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
            navigate(paths.payments.kakaoConfirm({ ids: String(row.id), template: "PAYMENT_RETRY" }));
          }}
        />
      </SectionCard>

      <SectionCard>
        <SectionTitle>완료/취소 내역</SectionTitle>
        <PaymentsHistoryTable
          rows={completedRows}
          loading={completedQuery.isFetching}
          page={completedPage}
          size={historyPageSize}
          totalPages={completedTotalPages}
          onChangePage={setCompletedPage}
          onRowClick={(row) => loadDetail(row.id, "history")}
          activeId={activeId}
          variant="completed"
          emptyMessage="결제 내역이 없습니다."
        />
      </SectionCard>

      <DetailModal
        state={detailState}
        onClose={() => {
          if (updateMutation.isPending) return;
          setDetailState({ open: false });
        }}
        onSave={handleSave}
        saving={updateMutation.isPending}
        onDeleteInvoice={(detail) => {
          if (!detail?.info?.id) return;
          setDeletePrompt({ open: true, id: detail.info.id });
        }}
        deleting={deleteInvoiceMutation.isPending}
        onCancelPayment={(detail) => {
          if (!detail?.info?.id) return;
          setCancelPrompt({ open: true, id: detail.info.id });
        }}
        canceling={cancelMutation.isPending}
        onCancelSchedule={(detail, alertId) => {
          if (!detail?.info?.id || !alertId) return;
          cancelScheduleMutation.mutate({ paymentId: detail.info.id, alertId });
        }}
        onSendScheduleNow={(detail, alertId) => {
          if (!detail?.info?.id || !alertId) return;
          sendScheduleNowMutation.mutate({ paymentId: detail.info.id, alertId });
        }}
        scheduleCancelling={cancelScheduleMutation.isPending}
        scheduleSending={sendScheduleNowMutation.isPending}
      />

      <ConfirmModal
        open={resendPrompt.open}
        title="청구서 재발송"
        description={resendPrompt.loading ? "실패 사유를 불러오는 중..." : resendPrompt.reason || "재발송할까요?"}
        confirmText="재발송"
        loading={resendPrompt.loading}
        onClose={() => {
          if (resendPrompt.loading) return;
          setResendPrompt({ open: false, row: null, reason: null, loading: false });
        }}
        onConfirm={() => {
          if (resendPrompt.loading) return;
          if (!resendPrompt.row) {
            setResendPrompt({ open: false, row: null, reason: null, loading: false });
            return;
          }
          navigate(paths.payments.kakaoConfirm({ ids: String(resendPrompt.row.id), template: "PAYMENT_RETRY" }));
          setResendPrompt({ open: false, row: null, reason: null, loading: false });
        }}
      />

      <ConfirmModal
        open={deletePrompt.open}
        title="청구서 삭제"
        description="선택한 청구서를 삭제할까요? 삭제 후 복구할 수 없습니다."
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

      <ConfirmModal
        open={cancelPrompt.open}
        title="결제 취소"
        description="선택한 결제를 취소할까요? 취소 후 되돌릴 수 없습니다."
        confirmText="취소"
        loading={cancelMutation.isPending}
        onClose={() => {
          if (cancelMutation.isPending) return;
          setCancelPrompt({ open: false, id: null });
        }}
        onConfirm={() => {
          if (cancelMutation.isPending) return;
          if (!cancelPrompt.id) return;
          cancelMutation.mutate(cancelPrompt.id);
        }}
      />
    </Root>
  );
}

const Root = styled.div`
  display: grid;
  gap: 12px;
`;

const SectionTitle = styled.div`
  font-weight: ${(p) => p.theme.font.weight.semiBold};
  margin-bottom: 10px;
`;

const ErrorText = styled.div`
  color: ${(p) => p.theme.colors.danger};
  font-size: ${(p) => p.theme.font.size.sm};
`;
