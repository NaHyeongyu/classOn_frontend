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
import { getApiLogsPaged } from '@/api/admin';
import { formatKoreanDateTime } from '@/lib/format';

type AdminApiLogRow = {
  id?: number;
  createdAt: string;
  method: string;
  path: string;
  status: number;
  ip?: string | null;
  userId?: string | null;
};

type PagedResponse<T> = {
  content: T[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
};

type ErrorFilter = 'all' | 'errors';

export default function AdminApiLogs() {
  const { error: toastError } = useToast();

  const [rows, setRows] = useState<AdminApiLogRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [from, setFrom] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().slice(0, 10);
  });
  const [to, setTo] = useState(() => new Date().toISOString().slice(0, 10));

  const [pathInput, setPathInput] = useState('');
  const [pathQuery, setPathQuery] = useState('');
  const [errorsFilterInput, setErrorsFilterInput] = useState<ErrorFilter>('all');
  const [errorsFilter, setErrorsFilter] = useState<ErrorFilter>('all');

  const sizeRef = useRef(size);
  const pathQueryRef = useRef(pathQuery);
  const errorsFilterRef = useRef(errorsFilter);

  useEffect(() => {
    sizeRef.current = size;
  }, [size]);
  useEffect(() => {
    pathQueryRef.current = pathQuery;
  }, [pathQuery]);
  useEffect(() => {
    errorsFilterRef.current = errorsFilter;
  }, [errorsFilter]);

  const loadApiLogs = useCallback(
    async (pageToLoad: number, sizeToLoad: number, query: string, filter: ErrorFilter, range: { from: string; to: string }) => {
      setLoading(true);
      setError(null);
      try {
        const res = await getApiLogsPaged({
          page: pageToLoad,
          size: sizeToLoad,
          q: query ? query : undefined,
          errorsOnly: filter === 'errors',
          from: range.from,
          to: range.to,
        });
        const data = res as PagedResponse<AdminApiLogRow>;
        setRows(data.content || []);
        setPage(data.page);
        setSize(data.size);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements ?? data.content?.length ?? 0);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'API 로그를 불러오지 못했습니다.';
        setError(message);
        toastError(message);
      } finally {
        setLoading(false);
      }
    },
    [toastError],
  );

  useEffect(() => {
    void loadApiLogs(0, sizeRef.current, pathQueryRef.current, errorsFilterRef.current, { from, to });
  }, [loadApiLogs, from, to]);

  const handleApplyFilters = useCallback(() => {
    const nextQuery = pathInput.trim();
    setPathQuery(nextQuery);
    setErrorsFilter(errorsFilterInput);
    pathQueryRef.current = nextQuery;
    errorsFilterRef.current = errorsFilterInput;
    void loadApiLogs(0, sizeRef.current, nextQuery, errorsFilterInput, { from, to });
  }, [errorsFilterInput, from, to, loadApiLogs, pathInput]);

  const rangeLabel = useMemo(() => `${from} ~ ${to}`, [from, to]);

  const displayedRange = useMemo(() => {
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
          <PageTitle>API 요청 로그</PageTitle>
          <PageSubtitle>{displayedRange}</PageSubtitle>
        </div>
        <ToolbarGroup>
          <FieldLabel htmlFor="api-log-from">기간</FieldLabel>
          <Input id="api-log-from" type="date" lang="ko-KR" value={from} onChange={(event) => setFrom(event.target.value)} />
          <span>~</span>
          <Input id="api-log-to" type="date" lang="ko-KR" value={to} onChange={(event) => setTo(event.target.value)} />
          <FieldLabel htmlFor="api-log-path">경로</FieldLabel>
          <Input
            id="api-log-path"
            placeholder="예: /api/admin"
            value={pathInput}
            onChange={(event) => setPathInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                handleApplyFilters();
              }
            }}
          />
          <Select
            aria-label="오류 필터"
            value={errorsFilterInput}
            onChange={(event) => setErrorsFilterInput(event.target.value as ErrorFilter)}
          >
            <option value="all">모든 상태</option>
            <option value="errors">오류만 (상태 ≥ 400)</option>
          </Select>
          <MonoPrimary type="button" onClick={handleApplyFilters} disabled={loading}>
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
            경로 필터: {pathQuery ? pathQuery : '없음'} · 오류 필터: {errorsFilter === 'errors' ? '오류만' : '전체'}
          </ToolbarInfo>
          <ToolbarGroup>
            <FieldLabel htmlFor="api-log-size">페이지 크기</FieldLabel>
            <Select
              id="api-log-size"
              value={size}
              onChange={(event) => {
                const nextSize = Number(event.target.value);
                setSize(nextSize);
                sizeRef.current = nextSize;
                void loadApiLogs(0, nextSize, pathQueryRef.current, errorsFilterRef.current, { from, to });
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
                <th>메서드</th>
                <th>경로</th>
                <th>상태</th>
                <th>IP</th>
                <th>사용자 ID</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6}>
                    <TableStatus>
                      <SpinnerInline aria-hidden />
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
                    <td>{row.path}</td>
                    <td>{row.status}</td>
                    <td>{row.ip || '-'}</td>
                    <td>{row.userId || '-'}</td>
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
              onClick={() =>
                loadApiLogs(Math.max(0, page - 1), sizeRef.current, pathQueryRef.current, errorsFilterRef.current, {
                  from,
                  to,
                })
              }
              disabled={page <= 0 || loading}
            >
              이전
            </MonoGhost>
            <InlineBadge>{totalPages === 0 ? 0 : page + 1}</InlineBadge>
            <MonoGhost
              as="button"
              type="button"
              onClick={() =>
                loadApiLogs(Math.min(totalPages - 1, page + 1), sizeRef.current, pathQueryRef.current, errorsFilterRef.current, {
                  from,
                  to,
                })
              }
              disabled={page >= totalPages - 1 || loading}
            >
              다음
            </MonoGhost>
          </PagerGroup>
        </Pager>
        {!loading && rows.length > 0 ? (
          <Muted>현재 {rows.length.toLocaleString('ko-KR')}건의 로그가 표시되고 있습니다.</Muted>
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
