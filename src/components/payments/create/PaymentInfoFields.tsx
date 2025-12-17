import { ReceiptSection, SectionTitle, FormGrid, SelectLike } from "@/components/payments/InvoiceLayout";
import { Input } from "./styles";
import type { BillingCycleUnit } from "@classon/shared-types";

interface PaymentInfoFieldsProps {
  dueDate: string;
  onDueDateChange: (value: string) => void;
  cycleUnit: BillingCycleUnit;
  cycleValue: number;
  onCycleChange: (unit: BillingCycleUnit, value: number) => void;
}

export function PaymentInfoFields({
  dueDate,
  onDueDateChange,
  cycleUnit,
  cycleValue,
  onCycleChange,
}: PaymentInfoFieldsProps) {
  const handleCycleOptionChange = (raw: string) => {
    const [unitToken, valueToken] = raw.split(":");
    const nextUnit: BillingCycleUnit =
      unitToken === "D" ? "DAYS" : unitToken === "W" ? "WEEKS" : "MONTHS";
    const nextValue = Number(valueToken);
    onCycleChange(nextUnit, nextValue);
  };

  return (
    <ReceiptSection>
      <SectionTitle>결제 정보</SectionTitle>
      <FormGrid>
        <label>
          결제 예정일
          <Input
            type="date"
            value={dueDate}
            onChange={(event) => onDueDateChange(event.target.value)}
          />
        </label>
        <label>
          결제 주기
          <SelectLike
            value={`${cycleUnit === "DAYS" ? "D" : cycleUnit === "WEEKS" ? "W" : "M"}:${cycleValue ?? 1}`}
            onChange={(event) => handleCycleOptionChange(event.target.value)}
          >
            <option value="D:1">테스트(1일)</option>
            <option value="D:2">테스트(2일)</option>
            <option value="M:1">1개월</option>
            <option value="M:2">2개월</option>
            <option value="M:3">3개월</option>
            <option value="M:6">6개월</option>
            <option value="M:12">12개월</option>
          </SelectLike>
        </label>
      </FormGrid>
    </ReceiptSection>
  );
}
