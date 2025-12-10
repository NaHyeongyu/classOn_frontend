import { useSearchParams, Link } from "react-router-dom";
import { useEffect } from "react";
import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import { formatMoney } from "@/lib/format";
import { confirmPublicPaymentCheckout } from "@/api/payments";
import { useToast } from "@/components/common/Toast";
import { routes } from "@/routes";

export default function PaymentTossSuccess() {
  const [sp] = useSearchParams();
  const { error: showError } = useToast();
  const token = sp.get("token") ?? "";
  const paymentKey = sp.get("paymentKey") ?? "";
  const orderId = sp.get("orderId") ?? "";
  const amountValue = Number(sp.get("amount") ?? "0");
  const ready = Boolean(token && paymentKey && orderId && amountValue > 0);

  const confirmQuery = useQuery({
    queryKey: ["toss-success", token, orderId, paymentKey, amountValue],
    enabled: ready,
    queryFn: () =>
      confirmPublicPaymentCheckout(token, {
        paymentKey,
        orderId,
        amount: amountValue,
      }),
  });

  useEffect(() => {
    if (confirmQuery.isError) {
      showError("결제 승인 정보를 확인하지 못했습니다. 담당자에게 문의해 주세요.");
    }
  }, [confirmQuery.isError, showError]);

  if (!ready) {
    return (
      <ResultShell>
        <Card>
          <h1>결제 정보를 찾을 수 없습니다.</h1>
          <p>돌아가서 다시 결제를 시도해 주세요.</p>
        </Card>
      </ResultShell>
    );
  }

  const data = confirmQuery.data;

  return (
    <ResultShell>
      <Card>
        <h1>결제가 완료되었습니다.</h1>
        {confirmQuery.isLoading ? (
          <p>결제 승인 정보를 확인하는 중입니다...</p>
        ) : data ? (
          <>
            <Summary>
              <Label>학원</Label>
              <Value>{data.academyName || "-"}</Value>
            </Summary>
            <Summary>
              <Label>수업 / 수강생</Label>
              <Value>
                {data.courseTitle || "수업"}
                {" · "}
                {data.studentName || "-"}
              </Value>
            </Summary>
            <Summary>
              <Label>결제 금액</Label>
              <Value>{formatMoney(data.amount ?? amountValue)}</Value>
            </Summary>
            <Summary>
              <Label>결제 수단</Label>
              <Value>{data.paymentMethod || "온라인"}</Value>
            </Summary>
            {data.approvalNumber ? (
              <Summary>
                <Label>승인 번호</Label>
                <Value>{data.approvalNumber}</Value>
              </Summary>
            ) : null}
            {data.receiptUrl ? (
              <ReceiptLink href={data.receiptUrl} target="_blank" rel="noreferrer">
                결제 영수증 확인
              </ReceiptLink>
            ) : null}
          </>
        ) : null}

        <Notice>
          <p>
            영수증 생성에는 최대 30초 정도 소요될 수 있습니다. 아래 버튼을 눌러 영수증을 열었다가 “새로고침”을
            누르면 최신 승인 정보를 확인할 수 있습니다.
          </p>
        </Notice>
        <Actions>
          {data?.receiptToken ? (
            <ReceiptButton to={`${routes.paymentsReceipt}?token=${encodeURIComponent(data.receiptToken)}`}>
              영수증 보기
            </ReceiptButton>
          ) : (
            <DisabledReceipt>영수증을 준비하는 중입니다. 잠시 후 다시 시도해 주세요.</DisabledReceipt>
          )}
        </Actions>
      </Card>
    </ResultShell>
  );
}

const ResultShell = styled.div`
  min-height: 100vh;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
`;

const Card = styled.div`
  width: min(420px, 100%);
  background: #fff;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  padding: 28px 24px;
  h1 {
    margin: 0 0 12px;
    font-size: 22px;
    color: #0f172a;
  }
  p {
    margin: 0 0 12px;
    color: #475569;
  }
`;

const Summary = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
  gap: 12px;
`;

const Label = styled.span`
  color: #64748b;
  font-size: 14px;
`;

const Value = styled.span`
  color: #111827;
  font-weight: 600;
  font-size: 15px;
  text-align: right;
`;

const ReceiptLink = styled.a`
  display: inline-block;
  margin-top: 12px;
  color: #2563eb;
  font-weight: 600;
  text-decoration: none;
`;

const Actions = styled.div`
  margin-top: 20px;
  display: grid;
  gap: 12px;
`;

const ReceiptButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  font-weight: 600;
  color: #2563eb;
  text-decoration: none;
  background: #fff;
`;

const DisabledReceipt = styled.div`
  padding: 14px;
  border-radius: 12px;
  border: 1px dashed #cbd5f5;
  text-align: center;
  color: #94a3b8;
  font-size: 14px;
`;

const Notice = styled.div`
  margin-top: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 12px;
  p {
    margin: 0;
    font-size: 13px;
    color: #475569;
    line-height: 1.5;
  }
`;
