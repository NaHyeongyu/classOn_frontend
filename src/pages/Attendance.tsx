import { useNavigate } from "react-router-dom";
import type { AttendanceClassSummary } from "@/api/attendance";
import { AttendancePageView } from "@/components/attendance/AttendancePageView";
import { useAttendancePage } from "@/features/attendance/useAttendancePage";

export default function Attendance() {
  const navigate = useNavigate();
  const state = useAttendancePage();

  const handleOpenCourseRecord = (
    courseId?: number | null,
    recordId?: number | null,
  ) => {
    if (courseId && recordId) {
      navigate(`/classes/${courseId}/history/${recordId}`);
    } else if (courseId) {
      navigate(`/classes/${courseId}`);
    }
  };

  const handleOpenRecord = (entry: AttendanceClassSummary) => {
    handleOpenCourseRecord(entry.courseId, entry.recordId ?? null);
  };

  return (
    <AttendancePageView
      {...state}
      onNavigateCalendar={() => navigate("/calendar")}
      onOpenCourseRecord={handleOpenCourseRecord}
      onOpenRecord={handleOpenRecord}
    />
  );
}
