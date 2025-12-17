import type { PaymentHistoryRow } from "@classon/shared-types";
import styled from "styled-components";
import { EmptyState, PrimaryButton, Skeleton, TableBase } from "@/components/common/UI";
import Pagination from "@/components/common/Pagination";
import { formatKoreanDate, formatMoney } from "@/lib/format";
import { formatPhoneKR, PAYMENT_STATUS_COLOR, PAYMENT_STATUS_LABEL } from "@/lib/paymentUiLabels";
import { buildCourseDisplay, getPaymentMethodDisplay } from "@/features/payments/utils/paymentsUtils";

type InvoicesTableProps = {
  rows: PaymentHistoryRow[];
  loading: boolean;
  page: number;
  size: number;
  totalPages: number;
  showPager: boolean;
  onChangePage: (page: number) => void;
  onRowClick: (row: PaymentHistoryRow) => void;
} & (
  | {
      selectable?: true;
      selected: number[];
      onToggleSelect: (id: number) => void;
    }
  | {
      selectable: false;
    }
);

export function InvoicesTable(props: InvoicesTableProps) {
  const { rows, loading, page, size, totalPages, showPager, onChangePage, onRowClick } = props;
  const selectable = props.selectable !== false;
  let selected: number[] = [];
  let onToggleSelect: ((id: number) => void) | undefined;
  if (props.selectable !== false) {
    selected = props.selected;
    onToggleSelect = props.onToggleSelect;
  }
  const colSpan = selectable ? 8 : 7;
  const renderDueDate = (value?: string | null) => {
    if (!value) return "-";
    const formatted = formatKoreanDate(value, { includeWeekday: false });
    return <span className="due-date-text">{formatted}</span>;
  };
  const resolveRecipientPhone = (row: PaymentHistoryRow) => {
    const raw =
      typeof row.recipientPhone === "string"
        ? row.recipientPhone
        : typeof row.student?.recipientPhone === "string"
          ? row.student.recipientPhone
          : typeof row.student?.guardianPhone === "string"
            ? row.student.guardianPhone
            : typeof row.student?.phoneNumber === "string"
              ? row.student.phoneNumber
              : "";
    return formatPhoneKR(raw) || "-";
  };
  return (
    <TableWrapper>
      <CenteredTable>
        <colgroup>
          <col style={{ width: "6%" }} />
          <col style={{ width: "16%" }} />
          <col style={{ width: "16%" }} />
          <col style={{ width: "22%" }} />
          <col style={{ width: "10%" }} />
          <col style={{ width: "14%" }} />
          <col style={{ width: selectable ? "12%" : "16%" }} />
          {selectable ? <col style={{ width: "4%" }} /> : null}
        </colgroup>
        <thead>
          <tr>
            <th className="number-cell">번호</th>
            <th>학생</th>
            <th>발송번호</th>
            <th>수강과목</th>
            <th>상태</th>
            <th>총 결제금액</th>
            <th>결제 예정일</th>
            {selectable ? <th /> : null}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={colSpan}>
                <Skeleton h={32} />
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={colSpan}>
                <EmptyState>발송 대기 중인 청구서가 없습니다.</EmptyState>
              </td>
            </tr>
          ) : (
            rows.map((row, index) => {
              const courseInfo = buildCourseDisplay(row);
	              return (
	                <tr key={row.id} onClick={() => onRowClick(row)}>
	                  <td className="number-cell">{page * size + index + 1}</td>
	                  <td>
	                    <strong>{row.student.name}</strong>
	                  </td>
	                  <td>
	                    <MetaText>{resolveRecipientPhone(row)}</MetaText>
	                  </td>
	                  <td>
	                    {courseInfo.title ? (
	                      <>
	                        <strong>{courseInfo.title}</strong>
	                      </>
                    ) : (
                      <MetaText>-</MetaText>
                    )}
                  </td>
                  <td>
                    <StatusBadge status={row.status}>
                      {PAYMENT_STATUS_LABEL[row.status] ?? row.status}
                    </StatusBadge>
                  </td>
                  <td>{formatMoney(row.finalAmount)}</td>
                  <td>{renderDueDate(row.dueDate)}</td>
                  {selectable ? (
                    <td onClick={(event) => event.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selected.includes(row.id)}
                        onChange={() => onToggleSelect?.(row.id)}
                      />
                    </td>
                  ) : null}
                </tr>
              );
            })
          )}
        </tbody>
      </CenteredTable>
      {showPager ? (
        <Pagination page={page} totalPages={totalPages} onChangePage={onChangePage} />
      ) : null}
    </TableWrapper>
  );
}

export function HistoryTable(props: {
  rows: PaymentHistoryRow[];
  loading: boolean;
  page: number;
  size: number;
  totalPages: number;
  onChangePage: (page: number) => void;
  onRowClick: (row: PaymentHistoryRow) => void;
  activeId: number | null;
  variant?: "pending" | "completed";
  onResendClick?: (row: PaymentHistoryRow) => void;
  emptyMessage?: string;
}) {
  const {
    rows,
    loading,
    page,
    totalPages,
    onChangePage,
    onRowClick,
    activeId,
    variant = "completed",
    onResendClick,
    emptyMessage,
  } = props;
  const isPendingVariant = variant === "pending";
  const colSpan = isPendingVariant ? 7 : 6;
  const resolveMethod = (row: PaymentHistoryRow): unknown =>
    (row as unknown as { paymentMethod?: unknown; method?: unknown }).paymentMethod ??
    (row as unknown as { method?: unknown }).method;
  const resolveRecipientPhone = (row: PaymentHistoryRow) => {
    const raw =
      typeof row.recipientPhone === "string"
        ? row.recipientPhone
        : typeof row.student?.recipientPhone === "string"
          ? row.student.recipientPhone
          : typeof row.student?.guardianPhone === "string"
            ? row.student.guardianPhone
            : typeof row.student?.phoneNumber === "string"
              ? row.student.phoneNumber
              : "";
    return formatPhoneKR(raw) || "-";
  };
  const renderDueDate = (value?: string | null) => {
    if (!value) return "-";
    return formatKoreanDate(value, { includeWeekday: false });
  };
  const resolvePendingSentDate = (row: PaymentHistoryRow) => {
    if (!row.invoiceRequestedAt) return "-";
    const prefix = row.status === "SCHEDULED" ? "예약" : "발송";
    return `${prefix} ${formatKoreanDate(row.invoiceRequestedAt, { includeWeekday: false })}`;
  };
  const parseTimestamp = (value?: string | null) => {
    if (!value) return Number.MAX_SAFE_INTEGER;
    const time = Date.parse(value);
    return Number.isNaN(time) ? Number.MAX_SAFE_INTEGER : time;
  };
  const getPendingSortTimestamp = (row: PaymentHistoryRow) => {
    const anyRow = row as PaymentHistoryRow & { createdAt?: string | null };
    const requested = parseTimestamp(row.invoiceRequestedAt);
    const due = parseTimestamp(row.dueDate);
    const created = parseTimestamp(anyRow.createdAt);
    return Math.min(requested, due, created);
  };
  const canResendAfter = (row: PaymentHistoryRow) => {
    if (!row.invoiceRequestedAt) return true;
    const sent = Date.parse(row.invoiceRequestedAt);
    if (Number.isNaN(sent)) return true;
    const threeDaysMs = 3 * 24 * 60 * 60 * 1000;
    return Date.now() - sent >= threeDaysMs;
  };
  const resendTooltip = (row: PaymentHistoryRow) => {
    if (!row.invoiceRequestedAt) return undefined;
    if (canResendAfter(row)) return "발송 후 3일이 지나 재발송할 수 있습니다.";
    const nextTs = Date.parse(row.invoiceRequestedAt) + 3 * 24 * 60 * 60 * 1000;
    if (Number.isNaN(nextTs)) return "발송 후 3일 뒤 재발송 가능합니다.";
    const nextDate = new Date(nextTs);
    const y = nextDate.getFullYear();
    const m = String(nextDate.getMonth() + 1).padStart(2, "0");
    const d = String(nextDate.getDate()).padStart(2, "0");
    return `발송 후 3일 뒤(${y}-${m}-${d})부터 재발송 가능합니다.`;
  };
  return (
	    <TableWrapper>
	      <CenteredTable>
	        <colgroup>
	          <col style={{ width: "20%" }} />
	          <col style={{ width: "18%" }} />
	          <col style={{ width: "10%" }} />
	          {isPendingVariant ? (
	            <>
	              <col style={{ width: "14%" }} />
	              <col style={{ width: "12%" }} />
	              <col style={{ width: "14%" }} />
	            </>
	          ) : (
	            <>
	              <col style={{ width: "18%" }} />
	              <col style={{ width: "18%" }} />
	            </>
	          )}
	          <col style={{ width: isPendingVariant ? "12%" : "16%" }} />
	        </colgroup>
	        <thead>
	          <tr>
	            <th>학생</th>
	            <th>발송번호</th>
	            <th>상태</th>
	            {isPendingVariant ? (
	              <>
	                <th>발송/예약</th>
                <th>기한</th>
                <th>청구 금액</th>
              </>
            ) : (
              <>
                <th>결제일</th>
                <th>결제 수단</th>
              </>
            )}
            <th>{isPendingVariant ? "재발송" : "금액"}</th>
          </tr>
        </thead>
	        <tbody>
	          {loading ? (
	            <tr>
	              <td colSpan={colSpan}>
	                <Skeleton h={32} />
	              </td>
	            </tr>
	          ) : rows.length === 0 ? (
	            <tr>
	              <td colSpan={colSpan}>
	                <EmptyState>{emptyMessage ?? "표시할 결제 내역이 없습니다."}</EmptyState>
	              </td>
	            </tr>
	          ) : (
            (isPendingVariant
              ? [...rows].sort((a, b) => {
                  const timeDiff = getPendingSortTimestamp(a) - getPendingSortTimestamp(b);
                  if (timeDiff !== 0) return timeDiff;
                  return (a.id ?? 0) - (b.id ?? 0);
                })
              : rows
            ).map((row) => {
              const resendEligibleStatus =
                row.status === "PENDING" || row.status === "UNPAID" || row.status === "FAILED";
              const canResend = resendEligibleStatus && canResendAfter(row);
              const displayStatus = row.status;
              return (
                <tr
                  key={row.id}
                  data-active={activeId === row.id}
                  onClick={() => onRowClick(row)}
                >
	                  <td>
	                    <strong>{row.student.name}</strong>
	                  </td>
	                  <td>
	                    <MetaText>{resolveRecipientPhone(row)}</MetaText>
	                  </td>
	                  <td>
	                    <StatusBadge status={displayStatus}>
	                      {PAYMENT_STATUS_LABEL[displayStatus] ?? displayStatus}
	                    </StatusBadge>
	                  </td>
                  {isPendingVariant ? (
                    <>
                      <td>{resolvePendingSentDate(row)}</td>
                      <td>{renderDueDate(row.dueDate)}</td>
                      <td>{formatMoney(row.finalAmount)}</td>
                      <td>
                        <ResendButton
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            onResendClick?.(row);
                          }}
                          disabled={!canResend}
                          title={resendTooltip(row)}
                        >
                          재발송
                        </ResendButton>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>
                        {row.completedAt
                          ? formatKoreanDate(row.completedAt, { includeWeekday: false })
                          : row.canceledAt
                            ? formatKoreanDate(row.canceledAt, { includeWeekday: false })
                            : row.dueDate
                              ? formatKoreanDate(row.dueDate, { includeWeekday: false })
                              : "-"}
                      </td>
                      <td>{getPaymentMethodDisplay(resolveMethod(row) as never, row.paymentType)}</td>
                      <td>{formatMoney(row.finalAmount)}</td>
                    </>
                  )}
                </tr>
              );
            })
          )}
        </tbody>
      </CenteredTable>
      <Pagination page={page} totalPages={totalPages} onChangePage={onChangePage} />
    </TableWrapper>
  );
}

const TableWrapper = styled.div`
  overflow-x: auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const StyledTable = styled(TableBase)`
  table-layout: fixed;
  width: 100%;

  th,
  td {
    vertical-align: middle;
    padding: 14px 20px;
    text-align: center;
  }

  thead th {
    font-weight: 700;
    color: ${(p) => p.theme.colors.textMuted};
    background: ${(p) => p.theme.colors.surfaceAlt ?? "#f9fafb"};
    font-size: 13px;
    text-align: center;
  }

  tbody tr {
    transition: background 0.15s ease;
  }

  tbody tr[data-active='true'] td {
    background: ${(p) => p.theme.colors.primarySurface};
  }

  tbody tr td {
    cursor: pointer;
  }

  tbody tr:hover td {
    background: ${(p) => p.theme.colors.surfaceAlt ?? "#f9fafb"};
  }

  tbody tr td:first-child input {
    cursor: pointer;
  }
`;

const CenteredTable = styled(StyledTable)``;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  background: ${({ status }) => (PAYMENT_STATUS_COLOR[status] ?? "#d1d5db")}1A;
  color: ${({ status }) => PAYMENT_STATUS_COLOR[status] ?? "#52525b"};
`;

const MetaText = styled.span`
  display: block;
  font-size: 12px;
  color: ${(p) => p.theme.colors.textMuted};
`;

const ResendButton = styled(PrimaryButton)`
  height: 30px;
  padding: 0 12px;
  font-size: 12px;
`;
