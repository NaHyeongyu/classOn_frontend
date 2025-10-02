import styled, { css } from "styled-components";
import { useMemo } from "react";
import { SectionCard as Section, TitleH3 as Title } from "@/components/common/UI";
import { invalidateCacheByPrefix } from "@/lib/fetcher";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useNavigate } from "react-router-dom";
import { routes } from "@/routes";
import { useEffect, useState } from "react";
import { getAdminOverview, getLoginLogs, getPayments, type AdminOverview } from "@/api/admin";
import { listAdminAcademies, type AdminAcademyRow } from "@/api/adminAcademies";

export default function AdminPage() {
  const nav = useNavigate();
  const { admin, logout } = useAdminAuth();
  const [ov, setOv] = useState<AdminOverview | null>(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [pays, setPays] = useState<any[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try { const [o, ls, ps] = await Promise.all([getAdminOverview(), getLoginLogs(), getPayments()]);
        if (!cancelled) {
          let withAcademies = o;
          if (!o || (o as any).academies == null) {
            try { const acc = await listAdminAcademies({ page: 0, size: 1 }); withAcademies = { ...(o||{}), academies: acc.totalElements as any } as AdminOverview; } catch {}
          }
          setOv(withAcademies);
          setLogs(ls);
          setPays(ps);
        }
      } catch { /* noop */ } finally { if (!cancelled) setLoading(false); }
    }
    void load();
    return () => { cancelled = true; };
  }, []);

  const items = useMemo(() => ([
    { label: "학원 수", value: ov?.academies ?? '—' },
    { label: "오늘 API 호출", value: ov?.apiCallsToday ?? '—' },
    { label: "오늘 OpenAI 호출", value: ov?.openaiCallsToday ?? '—' },
  ]), [ov]);

  function clearCaches() {
    invalidateCacheByPrefix([
      '/api/students',
      '/api/courses',
      '/api/calendar/classes',
      '/api/calendar/classes-range',
      '/api/dashboard/summary',
      '/api/dashboard/attendance-today',
      '/api/marketing/',
    ]);
    try { window.dispatchEvent(new CustomEvent('calendar:classes-refresh', { detail: {} })); } catch {}
  }

  function refreshNow() { window.location.reload(); }

  return (
    <Page>
      <Hero>
        <div className="info">
          <h1>관리자 대시보드</h1>
          <p>운영 현황을 빠르게 확인하고 도구를 실행하세요.</p>
        </div>
        <div className="actions">
          {!admin ? (
            <MonoGhost as="button" onClick={()=>nav(routes.admin + '/login')}>관리자 로그인</MonoGhost>
          ) : (
            <MonoGhost as="button" onClick={()=>logout()}>로그아웃</MonoGhost>
          )}
          <MonoPrimary type="button" onClick={clearCaches}>캐시 초기화</MonoPrimary>
          <MonoGhost as="button" onClick={refreshNow}>새로고침</MonoGhost>
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

      <Sections>
        <Section>
          <Title>요약</Title>
          <Kpis>
            {items.map((it, i) => (
              <Kpi key={i} data-variant={(i % 3) + 1}>
                <span className="label">{it.label}</span>
                <span className="value">{it.value}</span>
              </Kpi>
            ))}
          </Kpis>
        </Section>

        <Section>
          <Title>빠른 작업</Title>
          <QuickList>
            <li>
              <MonoGhost type="button" onClick={() => { try { window.dispatchEvent(new CustomEvent('calendar:classes-refresh', { detail: {} })); } catch {} }}>캘린더 강제 새로고침</MonoGhost>
            </li>
            <li>
              <MonoGhost type="button" onClick={clearCaches}>API 캐시 전체 무효화</MonoGhost>
            </li>
            <li>
              <MonoGhost as="a" href={routes.admin + '/logins'}>로그인 기록 보기</MonoGhost>
            </li>
          </QuickList>
        </Section>

        <Section>
          <Title>운영 데이터(학원별)</Title>
          <AcademiesTable />
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
                  <tr key={r.id || i}><td>{new Date(r.createdAt).toLocaleString()}</td><td>{r.username}</td><td>{r.ip || '-'}</td><td>{r.success ? 'Y' : 'N'}</td></tr>
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
                  <tr key={p.id || i}><td>{new Date(p.createdAt).toLocaleString()}</td><td>{(p.amountCents/100).toLocaleString('ko-KR')}</td><td>{p.currency}</td><td>{p.status}</td><td>{p.description || '-'}</td></tr>
                ))}
                {pays.length === 0 && <tr><td colSpan={5}><Muted>표시할 데이터가 없습니다.</Muted></td></tr>}
              </tbody>
            </Table>
          </TableWrap>
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
const StatusBar = styled.div`
  display:flex; gap:10px; align-items:center; color:#475569; font-size:12px;
  .pill { background:#111827; color:#fff; border-radius:999px; padding:4px 8px; font-weight:800; letter-spacing:.02em; }
  .pill.warn { background:#b91c1c; }
  .who { color:#334155; }
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
  .label { color:#6b7280; font-size:12px; font-weight:700; }
  .value { color:#0f172a; font-size:18px; font-weight:800; }
`;
const QuickList = styled.ul`
  list-style:none; padding:0; margin:0; display:grid; gap:8px;
  li { display:flex; }
`;
const Muted = styled.div` color:#6b7280; font-size:12px; `;

const monoButtonBase = css`
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
  height:40px; border:1px solid #e5e7eb; border-radius:10px; padding:0 12px; font-size:14px;
`;

function AcademiesTable() {
  const [rows, setRows] = useState<AdminAcademyRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string| null>(null);
  const [q, setQ] = useState('');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);

  async function load(p = page, s = size, keyword = q) {
    setLoading(true); setError(null);
    try { const res = await listAdminAcademies({ page: p, size: s, q: keyword || undefined });
      setRows(res.content || []); setPage(res.page); setSize(res.size); setTotalPages(res.totalPages);
    } catch (e:any) { setError(e?.message || '불러오지 못했습니다.'); }
    finally { setLoading(false); }
  }

  useEffect(() => { void load(0, size, q); }, []);

  return (
    <div style={{ display:'grid', gap: 8 }}>
      <div style={{ display:'flex', gap:8, alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <Input placeholder="학원명/사업자번호 검색" value={q} onChange={(e)=>setQ(e.target.value)} onKeyDown={(e)=>{ if (e.key==='Enter') void load(0, size, q); }} />
          <MonoGhost as="button" type="button" onClick={()=>load(0, size, q)}>검색</MonoGhost>
        </div>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <MonoGhost as="button" type="button" onClick={()=>load(Math.max(0, page-1), size, q)} disabled={page<=0}>이전</MonoGhost>
          <span>{page+1} / {Math.max(1,totalPages)}</span>
          <MonoGhost as="button" type="button" onClick={()=>load(Math.min(totalPages-1, page+1), size, q)} disabled={page>=totalPages-1}>다음</MonoGhost>
        </div>
      </div>
      <TableWrap>
        <Table>
          <thead>
            <tr>
              <th>학원명</th><th>학생수</th><th>수업수</th><th>오늘 수업</th><th>API</th><th>로그인</th><th>결제건수</th><th>결제합계(원)</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={8}><span>불러오는 중…</span></td></tr>}
            {error && <tr><td colSpan={8}><span style={{color:'#b91c1c'}}>{error}</span></td></tr>}
            {!loading && !error && rows.map((r, i) => (
              <tr key={r.id || i}>
                <td>{r.name}</td>
                <td>{r.students}</td>
                <td>{r.courses}</td>
                <td>{r.classesToday}</td>
                <td>{r.apiCalls}</td>
                <td>{r.logins}</td>
                <td>{r.paymentCount}</td>
                <td>{Math.round((r.paymentAmountCents||0)/100).toLocaleString('ko-KR')}</td>
              </tr>
            ))}
            {!loading && !error && rows.length === 0 && <tr><td colSpan={8}><Muted>표시할 데이터가 없습니다.</Muted></td></tr>}
          </tbody>
        </Table>
      </TableWrap>
    </div>
  );
}
