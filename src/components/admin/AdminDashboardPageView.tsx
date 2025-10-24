import styled from "styled-components";
import { AdminHero } from "@/components/admin/AdminHero";
import { AdminStatusBar } from "@/components/admin/AdminStatusBar";
import {
  AdminQuickActions,
  type AdminQuickAction,
} from "@/components/admin/AdminQuickActions";
import { AdminSummaryCards } from "@/components/admin/AdminSummaryCards";
import { AdminLoginTable } from "@/components/admin/AdminLoginTable";
import { AdminPaymentsPanel } from "@/components/admin/AdminPaymentsPanel";
import { AdminFeedbackPanel } from "@/components/admin/AdminFeedbackPanel";
import { AdminRangePicker } from "@/components/admin/AdminRangePicker";
import {
  Card,
  CardHeader,
  CardMeta,
  GridTwo,
  PageWrap,
  Toolbar,
  ToolbarGroup,
  ToolbarInfo,
} from "@/components/admin/AdminStyles";
import type {
  AdminLoginLog,
  AdminPaymentRow,
  AdminSummaryItem,
} from "@/features/admin/useAdminDashboard";
import type { AdminFeedbackRow } from "@/api/adminFeedback";

type HeroProps = {
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

type StatusBarProps = {
  isLoggedIn: boolean;
  username?: string;
  role?: string | null;
};

type RangeProps = {
  from: string;
  to: string;
  onChangeFrom: (value: string) => void;
  onChangeTo: (value: string) => void;
  loginsInRange: number | null;
};

type FeedbackProps = {
  rows: AdminFeedbackRow[];
  total: number | null;
  newCount: number | null;
  error: string | null;
};

type AdminDashboardPageViewProps = {
  hero: HeroProps;
  statusBar: StatusBarProps;
  summary: {
    items: AdminSummaryItem[];
    loading: boolean;
  };
  quickActions: AdminQuickAction[];
  feedback: FeedbackProps;
  payments: AdminPaymentRow[];
  loginLogs: AdminLoginLog[];
  range: RangeProps;
  loadError: string | null;
  onRetry: () => void;
  isRefreshing: boolean;
};

export function AdminDashboardPageView({
  hero,
  statusBar,
  summary,
  quickActions,
  feedback,
  payments,
  loginLogs,
  range,
  loadError,
  onRetry,
  isRefreshing,
}: AdminDashboardPageViewProps) {
  return (
    <PageWrap>
      <AdminHero {...hero} />
      <AdminStatusBar {...statusBar} />

      {loadError ? (
        <InlineAlert role="status">
          <span className="label">데이터 오류</span>
          <span className="message">{loadError}</span>
          <button type="button" onClick={onRetry} disabled={isRefreshing}>
            다시 시도
          </button>
        </InlineAlert>
      ) : null}

      <AdminSummaryCards items={summary.items} loading={summary.loading} />

      <AdminQuickActions actions={quickActions} />

      <GridTwo>
        <Card>
          <CardHeader>
            <div>
              <h3>기간별 통계 범위</h3>
              <CardMeta>
                선택한 기간에 따라 학원 목록 및 로그인 통계가 갱신됩니다.
              </CardMeta>
            </div>
          </CardHeader>
          <AdminRangePicker
            from={range.from}
            to={range.to}
            onChangeFrom={range.onChangeFrom}
            onChangeTo={range.onChangeTo}
            loginsInRange={range.loginsInRange}
          />
        </Card>

        <Card>
          <CardHeader>
            <div>
              <h3>최근 결제 기록</h3>
              <CardMeta>최신 결제 내역을 확인하세요.</CardMeta>
            </div>
            <ToolbarInfo>
              표시 건수: {payments.length.toLocaleString("ko-KR")}건
            </ToolbarInfo>
          </CardHeader>
          <AdminPaymentsPanel payments={payments} />
        </Card>
      </GridTwo>

      <Card>
        <CardHeader>
          <div>
            <h3>최근 문의/피드백</h3>
            <CardMeta>우선 처리할 문의를 빠르게 파악하세요.</CardMeta>
          </div>
        </CardHeader>
        <AdminFeedbackPanel
          rows={feedback.rows}
          total={feedback.total}
          newCount={feedback.newCount}
          error={feedback.error}
        />
      </Card>

      <Card>
        <Toolbar>
          <ToolbarGroup>
            <div>
              <h3 style={{ margin: 0 }}>최근 관리자 로그인</h3>
              <CardMeta>
                총 {loginLogs.length.toLocaleString("ko-KR")}건 표시 중
              </CardMeta>
            </div>
          </ToolbarGroup>
        </Toolbar>
        <AdminLoginTable logs={loginLogs} />
      </Card>
    </PageWrap>
  );
}

const InlineAlert = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid #fecaca;
  background: #fef2f2;
  color: #b91c1c;
  font-size: 13px;
  button {
    margin-left: auto;
    background: #ffffff;
    border: 1px solid #fca5a5;
    color: #b91c1c;
    border-radius: 999px;
    padding: 6px 14px;
    font-weight: 700;
    cursor: pointer;
  }
  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
