import React from 'react';
import styled from 'styled-components';
import { SectionCard as Section, TitleH3 as Title, GhostButtonSmall as UIGhostButtonSmall, PrimaryButton as UIPrimaryButton, TableBase as UITable } from '@/components/common/UI';
import Modal from '@/components/common/Modal';
import type { Exam } from '@/api/exams';

type Props = {
  exams: Exam[];
  loading: boolean;
  error: string | null;
  onCreate: () => void;
  onEdit: (exam: Exam) => void;
  onDelete: (exam: Exam) => void;
  // modal
  modalOpen: boolean;
  modalMode: 'create' | 'edit';
  examMode: 'percent' | 'letter';
  examFormError: string | null;
  examSaving: boolean;
  onCloseModal: () => void;
  onSubmitModal: () => void;
  onExamModeChange: (mode: 'percent'|'letter') => void;
  examTitleRef: React.RefObject<HTMLInputElement>;
  onExamTitleChange: (val: string) => void;
};

export default function CourseExamsPanel({
  exams,
  loading,
  error,
  onCreate,
  onEdit,
  onDelete,
  modalOpen,
  modalMode,
  examMode,
  examFormError,
  examSaving,
  onCloseModal,
  onSubmitModal,
  onExamModeChange,
  examTitleRef,
  onExamTitleChange,
}: Props) {
  return (
    <Section>
      <Head>
        <div>
          <Title style={{ margin: 0 }}>시험 관리</Title>
          <Muted>수업과 연결된 시험을 확인하고 추가합니다.</Muted>
        </div>
        <UIPrimaryButton type="button" onClick={onCreate}>시험 생성</UIPrimaryButton>
      </Head>
      {loading && <Muted>시험을 불러오는 중...</Muted>}
      {error && <AlertError>{error}</AlertError>}
      {exams.length === 0 ? (
        <Empty>
          <p>아직 등록된 시험이 없습니다.</p>
        </Empty>
      ) : (
        <TableWrap>
          <Table>
            <thead>
              <tr>
                <th>시험명</th>
                <th>형태</th>
                <th>평균</th>
                <th className="manage">
                  <div className="manage-header" aria-hidden="true">
                    <span className="manage-label">관리</span>
                  </div>
                  <span className="sr-only">관리</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {exams.map((exam) => (
                <tr key={exam.id}>
                  <td>
                    <NameCell>
                      <span className="name">{exam.title}</span>
                    </NameCell>
                  </td>
                  <td>{examModeLabel(exam.inputMode)}</td>
                  <td>{renderAverage(exam)}</td>
                  <td className="manage">
                    <div className="actions">
                      <UIGhostButtonSmall type="button" data-variant="edit" onClick={() => onEdit(exam)}>수정</UIGhostButtonSmall>
                      <UIGhostButtonSmall type="button" data-variant="danger" onClick={() => onDelete(exam)}>삭제</UIGhostButtonSmall>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrap>
      )}

      <Modal
        open={modalOpen}
        title={modalMode === 'edit' ? '시험 수정' : '시험 추가'}
        onClose={onCloseModal}
        footer={(
          <div style={{ display: 'inline-flex', gap: 8 }}>
            <UIGhostButtonSmall type="button" onClick={onCloseModal}>취소</UIGhostButtonSmall>
            <UIPrimaryButton type="button" onClick={onSubmitModal} disabled={examSaving}>{examSaving ? '저장 중…' : (modalMode === 'edit' ? '수정' : '등록')}</UIPrimaryButton>
          </div>
        )}
      >
        <Form>
          {examFormError && <AlertError>{examFormError}</AlertError>}
          <Label htmlFor="exam-title">시험 제목</Label>
          <TitleInput id="exam-title" ref={examTitleRef} placeholder="예: 중간고사 수학" onChange={(e) => onExamTitleChange(e.currentTarget.value)} />
          <Label>입력 방식</Label>
          <div style={{ display: 'inline-flex', gap: 12 }}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <input type="radio" name="examMode" checked={examMode === 'percent'} onChange={() => onExamModeChange('percent')} />
              <span>백분율</span>
            </label>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <input type="radio" name="examMode" checked={examMode === 'letter'} onChange={() => onExamModeChange('letter')} />
              <span>등급</span>
            </label>
          </div>
        </Form>
      </Modal>
    </Section>
  );
}

function examModeLabel(mode?: Exam['inputMode']) {
  switch (mode) {
    case 'percent':
      return '백분율';
    case 'letter':
      return '등급';
    default:
      return '백분율';
  }
}

function renderAverage(exam: Exam): string {
  if (exam.averageScore == null) return '—';
  if (exam.inputMode === 'letter') return averageToLetter(exam.averageScore);
  const rounded = Math.round(exam.averageScore * 10) / 10;
  const formatted = Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
  return `${formatted}점`;
}

function averageToLetter(n: number): string {
  const v = Math.round(n);
  if (v >= 90) return 'A';
  if (v >= 80) return 'B';
  if (v >= 70) return 'C';
  if (v >= 60) return 'D';
  if (v >= 50) return 'E';
  return 'F';
}

const Head = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const Muted = styled.div`
  color: #6b7280;
  font-size: 12px;
`;
const AlertError = styled.div`
  color: #b91c1c;
  background: #fee2e2;
  border: 1px solid #fecaca;
  padding: 8px 10px;
  border-radius: 8px;
  font-size: 13px;
`;
const TableWrap = styled.div`
  overflow: auto;
`;
const Table = styled(UITable)`
  width: 100%;
  thead th, tbody td { vertical-align: middle; }
  thead th:first-child, tbody td:first-child { text-align: left; width: 40%; }
  thead th:nth-child(2), tbody td:nth-child(2), thead th:nth-child(3), tbody td:nth-child(3) { width: 20%; text-align: center; }
  thead th.manage, tbody td.manage { width: 160px; text-align: right; white-space: nowrap; }
  thead th.manage { position: relative; }
  thead th.manage .sr-only { position: absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0; }
  thead th.manage .manage-header { display:inline-flex; align-items:center; justify-content:flex-end; gap:6px; width:100%; font-size:12px; color:#94a3b8; }
  thead th.manage .manage-label { color:#1f2937; font-weight:600; }
  tbody td.manage .actions { display:inline-flex; gap:6px; justify-content:flex-end; flex-wrap:nowrap; }
`;
const Empty = styled.div`
  display: grid; gap: 12px; padding: 24px; border: 1px dashed #e2e8f0; border-radius: 12px; background: #f8fafc; text-align: center;
  p { margin: 0; color: #475569; font-size: 14px; font-weight: 600; }
`;
const NameCell = styled.div`
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  .name { font-weight: 700; color: #1f2937; }
`;
const Form = styled.div`
  display: grid; gap: 10px;
`;
const Label = styled.label`
  color: #6b7280; font-size: 12px; font-weight: 700;
`;
const TitleInput = styled.input`
  height: 40px; border: 1px solid #e5e7eb; border-radius: 10px; padding: 0 12px; font-size: 14px; color: #111827; width: 100%;
`;
