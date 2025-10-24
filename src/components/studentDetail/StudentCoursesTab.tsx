import {
  CourseHeader,
  CourseItem,
  CourseList,
  CourseMeta,
  CourseStatus,
  CourseTitle,
  Empty,
  ModalBtn,
} from "./StudentDetailStyles";

type CourseSummary = {
  id: number;
  title: string;
  code: string;
  status: string;
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
        <CourseItem key={course.id}>
          <CourseHeader>
            <CourseTitle>{course.title}</CourseTitle>
            <ModalBtn type="button" onClick={() => onOpenCourse(course.id)}>
              상세
            </ModalBtn>
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
