import { useMemo, useState } from "react";
import styled from "styled-components";
import Modal from "@/components/common/Modal";
import {
  EmptyState,
  GhostButton,
  PrimaryButton,
  Skeleton,
  SectionCard,
  ToggleSwitch,
} from "@/components/common/UI";
import ConfirmModal from "@/components/common/ConfirmModal";
import { useToast } from "@/components/common/Toast";
import { DiscountFields } from "@/components/payments/DiscountFields";
import { AdditionalChargeFields } from "@/components/payments/AdditionalChargeFields";
import {
  deletePaymentTemplate,
  listPaymentTemplates,
  updatePaymentTemplate,
  type PaymentAdditionalItemPayload,
  type PaymentInvoicePayload,
  type PaymentTemplateSetup,
} from "@/api/payments";
import type { BillingCycleUnit, DiscountType } from "@classon/shared-types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatMoney } from "@/lib/format";
import { invalidatePaymentsQueries } from "@/lib/paymentsCache";
import { readableError } from "@/lib/errors";

type Props = {
  studentId: number | null;
};

type EditFormState = {
  dueDay: number;
  dueDate: string;
  cycleUnit: BillingCycleUnit;
  cycleValue: number;
  discountEnabled: boolean;
  discountType: DiscountType;
  discountValue?: number;
  discountStartDate?: string;
  discountEndDate?: string;
  extraEnabled: boolean;
  materialFee?: number;
  textbookFee?: number;
  extraStartDate?: string;
  extraEndDate?: string;
};

function normalizeMoney(raw: unknown): number {
  const value = typeof raw === "number" ? raw : Number(raw);
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.round(value));
}

function clampDueDay(raw: unknown): number {
  const value = typeof raw === "number" ? raw : Number(raw);
  if (!Number.isFinite(value)) return 1;
  return Math.min(28, Math.max(1, Math.round(value)));
}

const toLocalISODate = (date: Date) => {
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60000);
  return local.toISOString().slice(0, 10);
};

function isIsoBefore(a?: string | null, b?: string | null): boolean {
  if (!a || !b) return false;
  // Both are YYYY-MM-DD, lexical comparison matches date comparison.
  return a < b;
}

function normalizeCycle(value: unknown): number {
  const num = typeof value === "string" ? Number(value) : (value as number | undefined);
  if (!Number.isFinite(num) || (num ?? 0) <= 0) return 1;
  return Math.max(1, Math.round(Number(num)));
}

function isWithinIsoDate(target: string, start?: string, end?: string): boolean {
  if (!target) return true;
  if (start && isIsoBefore(target, start)) return false;
  if (end && isIsoBefore(end, target)) return false;
  return true;
}

function parseIsoDay(raw?: string | null): number | null {
  if (!raw) return null;
  const parts = raw.split("-");
  if (parts.length !== 3) return null;
  const day = Number(parts[2]);
  if (!Number.isFinite(day)) return null;
  return day;
}

function computeNextDueDateFromDay(dueDay: number, base: Date): string {
  const day = clampDueDay(dueDay);
  const year = base.getFullYear();
  const month = base.getMonth(); // 0-based
  const baseDay = base.getDate();
  const target = baseDay > day ? new Date(year, month + 1, day) : new Date(year, month, day);
  return toLocalISODate(target);
}

type TemplateCycleKey = "M:1" | "M:2" | "M:3" | "M:6" | "M:12";
const CYCLE_OPTIONS: { value: TemplateCycleKey; label: string }[] = [
  { value: "M:1", label: "1개월" },
  { value: "M:2", label: "2개월" },
  { value: "M:3", label: "3개월" },
  { value: "M:6", label: "6개월" },
  { value: "M:12", label: "12개월" },
];

function toCycleKey(unit: BillingCycleUnit, value: number): string {
  const unitKey = unit === "DAYS" ? "D" : unit === "WEEKS" ? "W" : "M";
  return `${unitKey}:${value}`;
}

function formatCycleLabel(unit: BillingCycleUnit, value: number): string {
  const v = normalizeCycle(value);
  if (unit === "DAYS") return `${v}일`;
  if (unit === "WEEKS") return `${v}주`;
  return `${v}개월`;
}

export function StudentPaymentTemplatesPanel({ studentId }: Props) {
  const { success, error: toastError } = useToast();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<PaymentTemplateSetup | null>(null);
  const [form, setForm] = useState<EditFormState | null>(null);
  const [discountOpen, setDiscountOpen] = useState(false);
  const [extraOpen, setExtraOpen] = useState(false);
  const todayIso = toLocalISODate(new Date());
  const nextMonthIso = useMemo(() => {
    const now = new Date();
    return toLocalISODate(new Date(now.getFullYear(), now.getMonth() + 1, now.getDate()));
  }, []);

  const templatesQuery = useQuery<PaymentTemplateSetup[]>({
    queryKey: ["payments", "templates", studentId],
    enabled: typeof studentId === "number",
    queryFn: () => listPaymentTemplates({ studentId: studentId as number }),
    staleTime: 0,
    refetchOnMount: "always",
  });

  const templates: PaymentTemplateSetup[] = templatesQuery.data ?? [];
  const primaryTemplate = templates.length ? templates[0] : null;

  const [deletePrompt, setDeletePrompt] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });

  const saveMutation = useMutation({
    mutationFn: (vars: { templateId: number; payload: PaymentInvoicePayload }) =>
      updatePaymentTemplate(vars.templateId, vars.payload),
    onSuccess: (updated: PaymentTemplateSetup) => {
      queryClient.setQueryData<PaymentTemplateSetup[]>(["payments", "templates", studentId], (prev) =>
        (prev ?? []).map((row) => (row.templateId === updated.templateId ? updated : row)),
      );
      invalidatePaymentsQueries(queryClient);
      success("청구서 템플릿을 수정했습니다.");
      setEditing(null);
      setForm(null);
    },
    onError: (err: unknown) => toastError(readableError(err, "청구서 템플릿 수정에 실패했습니다.")),
  });

  const deleteMutation = useMutation({
    mutationFn: (templateId: number) => deletePaymentTemplate(templateId),
    onSuccess: (_: void, templateId: number) => {
      success("청구서 템플릿을 삭제했습니다.");
      invalidatePaymentsQueries(queryClient);
      setDeletePrompt({ open: false, id: null });
      templatesQuery.refetch().catch(() => {});
      if (editing && editing.templateId === templateId) {
        setEditing(null);
        setForm(null);
        setDiscountOpen(false);
        setExtraOpen(false);
      }
    },
    onError: (err: unknown) => toastError(readableError(err, "청구서 템플릿 삭제에 실패했습니다.")),
  });

  const openEdit = (template: PaymentTemplateSetup) => {
    const items = template.additionalItems ?? [];
    const materialItem = items.find((it) => it?.type === "MATERIAL");
    const textbookItem = items.find((it) => it?.type === "TEXTBOOK");
    const materialFee = materialItem?.unitPrice != null ? normalizeMoney(materialItem.unitPrice) : undefined;
    const textbookFee = textbookItem?.unitPrice != null ? normalizeMoney(textbookItem.unitPrice) : undefined;
    const due = template.nextDueDate ?? "";
    const dueDay = clampDueDay(parseIsoDay(due) ?? 1);
    const cycleUnit = template.cycleUnit ?? "MONTHS";
    const cycleValue = normalizeCycle(template.cycleValue ?? 1);
    const dueDate = due || computeNextDueDateFromDay(dueDay, new Date());
    const todayIso = toLocalISODate(new Date());

    const discountExpired = Boolean(template.discountEndDate && isIsoBefore(template.discountEndDate, todayIso));
    const rawDiscountEnabled = Boolean(template.discountType && template.discountValue != null);
    const discountEnabled = rawDiscountEnabled && !discountExpired;

    const extraEndRaw = (materialItem?.appliedEnd ?? textbookItem?.appliedEnd) ?? null;
    const extraExpired = Boolean(extraEndRaw && isIsoBefore(extraEndRaw, todayIso));
    const rawExtraEnabled = Boolean((materialFee && materialFee > 0) || (textbookFee && textbookFee > 0));
    const extraEnabled = rawExtraEnabled && !extraExpired;

    setEditing(template);
    setForm({
      dueDay,
      dueDate,
      cycleUnit,
      cycleValue,
      discountEnabled,
      discountType: (template.discountType ?? "AMOUNT") as DiscountType,
      discountValue: template.discountValue != null ? normalizeMoney(template.discountValue) : undefined,
      discountStartDate: template.discountStartDate ?? undefined,
      discountEndDate: template.discountEndDate ?? undefined,
      extraEnabled,
      materialFee,
      textbookFee,
      extraStartDate: (materialItem?.appliedStart ?? textbookItem?.appliedStart) ?? undefined,
      extraEndDate: (materialItem?.appliedEnd ?? textbookItem?.appliedEnd) ?? undefined,
    });

    setDiscountOpen(discountEnabled);
    setExtraOpen(extraEnabled);
  };

  const closeEdit = () => {
    if (saveMutation.isPending) return;
    setEditing(null);
    setForm(null);
    setDiscountOpen(false);
    setExtraOpen(false);
  };

  const additionalItemsPayload = useMemo((): PaymentAdditionalItemPayload[] | undefined => {
    if (!editing || !form) return undefined;
    const items = editing.additionalItems ?? [];
    const others = items
      .filter((it) => it?.type === "OTHER")
      .map((it) => ({
        type: "OTHER" as const,
        label: (it?.label ?? "기타").trim(),
        quantity: it?.quantity ?? 1,
        unitPrice: it?.unitPrice ?? 0,
        appliedStart: it?.appliedStart ?? undefined,
        appliedEnd: it?.appliedEnd ?? undefined,
      }));

    const next: PaymentAdditionalItemPayload[] = [...others];
    if (form.extraEnabled) {
      const start = form.extraStartDate?.trim() ? form.extraStartDate : undefined;
      const end = form.extraEndDate?.trim() ? form.extraEndDate : undefined;
      if (form.materialFee && form.materialFee > 0) {
        next.push({
          type: "MATERIAL",
          label: "재료비",
          quantity: 1,
          unitPrice: form.materialFee,
          appliedStart: start,
          appliedEnd: end,
        });
      }
      if (form.textbookFee && form.textbookFee > 0) {
        next.push({
          type: "TEXTBOOK",
          label: "교재비",
          quantity: 1,
          unitPrice: form.textbookFee,
          appliedStart: start,
          appliedEnd: end,
        });
      }
    }
    return next;
  }, [editing, form]);

  const handleSave = () => {
    if (!editing || !form) return;
    if (!form.dueDate) {
      toastError("결제일을 입력해 주세요.");
      return;
    }
    const normalizeDate = (value?: string) => (value && value.trim() ? value.trim() : undefined);
    const payload: PaymentInvoicePayload = {
      studentId: editing.studentId,
      courseId: editing.courseId ?? undefined,
      dueDate: form.dueDate,
      cycleUnit: form.cycleUnit,
      cycleValue: form.cycleValue,
      discountType: form.discountEnabled ? form.discountType : undefined,
      discountValue: form.discountEnabled ? form.discountValue : undefined,
      discountEnabled: form.discountEnabled,
      discountStartDate: form.discountEnabled ? normalizeDate(form.discountStartDate) : undefined,
      discountEndDate: form.discountEnabled ? normalizeDate(form.discountEndDate) : undefined,
      additionalItems: additionalItemsPayload ?? [],
    };
    saveMutation.mutate({ templateId: editing.templateId, payload });
  };

  return (
    <Panel>
      <HeaderRow>
        <div>
          <h3>청구서 템플릿</h3>
          <p>결제일에 결제건이 자동 생성됩니다.</p>
	        </div>
	        <HeaderActions>
	          <GhostButton
	            type="button"
	            data-variant="edit"
	            onClick={() => (primaryTemplate ? openEdit(primaryTemplate) : undefined)}
	            disabled={!primaryTemplate || templatesQuery.isLoading}
	          >
	            수정
	          </GhostButton>
	          <GhostButton
	            type="button"
	            data-variant="danger"
	            onClick={() => {
	              if (!primaryTemplate) return;
	              setDeletePrompt({ open: true, id: primaryTemplate.templateId });
	            }}
	            disabled={!primaryTemplate || templatesQuery.isLoading}
	          >
	            삭제
	          </GhostButton>
	        </HeaderActions>
	      </HeaderRow>

      {templatesQuery.isLoading ? (
        <Skeleton h={120} />
      ) : templates.length === 0 ? (
        <EmptyState>저장된 템플릿이 없습니다. 결제 &gt; 청구서 생성에서 생성해 주세요.</EmptyState>
      ) : (
        <TemplatesStack>
          {templates.map((row: PaymentTemplateSetup) => {
            const title =
              row.courseTitleSnapshot?.trim() ||
              row.courseCodeSnapshot?.trim() ||
              "-";
            const nextDue = row.nextDueDate ?? "";
            const dueDay = clampDueDay(parseIsoDay(nextDue) ?? 1);
            const cycleUnit = row.cycleUnit ?? "MONTHS";
            const cycleValue = normalizeCycle(row.cycleValue ?? 1);
            const cycleKey = toCycleKey(cycleUnit, cycleValue);

            const discountApplies =
              Boolean(row.discountType && row.discountValue != null) &&
              isWithinIsoDate(nextDue, row.discountStartDate ?? undefined, row.discountEndDate ?? undefined);

            const materialItem = (row.additionalItems ?? []).find((it) => it?.type === "MATERIAL");
            const textbookItem = (row.additionalItems ?? []).find((it) => it?.type === "TEXTBOOK");
            const extraApplies = Boolean(
              (materialItem?.unitPrice || 0) > 0 || (textbookItem?.unitPrice || 0) > 0,
            ) && isWithinIsoDate(nextDue, materialItem?.appliedStart ?? undefined, materialItem?.appliedEnd ?? undefined);

            return (
              <ReceiptCard key={row.templateId}>
                <ReceiptHeader>
                  <h3>템플릿 설정</h3>
                  <p>
                    {title} · 다음 결제일 {nextDue || "-"} · {row.autoGenerate ? "자동 생성 ON" : "자동 생성 OFF"}
                  </p>
                </ReceiptHeader>

                <ReceiptSection>
                  <SectionTitle>결제 정보</SectionTitle>
                  <FormGrid>
                    <label>
                      결제일 (매월 1~28일)
                      <SelectLike value={String(dueDay)} disabled>
                        {Array.from({ length: 28 }, (_, idx) => idx + 1).map((d) => (
                          <option key={d} value={String(d)}>
                            매월 {d}일
                          </option>
                        ))}
                      </SelectLike>
                    </label>
                    <label>
                      결제 주기
                      <SelectLike value={cycleKey} disabled>
                        {CYCLE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                        {!CYCLE_OPTIONS.some((opt) => opt.value === (cycleKey as TemplateCycleKey)) ? (
                          <option value={cycleKey}>현재 설정({formatCycleLabel(cycleUnit, cycleValue)})</option>
                        ) : null}
                      </SelectLike>
                    </label>
                  </FormGrid>
                  <SummaryText>청구 기간은 결제일/주기에 따라 결제건 생성 시 자동으로 적용됩니다.</SummaryText>
                </ReceiptSection>

                <ReceiptSection>
                  <SectionTitle>추가 설정</SectionTitle>

                  <AccordionCard>
                    <AccordionHeader>
                      <span>할인 설정</span>
                      <div>
                        <ToggleSwitch>
                          <input type="checkbox" checked={Boolean(row.discountType && row.discountValue != null)} disabled />
                          <div className="switch" />
                        </ToggleSwitch>
                      </div>
                    </AccordionHeader>
                    {row.discountType && row.discountValue != null ? (
                      <AccordionBody>
                        <SummaryText>
                          {discountApplies ? "다음 결제일에 할인 적용" : "다음 결제일에는 할인 미적용"} ·{" "}
                          {row.discountType === "PERCENT" ? `${normalizeMoney(row.discountValue)}%` : `${formatMoney(normalizeMoney(row.discountValue))} 할인`}
                          {row.discountStartDate || row.discountEndDate ? (
                            <>
                              {" "}
                              ({row.discountStartDate ?? "-"} ~ {row.discountEndDate ?? "-"})
                            </>
                          ) : null}
                        </SummaryText>
                      </AccordionBody>
                    ) : null}
                  </AccordionCard>

                  <AccordionCard>
                    <AccordionHeader>
                      <span>추가 금액 설정</span>
                      <div>
                        <ToggleSwitch>
                          <input
                            type="checkbox"
                            checked={Boolean((materialItem?.unitPrice || 0) > 0 || (textbookItem?.unitPrice || 0) > 0)}
                            disabled
                          />
                          <div className="switch" />
                        </ToggleSwitch>
                      </div>
                    </AccordionHeader>
                    {(materialItem?.unitPrice || 0) > 0 || (textbookItem?.unitPrice || 0) > 0 ? (
                      <AccordionBody>
                        <SummaryText>
                          {extraApplies ? "다음 결제일에 추가 금액 적용" : "다음 결제일에는 추가 금액 미적용"} · 재료비{" "}
                          {formatMoney(normalizeMoney(materialItem?.unitPrice ?? 0))} · 교재비{" "}
                          {formatMoney(normalizeMoney(textbookItem?.unitPrice ?? 0))}
                          {materialItem?.appliedStart || materialItem?.appliedEnd ? (
                            <>
                              {" "}
                              ({materialItem?.appliedStart ?? "-"} ~ {materialItem?.appliedEnd ?? "-"})
                            </>
                          ) : null}
                        </SummaryText>
                      </AccordionBody>
                    ) : null}
                  </AccordionCard>
                </ReceiptSection>

                <TotalAmountSection>
                  <div className="label">다음 결제일 최종 청구 금액</div>
                  <div className="amount">{formatMoney(row.finalAmount ?? 0)}</div>
                  <div className="desc">기간에 따라 할인/추가금액이 적용됩니다.</div>
                </TotalAmountSection>

                <CardActions>
                  <AutoBadge data-on={Boolean(row.autoGenerate)}>
                    {row.autoGenerate ? "자동 생성 ON" : "자동 생성 OFF"}
                  </AutoBadge>
                </CardActions>
              </ReceiptCard>
            );
          })}
        </TemplatesStack>
      )}

      <Modal open={Boolean(editing && form)} onClose={closeEdit} maxWidth={760}>
        {editing && form ? (
          <ReceiptCard>
            <ReceiptHeader>
              <h3>템플릿 설정</h3>
              <p>
                {(editing.courseTitleSnapshot ?? editing.courseCodeSnapshot ?? "-").trim()} · 현재 템플릿을 수정합니다.
              </p>
            </ReceiptHeader>

            <ReceiptSection>
              <SectionTitle>결제 정보</SectionTitle>
              <FormGrid>
                <label>
                  결제일 (매월 1~28일)
	                  <SelectLike
	                    value={String(form.dueDay ?? 1)}
	                    onChange={(event) => {
	                      const nextDay = clampDueDay(event.target.value);
	                      const nextDueDate = computeNextDueDateFromDay(nextDay, new Date());
	                      setForm((prev) => {
	                        if (!prev) return prev;
	                        return {
	                          ...prev,
	                          dueDay: nextDay,
	                          dueDate: nextDueDate,
	                        };
	                      });
	                    }}
	                  >
                    {Array.from({ length: 28 }, (_, idx) => idx + 1).map((d) => (
                      <option key={d} value={String(d)}>
                        매월 {d}일
                      </option>
                    ))}
                  </SelectLike>
                </label>
                <label>
                  결제 주기
	                  <SelectLike
	                    value={toCycleKey(form.cycleUnit, form.cycleValue)}
	                    onChange={(event) => {
	                      const [unitKey, valueRaw] = event.target.value.split(":");
	                      const nextUnit: BillingCycleUnit =
	                        unitKey === "D" ? "DAYS" : unitKey === "W" ? "WEEKS" : "MONTHS";
	                      const nextValue = normalizeCycle(valueRaw);
	                      setForm((prev) =>
	                        prev
	                          ? {
	                              ...prev,
	                              cycleUnit: nextUnit,
	                              cycleValue: nextValue,
	                            }
	                          : prev,
	                      );
	                    }}
	                  >
                    {CYCLE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                    {!CYCLE_OPTIONS.some((opt) => opt.value === (toCycleKey(form.cycleUnit, form.cycleValue) as TemplateCycleKey)) ? (
                      <option value={toCycleKey(form.cycleUnit, form.cycleValue)}>
                        현재 설정({formatCycleLabel(form.cycleUnit, form.cycleValue)})
                      </option>
                    ) : null}
                  </SelectLike>
                </label>
	              </FormGrid>
	              <SummaryText>청구 기간은 결제일/주기에 따라 결제건 생성 시 자동으로 적용됩니다.</SummaryText>
	            </ReceiptSection>

	            <ReceiptSection>
	              <SectionTitle>추가 설정</SectionTitle>

              <AccordionCard>
                <AccordionHeader>
                  <span>할인 설정</span>
                  <div>
                    <ToggleSwitch>
                      <input
                        type="checkbox"
                        checked={form.discountEnabled}
                        onChange={(e) => {
                          const next = e.target.checked;
                          setForm((prev) => {
                            if (!prev) return prev;
                            const nextStart = next ? (prev.discountStartDate ?? todayIso) : prev.discountStartDate;
                            const nextEnd = next ? (prev.discountEndDate ?? nextMonthIso) : prev.discountEndDate;
                            return {
                              ...prev,
                              discountEnabled: next,
                              discountStartDate: nextStart,
                              discountEndDate: nextEnd,
                            };
                          });
                          setDiscountOpen(next);
                        }}
                      />
                      <div className="switch" />
                    </ToggleSwitch>
                  </div>
                </AccordionHeader>
                {discountOpen ? (
                  <AccordionBody>
                    <DiscountFields
                      enabled={Boolean(form.discountEnabled)}
                      discountType={form.discountType}
                      discountValue={form.discountValue}
                      startDate={form.discountStartDate}
                      endDate={form.discountEndDate}
                      onToggleEnabled={(next) => {
                        setForm((prev) => (prev ? { ...prev, discountEnabled: next } : prev));
                        setDiscountOpen(next);
                      }}
                      onChangeType={(next) => setForm((prev) => (prev ? { ...prev, discountType: next } : prev))}
                      onChangeValue={(value) =>
                        setForm((prev) => (prev ? { ...prev, discountValue: value ?? undefined } : prev))
                      }
                      onChangeStartDate={(value) =>
                        setForm((prev) => (prev ? { ...prev, discountStartDate: value } : prev))
                      }
                      onChangeEndDate={(value) =>
                        setForm((prev) => (prev ? { ...prev, discountEndDate: value } : prev))
                      }
                      showPeriod
                      showTitle={false}
                    />
                  </AccordionBody>
                ) : null}
              </AccordionCard>

              <AccordionCard>
                <AccordionHeader>
                  <span>추가 금액 설정</span>
                  <div>
                    <ToggleSwitch>
                      <input
                        type="checkbox"
                        checked={form.extraEnabled}
                        onChange={(e) => {
                          const next = e.target.checked;
                          setForm((prev) => {
                            if (!prev) return prev;
                            const nextStart = next ? (prev.extraStartDate ?? todayIso) : prev.extraStartDate;
                            const nextEnd = next ? (prev.extraEndDate ?? nextMonthIso) : prev.extraEndDate;
                            return {
                              ...prev,
                              extraEnabled: next,
                              extraStartDate: nextStart,
                              extraEndDate: nextEnd,
                            };
                          });
                          setExtraOpen(next);
                        }}
                      />
                      <div className="switch" />
                    </ToggleSwitch>
                  </div>
                </AccordionHeader>
                {extraOpen ? (
                  <AccordionBody>
                    <AdditionalChargeFields
                      enabled={Boolean(form.extraEnabled)}
                      materialFee={form.materialFee}
                      textbookFee={form.textbookFee}
                      startDate={form.extraStartDate}
                      endDate={form.extraEndDate}
                      onToggleEnabled={(enabled) => {
                        setForm((prev) => (prev ? { ...prev, extraEnabled: enabled } : prev));
                        setExtraOpen(enabled);
                      }}
                      onChangeMaterialFee={(value) => setForm((prev) => (prev ? { ...prev, materialFee: value } : prev))}
                      onChangeTextbookFee={(value) => setForm((prev) => (prev ? { ...prev, textbookFee: value } : prev))}
                      onChangeStartDate={(value) => setForm((prev) => (prev ? { ...prev, extraStartDate: value } : prev))}
                      onChangeEndDate={(value) => setForm((prev) => (prev ? { ...prev, extraEndDate: value } : prev))}
                      showTitle={false}
                    />
                  </AccordionBody>
                ) : null}
              </AccordionCard>
            </ReceiptSection>

            <TotalAmountSection>
              <div className="label">다음 결제일 최종 청구 금액</div>
              <div className="amount">
                {(() => {
                  const base = normalizeMoney(editing.originalAmount ?? 0);
                  const extraApplies =
                    form.extraEnabled && isWithinIsoDate(form.dueDate, form.extraStartDate, form.extraEndDate);
                  const extrasTotal = extraApplies ? (form.materialFee ?? 0) + (form.textbookFee ?? 0) : 0;
                  const discountApplies =
                    form.discountEnabled &&
                    Boolean(form.discountType && typeof form.discountValue === "number") &&
                    isWithinIsoDate(form.dueDate, form.discountStartDate, form.discountEndDate);
                  const discountValue = typeof form.discountValue === "number" ? form.discountValue : 0;
                  const discounted =
                    discountApplies && form.discountType === "PERCENT"
                      ? Math.max(0, Math.round(base - base * (discountValue / 100)))
                      : discountApplies && form.discountType === "AMOUNT"
                        ? Math.max(0, base - discountValue)
                        : base;
                  return formatMoney(discounted + extrasTotal);
                })()}
              </div>
              <div className="desc">기간에 따라 할인/추가금액이 적용됩니다.</div>
            </TotalAmountSection>

            <ReceiptFooter>
              <PrimaryButton type="button" onClick={handleSave} disabled={saveMutation.isPending}>
                {saveMutation.isPending ? "저장 중..." : "저장"}
              </PrimaryButton>
              <GhostButton type="button" onClick={closeEdit} disabled={saveMutation.isPending}>
                닫기
              </GhostButton>
            </ReceiptFooter>
          </ReceiptCard>
        ) : null}
      </Modal>

      <ConfirmModal
        open={deletePrompt.open}
        title="템플릿 삭제"
        description="청구서 템플릿을 삭제할까요? 삭제 후 복구할 수 없습니다."
        confirmText="삭제"
        loading={deleteMutation.isPending}
        onClose={() => {
          if (deleteMutation.isPending) return;
          setDeletePrompt({ open: false, id: null });
        }}
        onConfirm={() => {
          if (deleteMutation.isPending) return;
          if (!deletePrompt.id) return;
          deleteMutation.mutate(deletePrompt.id);
        }}
      />
    </Panel>
  );
}

const Panel = styled.div`
  display: grid;
  gap: 12px;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  h3 {
    margin: 0;
    font-size: 15px;
  }
  p {
    margin: 6px 0 0;
    font-size: 12px;
    color: ${(p) => p.theme.colors.textMuted};
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const AutoBadge = styled.span`
  display: inline-flex;
  align-items: center;
  height: 26px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.surfaceAlt};
  color: ${(p) => p.theme.colors.textMuted};

  &[data-on="true"] {
    background: ${(p) => p.theme.colors.primarySurface};
    color: ${(p) => p.theme.colors.primary};
    border-color: ${(p) => p.theme.colors.primarySurface};
  }
`;

const TemplatesStack = styled.div`
  display: grid;
  gap: 14px;
`;

const ReceiptCard = styled(SectionCard)`
  border: 1px solid ${(p) => p.theme.colors.border};
  padding: 0;
  overflow: hidden;
  background: #fff;
  box-shadow: none;
`;

const ReceiptHeader = styled.div`
  background: ${(p) => p.theme.colors.surfaceAlt};
  padding: 20px 24px;
  border-bottom: 1px dashed ${(p) => p.theme.colors.border};
  h3 {
    margin: 0 0 4px;
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

const SectionTitle = styled.h4`
  margin: 0 0 12px;
  font-size: 14px;
  font-weight: 600;
  color: ${(p) => p.theme.colors.text};
  display: flex;
  align-items: center;
  justify-content: space-between;
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

const SelectLike = styled.select`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 10px;
  padding: 8px 12px;
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;
  background: #fff;
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

const CardActions = styled.div`
  padding: 16px 24px 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const ReceiptFooter = styled.div`
  padding: 16px 24px 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;
