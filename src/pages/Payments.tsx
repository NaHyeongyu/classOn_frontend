import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { SectionCard as Section, TitleH3 as Title, PrimaryBtn as UIPrimaryBtn } from "../components/common/UI";

// Toss Payments Payment Widget integration (frontend part)
// - Set VITE_TOSS_CLIENT_KEY in your .env (test_ck_xxx for sandbox)
// - Recommended: implement server-side confirm API to finalize payment

export default function Payments() {
  const clientKey = import.meta.env.VITE_TOSS_CLIENT_KEY as string | undefined;
  const [amount, setAmount] = useState<number>(1000);
  const [orderName, setOrderName] = useState<string>("테스트 주문");
  const [ready, setReady] = useState(false);
  const widgetRef = useRef<any>(null);
  const paymentMethodsRef = useRef<HTMLDivElement | null>(null);
  const agreementRef = useRef<HTMLDivElement | null>(null);

  // Stable customer key for Payment Widget (should be user ID in real apps)
  const customerKey = useMemo(() => {
    const k = localStorage.getItem("tp_customer_key");
    if (k) return k;
    const nk = `cust_${Math.random().toString(36).slice(2, 9)}`;
    localStorage.setItem("tp_customer_key", nk);
    return nk;
  }, []);

  useEffect(() => {
    // Load Toss Payments payment widget script lazily
    if (!clientKey) return; // show hint below
    const existing = document.querySelector<HTMLScriptElement>("script[data-toss-widget]");
    if (existing) init();
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
      } catch (e) {
        console.error(e);
      }
    }
    // Re-render payment amount when it changes
    return () => { /* no-op */ };
  }, [clientKey, customerKey]);

  useEffect(() => {
    if (!ready || !widgetRef.current || !paymentMethodsRef.current) return;
    try {
      widgetRef.current.updateAmount({ value: amount });
    } catch {}
  }, [amount, ready]);

  async function onRequestPayment() {
    if (!clientKey) { alert("VITE_TOSS_CLIENT_KEY가 설정되어 있지 않습니다."); return; }
    if (!widgetRef.current) { alert("결제 위젯 초기화 중입니다. 잠시 후 다시 시도해 주세요."); return; }
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
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <Wrap>
      <Header>
        <div>
          <h2>결제 테스트</h2>
          <p>토스페이먼츠 결제위젯 연동(프론트) 샘플</p>
        </div>
      </Header>

      {!clientKey && (
        <Hint>
          .env에 VITE_TOSS_CLIENT_KEY를 설정해 주세요. 테스트 키는 대시보드에서 발급됩니다.
        </Hint>
      )}

      <Section>
        <Title>주문 정보</Title>
        <FormGrid>
          <label>
            <small>상품명</small>
            <input value={orderName} onChange={(e)=>setOrderName(e.target.value)} placeholder="예: 9월 수강료" />
          </label>
          <label>
            <small>금액(원)</small>
            <input type="number" value={amount} onChange={(e)=>setAmount(Math.max(0, Number(e.target.value||0)))} />
          </label>
        </FormGrid>
      </Section>

      <Section>
        <Title>결제 수단</Title>
        <WidgetBox ref={paymentMethodsRef} />
        <AgreementBox ref={agreementRef} />
        <UIPrimaryBtn as={"button" as any} onClick={onRequestPayment} style={{ marginTop: 12 }}>결제하기</UIPrimaryBtn>
        <Hint>실제 결제 승인 처리를 위해서는 서버에서 paymentKey로 Confirm API 호출이 필요합니다.</Hint>
      </Section>
    </Wrap>
  );
}

const Wrap = styled.div` display:grid; gap:12px; `;
const Header = styled.div` display:grid; gap:6px; h2{margin:0; font-size:22px;} p{margin:0; color:#6b7280; font-size:13px;} `;
const FormGrid = styled.div` display:grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap:12px; @media(max-width:800px){ grid-template-columns: 1fr; } label{ display:grid; gap:6px; } input{ height:40px; border:1px solid #e5e7eb; border-radius:10px; padding:0 12px; } small{ color:#6b7280; font-weight:700; }`;
const WidgetBox = styled.div` min-height: 120px; `;
const AgreementBox = styled.div` margin-top: 10px; `;
const Hint = styled.div` color:#6b7280; font-size:12px; `;
