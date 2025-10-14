import styled, { css, keyframes } from "styled-components";
import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { SectionCard as Section, TitleH3 as Title } from "@/components/common/UI";
import { invalidateCacheByPrefix } from "@/lib/fetcher";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useNavigate } from "react-router-dom";
import { routes } from "@/routes";
import { getAdminOverview, getLoginLogs, getPayments, listLoginLogsPaged, type AdminOverview } from "@/api/admin";
import { listAdminAcademies, type AdminAcademyRow } from "@/api/adminAcademies";
import { listFeedbacksPaged, type AdminFeedbackRow } from "@/api/adminFeedback";
import { useToast } from "@/components/common/Toast";
import { LoadingSpinner } from "@/components/common/Loading";
import { formatKoreanDate, formatKoreanDateTime } from "@/lib/format";

const IconBuilding = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21h18" />
    <path d="M4 21V9l8-6 8 6v12" />
    <path d="M9 21V12h6v9" />
  </svg>
);
const IconActivity = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);
const IconWallet = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="3" />
    <path d="M16 12h4" />
    <path d="M16 9h4" />
  </svg>
);
const IconCpu = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <rect x="9" y="9" width="6" height="6" rx="1" />
    <path d="M9 2v2 M15 2v2 M9 20v2 M15 20v2 M2 9h2 M2 15h2 M20 9h2 M20 15h2" />
  </svg>
);
const IconSpark = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 2 1.7 5.2L19 9l-4 3 1.5 5L12 14l-4.5 3 1.5-5-4-3 5.3-1.8L12 2z" />
  </svg>
);
const IconInbox = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16l2 8-2 8H4l-2-8z" />
    <path d="M4 12h5l2 3h2l2-3h5" />
  </svg>
);
const IconRefresh = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.63-3.36L23 10" />
    <path d="M20.49 15a9 9 0 0 1-14.63 3.36L1 14" />
  </svg>
);
const IconTerminal = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="14" rx="2" />
    <path d="m7 8 3 3-3 3" />
    <path d="M11 16h6" />
  </svg>
);

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
  const [feedbackRows, setFeedbackRows] = useState<AdminFeedbackRow[]>([]);
  const [feedbackTotal, setFeedbackTotal] = useState<number | null>(null);
  const [feedbackNewCount, setFeedbackNewCount] = useState<number | null>(null);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => () => { mountedRef.current = false; }, []);

  const loadAll = useCallback(async (opts?: { silent?: boolean }) => {
    if (!mountedRef.current) return false;
    setLoading(true);
    setLoadError(null);
    try {
      setFeedbackError(null);
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
      try {
        const fb = await listFeedbacksPaged({ page: 0, size: 5 });
        if (mountedRef.current) {
          setFeedbackRows((fb?.content || []).slice(0, 5));
          setFeedbackTotal(typeof fb?.totalElements === 'number' ? fb.totalElements : null);
        }
      } catch (err) {
        if (mountedRef.current) {
          setFeedbackRows([]);
          setFeedbackTotal(null);
          setFeedbackError(err instanceof Error ? err.message : '문의 목록을 불러오지 못했습니다.');
        }
      }
      try {
        const fbNew = await listFeedbacksPaged({ status: 'NEW', page: 0, size: 1 });
        if (mountedRef.current) {
          setFeedbackNewCount(typeof fbNew?.totalElements === 'number' ? fbNew.totalElements : null);
        }
      } catch {
        if (mountedRef.current) setFeedbackNewCount(null);
      }
      if (!opts?.silent) showSuccess('대시보드 데이터를 새로고침했습니다.');
      return true;
    } catch (err: unknown) {
      if (!mountedRef.current) return false;
      const message = err instanceof Error ? err.message : '대시보드 데이터를 불러오지 못했습니다.';
      setLoadError(message);
      showError(message);
      setFeedbackRows([]);
      setFeedbackTotal(null);
      setFeedbackNewCount(null);
      setFeedbackError('문의 데이터를 불러오지 못했습니다.');
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
    { label: "전체 학원 수", value: ov?.academies ?? '—', icon: IconBuilding },
    { label: "최근 30일 로그인", value: ov?.logins30d ?? '—', icon: IconActivity },
    { label: "최근 30일 결제합계(원)", value: ov?.paymentsAmount30d != null ? Math.round((ov.paymentsAmount30d || 0) / 100).toLocaleString('ko-KR') : '—', icon: IconWallet },
    { label: "오늘 API 호출", value: ov?.apiCallsToday ?? '—', icon: IconCpu },
    { label: "오늘 OpenAI 호출", value: ov?.openaiCallsToday ?? '—', icon: IconSpark },
    { label: "미처리 문의", value: feedbackNewCount != null ? feedbackNewCount : '—', icon: IconInbox },
  ]), [ov, feedbackNewCount]);

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

  const quickActions = useMemo(() => ([
    {
      title: "데이터 새로고침",
      description: "대시보드 요약과 로그 데이터를 즉시 갱신합니다.",
      icon: IconSpark,
      onClick: handleRefreshData,
    },
    {
      title: "캘린더 강제 새로고침",
      description: "클라이언트 캘린더 캐시를 초기화하고 새로고침 이벤트를 발송합니다.",
      icon: IconRefresh,
      onClick: triggerCalendarRefresh,
    },
    {
      title: "API 캐시 초기화",
      description: "학생·수업·캘린더 관련 캐시를 비워 데이터 오류를 예방합니다.",
      icon: IconCpu,
      onClick: handleClearCaches,
    },
    {
      title: "로그인 기록",
      description: "최근 관리자 로그인 이벤트를 확인합니다.",
      icon: IconActivity,
      href: routes.admin + "/logins",
    },
    {
      title: "API 로그",
      description: "서비스 API 호출 이력을 실시간으로 살펴봅니다.",
      icon: IconTerminal,
      href: routes.admin + "/api-logs",
    },
    {
      title: "결제 기록",
      description: "결제 발생 내역과 상태를 점검합니다.",
      icon: IconWallet,
      href: routes.admin + "/payments",
    },
    {
      title: "문의/피드백",
      description: "사용자 문의를 처리하고 상태를 업데이트합니다.",
      icon: IconInbox,
      href: routes.admin + "/feedbacks",
    },
  ]), [handleRefreshData, triggerCalendarRefresh, handleClearCaches]);

  return (
    <Page>
      <Hero>
        <HeroContent>
          <HeroBadges>
            <span className="badge accent">ADMIN PANEL</span>
            {admin ? (
              <span className="badge muted">로그인: {admin.username}{admin.role ? ` · ${admin.role}` : ''}</span>
            ) : (
              <span className="badge warn">관리자 로그인 필요</span>
            )}
          </HeroBadges>
          <h1>관리자 대시보드</h1>
          <p>운영 현황을 빠르게 확인하고 도구를 실행하세요.</p>
          <HeroMeta>
            <span className="chip">업데이트</span>
            <span className="value" title={lastUpdatedAt ? lastUpdatedAt.toLocaleString('ko-KR', { dateStyle: 'medium', timeStyle: 'short' }) : undefined}>
              {lastUpdatedAt ? lastUpdatedLabel : '데이터 준비 중'}
            </span>
            {isRefreshing && <SpinnerInline aria-hidden />}
          </HeroMeta>
        </HeroContent>
        <HeroActions>
          <MonoPrimary type="button" onClick={handleClearCaches}>캐시 초기화</MonoPrimary>
          <MonoGhost as="button" type="button" onClick={handleRefreshData} disabled={isRefreshing}>
            {isRefreshing ? (<><SpinnerInline aria-hidden /><span>갱신 중…</span></>) : '데이터 새로고침'}
          </MonoGhost>
          {!admin ? (
            <MonoGhost as="button" type="button" onClick={() => nav(routes.admin + '/login')}>관리자 로그인</MonoGhost>
          ) : (
            <MonoGhost as="button" type="button" onClick={() => logout()}>로그아웃</MonoGhost>
          )}
        </HeroActions>
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
              <Kpi key={i} data-variant={(i % 3) + 1} data-loading={isInitialLoading ? true : undefined}>
                <div className="icon" aria-hidden>
                  {it.icon}
                </div>
                <div className="content">
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
                </div>
              </Kpi>
            ))}
          </Kpis>
        </Section>

        <Section>
          <Title>빠른 작업</Title>
          <QuickGrid>
            {quickActions.map((action) => {
              const isLink = Boolean(action.href);
              const cardProps = isLink
                ? { as: 'a' as const, href: action.href }
                : { as: 'button' as const, type: 'button', onClick: action.onClick };
              return (
                <QuickCard key={action.title} {...cardProps}>
                  <div className="iconWrap" aria-hidden>{action.icon}</div>
                  <div className="body">
                    <span className="title">{action.title}</span>
                    <span className="desc">{action.description}</span>
                  </div>
                </QuickCard>
              );
            })}
          </QuickGrid>
        </Section>

        <Section>
          <Title>문의/피드백</Title>
          <FeedbackMeta>
            <span>총 {feedbackTotal != null ? feedbackTotal.toLocaleString("ko-KR") : "—"}건</span>
            <span>신규 {feedbackNewCount != null ? feedbackNewCount.toLocaleString("ko-KR") : "—"}건</span>
            <MonoGhost as="a" href={routes.admin + "/feedbacks"}>전체 목록 이동</MonoGhost>
          </FeedbackMeta>
          {feedbackError ? (
            <InlineMiniError role="status">⚠️ {feedbackError}</InlineMiniError>
          ) : null}
          <TableWrap>
            <Table>
              <thead>
                <tr>
                  <th style={{ minWidth: 160 }}>시간</th>
                  <th>제목 · 내용</th>
                  <th style={{ width: 90 }}>유형</th>
                  <th style={{ width: 90 }}>상태</th>
                  <th style={{ width: 160 }}>연락처</th>
                </tr>
              </thead>
              <tbody>
                {feedbackRows.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <TableStatus>표시할 문의가 없습니다.</TableStatus>
                    </td>
                  </tr>
                ) : (
                  feedbackRows.map((row) => (
                    <tr key={row.id}>
                      <td>{formatKoreanDateTime(row.createdAt)}</td>
                      <td>
                        <FeedbackCell>
                          <span className="subject">{row.title}</span>
                          {row.body ? (
                            <span className="excerpt">{row.body.length > 120 ? `${row.body.slice(0, 120)}…` : row.body}</span>
                          ) : null}
                          {row.pageUrl ? (
                            <span className="meta">페이지: {row.pageUrl}</span>
                          ) : null}
                        </FeedbackCell>
                      </td>
                      <td>{row.type === "FEATURE" ? "기능" : "오류"}</td>
                      <td>
                        <FeedbackStatus data-status={row.status}>
                          {row.status === "NEW" ? "신규" : row.status === "ACK" ? "확인" : "종료"}
                        </FeedbackStatus>
                      </td>
                      <td>{row.contact || "—"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </TableWrap>
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
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  align-items: flex-start;
  justify-content: space-between;
  padding: 28px 32px;
  border-radius: 20px;
  border: 1px solid rgba(99, 102, 241, 0.16);
  background: radial-gradient(140% 100% at 0% 0%, rgba(79, 70, 229, 0.14) 0%, rgba(59, 130, 246, 0.1) 40%, #ffffff 75%);
  box-shadow: 0 20px 45px rgba(15, 23, 42, 0.08);
  overflow: hidden;
  isolation: isolate;
  &::before {
    content: "";
    position: absolute;
    inset: -55% 35% auto -10%;
    height: 220px;
    border-radius: 50%;
    background: rgba(79, 70, 229, 0.18);
    filter: blur(90px);
    z-index: 0;
  }
  @media (max-width: 640px) {
    padding: 24px 20px;
  }
`;
const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  gap: 12px;
  max-width: min(560px, 100%);
  h1 {
    margin: 0;
    font-size: 24px;
    font-weight: 800;
    letter-spacing: -0.01em;
    color: #0f172a;
  }
  p {
    margin: 0;
    color: #475569;
    font-size: 14px;
    line-height: 1.6;
  }
`;
const HeroBadges = styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  gap: 8px;
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.02em;
    background: rgba(148, 163, 184, 0.18);
    color: #1f2937;
  }
  .badge.accent {
    background: rgba(79, 70, 229, 0.2);
    color: #312e81;
  }
  .badge.muted {
    background: rgba(148, 163, 184, 0.16);
  }
  .badge.warn {
    background: rgba(248, 113, 113, 0.22);
    color: #b91c1c;
  }
`;
const HeroActions = styled.div`
  position: relative;
  z-index: 1;
  display: inline-flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  justify-content: flex-end;
  margin-left: auto;
`;
const HeroMeta = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  color: #475569;
  .chip {
    background: rgba(59, 130, 246, 0.18);
    color: #1d4ed8;
    border-radius: 999px;
    padding: 2px 10px;
    font-weight: 700;
    letter-spacing: 0.03em;
  }
  .value {
    font-weight: 700;
    color: #0f172a;
  }
`;
const SpinnerInline = styled(LoadingSpinner)`
  width:16px;
  height:16px;
  flex-shrink:0;
`;
const StatusBar = styled.div`
  display:flex;
  align-items:center;
  gap:12px;
  padding:12px 16px;
  border-radius:14px;
  border:1px dashed rgba(148, 163, 184, 0.6);
  background: rgba(241, 245, 249, 0.8);
  font-size:12px;
  color:#475569;
  .pill {
    display:inline-flex;
    align-items:center;
    gap:4px;
    border-radius:999px;
    padding:4px 10px;
    background:#111827;
    color:#fff;
    font-weight:800;
    letter-spacing:0.03em;
  }
  .pill.warn {
    background:#dc2626;
  }
  .who {
    color:#1f2937;
    font-weight:700;
  }
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
const Kpis = styled.div` display:grid; gap:12px; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); `;
const Kpi = styled.div`
  position: relative;
  border: 1px solid rgba(226, 232, 240, 1);
  border-radius: 16px;
  padding: 18px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 14px;
  align-items: center;
  background: #ffffff;
  overflow: hidden;
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
  &:hover {
    transform: translateY(-2px);
    border-color: rgba(148, 163, 184, 0.4);
    box-shadow: 0 16px 32px rgba(15, 23, 42, 0.08);
  }
  &:before {
    content: '';
    position: absolute;
    inset: auto -25% -35% -25%;
    height: 60%;
    background: var(--kpi-bg, #eef2ff);
    filter: blur(28px);
    z-index: 0;
  }
  &[data-variant='1'] { --kpi-bg:#e0e7ff; --kpi-icon-bg:rgba(224,231,255,0.7); --kpi-icon-color:#4338ca; }
  &[data-variant='2'] { --kpi-bg:#dcfce7; --kpi-icon-bg:rgba(187,247,208,0.7); --kpi-icon-color:#15803d; }
  &[data-variant='3'] { --kpi-bg:#fee2e2; --kpi-icon-bg:rgba(254,215,215,0.7); --kpi-icon-color:#b91c1c; }
  &[data-loading] {
    background: #f8fafc;
  }
  &[data-loading]:before {
    opacity: 0;
  }
  &[data-loading] .icon {
    background: rgba(226, 232, 240, 0.8);
    color: #94a3b8;
  }
  .icon {
    position: relative;
    z-index: 1;
    display: grid;
    place-items: center;
    width: 48px;
    height: 48px;
    border-radius: 14px;
    background: var(--kpi-icon-bg, rgba(224, 231, 255, 0.7));
    color: var(--kpi-icon-color, #4338ca);
    flex-shrink: 0;
  }
  .content {
    position: relative;
    z-index: 1;
    display: grid;
    gap: 6px;
  }
  .label { color:#6b7280; font-size:12px; font-weight:700; letter-spacing:0.01em; }
  .value { color:#0f172a; font-size:20px; font-weight:800; letter-spacing:-0.01em; }
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
const QuickGrid = styled.div`
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
`;
const QuickCard = styled.button`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  background: #ffffff;
  color: #0f172a;
  text-align: left;
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease, background 0.18s ease;
  text-decoration: none;
  position: relative;
  z-index: 0;
  .iconWrap {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: rgba(224, 231, 255, 0.6);
    color: #4338ca;
    flex-shrink: 0;
  }
  .body {
    display: grid;
    gap: 6px;
  }
  .title {
    font-size: 14px;
    font-weight: 700;
    letter-spacing: -0.005em;
  }
  .desc {
    font-size: 12px;
    color: #475569;
    line-height: 1.5;
  }
  &:hover {
    transform: translateY(-2px);
    border-color: rgba(99, 102, 241, 0.35);
    box-shadow: 0 16px 32px rgba(15, 23, 42, 0.12);
  }
  &:focus-visible {
    outline: 2px solid rgba(79, 70, 229, 0.55);
    outline-offset: 2px;
  }
  &:active {
    transform: translateY(0);
    box-shadow: 0 6px 18px rgba(15, 23, 42, 0.12);
  }
  &[href] {
    cursor: pointer;
  }
`;
const FeedbackMeta = styled.div`
  display:flex;
  align-items:center;
  flex-wrap:wrap;
  gap:10px;
  margin-bottom:10px;
  font-size:12px;
  color:#475569;
  span { font-weight:700; }
  a { margin-left:auto; }
`;
const InlineMiniError = styled.div`
  margin-bottom:8px;
  padding:10px 12px;
  border-radius:10px;
  border:1px solid #fecaca;
  background:#fef2f2;
  color:#b91c1c;
  font-size:12px;
  font-weight:600;
`;
const FeedbackCell = styled.div`
  display:grid;
  gap:4px;
  .subject { font-weight:700; color:#111827; }
  .excerpt { color:#475569; font-size:12px; line-height:1.5; white-space:pre-line; }
  .meta { color:#94a3b8; font-size:11px; }
`;
const FeedbackStatus = styled.span`
  display:inline-flex;
  align-items:center;
  justify-content:center;
  min-width:52px;
  padding:4px 10px;
  border-radius:999px;
  font-size:12px;
  font-weight:700;
  background:#e2e8f0;
  color:#0f172a;
  &[data-status='NEW'] { background:#fef3c7; color:#b45309; }
  &[data-status='ACK'] { background:#e0e7ff; color:#4338ca; }
  &[data-status='CLOSED'] { background:#dcfce7; color:#15803d; }
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
  display:flex;
  align-items:center;
  justify-content:center;
  gap:8px;
  padding:18px;
  font-size:13px;
  font-weight:600;
  color:${({ $variant }) => $variant === 'error' ? '#b91c1c' : '#475569'};
  background:${({ $variant }) => $variant === 'error' ? 'rgba(254, 242, 242, 0.9)' : 'rgba(241, 245, 249, 0.9)'};
  border:1px dashed ${({ $variant }) => $variant === 'error' ? 'rgba(248, 113, 113, 0.6)' : 'rgba(148, 163, 184, 0.5)'};
  border-radius:12px;
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
                      {r.createdAt ? (() => {
                        const label = formatKoreanDate(r.createdAt, { includeWeekday: true });
                        return ` • 가입일 ${label === '—' ? r.createdAt : label}`;
                      })() : ''}
                      {(() => {
                        const timestamps = [r.loginLastAt, r.apiLastAt, r.paymentLastAt]
                          .filter(Boolean)
                          .map((x) => new Date(x as string).getTime())
                          .filter((t) => Number.isFinite(t));
                        if (timestamps.length === 0) return '';
                        const last = new Date(Math.max(...timestamps));
                        const label = formatKoreanDateTime(last, { includeWeekday: true });
                        return ` • 최근활동 ${label === '—' ? last.toLocaleString('ko-KR',{ hour12: false }) : label}`;
                      })()}
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
