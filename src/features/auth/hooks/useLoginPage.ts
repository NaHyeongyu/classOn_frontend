import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type RefObject,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { routes } from "@/routes";
import type { AuthUser } from "@/lib/auth";
import {
  apiFindUsernames,
  apiRequestPhoneCode,
  apiResetPassword,
} from "@/api/auth";

export type FoundAccount = {
  username: string;
  name?: string;
};

type LocationState = { from?: string } | undefined;

export type LoginFormState = {
  username: string;
  setUsername: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  submitted: boolean;
  loading: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void> | void;
};

export type LoginDialogState = {
  open: boolean;
  message: string;
  close: () => void;
};

export type LoginFindIdModalState = {
  open: boolean;
  phone: string;
  code: string;
  message: string | null;
  error: string | null;
  submitted: boolean;
  loading: boolean;
  requestingCode: boolean;
  cooldown: number;
  digits: string;
  codeVisible: boolean;
  accounts: FoundAccount[];
  phoneRef: RefObject<HTMLInputElement>;
  codeRef: RefObject<HTMLInputElement>;
  openModal: () => void;
  closeModal: () => void;
  setPhone: (value: string) => void;
  setCode: (value: string) => void;
  sendCode: () => Promise<void>;
  submit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
};

export type LoginResetModalState = {
  open: boolean;
  username: string;
  phone: string;
  code: string;
  message: string | null;
  error: string | null;
  result: string | null;
  submitted: boolean;
  requestingCode: boolean;
  submitting: boolean;
  cooldown: number;
  digits: string;
  codeVisible: boolean;
  phoneRef: RefObject<HTMLInputElement>;
  codeRef: RefObject<HTMLInputElement>;
  openModal: () => void;
  openFromFind: (account?: FoundAccount, phone?: string) => void;
  closeModal: () => void;
  setUsername: (value: string) => void;
  setPhone: (value: string) => void;
  setCode: (value: string) => void;
  sendCode: () => Promise<void>;
  submit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
};

export type UseLoginPageResult = {
  form: LoginFormState;
  dialog: LoginDialogState;
  findIdModal: LoginFindIdModalState;
  resetModal: LoginResetModalState;
};

function resolveRedirectPath(user: AuthUser, fallback: string): string {
  const role = (user.role ?? "").toString().toUpperCase();
  const isTeacher = role.includes("TEACHER");
  const isAdmin = role.includes("ADMIN");
  const isOwner = role.includes("OWNER");
  const defaultDestination = isAdmin || isOwner ? routes.myAcademy : routes.home;

  if (isTeacher) {
    return routes.teacherHome;
  }

  let next = fallback && fallback !== routes.login ? fallback : defaultDestination;

  if (next.startsWith("/teacher")) {
    next = isTeacher ? next : defaultDestination;
  }

  if (next.startsWith("/admin") && !(isAdmin || isOwner)) {
    next = defaultDestination;
  }

  return next || defaultDestination;
}

export function useLoginPage(): UseLoginPageResult {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LocationState;
  const redirectTo = typeof locationState?.from === "string" && locationState.from.length > 0 ? locationState.from : "/";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("로그인에 실패했습니다.");

  const [findIdOpen, setFindIdOpen] = useState(false);
  const [findPhone, setFindPhone] = useState("");
  const [findCode, setFindCode] = useState("");
  const [findSubmitted, setFindSubmitted] = useState(false);
  const [findLoading, setFindLoading] = useState(false);
  const [findRequestingCode, setFindRequestingCode] = useState(false);
  const [findCooldown, setFindCooldown] = useState(0);
  const [findMessage, setFindMessage] = useState<string | null>(null);
  const [findError, setFindError] = useState<string | null>(null);
  const [findCodeVisible, setFindCodeVisible] = useState(false);
  const [foundAccounts, setFoundAccounts] = useState<FoundAccount[]>([]);

  const [resetOpen, setResetOpen] = useState(false);
  const [resetUsername, setResetUsername] = useState("");
  const [resetPhone, setResetPhone] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetResult, setResetResult] = useState<string | null>(null);
  const [resetSubmitted, setResetSubmitted] = useState(false);
  const [resetRequestingCode, setResetRequestingCode] = useState(false);
  const [resetCooldown, setResetCooldown] = useState(0);
  const [resetSubmitting, setResetSubmitting] = useState(false);
  const [resetCodeVisible, setResetCodeVisible] = useState(false);

  const findPhoneRef = useRef<HTMLInputElement>(null);
  const findCodeRef = useRef<HTMLInputElement>(null);
  const resetPhoneRef = useRef<HTMLInputElement>(null);
  const resetCodeRef = useRef<HTMLInputElement>(null);

  const findDigits = useMemo(() => extractDigits(findPhone), [findPhone]);
  const resetDigits = useMemo(() => extractDigits(resetPhone), [resetPhone]);

  useEffect(() => {
    if (!findIdOpen || findCooldown <= 0) return;
    const timer = window.setTimeout(() => {
      setFindCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [findIdOpen, findCooldown]);

  useEffect(() => {
    if (!resetOpen || resetCooldown <= 0) return;
    const timer = window.setTimeout(() => {
      setResetCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [resetOpen, resetCooldown]);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setSubmitted(true);
      if (!username.trim() || !password.trim()) {
        setDialogMessage("아이디와 비밀번호를 입력해 주세요.");
        setDialogOpen(true);
        return;
      }
      setLoading(true);
      try {
        const authUser = await login(username.trim(), password);
        const nextPath = resolveRedirectPath(authUser, redirectTo);
        navigate(nextPath, { replace: true });
      } catch (error) {
        setDialogMessage(readableLoginError(error));
        setDialogOpen(true);
      } finally {
        setLoading(false);
      }
    },
    [login, navigate, password, redirectTo, username],
  );

  const openFindModal = useCallback(() => {
    setFindIdOpen(true);
    setFindPhone("");
    setFindCode("");
    setFindMessage(null);
    setFindError(null);
    setFoundAccounts([]);
    setFindSubmitted(false);
    setFindLoading(false);
    setFindRequestingCode(false);
    setFindCooldown(0);
    setFindCodeVisible(false);
  }, []);

  const closeFindModal = useCallback(() => {
    setFindIdOpen(false);
    setFindLoading(false);
    setFindRequestingCode(false);
    setFindMessage(null);
    setFindError(null);
    setFoundAccounts([]);
    setFindSubmitted(false);
    setFindPhone("");
    setFindCode("");
    setFindCooldown(0);
    setFindCodeVisible(false);
  }, []);

  const setFindPhoneSanitized = useCallback((value: string) => {
    setFindPhone(value.replace(/\D/g, "").slice(0, 11));
    setFindMessage(null);
    setFindError(null);
    setFoundAccounts([]);
    setFindCode("");
    setFindCooldown(0);
    setFindCodeVisible(false);
  }, []);

  const setFindCodeSanitized = useCallback((value: string) => {
    setFindCode(value.replace(/\D/g, "").slice(0, 6));
    setFindError(null);
  }, []);

  const sendFindCode = useCallback(async () => {
    setFindSubmitted(false);
    setFindError(null);
    setFindMessage(null);
    setFoundAccounts([]);
    const digits = findDigits;
    if (digits.length !== 11) {
      setFindError("휴대폰 번호 11자리를 입력해 주세요.");
      return;
    }
    setFindRequestingCode(true);
    try {
      const res = await apiRequestPhoneCode(digits);
      if (!res.success) {
        setFindError("인증번호 발송에 실패했습니다.");
      } else {
        setFindMessage(
          res.code
            ? `인증번호(${res.code})가 발급되었습니다.`
            : "인증번호가 발송되었습니다.",
        );
        setFindCooldown(60);
        setFindCodeVisible(true);
        setFindCode("");
        window.setTimeout(() => {
          findCodeRef.current?.focus();
        }, 0);
      }
    } catch (error) {
      setFindError(toErrorMessage(error, "인증번호 발송에 실패했습니다."));
    } finally {
      setFindRequestingCode(false);
    }
  }, [findDigits]);

  const submitFindModal = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setFindSubmitted(true);
      setFindError(null);
      setFindMessage(null);
      setFoundAccounts([]);
      const digits = findDigits;
      if (digits.length !== 11) {
        setFindError("휴대폰 번호 11자리를 입력해 주세요.");
        return;
      }
      const codeTrim = findCode.trim();
      if (codeTrim.length !== 6) {
        setFindCodeVisible(true);
        setFindError("인증번호 6자리를 입력해 주세요.");
        return;
      }
      setFindLoading(true);
      try {
        const res = await apiFindUsernames(digits, codeTrim);
        const accounts = res.accounts ?? [];
        setFoundAccounts(accounts);
        if (accounts.length === 0) {
          setFindError("일치하는 아이디를 찾지 못했습니다.");
        }
      } catch (error) {
        setFindError(toErrorMessage(error, "아이디 조회에 실패했습니다."));
      } finally {
        setFindLoading(false);
      }
    },
    [findCode, findDigits],
  );

  const openResetFromFind = useCallback(
    (account?: FoundAccount, phone?: string) => {
      const usernamePrefill = account?.username ?? (foundAccounts.length === 1 ? foundAccounts[0]?.username ?? "" : "");
      setResetOpen(true);
      setResetUsername(usernamePrefill);
      setResetPhone((phone ? extractDigits(phone) : findPhone).slice(0, 11));
      setResetCode("");
      setResetMessage(null);
      setResetError(null);
      setResetResult(null);
      setResetSubmitted(false);
      setResetRequestingCode(false);
      setResetCooldown(0);
      setResetCodeVisible(false);
      setResetSubmitting(false);
      closeFindModal();
    },
    [closeFindModal, findPhone, foundAccounts],
  );

  const openResetModal = useCallback(() => {
    setResetOpen(true);
    setResetUsername("");
    setResetPhone("");
    setResetCode("");
    setResetMessage(null);
    setResetError(null);
    setResetResult(null);
    setResetSubmitted(false);
    setResetRequestingCode(false);
    setResetCooldown(0);
    setResetCodeVisible(false);
    setResetSubmitting(false);
  }, []);

  const closeResetModal = useCallback(() => {
    setResetOpen(false);
    setResetSubmitting(false);
    setResetUsername("");
    setResetPhone("");
    setResetCode("");
    setResetMessage(null);
    setResetError(null);
    setResetResult(null);
    setResetSubmitted(false);
    setResetRequestingCode(false);
    setResetCooldown(0);
    setResetCodeVisible(false);
  }, []);

  const setResetPhoneSanitized = useCallback((value: string) => {
    setResetPhone(value.replace(/\D/g, "").slice(0, 11));
    setResetMessage(null);
    setResetError(null);
    setResetResult(null);
    setResetCode("");
    setResetCooldown(0);
    setResetCodeVisible(false);
  }, []);

  const setResetCodeSanitized = useCallback((value: string) => {
    setResetCode(value.replace(/\D/g, "").slice(0, 6));
    setResetError(null);
  }, []);

  const sendResetCode = useCallback(async () => {
    setResetError(null);
    setResetMessage(null);
    setResetResult(null);
    const trimmedUsername = resetUsername.trim();
    if (!trimmedUsername) {
      setResetError("아이디를 입력해 주세요.");
      return;
    }
    const digits = resetDigits;
    if (digits.length !== 11) {
      setResetError("휴대폰 번호 11자리를 입력해 주세요.");
      return;
    }
    setResetRequestingCode(true);
    try {
      const res = await apiRequestPhoneCode(digits);
      if (!res.success) {
        setResetError("인증번호 발송에 실패했습니다.");
      } else {
        setResetMessage(
          res.code
            ? `인증번호(${res.code})가 발급되었습니다.`
            : "인증번호가 발송되었습니다.",
        );
        setResetCode("");
        setResetCooldown(60);
        setResetCodeVisible(true);
        window.setTimeout(() => {
          resetCodeRef.current?.focus();
        }, 0);
      }
    } catch (error) {
      setResetError(toErrorMessage(error, "인증번호 발송에 실패했습니다."));
    } finally {
      setResetRequestingCode(false);
    }
  }, [resetDigits, resetUsername]);

  const submitResetModal = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setResetSubmitted(true);
      setResetError(null);
      setResetResult(null);
      const trimmedUsername = resetUsername.trim();
      if (!trimmedUsername) {
        setResetError("아이디를 입력해 주세요.");
        return;
      }
      const digits = resetDigits;
      if (digits.length !== 11) {
        setResetError("휴대폰 번호 11자리를 입력해 주세요.");
        return;
      }
      const codeTrim = resetCode.trim();
      if (codeTrim.length !== 6) {
        setResetCodeVisible(true);
        setResetError("인증번호 6자리를 입력해 주세요.");
        return;
      }
      setResetSubmitting(true);
      try {
        const res = await apiResetPassword(trimmedUsername, digits, codeTrim);
        setResetResult(res.temporaryPassword);
      } catch (error) {
        setResetError(
          toErrorMessage(error, "임시 비밀번호 발급에 실패했습니다."),
        );
      } finally {
        setResetSubmitting(false);
      }
    },
    [resetCode, resetDigits, resetUsername],
  );

  const form: LoginFormState = {
    username,
    setUsername,
    password,
    setPassword,
    submitted,
    loading,
    onSubmit: handleSubmit,
  };

  const dialog: LoginDialogState = {
    open: dialogOpen,
    message: dialogMessage,
    close: () => setDialogOpen(false),
  };

  const findIdModal: LoginFindIdModalState = {
    open: findIdOpen,
    phone: findPhone,
    code: findCode,
    message: findMessage,
    error: findError,
    submitted: findSubmitted,
    loading: findLoading,
    requestingCode: findRequestingCode,
    cooldown: findCooldown,
    digits: findDigits,
    codeVisible: findCodeVisible,
    accounts: foundAccounts,
    phoneRef: findPhoneRef,
    codeRef: findCodeRef,
    openModal: openFindModal,
    closeModal: closeFindModal,
    setPhone: setFindPhoneSanitized,
    setCode: setFindCodeSanitized,
    sendCode: sendFindCode,
    submit: submitFindModal,
  };

  const resetModal: LoginResetModalState = {
    open: resetOpen,
    username: resetUsername,
    phone: resetPhone,
    code: resetCode,
    message: resetMessage,
    error: resetError,
    result: resetResult,
    submitted: resetSubmitted,
    requestingCode: resetRequestingCode,
    submitting: resetSubmitting,
    cooldown: resetCooldown,
    digits: resetDigits,
    codeVisible: resetCodeVisible,
    phoneRef: resetPhoneRef,
    codeRef: resetCodeRef,
    openModal: openResetModal,
    openFromFind: openResetFromFind,
    closeModal: closeResetModal,
    setUsername: setResetUsername,
    setPhone: setResetPhoneSanitized,
    setCode: setResetCodeSanitized,
    sendCode: sendResetCode,
    submit: submitResetModal,
  };

  return {
    form,
    dialog,
    findIdModal,
    resetModal,
  };
}

function extractDigits(value: string): string {
  return value.replace(/\D/g, "");
}

function readableLoginError(error: unknown): string {
  const fallback = "로그인에 실패했습니다.";
  const statusRaw =
    typeof error === "object" && error !== null && "status" in error
      ? (error as { status?: unknown }).status
      : undefined;
  const status =
    typeof statusRaw === "number"
      ? statusRaw
      : typeof statusRaw === "string"
      ? Number(statusRaw)
      : undefined;
  const messageRaw =
    typeof error === "object" && error !== null && "message" in error
      ? (error as { message?: unknown }).message
      : undefined;
  const msg = typeof messageRaw === "string" ? messageRaw : fallback;
  const lower = msg.toLowerCase();
  if (status === 401 || lower.includes("401"))
    return "아이디 또는 비밀번호가 올바르지 않습니다.";
  if (status === 403 || lower.includes("403")) return "접근이 거부되었습니다.";
  if (status === 429 || lower.includes("429"))
    return "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.";
  if (status && status >= 500)
    return "서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";
  if (lower.includes("network") || lower.includes("failed to fetch"))
    return "네트워크 연결을 확인해 주세요.";
  return fallback;
}

function toErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "object" && error && "message" in error) {
    const msg = (error as { message?: unknown }).message;
    if (typeof msg === "string") return msg;
  }
  return fallback;
}
