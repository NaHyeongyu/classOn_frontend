import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import styled from "styled-components";
import { Card, Tabs, TabButton } from "@/components/studentDetail/StudentDetailStyles";
import {
    EmptyState,
    GhostButton,
    PrimaryButton,
    TableBase,
    Skeleton,
} from "@/components/common/UI";
import Modal from "@/components/common/Modal";
import { useToast } from "@/components/common/Toast";
import { DiscountFields } from "@/components/payments/DiscountFields";
import { AdditionalChargeFields } from "@/components/payments/AdditionalChargeFields";
import { PaymentDetailModal } from "@/components/payments/PaymentDetailModal";
import {
    cancelPayment,
    getPaymentDetail,
    updatePaymentInvoice,
    type PaymentInvoiceUpdatePayload,
    type PaymentAdditionalItemPayload,
} from "@/api/payments";
import type { StudentPaymentInfo } from "@/api/students";
import type { PaymentDetail, DiscountType, PaymentMethod, PaymentType } from "@classon/shared-types";
import { formatMoney, formatKoreanDate, formatKoreanDateTimeKST } from "@/lib/format";
import { readableError } from "@/lib/errors";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invalidatePaymentsQueries } from "@/lib/paymentsCache";

type DetailState =
    | { open: false }
    | {
    open: true;
    id: number;
    variant: "invoice" | "history";
    loading: boolean;
    data: PaymentDetail | null;
};

type InvoiceEditState =
    | { open: false }
    | {
    open: true;
    loading: boolean;
    data: PaymentDetail | null;
};

type Props = {
    studentId: number | null;
    payments: StudentPaymentInfo | null;
    loading: boolean;
    error: string | null;
    onRefresh: () => void;
    view?: "invoice" | "history";
    showTabs?: boolean;
    withinCard?: boolean;
};

const createEmptyInvoiceForm = (): PaymentInvoiceUpdatePayload => ({
    dueDate: "",
    periodStart: "",
    periodEnd: "",
    amount: undefined,
    memo: "",
    managerMemo: "",
    discountType: undefined,
    discountValue: undefined,
    additionalItems: undefined,
    cycleValue: undefined,
    cycleUnit: undefined,
});

const statusLabel: Record<string, string> = {
    UNPAID: "미납",
    PENDING: "대기",
    COMPLETED: "완료",
    FAILED: "실패",
    CANCELED: "취소",
};

const statusColor: Record<string, string> = {
    UNPAID: "#f97316",
    PENDING: "#2563EB",
    COMPLETED: "#059669",
    FAILED: "#dc2626",
    CANCELED: "#dc2626",
};

export function StudentPaymentsSection({
    studentId,
    payments,
    loading,
    error,
    onRefresh,
    view,
    showTabs = true,
    withinCard = true,
}: Props) {
    const { success, error: toastError } = useToast();
    const queryClient = useQueryClient();
    const invoice = payments?.invoice ?? null;
    const history = payments?.history ?? [];
    const completedHistory = history.filter(
        (row) => row.status === "COMPLETED" || row.status === "CANCELED",
    );
    const normalizedCourseIds = useMemo(() => {
        if (!invoice?.courses?.length) return [];
        return invoice.courses
            .map((course) => (course?.id != null ? course.id : null))
            .filter((id): id is number => typeof id === "number")
            .sort((a, b) => a - b);
    }, [invoice?.courses]);
    const recommendedAmount = useMemo(() => {
        if (!invoice?.courses?.length) return 0;
        return invoice.courses.reduce((total, course) => {
            if (!course) return total;
            const fee = typeof course.fee === "number" ? course.fee : Number(course.fee ?? 0);
            return total + (Number.isFinite(fee) ? fee : 0);
        }, 0);
    }, [invoice?.courses]);
    const normalizedRecommendedAmount = Math.max(0, Math.round(recommendedAmount ?? 0));
    const normalizedInvoiceAmount = Math.max(0, Math.round(invoice?.info?.originalAmount ?? 0));
    const invoiceStatus = invoice?.info?.status ?? "";
    const invoiceEditable =
        invoiceStatus === "UNPAID" || invoiceStatus === "PENDING" || invoiceStatus === "SCHEDULED";
    const courseSignature = useMemo(() => {
        if (!invoice?.courses?.length) return null;
        return invoice.courses
            .map((course) => {
                const id = course?.id != null ? course.id : course?.title ?? "unknown";
                const fee = Number.isFinite(Number(course?.fee))
                    ? Math.round(Number(course?.fee))
                    : 0;
                return `${id}:${fee}`;
            })
            .sort()
            .join("|");
    }, [invoice?.courses]);
    const autoAdjustTracker = useRef<Map<number, number>>(new Map());
    const previousCourseIdsRef = useRef<number[] | null>(null);
    const courseSignatureRef = useRef<string | null>(null);
    const [autoAdjustModal, setAutoAdjustModal] = useState<{ open: boolean; message: string }>({
        open: false,
        message: "",
    });
    const [internalView, setInternalView] = useState<"invoice" | "history">("invoice");
    const hasInvoice = Boolean(invoice);
    const hasHistory = completedHistory.length > 0;
    useEffect(() => {
        if (view) return;
        if (internalView === "invoice" && !hasInvoice && hasHistory) {
            setInternalView("history");
        }
    }, [view, internalView, hasInvoice, hasHistory]);

    const [detailState, setDetailState] = useState<DetailState>({ open: false });
    const [form, setForm] = useState<PaymentInvoiceUpdatePayload>(() => createEmptyInvoiceForm());
    const [isEditing, setIsEditing] = useState(false);
    const saveInFlight = useRef(false);
    const [invoiceEditState, setInvoiceEditState] = useState<InvoiceEditState>({ open: false });
    const [invoiceEditForm, setInvoiceEditForm] = useState<PaymentInvoiceUpdatePayload>(() =>
        createEmptyInvoiceForm(),
    );
    const [invoiceDiscountEnabled, setInvoiceDiscountEnabled] = useState(false);
    const [invoiceDiscountExpanded, setInvoiceDiscountExpanded] = useState(false);
    const [invoiceAdditionExpanded, setInvoiceAdditionExpanded] = useState(false);
    type AdditionalFieldState = {
        enabled: boolean;
        materialFee?: number;
        textbookFee?: number;
        startDate?: string;
        endDate?: string;
    };
    const createEmptyAdditionalFields = (): AdditionalFieldState => ({
        enabled: false,
        materialFee: undefined,
        textbookFee: undefined,
        startDate: "",
        endDate: "",
    });
    const [invoiceAdditionalFields, setInvoiceAdditionalFields] = useState<AdditionalFieldState>(
        createEmptyAdditionalFields(),
    );

    // View mode expanded states
    const [viewDiscountExpanded, setViewDiscountExpanded] = useState(false);
    const [viewAdditionExpanded, setViewAdditionExpanded] = useState(false);

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
    const mapAdditionalFieldsFromDetail = useCallback((detail: PaymentDetail): AdditionalFieldState => {
        const materialItem = detail.additionalItems?.find((item) => item?.type === "MATERIAL");
        const textbookItem = detail.additionalItems?.find((item) => item?.type === "TEXTBOOK");
        const materialFeeValue =
            typeof materialItem?.unitPrice === "number" ? materialItem.unitPrice : undefined;
        const textbookFeeValue =
            typeof textbookItem?.unitPrice === "number" ? textbookItem.unitPrice : undefined;
        const startDateValue = materialItem?.appliedStart ?? textbookItem?.appliedStart ?? detail.info.dueDate ?? "";
        const endDateValue = materialItem?.appliedEnd ?? textbookItem?.appliedEnd ?? detail.info.dueDate ?? "";
        const enabled = Boolean(
            (materialFeeValue && materialFeeValue > 0) || (textbookFeeValue && textbookFeeValue > 0),
        );
        return {
            enabled,
            materialFee: materialFeeValue,
            textbookFee: textbookFeeValue,
            startDate: startDateValue || "",
            endDate: endDateValue || "",
        };
    }, []);
    const updateInvoiceAdditionalFields = (partial: Partial<AdditionalFieldState>) => {
        setInvoiceAdditionalFields((prev) => {
            const next = { ...prev, ...partial };
            setInvoiceEditForm((prevForm) => ({
                ...prevForm,
                additionalItems: buildAdditionalItemsPayload(next),
            }));
            return next;
        });
    };
    const invoiceAdditionalTotal =
        (invoiceAdditionalFields.materialFee ?? 0) + (invoiceAdditionalFields.textbookFee ?? 0);
    const isDetailOpen = detailState.open;
    const detailVariant = isDetailOpen ? detailState.variant : undefined;
    const detailLoading = isDetailOpen ? detailState.loading : false;
    const detailData = isDetailOpen ? detailState.data : null;
    const resolvedDetailVariant: "invoice" | "history" = detailVariant ?? "invoice";
    const invoiceEditOpen = invoiceEditState.open;
    const invoiceEditLoading = invoiceEditOpen ? invoiceEditState.loading : false;
    const invoiceEditData = invoiceEditOpen ? invoiceEditState.data : null;
    const [cancelPrompt, setCancelPrompt] = useState<{ open: boolean; detail: PaymentDetail | null; reason: string }>({
        open: false,
        detail: null,
        reason: "",
    });
    const canCancelDetail =
        resolvedDetailVariant === "history" &&
        detailData?.info.status === "COMPLETED";

    const updateMutation = useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: PaymentInvoiceUpdatePayload }) =>
            updatePaymentInvoice(id, payload),
        onSuccess: () => {
            success("청구서를 업데이트했습니다.");
            invalidatePaymentsQueries(queryClient);
            onRefresh();
            setDetailState({ open: false });
            setInvoiceEditState({ open: false });
            setInvoiceEditForm(createEmptyInvoiceForm());
            setInvoiceDiscountEnabled(false);
            setIsEditing(false);
        },
        onError: (err: unknown) => toastError(readableError(err, "청구서 수정에 실패했습니다.")),
    });

    const cancelMutation = useMutation({
        mutationFn: ({ id, reason }: { id: number; reason?: string }) =>
            cancelPayment(id, reason ? { reason } : undefined),
        onSuccess: (detail: PaymentDetail) => {
            success("결제를 취소했습니다.");
            invalidatePaymentsQueries(queryClient);
            setDetailState((prev) =>
                prev.open && prev.id === detail.info.id ? { ...prev, data: detail, loading: false } : prev,
            );
            setCancelPrompt({ open: false, detail: null, reason: "" });
            onRefresh();
        },
        onError: (err: unknown) => toastError(readableError(err, "결제 취소에 실패했습니다.")),
    });

    useEffect(() => {
        if (!detailState.open || !detailState.loading) return;
        getPaymentDetail(detailState.id)
            .then((detail) => {
                setDetailState((prev) =>
                    prev.open && prev.id === detailState.id ? { ...prev, loading: false, data: detail } : prev,
                );
            })
            .catch((err) => {
                toastError(readableError(err, "결제 정보를 불러오지 못했습니다."));
                setDetailState({ open: false });
            });
    }, [detailState, toastError]);

    const handleCancelPayment = useCallback((detail: PaymentDetail) => {
        if (!detail?.info?.id) return;
        setCancelPrompt({ open: true, detail, reason: "" });
    }, []);

    useEffect(() => {
        if (!invoiceEditable || !invoice?.info?.id || courseSignature == null) {
            courseSignatureRef.current = courseSignature;
            return;
        }
        if (courseSignatureRef.current === null) {
            courseSignatureRef.current = courseSignature;
            return;
        }
        if (courseSignatureRef.current === courseSignature) return;
        courseSignatureRef.current = courseSignature;
        const paymentId = invoice.info.id;
        const targetAmount = normalizedRecommendedAmount;
        if (autoAdjustTracker.current.get(paymentId) === targetAmount) return;
        (async () => {
            try {
                await updatePaymentInvoice(paymentId, { amount: targetAmount });
                autoAdjustTracker.current.set(paymentId, targetAmount);
                invalidatePaymentsQueries(queryClient);
                onRefresh();
                setAutoAdjustModal({
                    open: true,
                    message:
                        targetAmount > normalizedInvoiceAmount
                            ? "새로 추가된 수업 또는 수업료 인상분을 반영해 청구 금액을 자동으로 조정했습니다. 청구서 발송 전 내용을 다시 확인해 주세요."
                            : "수업 삭제 또는 수업료 인하를 반영해 청구 금액을 자동으로 조정했습니다. 청구서 발송 전 내용을 다시 확인해 주세요.",
                });
            } catch (err) {
                autoAdjustTracker.current.delete(paymentId);
                toastError(readableError(err, "청구 금액 자동 조정에 실패했습니다."));
            }
        })();
    }, [
        invoiceEditable,
        invoice?.info?.id,
        courseSignature,
        normalizedRecommendedAmount,
        normalizedInvoiceAmount,
        queryClient,
        onRefresh,
        toastError,
    ]);

    useEffect(() => {
        if (!invoiceEditable || !invoice?.info?.id) {
            previousCourseIdsRef.current = normalizedCourseIds;
            return;
        }
        const prev = previousCourseIdsRef.current;
        const current = normalizedCourseIds;
        previousCourseIdsRef.current = current;
        if (!prev || prev.length === 0) {
            previousCourseIdsRef.current = current;
            return;
        }
        const signatureChanged =
            prev.length !== current.length ||
            prev.some((id, index) => id !== current[index]);
        if (!signatureChanged) return;
        const prevSet = new Set(prev);
        const currentSet = new Set(current);
        const added = current.filter((id) => !prevSet.has(id));
        const removed = prev.filter((id) => !currentSet.has(id));
        let message = "";
        if (added.length && !removed.length) {
            message = "수업에 학생이 추가되어 청구서에 자동 반영되었습니다. 발송 전 내용을 다시 확인해 주세요.";
        } else if (!added.length && removed.length) {
            message = "수업에서 학생을 제거하여 청구서에서 해당 수업이 제외되었습니다. 발송 전 다시 확인해 주세요.";
        } else {
            message = "수업 구성의 변경 내용이 청구서에 반영되었습니다. 발송 전 내용을 다시 확인해 주세요.";
        }
        setAutoAdjustModal({ open: true, message });
    }, [invoiceEditable, invoice?.info?.id, normalizedCourseIds]);

    const closeAutoAdjustModal = useCallback(() => {
        setAutoAdjustModal({ open: false, message: "" });
    }, []);

    useEffect(() => {
        if (!detailState.open || detailState.variant !== "invoice" || !detailState.data) return;
        const combinedMemo = combineMemoValues(
            detailState.data.info.memo,
            detailState.data.info.managerMemo,
        );
        setForm({
            dueDate: detailState.data.info.dueDate ?? "",
            periodStart: detailState.data.info.periodStart ?? "",
            periodEnd: detailState.data.info.periodEnd ?? "",
            amount: detailState.data.info.originalAmount ?? undefined,
            memo: combinedMemo,
            managerMemo: combinedMemo,
            discountType: detailState.data.info.discountType ?? undefined,
            discountValue: detailState.data.info.discountValue ?? undefined,
            cycleValue: detailState.data.schedule?.cycleValue ?? undefined,
            cycleUnit: detailState.data.schedule?.cycleUnit ?? "MONTHS",
        });
    }, [detailState]);

    useEffect(() => {
        if (!invoiceEditOpen || invoiceEditLoading || !invoiceEditData) return;
        const info = invoiceEditData.info;
        const combinedMemo = combineMemoValues(info.memo, info.managerMemo);
        const additionalFields = mapAdditionalFieldsFromDetail(invoiceEditData);
        setInvoiceAdditionalFields(additionalFields);
        setInvoiceEditForm({
            dueDate: info.dueDate ?? "",
            periodStart: info.periodStart ?? "",
            periodEnd: info.periodEnd ?? "",
            amount: info.originalAmount ?? undefined,
            memo: combinedMemo,
            managerMemo: combinedMemo,
            discountType: info.discountType ?? undefined,
            discountValue: info.discountValue ?? undefined,
            cycleValue: invoiceEditData.schedule?.cycleValue ?? undefined,
            cycleUnit: invoiceEditData.schedule?.cycleUnit ?? "MONTHS",
            additionalItems: buildAdditionalItemsPayload(additionalFields),
        });
        const discountApplied = Boolean(info.discountType && info.discountValue != null);
        setInvoiceDiscountEnabled(discountApplied);
        setInvoiceDiscountExpanded(discountApplied);
        setInvoiceAdditionExpanded(Boolean(additionalFields.enabled));
    }, [
        invoiceEditOpen,
        invoiceEditLoading,
        invoiceEditData,
        mapAdditionalFieldsFromDetail,
        buildAdditionalItemsPayload,
    ]);

    // Initialize view mode expanded states based on invoice data
    useEffect(() => {
        if (!invoice) return;
        const info = invoice.info;
        const hasDiscount = Boolean(info.discountType && info.discountValue != null);
        
        const additionalFields = mapAdditionalFieldsFromDetail(invoice);
        const hasAdditional = additionalFields.enabled;

        setViewDiscountExpanded(hasDiscount);
        setViewAdditionExpanded(hasAdditional);
    }, [invoice, mapAdditionalFieldsFromDetail]);


    useEffect(() => {
        if (!isEditing) {
            saveInFlight.current = false;
            return;
        }
        if (updateMutation.isPending) {
            saveInFlight.current = true;
            return;
        }
        if (!updateMutation.isPending && saveInFlight.current) {
            saveInFlight.current = false;
            setIsEditing(false);
        }
    }, [updateMutation.isPending, isEditing]);

    if (!studentId) return null;

    const openDetail = (id: number, variant: "invoice" | "history") => {
        setDetailState({ open: true, id, variant, loading: true, data: null });
    };

    const closeDetail = () => {
        if (updateMutation.isPending) return;
        setDetailState({ open: false });
        setIsEditing(false);
    };

    const handleSave = () => {
        if (!detailState.open || detailState.variant !== "invoice") return;
        updateMutation.mutate({ id: detailState.id, payload: form });
    };

    const openInvoiceEditModal = () => {
        if (!invoice) return;
        setInvoiceEditState({ open: true, loading: true, data: null });
        getPaymentDetail(invoice.info.id)
            .then((detail) => {
                setInvoiceEditState((prev) => (prev.open ? { open: true, loading: false, data: detail } : prev));
            })
            .catch((err) => {
                toastError(readableError(err, "청구서를 불러오지 못했습니다."));
                setInvoiceEditState({ open: false });
            });
    };

    const closeInvoiceEditModal = () => {
        if (updateMutation.isPending) return;
        setInvoiceEditState({ open: false });
        setInvoiceEditForm(createEmptyInvoiceForm());
        setInvoiceDiscountEnabled(false);
        setInvoiceDiscountExpanded(false);
        setInvoiceAdditionExpanded(false);
        setInvoiceAdditionalFields(createEmptyAdditionalFields());
    };

    const handleInvoiceEditSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!invoice) return;
        const payload: PaymentInvoiceUpdatePayload = {
            dueDate: invoiceEditForm.dueDate || undefined,
            periodStart: invoiceEditForm.periodStart || undefined,
            periodEnd: invoiceEditForm.periodEnd || undefined,
            amount: invoiceEditForm.amount,
            memo: invoiceEditForm.memo ?? "",
            managerMemo: invoiceEditForm.managerMemo ?? "",
            discountType: invoiceDiscountEnabled ? invoiceEditForm.discountType : undefined,
            discountValue: invoiceDiscountEnabled ? invoiceEditForm.discountValue : undefined,
            cycleValue: invoiceEditForm.cycleValue,
            cycleUnit: invoiceEditForm.cycleUnit ?? invoiceEditData?.schedule?.cycleUnit ?? "MONTHS",
            additionalItems: invoiceEditForm.additionalItems,
        };
        updateMutation.mutate({ id: invoice.info.id, payload });
    };

    const parseCurrencyInput = (raw: string): number | undefined => {
        const digits = raw.replace(/[^0-9]/g, "");
        if (!digits) return undefined;
        const parsed = Number(digits);
        return Number.isNaN(parsed) ? undefined : parsed;
    };
    const formatCurrencyInput = (value?: number | null): string => {
        if (value == null || Number.isNaN(value)) return "";
        return formatMoney(value);
    };
    const invoiceEditBaseAmount =
        typeof invoiceEditForm.amount === "number"
            ? invoiceEditForm.amount
            : invoiceEditOpen && invoiceEditData
                ? invoiceEditData.info.originalAmount ?? 0
                : 0;

    const invoiceEditFinalAmount = computeFinalAmount(
        invoiceEditBaseAmount,
        invoiceDiscountEnabled ? invoiceEditForm.discountType : undefined,
        invoiceDiscountEnabled ? invoiceEditForm.discountValue : undefined,
    );
    const resolvedView = view ?? internalView;
    const viewingInvoice = resolvedView === "invoice";

    const changeView = (next: "invoice" | "history") => {
        if (!view) {
            setInternalView(next);
        }
    };

    const headerNode = showTabs ? (
        <HeaderRow>
            <Tabs>
                <TabButton
                    type="button"
                    data-active={viewingInvoice}
                    onClick={() => changeView("invoice")}
                >
                    청구서
                </TabButton>
                <TabButton
                    type="button"
                    data-active={!viewingInvoice}
                    onClick={() => changeView("history")}
                >
                    결제 내역
                </TabButton>
            </Tabs>
            {viewingInvoice && invoice ? (
                <PrimaryButton type="button" onClick={openInvoiceEditModal}>
                    수정
                </PrimaryButton>
            ) : null}
        </HeaderRow>
    ) : viewingInvoice && invoice ? (
        <HeaderRow>
            <span />
            <PrimaryButton type="button" onClick={openInvoiceEditModal}>
                수정
            </PrimaryButton>
        </HeaderRow>
    ) : null;

    const bodyContent = viewingInvoice ? (
                <InvoiceColumn>
                    {!loading && error ? <ErrorText>{error}</ErrorText> : null}
                    {loading ? (
                        <Skeleton h={160} />
                    ) : invoice ? (
                        <InvoiceForm>
                            <label>
                                <span>결제 예정일</span>
                                <input type="date" value={invoice.info.dueDate ?? ""} disabled />
                            </label>
                            <label>
                                <span>수강 금액</span>
                                <input type="text" value={formatMoney(invoice.info.originalAmount ?? 0)} disabled />
                            </label>
                            <CollapsibleSection>
                                <CollapsibleHeader
                                    type="button"
                                    onClick={() => setViewDiscountExpanded((prev) => !prev)}
                                >
                                    <span>할인 설정</span>
                                    <CaretIcon $open={viewDiscountExpanded} />
                                </CollapsibleHeader>
                                {viewDiscountExpanded ? (
                                    <CollapsibleBody>
                                        <DiscountFields
                                            enabled={Boolean(invoice.info.discountType && invoice.info.discountValue != null)}
                                            discountType={invoice.info.discountType ?? undefined}
                                            discountValue={invoice.info.discountValue ?? undefined}
                                            onToggleEnabled={() => {}}
                                            onChangeType={() => {}}
                                            onChangeValue={() => {}}
                                            onChangeStartDate={() => {}}
                                            onChangeEndDate={() => {}}
                                            showPeriod={false}
                                            disabled={true}
                                        />
                                    </CollapsibleBody>
                                ) : null}
                            </CollapsibleSection>

                            <CollapsibleSection>
                                <CollapsibleHeader
                                    type="button"
                                    onClick={() => setViewAdditionExpanded((prev) => !prev)}
                                >
                                    <span>추가 금액 설정</span>
                                    <CaretIcon $open={viewAdditionExpanded} />
                                </CollapsibleHeader>
                                {viewAdditionExpanded ? (
                                    <CollapsibleBody>
                                        {(() => {
                                            const fields = mapAdditionalFieldsFromDetail(invoice);
                                            const total = (fields.materialFee ?? 0) + (fields.textbookFee ?? 0);
                                            return (
                                                <>
                                                    <AdditionalChargeFields
                                                        enabled={fields.enabled}
                                                        materialFee={fields.materialFee}
                                                        textbookFee={fields.textbookFee}
                                                        startDate={fields.startDate}
                                                        endDate={fields.endDate}
                                                        onToggleEnabled={() => {}}
                                                        onChangeMaterialFee={() => {}}
                                                        onChangeTextbookFee={() => {}}
                                                        onChangeStartDate={() => {}}
                                                        onChangeEndDate={() => {}}
                                                        showTitle={false}
                                                        disabled={true}
                                                    />
                                                    {fields.enabled ? (
                                                        <AdditionalFooter>
                                                            <span>추가 금액 합계</span>
                                                            <strong>{formatMoney(total)}</strong>
                                                        </AdditionalFooter>
                                                    ) : null}
                                                </>
                                            );
                                        })()}
                                    </CollapsibleBody>
                                ) : null}
                            </CollapsibleSection>
                            <label>
                                <span>최종 금액</span>
                                <input
                                    type="text"
                                    value={formatMoney(invoice.info.finalAmount ?? invoice.info.originalAmount ?? 0)}
                                    disabled
                                />
                            </label>
                            <label>
                                <span>메모</span>
                                <textarea value={combineMemoValues(invoice.info.memo, invoice.info.managerMemo)} disabled />
                            </label>
                        </InvoiceForm>
                    ) : (
                        <EmptyState>진행 중인 청구서가 없습니다.</EmptyState>
                    )}
                </InvoiceColumn>
            ) : (
                <HistoryColumn>
                    {error ? <ErrorText>{error}</ErrorText> : null}
                    {loading ? (
                        <Skeleton h={160} />
                    ) : completedHistory.length === 0 ? (
                        <EmptyState>결제 내역이 없습니다.</EmptyState>
                    ) : (
                        <TableWrapper>
                            <HistoryTable>
                                <colgroup>
                                    <col style={{ width: "15%" }} />
                                    <col style={{ width: "25%" }} />
                                    <col style={{ width: "15%" }} />
                                    <col style={{ width: "25%" }} />
                                    <col />
                                </colgroup>
                                <thead>
                                <tr>
                                    <th>번호</th>
                                    <th>총 결제 금액</th>
                                    <th>상태</th>
                                    <th>결제 완료일</th>
                                    <th>결제 수단</th>
                                </tr>
                                </thead>
                                <tbody>
                                {completedHistory.map((row, index) => (
                                    <tr key={row.id} onClick={() => openDetail(row.id, "history")}>
                                        <td>{completedHistory.length - index}</td>
                                        <td>{formatMoney(row.finalAmount)}</td>
                                        <td>
                                            <StatusBadge status={row.status}>{statusLabel[row.status] ?? row.status}</StatusBadge>
                                        </td>
                                        <td>
                                            {row.completedAt
                                                ? formatKoreanDate(row.completedAt, { includeWeekday: false })
                                                : "-"}
                                        </td>
                                        <td>{getPaymentMethodDisplay(row.paymentMethod, row.paymentType)}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </HistoryTable>
                        </TableWrapper>
                    )}
                </HistoryColumn>
            );

    const content = (
        <>
            {headerNode}
            {bodyContent}

            {resolvedDetailVariant === "invoice" ? (
                <Modal
                    open={isDetailOpen}
                    onClose={closeDetail}
                    title="청구서 상세"
                    maxWidth={720}
                    blockOutsideClose={isEditing}
                >
                {isDetailOpen && detailLoading ? <Skeleton h={200} /> : null}
                {!detailLoading && detailData ? (
                    <DetailLayout>
                        <DetailColumn>
                            <SectionHeading>학생 정보</SectionHeading>
                            {resolvedDetailVariant === "invoice" ? (
                                <DetailList>
                                    <li>
                                        <span>이름</span>
                                        <strong>{detailData.student.name}</strong>
                                    </li>
                                    <li>
                                        <span>학생 코드</span>
                                        <strong>{detailData.student.code ?? "-"}</strong>
                                    </li>
                                    <li>
                                        <span>연락처</span>
                                        <strong>{detailData.student.phoneNumber ?? "-"}</strong>
                                    </li>
                                    <li>
                                        <span>보호자</span>
                                        <strong>{detailData.student.guardianPhone ?? "-"}</strong>
                                    </li>
                                </DetailList>
                            ) : (
                                <InfoCard>
                                    <InfoRow>
                                        <span>이름</span>
                                        <strong>{detailData.student.name}</strong>
                                    </InfoRow>
                                    <InfoRow>
                                        <span>코드</span>
                                        <strong>{detailData.student.code ?? "-"}</strong>
                                    </InfoRow>
                                    <InfoRow>
                                        <span>등록일</span>
                                        <strong>
                                            {detailData.student.joinedDate
                                                ? formatKoreanDate(detailData.student.joinedDate, { includeWeekday: false })
                                                : "-"}
                                        </strong>
                                    </InfoRow>
                                    <InfoRow>
                                        <span>연락처</span>
                                        <strong>{detailData.student.phoneNumber ?? "-"}</strong>
                                    </InfoRow>
                                </InfoCard>
                            )}
                            <SectionHeading>수강 과목</SectionHeading>
                            <CourseList>
                                {resolveCourseRows(detailData).map((course, index) => (
                                    <li key={`${course?.id ?? "course"}-${index}`}>
                                        <div className="info">
                                            <strong>{course?.title ?? "-"}</strong>
                                            {course?.code ? <span className="code">{course.code}</span> : null}
                                        </div>
                                        <span className="fee">{formatMoney(Number(course?.fee ?? 0))}</span>
                                    </li>
                                ))}
                            </CourseList>
                        </DetailColumn>
                        <DetailColumn>
                            {resolvedDetailVariant === "invoice" ? (
                                <form
                                    onSubmit={(event) => {
                                        event.preventDefault();
                                        handleSave();
                                    }}
                                >
                                    <SectionHeading>청구 정보</SectionHeading>
                                    <EditFormGrid>
                                        <label className="full-row">
                                            결제 예정일
                                            <Input
                                                type="date"
                                                disabled={!isEditing}
                                                value={form.dueDate ?? ""}
                                                onChange={(event) =>
                                                    setForm((prev) => ({ ...prev, dueDate: event.target.value }))
                                                }
                                            />
                                        </label>
                                        <div className="period-grid">
                                            <label>
                                                청구 기간 시작
                                                <Input
                                                    type="date"
                                                    disabled={!isEditing}
                                                    value={form.periodStart ?? detailData.info.periodStart ?? ""}
                                                    onChange={(event) => {
                                                        const nextStart = event.target.value;
                                                        setForm((prev) => {
                                                            const activeCycle =
                                                                prev.cycleValue ?? detailData.schedule?.cycleValue ?? null;
                                                            const nextPeriodEnd = computePeriodEndByCycle(nextStart, activeCycle);
                                                            return {
                                                                ...prev,
                                                                periodStart: nextStart,
                                                                periodEnd: nextPeriodEnd ?? prev.periodEnd,
                                                            };
                                                        });
                                                    }}
                                                />
                                            </label>
                                            <label>
                                                청구 기간 종료
                                                <Input
                                                    type="date"
                                                    disabled={!isEditing}
                                                    value={form.periodEnd ?? detailData.info.periodEnd ?? ""}
                                                    onChange={(event) =>
                                                        setForm((prev) => ({ ...prev, periodEnd: event.target.value }))
                                                    }
                                                />
                                            </label>
                                        </div>
                                        <div className="period-grid">
                                            <label>
                                                청구 금액
                                                <Input
                                                    type="text"
                                                    inputMode="numeric"
                                                    disabled={!isEditing}
                                                    value={
                                                        isEditing
                                                            ? String(form.amount ?? detailData.info.originalAmount ?? "")
                                                            : formatMoney(form.amount ?? detailData.info.originalAmount ?? 0)
                                                    }
                                                    onChange={(event) =>
                                                        setForm((prev) => ({
                                                            ...prev,
                                                            amount: parseNumericInput(event.target.value),
                                                        }))
                                                    }
                                                />
                                            </label>
                                            <label>
                                                결제 주기 (개월)
                                                <Input
                                                    type={isEditing ? "number" : "text"}
                                                    min={1}
                                                    disabled={!isEditing}
                                                    value={
                                                        isEditing
                                                            ? String(
                                                                form.cycleValue ??
                                                                detailData.schedule?.cycleValue ??
                                                                "",
                                                            )
                                                            : formatCycleLabelFromSchedule(detailData)
                                                    }
                                                    onChange={(event) => {
                                                        const nextCycle = parseCycleInput(event.target.value);
                                                        setForm((prev) => {
                                                            const baseStart =
                                                                prev.periodStart ??
                                                                detailData.info.periodStart ??
                                                                "";
                                                            const nextPeriodEnd =
                                                                nextCycle && baseStart ? computePeriodEndByCycle(baseStart, nextCycle) : undefined;
                                                            return {
                                                                ...prev,
                                                                cycleValue: nextCycle,
                                                                periodEnd: nextPeriodEnd ?? prev.periodEnd,
                                                            };
                                                        });
                                                    }}
                                                />
                                            </label>
                                        </div>
                                    </EditFormGrid>
                                    <DiscountSection>
                                        <DiscountFields
                                            enabled={Boolean(form.discountType)}
                                            discountType={form.discountType ?? undefined}
                                            discountValue={form.discountValue}
                                            onToggleEnabled={(next) => {
                                                if (!isEditing) return;
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
                                    </DiscountSection>
                                    <label>
                                        메모
                                        <Textarea
                                            disabled={!isEditing}
                                            value={resolveMemoValue(form.memo, form.managerMemo)}
                                            onChange={(event) => {
                                                const nextValue = event.target.value;
                                                setForm((prev) => ({ ...prev, memo: nextValue, managerMemo: nextValue }));
                                            }}
                                        />
                                    </label>
                                    <ModalActions>
                                        {isEditing ? (
                                            <>
                                                <PrimaryButton type="submit" disabled={updateMutation.isPending}>
                                                    {updateMutation.isPending ? "저장 중..." : "저장"}
                                                </PrimaryButton>
                                                <GhostButton
                                                    type="button"
                                                    onClick={detailVariant === "invoice" && isEditing ? undefined : closeDetail}
                                                >
                                                    닫기
                                                </GhostButton>
                                            </>
                                        ) : (
                                            <>
                                                <PrimaryButton type="button" onClick={() => setIsEditing(true)}>
                                                    수정
                                                </PrimaryButton>
                                                <GhostButton type="button" onClick={closeDetail}>
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
                                        (detailData.info.originalAmount ?? 0) -
                                        (detailData.info.finalAmount ?? 0),
                                    );
                                    const discountDisplay = discountAmount ? formatMoney(discountAmount) : "—";
                                    const methodDisplay = getPaymentMethodDisplay(
                                        detailData.info.paymentMethod,
                                        detailData.info.paymentType,
                                    );
                                    const completedText = detailData.info.completedAt
                                        ? formatKoreanDateTimeKST(detailData.info.completedAt, {
                                            includeWeekday: true,
                                            showSeconds: true,
                                        })
                                        : "-";
                                    const canceledText = detailData.info.canceledAt
                                        ? formatKoreanDateTimeKST(detailData.info.canceledAt, {
                                            includeWeekday: true,
                                            showSeconds: true,
                                        })
                                        : "-";
                                    const approvalNumber =
                                        detailData.info.approvalNumber?.trim() || "-";
                                    const statusText =
                                        statusLabel[detailData.info.status] ?? detailData.info.status;
                                    const nextDueText = computeNextDueDateLabel(detailData);

                                    return (
                                        <div>
                                            <SectionHeading>상세 정보</SectionHeading>
                                            <DetailInfoCard>
                                                <DetailInfoRows>
                                                    <li>
                                                        <span>수강 금액</span>
                                                        <strong>{formatMoney(detailData.info.originalAmount ?? 0)}</strong>
                                                    </li>
                                                    <li>
                                                        <span>할인</span>
                                                        <strong>{discountDisplay}</strong>
                                                    </li>
                                                    <li>
                                                        <span>최종 결제금액</span>
                                                        <strong>{formatMoney(detailData.info.finalAmount ?? 0)}</strong>
                                                    </li>
                                                    <li>
                                                        <span>결제 수단</span>
                                                        <strong>{methodDisplay}</strong>
                                                    </li>
                                                    <li>
                                                        <span>결제 주기</span>
                                                        <strong>{getCycleLabel(detailData, resolvedDetailVariant)}</strong>
                                                    </li>
                                                   <li>
                                                       <span>결제 시간</span>
                                                       <strong>{completedText}</strong>
                                                   </li>
                                                    {detailData.info.status === "CANCELED" ? (
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
                                            <SectionHeading>메모</SectionHeading>
                                            <Paragraph>
                                                {combineMemoValues(detailData.info.memo, detailData.info.managerMemo) ||
                                                    "메모가 없습니다."}
                                            </Paragraph>
                                            <ModalActions>
                                                <PrimaryButton type="button" onClick={closeDetail}>
                                                    확인
                                                </PrimaryButton>
                                                {canCancelDetail && detailData ? (
                                                    <GhostButton
                                                        type="button"
                                                        data-variant="danger"
                                                        onClick={() => handleCancelPayment(detailData)}
                                                        disabled={cancelMutation.isPending}
                                                    >
                                                        {cancelMutation.isPending ? "취소 중..." : "결제 취소"}
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
            ) : (
                <PaymentDetailModal
                    open={isDetailOpen}
                    onClose={closeDetail}
                    paymentId={isDetailOpen ? detailState.id : null}
                    variant="history"
                    onCancelPayment={handleCancelPayment}
                    cancelPending={cancelMutation.isPending}
                />
            )}

            <Modal
                open={invoiceEditOpen}
                onClose={updateMutation.isPending ? undefined : closeInvoiceEditModal}
                blockOutsideClose={updateMutation.isPending}
                title="청구서 수정"
                maxWidth={640}
            >
                {invoiceEditOpen && invoiceEditLoading ? <Skeleton h={200} /> : null}
                {invoiceEditOpen && !invoiceEditLoading && invoiceEditData ? (
                    <form onSubmit={handleInvoiceEditSubmit}>
                        <SectionHeading>결제 상세 설정</SectionHeading>
                        <EditFormGrid>
                            <label className="full-row">
                                결제 예정일
                                <Input
                                    type="date"
                                    value={invoiceEditForm.dueDate ?? ""}
                                    onChange={(event) =>
                                        setInvoiceEditForm((prev) => ({ ...prev, dueDate: event.target.value }))
                                    }
                                />
                            </label>
                            <div className="period-grid">
                                <label>
                                    청구 기간 시작
                                    <Input
                                        type="date"
                                        value={invoiceEditForm.periodStart ?? ""}
                                        onChange={(event) => {
                                            const nextStart = event.target.value;
                                            setInvoiceEditForm((prev) => {
                                                const activeCycle =
                                                    prev.cycleValue ??
                                                    invoiceEditData.schedule?.cycleValue ??
                                                    null;
                                                const nextPeriodEnd = computePeriodEndByCycle(nextStart, activeCycle);
                                                return {
                                                    ...prev,
                                                    periodStart: nextStart,
                                                    periodEnd: nextPeriodEnd ?? prev.periodEnd,
                                                };
                                            });
                                        }}
                                    />
                                </label>
                                <label>
                                    청구 기간 종료
                                    <Input
                                        type="date"
                                        value={invoiceEditForm.periodEnd ?? ""}
                                        onChange={(event) =>
                                            setInvoiceEditForm((prev) => ({ ...prev, periodEnd: event.target.value }))
                                        }
                                    />
                                </label>
                            </div>
                            <div className="period-grid">
                                <label>
                                    청구 금액
                                    <Input
                                        type="text"
                                        inputMode="numeric"
                                        value={
                                            typeof invoiceEditForm.amount === "number"
                                                ? formatCurrencyInput(invoiceEditForm.amount)
                                                : formatCurrencyInput(invoiceEditData.info.originalAmount ?? 0)
                                        }
                                        onChange={(event) =>
                                            setInvoiceEditForm((prev) => ({
                                                ...prev,
                                                amount: parseCurrencyInput(event.target.value),
                                            }))
                                        }
                                    />
                                </label>
                                <label>
                                    결제 주기 (개월)
                                    <Input
                                        type="number"
                                        min={1}
                                        value={
                                            invoiceEditForm.cycleValue ??
                                            invoiceEditData.schedule?.cycleValue ??
                                            ""
                                        }
                                        onChange={(event) => {
                                            const nextCycle = parseCycleInput(event.target.value);
                                            setInvoiceEditForm((prev) => {
                                                const baseStart =
                                                    prev.periodStart ??
                                                    invoiceEditData.info.periodStart ??
                                                    "";
                                                const nextPeriodEnd =
                                                    nextCycle && baseStart
                                                        ? computePeriodEndByCycle(baseStart, nextCycle)
                                                        : undefined;
                                                return {
                                                    ...prev,
                                                    cycleValue: nextCycle,
                                                    periodEnd: nextPeriodEnd ?? prev.periodEnd,
                                                };
                                            });
                                        }}
                                    />
                                </label>
                            </div>
                        </EditFormGrid>
                        <CollapsibleSection>
                            <CollapsibleHeader
                                type="button"
                                onClick={() => setInvoiceDiscountExpanded((prev) => !prev)}
                            >
                                <span>할인 설정</span>
                                <CaretIcon $open={invoiceDiscountExpanded} />
                            </CollapsibleHeader>
                            {invoiceDiscountExpanded ? (
                                <CollapsibleBody>
                                    <DiscountFields
                                        enabled={Boolean(invoiceDiscountEnabled)}
                                        discountType={
                                            invoiceEditForm.discountType ??
                                            invoiceEditData.info.discountType ??
                                            undefined
                                        }
                                        discountValue={
                                            typeof invoiceEditForm.discountValue === "number"
                                                ? invoiceEditForm.discountValue
                                                : invoiceEditData.info.discountValue
                                        }
                                        onToggleEnabled={(next) => {
                                            setInvoiceDiscountEnabled(next);
                                            setInvoiceEditForm((prev) => ({
                                                ...prev,
                                                discountType: next ? prev.discountType : undefined,
                                                discountValue: next ? prev.discountValue : undefined,
                                            }));
                                        }}
                                        onChangeType={(next) =>
                                            setInvoiceEditForm((prev) => ({
                                                ...prev,
                                                discountType: next,
                                            }))
                                        }
                                        onChangeValue={(value) =>
                                            setInvoiceEditForm((prev) => ({
                                                ...prev,
                                                discountValue: typeof value === "number" ? value : undefined,
                                            }))
                                        }
                                        onChangeStartDate={(value) =>
                                            setInvoiceEditForm((prev) => ({
                                                ...prev,
                                                discountStartDate: value || undefined,
                                            }))
                                        }
                                        onChangeEndDate={(value) =>
                                            setInvoiceEditForm((prev) => ({
                                                ...prev,
                                                discountEndDate: value || undefined,
                                            }))
                                        }
                                        showPeriod
                                    />
                                </CollapsibleBody>
                            ) : null}
                        </CollapsibleSection>
                        <CollapsibleSection>
                            <CollapsibleHeader
                                type="button"
                                onClick={() => setInvoiceAdditionExpanded((prev) => !prev)}
                            >
                                <span>추가 금액 설정</span>
                                <CaretIcon $open={invoiceAdditionExpanded} />
                            </CollapsibleHeader>
                            {invoiceAdditionExpanded ? (
                                <CollapsibleBody>
                                    <AdditionalChargeFields
                                        enabled={Boolean(invoiceAdditionalFields.enabled)}
                                        materialFee={invoiceAdditionalFields.materialFee}
                                        textbookFee={invoiceAdditionalFields.textbookFee}
                                        startDate={invoiceAdditionalFields.startDate}
                                        endDate={invoiceAdditionalFields.endDate}
                                        onToggleEnabled={(next) => {
                                            updateInvoiceAdditionalFields({ enabled: next });
                                            if (!next) {
                                                updateInvoiceAdditionalFields({
                                                    materialFee: undefined,
                                                    textbookFee: undefined,
                                                    startDate: undefined,
                                                    endDate: undefined,
                                                });
                                            }
                                        }}
                                        onChangeMaterialFee={(value) =>
                                            updateInvoiceAdditionalFields({
                                                materialFee: typeof value === "number" ? value : undefined,
                                            })
                                        }
                                        onChangeTextbookFee={(value) =>
                                            updateInvoiceAdditionalFields({
                                                textbookFee: typeof value === "number" ? value : undefined,
                                            })
                                        }
                                        onChangeStartDate={(value) => updateInvoiceAdditionalFields({ startDate: value })}
                                        onChangeEndDate={(value) => updateInvoiceAdditionalFields({ endDate: value })}
                                        showTitle={false}
                                    />
                                    {invoiceAdditionalFields.enabled ? (
                                        <AdditionalFooter>
                                            <span>추가 금액 합계</span>
                                            <strong>{formatMoney(invoiceAdditionalTotal)}</strong>
                                        </AdditionalFooter>
                                    ) : null}
                                </CollapsibleBody>
                            ) : null}
                        </CollapsibleSection>
                        <FinalAmountBox>
                            <span>최종 금액</span>
                            <strong>{formatMoney(invoiceEditFinalAmount)}</strong>
                        </FinalAmountBox>
                        <label>
                            메모
                            <Textarea
                                value={resolveMemoValue(invoiceEditForm.memo, invoiceEditForm.managerMemo)}
                                onChange={(event) => {
                                    const nextValue = event.target.value;
                                    setInvoiceEditForm((prev) => ({
                                        ...prev,
                                        memo: nextValue,
                                        managerMemo: nextValue,
                                    }));
                                }}
                            />
                        </label>
                        <ModalActions>
                            <PrimaryButton type="submit" disabled={updateMutation.isPending}>
                                {updateMutation.isPending ? "저장 중..." : "저장"}
                            </PrimaryButton>
                            <GhostButton
                                type="button"
                                onClick={closeInvoiceEditModal}
                                disabled={updateMutation.isPending}
                            >
                                취소
                            </GhostButton>
                        </ModalActions>
                    </form>
                ) : null}
            </Modal>
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
                                setCancelPrompt((prev) => ({
                                    ...prev,
                                    reason: event.target.value.slice(0, 80),
                                }))
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
            <Modal
                open={autoAdjustModal.open}
                onClose={closeAutoAdjustModal}
                title="청구 금액 자동 조정 안내"
                maxWidth={520}
            >
                <AutoAdjustBody>
                    <p>{autoAdjustModal.message}</p>
                </AutoAdjustBody>
                <ModalActions>
                    <PrimaryButton type="button" onClick={closeAutoAdjustModal}>
                        확인했습니다
                    </PrimaryButton>
                </ModalActions>
            </Modal>
        </>
    );

    return withinCard ? <Card>{content}</Card> : content;
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

function parseNumericInput(raw: string): number | undefined {
    const digits = raw.replace(/[^0-9]/g, "");
    if (!digits) return undefined;
    const parsed = Number(digits);
    return Number.isNaN(parsed) ? undefined : parsed;
}

function computeFinalAmount(
    amount?: number,
    discountType?: DiscountType,
    discountValue?: number,
): number {
    const base = typeof amount === "number" && !Number.isNaN(amount) ? amount : 0;
    if (!discountType || discountValue == null || Number.isNaN(discountValue)) {
        return base;
    }
    if (discountType === "PERCENT") {
        const percent = Math.max(0, discountValue);
        return Math.max(0, Math.round(base - (base * percent) / 100));
    }
    return Math.max(0, Math.round(base - discountValue));
}

function getPaymentMethodDisplay(method?: PaymentMethod | null, type?: PaymentType | null): string {
    const methodText = method ? methodLabel[method] ?? method : null;
    const typeText = type ? paymentTypeLabel[type] ?? type : null;
    return [typeText, methodText].filter(Boolean).join(" / ") || "-";
}

type CourseRow = {
    id?: number | null;
    title?: string | null;
    code?: string | null;
    fee?: number | null;
};

function resolveCourseRows(detail: PaymentDetail): CourseRow[] {
    if (detail.courses && detail.courses.length) {
        return detail.courses;
    }
    const fallback = [detail.course, detail.info.course].filter(
        (course): course is NonNullable<typeof course> => Boolean(course),
    );
    if (fallback.length) return fallback;
    return [
        {
            id: 0,
            title: "수강 과목 정보가 없습니다.",
            code: "",
            fee: detail.info.originalAmount ?? 0,
        },
    ];
}

function computeNextDueDateLabel(detail: PaymentDetail): string {
    const dueDate = detail.info.dueDate;
    const cycleValue = detail.schedule?.cycleValue;
    const unit = detail.schedule?.cycleUnit ?? "MONTHS";
    if (!dueDate || !cycleValue) return "-";
    const base = new Date(dueDate);
    if (Number.isNaN(base.getTime())) return "-";
    const next = new Date(base);
    if (unit === "MONTHS") {
        next.setMonth(next.getMonth() + cycleValue);
    } else if (unit === "WEEKS") {
        next.setDate(next.getDate() + cycleValue * 7);
    } else if (unit === "DAYS") {
        next.setDate(next.getDate() + cycleValue);
    } else {
        return "-";
    }
    return formatKoreanDate(next, { includeWeekday: false });
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
    if (!value) return "-";
    const unitLabel = unit === "MONTHS" ? "개월" : unit === "WEEKS" ? "주" : unit === "DAYS" ? "일" : "";
    return `${value}${unitLabel}`;
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

function computePeriodEndByCycle(periodStart?: string | null, cycleValue?: number | null): string | undefined {
    if (!periodStart || !cycleValue || cycleValue <= 0) return undefined;
    const base = new Date(`${periodStart}T00:00:00`);
    if (Number.isNaN(base.getTime())) return undefined;
    const next = new Date(base);
    next.setMonth(next.getMonth() + cycleValue);
    return formatAsDateInput(next);
}

function formatAsDateInput(date: Date): string {
    const offset = date.getTimezoneOffset();
    const local = new Date(date.getTime() - offset * 60000);
    return local.toISOString().slice(0, 10);
}

function parseCycleInput(raw: string): number | undefined {
    if (!raw) return undefined;
    const numeric = Number(raw);
    if (!Number.isFinite(numeric) || numeric <= 0) return undefined;
    return Math.max(1, Math.round(numeric));
}

const InvoiceColumn = styled.div`
  display: grid;
  gap: 12px;
`;

const EditFormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px 16px;
  margin-bottom: 16px;
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

const DiscountSection = styled.div`
  display: grid;
  gap: 12px;
  margin-bottom: 16px;
`;

const AdditionalFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  color: ${(p) => p.theme.colors.text};
  span {
    color: ${(p) => p.theme.colors.textMuted};
  }
  strong {
    font-size: 16px;
  }
`;

const CollapsibleSection = styled.div`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.md};
  margin-bottom: 16px;
  background: ${(p) => p.theme.colors.surfaceAlt ?? "#f9fafb"};
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
  border-top: 1px solid ${(p) => p.theme.colors.border};
  padding: 12px 16px;
`;

const CaretIcon = styled.span<{ $open: boolean }>`
  border: solid currentColor;
  border-width: 0 2px 2px 0;
  display: inline-block;
  padding: 4px;
  transform: rotate(${(p) => (p.$open ? "45deg" : "-45deg")});
  transition: transform 120ms ease;
`;

const FinalAmountBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.md};
  margin-bottom: 16px;
  span {
    font-size: 13px;
    color: ${(p) => p.theme.colors.textMuted};
  }
  strong {
    font-size: 18px;
    color: ${(p) => p.theme.colors.text};
  }
`;

const HistoryColumn = styled.div`
  display: grid;
  gap: 12px;
  align-content: start;
`;

const InfoCard = styled.div`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.md};
  padding: 16px;
  display: grid;
  gap: 10px;
  background: ${(p) => p.theme.colors.surfaceAlt ?? "#f9fafb"};
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  span {
    color: ${(p) => p.theme.colors.textMuted};
  }
  strong {
    color: ${(p) => p.theme.colors.text};
  }
`;

const DetailInfoCard = styled.div`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.md};
  padding: 16px;
  background: ${(p) => p.theme.colors.surfaceAlt ?? "#f9fafb"};
`;

const DetailInfoRows = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 10px;
  li {
    display: flex;
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

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

const InvoiceForm = styled.div`
  display: grid;
  gap: 12px;
  ${CollapsibleSection} {
    margin-bottom: 0;
  }
  label {
    display: grid;
    gap: 6px;
    font-size: 13px;
    color: ${(p) => p.theme.colors.textMuted};
  }
  input,
  textarea {
    border: 1px solid ${(p) => p.theme.colors.border};
    border-radius: 8px;
    padding: 8px 10px;
    font-size: 14px;
    background: ${(p) => p.theme.colors.surfaceAlt ?? "#f9fafb"};
  }
  textarea {
    min-height: 60px;
    resize: vertical;
  }
`;

const TableWrapper = styled.div`
  overflow-x: auto;
`;

const HistoryTable = styled(TableBase)`
  tbody tr {
    cursor: pointer;
  }
  thead th {
    text-align: center;
  }
  th,
  td {
    text-align: center;
  }
  tbody td {
    vertical-align: middle;
  }
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  background: ${({ status }) => (statusColor[status] ?? "#d1d5db")}1A;
  color: ${({ status }) => statusColor[status] ?? "#52525b"};
`;

const methodLabel: Record<string, string> = {
    CARD: "카드",
    BANK_TRANSFER: "계좌이체",
    CASH: "현금",
};

const paymentTypeLabel: Record<string, string> = {
    ONLINE: "온라인",
    OFFLINE: "오프라인",
};

const ErrorText = styled.span`
  font-size: 13px;
  color: ${(p) => p.theme.colors.danger};
`;

const DetailLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  max-height: 70vh;
  overflow: auto;
`;

const DetailColumn = styled.div`
  display: grid;
  gap: 16px;
  align-items: flex-start;
  align-content: flex-start;
`;

const SectionHeading = styled.h4`
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
    padding: 10px 12px;
    border-bottom: 1px solid ${(p) => p.theme.colors.borderMuted};
    display: flex;
    justify-content: space-between;
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

const Paragraph = styled.p`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.md};
  padding: 12px;
  min-height: 80px;
  white-space: pre-wrap;
  margin: 0;
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

const ModalActions = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const AutoAdjustBody = styled.div`
  text-align: left;
  p {
    margin: 0;
    line-height: 1.6;
    color: ${(p) => p.theme.colors.text};
  }
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
