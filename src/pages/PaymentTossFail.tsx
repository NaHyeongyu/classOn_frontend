import { Link, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { PrimaryButton } from "@/components/common/UI";

export default function PaymentTossFail() {
  const [sp] = useSearchParams();
  const token = sp.get("token") ?? "";
  const code = sp.get("code") ?? "";
  const message = sp.get("message") ?? "결제를 완료하지 못했습니다.";

  return (
    <ResultShell>
      <Card>
        <h1>결제에 실패했습니다.</h1>
        <p>{message}</p>
        {code ? (
          <ErrorBadge>코드: {code}</ErrorBadge>
        ) : null}
        <Actions>
          <PrimaryButton as={Link} to={token ? `/pay/${token}` : "/"}>
            청구서로 돌아가기
          </PrimaryButton>
        </Actions>
      </Card>
    </ResultShell>
  );
}

const ResultShell = styled.div`
  min-height: 100vh;
  background: #fff7ed;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
`;

const Card = styled.div`
  width: min(420px, 100%);
  background: #fff;
  border-radius: 16px;
  border: 1px solid #fed7aa;
  padding: 28px 24px;
  h1 {
    margin: 0 0 12px;
    font-size: 22px;
    color: #b45309;
  }
  p {
    margin: 0 0 12px;
    color: #92400e;
  }
`;

const ErrorBadge = styled.div`
  display: inline-block;
  padding: 6px 10px;
  background: #fff7ed;
  border-radius: 999px;
  color: #c2410c;
  font-size: 13px;
  font-weight: 600;
`;

const Actions = styled.div`
  margin-top: 20px;
`;
