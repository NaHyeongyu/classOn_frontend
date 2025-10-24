import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  getAdminOverview,
  getLoginLogs,
  getPayments,
  type AdminOverview,
} from "@/api/admin";
import { listAdminAcademies } from "@/api/adminAcademies";
import {
  listFeedbacksPaged,
  type AdminFeedbackRow,
} from "@/api/adminFeedback";
import { listLoginLogsPaged } from "@/api/admin";

type ToastFns = {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
};

export type AdminLoginLog = Awaited<ReturnType<typeof getLoginLogs>> extends Array<infer T>
  ? T
  : never;
export type AdminPaymentRow = Awaited<ReturnType<typeof getPayments>> extends Array<
  infer T
>
  ? T
  : never;

export type AdminSummaryItem = {
  label: string;
  value: string | number;
  icon: ReactNode;
};

export function useAdminDashboard({ showSuccess, showError }: ToastFns) {
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [loginLogs, setLoginLogs] = useState<AdminLoginLog[]>([]);
  const [payments, setPayments] = useState<AdminPaymentRow[]>([]);
  const [feedbackRows, setFeedbackRows] = useState<AdminFeedbackRow[]>([]);
  const [feedbackTotal, setFeedbackTotal] = useState<number | null>(null);
  const [feedbackNewCount, setFeedbackNewCount] = useState<number | null>(null);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);
  const [from, setFrom] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().slice(0, 10);
  });
  const [to, setTo] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [loginsInRange, setLoginsInRange] = useState<number | null>(null);

  const mountedRef = useRef(true);
  useEffect(() => () => {
    mountedRef.current = false;
  }, []);

  const loadAll = useCallback(
    async (opts?: { silent?: boolean }) => {
      if (!mountedRef.current) return false;
      setLoading(true);
      setLoadError(null);
      try {
        setFeedbackError(null);
        const [ovRaw, logs, pays] = await Promise.all([
          getAdminOverview(),
          getLoginLogs(),
          getPayments(),
        ]);

        let overviewWithAcademies = ovRaw;
        if (!ovRaw || ovRaw.academies == null) {
          try {
            const academies = await listAdminAcademies({ page: 0, size: 1 });
            overviewWithAcademies = {
              ...(ovRaw || {}),
              academies: academies.totalElements,
            } as AdminOverview;
          } catch {
            // 학원 합계 로드 실패는 치명적이지 않으므로 무시
          }
        }

        if (!mountedRef.current) return false;
        setOverview(overviewWithAcademies);
        setLoginLogs(logs);
        setPayments(pays);
        setLastUpdatedAt(new Date());

        try {
          const fb = await listFeedbacksPaged({ page: 0, size: 5 });
          if (mountedRef.current) {
            setFeedbackRows((fb?.content || []).slice(0, 5));
            setFeedbackTotal(
              typeof fb?.totalElements === "number" ? fb.totalElements : null
            );
          }
        } catch (err) {
          if (mountedRef.current) {
            setFeedbackRows([]);
            setFeedbackTotal(null);
            setFeedbackError(
              err instanceof Error
                ? err.message
                : "문의 목록을 불러오지 못했습니다."
            );
          }
        }

        try {
          const fbNew = await listFeedbacksPaged({
            status: "NEW",
            page: 0,
            size: 1,
          });
          if (mountedRef.current) {
            setFeedbackNewCount(
              typeof fbNew?.totalElements === "number" ? fbNew.totalElements : null
            );
          }
        } catch {
          if (mountedRef.current) setFeedbackNewCount(null);
        }

        if (!opts?.silent) {
          showSuccess("대시보드 데이터를 새로고침했습니다.");
        }
        return true;
      } catch (err: unknown) {
        if (!mountedRef.current) return false;
        const message =
          err instanceof Error
            ? err.message
            : "대시보드 데이터를 불러오지 못했습니다.";
        setLoadError(message);
        showError(message);
        setFeedbackRows([]);
        setFeedbackTotal(null);
        setFeedbackNewCount(null);
        setFeedbackError("문의 데이터를 불러오지 못했습니다.");
        return false;
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    },
    [showError, showSuccess]
  );

  useEffect(() => {
    void loadAll({ silent: true });
  }, [loadAll]);

  useEffect(() => {
    let cancelled = false;
    async function loadRange() {
      try {
        const res = await listLoginLogsPaged({ from, to, page: 0, size: 1 });
        if (!cancelled && mountedRef.current) {
          setLoginsInRange(res.totalElements as number);
        }
      } catch {
        if (!cancelled && mountedRef.current) setLoginsInRange(null);
      }
    }
    void loadRange();
    return () => {
      cancelled = true;
    };
  }, [from, to]);

  const lastUpdatedLabel = useMemo(() => {
    if (!lastUpdatedAt) return null;
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

  const isInitialLoading = loading && !lastUpdatedAt && !loadError;
  const isRefreshing = loading && !!lastUpdatedAt;

  return {
    overview,
    loginLogs,
    payments,
    feedbackRows,
    feedbackTotal,
    feedbackNewCount,
    feedbackError,
    loading,
    loadError,
    lastUpdatedAt,
    lastUpdatedLabel,
    isInitialLoading,
    isRefreshing,
    from,
    to,
    setFrom,
    setTo,
    loginsInRange,
    loadAll,
  };
}
