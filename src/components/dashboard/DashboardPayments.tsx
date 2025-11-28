import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { DashboardPanel } from "./DashboardLayout";
import { DashboardMoreButton } from "./DashboardButtons";
import type { DashboardKpiProps } from "@/features/dashboard/useDashboardPage";
import { GhostButton } from "@/components/common/UI";
import { routes } from "@/routes";

type Props = {
  kpi: DashboardKpiProps;
};

export default function DashboardPayments({ kpi }: Props) {
  const navigate = useNavigate();
  const { data, loading, error, onRetry } = kpi;

  const cards = useMemo(
    () => [
      { key: "UNPAID", label: "대기", count: data?.paymentUnpaidCount ?? 0 },
      { key: "PENDING", label: "미납", count: data?.paymentPendingCount ?? 0 },
      { key: "COMPLETED", label: "완료", count: data?.paymentCompletedCount ?? 0 },
    ],
    [data?.paymentCompletedCount, data?.paymentPendingCount, data?.paymentUnpaidCount],
  );

  return (
    <DashboardPanel height="auto">
      <Header>
        <TitleGroup>
          <TitleIcon aria-hidden>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="5" width="20" height="14" rx="3" />
              <path d="M2 10h20" />
              <path d="M7 15h3" />
            </svg>
          </TitleIcon>
          <Title>결제 관리</Title>
        </TitleGroup>
        <Buttons>
          {error && onRetry ? (
            <GhostButton type="button" onClick={() => onRetry()}>
              다시 시도
            </GhostButton>
          ) : null}
          <DashboardMoreButton type="button" onClick={() => navigate(routes.payments)}>
            더보기
          </DashboardMoreButton>
        </Buttons>
      </Header>

      <CardRow>
        {cards.map((card) => (
          <StatusCard key={card.key}>
            <StatusLabel>{card.label}</StatusLabel>
            <StatusValue data-variant={card.key.toLowerCase()}>
              {loading ? "…" : `${card.count}명`}
            </StatusValue>
          </StatusCard>
        ))}
      </CardRow>

      {error && !loading ? <ErrorText>결제 상태를 불러오지 못했습니다.</ErrorText> : null}
    </DashboardPanel>
  );
}

const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${(p) => p.theme.spacing.sm};
`;

const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing.sm};
`;

const TitleIcon = styled.span`
  width: 32px;
  height: 32px;
  border-radius: ${(p) => p.theme.radii.md};
  background: ${(p) => p.theme.colors.primarySurface};
  color: ${(p) => p.theme.colors.primary};
  display: grid;
  place-items: center;
`;

const Title = styled.h3`
  margin: 0;
  font-size: ${(p) => p.theme.font.size.lg};
  font-weight: ${(p) => p.theme.font.weight.semiBold};
  color: ${(p) => p.theme.colors.text};
`;

const Buttons = styled.div`
  display: flex;
  gap: ${(p) => p.theme.spacing.xs};
`;

const CardRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing.sm};
  flex: 1 1 auto;
  min-height: 0;
`;

const StatusCard = styled.article`
  border: 1px solid ${(p) => p.theme.colors.borderMuted};
  border-radius: ${(p) => p.theme.radii.md};
  padding: ${(p) => p.theme.spacing.md};
  background: ${(p) => p.theme.colors.surface};
  min-height: 90px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const StatusLabel = styled.span`
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${(p) => p.theme.colors.textMuted};
  font-weight: ${(p) => p.theme.font.weight.medium};
`;

const StatusValue = styled.strong`
  font-size: 28px;
  font-weight: ${(p) => p.theme.font.weight.extraBold ?? 800};
  color: ${(p) => p.theme.colors.text};
`;

const ErrorText = styled.p`
  margin: ${(p) => p.theme.spacing.xs} 0 0;
  font-size: 13px;
  color: ${(p) => p.theme.colors.danger};
`;
