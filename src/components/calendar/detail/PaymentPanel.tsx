import styled from "styled-components";
import type { CalendarPaymentRow } from "@/features/calendar/useCalendarPaymentList";
import { PrimaryButtonSm, TableBase, Skeleton } from "@/components/common/UI";

export type PaymentPanelProps = {
  rows?: CalendarPaymentRow[];
  loading?: boolean;
  error?: string | null;
  onMore?: () => void;
};

export function PaymentPanel({
  rows = [],
  loading,
  error,
  onMore,
}: PaymentPanelProps) {
  return (
    <Section>
      <Header>
        <TitleGroup>
          <SectionIcon aria-hidden>{walletIcon}</SectionIcon>
          <TitleStack>
            <Title>결제 관리</Title>
            <HeadMeta>
              <SubInfo>결제 예정일이 임박한 순으로 정렬됩니다.</SubInfo>
              {error ? <ErrorText>{error}</ErrorText> : null}
            </HeadMeta>
          </TitleStack>
        </TitleGroup>
        {onMore ? (
          <Actions>
            <PrimaryButtonSm type="button" onClick={onMore}>
              더보기
            </PrimaryButtonSm>
          </Actions>
        ) : null}
      </Header>
      <TableWrapper>
        <CenteredTable>
          <colgroup>
            <col style={{ width: "70px" }} />
          <col style={{ width: "26%" }} />
          <col style={{ width: "17%" }} />
          <col style={{ width: "25%" }} />
            <col />
          </colgroup>
          <thead>
            <tr>
              <th>번호</th>
              <th>학생</th>
              <th>상태</th>
              <th>총 결제금액</th>
              <th>결제 예정일</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5}>
                  <Skeleton h={32} />
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <NoData>표시할 결제 대기/미납 학생이 없습니다.</NoData>
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr key={row.id}>
                  <td>{index + 1}</td>
                  <td>
                    <StudentName>{row.studentName}</StudentName>
                    {row.studentCode ? <MetaText>{row.studentCode}</MetaText> : null}
                    {row.courseTitle ? <CourseName>{row.courseTitle}</CourseName> : null}
                  </td>
                  <td>
                    <StatusBadge data-status={row.status ?? undefined}>{row.statusLabel}</StatusBadge>
                  </td>
                  <td>{row.amountLabel}</td>
                  <td>{renderDueDate(row)}</td>
                </tr>
              ))
            )}
          </tbody>
        </CenteredTable>
      </TableWrapper>
    </Section>
  );
}

function renderDueDate(row: CalendarPaymentRow) {
  if (!row.dueDateRaw) return row.dueDateLabel ?? "-";
  const parsed = new Date(row.dueDateRaw);
  if (Number.isNaN(parsed.getTime())) return row.dueDateLabel ?? "-";
  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return (
    <DueDateCell>
      <span className="year">{year}</span>
      <span className="day">{`${month}.${day}`}</span>
    </DueDateCell>
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
  height: 100%;
  min-height: 0;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${(p) => p.theme.spacing.md};
  flex-wrap: wrap;
  margin-bottom: ${(p) => p.theme.spacing.sm};
`;

const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing.sm};
`;

const TitleStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing.xs};
`;

const SectionIcon = styled.span`
  width: 32px;
  height: 32px;
  border-radius: ${(p) => p.theme.radii.md};
  display: grid;
  place-items: center;
  background: ${(p) => p.theme.colors.primarySurface};
  color: ${(p) => p.theme.colors.primary};
  flex-shrink: 0;
`;

const Title = styled.h3`
  margin: 0;
  font-size: ${(p) => p.theme.font.size.lg};
  font-weight: ${(p) => p.theme.font.weight.semiBold};
  color: ${(p) => p.theme.colors.text};
`;

const HeadMeta = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing.xs};
`;

const SubInfo = styled.span`
  color: ${(p) => p.theme.colors.textMuted};
  font-size: ${(p) => p.theme.font.size.sm};
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const TableWrapper = styled.div`
  width: 100%;
  overflow: auto;
  flex: 1;
  min-height: 0;
`;

const CenteredTable = styled(TableBase)`
  min-width: 100%;
  th,
  td {
    text-align: center;
  }
  thead th {
    text-align: center;
    white-space: nowrap;
  }
  tbody td {
    font-size: 14px;
  }
`;

const statusBadgeColors: Record<string, string> = {
  UNPAID: "#f97316",
  PENDING: "#2563EB",
  COMPLETED: "#059669",
  FAILED: "#dc2626",
};

const StatusBadge = styled.span<{ "data-status"?: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  background: ${({ "data-status": status }) =>
    (status && `${statusBadgeColors[status] ?? "#d1d5db"}1A`) || "rgba(209,213,219,0.2)"};
  color: ${({ "data-status": status }) => statusBadgeColors[status ?? "UNPAID"] ?? "#52525b"};
`;

const MetaText = styled.span`
  display: block;
  font-size: 12px;
  color: ${(p) => p.theme.colors.textMuted};
  margin-top: 2px;
`;

const ErrorText = styled.span`
  font-size: 12px;
  color: ${(p) => p.theme.colors.danger};
`;

const DueDateCell = styled.span`
  display: inline-flex;
  flex-direction: column;
  line-height: 1.2;
  .year {
    font-size: 12px;
    color: ${(p) => p.theme.colors.textMuted};
  }
  .day {
    font-size: 15px;
    font-weight: 600;
    color: ${(p) => p.theme.colors.text};
  }
`;

const StudentName = styled.strong`
  display: block;
  font-size: ${(p) => p.theme.font.size.md}; /* 14px */
  font-weight: ${(p) => p.theme.font.weight.semiBold};
  color: ${(p) => p.theme.colors.text};
  letter-spacing: -0.01em;
`;

const CourseName = styled.span`
  display: block;
  font-size: ${(p) => p.theme.font.size.sm}; /* 13px */
  color: ${(p) => p.theme.colors.textMuted};
  margin-top: 2px;
`;

const NoData = styled.div`
  padding: 20px 0;
  text-align: center;
  font-size: 14px;
  color: ${(p) => p.theme.colors.textMuted};
`;

const walletIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
    <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
  </svg>
);
