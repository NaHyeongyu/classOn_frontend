import { useCallback, useMemo, useState, type FormEvent } from "react";
import { useDailyAttendance } from "@/features/attendance/useDailyAttendance";
import { buildFlatRows } from "@/features/attendance/utils";
import type {
  DailyWithRows,
  StatusFilter,
  ViewMode,
} from "@/features/attendance/types";

export type AttendancePageState = {
  formDate: string;
  onChangeDate: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onQuickSelect: (offset: number) => void;
  courseSearch: string;
  onChangeCourseSearch: (value: string) => void;
  onResetFilters: () => void;
  loading: boolean;
  error: string | null;
  viewMode: ViewMode;
  onChangeView: (next: ViewMode) => void;
  statusFilter: StatusFilter;
  onChangeStatusFilter: (next: StatusFilter) => void;
  dailyRows: DailyWithRows[];
};

export function useAttendancePage(): AttendancePageState {
  const {
    formDate,
    rows,
    loading,
    error,
    setDate,
    submit,
    applyQuick,
  } = useDailyAttendance();
  const [viewMode, setViewMode] = useState<ViewMode>("daily");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [courseSearch, setCourseSearch] = useState("");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submit();
  };

  const handleQuickSelect = (offset: number) => {
    applyQuick(offset);
    if (viewMode !== "daily") {
      setViewMode("daily");
    }
  };

  const handleReset = useCallback(() => {
    applyQuick(0);
    setCourseSearch("");
    if (viewMode !== "daily") {
      setViewMode("daily");
    }
  }, [applyQuick, viewMode]);

  const dailyRows = useMemo<DailyWithRows[]>(
    () =>
      rows.map((day) => ({
        day,
        rows: buildFlatRows(day),
      })),
    [rows]
  );

  return {
    formDate,
    onChangeDate: setDate,
    onSubmit,
    onQuickSelect: handleQuickSelect,
    courseSearch,
    onChangeCourseSearch: setCourseSearch,
    onResetFilters: handleReset,
    loading,
    error,
    viewMode,
    onChangeView: setViewMode,
    statusFilter,
    onChangeStatusFilter: setStatusFilter,
    dailyRows,
  };
}
