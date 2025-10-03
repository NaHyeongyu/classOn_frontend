import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { getAcademySummary, getAcademyPaymentsPaged, getAcademyLoginLogsPaged, getAcademyApiLogsPaged } from '@/api/admin';

export default function AdminAcademyDetail() {
  const { id } = useParams();
  const academyId = id as string;
  const [summary, setSummary] = useState<any | null>(null);
  const [from, setFrom] = useState<string>(() => { const d = new Date(); d.setDate(d.getDate() - 30); return d.toISOString().slice(0,10); });
  const [to, setTo] = useState<string>(() => new Date().toISOString().slice(0,10));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // payments pager
  const [pays, setPays] = useState<any[]>([]);
  const [payPage, setPayPage] = useState(0);
  const [paySize, setPaySize] = useState(20);
  const [payTotalPages, setPayTotalPages] = useState(0);

  // logins pager
  const [logRows, setLogRows] = useState<any[]>([]);
  const [logPage, setLogPage] = useState(0);
  const [logSize, setLogSize] = useState(20);
  const [logTotalPages, setLogTotalPages] = useState(0);
  const [logQ, setLogQ] = useState('');

  // api logs pager
  const [apiRows, setApiRows] = useState<any[]>([]);
  const [apiPage, setApiPage] = useState(0);
  const [apiSize, setApiSize] = useState(20);
  const [apiTotalPages, setApiTotalPages] = useState(0);
  const [apiQ, setApiQ] = useState('');

  async function loadSummary() {
    setLoading(true); setError(null);
    try {
      const s = await getAcademySummary(academyId, { from, to });
      setSummary(s);
    } catch (e: any) { setError(e?.message || '요약을 불러오지 못했습니다.'); }
    finally { setLoading(false); }
  }

  async function loadPays(p = payPage, s = paySize) {
    try {
      const res = await getAcademyPaymentsPaged(academyId, { page: p, size: s, from, to });
      setPays(res.content || []);
      setPayPage(res.page); setPaySize(res.size); setPayTotalPages(res.totalPages);
    } catch {}
  }
  async function loadLogins(p = logPage, s = logSize) {
    try {
      const res = await getAcademyLoginLogsPaged(academyId, { page: p, size: s, from, to, q: logQ || undefined });
      setLogRows(res.content || []);
      setLogPage(res.page); setLogSize(res.size); setLogTotalPages(res.totalPages);
    } catch {}
  }
  async function loadApi(p = apiPage, s = apiSize) {
    try {
      const res = await getAcademyApiLogsPaged(academyId, { page: p, size: s, from, to, q: apiQ || undefined });
      setApiRows(res.content || []);
      setApiPage(res.page); setApiSize(res.size); setApiTotalPages(res.totalPages);
    } catch {}
  }

  useEffect(() => { void loadSummary(); void loadPays(0, paySize); void loadLogins(0, logSize); void loadApi(0, apiSize); }, [academyId]);
  useEffect(() => { void loadSummary(); void loadPays(0, paySize); void loadLogins(0, logSize); void loadApi(0, apiSize); }, [from, to]);

  return (
    <Wrap>
      <Header>
        <div>
          <h2>학원 상세</h2>
          <Sub>{summary ? `${summary.name} (#${summary.id})` : '불러오는 중…'}</Sub>
        </div>
        <Filters>
          <label>기간</label>
          <Input type="date" lang="ko-KR" value={from} onChange={(e)=>setFrom(e.target.value)} />
          <span>~</span>
          <Input type="date" lang="ko-KR" value={to} onChange={(e)=>setTo(e.target.value)} />
          <MonoGhost as="button" type="button" onClick={()=>{ void loadSummary(); void loadPays(0, paySize); void loadLogins(0, logSize); void loadApi(0, apiSize); }}>적용</MonoGhost>
        </Filters>
      </Header>

      {error && <Err>{error}</Err>}

      <GridTwo>
        <Card>
          <h3>요약</h3>
          {summary ? (
            <ul>
              <li><span className="k">학생수</span><span className="v">{summary.students}</span></li>
              <li><span className="k">수업수</span><span className="v">{summary.courses}</span></li>
              <li><span className="k">오늘 수업</span><span className="v">{summary.classesToday}</span></li>
              <li><span className="k">기간 API</span><span className="v">{summary.apiCalls}</span></li>
              <li><span className="k">기간 로그인</span><span className="v">{summary.logins}</span></li>
              <li><span className="k">기간 결제건수</span><span className="v">{summary.paymentCount}</span></li>
              <li><span className="k">기간 결제합계(원)</span><span className="v">{Math.round((summary.paymentAmountCents||0)/100).toLocaleString('ko-KR')}</span></li>
            </ul>
          ) : (<Muted>요약을 불러오는 중…</Muted>)}
        </Card>

        <Card>
          <h3>결제 기록</h3>
          <TableWrap>
            <Table>
              <thead><tr><th>시간</th><th>금액</th><th>통화</th><th>상태</th><th>비고</th></tr></thead>
              <tbody>
                {pays.map((p,i) => (
                  <tr key={p.id || i}><td>{new Date(p.createdAt).toLocaleString('ko-KR', { dateStyle: 'medium', timeStyle: 'short' })}</td><td>{(p.amountCents/100).toLocaleString('ko-KR')}</td><td>{p.currency}</td><td>{p.status}</td><td>{p.description || '-'}</td></tr>
                ))}
                {pays.length === 0 && <tr><td colSpan={5}><Muted>표시할 데이터가 없습니다.</Muted></td></tr>}
              </tbody>
            </Table>
          </TableWrap>
          <Pager>
            <MonoGhost as="button" type="button" onClick={()=>loadPays(Math.max(0, payPage-1), paySize)} disabled={payPage<=0}>이전</MonoGhost>
            <span>{payPage+1} / {Math.max(1,payTotalPages)}</span>
            <MonoGhost as="button" type="button" onClick={()=>loadPays(Math.min(payTotalPages-1, payPage+1), paySize)} disabled={payPage>=payTotalPages-1}>다음</MonoGhost>
          </Pager>
        </Card>
      </GridTwo>

      <GridTwo>
        <Card>
          <HeaderRow>
            <h3>로그인 기록</h3>
            <div style={{ display:'flex', gap:8, alignItems:'center' }}>
              <Input placeholder="아이디 검색" value={logQ} onChange={(e)=>setLogQ(e.target.value)} onKeyDown={(e)=>{ if (e.key==='Enter') void loadLogins(0, logSize); }} />
              <MonoGhost as="button" type="button" onClick={()=>loadLogins(0, logSize)}>검색</MonoGhost>
            </div>
          </HeaderRow>
          <TableWrap>
            <Table>
              <thead><tr><th>시간</th><th>아이디</th><th>IP</th><th>성공</th></tr></thead>
              <tbody>
                {logRows.map((r,i) => (
                  <tr key={r.id || i}><td>{new Date(r.createdAt).toLocaleString('ko-KR', { dateStyle: 'medium', timeStyle: 'short' })}</td><td>{r.username}</td><td>{r.ip || '-'}</td><td>{r.success ? 'Y' : 'N'}</td></tr>
                ))}
                {logRows.length === 0 && <tr><td colSpan={4}><Muted>표시할 데이터가 없습니다.</Muted></td></tr>}
              </tbody>
            </Table>
          </TableWrap>
          <Pager>
            <MonoGhost as="button" type="button" onClick={()=>loadLogins(Math.max(0, logPage-1), logSize)} disabled={logPage<=0}>이전</MonoGhost>
            <span>{logPage+1} / {Math.max(1,logTotalPages)}</span>
            <MonoGhost as="button" type="button" onClick={()=>loadLogins(Math.min(logTotalPages-1, logPage+1), logSize)} disabled={logPage>=logTotalPages-1}>다음</MonoGhost>
          </Pager>
        </Card>

        <Card>
          <HeaderRow>
            <h3>API 요청 로그</h3>
            <div style={{ display:'flex', gap:8, alignItems:'center' }}>
              <Input placeholder="경로 검색" value={apiQ} onChange={(e)=>setApiQ(e.target.value)} onKeyDown={(e)=>{ if (e.key==='Enter') void loadApi(0, apiSize); }} />
              <MonoGhost as="button" type="button" onClick={()=>loadApi(0, apiSize)}>검색</MonoGhost>
            </div>
          </HeaderRow>
          <TableWrap>
            <Table>
              <thead><tr><th>시간</th><th>메서드</th><th>경로</th><th>상태</th><th>IP</th></tr></thead>
              <tbody>
                {apiRows.map((r,i) => (
                  <tr key={r.id || i}><td>{new Date(r.createdAt).toLocaleString('ko-KR', { dateStyle: 'medium', timeStyle: 'short' })}</td><td>{r.method}</td><td>{r.path}</td><td>{r.status}</td><td>{r.ip || '-'}</td></tr>
                ))}
                {apiRows.length === 0 && <tr><td colSpan={5}><Muted>표시할 데이터가 없습니다.</Muted></td></tr>}
              </tbody>
            </Table>
          </TableWrap>
          <Pager>
            <MonoGhost as="button" type="button" onClick={()=>loadApi(Math.max(0, apiPage-1), apiSize)} disabled={apiPage<=0}>이전</MonoGhost>
            <span>{apiPage+1} / {Math.max(1,apiTotalPages)}</span>
            <MonoGhost as="button" type="button" onClick={()=>loadApi(Math.min(apiTotalPages-1, apiPage+1), apiSize)} disabled={apiPage>=apiTotalPages-1}>다음</MonoGhost>
          </Pager>
        </Card>
      </GridTwo>
    </Wrap>
  );
}

const Wrap = styled.div` display:grid; gap:16px; `;
const Header = styled.div` display:flex; align-items:center; justify-content:space-between; gap:12px; `;
const Filters = styled.div` display:flex; gap:8px; align-items:center; flex-wrap:wrap; `;
const Sub = styled.div` color:#6b7280; font-size:12px; `;
const Err = styled.div` color:#b91c1c; font-size:13px; `;
const GridTwo = styled.div` display:grid; gap:16px; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); `;
const Card = styled.div` border:1px solid #e5e7eb; border-radius:12px; background:#fff; padding:12px; display:grid; gap:8px; `;
const HeaderRow = styled.div` display:flex; align-items:center; justify-content:space-between; `;
const Input = styled.input` height:40px; border:1px solid #e5e7eb; border-radius:10px; padding:0 12px; font-size:14px; `;
const MonoGhost = styled.button` height:40px; padding:0 12px; border-radius:10px; background:#fff; color:#111827; border:1px solid #e5e7eb; &:hover{ background:#f9fafb; } `;
const TableWrap = styled.div` width:100%; overflow:auto; border:1px solid #f1f5f9; border-radius:12px; `;
const Table = styled.table` width:100%; border-collapse:collapse; thead th{ text-align:left; font-size:12px; color:#6b7280; border-bottom:1px solid #e5e7eb; padding:8px; } tbody td{ padding:8px; border-bottom:1px solid #f1f5f9; font-size:13px; color:#111827; }`;
const Muted = styled.div` color:#6b7280; font-size:12px; `;
const Pager = styled.div` display:flex; gap:8px; align-items:center; justify-content:flex-end; `;
