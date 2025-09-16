import styled from "styled-components";
import { SectionCard as TableCard, Scroller, TableBase as Table, GhostBtn as UIGhostBtn, PrimaryBtn as UIPrimaryBtn } from "../common/UI";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listStudents, type Student, type PageResult } from "../../api/students";
import { formatPhone } from "../../lib/format";
import { visiblePages } from "../../lib/pagination";

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
  const [rows, setRows] = useState<Student[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);

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
    return ({
      seq: page * size + idx + 1,
      id: r.id,
      name: r.name,
      age: ageText,
      phone: formatPhone(r.phoneNumber),
      course: r.courses?.map(c => c.title).join(", ") || "-",
      guardian: formatPhone(r.guardianPhone),
      status: statusKr(r.status),
      joinedAt: r.joinedDate || (r.createdAt?.slice(0,10)) || "-",
    });
  }), [rows, page, size]);

  function changePage(p: number) {
    if (p < 0 || p >= totalPages) return;
    setPage(p);
  }

  return (
    <TableCard>
      <TableHead>
        <div>
          <strong>원생 목록</strong>
          <Muted>{loading ? "불러오는 중..." : `총 ${totalElements}명의 원생이 조회되었습니다.`}</Muted>
          {error && <ErrText>{error}</ErrText>}
        </div>
        <HeadActions>
          <UIGhostBtn as={"button" as any}>엑셀로 다운받기</UIGhostBtn>
          <UIPrimaryBtn as={"button" as any} onClick={() => navigate('/students/new')}>원생 추가하기</UIPrimaryBtn>
        </HeadActions>
      </TableHead>
      <Scroller>
        <Table style={{ minWidth: 960 }}>
          <thead>
            <tr>
              <th>번호</th>
              <th>이름</th>
              <th>나이</th>
              <th>연락처</th>
              <th>수강수업</th>
              <th>보호자 연락처</th>
              <th>상태</th>
              <th>등록일</th>
            </tr>
          </thead>
          <tbody>
            {view.map((r) => (
              <tr key={r.id}>
                <td>{r.seq}</td>
                <td>
                  <NameLink type="button" onClick={() => navigate(`/students/${r.id}/courses`)} title="상세 보기">
                    {r.name}
                  </NameLink>
                </td>
                <td>{r.age}</td>
                <td>{r.phone || '-'}</td>
                <td>{r.course || '-'}</td>
                <td>{r.guardian || '-'}</td>
                <td>
                  <Chip type={r.status}>{r.status}</Chip>
                </td>
                <td>{r.joinedAt}</td>
              </tr>
            ))}
          </tbody>
      </Table>
    </Scroller>
      <Pager>
        <PageBtn onClick={() => changePage(page - 1)} disabled={page === 0}>이전</PageBtn>
        {visiblePages(page, totalPages, 7).map(p => (
          <PageBtn key={p} data-active={p === page} onClick={() => changePage(p)}>{p + 1}</PageBtn>
        ))}
        <PageBtn onClick={() => changePage(page + 1)} disabled={page >= totalPages - 1}>다음</PageBtn>
        <PageSize>
          <span>페이지당</span>
          <select value={size} onChange={(e) => { setPage(0); setSize(Number(e.target.value)); }}>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </PageSize>
      </Pager>
    </TableCard>
  );
}

// Card provided by common UI
const TableHead = styled.div`
  display: flex; align-items: center; justify-content: space-between;
`;
const Muted = styled.div`
  color: #6b7280; font-size: 12px; margin-top: 4px;
`;
const HeadActions = styled.div`
  display: inline-flex; gap: 8px;
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
