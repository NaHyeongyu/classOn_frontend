import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import Modal from "@/components/common/Modal";
import {
  ModalActions,
  ModalCheckboxGroup,
  ModalCheckboxLabel,
  ModalError,
  ModalForm,
  ModalGhostButton,
  ModalHint,
  ModalInput,
  ModalLabel,
  ModalPrimaryButton,
} from "@/components/myAcademy/MyAcademyModalStyles";
import type { TeacherCreateModalState } from "@/features/myAcademy/hooks/useMyAcademyPage";
import { TEACHER_MENU_OPTIONS } from "@/constants/teacherMenus";
import styled from "styled-components";

type TeacherCreateModalProps = {
  modal: TeacherCreateModalState;
};

export function TeacherCreateModal({ modal }: TeacherCreateModalProps) {
  const menuOptions = TEACHER_MENU_OPTIONS;
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [passwordCapsLock, setPasswordCapsLock] = useState(false);
  const [passwordConfirmCapsLock, setPasswordConfirmCapsLock] = useState(false);
  const usernameRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordConfirmRef = useRef<HTMLInputElement>(null);
  const menusRef = useRef<HTMLDivElement>(null);

  const handlePasswordCapsLock = (event: KeyboardEvent<HTMLInputElement>) => {
    setPasswordCapsLock(event.getModifierState?.("CapsLock") ?? false);
  };

  const handlePasswordConfirmCapsLock = (event: KeyboardEvent<HTMLInputElement>) => {
    setPasswordConfirmCapsLock(event.getModifierState?.("CapsLock") ?? false);
  };

  useEffect(() => {
    if (!modal.focusField) return;
    const refMap = {
      username: usernameRef,
      name: nameRef,
      email: null,
      phone: phoneRef,
      password: passwordRef,
      passwordConfirm: passwordConfirmRef,
      menus: menusRef,
    } as const;
    const targetRef = refMap[modal.focusField];
    const targetEl = targetRef?.current ?? null;
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
      if ("focus" in targetEl && typeof targetEl.focus === "function") {
        targetEl.focus();
      }
    }
    modal.clearFocusField();
  }, [modal.focusField, modal.clearFocusField]);

  return (
    <Modal
      open={modal.open}
      onClose={modal.closeModal}
      blockOutsideClose
      title="강사 계정 등록"
      description="새 강사 계정을 생성하면 초대 문자/메일을 통해 안내드릴 수 있습니다."
    >
      <ModalForm onSubmit={modal.submit}>
        <div>
          <ModalLabel htmlFor="teacher-create-username">아이디</ModalLabel>
          <ModalInput
            id="teacher-create-username"
            ref={usernameRef}
            value={modal.form.username}
            onChange={(event) => modal.updateField("username", event.target.value)}
            placeholder="예: teacher01"
            autoComplete="off"
          />
          {modal.fieldErrors.username ? (
            <ModalError role="alert">{modal.fieldErrors.username}</ModalError>
          ) : null}
        </div>

        <div>
          <ModalLabel htmlFor="teacher-create-name">이름</ModalLabel>
          <ModalInput
            id="teacher-create-name"
            ref={nameRef}
            value={modal.form.name}
            onChange={(event) => modal.updateField("name", event.target.value)}
            placeholder="예: 김담임"
            autoComplete="name"
          />
          {modal.fieldErrors.name ? (
            <ModalError role="alert">{modal.fieldErrors.name}</ModalError>
          ) : null}
        </div>

        <div>
          <ModalLabel htmlFor="teacher-create-email">이메일</ModalLabel>
          <ModalInput
            id="teacher-create-email"
            type="email"
            value={modal.form.email}
            onChange={(event) => modal.updateField("email", event.target.value)}
            placeholder="teacher@example.com"
            autoComplete="email"
          />
          <ModalHint>이메일은 선택 입력입니다.</ModalHint>
        </div>

        <div>
          <ModalLabel htmlFor="teacher-create-phone">연락처</ModalLabel>
          <ModalInput
            id="teacher-create-phone"
            ref={phoneRef}
            value={modal.form.phone}
            onChange={(event) => modal.updateField("phone", event.target.value)}
            placeholder="01012345678"
            autoComplete="tel"
          />
          <ModalHint>숫자만 입력해 주세요.</ModalHint>
          {modal.fieldErrors.phone ? (
            <ModalError role="alert">{modal.fieldErrors.phone}</ModalError>
          ) : null}
        </div>

        <div>
          <ModalLabel htmlFor="teacher-create-password">비밀번호</ModalLabel>
          <PasswordField>
            <PasswordInput
            id="teacher-create-password"
            ref={passwordRef}
            type={showPassword ? "text" : "password"}
            value={modal.form.password}
            onChange={(event) => modal.updateField("password", event.target.value)}
            autoComplete="new-password"
            spellCheck={false}
            onKeyDown={handlePasswordCapsLock}
            onKeyUp={handlePasswordCapsLock}
            onBlur={() => setPasswordCapsLock(false)}
          />
            <PasswordToggle
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-pressed={showPassword}
            >
              {showPassword ? "숨기기" : "보기"}
            </PasswordToggle>
          </PasswordField>
          <ModalHint>최소 5자 이상, 특수문자를 포함해 주세요. 등록 후 강사가 비밀번호를 변경할 수 있습니다.</ModalHint>
          {passwordCapsLock ? (
            <ModalHint danger>Caps Lock이 켜져 있습니다.</ModalHint>
          ) : null}
          {modal.fieldErrors.password ? (
            <ModalError role="alert">{modal.fieldErrors.password}</ModalError>
          ) : null}
        </div>

        <div>
          <ModalLabel htmlFor="teacher-create-password-confirm">비밀번호 확인</ModalLabel>
          <PasswordField>
            <PasswordInput
              id="teacher-create-password-confirm"
              ref={passwordConfirmRef}
              type={showPasswordConfirm ? "text" : "password"}
              value={modal.form.passwordConfirm}
              onChange={(event) => modal.updateField("passwordConfirm", event.target.value)}
              autoComplete="new-password"
              spellCheck={false}
              onKeyDown={handlePasswordConfirmCapsLock}
              onKeyUp={handlePasswordConfirmCapsLock}
              onBlur={() => setPasswordConfirmCapsLock(false)}
          />
            <PasswordToggle
              type="button"
              onClick={() => setShowPasswordConfirm((prev) => !prev)}
              aria-pressed={showPasswordConfirm}
            >
              {showPasswordConfirm ? "숨기기" : "보기"}
            </PasswordToggle>
          </PasswordField>
          <ModalHint>위와 동일한 비밀번호를 다시 입력해 주세요.</ModalHint>
          {passwordConfirmCapsLock ? (
            <ModalHint danger>Caps Lock이 켜져 있습니다.</ModalHint>
          ) : null}
          {modal.fieldErrors.passwordConfirm ? (
            <ModalError role="alert">{modal.fieldErrors.passwordConfirm}</ModalError>
          ) : null}
        </div>

        <div ref={menusRef}>
          <ModalLabel as="div">메뉴 권한</ModalLabel>
          <ModalCheckboxGroup>
            {menuOptions.map((option) => {
              const checked = modal.form.menus.includes(option.key);
              return (
                <MenuRow key={option.key}>
                  <ModalCheckboxLabel>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => modal.toggleMenu(option.key)}
                    />
                    <span>{option.label}</span>
                  </ModalCheckboxLabel>
                  <MenuHint>{option.description}</MenuHint>
                </MenuRow>
              );
            })}
          </ModalCheckboxGroup>
          <ModalHint>선택된 메뉴만 강사 사이드바에 노출됩니다.</ModalHint>
          {modal.fieldErrors.menus ? (
            <ModalError role="alert">{modal.fieldErrors.menus}</ModalError>
          ) : null}
        </div>

        <ModalHint>
          강사 홈은 기본 제공되며, 위에서 선택한 메뉴만 사이드바에 표시됩니다.
        </ModalHint>

        {modal.error ? <ModalError role="alert">{modal.error}</ModalError> : null}

        <ModalActions>
          <ModalGhostButton type="button" onClick={modal.closeModal} disabled={modal.submitting}>
            취소
          </ModalGhostButton>
          <ModalPrimaryButton type="submit" disabled={modal.submitting}>
            {modal.submitting ? "등록 중…" : "강사 등록"}
          </ModalPrimaryButton>
        </ModalActions>
      </ModalForm>
    </Modal>
  );
}

const PasswordField = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const PasswordInput = styled(ModalInput)`
  padding-right: 76px;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 12px;
  border: none;
  background: none;
  font-size: 12px;
  color: #475569;
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 6px;
  &:hover {
    color: #312e81;
  }
  &:focus-visible {
    outline: 2px solid #4f46e5;
    outline-offset: 2px;
  }
`;

const MenuRow = styled.div`
  display: grid;
  gap: 2px;
`;

const MenuHint = styled.span`
  font-size: 12px;
  color: #94a3b8;
  padding-left: 26px;
`;
