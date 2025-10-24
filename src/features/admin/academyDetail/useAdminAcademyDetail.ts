import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  getAcademySummary,
  getAcademyPaymentsPaged,
  getAcademyLoginLogsPaged,
  getAcademyApiLogsPaged,
} from "@/api/admin";
import { useToast } from "@/components/common/Toast";
import {
  buildDateRangeLabel,
  buildDateTimeRangeLabel,
  formatDateTime,
} from "./utils";
import type {
  AcademySummary,
  AcademyPaymentRow,
  AcademyLoginLogRow,
  AcademyApiLogRow,
  PagedResponse,
} from "./types";

type FiltersState = {
  from: string;
  to: string;
  setFrom: (value: string) => void;
  setTo: (value: string) => void;
  appliedPeriod: string;
  applyFilters: () => void;
};

type SummaryState = {
  data: AcademySummary | null;
  loading: boolean;
  error: string | null;
  stats: { label: string; value: string }[] | null;
  recentActivityLabel: string | null;
};

type PaymentsState = {
  rows: AcademyPaymentRow[];
  loading: boolean;
  error: string | null;
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  setSize: (value: number) => void;
  goTo: (page: number) => void;
  rangeLabel: string;
  pageInfo: string;
};

type LoginState = {
  rows: AcademyLoginLogRow[];
  loading: boolean;
  error: string | null;
  input: string;
  setInput: (value: string) => void;
  search: () => void;
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  setSize: (value: number) => void;
  goTo: (page: number) => void;
  rangeLabel: string;
  pageInfo: string;
};

type ApiState = {
  rows: AcademyApiLogRow[];
  loading: boolean;
  error: string | null;
  input: string;
  setInput: (value: string) => void;
  search: () => void;
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  setSize: (value: number) => void;
  goTo: (page: number) => void;
  rangeLabel: string;
  pageInfo: string;
};

export type AdminAcademyDetailState = {
  filters: FiltersState;
  summary: SummaryState;
  payments: PaymentsState;
  logins: LoginState;
  apiLogs: ApiState;
  formatDateTime: typeof formatDateTime;
};

function defaultFrom(): string {
  const d = new Date();
  d.setDate(d.getDate() - 30);
  return d.toISOString().slice(0, 10);
}

function defaultTo(): string {
  return new Date().toISOString().slice(0, 10);
}

export function useAdminAcademyDetail(
  academyId: number | null
): AdminAcademyDetailState {
  const { error: toastError } = useToast();

  const [from, setFrom] = useState<string>(defaultFrom);
  const [to, setTo] = useState<string>(defaultTo);

  const [summary, setSummary] = useState<AcademySummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  const [payments, setPayments] = useState<AcademyPaymentRow[]>([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [paymentsError, setPaymentsError] = useState<string | null>(null);
  const [paymentsPage, setPaymentsPage] = useState(0);
  const [paymentsSize, setPaymentsSize] = useState(20);
  const [paymentsTotalPages, setPaymentsTotalPages] = useState(0);
  const [paymentsTotalElements, setPaymentsTotalElements] = useState(0);

  const [loginRows, setLoginRows] = useState<AcademyLoginLogRow[]>([]);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginPage, setLoginPage] = useState(0);
  const [loginSize, setLoginSize] = useState(20);
  const [loginTotalPages, setLoginTotalPages] = useState(0);
  const [loginTotalElements, setLoginTotalElements] = useState(0);
  const [loginInput, setLoginInput] = useState("");
  const [loginQuery, setLoginQuery] = useState("");

  const [apiRows, setApiRows] = useState<AcademyApiLogRow[]>([]);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiPage, setApiPage] = useState(0);
  const [apiSize, setApiSize] = useState(20);
  const [apiTotalPages, setApiTotalPages] = useState(0);
  const [apiTotalElements, setApiTotalElements] = useState(0);
  const [apiInput, setApiInput] = useState("");
  const [apiQuery, setApiQuery] = useState("");

  const paymentsSizeRef = useRef(paymentsSize);
  const loginSizeRef = useRef(loginSize);
  const apiSizeRef = useRef(apiSize);
  const loginQueryRef = useRef(loginQuery);
  const apiQueryRef = useRef(apiQuery);

  useEffect(() => {
    paymentsSizeRef.current = paymentsSize;
  }, [paymentsSize]);
  useEffect(() => {
    loginSizeRef.current = loginSize;
  }, [loginSize]);
  useEffect(() => {
    apiSizeRef.current = apiSize;
  }, [apiSize]);
  useEffect(() => {
    loginQueryRef.current = loginQuery;
  }, [loginQuery]);
  useEffect(() => {
    apiQueryRef.current = apiQuery;
  }, [apiQuery]);

  const loadSummary = useCallback(async () => {
    if (!Number.isFinite(academyId)) return;
    setSummaryLoading(true);
    setSummaryError(null);
    try {
      const data = await getAcademySummary(academyId!, { from, to });
      setSummary(data as AcademySummary);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "요약을 불러오지 못했습니다.";
      setSummaryError(message);
      toastError(message);
    } finally {
      setSummaryLoading(false);
    }
  }, [academyId, from, to, toastError]);

  const loadPayments = useCallback(
    async (pageToLoad: number, sizeToLoad: number) => {
      if (!Number.isFinite(academyId)) return;
      setPaymentsLoading(true);
      setPaymentsError(null);
      try {
        const res = await getAcademyPaymentsPaged(academyId!, {
          page: pageToLoad,
          size: sizeToLoad,
          from,
          to,
        });
        const data = res as PagedResponse<AcademyPaymentRow>;
        setPayments(data.content || []);
        setPaymentsPage(data.page);
        setPaymentsSize(data.size);
        setPaymentsTotalPages(data.totalPages);
        setPaymentsTotalElements(
          data.totalElements ?? data.content?.length ?? 0
        );
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "결제 정보를 불러오지 못했습니다.";
        setPaymentsError(message);
        toastError(message);
      } finally {
        setPaymentsLoading(false);
      }
    },
    [academyId, from, to, toastError]
  );

  const loadLogins = useCallback(
    async (pageToLoad: number, sizeToLoad: number, keyword: string) => {
      if (!Number.isFinite(academyId)) return;
      setLoginLoading(true);
      setLoginError(null);
      try {
        const res = await getAcademyLoginLogsPaged(academyId!, {
          page: pageToLoad,
          size: sizeToLoad,
          from,
          to,
          q: keyword || undefined,
        });
        const data = res as PagedResponse<AcademyLoginLogRow>;
        setLoginRows(data.content || []);
        setLoginPage(data.page);
        setLoginSize(data.size);
        setLoginTotalPages(data.totalPages);
        setLoginTotalElements(
          data.totalElements ?? data.content?.length ?? 0
        );
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "로그인 기록을 불러오지 못했습니다.";
        setLoginError(message);
        toastError(message);
      } finally {
        setLoginLoading(false);
      }
    },
    [academyId, from, to, toastError]
  );

  const loadApiLogs = useCallback(
    async (pageToLoad: number, sizeToLoad: number, keyword: string) => {
      if (!Number.isFinite(academyId)) return;
      setApiLoading(true);
      setApiError(null);
      try {
        const res = await getAcademyApiLogsPaged(academyId!, {
          page: pageToLoad,
          size: sizeToLoad,
          from,
          to,
          q: keyword || undefined,
        });
        const data = res as PagedResponse<AcademyApiLogRow>;
        setApiRows(data.content || []);
        setApiPage(data.page);
        setApiSize(data.size);
        setApiTotalPages(data.totalPages);
        setApiTotalElements(data.totalElements ?? data.content?.length ?? 0);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "API 로그를 불러오지 못했습니다.";
        setApiError(message);
        toastError(message);
      } finally {
        setApiLoading(false);
      }
    },
    [academyId, from, to, toastError]
  );

  const applyFilters = useCallback(() => {
    void loadSummary();
    void loadPayments(0, paymentsSizeRef.current);
    void loadLogins(0, loginSizeRef.current, loginQueryRef.current);
    void loadApiLogs(0, apiSizeRef.current, apiQueryRef.current);
  }, [loadSummary, loadPayments, loadLogins, loadApiLogs]);

  useEffect(() => {
    if (!Number.isFinite(academyId)) return;
    applyFilters();
  }, [academyId, applyFilters]);

  const summaryStats = useMemo(() => {
    if (!summary) return null;
    return [
      { label: "학생 수", value: summary.students.toLocaleString("ko-KR") },
      { label: "수업 수", value: summary.courses.toLocaleString("ko-KR") },
      { label: "오늘 수업", value: summary.classesToday.toLocaleString("ko-KR") },
      { label: "기간 API 호출", value: summary.apiCalls.toLocaleString("ko-KR") },
      { label: "기간 로그인", value: summary.logins.toLocaleString("ko-KR") },
      { label: "기간 결제 건수", value: summary.paymentCount.toLocaleString("ko-KR") },
      {
        label: "기간 결제 합계(원)",
        value: Math.round((summary.paymentAmountCents || 0) / 100).toLocaleString("ko-KR"),
      },
    ];
  }, [summary]);

  const academyRangeLabel = useMemo(() => {
    if (!summary) return null;
    const range = [summary.loginLastAt, summary.apiLastAt, summary.paymentLastAt]
      .filter(Boolean)
      .map((value) => new Date(value as string).getTime());
    if (range.length === 0) return null;
    const lastDate = new Date(Math.max(...range));
    return `${lastDate.toLocaleDateString("ko-KR")} ${lastDate.toLocaleTimeString("ko-KR", {
      hour12: false,
    })}`;
  }, [summary]);

  const paymentsRangeLabel = useMemo(() => {
    if (payments.length === 0) return "표시할 결제가 없습니다.";
    return buildDateRangeLabel(payments);
  }, [payments]);

  const loginRangeLabel = useMemo(() => {
    if (loginRows.length === 0) return "표시할 로그인 데이터가 없습니다.";
    return buildDateTimeRangeLabel(loginRows);
  }, [loginRows]);

  const apiRangeLabel = useMemo(() => {
    if (apiRows.length === 0) return "표시할 API 로그가 없습니다.";
    return buildDateTimeRangeLabel(apiRows);
  }, [apiRows]);

  const paymentsPageInfo = `페이지 ${
    paymentsTotalPages === 0 ? 0 : paymentsPage + 1
  } / ${Math.max(1, paymentsTotalPages)} • 총 ${paymentsTotalElements.toLocaleString(
    "ko-KR"
  )}건`;
  const loginPageInfo = `페이지 ${
    loginTotalPages === 0 ? 0 : loginPage + 1
  } / ${Math.max(1, loginTotalPages)} • 총 ${loginTotalElements.toLocaleString(
    "ko-KR"
  )}건`;
  const apiPageInfo = `페이지 ${
    apiTotalPages === 0 ? 0 : apiPage + 1
  } / ${Math.max(1, apiTotalPages)} • 총 ${apiTotalElements.toLocaleString(
    "ko-KR"
  )}건`;

  const handleLoginSearch = useCallback(() => {
    const next = loginInput.trim();
    setLoginQuery(next);
    loginQueryRef.current = next;
    void loadLogins(0, loginSizeRef.current, next);
  }, [loadLogins, loginInput]);

  const handleApiSearch = useCallback(() => {
    const next = apiInput.trim();
    setApiQuery(next);
    apiQueryRef.current = next;
    void loadApiLogs(0, apiSizeRef.current, next);
  }, [apiInput, loadApiLogs]);

  const filters: FiltersState = {
    from,
    to,
    setFrom,
    setTo,
    appliedPeriod: `${from} ~ ${to}`,
    applyFilters,
  };

  const summaryState: SummaryState = {
    data: summary,
    loading: summaryLoading,
    error: summaryError,
    stats: summaryStats,
    recentActivityLabel: academyRangeLabel,
  };

  const paymentsState: PaymentsState = {
    rows: payments,
    loading: paymentsLoading,
    error: paymentsError,
    page: paymentsPage,
    size: paymentsSize,
    totalPages: paymentsTotalPages,
    totalElements: paymentsTotalElements,
    setSize: (value) => {
      setPaymentsSize(value);
      paymentsSizeRef.current = value;
      void loadPayments(0, value);
    },
    goTo: (page) =>
      loadPayments(
        Math.max(0, Math.min(paymentsTotalPages - 1, page)),
        paymentsSizeRef.current
      ),
    rangeLabel: paymentsRangeLabel,
    pageInfo: paymentsPageInfo,
  };

  const loginState: LoginState = {
    rows: loginRows,
    loading: loginLoading,
    error: loginError,
    input: loginInput,
    setInput: setLoginInput,
    search: handleLoginSearch,
    page: loginPage,
    size: loginSize,
    totalPages: loginTotalPages,
    totalElements: loginTotalElements,
    setSize: (value) => {
      setLoginSize(value);
      loginSizeRef.current = value;
      void loadLogins(0, value, loginQueryRef.current);
    },
    goTo: (page) =>
      loadLogins(
        Math.max(0, Math.min(loginTotalPages - 1, page)),
        loginSizeRef.current,
        loginQueryRef.current
      ),
    rangeLabel: loginRangeLabel,
    pageInfo: loginPageInfo,
  };

  const apiState: ApiState = {
    rows: apiRows,
    loading: apiLoading,
    error: apiError,
    input: apiInput,
    setInput: setApiInput,
    search: handleApiSearch,
    page: apiPage,
    size: apiSize,
    totalPages: apiTotalPages,
    totalElements: apiTotalElements,
    setSize: (value) => {
      setApiSize(value);
      apiSizeRef.current = value;
      void loadApiLogs(0, value, apiQueryRef.current);
    },
    goTo: (page) =>
      loadApiLogs(
        Math.max(0, Math.min(apiTotalPages - 1, page)),
        apiSizeRef.current,
        apiQueryRef.current
      ),
    rangeLabel: apiRangeLabel,
    pageInfo: apiPageInfo,
  };

  return {
    filters,
    summary: summaryState,
    payments: paymentsState,
    logins: loginState,
    apiLogs: apiState,
    formatDateTime,
  };
}
