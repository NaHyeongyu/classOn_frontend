import { PageHeader, SectionCard, PrimaryButton, GhostButtonSmall } from "@/components/common/UI";
import { listCourses, type Course, listCourseStudents, listCourseRecords, type CourseRecord } from "@/api/courses";
import { getDailyAttendance, type AttendanceDailySummary } from "@/api/attendance";
import { listExams, listExamResults, type Exam, type ExamResult } from "@/api/exams";
import type { Student } from "@/api/students";
import { readableError } from "@/lib/errors";
import { useToast } from "@/components/common/Toast";
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";

type CourseListItem = {
  id: number;
  title: string;
  meta: string;
};

type ReportDraft = {
  attendance: string;
  grades: string;
  lessons: string;
  comment: string;
};

const EMPTY_DRAFT: ReportDraft = {
  attendance: "",
  grades: "",
  lessons: "",
  comment: "",
};

export default function Reports() {
  const [courses, setCourses] = useState<CourseListItem[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [coursesError, setCoursesError] = useState<string | null>(null);
  const [courseQuery, setCourseQuery] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

  const [students, setStudents] = useState<Student[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentsError, setStudentsError] = useState<string | null>(null);
  const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [mode, setMode] = useState<"select" | "edit">("select");
  const [activeStudentId, setActiveStudentId] = useState<number | null>(null);
  const [drafts, setDrafts] = useState<Record<number, ReportDraft>>({});
  const [from, setFrom] = useState<string>(() => defaultFrom());
  const [to, setTo] = useState<string>(() => defaultTo());
  const [autoLoading, setAutoLoading] = useState(false);
  const [autoError, setAutoError] = useState<string | null>(null);
  const { warning, error: showError } = useToast();
  const [autoDetails, setAutoDetails] = useState<Record<number, AutoDetails>>({});

  useEffect(() => {
    let cancelled = false;
    async function loadCourses() {
      setCoursesLoading(true);
      setCoursesError(null);
      try {
        const res = await listCourses({ size: 200, page: 0, status: "IN_PROGRESS" });
        if (cancelled) return;
        const mapped: CourseListItem[] = res.content.map((c) => ({
          id: c.id,
          title: c.title,
          meta: buildCourseMeta(c),
        }));
        setCourses(mapped);
        if (!selectedCourseId && mapped.length > 0) {
          setSelectedCourseId(mapped[0].id);
        }
      } catch (error) {
        if (!cancelled) setCoursesError(readableError(error, "수업 목록을 불러오지 못했습니다."));
      } finally {
        if (!cancelled) setCoursesLoading(false);
      }
    }
    void loadCourses();
    return () => {
      cancelled = true;
    };
  }, [selectedCourseId]);

  useEffect(() => {
    if (!selectedCourseId) {
      setStudents([]);
      setSelectedStudentIds([]);
      setSelectAll(false);
      setStudentsError(null);
      return;
    }
    let cancelled = false;
    async function loadStudents() {
      setStudentsLoading(true);
      setStudentsError(null);
      try {
        const res = await listCourseStudents(selectedCourseId);
        if (cancelled) return;
        setStudents(res);
        setSelectedStudentIds([]);
        setSelectAll(false);
      } catch (error) {
        if (!cancelled) setStudentsError(readableError(error, "수업의 수강생을 불러오지 못했습니다."));
      } finally {
        if (!cancelled) setStudentsLoading(false);
      }
    }
    void loadStudents();
    return () => {
      cancelled = true;
    };
  }, [selectedCourseId]);

  const filteredCourses = useMemo(() => {
    const q = courseQuery.trim();
    if (!q) return courses;
    return courses.filter((c) => c.title.toLowerCase().includes(q.toLowerCase()));
  }, [courseQuery, courses]);

  const selectedStudents = useMemo(
    () => students.filter((s) => selectedStudentIds.includes(s.id)),
    [students, selectedStudentIds],
  );

  const toggleStudent = (id: number) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id],
    );
  };

  const handleToggleSelectAll = () => {
    if (selectAll || selectedStudentIds.length === students.length) {
      setSelectAll(false);
      setSelectedStudentIds([]);
    } else {
      setSelectAll(true);
      setSelectedStudentIds(students.map((s) => s.id));
    }
  };

  const handleCreateReports = async () => {
    if (!selectedCourseId || selectedStudentIds.length === 0) return;
    if (!from || !to) {
      warning("보고서 기간(시작일/종료일)을 선택해주세요.");
      return;
    }
    if (from > to) {
      showError("조회 기간이 올바르지 않습니다. 시작일이 종료일보다 늦습니다.");
      return;
    }
    const courseId = selectedCourseId;
    const studentIds = [...selectedStudentIds];
    setAutoLoading(true);
    setAutoError(null);
    try {
      const [autoDrafts, autoDetailsResult] = await Promise.all([
        buildAutoDrafts(courseId, studentIds, from, to),
        buildAutoDetails(courseId, studentIds, from, to),
      ]);
      setDrafts((prev) => {
        const next: Record<number, ReportDraft> = { ...prev };
        studentIds.forEach((id) => {
          const base = next[id] ?? { ...EMPTY_DRAFT };
          const auto = autoDrafts[id] ?? { attendance: "", grades: "", lessons: "" };
          next[id] = {
            attendance: auto.attendance || base.attendance,
            grades: auto.grades || base.grades,
            lessons: auto.lessons || base.lessons,
            comment: base.comment,
          };
        });
        return next;
      });
      setAutoDetails(autoDetailsResult);
    } catch (error) {
      const message = readableError(error, "자동으로 보고서 내용을 불러오지 못했습니다.");
      setAutoError(message);
      showError(message);
      setDrafts((prev) => {
        const next: Record<number, ReportDraft> = { ...prev };
        studentIds.forEach((id) => {
          if (!next[id]) next[id] = { ...EMPTY_DRAFT };
        });
        return next;
      });
    } finally {
      setActiveStudentId(studentIds[0] ?? null);
      setMode("edit");
      setAutoLoading(false);
    }
  };

  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || null;

  const canCreate = Boolean(selectedCourseId && selectedStudentIds.length > 0);

  const activeStudent =
    activeStudentId != null ? selectedStudents.find((s) => s.id === activeStudentId) || null : null;
  const activeDraft = activeStudentId != null ? drafts[activeStudentId] ?? EMPTY_DRAFT : EMPTY_DRAFT;
  const activeDetail = activeStudentId != null ? autoDetails[activeStudentId] : undefined;

  const handleChangeDraft = (field: keyof ReportDraft, value: string) => {
    if (activeStudentId == null) return;
    setDrafts((prev) => {
      const prevDraft = prev[activeStudentId] ?? EMPTY_DRAFT;
      return {
        ...prev,
        [activeStudentId]: {
          ...prevDraft,
          [field]: value,
        },
      };
    });
  };

  return (
    <Viewport>
      <HeaderWrap>
        <PageHeader>
          <div>
            <h2>보고서</h2>
            <p>
              {mode === "select"
                ? "좌측에서 수업을 선택하고, 우측에서 보고서를 생성할 학생을 선택하세요."
                : "좌측에서 학생을 선택해 우측에서 보고서 내용을 미리보고 수정하세요."}
            </p>
          </div>
          <HeaderActions>
            {mode === "edit" ? (
              <GhostButtonSmall as="button" type="button" onClick={() => setMode("select")}>
                학생 다시 선택
              </GhostButtonSmall>
            ) : null}
          </HeaderActions>
        </PageHeader>
      </HeaderWrap>

      {mode === "select" ? (
        <ContentGrid>
          <LeftColumn>
            <SectionCard data-animated="true">
              <LeftHeader>
                <div>
                  <LeftTitle>수업 목록</LeftTitle>
                  <LeftSubtitle>보고서를 생성할 수업을 선택하세요.</LeftSubtitle>
                </div>
              </LeftHeader>
              <SearchBar>
                <SearchInput
                  placeholder="수업명으로 검색"
                  value={courseQuery}
                  onChange={(event) => setCourseQuery(event.target.value)}
                />
              </SearchBar>
              {coursesLoading && <HintText>수업을 불러오는 중입니다…</HintText>}
              {coursesError && <ErrorText>{coursesError}</ErrorText>}
              <CourseListWrap>
                <CourseList role="list" aria-label="수업 목록">
                  {filteredCourses.map((course) => {
                    const selected = course.id === selectedCourseId;
                    return (
                      <CourseRow
                        key={course.id}
                        type="button"
                        role="listitem"
                        data-selected={selected || undefined}
                        onClick={() => setSelectedCourseId(course.id)}
                      >
                        <div className="title">{course.title}</div>
                        <div className="meta">{course.meta}</div>
                      </CourseRow>
                    );
                  })}
                  {!coursesLoading && filteredCourses.length === 0 && (
                    <EmptyRow>조건에 맞는 수업이 없습니다.</EmptyRow>
                  )}
                </CourseList>
              </CourseListWrap>
            </SectionCard>
          </LeftColumn>

          <RightColumn>
            <SectionCard data-animated="true">
              <RightHeader>
                <div>
                  <RightTitle>학생 선택</RightTitle>
                  <RightSubtitle>
                    {selectedCourse
                      ? `${selectedCourse.title} 수업의 수강생을 선택해 보고서를 생성합니다.`
                      : "먼저 좌측에서 수업을 선택하세요."}
                  </RightSubtitle>
                </div>
                <RightActions>
                  <GhostButtonSmall
                    as="button"
                    type="button"
                    onClick={handleToggleSelectAll}
                    disabled={!students.length}
                  >
                    {selectedStudentIds.length === students.length && students.length > 0
                      ? "전체 해제"
                      : "전체 선택"}
                  </GhostButtonSmall>
                  <PrimaryButton type="button" onClick={handleCreateReports} disabled={!canCreate}>
                    선택 학생 보고서 생성
                  </PrimaryButton>
                </RightActions>
              </RightHeader>
              <PeriodRow>
                <PeriodLabel>보고서 기간</PeriodLabel>
                <PeriodInputs>
                  <PeriodInput
                    type="date"
                    value={from}
                    onChange={(event) => setFrom(event.target.value)}
                  />
                  <span>~</span>
                  <PeriodInput
                    type="date"
                    value={to}
                    onChange={(event) => setTo(event.target.value)}
                  />
                </PeriodInputs>
              </PeriodRow>
              {studentsLoading && <HintText>학생 목록을 불러오는 중입니다…</HintText>}
              {studentsError && <ErrorText>{studentsError}</ErrorText>}
              <StudentsListWrap>
                <StudentsList role="list" aria-label="학생 목록">
                  {students.map((student) => {
                    const checked = selectedStudentIds.includes(student.id);
                    return (
                      <StudentRow
                        key={student.id}
                        role="listitem"
                        data-selected={checked || undefined}
                        onClick={() => toggleStudent(student.id)}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleStudent(student.id)}
                          onClick={(event) => event.stopPropagation()}
                        />
                        <div className="info">
                          <div className="name">{student.name}</div>
                          {student.code && <div className="meta">{student.code}</div>}
                        </div>
                      </StudentRow>
                    );
                  })}
                  {!studentsLoading && selectedCourseId && students.length === 0 && (
                    <EmptyRow>수업에 등록된 학생이 없습니다.</EmptyRow>
                  )}
                  {!selectedCourseId && <EmptyRow>먼저 좌측에서 수업을 선택하세요.</EmptyRow>}
                </StudentsList>
              </StudentsListWrap>
            </SectionCard>
          </RightColumn>
        </ContentGrid>
      ) : (
        <ContentGrid>
          <LeftColumn>
            <SectionCard data-animated="true">
              <LeftHeader>
                <div>
                  <LeftTitle>선택한 학생</LeftTitle>
                  <LeftSubtitle>
                    {selectedCourse
                      ? `${selectedCourse.title} 수업에서 선택한 학생 목록입니다.`
                      : "선택한 학생 목록입니다."}
                  </LeftSubtitle>
                </div>
              </LeftHeader>
              <StudentsListWrap>
                <StudentsList role="list" aria-label="선택한 학생 목록">
                  {selectedStudents.map((student) => {
                    const isActive = activeStudentId === student.id;
                    return (
                      <StudentRow
                        key={student.id}
                        role="listitem"
                        data-selected={isActive || undefined}
                        onClick={() => setActiveStudentId(student.id)}
                      >
                        <div className="info">
                          <div className="name">{student.name}</div>
                          {student.code && <div className="meta">{student.code}</div>}
                        </div>
                      </StudentRow>
                    );
                  })}
                  {selectedStudents.length === 0 && (
                    <EmptyRow>선택된 학생이 없습니다. 상단에서 학생을 다시 선택하세요.</EmptyRow>
                  )}
                </StudentsList>
              </StudentsListWrap>
            </SectionCard>
          </LeftColumn>

          <RightColumn>
            <SectionCard data-animated="true">
              <RightHeader>
                <div>
                  <RightTitle>보고서 미리보기 / 수정</RightTitle>
                  <RightSubtitle>
                    {activeStudent && selectedCourse
                      ? `${selectedCourse.title} · ${activeStudent.name} 학생의 보고서 초안을 작성합니다.`
                      : "좌측에서 학생을 선택하면 해당 학생의 보고서 초안을 작성할 수 있습니다."}
                  </RightSubtitle>
                </div>
              </RightHeader>
              {autoLoading && <HintText>출석/성적/수업 내용을 불러오는 중입니다…</HintText>}
              {autoError && <ErrorText>{autoError}</ErrorText>}

              {activeStudent ? (
                <ReportPaper>
                  <ReportPaperInner>
                    <ReportPaperHeader>
                      <div>
                        <PaperTitle>학습 보고서</PaperTitle>
                        <PaperSubtitle>
                          {selectedCourse ? selectedCourse.title : "수업 미지정"}
                        </PaperSubtitle>
                      </div>
                      <PaperMeta>
                        <dl>
                          <div>
                            <dt>학생</dt>
                            <dd>{activeStudent.name}</dd>
                          </div>
                          {from && to && (
                            <div>
                              <dt>기간</dt>
                              <dd>
                                {from} ~ {to}
                              </dd>
                            </div>
                          )}
                        </dl>
                      </PaperMeta>
                    </ReportPaperHeader>

                    <ReportLayout>
                      <ReportSection>
                        <ReportLabel>학생 정보</ReportLabel>
                        <ReportBox>
                          <ReportRow>
                            <span className="key">이름</span>
                            <span className="value">{activeStudent.name}</span>
                          </ReportRow>
                          {activeStudent.birthDate && (
                            <ReportRow>
                              <span className="key">생년월일</span>
                              <span className="value">{activeStudent.birthDate}</span>
                            </ReportRow>
                          )}
                          {selectedCourse && (
                            <ReportRow>
                              <span className="key">수강 수업</span>
                              <span className="value">{selectedCourse.title}</span>
                            </ReportRow>
                          )}
                        </ReportBox>
                      </ReportSection>

                      <ReportSection>
                        <ReportLabel>출석 내역</ReportLabel>
                        {activeDetail?.attendance && activeDetail.attendance.length > 0 ? (
                          <AttendanceList>
                            {activeDetail.attendance.slice(0, 30).map((row) => (
                              <li key={`${row.date}-${row.present ? "P" : "A"}`}>
                                <span className="date">{row.date}</span>
                                <span className={`status ${row.present ? "present" : "absent"}`}>
                                  {row.present ? "출석" : "결석"}
                                </span>
                              </li>
                            ))}
                            {activeDetail.attendance.length > 30 && (
                              <li className="more">
                                <span>외 {activeDetail.attendance.length - 30}회 기록</span>
                              </li>
                            )}
                          </AttendanceList>
                        ) : (
                          <EmptyHint>선택한 기간에 기록된 출석 데이터가 없습니다.</EmptyHint>
                        )}
                      </ReportSection>

                      <ReportSection>
                        <ReportLabel>성적 내역</ReportLabel>
                        {activeDetail?.grades && activeDetail.grades.length > 0 ? (
                          <GradesChart>
                            {activeDetail.grades.map((item) => {
                              const pct = Math.max(0, Math.min(100, Math.round(item.percent)));
                              return (
                                <div key={item.examId} className="row">
                                  <div className="label">
                                    <span className="title">{item.title}</span>
                                    {item.date && <span className="date">{item.date}</span>}
                                  </div>
                                  <div className="bar">
                                    <div className="fill" style={{ width: `${pct}%` }} />
                                  </div>
                                  <div className="value">{pct}점</div>
                                </div>
                              );
                            })}
                          </GradesChart>
                        ) : (
                          <EmptyHint>선택한 기간에 등록된 성적 데이터가 없습니다.</EmptyHint>
                        )}
                      </ReportSection>

                      <ReportSection>
                        <ReportLabel>수업 내용</ReportLabel>
                        {activeDetail?.lessons && activeDetail.lessons.length > 0 ? (
                          <LessonList>
                            {activeDetail.lessons.slice(0, 20).map((item, index) => (
                              <li key={`${item.date}-${index}`}>
                                <span className="date">{item.date}</span>
                                <span className="topic">{item.topic || "내용 없음"}</span>
                              </li>
                            ))}
                            {activeDetail.lessons.length > 20 && (
                              <li className="more">
                                <span>외 {activeDetail.lessons.length - 20}개의 수업 기록</span>
                              </li>
                            )}
                          </LessonList>
                        ) : (
                          <EmptyHint>선택한 기간에 수업 기록이 없습니다.</EmptyHint>
                        )}
                      </ReportSection>

                      <ReportSection>
                        <ReportLabel>선생님 피드백</ReportLabel>
                        <ReportTextarea
                          placeholder="학생의 전반적인 학습 태도, 강점/개선점, 향후 학습 제안 등을 작성하세요."
                          value={activeDraft.comment}
                          onChange={(event) => handleChangeDraft("comment", event.target.value)}
                        />
                      </ReportSection>
                    </ReportLayout>
                  </ReportPaperInner>
                </ReportPaper>
              ) : (
                <EmptyRow>좌측에서 학생을 선택하면 보고서 내용을 작성할 수 있습니다.</EmptyRow>
              )}
            </SectionCard>
          </RightColumn>
        </ContentGrid>
      )}
    </Viewport>
  );
}

function buildCourseMeta(course: Course): string {
  const parts: string[] = [];
  if (course.courseType === "INDIVIDUAL") parts.push("개인");
  if (course.courseType === "GROUP") parts.push("단체");
  if (Array.isArray(course.recurrenceDays) && course.recurrenceDays.length > 0) {
    parts.push(course.recurrenceDays.join("/"));
  }
  if (course.enrolledCount != null) {
    parts.push(`수강생 ${course.enrolledCount}명`);
  }
  return parts.join(" · ");
}

const Viewport = styled.div`
  height: calc(100vh - 48px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const HeaderWrap = styled.div`
  padding: 0 ${(p) => p.theme.spacing.xs};
  display: grid;
  gap: ${(p) => p.theme.spacing.sm};
`;

const HeaderActions = styled.div`
  display: inline-flex;
  gap: ${(p) => p.theme.spacing.sm};
  flex-wrap: wrap;
  justify-content: flex-end;
`;

const ContentGrid = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.xl};
  grid-template-columns: 1fr;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  @media (min-width: 1120px) {
    grid-template-columns: 360px 1fr;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  min-height: 0;
  overflow: hidden;
`;

const RightColumn = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.xl};
  min-height: 0;
`;

const LeftHeader = styled.div`
  margin-bottom: ${(p) => p.theme.spacing.md};
`;

const LeftTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.colors.text};
`;

const LeftSubtitle = styled.p`
  margin: 4px 0 0;
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0 ${(p) => p.theme.spacing.md};
  border-radius: ${(p) => p.theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: #fff;
  box-shadow: inset 0 1px 2px rgba(15, 23, 42, 0.04);
  margin-bottom: ${(p) => p.theme.spacing.sm};
`;

const SearchInput = styled.input`
  flex: 1;
  border: 0;
  background: transparent;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  &:focus {
    outline: none;
  }
`;

const HintText = styled.p`
  margin: 4px 0 0;
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const ErrorText = styled.p`
  margin: 4px 0 0;
  font-size: ${(p) => p.theme.font.size.sm};
  color: #dc2626;
  font-weight: 600;
`;

const CourseListWrap = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${(p) => p.theme.radii.md};
  max-height: 420px;
  overflow: hidden;
`;

const CourseList = styled.div`
  max-height: 420px;
  overflow-y: auto;
  display: grid;
`;

const CourseRow = styled.button`
  text-align: left;
  padding: ${(p) => p.theme.spacing.sm} ${(p) => p.theme.spacing.md};
  border: 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  display: grid;
  gap: 4px;
  transition: background 0.18s ease;
  cursor: pointer;
  &:last-child {
    border-bottom: 0;
  }
  .title {
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
  }
  .meta {
    font-size: 12px;
    color: ${({ theme }) => theme.colors.textMuted};
  }
  &[data-selected="true"] {
    background: ${({ theme }) => theme.colors.primarySurface};
  }
`;

const EmptyRow = styled.div`
  padding: ${(p) => p.theme.spacing.lg};
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const RightHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${(p) => p.theme.spacing.md};
  margin-bottom: ${(p) => p.theme.spacing.md};
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const RightTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.colors.text};
`;

const RightSubtitle = styled.p`
  margin: 4px 0 0;
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const RightActions = styled.div`
  display: inline-flex;
  gap: ${(p) => p.theme.spacing.sm};
  flex-wrap: wrap;
  justify-content: flex-end;
`;

const StudentsListWrap = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${(p) => p.theme.radii.md};
  max-height: 420px;
  overflow: hidden;
`;

const StudentsList = styled.div`
  max-height: 420px;
  overflow-y: auto;
  display: grid;
`;

const StudentRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing.sm};
  padding: ${(p) => p.theme.spacing.sm} ${(p) => p.theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  cursor: pointer;
  &:last-child {
    border-bottom: 0;
  }
  &[data-selected="true"] {
    background: ${({ theme }) => theme.colors.primarySurface};
  }
  input[type="checkbox"] {
    width: 16px;
    height: 16px;
  }
  .info {
    display: grid;
    gap: 2px;
  }
  .name {
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
  }
  .meta {
    font-size: 12px;
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const PeriodRow = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: ${(p) => p.theme.spacing.sm};
  align-items: center;
  margin-bottom: ${(p) => p.theme.spacing.md};
`;

const PeriodLabel = styled.div`
  font-size: ${(p) => p.theme.font.size.sm};
  font-weight: ${(p) => p.theme.font.weight.semiBold};
  color: ${({ theme }) => theme.colors.text};
`;

const PeriodInputs = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing.xs};
  flex-wrap: wrap;
`;

const PeriodInput = styled.input`
  height: 36px;
  border-radius: ${(p) => p.theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 0 ${(p) => p.theme.spacing.sm};
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${({ theme }) => theme.colors.text};
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadow.focusPrimary};
  }
`;

const ReportPaper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: ${(p) => p.theme.spacing.lg};
  background: #f1f5f9;
  border-radius: ${(p) => p.theme.radii.lg};
  overflow: hidden;
`;

const ReportPaperInner = styled.div`
  width: 100%;
  max-width: 794px; /* A4 width approx */
  aspect-ratio: 1 / 1.4142;
  max-height: calc(100vh - 200px);
  background: #ffffff;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 48px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  /* Scrollbar styling for cleaner look */
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 4px;
  }
`;

const ReportPaperHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding-bottom: 24px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.text};
  margin-bottom: 32px;
`;

const PaperTitle = styled.h3`
  margin: 0;
  font-size: 28px;
  font-weight: 900;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.2;
`;

const PaperSubtitle = styled.p`
  margin: 4px 0 0;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 500;
`;

const PaperMeta = styled.div`
  text-align: right;
  dl {
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 13px;
    color: ${({ theme }) => theme.colors.textMuted};
  }
  div {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }
  dt {
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
  }
  dd {
    margin: 0;
  }
`;

const ReportLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const ReportSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ReportLabel = styled.h4`
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.colors.border};
    opacity: 0.6;
  }
`;

const ReportBox = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  padding: 16px;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const ReportRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  
  .key {
    font-size: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textMuted};
  }
  .value {
    font-size: 15px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text};
  }
`;

const ReportTextarea = styled.textarea`
  min-height: 120px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 16px;
  font-size: 14px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text};
  background: #fff;
  resize: vertical;
  width: 100%;
  box-sizing: border-box;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}1a;
  }
  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const EmptyHint = styled.div`
  padding: 16px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 6px;
  text-align: center;
`;

const AttendanceList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 8px;
  
  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    border-radius: 6px;
    background: ${({ theme }) => theme.colors.surface};
    border: 1px solid ${({ theme }) => theme.colors.border};
    font-size: 13px;
  }
  
  .date {
    color: ${({ theme }) => theme.colors.textMuted};
    font-feature-settings: "tnum";
  }
  
  .status {
    font-weight: 600;
    font-size: 12px;
    padding: 2px 6px;
    border-radius: 4px;
  }
  
  .status.present {
    color: #15803d;
    background: #dcfce7;
  }
  
  .status.absent {
    color: #b91c1c;
    background: #fee2e2;
  }
  
  .more {
    justify-content: center;
    color: ${({ theme }) => theme.colors.textMuted};
    background: transparent;
    border: 1px dashed ${({ theme }) => theme.colors.border};
  }
`;

const GradesChart = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  
  .row {
    display: grid;
    grid-template-columns: 140px 1fr 48px;
    align-items: center;
    gap: 16px;
  }
  
  .label {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  
  .title {
    font-size: 13px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .date {
    font-size: 11px;
    color: ${({ theme }) => theme.colors.textMuted};
  }
  
  .bar {
    height: 8px;
    background: ${({ theme }) => theme.colors.surface};
    border-radius: 4px;
    overflow: hidden;
    border: 1px solid ${({ theme }) => theme.colors.border};
  }
  
  .fill {
    height: 100%;
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 4px;
    transition: width 0.5s ease-out;
  }
  
  .value {
    font-size: 13px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
    text-align: right;
    font-feature-settings: "tnum";
  }
`;

const LessonList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  li {
    display: flex;
    gap: 16px;
    padding: 10px 12px;
    border-radius: 6px;
    background: ${({ theme }) => theme.colors.surface};
    border: 1px solid ${({ theme }) => theme.colors.border};
    font-size: 13px;
    align-items: flex-start;
  }
  
  .date {
    color: ${({ theme }) => theme.colors.textMuted};
    font-weight: 500;
    font-feature-settings: "tnum";
    white-space: nowrap;
    min-width: 80px;
  }
  
  .topic {
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.4;
  }
  
  .more {
    justify-content: center;
    color: ${({ theme }) => theme.colors.textMuted};
    background: transparent;
    border: 1px dashed ${({ theme }) => theme.colors.border};
    padding: 8px;
  }
`;

type AttendancePoint = { date: string; present: boolean };
type GradePoint = { examId: number; title: string; date?: string; percent: number };
type LessonPoint = { date: string; topic?: string | null };

type AutoDetails = {
  attendance?: AttendancePoint[];
  grades?: GradePoint[];
  lessons?: LessonPoint[];
};

type AutoDraftFields = {
  attendance: string;
  grades: string;
  lessons: string;
};

async function buildAutoDrafts(
  courseId: number,
  studentIds: number[],
  from: string,
  to: string,
): Promise<Record<number, AutoDraftFields>> {
  const studentSet = new Set(studentIds);
  const base: Record<number, AutoDraftFields> = {};
  studentIds.forEach((id) => {
    base[id] = { attendance: "", grades: "", lessons: "" };
  });

  // 출석 요약
  try {
    const daily: AttendanceDailySummary[] = await fetchAttendanceDailyRange(from, to);
    const attendanceStats: Record<number, { present: number; absent: number }> = {};
    for (const day of daily) {
      const entries = day.attendances ?? [];
      for (const row of entries) {
        if (row.studentId != null && studentSet.has(row.studentId)) {
          const key = row.studentId;
          if (!attendanceStats[key]) {
            attendanceStats[key] = { present: 0, absent: 0 };
          }
          if (row.present) attendanceStats[key].present += 1;
          else attendanceStats[key].absent += 1;
        }
      }
    }
    for (const id of studentIds) {
      const stats = attendanceStats[id];
      if (!stats) {
        base[id].attendance =
          `${from} ~ ${to} 기간 동안 기록된 출석 데이터가 없습니다.`;
      } else {
        const total = stats.present + stats.absent;
        const rate =
          total > 0 ? Math.round((stats.present / total) * 100) : null;
        base[id].attendance =
          `${from} ~ ${to} 기간 동안 기록된 수업 ${total}회 중 ` +
          `출석 ${stats.present}회, 결석 ${stats.absent}회` +
          (rate != null ? ` (출석률 약 ${rate}%)` : "") +
          "입니다.";
      }
    }
  } catch {
    // ignore attendance error for now
  }

  // 성적 요약
  try {
    const exams: Exam[] = await listExams(courseId);
    const ranged = exams.filter((exam) => {
      if (!exam.examDate) return true; // 시험 날짜가 없으면 기간에 관계없이 포함
      return exam.examDate >= from && exam.examDate <= to;
    });
    const targetExams = ranged.length > 0 ? ranged : exams;
    if (targetExams.length > 0) {
      const resultsByStudent: Record<number, { scores: number[] }> = {};
      for (const exam of targetExams) {
        const results: ExamResult[] = await listExamResults(courseId, exam.id);
        for (const row of results) {
          if (!studentSet.has(row.studentId)) continue;
          if (row.score == null) continue;
          const total = row.outOf ?? 100;
          const percent = total > 0 ? (row.score / total) * 100 : row.score;
          if (!resultsByStudent[row.studentId]) {
            resultsByStudent[row.studentId] = { scores: [] };
          }
          resultsByStudent[row.studentId].scores.push(percent);
        }
      }
      for (const id of studentIds) {
        const stats = resultsByStudent[id];
        if (!stats || stats.scores.length === 0) {
          base[id].grades =
            `${from} ~ ${to} 기간 동안 등록된 성적 데이터가 없습니다.`;
        } else {
          const count = stats.scores.length;
          const avg =
            stats.scores.reduce((sum, v) => sum + v, 0) / Math.max(count, 1);
          const max = Math.max(...stats.scores);
          base[id].grades =
            `${from} ~ ${to} 기간 동안 평가 ${count}회에 참여했습니다. ` +
            `평균 점수는 약 ${Math.round(avg)}점이며, 최고 점수는 약 ${Math.round(
              max,
            )}점입니다.`;
        }
      }
    } else {
      // 시험이 전혀 없을 때도 기본 문구 제공
      for (const id of studentIds) {
        base[id].grades =
          `${from} ~ ${to} 기간 동안 등록된 성적 데이터가 없습니다.`;
      }
    }
  } catch {
    // ignore grades error
  }

  // 수업 내용 요약 (코스 단위로 동일)
  try {
    const records: CourseRecord[] = await listCourseRecords(courseId, {
      from,
      to,
    });
    if (records.length > 0) {
      const topics = Array.from(
        new Set(
          records
            .map((r) => (r.topic || "").trim())
            .filter((value) => value.length > 0),
        ),
      ).slice(0, 6);
      const count = records.length;
      const baseText =
        `${from} ~ ${to} 기간 동안 총 ${count}회의 수업 기록이 있습니다.` +
        (topics.length
          ? ` 주요 주제: ${topics.join(", ")}.`
          : " (기록된 주제명이 없습니다.)");
      for (const id of studentIds) {
        base[id].lessons = baseText;
      }
    }
  } catch {
    // ignore lessons error
  }

  return base;
}

async function buildAutoDetails(
  courseId: number,
  studentIds: number[],
  from: string,
  to: string,
): Promise<Record<number, AutoDetails>> {
  const studentSet = new Set(studentIds);
  const details: Record<number, AutoDetails> = {};
  studentIds.forEach((id) => {
    details[id] = {};
  });

  // 출석 상세
  try {
    const daily: AttendanceDailySummary[] = await fetchAttendanceDailyRange(from, to);
    const byStudent: Record<number, AttendancePoint[]> = {};
    for (const day of daily) {
      const entries = day.attendances ?? [];
      for (const row of entries) {
        if (row.studentId != null && studentSet.has(row.studentId)) {
          const key = row.studentId;
          if (!byStudent[key]) byStudent[key] = [];
          byStudent[key].push({ date: day.date, present: row.present });
        }
      }
    }
    for (const id of studentIds) {
      if (byStudent[id]) {
        details[id].attendance = byStudent[id].sort((a, b) => a.date.localeCompare(b.date));
      }
    }
  } catch {
    // ignore
  }

  // 성적 상세
  try {
    const exams: Exam[] = await listExams(courseId);
    const ranged = exams.filter((exam) => {
      if (!exam.examDate) return true;
      return exam.examDate >= from && exam.examDate <= to;
    });
    const targetExams = ranged.length > 0 ? ranged : exams;
    if (targetExams.length > 0) {
      const gradesMap: Record<number, GradePoint[]> = {};
      for (const exam of targetExams) {
        const results: ExamResult[] = await listExamResults(courseId, exam.id);
        for (const row of results) {
          if (!studentSet.has(row.studentId)) continue;
          if (row.score == null) continue;
          const total = row.outOf ?? 100;
          const percent = total > 0 ? (row.score / total) * 100 : row.score;
          if (!gradesMap[row.studentId]) gradesMap[row.studentId] = [];
          gradesMap[row.studentId].push({
            examId: exam.id,
            title: exam.title,
            date: exam.examDate,
            percent,
          });
        }
      }
      for (const id of studentIds) {
        if (gradesMap[id]) {
          details[id].grades = gradesMap[id].sort((a, b) => {
            if (a.date && b.date) return a.date.localeCompare(b.date);
            return 0;
          });
        }
      }
    }
  } catch {
    // ignore
  }

  // 수업 내용 상세 (코스 단위, 학생 공통)
  try {
    const records: CourseRecord[] = await listCourseRecords(courseId, { from, to });
    if (records.length > 0) {
      const lessons: LessonPoint[] = records
        .slice()
        .sort((a, b) => a.recordDate.localeCompare(b.recordDate))
        .map((record) => ({
          date: record.recordDate,
          topic: record.topic || record.content || record.notes || null,
        }));
      for (const id of studentIds) {
        details[id].lessons = lessons;
      }
    }
  } catch {
    // ignore
  }

  return details;
}

function defaultTo(): string {
  return formatYmd(new Date());
}

function defaultFrom(): string {
  const d = new Date();
  d.setDate(d.getDate() - 29);
  return formatYmd(d);
}

function formatYmd(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

async function fetchAttendanceDailyRange(from: string, to: string): Promise<AttendanceDailySummary[]> {
  if (!from || !to) return [];
  const start = new Date(`${from}T00:00:00`);
  const end = new Date(`${to}T00:00:00`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start > end) {
    return [];
  }
  const days: AttendanceDailySummary[] = [];
  const cursor = new Date(start.getTime());
  while (cursor <= end) {
    const y = cursor.getFullYear();
    const m = String(cursor.getMonth() + 1).padStart(2, "0");
    const d = String(cursor.getDate()).padStart(2, "0");
    const ymd = `${y}-${m}-${d}`;
    try {
      const res = await getDailyAttendance({ from: ymd, to: ymd });
      if (Array.isArray(res) && res.length > 0) {
        days.push(
          ...res.map((day) => ({
            ...day,
            attendances: day.attendances ?? [],
          })),
        );
      }
    } catch {
      // ignore per-day errors
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}
