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
  Muted,
} from "@/components/admin/AdminStyles";
import type {
  AdminApiLogRow,
  ErrorFilter,
} from "@/features/admin/useAdminApiLogsPage";

type AdminApiLogsPageViewProps = {
  rows: AdminApiLogRow[];
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
  pathInput: string;
  onChangePathInput: (value: string) => void;
  errorsFilterInput: ErrorFilter;
  onChangeErrorsFilter: (value: ErrorFilter) => void;
  pathQuery: string;
  errorsFilter: ErrorFilter;
  rangeLabel: string;
  displayedRange: string;
  pageInfo: string;
  onApplyFilters: () => void;
  onChangeSize: (nextSize: number) => void;
  onChangePage: (nextPage: number) => void;
};

export function AdminApiLogsPageView({
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
  pathInput,
  onChangePathInput,
  errorsFilterInput,
  onChangeErrorsFilter,
  pathQuery,
  errorsFilter,
  rangeLabel,
  displayedRange,
  pageInfo,
  onApplyFilters,
  onChangeSize,
  onChangePage,
}: AdminApiLogsPageViewProps) {
  return (
    <PageWrap>
      <PageHeader>
        <div>
          <PageTitle>API 요청 로그</PageTitle>
          <PageSubtitle>{displayedRange}</PageSubtitle>
        </div>
        <ToolbarGroup>
          <FieldLabel htmlFor="api-log-from">기간</FieldLabel>
          <Input
            id="api-log-from"
            type="date"
            lang="ko-KR"
            value={from}
            onChange={(event) => onChangeFrom(event.target.value)}
          />
          <span>~</span>
          <Input
            id="api-log-to"
            type="date"
            lang="ko-KR"
            value={to}
            onChange={(event) => onChangeTo(event.target.value)}
          />
          <FieldLabel htmlFor="api-log-path">경로</FieldLabel>
          <Input
            id="api-log-path"
            placeholder="예: /api/admin"
            value={pathInput}
            onChange={(event) => onChangePathInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                onApplyFilters();
              }
            }}
          />
          <Select
            aria-label="오류 필터"
            value={errorsFilterInput}
            onChange={(event) =>
              onChangeErrorsFilter(event.target.value as ErrorFilter)
            }
          >
            <option value="all">모든 상태</option>
            <option value="errors">오류만 (상태 ≥ 400)</option>
          </Select>
          <MonoPrimary
            type="button"
            onClick={onApplyFilters}
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
            <h3>요청 목록</h3>
            <CardMeta>{pageInfo}</CardMeta>
          </div>
          <ToolbarInfo>{rangeLabel}</ToolbarInfo>
        </CardHeader>
        <Toolbar>
          <ToolbarInfo>
            경로 필터: {pathQuery || "없음"} · 오류 필터:{" "}
            {errorsFilter === "errors" ? "오류만" : "전체"}
          </ToolbarInfo>
          <ToolbarGroup>
            <FieldLabel htmlFor="api-log-size">페이지 크기</FieldLabel>
            <Select
              id="api-log-size"
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
                <th style={{ minWidth: 140 }}>시간</th>
                <th style={{ width: 80 }}>메서드</th>
                <th>경로</th>
                <th style={{ width: 80 }}>상태</th>
                <th style={{ width: 160 }}>IP</th>
                <th style={{ width: 160 }}>사용자</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6}>
                    <TableStatus>
                      <span>API 로그를 불러오는 중…</span>
                    </TableStatus>
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <TableStatus>표시할 데이터가 없습니다.</TableStatus>
                  </td>
                </tr>
              ) : (
                rows.map((row, index) => (
                  <tr key={row.id ?? index}>
                    <td>{formatDateTime(row.createdAt)}</td>
                    <td>{row.method}</td>
                    <td>
                      <PathCell title={row.path}>{row.path}</PathCell>
                    </td>
                    <td>
                      <StatusBadge data-error={row.status >= 400 || undefined}>
                        {row.status}
                      </StatusBadge>
                    </td>
                    <td>{row.ip || "-"}</td>
                    <td>{row.userId || <Muted>익명</Muted>}</td>
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
    vertical-align: middle;
  }
  tbody tr:nth-child(odd) td {
    background: #fcfcfd;
  }
  tbody tr:hover td {
    background: #f9fafb;
  }
`;

const PathCell = styled.span`
  display: inline-block;
  max-width: 320px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StatusBadge = styled.span<{ "data-error"?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 54px;
  padding: 4px 8px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 12px;
  background: ${({ "data-error": error }) =>
    error ? "#fee2e2" : "#dcfce7"};
  color: ${({ "data-error": error }) => (error ? "#b91c1c" : "#15803d")};
  border: 1px solid
    ${({ "data-error": error }) => (error ? "#fecaca" : "#bbf7d0")};
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

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
