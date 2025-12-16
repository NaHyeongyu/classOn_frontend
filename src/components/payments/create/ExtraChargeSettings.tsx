import { useEffect, useState } from "react";
import { AccordionCard, AccordionHeader, AccordionBody } from "@/components/payments/InvoiceLayout";
import { ToggleSwitch } from "@/components/common/UI";
import { AdditionalChargeFields } from "@/components/payments/AdditionalChargeFields";

interface ExtraChargeSettingsProps {
  enabled: boolean;
  materialFee?: number;
  textbookFee?: number;
  startDate: string;
  endDate: string;
  onToggleEnabled: (enabled: boolean) => void;
  onChangeMaterialFee: (value: number | undefined) => void;
  onChangeTextbookFee: (value: number | undefined) => void;
  onChangeStartDate: (value: string) => void;
  onChangeEndDate: (value: string) => void;
}

export function ExtraChargeSettings({
  enabled,
  materialFee,
  textbookFee,
  startDate,
  endDate,
  onToggleEnabled,
  onChangeMaterialFee,
  onChangeTextbookFee,
  onChangeStartDate,
  onChangeEndDate,
}: ExtraChargeSettingsProps) {
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
        <span>추가 금액 설정</span>
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
          <AdditionalChargeFields
            enabled={enabled}
            materialFee={materialFee}
            textbookFee={textbookFee}
            startDate={startDate}
            endDate={endDate}
            showTitle={false}
            onToggleEnabled={onToggleEnabled}
            onChangeMaterialFee={onChangeMaterialFee}
            onChangeTextbookFee={onChangeTextbookFee}
            onChangeStartDate={onChangeStartDate}
            onChangeEndDate={onChangeEndDate}
          />
        </AccordionBody>
      )}
    </AccordionCard>
  );
}
