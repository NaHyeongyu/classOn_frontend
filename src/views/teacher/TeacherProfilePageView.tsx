import { useRef, useState } from "react";
import styled from "styled-components";
import Modal from "@/components/common/Modal";
import {
  GhostButton,
  Page,
  PageHeader,
  PrimaryButton,
  SectionCard,
} from "@/components/common/UI";
import { LoadingSpinner } from "@/components/common/Loading";
import type { TeacherProfile } from "@/api/teachers";

export type ProfileFormState = {
  name: string;
  email: string;
  phone: string;
};

export type PasswordFormState = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type PasswordModalControls = {
  open: boolean;
  form: PasswordFormState;
  error: string | null;
  submitting: boolean;
  onChange: (field: keyof PasswordFormState, value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
  onOpen: () => void;
};

type TeacherProfilePageViewProps = {
  loading: boolean;
  error: string | null;
  profile: TeacherProfile | null;
  form: ProfileFormState;
  editMode: boolean;
  onChange: (field: keyof ProfileFormState, value: string) => void;
  onSubmitProfile: () => void;
  onRequestEdit: () => void;
  onCancelEdit: () => void;
  savingProfile: boolean;
  profileError: string | null;
  passwordModal: PasswordModalControls;
  onRetry: () => void;
  onNavigateHome: () => void;
};

export function TeacherProfilePageView({
  loading,
  error,
  profile,
  form,
  editMode,
  onChange,
  onSubmitProfile,
  onRequestEdit,
  onCancelEdit,
  savingProfile,
  profileError,
  passwordModal,
  onRetry,
  onNavigateHome,
}: TeacherProfilePageViewProps) {
  const passwordCurrentRef = useRef<HTMLInputElement>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordSubmitDisabled =
    passwordModal.submitting ||
    !passwordModal.form.currentPassword.trim() ||
    !passwordModal.form.newPassword.trim() ||
    !passwordModal.form.confirmPassword.trim();

  if (loading && !profile) {
    return (
      <Centered>
        <LoadingSpinner />
        <p>내 정보를 불러오는 중입니다…</p>
      </Centered>
    );
  }

  return (
    <Page>
      <PageHeader>
        <div>
          <h2>내 정보 관리</h2>
          <p>연락처와 비밀번호를 최신 상태로 유지해 주세요.</p>
        </div>
        <GhostButton type="button" onClick={onNavigateHome}>
          강사 홈으로
        </GhostButton>
      </PageHeader>

      {error ? (
        <AlertCard role="alert">
          <strong>정보를 불러오지 못했습니다.</strong>
          <p>{error}</p>
          <GhostButton type="button" onClick={onRetry} disabled={loading}>
            다시 시도
          </GhostButton>
        </AlertCard>
      ) : null}

      {profile ? (
        <>
          <SectionCard aria-labelledby="teacher-profile-card">
            <FormHeader>
              <div>
                <FormTitle id="teacher-profile-card">기본 정보</FormTitle>
                <FormSubtitle>학원에서 사용하는 표시 이름과 연락처를 관리하세요.</FormSubtitle>
              </div>
              <HeaderActions>
                <GhostButton type="button" onClick={onRetry} disabled={loading}>
                  다시 불러오기
                </GhostButton>
                <PrimaryButton type="button" onClick={onRequestEdit} disabled={savingProfile}>
                  정보 수정
                </PrimaryButton>
              </HeaderActions>
            </FormHeader>

            <InfoStack>
              <InfoField>
                <InfoLabel>이름</InfoLabel>
                <InfoValueBox>{profile.name || "미입력"}</InfoValueBox>
              </InfoField>
              <InfoField>
                <InfoLabel>아이디</InfoLabel>
                <InfoValueBox>{profile.username}</InfoValueBox>
              </InfoField>
              <InfoField>
                <InfoLabel>이메일</InfoLabel>
                <InfoValueBox>{profile.email || "미입력"}</InfoValueBox>
              </InfoField>
              <InfoField>
                <InfoLabel>전화번호</InfoLabel>
                <InfoValueBox>{profile.phone || "미입력"}</InfoValueBox>
              </InfoField>
              <InfoField>
                <InfoLabel>비밀번호</InfoLabel>
                <InfoValueBox>
                  <PasswordRow>
                    <PasswordValue aria-label="비밀번호는 숨겨져 있습니다.">********</PasswordValue>
                    <PrimaryButton type="button" onClick={passwordModal.onOpen}>
                      비밀번호 변경
                    </PrimaryButton>
                  </PasswordRow>
                </InfoValueBox>
                <Hint>보안을 위해 주기적으로 비밀번호를 변경해 주세요.</Hint>
              </InfoField>
            </InfoStack>
          </SectionCard>
        </>
      ) : null}

      <Modal
        open={editMode}
        onClose={onCancelEdit}
        title="기본 정보 수정"
        description="강사 표시 이름과 연락처를 최신 정보로 변경하세요."
      >
        <ModalBody>
          <ModalField>
            <ModalLabel htmlFor="edit-teacher-name">이름</ModalLabel>
            <ModalInput
              id="edit-teacher-name"
              value={form.name}
              onChange={(event) => onChange("name", event.target.value)}
              placeholder="예: 김담임"
              autoComplete="name"
            />
          </ModalField>
          <ModalField>
            <ModalLabel htmlFor="edit-teacher-email">이메일</ModalLabel>
            <ModalInput
              id="edit-teacher-email"
              type="email"
              value={form.email}
              onChange={(event) => onChange("email", event.target.value)}
              placeholder="teacher@example.com"
              autoComplete="email"
            />
            <ModalHint>이메일은 선택 입력입니다.</ModalHint>
          </ModalField>
          <ModalField>
            <ModalLabel htmlFor="edit-teacher-phone">연락처</ModalLabel>
            <ModalInput
              id="edit-teacher-phone"
              value={form.phone}
              onChange={(event) => onChange("phone", event.target.value)}
              placeholder="01012345678"
              autoComplete="tel"
            />
            <ModalHint>숫자만 입력해 주세요.</ModalHint>
          </ModalField>
          {profileError ? <ModalError role="alert">{profileError}</ModalError> : null}
        </ModalBody>
        <ModalActions>
          <GhostButton type="button" onClick={onCancelEdit} disabled={savingProfile}>
            취소
          </GhostButton>
          <PrimaryButton type="button" onClick={onSubmitProfile} disabled={savingProfile}>
            {savingProfile ? "저장 중…" : "저장"}
          </PrimaryButton>
        </ModalActions>
      </Modal>

      <Modal
        open={passwordModal.open}
        onClose={passwordModal.onClose}
        title="비밀번호 변경"
        description="현재 비밀번호를 확인한 뒤 새 비밀번호를 입력하세요."
        initialFocusRef={passwordCurrentRef}
      >
        <ModalBody>
          <ModalField>
            <ModalLabel htmlFor="teacher-password-current">현재 비밀번호</ModalLabel>
            <PasswordField>
              <PasswordInput
                id="teacher-password-current"
                ref={passwordCurrentRef}
                type={showCurrentPassword ? "text" : "password"}
                value={passwordModal.form.currentPassword}
                onChange={(event) => passwordModal.onChange("currentPassword", event.target.value)}
                autoComplete="current-password"
              />
              <PasswordToggle
                type="button"
                aria-pressed={showCurrentPassword}
                onClick={() => setShowCurrentPassword((prev) => !prev)}
              >
                {showCurrentPassword ? "숨기기" : "보기"}
              </PasswordToggle>
            </PasswordField>
          </ModalField>
          <ModalField>
            <ModalLabel htmlFor="teacher-password-new">새 비밀번호</ModalLabel>
            <PasswordField>
              <PasswordInput
                id="teacher-password-new"
                type={showNewPassword ? "text" : "password"}
                value={passwordModal.form.newPassword}
                onChange={(event) => passwordModal.onChange("newPassword", event.target.value)}
                autoComplete="new-password"
              />
              <PasswordToggle
                type="button"
                aria-pressed={showNewPassword}
                onClick={() => setShowNewPassword((prev) => !prev)}
              >
                {showNewPassword ? "숨기기" : "보기"}
              </PasswordToggle>
            </PasswordField>
          </ModalField>
          <ModalField>
            <ModalLabel htmlFor="teacher-password-confirm">새 비밀번호 확인</ModalLabel>
            <PasswordField>
              <PasswordInput
                id="teacher-password-confirm"
                type={showConfirmPassword ? "text" : "password"}
                value={passwordModal.form.confirmPassword}
                onChange={(event) => passwordModal.onChange("confirmPassword", event.target.value)}
                autoComplete="new-password"
              />
              <PasswordToggle
                type="button"
                aria-pressed={showConfirmPassword}
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? "숨기기" : "보기"}
              </PasswordToggle>
            </PasswordField>
          </ModalField>
          {passwordModal.error ? <ModalError role="alert">{passwordModal.error}</ModalError> : null}
        </ModalBody>
        <ModalActions>
          <GhostButton type="button" onClick={passwordModal.onClose} disabled={passwordModal.submitting}>
            취소
          </GhostButton>
          <PrimaryButton type="button" onClick={passwordModal.onSubmit} disabled={passwordSubmitDisabled}>
            {passwordModal.submitting ? "변경 중…" : "변경하기"}
          </PrimaryButton>
        </ModalActions>
      </Modal>
    </Page>
  );
}

const Centered = styled.div`
  min-height: 320px;
  display: grid;
  place-items: center;
  gap: 12px;
  color: ${(p) => p.theme.colors.textMuted};
  p {
    margin: 0;
  }
`;

const AlertCard = styled(SectionCard)`
  display: grid;
  gap: ${(p) => p.theme.spacing.sm};
  border-color: ${(p) => p.theme.colors.danger};
  background: ${(p) => p.theme.colors.dangerSurface};
  color: ${(p) => p.theme.colors.danger};
  strong {
    font-size: ${(p) => p.theme.font.size.lg};
  }
  p {
    margin: 0;
  }
`;

const FormHeader = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${(p) => p.theme.spacing.md};
  flex-wrap: wrap;
`;

const FormTitle = styled.h3`
  margin: 0;
  font-size: ${(p) => p.theme.font.size.lg};
  font-weight: ${(p) => p.theme.font.weight.bold};
`;

const FormSubtitle = styled.p`
  margin: ${(p) => p.theme.spacing.xs} 0 0;
  color: ${(p) => p.theme.colors.textMuted};
  font-size: ${(p) => p.theme.font.size.sm};
`;

const HeaderActions = styled.div`
  display: flex;
  gap: ${(p) => p.theme.spacing.xs};
  flex-wrap: wrap;
`;

const InfoStack = styled.div`
  margin-top: ${(p) => p.theme.spacing.md};
  display: grid;
  gap: ${(p) => p.theme.spacing.md};
  max-width: 520px;
`;

const InfoField = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing.xs};
`;

const InfoLabel = styled.p`
  margin: 0;
  font-size: ${(p) => p.theme.font.size.sm};
  font-weight: ${(p) => p.theme.font.weight.medium};
  color: ${(p) => p.theme.colors.textMuted};
`;

const InfoValueBox = styled.div`
  width: 100%;
  min-height: 44px;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.lg};
  padding: 10px 12px;
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${(p) => p.theme.colors.text};
  display: flex;
  align-items: center;
  background: ${(p) => p.theme.colors.surface};
`;

const PasswordRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${(p) => p.theme.spacing.sm};
  flex-wrap: wrap;
`;

const PasswordValue = styled.span`
  letter-spacing: 0.3em;
  color: ${(p) => p.theme.colors.textMuted};
`;

const Hint = styled.p`
  margin: 0;
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${(p) => p.theme.colors.textMuted};
`;

const ModalBody = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.md};
`;

const ModalField = styled.div`
  display: grid;
  gap: ${(p) => p.theme.spacing.xs};
`;

const ModalLabel = styled.label`
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${(p) => p.theme.colors.textMuted};
`;

const ModalHint = styled.p`
  margin: -4px 0 0;
  font-size: ${(p) => p.theme.font.size.xs};
  color: ${(p) => p.theme.colors.textMuted};
`;

const ModalInput = styled.input`
  height: 42px;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.md};
  padding: 0 ${(p) => p.theme.spacing.sm};
  font-size: ${(p) => p.theme.font.size.sm};
  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.primary};
    box-shadow: ${(p) => p.theme.shadow.focusPrimary};
  }
`;

const ModalError = styled.p`
  margin: 0;
  color: ${(p) => p.theme.colors.danger};
  font-size: ${(p) => p.theme.font.size.sm};
`;

const PasswordField = styled.div`
  position: relative;
  width: 100%;
`;

const PasswordInput = styled(ModalInput)`
  width: 100%;
  padding-right: 76px;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: none;
  color: ${(p) => p.theme.colors.textMuted};
  font-size: ${(p) => p.theme.font.size.xs};
  padding: 4px 6px;
  border-radius: 6px;
  cursor: pointer;
  &:hover {
    color: ${(p) => p.theme.colors.primary};
  }
  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.primary};
    outline-offset: 2px;
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${(p) => p.theme.spacing.sm};
  margin-top: ${(p) => p.theme.spacing.md};
`;
