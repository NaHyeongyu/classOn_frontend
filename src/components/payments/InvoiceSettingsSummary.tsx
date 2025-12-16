import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import type { PaymentDetail } from "@classon/shared-types";
import { formatMoney } from "@/lib/format";
import {
  computeNextDueDateLabel,
  formatCycleLabelFromPeriod,
  formatCycleLabelFromSchedule,
} from "@/lib/paymentDetailHelpers";
import { combineMemoValues } from "@/features/payments/utils/paymentsUtils";
import {
  SectionTitle,
  CaretIcon,
  ReceiptSection,
  FormGrid,
} from "@/components/payments/InvoiceLayout";
import { SectionCard } from "@/components/common/UI";
import { DiscountFields } from "@/components/payments/DiscountFields";
import { AdditionalChargeFields } from "@/components/payments/AdditionalChargeFields";

type Props = {
  invoice: PaymentDetail;
};

export function InvoiceSettingsSummary({ invoice }: Props) {
  const discountEnabled = Boolean(invoice.info.discountType && invoice.info.discountValue != null);
  const additionFields = useMemo(() => mapAdditionalFieldsFromDetail(invoice), [invoice]);
  const [discountExpanded, setDiscountExpanded] = useState(discountEnabled);
  const [additionExpanded, setAdditionExpanded] = useState(additionFields.enabled);
  useEffect(() => {
    setDiscountExpanded(discountEnabled);
  }, [discountEnabled]);
  useEffect(() => {
    setAdditionExpanded(additionFields.enabled);
  }, [additionFields.enabled]);
  const additionTotal = (additionFields.materialFee ?? 0) + (additionFields.textbookFee ?? 0);
  const { startDate, endDate } = resolvePeriodRange(invoice);
  const cycleLabel = formatCycleLabelFromPeriod(invoice.info.periodStart, invoice.info.periodEnd)
    ?? formatCycleLabelFromSchedule(invoice);
  const nextDueLabel = computeNextDueDateLabel(invoice);
  const finalAmount = invoice.info.finalAmount ?? invoice.info.originalAmount ?? 0;

  return (
    <SummaryCard>
      <SummaryReceiptSection>
        <SectionTitle>결제 정보</SectionTitle>
        <FormGrid>
          <label>
            결제 예정일
            <InfoFieldValue>{invoice.info.dueDate ?? "-"}</InfoFieldValue>
          </label>
          <label>
            결제 주기
            <InfoFieldValue>{cycleLabel}</InfoFieldValue>
          </label>
        </FormGrid>
      </SummaryReceiptSection>

      <CardSection>
        <SectionTitle>청구 기간</SectionTitle>
        <PeriodGrid>
          <PeriodColumn>
            <span>시작일</span>
            <strong>{startDate}</strong>
          </PeriodColumn>
          <PeriodArrow aria-hidden="true">→</PeriodArrow>
          <PeriodColumn>
            <span>종료일</span>
            <strong>{endDate}</strong>
          </PeriodColumn>
        </PeriodGrid>
        <InvoiceDetailList>
          <InvoiceDetailRow>
            <InvoiceLabel>다음 결제 예정일</InvoiceLabel>
            <InvoiceValue>{nextDueLabel}</InvoiceValue>
          </InvoiceDetailRow>
        </InvoiceDetailList>
      </CardSection>

      <CardSection>
        <SectionTitle>추가 설정</SectionTitle>
        <AccordionStack>
          <SummaryAccordion>
            <AccordionHeader type="button" onClick={() => setDiscountExpanded((prev: boolean) => !prev)}>
              <TitleRow>
                <span>할인 설정</span>
                <SummaryStatus $active={discountEnabled}>
                  {discountEnabled ? "사용 중" : "미사용"}
                </SummaryStatus>
              </TitleRow>
              <CaretIcon $open={discountExpanded} aria-hidden="true" />
            </AccordionHeader>
            {discountExpanded ? (
              <AccordionBody>
                <DiscountFields
                  enabled={discountEnabled}
                  discountType={invoice.info.discountType ?? undefined}
                  discountValue={invoice.info.discountValue ?? undefined}
                  onToggleEnabled={() => {}}
                  onChangeType={() => {}}
                  onChangeValue={() => {}}
                  onChangeStartDate={() => {}}
                  onChangeEndDate={() => {}}
                  showPeriod={false}
                  disabled
                  showTitle={false}
                />
              </AccordionBody>
            ) : null}
          </SummaryAccordion>

          <SummaryAccordion>
            <AccordionHeader type="button" onClick={() => setAdditionExpanded((prev: boolean) => !prev)}>
              <TitleRow>
                <span>추가 금액 설정</span>
                <SummaryStatus $active={additionFields.enabled}>
                  {additionFields.enabled ? "사용 중" : "미사용"}
                </SummaryStatus>
              </TitleRow>
              <CaretIcon $open={additionExpanded} aria-hidden="true" />
            </AccordionHeader>
            {additionExpanded ? (
              <AccordionBody>
                <AdditionalChargeFields
                  enabled={additionFields.enabled}
                  materialFee={additionFields.materialFee}
                  textbookFee={additionFields.textbookFee}
                  startDate={additionFields.startDate}
                  endDate={additionFields.endDate}
                  onToggleEnabled={() => {}}
                  onChangeMaterialFee={() => {}}
                  onChangeTextbookFee={() => {}}
                  onChangeStartDate={() => {}}
                  onChangeEndDate={() => {}}
                  disabled
                  showTitle={false}
                />
                {additionFields.enabled ? (
                  <AdditionalFooter>
                    <span>추가 금액 합계</span>
                    <strong>{formatMoney(additionTotal)}</strong>
                  </AdditionalFooter>
                ) : null}
              </AccordionBody>
            ) : null}
          </SummaryAccordion>
        </AccordionStack>
      </CardSection>

      <CardSection>
        <SectionTitle>메모</SectionTitle>
        <InvoiceMemoBox>{combineMemoValues(invoice.info.memo, invoice.info.managerMemo) || "-"}</InvoiceMemoBox>
      </CardSection>

      <CardSection $borderless>
        <SectionTitle>최종 청구 금액</SectionTitle>
        <FinalAmount>{formatMoney(finalAmount)}</FinalAmount>
      </CardSection>
    </SummaryCard>
  );
}

const AccordionStack = styled.div`
  display: grid;
  gap: 12px;
`;

const SummaryAccordion = styled.div`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.md};
  background: ${(p) => p.theme.colors.surface};
`;

const TitleRow = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: ${(p) => p.theme.colors.text};
`;

const SummaryStatus = styled.span<{ $active: boolean }>`
  font-size: 12px;
  font-weight: 600;
  color: ${(p) => (p.$active ? p.theme.colors.primary : p.theme.colors.textMuted)};
`;

const AccordionHeader = styled.button`
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

const AccordionBody = styled.div`
  border-top: 1px solid ${(p) => p.theme.colors.borderMuted};
  padding: 12px 16px 16px;
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

const FinalAmount = styled.div`
  font-size: 20px;
  font-weight: 800;
  text-align: right;
  color: ${(p) => p.theme.colors.text};
`;

export const PeriodGrid = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: center;
  gap: 20px;
  margin-bottom: 8px;
`;

export const PeriodColumn = styled.div`
  flex: 1 1 0;
  min-width: 0;
  text-align: center;
  display: grid;
  place-items: center;
  gap: 6px;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.md};
  padding: 14px;
  span {
    font-size: 13px;
    color: ${(p) => p.theme.colors.textMuted};
  }
  strong {
    font-size: 16px;
    font-weight: 700;
    color: ${(p) => p.theme.colors.text};
  }
`;

export const PeriodArrow = styled.span`
  font-size: 22px;
  color: ${(p) => p.theme.colors.textMuted};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  min-width: 32px;
  padding: 0 4px;
`;

const InfoFieldValue = styled.div`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 14px;
  color: ${(p) => p.theme.colors.text};
  min-height: 40px;
  display: flex;
  align-items: center;
  background: ${(p) => p.theme.colors.surface ?? "#fff"};
`;

const InvoiceDetailList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.md};
  overflow: hidden;
`;

const InvoiceDetailRow = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid ${(p) => p.theme.colors.borderMuted};
  &:last-child {
    border-bottom: none;
  }
`;

const InvoiceLabel = styled.span`
  font-size: 13px;
  color: ${(p) => p.theme.colors.textMuted};
`;

const InvoiceValue = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${(p) => p.theme.colors.text};
`;

const InvoiceMemoBox = styled.div`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.md};
  padding: 12px;
  min-height: 72px;
  background: ${(p) => p.theme.colors.surfaceAlt ?? "#f9fafb"};
  color: ${(p) => p.theme.colors.text};
  white-space: pre-wrap;
`;

const SummaryCard = styled(SectionCard)`
  padding: 0;
  border-radius: ${(p) => p.theme.radii.lg};
  box-shadow: ${(p) => p.theme.shadow.low};
  background: ${(p) => p.theme.colors.surface};
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const SummaryReceiptSection = styled(ReceiptSection)`
  padding: ${(p) => p.theme.spacing.lg};
  border-bottom: 1px solid ${(p) => p.theme.colors.borderMuted};
`;

const CardSection = styled.div<{ $borderless?: boolean }>`
  padding: ${(p) => p.theme.spacing.lg};
  border-bottom: ${(p) => (p.$borderless ? "none" : `1px solid ${p.theme.colors.borderMuted}`)};
  display: grid;
  gap: ${(p) => p.theme.spacing.sm};
`;

type AdditionalFieldsState = {
  enabled: boolean;
  materialFee?: number;
  textbookFee?: number;
  startDate?: string;
  endDate?: string;
};

function mapAdditionalFieldsFromDetail(detail: PaymentDetail): AdditionalFieldsState {
  const materialItem = detail.additionalItems?.find((item) => item?.type === "MATERIAL");
  const textbookItem = detail.additionalItems?.find((item) => item?.type === "TEXTBOOK");
  const materialFee =
    typeof materialItem?.unitPrice === "number" ? materialItem.unitPrice : undefined;
  const textbookFee =
    typeof textbookItem?.unitPrice === "number" ? textbookItem.unitPrice : undefined;
  const startDate = materialItem?.appliedStart ?? textbookItem?.appliedStart ?? detail.info.dueDate ?? "";
  const endDate = materialItem?.appliedEnd ?? textbookItem?.appliedEnd ?? detail.info.dueDate ?? "";
  const enabled = Boolean(
    (materialFee && materialFee > 0) || (textbookFee && textbookFee > 0),
  );
  return {
    enabled,
    materialFee,
    textbookFee,
    startDate,
    endDate,
  };
}

function resolvePeriodRange(invoice: PaymentDetail): { startDate: string; endDate: string } {
  const dueDate = invoice.info.dueDate ?? null;
  const rawStart = invoice.info.periodStart ?? dueDate ?? null;
  const sanitizedEnd = sanitizePeriodEnd(invoice.info.periodEnd ?? null, rawStart, invoice);
  const derivedEnd =
    sanitizedEnd ??
    deriveEndFromNextDue(invoice.schedule?.nextDueDate ?? null) ??
    deriveEndFromCycle(rawStart, invoice.schedule?.cycleUnit, invoice.schedule?.cycleValue);
  const fallbackEnd = derivedEnd ?? rawStart ?? null;
  const resolvedStart =
    rawStart ??
    (fallbackEnd
      ? deriveStartDate(fallbackEnd, invoice.schedule?.cycleUnit, invoice.schedule?.cycleValue)
      : null);
  return {
    startDate: resolvedStart ?? "-",
    endDate: fallbackEnd ?? "-",
  };
}

type CycleUnit = "DAYS" | "WEEKS" | "MONTHS" | (string & {});

function deriveStartDate(
  endDate: string,
  cycleUnit?: CycleUnit | null,
  cycleValue?: number | null,
): string | null {
  const end = toDate(endDate);
  if (!end) return null;
  const nextDue = new Date(end.getTime());
  nextDue.setDate(nextDue.getDate() + 1);
  const start = shiftDateByCycle(nextDue, cycleUnit, cycleValue, -1);
  if (!start) return null;
  return toDateInputValue(start);
}

function sanitizePeriodEnd(
  storedEnd: string | null,
  startDate: string | null,
  invoice: PaymentDetail,
): string | null {
  if (!storedEnd) return null;
  if (!startDate) return storedEnd;
  const start = toDate(startDate);
  const end = toDate(storedEnd);
  if (!start || !end) return storedEnd;
  if (end < start) {
    return null;
  }
  if (end.getTime() === start.getTime()) {
    const recalculated =
      deriveEndFromNextDue(invoice.schedule?.nextDueDate ?? null) ??
      deriveEndFromCycle(startDate, invoice.schedule?.cycleUnit, invoice.schedule?.cycleValue);
    if (recalculated && recalculated !== storedEnd) {
      return null;
    }
  }
  return storedEnd;
}

function deriveEndFromNextDue(nextDueDate: string | null): string | null {
  if (!nextDueDate) return null;
  const next = toDate(nextDueDate);
  if (!next) return null;
  next.setDate(next.getDate() - 1);
  return toDateInputValue(next);
}

function deriveEndFromCycle(
  startDate: string | null,
  cycleUnit?: CycleUnit | null,
  cycleValue?: number | null,
): string | null {
  if (!startDate) return null;
  const start = toDate(startDate);
  if (!start) return null;
  const nextCycleStart = shiftDateByCycle(start, cycleUnit, cycleValue, 1);
  if (!nextCycleStart) return null;
  nextCycleStart.setDate(nextCycleStart.getDate() - 1);
  return toDateInputValue(nextCycleStart);
}

function shiftDateByCycle(
  base: Date,
  cycleUnit?: CycleUnit | null,
  cycleValue?: number | null,
  direction: 1 | -1 = 1,
): Date | null {
  if (!base) return null;
  const normalized = cycleValue && cycleValue > 0 ? Math.round(cycleValue) : 1;
  const delta = direction === -1 ? -normalized : normalized;
  if (cycleUnit === "DAYS") {
    const next = new Date(base.getTime());
    next.setDate(next.getDate() + delta);
    return next;
  }
  if (cycleUnit === "WEEKS") {
    const next = new Date(base.getTime());
    next.setDate(next.getDate() + delta * 7);
    return next;
  }
  return addMonthsClamped(base, delta);
}

function addMonthsClamped(base: Date, monthsDelta: number): Date {
  const next = new Date(base.getTime());
  const day = next.getDate();
  next.setDate(1);
  next.setMonth(next.getMonth() + monthsDelta);
  const lastDay = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
  next.setDate(Math.min(day, lastDay));
  return next;
}

function toDate(value: string): Date | null {
  if (!value) return null;
  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function toDateInputValue(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
