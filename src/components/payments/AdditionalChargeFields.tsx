import styled from "styled-components";
import { ToggleSwitch } from "@/components/common/UI";

type ChargeValue = number | undefined;

export type AdditionalChargeFieldsProps = {
  enabled: boolean;
  materialFee?: ChargeValue;
  textbookFee?: ChargeValue;
  startDate?: string;
  endDate?: string;
  onToggleEnabled: (enabled: boolean) => void;
  onChangeMaterialFee: (value: ChargeValue) => void;
  onChangeTextbookFee: (value: ChargeValue) => void;
  onChangeStartDate: (value: string) => void;
  onChangeEndDate: (value: string) => void;
  disabled?: boolean;
  showTitle?: boolean;
};

export function AdditionalChargeFields({
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
  disabled = false,
  showTitle = true,
}: AdditionalChargeFieldsProps) {
  const handleToggle = (next: boolean) => {
    if (disabled) return;
    onToggleEnabled(next);
  };

  return (
    <Section>
      {showTitle ? <SectionSubtitle>추가 금액 설정</SectionSubtitle> : null}
      <Controls>
        <Row>
          <span className="label">추가 금액</span>
          <ToggleSwitch>
            <input
              type="checkbox"
              checked={enabled}
              onChange={(event) => handleToggle(event.currentTarget.checked)}
              disabled={disabled}
            />
            <span className="switch" aria-hidden="true" />
            <span className="text">{enabled ? "적용" : "미적용"}</span>
          </ToggleSwitch>
        </Row>
        <Row>
          <span className="label">항목별 금액</span>
          <ChargeInputs>
            <label>
              재료비
              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={materialFee ?? ""}
                onChange={(event) => onChangeMaterialFee(parseNumeric(event.target.value))}
                disabled={disabled || !enabled}
              />
            </label>
            <label>
              교재비
              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={textbookFee ?? ""}
                onChange={(event) => onChangeTextbookFee(parseNumeric(event.target.value))}
                disabled={disabled || !enabled}
              />
            </label>
          </ChargeInputs>
        </Row>
        <Row>
          <span className="label">적용 기간</span>
          <PeriodInputs>
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
          </PeriodInputs>
        </Row>
      </Controls>
    </Section>
  );
}

function parseNumeric(raw: string): number | undefined {
  const digits = raw.replace(/[^0-9]/g, "");
  if (!digits) return undefined;
  const parsed = Number(digits);
  return Number.isNaN(parsed) ? undefined : parsed;
}

const Section = styled.div`
  display: grid;
  gap: 16px;
`;

const SectionSubtitle = styled.h4`
  margin: 0;
  font-size: 14px;
  color: ${(p) => p.theme.colors.text};
`;

const Controls = styled.div`
  display: grid;
  gap: 14px;
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  .label {
    min-width: 90px;
    font-size: 13px;
    font-weight: 600;
    color: ${(p) => p.theme.colors.text};
  }
  > :not(.label) {
    flex: 1;
    min-width: 220px;
  }
`;

const ChargeInputs = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
  label {
    display: grid;
    gap: 6px;
    font-size: 13px;
    color: ${(p) => p.theme.colors.text};
  }
`;

const PeriodInputs = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
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
