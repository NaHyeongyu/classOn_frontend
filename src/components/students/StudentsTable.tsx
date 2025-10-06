import styled from "styled-components";
import { SectionCard as TableCard, Scroller, TableBase as Table, EmptyState, Skeleton } from "../common/UI";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { listStudents, type Student, type PageResult } from "../../api/students";
import { formatPhone } from "../../lib/format";
import { visiblePages } from "../../lib/pagination";
// No row-level destructive actions here; deletion is available only on edit page.

type ChipType = "수강중" | "휴학" | "대기중";

function statusKr(s: Student["status"]): ChipType {
  return s === "ENROLLED" ? "수강중" : s === "ON_LEAVE" ? "휴학" : "대기중";
}

type Filters = {
  status?: "" | "ENROLLED" | "ON_LEAVE" | "PENDING";
  from?: string;
  to?: string;
  ageMin?: string;
  ageMax?: string;
  q?: string;
};

export default function StudentsTable({ filters, refreshKey }: { filters: Filters; refreshKey?: number }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [rows, setRows] = useState<Student[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(() => {
    const p = Number(searchParams.get('page'));
    return Number.isFinite(p) && p >= 0 ? p : 0;
  });
  const [size, setSize] = useState(() => {
    const s = Number(searchParams.get('size'));
    return (s === 10 || s === 20 || s === 50) ? s : 10;
  });
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  // Deletion controls removed from list view

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setError(null);
      setLoading(true);
      try {
        const res: PageResult<Student> = await listStudents({
          page,
          size,
          status: (filters.status as any) || undefined,
          q: filters.q || undefined,
          from: filters.from || undefined,
          to: filters.to || undefined,
          ageMin: filters.ageMin ? Number(filters.ageMin) : undefined,
          ageMax: filters.ageMax ? Number(filters.ageMax) : undefined,
        });
        if (!cancelled) {
          setRows(res.content);
          setTotalPages(res.totalPages);
          setTotalElements(res.totalElements);
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "원생 불러오기에 실패했습니다.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => { cancelled = true; };
  }, [page, size, filters.status, filters.q, filters.from, filters.to, filters.ageMin, filters.ageMax, refreshKey]);

  // Reset to first page when filters change
  useEffect(() => { setPage(0); }, [filters.status, filters.q, filters.from, filters.to, filters.ageMin, filters.ageMax]);

  // Sync from URL params (for back/forward navigation)
  const view = useMemo(() => rows.map((r, idx) => {
    let ageText: string;
    if (r.birthDate) {
      const y = Number(r.birthDate.split('-')[0]);
      const now = new Date();
      const korean = now.getFullYear() - y + 1;
      ageText = String(korean);
    } else {
      ageText = r.age != null ? String(r.age) : '-';
    }
    const seqDesc = Math.max(0, totalElements - (page * size) - idx);
    return ({
      seq: seqDesc,
      code: r.code,
      id: r.id,
      name: r.name,
      age: ageText,
      phone: formatPhone(r.phoneNumber),
      course: r.courses?.map(c => c.title).join(", ") || "-",
      guardian: formatPhone(r.guardianPhone),
      status: statusKr(r.status),
      joinedAt: r.joinedDate || (r.createdAt?.slice(0,10)) || "-",
    });
  }), [rows, page, size, totalElements]);

  function changePage(p: number) {
    if (p < 0 || p >= totalPages) return;
    setPage(p);
  }

  // no bulk/Excel features

  return (
    <TableCard>
      <CardInner>
      <TableHead>
        <div>
          <strong>원생 목록</strong>
          <Muted>
            {loading ? "불러오는 중..." : `총 ${totalElements}명의 원생이 조회되었습니다.`}
          </Muted>
          {error && <ErrText>{error}</ErrText>}
        </div>
      </TableHead>
      <Scroller>
        <StyledTable>
          <colgroup>
            <col style={{ width: '7%' }} />       {/* 번호 */}
            <col style={{ width: '16%' }} />      {/* 이름 */}
            <col style={{ width: '12%' }} />      {/* 연락처 */}
            <col style={{ width: '7%' }} />       {/* 나이 */}
            <col style={{ width: '27%' }} />      {/* 수강수업 */}
            <col style={{ width: '10%' }} />      {/* 보호자 연락처 */}
            <col style={{ width: '7%' }} />       {/* 상태 */}
            <col style={{ width: '14%' }} />      {/* 등록일 */}
          </colgroup>
          <thead>
            <tr>
              <th>번호</th>
              <th>이름</th>
              <th>연락처</th>
              <th>나이</th>
              <th>수강수업</th>
              <th>보호자 연락처</th>
              <th>상태</th>
              <th>등록일</th>
            </tr>
          </thead>
          <tbody>
            {loading && rows.length === 0 && (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={`sk-${i}`}>
                  <td colSpan={8}><Skeleton h={14} /></td>
                </tr>
              ))
            )}
            {!loading && view.length === 0 && (
              <tr>
                <td colSpan={8}>
                  <EmptyState>조건에 맞는 결과가 없습니다.</EmptyState>
                </td>
              </tr>
            )}
            {view.map((r) => (
              <tr key={r.id}>
                <td>{r.seq}</td>
                <td>
                  <NameLink type="button" onClick={() => navigate(`/students/${r.id}/courses`)} title="상세 보기">
                    <NameText title={r.name}>{r.name}</NameText>
                  </NameLink>
                </td>
                <td>{r.phone || '-'}</td>
                <td>{r.age}</td>
                <td>
                  <CourseText title={r.course || '-' }>{r.course || '-'}</CourseText>
                </td>
                <td>{r.guardian || '-'}</td>
                <td>
                  <Chip type={r.status}>{r.status}</Chip>
                </td>
                <td>{r.joinedAt}</td>
              </tr>
            ))}
          </tbody>
      </StyledTable>
    </Scroller>
      <Pager>
        <PageBtn onClick={() => changePage(page - 1)} disabled={page === 0}>이전</PageBtn>
        {visiblePages(page, totalPages, 7).map(p => (
          <PageBtn key={p} data-active={p === page} onClick={() => changePage(p)}>{p + 1}</PageBtn>
        ))}
        <PageBtn onClick={() => changePage(page + 1)} disabled={page >= totalPages - 1}>다음</PageBtn>
        <PageSize>
          <span>페이지당</span>
          <select value={size} onChange={(e) => { const next = Number(e.target.value); setPage(0); setSize(next); }}>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </PageSize>
      </Pager>
      </CardInner>
      {/* Row-level delete dialog removed; delete is available in the edit page */}
    </TableCard>
  );
}

// Card provided by common UI
const TableHead = styled.div`
  display: flex; align-items: center; justify-content: flex-start;
`;
const Muted = styled.div`
  color: #6b7280; font-size: 12px; margin-top: 4px;
`;
// Buttons from common UI
// Scroller/Table from common UI
const NameLink = styled.button`
  all: unset; cursor: pointer; color: #1f2937; font-weight: 800;
  &:hover { text-decoration: underline; }
`;
const Chip = styled.span<{ type: ChipType }>`
  padding: 2px 8px; border-radius: 9999px; font-size: 12px; font-weight: 800;
  ${({ type }) => type === '수강중' ? 'background:#dcfce7; color:#16a34a;' : type === '휴학' ? 'background:#fef3c7; color:#b45309;' : 'background:#f3e8ff; color:#7c3aed;'}
`;
const ErrText = styled.div`
  color: #b91c1c; font-size: 12px; margin-top: 4px;
`;
const Pager = styled.div`
  display: flex; gap: 6px; justify-content: center; padding-top: 4px;
`;
const PageBtn = styled.button<{ disabled?: boolean }>`
  min-width: 28px; height: 28px; padding: 0 8px; border-radius: 8px; border: 1px solid #e5e7eb; background: #fff; font-size: 12px; color: #111827;
  &[data-active='true'] { background: #111827; color: #fff; border-color: #111827; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;
const PageSize = styled.div`
  display: inline-flex; align-items: center; gap: 6px; margin-left: 12px; color: #6b7280; font-size: 12px;
  select { height: 28px; border: 1px solid #e5e7eb; border-radius: 8px; background: #fff; padding: 0 8px; }
`;

const CardInner = styled.div` position: relative; `;

const StyledTable = styled(Table)`
  table-layout: fixed;
  width: 100%;
  thead th {
    background: #f8fafc;
    color: #334155;
    font-weight: 800;
    text-align: center;
  }
  thead th, tbody td {
    vertical-align: middle;
    padding: 12px;
    text-align: center;
    /* vertical separators between columns */
    border-right: 1px solid #f1f5f9;
  }
  thead th:last-child, tbody td:last-child { border-right: none; }
  tbody td { font-size: 13.5px; color: #0f172a; }
  /* 숫자 폰트 형태 정리: 번호(1열), 나이(4열) */
  thead th:nth-child(1), tbody td:nth-child(1),
  thead th:nth-child(4), tbody td:nth-child(4) { font-feature-settings: 'tnum'; }
`;

const NameText = styled.span`
  display: inline-block;
  max-width: 240px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CourseText = styled.span`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  white-space: normal;
  line-height: 1.4;
  max-height: calc(1.4em * 2);
`;
