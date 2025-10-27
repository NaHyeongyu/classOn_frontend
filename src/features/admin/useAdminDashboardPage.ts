import { useCallback, useMemo } from "react";
import { routes } from "@/routes";
import { invalidateCacheByPrefix } from "@/lib/fetcher";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import {
  useAdminDashboard,
  type AdminLoginLog,
  type AdminPaymentRow,
} from "@/features/admin/useAdminDashboard";
import type { AdminFeedbackRow } from "@/api/adminFeedback";

export type AdminSummaryMetricId =
  | "academies"
  | "logins30d"
  | "paymentsAmount30d"
  | "apiCallsToday"
  | "openaiCallsToday"
  | "feedbackNew";

export type AdminDashboardSummaryMetric = {
  id: AdminSummaryMetricId;
  label: string;
  value: string | number;
};

export type AdminQuickActionIcon =
  | "spark"
  | "refresh"
  | "cpu"
  | "activity"
  | "terminal"
  | "wallet"
  | "inbox";

export type AdminDashboardQuickAction = {
  id: string;
  title: string;
  description: string;
  icon: AdminQuickActionIcon;
  href?: string;
  onClick?: () => void;
};

export type AdminDashboardHero = {
  adminName?: string;
  adminRole?: string | null;
  isLoggedIn: boolean;
  lastUpdatedLabel: string | null;
  isRefreshing: boolean;
  onRefresh: () => void;
  onClearCaches: () => void;
  onLogout: () => void;
  onLogin: () => void;
};

export type AdminDashboardStatusBar = {
  isLoggedIn: boolean;
  username?: string;
  role?: string | null;
};

export type AdminDashboardRange = {
  from: string;
  to: string;
  onChangeFrom: (value: string) => void;
  onChangeTo: (value: string) => void;
  loginsInRange: number | null;
};

export type AdminDashboardFeedbackPanel = {
  rows: AdminFeedbackRow[];
  total: number | null;
  newCount: number | null;
  error: string | null;
};

export type AdminDashboardPageData = {
  hero: AdminDashboardHero;
  statusBar: AdminDashboardStatusBar;
  summary: {
    items: AdminDashboardSummaryMetric[];
    loading: boolean;
  };
  quickActions: AdminDashboardQuickAction[];
  feedback: AdminDashboardFeedbackPanel;
  payments: AdminPaymentRow[];
  loginLogs: AdminLoginLog[];
  range: AdminDashboardRange;
  loadError: string | null;
  onRetry: () => void;
  isRefreshing: boolean;
};

type UseAdminDashboardPageOptions = {
  onLogin: () => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
};

export function useAdminDashboardPage(
  options: UseAdminDashboardPageOptions,
): AdminDashboardPageData {
  const { onLogin, showSuccess, showError } = options;
  const { admin, logout } = useAdminAuth();
  const dashboard = useAdminDashboard({ showSuccess, showError });

  const {
    overview,
    loginLogs,
    payments,
    feedbackRows,
    feedbackTotal,
    feedbackNewCount,
    feedbackError,
    loading,
    loadError,
    lastUpdatedLabel,
    isRefreshing,
    from,
    to,
    setFrom,
    setTo,
    loginsInRange,
    loadAll,
  } = dashboard;

  const summaryLoading = loading && !overview;

  const triggerCalendarRefresh = useCallback(() => {
    try {
      window.dispatchEvent(
        new CustomEvent("calendar:classes-refresh", { detail: {} }),
      );
    } catch (err) {
      if (import.meta.env.DEV) {
        console.warn("calendar refresh dispatch failed", err);
      }
    }
  }, []);

  const handleClearCaches = useCallback(() => {
    invalidateCacheByPrefix([
      "/api/students",
      "/api/courses",
      "/api/calendar/classes",
      "/api/calendar/classes-range",
      "/api/dashboard/summary",
      "/api/dashboard/attendance-today",
      "/api/marketing/",
    ]);
    triggerCalendarRefresh();
    showSuccess("API 캐시를 초기화했습니다.");
  }, [showSuccess, triggerCalendarRefresh]);

  const handleRefreshData = useCallback(() => {
    void loadAll();
  }, [loadAll]);

  const summaryItems = useMemo<AdminDashboardSummaryMetric[]>(() => {
    return [
      {
        id: "academies",
        label: "전체 학원 수",
        value:
          overview?.academies != null
            ? overview.academies.toLocaleString("ko-KR")
            : "—",
      },
      {
        id: "logins30d",
        label: "최근 30일 로그인",
        value:
          overview?.logins30d != null
            ? overview.logins30d.toLocaleString("ko-KR")
            : "—",
      },
      {
        id: "paymentsAmount30d",
        label: "최근 30일 결제합계(원)",
        value:
          overview?.paymentsAmount30d != null
            ? Math.round(
                (overview.paymentsAmount30d || 0) / 100,
              ).toLocaleString("ko-KR")
            : "—",
      },
      {
        id: "apiCallsToday",
        label: "오늘 API 호출",
        value:
          overview?.apiCallsToday != null
            ? overview.apiCallsToday.toLocaleString("ko-KR")
            : "—",
      },
      {
        id: "openaiCallsToday",
        label: "오늘 OpenAI 호출",
        value:
          overview?.openaiCallsToday != null
            ? overview.openaiCallsToday.toLocaleString("ko-KR")
            : "—",
      },
      {
        id: "feedbackNew",
        label: "미처리 문의",
        value:
          feedbackNewCount != null
            ? feedbackNewCount.toLocaleString("ko-KR")
            : "—",
      },
    ];
  }, [overview, feedbackNewCount]);

  const quickActions = useMemo<AdminDashboardQuickAction[]>(() => {
    return [
      {
        id: "refresh-data",
        title: "데이터 새로고침",
        description: "대시보드 요약과 로그 데이터를 즉시 갱신합니다.",
        icon: "spark",
        onClick: handleRefreshData,
      },
      {
        id: "refresh-calendar",
        title: "캘린더 강제 새로고침",
        description:
          "클라이언트 캘린더 캐시를 초기화하고 새로고침 이벤트를 발송합니다.",
        icon: "refresh",
        onClick: triggerCalendarRefresh,
      },
      {
        id: "clear-api-cache",
        title: "API 캐시 초기화",
        description: "학생·수업·캘린더 관련 캐시를 비워 데이터 오류를 예방합니다.",
        icon: "cpu",
        onClick: handleClearCaches,
      },
      {
        id: "view-login-logs",
        title: "로그인 기록",
        description: "최근 관리자 로그인 이벤트를 확인합니다.",
        icon: "activity",
        href: routes.admin + "/logins",
      },
      {
        id: "view-api-logs",
        title: "API 로그",
        description: "서비스 API 호출 이력을 실시간으로 살펴봅니다.",
        icon: "terminal",
        href: routes.admin + "/api-logs",
      },
      {
        id: "view-payments",
        title: "결제 기록",
        description: "결제 발생 내역과 상태를 점검합니다.",
        icon: "wallet",
        href: routes.admin + "/payments",
      },
      {
        id: "view-feedbacks",
        title: "문의/피드백",
        description: "사용자 문의를 처리하고 상태를 업데이트합니다.",
        icon: "inbox",
        href: routes.admin + "/feedbacks",
      },
    ];
  }, [handleClearCaches, handleRefreshData, triggerCalendarRefresh]);

  const hero = useMemo<AdminDashboardHero>(
    () => ({
      adminName: admin?.username,
      adminRole: admin?.role ?? null,
      isLoggedIn: Boolean(admin),
      lastUpdatedLabel,
      isRefreshing,
      onRefresh: handleRefreshData,
      onClearCaches: handleClearCaches,
      onLogout: () => logout(),
      onLogin,
    }),
    [
      admin,
      handleRefreshData,
      handleClearCaches,
      isRefreshing,
      lastUpdatedLabel,
      logout,
      onLogin,
    ],
  );

  const statusBar = useMemo<AdminDashboardStatusBar>(
    () => ({
      isLoggedIn: Boolean(admin),
      username: admin?.username,
      role: admin?.role ?? null,
    }),
    [admin],
  );

  const range = useMemo<AdminDashboardRange>(
    () => ({
      from,
      to,
      onChangeFrom: setFrom,
      onChangeTo: setTo,
      loginsInRange,
    }),
    [from, to, setFrom, setTo, loginsInRange],
  );

  return {
    hero,
    statusBar,
    summary: {
      items: summaryItems,
      loading: summaryLoading,
    },
    quickActions,
    feedback: {
      rows: feedbackRows,
      total: feedbackTotal,
      newCount: feedbackNewCount,
      error: feedbackError,
    },
    payments,
    loginLogs,
    range,
    loadError,
    onRetry: handleRefreshData,
    isRefreshing,
  };
}
