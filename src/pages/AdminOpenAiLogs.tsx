import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getOpenAiLogsPaged } from '@/api/admin';
import SelectBox from '@/components/common/SelectBox';

export default function AdminOpenAiLogs() {
  const [rows, setRows] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [model, setModel] = useState('');
  const [success, setSuccess] = useState<'all'|'ok'|'fail'>('all');
  const [from, setFrom] = useState<string>(() => { const d = new Date(); d.setDate(d.getDate() - 7); return d.toISOString().slice(0,10); });
  const [to, setTo] = useState<string>(() => new Date().toISOString().slice(0,10));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load(p = page, s = size) {
    setLoading(true); setError(null);
    try {
      const successBool = success === 'all' ? undefined : (success === 'ok');
      const res = await getOpenAiLogsPaged({ page: p, size: s, model: model || undefined, success: successBool, from, to });
      setRows(res.content || []);
      setPage(res.page); setSize(res.size); setTotalPages(res.totalPages);
    } catch (e: any) { setError(e?.message || '불러오지 못했습니다.'); }
    finally { setLoading(false); }
  }

  useEffect(() => { void load(0, size); }, []);

  return (
    <Wrap>
      <Header>
        <h2>OpenAI 호출 로그</h2>
        <Filters>
          <label>기간</label>
          <Input type="date" lang="ko-KR" value={from} onChange={(e)=>setFrom(e.target.value)} />
          <span>~</span>
          <Input type="date" lang="ko-KR" value={to} onChange={(e)=>setTo(e.target.value)} />
          <Input placeholder="모델 검색 (gpt-4o, ...)" value={model} onChange={(e)=>setModel(e.target.value)} onKeyDown={(e)=>{ if (e.key==='Enter') void load(0, size); }} />
          <SelectBox ariaLabel="성공여부" value={success} onChange={(v)=>setSuccess(v as any)} placeholder="성공 여부" options={[
            { label: '모두', value: 'all' },
            { label: '성공만', value: 'ok' },
            { label: '실패만', value: 'fail' },
          ]} />
          <MonoGhost as="button" type="button" onClick={()=>load(0, size)}>적용</MonoGhost>
        </Filters>
      </Header>
      {error && <Err>{error}</Err>}
      <TableWrap>
        <Table>
          <thead><tr><th>시간</th><th>모델</th><th>토큰</th><th>성공</th></tr></thead>
          <tbody>
            {loading && <tr><td colSpan={4}>불러오는 중…</td></tr>}
            {!loading && rows.map((r,i) => (
              <tr key={r.id || i}><td>{new Date(r.createdAt).toLocaleString('ko-KR', { dateStyle: 'medium', timeStyle: 'short' })}</td><td>{r.model}</td><td>{r.tokens ?? '-'}</td><td>{r.success ? 'Y' : 'N'}</td></tr>
            ))}
            {!loading && rows.length === 0 && <tr><td colSpan={4}>표시할 데이터가 없습니다.</td></tr>}
          </tbody>
        </Table>
      </TableWrap>
      <Pager>
        <MonoGhost as="button" type="button" onClick={()=>load(Math.max(0, page-1), size)} disabled={page<=0}>이전</MonoGhost>
        <span>{page+1} / {Math.max(1,totalPages)}</span>
        <MonoGhost as="button" type="button" onClick={()=>load(Math.min(totalPages-1, page+1), size)} disabled={page>=totalPages-1}>다음</MonoGhost>
      </Pager>
    </Wrap>
  );
}

const Wrap = styled.div` display:grid; gap:12px; `;
const Header = styled.div` display:flex; align-items:center; justify-content:space-between; gap:12px; `;
const Filters = styled.div` display:flex; gap:8px; align-items:center; flex-wrap:wrap; `;
const Input = styled.input` height:40px; border:1px solid #e5e7eb; border-radius:10px; padding:0 12px; font-size:14px; `;
const Err = styled.div` color:#b91c1c; font-size:13px; `;
const TableWrap = styled.div` width:100%; overflow:auto; border:1px solid #f1f5f9; border-radius:12px; `;
const Table = styled.table` width:100%; border-collapse:collapse; thead th{ text-align:left; font-size:12px; color:#6b7280; border-bottom:1px solid #e5e7eb; padding:8px; } tbody td{ padding:8px; border-bottom:1px solid #f1f5f9; font-size:13px; color:#111827; }`;
const MonoGhost = styled.button` height:40px; padding:0 12px; border-radius:10px; background:#fff; color:#111827; border:1px solid #e5e7eb; &:hover{ background:#f9fafb; } `;
const Pager = styled.div` display:flex; gap:8px; align-items:center; justify-content:flex-end; `;
