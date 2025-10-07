import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import {
  PageWrap,
  PageHeader,
  PageTitle,
  PageSubtitle,
  Toolbar,
  ToolbarGroup,
  ToolbarInfo,
  FieldLabel,
  Input,
  Select,
  MonoPrimary,
  MonoGhost,
  Card,
  CardHeader,
  CardMeta,
  TableWrap,
  Table,
  TableStatus,
  ErrorBanner,
} from '@/components/admin/AdminStyles';
import { useToast } from '@/components/common/Toast';
import { LoadingSpinner } from '@/components/common/Loading';
import { listFeedbacksPaged, updateFeedbackStatus, type AdminFeedbackRow } from '@/api/adminFeedback';
import { formatKoreanDateTime } from '@/lib/format';

type PagedResponse<T> = {
  content: T[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
};

type TypeFilter = '' | 'BUG' | 'FEATURE';
type StatusFilter = '' | 'NEW' | 'ACK' | 'CLOSED';

export default function AdminFeedbacks() {
  const { success: toastSuccess, error: toastError } = useToast();

  const [rows, setRows] = useState<AdminFeedbackRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [from, setFrom] = useState<string>('');
  const [to, setTo] = useState<string>('');
  const [typeInput, setTypeInput] = useState<TypeFilter>('');
  const [statusInput, setStatusInput] = useState<StatusFilter>('');
  const [qInput, setQInput] = useState('');

  // applied filters
  const typeRef = useRef<TypeFilter>('');
  const statusRef = useRef<StatusFilter>('');
  const qRef = useRef('');
  const sizeRef = useRef(size);

  useEffect(() => { sizeRef.current = size; }, [size]);

  const load = useCallback(async (pageToLoad: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await listFeedbacksPaged({
        page: pageToLoad,
        size: sizeRef.current,
        type: typeRef.current || undefined,
        status: statusRef.current || undefined,
        q: qRef.current || undefined,
        from: from || undefined,
        to: to || undefined,
      });
      const data = res as unknown as PagedResponse<AdminFeedbackRow>;
      setRows(data.content || []);
      setPage(data.page);
      setSize(data.size);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements ?? data.content?.length ?? 0);
    } catch (err) {
      const message = err instanceof Error ? err.message : '피드백을 불러오지 못했습니다.';
      setError(message);
      toastError(message);
    } finally {
      setLoading(false);
    }
  }, [from, to, toastError]);

  useEffect(() => { void load(0); }, [load]);

  const handleApplyFilters = useCallback(() => {
    typeRef.current = typeInput;
    statusRef.current = statusInput;
    qRef.current = qInput.trim();
    void load(0);
  }, [typeInput, statusInput, qInput, load]);

  const headerSubtitle = useMemo(() => {
    if (rows.length === 0) return '표시할 데이터가 없습니다.';
    const first = rows[0]?.createdAt;
    const last = rows[rows.length - 1]?.createdAt;
    if (!first || !last) return `${rows.length.toLocaleString('ko-KR')}건 표시 중`;
    return `${formatKoreanDateTime(first)} ~ ${formatKoreanDateTime(last)}`;
  }, [rows]);

  return (
    <PageWrap>
      <PageHeader>
        <div>
          <PageTitle>피드백</PageTitle>
          <PageSubtitle>{headerSubtitle}</PageSubtitle>
        </div>
        <Toolbar>
          <ToolbarGroup>
            <FieldLabel htmlFor="fb-type">유형</FieldLabel>
            <Select id="fb-type" value={typeInput} onChange={(e)=>setTypeInput(e.target.value as TypeFilter)}>
              <option value="">전체</option>
              <option value="BUG">오류</option>
              <option value="FEATURE">기능</option>
            </Select>
            <FieldLabel htmlFor="fb-status">상태</FieldLabel>
            <Select id="fb-status" value={statusInput} onChange={(e)=>setStatusInput(e.target.value as StatusFilter)}>
              <option value="">전체</option>
              <option value="NEW">신규</option>
              <option value="ACK">확인</option>
              <option value="CLOSED">종료</option>
            </Select>
            <FieldLabel htmlFor="fb-q">검색</FieldLabel>
            <Input id="fb-q" placeholder="제목/내용 검색" value={qInput} onChange={(e)=>setQInput(e.target.value)} onKeyDown={(e)=>{ if (e.key==='Enter') { e.preventDefault(); handleApplyFilters(); } }} />
          </ToolbarGroup>
          <ToolbarGroup>
            <FieldLabel htmlFor="fb-from">기간</FieldLabel>
            <Input id="fb-from" type="date" lang="ko-KR" value={from} onChange={(e)=>setFrom(e.target.value)} />
            <span>~</span>
            <Input id="fb-to" type="date" lang="ko-KR" value={to} onChange={(e)=>setTo(e.target.value)} />
            <MonoPrimary type="button" onClick={handleApplyFilters} disabled={loading}>필터 적용</MonoPrimary>
          </ToolbarGroup>
        </Toolbar>
      </PageHeader>

      {error ? <ErrorBanner role="status">⚠️ {error}</ErrorBanner> : null}

      <Card>
        <CardHeader>
          <div>
            <h3>제출 목록</h3>
            <CardMeta>총 {totalElements.toLocaleString('ko-KR')}건</CardMeta>
          </div>
          <ToolbarInfo>페이지 {totalPages === 0 ? 0 : page + 1} / {Math.max(1, totalPages)}</ToolbarInfo>
        </CardHeader>
        <TableWrap>
          <Table>
            <thead>
              <tr>
                <th style={{minWidth:150}}>시간</th>
                <th>학원</th>
                <th>사용자</th>
                <th>유형</th>
                <th>상태</th>
                <th>제목</th>
                <th>연락처</th>
                <th>페이지</th>
                <th>브라우저</th>
                <th>작업</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={10}><TableStatus><LoadingSpinner /><span>불러오는 중…</span></TableStatus></td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={10}><TableStatus>표시할 데이터가 없습니다.</TableStatus></td></tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.id}>
                    <td>{formatKoreanDateTime(r.createdAt)}</td>
                    <td>{r.academyName ? `${r.academyName} (#${r.academyId})` : '-'}</td>
                    <td>{r.username ? `${r.username} (#${r.userId})` : '-'}</td>
                    <td>{r.type === 'BUG' ? '오류' : '기능'}</td>
                    <td>
                      <StatusSelect value={r.status} onChange={async (e) => {
                        const next = e.target.value as 'NEW'|'ACK'|'CLOSED';
                        const prev = r.status;
                        try {
                          await updateFeedbackStatus(r.id, next);
                          setRows((curr) => curr.map((x) => x.id === r.id ? { ...x, status: next } : x));
                          toastSuccess('상태를 업데이트했습니다.');
                        } catch (err) {
                          toastError(err instanceof Error ? err.message : '상태 업데이트에 실패했습니다.');
                          // revert select UI
                          setRows((curr) => curr.map((x) => x.id === r.id ? { ...x, status: prev } : x));
                        }
                      }}>
                        <option value="NEW">신규</option>
                        <option value="ACK">확인</option>
                        <option value="CLOSED">종료</option>
                      </StatusSelect>
                    </td>
                    <td title={r.title}>{r.title}</td>
                    <td>{r.contact || '-'}</td>
                    <td>
                      {r.pageUrl ? (
                        <a href={r.pageUrl} target="_blank" rel="noreferrer">열기</a>
                      ) : '-' }
                    </td>
                    <td title={r.userAgent || ''}>{r.userAgent ? shortenUa(r.userAgent) : '-'}</td>
                    <td>
                      <MonoGhost as="button" type="button" onClick={() => alert(r.body)}>
                        내용 보기
                      </MonoGhost>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </TableWrap>
      </Card>

      <Toolbar>
        <ToolbarGroup>
          <ToolbarInfo>페이지 {totalPages === 0 ? 0 : page + 1} / {Math.max(1, totalPages)}</ToolbarInfo>
        </ToolbarGroup>
        <ToolbarGroup>
          <FieldLabel htmlFor="fb-size">표시 개수</FieldLabel>
          <Select id="fb-size" value={size} onChange={(e)=>{ const next = Number(e.target.value); setSize(next); sizeRef.current = next; void load(0); }}>
            {[20,50,100].map((n) => (<option key={n} value={n}>{n}개씩</option>))}
          </Select>
          <MonoGhost as="button" type="button" onClick={()=>void load(Math.max(0, page-1))} disabled={page<=0 || loading}>이전</MonoGhost>
          <MonoGhost as="button" type="button" onClick={()=>void load(Math.min(totalPages-1, page+1))} disabled={page>=totalPages-1 || loading}>다음</MonoGhost>
        </ToolbarGroup>
      </Toolbar>
    </PageWrap>
  );
}

function shortenUa(ua: string) {
  try {
    // rudimentary shortening: keep first 40 chars
    return ua.length > 40 ? `${ua.slice(0, 40)}…` : ua;
  } catch {
    return ua;
  }
}

const StatusSelect = styled.select`
  height: 32px;
  padding: 0 10px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: #fff;
  font-size: 13px;
`;

