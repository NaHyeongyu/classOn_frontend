import styled from "styled-components";
import { SectionCard as Card, Scroller, TableBase as Table } from "../common/UI";
import { useEffect, useMemo, useState } from "react";
import { readableError } from "@/lib/errors";
import { useNavigate } from "react-router-dom";
import { listCourses, type Course, type PageResult } from "../../api/courses";
import { visiblePages } from "../../lib/pagination";
import { useAuth } from "@/hooks/useAuth";
import { CourseStatusBadge } from "@/components/common/CourseStatusBadge";

type Filters = { status?: "" | "IN_PROGRESS" | "STOPPED" | "PENDING"; q?: string };

type DayKey = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";

const dayOrder: Record<DayKey, number> = {
  MON: 0,
  TUE: 1,
  WED: 2,
  THU: 3,
  FRI: 4,
  SAT: 5,
  SUN: 6,
};

function hhmm(t?: string) {
  if (!t) return "";
  const [h, m] = t.split(":");
  return `${h}:${m}`;
}

function dayLabel(code: string) {
  const map: Record<string, string> = {
    MON: "월",
    TUE: "화",
    WED: "수",
    THU: "목",
    FRI: "금",
    SAT: "토",
    SUN: "일",
  };
  return map[code.toUpperCase()] || code;
}

function buildDays(r: Course) {
  if (Array.isArray(r.recurrenceDays)) {
    return r.recurrenceDays
      .slice()
      .sort(
        (a: string, b: string) =>
          (dayOrder[a as keyof typeof dayOrder] ?? 0) -
          (dayOrder[b as keyof typeof dayOrder] ?? 0)
      )
      .map((code: string) => dayLabel(code))
      .join("/");
  }
  if (typeof r.recurrenceDays === "string" && r.recurrenceDays.trim()) {
    const codes = r.recurrenceDays
      .split(",")
      .map((value: string) => value.trim().toUpperCase())
      .filter(Boolean) as DayKey[];
    codes.sort((a, b) => dayOrder[a] - dayOrder[b]);
    return codes.map((code: string) => dayLabel(code)).join("/");
  }
  if (r.schedule && r.schedule.length > 0) {
    return r.schedule
      .map((s: NonNullable<Course["schedule"]>[number]) => s.dayOfWeek)
      .filter((value: string | null | undefined): value is string => Boolean(value))
      .map((code: string) => dayLabel(code))
      .join(", ");
  }
  return "-";
}

function buildTimeRange(r: Course) {
  if (r.startTime && r.endTime) {
    return `${hhmm(r.startTime)} ~ ${hhmm(r.endTime)}`;
  }
  if (r.schedule && r.schedule.length > 0) {
    const first = r.schedule[0];
    return `${hhmm(first.startTime)} ~ ${hhmm(first.endTime)}`;
  }
  return r.courseTime || "-";
}

function courseTypeLabel(type?: Course["courseType"]) {
  switch (type) {
    case "INDIVIDUAL":
      return "개인";
    case "GROUP":
      return "단체";
    default:
      return "단체";
  }
}

export default function ClassesTable({ filters, refreshKey }: { filters: Filters; refreshKey?: number }) {
  const navigate = useNavigate();
  const { authGeneration, user } = useAuth();
  const isTeacher = (user?.role ?? "").toString().toUpperCase() === "TEACHER";
  const [rows, setRows] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => { setPage(0); }, [filters.status, filters.q, authGeneration]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setError(null); setLoading(true);
      try {
        const res: PageResult<Course> = await listCourses({
          page,
          size,
          status: filters.status || undefined,
          q: filters.q || undefined,
        });
        if (!cancelled) {
          setRows(res.content);
          setTotalPages(res.totalPages);
          setTotalElements(res.totalElements);
        }
      } catch (e) {
        if (!cancelled) setError(readableError(e, "수업 불러오기에 실패했습니다."));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => { cancelled = true; };
  }, [page, size, filters.status, filters.q, refreshKey, authGeneration]);

  const view = useMemo(() => rows.map((r, idx) => {
    const seqDesc = Math.max(0, totalElements - (page * size) - idx);
    return ({
      seq: seqDesc,
      id: r.id,
      title: r.title,
      code: r.code,
      courseType: courseTypeLabel(r.courseType),
      rawStatus: r.status,
      days: buildDays(r),
      time: buildTimeRange(r),
      enrolled: r.enrolledCount ?? '-',
      next: r.nextClassDate || '-',
    });
  }), [rows, page, size, totalElements]);

  function changePage(p: number) { if (p >= 0 && p < totalPages) setPage(p); }

  const CLASS_TABLE_COLS = useMemo(
    () => [
      { key: "seq", width: "7%" }, // 번호
      { key: "title", width: "28%" }, // 수업명
      { key: "type", width: "10%" }, // 유형
      { key: "days", width: "12%" }, // 요일
      { key: "time", width: "18%" }, // 시간
      { key: "enrolled", width: "9%" }, // 수강인원
      { key: "next", width: "10%" }, // 다음 수업
      { key: "status", width: "6%" }, // 상태
    ],
    [],
  );

  return (
    <Card>
      <CardInner>
      <Head>
        <div>
          <strong>수업 목록</strong>
          <Muted>
            {loading
              ? "불러오는 중..."
              : isTeacher
                ? `담당 수업 ${totalElements}개`
                : `총 ${totalElements}개의 수업이 조회되었습니다.`}
          </Muted>
          {error && <Err>{error}</Err>}
        </div>
      </Head>
      <Scroller>
        <StyledTable>
          <colgroup>
            {CLASS_TABLE_COLS.map((col) => (
              <col key={col.key} style={{ width: col.width }} />
            ))}
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
            {view.length === 0 ? (
              <tr>
                <td colSpan={8} className="empty">
                  {loading
                    ? "불러오는 중입니다…"
                    : isTeacher
                      ? "담당 수업이 없습니다."
                      : "조회된 수업이 없습니다."}
                </td>
              </tr>
            ) : (
              view.map((r) => (
                <tr key={r.id} onClick={() => navigate(`/classes/${r.id}`)} data-clickable="true">
                  <td>{r.seq}</td>
                  <td>
                    <TitleText>{r.title}</TitleText>
                  </td>
                  <td>{r.courseType}</td>
                  <td>{r.days}</td>
                  <td>{r.time}</td>
                  <td>{r.enrolled}</td>
                  <td>{r.next}</td>
                  <td><CourseStatusBadge status={r.rawStatus} /></td>
                </tr>
              ))
            )}
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
/* Row is clickable; title uses normal text */
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
  tbody td.empty {
    text-align: center;
    white-space: normal;
    padding: 32px 12px;
    color: #64748b;
  }
  tbody tr[data-clickable='true'] { cursor: pointer; }
  tbody tr[data-clickable='true']:active td { background: ${({ theme }) => theme.colors.surfaceAlt}; }
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
