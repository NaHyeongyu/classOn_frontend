import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { DashboardPanel } from "./DashboardLayout";
import { getDailyAttendance, type AttendanceDailySummary } from "@/api/attendance";
import { EmptyPlaceholder } from "@/components/common/EmptyPlaceholder";
import { formatYMD } from "@/features/calendar/dateUtils";
import {
  buildFlatRows,
  filterByStatus,
  statusLabel,
  sourceLabel,
  formatClock,
} from "@/features/attendance/utils";
import { STATUS_FILTER_OPTIONS } from "@/features/attendance/constants";
import type { FlatRow, StatusFilter } from "@/features/attendance/types";
import { GhostButton as UIGhostButton } from "@/components/common/UI";

export default function DashboardAttendance() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState<AttendanceDailySummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const today = formatYMD(new Date());
      const res = await getDailyAttendance({ from: today, to: today });
      setSummary(res[0] ?? null);
    } catch (err) {
      setError(toErrorMessage(err, "출결 데이터를 불러오지 못했습니다."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
    const refresh: () => void = () => {
      void load();
    };
    const timer = setInterval(refresh, 60_000);
    window.addEventListener("calendar:classes-refresh", refresh);
    window.addEventListener("dashboard:attendance-refresh", refresh);
    return () => {
      clearInterval(timer);
      window.removeEventListener("calendar:classes-refresh", refresh);
      window.removeEventListener("dashboard:attendance-refresh", refresh);
    };
  }, [load]);

  const totals = useMemo(
    () => ({
      present: summary?.presentCount ?? 0,
      absent: summary?.absentCount ?? 0,
      unprocessed: summary?.unprocessedCount ?? 0,
    }),
    [summary]
  );

  const flatRows = useMemo<FlatRow[]>(
    () => (summary ? buildFlatRows(summary) : []),
    [summary]
  );
  const filteredRows = useMemo(
    () => filterByStatus(flatRows, statusFilter),
    [flatRows, statusFilter]
  );

  const showEmptySummary =
    !loading && !error && !summary && totals.present + totals.absent + totals.unprocessed === 0;
  const showEmptyFiltered =
    !loading && !error && summary != null && filteredRows.length === 0;

  return (
    <DashboardPanel span={6}>
      <Head>
        <HeadInfo>
          <Title>오늘 출결 요약</Title>
          <HeadMeta>
            <Muted>
              {loading
                ? "불러오는 중…"
                : `${summary ? summary.classCount : 0}개 수업`}
            </Muted>
            {error ? <Err>{error}</Err> : null}
          </HeadMeta>
        </HeadInfo>
        <HeadActions>
          <MoreButton type="button" onClick={() => navigate("/attendance")}>
            더보기
          </MoreButton>
        </HeadActions>
      </Head>

      <StatRow>
        <StatChip data-variant="present">출석 {totals.present}명</StatChip>
        <StatChip data-variant="absent">결석 {totals.absent}명</StatChip>
        <StatChip data-variant="none">
          미처리 {totals.unprocessed}명
        </StatChip>
      </StatRow>

      <FilterBar>
        {STATUS_FILTER_OPTIONS.map((option) => (
          <FilterButton
            key={option.value}
            type="button"
            data-active={statusFilter === option.value || undefined}
            onClick={() => setStatusFilter(option.value)}
          >
            {option.label}
          </FilterButton>
        ))}
      </FilterBar>

      {showEmptySummary && (
        <EmptyPlaceholder
          title="오늘 출결 데이터가 없습니다."
          description="출결 관리에서 수업 출석을 기록하면 이곳에서 요약으로 확인할 수 있어요."
          actionLabel="더보기"
          onAction={() => navigate("/attendance")}
          actionVariant="outline"
        />
      )}

      <StudentBlock>
        {loading && (
          <LoadingBox>
            <span role="status">불러오는 중…</span>
          </LoadingBox>
        )}
        {showEmptyFiltered && (
          <EmptyPlaceholder
            title="선택한 필터에 해당하는 출결이 없습니다."
            description="다른 상태를 선택해 확인해 보세요."
          />
        )}
        {!loading && !showEmptyFiltered && (
          <StudentList>
            {filteredRows.map((row) => (
              <StudentCard key={row.key}>
                <CardTop>
                  <CardMain>
                    <StudentName>{row.studentName ?? "이름 없음"}</StudentName>
                    <CourseName>{row.courseTitle ?? "-"}</CourseName>
                  </CardMain>
                  <CardMeta>
                    <StatusBadge data-type={row.status.toLowerCase()}>
                      {statusLabel(row.status)}
                    </StatusBadge>
                    <MetaItem>
                      {row.status === "UNPROCESSED"
                        ? "미처리"
                        : formatClock(row.createdAt)}
                    </MetaItem>
                    {row.status !== "UNPROCESSED" && (
                      <SourceBadge data-type={(row.source ?? "MANUAL").toUpperCase()}>
                        {sourceLabel(row.source)}
                      </SourceBadge>
                    )}
                  </CardMeta>
                </CardTop>
                {row.status === "UNPROCESSED" ? (
                  <CardFooter>
                    <MutedNote>미처리 인원 {row.count ?? 0}명</MutedNote>
                    {row.students && row.students.length > 0 && (
                      <StudentChipList>
                        {row.students.map((name, idx) => (
                          <StudentChip key={`${row.key}-student-${idx}`}>
                            {name}
                          </StudentChip>
                        ))}
                      </StudentChipList>
                    )}
                  </CardFooter>
                ) : row.reason ? (
                  <CardFooter>
                    <ReasonText>{row.reason}</ReasonText>
                  </CardFooter>
                ) : row.status === "ABSENT" ? (
                  <CardFooter>
                    <MutedNote>사유 없음</MutedNote>
                  </CardFooter>
                ) : null}
              </StudentCard>
            ))}
          </StudentList>
        )}
      </StudentBlock>
    </DashboardPanel>
  );
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

const HeadActions = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing.sm};
  flex-wrap: wrap;
`;

const MoreButton = styled(UIGhostButton)`
  border-color: ${(p) => p.theme.colors.primary};
  background: ${(p) => p.theme.colors.primary};
  color: #ffffff;
  &:hover {
    border-color: ${(p) => p.theme.colors.primaryHover ?? "#4338ca"};
    background: ${(p) => p.theme.colors.primaryHover ?? "#4338ca"};
  }
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

const StatRow = styled.div`
  display: inline-flex;
  gap: ${(p) => p.theme.spacing.sm};
  flex-wrap: wrap;
  margin-top: ${(p) => p.theme.spacing.sm};
`;

const StatChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing.xs};
  padding: 4px 12px;
  border-radius: 999px;
  border: 1px solid ${(p) => p.theme.colors.border};
  font-size: ${(p) => p.theme.font.size.sm};
  font-weight: ${(p) => p.theme.font.weight.semiBold};
  background: ${(p) => p.theme.colors.surface};
  &[data-variant="present"] {
    background: ${(p) => p.theme.colors.successSurface};
    color: ${(p) => p.theme.colors.success};
    border-color: rgba(34, 197, 94, 0.4);
  }
  &[data-variant="absent"] {
    background: ${(p) => p.theme.colors.dangerSurface};
    color: ${(p) => p.theme.colors.danger};
    border-color: rgba(239, 68, 68, 0.4);
  }
  &[data-variant="none"] {
    background: ${(p) => p.theme.colors.surfaceMuted};
    color: ${(p) => p.theme.colors.textMuted};
  }
`;

const FilterBar = styled.div`
  display: inline-flex;
  gap: ${(p) => p.theme.spacing.xs};
  margin: ${(p) => p.theme.spacing.sm} 0 ${(p) => p.theme.spacing.xs};
  flex-wrap: wrap;
`;

const FilterButton = styled.button<{ "data-active"?: boolean }>`
  appearance: none;
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.surface};
  color: ${(p) => p.theme.colors.text};
  border-radius: ${(p) => p.theme.radii.sm};
  padding: 6px 14px;
  font-size: ${(p) => p.theme.font.size.sm};
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease, border 0.15s ease;
  &[data-active] {
    background: #111827;
    color: #ffffff;
    border-color: #111827;
    font-weight: ${(p) => p.theme.font.weight.semiBold};
  }
`;

const StudentBlock = styled.section`
  display: grid;
  gap: ${(p) => p.theme.spacing.sm};
`;

const LoadingBox = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing.xs};
  padding: ${(p) => p.theme.spacing.sm} ${(p) => p.theme.spacing.md};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.sm};
  background: ${(p) => p.theme.colors.surface};
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${(p) => p.theme.colors.textMuted};
`;

const StudentList = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.sm};
`;

const StudentCard = styled.article`
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing.sm};
  padding: ${(p) => p.theme.spacing.md};
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
  font-size: ${(p) => p.theme.font.size.md};
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

const StatusBadge = styled.span<{ "data-type": string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px ${(p) => p.theme.spacing.sm};
  border-radius: 999px;
  font-size: ${(p) => p.theme.font.size.xs};
  font-weight: ${(p) => p.theme.font.weight.semiBold};
  background: ${(p) => p.theme.colors.surfaceMuted};
  color: ${(p) => p.theme.colors.text};
  border: 1px solid ${(p) => p.theme.colors.border};
  &[data-type="present"] {
    background: ${(p) => p.theme.colors.successSurface};
    color: ${(p) => p.theme.colors.success};
    border-color: rgba(34, 197, 94, 0.4);
  }
  &[data-type="absent"] {
    background: ${(p) => p.theme.colors.dangerSurface};
    color: ${(p) => p.theme.colors.danger};
    border-color: rgba(239, 68, 68, 0.4);
  }
  &[data-type="unprocessed"] {
    background: ${(p) => p.theme.colors.warningSurface ?? "rgba(250, 204, 21, 0.18)"};
    color: ${(p) => p.theme.colors.warning ?? "#b45309"};
  }
`;

const MetaItem = styled.span`
  color: ${(p) => p.theme.colors.textMuted};
  font-size: ${(p) => p.theme.font.size.xs};
`;

const SourceBadge = styled.span<{ "data-type": string }>`
  padding: 2px ${(p) => p.theme.spacing.sm};
  border-radius: 999px;
  font-size: ${(p) => p.theme.font.size.xs};
  font-weight: ${(p) => p.theme.font.weight.medium};
  border: 1px solid ${(p) => p.theme.colors.border};
  color: ${(p) => p.theme.colors.text};
  background: ${(p) => p.theme.colors.surfaceMuted};
  &[data-type="MOBILE"] {
    background: ${(p) => p.theme.colors.successSurface};
    color: ${(p) => p.theme.colors.success};
    border-color: rgba(34, 197, 94, 0.4);
  }
`;

const CardFooter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const MutedNote = styled.span`
  font-size: ${(p) => p.theme.font.size.xs};
  color: ${(p) => p.theme.colors.textMuted};
`;

const ReasonText = styled.p`
  margin: 0;
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${(p) => p.theme.colors.text};
  line-height: 1.5;
`;

const StudentChipList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;

const StudentChip = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: ${(p) => p.theme.font.size.xs};
  background: ${(p) => p.theme.colors.surfaceMuted};
  color: ${(p) => p.theme.colors.text};
  border: 1px solid ${(p) => p.theme.colors.borderMuted};
`;
