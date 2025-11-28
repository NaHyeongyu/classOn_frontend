import styled from "styled-components";
import { SectionCard } from "@/components/common/UI";
import type { MarketingPresetKey } from "@/features/marketing/types";

type Props = {
  preset: MarketingPresetKey | null;
  onSelectPreset: (preset: MarketingPresetKey) => void;
  from: string;
  to: string;
  onChangeFrom: (value: string) => void;
  onChangeTo: (value: string) => void;
  rangeSummary: { label: string; days: number | null };
  onSubmit: () => void;
  onReset: () => void;
  loading: boolean;
};

const PRESET_ITEMS: Array<{ key: MarketingPresetKey; label: string }> = [
  { key: "7d", label: "최근 7일" },
  { key: "30d", label: "최근 30일" },
  { key: "thisMonth", label: "이번 달" },
  { key: "lastMonth", label: "지난 달" },
];

export function MarketingPeriodSelector({
  preset,
  onSelectPreset,
  from,
  to,
  onChangeFrom,
  onChangeTo,
}: Props) {
  const handleFocusDate = (input: HTMLInputElement) => {
    try {
      (input as HTMLInputElement & { showPicker?: () => void }).showPicker?.();
    } catch {
      // 일부 브라우저는 showPicker 미지원 - 무시
    }
  };

  return (
    <SelectorCard>
      <PanelHeader>
        <PanelTitle>기간 선택</PanelTitle>
        <PanelSub>기간을 선택하면 조회 안내가 표시돼요.</PanelSub>
      </PanelHeader>
      <SelectorBody>
        <FieldBlock>
          <FieldLabel>빠른 기간 선택</FieldLabel>
          <QuickGrid>
            {PRESET_ITEMS.map((item) => (
              <QuickButton
                key={item.key}
                type="button"
                data-active={preset === item.key}
                onClick={() => onSelectPreset(item.key)}
              >
                {item.label}
              </QuickButton>
            ))}
          </QuickGrid>
        </FieldBlock>

        <FieldBlock>
          <FieldLabel>기간 직접 입력</FieldLabel>
          <DateRow>
            <DateField>
              <span>시작일</span>
              <DateInput
                type="date"
                lang="ko-KR"
                inputMode="numeric"
                pattern="^\\d{4}-\\d{2}-\\d{2}$"
                placeholder="YYYY-MM-DD"
                value={from}
                onFocus={(event) => handleFocusDate(event.currentTarget)}
                onChange={(event) => onChangeFrom(event.target.value)}
                onBlur={(event) => onChangeFrom(event.currentTarget.value)}
              />
            </DateField>
            <DateField>
              <span>종료일</span>
              <DateInput
                type="date"
                lang="ko-KR"
                inputMode="numeric"
                pattern="^\\d{4}-\\d{2}-\\d{2}$"
                placeholder="YYYY-MM-DD"
                value={to}
                onFocus={(event) => handleFocusDate(event.currentTarget)}
                onChange={(event) => onChangeTo(event.target.value)}
                onBlur={(event) => onChangeTo(event.currentTarget.value)}
              />
            </DateField>
          </DateRow>
        </FieldBlock>
      </SelectorBody>
    </SelectorCard>
  );
}

const SelectorCard = styled(SectionCard)`
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing.xl};
  padding: ${(p) => p.theme.spacing.xl};
`;

const PanelHeader = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.sm};
`;

const PanelTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.colors.text};
`;

const PanelSub = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const SelectorBody = styled.div`
  flex: 1;
  min-height: 0;
  overflow: auto;
  display: grid;
  gap: ${(p) => p.theme.spacing.lg};
  align-content: start;
`;

const FieldBlock = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.lg};
`;

const FieldLabel = styled.div`
  font-size: ${(p) => p.theme.font.size.sm};
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
`;

const QuickGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${(p) => p.theme.spacing.sm};
`;

const QuickButton = styled.button`
  height: 40px;
  border-radius: ${(p) => p.theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  font-size: ${(p) => p.theme.font.size.sm};
  cursor: pointer;
  &[data-active="true"] {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primarySurface};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const DateRow = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.sm};
`;

const DateField = styled.label`
  display: grid;
  gap: ${(p) => p.theme.spacing.xs};
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  span {
    font-weight: 600;
  }
`;

const DateInput = styled.input`
  height: 40px;
  border-radius: ${(p) => p.theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 0 ${(p) => p.theme.spacing.sm};
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${({ theme }) => theme.colors.text};
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadow.focusPrimary};
  }
`;

