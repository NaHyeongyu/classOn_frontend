import { useMemo, useState } from "react";
import styled from "styled-components";
import Modal from "@/components/common/Modal";
import {
  EmptyState,
  GhostButton,
  PrimaryButton,
  Skeleton,
  TableBase,
  ToggleSwitch,
} from "@/components/common/UI";
import { useToast } from "@/components/common/Toast";
import { DiscountFields } from "@/components/payments/DiscountFields";
import { AdditionalChargeFields } from "@/components/payments/AdditionalChargeFields";
import {
  listPaymentTemplates,
  updatePaymentTemplate,
  updatePaymentTemplateAutoGenerate,
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
  dueDate: string;
  cycleUnit: BillingCycleUnit;
  cycleValue: number;
  autoGenerate: boolean;
  amount: number;
  memo: string;
  managerMemo: string;
  discountEnabled: boolean;
  discountType: DiscountType;
  discountValue?: number;
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

function parseIsoDay(raw?: string | null): number | null {
  if (!raw) return null;
  const parts = raw.split("-");
  if (parts.length !== 3) return null;
  const day = Number(parts[2]);
  if (!Number.isFinite(day)) return null;
  return day;
}

function applyDayToIsoDate(rawIso: string, dueDay: number): string {
  const day = clampDueDay(dueDay);
  const parts = rawIso.split("-");
  if (parts.length !== 3) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}-${String(day).padStart(2, "0")}`;
  }
  const [y, m] = parts;
  return `${y}-${m}-${String(day).padStart(2, "0")}`;
}

export function StudentPaymentTemplatesPanel({ studentId }: Props) {
  const { success, error: toastError } = useToast();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<PaymentTemplateSetup | null>(null);
  const [form, setForm] = useState<EditFormState | null>(null);

  const templatesQuery = useQuery<PaymentTemplateSetup[]>({
    queryKey: ["payments", "templates", studentId],
    enabled: typeof studentId === "number",
    queryFn: () => listPaymentTemplates({ studentId: studentId as number }),
    staleTime: 30_000,
  });

  const templates: PaymentTemplateSetup[] = templatesQuery.data ?? [];

  const toggleMutation = useMutation({
    mutationFn: (vars: { templateId: number; autoGenerate: boolean }) =>
      updatePaymentTemplateAutoGenerate(vars.templateId, vars.autoGenerate),
    onSuccess: (updated: PaymentTemplateSetup) => {
      queryClient.setQueryData<PaymentTemplateSetup[]>(["payments", "templates", studentId], (prev) =>
        (prev ?? []).map((row) => (row.templateId === updated.templateId ? updated : row)),
      );
      success(updated.autoGenerate ? "자동 생성이 켜졌습니다." : "자동 생성이 꺼졌습니다.");
    },
    onError: (err: unknown) => toastError(readableError(err, "자동 생성 변경에 실패했습니다.")),
  });

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

  const openEdit = (template: PaymentTemplateSetup) => {
    const items = template.additionalItems ?? [];
    const materialItem = items.find((it) => it?.type === "MATERIAL");
    const textbookItem = items.find((it) => it?.type === "TEXTBOOK");
    const materialFee = materialItem?.unitPrice != null ? normalizeMoney(materialItem.unitPrice) : undefined;
    const textbookFee = textbookItem?.unitPrice != null ? normalizeMoney(textbookItem.unitPrice) : undefined;
    const extraEnabled = Boolean((materialFee && materialFee > 0) || (textbookFee && textbookFee > 0));
    const due = template.nextDueDate ?? "";

    setEditing(template);
    setForm({
      dueDate: due,
      cycleUnit: template.cycleUnit ?? "MONTHS",
      cycleValue: template.cycleValue ?? 1,
      autoGenerate: Boolean(template.autoGenerate),
      amount: normalizeMoney(template.originalAmount),
      memo: template.memo ?? "",
      managerMemo: template.managerMemo ?? "",
      discountEnabled: Boolean(template.discountType && template.discountValue != null),
      discountType: (template.discountType ?? "AMOUNT") as DiscountType,
      discountValue: template.discountValue != null ? normalizeMoney(template.discountValue) : undefined,
      extraEnabled,
      materialFee,
      textbookFee,
      extraStartDate: (materialItem?.appliedStart ?? textbookItem?.appliedStart ?? due) ?? "",
      extraEndDate: (materialItem?.appliedEnd ?? textbookItem?.appliedEnd ?? due) ?? "",
    });
  };

  const closeEdit = () => {
    if (saveMutation.isPending) return;
    setEditing(null);
    setForm(null);
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
    const payload: PaymentInvoicePayload = {
      studentId: editing.studentId,
      courseId: editing.courseId ?? undefined,
      dueDate: form.dueDate,
      amount: normalizeMoney(form.amount),
      autoGenerate: form.autoGenerate,
      cycleUnit: form.cycleUnit,
      cycleValue: form.cycleValue,
      memo: form.memo,
      managerMemo: form.managerMemo,
      discountType: form.discountEnabled ? form.discountType : undefined,
      discountValue: form.discountEnabled ? form.discountValue : undefined,
      additionalItems: additionalItemsPayload,
    };
    saveMutation.mutate({ templateId: editing.templateId, payload });
  };

  return (
    <Card>
      <HeaderRow>
        <div>
          <h3>청구서 템플릿</h3>
          <p>결제일에 결제건이 자동 생성됩니다.</p>
        </div>
        <GhostButton type="button" onClick={() => templatesQuery.refetch()} disabled={templatesQuery.isFetching}>
          새로고침
        </GhostButton>
      </HeaderRow>

      {templatesQuery.isLoading ? (
        <Skeleton h={120} />
      ) : templates.length === 0 ? (
        <EmptyState>저장된 템플릿이 없습니다. 결제 &gt; 청구서 생성에서 생성해 주세요.</EmptyState>
      ) : (
        <TableBase>
          <table>
            <colgroup>
              <col style={{ width: "36%" }} />
              <col style={{ width: "18%" }} />
              <col style={{ width: "18%" }} />
              <col />
            </colgroup>
            <thead>
              <tr>
                <th>수업</th>
                <th style={{ textAlign: "right" }}>결제일</th>
                <th style={{ textAlign: "right" }}>금액</th>
                <th style={{ textAlign: "right" }}>자동/관리</th>
              </tr>
            </thead>
            <tbody>
              {templates.map((row: PaymentTemplateSetup) => {
                const title =
                  row.courseTitleSnapshot?.trim() ||
                  row.courseCodeSnapshot?.trim() ||
                  "-";
                return (
                  <tr key={row.templateId}>
                    <td>{title}</td>
                    <td style={{ textAlign: "right" }}>{row.nextDueDate ?? "-"}</td>
                    <td style={{ textAlign: "right", fontWeight: 700 }}>{formatMoney(row.finalAmount ?? 0)}</td>
                    <td style={{ textAlign: "right" }}>
                      <Actions>
                        <ToggleSwitch>
                          <input
                            type="checkbox"
                            checked={Boolean(row.autoGenerate)}
                            disabled={toggleMutation.isPending}
                            onChange={(event) =>
                              toggleMutation.mutate({
                                templateId: row.templateId,
                                autoGenerate: event.currentTarget.checked,
                              })
                            }
                          />
                          <span className="switch" />
                        </ToggleSwitch>
                        <GhostButton type="button" onClick={() => openEdit(row)}>
                          수정
                        </GhostButton>
                      </Actions>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </TableBase>
      )}

      <Modal open={Boolean(editing && form)} onClose={closeEdit} title="청구서 템플릿 수정" maxWidth={720}>
        {editing && form ? (
          <ModalBody>
            <Grid>
              <label>
                <span>결제일 (매월 1~28일)</span>
                <select
                  value={String(clampDueDay(parseIsoDay(form.dueDate) ?? 1))}
                  onChange={(event) => {
                    const nextDay = clampDueDay(event.target.value);
                    setForm((prev) =>
                      prev ? { ...prev, dueDate: applyDayToIsoDate(prev.dueDate, nextDay) } : prev,
                    );
                  }}
                >
                  {Array.from({ length: 28 }, (_, idx) => idx + 1).map((d) => (
                    <option key={d} value={String(d)}>
                      매월 {d}일
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>주기</span>
                <select
                  value={`${form.cycleUnit}:${form.cycleValue}`}
                  onChange={(event) => {
                    const [unitRaw, valueRaw] = event.target.value.split(":");
                    const nextUnit = (unitRaw as BillingCycleUnit) ?? "MONTHS";
                    const nextValue = Math.max(1, Number(valueRaw) || 1);
                    setForm((prev) => (prev ? { ...prev, cycleUnit: nextUnit, cycleValue: nextValue } : prev));
                  }}
                >
                  <option value="MONTHS:1">1개월</option>
                  <option value="MONTHS:2">2개월</option>
                  <option value="MONTHS:3">3개월</option>
                  <option value="WEEKS:1">1주</option>
                  <option value="WEEKS:2">2주</option>
                  <option value="DAYS:14">14일</option>
                  <option value="DAYS:30">30일</option>
                </select>
              </label>
              <label>
                <span>기본 금액</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={form.amount}
                  onChange={(event) =>
                    setForm((prev) => (prev ? { ...prev, amount: normalizeMoney(event.target.value) } : prev))
                  }
                />
              </label>
              <label>
                <span>자동 생성</span>
                <ToggleSwitch>
                  <input
                    type="checkbox"
                    checked={form.autoGenerate}
                    onChange={(event) =>
                      setForm((prev) => (prev ? { ...prev, autoGenerate: event.currentTarget.checked } : prev))
                    }
                  />
                  <span className="switch" />
                </ToggleSwitch>
              </label>
            </Grid>

            <Section>
              <DiscountFields
                enabled={form.discountEnabled}
                discountType={form.discountType}
                discountValue={form.discountValue}
                onToggleEnabled={(enabled) =>
                  setForm((prev) => (prev ? { ...prev, discountEnabled: enabled } : prev))
                }
                onChangeType={(next) => setForm((prev) => (prev ? { ...prev, discountType: next } : prev))}
                onChangeValue={(value) =>
                  setForm((prev) => (prev ? { ...prev, discountValue: value ?? undefined } : prev))
                }
                onChangeStartDate={() => {}}
                onChangeEndDate={() => {}}
                showPeriod={false}
                showTitle={false}
              />
            </Section>

            <Section>
              <AdditionalChargeFields
                enabled={form.extraEnabled}
                materialFee={form.materialFee}
                textbookFee={form.textbookFee}
                startDate={form.extraStartDate}
                endDate={form.extraEndDate}
                onToggleEnabled={(enabled) => setForm((prev) => (prev ? { ...prev, extraEnabled: enabled } : prev))}
                onChangeMaterialFee={(value) => setForm((prev) => (prev ? { ...prev, materialFee: value } : prev))}
                onChangeTextbookFee={(value) => setForm((prev) => (prev ? { ...prev, textbookFee: value } : prev))}
                onChangeStartDate={(value) => setForm((prev) => (prev ? { ...prev, extraStartDate: value } : prev))}
                onChangeEndDate={(value) => setForm((prev) => (prev ? { ...prev, extraEndDate: value } : prev))}
                showTitle={false}
              />
            </Section>

            <Section>
              <label>
                <span>메모</span>
                <textarea
                  value={form.memo}
                  onChange={(event) => setForm((prev) => (prev ? { ...prev, memo: event.target.value } : prev))}
                />
              </label>
              <label>
                <span>내부 메모</span>
                <textarea
                  value={form.managerMemo}
                  onChange={(event) =>
                    setForm((prev) => (prev ? { ...prev, managerMemo: event.target.value } : prev))
                  }
                />
              </label>
            </Section>

            <ModalActions>
              <PrimaryButton type="button" onClick={handleSave} disabled={saveMutation.isPending}>
                {saveMutation.isPending ? "저장 중..." : "저장"}
              </PrimaryButton>
              <GhostButton type="button" onClick={closeEdit} disabled={saveMutation.isPending}>
                닫기
              </GhostButton>
            </ModalActions>
          </ModalBody>
        ) : null}
      </Modal>
    </Card>
  );
}

const Card = styled.div`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 16px;
  padding: 16px;
  background: #fff;
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

const Actions = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
`;

const ModalBody = styled.div`
  display: grid;
  gap: 16px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
  label {
    display: grid;
    gap: 6px;
    span {
      font-size: 13px;
      font-weight: 600;
    }
    input,
    select {
      border: 1px solid ${(p) => p.theme.colors.border};
      border-radius: 10px;
      padding: 8px 12px;
      font-size: 14px;
      width: 100%;
      box-sizing: border-box;
    }
  }
`;

const Section = styled.div`
  display: grid;
  gap: 10px;
  label {
    display: grid;
    gap: 6px;
    span {
      font-size: 13px;
      font-weight: 600;
    }
    textarea {
      border: 1px solid ${(p) => p.theme.colors.border};
      border-radius: 10px;
      padding: 10px 12px;
      font-size: 14px;
      min-height: 72px;
      resize: vertical;
      width: 100%;
      box-sizing: border-box;
    }
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 8px;
`;
