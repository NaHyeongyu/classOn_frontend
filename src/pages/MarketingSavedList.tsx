import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Page, PageHeader, SectionCard, GhostButtonSmall, PrimaryButton, Scroller, TableBase as Table } from '@/components/common/UI';
import { getSavedMarketingPosts, type SavedMarketing, clearSavedMarketingPosts } from '@/lib/savedMarketing';
import { listSaved, type SavedPost } from '@/api/marketingSaved';
import { useToast } from '@/components/common/Toast';

export default function MarketingSavedList() {
  const [rows, setRows] = useState<SavedMarketing[]>([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [platform, setPlatform] = useState<SavedPost['platform'] | ''>('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [q, setQ] = useState('');
  const { success, warning } = useToast();
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      try {
        const platformFilter = platform || undefined;
        const res = await listSaved({ page, size, platform: platformFilter, from, to, q });
        setRows(res.content.map(toLocal));
        setTotalPages(res.totalPages);
      } catch {
        setRows(getSavedMarketingPosts());
        setTotalPages(1);
      }
    })();
  }, [page, size, platform, from, to, q]);
  const data = useMemo(() => rows, [rows]);
  function reload() { setRows(getSavedMarketingPosts()); }

  function normalizeYMDInput(input: string): string {
    const s = (input || '').trim();
    if (!s) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
    const ymd = s.match(/^(\d{4})[./-]?(\d{2})[./-]?(\d{2})$/);
    if (ymd) return `${ymd[1]}-${ymd[2]}-${ymd[3]}`;
    const mdy = s.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/);
    if (mdy) {
      const mm = String(mdy[1]).padStart(2, '0');
      const dd = String(mdy[2]).padStart(2, '0');
      return `${mdy[3]}-${mm}-${dd}`;
    }
    const digits = s.replace(/\D/g, '');
    if (digits.length === 8) {
      if (/^\d{4}/.test(digits)) return `${digits.slice(0,4)}-${digits.slice(4,6)}-${digits.slice(6,8)}`;
      return `${digits.slice(4,8)}-${digits.slice(0,2)}-${digits.slice(2,4)}`;
    }
    return s;
  }

  return (
    <Page>
      <PageHeader>
        <div>
          <h2>저장 내역</h2>
          <p>Summary에서 저장한 캡션 목록입니다.</p>
        </div>
        <div style={{ display:'flex', gap: 12 }}>
          <GhostButtonSmall as="a" href="/marketing">마케팅 홈</GhostButtonSmall>
          {!!data.length && (
            <GhostButtonSmall as="button" onClick={() => { clearSavedMarketingPosts(); reload(); warning('저장 내역을 모두 삭제했습니다.'); }}>전체 삭제</GhostButtonSmall>
          )}
        </div>
      </PageHeader>

      <SectionCard>
        <FilterRow>
          <select value={platform} onChange={(e)=>{ setPage(0); setPlatform(e.target.value as any); }}>
            <option value=''>전체 플랫폼</option>
            <option value='INSTAGRAM'>인스타그램</option>
            <option value='NAVER_BLOG'>블로그</option>
            <option value='KAKAO_CHANNEL'>카카오 채널</option>
          </select>
          <input type="date" lang="ko-KR" inputMode="numeric" pattern="^\\d{4}-\\d{2}-\\d{2}$" placeholder="YYYY-MM-DD" value={from} onFocus={(e)=>{ try { (e.currentTarget as any).showPicker?.(); } catch {} }} onChange={(e)=>{ setPage(0); setFrom(normalizeYMDInput(e.target.value)); }} onBlur={(e)=>{ const v = normalizeYMDInput(e.currentTarget.value); if (v !== from) setFrom(v); }} />
          <span>~</span>
          <input type="date" lang="ko-KR" inputMode="numeric" pattern="^\\d{4}-\\d{2}-\\d{2}$" placeholder="YYYY-MM-DD" value={to} onFocus={(e)=>{ try { (e.currentTarget as any).showPicker?.(); } catch {} }} onChange={(e)=>{ setPage(0); setTo(normalizeYMDInput(e.target.value)); }} onBlur={(e)=>{ const v = normalizeYMDInput(e.currentTarget.value); if (v !== to) setTo(v); }} />
          <SearchBox>
            <input placeholder="본문 검색" value={q} onChange={(e)=> setQ(e.target.value)} onKeyDown={(e)=>{ if (e.key==='Enter'){ setPage(0);} }} />
            <GhostButtonSmall as="button" onClick={()=> setPage(0)}>검색</GhostButtonSmall>
          </SearchBox>
          <GhostButtonSmall as="button" onClick={()=>{ setPlatform(''); setFrom(''); setTo(''); setQ(''); setPage(0); }}>초기화</GhostButtonSmall>
        </FilterRow>
        {data.length === 0 ? (
          <>
            <Empty>아직 저장된 항목이 없습니다.</Empty>
            <div style={{ display:'flex', gap:8, justifyContent:'flex-start', marginTop: 8 }}>
              <GhostButtonSmall as="a" href="/marketing">마케팅 홈으로</GhostButtonSmall>
              <GhostButtonSmall as="a" href="/marketing/guide">가이드 보기</GhostButtonSmall>
            </div>
          </>
        ) : (
          <>
            <Scroller>
              <Table style={{ minWidth: 720 }}>
                <thead>
                  <tr>
                    <th>저장일</th>
                    <th>플랫폼</th>
                    <th>본문 요약</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((p) => (
                    <tr key={p.id} className="row" onClick={() => navigate(`/marketing/saved/${p.id}`)} title="상세 보기" style={{ cursor:'pointer' }}>
                      <td>{new Date(p.createdAt).toLocaleString()}</td>
                      <td>{pfLabel(p.platform)}</td>
                      <td className="mono">{p.body.slice(0, 140)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Scroller>
            <Pager>
              <PageBtn onClick={()=> setPage(p=> Math.max(0, p-1))} disabled={page<=0}>이전</PageBtn>
              <span>{page+1} / {Math.max(1,totalPages)}</span>
              <PageBtn onClick={()=> setPage(p=> Math.min(totalPages-1, p+1))} disabled={page>=totalPages-1}>다음</PageBtn>
            </Pager>
          </>
        )}
      </SectionCard>
    </Page>
  );
}

function pfLabel(p: SavedMarketing['platform']): string {
  return p==='INSTAGRAM' ? '인스타그램' : p==='NAVER_BLOG' ? '블로그' : '카카오 채널';
}

function toLocal(p: { id:number; platform:any; speechStyle?:any; tone?:string|null; title?:string|null; body:string; tags:string[]; createdAt?:string|null }): SavedMarketing {
  return { id: String(p.id), platform: p.platform, speechStyle: p.speechStyle, tone: p.tone ?? undefined, title: p.title ?? undefined, body: p.body, tags: p.tags || [], createdAt: p.createdAt ? new Date(p.createdAt).getTime() : Date.now() } as any;
}

const Empty = styled.div`
  color: ${({ theme }) => theme.colors.textMuted}; font-size: 13px;
`;
const FilterRow = styled.div`
  display: flex; gap: 8px; align-items: center; flex-wrap: wrap; margin-bottom: 10px;
  select, input[type='date'] { height: 36px; border: 1px solid ${({ theme }) => theme.colors.border}; border-radius: 10px; background: #fff; padding: 0 10px; font-size: 13px; }
`;
const SearchBox = styled.div`
  display: flex; gap: 6px; align-items: center;
  input { height: 36px; border: 1px solid ${({ theme }) => theme.colors.border}; border-radius: 10px; background: #fff; padding: 0 10px; font-size: 13px; }
`;
const Pager = styled.div`
  display: flex; gap: 10px; align-items: center; justify-content: flex-end; margin-top: 10px;
`;
const PageBtn = styled(GhostButtonSmall)`
  height: 40px; padding: 0 16px; font-size: 14px;
`;
// using common UI Scroller + TableBase for consistent table styling
