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
  Select,
  PageHeader,
  PageSubtitle,
  PageTitle,
  PageWrap,
  Table,
  TableStatus,
  TableWrap,
  Toolbar,
  ToolbarGroup,
  ToolbarInfo,
} from "@/components/admin/AdminStyles";
import { LoadingSpinner } from "@/components/common/Loading";
import type {
  StatusFilter,
  TypeFilter,
} from "@/features/admin/useAdminFeedbacksPage";
import type { AdminFeedbackRow } from "@/api/adminFeedback";
import { formatKoreanDateTime } from "@/lib/format";

type AdminFeedbacksPageViewProps = {
  rows: AdminFeedbackRow[];
  loading: boolean;
  error: string | null;
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  from: string;
  to: string;
  typeInput: TypeFilter;
  statusInput: StatusFilter;
  qInput: string;
  headerSubtitle: string;
  pageInfo: string;
  onChangeFrom: (value: string) => void;
  onChangeTo: (value: string) => void;
  onChangeType: (value: TypeFilter) => void;
  onChangeStatus: (value: StatusFilter) => void;
  onChangeQuery: (value: string) => void;
  onApplyFilters: () => void;
  onChangeSize: (nextSize: number) => void;
  onChangePage: (nextPage: number) => void;
  onUpdateStatus: (id: number, nextStatus: "NEW" | "ACK" | "CLOSED") => void;
};

export function AdminFeedbacksPageView({
  rows,
  loading,
  error,
  page,
  size,
  totalPages,
  totalElements,
  from,
  to,
  typeInput,
  statusInput,
  qInput,
  headerSubtitle,
  pageInfo,
  onChangeFrom,
  onChangeTo,
  onChangeType,
  onChangeStatus,
  onChangeQuery,
  onApplyFilters,
  onChangeSize,
  onChangePage,
  onUpdateStatus,
}: AdminFeedbacksPageViewProps) {
  return (
    <PageWrap>
      <PageHeader>
        <div>
          <PageTitle>피드백</PageTitle>
          <PageSubtitle>{headerSubtitle}</PageSubtitle>
        </div>
        <Toolbar>
          <ToolbarGroup>
            <FieldLabel htmlFor="fb-type">유형</FieldLabel>
            <Select
              id="fb-type"
              value={typeInput}
              onChange={(event) =>
                onChangeType(event.target.value as TypeFilter)
              }
            >
              <option value="">전체</option>
              <option value="BUG">오류</option>
              <option value="FEATURE">기능</option>
            </Select>
            <FieldLabel htmlFor="fb-status">상태</FieldLabel>
            <Select
              id="fb-status"
              value={statusInput}
              onChange={(event) =>
                onChangeStatus(event.target.value as StatusFilter)
              }
            >
              <option value="">전체</option>
              <option value="NEW">신규</option>
              <option value="ACK">확인</option>
              <option value="CLOSED">종료</option>
            </Select>
            <FieldLabel htmlFor="fb-q">검색</FieldLabel>
            <Input
              id="fb-q"
              placeholder="제목/내용 검색"
              value={qInput}
              onChange={(event) => onChangeQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  onApplyFilters();
                }
              }}
            />
          </ToolbarGroup>
          <ToolbarGroup>
            <FieldLabel htmlFor="fb-from">기간</FieldLabel>
            <Input
              id="fb-from"
              type="date"
              lang="ko-KR"
              value={from}
              onChange={(event) => onChangeFrom(event.target.value)}
            />
            <span>~</span>
            <Input
              id="fb-to"
              type="date"
              lang="ko-KR"
              value={to}
              onChange={(event) => onChangeTo(event.target.value)}
            />
            <MonoPrimary
              type="button"
              onClick={onApplyFilters}
              disabled={loading}
            >
              필터 적용
            </MonoPrimary>
          </ToolbarGroup>
        </Toolbar>
      </PageHeader>

      {error ? <ErrorBanner role="status">⚠️ {error}</ErrorBanner> : null}

      <Card>
        <CardHeader>
          <div>
            <h3>제출 목록</h3>
            <CardMeta>총 {totalElements.toLocaleString("ko-KR")}건</CardMeta>
          </div>
          <ToolbarInfo>{pageInfo}</ToolbarInfo>
        </CardHeader>
        <TableWrap>
          <Table>
            <thead>
              <tr>
                <th style={{ minWidth: 150 }}>시간</th>
                <th>학원</th>
                <th>사용자</th>
                <th>유형</th>
                <th>상태</th>
                <th>제목</th>
                <th>연락처</th>
                <th>페이지</th>
                <th>브라우저</th>
                <th>작업</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={10}>
                    <TableStatus>
                      <LoadingSpinner />
                      <span>불러오는 중…</span>
                    </TableStatus>
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={10}>
                    <TableStatus>표시할 데이터가 없습니다.</TableStatus>
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id}>
                    <td>{formatKoreanDateTime(row.createdAt)}</td>
                    <td>
                      {row.academyName
                        ? `${row.academyName} (#${row.academyId})`
                        : "-"}
                    </td>
                    <td>
                      {row.username ? `${row.username} (#${row.userId})` : "-"}
                    </td>
                    <td>{row.type === "BUG" ? "오류" : "기능"}</td>
                    <td>
                      <StatusSelect
                        value={row.status}
                        onChange={(event) =>
                          onUpdateStatus(
                            row.id,
                            event.target.value as "NEW" | "ACK" | "CLOSED"
                          )
                        }
                      >
                        <option value="NEW">신규</option>
                        <option value="ACK">확인</option>
                        <option value="CLOSED">종료</option>
                      </StatusSelect>
                    </td>
                    <td title={row.title}>{row.title}</td>
                    <td>{row.contact || "-"}</td>
                    <td>
                      {row.pageUrl ? (
                        <a href={row.pageUrl} target="_blank" rel="noreferrer">
                          열기
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td title={row.userAgent || ""}>
                      {row.userAgent ? shortenUserAgent(row.userAgent) : "-"}
                    </td>
                    <td>
                      <MonoGhost
                        as="button"
                        type="button"
                        onClick={() => window.alert(row.body)}
                      >
                        내용 보기
                      </MonoGhost>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </TableWrap>
      </Card>

      <Toolbar>
        <ToolbarGroup>
          <ToolbarInfo>{pageInfo}</ToolbarInfo>
        </ToolbarGroup>
        <ToolbarGroup>
          <FieldLabel htmlFor="fb-size">표시 개수</FieldLabel>
          <Select
            id="fb-size"
            value={size}
            onChange={(event) => onChangeSize(Number(event.target.value))}
          >
            {[20, 50, 100].map((option) => (
              <option key={option} value={option}>
                {option}개씩
              </option>
            ))}
          </Select>
          <MonoGhost
            as="button"
            type="button"
            onClick={() => onChangePage(page - 1)}
            disabled={page <= 0 || loading}
          >
            이전
          </MonoGhost>
          <MonoGhost
            as="button"
            type="button"
            onClick={() => onChangePage(page + 1)}
            disabled={page >= totalPages - 1 || loading}
          >
            다음
          </MonoGhost>
        </ToolbarGroup>
      </Toolbar>
    </PageWrap>
  );
}

function shortenUserAgent(ua: string) {
  try {
    return ua.length > 40 ? `${ua.slice(0, 40)}…` : ua;
  } catch {
    return ua;
  }
}

const StatusSelect = styled.select`
  height: 32px;
  padding: 0 10px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: #fff;
  font-size: 13px;
`;
