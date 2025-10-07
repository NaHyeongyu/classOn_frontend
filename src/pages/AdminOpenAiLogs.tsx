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
import { getOpenAiLogsPaged } from '@/api/admin';
import { formatKoreanDateTime } from '@/lib/format';

type OpenAiLogRow = {
  id?: number;
  createdAt: string;
  model?: string | null;
  tokens?: number | null;
  success: boolean;
  latencyMs?: number | null;
};

type PagedResponse<T> = {
  content: T[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
};

type SuccessFilter = 'all' | 'success' | 'fail';

export default function AdminOpenAiLogs() {
  const { error: toastError } = useToast();

  const [rows, setRows] = useState<OpenAiLogRow[]>([]);
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

  const [modelInput, setModelInput] = useState('');
  const [modelQuery, setModelQuery] = useState('');
  const [successFilterInput, setSuccessFilterInput] = useState<SuccessFilter>('all');
  const [successFilter, setSuccessFilter] = useState<SuccessFilter>('all');

  const sizeRef = useRef(size);
  const modelQueryRef = useRef(modelQuery);
  const successFilterRef = useRef(successFilter);

  useEffect(() => {
    sizeRef.current = size;
  }, [size]);
  useEffect(() => {
    modelQueryRef.current = modelQuery;
  }, [modelQuery]);
  useEffect(() => {
    successFilterRef.current = successFilter;
  }, [successFilter]);

  const loadOpenAiLogs = useCallback(
    async (pageToLoad: number, sizeToLoad: number, filters: { model: string; success: SuccessFilter; from: string; to: string }) => {
      setLoading(true);
      setError(null);
      try {
        const res = await getOpenAiLogsPaged({
          page: pageToLoad,
          size: sizeToLoad,
          model: filters.model ? filters.model : undefined,
          success: filters.success === 'all' ? undefined : filters.success === 'success',
          from: filters.from,
          to: filters.to,
        });
        const data = res as PagedResponse<OpenAiLogRow>;
        setRows(data.content || []);
        setPage(data.page);
        setSize(data.size);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements ?? data.content?.length ?? 0);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'OpenAI 로그를 불러오지 못했습니다.';
        setError(message);
        toastError(message);
      } finally {
        setLoading(false);
      }
    },
    [toastError],
  );

  useEffect(() => {
    void loadOpenAiLogs(0, sizeRef.current, {
      model: modelQueryRef.current,
      success: successFilterRef.current,
      from,
      to,
    });
  }, [loadOpenAiLogs, from, to]);

  const handleApplyFilters = useCallback(() => {
    const nextModel = modelInput.trim();
    setModelQuery(nextModel);
    setSuccessFilter(successFilterInput);
    modelQueryRef.current = nextModel;
    successFilterRef.current = successFilterInput;
    void loadOpenAiLogs(0, sizeRef.current, {
      model: nextModel,
      success: successFilterInput,
      from,
      to,
    });
  }, [modelInput, successFilterInput, from, to, loadOpenAiLogs]);

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
          <PageTitle>OpenAI 호출 로그</PageTitle>
          <PageSubtitle>{displayedRange}</PageSubtitle>
        </div>
        <ToolbarGroup>
          <FieldLabel htmlFor="openai-log-from">기간</FieldLabel>
          <Input id="openai-log-from" type="date" lang="ko-KR" value={from} onChange={(event) => setFrom(event.target.value)} />
          <span>~</span>
          <Input id="openai-log-to" type="date" lang="ko-KR" value={to} onChange={(event) => setTo(event.target.value)} />
          <FieldLabel htmlFor="openai-log-model">모델</FieldLabel>
          <Input
            id="openai-log-model"
            placeholder="예: gpt-4o"
            value={modelInput}
            onChange={(event) => setModelInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                handleApplyFilters();
              }
            }}
          />
          <Select
            aria-label="성공 여부"
            value={successFilterInput}
            onChange={(event) => setSuccessFilterInput(event.target.value as SuccessFilter)}
          >
            <option value="all">전체</option>
            <option value="success">성공만</option>
            <option value="fail">실패만</option>
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
            <h3>호출 목록</h3>
            <CardMeta>{pageInfo}</CardMeta>
          </div>
          <ToolbarInfo>{rangeLabel}</ToolbarInfo>
        </CardHeader>
        <Toolbar>
          <ToolbarInfo>
            모델 필터: {modelQuery ? modelQuery : '전체'} · 성공 필터: {successFilterLabel(successFilter)}
          </ToolbarInfo>
          <ToolbarGroup>
            <FieldLabel htmlFor="openai-log-size">페이지 크기</FieldLabel>
            <Select
              id="openai-log-size"
              value={size}
              onChange={(event) => {
                const nextSize = Number(event.target.value);
                setSize(nextSize);
                sizeRef.current = nextSize;
                void loadOpenAiLogs(0, nextSize, {
                  model: modelQueryRef.current,
                  success: successFilterRef.current,
                  from,
                  to,
                });
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
                    <td>{row.model || '-'}</td>
                    <td>{row.tokens != null ? row.tokens.toLocaleString('ko-KR') : '-'}</td>
                    <td>{row.success ? '성공' : '실패'}</td>
                    <td>{row.latencyMs != null ? row.latencyMs.toLocaleString('ko-KR') : '-'}</td>
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
                loadOpenAiLogs(Math.max(0, page - 1), sizeRef.current, {
                  model: modelQueryRef.current,
                  success: successFilterRef.current,
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
                loadOpenAiLogs(Math.min(totalPages - 1, page + 1), sizeRef.current, {
                  model: modelQueryRef.current,
                  success: successFilterRef.current,
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
          <Muted>현재 {rows.length.toLocaleString('ko-KR')}건의 호출이 표시되고 있습니다.</Muted>
        ) : null}
      </Card>
    </PageWrap>
  );
}

function successFilterLabel(filter: SuccessFilter) {
  switch (filter) {
    case 'success':
      return '성공만';
    case 'fail':
      return '실패만';
    default:
      return '전체';
  }
}

function formatDateTime(value: string) {
  const formatted = formatKoreanDateTime(value, { includeWeekday: true });
  return formatted === '—' ? value : formatted;
}

const SpinnerInline = styled(LoadingSpinner)`
  width: 16px;
  height: 16px;
`;
