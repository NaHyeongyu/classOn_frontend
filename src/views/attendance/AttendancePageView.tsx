import type { FormEvent } from "react";
import styled from "styled-components";
import type { AttendanceClassSummary } from "@/api/attendance";
import {
  Page as PageWrap,
  PageHeader,
  SectionCard as Card,
  TableBase,
  PrimaryButton,
  buttonVariants,
} from "@/components/common/UI";
import { EmptyPlaceholder } from "@/components/common/EmptyPlaceholder";
import { LoadingSpinner } from "@/components/common/Loading";
import {
  STATUS_FILTER_OPTIONS,
} from "@/features/attendance/constants";
import {
  filterByStatus,
  formatClock,
  labelDate,
  sourceLabel,
  statusLabel,
  timeRange,
} from "@/features/attendance/utils";
import type {
  DailyWithRows,
  StatusFilter,
  ViewMode,
} from "@/features/attendance/types";

type AttendancePageViewProps = {
  formDate: string;
  onChangeDate: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onQuickSelect: (offset: number) => void;
  loading: boolean;
  error: string | null;
  viewMode: ViewMode;
  onChangeView: (next: ViewMode) => void;
  statusFilter: StatusFilter;
  onChangeStatusFilter: (next: StatusFilter) => void;
  dailyRows: DailyWithRows[];
  onNavigateCalendar: () => void;
  onOpenCourseRecord: (
    courseId?: number | null,
    recordId?: number | null,
  ) => void;
  onOpenRecord: (entry: AttendanceClassSummary) => void;
  isTeacher?: boolean;
};

export function AttendancePageView({
  formDate,
  onChangeDate,
  onSubmit,
  onQuickSelect,
  loading,
  error,
  viewMode,
  onChangeView,
  statusFilter,
  onChangeStatusFilter,
  dailyRows,
  onNavigateCalendar,
  onOpenCourseRecord,
  onOpenRecord,
  isTeacher = false,
}: AttendancePageViewProps) {
  const heading = isTeacher ? "출결 현황" : "출결 관리";
  const description = isTeacher
    ? "담당 수업의 일자별 출결 정보를 확인하세요."
    : "날짜별로 출결 현황을 확인하고 수업 상세로 이동하세요.";

  return (
    <PageLocal>
      <PageHeader>
        <div>
          <h2>{heading}</h2>
          <p>{description}</p>
        </div>
      </PageHeader>

      <Controls>
        <ViewTabs>
          <TabButton
            type="button"
            data-active={viewMode === "daily" || undefined}
            onClick={() => onChangeView("daily")}
          >
            일자별 보기
          </TabButton>
          <TabButton
            type="button"
            data-active={viewMode === "class" || undefined}
            onClick={() => onChangeView("class")}
          >
            수업별 보기
          </TabButton>
        </ViewTabs>
        {viewMode === "daily" && (
          <StatusFilterBar>
            {STATUS_FILTER_OPTIONS.map((option) => (
              <FilterButton
                key={option.value}
                type="button"
                data-active={statusFilter === option.value || undefined}
                onClick={() => onChangeStatusFilter(option.value)}
              >
                {option.label}
              </FilterButton>
            ))}
          </StatusFilterBar>
        )}
      </Controls>

      <Card as="form" onSubmit={onSubmit}>
        <Filters>
          <Field>
            <label htmlFor="attendance-date">조회일</label>
            <input
              id="attendance-date"
              type="date"
              value={formDate}
              onChange={(ev) => onChangeDate(ev.target.value)}
            />
          </Field>
          <QuickButtons>
            <QuickButton type="button" onClick={() => onQuickSelect(0)}>
              오늘
            </QuickButton>
            <QuickButton type="button" onClick={() => onQuickSelect(-1)}>
              어제
            </QuickButton>
            <QuickButton type="button" onClick={() => onQuickSelect(-2)}>
              이틀 전
            </QuickButton>
          </QuickButtons>
          <ApplyButton type="submit">조회</ApplyButton>
        </Filters>
        {error && <ErrorText>{error}</ErrorText>}
      </Card>

      {loading && (
        <LoadingBox>
          <LoadingSpinner />
          <span>불러오는 중…</span>
        </LoadingBox>
      )}

      {!loading && dailyRows.length === 0 && (
        <Card>
          <EmptyPlaceholder
            title="선택한 날짜에 출결 기록이 없습니다."
            description="수업 상세에서 출석을 체크하면 이곳에서 바로 확인할 수 있어요."
            actionLabel="수업 일정 보기"
            onAction={onNavigateCalendar}
            actionVariant="outline"
          />
        </Card>
      )}

      {dailyRows.map(({ day, rows }) => {
        const filteredFlatRows =
          viewMode === "daily" ? filterByStatus(rows, statusFilter) : rows;
        const sortedFlatRows = filteredFlatRows;

        return (
          <Card key={day.date}>
            <DayHeader>
              <div>
                <strong>{labelDate(day.date)}</strong>
                <span>
                  {day.classCount
                    ? `${day.classCount}개의 수업`
                    : "수업 없음"}
                </span>
              </div>
              <Chips>
                <CountChip data-type="present">
                  출석 {day.presentCount}
                </CountChip>
                <CountChip data-type="absent">
                  결석 {day.absentCount}
                </CountChip>
                <CountChip data-type="unprocessed">
                  미처리 {day.unprocessedCount}
                </CountChip>
              </Chips>
            </DayHeader>

            {viewMode === "class" ? (
              day.classes.length > 0 ? (
                <TableWrapper>
                  <StyledTable>
                    <thead>
                      <tr>
                        <th>수업</th>
                        <th>시간</th>
                        <th className="num">출석</th>
                        <th className="num">결석</th>
                        <th className="num">미처리</th>
                        <th>상세</th>
                      </tr>
                    </thead>
                    <tbody>
                      {day.classes.map((cls, idx) => (
                        <tr
                          key={`${day.date}-${
                            cls.recordId ?? `${cls.courseId ?? "course"}-${idx}`
                          }`}
                        >
                          <td>
                            <TitleCell>
                              <button
                                type="button"
                                onClick={() => onOpenRecord(cls)}
                              >
                                {cls.courseTitle || "제목 없음"}
                              </button>
                              {cls.topic && <small>{cls.topic}</small>}
                            </TitleCell>
                          </td>
                          <td>{timeRange(cls.startTime, cls.endTime)}</td>
                          <td className="num">{cls.presentCount}</td>
                          <td className="num">{cls.absentCount}</td>
                          <td className="num">{cls.unprocessedCount}</td>
                          <td className="actions">
                            <ViewButton
                              type="button"
                              onClick={() => onOpenRecord(cls)}
                            >
                              상세보기
                            </ViewButton>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </StyledTable>
                </TableWrapper>
              ) : (
                <NoClassText>등록된 수업이 없습니다.</NoClassText>
              )
            ) : (
              <AttendeeSection>
                <SectionTitle>출석 학생</SectionTitle>
                {sortedFlatRows.length > 0 ? (
                  <CardList>
                    {sortedFlatRows.map((row) => (
                      <AttendanceCard key={row.key}>
                        <CardTop>
                          <CardMain>
                            <strong>{row.studentName}</strong>
                            <span className="course">
                              {row.courseTitle ? (
                                row.courseId ? (
                                  <CourseLink
                                    type="button"
                                    onClick={() =>
                                      onOpenCourseRecord(
                                        row.courseId,
                                        row.recordId,
                                      )
                                    }
                                  >
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
                            <StatusBadge data-type={row.status.toLowerCase()}>
                              {statusLabel(row.status)}
                            </StatusBadge>
                            {row.status !== "UNPROCESSED" ? (
                              <MetaItem>{formatClock(row.createdAt)}</MetaItem>
                            ) : null}
                            {row.status !== "UNPROCESSED" && (
                              <SourceBadge
                                data-type={(row.source ?? "MANUAL").toUpperCase()}
                              >
                                {sourceLabel(row.source)}
                              </SourceBadge>
                            )}
                          </CardMeta>
                        </CardTop>
                        {row.status === "UNPROCESSED" ? (
                          <CardFooter>
                            <MutedNote>
                              미처리 인원 {row.count ?? 0}명
                            </MutedNote>
                            {row.students && row.students.length > 0 && (
                              <StudentList>
                                {row.students.map((name, idx) => (
                                  <StudentChip
                                    key={`${row.key}-student-${idx}`}
                                  >
                                    {name}
                                  </StudentChip>
                                ))}
                              </StudentList>
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
                      </AttendanceCard>
                    ))}
                  </CardList>
                ) : (
                  <NoClassText>조건에 맞는 출석 기록이 없습니다.</NoClassText>
                )}
              </AttendeeSection>
            )}
          </Card>
        );
      })}
    </PageLocal>
  );
}

const Filters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  align-items: flex-end;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  label {
    font-size: 13px;
    color: #4b5563;
  }
  input[type="date"] {
    height: 40px;
    padding: 0 12px;
    border-radius: 10px;
    border: 1px solid #e5e7eb;
    background: #fff;
    color: #111827;
    font-size: 14px;
  }
`;

const QuickButtons = styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  gap: 2px;
`;

const QuickButton = styled.button`
  ${buttonVariants.outline};
  height: 36px;
  padding: 0 14px;
  font-size: 13px;
`;

const ApplyButton = styled(PrimaryButton)`
  height: 40px;
  padding: 0 20px;
`;

const ErrorText = styled.div`
  margin-top: 12px;
  color: #b91c1c;
  font-size: 13px;
`;

const LoadingBox = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #fff;
  color: #4b5563;
  font-size: 14px;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  flex-wrap: wrap;
  margin: 0 0 6px;
`;

const ViewTabs = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 2px;
`;

const TabButton = styled.button`
  ${buttonVariants.outline};
  height: 36px;
  padding: 0 18px;
  font-size: 13px;
  &[data-active] {
    background: #111827;
    color: #ffffff;
    border-color: #111827;
  }
`;

const StatusFilterBar = styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  gap: 4px;
`;

const FilterButton = styled.button`
  ${buttonVariants.outline};
  height: 32px;
  padding: 0 14px;
  font-size: 12px;
  &[data-active] {
    background: #1f2937;
    color: #fff;
    border-color: #1f2937;
  }
`;

const DayHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  strong {
    display: block;
    font-size: 18px;
    color: #111827;
  }
  span {
    display: block;
    font-size: 13px;
    color: #6b7280;
    margin-top: 4px;
  }
  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Chips = styled.div`
  display: inline-flex;
  gap: 4px;
`;

const CountChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 700;
  border: 1px solid #e5e7eb;
  &[data-type="present"] {
    background: #dcfce7;
    color: #15803d;
    border-color: #bbf7d0;
  }
  &[data-type="absent"] {
    background: #fee2e2;
    color: #b91c1c;
    border-color: #fecaca;
  }
  &[data-type="unprocessed"] {
    background: #f3f4f6;
    color: #4b5563;
    border-color: #e5e7eb;
  }
`;

const TableWrapper = styled.div`
  overflow-x: auto;
`;

const StyledTable = styled(TableBase)`
  min-width: 820px;
  thead th {
    padding: 12px 20px;
    font-size: 12px;
    color: #6b7280;
    background: #fafafa;
  }
  tbody td {
    padding: 14px 20px;
    border-bottom: 1px solid #edf2f7;
    font-size: 14px;
  }
  tbody tr:last-child td {
    border-bottom: none;
  }
  tbody td.num {
    text-align: right;
    font-feature-settings: "tnum";
  }
  tbody td.actions {
    text-align: right;
    width: 120px;
  }
  tbody tr:hover td {
    background: #f9fafb;
  }
`;

const TitleCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  button {
    all: unset;
    cursor: pointer;
    color: #1f2937;
    font-weight: 700;
    line-height: 1.2;
  }
  button:hover {
    text-decoration: underline;
  }
  small {
    color: #6b7280;
    font-size: 12px;
  }
`;

const ViewButton = styled.button`
  ${buttonVariants.subtle};
  height: 32px;
  padding: 0 14px;
  font-size: 13px;
`;

const NoClassText = styled.div`
  padding: 12px;
  border-radius: 10px;
  background: #f9fafb;
  color: #6b7280;
  font-size: 13px;
`;

const AttendeeSection = styled.div`
  margin-top: 16px;
  display: grid;
  gap: 2px;
`;

const SectionTitle = styled.h4`
  margin: 0;
  font-size: 15px;
  color: #111827;
  font-weight: 700;
`;

const CardList = styled.div`
  display: grid;
  gap: 4px;
`;

const AttendanceCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.06);
`;

const CardTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
`;

const CardMain = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  strong {
    font-size: 15px;
    color: #111827;
    letter-spacing: -0.01em;
  }
  .course {
    font-size: 13px;
    color: #6b7280;
  }
`;

const CardMeta = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
`;

const MetaItem = styled.span`
  font-size: 12px;
  color: #6b7280;
`;

const CardFooter = styled.div`
  font-size: 12px;
  color: #4b5563;
  border-top: 1px solid #f3f4f6;
  padding-top: 6px;
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 56px;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 700;
  border: 1px solid transparent;
  &[data-type="present"] {
    background: #dcfce7;
    color: #15803d;
    border-color: #bbf7d0;
  }
  &[data-type="absent"] {
    background: #fee2e2;
    color: #b91c1c;
    border-color: #fecaca;
  }
  &[data-type="unprocessed"] {
    background: #fef3c7;
    color: #b45309;
    border-color: #fcd34d;
  }
`;

const SourceBadge = styled.span`
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 700;
  border: 1px solid #e5e7eb;
  color: #374151;
  background: #f9fafb;
  &[data-type="MOBILE"] {
    background: #dcfce7;
    color: #16a34a;
    border-color: #bbf7d0;
  }
`;

const CourseLink = styled.button`
  all: unset;
  cursor: pointer;
  color: #2563eb;
  font-weight: 600;
  &:hover {
    text-decoration: underline;
  }
`;

const ReasonText = styled.div`
  font-size: 12px;
  color: #374151;
  line-height: 1.5;
`;

const MutedNote = styled.div`
  font-size: 12px;
  color: #9ca3af;
`;

const StudentList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 6px;
`;

const StudentChip = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 9999px;
  background: #f3f4f6;
  color: #374151;
  font-size: 12px;
  border: 1px solid #e5e7eb;
`;

const PageLocal = styled(PageWrap)`
  gap: 16px;
`;
