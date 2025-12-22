import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import styled from "styled-components";
import Modal from "@/components/common/Modal";
import {
  EmptyState,
  GhostButton,
  PrimaryButton,
  SectionCard,
  Skeleton,
  TableBase,
  ToggleSwitch,
} from "@/components/common/UI";
import type {
  DiscountType,
  PaymentCourseBrief,
  PaymentDetail,
  PaymentHistoryRow,
  PaymentMethod,
} from "@classon/shared-types";
import type { PaymentAdditionalItemPayload, PaymentInvoiceUpdatePayload, PaymentOnsitePayload } from "@/api/payments";
import { formatKoreanDate, formatKoreanDateTimeKST, formatMoney } from "@/lib/format";
import { PAYMENT_STATUS_COLOR, PAYMENT_STATUS_LABEL, formatPhoneKR } from "@/lib/paymentUiLabels";
import type { DetailState } from "@/features/payments/types";
import {
  buildCourseDisplay,
  combineMemoValues,
  getCycleLabel,
  getPaymentMethodDisplay,
  parseNumericInput,
  toLocalDateInputValue,
} from "@/features/payments/utils/paymentsUtils";

type AdditionalFieldState = {
  enabled: boolean;
  materialFee?: number;
  textbookFee?: number;
  startDate?: string;
  endDate?: string;
};

function calculateDiscountAmount(
  subtotal: number,
  type: DiscountType | undefined,
  value: number,
): number {
  if (subtotal <= 0) return 0;
  const safeValue = Number.isFinite(value) ? value : 0;
  if (type === "AMOUNT") {
    const amount = Math.round(safeValue);
    if (amount <= 0) return 0;
    return Math.min(subtotal, amount);
  }
  const percent = Math.min(100, Math.max(0, safeValue));
  return Math.round((subtotal * percent) / 100);
}

function computePeriodEnd(
  periodStart: string,
  cycleValue: number | null | undefined,
  cycleUnit: PaymentDetail["schedule"]["cycleUnit"] | null | undefined,
) {
  if (!periodStart) return "";
  if (!cycleValue || cycleValue <= 0) return "";
  const base = new Date(`${periodStart}T00:00:00`);
  if (Number.isNaN(base.getTime())) return "";
  const next = new Date(base);
  if (cycleUnit === "DAYS") {
    next.setDate(next.getDate() + cycleValue);
  } else if (cycleUnit === "WEEKS") {
    next.setDate(next.getDate() + cycleValue * 7);
  } else {
    next.setMonth(next.getMonth() + cycleValue);
  }
  return toLocalDateInputValue(next);
}

export type DetailModalProps = {
  state: DetailState;
  onClose: () => void;
  onSave: (payload: PaymentInvoiceUpdatePayload) => void;
  saving: boolean;
  onDeleteInvoice?: (detail: PaymentDetail) => void;
  deleting?: boolean;
  onCancelPayment?: (detail: PaymentDetail) => void;
  canceling?: boolean;
  onCancelSchedule?: (detail: PaymentDetail, alertId: number) => void;
  onSendScheduleNow?: (detail: PaymentDetail, alertId: number) => void;
  scheduleCancelling?: boolean;
  scheduleSending?: boolean;
  onOnsitePayment?: (detail: PaymentDetail) => void;
  onsiteSubmitting?: boolean;
  onResendPayment?: (detail: PaymentDetail) => void;
  resendSubmitting?: boolean;
};

export function DetailModal({
  state,
  onClose,
  onSave,
  saving,
  onDeleteInvoice,
  deleting,
  onCancelPayment,
  canceling,
  onCancelSchedule,
  onSendScheduleNow,
  scheduleCancelling,
  scheduleSending,
  onOnsitePayment,
  onsiteSubmitting,
  onResendPayment,
  resendSubmitting,
}: DetailModalProps) {
  const isOpen = state.open;
  const detail = state.open ? state.data : null;
  const variant = state.open ? state.variant : "invoice";
  const effectiveIsInvoiceVariant =
    variant === "invoice" ||
    (variant === "history" &&
      detail?.info.status === "UNPAID" &&
      !detail?.info.invoiceRequestedAt);
  const [form, setForm] = useState<PaymentInvoiceUpdatePayload>({
    dueDate: "",
    recipientPhone: "",
    memo: "",
    managerMemo: "",
    discountType: "PERCENT",
    discountValue: 0,
  });
  const [isEditing, setIsEditing] = useState(false);
  const saveInFlight = useRef(false);
  const [discountEnabled, setDiscountEnabled] = useState(false);
  const [additionalFields, setAdditionalFields] = useState<AdditionalFieldState>({
    enabled: false,
    materialFee: undefined,
    textbookFee: undefined,
    startDate: "",
    endDate: "",
  });
  const additionalTotalAmount =
    (additionalFields.materialFee ?? 0) + (additionalFields.textbookFee ?? 0);

  useEffect(() => {
    if (!detail) return;
    const dueDate = detail.info.dueDate ?? "";
    const resolvedRecipient = detail.info.recipientPhone ?? detail.student.recipientPhone ?? "";
    const memoText = combineMemoValues(detail.info.memo, detail.info.managerMemo) || "";
    const initialDiscountType: DiscountType = detail.info.discountType ?? "PERCENT";
    const initialDiscountValue =
      typeof detail.info.discountValue === "number" ? detail.info.discountValue : 0;
    const initialDiscountEnabled = Boolean(detail.info.discountType) && detail.info.discountValue != null;
    setDiscountEnabled(initialDiscountEnabled);
    setForm({
      dueDate,
      recipientPhone: resolvedRecipient,
      memo: memoText,
      managerMemo: memoText,
      discountType: initialDiscountType,
      discountValue: initialDiscountValue,
    });
    const materialItem = detail.additionalItems?.find((item) => item?.type === "MATERIAL");
    const textbookItem = detail.additionalItems?.find((item) => item?.type === "TEXTBOOK");
    const materialFeeValue =
      typeof materialItem?.unitPrice === "number" ? materialItem.unitPrice : undefined;
    const textbookFeeValue =
      typeof textbookItem?.unitPrice === "number" ? textbookItem.unitPrice : undefined;
    const enabled = Boolean(
      (materialFeeValue && materialFeeValue > 0) || (textbookFeeValue && textbookFeeValue > 0),
    );
    const mappedFields: AdditionalFieldState = {
      enabled,
      materialFee: materialFeeValue,
      textbookFee: textbookFeeValue,
      startDate: dueDate,
      endDate: dueDate,
    };
    setAdditionalFields(mappedFields);
  }, [detail]);

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

  const isInvoiceVariant = effectiveIsInvoiceVariant;
  const pendingScheduleAlert =
    detail?.alerts?.find((alert) => alert.status === "PENDING") ?? undefined;
  const isScheduledPayment = Boolean(pendingScheduleAlert) || detail?.info.status === "SCHEDULED";
  const scheduledAlertId = pendingScheduleAlert?.id ?? undefined;
  const scheduledAtText = pendingScheduleAlert?.scheduledAt
    ? formatKoreanDateTimeKST(pendingScheduleAlert.scheduledAt, {
        includeYear: false,
        includeWeekday: true,
      })
    : "예약 시각 정보가 없습니다.";
  const canCancelPayment = !isInvoiceVariant && detail?.info.status === "COMPLETED";
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
  const baseAmount = detail?.info.originalAmount ?? 0;
  const additionalAppliedAmount = additionalFields.enabled ? additionalTotalAmount : 0;
  const subtotalAmount = baseAmount + additionalAppliedAmount;
  const discountInputValue = typeof form.discountValue === "number" ? form.discountValue : 0;
  const editingDiscountAmount = discountEnabled
    ? calculateDiscountAmount(subtotalAmount, form.discountType ?? "PERCENT", discountInputValue)
    : 0;
  const storedFinalAmount = detail?.info.finalAmount ?? null;
  const storedDiscountAmount =
    storedFinalAmount != null ? Math.max(0, subtotalAmount - storedFinalAmount) : 0;
  const shouldRecalculateTotals = isEditing || storedFinalAmount == null;
  const discountAmountValue = shouldRecalculateTotals ? editingDiscountAmount : storedDiscountAmount;
  const hasDiscountDetails = Boolean(detail?.info.discountType) || discountAmountValue > 0;
	  const isSentInvoice =
	    isInvoiceVariant &&
	    (Boolean(detail?.info.invoiceRequestedAt) || (detail?.info.status ?? "UNPAID") !== "UNPAID");
  const sentAtText = detail?.info.invoiceRequestedAt
    ? formatKoreanDateTimeKST(detail.info.invoiceRequestedAt, {
        includeYear: false,
        includeWeekday: true,
      })
    : null;
  const handleRequestClose = () => {
    if (isInvoiceVariant && isEditing) {
      const ok = window.confirm("수정 중인 내용이 저장되지 않습니다. 닫을까요?");
      if (!ok) return;
    }
    onClose();
  };

  const buildOneTimeAdditionalItemsPayload = (
    dueDate: string,
    fields: AdditionalFieldState,
  ): PaymentAdditionalItemPayload[] => {
    const applied = dueDate && dueDate.trim() ? dueDate : undefined;
    const items: PaymentAdditionalItemPayload[] =
      detail?.additionalItems
        ?.filter((item) => item?.type === "OTHER")
        ?.map((item) => ({
          type: "OTHER" as const,
          label: (item?.label ?? "기타").trim(),
          quantity: item?.quantity ?? 1,
          unitPrice: item?.unitPrice ?? 0,
          appliedStart: item?.appliedStart ?? undefined,
          appliedEnd: item?.appliedEnd ?? undefined,
        })) ?? [];
    if (!fields.enabled) return items;
    const materialFee = fields.materialFee ?? 0;
    const textbookFee = fields.textbookFee ?? 0;
    if (materialFee > 0) {
      items.push({
        type: "MATERIAL",
        label: "재료비",
        quantity: 1,
        unitPrice: materialFee,
        appliedStart: applied,
        appliedEnd: applied,
      });
    }
    if (textbookFee > 0) {
      items.push({
        type: "TEXTBOOK",
        label: "교재비",
        quantity: 1,
        unitPrice: textbookFee,
        appliedStart: applied,
        appliedEnd: applied,
      });
    }
    return items;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!detail) return;
    if (!effectiveIsInvoiceVariant) return;
    if (!isEditing) return;
    const submitter = (event.nativeEvent as SubmitEvent | undefined)?.submitter as
      | HTMLElement
      | undefined;
    if (submitter && (submitter as HTMLElement).dataset?.action !== "save") {
      return;
    }
    const dueDate = detail.info.dueDate ?? form.dueDate ?? "";
    const memoText = typeof form.memo === "string" ? form.memo : "";
    const payload: PaymentInvoiceUpdatePayload = {
      recipientPhone: typeof form.recipientPhone === "string" ? form.recipientPhone : "",
      memo: memoText,
      managerMemo: memoText,
      additionalItems: buildOneTimeAdditionalItemsPayload(dueDate, additionalFields),
    };
    if (discountEnabled) {
      payload.discountType = form.discountType ?? "PERCENT";
      payload.discountValue = typeof form.discountValue === "number" ? form.discountValue : 0;
    }
    onSave(payload);
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleRequestClose}
      blockOutsideClose={isInvoiceVariant && saving}
      title={isInvoiceVariant ? (isEditing ? "청구서 수정" : "청구서 상세") : "결제 상세"}
      maxWidth={760}
    >
      {state.open && state.loading && <Skeleton h={160} />}
      {!state.loading && detail ? (
        <>
	          {isInvoiceVariant ? (
	            <InvoiceDetailColumn
	              detail={detail}
	              courseRows={courseRows}
	              onClose={handleRequestClose}
	              form={form}
	              isEditing={isEditing}
	              isSentInvoice={isSentInvoice}
	              sentAtText={sentAtText}
	              isScheduledPayment={isScheduledPayment}
	              scheduledAtText={scheduledAtText}
	              scheduledAlertId={scheduledAlertId}
	              discountAmountValue={discountAmountValue}
	              discountEnabled={discountEnabled}
	              setDiscountEnabled={setDiscountEnabled}
	              additionalFields={additionalFields}
	              additionalTotalAmount={additionalTotalAmount}
              saving={saving}
              deleting={deleting}
              scheduleCancelling={scheduleCancelling}
              scheduleSending={scheduleSending}
              setForm={setForm}
              setAdditionalFields={setAdditionalFields}
              setIsEditing={setIsEditing}
              onSubmit={handleSubmit}
              onDeleteInvoice={onDeleteInvoice}
              onCancelSchedule={onCancelSchedule}
              onSendScheduleNow={onSendScheduleNow}
            />
          ) : (
            <HistoryDetailColumn
              detail={detail}
              courseRows={courseRows}
              discountAmountValue={discountAmountValue}
              hasDiscountDetails={hasDiscountDetails}
              canCancelPayment={canCancelPayment}
              isScheduledPayment={isScheduledPayment}
              scheduledAtText={scheduledAtText}
              scheduledAlertId={scheduledAlertId}
              additionalFields={additionalFields}
              additionalTotalAmount={additionalTotalAmount}
              scheduleCancelling={scheduleCancelling}
              scheduleSending={scheduleSending}
              onClose={handleRequestClose}
              onCancelPayment={onCancelPayment}
              canceling={canceling}
              onDeleteInvoice={onDeleteInvoice}
              deleting={deleting}
              onOnsitePayment={onOnsitePayment}
              onsiteSubmitting={onsiteSubmitting}
              onResendPayment={onResendPayment}
              resendSubmitting={resendSubmitting}
              onCancelSchedule={onCancelSchedule}
              onSendScheduleNow={onSendScheduleNow}
            />
          )}
        </>
      ) : null}
    </Modal>
  );
}

function StudentInfoSection({
  detail,
  courseRows,
  recipientPhone,
  canEdit = false,
  onChangeRecipientPhone,
}: {
  detail: PaymentDetail;
  courseRows: PaymentCourseBrief[];
  recipientPhone?: string;
  canEdit?: boolean;
  onChangeRecipientPhone?: (value: string) => void;
}) {
  const courseTitle = courseRows.map((c) => c.title).filter(Boolean).join(", ") || "-";
  const rawRecipient = recipientPhone ?? detail.info.recipientPhone ?? detail.student.recipientPhone ?? "";
  const displayRecipient = formatPhoneKR(rawRecipient);
  return (
    <ReceiptSection>
      <SectionTitle>학생 정보</SectionTitle>
      <StudentInfoCard>
        <div className="row">
          <div className="label">학생 이름</div>
          <div className="value">{detail.student.name}</div>
        </div>
        <div className="row">
          <div className="label">수강 수업</div>
          <div className="value">{courseTitle}</div>
        </div>
        <div className="row">
          <div className="label">발송 번호</div>
          {canEdit && onChangeRecipientPhone ? (
            <div className="input-wrap">
              <Input
                value={displayRecipient}
                placeholder="예: 010-1234-5678"
                onChange={(event) => onChangeRecipientPhone(event.target.value)}
                style={{ textAlign: "right", padding: "6px 10px" }}
              />
            </div>
          ) : (
            <div className="value">{displayRecipient || "-"}</div>
          )}
        </div>
      </StudentInfoCard>
    </ReceiptSection>
  );
}

const ReceiptCard = styled(SectionCard)`
  border: 1px solid ${(p) => p.theme.colors.border};
  box-shadow: ${(p) => p.theme.shadow.medium};
  padding: 0;
  overflow: hidden;
  background: #fff;
`;

const ReceiptHeader = styled.div`
  background: ${(p) => p.theme.colors.surfaceAlt};
  padding: 20px 24px;
  border-bottom: 1px dashed ${(p) => p.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  .header-text {
    display: grid;
    gap: 4px;
  }
  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 700;
  }
  p {
    margin: 0;
    font-size: 13px;
    color: ${(p) => p.theme.colors.textMuted};
  }
`;

const ReceiptSection = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid ${(p) => p.theme.colors.borderMuted};
`;

const TotalAmountSection = styled.div`
  padding: 24px;
  background: ${(p) => p.theme.colors.primarySurface};
  text-align: center;
  .label {
    font-size: 13px;
    font-weight: 600;
    color: ${(p) => p.theme.colors.primary};
    margin-bottom: 4px;
  }
  .amount {
    font-size: 32px;
    font-weight: 800;
    color: ${(p) => p.theme.colors.primary};
    letter-spacing: -0.5px;
    margin-bottom: 8px;
  }
  .desc {
    font-size: 12px;
    color: ${(p) => p.theme.colors.textMuted};
    opacity: 0.8;
  }
`;

function InvoiceDetailColumn({
  detail,
  courseRows,
  onClose,
  form,
  isEditing,
  isSentInvoice,
  sentAtText,
  isScheduledPayment,
  scheduledAtText,
  scheduledAlertId,
  discountAmountValue,
  discountEnabled,
  setDiscountEnabled,
  additionalFields,
  additionalTotalAmount,
  saving,
  deleting,
  scheduleCancelling,
  scheduleSending,
  setForm,
  setAdditionalFields,
  setIsEditing,
	  onSubmit,
	  onDeleteInvoice,
	  onCancelSchedule,
	  onSendScheduleNow,
}: {
  detail: PaymentDetail;
  courseRows: PaymentCourseBrief[];
  onClose: () => void;
  form: PaymentInvoiceUpdatePayload;
  isEditing: boolean;
  isSentInvoice: boolean;
  sentAtText: string | null;
  isScheduledPayment: boolean;
  scheduledAtText: string;
  scheduledAlertId: number | undefined;
  discountAmountValue: number;
  discountEnabled: boolean;
  setDiscountEnabled: Dispatch<SetStateAction<boolean>>;
  additionalFields: AdditionalFieldState;
  additionalTotalAmount: number;
  saving: boolean;
  deleting?: boolean;
  scheduleCancelling?: boolean;
  scheduleSending?: boolean;
  setForm: Dispatch<SetStateAction<PaymentInvoiceUpdatePayload>>;
  setAdditionalFields: Dispatch<SetStateAction<AdditionalFieldState>>;
  setIsEditing: (value: boolean) => void;
	  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
	  onDeleteInvoice?: (detail: PaymentDetail) => void;
	  onCancelSchedule?: (detail: PaymentDetail, alertId: number) => void;
	  onSendScheduleNow?: (detail: PaymentDetail, alertId: number) => void;
}) {
  const deletable = Boolean(
    onDeleteInvoice && detail.info.status === "UNPAID" && !detail.info.invoiceRequestedAt,
  );
  const canEdit = isEditing && !isSentInvoice;
  const courseTitle = courseRows.map((c) => c.title).filter(Boolean).join(", ") || "-";
  const dueDate = form.dueDate ?? detail.info.dueDate ?? "";
  const discountTypeValue: "PERCENT" | "AMOUNT" =
    form.discountType === "AMOUNT" ? "AMOUNT" : "PERCENT";
  const statusText = PAYMENT_STATUS_LABEL[detail.info.status] ?? detail.info.status;
  const subtitleParts = [
    courseTitle,
    dueDate ? `결제 예정일 ${dueDate}` : "결제 예정일 -",
    isScheduledPayment ? "예약 발송" : isSentInvoice ? "발송 완료" : "미발송",
  ];
  const additionalEnabled = additionalFields.enabled;
  const appliedAdditional = additionalEnabled ? additionalTotalAmount : 0;
  const periodStart = detail.info.periodStart ?? dueDate ?? "";
  const periodEnd =
    detail.info.periodEnd ??
    computePeriodEnd(periodStart, detail.schedule?.cycleValue ?? null, detail.schedule?.cycleUnit ?? null);
  const cycleValue = detail.schedule?.cycleValue ?? null;
  const cycleUnit = detail.schedule?.cycleUnit ?? null;
  const memoText =
    isEditing
      ? typeof form.memo === "string"
        ? form.memo
        : ""
      : combineMemoValues(detail.info.memo, detail.info.managerMemo) || "메모가 없습니다.";
  const baseAmount = detail.info.originalAmount ?? 0;
  const subtotalAmount = baseAmount + appliedAdditional;
  const shouldRecalculateTotals = isEditing || detail.info.finalAmount == null;
  const recalculatedTotal = Math.max(0, subtotalAmount - discountAmountValue);
  const finalAmount = shouldRecalculateTotals ? recalculatedTotal : detail.info.finalAmount ?? recalculatedTotal;
  const headerTitle = isEditing ? "청구서 수정" : "청구서 상세";
  return (
    <form onSubmit={onSubmit}>
      <ReceiptCard>
        <ReceiptHeader>
          <div className="header-text">
            <h3>{headerTitle}</h3>
            <p>{subtitleParts.filter(Boolean).join(" · ")}</p>
          </div>
        </ReceiptHeader>

        <StudentInfoSection
          detail={detail}
          courseRows={courseRows}
          recipientPhone={typeof form.recipientPhone === "string" ? form.recipientPhone : ""}
          canEdit={canEdit}
          onChangeRecipientPhone={(value) => setForm((prev) => ({ ...prev, recipientPhone: value }))}
        />

        <ReceiptSection>
          <SectionTitle>결제 정보</SectionTitle>
          <InvoiceBasicFields
            detail={detail}
            form={form}
            disabled
          />
          <InvoiceSentNotice isSentInvoice={isSentInvoice} sentAtText={sentAtText} statusLabel={statusText} />
          <InvoiceScheduleNotice isScheduled={isScheduledPayment} scheduledAtText={scheduledAtText} />
          <InvoiceScheduleActions
            detail={detail}
            isScheduled={isScheduledPayment}
            scheduledAlertId={scheduledAlertId}
            scheduleCancelling={scheduleCancelling}
            scheduleSending={scheduleSending}
            onCancelSchedule={onCancelSchedule}
            onSendScheduleNow={onSendScheduleNow}
          />
        </ReceiptSection>

        <ReceiptSection>
          <SectionTitle>
            청구 기간
            {cycleValue && cycleValue > 0 ? (
              <Badge>
                {cycleValue}
                {cycleUnit === "DAYS" ? "일간" : cycleUnit === "WEEKS" ? "주간" : "개월간"}
              </Badge>
            ) : null}
          </SectionTitle>
          <PeriodRow>
            <PeriodValue>
              <span>시작일</span>
              <strong>{periodStart || "-"}</strong>
            </PeriodValue>
            <span className="arrow">→</span>
            <PeriodValue>
              <span>종료일</span>
              <strong>{periodEnd || "-"}</strong>
            </PeriodValue>
          </PeriodRow>
        </ReceiptSection>

        <ReceiptSection>
          <SectionTitle>추가 설정</SectionTitle>
          <DiscountEditAccordion
            enabled={discountEnabled}
            canEdit={canEdit}
            discountType={discountTypeValue}
            discountValue={typeof form.discountValue === "number" ? form.discountValue : 0}
            discountAmountValue={discountAmountValue}
            onToggle={(next) => {
              if (!canEdit) return;
              setDiscountEnabled(next);
              if (!next) return;
              setForm((prev) => ({
                ...prev,
                discountType: prev.discountType ?? "PERCENT",
                discountValue: typeof prev.discountValue === "number" ? prev.discountValue : 0,
              }));
            }}
            onChangeType={(next) => {
              if (!canEdit) return;
              setForm((prev) => ({ ...prev, discountType: next }));
            }}
            onChangeValue={(next) => {
              if (!canEdit) return;
              setForm((prev) => ({ ...prev, discountValue: next }));
            }}
          />
          <OneTimeAdditionalEditAccordion
            enabled={additionalEnabled}
            canEdit={canEdit}
            dueDate={dueDate}
            fields={additionalFields}
            total={additionalTotalAmount}
            onToggle={(next) => {
              if (!canEdit) return;
              setAdditionalFields((prev) =>
                next
                  ? { ...prev, enabled: true }
                  : { ...prev, enabled: false, materialFee: undefined, textbookFee: undefined },
              );
            }}
            onChangeMaterial={(value) => {
              if (!canEdit) return;
              setAdditionalFields((prev) => ({ ...prev, materialFee: value }));
            }}
            onChangeTextbook={(value) => {
              if (!canEdit) return;
              setAdditionalFields((prev) => ({ ...prev, textbookFee: value }));
            }}
          />
        </ReceiptSection>

        <ReceiptSection>
          <SectionTitle>메모</SectionTitle>
          {canEdit ? (
            <Textarea
              value={typeof form.memo === "string" ? form.memo : ""}
              onChange={(event) => {
                const value = event.target.value;
                setForm((prev) => ({ ...prev, memo: value, managerMemo: value }));
              }}
            />
          ) : (
            <SummaryText>{memoText}</SummaryText>
          )}
        </ReceiptSection>

        <TotalAmountSection>
          <div className="label">최종 청구 금액</div>
          <div className="amount">{formatMoney(finalAmount)}</div>
          <div className="desc">수강금액 + 추가금액 - 할인</div>
        </TotalAmountSection>

        <ReceiptFooter>
          <GhostButton type="button" onClick={onClose} disabled={saving}>
            닫기
          </GhostButton>
          {!isSentInvoice ? (
            isEditing ? (
              <>
                <GhostButton
                  type="button"
                  onClick={() => {
                    const initialDueDate = detail.info.dueDate ?? "";
                    const resolvedRecipient = detail.info.recipientPhone ?? detail.student.recipientPhone ?? "";
	                    const memoText = combineMemoValues(detail.info.memo, detail.info.managerMemo) || "";
	                    const initialDiscountType: DiscountType = detail.info.discountType ?? "PERCENT";
                    const initialDiscountValue =
                      typeof detail.info.discountValue === "number" ? detail.info.discountValue : 0;
                    const initialDiscountEnabled =
                      Boolean(detail.info.discountType) && detail.info.discountValue != null;
                    setDiscountEnabled(initialDiscountEnabled);
	                    setForm({
	                      dueDate: initialDueDate,
	                      recipientPhone: resolvedRecipient,
	                      memo: memoText,
	                      managerMemo: memoText,
	                      discountType: initialDiscountType,
	                      discountValue: initialDiscountValue,
	                    });
                    const materialItem = detail.additionalItems?.find((item) => item?.type === "MATERIAL");
                    const textbookItem = detail.additionalItems?.find((item) => item?.type === "TEXTBOOK");
                    const materialFeeValue =
                      typeof materialItem?.unitPrice === "number" ? materialItem.unitPrice : undefined;
                    const textbookFeeValue =
                      typeof textbookItem?.unitPrice === "number" ? textbookItem.unitPrice : undefined;
                    const enabled = Boolean(
                      (materialFeeValue && materialFeeValue > 0) || (textbookFeeValue && textbookFeeValue > 0),
                    );
                    setAdditionalFields({
                      enabled,
                      materialFee: materialFeeValue,
                      textbookFee: textbookFeeValue,
                      startDate: initialDueDate,
                      endDate: initialDueDate,
                    });
                    setIsEditing(false);
                  }}
                  disabled={saving}
                >
                  취소
                </GhostButton>
                <PrimaryButton type="submit" data-action="save" disabled={saving}>
                  {saving ? "저장 중..." : "저장"}
                </PrimaryButton>
              </>
            ) : (
              <>
                {deletable ? (
                  <DangerButton
                    type="button"
                    onClick={() => onDeleteInvoice?.(detail)}
                    disabled={saving || Boolean(deleting)}
                  >
                    {deleting ? "삭제 중..." : "삭제"}
                  </DangerButton>
                ) : null}
                <PrimaryButton
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setIsEditing(true);
                  }}
                >
                  수정
                </PrimaryButton>
              </>
            )
          ) : null}
        </ReceiptFooter>
      </ReceiptCard>
    </form>
  );
}

function InvoiceSentNotice({
  isSentInvoice,
  sentAtText,
  statusLabel,
}: {
  isSentInvoice: boolean;
  sentAtText: string | null;
  statusLabel?: string;
}) {
  if (!isSentInvoice) return null;
  return (
    <InfoCard data-tone="warning">
      {sentAtText ? (
        <InfoRow>
          <span>발송 완료</span>
          <strong>{sentAtText}</strong>
        </InfoRow>
      ) : statusLabel ? (
        <InfoRow>
          <span>상태</span>
          <strong>{statusLabel}</strong>
        </InfoRow>
      ) : null}
      <InfoRow>
        <span>안내</span>
        <MetaText>발송 전 대기(미발송) 청구서만 수정/삭제할 수 있습니다.</MetaText>
      </InfoRow>
    </InfoCard>
  );
}

function InvoiceScheduleNotice({ isScheduled, scheduledAtText }: { isScheduled: boolean; scheduledAtText: string }) {
  if (!isScheduled) return null;
  return (
    <ScheduleNotice>
      <strong>예약 발송 예정</strong>
      <span>{scheduledAtText}</span>
    </ScheduleNotice>
  );
}

function InvoiceBasicFields({
  detail,
  form,
  disabled = false,
}: {
  detail: PaymentDetail;
  form: PaymentInvoiceUpdatePayload;
  disabled?: boolean;
}) {
  return (
    <FormGrid>
      <label>
        결제 예정일
        <Input
          type="date"
          value={form.dueDate ?? ""}
          disabled={disabled}
        />
        <MetaText>수정 가능: 발송번호, 할인, 추가 금액(1회), 메모</MetaText>
      </label>
      <label>
        결제 주기(템플릿)
        <Input type="text" value={getCycleLabel(detail, "invoice")} disabled />
        <MetaText>결제 주기는 청구서 템플릿에서만 수정할 수 있습니다.</MetaText>
      </label>
    </FormGrid>
  );
}

function DiscountEditAccordion({
  enabled,
  canEdit,
  discountType,
  discountValue,
  discountAmountValue,
  onToggle,
  onChangeType,
  onChangeValue,
}: {
  enabled: boolean;
  canEdit: boolean;
  discountType: "PERCENT" | "AMOUNT";
  discountValue: number;
  discountAmountValue: number;
  onToggle: (next: boolean) => void;
  onChangeType: (next: "PERCENT" | "AMOUNT") => void;
  onChangeValue: (value: number) => void;
}) {
  const label = enabled
    ? discountType === "PERCENT"
      ? `${discountValue}% 할인`
      : `${formatMoney(discountValue)} 할인`
    : "할인 없음";
  const appliedText = enabled ? ` · 적용된 할인 금액 ${formatMoney(discountAmountValue)}` : "";

  return (
    <AccordionCard>
      <AccordionHeader>
        <span>할인 설정</span>
        <div>
          <ToggleSwitch>
            <input
              type="checkbox"
              checked={enabled}
              onChange={(event) => onToggle(event.currentTarget.checked)}
              disabled={!canEdit}
            />
            <div className="switch" />
          </ToggleSwitch>
        </div>
      </AccordionHeader>
      {enabled ? (
        <AccordionBody>
          <SummaryText>
            {label}
            {appliedText}
          </SummaryText>
          {canEdit ? (
            <EditGrid>
              <label>
                할인 방식
                <MethodToggle>
                  <MethodButton
                    type="button"
                    data-active={discountType === "PERCENT"}
                    onClick={() => onChangeType("PERCENT")}
                  >
                    %
                  </MethodButton>
                  <MethodButton type="button" data-active={discountType === "AMOUNT"} onClick={() => onChangeType("AMOUNT")}>
                    금액
                  </MethodButton>
                </MethodToggle>
              </label>
              <label>
                할인율 / 금액
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={String(discountValue ?? 0)}
                  onChange={(event) => onChangeValue(parseNumericInput(event.target.value) ?? 0)}
                />
                <MetaText>숫자만 입력해 주세요.</MetaText>
              </label>
            </EditGrid>
          ) : null}
        </AccordionBody>
      ) : null}
    </AccordionCard>
  );
}

function OneTimeAdditionalEditAccordion({
  enabled,
  canEdit,
  dueDate,
  fields,
  total,
  onToggle,
  onChangeMaterial,
  onChangeTextbook,
}: {
  enabled: boolean;
  canEdit: boolean;
  dueDate: string;
  fields: AdditionalFieldState;
  total: number;
  onToggle: (next: boolean) => void;
  onChangeMaterial: (value: number | undefined) => void;
  onChangeTextbook: (value: number | undefined) => void;
}) {
  const materialFee = typeof fields.materialFee === "number" ? fields.materialFee : undefined;
  const textbookFee = typeof fields.textbookFee === "number" ? fields.textbookFee : undefined;

  return (
    <AccordionCard>
      <AccordionHeader>
        <span>추가 금액(1회)</span>
        <div>
          <ToggleSwitch>
            <input
              type="checkbox"
              checked={enabled}
              onChange={(event) => onToggle(event.currentTarget.checked)}
              disabled={!canEdit}
            />
            <div className="switch" />
          </ToggleSwitch>
        </div>
      </AccordionHeader>
      {enabled ? (
        <AccordionBody>
          <SummaryText>
            재료비 {formatMoney(materialFee ?? 0)} · 교재비 {formatMoney(textbookFee ?? 0)} · 합계 {formatMoney(total)}
            {dueDate ? ` · ${dueDate} 결제건에 1회 적용` : ""}
          </SummaryText>
          {canEdit ? (
            <>
              <EditGrid>
                <label>
                  재료비
                  <Input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={materialFee ?? ""}
                    onChange={(event) => onChangeMaterial(parseNumericInput(event.target.value))}
                  />
                </label>
                <label>
                  교재비
                  <Input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={textbookFee ?? ""}
                    onChange={(event) => onChangeTextbook(parseNumericInput(event.target.value))}
                  />
                </label>
              </EditGrid>
              <MetaText>추가 금액은 현재 청구서 1회에만 적용됩니다.</MetaText>
            </>
          ) : null}
        </AccordionBody>
      ) : null}
    </AccordionCard>
  );
}

function DiscountSummaryAccordion({
  enabled,
  discountType,
  discountValue,
  discountAmountValue,
}: {
  enabled: boolean;
  discountType?: PaymentDetail["info"]["discountType"] | null;
  discountValue?: number | null;
  discountAmountValue: number;
}) {
  const hasValue = enabled && discountType && discountValue != null;
  const discountLabel = enabled
    ? hasValue
      ? discountType === "PERCENT"
        ? `${discountValue}% 할인`
        : `${formatMoney(Number(discountValue))} 할인`
      : "할인 적용"
    : "할인 없음";
  const appliedDiscount = enabled ? ` · 적용된 할인 금액 ${formatMoney(discountAmountValue)}` : "";
	return (
    <AccordionCard>
      <AccordionHeader>
        <span>할인 설정</span>
        <div>
          <ToggleSwitch>
            <input type="checkbox" checked={enabled} disabled />
            <div className="switch" />
          </ToggleSwitch>
        </div>
      </AccordionHeader>
      {enabled ? (
        <AccordionBody>
          <SummaryText>
            {discountLabel}
            {appliedDiscount} · 할인 수정은 템플릿에서만 가능합니다.
          </SummaryText>
        </AccordionBody>
      ) : null}
    </AccordionCard>
	);
}

function AdditionalSummaryAccordion({
  enabled,
  fields,
  total,
}: {
  enabled: boolean;
  fields: AdditionalFieldState;
  total: number;
}) {
  const materialFee = typeof fields.materialFee === "number" ? fields.materialFee : 0;
  const textbookFee = typeof fields.textbookFee === "number" ? fields.textbookFee : 0;
  const start = fields.startDate || "-";
  const end = fields.endDate || "-";
  return (
    <AccordionCard>
      <AccordionHeader>
        <span>추가 금액 설정</span>
        <div>
          <ToggleSwitch>
            <input type="checkbox" checked={enabled} disabled />
            <div className="switch" />
          </ToggleSwitch>
        </div>
      </AccordionHeader>
      {enabled ? (
        <AccordionBody>
          <SummaryText>
            재료비 {formatMoney(materialFee)} · 교재비 {formatMoney(textbookFee)} · 합계 {formatMoney(total)} (
            {start} ~ {end}) · 추가 금액 수정은 템플릿에서만 가능합니다.
          </SummaryText>
        </AccordionBody>
      ) : null}
    </AccordionCard>
  );
}

function InvoiceScheduleActions({
  detail,
  isScheduled,
  scheduledAlertId,
  scheduleCancelling,
  scheduleSending,
  onCancelSchedule,
  onSendScheduleNow,
}: {
  detail: PaymentDetail;
  isScheduled: boolean;
  scheduledAlertId: number | undefined;
  scheduleCancelling?: boolean;
  scheduleSending?: boolean;
  onCancelSchedule?: (detail: PaymentDetail, alertId: number) => void;
  onSendScheduleNow?: (detail: PaymentDetail, alertId: number) => void;
}) {
  if (!isScheduled || !scheduledAlertId) return null;
  return (
    <ScheduleActions>
      <GhostButton
        type="button"
        data-variant="warning"
        onClick={(event) => {
          event.preventDefault();
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
          onSendScheduleNow?.(detail, scheduledAlertId);
        }}
        disabled={scheduleSending}
      >
        {scheduleSending ? "즉시 발송 중..." : "즉시 발송"}
      </PrimaryButton>
    </ScheduleActions>
  );
}

function HistoryDetailColumn({
  detail,
  courseRows,
  discountAmountValue,
  hasDiscountDetails,
  canCancelPayment,
  isScheduledPayment,
  scheduledAtText,
  scheduledAlertId,
  additionalFields,
  additionalTotalAmount,
  scheduleCancelling,
  scheduleSending,
  onClose,
  onCancelPayment,
  canceling,
  onDeleteInvoice,
  deleting,
  onOnsitePayment,
  onsiteSubmitting,
  onResendPayment,
  resendSubmitting,
  onCancelSchedule,
  onSendScheduleNow,
}: {
  detail: PaymentDetail;
  courseRows: PaymentCourseBrief[];
  discountAmountValue: number;
  hasDiscountDetails: boolean;
  canCancelPayment: boolean;
  isScheduledPayment: boolean;
  scheduledAtText: string;
  scheduledAlertId: number | undefined;
  additionalFields: AdditionalFieldState;
  additionalTotalAmount: number;
  scheduleCancelling?: boolean;
  scheduleSending?: boolean;
  onClose: () => void;
  onCancelPayment?: (detail: PaymentDetail) => void;
  canceling?: boolean;
  onDeleteInvoice?: (detail: PaymentDetail) => void;
  deleting?: boolean;
  onOnsitePayment?: (detail: PaymentDetail) => void;
  onsiteSubmitting?: boolean;
  onResendPayment?: (detail: PaymentDetail) => void;
  resendSubmitting?: boolean;
  onCancelSchedule?: (detail: PaymentDetail, alertId: number) => void;
  onSendScheduleNow?: (detail: PaymentDetail, alertId: number) => void;
}) {
  const courseTitle = courseRows.map((c) => c.title).filter(Boolean).join(", ") || "-";
  const dueDate = detail.info.dueDate ?? "";
  const statusCode = detail.info.status;
  const statusText = PAYMENT_STATUS_LABEL[statusCode] ?? statusCode;
  const canDeleteHistory = Boolean(
    onDeleteInvoice && (detail.info.status === "PENDING" || detail.info.status === "FAILED"),
  );
  const canOnsitePayment = Boolean(onOnsitePayment && detail.info.status === "PENDING");
  const resendEligible = Boolean(onResendPayment && detail.info.status === "FAILED");
  const canResendAfter = (requestedAt?: string | null) => {
    if (!requestedAt) return true;
    const sent = Date.parse(requestedAt);
    if (Number.isNaN(sent)) return true;
    const threeDaysMs = 3 * 24 * 60 * 60 * 1000;
    return Date.now() - sent >= threeDaysMs;
  };
  const resendTooltip = (requestedAt?: string | null) => {
    if (!requestedAt) return undefined;
    if (canResendAfter(requestedAt)) return "발송 후 3일이 지나 재발송할 수 있습니다.";
    const nextTs = Date.parse(requestedAt) + 3 * 24 * 60 * 60 * 1000;
    if (Number.isNaN(nextTs)) return "발송 후 3일 뒤 재발송 가능합니다.";
    const nextDate = new Date(nextTs);
    const y = nextDate.getFullYear();
    const m = String(nextDate.getMonth() + 1).padStart(2, "0");
    const d = String(nextDate.getDate()).padStart(2, "0");
    return `발송 후 3일 뒤(${y}-${m}-${d})부터 재발송 가능합니다.`;
  };
  const canResend = resendEligible && canResendAfter(detail.info.invoiceRequestedAt);
  const resendTitle = resendEligible && !canResend ? resendTooltip(detail.info.invoiceRequestedAt) : undefined;
  const subtitleParts = [
    courseTitle,
    dueDate ? `결제 예정일 ${dueDate}` : "결제 예정일 -",
  ];
  const methodDisplay = getPaymentMethodDisplay(
    (detail.info.paymentMethod ?? (detail.info as unknown as { method?: unknown }).method) as never,
    detail.info.paymentType,
  );
  const completedText = detail.info.completedAt
    ? formatKoreanDateTimeKST(detail.info.completedAt, { includeWeekday: true, showSeconds: true })
    : "-";
  const canceledText = detail.info.canceledAt
    ? formatKoreanDateTimeKST(detail.info.canceledAt, { includeWeekday: true, showSeconds: true })
    : "-";
  const periodStart = detail.info.periodStart ?? dueDate ?? "";
  const periodEnd =
    detail.info.periodEnd ??
    computePeriodEnd(periodStart, detail.schedule?.cycleValue ?? null, detail.schedule?.cycleUnit ?? null);
  const cycleValue = detail.schedule?.cycleValue ?? null;
  const cycleUnit = detail.schedule?.cycleUnit ?? null;
  const memoText = combineMemoValues(detail.info.memo, detail.info.managerMemo) || "메모가 없습니다.";
  const baseAmount = detail.info.originalAmount ?? 0;
  const additionalEnabled = additionalFields.enabled;
  const appliedAdditional = additionalEnabled ? additionalTotalAmount : 0;
  const discountEnabled = hasDiscountDetails;
  const finalAmount =
    detail.info.finalAmount ?? Math.max(0, baseAmount + appliedAdditional - discountAmountValue);

  return (
    <ReceiptCard>
      <ReceiptHeader>
        <div className="header-text">
          <h3>결제 상세</h3>
          <p>{subtitleParts.filter(Boolean).join(" · ")}</p>
        </div>
        {statusCode ? (
          <StatusBadge status={statusCode}>{statusText}</StatusBadge>
        ) : null}
      </ReceiptHeader>

      <StudentInfoSection detail={detail} courseRows={courseRows} />

      <ReceiptSection>
        <SectionTitle>결제 정보</SectionTitle>
        <StackedInfoList>
          <label>
            결제 수단
            <Input type="text" value={methodDisplay} disabled />
          </label>
          <label>
            결제 시간
            <Input type="text" value={completedText} disabled />
          </label>
          {detail.info.status === "CANCELED" ? (
            <label>
              취소 시간
              <Input type="text" value={canceledText} disabled />
            </label>
          ) : null}
        </StackedInfoList>

        {isScheduledPayment ? (
          <>
            <ScheduleNotice>
              <strong>예약 발송 예정</strong>
              <span>{scheduledAtText}</span>
            </ScheduleNotice>
            {scheduledAlertId ? (
              <ScheduleActions>
                <GhostButton
                  type="button"
                  data-variant="warning"
                  onClick={() => onCancelSchedule?.(detail, scheduledAlertId)}
                  disabled={scheduleCancelling}
                >
                  {scheduleCancelling ? "예약 취소 중..." : "예약 취소"}
                </GhostButton>
                <PrimaryButton
                  type="button"
                  onClick={() => onSendScheduleNow?.(detail, scheduledAlertId)}
                  disabled={scheduleSending}
                >
                  {scheduleSending ? "즉시 발송 중..." : "즉시 발송"}
                </PrimaryButton>
              </ScheduleActions>
            ) : null}
          </>
        ) : null}
      </ReceiptSection>

      <ReceiptSection>
        <SectionTitle>
          청구 기간
          {cycleValue && cycleValue > 0 ? (
            <Badge>
              {cycleValue}
              {cycleUnit === "DAYS" ? "일간" : cycleUnit === "WEEKS" ? "주간" : "개월간"}
            </Badge>
          ) : null}
        </SectionTitle>
        <PeriodRow>
          <PeriodValue>
            <span>시작일</span>
            <strong>{periodStart || "-"}</strong>
          </PeriodValue>
          <span className="arrow">→</span>
          <PeriodValue>
            <span>종료일</span>
            <strong>{periodEnd || "-"}</strong>
          </PeriodValue>
        </PeriodRow>
      </ReceiptSection>

      <ReceiptSection>
        <SectionTitle>추가 설정</SectionTitle>
        <DiscountSummaryAccordion
          enabled={discountEnabled}
          discountType={detail.info.discountType ?? undefined}
          discountValue={detail.info.discountValue ?? undefined}
          discountAmountValue={discountAmountValue}
        />
        <AdditionalSummaryAccordion enabled={additionalEnabled} fields={additionalFields} total={additionalTotalAmount} />
      </ReceiptSection>

      <ReceiptSection>
        <SectionTitle>메모</SectionTitle>
        <SummaryText>{memoText}</SummaryText>
      </ReceiptSection>

      <TotalAmountSection>
        <div className="label">최종 결제 금액</div>
        <div className="amount">{formatMoney(finalAmount)}</div>
        <div className="desc">수강금액 + 추가금액 - 할인</div>
      </TotalAmountSection>

      <ReceiptFooter>
        <GhostButton type="button" onClick={onClose}>
          닫기
        </GhostButton>
        {canDeleteHistory ? (
          <DangerButton type="button" onClick={() => onDeleteInvoice?.(detail)} disabled={Boolean(deleting)}>
            {deleting ? "삭제 중..." : "삭제"}
          </DangerButton>
        ) : null}
        {resendEligible ? (
          <PrimaryButton
            type="button"
            onClick={() => {
              onResendPayment?.(detail);
              onClose();
            }}
            disabled={!canResend || resendSubmitting}
            title={resendTitle}
          >
            {resendSubmitting ? "재발송 중..." : "재발송"}
          </PrimaryButton>
        ) : null}
        {canOnsitePayment ? (
          <PrimaryButton
            type="button"
            onClick={() => {
              onOnsitePayment?.(detail);
              onClose();
            }}
            disabled={onsiteSubmitting}
          >
            {onsiteSubmitting ? "처리 중..." : "현장 결제 처리"}
          </PrimaryButton>
        ) : null}
        {canCancelPayment ? (
          <GhostButton type="button" data-variant="danger" onClick={() => onCancelPayment?.(detail)} disabled={canceling}>
            {canceling ? "취소 중..." : "결제 취소"}
          </GhostButton>
        ) : null}
      </ReceiptFooter>
    </ReceiptCard>
  );
}

export type OnsiteCandidateModalProps = {
  open: boolean;
  onClose: () => void;
  rows: PaymentHistoryRow[];
  loading: boolean;
  page: number;
  totalPages: number;
  onChangePage: (page: number) => void;
  onSelect: (row: PaymentHistoryRow) => void;
};

export function OnsiteCandidateModal({
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
                {rows.map((row) => {
                  const courseInfo = buildCourseDisplay(row);
                  return (
                    <tr key={row.id}>
                      <td>
                        <strong>{row.student.name}</strong>
                        <span className="sub">{row.student.code ?? "-"}</span>
                      </td>
                      <td>
                        {courseInfo.title ? (
                          <>
                            <strong>{courseInfo.title}</strong>
                            {courseInfo.code ? <span className="sub">{courseInfo.code}</span> : null}
                          </>
                        ) : (
                          <span className="sub">과목 정보 없음</span>
                        )}
                      </td>
                      <td>{formatMoney(row.finalAmount ?? row.originalAmount ?? 0)}</td>
                      <td>
                        {row.dueDate ? formatKoreanDate(row.dueDate, { includeYear: false, includeWeekday: false }) : "-"}
                      </td>
                      <td>
                        <StatusBadge status={row.status}>
                          {PAYMENT_STATUS_LABEL[row.status] ?? row.status}
                        </StatusBadge>
                      </td>
                      <td>
                        <SelectButton type="button" onClick={() => onSelect(row)}>
                          선택
                        </SelectButton>
                      </td>
                    </tr>
                  );
                })}
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

export type OnsiteModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: PaymentOnsitePayload) => void;
  submitting: boolean;
  target: PaymentHistoryRow | null;
  detail: PaymentDetail | null;
  detailLoading: boolean;
};

export function OnsitePaymentModal({
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
    const baseAmount = detail?.info.originalAmount ?? target?.originalAmount ?? target?.finalAmount ?? 0;
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
                    onChange={(event) => setTuitionAmount(parseNumericInput(event.target.value) ?? 0)}
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
                    onChange={(event) => setDiscountAmount(parseNumericInput(event.target.value) ?? 0)}
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
              <Input type="date" value={paymentDate} onChange={(event) => setPaymentDate(event.target.value)} />
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

const Input = styled.input`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 10px;
  padding: 8px 12px;
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;
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
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const PagerBar = styled.div`
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 14px;
  color: ${(p) => p.theme.colors.textMuted};
`;

const SelectButton = styled(PrimaryButton)`
  height: 32px;
  padding: 0 12px;
  font-size: 13px;
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

const StatusBadge = styled.span<{ status: string }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  background: ${({ status }) => (PAYMENT_STATUS_COLOR[status] ?? "#d1d5db")}1A;
  color: ${({ status }) => PAYMENT_STATUS_COLOR[status] ?? "#52525b"};
`;

const MetaText = styled.span`
  display: block;
  font-size: 12px;
  color: ${(p) => p.theme.colors.textMuted};
`;

const SectionTitle = styled.h4`
  margin: 0 0 12px;
  font-size: 14px;
  font-weight: 600;
  color: ${(p) => p.theme.colors.text};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Badge = styled.span`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 999px;
  background: ${(p) => p.theme.colors.primarySurface};
  color: ${(p) => p.theme.colors.primary};
  font-size: 11px;
  font-weight: 600;
`;

const ModalActions = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const DangerButton = styled(PrimaryButton)`
  background: #ef4444;
  border-color: #ef4444;
  color: #fff;

  &:hover:enabled {
    background: #dc2626;
    border-color: #dc2626;
  }
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

const StudentInfoCard = styled.div`
  margin: 0;
  padding: 16px;
  background: ${(p) => p.theme.colors.surfaceAlt};
  border-radius: 8px;
  display: grid;
  gap: 12px;

  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .label {
    font-size: 13px;
    font-weight: 600;
    color: ${(p) => p.theme.colors.textMuted};
    flex-shrink: 0;
  }
  .value {
    font-size: 14px;
    color: ${(p) => p.theme.colors.text};
    text-align: right;
    font-weight: 500;
  }
  .input-wrap {
    width: 160px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
  margin-bottom: 12px;
  label {
    display: grid;
    gap: 6px;
    font-size: 13px;
    color: ${(p) => p.theme.colors.textMuted};
    text-align: left;
  }
`;

const StackedInfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 12px;
  label {
    display: grid;
    gap: 6px;
    font-size: 13px;
    color: ${(p) => p.theme.colors.textMuted};
    text-align: left;
  }
`;

const EditGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
  margin-top: 12px;
  label {
    display: grid;
    gap: 6px;
    font-size: 13px;
    color: ${(p) => p.theme.colors.textMuted};
    text-align: left;
  }
`;

const PeriodRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  .arrow {
    color: ${(p) => p.theme.colors.textMuted};
    font-size: 14px;
  }
`;

const PeriodValue = styled.div`
  flex: 1;
  display: grid;
  gap: 4px;
  text-align: center;
  span {
    color: ${(p) => p.theme.colors.textMuted};
    font-size: 12px;
  }
  strong {
    color: ${(p) => p.theme.colors.text};
    font-size: 14px;
    font-weight: 600;
  }
`;

const ReceiptFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 24px 20px;
  flex-wrap: wrap;
`;

const AccordionCard = styled.div`
  margin: 12px 0 8px;
  padding: 0;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.md};
  background: ${(p) => p.theme.colors.surfaceAlt ?? "#f9fafb"};
`;

const AccordionHeader = styled.div`
  width: 100%;
  padding: 10px 12px;
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: default;
  span {
    font-size: 13px;
    color: ${(p) => p.theme.colors.text};
    font-weight: 600;
  }
`;

const AccordionBody = styled.div`
  border-top: 1px solid ${(p) => p.theme.colors.borderMuted};
  padding: 12px;
`;

const SummaryText = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${(p) => p.theme.colors.textMuted};
  line-height: 1.5;
`;

const SectionHeading = styled.h4`
  margin: 0;
  font-size: 15px;
  color: ${(p) => p.theme.colors.text};
`;
