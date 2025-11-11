import { useNavigate } from "react-router-dom";
import type { AttendanceClassSummary } from "@/api/attendance";
import { AttendancePageView } from "@/views/attendance/AttendancePageView";
import { useAttendancePage } from "@/features/attendance/useAttendancePage";
import { useAuth } from "@/hooks/useAuth";

export default function Attendance() {
  const navigate = useNavigate();
  const state = useAttendancePage();
  const { user } = useAuth();
  const isTeacher = (user?.role ?? "").toString().toUpperCase() === "TEACHER";

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
      isTeacher={isTeacher}
      onNavigateCalendar={() => navigate("/calendar")}
      onOpenCourseRecord={handleOpenCourseRecord}
      onOpenRecord={handleOpenRecord}
    />
  );
}
