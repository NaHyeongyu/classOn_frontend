import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTeacherProfilePage } from "@/features/teacher/useTeacherProfile";
import {
  TeacherProfilePageView,
  type ProfileFormState,
  type PasswordFormState,
} from "@/views/teacher/TeacherProfilePageView";
import { routes } from "@/routes";
import type { TeacherProfileUpdatePayload } from "@/api/teachers";
import { getErrorMessage } from "@/lib/errors";
import { useToast } from "@/components/common/Toast";

const EMPTY_PROFILE_FORM: ProfileFormState = {
  name: "",
  phone: "",
};

const EMPTY_PASSWORD_FORM: PasswordFormState = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function TeacherProfile() {
  const navigate = useNavigate();
  const { success: showSuccess } = useToast();
  const {
    profile,
    loading,
    error,
    refresh,
    savingProfile,
    saveProfile,
    changePassword,
    changingPassword,
    clearError,
  } = useTeacherProfilePage();

  const [form, setForm] = useState<ProfileFormState>(EMPTY_PROFILE_FORM);
  const [editMode, setEditMode] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState<PasswordFormState>(EMPTY_PASSWORD_FORM);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) {
      setForm(EMPTY_PROFILE_FORM);
      setPasswordModalOpen(false);
      setPasswordForm(EMPTY_PASSWORD_FORM);
      return;
    }
    setForm({
      name: profile.name ?? "",
      phone: profile.phone ?? "",
    });
  }, [profile]);

  const hasProfileChanges = useMemo(() => {
    if (!profile) return false;
    return (
      (form.name ?? "") !== (profile.name ?? "") ||
      (form.phone ?? "") !== (profile.phone ?? "")
    );
  }, [profile, form.name, form.phone]);

  const resetForm = () => {
    if (!profile) {
      setForm(EMPTY_PROFILE_FORM);
      return;
    }
    setForm({
      name: profile.name ?? "",
      phone: profile.phone ?? "",
    });
  };

  const handleChange = (field: keyof ProfileFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setProfileError(null);
    clearError();
  };

  const handleRequestEdit = () => {
    if (!profile) return;
    resetForm();
    setEditMode(true);
    setProfileError(null);
    clearError();
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setProfileError(null);
    clearError();
    resetForm();
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
    const payload: TeacherProfileUpdatePayload = {
      name: form.name?.trim() || undefined,
      phone: form.phone?.trim() || undefined,
    };
    try {
      await saveProfile(payload);
      setProfileError(null);
      setEditMode(false);
      showSuccess("프로필 정보를 저장했습니다.");
    } catch (err) {
      setProfileError(getErrorMessage(err, "프로필 저장에 실패했습니다."));
    }
  };

  const openPasswordModal = () => {
    if (!profile) return;
    setPasswordModalOpen(true);
    setPasswordForm(EMPTY_PASSWORD_FORM);
    setPasswordError(null);
    clearError();
  };

  const closePasswordModal = () => {
    setPasswordModalOpen(false);
    setPasswordForm(EMPTY_PASSWORD_FORM);
    setPasswordError(null);
    clearError();
  };

  const handlePasswordChange = (field: keyof PasswordFormState, value: string) => {
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

  const handleRetry = async () => {
    setProfileError(null);
    setPasswordError(null);
    setEditMode(false);
    resetForm();
    setPasswordModalOpen(false);
    setPasswordForm(EMPTY_PASSWORD_FORM);
    clearError();
    await refresh();
  };

  return (
    <TeacherProfilePageView
      loading={loading}
      error={error}
      profile={profile}
      form={form}
      editMode={editMode}
      onChange={handleChange}
      onSubmitProfile={handleSubmitProfile}
      onRequestEdit={handleRequestEdit}
      onCancelEdit={handleCancelEdit}
      savingProfile={savingProfile}
      profileError={profileError}
      passwordModal={{
        open: passwordModalOpen,
        form: passwordForm,
        error: passwordError,
        submitting: changingPassword,
        onChange: handlePasswordChange,
        onSubmit: handlePasswordSubmit,
        onClose: closePasswordModal,
        onOpen: openPasswordModal,
      }}
      onRetry={handleRetry}
      onNavigateHome={() => navigate(routes.teacherHome)}
    />
  );
}
