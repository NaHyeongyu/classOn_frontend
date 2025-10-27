import styled from "styled-components";
import {
  Card,
  CardHeader,
  CardMeta,
  ErrorBanner,
  FieldLabel,
  GridTwo,
  MonoGhost,
  MonoPrimary,
  Muted,
  PageHeader,
  PageSubtitle,
  PageTitle,
  PageWrap,
  Select,
  SkeletonLine,
  StatsList,
  Table,
  TableStatus,
  TableWrap,
  ToolbarGroup,
  ToolbarInfo,
} from "@/components/admin/AdminStyles";
import { SparklineChart, ColumnChart } from "@/components/stats/Charts";
import type { TrendDataset } from "@/lib/trend";
import type { AdminAcademyRow } from "@/api/adminAcademies";

type OverviewStat = {
  label: string;
  value: string | number;
};

type AdminStatsPageViewProps = {
  overviewStats: OverviewStat[];
  loading: boolean;
  error: string | null;
  rangeDays: number;
  onChangeRange: (value: number) => void;
  rangeOptions: readonly number[];
  lastUpdatedLabel: string;
  fromDateStr: string;
  toDateStr: string;
  onRefresh: () => void;
  dashboardHref: string;
  paymentTrend: TrendDataset;
  loginTrend: TrendDataset;
  topPaymentAcademies: AdminAcademyRow[];
  topUsageAcademies: Array<AdminAcademyRow & { usageScore?: number }>;
};

export function AdminStatsPageView({
  overviewStats,
  loading,
  error,
  rangeDays,
  onChangeRange,
  rangeOptions,
  lastUpdatedLabel,
  fromDateStr,
  toDateStr,
  onRefresh,
  dashboardHref,
  paymentTrend,
  loginTrend,
  topPaymentAcademies,
  topUsageAcademies,
}: AdminStatsPageViewProps) {
  return (
    <PageWrap>
      <PageHeader>
        <div>
          <PageTitle>관리자 통계</PageTitle>
          <PageSubtitle>
            {fromDateStr} ~ {toDateStr} · 마지막 업데이트 {lastUpdatedLabel}
          </PageSubtitle>
        </div>
        <ToolbarGroup>
          <FieldLabel htmlFor="admin-stats-range">기간</FieldLabel>
          <Select
            id="admin-stats-range"
            value={rangeDays}
            onChange={(event) => onChangeRange(Number(event.target.value))}
            disabled={loading}
          >
            {rangeOptions.map((option) => (
              <option key={option} value={option}>
                최근 {option}일
              </option>
            ))}
          </Select>
          <MonoGhost as="a" href={dashboardHref}>
            대시보드로 이동
          </MonoGhost>
          <MonoPrimary type="button" onClick={onRefresh} disabled={loading}>
            {loading ? "새로고침 중…" : "데이터 새로고침"}
          </MonoPrimary>
        </ToolbarGroup>
      </PageHeader>

      {error ? <ErrorBanner role="status">⚠️ {error}</ErrorBanner> : null}

      <Card>
        <CardHeader>
          <div>
            <h3>핵심 지표</h3>
            <CardMeta>오늘 기준 상태</CardMeta>
          </div>
        </CardHeader>
        {overviewStats.length > 0 ? (
          <StatsList>
            {overviewStats.map((item) => (
              <li key={item.label}>
                <span className="label">{item.label}</span>
                <span className="value">{item.value}</span>
              </li>
            ))}
          </StatsList>
        ) : (
          <SkeletonStack>
            {Array.from({ length: 5 }).map((_, index) => (
              <SkeletonLine key={index} />
            ))}
          </SkeletonStack>
        )}
      </Card>

      <GridTwo>
        <Card>
          <CardHeader>
            <div>
              <h3>결제 추이</h3>
              <CardMeta>
                {rangeDays}일 합계 ₩{paymentTrend.total.toLocaleString("ko-KR")}
              </CardMeta>
            </div>
            <ToolbarInfo>
              최대 일 매출 ₩{paymentTrend.max.toLocaleString("ko-KR")}
            </ToolbarInfo>
          </CardHeader>
          <SparklineChart
            points={paymentTrend.series}
            color="#0ea5e9"
            loading={loading}
            unitLabel="₩"
          />
          <TrendFooter>
            {paymentTrend.series.slice(-5).map((point) => (
              <TrendItem key={point.key}>
                <span className="label">{point.label}</span>
                <span className="value">
                  ₩{point.value.toLocaleString("ko-KR")}
                </span>
              </TrendItem>
            ))}
          </TrendFooter>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <h3>로그인 추이</h3>
              <CardMeta>
                {rangeDays}일 총 {loginTrend.total.toLocaleString("ko-KR")}회
              </CardMeta>
            </div>
            <ToolbarInfo>
              최대 일 로그인 {loginTrend.max.toLocaleString("ko-KR")}회
            </ToolbarInfo>
          </CardHeader>
          <ColumnChart
            points={loginTrend.series}
            color="#6366f1"
            loading={loading}
          />
          <TrendFooter>
            {loginTrend.series.slice(-5).map((point) => (
              <TrendItem key={point.key}>
                <span className="label">{point.label}</span>
                <span className="value">
                  {point.value.toLocaleString("ko-KR")}회
                </span>
              </TrendItem>
            ))}
          </TrendFooter>
        </Card>
      </GridTwo>

      <GridTwo>
        <Card>
          <CardHeader>
            <div>
              <h3>상위 학원 (결제)</h3>
              <CardMeta>
                {fromDateStr} ~ {toDateStr}
              </CardMeta>
            </div>
          </CardHeader>
          <TableWrap>
            <Table>
              <thead>
                <tr>
                  <th>학원</th>
                  <th>결제건수</th>
                  <th>결제합계(원)</th>
                </tr>
              </thead>
              <tbody>
                {topPaymentAcademies.length === 0 ? (
                  <tr>
                    <td colSpan={3}>
                      <TableStatus>표시할 데이터가 없습니다.</TableStatus>
                    </td>
                  </tr>
                ) : (
                  topPaymentAcademies.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <div className="academy">
                          <span className="name">{row.name}</span>
                          <Muted>#{row.id}</Muted>
                        </div>
                      </td>
                      <td>{row.paymentCount?.toLocaleString("ko-KR") ?? "0"}</td>
                      <td>
                        ₩{Math.round((row.paymentAmountCents || 0) / 100).toLocaleString("ko-KR")}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </TableWrap>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <h3>상위 학원 (활동량)</h3>
              <CardMeta>API + 로그인 횟수</CardMeta>
            </div>
          </CardHeader>
          <TableWrap>
            <Table>
              <thead>
                <tr>
                  <th>학원</th>
                  <th>API</th>
                  <th>로그인</th>
                  <th>총합</th>
                </tr>
              </thead>
              <tbody>
                {topUsageAcademies.length === 0 ? (
                  <tr>
                    <td colSpan={4}>
                      <TableStatus>표시할 데이터가 없습니다.</TableStatus>
                    </td>
                  </tr>
                ) : (
                  topUsageAcademies.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <div className="academy">
                          <span className="name">{row.name}</span>
                          <Muted>#{row.id}</Muted>
                        </div>
                      </td>
                      <td>{row.apiCalls?.toLocaleString("ko-KR") ?? "0"}</td>
                      <td>{row.logins?.toLocaleString("ko-KR") ?? "0"}</td>
                      <td>{row.usageScore?.toLocaleString("ko-KR") ?? "0"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </TableWrap>
        </Card>
      </GridTwo>
    </PageWrap>
  );
}

const SkeletonStack = styled.div`
  display: grid;
  gap: 8px;
`;

const TrendFooter = styled.div`
  display: grid;
  gap: 6px;
`;

const TrendItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  .label {
    color: #94a3b8;
    font-weight: 700;
  }
  .value {
    color: #0f172a;
    font-weight: 800;
  }
`;
