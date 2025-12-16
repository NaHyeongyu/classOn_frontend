import { useCallback, useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import styled from "styled-components";
import Modal from "@/components/common/Modal";
import { EmptyState, GhostButton, PrimaryButton, Skeleton, TableBase } from "@/components/common/UI";
import { DiscountFields } from "@/components/payments/DiscountFields";
import { AdditionalChargeFields } from "@/components/payments/AdditionalChargeFields";
import type {
  PaymentCourseBrief,
  PaymentDetail,
  PaymentHistoryRow,
  PaymentMethod,
} from "@classon/shared-types";
import type {
  PaymentAdditionalItemPayload,
  PaymentInvoiceUpdatePayload,
  PaymentOnsitePayload,
} from "@/api/payments";
import { formatKoreanDate, formatKoreanDateTimeKST, formatMoney } from "@/lib/format";
import { PAYMENT_STATUS_COLOR, PAYMENT_STATUS_LABEL, formatPhoneKR } from "@/lib/paymentUiLabels";
import type { DetailState } from "@/features/payments/types";
import {
  buildCourseDisplay,
  combineMemoValues,
  computeNextDueDateLabel,
  formatCurrencyInput,
  getCycleLabel,
  getPaymentMethodDisplay,
  parseNumericInput,
  resolveMemoValue,
  toLocalDateInputValue,
} from "@/features/payments/utils/paymentsUtils";

type AdditionalFieldState = {
  enabled: boolean;
  materialFee?: number;
  textbookFee?: number;
  startDate?: string;
  endDate?: string;
};

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
}: DetailModalProps) {
  const isOpen = state.open;
  const detail = state.open ? state.data : null;
  const variant = state.open ? state.variant : "invoice";
  const [form, setForm] = useState<PaymentInvoiceUpdatePayload>({
    dueDate: "",
    periodStart: "",
    periodEnd: "",
    amount: undefined,
    memo: "",
    discountType: undefined,
    discountValue: undefined,
    managerMemo: "",
    additionalItems: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingSenderPhone, setIsEditingSenderPhone] = useState(false);
  const saveInFlight = useRef(false);
  const [discountEnabled, setDiscountEnabled] = useState(false);
  const [discountExpanded, setDiscountExpanded] = useState(false);
  const [additionExpanded, setAdditionExpanded] = useState(false);
  const [additionalFields, setAdditionalFields] = useState<AdditionalFieldState>({
    enabled: false,
    materialFee: undefined,
    textbookFee: undefined,
    startDate: "",
    endDate: "",
  });
  const buildAdditionalItemsPayload = useCallback(
    (fields: AdditionalFieldState): PaymentAdditionalItemPayload[] | undefined => {
      if (!fields.enabled) return undefined;
      const normalizedStart = fields.startDate && fields.startDate.trim() ? fields.startDate : undefined;
      const normalizedEnd = fields.endDate && fields.endDate.trim() ? fields.endDate : undefined;
      const items: PaymentAdditionalItemPayload[] = [];
      if (fields.materialFee && fields.materialFee > 0) {
        items.push({
          type: "MATERIAL",
          label: "재료비",
          quantity: 1,
          unitPrice: fields.materialFee,
          appliedStart: normalizedStart,
          appliedEnd: normalizedEnd,
        });
      }
      if (fields.textbookFee && fields.textbookFee > 0) {
        items.push({
          type: "TEXTBOOK",
          label: "교재비",
          quantity: 1,
          unitPrice: fields.textbookFee,
          appliedStart: normalizedStart,
          appliedEnd: normalizedEnd,
        });
      }
      return items.length ? items : undefined;
    },
    [],
  );

  const updateAdditionalFields = (partial: Partial<AdditionalFieldState>) => {
    setAdditionalFields((prev) => {
      const next = { ...prev, ...partial };
      setForm((prevForm) => ({
        ...prevForm,
        additionalItems: buildAdditionalItemsPayload(next),
      }));
      return next;
    });
  };
  const additionalTotalAmount =
    (additionalFields.materialFee ?? 0) + (additionalFields.textbookFee ?? 0);
  const handleAdditionalToggle = (next: boolean) => {
    if (!isEditing) return;
    updateAdditionalFields({ enabled: next });
  };
  const handleMaterialFeeChange = (value?: number) => {
    if (!isEditing) return;
    updateAdditionalFields({ materialFee: value ?? undefined });
  };
  const handleTextbookFeeChange = (value?: number) => {
    if (!isEditing) return;
    updateAdditionalFields({ textbookFee: value ?? undefined });
  };
  const handleAdditionalStartChange = (value: string) => {
    if (!isEditing) return;
    updateAdditionalFields({ startDate: value });
  };
  const handleAdditionalEndChange = (value: string) => {
    if (!isEditing) return;
    updateAdditionalFields({ endDate: value });
  };

  useEffect(() => {
    if (!detail) return;
    if (variant === "invoice") {
      setForm({
        dueDate: detail.info.dueDate ?? "",
        periodStart: detail.info.periodStart ?? "",
        periodEnd: detail.info.periodEnd ?? "",
        amount: detail.info.originalAmount ?? undefined,
        memo: detail.info.memo ?? "",
        managerMemo: detail.info.managerMemo ?? "",
        discountType: detail.info.discountType ?? undefined,
        discountValue: detail.info.discountValue ?? undefined,
        additionalItems: detail.additionalItems?.map((item) => ({
          type: item?.type ?? "OTHER",
          label: item?.label ?? "",
          quantity:
            typeof item?.quantity === "number" && item.quantity > 0 ? item.quantity : 1,
          unitPrice: typeof item?.unitPrice === "number" ? item.unitPrice : 0,
          appliedStart: item?.appliedStart ?? undefined,
          appliedEnd: item?.appliedEnd ?? undefined,
        })) ?? [],
      });
      setDiscountEnabled(Boolean(detail.info.discountType));
    }
    const materialItem = detail.additionalItems?.find((item) => item?.type === "MATERIAL");
    const textbookItem = detail.additionalItems?.find((item) => item?.type === "TEXTBOOK");
    const materialFeeValue =
      typeof materialItem?.unitPrice === "number" ? materialItem.unitPrice : undefined;
    const textbookFeeValue =
      typeof textbookItem?.unitPrice === "number" ? textbookItem.unitPrice : undefined;
    const startDateValue =
      materialItem?.appliedStart ??
      textbookItem?.appliedStart ??
      detail.info.dueDate ??
      "";
    const endDateValue =
      materialItem?.appliedEnd ??
      textbookItem?.appliedEnd ??
      detail.info.dueDate ??
      "";
    const enabled = Boolean(
      (materialFeeValue && materialFeeValue > 0) || (textbookFeeValue && textbookFeeValue > 0),
    );
    const mappedFields: AdditionalFieldState = {
      enabled,
      materialFee: materialFeeValue,
      textbookFee: textbookFeeValue,
      startDate: startDateValue || "",
      endDate: endDateValue || "",
    };
    setAdditionalFields(mappedFields);
    if (variant === "invoice") {
      setForm((prev) => ({
        ...prev,
        additionalItems: buildAdditionalItemsPayload(mappedFields),
      }));
    }
  }, [detail, variant, buildAdditionalItemsPayload]);

  useEffect(() => {
    setIsEditing(false);
  }, [detail?.info.id, variant]);

  useEffect(() => {
    setDiscountExpanded(false);
    setAdditionExpanded(false);
  }, [detail?.info.id]);

  useEffect(() => {
    if (isEditing) {
      setDiscountExpanded(true);
      setAdditionExpanded(true);
    }
  }, [isEditing]);

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
  const pendingScheduleAlert =
    detail?.alerts?.find((alert) => alert.status === "PENDING") ?? undefined;
  const isScheduledPayment = Boolean(pendingScheduleAlert) || detail?.info.status === "SCHEDULED";
  const scheduledAlertId = pendingScheduleAlert?.id ?? undefined;
  const scheduledAtText = pendingScheduleAlert?.scheduledAt
    ? formatKoreanDateTimeKST(pendingScheduleAlert.scheduledAt, {
        includeWeekday: true,
        showSeconds: true,
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
  const discountAmountValue = Math.max(
    0,
    (detail?.info.originalAmount ?? 0) - (detail?.info.finalAmount ?? 0),
  );
  const hasDiscountDetails = Boolean(detail?.info.discountType) || discountAmountValue > 0;
  const isSentInvoice =
    isInvoiceVariant &&
    (Boolean(detail?.info.invoiceRequestedAt) || (detail?.info.status ?? "UNPAID") !== "UNPAID");
  const sentAtText = detail?.info.invoiceRequestedAt
    ? formatKoreanDateTimeKST(detail.info.invoiceRequestedAt, {
        includeWeekday: true,
        showSeconds: true,
      })
    : null;
  const handleRequestClose = () => {
    if (isInvoiceVariant && isEditing) {
      const ok = window.confirm("수정 중인 내용이 저장되지 않습니다. 닫을까요?");
      if (!ok) return;
    }
    onClose();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!detail) return;
    onSave(form);
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleRequestClose}
      blockOutsideClose={isInvoiceVariant && saving}
      title={isInvoiceVariant ? "청구서 상세" : "결제 상세"}
      maxWidth={720}
    >
      {state.open && state.loading && <Skeleton h={160} />}
      {!state.loading && detail ? (
        <DetailLayout $stacked={isInvoiceVariant}>
          <DetailColumn>
            <DetailStudentColumn
              detail={detail}
              isInvoiceVariant={isInvoiceVariant}
              courseRows={courseRows}
              isEditingSenderPhone={isEditingSenderPhone}
              setIsEditingSenderPhone={setIsEditingSenderPhone}
            />
          </DetailColumn>
          <DetailColumn>
            {isInvoiceVariant ? (
              <InvoiceDetailColumn
                detail={detail}
                form={form}
                isEditing={isEditing}
                isSentInvoice={isSentInvoice}
                sentAtText={sentAtText}
                isScheduledPayment={isScheduledPayment}
                scheduledAtText={scheduledAtText}
                scheduledAlertId={scheduledAlertId}
                discountEnabled={discountEnabled}
                discountExpanded={discountExpanded}
                additionExpanded={additionExpanded}
                additionalFields={additionalFields}
                additionalTotalAmount={additionalTotalAmount}
                saving={saving}
                deleting={deleting}
                scheduleCancelling={scheduleCancelling}
                scheduleSending={scheduleSending}
                setForm={setForm}
                setIsEditing={setIsEditing}
                setDiscountEnabled={setDiscountEnabled}
                setDiscountExpanded={setDiscountExpanded}
                setAdditionExpanded={setAdditionExpanded}
                onSubmit={handleSubmit}
                onDeleteInvoice={onDeleteInvoice}
                onCancelSchedule={onCancelSchedule}
                onSendScheduleNow={onSendScheduleNow}
                onToggleAdditionalEnabled={handleAdditionalToggle}
                onChangeMaterialFee={handleMaterialFeeChange}
                onChangeTextbookFee={handleTextbookFeeChange}
                onChangeAdditionalStart={handleAdditionalStartChange}
                onChangeAdditionalEnd={handleAdditionalEndChange}
              />
            ) : (
              <HistoryDetailColumn
                detail={detail}
                discountAmountValue={discountAmountValue}
                hasDiscountDetails={hasDiscountDetails}
                canCancelPayment={canCancelPayment}
                isScheduledPayment={isScheduledPayment}
                scheduledAtText={scheduledAtText}
                scheduledAlertId={scheduledAlertId}
                discountExpanded={discountExpanded}
                additionExpanded={additionExpanded}
                additionalFields={additionalFields}
                additionalTotalAmount={additionalTotalAmount}
                scheduleCancelling={scheduleCancelling}
                scheduleSending={scheduleSending}
                setDiscountExpanded={setDiscountExpanded}
                setAdditionExpanded={setAdditionExpanded}
                onClose={onClose}
                onCancelPayment={onCancelPayment}
                canceling={canceling}
                onCancelSchedule={onCancelSchedule}
                onSendScheduleNow={onSendScheduleNow}
              />
            )}
          </DetailColumn>
        </DetailLayout>
      ) : null}
    </Modal>
  );
}

function DetailStudentColumn({
  detail,
  isInvoiceVariant,
  courseRows,
  isEditingSenderPhone,
  setIsEditingSenderPhone,
}: {
  detail: PaymentDetail;
  isInvoiceVariant: boolean;
  courseRows: PaymentCourseBrief[];
  isEditingSenderPhone: boolean;
  setIsEditingSenderPhone: (value: boolean) => void;
}) {
  return (
    <>
      <SectionTitle>학생 정보</SectionTitle>
      {isInvoiceVariant ? (
        <StudentInfoCard>
          <div className="row">
            <div className="label">학생 이름</div>
            <div className="value">{detail.student.name}</div>
          </div>
          <div className="row">
            <div className="label">수강 수업</div>
            <div className="value">{courseRows.map((c) => c.title).join(", ") || "-"}</div>
          </div>
          <div className="row">
            <div className="label">발신 번호</div>
            <div className="input-wrap">
              {isEditingSenderPhone ? (
                <Input
                  autoFocus
                  value={formatPhoneKR(detail.student.recipientPhone ?? "")}
                  placeholder="예: 010-1234-5678"
                  onChange={() => {
                    // Note: This only updates local state for display if we had a setter for detail
                  }}
                  onBlur={() => setIsEditingSenderPhone(false)}
                  style={{ textAlign: "right", padding: "6px 10px" }}
                />
              ) : (
                <>
                  <EditButton type="button" onClick={() => setIsEditingSenderPhone(true)}>
                    수정하기
                  </EditButton>
                  <div className="value" style={{ fontWeight: 700 }}>
                    {formatPhoneKR(detail.student.recipientPhone) || "-"}
                  </div>
                </>
              )}
            </div>
          </div>
        </StudentInfoCard>
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
          <InfoRow>
            <span>발송 번호</span>
            <strong>{detail.student.recipientPhone ?? "-"}</strong>
          </InfoRow>
        </InfoCard>
      )}
      <SectionTitle>수강 과목</SectionTitle>
      <StyledCourseList>
        {courseRows.map((course: PaymentCourseBrief, index: number) => (
          <li key={`${course.id ?? "course"}-${index}`}>
            <div className="info">
              <strong>{course.title ?? "-"}</strong>
              {course.code ? <span className="code">{course.code}</span> : null}
            </div>
            <span className="fee">{formatMoney(Number(course.fee ?? 0))}</span>
          </li>
        ))}
      </StyledCourseList>
    </>
  );
}

function InvoiceDetailColumn({
  detail,
  form,
  isEditing,
  isSentInvoice,
  sentAtText,
  isScheduledPayment,
  scheduledAtText,
  scheduledAlertId,
  discountEnabled,
  discountExpanded,
  additionExpanded,
  additionalFields,
  additionalTotalAmount,
  saving,
  deleting,
  scheduleCancelling,
  scheduleSending,
  setForm,
  setIsEditing,
	  setDiscountEnabled,
	  setDiscountExpanded,
	  setAdditionExpanded,
	  onSubmit,
	  onDeleteInvoice,
	  onCancelSchedule,
	  onSendScheduleNow,
  onToggleAdditionalEnabled,
  onChangeMaterialFee,
  onChangeTextbookFee,
  onChangeAdditionalStart,
  onChangeAdditionalEnd,
}: {
  detail: PaymentDetail;
  form: PaymentInvoiceUpdatePayload;
  isEditing: boolean;
  isSentInvoice: boolean;
  sentAtText: string | null;
  isScheduledPayment: boolean;
  scheduledAtText: string;
  scheduledAlertId: number | undefined;
  discountEnabled: boolean;
  discountExpanded: boolean;
  additionExpanded: boolean;
  additionalFields: AdditionalFieldState;
  additionalTotalAmount: number;
  saving: boolean;
  deleting?: boolean;
  scheduleCancelling?: boolean;
  scheduleSending?: boolean;
  setForm: Dispatch<SetStateAction<PaymentInvoiceUpdatePayload>>;
  setIsEditing: (value: boolean) => void;
  setDiscountEnabled: (value: boolean) => void;
	  setDiscountExpanded: Dispatch<SetStateAction<boolean>>;
	  setAdditionExpanded: Dispatch<SetStateAction<boolean>>;
	  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
	  onDeleteInvoice?: (detail: PaymentDetail) => void;
	  onCancelSchedule?: (detail: PaymentDetail, alertId: number) => void;
	  onSendScheduleNow?: (detail: PaymentDetail, alertId: number) => void;
  onToggleAdditionalEnabled: (value: boolean) => void;
  onChangeMaterialFee: (value?: number) => void;
  onChangeTextbookFee: (value?: number) => void;
  onChangeAdditionalStart: (value: string) => void;
  onChangeAdditionalEnd: (value: string) => void;
}) {
  const deletable = Boolean(
    onDeleteInvoice && detail.info.status === "UNPAID" && !detail.info.invoiceRequestedAt,
  );
  return (
    <form onSubmit={onSubmit}>
      <DetailStack>
        <SectionTitle>청구 정보</SectionTitle>
        <InvoiceSentNotice
          isSentInvoice={isSentInvoice}
          sentAtText={sentAtText}
          statusLabel={PAYMENT_STATUS_LABEL[detail.info.status] ?? detail.info.status}
        />
        <InvoiceScheduleNotice isScheduled={isScheduledPayment} scheduledAtText={scheduledAtText} />
        <InvoiceBasicFields detail={detail} form={form} isEditing={isEditing} isSent={isSentInvoice} setForm={setForm} />
        <InvoiceDiscountSection
          form={form}
          isEditing={isEditing}
          isSent={isSentInvoice}
          discountEnabled={discountEnabled}
          discountExpanded={discountExpanded}
          setForm={setForm}
          setDiscountEnabled={setDiscountEnabled}
          setDiscountExpanded={setDiscountExpanded}
        />
        <InvoiceAdditionalSection
          additionExpanded={additionExpanded}
          additionalFields={additionalFields}
          additionalTotalAmount={additionalTotalAmount}
          isEditing={isEditing}
          isSent={isSentInvoice}
          setAdditionExpanded={setAdditionExpanded}
          onToggleAdditionalEnabled={onToggleAdditionalEnabled}
          onChangeMaterialFee={onChangeMaterialFee}
          onChangeTextbookFee={onChangeTextbookFee}
          onChangeAdditionalStart={onChangeAdditionalStart}
          onChangeAdditionalEnd={onChangeAdditionalEnd}
        />
        <InvoiceMemoField form={form} isEditing={isEditing} isSent={isSentInvoice} setForm={setForm} />
        <InvoiceScheduleActions
          detail={detail}
          isScheduled={isScheduledPayment}
          scheduledAlertId={scheduledAlertId}
          scheduleCancelling={scheduleCancelling}
          scheduleSending={scheduleSending}
          onCancelSchedule={onCancelSchedule}
          onSendScheduleNow={onSendScheduleNow}
        />
	        <InvoiceFooterActions
	          isEditing={isEditing}
	          isSent={isSentInvoice}
	          deletable={deletable}
	          deleting={Boolean(deleting)}
	          onDelete={() => onDeleteInvoice?.(detail)}
	          saving={saving}
	          setIsEditing={setIsEditing}
	        />
	      </DetailStack>
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
  isEditing,
  isSent,
  setForm,
}: {
  detail: PaymentDetail;
  form: PaymentInvoiceUpdatePayload;
  isEditing: boolean;
  isSent: boolean;
  setForm: Dispatch<SetStateAction<PaymentInvoiceUpdatePayload>>;
}) {
  const computePeriodEndByCycle = (periodStart?: string | null, cycleValue?: number | null): string | undefined => {
    if (!periodStart || !cycleValue || cycleValue <= 0) return undefined;
    const base = new Date(`${periodStart}T00:00:00`);
    if (Number.isNaN(base.getTime())) return undefined;
    const next = new Date(base);
    next.setMonth(next.getMonth() + cycleValue);
    return toLocalDateInputValue(next);
  };

  return (
    <EditFormGrid>
      <label className="full-row">
        결제 예정일
        <Input
          type="date"
          value={form.dueDate ?? ""}
          disabled={!isEditing || isSent}
          onChange={(event) => setForm((prev) => ({ ...prev, dueDate: event.target.value }))}
        />
      </label>

      <div className="period-grid">
        <label>
          청구 기간 시작
          <Input
            type="date"
            value={form.periodStart ?? detail.info.periodStart ?? ""}
            disabled={!isEditing || isSent}
            onChange={(event) => {
              const nextStart = event.target.value;
              setForm((prev) => {
                const cycle = detail.schedule?.cycleValue ?? null;
                const nextEnd = computePeriodEndByCycle(nextStart, cycle);
                return {
                  ...prev,
                  periodStart: nextStart,
                  periodEnd: nextEnd ?? prev.periodEnd,
                };
              });
            }}
          />
        </label>
        <label>
          청구 기간 종료
          <Input
            type="date"
            value={form.periodEnd ?? detail.info.periodEnd ?? ""}
            disabled={!isEditing || isSent}
            onChange={(event) => setForm((prev) => ({ ...prev, periodEnd: event.target.value }))}
          />
        </label>
      </div>

      <div className="period-grid">
        <label>
          청구 금액
          <Input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={
              isEditing
                ? String(form.amount ?? detail.info.originalAmount ?? "")
                : formatCurrencyInput(typeof form.amount === "number" ? form.amount : detail.info.originalAmount)
            }
            disabled={!isEditing || isSent}
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
            type="text"
            value={getCycleLabel(detail, "invoice")}
            disabled
          />
        </label>
      </div>
    </EditFormGrid>
  );
}

function InvoiceDiscountSection({
  form,
  isEditing,
  isSent,
  discountEnabled,
  discountExpanded,
  setForm,
  setDiscountEnabled,
  setDiscountExpanded,
}: {
  form: PaymentInvoiceUpdatePayload;
  isEditing: boolean;
  isSent: boolean;
  discountEnabled: boolean;
  discountExpanded: boolean;
  setForm: Dispatch<SetStateAction<PaymentInvoiceUpdatePayload>>;
  setDiscountEnabled: (value: boolean) => void;
  setDiscountExpanded: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <CollapsibleCard>
      <CollapsibleHeader type="button" onClick={() => setDiscountExpanded((prev) => !prev)}>
        <span>할인 설정</span>
        <CaretIcon $open={discountExpanded} />
      </CollapsibleHeader>
      {discountExpanded ? (
        <CollapsibleBody>
          <DiscountFields
            enabled={discountEnabled}
            discountType={form.discountType ?? undefined}
            discountValue={form.discountValue}
            onToggleEnabled={(next) => {
              if (!isEditing || isSent) return;
              setDiscountEnabled(next);
              setForm((prev) => ({
                ...prev,
                discountType: next ? prev.discountType ?? "AMOUNT" : undefined,
                discountValue: next ? prev.discountValue : undefined,
              }));
            }}
            onChangeType={(next) => {
              if (!isEditing || isSent) return;
              setForm((prev) => ({ ...prev, discountType: next }));
            }}
            onChangeValue={(value) => {
              if (!isEditing || isSent) return;
              setForm((prev) => ({
                ...prev,
                discountValue: typeof value === "number" ? value : undefined,
              }));
            }}
            onChangeStartDate={() => {}}
            onChangeEndDate={() => {}}
            showPeriod={false}
            disabled={!isEditing || isSent}
            showTitle={false}
          />
        </CollapsibleBody>
      ) : null}
    </CollapsibleCard>
  );
}

function InvoiceAdditionalSection({
  additionExpanded,
  additionalFields,
  additionalTotalAmount,
  isEditing,
  isSent,
  setAdditionExpanded,
  onToggleAdditionalEnabled,
  onChangeMaterialFee,
  onChangeTextbookFee,
  onChangeAdditionalStart,
  onChangeAdditionalEnd,
}: {
  additionExpanded: boolean;
  additionalFields: AdditionalFieldState;
  additionalTotalAmount: number;
  isEditing: boolean;
  isSent: boolean;
  setAdditionExpanded: Dispatch<SetStateAction<boolean>>;
  onToggleAdditionalEnabled: (value: boolean) => void;
  onChangeMaterialFee: (value?: number) => void;
  onChangeTextbookFee: (value?: number) => void;
  onChangeAdditionalStart: (value: string) => void;
  onChangeAdditionalEnd: (value: string) => void;
}) {
  return (
    <CollapsibleCard>
      <CollapsibleHeader type="button" onClick={() => setAdditionExpanded((prev) => !prev)}>
        <span>추가 금액 설정</span>
        <CaretIcon $open={additionExpanded} />
      </CollapsibleHeader>
      {additionExpanded ? (
        <CollapsibleBody>
          <AdditionalChargeFields
            enabled={additionalFields.enabled}
            materialFee={additionalFields.materialFee}
            textbookFee={additionalFields.textbookFee}
            startDate={additionalFields.startDate}
            endDate={additionalFields.endDate}
            onToggleEnabled={onToggleAdditionalEnabled}
            onChangeMaterialFee={onChangeMaterialFee}
            onChangeTextbookFee={onChangeTextbookFee}
            onChangeStartDate={onChangeAdditionalStart}
            onChangeEndDate={onChangeAdditionalEnd}
            disabled={!isEditing || isSent}
            showTitle={false}
          />
          {additionalFields.enabled ? (
            <AdditionalFooter>
              <span>추가 금액 합계</span>
              <strong>{formatMoney(additionalTotalAmount)}</strong>
            </AdditionalFooter>
          ) : null}
        </CollapsibleBody>
      ) : null}
    </CollapsibleCard>
  );
}

function InvoiceMemoField({
  form,
  isEditing,
  isSent,
  setForm,
}: {
  form: PaymentInvoiceUpdatePayload;
  isEditing: boolean;
  isSent: boolean;
  setForm: Dispatch<SetStateAction<PaymentInvoiceUpdatePayload>>;
}) {
  return (
    <label>
      메모
      <Textarea
        value={resolveMemoValue(form.memo, form.managerMemo)}
        disabled={!isEditing || isSent}
        onChange={(event) => {
          const nextValue = event.target.value;
          setForm((prev) => ({ ...prev, memo: nextValue, managerMemo: nextValue }));
        }}
      />
    </label>
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

function InvoiceFooterActions({
  isEditing,
  isSent,
  deletable,
  deleting,
  onDelete,
  saving,
  setIsEditing,
}: {
  isEditing: boolean;
  isSent: boolean;
  deletable: boolean;
  deleting: boolean;
  onDelete: () => void;
  saving: boolean;
  setIsEditing: (value: boolean) => void;
}) {
  if (isSent) return null;
  return (
    <ModalActions>
      {isEditing ? (
        <PrimaryButton type="submit" disabled={saving}>
          {saving ? "저장 중..." : "저장"}
        </PrimaryButton>
      ) : (
        <>
          {deletable ? (
            <DangerButton
              type="button"
              onClick={(event) => {
                event.preventDefault();
                onDelete();
              }}
              disabled={saving || deleting}
            >
              {deleting ? "삭제 중..." : "삭제"}
            </DangerButton>
          ) : null}
          <PrimaryButton
            type="button"
            onClick={(event) => {
              event.preventDefault();
              setIsEditing(true);
            }}
          >
            수정
          </PrimaryButton>
        </>
      )}
    </ModalActions>
  );
}

function HistoryDetailColumn({
  detail,
  discountAmountValue,
  hasDiscountDetails,
  canCancelPayment,
  isScheduledPayment,
  scheduledAtText,
  scheduledAlertId,
  discountExpanded,
  additionExpanded,
  additionalFields,
  additionalTotalAmount,
  scheduleCancelling,
  scheduleSending,
  setDiscountExpanded,
  setAdditionExpanded,
  onClose,
  onCancelPayment,
  canceling,
  onCancelSchedule,
  onSendScheduleNow,
}: {
  detail: PaymentDetail;
  discountAmountValue: number;
  hasDiscountDetails: boolean;
  canCancelPayment: boolean;
  isScheduledPayment: boolean;
  scheduledAtText: string;
  scheduledAlertId: number | undefined;
  discountExpanded: boolean;
  additionExpanded: boolean;
  additionalFields: AdditionalFieldState;
  additionalTotalAmount: number;
  scheduleCancelling?: boolean;
  scheduleSending?: boolean;
  setDiscountExpanded: Dispatch<SetStateAction<boolean>>;
  setAdditionExpanded: Dispatch<SetStateAction<boolean>>;
  onClose: () => void;
  onCancelPayment?: (detail: PaymentDetail) => void;
  canceling?: boolean;
  onCancelSchedule?: (detail: PaymentDetail, alertId: number) => void;
  onSendScheduleNow?: (detail: PaymentDetail, alertId: number) => void;
}) {
  const discountAmount = discountAmountValue;
  const discountDisplay = discountAmount ? formatMoney(discountAmount) : "—";
  const methodDisplay = getPaymentMethodDisplay(detail.info.paymentMethod, detail.info.paymentType);
  const completedText = detail.info.completedAt
    ? formatKoreanDateTimeKST(detail.info.completedAt, { includeWeekday: true, showSeconds: true })
    : "-";
  const canceledText = detail.info.canceledAt
    ? formatKoreanDateTimeKST(detail.info.canceledAt, { includeWeekday: true, showSeconds: true })
    : "-";
  const approvalNumber =
    detail.info.approvalNumber && detail.info.approvalNumber.trim() ? detail.info.approvalNumber : "-";
  const statusText = PAYMENT_STATUS_LABEL[detail.info.status] ?? detail.info.status;
  const nextDueText = computeNextDueDateLabel(detail);

  return (
    <DetailStack>
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
            <strong>{getCycleLabel(detail, "history")}</strong>
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
      {hasDiscountDetails ? (
        <CollapsibleCard>
          <CollapsibleHeader type="button" onClick={() => setDiscountExpanded((prev) => !prev)}>
            <span>할인 설정</span>
            <CaretIcon $open={discountExpanded} />
          </CollapsibleHeader>
          {discountExpanded ? (
            <CollapsibleBody>
              <DetailList>
                <li>
                  <span>유형</span>
                  <strong>{detail.info.discountType === "PERCENT" ? "비율 할인" : "금액 할인"}</strong>
                </li>
                <li>
                  <span>할인 값</span>
                  <strong>
                    {detail.info.discountType === "PERCENT"
                      ? `${detail.info.discountValue ?? 0}%`
                      : formatMoney(Number(detail.info.discountValue ?? 0))}
                  </strong>
                </li>
                <li>
                  <span>적용된 할인 금액</span>
                  <strong>{discountDisplay}</strong>
                </li>
              </DetailList>
            </CollapsibleBody>
          ) : null}
        </CollapsibleCard>
      ) : null}
      <CollapsibleCard>
        <CollapsibleHeader type="button" onClick={() => setAdditionExpanded((prev) => !prev)}>
          <span>추가 금액 설정</span>
          <CaretIcon $open={additionExpanded} />
        </CollapsibleHeader>
        {additionExpanded ? (
          <CollapsibleBody>
            <AdditionalChargeFields
              enabled={additionalFields.enabled}
              materialFee={additionalFields.materialFee}
              textbookFee={additionalFields.textbookFee}
              startDate={additionalFields.startDate}
              endDate={additionalFields.endDate}
              onToggleEnabled={() => {}}
              onChangeMaterialFee={() => {}}
              onChangeTextbookFee={() => {}}
              onChangeStartDate={() => {}}
              onChangeEndDate={() => {}}
              disabled
              showTitle={false}
            />
            {additionalFields.enabled ? (
              <AdditionalFooter>
                <span>추가 금액 합계</span>
                <strong>{formatMoney(additionalTotalAmount)}</strong>
              </AdditionalFooter>
            ) : null}
          </CollapsibleBody>
        ) : null}
      </CollapsibleCard>
      <SectionTitle>메모</SectionTitle>
      <Paragraph>{combineMemoValues(detail.info.memo, detail.info.managerMemo) || "메모가 없습니다."}</Paragraph>
      <ModalActions>
        <PrimaryButton type="button" onClick={onClose}>
          확인
        </PrimaryButton>
        {canCancelPayment ? (
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
    </DetailStack>
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
                        {row.dueDate ? formatKoreanDate(row.dueDate, { includeWeekday: false }) : "-"}
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
  gap: 12px;
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

const CollapsibleCard = styled.div`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.md};
  background: ${(p) => p.theme.colors.surface};
`;

const CollapsibleHeader = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: none;
  border: none;
  font-size: 14px;
  font-weight: 600;
  color: ${(p) => p.theme.colors.text};
  cursor: pointer;
`;

const CollapsibleBody = styled.div`
  border-top: 1px solid ${(p) => p.theme.colors.borderMuted};
  padding: 12px 16px;
  margin-bottom: 8px;
`;

const CaretIcon = styled.span<{ $open: boolean }>`
  border: solid currentColor;
  border-width: 0 2px 2px 0;
  display: inline-block;
  padding: 4px;
  transform: rotate(${(p) => (p.$open ? "45deg" : "-45deg")});
  transition: transform 120ms ease;
`;

const AdditionalFooter = styled.div`
  margin-top: 8px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: ${(p) => p.theme.colors.text};
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

const DetailLayout = styled.div<{ $stacked?: boolean }>`
  display: grid;
  grid-template-columns: ${(p) => (p.$stacked ? "1fr" : "repeat(auto-fit, minmax(280px, 1fr))")};
  gap: 16px;
  max-height: 70vh;
  overflow: auto;
  align-items: flex-start;
  align-content: flex-start;
`;

const DetailColumn = styled.div`
  display: grid;
  gap: 12px;
  align-items: flex-start;
  align-content: flex-start;
`;

const DetailStack = styled.div`
  display: grid;
  gap: 12px;

  label {
    display: grid;
    gap: 6px;
    font-size: 13px;
    font-weight: 600;
    color: ${(p) => p.theme.colors.textMuted};
  }
`;

const EditFormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px 16px;
  .full-row {
    grid-column: 1 / -1;
  }
  .period-grid {
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 12px 16px;
  }
  label {
    display: grid;
    gap: 6px;
    font-size: 13px;
    color: ${(p) => p.theme.colors.textMuted};
  }
  .period-grid label {
    margin: 0;
  }
`;

const SectionTitle = styled.h4`
  margin: 8px 0 0 0;
  font-size: 15px;
  color: ${(p) => p.theme.colors.text};

  &:first-child {
    margin-top: 0;
  }
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

const DangerButton = styled(PrimaryButton)`
  background: #ef4444;
  border-color: #ef4444;
  color: #fff;

  &:hover:enabled {
    background: #dc2626;
    border-color: #dc2626;
  }
`;

const Paragraph = styled.p`
  margin: 0;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.md};
  padding: 12px;
  min-height: 80px;
  white-space: pre-wrap;
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

const EditButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  font-size: 12px;
  color: ${(p) => p.theme.colors.textMuted};
  text-decoration: underline;
  cursor: pointer;
  &:hover {
    color: ${(p) => p.theme.colors.primary};
  }
`;

const StyledCourseList = styled.ul`
  margin: 0;
  padding: 16px;
  background: ${(p) => p.theme.colors.surfaceAlt};
  border-radius: 8px;
  list-style: none;
  display: grid;
  gap: 8px;

  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
  }
  .info {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  strong {
    color: ${(p) => p.theme.colors.text};
    font-weight: 500;
  }
  .code {
    font-size: 12px;
    color: ${(p) => p.theme.colors.textMuted};
  }
  .fee {
    font-weight: 600;
    color: ${(p) => p.theme.colors.text};
  }
`;

const SectionHeading = styled.h4`
  margin: 0;
  font-size: 15px;
  color: ${(p) => p.theme.colors.text};
`;
