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
  courseSearch: string;
  onChangeCourseSearch: (value: string) => void;
  onResetFilters: () => void;
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
  courseSearch,
  onChangeCourseSearch,
  onResetFilters,
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
  const searchKeyword = courseSearch.trim().toLowerCase();
  const matchesSearch = (title: string | null | undefined) => {
    if (!searchKeyword) return true;
    if (!title) return false;
    return title.toLowerCase().includes(searchKeyword);
  };

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
      </Controls>

      <Card as="form" onSubmit={onSubmit}>
        <Filters>
          <Field>
            <label htmlFor="attendance-date">날짜</label>
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
        <SearchField>
          <label htmlFor="attendance-course-search">수업 이름</label>
          <SearchInput
            id="attendance-course-search"
            type="text"
            placeholder="수업명을 입력하세요."
            value={courseSearch}
            onChange={(event) => onChangeCourseSearch(event.target.value)}
          />
        </SearchField>
        <StatusField>
          <label htmlFor="attendance-status-filter">상태</label>
          <StatusSelect
            id="attendance-status-filter"
            value={statusFilter}
            onChange={(event) => onChangeStatusFilter(event.target.value as StatusFilter)}
          >
            {STATUS_FILTER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </StatusSelect>
        </StatusField>
        <ButtonRow>
          <ApplyButton type="submit">조회</ApplyButton>
          <ResetButton type="button" onClick={onResetFilters}>
            초기화
          </ResetButton>
        </ButtonRow>
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
        const searchableRows = searchKeyword
          ? filteredFlatRows.filter((row) => matchesSearch(row.courseTitle))
          : filteredFlatRows;
        const sortedFlatRows = searchableRows;
        const filteredClasses = searchKeyword
          ? day.classes.filter((cls) => matchesSearch(cls.courseTitle))
          : day.classes;

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
              filteredClasses.length > 0 ? (
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
                      {filteredClasses.map((cls, idx) => (
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
                    {sortedFlatRows.map((row) => {
                      const clickable = !!row.courseId;
                      return (
                        <AttendanceCard
                          key={row.key}
                          data-clickable={clickable || undefined}
                          onClick={() => {
                            if (clickable) {
                              onOpenCourseRecord(row.courseId ?? undefined, row.recordId);
                            }
                          }}
                          role={clickable ? "button" : undefined}
                          tabIndex={clickable ? 0 : -1}
                          onKeyDown={(event) => {
                            if (!clickable) return;
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              onOpenCourseRecord(row.courseId ?? undefined, row.recordId);
                            }
                          }}
                        >
                          <CardTop>
                            <CardMain>
                              <strong>{row.studentName}</strong>
                              <span className="course">
                                {row.courseTitle || "-"}
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
                      );
                    })}
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

const SearchField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 200px;
  label {
    font-size: 13px;
    color: #4b5563;
  }
`;

const SearchInput = styled.input`
  height: 40px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  padding: 0 12px;
  font-size: 14px;
  color: #111827;
  width: 100%;
  &::placeholder {
    color: #9ca3af;
  }
`;

const QuickButtons = styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  gap: 2px;
`;

const QuickButton = styled.button`
  ${buttonVariants.outline};
  height: 40px;
  padding: 0 14px;
  font-size: 13px;
`;

const StatusField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 200px;
  label {
    font-size: 13px;
    color: #4b5563;
  }
`;

const StatusSelect = styled.select`
  height: 40px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  padding: 0 12px;
  font-size: 14px;
  color: #111827;
  width: 100%;
`;

const ApplyButton = styled(PrimaryButton)`
  height: 40px;
  padding: 0 20px;
`;

const ButtonRow = styled.div`
  display: inline-flex;
  gap: 4px;
  align-items: center;
`;

const ResetButton = styled.button`
  ${buttonVariants.outline};
  height: 40px;
  padding: 0 16px;
  font-size: 13px;
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
  gap: ${(p) => p.theme.spacing.sm};
`;

const AttendanceCard = styled.article`
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing.sm};
  padding: ${(p) => p.theme.spacing.md};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.md};
  background: ${(p) => p.theme.colors.surface};
  box-shadow: ${(p) => p.theme.shadow.low};
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  &[data-clickable] {
    cursor: pointer;
  }
  &[data-clickable]:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(15, 23, 42, 0.12);
    border-color: ${(p) => p.theme.colors.borderStrong};
  }
  &[data-clickable]:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.25);
  }
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
  strong {
    font-size: ${(p) => p.theme.font.size.md};
    color: ${(p) => p.theme.colors.text};
    font-weight: ${(p) => p.theme.font.weight.semiBold};
    letter-spacing: -0.01em;
  }
  .course {
    font-size: ${(p) => p.theme.font.size.sm};
    color: ${(p) => p.theme.colors.textMuted};
  }
`;

const CardMeta = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing.xs};
  flex-wrap: wrap;
`;

const MetaItem = styled.span`
  font-size: ${(p) => p.theme.font.size.xs};
  color: ${(p) => p.theme.colors.textMuted};
`;

const CardFooter = styled.div`
  font-size: ${(p) => p.theme.font.size.xs};
  color: ${(p) => p.theme.colors.textMuted};
  border-top: 1px solid ${(p) => p.theme.colors.borderMuted};
  padding-top: ${(p) => p.theme.spacing.xs};
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px ${(p) => p.theme.spacing.sm};
  border-radius: 999px;
  font-size: ${(p) => p.theme.font.size.xs};
  font-weight: ${(p) => p.theme.font.weight.semiBold};
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
    background: ${(p) => p.theme.colors.warningSurface ?? "#FEF3C7"};
    color: ${(p) => p.theme.colors.warning ?? "#B45309"};
    border-color: rgba(251, 191, 36, 0.6);
  }
`;

const SourceBadge = styled.span`
  padding: 2px ${(p) => p.theme.spacing.xs};
  border-radius: 999px;
  font-size: ${(p) => p.theme.font.size.xs};
  font-weight: ${(p) => p.theme.font.weight.semiBold};
  border: 1px solid ${(p) => p.theme.colors.border};
  color: ${(p) => p.theme.colors.text};
  background: ${(p) => p.theme.colors.surfaceMuted};
  &[data-type="MOBILE"] {
    background: ${(p) => p.theme.colors.successSurface};
    color: ${(p) => p.theme.colors.success};
    border-color: rgba(34, 197, 94, 0.4);
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
