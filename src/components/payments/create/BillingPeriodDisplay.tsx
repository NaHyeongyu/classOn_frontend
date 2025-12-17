import { ReceiptSection, SectionTitle, Badge } from "@/components/payments/InvoiceLayout";
import { PeriodGrid, PeriodColumn, PeriodArrow } from "@/components/payments/InvoiceSettingsSummary";
import type { BillingCycleUnit } from "@classon/shared-types";

interface BillingPeriodDisplayProps {
  cycleValue: number;
  cycleUnit: BillingCycleUnit;
  periodStart: string;
  periodEnd: string;
}

export function BillingPeriodDisplay({
  cycleValue,
  cycleUnit,
  periodStart,
  periodEnd,
}: BillingPeriodDisplayProps) {
  return (
    <ReceiptSection>
      <SectionTitle>
        청구 기간
        {cycleValue > 0 && (
          <Badge>
            {cycleValue}
            {cycleUnit === "DAYS"
              ? "일간"
              : cycleUnit === "WEEKS"
                ? "주간"
                : "개월간"}
          </Badge>
        )}
      </SectionTitle>
      <PeriodGrid>
        <PeriodColumn>
          <span>시작일</span>
          <strong>{periodStart || "-"}</strong>
        </PeriodColumn>
        <PeriodArrow aria-hidden="true">→</PeriodArrow>
        <PeriodColumn>
          <span>종료일</span>
          <strong>{periodEnd || "-"}</strong>
        </PeriodColumn>
      </PeriodGrid>
    </ReceiptSection>
  );
}
