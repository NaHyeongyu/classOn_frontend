import styled from "styled-components";
import { TableBase as UITable } from "@/components/common/UI";
import { Empty, Muted, SmallMuted } from "./StudentDetailStyles";

type GradeEntry = {
  id: string;
  subject?: string | null;
  courseId?: number;
  date?: string;
  score?: number | null;
  outOf?: number | null;
  level?: string | null;
  note?: string | null;
};

type CourseSummary = {
  id: number;
  title: string;
};

type Props = {
  grades: GradeEntry[];
  courses?: CourseSummary[];
  loading: boolean;
  error: string | null;
};

export function StudentGradesTab({
  grades,
  courses,
  loading,
  error,
}: Props) {
  const courseTitleMap = buildCourseTitleMap(courses);

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }
  if (loading) {
    return <Muted>시험 성적을 불러오는 중...</Muted>;
  }
  if (!grades.length) {
    return <Empty>등록된 성적이 없습니다.</Empty>;
  }

  return (
    <UITable style={{ minWidth: 720 }}>
      <thead>
        <tr>
          <th>시험/과목</th>
          <th>수업</th>
          <th>일자</th>
          <th>성적</th>
        </tr>
      </thead>
      <tbody>
        {grades.map((grade) => (
          <tr key={grade.id}>
            <td>
              <div style={{ display: "grid" }}>
                <strong>{grade.subject || "성적"}</strong>
                {grade.note && (
                  <SmallMuted
                    style={{
                      maxWidth: 420,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {grade.note}
                  </SmallMuted>
                )}
              </div>
            </td>
            <td>{courseTitleMap.get(grade.courseId ?? -1) ?? "-"}</td>
            <td>{grade.date || "-"}</td>
            <td>{formatScore(grade)}</td>
          </tr>
        ))}
      </tbody>
    </UITable>
  );
}

function buildCourseTitleMap(
  courses?: CourseSummary[]
): Map<number, string> {
  const map = new Map<number, string>();
  if (!courses) return map;
  for (const course of courses) {
    map.set(course.id, course.title);
  }
  return map;
}

function formatScore(grade: GradeEntry): string {
  if (grade.level) return grade.level;
  if (grade.score != null) {
    const suffix =
      grade.outOf != null && Number.isFinite(grade.outOf)
        ? `/${grade.outOf}`
        : "";
    return `${grade.score}${suffix}`;
  }
  return "-";
}

const ErrorMessage = ({ children }: { children: string }) => (
  <ErrorText>{children}</ErrorText>
);

const ErrorText = styled.div`
  color: #b91c1c;
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 8px;
`;
