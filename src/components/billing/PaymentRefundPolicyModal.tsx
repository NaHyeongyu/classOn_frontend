import Modal from "@/components/common/Modal";
import styled from "styled-components";
import { cleanPolicyText, PAYMENT_REFUND_POLICY_TEXT } from "@/lib/policyText";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function PaymentRefundPolicyModal({ open, onClose }: Props) {
  return (
    <Modal open={open} onClose={onClose} title="결제/환불 정책" maxWidth={860}>
      <Body>
        <pre>{cleanPolicyText(PAYMENT_REFUND_POLICY_TEXT)}</pre>
      </Body>
    </Modal>
  );
}

const Body = styled.div`
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.surfaceMuted};
  border-radius: ${(p) => p.theme.radii.md};
  padding: 12px 14px;
  max-height: min(70vh, 620px);
  overflow: auto;
  pre {
    margin: 0;
    white-space: pre-wrap;
    font-family: inherit;
    font-size: 13px;
    line-height: 1.65;
    color: ${(p) => p.theme.colors.text};
  }
`;

