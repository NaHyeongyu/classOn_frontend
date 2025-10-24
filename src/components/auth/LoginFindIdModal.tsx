import Modal from "@/components/common/Modal";
import {
  CodeStatus,
  ModalActions,
  ModalError,
  ModalForm,
  ModalGhostButton,
  ModalHint,
  ModalInput,
  ModalLabel,
  ModalPrimaryButton,
  SendCodeRow,
} from "@/components/auth/LoginModalStyles";
import styled from "styled-components";
import { forwardRef, type RefObject } from "react";
import type {
  FoundAccount,
  LoginFindIdModalState,
} from "@/features/auth/hooks/useLoginPage";

type LoginFindIdModalProps = {
  modal: LoginFindIdModalState;
  onSelectReset: (account?: FoundAccount, phone?: string) => void;
};

export const LoginFindIdModal = forwardRef<HTMLInputElement, LoginFindIdModalProps>(
  function LoginFindIdModal({ modal, onSelectReset }, phoneRef) {
    return (
      <Modal
        open={modal.open}
        onClose={modal.closeModal}
        title="아이디 찾기"
        initialFocusRef={phoneRef as RefObject<HTMLInputElement>}
      >
        <ModalForm onSubmit={modal.submit}>
          <ModalLabel htmlFor="find-phone">가입자 연락처</ModalLabel>
          <ModalInput
            id="find-phone"
            ref={phoneRef}
            value={modal.phone}
            onChange={(event) => modal.setPhone(event.target.value)}
            placeholder="휴대폰 번호 (숫자만)"
            inputMode="numeric"
            maxLength={11}
            aria-invalid={modal.submitted && modal.digits.length !== 11}
          />
          <ModalHint>가입자 휴대폰 번호로 인증번호를 받아주세요.</ModalHint>
          <SendCodeRow>
            <ModalGhostButton
              type="button"
              onClick={modal.sendCode}
              disabled={
                modal.requestingCode ||
                modal.cooldown > 0 ||
                modal.digits.length !== 11 ||
                !modal.digits.startsWith("010")
              }
            >
              {modal.requestingCode
                ? "발송 중..."
                : modal.cooldown > 0
                ? `${modal.cooldown}초 후 재전송`
                : "인증번호 발송"}
            </ModalGhostButton>
            {modal.message ? <CodeStatus>{modal.message}</CodeStatus> : null}
          </SendCodeRow>
          {modal.codeVisible ? (
            <>
              <ModalLabel htmlFor="find-code">인증번호</ModalLabel>
              <ModalInput
                id="find-code"
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
          {modal.accounts.length > 0 ? (
            <ResultBox>
              <ResultTitle>조회된 아이디</ResultTitle>
              <ResultList>
                {modal.accounts.map((account) => (
                  <ResultItem key={account.username}>
                    <strong>{account.username}</strong>
                    <ResultItemButton
                      type="button"
                      onClick={() => onSelectReset(account, modal.phone)}
                    >
                      비밀번호 찾기
                    </ResultItemButton>
                  </ResultItem>
                ))}
              </ResultList>
              <ResultNote>
                비밀번호가 기억나지 않는 계정을 선택하여 임시 비밀번호를
                발급받을 수 있습니다.
              </ResultNote>
            </ResultBox>
          ) : null}
          <ModalActions>
            <ModalGhostButton type="button" onClick={modal.closeModal}>
              닫기
            </ModalGhostButton>
            <ModalPrimaryButton type="submit" disabled={modal.loading}>
              {modal.loading ? "조회 중..." : "조회"}
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

const ResultList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 10px;
`;

const ResultItem = styled.li`
  padding: 12px 16px;
  border-radius: 12px;
  background: #fff;
  border: 1px solid #e0e7ff;
  box-shadow: 0 6px 14px rgba(79, 70, 229, 0.08);
  display: flex;
  align-items: center;
  gap: 12px;
  strong {
    font-size: 16px;
    color: #1f2937;
    flex: 1;
  }
`;

const ResultItemButton = styled.button`
  border: none;
  background: transparent;
  color: #4f46e5;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  &:hover {
    text-decoration: underline;
  }
`;

const ResultNote = styled.p`
  margin: 14px 0 0;
  font-size: 12px;
  color: #475569;
`;
