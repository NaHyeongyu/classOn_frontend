import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { SectionCard as Section, TitleH3 as Title, GhostBtn as UIGhostBtn } from "../components/common/UI";

export default function PaymentSuccess() {
  const { search } = useLocation();
  const q = useMemo(() => new URLSearchParams(search), [search]);
  const paymentKey = q.get("paymentKey");
  const orderId = q.get("orderId");
  const amount = q.get("amount");

  return (
    <Wrap>
      <Section>
        <Title>결제 성공</Title>
        <div>orderId: <code>{orderId}</code></div>
        <div>paymentKey: <code>{paymentKey}</code></div>
        <div>amount: <strong>{amount}</strong>원</div>
        <Hint>
          보안을 위해 서버에서 paymentKey로 Toss Payments Confirm API를 호출해 결제를 최종 승인하세요.
        </Hint>
        <UIGhostBtn to="/payments">결제 화면으로</UIGhostBtn>
      </Section>
    </Wrap>
  );
}

const Wrap = styled.div` display:grid; gap:12px; `;
const Hint = styled.div` color:#6b7280; font-size:12px; margin-top:8px; `;
