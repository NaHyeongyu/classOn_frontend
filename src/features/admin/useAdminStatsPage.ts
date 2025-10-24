import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  getAdminOverview,
  getPaymentsPaged,
  listLoginLogsPaged,
  type AdminOverview,
} from "@/api/admin";
import { listAdminAcademies, type AdminAcademyRow } from "@/api/adminAcademies";
import { buildDailyTrend, type TrendDataset } from "@/lib/trend";

const RANGE_OPTIONS = [7, 14, 30] as const;

type ToastErrorFn = (message: string) => void;

type PaymentsResponse = Awaited<ReturnType<typeof getPaymentsPaged>>;
type PaymentRow = PaymentsResponse extends { content: infer T }
  ? T extends Array<infer P>
    ? P
    : never
  : never;

type LoginsResponse = Awaited<ReturnType<typeof listLoginLogsPaged>>;
type LoginRow = LoginsResponse extends { content: infer L }
  ? L extends Array<infer R>
    ? R
    : never
  : never;

type UseAdminStatsPageOptions = {
  toastError: ToastErrorFn;
};

export function useAdminStatsPage({ toastError }: UseAdminStatsPageOptions) {
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [logins, setLogins] = useState<LoginRow[]>([]);
  const [academies, setAcademies] = useState<AdminAcademyRow[]>([]);
  const [rangeDays, setRangeDays] =
    useState<(typeof RANGE_OPTIONS)[number]>(14);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);

  const mountedRef = useRef(true);

  useEffect(
    () => () => {
      mountedRef.current = false;
    },
    [],
  );

  const toDate = useMemo(() => new Date(), []);
  const toDateStr = useMemo(
    () => toDate.toISOString().slice(0, 10),
    [toDate],
  );
  const fromDateStr = useMemo(() => {
    const d = new Date(toDate);
    d.setDate(d.getDate() - (rangeDays - 1));
    return d.toISOString().slice(0, 10);
  }, [toDate, rangeDays]);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [overviewRes, paymentsRes, loginsRes, academiesRes] =
        await Promise.all([
          getAdminOverview(),
          getPaymentsPaged({
            page: 0,
            size: 200,
            from: fromDateStr,
            to: toDateStr,
          }),
          listLoginLogsPaged({
            page: 0,
            size: 200,
            from: fromDateStr,
            to: toDateStr,
          }),
          listAdminAcademies({
            page: 0,
            size: 200,
            from: fromDateStr,
            to: toDateStr,
          }),
        ]);
      if (!mountedRef.current) return;
      setOverview(overviewRes);
      setPayments((paymentsRes as PaymentsResponse).content || []);
      setLogins((loginsRes as LoginsResponse).content || []);
      setAcademies(academiesRes.content || []);
      setLastUpdatedAt(new Date());
    } catch (err: unknown) {
      if (!mountedRef.current) return;
      const message =
        err instanceof Error ? err.message : "통계를 불러오지 못했습니다.";
      setError(message);
      toastError(message);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [fromDateStr, toDateStr, toastError]);

  useEffect(() => {
    void fetchStats();
  }, [fetchStats]);

  const paymentTrend: TrendDataset = useMemo(() => {
    return buildDailyTrend(
      rangeDays,
      toDate,
      payments,
      (row) => row?.createdAt,
      (row) => (row?.amountCents || 0) / 100,
    );
  }, [rangeDays, toDate, payments]);

  const loginTrend: TrendDataset = useMemo(() => {
    return buildDailyTrend(
      rangeDays,
      toDate,
      logins,
      (row) => row?.createdAt,
      () => 1,
    );
  }, [rangeDays, toDate, logins]);

  const topPaymentAcademies = useMemo(() => {
    return [...academies]
      .sort(
        (a, b) => (b.paymentAmountCents || 0) - (a.paymentAmountCents || 0),
      )
      .slice(0, 5);
  }, [academies]);

  const topUsageAcademies = useMemo(() => {
    return [...academies]
      .map((row) => ({
        ...row,
        usageScore: (row.apiCalls || 0) + (row.logins || 0),
      }))
      .sort((a, b) => (b.usageScore || 0) - (a.usageScore || 0))
      .slice(0, 5);
  }, [academies]);

  const lastUpdatedLabel = useMemo(() => {
    if (!lastUpdatedAt) return "데이터 준비 중";
    const diffMs = Date.now() - lastUpdatedAt.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    if (diffMinutes < 1) return "방금 전";
    if (diffMinutes < 60) return `${diffMinutes}분 전`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}시간 전`;
    return lastUpdatedAt.toLocaleString("ko-KR", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }, [lastUpdatedAt]);

  const overviewStats = useMemo(() => {
    if (!overview) return [];
    return [
      {
        label: "전체 학원 수",
        value:
          overview.academies?.toLocaleString("ko-KR") ?? "-",
      },
      {
        label: "최근 30일 로그인",
        value:
          overview.logins30d?.toLocaleString("ko-KR") ?? "-",
      },
      {
        label: "최근 30일 결제합계(원)",
        value:
          overview.paymentsAmount30d != null
            ? Math.round((overview.paymentsAmount30d || 0) / 100).toLocaleString(
                "ko-KR",
              )
            : "-",
      },
      {
        label: "오늘 API 호출",
        value:
          overview.apiCallsToday?.toLocaleString("ko-KR") ?? "-",
      },
      {
        label: "오늘 OpenAI 호출",
        value:
          overview.openaiCallsToday?.toLocaleString("ko-KR") ?? "-",
      },
    ];
  }, [overview]);

  return {
    overview,
    overviewStats,
    payments,
    logins,
    academies,
    rangeDays,
    setRangeDays,
    loading,
    error,
    lastUpdatedLabel,
    fetchStats,
    paymentTrend,
    loginTrend,
    topPaymentAcademies,
    topUsageAcademies,
    fromDateStr,
    toDateStr,
  };
}

export { RANGE_OPTIONS };
