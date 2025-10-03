import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { DashboardPanel } from "./DashboardLayout";
import { getAttendanceToday, type RecentAttendance } from "../../api/dashboard";
import { EmptyPlaceholder } from "../common/EmptyPlaceholder";

export default function DashboardAttendance() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<RecentAttendance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await getAttendanceToday();
      setRows(res.filter(r => r.present));
    } catch (e: any) {
      setError(e?.message || "출석 정보를 불러오지 못했습니다.");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    void load();
    const t = setInterval(load, 60_000); // refresh every minute
    function onRefresh() { void load(); }
    window.addEventListener('calendar:classes-refresh', onRefresh as EventListener);
    window.addEventListener('dashboard:attendance-refresh', onRefresh as EventListener);
    return () => {
      clearInterval(t);
      window.removeEventListener('calendar:classes-refresh', onRefresh as EventListener);
      window.removeEventListener('dashboard:attendance-refresh', onRefresh as EventListener);
    };
  }, [load]);

  return (
    <DashboardPanel span={6}>
      <Head>
        <div>
          <strong>출석 학생</strong>
          <Muted>{loading ? "불러오는 중..." : `${rows.length}건`}</Muted>
          {error && <Err>{error}</Err>}
        </div>
      </Head>
      <CardList>
        {rows.length === 0 && !loading && (
          <EmptyPlaceholder
            title="오늘 등록된 출석 기록이 없습니다."
            description="수업 상세에서 출석을 체크하면 이곳에서 바로 확인할 수 있어요."
            actionLabel="출석 입력하러 가기"
            onAction={() => navigate('/calendar')}
            actionVariant="outline"
          />
        )}
        {rows.map((row) => (
          <AttendanceCard key={row.id}>
            <CardTop>
              <CardMain>
                <strong>{row.studentName}</strong>
                <span className="course">
                  {row.courseTitle ? (
                    row.courseId ? (
                      <CourseLink type="button" onClick={() => navigate(`/classes/${row.courseId}`)}>
                        {row.courseTitle}
                      </CourseLink>
                    ) : (
                      row.courseTitle
                    )
                  ) : (
                    "-"
                  )}
                </span>
              </CardMain>
              <CardMeta>
                <StatusBadge>출석</StatusBadge>
                <MetaTime>{formatTime(row.createdAt)}</MetaTime>
                <SourceBadge data-type={row.source}>{sourceLabel(row.source)}</SourceBadge>
              </CardMeta>
            </CardTop>
          </AttendanceCard>
        ))}
      </CardList>
    </DashboardPanel>
  );
}

function formatTime(iso: string) {
  try {
    const d = new Date(iso);
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  } catch { return iso; }
}

function sourceLabel(source: "MOBILE" | "MANUAL") {
  return source === 'MOBILE' ? '모바일' : '수동';
}

const Head = styled.div` display:flex; align-items:center; justify-content:space-between; `;
const Muted = styled.div` color:#6b7280; font-size:12px; margin-top:4px; `;
const Err = styled.div` color:#b91c1c; font-size:12px; `;
const CardList = styled.div` display:grid; gap:8px; margin-top:8px; `;
const AttendanceCard = styled.div`
  display:flex;
  flex-direction:column;
  gap:6px;
  padding:12px 16px;
  border:1px solid #e5e7eb;
  border-radius:14px;
  background:#ffffff;
  box-shadow:0 1px 2px rgba(15,23,42,0.06);
`;
const CardTop = styled.div` display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap; `;
const CardMain = styled.div`
  display:flex;
  flex-direction:column;
  gap:2px;
  strong { font-size:15px; color:#111827; letter-spacing:-0.01em; }
  .course { font-size:13px; color:#6b7280; }
`;
const CardMeta = styled.div` display:inline-flex; align-items:center; gap:8px; flex-wrap:wrap; `;
const MetaTime = styled.span` font-size:12px; color:#6b7280; `;
const StatusBadge = styled.span`
  padding:2px 10px; border-radius:9999px; font-size:12px; font-weight:800;
  background:#dcfce7; color:#16a34a; border:1px solid #bbf7d0;
`;
const SourceBadge = styled.span`
  padding:2px 8px; border-radius:9999px; font-size:12px; font-weight:700; border:1px solid #e5e7eb; color:#374151; background:#f9fafb;
  &[data-type='MOBILE'] { background:#dcfce7; color:#16a34a; border-color:#bbf7d0; }
  &[data-type='MANUAL'] { background:#f3f4f6; color:#374151; border-color:#e5e7eb; }
`;
const CourseLink = styled.button`
  all:unset;
  cursor:pointer;
  color:#2563eb;
  font-weight:600;
  &:hover { text-decoration:underline; }
`;
