import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
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
} from '@/components/admin/AdminStyles';
import { useToast } from '@/components/common/Toast';
import { LoadingSpinner } from '@/components/common/Loading';
import {
  getAcademySummary,
  getAcademyPaymentsPaged,
  getAcademyLoginLogsPaged,
  getAcademyApiLogsPaged,
} from '@/api/admin';

type AcademySummary = {
  id: number;
  name: string;
  students: number;
  courses: number;
  classesToday: number;
  apiCalls: number;
  logins: number;
  paymentCount: number;
  paymentAmountCents: number;
  apiLastAt?: string | null;
  loginLastAt?: string | null;
  paymentLastAt?: string | null;
  createdAt?: string | null;
};

type AcademyPaymentRow = {
  id?: number;
  createdAt: string;
  amountCents: number;
  currency?: string | null;
  status: string;
  description?: string | null;
  provider?: string | null;
};

type AcademyLoginLogRow = {
  id?: number;
  createdAt: string;
  username: string;
  ip?: string | null;
  success: boolean;
};

type AcademyApiLogRow = {
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

export default function AdminAcademyDetail() {
  const { id } = useParams<{ id: string }>();
  const academyId = id ? Number(id) : NaN;
  const { error: toastError } = useToast();

  const [summary, setSummary] = useState<AcademySummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  const [from, setFrom] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().slice(0, 10);
  });
  const [to, setTo] = useState<string>(() => new Date().toISOString().slice(0, 10));

  const [payments, setPayments] = useState<AcademyPaymentRow[]>([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [paymentsError, setPaymentsError] = useState<string | null>(null);
  const [paymentsPage, setPaymentsPage] = useState(0);
  const [paymentsSize, setPaymentsSize] = useState(20);
  const [paymentsTotalPages, setPaymentsTotalPages] = useState(0);
  const [paymentsTotalElements, setPaymentsTotalElements] = useState(0);

  const [loginRows, setLoginRows] = useState<AcademyLoginLogRow[]>([]);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginPage, setLoginPage] = useState(0);
  const [loginSize, setLoginSize] = useState(20);
  const [loginTotalPages, setLoginTotalPages] = useState(0);
  const [loginTotalElements, setLoginTotalElements] = useState(0);
  const [loginInput, setLoginInput] = useState('');
  const [loginQuery, setLoginQuery] = useState('');

  const [apiRows, setApiRows] = useState<AcademyApiLogRow[]>([]);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiPage, setApiPage] = useState(0);
  const [apiSize, setApiSize] = useState(20);
  const [apiTotalPages, setApiTotalPages] = useState(0);
  const [apiTotalElements, setApiTotalElements] = useState(0);
  const [apiInput, setApiInput] = useState('');
  const [apiQuery, setApiQuery] = useState('');

  const paymentsSizeRef = useRef(paymentsSize);
  const loginSizeRef = useRef(loginSize);
  const apiSizeRef = useRef(apiSize);
  const loginQueryRef = useRef(loginQuery);
  const apiQueryRef = useRef(apiQuery);

  useEffect(() => {
    paymentsSizeRef.current = paymentsSize;
  }, [paymentsSize]);
  useEffect(() => {
    loginSizeRef.current = loginSize;
  }, [loginSize]);
  useEffect(() => {
    apiSizeRef.current = apiSize;
  }, [apiSize]);
  useEffect(() => {
    loginQueryRef.current = loginQuery;
  }, [loginQuery]);
  useEffect(() => {
    apiQueryRef.current = apiQuery;
  }, [apiQuery]);

  const loadSummary = useCallback(async () => {
    if (!Number.isFinite(academyId)) return;
    setSummaryLoading(true);
    setSummaryError(null);
    try {
      const data = await getAcademySummary(academyId, { from, to });
      setSummary(data as AcademySummary);
    } catch (err) {
      const message = err instanceof Error ? err.message : '요약을 불러오지 못했습니다.';
      setSummaryError(message);
      toastError(message);
    } finally {
      setSummaryLoading(false);
    }
  }, [academyId, from, to, toastError]);

  const loadPayments = useCallback(
    async (pageToLoad: number, sizeToLoad: number) => {
      if (!Number.isFinite(academyId)) return;
      setPaymentsLoading(true);
      setPaymentsError(null);
      try {
        const res = await getAcademyPaymentsPaged(academyId, { page: pageToLoad, size: sizeToLoad, from, to });
        const data = res as PagedResponse<AcademyPaymentRow>;
        setPayments(data.content || []);
        setPaymentsPage(data.page);
        setPaymentsSize(data.size);
        setPaymentsTotalPages(data.totalPages);
        setPaymentsTotalElements(data.totalElements ?? data.content?.length ?? 0);
      } catch (err) {
        const message = err instanceof Error ? err.message : '결제 정보를 불러오지 못했습니다.';
        setPaymentsError(message);
        toastError(message);
      } finally {
        setPaymentsLoading(false);
      }
    },
    [academyId, from, to, toastError],
  );

  const loadLogins = useCallback(
    async (pageToLoad: number, sizeToLoad: number, keyword: string) => {
      if (!Number.isFinite(academyId)) return;
      setLoginLoading(true);
      setLoginError(null);
      try {
        const res = await getAcademyLoginLogsPaged(academyId, {
          page: pageToLoad,
          size: sizeToLoad,
          from,
          to,
          q: keyword ? keyword : undefined,
        });
        const data = res as PagedResponse<AcademyLoginLogRow>;
        setLoginRows(data.content || []);
        setLoginPage(data.page);
        setLoginSize(data.size);
        setLoginTotalPages(data.totalPages);
        setLoginTotalElements(data.totalElements ?? data.content?.length ?? 0);
      } catch (err) {
        const message = err instanceof Error ? err.message : '로그인 기록을 불러오지 못했습니다.';
        setLoginError(message);
        toastError(message);
      } finally {
        setLoginLoading(false);
      }
    },
    [academyId, from, to, toastError],
  );

  const loadApiLogs = useCallback(
    async (pageToLoad: number, sizeToLoad: number, keyword: string) => {
      if (!Number.isFinite(academyId)) return;
      setApiLoading(true);
      setApiError(null);
      try {
        const res = await getAcademyApiLogsPaged(academyId, {
          page: pageToLoad,
          size: sizeToLoad,
          from,
          to,
          q: keyword ? keyword : undefined,
        });
        const data = res as PagedResponse<AcademyApiLogRow>;
        setApiRows(data.content || []);
        setApiPage(data.page);
        setApiSize(data.size);
        setApiTotalPages(data.totalPages);
        setApiTotalElements(data.totalElements ?? data.content?.length ?? 0);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'API 로그를 불러오지 못했습니다.';
        setApiError(message);
        toastError(message);
      } finally {
        setApiLoading(false);
      }
    },
    [academyId, from, to, toastError],
  );

  useEffect(() => {
    if (!Number.isFinite(academyId)) return;
    void loadSummary();
    void loadPayments(0, paymentsSizeRef.current);
    void loadLogins(0, loginSizeRef.current, loginQueryRef.current);
    void loadApiLogs(0, apiSizeRef.current, apiQueryRef.current);
  }, [academyId, from, to, loadSummary, loadPayments, loadLogins, loadApiLogs]);

  const academyRangeLabel = useMemo(() => {
    if (!summary) return null;
    const range = [summary.loginLastAt, summary.apiLastAt, summary.paymentLastAt]
      .filter(Boolean)
      .map((v) => new Date(v as string).getTime());
    if (range.length === 0) return null;
    const lastDate = new Date(Math.max(...range));
    return `${lastDate.toLocaleDateString('ko-KR')} ${lastDate.toLocaleTimeString('ko-KR', { hour12: false })}`;
  }, [summary]);

  const summaryStats = useMemo(() => {
    if (!summary) return null;
    return [
      { label: '학생 수', value: summary.students.toLocaleString('ko-KR') },
      { label: '수업 수', value: summary.courses.toLocaleString('ko-KR') },
      { label: '오늘 수업', value: summary.classesToday.toLocaleString('ko-KR') },
      { label: '기간 API 호출', value: summary.apiCalls.toLocaleString('ko-KR') },
      { label: '기간 로그인', value: summary.logins.toLocaleString('ko-KR') },
      { label: '기간 결제 건수', value: summary.paymentCount.toLocaleString('ko-KR') },
      {
        label: '기간 결제 합계(원)',
        value: Math.round((summary.paymentAmountCents || 0) / 100).toLocaleString('ko-KR'),
      },
    ];
  }, [summary]);

  const paymentsRangeLabel = useMemo(() => {
    if (payments.length === 0) return '표시할 결제가 없습니다.';
    const start = payments[0]?.createdAt;
    const end = payments[payments.length - 1]?.createdAt;
    if (!start || !end) return `${payments.length.toLocaleString('ko-KR')}건 표시 중`;
    return `${new Date(start).toLocaleDateString('ko-KR')} ~ ${new Date(end).toLocaleDateString('ko-KR')}`;
  }, [payments]);

  const loginRangeLabel = useMemo(() => {
    if (loginRows.length === 0) return '표시할 로그인 데이터가 없습니다.';
    const start = loginRows[0]?.createdAt;
    const end = loginRows[loginRows.length - 1]?.createdAt;
    if (!start || !end) return `${loginRows.length.toLocaleString('ko-KR')}건 표시 중`;
    return `${new Date(start).toLocaleString('ko-KR')} ~ ${new Date(end).toLocaleString('ko-KR')}`;
  }, [loginRows]);

  const apiRangeLabel = useMemo(() => {
    if (apiRows.length === 0) return '표시할 API 로그가 없습니다.';
    const start = apiRows[0]?.createdAt;
    const end = apiRows[apiRows.length - 1]?.createdAt;
    if (!start || !end) return `${apiRows.length.toLocaleString('ko-KR')}건 표시 중`;
    return `${new Date(start).toLocaleString('ko-KR')} ~ ${new Date(end).toLocaleString('ko-KR')}`;
  }, [apiRows]);

  const appliedPeriod = `${from} ~ ${to}`;

  function handleApplyFilters() {
    void loadSummary();
    void loadPayments(0, paymentsSizeRef.current);
    void loadLogins(0, loginSizeRef.current, loginQueryRef.current);
    void loadApiLogs(0, apiSizeRef.current, apiQueryRef.current);
  }

  function handleLoginSearch() {
    const next = loginInput.trim();
    setLoginQuery(next);
    loginQueryRef.current = next;
    void loadLogins(0, loginSizeRef.current, next);
  }

  function handleApiSearch() {
    const next = apiInput.trim();
    setApiQuery(next);
    apiQueryRef.current = next;
    void loadApiLogs(0, apiSizeRef.current, next);
  }

  const paymentsPageInfo = `페이지 ${paymentsTotalPages === 0 ? 0 : paymentsPage + 1} / ${Math.max(1, paymentsTotalPages)} • 총 ${paymentsTotalElements.toLocaleString('ko-KR')}건`;
  const loginPageInfo = `페이지 ${loginTotalPages === 0 ? 0 : loginPage + 1} / ${Math.max(1, loginTotalPages)} • 총 ${loginTotalElements.toLocaleString('ko-KR')}건`;
  const apiPageInfo = `페이지 ${apiTotalPages === 0 ? 0 : apiPage + 1} / ${Math.max(1, apiTotalPages)} • 총 ${apiTotalElements.toLocaleString('ko-KR')}건`;

  return (
    <PageWrap>
      <PageHeader>
        <HeaderBlock>
          <PageTitle>학원 상세</PageTitle>
          <PageSubtitle>
            {summary ? (
              <>
                #{summary.id} · {summary.name}
                {academyRangeLabel ? (
                  <> · 최근 활동 {academyRangeLabel}</>
                ) : null}
              </>
            ) : summaryLoading ? (
              '학원 정보를 불러오는 중…'
            ) : (
              '학원 정보를 불러오지 못했습니다.'
            )}
          </PageSubtitle>
        </HeaderBlock>
        <ToolbarGroup>
          <ToolbarInfo>조회 기간</ToolbarInfo>
          <Input type="date" lang="ko-KR" value={from} onChange={(event) => setFrom(event.target.value)} />
          <span>~</span>
          <Input type="date" lang="ko-KR" value={to} onChange={(event) => setTo(event.target.value)} />
          <MonoPrimary type="button" onClick={handleApplyFilters} disabled={summaryLoading || paymentsLoading || loginLoading || apiLoading}>
            필터 적용
          </MonoPrimary>
        </ToolbarGroup>
      </PageHeader>

      {summaryError ? (
        <ErrorBanner role="status">⚠️ {summaryError}</ErrorBanner>
      ) : null}

      <GridTwo>
        <Card>
          <CardHeader>
            <h3>기간 요약</h3>
            <CardMeta>{appliedPeriod}</CardMeta>
          </CardHeader>
          {summaryLoading ? (
            <StatsSkeleton>
              {Array.from({ length: 6 }).map((_, index) => (
                <SkeletonLine key={index} $height={16} />
              ))}
            </StatsSkeleton>
          ) : summaryStats ? (
            <StatsList>
              {summaryStats.map((item) => (
                <li key={item.label}>
                  <span className="label">{item.label}</span>
                  <span className="value">{item.value}</span>
                </li>
              ))}
            </StatsList>
          ) : (
            <Muted>표시할 정보가 없습니다.</Muted>
          )}
        </Card>

        <Card>
          <CardHeader>
            <div>
              <h3>결제 기록</h3>
              <CardMeta>{paymentsRangeLabel}</CardMeta>
            </div>
            <ToolbarInfo>{paymentsPageInfo}</ToolbarInfo>
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
                {paymentsLoading ? (
                  <tr>
                    <td colSpan={5}>
                      <TableStatus>
                        <SpinnerInline aria-hidden />
                        <span>결제 데이터를 불러오는 중…</span>
                      </TableStatus>
                    </td>
                  </tr>
                ) : paymentsError ? (
                  <tr>
                    <td colSpan={5}>
                      <TableStatus $variant="error">⚠️ {paymentsError}</TableStatus>
                    </td>
                  </tr>
                ) : payments.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <TableStatus>표시할 결제 데이터가 없습니다.</TableStatus>
                    </td>
                  </tr>
                ) : (
                  payments.map((row, index) => (
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
            <ToolbarInfo>총 {paymentsTotalElements.toLocaleString('ko-KR')}건</ToolbarInfo>
            <PagerGroup>
              <FieldLabel htmlFor="academy-payments-size">페이지 크기</FieldLabel>
              <Select
                id="academy-payments-size"
                value={paymentsSize}
                onChange={(event) => {
                  const nextSize = Number(event.target.value);
                  setPaymentsSize(nextSize);
                  paymentsSizeRef.current = nextSize;
                  void loadPayments(0, nextSize);
                }}
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
                onClick={() => loadPayments(Math.max(0, paymentsPage - 1), paymentsSize)}
                disabled={paymentsPage <= 0 || paymentsLoading}
              >
                이전
              </MonoGhost>
              <InlineBadge>{paymentsPage + 1}</InlineBadge>
              <MonoGhost
                as="button"
                type="button"
                onClick={() => loadPayments(Math.min(paymentsTotalPages - 1, paymentsPage + 1), paymentsSize)}
                disabled={paymentsPage >= paymentsTotalPages - 1 || paymentsLoading}
              >
                다음
              </MonoGhost>
            </PagerGroup>
          </Pager>
        </Card>
      </GridTwo>

      <GridFull>
        <Card>
          <CardHeader>
            <div>
              <h3>로그인 기록</h3>
              <CardMeta>{loginRangeLabel}</CardMeta>
            </div>
            <ToolbarInfo>{loginPageInfo}</ToolbarInfo>
          </CardHeader>
          <Toolbar>
            <ToolbarGroup>
              <FieldLabel htmlFor="academy-login-search">아이디 검색</FieldLabel>
              <Input
                id="academy-login-search"
                placeholder="아이디 검색"
                value={loginInput}
                onChange={(event) => setLoginInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    handleLoginSearch();
                  }
                }}
              />
              <MonoGhost as="button" type="button" onClick={handleLoginSearch} disabled={loginLoading}>
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
                {loginLoading ? (
                  <tr>
                    <td colSpan={4}>
                      <TableStatus>
                        <SpinnerInline aria-hidden />
                        <span>로그인 기록을 불러오는 중…</span>
                      </TableStatus>
                    </td>
                  </tr>
                ) : loginError ? (
                  <tr>
                    <td colSpan={4}>
                      <TableStatus $variant="error">⚠️ {loginError}</TableStatus>
                    </td>
                  </tr>
                ) : loginRows.length === 0 ? (
                  <tr>
                    <td colSpan={4}>
                      <TableStatus>표시할 데이터가 없습니다.</TableStatus>
                    </td>
                  </tr>
                ) : (
                  loginRows.map((row, index) => (
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
            <ToolbarInfo>총 {loginTotalElements.toLocaleString('ko-KR')}건</ToolbarInfo>
            <PagerGroup>
              <FieldLabel htmlFor="academy-login-size">페이지 크기</FieldLabel>
              <Select
                id="academy-login-size"
                value={loginSize}
                onChange={(event) => {
                  const nextSize = Number(event.target.value);
                  setLoginSize(nextSize);
                  loginSizeRef.current = nextSize;
                  void loadLogins(0, nextSize, loginQuery);
                }}
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
                onClick={() => loadLogins(Math.max(0, loginPage - 1), loginSizeRef.current, loginQueryRef.current)}
                disabled={loginPage <= 0 || loginLoading}
              >
                이전
              </MonoGhost>
              <InlineBadge>{loginPage + 1}</InlineBadge>
              <MonoGhost
                as="button"
                type="button"
                onClick={() => loadLogins(Math.min(loginTotalPages - 1, loginPage + 1), loginSizeRef.current, loginQueryRef.current)}
                disabled={loginPage >= loginTotalPages - 1 || loginLoading}
              >
                다음
              </MonoGhost>
            </PagerGroup>
          </Pager>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <h3>API 요청 로그</h3>
              <CardMeta>{apiRangeLabel}</CardMeta>
            </div>
            <ToolbarInfo>{apiPageInfo}</ToolbarInfo>
          </CardHeader>
          <Toolbar>
            <ToolbarGroup>
              <FieldLabel htmlFor="academy-api-search">경로 검색</FieldLabel>
              <Input
                id="academy-api-search"
                placeholder="예: /api/admin"
                value={apiInput}
                onChange={(event) => setApiInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    handleApiSearch();
                  }
                }}
              />
              <MonoGhost as="button" type="button" onClick={handleApiSearch} disabled={apiLoading}>
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
                {apiLoading ? (
                  <tr>
                    <td colSpan={6}>
                      <TableStatus>
                        <SpinnerInline aria-hidden />
                        <span>API 로그를 불러오는 중…</span>
                      </TableStatus>
                    </td>
                  </tr>
                ) : apiError ? (
                  <tr>
                    <td colSpan={6}>
                      <TableStatus $variant="error">⚠️ {apiError}</TableStatus>
                    </td>
                  </tr>
                ) : apiRows.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <TableStatus>표시할 데이터가 없습니다.</TableStatus>
                    </td>
                  </tr>
                ) : (
                  apiRows.map((row, index) => (
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
            <ToolbarInfo>총 {apiTotalElements.toLocaleString('ko-KR')}건</ToolbarInfo>
            <PagerGroup>
              <FieldLabel htmlFor="academy-api-size">페이지 크기</FieldLabel>
              <Select
                id="academy-api-size"
                value={apiSize}
                onChange={(event) => {
                  const nextSize = Number(event.target.value);
                  setApiSize(nextSize);
                  apiSizeRef.current = nextSize;
                  void loadApiLogs(0, nextSize, apiQueryRef.current);
                }}
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
                onClick={() => loadApiLogs(Math.max(0, apiPage - 1), apiSizeRef.current, apiQueryRef.current)}
                disabled={apiPage <= 0 || apiLoading}
              >
                이전
              </MonoGhost>
              <InlineBadge>{apiPage + 1}</InlineBadge>
              <MonoGhost
                as="button"
                type="button"
                onClick={() => loadApiLogs(Math.min(apiTotalPages - 1, apiPage + 1), apiSizeRef.current, apiQueryRef.current)}
                disabled={apiPage >= apiTotalPages - 1 || apiLoading}
              >
                다음
              </MonoGhost>
            </PagerGroup>
          </Pager>
        </Card>
      </GridFull>
    </PageWrap>
  );
}

function formatDateTime(value?: string | null) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('ko-KR', { dateStyle: 'medium', timeStyle: 'short' });
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
