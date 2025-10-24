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
  SendCodeRow,
} from "@/components/auth/LoginModalStyles";
import type { LoginResetModalState } from "@/features/auth/hooks/useLoginPage";
import styled from "styled-components";
import { forwardRef, type RefObject } from "react";

export const LoginResetPasswordModal = forwardRef<HTMLInputElement, { modal: LoginResetModalState }>(
  function LoginResetPasswordModal({ modal }, phoneRef) {
    return (
      <Modal
        open={modal.open}
        onClose={modal.closeModal}
        title="비밀번호 찾기"
        initialFocusRef={phoneRef as RefObject<HTMLInputElement>}
      >
        <ModalForm onSubmit={modal.submit}>
          <ModalLabel htmlFor="reset-username">아이디</ModalLabel>
          <ModalInput
            id="reset-username"
            value={modal.username}
            onChange={(event) => modal.setUsername(event.target.value)}
            placeholder="아이디를 입력하세요"
            aria-invalid={modal.submitted && !modal.username.trim()}
          />

          <ModalLabel htmlFor="reset-phone">휴대폰 번호</ModalLabel>
          <ModalInput
            id="reset-phone"
            ref={phoneRef}
            value={modal.phone}
            onChange={(event) => modal.setPhone(event.target.value)}
            placeholder="휴대폰 번호 (숫자만)"
            inputMode="numeric"
            maxLength={11}
            aria-invalid={modal.submitted && modal.digits.length !== 11}
          />
          <ModalHint>
            아이디와 휴대폰 번호가 일치하면 임시 비밀번호를 발급해 드립니다.
          </ModalHint>

          <SendCodeRow>
            <ModalGhostButton
              type="button"
              onClick={modal.sendCode}
              disabled={
                modal.requestingCode ||
                modal.cooldown > 0 ||
                modal.digits.length !== 11 ||
                !modal.digits.startsWith("010") ||
                !modal.username.trim()
              }
            >
              {modal.requestingCode
                ? "발송 중..."
                : modal.cooldown > 0
                ? `${modal.cooldown}초 후 재전송`
                : "인증번호 발송"}
            </ModalGhostButton>
            {modal.message ? <ModalMessage>{modal.message}</ModalMessage> : null}
          </SendCodeRow>

          {modal.codeVisible ? (
            <>
              <ModalLabel htmlFor="reset-code">인증번호</ModalLabel>
              <ModalInput
                id="reset-code"
                ref={modal.codeRef}
                value={modal.code}
                onChange={(event) => modal.setCode(event.target.value)}
                placeholder="6자리 숫자"
                inputMode="numeric"
                maxLength={6}
                aria-invalid={modal.submitted && modal.code.trim().length < 6}
              />
              <ModalHint>수신한 6자리 인증번호를 입력해 주세요.</ModalHint>
            </>
          ) : null}

          {modal.error ? <ModalError>{modal.error}</ModalError> : null}
          {modal.result ? (
            <ResultBox>
              <ResultTitle>임시 비밀번호</ResultTitle>
              <p>
                <TempPasswordStrong>{modal.result}</TempPasswordStrong>
              </p>
              <ResultNote>로그인 후 비밀번호를 꼭 변경해 주세요.</ResultNote>
            </ResultBox>
          ) : null}

          <ModalActions>
            <ModalGhostButton type="button" onClick={modal.closeModal}>
              닫기
            </ModalGhostButton>
            <ModalPrimaryButton type="submit" disabled={modal.submitting}>
              {modal.submitting ? "발급 중..." : "임시 비밀번호 발급"}
            </ModalPrimaryButton>
          </ModalActions>
        </ModalForm>
      </Modal>
    );
  },
);

const ResultBox = styled.div`
  border: 2px solid #4f46e5;
  background: #eef2ff;
  border-radius: 14px;
  padding: 16px;
  font-size: 13px;
  color: #1f2937;
  box-shadow: 0 10px 24px rgba(79, 70, 229, 0.18);
`;

const ResultTitle = styled.div`
  font-weight: 800;
  color: #312e81;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
`;

const ResultNote = styled.p`
  margin: 6px 0 0;
  font-size: 12px;
  color: #64748b;
`;

const TempPasswordStrong = styled.span`
  font-weight: 800;
  color: #1f2937;
  font-size: 16px;
`;
