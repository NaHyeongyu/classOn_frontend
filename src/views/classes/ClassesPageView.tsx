import styled from "styled-components";
import {
  Page as PageWrap,
  PageHeader,
  PrimaryBtn,
  SectionCard as SectionCard,
} from "@/components/common/UI";
import ClassesFilters from "@/components/classes/ClassesFilters";
import ClassesTable from "@/components/classes/ClassesTable";
import ClassesStats from "@/components/classes/ClassesStats";
import type { ClassesFiltersState } from "@/features/classes/useClassesPage";
import { routes } from "@/routes";

type ClassesPageViewProps = {
  filters: ClassesFiltersState;
  onChangeFilters: (next: ClassesFiltersState) => void;
  onApplyFilters: () => void;
  refreshKey: number;
  isTeacher?: boolean;
};

export function ClassesPageView({
  filters,
  onChangeFilters,
  onApplyFilters,
  refreshKey,
  isTeacher = false,
}: ClassesPageViewProps) {
  const heading = isTeacher ? "담당 수업" : "수업 관리";
  const subheading = isTeacher
    ? "담당 중인 수업을 확인하고 상세로 이동하세요."
    : "개설된 수업을 조회하고 빠르게 검색하세요.";

  return (
    <PageWrap>
      <Stack>
        <Header>
          <div>
            <h2>{heading}</h2>
            <p>{subheading}</p>
          </div>
          <Actions>
            {!isTeacher && <PrimaryBtn to={routes.classesNew}>수업 추가</PrimaryBtn>}
          </Actions>
        </Header>

        <StatsWrapper>
          <ClassesStats />
        </StatsWrapper>

        <FiltersCard>
          <ClassesFilters
            value={filters}
            onChange={onChangeFilters}
            onApply={onApplyFilters}
            hideStatusFilter={false}
          />
        </FiltersCard>

        <ClassesTable filters={filters} refreshKey={refreshKey} />
      </Stack>
    </PageWrap>
  );
}

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing.pageGap};
`;

const Header = styled(PageHeader)`
  margin-bottom: 0;
`;

const Actions = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing.sm};
`;

const StatsWrapper = styled.div`
  width: 100%;
`;

const FiltersCard = styled(SectionCard)`
  padding: ${(p) => p.theme.spacing.md};
  overflow: visible;
  position: relative;
`;
