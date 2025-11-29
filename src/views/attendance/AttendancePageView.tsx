import styled from "styled-components";
import type { AttendanceClassSummary } from "@/api/attendance";
import { AttendanceFiltersCard } from "@/components/attendance/AttendanceFiltersCard";
import { AttendanceControls } from "@/components/attendance/AttendanceControls";
import { AttendanceDayCard } from "@/components/attendance/AttendanceDayCard";
import {
  PageLocal,
  Card as AttendanceSectionCard,
  ErrorText as StyledErrorText,
} from "@/components/attendance/Attendance.styles";
import { EmptyState, Skeleton } from "@/components/common/UI";
import type { AttendancePageState } from "@/features/attendance/useAttendancePage";
import type { StatusFilter } from "@/features/attendance/types";

type AttendancePageViewProps = AttendancePageState & {
  isTeacher: boolean;
  onOpenCourseRecord: (courseId?: number | null, recordId?: number | null) => void;
  onOpenRecord: (summary: AttendanceClassSummary) => void;
};

const STATUS_OPTIONS: Array<{ value: StatusFilter; label: string }> = [
  { value: "ALL", label: "전체" },
  { value: "PRESENT", label: "출석" },
  { value: "ABSENT", label: "결석" },
  { value: "UNPROCESSED", label: "미처리" },
];

export function AttendancePageView({
  formDate,
  onChangeDate,
  onSubmit,
  onQuickSelect,
  courseSearch,
  onChangeCourseSearch,
  onResetFilters,
  loading,
  error,
  viewMode,
  onChangeView,
  statusFilter,
  onChangeStatusFilter,
  dailyRows,
  onOpenCourseRecord,
  onOpenRecord,
}: AttendancePageViewProps) {
  return (
    <PageLocal>
      <HeaderBar>
        <div>
          <Title>출결 관리</Title>
          <Subtitle>날짜별 출결 현황을 확인하고 바로 수업으로 이동하세요.</Subtitle>
        </div>
      </HeaderBar>

      <AttendanceSectionCard>
        <AttendanceFiltersCard
          formDate={formDate}
          onChangeDate={onChangeDate}
          onSubmit={onSubmit}
          onQuickSelect={onQuickSelect}
          courseSearch={courseSearch}
          onChangeCourseSearch={onChangeCourseSearch}
          onResetFilters={onResetFilters}
          error={error}
        />
      </AttendanceSectionCard>

      <ControlsWrap>
        <AttendanceControls
          viewMode={viewMode}
          statusFilter={statusFilter}
          onChangeView={onChangeView}
          onSelectStatus={onChangeStatusFilter}
          showStatusFilter={viewMode === "daily"}
          statusOptions={STATUS_OPTIONS}
        />
      </ControlsWrap>

      <AttendanceSectionCard>
        {loading ? (
          <Skeleton h={120} />
        ) : dailyRows.length === 0 ? (
          <EmptyState>조회된 출결 데이터가 없습니다.</EmptyState>
        ) : (
          <DayList>
            {dailyRows.map((item) => (
              <AttendanceDayCard
                key={item.day.date}
                item={item}
                viewMode={viewMode}
                statusFilter={statusFilter}
                onOpenCourse={onOpenCourseRecord}
                onOpenRecord={onOpenRecord}
              />
            ))}
          </DayList>
        )}
        {error && !loading ? <ErrorBox>{error}</ErrorBox> : null}
      </AttendanceSectionCard>
    </PageLocal>
  );
}

const HeaderBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: ${(p) => p.theme.spacing.sm};
`;

const Title = styled.h2`
  margin: 0;
  font-size: 24px;
  color: ${(p) => p.theme.colors.text};
  letter-spacing: -0.02em;
`;

const Subtitle = styled.p`
  margin: 4px 0 0;
  color: ${(p) => p.theme.colors.textMuted};
  font-size: ${(p) => p.theme.font.size.sm};
`;

const ControlsWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: ${(p) => p.theme.spacing.sm};
`;

const DayList = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.sm};
`;

const ErrorBox = styled(StyledErrorText)`
  margin-top: ${(p) => p.theme.spacing.sm};
`;
