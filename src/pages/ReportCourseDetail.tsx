import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { Page, PageHeader, SectionCard } from "@/components/common/UI";
import { getCourse, listCourseStudents, type Course } from "@/api/courses";
import { formatPhone } from "@/lib/format";
import type { Student } from "@/api/students";
import { readableError } from "@/lib/errors";
import { routes, paths } from "@/routes";

type DateRange = { from: string; to: string };

export default function ReportCourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const initialCourse = (location.state as { course?: Course } | null)?.course ?? null;

  const numericId = useMemo(() => {
    if (!courseId) return null;
    const n = Number(courseId);
    return Number.isFinite(n) ? n : null;
  }, [courseId]);

  const [course, setCourse] = useState<Course | null>(initialCourse);
  const [courseLoading, setCourseLoading] = useState(!initialCourse);
  const [courseError, setCourseError] = useState<string | null>(null);

  const [students, setStudents] = useState<Student[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentsError, setStudentsError] = useState<string | null>(null);
  const defaultRange = useMemo<DateRange>(() => {
    const today = new Date();
    const to = today.toISOString().slice(0, 10);
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    const from = monthAgo.toISOString().slice(0, 10);
    return { from, to };
  }, []);

  const [range, setRange] = useState<DateRange>(defaultRange);

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
        setStudentsError(readableError(err, "수업에 등록된 학생 목록을 불러오지 못했습니다."));
      } finally {
        if (active) setStudentsLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [numericId]);

  useEffect(() => {
    setRange(defaultRange);
  }, [numericId, defaultRange]);

  const title = course?.title ?? (courseLoading ? "불러오는 중…" : "수업 정보 없음");
  const summarySeed = useMemo(() => {
    const base = course?.description?.trim();
    const period = range.from || range.to ? `${range.from || "전체 기간 시작"} ~ ${range.to || "현재"}` : "전체 기간";
    const instructions =
      `기간 ${period} 동안의 수업 주요 내용과 학생 출결, 시험·평가 성적 변화를 함께 요약해 리포트에 활용할 수 있도록 정리합니다.`;
    return base ? `${base}\n\n${instructions}` : instructions;
  }, [course?.description, range.from, range.to]);

  return (
    <Page>
      <PageHeader>
        <div>
          <h2>{title}</h2>
          <p>선택한 수업의 학생 구성과 리포트 기간을 설정하세요.</p>
        </div>
        <HeaderActions>
          <GhostButton type="button" onClick={() => navigate(paths.report.courseList())}>
            수업 다시 선택
          </GhostButton>
          <PrimaryButton type="button" onClick={() => navigate(routes.report)}>
            리포트 홈
          </PrimaryButton>
        </HeaderActions>
      </PageHeader>

      {courseError ? <InlineError>{courseError}</InlineError> : null}

      <SectionCard data-animated="true">
        <PanelHeader>
          <div>
            <PanelTitle>1. 학생 리스트</PanelTitle>
            <PanelSubtitle>리포트에 포함될 수업 구성원입니다.</PanelSubtitle>
          </div>
          <PanelMeta>
            {studentsLoading ? "불러오는 중…" : `${students.length.toLocaleString()}명`}
          </PanelMeta>
        </PanelHeader>
        {studentsError ? <InlineError>{studentsError}</InlineError> : null}
        {!studentsError && !studentsLoading && students.length === 0 ? (
          <InlineHint>현재 이 수업에 등록된 학생이 없습니다.</InlineHint>
        ) : null}
        {students.length > 0 ? (
          <StudentsScroll>
            <StudentsList>
              {students.map((student) => (
                <StudentRow key={student.id}>
                  <div>
                    <strong>{student.name}</strong>
                    <small>{student.phoneNumber ? formatPhone(student.phoneNumber) : "연락처 없음"}</small>
                  </div>
                  {student.status === "ON_LEAVE" ? (
                    <StudentBadge data-tone="warning">휴학</StudentBadge>
                  ) : student.status === "PENDING" ? (
                    <StudentBadge data-tone="pending">대기</StudentBadge>
                  ) : (
                    <StudentBadge data-tone="active">수강중</StudentBadge>
                  )}
                </StudentRow>
              ))}
            </StudentsList>
          </StudentsScroll>
        ) : null}
      </SectionCard>

      <SectionCard data-animated="true">
        <PanelHeader>
          <div>
            <PanelTitle>2. 기간 설정</PanelTitle>
            <PanelSubtitle>리포트에 포함할 수업 기록 범위를 선택하세요.</PanelSubtitle>
          </div>
        </PanelHeader>
        <DateGrid>
          <FieldBlock>
            <FieldLabel htmlFor="course-range-from">시작일</FieldLabel>
            <DateInput
              id="course-range-from"
              type="date"
              value={range.from}
              max={range.to || undefined}
              onChange={(event) => setRange({ ...range, from: event.currentTarget.value })}
            />
          </FieldBlock>
          <FieldBlock>
            <FieldLabel htmlFor="course-range-to">종료일</FieldLabel>
            <DateInput
              id="course-range-to"
              type="date"
              value={range.to}
              min={range.from || undefined}
              onChange={(event) => setRange({ ...range, to: event.currentTarget.value })}
            />
          </FieldBlock>
        </DateGrid>
        <InlineHint>기간을 비워두면 전체 수업 기록을 기반으로 리포트를 생성합니다.</InlineHint>
      </SectionCard>

      <SectionCard data-animated="true">
        <PanelHeader>
          <div>
            <PanelTitle>다음 단계</PanelTitle>
            <PanelSubtitle>정식 리포트 생성 기능은 준비 중입니다.</PanelSubtitle>
          </div>
        </PanelHeader>
        <InlineHint>
          데이터를 분석해 리포트를 자동으로 제안하는 기능을 개발 중입니다. 설정한 정보는
          곧바로 활용될 수 있도록 저장됩니다.
        </InlineHint>
      </SectionCard>

      <ActionFooter>
        <GhostButton type="button" onClick={() => navigate(paths.report.courseList())}>
          이전
        </GhostButton>
        <PrimaryButton
          type="button"
          onClick={() => {
            if (!numericId) return;
            navigate(paths.report.courseReview(numericId), {
              state: {
                course,
                range,
                students,
                summary: summarySeed,
              },
            });
          }}
          disabled={!numericId || courseLoading}
        >
          다음
        </PrimaryButton>
      </ActionFooter>
    </Page>
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

const StudentsScroll = styled.div`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.md};
  max-height: 300px;
  overflow: auto;
  background: ${(p) => p.theme.colors.surface};
`;

const StudentsList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const StudentRow = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${(p) => p.theme.spacing.md};
  padding: ${(p) => p.theme.spacing.sm} ${(p) => p.theme.spacing.md};
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${(p) => p.theme.colors.text};
  &:nth-child(even) {
    background: ${(p) => p.theme.colors.surfaceAlt};
  }
  div {
    display: grid;
    gap: 2px;
  }
  strong {
    font-weight: ${(p) => p.theme.font.weight.semiBold};
  }
  small {
    font-size: ${(p) => p.theme.font.size.xs};
    color: ${(p) => p.theme.colors.textMuted};
  }
`;

const StudentBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 10px;
  border-radius: ${(p) => p.theme.radii.sm};
  font-size: ${(p) => p.theme.font.size.xs};
  font-weight: ${(p) => p.theme.font.weight.semiBold};
  background: ${(p) => p.theme.colors.surfaceAlt};
  &[data-tone='active'] {
    color: ${(p) => p.theme.colors.success};
    background: ${(p) => p.theme.colors.successSurface};
  }
  &[data-tone='warning'] {
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

const ActionFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: ${(p) => p.theme.spacing.sm};
  margin-top: ${(p) => p.theme.spacing.xl};
`;
