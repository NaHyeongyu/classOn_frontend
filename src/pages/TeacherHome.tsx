import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Modal from "@/components/common/Modal";
import { GhostButton, PrimaryButton } from "@/components/common/UI";
import { useTeacherProfilePage } from "@/features/teacher/useTeacherProfile";
import { TeacherHomePageView } from "@/views/teacher/TeacherHomePageView";
import { type ProfileFormState, type PasswordFormState } from "@/views/teacher/TeacherProfilePageView";
import { useToast } from "@/components/common/Toast";
import { paths } from "@/routes";
import { getErrorMessage } from "@/lib/errors";

const EMPTY_PROFILE_FORM: ProfileFormState = {
  name: "",
  email: "",
  phone: "",
};

const EMPTY_PASSWORD_FORM: PasswordFormState = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function TeacherHome() {
  const navigate = useNavigate();
  const { success: showSuccess } = useToast();
  const {
    profile,
    loading,
    error,
    refresh,
    saveProfile,
    changePassword,
    savingProfile,
    changingPassword,
    clearError,
  } = useTeacherProfilePage();

  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileForm, setProfileForm] = useState<ProfileFormState>(EMPTY_PROFILE_FORM);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState<PasswordFormState>(EMPTY_PASSWORD_FORM);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const passwordCurrentRef = useRef<HTMLInputElement>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!profile) {
      setProfileForm(EMPTY_PROFILE_FORM);
      return;
    }
    setProfileForm({
      name: profile.name ?? "",
      email: profile.email ?? "",
      phone: profile.phone ?? "",
    });
  }, [profile]);

  const hasProfileChanges = useMemo(() => {
    if (!profile) return false;
    return (
      (profileForm.name ?? "") !== (profile.name ?? "") ||
      (profileForm.email ?? "") !== (profile.email ?? "") ||
      (profileForm.phone ?? "") !== (profile.phone ?? "")
    );
  }, [profile, profileForm.email, profileForm.name, profileForm.phone]);

  const handleProfileChange = (field: keyof ProfileFormState, value: string) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }));
    setProfileError(null);
    clearError();
  };

  const handleOpenProfileModal = () => {
    if (!profile) return;
    setProfileModalOpen(true);
    setProfileError(null);
    clearError();
    setProfileForm({
      name: profile.name ?? "",
      email: profile.email ?? "",
      phone: profile.phone ?? "",
    });
  };

  const handleCloseProfileModal = () => {
    setProfileModalOpen(false);
    setProfileError(null);
    clearError();
    if (profile) {
      setProfileForm({
        name: profile.name ?? "",
        email: profile.email ?? "",
        phone: profile.phone ?? "",
      });
    } else {
      setProfileForm(EMPTY_PROFILE_FORM);
    }
  };

  const handleSubmitProfile = async () => {
    if (!profile) {
      setProfileError("프로필 정보를 먼저 불러와 주세요.");
      return;
    }
    if (!hasProfileChanges) {
      setProfileError("변경된 내용이 없습니다.");
      return;
    }
    try {
      await saveProfile({
        name: profileForm.name?.trim() || undefined,
        email: profileForm.email?.trim() || undefined,
        phone: profileForm.phone?.trim() || undefined,
      });
      setProfileError(null);
      setProfileModalOpen(false);
      showSuccess("기본 정보를 저장했습니다.");
    } catch (err) {
      setProfileError(getErrorMessage(err, "기본 정보 저장에 실패했습니다."));
    }
  };

  const handleOpenPasswordModal = () => {
    if (!profile) return;
    setPasswordModalOpen(true);
    setPasswordForm(EMPTY_PASSWORD_FORM);
    setPasswordError(null);
    clearError();
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const handleClosePasswordModal = () => {
    setPasswordModalOpen(false);
    setPasswordForm(EMPTY_PASSWORD_FORM);
    setPasswordError(null);
    clearError();
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const handlePasswordFieldChange = (field: keyof PasswordFormState, value: string) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }));
    setPasswordError(null);
    clearError();
  };

  const handlePasswordSubmit = async () => {
    if (!profile) {
      setPasswordError("프로필 정보를 먼저 불러와 주세요.");
      return;
    }
    if (!passwordForm.currentPassword.trim()) {
      setPasswordError("현재 비밀번호를 입력해 주세요.");
      return;
    }
    if (!passwordForm.newPassword.trim()) {
      setPasswordError("새 비밀번호를 입력해 주세요.");
      return;
    }
    if (!passwordForm.confirmPassword.trim()) {
      setPasswordError("새 비밀번호 확인을 입력해 주세요.");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("새 비밀번호가 일치하지 않습니다.");
      return;
    }
    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordError(null);
      setPasswordForm(EMPTY_PASSWORD_FORM);
      setPasswordModalOpen(false);
      showSuccess("비밀번호가 변경되었습니다.");
    } catch (err) {
      setPasswordError(getErrorMessage(err, "비밀번호 변경에 실패했습니다."));
    }
  };

  return (
    <>
      <TeacherHomePageView
        loading={loading}
        error={error}
        profile={profile}
        onRefresh={() => void refresh()}
        onOpenProfileModal={handleOpenProfileModal}
        onNavigateCourse={(id) => navigate(paths.classes.detail(id))}
      />

      <Modal
        open={profileModalOpen}
        onClose={handleCloseProfileModal}
        title="내 정보 관리"
        description="표시 이름과 연락처를 수정하고 비밀번호를 변경할 수 있습니다."
      >
        <ModalBody>
          <ModalField>
            <ModalLabel htmlFor="teacher-home-name">이름</ModalLabel>
            <ModalInput
              id="teacher-home-name"
              value={profileForm.name}
              onChange={(event) => handleProfileChange("name", event.target.value)}
              placeholder="예: 김담임"
              autoComplete="name"
            />
          </ModalField>
          <ModalField>
            <ModalLabel htmlFor="teacher-home-username">아이디</ModalLabel>
            <ReadOnlyInput
              id="teacher-home-username"
              value={profile?.username ?? ""}
              readOnly
              aria-readonly="true"
            />
            <ModalHint>아이디는 변경할 수 없습니다.</ModalHint>
          </ModalField>
          <ModalField>
            <ModalLabel htmlFor="teacher-home-email">이메일</ModalLabel>
            <ModalInput
              id="teacher-home-email"
              type="email"
              value={profileForm.email}
              onChange={(event) => handleProfileChange("email", event.target.value)}
              placeholder="teacher@example.com"
              autoComplete="email"
            />
            <ModalHint>이메일은 선택 입력입니다.</ModalHint>
          </ModalField>
          <ModalField>
            <ModalLabel htmlFor="teacher-home-phone">연락처</ModalLabel>
            <ModalInput
              id="teacher-home-phone"
              value={profileForm.phone}
              onChange={(event) => handleProfileChange("phone", event.target.value)}
              placeholder="01012345678"
              autoComplete="tel"
            />
            <ModalHint>숫자만 입력해 주세요.</ModalHint>
          </ModalField>
          {profileError ? <ModalError role="alert">{profileError}</ModalError> : null}
          <PasswordRow>
            <div>
              <ModalLabel as="p">비밀번호</ModalLabel>
              <ModalHint>보안을 위해 주기적으로 비밀번호를 변경해 주세요.</ModalHint>
            </div>
            <PrimaryButton type="button" onClick={handleOpenPasswordModal}>
              비밀번호 변경
            </PrimaryButton>
          </PasswordRow>
        </ModalBody>
        <ModalActions>
          <GhostButton type="button" onClick={handleCloseProfileModal} disabled={savingProfile}>
            취소
          </GhostButton>
          <PrimaryButton type="button" onClick={handleSubmitProfile} disabled={savingProfile}>
            {savingProfile ? "저장 중…" : "저장"}
          </PrimaryButton>
        </ModalActions>
      </Modal>

      <Modal
        open={passwordModalOpen}
        onClose={handleClosePasswordModal}
        title="비밀번호 변경"
        description="현재 비밀번호를 확인한 뒤 새 비밀번호를 입력하세요."
        initialFocusRef={passwordCurrentRef}
        blockOutsideClose={false}
      >
        <ModalBody>
          <ModalField>
            <ModalLabel htmlFor="teacher-home-password-current">현재 비밀번호</ModalLabel>
            <PasswordField>
              <PasswordInput
                id="teacher-home-password-current"
                ref={passwordCurrentRef}
                type={showCurrentPassword ? "text" : "password"}
                value={passwordForm.currentPassword}
                onChange={(event) => handlePasswordFieldChange("currentPassword", event.target.value)}
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
            <ModalLabel htmlFor="teacher-home-password-new">새 비밀번호</ModalLabel>
            <PasswordField>
              <PasswordInput
                id="teacher-home-password-new"
                type={showNewPassword ? "text" : "password"}
                value={passwordForm.newPassword}
                onChange={(event) => handlePasswordFieldChange("newPassword", event.target.value)}
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
            <ModalHint>최소 5자 이상, 특수문자를 포함해 주세요.</ModalHint>
          </ModalField>
          <ModalField>
            <ModalLabel htmlFor="teacher-home-password-confirm">새 비밀번호 확인</ModalLabel>
            <PasswordField>
              <PasswordInput
                id="teacher-home-password-confirm"
                type={showConfirmPassword ? "text" : "password"}
                value={passwordForm.confirmPassword}
                onChange={(event) => handlePasswordFieldChange("confirmPassword", event.target.value)}
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
          {passwordError ? <ModalError role="alert">{passwordError}</ModalError> : null}
        </ModalBody>
        <ModalActions>
          <GhostButton type="button" onClick={handleClosePasswordModal} disabled={changingPassword}>
            취소
          </GhostButton>
          <PrimaryButton type="button" onClick={handlePasswordSubmit} disabled={changingPassword}>
            {changingPassword ? "변경 중…" : "변경"}
          </PrimaryButton>
        </ModalActions>
      </Modal>
    </>
  );
}

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
  font-weight: ${(p) => p.theme.font.weight.medium};
  color: ${(p) => p.theme.colors.text};
`;

const ModalInput = styled.input`
  height: 44px;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.md};
  padding: 0 ${(p) => p.theme.spacing.sm};
  font-size: ${(p) => p.theme.font.size.sm};
  color: ${(p) => p.theme.colors.text};
  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.primary};
    box-shadow: ${(p) => p.theme.shadow.focusPrimary};
  }
`;

const ReadOnlyInput = styled(ModalInput)`
  background: ${(p) => p.theme.colors.surfaceAlt};
  color: ${(p) => p.theme.colors.textMuted};
  cursor: not-allowed;
`;

const ModalHint = styled.p`
  margin: 0;
  font-size: ${(p) => p.theme.font.size.xs};
  color: ${(p) => p.theme.colors.textMuted};
`;

const ModalError = styled.p`
  margin: 0;
  color: ${(p) => p.theme.colors.danger};
  font-size: ${(p) => p.theme.font.size.sm};
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${(p) => p.theme.spacing.sm};
  margin-top: ${(p) => p.theme.spacing.md};
`;

const PasswordRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${(p) => p.theme.spacing.md};
  flex-wrap: wrap;
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
  font-size: ${(p) => p.theme.font.size.xs};
  color: ${(p) => p.theme.colors.textMuted};
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
