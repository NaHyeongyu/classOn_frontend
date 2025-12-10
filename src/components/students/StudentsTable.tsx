import styled from "styled-components";
import { SectionCard as TableCard, Scroller, TableBase as Table, EmptyState, Skeleton } from "../common/UI";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { listStudents, type Student, type PageResult } from "../../api/students";
import { readableError } from "@/lib/errors";
import { formatPhone } from "../../lib/format";
import Pagination from "../common/Pagination";
// No row-level destructive actions here; deletion is available only on edit page.

type ChipType = "수강중" | "휴학" | "대기중";
type ViewRow = {
  seq: number;
  code?: string | null;
  id: number;
  name: string;
  age: string;
  phone: string;
  course: string;
  guardian: string;
  status: ChipType;
  joinedAt: string;
};

function statusKr(s: Student["status"]): ChipType {
  return s === "ENROLLED" ? "수강중" : s === "ON_LEAVE" ? "휴학" : "대기중";
}

const EMPTY_ROWS: Student[] = [];

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
  const [page, setPage] = useState(() => {
    const p = Number(searchParams.get('page'));
    return Number.isFinite(p) && p >= 0 ? p : 0;
  });
  const [size, setSize] = useState(() => {
    const s = Number(searchParams.get('size'));
    return (s === 10 || s === 20 || s === 50) ? s : 10;
  });
  // Deletion controls removed from list view

  const trimmedQuery = (filters.q ?? "").trim();
  const refreshToken = refreshKey ?? 0;

  const query = useQuery<PageResult<Student>, unknown>({
    queryKey: [
      "students",
      page,
      size,
      filters.status ?? "",
      trimmedQuery,
      filters.from ?? "",
      filters.to ?? "",
      filters.ageMin ?? "",
      filters.ageMax ?? "",
      refreshToken,
    ],
    queryFn: () =>
      listStudents({
        page,
        size,
        status: filters.status || undefined,
        q: trimmedQuery || undefined,
        from: filters.from || undefined,
        to: filters.to || undefined,
        ageMin: filters.ageMin ? Number(filters.ageMin) : undefined,
        ageMax: filters.ageMax ? Number(filters.ageMax) : undefined,
      }),
    placeholderData: (previousData: PageResult<Student> | undefined) => previousData,
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
  });

  const rows = query.data?.content ?? EMPTY_ROWS;
  const totalPages = query.data?.totalPages ?? 0;
  const totalElements = query.data?.totalElements ?? 0;
  const loading = query.isPending && rows.length === 0;
  const fetching = query.isFetching;
  const error = query.error ? readableError(query.error, "원생 불러오기에 실패했습니다.") : null;

  // Reset to first page when filters change
  useEffect(() => { setPage(0); }, [filters.status, filters.q, filters.from, filters.to, filters.ageMin, filters.ageMax]);

  // Sync from URL params (for back/forward navigation)
  const view: ViewRow[] = useMemo(() => rows.map((r: Student, idx: number) => {
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
    const courseTitles = Array.isArray(r.courses)
      ? r.courses
          .map((course: NonNullable<Student["courses"]>[number]) => course?.title ?? null)
          .filter((title: string | null): title is string => Boolean(title && title.trim()))
      : [];
    return ({
      seq: seqDesc,
      code: r.code,
      id: r.id,
      name: r.name,
      age: ageText,
      phone: formatPhone(r.phoneNumber),
      course: courseTitles.length ? courseTitles.join(", ") : "-",
      guardian: formatPhone(r.guardianPhone),
      status: statusKr(r.status),
      joinedAt: r.joinedDate || (r.createdAt?.slice(0,10)) || "-",
    });
  }), [rows, page, size, totalElements]);

  function changePage(p: number) {
    if (p < 0 || p >= totalPages) return;
    setPage(p);
  }

  const STUDENT_TABLE_COLS = useMemo(
    () => [
      { key: "seq", width: "7%" }, // 번호
      { key: "name", width: "16%" }, // 이름
      { key: "phone", width: "12%" }, // 연락처
      { key: "age", width: "7%" }, // 나이
      { key: "courses", width: "27%" }, // 수강수업
      { key: "guardian", width: "10%" }, // 보호자 연락처
      { key: "status", width: "7%" }, // 상태
      { key: "joined", width: "14%" }, // 등록일
    ],
    [],
  );

  // no bulk/Excel features

  return (
    <TableCard>
      <CardInner>
      <TableHead>
        <div>
          <strong>원생 목록</strong>
          <Muted>
            {loading || fetching ? "불러오는 중..." : `총 ${totalElements}명의 원생이 조회되었습니다.`}
          </Muted>
          {error && <ErrText>{error}</ErrText>}
        </div>
      </TableHead>
      <Scroller>
        <StyledTable>
          <colgroup>
            {STUDENT_TABLE_COLS.map((col) => (
              <col key={col.key} style={{ width: col.width }} />
            ))}
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
            {view.map((r: ViewRow) => (
              <tr key={r.id} onClick={() => navigate(`/students/${r.id}/courses`)} data-clickable="true">
                <td>{r.seq}</td>
                <td>
                  <NameText title={r.name}>{r.name}</NameText>
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
      <Pagination
        page={page}
        totalPages={totalPages}
        onChangePage={changePage}
        size={size}
        onSizeChange={(newSize) => {
          setPage(0);
          setSize(newSize);
        }}
      />
      </CardInner>
      {/* Row-level delete dialog removed; delete is available in the edit page */}
    </TableCard>
  );
}

// Card provided by common UI
const TableHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: ${(p) => p.theme.spacing.xs};
  strong {
    font-size: ${(p) => p.theme.font.size.sm};
  }
`;
const Muted = styled.div`
  color: #6b7280;
  font-size: 12px;
  margin-top: 4px;
`;
// Buttons from common UI
// Scroller/Table from common UI
/* Row is clickable; name itself uses normal text */
const Chip = styled.span<{ type: ChipType }>`
  padding: 2px 8px; border-radius: 9999px; font-size: 12px; font-weight: 800;
  ${({ type }) => type === '수강중' ? 'background:#dcfce7; color:#16a34a;' : type === '휴학' ? 'background:#fef3c7; color:#b45309;' : 'background:#f3e8ff; color:#7c3aed;'}
`;
const ErrText = styled.div`
  color: #b91c1c; font-size: 12px; margin-top: 4px;
`;


const CardInner = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing.sm};
`;

const StyledTable = styled(Table)`
  table-layout: fixed;
  width: 100%;
  thead th {
    background: #f8fafc;
    color: #334155;
    font-weight: 800;
    text-align: center;
  }
  thead th,
  tbody td {
    vertical-align: middle;
    padding: ${(p) => p.theme.spacing.sm};
    text-align: center;
  }
  tbody td { font-size: 13.5px; color: #0f172a; }
  tbody tr[data-clickable='true'] { cursor: pointer; }
  tbody tr[data-clickable='true']:active td { background: ${({ theme }) => theme.colors.surfaceAlt}; }
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
