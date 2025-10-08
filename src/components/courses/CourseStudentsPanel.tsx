import React from 'react';
import styled from 'styled-components';
import { SectionCard as Section, TitleH3 as Title, TableBase as UITable, PrimaryBtn as UIPrimaryBtn } from '@/components/common/UI';
import type { Student } from '@/api/students';
import { formatPhone } from '@/lib/format';

type Props = {
  students: Student[];
  loading: boolean;
  error: string | null;
  editHref: string;
};

export default function CourseStudentsPanel({ students, loading, error, editHref }: Props) {
  return (
    <Section>
      <Head>
        <div>
          <Title style={{ margin: 0 }}>수강생 목록</Title>
          <Muted>총 {students.length}명의 학생이 수강중입니다.</Muted>
        </div>
        <UIPrimaryBtn to={editHref}>학생 추가</UIPrimaryBtn>
      </Head>
      {loading && <Muted>불러오는 중...</Muted>}
      {error && <AlertError>{error}</AlertError>}
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
            {students.length === 0 && !loading ? (
              <tr>
                <td colSpan={4} style={{ color: '#6b7280' }}>등록된 학생이 없습니다.</td>
              </tr>
            ) : (
              students.map((s) => (
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

const Head = styled.div`
  display: flex; align-items: center; justify-content: space-between;
`;
const Muted = styled.div`
  color: #6b7280; font-size: 12px;
`;
const AlertError = styled.div`
  color: #b91c1c; background: #fee2e2; border: 1px solid #fecaca; padding: 8px 10px; border-radius: 8px; font-size: 13px;
`;
const TableWrap = styled.div` overflow: auto; `;
const Table = styled(UITable)`
  thead th { background:#f9fafb; }
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

