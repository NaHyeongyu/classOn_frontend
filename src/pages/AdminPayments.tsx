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
import { getPaymentsPaged } from '@/api/admin';
import { formatKoreanDateTime } from '@/lib/format';

type AdminPaymentRow = {
  id?: number;
  createdAt: string;
  amountCents: number;
  currency?: string | null;
  status: string;
  description?: string | null;
  provider?: string | null;
};

type PagedResponse<T> = {
  content: T[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
};

export default function AdminPayments() {
  const { error: toastError } = useToast();

  const [rows, setRows] = useState<AdminPaymentRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [from, setFrom] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().slice(0, 10);
  });
  const [to, setTo] = useState(() => new Date().toISOString().slice(0, 10));

  const sizeRef = useRef(size);

  useEffect(() => {
    sizeRef.current = size;
  }, [size]);

  const loadPayments = useCallback(
    async (pageToLoad: number, sizeToLoad: number, range: { from: string; to: string }) => {
      setLoading(true);
      setError(null);
      try {
        const res = await getPaymentsPaged({ page: pageToLoad, size: sizeToLoad, from: range.from, to: range.to });
        const data = res as PagedResponse<AdminPaymentRow>;
        setRows(data.content || []);
        setPage(data.page);
        setSize(data.size);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements ?? data.content?.length ?? 0);
      } catch (err) {
        const message = err instanceof Error ? err.message : '결제 기록을 불러오지 못했습니다.';
        setError(message);
        toastError(message);
      } finally {
        setLoading(false);
      }
    },
    [toastError],
  );

  useEffect(() => {
    void loadPayments(0, sizeRef.current, { from, to });
  }, [loadPayments, from, to]);

  const rangeLabel = useMemo(() => `${from} ~ ${to}`, [from, to]);

  const displayedRange = useMemo(() => {
    if (rows.length === 0) return '표시할 데이터가 없습니다.';
    const first = rows[0]?.createdAt;
    const last = rows[rows.length - 1]?.createdAt;
    if (!first || !last) return `${rows.length.toLocaleString('ko-KR')}건 표시 중`;
    return `${formatDateTime(first)} ~ ${formatDateTime(last)}`;
  }, [rows]);

  const pageInfo = `페이지 ${totalPages === 0 ? 0 : page + 1} / ${Math.max(1, totalPages)} • 총 ${totalElements.toLocaleString('ko-KR')}건`;

  function handleApplyRange() {
    void loadPayments(0, sizeRef.current, { from, to });
  }

  return (
    <PageWrap>
      <PageHeader>
        <div>
          <PageTitle>결제 기록</PageTitle>
          <PageSubtitle>{displayedRange}</PageSubtitle>
        </div>
        <ToolbarGroup>
          <FieldLabel htmlFor="admin-payments-from">기간</FieldLabel>
          <Input id="admin-payments-from" type="date" lang="ko-KR" value={from} onChange={(event) => setFrom(event.target.value)} />
          <span>~</span>
          <Input id="admin-payments-to" type="date" lang="ko-KR" value={to} onChange={(event) => setTo(event.target.value)} />
          <MonoPrimary type="button" onClick={handleApplyRange} disabled={loading}>
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
          <ToolbarInfo>표시된 결제: {rows.length.toLocaleString('ko-KR')}건</ToolbarInfo>
          <ToolbarGroup>
            <FieldLabel htmlFor="admin-payments-size">페이지 크기</FieldLabel>
            <Select
              id="admin-payments-size"
              value={size}
              onChange={(event) => {
                const nextSize = Number(event.target.value);
                setSize(nextSize);
                sizeRef.current = nextSize;
                void loadPayments(0, nextSize, { from, to });
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
                      <SpinnerInline aria-hidden />
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
                    <td>{Math.round((row.amountCents || 0) / 100).toLocaleString('ko-KR')}</td>
                    <td>{row.currency || 'KRW'}</td>
                    <td>{row.status}</td>
                    <td>{row.description || row.provider || '-'}</td>
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
              onClick={() => loadPayments(Math.max(0, page - 1), sizeRef.current, { from, to })}
              disabled={page <= 0 || loading}
            >
              이전
            </MonoGhost>
            <InlineBadge>{totalPages === 0 ? 0 : page + 1}</InlineBadge>
            <MonoGhost
              as="button"
              type="button"
              onClick={() => loadPayments(Math.min(totalPages - 1, page + 1), sizeRef.current, { from, to })}
              disabled={page >= totalPages - 1 || loading}
            >
              다음
            </MonoGhost>
          </PagerGroup>
        </Pager>
        {!loading && rows.length > 0 ? (
          <Muted>현재 {rows.length.toLocaleString('ko-KR')}건의 결제가 표시되고 있습니다.</Muted>
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
