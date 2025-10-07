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
    setLoading(true);
    setError(null);
    try {
      const res = await getAttendanceToday();
      setRows(res.filter((r) => r.present));
    } catch (err) {
      setError(toErrorMessage(err, "출석 정보를 불러오지 못했습니다."));
    } finally {
      setLoading(false);
    }
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
        <HeadInfo>
          <Title>출석 학생</Title>
          <HeadMeta>
            <Muted>{loading ? "불러오는 중…" : `${rows.length}건`}</Muted>
            {error ? <Err>{error}</Err> : null}
          </HeadMeta>
        </HeadInfo>
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
                <StudentName>{row.studentName}</StudentName>
                <CourseName>
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
                </CourseName>
              </CardMain>
              <CardMeta>
                <StatusBadge>출석</StatusBadge>
                <MetaItem>{formatTime(row.createdAt)}</MetaItem>
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
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return iso;
    const hh = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  } catch {
    return iso;
  }
}

function sourceLabel(source: "MOBILE" | "MANUAL") {
  return source === "MOBILE" ? "모바일" : "수동";
}

function toErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string" && error.trim()) return error;
  return fallback;
}

const Head = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${(p) => p.theme.spacing.md};
  flex-wrap: wrap;
`;

const HeadInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing.xs};
`;

const Title = styled.h3`
  margin: 0;
  font-size: ${(p) => p.theme.font.size.lg};
  font-weight: ${(p) => p.theme.font.weight.semiBold};
  color: ${(p) => p.theme.colors.text};
`;

const HeadMeta = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing.xs};
`;

const Muted = styled.span`
  color: ${(p) => p.theme.colors.textMuted};
  font-size: ${(p) => p.theme.font.size.sm};
`;

const Err = styled.span`
  color: ${(p) => p.theme.colors.danger};
  font-size: ${(p) => p.theme.font.size.sm};
  font-weight: ${(p) => p.theme.font.weight.semiBold};
`;

const CardList = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.sm};
  margin-top: ${(p) => p.theme.spacing.sm};
`;

const AttendanceCard = styled.article`
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing.sm};
  padding: ${(p) => p.theme.spacing.md} ${(p) => p.theme.spacing.lg};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.md};
  background: ${(p) => p.theme.colors.surface};
  box-shadow: ${(p) => p.theme.shadow.low};
`;

const CardTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${(p) => p.theme.spacing.md};
  flex-wrap: wrap;
`;

const CardMain = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing.xs};
  min-width: 0;
`;

const StudentName = styled.strong`
  font-size: ${(p) => p.theme.font.size.lg};
  font-weight: ${(p) => p.theme.font.weight.semiBold};
  color: ${(p) => p.theme.colors.text};
  letter-spacing: -0.01em;
`;

const CourseName = styled.span`
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${(p) => p.theme.colors.textMuted};
`;

const CardMeta = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing.xs};
  flex-wrap: wrap;
`;

const MetaItem = styled.span`
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${(p) => p.theme.colors.textMuted};
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing.xs};
  padding: 4px ${(p) => p.theme.spacing.sm};
  border-radius: 9999px;
  font-size: ${(p) => p.theme.font.size.sm};
  font-weight: ${(p) => p.theme.font.weight.bold};
  background: ${(p) => p.theme.colors.successSurface};
  color: ${(p) => p.theme.colors.success};
  border: 1px solid rgba(5, 150, 105, 0.3);
`;

const SourceBadge = styled.span`
  padding: 2px ${(p) => p.theme.spacing.sm};
  border-radius: 9999px;
  font-size: ${(p) => p.theme.font.size.sm};
  font-weight: ${(p) => p.theme.font.weight.medium};
  border: 1px solid ${(p) => p.theme.colors.border};
  color: ${(p) => p.theme.colors.text};
  background: ${(p) => p.theme.colors.surfaceAlt};

  &[data-type='MOBILE'] {
    background: ${(p) => p.theme.colors.successSurface};
    color: ${(p) => p.theme.colors.success};
    border-color: rgba(5, 150, 105, 0.3);
  }
`;

const CourseLink = styled.button`
  all: unset;
  cursor: pointer;
  color: ${(p) => p.theme.colors.info};
  font-weight: ${(p) => p.theme.font.weight.semiBold};
  &:hover {
    text-decoration: underline;
  }
`;
