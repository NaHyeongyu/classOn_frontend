import { useCallback, useEffect, useMemo, useState } from "react";
import {
  apiCheckBizNo,
  apiCheckUsername,
  apiGetOnboardSettlementStatus,
  apiOnboardComplete,
} from "@/api/auth";
import {
  maskBizNo,
  normalizeMobile,
  secondCategories,
  toErrorMessage,
} from "./utils";

type Step = 1 | 2 | 3 | 4 | 5 | 6;

type SettlementRegistration = {
  tossSellerId: string | null;
  status: string;
  email?: string | null;
  academyId?: number | null;
  refSellerId?: string | null;
};

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

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

export type SettlementForm = {
  businessType: "INDIVIDUAL" | "INDIVIDUAL_BUSINESS" | "CORPORATE";
  companyName: string;
  representativeName: string;
  businessRegistrationNumber: string;
  companyEmail: string;
  companyPhone: string;
  individualName: string;
  individualEmail: string;
  individualPhone: string;
  bankCode: string;
  accountNumber: string;
  accountHolderName: string;
};

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
  requiresSettlementAccount: boolean;
  settlementForm: SettlementForm;
  settlementRegistration: SettlementRegistration | null;
  settlementPolling: boolean;
  settlementLastCheckedAt: number | null;
  settlementPollingError: string | null;
  refreshSettlementStatus: () => Promise<void>;
  updateSettlementField: <K extends keyof SettlementForm>(
    field: K,
    value: SettlementForm[K],
  ) => void;
  backToPlan: () => void;
  canSubmitSettlement: boolean;
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
  const [settlementForm, setSettlementForm] = useState<SettlementForm>({
    businessType: "INDIVIDUAL_BUSINESS",
    companyName: "",
    representativeName: "",
    businessRegistrationNumber: "",
    companyEmail: "",
    companyPhone: "",
    individualName: "",
    individualEmail: "",
    individualPhone: "",
    bankCode: "",
    accountNumber: "",
    accountHolderName: "",
  });
  const [settlementRegistration, setSettlementRegistration] =
    useState<SettlementRegistration | null>(null);
  const [settlementPolling, setSettlementPolling] = useState(false);
  const [settlementLastCheckedAt, setSettlementLastCheckedAt] = useState<number | null>(null);
  const [settlementPollingError, setSettlementPollingError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step1Err, setStep1Err] = useState<{ phone?: string }>({});
  const [step2Err, setStep2Err] = useState<{ code?: string }>({});

  const requiresSettlementAccount = useMemo(() => {
    const plan = (selectedPlan || "").toLowerCase();
    return plan.endsWith("-pay") || plan === "enterprise";
  }, [selectedPlan]);

	  const refreshSettlementStatus = useCallback(async () => {
	    const academyId = settlementRegistration?.academyId ?? null;
	    const refSellerId = settlementRegistration?.refSellerId ?? null;
	    if (!academyId || !refSellerId) return;
	    try {
	      setSettlementPollingError(null);
	      const res = await apiGetOnboardSettlementStatus(academyId, refSellerId);
	      setSettlementRegistration((prev) => {
	        const next: SettlementRegistration = {
	          tossSellerId: res.tossSellerId ?? prev?.tossSellerId ?? null,
	          status: res.status ?? prev?.status ?? "PENDING",
	          email: prev?.email ?? null,
	          academyId: res.academyId ?? prev?.academyId ?? null,
	          refSellerId: res.refSellerId ?? prev?.refSellerId ?? null,
	        };
	        if (!prev) return next;
	        const unchanged =
	          (prev.tossSellerId ?? null) === (next.tossSellerId ?? null) &&
	          prev.status === next.status &&
	          (prev.email ?? null) === (next.email ?? null) &&
	          (prev.academyId ?? null) === (next.academyId ?? null) &&
	          (prev.refSellerId ?? null) === (next.refSellerId ?? null);
	        return unchanged ? prev : next;
	      });
	      setSettlementLastCheckedAt(Date.now());
	    } catch (err) {
	      setSettlementPollingError(toErrorMessage(err, "정산 계좌 상태 확인에 실패했습니다."));
	    }
	  }, [settlementRegistration?.academyId, settlementRegistration?.refSellerId]);

  useEffect(() => {
    if (step !== 6) {
      setSettlementPolling(false);
      return;
    }
    const academyId = settlementRegistration?.academyId ?? null;
	    const refSellerId = settlementRegistration?.refSellerId ?? null;
	    if (!academyId || !refSellerId) {
	      setSettlementPolling(false);
	      return;
	    }

	    let alive = true;
	    let timeoutId: number | null = null;
	    let delayMs = 3000;
    let totalElapsedMs = 0;
    const STOP_AFTER_MS = 10 * 60 * 1000;

    setSettlementPolling(true);
    setSettlementPollingError(null);

    const poll = async () => {
      if (!alive) return;
	      try {
	        const res = await apiGetOnboardSettlementStatus(academyId, refSellerId);
	        if (!alive) return;
	        setSettlementRegistration((prev) => {
	          const next: SettlementRegistration = {
	            tossSellerId: res.tossSellerId ?? prev?.tossSellerId ?? null,
	            status: res.status ?? prev?.status ?? "PENDING",
	            email: prev?.email ?? null,
	            academyId: res.academyId ?? prev?.academyId ?? null,
	            refSellerId: res.refSellerId ?? prev?.refSellerId ?? null,
	          };
	          if (!prev) return next;
	          const unchanged =
	            (prev.tossSellerId ?? null) === (next.tossSellerId ?? null) &&
	            prev.status === next.status &&
	            (prev.email ?? null) === (next.email ?? null) &&
	            (prev.academyId ?? null) === (next.academyId ?? null) &&
	            (prev.refSellerId ?? null) === (next.refSellerId ?? null);
	          return unchanged ? prev : next;
	        });
	        setSettlementLastCheckedAt(Date.now());
	        if (res.approved) {
	          setSettlementPolling(false);
	          return;
        }
      } catch (err) {
        setSettlementPollingError(toErrorMessage(err, "정산 계좌 상태 확인에 실패했습니다."));
      }
      totalElapsedMs += delayMs;
      if (!alive) return;
      if (totalElapsedMs >= STOP_AFTER_MS) {
        setSettlementPolling(false);
        return;
      }
      delayMs = Math.min(15000, delayMs + 2000);
      timeoutId = window.setTimeout(poll, delayMs);
    };

    void poll();
    return () => {
      alive = false;
      if (timeoutId !== null) window.clearTimeout(timeoutId);
      setSettlementPolling(false);
    };
  }, [step, settlementRegistration?.academyId, settlementRegistration?.refSellerId]);

  const updateSettlementField = useCallback(
    <K extends keyof SettlementForm>(
      field: K,
      value: SettlementForm[K],
    ) => {
      setSettlementForm((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const backToPlan = useCallback(() => {
    setError(null);
    setStep(4);
  }, []);

  useEffect(() => {
    if (step !== 5) return;
    setSettlementForm((prev) => ({
      ...prev,
      companyName: prev.companyName || academyName,
      representativeName: prev.representativeName || representative,
      businessRegistrationNumber: prev.businessRegistrationNumber || maskBizNo(bizNo).raw,
      companyEmail: prev.companyEmail || billingEmail,
      companyPhone: prev.companyPhone || academyPhone || phoneValue,
      accountHolderName: prev.accountHolderName || representative || academyName,
    }));
  }, [academyName, academyPhone, billingEmail, bizNo, phoneValue, representative, step]);

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
      setStep2Err({});
      if (Object.keys(nextErr).length > 0) return;
      const safePhone = normalizedPhone!;
      setResendCooldown(0);
      setDevCodeHint(null);
      setPhone(safePhone);
      setCodeValue("");

      // TEMP: SMS 인증 흐름 비활성화(전화번호 중복 가입 허용 목적).
      // NOTE: revert by restoring apiRequestPhoneCode/apiVerifyPhoneCode flow and step=2.
      setStep(3);
    },
    [phoneValue, setPhone]
  );

  const handleCodeSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      setError(null);
      const normalizedPhone = normalizeMobile(phoneValue);
      if (!normalizedPhone) {
        setError("휴대폰 번호 형식을 다시 확인해 주세요.");
        return;
      }
      setPhone(normalizedPhone);
      setStep2Err({});

      // TEMP: SMS 인증 흐름 비활성화(verify step가 노출되더라도 진행 가능).
      setStep(3);
    },
    [phoneValue, setPhone]
  );

  const handleResendCode = useCallback(async () => {
    setError(null);
    setStep2Err({});
    // TEMP: SMS 인증 비활성화.
    setError("현재 휴대폰 문자인증이 비활성화되어 있습니다.");
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
      setStep(4);
    },
    [phoneValue, setPhone]
  );

  const backToAccount = useCallback(() => {
    setStep(3);
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
      if (step === 4 && requiresSettlementAccount) {
        setStep(5);
        return false;
      }
      if (step === 5) {
        const bankOk = settlementForm.bankCode.trim().length > 0;
        const accountOk = digitsOnly(settlementForm.accountNumber).length > 0;
        const holderOk = settlementForm.accountHolderName.trim().length > 0;
        const baseOk = bankOk && accountOk && holderOk;
        const detailOk =
          settlementForm.businessType === "INDIVIDUAL"
            ? settlementForm.individualName.trim().length > 0 &&
              settlementForm.individualEmail.trim().length > 0 &&
              digitsOnly(settlementForm.individualPhone).length > 0
            : settlementForm.companyName.trim().length > 0 &&
              settlementForm.representativeName.trim().length > 0 &&
              settlementForm.companyEmail.trim().length > 0 &&
              digitsOnly(settlementForm.companyPhone).length > 0;
        const bizOk =
          settlementForm.businessType === "INDIVIDUAL" ||
          digitsOnly(settlementForm.businessRegistrationNumber).length === 10;
        if (!baseOk || !detailOk || !bizOk) {
          setError("정산 계좌 등록 정보를 모두 입력해 주세요.");
          return false;
        }
      }
      const { raw } = maskBizNo(bizNo);
      setLoading(true);
      try {
        const res = await apiOnboardComplete({
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
          settlementBusinessType: step === 5 ? settlementForm.businessType : undefined,
          settlementBankCode: step === 5 ? settlementForm.bankCode.trim() : undefined,
          settlementAccountNumber: step === 5 ? digitsOnly(settlementForm.accountNumber) : undefined,
          settlementAccountHolderName:
            step === 5 ? settlementForm.accountHolderName.trim() : undefined,
          settlementCompanyName:
            step === 5 ? settlementForm.companyName.trim() || undefined : undefined,
          settlementRepresentativeName:
            step === 5 ? settlementForm.representativeName.trim() || undefined : undefined,
          settlementBusinessRegistrationNumber:
            step === 5
              ? digitsOnly(settlementForm.businessRegistrationNumber) || undefined
              : undefined,
          settlementCompanyEmail:
            step === 5 ? settlementForm.companyEmail.trim() || undefined : undefined,
          settlementCompanyPhone:
            step === 5 ? digitsOnly(settlementForm.companyPhone) || undefined : undefined,
          settlementIndividualName:
            step === 5 ? settlementForm.individualName.trim() || undefined : undefined,
          settlementIndividualEmail:
            step === 5 ? settlementForm.individualEmail.trim() || undefined : undefined,
          settlementIndividualPhone:
            step === 5 ? digitsOnly(settlementForm.individualPhone) || undefined : undefined,
        });
        setSettlementRegistration(res.settlementRegistration ?? null);
        const sellerStatus = (res.settlementRegistration?.status ?? "").toUpperCase();
        if (requiresSettlementAccount && res.settlementRegistration && sellerStatus !== "APPROVED") {
          setStep(6);
          return false;
        }
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
      settlementForm,
      requiresSettlementAccount,
      agree,
      referral,
      representative,
      studentScale,
      step,
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

  const canSubmitSettlement = useMemo(() => {
    if (!requiresSettlementAccount) return true;
    if (loading) return false;
    const bankOk = settlementForm.bankCode.trim().length > 0;
    const accountOk = digitsOnly(settlementForm.accountNumber).length > 0;
    const holderOk = settlementForm.accountHolderName.trim().length > 0;
    if (!bankOk || !accountOk || !holderOk) return false;
    if (settlementForm.businessType === "INDIVIDUAL") {
      return (
        settlementForm.individualName.trim().length > 0 &&
        settlementForm.individualEmail.trim().length > 0 &&
        digitsOnly(settlementForm.individualPhone).length > 0
      );
    }
    return (
      settlementForm.companyName.trim().length > 0 &&
      settlementForm.representativeName.trim().length > 0 &&
      digitsOnly(settlementForm.businessRegistrationNumber).length === 10 &&
      settlementForm.companyEmail.trim().length > 0 &&
      digitsOnly(settlementForm.companyPhone).length > 0
    );
  }, [loading, requiresSettlementAccount, settlementForm]);

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
    requiresSettlementAccount,
    settlementForm,
    settlementRegistration,
    settlementPolling,
    settlementLastCheckedAt,
    settlementPollingError,
    refreshSettlementStatus,
    updateSettlementField,
    backToPlan,
    canSubmitSettlement,
    maskBizNo,
    normalizeMobile,
    secondCategories,
  };
}
