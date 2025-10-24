import styled from "styled-components";
import {
  SectionCard,
  PrimaryButton,
  GhostButtonSmall,
} from "@/components/common/UI";
import { formatCourseMeta } from "@/features/marketing/utils";
import type { Course } from "@/api/courses";
import type { MarketingPresetKey } from "@/features/marketing/types";

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
  preset: MarketingPresetKey | null;
  onSelectPreset: (preset: MarketingPresetKey) => void;
  from: string;
  to: string;
  onChangeFrom: (value: string) => void;
  onChangeTo: (value: string) => void;
  rangeSummary: { label: string; days: number | null };
  onSubmit: () => void;
  onReset: () => void;
  loading: boolean;
};

const PRESET_ITEMS: Array<{ key: MarketingPresetKey; label: string }> = [
  { key: "7d", label: "최근 7일" },
  { key: "30d", label: "최근 30일" },
  { key: "thisMonth", label: "이번 달" },
  { key: "lastMonth", label: "지난 달" },
];

export function MarketingFilterPanel({
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
  preset,
  onSelectPreset,
  from,
  to,
  onChangeFrom,
  onChangeTo,
  rangeSummary,
  onSubmit,
  onReset,
  loading,
}: Props) {
  const handleFocusDate = (input: HTMLInputElement) => {
    try {
      (input as HTMLInputElement & { showPicker?: () => void }).showPicker?.();
    } catch {
      // 일부 브라우저는 showPicker 미지원 - 무시
    }
  };

  const selectedCount = selectedCourseIds.length;

  return (
    <FilterCard>
      <PanelHeader>
        <PanelTitle>수업 내역 조회</PanelTitle>
      </PanelHeader>
      <FilterBody>
        <FieldBlock>
          <SearchBar>
            <SearchInput
              id="marketing-course-search"
              placeholder="수업을 검색해 선택하세요"
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
                    <div className="title">{course.title}</div>
                    <div className="meta">{formatCourseMeta(course)}</div>
                  </CourseButton>
                );
              })}
            </CourseList>
          </CourseListWrap>

          {selectedCount === 0 ? (
            <CardHint>최대 {maxSelectable}개까지 선택할 수 있어요.</CardHint>
          ) : null}
        </FieldBlock>

        <FieldBlock>
          <FieldLabel>빠른 기간 선택</FieldLabel>
          <QuickGrid>
            {PRESET_ITEMS.map((item) => (
              <QuickButton
                key={item.key}
                type="button"
                data-active={preset === item.key}
                onClick={() => onSelectPreset(item.key)}
              >
                {item.label}
              </QuickButton>
            ))}
          </QuickGrid>
        </FieldBlock>

        <FieldBlock>
          <FieldLabel>기간 직접 입력</FieldLabel>
          <DateRow>
            <DateField>
              <span>시작일</span>
              <DateInput
                type="date"
                lang="ko-KR"
                inputMode="numeric"
                pattern="^\\d{4}-\\d{2}-\\d{2}$"
                placeholder="YYYY-MM-DD"
                value={from}
                onFocus={(event) => handleFocusDate(event.currentTarget)}
                onChange={(event) => onChangeFrom(event.target.value)}
                onBlur={(event) => onChangeFrom(event.currentTarget.value)}
              />
            </DateField>
            <DateField>
              <span>종료일</span>
              <DateInput
                type="date"
                lang="ko-KR"
                inputMode="numeric"
                pattern="^\\d{4}-\\d{2}-\\d{2}$"
                placeholder="YYYY-MM-DD"
                value={to}
                onFocus={(event) => handleFocusDate(event.currentTarget)}
                onChange={(event) => onChangeTo(event.target.value)}
                onBlur={(event) => onChangeTo(event.currentTarget.value)}
              />
            </DateField>
          </DateRow>
          <RangeSummaryText>
            {rangeSummary.label}
            {rangeSummary.days ? ` · 총 ${rangeSummary.days}일` : null}
          </RangeSummaryText>
        </FieldBlock>
      </FilterBody>

      <StickyActions>
        <ActionRow>
          <PrimaryButton type="button" onClick={onSubmit} disabled={loading}>
            {loading ? "조회 중..." : "조회하기"}
          </PrimaryButton>
          <GhostButtonSmall as="button" type="button" onClick={onReset}>
            초기화
          </GhostButtonSmall>
        </ActionRow>
      </StickyActions>
    </FilterCard>
  );
}

const FilterCard = styled(SectionCard)`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing.xl};
`;

const PanelHeader = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.xs};
`;

const PanelTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.colors.text};
`;

const FilterBody = styled.div`
  flex: 1;
  min-height: 0;
  overflow: auto;
  display: grid;
  gap: ${(p) => p.theme.spacing.xl};
`;

const FieldBlock = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.sm};
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
  max-height: 320px;
  overflow: hidden;
`;

const CourseList = styled.div`
  max-height: 320px;
  overflow-y: auto;
  display: grid;
`;

const CourseButton = styled.button`
  text-align: left;
  padding: ${(p) => p.theme.spacing.sm} ${(p) => p.theme.spacing.md};
  border: 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  display: grid;
  gap: 4px;
  transition: background 0.18s ease;
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
  &[data-disabled="true"] {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QuickGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: ${(p) => p.theme.spacing.sm};
`;

const QuickButton = styled.button`
  height: 40px;
  border-radius: ${(p) => p.theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  font-size: ${(p) => p.theme.font.size.sm};
  cursor: pointer;
  &[data-active="true"] {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primarySurface};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const DateRow = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.sm};
`;

const DateField = styled.label`
  display: grid;
  gap: 4px;
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  span {
    font-weight: 600;
  }
`;

const DateInput = styled.input`
  height: 40px;
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

const RangeSummaryText = styled.p`
  margin: 0;
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const StickyActions = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.sm};
`;

const ActionRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing.sm};
`;
