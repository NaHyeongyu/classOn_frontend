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
      <PageHeader>
        <div>
          <h2>{heading}</h2>
          <p>{subheading}</p>
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
          {!isTeacher && (
            <PrimaryBtn to={routes.classesNew}>수업 추가</PrimaryBtn>
          )}
        </div>
      </PageHeader>

      <ClassesStats />

      <SectionCard>
        <ClassesFilters
          value={filters}
          onChange={onChangeFilters}
          onApply={onApplyFilters}
          hideStatusFilter={false}
        />
      </SectionCard>

      <ClassesTable filters={filters} refreshKey={refreshKey} />
    </PageWrap>
  );
}
