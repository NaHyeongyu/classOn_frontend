import type { AttendanceClassSummary } from "@/api/attendance";
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
import {
  AttendanceCard,
  AttendeeSection,
  AttendeeTitle,
  Card,
  CardFooter,
  CardList,
  CardMain,
  CardMeta,
  CardTop,
  Chips,
  CountChip,
  CourseLink,
  DayHeader,
  MetaItem,
  MutedNote,
  NoClassText,
  ReasonText,
  SourceBadge,
  StatusBadge,
  StudentChip,
  StudentList,
  TableWrapper,
  TitleCell,
  ViewButton,
  StyledTable,
} from "./Attendance.styles";

type AttendanceDayCardProps = {
  item: DailyWithRows;
  viewMode: ViewMode;
  statusFilter: StatusFilter;
  onOpenCourse: (courseId?: number | null, recordId?: number | null) => void;
  onOpenRecord: (summary: AttendanceClassSummary) => void;
};

export function AttendanceDayCard({
  item,
  viewMode,
  statusFilter,
  onOpenCourse,
  onOpenRecord,
}: AttendanceDayCardProps) {
  const { day, rows } = item;
  const filteredRows =
    viewMode === "daily" ? filterByStatus(rows, statusFilter) : [];

  return (
    <Card key={day.date}>
      <DayHeader>
        <div>
          <strong>{labelDate(day.date)}</strong>
          <span>
            {day.classCount ? `${day.classCount}개의 수업` : "수업 없음"}
          </span>
        </div>
        <Chips>
          <CountChip data-type="present">출석 {day.presentCount}</CountChip>
          <CountChip data-type="absent">결석 {day.absentCount}</CountChip>
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
                        <button type="button" onClick={() => onOpenRecord(cls)}>
                          {cls.courseTitle || "제목 없음"}
                        </button>
                        {cls.topic ? <small>{cls.topic}</small> : null}
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
          <AttendeeTitle>출석 학생</AttendeeTitle>
          {filteredRows.length > 0 ? (
            <CardList>
              {filteredRows.map((row) => (
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
                                onOpenCourse(row.courseId, row.recordId)
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
                      <MetaItem>
                        {row.status === "UNPROCESSED"
                          ? "미처리"
                          : formatClock(row.createdAt)}
                      </MetaItem>
                      {row.status !== "UNPROCESSED" ? (
                        <SourceBadge
                          data-type={(row.source ?? "MANUAL").toUpperCase()}
                        >
                          {sourceLabel(row.source)}
                        </SourceBadge>
                      ) : null}
                    </CardMeta>
                  </CardTop>
                  {row.status === "UNPROCESSED" ? (
                    <CardFooter>
                      <MutedNote>미처리 인원 {row.count ?? 0}명</MutedNote>
                      {row.students && row.students.length > 0 ? (
                        <StudentList>
                          {row.students.map((name, idx) => (
                            <StudentChip key={`${row.key}-student-${idx}`}>
                              {name}
                            </StudentChip>
                          ))}
                        </StudentList>
                      ) : null}
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
}
