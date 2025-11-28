import styled from "styled-components";
import { SectionCard } from "@/components/common/UI";
import type { Course } from "@/api/courses";

type Props = {
  courseQuery: string;
  onCourseQueryChange: (value: string) => void;
  filteredCourses: Course[];
  selectedCourses: Course[];
  selectedCourseIds: number[];
  onToggleCourse: (courseId: number) => void;
  onClearSelected: () => void;
  maxSelectable: number;
  loadingCourses: boolean;
  coursesError: string | null;
};

export function MarketingClassSelector({
  courseQuery,
  onCourseQueryChange,
  filteredCourses,
  selectedCourses,
  selectedCourseIds,
  onToggleCourse,
  onClearSelected,
  maxSelectable,
  loadingCourses,
  coursesError,
}: Props) {
  const selectedCount = selectedCourseIds.length;

  return (
    <SelectorCard>
      <PanelHeader>
        <PanelTitle>수업 내역 조회</PanelTitle>
        <PanelSub>최대 {maxSelectable}개까지 선택할 수 있어요.</PanelSub>
      </PanelHeader>
      <SelectorBody>
        <FieldBlock>
          <SearchBar>
            <SearchInput
              id="marketing-course-search"
              placeholder="수업을 검색해 선택하세요."
              value={courseQuery}
              onChange={(event) => onCourseQueryChange(event.target.value)}
            />
          </SearchBar>
          {loadingCourses ? <CardHint>수업을 불러오는 중입니다…</CardHint> : null}
          {coursesError ? <CardError>{coursesError}</CardError> : null}
        </FieldBlock>

        <FieldBlock>
          <FieldHead>
            <FieldLabel>수업 선택</FieldLabel>
            <FieldMeta>
              <span>선택 {selectedCount}/{maxSelectable}</span>
              {selectedCount > 0 ? (
                <SmallLink type="button" onClick={onClearSelected}>
                  전체 해제
                </SmallLink>
              ) : null}
            </FieldMeta>
          </FieldHead>

          {selectedCourses.length > 0 ? (
            <SelectedChips>
              {selectedCourses.map((course) => (
                <Chip key={course.id}>
                  <span className="title">{course.title}</span>
                  <button
                    type="button"
                    aria-label="선택 해제"
                    onClick={() => onToggleCourse(course.id)}
                  >
                    ×
                  </button>
                </Chip>
              ))}
            </SelectedChips>
          ) : null}

          <CourseListWrap>
            <CourseList role="list" aria-label="수업 목록">
              {filteredCourses.map((course) => {
                const selected = selectedCourseIds.includes(course.id);
                const atLimit = !selected && selectedCount >= maxSelectable;
                return (
                  <CourseButton
                    key={course.id}
                    type="button"
                    role="listitem"
                    data-selected={selected || undefined}
                    data-disabled={atLimit || undefined}
                    onClick={() => {
                      if (atLimit && !selected) return;
                      onToggleCourse(course.id);
                    }}
                  >
                    <div className="header">
                      <span className="title">{course.title}</span>
                      <span className="time">
                        {course.courseTime || 
                          (course.startTime && course.endTime 
                            ? `${course.startTime.slice(0, 5)} ~ ${course.endTime.slice(0, 5)}`
                            : '')}
                      </span>
                    </div>
                    {course.nextClassDate && (
                      <div className="next">
                        다음 수업 {course.nextClassDate.replace(/^(\d{4})-(\d{2})-(\d{2})$/, (_, y, m, d) => 
                          `${Number(y)}년 ${Number(m)}월 ${Number(d)}일`
                        )}
                      </div>
                    )}
                  </CourseButton>
                );
              })}
            </CourseList>
          </CourseListWrap>
        </FieldBlock>
      </SelectorBody>
    </SelectorCard>
  );
}

const SelectorCard = styled(SectionCard)`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing.xl};
`;

const PanelHeader = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.sm};
`;

const PanelTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.colors.text};
`;

const PanelSub = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const SelectorBody = styled.div`
  flex: 1;
  min-height: 0;
  display: grid;
  gap: ${(p) => p.theme.spacing.lg};
  align-content: start;
  overflow: visible;
`;

const FieldBlock = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.lg};
  min-height: 0;
  
  &:last-child {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }
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

const CardHint = styled.span`
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const CardError = styled.span`
  font-size: ${(p) => p.theme.font.size.sm};
  color: #dc2626;
  font-weight: 600;
`;

const FieldHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${(p) => p.theme.spacing.sm};
`;

const FieldLabel = styled.div`
  font-size: ${(p) => p.theme.font.size.sm};
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
`;

const FieldMeta = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing.sm};
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const SmallLink = styled.button`
  border: 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${(p) => p.theme.font.size.sm};
  cursor: pointer;
  text-decoration: underline;
`;

const SelectedChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${(p) => p.theme.spacing.xs};
`;

const Chip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  background: #eef2ff;
  font-size: 13px;
  color: #312e81;
  button {
    border: 0;
    background: transparent;
    color: currentColor;
    cursor: pointer;
    font-size: 14px;
    line-height: 1;
  }
`;

const CourseListWrap = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${(p) => p.theme.radii.md};
  height: 100%;
  min-height: 320px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const CourseList = styled.div`
  flex: 1;
  overflow-y: auto;
  display: grid;
  align-content: start;
`;

const CourseButton = styled.button`
  text-align: left;
  padding: ${(p) => p.theme.spacing.sm} ${(p) => p.theme.spacing.md};
  border: 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  display: grid;
  gap: ${(p) => p.theme.spacing.xs};
  transition: background 0.18s ease;
  &:last-child {
    border-bottom: 0;
  }
  .header {
    display: flex;
    align-items: center;
    gap: ${(p) => p.theme.spacing.sm};
    flex-wrap: wrap;
  }
  .title {
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
  }
  .time {
    font-size: 12px;
    color: ${({ theme }) => theme.colors.textMuted};
  }
  .next {
    font-size: 12px;
    color: ${({ theme }) => theme.colors.textMuted};
  }
  &[data-selected="true"] {
    background: ${({ theme }) => theme.colors.primarySurface};
  }
  &[data-disabled="true"] {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
