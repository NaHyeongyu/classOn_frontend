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
  ToolbarGroup,
  ToolbarInfo,
  HeaderBlock,
} from "@/components/admin/AdminStyles";
import type { AdminLoginRow } from "@/features/admin/useAdminLoginsPage";

type AdminLoginsPageViewProps = {
  rows: AdminLoginRow[];
  loading: boolean;
  error: string | null;
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  searchInput: string;
  searchQuery: string;
  onChangeSearchInput: (value: string) => void;
  onSearch: () => void;
  onChangeSize: (nextSize: number) => void;
  onChangePage: (nextPage: number) => void;
  rangeLabel: string;
  pageInfo: string;
};

export function AdminLoginsPageView({
  rows,
  loading,
  error,
  page,
  size,
  totalPages,
  totalElements,
  searchInput,
  searchQuery,
  onChangeSearchInput,
  onSearch,
  onChangeSize,
  onChangePage,
  rangeLabel,
  pageInfo,
}: AdminLoginsPageViewProps) {
  return (
    <PageWrap>
      <PageHeader>
        <HeaderBlock>
          <PageTitle>로그인 기록</PageTitle>
          <PageSubtitle>{rangeLabel}</PageSubtitle>
        </HeaderBlock>
        <ToolbarGroup>
          <FieldLabel htmlFor="admin-login-search">아이디 검색</FieldLabel>
          <Input
            id="admin-login-search"
            placeholder="아이디 검색"
            value={searchInput}
            onChange={(event) => onChangeSearchInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                onSearch();
              }
            }}
          />
          <MonoPrimary
            type="button"
            onClick={onSearch}
            disabled={loading}
          >
            검색
          </MonoPrimary>
        </ToolbarGroup>
      </PageHeader>

      {error ? (
        <ErrorBanner role="status">⚠️ {error}</ErrorBanner>
      ) : null}

      <Card>
        <CardHeader>
          <div>
            <h3>로그 목록</h3>
            <CardMeta>{pageInfo}</CardMeta>
          </div>
          <ToolbarInfo>
            검색어: {searchQuery ? searchQuery : "없음"} · 총{" "}
            {totalElements.toLocaleString("ko-KR")}건
          </ToolbarInfo>
        </CardHeader>
        <TableWrap>
          <table>
            <thead>
              <tr>
                <th>시간</th>
                <th>아이디</th>
                <th>IP</th>
                <th>성공</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4}>
                    <TableStatus>
                      <span>로그를 불러오는 중…</span>
                    </TableStatus>
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={4}>
                    <TableStatus>표시할 데이터가 없습니다.</TableStatus>
                  </td>
                </tr>
              ) : (
                rows.map((row, index) => (
                  <tr key={row.id ?? index}>
                    <td>{formatDateTime(row.createdAt)}</td>
                    <td>{row.username}</td>
                    <td>{row.ip || "-"}</td>
                    <td>{row.success ? "Y" : "N"}</td>
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
          <PagerGroup>
            <FieldLabel htmlFor="admin-login-size">페이지 크기</FieldLabel>
            <Select
              id="admin-login-size"
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
          </PagerGroup>
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

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
