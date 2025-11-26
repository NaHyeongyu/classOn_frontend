import { useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import InvoicePreview from "@/components/payments/InvoicePreview";

export default function PaymentRequest() {
  const { token } = useParams<{ token?: string }>();
  const [sp] = useSearchParams();
  const envCheckoutUrl =
    typeof import.meta.env.VITE_TOSS_TEST_CHECKOUT_URL === "string"
      ? import.meta.env.VITE_TOSS_TEST_CHECKOUT_URL.trim()
      : "";

  const fallback = useMemo(() => {
    const academyName = sp.get("academy") || sp.get("a") || undefined;
    const courseTitle = sp.get("course") || sp.get("c") || undefined;
    const studentName = sp.get("student") || sp.get("s") || undefined;
    const rawAmount = sp.get("amount") || sp.get("amt") || undefined;
    const checkoutUrl = (() => {
      const fromQuery = sp.get("checkoutUrl");
      if (fromQuery && fromQuery.trim()) {
        return fromQuery;
      }
      if (envCheckoutUrl) {
        return envCheckoutUrl;
      }
      return undefined;
    })();
    const amount = rawAmount ? Number(rawAmount) : undefined;
    return { academyName, courseTitle, studentName, amount, checkoutUrl };
  }, [sp, envCheckoutUrl]);

  return <InvoicePreview mode="guardian" token={token} fallback={fallback} variant="page" />;
}
