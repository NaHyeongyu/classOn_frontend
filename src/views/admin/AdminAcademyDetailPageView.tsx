import { useMemo, type KeyboardEvent } from "react";
import {
  Card,
  CardHeader,
  CardMeta,
  ErrorBanner,
  FieldLabel,
  GridFull,
  GridTwo,
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
  SkeletonLine,
  StatsList,
  Table,
  TableStatus,
  TableWrap,
  Toolbar,
  ToolbarGroup,
  ToolbarInfo,
} from "@/components/admin/AdminStyles";
import { LoadingSpinner } from "@/components/common/Loading";
import type { AdminAcademyDetailPageViewModel } from "@/features/admin/hooks/useAdminAcademyDetailPage";
import styled from "styled-components";

type Props = AdminAcademyDetailPageViewModel;

export function AdminAcademyDetailPageView({
  header,
  filters,
  filtersDisabled,
  summary,
  payments,
  logins,
  apiLogs,
  formatDateTime,
  handleLoginKeyDown,
  handleApiKeyDown,
}: Props) {
  const applyDisabled =
    filtersDisabled ||
    !filters.from ||
    !filters.to ||
    filters.from > filters.to;

  const summaryContent = useMemo(() => {
    if (summary.loading) {
      return (
        <StatsSkeleton>
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonLine key={index} $height={16} />
          ))}
        </StatsSkeleton>
      );
    }
    if (summary.stats && summary.stats.length > 0) {
      return (
        <StatsList>
          {summary.stats.map((item) => (
            <li key={item.label}>
              <span className="label">{item.label}</span>
              <span className="value">{item.value}</span>
            </li>
          ))}
        </StatsList>
      );
    }
    return <Muted>표시할 정보가 없습니다.</Muted>;
  }, [summary.loading, summary.stats]);

  return (
    <PageWrap>
      <PageHeader>
        <HeaderBlock>
          <PageTitle>학원 상세</PageTitle>
          <PageSubtitle>{header.subtitle}</PageSubtitle>
        </HeaderBlock>
        <ToolbarGroup>
          <ToolbarInfo>조회 기간</ToolbarInfo>
          <Input
            type="date"
            lang="ko-KR"
            value={filters.from}
            onChange={(event) => filters.setFrom(event.target.value)}
            disabled={filtersDisabled}
          />
          <span>~</span>
          <Input
            type="date"
            lang="ko-KR"
            value={filters.to}
            onChange={(event) => filters.setTo(event.target.value)}
            disabled={filtersDisabled}
          />
          <MonoPrimary
            type="button"
            onClick={filters.applyFilters}
            disabled={applyDisabled}
          >
            필터 적용
          </MonoPrimary>
        </ToolbarGroup>
      </PageHeader>

      {summary.error ? (
        <ErrorBanner role="status">⚠️ {summary.error}</ErrorBanner>
      ) : null}

      <GridTwo>
        <Card>
          <CardHeader>
            <h3>기간 요약</h3>
            <CardMeta>{filters.appliedPeriod}</CardMeta>
          </CardHeader>
          {summaryContent}
        </Card>

        <PaymentsCard
          payments={payments}
          formatDateTime={formatDateTime}
        />
      </GridTwo>

      <GridFull>
        <LoginsCard
          logins={logins}
          formatDateTime={formatDateTime}
          onInputKeyDown={handleLoginKeyDown}
        />
        <ApiLogsCard
          apiLogs={apiLogs}
          formatDateTime={formatDateTime}
          onInputKeyDown={handleApiKeyDown}
        />
      </GridFull>
    </PageWrap>
  );
}

type PaymentsCardProps = {
  payments: AdminAcademyDetailPageViewModel["payments"];
  formatDateTime: (value: string | number | Date) => string;
};

function PaymentsCard({ payments, formatDateTime }: PaymentsCardProps) {
  return (
    <Card>
      <CardHeader>
        <div>
          <h3>결제 기록</h3>
          <CardMeta>{payments.rangeLabel}</CardMeta>
        </div>
        <ToolbarInfo>{payments.pageInfo}</ToolbarInfo>
      </CardHeader>
      <TableWrap>
        <Table>
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
            {payments.loading ? (
              <LoadingRow colSpan={5} message="결제 데이터를 불러오는 중…" />
            ) : payments.error ? (
              <ErrorRow colSpan={5} message={payments.error} />
            ) : payments.rows.length === 0 ? (
              <EmptyRow colSpan={5} message="표시할 결제 데이터가 없습니다." />
            ) : (
              payments.rows.map((row, index) => (
                <tr key={row.id ?? index}>
                  <td>{formatDateTime(row.createdAt)}</td>
                  <td>
                    {Math.round((row.amountCents || 0) / 100).toLocaleString(
                      "ko-KR"
                    )}
                  </td>
                  <td>{row.currency || "KRW"}</td>
                  <td>{row.status}</td>
                  <td>{row.description || row.provider || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </TableWrap>
      <Pager>
        <ToolbarInfo>
          총 {payments.totalElements.toLocaleString("ko-KR")}건
        </ToolbarInfo>
        <PagerGroup>
          <FieldLabel htmlFor="academy-payments-size">페이지 크기</FieldLabel>
          <Select
            id="academy-payments-size"
            value={payments.size}
            onChange={(event) =>
              payments.setSize(Number(event.target.value))
            }
          >
            {[20, 50, 100].map((opt) => (
              <option key={opt} value={opt}>
                {opt}개씩
              </option>
            ))}
          </Select>
          <MonoGhost
            as="button"
            type="button"
            onClick={() => payments.goTo(payments.page - 1)}
            disabled={payments.page <= 0 || payments.loading}
          >
            이전
          </MonoGhost>
          <InlineBadge>{payments.page + 1}</InlineBadge>
          <MonoGhost
            as="button"
            type="button"
            onClick={() => payments.goTo(payments.page + 1)}
            disabled={
              payments.page >= payments.totalPages - 1 || payments.loading
            }
          >
            다음
          </MonoGhost>
        </PagerGroup>
      </Pager>
    </Card>
  );
}

type LoginsCardProps = {
  logins: AdminAcademyDetailPageViewModel["logins"];
  formatDateTime: (value: string | number | Date) => string;
  onInputKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
};

function LoginsCard({
  logins,
  formatDateTime,
  onInputKeyDown,
}: LoginsCardProps) {
  return (
    <Card>
      <CardHeader>
        <div>
          <h3>로그인 기록</h3>
          <CardMeta>{logins.rangeLabel}</CardMeta>
        </div>
        <ToolbarInfo>{logins.pageInfo}</ToolbarInfo>
      </CardHeader>
      <Toolbar>
        <ToolbarGroup>
          <FieldLabel htmlFor="academy-login-search">아이디 검색</FieldLabel>
          <Input
            id="academy-login-search"
            placeholder="아이디 검색"
            value={logins.input}
            onChange={(event) => logins.setInput(event.target.value)}
            onKeyDown={onInputKeyDown}
          />
          <MonoGhost
            as="button"
            type="button"
            onClick={logins.search}
            disabled={logins.loading}
          >
            검색
          </MonoGhost>
        </ToolbarGroup>
      </Toolbar>
      <TableWrap>
        <Table>
          <thead>
            <tr>
              <th>시간</th>
              <th>아이디</th>
              <th>IP</th>
              <th>성공</th>
            </tr>
          </thead>
          <tbody>
            {logins.loading ? (
              <LoadingRow colSpan={4} message="로그인 기록을 불러오는 중…" />
            ) : logins.error ? (
              <ErrorRow colSpan={4} message={logins.error} />
            ) : logins.rows.length === 0 ? (
              <EmptyRow colSpan={4} message="표시할 데이터가 없습니다." />
            ) : (
              logins.rows.map((row, index) => (
                <tr key={row.id ?? index}>
                  <td>{formatDateTime(row.createdAt)}</td>
                  <td>{row.username}</td>
                  <td>{row.ip || "-"}</td>
                  <td>{row.success ? "성공" : "실패"}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </TableWrap>
      <Pager>
        <ToolbarInfo>
          총 {logins.totalElements.toLocaleString("ko-KR")}건
        </ToolbarInfo>
        <PagerGroup>
          <FieldLabel htmlFor="academy-login-size">페이지 크기</FieldLabel>
          <Select
            id="academy-login-size"
            value={logins.size}
            onChange={(event) => logins.setSize(Number(event.target.value))}
          >
            {[20, 50, 100].map((opt) => (
              <option key={opt} value={opt}>
                {opt}개씩
              </option>
            ))}
          </Select>
          <MonoGhost
            as="button"
            type="button"
            onClick={() => logins.goTo(logins.page - 1)}
            disabled={logins.page <= 0 || logins.loading}
          >
            이전
          </MonoGhost>
          <InlineBadge>{logins.page + 1}</InlineBadge>
          <MonoGhost
            as="button"
            type="button"
            onClick={() => logins.goTo(logins.page + 1)}
            disabled={logins.page >= logins.totalPages - 1 || logins.loading}
          >
            다음
          </MonoGhost>
        </PagerGroup>
      </Pager>
    </Card>
  );
}

type ApiLogsCardProps = {
  apiLogs: AdminAcademyDetailPageViewModel["apiLogs"];
  formatDateTime: (value: string | number | Date) => string;
  onInputKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
};

function ApiLogsCard({
  apiLogs,
  formatDateTime,
  onInputKeyDown,
}: ApiLogsCardProps) {
  return (
    <Card>
      <CardHeader>
        <div>
          <h3>API 요청 로그</h3>
          <CardMeta>{apiLogs.rangeLabel}</CardMeta>
        </div>
        <ToolbarInfo>{apiLogs.pageInfo}</ToolbarInfo>
      </CardHeader>
      <Toolbar>
        <ToolbarGroup>
          <FieldLabel htmlFor="academy-api-search">경로 검색</FieldLabel>
          <Input
            id="academy-api-search"
            placeholder="예: /api/admin"
            value={apiLogs.input}
            onChange={(event) => apiLogs.setInput(event.target.value)}
            onKeyDown={onInputKeyDown}
          />
          <MonoGhost
            as="button"
            type="button"
            onClick={apiLogs.search}
            disabled={apiLogs.loading}
          >
            검색
          </MonoGhost>
        </ToolbarGroup>
      </Toolbar>
      <TableWrap>
        <Table>
          <thead>
            <tr>
              <th>시간</th>
              <th>메서드</th>
              <th>경로</th>
              <th>상태</th>
              <th>IP</th>
              <th>사용자 ID</th>
            </tr>
          </thead>
          <tbody>
            {apiLogs.loading ? (
              <LoadingRow colSpan={6} message="API 로그를 불러오는 중…" />
            ) : apiLogs.error ? (
              <ErrorRow colSpan={6} message={apiLogs.error} />
            ) : apiLogs.rows.length === 0 ? (
              <EmptyRow colSpan={6} message="표시할 데이터가 없습니다." />
            ) : (
              apiLogs.rows.map((row, index) => (
                <tr key={row.id ?? index}>
                  <td>{formatDateTime(row.createdAt)}</td>
                  <td>{row.method}</td>
                  <td>{row.path}</td>
                  <td>{row.status}</td>
                  <td>{row.ip || "-"}</td>
                  <td>{row.userId || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </TableWrap>
      <Pager>
        <ToolbarInfo>
          총 {apiLogs.totalElements.toLocaleString("ko-KR")}건
        </ToolbarInfo>
        <PagerGroup>
          <FieldLabel htmlFor="academy-api-size">페이지 크기</FieldLabel>
          <Select
            id="academy-api-size"
            value={apiLogs.size}
            onChange={(event) => apiLogs.setSize(Number(event.target.value))}
          >
            {[20, 50, 100].map((opt) => (
              <option key={opt} value={opt}>
                {opt}개씩
              </option>
            ))}
          </Select>
          <MonoGhost
            as="button"
            type="button"
            onClick={() => apiLogs.goTo(apiLogs.page - 1)}
            disabled={apiLogs.page <= 0 || apiLogs.loading}
          >
            이전
          </MonoGhost>
          <InlineBadge>{apiLogs.page + 1}</InlineBadge>
          <MonoGhost
            as="button"
            type="button"
            onClick={() => apiLogs.goTo(apiLogs.page + 1)}
            disabled={apiLogs.page >= apiLogs.totalPages - 1 || apiLogs.loading}
          >
            다음
          </MonoGhost>
        </PagerGroup>
      </Pager>
    </Card>
  );
}

function LoadingRow({ colSpan, message }: { colSpan: number; message: string }) {
  return (
    <tr>
      <td colSpan={colSpan}>
        <TableStatus>
          <SpinnerInline aria-hidden />
          <span>{message}</span>
        </TableStatus>
      </td>
    </tr>
  );
}

function ErrorRow({ colSpan, message }: { colSpan: number; message: string }) {
  return (
    <tr>
      <td colSpan={colSpan}>
        <TableStatus $variant="error">⚠️ {message}</TableStatus>
      </td>
    </tr>
  );
}

function EmptyRow({ colSpan, message }: { colSpan: number; message: string }) {
  return (
    <tr>
      <td colSpan={colSpan}>
        <TableStatus>{message}</TableStatus>
      </td>
    </tr>
  );
}

const HeaderBlock = styled.div`
  display: grid;
  gap: 4px;
`;

const StatsSkeleton = styled.div`
  display: grid;
  gap: 8px;
`;

const SpinnerInline = styled(LoadingSpinner)`
  width: 16px;
  height: 16px;
`;
