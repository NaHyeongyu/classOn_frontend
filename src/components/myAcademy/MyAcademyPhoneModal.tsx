import Modal from "@/components/common/Modal";
import {
  ModalActions,
  ModalError,
  ModalForm,
  ModalGhostButton,
  ModalHint,
  ModalInput,
  ModalLabel,
  ModalMessage,
  ModalPrimaryButton,
  ModalSendRow,
} from "@/components/myAcademy/MyAcademyModalStyles";
import type { PhoneModalState } from "@/features/myAcademy/hooks/useMyAcademyPage";

type MyAcademyPhoneModalProps = {
  modal: PhoneModalState;
};

export function MyAcademyPhoneModal({ modal }: MyAcademyPhoneModalProps) {
  return (
    <Modal
      open={modal.open}
      onClose={modal.closeModal}
      title="휴대폰 번호 변경"
    >
      <ModalForm onSubmit={modal.submit}>
        <ModalLabel htmlFor="phone-modal-number">새 휴대폰 번호</ModalLabel>
        <ModalInput
          id="phone-modal-number"
          value={modal.value}
          onChange={(event) =>
            modal.setValue(event.target.value.replace(/\D/g, "").slice(0, 11))
          }
          placeholder="01012345678"
          inputMode="numeric"
          autoComplete="tel"
        />
        <ModalHint>010으로 시작하는 숫자 11자리를 입력해 주세요.</ModalHint>

        <ModalSendRow>
          <ModalGhostButton
            type="button"
            onClick={modal.sendCode}
            disabled={
              modal.requesting ||
              modal.cooldown > 0 ||
              modal.digits.length !== 11 ||
              !modal.digits.startsWith("010")
            }
          >
            {modal.requesting
              ? "발송 중..."
              : modal.cooldown > 0
              ? `${modal.cooldown}초 후 재전송`
              : "인증번호 발송"}
          </ModalGhostButton>
          {modal.message ? <ModalMessage>{modal.message}</ModalMessage> : null}
        </ModalSendRow>

        <ModalLabel htmlFor="phone-modal-code">인증번호</ModalLabel>
        <ModalInput
          id="phone-modal-code"
          value={modal.code}
          onChange={(event) => modal.setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder="6자리 숫자"
          inputMode="numeric"
          maxLength={6}
        />

        {modal.error ? <ModalError>{modal.error}</ModalError> : null}

        <ModalActions>
          <ModalGhostButton type="button" onClick={modal.closeModal}>
            취소
          </ModalGhostButton>
          <ModalPrimaryButton type="submit" disabled={modal.submitting}>
            {modal.submitting ? "변경 중..." : "번호 변경"}
          </ModalPrimaryButton>
        </ModalActions>
      </ModalForm>
    </Modal>
  );
}
