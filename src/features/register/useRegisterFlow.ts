import { useCallback, useEffect, useMemo, useState } from "react";
import {
  apiCheckBizNo,
  apiCheckUsername,
  apiOnboardComplete,
  apiRequestPhoneCode,
  apiVerifyPhoneCode,
} from "@/api/auth";
import {
  maskBizNo,
  normalizeMobile,
  readStatus,
  secondCategories,
  toErrorMessage,
} from "./utils";

type Step = 1 | 2 | 3;

export type UseRegisterFlowResult = {
  step: Step;
  error: string | null;
  loading: boolean;
  phone: string;
  setPhone: (value: string) => void;
  name: string;
  setName: (value: string) => void;
  step1Err: { phone?: string };
  handleStep1Submit: (event: React.FormEvent) => Promise<void>;
  code: string;
  setCode: (value: string) => void;
  step2Err: { code?: string };
  resendCooldown: number;
  devCodeHint: string | null;
  handleCodeSubmit: (event: React.FormEvent) => Promise<void>;
  handleResendCode: () => Promise<void>;
  backToStep1: () => void;
  username: string;
  setUsername: (value: string) => void;
  usernameAvailable: boolean | null;
  checkUsername: () => Promise<void>;
  password: string;
  setPassword: (value: string) => void;
  password2: string;
  setPassword2: (value: string) => void;
  pwRuleLen: boolean;
  pwRuleMix: boolean;
  academyName: string;
  setAcademyName: (value: string) => void;
  academyAddress: string;
  setAcademyAddress: (value: string) => void;
  representative: string;
  setRepresentative: (value: string) => void;
  academyPhone: string;
  setAcademyPhone: (value: string) => void;
  billingEmail: string;
  setBillingEmail: (value: string) => void;
  bizNo: string;
  bizNoAvailable: boolean | null;
  handleBizNoChange: (value: string) => Promise<void>;
  category1: "" | "교과목" | "예체능" | "기타";
  setCategory1: (value: "" | "교과목" | "예체능" | "기타") => void;
  category2: string;
  setCategory2: (value: string) => void;
  categoryEtc: string;
  setCategoryEtc: (value: string) => void;
  referral: string;
  setReferral: (value: string) => void;
  agree: boolean;
  setAgree: (value: boolean) => void;
  showTerms: boolean;
  setShowTerms: (value: boolean) => void;
  showPrivacy: boolean;
  setShowPrivacy: (value: boolean) => void;
  completeRegistration: (event: React.FormEvent) => Promise<boolean>;
  setError: (value: string | null) => void;
  canSubmitStep3: boolean;
  maskBizNo: typeof maskBizNo;
  normalizeMobile: typeof normalizeMobile;
  secondCategories: typeof secondCategories;
};

export function useRegisterFlow(): UseRegisterFlowResult {
  const [step, setStep] = useState<Step>(1);
  const [phoneValue, setPhoneValue] = useState("");
  const [name, setName] = useState("");
  const [codeValue, setCodeValue] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [devCodeHint, setDevCodeHint] = useState<string | null>(null);
  const [usernameValue, setUsernameValue] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null
  );
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [pwRuleLen, setPwRuleLen] = useState(false);
  const [pwRuleMix, setPwRuleMix] = useState(false);
  const [academyName, setAcademyName] = useState("");
  const [academyAddress, setAcademyAddress] = useState("");
  const [representative, setRepresentative] = useState("");
  const [academyPhone, setAcademyPhone] = useState("");
  const [billingEmail, setBillingEmail] = useState("");
  const [bizNo, setBizNo] = useState("");
  const [bizNoAvailable, setBizNoAvailable] = useState<boolean | null>(null);
  const [category1, setCategory1State] = useState<
    "" | "교과목" | "예체능" | "기타"
  >("");
  const [category2, setCategory2] = useState("");
  const [categoryEtc, setCategoryEtc] = useState("");
  const [referral, setReferral] = useState("");
  const [agree, setAgree] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step1Err, setStep1Err] = useState<{ phone?: string }>({});
  const [step2Err, setStep2Err] = useState<{ code?: string }>({});

  useEffect(() => {
    const timer = window.setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const lenOk = password.length >= 8 && password.length <= 64;
    const mixOk = /[A-Za-z]/.test(password) && /\d/.test(password);
    setPwRuleLen(lenOk);
    setPwRuleMix(mixOk);
  }, [password]);

  const setPhone = useCallback((value: string) => {
    setPhoneValue(value);
    if (step1Err.phone) setStep1Err({});
  }, [step1Err.phone]);

  const setCode = useCallback((value: string) => {
    setCodeValue(value);
    if (step2Err.code) setStep2Err({});
  }, [step2Err.code]);

  const setUsername = useCallback((value: string) => {
    setUsernameValue(value);
    setUsernameAvailable(null);
  }, []);

  const handleStep1Submit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      setError(null);
      const nextErr: { phone?: string } = {};
      if (!phoneValue.trim()) {
        nextErr.phone = "휴대폰 번호를 입력해 주세요.";
      }
      const normalizedPhone = normalizeMobile(phoneValue);
      if (phoneValue.trim() && !normalizedPhone) {
        nextErr.phone = "010-1234-5678 형식으로 입력해 주세요.";
      }
      setStep1Err(nextErr);
      if (Object.keys(nextErr).length > 0) return;
      try {
        setPhone(normalizedPhone!);
        const res = await apiRequestPhoneCode(normalizedPhone);
        if (res.code) setDevCodeHint(res.code);
        setResendCooldown(60);
        setStep(2);
      } catch (err) {
        const status = readStatus(err);
        const message = toErrorMessage(err, "인증코드 요청에 실패했습니다.");
        if (status === 429 || message.includes("429")) {
          setError("너무 많은 요청입니다. 잠시 후 다시 시도해 주세요.");
        } else {
          setError(message);
        }
      }
    },
    [phoneValue, setPhone]
  );

  const handleCodeSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      setError(null);
      if (!codeValue.trim()) {
        setStep2Err({ code: "인증코드를 입력해 주세요." });
        return;
      }
      try {
        const normalizedPhone = normalizeMobile(phoneValue);
        if (!normalizedPhone) {
          setError("휴대폰 번호 형식을 다시 확인해 주세요.");
          return;
        }
        const res = await apiVerifyPhoneCode(normalizedPhone, codeValue);
        if (res.success) {
          setStep(3);
        } else {
          setError("인증코드가 올바르지 않습니다.");
        }
      } catch (err) {
        setError(toErrorMessage(err, "전화번호 인증에 실패했습니다."));
      }
    },
    [codeValue, phoneValue]
  );

  const handleResendCode = useCallback(async () => {
    if (resendCooldown > 0) return;
    setError(null);
    try {
      const normalizedPhone = normalizeMobile(phoneValue);
      if (!normalizedPhone) {
        setError("휴대폰 번호 형식을 다시 확인해 주세요.");
        return;
      }
      const res = await apiRequestPhoneCode(normalizedPhone);
      if (res.code) setDevCodeHint(res.code);
      setResendCooldown(60);
    } catch (err) {
      const status = readStatus(err);
      const message = toErrorMessage(err, "인증코드 요청에 실패했습니다.");
      if (status === 429 || message.includes("429")) {
        setError("너무 많은 요청입니다. 잠시 후 다시 시도해 주세요.");
      } else {
        setError(message);
      }
    }
  }, [phoneValue, resendCooldown]);

  const backToStep1 = useCallback(() => {
    setStep(1);
    setCodeValue("");
    setStep2Err({});
  }, []);

  const checkUsername = useCallback(async () => {
    if (!usernameValue) return;
    try {
      const res = await apiCheckUsername(usernameValue);
      setUsernameAvailable(res.available);
    } catch {
      setUsernameAvailable(null);
    }
  }, [usernameValue]);

  const handleBizNoChange = useCallback(async (value: string) => {
    setBizNo(value);
    const { raw } = maskBizNo(value);
    if (raw.length === 10) {
      try {
        const res = await apiCheckBizNo(raw);
        setBizNoAvailable(res.available);
      } catch {
        setBizNoAvailable(null);
      }
    } else {
      setBizNoAvailable(null);
    }
  }, []);

  const completeRegistration = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      setError(null);
      const { raw } = maskBizNo(bizNo);
      setLoading(true);
      try {
        await apiOnboardComplete({
          name: name || undefined,
          phone: phoneValue,
          username: usernameValue,
          password,
          academyName,
          bizNo: raw || undefined,
          category1: category1 as string,
          category2:
            category1 !== "기타" ? category2 || undefined : undefined,
          categoryEtc:
            category1 === "기타" ? categoryEtc || undefined : undefined,
          referral: referral || undefined,
          address: academyAddress || undefined,
          representativeName: representative || undefined,
          academyPhone: academyPhone || undefined,
          billingEmail: billingEmail || undefined,
        });
        return true;
      } catch (err) {
        setError(toErrorMessage(err, "가입에 실패했습니다."));
        return false;
      } finally {
        setLoading(false);
      }
    },
    [
      academyAddress,
      academyName,
      academyPhone,
      billingEmail,
      bizNo,
      category1,
      category2,
      categoryEtc,
      name,
      password,
      phoneValue,
      referral,
      representative,
      usernameValue,
    ]
  );

  const updateCategory1 = useCallback(
    (value: "" | "교과목" | "예체능" | "기타") => {
      setCategory1State(value);
      setCategory2("");
      setCategoryEtc("");
    },
    []
  );

  const canSubmitStep3 = useMemo(() => {
    const { raw } = maskBizNo(bizNo);
    const bizValid =
      raw.length === 0 || (raw.length === 10 && bizNoAvailable !== false);
    return (
      !loading &&
      usernameValue.length > 0 &&
      usernameAvailable !== false &&
      pwRuleLen &&
      pwRuleMix &&
      password.length > 0 &&
      password === password2 &&
      academyName.trim().length > 0 &&
      category1 !== "" &&
      bizValid &&
      agree
    );
  }, [
    academyName,
    agree,
    bizNo,
    bizNoAvailable,
    category1,
    loading,
    password,
    password2,
    pwRuleLen,
    pwRuleMix,
    usernameAvailable,
    usernameValue,
  ]);

  return {
    step,
    error,
    loading,
    phone: phoneValue,
    setPhone,
    name,
    setName,
    step1Err,
    handleStep1Submit,
    code: codeValue,
    setCode,
    step2Err,
    resendCooldown,
    devCodeHint,
    handleCodeSubmit,
    handleResendCode,
    backToStep1,
    username: usernameValue,
    setUsername,
    usernameAvailable,
    checkUsername,
    password,
    setPassword,
    password2,
    setPassword2,
    pwRuleLen,
    pwRuleMix,
    academyName,
    setAcademyName,
    academyAddress,
    setAcademyAddress,
    representative,
    setRepresentative,
    academyPhone,
    setAcademyPhone,
    billingEmail,
    setBillingEmail,
    bizNo,
    bizNoAvailable,
    handleBizNoChange,
    category1,
    setCategory1: updateCategory1,
    category2,
    setCategory2,
    categoryEtc,
    setCategoryEtc,
    referral,
    setReferral,
    agree,
    setAgree,
    showTerms,
    setShowTerms,
    showPrivacy,
    setShowPrivacy,
    completeRegistration,
    setError,
    canSubmitStep3,
    maskBizNo,
    normalizeMobile,
    secondCategories,
  };
}
