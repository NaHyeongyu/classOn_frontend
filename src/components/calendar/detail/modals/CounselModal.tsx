import styled from "styled-components";
import { createPortal } from "react-dom";
import SelectBox from "@/components/common/SelectBox";
import {
  GhostButton as UIGhostButton,
  PrimaryButton as UIPrimaryButton,
} from "@/components/common/UI";
import { formatPhone } from "@/lib/format";
import type { Student } from "@/api/students";

type CounselModalProps = {
  open: boolean;
  students: Student[];
  studFilter: string;
  onChangeFilter: (value: string) => void;
  studBusy: boolean;
  studErr: string | null;
  selStudent: Student | null;
  onPickStudent: (student: Student) => void;
  counselHour: string;
  counselMin: string;
  onChangeHour: (value: string) => void;
  onChangeMin: (value: string) => void;
  counselNote: string;
  onChangeNote: (value: string) => void;
  counselErr: string | null;
  onClose: () => void;
  onSave: () => void;
  savingCounsel: boolean;
  hours24: string[];
  mins5: string[];
};

export default function CounselModal({
  open,
  students,
  studFilter,
  onChangeFilter,
  studBusy,
  studErr,
  selStudent,
  onPickStudent,
  counselHour,
  counselMin,
  onChangeHour,
  onChangeMin,
  counselNote,
  onChangeNote,
  counselErr,
  onClose,
  onSave,
  savingCounsel,
  hours24,
  mins5,
}: CounselModalProps) {
  if (!open) return null;

  const filteredStudents = (students || []).filter((student) => {
    if (!studFilter) return true;
    const query = studFilter.toLowerCase();
    return (
      student.name.toLowerCase().includes(query) ||
      (student.code || "").toLowerCase().includes(query)
    );
  });

  const disableSave =
    savingCounsel || !counselHour || !counselMin || !selStudent;

  const modalContent = (
    <ModalBackdrop onClick={onClose}>
      <ModalCard onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="counsel-modal-title">
        <ModalTitle id="counsel-modal-title">상담 추가</ModalTitle>
        <Label>학생 선택</Label>
        <Input
          placeholder="학생 검색…"
          value={studFilter}
          onChange={(event) => onChangeFilter(event.target.value)}
        />
        <StudentList>
          {studBusy && <Muted>불러오는 중…</Muted>}
          {studErr && <Err>{studErr}</Err>}
          {!studBusy &&
            !studErr &&
            filteredStudents.map((student) => (
              <StudentRow
                key={student.id}
                type="button"
                data-selected={selStudent?.id === student.id}
                onClick={() => onPickStudent(student)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onPickStudent(student);
                  }
                }}
              >
                <div>
                  <strong>{student.name}</strong>
                  <SmallText style={{ marginLeft: 8 }}>{student.code}</SmallText>
                </div>
                <SmallText>{formatPhone(student.phoneNumber)}</SmallText>
              </StudentRow>
            ))}
        </StudentList>
        <div style={{ marginTop: 8 }}>
          {selStudent ? (
            <SelectedBox>
              <span className="label">선택된 학생</span>
              <span className="name">{selStudent.name}</span>
              {selStudent.code && (
                <SmallText style={{ marginLeft: 6 }}>{selStudent.code}</SmallText>
              )}
            </SelectedBox>
          ) : (
            <Muted>학생을 선택해 주세요.</Muted>
          )}
        </div>
        <Label style={{ marginTop: 10 }}>시간</Label>
        <Row>
          <div style={{ flex: 1 }}>
            <SelectBox
              ariaLabel="시"
              value={counselHour}
              onChange={onChangeHour}
              placeholder="시"
              options={hours24.map((hour) => ({ label: hour, value: hour }))}
            />
          </div>
          <span>:</span>
          <div style={{ flex: 1 }}>
            <SelectBox
              ariaLabel="분"
              value={counselMin}
              onChange={onChangeMin}
              placeholder="분"
              options={mins5.map((minute) => ({ label: minute, value: minute }))}
            />
          </div>
        </Row>
        <Label style={{ marginTop: 10 }}>메모 (선택)</Label>
        <TextArea
          rows={3}
          value={counselNote}
          onChange={(event) => onChangeNote(event.target.value)}
          placeholder="상담 메모"
        />
        {counselErr && <Err>{counselErr}</Err>}
        <BtnRow>
          <UIGhostButton type="button" onClick={onClose}>
            취소
          </UIGhostButton>
          <UIPrimaryButton type="button" disabled={disableSave} onClick={onSave}>
            {savingCounsel ? "저장 중…" : "저장"}
          </UIPrimaryButton>
        </BtnRow>
      </ModalCard>
    </ModalBackdrop>
  );

  if (typeof document === 'undefined') return modalContent;
  return createPortal(modalContent, document.body);
}

const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.28);
  display: grid;
  place-items: center;
  z-index: 1200;
`;

const ModalCard = styled.div`
  width: 480px;
  max-width: calc(100% - 32px);
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  box-shadow: 0 8px 28px rgba(2, 6, 23, 0.08);
  padding: 18px;
`;

const ModalTitle = styled.h3`
  margin: 0 0 10px;
  font-size: 17px;
  font-weight: 700;
  color: #111827;
`;

const Label = styled.label`
  display: block;
  margin: 8px 0 6px;
  font-size: 12px;
  color: #6b7280;
`;

const Input = styled.input`
  width: 100%;
  height: 40px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 12px;
`;

const StudentList = styled.div`
  max-height: 220px;
  overflow: auto;
  border: 1px solid #f1f5f9;
  border-radius: 10px;
  margin-top: 6px;
  background: #fff;
`;

const StudentRow = styled.button`
  width: 100%;
  text-align: left;
  background: transparent;
  border: 0;
  padding: 8px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  border-bottom: 1px solid #f1f5f9;

  &[data-selected="true"] {
    background: #eef2ff;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceMuted};
  }
`;

const SmallText = styled.span`
  color: #9ca3af;
  font-size: 12px;
`;

const Muted = styled.div`
  color: #6b7280;
  font-size: 12px;
`;

const SelectedBox = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border: 1px solid #c7d2fe;
  background: #eef2ff;
  color: #1f2937;
  border-radius: 8px;
  font-size: 13px;

  .label {
    color: #4f46e5;
    font-weight: 800;
  }

  .name {
    font-weight: 800;
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const TextArea = styled.textarea`
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 8px 12px;
  resize: vertical;
`;

const BtnRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
`;

const Err = styled.div`
  color: #b91c1c;
  font-size: 12px;
  margin-top: 6px;
`;
