import { ClassesPageView } from "@/views/classes/ClassesPageView";
import { useClassesPage } from "@/features/classes/useClassesPage";
import { useAuth } from "@/hooks/useAuth";

export default function Classes() {
  const { filters, refreshKey, applyFilters, updateFilters } = useClassesPage();
  const { user } = useAuth();
  const isTeacher = (user?.role ?? "").toString().toUpperCase() === "TEACHER";

  return (
    <ClassesPageView
      filters={filters}
      refreshKey={refreshKey}
      onChangeFilters={updateFilters}
      onApplyFilters={applyFilters}
      isTeacher={isTeacher}
    />
  );
}
