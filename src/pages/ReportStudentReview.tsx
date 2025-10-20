import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import styled from "styled-components";
import { Page, PageHeader, SectionCard } from "@/components/common/UI";
import Modal from "@/components/common/Modal";
import {
  getStudent,
  getStudentAttendance,
  type Student,
  type StudentAttendance,
} from "@/api/students";
import { listExams, listExamResults } from "@/api/exams";
import { routes, paths } from "@/routes";
import { readableError } from "@/lib/errors";
import { formatKoreanDate, formatPhone } from "@/lib/format";

type DateRange = { from: string; to: string };

type LocationState = {
  student?: Student | null;
  range?: DateRange;
  summary?: string;
  fromCourse?: {
    courseId: number;
    courseTitle?: string;
    rangeText?: string;
  };
};

type StudentExamSeriesItem = {
  examId: number;
  courseId: number;
  courseTitle: string;
  examTitle: string;
  examDate?: string | null;
  percent: number | null;
};

const ATTENDANCE_FETCH_LIMIT = 200;
const EXAM_FETCH_LIMIT = 10;

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

function describeRange(range: DateRange): string {
  if (!range.from && !range.to) return "전체 기간";
  const from = range.from || "전체 기간 시작";
  const to = range.to || "현재";
  return `${from} ~ ${to}`;
}

export default function ReportStudentReview() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState | null) ?? {};
  const fromCourse = state.fromCourse;

  const numericId = useMemo(() => {
    if (!studentId) return null;
    const n = Number(studentId);
    return Number.isFinite(n) ? n : null;
  }, [studentId]);

  const [student, setStudent] = useState<Student | null>(state.student ?? null);
  const [loading, setLoading] = useState(!state.student);
  const [error, setError] = useState<string | null>(null);
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
  const rangeLabel = useMemo(() => describeRange(range), [range.from, range.to]);
  const summarySeed = useMemo(() => {
    if (student) {
      return `${student.name} 학생의 ${rangeLabel} 학습 내용을 개인 관점에서 요약합니다. 출결 변화, 참여한 수업, 시험·평가 성적을 통합해 학부모 상담에 활용할 수 있도록 정리하고 수업 리포트와 연결할 코멘트를 덧붙이세요.`;
    }
    return `학생의 최근 학습 과정을 ${rangeLabel} 기준으로 요약해 공유합니다.`;
  }, [student, rangeLabel]);
  const [summaryTouched, setSummaryTouched] = useState(Boolean(state.summary));
  const [summary, setSummary] = useState(state.summary ?? summarySeed);
  const [feedback, setFeedback] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const [attendanceEntries, setAttendanceEntries] = useState<StudentAttendance[]>([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [attendanceError, setAttendanceError] = useState<string | null>(null);

  const [examResults, setExamResults] = useState<StudentExamSeriesItem[]>([]);
  const [examLoading, setExamLoading] = useState(false);
  const [examError, setExamError] = useState<string | null>(null);
  const [examAverage, setExamAverage] = useState<number | null>(null);

  useEffect(() => {
    if (!numericId) return;
    if (student) return;
    let active = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getStudent(numericId);
        if (!active) return;
        setStudent(data);
      } catch (err) {
        if (!active) return;
        setError(readableError(err, "학생 정보를 불러오지 못했습니다."));
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [numericId, student]);

  useEffect(() => {
    if (!numericId) {
      setAttendanceEntries([]);
      return;
    }
    let active = true;
    (async () => {
      try {
        setAttendanceLoading(true);
        setAttendanceError(null);
        const res = await getStudentAttendance(numericId, {
          from: range.from || undefined,
          to: range.to || undefined,
          size: ATTENDANCE_FETCH_LIMIT,
        });
        if (!active) return;
        setAttendanceEntries(res?.content ?? []);
      } catch (err) {
        if (!active) return;
        setAttendanceEntries([]);
        setAttendanceError(readableError(err, "출결 데이터를 불러오지 못했습니다."));
      } finally {
        if (active) setAttendanceLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [numericId, range.from, range.to]);

  useEffect(() => {
    if (!student || !student.courses || student.courses.length === 0) {
      setExamResults([]);
      setExamAverage(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        setExamLoading(true);
        setExamError(null);
        const collected: StudentExamSeriesItem[] = [];
        for (const course of student.courses) {
          const exams = await listExams(course.id);
          if (cancelled) return;
          const filtered = (exams ?? []).filter((exam) =>
            isWithinRange(exam.examDate ?? null, range)
          );
          const limited = filtered.slice(-EXAM_FETCH_LIMIT);
          for (const exam of limited) {
            try {
              const results = await listExamResults(course.id, exam.id);
              if (cancelled) return;
              const mine = (results ?? []).find((item) => item.studentId === student.id);
              if (!mine) continue;
              const percent = normalizeScore(mine.score, mine.outOf);
              collected.push({
                examId: exam.id,
                courseId: course.id,
                courseTitle: course.title,
                examTitle: exam.title,
                examDate: exam.examDate,
                percent:
                  typeof percent === "number"
                    ? Math.round(Math.max(0, Math.min(100, percent)) * 10) / 10
                    : null,
              });
            } catch (err) {
              if (!cancelled) {
                setExamError((prev) => prev ?? readableError(err, "시험 데이터를 불러오지 못했습니다."));
              }
            }
          }
        }
        if (!cancelled) {
          const ordered = collected
            .slice()
            .sort((a, b) => (a.examDate || "").localeCompare(b.examDate || ""));
          setExamResults(ordered);
          const valid = ordered
            .map((item) => item.percent)
            .filter((value): value is number => Number.isFinite(value));
          setExamAverage(valid.length ? valid.reduce((acc, value) => acc + value, 0) / valid.length : null);
        }
      } finally {
        if (!cancelled) setExamLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [student, range.from, range.to]);

  useEffect(() => {
    if (summaryTouched) return;
    setSummary(summarySeed);
  }, [summarySeed, summaryTouched]);

  const title = student ? `${student.name} 학생 리포트` : loading ? "불러오는 중…" : "학생 정보를 찾을 수 없습니다.";

  const formattedRange = useMemo(() => {
    if (!range.from && !range.to) return "전체 기간";
    const fromText = range.from ? formatKoreanDate(range.from) : "시작 미지정";
    const toText = range.to ? formatKoreanDate(range.to) : "종료 미지정";
    return `${fromText} ~ ${toText}`;
  }, [range]);

  const attendanceTotals = useMemo(() => {
    const presentTotal = attendanceEntries.filter((entry) => entry.present).length;
    const absentTotal = attendanceEntries.length - presentTotal;
    const total = presentTotal + absentTotal;
    return {
      presentTotal,
      absentTotal,
      total,
      rate: total ? (presentTotal / total) * 100 : null,
    };
  }, [attendanceEntries]);

  const recentAttendance = useMemo(
    () => attendanceEntries.slice(0, 5),
    [attendanceEntries]
  );

  const orderedExamResults = useMemo(
    () =>
      examResults
        .slice()
        .sort((a, b) => (a.examDate || "").localeCompare(b.examDate || "")),
    [examResults]
  );

  return (
    <Page>
      <PageHeader>
        <div>
          <h2>{title}</h2>
          <p>학생 리포트를 검토하고 필요한 정보를 보완하세요.</p>
        </div>
        <HeaderActions>
          <GhostButton type="button" onClick={() => navigate(paths.report.studentDetail(studentId ?? ""))}>
            이전
          </GhostButton>
          <PrimaryButton type="button" onClick={() => navigate(routes.report)}>
            리포트 홈
          </PrimaryButton>
        </HeaderActions>
      </PageHeader>

      {fromCourse ? (
        <InlineHint>
          {`${fromCourse.courseTitle ?? "수업"} 리포트에서 이동했습니다. ${rangeLabel} 기간을 학생 관점으로 정리해 주세요.`}
        </InlineHint>
      ) : null}

      {error ? <InlineError>{error}</InlineError> : null}

      <SectionCard data-animated="true">
        <PanelHeader>
          <div>
            <PanelTitle>학생 정보</PanelTitle>
            <PanelSubtitle>학생 기본 정보입니다. 필요하면 아래에서 수업별 리포트로도 이동하세요.</PanelSubtitle>
          </div>
        </PanelHeader>
        {student ? (
          <InfoGrid>
            <InfoRow>
              <InfoLabel>이름</InfoLabel>
              <InfoValue>{student.name}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>연락처</InfoLabel>
              <InfoValue>{formatPhone(student.phoneNumber)}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>등록일</InfoLabel>
              <InfoValue>{student.joinedDate ? formatKoreanDate(student.joinedDate) : "-"}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>현재 상태</InfoLabel>
              <InfoValue>{statusText(student.status)}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>수강 중인 수업</InfoLabel>
              <InfoValue>
                {student.courses && student.courses.length
                  ? student.courses.map((course) => course.title).join(", ")
                  : "등록된 수업이 없습니다."}
              </InfoValue>
            </InfoRow>
          </InfoGrid>
        ) : (
          <InlineHint>학생 정보를 불러오는 중입니다.</InlineHint>
        )}
        {student?.courses && student.courses.length ? (
          <CourseLinkNotice>
            <CourseLinkText>같은 기간의 수업 리포트가 필요하면 아래 버튼으로 이동하세요.</CourseLinkText>
            <CourseLinkList>
              {student.courses.map((course) => (
                <CourseLinkButton
                  key={course.id}
                  type="button"
                  onClick={() =>
                    navigate(paths.report.courseReview(course.id), {
                      state: {
                        course: { id: course.id, title: course.title },
                        range: { ...range },
                        fromStudent: {
                          studentId: student.id,
                          studentName: student.name,
                          rangeText: rangeLabel,
                        },
                      },
                    })
                  }
                >
                  {course.title} 리포트
                </CourseLinkButton>
              ))}
            </CourseLinkList>
          </CourseLinkNotice>
        ) : null}
      </SectionCard>

      <SectionCard data-animated="true">
        <PanelHeader>
          <div>
            <PanelTitle>학습 요약</PanelTitle>
            <PanelSubtitle>자동 작성된 요약을 원하는 내용으로 수정하세요.</PanelSubtitle>
          </div>
        </PanelHeader>
        <SummaryTextarea
          value={summary}
          onChange={(event) => {
            setSummary(event.currentTarget.value);
            setSummaryTouched(true);
          }}
          placeholder="학생 학습 요약을 입력하세요."
          rows={6}
        />
      </SectionCard>

      <SectionCard data-animated="true">
        <PanelHeader>
          <div>
            <PanelTitle>기간 설정</PanelTitle>
            <PanelSubtitle>상담, 수업, 시험 기록의 범위를 설정합니다.</PanelSubtitle>
          </div>
        </PanelHeader>
        <DateGrid>
          <FieldBlock>
            <FieldLabel htmlFor="review-student-from">시작일</FieldLabel>
            <DateInput
              id="review-student-from"
              type="date"
              value={range.from}
              max={range.to || undefined}
              onChange={(event) => setRange({ ...range, from: event.currentTarget.value })}
            />
          </FieldBlock>
          <FieldBlock>
            <FieldLabel htmlFor="review-student-to">종료일</FieldLabel>
            <DateInput
              id="review-student-to"
              type="date"
              value={range.to}
              min={range.from || undefined}
              onChange={(event) => setRange({ ...range, to: event.currentTarget.value })}
            />
          </FieldBlock>
        </DateGrid>
        <InlineHint>기간을 비워두면 전체 기록이 포함됩니다.</InlineHint>
      </SectionCard>

      <SectionCard data-animated="true">
        <PanelHeader>
          <div>
            <PanelTitle>리포트 미리보기</PanelTitle>
            <PanelSubtitle>AI가 수집한 데이터를 기준으로 학생 리포트를 확인하세요.</PanelSubtitle>
          </div>
        </PanelHeader>
        <PreviewLayout>
          <PreviewColumn>
            <PreviewBlock>
              <BlockTitle>출결 현황</BlockTitle>
              {attendanceLoading ? <InlineHint>출결 데이터를 불러오는 중입니다…</InlineHint> : null}
              {attendanceError ? <InlineError>{attendanceError}</InlineError> : null}
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
                  {recentAttendance.map((entry, index) => (
                    <li key={`${entry.recordId ?? index}-${entry.date}`}>
                      <span>
                        {entry.date
                          ? formatKoreanDate(entry.date, { includeWeekday: false })
                          : "날짜 미지정"}
                      </span>
                      <AttendanceCounts>
                        <AttendanceBadge data-tone="present">
                          {entry.present ? "출석" : "결석"}
                        </AttendanceBadge>
                        {entry.courseTitle ? <small>{entry.courseTitle}</small> : null}
                      </AttendanceCounts>
                    </li>
                  ))}
                </AttendanceList>
              ) : null}
            </PreviewBlock>
            <PreviewBlock>
              <BlockTitle>학습 요약</BlockTitle>
              <SummaryPreview>{summary || "요약 내용이 없습니다."}</SummaryPreview>
            </PreviewBlock>
          </PreviewColumn>
          <PreviewColumn>
            <PreviewBlock>
              <BlockTitle>시험 기록</BlockTitle>
              {examLoading ? <InlineHint>시험 데이터를 불러오는 중입니다…</InlineHint> : null}
              {examError ? <InlineError>{examError}</InlineError> : null}
              {orderedExamResults.length ? (
                <ExamList>
                  {orderedExamResults.map((exam) => (
                    <li key={exam.examId}>
                      <ExamRow>
                        <ExamLabel>
                          <span>{exam.examTitle}</span>
                          <small>
                            {exam.examDate
                              ? formatKoreanDate(exam.examDate, { includeWeekday: false })
                              : "일정 미정"}
                            {` · ${exam.courseTitle}`}
                          </small>
                        </ExamLabel>
                        <BarTrack>
                          <BarFill style={{ width: `${Math.min(100, Math.max(0, exam.percent ?? 0))}%` }} />
                        </BarTrack>
                        <ExamValue>
                          {exam.percent != null ? `${exam.percent.toFixed(1)}점` : "미응시"}
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
                placeholder="학생에게 전달할 피드백을 정리하세요."
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
        student={student}
        period={formattedRange}
        summary={summary}
        feedback={feedback}
        attendance={attendanceEntries}
        attendanceRate={attendanceTotals.rate}
        examResults={orderedExamResults}
        examAverage={examAverage}
        onChangeFeedback={setFeedback}
      />
    </Page>
  );
}

type ReportPreviewModalProps = {
  open: boolean;
  onClose: () => void;
  student: Student | null;
  period: string;
  summary: string;
  feedback: string;
  attendance: StudentAttendance[];
  attendanceRate: number | null;
  examResults: StudentExamSeriesItem[];
  examAverage: number | null;
  onChangeFeedback: (value: string) => void;
};

function ReportPreviewModal({
  open,
  onClose,
  student,
  period,
  summary,
  feedback,
  attendance,
  attendanceRate,
  examResults,
  examAverage,
  onChangeFeedback,
}: ReportPreviewModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="학생 리포트 미리보기"
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
          <ModalTitle>{student ? `${student.name} 학생` : "학생 정보 없음"}</ModalTitle>
          <ModalMeta>{period}</ModalMeta>
        </ModalHeader>
        <ModalContent>
          <ModalBlock>
            <strong>학생 정보</strong>
            <InfoList>
              <li>이름: {student?.name ?? "-"}</li>
              <li>연락처: {formatPhone(student?.phoneNumber)}</li>
              <li>등록일: {student?.joinedDate ? formatKoreanDate(student.joinedDate) : "-"}</li>
              <li>상태: {student ? statusText(student.status) : "-"}</li>
              <li>
                수강수업:{" "}
                {student?.courses && student.courses.length
                  ? student.courses.map((course) => course.title).join(", ")
                  : "-"}
              </li>
            </InfoList>
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
                    <span>출석 {attendance.filter((entry) => entry.present).length}회</span>
                    <span>결석 {attendance.filter((entry) => !entry.present).length}회</span>
                  </ModalAttendanceMeta>
                </ModalAttendanceSummary>
                <ModalAttendanceList>
                  {attendance.slice(0, 10).map((entry, index) => (
                    <li key={`${entry.recordId ?? index}-${entry.date ?? index}`}>
                      <span>
                        {entry.date
                          ? formatKoreanDate(entry.date, { includeWeekday: false })
                          : "날짜 미지정"}
                      </span>
                      <ModalAttendanceCounts>
                        <AttendanceBadge data-tone={entry.present ? "present" : "absent"}>
                          {entry.present ? "출석" : "결석"}
                        </AttendanceBadge>
                        {entry.courseTitle ? <small>{entry.courseTitle}</small> : null}
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
            <strong>수업 요약</strong>
            <p>{summary || "요약 내용이 없습니다."}</p>
          </ModalBlock>
          <ModalBlock>
            <strong>시험 기록</strong>
            {examResults.length ? (
              <>
                <ModalExamList>
                  {examResults.map((exam) => (
                    <li key={exam.examId}>
                      <ModalExamRow>
                        <ModalExamLabel>
                          <span>{exam.examTitle}</span>
                          <small>
                            {exam.examDate
                              ? formatKoreanDate(exam.examDate, { includeWeekday: false })
                              : "일정 미정"}
                            {exam.courseTitle ? ` · ${exam.courseTitle}` : ""}
                          </small>
                        </ModalExamLabel>
                        <ModalBarTrack>
                          <ModalBarFill style={{ width: `${Math.min(100, Math.max(0, exam.percent ?? 0))}%` }} />
                        </ModalBarTrack>
                        <ModalExamValue>
                          {exam.percent != null ? `${exam.percent.toFixed(1)}점` : "미응시"}
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

function statusText(status: Student["status"]): string {
  if (status === "ENROLLED") return "수강중";
  if (status === "ON_LEAVE") return "휴학";
  return "대기";
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
  &:hover:not(:disabled) {
    border-color: ${(p) => p.theme.colors.borderStrong};
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
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

const InfoGrid = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.sm};
`;

const CourseLinkNotice = styled.div`
  margin-top: ${(p) => p.theme.spacing.md};
  display: grid;
  gap: ${(p) => p.theme.spacing.xs};
`;

const CourseLinkText = styled.span`
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${(p) => p.theme.colors.textMuted};
`;

const CourseLinkList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${(p) => p.theme.spacing.xs};
`;

const CourseLinkButton = styled.button`
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

const InfoRow = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.xs};
  padding: ${(p) => p.theme.spacing.sm};
  border-radius: ${(p) => p.theme.radii.md};
  background: ${(p) => p.theme.colors.surfaceAlt};
`;

const InfoLabel = styled.span`
  font-size: ${(p) => p.theme.font.size.xs};
  color: ${(p) => p.theme.colors.textMuted};
  letter-spacing: 0.02em;
`;

const InfoValue = styled.span`
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${(p) => p.theme.colors.text};
  line-height: ${(p) => p.theme.font.lineHeight.relaxed};
`;

const SummaryTextarea = styled.textarea`
  width: 100%;
  border: 1px solid ${(p) => p.theme.colors.borderStrong};
  border-radius: ${(p) => p.theme.radii.md};
  padding: ${(p) => p.theme.spacing.md};
  font-size: ${(p) => p.theme.font.size.sm};
  line-height: ${(p) => p.theme.font.lineHeight.relaxed};
  min-height: 140px;
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
  gap: ${(p) => p.theme.spacing.md};
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
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
  p {
    margin: 0;
    font-size: ${(p) => p.theme.font.size.sm};
    color: ${(p) => p.theme.colors.textMuted};
  }
`;

const InfoList = styled.ul`
  margin: 0;
  padding-left: ${(p) => p.theme.spacing.md};
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${(p) => p.theme.colors.textMuted};
  list-style: disc;
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
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${(p) => p.theme.colors.text};
  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: ${(p) => p.theme.spacing.sm};
  }
  small {
    font-size: ${(p) => p.theme.font.size.xs};
    color: ${(p) => p.theme.colors.textMuted};
  }
`;

const AttendanceCounts = styled.div`
  display: inline-flex;
  align-items: center;
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
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${(p) => p.theme.colors.text};
  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: ${(p) => p.theme.spacing.sm};
  }
  small {
    font-size: ${(p) => p.theme.font.size.xs};
    color: ${(p) => p.theme.colors.textMuted};
  }
`;

const ModalAttendanceCounts = styled.div`
  display: inline-flex;
  align-items: center;
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
