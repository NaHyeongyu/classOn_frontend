import { useEffect, useRef, useState, type KeyboardEvent, type RefObject, type FormEvent } from "react";
import Modal from "@/components/common/Modal";
import { ModalActions, ModalError, ModalForm, ModalHint, ModalInput, ModalLabel } from "@/components/myAcademy/MyAcademyModalStyles";
import { PrimaryButton as UIPrimaryButton, GhostButton as UIGhostButton } from "@/components/common/UI";
import styled from "styled-components";
import { checkTeacherUsername, checkPasswordStrength } from "@/api/teachers";
import { Input as RegInput, Rules, Rule } from "@/components/register/RegisterForm.styles";

type TeacherCreateFormState = {
  username: string;
  name: string;
  phone: string;
  password: string;
  passwordConfirm: string;
};

type TeacherCreateField = keyof TeacherCreateFormState;

type TeacherCreateFormErrors = Partial<Record<TeacherCreateField, string>>;

type TeacherCreateModalState = {
  open: boolean;
  form: TeacherCreateFormState;
  submitting: boolean;
  error: string | null;
  fieldErrors: TeacherCreateFormErrors;
  focusField: TeacherCreateField | null;
  openModal: () => void;
  closeModal: () => void;
  updateField: <K extends keyof TeacherCreateFormState>(field: K, value: TeacherCreateFormState[K]) => void;
  submit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  clearFocusField: () => void;
};

type TeacherCreateModalProps = { modal: TeacherCreateModalState };

type FocusFieldKey = NonNullable<TeacherCreateModalState["focusField"]>;

export function TeacherCreateModal({ modal }: TeacherCreateModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [passwordCapsLock, setPasswordCapsLock] = useState(false);
  const [passwordConfirmCapsLock, setPasswordConfirmCapsLock] = useState(false);
  const usernameRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordConfirmRef = useRef<HTMLInputElement>(null);

  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken" | "error">("idle");
  const [usernameStatusMsg, setUsernameStatusMsg] = useState<string>("");
  const [passwordStatus, setPasswordStatus] = useState<"idle" | "checking" | "valid" | "invalid" | "error">("idle");
  const [passwordStatusMsg, setPasswordStatusMsg] = useState<string>("");

  const handlePasswordCapsLock = (event: KeyboardEvent<HTMLInputElement>) => {
    setPasswordCapsLock(event.getModifierState?.("CapsLock") ?? false);
  };

  const handlePasswordConfirmCapsLock = (event: KeyboardEvent<HTMLInputElement>) => {
    setPasswordConfirmCapsLock(event.getModifierState?.("CapsLock") ?? false);
  };

  const { focusField, clearFocusField } = modal;

  useEffect(() => {
    const focusKey = focusField;
    if (!focusKey) return;
    const refMap: Record<FocusFieldKey, RefObject<HTMLElement> | null> = {
      username: usernameRef,
      name: nameRef,
      phone: phoneRef,
      password: passwordRef,
      passwordConfirm: passwordConfirmRef,
    };
    const targetRef = refMap[focusKey];
    const targetEl = targetRef?.current ?? null;
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
      if ("focus" in targetEl && typeof targetEl.focus === "function") {
        targetEl.focus();
      }
    }
    clearFocusField();
  }, [focusField, clearFocusField]);

  // Username availability check with debounce
  useEffect(() => {
    const value = modal.form.username?.trim() || "";
    if (!modal.open) {
      setUsernameStatus("idle");
      setUsernameStatusMsg("");
      return;
    }
    if (!value) {
      setUsernameStatus("idle");
      setUsernameStatusMsg("");
      return;
    }
    setUsernameStatus("checking");
    setUsernameStatusMsg("중복 확인 중…");
    let alive = true;
    const t = window.setTimeout(async () => {
      try {
        const res = await checkTeacherUsername(value);
        if (!alive) return;
        if (res?.available) {
          setUsernameStatus("available");
          setUsernameStatusMsg("사용 가능한 아이디입니다.");
        } else {
          setUsernameStatus("taken");
          setUsernameStatusMsg("이미 사용 중인 아이디입니다.");
        }
      } catch {
        if (!alive) return;
        setUsernameStatus("error");
        setUsernameStatusMsg("아이디 확인에 실패했습니다.");
      }
    }, 350);
    return () => {
      alive = false;
      window.clearTimeout(t);
    };
  }, [modal.open, modal.form.username]);

  // Password strength check with debounce (server policy)
  useEffect(() => {
    const value = modal.form.password || "";
    if (!modal.open) {
      setPasswordStatus("idle");
      setPasswordStatusMsg("");
      return;
    }
    if (!value) {
      setPasswordStatus("idle");
      setPasswordStatusMsg("");
      return;
    }
    setPasswordStatus("checking");
    setPasswordStatusMsg("비밀번호 확인 중…");
    let alive = true;
    const t = window.setTimeout(async () => {
      try {
        const res = await checkPasswordStrength(value);
        if (!alive) return;
        if (res?.valid) {
          setPasswordStatus("valid");
          setPasswordStatusMsg("안전한 비밀번호입니다.");
        } else {
          setPasswordStatus("invalid");
          setPasswordStatusMsg(res?.message || "비밀번호가 정책을 만족하지 않습니다.");
        }
      } catch {
        if (!alive) return;
        setPasswordStatus("error");
        setPasswordStatusMsg("비밀번호 확인에 실패했습니다.");
      }
    }, 350);
    return () => {
      alive = false;
      window.clearTimeout(t);
    };
  }, [modal.open, modal.form.password]);

  return (
    <Modal
      open={modal.open}
      onClose={modal.closeModal}
      blockOutsideClose
      title="강사 계정 등록"
      description="새 강사 계정을 생성합니다."
      maxWidth={520}
    >
      <ModalForm onSubmit={modal.submit}>
        <Section>
          <SectionTitle>기본 정보</SectionTitle>
          <div>
            <ModalLabel htmlFor="teacher-create-username">아이디</ModalLabel>
            <ModalInput
              id="teacher-create-username"
              ref={usernameRef}
              value={modal.form.username}
              onChange={(event) => modal.updateField("username", event.target.value)}
              placeholder="예: teacher01"
              autoComplete="off"
              autoFocus
            />
            {modal.fieldErrors.username ? (
              <ModalError role="alert">{modal.fieldErrors.username}</ModalError>
            ) : usernameStatus === "available" ? (
              <SuccessHint>{usernameStatusMsg}</SuccessHint>
            ) : usernameStatus === "taken" ? (
              <ModalError role="alert">{usernameStatusMsg}</ModalError>
            ) : usernameStatus === "checking" ? (
              <ModalHint>{usernameStatusMsg}</ModalHint>
            ) : usernameStatus === "error" ? (
              <ModalHint danger>{usernameStatusMsg}</ModalHint>
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
        </Section>

        <Divider />

        <Section>
          <SectionTitle>보안</SectionTitle>
          <div>
            <ModalLabel htmlFor="teacher-create-password">비밀번호</ModalLabel>
            <PasswordField>
              <PasswordRegInput
                id="teacher-create-password"
                ref={passwordRef}
                type={showPassword ? "text" : "password"}
                value={modal.form.password}
                onChange={(event) => modal.updateField("password", event.target.value)}
                placeholder="8–64자, 문자+숫자"
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
            <InlineRules role="status" aria-live="polite">
              <Rule ok={modal.form.password.length >= 8 && modal.form.password.length <= 64}>8–64자</Rule>
              <Rule ok={/[A-Za-z]/.test(modal.form.password) && /\d/.test(modal.form.password)}>문자+숫자 포함</Rule>
            </InlineRules>
            {passwordCapsLock ? (
              <ModalHint danger>Caps Lock이 켜져 있습니다.</ModalHint>
            ) : null}
            {modal.fieldErrors.password ? (
              <ModalError role="alert">{modal.fieldErrors.password}</ModalError>
            ) : passwordStatus === "valid" ? (
              <SuccessHint>{passwordStatusMsg}</SuccessHint>
            ) : passwordStatus === "invalid" ? (
              <ModalError role="alert">{passwordStatusMsg}</ModalError>
            ) : passwordStatus === "checking" ? (
              <ModalHint>{passwordStatusMsg}</ModalHint>
            ) : passwordStatus === "error" ? (
              <ModalHint danger>{passwordStatusMsg}</ModalHint>
            ) : null}
          </div>

          <div>
            <ModalLabel htmlFor="teacher-create-password-confirm">비밀번호 확인</ModalLabel>
            <PasswordField>
              <PasswordRegInput
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
        </Section>

        <Divider />

        {/* 메뉴 권한 선택 제거: 강사는 기본 메뉴 세트가 자동 부여됩니다. */}

        {modal.error ? <ModalError role="alert">{modal.error}</ModalError> : null}

        <ModalActions>
          <UIGhostButton type="button" onClick={modal.closeModal} disabled={modal.submitting}>
            취소
          </UIGhostButton>
          <UIPrimaryButton
            type="submit"
            disabled={
              modal.submitting || usernameStatus === "checking" || usernameStatus === "taken" || passwordStatus === "checking" || passwordStatus === "invalid"
            }
          >
            {modal.submitting ? "등록 중…" : "강사 등록"}
          </UIPrimaryButton>
        </ModalActions>
      </ModalForm>
    </Modal>
  );
}

const PasswordField = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
`;

const PasswordRegInput = styled(RegInput)`
  /* Harmonize with modal input look */
  height: 44px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  font-size: 14px;
  padding: 0 76px 0 12px; /* space for toggle */
  width: 100%;
  &::placeholder { color: #9ca3af; }
  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79,70,229,0.18);
  }
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
  gap: 6px;
`;

const MenuHint = styled.span`
  font-size: 12px;
  color: #94a3b8;
  padding-left: 26px;
`;

const Section = styled.div`
  display: grid;
  gap: 12px;
`;

const SectionTitle = styled.h3`
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
`;

const Divider = styled.div`
  height: 1px;
  background: #e5e7eb;
`;

// Using Rules/Rule from register styles for visual parity
const InlineRules = styled(Rules)`
  gap: 8px;
  margin-top: 4px;
`;

const SuccessHint = styled.p`
  margin: 4px 0 0;
  font-size: 12px;
  color: #065f46;
`;
