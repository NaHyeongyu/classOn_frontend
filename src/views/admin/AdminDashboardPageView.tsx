import styled from "styled-components";
import { AdminHero } from "@/components/admin/AdminHero";
import { AdminStatusBar } from "@/components/admin/AdminStatusBar";
import { AdminQuickActions } from "@/components/admin/AdminQuickActions";
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
import type { AdminDashboardPageData } from "@/features/admin/useAdminDashboardPage";

type AdminDashboardPageViewProps = AdminDashboardPageData;

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
