import styled from "styled-components";
import {
  KPI,
  Muted,
  SmallCard,
  SmallTitle,
  Subgrid,
} from "./StudentDetailStyles";
import { TableBase as UITable } from "@/components/common/UI";
import type { StudentAttendance } from "@/api/students";

type Props = {
  rows: StudentAttendance[];
  loading: boolean;
  error: string | null;
};

export function StudentAttendanceTab({ rows, loading, error }: Props) {
  return (
    <>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Subgrid>
        <SmallCard>
          <SmallTitle>이번 달 출석률</SmallTitle>
          <KPI>{formatMonthRate(rows)}</KPI>
          <Muted>{formatMonthCounts(rows)}</Muted>
        </SmallCard>
        <SmallCard>
          <SmallTitle>최근 결석</SmallTitle>
          <Muted>{formatRecentAbsents(rows)}</Muted>
        </SmallCard>
      </Subgrid>
      {loading ? (
        <Muted>불러오는 중...</Muted>
      ) : (
        <UITable style={{ minWidth: 640 }}>
          <thead>
            <tr>
              <th>날짜</th>
              <th>과목</th>
              <th>상태</th>
              <th>메모</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={4}>
                  <Muted>출석 기록이 없습니다.</Muted>
                </td>
              </tr>
            ) : (
              rows.map((row, idx) => (
                <tr key={`${row.date}-${row.courseId}-${idx}`}>
                  <td>{row.date}</td>
                  <td>{row.courseTitle}</td>
                  <td>{row.present ? "출석" : "결석"}</td>
                  <td>{row.reason || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </UITable>
      )}
    </>
  );
}

const ErrorMessage = ({ children }: { children: string }) => (
  <ErrorBox>{children}</ErrorBox>
);

const ErrorBox = styled.div`
  color: #b91c1c;
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 8px;
`;

function formatMonthRate(rows: StudentAttendance[]): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  const monthRows = rows.filter((r) => {
    const [yy, mm] = r.date.split("-").map(Number);
    return yy === y && mm === m;
  });
  if (monthRows.length === 0) return "—";
  const present = monthRows.filter((r) => r.present).length;
  return `${Math.round((present / monthRows.length) * 100)}%`;
}

function formatMonthCounts(rows: StudentAttendance[]): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  const monthRows = rows.filter((r) => {
    const [yy, mm] = r.date.split("-").map(Number);
    return yy === y && mm === m;
  });
  if (monthRows.length === 0) return "이번 달 기록 없음";
  const present = monthRows.filter((r) => r.present).length;
  const absent = monthRows.length - present;
  return `출석 ${present} · 결석 ${absent}`;
}

function formatRecentAbsents(rows: StudentAttendance[]): string {
  const recent = rows
    .filter((r) => !r.present)
    .slice(0, 3)
    .map((r) => `${r.date} ${r.courseTitle}`);
  if (recent.length === 0) return "최근 결석 없음";
  return recent.join(", ");
}
