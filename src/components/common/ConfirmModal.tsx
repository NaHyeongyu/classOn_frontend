import styled from "styled-components";
import Modal from "@/components/common/Modal";
import { GhostButton } from "@/components/common/UI";

type ConfirmModalProps = {
  open: boolean;
  title?: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export default function ConfirmModal({
  open,
  title = "확인",
  description,
  confirmText = "확인",
  cancelText = "취소",
  loading = false,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  return (
    <Modal
      open={open}
      onClose={loading ? undefined : onClose}
      title={title}
      maxWidth={420}
      blockOutsideClose={loading}
    >
      <Description>{description}</Description>
      <Actions>
        <GhostButton type="button" onClick={onClose} disabled={loading}>
          {cancelText}
        </GhostButton>
        <GhostButton
          type="button"
          data-variant="danger"
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? "처리 중..." : confirmText}
        </GhostButton>
      </Actions>
    </Modal>
  );
}

const Description = styled.p`
  margin: 0;
  color: ${(p) => p.theme.colors.text};
  line-height: ${(p) => p.theme.font.lineHeight.relaxed};
`;

const Actions = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

