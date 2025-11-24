import { useEffect, useRef, useState, type FormEvent } from "react";
import styled from "styled-components";
import { Card, SectionTitle } from "@/components/studentDetail/StudentDetailStyles";
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
import {
  getPaymentDetail,
  updatePaymentInvoice,
  type PaymentInvoiceUpdatePayload,
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
  cycleValue: undefined,
  cycleUnit: undefined,
});

const statusLabel: Record<string, string> = {
  UNPAID: "미납",
  PENDING: "대기",
  COMPLETED: "완료",
  FAILED: "실패",
};

const statusColor: Record<string, string> = {
  UNPAID: "#f97316",
  PENDING: "#2563EB",
  COMPLETED: "#059669",
  FAILED: "#dc2626",
};

export function StudentPaymentsSection({ studentId, payments, loading, error, onRefresh }: Props) {
  const { success, error: toastError } = useToast();
  const queryClient = useQueryClient();
  const invoice = payments?.invoice ?? null;
  const history = payments?.history ?? [];
  const completedHistory = history.filter((row) => row.status === "COMPLETED");
  const [detailState, setDetailState] = useState<DetailState>({ open: false });
  const [form, setForm] = useState<PaymentInvoiceUpdatePayload>(() => createEmptyInvoiceForm());
  const [isEditing, setIsEditing] = useState(false);
  const saveInFlight = useRef(false);
  const [invoiceEditState, setInvoiceEditState] = useState<InvoiceEditState>({ open: false });
  const [invoiceEditForm, setInvoiceEditForm] = useState<PaymentInvoiceUpdatePayload>(() =>
    createEmptyInvoiceForm(),
  );
  const [invoiceDiscountEnabled, setInvoiceDiscountEnabled] = useState(false);
  const isDetailOpen = detailState.open;
  const detailVariant = isDetailOpen ? detailState.variant : undefined;
  const detailLoading = isDetailOpen ? detailState.loading : false;
  const detailData = isDetailOpen ? detailState.data : null;
  const resolvedDetailVariant: "invoice" | "history" = detailVariant ?? "invoice";
  const invoiceEditOpen = invoiceEditState.open;
  const invoiceEditLoading = invoiceEditOpen ? invoiceEditState.loading : false;
  const invoiceEditData = invoiceEditOpen ? invoiceEditState.data : null;

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
    });
    setInvoiceDiscountEnabled(Boolean(info.discountType && info.discountValue != null));
  }, [invoiceEditOpen, invoiceEditLoading, invoiceEditData]);

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
    };
    updateMutation.mutate({ id: invoice.info.id, payload });
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

  return (
    <Card>
      <PaymentsGrid>
        <InvoiceColumn>
          <HeaderRow>
            <SectionTitle>청구서</SectionTitle>
            {invoice ? (
              <PrimaryButton type="button" onClick={openInvoiceEditModal}>
                수정
              </PrimaryButton>
            ) : null}
          </HeaderRow>
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
              <label>
                <span>할인 방식</span>
                <input value={invoice.info.discountType ?? "없음"} disabled />
              </label>
              {invoice.info.discountType ? (
                <label>
                  <span>할인</span>
                  <input value={formatDiscountDisplay(invoice.info.discountType, invoice.info.discountValue)} disabled />
                </label>
              ) : null}
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
        <HistoryColumn>
          <HeaderRow>
            <SectionTitle>결제 내역</SectionTitle>
            {error ? <ErrorText>{error}</ErrorText> : null}
          </HeaderRow>
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
      </PaymentsGrid>

      <Modal
        open={isDetailOpen}
        onClose={closeDetail}
        title={resolvedDetailVariant === "invoice" ? "청구서 상세" : "결제 상세"}
        maxWidth={720}
        blockOutsideClose={detailVariant === "invoice" && isEditing}
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
                      </ModalActions>
                    </div>
                  );
                })()
              )}
            </DetailColumn>
          </DetailLayout>
        ) : null}
      </Modal>

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
                        ? String(invoiceEditForm.amount)
                        : String(invoiceEditData.info.originalAmount ?? "")
                    }
                    onChange={(event) =>
                      setInvoiceEditForm((prev) => ({
                        ...prev,
                        amount: parseNumericInput(event.target.value),
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
            <DiscountSection>
              <DiscountFields
                enabled={invoiceDiscountEnabled}
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
                  if (!next) {
                    setInvoiceEditForm((prev) => ({
                      ...prev,
                      discountType: undefined,
                      discountValue: undefined,
                    }));
                  }
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
                onChangeStartDate={() => {}}
                onChangeEndDate={() => {}}
                showPeriod={false}
              />
            </DiscountSection>
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
    </Card>
  );
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

const PaymentsGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(260px, 320px) minmax(360px, 1fr);
  gap: 20px;
  align-items: start;
`;

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
    font-weight: 600;
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

const Select = styled.select`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 10px;
  padding: 8px 12px;
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;
  background: #fff;
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
function formatDiscountDisplay(type?: DiscountType | null, value?: number | null): string {
  if (!type || value == null || Number.isNaN(value)) return "-";
  if (type === "PERCENT") {
    return `${value}%`;
  }
  return formatMoney(value);
}
