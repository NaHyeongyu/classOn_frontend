import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    return (_jsx(Wrap, { children: _jsxs(Section, { children: [_jsx(Title, { children: "\uACB0\uC81C \uC131\uACF5" }), _jsxs("div", { children: ["orderId: ", _jsx("code", { children: orderId })] }), _jsxs("div", { children: ["paymentKey: ", _jsx("code", { children: paymentKey })] }), _jsxs("div", { children: ["amount: ", _jsx("strong", { children: amount }), "\uC6D0"] }), _jsx(Hint, { children: "\uBCF4\uC548\uC744 \uC704\uD574 \uC11C\uBC84\uC5D0\uC11C paymentKey\uB85C Toss Payments Confirm API\uB97C \uD638\uCD9C\uD574 \uACB0\uC81C\uB97C \uCD5C\uC885 \uC2B9\uC778\uD558\uC138\uC694." }), _jsx(UIGhostBtn, { to: "/payments", children: "\uACB0\uC81C \uD654\uBA74\uC73C\uB85C" })] }) }));
}
const Wrap = styled.div ` display:grid; gap:12px; `;
const Hint = styled.div ` color:#6b7280; font-size:12px; margin-top:8px; `;
