import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { SectionCard as Section, TitleH3 as Title, GhostBtn as UIGhostBtn } from "../components/common/UI";

export default function PaymentFail() {
  const { search } = useLocation();
  const q = useMemo(() => new URLSearchParams(search), [search]);
  const code = q.get("code");
  const message = q.get("message");
  const orderId = q.get("orderId");

  return (
    <Wrap>
      <Section>
        <Title>결제 실패</Title>
        <div>orderId: <code>{orderId}</code></div>
        <div>code: <code>{code}</code></div>
        <div>message: {message}</div>
        <UIGhostBtn to="/payments" style={{ marginTop: 8 }}>돌아가기</UIGhostBtn>
      </Section>
    </Wrap>
  );
}

const Wrap = styled.div` display:grid; gap:12px; `;

