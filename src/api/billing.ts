import { fetchJSON } from "@/lib/fetcher";

// 토스 빌링키 발급 응답
export type TossBillingResponse = {
  mId: string;
  customerKey: string;
  authenticatedAt?: string;
  method?: string;
  billingKey: string;
  cardNumber?: string;
  cardCompany?: string;
  card?: {
    issuerCode?: string;
    acquirerCode?: string;
    number?: string;
    cardType?: string;
    ownerType?: string;
  };
};

// 토스 자동결제 승인 응답(주요 필드만 사용)
export type TossBillingPaymentResponse = {
  mId: string;
  paymentKey: string;
  orderId: string;
  orderName: string;
  status: string;
  approvedAt?: string;
  method?: string;
  totalAmount?: number;
  currency?: string;
  receipt?: { url?: string };
};

export async function apiIssueBillingKey(payload: { authKey: string; customerKey: string }) {
  return await fetchJSON<TossBillingResponse>("/api/payments/toss/billing/issue", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function apiPayWithBillingKey(
  billingKey: string,
  payload: {
    customerKey: string;
    amount: number;
    orderId: string;
    orderName: string;
    customerEmail?: string;
    customerName?: string;
    taxFreeAmount?: number;
    taxExemptionAmount?: number;
  }
) {
  return await fetchJSON<TossBillingPaymentResponse>(`/api/payments/toss/billing/${encodeURIComponent(billingKey)}/pay`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function apiDeleteBillingKey(billingKey: string) {
  return await fetchJSON<void>(`/api/payments/toss/billing/${encodeURIComponent(billingKey)}`, {
    method: "DELETE",
  });
}

export type SubscriptionDto = {
  id: number;
  academyId: number;
  planId: string;
  planName?: string;
  amountCents: number;
  currency: string;
  status: string;
  nextChargeAt?: string;
  lastChargeAt?: string;
  failCount?: number;
  cardCompany?: string;
  cardNumber?: string;
};

export async function apiUpsertSubscription(payload: {
  planId: string;
  planName: string;
  amountKrw: number;
  currency?: string;
  billingKey?: string;
  customerKey?: string;
  cardCompany?: string;
  cardNumber?: string;
}) {
  return await fetchJSON<SubscriptionDto>("/api/payments/toss/subscription", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function apiGetSubscription() {
  return await fetchJSON<SubscriptionDto | null>("/api/payments/toss/subscription");
}

export async function apiCancelSubscription() {
  return await fetchJSON<void>("/api/payments/toss/subscription", {
    method: "DELETE",
  });
}

export type TossClientKeyResponse = {
  clientKey: string;
  successUrl?: string | null;
  failUrl?: string | null;
  requireSeller?: boolean;
};

export async function apiGetTossClientKey() {
  return await fetchJSON<TossClientKeyResponse | null>("/api/payments/toss/client-key");
}
