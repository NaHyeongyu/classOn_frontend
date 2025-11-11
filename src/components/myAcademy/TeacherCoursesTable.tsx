import styled from "styled-components";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { TeacherCourseBrief } from "@/api/teachers";
import { SectionCard as Card, Scroller, TableBase as Table } from "@/components/common/UI";
import { CourseStatusBadge } from "@/components/common/CourseStatusBadge";

type TeacherCoursesTableProps = {
  courses: TeacherCourseBrief[];
  onChangeInstructor?: (course: TeacherCourseBrief) => void;
  actionLabel?: string;
};

const dayOrder: Record<string, number> = {
  MON: 0,
  TUE: 1,
  WED: 2,
  THU: 3,
  FRI: 4,
  SAT: 5,
  SUN: 6,
};

function dayLabel(code: string) {
  const map: Record<string, string> = {
    MON: "월",
    TUE: "화",
    WED: "수",
    THU: "목",
    FRI: "금",
    SAT: "토",
    SUN: "일",
  };
  return map[code.toUpperCase()] || code;
}

function buildDays(course: TeacherCourseBrief) {
  const raw = course.recurrenceDays;
  if (Array.isArray(raw)) {
    return raw
      .slice()
      .map((item) => String(item).trim().toUpperCase())
      .filter(Boolean)
      .sort((a, b) => (dayOrder[a] ?? 0) - (dayOrder[b] ?? 0))
      .map(dayLabel)
      .join("/");
  }
  if (typeof raw === "string" && raw.trim()) {
    return raw
      .split(",")
      .map((value) => value.trim().toUpperCase())
      .filter(Boolean)
      .sort((a, b) => (dayOrder[a] ?? 0) - (dayOrder[b] ?? 0))
      .map(dayLabel)
      .join("/");
  }
  return "-";
}

function sliceTime(value?: string | null) {
  if (!value) return "";
  const [hh, mm] = String(value).split(":");
  return `${hh}:${mm}`;
}

function buildTimeRange(course: TeacherCourseBrief) {
  if (course.startTime && course.endTime) {
    return `${sliceTime(course.startTime)} ~ ${sliceTime(course.endTime)}`;
  }
  if (course.courseTime) return course.courseTime;
  return "-";
}

function courseTypeLabel(type?: string | null) {
  switch (type) {
    case "INDIVIDUAL":
      return "개인";
    case "GROUP":
      return "단체";
    default:
      return "-";
  }
}

export function TeacherCoursesTable({ courses, onChangeInstructor, actionLabel }: TeacherCoursesTableProps) {
  const navigate = useNavigate();
  const showActions = typeof onChangeInstructor === "function";

  const rows = useMemo(() => {
    const total = courses.length;
    return courses.map((course, index) => ({
      seq: total - index,
      id: course.id,
      title: course.title,
      type: courseTypeLabel(course.courseType),
      days: buildDays(course),
      time: buildTimeRange(course),
      course,
      status: course.status,
    }));
  }, [courses]);

  const columns = useMemo(() => {
    const base = [
      { key: "seq", width: "8%" }, // 번호
      { key: "title", width: "32%" }, // 수업명
      { key: "type", width: "12%" }, // 유형
      { key: "days", width: "18%" }, // 요일
      { key: "time", width: "18%" }, // 시간
      { key: "status", width: "12%" }, // 상태
    ];
    return showActions ? [...base, { key: "actions", width: "12%" }] : base;
  }, [showActions]);

  return (
    <Card>
      <TableHead>
        <div>
          <strong>담당 수업</strong>
          <Muted>{courses.length ? `총 ${courses.length}개 수업` : "담당 중인 수업이 없습니다."}</Muted>
        </div>
      </TableHead>
      {courses.length === 0 ? (
        <EmptyState>담당 중인 수업이 없습니다.</EmptyState>
      ) : (
        <Scroller>
          <StyledTable>
            <colgroup>
              {columns.map((col) => (
                <col key={col.key} style={{ width: col.width }} />
              ))}
            </colgroup>
            <thead>
              <tr>
                <th>번호</th>
                <th>수업명</th>
                <th>유형</th>
                <th>요일</th>
                <th>시간</th>
                <th>상태</th>
                {showActions ? <th>강사 변경</th> : null}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  data-clickable="true"
                  onClick={() => navigate(`/classes/${row.id}`)}
                >
                  <td>{row.seq}</td>
                  <td>
                    <TitleText>{row.title}</TitleText>
                  </td>
                  <td>{row.type}</td>
                  <td>{row.days}</td>
                  <td>{row.time}</td>
                  <td>
                    <CourseStatusBadge status={row.status} />
                  </td>
                  {showActions ? (
                    <td>
                      <ActionButton
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          onChangeInstructor?.(row.course);
                        }}
                      >
                        {actionLabel ?? "수정"}
                      </ActionButton>
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </Scroller>
      )}
    </Card>
  );
}

const TableHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 10px;
`;

const Muted = styled.span`
  display: block;
  margin-top: 4px;
  color: #6b7280;
  font-size: 12px;
`;

const EmptyState = styled.div`
  border: 1px dashed #d1d5db;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  color: #6b7280;
  font-size: 14px;
  background: #f9fafb;
`;

const StyledTable = styled(Table)`
  table-layout: fixed;
  width: 100%;
  thead th {
    background: #f8fafc;
    color: #334155;
    font-weight: 800;
    text-align: center;
  }
  thead th,
  tbody td {
    vertical-align: middle;
    padding: 12px;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    border-right: 1px solid #f1f5f9;
  }
  thead th:last-child,
  tbody td:last-child {
    border-right: none;
  }
  tbody td {
    font-size: 13.5px;
    color: #0f172a;
  }
  tbody tr[data-clickable="true"] {
    cursor: pointer;
  }
  tbody tr[data-clickable="true"]:active td {
    background: ${({ theme }) => theme.colors.surfaceAlt};
  }
`;

const TitleText = styled.span`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  white-space: normal;
  line-height: 1.4;
  max-height: calc(1.4em * 2);
`;

const ActionButton = styled.button`
  border: 1px solid #cbd5f5;
  border-radius: 999px;
  padding: 4px 14px;
  font-size: 12px;
  font-weight: 600;
  color: #4f46e5;
  background: #fff;
  cursor: pointer;
  &:hover {
    background: #eef2ff;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
