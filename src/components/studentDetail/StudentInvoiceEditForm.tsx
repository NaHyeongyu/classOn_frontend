import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import {
  PaymentInfoFields,
} from "@/components/payments/create/PaymentInfoFields";
import {
  BillingPeriodDisplay,
} from "@/components/payments/create/BillingPeriodDisplay";
import {
  DiscountSettings,
} from "@/components/payments/create/DiscountSettings";
import {
  ExtraChargeSettings,
} from "@/components/payments/create/ExtraChargeSettings";
import {
  MemoFields,
} from "@/components/payments/create/MemoFields";
import { computePeriodEnd } from "@/components/payments/create/utils";
import type { BillingCycleUnit, DiscountType, PaymentDetail } from "@classon/shared-types";
import type { PaymentInvoiceUpdatePayload, PaymentAdditionalItemPayload } from "@/api/payments";
import { PrimaryButtonLg } from "@/components/common/UI";
import {
  TotalAmountSection,
} from "@/components/payments/create/styles";
import { SectionTitle } from "@/components/payments/InvoiceLayout";
import { formatMoney } from "@/lib/format";
import { resolveCourseRows } from "@/lib/paymentDetailHelpers";

interface StudentInvoiceEditFormProps {
  detail: PaymentDetail;
  onSubmit: (payload: PaymentInvoiceUpdatePayload) => void;
  isPending: boolean;
}

export function StudentInvoiceEditForm({
  detail,
  onSubmit,
  isPending,
}: StudentInvoiceEditFormProps) {
  // Initialize state from detail
  const initialCycleValue = detail.schedule?.cycleValue ?? 1;
  const initialCycleUnit: BillingCycleUnit = detail.schedule?.cycleUnit ?? "MONTHS";
  const initialPeriodStartRaw = detail.info.periodStart ?? detail.info.dueDate ?? "";
  const computedEndFromCycle =
    initialPeriodStartRaw ? computePeriodEnd(initialPeriodStartRaw, initialCycleValue, initialCycleUnit) : "";
  const initialPeriodEndRaw = detail.info.periodEnd ?? "";
  const initialPeriodEnd = normalizePeriodEnd(initialPeriodStartRaw, initialPeriodEndRaw, computedEndFromCycle);
  const initialPeriodStart = initialPeriodStartRaw;

  const [dueDate, setDueDate] = useState<string>(detail.info.dueDate ?? "");
  const [periodStart, setPeriodStart] = useState<string>(initialPeriodStart);
  const [periodEnd, setPeriodEnd] = useState<string>(initialPeriodEnd);
  const [cycleValue, setCycleValue] = useState(initialCycleValue);
  const [cycleUnit, setCycleUnit] = useState<BillingCycleUnit>(initialCycleUnit);

  const detailDiscountStart =
    typeof detail.info.discountStartDate === "string" ? detail.info.discountStartDate : undefined;
  const detailDiscountEnd =
    typeof detail.info.discountEndDate === "string" ? detail.info.discountEndDate : undefined;

  const [discountEnabled, setDiscountEnabled] = useState(
    Boolean(detail.info.discountType && detail.info.discountValue != null)
  );
  const [discountType, setDiscountType] = useState<DiscountType>(detail.info.discountType ?? "AMOUNT");
  const [discountValue, setDiscountValue] = useState<number | undefined>(detail.info.discountValue ?? undefined);
  const [discountStartDate, setDiscountStartDate] = useState<string>(
    detailDiscountStart ?? initialPeriodStart ?? "",
  );
  const [discountEndDate, setDiscountEndDate] = useState<string>(
    detailDiscountEnd ?? initialPeriodEnd ?? detailDiscountStart ?? "",
  );

  // Extra charges
  const courseRows = useMemo(() => resolveCourseRows(detail), [detail]);
  const materialItem = detail.additionalItems?.find((item) => item?.type === "MATERIAL");
  const textbookItem = detail.additionalItems?.find((item) => item?.type === "TEXTBOOK");
  const initialMaterialFee = typeof materialItem?.unitPrice === "number" ? materialItem.unitPrice : undefined;
  const initialTextbookFee = typeof textbookItem?.unitPrice === "number" ? textbookItem.unitPrice : undefined;
  const initialExtraStart = materialItem?.appliedStart ?? textbookItem?.appliedStart ?? initialPeriodStart ?? "";
  const initialExtraEnd = materialItem?.appliedEnd ?? textbookItem?.appliedEnd ?? initialPeriodEnd ?? "";
  const initialExtraTotal =
    (initialMaterialFee ?? 0) + (initialTextbookFee ?? 0);
  const baseCourseAmount = Math.max(
    0,
    (detail.info.originalAmount ?? 0) - initialExtraTotal,
  );
  
  const [extraEnabled, setExtraEnabled] = useState(Boolean((initialMaterialFee && initialMaterialFee > 0) || (initialTextbookFee && initialTextbookFee > 0)));
  const [materialFee, setMaterialFee] = useState<number | undefined>(initialMaterialFee);
  const [textbookFee, setTextbookFee] = useState<number | undefined>(initialTextbookFee);
  const [extraStartDate, setExtraStartDate] = useState<string>(initialExtraStart);
  const [extraEndDate, setExtraEndDate] = useState<string>(initialExtraEnd);

  const [memo, setMemo] = useState<string>(detail.info.memo ?? "");
  const discountPeriodLockedRef = useRef(Boolean(detailDiscountStart || detailDiscountEnd));
  const additionPeriodLockedRef = useRef(
    Boolean(
      materialItem?.appliedStart ||
        materialItem?.appliedEnd ||
        textbookItem?.appliedStart ||
        textbookItem?.appliedEnd,
    ),
  );

  // Handlers
  const handleDueDateChange = (value: string) => {
    setDueDate(value);
    setPeriodStart(value);
    if (value) {
      setPeriodEnd(computePeriodEnd(value, cycleValue, cycleUnit));
    } else {
      setPeriodEnd("");
    }
  };

  const handleCycleChange = (unit: BillingCycleUnit, value: number) => {
    setCycleUnit(unit);
    setCycleValue(value);
    setPeriodEnd(computePeriodEnd(periodStart, value, unit));
  };

  useEffect(() => {
    if (!discountPeriodLockedRef.current) {
      setDiscountStartDate(periodStart ?? "");
      setDiscountEndDate(periodEnd ?? periodStart ?? "");
    }
  }, [periodStart, periodEnd]);

  useEffect(() => {
    if (!additionPeriodLockedRef.current) {
      setExtraStartDate(periodStart ?? "");
      setExtraEndDate(periodEnd ?? periodStart ?? "");
    }
  }, [periodStart, periodEnd]);

  // Calculate final amount for display
  const extraTotal = extraEnabled ? (materialFee ?? 0) + (textbookFee ?? 0) : 0;

  let discountedBase = baseCourseAmount;
  if (discountEnabled && discountValue) {
    if (discountType === "AMOUNT") {
      discountedBase = Math.max(0, baseCourseAmount - discountValue);
    } else {
      discountedBase = Math.max(0, Math.round(baseCourseAmount * (1 - discountValue / 100)));
    }
  }
  const finalAmount = discountedBase + extraTotal;

  const handleSubmit = () => {
    const additionalItems: PaymentAdditionalItemPayload[] = [];
    if (extraEnabled) {
      if (materialFee && materialFee > 0) {
        additionalItems.push({
          type: "MATERIAL",
          label: "재료비",
          quantity: 1,
          unitPrice: materialFee,
          appliedStart: extraStartDate,
          appliedEnd: extraEndDate,
        });
      }
      if (textbookFee && textbookFee > 0) {
        additionalItems.push({
          type: "TEXTBOOK",
          label: "교재비",
          quantity: 1,
          unitPrice: textbookFee,
          appliedStart: extraStartDate,
          appliedEnd: extraEndDate,
        });
      }
    }

    const additionalItemsPayload = extraEnabled ? additionalItems : [];

    const payload: PaymentInvoiceUpdatePayload = {
      dueDate,
      periodStart,
      periodEnd,
      amount: baseCourseAmount,
      memo,
      managerMemo: memo,
      discountType: discountEnabled ? discountType : undefined,
      discountValue: discountEnabled ? discountValue : undefined,
      discountStartDate: discountEnabled ? discountStartDate : undefined,
      discountEndDate: discountEnabled ? discountEndDate : undefined,
      cycleValue,
      cycleUnit,
      additionalItems: additionalItemsPayload,
    };
    onSubmit(payload);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <CourseListSection>
        <SectionTitle>수강 과목</SectionTitle>
        <InvoiceCourseList>
          {courseRows.map((course, index) => (
            <li key={`${course?.id ?? "course"}-${index}`}>
              <div className="info">
                <strong>{course?.title ?? "-"}</strong>
                {course?.code ? <span className="code">{course.code}</span> : null}
              </div>
              <span className="fee">{formatMoney(Number(course?.fee ?? 0))}</span>
            </li>
          ))}
        </InvoiceCourseList>
      </CourseListSection>

      <PaymentInfoFields
        dueDate={dueDate}
        onDueDateChange={handleDueDateChange}
        cycleUnit={cycleUnit}
        cycleValue={cycleValue}
        onCycleChange={handleCycleChange}
      />

      <BillingPeriodDisplay
        cycleValue={cycleValue}
        cycleUnit={cycleUnit}
        periodStart={periodStart}
        periodEnd={periodEnd}
      />

      <DiscountSettings
        enabled={discountEnabled}
        discountType={discountType}
        discountValue={discountValue}
        startDate={discountStartDate}
        endDate={discountEndDate}
        onToggleEnabled={setDiscountEnabled}
        onChangeType={setDiscountType}
        onChangeValue={setDiscountValue}
        onChangeStartDate={(value) => {
          discountPeriodLockedRef.current = true;
          setDiscountStartDate(value);
        }}
        onChangeEndDate={(value) => {
          discountPeriodLockedRef.current = true;
          setDiscountEndDate(value);
        }}
      />

      <ExtraChargeSettings
        enabled={extraEnabled}
        materialFee={materialFee}
        textbookFee={textbookFee}
        startDate={extraStartDate}
        endDate={extraEndDate}
        onToggleEnabled={setExtraEnabled}
        onChangeMaterialFee={setMaterialFee}
        onChangeTextbookFee={setTextbookFee}
        onChangeStartDate={(value) => {
          additionPeriodLockedRef.current = true;
          setExtraStartDate(value);
        }}
        onChangeEndDate={(value) => {
          additionPeriodLockedRef.current = true;
          setExtraEndDate(value);
        }}
      />

      <MemoFields memo={memo} onChange={setMemo} />

      <TotalAmountSection>
        <div className="label">최종 청구 금액</div>
        <div className="amount">{formatMoney(finalAmount)}</div>
        <div className="desc">할인 및 추가 금액이 포함된 금액입니다.</div>
      </TotalAmountSection>

      <PrimaryButtonLg
        type="button"
        disabled={isPending}
        onClick={handleSubmit}
        style={{ width: "100%" }}
      >
        수정 완료
      </PrimaryButtonLg>
    </div>
  );
}

const CourseListSection = styled.div`
  display: grid;
  gap: 12px;
`;

const InvoiceCourseList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.md};
  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    padding: 12px;
    border-bottom: 1px solid ${(p) => p.theme.colors.borderMuted};
  }
  li:last-child {
    border-bottom: none;
  }
  .info {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  strong {
    font-size: 14px;
    color: ${(p) => p.theme.colors.text};
  }
  .code {
    font-size: 12px;
    color: ${(p) => p.theme.colors.textMuted};
  }
  .fee {
    font-size: 14px;
    font-weight: 600;
    color: ${(p) => p.theme.colors.text};
    white-space: nowrap;
  }
`;

function normalizePeriodEnd(start: string, storedEnd: string, fallbackEnd: string): string {
  if (!start) return storedEnd || fallbackEnd;
  if (storedEnd && isAfterOrSame(start, storedEnd)) {
    return fallbackEnd || storedEnd;
  }
  if (!storedEnd) {
    return fallbackEnd;
  }
  return storedEnd;
}

function isAfterOrSame(start: string, end: string): boolean {
  if (!start || !end) return true;
  const startDate = new Date(`${start}T00:00:00`);
  const endDate = new Date(`${end}T00:00:00`);
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) return true;
  return endDate <= startDate;
}
