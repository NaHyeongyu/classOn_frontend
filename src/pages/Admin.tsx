import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { routes } from "@/routes";
import { invalidateCacheByPrefix } from "@/lib/fetcher";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useToast } from "@/components/common/Toast";
import { AdminDashboardPageView } from "@/components/admin/AdminDashboardPageView";
import {
  useAdminDashboard,
  type AdminSummaryItem,
} from "@/features/admin/useAdminDashboard";
import type { AdminQuickAction } from "@/components/admin/AdminQuickActions";

const IconBuilding = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 21h18" />
    <path d="M4 21V9l8-6 8 6v12" />
    <path d="M9 21V12h6v9" />
  </svg>
);
const IconActivity = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);
const IconWallet = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="5" width="20" height="14" rx="3" />
    <path d="M16 12h4" />
    <path d="M16 9h4" />
  </svg>
);
const IconCpu = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <rect x="9" y="9" width="6" height="6" rx="1" />
    <path d="M9 2v2 M15 2v2 M9 20v2 M15 20v2 M2 9h2 M2 15h2 M20 9h2 M20 15h2" />
  </svg>
);
const IconSpark = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m12 2 1.7 5.2L19 9l-4 3 1.5 5L12 14l-4.5 3 1.5-5-4-3 5.3-1.8L12 2z" />
  </svg>
);
const IconInbox = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 4h16l2 8-2 8H4l-2-8z" />
    <path d="M4 12h5l2 3h2l2-3h5" />
  </svg>
);
const IconRefresh = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.63-3.36L23 10" />
    <path d="M20.49 15a9 9 0 0 1-14.63 3.36L1 14" />
  </svg>
);
const IconTerminal = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="14" rx="2" />
    <path d="m7 8 3 3-3 3" />
    <path d="M11 16h6" />
  </svg>
);

export default function AdminPage() {
  const navigate = useNavigate();
  const { admin, logout } = useAdminAuth();
  const { success: showSuccess, error: showError } = useToast();
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
  } = useAdminDashboard({ showSuccess, showError });
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

  const summaryItems = useMemo<AdminSummaryItem[]>(() => {
    return [
      {
        label: "전체 학원 수",
        value: overview?.academies ?? "—",
        icon: IconBuilding,
      },
      {
        label: "최근 30일 로그인",
        value: overview?.logins30d ?? "—",
        icon: IconActivity,
      },
      {
        label: "최근 30일 결제합계(원)",
        value:
          overview?.paymentsAmount30d != null
            ? Math.round((overview.paymentsAmount30d || 0) / 100).toLocaleString(
                "ko-KR",
              )
            : "—",
        icon: IconWallet,
      },
      {
        label: "오늘 API 호출",
        value: overview?.apiCallsToday ?? "—",
        icon: IconCpu,
      },
      {
        label: "오늘 OpenAI 호출",
        value: overview?.openaiCallsToday ?? "—",
        icon: IconSpark,
      },
      {
        label: "미처리 문의",
        value:
          feedbackNewCount != null ? feedbackNewCount.toLocaleString("ko-KR") : "—",
        icon: IconInbox,
      },
    ];
  }, [overview, feedbackNewCount]);

  const quickActions = useMemo<AdminQuickAction[]>(() => {
    return [
      {
        title: "데이터 새로고침",
        description: "대시보드 요약과 로그 데이터를 즉시 갱신합니다.",
        icon: IconSpark,
        onClick: handleRefreshData,
      },
      {
        title: "캘린더 강제 새로고침",
        description: "클라이언트 캘린더 캐시를 초기화하고 새로고침 이벤트를 발송합니다.",
        icon: IconRefresh,
        onClick: triggerCalendarRefresh,
      },
      {
        title: "API 캐시 초기화",
        description: "학생·수업·캘린더 관련 캐시를 비워 데이터 오류를 예방합니다.",
        icon: IconCpu,
        onClick: handleClearCaches,
      },
      {
        title: "로그인 기록",
        description: "최근 관리자 로그인 이벤트를 확인합니다.",
        icon: IconActivity,
        href: routes.admin + "/logins",
      },
      {
        title: "API 로그",
        description: "서비스 API 호출 이력을 실시간으로 살펴봅니다.",
        icon: IconTerminal,
        href: routes.admin + "/api-logs",
      },
      {
        title: "결제 기록",
        description: "결제 발생 내역과 상태를 점검합니다.",
        icon: IconWallet,
        href: routes.admin + "/payments",
      },
      {
        title: "문의/피드백",
        description: "사용자 문의를 처리하고 상태를 업데이트합니다.",
        icon: IconInbox,
        href: routes.admin + "/feedbacks",
      },
    ];
  }, [handleClearCaches, handleRefreshData, triggerCalendarRefresh]);

  const heroProps = {
    adminName: admin?.username,
    adminRole: admin?.role ?? null,
    isLoggedIn: Boolean(admin),
    lastUpdatedLabel,
    isRefreshing,
    onRefresh: handleRefreshData,
    onClearCaches: handleClearCaches,
    onLogout: () => logout(),
    onLogin: () => navigate(routes.admin + "/login"),
  };

  const rangeProps = {
    from,
    to,
    onChangeFrom: setFrom,
    onChangeTo: setTo,
    loginsInRange,
  };

  return (
    <AdminDashboardPageView
      hero={heroProps}
      statusBar={{
        isLoggedIn: Boolean(admin),
        username: admin?.username,
        role: admin?.role ?? null,
      }}
      summary={{
        items: summaryItems,
        loading: summaryLoading,
      }}
      quickActions={quickActions}
      feedback={{
        rows: feedbackRows,
        total: feedbackTotal,
        newCount: feedbackNewCount,
        error: feedbackError,
      }}
      payments={payments}
      loginLogs={loginLogs}
      range={rangeProps}
      loadError={loadError}
      onRetry={handleRefreshData}
      isRefreshing={isRefreshing}
    />
  );
}
