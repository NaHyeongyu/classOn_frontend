import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/common/Toast";
import {
  apiChangePassword,
  apiGetMyAcademy,
  apiGetMySeller,
  apiGetSellerStatus,
  apiSyncSeller,
  apiRequestSellerRegistration,
  apiUpdateSeller,
  apiUpdateMyAcademy,
  apiUpdateMyProfile,
  type AcademyDetail,
  type SellerDetail,
} from "@/api/account";
import { apiRequestPhoneCode, apiVerifyPhoneCode } from "@/api/auth";
import {
  apiGetSubscription,
  apiUpsertSubscription,
  apiCancelSubscription,
  type SubscriptionDto,
} from "@/api/billing";
import {
  maskBiz,
  normalizeMobile,
  toErrorMessage,
  unmaskBiz,
} from "@/features/myAcademy/utils";
import { createTeacher, listTeachers, type TeacherListItem } from "@/api/teachers";
import { paths } from "@/routes";
import type { AuthUser } from "@/lib/auth";

// Teacher menus are fixed on the backend; no per-user selection needed.

type AccountViewState = {
  name: string;
  username: string;
  phone: string;
  onOpenProfileModal: () => void;
  onOpenPhoneModal: () => void;
  onOpenPasswordModal: () => void;
};

type AcademyViewState = {
  data: AcademyDetail | null;
  onOpenEditModal: () => void;
  isFreePlan: boolean;
  paymentEnabled: boolean;
};

type BillingViewState = {
  loading: boolean;
  data: SubscriptionDto | null;
  createOrUpdate: (payload: {
    planId: string;
    planName: string;
    amountKrw: number;
    currency?: string;
    billingKey?: string;
    customerKey?: string;
    cardCompany?: string;
    cardNumber?: string;
  }) => Promise<void>;
  cancel: () => Promise<void>;
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

type SellerFormState = {
  businessType: "INDIVIDUAL" | "INDIVIDUAL_BUSINESS" | "CORPORATE";
  refSellerId: string;
  tossSellerId?: string;
  companyName: string;
  representativeName: string;
  businessRegistrationNumber: string;
  companyEmail: string;
  companyPhone: string;
  individualName: string;
  individualEmail: string;
  individualPhone: string;
  accountBankCode: string;
  accountNumber: string;
  accountHolderName: string;
  metadataJson?: string;
};

export type SellerModalState = {
  open: boolean;
  creating: boolean;
  submitting: boolean;
  error: string | null;
  form: SellerFormState;
  updateField: <K extends keyof SellerFormState>(field: K, value: SellerFormState[K]) => void;
  submit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  closeModal: () => void;
};

type SellerViewState = {
  loading: boolean;
  data: SellerDetail | null;
  status: string | null;
  canRegister: boolean;
  canEdit: boolean;
  showPendingBadge: boolean;
  verificationPending: boolean;
  syncing: boolean;
  syncStatus: () => Promise<void>;
  buttonText: string;
  modalMode: "create" | "edit";
  onOpenRegister: () => void;
  awaitingVerification: boolean;
  pendingEmail: string | null;
  pendingTossSellerId: string | null;
};

type PendingSellerInfo = {
  email: string;
  tossSellerId: string | null;
};

type TeacherCreateFormState = {
  username: string;
  name: string;
  phone: string;
  password: string;
  passwordConfirm: string;
};

type TeacherCreateField = keyof TeacherCreateFormState;

type TeacherCreateFormErrors = Partial<Record<TeacherCreateField, string>>;

export type TeacherCreateModalState = {
  open: boolean;
  form: TeacherCreateFormState;
  submitting: boolean;
  error: string | null;
  fieldErrors: TeacherCreateFormErrors;
  focusField: TeacherCreateField | null;
  openModal: () => void;
  closeModal: () => void;
  updateField: <K extends keyof TeacherCreateFormState>(
    field: K,
    value: TeacherCreateFormState[K],
  ) => void;
  submit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  clearFocusField: () => void;
};

export type UseMyAcademyPageResult = {
  loading: boolean;
  error: string | null;
  account: AccountViewState;
  academy: AcademyViewState;
  billing: BillingViewState;
  seller: SellerViewState;
  teachers: {
    loading: boolean;
    error: string | null;
    teachers: TeacherListItem[];
    onRefresh: () => Promise<void>;
    onOpenCreate: () => void;
    onSelect: (id: number) => void;
  };
  profileModal: ProfileModalState;
  phoneModal: PhoneModalState;
  passwordModal: PasswordModalState;
  academyModal: AcademyModalState;
  sellerModal: SellerModalState;
  teacherCreateModal: TeacherCreateModalState;
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

const SELLER_ID_PREFIX = "SR";
const SELLER_ID_TEMP_PREFIX = "SRX";

function randomToken(length: number) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i += 1) {
    const index = Math.floor(Math.random() * chars.length);
    result += chars[index];
  }
  return result;
}

function encodeAcademyId(id: number) {
  return id.toString(36).toUpperCase();
}

function buildRefSellerId(detail: AcademyDetail | null) {
  const nowToken = Date.now().toString(36).toUpperCase().slice(-5);
  if (detail?.id) {
    return `${SELLER_ID_PREFIX}${encodeAcademyId(detail.id)}_${nowToken}`;
  }
  return `${SELLER_ID_TEMP_PREFIX}${nowToken}_${randomToken(3)}`;
}

function buildSellerMetadata(academy: AcademyDetail | null, user: AuthUser | null): string {
  const metadata: Record<string, string> = {
    registrationDate: new Date().toISOString().split("T")[0],
  };
  const platformUserId =
    user?.id != null
      ? String(user.id)
      : user?.username
        ? String(user.username)
        : null;
  if (platformUserId) {
    metadata.platformUserId = platformUserId;
  }
  if (academy?.id != null) {
    metadata.academyId = String(academy.id);
  }
  if (academy?.name) {
    metadata.academyName = academy.name;
  }
  if (user?.name) {
    metadata.registeredBy = user.name;
  }
  return JSON.stringify(metadata);
}

const PENDING_SELLER_STORAGE_KEY = "seller-registration-pending";

function buildPendingSellerStorageKey(
  academyId: number | null,
  userId: string | number | null,
): string | null {
  if (academyId != null) {
    return `${PENDING_SELLER_STORAGE_KEY}:academy-${academyId}`;
  }
  if (userId != null) {
    return `${PENDING_SELLER_STORAGE_KEY}:user-${userId}`;
  }
  return null;
}

function readPendingSellerInfoFromStorage(key: string | null): PendingSellerInfo | null {
  if (!key || typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as PendingSellerInfo;
  } catch {
    return null;
  }
}

function createSellerForm(
  academy: AcademyDetail | null,
  seller: SellerDetail | null,
  user: AuthUser | null,
): SellerFormState {
  const company = seller?.company;
  const account = seller?.account;
  const individual = seller?.individual;
  return {
    businessType: seller?.businessType ?? "INDIVIDUAL_BUSINESS",
    refSellerId: seller?.refSellerId ?? buildRefSellerId(academy),
    tossSellerId: seller?.tossSellerId,
    companyName: company?.name ?? academy?.name ?? "",
    representativeName: company?.representativeName ?? academy?.representativeName ?? "",
    businessRegistrationNumber: company?.businessRegistrationNumber ?? academy?.bizNo ?? "",
    companyEmail: company?.email ?? academy?.billingEmail ?? "",
    companyPhone: company?.phone ?? academy?.phone ?? "",
    individualName: individual?.name ?? "",
    individualEmail: individual?.email ?? "",
    individualPhone: individual?.phone ?? "",
    accountBankCode: account?.bankCode ?? "",
    accountNumber: account?.accountNumber ?? "",
    accountHolderName:
      account?.holderName ??
      company?.representativeName ??
      academy?.representativeName ??
      "",
    metadataJson: seller?.metadataJson ?? buildSellerMetadata(academy, user),
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
  const username = (user?.username ?? "").toString();

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
  const [subscription, setSubscription] = useState<SubscriptionDto | null>(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  const [academyModalError, setAcademyModalError] = useState<string | null>(null);
  const [academyModalSubmitting, setAcademyModalSubmitting] = useState(false);
  const stableUserKey = useMemo(() => {
    if (user?.id != null) {
      return user.id;
    }
    if (user?.username) {
      return user.username;
    }
    return null;
  }, [user?.id, user?.username]);
  const pendingSellerStorageKey = useMemo(
    () => buildPendingSellerStorageKey(academy?.id ?? null, stableUserKey),
    [academy?.id, stableUserKey],
  );
  const queryClient = useQueryClient();
  const sellerQueryKey = useMemo(() => ["seller"] as const, []);
  const sellerQuery = useQuery<SellerDetail | null>({
    queryKey: sellerQueryKey,
    queryFn: apiGetMySeller,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: (query: { state: { data?: SellerDetail | null } }) =>
      !query.state.data?.tossSellerId,
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchInterval: (query: { state: { data?: SellerDetail | null } }) =>
      !query.state.data?.tossSellerId ? 15000 : false,
    refetchIntervalInBackground: true,
  });
  const seller = sellerQuery.data ?? null;
  const sellerLoading = sellerQuery.isLoading;
  const [sellerModalOpen, setSellerModalOpen] = useState(false);
  const [sellerModalForm, setSellerModalForm] = useState<SellerFormState>(() =>
    createSellerForm(null, null, user ?? null),
  );
  const [sellerModalSubmitting, setSellerModalSubmitting] = useState(false);
  const [sellerModalError, setSellerModalError] = useState<string | null>(null);
  const [sellerSyncing, setSellerSyncing] = useState(false);
  const [pendingSellerInfo, setPendingSellerInfo] = useState<PendingSellerInfo | null>(() =>
    readPendingSellerInfoFromStorage(pendingSellerStorageKey),
  );
  const [teacherList, setTeacherList] = useState<TeacherListItem[]>([]);
  const [teachersLoading, setTeachersLoading] = useState(true);
  const [teachersError, setTeachersError] = useState<string | null>(null);
  const [teacherModalOpen, setTeacherModalOpen] = useState(false);
  const [teacherModalForm, setTeacherModalForm] = useState<TeacherCreateFormState>(() => ({
    username: "",
    name: "",
    phone: "",
    password: "",
    passwordConfirm: "",
  }));
  const [teacherModalError, setTeacherModalError] = useState<string | null>(null);
  const [teacherModalSubmitting, setTeacherModalSubmitting] = useState(false);
  const [teacherModalFieldErrors, setTeacherModalFieldErrors] = useState<TeacherCreateFormErrors>({});
  const [teacherModalFocusField, setTeacherModalFocusField] = useState<TeacherCreateField | null>(null);

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
    if (!pendingSellerStorageKey) {
      setPendingSellerInfo(null);
      return;
    }
    const stored = readPendingSellerInfoFromStorage(pendingSellerStorageKey);
    setPendingSellerInfo((prev) => {
      if (
        prev?.email === stored?.email &&
        prev?.tossSellerId === stored?.tossSellerId
      ) {
        return prev;
      }
      return stored;
    });
  }, [pendingSellerStorageKey]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(PENDING_SELLER_STORAGE_KEY);
  }, []);

  const loadTeachers = useCallback(async () => {
    setTeachersLoading(true);
    setTeachersError(null);
    try {
      const rows = await listTeachers();
      setTeacherList(rows);
    } catch (err) {
      setTeachersError(
        toErrorMessage(err, "강사 목록을 불러오지 못했습니다. 다시 시도해 주세요."),
      );
    } finally {
      setTeachersLoading(false);
    }
  }, []);

  const resetTeacherForm = useCallback(() => {
    setTeacherModalForm({
      username: "",
      name: "",
      phone: "",
      password: "",
      passwordConfirm: "",
    });
    setTeacherModalError(null);
    setTeacherModalSubmitting(false);
    setTeacherModalFieldErrors({});
    setTeacherModalFocusField(null);
  }, []);

  const openTeacherModal = useCallback(() => {
    resetTeacherForm();
    setTeacherModalOpen(true);
  }, [resetTeacherForm]);

  const closeTeacherModal = useCallback(() => {
    setTeacherModalOpen(false);
    resetTeacherForm();
  }, [resetTeacherForm]);

  const updateTeacherField = useCallback(
    <K extends keyof TeacherCreateFormState>(field: K, value: TeacherCreateFormState[K]) => {
      setTeacherModalForm((prev) => ({ ...prev, [field]: value }));
      setTeacherModalError(null);
      setTeacherModalFieldErrors((prev) => {
        if (!prev[field]) return prev;
        const next = { ...prev };
        delete next[field];
        return next;
      });
    },
  []);

  // toggleTeacherMenu removed

  const clearTeacherFocusField = useCallback(() => {
    setTeacherModalFocusField(null);
  }, []);

  const openTeacherDetail = useCallback(
    (id: number) => {
      navigate(paths.teachers.detail(id));
    },
    [navigate],
  );

  const submitTeacherModal = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const username = teacherModalForm.username.trim();
      const nameValue = teacherModalForm.name.trim();
      const normalizedPhone = normalizeMobile(teacherModalForm.phone);
      const passwordValue = teacherModalForm.password.trim();
      const passwordConfirmValue = teacherModalForm.passwordConfirm.trim();
      // menus removed (backend auto-assigns default)

      const raiseFieldError = (field: TeacherCreateField, message: string) => {
        setTeacherModalFieldErrors({ [field]: message });
        setTeacherModalFocusField(field);
      };

      setTeacherModalError(null);
      setTeacherModalFieldErrors({});
      setTeacherModalFocusField(null);
      if (!username) {
        raiseFieldError("username", "아이디를 입력해주세요.");
        return;
      }
      if (!nameValue) {
        raiseFieldError("name", "이름을 입력해 주세요.");
        return;
      }
      if (!normalizedPhone) {
        raiseFieldError("phone", "휴대폰 번호 형식을 확인해 주세요.");
        return;
      }
      if (passwordValue.length < 5) {
        raiseFieldError("password", "비밀번호는 5자 이상 입력해 주세요.");
        return;
      }
      if (!/[^\w\s]/.test(passwordValue)) {
        raiseFieldError("password", "비밀번호에 특수문자를 포함해 주세요.");
        return;
      }
      if (passwordValue !== passwordConfirmValue) {
        raiseFieldError("passwordConfirm", "비밀번호가 일치하지 않습니다.");
        return;
      }
      // 메뉴 선택은 제거됨: 서버가 기본 메뉴 세트를 자동 부여합니다.

      setTeacherModalSubmitting(true);
      try {
        await createTeacher({
          username,
          name: nameValue,
          phone: normalizedPhone,
          password: passwordValue,
        });
        await loadTeachers();
        toast.success("강사가 등록되었습니다.");
        closeTeacherModal();
      } catch (err) {
        setTeacherModalError(
          toErrorMessage(err, "강사 등록에 실패했습니다."),
        );
      } finally {
        setTeacherModalSubmitting(false);
      }
    },
    [closeTeacherModal, loadTeachers, teacherModalForm, toast],
  );

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

  useEffect(() => {
    if (sellerModalOpen) return;
    setSellerModalForm(createSellerForm(academy, seller, user ?? null));
  }, [academy, seller, sellerModalOpen, user]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const sub = await apiGetSubscription();
        if (!alive) return;
        if (sub?.id) setSubscription(sub);
      } catch {
        // ignore subscription load errors
      } finally {
        if (alive) setSubscriptionLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    void loadTeachers();
  }, [loadTeachers]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleRefresh = () => {
      void loadTeachers();
    };
    window.addEventListener("teachers:refresh", handleRefresh);
    return () => {
      window.removeEventListener("teachers:refresh", handleRefresh);
    };
  }, [loadTeachers]);

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

  const openSellerModal = useCallback(() => {
    if (!academy?.id) {
      toast.warning("학원 정보를 먼저 등록해 주세요.");
      return;
    }
    setSellerModalForm(createSellerForm(academy, seller, user ?? null));
    setSellerModalError(null);
    setSellerModalSubmitting(false);
    setSellerModalOpen(true);
  }, [academy, seller, toast, user]);

  const closeSellerModal = useCallback(() => {
    setSellerModalOpen(false);
    setSellerModalSubmitting(false);
    setSellerModalError(null);
  }, []);

  const updateSellerModalField = useCallback(
    <K extends keyof SellerFormState>(field: K, value: SellerFormState[K]) => {
      setSellerModalForm((prev) => ({ ...prev, [field]: value }));
      setSellerModalError(null);
    },
    [],
  );

  const submitSellerModal = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!academy?.id) {
        setSellerModalError("학원 정보를 먼저 등록해 주세요.");
        return;
      }
      const refSellerId = sellerModalForm.refSellerId.trim();
      if (!refSellerId) {
        setSellerModalError("셀러 ID가 올바르지 않습니다.");
        return;
      }
      const bankCode = sellerModalForm.accountBankCode.trim();
      const accountNumberDigits = sellerModalForm.accountNumber.replace(/\D/g, "");
      if (!bankCode || !accountNumberDigits) {
        setSellerModalError("정산 받을 은행과 계좌번호를 입력해 주세요.");
        return;
      }
      const normalizedIndividualPhone = sellerModalForm.individualPhone.replace(/\D/g, "");
      const companyName = sellerModalForm.companyName.trim() || undefined;
      const representativeName = sellerModalForm.representativeName.trim() || undefined;
      const companyEmail = sellerModalForm.companyEmail.trim() || undefined;
      const companyPhoneDigits = sellerModalForm.companyPhone.replace(/\D/g, "");
      const companyPhone = companyPhoneDigits || undefined;
      const bizNumberDigits = sellerModalForm.businessRegistrationNumber.replace(/\D/g, "");

      const holderName =
        sellerModalForm.accountHolderName.trim() ||
        sellerModalForm.representativeName.trim() ||
        sellerModalForm.companyName.trim() ||
        sellerModalForm.individualName.trim();
      if (!holderName) {
        setSellerModalError("예금주명을 입력해 주세요.");
        return;
      }

      if (sellerModalForm.businessType === "INDIVIDUAL") {
        if (!sellerModalForm.individualName.trim()) {
          setSellerModalError("개인 이름을 입력해 주세요.");
          return;
        }
        if (!sellerModalForm.individualEmail.trim()) {
          setSellerModalError("개인 이메일 주소를 입력해 주세요.");
          return;
        }
        if (!normalizedIndividualPhone) {
          setSellerModalError("개인 연락처를 숫자만 입력해 주세요.");
          return;
        }
        if (bizNumberDigits.length > 0 && bizNumberDigits.length !== 10) {
          setSellerModalError("사업자등록번호는 10자리 숫자만 입력해 주세요.");
          return;
        }
      } else {
        if (!companyName) {
          setSellerModalError("사업자명을 입력해 주세요.");
          return;
        }
        if (!representativeName) {
          setSellerModalError("대표자명을 입력해 주세요.");
          return;
        }
        if (!companyEmail) {
          setSellerModalError("사업자 이메일을 입력해 주세요.");
          return;
        }
        if (!companyPhoneDigits) {
          setSellerModalError("사업자 연락처를 숫자만 입력해 주세요.");
          return;
        }
        if (bizNumberDigits.length !== 10) {
          setSellerModalError("사업자등록번호 10자리를 입력해 주세요.");
          return;
        }
      }

      setSellerModalSubmitting(true);
      const metadataJson =
        sellerModalForm.metadataJson ?? buildSellerMetadata(academy, user ?? null);
      try {
        const payload = {
          refSellerId,
          businessType: sellerModalForm.businessType,
          companyName,
          representativeName,
          businessRegistrationNumber: bizNumberDigits || undefined,
          companyEmail,
          companyPhone,
          individualName:
            sellerModalForm.businessType === "INDIVIDUAL"
              ? sellerModalForm.individualName.trim()
              : undefined,
          individualEmail:
            sellerModalForm.businessType === "INDIVIDUAL"
              ? sellerModalForm.individualEmail.trim()
              : undefined,
          individualPhone:
            sellerModalForm.businessType === "INDIVIDUAL" ? normalizedIndividualPhone : undefined,
          bankCode,
          accountNumber: accountNumberDigits,
          accountHolderName: holderName,
          metadataJson,
        } satisfies Parameters<typeof apiRequestSellerRegistration>[0];

        if (seller?.tossSellerId) {
          await apiUpdateSeller(payload);
          toast.success("정산 계좌 정보가 저장되었습니다.");
          queryClient.invalidateQueries({ queryKey: sellerQueryKey }).catch((): void => undefined);
          closeSellerModal();
          return;
        }

        const response = await apiRequestSellerRegistration(payload);
        const pendingEmail =
          sellerModalForm.businessType === "INDIVIDUAL"
            ? sellerModalForm.individualEmail.trim()
            : companyEmail ?? sellerModalForm.companyEmail.trim();
        setPendingSellerInfo({
          email: pendingEmail || null,
          tossSellerId: response.tossSellerId ?? null,
        });
        toast.show("토스 이메일 인증을 완료해 주세요.");
        queryClient.invalidateQueries({ queryKey: sellerQueryKey }).catch((): void => undefined);
        closeSellerModal();
      } catch (err) {
        setSellerModalError(toErrorMessage(err, "정산 계좌 등록 요청에 실패했습니다."));
      } finally {
        setSellerModalSubmitting(false);
      }
    },
    [academy, closeSellerModal, queryClient, seller, sellerModalForm, sellerQueryKey, toast, user],
  );

  useEffect(() => {
    if (!pendingSellerInfo) {
      return;
    }
    setSellerModalOpen(false);
    setSellerModalSubmitting(false);
    setSellerModalError(null);
  }, [pendingSellerInfo]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    if (!pendingSellerStorageKey) {
      window.localStorage.removeItem(PENDING_SELLER_STORAGE_KEY);
      return;
    }
    if (pendingSellerInfo) {
      window.localStorage.setItem(
        pendingSellerStorageKey,
        JSON.stringify(pendingSellerInfo),
      );
    } else {
      window.localStorage.removeItem(pendingSellerStorageKey);
    }
  }, [pendingSellerInfo, pendingSellerStorageKey]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!seller?.tossSellerId) return;

    const status = (seller?.status ?? "").toUpperCase();
    const pending = status === "PENDING" || status === "APPROVAL_REQUIRED";
    if (!pending) {
      if (status === "APPROVED" || status === "REJECTED" || status === "SUSPENDED") {
        setPendingSellerInfo(null);
      }
      return;
    }

    let alive = true;
    let timeoutId: number | null = null;
    let totalElapsed = 0;
    const INITIAL_DELAY = 3000;
    const SLOW_DELAY = 10000;
    const SLOW_THRESHOLD = 60_000;
    const STOP_AFTER = 180_000;

    const schedule = (delay: number) => {
      if (!alive) return;
      timeoutId = window.setTimeout(() => {
        void pollStatus();
      }, delay);
    };

    const pollStatus = async () => {
      if (!alive) return;
      try {
        // In local/dev, webhook may not arrive. Sync via Toss API.
        const updated = await apiSyncSeller();
        if (!alive) return;
        queryClient.setQueryData(sellerQueryKey, updated);
        const nextStatus = (updated.status ?? "").toUpperCase();
        if (nextStatus === "APPROVED") {
          setPendingSellerInfo(null);
          toast.success("정산 계좌 등록이 완료되었습니다.");
          return;
        }
        if (nextStatus === "REJECTED" || nextStatus === "SUSPENDED") {
          setPendingSellerInfo(null);
          toast.warning("정산 계좌 인증이 완료되지 않았습니다. 상태를 확인해 주세요.");
          return;
        }
      } catch {
        if (!alive) return;
      }
      const delay = totalElapsed >= SLOW_THRESHOLD ? SLOW_DELAY : INITIAL_DELAY;
      totalElapsed += delay;
      if (totalElapsed > STOP_AFTER) {
        return;
      }
      schedule(delay);
    };

    void pollStatus();

    return () => {
      alive = false;
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [queryClient, seller?.status, seller?.tossSellerId, sellerQueryKey, toast]);

  const syncSellerStatus = useCallback(async () => {
    if (sellerSyncing) return;
    setSellerSyncing(true);
    try {
      if (!seller?.tossSellerId) {
        // Seller registration request may be pending before seller query reflects tossSellerId.
        try {
          const status = await apiGetSellerStatus();
          const tossSellerId = status.tossSellerId ?? null;
          if (tossSellerId) {
            queryClient.invalidateQueries({ queryKey: sellerQueryKey }).catch((): void => undefined);
          } else {
            toast.show("토스 셀러 ID 발급 대기 중입니다. 잠시 후 다시 시도해 주세요.");
            return;
          }
        } catch {
          toast.warning("정산 계좌 상태를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.");
          return;
        }
      }
      const updated = await apiSyncSeller();
      queryClient.setQueryData(sellerQueryKey, updated);
      const status = (updated.status ?? "").toUpperCase();
      if (status === "APPROVED") {
        setPendingSellerInfo(null);
        toast.success("정산 계좌 등록이 완료되었습니다.");
      } else if (status === "REJECTED" || status === "SUSPENDED") {
        toast.warning("정산 계좌 인증 상태를 확인해 주세요.");
      } else {
        toast.show("아직 인증 대기 상태입니다.");
      }
    } catch {
      toast.error("동기화에 실패했습니다.");
    } finally {
      setSellerSyncing(false);
    }
  }, [queryClient, seller?.tossSellerId, sellerQueryKey, sellerSyncing, toast]);

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
    username,
    phone,
    onOpenProfileModal: openProfileModal,
    onOpenPhoneModal: openPhoneModal,
    onOpenPasswordModal: openPasswordModal,
  };

  const academyView: AcademyViewState = {
    data: academy,
    onOpenEditModal: openAcademyModal,
    isFreePlan: !subscription || subscription.planId === "free",
    paymentEnabled: useMemo(() => {
      const planId = subscription?.planId || academy?.billingSubscriptionId || "";
      if (!planId) return false;
      const normalized = planId.toLowerCase();
      if (normalized === "enterprise") return true;
      return normalized.includes("-pay");
    }, [subscription?.planId, academy?.billingSubscriptionId]),
  };

  const billingView: BillingViewState = {
    loading: subscriptionLoading,
    data: subscription,
    createOrUpdate: async (payload): Promise<void> => {
      setSubscriptionLoading(true);
      try {
        const sub = await apiUpsertSubscription(payload);
        setSubscription(sub);
      } finally {
        setSubscriptionLoading(false);
      }
    },
    cancel: async (): Promise<void> => {
      setSubscriptionLoading(true);
      try {
        await apiCancelSubscription();
        // 서버에서 구독을 CANCELED 상태로 표시하고, 다음 결제부터 자동결제를 중단합니다.
        // 현재 결제 주기 종료일까지는 academy.billingCurrentPeriodEnd 기준으로 이용이 유지됩니다.
        let next: SubscriptionDto | null = null;
        try {
          next = await apiGetSubscription();
        } catch {
          next = null;
        }
        setSubscription(next);
      } finally {
        setSubscriptionLoading(false);
      }
    },
  };

  const hasSeller = Boolean(seller?.tossSellerId);
  const normalizedSellerStatus = (seller?.status ?? "").toUpperCase();
  const isPendingStatus =
    normalizedSellerStatus === "PENDING" || normalizedSellerStatus === "APPROVAL_REQUIRED";
  const awaitingVerification = Boolean(pendingSellerInfo && !hasSeller);
  const verificationPending = Boolean(pendingSellerInfo) || isPendingStatus;
  const derivedEmail =
    seller?.businessType === "INDIVIDUAL"
      ? seller?.individual?.email
      : seller?.company?.email;
  const sellerView: SellerViewState = {
    loading: sellerLoading,
    data: seller,
    status: seller?.status ?? null,
    canRegister: Boolean(academy?.id) && !hasSeller && !awaitingVerification,
    canEdit: hasSeller,
    showPendingBadge: verificationPending,
    verificationPending,
    syncing: sellerSyncing,
    syncStatus: syncSellerStatus,
    buttonText: hasSeller ? "정산 계좌 정보 수정" : "정산 계좌 등록",
    modalMode: hasSeller ? "edit" : "create",
    onOpenRegister: openSellerModal,
    awaitingVerification,
    pendingEmail: verificationPending ? derivedEmail ?? pendingSellerInfo?.email ?? null : null,
    pendingTossSellerId:
      verificationPending ? seller?.tossSellerId ?? pendingSellerInfo?.tossSellerId ?? null : null,
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

  const sellerModalState: SellerModalState = {
    open: sellerModalOpen,
    creating: !seller || !seller.tossSellerId,
    submitting: sellerModalSubmitting,
    error: sellerModalError,
    form: sellerModalForm,
    updateField: updateSellerModalField,
    submit: submitSellerModal,
    closeModal: closeSellerModal,
  };

  const teachersView = {
    loading: teachersLoading,
    error: teachersError,
    teachers: teacherList,
    onRefresh: loadTeachers,
    onOpenCreate: openTeacherModal,
    onSelect: openTeacherDetail,
  };

  return {
    loading,
    error,
    account,
    academy: academyView,
    billing: billingView,
    seller: sellerView,
    teachers: teachersView,
    profileModal,
    phoneModal,
    passwordModal,
    academyModal,
    sellerModal: sellerModalState,
    teacherCreateModal: {
      open: teacherModalOpen,
      form: teacherModalForm,
      submitting: teacherModalSubmitting,
      error: teacherModalError,
      fieldErrors: teacherModalFieldErrors,
      focusField: teacherModalFocusField,
      openModal: openTeacherModal,
      closeModal: closeTeacherModal,
      updateField: updateTeacherField,
      submit: submitTeacherModal,
      clearFocusField: clearTeacherFocusField,
    },
    handleLogout,
    clearError,
  };
}
