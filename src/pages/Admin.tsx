import styled, { css, keyframes } from "styled-components";
import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { SectionCard as Section, TitleH3 as Title } from "@/components/common/UI";
import { invalidateCacheByPrefix } from "@/lib/fetcher";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useNavigate } from "react-router-dom";
import { routes } from "@/routes";
import { getAdminOverview, getLoginLogs, getPayments, listLoginLogsPaged, type AdminOverview } from "@/api/admin";
import { listAdminAcademies, type AdminAcademyRow } from "@/api/adminAcademies";
import { useToast } from "@/components/common/Toast";
import { LoadingSpinner } from "@/components/common/Loading";

type AdminLoginLog = Awaited<ReturnType<typeof getLoginLogs>> extends Array<infer T> ? T : never;
type AdminPaymentRow = Awaited<ReturnType<typeof getPayments>> extends Array<infer T> ? T : never;

export default function AdminPage() {
  const nav = useNavigate();
  const { admin, logout } = useAdminAuth();
  const { success: showSuccess, error: showError } = useToast();
  const [ov, setOv] = useState<AdminOverview | null>(null);
  const [logs, setLogs] = useState<AdminLoginLog[]>([]);
  const [pays, setPays] = useState<AdminPaymentRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);
  const [from, setFrom] = useState<string>(() => { const d = new Date(); d.setDate(d.getDate() - 30); return d.toISOString().slice(0,10); });
  const [to, setTo] = useState<string>(() => new Date().toISOString().slice(0,10));
  const [loginsInRange, setLoginsInRange] = useState<number | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => () => { mountedRef.current = false; }, []);

  const loadAll = useCallback(async (opts?: { silent?: boolean }) => {
    if (!mountedRef.current) return false;
    setLoading(true);
    setLoadError(null);
    try {
      const [o, ls, ps] = await Promise.all([getAdminOverview(), getLoginLogs(), getPayments()]);
      let withAcademies = o;
      if (!o || o.academies == null) {
        try {
          const acc = await listAdminAcademies({ page: 0, size: 1 });
          withAcademies = { ...(o || {}), academies: acc.totalElements } as AdminOverview;
        } catch {
          // 학원 총계 보조 요청 실패는 무시 (핵심 데이터 로딩 지속)
        }
      }
      if (!mountedRef.current) return false;
      setOv(withAcademies);
      setLogs(ls);
      setPays(ps);
      setLastUpdatedAt(new Date());
      if (!opts?.silent) showSuccess('대시보드 데이터를 새로고침했습니다.');
      return true;
    } catch (err: unknown) {
      if (!mountedRef.current) return false;
      const message = err instanceof Error ? err.message : '대시보드 데이터를 불러오지 못했습니다.';
      setLoadError(message);
      showError(message);
      return false;
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [showSuccess, showError]);

  useEffect(() => {
    void loadAll({ silent: true });
  }, [loadAll]);

  useEffect(() => {
    let cancelled = false;
    async function loadRange() {
      try {
        const res = await listLoginLogsPaged({ from, to, page: 0, size: 1 });
        if (!cancelled && mountedRef.current) setLoginsInRange(res.totalElements as number);
      } catch {
        if (!cancelled && mountedRef.current) setLoginsInRange(null);
      }
    }
    void loadRange();
    return () => { cancelled = true; };
  }, [from, to]);

  const items = useMemo(() => ([
    { label: "전체 학원 수", value: ov?.academies ?? '—' },
    { label: "최근 30일 로그인", value: ov?.logins30d ?? '—' },
    { label: "최근 30일 결제합계(원)", value: ov?.paymentsAmount30d != null ? Math.round((ov.paymentsAmount30d||0)/100).toLocaleString('ko-KR') : '—' },
    { label: "오늘 API 호출", value: ov?.apiCallsToday ?? '—' },
    { label: "오늘 OpenAI 호출", value: ov?.openaiCallsToday ?? '—' },
  ]), [ov]);

  const lastUpdatedLabel = useMemo(() => {
    if (!lastUpdatedAt) return null;
    const diffMs = Date.now() - lastUpdatedAt.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    if (diffMinutes < 1) return '방금 전';
    if (diffMinutes < 60) return `${diffMinutes}분 전`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}시간 전`;
    return lastUpdatedAt.toLocaleString('ko-KR', { dateStyle: 'medium', timeStyle: 'short' });
  }, [lastUpdatedAt]);

  const isInitialLoading = loading && !lastUpdatedAt && !loadError;
  const isRefreshing = loading && !!lastUpdatedAt;
  const triggerCalendarRefresh = useCallback(() => {
    try {
      window.dispatchEvent(new CustomEvent('calendar:classes-refresh', { detail: {} }));
    } catch (err) {
      if (import.meta.env?.DEV) {
        console.warn('calendar refresh dispatch failed', err);
      }
    }
  }, []);

  const handleClearCaches = useCallback(() => {
    invalidateCacheByPrefix([
      '/api/students',
      '/api/courses',
      '/api/calendar/classes',
      '/api/calendar/classes-range',
      '/api/dashboard/summary',
      '/api/dashboard/attendance-today',
      '/api/marketing/',
    ]);
    triggerCalendarRefresh();
    showSuccess('API 캐시를 초기화했습니다.');
  }, [showSuccess, triggerCalendarRefresh]);

  const handleRefreshData = useCallback(() => {
    void loadAll();
  }, [loadAll]);

  return (
    <Page>
      <Hero>
        <div className="info">
          <h1>관리자 대시보드</h1>
          <p>운영 현황을 빠르게 확인하고 도구를 실행하세요.</p>
          <HeroMeta>
            <span className="chip">업데이트</span>
            <span className="value" title={lastUpdatedAt ? lastUpdatedAt.toLocaleString('ko-KR', { dateStyle: 'medium', timeStyle: 'short' }) : undefined}>
              {lastUpdatedAt ? lastUpdatedLabel : '데이터 준비 중'}
            </span>
            {isRefreshing && <SpinnerInline aria-hidden />}
          </HeroMeta>
        </div>
        <div className="actions">
          {!admin ? (
            <MonoGhost as="button" onClick={()=>nav(routes.admin + '/login')}>관리자 로그인</MonoGhost>
          ) : (
            <MonoGhost as="button" onClick={()=>logout()}>로그아웃</MonoGhost>
          )}
          <MonoPrimary type="button" onClick={handleClearCaches}>캐시 초기화</MonoPrimary>
          <MonoGhost as="button" onClick={handleRefreshData} disabled={isRefreshing}>
            {isRefreshing ? (<><SpinnerInline aria-hidden /><span>갱신 중…</span></>) : '데이터 새로고침'}
          </MonoGhost>
        </div>
      </Hero>

      {admin ? (
        <StatusBar>
          <span className="pill">로그인</span>
          <span className="who">{admin.username}{admin.role ? ` (${admin.role})` : ''}</span>
        </StatusBar>
      ) : (
        <StatusBar>
          <span className="pill warn">주의</span>
          <span className="who">관리자 로그인이 없으므로 일부 기능이 제한될 수 있습니다.</span>
        </StatusBar>
      )}

      {loadError && (
        <InlineAlert role="status">
          <span className="label">데이터 오류</span>
          <span className="message">{loadError}</span>
          <MonoGhost as="button" type="button" onClick={handleRefreshData} disabled={isRefreshing}>다시 시도</MonoGhost>
        </InlineAlert>
      )}

      <Sections>
        <Section>
          <Title>요약</Title>
          <Kpis>
            {items.map((it, i) => (
              <Kpi key={i} data-variant={(i % 3) + 1} data-loading={isInitialLoading || undefined}>
                {isInitialLoading ? (
                  <>
                    <SkeletonLine />
                    <SkeletonLine $size="lg" />
                  </>
                ) : (
                  <>
                    <span className="label">{it.label}</span>
                    <span className="value">{it.value}</span>
                  </>
                )}
              </Kpi>
            ))}
          </Kpis>
        </Section>

        <Section>
          <Title>빠른 작업</Title>
          <QuickList>
            <li>
              <MonoGhost type="button" onClick={triggerCalendarRefresh}>캘린더 강제 새로고침</MonoGhost>
            </li>
            <li>
              <MonoGhost type="button" onClick={handleClearCaches}>API 캐시 전체 무효화</MonoGhost>
            </li>
            <li>
              <MonoGhost as="a" href={routes.admin + '/logins'}>로그인 기록 보기</MonoGhost>
            </li>
            <li>
              <MonoGhost as="a" href={routes.admin + '/api-logs'}>API 로그 보기</MonoGhost>
            </li>
            <li>
              <MonoGhost as="a" href={routes.admin + '/openai-logs'}>OpenAI 로그 보기</MonoGhost>
            </li>
            <li>
              <MonoGhost as="a" href={routes.admin + '/payments'}>결제 기록 보기</MonoGhost>
            </li>
          </QuickList>
        </Section>

        <Section>
          <Title>운영 데이터(학원별)</Title>
          <AcademiesTable from={from} to={to} />
        </Section>

        <TwoCol>
        <Section>
          <Title>학원 기본정보</Title>
          {ov?.academy ? (
            <InfoList>
              <li><span className="k">학원명</span><span className="v">{ov.academy.name}</span></li>
              <li><span className="k">ID</span><span className="v">{ov.academy.id}</span></li>
            </InfoList>
          ) : (<Muted>관리자 계정에 학원 연결이 없습니다.</Muted>)}
        </Section>

        <Section>
          <Title>로그인 기록(최근)</Title>
          <TableWrap>
            <Table>
              <thead><tr><th>시간</th><th>아이디</th><th>IP</th><th>성공</th></tr></thead>
              <tbody>
                {logs.map((r, i) => (
                  <tr key={r.id || i}><td>{new Date(r.createdAt).toLocaleString('ko-KR', { dateStyle: 'medium', timeStyle: 'short' })}</td><td>{r.username}</td><td>{r.ip || '-'}</td><td>{r.success ? 'Y' : 'N'}</td></tr>
                ))}
                {logs.length === 0 && <tr><td colSpan={4}><Muted>표시할 데이터가 없습니다.</Muted></td></tr>}
              </tbody>
            </Table>
          </TableWrap>
        </Section>
        </TwoCol>

        <Section>
          <Title>결제 기록(최근)</Title>
          <TableWrap>
            <Table>
              <thead><tr><th>시간</th><th>금액</th><th>통화</th><th>상태</th><th>비고</th></tr></thead>
              <tbody>
                {pays.map((p, i) => (
                  <tr key={p.id || i}><td>{new Date(p.createdAt).toLocaleString('ko-KR', { dateStyle: 'medium', timeStyle: 'short' })}</td><td>{(p.amountCents/100).toLocaleString('ko-KR')}</td><td>{p.currency}</td><td>{p.status}</td><td>{p.description || '-'}</td></tr>
                ))}
                {pays.length === 0 && <tr><td colSpan={5}><Muted>표시할 데이터가 없습니다.</Muted></td></tr>}
              </tbody>
            </Table>
          </TableWrap>
        </Section>

        <Section>
          <Title>범위 선택</Title>
          <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
            <span className="label" style={{ color:'#6b7280', fontSize:12, fontWeight:700 }}>기간</span>
            <Input type="date" lang="ko-KR" value={from} onChange={(e)=>setFrom(e.target.value)} />
            <span>~</span>
            <Input type="date" lang="ko-KR" value={to} onChange={(e)=>setTo(e.target.value)} />
            {loginsInRange != null && <span style={{ color:'#334155', fontSize:12 }}>선택 기간 로그인 수: <b>{loginsInRange.toLocaleString('ko-KR')}</b></span>}
          </div>
          <Muted>아래 학원 목록의 통계 범위가 위 기간에 맞춰 적용됩니다.</Muted>
        </Section>
      </Sections>
    </Page>
  );
}

const Page = styled.div` display:grid; gap:14px; `;
const Hero = styled.header`
  display:flex; align-items:center; justify-content:space-between; padding:16px; border:1px solid #e5e7eb; border-radius:14px; background: linear-gradient(180deg, #f9fafb 0%, #ffffff 80%);
  .info { display:grid; gap:4px; }
  .info h1 { margin:0; font-size:20px; color:#0f172a; }
  .info p { margin:0; color:#6b7280; }
  .actions { display:inline-flex; gap:8px; }
`;
const HeroMeta = styled.div`
  display:inline-flex; align-items:center; gap:8px; margin-top:4px; font-size:12px; color:#64748b;
  .chip { background:#e0f2fe; color:#0369a1; border-radius:999px; padding:2px 8px; font-weight:700; letter-spacing:.02em; }
  .value { font-weight:700; color:#0f172a; }
`;
const SpinnerInline = styled(LoadingSpinner)`
  width:16px;
  height:16px;
  flex-shrink:0;
`;
const StatusBar = styled.div`
  display:flex; gap:10px; align-items:center; color:#475569; font-size:12px;
  .pill { background:#111827; color:#fff; border-radius:999px; padding:4px 8px; font-weight:800; letter-spacing:.02em; }
  .pill.warn { background:#b91c1c; }
  .who { color:#334155; }
`;
const InlineAlert = styled.div`
  display:flex; gap:12px; align-items:center; border:1px solid #fecaca; background:#fee2e2; color:#b91c1c; padding:12px 16px; border-radius:12px; font-size:13px; font-weight:600;
  .label { font-weight:800; letter-spacing:.02em; }
  .message { flex:1; color:#7f1d1d; }
  button { margin-left:auto; }
`;
const Sections = styled.div`
  display:grid; gap:16px;
`;
const TwoCol = styled.div`
  display:grid; gap:16px;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
`;
const Kpis = styled.div` display:grid; gap:12px; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); `;
const Kpi = styled.div`
  position:relative; border:1px solid #e5e7eb; border-radius:12px; padding:14px; display:grid; gap:6px; background:#fff; overflow:hidden;
  &:before{ content:''; position:absolute; inset:auto -20% 0 -20%; height:40%; background:var(--kpi-bg,#eef2ff); filter:blur(20px); }
  &[data-variant='1']{ --kpi-bg:#e0e7ff; }
  &[data-variant='2']{ --kpi-bg:#dcfce7; }
  &[data-variant='3']{ --kpi-bg:#fee2e2; }
  &[data-loading]{ background:#f8fafc; }
  &[data-loading]:before{ opacity:0; }
  .label { color:#6b7280; font-size:12px; font-weight:700; }
  .value { color:#0f172a; font-size:18px; font-weight:800; }
`;
const skeletonShimmer = keyframes`
  0% { background-position: 100% 0; }
  100% { background-position: 0 0; }
`;
const SkeletonLine = styled.span<{ $size?: 'lg' }>`
  display:block;
  width:60%;
  height:${({ $size }) => ($size === 'lg' ? '20px' : '12px')};
  border-radius:999px;
  background:linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 50%, #f1f5f9 100%);
  background-size:200% 100%;
  animation:${skeletonShimmer} 1.2s ease-in-out infinite;
`;
const QuickList = styled.ul`
  list-style:none; padding:0; margin:0; display:grid; gap:8px;
  li { display:flex; }
`;
const Muted = styled.div` color:#6b7280; font-size:12px; `;

const monoButtonBase = css`
  display:inline-flex; align-items:center; justify-content:center; gap:6px;
  height: 40px; padding: 0 14px; border-radius: 10px; font-weight: 700; font-size: 14px; cursor: pointer; transition: background .15s ease, color .15s ease, border-color .15s ease;
`;
const MonoPrimary = styled.button`
  ${monoButtonBase};
  background:#111827; color:#fff; border:1px solid #111827;
  &:hover{ background:#000; border-color:#000; }
  &:disabled{ opacity:.6; cursor:not-allowed; }
`;
const MonoGhost = styled.button`
  ${monoButtonBase};
  background:#fff; color:#111827; border:1px solid #e5e7eb;
  &:hover{ background:#f9fafb; }
  &:disabled{ opacity:.6; cursor:not-allowed; pointer-events:none; }
`;

const Table = styled.table`
  width:100%; border-collapse:separate; border-spacing:0; overflow:hidden; border:1px solid #e5e7eb; border-radius:12px; background:#fff;
  thead th { text-align:left; font-size:12px; color:#6b7280; font-weight:800; padding:10px 12px; border-bottom:1px solid #e5e7eb; background:#f9fafb; position:sticky; top:0; }
  tbody td { font-size:13px; color:#0f172a; padding:10px 12px; border-bottom:1px solid #f1f5f9; }
  tbody tr:nth-child(odd) td{ background:#fcfcfd; }
  tbody tr:hover td{ background:#f9fafb; }
`;
const TableWrap = styled.div`
  width:100%; overflow:auto; border:1px solid #f1f5f9; border-radius:12px;
  table{ min-width: 520px; }
`;

const InfoList = styled.ul`
  list-style:none; padding:0; margin:0; display:grid; gap:8px;
  li{ display:grid; grid-template-columns: 120px 1fr; }
  .k{ color:#6b7280; font-size:12px; font-weight:700; }
  .v{ color:#111827; font-size:14px; }
`;
/* duplicate Table/TableWrap removed */

const Input = styled.input`
  height:40px; border:1px solid #e5e7eb; border-radius:10px; padding:0 12px; font-size:14px; background:#fff; color:#0f172a;
`;

const SectionStack = styled.div`
  display:grid; gap:12px;
`;
const Toolbar = styled.div`
  display:flex; flex-wrap:wrap; gap:12px; align-items:center; justify-content:space-between;
`;
const ToolbarGroup = styled.div`
  display:flex; flex-wrap:wrap; align-items:center; gap:8px;
`;
const ToolbarInfo = styled.span`
  font-size:12px; color:#64748b; font-weight:700;
`;
const Select = styled.select`
  height:40px; border:1px solid #e5e7eb; border-radius:10px; padding:0 12px; font-size:14px; background:#fff; color:#0f172a; cursor:pointer;
`;
const InsightStrip = styled.div`
  display:grid; gap:12px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
`;
const InsightCard = styled.div`
  border:1px solid #e5e7eb; border-radius:12px; padding:12px 14px;
  background:linear-gradient(180deg, #f8fafc 0%, #ffffff 85%);
  display:grid; gap:4px;
`;
const InsightLabel = styled.span`
  font-size:12px; color:#64748b; font-weight:700; letter-spacing:.02em;
`;
const InsightValue = styled.span`
  font-size:16px; font-weight:800; color:#0f172a;
`;
const InsightHint = styled.span`
  font-size:12px; color:#94a3b8;
`;
const TableStatus = styled.div<{ $variant?: 'error' }>`
  display:flex; align-items:center; justify-content:center; gap:8px;
  padding:16px;
  font-size:13px; font-weight:600;
  color:${({ $variant }) => $variant === 'error' ? '#b91c1c' : '#475569'};
`;

function AcademiesTable({ from, to }: { from: string; to: string }) {
  const [rows, setRows] = useState<AdminAcademyRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string| null>(null);
  const [q, setQ] = useState('');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [exporting, setExporting] = useState(false);
  const { success: toastSuccess, error: toastError, warning: toastWarning } = useToast();
  const sizeRef = useRef(size);
  const qRef = useRef(q);

  const load = useCallback(async (p: number, s: number, keyword: string) => {
    setLoading(true); setError(null);
    try {
      const res = await listAdminAcademies({ page: p, size: s, q: keyword || undefined, from, to });
      setRows(res.content || []);
      setPage(res.page);
      setSize(res.size);
      setTotalPages(res.totalPages);
      setTotalElements(res.totalElements ?? 0);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : '불러오지 못했습니다.';
      setError(message);
      toastError(message);
    } finally {
      setLoading(false);
    }
  }, [from, to, toastError]);

  useEffect(() => { sizeRef.current = size; }, [size]);
  useEffect(() => { qRef.current = q; }, [q]);
  useEffect(() => { void load(0, sizeRef.current, qRef.current); }, [from, to, load]);

  const pageStart = page * size + (rows.length > 0 ? 1 : 0);
  const pageEnd = page * size + rows.length;
  const totalPagesSafe = Math.max(1, totalPages);
  const summary = useMemo(() => {
    if (!rows.length) return null;
    return rows.reduce((acc, row) => ({
      students: acc.students + (row.students ?? 0),
      courses: acc.courses + (row.courses ?? 0),
      apiCalls: acc.apiCalls + (row.apiCalls ?? 0),
      logins: acc.logins + (row.logins ?? 0),
      paymentCount: acc.paymentCount + (row.paymentCount ?? 0),
      paymentAmountCents: acc.paymentAmountCents + (row.paymentAmountCents ?? 0),
    }), { students: 0, courses: 0, apiCalls: 0, logins: 0, paymentCount: 0, paymentAmountCents: 0 });
  }, [rows]);

  const topPaymentAcademy = useMemo(() => {
    if (!rows.length) return null;
    return rows.reduce<{ row: AdminAcademyRow | null; amount: number }>((acc, row) => {
      const amount = row.paymentAmountCents || 0;
      if (amount > acc.amount) return { row, amount };
      return acc;
    }, { row: null, amount: 0 }).row;
  }, [rows]);

  const topActiveAcademy = useMemo(() => {
    if (!rows.length) return null;
    return rows.reduce<{ row: AdminAcademyRow | null; score: number }>((acc, row) => {
      const score = (row.apiCalls || 0) + (row.logins || 0);
      if (score > acc.score) return { row, score };
      return acc;
    }, { row: null, score: -Infinity }).row;
  }, [rows]);

  const handleSearch = useCallback(() => {
    const keyword = q.trim();
    if (keyword !== q) setQ(keyword);
    void load(0, size, keyword);
  }, [load, size, q]);
  const handleReset = useCallback(() => {
    setQ('');
    qRef.current = '';
    void load(0, size, '');
  }, [load, size]);
  const handleSizeChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    const next = Number(event.target.value);
    setSize(next);
    sizeRef.current = next;
    void load(0, next, q);
  }, [load, q]);
  const handleExportCsv = useCallback(() => {
    if (rows.length === 0) {
      toastWarning('표시된 데이터가 없어 내보낼 수 없습니다.');
      return;
    }
    try {
      setExporting(true);
      const header = ['학원명', '사업자번호', '학생수', '수업수', '오늘 수업', 'API 호출', '로그인', '결제건수', '결제금액(원)', '최근활동'];
      const lines = rows.map((r) => {
        const lastActivity = [r.loginLastAt, r.apiLastAt, r.paymentLastAt]
          .filter(Boolean)
          .map((iso) => new Date(iso as string).toLocaleString('ko-KR', { dateStyle: 'short', timeStyle: 'short' }))
          .sort()
          .pop() || '';
        return [
          r.name,
          r.bizNo || '',
          String(r.students ?? 0),
          String(r.courses ?? 0),
          String(r.classesToday ?? 0),
          String(r.apiCalls ?? 0),
          String(r.logins ?? 0),
          String(r.paymentCount ?? 0),
          String(Math.round((r.paymentAmountCents || 0) / 100)),
          lastActivity,
        ].map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',');
      });
      const csv = [header.join(','), ...lines].join('\n');
      const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `classon-academies-${from}-${to}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toastSuccess('현재 목록을 CSV로 내보냈습니다.');
    } catch (error: unknown) {
      if (import.meta.env?.DEV) {
        console.warn('CSV export failed', error);
      }
      toastError('CSV 내보내기에 실패했습니다.');
    } finally {
      setExporting(false);
    }
  }, [rows, toastWarning, toastSuccess, toastError, from, to]);

  const pageSizeOptions = [20, 50, 100];
  const rangeLabel = totalElements > 0
    ? `${(rows.length ? pageStart : 0).toLocaleString('ko-KR')} – ${(rows.length ? pageEnd : 0).toLocaleString('ko-KR')} / ${totalElements.toLocaleString('ko-KR')}`
    : '0 / 0';
  const currentPageDisplay = totalPagesSafe > 0 ? Math.min(page + 1, totalPagesSafe) : 1;
  const pageInfo = `페이지 ${currentPageDisplay.toLocaleString('ko-KR')} / ${totalPagesSafe.toLocaleString('ko-KR')} • ${rangeLabel}`;

  return (
    <SectionStack>
      <Toolbar>
        <ToolbarGroup>
          <Input
            placeholder="학원명/사업자번호 검색"
            value={q}
            onChange={(e)=>setQ(e.target.value)}
            onKeyDown={(e)=>{ if (e.key==='Enter') { e.preventDefault(); handleSearch(); } }}
          />
          <MonoGhost as="button" type="button" onClick={handleSearch} disabled={loading}>검색</MonoGhost>
          <MonoGhost as="button" type="button" onClick={handleReset} disabled={!q}>초기화</MonoGhost>
        </ToolbarGroup>
        <ToolbarGroup>
          <ToolbarInfo>{pageInfo}</ToolbarInfo>
          <Select value={size} onChange={handleSizeChange}>
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}개씩</option>
            ))}
          </Select>
          <MonoGhost as="button" type="button" onClick={()=>load(Math.max(0, page-1), size, q)} disabled={page<=0 || loading}>이전</MonoGhost>
          <MonoGhost as="button" type="button" onClick={()=>load(Math.min(totalPagesSafe-1, page+1), size, q)} disabled={page>=totalPagesSafe-1 || loading}>다음</MonoGhost>
          <MonoPrimary as="button" type="button" onClick={handleExportCsv} disabled={exporting || rows.length === 0}>{exporting ? 'CSV 생성 중…' : 'CSV 내보내기'}</MonoPrimary>
        </ToolbarGroup>
      </Toolbar>

      <InsightStrip>
        <InsightCard>
          <InsightLabel>현재 페이지 학원</InsightLabel>
          <InsightValue>{rows.length.toLocaleString('ko-KR')}개</InsightValue>
          <InsightHint>전체 {totalElements.toLocaleString('ko-KR')}개 • {from} ~ {to}</InsightHint>
        </InsightCard>
        {summary ? (
          <InsightCard>
            <InsightLabel>범위 결제 합계</InsightLabel>
            <InsightValue>₩{Math.round(summary.paymentAmountCents / 100).toLocaleString('ko-KR')}</InsightValue>
            <InsightHint>{summary.paymentCount.toLocaleString('ko-KR')}건 • 학생 {summary.students.toLocaleString('ko-KR')}명</InsightHint>
          </InsightCard>
        ) : (
          <InsightCard>
            <InsightLabel>범위 결제 합계</InsightLabel>
            <InsightValue>—</InsightValue>
            <InsightHint>데이터 없음</InsightHint>
          </InsightCard>
        )}
        {topPaymentAcademy && (topPaymentAcademy.paymentAmountCents || 0) > 0 && (
          <InsightCard>
            <InsightLabel>최고 결제 학원</InsightLabel>
            <InsightValue>{topPaymentAcademy.name}</InsightValue>
            <InsightHint>₩{Math.round((topPaymentAcademy.paymentAmountCents || 0) / 100).toLocaleString('ko-KR')} • {(topPaymentAcademy.paymentCount ?? 0).toLocaleString('ko-KR')}건</InsightHint>
          </InsightCard>
        )}
        {topActiveAcademy && (
          <InsightCard>
            <InsightLabel>활동량 상위</InsightLabel>
            <InsightValue>{topActiveAcademy.name}</InsightValue>
            <InsightHint>API {(topActiveAcademy.apiCalls ?? 0).toLocaleString('ko-KR')} • 로그인 {(topActiveAcademy.logins ?? 0).toLocaleString('ko-KR')}</InsightHint>
          </InsightCard>
        )}
      </InsightStrip>

      <TableWrap>
        <Table>
          <thead>
            <tr>
              <th>학원</th><th>학생수</th><th>수업수</th><th>오늘 수업</th><th>API(기간)</th><th>로그인(기간)</th><th>결제건수(기간)</th><th>결제합계(기간/원)</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={8}>
                  <TableStatus>
                    <SpinnerInline aria-hidden />
                    <span>데이터를 불러오는 중…</span>
                  </TableStatus>
                </td>
              </tr>
            )}
            {!loading && error && (
              <tr>
                <td colSpan={8}>
                  <TableStatus $variant="error">⚠️ {error}</TableStatus>
                </td>
              </tr>
            )}
            {!loading && !error && rows.map((r, i) => (
              <tr key={r.id || i}>
                <td>
                  <div style={{ display:'grid' }}>
                    <a href={routes.admin + '/academies/' + (r.id || '')} style={{ color:'#111827', textDecoration:'underline', fontWeight:800 }}>{r.name}</a>
                    <div style={{ color:'#64748b', fontSize:12 }}>
                      {(r.bizNo || '-')}
                      {r.createdAt ? ` • 가입일 ${new Date(r.createdAt).toLocaleDateString('ko-KR')}` : ''}
                      {(() => { const t = [r.loginLastAt, r.apiLastAt, r.paymentLastAt].filter(Boolean).map(x => new Date(x as string).getTime()); if (t.length===0) return ''; const last = new Date(Math.max.apply(null, t)); return ` • 최근활동 ${last.toLocaleDateString('ko-KR')} ${last.toLocaleTimeString('ko-KR', { hour12: false })}`; })()}
                    </div>
                  </div>
                </td>
                <td>{r.students}</td>
                <td>{r.courses}</td>
                <td>{r.classesToday}</td>
                <td>{r.apiCalls}</td>
                <td>{r.logins}</td>
                <td>{r.paymentCount}</td>
                <td>{Math.round((r.paymentAmountCents||0)/100).toLocaleString('ko-KR')}</td>
              </tr>
            ))}
            {!loading && !error && rows.length === 0 && (
              <tr>
                <td colSpan={8}>
                  <TableStatus>표시할 데이터가 없습니다.</TableStatus>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </TableWrap>
    </SectionStack>
  );
}
