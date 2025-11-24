import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import styled from "styled-components";
import {
  Page,
  SectionCard,
  PageHeader,
  TitleH3,
  GhostButton,
  PrimaryButton,
  TableBase,
  EmptyState,
  Skeleton,
} from "@/components/common/UI";
import Modal from "@/components/common/Modal";
import { useToast } from "@/components/common/Toast";
import {
  getPaymentDetail,
  getPaymentSummary,
  listPaymentHistory,
  listPaymentInvoices,
  markOnsitePayment,
  updatePaymentInvoice,
  type PaymentInvoiceUpdatePayload,
  type PaymentOnsitePayload,
} from "@/api/payments";
import type {
  PaymentSummary,
  PaymentHistoryRow,
  PaymentDetail,
  PaymentMethod,
  PaymentType,
  PaymentCourseBrief,
} from "@classon/shared-types";
import type { PageResult } from "@/types/paging";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatMoney, formatKoreanDate, formatKoreanDateTimeKST } from "@/lib/format";
import { readableError } from "@/lib/errors";
import { useNavigate } from "react-router-dom";
import { routes, paths } from "@/routes";
import { invalidatePaymentsQueries } from "@/lib/paymentsCache";
import { usePaymentReminderSettings } from "@/features/calendar/usePaymentReminderSettings";
import { DiscountFields } from "@/components/payments/DiscountFields";

type DetailState =
  | {
      open: true;
      id: number;
      variant: "invoice" | "history";
      loading: boolean;
      data: PaymentDetail | null;
    }
  | { open: false };

const today = new Date();
const defaultMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;

const statusLabel: Record<string, string> = {
  UNPAID: "미납",
  PENDING: "대기",
  COMPLETED: "완료",
  FAILED: "실패",
};

const statusColor: Record<string, string> = {
  UNPAID: "#f97316",
  PENDING: "#2563EB",
  COMPLETED: "#059669",
  FAILED: "#dc2626",
};

const methodLabel: Record<string, string> = {
  CARD: "카드",
  BANK_TRANSFER: "계좌이체",
  CASH: "현금",
};

const paymentTypeLabel: Record<string, string> = {
  ONLINE: "온라인",
  OFFLINE: "오프라인",
};

export default function Payments() {
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [invoiceSearch, setInvoiceSearch] = useState("");
  const [invoiceSearchInput, setInvoiceSearchInput] = useState("");
  const [invoicePage, setInvoicePage] = useState(0);
  const invoicePageSize = 10;

  const [historyFilters, setHistoryFilters] = useState(() => {
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return {
      from: start.toISOString().slice(0, 10),
      to: end.toISOString().slice(0, 10),
      status: "CURRENT",
      q: "",
    };
  });
  const [historyPage, setHistoryPage] = useState(0);
  const historyPageSize = 15;

  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState<number[]>([]);
  const [detailState, setDetailState] = useState<DetailState>({ open: false });
  const [onsiteTarget, setOnsiteTarget] = useState<PaymentHistoryRow | null>(null);
  const [onsiteModalOpen, setOnsiteModalOpen] = useState(false);
  const [onsiteSelectorOpen, setOnsiteSelectorOpen] = useState(false);
  const [onsiteDetail, setOnsiteDetail] = useState<PaymentDetail | null>(null);
  const [onsiteDetailLoading, setOnsiteDetailLoading] = useState(false);
  const [activeHistoryId, setActiveHistoryId] = useState<number | null>(null);

  const summaryQuery = useQuery<PaymentSummary>({
    queryKey: ["payments", "summary", defaultMonth],
    queryFn: () => getPaymentSummary({ month: defaultMonth }),
    staleTime: 30_000,
  });

  const invoiceQuery = useQuery<PageResult<PaymentHistoryRow>>({
    queryKey: ["payments", "invoices", invoiceSearch, invoicePage, invoicePageSize],
    queryFn: () =>
      listPaymentInvoices({
        q: invoiceSearch,
        page: invoicePage,
        size: invoicePageSize,
        status: "UNPAID",
      }),
    placeholderData: (previousData: PageResult<PaymentHistoryRow> | undefined) => previousData,
  });

  const historyQuery = useQuery<PageResult<PaymentHistoryRow>>({
    queryKey: [
      "payments",
      "history",
      historyFilters.from,
      historyFilters.to,
      historyFilters.status,
      historyFilters.q,
      historyPage,
      historyPageSize,
    ],
    queryFn: () =>
      listPaymentHistory({
        from: historyFilters.from,
        to: historyFilters.to,
        status: historyFilters.status === "CURRENT" ? undefined : historyFilters.status,
        q: historyFilters.q,
        page: historyPage,
        size: historyPageSize,
      }),
    placeholderData: (previousData: PageResult<PaymentHistoryRow> | undefined) => previousData,
  });

  useEffect(() => {
    setInvoicePage(0);
  }, [invoiceSearch]);

  useEffect(() => {
    setInvoiceSearchInput(invoiceSearch);
  }, [invoiceSearch]);

  useEffect(() => {
    setHistoryPage(0);
  }, [historyFilters.from, historyFilters.to, historyFilters.status, historyFilters.q]);

  useEffect(() => {
    if (!historyQuery.data?.content?.length) {
      setActiveHistoryId(null);
      setOnsiteTarget(null);
      return;
    }
    if (activeHistoryId == null) return;
    const exists =
      historyQuery.data?.content?.some((row: PaymentHistoryRow) => row.id === activeHistoryId) ?? false;
    if (!exists) {
      setActiveHistoryId(null);
      setOnsiteTarget(null);
    }
  }, [historyQuery.data, activeHistoryId]);

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: PaymentInvoiceUpdatePayload }) =>
      updatePaymentInvoice(id, payload),
    onSuccess: (detail: PaymentDetail) => {
      success("청구서를 업데이트했습니다.");
      setDetailState((prev) =>
        prev.open && prev.id === detail.info.id ? { ...prev, data: detail, loading: false } : prev,
      );
      invalidatePaymentsQueries(queryClient);
    },
    onError: (err: unknown) => toastError(readableError(err, "청구서 수정에 실패했습니다.")),
  });

  const onsiteMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: PaymentOnsitePayload }) =>
      markOnsitePayment(id, payload),
    onSuccess: (detail: PaymentDetail) => {
      success("현장 결제가 기록되었습니다.");
      setOnsiteModalOpen(false);
      setOnsiteTarget(null);
      setOnsiteDetail(null);
      setDetailState((prev) =>
        prev.open && prev.id === detail.info.id ? { ...prev, data: detail, loading: false } : prev,
      );
      invalidatePaymentsQueries(queryClient);
    },
    onError: (err: unknown) => toastError(readableError(err, "현장 결제 처리에 실패했습니다.")),
  });

  const loadDetail = useCallback(async (id: number, variant: "invoice" | "history") => {
    setDetailState({ open: true, id, variant, loading: true, data: null });
    try {
      const detail = await getPaymentDetail(id);
      setDetailState({ open: true, id, variant, loading: false, data: detail });
    } catch (err) {
      setDetailState({ open: false });
      toastError(readableError(err, "결제 상세를 불러오지 못했습니다."));
    }
  }, [toastError]);

  const reminderSettings = usePaymentReminderSettings();
  const reminderDays = reminderSettings.configured
    ? reminderSettings.days ?? reminderSettings.defaultDays
    : null;

  const summary = summaryQuery.data;
  const invoices = invoiceQuery.data;
  const history = historyQuery.data;
  const invoiceRows = useMemo(
    () => filterInvoiceQueue(invoices?.content ?? [], reminderDays),
    [invoices?.content, reminderDays],
  );
  useEffect(() => {
    if (!invoices) return;
    const totalPages = invoices.totalPages ?? 0;
    if (totalPages === 0) {
      if (invoicePage !== 0) setInvoicePage(0);
      return;
    }
    if (invoicePage >= totalPages) {
      setInvoicePage(Math.max(0, totalPages - 1));
      return;
    }
    if (!invoiceQuery.isFetching && invoicePage > 0 && invoiceRows.length === 0) {
      setInvoicePage((prev) => Math.max(0, prev - 1));
    }
  }, [invoices, invoicePage, invoiceRows.length, invoiceQuery.isFetching]);
  const invoiceTotalPages = invoices?.totalPages ?? 0;
  const isLastPage = invoices?.last ?? true;
  // Show pager only if there's a next page (i.e., not on last page)
  const showInvoicePager = !isLastPage;

  useEffect(() => {
    const idsOnPage = new Set(invoiceRows.map((item) => item.id));
    setSelectedInvoiceIds((prev) => prev.filter((id) => idsOnPage.has(id)));
  }, [invoiceRows]);
  const onsiteCandidates = invoiceRows.filter((row) =>
    row.status === "UNPAID" || row.status === "PENDING",
  );
  const historyRows = history?.content ?? [];

  const summaryStats = useMemo(
    () => extractSummary(summary, invoiceRows.length),
    [summary, invoiceRows.length],
  );

  const handleSendSelected = () => {
    if (!selectedInvoiceIds.length) {
      toastError("카카오톡 알림을 보낼 청구서를 선택해 주세요.");
      return;
    }
    const idsParam = selectedInvoiceIds.join(",");
    navigate(paths.payments.kakaoConfirm(idsParam));
  };

  const handleInvoiceSelectAll = () => {
    const ids = invoiceRows.map((row) => row.id);
    const allSelected = ids.every((id) => selectedInvoiceIds.includes(id));
    if (allSelected) {
      setSelectedInvoiceIds((prev) => prev.filter((id) => !ids.includes(id)));
    } else {
      setSelectedInvoiceIds((prev) => Array.from(new Set([...prev, ...ids])));
    }
  };

  const handleInvoiceRowClick = (row: PaymentHistoryRow) => {
    loadDetail(row.id, "invoice");
  };

  const handleHistoryRowClick = (row: PaymentHistoryRow) => {
    setActiveHistoryId(row.id);
    loadDetail(row.id, "history");
  };

  const handleHistoryStatusChange = (value: string) => {
    setHistoryFilters((prev) => ({ ...prev, status: value }));
  };

  const handleHistoryDateChange = (key: "from" | "to", value: string) => {
    setHistoryFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleInvoiceSearchChange = (value: string) => {
    setInvoiceSearchInput(value);
  };

  const handleApplyInvoiceSearch = () => {
    setInvoiceSearch(invoiceSearchInput.trim());
  };

  const handleResetInvoiceSearch = () => {
    setInvoiceSearch("");
    setInvoiceSearchInput("");
  };

  const handleSaveInvoice = async (form: PaymentInvoiceUpdatePayload) => {
    if (!detailState.open) return;
    const payload: PaymentInvoiceUpdatePayload = {
      ...form,
      cycleUnit:
        form.cycleUnit ??
        (detailState.open && detailState.data?.schedule?.cycleUnit) ??
        "MONTHS",
    };
    updateMutation.mutate({ id: detailState.id, payload });
  };

  const handleOnsiteSubmit = async (payload: PaymentOnsitePayload) => {
    if (!onsiteTarget) return;
    onsiteMutation.mutate({ id: onsiteTarget.id, payload });
  };

  const openOnsiteModalForRow = useCallback(
    async (row: PaymentHistoryRow) => {
      setOnsiteTarget(row);
      setOnsiteModalOpen(true);
      if (onsiteDetail?.info.id === row.id) return;
      setOnsiteDetail(null);
      setOnsiteDetailLoading(true);
      try {
        const detail = await getPaymentDetail(row.id);
        setOnsiteDetail(detail);
      } catch (err) {
        toastError(readableError(err, "현장 결제 정보를 불러오지 못했습니다."));
        setOnsiteModalOpen(false);
      } finally {
        setOnsiteDetailLoading(false);
      }
    },
    [onsiteDetail?.info.id, toastError],
  );

  const handleOnsiteButtonClick = () => {
    setOnsiteTarget(null);
    setOnsiteDetail(null);
    setOnsiteSelectorOpen(true);
  };

  const handleSelectOnsiteCandidate = (row: PaymentHistoryRow) => {
    setOnsiteSelectorOpen(false);
    openOnsiteModalForRow(row);
  };

  return (
    <Page>
      <PageHeader>
        <div>
          <h2>결제 관리</h2>
          <p>학원의 결제 업무를 한눈에 관리하세요.</p>
        </div>
        <PrimaryButton type="button" onClick={() => navigate(routes.paymentsCreate)}>
          + 청구서 생성
        </PrimaryButton>
      </PageHeader>

      <StatsRow>
        {summaryStats.map((stat) => (
          <StatCard key={stat.label} data-tone={stat.tone}>
            <StatHead>
              <StatTitle>{stat.label}</StatTitle>
              <StatIcon data-tone={stat.tone} aria-hidden>
                {stat.icon}
              </StatIcon>
            </StatHead>
            <StatValue>{stat.value}</StatValue>
          </StatCard>
        ))}
      </StatsRow>

      <Panels>
        <SectionCard>
          <SectionHeader>
            <div>
              <TitleH3>청구서 발송</TitleH3>
              <SmallText>결제 예정일이 임박한 학생 순으로 정렬됩니다.</SmallText>
            </div>
            <InvoiceButtonRow>
              <GhostButton type="button" onClick={handleInvoiceSelectAll} disabled={!invoiceRows.length}>
                전체 선택
              </GhostButton>
              <PrimaryButton
                type="button"
                onClick={handleSendSelected}
                disabled={!selectedInvoiceIds.length}
              >
                청구서 발송
              </PrimaryButton>
            </InvoiceButtonRow>
          </SectionHeader>
          <SearchRow>
            <Input
              type="text"
              value={invoiceSearchInput}
              placeholder="학생명을 입력해 주세요."
              onChange={(event) => handleInvoiceSearchChange(event.target.value)}
            />
            <PrimaryButton type="button" onClick={handleApplyInvoiceSearch}>
              검색
            </PrimaryButton>
            <GhostButton type="button" onClick={handleResetInvoiceSearch}>
              초기화
            </GhostButton>
          </SearchRow>
          <InvoicesTable
            rows={invoiceRows}
            loading={invoiceQuery.isLoading}
            page={invoicePage}
            size={invoicePageSize}
            totalPages={invoiceTotalPages}
            showPager={showInvoicePager}
            onChangePage={setInvoicePage}
            selected={selectedInvoiceIds}
            onToggleSelect={(id) =>
              setSelectedInvoiceIds((prev) =>
                prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id],
              )
            }
            onRowClick={handleInvoiceRowClick}
          />
        </SectionCard>

        <SectionCard>
          <SectionHeader>
            <div>
              <TitleH3>결제 내역</TitleH3>
              <SmallText>발송 완료된 청구서부터 최근 결제 순으로 확인하세요.</SmallText>
            </div>
            <PrimaryButton type="button" onClick={handleOnsiteButtonClick}>
              현장 결제
            </PrimaryButton>
          </SectionHeader>
          <HistoryFilters>
            <PeriodFilter>
              <span>기간</span>
              <div>
                <Input
                  type="date"
                  value={historyFilters.from}
                  onChange={(event) => handleHistoryDateChange("from", event.target.value)}
                />
                <span>~</span>
                <Input
                  type="date"
                  value={historyFilters.to}
                  onChange={(event) => handleHistoryDateChange("to", event.target.value)}
                />
              </div>
            </PeriodFilter>
            <FilterField>
              <span>상태</span>
              <Select
                value={historyFilters.status}
                onChange={(event) => handleHistoryStatusChange(event.target.value)}
              >
                <option value="CURRENT">진행중(대기/완료)</option>
                <option value="ALL">전체</option>
                <option value="UNPAID">미납</option>
                <option value="PENDING">대기</option>
                <option value="COMPLETED">완료</option>
                <option value="FAILED">실패</option>
              </Select>
            </FilterField>
            <FilterField>
              <span>검색</span>
              <Input
                type="text"
                value={historyFilters.q}
                placeholder="이름 검색"
                onChange={(event) =>
                  setHistoryFilters((prev) => ({ ...prev, q: event.target.value }))
                }
              />
            </FilterField>
          </HistoryFilters>
          <HistoryTable
            rows={historyRows}
            loading={historyQuery.isLoading}
            page={historyPage}
            size={historyPageSize}
            totalPages={history?.totalPages ?? 0}
            onChangePage={setHistoryPage}
            onRowClick={handleHistoryRowClick}
            activeId={activeHistoryId}
          />
        </SectionCard>
      </Panels>

      <DetailModal
        state={detailState}
        onClose={() => setDetailState({ open: false })}
        onSave={handleSaveInvoice}
        saving={updateMutation.isPending}
      />

      <OnsiteCandidateModal
        open={onsiteSelectorOpen}
        onClose={() => setOnsiteSelectorOpen(false)}
        rows={onsiteCandidates}
        loading={invoiceQuery.isLoading || invoiceQuery.isFetching}
        onSelect={handleSelectOnsiteCandidate}
      />
      <OnsitePaymentModal
        open={onsiteModalOpen}
        onClose={() => {
          setOnsiteModalOpen(false);
          setOnsiteDetail(null);
          setOnsiteTarget(null);
        }}
        onSubmit={handleOnsiteSubmit}
        submitting={onsiteMutation.isPending}
        target={onsiteTarget}
        detail={onsiteDetail}
        detailLoading={onsiteDetailLoading}
      />
    </Page>
  );
}

function InvoicesTable(props: {
  rows: PaymentHistoryRow[];
  loading: boolean;
  page: number;
  size: number;
  totalPages: number;
  showPager: boolean;
  onChangePage: (page: number) => void;
  selected: number[];
  onToggleSelect: (id: number) => void;
  onRowClick: (row: PaymentHistoryRow) => void;
}) {
  const {
    rows,
    loading,
    page,
    size,
    totalPages,
    showPager,
    onChangePage,
    selected,
    onToggleSelect,
    onRowClick,
  } = props;
  const lastPage = Math.max(totalPages - 1, 0);
  const renderDueDate = (value?: string | null) => {
    if (!value) return "-";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "-";
    const year = parsed.getFullYear();
    const month = String(parsed.getMonth() + 1).padStart(2, "0");
    const day = String(parsed.getDate()).padStart(2, "0");
    return (
      <div className="due-date-cell">
        <span className="year">{year}</span>
        <span className="day">{`${month}.${day}`}</span>
      </div>
    );
  };
  return (
    <TableWrapper>
      <CenteredTable>
        <colgroup>
          <col style={{ width: "52px" }} />
          <col style={{ width: "80px" }} />
          <col style={{ width: "26%" }} />
          <col style={{ width: "16%" }} />
          <col style={{ width: "18%" }} />
          <col />
        </colgroup>
        <thead>
          <tr>
            <th />
            <th>번호</th>
            <th>학생</th>
            <th>상태</th>
            <th>총 결제금액</th>
            <th>결제 예정일</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={6}>
                <Skeleton h={32} />
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={6}>
                <EmptyState>발송 대기 중인 청구서가 없습니다.</EmptyState>
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <tr key={row.id} onClick={() => onRowClick(row)}>
                <td onClick={(event) => event.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selected.includes(row.id)}
                    onChange={() => onToggleSelect(row.id)}
                  />
                </td>
                <td>{page * size + index + 1}</td>
                <td>
                  <strong>{row.student.name}</strong>
                  <MetaText>{row.student.code}</MetaText>
                </td>
              <td>
                <StatusBadge status={row.status}>{statusLabel[row.status] ?? row.status}</StatusBadge>
              </td>
              <td>{formatMoney(row.finalAmount)}</td>
              <td>{renderDueDate(row.dueDate)}</td>
            </tr>
          ))
        )}
        </tbody>
      </CenteredTable>
      {showPager ? (
        <PagerBar>
          <GhostButton
            type="button"
            onClick={() => onChangePage(Math.max(0, page - 1))}
            disabled={page <= 0}
          >
            이전
          </GhostButton>
          <span>
            {page + 1} / {Math.max(1, totalPages)}
          </span>
          <GhostButton
            type="button"
            onClick={() => onChangePage(Math.min(lastPage, page + 1))}
            disabled={totalPages === 0 || page >= totalPages - 1}
          >
            다음
          </GhostButton>
        </PagerBar>
      ) : null}
    </TableWrapper>
  );
}

function HistoryTable(props: {
  rows: PaymentHistoryRow[];
  loading: boolean;
  page: number;
  size: number;
  totalPages: number;
  onChangePage: (page: number) => void;
  onRowClick: (row: PaymentHistoryRow) => void;
  activeId: number | null;
}) {
  const { rows, loading, page, totalPages, onChangePage, onRowClick, activeId } = props;
  const lastPage = Math.max(totalPages - 1, 0);
  return (
    <TableWrapper>
      <CenteredTable>
        <colgroup>
          <col style={{ width: "30%" }} />
          <col style={{ width: "20%" }} />
          <col style={{ width: "25%" }} />
          <col />
        </colgroup>
        <thead>
          <tr>
            <th>학생</th>
            <th>상태</th>
            <th>결제 완료일</th>
            <th>결제 수단</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={4}>
                <Skeleton h={32} />
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={4}>
                <EmptyState>표시할 결제 내역이 없습니다.</EmptyState>
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={row.id}
                data-active={activeId === row.id}
                onClick={() => onRowClick(row)}
              >
                <td>
                  <strong>{row.student.name}</strong>
                  <MetaText>{row.student.code}</MetaText>
                </td>
                <td>
                  <StatusBadge status={row.status}>{statusLabel[row.status] ?? row.status}</StatusBadge>
                </td>
                <td>
                  {row.completedAt
                    ? formatKoreanDate(row.completedAt, { includeWeekday: false })
                    : "-"}
                </td>
                <td>
                  {getPaymentMethodDisplay(row.paymentMethod, row.paymentType)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </CenteredTable>
      <PagerBar>
        <GhostButton
          type="button"
          onClick={() => onChangePage(Math.max(0, page - 1))}
          disabled={page <= 0}
        >
          이전
        </GhostButton>
        <span>
          {page + 1} / {Math.max(1, totalPages)}
        </span>
        <GhostButton
          type="button"
          onClick={() => onChangePage(Math.min(lastPage, page + 1))}
          disabled={totalPages === 0 || page >= totalPages - 1}
        >
          다음
        </GhostButton>
      </PagerBar>
    </TableWrapper>
  );
}

type DetailModalProps = {
  state: DetailState;
  onClose: () => void;
  onSave: (payload: PaymentInvoiceUpdatePayload) => void;
  saving: boolean;
};

function DetailModal({ state, onClose, onSave, saving }: DetailModalProps) {
  const isOpen = state.open;
  const detail = state.open ? state.data : null;
  const variant = state.open ? state.variant : "invoice";
  const [form, setForm] = useState<PaymentInvoiceUpdatePayload>({
    dueDate: "",
    amount: undefined,
    memo: "",
    discountType: undefined,
    discountValue: undefined,
    managerMemo: "",
    cycleValue: undefined,
    cycleUnit: undefined,
  });
  const [isEditing, setIsEditing] = useState(false);
  const saveInFlight = useRef(false);
  const [discountEnabled, setDiscountEnabled] = useState(false);

  useEffect(() => {
    if (!detail || variant !== "invoice") return;
    setForm({
      dueDate: detail.info.dueDate ?? "",
      amount: detail.info.originalAmount ?? undefined,
      memo: detail.info.memo ?? "",
      managerMemo: detail.info.managerMemo ?? "",
      discountType: detail.info.discountType ?? undefined,
      discountValue: detail.info.discountValue ?? undefined,
      cycleValue: detail.schedule?.cycleValue ?? undefined,
      cycleUnit: detail.schedule?.cycleUnit ?? "MONTHS",
    });
    setDiscountEnabled(Boolean(detail.info.discountType));
  }, [detail, variant]);

  useEffect(() => {
    setIsEditing(false);
  }, [detail?.info.id, variant]);

  useEffect(() => {
    if (!isEditing) {
      saveInFlight.current = false;
      return;
    }
    if (saving) {
      saveInFlight.current = true;
      return;
    }
    if (!saving && saveInFlight.current) {
      saveInFlight.current = false;
      setIsEditing(false);
    }
  }, [saving, isEditing]);

  if (!isOpen) return null;

  const isInvoiceVariant = variant === "invoice";
  const courseEntries: PaymentCourseBrief[] =
    detail?.courses && detail.courses.length
      ? detail.courses
      : [
          detail?.course ?? null,
          detail?.info.course ?? null,
        ].filter((item): item is PaymentCourseBrief => Boolean(item));
  const courseRows: PaymentCourseBrief[] = courseEntries.length
    ? courseEntries
    : [
        {
          id: 0,
          title: "수강 과목 정보가 없습니다.",
          code: "",
          fee: detail?.info.originalAmount ?? 0,
        },
      ];
  const modalClosable = !isInvoiceVariant || !isEditing;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!detail) return;
    onSave(form);
  };

  return (
    <Modal
      open={isOpen}
      onClose={modalClosable ? onClose : undefined}
      blockOutsideClose={isInvoiceVariant && isEditing}
      title={isInvoiceVariant ? "청구서 상세" : "결제 상세"}
      maxWidth={720}
    >
      {state.open && state.loading && (
        <Skeleton h={160} />
      )}
      {!state.loading && detail ? (
        <DetailLayout>
          <DetailColumn>
            <SectionTitle>학생 정보</SectionTitle>
            {isInvoiceVariant ? (
              <DetailList>
                <li>
                  <span>이름</span>
                  <strong>{detail.student.name}</strong>
                </li>
                <li>
                  <span>학생 코드</span>
                  <strong>{detail.student.code ?? "-"}</strong>
                </li>
                <li>
                  <span>연락처</span>
                  <strong>{detail.student.phoneNumber ?? "-"}</strong>
                </li>
                <li>
                  <span>보호자</span>
                  <strong>{detail.student.guardianPhone ?? "-"}</strong>
                </li>
              </DetailList>
            ) : (
              <InfoCard>
                <InfoRow>
                  <span>이름</span>
                  <strong>{detail.student.name}</strong>
                </InfoRow>
                <InfoRow>
                  <span>코드</span>
                  <strong>{detail.student.code ?? "-"}</strong>
                </InfoRow>
                <InfoRow>
                  <span>등록일</span>
                  <strong>
                    {detail.student.joinedDate
                      ? formatKoreanDate(detail.student.joinedDate, { includeWeekday: false })
                      : "-"}
                  </strong>
                </InfoRow>
                <InfoRow>
                  <span>연락처</span>
                  <strong>{detail.student.phoneNumber ?? "-"}</strong>
                </InfoRow>
                <InfoRow>
                  <span>학부모 연락처</span>
                  <strong>{detail.student.guardianPhone ?? "-"}</strong>
                </InfoRow>
              </InfoCard>
            )}
            <SectionTitle>수강 과목</SectionTitle>
            <CourseList>
            {courseRows.map((course: PaymentCourseBrief, index: number) => (
              <li key={`${course.id ?? "course"}-${index}`}>
                  <div className="info">
                    <strong>{course.title ?? "-"}</strong>
                    {course.code ? <span className="code">{course.code}</span> : null}
                  </div>
                  <span className="fee">{formatMoney(Number(course.fee ?? 0))}</span>
                </li>
              ))}
            </CourseList>
          </DetailColumn>
          <DetailColumn>
            {isInvoiceVariant ? (
              <form onSubmit={handleSubmit}>
                <SectionTitle>청구 정보</SectionTitle>
                <label>
                  결제 예정일
                  <Input
                    type="date"
                    value={form.dueDate ?? ""}
                    disabled={!isEditing}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, dueDate: event.target.value }))
                    }
                  />
                </label>
                <label>
                  청구 금액
                  <Input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={
                      isEditing
                        ? String(form.amount ?? detail.info.originalAmount ?? "")
                        : formatCurrencyInput(
                            typeof form.amount === "number" ? form.amount : detail.info.originalAmount,
                          )
                    }
                    disabled={!isEditing}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        amount: parseNumericInput(event.target.value),
                      }))
                    }
                  />
                </label>
                <label>
                  결제 주기
                  <Input
                    type={isEditing ? "number" : "text"}
                    min={1}
                    value={
                      isEditing
                        ? String(form.cycleValue ?? detail.schedule?.cycleValue ?? "")
                        : formatCycleLabelFromSchedule(detail)
                    }
                    disabled={!isEditing}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        cycleValue: event.target.value ? Number(event.target.value) : undefined,
                      }))
                    }
                  />
                </label>
                <DiscountBox>
                  <DiscountFields
                    enabled={discountEnabled}
                    discountType={form.discountType ?? undefined}
                    discountValue={form.discountValue}
                    onToggleEnabled={(next) => {
                      if (!isEditing) return;
                      setDiscountEnabled(next);
                      setForm((prev) => ({
                        ...prev,
                        discountType: next ? prev.discountType ?? "AMOUNT" : undefined,
                        discountValue: next ? prev.discountValue : undefined,
                      }));
                    }}
                    onChangeType={(next) => {
                      if (!isEditing) return;
                      setForm((prev) => ({ ...prev, discountType: next }));
                    }}
                    onChangeValue={(value) => {
                      if (!isEditing) return;
                      setForm((prev) => ({
                        ...prev,
                        discountValue: typeof value === "number" ? value : undefined,
                      }));
                    }}
                    onChangeStartDate={() => {}}
                    onChangeEndDate={() => {}}
                    showPeriod={false}
                    disabled={!isEditing}
                  />
                </DiscountBox>
                <label>
                  메모
                  <Textarea
                    value={resolveMemoValue(form.memo, form.managerMemo)}
                    disabled={!isEditing}
                    onChange={(event) => {
                      const nextValue = event.target.value;
                      setForm((prev) => ({ ...prev, memo: nextValue, managerMemo: nextValue }));
                    }}
                  />
                </label>
                <ModalActions>
                  {isEditing ? (
                    <>
                      <PrimaryButton type="submit" disabled={saving}>
                        {saving ? "저장 중..." : "저장"}
                      </PrimaryButton>
                      <GhostButton type="button" onClick={onClose} disabled={isEditing || saving}>
                        닫기
                      </GhostButton>
                    </>
                  ) : (
                    <>
                      <PrimaryButton
                        type="button"
                        onClick={(event) => {
                          event.preventDefault();
                          setIsEditing(true);
                        }}
                      >
                        수정
                      </PrimaryButton>
                      <GhostButton type="button" onClick={onClose} disabled={saving}>
                        닫기
                      </GhostButton>
                    </>
                  )}
                </ModalActions>
              </form>
            ) : (
              (() => {
                const discountAmount = Math.max(
                  0,
                  (detail.info.originalAmount ?? 0) - (detail.info.finalAmount ?? 0),
                );
                const discountDisplay = discountAmount ? formatMoney(discountAmount) : "—";
                const methodDisplay = getPaymentMethodDisplay(
                  detail.info.paymentMethod,
                  detail.info.paymentType,
                );
                const completedText = detail.info.completedAt
                  ? formatKoreanDateTimeKST(detail.info.completedAt, {
                      includeWeekday: true,
                      showSeconds: true,
                    })
                  : "-";
                const approvalNumber =
                  detail.info.approvalNumber && detail.info.approvalNumber.trim()
                    ? detail.info.approvalNumber
                    : "-";
                const statusText = statusLabel[detail.info.status] ?? detail.info.status;
                const nextDueText = computeNextDueDateLabel(detail);

                return (
                  <div>
                    <SectionTitle>상세 정보</SectionTitle>
                    <DetailInfoCard>
                      <DetailInfoRows>
                        <li>
                          <span>수강 금액</span>
                          <strong>{formatMoney(detail.info.originalAmount ?? 0)}</strong>
                        </li>
                        <li>
                          <span>할인</span>
                          <strong>{discountDisplay}</strong>
                        </li>
                        <li>
                          <span>최종 결제금액</span>
                          <strong>{formatMoney(detail.info.finalAmount ?? 0)}</strong>
                        </li>
                        <li>
                          <span>결제 수단</span>
                          <strong>{methodDisplay}</strong>
                        </li>
                        <li>
                          <span>결제 주기</span>
                          <strong>{getCycleLabel(detail, isInvoiceVariant ? "invoice" : "history")}</strong>
                        </li>
                        <li>
                          <span>결제 시간</span>
                          <strong>{completedText}</strong>
                        </li>
                        <li>
                          <span>승인 번호</span>
                          <strong>{approvalNumber}</strong>
                        </li>
                        <li>
                          <span>승인 상태</span>
                          <strong>{statusText}</strong>
                        </li>
                        <li>
                          <span>다음 결제일</span>
                          <strong>{nextDueText}</strong>
                        </li>
                      </DetailInfoRows>
                    </DetailInfoCard>
                    <SectionTitle>메모</SectionTitle>
                    <Paragraph>
                      {combineMemoValues(detail.info.memo, detail.info.managerMemo) || "메모가 없습니다."}
                    </Paragraph>
                    <ModalActions>
                      <PrimaryButton type="button" onClick={onClose}>
                        확인
                      </PrimaryButton>
                    </ModalActions>
                  </div>
                );
              })()
            )}
          </DetailColumn>
        </DetailLayout>
      ) : null}
    </Modal>
  );
}

function parseNumericInput(raw: string): number | undefined {
  const digits = raw.replace(/[^0-9]/g, "");
  if (!digits) return undefined;
  const parsed = Number(digits);
  return Number.isNaN(parsed) ? undefined : parsed;
}

function formatCurrencyInput(value?: number | null): string {
  if (value == null || Number.isNaN(value)) return "";
  return formatMoney(value);
}

function combineMemoValues(memo?: string | null, managerMemo?: string | null): string {
  const parts = [memo, managerMemo]
    .map((value) => (typeof value === "string" ? value.trim() : ""))
    .filter((value) => value.length);
  return parts.join("\n");
}

function resolveMemoValue(memo?: string | null, managerMemo?: string | null): string {
  const combined = combineMemoValues(memo, managerMemo);
  return combined || "";
}

function getCycleLabel(detail: PaymentDetail, variant: "invoice" | "history"): string {
  if (variant === "history") {
    return (
      formatCycleLabelFromPeriod(detail.info.periodStart, detail.info.periodEnd) ??
      formatCycleLabelFromSchedule(detail)
    );
  }
  return formatCycleLabelFromSchedule(detail);
}

function formatCycleLabelFromSchedule(detail: PaymentDetail): string {
  const value = detail.schedule?.cycleValue;
  const unit = detail.schedule?.cycleUnit ?? "MONTHS";
  if (!value) return "—";
  const unitLabel =
    unit === "MONTHS" ? "개월" : unit === "WEEKS" ? "주" : unit === "DAYS" ? "일" : "";
  return `${value}${unitLabel || ""}`;
}

function formatCycleLabelFromPeriod(
  periodStart?: string | null,
  periodEnd?: string | null,
): string | null {
  if (!periodStart || !periodEnd) return null;
  const start = new Date(`${periodStart}T00:00:00`);
  const end = new Date(`${periodEnd}T00:00:00`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
    return null;
  }
  const totalMonths =
    (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  const anchor = new Date(start);
  anchor.setMonth(anchor.getMonth() + totalMonths);
  let months = totalMonths;
  if (anchor > end) {
    months = Math.max(0, months - 1);
  }
  if (months >= 1) {
    return `${months}개월`;
  }
  const dayMs = 1000 * 60 * 60 * 24;
  const days = Math.max(1, Math.round((end.getTime() - start.getTime()) / dayMs));
  if (days % 7 === 0) {
    const weeks = days / 7;
    return `${weeks}주`;
  }
  return `${days}일`;
}

function toLocalDateInputValue(date: Date = new Date()): string {
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60000);
  return local.toISOString().slice(0, 10);
}

function getPaymentMethodDisplay(method?: PaymentMethod | null, type?: PaymentType | null): string {
  const methodText = method ? methodLabel[method] ?? method : null;
  const typeText = type ? paymentTypeLabel[type] ?? type : null;
  return [typeText, methodText].filter(Boolean).join(" / ") || "-";
}

function computeNextDueDateLabel(detail: PaymentDetail): string {
  const dueDate = detail.info.dueDate;
  const cycleValue = detail.schedule?.cycleValue;
  const cycleUnit = detail.schedule?.cycleUnit ?? "MONTHS";
  if (!dueDate || !cycleValue) return "-";
  const base = new Date(dueDate);
  if (Number.isNaN(base.getTime())) return "-";
  const next = new Date(base);
  if (cycleUnit === "MONTHS") {
    next.setMonth(next.getMonth() + cycleValue);
  } else if (cycleUnit === "WEEKS") {
    next.setDate(next.getDate() + cycleValue * 7);
  } else if (cycleUnit === "DAYS") {
    next.setDate(next.getDate() + cycleValue);
  } else {
    return "-";
  }
  return formatKoreanDate(next, { includeWeekday: false });
}

type OnsiteCandidateModalProps = {
  open: boolean;
  onClose: () => void;
  rows: PaymentHistoryRow[];
  loading: boolean;
  onSelect: (row: PaymentHistoryRow) => void;
};

function OnsiteCandidateModal({ open, onClose, rows, loading, onSelect }: OnsiteCandidateModalProps) {
  const pageSize = 10;
  const [page, setPage] = useState(0);
  useEffect(() => {
    if (open) {
      setPage(0);
    }
  }, [open, rows.length]);
  const totalPagesRaw = Math.ceil(rows.length / pageSize);
  const totalPages = totalPagesRaw > 0 ? totalPagesRaw : 1;
  const lastPage = Math.max(totalPages - 1, 0);
  const pagedRows = rows.slice(page * pageSize, page * pageSize + pageSize);
  return (
    <Modal open={open} onClose={onClose} title="현장 결제 대상 선택" maxWidth={760}>
      {loading ? (
        <Skeleton h={160} />
      ) : rows.length === 0 ? (
        <EmptyState>미납/대기 상태의 청구서가 없습니다.</EmptyState>
      ) : (
        <>
          <TableWrapper>
            <CandidateTable>
              <thead>
                <tr>
                  <th>학생</th>
                  <th>수강 과목</th>
                  <th>청구 금액</th>
                  <th>결제 예정일</th>
                  <th>상태</th>
                  <th>선택</th>
                </tr>
              </thead>
              <tbody>
                {pagedRows.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <strong>{row.student.name}</strong>
                      <span className="sub">{row.student.code ?? "-"}</span>
                    </td>
                    <td>{row.course?.title ?? "과목 정보 없음"}</td>
                    <td>{formatMoney(row.finalAmount ?? row.originalAmount ?? 0)}</td>
                    <td>
                      {row.dueDate
                        ? formatKoreanDate(row.dueDate, { includeWeekday: false })
                        : "-"}
                    </td>
                    <td>
                      <StatusBadge status={row.status}>
                        {statusLabel[row.status] ?? row.status}
                      </StatusBadge>
                    </td>
                    <td>
                      <SelectButton type="button" onClick={() => onSelect(row)}>
                        선택
                      </SelectButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </CandidateTable>
          </TableWrapper>
          <PagerBar>
            <GhostButton type="button" onClick={() => setPage((prev) => Math.max(0, prev - 1))} disabled={page <= 0}>
              이전
            </GhostButton>
            <span>
              {Math.min(page + 1, totalPages)} / {totalPages}
            </span>
            <GhostButton
              type="button"
              onClick={() => setPage((prev) => Math.min(lastPage, prev + 1))}
              disabled={page >= lastPage}
            >
              다음
            </GhostButton>
          </PagerBar>
        </>
      )}
    </Modal>
  );
}

type OnsiteModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: PaymentOnsitePayload) => void;
  submitting: boolean;
  target: PaymentHistoryRow | null;
  detail: PaymentDetail | null;
  detailLoading: boolean;
};

function OnsitePaymentModal({
  open,
  onClose,
  onSubmit,
  submitting,
  target,
  detail,
  detailLoading,
}: OnsiteModalProps) {
  const [tuitionAmount, setTuitionAmount] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [paymentDate, setPaymentDate] = useState(() => toLocalDateInputValue());
  const [method, setMethod] = useState<PaymentMethod>("CASH");
  const [memoValue, setMemoValue] = useState("");

  useEffect(() => {
    if (!open) return;
    const baseAmount =
      detail?.info.originalAmount ?? target?.originalAmount ?? target?.finalAmount ?? 0;
    const finalFromDetail = detail?.info.finalAmount ?? target?.finalAmount ?? baseAmount;
    const computedDiscount =
      typeof baseAmount === "number" && typeof finalFromDetail === "number"
        ? Math.max(0, baseAmount - finalFromDetail)
        : 0;
    setTuitionAmount(baseAmount);
    setDiscountAmount(computedDiscount);
    setPaymentDate(toLocalDateInputValue());
    setMethod("CASH");
    setMemoValue(detail?.info.memo ?? "");
  }, [
    open,
    detail?.info.id,
    detail?.info.originalAmount,
    detail?.info.finalAmount,
    detail?.info.memo,
    target?.id,
    target?.originalAmount,
    target?.finalAmount,
  ]);

  if (!open || !target) return null;

  const student = detail?.student ?? target.student;
  const courseItems: PaymentCourseBrief[] =
    detail?.courses && detail.courses.length
      ? detail.courses
      : detail?.course
        ? [detail.course]
        : target.course
          ? [target.course]
          : [];
  const dueDate = detail?.info.dueDate ?? target.dueDate ?? "";
  const finalAmount = Math.max(0, tuitionAmount - discountAmount);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({
      amount: finalAmount,
      method,
      paymentType: "OFFLINE",
      paidAt: paymentDate ? new Date(paymentDate).toISOString() : undefined,
      memo: memoValue,
    });
  };

  const formatNumber = (value?: number) => {
    if (value == null || Number.isNaN(value)) return "";
    return Number(value).toLocaleString("ko-KR");
  };

  const joinedDateText = student?.joinedDate
    ? formatKoreanDate(student.joinedDate, { includeWeekday: false })
    : "-";

  return (
    <Modal open={open} onClose={onClose} title="현장 결제" maxWidth={560}>
      {detailLoading ? (
        <Skeleton h={320} />
      ) : (
        <form onSubmit={handleSubmit}>
          <OnsiteSection>
            <SectionHeading>학생 정보</SectionHeading>
            <InfoCard>
              <InfoRow>
                <span>이름</span>
                <strong>{student?.name ?? "-"}</strong>
              </InfoRow>
              <InfoRow>
                <span>코드</span>
                <strong>{student?.code ?? "-"}</strong>
              </InfoRow>
              <InfoRow>
                <span>등록일</span>
                <strong>{joinedDateText}</strong>
              </InfoRow>
              <InfoRow>
                <span>연락처</span>
                <strong>{student?.phoneNumber ?? "-"}</strong>
              </InfoRow>
            </InfoCard>
          </OnsiteSection>

          <OnsiteSection>
            <SectionHeading>수강 과목</SectionHeading>
            {courseItems.length ? (
              <CourseCard>
                {courseItems.map((course: PaymentCourseBrief) => (
                  <li key={course?.id ?? course?.title ?? "course"}>
                    <div>
                      <strong>{course?.title ?? "과목 정보 없음"}</strong>
                      {course?.code ? <span className="code">{course.code}</span> : null}
                    </div>
                    <span className="fee">{formatMoney(Number(course?.fee ?? 0))}</span>
                  </li>
                ))}
              </CourseCard>
            ) : (
              <EmptyState>등록된 수강 과목이 없습니다.</EmptyState>
            )}
          </OnsiteSection>

          <OnsiteSection>
            <SectionHeading>상세 정보</SectionHeading>
            <AmountGrid>
              <label>
                수강 금액
                <AmountInputWrapper>
                  <AmountInput
                    type="text"
                    inputMode="numeric"
                    value={formatNumber(tuitionAmount)}
                    onChange={(event) =>
                      setTuitionAmount(parseNumericInput(event.target.value) ?? 0)
                    }
                  />
                  <AmountSuffix>원</AmountSuffix>
                </AmountInputWrapper>
              </label>
              <label>
                할인
                <AmountInputWrapper>
                  <AmountInput
                    type="text"
                    inputMode="numeric"
                    value={formatNumber(discountAmount)}
                    onChange={(event) =>
                      setDiscountAmount(parseNumericInput(event.target.value) ?? 0)
                    }
                  />
                  <AmountSuffix>원</AmountSuffix>
                </AmountInputWrapper>
              </label>
              <label>
                최종 결제 금액
                <AmountInputWrapper>
                  <AmountInput type="text" value={formatNumber(finalAmount)} readOnly />
                  <AmountSuffix>원</AmountSuffix>
                </AmountInputWrapper>
              </label>
            </AmountGrid>
            <label>
              결제일
              <Input
                type="date"
                value={paymentDate}
                onChange={(event) => setPaymentDate(event.target.value)}
              />
            </label>
            <label>
              결제 수단
              <MethodToggle>
                {[
                  { label: "카드", value: "CARD" },
                  { label: "현금", value: "CASH" },
                  { label: "계좌이체", value: "BANK_TRANSFER" },
                ].map((option) => (
                  <MethodButton
                    type="button"
                    key={option.value}
                    data-active={method === option.value}
                    onClick={() => setMethod(option.value as PaymentMethod)}
                  >
                    {option.label}
                  </MethodButton>
                ))}
              </MethodToggle>
            </label>
            <label>
              결제 예정일
              <Input type="date" value={dueDate ?? ""} disabled />
            </label>
          </OnsiteSection>

          <OnsiteSection>
            <SectionHeading>메모</SectionHeading>
            <Textarea value={memoValue} onChange={(event) => setMemoValue(event.target.value)} />
          </OnsiteSection>

          <ModalActions>
            <GhostButton type="button" onClick={onClose}>
              취소
            </GhostButton>
            <PrimaryButton type="submit" disabled={submitting}>
              {submitting ? "저장 중..." : "저장"}
            </PrimaryButton>
          </ModalActions>
        </form>
      )}
    </Modal>
  );
}

function filterInvoiceQueue(rows: PaymentHistoryRow[], reminderDays?: number | null): PaymentHistoryRow[] {
  const now = new Date();
  const threshold = new Date(now);
  const days = typeof reminderDays === "number" && reminderDays > 0 ? reminderDays : 5;
  threshold.setDate(threshold.getDate() + days);
  return rows.filter((row) => {
    if (!row.dueDate) return true;
    const due = new Date(row.dueDate);
    if (Number.isNaN(due.getTime())) return true;
    if (due <= threshold) return true;
    return false;
  });
}

type SummaryStat = {
  label: string;
  value: string;
  icon: ReactNode;
  tone: "primary" | "success" | "warning" | "danger" | "muted";
};

function extractSummary(summary?: PaymentSummary | null, unsentOverride?: number): SummaryStat[] {
  if (!summary) {
    return [
      { label: "이번달 총 결제액", value: "—", icon: paidIcon, tone: "muted" },
      { label: "이번달 총 미납액", value: "—", icon: unpaidIcon, tone: "muted" },
      { label: "이번달 미납 인원", value: "—", icon: peopleIcon, tone: "muted" },
      { label: "청구서 미발송 인원", value: "—", icon: paperIcon, tone: "muted" },
    ];
  }
  const unsent = typeof unsentOverride === "number" ? unsentOverride : summary.unsentCount;
  return [
    { label: "이번달 총 결제액", value: formatMoney(summary.paidAmount), icon: paidIcon, tone: "primary" },
    { label: "이번달 총 미납액", value: formatMoney(summary.unpaidAmount), icon: unpaidIcon, tone: "danger" },
    { label: "이번달 미납 인원", value: `${summary.unpaidCount}명`, icon: peopleIcon, tone: "warning" },
    { label: "청구서 미발송 인원", value: `${unsent}명`, icon: paperIcon, tone: "success" },
  ];
}

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
  margin-bottom: 16px;
`;

const StatCard = styled.article`
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.borderMuted ?? p.theme.colors.border};
  border-radius: 16px;
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: ${(p) => p.theme.shadow?.low ?? "0 4px 12px rgba(15, 23, 42, 0.06)"};
`;

const StatHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const StatTitle = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${(p) => p.theme.colors.textMuted};
`;

const StatValue = styled.span`
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: ${(p) => p.theme.colors.text};
`;

const StatIcon = styled.span<{ "data-tone": SummaryStat["tone"] }>`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  font-size: 18px;
  ${({ "data-tone": tone, theme }) => {
    const palette: Record<SummaryStat["tone"], { bg: string; fg: string }> = {
      primary: { bg: theme.colors.primarySurface ?? "#eef2ff", fg: theme.colors.primary },
      success: { bg: "#ecfdf5", fg: "#059669" },
      warning: { bg: "#fff7ed", fg: "#ea580c" },
      danger: { bg: "#fef2f2", fg: "#dc2626" },
      muted: { bg: theme.colors.surfaceAlt ?? "#f3f4f6", fg: theme.colors.textMuted },
    };
    const current = palette[tone] ?? palette.muted;
    return `
      background: ${current.bg};
      color: ${current.fg};
    `;
  }}
`;

const paidIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1v22" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const unpaidIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M6 21h12" />
    <path d="M12 7v6" />
    <path d="M9 10h6" />
  </svg>
);

const peopleIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const paperIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
    <path d="M16 13H8" />
    <path d="M16 17H8" />
    <path d="M10 9H8" />
  </svg>
);

const Panels = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
  gap: 24px;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

const SectionHeading = styled.h4`
  margin: 0;
  font-size: 15px;
  color: ${(p) => p.theme.colors.text};
`;

const SmallText = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${(p) => p.theme.colors.textMuted};
`;

const HistoryFilters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: flex-end;
  margin-bottom: 16px;
`;

const InvoiceButtonRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const SearchRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
  input {
    flex: 1;
    min-width: 220px;
  }
`;

const PeriodFilter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  span {
    font-size: 13px;
    color: ${(p) => p.theme.colors.text};
    font-weight: 600;
  }
  div {
    display: flex;
    align-items: center;
    gap: 8px;
    input {
      width: 140px;
    }
  }
`;

const FilterField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  span {
    font-size: 13px;
    color: ${(p) => p.theme.colors.text};
    font-weight: 600;
  }
  input,
  select {
    min-width: 160px;
  }
`;

const Input = styled.input`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 10px;
  padding: 8px 12px;
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;
`;

const Select = styled.select`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 10px;
  padding: 8px 12px;
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;
  background: #fff;
`;

const Textarea = styled.textarea`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 10px;
  padding: 8px 12px;
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;
  min-height: 96px;
`;

const CandidateTable = styled(TableBase)`
  thead th {
    text-align: center;
  }
  th,
  td {
    text-align: center;
  }
  td {
    vertical-align: middle;
  }
  td .sub {
    display: block;
    margin-top: 4px;
    font-size: 12px;
    color: ${(p) => p.theme.colors.textMuted};
  }
`;

const TableWrapper = styled.div`
  overflow-x: auto;
`;

const SelectButton = styled(PrimaryButton)`
  height: 32px;
  padding: 0 12px;
  font-size: 13px;
`;

const OnsiteSection = styled.div`
  display: grid;
  gap: 12px;
  margin-bottom: 20px;
`;

const InfoCard = styled.div`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.md};
  padding: 16px;
  display: grid;
  gap: 10px;
  background: ${(p) => p.theme.colors.surfaceAlt};
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  span {
    color: ${(p) => p.theme.colors.textMuted};
  }
  strong {
    color: ${(p) => p.theme.colors.text};
  }
`;

const CourseCard = styled.ul`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.md};
  padding: 0;
  margin: 0;
  list-style: none;
  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid ${(p) => p.theme.colors.borderMuted};
  }
  li:last-child {
    border-bottom: none;
  }
  .code {
    font-size: 12px;
    color: ${(p) => p.theme.colors.textMuted};
    margin-left: 6px;
  }
  .fee {
    font-weight: 600;
    color: ${(p) => p.theme.colors.text};
  }
`;

const DetailInfoCard = styled.div`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.md};
  padding: 16px;
  display: grid;
  gap: 12px;
  background: ${(p) => p.theme.colors.surfaceAlt};
`;

const DetailInfoRows = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 10px;
  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
  }
  span {
    color: ${(p) => p.theme.colors.textMuted};
  }
  strong {
    color: ${(p) => p.theme.colors.text};
  }
`;

const AmountGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px 16px;
`;

const AmountInputWrapper = styled.div`
  position: relative;
`;

const AmountInput = styled.input`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 10px;
  padding: 8px 40px 8px 12px;
  width: 100%;
  font-size: 14px;
  box-sizing: border-box;
`;

const AmountSuffix = styled.span`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 13px;
  color: ${(p) => p.theme.colors.textMuted};
`;

const MethodToggle = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const MethodButton = styled.button`
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.surface};
  color: ${(p) => p.theme.colors.text};
  border-radius: 999px;
  padding: 8px 16px;
  font-size: 13px;
  cursor: pointer;
  &[data-active='true'] {
    border-color: ${(p) => p.theme.colors.primary};
    background: ${(p) => p.theme.colors.primarySurface};
    color: ${(p) => p.theme.colors.primary};
    font-weight: 600;
  }
`;

const StyledTable = styled(TableBase)`
  tbody tr[data-active='true'] td {
    background: ${(p) => p.theme.colors.primarySurface};
  }

  tbody tr td {
    cursor: pointer;
  }

  tbody tr td:first-child input {
    cursor: pointer;
  }
  .due-date-cell {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    line-height: 1.2;
  }
  .due-date-cell .year {
    font-size: 13px;
    color: ${(p) => p.theme.colors.textMuted};
  }
  .due-date-cell .day {
    font-weight: 600;
    font-size: 15px;
    color: ${(p) => p.theme.colors.text};
  }
`;

const CenteredTable = styled(StyledTable)`
  thead th {
    text-align: center;
  }
  th,
  td {
    text-align: center;
  }
`;

const PagerBar = styled.div`
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  span {
    font-size: 13px;
    color: ${(p) => p.theme.colors.textMuted};
  }
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  background: ${({ status }) => (statusColor[status] ?? "#d1d5db")}1A;
  color: ${({ status }) => statusColor[status] ?? "#52525b"};
`;

const MetaText = styled.span`
  display: block;
  font-size: 12px;
  color: ${(p) => p.theme.colors.textMuted};
`;

const DetailLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  max-height: 70vh;
  overflow: auto;
  align-items: flex-start;
  align-content: flex-start;
`;

const DetailColumn = styled.div`
  display: grid;
  gap: 16px;
  align-items: flex-start;
  align-content: flex-start;
`;

const SectionTitle = styled.h4`
  margin: 0;
  font-size: 15px;
  color: ${(p) => p.theme.colors.text};
`;

const DetailList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.md};
  li {
    display: flex;
    justify-content: space-between;
    padding: 10px 12px;
    border-bottom: 1px solid ${(p) => p.theme.colors.borderMuted};
    span {
      font-size: 13px;
      color: ${(p) => p.theme.colors.textMuted};
    }
    strong {
      font-size: 14px;
      color: ${(p) => p.theme.colors.text};
    }
  }
  li:last-child {
    border-bottom: none;
  }
`;

const ModalActions = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const Paragraph = styled.p`
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.md};
  padding: 12px;
  min-height: 80px;
  white-space: pre-wrap;
`;

const DiscountBox = styled.div`
  margin: 12px 0;
  padding: 12px;
  border: 1px solid ${(p) => p.theme.colors.borderMuted ?? p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.md};
  background: ${(p) => p.theme.colors.surfaceAlt ?? "#f9fafb"};
`;

const CourseList = styled(DetailList)`
  li {
    align-items: center;
  }
  .info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .info .code {
    font-size: 12px;
    color: ${(p) => p.theme.colors.textMuted};
  }
  .fee {
    font-weight: 600;
    font-size: 14px;
    color: ${(p) => p.theme.colors.text};
  }
`;
