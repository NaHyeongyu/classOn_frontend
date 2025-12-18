import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useSearchParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  formatKoreanDate,
  formatKoreanDateTimeKST,
  formatMoney,
} from "@/lib/format";
import {
  getPublicPaymentReceipt,
  refreshPublicPaymentReceipt,
  type PublicPaymentReceipt,
} from "@/api/payments";
import type { PaymentCourseBrief } from "@classon/shared-types";

type ApiError = Error & { status?: number; code?: string | number };
const AUTO_RETRY_MAX = 3;
const AUTO_RETRY_INTERVAL_MS = 60_000;

export default function PaymentReceipt() {
  const [sp, setSearchParams] = useSearchParams();
  const paramToken = sp.get("token") ?? "";
  const [activeToken, setActiveToken] = useState(paramToken);
  const [autoRefreshAttempted, setAutoRefreshAttempted] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState<string | null>(null);
  const [refreshSuccess, setRefreshSuccess] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const retryTimerRef = useRef<number | null>(null);
  const skipRefreshResetRef = useRef(false);
  const queryClient = useQueryClient();

  const receiptQuery = useQuery({
    queryKey: ["public-receipt", activeToken],
    enabled: Boolean(activeToken),
    queryFn: () => getPublicPaymentReceipt(activeToken),
    retry: false,
  });
  const { refetch } = receiptQuery;

  useEffect(() => {
    setActiveToken(paramToken);
    setAutoRefreshAttempted(false);
    setRefreshError(null);
    setRetryCount(0);
    if (!skipRefreshResetRef.current) {
      setRefreshSuccess(false);
    }
    skipRefreshResetRef.current = false;
  }, [paramToken]);

  useEffect(() => {
    if (!activeToken || activeToken === paramToken) return;
    skipRefreshResetRef.current = true;
    setSearchParams({ token: activeToken }, { replace: true });
  }, [activeToken, paramToken, setSearchParams]);

  useEffect(() => {
    return () => {
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
    };
  }, []);

  const receiptError = (receiptQuery.error as ApiError | null) ?? null;
  const receiptErrorCode = receiptError?.code
    ? String(receiptError.code)
    : undefined;
  const isExpired = receiptErrorCode === "PAYMENT_RECEIPT_EXPIRED";
  const isPendingCompletion =
    receiptErrorCode === "PAYMENT_RECEIPT_NOT_COMPLETED";

  const handleRefreshLink = useCallback(
    async (opts?: { silent?: boolean }) => {
      if (!activeToken) return;
      setRefreshing(true);
      setRefreshError(null);
      if (!opts?.silent) {
        setAutoRefreshAttempted(true);
      }
      try {
        const refreshed = await refreshPublicPaymentReceipt(activeToken);
        const nextToken = refreshed.receiptToken ?? activeToken;
        setRefreshSuccess(true);
        setAutoRefreshAttempted(true);
        setRetryCount(0);
        if (nextToken !== activeToken) {
          setActiveToken(nextToken);
        } else {
          queryClient.setQueryData(["public-receipt", nextToken], refreshed);
          void queryClient.invalidateQueries({
            queryKey: ["public-receipt", nextToken],
          });
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "새 링크를 요청하지 못했습니다.";
        setRefreshError(message);
      } finally {
        setRefreshing(false);
      }
    },
    [activeToken, queryClient]
  );

  useEffect(() => {
    if (!isExpired || !activeToken || autoRefreshAttempted || refreshing)
      return;
    setAutoRefreshAttempted(true);
    void handleRefreshLink({ silent: true });
  }, [
    isExpired,
    activeToken,
    autoRefreshAttempted,
    refreshing,
    handleRefreshLink,
  ]);

  useEffect(() => {
    if (!isPendingCompletion) {
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
      return;
    }
    if (retryCount >= AUTO_RETRY_MAX) return;
    retryTimerRef.current = window.setTimeout(() => {
      setRetryCount((count) => count + 1);
      void refetch();
    }, AUTO_RETRY_INTERVAL_MS);
    return () => {
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
    };
  }, [isPendingCompletion, retryCount, refetch]);

  useEffect(() => {
    if (!receiptQuery.isError) {
      setRetryCount(0);
      setRefreshError(null);
    }
  }, [receiptQuery.isError]);

  useEffect(() => {
    if (receiptQuery.isError) {
      setRefreshSuccess(false);
    }
  }, [receiptQuery.isError]);

  if (!paramToken) {
    return (
      <Shell>
        <Card>
          <h1>영수증 정보를 찾을 수 없습니다.</h1>
          <p>
            링크 정보가 확인되지 않습니다. 학원에 문의해 새 링크를 받아 주세요.
          </p>
        </Card>
      </Shell>
    );
  }

  const data = receiptQuery.data;
  const showRefreshedBadge =
    refreshSuccess && !receiptQuery.isError && Boolean(data);
  const isDetachedReceipt = receiptErrorCode === "PAYMENT_RECEIPT_NOT_FOUND";
  const isInvalidToken = receiptErrorCode === "PAYMENT_RECEIPT_INVALID_TOKEN";
  const shouldShowGeneralError =
    receiptQuery.isError &&
    !isExpired &&
    !isPendingCompletion &&
    !isDetachedReceipt;
  const generalError = shouldShowGeneralError ? receiptError?.message : null;
  const generalErrorMessage = generalError
    ? isInvalidToken
      ? `${generalError} 학원에 문의해 새 링크를 받아 주세요.`
      : generalError
    : null;
  const statusFlag = data?.info.status;
  const isReceiptCanceled = statusFlag === "CANCELED";
  const isReceiptFailed = statusFlag === "FAILED";

  return (
    <Shell>
      <Card>
        <Header>
          <div>
            <h1>결제 영수증</h1>
            <p>{data?.academyName ?? "클래스온"}</p>
          </div>
          <div className="badge-group">
            {showRefreshedBadge ? (
              <span className="badge success">새 링크로 갱신했습니다</span>
            ) : null}
            {receiptQuery.isFetching ? (
              <span className="badge">갱신 중...</span>
            ) : null}
          </div>
        </Header>
        {receiptQuery.isLoading && !receiptQuery.data ? (
          <Placeholder>영수증 정보를 불러오는 중입니다...</Placeholder>
        ) : null}
        {isExpired ? (
          <Notice>
            <NoticeTitle>
              링크가 만료되어 영수증을 확인할 수 없습니다.
            </NoticeTitle>
            <NoticeBody>
              학교에 재전송을 요청했습니다. 잠시 후 다시 시도해 주세요. 자동으로
              새 링크를 발급하거나, 아래 버튼으로 직접 요청할 수 있습니다.
            </NoticeBody>
            {refreshError ? <AlertText>{refreshError}</AlertText> : null}
            <ActionRow>
              <ActionButton
                type="button"
                onClick={() => handleRefreshLink()}
                disabled={refreshing}
              >
                {refreshing ? "새 링크 요청 중..." : "새 링크 요청하기"}
              </ActionButton>
            </ActionRow>
          </Notice>
        ) : null}
        {isPendingCompletion ? (
          <Notice>
            <NoticeTitle>결제가 아직 완료되지 않았습니다.</NoticeTitle>
            <NoticeBody>
              결제가 완료되면 학부모님께 새 링크가 자동 발송됩니다. 현재{" "}
              {retryCount}/{AUTO_RETRY_MAX}회 재시도했습니다. 최대 60초 간격으로
              다시 시도하며, 필요하면 아래 버튼으로 즉시 확인할 수 있습니다.
            </NoticeBody>
            <ActionRow>
              <ActionButton
                type="button"
                onClick={() => refetch()}
                disabled={receiptQuery.isFetching}
              >
                {receiptQuery.isFetching ? "다시 확인 중..." : "지금 다시 확인"}
              </ActionButton>
            </ActionRow>
            <SmallNote>
              “결제가 완료되면 학부모님께 새 링크가 자동 발송됩니다.”
            </SmallNote>
          </Notice>
        ) : null}
        {isDetachedReceipt ? (
          <Notice variant="warning">
            <NoticeTitle>영수증을 확인할 수 없습니다.</NoticeTitle>
            <NoticeBody>
              학원에서 해당 결제 내역을 삭제했거나 연결을 해제했습니다. 정확한
              내역을 확인하려면 학원에 직접 문의해 주세요.
            </NoticeBody>
          </Notice>
        ) : null}
        {generalErrorMessage ? (
          <Notice>
            <NoticeTitle>영수증을 불러오지 못했습니다.</NoticeTitle>
            <NoticeBody>{generalErrorMessage}</NoticeBody>
          </Notice>
        ) : null}
        {data && (isReceiptCanceled || isReceiptFailed) ? (
          <Notice variant="warning">
            <NoticeTitle>
              {isReceiptCanceled
                ? "결제가 취소된 내역입니다."
                : "결제가 실패한 내역입니다."}
            </NoticeTitle>
            <NoticeBody>
              해당 영수증은 참고용으로만 제공되며, 정확한 처리 과정은 학원에
              문의해 주세요. 추가 환불이나 정정이 필요한 경우 학원이 안내해
              드립니다.
            </NoticeBody>
          </Notice>
        ) : null}
        {data ? <ReceiptLayout data={data} /> : null}
      </Card>
    </Shell>
  );
}

function ReceiptLayout({ data }: { data: PublicPaymentReceipt }) {
  const info = data.info;
  const student = data.student;
  const discountAmount = Math.max(
    0,
    (info.originalAmount ?? 0) - (info.finalAmount ?? 0)
  );
  const discountDisplay = discountAmount ? formatMoney(discountAmount) : "—";
  const paymentMethod =
    (typeof data.methodDetail === "string" && data.methodDetail.trim()
      ? data.methodDetail.trim()
      : null) ||
    getPaymentMethodDisplay(
      (info.paymentMethod ??
        (info as unknown as { method?: unknown }).method) as never,
      info.paymentType
    );
  const completedText = info.completedAt
    ? formatKoreanDateTimeKST(info.completedAt, {
        includeWeekday: true,
        showSeconds: true,
      })
    : "-";
  const canceledText = info.canceledAt
    ? formatKoreanDateTimeKST(info.canceledAt, {
        includeWeekday: true,
        showSeconds: true,
      })
    : "-";
  const statusLabel =
    info.status === "COMPLETED"
      ? "결제 완료"
      : info.status === "FAILED"
      ? "결제 실패"
      : info.status === "CANCELED"
      ? "결제 취소"
      : "결제 대기";
  const nextDueText = computeNextDueDateLabel(data);
  const memo = info.memo?.trim() || info.managerMemo?.trim() || "";
  const courseList =
    Array.isArray(data.courses) && data.courses.length > 0
      ? data.courses
      : (() => {
          const fallback = data.course ?? info.course ?? null;
          return fallback ? [fallback] : [];
        })();

  return (
    <Layout>
      <Column>
        <SectionTitle>학생 정보</SectionTitle>
        <InfoList>
          <li>
            <span>이름</span>
            <strong>{student.name ?? "-"}</strong>
          </li>
          <li>
            <span>학생 코드</span>
            <strong>{student.code ?? "-"}</strong>
          </li>
          <li>
            <span>연락처</span>
            <strong>{student.phoneNumber ?? "-"}</strong>
          </li>
          <li>
            <span>보호자 연락처</span>
            <strong>{student.guardianPhone ?? "-"}</strong>
          </li>
        </InfoList>

        <SectionTitle>수강 과목</SectionTitle>
        <CourseList>
          {courseList.length > 0 ? (
            courseList.map(
              (course: PaymentCourseBrief | null | undefined, index: number) => (
                <li key={`${course?.id ?? "course"}-${index}`}>
                  <div className="info">
                    <strong>{course?.title ?? "-"}</strong>
                    {course?.code ? (
                      <span className="code">{course.code}</span>
                    ) : null}
                  </div>
                  <span className="fee">
                    {formatMoney(Number(course?.fee ?? 0))}
                  </span>
                </li>
              ),
            )
          ) : (
            <Empty>등록된 수강 과목이 없습니다.</Empty>
          )}
        </CourseList>
      </Column>

      <Column>
        <SectionTitle>결제 정보</SectionTitle>
        <DetailCard>
          <DetailRow>
            <span>수강 금액</span>
            <strong>{formatMoney(info.originalAmount ?? 0)}</strong>
          </DetailRow>
          <DetailRow>
            <span>할인</span>
            <strong>{discountDisplay}</strong>
          </DetailRow>
          <DetailRow>
            <span>최종 결제금액</span>
            <strong>{formatMoney(info.finalAmount ?? 0)}</strong>
          </DetailRow>
          <DetailRow>
            <span>결제 수단</span>
            <strong>{paymentMethod}</strong>
          </DetailRow>
          <DetailRow>
            <span>결제 주기</span>
            <strong>{formatCycleLabel(data)}</strong>
          </DetailRow>
          <DetailRow>
            <span>결제 시간</span>
            <strong>{completedText}</strong>
          </DetailRow>
          {info.status === "CANCELED" ? (
            <DetailRow>
              <span>취소 시간</span>
              <strong>{canceledText}</strong>
            </DetailRow>
          ) : null}
          <DetailRow>
            <span>승인 번호</span>
            <strong>{info.approvalNumber ?? "-"}</strong>
          </DetailRow>
          <DetailRow>
            <span>결제 상태</span>
            <strong>{statusLabel}</strong>
          </DetailRow>
          <DetailRow>
            <span>다음 결제일</span>
            <strong>{nextDueText}</strong>
          </DetailRow>
        </DetailCard>

        <SectionTitle>안내 메모</SectionTitle>
        <MemoBox>{memo || "메모가 없습니다."}</MemoBox>
      </Column>
    </Layout>
  );
}

function getPaymentMethodDisplay(
  method?: PublicPaymentReceipt["info"]["paymentMethod"],
  type?: PublicPaymentReceipt["info"]["paymentType"]
): string {
  const methodLabel = (() => {
    switch (method) {
      case "CARD":
        return "카드";
      case "BANK_TRANSFER":
        return "계좌이체";
      case "CASH":
        return "현금";
      case "VIRTUAL_ACCOUNT":
        return "가상계좌";
      case "MOBILE_PHONE":
        return "휴대폰 소액결제";
      default:
        return method ?? null;
    }
  })();
  const typeLabel =
    type === "ONLINE" ? "온라인 결제" : type === "OFFLINE" ? "현장 결제" : null;
  if (methodLabel && typeLabel) {
    return `${methodLabel} · ${typeLabel}`;
  }
  if (methodLabel) return methodLabel;
  if (typeLabel) return typeLabel;
  return "결제 정보 없음";
}

function formatCycleLabel(data: PublicPaymentReceipt): string {
  if (data.schedule?.cycleValue) {
    const unit = data.schedule.cycleUnit ?? "MONTHS";
    const unitLabel =
      unit === "MONTHS"
        ? "개월"
        : unit === "WEEKS"
        ? "주"
        : unit === "DAYS"
        ? "일"
        : "";
    return `${data.schedule.cycleValue}${unitLabel}`;
  }
  return (
    formatCycleLabelFromPeriod(data.info.periodStart, data.info.periodEnd) ??
    (data.info.dueDate ? `1회 (${formatKoreanDate(data.info.dueDate)})` : "—")
  );
}

function formatCycleLabelFromPeriod(
  start?: PublicPaymentReceipt["info"]["periodStart"],
  end?: PublicPaymentReceipt["info"]["periodEnd"]
): string | null {
  if (!start && !end) return null;
  if (start && end) {
    return `${formatKoreanDate(start, {
      includeWeekday: false,
    })} ~ ${formatKoreanDate(end, { includeWeekday: false })}`;
  }
  if (start) return `${formatKoreanDate(start, { includeWeekday: false })}부터`;
  if (end) return `${formatKoreanDate(end, { includeWeekday: false })}까지`;
  return null;
}

function computeNextDueDateLabel(data: PublicPaymentReceipt): string {
  if (data.schedule?.nextDueDate) {
    return formatKoreanDate(data.schedule.nextDueDate, {
      includeWeekday: true,
    });
  }
  if (data.info.dueDate) {
    return formatKoreanDate(data.info.dueDate, { includeWeekday: true });
  }
  return "-";
}

const Shell = styled.div`
  min-height: 100vh;
  background: #f5f7fb;
  padding: 32px 16px;
  display: flex;
  justify-content: center;
`;

const Card = styled.div`
  width: min(960px, 100%);
  background: #fff;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  padding: 28px;
  box-shadow: 0 10px 35px rgba(15, 23, 42, 0.08);
  h1 {
    margin: 0 0 8px;
    font-size: 24px;
    color: #0f172a;
  }
  p {
    margin: 0;
    color: #475569;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;
  .badge-group {
    display: flex;
    gap: 8px;
  }
  .badge {
    background: #eef2ff;
    color: #3730a3;
    padding: 8px 12px;
    border-radius: 999px;
    font-size: 13px;
    &.success {
      background: #ecfdf5;
      color: #047857;
    }
  }
`;

const Placeholder = styled.p`
  margin: 24px 0;
  color: #6b7280;
  font-size: 14px;
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-size: 16px;
  color: #0f172a;
`;

const InfoList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  li {
    display: flex;
    justify-content: space-between;
    padding: 12px 16px;
    border-bottom: 1px solid #e2e8f0;
    &:last-child {
      border-bottom: none;
    }
    span {
      color: #64748b;
      font-size: 14px;
    }
    strong {
      color: #0f172a;
      font-size: 15px;
    }
  }
`;

const CourseList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-bottom: 1px solid #e2e8f0;
    &:last-child {
      border-bottom: none;
    }
    .info {
      display: flex;
      flex-direction: column;
      gap: 2px;
      strong {
        color: #0f172a;
      }
      .code {
        font-size: 12px;
        color: #94a3b8;
      }
    }
    .fee {
      font-weight: 600;
      color: #111827;
    }
  }
`;

const Empty = styled.div`
  padding: 16px;
  text-align: center;
  color: #94a3b8;
`;

const DetailCard = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 16px;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #e5e7eb;
  &:last-child {
    border-bottom: none;
  }
  span {
    color: #6b7280;
  }
  strong {
    color: #0f172a;
    font-size: 15px;
  }
`;

const MemoBox = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 16px;
  min-height: 80px;
  color: #475569;
  background: #f8fafc;
`;

const Notice = styled.div<{ variant?: "default" | "warning" }>`
  border: 1px solid
    ${({ variant }) => (variant === "warning" ? "#fee2e2" : "#f1f5f9")};
  background: ${({ variant }) =>
    variant === "warning" ? "#fef2f2" : "#f8fafc"};
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
`;

const NoticeTitle = styled.h2`
  margin: 0 0 8px;
  font-size: 18px;
  color: #0f172a;
`;

const NoticeBody = styled.p`
  margin: 0;
  color: #475569;
  line-height: 1.5;
`;

const AlertText = styled.p`
  margin: 16px 0 0;
  color: #b91c1c;
  font-size: 14px;
`;

const ActionRow = styled.div`
  margin-top: 16px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  background: #4f46e5;
  color: #fff;
  border: none;
  border-radius: 999px;
  padding: 10px 20px;
  font-weight: 600;
  cursor: pointer;
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SmallNote = styled.p`
  margin: 12px 0 0;
  color: #94a3b8;
  font-size: 13px;
`;
