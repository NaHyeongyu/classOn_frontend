import styled from "styled-components";
import { SectionCard, GhostButton, TableBase, Skeleton, EmptyState } from "@/components/common/UI";
import Pagination from "@/components/common/Pagination";
import { formatMoney } from "@/lib/format";
import type { Student } from "@/api/students";
import { HeaderFlex, Input, Checkbox, BadgeButton, SmallText } from "./styles";
import { resolveStudentStatus, studentStatusColor, defaultAmountForStudent } from "./utils";
import type { StudentOverride } from "./types";

interface StudentListSectionProps {
  students: Student[];
  isLoading: boolean;
  selectedIds: number[];
  onToggleSelect: (id: number) => void;
  onSelectAll: () => void;
  allSelected: boolean;
  hasStudents: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  overrides: Record<number, StudentOverride>;
  onEditOverride: (id: number) => void;
}

export function StudentListSection({
  students,
  isLoading,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  allSelected,
  hasStudents,
  search,
  onSearchChange,
  page,
  totalPages,
  onPageChange,
  overrides,
  onEditOverride,
}: StudentListSectionProps) {
  return (
    <SectionCard>
      <HeaderFlex>
        <div>
          <h3>학생 목록</h3>
          <SmallText>이름 / 수강 수업 / 청구 금액을 확인하고 선택하세요.</SmallText>
        </div>
        <GhostButton type="button" onClick={onSelectAll} disabled={!hasStudents}>
          {allSelected ? "전체 해제" : "전체 선택"}
        </GhostButton>
      </HeaderFlex>
      <SearchLabel>
        학생 검색
        <Input
          type="text"
          placeholder="이름 검색"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </SearchLabel>
      <TableWrapper>
        <StyledTable>
          <colgroup>
            <col style={{ width: "48px" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "28%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "22%" }} />
            <col />
          </colgroup>
          <thead>
            <tr>
              <th />
              <th>이름</th>
              <th>수강 수업</th>
              <th>상태</th>
              <th>청구 금액</th>
              <th>작업</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6}>
                  <Skeleton h={36} />
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <EmptyState>조건에 맞는 학생이 없습니다.</EmptyState>
                </td>
              </tr>
            ) : (
              students.map((student: Student) => {
                const courseNameList =
                  (student.courses ?? [])
                    .map((course: NonNullable<Student["courses"]>[number]) => {
                      const title = course?.title?.trim();
                      const code = course?.code?.trim();
                      return title || code || null;
                    })
                    .filter((value: string | null): value is string => Boolean(value && value.trim()));
                const courseTitles = courseNameList.length ? courseNameList.join(", ") : "-";
                const fee = defaultAmountForStudent(student);
                const selected = selectedIds.includes(student.id);
                const canEdit = selected && selectedIds.length >= 2;
                const overrideApplied = Boolean(overrides[student.id]);
                const showIcon = canEdit || overrideApplied;
                return (
                  <tr key={student.id} data-selected={selected}>
                    <td>
                      <Checkbox
                        type="checkbox"
                        checked={selected}
                        onChange={() => onToggleSelect(student.id)}
                      />
                    </td>
                    <td>
                      <strong>{student.name}</strong>
                      <Meta>{student.code}</Meta>
                    </td>
                    <td>{courseTitles || "-"}</td>
                    <td>
                      <StudentStatusBadge data-status={student.status ?? undefined}>
                        {resolveStudentStatus(student.status)}
                      </StudentStatusBadge>
                    </td>
                    <td className="amount-cell">{formatMoney(fee)}</td>
                    <td>
                      {showIcon ? (
                        <BadgeButton
                          type="button"
                          onClick={() => {
                            if (!canEdit) return;
                            onEditOverride(student.id);
                          }}
                          $active={overrideApplied}
                          disabled={!canEdit}
                        >
                          {overrideApplied ? "개별 설정됨" : "개별 설정"}
                        </BadgeButton>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </StyledTable>
      </TableWrapper>
      <Pagination page={page} totalPages={totalPages} onChangePage={onPageChange} />
    </SectionCard>
  );
}

const SearchLabel = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  color: ${(p) => p.theme.colors.textMuted};
  margin-bottom: 12px;
`;

const TableWrapper = styled.div`
  margin-top: 12px;
  overflow-x: auto;
`;

const StyledTable = styled(TableBase)`
  tbody td {
    vertical-align: middle;
    text-align: center;
  }
  tbody td.amount-cell {
    text-align: right;
    font-variant-numeric: tabular-nums;
  }
  tbody td:nth-child(2) {
    text-align: center;
  }
  tbody td:nth-child(3),
  tbody td:nth-child(4),
  tbody td:nth-child(5) {
    text-align: center;
  }
  thead th {
    text-align: center;
  }
  thead th:first-child,
  tbody td:first-child {
    width: 48px;
  }
`;

const Meta = styled.span`
  display: block;
  font-size: 12px;
  color: ${(p) => p.theme.colors.textMuted};
`;

const StudentStatusBadge = styled.span<{ "data-status"?: string }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  background: ${({ "data-status": status }) =>
    (studentStatusColor[status ?? ""] ?? "#94a3b8")}1A;
  color: ${({ "data-status": status }) => studentStatusColor[status ?? ""] ?? "#475569"};
`;
