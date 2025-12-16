import { PageHeader, SectionCard, PrimaryButton, GhostButtonSmall, EmptyState } from "@/components/common/UI";
import BackButton from "@/components/common/BackButton";
import { listCourses, type Course, listCourseStudents, listCourseRecords, type CourseRecord } from "@/api/courses";
import { getDailyAttendance, type AttendanceDailySummary } from "@/api/attendance";
import { listExams, listExamResults, type Exam, type ExamResult } from "@/api/exams";
import type { Student, StudentReport } from "@/api/students";
import { renderStudentReport } from "@/api/students";
import { readableError } from "@/lib/errors";
import { useToast } from "@/components/common/Toast";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useMyAcademyPage } from "@/features/myAcademy/hooks/useMyAcademyPage";
import { routes, paths } from "@/routes";
import { numericFromLetter } from "@/features/courseRecord/utils";

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

type SaveQueueItem = {
  studentId: number;
  resolve: (reportId: number) => void;
  reject: (error: Error) => void;
};

export default function Reports() {
  const academyState = useMyAcademyPage();
  const navigate = useNavigate();
  const reportsEnabled = academyState.academy.paymentEnabled;
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
  const { show, warning, error: showError, success: showSuccess } = useToast();
  const [autoDetails, setAutoDetails] = useState<Record<number, AutoDetails>>({});
  const [savingReport, setSavingReport] = useState(false);
  const [notifying, setNotifying] = useState(false);
  const [progressMap, setProgressMap] = useState<Record<number, { saved?: boolean; notified?: boolean; reportId?: number }>>({});
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null);
  const [showAttendanceSection, setShowAttendanceSection] = useState(true);
  const [showGradesSection, setShowGradesSection] = useState(true);
  const [showLessonsSection, setShowLessonsSection] = useState(true);
  const [showFeedbackSection, setShowFeedbackSection] = useState(true);
  const [previewSelectedIds, setPreviewSelectedIds] = useState<number[]>([]);
  const [saveQueue, setSaveQueue] = useState<SaveQueueItem[]>([]);
  const hasProgress = useMemo(() => {
    return Object.keys(drafts).length > 0 || selectedStudentIds.length > 0 || mode === "edit";
  }, [drafts, selectedStudentIds.length, mode]);
  const progressRef = useRef(false);
  const progressMapRef = useRef(progressMap);

  useEffect(() => {
    progressMapRef.current = progressMap;
  }, [progressMap]);

  useEffect(() => {
    progressRef.current = hasProgress;
  }, [hasProgress]);

  useEffect(() => {
    if (!reportsEnabled) return;
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
  }, [selectedCourseId, reportsEnabled]);

  useEffect(() => {
    if (!reportsEnabled) {
      setStudents([]);
      setSelectedStudentIds([]);
      setSelectAll(false);
      setStudentsError(null);
      return;
    }
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
  }, [selectedCourseId, reportsEnabled]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!progressRef.current) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  useEffect(() => {
    if (!hasProgress) return;

    const handlePopState = (event: PopStateEvent) => {
      if (!progressRef.current) return;
      event.preventDefault?.();
      const currentUrl = window.location.href;
      window.history.pushState(null, "", currentUrl);
      setShowLeaveModal(true);
      setPendingNavigation(() => () => {
        progressRef.current = false;
        window.history.back();
      });
    };

    const handleAnchorClick = (event: MouseEvent) => {
      if (!progressRef.current) return;
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest?.("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || anchor.target === "_blank") return;
      const isExternal = href.startsWith("http") && !href.startsWith(window.location.origin);
      event.preventDefault();
      setShowLeaveModal(true);
      setPendingNavigation(() => () => {
        progressRef.current = false;
        if (isExternal) {
          window.location.href = href;
        } else {
          navigate(href);
        }
      });
    };

    window.addEventListener("popstate", handlePopState);
    document.addEventListener("click", handleAnchorClick, true);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      document.removeEventListener("click", handleAnchorClick, true);
    };
  }, [hasProgress, navigate]);


  const filteredCourses = useMemo(() => {
    const q = courseQuery.trim();
    if (!q) return courses;
    return courses.filter((c) => c.title.toLowerCase().includes(q.toLowerCase()));
  }, [courseQuery, courses]);

  const selectedStudents = useMemo(
    () => students.filter((s) => selectedStudentIds.includes(s.id)),
    [students, selectedStudentIds],
  );

  useEffect(() => {
    setPreviewSelectedIds((prev) => prev.filter((id) => selectedStudentIds.includes(id)));
  }, [selectedStudentIds]);

  useEffect(() => {
    if (mode === "select") {
      setPreviewSelectedIds([]);
    }
  }, [mode]);

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

  const handleTogglePreviewSelectAll = () => {
    if (previewSelectedIds.length === selectedStudentIds.length) {
      setPreviewSelectedIds([]);
    } else {
      setPreviewSelectedIds([...selectedStudentIds]);
    }
  };

  const handleTogglePreviewSelection = (id: number) => {
    setPreviewSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id],
    );
  };

  const handleSelectPreviewStudent = (id: number) => {
    setActiveStudentId(id);
    setPreviewSelectedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const enqueueSaveRequest = (studentId: number) =>
    new Promise<number>((resolve, reject) => {
      setSaveQueue((prev) => [...prev, { studentId, resolve, reject }]);
    });

  const ensureReportsSaved = async (ids: number[]): Promise<Record<number, number>> => {
    const saved: Record<number, number> = {};
    for (const id of ids) {
      const existing = progressMapRef.current[id]?.reportId;
      if (existing) {
        saved[id] = existing;
        continue;
      }
      const reportId = await enqueueSaveRequest(id);
      saved[id] = reportId;
    }
    return saved;
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
    show("선택한 학생의 보고서를 생성 중입니다.", { kind: "info", ttlMs: 5000 });
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
      setPreviewSelectedIds(studentIds);
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
  const activeIndex = activeStudent ? selectedStudents.findIndex((s) => s.id === activeStudent.id) : -1;
  const showStudentNav = selectedStudents.length > 1;
  const canGoPrev = activeIndex > 0;
  const canGoNext = activeIndex >= 0 && activeIndex < selectedStudents.length - 1;
  const previewAllSelected =
    selectedStudents.length > 0 && previewSelectedIds.length === selectedStudents.length;

  const goToStudentAt = (index: number) => {
    const next = selectedStudents[index];
    if (next) setActiveStudentId(next.id);
  };

  const handlePrevStudent = () => {
    if (!selectedStudents.length) return;
    if (activeIndex === -1) {
      goToStudentAt(0);
      return;
    }
    if (activeIndex <= 0) return;
    goToStudentAt(activeIndex - 1);
  };

  const handleNextStudent = () => {
    if (!selectedStudents.length) return;
    if (activeIndex === -1) {
      goToStudentAt(0);
      return;
    }
    if (activeIndex >= selectedStudents.length - 1) return;
    goToStudentAt(activeIndex + 1);
  };

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

  const handleBackNavigate = () => {
    if (mode === "edit") {
      setMode("select");
      setActiveStudentId(null);
      return;
    }
    navigate(-1);
  };

  const handleSaveReport = useCallback(
    async (options?: { silent?: boolean }): Promise<StudentReport | null> => {
      if (!activeStudent) {
        warning("학생을 선택한 후 저장하세요.");
        return null;
      }
      const node = document.getElementById("report-print-root");
      if (!node) {
        showError("보고서 미리보기가 준비되지 않았습니다.");
        return null;
      }
      setSavingReport(true);
      try {
        const html = buildReportHtmlDocument(node, selectedCourse?.title, activeStudent.name);
        const filename = buildReportFilename(selectedCourse?.title, activeStudent.name);
        const saved = await renderStudentReport(activeStudent.id, {
          html,
          filename,
          format: "pdf",
          courseId: selectedCourseId,
          periodFrom: from,
          periodTo: to,
          width: Math.ceil(node.getBoundingClientRect().width || 900),
          height: Math.ceil(node.scrollHeight || 1400),
        });
        setProgressMap((prev) => ({
          ...prev,
          [activeStudent.id]: {
            ...(prev[activeStudent.id] ?? {}),
            saved: true,
            reportId: saved.id,
          },
        }));
        if (!options?.silent) {
          showSuccess("학생 상세 > 보고서 탭에 저장했습니다.");
        }
        return saved;
      } catch (error) {
        console.error(error);
        showError("보고서를 저장하지 못했습니다. 다시 시도해주세요.");
        return null;
      } finally {
        setSavingReport(false);
      }
    },
    [
      activeStudent,
      from,
      selectedCourse?.title,
      selectedCourseId,
      showError,
      showSuccess,
      to,
      warning,
    ],
  );

  useEffect(() => {
    if (!saveQueue.length) return;
    const current = saveQueue[0];
    if (activeStudentId !== current.studentId) {
      setActiveStudentId(current.studentId);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const saved = await handleSaveReport({ silent: true });
        if (!saved) {
          throw new Error("보고서를 저장하지 못했습니다.");
        }
        if (!cancelled) {
          current.resolve(saved.id);
        }
      } catch (error) {
        if (!cancelled) {
          current.reject(error instanceof Error ? error : new Error("보고서를 저장하지 못했습니다."));
        }
      } finally {
        if (!cancelled) {
          setSaveQueue((prev) => prev.slice(1));
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [saveQueue, activeStudentId, handleSaveReport]);

  const handleSaveAndNotify = async (overrideIds?: number[]) => {
    const targetIds =
      overrideIds || (previewSelectedIds.length > 0 ? previewSelectedIds : selectedStudentIds);
    if (!targetIds.length) {
      warning("알림톡을 전송할 학생을 선택하세요.");
      return;
    }
    setNotifying(true);
    const previousActiveId = activeStudentId;
    try {
      const savedReports = await ensureReportsSaved(targetIds);
      const selectionPairs = targetIds
        .map((id) => {
          const reportId = savedReports[id] ?? progressMapRef.current[id]?.reportId;
          return reportId ? { studentId: id, reportId } : null;
        })
        .filter((pair): pair is { studentId: number; reportId: number } => pair != null);
      if (!selectionPairs.length) {
        showError("저장된 보고서가 있는 학생이 없습니다.");
        return;
      }
      navigate(
        paths.reports.kakaoConfirm({
          selection: selectionPairs,
          courseName: selectedCourse?.title,
        }),
      );
    } catch (error) {
      console.error(error);
      showError(readableError(error, "보고서를 저장하지 못했습니다."));
    } finally {
      setNotifying(false);
      setActiveStudentId(previousActiveId ?? targetIds[0] ?? null);
    }
  };

  const handleConfirmLeave = () => {
    setShowLeaveModal(false);
    if (pendingNavigation) {
      progressRef.current = false;
      pendingNavigation();
      setPendingNavigation(null);
    }
  };

  const handleCancelLeave = () => {
    setShowLeaveModal(false);
    setPendingNavigation(null);
  };

  if (!reportsEnabled) {
    return (
      <Viewport>
        <HeaderWrap>
          <PageHeader>
            <div>
              <h2>보고서 미리보기</h2>
              <p>현재 요금제로 이용할 수 없습니다.</p>
            </div>
          </PageHeader>
        </HeaderWrap>
        <SectionCard>
          <EmptyState>
            <div>보고서 기능은 결제 기능이 포함된 요금제에서 이용할 수 있습니다.</div>
            <PrimaryButton type="button" onClick={() => navigate(routes.myAcademyPlan)}>
              요금제 변경하기
            </PrimaryButton>
          </EmptyState>
        </SectionCard>
      </Viewport>
    );
  }

  return (
    <Viewport>
      <style>
        {`
          @page {
            size: A4;
            margin: 0;
          }
          @media print {
            html, body {
              width: 210mm;
              height: 297mm;
              margin: 0 !important;
              padding: 0 !important;
              background: #fff;
            }
            body * {
              visibility: hidden;
            }
            #report-print-root, #report-print-root * {
              visibility: visible;
            }
            #report-print-root {
              position: absolute;
              left: 0;
              top: 0;
              width: 210mm !important;
              min-height: 297mm !important;
              margin: 0 !important;
              padding: 10mm !important;
              box-sizing: border-box !important;
              border: none !important;
              box-shadow: none !important;
              overflow: visible !important;
              background: white !important;
            }
            /* Allow sections to break, but keep items intact */
            section {
              break-inside: auto;
              page-break-inside: auto;
            }
            li, .page-break-avoid, tr {
              break-inside: avoid;
              page-break-inside: avoid;
            }
            /* Prevent headers from being left alone at bottom */
            h1, h2, h3, h4, h5, h6 {
              break-after: avoid;
              page-break-after: avoid;
            }
            ::-webkit-scrollbar {
              display: none;
            }
          }
        `}
      </style>
      <HeaderWrap>
        <PageHeader>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <BackButton label="뒤로" onClick={handleBackNavigate} />
            <div>
              <h2 style={{ marginBottom: 6 }}>{mode === "select" ? "보고서" : "보고서 미리보기"}</h2>
              <p style={{ margin: 0 }}>
                {mode === "select"
                  ? "좌측에서 수업을 선택하고, 우측에서 보고서를 생성할 학생을 선택하세요."
                  : "좌측에서 학생을 선택해 우측에서 보고서 내용을 미리보고 수정하세요."}
              </p>
            </div>
          </div>
          <HeaderActions>{/* no extra actions for now */}</HeaderActions>
        </PageHeader>
      </HeaderWrap>

      {mode === "select" ? (
        <ContentGrid>
          <LeftColumn>
            <SectionCard>
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
            <SectionCard>
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
                  <QuickButtonGroup>
                    <QuickButton
                      type="button"
                      onClick={() => {
                        const now = new Date();
                        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
                        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                        setFrom(formatYmd(firstDay));
                        setTo(formatYmd(lastDay));
                      }}
                    >
                      이번 달
                    </QuickButton>
                    <QuickButton
                      type="button"
                      onClick={() => {
                        const now = new Date();
                        const firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                        const lastDay = new Date(now.getFullYear(), now.getMonth(), 0);
                        setFrom(formatYmd(firstDay));
                        setTo(formatYmd(lastDay));
                      }}
                    >
                      지난달
                    </QuickButton>
                    <QuickButton
                      type="button"
                      onClick={() => {
                        const now = new Date();
                        const start = new Date(now);
                        start.setDate(now.getDate() - 30);
                        setFrom(formatYmd(start));
                        setTo(formatYmd(now));
                      }}
                    >
                      최근 30일
                    </QuickButton>
                  </QuickButtonGroup>
                </PeriodInputs>
              </PeriodRow>
              {studentsLoading && <HintText>학생 목록을 불러오는 중입니다…</HintText>}
              {studentsError && <ErrorText>{studentsError}</ErrorText>}
              <StudentsListWrap>
                <StudentsList role="list" aria-label="학생 목록">
                  {students.map((student) => {
                    const checked = selectedStudentIds.includes(student.id);
                    const progress = progressMap[student.id];
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
                        <div className="badges">
                          {progress?.notified ? <StatusBadge data-variant="kakao">알림톡</StatusBadge> : null}
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
            <SectionCard>
              <LeftHeader>
                <div>
                  <LeftTitleRow>
                    <LeftTitle>선택한 학생</LeftTitle>
                    <GhostButtonSmall
                      type="button"
                      onClick={handleTogglePreviewSelectAll}
                      disabled={!selectedStudents.length}
                    >
                      {previewAllSelected ? "전체 해제" : "전체 선택"}
                    </GhostButtonSmall>
                  </LeftTitleRow>
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
                    const isSelected = previewSelectedIds.includes(student.id);
                    const progress = progressMap[student.id];
                    return (
                      <StudentRow
                        key={student.id}
                        role="listitem"
                        data-selected={isActive || undefined}
                        onClick={() => handleSelectPreviewStudent(student.id)}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleTogglePreviewSelection(student.id)}
                          onClick={(event) => event.stopPropagation()}
                        />
                        <div className="info">
                          <div className="name">{student.name}</div>
                          {student.code && <div className="meta">{student.code}</div>}
                        </div>
                        <div className="badges">
                          {progress?.notified ? <StatusBadge data-variant="kakao">알림톡</StatusBadge> : null}
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
            <SectionCard>
              <RightHeader>
                <RightHeaderInfo>
                  <RightTitleRow>
                    <RightTitle>보고서 미리보기 / 수정</RightTitle>
                    {showStudentNav ? (
                      <NavButtons>
                        <NavButton
                          type="button"
                          onClick={handlePrevStudent}
                          disabled={!canGoPrev}
                          aria-label="이전 학생으로 이동"
                        >
                          ‹
                        </NavButton>
                        <NavButton
                          type="button"
                          onClick={handleNextStudent}
                          disabled={!canGoNext}
                          aria-label="다음 학생으로 이동"
                        >
                          ›
                        </NavButton>
                      </NavButtons>
                    ) : null}
                  </RightTitleRow>
                  <RightSubtitle>
                    {activeStudent && selectedCourse
                      ? `${selectedCourse.title} · ${activeStudent.name} 학생의 보고서 초안입니다.`
                      : "학생을 선택하면 보고서를 미리보고 수정할 수 있습니다."}
                  </RightSubtitle>
                </RightHeaderInfo>
                <RightActions>
                  <PrimaryButton
                    type="button"
                    as="button"
                    onClick={() => void handleSaveReport()}
                    data-print-hide="true"
                    disabled={!activeStudent || savingReport || notifying}
                  >
                    {savingReport ? "저장 중..." : "보고서 저장 (PDF)"}
                  </PrimaryButton>
                  <KakaoButton
                    type="button"
                    as="button"
                    onClick={() => void handleSaveAndNotify()}
                    data-print-hide="true"
                    disabled={!activeStudent || savingReport || notifying}
                  >
                    <img src="/logo/kakaotalk_sharing_btn_small.png" alt="카카오톡" width="20" height="20" />
                    {notifying ? "저장 중..." : "저장 후 알림톡 발송"}
                  </KakaoButton>
                  <OutlineButton
                    type="button"
                    onClick={() => window.print()}
                    data-print-hide="true"
                    disabled={!activeStudent}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ marginRight: 6 }}
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    PDF로 저장/인쇄
                  </OutlineButton>
                </RightActions>
              </RightHeader>
          <HintText data-print-hide="true" style={{ marginTop: -8 }}>
            보고서를 저장하면 학생 상세 &gt; 보고서 탭에서 다시 열람/다운로드할 수 있습니다.
          </HintText>
          {autoLoading && (
            <InlineInfoBar data-variant="info">
              출석·성적·수업 내용을 불러오는 중입니다. 잠시만 기다려 주세요…
            </InlineInfoBar>
          )}
          {savingReport && (
            <InlineInfoBar data-variant="progress">
              보고서를 생성하는 중입니다. 브라우저를 닫거나 이동하지 말아 주세요.
            </InlineInfoBar>
          )}
          {autoError && <ErrorText>{autoError}</ErrorText>}

              {activeStudent ? (
                <ReportArea>
                  <SectionToggleRow>
                    <SectionToggleLabel>포함할 항목</SectionToggleLabel>
                    <ToggleChip
                      type="button"
                      data-active={showAttendanceSection || undefined}
                      onClick={() => setShowAttendanceSection((v) => !v)}
                    >
                      {showAttendanceSection ? "−" : "+"} 출석
                    </ToggleChip>
                    <ToggleChip
                      type="button"
                      data-active={showGradesSection || undefined}
                      onClick={() => setShowGradesSection((v) => !v)}
                    >
                      {showGradesSection ? "−" : "+"} 성적
                    </ToggleChip>
                    <ToggleChip
                      type="button"
                      data-active={showLessonsSection || undefined}
                      onClick={() => setShowLessonsSection((v) => !v)}
                    >
                      {showLessonsSection ? "−" : "+"} 수업 내용
                    </ToggleChip>
                    <ToggleChip
                      type="button"
                      data-active={showFeedbackSection || undefined}
                      onClick={() => setShowFeedbackSection((v) => !v)}
                    >
                      {showFeedbackSection ? "−" : "+"} 피드백
                    </ToggleChip>
                  </SectionToggleRow>

                  <ReportPaper>
                    <ReportPaperInner id="report-print-root">
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
                              <dd>
                                {activeStudent.name}
                                {activeStudent.birthDate && (
                                  <span style={{ fontWeight: 400, color: "#6b7280", marginLeft: 4 }}>
                                    ({activeStudent.birthDate})
                                  </span>
                                )}
                              </dd>
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
                      {/* Student Info Section Removed for brevity */}

                      {showAttendanceSection && (
                        <ReportSection>
                          <ReportLabel>출석 내역</ReportLabel>
                          {activeDetail?.attendance && activeDetail.attendance.length > 0 ? (
                            <AttendanceList>
                              {activeDetail.attendance.slice(0, 30).map((row) => (
                                <li key={`${row.date}-${row.present ? "P" : "A"}`}>
                                  <div className="top">
                                    <span className="date">{row.date}</span>
                                    <span className={`status ${row.present ? "present" : "absent"}`}>
                                      {row.present ? "출석" : "결석"}
                                    </span>
                                  </div>
                                  {!row.present && row.reason && (
                                    <span className="reason">{row.reason}</span>
                                  )}
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
                      )}

                      {showGradesSection && (
                        <ReportSection>
                          <ReportLabel>성적 내역</ReportLabel>
                          {activeDetail?.grades && activeDetail.grades.length > 0 ? (
                            <GradesChartContainer>
                            {(() => {
                              const sortedGrades = [...activeDetail.grades].sort((a, b) =>
                                (a.date || "").localeCompare(b.date || "")
                              );
                              
                              if (sortedGrades.length === 0) return null;

                              // SVG ViewBox dimensions
                              const width = 600;
                              const height = 200;
                              const padding = { top: 30, right: 30, bottom: 40, left: 40 };
                              const graphWidth = width - padding.left - padding.right;
                              const graphHeight = height - padding.top - padding.bottom;

                              // Determine grading mode: pure letter vs numeric/percent
                              const hasLetter = sortedGrades.some((g) => g.level && g.level.trim().length > 0);
                              const hasNumericOnly = sortedGrades.some((g) => !g.level);
                              const letterMode = hasLetter && !hasNumericOnly;

                              const letterTicks = ["F", "E", "D", "C", "B", "A"];
                              const numericTicks = [0, 25, 50, 75, 100];
                              const ticks = letterMode ? letterTicks : numericTicks;

                              const normFromGrade = (item: GradePoint): number => {
                                if (!letterMode) {
                                  return Math.max(0, Math.min(1, item.percent / 100));
                                }
                                const raw = (item.level || "").trim();
                                if (!raw) {
                                  return Math.max(0, Math.min(1, item.percent / 100));
                                }
                                const letter = raw[0]?.toUpperCase();
                                const idx = letterTicks.indexOf(letter);
                                if (idx < 0) {
                                  return Math.max(0, Math.min(1, item.percent / 100));
                                }
                                const maxIdx = letterTicks.length - 1;
                                return maxIdx > 0 ? idx / maxIdx : 0;
                              };

                              // Calculate coordinates
                              const points = sortedGrades.map((item, index) => {
                                const x =
                                  sortedGrades.length === 1
                                    ? graphWidth / 2
                                    : (index / (sortedGrades.length - 1)) * graphWidth;
                                const norm = normFromGrade(item);
                                const y = graphHeight - norm * graphHeight;
                                return { x: x + padding.left, y: y + padding.top, item };
                              });

                              const pathData = points
                                .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
                                .join(" ");

                              return (
                                <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "auto", overflow: "visible" }}>
                                  {/* Grid lines */}
                                  {ticks.map((tick, index) => {
                                    const norm = letterMode
                                      ? (index / Math.max(1, ticks.length - 1))
                                      : ((tick as number) / 100);
                                    const y = padding.top + graphHeight - norm * graphHeight;
                                    return (
                                      <g key={tick}>
                                        <line
                                          x1={padding.left}
                                          y1={y}
                                          x2={width - padding.right}
                                          y2={y}
                                          stroke="#e5e7eb"
                                          strokeWidth="1"
                                          strokeDasharray="4 4"
                                        />
                                        <text
                                          x={padding.left - 10}
                                          y={y + 4}
                                          textAnchor="end"
                                          fontSize="11"
                                          fill="#9ca3af"
                                        >
                                          {letterMode ? (tick as string) : tick}
                                        </text>
                                      </g>
                                    );
                                  })}

                                  {/* Line path */}
                                  {sortedGrades.length > 1 && (
                                    <path d={pathData} fill="none" stroke="#4f46e5" strokeWidth="2" />
                                  )}

                                  {/* Data points */}
                                  {points.map((p, i) => (
                                    <g key={i}>
                                      <circle cx={p.x} cy={p.y} r="4" fill="#ffffff" stroke="#4f46e5" strokeWidth="2" />
                                      {/* Score label */}
                                      <text
                                        x={p.x}
                                        y={p.y - 12}
                                        textAnchor="middle"
                                        fontSize="12"
                                        fontWeight="bold"
                                        fill="#111827"
                                      >
                                        {p.item.level ? p.item.level : `${Math.round(p.item.percent)}점`}
                                      </text>
                                      {/* Date/Title label */}
                                      <text
                                        x={p.x}
                                        y={height - 10}
                                        textAnchor="middle"
                                        fontSize="11"
                                        fill="#4b5563"
                                      >
                                        {p.item.date ? p.item.date.slice(5) : "-"}
                                      </text>
                                      <text
                                        x={p.x}
                                        y={height + 5}
                                        textAnchor="middle"
                                        fontSize="10"
                                        fill="#9ca3af"
                                        style={{ display: "none" }}
                                      >
                                        {p.item.title}
                                      </text>
                                    </g>
                                  ))}
                                </svg>
                              );
                            })()}
                            </GradesChartContainer>

                          ) : (
                            <EmptyHint>선택한 기간에 등록된 성적 데이터가 없습니다.</EmptyHint>
                          )}
                        </ReportSection>
                      )}

                      {showLessonsSection && (
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
                      )}

                      {showFeedbackSection && (
                        <ReportSection>
                          <ReportLabel>선생님 피드백</ReportLabel>
                          <ReportTextarea
                            placeholder="학생의 전반적인 학습 태도, 강점/개선점, 향후 학습 제안 등을 작성하세요."
                            value={activeDraft.comment}
                            onChange={(event) => handleChangeDraft("comment", event.target.value)}
                          />
                        </ReportSection>
                      )}
                    </ReportLayout>
                  </ReportPaperInner>
                </ReportPaper>
                </ReportArea>
              ) : (
                <EmptyRow>좌측에서 학생을 선택하면 보고서 내용을 작성할 수 있습니다.</EmptyRow>
              )}
            </SectionCard>
          </RightColumn>
        </ContentGrid>
      )}

      <ConfirmDialog
        open={showLeaveModal}
        title="페이지를 나가시겠습니까?"
        message={
          <>
            이 페이지를 나가면 작성 중인 보고서 내용이 사라집니다.
            <br />
            정말 이동하시겠습니까?
          </>
        }
        onCancel={handleCancelLeave}
        onConfirm={handleConfirmLeave}
        confirmLabel="이동하기"
        cancelLabel="취소"
      />
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
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 48px);
  overflow: visible;

  @media print {
    min-height: auto;
    overflow: visible;
  }
`;

const HeaderWrap = styled.div`
  padding: 0 ${(p) => p.theme.spacing.xs};
  display: grid;
  gap: ${(p) => p.theme.spacing.sm};
  margin-bottom: 24px;
`;

const HeaderActions = styled.div`
  display: inline-flex;
  gap: ${(p) => p.theme.spacing.sm};
  flex-wrap: wrap;
  justify-content: flex-end;
`;

const SectionToggleLabel = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  white-space: nowrap;
  margin-right: 4px;
`;

const SectionToggleRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 16px;
  margin-bottom: 8px;
  border-bottom: 1px solid ${(p) => p.theme.colors.borderMuted};
  
  @media print {
    display: none;
  }
`;

const ToggleChip = styled.button`
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #6b7280;
  &[data-active='true'] {
    border-color: #4f46e5;
    background: #eef2ff;
    color: #4338ca;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr;
  flex: 1;
  min-height: auto;
  overflow: visible;
  @media (min-width: 1120px) {
    grid-template-columns: 360px 1fr;
  }

  @media print {
    display: block;
    overflow: visible;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  min-height: auto;
  overflow: visible;

  @media print {
    display: none;
  }
`;

const RightColumn = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.xl};
  min-height: auto;

  @media print {
    display: block;
  }
`;

const LeftHeader = styled.div`
  margin-bottom: ${(p) => p.theme.spacing.sm};
`;

const LeftTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LeftTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.colors.text};
`;

const LeftSubtitle = styled.p`
  margin: 6px 0 14px;
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
  height: 600px;
  overflow: hidden;
`;

const CourseList = styled.div`
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: stretch;
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
  justify-content: space-between;
  align-items: flex-start;
  gap: ${(p) => p.theme.spacing.md};
  margin-bottom: ${(p) => p.theme.spacing.sm};
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
  @media print {
    display: none;
  }
`;

const RightHeaderInfo = styled.div`
  display: grid;
  gap: 6px;
`;

const RightTitleRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
`;

const RightTitle = styled.h3`
  margin: 0 0 6px;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.colors.text};
`;

const RightSubtitle = styled.p`
  margin: 0;
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const NavButtons = styled.div`
  display: inline-flex;
  gap: 4px;
`;

const NavButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: #ffffff;
  font-size: 18px;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primarySurface};
    color: ${({ theme }) => theme.colors.primary};
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const RightActions = styled.div`
  display: inline-flex;
  gap: ${(p) => p.theme.spacing.sm};
  flex-wrap: wrap;
  justify-content: flex-end;

  @media print {
    display: none;
  }
`;

const StudentsListWrap = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${(p) => p.theme.radii.md};
  height: 600px;
  overflow: hidden;
`;

const StudentsList = styled.div`
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const InlineInfoBar = styled.div`
  margin: ${(p) => p.theme.spacing.xs} 0;
  padding: ${(p) => p.theme.spacing.sm} ${(p) => p.theme.spacing.md};
  border-radius: ${(p) => p.theme.radii.md};
  font-size: ${(p) => p.theme.font.size.sm};
  display: flex;
  align-items: center;
  gap: 8px;
  &[data-variant="info"] {
    background: #eef2ff;
    color: #3730a3;
    border: 1px solid #c7d2fe;
  }
  &[data-variant="progress"] {
    background: #ecfdf5;
    color: #065f46;
    border: 1px solid #a7f3d0;
  }
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
  .badges {
    margin-left: auto;
    display: inline-flex;
    gap: 6px;
    align-items: center;
  }
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  color: #3c1e1e;
  background: #fee500;
  border: 1px solid rgba(0, 0, 0, 0.08);
  &[data-variant="kakao"] {
    color: #3c1e1e;
    background: #fee500;
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

const QuickButtonGroup = styled.div`
  display: flex;
  gap: 6px;
  margin-left: 8px;
`;

const QuickButton = styled.button`
  padding: 4px 8px;
  font-size: 12px;
  color: #4b5563;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background: #e5e7eb;
    color: #111827;
  }
`;

const ReportPaper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: ${(p) => p.theme.spacing.xl};
  background: #e2e8f0;
  border-radius: ${(p) => p.theme.radii.xl};
  overflow: visible;
  @media print {
    display: block;
    padding: 0;
    margin: 0;
    background: transparent;
    border-radius: 0;
    width: 100%;
    height: auto;
  }
`;

const ReportArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing.sm};
`;

const ReportPaperInner = styled.div.attrs({ className: "report-paper-inner" })`
  width: 100%;
  max-width: 794px; /* A4 width approx */
  background: #ffffff;
  box-shadow: 0 12px 30px -8px rgba(15, 23, 42, 0.28);
  border: 1px solid #e2e8f0;
  padding: 48px;
  overflow-y: visible;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  gap: 20px;
  @media (max-width: 640px) {
    padding: 24px;
  }
  @media print {
    box-shadow: none;
    border: none;
    height: auto;
    overflow: visible;
    padding: 0;
    margin: 0;
    max-width: 100%;
    width: 100%;
  }
`;

const ReportPaperHeader = styled.div.attrs({ className: "report-paper-header" })`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 2px solid #111827;
  padding-bottom: 20px;
  margin-bottom: 28px;
  flex-wrap: wrap;
  gap: 20px;
`;

const PaperTitle = styled.h1`
  margin: 0;
  font-size: 26px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.02em;
`;

const PaperSubtitle = styled.div`
  margin-top: 8px;
  font-size: 15px;
  color: #4b5563;
  font-weight: 500;
`;

const PaperMeta = styled.div.attrs({ className: "paper-meta" })`
  text-align: right;
  dl {
    margin: 0;
    display: grid;
    gap: 8px;
    justify-items: end;
  }
  div {
    display: flex;
    gap: 10px;
    align-items: center;
  }
  dt {
    font-size: 13px;
    color: #6b7280;
    font-weight: 500;
  }
  dd {
    margin: 0;
    font-size: 14px;
    color: #0f172a;
    font-weight: 700;
  }
`;

const ReportLayout = styled.div.attrs({ className: "report-layout" })`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const ReportSection = styled.section.attrs({ className: "report-section" })`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const ReportLabel = styled.h4.attrs({ className: "report-label" })`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 2px solid #f1f5f9;
  
  &::before {
    content: "";
    display: block;
    width: 6px;
    height: 24px;
    background: #4f46e5;
    border-radius: 3px;
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }
`;

const ReportTextarea = styled.textarea`
  width: 100%;
  min-height: 140px;
  padding: 20px;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  font-size: 15px;
  line-height: 1.7;
  resize: vertical;
  background: #ffffff;
  color: #1e293b;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
  }
  &::placeholder {
    color: #94a3b8;
  }
`;

const EmptyHint = styled.div`
  padding: 24px;
  text-align: center;
  background: #f9fafb;
  border-radius: 12px;
  color: #6b7280;
  font-size: 14px;
`;

const AttendanceList = styled.ul.attrs({ className: "attendance-list" })`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  width: 100%;

  li {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 10px;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 16px;
    transition: all 0.2s ease;
    width: calc(50% - 6px);
    min-width: 180px;
    
    &:hover {
      border-color: #cbd5e1;
      transform: translateY(-2px);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }
  }
  li.more {
    justify-content: center;
    align-items: center;
    background: #f8fafc;
    border: 1px dashed #cbd5e1;
    color: #64748b;
    font-size: 14px;
    font-weight: 500;
    cursor: default;
    &:hover {
      transform: none;
      box-shadow: none;
      border-color: #94a3b8;
    }
  }
  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    width: 100%;
  }
  .date {
    font-size: 13px;
    color: #64748b;
    font-weight: 600;
  }
  .status {
    font-size: 12px;
    font-weight: 700;
    padding: 4px 8px;
    border-radius: 6px;
    letter-spacing: -0.01em;
  }
  .status.present {
    color: #15803d;
    background: #dcfce7;
  }
  .status.absent {
    color: #b91c1c;
    background: #fee2e2;
  }
  .reason {
    font-size: 13px;
    color: #334155;
    line-height: 1.4;
    background: #f1f5f9;
    padding: 8px;
    border-radius: 6px;
    margin-top: 4px;
  }
`;

const GradesChartContainer = styled.div`
  background: #f9fafb;
  border-radius: 12px;
  padding: 20px;
  overflow-x: auto;
`;

const LessonList = styled.ul.attrs({ className: "lesson-list" })`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  position: relative;

  /* Vertical line */
  &::before {
    content: "";
    position: absolute;
    top: 24px;
    bottom: 24px;
    left: 110px;
    width: 2px;
    background: #e2e8f0;
  }

  li {
    display: flex;
    gap: 40px;
    padding: 12px 0;
    position: relative;
    align-items: flex-start;
  }

  /* Timeline Dot */
  li::after {
    content: "";
    position: absolute;
    left: 104px; /* 110 - 6 */
    top: 20px; /* Align with text top approx */
    width: 14px;
    height: 14px;
    background: #fff;
    border: 3px solid #4f46e5;
    border-radius: 50%;
    z-index: 1;
    box-sizing: border-box;
  }

  li.more {
    justify-content: center;
    padding: 12px;
    font-size: 13px;
    color: #6b7280;
    background: #f8fafc;
    border-radius: 12px;
    margin-top: 12px;
    border: 1px dashed #cbd5e1;
    z-index: 2; /* Cover line */
  }
  li.more::after {
    display: none;
  }

  .date {
    width: 90px;
    text-align: right;
    font-size: 14px;
    color: #64748b;
    font-weight: 600;
    flex-shrink: 0;
    padding-top: 4px;
  }
  .topic {
    flex: 1;
    font-size: 15px;
    color: #1e293b;
    line-height: 1.6;
    background: #f8fafc;
    padding: 16px 20px;
    border-radius: 16px;
    border: 1px solid #f1f5f9;
  }
`;

const OutlineButton = styled.button`
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #374151;
  font-weight: 600;
  border-radius: 8px;
  padding: 8px 14px;
  cursor: pointer;
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  transition: all 0.2s;
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  &:hover {
    background: #f9fafb;
    border-color: #d1d5db;
  }
`;

const KakaoButton = styled.button`
  border: 1px solid #f4d000;
  background: #fee500;
  color: #1e1200;
  border-radius: ${(p) => p.theme.radii.md};
  padding: 0 18px;
  height: 40px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: transform 0.15s ease;
  &:hover:not(:disabled) {
    transform: translateY(-1px);
  }
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

type AttendancePoint = { date: string; present: boolean; reason?: string | null };
type GradePoint = { examId: number; title: string; date?: string; percent: number; level?: string | null };
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
          let percent: number | null = null;
          if (row.score != null) {
            const total = row.outOf ?? 100;
            percent = total > 0 ? (row.score / total) * 100 : row.score;
          } else if (row.level) {
            const numeric = numericFromLetter(row.level);
            if (numeric != null) percent = numeric;
          }
          if (percent == null) continue;
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
          byStudent[key].push({ date: day.date, present: row.present, reason: row.reason });
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
          let percent: number | null = null;
          if (row.score != null) {
            const total = row.outOf ?? 100;
            percent = total > 0 ? (row.score / total) * 100 : row.score;
          } else if (row.level) {
            const numeric = numericFromLetter(row.level);
            if (numeric != null) percent = numeric;
          }
          if (percent == null) continue;
          if (!gradesMap[row.studentId]) gradesMap[row.studentId] = [];
          gradesMap[row.studentId].push({
            examId: exam.id,
            title: exam.title,
            date: exam.examDate,
            percent,
            level: row.level ?? null,
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

function collectStyleTagsHtml(): string {
  const inlineBlocks: string[] = [];

  // 1) Inline 모든 접근 가능한 스타일시트 (link/style 불문)
  Array.from(document.styleSheets).forEach((sheet) => {
    try {
      const rules: CSSRule[] = sheet.cssRules ? Array.from(sheet.cssRules) : [];
      const cssText = rules
        .map((rule) => rule.cssText)
        .join("\n");
      if (cssText.trim()) {
        inlineBlocks.push(`<style data-inline-from-sheet="true">${cssText}</style>`);
      }
    } catch {
      // CORS 차단 등의 이유로 읽지 못하는 경우 건너뜀
    }
  });

  // 2) 이미 존재하는 <style> 태그 보존 (styled-components 등)
  const existingStyles = Array.from(document.querySelectorAll("style")).map((node) => node.outerHTML);

  return [...inlineBlocks, ...existingStyles].join("\n");
}

function cloneReportNode(source: HTMLElement): HTMLElement {
  const clone = source.cloneNode(true) as HTMLElement;
  syncFormValues(source, clone);
  return clone;
}

// Inline only key layout/typography styles to reduce HTML size while keeping layout fidelity
function inlineKeyStyles(root: HTMLElement) {
  const KEY_PROPS = [
    "padding",
    "padding-top",
    "padding-right",
    "padding-bottom",
    "padding-left",
    "margin",
    "margin-top",
    "margin-right",
    "margin-bottom",
    "margin-left",
    "width",
    "min-width",
    "max-width",
    "height",
    "min-height",
    "max-height",
    "font-size",
    "font-weight",
    "line-height",
    "letter-spacing",
    "color",
    "text-align",
    "border",
    "border-radius",
    "background",
    "background-color",
    "box-shadow",
    "position",
    "top",
    "right",
    "bottom",
    "left",
  ];

  const walker = (el: HTMLElement) => {
    const style = window.getComputedStyle(el);
    const parts = KEY_PROPS.map((prop) => {
      const val = style.getPropertyValue(prop);
      return val ? `${prop}: ${val};` : "";
    }).filter(Boolean);
    if (parts.length) {
      const existing = el.getAttribute("style") || "";
      el.setAttribute("style", `${existing} ${parts.join(" ")}`.trim());
    }
    Array.from(el.children).forEach((child) => {
      if (child instanceof HTMLElement) walker(child);
    });
  };

  walker(root);
}

function syncFormValues(source: HTMLElement, target: HTMLElement) {
  const sourceTextareas = Array.from(source.querySelectorAll<HTMLTextAreaElement>("textarea"));
  const targetTextareas = Array.from(target.querySelectorAll<HTMLTextAreaElement>("textarea"));
  targetTextareas.forEach((textarea, index) => {
    const value = sourceTextareas[index]?.value ?? "";
    textarea.value = value;
    textarea.textContent = value;
  });

  const sourceInputs = Array.from(source.querySelectorAll<HTMLInputElement>("input"));
  const targetInputs = Array.from(target.querySelectorAll<HTMLInputElement>("input"));
  targetInputs.forEach((input, index) => {
    const original = sourceInputs[index];
    if (!original) return;
    if (original.type === "checkbox" || original.type === "radio") {
      input.checked = original.checked;
      if (original.checked) input.setAttribute("checked", "checked");
      else input.removeAttribute("checked");
    } else {
      input.value = original.value;
      input.setAttribute("value", original.value);
    }
  });
}

function buildReportHtmlDocument(
  node: HTMLElement,
  courseTitle?: string | null,
  studentName?: string | null,
): string {
  const clone = cloneReportNode(node);
  inlineKeyStyles(clone);
  const styles = collectStyleTagsHtml();
  const title =
    [courseTitle, studentName, "학습 보고서"].filter(Boolean).join(" · ") || "학습 보고서";
  const pdfCompatStyles = `
    <style>
      /* openhtmltopdf가 flex/grid/gap을 지원하지 않아 PDF 렌더용으로 블록/테이블 기반으로 강제 */
      #report-print-root {
        width: 210mm !important;
        min-height: 297mm !important;
        padding: 12mm !important;
        box-sizing: border-box !important;
      }

      .report-paper-inner {
        width: 100% !important;
        max-width: none !important;
        padding: 0 !important;
        box-sizing: border-box !important;
      }

      .report-paper-header {
        display: table;
        width: 100%;
        table-layout: fixed;
        border-bottom: 2px solid #111827;
        padding-bottom: 14px;
        margin-bottom: 20px;
      }

      .report-paper-header > div:first-child {
        display: table-cell;
        vertical-align: top;
        width: 60%;
      }

      .paper-meta {
        display: table-cell !important;
        vertical-align: top;
        width: 40%;
        text-align: right;
      }

      .paper-meta dl {
        margin: 0;
        padding: 0;
      }

      .paper-meta dl > div {
        display: block;
        margin: 0 0 6px 0;
        padding: 0;
      }

      .paper-meta dt {
        display: inline-block;
        min-width: 32px;
      }

      .paper-meta dd {
        display: inline-block;
        margin: 0 0 0 6px;
      }

      .report-layout {
        display: block !important;
      }

      .report-section {
        display: block !important;
        margin: 0 0 18px 0;
        padding: 0 0 12px 0;
        page-break-inside: avoid;
      }

      .report-section:last-child {
        margin-bottom: 0;
      }

      .report-label {
        display: block !important;
        padding: 0 0 10px 0;
        margin: 0 0 12px 0;
        border-bottom: 2px solid #f1f5f9;
        line-height: 1.3;
      }

      .report-label::before {
        display: inline-block !important;
        vertical-align: middle;
        margin-right: 10px;
      }

      .report-label::after {
        content: none !important;
      }

      .attendance-list {
        display: block;
        padding: 0;
        margin: 0;
      }

      .attendance-list li {
        display: block;
        width: 100%;
        margin: 0 0 8px 0;
        box-sizing: border-box;
      }

      .attendance-list li:last-child {
        margin-bottom: 0;
      }

      .attendance-list .top {
        display: block;
      }

      .attendance-list .status {
        display: inline-block;
        margin-top: 4px;
      }

      .lesson-list {
        display: block;
        padding: 0;
        margin: 0;
        position: relative;
      }

      .lesson-list::before {
        display: none;
      }

      .lesson-list li {
        display: block;
        margin: 0 0 10px 0;
        padding: 12px;
        border: 1px solid #f1f5f9;
        border-radius: 12px;
        position: relative;
      }

      .lesson-list li:last-child {
        margin-bottom: 0;
      }

      .lesson-list li::after {
        display: none;
      }

      .lesson-list .date {
        display: block;
        width: auto;
        text-align: left;
        margin: 0 0 6px 0;
        padding: 0;
      }

      .lesson-list .topic {
        display: block;
        padding: 0;
        background: transparent;
        border: 0;
      }

      .report-paper-inner textarea {
        width: 100%;
        box-sizing: border-box;
      }

      .report-paper-inner svg {
        max-width: 100%;
      }
    </style>
  `;
  
  // Keep original ID to match browser print styles
  // Apply the exact same styles as browser print (without @media print wrapper)
  const printStyles = `
    <style>
      @page {
        size: A4;
        margin: 0;
      }
      
      html, body {
        width: 210mm;
        height: 297mm;
        margin: 0 !important;
        padding: 0 !important;
        background: #fff;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      
      body * {
        visibility: hidden;
      }
      
      #report-print-root, #report-print-root * {
        visibility: visible;
      }
      
      #report-print-root {
        position: absolute;
        left: 0;
        top: 0;
        width: 210mm !important;
        min-height: 297mm !important;
        margin: 0 !important;
        padding: 10mm !important;
        box-sizing: border-box !important;
        border: none !important;
        box-shadow: none !important;
        overflow: visible !important;
        background: white !important;
      }
      
      section {
        break-inside: auto;
        page-break-inside: auto;
      }
      
      li, .page-break-avoid, tr {
        break-inside: avoid;
        page-break-inside: avoid;
      }
      
      h1, h2, h3, h4, h5, h6 {
        break-after: avoid;
        page-break-after: avoid;
      }
      
      ::-webkit-scrollbar {
        display: none;
      }
    </style>
  `;

  // Force inline styles on the clone to override styled-components classes
  // This ensures S3 PDF uses the same layout as browser print
  clone.style.cssText = `
    position: absolute !important;
    left: 0 !important;
    top: 0 !important;
    width: 210mm !important;
    min-height: 297mm !important;
    max-height: none !important;
    height: auto !important;
    margin: 0 !important;
    padding: 10mm !important;
    box-sizing: border-box !important;
    border: none !important;
    box-shadow: none !important;
    overflow: visible !important;
    background: white !important;
  `;

  return [
    "<!doctype html>",
    '<html lang="ko">',
    "<head>",
    '<meta charset="UTF-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
    `<title>${escapeHtml(title)}</title>`,
    styles,
    printStyles,
    pdfCompatStyles,
    "</head>",
    "<body>",
    clone.outerHTML,
    "</body>",
    "</html>",
  ].join("");
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildReportFilename(
  courseTitle: string | undefined | null,
  studentName: string | undefined | null,
): string {
  const stamp = formatYmd(new Date()).replace(/-/g, "");
  const parts = ["report"];
  if (courseTitle) parts.push(sanitizeFilenamePart(courseTitle));
  if (studentName) parts.push(sanitizeFilenamePart(studentName));
  parts.push(stamp);
  const base = parts.filter(Boolean).join("-");
  return `${base}.pdf`;
}

function sanitizeFilenamePart(value: string): string {
  return (
    value
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^0-9A-Za-z._-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^[-.]+|[-.]+$/g, "") || "file"
  );
}
