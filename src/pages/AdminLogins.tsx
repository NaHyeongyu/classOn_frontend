import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
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
} from '@/components/admin/AdminStyles';
import { useToast } from '@/components/common/Toast';
import { LoadingSpinner } from '@/components/common/Loading';
import { listLoginLogsPaged } from '@/api/admin';
import { formatKoreanDateTime } from '@/lib/format';

type AdminLoginRow = {
  id?: number;
  createdAt: string;
  username: string;
  ip?: string | null;
  success: boolean;
};

type PagedResponse<T> = {
  content: T[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
};

export default function AdminLogins() {
  const { error: toastError } = useToast();
  const [rows, setRows] = useState<AdminLoginRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const sizeRef = useRef(size);
  const queryRef = useRef(searchQuery);

  useEffect(() => {
    sizeRef.current = size;
  }, [size]);
  useEffect(() => {
    queryRef.current = searchQuery;
  }, [searchQuery]);

  const loadLogins = useCallback(
    async (pageToLoad: number, sizeToLoad: number, keyword: string) => {
      setLoading(true);
      setError(null);
      try {
        const res = await listLoginLogsPaged({
          page: pageToLoad,
          size: sizeToLoad,
          q: keyword ? keyword : undefined,
        });
        const data = res as PagedResponse<AdminLoginRow>;
        setRows(data.content || []);
        setPage(data.page);
        setSize(data.size);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements ?? data.content?.length ?? 0);
      } catch (err) {
        const message = err instanceof Error ? err.message : '로그인 기록을 불러오지 못했습니다.';
        setError(message);
        toastError(message);
      } finally {
        setLoading(false);
      }
    },
    [toastError],
  );

  useEffect(() => {
    void loadLogins(0, sizeRef.current, queryRef.current);
  }, [loadLogins]);

  const handleSearch = useCallback(() => {
    const keyword = searchInput.trim();
    setSearchQuery(keyword);
    queryRef.current = keyword;
    void loadLogins(0, sizeRef.current, keyword);
  }, [searchInput, loadLogins]);

  const rangeLabel = useMemo(() => {
    if (rows.length === 0) return '표시할 데이터가 없습니다.';
    const first = rows[0]?.createdAt;
    const last = rows[rows.length - 1]?.createdAt;
    if (!first || !last) return `${rows.length.toLocaleString('ko-KR')}건 표시 중`;
    return `${formatDateTime(first)} ~ ${formatDateTime(last)}`;
  }, [rows]);

  const pageInfo = `페이지 ${totalPages === 0 ? 0 : page + 1} / ${Math.max(1, totalPages)} • 총 ${totalElements.toLocaleString('ko-KR')}건`;

  return (
    <PageWrap>
      <PageHeader>
        <div>
          <PageTitle>로그인 기록</PageTitle>
          <PageSubtitle>{rangeLabel}</PageSubtitle>
        </div>
        <ToolbarGroup>
          <FieldLabel htmlFor="admin-login-search">아이디 검색</FieldLabel>
          <Input
            id="admin-login-search"
            placeholder="아이디 검색"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                handleSearch();
              }
            }}
          />
          <MonoPrimary type="button" onClick={handleSearch} disabled={loading}>
            검색
          </MonoPrimary>
        </ToolbarGroup>
      </PageHeader>

      {error ? <ErrorBanner role="status">⚠️ {error}</ErrorBanner> : null}

      <Card>
        <CardHeader>
          <div>
            <h3>로그 목록</h3>
            <CardMeta>{pageInfo}</CardMeta>
          </div>
          <ToolbarInfo>{rangeLabel}</ToolbarInfo>
        </CardHeader>
        <Toolbar>
          <ToolbarInfo>검색어: {searchQuery ? searchQuery : '없음'}</ToolbarInfo>
          <ToolbarGroup>
            <FieldLabel htmlFor="admin-login-size">페이지 크기</FieldLabel>
            <Select
              id="admin-login-size"
              value={size}
              onChange={(event) => {
                const nextSize = Number(event.target.value);
                setSize(nextSize);
                sizeRef.current = nextSize;
                void loadLogins(0, nextSize, queryRef.current);
              }}
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
                      <SpinnerInline aria-hidden />
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
                    <td>{row.ip || '-'}</td>
                    <td>{row.success ? '성공' : '실패'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </TableWrap>
        <Pager>
          <ToolbarInfo>총 {totalElements.toLocaleString('ko-KR')}건</ToolbarInfo>
          <PagerGroup>
            <MonoGhost
              as="button"
              type="button"
              onClick={() => loadLogins(Math.max(0, page - 1), sizeRef.current, queryRef.current)}
              disabled={page <= 0 || loading}
            >
              이전
            </MonoGhost>
            <InlineBadge>{totalPages === 0 ? 0 : page + 1}</InlineBadge>
            <MonoGhost
              as="button"
              type="button"
              onClick={() => loadLogins(Math.min(totalPages - 1, page + 1), sizeRef.current, queryRef.current)}
              disabled={page >= totalPages - 1 || loading}
            >
              다음
            </MonoGhost>
          </PagerGroup>
        </Pager>
        {!loading && rows.length > 0 ? (
          <Muted>최근 {rows.length.toLocaleString('ko-KR')}건이 표시되었습니다.</Muted>
        ) : null}
      </Card>
    </PageWrap>
  );
}

function formatDateTime(value: string) {
  const formatted = formatKoreanDateTime(value, { includeWeekday: true });
  return formatted === '—' ? value : formatted;
}

const SpinnerInline = styled(LoadingSpinner)`
  width: 16px;
  height: 16px;
`;
