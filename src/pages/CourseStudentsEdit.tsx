import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CourseStudentsEditPageView } from "@/components/courseStudents/CourseStudentsEditPageView";
import { useCourseStudents } from "@/features/courseStudents/useCourseStudents";
import { routes } from "@/routes";

export default function CourseStudentsEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const courseId = useMemo(() => {
    if (!id) return null;
    const parsed = Number(id);
    return Number.isFinite(parsed) ? parsed : null;
  }, [id]);

  const {
    courseInfo,
    title,
    capacity,
    error,
    studentSearch,
    setStudentSearch,
    studentOptions,
    studentLoading,
    studentError,
    enrolledStudents,
    enrolledLoading,
    enrolledError,
    addingId,
    removingId,
    onEnroll,
    onUnenroll,
    confirmUnenrollDialog,
    atCapacity,
  } = useCourseStudents(courseId);

  const atCapacity = capacity != null && enrolledStudents.length >= capacity;

  return (
    <CourseStudentsEditPageView
      title={title || courseInfo?.title || "수업"}
      capacity={capacity}
      studentSearch={studentSearch}
      onChangeStudentSearch={setStudentSearch}
      studentOptions={studentOptions}
      studentLoading={studentLoading}
      studentError={studentError || error}
      enrolledStudents={enrolledStudents}
      enrolledLoading={enrolledLoading}
      enrolledError={enrolledError}
      addingId={addingId}
      removingId={removingId}
      onEnroll={onEnroll}
      onUnenroll={onUnenroll}
      confirmUnenrollDialog={confirmUnenrollDialog}
      onBack={() => navigate(courseId ? `/classes/${courseId}` : routes.classes)}
      atCapacity={atCapacity}
    />
  );
}
