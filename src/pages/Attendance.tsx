import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getDailyAttendance, type AttendanceDailySummary, type AttendanceClassSummary } from "@/api/attendance";
import { Page as PageWrap, PageHeader, SectionCard as Card, TableBase, PrimaryButton, buttonVariants } from "@/components/common/UI";
import { EmptyPlaceholder } from "@/components/common/EmptyPlaceholder";
import { LoadingSpinner } from "@/components/common/Loading";

function formatDateInput(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function addDays(base: Date, offset: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + offset);
  return d;
}

const weekdayFormat = new Intl.DateTimeFormat("ko-KR", { month: "numeric", day: "numeric", weekday: "short" });

type ViewMode = "daily" | "class";
type StatusFilter = "ALL" | "PRESENT" | "ABSENT" | "UNPROCESSED";

type FlatRow = {
  key: string;
  studentName: string;
  courseTitle: string | null;
  courseId: number | null;
  recordId: number | null;
  status: "PRESENT" | "ABSENT" | "UNPROCESSED";
  createdAt: string | null;
  reason: string | null;
  source: "MOBILE" | "MANUAL" | null;
  count?: number;
  students?: string[];
};

const statusFilters: { value: StatusFilter; label: string }[] = [
  { value: "ALL", label: "전체" },
  { value: "PRESENT", label: "출석" },
  { value: "ABSENT", label: "결석" },
  { value: "UNPROCESSED", label: "미처리" },
];

function labelDate(ymd: string): string {
  try {
    const date = new Date(`${ymd}T00:00:00`);
    return weekdayFormat.format(date);
  } catch {
    return ymd;
  }
}

function hm(time: string | null): string {
  if (!time) return "";
  const [hh, mm] = time.split(":");
  return `${hh}:${mm}`;
}

function timeRange(start: string | null, end: string | null): string {
  const s = hm(start);
  const e = hm(end);
  if (s && e) return `${s} ~ ${e}`;
  if (s) return `${s} ~`;
  if (e) return `~ ${e}`;
  return "-";
}

function formatClock(iso: string | null): string {
  if (!iso) return "-";
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "-";
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  } catch {
    return "-";
  }
}

function statusLabel(status: FlatRow["status"]): string {
  switch (status) {
    case "PRESENT":
      return "출석";
    case "ABSENT":
      return "결석";
    case "UNPROCESSED":
    default:
      return "미처리";
  }
}

function sourceLabel(source: "MOBILE" | "MANUAL" | null): string {
  if (source === "MOBILE") return "모바일";
  if (source === "MANUAL") return "수동";
  return "-";
}

export default function Attendance() {
  const navigate = useNavigate();
  const today = useMemo(() => new Date(), []);
  const initialDate = useMemo(() => formatDateInput(today), [today]);

  const [form, setForm] = useState({ date: initialDate });
  const [filters, setFilters] = useState(form);
  const [rows, setRows] = useState<AttendanceDailySummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("daily");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  function changeView(next: ViewMode) {
    // Preserve user's current status filter across view changes
    setViewMode(next);
  }

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await getDailyAttendance({
          from: filters.date,
          to: filters.date,
        });
        if (!cancelled) {
          setRows(res.map((day) => ({ ...day, attendances: day.attendances ?? [] })));
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : "출결 정보를 불러오지 못했습니다.";
          setError(message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [filters.date]);

  function handleSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (!form.date) {
      setError("조회할 날짜를 선택해주세요.");
      return;
    }
    setError(null);
    setFilters({ date: form.date });
  }

  function goToCourseRecord(courseId?: number | null, recordId?: number | null) {
    if (courseId && recordId) {
      navigate(`/classes/${courseId}/history/${recordId}`);
    } else if (courseId) {
      navigate(`/classes/${courseId}`);
    }
  }

  function buildFlatRows(day: AttendanceDailySummary): FlatRow[] {
    const list: FlatRow[] = [];
    const attendanceRows: FlatRow[] = (day.attendances ?? [])
      .slice()
      .sort((a, b) => {
        if (!a.createdAt && !b.createdAt) return 0;
        if (!a.createdAt) return 1;
        if (!b.createdAt) return -1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      })
      .map((entry, idx): FlatRow => ({
        key: `att-${day.date}-${entry.recordId ?? 'record'}-${entry.studentId ?? 'student'}-${idx}`,
        studentName: entry.studentName || '이름 없음',
        courseTitle: entry.courseTitle,
        courseId: entry.courseId ?? null,
        recordId: entry.recordId ?? null,
        status: entry.present ? 'PRESENT' : 'ABSENT',
        createdAt: entry.createdAt ?? null,
        reason: entry.reason ?? null,
        source: entry.source ?? null,
      }));
    list.push(...attendanceRows);

    const unprocessedRows: FlatRow[] = day.classes
      .filter((cls) => cls.unprocessedCount > 0)
      .map((cls, idx): FlatRow => ({
        key: `unprocessed-${day.date}-${cls.recordId ?? 'record'}-${idx}`,
        studentName: `미처리 ${cls.unprocessedCount}명`,
        courseTitle: cls.courseTitle,
        courseId: cls.courseId ?? null,
        recordId: cls.recordId ?? null,
        status: 'UNPROCESSED',
        createdAt: null,
        reason: null,
        source: null,
        count: cls.unprocessedCount,
        students: (cls.unprocessedStudents ?? [])
          .map((u) => u?.name || null)
          .filter((name): name is string => !!name)
          .sort((a, b) => a.localeCompare(b, 'ko-KR')),
      }));
    list.push(...unprocessedRows);
    return list;
  }

  function applyQuick(offset: number) {
    const base = new Date();
    const target = addDays(base, offset);
    const date = formatDateInput(target);
    setForm({ date });
    setError(null);
    setFilters({ date });
    if (viewMode !== 'daily') {
      changeView('daily');
    }
  }

  function goToRecord(entry: AttendanceClassSummary) {
    goToCourseRecord(entry.courseId, entry.recordId ?? null);
  }

  return (
    <PageWrap>
      <PageHeader>
        <div>
          <h2>출결 관리</h2>
          <p>날짜별로 출결 현황을 확인하고 수업 상세로 이동하세요.</p>
        </div>
      </PageHeader>

      <Controls>
        <ViewTabs>
          <TabButton
            type="button"
            data-active={viewMode === "daily" || undefined}
            onClick={() => changeView("daily")}
          >
            일자별 보기
          </TabButton>
          <TabButton
            type="button"
            data-active={viewMode === "class" || undefined}
            onClick={() => changeView("class")}
          >
            수업별 보기
          </TabButton>
        </ViewTabs>
        {viewMode === "daily" && (
          <StatusFilterBar>
            {statusFilters.map((option) => (
              <FilterButton
                key={option.value}
                type="button"
                data-active={statusFilter === option.value || undefined}
                onClick={() => setStatusFilter(option.value)}
              >
                {option.label}
              </FilterButton>
            ))}
          </StatusFilterBar>
        )}
      </Controls>

      <Card as="form" onSubmit={handleSubmit}>
        <Filters>
          <Field>
            <label htmlFor="attendance-date">조회일</label>
            <input
              id="attendance-date"
              type="date"
              value={form.date}
              onChange={(ev) => {
                const value = ev.target.value;
                setForm({ date: value });
                setError(null);
              }}
            />
          </Field>
          <QuickButtons>
            <QuickButton type="button" onClick={() => applyQuick(0)}>오늘</QuickButton>
            <QuickButton type="button" onClick={() => applyQuick(-1)}>어제</QuickButton>
            <QuickButton type="button" onClick={() => applyQuick(-2)}>이틀 전</QuickButton>
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

      {!loading && rows.length === 0 && (
        <Card>
          <EmptyPlaceholder
            title="선택한 날짜에 출결 기록이 없습니다."
            description="수업 상세에서 출석을 체크하면 이곳에서 바로 확인할 수 있어요."
            actionLabel="수업 일정 보기"
            onAction={() => navigate('/calendar')}
            actionVariant="outline"
          />
        </Card>
      )}

      {rows.map((day) => {
        const flatRows = viewMode === "daily" ? buildFlatRows(day) : [];
        const filteredFlatRows = viewMode === "daily"
          ? flatRows.filter((row) => {
              switch (statusFilter) {
                case "PRESENT":
                  return row.status === "PRESENT";
                case "ABSENT":
                  return row.status === "ABSENT";
                case "UNPROCESSED":
                  return row.status === "UNPROCESSED";
                case "ALL":
                default:
                  return true;
              }
            })
          : [];

        return (
          <Card key={day.date}>
            <DayHeader>
              <div>
                <strong>{labelDate(day.date)}</strong>
                <span>{day.classCount ? `${day.classCount}개의 수업` : '수업 없음'}</span>
              </div>
              <Chips>
                <CountChip data-type="present">출석 {day.presentCount}</CountChip>
                <CountChip data-type="absent">결석 {day.absentCount}</CountChip>
                <CountChip data-type="unprocessed">미처리 {day.unprocessedCount}</CountChip>
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
                        <tr key={`${day.date}-${cls.recordId ?? `${cls.courseId ?? 'course'}-${idx}`}`}>
                          <td>
                            <TitleCell>
                              <button type="button" onClick={() => goToRecord(cls)}>{cls.courseTitle || '제목 없음'}</button>
                              {cls.topic && <small>{cls.topic}</small>}
                            </TitleCell>
                          </td>
                          <td>{timeRange(cls.startTime, cls.endTime)}</td>
                          <td className="num">{cls.presentCount}</td>
                          <td className="num">{cls.absentCount}</td>
                          <td className="num">{cls.unprocessedCount}</td>
                          <td className="actions">
                            <ViewButton type="button" onClick={() => goToRecord(cls)}>상세보기</ViewButton>
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
                {filteredFlatRows.length > 0 ? (
                  <CardList>
                    {filteredFlatRows.map((row) => (
                      <AttendanceCard key={row.key}>
                        <CardTop>
                          <CardMain>
                            <strong>{row.studentName}</strong>
                            <span className="course">
                              {row.courseTitle ? (
                                row.courseId ? (
                                  <CourseLink
                                    type="button"
                                    onClick={() => goToCourseRecord(row.courseId, row.recordId)}
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
                            <StatusBadge data-type={row.status.toLowerCase()}>{statusLabel(row.status)}</StatusBadge>
                            <MetaItem>
                              {row.status === 'UNPROCESSED' ? '미처리' : formatClock(row.createdAt)}
                            </MetaItem>
                            {row.status !== 'UNPROCESSED' && (
                              <SourceBadge data-type={(row.source ?? 'MANUAL').toUpperCase()}>
                                {sourceLabel(row.source)}
                              </SourceBadge>
                            )}
                          </CardMeta>
                        </CardTop>
                        {row.status === 'UNPROCESSED' ? (
                          <CardFooter>
                            <MutedNote>미처리 인원 {row.count ?? 0}명</MutedNote>
                            {row.students && row.students.length > 0 && (
                              <StudentList>
                                {row.students.map((name, idx) => (
                                  <StudentChip key={`${row.key}-student-${idx}`}>{name}</StudentChip>
                                ))}
                              </StudentList>
                            )}
                          </CardFooter>
                        ) : row.reason ? (
                          <CardFooter>
                            <ReasonText>{row.reason}</ReasonText>
                          </CardFooter>
                        ) : row.status === 'ABSENT' ? (
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
    </PageWrap>
  );
}

const Filters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: flex-end;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  label {
    font-size: 13px;
    color: #4b5563;
  }
  input[type='date'] {
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
  gap: 8px;
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
  gap: 10px;
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
  gap: 12px;
  flex-wrap: wrap;
  margin: 0 0 12px;
`;

const ViewTabs = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;

const TabButton = styled.button`
  ${buttonVariants.subtle};
  height: 36px;
  padding: 0 18px;
  font-size: 13px;
  &[data-active] {
    background: #4f46e5;
    color: #fff;
    border-color: #4338ca;
  }
`;

const StatusFilterBar = styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  gap: 8px;
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
  gap: 12px;
  margin-bottom: 16px;
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
  gap: 10px;
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
  &[data-type='present'] {
    background: #dcfce7;
    color: #15803d;
    border-color: #bbf7d0;
  }
  &[data-type='absent'] {
    background: #fee2e2;
    color: #b91c1c;
    border-color: #fecaca;
  }
  &[data-type='unprocessed'] {
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
    font-feature-settings: 'tnum';
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
  margin-top: 24px;
  display: grid;
  gap: 12px;
`;

const SectionTitle = styled.h4`
  margin: 0;
  font-size: 15px;
  color: #111827;
  font-weight: 700;
`;

const CardList = styled.div`
  display: grid;
  gap: 8px;
`;

const AttendanceCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
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
  gap: 12px;
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
  gap: 8px;
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
  &[data-type='present'] {
    background: #dcfce7;
    color: #15803d;
    border-color: #bbf7d0;
  }
  &[data-type='absent'] {
    background: #fee2e2;
    color: #b91c1c;
    border-color: #fecaca;
  }
  &[data-type='unprocessed'] {
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
  &[data-type='MOBILE'] {
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
