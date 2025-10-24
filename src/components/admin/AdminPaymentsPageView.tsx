import styled from "styled-components";
import {
  Card,
  CardHeader,
  CardMeta,
  ErrorBanner,
  FieldLabel,
  Input,
  MonoGhost,
  MonoPrimary,
  PageHeader,
  PageSubtitle,
  PageTitle,
  PageWrap,
  Pager,
  PagerGroup,
  Select,
  TableStatus,
  Toolbar,
  ToolbarGroup,
  ToolbarInfo,
} from "@/components/admin/AdminStyles";
import type { AdminPaymentRow } from "@/features/admin/useAdminPaymentsPage";

type AdminPaymentsPageViewProps = {
  rows: AdminPaymentRow[];
  loading: boolean;
  error: string | null;
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  from: string;
  to: string;
  onChangeFrom: (value: string) => void;
  onChangeTo: (value: string) => void;
  rangeLabel: string;
  displayedRange: string;
  rangeSummary: string | null;
  pageInfo: string;
  onApplyRange: () => void;
  onChangeSize: (nextSize: number) => void;
  onChangePage: (nextPage: number) => void;
};

export function AdminPaymentsPageView({
  rows,
  loading,
  error,
  page,
  size,
  totalPages,
  totalElements,
  from,
  to,
  onChangeFrom,
  onChangeTo,
  rangeLabel,
  displayedRange,
  rangeSummary,
  pageInfo,
  onApplyRange,
  onChangeSize,
  onChangePage,
}: AdminPaymentsPageViewProps) {
  return (
    <PageWrap>
      <PageHeader>
        <div>
          <PageTitle>결제 기록</PageTitle>
          <PageSubtitle>{displayedRange}</PageSubtitle>
        </div>
        <ToolbarGroup>
          <FieldLabel htmlFor="admin-payments-from">기간</FieldLabel>
          <Input
            id="admin-payments-from"
            type="date"
            lang="ko-KR"
            value={from}
            onChange={(event) => onChangeFrom(event.target.value)}
          />
          <span>~</span>
          <Input
            id="admin-payments-to"
            type="date"
            lang="ko-KR"
            value={to}
            onChange={(event) => onChangeTo(event.target.value)}
          />
          <MonoPrimary
            type="button"
            onClick={onApplyRange}
            disabled={loading}
          >
            필터 적용
          </MonoPrimary>
        </ToolbarGroup>
      </PageHeader>

      {error ? <ErrorBanner role="status">⚠️ {error}</ErrorBanner> : null}

      <Card>
        <CardHeader>
          <div>
            <h3>결제 목록</h3>
            <CardMeta>{pageInfo}</CardMeta>
          </div>
          <ToolbarInfo>{rangeLabel}</ToolbarInfo>
        </CardHeader>
        <Toolbar>
          <ToolbarInfo>
            표시된 결제: {rows.length.toLocaleString("ko-KR")}건
          </ToolbarInfo>
          <ToolbarGroup>
            <FieldLabel htmlFor="admin-payments-size">페이지 크기</FieldLabel>
            <Select
              id="admin-payments-size"
              value={size}
              onChange={(event) =>
                onChangeSize(Number(event.target.value))
              }
            >
              {[20, 50, 100].map((opt) => (
                <option key={opt} value={opt}>
                  {opt}개씩
                </option>
              ))}
            </Select>
          </ToolbarGroup>
        </Toolbar>
        <TableWrap>
          <table>
            <thead>
              <tr>
                <th>시간</th>
                <th>금액(원)</th>
                <th>통화</th>
                <th>상태</th>
                <th>비고</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5}>
                    <TableStatus>
                      <span>결제 데이터를 불러오는 중…</span>
                    </TableStatus>
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <TableStatus>표시할 데이터가 없습니다.</TableStatus>
                  </td>
                </tr>
              ) : (
                rows.map((row, index) => (
                  <tr key={row.id ?? index}>
                    <td>{formatDateTime(row.createdAt)}</td>
                    <td>
                      {Math.round((row.amountCents || 0) / 100).toLocaleString(
                        "ko-KR",
                      )}
                    </td>
                    <td>{row.currency || "KRW"}</td>
                    <td>{row.status}</td>
                    <td>{row.description || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </TableWrap>

        <Pager>
          <PagerGroup>
            <PagerButton
              type="button"
              onClick={() => onChangePage(page - 1)}
              disabled={page <= 0 || loading}
            >
              이전
            </PagerButton>
            <PagerInfo>
              {page + 1} / {totalPages || 1}
            </PagerInfo>
            <PagerButton
              type="button"
              onClick={() => onChangePage(page + 1)}
              disabled={page >= totalPages - 1 || loading}
            >
              다음
            </PagerButton>
          </PagerGroup>
          <ToolbarInfo>
            총 {totalElements.toLocaleString("ko-KR")}건
          </ToolbarInfo>
        </Pager>

        {rangeSummary ? (
          <SummaryHint>표시 범위: {rangeSummary}</SummaryHint>
        ) : null}
      </Card>
    </PageWrap>
  );
}

const TableWrap = styled.div`
  width: 100%;
  overflow: auto;
  border: 1px solid #f1f5f9;
  border-radius: 12px;
  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    overflow: hidden;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    background: #fff;
  }
  thead th {
    text-align: left;
    font-size: 12px;
    color: #6b7280;
    font-weight: 800;
    padding: 10px 12px;
    border-bottom: 1px solid #e5e7eb;
    background: #f9fafb;
  }
  tbody td {
    font-size: 13px;
    color: #0f172a;
    padding: 10px 12px;
    border-bottom: 1px solid #f1f5f9;
  }
  tbody tr:nth-child(odd) td {
    background: #fcfcfd;
  }
  tbody tr:hover td {
    background: #f9fafb;
  }
`;

const PagerButton = styled(MonoGhost)`
  height: 32px;
  padding: 0 12px;
  font-size: 13px;
`;

const PagerInfo = styled.span`
  font-size: 12px;
  color: #475569;
  font-weight: 700;
`;

const SummaryHint = styled.div`
  margin-top: 8px;
  font-size: 12px;
  color: #475569;
`;

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
