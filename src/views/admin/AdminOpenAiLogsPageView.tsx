import styled from "styled-components";
import {
  Card,
  CardHeader,
  CardMeta,
  ErrorBanner,
  FieldLabel,
  InlineBadge,
  Input,
  MonoGhost,
  MonoPrimary,
  Muted,
  PageHeader,
  PageSubtitle,
  PageTitle,
  PageWrap,
  Pager,
  PagerGroup,
  Select,
  Table,
  TableStatus,
  TableWrap,
  Toolbar,
  ToolbarGroup,
  ToolbarInfo,
} from "@/components/admin/AdminStyles";
import { LoadingSpinner } from "@/components/common/Loading";
import type {
  AdminOpenAiLogRow,
  SuccessFilter,
} from "@/features/admin/useAdminOpenAiLogsPage";
import { formatKoreanDateTime } from "@/lib/format";

type AdminOpenAiLogsPageViewProps = {
  rows: AdminOpenAiLogRow[];
  loading: boolean;
  error: string | null;
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  from: string;
  to: string;
  modelInput: string;
  successFilterInput: SuccessFilter;
  modelQuery: string;
  successFilter: SuccessFilter;
  rangeLabel: string;
  displayedRange: string;
  pageInfo: string;
  onChangeFrom: (value: string) => void;
  onChangeTo: (value: string) => void;
  onChangeModelInput: (value: string) => void;
  onChangeSuccessFilter: (value: SuccessFilter) => void;
  onApplyFilters: () => void;
  onChangeSize: (nextSize: number) => void;
  onChangePage: (nextPage: number) => void;
};

export function AdminOpenAiLogsPageView({
  rows,
  loading,
  error,
  page,
  size,
  totalPages,
  totalElements,
  from,
  to,
  modelInput,
  successFilterInput,
  modelQuery,
  successFilter,
  rangeLabel,
  displayedRange,
  pageInfo,
  onChangeFrom,
  onChangeTo,
  onChangeModelInput,
  onChangeSuccessFilter,
  onApplyFilters,
  onChangeSize,
  onChangePage,
}: AdminOpenAiLogsPageViewProps) {
  return (
    <PageWrap>
      <PageHeader>
        <div>
          <PageTitle>OpenAI 호출 로그</PageTitle>
          <PageSubtitle>{displayedRange}</PageSubtitle>
        </div>
        <ToolbarGroup>
          <FieldLabel htmlFor="openai-log-from">기간</FieldLabel>
          <Input
            id="openai-log-from"
            type="date"
            lang="ko-KR"
            value={from}
            onChange={(event) => onChangeFrom(event.target.value)}
          />
          <span>~</span>
          <Input
            id="openai-log-to"
            type="date"
            lang="ko-KR"
            value={to}
            onChange={(event) => onChangeTo(event.target.value)}
          />
          <FieldLabel htmlFor="openai-log-model">모델</FieldLabel>
          <Input
            id="openai-log-model"
            placeholder="예: gpt-4o"
            value={modelInput}
            onChange={(event) => onChangeModelInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                onApplyFilters();
              }
            }}
          />
          <Select
            aria-label="성공 여부"
            value={successFilterInput}
            onChange={(event) =>
              onChangeSuccessFilter(event.target.value as SuccessFilter)
            }
          >
            <option value="all">전체</option>
            <option value="success">성공만</option>
            <option value="fail">실패만</option>
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
            <h3>호출 목록</h3>
            <CardMeta>{pageInfo}</CardMeta>
          </div>
          <ToolbarInfo>{rangeLabel}</ToolbarInfo>
        </CardHeader>
        <Toolbar>
          <ToolbarInfo>
            모델 필터: {modelQuery ? modelQuery : "전체"} · 성공 필터:{" "}
            {successFilterLabel(successFilter)}
          </ToolbarInfo>
          <ToolbarGroup>
            <FieldLabel htmlFor="openai-log-size">페이지 크기</FieldLabel>
            <Select
              id="openai-log-size"
              value={size}
              onChange={(event) => onChangeSize(Number(event.target.value))}
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
          <Table>
            <thead>
              <tr>
                <th>시간</th>
                <th>모델</th>
                <th>토큰</th>
                <th>성공</th>
                <th>레이턴시(ms)</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5}>
                    <TableStatus>
                      <SpinnerInline aria-hidden />
                      <span>OpenAI 로그를 불러오는 중…</span>
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
                    <td>{row.model || "-"}</td>
                    <td>
                      {row.tokens != null
                        ? row.tokens.toLocaleString("ko-KR")
                        : "-"}
                    </td>
                    <td>{row.success ? "성공" : "실패"}</td>
                    <td>
                      {row.latencyMs != null
                        ? row.latencyMs.toLocaleString("ko-KR")
                        : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </TableWrap>
        <Pager>
          <ToolbarInfo>총 {totalElements.toLocaleString("ko-KR")}건</ToolbarInfo>
          <PagerGroup>
            <MonoGhost
              as="button"
              type="button"
              onClick={() => onChangePage(page - 1)}
              disabled={page <= 0 || loading}
            >
              이전
            </MonoGhost>
            <InlineBadge>{totalPages === 0 ? 0 : page + 1}</InlineBadge>
            <MonoGhost
              as="button"
              type="button"
              onClick={() => onChangePage(page + 1)}
              disabled={page >= totalPages - 1 || loading}
            >
              다음
            </MonoGhost>
          </PagerGroup>
        </Pager>
        {!loading && rows.length > 0 ? (
          <Muted>
            현재 {rows.length.toLocaleString("ko-KR")}건의 호출이 표시되고 있습니다.
          </Muted>
        ) : null}
      </Card>
    </PageWrap>
  );
}

function successFilterLabel(filter: SuccessFilter) {
  switch (filter) {
    case "success":
      return "성공만";
    case "fail":
      return "실패만";
    default:
      return "전체";
  }
}

function formatDateTime(value: string) {
  const formatted = formatKoreanDateTime(value, { includeWeekday: true });
  return formatted === "—" ? value : formatted;
}

const SpinnerInline = styled(LoadingSpinner)`
  width: 16px;
  height: 16px;
`;
