import {
  CourseHeader,
  CourseItem,
  CourseList,
  CourseMeta,
  CourseStatus,
  CourseTitle,
  Empty,
  CourseFee,
} from "./StudentDetailStyles";
import { formatMoney } from "@/lib/format";

type CourseSummary = {
  id: number;
  title: string;
  code: string;
  status: string;
  fee?: number | null;
};

type Props = {
  courses?: CourseSummary[];
  onOpenCourse: (courseId: number) => void;
  statusLabel: (status: string) => string;
};

export function StudentCoursesTab({
  courses,
  onOpenCourse,
  statusLabel,
}: Props) {
  if (!courses || courses.length === 0) {
    return <Empty>수강 중인 수업이 없습니다.</Empty>;
  }

  return (
    <CourseList>
      {courses.map((course) => (
        <CourseItem key={course.id} onClick={() => onOpenCourse(course.id)}>
          <CourseHeader>
            <CourseTitle>{course.title}</CourseTitle>
            <CourseFee>
              <span>수강료</span>
              <strong>{formatMoney(course.fee)}</strong>
            </CourseFee>
          </CourseHeader>
          <CourseMeta>
            <code>{course.code}</code>
            <CourseStatus data-type={course.status}>
              {statusLabel(course.status)}
            </CourseStatus>
          </CourseMeta>
        </CourseItem>
      ))}
    </CourseList>
  );
}
