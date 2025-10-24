import Modal from "@/components/common/Modal";
import {
  ModalActions,
  ModalError,
  ModalForm,
  ModalGhostButton,
  ModalHint,
  ModalInput,
  ModalLabel,
  ModalPrimaryButton,
} from "@/components/myAcademy/MyAcademyModalStyles";
import type { ProfileModalState } from "@/features/myAcademy/hooks/useMyAcademyPage";

type MyAcademyProfileModalProps = {
  modal: ProfileModalState;
};

export function MyAcademyProfileModal({ modal }: MyAcademyProfileModalProps) {
  return (
    <Modal
      open={modal.open}
      onClose={modal.closeModal}
      title="담당자 성함 수정"
    >
      <ModalForm onSubmit={modal.submit}>
        <ModalLabel htmlFor="profile-name">담당자 성함</ModalLabel>
        <ModalInput
          id="profile-name"
          value={modal.name}
          onChange={(event) => modal.setName(event.target.value)}
          placeholder="홍길동"
        />
        <ModalHint>계약 및 주요 안내를 받을 담당자 성함을 입력해 주세요.</ModalHint>

        {modal.error ? <ModalError>{modal.error}</ModalError> : null}

        <ModalActions>
          <ModalGhostButton type="button" onClick={modal.closeModal}>
            취소
          </ModalGhostButton>
          <ModalPrimaryButton type="submit" disabled={modal.submitting}>
            {modal.submitting ? "저장 중..." : "저장"}
          </ModalPrimaryButton>
        </ModalActions>
      </ModalForm>
    </Modal>
  );
}
