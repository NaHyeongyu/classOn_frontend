import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import {
  Card,
  CardHeader,
  CardMeta,
  ErrorBanner,
  FieldLabel,
  GridTwo,
  MonoGhost,
  MonoPrimary,
  Muted,
  PageHeader,
  PageSubtitle,
  PageTitle,
  PageWrap,
  Select,
  SkeletonLine,
  StatsList,
  Table,
  TableStatus,
  TableWrap,
  ToolbarGroup,
  ToolbarInfo,
} from '@/components/admin/AdminStyles';
import { useToast } from '@/components/common/Toast';
import { SparklineChart, ColumnChart } from '@/components/stats/Charts';
import { buildDailyTrend, type TrendDataset } from '@/lib/trend';
import {
  getAdminOverview,
  getPaymentsPaged,
  listLoginLogsPaged,
  type AdminOverview,
} from '@/api/admin';
import { listAdminAcademies, type AdminAcademyRow } from '@/api/adminAcademies';
import { routes } from '@/routes';

const RANGE_OPTIONS = [7, 14, 30] as const;

type PaymentsResponse = Awaited<ReturnType<typeof getPaymentsPaged>>;
type PaymentRow = PaymentsResponse extends { content: infer T } ? T extends Array<infer P> ? P : never : never;

type LoginsResponse = Awaited<ReturnType<typeof listLoginLogsPaged>>;
type LoginRow = LoginsResponse extends { content: infer L } ? L extends Array<infer R> ? R : never : never;

type StatsError = string | null;

export default function AdminStatsPage() {
  const { error: toastError } = useToast();
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [logins, setLogins] = useState<LoginRow[]>([]);
  const [academies, setAcademies] = useState<AdminAcademyRow[]>([]);

  const [rangeDays, setRangeDays] = useState<typeof RANGE_OPTIONS[number]>(14);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<StatsError>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);

  const mountedRef = useRef(true);

  useEffect(() => () => { mountedRef.current = false; }, []);

  const toDate = useMemo(() => new Date(), []);
  const toDateStr = useMemo(() => toDate.toISOString().slice(0, 10), [toDate]);
  const fromDateStr = useMemo(() => {
    const d = new Date(toDate);
    d.setDate(d.getDate() - (rangeDays - 1));
    return d.toISOString().slice(0, 10);
  }, [toDate, rangeDays]);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [overviewRes, paymentsRes, loginsRes, academiesRes] = await Promise.all([
        getAdminOverview(),
        getPaymentsPaged({ page: 0, size: 200, from: fromDateStr, to: toDateStr }),
        listLoginLogsPaged({ page: 0, size: 200, from: fromDateStr, to: toDateStr }),
        listAdminAcademies({ page: 0, size: 200, from: fromDateStr, to: toDateStr }),
      ]);
      if (!mountedRef.current) return;
      setOverview(overviewRes);
      setPayments((paymentsRes as PaymentsResponse).content || []);
      setLogins((loginsRes as LoginsResponse).content || []);
      setAcademies(academiesRes.content || []);
      setLastUpdatedAt(new Date());
    } catch (err) {
      if (!mountedRef.current) return;
      const message = err instanceof Error ? err.message : '통계를 불러오지 못했습니다.';
      setError(message);
      toastError(message);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [fromDateStr, toDateStr, toastError]);

  useEffect(() => {
    void fetchStats();
  }, [fetchStats]);

  const paymentTrend: TrendDataset = useMemo(() => {
    return buildDailyTrend(rangeDays, toDate, payments, (row) => row?.createdAt, (row) => (row?.amountCents || 0) / 100);
  }, [rangeDays, toDate, payments]);

  const loginTrend: TrendDataset = useMemo(() => {
    return buildDailyTrend(rangeDays, toDate, logins, (row) => row?.createdAt, () => 1);
  }, [rangeDays, toDate, logins]);

  const topPaymentAcademies = useMemo(() => {
    return [...academies]
      .sort((a, b) => (b.paymentAmountCents || 0) - (a.paymentAmountCents || 0))
      .slice(0, 5);
  }, [academies]);

  const topUsageAcademies = useMemo(() => {
    return [...academies]
      .map((row) => ({
        ...row,
        usageScore: (row.apiCalls || 0) + (row.logins || 0),
      }))
      .sort((a, b) => (b.usageScore || 0) - (a.usageScore || 0))
      .slice(0, 5);
  }, [academies]);

  const lastUpdatedLabel = useMemo(() => {
    if (!lastUpdatedAt) return '데이터 준비 중';
    const diffMs = Date.now() - lastUpdatedAt.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    if (diffMinutes < 1) return '방금 전';
    if (diffMinutes < 60) return `${diffMinutes}분 전`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}시간 전`;
    return lastUpdatedAt.toLocaleString('ko-KR', { dateStyle: 'medium', timeStyle: 'short' });
  }, [lastUpdatedAt]);

  const overviewStats = useMemo(() => {
    if (!overview) return [];
    return [
      { label: '전체 학원 수', value: overview.academies?.toLocaleString('ko-KR') ?? '-' },
      { label: '최근 30일 로그인', value: overview.logins30d?.toLocaleString('ko-KR') ?? '-' },
      { label: '최근 30일 결제합계(원)', value: overview.paymentsAmount30d != null ? Math.round((overview.paymentsAmount30d || 0) / 100).toLocaleString('ko-KR') : '-' },
      { label: '오늘 API 호출', value: overview.apiCallsToday?.toLocaleString('ko-KR') ?? '-' },
      { label: '오늘 OpenAI 호출', value: overview.openaiCallsToday?.toLocaleString('ko-KR') ?? '-' },
    ];
  }, [overview]);

  return (
    <PageWrap>
      <PageHeader>
        <div>
          <PageTitle>관리자 통계</PageTitle>
          <PageSubtitle>
            {fromDateStr} ~ {toDateStr} · 마지막 업데이트 {lastUpdatedLabel}
          </PageSubtitle>
        </div>
        <ToolbarGroup>
          <FieldLabel htmlFor="admin-stats-range">기간</FieldLabel>
          <Select
            id="admin-stats-range"
            value={rangeDays}
            onChange={(event) => setRangeDays(Number(event.target.value) as typeof RANGE_OPTIONS[number])}
            disabled={loading}
          >
            {RANGE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                최근 {option}일
              </option>
            ))}
          </Select>
          <MonoGhost as="a" href={routes.admin}>
            대시보드로 이동
          </MonoGhost>
          <MonoPrimary type="button" onClick={() => fetchStats()} disabled={loading}>
            {loading ? '새로고침 중…' : '데이터 새로고침'}
          </MonoPrimary>
        </ToolbarGroup>
      </PageHeader>

      {error ? <ErrorBanner role="status">⚠️ {error}</ErrorBanner> : null}

      <Card>
        <CardHeader>
          <div>
            <h3>핵심 지표</h3>
            <CardMeta>오늘 기준 상태</CardMeta>
          </div>
        </CardHeader>
        {overview ? (
          <StatsList>
            {overviewStats.map((item) => (
              <li key={item.label}>
                <span className="label">{item.label}</span>
                <span className="value">{item.value}</span>
              </li>
            ))}
          </StatsList>
        ) : (
          <SkeletonStack>
            {Array.from({ length: 5 }).map((_, index) => (
              <SkeletonLine key={index} $height={16} />
            ))}
          </SkeletonStack>
        )}
      </Card>

      <GridTwo>
        <Card>
          <CardHeader>
            <div>
              <h3>결제 추이</h3>
              <CardMeta>{rangeDays}일 합계 ₩{paymentTrend.total.toLocaleString('ko-KR')}</CardMeta>
            </div>
            <ToolbarInfo>최대 일 매출 ₩{paymentTrend.max.toLocaleString('ko-KR')}</ToolbarInfo>
          </CardHeader>
          <SparklineChart points={paymentTrend.series} color="#0ea5e9" loading={loading} unitLabel="₩" />
          <TrendFooter>
            {paymentTrend.series.slice(-5).map((point) => (
              <TrendItem key={point.key}>
                <span className="label">{point.label}</span>
                <span className="value">₩{point.value.toLocaleString('ko-KR')}</span>
              </TrendItem>
            ))}
          </TrendFooter>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <h3>로그인 추이</h3>
              <CardMeta>{rangeDays}일 총 {loginTrend.total.toLocaleString('ko-KR')}회</CardMeta>
            </div>
            <ToolbarInfo> 최대 일 로그인 {loginTrend.max.toLocaleString('ko-KR')}회</ToolbarInfo>
          </CardHeader>
          <ColumnChart points={loginTrend.series} color="#6366f1" loading={loading} />
          <TrendFooter>
            {loginTrend.series.slice(-5).map((point) => (
              <TrendItem key={point.key}>
                <span className="label">{point.label}</span>
                <span className="value">{point.value.toLocaleString('ko-KR')}회</span>
              </TrendItem>
            ))}
          </TrendFooter>
        </Card>
      </GridTwo>

      <GridTwo>
        <Card>
          <CardHeader>
            <div>
              <h3>상위 학원 (결제)</h3>
              <CardMeta>{fromDateStr} ~ {toDateStr}</CardMeta>
            </div>
          </CardHeader>
          <TableWrap>
            <Table>
              <thead>
                <tr>
                  <th>학원</th>
                  <th>결제건수</th>
                  <th>결제합계(원)</th>
                </tr>
              </thead>
              <tbody>
                {topPaymentAcademies.length === 0 ? (
                  <tr>
                    <td colSpan={3}>
                      <TableStatus>표시할 데이터가 없습니다.</TableStatus>
                    </td>
                  </tr>
                ) : (
                  topPaymentAcademies.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <div className="academy">
                          <span className="name">{row.name}</span>
                          <Muted>#{row.id}</Muted>
                        </div>
                      </td>
                      <td>{row.paymentCount?.toLocaleString('ko-KR') ?? '0'}</td>
                      <td>₩{Math.round((row.paymentAmountCents || 0) / 100).toLocaleString('ko-KR')}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </TableWrap>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <h3>상위 학원 (활동량)</h3>
              <CardMeta>API + 로그인 횟수</CardMeta>
            </div>
          </CardHeader>
          <TableWrap>
            <Table>
              <thead>
                <tr>
                  <th>학원</th>
                  <th>API</th>
                  <th>로그인</th>
                  <th>총합</th>
                </tr>
              </thead>
              <tbody>
                {topUsageAcademies.length === 0 ? (
                  <tr>
                    <td colSpan={4}>
                      <TableStatus>표시할 데이터가 없습니다.</TableStatus>
                    </td>
                  </tr>
                ) : (
                  topUsageAcademies.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <div className="academy">
                          <span className="name">{row.name}</span>
                          <Muted>#{row.id}</Muted>
                        </div>
                      </td>
                      <td>{row.apiCalls?.toLocaleString('ko-KR') ?? '0'}</td>
                      <td>{row.logins?.toLocaleString('ko-KR') ?? '0'}</td>
                      <td>{row.usageScore?.toLocaleString('ko-KR') ?? '0'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </TableWrap>
        </Card>
      </GridTwo>
    </PageWrap>
  );
}

const SkeletonStack = styled.div`
  display: grid;
  gap: 8px;
`;

const TrendFooter = styled.div`
  display: grid;
  gap: 6px;
`;

const TrendItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  .label {
    color: #94a3b8;
    font-weight: 700;
  }
  .value {
    color: #0f172a;
    font-weight: 800;
  }
`;
