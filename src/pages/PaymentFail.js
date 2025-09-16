import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    return (_jsx(Wrap, { children: _jsxs(Section, { children: [_jsx(Title, { children: "\uACB0\uC81C \uC2E4\uD328" }), _jsxs("div", { children: ["orderId: ", _jsx("code", { children: orderId })] }), _jsxs("div", { children: ["code: ", _jsx("code", { children: code })] }), _jsxs("div", { children: ["message: ", message] }), _jsx(UIGhostBtn, { to: "/payments", style: { marginTop: 8 }, children: "\uB3CC\uC544\uAC00\uAE30" })] }) }));
}
const Wrap = styled.div ` display:grid; gap:12px; `;
