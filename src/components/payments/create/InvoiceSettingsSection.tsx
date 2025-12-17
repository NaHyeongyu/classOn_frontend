import { ReceiptCard, ReceiptHeader, EmptyReceipt, ReceiptSection, SectionTitle } from "@/components/payments/InvoiceLayout";
import { RepresentativeInfo } from "./RepresentativeInfo";
import { PaymentInfoFields } from "./PaymentInfoFields";
import { BillingPeriodDisplay } from "./BillingPeriodDisplay";
import { DiscountSettings } from "./DiscountSettings";
import { ExtraChargeSettings } from "./ExtraChargeSettings";
import { MemoFields } from "./MemoFields";
import { InvoiceSummary } from "./InvoiceSummary";
import type { Student } from "@/api/students";
import type { BillingCycleUnit, DiscountType } from "@classon/shared-types";

export interface InvoiceFormState {
  dueDate: string;
  periodStart: string;
  periodEnd: string;
  discountStartDate: string;
  discountEndDate: string;
  discountEnabled: boolean;
  discountType: DiscountType;
  discountValue?: number;
  memo: string;
  managerMemo: string;
  cycleValue: number;
  cycleUnit: BillingCycleUnit;
  autoGenerate: boolean;
  extraEnabled: boolean;
  materialFee?: number;
  textbookFee?: number;
  extraStartDate: string;
  extraEndDate: string;
  recipientPhone: string | null;
}

interface InvoiceSettingsSectionProps {
  selectedIds: number[];
  primaryStudent: Student | null;
  primaryCourseTitles: string;
  form: InvoiceFormState;
  setForm: React.Dispatch<React.SetStateAction<InvoiceFormState>>;
  onCycleChange: (unit: BillingCycleUnit, value: number) => void;
  onDueDateChange: (value: string) => void;
  primaryFinalAmount: number;
  isPending: boolean;
  onSubmit: () => void;
}

export function InvoiceSettingsSection({
  selectedIds,
  primaryStudent,
  primaryCourseTitles,
  form,
  setForm,
  onCycleChange,
  onDueDateChange,
  primaryFinalAmount,
  isPending,
  onSubmit,
}: InvoiceSettingsSectionProps) {
  if (!selectedIds.length) {
    return (
      <ReceiptCard>
        <ReceiptHeader>
          <h3>청구서 설정</h3>
          <p>선택된 학생에게 적용될 내용입니다.</p>
        </ReceiptHeader>
        <EmptyReceipt>
          <div className="icon">🧾</div>
          <p>왼쪽 목록에서<br/>청구서를 보낼 학생을<br/>선택해주세요.</p>
        </EmptyReceipt>
      </ReceiptCard>
    );
  }

  return (
    <ReceiptCard>
      <ReceiptHeader>
        <h3>청구서 설정</h3>
        <p>선택된 학생에게 적용될 내용입니다.</p>
      </ReceiptHeader>

      {primaryStudent && (
        <RepresentativeInfo
          student={primaryStudent}
          courseTitles={primaryCourseTitles}
          recipientPhone={form.recipientPhone}
          onPhoneChange={(phone) => setForm((prev) => ({ ...prev, recipientPhone: phone }))}
        />
      )}

      <PaymentInfoFields
        dueDate={form.dueDate}
        onDueDateChange={onDueDateChange}
        cycleUnit={form.cycleUnit}
        cycleValue={form.cycleValue}
        onCycleChange={onCycleChange}
      />

      <BillingPeriodDisplay
        cycleValue={form.cycleValue}
        cycleUnit={form.cycleUnit}
        periodStart={form.periodStart}
        periodEnd={form.periodEnd}
      />

      <ReceiptSection>
        <SectionTitle>추가 설정</SectionTitle>
        <DiscountSettings
          enabled={form.discountEnabled}
          discountType={form.discountType}
          discountValue={form.discountValue}
          startDate={form.discountStartDate}
          endDate={form.discountEndDate}
          onToggleEnabled={(enabled) => setForm((prev) => ({ ...prev, discountEnabled: enabled }))}
          onChangeType={(type) => setForm((prev) => ({ ...prev, discountType: type }))}
          onChangeValue={(value) => setForm((prev) => ({ ...prev, discountValue: value }))}
          onChangeStartDate={(value) => setForm((prev) => ({ ...prev, discountStartDate: value }))}
          onChangeEndDate={(value) => setForm((prev) => ({ ...prev, discountEndDate: value }))}
        />

        <ExtraChargeSettings
          enabled={form.extraEnabled}
          materialFee={form.materialFee}
          textbookFee={form.textbookFee}
          startDate={form.extraStartDate}
          endDate={form.extraEndDate}
          onToggleEnabled={(enabled) => setForm((prev) => ({ ...prev, extraEnabled: enabled }))}
          onChangeMaterialFee={(value) => setForm((prev) => ({ ...prev, materialFee: value }))}
          onChangeTextbookFee={(value) => setForm((prev) => ({ ...prev, textbookFee: value }))}
          onChangeStartDate={(value) => setForm((prev) => ({ ...prev, extraStartDate: value }))}
          onChangeEndDate={(value) => setForm((prev) => ({ ...prev, extraEndDate: value }))}
        />
      </ReceiptSection>

      <MemoFields
        memo={form.memo}
        onChange={(value) => setForm((prev) => ({ ...prev, memo: value, managerMemo: value }))}
      />

      <InvoiceSummary
        amount={primaryFinalAmount}
        selectedCount={selectedIds.length}
        isPending={isPending}
        onSubmit={onSubmit}
      />
    </ReceiptCard>
  );
}
