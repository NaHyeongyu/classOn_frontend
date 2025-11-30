import styled from "styled-components";
import { useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { formatKoreanDate, formatKoreanDateTimeKST, formatMoney } from "@/lib/format";
import { getPublicPaymentReceipt, type PublicPaymentReceipt } from "@/api/payments";
import type { PaymentCourseBrief } from "@classon/shared-types";

export default function PaymentReceipt() {
  const [sp] = useSearchParams();
  const token = sp.get("token") ?? "";

  const receiptQuery = useQuery({
    queryKey: ["public-receipt", token],
    enabled: Boolean(token),
    queryFn: () => getPublicPaymentReceipt(token),
  });

  if (!token) {
    return (
      <Shell>
        <Card>
          <h1>영수증 정보를 찾을 수 없습니다.</h1>
          <p>토큰이 없거나 만료되었습니다.</p>
        </Card>
      </Shell>
    );
  }

  const data = receiptQuery.data;

  return (
    <Shell>
      <Card>
        <Header>
          <div>
          <h1>결제 영수증</h1>
          <p>{data?.academyName ?? "클래스온"}</p>
        </div>
        {receiptQuery.isFetching ? <span className="badge">갱신 중...</span> : null}
      </Header>
        {receiptQuery.isLoading && <Placeholder>영수증 정보를 불러오는 중입니다...</Placeholder>}
        {receiptQuery.isError && !receiptQuery.isLoading ? (
          <Placeholder>영수증 정보를 확인할 수 없습니다. 담당자에게 문의해 주세요.</Placeholder>
        ) : null}
        {data ? <ReceiptLayout data={data} receiptToken={token} /> : null}
      </Card>
    </Shell>
  );
}

function ReceiptLayout({ data, receiptToken }: { data: PublicPaymentReceipt; receiptToken: string }) {
  const info = data.info;
  const student = data.student;
  const discountAmount = Math.max(0, (info.originalAmount ?? 0) - (info.finalAmount ?? 0));
  const discountDisplay = discountAmount ? formatMoney(discountAmount) : "—";
  const paymentMethod = getPaymentMethodDisplay(info.paymentMethod, info.paymentType);
  const completedText = info.completedAt
    ? formatKoreanDateTimeKST(info.completedAt, { includeWeekday: true, showSeconds: true })
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
          {data.courses && data.courses.length > 0 ? (
            data.courses.map((course: PaymentCourseBrief | null | undefined, index: number) => (
              <li key={`${course?.id ?? "course"}-${index}`}>
                <div className="info">
                  <strong>{course?.title ?? "-"}</strong>
                  {course?.code ? <span className="code">{course.code}</span> : null}
                </div>
                <span className="fee">{formatMoney(Number(course?.fee ?? 0))}</span>
              </li>
            ))
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
        <BackLink to={`/pay/${receiptToken}`}>청구서로 돌아가기</BackLink>
      </Column>
    </Layout>
  );
}

function getPaymentMethodDisplay(
  method?: PublicPaymentReceipt["info"]["paymentMethod"],
  type?: PublicPaymentReceipt["info"]["paymentType"],
): string {
  if (!method) return type === "ONLINE" ? "온라인 결제" : "결제 정보 없음";
  switch (method) {
    case "CARD":
      return "카드";
    case "BANK_TRANSFER":
      return "계좌이체";
    case "CASH":
      return "현금";
    default:
      return method;
  }
}

function formatCycleLabel(data: PublicPaymentReceipt): string {
  if (data.schedule?.cycleValue) {
    const unit = data.schedule.cycleUnit ?? "MONTHS";
    const unitLabel = unit === "MONTHS" ? "개월" : unit === "WEEKS" ? "주" : unit === "DAYS" ? "일" : "";
    return `${data.schedule.cycleValue}${unitLabel}`;
  }
  return (
    formatCycleLabelFromPeriod(data.info.periodStart, data.info.periodEnd) ??
    (data.info.dueDate ? `1회 (${formatKoreanDate(data.info.dueDate)})` : "—")
  );
}

function formatCycleLabelFromPeriod(
  start?: PublicPaymentReceipt["info"]["periodStart"],
  end?: PublicPaymentReceipt["info"]["periodEnd"],
): string | null {
  if (!start && !end) return null;
  if (start && end) {
    return `${formatKoreanDate(start, { includeWeekday: false })} ~ ${formatKoreanDate(end, { includeWeekday: false })}`;
  }
  if (start) return `${formatKoreanDate(start, { includeWeekday: false })}부터`;
  if (end) return `${formatKoreanDate(end, { includeWeekday: false })}까지`;
  return null;
}

function computeNextDueDateLabel(data: PublicPaymentReceipt): string {
  if (data.schedule?.nextDueDate) {
    return formatKoreanDate(data.schedule.nextDueDate, { includeWeekday: true });
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
  .badge {
    background: #eef2ff;
    color: #3730a3;
    padding: 8px 12px;
    border-radius: 999px;
    font-size: 13px;
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

const BackLink = styled(Link)`
  margin-top: 16px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #4f46e5;
  font-weight: 600;
  text-decoration: none;
`;
