import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { TableBase as UITable, PrimaryBtn as UIPrimaryBtn } from '@/components/common/UI';
import type { Student } from '@/api/students';
import { formatPhone } from '@/lib/format';
import { Section, SectionHead, Title, AlertError as ErrorBanner } from '@/components/courseDetail/CourseDetail.styles';
import Pagination from '@/components/common/Pagination';

type Props = {
  students: Student[];
  loading: boolean;
  error: string | null;
  editHref: string;
  showAddButton?: boolean; // default true; hide in teacher view
};

const ITEMS_PER_PAGE = 5;

export default function CourseStudentsPanel({ students, loading, error, editHref, showAddButton = true }: Props) {
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(students.length / ITEMS_PER_PAGE);
  const paginatedStudents = useMemo(() => {
    const startIndex = currentPage * ITEMS_PER_PAGE;
    return students.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [students, currentPage]);

  return (
    <Section>
      <SectionHead>
        <div>
          <Title>수강생 목록</Title>
          <Muted>총 {students.length}명의 학생이 수강중입니다.</Muted>
        </div>
        {showAddButton && <UIPrimaryBtn to={editHref}>수강생 관리</UIPrimaryBtn>}
      </SectionHead>
      {loading && <Muted>불러오는 중...</Muted>}
      {error && <ErrorBanner>{error}</ErrorBanner>}
      <TableWrap>
        <Table>
          <thead>
            <tr>
              <th>학생명</th>
              <th>연락처</th>
              <th>등록일</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {paginatedStudents.length === 0 && !loading ? (
              <tr>
                <td colSpan={4} style={{ color: '#6b7280' }}>등록된 학생이 없습니다.</td>
              </tr>
            ) : (
              paginatedStudents.map((s) => (
                <tr key={s.id}>
                  <td>
                    <strong>{s.name}</strong>
                    <SmallMuted>{s.code}</SmallMuted>
                  </td>
                  <td>{formatPhone(s.phoneNumber)}</td>
                  <td>{s.joinedDate || '-'}</td>
                  <td>
                    <StatusTag data-type={s.status}>{statusText(s.status)}</StatusTag>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </TableWrap>
      {totalPages > 1 && (
        <Pagination
          page={currentPage}
          totalPages={totalPages}
          onChangePage={setCurrentPage}
        />
      )}
    </Section>
  );
}

function statusText(s: Student['status']) {
  switch (s) {
    case 'ENROLLED': return '수강중';
    case 'ON_LEAVE': return '휴학';
    case 'PENDING': return '대기';
    default: return s;
  }
}

const Muted = styled.p`
  margin: 0;
  color: ${(p) => p.theme.colors.textMuted};
  font-size: ${(p) => p.theme.font.size.xs};
`;
const TableWrap = styled.div``;
const Table = styled(UITable)`
  thead th { background:#f9fafb; text-align: center; }
  tbody td { text-align: center; }
  tbody tr:nth-child(even) td { background:#fcfcfd; }
  tbody tr:hover td { background:#f8fafc; }
`;
const SmallMuted = styled.div`
  color: #6b7280; font-size: 11px;
`;
const StatusTag = styled.span`
  padding: 2px 8px; border-radius: 9999px; font-size: 12px; font-weight: 800;
  &[data-type='ENROLLED'] { background:#dcfce7; color:#16a34a; }
  &[data-type='ON_LEAVE'] { background:#fef3c7; color:#b45309; }
  &[data-type='PENDING'] { background:#f3e8ff; color:#7c3aed; }
`;
