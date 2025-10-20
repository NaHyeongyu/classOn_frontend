import { useMemo, useState } from "react";
import styled from "styled-components";
import { Page, PageHeader, SectionCard } from "@/components/common/UI";
import { useMarketingCourses } from "@/features/marketing/hooks";
import { formatCourseMeta } from "@/features/marketing/utils";
import { useNavigate } from "react-router-dom";
import { routes, paths } from "@/routes";
import type { Course } from "@/api/courses";

export default function ReportCourseList() {
  const navigate = useNavigate();
  const { courses, loading, error } = useMarketingCourses();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return courses;
    return courses.filter((course) => course.title.toLowerCase().includes(q));
  }, [courses, query]);

  function handleSelect(course: Course) {
    navigate(paths.report.courseDetail(course.id), { state: { course } });
  }

  return (
    <Page>
      <PageHeader>
        <div>
          <h2>수업 리포트</h2>
          <p>리포트를 만들 수업을 선택하세요.</p>
        </div>
        <HeaderActions>
          <BackButton type="button" onClick={() => navigate(routes.report)}>
            리포트 홈으로
          </BackButton>
        </HeaderActions>
      </PageHeader>

      <SectionCard data-animated="true">
        <PanelHeader>
          <div>
            <PanelTitle>수업 선택</PanelTitle>
            <PanelSubtitle>선택한 수업의 학생과 기간을 다음 단계에서 설정합니다.</PanelSubtitle>
          </div>
        </PanelHeader>

        <SearchField>
          <SearchInput
            id="course-search"
            placeholder="수업명을 입력해 검색하세요"
            aria-label="수업 검색"
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
          />
        </SearchField>

        {error ? <InlineError>{error}</InlineError> : null}
        {loading ? <InlineHint>수업 목록을 불러오는 중입니다…</InlineHint> : null}
        {!loading && filtered.length === 0 ? (
          <InlineHint>조건에 맞는 수업이 없습니다.</InlineHint>
        ) : null}

        <CourseList>
          {filtered.map((course) => (
            <CourseButton
              key={course.id}
              type="button"
              onClick={() => handleSelect(course)}
            >
              <strong>{course.title}</strong>
              <span>{formatCourseMeta(course)}</span>
              {course.enrolledCount != null ? (
                <MetaText>{`등록 학생 ${course.enrolledCount}명`}</MetaText>
              ) : null}
            </CourseButton>
          ))}
        </CourseList>
      </SectionCard>
    </Page>
  );
}

const HeaderActions = styled.div`
  display: inline-flex;
  gap: ${(p) => p.theme.spacing.sm};
  align-items: center;
`;

const BackButton = styled.button`
  height: 40px;
  padding: 0 ${(p) => p.theme.spacing.md};
  border-radius: ${(p) => p.theme.radii.md};
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.surface};
  font-size: ${(p) => p.theme.font.size.sm};
  font-weight: ${(p) => p.theme.font.weight.semiBold};
  cursor: pointer;
  transition: border-color ${(p) => p.theme.motion.duration.base} ${(p) => p.theme.motion.easing.standard};
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

const SearchField = styled.div`
  margin-bottom: ${(p) => p.theme.spacing.sm};
`;

const SearchInput = styled.input`
  width: 100%;
  height: 40px;
  border-radius: ${(p) => p.theme.radii.md};
  border: 1px solid ${(p) => p.theme.colors.borderStrong};
  padding: 0 ${(p) => p.theme.spacing.sm};
  font-size: ${(p) => p.theme.font.size.md};
  transition:
    border-color ${(p) => p.theme.motion.duration.base} ${(p) => p.theme.motion.easing.standard},
    box-shadow ${(p) => p.theme.motion.duration.base} ${(p) => p.theme.motion.easing.standard};
  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.primary};
    box-shadow: ${(p) => p.theme.shadow.focusPrimary};
  }
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

const CourseList = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.sm};
  margin-top: ${(p) => p.theme.spacing.sm};
`;

const CourseButton = styled.button`
  display: grid;
  gap: ${(p) => p.theme.spacing.xs};
  padding: ${(p) => p.theme.spacing.md};
  border-radius: ${(p) => p.theme.radii.md};
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.surface};
  text-align: left;
  cursor: pointer;
  transition:
    border-color ${(p) => p.theme.motion.duration.base} ${(p) => p.theme.motion.easing.standard},
    box-shadow ${(p) => p.theme.motion.duration.base} ${(p) => p.theme.motion.easing.standard},
    transform ${(p) => p.theme.motion.duration.short} ${(p) => p.theme.motion.easing.standard};
  strong {
    font-size: ${(p) => p.theme.font.size.md};
    font-weight: ${(p) => p.theme.font.weight.semiBold};
    color: ${(p) => p.theme.colors.text};
  }
  span {
    font-size: ${(p) => p.theme.font.size.sm};
    color: ${(p) => p.theme.colors.textMuted};
  }
  &:hover {
    border-color: ${(p) => p.theme.colors.borderStrong};
    box-shadow: ${(p) => p.theme.shadow.medium};
    transform: translateY(-2px);
  }
`;

const MetaText = styled.small`
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${(p) => p.theme.colors.primary};
  font-style: normal;
`;
