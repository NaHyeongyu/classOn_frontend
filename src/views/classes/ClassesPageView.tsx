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
};

export function ClassesPageView({
  filters,
  onChangeFilters,
  onApplyFilters,
  refreshKey,
}: ClassesPageViewProps) {
  return (
    <PageWrap>
      <PageHeader>
        <div>
          <h2>수업 관리</h2>
          <p>개설된 수업을 조회하고 빠르게 검색하세요.</p>
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
          <PrimaryBtn to={routes.classesNew}>수업 추가</PrimaryBtn>
        </div>
      </PageHeader>

      <ClassesStats />

      <SectionCard>
        <ClassesFilters
          value={filters}
          onChange={onChangeFilters}
          onApply={onApplyFilters}
        />
      </SectionCard>

      <ClassesTable filters={filters} refreshKey={refreshKey} />
    </PageWrap>
  );
}
