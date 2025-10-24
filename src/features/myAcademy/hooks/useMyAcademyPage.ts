import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/common/Toast";
import {
  apiChangePassword,
  apiGetMyAcademy,
  apiUpdateMyAcademy,
  apiUpdateMyProfile,
  type AcademyDetail,
} from "@/api/account";
import { apiRequestPhoneCode, apiVerifyPhoneCode } from "@/api/auth";
import {
  maskBiz,
  normalizeMobile,
  toErrorMessage,
  unmaskBiz,
} from "@/features/myAcademy/utils";

type AccountViewState = {
  name: string;
  phone: string;
  onOpenProfileModal: () => void;
  onOpenPhoneModal: () => void;
  onOpenPasswordModal: () => void;
};

type AcademyViewState = {
  data: AcademyDetail | null;
  onOpenEditModal: () => void;
};

export type ProfileModalState = {
  open: boolean;
  name: string;
  error: string | null;
  submitting: boolean;
  openModal: () => void;
  closeModal: () => void;
  setName: (value: string) => void;
  submit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
};

export type PhoneModalState = {
  open: boolean;
  value: string;
  code: string;
  digits: string;
  cooldown: number;
  requesting: boolean;
  submitting: boolean;
  error: string | null;
  message: string | null;
  openModal: () => void;
  closeModal: () => void;
  setValue: (value: string) => void;
  setCode: (value: string) => void;
  sendCode: () => Promise<void>;
  submit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
};

export type PasswordModalState = {
  open: boolean;
  current: string;
  next: string;
  confirm: string;
  tooShort: boolean;
  mismatch: boolean;
  submitting: boolean;
  error: string | null;
  openModal: () => void;
  closeModal: () => void;
  setCurrent: (value: string) => void;
  setNext: (value: string) => void;
  setConfirm: (value: string) => void;
  submit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
};

type AcademyFormState = {
  name: string;
  category1: string;
  category2: string;
  categoryEtc: string;
  address: string;
  representativeName: string;
  phone: string;
  billingEmail: string;
  bizNo: string;
};

export type AcademyModalState = {
  open: boolean;
  form: AcademyFormState;
  submitting: boolean;
  error: string | null;
  openModal: () => void;
  closeModal: () => void;
  updateField: <K extends keyof AcademyFormState>(
    field: K,
    value: AcademyFormState[K],
  ) => void;
  selectCategory1: (value: string) => void;
  toggleCategory2: (value: string) => void;
  submit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
};

export type UseMyAcademyPageResult = {
  loading: boolean;
  error: string | null;
  account: AccountViewState;
  academy: AcademyViewState;
  profileModal: ProfileModalState;
  phoneModal: PhoneModalState;
  passwordModal: PasswordModalState;
  academyModal: AcademyModalState;
  handleLogout: () => void;
  clearError: () => void;
};

function createAcademyForm(detail: AcademyDetail | null): AcademyFormState {
  return {
    name: detail?.name ?? "",
    category1: detail?.category1 ?? "",
    category2: detail?.category2 ?? "",
    categoryEtc: detail?.categoryEtc ?? "",
    address: detail?.address ?? "",
    representativeName: detail?.representativeName ?? "",
    phone: detail?.phone ?? "",
    billingEmail: detail?.billingEmail ?? "",
    bizNo: maskBiz(detail?.bizNo ?? ""),
  };
}

export function useMyAcademyPage(): UseMyAcademyPageResult {
  const { user, validate, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [academy, setAcademy] = useState<AcademyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");

  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileModalName, setProfileModalName] = useState("");
  const [profileModalError, setProfileModalError] = useState<string | null>(null);
  const [profileModalSubmitting, setProfileModalSubmitting] = useState(false);

  const [phoneModalOpen, setPhoneModalOpen] = useState(false);
  const [phoneModalValue, setPhoneModalValue] = useState("");
  const [phoneModalCode, setPhoneModalCode] = useState("");
  const [phoneModalCooldown, setPhoneModalCooldown] = useState(0);
  const [phoneModalRequesting, setPhoneModalRequesting] = useState(false);
  const [phoneModalSubmitting, setPhoneModalSubmitting] = useState(false);
  const [phoneModalError, setPhoneModalError] = useState<string | null>(null);
  const [phoneModalMessage, setPhoneModalMessage] = useState<string | null>(null);

  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordModalCurrent, setPasswordModalCurrent] = useState("");
  const [passwordModalNew, setPasswordModalNew] = useState("");
  const [passwordModalConfirm, setPasswordModalConfirm] = useState("");
  const [passwordModalSubmitting, setPasswordModalSubmitting] = useState(false);
  const [passwordModalError, setPasswordModalError] = useState<string | null>(null);

  const [academyModalOpen, setAcademyModalOpen] = useState(false);
  const [academyModalForm, setAcademyModalForm] = useState<AcademyFormState>(
    createAcademyForm(null),
  );
  const [academyModalError, setAcademyModalError] = useState<string | null>(null);
  const [academyModalSubmitting, setAcademyModalSubmitting] = useState(false);

  const passwordTooShort =
    passwordModalNew.length > 0 && passwordModalNew.length < 8;
  const passwordMismatch =
    passwordModalNew.length > 0 &&
    passwordModalConfirm.length > 0 &&
    passwordModalNew !== passwordModalConfirm;

  const phoneModalDigits = useMemo(
    () => phoneModalValue.replace(/\D/g, ""),
    [phoneModalValue],
  );

  useEffect(() => {
    setName(user?.name ?? "");
    setPhone(user?.phone ?? "");
  }, [user?.name, user?.phone]);

  useEffect(() => {
    if (!phoneModalOpen || phoneModalCooldown <= 0) return;
    const timer = window.setTimeout(() => {
      setPhoneModalCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [phoneModalOpen, phoneModalCooldown]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const detail = await apiGetMyAcademy();
        if (!alive) return;
        setAcademy(detail);
      } catch (err) {
        if (!alive) return;
        setAcademy({
          id: 0,
          name: "",
          bizNo: "",
          address: "",
          representativeName: "",
          phone: "",
          billingEmail: "",
          category1: "",
          category2: "",
          categoryEtc: "",
        });
        setError(
          toErrorMessage(
            err,
            "학원 정보를 불러오지 못했습니다. 정보를 입력 후 저장해 주세요.",
          ),
        );
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const handleLogout = useCallback(() => {
    logout();
    navigate("/login", { replace: true });
  }, [logout, navigate]);

  const openProfileModal = useCallback(() => {
    setProfileModalName(name);
    setProfileModalError(null);
    setProfileModalSubmitting(false);
    setProfileModalOpen(true);
  }, [name]);

  const closeProfileModal = useCallback(() => {
    setProfileModalOpen(false);
    setProfileModalError(null);
    setProfileModalSubmitting(false);
  }, []);

  const submitProfileModal = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const trimmed = profileModalName.trim();
      if (!trimmed) {
        setProfileModalError("담당자 성함을 입력해 주세요.");
        return;
      }
      if (trimmed === (user?.name ?? "")) {
        closeProfileModal();
        return;
      }
      setProfileModalSubmitting(true);
      try {
        await apiUpdateMyProfile({ name: trimmed });
        await validate();
        setName(trimmed);
        toast.success("프로필이 저장되었습니다.");
        closeProfileModal();
      } catch (err) {
        setProfileModalError(
          toErrorMessage(err, "프로필 저장에 실패했습니다."),
        );
      } finally {
        setProfileModalSubmitting(false);
      }
    },
    [closeProfileModal, profileModalName, toast, user?.name, validate],
  );

  const handleProfileNameChange = useCallback((value: string) => {
    setProfileModalName(value);
    setProfileModalError(null);
  }, []);

  const openPhoneModal = useCallback(() => {
    const digits = (phone ?? "").replace(/\D/g, "");
    setPhoneModalValue(digits);
    setPhoneModalCode("");
    setPhoneModalError(null);
    setPhoneModalMessage(null);
    setPhoneModalCooldown(0);
    setPhoneModalSubmitting(false);
    setPhoneModalOpen(true);
  }, [phone]);

  const closePhoneModal = useCallback(() => {
    setPhoneModalOpen(false);
    setPhoneModalValue("");
    setPhoneModalCode("");
    setPhoneModalError(null);
    setPhoneModalMessage(null);
    setPhoneModalRequesting(false);
    setPhoneModalSubmitting(false);
    setPhoneModalCooldown(0);
  }, []);

  const sendPhoneCode = useCallback(async () => {
    setPhoneModalError(null);
    setPhoneModalMessage(null);
    const normalized = normalizeMobile(phoneModalValue);
    if (!normalized) {
      setPhoneModalError("휴대폰 번호 형식을 확인해 주세요 (010-1234-5678).");
      return;
    }
    setPhoneModalRequesting(true);
    try {
      const res = await apiRequestPhoneCode(normalized);
      if (!res.success) {
        setPhoneModalError("인증번호 발송에 실패했습니다.");
      } else {
        setPhoneModalMessage(
          res.code
            ? `인증번호(${res.code})가 발송되었습니다.`
            : "인증번호가 발송되었습니다.",
        );
        setPhoneModalCooldown(60);
      }
    } catch (err) {
      setPhoneModalError(toErrorMessage(err, "인증번호 발송에 실패했습니다."));
    } finally {
      setPhoneModalRequesting(false);
    }
  }, [phoneModalValue]);

  const handlePhoneValueChange = useCallback((value: string) => {
    setPhoneModalValue(value);
    setPhoneModalError(null);
    setPhoneModalMessage(null);
  }, []);

  const handlePhoneCodeChange = useCallback((value: string) => {
    setPhoneModalCode(value);
    setPhoneModalError(null);
  }, []);

  const submitPhoneModal = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setPhoneModalError(null);
      const normalized = normalizeMobile(phoneModalValue);
      if (!normalized) {
        setPhoneModalError("휴대폰 번호 형식을 확인해 주세요 (010-1234-5678).");
        return;
      }
      const trimmedCode = phoneModalCode.trim();
      if (trimmedCode.length !== 6) {
        setPhoneModalError("인증번호 6자리를 입력해 주세요.");
        return;
      }
      setPhoneModalSubmitting(true);
      try {
        const verifyRes = await apiVerifyPhoneCode(normalized, trimmedCode);
        if (!verifyRes.success) {
          setPhoneModalError("인증번호가 올바르지 않습니다.");
          return;
        }
        await apiUpdateMyProfile({ phone: normalized });
        await validate();
        setPhone(normalized);
        toast.success("휴대폰 번호가 변경되었습니다.");
        closePhoneModal();
      } catch (err) {
        setPhoneModalError(
          toErrorMessage(err, "휴대폰 번호 변경에 실패했습니다."),
        );
      } finally {
        setPhoneModalSubmitting(false);
      }
    },
    [
      closePhoneModal,
      phoneModalCode,
      phoneModalValue,
      toast,
      validate,
    ],
  );

  const openPasswordModal = useCallback(() => {
    setPasswordModalCurrent("");
    setPasswordModalNew("");
    setPasswordModalConfirm("");
    setPasswordModalError(null);
    setPasswordModalSubmitting(false);
    setPasswordModalOpen(true);
  }, []);

  const closePasswordModal = useCallback(() => {
    setPasswordModalOpen(false);
    setPasswordModalCurrent("");
    setPasswordModalNew("");
    setPasswordModalConfirm("");
    setPasswordModalError(null);
    setPasswordModalSubmitting(false);
  }, []);

  const submitPasswordModal = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (
        !passwordModalCurrent ||
        !passwordModalNew ||
        !passwordModalConfirm
      ) {
        setPasswordModalError("현재 비밀번호와 새 비밀번호를 모두 입력해 주세요.");
        return;
      }
      if (passwordTooShort) {
        setPasswordModalError("새 비밀번호는 8자 이상 입력해 주세요.");
        return;
      }
      if (passwordMismatch) {
        setPasswordModalError("새 비밀번호 확인이 일치하지 않습니다.");
        return;
      }
      setPasswordModalSubmitting(true);
      try {
        await apiChangePassword(passwordModalCurrent, passwordModalNew);
        toast.success("비밀번호가 변경되었습니다.");
        closePasswordModal();
      } catch (err) {
        setPasswordModalError(
          toErrorMessage(err, "비밀번호 변경에 실패했습니다."),
        );
      } finally {
        setPasswordModalSubmitting(false);
      }
    },
    [
      closePasswordModal,
      passwordMismatch,
      passwordModalConfirm,
      passwordModalCurrent,
      passwordModalNew,
      passwordTooShort,
      toast,
    ],
  );

  const handlePasswordCurrentChange = useCallback((value: string) => {
    setPasswordModalCurrent(value);
    setPasswordModalError(null);
  }, []);

  const handlePasswordNewChange = useCallback((value: string) => {
    setPasswordModalNew(value);
    setPasswordModalError(null);
  }, []);

  const handlePasswordConfirmChange = useCallback((value: string) => {
    setPasswordModalConfirm(value);
    setPasswordModalError(null);
  }, []);

  const openAcademyModal = useCallback(() => {
    setAcademyModalForm(createAcademyForm(academy));
    setAcademyModalError(null);
    setAcademyModalSubmitting(false);
    setAcademyModalOpen(true);
  }, [academy]);

  const closeAcademyModal = useCallback(() => {
    setAcademyModalOpen(false);
    setAcademyModalError(null);
    setAcademyModalSubmitting(false);
    setAcademyModalForm(createAcademyForm(academy));
  }, [academy]);

  const updateAcademyModalField = useCallback(
    <K extends keyof AcademyFormState>(field: K, value: AcademyFormState[K]) => {
      setAcademyModalForm((prev) => ({ ...prev, [field]: value }));
      setAcademyModalError(null);
    },
  [],
  );

  const selectAcademyCategory1 = useCallback((value: string) => {
    setAcademyModalForm((prev) => ({
      ...prev,
      category1: value,
      category2: "",
      categoryEtc: value === "기타" ? prev.categoryEtc : "",
    }));
    setAcademyModalError(null);
  }, []);

  const toggleAcademyCategory2 = useCallback((value: string) => {
    setAcademyModalForm((prev) => ({
      ...prev,
      category2: prev.category2 === value ? "" : value,
    }));
    setAcademyModalError(null);
  }, []);

  const submitAcademyModal = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const trimmedName = academyModalForm.name.trim();
      if (!trimmedName) {
        setAcademyModalError("학원명을 입력해 주세요.");
        return;
      }
      if (!academyModalForm.category1) {
        setAcademyModalError("최소 한 가지 카테고리를 선택해 주세요.");
        return;
      }
      const bizDigits = unmaskBiz(academyModalForm.bizNo);
      const payload = {
        id: academy?.id,
        name: trimmedName,
        category1: academyModalForm.category1,
        category2: academyModalForm.category2 || undefined,
        categoryEtc:
          academyModalForm.category1 === "기타"
            ? academyModalForm.categoryEtc.trim() || undefined
            : undefined,
        address: academyModalForm.address.trim() || undefined,
        representativeName:
          academyModalForm.representativeName.trim() || undefined,
        phone: academyModalForm.phone.trim() || undefined,
        billingEmail: academyModalForm.billingEmail.trim() || undefined,
        bizNo: bizDigits || undefined,
      };
      setAcademyModalSubmitting(true);
      try {
        const updated = await apiUpdateMyAcademy(payload);
        setAcademy(updated);
        toast.success("학원 정보가 저장되었습니다.");
        closeAcademyModal();
      } catch (err) {
        setAcademyModalError(
          toErrorMessage(err, "학원 정보 저장에 실패했습니다."),
        );
      } finally {
        setAcademyModalSubmitting(false);
      }
    },
    [academy, academyModalForm, closeAcademyModal, toast],
  );

  const account: AccountViewState = {
    name,
    phone,
    onOpenProfileModal: openProfileModal,
    onOpenPhoneModal: openPhoneModal,
    onOpenPasswordModal: openPasswordModal,
  };

  const academyView: AcademyViewState = {
    data: academy,
    onOpenEditModal: openAcademyModal,
  };

  const profileModal: ProfileModalState = {
    open: profileModalOpen,
    name: profileModalName,
    error: profileModalError,
    submitting: profileModalSubmitting,
    openModal: openProfileModal,
    closeModal: closeProfileModal,
    setName: handleProfileNameChange,
    submit: submitProfileModal,
  };

  const phoneModal: PhoneModalState = {
    open: phoneModalOpen,
    value: phoneModalValue,
    code: phoneModalCode,
    digits: phoneModalDigits,
    cooldown: phoneModalCooldown,
    requesting: phoneModalRequesting,
    submitting: phoneModalSubmitting,
    error: phoneModalError,
    message: phoneModalMessage,
    openModal: openPhoneModal,
    closeModal: closePhoneModal,
    setValue: handlePhoneValueChange,
    setCode: handlePhoneCodeChange,
    sendCode: sendPhoneCode,
    submit: submitPhoneModal,
  };

  const passwordModal: PasswordModalState = {
    open: passwordModalOpen,
    current: passwordModalCurrent,
    next: passwordModalNew,
    confirm: passwordModalConfirm,
    tooShort: passwordTooShort,
    mismatch: passwordMismatch,
    submitting: passwordModalSubmitting,
    error: passwordModalError,
    openModal: openPasswordModal,
    closeModal: closePasswordModal,
    setCurrent: handlePasswordCurrentChange,
    setNext: handlePasswordNewChange,
    setConfirm: handlePasswordConfirmChange,
    submit: submitPasswordModal,
  };

  const academyModal: AcademyModalState = {
    open: academyModalOpen,
    form: academyModalForm,
    submitting: academyModalSubmitting,
    error: academyModalError,
    openModal: openAcademyModal,
    closeModal: closeAcademyModal,
    updateField: updateAcademyModalField,
    selectCategory1: selectAcademyCategory1,
    toggleCategory2: toggleAcademyCategory2,
    submit: submitAcademyModal,
  };

  return {
    loading,
    error,
    account,
    academy: academyView,
    profileModal,
    phoneModal,
    passwordModal,
    academyModal,
    handleLogout,
    clearError,
  };
}
