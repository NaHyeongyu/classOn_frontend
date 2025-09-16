import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { SectionCard as Section, TitleH3 as Title, PrimaryBtn as UIPrimaryBtn } from "../components/common/UI";
// Toss Payments Payment Widget integration (frontend part)
// - Set VITE_TOSS_CLIENT_KEY in your .env (test_ck_xxx for sandbox)
// - Recommended: implement server-side confirm API to finalize payment
export default function Payments() {
    const clientKey = import.meta.env.VITE_TOSS_CLIENT_KEY;
    const [amount, setAmount] = useState(1000);
    const [orderName, setOrderName] = useState("테스트 주문");
    const [ready, setReady] = useState(false);
    const widgetRef = useRef(null);
    const paymentMethodsRef = useRef(null);
    const agreementRef = useRef(null);
    // Stable customer key for Payment Widget (should be user ID in real apps)
    const customerKey = useMemo(() => {
        const k = localStorage.getItem("tp_customer_key");
        if (k)
            return k;
        const nk = `cust_${Math.random().toString(36).slice(2, 9)}`;
        localStorage.setItem("tp_customer_key", nk);
        return nk;
    }, []);
    useEffect(() => {
        // Load Toss Payments payment widget script lazily
        if (!clientKey)
            return; // show hint below
        const existing = document.querySelector("script[data-toss-widget]");
        if (existing)
            init();
        else {
            const s = document.createElement("script");
            s.src = "https://js.tosspayments.com/v1/payment-widget";
            s.async = true;
            s.dataset.tossWidget = "1";
            s.onload = () => init();
            s.onerror = () => console.error("[TossPayments] payment-widget load failed");
            document.body.appendChild(s);
        }
        function init() {
            try {
                // @ts-ignore - global provided by the script
                const paymentWidget = window.PaymentWidget?.(clientKey, customerKey);
                widgetRef.current = paymentWidget;
                if (paymentWidget && paymentMethodsRef.current && agreementRef.current) {
                    paymentWidget.renderPaymentMethods(paymentMethodsRef.current, { value: amount }, { variantKey: "DEFAULT" });
                    paymentWidget.renderAgreement(agreementRef.current);
                    setReady(true);
                }
            }
            catch (e) {
                console.error(e);
            }
        }
        // Re-render payment amount when it changes
        return () => { };
    }, [clientKey, customerKey]);
    useEffect(() => {
        if (!ready || !widgetRef.current || !paymentMethodsRef.current)
            return;
        try {
            widgetRef.current.updateAmount({ value: amount });
        }
        catch { }
    }, [amount, ready]);
    async function onRequestPayment() {
        if (!clientKey) {
            alert("VITE_TOSS_CLIENT_KEY가 설정되어 있지 않습니다.");
            return;
        }
        if (!widgetRef.current) {
            alert("결제 위젯 초기화 중입니다. 잠시 후 다시 시도해 주세요.");
            return;
        }
        const orderId = `order_${Date.now()}`;
        const origin = window.location.origin;
        try {
            await widgetRef.current.requestPayment({
                orderId,
                orderName: orderName || `주문 ${orderId}`,
                successUrl: `${origin}/payments/success`,
                failUrl: `${origin}/payments/fail`,
                amount: { value: amount },
                customerEmail: undefined,
                customerName: undefined,
            });
        }
        catch (e) {
            console.error(e);
        }
    }
    return (_jsxs(Wrap, { children: [_jsx(Header, { children: _jsxs("div", { children: [_jsx("h2", { children: "\uACB0\uC81C \uD14C\uC2A4\uD2B8" }), _jsx("p", { children: "\uD1A0\uC2A4\uD398\uC774\uBA3C\uCE20 \uACB0\uC81C\uC704\uC82F \uC5F0\uB3D9(\uD504\uB860\uD2B8) \uC0D8\uD50C" })] }) }), !clientKey && (_jsx(Hint, { children: ".env\uC5D0 VITE_TOSS_CLIENT_KEY\uB97C \uC124\uC815\uD574 \uC8FC\uC138\uC694. \uD14C\uC2A4\uD2B8 \uD0A4\uB294 \uB300\uC2DC\uBCF4\uB4DC\uC5D0\uC11C \uBC1C\uAE09\uB429\uB2C8\uB2E4." })), _jsxs(Section, { children: [_jsx(Title, { children: "\uC8FC\uBB38 \uC815\uBCF4" }), _jsxs(FormGrid, { children: [_jsxs("label", { children: [_jsx("small", { children: "\uC0C1\uD488\uBA85" }), _jsx("input", { value: orderName, onChange: (e) => setOrderName(e.target.value), placeholder: "\uC608: 9\uC6D4 \uC218\uAC15\uB8CC" })] }), _jsxs("label", { children: [_jsx("small", { children: "\uAE08\uC561(\uC6D0)" }), _jsx("input", { type: "number", value: amount, onChange: (e) => setAmount(Math.max(0, Number(e.target.value || 0))) })] })] })] }), _jsxs(Section, { children: [_jsx(Title, { children: "\uACB0\uC81C \uC218\uB2E8" }), _jsx(WidgetBox, { ref: paymentMethodsRef }), _jsx(AgreementBox, { ref: agreementRef }), _jsx(UIPrimaryBtn, { as: "button", onClick: onRequestPayment, style: { marginTop: 12 }, children: "\uACB0\uC81C\uD558\uAE30" }), _jsx(Hint, { children: "\uC2E4\uC81C \uACB0\uC81C \uC2B9\uC778 \uCC98\uB9AC\uB97C \uC704\uD574\uC11C\uB294 \uC11C\uBC84\uC5D0\uC11C paymentKey\uB85C Confirm API \uD638\uCD9C\uC774 \uD544\uC694\uD569\uB2C8\uB2E4." })] })] }));
}
const Wrap = styled.div ` display:grid; gap:12px; `;
const Header = styled.div ` display:grid; gap:6px; h2{margin:0; font-size:22px;} p{margin:0; color:#6b7280; font-size:13px;} `;
const FormGrid = styled.div ` display:grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap:12px; @media(max-width:800px){ grid-template-columns: 1fr; } label{ display:grid; gap:6px; } input{ height:40px; border:1px solid #e5e7eb; border-radius:10px; padding:0 12px; } small{ color:#6b7280; font-weight:700; }`;
const WidgetBox = styled.div ` min-height: 120px; `;
const AgreementBox = styled.div ` margin-top: 10px; `;
const Hint = styled.div ` color:#6b7280; font-size:12px; `;
