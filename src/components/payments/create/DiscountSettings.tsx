import { useEffect, useState } from "react";
import { AccordionCard, AccordionHeader, AccordionBody } from "@/components/payments/InvoiceLayout";
import { ToggleSwitch } from "@/components/common/UI";
import { DiscountFields } from "@/components/payments/DiscountFields";
import type { DiscountType } from "@classon/shared-types";

interface DiscountSettingsProps {
  enabled: boolean;
  discountType?: DiscountType;
  discountValue?: number;
  startDate: string;
  endDate: string;
  onToggleEnabled: (enabled: boolean) => void;
  onChangeType: (type: DiscountType) => void;
  onChangeValue: (value: number | undefined) => void;
  onChangeStartDate: (value: string) => void;
  onChangeEndDate: (value: string) => void;
}

export function DiscountSettings({
  enabled,
  discountType,
  discountValue,
  startDate,
  endDate,
  onToggleEnabled,
  onChangeType,
  onChangeValue,
  onChangeStartDate,
  onChangeEndDate,
}: DiscountSettingsProps) {
  const [isOpen, setIsOpen] = useState(enabled);
  useEffect(() => {
    setIsOpen(enabled);
  }, [enabled]);

  const handleToggle = (checked: boolean) => {
    onToggleEnabled(checked);
    if (checked) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  return (
    <AccordionCard>
      <AccordionHeader>
        <span>할인 설정</span>
        <div>
          <ToggleSwitch>
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => handleToggle(e.target.checked)}
            />
            <div className="switch" />
          </ToggleSwitch>
        </div>
      </AccordionHeader>
      {isOpen && (
        <AccordionBody>
          <DiscountFields
            enabled={enabled}
            discountType={discountType}
            discountValue={discountValue}
            startDate={startDate}
            endDate={endDate}
            onToggleEnabled={onToggleEnabled}
            onChangeType={onChangeType}
            onChangeValue={onChangeValue}
            onChangeStartDate={onChangeStartDate}
            onChangeEndDate={onChangeEndDate}
            showPeriod
            showTitle={false}
          />
        </AccordionBody>
      )}
    </AccordionCard>
  );
}
