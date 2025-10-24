import type { FormEvent } from "react";
import styled from "styled-components";
import {
  GhostButton as UIGhostButton,
  PrimaryButton as UIPrimaryButton,
} from "@/components/common/UI";

type TodoModalProps = {
  open: boolean;
  editingId: number | null;
  formTitle: string;
  formNotes: string;
  todoErr: string | null;
  onClose: () => void;
  onSubmit: (event: FormEvent) => void;
  onChangeTitle: (value: string) => void;
  onChangeNotes: (value: string) => void;
};

export default function TodoModal({
  open,
  editingId,
  formTitle,
  formNotes,
  todoErr,
  onClose,
  onSubmit,
  onChangeTitle,
  onChangeNotes,
}: TodoModalProps) {
  if (!open) return null;

  return (
    <ModalBackdrop onClick={onClose}>
      <ModalCard onClick={(event) => event.stopPropagation()}>
        <ModalTitle>{editingId == null ? "할 일 추가" : "할 일 수정"}</ModalTitle>
        <form onSubmit={onSubmit} noValidate>
          <Label>
            제목<span>*</span>
          </Label>
          <Input
            value={formTitle}
            onChange={(event) => onChangeTitle(event.target.value)}
            placeholder="예: 상담 준비"
            aria-invalid={!!todoErr}
          />
          {todoErr && <Err>{todoErr}</Err>}
          <Label>메모 (선택)</Label>
          <TextArea
            rows={4}
            value={formNotes}
            onChange={(event) => onChangeNotes(event.target.value)}
            placeholder="세부 내용 또는 참고사항"
          />
          <BtnRow>
            <UIGhostButton type="button" onClick={onClose}>
              취소
            </UIGhostButton>
            <UIPrimaryButton type="submit">저장</UIPrimaryButton>
          </BtnRow>
        </form>
      </ModalCard>
    </ModalBackdrop>
  );
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

  span {
    color: #ef4444;
    margin-left: 4px;
  }
`;

const Input = styled.input`
  width: 100%;
  height: 40px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 12px;

  &[aria-invalid="true"] {
    border-color: #ef4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.12);
  }
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
