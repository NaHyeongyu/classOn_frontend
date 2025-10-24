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
import type { PasswordModalState } from "@/features/myAcademy/hooks/useMyAcademyPage";

type MyAcademyPasswordModalProps = {
  modal: PasswordModalState;
};

export function MyAcademyPasswordModal({ modal }: MyAcademyPasswordModalProps) {
  return (
    <Modal
      open={modal.open}
      onClose={modal.closeModal}
      title="비밀번호 변경"
    >
      <ModalForm onSubmit={modal.submit}>
        <ModalLabel htmlFor="password-current">현재 비밀번호</ModalLabel>
        <ModalInput
          id="password-current"
          type="password"
          value={modal.current}
          onChange={(event) => modal.setCurrent(event.target.value)}
          placeholder="현재 비밀번호"
          autoComplete="current-password"
        />

        <ModalLabel htmlFor="password-new">새 비밀번호</ModalLabel>
        <ModalInput
          id="password-new"
          type="password"
          value={modal.next}
          onChange={(event) => modal.setNext(event.target.value)}
          placeholder="새 비밀번호 (8자 이상)"
          autoComplete="new-password"
        />
        {modal.tooShort ? (
          <ModalHint danger>새 비밀번호는 8자 이상 입력해 주세요.</ModalHint>
        ) : null}

        <ModalLabel htmlFor="password-confirm">비밀번호 확인</ModalLabel>
        <ModalInput
          id="password-confirm"
          type="password"
          value={modal.confirm}
          onChange={(event) => modal.setConfirm(event.target.value)}
          placeholder="새 비밀번호 확인"
          autoComplete="new-password"
        />
        {modal.mismatch && !modal.tooShort ? (
          <ModalHint danger>새 비밀번호가 일치하지 않습니다.</ModalHint>
        ) : null}

        {modal.error ? <ModalError>{modal.error}</ModalError> : null}

        <ModalActions>
          <ModalGhostButton type="button" onClick={modal.closeModal}>
            취소
          </ModalGhostButton>
          <ModalPrimaryButton type="submit" disabled={modal.submitting}>
            {modal.submitting ? "변경 중..." : "비밀번호 변경"}
          </ModalPrimaryButton>
        </ModalActions>
      </ModalForm>
    </Modal>
  );
}
