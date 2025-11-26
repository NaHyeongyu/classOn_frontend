import styled from "styled-components";
import type { CalendarPaymentSection } from "@/features/calendar/useCalendarPaymentList";
import { EmptyPlaceholder } from "@/components/common/EmptyPlaceholder";
import { PrimaryButtonSm, GhostButtonSmall } from "@/components/common/UI";
import { Fragment } from "react";

export type PaymentPanelProps = {
  configured: boolean;
  sections?: CalendarPaymentSection[];
  loading?: boolean;
  error?: string | null;
  periodLabel?: string;
  rangeLabel?: string;
  onOpenSchedule?: () => void;
  onMore?: () => void;
};

export function PaymentPanel({
  configured,
  sections = [],
  loading,
  error,
  periodLabel,
  rangeLabel,
  onOpenSchedule,
  onMore,
}: PaymentPanelProps) {
  return (
    <Section>
      <Header>
        <div>
          <Title>결제 관리</Title>
          {periodLabel ? <SubInfo>{periodLabel}</SubInfo> : null}
          {rangeLabel ? <RangeInfo>{rangeLabel}</RangeInfo> : null}
          {error ? <ErrorText>{error}</ErrorText> : null}
        </div>
        <Actions>
          <GhostButtonSmall type="button" onClick={onOpenSchedule}>
            주기 설정
          </GhostButtonSmall>
          <PrimaryButtonSm type="button" onClick={onMore}>
            더보기
          </PrimaryButtonSm>
        </Actions>
      </Header>
      {loading ? (
        <Placeholder>결제 정보를 불러오는 중...</Placeholder>
      ) : !configured ? (
        <EmptyPlaceholder
          title="알림 주기를 설정하면 결제 예정 학생을 볼 수 있어요."
          description="1주일, 2주일 등 원하는 기간을 선택해 결제 예정 학생을 모아보세요."
          actionLabel="주기 설정"
          onAction={onOpenSchedule}
        />
      ) : sections.length === 0 ? (
        <EmptyPlaceholder
          title="선택한 기간에 결제 예정인 학생이 없습니다."
          description="자동으로 생성된 청구서는 결제 예정일 5일 전에 표시됩니다."
        />
      ) : (
        <Table>
          <thead>
            <tr>
              <th>학생</th>
              <th>수강 금액</th>
              <th>상태</th>
              <th>결제 예정일</th>
            </tr>
          </thead>
          <tbody>
            {sections.map((section) => (
              <Fragment key={section.date}>
                <tr className="date-row">
                  <td colSpan={4}>{section.label}</td>
                </tr>
                {section.rows.map((row) => (
                  <tr key={`${section.date}-${row.id}`}>
                    <td>
                      <strong>{row.studentName}</strong>
                      {row.courseTitle ? <CourseMeta>{row.courseTitle}</CourseMeta> : null}
                    </td>
                    <td className="amount">{row.amountLabel}</td>
                    <td>
                      <StatusBadge>{row.statusLabel}</StatusBadge>
                    </td>
                    <td>{row.dueDateLabel}</td>
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </Table>
      )}
    </Section>
  );
}

const Section = styled.section`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.lg};
  padding: 16px;
  background: ${(p) => p.theme.colors.surface};
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

const Title = styled.h4`
  margin: 0;
  font-size: 16px;
  color: ${(p) => p.theme.colors.text};
`;

const SubInfo = styled.p`
  margin: 2px 0 0;
  font-size: 13px;
  color: ${(p) => p.theme.colors.text};
  font-weight: 600;
`;

const RangeInfo = styled.p`
  margin: 0;
  font-size: 12px;
  color: ${(p) => p.theme.colors.textMuted};
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const Placeholder = styled.div`
  font-size: 14px;
  color: ${(p) => p.theme.colors.textMuted};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  thead th {
    text-align: left;
    padding-bottom: 8px;
    font-size: 13px;
    color: ${(p) => p.theme.colors.textMuted};
    border-bottom: 1px solid ${(p) => p.theme.colors.border};
  }
  tbody td {
    padding: 10px 0;
    border-bottom: 1px solid ${(p) => p.theme.colors.borderMuted};
  }
  tbody tr:last-child td {
    border-bottom: none;
  }
  td.amount {
    font-weight: 600;
    color: ${(p) => p.theme.colors.text};
  }
  .date-row td {
    padding: 14px 0 6px;
    font-weight: 600;
    color: ${(p) => p.theme.colors.text};
  }
`;

const CourseMeta = styled.span`
  display: block;
  font-size: 12px;
  color: ${(p) => p.theme.colors.textMuted};
  margin-top: 4px;
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 48px;
  padding: 2px 10px;
  border-radius: 999px;
  border: 1px solid ${(p) => p.theme.colors.border};
  font-size: 12px;
`;

const ErrorText = styled.span`
  font-size: 12px;
  color: ${(p) => p.theme.colors.danger};
`;
