import { useEffect, useRef } from "react";
import styled from "styled-components";
import { SectionCard, PrimaryButton } from "@/components/common/UI";
import { EmptyPlaceholder } from "@/components/common/EmptyPlaceholder";
import { formatKoreanDate, formatTimeRangeLabel } from "@/lib/format";
import { recordPreview } from "@/features/marketing/utils";
import type { Course, CourseRecord } from "@/api/courses";

type CourseSection = {
  course: Course;
  rows: CourseRecord[];
};

type Props = {
  loading: boolean;
  hasSearched: boolean;
  courseSections: CourseSection[];
  totalRecords: number;
  from: string;
  to: string;
  recordsError: string | null;
  loadingByCourse: Record<number, boolean>;
  hasMoreByCourse: Record<number, boolean | undefined>;
  onLoadMore: (courseId: number) => void;
  results: Record<number, CourseRecord[]>;
  todayYmd: string;
  onSummarize: () => void;
  canSummarize: boolean;
};

export function MarketingResultsPanel({
  loading,
  hasSearched,
  courseSections,
  totalRecords,
  from,
  to,
  recordsError,
  loadingByCourse,
  hasMoreByCourse,
  onLoadMore,
  results,
  todayYmd,
  onSummarize,
  canSummarize,
}: Props) {
  const renderEmptyState = () => {
    if (loading) {
      return <EmptyPlaceholder title="조회 중입니다..." />;
    }
    if (!hasSearched) {
      return (
        <EmptyPlaceholder title="수업을 선택하고 기간을 설정한 후 조회해주세요." />
      );
    }
    if (!courseSections.length) {
      return (
        <EmptyPlaceholder title="선택한 수업이 없어요. 왼쪽에서 수업을 선택해주세요." />
      );
    }
    if (totalRecords === 0) {
      return (
        <EmptyPlaceholder title="선택한 기간에 해당하는 수업 기록이 없습니다." />
      );
    }
    return null;
  };

  const emptyContent = renderEmptyState();

  return (
    <ResultCard>
      <PanelHeader>
        <PanelTitle>조회 결과</PanelTitle>
        <PanelSub>선택한 수업과 기간에 해당하는 기록이 표시돼요.</PanelSub>
      </PanelHeader>

      <ResultBody>
        {emptyContent ? (
          emptyContent
        ) : (
          <ResultContent>
            <ResultMeta>
              <span>총 {totalRecords}건</span>
              {from && to ? <span>{from} ~ {to}</span> : null}
            </ResultMeta>

            <SectionStack>
              {recordsError ? <ResultError role="alert">{recordsError}</ResultError> : null}
              {courseSections.map(({ course, rows }) => (
                <ResultSection key={course.id}>
                  <ResultSectionHeader>
                    <span className="title">{course.title}</span>
                    <span className="count">{results[course.id]?.length ?? 0}건</span>
                  </ResultSectionHeader>
                  <RecordList>
                    {rows.map((record) => {
                      const recordDate = record.recordDate;
                      const timeRange = formatTimeRangeLabel(
                        record.startTime,
                        record.endTime
                      );
                      const hasTime = !timeRange.includes("--");
                      const preview = recordPreview(record);
                      const segments = preview
                        .split(/\n+/)
                        .map((line) => line.trim())
                        .filter(Boolean);
                      const summary = segments[0] ?? "(기록된 내용이 없습니다)";
                      const detailLines = segments
                        .slice(1)
                        .map((line) => line.replace(/^[-•]\s*/u, ""))
                        .filter(Boolean);

                      return (
                        <RecordItem
                          key={`${course.id}:${record.id}`}
                          data-active={isRecordInProgress(record, todayYmd) || undefined}
                        >
                          <RecordDateBadge>
                            <RecordDateText>{formatKoreanDate(recordDate)}</RecordDateText>
                            {hasTime ? <RecordTime>{timeRange}</RecordTime> : null}
                          </RecordDateBadge>
                          <RecordBody>
                            <RecordHeader>
                              {record.topic ? (
                                <RecordTopic>{record.topic}</RecordTopic>
                              ) : null}
                              {isRecordInProgress(record, todayYmd) ? (
                                <RecordStatus>진행 중</RecordStatus>
                              ) : null}
                            </RecordHeader>
                            <RecordSummary>{summary}</RecordSummary>
                            {detailLines.length ? (
                              <RecordDetails>
                                {detailLines.map((line, idx) => (
                                  <RecordDetail key={`${record.id}-${idx}`}>
                                    {line}
                                  </RecordDetail>
                                ))}
                              </RecordDetails>
                            ) : null}
                          </RecordBody>
                        </RecordItem>
                      );
                    })}
                    <Sentinel
                      onVisible={() => onLoadMore(course.id)}
                      loading={loadingByCourse[course.id]}
                      hasMore={hasMoreByCourse[course.id] ?? false}
                    />
                  </RecordList>
                </ResultSection>
              ))}
            </SectionStack>
          </ResultContent>
        )}
      </ResultBody>

      <ResultStickyActions>
        <ResultActionRow>
          <PrimaryButton type="button" onClick={onSummarize} disabled={!canSummarize}>
            AI요약
          </PrimaryButton>
        </ResultActionRow>
      </ResultStickyActions>
    </ResultCard>
  );
}

type SentinelProps = {
  onVisible: () => void;
  loading?: boolean;
  hasMore: boolean;
};

function Sentinel({ onVisible, loading, hasMore }: SentinelProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            onVisible();
            break;
          }
        }
      },
      { root: null, rootMargin: "200px 0px", threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [onVisible]);

  return (
    <SentinelWrap ref={ref}>
      {loading ? (
        <span>불러오는 중…</span>
      ) : hasMore ? (
        <span>아래로 스크롤하면 더 불러옵니다.</span>
      ) : (
        <span>마지막입니다.</span>
      )}
    </SentinelWrap>
  );
}

function isRecordInProgress(record: CourseRecord, todayYmd: string): boolean {
  if (!record.recordDate || record.recordDate !== todayYmd) return false;
  if (!record.startTime || !record.endTime) return false;

  const start = toDateTime(record.recordDate, record.startTime);
  const end = toDateTime(record.recordDate, record.endTime);
  if (!start || !end) return false;

  const now = new Date();
  return now >= start && now <= end;
}

function toDateTime(dateYmd: string, timeHm: string): Date | null {
  const [year, month, day] = dateYmd.split("-").map(Number);
  const match = timeHm.match(/(\\d{2}):(\\d{2})/);
  if (!match || !Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
    return null;
  }
  const [, hh, mm] = match;
  const date = new Date();
  date.setFullYear(year, month - 1, day);
  date.setHours(Number(hh), Number(mm), 0, 0);
  return Number.isNaN(date.getTime()) ? null : date;
}

const ResultCard = styled(SectionCard)`
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing.xl};
`;

const PanelHeader = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.xs};
`;

const PanelTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 800;
`;

const PanelSub = styled.p`
  margin: 0;
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const ResultBody = styled.div`
  flex: 1;
  min-height: 0;
  display: grid;
`;

const ResultContent = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.lg};
`;

const ResultMeta = styled.div`
  display: inline-flex;
  gap: ${(p) => p.theme.spacing.sm};
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const SectionStack = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.lg};
`;

const ResultError = styled.span`
  color: #dc2626;
  font-size: ${(p) => p.theme.font.size.sm};
`;

const ResultSection = styled.section`
  display: grid;
  gap: ${(p) => p.theme.spacing.sm};
`;

const ResultSectionHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  .title {
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};
  }
  .count {
    font-size: 12px;
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const RecordList = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.md};
`;

const RecordItem = styled.article`
  display: grid;
  gap: ${(p) => p.theme.spacing.sm};
  padding-bottom: ${(p) => p.theme.spacing.sm};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  &[data-active="true"] {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const RecordDateBadge = styled.div`
  display: inline-flex;
  gap: ${(p) => p.theme.spacing.xs};
  align-items: baseline;
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const RecordDateText = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const RecordTime = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const RecordBody = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.xs};
`;

const RecordHeader = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing.xs};
`;

const RecordTopic = styled.span`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const RecordStatus = styled.span`
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  background: #dcfce7;
  color: #047857;
`;

const RecordSummary = styled.p`
  margin: 0;
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${({ theme }) => theme.colors.text};
`;

const RecordDetails = styled.ul`
  margin: 0;
  padding-left: ${(p) => p.theme.spacing.lg};
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const RecordDetail = styled.li`
  line-height: 1.5;
`;

const ResultStickyActions = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const ResultActionRow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing.sm};
`;

const SentinelWrap = styled.div`
  display: grid;
  place-items: center;
  padding: 8px 0;
  font-size: 12px;
  color: #9ca3af;
`;
