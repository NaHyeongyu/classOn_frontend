import styled from "styled-components";
import type { DiscountType } from "@classon/shared-types";

type DiscountValue = number | undefined | null;

export type DiscountFieldsProps = {
  enabled: boolean;
  discountType: DiscountType | undefined;
  discountValue: DiscountValue;
  startDate?: string;
  endDate?: string;
  onToggleEnabled: (enabled: boolean) => void;
  onChangeType: (next: DiscountType) => void;
  onChangeValue: (value: DiscountValue) => void;
  onChangeStartDate: (value: string) => void;
  onChangeEndDate: (value: string) => void;
  showPeriod?: boolean;
  disabled?: boolean;
};

export function DiscountFields({
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
  showPeriod = true,
  disabled = false,
}: DiscountFieldsProps) {
  const handleToggle = (next: boolean) => {
    if (disabled) return;
    onToggleEnabled(next);
  };

  return (
    <DiscountSection>
      <SectionSubtitle>할인 설정</SectionSubtitle>
      <DiscountControls>
        <DiscountRow>
          <span className="discount-label">할인 유무</span>
          <ChoiceGroup role="group" aria-label="할인 유무">
          <ChoiceButton type="button" data-active={!enabled} onClick={() => handleToggle(false)} disabled={disabled}>
            미적용
          </ChoiceButton>
          <ChoiceButton type="button" data-active={enabled} onClick={() => handleToggle(true)} disabled={disabled}>
            적용
          </ChoiceButton>
        </ChoiceGroup>
        </DiscountRow>
        <DiscountRow>
          <span className="discount-label">할인 방식</span>
          <ChoiceGroup role="group" aria-label="할인 방식">
            <ChoiceButton
              type="button"
              data-active={discountType === "PERCENT"}
              onClick={() => onChangeType("PERCENT")}
              disabled={disabled || !enabled}
            >
              %
            </ChoiceButton>
            <ChoiceButton
              type="button"
              data-active={discountType === "AMOUNT"}
              onClick={() => onChangeType("AMOUNT")}
              disabled={disabled || !enabled}
            >
              금액
            </ChoiceButton>
          </ChoiceGroup>
        </DiscountRow>
        <DiscountRow>
          <span className="discount-label">할인율 / 금액</span>
          <DiscountInputCell>
            <Input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={discountValue ?? ""}
              onChange={(event) => onChangeValue(parseNumericInput(event.target.value))}
              disabled={disabled || !enabled}
            />
            <Hint>적용 되는 할인율 또는 금액을 숫자로만 작성해주세요.</Hint>
          </DiscountInputCell>
        </DiscountRow>
        {showPeriod ? (
          <DiscountRow>
            <span className="discount-label">할인 적용 기간</span>
            <DiscountPeriodInputs>
              <Input
                type="date"
                value={startDate ?? ""}
                onChange={(event) => onChangeStartDate(event.target.value)}
                disabled={disabled || !enabled}
              />
              <span>~</span>
              <Input
                type="date"
                value={endDate ?? ""}
                onChange={(event) => onChangeEndDate(event.target.value)}
                disabled={disabled || !enabled}
              />
            </DiscountPeriodInputs>
          </DiscountRow>
        ) : null}
      </DiscountControls>
    </DiscountSection>
  );
}

function parseNumericInput(raw: string): number | undefined {
  const digits = raw.replace(/[^0-9]/g, "");
  if (!digits) return undefined;
  const parsed = Number(digits);
  return Number.isNaN(parsed) ? undefined : parsed;
}

const DiscountSection = styled.div`
  display: grid;
  gap: 16px;
`;

const SectionSubtitle = styled.h4`
  margin: 0;
  font-size: 14px;
  color: ${(p) => p.theme.colors.text};
`;

const DiscountControls = styled.div`
  display: grid;
  gap: 14px;
`;

const DiscountRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: flex-start;
  .discount-label {
    min-width: 90px;
    font-size: 13px;
    font-weight: 600;
    color: ${(p) => p.theme.colors.text};
  }
  > :not(.discount-label) {
    flex: 1;
    min-width: 220px;
  }
`;

const ChoiceGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const ChoiceButton = styled.button`
  min-width: 80px;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 999px;
  padding: 8px 16px;
  font-size: 13px;
  background: ${(p) => p.theme.colors.surface};
  color: ${(p) => p.theme.colors.text};
  cursor: pointer;
  transition: background 120ms ease, border-color 120ms ease, color 120ms ease;
  &[data-active='true'] {
    border-color: ${(p) => p.theme.colors.primary};
    background: ${(p) => p.theme.colors.primarySurface};
    color: ${(p) => p.theme.colors.primary};
    font-weight: 600;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const DiscountInputCell = styled.div`
  flex: 1;
  min-width: 220px;
`;

const DiscountPeriodInputs = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  span {
    font-size: 13px;
    color: ${(p) => p.theme.colors.textMuted};
  }
  input {
    flex: 1;
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

const Hint = styled.span`
  display: block;
  font-size: 12px;
  color: ${(p) => p.theme.colors.textMuted};
  margin-top: 4px;
`;
