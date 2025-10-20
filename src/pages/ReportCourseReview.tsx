import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { Page, PageHeader, SectionCard } from "@/components/common/UI";
import Modal from "@/components/common/Modal";
import {
  getCourse,
  listCourseStudents,
  listCourseRecords,
  listRecordAttendance,
  type Course,
  type CourseRecord,
  type Attendance,
} from "@/api/courses";
import { listExams, listExamResults } from "@/api/exams";
import { firstSummary } from "@/api/firstSummary";
import type { SummarizeItem } from "@/api/summarize";
import type { Student } from "@/api/students";
import { readableError } from "@/lib/errors";
import { formatKoreanDate, formatPhone } from "@/lib/format";
import { routes, paths } from "@/routes";

type DateRange = { from: string; to: string };

type LocationState = {
  course?: Course | null;
  students?: Student[];
  range?: DateRange;
  summary?: string;
  fromStudent?: {
    studentId: number;
    studentName: string;
    rangeText?: string;
  };
};

type AttendanceSeriesItem = {
  recordId: number;
  date: string;
  presentCount: number;
  absentCount: number;
};

type ExamSeriesItem = {
  examId: number;
  title: string;
  date?: string | null;
  average: number | null;
};

const RECORD_FETCH_LIMIT = 12;
const EXAM_FETCH_LIMIT = 8;

function isWithinRange(value: string | null | undefined, range: DateRange): boolean {
  if (!value) return true;
  if (range.from && value < range.from) return false;
  if (range.to && value > range.to) return false;
  return true;
}

function normalizeScore(score?: number | null, outOf?: number | null): number | null {
  if (typeof score !== "number") return null;
  if (typeof outOf === "number" && outOf > 0) {
    return (score / outOf) * 100;
  }
  return score;
}

function composeSummarizeItem(record: CourseRecord, courseTitle?: string): SummarizeItem {
  const parts = [record.topic, record.notes, record.content]
    .map((value) => (value ?? "").trim())
    .filter(Boolean);
  const content = parts.join("\n");
  return {
    date: record.recordDate,
    content,
    courseTitle,
  };
}

function composeExamSummarizeItem(
  exam: ExamSeriesItem,
  courseTitle?: string,
  fallbackDate?: string
): SummarizeItem | null {
  const date = exam.date || fallbackDate;
  if (!date) return null;
  const title = exam.title?.trim();
  const averageText =
    typeof exam.average === "number" ? `평균 ${exam.average.toFixed(1)}점` : "평균 점수 데이터 없음";
  const parts = [
    "학생 성적 요약",
    title ? `시험 \"${title}\" 결과` : "시험 결과",
    averageText,
  ];
  return {
    date,
    content: parts.join(" · "),
    courseTitle,
  };
}

function describeRange(range: DateRange): string {
  if (!range.from && !range.to) return "전체 기간";
  const from = range.from || "전체 기간 시작";
  const to = range.to || "현재";
  return `${from} ~ ${to}`;
}

function buildStudentSummarySeed(student: Student, range: DateRange): string {
  const period = describeRange(range);
  return `${student.name} 학생의 ${period} 학습 흐름을 학생 관점에서 요약합니다. 출결 변화, 참여 수업, 시험·평가 결과를 개인 맞춤으로 정리하고, 수업 리포트와 연결할 논의사항이 있다면 함께 작성하세요.`;
}

export default function ReportCourseReview() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState | null) ?? {};
  const fromStudent = state.fromStudent;

  const numericId = useMemo(() => {
    if (!courseId) return null;
    const n = Number(courseId);
    return Number.isFinite(n) ? n : null;
  }, [courseId]);

  const [course, setCourse] = useState<Course | null>(state.course ?? null);
  const [courseLoading, setCourseLoading] = useState(!state.course);
  const [courseError, setCourseError] = useState<string | null>(null);

  const [students, setStudents] = useState<Student[]>(state.students ?? []);
  const [studentsLoading, setStudentsLoading] = useState(!state.students);
  const [studentsError, setStudentsError] = useState<string | null>(null);

  const defaultRange = useMemo(() => {
    if (state.range) return state.range;
    const today = new Date();
    const to = today.toISOString().slice(0, 10);
    const start = new Date(today);
    start.setMonth(start.getMonth() - 1);
    const from = start.toISOString().slice(0, 10);
    return { from, to } satisfies DateRange;
  }, [state.range]);

  const [range, setRange] = useState<DateRange>(defaultRange);
  const defaultSummary = "최근 수업 흐름과 학생 성적 변화를 함께 정리해 학부모와 공유합니다.";
  const [summary, setSummary] = useState(state.summary ?? defaultSummary);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [summaryTouched, setSummaryTouched] = useState(Boolean(state.summary));
  const [feedback, setFeedback] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const [records, setRecords] = useState<CourseRecord[]>([]);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [recordsError, setRecordsError] = useState<string | null>(null);

  const [attendanceSeries, setAttendanceSeries] = useState<AttendanceSeriesItem[]>([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [attendanceError, setAttendanceError] = useState<string | null>(null);

  const [examSeries, setExamSeries] = useState<ExamSeriesItem[]>([]);
  const [examLoading, setExamLoading] = useState(false);
  const [examError, setExamError] = useState<string | null>(null);
  const [examAverage, setExamAverage] = useState<number | null>(null);
  const rangeText = useMemo(() => describeRange(range), [range.from, range.to]);

  useEffect(() => {
    if (!numericId) return;
    if (course) return;
    let active = true;
    (async () => {
      try {
        setCourseLoading(true);
        setCourseError(null);
        const data = await getCourse(numericId);
        if (!active) return;
        setCourse(data);
      } catch (err) {
        if (!active) return;
        setCourseError(readableError(err, "수업 정보를 불러오지 못했습니다."));
      } finally {
        if (active) setCourseLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [numericId, course]);

  useEffect(() => {
    if (!numericId) return;
    let active = true;
    (async () => {
      try {
        setStudentsLoading(true);
        setStudentsError(null);
        const items = await listCourseStudents(numericId);
        if (!active) return;
        setStudents(items ?? []);
      } catch (err) {
        if (!active) return;
        setStudents([]);
        setStudentsError(readableError(err, "학생 목록을 불러오지 못했습니다."));
      } finally {
        if (active) setStudentsLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [numericId]);

  const title = course?.title ?? (courseLoading ? "불러오는 중…" : "수업 정보를 찾을 수 없습니다.");

  const formattedRange = useMemo(() => {
    if (!range.from && !range.to) return "전체 기간";
    const fromText = range.from ? formatKoreanDate(range.from) : "시작 미지정";
    const toText = range.to ? formatKoreanDate(range.to) : "종료 미지정";
    return `${fromText} ~ ${toText}`;
  }, [range]);

  const attendanceTotals = useMemo(() => {
    const presentTotal = attendanceSeries.reduce((acc, item) => acc + item.presentCount, 0);
    const absentTotal = attendanceSeries.reduce((acc, item) => acc + item.absentCount, 0);
    const total = presentTotal + absentTotal;
    return {
      presentTotal,
      absentTotal,
      total,
      rate: total ? (presentTotal / total) * 100 : null,
    };
  }, [attendanceSeries]);

  const recentAttendance = useMemo(
    () => attendanceSeries.slice(-5),
    [attendanceSeries]
  );

  const orderedExamSeries = useMemo(
    () =>
      examSeries
        .slice()
        .sort((a, b) => (a.date || "").localeCompare(b.date || "")),
    [examSeries]
  );

  const summaryFallbackDate = useMemo(
    () => range.to || range.from || new Date().toISOString().slice(0, 10),
    [range.to, range.from]
  );

  const summaryItems = useMemo(() => {
    const recordItems = records
      .map((record) => composeSummarizeItem(record, course?.title))
      .filter((item) => item.content.trim());
    const examItems = examSeries
      .map((exam) => composeExamSummarizeItem(exam, course?.title, summaryFallbackDate))
      .filter((item): item is SummarizeItem => Boolean(item && item.content.trim()));
    const combined = [...recordItems, ...examItems];
    if (examSeries.length === 0) {
      combined.push({
        date: summaryFallbackDate,
        content: "학생 성적 요약 · 기간 내 시험 또는 평가 기록이 없어 성적 데이터를 추가할 수 없습니다.",
        courseTitle: course?.title,
      });
    } else if (examAverage != null) {
      combined.push({
        date: summaryFallbackDate,
        content: `학생 성적 요약 · 기간 전체 시험 평균은 ${examAverage.toFixed(1)}점으로 학습 성과를 확인했습니다.`,
        courseTitle: course?.title,
      });
    } else {
      combined.push({
        date: summaryFallbackDate,
        content: "학생 성적 요약 · 시험 결과는 있으나 평균 점수 데이터를 집계하지 못했습니다.",
        courseTitle: course?.title,
      });
    }
    return combined;
  }, [records, examSeries, examAverage, course?.title, summaryFallbackDate]);

  useEffect(() => {
    if (!summaryItems.length) {
      if (!summaryTouched) setSummary(defaultSummary);
      return;
    }
    if (summaryTouched) return;
    let cancelled = false;
    (async () => {
      try {
        setSummaryLoading(true);
        setSummaryError(null);
        const items = summaryItems.filter((item) => item.content.trim());
        if (!items.length) {
          setSummary(defaultSummary);
          return;
        }
        const resp = await firstSummary(items, { language: "ko", speechStyle: "SEUMNIDA" });
        if (cancelled) return;
        const generated = resp.summary?.trim() || resp.bullets?.join("\n").trim();
        setSummary(generated || defaultSummary);
      } catch (err) {
        if (!cancelled) {
          setSummaryError(readableError(err, "수업 요약을 생성하지 못했습니다."));
          setSummary(defaultSummary);
        }
      } finally {
        if (!cancelled) setSummaryLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [summaryItems, summaryTouched, defaultSummary]);

  useEffect(() => {
    if (!numericId) {
      setRecords([]);
      return;
    }
    let active = true;
    (async () => {
      try {
        setRecordsLoading(true);
        setRecordsError(null);
        const params =
          range.from || range.to
            ? { from: range.from || undefined, to: range.to || undefined }
            : undefined;
        const data = await listCourseRecords(numericId, params);
        if (!active) return;
        setRecords((data ?? []).slice(0, RECORD_FETCH_LIMIT));
      } catch (err) {
        if (!active) return;
        setRecords([]);
        setRecordsError(readableError(err, "수업 기록을 불러오지 못했습니다."));
      } finally {
        if (active) setRecordsLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [numericId, range.from, range.to]);

  useEffect(() => {
    if (!numericId) {
      setAttendanceSeries([]);
      return;
    }
    if (!records.length) {
      setAttendanceSeries([]);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        setAttendanceLoading(true);
        setAttendanceError(null);
        const items: AttendanceSeriesItem[] = [];
        for (const record of records.slice(0, RECORD_FETCH_LIMIT)) {
          if (!record?.id) continue;
          try {
            const att = await listRecordAttendance(numericId, record.id);
            if (cancelled) return;
            const presentCount = att.filter((entry) => entry.present).length;
            const absentCount = att.length - presentCount;
            items.push({
              recordId: record.id,
              date: record.recordDate,
              presentCount,
              absentCount,
            });
          } catch (err) {
            if (!cancelled) {
              setAttendanceError((prev) => prev ?? readableError(err, "출결 정보를 불러오지 못했습니다."));
            }
          }
        }
        if (!cancelled) setAttendanceSeries(items);
      } finally {
        if (!cancelled) setAttendanceLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [numericId, records]);

  useEffect(() => {
    if (!numericId) {
      setExamSeries([]);
      setExamAverage(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        setExamLoading(true);
        setExamError(null);
        const exams = await listExams(numericId);
        if (cancelled) return;
        const filtered = (exams ?? []).filter((exam) =>
          isWithinRange(exam.examDate ?? null, range)
        );
        const sorted = filtered
          .slice()
          .sort((a, b) => (a.examDate || "").localeCompare(b.examDate || ""));
        const limited = sorted.slice(-EXAM_FETCH_LIMIT);
        const series: ExamSeriesItem[] = [];
        let total = 0;
        let count = 0;
        for (const exam of limited) {
          let average =
            typeof exam.averageScore === "number" ? exam.averageScore : null;
          if (average == null) {
            try {
              const results = await listExamResults(numericId, exam.id);
              if (cancelled) return;
              const values = (results ?? [])
                .map((result) => normalizeScore(result.score, result.outOf))
                .filter((value): value is number => Number.isFinite(value));
              if (values.length) {
                average =
                  values.reduce((acc, value) => acc + value, 0) / values.length;
              }
            } catch (err) {
              if (!cancelled) {
                setExamError((prev) => prev ?? readableError(err, "시험 데이터를 불러오지 못했습니다."));
              }
            }
          }
          const normalized =
            typeof average === "number"
              ? Math.round(Math.max(0, Math.min(100, average)) * 10) / 10
              : null;
          series.push({
            examId: exam.id,
            title: exam.title,
            date: exam.examDate,
            average: normalized,
          });
          if (normalized != null) {
            total += normalized;
            count += 1;
          }
        }
        if (!cancelled) {
          setExamSeries(series);
          setExamAverage(count ? total / count : null);
        }
      } finally {
        if (!cancelled) setExamLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [numericId, range]);

  return (
    <Page>
      <PageHeader>
        <div>
          <h2>{title}</h2>
          <p>자동 생성된 수업 리포트를 검토하고 내용을 수정하세요.</p>
        </div>
        <HeaderActions>
          <GhostButton type="button" onClick={() => navigate(paths.report.courseDetail(courseId ?? ""))}>
            이전
          </GhostButton>
          <PrimaryButton type="button" onClick={() => navigate(routes.report)}>
            리포트 홈
          </PrimaryButton>
        </HeaderActions>
      </PageHeader>

      {fromStudent ? (
        <InlineHint>
          {`${fromStudent.studentName} 학생 리포트에서 이동했습니다. ${fromStudent.rangeText ?? rangeText} 기준으로 수업 전체 흐름을 검토한 뒤 학생별 리포트로 다시 이동할 수 있습니다.`}
        </InlineHint>
      ) : null}

      {courseError ? <InlineError>{courseError}</InlineError> : null}

      <SectionCard data-animated="true">
        <PanelHeader>
          <div>
            <PanelTitle>수업 요약</PanelTitle>
            <PanelSubtitle>AI가 제안한 요약을 검토하고 원하는 내용으로 수정하세요.</PanelSubtitle>
          </div>
          <SummaryActions>
            <GhostButton
              type="button"
              onClick={() => {
                setSummaryTouched(false);
                setSummary(defaultSummary);
              }}
              disabled={summaryLoading}
            >
              {summaryLoading ? "생성 중…" : "자동 생성"}
            </GhostButton>
          </SummaryActions>
        </PanelHeader>
        {summaryError ? <InlineError>{summaryError}</InlineError> : null}
        <SummaryTextarea
          value={summary}
          onChange={(event) => {
            setSummary(event.currentTarget.value);
            setSummaryTouched(true);
            setSummaryError(null);
          }}
          placeholder="수업 요약을 입력하세요."
          rows={6}
          aria-label="course-summary"
        />
        {summaryLoading ? <InlineHint>수업 요약을 생성 중입니다…</InlineHint> : null}
      </SectionCard>

      <SectionCard data-animated="true">
        <PanelHeader>
          <div>
            <PanelTitle>학생 리스트</PanelTitle>
            <PanelSubtitle>
              리포트에 포함될 학생들입니다. 학생별 리포트가 필요하면 아래 카드에서 바로 이동하세요.
            </PanelSubtitle>
          </div>
          <PanelMeta>{studentsLoading ? "불러오는 중…" : `${students.length}명`}</PanelMeta>
        </PanelHeader>
        {studentsError ? <InlineError>{studentsError}</InlineError> : null}
        {!studentsError && !studentsLoading && students.length === 0 ? (
          <InlineHint>등록된 학생이 없습니다.</InlineHint>
        ) : null}
        {students.length > 0 ? (
          <StudentGrid>
            {students.map((student) => (
              <StudentCard key={student.id}>
                <StudentCardHead>
                  <StudentCardInfo>
                    <StudentName>{student.name}</StudentName>
                    <StudentContact>{formatPhone(student.phoneNumber)}</StudentContact>
                  </StudentCardInfo>
                  <Badge data-tone={student.status.toLowerCase()}>
                    {student.status === "ENROLLED"
                      ? "수강중"
                      : student.status === "ON_LEAVE"
                      ? "휴학"
                      : "대기"}
                  </Badge>
                </StudentCardHead>
                <StudentActions>
                  <StudentActionButton
                    type="button"
                    onClick={() =>
                      navigate(paths.report.studentReview(student.id), {
                        state: {
                          student,
                          range: { ...range },
                          summary: buildStudentSummarySeed(student, range),
                          fromCourse: {
                            courseId: numericId ?? undefined,
                            courseTitle: course?.title,
                            rangeText,
                          },
                        },
                      })
                    }
                  >
                    학생 리포트 이동
                  </StudentActionButton>
                </StudentActions>
              </StudentCard>
            ))}
          </StudentGrid>
        ) : null}
      </SectionCard>

      <SectionCard data-animated="true">
        <PanelHeader>
          <div>
            <PanelTitle>기간 설정</PanelTitle>
            <PanelSubtitle>필요 시 기간을 재조정할 수 있습니다.</PanelSubtitle>
          </div>
        </PanelHeader>
        <DateGrid>
          <FieldBlock>
            <FieldLabel htmlFor="review-course-from">시작일</FieldLabel>
            <DateInput
              id="review-course-from"
              type="date"
              value={range.from}
              max={range.to || undefined}
              onChange={(event) => setRange({ ...range, from: event.currentTarget.value })}
            />
          </FieldBlock>
          <FieldBlock>
            <FieldLabel htmlFor="review-course-to">종료일</FieldLabel>
            <DateInput
              id="review-course-to"
              type="date"
              value={range.to}
              min={range.from || undefined}
              onChange={(event) => setRange({ ...range, to: event.currentTarget.value })}
            />
          </FieldBlock>
        </DateGrid>
        <InlineHint>기간을 비워두면 전체 수업 기록이 포함됩니다.</InlineHint>
      </SectionCard>

      <SectionCard data-animated="true">
        <PanelHeader>
          <div>
            <PanelTitle>리포트 미리보기</PanelTitle>
            <PanelSubtitle>AI가 정리한 데이터를 기반으로 리포트를 확인하세요.</PanelSubtitle>
          </div>
        </PanelHeader>
        <PreviewLayout>
          <PreviewColumn>
            <PreviewBlock>
              <BlockTitle>출결 현황</BlockTitle>
              {recordsLoading || attendanceLoading ? (
                <InlineHint>출결 데이터를 불러오는 중입니다…</InlineHint>
              ) : null}
              {attendanceError ? <InlineError>{attendanceError}</InlineError> : null}
              {recordsError ? <InlineError>{recordsError}</InlineError> : null}
              {attendanceTotals.total ? (
                <AttendanceSummary>
                  <AttendanceBar>
                    <AttendanceBarFill style={{ width: `${attendanceTotals.rate ?? 0}%` }} />
                  </AttendanceBar>
                  <AttendanceMeta>
                    <span>출석 {attendanceTotals.presentTotal}회</span>
                    <span>결석 {attendanceTotals.absentTotal}회</span>
                  </AttendanceMeta>
                </AttendanceSummary>
              ) : (
                <InlineHint>기간 내 출결 기록이 없습니다.</InlineHint>
              )}
              {recentAttendance.length ? (
                <AttendanceList>
                  {recentAttendance.map((item) => (
                    <li key={item.recordId}>
                      <span>{formatKoreanDate(item.date, { includeWeekday: false })}</span>
                      <AttendanceCounts>
                        <AttendanceBadge data-tone="present">출석 {item.presentCount}</AttendanceBadge>
                        <AttendanceBadge data-tone="absent">결석 {item.absentCount}</AttendanceBadge>
                      </AttendanceCounts>
                    </li>
                  ))}
                </AttendanceList>
              ) : null}
            </PreviewBlock>
            <PreviewBlock>
              <BlockTitle>수업 요약</BlockTitle>
              <SummaryPreview>{summary || "요약 내용이 없습니다."}</SummaryPreview>
            </PreviewBlock>
          </PreviewColumn>
          <PreviewColumn>
            <PreviewBlock>
              <BlockTitle>시험 기록</BlockTitle>
              {examLoading ? <InlineHint>시험 데이터를 불러오는 중입니다…</InlineHint> : null}
              {examError ? <InlineError>{examError}</InlineError> : null}
              {orderedExamSeries.length ? (
                <ExamList>
                  {orderedExamSeries.map((exam) => (
                    <li key={exam.examId}>
                      <ExamRow>
                        <ExamLabel>
                          <span>{exam.title}</span>
                          <small>
                            {exam.date
                              ? formatKoreanDate(exam.date, { includeWeekday: false })
                              : "일정 미정"}
                          </small>
                        </ExamLabel>
                        <BarTrack>
                          <BarFill style={{ width: `${Math.min(100, Math.max(0, exam.average ?? 0))}%` }} />
                        </BarTrack>
                        <ExamValue>
                          {exam.average != null ? `${exam.average.toFixed(1)}점` : "데이터 없음"}
                        </ExamValue>
                      </ExamRow>
                    </li>
                  ))}
                </ExamList>
              ) : (
                <InlineHint>표시할 시험 데이터가 없습니다.</InlineHint>
              )}
              {examAverage != null ? (
                <ExamAverage>기간 평균 점수 {examAverage.toFixed(1)}점</ExamAverage>
              ) : null}
            </PreviewBlock>
            <PreviewBlock>
              <BlockTitle>피드백 메모</BlockTitle>
              <PlaceholderTextarea
                placeholder="작성할 피드백 메모를 여기에 정리하세요."
                value={feedback}
                onChange={(event) => setFeedback(event.currentTarget.value)}
              />
            </PreviewBlock>
          </PreviewColumn>
        </PreviewLayout>
        <PreviewActions>
          <GhostButton type="button" onClick={() => setFeedback("")} disabled={!feedback}>
            피드백 초기화
          </GhostButton>
          <PrimaryButton type="button" onClick={() => setModalOpen(true)}>
            보고서 보기
          </PrimaryButton>
        </PreviewActions>
      </SectionCard>

      <ReportPreviewModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={course?.title ?? "수업 리포트"}
        period={formattedRange}
        students={students}
        summary={summary}
        feedback={feedback}
        attendance={attendanceSeries}
        attendanceRate={attendanceTotals.rate}
        examSeries={orderedExamSeries}
        examAverage={examAverage}
        onChangeFeedback={setFeedback}
      />
    </Page>
  );
}

type ReportPreviewModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  period: string;
  students: Student[];
  summary: string;
  feedback: string;
  attendance: AttendanceSeriesItem[];
  attendanceRate: number | null;
  examSeries: ExamSeriesItem[];
  examAverage: number | null;
  onChangeFeedback: (value: string) => void;
};

function ReportPreviewModal({
  open,
  onClose,
  title,
  period,
  students,
  summary,
  feedback,
  attendance,
  attendanceRate,
  examSeries,
  examAverage,
  onChangeFeedback,
}: ReportPreviewModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="수업 리포트 미리보기"
      maxWidth={720}
      footer={
        <>
          <GhostButton type="button" onClick={onClose}>
            닫기
          </GhostButton>
          <PrimaryButton type="button" disabled>
            내보내기 (준비중)
          </PrimaryButton>
        </>
      }
    >
      <ModalSection>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <ModalMeta>{period}</ModalMeta>
        </ModalHeader>
        <ModalContent>
          <ModalBlock>
            <strong>수업 내용 요약</strong>
            <p>{summary || "요약 내용이 없습니다."}</p>
          </ModalBlock>
          <ModalBlock>
            <strong>학생 리스트</strong>
            {students.length === 0 ? (
              <p>등록된 학생이 없습니다.</p>
            ) : (
              <ModalStudentList>
                {students.map((student) => (
                  <li key={student.id}>
                    <span>{student.name}</span>
                    <small>
                      {formatPhone(student.phoneNumber)} ·{" "}
                      {student.status === "ENROLLED"
                        ? "수강중"
                        : student.status === "ON_LEAVE"
                        ? "휴학"
                        : "대기"}
                    </small>
                  </li>
                ))}
              </ModalStudentList>
            )}
          </ModalBlock>
          <ModalBlock>
            <strong>출결 기록</strong>
            {attendance.length ? (
              <>
                <ModalAttendanceSummary>
                  <ModalAttendanceBar>
                    <ModalAttendanceFill style={{ width: `${attendanceRate ?? 0}%` }} />
                  </ModalAttendanceBar>
                  <ModalAttendanceMeta>
                    <span>출석 {attendance.reduce((acc, item) => acc + item.presentCount, 0)}회</span>
                    <span>결석 {attendance.reduce((acc, item) => acc + item.absentCount, 0)}회</span>
                  </ModalAttendanceMeta>
                </ModalAttendanceSummary>
                <ModalAttendanceList>
                  {attendance.map((item) => (
                    <li key={item.recordId}>
                      <span>{formatKoreanDate(item.date, { includeWeekday: false })}</span>
                      <ModalAttendanceCounts>
                        <AttendanceBadge data-tone="present">출석 {item.presentCount}</AttendanceBadge>
                        <AttendanceBadge data-tone="absent">결석 {item.absentCount}</AttendanceBadge>
                      </ModalAttendanceCounts>
                    </li>
                  ))}
                </ModalAttendanceList>
              </>
            ) : (
              <ModalPlaceholder>기간 내 출결 기록이 없습니다.</ModalPlaceholder>
            )}
          </ModalBlock>
          <ModalBlock>
            <strong>시험 기록</strong>
            {examSeries.length ? (
              <>
                <ModalExamList>
                  {examSeries.map((exam) => (
                    <li key={exam.examId}>
                      <ModalExamRow>
                        <ModalExamLabel>
                          <span>{exam.title}</span>
                          <small>
                            {exam.date
                              ? formatKoreanDate(exam.date, { includeWeekday: false })
                              : "일정 미정"}
                          </small>
                        </ModalExamLabel>
                        <ModalBarTrack>
                          <ModalBarFill style={{ width: `${Math.min(100, Math.max(0, exam.average ?? 0))}%` }} />
                        </ModalBarTrack>
                        <ModalExamValue>
                          {exam.average != null ? `${exam.average.toFixed(1)}점` : "데이터 없음"}
                        </ModalExamValue>
                      </ModalExamRow>
                    </li>
                  ))}
                </ModalExamList>
                {examAverage != null ? (
                  <ModalExamAverage>기간 평균 점수 {examAverage.toFixed(1)}점</ModalExamAverage>
                ) : null}
              </>
            ) : (
              <ModalPlaceholder>기간 내 시험 기록이 없습니다.</ModalPlaceholder>
            )}
          </ModalBlock>
          <ModalBlock>
            <strong>피드백</strong>
            <FeedbackTextarea
              placeholder="리포트에 포함할 피드백을 입력하세요."
              value={feedback}
              onChange={(event) => onChangeFeedback(event.currentTarget.value)}
              rows={4}
            />
          </ModalBlock>
        </ModalContent>
      </ModalSection>
    </Modal>
  );
}

const HeaderActions = styled.div`
  display: inline-flex;
  gap: ${(p) => p.theme.spacing.sm};
  flex-wrap: wrap;
  justify-content: flex-end;
`;

const PrimaryButton = styled.button`
  height: 40px;
  padding: 0 ${(p) => p.theme.spacing.lg};
  border-radius: ${(p) => p.theme.radii.md};
  border: 1px solid transparent;
  background: ${(p) => p.theme.colors.primary};
  color: ${(p) => p.theme.colors.textInverted};
  font-size: ${(p) => p.theme.font.size.sm};
  font-weight: ${(p) => p.theme.font.weight.semiBold};
  cursor: pointer;
  &:hover:not(:disabled) {
    background: ${(p) => p.theme.colors.primaryHover};
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const GhostButton = styled.button`
  height: 40px;
  padding: 0 ${(p) => p.theme.spacing.md};
  border-radius: ${(p) => p.theme.radii.md};
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.surface};
  font-size: ${(p) => p.theme.font.size.sm};
  font-weight: ${(p) => p.theme.font.weight.semiBold};
  cursor: pointer;
  &:hover {
    border-color: ${(p) => p.theme.colors.borderStrong};
  }
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${(p) => p.theme.spacing.md};
  margin-bottom: ${(p) => p.theme.spacing.md};
`;

const PanelTitle = styled.h3`
  margin: 0;
  font-size: ${(p) => p.theme.font.size.xl};
  font-weight: ${(p) => p.theme.font.weight.bold};
  color: ${(p) => p.theme.colors.text};
`;

const PanelSubtitle = styled.p`
  margin: ${(p) => p.theme.spacing.xs} 0 0;
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${(p) => p.theme.colors.textMuted};
`;

const PanelMeta = styled.span`
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${(p) => p.theme.colors.textMuted};
`;

const InlineHint = styled.p`
  margin: ${(p) => p.theme.spacing.xs} 0 ${(p) => p.theme.spacing.sm};
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${(p) => p.theme.colors.textMuted};
`;

const InlineError = styled.p`
  margin: ${(p) => p.theme.spacing.xs} 0 ${(p) => p.theme.spacing.sm};
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${(p) => p.theme.colors.danger};
`;

const SummaryTextarea = styled.textarea`
  width: 100%;
  border: 1px solid ${(p) => p.theme.colors.borderStrong};
  border-radius: ${(p) => p.theme.radii.md};
  padding: ${(p) => p.theme.spacing.md};
  font-size: ${(p) => p.theme.font.size.sm};
  line-height: ${(p) => p.theme.font.lineHeight.relaxed};
  resize: vertical;
  min-height: 140px;
  transition:
    border-color ${(p) => p.theme.motion.duration.base} ${(p) => p.theme.motion.easing.standard},
    box-shadow ${(p) => p.theme.motion.duration.base} ${(p) => p.theme.motion.easing.standard};
  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.primary};
    box-shadow: ${(p) => p.theme.shadow.focusPrimary};
  }
`;

const SummaryActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: ${(p) => p.theme.spacing.xs};
`;

const StudentGrid = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.sm};
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
`;

const StudentCard = styled.div`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.md};
  padding: ${(p) => p.theme.spacing.md};
  display: grid;
  gap: ${(p) => p.theme.spacing.sm};
  background: ${(p) => p.theme.colors.surface};
`;

const StudentCardHead = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${(p) => p.theme.spacing.sm};
`;

const StudentCardInfo = styled.div`
  display: grid;
  gap: 4px;
`;

const StudentName = styled.strong`
  font-size: ${(p) => p.theme.font.size.md};
  color: ${(p) => p.theme.colors.text};
  font-weight: ${(p) => p.theme.font.weight.semiBold};
`;

const StudentContact = styled.span`
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${(p) => p.theme.colors.textMuted};
`;

const StudentActions = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const StudentActionButton = styled.button`
  border: 1px solid ${(p) => p.theme.colors.borderStrong};
  border-radius: ${(p) => p.theme.radii.sm};
  background: ${(p) => p.theme.colors.surfaceAlt};
  color: ${(p) => p.theme.colors.text};
  font-size: ${(p) => p.theme.font.size.xs};
  font-weight: ${(p) => p.theme.font.weight.semiBold};
  padding: 6px ${(p) => p.theme.spacing.sm};
  cursor: pointer;
  &:hover:not(:disabled) {
    border-color: ${(p) => p.theme.colors.primary};
    color: ${(p) => p.theme.colors.primary};
  }
`;

const Badge = styled.span<{ "data-tone"?: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 10px;
  border-radius: ${(p) => p.theme.radii.sm};
  font-size: ${(p) => p.theme.font.size.xs};
  font-weight: ${(p) => p.theme.font.weight.semiBold};
  background: ${(p) => p.theme.colors.surfaceAlt};
  color: ${(p) => p.theme.colors.text};
  &[data-tone='enrolled'] {
    color: ${(p) => p.theme.colors.success};
    background: ${(p) => p.theme.colors.successSurface};
  }
  &[data-tone='on_leave'] {
    color: ${(p) => p.theme.colors.warning};
    background: ${(p) => p.theme.colors.warningSurface};
  }
  &[data-tone='pending'] {
    color: ${(p) => p.theme.colors.info};
    background: ${(p) => p.theme.colors.infoSurface};
  }
`;

const DateGrid = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.sm};
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
`;

const FieldBlock = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.xs};
`;

const FieldLabel = styled.label`
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${(p) => p.theme.colors.textMuted};
`;

const DateInput = styled.input`
  height: 40px;
  border: 1px solid ${(p) => p.theme.colors.borderStrong};
  border-radius: ${(p) => p.theme.radii.md};
  padding: 0 ${(p) => p.theme.spacing.sm};
  font-size: ${(p) => p.theme.font.size.md};
  color: ${(p) => p.theme.colors.text};
  transition:
    border-color ${(p) => p.theme.motion.duration.base} ${(p) => p.theme.motion.easing.standard},
    box-shadow ${(p) => p.theme.motion.duration.base} ${(p) => p.theme.motion.easing.standard};
  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.primary};
    box-shadow: ${(p) => p.theme.shadow.focusPrimary};
  }
`;

const PreviewLayout = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.lg};
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
`;

const PreviewColumn = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.md};
`;

const PreviewBlock = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.xs};
`;

const BlockTitle = styled.span`
  font-size: ${(p) => p.theme.font.size.sm};
  font-weight: ${(p) => p.theme.font.weight.semiBold};
  color: ${(p) => p.theme.colors.text};
`;

const PlaceholderTextarea = styled.textarea`
  width: 100%;
  min-height: 160px;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.md};
  padding: ${(p) => p.theme.spacing.sm};
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${(p) => p.theme.colors.text};
  resize: vertical;
  background: ${(p) => p.theme.colors.surfaceAlt};
`;

const PreviewActions = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: ${(p) => p.theme.spacing.sm};
  margin-top: ${(p) => p.theme.spacing.lg};
`;

const ModalSection = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.md};
`;

const ModalHeader = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.xs};
`;

const ModalTitle = styled.h4`
  margin: 0;
  font-size: ${(p) => p.theme.font.size.lg};
  font-weight: ${(p) => p.theme.font.weight.bold};
  color: ${(p) => p.theme.colors.text};
`;

const ModalMeta = styled.span`
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${(p) => p.theme.colors.textMuted};
`;

const ModalContent = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.md};
  max-height: 60vh;
  overflow-y: auto;
`;

const ModalBlock = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.xs};
  strong {
    font-size: ${(p) => p.theme.font.size.sm};
    color: ${(p) => p.theme.colors.text};
  }
  p, ul {
    margin: 0;
    font-size: ${(p) => p.theme.font.size.sm};
    color: ${(p) => p.theme.colors.textMuted};
  }
  ul {
    padding-left: ${(p) => p.theme.spacing.md};
    list-style: disc;
  }
`;

const ModalPlaceholder = styled.div`
  border: 1px dashed ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.md};
  padding: ${(p) => p.theme.spacing.md};
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${(p) => p.theme.colors.textMuted};
  background: ${(p) => p.theme.colors.surfaceAlt};
`;

const FeedbackTextarea = styled.textarea`
  width: 100%;
  border: 1px solid ${(p) => p.theme.colors.borderStrong};
  border-radius: ${(p) => p.theme.radii.md};
  padding: ${(p) => p.theme.spacing.sm};
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${(p) => p.theme.colors.text};
  resize: vertical;
  transition:
    border-color ${(p) => p.theme.motion.duration.base} ${(p) => p.theme.motion.easing.standard},
    box-shadow ${(p) => p.theme.motion.duration.base} ${(p) => p.theme.motion.easing.standard};
  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.primary};
    box-shadow: ${(p) => p.theme.shadow.focusPrimary};
  }
`;

const SummaryPreview = styled.p`
  margin: 0;
  padding: ${(p) => p.theme.spacing.sm};
  border-radius: ${(p) => p.theme.radii.md};
  background: ${(p) => p.theme.colors.surfaceAlt};
  color: ${(p) => p.theme.colors.text};
  font-size: ${(p) => p.theme.font.size.sm};
  line-height: ${(p) => p.theme.font.lineHeight.relaxed};
  white-space: pre-line;
`;

const AttendanceSummary = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.xs};
`;

const AttendanceBar = styled.div`
  height: 10px;
  border-radius: 999px;
  background: ${(p) => p.theme.colors.surfaceAlt};
  overflow: hidden;
`;

const AttendanceBarFill = styled.div`
  height: 100%;
  background: ${(p) => p.theme.colors.success};
  transition: width 160ms ease-out;
`;

const AttendanceMeta = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${(p) => p.theme.colors.textMuted};
`;

const AttendanceList = styled.ul`
  margin: ${(p) => p.theme.spacing.sm} 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: ${(p) => p.theme.spacing.xs};
`;

const AttendanceCounts = styled.div`
  display: inline-flex;
  gap: ${(p) => p.theme.spacing.xs};
`;

const AttendanceBadge = styled.span<{ "data-tone"?: string }>`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: ${(p) => p.theme.radii.sm};
  font-size: ${(p) => p.theme.font.size.xs};
  font-weight: ${(p) => p.theme.font.weight.semiBold};
  background: ${(p) => p.theme.colors.surfaceAlt};
  color: ${(p) => p.theme.colors.textMuted};
  &[data-tone='present'] {
    background: ${(p) => p.theme.colors.successSurface};
    color: ${(p) => p.theme.colors.success};
  }
  &[data-tone='absent'] {
    background: ${(p) => p.theme.colors.warningSurface};
    color: ${(p) => p.theme.colors.warning};
  }
`;

const ExamList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: ${(p) => p.theme.spacing.sm};
`;

const ExamRow = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.xs};
`;

const ExamLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  span {
    font-size: ${(p) => p.theme.font.size.sm};
    font-weight: ${(p) => p.theme.font.weight.semiBold};
    color: ${(p) => p.theme.colors.text};
  }
  small {
    font-size: ${(p) => p.theme.font.size.xs};
    color: ${(p) => p.theme.colors.textMuted};
  }
`;

const BarTrack = styled.div`
  height: 10px;
  border-radius: ${(p) => p.theme.radii.md};
  background: ${(p) => p.theme.colors.surfaceAlt};
  overflow: hidden;
`;

const BarFill = styled.div`
  height: 100%;
  background: ${(p) => p.theme.colors.primary};
  transition: width 160ms ease-out;
`;

const ExamValue = styled.span`
  font-size: ${(p) => p.theme.font.size.xs};
  color: ${(p) => p.theme.colors.textMuted};
`;

const ExamAverage = styled.p`
  margin: ${(p) => p.theme.spacing.sm} 0 0;
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${(p) => p.theme.colors.primary};
  font-weight: ${(p) => p.theme.font.weight.semiBold};
`;

const ModalStudentList = styled.ul`
  margin: 0;
  padding-left: ${(p) => p.theme.spacing.md};
  display: grid;
  gap: ${(p) => p.theme.spacing.xs};
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${(p) => p.theme.colors.text};
  list-style: disc;
  li {
    display: grid;
    gap: 2px;
  }
  small {
    color: ${(p) => p.theme.colors.textMuted};
    font-size: ${(p) => p.theme.font.size.xs};
  }
`;

const ModalAttendanceSummary = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.xs};
  margin-bottom: ${(p) => p.theme.spacing.sm};
`;

const ModalAttendanceBar = styled.div`
  height: 10px;
  border-radius: 999px;
  background: ${(p) => p.theme.colors.surfaceAlt};
  overflow: hidden;
`;

const ModalAttendanceFill = styled.div`
  height: 100%;
  background: ${(p) => p.theme.colors.success};
  transition: width 160ms ease-out;
`;

const ModalAttendanceMeta = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${(p) => p.theme.colors.textMuted};
`;

const ModalAttendanceList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: ${(p) => p.theme.spacing.xs};
`;

const ModalAttendanceCounts = styled.div`
  display: inline-flex;
  gap: ${(p) => p.theme.spacing.xs};
`;

const ModalExamList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: ${(p) => p.theme.spacing.sm};
`;

const ModalExamRow = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.xs};
`;

const ModalExamLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  span {
    font-size: ${(p) => p.theme.font.size.sm};
    font-weight: ${(p) => p.theme.font.weight.semiBold};
    color: ${(p) => p.theme.colors.text};
  }
  small {
    font-size: ${(p) => p.theme.font.size.xs};
    color: ${(p) => p.theme.colors.textMuted};
  }
`;

const ModalBarTrack = styled.div`
  height: 10px;
  border-radius: ${(p) => p.theme.radii.md};
  background: ${(p) => p.theme.colors.surfaceAlt};
  overflow: hidden;
`;

const ModalBarFill = styled.div`
  height: 100%;
  background: ${(p) => p.theme.colors.primary};
  transition: width 160ms ease-out;
`;

const ModalExamValue = styled.span`
  font-size: ${(p) => p.theme.font.size.xs};
  color: ${(p) => p.theme.colors.textMuted};
`;

const ModalExamAverage = styled.p`
  margin: 0;
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${(p) => p.theme.colors.primary};
  font-weight: ${(p) => p.theme.font.weight.semiBold};
`;
