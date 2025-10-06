import styled from "styled-components";
import { SectionCard as Card, Scroller, TableBase as Table } from "../common/UI";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listCourses, type Course, type PageResult } from "../../api/courses";
import { visiblePages } from "../../lib/pagination";

type Filters = { status?: "" | "IN_PROGRESS" | "STOPPED" | "PENDING"; q?: string };

export default function ClassesTable({ filters, refreshKey }: { filters: Filters; refreshKey?: number }) {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => { setPage(0); }, [filters.status, filters.q]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setError(null); setLoading(true);
      try {
        const res: PageResult<Course> = await listCourses({
          page,
          size,
          status: (filters.status as any) || undefined,
          q: filters.q || undefined,
        });
        if (!cancelled) {
          setRows(res.content);
          setTotalPages(res.totalPages);
          setTotalElements(res.totalElements);
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "수업 불러오기에 실패했습니다.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => { cancelled = true; };
  }, [page, size, filters.status, filters.q, refreshKey]);

  function hhmm(t?: string) {
    if (!t) return "";
    const [h,m] = t.split(":");
    return `${h}:${m}`;
  }
  function dayLabel(code: string) {
    const map: Record<string,string> = { MON:"월", TUE:"화", WED:"수", THU:"목", FRI:"금", SAT:"토", SUN:"일" };
    return map[code.toUpperCase()] || code;
  }
  const dayOrder: Record<'MON'|'TUE'|'WED'|'THU'|'FRI'|'SAT'|'SUN', number> = { MON:0, TUE:1, WED:2, THU:3, FRI:4, SAT:5, SUN:6 };
  function buildDays(r: Course) {
    if (r.recurrenceDays) {
      const codes = r.recurrenceDays
        .split(',')
        .map((s) => s.trim().toUpperCase())
        .filter(Boolean) as (keyof typeof dayOrder)[];
      codes.sort((a,b) => dayOrder[a] - dayOrder[b]);
      return codes.map((c) => dayLabel(c)).join('/');
    }
    return '-';
  }
  function buildTimeRange(r: Course) {
    if (r.startTime && r.endTime) {
      return `${hhmm(r.startTime)} ~ ${hhmm(r.endTime)}`;
    }
    // fallback for legacy free-text courseTime
    return r.courseTime || '-';
  }
  function statusLabel(s: Course["status"]) {
    switch (s) {
      case "IN_PROGRESS": return "진행중";
      case "PENDING": return "대기";
      case "STOPPED": return "중단";
      default: return s;
    }
  }
  function courseTypeLabel(type?: Course['courseType']) {
    switch (type) {
      case 'INDIVIDUAL':
        return '개인';
      case 'GROUP':
        return '단체';
      default:
        return '단체';
    }
  }
  const view = useMemo(() => rows.map((r, idx) => {
    const seqDesc = Math.max(0, totalElements - (page * size) - idx);
    return ({
      seq: seqDesc,
      id: r.id,
      title: r.title,
      code: r.code,
      courseType: courseTypeLabel(r.courseType),
      rawStatus: r.status,
      statusText: statusLabel(r.status),
      days: buildDays(r),
      time: buildTimeRange(r),
      enrolled: r.enrolledCount ?? '-',
      next: r.nextClassDate || '-',
    });
  }), [rows, page, size, totalElements]);

  function changePage(p: number) { if (p >= 0 && p < totalPages) setPage(p); }

  return (
    <Card>
      <CardInner>
      <Head>
        <div>
          <strong>수업 목록</strong>
          <Muted>{loading ? "불러오는 중..." : `총 ${totalElements}개의 수업이 조회되었습니다.`}</Muted>
          {error && <Err>{error}</Err>}
        </div>
      </Head>
      <Scroller>
        <StyledTable>
          <colgroup>
            <col style={{ width: '7%' }} />    {/* 번호 */}
            <col style={{ width: '28%' }} />   {/* 수업명 */}
            <col style={{ width: '10%' }} />   {/* 유형 */}
            <col style={{ width: '12%' }} />   {/* 요일 */}
            <col style={{ width: '18%' }} />   {/* 시간 */}
            <col style={{ width: '9%' }} />    {/* 수강인원 */}
            <col style={{ width: '10%' }} />   {/* 다음 수업 */}
            <col style={{ width: '6%' }} />    {/* 상태 */}
          </colgroup>
          <thead>
            <tr>
              <th>번호</th>
              <th>수업명</th>
              <th>유형</th>
              <th>요일</th>
              <th>시간</th>
              <th>수강인원</th>
              <th>다음 수업</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {view.map(r => (
              <tr key={r.id}>
                <td>{r.seq}</td>
                <td>
                  <NameBtn type="button" onClick={() => navigate(`/classes/${r.id}`)} title={r.title}>
                    <TitleText>{r.title}</TitleText>
                  </NameBtn>
                </td>
                <td>{r.courseType}</td>
                <td>{r.days}</td>
                <td>{r.time}</td>
                <td>{r.enrolled}</td>
                <td>{r.next}</td>
                <td><StatusChip data-type={r.rawStatus}>{r.statusText}</StatusChip></td>
              </tr>
            ))}
          </tbody>
        </StyledTable>
      </Scroller>
      <Pager>
        <Btn onClick={() => changePage(page-1)} disabled={page===0}>이전</Btn>
        {visiblePages(page, totalPages, 7).map(p => (
          <Btn key={p} data-active={p===page} onClick={() => changePage(p)}>{p+1}</Btn>
        ))}
        <Btn onClick={() => changePage(page+1)} disabled={page>=totalPages-1}>다음</Btn>
        <PageSize>
          <span>페이지당</span>
          <select value={size} onChange={(e)=>{ setPage(0); setSize(Number(e.target.value)); }}>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </PageSize>
      </Pager>
      </CardInner>
    </Card>
  );
}

// Card provided by common UI
const Head = styled.div` display:flex; align-items:center; justify-content:flex-start; `;
const Muted = styled.div` color:#6b7280; font-size:12px; margin-top:4px; `;
const Err = styled.div` color:#b91c1c; font-size:12px; `;
// Table provided by common UI
const NameBtn = styled.button` all:unset; cursor:pointer; color:#1f2937; font-weight:800; &:hover{text-decoration:underline;} `;
const StatusChip = styled.span`
  padding: 2px 8px; border-radius: 9999px; font-size: 12px; font-weight: 800;
  &[data-type='IN_PROGRESS'] { background:#dcfce7; color:#16a34a; }
  &[data-type='PENDING'] { background:#f3e8ff; color:#7c3aed; }
  &[data-type='STOPPED'] { background:#e5e7eb; color:#374151; }
`;
const Pager = styled.div` display:flex; gap:6px; justify-content:center; padding-top:4px; `;
const Btn = styled.button<{disabled?:boolean}>`
  min-width:28px; height:28px; padding:0 8px; border-radius:8px; border:1px solid #e5e7eb; background:#fff; font-size:12px; color:#111827;
  &[data-active='true'] { background:#111827; color:#fff; border-color:#111827; }
  &:disabled { opacity:.5; cursor:not-allowed; }
`;
const PageSize = styled.div` display:inline-flex; align-items:center; gap:6px; margin-left:12px; color:#6b7280; font-size:12px; select{ height:28px; border:1px solid #e5e7eb; border-radius:8px; background:#fff; padding:0 8px; }`;
// Buttons from common UI
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
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    /* vertical separators between columns */
    border-right: 1px solid #f1f5f9;
  }
  thead th:last-child, tbody td:last-child { border-right: none; }
  tbody td { font-size: 13.5px; color: #0f172a; }
`;
const TitleText = styled.span`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  white-space: normal;
  line-height: 1.4;
  max-height: calc(1.4em * 2);
`;
