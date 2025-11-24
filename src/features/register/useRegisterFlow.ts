import { useCallback, useEffect, useMemo, useState } from "react";
import {
  apiCheckBizNo,
  apiCheckUsername,
  apiOnboardComplete,
  // apiRequestPhoneCode,
  // apiVerifyPhoneCode,
} from "@/api/auth";
import {
  maskBizNo,
  normalizeMobile,
  secondCategories,
  toErrorMessage,
} from "./utils";

type Step = 1 | 2 | 3;

export type StudentScaleOption =
  | ""
  | "UNDER_50"
  | "RANGE_50_100"
  | "RANGE_100_300"
  | "RANGE_300_500"
  | "OVER_500";

export type PlanSelection =
  | ""
  | "free"
  | "plan-100-basic"
  | "plan-100-pay"
  | "plan-300-basic"
  | "plan-300-pay"
  | "plan-500-basic"
  | "plan-500-pay"
  | "enterprise";

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
  studentScale: StudentScaleOption;
  setStudentScale: (value: StudentScaleOption) => void;
  selectedPlan: PlanSelection;
  setSelectedPlan: (value: PlanSelection) => void;
  canProceedAccount: boolean;
  handleAccountSubmit: (event: React.FormEvent) => Promise<void>;
  backToAccount: () => void;
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
  const [studentScale, setStudentScaleState] = useState<StudentScaleOption>("UNDER_50");
  const [selectedPlan, setSelectedPlanState] = useState<PlanSelection>("");
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

  const setStudentScale = useCallback((value: StudentScaleOption) => {
    setStudentScaleState(value);
    setSelectedPlanState((prev) => {
      if (value === "OVER_500") return "enterprise";
      return prev === "enterprise" ? "" : prev;
    });
  }, []);

  const setSelectedPlan = useCallback((value: PlanSelection) => {
    setSelectedPlanState(value);
  }, []);

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
      // NOTE: 문자 인증은 개발 단계에서 비활성화되어 바로 다음 단계로 이동합니다.
      setPhone(normalizedPhone!);
      setDevCodeHint(null);
      setResendCooldown(0);
      setStep(2);
    },
    [phoneValue, setPhone]
  );

  const handleCodeSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      setError(null);
      // NOTE: 실제 인증은 비활성화 상태이므로 코드를 입력하지 않아도 바로 진행합니다.
      setStep(3);
    },
    []
  );

  const handleResendCode = useCallback(async () => {
    setError("개발 단계에서는 문자 인증이 비활성화되어 있습니다.");
    setResendCooldown(0);
  }, []);

  const backToStep1 = useCallback(() => {
    setStep(1);
    setCodeValue("");
    setStep2Err({});
  }, []);

  const handleAccountSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      setError(null);
      const normalized = normalizeMobile(phoneValue);
      if (!normalized) {
        setError("휴대폰 번호 형식을 다시 확인해 주세요.");
        return;
      }
      setPhone(normalized);
      setStep(3);
    },
    [phoneValue, setPhone]
  );

  const backToAccount = useCallback(() => {
    setStep(2);
    setError(null);
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
      const normalizedPhone = normalizeMobile(phoneValue);
      if (!normalizedPhone) {
        setError("휴대폰 번호 형식을 다시 확인해 주세요.");
        return false;
      }
      const planChosen = studentScale !== "" && selectedPlan !== "";
      if (!planChosen || !agree) {
        setError("원생 규모, 요금제 선택 및 약관 동의를 완료해 주세요.");
        return false;
      }
      const { raw } = maskBizNo(bizNo);
      setLoading(true);
      try {
        await apiOnboardComplete({
          name: name || undefined,
          phone: normalizedPhone,
          username: usernameValue,
          password,
          academyName,
          bizNo: raw || undefined,
          category1: category1 as string,
          category2:
            category1 !== "기타" ? category2 || undefined : undefined,
          categoryEtc:
            category1 === "기타" ? categoryEtc || undefined : undefined,
          studentScale: studentScale || undefined,
          selectedPlan: selectedPlan || undefined,
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
      selectedPlan,
      agree,
      referral,
      representative,
      studentScale,
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

  const canProceedAccount = useMemo(() => {
    const { raw } = maskBizNo(bizNo);
    const phoneValid = Boolean(normalizeMobile(phoneValue));
    const bizValid =
      raw.length === 0 || (raw.length === 10 && bizNoAvailable !== false);
    return (
      phoneValid &&
      usernameValue.length > 0 &&
      usernameAvailable !== false &&
      pwRuleLen &&
      pwRuleMix &&
      password.length > 0 &&
      password === password2 &&
      academyName.trim().length > 0 &&
      category1 !== "" &&
      bizValid
    );
  }, [
    academyName,
    bizNo,
    bizNoAvailable,
    category1,
    password,
    password2,
    phoneValue,
    pwRuleLen,
    pwRuleMix,
    usernameAvailable,
    usernameValue,
  ]);

  const canSubmitStep3 = useMemo(() => {
    const { raw } = maskBizNo(bizNo);
    const phoneValid = Boolean(normalizeMobile(phoneValue));
    const planChosen = studentScale !== "" && selectedPlan !== "";
    const bizValid =
      raw.length === 0 || (raw.length === 10 && bizNoAvailable !== false);
    return (
      !loading &&
      phoneValid &&
      usernameValue.length > 0 &&
      usernameAvailable !== false &&
      pwRuleLen &&
      pwRuleMix &&
      password.length > 0 &&
      password === password2 &&
      academyName.trim().length > 0 &&
      category1 !== "" &&
      planChosen &&
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
    phoneValue,
    password,
    password2,
    pwRuleLen,
    pwRuleMix,
    selectedPlan,
    studentScale,
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
    studentScale,
    setStudentScale,
    selectedPlan,
    setSelectedPlan,
    canProceedAccount,
    handleAccountSubmit,
    backToAccount,
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
