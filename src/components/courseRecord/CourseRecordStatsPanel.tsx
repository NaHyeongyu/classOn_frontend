import styled from "styled-components";
import { KPI, CheckIcon, UsersIcon, ClassIcon } from "@/components/dashboard/KPI";

type Props = {
  loading: boolean;
  summaryRate: number | null;
  actionableTotal: number;
  actionablePresent: number;
  actionableAbsent: number;
  actionableNone: number;
  presentShare: number;
  absentShare: number;
  noneShare: number;
};

export function CourseRecordStatsPanel({
  loading,
  summaryRate,
  actionableTotal,
  actionablePresent,
  actionableAbsent,
  actionableNone,
  presentShare,
  absentShare,
  noneShare,
}: Props) {
  return (
    <StatsGrid>
      <KPI
        title="출석률"
        icon={<ClassIcon />}
        iconAccent="indigo"
        loading={loading}
        value={
          <ValueStack>
            <strong>{summaryRate != null ? `${summaryRate}%` : "미집계"}</strong>
            <span>{actionableTotal ? `대상 ${actionableTotal}명` : "대상 없음"}</span>
          </ValueStack>
        }
      />
      <KPI
        title="출석"
        icon={<CheckIcon />}
        iconAccent="indigo"
        loading={loading}
        value={
          <ValueStack>
            <strong>{actionablePresent}명</strong>
            <span>
              {actionableTotal ? `전체의 ${presentShare}%` : "기록 없음"}
            </span>
          </ValueStack>
        }
      />
      <KPI
        title="결석"
        icon={<CheckIcon />}
        iconAccent="indigo"
        loading={loading}
        value={
          <ValueStack>
            <strong>{actionableAbsent}명</strong>
            <span>
              {actionableTotal ? `전체의 ${absentShare}%` : "기록 없음"}
            </span>
          </ValueStack>
        }
      />
      <KPI
        title="미처리"
        icon={<UsersIcon />}
        iconAccent="indigo"
        loading={loading}
        value={
          <ValueStack>
            <strong>{actionableNone}명</strong>
            <span>
              {actionableNone === 0
                ? "모두 처리 완료"
                : `전체의 ${noneShare}%`}
            </span>
          </ValueStack>
        }
      />
    </StatsGrid>
  );
}

const StatsGrid = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.sm};
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  margin: 4px 0 12px;
`;

const ValueStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  strong {
    font-size: 32px;
    font-weight: 800;
    line-height: 1.1;
  }
  span {
    font-size: 13px;
    font-weight: 600;
    color: ${(p) => p.theme.colors.textMuted};
  }
`;
