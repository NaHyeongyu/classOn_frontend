import { useMemo, useCallback, type KeyboardEvent } from "react";
import { useAdminAcademyDetail } from "@/features/admin/academyDetail/useAdminAcademyDetail";
import type { AdminAcademyDetailState } from "@/features/admin/academyDetail/useAdminAcademyDetail";

type HeaderInfo = {
  subtitle: string;
};

export type AdminAcademyDetailPageViewModel = {
  header: HeaderInfo;
  filters: AdminAcademyDetailState["filters"];
  filtersDisabled: boolean;
  summary: AdminAcademyDetailState["summary"];
  payments: AdminAcademyDetailState["payments"];
  logins: AdminAcademyDetailState["logins"];
  apiLogs: AdminAcademyDetailState["apiLogs"];
  formatDateTime: AdminAcademyDetailState["formatDateTime"];
  handleLoginKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  handleApiKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
};

export function useAdminAcademyDetailPage(
  academyId: number | null
): AdminAcademyDetailPageViewModel {
  const detail = useAdminAcademyDetail(academyId);

  const filtersDisabled =
    detail.summary.loading ||
    detail.payments.loading ||
    detail.logins.loading ||
    detail.apiLogs.loading;

  const headerSubtitle = useMemo(() => {
    if (detail.summary.loading) return "학원 정보를 불러오는 중…";
    if (detail.summary.error) return "학원 정보를 불러오지 못했습니다.";
    if (detail.summary.data) {
      const { id, name } = detail.summary.data;
      const recent = detail.summary.recentActivityLabel
        ? ` · 최근 활동 ${detail.summary.recentActivityLabel}`
        : "";
      return `#${id} · ${name}${recent}`;
    }
    return "학원 정보를 불러오지 못했습니다.";
  }, [
    detail.summary.data,
    detail.summary.error,
    detail.summary.loading,
    detail.summary.recentActivityLabel,
  ]);

  const handleLoginKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        detail.logins.search();
      }
    },
    [detail.logins]
  );

  const handleApiKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        detail.apiLogs.search();
      }
    },
    [detail.apiLogs]
  );

  return {
    header: { subtitle: headerSubtitle },
    filters: detail.filters,
    filtersDisabled,
    summary: detail.summary,
    payments: detail.payments,
    logins: detail.logins,
    apiLogs: detail.apiLogs,
    formatDateTime: detail.formatDateTime,
    handleLoginKeyDown,
    handleApiKeyDown,
  };
}
