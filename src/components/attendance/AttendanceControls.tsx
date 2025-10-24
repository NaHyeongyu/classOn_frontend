import type { StatusFilter, ViewMode } from "@/features/attendance/types";
import {
  Controls,
  FilterButton,
  StatusFilterBar,
  TabButton,
  ViewTabs,
} from "./Attendance.styles";

type StatusOption = {
  value: StatusFilter;
  label: string;
};

type AttendanceControlsProps = {
  viewMode: ViewMode;
  statusFilter: StatusFilter;
  onChangeView: (mode: ViewMode) => void;
  onSelectStatus: (filter: StatusFilter) => void;
  showStatusFilter: boolean;
  statusOptions: StatusOption[];
};

export function AttendanceControls({
  viewMode,
  statusFilter,
  onChangeView,
  onSelectStatus,
  showStatusFilter,
  statusOptions,
}: AttendanceControlsProps) {
  return (
    <Controls>
      <ViewTabs>
        <TabButton
          type="button"
          data-active={viewMode === "daily" || undefined}
          onClick={() => onChangeView("daily")}
        >
          일자별 보기
        </TabButton>
        <TabButton
          type="button"
          data-active={viewMode === "class" || undefined}
          onClick={() => onChangeView("class")}
        >
          수업별 보기
        </TabButton>
      </ViewTabs>

      {showStatusFilter ? (
        <StatusFilterBar>
          {statusOptions.map((option) => (
            <FilterButton
              key={option.value}
              type="button"
              data-active={statusFilter === option.value || undefined}
              onClick={() => onSelectStatus(option.value)}
            >
              {option.label}
            </FilterButton>
          ))}
        </StatusFilterBar>
      ) : null}
    </Controls>
  );
}
