import styled from "styled-components";
import { Skeleton as UISkeleton } from "@/components/common/UI";
import { SmallMuted } from "@/components/courseRecord/CourseRecordStyles";

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
    <QuickStats>
      {loading
        ? Array.from({ length: 4 }).map((_, index) => (
            <StatCard key={`stat-skeleton-${index}`}>
              <UISkeleton w={"40%"} h={12} />
              <UISkeleton w={"60%"} h={22} mt={6} />
              <UISkeleton w={"50%"} h={10} mt={6} />
            </StatCard>
          ))
        : (
            <>
              <StatCard data-tone="primary">
                <span className="label">출석률</span>
                <strong>
                  {summaryRate != null ? `${summaryRate}%` : "미집계"}
                </strong>
                <SmallMuted>
                  {actionableTotal ? `대상 ${actionableTotal}명` : "대상 없음"}
                </SmallMuted>
              </StatCard>
              <StatCard data-tone="success">
                <span className="label">출석</span>
                <strong>{actionablePresent}명</strong>
                <SmallMuted>
                  {actionableTotal ? `전체의 ${presentShare}%` : "기록 없음"}
                </SmallMuted>
              </StatCard>
              <StatCard data-tone="danger">
                <span className="label">결석</span>
                <strong>{actionableAbsent}명</strong>
                <SmallMuted>
                  {actionableTotal ? `전체의 ${absentShare}%` : "기록 없음"}
                </SmallMuted>
              </StatCard>
              <StatCard data-tone={actionableNone === 0 ? "muted" : "warning"}>
                <span className="label">미처리</span>
                <strong>{actionableNone}명</strong>
                <SmallMuted>
                  {actionableNone === 0
                    ? "모두 처리 완료"
                    : `전체의 ${noneShare}%`}
                </SmallMuted>
              </StatCard>
            </>
          )}
    </QuickStats>
  );
}

const QuickStats = styled.div`
  display: grid;
  gap: 8px;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  margin: 4px 0 8px;
  @media (max-width: 640px) {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  }
`;

const StatCard = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px 14px;
  background: #fff;
  display: grid;
  gap: 6px;
  .label {
    font-size: 12px;
    font-weight: 700;
    color: #6b7280;
  }
  strong {
    font-size: 20px;
    font-weight: 800;
    color: #111827;
  }
  &[data-tone="primary"] strong {
    color: #1d4ed8;
  }
  &[data-tone="success"] strong {
    color: #047857;
  }
  &[data-tone="danger"] strong {
    color: #b91c1c;
  }
  &[data-tone="warning"] strong {
    color: #b45309;
  }
  &[data-tone="muted"] strong {
    color: #4b5563;
  }
`;
