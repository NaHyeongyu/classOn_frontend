import { ClassesPageView } from "@/views/classes/ClassesPageView";
import { useClassesPage } from "@/features/classes/useClassesPage";

export default function Classes() {
  const { filters, refreshKey, applyFilters, updateFilters } = useClassesPage();

  return (
    <ClassesPageView
      filters={filters}
      refreshKey={refreshKey}
      onChangeFilters={updateFilters}
      onApplyFilters={applyFilters}
    />
  );
}
